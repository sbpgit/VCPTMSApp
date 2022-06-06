sap.ui.define(
  [
    "cp/appf/cpprodconfig/controller/BaseController",
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
    return BaseController.extend("cp.appf.cpprodconfig.controller.ItemDetail", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        this.bus = sap.ui.getCore().getEventBus();
        // Declaring JSON Models
        that.oCharModel = new JSONModel();
        oGModel = that.getOwnerComponent().getModel("oGModel");
      },

      /**
       * Called after the view has been rendered.
       * Calls the service to get Data.
       */
      onAfterRendering: function () {
        oGModel = that.getOwnerComponent().getModel("oGModel");

        var oClassName = oGModel.getProperty("/className");

        this.byId("charList").setModel(this.oCharModel);
        // Calling service to get Class Char List
        this.getModel("BModel").read("/getClassChar", {
          filters: [new Filter("CLASS_NAME", FilterOperator.EQ, oClassName)],

          success: function (oData) {
            that.oCharModel.setData({
              classresults: oData.results,
            });
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onDetailSearch: function (oEvent) {
        var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        this.byId("charList").getBinding("items").filter(oFilters);
      },
    });
  }
);
