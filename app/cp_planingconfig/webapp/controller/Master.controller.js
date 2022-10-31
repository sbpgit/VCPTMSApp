sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "cpapp/cpplaningconfig/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        "sap/f/library",
        "sap/ui/Device",

    ],
    function (Controller, BaseController, JSONModel, Filter, FilterOperator, fioriLibrary, Device) {
        "use strict";
        var that, oGModel;
        return BaseController.extend("cpapp.cpplaningconfig.controller.Master", {
            onInit() {
                that = this;
                that.locModel = new JSONModel();
                that.locModel.setSizeLimit(1000);

                this.bus = sap.ui.getCore().getEventBus();
                this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
                this.bus.publish("nav", "toBeginPage", {
                    viewName: this.getView().getProperty("viewName"),
                });

                // var oRoute = that.getRouter().getRoute("Master");
                // oRoute.attachPatternMatched(that._onPatternMatched, that);
            },
            /**
             * 
             * @param {*} oModel 
             */
            onAfterRendering: function () {
                that = this;
                oGModel = this.getModel("oGModel");

                that.oLocationList = that.getView().byId("idLocationsList");
                that.getLocation();
            },
            /**
             * 
             * 
             */
            getLocation: function () {
                //Location data
                that.getModel("PCModel").read("/getLocation", {
                    success: function (oData) {
                        that.locModel.setData({ locations: oData.results });
                        that.oLocationList.setModel(that.locModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });

            },
            /**
             * 
             * @param {*} oEvent 
             */
            onSearchLocation: function(oEvent) {
                var oFilter = [];
                that.oLocationList = that.getView().byId("idLocationsList");

                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue");
                // Checking if search value is empty
                if (sQuery) {
                    oFilter = new Filter([
                        new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                        new Filter("LOCATION_DESC", FilterOperator.Contains, sQuery)
                    ], false);

                    that.oLocationList.getBinding("items").filter(oFilter);
                } else {
                    that.oLocationList.getBinding("items").filter(oFilter);
                }
            },
            /**
             * 
             * @param {*} oEvent 
             */
            onListItemPress: function (oEvent) {              
                oGModel = that.getModel("oGModel");
                if (oEvent) {
                    var location = oEvent.getParameter('listItem').getProperty("title");
                    oGModel.setProperty("/location", location);
                    
                }
                // Calling Item Detail page
                that.getOwnerComponent().runAsOwner(function () {
                    if (!that.oDetailView) {
                        try {
                            that.oDetailView = sap.ui.view({
                                viewName: "cpapp.cpplaningconfig.view.Home",
                                type: "XML",
                            });
                            that.bus.publish("flexible", "addDetailPage", that.oDetailView);
                            that.bus.publish("nav", "toDetailPage", {
                                viewName: that.oDetailView.getViewName(),
                            });
                        } catch (e) {
                            that.oDetailView.onAfterRendering();
                        }
                    } else {
                        that.bus.publish("nav", "toDetailPage", {
                            viewName: that.oDetailView.getViewName(),
                        });
                    }
                });
            },
            /**
             *
             *
             */
            // _onPatternMatched: function (oEvent) {
            //     var oModel = that.getOwnerComponent().getModel('PCModel');
            //     // that.i18n = that.getOwnerComponent().getModel("i18n").getResourceBundle();
            //     that.getLocation();
            // }
        });
    }
);