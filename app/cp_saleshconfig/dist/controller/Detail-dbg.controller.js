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
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Model
        that.oListModel = new JSONModel();
      },

      /**
       * Called after the view has been rendered.
       * Calls the getdata[function] to get Data.
       */
      onAfterRendering: function () {
        that = this;
        that.oList = this.byId("idDetailTab");
        // Calling function
        this.getData();
      },

      /**
       * Getting Data Initially and binding to elements.
       * @param {object} oEvent -the event information.
       */
      getData: function () {
        that.oGModel = that.getModel("oGModel");
        var oItem = that.oGModel.getProperty("/selItem");
        // Navigating to home page if there is no values in selection
        if (oItem === undefined) {
          that.onBack();
        }
        sap.ui.core.BusyIndicator.show();
        this.getModel("BModel").read("/getSaleshCfg", {
          filters: [
            new Filter("SALES_DOC", FilterOperator.EQ, oItem.SALES_DOC),
            new Filter("SALESDOC_ITEM", FilterOperator.EQ, oItem.SALESDOC_ITEM),
          ],
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            var aData = [];
            // Looping through the data to remove null values from list
            for (var i = 0; i < oData.results.length; i++) {
              if (
                oData.results[i].CHAR_NAME !== null ||
                oData.results[i].CHAR_VALUE !== null
              ) {
                aData.push(oData.results[i]);
              }
            }

            that.oListModel.setData({
              results: aData,
            });
            that.oList.setModel(that.oListModel);

            // Setting the properties to display in Header
            that.oGModel.setProperty(
              "/sSchedNo",
              oData.results[0].SCHEDULELINE_NUM
            );
            that.oGModel.setProperty("/sRejReson", oData.results[0].REASON_REJ);
            that.oGModel.setProperty(
              "/sConQty",
              oData.results[0].CONFIRMED_QTY
            );
            that.oGModel.setProperty("/sOrdQty", oData.results[0].ORD_QTY);
            that.oGModel.setProperty(
              "/sMatAvailData",
              oData.results[0].MAT_AVAILDATE
            );
            that.oGModel.setProperty(
              "/sCustGrp",
              oData.results[0].CUSTOMER_GROUP
            );
            that.oGModel.setProperty("/sNetValue", oData.results[0].NET_VALUE);
          },
          error: function (oRes) {
            MessageToast.show("error");
          },
        });
      },

      /**
       * This function is called when click on back button to navigate to home view.
       * @param {object} oEvent -the event information.
       */
      onBack: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onTableSearch: function (oEvent) {
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
        that.oList.getBinding("items").filter(oFilters);
      },
    });
  }
);
