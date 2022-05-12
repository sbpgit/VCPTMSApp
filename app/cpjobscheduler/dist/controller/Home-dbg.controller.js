/*global location*/
sap.ui.define(
    [
      "cpapp/cpjobscheduler/controller/BaseController",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/routing/History",
      "sap/ui/core/routing/HashChanger",
      "sap/m/MessageToast",
      "sap/ui/Device",
    ],
    function (
      BaseController,
      JSONModel,
      History,
      HashChanger,
      MessageToast,
      Device
    ) {
      "use strict";
      var that, oGModel;
  
      return BaseController.extend("cpapp.cpjobscheduler.controller.Prediction", {
        
        onInit: function () {
          that = this;
          this.listModel = new JSONModel();
          this.JobLogsModel = new JSONModel();
          this.JobDataModel = new JSONModel();
          this.ScheLogModel = new JSONModel();
  
          this.listModel.setSizeLimit(2000);
          this.JobLogsModel.setSizeLimit(1000);
          this.JobDataModel.setSizeLimit(1000);
          this.ScheLogModel.setSizeLimit(1000);
  
          if (!this._valueHelpDialogJobData) {
              this._valueHelpDialogJobData = sap.ui.xmlfragment(
                "cpapp.cpjobscheduler.view.JobData",
                this
              );
              this.getView().addDependent(this._valueHelpDialogJobData);
            }
  
            if (!this._valueHelpDialogUpdateJob) {
              this._valueHelpDialogUpdateJob = sap.ui.xmlfragment(
                "cpapp.cpjobscheduler.view.UpdateJobDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogUpdateJob);
            }

            if (!this._valueHelpDialogScheLog) {
                this._valueHelpDialogScheLog = sap.ui.xmlfragment(
                  "cpapp.cpjobscheduler.view.ScheLog",
                  this
                );
                this.getView().addDependent(this._valueHelpDialogScheLog);
              }
        },
  
        onAfterRendering: function () {
          oGModel = this.getModel("oGModel");
          that.oList = that.byId("jobList");
          that.oList.removeSelections(true);
  
          var nowH = new Date();
          //past 15 days selected date
          var oDateL = new Date(nowH.getFullYear(), nowH.getMonth(), nowH.getDate() - 15);
  
          this.byId("idDateRange").setDateValue(oDateL);
          this.byId("idDateRange").setSecondDateValue(nowH);
  
          that.byId("JobPanel").setExpanded(true);
          that.byId("jobDetailsPanel").setExpanded(false);
          sap.ui.core.BusyIndicator.show();
          that.getModel("JModel").callFunction("/lreadJobs", {
            method: "GET",
          //   urlParameters: {
          //     startTime: dFromDate,
          //     endTime: dToDate
          //   },
            success: function (oData) {
              sap.ui.core.BusyIndicator.hide();
              that.listModel.setData({
                results: oData.lreadJobs.value,
              });
              that.oList.setModel(that.listModel);
            },
            error: function (error) {
              sap.ui.core.BusyIndicator.hide();
              MessageToast.show("Failed to get data");
            },
          });
        },
  
        onPanelExpand:function(){
          var panel = that.byId("JobPanel").getExpanded();
  
          if(panel === true){
              that.byId("jobList").removeSelections(true);
          }
  
        },
  
        onCreateJob: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("CreateJob", {}, true);
        },
  
        onOpenJob: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("OpenJob", {}, true);
        },
  
        handleDateChange: function (oEvent) {
          var dDate = oEvent.getParameters().newValue;
          dDate = dDate.split(" To ");
          var dFromDate = dDate[0],
            dToDate = dDate[0];
  
          that.getModel("JModel").callFunction("/lreadJobs", {
              method: "GET",
              urlParameters: {
                startTime: dFromDate,
                endTime: dToDate
              },
              success: function (oData) {
                that.listModel.setData({
                  results: oData.results,
                });
                that.oList.setModel(that.listModel);
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Failed to get data");
              },
            });
        },
  
      //   onhandlePress:function(oEvent){
      //     oGModel = this.getModel("oGModel");
      //     var oJobId = oEvent.getParameter("listItem").getCells()[0].getTitle();
          onJobLogs:function(oEvent){
          oGModel = this.getModel("oGModel");
          var oJobId = oEvent.getSource().getParent().getCells()[0].getTitle();
  
          oGModel.setProperty("/SelJob", oJobId);
  
          that.getModel("JModel").callFunction("/lreadJobSchedules", {
              method: "GET",
              urlParameters: {
                  jobId: oJobId
              },
              success: function (oData) {
                  oGModel.setProperty("/scheduleId", oData.lreadJobSchedules.value[0].scheduleId);
                  that.JobDetails();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Failed to get data");
              },
            });
  
        },
  
  
      //   JobDetails:function(){
      //     var oSelJobId = oGModel.getProperty("/SelJob"),
      //         oSelScheduleId = oGModel.getProperty("/scheduleId");
  
      onhandlePress:function(oEvent){
          oGModel = this.getModel("oGModel");
          var oJobId = oEvent.getParameter("listItem").getCells()[0].getTitle();
  
          oGModel.setProperty("/newSch", "");
          oGModel.setProperty("/UpdateSch", "");
          oGModel.setProperty("/Jobdata", oEvent.getParameter("listItem").getBindingContext().getObject());
  
              // that.getModel("JModel").callFunction("/lreadJobRunLogs", {
                  that.getModel("JModel").callFunction("/lreadJobDetails", {
                  method: "GET",
                  urlParameters: {
                      jobId: oJobId,
                      displaySchedules:true
                      // scheduleId:oSelScheduleId,
                      // page_size: "5",
                      // offset: "1"
                  },
                  success: function (oData) {
                    // if(!oData.lreadJobDetails.value.action.includes("DemandQty")){
                        oData.lreadJobDetails.value.schedules.forEach(function (row) {
                            if(!oData.lreadJobDetails.value.action.includes("DemandQty")){
                                if(row.time){
                            var dDate = row.time.split("T"),
                                tTime = dDate[1].split(".")[0];
    
                                row.time = dDate[0] + " " + tTime ; 
                                }
                            } else {
                                if(row.time){
                                var dDate = row.time.split("+");
                                row.time = dDate[0];
                                }
                            }
    
                            }, that);
                        // }


                      var aData = oData.lreadJobDetails.value.schedules;
                      that.JobLogsModel.setData({
                          results: aData,
                        });
                        that.byId("idJobLogs").setModel(that.JobLogsModel);
  
                    //   var aJobDetails = oData.lreadJobDetails.value.schedules[0].data;
                    var aJobDetails = oData.lreadJobDetails.value.schedules;
  
                    //   aJobDetails = $.parseJSON(aJobDetails);
                      oGModel.setProperty("/aJobDetails", aJobDetails);

                    //   oGModel.setProperty("/aJobDetails", oData.lreadJobDetails.value.schedules);
                      
                        if(oData.lreadJobDetails.value.action.includes("Models")){
                          oGModel.setProperty("/JobType", "M");
                        } else if(oData.lreadJobDetails.value.action.includes("Predictions")){
                          oGModel.setProperty("/JobType", "P");
                        } else if(oData.lreadJobDetails.value.action.includes("DemandQty")){
                          oGModel.setProperty("/JobType", "I");
                        } else if(oData.lreadJobDetails.value.action.includes("CharPlan")){
                          oGModel.setProperty("/JobType", "T");
                        }



                        // if(aJobDetails[0].profile !== undefined){
                        //   oGModel.setProperty("/JobType", "M");
                        // } else if(aJobDetails[0].version !== undefined){
                        //   oGModel.setProperty("/JobType", "P");
                        // }

                        // if(aJobDetails.vcRulesList[0].profile !== undefined){
                        //     oGModel.setProperty("/JobType", "M");
                        //   } else if(aJobDetails.vcRulesList[0].version !== undefined){
                        //     oGModel.setProperty("/JobType", "P");
                        //   }
  
  
                        that.byId("JobPanel").setExpanded(false);
                        that.byId("jobDetailsPanel").setExpanded(true);
                      // that._valueHelpDialogJobLogs.open();
                  },
                  error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get data");
                  },
                });
        },
  
        onScheData:function(oEvent){
        //   var aData = oGModel.getProperty("/aJobDetails").vcRulesList;
          var aData = oGModel.getProperty("/aJobDetails"),
                ScheData=[];

          var scheduleId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId;
            
          for(var i=0; i<aData.length; i++){
                if(scheduleId === aData[i].scheduleId){
                    if(oGModel.getProperty("/JobType") === "I"){
                      var data  = $.parseJSON(aData[i].data);
                      var aIData = {
                            Location: data.LOCATION_ID,
                            Product: data.PRODUCT_ID,
                            scenario: data.SCENARIO,
                            version: data.VERSION,
                        };
                        ScheData.push(aIData);
                    } else {
                        ScheData = aData[i].data;
                        ScheData = $.parseJSON(ScheData);
                        ScheData = ScheData.vcRulesList;
                    }
                }
          }
          
  
          that.JobDataModel.setData({
              results: ScheData,
            });
            sap.ui.getCore().byId("idJobData").setModel(that.JobDataModel);

            if(oGModel.getProperty("/JobType") === "M"){
                sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
                sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
            } else if(oGModel.getProperty("/JobType") === "P"){
                sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
            } else if(oGModel.getProperty("/JobType") === "I"){
                sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
                sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
                sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
                sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
            }
  
          that._valueHelpDialogJobData.open();
  
        },

        onSchestatus:function(oEvent){
            var oJobId = oGModel.getProperty("/Jobdata").jobId,
                oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId;

                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").callFunction("/lreadJobRunLogs", {
                    method: "GET",
                    urlParameters: {
                        jobId: oJobId,
                        scheduleId: oScheId,
                        page_size : 50,
                        offset : 0

                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                            that.ScheLogModel.setData({
                                results: oData.lreadJobRunLogs.value,
                            });
                            sap.ui.getCore().byId("idScheLogData").setModel(that.ScheLogModel);
                            that._valueHelpDialogScheLog.open();
                    },
                    error: function (error) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to get data");
                    },
                  });

        },

        onScheLogClose:function(){
            that._valueHelpDialogScheLog.close();
        },
  
        onjobClose:function(){
          that._valueHelpDialogJobData.close();
        },
  
  
        onAddSchedule:function(){
  
          oGModel.setProperty("/newSch", "X");
          that.onCreateJob();
  
        }, 
  
        onJobDelete:function(oEvent){
          var oJobId = oEvent.getSource().getParent().getBindingContext().getObject().jobId;
  
          oGModel.setProperty("/DeleteJob", oJobId);
  
          that.getModel("JModel").callFunction("/ldeleteJob", {
              method: "GET",
              urlParameters: {
                  jobId : oJobId
                  },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                if(oData.ldeleteJob.value.includes("true")){
                sap.m.MessageToast.show(oGModel.getProperty("/DeleteJob") + ": Job Deleted");
                }
                that.onAfterRendering();
                
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Deletion failed");
              },
            });
        },
  
        onUpdateJob:function(oEvent){
          var oJobId = oEvent.getSource().getParent().getBindingContext().getObject(),
              bActive, dStartTime, dEndTime;
              oGModel.setProperty("/JobDetailstoUpdate", oJobId);
              oGModel.setProperty("/updatejob", oJobId.jobId);
              oGModel.setProperty("/updatejobDesc", oJobId.description);
              if(oJobId.active === true){
                  bActive = "T";
              } else if(oJobId.active === false){
                  bActive = "F";
              }
              sap.ui.getCore().byId("idUJActive").setSelectedKey(bActive);
  
              dStartTime = new Date(oJobId.startTime);
              dEndTime = new Date(oJobId.endTime);
              sap.ui.getCore().byId("idUJSTime").setDateValue(dStartTime);
              sap.ui.getCore().byId("idUJETime").setDateValue(dEndTime);
  
              this._valueHelpDialogUpdateJob.open();
        },
  
        onUpdateJobClose:function(){
          this._valueHelpDialogUpdateJob.close();
  
        },
  
        onJobUpdateSave:function(){
          var aSelJonDetails = oGModel.getProperty("/JobDetailstoUpdate");
          var bActive = sap.ui.getCore().byId("idUJActive").getSelectedKey(),
              dUPSdate = sap.ui.getCore().byId("idUJSTime").getDateValue(),
              dUJEdate = sap.ui.getCore().byId("idUJETime").getDateValue(),
              tUJStime, tUJEtime,
              oJobid = sap.ui.getCore().byId("idUJob").getValue(),
              oJobDesc = sap.ui.getCore().byId("idUJDesc").getValue(),
              action = aSelJonDetails.action,
              name = aSelJonDetails.name;
  
  
              dUPSdate = dUPSdate.toISOString().split("T");
              tUJStime = dUPSdate[1].split(":");
              dUJEdate = dUJEdate.toISOString().split("T");
              tUJEtime = dUJEdate[1].split(":");
  
              dUPSdate = dUPSdate[0] + " " + tUJStime[0] + ":" + tUJStime[1] + " " + "+0000";
              dUJEdate = dUJEdate[0] + " " + tUJEtime[0] + ":" + tUJEtime[1] + " " + "+0000";
  
                  if(bActive === "T"){
                      bActive = true;
                  } else if(bActive === "F"){
                      bActive = false;
                  }
  
                  var finalList = {
                      jobId:oJobid,
                      name:name,
                      description:oJobDesc,
                      action:action,
                      httpMethod: "POST",
                      active:bActive,
                      startTime:dUPSdate,
                      endTime:dUJEdate,
                              
                  }
  
              that.getModel("JModel").callFunction("/lupdateJob", {
                  method: "GET",
                  urlParameters: {
                      jobDetails: JSON.stringify(finalList)
                      },
                  success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  if(oData.lupdateJob.value.includes("true")){
                      sap.m.MessageToast.show(oGModel.getProperty("/JobDetailstoUpdate").jobId + ": Job Updated");
                      }
                  that._valueHelpDialogUpdateJob.close();
                  that.onAfterRendering();
                  },
                  error: function (error) {
                  sap.ui.core.BusyIndicator.hide();
                  that.onCreateJobClose();
                  sap.m.MessageToast.show("Failed to update job details");
                  },
              });
  
  
        },
  
        onScheDelete:function(oEvent){
          var oJobId = oGModel.getProperty("/Jobdata").jobId,
              oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId;
  
          oGModel.setProperty("/DeleteSchJob", oJobId);
          oGModel.setProperty("/DeleteSch", oScheId);
  
                      var finalList = {
                          jobId : oJobId,
                          scheduleId: oScheId
                      }
  
  
          that.getModel("JModel").callFunction("/ldeleteMLJobSchedule", {
              method: "GET",
                  urlParameters: {
                      scheduleDetails: JSON.stringify(finalList)
                      },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                if(oData.ldeleteMLJobSchedule.value.includes("true")){
                sap.m.MessageToast.show(oGModel.getProperty("/DeleteSch") + ": Schedule Deleted");
                }
                that.onAfterRendering();
                
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Deletion failed");
              },
            });
        },


        onScheUpdate:function(oEvent){
            var oJobId = oGModel.getProperty("/Jobdata").jobId,
              oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId,

              aData = oGModel.getProperty("/aJobDetails");

              for(var i =0; i<aData.length; i++){
                  if(oScheId === aData[i].scheduleId){
                    oGModel.setProperty("/aScheUpdate", aData[i]);
                  }
              }

              oGModel.setProperty("/UpdateSch", "X");
                that.onCreateJob();


        },
        
  
  
  
  
  
  
  
  
      });
    }
  );
  