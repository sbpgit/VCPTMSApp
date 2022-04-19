sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cpapp/cpnewpartialprod/controller/BaseController",
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
      return BaseController.extend("cpapp.cpnewpartialprod.controller.Detail", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;
          that.ListModel = new JSONModel();

        },

        onAfterRendering:function(){

            this.getModel("BModel").read("/getNewProdChar", {
                filters: [
                new Filter(
                    "REF_PRODID",
                    FilterOperator.EQ,
                    "8150RW"
                ),
                ],
                success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                that.ListModel.setData(oData);
                that.byId("ProdList").setModel(that.ListModel);
                },
                error: function (oData, error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("error");
                },
            });
        },


        onBack: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
        }
        
    });
}
);


