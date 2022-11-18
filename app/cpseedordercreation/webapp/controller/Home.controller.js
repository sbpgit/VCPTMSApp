sap.ui.define([
    "cpapp/cpseedordercreation/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/library",
    "sap/ui/model/Sorter",
    "jquery.sap.global",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/Button"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, library, Sorter, jquery,Dialog, mobileLibrary, Text, Button) {
        "use strict";
        var that, oGModel;
        var DialogType = mobileLibrary.DialogType;
        var ButtonType = mobileLibrary.ButtonType;

        return BaseController.extend("cpapp.cpseedordercreation.controller.Home", {
            onInit: function () {
                that = this;
                
                // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.uniqModel = new JSONModel();
                that.custModel = new JSONModel();

                that.oModel.setSizeLimit(1000);
                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                that.uniqModel.setSizeLimit(1000);
                that.custModel.setSizeLimit(1000);

                // Declaring Value Help Dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpseedordercreation.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpseedordercreation.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }

                if (!this._valueHelpDialogUniq) {
                    this._valueHelpDialogUniq = sap.ui.xmlfragment(
                        "cpapp.cpseedordercreation.view.UniqId",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogUniq);
                }

                if (!this._valueHelpDialogOrderCreate) {
                    this._valueHelpDialogOrderCreate = sap.ui.xmlfragment(
                        "cpapp.cpseedordercreation.view.OrderCreate",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogOrderCreate);
                }

            },
            /**
      * Called after the view has been rendered
      * Calls the getData[function] to get Data
      */
            onAfterRendering: function () {
                that = this;
                that.oGModel = that.getModel("oGModel");
                that.oGModel.setProperty("/selFlag", "");
                that.oGModel.setProperty("/OrderFlag", "");
                that.oList = this.byId("orderList");
                this.byId("headSearch").setValue("");
                // if (that.oList.getBinding("items")) {
                //     that.oList.getBinding("items").filter([]);
                // }

                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("prodInput");

                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");

                // this.oProdList = this._oCore.byId(
                //     this._valueHelpDialogProd.getId() + "-list"
                // );
                // this.oLocList = this._oCore.byId(
                //     this._valueHelpDialogLoc.getId() + "-list"
                // );


                // this.oUniqList = this._oCore.byId(
                //     this._valueHelpDialogUniq.getId() + "-list"
                // );

                this.oProdList = sap.ui.getCore().byId("prodSlctList");
                this.oLocList = sap.ui.getCore().byId("LocSlctList");
                this.oUniqList = sap.ui.getCore().byId("UniqSlctList");

                sap.ui.core.BusyIndicator.show();
                // Calling service to get Location data
                this.getModel("BModel").read("/getLocation", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.locModel.setData(oData);
                        that.oLocList.setModel(that.locModel);
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });

                // service to get the products based of location
                // this.getModel("BModel").read("/getLocProdDet", {
                //     success: function (oData) {
                //         // that.prodModel.setData(oData);
                //         // that.oProdList.setModel(that.prodModel);
                //     },
                //     error: function (oData, error) {
                //         MessageToast.show("error");
                //     },
                // });
            },
            /**
               * This function is called when click on Value help on Input box.
               * In this function based in sId will open the dialogs.
               * @param {object} oEvent -the event information.
               */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Loc Dialog
                if (sId.includes("loc")) {
                    that._valueHelpDialogLoc.open();
                    // Prod Dialog
                } else if (sId.includes("prod")) {
                    // that._valueHelpDialogProd.open();
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                    // } else if (sId.includes("Location")) {
                    //     that._valueHelpDialogLoc.open();
                    //     // Prod Dialog
                    // } else if (sId.includes("Product")) {
                    //     if (sap.ui.getCore().byId("idLocation").getValue()) {
                    //         that._valueHelpDialogProd.open();
                    //     } else {
                    //         MessageToast.show("Select Location");
                    //     }

                    // Uniq ID Dialog
                } else if (sId.includes("Uniq")) {
                    if (sap.ui.getCore().byId("idLocation").getValue() &&
                        sap.ui.getCore().byId("idProduct").getValue()) {


                        sap.ui.core.BusyIndicator.show();
                        // service to get the Uniq ID's based of location and products
                        this.getModel("BModel").read("/getUniqueHeader", {
                            filters: [
                                new Filter(
                                    "LOCATION_ID",
                                    FilterOperator.EQ,
                                    sap.ui.getCore().byId("idLocation").getValue()
                                ),
                                new Filter(
                                    "PRODUCT_ID",
                                    FilterOperator.EQ,
                                    sap.ui.getCore().byId("idProduct").getValue()
                                ),
                            ],
                            success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();

                                oData.results.forEach(function (row) {
                                    row.UNIQUE_ID = row.UNIQUE_ID.toString();

                                }, that);
                                that.uniqModel.setData(oData);
                                that.oUniqList.setModel(that.uniqModel);
                                that._valueHelpDialogUniq.open();
                            },
                            error: function (oData, error) {
                                sap.ui.core.BusyIndicator.hide();
                                MessageToast.show("error");
                            },
                        });
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             * In this function based in sId will close the dialogs.
             */
            handleClose: function (oEvent) {
                // var sId = oEvent.getParameter("id");
                var sId = oEvent.getSource().getParent().mAssociations.initialFocus.split("-")[0];
                // Loc Dialog
                if (sId.includes("Loc")) {
                    sap.ui.getCore().byId("LocSearch").setValue("");
                    // that._oCore
                    //     .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                    //     .setValue("");
                    if (that.oLocList.getBinding("items")) {
                        that.oLocList.getBinding("items").filter([]);
                    }
                    sap.ui.getCore().byId("LocSlctList").removeSelections();
                    that._valueHelpDialogLoc.close();
                    // Prod Dialog
                } else if (sId.includes("Prod")) {
                    sap.ui.getCore().byId("ProdSearch").setValue("");
                    // that._oCore
                    //     .byId(this._valueHelpDialogProd.getId() + "-searchField")
                    //     .setValue("");
                    if (that.oProdList.getBinding("items")) {
                        that.oProdList.getBinding("items").filter([]);
                    }
                    sap.ui.getCore().byId("prodSlctList").removeSelections();
                    that._valueHelpDialogProd.close();
                    // Uniq ID
                } else if (sId.includes("Uniq")) {
                    sap.ui.getCore().byId("UniqSearch").setValue("");
                    // that._oCore
                    //     .byId(this._valueHelpDialogUniq.getId() + "-searchField")
                    //     .setValue("");
                    if (that.oUniqList.getBinding("items")) {
                        that.oUniqList.getBinding("items").filter([]);
                    }
                    sap.ui.getCore().byId("UniqSlctList").removeSelections()
                    that._valueHelpDialogUniq.close();
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
                } else if (sId.includes("Prod")) {
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
                    // Uniq ID
                } else if (sId.includes("Uniq")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("UNIQUE_ID", FilterOperator.EQ, sQuery),
                                    new Filter("UNIQUE_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oUniqList.getBinding("items").filter(oFilters);
                } else if (sId.includes("head")) {
                    if (sQuery !== "") {

                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("UNIQUE_ID", FilterOperator.EQ, sQuery),
                                    new Filter("SEED_ORDER", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oList.getBinding("items").filter(oFilters);
                }
            },

            /**
             * This function is called when selection on dialogs list.
             * Selections will be made based on sId.
             * @param {object} oEvent -the event information.
             */
            handleSelection: function (oEvent) {
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    Flag = that.oGModel.getProperty("/selFlag");
                //Location list
                if (sId.includes("Loc")) {

                    var aSelectedLoc = oEvent.getParameter("selectedItems");

                    if (Flag === "") {
                        this.oLoc = that.byId("idloc");
                        this.oProd = that.byId("prodInput");
                    } else if (Flag === "X") {
                        this.oLoc = sap.ui.getCore().byId("idLocation");
                        this.oProd = sap.ui.getCore().byId("idProduct");
                    }

                    // that.oLoc.setValue(aSelectedLoc[0].getTitle());
                    that.oLoc.setValue(oEvent.getParameters().listItem.getCells()[0].getTitle());
                    that.oProd.setValue("");


                    // service to get the products based of location
                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                oEvent.getParameters().listItem.getCells()[0].getTitle()
                                // aSelectedLoc[0].getTitle()
                            ),
                        ],
                        // that.getModel("BModel").callFunction("/getAllProd", {
                        //     method: "GET",
                        //     urlParameters: {
                        //         LOCATION_ID: aSelectedLoc[0].getTitle()
                        //     },
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

                    var aSelectedProd = oEvent.getParameter("selectedItems");
                    if (Flag === "") {
                        this.oProd = that.byId("prodInput");
                    } else if (Flag === "X") {
                        this.oProd = sap.ui.getCore().byId("idProduct");
                    }
                    // that.oProd.setValue(aSelectedProd[0].getTitle());
                    that.oProd.setValue(oEvent.getParameters().listItem.getCells()[0].getTitle());
                    // sap.ui.core.BusyIndicator.show();
                    // // service to get the Uniq ID's based of location and products
                    // this.getModel("BModel").read("/getUniqueHeader", {
                    //     filters: [
                    //         new Filter(
                    //             "LOCATION_ID",
                    //             FilterOperator.EQ,
                    //             sap.ui.getCore().byId("idLocation").getValue()
                    //         ),
                    //         new Filter(
                    //             "PRODUCT_ID",
                    //             FilterOperator.EQ,
                    //             sap.ui.getCore().byId("idProduct").getValue()
                    //         ),
                    //     ],
                    //     success: function (oData) {
                    //         sap.ui.core.BusyIndicator.hide();

                    //         oData.results.forEach(function (row) {
                    //             row.UNIQUE_ID = row.UNIQUE_ID.toString();

                    //         }, that);
                    //         that.uniqModel.setData(oData);
                    //         that.oUniqList.setModel(that.uniqModel);
                    //     },
                    //     error: function (oData, error) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         MessageToast.show("error");
                    //     },
                    // });
                    // Uniq ID list
                } else if (sId.includes("Uniq")) {
                    var aSelectedProd = oEvent.getParameter("selectedItems");
                    this.oUniq = sap.ui.getCore().byId("idUniq");
                    that.oUniq.setValue(oEvent.getParameters().listItem.getCells()[0].getTitle());
                }
                that.handleClose(oEvent);
            },

            onGetData: function (oEvent) {
                var loc = that.byId("idloc").getValue(),
                    Prod = that.byId("prodInput").getValue();
                that.oGModel.setProperty("/locationID", loc);
                that.oGModel.setProperty("/productID", Prod);

                var oFilters = [];

                // getting the filters

                if (loc !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("LOCATION_ID", FilterOperator.EQ, loc),
                            ],
                            and: true,
                        })
                    );
                }
                if (Prod !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("PRODUCT_ID", FilterOperator.EQ, Prod),
                            ],
                            and: true,
                        })
                    );
                }
                if (loc !== "" && Prod !== "") {
                    this.byId("headSearch").setValue("");
                    if (that.oList.getItems().length) {
                        that.oList.getBinding("items").filter(oFilters);
                    }

                    this.getModel("BModel").read("/getSeedOrder", {
                        filters: [oFilters],
                        // filters: [ new Filter( "LOCATION_ID",  FilterOperator.EQ,  loc ),
                        //            new Filter( "PRODUCT_ID", FilterOperator.EQ, Prod ), ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            // that.oModel = new JSONModel();
                            if (oData.results.length === 0) {
                                that.byId("idSort").setVisible(false);
                                that.oModel.setData([]);
                                that.oList.setModel(that.oModel);
                                sap.m.MessageToast.show("No Data available to show.");
                            }
                            else {

                                oData.results.forEach(function (row) {
                                    // Calling function to handle the date format
                                    // row.UNIQUE_ID = row.UNIQUE_ID.toString();
                                    row.ORD_QTY = parseFloat(row.ORD_QTY);
                                }, that);

                                that.byId("idSort").setVisible(true);

                                that.oModel.setData(oData);
                                that.oList.setModel(that.oModel);
                            }
                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get profiles");
                        },
                    });
                } else {
                    MessageToast.show("Please select Location and Product");
                }
            },

            onResetDate: function () {
                that.byId("idloc").setValue("");
                that.byId("prodInput").setValue("");
                that.byId("idSort").setVisible(false);

                that.oModel.setData({
                    results: that.TabData,
                });
                that.oList.setModel(that.oModel);


            },

            onOrderCreate: function () {

                var oLoc = that.byId("idloc").getValue(),
                    oProd = that.byId("prodInput").getValue();


                if (oLoc !== "" && oProd !== "") {
                    that._valueHelpDialogOrderCreate.open();
                    that.oGModel.setProperty("/selFlag", "X");
                    that.oGModel.setProperty("/OrderFlag", "C");
                    that._valueHelpDialogOrderCreate.setTitle("Create Order");
                    sap.ui.getCore().byId("idLocation").setValue(oLoc);
                    sap.ui.getCore().byId("idProduct").setValue(oProd);
                } else {
                    MessageToast.show("Please select Location and Product");
                }
            },

            onEdit: function (oEvent) {
                that._valueHelpDialogOrderCreate.setTitle("Update Order");
                var sSelRow = oEvent.getSource().getParent().getBindingContext().getObject();
                var date = sSelRow.MAT_AVAILDATE.toISOString().split("T")[0];
                that.oGModel.setProperty("/OrderFlag", "E");
                sap.ui.getCore().byId("idLabelSeed").setVisible(true);
                sap.ui.getCore().byId("idseedord").setVisible(true);
                sap.ui.getCore().byId("idseedord").setEditable(false);
                sap.ui.getCore().byId("idLocation").setEditable(false);
                sap.ui.getCore().byId("idProduct").setEditable(false);
                sap.ui.getCore().byId("idUniq").setEditable(false);
                sap.ui.getCore().byId("idseedord").setValue(sSelRow.SEED_ORDER);
                sap.ui.getCore().byId("idLocation").setValue(sSelRow.LOCATION_ID);
                sap.ui.getCore().byId("idProduct").setValue(sSelRow.PRODUCT_ID);
                sap.ui.getCore().byId("idUniq").setValue(sSelRow.UNIQUE_ID);
                sap.ui.getCore().byId("idQuantity").setValue(sSelRow.ORD_QTY);
                sap.ui.getCore().byId("idDate").setValue(date);
                that._valueHelpDialogOrderCreate.open();
            },

            onCancelOrder: function () {
                sap.ui.getCore().byId("idLocation").setValue("");
                sap.ui.getCore().byId("idProduct").setValue("");
                sap.ui.getCore().byId("idUniq").setValue("");
                sap.ui.getCore().byId("idQuantity").setValue("");
                sap.ui.getCore().byId("idDate").setValue("");
                that.oGModel.setProperty("/selFlag", "");
                that.oGModel.setProperty("/OrderFlag", "");
                sap.ui.getCore().byId("idLabelSeed").setVisible(false);
                sap.ui.getCore().byId("idseedord").setVisible(false);
                // sap.ui.getCore().byId("idLocation").setEditable(true);
                // sap.ui.getCore().byId("idProduct").setEditable(true);
                sap.ui.getCore().byId("idUniq").setEditable(true);
                sap.ui.getCore().byId("idQuantity").setValueState("None");
                that._valueHelpDialogOrderCreate.close();
            },

            onNumChange: function () {

                var squan = sap.ui.getCore().byId("idQuantity").getValue();
                sap.ui.getCore().byId("idQuantity").setValueState("None");

                if (squan < 1) {

                    sap.ui.getCore().byId("idQuantity").setValue("");
                    sap.ui.getCore().byId("idQuantity").setValueState("Error");
                    sap.ui.getCore().byId("idQuantity").setValueStateText("Quantity can not be empty or 0");
                }

                if (squan.includes(".")) {
                    sap.ui.getCore().byId("idQuantity").setValueState("Error");
                    sap.ui.getCore().byId("idQuantity").setValueStateText("Decimals not allowed");
                }
            },

            onSaveOrder: function () {
                var sLoc = sap.ui.getCore().byId("idLocation").getValue(),
                    sProd = sap.ui.getCore().byId("idProduct").getValue(),
                    sUniq = parseInt(sap.ui.getCore().byId("idUniq").getValue()),
                    squan = parseInt(sap.ui.getCore().byId("idQuantity").getValue()),
                    sDate = sap.ui.getCore().byId("idDate").getValue(),
                    sSeedOrder = sap.ui.getCore().byId("idseedord").getValue();
                var oEntry = {
                    SEEDDATA: [],
                },
                    vRuleslist,
                    seedOrder;
                var oFlag = that.oGModel.getProperty("/OrderFlag");

                if (oFlag === "C") {
                    seedOrder = "0";
                } else if (oFlag === "E") {
                    seedOrder = sSeedOrder;
                }
                vRuleslist = {
                    SEED_ORDER: seedOrder,
                    LOCATION_ID: sLoc,
                    PRODUCT_ID: sProd,
                    UNIQUE_ID: sUniq,
                    ORD_QTY: squan,
                    MAT_AVAILDATE: sDate,
                };
                oEntry.SEEDDATA.push(vRuleslist);
                if (squan && sDate !== "" && sUniq) {
                    if (sap.ui.getCore().byId("idQuantity").getValueState() !== "Error") {
                        that.getModel("BModel").callFunction("/maintainSeedOrder", {
                            method: "GET",
                            urlParameters: {
                                FLAG: oFlag,
                                SEEDDATA: JSON.stringify(oEntry.SEEDDATA)
                            },
                            success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Seed Order created/ updated successfully");
                                that.onCancelOrder();
                                that.onGetData();
                            },
                            error: function (error) {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Error creating a Seed Order ");
                            },
                        });
                    } else {
                        sap.m.MessageToast.show("Decimals are not allowed");
                    }
                } else {
                    sap.m.MessageToast.show("Please fill all fields");
                }
            },

            /*Open sort Dialog*/
            handleSortButtonPressed: function () {
                that = this;
                if (!that._pDialog) {
                    that._pDialog = sap.ui.xmlfragment("cpapp.cpseedordercreation.view.SortDialog", that);
                    that.getView().addDependent(that._pDialog);
                }
                that._pDialog.open();
            },

            /*Sorting Operation*/
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("orderList"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
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
            onDelete: function (oEvent) {
                var sSeedOrder = oEvent.getSource().getBindingContext().getProperty().SEED_ORDER,
                sloc = oEvent.getSource().getBindingContext().getProperty().LOCATION_ID,
                sprod=oEvent.getSource().getBindingContext().getProperty().PRODUCT_ID,
                sUniq = oEvent.getSource().getBindingContext().getProperty().UNIQUE_ID,
                sOrd = oEvent.getSource().getBindingContext().getProperty().ORD_QTY,
                sMatAvail=oEvent.getSource().getBindingContext().getProperty().MAT_AVAILDATE;
                var oEntry = {
                    SEEDDATA: [],
                },
                    vRuleslist;
                vRuleslist = {
                    SEED_ORDER: sSeedOrder,
                    LOCATION_ID: sloc,
                    PRODUCT_ID: sprod,
                    UNIQUE_ID: sUniq,
                    ORD_QTY: sOrd,
                    MAT_AVAILDATE: sMatAvail,
                };
                oEntry.SEEDDATA.push(vRuleslist);
if (!this.oApproveDialog) {
                        this.oApproveDialog = new Dialog({
                            type: DialogType.Message,
                            title: sSeedOrder,
                            content: new Text({ text: "Do you want to delete this Seed Order?" }),
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "Submit",
                                press: function () {
                                    sap.ui.core.BusyIndicator.show();
                                    var oModel = this.getView().getModel("BModel");
                                    oModel.callFunction("/maintainSeedOrder", {
                                        method: "GET",
                                        urlParameters: {
                                            FLAG: "d",
                                            SEEDDATA: JSON.stringify(oEntry.SEEDDATA) 
                                        },
                                        success: function (oData, response) {
                                            that.onGetData();
                                            that.oApproveDialog.close();
                                            sap.ui.core.BusyIndicator.hide();
                                            sap.m.MessageToast.show("Seed Order Deleted Successfully");
                                        },
                                        error: function (e) {
                                            sap.ui.core.BusyIndicator.hide();
                                            sap.m.MessageToast.show("Failed to delete SeedOrder");
                                        }
                                    });
                                    
                                }.bind(this)
                            }),
                            endButton: new Button({
                                text: "Cancel",
                                press: function () {
                                    this.oApproveDialog.close();
                                }.bind(this)
                            })
                        });
                    }
                    this.oApproveDialog.open();
            }
        });
    });
