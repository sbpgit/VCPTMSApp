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

                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");

                oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteUniqChar").attachMatched(this._onRouteMatched, this);
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

                var aUniqueIdsChars = aUniqueChars;
                var oColumn = {},
                    oRowData = {},
                    aColumns = [],
                    aRowData = [];
                var aConfig = [];
                var aFilteredUniqueChars = [];
                var iCounter = 0, iTotal = 0;
                var columnName;
                var bVisible = true;
                var sColumnName,
                    sCharValPath,
                    sCharValDescPath;


                that.oUniqueCharTable = that.getView().byId("idUniqueIdChars");

                if (aUniqueIdsChars.length > 0) {
                    // Looping through the data to generate columns
                    for (var i = 0; i < aUniqueIdsChars.length; i++) {
                        oColumn = {};

                        if (i === 0) {
                            aConfig = aUniqueIdsChars[i].CONFIG;
                            oColumn.UNIQUE_CHAR = 'Characteristic';
                            oColumn.TOTAL = aUniqueIdsChars[i].TOTAL;
                            aColumns.push(oColumn);
                            oColumn = {};
                        }

                        // Columns (UNIQUE_IDs)
                        oColumn.UNIQUE_CHAR = aUniqueIdsChars[i].UNIQUE_ID;
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
                                if (aConfig[j].CHAR_NAME === aFilteredUniqueChars[l].CHAR_NAME &&
                                    aConfig[j].CHAR_DESC === aFilteredUniqueChars[l].CHAR_DESC &&
                                    aConfig[j].CHAR_NUM === aFilteredUniqueChars[l].CHAR_NUM
                                ) {
                                    oRowData[aColumns[k].UNIQUE_CHAR] = [{ CHAR_VALUE: aFilteredUniqueChars[l].CHAR_VALUE, CHARVAL_DESC: aFilteredUniqueChars[l].CHARVAL_DESC, CHAR_NUM: aFilteredUniqueChars[l].CHAR_NUM, CHARVAL_NUM: aFilteredUniqueChars[l].CHARVAL_NUM }];
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
                        sColumnName = columnName.toString() + " (" + iTotal + ")";

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
                            return new sap.ui.table.Column({
                                // width: "13rem",
                                label: sColumnName,
                                // filterProperty: columnName,
                                visible: bVisible,
                                template: new sap.m.ObjectIdentifier({
                                    title: "{" + sCharValDescPath + "}",
                                    text: "{" + sCharValPath + "}"
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
                        if(k < 7 ) {
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
                    for (var k = 2; k < aColumns.length; k++) {
                        scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                        aFilterUniqueIds = aUniqueIdFilter.filter(function (aUniqChar) {
                            return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                        });
                        if (aFilterUniqueIds.length > 0) {
                            iCounter = iCounter + 1;
                            if (iCounter >= 5) {
                                aColumns[k].setVisible(false);
                            } else {
                                aColumns[k].setVisible(true)
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
                    for (var k = 2; k < aColumns.length; k++) {
                        scolumnName = aColumns[k].getLabel().getText().split(' (')[0];
                        aFilterUniqueIds = aUniqueIdFilter.filter(function (aUniqChar) {
                            return aUniqChar.UNIQUE_ID === parseInt(scolumnName);
                        });
                        if (aFilterUniqueIds.length > 0) {
                            iCounter = iCounter + 1;
                            if (iCounter >= 5) {
                                aColumns[k].setVisible(false);
                            } else {
                                aColumns[k].setVisible(true)
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

                that.allCharsModel.setData({
                    charDetails: that.aAllUniqueChars,
                });

                that.locProdCharModel.setData({
                    charDetails: that.aFilteredChars,
                });


                that.getView().byId("idUniqueCharDetailsU").setModel(that.locProdCharModel);

                that.onUniqueIdLinkPress();


            }




        });
    }
);