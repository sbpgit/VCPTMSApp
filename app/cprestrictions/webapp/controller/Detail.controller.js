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
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
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
  
      return BaseController.extend(
        "cpapp.cprestrictions.controller.Detail",
        {
          /**
           * Called when a controller is instantiated and its View controls (if available) are already created.
           * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
           */
          onInit: function () {
            that = this;
            // Declaring JSON Model and size limit
            that.oListModel = new JSONModel();
            that.oListModel.setSizeLimit(1000);
          },
  
          /**
           * Called when it routes to a page back to Home page.
           */
          onBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);
          },
  
          /**
           * Called after the view has been rendered.
           * Calls the getParameters[function] to get Data.
           */
          onAfterRendering: function () {
            that = this;
            that.oGModel = that.getModel("oGModel");
  
            // Reading the data selected from home view
            var oSelRest = that.oGModel.getProperty("/sRest");
            
          },
  
          


        }
      );
    }
  );
  