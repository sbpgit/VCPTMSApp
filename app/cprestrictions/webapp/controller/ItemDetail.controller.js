sap.ui.define(
    [
        "cpapp/cprestrictions/controller/BaseController",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/Device",
        "sap/ui/core/Fragment",
    ],
    function (
        BaseController,
        MessageToast,
        MessageBox,
        JSONModel,
        Filter,
        FilterOperator,
        Device,
        Fragment
    ) {
        "use strict";
        var that, oGModel;
        return BaseController.extend("cpapp.cprestrictions.controller.ItemDetail", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                this.bus = sap.ui.getCore().getEventBus();
                // Declaring JSON Models and size limit
                that.oModel = new JSONModel();
                that.classnameModel = new JSONModel();
                that.charnameModel = new JSONModel();
                that.charvalueModel = new JSONModel();
                that.ListModel = new JSONModel();

                this.oModel.setSizeLimit(1000);
                that.classnameModel.setSizeLimit(1000);
                that.charnameModel.setSizeLimit(1000);
                that.charvalueModel.setSizeLimit(1000);

                oGModel = that.getOwnerComponent().getModel("oGModel");


                this._oCore = sap.ui.getCore();

            },

            /**
             * Called after the view has been rendered.
             * Calls the service to get Data.
             */
            onAfterRendering: function () {
                oGModel = that.getOwnerComponent().getModel("oGModel");
                sap.ui.core.BusyIndicator.show();
                var sRestriction = oGModel.getProperty("/Restriction");

                if (sRestriction !== "") {


                    this.getModel("BModel").read("/getODHdrRstr", {
                        filters: [
                            new Filter("RESTRICTION", FilterOperator.EQ, sRestriction),
                        ],

                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.oTableData = oData.results;
                            // if (oData.results.length) {
                            // I_26th_Sept    
                            oData.results.map(function (entry) {   
                                entry.bFlag = false;
                                return entry;
                            });
                            // I_26th_Sept
                            that.oModel.setData({
                                results: oData.results,
                            });
                            that.byId("idDetail").setModel(that.oModel);
                            // }
                            that.byId("idSearch").setValue("");

                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get data");
                        },
                    });

                    // if (oGModel.getProperty("/readClass") === "X") {


                    this.getModel("BModel").read("/getClass", {


                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.classNameData = oData.results;

                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get class name data");
                        },
                    });
                    // }


                }
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            onItemSearch: function (oEvent) {
                var sQuery = "",
                    oFilters = [];
                if (oEvent) {
                    sQuery =
                        oEvent.getParameter("value") || oEvent.getParameter("newValue");
                }

                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idDetail").getBinding("items").filter(oFilters);
            },


            onCreateItem: function () {

                if (!this._valueHelpDialogRestItem) {
                    this._valueHelpDialogRestItem = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.RestrictionItem",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogRestItem);
                }

                if (!this._valueHelpDialogclassName) {
                    this._valueHelpDialogclassName = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.className",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogclassName);
                }

                if (!this._valueHelpDialogcharName) {
                    this._valueHelpDialogcharName = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.charName",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogcharName);
                }

                if (!this._valueHelpDialogcharValue) {
                    this._valueHelpDialogcharValue = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.charValue",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogcharValue);
                }

                this.oClassName = this._oCore.byId("idClassname");
                this.oCharName = this._oCore.byId("idCharname");
                this.oCharValue = this._oCore.byId("idCharval");

                that._valueHelpDialogclassName.setTitleAlignment("Center");
                that._valueHelpDialogcharName.setTitleAlignment("Center");
                that._valueHelpDialogcharValue.setTitleAlignment("Center");

                this.oClassnameList = this._oCore.byId(
                    this._valueHelpDialogclassName.getId() + "-list"
                );

                this.oCharnameList = this._oCore.byId(
                    this._valueHelpDialogcharName.getId() + "-list"
                );

                this.oCharvalueList = this._oCore.byId(
                    this._valueHelpDialogcharValue.getId() + "-list"
                );

                that.classnameModel.setData({
                    results: that.classNameData,
                });
                sap.ui.getCore().byId("classNameList").setModel(that.classnameModel);

                that._valueHelpDialogRestItem.open();

            },
            onCloseRestItem: function () {
                // that.aData = [];
                // that.ListModel.setData({
                //     results: that.aData
                // });
                // sap.ui.getCore().byId("idItemList").setModel(that.ListModel);

                sap.ui.getCore().byId("idClassname").setValue("");
                sap.ui.getCore().byId("idCharname").setValue("");
                sap.ui.getCore().byId("idCharval").setValue("");
                // sap.ui.getCore().byId("idcharcounter").setValue("");
                // sap.ui.getCore().byId("idrowid").setValue("");
                sap.ui.getCore().byId("idClassno").setValue("");
                sap.ui.getCore().byId("idCharno").setValue("");
                sap.ui.getCore().byId("idCharvalno").setValue("");



                that._valueHelpDialogRestItem.close();

            },


            /**
         * This function is called when click on Value Help of Inputs.
         * In this function dialogs will open based on sId.
         * @param {object} oEvent -the event information.
         */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");

                if (sId.includes("Classname")) {
                    that._valueHelpDialogclassName.open();
                } else if (sId.includes("Charname")) {
                    if (sap.ui.getCore().byId("idClassname").getValue()) {
                        that._valueHelpDialogcharName.open();
                    } else {
                        MessageToast.show("Select Class Name");
                    }

                } else if (sId.includes("Charval")) {
                    if (sap.ui.getCore().byId("idCharname").getValue()) {
                        that._valueHelpDialogcharValue.open();
                    } else {
                        MessageToast.show("Select Class Name and Characteristic Name");
                    }

                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             */
            handleClose: function (oEvent) {
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
                // Class Name
                if (sId.includes("className")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                                    new Filter("CLASS_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oClassnameList.getBinding("items").filter(oFilters);
                    // Char Name
                } else if (sId.includes("charName")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                    new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCharnameList.getBinding("items").filter(oFilters);
                    // Char Value
                } else if (sId.includes("charVal")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                    new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCharvalueList.getBinding("items").filter(oFilters);
                }
            },


            /**
           * This function is called when selecting an item in dialogs .
           * @param {object} oEvent -the event information.
           */
            handleSelection: function (oEvent) {
                that.oGModel = that.getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                if (sId.includes("className")) {

                    that.oClassName = sap.ui.getCore().byId("idClassname");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oClassName.setValue(aSelectedItems[0].getTitle());
                    sap.ui.getCore().byId("idClassno").setValue(aSelectedItems[0].getDescription());

                    sap.ui.getCore().byId("idCharname").setValue("");
                    sap.ui.getCore().byId("idCharno").setValue("");
                    sap.ui.getCore().byId("idCharval").setValue("");
                    sap.ui.getCore().byId("idCharvalno").setValue("");

                    this.getModel("BModel").read("/getClassChar", {
                        filters: [
                            new Filter(
                                "CLASS_NAME",
                                FilterOperator.EQ,
                                sap.ui.getCore().byId("idClassname").getValue()
                            ),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            //  var aData;
                            // for(var i=0; i<oData.results; i++){
                            //     a
                            // }

                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            that.charnameModel.setData({
                                results: removeDuplicate(oData.results, 'CHAR_NAME')
                            });

                            that.oCharnameList.setModel(that.charnameModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else if (sId.includes("charName")) {

                    that.oCharName = sap.ui.getCore().byId("idCharname");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oCharName.setValue(aSelectedItems[0].getTitle());

                    sap.ui.getCore().byId("idCharno").setValue(aSelectedItems[0].getDescription());

                    sap.ui.getCore().byId("idCharval").setValue("");
                    sap.ui.getCore().byId("idCharvalno").setValue("");

                    this.getModel("BModel").read("/getClassChar", {
                        filters: [
                            new Filter(
                                "CLASS_NAME",
                                FilterOperator.EQ,
                                sap.ui.getCore().byId("idClassname").getValue()
                            ),
                            new Filter(
                                "CHAR_NAME",
                                FilterOperator.EQ,
                                sap.ui.getCore().byId("idCharname").getValue()
                            ),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();

                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            that.charvalueModel.setData({
                                results: removeDuplicate(oData.results, 'CHAR_VALUE')
                            });

                            that.oCharvalueList.setModel(that.charvalueModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else if (sId.includes("charVal")) {

                    that.oCharValue = sap.ui.getCore().byId("idCharval");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oCharValue.setValue(aSelectedItems[0].getTitle());
                    sap.ui.getCore().byId("idCharvalno").setValue(aSelectedItems[0].getDescription());

                }
                that.handleClose(oEvent);
            },

            onAdd: function (oEvent) {
                var oEntry = {
                    RTRCHAR: [],
                };
                var oFlag = "C";
                var oClassName = sap.ui.getCore().byId("idClassname").getValue(),
                    oCharName = sap.ui.getCore().byId("idCharname").getValue(),
                    oCharVal = sap.ui.getCore().byId("idCharval").getValue();
                // ocharCounter = sap.ui.getCore().byId("idcharcounter").getValue(),
                // oRowid = sap.ui.getCore().byId("idrowid").getValue();
                that.aData = [];

                if (oClassName !== "" && oCharName !== "" && oCharVal !== "") {

                    that.oData = {
                        "RESTRICTION": sap.ui.getCore().byId("idrest").getValue(),
                        "CLASS_NAME": oClassName,
                        "CLASS_NUM": sap.ui.getCore().byId("idClassno").getValue(),
                        "CHAR_NAME": oCharName,
                        "CHAR_NUM": sap.ui.getCore().byId("idCharno").getValue(),
                        // "CHAR_COUNTER": sap.ui.getCore().byId("idcharcounter").getValue(),
                        "CHAR_VALUE": oCharVal,
                        "CHARVAL_NUM": sap.ui.getCore().byId("idCharvalno").getValue(),
                        "OD_CONDITION": sap.ui.getCore().byId("idODcond").getSelectedKey(),
                        // "OFLAG": "X",
                        "bFLAG": true,
                        // "ROW_ID": sap.ui.getCore().byId("idrowid").getValue(),
                    };
                    var oItemTable = this.byId("idDetail").getItems();
                    var count = 0;

                    for (var i = 0; i < oItemTable.length; i++) {
                        if (oItemTable[i].getCells()[0].getText() === oClassName &&
                            oItemTable[i].getCells()[1].getText() === oCharName &&
                            oItemTable[i].getCells()[3].getText() === oCharVal) {
                            count = count + 1;
                        }
                    }

                    if (count === 0) {
                        // Add entry to the table model
                        that.oTableData.push(that.oData);

                        that.ListModel.setData({
                            results: that.oTableData
                        });
                        that.byId("idDetail").setModel(that.ListModel);
                        that.onCloseRestItem();
                        that.byId("idUpdateSave").setVisible(true);

                    } else {
                        sap.m.MessageToast.show("Restriction rule is already maintained");
                    }
                    // // Add entry to the table model
                    // that.oTableData.push(that.oData);

                    // that.ListModel.setData({
                    //     results: that.aData
                    // });
                    // sap.ui.getCore().byId("idItemList").setModel(that.ListModel);

                    // // sap.ui.getCore().byId("idrest").setValue("");
                    // sap.ui.getCore().byId("idClassname").setValue("");
                    // sap.ui.getCore().byId("idClassno").setValue("");
                    // sap.ui.getCore().byId("idCharname").setValue("");
                    // sap.ui.getCore().byId("idCharno").setValue("");
                    // sap.ui.getCore().byId("idcharcounter").setValue("");
                    // sap.ui.getCore().byId("idCharval").setValue("");
                    // sap.ui.getCore().byId("idCharvalno").setValue("");
                    // sap.ui.getCore().byId("idODcond").setValue("");
                    // sap.ui.getCore().byId("idrowid").setValue("");

                } else {
                    MessageToast.show("Please fill all inputs");
                }

            },

            // onSaveRest: function (oEvent) {
            //     var oTable = sap.ui.getCore().byId("idItemList").getItems();
            //     var oEntry = {
            //         RTRCHAR: [],
            //     },
            //         vRuleslist;
            //     var oFlag = "C";
            //     for (var i = 0; i < oTable.length; i++) {

            //         vRuleslist = {
            //             RESTRICTION: oTable[i].getCells()[0].getText(),
            //             CLASS_NUM: oTable[i].getCells()[2].getText(),
            //             CHAR_NUM: oTable[i].getCells()[4].getText(),
            //             CHAR_COUNTER: oTable[i].getCells()[5].getText(),
            //             CHARVAL_NUM: oTable[i].getCells()[7].getText(),
            //             OD_CONDITION: oTable[i].getCells()[8].getText(),
            //             ROW_ID: parseInt(oTable[i].getCells()[9].getText()),
            //         };
            //         oEntry.RTRCHAR.push(vRuleslist);
            //     }

            // that.getModel("BModel").callFunction("/maintainRestrDet", {
            //     method: "GET",
            //     urlParameters: {
            //         FLAG: oFlag,
            //         RTRCHAR: JSON.stringify(oEntry.RTRCHAR)
            //     },
            //     success: function (oData) {
            //         sap.ui.core.BusyIndicator.hide();
            //         sap.m.MessageToast.show("success");
            //         that.onAfterRendering();
            //         that.onCloseRestItem();

            //     },
            //     error: function (error) {
            //         sap.ui.core.BusyIndicator.hide();
            //         sap.m.MessageToast.show("Error");
            //     },
            // });
            // },

            // onCharDel: function (oEvent) {
            //     var oSelItem = oEvent.getParameters("listItem").id.split("CharList-")[1];
            //     var aData = that.ListModel.getData().results;
            //     aData.splice(oSelItem, 1); //removing 1 record from i th index.
            //     that.ListModel.refresh();


            // },

            // onEditItem: function (oEvent) {
            //     var oTable = this.byId("idDetail").getItems();
            //     this.byId("idUpdateSave").setVisible(true);
            //     this.byId("idUpdateCancel").setVisible(true);

            //     for (var i = 0; i < oTable.length; i++) {
            //         oTable[i].getCells()[4].setEditable(true);
            //         oTable[i].getCells()[5].setEditable(true);
            //     }

            // },

            // onRowIdChange: function (oEvent) {
            //     var oRow = parseInt(oEvent.getParameters().id.split("idDetail-")[1]),
            //         oValue = oEvent.getParameters().newValue;
            //     var oTable = this.byId("idDetail").getItems();
            //     for (var i = 0; i < oTable.length; i++) {
            //         if (oTable[i].getCells()[5].getValue() === oValue) {
            //             if (oRow !== i) {
            //                 sap.m.MessageToast.show("Row ID cannot be duplicate");
            //                 oTable[oRow].getCells()[5].setValue("");
            //             }
            //         }
            //     }

            // },



            // onCancelUpdate: function (oEvent) {
            //     var oTable = this.byId("idDetail").getItems();
            //     this.byId("idUpdateSave").setVisible(false);
            //     this.byId("idUpdateCancel").setVisible(false);
            //     oGModel.setProperty("/readClass", "");
            //     that.onAfterRendering();

            //     for (var i = 0; i < oTable.length; i++) {
            //         oTable[i].getCells()[4].setEditable(false);
            //         oTable[i].getCells()[5].setEditable(false);
            //     }

            // },

            onUpdateItem: function (oEvent) {
                var oTable = this.byId("idDetail").getItems();
                var oEntry = {
                    RTRCHAR: [],
                },
                    vRuleslist;
                var sNoRow = "";
                //var oFlag = "E";
                var oFlag = "C";
                var aData = {};
                for (var i = 0; i < oTable.length; i++) {
                    aData = oTable[i].getBindingContext().getObject()

                    // if (oTable[i].getCells()[5].getValue() === "") {
                    //     sNoRow = "X"
                    // }
                    if (aData.bFLAG === true) {
                        vRuleslist = {
                            RESTRICTION: aData.RESTRICTION,
                            CLASS_NUM: aData.CLASS_NUM,
                            CHAR_NUM: aData.CHAR_NUM,
                            CHARVAL_NUM: aData.CHARVAL_NUM,
                            OD_CONDITION: oTable[i].getCells()[2].getText(),
                            FLAG: oTable[i].getCells()[4].getText(),          // I_26th_Sept

                            // CHAR_COUNTER: aData.CHAR_COUNTER,
                            // OD_CONDITION: oTable[i].getCells()[4].getSelectedKey(),
                            // ROW_ID: oTable[i].getCells()[5].getValue(),
                        };
                        oEntry.RTRCHAR.push(vRuleslist);
                    }
                }
                // if (sNoRow !== "X") {

                if (oEntry.RTRCHAR.length > 0) {
                    that.getModel("BModel").callFunction("/maintainRestrDetail", {
                        method: "GET",
                        urlParameters: {
                            FLAG: oFlag,
                            RTRCHAR: JSON.stringify(oEntry.RTRCHAR)
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("success");
                            that.onAfterRendering();
                            that.byId("idUpdateSave").setVisible(false);
                            // that.onCancelUpdate();

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error");
                        },
                    });
                }
                // } else {
                //     sap.m.MessageToast.show("Maintain all unique row id's");
                // }
            },


            onDeleteItem: function (oEvent) {

                var selItem = oEvent.getSource().getParent().getBindingContext().getObject();


                if (selItem.OFLAG === "X") {
                    var oItemtoDelete = oEvent.getParameters("listItem").id.split("idDetail-")[1];
                    var aData = that.ListModel.getData().results;
                    aData.splice(oItemtoDelete, 1); //removing 1 record from i th index.
                    that.ListModel.refresh();
                } else {


                    var oEntry = {
                        RTRCHAR: [],
                    },
                        vRuleslist;
                    var oFlag = "D";


                    vRuleslist = {
                        RESTRICTION: selItem.RESTRICTION,
                        CLASS_NUM: selItem.CLASS_NUM,
                        CHAR_NUM: selItem.CHAR_NUM,
                        CHARVAL_NUM: selItem.CHARVAL_NUM,
                        CHAR_COUNTER: selItem.CHAR_COUNTER,
                    };
                    oEntry.RTRCHAR.push(vRuleslist);

                    that.getModel("BModel").callFunction("/maintainRestrDet", {
                        method: "GET",
                        urlParameters: {
                            FLAG: oFlag,
                            RTRCHAR: JSON.stringify(oEntry.RTRCHAR)
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("success");
                            that.onAfterRendering();

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error");
                        },
                    });
                }
            },











        });
    }
);
