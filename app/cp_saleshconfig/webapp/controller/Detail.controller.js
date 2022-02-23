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
            var Data = [];
                for(var i=0; i<oData.results.length; i++ ){
                    if(oData.results[i].CHAR_NAME !== null || oData.results[i].CHAR_VALUE !== null ){
                        Data.push(oData.results[i]);
                    }
                }



            that.oListModel.setData({
              results: Data,
            });
            that.oList.setModel(that.oListModel);

            that.oGModel.setProperty("/sSchedNo", oData.results[0].SCHEDULELINE_NUM);
            that.oGModel.setProperty("/sRejReson", oData.results[0].REASON_REJ);
            that.oGModel.setProperty("/sConQty", oData.results[0].CONFIRMED_QTY);
            that.oGModel.setProperty("/sOrdQty", oData.results[0].ORD_QTY);
            that.oGModel.setProperty("/sMatAvailData", oData.results[0].MAT_AVAILDATE);
            that.oGModel.setProperty("/sCustGrp", oData.results[0].CUSTOMER_GROUP);
            that.oGModel.setProperty("/sNetValue", oData.results[0].NET_VALUE);

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

      onTableSearch: function (oEvent) {
        var query =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (query !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("CHAR_NAME", FilterOperator.Contains, query),
                new Filter("CHAR_VALUE", FilterOperator.Contains, query),
              ],
              and: false,
            })
          );
        }
        that.oList.getBinding("items").filter(oFilters);
      },



    });
  }
);
