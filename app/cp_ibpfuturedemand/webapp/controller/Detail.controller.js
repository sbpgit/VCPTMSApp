sap.ui.define(
  [
    "cp/appf/cpibpfuturedemand/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpibpfuturedemand.controller.Detail", {
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
        that.oListModel.setSizeLimit(1000);
      },
      onBack: function () {
        
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
      },
      onAfterRendering: function () {
        that = this;
        that.oGModel = that.getModel("oGModel");
        that.byId("DetailSearch").setValue("");

        var selLoc = that.oGModel.getProperty("/sLoc"),
            selProd = that.oGModel.getProperty("/sProd"),
            selVer = that.oGModel.getProperty("/sVer"),
            selScen = that.oGModel.getProperty("/sScen"),
            selWeek = that.oGModel.getProperty("/sWeek");
            sap.ui.core.BusyIndicator.show();
            that.getModel("BModel").read("/getIBPFplan", {
                filters: [
                    new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                    new Filter("PRODUCT_ID", FilterOperator.EQ, selProd),
                    new Filter("VERSION", FilterOperator.EQ, selVer),
                    new Filter("SCENARIO", FilterOperator.EQ, selScen),
                    new Filter("WEEK_DATE", FilterOperator.EQ, selWeek)
                  ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.oListModel.setData({
                        results: oData.results,
                      });
                      that.byId("idPlanTable").setModel(that.oListModel);
                      that.onDetailSearch();
                  
                },
                error: function (data) {
                    sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show("Error While fetching data");
                },
              });

        
      },


      onDetailSearch:function(oEvent){
        var  oFilters = [];
        if(oEvent){
            var query = oEvent.getParameter("value") || oEvent.getParameter("newValue");
          } else {
            var query = that.byId("DetailSearch").getValue();
          }
        // Check if search filter is to be applied
        query = query ? query.trim() : "";
        
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("CLASS_NUM", FilterOperator.Contains, query),
                  new Filter("CHAR_NUM", FilterOperator.Contains, query),
                  new Filter("CHARVAL_NUM", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.byId("idPlanTable").getBinding("items").filter(oFilters);

      }


    });
  }
);
