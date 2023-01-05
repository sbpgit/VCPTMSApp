sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "cpapp/cpfullyconfproddmnd/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/export/library",
        "sap/ui/export/Spreadsheet"
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
        MessageBox,
        exportLibrary,
        Spreadsheet
    ) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        var oGModel, that;
        return BaseController.extend("cpapp.cpfullyconfproddmnd.controller.UniqueCharDetails", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                var oRouter;
                MessageToast.show("Unique Characteristics Details");

                oGModel = that.getOwnerComponent().getModel("oGModel");

                that.allCharsModel = new JSONModel();
                that.allCharsModel.setSizeLimit(2000);

                that.locProdCharModel = new JSONModel();
                that.locProdCharModel.setSizeLimit(2000);

                that.weeklyCIRModel = new JSONModel();
                that.weeklyCIRModel.setSizeLimit(2000);

                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");

                oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteUniqChar").attachMatched(this._onRouteMatched, this);
            },
            /**
             * 
             * @param {*} oEvent 
             */
            onAfterRendering: function (oEvent) {
                // Set Visible Row Count
                that.handleVisibleRowCountU(0);
            },

            /**
            * 
            */
            onUniqueIdLinkPress: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                // var selColumnId = oEvent.getSource().getAriaLabelledBy()[0];
                // var tableColumns = that.byId("idCIReq").getColumns(),
                //     selColumnValue = oEvent.getSource().getText(),
                //     ObindingData = oEvent.getSource().getBindingContext().getObject(),
                //     selUniqueId = ObindingData['Unique ID'];  //ObindingData.Unique_ID;     

                oGModel = that.getOwnerComponent().getModel('oGModel');

                // Calling function if selected item is not empty

                // if (selColumnValue > 0) {

                that.getModel("CIRModel").callFunction("/getUniqueChars", {
                    method: "GET",
                    urlParameters: {
                        UNIQUE_ID: oGModel.getProperty("/SelectedUniqueId"),
                        PRODUCT_ID: oGModel.getProperty("/SelectedProd"),
                        LOCATION_ID: oGModel.getProperty("/SelectedLoc")
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.formatUniqueCharsData(oData.results);
                    },
                    error: function (data) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error While fetching data");
                    },
                });
                // }
            },

            /**
             * 
             */
            formatUniqueCharsData: function (aUniqueChars) {
                oGModel = that.getOwnerComponent().getModel('oGModel');
                var aUniqueIdsChars = aUniqueChars;
                var oColumn = {},
                    oRowData = {},
                    aColumns = [],
                    aRowData = [];
                var aConfig = [];
                var aFilteredUniqueChars = [];
                var iCounter = 0, iTotal = 0, iCIRQty = 0;
                var columnName;
                var bVisible = true;
                var bCellColor = "";
                var sCellColor;
                var sColumnName,
                    sColDesc,
                    sCharValPath,
                    sCharValDescPath;
                var aCIRData = oGModel.getProperty("/CIRQtys");
                var aFilCIRData = [];
                var dSelDate = that.SEL_DATE;

                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");

                if (aUniqueIdsChars.length > 0) {
                    // Looping through the data to generate columns
                    for (var i = 0; i < aUniqueIdsChars.length; i++) {
                        oColumn = {};

                        if (i === 0) {
                            aConfig = aUniqueIdsChars[i].CONFIG;
                            oColumn.UNIQUE_CHAR = 'Characteristic';
                            oColumn.TOTAL = aUniqueIdsChars[i].TOTAL;
                            oColumn.CIRQTY = '';
                            aColumns.push(oColumn);
                            oColumn = {};
                        }

                        // Get Weekly Quantity
                        aFilCIRData = [];
                        aFilCIRData = aCIRData.filter(function (aCIRQty) {
                            return aCIRQty['Unique ID'] === (aUniqueIdsChars[i].UNIQUE_ID).toString();
                        });
                        if (aFilCIRData.length > 0) {
                            oColumn.CIRQTY = aFilCIRData[0][dSelDate];
                        } else {
                            oColumn.CIRQTY = 0;
                        }

                        // Columns (UNIQUE_IDs)
                        oColumn.UNIQUE_CHAR = aUniqueIdsChars[i].UNIQUE_ID;
                        oColumn.UNIQUE_DESC = aUniqueIdsChars[i].UNIQUE_DESC;
                        oColumn.TOTAL = aUniqueIdsChars[i].TOTAL;
                        aColumns.push(oColumn);
                    }

                    for (var j = 0; j < aConfig.length; j++) { // Base Configurations
                        oRowData = {};
                        oRowData['Characteristic'] = [{ CHAR_NAME: aConfig[j].CHAR_NAME, CHAR_DESC: aConfig[j].CHAR_DESC }];

                        for (var k = 1; k < aColumns.length; k++) {

                            aFilteredUniqueChars = [];
                            aFilteredUniqueChars = aUniqueIdsChars.filter(function (aUniqChar) {
                                return aUniqChar.UNIQUE_ID === aColumns[k].UNIQUE_CHAR;
                            });
                            aFilteredUniqueChars = aFilteredUniqueChars[0].CONFIG;

                            for (var l = 0; l < aFilteredUniqueChars.length; l++) {
                                bCellColor = "";
                                if (aConfig[j].CHAR_NAME === aFilteredUniqueChars[l].CHAR_NAME &&
                                    aConfig[j].CHAR_DESC === aFilteredUniqueChars[l].CHAR_DESC &&
                                    aConfig[j].CHAR_NUM === aFilteredUniqueChars[l].CHAR_NUM
                                ) {
                                    if (aConfig[j].CHARVAL_NUM !== aFilteredUniqueChars[l].CHARVAL_NUM) {
                                        bCellColor = "sap-icon://sys-cancel-2";
                                    }
                                    oRowData[aColumns[k].UNIQUE_CHAR] = [{ CHAR_VALUE: aFilteredUniqueChars[l].CHAR_VALUE, CHARVAL_DESC: aFilteredUniqueChars[l].CHARVAL_DESC, CHAR_NUM: aFilteredUniqueChars[l].CHAR_NUM, CHARVAL_NUM: aFilteredUniqueChars[l].CHARVAL_NUM, CELL_COLOR: bCellColor }];

                                    //   oRowData[aColumns[k].UNIQUE_CHAR] = [aConfig[j].CHAR_VALUE, aConfig[j].CHARVAL_DESC];    
                                    break;
                                }
                            }
                        }
                        aRowData.push(oRowData);
                        oRowData = {};
                    }

                    // Adding rows and columns data to JSON Model
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({
                        rows: aRowData,
                        columns: aColumns,
                    });
                    that.oUniqueCharTable.setModel(oModel);
                    // Checking column names and applying sap.m.Link to column values
                    that.oUniqueCharTable.bindColumns("/columns", function (sId, oContext) {
                        iTotal = 0;
                        iCounter = iCounter + 1;
                        columnName = oContext.getObject().UNIQUE_CHAR;

                        iTotal = oContext.getObject().TOTAL;
                        iCIRQty = oContext.getObject().CIRQTY;
                        // sColumnName = columnName.toString() + " (" + iTotal + ")";
                        sColumnName = columnName.toString();
                        sColDesc = oContext.getObject().UNIQUE_DESC + " (" + iTotal + ")" + " - (" + iCIRQty + ")";

                        if (columnName === 'Characteristic') {
                            sCharValPath = columnName + "/0/CHAR_NAME";
                            sCharValDescPath = columnName + "/0/CHAR_DESC";
                            return new sap.ui.table.Column({
                                // width: "11rem",
                                label: sColumnName,
                                // filterProperty: columnName,
                                template: new sap.m.ObjectIdentifier({
                                    title: "{" + sCharValDescPath + "}",
                                    text: "{" + sCharValPath + "}"
                                })
                            });

                        } else {
                            if (iCounter > 7) {
                                bVisible = false;
                            }

                            sCharValPath = columnName + "/0/CHAR_VALUE";
                            sCharValDescPath = columnName + "/0/CHARVAL_DESC";
                            sCellColor = columnName + "/0/CELL_COLOR";

                            return new sap.ui.table.Column({
                                // width: "13rem",
                                name: sColumnName,
                                label: sColDesc,
                                visible: bVisible,
                                template: new sap.m.HBox({
                                    alignItems: "Center",
                                    justifyContent: "SpaceBetween",
                                    items: [
                                        new sap.m.ObjectIdentifier({
                                            title: "{" + sCharValDescPath + "}",
                                            text: "{" + sCharValPath + "}"
                                        }),
                                        new sap.ui.core.Icon({ src: "{" + sCellColor + "}", color: "Critical" })

                                    ]
                                })


                            });
                        }
                    });

                    that.oUniqueCharTable.bindRows("/rows");

                }

            },
            /**
             * 
             * @param {*} oEvent 
             */
            onFilterSelectionChange: function (oEvent) {
                var sSelectedKey;
                var aSelectedItems = [];
                var oMulCombBox;
                sSelectedKey = oEvent.getParameter("selectedItem").getKey();
                oMulCombBox = that.getView().byId("idUniqueCharDetailsU");
                aSelectedItems = oMulCombBox.getSelectedItems();

                switch (sSelectedKey) {
                    case 'NE':
                        that.getUniqueIdsNESelChars(aSelectedItems);
                        break;

                    case 'EQ':
                        that.getUniqueIdsEQSelChars(aSelectedItems);
                        break;

                    default:
                        break;
                }

            },

            /** Filter Unique Ids based on Characteristics Selections */
            onCharacteristicSelFinish: function (oEvent) {
                var aUniqueChars = [];
                var aFilterUniqueIds = [];
                var aSelectedItems = [];
                var sCharVal_Num = '';
                var sCharNum = '';
                var sUniqueId = '';
                var iCount = 0;
                var aUniqueIdFilter = [];
                var aFilter = [];
                var aColumns = [];
                var sFilterType = '';
                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");
                aColumns = that.oUniqueCharTable.getColumns();
                aUniqueChars = that.allCharsModel.getData().charDetails;
                aSelectedItems = oEvent.getParameter('selectedItems');
                if (aSelectedItems.length > 0) {

                    sFilterType = that.getView().byId("_IDGenUSelect").getSelectedKey();

                    switch (sFilterType) {
                        case 'NE':
                            that.getUniqueIdsNESelChars(aSelectedItems);
                            break;

                        case 'EQ':
                            that.getUniqueIdsEQSelChars(aSelectedItems);
                            break;

                        default:
                            break;
                    }

                } else {

                    for (var k = 0; k < aColumns.length; k++) {
                        if (k < 7) {
                            if (!aColumns[k].getProperty("visible")) {
                                aColumns[k].setVisible(true);
                            }
                        } else {
                            aColumns[k].setVisible(false);
                        }
                    }
                }
            },
            /**
             * 
             */
            getUniqueIdsNESelChars: function (aSelectedItems) {
                var aUniqueChars = [];
                var aFilterUniqueIds = [];
                // var aSelectedItems = [];
                var sCharVal_Num = '';
                var sCharNum = '';
                var sUniqueId = '';
                var iCount = 0;
                var aUniqueIdFilter = [];
                var aFilter = [];
                var aColumns = [];
                var sFilterType = '';
                var scolumnName = '';
                var iCounter = 0;
                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");
                aColumns = that.oUniqueCharTable.getColumns();

                aUniqueChars = that.allCharsModel.getData().charDetails;
                var aFilteredUniqueChars = aUniqueChars;
                for (var i = 0; i < aSelectedItems.length; i++) {
                    sCharNum = aSelectedItems[i].getKey().split(':')[0];
                    sCharVal_Num = aSelectedItems[i].getKey().split(':')[1];

                    if (aUniqueIdFilter.length > 0) {
                        const ids = aUniqueIdFilter.map(o => o.UNIQUE_ID)
                        // aFilteredUniqueChars = aUniqueChars.filter(({ UNIQUE_ID }, index) => !ids.includes(UNIQUE_ID,index + 1));
                        aFilteredUniqueChars = aUniqueChars.filter((i) => ids.indexOf(i.UNIQUE_ID) !== -1);
                    }
                    aUniqueIdFilter = [];
                    for (var j = 0; j < aFilteredUniqueChars.length; j++) {

                        if (aFilteredUniqueChars[j].CHAR_NUM === sCharNum &&
                            aFilteredUniqueChars[j].CHARVAL_NUM !== sCharVal_Num) {

                            sUniqueId = aFilteredUniqueChars[j].UNIQUE_ID;
                            if (aUniqueIdFilter.includes(sUniqueId) === false) {
                                aUniqueIdFilter.push({ UNIQUE_ID: sUniqueId });
                            }
                        }
                    }

                }
                if (aUniqueIdFilter.length > 0) {
                    return aUniqueIdFilter;
                    // for (var k = 2; k < aColumns.length; k++) {
                    //     scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                    //     aFilterUniqueIds = aUniqueIdFilter.filter(function (aUniqChar) {
                    //         return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                    //     });
                    //     if (aFilterUniqueIds.length > 0) {
                    //         iCounter = iCounter + 1;
                    //         if (iCounter >= 5) {
                    //             aColumns[k].setVisible(false);
                    //         } else {
                    //             aColumns[k].setVisible(true)
                    //         }
                    //     } else {
                    //         aColumns[k].setVisible(false);
                    //     }

                    // }

                }

            },
            /**
             * 
             */
            getUniqueIdsEQSelChars: function (aSelectedItems) {
                var aUniqueChars = [];
                var aFilterUniqueIds = [];
                // var aSelectedItems = [];
                var sCharVal_Num = '';
                var sCharNum = '';
                var sUniqueId = '';
                var iCount = 0;
                var aUniqueIdFilter = [];
                var aFilter = [];
                var aColumns = [];
                var sFilterType = '';
                var iCounter = 0;
                var scolumnName = '';
                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");
                aColumns = that.oUniqueCharTable.getColumns();

                aUniqueChars = that.allCharsModel.getData().charDetails;
                var aFilteredUniqueChars = aUniqueChars;
                for (var i = 0; i < aSelectedItems.length; i++) {
                    sCharNum = aSelectedItems[i].getKey().split(':')[0];
                    sCharVal_Num = aSelectedItems[i].getKey().split(':')[1];

                    if (aUniqueIdFilter.length > 0) {
                        const ids = aUniqueIdFilter.map(o => o.UNIQUE_ID)
                        // aFilteredUniqueChars = aUniqueChars.filter(({ UNIQUE_ID }, index) => !ids.includes(UNIQUE_ID,index + 1));
                        aFilteredUniqueChars = aUniqueChars.filter((i) => ids.indexOf(i.UNIQUE_ID) !== -1);
                    }
                    aUniqueIdFilter = [];
                    for (var j = 0; j < aFilteredUniqueChars.length; j++) {

                        if (aFilteredUniqueChars[j].CHAR_NUM === sCharNum &&
                            aFilteredUniqueChars[j].CHARVAL_NUM === sCharVal_Num) {

                            sUniqueId = aFilteredUniqueChars[j].UNIQUE_ID;
                            if (aUniqueIdFilter.includes(sUniqueId) === false) {
                                aUniqueIdFilter.push({ UNIQUE_ID: sUniqueId });
                            }
                        }
                    }

                }
                if (aUniqueIdFilter.length > 0) {
                    return aUniqueIdFilter;
                    // for (var k = 2; k < aColumns.length; k++) {
                    //     scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                    //     aFilterUniqueIds = aUniqueIdFilter.filter(function (aUniqChar) {
                    //         return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                    //     });
                    //     if (aFilterUniqueIds.length > 0) {
                    //         iCounter = iCounter + 1;
                    //         if (iCounter >= 5) {
                    //             aColumns[k].setVisible(false);
                    //         } else {
                    //             aColumns[k].setVisible(true)
                    //         }
                    //     } else {
                    //         aColumns[k].setVisible(false);
                    //     }

                    // }

                }

            },

            /**
             * 
             */
            onUniqueIdsFilter: function () {
                // var oSource = oEvent.getSource();
                var aColumns = that.oUniqueCharTable.getColumns();
                var aIndices = that.oUniqueCharTable.getBinding().aIndices;
                var aList = that.oUniqueCharTable.getBinding().oList;
                var aFilteredList = [];
                var sColLabel = " ";
                var iTotalQty = 0;
                var sColumnName = "";
                aFilteredList = aList.filter((el, i) => aIndices.some(j => i === j));
                for (var i = 2; i < aColumns.length; i++) {
                    sColLabel = aColumns[i].getLabel().getText().split(" ");
                    iTotalQty = 0;
                    for (var j = 0; j < aFilteredList.length; j++) {
                        iTotalQty = iTotalQty + aFilteredList[j][sColLabel[0]];
                    }
                    sColumnName = sColLabel[0] + " (" + iTotalQty + ")";
                    aColumns[i].setLabel(sColumnName);
                }
            },
            /**
             * 
             */
            onSelectRBCharFilter: function (oEvent) {
                var aFilter = [];
                var sSelText = oEvent.getSource().getSelectedButton().getText();
                var oTable = that.byId("idUniqueIdChars");
                var aColumns = oTable.getColumns();
                var aFilterUniqueIds = [];
                var sColLabel = '';
                var sPath = "";
                switch (sSelText) {
                    case 'All':
                        oTable.getBinding().filter(aFilter);
                        break;
                    case 'Matched':
                        for (var i = 2; i < 7; i++) {
                            // sColLabel = aColumns[i].getLabel().getText().split(" ");
                            // sPath = sColLabel[0] + '/0/CELL_COLOR';
                            sColLabel = aColumns[i].getName();
                            sPath = sColLabel + '/0/CELL_COLOR';
                            aFilterUniqueIds.push(new Filter(sPath, FilterOperator.EQ, ''));
                        }
                        aFilter = new Filter(aFilterUniqueIds, true);
                        oTable.getBinding().filter(aFilter);

                        break;
                    case 'UnMatched':
                        for (var i = 0; i < 7; i++) {
                            // sColLabel = aColumns[i].getLabel().getText().split(" ");
                            // sPath = sColLabel[0] + '/0/CELL_COLOR';
                            sColLabel = aColumns[i].getName();
                            sPath = sColLabel + '/0/CELL_COLOR';
                            aFilterUniqueIds.push(new Filter(sPath, FilterOperator.EQ, 'sap-icon://sys-cancel-2'));
                        }
                        aFilter = new Filter(aFilterUniqueIds, false);
                        oTable.getBinding().filter(aFilter);
                        break;
                    default:
                        oTable.getBinding().filter(aFilter);
                        break;

                }

            },
            /**
             * 
             * @param {*} oEvent 
             */
            onEQSelectionChange: function (oEvent) {
                var aSelectedItemsEQ = [];
                var oMulCombBoxEQ;
                var aSelCharNum = [];
                var sCharNum = '';
                oMulCombBoxEQ = that.getView().byId("idUniqueCharDetailsEQ");
                aSelectedItemsEQ = oMulCombBoxEQ.getSelectedItems();
                for (var i = 0; i < aSelectedItemsEQ.length; i++) {
                    sCharNum = aSelectedItemsEQ[i].getKey().split(':')[0];
                    // sCharVal_Num = aSelectedItemsEQ[i].getKey().split(':')[1];
                    if (aSelCharNum.length > 0) {
                        if (aSelCharNum.includes(sCharNum) === true) {
                            MessageToast.show("Cannot select multiple values for each characteristic!",
                                { width: "25rem" });
                            oMulCombBoxEQ.removeSelectedItem(aSelectedItemsEQ[i]);
                            break;
                        } else {
                            aSelCharNum.push(sCharNum);
                        }
                    } else {
                        aSelCharNum.push(sCharNum);
                    }
                }
            },
            /**
             * 
             * @param {*} oEvent 
             */
            onNEQSelectionChange: function (oEvent) {
                var aSelectedItemsNEQ = [];
                var oMulCombBoxNEQ;
                var aSelCharNum = [];
                var sCharNum = '';
                oMulCombBoxNEQ = that.getView().byId("idUniqueCharDetailsNEQ");
                aSelectedItemsNEQ = oMulCombBoxNEQ.getSelectedItems();
                for (var i = 0; i < aSelectedItemsNEQ.length; i++) {
                    sCharNum = aSelectedItemsNEQ[i].getKey().split(':')[0];
                    // sCharVal_Num = aSelectedItemsEQ[i].getKey().split(':')[1];
                    if (aSelCharNum.length > 0) {
                        if (aSelCharNum.includes(sCharNum) === true) {
                            MessageToast.show("Cannot select multiple values for each characteristic!",
                                { width: "25rem" });
                            oMulCombBoxNEQ.removeSelectedItem(aSelectedItemsNEQ[i]);
                            break;
                        } else {
                            aSelCharNum.push(sCharNum);
                        }
                    } else {
                        aSelCharNum.push(sCharNum);
                    }
                }
            },
            /**
             * 
             * @param {*} oEvent 
             */
            onFilterData: function (oEvent) {
                var aSelectedItemsEQ = [], aSelectedItemsNEQ = [];
                var oMulCombBoxEQ, oMulCombBoxNEQ;
                var aEQUniqueChars = [],
                    aNEQUniqueChars = [],
                    aFilterUniqueIds = [],
                    aFilterUniqueIdsNEQ = [],
                    aColumns = [];
                var scolumnName = '';
                var iCounter = 0;
                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");
                aColumns = that.oUniqueCharTable.getColumns();
                oMulCombBoxEQ = that.getView().byId("idUniqueCharDetailsEQ");
                oMulCombBoxNEQ = that.getView().byId("idUniqueCharDetailsNEQ");
                aSelectedItemsEQ = oMulCombBoxEQ.getSelectedItems();
                aSelectedItemsNEQ = oMulCombBoxNEQ.getSelectedItems();

                if (aSelectedItemsEQ.length > 0) {
                    aEQUniqueChars = that.getUniqueIdsEQSelChars(aSelectedItemsEQ);
                    if (aEQUniqueChars === undefined) {
                        aEQUniqueChars = [];
                    }
                }

                if (aSelectedItemsNEQ.length > 0) {
                    aNEQUniqueChars = that.getUniqueIdsNESelChars(aSelectedItemsNEQ);
                    if (aNEQUniqueChars === undefined) {
                        aNEQUniqueChars = [];
                    }
                }

                if (aEQUniqueChars.length > 0 && aNEQUniqueChars.length > 0) {
                    for (var k = 2; k < aColumns.length; k++) {
                        // scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                        scolumnName = aColumns[k].getName();
                        aFilterUniqueIds = aEQUniqueChars.filter(function (aUniqChar) {
                            return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                        });
                        aFilterUniqueIdsNEQ = aNEQUniqueChars.filter(function (aUniqChar) {
                            return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                        });
                        if (aFilterUniqueIds.length > 0 && aFilterUniqueIdsNEQ.length > 0) {
                            iCounter = iCounter + 1;
                            if (iCounter > 5) {
                                aColumns[k].setVisible(false);
                            } else {
                                aColumns[k].setVisible(true)
                            }
                        } else {
                            aColumns[k].setVisible(false);
                        }

                    }

                } else if (aEQUniqueChars.length > 0 && aNEQUniqueChars.length === 0) {
                    for (var k = 2; k < aColumns.length; k++) {
                        // scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                        scolumnName = aColumns[k].getName();
                        aFilterUniqueIds = aEQUniqueChars.filter(function (aUniqChar) {
                            return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                        });
                        if (aFilterUniqueIds.length > 0) {
                            iCounter = iCounter + 1;
                            if (iCounter > 5) {
                                aColumns[k].setVisible(false);
                            } else {
                                aColumns[k].setVisible(true)
                            }
                        } else {
                            aColumns[k].setVisible(false);
                        }

                    }

                } else if (aEQUniqueChars.length === 0 && aNEQUniqueChars.length > 0) {
                    for (var k = 2; k < aColumns.length; k++) {
                        // scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                        scolumnName = aColumns[k].getName();
                        aFilterUniqueIds = aNEQUniqueChars.filter(function (aUniqChar) {
                            return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                        });
                        if (aFilterUniqueIds.length > 0) {
                            iCounter = iCounter + 1;
                            if (iCounter > 5) {
                                aColumns[k].setVisible(false);
                            } else {
                                aColumns[k].setVisible(true)
                            }
                        } else {
                            aColumns[k].setVisible(false);
                        }

                    }

                } else {
                    for (var k = 2; k < aColumns.length; k++) {
                        // scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                        scolumnName = aColumns[k].getName();
                        iCounter = iCounter + 1;
                        if (iCounter > 5) {
                            aColumns[k].setVisible(false);
                        } else {
                            aColumns[k].setVisible(true)
                        }
                    }
                }
            },
            /**
             * 
             */
            onChangeHeaderPinStatusU: function (oEvent) {
                if (oEvent.getSource()._bHeaderExpanded === true) {
                    that.handleVisibleRowCountU(5);
                } else {
                    that.handleVisibleRowCountU(0);
                }

            },
            /**
             * 
             */
            handleVisibleRowCountU: function (iCount) {
                var iWinH = window.innerHeight;
                if (iWinH > 750 && iWinH < 800) {
                    that.byId("idUniqueIdChars").setVisibleRowCount(9 + iCount);
                } else if (iWinH > 800 && iWinH < 900) {
                    that.byId("idUniqueIdChars").setVisibleRowCount(10 + iCount);
                } else if (iWinH > 900 && iWinH < 1000) {
                    that.byId("idUniqueIdChars").setVisibleRowCount(12 + iCount);
                } else if (iWinH > 1000 && iWinH < 1100) {
                    that.byId("idUniqueIdChars").setVisibleRowCount(14 + iCount);
                } else {
                    that.byId("idUniqueIdChars").setVisibleRowCount(7 + iCount);
                }
            },
            /**
             * 
             */
            onResetFilters: function () {
                var aColumns = [];
                var scolumnName = '';
                var iCounter = 0;
                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");
                aColumns = that.oUniqueCharTable.getColumns();

                that.getView().byId("idUniqueCharDetailsEQ").removeAllSelectedItems();
                that.getView().byId("idUniqueCharDetailsNEQ").removeAllSelectedItems();

                for (var k = 2; k < aColumns.length; k++) {
                    // scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                    scolumnName = aColumns[k].getName();
                    iCounter = iCounter + 1;
                    if (iCounter > 5) {
                        aColumns[k].setVisible(false);
                    } else {
                        aColumns[k].setVisible(true)
                    }
                }
            },
            /**
             * 
             * @param {*} oEvent 
             */
            setWeekDates: function (oEvent) {
                oGModel = that.getOwnerComponent().getModel("oGModel");
                var aDates = oGModel.getProperty("/TDates");
                var dFrozenHorizonDate = oGModel.getProperty("/dFrozenHorizonDate");
                // var dFirmHorizonDate = oGModel.getProperty("/dFirmHorizonDate");
                var oWeekDates = {},
                    aWeekDates = [];
                var bFlag = false;
                var dWeekDate;
                var iWeekIndex;

                for (var i = 0; i < aDates.length; i++) {
                    oWeekDates = {};
                    dWeekDate = new Date(aDates[i].WEEK_DATE);
                    if ((aDates[i].WEEK_DATE).includes("-") === true) {
                        oWeekDates.WEEK_DATE = aDates[i].WEEK_DATE;
                        if (dWeekDate >= dFrozenHorizonDate) {

                            if (bFlag === false) {
                                that.SEL_DATE = aDates[i].WEEK_DATE;
                                bFlag = true;
                            }
                        }
                        iWeekIndex = that.getWeekNumber(aDates[i].WEEK_DATE);
                        oWeekDates.WEEK_INDEX = "W" + iWeekIndex;
                        aWeekDates.push(oWeekDates);
                    }

                }
                if (aWeekDates.length > 0) {
                    that.weeklyCIRModel.setData({
                        weeks: aWeekDates
                    });

                    that.getView().byId("_IDWeekDtSel").setModel(that.weeklyCIRModel);
                    that.getView().byId("_IDWeekDtSel").setSelectedKey(that.SEL_DATE);
                }

            },
            /**
             * 
             * @param {*} oEvent 
             */
            onChangeWeekDate: function (oEvent) {
                that.SEL_DATE = oEvent.getParameter('selectedItem').getKey();
                var aColumns = [];
                var scolumnName = '';
                var sColLabel = '';
                var iCIRQty = 0;
                var aCIRData = oGModel.getProperty("/CIRQtys");
                var aFilCIRData = [];
                var sColumnLabel = '';
                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");
                aColumns = that.oUniqueCharTable.getColumns();

                for (var k = 1; k < aColumns.length; k++) {
                    scolumnName = aColumns[k].getName();

                    // iCounter = iCounter + 1;
                    // if (iCounter > 5) {
                    //     aColumns[k].setVisible(false);
                    // } else {
                    //     aColumns[k].setVisible(true)
                    // }

                    sColLabel = aColumns[k].getLabel().getText().split(' ');
                    iCIRQty = 0;

                    // Get Weekly Quantity
                    aFilCIRData = [];
                    aFilCIRData = aCIRData.filter(function (aCIRQty) {
                        return aCIRQty['Unique ID'] === (scolumnName).toString();
                    });
                    if (aFilCIRData.length > 0) {
                        iCIRQty = aFilCIRData[0][that.SEL_DATE];
                    } else {
                        iCIRQty = 0;
                    }

                    sColumnLabel = sColLabel[0] + " " + sColLabel[1] + " - (" + iCIRQty + ")";
                    aColumns[k].setLabel(sColumnLabel);

                }

            },

            /**
             * 
             * @param {*} oEvent 
             */
            _onRouteMatched: function (oEvent) {

                oGModel = that.getOwnerComponent().getModel("oGModel");
                that.LocationId = oGModel.getProperty("/SelectedLoc");
                that.ProductId = oGModel.getProperty("/SelectedProd");
                that.UniqueId = oGModel.getProperty("/SelectedUniqueId");
                that.aFilteredChars = oGModel.getProperty("/aFilteredChar");
                that.aAllUniqueChars = oGModel.getProperty("/AllUniqueChars");

                that.getView().byId("idlocU").setValue(that.LocationId);
                that.getView().byId("idprodListU").setValue(that.ProductId);
                that.getView().byId("idUniqueId").setValue(that.UniqueId);


                that.getView().byId("idUniqueCharDetailsEQ").removeAllSelectedItems();
                that.getView().byId("idUniqueCharDetailsNEQ").removeAllSelectedItems();

                that.allCharsModel.setData({
                    charDetails: that.aAllUniqueChars,
                });

                that.locProdCharModel.setData({
                    charDetails: that.aFilteredChars,
                });


                that.getView().byId("idUniqueCharDetailsEQ").setModel(that.locProdCharModel);
                that.getView().byId("idUniqueCharDetailsNEQ").setModel(that.locProdCharModel);

                that.setWeekDates();

                that.onUniqueIdLinkPress();

            }


        });
    }
);