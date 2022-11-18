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
                that.TableModel.setSizeLimit(1000);
                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
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
            },
            onAfterRendering: function () {
                that.aOrder = [];
                that.aSelOrder = [];
                
                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("idprod");
                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
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
                    var oFilter =[];
                    var sFilter =[];
                    var locFilter =[];
                    that.oProd = that.byId("idprod");
                    var array = [];
                    aSelectedItems = oEvent.getParameters("selectedItems").selectedItems;

                    for (var i in aSelectedItems) {
                        array[i] = (aSelectedItems[i].getTitle());
                    //    sFilter =  new Filter("PRODUCT_ID",FilterOperator.EQ, aSelectedItems[i].getTitle())
                    //                 oFilter.push(sFilter);
                    }
                    // locFilter = new Filter("LOCATION_ID",FilterOperator.EQ,that.oGModel.getProperty("/SelectedLoc"));
                    // oFilter.push(locFilter);
                    
                    that.oGModel.setProperty(
                        "/SelectedProd",
                        array
                    );
                    that.oProd.setValue(array);
                    that.byId("fromDate").setValue("");
                    // that.getView().getModel("oModel").read("/getCIRCharRate", {
                    //     filters: [oFilter],
                    //     success: function (oData1) {

                    //         if (oData1.results.length === 0) {
                    //             that.oDateModel = new JSONModel();
                    //             that.oDateModel.setData([]);
                    //             that.byId("fromDate").setModel(that.oDateModel);
                    //             sap.ui.core.BusyIndicator.hide();
                    //             sap.m.MessageToast.show("No dates available for the selected criteria.");
                    //             // that.byId("fromDate").setEditable(false);
                    //         }
                    //         else {
                    //             sap.ui.core.BusyIndicator.hide();
                    //             oData1.results.forEach(function (row) {
                    //                 // Calling function to handle the date format
                    //                 row.WEEK_DATE = that.getInMMddyyyyFormat(row.WEEK_DATE);
                    //             }, that);

                    //             for (var i = 0; i < oData1.results.length; i++) {

                    //                 if (that.aOrder.indexOf(oData1.results[i].WEEK_DATE) === -1) {
                    //                     that.aOrder.push(oData1.results[i].WEEK_DATE);
                    //                     if (oData1.results[i].WEEK_DATE !== "") {
                    //                         that.oOrdData = {
                    //                             "WEEK_DATE": oData1.results[i].WEEK_DATE
                    //                         };
                    //                         that.aSelOrder.push(that.oOrdData);
                    //                     }
                    //                 }
                    //             }
                    //             that.oDateModel = new JSONModel();
                    //             that.oDateModel.setData({ resultsCombos: that.aSelOrder });
                    //             that.byId("fromDate").setModel(that.oDateModel);
                    //             that.byId("fromDate").setEditable(true);

                    //         }

                    //     },
                    //     error: function (oData, error) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         MessageToast.show("error");
                    //     },
                    // });
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
            },
            onResetDate: function () {
                that.oLoc.setValue("");
                that.oProd.setValue("");
                that.byId("fromDate").setValue("");
            },
            onGetData: function () {
                var oLoc = that.oGModel.getProperty("/SelectedLoc"),
                    oProd = that.oGModel.getProperty("/SelectedProd");
                    var FromDate = that.byId("fromDate").getFrom();
                    var ToDate = that.byId("fromDate").getTo();
                    var oEntry = {
                        MARKETDATA: [],
                    };
                        var vList={};
                        for(var i in oProd){
                        vList={
                            LOCATION_ID:oLoc,
                            PRODUCT_ID:oProd[i],
                            FROMDATE:FromDate,
                            TODATE:ToDate
                        };
                        oEntry.MARKETDATA.push(vList);
                    }
                        if(oLoc && oProd)
                        
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
        });
    });
