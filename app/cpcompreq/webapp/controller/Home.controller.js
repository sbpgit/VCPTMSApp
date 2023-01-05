sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "cpapp/cpcompreq/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/Device"
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
        Device
    ) {
        "use strict";
        var oGModel, that;
        return BaseController.extend("cpapp.cpcompreq.controller.Home", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                // set device model
                var oDeviceModel = new JSONModel(Device);
                oDeviceModel.setDefaultBindingMode("OneWay");
                this.setModel(oDeviceModel, "device");
                this.rowData;
                this.plntMethod;
                // Declaring JSON Models and size limits
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.verModel = new JSONModel();
                that.scenModel = new JSONModel();
                that.compModel = new JSONModel();
                that.struModel = new JSONModel();
                that.charModel = new JSONModel();
                that.graphModel = new JSONModel();
                that.graphtModel = new JSONModel();
                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                that.verModel.setSizeLimit(1000);
                that.scenModel.setSizeLimit(1000);
                that.compModel.setSizeLimit(1000);
                that.struModel.setSizeLimit(1000);

                // Declaring Dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogDLoc) {
                    this._valueHelpDialogDLoc = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.DemandLocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogDLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogVer) {
                    this._valueHelpDialogVer = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.VersionDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogVer);
                }
                if (!this._valueHelpDialogScen) {
                    this._valueHelpDialogScen = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.ScenarioDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogScen);
                }
                if (!this._valueHelpDialogComp) {
                    this._valueHelpDialogComp = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.ComponentDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogComp);
                }
                if (!this._valueHelpDialogStru) {
                    this._valueHelpDialogStru = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.StructureNodeDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogStru);
                }
                if (!this._odGraphDialog) {
                    this._odGraphDialog = sap.ui.xmlfragment(
                        "cpapp.cpcompreq.view.CompODBreakdown",
                        this
                    );
                    this.getView().addDependent(this._odGraphDialog);
                }
            },

            /**
             * Called after the view has been rendered.
             */
            onAfterRendering: function () {
                // sap.ui.core.BusyIndicator.show();
                this.oResourceBundle = this.getView()
                    .getModel("i18n")
                    .getResourceBundle();
                that.colComp = "";
                that.colDate = "";
                that.oList = this.byId("idTab");
                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("idprod");
                this.oVer = this.byId("idver");
                this.oScen = this.byId("idscen");
                this.oComp = this.byId("idcomp");
                this.oStru = this.byId("idstru");
                this.oPanel = this.byId("idPanel");
                // Setting title allignment for dialogs
                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");
                that._valueHelpDialogComp.setTitleAlignment("Center");
                that._valueHelpDialogStru.setTitleAlignment("Center");

                var dDate = new Date();
                var oDateL = that.getDateFn(dDate);
                // var oDateL = dDate.toLocaleDateString().split("/");
                //     oDateL = oDateL[2] + "-" + oDateL[0] + "-" + oDateL[1];

                //Future 90 days selected date
                var oDateH = new Date(
                    dDate.getFullYear(),
                    dDate.getMonth(),
                    dDate.getDate() + 90
                );
                var oDateH = that.getDateFn(oDateH);

                that.byId("fromDate").setValue(oDateL);
                that.byId("toDate").setValue(oDateH);

                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
                this.oDLocList = this._oCore.byId(
                    this._valueHelpDialogDLoc.getId() + "-list"
                );
                this.oVerList = this._oCore.byId(
                    this._valueHelpDialogVer.getId() + "-list"
                );
                this.oScenList = this._oCore.byId(
                    this._valueHelpDialogScen.getId() + "-list"
                );
                this.oCompList = this._oCore.byId(
                    this._valueHelpDialogComp.getId() + "-list"
                );
                this.oStruList = this._oCore.byId(
                    this._valueHelpDialogStru.getId() + "-list"
                );
                this.oGridList = this._oCore.byId(
                    sap.ui.getCore().byId("charOdDialog").getContent()[0].getId()
                );
                this.oGraphchart = this._oCore.byId(
                    sap.ui.getCore().byId("idPanel").getContent()[0].getId()
                );
                sap.ui.core.BusyIndicator.show();
                // Location data
                // this.getModel("BModel").read("/getLocation", {
                    this.getModel("BModel").read("/getfactorylocdesc", {
                        success: function (oData) {
                            // that.locModel.setData(oData);
                            // that.oLocList.setModel(that.locModel);
                            // sap.ui.core.BusyIndicator.hide();
                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            oData.results = removeDuplicate(oData.results, 'FACTORY_LOC');

                            that.LocData = oData.results;
                            that.locModel.setData({
                                Locitems: that.LocData
                            });
                            that.oLocList.setModel(that.locModel);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                });
                sap.ui.core.BusyIndicator.show();

                // Planned Parameter Values

                // this.getModel("BModel").read("/V_Parameters", {
                //     success: function (oData) {
                //         // if Frozen Horizon is 14 Days, we need to consider from 15th day
                //         var iFrozenHorizon = parseInt(oData.results[0].VALUE) + 1;
                //         var dDate = new Date();
                //         // var oDateL = that.getDateFn(dDate);
                //         // oDateL = that.addDays(oDateL, iFrozenHorizon);
                //         dDate = new Date(dDate.setDate(dDate.getDate() + iFrozenHorizon));
                //         var oDateL = that.getDateFn(dDate);
                //         var oDateH = new Date(
                //             dDate.getFullYear(),
                //             dDate.getMonth(),
                //             dDate.getDate() + 90
                //         );
                //         var oDateH = that.getDateFn(oDateH);
                //         that.byId("fromDate").setValue(oDateL);
                //         that.byId("toDate").setValue(oDateH);
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                //     error: function (oData, error) {
                //         MessageToast.show("error");
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                // });
            },

            /**
             * This function is called when a click on reset button.
             * This will clear all the selections of inputs.
             */
            onResetDate: function () {
                that.byId("fromDate").setValue("");
                that.byId("toDate").setValue("");
                // oGModel.setProperty("/resetFlag", "X");
                that.oLoc.setValue("");
                that.oProd.setValue("");
                that.oVer.setValue("");
                that.oScen.setValue("");
                that.oComp.setValue("");
                that.oStru.setValue("");
                that.onAfterRendering();
            },

            /**
             * This function is called when a click on GO button to get the data based of filters.
             * @param {object} oEvent -the event information.
             */
            onGetData: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                that.oTable = that.byId("idCompReq");
                that.oGModel = that.getModel("oGModel");

                // getting the input values
                var oLoc = that.oGModel.getProperty("/SelectedLoc"),
                    oProd = that.oGModel.getProperty("/SelectedProd"),
                    oVer = that.oGModel.getProperty("/SelectedVer"),
                    oScen = that.oGModel.getProperty("/SelectedScen"),
                    oComp = that.oGModel.getProperty("/SelectedComp"),
                    oStru = that.oGModel.getProperty("/SelectedStru"),
                    oModelVersion = that.byId("idModelVer").getSelectedKey(),
                    bCriticalKey = "";

                if (that.byId("idChkCritComp").getSelected() === true) {
                    bCriticalKey = "X";
                } else {
                    bCriticalKey = "";
                }

                that.oGModel.setProperty(
                    "/SelectedMV",
                    that.byId("idModelVer").getSelectedKey()
                );
                var vFromDate = this.byId("fromDate").getDateValue();
                var vToDate = this.byId("toDate").getDateValue();


                // checking if the inpus are not undefined
                if (
                    oLoc !== undefined &&
                    oProd !== undefined &&
                    oVer !== undefined &&
                    oScen !== undefined &&
                    oModelVersion !== undefined &&
                    vFromDate !== undefined &&
                    vFromDate !== " " &&
                    vToDate !== undefined &&
                    vToDate !== " "
                ) {
                    // Calling function to convert date string
                    vFromDate = that.getDateFn(vFromDate);
                    vToDate = that.getDateFn(vToDate);
                    if (oComp === undefined) {
                        oComp = "";
                    }
                    if (oStru === undefined) {
                        oStru = "";
                    }

                    // calling service based on filters
                    that.getModel("BModel").callFunction("/getCompReqFWeekly", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: oLoc,
                            PRODUCT_ID: oProd,
                            VERSION: oVer,
                            SCENARIO: oScen,
                            COMPONENT: oComp,
                            STRUCNODE: oStru,
                            FROMDATE: vFromDate,
                            TODATE: vToDate,
                            MODEL_VERSION: oModelVersion,
                            CRITICALKEY: bCriticalKey,
                        },
                        success: function (data) {
                            sap.ui.core.BusyIndicator.hide();
                            that.rowData = data.results;

                            that.oGModel.setProperty("/TData", data.results);
                            // Calling function to generate UI table dynamically based on data
                            that.TableGenerate();
                            var selected = that.byId("idCheck1").getSelected();

                            // Calling function to filter data if checkbox is selected
                            if (selected) {
                                that.onNonZero();
                            }
                        },
                        error: function (data) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error While fetching data");
                        },
                    });
                } else {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show(
                        "Please select a Location/Product/Version/Scenario/Date Range"
                    );
                }
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            onSearchCompReq: function (oEvent) {
                that.oTable = that.byId("idCompReq");
                that.oGModel = that.getModel("oGModel");

                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue");
                // Checking if serch value is empty
                if (sQuery === "") {
                    that.onNonZero();
                } else {
                    that.oGModel = that.getModel("oGModel");
                    that.Data = that.oGModel.getProperty("/TData");
                    // that.Data = that.rowData;
                    that.searchData = [];

                    for (var i = 0; i < that.Data.length; i++) {
                        if (
                            // that.Data[i].COMPONENT.includes(sQuery) ||
                            that.Data[i].COMPONENT.includes(sQuery) ||
                            that.Data[i].STRUC_NODE.includes(sQuery) ||
                            that.Data[i].QTYTYPE.includes(sQuery)
                        ) {
                            that.searchData.push(that.Data[i]);
                        }
                    }

                    that.oGModel.setProperty("/TData", that.searchData);
                    // Calling function to generate UI table dynamically based on search data
                    that.TableGenerate();
                }
            },

            /**
             * This function is called to generate UI table dynamically based on data.
             * @param {object} oEvent -the event information.
             */

            TableGenerate: function () {
                var sRowData = {},
                    iRowData = [],
                    weekIndex;

                that.oGModel = that.getModel("oGModel");
                that.tableData = that.oGModel.getProperty("/TData");

                var rowData;
                var fromDate = new Date(that.byId("fromDate").getDateValue()),
                    toDate = new Date(that.byId("toDate").getDateValue());

                fromDate = that.onConvertDateToString(fromDate);
                toDate = that.onConvertDateToString(toDate);

                // fromDate = fromDate.toISOString().split("T")[0];
                // toDate = toDate.toISOString().split("T")[0];
                // Calling function to generate column names based on dates
                var liDates = that.generateDateseries(fromDate, toDate);
                that.oGModel.setProperty("/TDates", liDates);

                // Looping through the data to generate columns
                for (var i = 0; i < that.tableData.length; i++) {
                    sRowData.DemandLocation = that.tableData[i].LOCATION_ID;
                    sRowData.ItemNum = that.tableData[i].ITEM_NUM;
                    sRowData.Assembly = that.tableData[i].COMPONENT;
                    sRowData.StructureNode = that.tableData[i].STRUC_NODE;
                    sRowData.Type = that.tableData[i].QTYTYPE;
                    weekIndex = 1;
                    for (let index = 4; index < liDates.length; index++) {
                        sRowData[liDates[index].CAL_DATE] =
                            that.tableData[i]["WEEK" + weekIndex];
                        weekIndex++;
                    }
                    iRowData.push(sRowData);
                    sRowData = {};
                }
                // Adding rows and columns data to JSON Model
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    rows: iRowData,
                    columns: liDates,
                });
                that.oTable.setModel(oModel);
                that.oTable.bindColumns("/columns", function (sId, oContext) {
                    var columnName = oContext.getObject().CAL_DATE;
                    // Checking column names and applying sap.m.Link to column values
                    if (
                        columnName === "DemandLocation" ||
                        columnName === "Assembly" ||
                        columnName === "ItemNum" ||
                        columnName === "StructureNode"
                    ) {
                        return new sap.ui.table.Column({
                            width: "8rem",
                            label: columnName,
                            template: columnName,
                        });
                    } else {
                        var iTotalQty = that.getTotalWeekQty(columnName);
                        var columnText = columnName + " (" + iTotalQty + ")";
                        if (that.plntMethod === 'M1') {
                            return new sap.ui.table.Column({
                                width: "8rem",
                                label: columnText,
                                template: new sap.m.Link({
                                    text: "{" + columnName + "}",
                                    press: that.linkPressed,
                                }),
                            });
                        }
                        else {
                            return new sap.ui.table.Column({
                                width: "8rem",
                                label: columnText,
                                template: new sap.m.Text({
                                    text: "{" + columnName + "}"
                                }),
                            });
                        }
                    }
                    // }
                });

                that.oTable.bindRows("/rows");
            },

            /**
             * This function is called when checkbox Get Non-Zero is checked or unchecked.
             * In this function removing the rows which have all row values as "0".
             * @param {object} oEvent -the event information.
             */
            onNonZero: function (oEvent) {
                that.oTable = that.byId("idCompReq");
                that.oGModel = that.getModel("oGModel");
                var selected = that.byId("idCheck1").getSelected(),
                    name,
                    counter;
                that.searchData = that.rowData;
                that.FinalData = [];
                that.FinalfilterData=[];

                var columns = that.oTable.getColumns().length - 4,
                    data = that.tableData;
                if (selected) {
                    // Filtering data which has row values, removing the rows which has all values as "0" or "null"
                    for (var i = 0; i < that.searchData.length; i++) {
                        counter = 0;
                        for (var j = 1; j < columns; j++) {
                            if (
                                that.searchData[i]["WEEK" + j] !== 0 &&
                                that.searchData[i]["WEEK" + j] !== null
                            ) {
                                counter = counter + 1;
                                break;
                            }
                        }
                        if (counter !== 0) {
                            that.FinalData.push(that.searchData[i]);
                        }
                    }
                } else {
                    that.FinalData = that.searchData;
                }

                var selectedDLoc = that.byId("idDemdloc").getTokens(),
                // var selected = sap.ui.getCore().byId("LocDSlctList").getSelectedItems(),
                    FactoryLoc = that.byId("idloc").getValue();
                that.searchData = that.FinalData;
                if(selectedDLoc.length){
                for (var i = 0; i < that.searchData.length; i++) {
                    for (var j = 0; j < selectedDLoc.length; j++) {
                        if (that.searchData[i].LOCATION_ID === selectedDLoc[j].getText() &&
                            that.searchData[i].FACTORY_LOC === FactoryLoc) {
                            counter = counter + 1;
                            break;
                        }
                    }
                    if (counter !== 0) {
                        that.FinalfilterData.push(that.searchData[i]);
                    }
                }
            } else {
                that.FinalfilterData = [];
                sap.m.MessageToast.show("There is no demand location selected");
            }

                that.oGModel.setProperty("/TData", that.FinalfilterData);
                // Calling function to generate UI table based on filter data
                that.TableGenerate();
            },


             /**
             * This function is called when Demand location is checked or unchecked.
             * @param {object} oEvent -the event information.
             */
              onFilterDemandLoc: function (oEvent) {
                that.oTable = that.byId("idCompReq");
                that.oGModel = that.getModel("oGModel");
                // var selected = sap.ui.getCore().byId("LocDSlctList").getSelectedItems(),
                var selected = that.odLoc.getTokens(),
                    name,
                    counter;
                    // that.byId("idCheck1").setSelected(true);
                    var checked = that.byId("idCheck1").getSelected();
                that.searchData = that.rowData;
                that.FinalData = [];

                var FactoryLoc = that.byId("idloc").getValue(),

                // var columns = that.oTable.getColumns().length - 3,
                    data = that.tableData;
                  if (selected.length) {
                      // Filtering data which has row values, removing the rows which has all values as "0" or "null"
                      for (var i = 0; i < that.searchData.length; i++) {
                          counter = 0;
                          for (var j = 0; j < selected.length; j++) {
                            if(checked){
                                if (that.searchData[i].LOCATION_ID === selected[j].getText() &&
                                  that.searchData[i].FACTORY_LOC === FactoryLoc &&
                                  that.searchData[i]["WEEK" + (j + 1)] !== 0 &&
                                  that.searchData[i]["WEEK" + (j + 1)] !== null
                              ) {
                                  counter = counter + 1;
                                  break;
                              }
                            } else {
                                if (that.searchData[i].LOCATION_ID === selected[j].getText() &&
                                  that.searchData[i].FACTORY_LOC === FactoryLoc 
                              ) {
                                  counter = counter + 1;
                                  break;
                              }
                            }
                              
                          }
                          if (counter !== 0) {
                              that.FinalData.push(that.searchData[i]);
                          }
                      }
                } else {
                    // that.FinalData = that.searchData;
                    that.FinalData =  [];
                    sap.m.MessageToast.show("There is no demand location selected");
                }
                that.oGModel.setProperty("/TData", that.FinalData);
                // Calling function to generate UI table based on filter data
                that.TableGenerate();
            },

            /**
             * 
             */
             getTotalWeekQty: function (sWeekDate) {
                that.oGModel = that.getModel("oGModel");
                var oTableData = that.oGModel.getProperty("/TData");
                var liDates = that.oGModel.getProperty("/TDates");
                var iWeekIndex = 0;
                var iTotalQty = 0;
                for (let index = 3; index < liDates.length; index++) {
                    iWeekIndex = iWeekIndex + 1;
                    if (liDates[index].CAL_DATE === sWeekDate) {
                        break;
                    }
                }

                // Looping through the data to generate columns SUM
                
                for (var i = 0; i < that.tableData.length; i++) {
                    iTotalQty = iTotalQty + parseInt(that.tableData[i]["WEEK" + iWeekIndex]);                    
                }

                return iTotalQty;
            },

            /**
             * This function is called when a click on any row item.
             * In this function we will fetch the data which need to display chart
             * @param {object} oEvent -the event information.
             */
            linkPressed: function (oEvent) {
                var selColumnId = oEvent.getSource().getAriaLabelledBy()[0];
                if (
                    selColumnId === "__column0" ||
                    selColumnId === "__column1" ||
                    selColumnId === "__column2" ||
                    selColumnId === "__column3"
                ) {
                    sap.m.MessageToast.show("Please click on any quantity");
                } else {
                    that.charModel.setData([]);
                    that.oGridList.setModel(that.charModel);
                    that.graphModel.setData([]);
                    that.oGraphchart.setModel(that.graphModel);
                    // Getting selected row details
                    var tableColumns = that.byId("idCompReq").getColumns(),
                        selColumnDate,
                        selColumnValue = oEvent.getSource().getText(),
                        ObindingData = oEvent.getSource().getBindingContext().getObject(),
                        selComponent = ObindingData.Assembly, //Component,
                        selItem = ObindingData.ItemNum,
                        selStruNode = ObindingData.StructureNode,
                        selType = ObindingData.Type;
                    that.colComp = selComponent;
                    for (var i = 0; i < tableColumns.length; i++) {
                        if (selColumnId === tableColumns[i].sId) {
                            selColumnDate = that
                                .byId("idCompReq")
                                .getColumns()
                            [i].getLabel()
                                .getText();
                        }
                    }

                    
                    selColumnDate = selColumnDate.split(" ")[0];
                    that.colDate = selColumnDate;
                    if (selColumnValue > 0) {
                        this.getModel("BModel").read("/getBOMPred", {
                            filters: [
                                new Filter(
                                    "LOCATION_ID",
                                    FilterOperator.EQ,
                                    that.oGModel.getProperty("/SelectedLoc")
                                ),
                                new Filter(
                                    "PRODUCT_ID",
                                    FilterOperator.EQ,
                                    that.oGModel.getProperty("/SelectedProd")
                                ),
                                new Filter(
                                    "VERSION",
                                    FilterOperator.EQ,
                                    that.oGModel.getProperty("/SelectedVer")
                                ),
                                new Filter(
                                    "SCENARIO",
                                    FilterOperator.EQ,
                                    that.oGModel.getProperty("/SelectedScen")
                                ),
                                new Filter("COMPONENT", FilterOperator.EQ, selComponent),
                                new Filter("CAL_DATE", FilterOperator.EQ, selColumnDate),
                                new Filter(
                                    "MODEL_VERSION",
                                    FilterOperator.EQ,
                                    that.oGModel.getProperty("/SelectedMV")
                                ),
                            ],
                            success: function (oData) {
                                that.charModel.setData(oData);
                                that.oGridList.setModel(that.charModel);
                                that._odGraphDialog.open();
                            },
                            error: function (oData, error) {
                                MessageToast.show("error");
                            },
                        });
                    }
                }
            },

            /**
             * This function is called when click on Expand Panel.
             * In this function we will get the data based of panel which opens and creating charts
             * @param {object} oEvent -the event information.
             */
            onExpand: function (oEvent) {
                var oHdr = oEvent.getSource().getHeaderText();
                var objDep = oHdr.split(":")[0];
                objDep =objDep.split("_");
                let objDepVal = objDep[0].concat("_",objDep[1]);
                let objCntr = objDep[2];
                that.getModel("BModel").read("/getOdCharImpact", {
                    filters: [
                        new Filter(
                            "LOCATION_ID",
                            FilterOperator.EQ,
                            that.oGModel.getProperty("/SelectedLoc")
                        ),
                        new Filter(
                            "PRODUCT_ID",
                            FilterOperator.EQ,
                            that.oGModel.getProperty("/SelectedProd")
                        ),
                        new Filter(
                            "VERSION",
                            FilterOperator.EQ,
                            that.oGModel.getProperty("/SelectedVer")
                        ),
                        new Filter(
                            "SCENARIO",
                            FilterOperator.EQ,
                            that.oGModel.getProperty("/SelectedScen")
                        ),
                        new Filter("CAL_DATE", FilterOperator.EQ, that.colDate),
                        new Filter("OBJ_DEP", FilterOperator.EQ, objDepVal),//objDep[0].split("_")[0]),
                        new Filter(
                            "OBJ_COUNTER",
                            FilterOperator.EQ,
                            objCntr
                           // objDep[0].split("_")[1]
                        ),
                        new Filter(
                            "MODEL_VERSION",
                            FilterOperator.EQ,
                            that.oGModel.getProperty("/SelectedMV")
                        ),
                    ],
                    success: function (oData) {
                        that.graphModel.setData(oData);
                        that.oGraphchart.setModel(that.graphModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             */
            handleDialogClose() {
                that._odGraphDialog.close();
            },

            /**
             * This function is called when generating Date series for column names.
             * Column names will generate based on From and To dates
             * @param {object} imFromDate -From Date, imToDate - To Date.
             */
            generateDateseries: function (imFromDate, imToDate) {
                var lsDates = {},
                    liDates = [];
                var vDateSeries = imFromDate;
                //Demand loc
                lsDates.CAL_DATE = "DemandLocation"; 
                liDates.push(lsDates);
                lsDates = {};
                lsDates.CAL_DATE = "Assembly"; //Component";
                liDates.push(lsDates);
                lsDates = {};
                lsDates.CAL_DATE = "ItemNum";
                liDates.push(lsDates);
                lsDates = {};
                lsDates.CAL_DATE = "StructureNode";
                liDates.push(lsDates);
                lsDates = {};
                // Calling function to get the next Sunday date of From date
                lsDates.CAL_DATE = that.getNextMonday(vDateSeries);
                vDateSeries = lsDates.CAL_DATE;
                liDates.push(lsDates);
                lsDates = {};
                while (vDateSeries <= imToDate) {
                    // Calling function to add Days
                    vDateSeries = that.addDays(vDateSeries, 7);
                    if (vDateSeries > imToDate) {
                        break;
                    }
                    
                    lsDates.CAL_DATE = vDateSeries;//that.getNextMonday(vDateSeries);
                    //vDateSeries = lsDates.CAL_DATE;
                    liDates.push(lsDates);
                    lsDates = {};
                }
                // remove duplicates
                var lireturn = liDates.filter((obj, pos, arr) => {
                    return (
                        arr.map((mapObj) => mapObj.CAL_DATE).indexOf(obj.CAL_DATE) == pos
                    );
                });
                return lireturn;
            },

            /**
             * This function is called to get the next sunday date.
             * @param {object} imDate - From Date.
             */
            getNextMonday: function (imDate) {
                var vDate, vMonth, vYear;
                const lDate = new Date(imDate);
                var timeOffsetInMS = lDate.getTimezoneOffset() * 60000;
                lDate.setTime(lDate.getTime() + timeOffsetInMS);
                let lDay = lDate.getDay();
                // if (lDay !== 0) lDay = 7 - lDay;
                // lDay = lDay + 1;
                if (lDay === 1) {
                    lDay = 0;
                } else {
                    if (lDay !== 0) lDay = 7 - lDay;
                    lDay = lDay + 1;
                }
                const lNextSun = new Date(
                    lDate.getFullYear(),
                    lDate.getMonth(),
                    lDate.getDate() + lDay
                );
                vDate = lNextSun.getDate();
                vMonth = lNextSun.getMonth() + 1;
                vYear = lNextSun.getFullYear();
                if (vDate < 10) {
                    vDate = "0" + vDate;
                }
                if (vMonth < 10) {
                    vMonth = "0" + vMonth;
                }
                return vYear + "-" + vMonth + "-" + vDate;

                // return lNextSun.toISOString().split('T')[0];
            },

            // Adding days to generate sequence of dates
            addDays: function (imDate, imDays) {
                var vDate, vMonth, vYear;
                const lDate = new Date(imDate);
                var timeOffsetInMS = lDate.getTimezoneOffset() * 60000;
                lDate.setTime(lDate.getTime() + timeOffsetInMS);
                const lNextWeekDay = new Date(
                    lDate.getFullYear(),
                    lDate.getMonth(),
                    lDate.getDate() + imDays
                );
                vDate = lNextWeekDay.getDate();
                vMonth = lNextWeekDay.getMonth() + 1;
                vYear = lNextWeekDay.getFullYear();
                if (vDate < 10) {
                    vDate = "0" + vDate;
                }
                if (vMonth < 10) {
                    vMonth = "0" + vMonth;
                }
                return vYear + "-" + vMonth + "-" + vDate;
            },

            /**
             * This function is called to find the next week date of From Date .
             */
            removeDays: function (imDate, imDays) {
                const lDate = new Date(imDate);
                const lNextWeekDay = new Date(
                    lDate.getFullYear(),
                    lDate.getMonth(),
                    lDate.getDate() - imDays
                );

                return lNextWeekDay.toISOString().split("T")[0];
            },

            /**
             * This function is called when click on Value Help of Inputs.
             * In this function dialogs will open based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Location Dialog
                if (sId.includes("idloc")) {
                    // var Loc = that.LocData;
                    // that.locMod =  new JSONModel();
                    //     that.locMod.setData({
					// 		Locitems: that.LocData
					// 	});
                    //     that.oLocList.setModel(that.locMod);
                    that._valueHelpDialogLoc.open();
                   // Demand Location Dialog
                } else if(sId.includes("idDemdloc")){
                    
                    // var DemandLoc = that.LocData;
                    // that.Loc=[];
                    // var FLoc = that.byId("idloc").getValue();
                    // for(var i=0; i<DemandLoc.length; i++){
                    //     if(FLoc === DemandLoc[i].Demand_Loc){
                    //         that.Loc.push(DemandLoc[i]);
                    //     }
                    // }
                    //     that.DlocMod =  new JSONModel();
                    //     that.DlocMod.setData({
					// 		DLocitems: that.Loc

					// 	});
                    //     that.oDLocList.setModel(that.DlocMod);

                    that._valueHelpDialogDLoc.open();
                // Product Dialog
                } else if (sId.includes("prod")) {
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                    // Version  Dialog
                } else if (sId.includes("ver")) {
                    if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
                        that._valueHelpDialogVer.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
                        that._valueHelpDialogScen.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    // Component Dialog
                } else if (sId.includes("idcomp")) {
                    if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
                        that._valueHelpDialogComp.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    // Structure Dialog
                } else if (sId.includes("stru")) {
                    if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
                        that._valueHelpDialogStru.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             */
            handleClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Location Dialog
                if (sId.includes("LocSlctList")) {
                    that._oCore
                        .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                        .setValue("");
                    if (that.oLocList.getBinding("items")) {
                        that.oLocList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("LocDSlctList")) {
                    that._oCore
                        .byId(this._valueHelpDialogDLoc.getId() + "-searchField")
                        .setValue("");
                    if (that.oDLocList.getBinding("items")) {
                        that.oDLocList.getBinding("items").filter([]);
                    }
                    // Product Dialog
                } else if (sId.includes("prod")) {
                    that._oCore
                        .byId(this._valueHelpDialogProd.getId() + "-searchField")
                        .setValue("");
                    if (that.oProdList.getBinding("items")) {
                        that.oProdList.getBinding("items").filter([]);
                    }
                    // Version Dialog
                } else if (sId.includes("Ver")) {
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
                    // Component Dialog
                } else if (sId.includes("Comp")) {
                    that._oCore
                        .byId(this._valueHelpDialogComp.getId() + "-searchField")
                        .setValue("");
                    if (that.oCompList.getBinding("items")) {
                        that.oCompList.getBinding("items").filter([]);
                    }
                    // Structure Dialog
                } else if (sId.includes("Stru")) {
                    that._oCore
                        .byId(this._valueHelpDialogStru.getId() + "-searchField")
                        .setValue("");
                    if (that.oStruList.getBinding("items")) {
                        that.oStruList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("__button4")) {
                    that._odGraphDialog.close();
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
                if (sId.includes("LocSlctList")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("FACTORY_LOC", FilterOperator.Contains, sQuery),
                                    new Filter("LOCATION_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oLocList.getBinding("items").filter(oFilters);
                } else if (sId.includes("LocDSlctList")) {
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
                    that.oDLocList.getBinding("items").filter(oFilters);
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
                    // Version
                } else if (sId.includes("ver")) {
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
                    // Component
                } else if (sId.includes("Comp")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("COMPONENT", FilterOperator.Contains, sQuery),
                                    new Filter("ITEM_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCompList.getBinding("items").filter(oFilters);
                    // Structure Node
                } else if (sId.includes("Stru")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("STRUC_NODE", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oStruList.getBinding("items").filter(oFilters);
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
                //Location list
                if (sId.includes("LocSlctList")) {
                    that.oLoc = that.byId("idloc");
                    that.oProd = that.byId("idprod");
                    // that.odLoc = that.byId("idDemdloc");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedLoc",
                        aSelectedItems[0].getTitle()
                    );
                    // Removing the input box values when Location changed
                    that.byId("idDemdloc").setValue("");
                    that.oProd.setValue("");
                    that.oVer.setValue("");
                    that.oScen.setValue("");
                    that.oComp.setValue("");
                    that.oStru.setValue("");
                    that.oGModel.setProperty("/SelectedProd", "");

                    // Calling service to get the Product data
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
                    that.getModel("BModel").read("/getPlancfgPara", {
                        filters: [
                            new Filter("LOCATION_ID", FilterOperator.EQ, aSelectedItems[0].getTitle()),
                            new Filter("PARAMETER_ID", FilterOperator.EQ, "5"),
                        ],
                        success: function (oData) {
                            if (oData.results) {
                                that.plntMethod = oData.results[0].VALUE
                            }
                        },
                        error: function (oData, error) {
                            MessageToast.show("Please maintain Planning Configuration for the selected plant");
                        },
                    });


                    that.byId("idDemdloc").removeAllTokens();
                    var DemandLoc = that.LocData;
                    that.Loc = [];
                    var FLoc = that.byId("idloc").getValue();
                    for (var i = 0; i < DemandLoc.length; i++) {
                        if (FLoc === DemandLoc[i].Demand_Loc) {
                            that.Loc.push(DemandLoc[i]);
                        }
                    }
                    that.DlocMod = new JSONModel();
                    that.DlocMod.setData({
                        DLocitems: that.Loc

                    });
                    that.oDLocList.setModel(that.DlocMod);

                    that.byId("idDemdloc").removeAllTokens();
                    that._valueHelpDialogDLoc.getAggregation("_dialog").getContent()[1].selectAll();

                 
                    var  aSelectedItems = that.Loc;
                    aSelectedItems.forEach(function (oItem) {
                        that.byId("idDemdloc").addToken(
                            new sap.m.Token({
                                key: oItem.LOCATION_ID,
                                text: oItem.LOCATION_ID,
                            })
                        );
                    });

                } else if (sId.includes("LocDSlctList")) {
                    that.odLoc = that.byId("idDemdloc");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    // that.odLoc.setValue(aSelectedItems[0].getTitle());

                    that.odLoc.removeAllTokens();
                    aSelectedItems.forEach(function (oItem) {
                        that.odLoc.addToken(
                            new sap.m.Token({
                                key: oItem.getTitle(),
                                text: oItem.getTitle(),
                            })
                        );
                    });

                    that.onFilterDemandLoc();
                    // Product list
                } else if (sId.includes("prod")) {
                    that.oProd = that.byId("idprod");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedProd",
                        aSelectedItems[0].getTitle()
                    );
                    // Removing the input box values when Product changed
                    that.oVer.setValue("");
                    that.oScen.setValue("");
                    that.oComp.setValue("");
                    that.oStru.setValue("");

                    // Calling service to get the IBP Varsion data
                    //   this.getModel("BModel").read("/getIbpVerScn", {
                    //     filters: [
                    //       new Filter(
                    //         "LOCATION_ID",
                    //         FilterOperator.EQ,
                    //         that.oGModel.getProperty("/SelectedLoc")
                    //       ),
                    //       new Filter(
                    //         "PRODUCT_ID",
                    //         FilterOperator.EQ,
                    //         aSelectedItems[0].getTitle()
                    //       ),
                    //     ],
                    this.getModel("BModel").callFunction("/getAllVerScen", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                        },
                        success: function (oData) {
                            var adata = [];
                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].PRODUCT_ID === that.oGModel.getProperty("/SelectedProd")) {
                                    adata.push({
                                        "VERSION": oData.results[i].VERSION
                                    });
                                }
                            }
                            if (adata.length > 0) {
                                that.verModel.setData({
                                    results: adata
                                });
                                that.oVerList.setModel(that.verModel);
                            }
                            // success: function (oData) {
                            //   that.verModel.setData(oData);
                            //   that.oVerList.setModel(that.verModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });

                    // Calling service to get the Component List data
                    this.getModel("BModel").read("/gBomHeaderet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "PRODUCT_ID",
                                FilterOperator.EQ,
                                aSelectedItems[0].getTitle()
                            ),
                        ],
                        success: function (oData) {
                            that.compModel.setData(oData);
                            that.oCompList.setModel(that.compModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });

                    // IBP Vaerion list
                } else if (sId.includes("Ver")) {
                    this.oVer = that.byId("idver");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oVer.setValue(aSelectedItems[0].getTitle());
                    // Removing the input box values when IBP Version changed
                    that.oScen.setValue("");
                    that.oGModel.setProperty(
                        "/SelectedVer",
                        aSelectedItems[0].getTitle()
                    );
                    // Calling service to get the Scenario data
                    //   this.getModel("BModel").read("/getIbpVerScn", {
                    //     filters: [
                    //       new Filter(
                    //         "LOCATION_ID",
                    //         FilterOperator.EQ,
                    //         that.oGModel.getProperty("/SelectedLoc")
                    //       ),
                    //       new Filter(
                    //         "PRODUCT_ID",
                    //         FilterOperator.EQ,
                    //         that.oGModel.getProperty("/SelectedProd")
                    //       ),
                    //       new Filter(
                    //         "VERSION",
                    //         FilterOperator.EQ,
                    //         aSelectedItems[0].getTitle()
                    //       ),
                    //     ],
                    //     success: function (oData) {
                    //       that.scenModel.setData(oData);
                    //       that.oScenList.setModel(that.scenModel);
                    this.getModel("BModel").callFunction("/getAllVerScen", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                        },
                        success: function (oData) {
                            var adata = [];
                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].PRODUCT_ID === that.byId("idprod").getValue()
                                    && oData.results[i].VERSION === that.oGModel.getProperty("/SelectedVer")) {
                                    adata.push({
                                        "SCENARIO": oData.results[i].SCENARIO
                                    });
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
                    // Scenario List
                } else if (sId.includes("scen")) {
                    this.oScen = that.byId("idscen");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oScen.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedScen",
                        aSelectedItems[0].getTitle()
                    );
                    // Component List
                } else if (sId.includes("Comp")) {
                    this.oComp = that.byId("idcomp");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oComp.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedComp",
                        aSelectedItems[0].getTitle()
                    );
                    that.oGModel.setProperty(
                        "/SelectedCompItem",
                        aSelectedItems[0].getDescription()
                    );

                    that.oStru.setValue("");

                    // Calling service to get the Structure Node data
                    this.getModel("BModel").read("/genCompStrcNode", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "PRODUCT_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedProd")
                            ),
                            new Filter(
                                "COMPONENT",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedComp")
                            ),
                            new Filter(
                                "ITEM_NUM",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedCompItem")
                            ),
                        ],
                        success: function (oData) {
                            that.struModel.setData(oData);
                            that.oStruList.setModel(that.struModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                    // Structure Node List
                } else if (sId.includes("Stru")) {
                    this.oStru = that.byId("idstru");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oStru.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedStru",
                        aSelectedItems[0].getTitle()
                    );
                }
                that.handleClose(oEvent);
            },

            /**
             * This function is called to convert the input dates to Date String.
             * @param {object} imDate - Contains Date
             */
            getDateFn: function (imDate) {
                var vMonth, vDate, exDate;
                var vMnthFrm = imDate.getMonth() + 1;

                if (vMnthFrm < 10) {
                    vMonth = "0" + vMnthFrm;
                } else {
                    vMonth = vMnthFrm;
                }

                if (imDate.getDate() < 10) {
                    vDate = "0" + imDate.getDate();
                } else {
                    vDate = imDate.getDate();
                }
                return (imDate = imDate.getFullYear() + "-" + vMonth + "-" + vDate);
            },
            /**
             * 
             */
            onCriticalComponentCheck: function (oEvent) {
                // var selected = that.byId("idCheck1").getSelected(),
            },
            /**
             * Converts Date to Local Date String with delimiter "-"
             * 
             */
            onConvertDateToString: function (dDate) {
                var dtConvertDate = dDate;
                var aDate = [];
                dtConvertDate = dtConvertDate.toLocaleDateString();
                aDate = dtConvertDate.split("/");
                if (aDate[0].length === 1) {
                    aDate[0] = "0" + aDate[0];
                }
                if (aDate[1].length === 1) {
                    aDate[1] = "0" + aDate[1];
                }
                dtConvertDate = aDate[2] + "-" + aDate[0] + "-" + aDate[1];
                return dtConvertDate;
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
            }
        });
    }
);
