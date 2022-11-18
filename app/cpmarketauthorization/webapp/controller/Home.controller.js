sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox) {
        "use strict";
        var that;
        return Controller.extend("cpapp.cpmarketauthorization.controller.Home", {
            onInit: function () {

                that = this;
                that.TableModel = new JSONModel();
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.verModel = new JSONModel();
                that.scenModel = new JSONModel();
                that.TableModel.setSizeLimit(1000);
                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                that.verModel.setSizeLimit(1000);
                that.scenModel.setSizeLimit(1000);
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpmarketauthorization.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpmarketauthorization.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogVer) {
                    this._valueHelpDialogVer = sap.ui.xmlfragment(
                        "cpapp.cpmarketauthorization.view.VersionDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogVer);
                }
                if (!this._valueHelpDialogScen) {
                    this._valueHelpDialogScen = sap.ui.xmlfragment(
                        "cpapp.cpmarketauthorization.view.ScenarioDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogScen);
                }
            },
            onAfterRendering: function () {
                that.aOrder = [];
                that.bOrder = [];

                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("idprod");
                this.oVer = this.byId("idver");
                this.oScen = this.byId("idscen");
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
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Loc Dialog
                if (sId.includes("loc")) {
                    that._valueHelpDialogLoc.open();
                    // Prod Dialog
                } else if (sId.includes("prod")) {
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                }
                else if (sId.includes("ver")) {
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
                    that.byId("fromDate").setValue("");
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
                }
                else if (sId.includes("prod")) {
                    var oFilter = [];
                    var sFilter = [];
                    var locFilter = [];
                    that.oProd = that.byId("idprod");
                    var array = [];
                    aSelectedItems = oEvent.getParameters("selectedItems").selectedItems;
                    for (var i in aSelectedItems) {
                        array[i] = (aSelectedItems[i].getTitle());
                        oFilter.push(sFilter);
                    }
                    that.oGModel.setProperty("/SelectedProd",array);
                    that.oProd.setValue(array);
                    that.byId("fromDate").setValue("");
                    that.oVer.setValue("");
                    that.oScen.setValue("");
                    this.getView().getModel("oModel").callFunction("/getAllVerScen", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                            // PRODUCT_ID: aSelectedItems[0].getTitle()     
                        },
                        success: function (oData) {
                            if (oData.results.length === 0) {
                                sap.m.MessageToast.show("No versions available for choosen Location/Product. Please choose another.");
                                that.verModel.setData([]);
                                that.oVerList.setModel(that.verModel);
                                // that.byId("fromDate").setEditable(false);
                                // sap.ui.core.BusyIndicator.hide();
                            }
                            else {
                                var adata = [];
                                for (var i = 0; i < oData.results.length; i++) {
                                    for (var j = 0; j < aSelectedItems.length; j++){
                                    if (oData.results[i].PRODUCT_ID === aSelectedItems[j].getTitle()) {
                                        // adata.push({
                                        //     "VERSION": oData.results[i].VERSION
                                        // });
                                        if (that.aOrder.indexOf(oData.results[i].VERSION) === -1) {
                                            that.aOrder.push(oData.results[i].VERSION);
                                            if (oData.results[i].VERSION !== "") {
                                                that.oOrdData = {
                                                    "VERSION": oData.results[i].VERSION
                                                };
                                                adata.push(that.oOrdData);
                                            }
                                        }
                                    }
                                }
                                }
                                
                                if (adata.length > 0) {
                                    that.verModel.setData({
                                        results: adata
                                    });
                                    that.oVerList.setModel(that.verModel);
                                }
                                // sap.ui.core.BusyIndicator.hide();
                            }
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });

                }
                else if (sId.includes("Ver")) {
                    this.oVer = that.byId("idver");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oVer.setValue(aSelectedItems[0].getTitle());
                    that.oScen.setValue("");
                    that.oGModel.setProperty(
                        "/SelectedVer",
                        aSelectedItems[0].getTitle()
                    );
                    var vProd = that.oGModel.getProperty("/SelectedProd");
                    this.getView().getModel("oModel").callFunction("/getAllVerScen", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                            // PRODUCT_ID: aSelectedItems[0].getTitle()
                            // VERSION:  aSelectedItems[0].getTitle()
                        },
                        success: function (oData) {
                            var adata = [];
                            for (var i = 0; i < oData.results.length; i++) {
                                for(var j=0;j< vProd.length;j++){
                                if (oData.results[i].PRODUCT_ID === vProd[j]
                                    && oData.results[i].VERSION === aSelectedItems[0].getTitle()) {
                                    // adata.push({
                                    //     "SCENARIO": oData.results[i].SCENARIO
                                    // });
                                    if (that.bOrder.indexOf(oData.results[i].SCENARIO) === -1) {
                                        that.bOrder.push(oData.results[i].SCENARIO);
                                        if (oData.results[i].SCENARIO !== "") {
                                            that.bOrdData = {
                                                "SCENARIO": oData.results[i].SCENARIO
                                            };
                                            adata.push(that.bOrdData);
                                        }
                                    }
                                }
                            }
                            }
                            if (adata.length > 0) {
                                that.scenModel.setData({
                                    results: adata
                                });
                                that.oScenList.setModel(that.scenModel);
                            }
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                }
                else if (sId.includes("scen")) {
                    sap.ui.core.BusyIndicator.show();
                    this.oScen = that.byId("idscen");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oScen.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedScen",
                        aSelectedItems[0].getTitle()
                    );
                    sap.ui.core.BusyIndicator.hide();
                }
                that.handleClose(oEvent);
            },
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
                }
                else if (sId.includes("Ver")) {
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
            onNavPress: function () {
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                    // generate the Hash to display 
                    var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "vcpdocdisplay",
                            action: "Display"
                        }
                    })) || "";
                    //Generate a  URL for the second application
                    var url = window.location.href.split('#')[0] + hash;
                    //Navigate to second app
                    sap.m.URLHelper.redirect(url, true);


                }
            },
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
                }
                else if (sId.includes("Ver")) {
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
            onResetDate: function () {
                that.oLoc.setValue("");
                that.oProd.setValue("");
                that.oVer.setValue("");
                that.oScen.setValue("");
                that.byId("fromDate").setValue("");
            },
            onGetData: function () {
                var oLoc = that.byId("idloc").getValue(),
                oprod = that.byId("idprod").getValue(),
                oVers = that.byId("idver").getValue(),
                oScen = that.byId("idscen").getValue();
                
                var FromDate = that.byId("fromDate").getFrom();
                var ToDate = that.byId("fromDate").getTo();

                var oEntry = {
                    MARKETDATA: [],
                };
                var vList = {};
                
                if (oLoc && oprod && oVers && oScen &&FromDate && ToDate){
                    var oProd = that.oGModel.getProperty("/SelectedProd");
                for (var i in oProd) {
                    vList = {
                        LOCATION_ID: oLoc,
                        PRODUCT_ID: oProd[i],
                        VERSION:oVers,
                        SCENARIO:oScen,
                        FROMDATE: FromDate,
                        TODATE: ToDate
                    };
                    oEntry.MARKETDATA.push(vList);
                }

                    this.getView().getModel("oModel").callFunction("/generateMarketAuth", {
                        method: "GET",
                        urlParameters: {
                            MARKETDATA: JSON.stringify(oEntry.MARKETDATA)
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Market Data Authorised");

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error creating Market Data");
                        },
                    });
                }
                else{
                    sap.m.MessageToast.show("Select Location/Product/Version/Scenario/Date");
                }
            }
        });
    });
