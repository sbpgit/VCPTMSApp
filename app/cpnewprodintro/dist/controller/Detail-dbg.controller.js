sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cpapp/cpnewprodintro/controller/BaseController",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
      Controller,
      BaseController,
      JSONModel,
      Filter,
      FilterOperator,
      MessageToast,
      MessageBox
    ) {
      "use strict";
      var oGModel, that;
      return BaseController.extend("cpapp.cpnewprodintro.controller.Detail", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;

        },


        onBack: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
        }
        
    });
}
);


