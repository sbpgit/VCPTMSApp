sap.ui.define([
    "cpapp/cpprscchar/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "cpapp/cpprscchar/Utils",
    "sap/ui/core/dnd/DragInfo",
    "sap/ui/core/dnd/DropInfo",
    "sap/ui/core/library",
    "sap/ui/model/Sorter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, Utils, DragInfo, DropInfo, library, Sorter) {
        "use strict";
        var that, oGModel;
        var DropLayout = library.dnd.DropLayout;
        var DropPosition = library.dnd.DropPosition;

        return BaseController.extend("cpapp.cpprscchar.controller.Home", {
            onInit: function () {
                that = this;
                // Declaration of JSON models and size limits
                this.PrimarylistModel = new JSONModel();
                this.SeclistModel = new JSONModel();
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();

                // this.byId("page1").scrollToElement(this.byId("Primarytable"));
                // this.byId("page2").scrollToElement(this.byId("Secondarytable"));

                // Declaring Value Help Dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpprscchar.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpprscchar.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }

                // //setting the Page Splitter Orientation to Vertical
                // this.getView().byId("mySplitContainer").setOrientation("Vertical"); 

                this.attachDragDrop();

            },
            /**
         * Called after the view has been rendered.
         * Calling the service to get Data.
         */
            onAfterRendering: function () {
                sap.ui.core.BusyIndicator.show();
                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("prodInput");
                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");

                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );

                // Calling service to get Location data
                this.getModel("BModel").read("/getLocation", {
                    success: function (oData) {
                        that.locModel.setData(oData);
                        that.oLocList.setModel(that.locModel);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });


            },

            onGetData: function () {
                var sLoc = that.byId("idloc").getValue(),
                    sProd = that.byId("prodInput").getValue();

                if (sLoc !== "" && sProd !== "") {
                    // Calling service to get the product data
                    // this.getModel("BModel").read("/getPriSecChar", {
                    //     filters: [
                    //         new Filter("LOCATION_ID", FilterOperator.EQ, sLoc),
                    //         new Filter("PRODUCT_ID", FilterOperator.EQ, sProd),
                    //     ],method: "GET",
                    this.getModel("BModel").callFunction("/getSecondaryChar", {
                        method: "GET",
                        urlParameters: {
                            FLAG: "G",
                            LOCATION_ID: sLoc,
                            PRODUCT_ID: sProd
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.oPList = that.byId("Primarytable"),
                                that.oSList = that.byId("Secondarytable");

                            that.primaryData = [],
                                that.secData = [];

                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].CHAR_TYPE === "P") {
                                    that.primaryData.push(oData.results[i]);
                                } else {
                                    that.secData.push(oData.results[i]);
                                }
                            }

                            that.finalSecData = [];
                            for (var j = 0; j <= that.secData.length; j++) {
                                for (var k = 0; k < that.secData.length; k++) {
                                    if (j === that.secData[k].SEQUENCE) {
                                        that.finalSecData.push(that.secData[k]);
                                        break;
                                    }
                                }

                            }


                            that.PrimarylistModel.setData({
                                results: that.primaryData,
                            });
                            that.oPList.setModel(that.PrimarylistModel);

                            that.SeclistModel.setData({
                                results: that.finalSecData,
                            });
                            that.oSList.setModel(that.SeclistModel);

                            that.byId("searchField").setModel(that.SeclistModel);

                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else {
                    MessageToast.show("Please select Location and Product");
                }
            },
            onReset: function(){
                var sLoc = that.byId("idloc").getValue(),
                    sProd = that.byId("prodInput").getValue();
                this.getModel("BModel").callFunction("/getSecondaryChar", {
                    method: "GET",
                    urlParameters: {
                        FLAG: "R",
                        LOCATION_ID: sLoc,
                        PRODUCT_ID: sProd
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.oPList = that.byId("Primarytable"),
                            that.oSList = that.byId("Secondarytable");

                        that.primaryData = [],
                            that.secData = [];

                        for (var i = 0; i < oData.results.length; i++) {
                            if (oData.results[i].CHAR_TYPE === "P") {
                                that.primaryData.push(oData.results[i]);
                            } else {
                                that.secData.push(oData.results[i]);
                            }
                        }

                        that.finalSecData = [];
                        for (var j = 0; j <= that.secData.length; j++) {
                            for (var k = 0; k < that.secData.length; k++) {
                                if (j === that.secData[k].SEQUENCE) {
                                    that.finalSecData.push(that.secData[k]);
                                    break;
                                }
                            }

                        }


                        that.PrimarylistModel.setData({
                            results: that.primaryData,
                        });
                        that.oPList.setModel(that.PrimarylistModel);

                        that.SeclistModel.setData({
                            results: that.finalSecData,
                        });
                        that.oSList.setModel(that.SeclistModel);

                        that.byId("searchField").setModel(that.SeclistModel);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
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
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             * In this function based in sId will close the dialogs.
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

            /**
           * This function is called when selection on dialogs list.
           * Selections will be made based on sId.
           * @param {object} oEvent -the event information.
           */
            handleSelection: function (oEvent) {
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                //Location list
                if (sId.includes("Loc")) {
                    this.oLoc = that.byId("idloc");
                    var aSelectedLoc = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedLoc[0].getTitle());

                    this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();

                    // service to get the products based of location
                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                aSelectedLoc[0].getTitle()
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
                    var aSelectedProd = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(aSelectedProd[0].getTitle());


                }
            },

            attachDragDrop: function () {
                var oListPrim = this.byId("Primarytable");
                // adding drag and drop with first list
                oListPrim.addDragDropConfig(new DragInfo({
                    sourceAggregation: "items"
                }));

                oListPrim.addDragDropConfig(new DropInfo({
                    targetAggregation: "items",
                    dropPosition: DropPosition.Between,
                    dropLayout: DropLayout.Vertical,
                    drop: this.onDrop.bind(this)
                }));
                // adding drag and drop with second list
                var oListSec = this.byId("Secondarytable");
                oListSec.addDragDropConfig(new DragInfo({
                    sourceAggregation: "items"
                }));
                oListSec.addDragDropConfig(new DropInfo({
                    targetAggregation: "items",
                    dropPosition: DropPosition.Between,
                    dropLayout: DropLayout.Vertical,
                    drop: that.onDrop.bind(that)
                }));

            },
            // function drop list items
            onDrop: function (oInfo) {
                var oDragged = oInfo.getParameter("draggedControl"),
                    oDropped = oInfo.getParameter("droppedControl"),
                    sInsertPosition = oInfo.getParameter("dropPosition"),

                    oDragContainer = oDragged.getParent(),
                    oDropContainer = oInfo.getSource().getParent(),

                    oDragModel = oDragContainer.getModel(),
                    oDropModel = oDropContainer.getModel(),
                    oDragModelData = oDragModel.getData(),
                    oDropModelData = oDropModel.getData(),

                    iDragPosition = oDragContainer.indexOfItem(oDragged),
                    iDropPosition = oDropContainer.indexOfItem(oDropped);

                // remove the item
                var oItem = oDragModelData.results[iDragPosition];
                oDragModelData.results.splice(iDragPosition, 1);

                if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
                    iDropPosition--;
                }

                if (sInsertPosition === "After") {
                    iDropPosition++;
                }

                // insert the control in target aggregation
                oDropModelData.results.splice(iDropPosition, 0, oItem);

                if (oDragModel !== oDropModel) {
                    var oChar_Type;
                    var iSeq = 0;
                    if (oItem.CHAR_TYPE === "S") {
                        iSeq = oItem.SEQUENCE;
                        oChar_Type = "P";

                    } else {
                        oChar_Type = "S"
                        iSeq = oDropModelData.results.length;

                    }

                    that.getModel("BModel").callFunction("/changeToPrimary", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: oItem.LOCATION_ID,
                            PRODUCT_ID: oItem.PRODUCT_ID,
                            CHAR_NUM: oItem.CHAR_NUM,
                            SEQUENCE: iSeq,
                            CHAR_TYPE: oChar_Type,
                            FLAG: "C",
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.byId("idPrimarySearch").setValue("");
                            that.onPrimarySearch();
                            that.byId("searchField").setValue("");
                            that.onCharSearch();
                            that.onGetData();
                        },
                        error: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to changes the char");
                        },
                    });
                } else {
                    oDropModel.setData(oDropModelData);
                    var aData = this.byId("Secondarytable").getItems();

                    for (var i = 0; i < aData.length; i++) {
                        if (oItem.CHAR_NAME === aData[i].getCells()[1].getText()) {
                            aData[i + 1].focus();
                            aData[i].setSelected(true);
                        }
                    }
                    that.onSaveSeq(iDropPosition);
                }
            },

            onPrimarySearch: function () {
                var sQuery = that.byId("idPrimarySearch").getValue(),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";

                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("Primarytable").getBinding("items").filter(oFilters);

            },

            onCharSearch: function (oEvent) {
                var sQuery = that.byId("searchField").getValue(),
                    aData = this.byId("Secondarytable").getItems();
                sQuery = sQuery ? sQuery.trim() : "";
                if (sQuery === "") {
                    aData[0].focus();
                    aData[0].setSelected(true);

                } else {
                    for (var i = 0; i < aData.length; i++) {
                        if (sQuery === aData[i].getCells()[1].getText()) {
                            aData[i].focus();
                            aData[i].setSelected(true);
                        }
                    }
                }
            },

            onSuggest: function (event) {
                var sValue = event.getParameter("suggestValue"),
                    aFilters = [];
                    aFilters = [
                        new Filter([
                            new Filter("CHAR_NAME", function (sText) {
                                return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                            })
                        ], false)
                    ];

                this.byId("searchField").getBinding("suggestionItems").filter(aFilters);
                this.byId("searchField").suggest();
            },

            onSaveSeq: function (index) {
                var aData = this.byId("Secondarytable").getItems();
                // that.count = aData.length;
                that.count = index + 2;
                var successCount = 0;


                for (var i = 0; i < aData.length; i++) {
                    // for(var i=0; i<that.count; i++){
                    var oEntry = {};

                    oEntry.Location = that.byId("idloc").getValue();
                    oEntry.product = that.byId("prodInput").getValue();
                    oEntry.CharNo = aData[i].getCells()[0].getText();
                    // oEntry.charName = aData[i].getCells()[1].getText();
                    oEntry.SEQUENCE = i + 1;
                    oEntry.FLAG = "E";
                    oEntry.CHAR_TYPE = "S";

                    that.getModel("BModel").callFunction("/changeToPrimary", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: oEntry.Location,
                            PRODUCT_ID: oEntry.product,
                            CHAR_NUM: oEntry.CharNo,
                            SEQUENCE: oEntry.SEQUENCE,
                            CHAR_TYPE: oEntry.CHAR_TYPE,
                            FLAG: oEntry.FLAG,
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.changeToPrimary.includes("successful")) {
                                successCount = successCount + 1;
                            }

                            if (successCount === that.count) {
                                // MessageToast.show(oData.changeToPrimary);
                                MessageToast.show("Successfully changed the sequence");
                                that.byId("searchField").setValue("");
                                that.onCharSearch();
                                that.onGetData();
                            }
                        },
                        error: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to changes the char");
                        },
                    });

                }
            }
        });
    });
