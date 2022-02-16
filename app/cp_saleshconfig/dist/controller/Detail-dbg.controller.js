sap.ui.define(
  [
    "cp/appf/cpsaleshconfig/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpsaleshconfig.controller.Detail", {
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
      },
      onAfterRendering: function () {
        that = this;
        that.oList = this.byId("idDetailTab");
        // Calling function
        this.getData();
      },
      getData: function () {
        that.oGModel = that.getModel("oGModel");
        var Item = that.oGModel.getProperty("/selItem");
        if (Item === undefined) {
          that.onBack();
        }
        sap.ui.core.BusyIndicator.show();
        this.getModel("BModel").read("/getSaleshCfg", {
          filters: [
            new Filter("SALES_DOC", FilterOperator.EQ, Item.SALES_DOC),
            new Filter("SALESDOC_ITEM", FilterOperator.EQ, Item.SALESDOC_ITEM),
          ],
          success: function (oData) {
            that.oListModel.setData({
              results: oData.results,
            });
            that.oList.setModel(that.oListModel);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function (oRes) {
            MessageToast.show("error");
          },
        });
      },

      onBack: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
      },
    });
  }
);
