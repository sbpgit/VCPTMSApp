sap.ui.define(
  [
    "cpapp/cpjobscheduler/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
  ],
  function (
    BaseController,
    MessageToast,
    MessageBox,
    JSONModel,
    Filter,
    FilterOperator,
    Device,
    Fragment
  ) {
    "use strict";
    var that, oGModel;
    return BaseController.extend("cpapp.cpjobscheduler.controller.ItemDetail", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        this.bus = sap.ui.getCore().getEventBus();
        // Declaring JSON Models and size limit
        this.JobLogsModel = new JSONModel();
          this.JobDataModel = new JSONModel();
          this.ScheLogModel = new JSONModel();
          this.ScheRunLogModel = new JSONModel();

          this.JobLogsModel.setSizeLimit(1000);
          this.JobDataModel.setSizeLimit(1000);
          this.ScheLogModel.setSizeLimit(1000);
          this.ScheRunLogModel.setSizeLimit(1000);

          

          

          

        oGModel = that.getOwnerComponent().getModel("oGModel");
      },

      

      /**
       * Called after the view has been rendered.
       * Calls the service to get Data.
       */
      onAfterRendering: function () {
        oGModel = that.getOwnerComponent().getModel("oGModel");
        var oJobId = oGModel.getProperty("/jobId");
        
          // Setting data to global models
          oGModel.setProperty("/newSch", "");
          oGModel.setProperty("/UpdateSch", "");
          oGModel.setProperty("/flagcron", "");
          oGModel.setProperty("/flagonetime", "");
          
          // Calling service to get the Job details
          that.getModel("JModel").callFunction("/readJobDetails", {
            method: "GET",
            urlParameters: {
              jobId: oJobId,
              displaySchedules: true,
            },
            success: function (oData) {
              // Changing the Datetime stamp
              oData.readJobDetails.schedules.forEach(function (row) {
                if (!oData.readJobDetails.action.includes("DemandQty")) {
                  if (row.time) {
                    var dDate = row.time.split("T"),
                      tTime = dDate[1].split(".")[0];

                    row.time = dDate[0] + " " + tTime;
                  }
                } else {
                  if (row.time) {
                    var dDate = row.time.split("+");
                    row.time = dDate[0];
                  }
                }
              }, that);

              

              var aData = oData.readJobDetails.schedules;
              if(aData.length){
                    if(aData[0].type === "recurring"){
                        oGModel.setProperty("/flagcron", "X");
                    } else if(aData[0].type === "one-time"){
                        oGModel.setProperty("/flagonetime", "X");
                    }
                }

              if(aData.length){
              that.JobLogsModel.setData({
                results: aData,
              });
            } else {
                that.JobLogsModel.setData({
                    results: [],
                  });
                that.ScheLogModel.setData({
                    statusresults: [],
                  });
                that.byId("idScheLogData").setModel(that.ScheLogModel);
                that.ScheRunLogModel.setData({
                    results: [],
                  });
                that.byId("idScheRunLogData").setModel(that.ScheRunLogModel);
            }
              that.byId("idJobLogs").setModel(that.JobLogsModel);
              var aJobDetails = oData.readJobDetails.schedules;

              // Setting Job type to global model based on Job action
              oGModel.setProperty("/aJobDetails", aJobDetails);
              if (oData.readJobDetails.action.includes("Models")) {
                oGModel.setProperty("/JobType", "M");
              } else if (oData.readJobDetails.action.includes("Predictions")) {
                oGModel.setProperty("/JobType", "P");
              } else if(oData.readJobDetails.action.includes("/catalog/") && oData.readJobDetails.action.split("catalog/")[1] === "generateTimeseries") {
                oGModel.setProperty("/JobType", "T");
              } else if(oData.readJobDetails.action.includes("/catalog/") && oData.readJobDetails.action.split("catalog/")[1] === "generateTimeseriesF") {
                oGModel.setProperty("/JobType", "F");
              } else if (oData.readJobDetails.action.includes("sdi")) {
                oGModel.setProperty("/JobType", "S");
                var service = oGModel.getProperty("/Jobdata").action.split("/");
                var length = service.length - 1;
                service = service[length];
                oGModel.setProperty("/IBPService", service);
              // 20-09-2022
            } else if(oData.readJobDetails.action.includes("genFullConfigDemand") ){
                oGModel.setProperty("/JobType", "D");
            } else if(oData.readJobDetails.action.includes("exportIBPAsmreq") ){
                oGModel.setProperty("/JobType", "A");
            } else if(oData.readJobDetails.action.includes("genUniqueID") ){
                oGModel.setProperty("/JobType", "O");
            } else if(oData.readJobDetails.action.includes("ibpimport-srv")) {
                // 20-09-2022
                if(oData.readJobDetails.action.includes("generateFDemandQty")){ 
                    oGModel.setProperty("/JobType", "I");
                } else {
                    oGModel.setProperty("/JobType", "E");
                }
                
                var service = oGModel.getProperty("/Jobdata").action.split("/");
                var length = service.length - 1;
                service = service[length];
                oGModel.setProperty("/IBPService", service);
              }

              that.getView().byId("idJobLogs").setSelectedItem(that.getView().byId("idJobLogs").getItems()[0], true);
              if(aData.length){

                that.onScheduleClick();
              }

            },
            error: function (error) {
              sap.ui.core.BusyIndicator.hide();
              MessageToast.show("Failed to get data");
            },
          });
      },

      /**
         * This function is called when click on Schedule Data button to get the data.
         * @param {object} oEvent -the event information.
         */
        onScheData: function (oEvent) {

            if (!this._valueHelpDialogJobData) {
                this._valueHelpDialogJobData = sap.ui.xmlfragment(
                  "cpapp.cpjobscheduler.view.JobData",
                  this
                );
                this.getView().addDependent(this._valueHelpDialogJobData);
              }


            var aData = oGModel.getProperty("/aJobDetails"),
              ScheData = [];
            // Getting the schedule Id for the selected Job
            var scheduleId = oEvent
            .getSource()
            .getParent()
            .getBindingContext()
            .getObject().scheduleId;
            // 04-10-2022
            var jobType = oGModel.getProperty("/JobType");
            // 04-10-2022
            // Looping through the data to get the data for IBP Integration and SDI Integration
            for (var i = 0; i < aData.length; i++) {
              if (scheduleId === aData[i].scheduleId) {
                if (jobType === "I" || jobType === "E" || jobType === "S" ) {
                  var data = $.parseJSON(aData[i].data);
                  var aIData = {
                    Location: data.LOCATION_ID,
                    Product: data.PRODUCT_ID,
                    scenario: data.SCENARIO,
                    version: data.VERSION,
                    fromdate: data.FROMDATE,
                    todate: data.TODATE,
                    CUSTOMER_GROUP: data.CUSTOMER_GROUP,
                  };
                  ScheData.push(aIData);
                   // 04-10-2022
                  } else if(jobType === "D" || jobType === "A" || jobType === "O" || jobType === "T"){
                      var data = $.parseJSON(aData[i].data);
                      var aIData = {
                          Location: data.LOCATION_ID,
                          Product: data.PRODUCT_ID,
                      };
                      ScheData.push(aIData);
                  // 04-10-2022
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
              // 22-09-2022
                  var jobType = oGModel.getProperty("/JobType");
                  // 22-09-2022

              sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
              sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
            // Based on Job type changing the visibility the columns
            if (oGModel.getProperty("/JobType") === "M") {
              sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
            } else if (oGModel.getProperty("/JobType") === "P") {
              sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
        //     } else if (oGModel.getProperty("/JobType") === "T") {
        //       sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
        //     } else if (oGModel.getProperty("/JobType") === "F") {
        //       sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
        //     } else if (oGModel.getProperty("/JobType") === "I" || oGModel.getProperty("/JobType") === "E") {
        //       sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
        //     // 22-09-2022
        //   } else if (jobType === "D" || jobType === "A" || jobType === "O") {
        //       sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
        //       sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
          }
          // 22-09-2022
  
            if (oGModel.getProperty("/JobType") !== "I" && oGModel.getProperty("/JobType") !== "S" ) {
              that._valueHelpDialogJobData.open();
            } else {
              var oActionType = oGModel.getProperty("/IBPService");
              var iCount = 0;
  
              if (oActionType === "generateFDemandQty" || oActionType === "generateFCharPlan" ) {
                sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
              //   sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
              } else if (oActionType === "exportIBPLocation" || oActionType === "exportIBPCustomer" ||
                         oActionType.includes("ImportECC")   || oActionType.includes("ImportCuvtabInd") ) {
                MessageToast.show( "There is no schedule data to display for the selected job type" );
                iCount = 1;
              } else if (oActionType === "exportIBPMasterProd") {
                sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
              } else if (oActionType === "exportIBPClass") {
                sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(true);
              } else if (oActionType === "exportIBPSalesTrans") {
                sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(true);
              } else if (oActionType === "exportIBPSalesConfig") {
                sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(true);
              } else if (oActionType === "exportComponentReq" || oActionType === "exportActCompDemand") {
                sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);
                sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(true);
            //   } else if (oActionType === "exportActCompDemand") {
            //     sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
            //     sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
            //     sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);
            //     sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(true);
              
              // 22-09-2022
          } else if (oActionType === "exportIBPCIR") {
              sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
              sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
          }
          // 22-09-2022
              if (iCount === 0) {
                that._valueHelpDialogJobData.open();
              }
            }
          },
  
          /**
           * This function is called when click on status button to get the job run logs.
           * @param {object} oEvent -the event information.
           */
          onScheduleClick: function (oEvent) {
            // if (!this._valueHelpDialogScheLog) {
            //     this._valueHelpDialogScheLog = sap.ui.xmlfragment(
            //       "cpapp.cpjobscheduler.view.ScheLog",
            //       this
            //     );
            //     this.getView().addDependent(this._valueHelpDialogScheLog);
            //   }

            var oJobId = oGModel.getProperty("/Jobdata").jobId,
            //   oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId;
            oScheId = this.byId("idJobLogs").getSelectedItems()[0].getBindingContext().getObject().scheduleId;
  
            sap.ui.core.BusyIndicator.show();
            that.getModel("JModel").callFunction("/readJobRunLogs", {
              method: "GET",
              urlParameters: {
                jobId: oJobId,
                scheduleId: oScheId,
                page_size: 50,
                offset: 0,
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                that.ScheLogModel.setData({
                  statusresults: oData.results,
                });
                that.byId("idScheLogData").setModel(that.ScheLogModel);

                that.getView().byId("idScheLogData").setSelectedItem(that.getView().byId("idScheLogData").getItems()[0], true);
                that.LogData = oData.results;
                if(oData.results.length){
                that.onRunlogs();
                }
                // that._valueHelpDialogScheLog.open();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Failed to get data");
              },
            });
          },

          /**
         * Called when it routes to create job page.
         * @param {object} oEvent -the event information.
         */
        onCreateJob: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("CreateJob", {}, true);
          },
  
          /**
           * Called when 'Close/Cancel' button in any dialog is pressed.
           */
        //   onScheLogClose: function () {
        //     that._valueHelpDialogScheLog.close();
        //   },
  
          /**
           * Called when 'Close/Cancel' button in any dialog is pressed.
           */
          onjobClose: function () {
            that._valueHelpDialogJobData.close();
          },
  
          /**
           * This function is called when click on Add Schedule button to add the new schedule to the existing Job.
           */
          onAddSchedule: function () {
            oGModel.setProperty("/newSch", "X");
            that.onCreateJob();
          },

          /**
         * This function is called when click on delete button to delete the schedule.
         * @param {object} oEvent -the event information.
         */
        onScheDelete: function (oEvent) {
            var oJobId = oGModel.getProperty("/Jobdata").jobId,
              oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId;
  
            oGModel.setProperty("/DeleteSchJob", oJobId);
            oGModel.setProperty("/DeleteSch", oScheId);
  
            var finalList = {
              jobId: oJobId,
              scheduleId: oScheId,
            };
  
            that.getModel("JModel").callFunction("/deleteMLJobSchedule", {
              method: "GET",
              urlParameters: {
                scheduleDetails: JSON.stringify(finalList),
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                if (oData.deleteMLJobSchedule.includes("true")) {
                  sap.m.MessageToast.show(
                    oGModel.getProperty("/DeleteSch") + ": Schedule Deleted"
                  );
                }
                // Calling funtion to get the updated data
                that.onAfterRendering();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Deletion failed");
              },
            });
          },
  
          /**
           * This function is called when click on schedule update to update the schedule data.
           * @param {object} oEvent -the event information.
           */
          onScheUpdate: function (oEvent) {
            var oJobId = oGModel.getProperty("/Jobdata").jobId,
              oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId,
              aData = oGModel.getProperty("/aJobDetails");
  
            for (var i = 0; i < aData.length; i++) {
              if (oScheId === aData[i].scheduleId) {
                oGModel.setProperty("/aScheUpdate", aData[i]);
              }
            }
  
            oGModel.setProperty("/UpdateSch", "X");
            that.onCreateJob();
          },
  
          /**
           * This function is called when click on schedule run logs.
           * @param {object} oEvent -the event information.
           */
          onRunlogs:function(oEvent){
            // if (!this._valueHelpDialogScheRunLog) {
            //     this._valueHelpDialogScheRunLog = sap.ui.xmlfragment(
            //       "cpapp.cpjobscheduler.view.RunLogData",
            //       this
            //     );
            //     this.getView().addDependent(this._valueHelpDialogScheRunLog);
            //   }
              var oJobId = oGModel.getProperty("/Jobdata").jobId,
                  aData = this.byId("idScheLogData").getSelectedItems()[0].getBindingContext().getObject();

              var aLogData = that.LogData;
              this.ScheRunLogModel = new JSONModel();

                     that.runLog = $.parseJSON(aData.runText);
                  
                  that.ScheRunLogModel.setData({
                      results: that.runLog,
                    });
                    that.byId("idScheRunLogData").setModel(that.ScheRunLogModel);


  
            //   // Calling service to get the Job details
            // that.getModel("JModel").callFunction("/readJobRunLogs", {
            //   method: "GET",
            //   urlParameters: {
            //       jobId: oJobId,
            //       scheduleId: oScheId,
            //       page_size: 50,
            //       offset: 0,
            //   },
            //   success: function (oData) {
            //       that.runLog = $.parseJSON(oData.results[0].runText);
                  
            //       that.ScheRunLogModel.setData({
            //           results: that.runLog,
            //         });
            //         sap.ui.getCore().byId("idScheRunLogData").setModel(that.ScheRunLogModel);
            //         that._valueHelpDialogScheRunLog.open();
            //   },
            //   error: function (error) {
            //     sap.ui.core.BusyIndicator.hide();
            //     MessageToast.show("Failed to get data");
            //   },
            // });
  
          },
  
          /**
           * Called when 'Close/Cancel' button in any dialog is pressed.
           */
          onScheRunLogClose:function(){
              that._valueHelpDialogScheRunLog.close();
          }




    });
  }
);
