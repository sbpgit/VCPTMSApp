sap.ui.define(
    [
        "cpapp/cpmatvariant/controller/BaseController",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/Device",
        "sap/ui/core/Fragment",
        "cpapp/cpmatvariant/model/formatter"
    ],
    function (
        BaseController,
        MessageToast,
        MessageBox,
        JSONModel,
        Filter,
        FilterOperator,
        Device,
        Fragment,
        formatter

    ) {
        "use strict";
        var that, oGModel;
        return BaseController.extend("cpapp.cpmatvariant.controller.ItemDetail", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                this.bus = sap.ui.getCore().getEventBus();
                // Declaring JSON Models and size limit
                that.oCharModel = new JSONModel();
                this.oCharModel.setSizeLimit(1000);
                that.charnameModel = new JSONModel();
                that.charvalueModel = new JSONModel();
                that.oTableData = [];
                that.ListModel = new JSONModel();

            },

            /**
             * Called after the view has been rendered.
             * Calls the service to get Data.
             */
            onAfterRendering: function () {
                oGModel = that.getOwnerComponent().getModel("oGModel");
                sap.ui.core.BusyIndicator.show();
                var sPrdId = oGModel.getProperty("/prdId");
                var sLocId = oGModel.getProperty("/locId");
                var sUniqId = oGModel.getProperty("/uniqId");
                var active = oGModel.getProperty("/uid_active");
                var oAddButton = that.byId("idadd");

                this.getModel("BModel").read("/getUniqueItem", {
                    filters: [
                        new Filter("LOCATION_ID", FilterOperator.EQ, sLocId),
                        new Filter("PRODUCT_ID", FilterOperator.EQ, sPrdId),
                        new Filter("UNIQUE_ID", FilterOperator.EQ, sUniqId),
                    ],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        if(oData.results.length === 0){
                            oAddButton.setProperty("visible",true);
                        }
                        else{
                            oAddButton.setProperty("visible",false);
                        }

                        oGModel.setProperty("/CharData", oData.results);

                        that.oCharModel.setData({
                            results: oData.results,
                        });
                        that.byId("idMatvarItem").setModel(that.oCharModel);
                            // if (active === false) {
                            //     that.byId("idadd").setVisible(true);
                            // }
                    },
                    error: function () {
                        MessageToast.show("Failed to get data");
                    },
                });
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            onCharSearch: function (oEvent) {
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
                                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery)
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idMatvarItem").getBinding("items").filter(oFilters);
            },

            onAddPress: function () {
                if (!this._addCharacteristic) {
                    this._addCharacteristic = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.AddCharacterstics",
                        this
                    );
                    this.getView().addDependent(this._addCharacteristic);
                }
                this._addCharacteristic.open();
                sap.ui.getCore().byId("iduinq2").setValue(oGModel.getProperty("/uniqId"));
            },
            handleValueHelp: function (oEvent) {

                if (!this._valueHelpDialogcharName) {
                    this._valueHelpDialogcharName = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.charName",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogcharName);
                }

                if (!this._valueHelpDialogcharValue) {
                    this._valueHelpDialogcharValue = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.charValue",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogcharValue);
                }

                if (!this._valueHelpDialogclassName) {
                    this._valueHelpDialogclassName = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.className",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogclassName);
                }

                var sId = oEvent.getParameter("id");
                var sPrdId = oGModel.getProperty("/prdId");
                var sLocId = oGModel.getProperty("/locId");

                if (sId.includes("Classname")) {
                    that.getModel("BModel").read("/getProdClass", {
                        filters: [
                            new Filter("PRODUCT_ID", FilterOperator.Contains, sPrdId),
                            new Filter("LOCATION_ID", FilterOperator.Contains, sLocId)

                        ],

                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.classNameData = oData.results;
                            var newClassModel = new JSONModel();
                            newClassModel.setData({ results: that.classNameData });
                            sap.ui.getCore().byId("classNameList").setModel(newClassModel);
                            that._valueHelpDialogclassName.open();
                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get class name data");
                        },
                    });

                } else if (sId.includes("Charname")) {
                    if (sap.ui.getCore().byId("idClassname2").getValue()) {
                        that._valueHelpDialogcharName.open();
                    } else {
                        MessageToast.show("Select Class Name");
                    }

                } else if (sId.includes("Charval")) {
                    if (sap.ui.getCore().byId("idCharname2").getValue()) {
                        that._valueHelpDialogcharValue.open();
                    } else {
                        MessageToast.show("Select Class Name and Characteristic Name");
                    }

                }
            },
            handleSelection: function (oEvent) {
                that.oGModel = that.getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                if (sId.includes("className")) {

                    that.oClassName = sap.ui.getCore().byId("idClassname2");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oClassName.setValue(aSelectedItems[0].getTitle());
                    oGModel.setProperty("/UID_Rate", aSelectedItems[0].getBindingContext().getProperty().CLASS_NUM);

                    sap.ui.getCore().byId("idCharname2").setValue("");

                    sap.ui.getCore().byId("idCharval2").setValue("");

                    this.getModel("BModel").read("/getClassChar", {
                        filters: [
                            new Filter(
                                "CLASS_NUM",
                                FilterOperator.EQ,
                                aSelectedItems[0].getBindingContext().getProperty().CLASS_NUM
                            ),
                            // new Filter(
                            //     "PRODUCT_ID",
                            //     FilterOperator.EQ,
                            //     oGModel.getProperty("/prdId")
                            // ),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();

                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            that.charnameModel.setData({
                                results: removeDuplicate(oData.results, 'CHAR_NAME')
                            });

                            sap.ui.getCore().byId("charNameList").setModel(that.charnameModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else if (sId.includes("charName")) {

                    that.oCharName = sap.ui.getCore().byId("idCharname2");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oCharName.setValue(aSelectedItems[0].getTitle());
                    oGModel.setProperty("/Char_Num", aSelectedItems[0].getDescription());


                    sap.ui.getCore().byId("idCharval2").setValue("");

                    this.getModel("BModel").read("/getClassChar", {
                        filters: [
                            new Filter(
                                "CLASS_NUM",
                                FilterOperator.EQ,
                                aSelectedItems[0].getBindingContext().getProperty().CLASS_NUM
                            ),
                            new Filter(
                                "CHAR_NAME",
                                FilterOperator.EQ,
                                sap.ui.getCore().byId("idCharname2").getValue()
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

                            sap.ui.getCore().byId("charValList").setModel(that.charvalueModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else if (sId.includes("charVal")) {
                    that.oCharVal = sap.ui.getCore().byId("idCharval2");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oCharVal.setValue(aSelectedItems[0].getTitle());
                    oGModel.setProperty("/CharVal_Num", aSelectedItems[0].getDescription());
                }
            },

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
                                    // new Filter("CLASS_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oClassnameList = sap.ui.getCore().byId("classNameList");
                    that.oClassnameList.getBinding("items").filter(oFilters);
                    // Char Name
                } else if (sId.includes("charName")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                    // new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCharnameList = sap.ui.getCore().byId("charNameList");
                    that.oCharnameList.getBinding("items").filter(oFilters);
                    // Char Value
                } else if (sId.includes("charVal")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                    // new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCharvalueList = sap.ui.getCore().byId("charValList");
                    that.oCharvalueList.getBinding("items").filter(oFilters);
                }
            },
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
            onCloseRestItem: function () {

                sap.ui.getCore().byId("idClassname2").setValue("");
                sap.ui.getCore().byId("idCharname2").setValue("");
                sap.ui.getCore().byId("idCharval2").setValue("");



                that._addCharacteristic.close();

            },


            onUpdateItem: function () {
                var Flag = "N",
                    oLocId = oGModel.getProperty("/locId"),
                    oProdId = oGModel.getProperty("/prdId"),
                    oUniqId = sap.ui.getCore().byId("iduinq2").getValue(),
                    oUID_charR = oGModel.getProperty("/uniqId"),
                    oCharNum = oGModel.getProperty("/Char_Num"),
                    oCharValNum = oGModel.getProperty("/CharVal_Num");
                var Charlist;
                var oEntry = { RTRCHAR: [] };

                Charlist = {
                    LOCATION_ID: oLocId,
                    PRODUCT_ID: oProdId,
                    UNIQUE_ID: oUniqId,
                    // UID_RATE:oUID_charR,
                    CHAR_NUM: oCharNum,
                    CHARVAL_NUM: oCharValNum
                }
                oEntry.RTRCHAR.push(Charlist);
                sap.ui.core.BusyIndicator.show();

                that.getModel("BModel").callFunction("/maintainUniqueChar", {
                    method: "GET",
                    urlParameters: {
                        FLAG: Flag,
                        // UNIQUECHAR: JSON.stringify(Charlist)
                        UNIQUECHAR: JSON.stringify(oEntry.RTRCHAR)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.maintainUniqueChar);
                        that.onAfterRendering();
                        that.onCloseRestItem();

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error");
                    },
                });
            },

            onAdd: function () {
                var charName = sap.ui.getCore().byId("idCharname2").getValue(),
                    charNum = oGModel.getProperty("/Char_Num"),
                    charVal_Name = sap.ui.getCore().byId("idCharval2").getValue(),
                    charVal_Num = oGModel.getProperty("/CharVal_Num"),
                    className = sap.ui.getCore().byId("idClassname2").getValue();

                if (charName !== "" && charVal_Name !== "" && className !== "") {

                    this.oData = {

                        "CLASS_NAME": className,
                        "CHAR_NAME": charName,
                        "CHAR_NUM": charNum,
                        "CHAR_VALUE": charVal_Name,
                        "CHARVAL_NUM": charVal_Num,
                        "OFLAG": "X",
                        // "ROW_ID": sap.ui.getCore().byId("idrowid").getValue(),
                    };
                    var oItemTable = this.byId("idMatvarItem").getItems();
                    var count = 0;

                    for (var i = 0; i < oItemTable.length; i++) {
                        if (oItemTable[i].getCells()[1].getText() === charNum &&
                            oItemTable[i].getCells()[3].getText() === charVal_Num) {
                            count = count + 1;
                        }
                    }

                    if (count === 0) {
                        
                        // Add entry to the table model
                        // that.oTableData.push(that.oData);
                        // that.ListModel = new JSONModel();

                        // that.ListModel.setData({
                        //     results: that.oTableData
                        // });
                        // that.byId("idMatvarItem").setModel(that.ListModel);

                        var itemTable = that.byId("idMatvarItem");

                        var columns = new sap.m.ColumnListItem({
                            cells: [
                                    new sap.m.Text({
                                        text: charName
                                    }),
                                    new sap.m.Text({
                                        text: charNum
                                    }),
                                    new sap.m.Text({
                                        text: charVal_Name
                                    }),
                                    new sap.m.Text({
                                        text: charVal_Num
                                    }),
                                    new sap.m.Button({
                                        icon:"sap-icon://decline",
                                        press: function(oEvt){
                                            that.onTabDel(oEvt);
                                        }
                                    })
                                ]
                                // type: "Navigation"
                        });
                        that.byId("idMatvarItem").getColumns()[4].setVisible(true)
    
                        itemTable.addItem(columns);




                        that.onCloseRestItem();
                        that.byId("idUpdateSave").setVisible(true);

                    } else {
                        sap.m.MessageToast.show("Characterstic is already maintained");
                    }

                } else {
                    MessageToast.show("Please fill all inputs");
                }


            },

            onDelete: function (oEvent) {
                var Flag = "D",
                    oLocId = oGModel.getProperty("/locId"),
                    oProdId = oGModel.getProperty("/prdId"),
                    oUniqId = oGModel.getProperty("/uniqId"),
                    // oUID_charR =oGModel.getProperty("/UID_Rate"),
                    oCharNum = oEvent.getParameters().listItem.getCells()[1].getText();
                // oCharValNum = oEvent.getParameters().listItem.getCells()[3].getText();
                var Charlist;
                var oEntry = { RTRCHAR: [] };

                Charlist = {
                    LOCATION_ID: oLocId,
                    PRODUCT_ID: oProdId,
                    UNIQUE_ID: oUniqId,
                    // UID_RATE:oUID_charR,
                    CHAR_NUM: oCharNum
                    // CHARVAL_NUM:oCharValNum
                }
                oEntry.RTRCHAR.push(Charlist);
                sap.ui.core.BusyIndicator.show();

                that.getModel("BModel").callFunction("/maintainUniqueChar", {
                    method: "GET",
                    urlParameters: {
                        FLAG: Flag,
                        // UNIQUECHAR: JSON.stringify(Charlist)
                        UNIQUECHAR: JSON.stringify(oEntry.RTRCHAR)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.maintainUniqueChar);
                        that.onAfterRendering();
                        that.onCloseRestItem();

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error");
                    },
                });
            },
            onTabDel:function(oEvent){
                var oTable = this.getView().byId("idMatvarItem");
                // oTable.removeItem(oEvent.getSource().getBindingContext().getObject());
                // var deleteRecord = oEvent.getSource();
                var tableLength = this.byId("idMatvarItem").getItems();
		for(var i=0;i<tableLength.length;i++){
			if(tableLength[i].getCells()[2].getText() === oEvent.getSource().getParent().getCells()[2].getText() && tableLength[i].getCells()[0].getText() === oEvent.getSource().getParent().getCells()[0].getText() )
					{
					//	pop this._data.Products[i] 
                    tableLength.splice(i,1); //removing 1 record from i th index.
						
						break;//quit the loop
					}
		}
            }

        });
    });
