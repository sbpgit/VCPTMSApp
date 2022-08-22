sap.ui.define(
  [
    "cpapp/cprestrictions/controller/BaseController",
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
    return BaseController.extend("cpapp.cprestrictions.controller.ItemDetail", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        this.bus = sap.ui.getCore().getEventBus();
        // Declaring JSON Models and size limit
        that.oModel = new JSONModel();
        
        this.oModel.setSizeLimit(1000);
        oGModel = that.getOwnerComponent().getModel("oGModel");
      },

      /**
       * Called after the view has been rendered.
       * Calls the service to get Data.
       */
      onAfterRendering: function () {
        oGModel = that.getOwnerComponent().getModel("oGModel");
        sap.ui.core.BusyIndicator.show();
        var sLocId = oGModel.getProperty("/locId");

        this.getModel("BModel").read("/getODHdrRstr", {
          filters: [
            new Filter("LOCATION_ID", FilterOperator.EQ, sLocId),
          ],

          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            if (oData.results.length) {
              that.oModel.setData({
                results: oData.results,
              });
              that.byId("idDetail").setModel(that.oModel);
            }
            that.byId("idSearch").setValue("");
            
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
      onItemSearch: function (oEvent) {
        var sQuery = "",
          oFilters = [];
        if (oEvent) {
          sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue");
        }

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.byId("idDetail").getBinding("items").filter(oFilters);
      },
    });
  }
);
