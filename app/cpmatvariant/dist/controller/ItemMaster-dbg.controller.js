sap.ui.define(
    [
        "cpapp/cpmatvariant/controller/BaseController",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/Device",
    ],
    function (
        BaseController,
        MessageToast,
        JSONModel,
        Filter,
        FilterOperator,
        MessageBox,
        Device
    ) {
        "use strict";
        var that, oGModel;

        return BaseController.extend("cpapp.cpmatvariant.controller.ItemMaster", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                this.locModel = new JSONModel();
                this.prodModel = new JSONModel();

                // Declaring JSON Models and size limit
                that.oCharModel = new JSONModel();
                that.charnameModel = new JSONModel();
                that.charvalueModel = new JSONModel();

                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                this.oModel.setSizeLimit(1000);
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
                this.bus.publish("nav", "toBeginPage", {
                    viewName: this.getView().getProperty("viewName"),
                });
                // Declaring value help dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }

                if (!this._valueHelpDialogDescUpdate) {
                    this._valueHelpDialogDescUpdate = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.UniqueDescUpdate",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogDescUpdate);
                }

                if (!this._addCharacteristic) {
                    this._addCharacteristic = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.AddCharacterstics",
                        this
                    );
                    this.getView().addDependent(this._addCharacteristic);
                }

                if (!this._createCharacterstics) {
                    this._createCharacterstics = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.CreateChar",
                        this
                    );
                    this.getView().addDependent(this._createCharacterstics);
                }

                if (!this._copyCharacterstics) {
                    this._copyCharacterstics = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.CopyChar",
                        this
                    );
                    this.getView().addDependent(this._copyCharacterstics);
                }

                if (!this._valueHelpDialogclassName) {
                    this._valueHelpDialogclassName = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.className",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogclassName);
                }
            },

            /**
             * This function is to refreshing Master page data.
             */
            refreshMaster: function () {
                this.onAfterRendering();
            },

            /**
             * Called after the view has been rendered
             */
            onAfterRendering: function () {
                that = this;
                that.oLoc = this.byId("idloc");
                this.oProd = this.byId("prodInput");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogProd.setTitleAlignment("Center");

                that.oTableData = [];
                sap.ui.getCore().byId("idUniqDesc1").setValue("");
                // var oCharTable = sap.ui.getCore().byId("idCharItem");
                that.ListModel = new JSONModel();

                that.ListModel.setData({
                    results: that.oTableData
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
                oGModel = this.getModel("oGModel");
                oGModel.setProperty("/New", "");
                sap.ui.core.BusyIndicator.show();

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
            },

            /**
             * This function is called when click on Input box Value Help.
             * Dialogs will be open based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                // oGModel = this.getModel("oGModel");
                var sId = oEvent.getParameter("id");
                oGModel.setProperty("/mainSID", sId);
                // Loc Dialog
                if (sId.includes("loc")) {
                    that._valueHelpDialogLoc.open();
                    // Prod Dialog
                } else if (sId.includes("prod")) {
                    if (that.byId("idloc").getValue() !== "") {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             * Dialogs will be closed based on sId
             */
            handleClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Loc Dialog
                if (sId.includes("loc")) {
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
                if (sId.includes("loc")) {
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

            /**
             * This function is called when selection of values in dialogs.
             * after selecting value, based on selection get data of other filters.
             * @param {object} oEvent -the event information.
             */
            handleSelection: function (oEvent) {
                // oGModel = this.getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                    mainSID = oGModel.getProperty("/mainSID"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                //Location list
                if (sId.includes("Loc")) {
                    this.oLoc = that.byId("idloc");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    if (mainSID === "__xmlview1--idloc") {
                        that.oLoc.setValue(aSelectedItems[0].getTitle());

                    }
                    else if (mainSID === "locId1") {
                        sap.ui.getCore().byId("locId1").setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "locIdCC") {
                        sap.ui.getCore().byId("locIdCC").setValue(aSelectedItems[0].getTitle());
                    }
                    that.oProd.setValue();
                    that.oProd.removeAllTokens();
                    this._valueHelpDialogProd
                        .getAggregation("_dialog")
                        .getContent()[1]
                        .removeSelections();
                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                aSelectedItems[0].getTitle()
                            ),
                        ],
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
                    this.oProd = that.byId("prodInput");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    if (mainSID === "__xmlview1--prodInput") {
                        that.oProd.setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "prodId1") {
                        sap.ui.getCore().byId("prodId1").setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "prodIdCC") {
                        sap.ui.getCore().byId("prodIdCC").setValue(aSelectedItems[0].getTitle());
                    }
                }
                that.handleClose(oEvent);
            },

            /**
             * This function is called when click on Go button.
             * @param {object} oEvent -the event information.
             */
            onGetData: function (oEvent) {
                var oSloc = that.oLoc.getValue(),
                    oSprod = that.oProd.getValue(),
                    oSUniq = that.byId("idUnique").getSelectedKey();

                oGModel.setProperty("/prdId", "");
                oGModel.setProperty("/locId", "");
                oGModel.setProperty("/uniqId", "");

                var oFilters = [];
                // getting the filters
                oFilters.push(
                    new Filter({
                        filters: [
                            new Filter("LOCATION_ID", FilterOperator.EQ, oSloc),
                            new Filter("PRODUCT_ID", FilterOperator.EQ, oSprod),
                        ],
                        and: true,
                    })
                );

                if (oSUniq !== "A") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("UID_TYPE", FilterOperator.EQ, oSUniq)
                            ],
                            and: true,
                        })
                    );
                }
                if (oSloc !== "" && oSprod !== "") {
                    sap.ui.core.BusyIndicator.show();
                    this.getModel("BModel").read("/getUniqueHeader", {
                        filters: [oFilters],                   
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.results.length) {
                                that.oModel.setData({
                                    results: oData.results,
                                });
                                oGModel.setProperty("/uniqueData", oData.results);
                                that.byId("idMatVHead").setModel(that.oModel);
                                oGModel.setProperty("/locId", oData.results[0].LOCATION_ID);
                                oGModel.setProperty("/prdId", oData.results[0].PRODUCT_ID);
                                oGModel.setProperty("/uniqId", oData.results[0].UNIQUE_ID);
                                oGModel.setProperty("/uid_rate", oData.results[0].UID_RATE);
                                // Setting the default selected item for table
                                that.byId("idMatVHead").setSelectedItem(that.byId("idMatVHead").getItems()[0], true);
                                that.byId("idCreateBtn").setVisible(true);
                                that.byId("idCopyBtn").setVisible(true);
                                // Calling function to navigate to Item detail page
                                // that.onhandlePress();
                            } else {
                                that.oModel.setData({
                                    results: [],
                                });
                                oGModel.setProperty("/uniqueData", oData.results);
                                that.byId("idMatVHead").setModel(that.oModel);
                                MessageToast.show("No data for the selected Location Product");
                            }
                            that.byId("idCreateBtn").setVisible(true);
                            that.byId("idCopyBtn").setVisible(true);
                            // Calling function to navigate to Item detail page
                            that.onhandlePress();
                       },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get data");
                        },
                    });
                } else {
                    MessageToast.show("Please select Location and Product");
                }
            },

            /**
             * Called when it routes to a page containing the item details.
             */
            onhandlePress: function (oEvent) {
                oGModel = this.getModel("oGModel");
                if (oEvent) {
                    var sSelItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
                    // Set the selected values to get the details
                    oGModel.setProperty("/prdId", sSelItem.PRODUCT_ID);
                    oGModel.setProperty("/locId", sSelItem.LOCATION_ID);
                    oGModel.setProperty("/uniqId", sSelItem.UNIQUE_ID);
                    oGModel.setProperty("/uid_rate", sSelItem.UID_RATE);
                    oGModel.setProperty("/uid_active", sSelItem.ACTIVE);
                }
                // Calling Item Detail page
                that.getOwnerComponent().runAsOwner(function () {
                    if (!that.oDetailView) {
                        try {
                            that.oDetailView = sap.ui.view({
                                viewName: "cpapp.cpmatvariant.view.ItemDetail",
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
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */

            onSearch: function (oEvent) {
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    oFilters = [];

                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("UNIQUE_RDESC", FilterOperator.Contains, sQuery),
                                new Filter("UNIQUE_ID", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idMatVHead").getBinding("items").filter(oFilters);
            },
            /**
             * Called when Edit button is clicked in the table.
             * @param {object} oEvent -the event information.
             */

            onEditDesc: function (oEvent) {
                var oSelected = oEvent.getSource().getParent().getBindingContext().getObject();
                oGModel.setProperty("/SelectedData", oSelected);
                oGModel.setProperty("/SelectedId", oSelected.UNIQUE_ID);
                oGModel.setProperty("/SelectedDesc", oSelected.UNIQUE_DESC);
                oGModel.setProperty("/SelectedURate", oSelected.UID_RATE);
                this._valueHelpDialogDescUpdate.open();
            },

            onCloseDesc: function () {
                this._valueHelpDialogDescUpdate.close();
            },

            onUpdateUniqueDesc: function () {
                var oItem = oGModel.getProperty("/SelectedData");
                var oDesc = sap.ui.getCore().byId("idUniqDesc").getValue();
                var oActive;
                if (oItem.ACTIVE === true) {
                    oActive = '';//true;
                } else {
                    oActive = 'X';//falsev;
                }
                that.getModel("BModel").callFunction("/changeUnique", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: oItem.LOCATION_ID,
                        PRODUCT_ID: oItem.PRODUCT_ID,
                        UNIQUE_ID: oItem.UNIQUE_ID,
                        UID_TYPE: oItem.UID_TYPE,
                        // UID_RATE: oUniqRate,
                        UNIQUE_DESC: oDesc,
                        ACTIVE: oActive,
                        FLAG: "E"
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(oData.changeUnique);
                        that.onCloseDesc();
                        that.onGetData();
                    },
                    error: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to changes the status");
                    },
                });
            },

            onChange: function (oEvent) {
                var oItem = oEvent.getSource().getBindingContext().getObject();
                var oActive;
                if (oItem.ACTIVE === true) {
                    oActive = 'X';//false;
                } else {
                    oActive = '';//true;
                }
                that.getModel("BModel").callFunction("/changeUnique", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: oItem.LOCATION_ID,
                        PRODUCT_ID: oItem.PRODUCT_ID,
                        UNIQUE_ID: oItem.UNIQUE_ID,
                        UID_TYPE: oItem.UID_TYPE,
                        UNIQUE_DESC: oItem.UNIQUE_DESC,
                        ACTIVE: oActive,
                        FLAG: "E"
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(oData.changeUnique);
                        that.onGetData();
                    },
                    error: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to changes the status");
                    },
                });
            },
            onCreateBtn: function () {
                that.oTableData = [];
                sap.ui.getCore().byId("idUniqDesc1").setValue("");
                that.ListModel = new JSONModel();
                that.ListModel.setData({
                    results: that.oTableData
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                var oLoctid = this.byId("idloc").getValue(),
                    oProdid = this.byId("prodInput").getValue(),
                    ouidType = this.byId("idUnique").getSelectedKey();
                sap.ui.getCore().byId("locId1").setValue(oLoctid);
                sap.ui.getCore().byId("prodId1").setValue(oProdid);
                oGModel.setProperty("/New", "N");
                sap.ui.getCore().byId("idUniqDesc1").setValue("");
                that.oTableData = [];
                that.ListModel = new JSONModel();
                that.ListModel.setData({
                    results: that.oTableData
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                if (oProdid) {
                    that._createCharacterstics.open();
                    that.CharData();
                } else {
                    MessageToast.show("Please select product");
                }
            },

            onCopyBtn: function (oEvent) {
                var selUniq = that.byId("idMatVHead").getSelectedItem().getBindingContext().getProperty();
                sap.ui.getCore().byId("locId1").setValue(selUniq.LOCATION_ID);
                sap.ui.getCore().byId("prodId1").setValue(selUniq.PRODUCT_ID);
                sap.ui.getCore().byId("idUniqDesc1").setValue(selUniq.UNIQUE_DESC);
                oGModel.setProperty("/New", "C");
                that.oTableData = oGModel.getProperty("/CharData");
                that.ListModel = new JSONModel();
                that.ListModel.setData({
                    results: that.oTableData
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                that._createCharacterstics.open();
                that.CharData();
            },

            CharData: function () {
                var sPrdId = this.byId("prodInput").getValue();
                if (sPrdId) {
                    this.getModel("BModel").read("/getProdClsChar", {
                        filters: [
                            new Filter("PRODUCT_ID", FilterOperator.EQ, sPrdId),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.classNameData = oData.results;
                            var newClassModel = new JSONModel();
                            newClassModel.setData({
                                results: that.classNameData
                            });
                            sap.ui.getCore().byId("classNameList").setModel(newClassModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else {
                    MessageToast.show("Please select product");
                }
            },
            onCloseCreate: function () {
                this._createCharacterstics.close();
            },
            onCloseCopy: function () {
                this._copyCharacterstics.close();
            },


            onAddChar: function () {
                sap.ui.getCore().byId("idClassname2").setValue("");
                sap.ui.getCore().byId("idCharname2").setValue("");
                sap.ui.getCore().byId("idCharval2").setValue("");
                sap.ui.getCore().byId("idCharno2").setValue("");
                sap.ui.getCore().byId("idCharvalno2").setValue("");
                that.oClassnameList = sap.ui.getCore().byId("classNameList");
                sap.ui.getCore().byId("idCharSearch").setValue("");
                that.oClassnameList.getBinding("items").filter([]);
                that._valueHelpDialogclassName.open();
                jQuery.sap.delayedCall(300, null, function () {
                    sap.ui.getCore().byId("idCharSearch").focus();
                })
            },

            handleCharSelection: function (oEvent) {
                that.oGModel = that.getModel("oGModel");
                var aSelectedItems = oEvent.getSource().getSelectedItems()[0].getBindingContext().getProperty();
                var className = aSelectedItems.CLASS_NAME,
                    charName = aSelectedItems.CHAR_NAME,
                    charNum = aSelectedItems.CHAR_NUM,
                    charVal_Name = aSelectedItems.CHAR_VALUE,
                    charVal_Num = aSelectedItems.CHARVAL_NUM;
                if (charName !== "" && charVal_Name !== "" && className !== "") {
                    this.oData = {
                        "CLASS_NAME": className,
                        "CHAR_NAME": charName,
                        "CHAR_NUM": charNum,
                        "CHAR_VALUE": charVal_Name,
                        "CHARVAL_NUM": charVal_Num,
                        "OFLAG": "X",
                    };
                    var oItemTable = sap.ui.getCore().byId("idCharItem").getItems();
                    var count = 0;
                    for (var i = 0; i < oItemTable.length; i++) {
                        if (oItemTable[i].getCells()[1].getText() === charNum &&
                            oItemTable[i].getCells()[3].getText() === charVal_Num) {
                            count = count + 1;
                        }
                    }
                    if (count === 0) {
                        // Add entry to the table model
                        that.oTableData.push(that.oData);
                        that.ListModel = new JSONModel();
                        that.ListModel.setData({
                            results: that.oTableData
                        });
                        sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                        this._valueHelpDialogclassName.close();
                    } else {
                        sap.m.MessageToast.show("Characterstic is already maintained");
                    }
                } else {
                    MessageToast.show("Please fill all inputs");
                }
            },

            onClassClose: function () {
                this._valueHelpDialogclassName.close();
            },

            handleCharSearch: function (oEvent) {
                var sQuery =oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                                new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oClassnameList = sap.ui.getCore().byId("classNameList");
                that.oClassnameList.getBinding("items").filter(oFilters);        
            },

            handleCharClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("className")) {
                    that._oCore.byId(this._valueHelpDialogclassName.getId() + "-searchField")
                        .setValue("");
                    if (that.oClassnameList.getBinding("items")) {
                        that.oClassnameList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("charName")) {
                    that._oCore
                        .byId(this._valueHelpDialogcharName.getId() + "-searchField")
                        .setValue("");
                    if (that.oCharnameList.getBinding("items")) {
                        that.oCharnameList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("charVal")) {
                    that._oCore
                        .byId(this._valueHelpDialogcharValue.getId() + "-searchField")
                        .setValue("");
                    if (that.oCharvalueList.getBinding("items")) {
                        that.oCharvalueList.getBinding("items").filter([]);
                    }
                }
            },

            onCloseRestItem: function () {
                sap.ui.getCore().byId("idClassname2").setValue("");
                sap.ui.getCore().byId("idCharname2").setValue("");
                sap.ui.getCore().byId("idCharval2").setValue("");
                that._addCharacteristic.close();
            },

            onAdd: function () {
                var charName = sap.ui.getCore().byId("idCharname2").getValue(),
                    charNum = sap.ui.getCore().byId("idCharno2").getValue(),
                    charVal_Name = sap.ui.getCore().byId("idCharval2").getValue(),
                    charVal_Num = sap.ui.getCore().byId("idCharvalno2").getValue(),
                    className = sap.ui.getCore().byId("idClassname2").getValue();
                if (charName !== "" && charVal_Name !== "" && className !== "") {
                    this.oData = {
                        "CLASS_NAME": className,
                        "CHAR_NAME": charName,
                        "CHAR_NUM": charNum,
                        "CHAR_VALUE": charVal_Name,
                        "CHARVAL_NUM": charVal_Num,
                        "OFLAG": "X",
                    };
                    var oItemTable = sap.ui.getCore().byId("idCharItem").getItems();
                    var count = 0;
                    for (var i = 0; i < oItemTable.length; i++) {
                        if (oItemTable[i].getCells()[1].getText() === charNum &&
                            oItemTable[i].getCells()[3].getText() === charVal_Num) {
                            count = count + 1;
                        }
                    }
                    if (count === 0) {
                        // Add entry to the table model
                        that.oTableData.push(that.oData);
                        that.ListModel = new JSONModel();
                        that.ListModel.setData({
                            results: that.oTableData
                        });
                        sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                        that._addCharacteristic.close();
                    } else {
                        sap.m.MessageToast.show("Characterstic is already maintained");
                    }
                } else {
                    MessageToast.show("Please fill all inputs");
                }
            },

            onTabDel: function (oEvent) {
                var selItem = oEvent.getSource().getParent().getBindingContext().getObject();
                var oItemtoDelete = oEvent.getParameters("listItem").id.split("idCharItem-")[1];
                var aData = that.ListModel.getData().results;
                aData.splice(oItemtoDelete, 1); //removing 1 record from i th index.
                that.ListModel.refresh();
            },

            onCreateUniq: function () {
                var Charlist;
                var oEntry = { RTRCHAR: [] };
                var olocID = sap.ui.getCore().byId("locId1").getValue(),
                    oprodID = sap.ui.getCore().byId("prodId1").getValue(),
                    ouniqID = 1,
                    ouniqDesc = sap.ui.getCore().byId("idUniqDesc1").getValue(),
                    ouniqTID = sap.ui.getCore().byId("idComboBox1").getValue(),
                    ouniqRID = sap.ui.getCore().byId("uidRId1").getValue(),
                    oactID = sap.ui.getCore().byId("idComboBox").getValue(),
                    flag = 'C',
                    count = 0;
                if (oactID === "True") {
                    oactID = '';
                }
                else {
                    oactID = 'X';
                }
                var aTabledata = sap.ui.getCore().byId("idCharItem").getItems();
                var Flag = oGModel.getProperty("/New");
                for (var i = 0; i < aTabledata.length; i++) {
                    var aData = aTabledata[i].getBindingContext().getObject();
                    Charlist = {
                        LOCATION_ID: olocID,
                        PRODUCT_ID: oprodID,
                        UNIQUE_ID: ouniqID,
                        UNIQUE_DESC: ouniqDesc,
                        CHAR_NUM: aData.CHAR_NUM,
                        CHARVAL_NUM: aData.CHARVAL_NUM
                    }
                    oEntry.RTRCHAR.push(Charlist);
                }
                sap.ui.core.BusyIndicator.show();
                that.getModel("BModel").callFunction("/maintainUniqueChar", {
                    method: "GET",
                    urlParameters: {
                        FLAG: Flag,
                        UNIQUECHAR: JSON.stringify(oEntry.RTRCHAR)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.maintainUniqueChar);
                        that.onGetData();
                        that.onCloseCreate();
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error");
                    },
                });
            },

            onCopyUniqueDesc: function () {
                var uniqueData = oGModel.getProperty("/uniqueData");
                var olocID = sap.ui.getCore().byId("locIdCC").getValue(),
                    oprodID = sap.ui.getCore().byId("prodIdCC").getValue(),
                    ouniqID = 1,
                    ouniqDesc = sap.ui.getCore().byId("idUniqDescCC").getValue(),
                    ouniqTID = sap.ui.getCore().byId("idComboBoxCC").getSelectedKey(),
                    ouniqRID = sap.ui.getCore().byId("uidRIdCC").getValue(),
                    oactID = sap.ui.getCore().byId("idComboBoxAC").getValue(),
                    flag = 'C',
                    count = 0;
                if (oactID === "True") {
                    oactID = '';
                }
                else {
                    oactID = 'X';
                }
                var aTabledata = sap.ui.getCore().byId("idCharItem").getItems();
                var Flag = oGModel.getProperty("/New");
                for (var i = 0; i < aTabledata.length; i++) {
                    var aData = aTabledata[i].getBindingContext().getObject();
                    Charlist = {
                        LOCATION_ID: olocID,
                        PRODUCT_ID: oprodID,
                        UNIQUE_ID: ouniqID,
                        UNIQUE_DESC: ouniqDesc,
                        CHAR_NUM: aData.CHAR_NUM,
                        CHARVAL_NUM: aData.CHARVAL_NUM
                    }
                    oEntry.RTRCHAR.push(Charlist);
                }
                sap.ui.core.BusyIndicator.show();
                that.getModel("BModel").callFunction("/maintainUniqueChar", {
                    method: "GET",
                    urlParameters: {
                        FLAG: Flag,
                        UNIQUECHAR: JSON.stringify(oEntry.RTRCHAR)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.maintainUniqueChar);
                        that.onGetData();
                        that.onCloseCreate();

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error");
                    },
                });
                if (olocID === "" || oprodID === "") {
                    sap.m.MessageToast.show("Please select Location/Product")
                }
                else {
                    sap.ui.core.BusyIndicator.show();
                    var bModel = that.getView().getModel("BModel");
                    bModel.callFunction("/maintainUniqueChar", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: olocID,
                            PRODUCT_ID: oprodID,
                            UNIQUE_ID: ouniqID,
                            UID_TYPE: ouniqTID,
                            UNIQUE_DESC: ouniqDesc,
                            ACTIVE: oactID,
                            FLAG: "C"
                        },
                        success: function (oData) {
                            sap.m.MessageToast.show(oData.changeUnique);
                            that.onAfterRendering();
                            that._copyCharacterstics.close();
                            that.onGetData();
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error(e) {
                            sap.m.MessageToast.show("Failed to Create");
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                }
            }

        })
    })

