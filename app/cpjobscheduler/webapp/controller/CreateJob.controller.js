/*global location*/
sap.ui.define(
    [
        "cpapp/cpjobscheduler/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/Device",
    ],
    function (
        BaseController,
        JSONModel,
        MessageToast,
        MessageBox,
        Filter,
        FilterOperator,
        Device
    ) {
        "use strict";
        var that;

        return BaseController.extend(
            "cpapp.cpjobscheduler.controller.CreateJob", {
            /**
             * Called when the worklist controller is instantiated.
             * @public
             */
            onInit: function () {
                that = this;
                // Declaring JSON Models and size limits
                this.locModel = new JSONModel();
                this.prodModel = new JSONModel();
                this.odModel = new JSONModel();
                this.ppfModel = new JSONModel();
                this.verModel = new JSONModel();
                this.scenModel = new JSONModel();
                this.custModel = new JSONModel();
                this.classModel = new JSONModel();

                this.prodModel.setSizeLimit(2000);
                this.odModel.setSizeLimit(2000);
                this.ppfModel.setSizeLimit(1000);
                // Declaring global variables
                that.oProd = "";
                that.oPredProfile = "";
                that.oVer = "";
                that.oScen = "";
                that.oCust = "";

                // Declaring fragments
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogOD) {
                    this._valueHelpDialogOD = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.ObjDepDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogOD);
                }
                if (!this._valueHelpDialogPPF) {
                    this._valueHelpDialogPPF = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.PredDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogPPF);
                }
                if (!this._valueHelpDialogVer) {
                    this._valueHelpDialogVer = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.VersionDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogVer);
                }
                if (!this._valueHelpDialogScen) {
                    this._valueHelpDialogScen = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.ScenarioDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogScen);
                }
                if (!this._valueHelpDialogJobDetail) {
                    this._valueHelpDialogJobDetail = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.CreateJobDetails",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogJobDetail);
                }
                if (!this._valueHelpDialogCustDetails) {
                    this._valueHelpDialogCustDetails = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.CustomerDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogCustDetails);
                }
                if (!this._valueHelpDialogClassDetails) {
                    this._valueHelpDialogClassDetails = sap.ui.xmlfragment(
                        "cpapp.cpjobscheduler.view.ClassDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogClassDetails);
                }
            },

            /**
             * Called after the view has been rendered.
             */
            onAfterRendering: function () {
                if (!Device.system.desktop) {
                    var toolPage = this.byId("toolPage");
                    toolPage.setSideExpanded(!toolPage.getSideExpanded());
                }
                sap.ui.core.BusyIndicator.show();
                this.i18n = this.getResourceBundle();
                this.oGModel = this.getModel("oGModel");
                that.oGModel.setProperty("/Flag", "");

                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogOD.setTitleAlignment("Center");
                that._valueHelpDialogPPF.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");

                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
                this.oODList = this._oCore.byId(
                    this._valueHelpDialogOD.getId() + "-list"
                );
                this.oPPFList = this._oCore.byId(
                    this._valueHelpDialogPPF.getId() + "-list"
                );

                this.oVerList = this._oCore.byId(
                    this._valueHelpDialogVer.getId() + "-list"
                );

                this.oScenList = this._oCore.byId(
                    this._valueHelpDialogScen.getId() + "-list"
                );

                this.oCustList = this._oCore.byId(
                    this._valueHelpDialogCustDetails.getId() + "-list"
                );

                this.oClassList = this._oCore.byId(
                    this._valueHelpDialogClassDetails.getId() + "-list"
                );

                that.typeData = {
                    "Types": [{ "name": "Restrictions", "key": "RT" },
                    { "name": "Primary", "key": "PI" }
                    ]
                };

                var jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                this.getView().byId("MidType").setModel(jmodel);
                this.getView().byId("PidType").setModel(jmodel);

                // calling function to select the Job Type
                that.fixDate();
<<<<<<< HEAD
                if (that.oGModel.getProperty("/newSch") !== "X" || that.oGModel.getProperty("/UpdateSch") !== "X") {
                    that.byId("idJobType").setSelectedKey("S");
                }
=======

                if (that.oGModel.getProperty("/newSch") !== "X" || that.oGModel.getProperty("/UpdateSch") !== "X") {
                    that.byId("idJobType").setSelectedKey("S");
                }
                
>>>>>>> 28572205e8c7de3e81f65a1fa52119e34f364125
                that.onJobSelect();

                // Calling service to get the Location data
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
                // Calling service to get the Profiles data
                this.getModel("BModel").read("/getProfiles", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.ppfModel.setData(oData);
                        that.oPPFList.setModel(that.ppfModel);
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
                // Checking for the operation to be perform update or new schedule
                if (
                    that.oGModel.getProperty("/newSch") === "X" ||
                    that.oGModel.getProperty("/UpdateSch") === "X"
                ) {
                    // Getting the selected job type and makeing it as default selected
                    var key = that.oGModel.getProperty("/JobType");
                    that.byId("idJobType").setSelectedKey(key);
                    // 07-09-2022

                    that.byId("modelGenPanel").setVisible(false);
                    that.byId("PredPanel").setVisible(false);
                    that.byId("timeSeriesPanel").setVisible(false);
                    that.byId("timeSeriesFPanel").setVisible(false);
                    that.byId("IbpPanel").setVisible(false);
                    that.byId("sdiPanel").setVisible(false);
                    that.byId("FullDemandPanel").setVisible(false);
                    that.byId("AsmblyReqPanel").setVisible(false);
                    that.byId("salesOrdPanel").setVisible(false);

                    switch (key) {
                        case "M":
                            that.byId("modelGenPanel").setVisible(true);
                            break;
                        case "P":
                            that.byId("PredPanel").setVisible(true);
                            break;
                        case "T":
                            that.byId("timeSeriesPanel").setVisible(true);
                            break;
                        case "F":
                            that.byId("timeSeriesFPanel").setVisible(true);
                            break;
                        case "I":
                            that.byId("IbpPanel").setVisible(true);
                            that.byId("IbpPanel").getHeaderToolbar().getContent()[0].setText("IBP Integration - Import Demand & Future Plan");
                            break;
                        case "E":
                            that.byId("IbpPanel").setVisible(true);
                            that.byId("IbpPanel").getHeaderToolbar().getContent()[0].setText("IBP Integration - Export");
                            break;
                        case "S":
                            that.byId("sdiPanel").setVisible(true);
                            break;
                        case "D":
                            that.byId("FullDemandPanel").setVisible(true);
                            break;
                        case "A":
                            that.byId("AsmblyReqPanel").setVisible(true);
                            break;
                        case "O":
                            that.byId("salesOrdPanel").setVisible(true);
                            break;
                        default:
                            break;
                    }


                    // 07-09-2022

                    if (that.oGModel.getProperty("/UpdateSch") === "X") {
                        sap.ui.getCore().byId("idJobSchtype").setEnabled(false);
                        var keyType = that.oGModel.getProperty("/aScheUpdate").type;

                        if (keyType === "one-time") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            sap.ui.getCore().byId("idSchTime").setVisible(true);
                            sap.ui.getCore().byId("idCronValues").setVisible(false);
                            sap.ui.getCore().byId("idSchTime").setDateValue();
                        } else if (keyType === "recurring") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
                            sap.ui.getCore().byId("idSchTime").setVisible(false);
                            sap.ui.getCore().byId("idCronValues").setVisible(true);
                        }
                        // Calling function when we update the schedule
                        that.onScheduleUpdate();
                    } else {
                        sap.ui.getCore().byId("idJobSchtype").setEnabled(true);
                    }
                } else {
                    sap.ui.getCore().byId("idname").setEditable(true);
                    sap.ui.getCore().byId("idDesc").setEditable(true);
                    sap.ui.getCore().byId("idActive").setEditable(true);
                    sap.ui.getCore().byId("idSTime").setEnabled(true);
                    sap.ui.getCore().byId("idETime").setEnabled(true);
                    that.byId("modelGenPanel").setVisible(false);
                    that.byId("PredPanel").setVisible(false);
                    that.byId("timeSeriesPanel").setVisible(false);
                    that.byId("timeSeriesFPanel").setVisible(false);
                    that.byId("IbpPanel").setVisible(false);
                    that.byId("sdiPanel").setVisible(true);
                    // 07-09-2022
                    that.byId("FullDemandPanel").setVisible(false);
                    that.byId("AsmblyReqPanel").setVisible(false);
                    that.byId("salesOrdPanel").setVisible(false);
                    // 07-09-2022
                    that.byId("idJobType").setSelectedKey("S");
                    sap.ui.getCore().byId("idJobSchtype").setEnabled(true);
                }
            },

            /**
             * Navigates back
             */
            onBack: function () {
                that.oGModel.setProperty("/newSch", "");
                that.oGModel.setProperty("/UpdateSch", "");
                that.oGModel.setProperty("/JobType", "");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("Details", {}, true);
            },

            /**
             * This function is called when we change the Job type.
             * @param {object} oEvent -the event information.
             */
            onJobSelect: function (oEvent) {
                var oSelJob;
                var continueFlag = "X";
                // Checking for the schedule update or create new schedule or creating new job
                if (that.oGModel.getProperty("/newSch") === "X") {
                    oSelJob = that.oGModel.getProperty("/JobType");
                    // that.byId("idJobType").removeSelections();
                    that.byId("idJobType").setSelectedKey(oSelJob);
                    if (oSelJob === "I" || oSelJob === "E") {
                        // that.byId("idIBPselect").setEnabled(false);
                        that.byId("idRbtnImport").setEnabled(false);
                        that.byId("idRbtnExport").setEnabled(false);
                    }

                    MessageToast.show(
                        "you cannot select other Job type when you creating schedule for existing job"
                    );
                    continueFlag = "";

                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    oSelJob = that.oGModel.getProperty("/JobType");
                    // that.byId("idJobType").setSelectedItem("defaultItem");
                    that.byId("idJobType").setSelectedKey(oSelJob);
                    if (oSelJob === "I" || oSelJob === "E") {
                        // that.byId("idIBPselect").setEnabled(false);
                        that.byId("idRbtnImport").setEnabled(false);
                        that.byId("idRbtnExport").setEnabled(false);
                    }
                    MessageToast.show(
                        "you cannot select other Job type when you creating schedule for existing job"
                    );
                    continueFlag = "";
                } else {
                    that.byId("idIBPselect").setEnabled(true);
                    that.byId("idRbtnImport").setEnabled(true);
                    that.byId("idRbtnExport").setEnabled(true);
                    oSelJob = that.byId("idJobType").getSelectedKey();

                    that.byId("modelGenPanel").setVisible(false);
                    that.byId("PredPanel").setVisible(false);
                    that.byId("timeSeriesPanel").setVisible(false);
                    that.byId("timeSeriesFPanel").setVisible(false);
                    that.byId("IbpPanel").setVisible(false);
                    that.byId("sdiPanel").setVisible(false);
                    that.byId("FullDemandPanel").setVisible(false);
                    that.byId("AsmblyReqPanel").setVisible(false);
                    that.byId("salesOrdPanel").setVisible(false);
                    that.typeData = {
                        "Types": [{ "name": "Restrictions", "key": "RT" },
                        { "name": "Primary", "key": "PI" }]
                    };

                    switch (oSelJob) {
                        case "M":
                            that.byId("modelGenPanel").setVisible(true);
                            // that.byId("idMoverRide").setVisible(false);
                            var jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                            this.getView().byId("MidType").setModel(jmodel);
                            break;
                        case "P":
                            that.byId("PredPanel").setVisible(true);
                            // that.byId("idMoverRide").setVisible(false);
                            var jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                            this.getView().byId("PidType").setModel(jmodel);
                            break;
                        case "T":
                            that.byId("timeSeriesPanel").setVisible(true);
                            break;
                        case "F":
                            that.byId("timeSeriesFPanel").setVisible(true);
                            break;
                        case "I":
                            that.byId("IbpPanel").setVisible(true);
                            that.byId("IbpPanel").getHeaderToolbar().getContent()[0].setText("IBP Integration - Import Demand & Future Plan");

                            break;
                        case "E":
                            that.byId("IbpPanel").setVisible(true);
                            that.byId("IbpPanel").getHeaderToolbar().getContent()[0].setText("IBP Integration - Export");
                            break;
                        case "S":
                            that.byId("sdiPanel").setVisible(true);
                            // that.byId("idSdi").setSelectedKey("LO");
                            that.byId("LO").setSelected(true);
                            break;
                        case "D":
                            that.byId("FullDemandPanel").setVisible(true);
                            break;
                        case "A":
                            that.byId("AsmblyReqPanel").setVisible(true);
                            break;
                        case "O":
                            that.byId("salesOrdPanel").setVisible(true);
                            break;
                        default:
                            break;
                    }

                    this.oGModel.setProperty(
                        "/JobDdesc",
                        that.byId("idJobType").getItem().getSelectedItem().getText()
                    );
                }

                // if(continueFlag){
                // When we update or creating schdule it will select the values
                if (that.oGModel.getProperty("/newSch") === "X" || that.oGModel.getProperty("/UpdateSch") === "X") {
                    var sServiceText = that.oGModel.getProperty("/IBPService");

                    if (sServiceText && (that.byId("idJobType").getSelectedKey() === "I" || that.byId("idJobType").getSelectedKey() === "E")) {
                        if (sServiceText === "generateFDemandQty") {
                            // that.byId("idIBPselect").setSelectedKey("I");
                            that.byId("idIBPselect").getNavigationList().setSelectedKey("I");
                        } else {
                            // that.byId("idIBPselect").setSelectedKey("E");
                            that.byId("idIBPselect").getNavigationList().setSelectedKey("E");
                        }
                    }

                    // If selected job type is SDI Integration
                    if (oSelJob === "S") {
                        var sServiceText = that.oGModel.getProperty("/SDIService");
                        that.byId("idSdi").setEnabled(false);
                        switch (sServiceText) {
                            case "ImportECCCustGrp":
                                that.byId("LO").setSelected(true);
                                break;
                            case "ImportECCCustGrp":
                                that.byId("CG").setSelected(true);
                                break;
                            case "ImportECCProd":
                                that.byId("PR").setSelected(true);
                                break;
                            case "ImportECCLocProd":
                                that.byId("LP").setSelected(true);
                                break;
                            case "ImportECCProdClass":
                                that.byId("PC").setSelected(true);
                                break;
                            case "ImportECCBOM":
                                that.byId("BH").setSelected(true);
                                break;
                            case "ImportECCBomod":
                                that.byId("BO").setSelected(true);
                                break;
                            case "ImportECCODhdr":
                                that.byId("OH").setSelected(true);
                                break;
                            case "ImportECCClass":
                                that.byId("CL").setSelected(true);
                                break;
                            case "ImportECCChar":
                                that.byId("CH").setSelected(true);
                                break;
                            case "ImportECCCharval":
                                that.byId("CV").setSelected(true);
                                break;
                            case "ImportECCSalesh":
                                that.byId("SH").setSelected(true);
                                break;
                            case "ImportECCSaleshCfg":
                                that.byId("SC").setSelected(true);
                                break;
                            case "ImportECCAsmbcomp":
                                that.byId("AC").setSelected(true);
                                break;
                            case "ImportCuvtabInd":
                                that.byId("VT").setSelected(true);
                                break;
                            case "ImportCIRLog":
                                that.byId("CIL").setSelected(true);
                                break;
                            case "ImportSOStock":
                                that.byId("SS").setSelected(true);
                                break;
                            case "ImportPartialProd":
                                that.byId("PP").setSelected(true);
                                break;
                            case "ImportPVSNode":
                                that.byId("PVN").setSelected(true);
                                break;
                            case "ImportPVSBOM":
                                that.byId("PVB").setSelected(true);
                                break;
                            default:
                                break;
                        }
                    }
                }
                // Calling function to select the import or export for IBP Integration
                if (oSelJob === "I" || oSelJob === "E") {
                    that.onIBPSelect();
                    if (oSelJob === "I") {
                        that.byId("IbpPanel").getHeaderToolbar().getContent()[0].setText("IBP Integration - Import Demand & Future Plan");
                    } else if (oSelJob === "E") {
                        that.byId("IbpPanel").getHeaderToolbar().getContent()[0].setText("IBP Integration - Export");
                    }

                }
                // If creating new job or adding schedule to job making all values empty
                if (that.oGModel.getProperty("/UpdateSch") !== "X") {
                    that.byId("MlocInput").setValue("");
                    that.byId("MprodInput").removeAllTokens();
                    that.byId("MpmInput").setValue("");
                    // 15-09-2022

                    that.byId("MidType").setSelectedKey("RT");

                    // 15-09-2022
                    that.byId("PlocInput").setValue("");
                    that.byId("PprodInput").removeAllTokens();
                    that.byId("Pidver").setValue("");
                    that.byId("Pidscen").setValue("");
                    // 15-09-2022

                    that.byId("PidType").setSelectedKey("OD");

                    // 15-09-2022
                    that.byId("TprodInput").removeAllTokens();
                    that.byId("TlocInput").setValue("");

                    that.byId("TFprodInput").removeAllTokens();
                    that.byId("TFlocInput").setValue("");

                    that.byId("IlocInput").setValue("");
                    that.byId("IprodInput").setValue("");
                    // that.byId("Iidver").setValue("");
                    // that.byId("Iidscen").setValue("");

                    that.byId("EPlocInput").setValue("");

                    that.byId("IBPclassInput").setValue("");

                    that.byId("ESHlocInput").setValue("");
                    that.byId("ESHprodInput").setValue("");
                    that.byId("ECust").setValue("");

                    that.byId("EACDemandlocInput").setValue("");
                    that.byId("EACDemandprodInput").setValue("");

                    that.byId("ECRQtylocInput").setValue("");
                    that.byId("ECRQtyprodInput").setValue("");
                    that.byId("ECRQtyDate").setDateValue();

                    // 07-09-2022
                    that.byId("DlocInput").setValue("");
                    that.byId("DprodInput").removeAllTokens();

                    that.byId("AlocInput").setValue("");
                    that.byId("AprodInput").setValue("");

                    that.byId("OlocInput").setValue("");
                    that.byId("OprodInput").setValue("");

                    // 07-09-2022

                }

                // Calling function to set the id of inputs
                that.JobType();
                // }
            },

            /**
             * This function is called when click on input box to open value help dialogs.
             * This function will open the dialogs based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                var oSelJob = that.byId("idJobType").getSelectedKey();

                // Location Dialog
                if (sId.includes("loc")) {
                    this._valueHelpDialogLoc.open();
                    // Product Dialog
                } else if (sId.includes("prod")) {
                    if (that.oLoc.getValue()) {
                        if (
                            that.oGModel.getProperty("/UpdateSch") === "X" &&
                            that.oGModel.getProperty("/Flag") === ""
                        ) {
                            that.getProducts();
                            that._valueHelpDialogProd.open();
                        } else {
                            if (oSelJob === "M" || oSelJob === "P" || oSelJob === "T" ||
                                oSelJob === "F" || oSelJob === "D" || oSelJob === "I" ||
                                oSelJob === "E") {
                                if (that.byId("idRbtnExport").getSelectedButton().getText() !== "Assembly Requirement Quantity") {
                                    sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
                                    sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);
                                } else {
                                    sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                                    sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);
                                }
                            } else if (oSelJob === "A" || oSelJob === "O") {
                                sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                                sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);
                            }
                            this._valueHelpDialogProd.open();
                        }
                    } else {
                        MessageToast.show(that.i18n.getText("Select Location"));
                    }
                    // Version Dialog
                } else if (sId.includes("ver")) {
                    if (
                        that.oLoc.getValue() &&
                        (that.oProd.getTokens().length !== 0 || that.oProd.getValue())
                    ) {
                        if (
                            that.oGModel.getProperty("/UpdateSch") === "X" &&
                            that.oGModel.getProperty("/Flag") === ""
                        ) {
                            that.getVersion();
                            that._valueHelpDialogVer.open();
                        } else {
                            that._valueHelpDialogVer.open();
                        }
                    } else {
                        MessageToast.show(that.i18n.getText("noLocProd"));
                    }
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    if (
                        that.oLoc.getValue() &&
                        (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) &&
                        that.oVer.getValue()
                    ) {
                        if (
                            that.oGModel.getProperty("/UpdateSch") === "X" &&
                            that.oGModel.getProperty("/Flag") === ""
                        ) {
                            that.getScenario();
                            that._valueHelpDialogScen.open();
                        } else {
                            that._valueHelpDialogScen.open();
                        }
                    } else {
                        MessageToast.show("Select Location, Product and Version");
                    }
                } else if (sId.includes("MpmInput")) {
                    that._valueHelpDialogPPF.open();
                } else if (sId.includes("Cust")) {
                    sap.ui.core.BusyIndicator.show();
                    // Calling service to get the Customer data
                    this.getModel("BModel").read("/getCustgroup", {
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.custModel.setData(oData);
                            that.oCustList.setModel(that.custModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });

                    that._valueHelpDialogCustDetails.open();
                } else if (sId.includes("classInput")) {
                    sap.ui.core.BusyIndicator.show();
                    // Calling service to get the Customer data
                    this.getModel("BModel").read("/getClass", {
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.classModel.setData(oData);
                            that.oClassList.setModel(that.classModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });

                    that._valueHelpDialogClassDetails.open();
                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             * Dialogs will be closed based on sId.
             * @param {object} oEvent -the event information.
             */
            handleClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                // Location Dialog
                if (sId.includes("loc")) {
                    that._oCore
                        .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                        .setValue("");
                    if (that.oLocList.getBinding("items")) {
                        that.oLocList.getBinding("items").filter([]);
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
                    // Scenario Dalog
                } else if (sId.includes("scen")) {
                    that._oCore
                        .byId(this._valueHelpDialogScen.getId() + "-searchField")
                        .setValue("");
                    if (that.oScenList.getBinding("items")) {
                        that.oScenList.getBinding("items").filter([]);
                    }
                    // Prediction Profile Dalog
                } else if (sId.includes("ppfSlctList")) {
                    that._oCore
                        .byId(this._valueHelpDialogPPF.getId() + "-searchField")
                        .setValue("");
                    if (that.oPPFList.getBinding("items")) {
                        that.oPPFList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("ECust")) {
                    that._oCore
                        .byId(this._valueHelpDialogCustDetails.getId() + "-searchField")
                        .setValue("");
                    if (that.oCustList.getBinding("items")) {
                        that.oCustList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("classInput")) {
                    that._oCore
                        .byId(this._valueHelpDialogClassDetails.getId() + "-searchField")
                        .setValue("");
                    if (that.oClassList.getBinding("items")) {
                        that.oClassList.getBinding("items").filter([]);
                    }
                }
            },

            /**
             * Called when something is entered into the search field.
             * Data will be filtered based in sId.
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
                                    new Filter(
                                        "LOCATION_DESC",
                                        FilterOperator.Contains,
                                        sQuery
                                    ),
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
                    // prediction Profile
                } else if (sId.includes("ppfSlctList")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("PROFILE", FilterOperator.Contains, sQuery),
                                    new Filter("PRF_DESC", FilterOperator.Contains, sQuery),
                                    new Filter("METHOD", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oPPFList.getBinding("items").filter(oFilters);
                    // Customer
                } else if (sId.includes("CustSlctList")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter(
                                        "CUSTOMER_GROUP",
                                        FilterOperator.Contains,
                                        sQuery
                                    ),
                                    new Filter(
                                        "CUSTOMER_DESC",
                                        FilterOperator.Contains,
                                        sQuery
                                    ),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCustList.getBinding("items").filter(oFilters);
                    // Class
                } else if (sId.includes("ClassSlctList")) {
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
                    that.oClassList.getBinding("items").filter(oFilters);
                }
            },

            /**
             * This function is used to set the input Id for the selected Job type .
             */
            JobType: function () {
                if (that.oGModel.getProperty("/newSch") !== "X" || that.oGModel.getProperty("/UpdateSch") !== "X") {
                    var oJobKey = that.byId("idJobType").getSelectedKey();

                    // Changing the Id's based on selected job type
                    switch (oJobKey) {
                        case "M":
                            that.oLoc = this.byId("MlocInput");
                            that.oProd = this.byId("MprodInput");
                            that.oPredProfile = this.byId("MpmInput");
                            break;

                        case "P":
                            that.oLoc = this.byId("PlocInput");
                            that.oProd = this.byId("PprodInput");
                            that.oVer = this.byId("Pidver");
                            that.oScen = this.byId("Pidscen");
                            break;

                        case "T":
                            that.oLoc = this.byId("TlocInput");
                            that.oProd = this.byId("TprodInput");
                            break;

                        case "F":
                            that.oLoc = this.byId("TFlocInput");
                            that.oProd = this.byId("TFprodInput");
                            break;

                        case "I":
                            var rRadioBtn = that.byId("idRbtnImport").getSelectedButton().getText();
                            that.oLoc = this.byId("IlocInput");
                            that.oProd = this.byId("IprodInput");
                            break;

                        case "E":
                            that.ExportRadioChange();
                            break;

                        case "D":
                            that.oLoc = this.byId("DlocInput");
                            that.oProd = this.byId("DprodInput");
                            break;

                        case "A":
                            that.oLoc = this.byId("AlocInput");
                            that.oProd = this.byId("AprodInput");
                            break;

                        case "O":
                            that.oLoc = this.byId("OlocInput");
                            that.oProd = this.byId("OprodInput");
                            break;

                        default:
                            break

                    }

                    // 07-09-2022-1
                    // if (that.oGModel.getProperty("/UpdateSch") !== "X" && (oJobKey === "M" || oJobKey === "P" || oJobKey === "T" || oJobKey === "F" ||
                    //     oJobKey === "I" || oJobKey === "E" || oJobKey === "D")) {
                    //     that.oProd.removeAllTokens();
                    // }
                    if (that.oGModel.getProperty("/UpdateSch") !== "X" && (oJobKey === "M" || oJobKey === "P" || oJobKey === "T" || oJobKey === "F" ||
                        oJobKey === "I" || oJobKey === "D")) {
                        that.oProd.removeAllTokens();
                    } else if (that.oGModel.getProperty("/UpdateSch") !== "X" && oJobKey === "E") {
                        var selRadio = that.byId("idRbtnExport").getSelectedButton().getText();
                        if (selRadio !== "Location" && selRadio !== "Customer Group" && selRadio !== "Product" && selRadio !== "Class"
                            && selRadio !== "Restrictions" && selRadio !== "Assembly Requirement Quantity") {
                            that.oProd.removeAllTokens();
                        }
                    }
                }
                // 07-09-2022-1
                // 07-09-2022
            },

            /**
             * This function is called when selecting values in dialog box.
             * In this function tokens will be updated.
             * @param {object} oEvent -the event information.
             */
            handleSelection: function (oEvent) {
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedVer;
                var oJobType = that.byId("idJobType").getSelectedKey();
                //Location list
                if (sId.includes("Loc")) {
                    var aSelectedLoc = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedLoc[0].getTitle());
                    that.oGModel.setProperty("/Flag", "X");

                    if (oJobType === "M" || oJobType === "P" || oJobType === "T" || oJobType === "F" || oJobType === "D" || oJobType === "I" || oJobType === "E") {
                        that.oProd.removeAllTokens();
                        this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
                    } else if (that.oProd !== "") {
                        that.oProd.setValue("");
                    }
                    if (oJobType === "P") {
                        that.oVer.setValue("");
                        that.oScen.setValue("");
                    }
                    // Calling function to get the products based on selected location
                    that.getProducts();

                    // Product list
                } else if (sId.includes("prod")) {
                    var aSelectedProd;
                    // that.oProdList.getBinding("items").filter([]);
                    aSelectedProd = oEvent.getParameter("selectedItems");
                    that.oGModel.setProperty("/Flag", "X");
                    if (aSelectedProd && aSelectedProd.length > 0) {
                        // 07-09-2022
                        if (oJobType === "A" || oJobType === "O") {
                            that.oProd.setValue(aSelectedProd[0].getTitle());
                        }
                        // 07-09-2022
                        if (oJobType === "M" || oJobType === "P" || oJobType === "T" || oJobType === "F" || oJobType === "D" || oJobType === "I" || oJobType === "E") {
                            if (oJobType === "E" && that.byId("idRbtnExport").getSelectedButton().getText() === "Assembly Requirement Quantity") {
                                that.oProd.setValue(aSelectedProd[0].getTitle());
                            } else {
                                that.oProd.removeAllTokens();
                                aSelectedProd.forEach(function (oItem) {
                                    that.oProd.addToken(
                                        new sap.m.Token({
                                            key: oItem.getTitle(),
                                            text: oItem.getTitle(),
                                        })
                                    );
                                });
                            }
                        }

                        if (oJobType === "P") {
                            that.getVersion();
                        }
                    } else {
                        if (oJobType === "M" || oJobType === "P" || oJobType === "T" || oJobType === "F" || oJobType === "D") {
                            that.oProd.removeAllTokens();
                        }
                    }
                    // Versions List
                } else if (sId.includes("Ver")) {
                    aSelectedVer = oEvent.getParameter("selectedItems");
                    that.oVer.setValue(aSelectedVer[0].getTitle());
                    that.oGModel.setProperty("/Flag", "X");
                    that.oScen.setValue("");

                    that.getScenario();

                    // Scenario List
                } else if (sId.includes("scen")) {
                    var aSelectedScen = oEvent.getParameter("selectedItems");
                    that.oGModel.setProperty("/Flag", "X");
                    that.oScen.setValue(aSelectedScen[0].getTitle());
                    // Profile List
                } else if (sId.includes("ppfSlctList")) {
                    var aSelectedPPF = oEvent.getParameter("selectedItems");
                    that.oPredProfile.setValue(aSelectedPPF[0].getTitle());
                    // Customer List
                } else if (sId.includes("CustSlctList")) {
                    var aSelectedCust = oEvent.getParameter("selectedItems");
                    that.oCust.setValue(aSelectedCust[0].getTitle());
                    // Class List
                } else if (sId.includes("ClassSlctList")) {
                    var aSelectedClass = oEvent.getParameter("selectedItems");
                    that.oClass.setValue(aSelectedClass[0].getDescription());
                }
                that.handleClose(oEvent);
            },

            /**
             * This function is called when Location is selected.
             * In this function we will get the Products for the selected Location.
             * @param {object} oEvent -the event information.
             */
            // 16-09-2022
            getProducts: function (oEvent) {
                var oJobType = that.byId("idJobType").getSelectedKey(),
                    ExportFlag = "";
                if (oJobType === "E") {
                    if (that.byId("idRbtnExport").getSelectedButton().getText() === "Assembly Requirement Quantity") {
                        ExportFlag = "X";
                    }
                }

                if (oJobType === "O" || oJobType === "A" || ExportFlag === "X") {

                    // Calling sercive to get the Product list
                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                that.oLoc.getValue()
                            ),
                        ],
                        success: function (oData) {
                            that.jobtypeProduct(oData, oJobType);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                } else {
                    that.getModel("BModel").callFunction("/getAllProd", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: that.oLoc.getValue()
                        },
                        success: function (oData) {
                            that.jobtypeProduct(oData, oJobType);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                }

                if (oJobType === "M" || oJobType === "P") {
                    that.getModel("BModel").read("/getPlancfgPara", {
                        filters: [
                            new Filter("LOCATION_ID", FilterOperator.EQ, that.oLoc.getValue()),
                            new Filter("PARAMETER_ID", FilterOperator.EQ, "5"),
                        ],
                        success: function (oData) {
                            if (oData.results) {
                                if (oData.results[0].VALUE === "M1") {
                                    that.typeData = {
                                        "Types": [{ "name": "Restrictions", "key": "RT" },
                                        { "name": "Object Dependency", "key": "OD" }]
                                    };
                                    // if (oJobType === "M") {
                                    //     that.byId("idMoverRide").setVisible(true);
                                    // } else if (oJobType === "P") {
                                    //     that.byId("idPoverRide").setVisible(true);
                                    // }                    
                                } else if (oData.results[0].VALUE === "M2") {
                                    that.typeData = {
                                        "Types": [{ "name": "Restrictions", "key": "RT" },
                                        { "name": "Primary", "key": "PI" }]
                                    };
                                    // if (oJobType === "M") {
                                    //     that.byId("idMoverRide").setVisible(false);
                                    // } else if (oJobType === "P") {
                                    //     that.byId("idPoverRide").setVisible(false);
                                    // } 
                                }
                                var jmodel = [];
                                jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                                if (oJobType === "M") {
                                    that.getView().byId("MidType").setModel(jmodel);
                                } else {
                                    that.getView().byId("PidType").setModel(jmodel);
                                }
                            }
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                }
            },

            jobtypeProduct: function (data, type) {
                var aData = data,
                    oJobType = type;


                if (oJobType === "M" || oJobType === "P") {
                    sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
                    sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);

                    if (data.results.length > 0) {
                        data.results.unshift({
                            PRODUCT_ID: "All",
                            PROD_DESC: "All",
                        });
                    }
                } else if (oJobType === "T" || oJobType === "F" || oJobType === "D" || oJobType === "I" || oJobType === "E") {
                    if (that.byId("idRbtnExport").getSelectedButton().getText() !== "Assembly Requirement Quantity") {
                        sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
                        sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);
                    } else {
                        sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                        sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);
                    }

                } else if (oJobType === "A" || oJobType === "O") {
                    sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                    sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);
                }
                that.prodModel.setData(data);
                that.oProdList.setModel(that.prodModel);

            },
            // 16-09-202

            /**
             * This function is called when Location and product is selected.
             * In this function we will get the Versions.
             * @param {object} oEvent -the event information.
             */
            getVersion: function (oEvent) {
                var oJobType = that.byId("idJobType").getSelectedKey(),
                    aSelectedProd;

                var oFilters = [];
                var sFilter = new sap.ui.model.Filter({
                    path: "LOCATION_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oLoc.getValue(),
                });
                oFilters.push(sFilter);

                if (oJobType === "M" || oJobType === "P") {
                    aSelectedProd = that.oProd.getTokens();
                    for (var i = 0; i < aSelectedProd.length; i++) {
                        if (aSelectedProd[i].getText() !== "All") {
                            sFilter = new sap.ui.model.Filter({
                                path: "PRODUCT_ID",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: aSelectedProd[i].getText(),
                            });
                            oFilters.push(sFilter);
                        }
                    }
                } else if (oJobType === "T" || oJobType === "I" || oJobType === "E") {
                    var sFilter = new sap.ui.model.Filter({
                        path: "PRODUCT_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oProd.getValue(),
                    });
                    oFilters.push(sFilter);
                }

                // Calling sercive to get the IBP Vaersions list
                this.getModel("BModel").read("/getIbpVerScn", {
                    filters: oFilters,
                    success: function (oData) {
                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.verModel.setData({
                            results: removeDuplicate(oData.results, 'VERSION')
                        });

                        that.oVerList.setModel(that.verModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
            },

            /**
             * This function is called when Version is selected.
             * In this function we will get the Scenario for the selected version.
             * @param {object} oEvent -the event information.
             */
            getScenario: function () {
                var aSelectedProd = that.oProd.getTokens();
                var oFilters = [];
                var sFilter = new sap.ui.model.Filter({
                    path: "LOCATION_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oLoc.getValue(),
                });
                oFilters.push(sFilter);

                var sFilter = new sap.ui.model.Filter({
                    path: "VERSION",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oVer.getValue(),
                });
                oFilters.push(sFilter);

                for (var i = 0; i < aSelectedProd.length; i++) {
                    if (aSelectedProd[i].getText() !== "All") {
                        sFilter = new sap.ui.model.Filter({
                            path: "PRODUCT_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: aSelectedProd[i].getText(),
                        });
                        oFilters.push(sFilter);
                    }
                }

                // Calling sercive to get the IBP Scenario list
                this.getModel("BModel").read("/getIbpVerScn", {
                    filters: oFilters,
                    success: function (oData) {
                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.scenModel.setData({
                            results: removeDuplicate(oData.results, 'SCENARIO')
                        });
                        // that.scenModel.setData(oData);
                        that.oScenList.setModel(that.scenModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
            },

            /**
             * This function is called when Selecting or Unselecting of a items in Product dialog.
             * @param {object} oEvent -the event information.
             */
            handleProdChange: function (oEvent) {
                var oSelected = oEvent.getParameter("listItem").getTitle();
                var aItems = sap.ui.getCore().byId("prodSlctList").getItems();
                var oSelItems = this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();
                if (
                    oSelected === "All" &&
                    oEvent.getParameter("selected") &&
                    aItems.length !== 1
                ) {
                    this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
                } else if (oSelected === "All" && !oEvent.getParameter("selected")) {
                    this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
                } else if (oSelected === "All" && aItems.length === 1) {
                    sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false);
                } else if (oSelected !== "All" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                    sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false);
                } else if (oSelected !== "All" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                    sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(true);
                }
            },


            /**
             * This function is called when upating the existing schedule.
             * In this function based on the job type getting data and placing in input boxes
             */
            onScheduleUpdate: function () {
                // Based on the Job type and schedule type filling data into the inputs
                var aData = that.oGModel.getProperty("/aScheUpdate").data;
                var oScheData = $.parseJSON(aData);
                var oJobType = that.byId("idJobType").getSelectedKey();
                var jobType = that.oGModel.getProperty("/JobType");
                var sServiceText = that.oGModel.getProperty("/IBPService");
                var ExportFlag = "";
                var Flag = "";
                var location;
                var selectedButton = that.byId("idRbtnExport").getSelectedButton().getText();

                if (jobType === "I" || jobType === "E" || jobType === "T" || jobType === "F" || jobType === "D") {
                    // var oScheData = $.parseJSON(oScheData.LocProdData);
                    // location = oScheData[0].LOCATION_ID;

                    if (jobType === "E" && selectedButton === "Assembly Requirement Quantity") {
                        ExportFlag = "X";
                    }
<<<<<<< HEAD
                    if (jobType === "I" || jobType === "E") {

=======
                    // 03-12
                    if (jobType === "I" || jobType === "E"){
                    switch (selectedButton) {
                        case "Location":
                            Flag = "X";
                            break;
                        case "Customer Group":
                            Flag = "X";
                            break;
                        case "Product":
                            Flag = "X";
                            that.oLoc.setValue(oScheData.LOCATION_ID);
                            break;
                        case "Class":
                            Flag = "X";
                            that.oClass.setValue(oScheData.CLASS_NUM);
                            break;
                        case "Restrictions":
                            Flag = "X";
                            that.oLoc.setValue(oScheData.LOCATION_ID);
                            break;
                        default:
                            break;
                    }
                }
>>>>>>> 28572205e8c7de3e81f65a1fa52119e34f364125

                        switch (selectedButton) {
                            case "Location":
                                Flag === "X";
                                break;
                            case "Customer Group":
                                Flag === "X";
                                break;
                            case "Product":
                                Flag === "X";
                                that.oLoc.setValue(oScheData.LOCATION_ID);
                                break;
                            case "Class":
                                Flag === "X";
                                that.oClass.setValue(oScheData.CLASS_NUM);
                                break;
                            case "Restrictions":
                                Flag === "X";
                                that.oLoc.setValue(oScheData.LOCATION_ID);
                                break;
                            default:
                                break;
                        }
                    }
                    if (Flag === "" && ExportFlag === "") {
                        var oScheData = $.parseJSON(oScheData.LocProdData);
<<<<<<< HEAD
                        location = oScheData[0].LOCATION_ID;
=======
                    location = oScheData[0].LOCATION_ID;
>>>>>>> 28572205e8c7de3e81f65a1fa52119e34f364125

                        that.getModel("BModel").callFunction("/getAllProd", {
                            method: "GET",
                            urlParameters: {
                                LOCATION_ID: location
                            },
                            success: function (oData) {
                                if (jobType === "I" || jobType === "E") {
                                    if (sServiceText.includes("DemandQty")) {
                                        that.byId("idIBPselect").getNavigationList().setSelectedKey("I");
                                    } else {
                                        that.byId("idIBPselect").getNavigationList().setSelectedKey("E");
                                        that.byId("idRbtnImport").setVisible(false);
                                        that.byId("idRbtnExport").setVisible(true);
                                        if (sServiceText.includes("Location")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPLoc"));
                                        } else if (sServiceText.includes("Customer")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPCustGrp"));
                                        } else if (sServiceText.includes("MasterProd")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPProd"));
                                        } else if (sServiceText.includes("Class")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPClass"));
                                        } else if (sServiceText.includes("SalesTrans")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPSalesHis"));
                                        } else if (sServiceText.includes("ActCompDemand")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPActCompDemd"));
                                        } else if (sServiceText.includes("exportMktAuth")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idMarketAuth"));
                                        } else if (sServiceText.includes("ComponentReq")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPCompReqQty"));
                                        } else if (sServiceText.includes("exportIBPCIR")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPExCIR"));
                                        } else if (sServiceText.includes("exportRestrDetails")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idRestri"));
                                        } else if (sServiceText.includes("exportRestrReq")) {
                                            that.byId("idRbtnExport").setSelectedButton(that.byId("idResLikhood"));
                                        }
                                    }
                                    if (sServiceText !== "generateFDemandQty") {
                                        // Calling service when IBP Integration Export process is selected
                                        that.IBPjobUpdate();
                                    }
                                }


                                that.prodModel.setData(oData);
                                that.oProdList.setModel(that.prodModel);
                                that.oLoc.setValue(location);
                                if (oScheData[0].PRODUCT_ID !== "ALL") {
                                    for (var i = 0; i < oScheData.length; i++) {
                                        that.oProd.addToken(
                                            new sap.m.Token({
                                                key: oScheData[i].PRODUCT_ID,
                                                text: oScheData[i].PRODUCT_ID,
                                            })
                                        );
                                    }
                                }

                            },
                            error: function (oData, error) {
                                MessageToast.show("error");
                            },
                        });
                    }

                } else if (
                    that.oGModel.getProperty("/JobType") === "M" ||
                    that.oGModel.getProperty("/JobType") === "P"
                ) {
                    oScheData = oScheData.vcRulesList;

                    if (oJobType === "M" || oJobType === "P") {

                        that.getModel("BModel").read("/getPlancfgPara", {
                            filters: [
                                new Filter("LOCATION_ID", FilterOperator.EQ, oScheData[0].Location),
                                new Filter("PARAMETER_ID", FilterOperator.EQ, "5"),
                            ],
                            success: function (oData) {
                                if (oData.results) {
                                    if (oData.results[0].VALUE === "M1") {
                                        that.typeData = {
                                            "Types": [{ "name": "Restrictions", "key": "RT" },
                                            { "name": "Object Dependency", "key": "OD" }]
                                        };
                                        // if (oJobType === "M") {
                                        //     that.byId("idMoverRide").setVisible(true);
                                        // } else {
                                        //     that.byId("idPoverRide").setVisible(true);
                                        // }                    
                                    } else if (oData.results[0].VALUE === "M2") {
                                        that.typeData = {
                                            "Types": [{ "name": "Restrictions", "key": "RT" },
                                            { "name": "Primary", "key": "PI" }]
                                        };
                                        // if (oJobType === "M") {
                                        //     that.byId("idMoverRide").setVisible(false);
                                        // } else {
                                        //     that.byId("idPoverRide").setVisible(false);
                                        // }    
                                    }
                                    var jmodel = [];
                                    jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                                    if (oJobType === "M") {
                                        that.getView().byId("MidType").setModel(jmodel);
                                    } else if (oJobType === "P") {
                                        that.getView().byId("PidType").setModel(jmodel);
                                    }
                                } else {

                                    that.typeData = {
                                        "Types": [{ "name": "Restrictions", "key": "RT" },
                                        { "name": "Primary", "key": "PI" }]
                                    };
                                    // if (oJobType === "M") {
                                    //     that.byId("idMoverRide").setVisible(false);
                                    // } else {
                                    //     that.byId("idPoverRide").setVisible(false);
                                    // }    
                                    var jmodel = [];
                                    jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                                    if (oJobType === "M") {
                                        that.getView().byId("MidType").setModel(jmodel);
                                    } else if (oJobType === "P") {
                                        that.getView().byId("PidType").setModel(jmodel);
                                    }
                                }
                            },
                            error: function (oData, error) {
                                MessageToast.show("error");
                            },
                        });
                    }
                    that.getModel("BModel").callFunction("/getAllProd", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: oScheData[0].Location
                        },
                        success: function (oData) {
                            if (oJobType === "M" || oJobType === "P") {
                                if (oData.results.length > 0) {
                                    oData.results.unshift({
                                        PRODUCT_ID: "All",
                                        PROD_DESC: "All",
                                    });
                                }
                            }

                            that.prodModel.setData(oData);
                            that.oProdList.setModel(that.prodModel);

                            for (var i = 0; i < oScheData.length; i++) {
                                that.oProd.addToken(
                                    new sap.m.Token({
                                        key: oScheData[i].Product,
                                        text: oScheData[i].Product,
                                    })
                                );

                                //   25-08-2022
                                if (oJobType === "M") {
                                    if (oScheData[i].modelVersion === "Active") {
                                        that.byId("Midmdlver").setSelectedKey("act");
                                    } else if (oScheData[i].modelVersion === "Simulation") {
                                        that.byId("Midmdlver").setSelectedKey("sim");
                                    }
                                    that.byId("MidType").setSelectedKey(oScheData[i].Type);
                                }

                                if (oJobType === "P") {
                                    if (oScheData[i].modelVersion === "Active") {
                                        that.byId("PidModelVer").setSelectedKey("Active");
                                    } else if (oScheData[i].modelVersion === "Simulation") {
                                        that.byId("PidModelVer").setSelectedKey("Simulation");
                                    }
                                    that.byId("PidType").setSelectedKey(oScheData[i].Type);
                                }

                                // 25-08-2022

                                if (oScheData[i].override === true) {
                                    if (oJobType === "M") {
                                        that.byId("MidCheck").setSelected(true);
                                    }

                                    if (oJobType === "P") {
                                        that.byId("PidCheck").setSelected(true);
                                    }
                                } else if (oScheData[i].override === false) {
                                    if (oJobType === "M") {
                                        that.byId("MidCheck").setSelected(false);
                                    }

                                    if (oJobType === "P") {
                                        that.byId("PidCheck").setSelected(false);
                                    }
                                }
                            }

                            that.oLoc.setValue(oScheData[0].Location);
                            if (that.oGModel.getProperty("/JobType") === "M") {
                                that.oPredProfile.setValue(oScheData[0].profile);
                            } else if (that.oGModel.getProperty("/JobType") === "P") {
                                that.oVer.setValue(oScheData[0].version);
                                that.oScen.setValue(oScheData[0].scenario);
                            }
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                    // 07-09-2022
                } else if (
                    ExportFlag === "X" ||
                    that.oGModel.getProperty("/JobType") === "A" ||
                    that.oGModel.getProperty("/JobType") === "O"
                ) {
                    // 07-09-2022
                    // Calling sercive to get the Product list
                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                oScheData.LOCATION_ID
                            ),
                        ],
                        success: function (oData) {
                            that.prodModel.setData(oData);
                            that.oProdList.setModel(that.prodModel);
                            that.oProd.setValue(oScheData.PRODUCT_ID);
                            that.oLoc.setValue(oScheData.LOCATION_ID);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });
                } else if (that.oGModel.getProperty("/JobType") === "S") {
                    that.byId("idSdi").setEnabled(false);
                    switch (sServiceText) {
                        case "ImportECCLoc":
                            that.byId("LO").setSelected(true);
                            break;
                        case "ImportECCCustGrp":
                            that.byId("CG").setSelected(true);
                            break;
                        case "ImportECCProd":
                            that.byId("PR").setSelected(true);
                            break;
                        case "ImportECCLocProd":
                            that.byId("LP").setSelected(true);
                            break;
                        case "ImportECCProdClass":
                            that.byId("PC").setSelected(true);
                            break;
                        case "ImportECCBOM":
                            that.byId("BH").setSelected(true);
                            break;
                        case "ImportECCBomod":
                            that.byId("BO").setSelected(true);
                            break;
                        case "ImportECCODhdr":
                            that.byId("OH").setSelected(true);
                            break;
                        case "ImportECCClass":
                            that.byId("CL").setSelected(true);
                            break;
                        case "ImportECCChar":
                            that.byId("CH").setSelected(true);
                            break;
                        case "ImportECCCharval":
                            that.byId("CV").setSelected(true);
                            break;
                        case "ImportECCSalesh":
                            that.byId("SH").setSelected(true);
                            break;
                        case "ImportECCSaleshCfg":
                            that.byId("SC").setSelected(true);
                            break;
                        case "ImportECCAsmbcomp":
                            that.byId("AC").setSelected(true);
                            break;
                        case "ImportCuvtabInd":
                            that.byId("VT").setSelected(true);
                            break;
                        case "ImportCIRLog":
                            that.byId("CIL").setSelected(true);
                            break;
                        case "ImportSOStock":
                            that.byId("SS").setSelected(true);
                            break;
                        case "ImportPartialProd":
                            that.byId("PP").setSelected(true);
                            break;
                        case "ImportPVSNode":
                            that.byId("PVN").setSelected(true);
                            break;
                        case "ImportPVSBOM":
                            that.byId("PVB").setSelected(true);
                            break;
                        default:
                            break;
                    }
                }
                // }
            },

            /**
             * This function is called when we updating the Ibp Integration .
             * @param {object} oEvent -the event information.
             */
            IBPjobUpdate: function () {
                var selRadioBt = that.byId("idRbtnExport").getSelectedButton().getText();
                // 22-09-2022
                that.byId("IBPimport").setVisible(false);
                that.byId("IBPProdExport").setVisible(false);
                that.byId("IBPClassExport").setVisible(false);
                that.byId("IBPSalesHisExport").setVisible(false);
                that.byId("IBPActCompDemandExport").setVisible(false);
                that.byId("IBPMktAuthExport").setVisible(false);
                that.byId("IBPCompReqQtyExport").setVisible(false);
                that.byId("IBPCIRExport").setVisible(false);
                if (that.byId("idJobType").getSelectedKey() === "E") {
                    var aData = that.oGModel.getProperty("/aScheUpdate").data;
                    var oScheData = $.parseJSON(aData);
                    switch (selRadioBt) {
                        case "Product":
                            that.oLoc = that.byId("EPlocInput");
                            that.byId("IBPProdExport").setVisible(true);
                            break;
                        case "Class":
                            that.oClass = this.byId("IBPclassInput");
                            that.byId("IBPClassExport").setVisible(true);
                            break;
                        case "Sales History":
                            that.oLoc = this.byId("ESHlocInput");
                            that.oProd = this.byId("ESHprodInput");
                            that.oCust = this.byId("ECust");
                            that.byId("IBPSalesHisExport").setVisible(true);
                            break;
                        case "Actual Components Demand":
                            that.oLoc = this.byId("EACDemandlocInput");
                            that.oProd = this.byId("EACDemandprodInput");
                            that.byId("IBPActCompDemandExport").setVisible(true);
                            break;
                        case "Market Authorizations":
                            that.oLoc = this.byId("EMktAuthlocInput");
                            that.oProd = this.byId("EMktAuthprodInput");
                            that.byId("IBPMktAuthExport").setVisible(true);
                            break;
                        case "Assembly Requirement Quantity":
                            that.oLoc = this.byId("ECRQtylocInput");
                            that.oProd = this.byId("ECRQtyprodInput");
                            that.oDateRange = this.byId("ECRQtyDate");
                            that.byId("IBPCompReqQtyExport").setVisible(true);
                            break;
                        case "Forecast Demand":
                            that.oLoc = this.byId("ECIRlocInput");
                            that.oProd = this.byId("ECIRprodInput");
                            that.byId("IBPCIRExport").setVisible(true);
                            break;
                        case "Restrictions":
                            that.oLoc = this.byId("ERestlocInput");
                            that.byId("IBPRestriExport").setVisible(true);
                            break;
                        case "Restriction Likelihood":
                            that.oLoc = this.byId("EReLiHlocInput");
                            that.oProd = this.byId("EReLiHprodInput");
                            that.byId("IBPResLikhoodExport").setVisible(true);
                            break;
                        default:
                            break;
                    }
                    // 22-09-2022
                }
            },

            /**
             * This function called when job type is IBP integration import or export.
             * @param {object} oEvent -the event information.
             */
            onIBPSelect: function (oEvent) {
                // 06-10-2022
                var seleKey = that.byId("idIBPselect").getNavigationList().getSelectedKey();
                // 06-10-2022
                if (
                    that.oGModel.getProperty("/newSch") !== "X" &&
                    that.oGModel.getProperty("/UpdateSch") !== "X"
                ) {
                    if (seleKey === "I") {
                        that.byId("idRbtnImport").setVisible(true);
                        that.byId("idRbtnExport").setVisible(false);
                        that.byId("IBPimport").setVisible(true);
                        that.byId("IBPProdExport").setVisible(false);
                        that.byId("IBPClassExport").setVisible(false);
                        that.byId("IBPSalesHisExport").setVisible(false);
                        that.byId("IBPActCompDemandExport").setVisible(false);
                        that.byId("IBPMktAuthExport").setVisible(false);
                        that.byId("IBPCompReqQtyExport").setVisible(false);
                        // 22-09-2022
                        that.byId("IBPCIRExport").setVisible(false);
                        // 22-09-2022
                    } else if (seleKey === "E") {
                        that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPLoc"));
                        that.byId("idRbtnImport").setVisible(false);
                        that.byId("idRbtnExport").setVisible(true);
                        that.byId("IBPimport").setVisible(false);
                        that.byId("IBPimport").setVisible(false);
                        that.byId("IBPProdExport").setVisible(false);
                        that.byId("IBPClassExport").setVisible(false);
                        that.byId("IBPSalesHisExport").setVisible(false);
                        that.byId("IBPActCompDemandExport").setVisible(false);
                        that.byId("IBPMktAuthExport").setVisible(false);
                        that.byId("IBPCompReqQtyExport").setVisible(false);
                        that.byId("IBPCIRExport").setVisible(false);
                    }
                } else {
                    var sServiceText = that.oGModel.getProperty("/IBPService");
                    that.byId("idRbtnImport").setVisible(false);
                    that.byId("idRbtnExport").setVisible(false);
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                    // that.byId("IBPSalesHisConfigExport").setVisible(false);
                    that.byId("IBPActCompDemandExport").setVisible(false);
                    that.byId("IBPMktAuthExport").setVisible(false);
                    that.byId("IBPCompReqQtyExport").setVisible(false);
                    // 22-09-2022
                    that.byId("IBPCIRExport").setVisible(false);
                    // 22-09-2022

                    switch (sServiceText) {
                        case "generateFDemandQty":
                            that.byId("IBPimport").setVisible(true);
                            break;
                        case "exportIBPLocation":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPLoc"));
                            break;
                        case "exportIBPCustomer":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPCustGrp"));
                            break;
                        case "exportIBPMasterProd":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPProd"));
                            that.byId("IBPProdExport").setVisible(true);
                            break;
                        case "exportIBPClass":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPClass"));
                            that.byId("IBPClassExport").setVisible(true);
                            break;
                        case "exportIBPSalesTrans":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPSalesHis"));
                            that.byId("IBPSalesHisExport").setVisible(true);
                            break;
                        case "exportActCompDemand":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPActCompDemd"));
                            that.byId("IBPActCompDemandExport").setVisible(true);
                            break;
                        case "exportMktAuth":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idMarketAuth"));
                            that.byId("IBPMktAuthExport").setVisible(true);
                            break;
                        case "exportComponentReq":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPCompReqQty"));
                            that.byId("IBPCompReqQtyExport").setVisible(true);
                            break;
                        // 22-09-2022
                        case "exportIBPCIR":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPExCIR"));
                            that.byId("IBPCIRExport").setVisible(true);
                            break;
                        case "exportRestrDetails":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idRestri"));
                            that.byId("IBPRestriExport").setVisible(true);
                            break;
                        case "exportRestrReq":
                            that.byId("idRbtnExport").setSelectedButton(that.byId("idResLikhood"));
                            that.byId("IBPResLikhoodExport").setVisible(true);
                            break;
                        default:
                            break;
                    }
                    // 22-09-2022

                    if (
                        sServiceText === "generateFDemandQty"
                    ) {
                        that.byId("idIBPselect").getNavigationList().setSelectedKey("I")
                        that.byId("idRbtnImport").setVisible(true);
                    } else {
                        that.byId("idIBPselect").getNavigationList().setSelectedKey("E")
                        that.byId("idRbtnExport").setVisible(true);
                        // Calling service when IBP Integration Export process is selected
                        that.IBPjobUpdate();
                    }
                }
            },

            /**
             * This function is called when we change the radio button in IBP Itegration.
             * @param {object} oEvent -the event information.
             */
            ExportRadioChange: function (oEvent) {
                var selRadioBt = that.byId("idRbtnExport").getSelectedButton().getText();
                that.byId("IBPimport").setVisible(false);
                that.byId("IBPProdExport").setVisible(false);
                that.byId("IBPClassExport").setVisible(false);
                that.byId("IBPSalesHisExport").setVisible(false);
                that.byId("IBPActCompDemandExport").setVisible(false);
                that.byId("IBPMktAuthExport").setVisible(false);
                that.byId("IBPCompReqQtyExport").setVisible(false);
                that.byId("IBPCIRExport").setVisible(false);
                that.byId("IBPRestriExport").setVisible(false);
                that.byId("IBPResLikhoodExport").setVisible(false);
                var update = that.oGModel.getProperty("/UpdateSch");

                // 22-09-2022
                switch (selRadioBt) {
                    case "Product":
                        that.oLoc = that.byId("EPlocInput");
                        that.byId("IBPProdExport").setVisible(true);
                        break;
                    case "Class":
                        that.oClass = this.byId("IBPclassInput");
                        that.byId("IBPClassExport").setVisible(true);
                        break;
                    case "Sales History":
                        that.oLoc = this.byId("ESHlocInput");
                        that.oProd = this.byId("ESHprodInput");
                        that.oCust = this.byId("ECust");
                        that.byId("IBPSalesHisExport").setVisible(true);
                        if (update !== "X") {
                            that.oProd.removeAllTokens();
                        }
                        break;
                    case "Actual Components Demand":
                        that.oLoc = this.byId("EACDemandlocInput");
                        that.oProd = this.byId("EACDemandprodInput");
                        that.byId("IBPActCompDemandExport").setVisible(true);
                        if (update !== "X") {
                            that.oProd.removeAllTokens();
                        }
                        break;
                    case "Market Authorizations":
                        that.oLoc = this.byId("EMktAuthlocInput");
                        that.oProd = this.byId("EMktAuthprodInput");
                        that.byId("IBPMktAuthExport").setVisible(true);
                        if (update !== "X") {
                            that.oProd.removeAllTokens();
                        }
                        break;
                    case "Assembly Requirement Quantity":
                        that.oLoc = this.byId("ECRQtylocInput");
                        that.oProd = this.byId("ECRQtyprodInput");
                        that.oDate = this.byId("ECRQtyDate");
                        that.byId("IBPCompReqQtyExport").setVisible(true);
                        break;
                    case "Forecast Demand":
                        that.oLoc = this.byId("ECIRlocInput");
                        that.oProd = this.byId("ECIRprodInput");
                        that.byId("IBPCIRExport").setVisible(true);
                        if (update !== "X") {
                            that.oProd.removeAllTokens();
                        }
                        break;
                    case "Restrictions":
                        that.oLoc = this.byId("ERestlocInput");
                        that.byId("IBPRestriExport").setVisible(true);
                        break;
                    case "Restriction Likelihood":
                        that.oLoc = this.byId("EReLiHlocInput");
                        that.oProd = this.byId("EReLiHprodInput");
                        that.byId("IBPResLikhoodExport").setVisible(true);
                        if (update !== "X") {
                            that.oProd.removeAllTokens();
                        }
                        break;
                    default:
                        break;
                }

                if (that.oGModel.getProperty("/UpdateSch") !== "X") {

                    that.byId("EPlocInput").setValue();

                    that.byId("IBPclassInput").setValue();

                    that.byId("ESHlocInput").setValue();
                    that.byId("ESHprodInput").setValue();
                    that.byId("ECust").setValue();


                    that.byId("EACDemandlocInput").setValue();
                    that.byId("EACDemandprodInput").setValue();
                    that.byId("EACDemandidCheck").setSelected(false);

                    that.byId("EMktAuthlocInput").setValue();
                    that.byId("EMktAuthprodInput").setValue();

                    that.byId("ECRQtylocInput").setValue();
                    that.byId("ECRQtyprodInput").setValue();
                    that.byId("ECRQtyDate").setValue();
                    that.byId("ECRQtyidCheck").setSelected(false);

                    that.byId("ECIRlocInput").setValue();
                    that.byId("ECIRprodInput").setValue();

                    that.byId("ERestlocInput").setValue();

                    that.byId("EReLiHlocInput").setValue();
                    that.byId("EReLiHprodInput").setValue();
                }

                // 22-09-2022
            },
            /** 
             ** Validation for Date time
             */

            fixDate: function () {
                var currDate = new Date();
                that.oJSTime = sap.ui.getCore().byId("idSTime");
                that.oJETime = sap.ui.getCore().byId("idETime");
                that.oSchTime = sap.ui.getCore().byId("idSchTime");
                that.oSSTime = sap.ui.getCore().byId("idSSTime");
                that.oSETime = sap.ui.getCore().byId("idSETime");
                that.oJSTime.setMinDate(currDate);
                that.oJETime.setMinDate(currDate);
                that.oSchTime.setMinDate(currDate);
                that.oSSTime.setMinDate(currDate);
                that.oSETime.setMinDate(currDate);

            },

            // 07-09-2022-1
            onExecute: function (oEvent) {
                var buttonSel = oEvent.getSource().getText();
                var keySel = that.byId("idJobType").getSelectedKey();
                // var IBPinteg = that.byId("idIBPselect").getSelectedKey();
                var exeJobName;

                if (keySel === "I") {
                    exeJobName = that.byId("idJobType").getItem().getSelectedItem().getText();
                    that.oGModel.setProperty("/Jobname", exeJobName);
                } else if (keySel === "E") {
                    var Key = that.byId("idRbtnExport").getSelectedButton().getText();

                    switch (Key) {

                        case "Actual Components Demand":
                            exeJobName = that.byId("idJobType").getItem().getSelectedItem().getText() + " " + "ActComp Demand";
                            break;
                        case "Assembly Requirement Quantity":
                            exeJobName = that.byId("idJobType").getItem().getSelectedItem().getText() + " " + "AsmbyReq Qty";
                            break;
                        default:
                            exeJobName = that.byId("idJobType").getItem().getSelectedItem().getText() + " " + that.byId("idRbtnExport").getSelectedButton().getText();
                            break;
                    }



                    that.oGModel.setProperty("/Jobname", exeJobName);

                } else {
                    that.oGModel.setProperty("/Jobname", that.byId("idJobType").getItem().getSelectedItem().getText());
                    this.oGModel.setProperty("/JobDdesc", that.byId("idJobType").getItem().getSelectedItem().getText());
                }


                if (buttonSel === "Schedule Job") {
                    that.oGModel.setProperty("/EcecuteType", "S");
                } else if (buttonSel === "Execute") {
                    that.oGModel.setProperty("/EcecuteType", "E");
                }


                switch (keySel) {
                    case "M":
                        that.onModelGen();
                        break;
                    case "P":
                        that.onPrediction();
                        break;
                    case "T":
                        that.onTimeSeries();
                        break;
                    case "F":
                        that.onTimeSeriesF();
                        break;
                    case "I":
                        that.onIbpJobImport();
                        break;
                    case "E":
                        that.onIbpJobExport();
                        break;
                    case "S":
                        that.onSdiIntegration();
                        break;
                    case "D":
                        that.onFullyDemand();
                        break;
                    case "A":
                        that.onAsmbReq();
                        break;
                    case "O":
                        that.onProcSalesOrd();
                        break;
                    default:
                        break;
                }



            },

            // 07-09-2022-1

            /**
             * This function is called when click on create Job for Model Generation button.
             */
            onModelGen: function () {
                var cSelected = that.byId("MidCheck").getSelected();
                // Changing the button text
                if (that.oGModel.getProperty("/newSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                } else {
                    sap.ui.getCore().byId("idSavebt").setText("Create Job");
                }
                that.oGModel.setProperty("/runText", "Generate Model");

                this.oModel = this.getModel("PModel");
                var oProdItems, oPredProfile, cSelected, oPredProfile, oLocItem, i;
                var oEntry = {
                    vcRulesList: [],
                },
                    vRuleslist,
                    oRuleList = [];
                var oMdlVer = that.byId("Midmdlver").getSelectedKey(),
                    vMdlVer;
                //   25-08-2022
                var oMType = that.byId("MidType").getSelectedKey(),
                    //   25-08-2022
                    oLocItem = that.oLoc.getValue();
                (oProdItems = that.oProd.getTokens()),
                    (oPredProfile = that.oPredProfile.getValue()),
                    (cSelected = that.byId("MidCheck").getSelected());
                if (oMdlVer === "act") {
                    vMdlVer = "Active";
                } else {
                    vMdlVer = "Simulation";
                }

                if (
                    this.oProd.getTokens().length > 0 &&
                    this.oPredProfile.getValue()
                ) {
                    for (i = 0; i < oProdItems.length; i++) {
                        vRuleslist = {
                            profile: oPredProfile,
                            override: cSelected,
                            Location: oLocItem,
                            Product: oProdItems[i].getText(),
                            GroupID: "ALL",
                            // Type: "OD",
                            //   25-08-2022
                            Type: oMType,
                            //   25-08-2022
                            modelVersion: vMdlVer,
                        };
                        oRuleList.push(vRuleslist);
                    }

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }

                    this.oGModel.setProperty("/vcrulesData", oRuleList);

                    var sText = "Do you want to override assignments?";
                    if (cSelected === true) {
                        sap.m.MessageBox.show(sText, {
                            title: "Confirmation",
                            actions: [
                                sap.m.MessageBox.Action.YES,
                                sap.m.MessageBox.Action.NO,
                            ],
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.YES) {
                                    // 07-09-2022-1
                                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                                        that._valueHelpDialogJobDetail.open();
                                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                                        that.onJobTypeChange();
                                        that.onJobCreate();
                                    }
                                    // 07-09-2022-1
                                }
                            },
                        });
                    } else {
                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    }

                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");
                } else {
                    MessageToast.show("Please select all fields");
                }
            },

            /**
             * This function is called when click on create Job for Create Prediction button.
             * @param {object} oEvent -the event information.
             */
            onPrediction: function () {
                var cSelected = that.byId("PidCheck").getSelected();
                if (that.oGModel.getProperty("/newSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                }
                that.oGModel.setProperty("/runText", "Run Prediction");

                this.oModel = this.getModel("PModel");
                var oProdItems,
                    cSelected,
                    oSelModelVer,
                    oSelVer,
                    oLocItem,
                    oSelScen,
                    i;
                var oEntry = {
                    vcRulesList: [],
                },
                    oRuleList = [],
                    vRuleslist,
                    finalList = {};
                oLocItem = that.oLoc.getValue();
                oProdItems = that.oProd.getTokens();
                cSelected = that.byId("PidCheck").getSelected();
                oSelModelVer = this.byId("PidModelVer").getSelectedKey();
                oSelVer = this.oVer.getValue();
                oSelScen = this.oScen.getValue();
                //   25-08-2022
                var oSelType = this.byId("PidType").getSelectedKey();
                //   25-08-2022
                if (
                    this.oProd.getTokens().length > 0 &&
                    this.oVer.getValue() &&
                    this.oScen.getValue()
                ) {
                    for (i = 0; i < oProdItems.length; i++) {
                        vRuleslist = {
                            override: cSelected,
                            Location: oLocItem,
                            Product: oProdItems[i].getText(),
                            GroupID: "ALL",
                            // Type: "OD",
                            //   25-08-2022
                            Type: oSelType,
                            //   25-08-2022
                            modelVersion: oSelModelVer,
                            version: oSelVer,
                            scenario: oSelScen,
                        };
                        oRuleList.push(vRuleslist);
                    }
                    this.oGModel.setProperty("/vcrulesData", oRuleList);

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }

                    var sText = "Do you want to override assignments?";
                    if (cSelected === true) {
                        sap.m.MessageBox.show(sText, {
                            title: "Confirmation",
                            actions: [
                                sap.m.MessageBox.Action.YES,
                                sap.m.MessageBox.Action.NO,
                            ],
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.YES) {
                                    // 07-09-2022-1
                                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                                        that._valueHelpDialogJobDetail.open();
                                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                                        that.onJobTypeChange();
                                        that.onJobCreate();
                                    }
                                    // 07-09-2022-1
                                }
                            },
                        });
                    } else {
                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    }

                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");
                } else {
                    MessageToast.show("Please select all fields");
                }
            },

            /**
             * This function is called when click on create Timeseries button.
             * @param {object} oEvent -the event information.
             */
            onTimeSeries: function () {
                var oProdItem, oLocItem, oPastDays, i;
                // var vRuleslist;
                var oEntry = {
                    vcRulesList: [],
                },
                    oRuleList = {
                        LocProdData: []
                    },
                    vRuleslist;

                oLocItem = that.oLoc.getValue();
                oProdItem = that.oProd.getTokens();

                if (oLocItem) {

                    if (that.oGModel.getProperty("/newSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                    } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                    }
                    that.oGModel.setProperty("/runText", "Time Series History");

                    if (this.oProd.getTokens().length > 0) {
                        for (var i = 0; i < oProdItem.length; i++) {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: oProdItem[i].getText()
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                    } else {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: "ALL"
                        };
                        oRuleList.LocProdData.push(vRuleslist);
                    }
                    this.oGModel.setProperty("/vcrulesData", oRuleList);

                    // this.oGModel.setProperty("/vcrulesData", vRuleslist);
                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");

                    // 07-09-2022-1
                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }
                } else {
                    MessageToast.show("Please select all fields");
                }

            },

            /**
             * This function is called when click on create Timeseries Future button.
             * @param {object} oEvent -the event information.
             */
            onTimeSeriesF: function () {
                var oProdItem, oLocItem;
                // var vRuleslist;
                var
                    // oRuleList = [],
                    oRuleList = {
                        LocProdData: []
                    },
                    vRuleslist;


                oLocItem = that.oLoc.getValue();
                // oProdItem = this.oProd.getValue();
                oProdItem = that.oProd.getTokens();
                if (oLocItem) {

                    that.oGModel.setProperty("/runText", "Time Series Future");
                    if (that.oGModel.getProperty("/newSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                    } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                    }

                    if (this.oProd.getTokens().length > 0) {

                        for (var i = 0; i < oProdItem.length; i++) {

                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: oProdItem[i].getText()
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                    } else {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: "ALL"
                        };
                        oRuleList.LocProdData.push(vRuleslist);
                    }
                    this.oGModel.setProperty("/vcrulesData", oRuleList);


                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");

                    // 07-09-2022-1
                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }
                } else {
                    MessageToast.show("Please select all fields");
                }

            },

            /**
             * This function is called when click on IBP Import button.
             * @param {object} oEvent -the event information.
             */
            onIbpJobImport: function () {
                var aItems,
                    oProdItem,
                    // oSelVer,
                    oLocItem,
                    // oSelScen,
                    fromDate,
                    toDate,
                    rRadioBtn,
                    oRuleList = {
                        LocProdData: []
                    },
                    vRuleslist;

                if (that.oGModel.getProperty("/newSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                }
                oLocItem = that.oLoc.getValue();
                oProdItem = that.oProd.getTokens();

                var nowH = new Date();
                fromDate = nowH.toISOString().split("T")[0];
                toDate = new Date(
                    nowH.getFullYear(),
                    nowH.getMonth(),
                    nowH.getDate() + 180
                );
                toDate = toDate.toISOString().split("T")[0];

                rRadioBtn = that.byId("idRbtnImport").getSelectedButton().getText();

                this.oGModel.setProperty(
                    "/JobDdesc",
                    that.byId("idJobType").getItem().getSelectedItem().getText() +
                    " " +
                    "-" +
                    " " +
                    rRadioBtn
                );

                that.oGModel.setProperty("/runText", rRadioBtn);
                var oRuleList = {
                    LocProdData: []
                },
                    vRuleslist;
                if (oLocItem) {
                    if (this.oProd.getTokens().length > 0) {
                        for (var i = 0; i < oProdItem.length; i++) {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: oProdItem[i].getText()
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                    } else {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: "ALL"
                        };
                        oRuleList.LocProdData.push(vRuleslist);
                    }
                    this.oGModel.setProperty("/vcrulesData", oRuleList);

                    this.oGModel.setProperty("/IbpType", "Import");

                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");

                    // 07-09-2022-1
                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }
                } else {
                    MessageToast.show("Please select location");
                }
            },

            /**
             * This function is called when click on IBP Export button.
             * @param {object} oEvent -the event information.
             */
            onIbpJobExport: function () {
                var oProdItem, oLocItem, oClassNum, oCustGrpItem, i, vRuleslist;

                var oRuleList = {
                    LocProdData: []
                },
                    vRuleslist;

                if (that.oGModel.getProperty("/newSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                }

                var rRadioBtn = that.byId("idRbtnExport").getSelectedButton().getText();
                that.oGModel.setProperty("/runText", rRadioBtn);
                this.oGModel.setProperty("/JobDdesc", that.byId("idJobType").getItem().getSelectedItem().getText() +
                    " " + "-" + " " + rRadioBtn);

                if (
                    that.oGModel.getProperty("/newSch") === "X" ||
                    that.oGModel.getProperty("/UpdateSch") === "X"
                ) {
                    that.jobDataAddSche();
                }
                // Based of selected Export type for IBP Integration filling the data to create or update job
                if (rRadioBtn === "Location" || rRadioBtn === "Customer Group") {
                    // 07-09-2022-1
                    vRuleslist = {};
                    this.oGModel.setProperty("/vcrulesData", vRuleslist);

                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1
                } else if (rRadioBtn === "Product" || rRadioBtn === "Restrictions") {
                    oLocItem = that.oLoc.getValue();
                    if (oLocItem) {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                        };
                        this.oGModel.setProperty("/vcrulesData", vRuleslist);

                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select location");
                    }
                } else if (rRadioBtn === "Class") {
                    oClassNum = that.oClass.getValue();
                    if (oClassNum) {
                        vRuleslist = {
                            CLASS_NUM: oClassNum,
                        };

                        this.oGModel.setProperty("/vcrulesData", vRuleslist);
                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select class");
                    }
                } else if (rRadioBtn === "Sales History") {
                    oLocItem = that.oLoc.getValue();
                    oProdItem = this.oProd.getTokens();
                    oCustGrpItem = "Test";


                    if (oLocItem) {
                        var dDate = new Date().toISOString().split("T")[0];
                        if (this.oProd.getTokens().length > 0) {
                            for (var i = 0; i < oProdItem.length; i++) {
                                vRuleslist = {
                                    LOCATION_ID: oLocItem,
                                    PRODUCT_ID: oProdItem[i].getText(),
                                    CUSTOMER_GROUP: oCustGrpItem,
                                    DOC_DATE: dDate,
                                };
                                oRuleList.LocProdData.push(vRuleslist);
                            }
                        } else {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: "ALL",
                                CUSTOMER_GROUP: oCustGrpItem,
                                DOC_DATE: dDate,
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                        this.oGModel.setProperty("/vcrulesData", oRuleList);

                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select location");
                    }
                } else if (rRadioBtn === "Sales History Config") {
                    oLocItem = that.oLoc.getValue();
                    oProdItem = this.oProd.getValue();
                    oCustGrpItem = "Test";
                    if (oLocItem && oProdItem && oCustGrpItem) {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: oProdItem,
                            CUSTOMER_GROUP: "Test"//oCustGrpItem,
                        };
                        this.oGModel.setProperty("/vcrulesData", vRuleslist);

                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select all fields");
                    }
                } else if (rRadioBtn === "Restriction Likelihood" || rRadioBtn === "Market Authorizations") {
                    oLocItem = that.oLoc.getValue();
                    oProdItem = this.oProd.getTokens();
                    if (oLocItem) {

                        if (this.oProd.getTokens().length > 0) {
                            for (var i = 0; i < oProdItem.length; i++) {
                                vRuleslist = {
                                    LOCATION_ID: oLocItem,
                                    PRODUCT_ID: oProdItem[i].getText()
                                };
                                oRuleList.LocProdData.push(vRuleslist);
                            }
                        } else {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: "ALL"
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                        this.oGModel.setProperty("/vcrulesData", oRuleList);

                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select all fields");
                    }
                } else if (rRadioBtn === "Actual Components Demand") {
                    oLocItem = that.oLoc.getValue();
                    oProdItem = this.oProd.getTokens();
                    if (oLocItem) {
                        var CriticalKey = that.byId("EACDemandidCheck").getSelected();
                        var keyFlag = "";
                        if (CriticalKey) {
                            keyFlag = "X";
                        }

                        if (this.oProd.getTokens().length > 0) {
                            for (var i = 0; i < oProdItem.length; i++) {
                                vRuleslist = {
                                    LOCATION_ID: oLocItem,
                                    PRODUCT_ID: oProdItem[i].getText(),
                                    CRITICALKEY: keyFlag
                                };
                                oRuleList.LocProdData.push(vRuleslist);
                            }
                        } else {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: "ALL",
                                CRITICALKEY: keyFlag
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                        this.oGModel.setProperty("/vcrulesData", oRuleList);


                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select all fields");
                    }
                } else if (rRadioBtn === "Assembly Requirement Quantity") {
                    oLocItem = that.oLoc.getValue();
                    oProdItem = this.oProd.getValue();
                    var vDateRange = that.byId("ECRQtyDate").getValue().split(' To ');
                    var dLow = vDateRange[0],
                        dHigh = vDateRange[1];
                    if (oLocItem && dLow && oProdItem) {
                        var CriticalKey = that.byId("ECRQtyidCheck").getSelected();
                        var keyFlag = "";
                        if (CriticalKey) {
                            keyFlag = "X";
                        }
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: oProdItem,
                            FROMDATE: dLow,
                            TODATE: dHigh,
                            CRITICALKEY: keyFlag
                        };
                        this.oGModel.setProperty("/vcrulesData", vRuleslist);

                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select all fields");
                    }
                    // 22-09-2022
                } else if (rRadioBtn === "Forecast Demand") {
                    oLocItem = that.oLoc.getValue();
                    oProdItem = this.oProd.getTokens();
                    if (oLocItem) {

                        if (this.oProd.getTokens().length > 0) {
                            for (var i = 0; i < oProdItem.length; i++) {
                                vRuleslist = {
                                    LOCATION_ID: oLocItem,
                                    PRODUCT_ID: oProdItem[i].getText()
                                };
                                oRuleList.LocProdData.push(vRuleslist);
                            }
                        } else {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: "ALL"
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                        this.oGModel.setProperty("/vcrulesData", oRuleList);

                        // 07-09-2022-1
                        if (that.oGModel.getProperty("/EcecuteType") === "S") {
                            that._valueHelpDialogJobDetail.open();
                        } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
                    } else {
                        MessageToast.show("Please select all fields");
                    }
                }
                // 22-09-2022
            },

            /*
             * This function is called when click on SDI Integration button.
             * @param {object} oEvent -the event information.
             */
            onSdiIntegration: function () {
                if (that.oGModel.getProperty("/newSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                }
                var oSelKey = that.byId("idSdi").getSelectedButton().getText();
                that.oGModel.setProperty("/runText", oSelKey);
                this.oGModel.setProperty(
                    "/JobDdesc",
                    that.byId("idJobType").getItem().getSelectedItem().getText() + " " + oSelKey
                );

                if (
                    that.oGModel.getProperty("/newSch") === "X" ||
                    that.oGModel.getProperty("/UpdateSch") === "X"
                ) {
                    that.jobDataAddSche();
                }

                var vRuleslist = {};
                this.oGModel.setProperty("/vcrulesData", vRuleslist);

                // 07-09-2022-1
                if (that.oGModel.getProperty("/EcecuteType") === "S") {
                    // sap.ui.getCore().byId("idSSTime").$().find('INPUT').attr('disabled', true);
                    that._valueHelpDialogJobDetail.open();
                } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                    sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                    that.onJobTypeChange();
                    that.onJobCreate();
                }
                // 07-09-2022-1
            },

            handleDateChange: function () {
                sap.ui.getCore().byId("idSSTime").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idSETime").$().find('INPUT').attr('disabled', true);
            },

            // 07-09-2022
            /**
             * This function is called when click on Generate Forecast Order button.
             * @param {object} oEvent -the event information.
             */
            onFullyDemand: function () {
                var oProdItem, oLocItem, i;
                // var vRuleslist;
                var
                    // oRuleList = [],
                    oRuleList = {
                        LocProdData: []
                    },
                    vRuleslist;


                oLocItem = that.oLoc.getValue();
                oProdItem = that.oProd.getTokens();
                if (oLocItem) {

                    if (that.oGModel.getProperty("/newSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                    } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                    }
                    that.oGModel.setProperty("/runText", "Generate Forecast Order");

                    if (this.oProd.getTokens().length > 0) {

                        for (var i = 0; i < oProdItem.length; i++) {
                            vRuleslist = {
                                LOCATION_ID: oLocItem,
                                PRODUCT_ID: oProdItem[i].getText()
                            };
                            oRuleList.LocProdData.push(vRuleslist);
                        }
                    } else {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: "ALL"
                        };
                        oRuleList.LocProdData.push(vRuleslist);
                    }
                    this.oGModel.setProperty("/vcrulesData", oRuleList);


                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");

                    // 07-09-2022-1
                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }
                } else {
                    MessageToast.show("Please select all fields");
                }

            },


            /**
             * This function is called when click on Generate assembly requirements button.
             * @param {object} oEvent -the event information.
             */
            onAsmbReq: function () {
                var oProdItem, oLocItem, i;
                var vRuleslist;

                oLocItem = that.oLoc.getValue();
                oProdItem = that.oProd.getValue();


                if (that.oGModel.getProperty("/newSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                }
                that.oGModel.setProperty("/runText", "Generate assembly requirements");

                if (this.oProd.getValue()) {
                    vRuleslist = {
                        LOCATION_ID: oLocItem,
                        PRODUCT_ID: oProdItem,
                    };

                    this.oGModel.setProperty("/vcrulesData", vRuleslist);
                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");

                    // 07-09-2022-1
                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }
                } else {
                    MessageToast.show("Please select all fields");
                }
            },


            /**
             * This function is called when click on Process sales orders button.
             * @param {object} oEvent -the event information.
             */
            onProcSalesOrd: function () {
                var oProdItem, oLocItem, i;
                var vRuleslist;

                oLocItem = that.oLoc.getValue();
                oProdItem = that.oProd.getValue();

                if (oLocItem) {

                    if (that.oGModel.getProperty("/newSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
                    } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                        sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
                    }
                    that.oGModel.setProperty("/runText", "Process sales orders");

                    if (this.oProd.getValue()) {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: oProdItem,
                        };
                    } else {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: "ALL",
                        };
                    }

                    this.oGModel.setProperty("/vcrulesData", vRuleslist);
                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");

                    // 07-09-2022-1
                    if (that.oGModel.getProperty("/EcecuteType") === "S") {
                        that._valueHelpDialogJobDetail.open();
                    } else if (that.oGModel.getProperty("/EcecuteType") === "E") {
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1

                    if (
                        that.oGModel.getProperty("/newSch") === "X" ||
                        that.oGModel.getProperty("/UpdateSch") === "X"
                    ) {
                        that.jobDataAddSche();
                    }

                } else {
                    MessageToast.show("Please select all fields");
                }

            },


            // 07-09-2022

            /**
             * This function is called when We updating schedule or creating the schedule for the existing Job.
             * @param {object} oEvent -the event information.
             */
            jobDataAddSche: function (oEvent) {
                var oJobData = that.oGModel.getProperty("/Jobdata");

                sap.ui.getCore().byId("idname").setValue(oJobData.name);
                sap.ui.getCore().byId("idname").setEditable(false);

                sap.ui.getCore().byId("idDesc").setValue(oJobData.description);
                sap.ui.getCore().byId("idDesc").setEditable(false);

                if (oJobData.active === true) {
                    sap.ui.getCore().byId("idActive").setSelectedKey("T");
                    sap.ui.getCore().byId("idActive").setEditable(false);
                } else if (oJobData.active === false) {
                    sap.ui.getCore().byId("idActive").setSelectedKey("F");
                    sap.ui.getCore().byId("idActive").setEditable(false);
                }

                sap.ui.getCore().byId("idSTime").setDateValue(new Date(oJobData.startTime));
                sap.ui.getCore().byId("idSTime").setEnabled(false);

                sap.ui.getCore().byId("idETime").setDateValue(new Date(oJobData.endTime));
                sap.ui.getCore().byId("idETime").setEnabled(false);
            },

            /**
             * This function is called when chnaging the Recurring Schedule data.
             */
            onJobTypeChange: function () {
                var selKey = sap.ui.getCore().byId("idJobSchtype").getSelectedKey();
                if (selKey === "Im") {

                    var dDate = new Date();
                    // 07-09-2022-1
                    // var idSchTime = dDate.setMinutes(dDate.getMinutes() + 2);
                    var idSchTime = dDate.setSeconds(dDate.getSeconds() + 20);
                    // 07-09-2022-1
                    var idSETime = dDate.setHours(dDate.getHours() + 2);
                    idSchTime = new Date(idSchTime);
                    idSETime = new Date(idSETime);

                    sap.ui.getCore().byId("idSchTime").setVisible(false);
                    sap.ui.getCore().byId("idCronValues").setVisible(false);

                    sap.ui.getCore().byId("idSSTime").setVisible(false);
                    sap.ui.getCore().byId("idSETime").setVisible(false);

                    sap.ui.getCore().byId("idSchTime").setDateValue(idSchTime);
                    sap.ui.getCore().byId("idSSTime").setDateValue(new Date());
                    sap.ui.getCore().byId("idSETime").setDateValue(idSETime);

                } else if (selKey === "Cr") {
                    sap.ui.getCore().byId("idSchTime").setVisible(false);
                    sap.ui.getCore().byId("idCronValues").setVisible(true);

                    sap.ui.getCore().byId("idSSTime").setVisible(true);
                    sap.ui.getCore().byId("idSETime").setVisible(true);

                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idSSTime").setDateValue();
                    sap.ui.getCore().byId("idSETime").setDateValue();

                }
            },

            /**
             * This function is called after opening the Create Job Details fragment.
             */
            afterOpenJobDetails: function () {

                if (that.oGModel.getProperty("/newSch") !== "X" && that.oGModel.getProperty("/UpdateSch") !== "X") {
                    sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
                    sap.ui.getCore().byId("idSSTime").setVisible(true);
                    sap.ui.getCore().byId("idSETime").setVisible(true);
                }

                if (that.oGModel.getProperty("/UpdateSch") === "X" || that.oGModel.getProperty("/newSch") === "X") {
                    that.onJobTypeChange();
                }
            },

            /**
             * Called when 'Close/Cancel' button in any dialog is pressed.
             */
            onCreateJobClose: function (oEvent) {
                this._oCore.byId("idname").setValue();
                this._oCore.byId("idDesc").setValue();
                this._oCore.byId("idSTime").setValue();
                this._oCore.byId("idETime").setValue();

                this._oCore.byId("idSSTime").setValue();
                this._oCore.byId("idSETime").setValue();

                that.oGModel.setProperty("/runText", "");
                sap.ui.getCore().byId("idSTime").setEnabled(true);
                // if (oEvent) {
                sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
                sap.ui.getCore().byId("idCronValues").setVisible(true);
                sap.ui.getCore().byId("idmnth").setValue();
                sap.ui.getCore().byId("iddate").setValue();
                sap.ui.getCore().byId("idWeek").setSelectedKey("0");
                sap.ui.getCore().byId("idhrs").setValue();
                sap.ui.getCore().byId("idmin").setValue();
                sap.ui.getCore().byId("idSchTime").setVisible(false);
                sap.ui.getCore().byId("idSchTime").setDateValue();
                // }
                that.byId("idIBPselect").setEnabled(true);

                that._valueHelpDialogJobDetail.close();
            },

            /**
             * This function is called when click on create Job.
             * @param {object} oEvent -the event information.
             */
            onJobCreate: function () {
                if (that.oGModel.getProperty("/newSch") !== "X" && that.oGModel.getProperty("/UpdateSch") !== "X") {
                    this._oCore.byId("idSTime").setDateValue(new Date(this._oCore.byId("idSSTime").getDateValue()));
                    this._oCore.byId("idETime").setDateValue(new Date(this._oCore.byId("idSETime").getDateValue()));
                }

                var djSdate = this._oCore.byId("idSTime").getDateValue(),
                    djEdate = this._oCore.byId("idETime").getDateValue(),
                    dsSDate = this._oCore.byId("idSSTime").getDateValue(),
                    dsEDate = this._oCore.byId("idSETime").getDateValue();
                // Updating the Job end date if the latest schedule date is greater then the existing job date
                if (
                    that.oGModel.getProperty("/newSch") === "X" ||
                    that.oGModel.getProperty("/UpdateSch") === "X"
                ) {
                    if (djEdate < dsEDate) {
                        djEdate = dsEDate;

                        var dDate = djEdate.toISOString().split("T"),
                            dTime = dDate[1].split(".")[0];

                        djEdate = dDate[0] + " " + dTime;

                        var oJobUpdateData = that.oGModel.getProperty("/Jobdata");
                        var finalList = {
                            jobId: oJobUpdateData.jobId,
                            name: oJobUpdateData.name,
                            description: oJobUpdateData.description,
                            action: encodeURIComponent(oJobUpdateData.action),
                            httpMethod: "POST",
                            active: oJobUpdateData.active,
                            startTime: oJobUpdateData.startTime,
                            endTime: djEdate,
                        };
                        sap.ui.core.BusyIndicator.show();
                        that.getModel("JModel").callFunction("/updateMLJob", {
                            method: "GET",
                            urlParameters: {
                                jobDetails: JSON.stringify(finalList),
                            },
                            success: function (oData) {
                                that.onCreateSchedule();
                            },
                            error: function (error) {
                                sap.ui.core.BusyIndicator.hide();

                                sap.m.MessageToast.show("Failed to update job details");
                            },
                        });
                    } else {
                        that.onCreateSchedule();
                    }
                } else {
                    that.onCreateSchedule();
                }
            },

            /**
             * This function is called after Job update or create to add or update schedules.
             * @param {object} oEvent -the event information.
             */
            onCreateSchedule: function () {
                var bButton = that.oGModel.getProperty("/runText"),
                    sName = sap.ui.getCore().byId("idname").getValue(),
                    lgTime = new Date().getTimezoneOffset();
                if (
                    that.oGModel.getProperty("/newSch") !== "X" &&
                    that.oGModel.getProperty("/UpdateSch") !== "X"
                ) {
                    this._oCore.byId("idSTime").setDateValue(new Date(this._oCore.byId("idSSTime").getDateValue()));
                    this._oCore.byId("idETime").setDateValue(new Date(this._oCore.byId("idSETime").getDateValue()));
                }

                var djSdate = this._oCore.byId("idSTime").getDateValue(),
                    djEdate = this._oCore.byId("idETime").getDateValue(),
                    dsSDate = this._oCore.byId("idSSTime").getDateValue(),
                    dsEDate = this._oCore.byId("idSETime").getDateValue(),
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
                    JobName = sName + new Date().getTime(),
                    actionText = "";
                djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

                // Getting the schedule recurring details
                var oJobschType = sap.ui.getCore().byId("idJobSchtype").getSelectedKey(),
                    onetime = "",
                    Cron = "";
                if (oJobschType === "Im") {
                    onetime = sap.ui.getCore().byId("idSchTime").getDateValue();
                    Cron = "";
                    if (onetime === null) {
                        onetime = "";
                    }
                } else if (oJobschType === "Cr") {
                    var mnth = sap.ui.getCore().byId("idmnth").getValue(),
                        date = sap.ui.getCore().byId("iddate").getValue(),
                        day = sap.ui.getCore().byId("idWeek").getSelectedKey(),
                        hour = sap.ui.getCore().byId("idhrs").getValue(),
                        min = sap.ui.getCore().byId("idmin").getValue();

                    if (mnth === "") {
                        mnth = "*";
                    } else if (mnth.includes(":")) {
                        mnth = mnth;
                    } else {
                        mnth = "*%2F" + mnth;
                    }
                    if (date === "") {
                        date = "*";
                    } else if (date.includes(":")) {
                        date = date;
                    } else {
                        date = "*%2F" + date;
                    }
                    if (day === "0") {
                        day = "*";
                    } else if (day.includes(":")) {
                        day = day;
                    } else {
                        day = "*%2F" + day;
                    }
                    if (hour === "") {
                        hour = "*";
                    } else {
                        hour = "*%2F" + hour;
                    }
                    if (min === "") {
                        min = "0";
                    } else if (min === "0") {
                        min = min;
                    } else {
                        min = "*/" + min;
                    }
                    // Formating the recurring data
                    Cron = "*" + " " + mnth + " " + date + " " + day + " " + hour + " " + min + " " + "0";


                }

                var oSelJobType = that.byId("idJobType").getSelectedKey();
                // Maintaining the action based on job type selection
                if (oSelJobType === "S") {
                    var sSdiType = that.byId("idSdi").getSelectedButton().getText();
                    switch (sSdiType) {
                        case "Location":
                            actionText = "/sdi/ImportECCLoc";
                            break;
                        case "Customer Group":
                            actionText = "/sdi/ImportECCCustGrp";
                            break;
                        case "Product":
                            actionText = "/sdi/ImportECCProd";
                            break;
                        case "Location Product":
                            actionText = "/sdi/ImportECCLocProd";
                            break;
                        case "Product Class":
                            actionText = "/sdi/ImportECCProdClass";
                            break;
                        case "BOM Header & Obj Dep":
                            actionText = "/sdi/ImportECCBOM";
                            break;
                        case "Object Dep Header":
                            actionText = "/sdi/ImportECCODhdr";
                            break;
                        case "Class & Characteristics":
                            actionText = "/sdi/ImportECCClass";
                            break;
                        case "Sales History":
                            actionText = "/sdi/ImportECCSalesh";
                            break;
                        case "SC":
                            actionText = "/sdi/ImportECCSaleshCfg";
                            break;
                        case "Assembly Components":
                            actionText = "/sdi/ImportECCAsmbcomp";
                            break;
                        case "Variant Table":
                            actionText = "/sdi/ImportCuvtabInd";
                            break;
                        case "Forecast Demand":
                            actionText = "/sdi/ImportCIRLog";
                            break;
                        case "SalesOrder Stock":
                            actionText = "/sdi/ImportSOStock";
                            break;
                        case "Partial Product":
                            actionText = "/sdi/ImportPartialProd";
                            break;
                        case "PVS Node Structure":
                            actionText = "/sdi/ImportPVSNode";
                            break;
                        case "PVS BOM":
                            actionText = "/sdi/ImportPVSBOM";
                            break;
                        default:
                            break;

                    }
                } else {
                    switch (bButton) {
                        case "Run Prediction":
                            actionText = "/pal/genPredictions";
                            break;
                        case "Generate Model":
                            actionText = "/pal/generateModels";
                            break;
                        case "Time Series History":
                            actionText = "/catalog/generateTimeseries";
                            break;
                        case "Time Series Future":
                            actionText = "/catalog/generateTimeseriesF";
                            break;
                        case "IBP Demand":
                            actionText = "/ibpimport-srv/generateFDemandQty";
                            break;
                        case "Location":
                            actionText = "/ibpimport-srv/exportIBPLocation";
                            break;
                        case "Customer Group":
                            actionText = "/ibpimport-srv/exportIBPCustomer";
                            break;
                        case "Product":
                            actionText = "/ibpimport-srv/exportIBPMasterProd";
                            break;
                        case "Class":
                            actionText = "/ibpimport-srv/exportIBPClass";
                            break;
                        case "Sales History":
                            actionText = "/ibpimport-srv/exportIBPSalesTrans";
                            break;
                        case "Actual Components Demand":
                            actionText = "/ibpimport-srv/exportActCompDemand";
                            break;
                        case "Market Authorizations":
                            actionText = "/ibpimport-srv/exportMktAuth";
                            break;
                        case "Assembly Requirement Quantity":
                            actionText = "/ibpimport-srv/exportComponentReq";
                            break;
                        case "Forecast Demand":
                            actionText = "/ibpimport-srv/exportIBPCIR";
                            break;
                        case "Restrictions":
                            actionText = "/ibpimport-srv/exportRestrDetails";
                            break;
                        case "Process sales orders":
                            actionText = "/catalog/genUniqueID";
                            break;
                        case "Generate Forecast Order":
                            actionText = "/catalog/genFullConfigDemand";
                            break;
                        case "Generate assembly requirements":
                            actionText = "/catalog/generateAssemblyReq";
                            break;
                        case "Restriction Likelihood":
                            actionText = "/ibpimport-srv/exportRestrReq";
                            break;
                        default:
                            break;
                    }
                }

                var vcRuleList = this.oGModel.getProperty("/vcrulesData");

                var oJobType = that.byId("idJobType").getSelectedKey();

                // Checking for creating new job/ adding new schedule/ updateing the old schedule
                if (that.oGModel.getProperty("/newSch") === "X") {
                    // Checking the job type and maintaining the final data
                    if (oJobType === "M" || oJobType === "P") {
                        var finalList = {
                            jobId: that.oGModel.getProperty("/Jobdata").jobId,
                            data: {
                                vcRulesList: vcRuleList,
                            },
                            cron: Cron,
                            time: onetime,
                            active: true,
                            startTime: dsSDate,
                            endTime: dsEDate,
                        };
                    } else if (oJobType === "T" || oJobType === "F" || oJobType === "D") {
                        var finalList = {
                            jobId: that.oGModel.getProperty("/Jobdata").jobId,
                            data: {
                                LocProdData: JSON.stringify(vcRuleList.LocProdData),
                            },
                            cron: Cron,
                            time: onetime,
                            active: true,
                            startTime: dsSDate,
                            endTime: dsEDate,
                        };
                    } else {
                        var finalList = {
                            jobId: that.oGModel.getProperty("/Jobdata").jobId,
                            data: vcRuleList,
                            cron: Cron,
                            time: onetime,
                            active: true,
                            startTime: dsSDate,
                            endTime: dsEDate,
                        };
                    }
                    // Calling service to add new schedule
                    that.getModel("JModel").callFunction("/addJobSchedule", {
                        method: "GET",
                        urlParameters: {
                            schedule: JSON.stringify(finalList),
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.addJobSchedule) {
                                sap.m.MessageToast.show("Schedule created successfully");
                            }

                            that.onCreateJobClose();
                            that.onBack();
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            that.onCreateJobClose();
                            sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                        },
                    });
                } else if (that.oGModel.getProperty("/UpdateSch") === "X") {
                    // Checking the job type and maintaining the final data
                    if (oJobType === "M" || oJobType === "P") {
                        var finalList = {
                            jobId: that.oGModel.getProperty("/Jobdata").jobId,
                            scheduleId: that.oGModel.getProperty("/aScheUpdate").scheduleId,
                            data: {
                                vcRulesList: vcRuleList,
                            },
                            cron: Cron,
                            time: onetime,
                            active: true,
                            startTime: dsSDate,
                            endTime: dsEDate,
                        };
                    } else if (oJobType === "T" || oJobType === "F" || oJobType === "D") {
                        var finalList = {
                            jobId: that.oGModel.getProperty("/Jobdata").jobId,
<<<<<<< HEAD
=======
                            // 03-12
>>>>>>> 28572205e8c7de3e81f65a1fa52119e34f364125
                            scheduleId: that.oGModel.getProperty("/aScheUpdate").scheduleId,
                            data: {
                                LocProdData: JSON.stringify(vcRuleList.LocProdData),
                            },
                            cron: Cron,
                            time: onetime,
                            active: true,
                            startTime: dsSDate,
                            endTime: dsEDate,
                        };
                    } else {
                        var finalList = {
                            jobId: that.oGModel.getProperty("/Jobdata").jobId,
                            scheduleId: that.oGModel.getProperty("/aScheUpdate").scheduleId,
                            data: vcRuleList,
                            cron: Cron,
                            time: onetime,
                            active: true,
                            startTime: dsSDate,
                            endTime: dsEDate,
                        };
                    }
                    // Calling service to update the schedule
                    that.getModel("JModel").callFunction("/updateMLJobSchedule", {
                        method: "GET",
                        urlParameters: {
                            schedule: JSON.stringify(finalList),
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.updateMLJobSchedule) {
                                sap.m.MessageToast.show("Schedule updated successfully");
                            }
                            that.onCreateJobClose();
                            that.onBack();
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            that.onCreateJobClose();
                            sap.m.MessageToast.show(
                                that.i18n.getText("Schedule updation failed")
                            );
                        },
                    });
                } else {
                    // filling data to create new job and schedule based on inputs provided
                    if (bButton === "IBP Demand") {
                        var finalList = {
                            name: JobName,
                            description: sap.ui.getCore().byId("idDesc").getValue(),
                            action: encodeURIComponent(actionText),
                            active: true,
                            httpMethod: "POST",
                            startTime: djSdate,
                            endTime: djEdate,
                            createdAt: djSdate,
                            schedules: [{
                                // data: vcRuleList,
                                data: {
                                    LocProdData: JSON.stringify(vcRuleList.LocProdData),
                                },
                                cron: Cron,
                                time: onetime,
                                active: true,
                                startTime: dsSDate,
                                endTime: dsEDate,
                            },],
                        };
                        // Maintaining the final data for IBP and SDI Integration
                    } else if (
                        bButton.includes("Location") ||
                        bButton.includes("Customer") ||
                        bButton.includes("Product") ||
                        bButton.includes("Class") ||
                        bButton.includes("Assembly Requirement") ||
                        bButton === "Restrictions" ||
                        oSelJobType === "S"
                    ) {
                        var finalList = {
                            name: JobName,
                            description: sap.ui.getCore().byId("idDesc").getValue(),
                            action: encodeURIComponent(actionText),
                            active: true,
                            httpMethod: "POST",
                            startTime: djSdate,
                            endTime: djEdate,
                            createdAt: djSdate,
                            schedules: [{
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                active: true,
                                startTime: dsSDate,
                                endTime: dsEDate,
                            },],
                        };
                        // Getting data for Timeseries
                        // 07-09-2022-1
                    } else if (
                        bButton.includes("Sales History") ||
                        bButton.includes("Actual Components") ||
                        bButton.includes("Market Authorizations") ||
                        bButton === "Forecast Demand" ||
                        bButton === "Restrictions" ||
                        bButton.includes("Likelihood")
                    ) {
                        var finalList = {
                            name: JobName,
                            description: sap.ui.getCore().byId("idDesc").getValue(),
                            action: encodeURIComponent(actionText),
                            active: true,
                            httpMethod: "POST",
                            startTime: djSdate,
                            endTime: djEdate,
                            createdAt: djSdate,
                            schedules: [{
                                data: {
                                    LocProdData: JSON.stringify(vcRuleList.LocProdData),
                                },
                                cron: Cron,
                                time: onetime,
                                active: true,
                                startTime: dsSDate,
                                endTime: dsEDate,
                            },],
                        };
                    } else if (bButton.includes("sales orders") || bButton === "Generate assembly requirements") {
                        // 07-09-2022-1
                        var finalList = {
                            name: JobName,
                            description: sap.ui.getCore().byId("idDesc").getValue(),
                            action: encodeURIComponent(actionText),
                            active: true,
                            httpMethod: "POST",
                            startTime: djSdate,
                            endTime: djEdate,
                            createdAt: djSdate,
                            schedules: [{
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                active: true,
                                startTime: dsSDate,
                                endTime: dsEDate,
                            },],
                        };
                    } else if (bButton.includes("Time Series") || bButton === "Generate Forecast Order") {
                        // 07-09-2022-1
                        var LocProdData = vcRuleList;
                        var finalList = {
                            name: JobName,
                            description: sap.ui.getCore().byId("idDesc").getValue(),
                            action: encodeURIComponent(actionText),
                            active: true,
                            httpMethod: "POST",
                            startTime: djSdate,
                            endTime: djEdate,
                            createdAt: djSdate,
                            schedules: [{
                                data: {
                                    LocProdData: JSON.stringify(vcRuleList.LocProdData),
                                },
                                cron: Cron,
                                time: onetime,
                                active: true,
                                startTime: dsSDate,
                                endTime: dsEDate,
                            },],
                        };
                    } else {
                        var finalList = {
                            name: JobName,
                            description: sap.ui.getCore().byId("idDesc").getValue(),
                            action: encodeURIComponent(actionText),
                            active: true,
                            active: true,
                            httpMethod: "POST",
                            startTime: djSdate,
                            endTime: djEdate,
                            schedules: [{
                                data: {
                                    vcRulesList: vcRuleList,
                                },
                                cron: Cron,
                                time: onetime,
                                active: true,
                                startTime: dsSDate,
                                endTime: dsEDate,
                            },],
                        };
                    }

                    that.getModel("JModel").callFunction("/addMLJob", {
                        method: "GET",
                        urlParameters: {
                            jobDetails: JSON.stringify(finalList),
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show(oData.addMLJob + ": Job Created");
                            that.onCreateJobClose();
                            that.onBack();
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            that.onCreateJobClose();
                            sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                        },
                    });
                }
            },
        }
        );
    }
);