sap.ui.define(
<<<<<<< HEAD
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

    return BaseController.extend(
      "cp.appf.cpibpfuturedemand.controller.Detail",
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
          that.byId("DetailSearch").setValue("");

          // Reading the data selected from home view
          var oSelLoc = that.oGModel.getProperty("/sLoc"),
            oSelProd = that.oGModel.getProperty("/sProd"),
            oSelVer = that.oGModel.getProperty("/sVer"),
            oSelScen = that.oGModel.getProperty("/sScen"),
            oSelWeek = that.oGModel.getProperty("/sWeek");
          sap.ui.core.BusyIndicator.show();
          that.getModel("BModel").read("/getIBPFplan", {
            filters: [
              new Filter("LOCATION_ID", FilterOperator.EQ, oSelLoc),
              new Filter("PRODUCT_ID", FilterOperator.EQ, oSelProd),
              new Filter("VERSION", FilterOperator.EQ, oSelVer),
              new Filter("SCENARIO", FilterOperator.EQ, oSelScen),
              new Filter("WEEK_DATE", FilterOperator.EQ, oSelWeek),
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

        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */

        onDetailSearch: function (oEvent) {
          var oFilters = [];
          if (oEvent) {
            var sQuery =
              oEvent.getParameter("value") || oEvent.getParameter("newValue");
          } else {
            var sQuery = that.byId("DetailSearch").getValue();
          }
          // Check if search filter is to be applied
          sQuery = sQuery ? sQuery.trim() : "";

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
          that.byId("idPlanTable").getBinding("items").filter(oFilters);
        },
      }
    );
  }
=======
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

        return BaseController.extend(
            "cp.appf.cpibpfuturedemand.controller.Detail",
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
                    that.byId("DetailSearch").setValue("");

                    // Reading the data selected from home view
                    var oSelLoc = that.oGModel.getProperty("/sLoc"),
                        oSelProd = that.oGModel.getProperty("/sProd"),
                        oSelVer = that.oGModel.getProperty("/sVer"),
                        oSelScen = that.oGModel.getProperty("/sScen"),
                        oSelWeek = that.oGModel.getProperty("/sWeek");
                    sap.ui.core.BusyIndicator.show();
                    that.getModel("BModel").read("/getIBPFplan", {
                        filters: [
                            new Filter("LOCATION_ID", FilterOperator.EQ, oSelLoc),
                            new Filter("PRODUCT_ID", FilterOperator.EQ, oSelProd),
                            new Filter("VERSION", FilterOperator.EQ, oSelVer),
                            new Filter("SCENARIO", FilterOperator.EQ, oSelScen),
                            new Filter("WEEK_DATE", FilterOperator.EQ, oSelWeek),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.oListModel.setData({
                                results: oData.results,
                            });
                            that.byId("idPlanTable").setModel(that.oListModel);
                            // that.onDetailSearch();
                        },
                        error: function (data) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error While fetching data");
                        },
                    });
                },

                /**
                 * Called when something is entered into the search field.
                 * @param {object} oEvent -the event information.
                 */

                onDetailSearch: function (oEvent) {
                    var sQuery = "",
                        oFilters = [];

                        var sQuery = that.byId("DetailSearch").getValue();
                    // if (oEvent) {
                    //     sQuery = oEvent.getParameter("value") || oEvent.getParameter("newValue");
                    // } else {
                    //     var sQuery = that.byId("DetailSearch").getValue();
                    //  }

                    // Check if search filter is to be applied
                    sQuery = sQuery ? sQuery.trim() : "";
                    sQuery = sQuery.toUpperCase();
                    // Reading the data selected from home view

                    var oSelLoc = that.oGModel.getProperty("/sLoc"),
                        oSelProd = that.oGModel.getProperty("/sProd"),
                        oSelVer = that.oGModel.getProperty("/sVer"),
                        oSelScen = that.oGModel.getProperty("/sScen"),
                        oSelWeek = that.oGModel.getProperty("/sWeek");

                    // getting the filters
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("LOCATION_ID", FilterOperator.EQ, oSelLoc),
                                new Filter("PRODUCT_ID", FilterOperator.EQ, oSelProd),
                                new Filter("VERSION", FilterOperator.EQ, oSelVer),
                                new Filter("SCENARIO", FilterOperator.EQ, oSelScen),
                                new Filter("WEEK_DATE", FilterOperator.EQ, oSelWeek),
                            ],
                            and: true,
                        })

                    );



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

                    sap.ui.core.BusyIndicator.show();
                    that.getModel("BModel").read("/getIBPFplan", {
                        filters: [oFilters],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.oListModel.setData({
                                results: oData.results,
                            });
                            that.byId("idPlanTable").setModel(that.oListModel);
                        },

                        error: function (data) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error While fetching data");
                        },
                    });
                },
            }
        );
    }
>>>>>>> 77de88f04f3036129a94bcc91ba9d4f0fd4fa11c
);
