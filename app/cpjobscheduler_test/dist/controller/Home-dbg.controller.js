/*global location*/
sap.ui.define(
  [
    "cpapp/cpjobschedulertest/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/routing/HashChanger",
    "sap/m/MessageToast",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    BaseController,
    JSONModel,
    History,
    HashChanger,
    MessageToast,
    Device,
    Filter,
    FilterOperator
  ) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("cpapp.cpjobschedulertest.controller.Prediction", {
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
            "cpapp.cpjobschedulertest.view.JobData",
            this
          );
          this.getView().addDependent(this._valueHelpDialogJobData);
        }

        if (!this._valueHelpDialogUpdateJob) {
          this._valueHelpDialogUpdateJob = sap.ui.xmlfragment(
            "cpapp.cpjobschedulertest.view.UpdateJobDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogUpdateJob);
        }

        if (!this._valueHelpDialogScheLog) {
          this._valueHelpDialogScheLog = sap.ui.xmlfragment(
            "cpapp.cpjobschedulertest.view.ScheLog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogScheLog);
        }
      },

      onAfterRendering: function () {
        oGModel = this.getModel("oGModel");
        that.oList = that.byId("jobList");
        that.oList.removeSelections(true);

        that.getView().byId("headSearch").setValue();

        var nowH = new Date();
        //past 15 days selected date
        var oDateL = new Date(
          nowH.getFullYear(),
          nowH.getMonth(),
          nowH.getDate() - 15
        );

        this.byId("idDateRange").setDateValue(oDateL);
        this.byId("idDateRange").setSecondDateValue(nowH);

        that.byId("JobPanel").setExpanded(true);
        that.byId("jobDetailsPanel").setExpanded(false);
        sap.ui.core.BusyIndicator.show();
        that.getModel("JModel").callFunction("/readJobs", {
          method: "GET",
          //   urlParameters: {
          //     startTime: dFromDate,
          //     endTime: dToDate
          //   },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            oData.results.forEach(function (row) {
              row.jobId = row.jobId.toString();
            }, that);
            oGModel.setProperty("/tableData", oData.results);
            var aData = [];
            var dDate = that.byId("idDateRange").getValue().split("To");
            var dLow = new Date(dDate[0]),
              dHigh = new Date(dDate[1] + " " + "23:59:59");
            for (var i = 0; i < oData.results.length; i++) {
              var startDate = new Date(oData.results[i].startTime);
              if (dLow < startDate && dHigh > startDate) {
                aData.push(oData.results[i]);
              }
            }

            that.listModel.setData({
              results: aData,
            });
            that.oList.setModel(that.listModel);
            that.onSearch();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });
      },

      onSearch: function (oEvent) {
        var sQuery = that.getView().byId("headSearch").getValue(),
          oFilters = [];
        var aFilter = [];

        if (sQuery !== "") {
          var oFilters = new Filter({
            filters: [
              new Filter("jobId", FilterOperator.Contains, sQuery),
              new Filter("name", FilterOperator.Contains, sQuery),
              new Filter("description", FilterOperator.Contains, sQuery),
            ],
            and: false,
          });
          aFilter.push(oFilters);
        }

        that.byId("jobList").getBinding("items").filter(aFilter);
      },

      onPanelExpand: function () {
        var panel = that.byId("JobPanel").getExpanded();

        if (panel === true) {
          that.byId("jobList").removeSelections(true);
        }
      },

      onCreateJob: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("CreateJob", {}, true);
      },

      handleDateChange: function (oEvent) {
        var tabData = oGModel.getProperty("/tableData");
        var aData = [];
        var dDate = that.byId("idDateRange").getValue().split("To");
        var dLow = new Date(dDate[0]),
          dHigh = new Date(dDate[1] + " " + "23:59:59");
        for (var i = 0; i < tabData.length; i++) {
          var startDate = new Date(tabData[i].startTime);
          if (dLow < startDate && dHigh > startDate) {
            aData.push(tabData[i]);
          }
        }

        that.listModel.setData({
          results: aData,
        });
        that.oList.setModel(that.listModel);
        that.onSearch();
      },

      onhandlePress: function (oEvent) {
        oGModel = this.getModel("oGModel");
        var oJobId = oEvent.getParameter("listItem").getCells()[0].getTitle();

        oGModel.setProperty("/newSch", "");
        oGModel.setProperty("/UpdateSch", "");
        oGModel.setProperty(
          "/Jobdata",
          oEvent.getParameter("listItem").getBindingContext().getObject()
        );

        // that.getModel("JModel").callFunction("/lreadJobRunLogs", {
        that.getModel("JModel").callFunction("/readJobDetails", {
          method: "GET",
          urlParameters: {
            jobId: oJobId,
            displaySchedules: true,
            // scheduleId:oSelScheduleId,
            // page_size: "5",
            // offset: "1"
          },
          success: function (oData) {
            // if(!oData.results.action.includes("DemandQty")){
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
            // }

            var aData = oData.readJobDetails.schedules;
            that.JobLogsModel.setData({
              results: aData,
            });
            that.byId("idJobLogs").setModel(that.JobLogsModel);

            //   var aJobDetails = oData.results.schedules[0].data;
            var aJobDetails = oData.readJobDetails.schedules;

            //   aJobDetails = $.parseJSON(aJobDetails);
            oGModel.setProperty("/aJobDetails", aJobDetails);

            //   oGModel.setProperty("/aJobDetails", oData.results.schedules);

            if (oData.readJobDetails.action.includes("Models")) {
              oGModel.setProperty("/JobType", "M");
            } else if (
              oData.readJobDetails.action.includes("Predictions")
            ) {
              oGModel.setProperty("/JobType", "P");
            } else if (
              oData.readJobDetails.action === "generate_timeseries"
            ) {
              oGModel.setProperty("/JobType", "T");
            } else if (
                oData.readJobDetails.action === "generate_timeseriesF"
            ) {
                oGModel.setProperty("/JobType", "F");
            } else if (oData.readJobDetails.action.includes("sdi")) {
              oGModel.setProperty("/JobType", "S");
              var service = oGModel.getProperty("/Jobdata").action.split("/");
              var length = service.length - 1;
              service = service[length];
              oGModel.setProperty("/IBPService", service);
            } else {
              oGModel.setProperty("/JobType", "I");
              var service = oGModel.getProperty("/Jobdata").action.split("/");
              var length = service.length - 1;
              service = service[length];
              oGModel.setProperty("/IBPService", service);
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

      onScheData: function (oEvent) {
        //   var aData = oGModel.getProperty("/aJobDetails").vcRulesList;
        var aData = oGModel.getProperty("/aJobDetails"),
          ScheData = [];

        var scheduleId = oEvent
          .getSource()
          .getParent()
          .getBindingContext()
          .getObject().scheduleId;

        for (var i = 0; i < aData.length; i++) {
          if (scheduleId === aData[i].scheduleId) {
            if (
              oGModel.getProperty("/JobType") === "I" ||
              oGModel.getProperty("/JobType") === "S"
            ) {
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

        if (oGModel.getProperty("/JobType") === "M") {
          sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
        } else if (oGModel.getProperty("/JobType") === "P") {
          sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
          sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false);
        } else if (oGModel.getProperty("/JobType") === "T") {
            sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(true);
        } else if (oGModel.getProperty("/JobType") === "F") {
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
        } else if (oGModel.getProperty("/JobType") === "I") {
          sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(false);
          sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(false);
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
        }

        if ( oGModel.getProperty("/JobType") !== "I" &&  oGModel.getProperty("/JobType") !== "S"  ) {
          that._valueHelpDialogJobData.open();
        } else {
          var oActionType = oGModel.getProperty("/IBPService");
          var iCount = 0;

          if (
            oActionType === "generateFDemandQty" ||
            oActionType === "generateFCharPlan"
          ) {
            sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
            sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
            sap.ui
              .getCore()
              .byId("idJobData")
              .getColumns()[5]
              .setVisible(false);
            sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
          } else if (
            oActionType === "exportIBPLocation" ||
            oActionType === "exportIBPCustomer" ||
            oActionType.includes("ImportECC")
          ) {
            MessageToast.show(
              "There is no schedule data to display for the selected job type"
            );
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
          } else if (oActionType === "exportComponentReq") {
            sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
            sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
            sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);
            sap.ui
              .getCore()
              .byId("idJobData")
              .getColumns()[10]
              .setVisible(true);
          } else if (oActionType === "exportActCompDemand") {
            sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);
            sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);
            sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);
            sap.ui
              .getCore()
              .byId("idJobData")
              .getColumns()[10]
              .setVisible(true);
          }
          if (iCount === 0) {
            that._valueHelpDialogJobData.open();
          }
        }
      },

      onSchestatus: function (oEvent) {
        var oJobId = oGModel.getProperty("/Jobdata").jobId,
          oScheId = oEvent
            .getSource()
            .getParent()
            .getBindingContext()
            .getObject().scheduleId;

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
              results: oData.results,
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

      onScheLogClose: function () {
        that._valueHelpDialogScheLog.close();
      },

      onjobClose: function () {
        that._valueHelpDialogJobData.close();
      },

      onAddSchedule: function () {
        oGModel.setProperty("/newSch", "X");
        that.onCreateJob();
      },

      onJobDelete: function (oEvent) {
        var oJobId = oEvent
          .getSource()
          .getParent()
          .getBindingContext()
          .getObject().jobId;

        oGModel.setProperty("/DeleteJob", oJobId);

        that.getModel("JModel").callFunction("/deleteMLJob", {
          method: "GET",
          urlParameters: {
            jobId: oJobId,
          },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            if (oData.deleteMLJob.includes("true")) {
              sap.m.MessageToast.show(
                oGModel.getProperty("/DeleteJob") + ": Job Deleted"
              );
            }
            that.onAfterRendering();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Deletion failed");
          },
        });
      },

      onUpdateJob: function (oEvent) {
        var oJobId = oEvent
            .getSource()
            .getParent()
            .getBindingContext()
            .getObject(),
          bActive,
          dStartTime,
          dEndTime;
        oGModel.setProperty("/JobDetailstoUpdate", oJobId);
        oGModel.setProperty("/updatejob", oJobId.jobId);
        oGModel.setProperty("/updatejobDesc", oJobId.description);
        if (oJobId.active === true) {
          bActive = "T";
        } else if (oJobId.active === false) {
          bActive = "F";
        }
        sap.ui.getCore().byId("idUJActive").setSelectedKey(bActive);

        dStartTime = new Date(oJobId.startTime);
        dEndTime = new Date(oJobId.endTime);
        sap.ui.getCore().byId("idUJSTime").setDateValue(dStartTime);
        sap.ui.getCore().byId("idUJETime").setDateValue(dEndTime);

        this._valueHelpDialogUpdateJob.open();
      },

      onUpdateJobClose: function () {
        this._valueHelpDialogUpdateJob.close();
      },

      onJobUpdateSave: function () {
        var aSelJonDetails = oGModel.getProperty("/JobDetailstoUpdate");
        var bActive = sap.ui.getCore().byId("idUJActive").getSelectedKey(),
          dUPSdate = sap.ui.getCore().byId("idUJSTime").getDateValue(),
          dUJEdate = sap.ui.getCore().byId("idUJETime").getDateValue(),
          tUJStime,
          tUJEtime,
          oJobid = sap.ui.getCore().byId("idUJob").getValue(),
          oJobDesc = sap.ui.getCore().byId("idUJDesc").getValue(),
          action = aSelJonDetails.action,
          name = aSelJonDetails.name;

        dUPSdate = dUPSdate.toISOString().split("T");
        tUJStime = dUPSdate[1].split(":");
        dUJEdate = dUJEdate.toISOString().split("T");
        tUJEtime = dUJEdate[1].split(":");

        dUPSdate =
          dUPSdate[0] + " " + tUJStime[0] + ":" + tUJStime[1] + " " + "+0000";
        dUJEdate =
          dUJEdate[0] + " " + tUJEtime[0] + ":" + tUJEtime[1] + " " + "+0000";

        if (bActive === "T") {
          bActive = true;
        } else if (bActive === "F") {
          bActive = false;
        }

        var finalList = {
          jobId: oJobid,
          name: name,
          description: oJobDesc,
          action: action,
          httpMethod: "POST",
          active: bActive,
          startTime: dUPSdate,
          endTime: dUJEdate,
        };

        that.getModel("JModel").callFunction("/updateMLJob", {
          method: "GET",
          urlParameters: {
            jobDetails: JSON.stringify(finalList),
          },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            if (oData.updateMLJob.includes("true")) {
              sap.m.MessageToast.show(
                oGModel.getProperty("/JobDetailstoUpdate").jobId +
                  ": Job Updated"
              );
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

      onScheDelete: function (oEvent) {
        var oJobId = oGModel.getProperty("/Jobdata").jobId,
          oScheId = oEvent
            .getSource()
            .getParent()
            .getBindingContext()
            .getObject().scheduleId;

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
            that.onAfterRendering();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Deletion failed");
          },
        });
      },

      onScheUpdate: function (oEvent) {
        var oJobId = oGModel.getProperty("/Jobdata").jobId,
          oScheId = oEvent
            .getSource()
            .getParent()
            .getBindingContext()
            .getObject().scheduleId,
          aData = oGModel.getProperty("/aJobDetails");

        for (var i = 0; i < aData.length; i++) {
          if (oScheId === aData[i].scheduleId) {
            oGModel.setProperty("/aScheUpdate", aData[i]);
          }
        }

        oGModel.setProperty("/UpdateSch", "X");
        that.onCreateJob();
      },
    });
  }
);
