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
        return BaseController.extend("cpapp.cpfullyconfproddmnd.controller.Home", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                this.rowData;
                that.oRouter;
                // Declaring JSON Models and size limits
                that.locModel = new JSONModel();
                that.dmndLocModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.verModel = new JSONModel();
                that.scenModel = new JSONModel();
                that.charModel = new JSONModel();
                that.allCharsModel = new JSONModel();
                that.locProdCharModel = new JSONModel();

                that.locModel.setSizeLimit(2000);
                that.dmndLocModel.setSizeLimit(2000);
                that.prodModel.setSizeLimit(2000);
                that.verModel.setSizeLimit(2000);
                that.scenModel.setSizeLimit(2000);
                that.charModel.setSizeLimit(2000);
                that.allCharsModel.setSizeLimit(2000);
                that.locProdCharModel.setSizeLimit(2000);

                that.sCFUserDestination = "";
                that.sUserId = "";

                // To Store changed CIR Quantities
                that.aCIRQty = [];

                // Declaring Dialogs
                this._oCore = sap.ui.getCore();

                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpfullyconfproddmnd.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }

                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpfullyconfproddmnd.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogVer) {
                    this._valueHelpDialogVer = sap.ui.xmlfragment(
                        "cpapp.cpfullyconfproddmnd.view.VersionDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogVer);
                }
                if (!this._valueHelpDialogScen) {
                    this._valueHelpDialogScen = sap.ui.xmlfragment(
                        "cpapp.cpfullyconfproddmnd.view.ScenarioDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogScen);
                }

                // Demand Location
                if (!this._valueHelpDialogDmndLoc) {
                    this._valueHelpDialogDmndLoc = sap.ui.xmlfragment(
                        "cpapp.cpfullyconfproddmnd.view.DemandLocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogDmndLoc);
                }

                // Get User Configured in Cloud Foundry Destination User
                that.getValidUser();
                that.getUserInfo();


            },

            /**
             * Called after the view has been rendered.
             */
            onAfterRendering: function () {
                // sap.ui.core.BusyIndicator.show();                
                this.oResourceBundle = this.getView()
                    .getModel("i18n")
                    .getResourceBundle();
                that.col = "";
                that.colDate = "";
                // To Store changed CIR Quantities
                that.aCIRQty = [];
                that.oList = this.byId("idTab");
                this.oLoc = this.byId("idloc");
                this.oDmndLoc = this.byId("idDmndLoc");
                this.oProd = this.byId("idprodList");
                this.oVer = this.byId("idver");
                this.oScen = this.byId("idscen");

                // Setting title allignment for dialogs
                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");
                that._valueHelpDialogDmndLoc.setTitleAlignment("Center");

                // Set FromDate and ToDate
                var dDate = new Date();
                // set minimum date
                that.byId("fromDate").setMinDate(dDate);
                that.byId("toDate").setMinDate(dDate);


                var oDateL = that.getDateFn(dDate);

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
                this.oVerList = this._oCore.byId(
                    this._valueHelpDialogVer.getId() + "-list"
                );
                this.oScenList = this._oCore.byId(
                    this._valueHelpDialogScen.getId() + "-list"
                );
                this.oDmndLocList = this._oCore.byId(
                    this._valueHelpDialogDmndLoc.getId() + "-list"
                );



                // Set Visible Row Count
                that.handleVisibleRowCount(0);
                // Diable Date Input
                // that.handleDateInputDisable();                

                sap.ui.core.BusyIndicator.show();

                // Get Factory Location, Partial Product, Demand LoCation , Planning Location
                that.getPartialProdLoc();

                //Location data
                // this.getModel("CIRModel").read("/getLocation", {
                //     success: function (oData) {
                //         that.locModel.setData(oData);

                //         that.oLocList.setModel(that.locModel);
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                //     error: function (oData, error) {
                //         MessageToast.show("error");
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                // });
            },
            /**
             * 
             */
            getPlannedParameters: function () {
                var sLocation = that.oGModel.getProperty("/SelectedLoc");
                // Planned Parameter Values
                sap.ui.core.BusyIndicator.show();
                that.getModel("CIRModel").read("/V_Parameters", {
                    filters: [
                        new Filter("LOCATION_ID", FilterOperator.EQ, sLocation)
                    ],
                    success: function (oData) {
                        var aParams = oData.results;
                        var oParam = {};
                        // if Frozen Horizon is 14 Days, we need to consider from 15th day
                        //var iFrozenHorizon = parseInt(oData.results[0].VALUE) + 1;
                        if (aParams.length > 0) {
                            var iFrozenHorizon = parseInt(oData.results[0].VALUE) * 7 + 1;
                            var dDate = new Date();
                            dDate = new Date(dDate.setDate(dDate.getDate() + iFrozenHorizon));
                            // that.dFrozenHorizonDate = dDate;
                            that.oGModel.setProperty("/dFrozenHorizonDate", dDate);
                            // var oDateL = that.getDateFn(dDate);
                            // var oDateH = new Date(
                            //     dDate.getFullYear(),
                            //     dDate.getMonth(),
                            //     dDate.getDate() + 90
                            // );

                            // var oDateH = that.getDateFn(oDateH);

                            // that.byId("fromDate").setValue(oDateL);
                            // that.byId("toDate").setValue(oDateH);

                            // 
                            oParam = aParams.find(obj => obj.PARAMETER_ID === 9)
                            var iFirmHorizon = parseInt(oParam.VALUE) * 7;
                            var dDateFHL = new Date();
                            dDateFHL = new Date(dDateFHL.setDate(dDateFHL.getDate() + iFirmHorizon));
                            //  that.dFirmHorizonDate = dDateFHL;
                            that.oGModel.setProperty("/dFirmHorizonDate", dDateFHL);

                            //that.oGModel("/dFrozenHorizonDate")
                        }

                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },

            /**
             * This function is called when a click on reset button.
             * This will clear all the selections of inputs.
             */
            onResetData: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                var iRowData = [],
                    iColumnData = [];

                that.oGModel = that.getModel("oGModel");
                that.byId("fromDate").setValue("");
                that.byId("toDate").setValue("");
                // oGModel.setProperty("/resetFlag", "X");
                that.oLoc.setValue("");
                that.oProd.setValue("");
                that.oVer.setValue("");
                that.oScen.setValue("");
                that.byId("idSearch").setValue("");
                that.oGModel.setProperty("/SelectedLoc", undefined);
                that.oGModel.setProperty("/SelectedProd", undefined);
                that.oGModel.setProperty("/SelectedVer", undefined);
                that.oGModel.setProperty("/SelectedScen", undefined);
                oModel.setData({
                    rows: iRowData,
                    columns: iColumnData,
                });
                that.oTable.setModel(oModel);

                that.onAfterRendering();
            },

            /**
             * This function is called when a click on GO button to get the data based of filters.
             * @param {object} oEvent -the event information.
             */
            onGetData: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                that.oTable = that.byId("idCIReq");
                that.oGModel = that.getModel("oGModel");
                // getting the input values
                var Loc = that.oGModel.getProperty("/SelectedLoc"),
                    PlanLoc = that.oGModel.getProperty("/SelectedDmndLoc"),
                    Prod = that.oGModel.getProperty("/SelectedProd"),
                    ver = that.oGModel.getProperty("/SelectedVer"),
                    scen = that.oGModel.getProperty("/SelectedScen"),
                    modelVersion = that.byId("idModelVer").getSelectedKey();

                that.oGModel.setProperty(
                    "/SelectedMV",
                    that.byId("idModelVer").getSelectedKey()
                );
                var vFromDate = this.byId("fromDate").getDateValue();
                var vToDate = this.byId("toDate").getDateValue();
                if (
                    Loc !== undefined &&
                    PlanLoc !== undefined &&
                    Prod !== undefined &&
                    ver !== undefined &&
                    scen !== undefined &&
                    modelVersion !== undefined &&
                    vFromDate !== undefined &&
                    vFromDate !== " " &&
                    vToDate !== undefined &&
                    vToDate !== " "
                ) {
                    vFromDate = that.getDateFn(vFromDate);
                    vToDate = that.getDateFn(vToDate);
                    // calling service based on filters
                    that.getModel("CIRModel").callFunction("/getCIRWeekly", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: Loc,
                            PLANNING_LOC: JSON.stringify(PlanLoc),
                            PRODUCT_ID: Prod,
                            VERSION: ver,
                            SCENARIO: scen,
                            FROMDATE: vFromDate,
                            TODATE: vToDate,
                            MODEL_VERSION: modelVersion,
                        },
                        success: function (data) {
                            sap.ui.core.BusyIndicator.hide();
                            that.rowData = data.results;
                            if (data.results.length > 0) {
                                that.oGModel.setProperty("/TData", data.results);

                                // Code to close header
                                var collapseBtnId = that.byId("application-cpfullyconfproddmnd-display-component---Home--ObjectPageLayout-OPHeaderContent-collapseBtn");
                                if (collapseBtnId === undefined) {
                                    collapseBtnId = that.byId("container-cpapp.cpfullyconfproddmnd---Home--ObjectPageLayout-OPHeaderContent-collapseBtn");
                                }
                                if (collapseBtnId) {
                                    collapseBtnId.firePress();
                                    that.handleVisibleRowCount(4);
                                }


                                // Calling function to generate UI table dynamically based on data
                                that.TableGenerate();
                                that.getLocProdCharacteristics();
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
             * This function is called to generate UI table dynamically based on data.
             * @param {object} oEvent -the event information.
             */
            TableGenerate: function () {
                var sRowData = {},
                    iRowData = [],
                    weekIndex;
                var dFrozenHorizonDate,
                    dFirmHorizonDate;
                var columnName, iactQty, iopenQty;
                that.oGModel = that.getModel("oGModel");
                that.tableData = that.oGModel.getProperty("/TData");
                that.aFirmDates = [];

                var rowData;
                var fromDate = new Date(that.byId("fromDate").getDateValue()),
                    toDate = new Date(that.byId("toDate").getDateValue());

                dFrozenHorizonDate = that.oGModel.getProperty("/dFrozenHorizonDate");
                dFirmHorizonDate = that.oGModel.getProperty("/dFirmHorizonDate");

                fromDate = that.onConvertDateToString(fromDate);
                toDate = that.onConvertDateToString(toDate);
                // var dFHLDate = that.onConvertDateToString(that.dFirmHorizonDate);

                // fromDate = fromDate.toISOString().split("T")[0];
                // toDate = toDate.toISOString().split("T")[0];
                // Calling function to generate column names based on dates
                var liDates = that.generateDateseries(fromDate, toDate);
                that.oGModel.setProperty("/TDates", liDates);
                // Looping through the data to generate columns
                for (var i = 0; i < that.tableData.length; i++) {
                    sRowData['Unique ID'] = (that.tableData[i].UNIQUE_ID).toString();
                    sRowData.UNIQUE_DESC = that.tableData[i].UNIQUE_DESC;
                    sRowData['Product'] = that.tableData[i].PRODUCT_ID;
                    sRowData.PROD_DESC = that.tableData[i].PROD_DESC;
                    sRowData.DEMAND_LOC = that.tableData[i].DEMAND_LOC;
                    sRowData.PLANNED_LOC = that.tableData[i].PLANNED_LOC;
                    weekIndex = 1;
                    for (let index = 3; index < liDates.length; index++) {
                        sRowData[liDates[index].WEEK_DATE] =
                            that.tableData[i]["WEEK" + weekIndex];
                        sRowData[liDates[index].WEEK_DATE + "_Q"] = that.tableData[i]["WEEK" + weekIndex + "_Q"];
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
                // Checking column names and applying sap.m.Link to column values
                that.oTable.bindColumns("/columns", function (sId, oContext) {
                    columnName = oContext.getObject().WEEK_DATE;
                    
                    if (columnName === "Location") {
                        return new sap.ui.table.Column({
                            width: "8rem",
                            name: columnName,
                            label: columnName,
                            // template: columnName,
                            template: new sap.m.ObjectIdentifier({
                                title: "{DEMAND_LOC}",
                                text: "{PLANNED_LOC}"
                            }),
                        });
                    } else if (columnName === "Product") {
                        return new sap.ui.table.Column({
                            width: "12rem",
                            name: columnName,
                            label: columnName,
                            // template: columnName,
                            template: new sap.m.ObjectIdentifier({
                                title: "{PROD_DESC}",
                                text: "{" + columnName + "}"
                            }),
                        });
                    } else if (columnName === "Unique ID") {
                        return new sap.ui.table.Column({
                            width: "8rem",
                            name: columnName,
                            label: columnName,
                            // template: columnName,
                            template: new sap.m.VBox({
                                items: [
                                    new sap.m.Link({
                                        text: "{" + columnName + "}",
                                        // press: that.uniqueIdLinkpress,
                                        press: that.onUniqueIdLinkPress,
                                    }),
                                    new sap.m.ObjectIdentifier({
                                        text: "{UNIQUE_DESC}",
                                    }),
                                ]
                            })
                        });
                    } else {
                        var iTotalQty = that.getTotalWeekQty(columnName);
                        var dColName = new Date(columnName);
                        var iWeekIndex = that.getWeekNumber(columnName);
                        var columnText = 'W' + iWeekIndex + " (" + iTotalQty + ")";
                        iactQty = columnName + "_Q" + "/ACT_QTY";
                        iopenQty = columnName + "_Q" + "/OPEN_QTY";
                        // var iOpenQty = "=parseInt(${/columnName} - ${/colQty})";   // - ${/colQty}"; 

                        // if (that.dFirmHorizonDate > dColName) {
                        if (dColName >= dFrozenHorizonDate && dColName <= dFirmHorizonDate) {
                            that.aFirmDates.push(columnName);
                            return new sap.ui.table.Column({
                                width: "6rem",
                                // label: new sap.m.ObjectIdentifier({title: columnName}),
                                name: columnName,
                                label: columnText,
                                // multiLabels: [new sap.m.Text({text: columnName}), new sap.m.Text({text: "SUM"})],
                                template: new sap.m.VBox({
                                    items: [
                                        new sap.m.Input({
                                            type: "Number",
                                            placeholder: "{" + columnName + "}",
                                            value: "{" + columnName + "}",
                                            change: that.onChangeCIRQty,
                                        }),
                                        new sap.m.ObjectIdentifier({
                                            title: "{" + iactQty + "}",
                                            text: "{" + iopenQty + "}"
                                        })
                                    ]
                                })


                            });
                        } else {

                            if (columnName.includes("-") === false) {
                                columnText = columnName;
                            }
                            return new sap.ui.table.Column({
                                width: "9rem",
                                name: columnName,
                                label: columnText,
                                // label: columnName,
                                template: new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({
                                            text: "{" + columnName + "}",
                                        }),
                                        new sap.m.ObjectIdentifier({
                                            title: "{" + iactQty + "}",
                                            text: "{" + iopenQty + "}"
                                        })
                                    ]
                                })
                            });
                        }
                    }
                    // }
                });

                that.oTable.bindRows("/rows");
            },
            /**
             * 
             * @param {*} imFromDate 
             * @param {*} imToDate 
             * @returns 
             */
            getOpenQty(sColName) {
                MessageToast("test");
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

                // Location
                lsDates.WEEK_DATE = "Location";
                liDates.push(lsDates);
                lsDates = {};

                // Product Id
                lsDates.WEEK_DATE = "Product";
                liDates.push(lsDates);
                lsDates = {};

                // Unique Id
                lsDates.WEEK_DATE = "Unique ID";
                liDates.push(lsDates);
                lsDates = {};

                // Calling function to get the next Sunday date of From date
                lsDates.WEEK_DATE = that.getNextMonday(vDateSeries);
                vDateSeries = lsDates.WEEK_DATE;


                liDates.push(lsDates);
                lsDates = {};
                while (vDateSeries <= imToDate) {
                    // Calling function to add Days
                    vDateSeries = that.addDays(vDateSeries, 7);
                    if (vDateSeries > imToDate) {
                        break;
                    }
                    // Calling function to get the next Sunday date of From date
                    lsDates.WEEK_DATE = vDateSeries;//that.getNextMonday(vDateSeries);
                    liDates.push(lsDates);
                    lsDates = {};
                    if (vDateSeries === imToDate) {
                        break;
                    }
                }
                // remove duplicates
                var lireturn = liDates.filter((obj, pos, arr) => {
                    return (
                        arr.map((mapObj) => mapObj.WEEK_DATE).indexOf(obj.WEEK_DATE) == pos
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
                // lDate.setMinutes(lDate.getMinutes() + lDate.getTimezoneOffset());
                let lDay = lDate.getDay();
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
            },

            /**
             * Adding days to generate sequence of dates
             */
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
             * 
             * @param {*} oEvent 
             */
            getPartialProdLoc: function (oEvent) {
                var aSelFilters = [];
                that.oGModel = that.getModel("oGModel");
                sap.ui.core.BusyIndicator.show();

                that.getModel("CIRModel").callFunction("/getPartialProdLoc", {
                    method: "GET",
                    success: function (data) {
                        sap.ui.core.BusyIndicator.hide();
                        that.oGModel.setProperty("/PartialProdLoc", data.results);
                        that.getValueHelpData('FACTORY_LOC', aSelFilters);
                    },
                    error: function (data) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error While Fetching Location Data");
                    },
                });

            },
            /**
             * 
             * @param {*} oEvent 
             */
            getValueHelpData: function (sProperty, aSelFilters) {
                var aFilteredData = [];
                that.oGModel = that.getModel("oGModel");
                var aPartialProdLoc = that.oGModel.getProperty("/PartialProdLoc");
                var sSelFactoryLoc = '';
                var aSelectedFilters = aSelFilters;
                var aSelDmndLoc = [];
                var aTokens = [];
                switch (sProperty) {
                    case 'FACTORY_LOC':
                        // remove duplicates
                        aFilteredData = aPartialProdLoc.filter((obj, pos, arr) => {
                            return (
                                aPartialProdLoc.map((mapObj) => mapObj.FACTORY_LOC).indexOf(obj.FACTORY_LOC) == pos
                            );
                        });

                        that.locModel.setData({ results: aFilteredData });
                        that.oLocList.setModel(that.locModel);

                        break;
                    case 'DEMAND_LOC':
                        sSelFactoryLoc = aSelectedFilters[0].getTitle();

                        //Filter by Selected Factory Location
                        aFilteredData = aPartialProdLoc.filter(function (aProdLoc) {
                            return aProdLoc.FACTORY_LOC === sSelFactoryLoc;
                        });

                        // remove duplicates
                        aFilteredData = aFilteredData.filter((obj, pos, arr) => {
                            return (
                                aFilteredData.map((mapObj) => mapObj.LOCATION_ID).indexOf(obj.LOCATION_ID) == pos
                            );
                        });


                        // By Default display all demand locations as selected
                        if (aFilteredData.length > 0) {
                            for (var i = 0; i < aFilteredData.length; i++) {
                                aTokens.push(new sap.m.Token({ key: aFilteredData[i].DEMAND_LOC, text: aFilteredData[i].DEMANDLOC_DESC }));
                                aSelDmndLoc.push({ DEMAND_LOC: aFilteredData[i].DEMAND_LOC, PLANNING_LOC: aFilteredData[i].PLANNING_LOC });
                            }
                            that.getView().byId("idDmndLoc").setTokens(aTokens);
                        }

                        // Get Partial Products
                        that.oGModel.setProperty("/SelectedDmndLoc", aSelDmndLoc);

                        that.dmndLocModel.setData({ results: aFilteredData });
                        that.oDmndLocList.setModel(that.dmndLocModel);

                        break;
                    case 'PARTIAL_PROD':
                        sSelFactoryLoc = that.oGModel.getProperty('/SelectedLoc');
                        //aSelDmndLoc = aSelectedFilters;
                        if (aSelectedFilters.length > 0) {
                            // Filter array of objects based on another array of objects
                            aFilteredData = aPartialProdLoc.filter((el) => {
                                return aSelectedFilters.some((f) => {
                                    return f.DEMAND_LOC === el.DEMAND_LOC && f.FACTORY_LOC === sSelFactoryLoc;
                                });
                            });
                        } else {
                            //Filter by Selected Factory Location
                            aFilteredData = aPartialProdLoc.filter(function (aProdLoc) {
                                return aProdLoc.FACTORY_LOC === sSelFactoryLoc;
                            });
                        }

                        if (aFilteredData.length > 0) {
                            // remove duplicates
                            aFilteredData = aFilteredData.filter((obj, pos, arr) => {
                                return (
                                    aFilteredData.map((mapObj) => mapObj.PARTIALPROD).indexOf(obj.PARTIALPROD) == pos
                                );
                            });

                            that.prodModel.setData({ results: aFilteredData });
                            that.oProdList.setModel(that.prodModel);
                        }

                        break;

                }




            },
            /**
             * This function is called when click on Value Help of Inputs.
             * In this function dialogs will open based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Location Dialog
                if (sId.includes("loc")) {
                    that._valueHelpDialogLoc.open();
                    // Product Dialog
                } else if (sId.includes("DmndLoc")) {
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogDmndLoc.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                    // Version  Dialog
                } else if (sId.includes("prodList")) {
                    if (that.byId("idloc").getValue()) {
                        that._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                    // Version  Dialog
                } else if (sId.includes("ver")) {
                    if (that.byId("idloc").getValue() && that.byId("idprodList").getValue()) {
                        that._valueHelpDialogVer.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    if (that.byId("idloc").getValue() && that.byId("idprodList").getValue()) {
                        that._valueHelpDialogScen.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                } else if (sId.includes("LocProdChar")) {
                    if (that.byId("idloc").getValue() && that.byId("idprodList").getValue()) {
                        that._valueHelpAllCharDetails.open();
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
                if (sId.includes("Loc")) {
                    that._oCore
                        .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                        .setValue("");
                    if (that.oLocList.getBinding("items")) {
                        that.oLocList.getBinding("items").filter([]);
                    }
                    // Product Dialog
                } else if (sId.includes("prodList")) {
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

                }
            },
            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            onSearchUniqueId: function (oEvent) {
                var oFilter = [];
                that.oTable = that.byId("idCIReq");

                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue");
                // Checking if search value is empty
                if (sQuery) {
                    oFilter = new Filter([
                        new Filter("Unique ID", FilterOperator.Contains, sQuery),
                        new Filter("UNIQUE_DESC", FilterOperator.Contains, sQuery),
                        new Filter("Product", FilterOperator.Contains, sQuery)
                    ], false);

                    that.oTable.getBinding().filter(oFilter);
                    that.onUniqueIdsFilter();
                } else {
                    that.oTable.getBinding().filter(oFilter);
                    that.onUniqueIdsFilter();
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
                var aTokens = [];
                var aSelDmndLoc = [], aFilteredData = [], aFilters = [], aResults = [];
                //Location list
                if (sId.includes("Loc")) {
                    that.oLoc = that.byId("idloc");
                    that.oProd = that.byId("idprodList");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedLoc",
                        aSelectedItems[0].getTitle()
                    );
                    // Removing the input box values when Location changed
                    that.oProd.setValue("");
                    that.oVer.setValue("");
                    that.oScen.setValue("");
                    that.oGModel.setProperty("/SelectedProd", "");

                    // Get Demand Locations
                    that.getValueHelpData('DEMAND_LOC', aSelectedItems);

                    // Get Partial Products
                    that.getValueHelpData('PARTIAL_PROD', []);

                    // // Calling service to get the Product data
                    // this.getModel("CIRModel").read("/getLocProdDet", {
                    //     filters: [
                    //         new Filter(
                    //             "LOCATION_ID",
                    //             FilterOperator.EQ,
                    //             aSelectedItems[0].getTitle()
                    //         ),
                    //     ],
                    //     success: function (oData) {
                    //         that.prodModel.setData(oData);
                    //         that.oProdList.setModel(that.prodModel);
                    //     },
                    //     error: function (oData, error) {
                    //         MessageToast.show("error");
                    //     },
                    // });

                    // // Get Parameter Values to set from date and to date
                    that.getPlannedParameters();

                    // Product list
                } else if (sId.includes("DmndLoc")) {
                    that.oDmndLoc = that.byId("idDmndLoc");
                    aSelectedItems = oEvent.getParameter("selectedItems");

                    // Removing the input box values when Location changed
                    that.oProd.setValue("");
                    that.oVer.setValue("");
                    that.oScen.setValue("");
                    that.oGModel.setProperty("/SelectedProd", "");

                    if (aSelectedItems.length > 0) {
                        for (var i = 0; i < aSelectedItems.length; i++) {
                            aTokens.push(new sap.m.Token({ key: aSelectedItems[i].getTitle(), text: aSelectedItems[i].getDescription() }));
                            // To filter Partial Products
                            aSelDmndLoc.push({ DEMAND_LOC: aSelectedItems[i].getTitle(), PLANNING_LOC: aSelectedItems[i].getInfo() });
                        }

                        that.getView().byId("idDmndLoc").setTokens(aTokens);

                        // Get Partial Products
                        that.oGModel.setProperty("/SelectedDmndLoc", aSelDmndLoc);
                        that.getValueHelpData('PARTIAL_PROD', aSelDmndLoc);
                    }

                } else if (sId.includes("prod")) {
                    that.oProd = that.byId("idprodList");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedProd",
                        aSelectedItems[0].getTitle()
                    );
                    // Removing the input box values when Product changed
                    that.oVer.setValue("");
                    that.oScen.setValue("");

                    aSelPlanLoc = that.oGModel.getProperty("/SelectedDmndLoc");
                    //Filter by Selected Planning Location
                    // aFilteredData = aSelPlanLoc.filter(function (aPlanLoc) {
                    //     return aProdLoc.FACTORY_LOC === sSelFactoryLoc;
                    // });

                    // remove duplicates
                    aFilteredData = aSelPlanLoc.filter((obj, pos, arr) => {
                        return (
                            aSelPlanLoc.map((mapObj) => mapObj.PLANNING_LOC).indexOf(obj.PLANNING_LOC) == pos
                        );
                    });

                    if (aFilteredData.length > 0) {
                        for (var j = 0; j < aFilteredData.length; j++) {
                            aFilters.push(new Filter("LOCATION_ID", FilterOperator.EQ, aFilteredData[j].PLANNING_LOC));
                        }
                        aFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, that.oGModel.getProperty("/SelectedProd")));
                    }

                    // Calling service to get the Scenario data
                    that.getModel("CIRModel").read("/getIbpVerScn", {
                        filters: aFilters,
                        success: function (oData) {
                            aResults = oData.results;
                            // remove duplicates
                            aResults = aResults.filter((obj, pos, arr) => {
                                return (
                                    aResults.map((mapObj) => mapObj.VERSION).indexOf(obj.VERSION) == pos
                                );
                            });

                            that.verModel.setData({ results: aResults });
                            that.oVerList.setModel(that.verModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });



                    // Calling service to get the IBP Varsion data
                    // this.getModel("CIRModel").read("/getCIRVerScen", {
                    //     filters: [
                    //         new Filter(
                    //             "LOCATION_ID",
                    //             FilterOperator.EQ,
                    //             that.oGModel.getProperty("/SelectedLoc")
                    //         ),
                    //         new Filter(
                    //             "REF_PRODID",
                    //             FilterOperator.EQ,
                    //             that.oGModel.getProperty("/SelectedProd")
                    //             // aSelectedItems[0].getTitle()
                    //         ),
                    //     ],
                    //     success: function (oData) {
                    //         that.verModel.setData(oData);
                    //         that.oVerList.setModel(that.verModel);
                    //     },
                    //     error: function (oData, error) {
                    //         MessageToast.show("error");
                    //     },
                    // });

                    // that.getModel("CIRModel").callFunction("/getAllVerScen", {
                    //     method: "GET",
                    //     urlParameters: {
                    //         LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                    //     },
                    //     success: function (oData) {
                    //         var adata = [];
                    //         for (var i = 0; i < oData.results.length; i++) {
                    //             if (oData.results[i].PRODUCT_ID === that.oGModel.getProperty("/SelectedProd")) {
                    //                 adata.push({
                    //                     "VERSION": oData.results[i].VERSION
                    //                 });
                    //             }
                    //         }
                    //         if (adata.length > 0) {
                    //             that.verModel.setData({
                    //                 results: adata
                    //             });

                    //             that.oVerList.setModel(that.verModel);
                    //         }

                    //     },
                    //     error: function (oData, error) {
                    //         MessageToast.show("error");
                    //     },
                    // });


                    // IBP Version list
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

                    aSelPlanLoc = that.oGModel.getProperty("/SelectedDmndLoc");

                    // remove duplicates
                    aFilteredData = aSelPlanLoc.filter((obj, pos, arr) => {
                        return (
                            aSelPlanLoc.map((mapObj) => mapObj.PLANNING_LOC).indexOf(obj.PLANNING_LOC) == pos
                        );
                    });

                    if (aFilteredData.length > 0) {
                        for (var j = 0; j < aFilteredData.length; j++) {
                            aFilters.push(new Filter("LOCATION_ID", FilterOperator.EQ, aFilteredData[j].PLANNING_LOC));
                        }
                        aFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, that.oGModel.getProperty("/SelectedProd")));
                        aFilters.push(new Filter("VERSION", FilterOperator.EQ, aSelectedItems[0].getTitle()));
                    }

                    /****************************************** */
                    var aSelPlanLoc = that.oGModel.getProperty("/SelectedDmndLoc");
                    // Calling service to get the Scenario data
                    that.getModel("CIRModel").read("/getIbpVerScn", {
                        filters: aFilters,
                        success: function (oData) {
                            aResults = oData.results;
                            // remove duplicates
                            aResults = aResults.filter((obj, pos, arr) => {
                                return (
                                    aResults.map((mapObj) => mapObj.SCENARIO).indexOf(obj.SCENARIO) == pos
                                );
                            });
                            that.scenModel.setData({ results: aResults });
                            that.oScenList.setModel(that.scenModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                    //**************************************************** */

                    // Calling service to get the Scenario data
                    // this.getModel("CIRModel").read("/getCIRVerScen", {
                    //     filters: [
                    //         new Filter(
                    //             "LOCATION_ID",
                    //             FilterOperator.EQ,
                    //             that.oGModel.getProperty("/SelectedLoc")
                    //         ),
                    //         new Filter(
                    //             "REF_PRODID",
                    //             FilterOperator.EQ,
                    //             that.oGModel.getProperty("/SelectedProd")
                    //         ),
                    //         new Filter(
                    //             "VERSION",
                    //             FilterOperator.EQ,
                    //             aSelectedItems[0].getTitle()
                    //         ),
                    //     ],
                    //     success: function (oData) {
                    //         that.scenModel.setData(oData);
                    //         that.oScenList.setModel(that.scenModel);
                    //     },
                    //     error: function (oData, error) {
                    //         MessageToast.show("error");
                    //     },
                    // });

                    // that.getModel("CIRModel").callFunction("/getAllVerScen", {
                    //     method: "GET",
                    //     urlParameters: {
                    //         LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                    //     },
                    //     success: function (oData) {
                    //         var adata = [];
                    //         for (var i = 0; i < oData.results.length; i++) {
                    //             if (oData.results[i].PRODUCT_ID === that.oGModel.getProperty("/SelectedProd")

                    //                 && oData.results[i].VERSION === aSelectedItems[0].getTitle()) {
                    //                 adata.push({
                    //                     "SCENARIO": oData.results[i].SCENARIO
                    //                 });
                    //             }
                    //         }

                    //         if (adata.length > 0) {
                    //             that.scenModel.setData({
                    //                 results: adata
                    //             });
                    //             that.oScenList.setModel(that.scenModel);
                    //         }
                    //     },

                    //     error: function (oData, error) {

                    //         MessageToast.show("error");

                    //     },
                    // });
                    // Scenario List
                } else if (sId.includes("scen")) {
                    this.oScen = that.byId("idscen");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oScen.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedScen",
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
             * Called when 'Close/Cancel' button in any dialog is pressed.
            */
            onCharClose: function () {
                that._onCharDetails.close();
            },
            /**
              * Called when Unique Id is pressed to display Characteristis.
             */
            uniqueIdLinkpress: function (oEvent) {
                var selColumnId = oEvent.getSource().getAriaLabelledBy()[0];
                var tableColumns = that.byId("idCIReq").getColumns(),
                    selColumnValue = oEvent.getSource().getText(),
                    ObindingData = oEvent.getSource().getBindingContext().getObject(),
                    selUniqueId = ObindingData['Unique ID'];  //ObindingData.Unique_ID;                             

                // Calling function if selected item is not empty

                if (selColumnValue > 0) {
                    if (!that._onCharDetails) {
                        that._onCharDetails = sap.ui.xmlfragment(
                            "cpapp.cpfullyconfproddmnd.view.CharDetails",
                            that
                        );
                        that.getView().addDependent(that._onCharDetails);
                    }
                    that._onCharDetails.setTitleAlignment("Center");
                    that.CharDetailList = sap.ui.getCore().byId("idCharDetail");

                    // this.getModel("CIRModel").read("/getUniqueItem", {
                    this.getModel("CIRModel").read("/getUniqueChars", {
                        filters: [
                            new Filter("UNIQUE_ID", FilterOperator.EQ, selUniqueId),
                            new Filter(
                                "PRODUCT_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedProd")
                            ),
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            )
                        ],
                        success: function (oData) {
                            that.charModel.setData({
                                results: oData.results,
                            });
                            that.CharDetailList.setModel(that.charModel);
                            that._onCharDetails.open();
                        },
                        error: function (oData, OResponse) {
                            MessageToast.show("Failed to get data");
                        },
                    });
                }
            },
            /**
            * Called when 'Publish' button is clicked on application
            * - Displays confirmation pop-up to publish data to S4 System
            * @param {*} oEvent 
            */
            onPressPublish: function (oEvent) {
                var objEvent = oEvent;
                if (that.aCIRQty.length > 0) {
                    MessageToast.show("Please save changed quantities before publish!");
                } else {
                    MessageBox.confirm(
                        "Would you like to publish?", {
                        icon: MessageBox.Icon.Conf,
                        title: "Confirmation",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === "YES") {
                                that.onPressPublishConfirm(objEvent);
                            } else {
                                // Close Message Box
                            }
                        }
                    }
                    );
                }
            },
            /**
             * Called when 'Publish' button is clicked on application
             * - Calls post service with data filters to send CIR Quantities to S4 HANA System
             * @param {*} oEvent 
             */
            onPressPublishConfirm: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                that.oGModel = that.getModel("oGModel");
                // getting the input values
                var oEntry = {};
                var vFromDate = that.byId("fromDate").getDateValue();
                var vToDate = that.byId("toDate").getDateValue();
                oEntry.LOCATION_ID = that.oGModel.getProperty("/SelectedLoc");
                oEntry.PRODUCT_ID = that.oGModel.getProperty("/SelectedProd");
                oEntry.VERSION = that.oGModel.getProperty("/SelectedVer");
                oEntry.SCENARIO = that.oGModel.getProperty("/SelectedScen");
                oEntry.MODEL_VERSION = that.byId("idModelVer").getSelectedKey();

                if (
                    oEntry.LOCATION_ID !== undefined &&
                    oEntry.PRODUCT_ID !== undefined &&
                    oEntry.VERSION !== undefined &&
                    oEntry.SCENARIO !== undefined &&
                    oEntry.MODEL_VERSION !== undefined &&
                    vFromDate !== undefined &&
                    vFromDate !== " " &&
                    vToDate !== undefined &&
                    vToDate !== " "
                ) {
                    vFromDate = that.getDateFn(vFromDate);
                    vToDate = that.getDateFn(vToDate);

                    oEntry.FROMDATE = vFromDate;
                    oEntry.TODATE = vToDate;

                    // Call service through Job Scheduler
                    that.handlePublish(oEntry);


                    // // calling service based on filters (Without Job Scheduler)
                    // that.getModel("CIRModel").callFunction("/postCIRQuantities", {
                    //     method: "GET",
                    //     urlParameters: {
                    //         LOCATION_ID: oEntry.LOCATION_ID,
                    //         PRODUCT_ID: oEntry.PRODUCT_ID,
                    //         VERSION: oEntry.VERSION,
                    //         SCENARIO: oEntry.SCENARIO,
                    //         FROMDATE: vFromDate,
                    //         TODATE: vToDate,
                    //         MODEL_VERSION: oEntry.MODEL_VERSION,
                    //         VALIDUSER: that.sCFUserDestination  
                    //     },
                    //     success: function (data, oResponse) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         MessageToast.show("Data Successfully Published");
                    //     },
                    //     error: function (data) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         // sap.m.MessageToast.show("Error While publishing data!");
                    //         sap.m.MessageToast.show("Data Successfully Published");
                    //     },
                    // });
                } else {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show(
                        "Please select a Location/Product/Version/Scenario/Date Range"
                    );
                }
            },
            /**
             * Job Schedule Start and End Date , Time
             */
            getScheduleSEDT: function () {
                var aScheduleSEDT = {};
                var dDate = new Date();
                // 07-09-2022-1                
                var idSchTime = dDate.setSeconds(dDate.getSeconds() + 20);
                // 07-09-2022-1
                var idSETime = dDate.setHours(dDate.getHours() + 2);
                idSchTime = new Date(idSchTime);
                idSETime = new Date(idSETime);
                //var onetime = idSchTime;
                var djSdate = new Date(),
                    djEdate = idSETime,
                    dsSDate = new Date(),
                    dsEDate = idSETime,
                    tjStime,
                    tjEtime,
                    tsStime,
                    tsEtime;

                djSdate = djSdate.toISOString().split("T");
                tjStime = djSdate[1].split(":");
                djEdate = djEdate.toISOString().split("T");
                tjEtime = djEdate[1].split(":");
                dsSDate = dsSDate.toISOString().split("T");
                tsStime = dsSDate[1].split(":");
                dsEDate = dsEDate.toISOString().split("T");
                tsEtime = dsEDate[1].split(":");

                var dDate = new Date().toLocaleString().split(" ");
                aScheduleSEDT.djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                aScheduleSEDT.djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                aScheduleSEDT.dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                aScheduleSEDT.dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";
                aScheduleSEDT.oneTime = idSchTime;

                return aScheduleSEDT;

            },

            /**
             * Calls post service with data filters to send CIR Quantities to S4 HANA System
             * -- It runs in background by creating a job in job scheduler
             * @param {*} oEntry 
             */
            handlePublish: function (oEntry) {
                var aScheduleSEDT = {};
                var oModel = that.getOwnerComponent().getModel('CIRModel');
                // var dDate = new Date();
                // // 07-09-2022-1                
                // var idSchTime = dDate.setSeconds(dDate.getSeconds() + 20);
                // // 07-09-2022-1
                // var idSETime = dDate.setHours(dDate.getHours() + 2);
                // idSchTime = new Date(idSchTime);
                // idSETime = new Date(idSETime);
                // var onetime = idSchTime;
                // var djSdate = new Date(),
                //     djEdate = idSETime,
                //     dsSDate = new Date(), //this._oCore.byId("idSSTime").getDateValue(),
                //     dsEDate = idSETime, //this._oCore.byId("idSETime").getDateValue(),
                //     tjStime,
                //     tjEtime,
                //     tsStime,
                //     tsEtime;

                // djSdate = djSdate.toISOString().split("T");
                // tjStime = djSdate[1].split(":");
                // djEdate = djEdate.toISOString().split("T");
                // tjEtime = djEdate[1].split(":");
                // dsSDate = dsSDate.toISOString().split("T");
                // tsStime = dsSDate[1].split(":");
                // dsEDate = dsEDate.toISOString().split("T");
                // tsEtime = dsEDate[1].split(":");

                // var dDate = new Date().toLocaleString().split(" "),
                //     djSdate =
                //         djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                // djEdate =
                //     djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                // dsSDate =
                //     dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                // dsEDate =
                //     dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

                aScheduleSEDT = that.getScheduleSEDT();

                var vcRuleList = {
                    LOCATION_ID: oEntry.LOCATION_ID,
                    PRODUCT_ID: oEntry.PRODUCT_ID,
                    VERSION: oEntry.VERSION,
                    SCENARIO: oEntry.SCENARIO,
                    FROMDATE: oEntry.FROMDATE,
                    TODATE: oEntry.TODATE,
                    MODEL_VERSION: oEntry.MODEL_VERSION,
                    VALIDUSER: that.sCFUserDestination,
                    USER_ID: that.sUserId
                };
                // that.oGModel.setProperty("/vcrulesData", vRuleslist);
                // var vcRuleList = that.oGModel.getProperty("/vcrulesData");
                var dCurrDateTime = new Date().getTime();
                var actionText = "/catalog/postCIRQuantitiesToS4";
                var JobName = "CIRQtys" + dCurrDateTime;
                sap.ui.core.BusyIndicator.show();
                var finalList = {
                    name: JobName,
                    description: "Weekly CIR Quantity",
                    action: encodeURIComponent(actionText),
                    active: true,
                    httpMethod: "POST",
                    startTime: aScheduleSEDT.djSdate,
                    endTime: aScheduleSEDT.djEdate,
                    createdAt: aScheduleSEDT.djSdate,
                    schedules: [{
                        data: vcRuleList,
                        cron: "",
                        time: aScheduleSEDT.oneTime,
                        active: true,
                        startTime: aScheduleSEDT.dsSDate,
                        endTime: aScheduleSEDT.dsEDate,
                    }]
                };
                that.getModel("JModel").callFunction("/addMLJob", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(finalList),
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.addMLJob + ": Job Created");

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error While publishing data!");
                    },
                });

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
            /**
             * 
             * 
             */
            onPressSave: function (oEvent) {
                var objEvent = oEvent;
                var oReturn = {};
                var sMessage = '';

                oReturn = that.checkTotalDemandQty();

                if (oReturn.bFlag === true) {
                    MessageBox.confirm(
                        "Would you like to save?", {
                        icon: MessageBox.Icon.Conf,
                        title: "Confirmation",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === "YES") {
                                that.onPressSaveConfirm(objEvent);
                            } else {
                                // Close Message Box
                            }
                        }
                    }
                    );
                } else {
                    sMessage = "Please adjust quatities as per total demand for week(s)  -  " + oReturn.Weeks;
                    MessageToast.show(sMessage, { width: "35em" });
                }
            },
            /**
             * 
             * @param {*} oEvent 
             */
            checkTotalDemandQty: function (oEvent) {
                var aColumns = that.oTable.getColumns();
                var aIndices = that.oTable.getBinding().aIndices;
                var aList = that.oTable.getBinding().oList;
                var aFilteredList = [];
                var sColLabel = " ";
                var iTotalQty = 0;
                var iDmndQty = 0;
                var sColumnName = "";
                var oReturn = {};
                var aRetWeeks = [];
                aFilteredList = aList.filter((el, i) => aIndices.some(j => i === j));
                for (var i = 3; i < aColumns.length; i++) {

                    sColLabel = aColumns[i].getLabel().getText().split(" ");
                    if (that.aFirmDates.length > 0) {
                        if (that.aFirmDates.includes(sColLabel[0]) === false) {
                            continue;
                        }

                        iDmndQty = sColLabel[1].split("(")[1].split(")")[0];
                        iTotalQty = 0;
                        for (var j = 0; j < aFilteredList.length; j++) {
                            iTotalQty = iTotalQty + parseInt(aFilteredList[j][sColLabel[0]]);
                        }
                        // sColumnName = sColLabel[0] + " (" + iTotalQty + ")";
                        // aColumns[i].setLabel(sColumnName);

                        if (iTotalQty !== parseInt(iDmndQty)) {
                            aRetWeeks.push(sColLabel[0]);
                        }
                    }
                }

                if (aRetWeeks.length > 0) {
                    oReturn.bFlag = false;
                    oReturn.Weeks = aRetWeeks;
                } else {
                    oReturn.bFlag = true;
                    oReturn.Weeks = aRetWeeks;
                }

                return oReturn;
            },
            /**
             * 
             * 
             */
            onPressSaveConfirm: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oModel = that.getOwnerComponent().getModel('CIRModel');
                var aCIRQtys = [],
                    oCIRQtys = {};
                var aCIRData = that.oGModel.getProperty("/TData");

                var oCIRTable = that.getView().byId("idCIReq"); //.getItems();
                var aFilIndices = oCIRTable.getBinding("rows").aIndices;
                var aRows = oCIRTable.getBinding("rows").oList;
                var aCIR_ID = [];
                for (var i = 0; i < aCIRData.length; i++) {
                    // If Unique Ids are filtered, check in filtered indices to avoid looping complete data
                    if (aFilIndices.length > 0) {
                        if (aFilIndices.includes(i) === false) {
                            continue;
                        }
                    }

                    for (var j = 0; j < that.aFirmDates.length; j++) {

                        oCIRQtys = {};
                        oCIRQtys.LOCATION_ID = aCIRData[i].LOCATION_ID;
                        oCIRQtys.PRODUCT_ID = aCIRData[i].PRODUCT_ID;
                        oCIRQtys.MODEL_VERSION = aCIRData[i].MODEL_VERSION;
                        oCIRQtys.VERSION = aCIRData[i].VERSION;
                        oCIRQtys.SCENARIO = aCIRData[i].SCENARIO;
                        oCIRQtys.UNIQUE_ID = aCIRData[i].UNIQUE_ID;
                        // oCIRQtys.CIR_ID = aCIRData[i].CIR_ID[j];

                        aCIR_ID = aCIRData[i].CIR_ID.filter(function (aCIRIDs) {
                            return aCIRIDs.WEEK_DATE === that.aFirmDates[j];
                        });

                        oCIRQtys.CIR_ID = aCIR_ID[0].CIR_ID;
                        oCIRQtys.WEEK_DATE = that.aFirmDates[j];
                        oCIRQtys.CIR_QTY = parseInt(aRows[i][that.aFirmDates[j]]);

                        aCIRQtys.push(oCIRQtys);

                    }
                }

                oModel.callFunction("/modifyCIRFirmQuantities", {
                    method: "GET",
                    urlParameters: {
                        FLAG: 'U',
                        CIR_QUANTITIES: JSON.stringify(aCIRQtys)
                    },
                    success: function (oData, oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        that.aCIRQty = [];
                        sap.m.MessageToast.show(oResponse.data.modifyCIRFirmQuantities);
                        that.onGetData();
                        // sap.m.MessageToast.show(that.i18n.getText("postSuccess"));
                    },
                    error: function (oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Service Connectivity Issue, please try later!");
                    },
                });
            },
            /**
             * 
             * @param {*} oEvent 
             */
            onPressAssemblyRequirements: function (oEvent) {
                var objEvent = oEvent;
                var oEntry = {};
                oEntry.LOCATION_ID = that.getView().byId("idloc").getValue();
                oEntry.PRODUCT_ID = that.getView().byId("idprodList").getValue();

                if (oEntry.LOCATION_ID !== undefined && oEntry.LOCATION_ID !== ""
                    && oEntry.PRODUCT_ID !== undefined && oEntry.PRODUCT_ID !== "") {
                    MessageBox.confirm(
                        "Would you like to generate assembly requirements data?", {
                        icon: MessageBox.Icon.Conf,
                        title: "Confirmation",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === "YES") {
                                that.onPressAssemblyRequirementsConfirm(objEvent, oEntry);
                            } else {
                                // Close Message Box
                            }
                        }
                    }
                    );
                } else {
                    sap.m.MessageToast.show(
                        "Please select a Location & Product!"
                    );
                }

            },
            /**
             * 
             * @param {*} oEvent 
             */
            onPressAssemblyRequirementsConfirm: function (oEvent, oEntry) {
                var aScheduleSEDT = {};
                // var oModel = that.getOwnerComponent().getModel('CIRModel');
                sap.ui.core.BusyIndicator.show();

                // Get Job Schedule Start/End Date/Time
                aScheduleSEDT = that.getScheduleSEDT();

                oEntry.LOCATION_ID = that.getView().byId("idloc").getValue();
                oEntry.PRODUCT_ID = that.getView().byId("idprodList").getValue();

                if (oEntry.LOCATION_ID !== undefined && oEntry.LOCATION_ID !== ""
                    && oEntry.PRODUCT_ID !== undefined && oEntry.PRODUCT_ID !== "") {

                    var vcRuleList = {
                        LOCATION_ID: oEntry.LOCATION_ID,
                        PRODUCT_ID: oEntry.PRODUCT_ID,
                    };

                    var dCurrDateTime = new Date().getTime();
                    var actionText = "/catalog/generateAssemblyReq";
                    var JobName = "Assembly Requirements" + dCurrDateTime;
                    sap.ui.core.BusyIndicator.show();
                    var finalList = {
                        name: JobName,
                        description: "Generate Assembly Requirements",
                        action: encodeURIComponent(actionText),
                        active: true,
                        httpMethod: "POST",
                        startTime: aScheduleSEDT.djSdate,
                        endTime: aScheduleSEDT.djEdate,
                        createdAt: aScheduleSEDT.djSdate,
                        schedules: [{
                            data: vcRuleList,
                            cron: "",
                            time: aScheduleSEDT.oneTime,
                            active: true,
                            startTime: aScheduleSEDT.dsSDate,
                            endTime: aScheduleSEDT.dsEDate,
                        }]
                    };
                    that.getModel("JModel").callFunction("/addMLJob", {
                        method: "GET",
                        urlParameters: {
                            jobDetails: JSON.stringify(finalList),
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show(oData.addMLJob + ": Job Created");

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Service Connectivity Issue!");
                        },
                    });
                }
            },
            /**
             * 
             */
            onChangeCIRQty: function (oEvent) {
                var aCIRData = that.oGModel.getProperty("/TData");
                var oCIRTable = that.getView().byId("idCIReq");
                var aRows = oCIRTable.getBinding("rows").oList;
                var oCIRChangedQty = {};
                var sColQty = "_Q";
                var oCIRData = oEvent.getSource().getBindingContext().getObject();
                var inewValue = parseInt(oEvent.getParameter("newValue"));
                var iValue = parseInt(oEvent.getSource().getProperty("placeholder"));
                var sWeekDate = oEvent.getSource().mBindingInfos.placeholder.binding.sPath;
                var iActQty = oCIRData[sWeekDate + sColQty];

                if (inewValue !== iValue) { 
                    if(inewValue < iActQty.ACT_QTY){
                        MessageToast.show("Cannot set quantity less than actual qty!", { width: "25rem" });
                        oCIRData[sWeekDate] = iValue;
                        return;
                    }
                    oCIRChangedQty.UNIQUE_ID = oCIRData['Unique ID'];
                    oCIRChangedQty.WEEK_DATE = sWeekDate;
                    oCIRChangedQty.CIR_QTY = oCIRData[sWeekDate];

                    that.aCIRQty.push(oCIRChangedQty);
                } else {
                    if (that.aCIRQty.length > 0) {

                        for (var i = 0; i < that.aCIRQty.length; i++) {
                            if (that.aCIRQty[i].UNIQUE_ID === oCIRData['Unique ID'] &&
                                that.aCIRQty[i].WEEK_DATE === sWeekDate) {
                                that.aCIRQty.splice(i, 1);

                                break;
                            }

                        }
                    }
                }

            },
            /**
             * 
             * 
             */
            createColumnConfig: function () {
                var aCols = [];
                var oCIRTable = that.getView().byId("idCIReq");
                var aColumns = oCIRTable.getBinding("columns").oList;

                for (var i = 0; i < aColumns.length; i++) {
                    if (i === 1) {
                        // To Include Unique Description
                        aCols.push({
                            label: 'UNIQUE_DESC',
                            type: EdmType.String,
                            property: 'UNIQUE_DESC',
                            width: 20,
                            wrap: true
                        });

                        aCols.push({
                            label: aColumns[i].WEEK_DATE,
                            type: EdmType.String,
                            property: aColumns[i].WEEK_DATE,
                            width: 20,
                            wrap: true
                        });
                        // For each WEEK DATE - To Change type of cell to Number for CIR Quantity  
                    } else if (aColumns[i].WEEK_DATE.includes("-") === true) {
                        aCols.push({
                            label: aColumns[i].WEEK_DATE,
                            type: EdmType.Number,
                            property: aColumns[i].WEEK_DATE,
                            width: 20,
                            wrap: true
                        });
                        // Others
                    } else {
                        aCols.push({
                            label: aColumns[i].WEEK_DATE,
                            type: EdmType.String,
                            property: aColumns[i].WEEK_DATE,
                            width: 20,
                            wrap: true
                        });
                    }
                }

                return aCols;
            },
            onPressDownload: function (oEvent) {
                var aCols, oSettings, oSheet;
                var oCIRTable = that.getView().byId("idCIReq");
                var aRows = oCIRTable.getBinding("rows").oList;
                var dCurrDateTime = new Date().getTime();
                var sFileName = "Forecast Demand - " + dCurrDateTime;

                aCols = that.createColumnConfig();

                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: aRows,
                    fileName: sFileName,
                    worker: false // We need to disable worker because we are using a Mockserver as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });

            },
            /**
             * 
             */
            handleDateInputDisable: function () {
                // From Date - Input Disabled
                var oFromDt = that.byId("fromDate");
                oFromDt.addEventDelegate({
                    onAfterRendering: function () {
                        var oDateInner = this.$().find('.sapMInputBaseInner');
                        var oID = oDateInner[0].id;
                        $('#' + oID).attr("disabled", true);
                    }
                }, oFromDt);

                // To Date - Input Disabled
                var oToDt = that.byId("toDate");
                oToDt.addEventDelegate({
                    onAfterRendering: function () {
                        var oDateInner = this.$().find('.sapMInputBaseInner');
                        var oID = oDateInner[0].id;
                        $('#' + oID).attr("disabled", true);
                    }
                }, oToDt);
            },
            /**
             * 
             */
            handleVisibleRowCount: function (iCount) {
                var iWinH = window.innerHeight;
                if (iWinH > 750 && iWinH < 800) {
                    that.byId("idCIReq").setVisibleRowCount(9 + iCount);
                } else if (iWinH > 800 && iWinH < 900) {
                    that.byId("idCIReq").setVisibleRowCount(10 + iCount);
                } else if (iWinH > 900 && iWinH < 1000) {
                    that.byId("idCIReq").setVisibleRowCount(12 + iCount);
                } else if (iWinH > 1000 && iWinH < 1100) {
                    that.byId("idCIReq").setVisibleRowCount(14 + iCount);
                } else {
                    that.byId("idCIReq").setVisibleRowCount(7 + iCount);
                }

                //    that.getView().byId("container-cpapp.cpfullyconfproddmnd---Home--ObjectPageLayout-opwrapper");
            },
            /**
             * 
             */
            onChangeHeaderPinStatus: function (oEvent) {
                if (oEvent.getSource()._bHeaderExpanded === true) {
                    that.handleVisibleRowCount(4);
                } else {
                    that.handleVisibleRowCount(0);
                }

            },
            /**
             * 
             */
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

            /** Get Valid CF Auth Token and Configured User in Destination for S4D */
            getValidUser: function (oEvent) {
                var oModel = that.getOwnerComponent().getModel('CIRModel');
                oModel.callFunction("/getCFAuthToken", {
                    method: "GET",

                    success: function (oData, oResponse) {
                        that.authToken = oResponse.data.getCFAuthToken;
                        that.getCFDestinationUser(that.authToken);
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Failed to get Destination User!");
                    },
                });
            },
            /** Get CF Configured Destination User */
            getCFDestinationUser: function (sauthToken) {
                var oModel = that.getOwnerComponent().getModel('CIRModel');
                oModel.callFunction("/getCFDestinationUser", {
                    method: "GET",
                    urlParameters: {
                        TOKEN: sauthToken,
                    },
                    success: function (oData, oResponse) {
                        that.sCFUserDestination = oResponse.data.getCFDestinationUser;
                        if (that.sCFUserDestination) {
                            that.sCFUserDestination = that.sCFUserDestination.toUpperCase();
                        }
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Failed to get Destination User!");
                    },
                });
            },
            /** Get all the Unique Items Configuration */
            getLocProdCharacteristics: function (oEvent) {
                // that.getModel("CIRModel").read("/getUniqueItem", {
                that.getModel("CIRModel").callFunction("/getLocProdChar", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: that.oGModel.getProperty("/SelectedLoc"),
                        PRODUCT_ID: that.oGModel.getProperty("/SelectedProd")
                    },
                    // filters: [
                    //     new Filter(
                    //         "PRODUCT_ID",
                    //         FilterOperator.EQ,
                    //         that.oGModel.getProperty("/SelectedProd")
                    //     ),
                    //     new Filter(
                    //         "LOCATION_ID",
                    //         FilterOperator.EQ,
                    //         that.oGModel.getProperty("/SelectedLoc")
                    //     )
                    // ],
                    success: function (oData) {
                        var aResults = oData.results;
                        that.allCharsModel.setData({
                            charDetails: oData.results,
                        });

                        // remove duplicates
                        var aFilteredChar = aResults.filter((obj, pos, arr) => {
                            return (
                                aResults.map((mapObj) => mapObj.CHARVAL_NUM).indexOf(obj.CHARVAL_NUM) == pos
                            );
                        });

                        // // Code to Concatenate CHAR_DESC & CHAR_NAME property values into new Property
                        // aFilteredChar.forEach((oEntry) => {
                        //     oEntry.CHARACTERISTIC = oEntry.CHAR_DESC + " " + "-" + " " + oEntry.CHAR_NAME;
                        // });

                        that.locProdCharModel.setData({
                            charDetails: aFilteredChar,
                        });


                        that.getView().byId("idUniqueCharDetails").setModel(that.locProdCharModel);

                        // To show characteristics drop down in the next view on click on unique id
                        that.oGModel.setProperty("/AllUniqueChars", oData.results);
                        that.oGModel.setProperty("/aFilteredChar", aFilteredChar);

                    },
                    error: function (oData, OResponse) {
                        MessageToast.show("Failed to get characteristics data");
                    },
                });


            },
            /** Filter Unique Ids based on Characteristics Selections */
            onCharSelectionFinish: function (oEvent) {
                var aUniqueChars = [];
                var aFilterUniqueIds = [];
                var aSelectedItems = [];
                var sCharVal_Num = '';
                var sCharNum = '';
                var sUniqueId = '';
                var iCount = 0;
                var aUniqueIdFilter = [];
                var aFilter = [];
                that.oTable = that.byId("idCIReq");

                aUniqueChars = that.allCharsModel.getData().charDetails;
                aSelectedItems = oEvent.getParameter('selectedItems');
                if (aSelectedItems.length > 0) {


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

                            if (sCharNum === aFilteredUniqueChars[j].CHAR_NUM &&
                                sCharVal_Num === aFilteredUniqueChars[j].CHARVAL_NUM) {

                                sUniqueId = aFilteredUniqueChars[j].UNIQUE_ID;
                                if (aUniqueIdFilter.includes(sUniqueId) === false) {
                                    aUniqueIdFilter.push({ UNIQUE_ID: sUniqueId });
                                }
                            }
                        }

                    }
                    if (aUniqueIdFilter.length > 0) {
                        for (var k = 0; k < aUniqueIdFilter.length; k++) {
                            aFilterUniqueIds.push(new Filter("Unique ID", FilterOperator.EQ, aUniqueIdFilter[k].UNIQUE_ID))
                        }
                    }

                    aFilter = new Filter(aFilterUniqueIds, false);
                    that.oTable.getBinding().filter(aFilter);
                    that.onUniqueIdsFilter();
                } else {
                    that.oTable.getBinding().filter(aFilter);
                    that.onUniqueIdsFilter();
                }
            },

            /**
             * 
             */
            getUserInfo: function (oEvent) {
                var oModel = that.getOwnerComponent().getModel('CIRModel');
                oModel.callFunction("/getUserInfo", {
                    method: "GET",
                    success: function (oData, oResponse) {
                        // sap.m.MessageToast.show(oResponse.data.getUserInfo);
                        that.sUserId = oResponse.data.getUserInfo;
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Failed to get User Info!");
                    },
                });
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
                    if (liDates[index].WEEK_DATE === sWeekDate) {
                        break;
                    }
                }

                // Looping through the data to generate columns SUM

                for (var i = 0; i < that.tableData.length; i++) {
                    iTotalQty = iTotalQty + that.tableData[i]["WEEK" + iWeekIndex];
                }

                return iTotalQty;
            },
            /**
             * 
             */
            onUniqueIdsFilter: function () {
                // var oSource = oEvent.getSource();
                var aColumns = that.oTable.getColumns();
                var aIndices = that.oTable.getBinding().aIndices;
                var aList = that.oTable.getBinding().oList;
                var aFilteredList = [];
                var sColLabel = " ", sColName = " ";
                var iTotalQty = 0;
                var sColumnName = "";
                aFilteredList = aList.filter((el, i) => aIndices.some(j => i === j));
                for (var i = 3; i < aColumns.length; i++) {
                    sColLabel = aColumns[i].getLabel().getText().split(" ");
                    sColName = aColumns[i].getName();
                    iTotalQty = 0;
                    for (var j = 0; j < aFilteredList.length; j++) {
                        // iTotalQty = iTotalQty + aFilteredList[j][sColLabel[0]];
                        iTotalQty = iTotalQty + aFilteredList[j][sColName];
                    }
                    sColumnName = sColLabel[0] + " (" + iTotalQty + ")";
                    aColumns[i].setLabel(sColumnName);
                }
            },

            /**
             * 
             */
            onUniqueIdLinkPress: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var selColumnId = oEvent.getSource().getAriaLabelledBy()[0];
                var tableColumns = that.byId("idCIReq").getColumns(),
                    selColumnValue = oEvent.getSource().getText(),
                    ObindingData = oEvent.getSource().getBindingContext().getObject(),
                    selUniqueId = ObindingData['Unique ID'];  //ObindingData.Unique_ID; 
                var aCIRData = [];
                aCIRData = that.byId("idCIReq").getBinding().oList;

                // Calling function if selected item is not empty

                if (selColumnValue > 0) {
                    // that._onUniqueCharDetails.open();

                    that.oGModel.setProperty("/SelectedUniqueId", selUniqueId);
                    that.oGModel.setProperty("/CIRQtys", aCIRData);
                    that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                    that.oRouter.navTo("RouteUniqChar");


                    // if (!that._onUniqueCharDetails) {
                    //     that._onUniqueCharDetails = sap.ui.xmlfragment(
                    //         "cpapp.cpfullyconfproddmnd.view.UniqueChars",
                    //         that
                    //     );
                    //     that.getView().addDependent(that._onUniqueCharDetails);
                    // }
                    // that._onUniqueCharDetails.setTitleAlignment("Center");
                    // that.uniqueCharDetailList = sap.ui.getCore().byId("idUniqueChars");

                    // that.getModel("CIRModel").callFunction("/getUniqueChars", {
                    //     method: "GET",
                    //     urlParameters: {
                    //         UNIQUE_ID: selUniqueId,
                    //         PRODUCT_ID: that.oGModel.getProperty("/SelectedProd"),
                    //         LOCATION_ID: that.oGModel.getProperty("/SelectedLoc")
                    //     },
                    //     success: function (oData) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         that.formatUniqueCharsData(oData.results);
                    //         // that.charModel.setData({
                    //         //     results: oData.results,
                    //         // });

                    //         // that.CharDetailList.setModel(that.charModel);
                    //         // that._onCharDetails.open();
                    //     },
                    //     error: function (data) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         sap.m.MessageToast.show("Error While fetching data");
                    //     },
                    // });
                }
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
                var sColumnName,
                    sCharValPath,
                    sCharValDescPath;


                if (!that._onUniqueCharDetails) {
                    that._onUniqueCharDetails = sap.ui.xmlfragment(
                        "cpapp.cpfullyconfproddmnd.view.UniqueChars",
                        that
                    );
                    that.getView().addDependent(that._onUniqueCharDetails);
                }
                that._onUniqueCharDetails.setTitleAlignment("Center");
                that.oUniqueCharTable = sap.ui.getCore().byId("idUniqueChars");

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
                                    oRowData[aColumns[k].UNIQUE_CHAR] = [{ CHAR_VALUE: aFilteredUniqueChars[l].CHAR_VALUE, CHARVAL_DESC: aFilteredUniqueChars[l].CHARVAL_DESC }];
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
                        var columnName = oContext.getObject().UNIQUE_CHAR;
                        var iTotal = oContext.getObject().TOTAL;
                        sColumnName = columnName.toString() + " (" + iTotal + ")";

                        if (columnName === 'Characteristic') {
                            sCharValPath = columnName + "/0/CHAR_NAME";
                            sCharValDescPath = columnName + "/0/CHAR_DESC";
                            return new sap.ui.table.Column({
                                width: "12rem",
                                label: sColumnName,
                                template: new sap.m.ObjectIdentifier({
                                    title: "{" + sCharValDescPath + "}",
                                    text: "{" + sCharValPath + "}"
                                })
                            });

                        } else {
                            sCharValPath = columnName + "/0/CHAR_VALUE";
                            sCharValDescPath = columnName + "/0/CHARVAL_DESC";
                            return new sap.ui.table.Column({
                                width: "12rem",
                                label: sColumnName,
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
             * Called when 'Close/Cancel' button in any dialog is pressed.
            */
            onUniqueCharClose: function () {
                that._onUniqueCharDetails.close();
            },
            // /**
            //  * 
            //  */
            // getWeekNumber: function (dInpDate) {

            //     var dCurrentDate = new Date(dInpDate);
            //     var dStartDate = new Date(dCurrentDate.getFullYear(), 0, 1);
            //     var iDays = Math.floor((dCurrentDate - dStartDate) / (24 * 60 * 60 * 1000));
            //     var iWeek = Math.ceil(iDays / 7);
            //     return iWeek;

            // }

        });
    }
);