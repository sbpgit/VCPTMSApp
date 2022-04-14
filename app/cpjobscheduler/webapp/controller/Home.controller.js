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
    var that;

    return BaseController.extend("cpapp.cpjobscheduler.controller.Prediction", {
      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        that = this;
        this.listModel = new JSONModel();
        this.listModel.setSizeLimit(2000);
      },

      onAfterRendering: function () {
        that.oList = that.byId("jobList");

        // var dDate = that.byId("idDateRange").getValue();
        // dDate = dDate.split(" To ");
        // var dFromDate = dDate[0],
        //     dToDate = dDate[0];

        this.getModel("JModel").read("/js_Jobs", {
        //   filters: [
        //       new Filter("startTime", FilterOperator.EQ, dFromDate),
        //       new Filter("endTime", FilterOperator.EQ, dToDate),
        //   ],
          success: function (oData) {
            that.listModel.setData({
              results: oData.results,
            });
            that.oList.setModel(that.listModel);
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });

        that.getModel("JModel").callFunction("/js_Jobs", {
          method: "GET",
        //   urlParameters: {
        //     startTime: dFromDate,
        //     endTime: dToDate
        //   },
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

        this.getModel("JModel").read("/js_Jobs", {
        //   filters: [
        //       new Filter("startTime", FilterOperator.EQ, dFromDate),
        //       new Filter("endTime", FilterOperator.EQ, dToDate),
        //   ],
          success: function (oData) {
            that.listModel.setData({
                results: oData.results,
              });
              that.oList.setModel(that.listModel);
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });

        that.getModel("JModel").callFunction("/js_Jobs", {
            method: "GET",
            // urlParameters: {
            //   startTime: dFromDate,
            //   endTime: dToDate
            // },
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
    });
  }
);
