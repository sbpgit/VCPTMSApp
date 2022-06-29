sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "cpapp/cppartialprodnew/controller/BaseController",
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
        return BaseController.extend("cpapp.cppartialprodnew.controller.Home", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                // Declaration of Json Model and size category
                that.ProdListModel = new JSONModel();
                that.charModel = new JSONModel();
                that.ProdListModel.setSizeLimit(1000);
                that.charModel.setSizeLimit(1000);
            },

            /**
             * Called after the view has been rendered.
             * Calls the getData[function] to get Data.
             */
            onAfterRendering: function () {
                that.oList = this.byId("ProdList");

                that.getData();
            },

            /**
             * Getting Data Initially and binding to elements.
             */
            getData: function () {
                sap.ui.core.BusyIndicator.show();

                // Calling service to get the product data
                this.getModel("BModel").read("/genPartialProd", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.ProdListModel.setData(oData);
                        that.oList.setModel(that.ProdListModel);
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
            },

            /**
             * This function is called when click on Create or Edit button.
             * In this function data will be set based on buttion click.
             * on click on button navigate to Detail page
             * @param {object} oEvent -the event information.
             */
            onCreate: function (oEvent) {
                oGModel = this.getModel("oGModel");
                oGModel.setProperty("/sFlag", "");
                // Based on button click setting the data of product and ref product
                if (oEvent.getSource().getTooltip().includes("Create")) {
                    oGModel.setProperty("/sFlag", "C");
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                    oRouter.navTo("Detail", {}, true);
                } else {
                    if (this.byId("ProdList").getSelectedItems().length) {
                        var oTableItem = this.byId("ProdList").getSelectedItem().getCells();

                        oGModel.setProperty("/Loc", oTableItem[0].getText());
                        oGModel.setProperty("/Prod", oTableItem[1].getText());
                        oGModel.setProperty("/refProd", oTableItem[2].getText());
                        oGModel.setProperty("/sFlag", "E");

                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("Detail", {}, true);
                    } else {
                        MessageToast.show("Select product to update");
                    }
                }
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            handleSearch: function (oEvent) {
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = oEvent.getParameter("id"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";

                if (sId.includes("idSearch")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                                    new Filter("REF_PRODID", FilterOperator.Contains, sQuery),
                                    new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oList.getBinding("items").filter(oFilters);
                }
            },

            /**
             * This function is called when click on Delete button on product list.
             * @param {object} oEvent -the event information.
             */
            onProdeDel: function (oEvent) {
                // Getting the selected product to delete
                var oItem = oEvent.getSource().getParent().getCells();
                var oLoc = oItem[0].getText(),
                    oProd = oItem[1].getText(),
                    oRefProd = oItem[2].getText();
                // Getting the conformation popup before deleting
                var sText =
                    "Do you want to delete the selected product" +
                    " - " +
                    oProd +
                    " - " +
                    "Please confirm";
                sap.m.MessageBox.show(sText, {
                    title: "Confirmation",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            sap.ui.core.BusyIndicator.show();

                            that.getModel("BModel").callFunction("/maintainPartialProd", {
                                method: "GET",
                                urlParameters: {
                                    LOCATION_ID: oLoc,
                                    REF_PRODID: oRefProd,
                                    PRODUCT_ID: oProd,
                                    FLAG: "D",
                                },
                                success: function (oData) {
                                    sap.ui.core.BusyIndicator.hide();

                                    MessageToast.show("Product deleted successfully");
                                    // Refreshing data after successfull deletion
                                    that.onAfterRendering();
                                },
                                error: function () {
                                    sap.ui.core.BusyIndicator.hide();
                                    MessageToast.show("Failed to delete product");
                                },
                            });
                        }
                    },
                });
            },

            /**
             * This function is called when a click on product Characteristics button.
             */
            onCharDetails: function (oEvent) {
                var sSelProd = oEvent.getSource().getParent().getCells()[1].getText();
                var sSelrefProd = oEvent
                    .getSource()
                    .getParent()
                    .getCells()[2]
                    .getText();

                if (!that._onCharDetails) {
                    that._onCharDetails = sap.ui.xmlfragment(
                        "cpapp.cppartialprodnew.view.CharDetails",
                        that
                    );
                    that.getView().addDependent(that._onCharDetails);
                }
                that._onCharDetails.setTitleAlignment("Center");
                that.CharDetailList = sap.ui.getCore().byId("idCharDetail");

                this.getModel("BModel").read("/getPartialChar", {
                    filters: [
                        new Filter("PRODUCT_ID", FilterOperator.EQ, sSelProd),
                        new Filter("REF_PRODID", FilterOperator.EQ, sSelrefProd),
                    ],
                    success: function (oData) {
                        that.charModel.setData({
                            results: oData.results,
                        });
                        that.CharDetailList.setModel(that.charModel);
                        that._onCharDetails.open();
                    },
                    error: function () {
                        MessageToast.show("Failed to get data");
                    },
                });
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             */
            onCharClose: function () {
                that._onCharDetails.close();
            },
        });
    }
);
