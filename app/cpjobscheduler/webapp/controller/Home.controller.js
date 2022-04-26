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

        this.listModel.setSizeLimit(2000);
        this.JobLogsModel.setSizeLimit(1000);
        this.JobDataModel.setSizeLimit(1000);

        if (!this._valueHelpDialogJobData) {
            this._valueHelpDialogJobData = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.JobData",
              this
            );
            this.getView().addDependent(this._valueHelpDialogJobData);
          }
      },

      onAfterRendering: function () {
        oGModel = this.getModel("oGModel");
        that.oList = that.byId("jobList");

        var nowH = new Date();
		//past 15 days selected date
		var oDateL = new Date(nowH.getFullYear(), nowH.getMonth(), nowH.getDate() - 15);

		this.byId("idDateRange").setDateValue(oDateL);
		this.byId("idDateRange").setSecondDateValue(nowH);

        that.getModel("JModel").callFunction("/lreadJobs", {
          method: "GET",
        //   urlParameters: {
        //     startTime: dFromDate,
        //     endTime: dToDate
        //   },
          success: function (oData) {
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
                    var aData = oData.lreadJobDetails.value.schedules;
                    that.JobLogsModel.setData({
                        results: aData,
                      });
                      that.byId("idJobLogs").setModel(that.JobLogsModel);

                    var aJobDetails = oData.lreadJobDetails.value.schedules[0].data;

                    aJobDetails = $.parseJSON(aJobDetails);
                    oGModel.setProperty("/aJobDetails", aJobDetails);

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

      onScheData:function(){
        var aData = oGModel.getProperty("/aJobDetails").vcRulesList;

        that.JobDataModel.setData({
            results: aData,
          });
          sap.ui.getCore().byId("idJobData").setModel(that.JobDataModel);

        that._valueHelpDialogJobData.open();

      },

      onjobClose:function(){
        that._valueHelpDialogJobData.close();
      }
      








    });
  }
);
