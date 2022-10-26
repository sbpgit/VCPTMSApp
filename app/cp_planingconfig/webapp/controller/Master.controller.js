sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "cpapp/cpplaningconfig/controller/BaseController",
        "sap/ui/model/json/JSONModel",    
        "sap/f/library"    

    ],
    function (Controller, BaseController, JSONModel, fioriLibrary) {
        "use strict";
        var that;
        return BaseController.extend("cpapp.cpplaningconfig.controller.Master", {
            onInit() {
                that = this;
                that.locModel = new JSONModel();
                that.locModel.setSizeLimit(1000);

                var oRoute = that.getRouter().getRoute("master");
                oRoute.attachPatternMatched(that._onPatternMatched, that);
            },
            /**
             * 
             * @param {*} oModel 
             */
            onAfterRendering: function() {
                that.oLocationList = that.getView().byId("idLocations");
            },
            /**
             * 
             * 
             */
            getLocation: function() {
                //Location data
                that.getModel("PCModel").read("/getLocation", {
                    success: function (oData) {
                        that.locModel.setData({locations: oData.results});                        
                        that.oLocationList.setModel(that.locModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
                // oModel.read("/getLocation", {
                //     success: function (oData) {
                //         that.locModel.setData({locations: oData.results});                        
                //         that.oLocationList.setModel(that.locModel);
                //         // sap.ui.core.BusyIndicator.hide();
                //     },
                //     error: function (oData, error) {
                //         MessageToast.show("error");
                //         // sap.ui.core.BusyIndicator.hide();
                //     },
                // });
            },
            onListItemPress: function (oEvent) {
                // var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(1),
                    //productPath = oEvent.getSource().getSelectedItem().getBindingContext("locations").getPath(),
                    //location = productPath.split("/").slice(-1).pop();
                var location = oEvent.getParameter('listItem').getProperty("title");
    
                that.getRouter().navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, location: location});
            },
            /**
             *
             *
             */
            _onPatternMatched: function (oEvent) {
                var oModel = that.getOwnerComponent().getModel('PCModel');
                // that.i18n = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                that.getLocation();
            }
        });
    }
);