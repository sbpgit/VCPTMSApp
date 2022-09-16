sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "cpapp/cpfullyconfproddmnd/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
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
        MessageBox
    ) {
        "use strict";
        var oGModel, that;
        return BaseController.extend("cpapp.cpfullyconfproddmnd.controller.Home", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                this.rowData;
                // Declaring JSON Models and size limits
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.verModel = new JSONModel();
                that.scenModel = new JSONModel();
                that.charModel = new JSONModel();

                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                that.verModel.setSizeLimit(1000);
                that.scenModel.setSizeLimit(1000);
                that.charModel.setSizeLimit(1000);

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
                that.oList = this.byId("idTab");
                this.oLoc = this.byId("idloc");
                this.oProd = this.byId("idprodList");
                this.oVer = this.byId("idver");
                this.oScen = this.byId("idscen");

                // Setting title allignment for dialogs
                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");

                var dDate = new Date();
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

                sap.ui.core.BusyIndicator.show();
                //Location data
                this.getModel("CIRModel").read("/getLocation", {
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

                            that.oGModel.setProperty("/TData", data.results);
                            // Calling function to generate UI table dynamically based on data
                            that.TableGenerate();
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

                that.oGModel = that.getModel("oGModel");
                that.tableData = that.oGModel.getProperty("/TData");

                var rowData;
                var fromDate = new Date(that.byId("fromDate").getDateValue()),
                    toDate = new Date(that.byId("toDate").getDateValue());
                fromDate = fromDate.toISOString().split("T")[0];
                toDate = toDate.toISOString().split("T")[0];
                // Calling function to generate column names based on dates
                var liDates = that.generateDateseries(fromDate, toDate);
                // Looping through the data to generate columns
                for (var i = 0; i < that.tableData.length; i++) {
                    sRowData['Unique ID'] = that.tableData[i].UNIQUE_ID;
                    sRowData.UNIQUE_DESC = that.tableData[i].UNIQUE_DESC;
                    sRowData['Product'] = that.tableData[i].PRODUCT_ID;
                    weekIndex = 1;
                    for (let index = 2; index < liDates.length; index++) {
                        sRowData[liDates[index].WEEK_DATE] =
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
                // Checking column names and applying sap.m.Link to column values
                that.oTable.bindColumns("/columns", function (sId, oContext) {
                    var columnName = oContext.getObject().WEEK_DATE;
                    if (columnName === "Unique ID") {
                        return new sap.ui.table.Column({
                            width: "12rem",
                            label: columnName,
                            // template: columnName,
                            template: new sap.m.VBox({
                                items: [
                                    new sap.m.Link({
                                        text: "{" + columnName + "}",
                                        press: that.uniqueIdLinkpress,
                                    }),
                                    new sap.m.ObjectIdentifier({
                                        text: "{UNIQUE_DESC}",
                                    }),
                                ]
                            })
                        });
                    } else {
                        return new sap.ui.table.Column({
                            width: "8rem",
                            label: columnName,
                            template: new sap.m.Text({
                                text: "{" + columnName + "}",
                            }),
                        });
                    }
                    // }
                });

                that.oTable.bindRows("/rows");
            },

            // /**
            //  * Called when 'Close/Cancel' button in any dialog is pressed.
            //  */
            // handleDialogClose() {
            //     that._odGraphDialog.close();
            // },

            /**
             * This function is called when generating Date series for column names.
             * Column names will generate based on From and To dates
             * @param {object} imFromDate -From Date, imToDate - To Date.
             */
            generateDateseries: function (imFromDate, imToDate) {
                var lsDates = {},
                    liDates = [];
                var vDateSeries = imFromDate;

                // Unique Id
                lsDates.WEEK_DATE = "Unique ID";
                liDates.push(lsDates);
                lsDates = {};

                // Product Id
                lsDates.WEEK_DATE = "Product";
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
                    // Calling function to get the next Sunday date of From date
                    lsDates.WEEK_DATE = vDateSeries;//that.getNextMonday(vDateSeries);
                    liDates.push(lsDates);
                    lsDates = {};
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
                let lDay = lDate.getDay();
                if (lDay !== 0) lDay = 7 - lDay;
                lDay = lDay + 1;
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
                if (sId.includes("loc")) {
                    that._valueHelpDialogLoc.open();
                    // Product Dialog
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

                    // Calling service to get the Product data
                    this.getModel("CIRModel").read("/getLocProdDet", {
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

                    // Product list
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

                    // Calling service to get the IBP Varsion data
                    this.getModel("CIRModel").read("/getCIRVerScen", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "REF_PRODID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedProd")
                                // aSelectedItems[0].getTitle()
                            ),
                        ],
                        success: function (oData) {
                            that.verModel.setData(oData);
                            that.oVerList.setModel(that.verModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });

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
                    // Calling service to get the Scenario data
                    this.getModel("CIRModel").read("/getCIRVerScen", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedLoc")
                            ),
                            new Filter(
                                "REF_PRODID",
                                FilterOperator.EQ,
                                that.oGModel.getProperty("/SelectedProd")
                            ),
                            new Filter(
                                "VERSION",
                                FilterOperator.EQ,
                                aSelectedItems[0].getTitle()
                            ),
                        ],
                        success: function (oData) {
                            that.scenModel.setData(oData);
                            that.oScenList.setModel(that.scenModel);
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

                    this.getModel("CIRModel").read("/getUniqueItem", {
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
             * - Calls post service with data filters to send CIR Quantities to S4 HANA System
             * @param {*} oEvent 
             */
            onPressPublish: function (oEvent) {
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

                    that.handlePublish(oEntry);

                    // // calling service based on filters
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
                    //     },
                    //     success: function (data) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         MessageToast.show(data.message);
                    //     },
                    //     error: function (data) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         sap.m.MessageToast.show("Error While fetching data");
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
             * Calls post service with data filters to send CIR Quantities to S4 HANA System
             * -- It runs in background by creating a job in job scheduler
             * @param {*} oEntry 
             */
            handlePublish: function (oEntry) {
                var oModel = that.getOwnerComponent().getModel('CIRModel');
                var dDate = new Date();
                // 07-09-2022-1                
                var idSchTime = dDate.setSeconds(dDate.getSeconds() + 20);
                // 07-09-2022-1
                var idSETime = dDate.setHours(dDate.getHours() + 2);
                idSchTime = new Date(idSchTime);
                idSETime = new Date(idSETime);
                var onetime = idSchTime;
                var djSdate = new Date(),
                    djEdate = idSETime,
                    dsSDate = new Date(), //this._oCore.byId("idSSTime").getDateValue(),
                    dsEDate = idSETime, //this._oCore.byId("idSETime").getDateValue(),
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

                var dDate = new Date().toLocaleString().split(" "),
                    djSdate =
                        djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate =
                    djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                dsSDate =
                    dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate =
                    dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

                var vcRuleList = {
                    LOCATION_ID: oEntry.LOCATION_ID,
                    PRODUCT_ID: oEntry.PRODUCT_ID,
                    VERSION: oEntry.VERSION,
                    SCENARIO: oEntry.SCENARIO,
                    FROMDATE: oEntry.FROMDATE,
                    TODATE: oEntry.TODATE,
                    MODEL_VERSION: oEntry.MODEL_VERSION,
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
                    startTime: djSdate,
                    endTime: djEdate,
                    createdAt: djSdate,
                    schedules: [{
                        data: vcRuleList,
                        cron: "",
                        time: onetime,
                        active: true,
                        startTime: dsSDate,
                        endTime: dsEDate,
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
                        sap.m.MessageToast.show("Error POsting Data");
                    },
                });

            },            
        });
    }
);
