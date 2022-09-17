sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/data/FlattenedDataset',
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Panel",
    "sap/viz/ui5/controls/VizFrame",
    "sap/viz/ui5/data/Dataset"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, FlattenedDataset, FeedItem, Filter, FilterOperator, MessageToast, MessageBox, Panel, VizFrame, Dataset) {
        "use strict";
        var oGModel, oGraphModel, that, T = 0;

        return Controller.extend("cpapp.cpcharqtygraph.controller.Home", {
            onInit: function () {
                that = this;
                // Declaring JSON Models and size limits
                that.TableModel = new JSONModel();
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.verModel = new JSONModel();
                that.scenModel = new JSONModel();
                that.dateJSON = new JSONModel();
                that.oNewModel = new JSONModel();
                this.PanelContent = that.byId("idVizFrame");
                that.TableModel.setSizeLimit(1000);
                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                that.verModel.setSizeLimit(1000);
                that.scenModel.setSizeLimit(1000);
                oGraphModel = new JSONModel();
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpcharqtygraph.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpcharqtygraph.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogVer) {
                    this._valueHelpDialogVer = sap.ui.xmlfragment(
                        "cpapp.cpcharqtygraph.view.VersionDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogVer);
                }
                if (!this._valueHelpDialogScen) {
                    this._valueHelpDialogScen = sap.ui.xmlfragment(
                        "cpapp.cpcharqtygraph.view.ScenarioDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogScen);
                }

            },
            onAfterRendering: function () {
                that.oList = this.byId("idTab");
                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("idprod");
                this.oVer = this.byId("idver");
                this.oScen = this.byId("idscen");
                this.oModVer = this.byId("idComboBox")
                this.oDate = this.byId("fromDate");
                that.aOrder = [];
                that.aSelOrder = [];
                var oFilters = [];

                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");

                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
                this.oVerList = this._oCore.byId(
                    this._valueHelpDialogVer.getId() + "-list"
                );
                this.oScenList = this._oCore.byId(
                    this._valueHelpDialogScen.getId() + "-list"
                );

                // Calling service to get the Location data
                sap.ui.core.BusyIndicator.show();
                this.getView().getModel("oModel").read("/getLocation", {
                    success: function (oData) {

                        that.locModel.setData(oData);

                        that.oLocList.setModel(that.locModel);

                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
            },
            onResetDate: function () {
                that.oLoc.setValue("");
                that.oProd.setValue("");
                that.oVer.setValue("");
                that.oScen.setValue("");
                this.oModVer.setSelectedKey("Active");

                // that.byId("idSplitter").setVisible(false);
                // that.byId("idObjectPageSub").setMode("Collapsed");

                that.byId("idObjectPageSub").setVisible(false);
                this.oDate = this.byId("fromDate");
                this.oDate.setSelectedKey("");
                // that.onAfterRendering();
            },
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Loc Dialog
                if (sId.includes("loc")) {
                    that._valueHelpDialogLoc.open();
                    var filterJSON1 = new JSONModel();
                    filterJSON1.setData([]);
                    var oVizFrame = that.byId("idVizFrame");
                    oVizFrame.setModel(filterJSON1);
                    that.byId("idObjectPageSub").setVisible(false);
                    that.byId("idSplitter").setVisible(false);
                    that.byId("fromDate").setEditable(false);
                    that.byId("fromDate").setSelectedKey("");
                    // Prod Dialog
                } else if (sId.includes("prod")) {
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                    // Version Dialog
                } else if (sId.includes("ver")) {
                    if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
                        that._valueHelpDialogVer.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    if (that.byId("idloc").getValue() && that.byId("idprod").getValue() && that.byId("idver").getValue()) {
                        that._valueHelpDialogScen.open();
                    } else {
                        MessageToast.show("Select Location/Product/Version");
                    }
                }
            },
            /**
     * This function is called when selecting an item in dialogs.
     * @param {object} oEvent -the event information.
     */
            handleSelection: function (oEvent) {
                that.oGModel = that.getOwnerComponent().getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                //Location list
                if (sId.includes("Loc")) {
                    that.oLoc = that.byId("idloc");
                    that.oProd = that.byId("idprod");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedLoc",
                        aSelectedItems[0].getTitle()
                    );
                    that.oProd.setValue("");
                    that.oVer.setValue("");
                    that.oScen.setValue("");
                    that.oGModel.setProperty("/SelectedProd", "");

                    // Calling service to get Product list
                    this.getView().getModel("oModel").callFunction("/getAllProd", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: that.oLoc.getValue()
                        },
                        success: function (oData) {
                            that.prodModel.setData(oData);
                            that.oProdList.setModel(that.prodModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });

                    // Prod list
                } else if (sId.includes("prod")) {
                    that.oProd = that.byId("idprod");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedProd",
                        aSelectedItems[0].getTitle()
                    );
                    that.oVer.setValue("");
                    that.oScen.setValue("");

                    // Calling service to get IBP Versions
                    // sap.ui.core.BusyIndicator.show();
                    this.getView().getModel("oModel").read("/getIbpVerScn", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "PRODUCT_ID",
                                FilterOperator.EQ,
                                aSelectedItems[0].getTitle()
                            ),
                        ],
                        success: function (oData) {
                            if (oData.results.length === 0) {
                                sap.m.MessageToast.show("No versions available for choosen Location/Product. Please choose another.");
                                that.verModel.setData([]);
                                that.oVerList.setModel(that.verModel);
                                that.byId("fromDate").setEditable(false);
                                // sap.ui.core.BusyIndicator.hide();
                            }
                            else {
                                that.verModel.setData(oData);
                                that.oVerList.setModel(that.verModel);
                                // sap.ui.core.BusyIndicator.hide();
                            }
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });



                    // Version list
                } else if (sId.includes("Ver")) {
                    this.oVer = that.byId("idver");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oVer.setValue(aSelectedItems[0].getTitle());
                    that.oScen.setValue("");
                    that.oGModel.setProperty(
                        "/SelectedVer",
                        aSelectedItems[0].getTitle()
                    );
                    // Calling service to get IBP Scenario
                    this.getView().getModel("oModel").read("/getIbpVerScn", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "PRODUCT_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedProd")
                            ),
                            new Filter(
                                "VERSION",
                                FilterOperator.EQ,
                                aSelectedItems[0].getTitle()
                            ),
                        ],
                        success: function (oData) {
                            that.scenModel.setData(oData);
                            that.oScenList.setModel(that.scenModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                    // Scenario List
                } else if (sId.includes("scen")) {
                    this.oScen = that.byId("idscen");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oScen.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedScen",
                        aSelectedItems[0].getTitle()
                    );

                    //setting dates in date field

                    that.getView().getModel("oModel").read("/getCIRCharRate", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "PRODUCT_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedProd")
                            ),
                            new Filter(
                                "VERSION",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedVer")
                            ),
                            new Filter(
                                "SCENARIO",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedScen")
                            ),
                        ],
                        success: function (oData1) {

                            if (oData1.results.length === 0) {
                                that.oDateModel = new JSONModel();
                                that.oDateModel.setData([]);
                                that.byId("fromDate").setModel(that.oDateModel);
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("No dates available for the selected criteria.");
                                that.byId("fromDate").setEditable(false);
                            }
                            else {
                                sap.ui.core.BusyIndicator.hide();
                                oData1.results.forEach(function (row) {
                                    // Calling function to handle the date format
                                    row.WEEK_DATE = that.getInMMddyyyyFormat(row.WEEK_DATE);
                                }, that);

                                for (var i = 0; i < oData1.results.length; i++) {

                                    if (that.aOrder.indexOf(oData1.results[i].WEEK_DATE) === -1) {
                                        that.aOrder.push(oData1.results[i].WEEK_DATE);
                                        if (oData1.results[i].WEEK_DATE !== "") {
                                            that.oOrdData = {
                                                "WEEK_DATE": oData1.results[i].WEEK_DATE
                                            };
                                            that.aSelOrder.push(that.oOrdData);
                                        }
                                    }
                                }
                                that.oDateModel = new JSONModel();
                                that.oDateModel.setData({ resultsCombos: that.aSelOrder });
                                that.byId("fromDate").setModel(that.oDateModel);
                                that.byId("fromDate").setEditable(true);

                            }

                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                }
                that.handleClose(oEvent);
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
                // Location
                if (sId.includes("Loc")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                                    new Filter("LOCATION_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oLocList.getBinding("items").filter(oFilters);
                    // Product
                } else if (sId.includes("prod")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                                    new Filter("PROD_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oProdList.getBinding("items").filter(oFilters);
                    // Version
                } else if (sId.includes("Ver")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("VERSION", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oVerList.getBinding("items").filter(oFilters);
                    // Scenario
                } else if (sId.includes("scen")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("SCENARIO", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oScenList.getBinding("items").filter(oFilters);
                }
            },
            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             */
            handleClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Loc Dialog
                if (sId.includes("Loc")) {
                    that._oCore
                        .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                        .setValue("");
                    if (that.oLocList.getBinding("items")) {
                        that.oLocList.getBinding("items").filter([]);
                    }
                    // Prod Dialog
                } else if (sId.includes("prod")) {
                    that._oCore
                        .byId(this._valueHelpDialogProd.getId() + "-searchField")
                        .setValue("");
                    if (that.oProdList.getBinding("items")) {
                        that.oProdList.getBinding("items").filter([]);
                    }
                    // Version Dialog
                } else if (sId.includes("Ver")) {
                    that._oCore
                        .byId(this._valueHelpDialogVer.getId() + "-searchField")
                        .setValue("");
                    if (that.oVerList.getBinding("items")) {
                        that.oVerList.getBinding("items").filter([]);
                    }
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    that._oCore
                        .byId(this._valueHelpDialogScen.getId() + "-searchField")
                        .setValue("");
                    if (that.oScenList.getBinding("items")) {
                        that.oScenList.getBinding("items").filter([]);
                    }
                }
            },

            /**
             * This function is called when click on Go button.
             * In this function will get the data based on Inputs selected.
             * @param {object} oEvent -the event information.
             */
            onGetData: function (oEvent) {
                var oLoc = that.byId("idloc").getValue(),
                    oProd = that.byId("idprod").getValue(),
                    oVer = that.byId("idver").getValue(),
                    oModVer = that.byId("idComboBox").getSelectedKey(),
                    oDate = that.byId("fromDate").getValue(),
                    oScen = that.byId("idscen").getValue();
                that.oGModel = that.getOwnerComponent().getModel("oGModel");

                var oFilters = [];
                // if (oDate === "") {

                var newDate = new Date();
                newDate.setDate(newDate.getDate() - (newDate.getDay() + 6) % 7);

                // Checking if Location and Product selected
                if (oLoc !== "" && oProd !== "" && oVer !== "" && oScen !== "") {
                    var sFilter = new sap.ui.model.Filter({
                        path: "LOCATION_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oLoc,
                    });
                    oFilters.push(sFilter);

                    var sFilter = new sap.ui.model.Filter({
                        path: "PRODUCT_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oProd,
                    });
                    oFilters.push(sFilter);

                    if (oVer) {
                        var sFilter = new sap.ui.model.Filter({
                            path: "VERSION",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oVer,
                        });
                        oFilters.push(sFilter);
                    }
                    if (oModVer) {
                        var sFilter = new sap.ui.model.Filter({
                            path: "MODEL_VERSION",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oModVer,
                        });
                        oFilters.push(sFilter);
                    }
                    if (oScen) {
                        var sFilter = new sap.ui.model.Filter({
                            path: "SCENARIO",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oScen,
                        });
                        oFilters.push(sFilter);
                    }
                    if (oDate === "") {
                        var sFilter = new sap.ui.model.Filter({
                            path: "WEEK_DATE",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: newDate,
                        });
                        oFilters.push(sFilter);
                    }
                    else {
                        var sFilter = new sap.ui.model.Filter({
                            path: "WEEK_DATE",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oDate,
                        });
                        oFilters.push(sFilter);

                    }

                    sap.ui.core.BusyIndicator.show();
                    // Calling service to get the data based of filters
                    this.getView().getModel("oModel").read("/getCIRCharRate", {
                        filters: oFilters,
                        success: function (oData) {
                            var filterJSON = new JSONModel();
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.results.length === 0) {
                                newDate = that.getInMMddyyyyFormat(newDate);

                                sap.m.MessageToast.show("No data available for " + newDate + "");
                                filterJSON.setData([]);
                                var oVizFrame = that.byId("idVizFrame");
                                oVizFrame.setModel(filterJSON);
                            }
                            else {
                                oData.results.forEach(function (row) {
                                    // Calling function to handle the date format
                                    row.WEEK_DATE = that.getInMMddyyyyFormat(row.WEEK_DATE);
                                }, that);


                                filterJSON.setData({ results: oData.results });
                                var oVizFrame = that.byId("idVizFrame");
                                oVizFrame.setModel(filterJSON);
                                oVizFrame.setVizProperties({
                                    plotArea: { dataLabel: { visible: false } },
                                    title: {
                                        text: oData.results[1].WEEK_DATE,
                                        visible: true
                                    }
                                });
                                // that.byId("idObjectPageSub").setMode("Expanded");
                                that.byId("idObjectPageSub").setVisible(true);

                                var oPopOver = that.byId("idPopOver");
                                oPopOver.connect(oVizFrame.getVizUid());

                                that.byId("idSplitter").setVisible(true);


                                sap.ui.core.BusyIndicator.hide();
                                that.oGModel.setProperty("/tableData", oData.results)
                            }
                        },
                        error: function (data) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error While fetching data");
                        },
                    });
                } else {
                    sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario");
                }
                // }
                // else {
                //     that.dynamicCharts();
                // }
            },

            getInMMddyyyyFormat: function (oDate) {
                if (!oDate) {
                    oDate = new Date();
                }
                var month = oDate.getMonth() + 1;
                var date = oDate.getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                if (date < 10) {
                    date = "0" + date;
                }
                // return month + "/" + date + "/" + oDate.getFullYear();
                return oDate.getFullYear() + "-" + month + "-" + date;
            }
        });
    });
