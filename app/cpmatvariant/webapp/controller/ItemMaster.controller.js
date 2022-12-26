

sap.ui.define(
    [
        "cpapp/cpmatvariant/controller/BaseController",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/Device",
        "../model/formatter"
    ],
    function (
        BaseController,
        MessageToast,
        JSONModel,
        Filter,
        FilterOperator,
        MessageBox,
        Device,
        formatter
    ) {
        "use strict";
        var that, oGModel;

        return BaseController.extend("cpapp.cpmatvariant.controller.ItemMaster", {
            formatter: formatter,

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                that.selectedArray = [];
                that.indexArray = [];
                that.oIndexArray = [];
                // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                this.locModel = new JSONModel();
                this.prodModel = new JSONModel();
                that.oGModel = that.getOwnerComponent().getModel("oGModel");

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
                // this.oProdList = this._oCore.byId(
                //     this._valueHelpDialogProd.getId() + "-list"
                // );
                // this.oLocList = this._oCore.byId(
                //     this._valueHelpDialogLoc.getId() + "-list"
                // );

                this.oProdList = sap.ui.getCore().byId("prodSlctList");
                this.oLocList = sap.ui.getCore().byId("LocSlctList");

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
                // var sId = oEvent.getParameter("id");
                var sId = oEvent.getSource().getParent().mAssociations.initialFocus.split("-")[0];
                // Loc Dialog
                if (sId.includes("Loc")) {
                    sap.ui.getCore().byId("LocSearch").setValue("");
                    // that._oCore.byId(this._valueHelpDialogLoc.getId() + "-searchField").setValue("");
                    if (that.oLocList.getBinding("items")) {
                        that.oLocList.getBinding("items").filter([]);
                    }
                    sap.ui.getCore().byId("LocSlctList").removeSelections();
                    that._valueHelpDialogLoc.close();
                    // Prod Dialog
                } else if (sId.includes("Prod")) {
                    sap.ui.getCore().byId("ProdSearch").setValue("");
                    // that._oCore.byId(this._valueHelpDialogProd.getId() + "-searchField").setValue("");
                    if (that.oProdList.getBinding("items")) {
                        that.oProdList.getBinding("items").filter([]);
                    }
                    sap.ui.getCore().byId("prodSlctList").removeSelections();
                    that._valueHelpDialogProd.close();
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
                this.oLoc = that.byId("idloc");
                this.oProd = that.byId("prodInput");
                //Location list
                if (sId.includes("Loc")) {

                    aSelectedItems = oEvent.getParameter("selectedItems");

                    that.oLoc.setValue(oEvent.getParameters().listItem.getCells()[0].getTitle());
                    that.oProd.setValue("");

                    // if (mainSID === "__xmlview1--idloc") {
                    //     that.oLoc.setValue(aSelectedItems[0].getTitle());

                    // }
                    // else if (mainSID === "locId1") {
                    //     sap.ui.getCore().byId("locId1").setValue(aSelectedItems[0].getTitle());
                    // }
                    // else if (mainSID === "locIdCC") {
                    //     sap.ui.getCore().byId("locIdCC").setValue(aSelectedItems[0].getTitle());
                    // }
                    // that.oProd.setValue();
                    // that.oProd.removeAllTokens();
                    // this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();

                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                oEvent.getParameters().listItem.getCells()[0].getTitle()
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
                    // this.oProd = that.byId("prodInput");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(oEvent.getParameters().listItem.getCells()[0].getTitle());
                    // if (mainSID === "__xmlview1--prodInput") {
                    //     that.oProd.setValue(aSelectedItems[0].getTitle());
                    // }
                    // else if (mainSID === "prodId1") {
                    //     sap.ui.getCore().byId("prodId1").setValue(aSelectedItems[0].getTitle());
                    // }
                    // else if (mainSID === "prodIdCC") {
                    //     sap.ui.getCore().byId("prodIdCC").setValue(aSelectedItems[0].getTitle());
                    // }
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
                // that.byId("idMatSearch").getBinding("items").filter(oFilters);
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
                    this.byId("idMatSearch").setValue("");
                    if (that.byId("idMatVHead").getItems().length) {
                        that.byId("idMatVHead").getBinding("items").filter(oFilters);
                    }
                    sap.ui.core.BusyIndicator.show();
                    this.getModel("BModel").read("/getUniqueHeader", {
                        filters: [oFilters],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.results.length) {

                                // oData.results.forEach(function (row) {
                                //     // Calling function to handle the date format
                                //     row.UNIQUE_ID = row.UNIQUE_ID.toString();
                                //   }, that);


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
                                new Filter("UNIQUE_DESC", FilterOperator.Contains, sQuery),
                                new Filter("UNIQUE_ID", FilterOperator.EQ, sQuery),
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
                        UNIQUE_ID: parseInt(oItem.UNIQUE_ID),
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
                        UNIQUE_ID: parseInt(oItem.UNIQUE_ID),
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
                that.selectedArray = [];
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

                } else {
                    MessageToast.show("Please select Location/ Product");
                }
            },

            onCopyBtn: function (oEvent) {
                that.selectedArray = [];
                var oData = that.byId("idMatVHead").getSelectedItem();
                if (oData) {
                    var selUniq = oData.getBindingContext().getProperty();
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
                    that.oGModel.setProperty("/copy", "X");
                    that.oGModel.setProperty("/setData", "");
                    that._createCharacterstics.open();
                    that.CharData();
                } else {
                    MessageToast.show("Please select a uniq id to copy");
                }
            },

            CharData: function () {
                sap.ui.core.BusyIndicator.show();
                var adata = [];
                var sPrdId = this.byId("prodInput").getValue();
                if (sPrdId) {
                    this.getModel("BModel").read("/getProdClsChar", {
                        filters: [
                            new Filter("PRODUCT_ID", FilterOperator.EQ, sPrdId),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.oGModel.setProperty("/child", "Y")
                            // that.classNameData = oData.results;
                            // var newClassModel = new JSONModel();
                            // newClassModel.setData({
                            //     results: that.classNameData
                            // });
                            // sap.ui.getCore().byId("classNameList").setModel(newClassModel);

                            for (var i = 0; i < oData.results.length; i++) {
                                adata.push({
                                    "Description": oData.results[i].CLASS_NAME,

                                });
                            }
                            var filadata = adata.filter((obj, pos, arr) => {
                                return (
                                    arr.map((mapObj) => mapObj.Description).indexOf(obj.Description) == pos
                                );
                            });
                            var class_names = filadata;
                            var new_names;
                            var charData = [];
                            var flat = {};
                            var newData = [];

                            var root = [];
                            for (var i = 0; i < filadata.length; i++) {
                                for (var j = 0; j < oData.results.length; j++) {
                                    if (filadata[i].Description === oData.results[j].CLASS_NAME) {
                                        newData.push(oData.results[j]);
                                        var key = filadata[i].Description;
                                        flat[key] = newData;
                                    }
                                }

                                newData = [];
                            }
                            charData = flat;
                            root = charData;
                            for (var i in class_names) {
                                class_names[i].children = [];
                            }

                            for (var k = 0; k < filadata.length; k++) {
                                var newFlat = [];
                                var newKey = filadata[k].Description;
                                for (var s = 0; s < flat[newKey].length; s++) {
                                    var skey = flat[newKey][s].CHAR_NAME;
                                    newFlat.push({
                                        "Description": skey,

                                    });
                                }
                                newFlat = newFlat.filter((obj, pos, arr) => {
                                    return (
                                        arr.map((mapObj) => mapObj.Description).indexOf(obj.Description) == pos
                                    );
                                });

                                // add children container
                                for (var i in newFlat) {
                                    newFlat[i].nodes = [];
                                }
                                // populate the child container arrays  
                                for (var h = 0; h < newFlat.length; h++) {
                                    for (var l = 0; l < flat[newKey].length; l++) {
                                        if (newFlat[h].Description === flat[newKey][l].CHAR_NAME) {
                                            newFlat[h].nodes.push({
                                                "CLASS_NAME": flat[newKey][l].CLASS_NAME,
                                                "CHAR_VALUE": flat[newKey][l].CHAR_VALUE,
                                                "CHAR_NAME": flat[newKey][l].CHAR_NAME,
                                                "CHAR_NUM": flat[newKey][l].CHAR_NUM,
                                                "CHARVAL_NUM": flat[newKey][l].CHARVAL_NUM,
                                                "Description": flat[newKey][l].CHAR_VALUE,
                                                "Selected":false
                                            });
                                        }
                                    }
                                }
                                class_names[k].children = newFlat;
                                new_names = newFlat;
                            }
                            var newClassModel = new JSONModel();
                            newClassModel.setData(class_names);
                            // var newClassModel1 = new JSONModel();
                            // newClassModel1.setData(
                            //     new_names
                            // );

                            // sap.ui.getCore().byId("nodes").setModel(newClassModel);
                            // sap.ui.getCore().byId("idList").setModel(newClassModel,"oModel");
                            // sap.ui.getCore().byId("idList2").setModel(newClassModel,"oFodel");
                            // sap.ui.getCore().byId("rbg2").setModel(newClassModel);
                            that._valueHelpDialogclassName.setModel(newClassModel, "oModel");
                            that.oGModel.setProperty("/mainData", newClassModel);

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
                var tableDetails = {};
                // sap.ui.getCore().byId("idClassname2").setValue("");
                // sap.ui.getCore().byId("idCharname2").setValue("");
                // sap.ui.getCore().byId("idCharval2").setValue("");
                // sap.ui.getCore().byId("idCharno2").setValue("");
                // sap.ui.getCore().byId("idCharvalno2").setValue("");
                // that.oClassnameList = sap.ui.getCore().byId("classNameList");
                // sap.ui.getCore().byId("idCharSearch").setValue("");
                // that.oClassnameList.getBinding("items").filter([]);
                if (that.oGModel.getProperty("/setData") === "" || that.oGModel.getProperty("/setData") === undefined) {
                    that.CharData();
                    sap.ui.getCore().byId("_IDGenPanel2").setExpanded(false);
                    sap.ui.getCore().byId("idCharSearch").setValue();
                }
                // sap.ui.getCore().byId("idCharSearch").setValue();
                if (that.oGModel.getProperty("/copy") === "X") {
                    var oItemTable = sap.ui.getCore().byId("idCharItem").getItems();
                    for (var i = 0; i < oItemTable.length; i++) {
                        tableDetails = {
                            "CHAR_NAME": oItemTable[i].getCells()[0].getText(),
                            "CHAR_NUM": oItemTable[i].getCells()[1].getText(),
                            "CHAR_VALUE": oItemTable[i].getCells()[2].getText(),
                            "CHARVAL_NUM": oItemTable[i].getCells()[3].getText(),
                        }
                        that.selectedArray.push(tableDetails);
                    }
                    that.oGModel.setProperty("/copy", "");
                    var fullData = that.oGModel.getProperty("/mainData");
                    var oData = fullData.oData;
                    for (var i = 0; i < oData.length; i++) {
                        for (var j = 0; j < oData[i].children.length; j++) {
                            for (var k = 0; k < oData[i].children[j].nodes.length; k++) {
                                for (var s = 0; s < that.selectedArray.length; s++) {
                                    if (that.selectedArray[s].CHAR_VALUE === oData[i].children[j].nodes[k].CHAR_VALUE && that.selectedArray[s].CHAR_NAME === oData[i].children[j].nodes[k].CHAR_NAME
                                    ) {
                                        oData[i].children[j].nodes[k].Selected = true;
                                    }
                                }
                            }
                        }
                    }
                    var newModel1 = new JSONModel();
                    newModel1.setData(oData);
                    that._valueHelpDialogclassName.setModel(newModel1,"oModel");
                }
                that._valueHelpDialogclassName.open();
                // jQuery.sap.delayedCall(300, null, function () {
                //     sap.ui.getCore().byId("idCharSearch").focus();
                // })
            },

            handleCharSelection: function (oEvent) {
                that.oGModel = that.getModel("oGModel");
                var tableDetails = {};

                // var aSelectedItems = oEvent.getSource().getSelectedItems()[0].getBindingContext().getProperty();
                // var className = aSelectedItems.CLASS_NAME,
                //     charName = aSelectedItems.CHAR_NAME,
                //     charNum = aSelectedItems.CHAR_NUM,
                //     charVal_Name = aSelectedItems.CHAR_VALUE,
                //     charVal_Num = aSelectedItems.CHARVAL_NUM;
                // if (charName !== "" && charVal_Name !== "" && className !== "") {
                //     this.oData = {
                //         "CLASS_NAME": className,
                //         "CHAR_NAME": charName,
                //         "CHAR_NUM": charNum,
                //         "CHAR_VALUE": charVal_Name,
                //         "CHARVAL_NUM": charVal_Num,
                //         "OFLAG": "X",
                //     };


                var selectedItems = that.selectedArray;

                // var count = 0;
                // for (var i = 0; i < oItemTable.length; i++) {
                //     for (var j = 0; j < selectedItems.length; j++) {
                //         if (oItemTable[i].getCells()[1].getText() === selectedItems[j].CHAR_NUM &&
                //             oItemTable[i].getCells()[3].getText() === selectedItems[j].CHARVAL_NUM) {
                //             // count = count + 1;
                //             var index = selectedItems.indexOf(selectedItems[j]);
                //             that.indexArray.push(index);
                //         }
                //     }
                // }
                // if (that.indexArray.length > 0) {
                //     for (var i in that.indexArray) {
                //         selectedItems.splice(that.indexArray[i], 1)
                //     }
                // }
                // for (var k = 0; k < oItemTable.length; k++) {
                //     tableDetails = {
                //         "CHAR_NAME": oItemTable[k].getCells()[0].getText(),
                //         "CHAR_NUM": oItemTable[k].getCells()[1].getText(),
                //         "CHAR_VALUE": oItemTable[k].getCells()[2].getText(),
                //         "CHARVAL_NUM": oItemTable[k].getCells()[3].getText(),
                //     }
                //     selectedItems.push(tableDetails);
                // }
                // if (count === 0) {
                // Add entry to the table model
                // that.oTableData.push(selectedItems);
                that.ListModel = new JSONModel();
                that.ListModel.setData({
                    results: selectedItems
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                that.oGModel.setProperty("/setData", "X");
                that.oGModel.setProperty("/arrayFlag", "X");
                // sap.ui.getCore().byId("classNameList").removeSelections();

                that._valueHelpDialogclassName.close();

                // } else {
                //     this._valueHelpDialogclassName.close();
                //     sap.m.MessageToast.show("Characterstic is already maintained");
                // }
                // } 
                // else {
                //     MessageToast.show("Please fill all inputs");
                // }
            },

            onClassClose: function () {
                // sap.ui.getCore().byId("rbg2").setSelectedIndex(-1);
                // sap.ui.getCore().byId("_IDGenPanel2").setExpanded(false);
                // that._valueHelpDialogclassName.setModel(that.oGModel.getProperty("/mainData"), "oModel");
                var newModel = new JSONModel();
                newModel.setData([]);
                that._valueHelpDialogclassName.setModel(newModel);
                this._valueHelpDialogclassName.close();
                // if (this._valueHelpDialogclassName) {
                //     this._valueHelpDialogclassName.destroy();
                //     this._valueHelpDialogclassName = null; // make it falsy so that it can be created next time
                //   }

                // this._valueHelpDialogclassName.destroy();

            },

            handleCharSearch: function (oEvent) {
                // var sQuery = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                //     oFilters = [];
                // // Check if search filter is to be applied
                // sQuery = sQuery ? sQuery.trim() : "";
                // if (sQuery !== "") {
                //     oFilters.push(
                //         new Filter({
                //             filters: [
                //                 new Filter("Description", FilterOperator.Contains, sQuery),
                //                 // new Filter("children.Description", FilterOperator.Contains, sQuery),
                //                 new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                //                 new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                //                 new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                //             ],
                //             and: false,
                //         })
                //     );
                // }
                // that.oClassnameList = sap.ui.getCore().byId("idList");
                // that.oClassnameList.getBinding("items").filter(oFilters);
                // that.oCharnameList = sap.ui.getCore().byId("idList2");
                // that.oCharnameList.getBinding("items").filter(oFilters);

                let sQuery = oEvent.getSource().getValue();
                if (sQuery.length > 0) {
                    // sap.ui.getCore().byId("_IDGenPanel1").setExpanded(true);
                    sap.ui.getCore().byId("_IDGenPanel2").setExpanded(true);
                    let originalModel = that.oGModel.getProperty("/mainData");
                    let originalDataCopy = JSON.parse(JSON.stringify(originalModel.oData));
                    let filtered = originalDataCopy.filter(topGroup => {
                        // Filter second level groups
                        let filteredMidGroups = topGroup.children.filter(midGroup => {
                            // Filter last Level
                            let filteredSingleElements = midGroup.nodes.filter(singleElement => {
                                let search = sQuery.toLowerCase();
                                let valueFound = (
                                    singleElement.CLASS_NAME.toLowerCase().includes(search) ||
                                    singleElement.CHAR_NAME.toLowerCase().includes(search) ||
                                    singleElement.CHAR_VALUE.toLowerCase().includes(search)
                                );
                                return valueFound;
                            });
                            midGroup.nodes = filteredSingleElements;
                            return (filteredSingleElements.length > 0);
                        });
                        topGroup.children = filteredMidGroups;
                        return (filteredMidGroups.length > 0);
                    });
                    var classnames = filtered;
                    let newModel = new JSONModel();
                    newModel.setData(classnames);
                    that._valueHelpDialogclassName.setModel(newModel, "oModel");
                }
                else {
                    sap.ui.getCore().byId("_IDGenPanel2").setExpanded(false);
                    that._valueHelpDialogclassName.setModel(that.oGModel.getProperty("/mainData"), "oModel");
                }
            },

            handleCharClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("className")) {
                    that._oCore.byId(this.getId() + "-searchField").setValue("");
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
                        that.onClassClose();
                        that.selectedArray = [];
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
                        that.onClassClose();

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
            },

            onSelect: function (oEvent) {
                that.oIndexArray = [];
                if (that.oGModel.getProperty("/arrayFlag") === "X") {
                    // that.selectedArray = [];
                    that.indexArray = [];
                    that.oGModel.setProperty("/arrayFlag", "");
                }
                var selectedItems = oEvent.getSource().getSelectedButton().getBindingContext("oModel").getObject();
                var count = 0;
                var charName = selectedItems.CHAR_NAME,
                    charNum = selectedItems.CHAR_NUM,
                    charVal_Name = selectedItems.CHAR_VALUE,
                    charVal_Num = selectedItems.CHARVAL_NUM;
                that.selectedDetails = {
                    "CHAR_NAME": charName,
                    "CHAR_NUM": charNum,
                    "CHAR_VALUE": charVal_Name,
                    "CHARVAL_NUM": charVal_Num,
                };
                if (that.selectedArray.length === 0) {
                    that.selectedArray.push(that.selectedDetails);
                }
                else {
                    for (var i = 0; i < that.selectedArray.length; i++) {
                        if (that.selectedArray[i].CHAR_NAME === charName) {
                            var index = that.selectedArray.indexOf(that.selectedArray[i]);
                            that.oIndexArray.push(index);
                        }
                    }
                    if (that.oIndexArray.length > 0) {
                        for (var i in that.oIndexArray) {
                            that.selectedArray.splice(that.oIndexArray[i], 1);
                        }
                    }
                    that.selectedArray.push(that.selectedDetails);
                }
            }

        })
    })

