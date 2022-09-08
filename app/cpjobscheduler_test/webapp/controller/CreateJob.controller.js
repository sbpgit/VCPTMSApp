/*global location*/
sap.ui.define(
	[
		"cpapp/cpjobscheduler/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
	],
	function (
		BaseController,
		JSONModel,
		MessageToast,
		MessageBox,
		Filter,
		FilterOperator
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
					// calling function to select the Job Type
					that.fixDate();
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
						if (key === "M") {
							that.byId("modelGenPanel").setVisible(true);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (key === "P") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(true);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (key === "T") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(true);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (key === "F") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(true);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (key === "I") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(true);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (key === "S") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(true);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "D") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(true);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "A") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(true);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "O") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(true);
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
						that.byId("modelGenPanel").setVisible(true);
						that.byId("PredPanel").setVisible(false);
						that.byId("timeSeriesPanel").setVisible(false);
						that.byId("timeSeriesFPanel").setVisible(false);
						that.byId("IbpPanel").setVisible(false);
						that.byId("sdiPanel").setVisible(false);
                        // 07-09-2022
                        that.byId("FullDemandPanel").setVisible(false);
						that.byId("AsmblyReqPanel").setVisible(false);
                        that.byId("salesOrdPanel").setVisible(false);
                        // 07-09-2022
						that.byId("idJobType").setSelectedKey("M");
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
					oRouter.navTo("Home", {}, true);
				},

				/**
				 * This function is called when we change the Job type.
				 * @param {object} oEvent -the event information.
				 */
                
				onJobSelect: function (oEvent) {
					var oSelJob;
                    
					// Checking for the schedule update or create new schedule or creating new job
					if (that.oGModel.getProperty("/newSch") === "X") {
						oSelJob = that.oGModel.getProperty("/JobType");
						that.byId("idJobType").setSelectedKey(oSelJob);
						if (oSelJob === "I") {
							that.byId("idIBPselect").setEnabled(false);
							that.byId("idRbtnImport").setEnabled(false);
							that.byId("idRbtnExport").setEnabled(false);
						}

						MessageToast.show(
							"you cannot select other Job type when you creating schedule for existing job"
						);
					} else if (that.oGModel.getProperty("/UpdateSch") === "X") {
						oSelJob = that.oGModel.getProperty("/JobType");
						that.byId("idJobType").setSelectedKey(oSelJob);
						if (oSelJob === "I") {
							that.byId("idIBPselect").setEnabled(false);
							that.byId("idRbtnImport").setEnabled(false);
							that.byId("idRbtnExport").setEnabled(false);
						}
						MessageToast.show(
							"you cannot select other Job type when you creating schedule for existing job"
						);
					} else {
						that.byId("idIBPselect").setEnabled(true);
						that.byId("idRbtnImport").setEnabled(true);
						that.byId("idRbtnExport").setEnabled(true);
						oSelJob = that.byId("idJobType").getSelectedKey();
                        // 07-09-2022 
						if (oSelJob === "M") {
							that.byId("modelGenPanel").setVisible(true);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "P") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(true);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "T") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(true);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "F") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(true);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "I") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(true);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
							that.byId("idIBPselect").setSelectedKey("I");
							that.byId("idRbtnImport").setSelectedButton(that.byId("idIBPDemand"));
						} else if (oSelJob === "S") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(true);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "D") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(true);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "A") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(true);
                            that.byId("salesOrdPanel").setVisible(false);
						} else if (oSelJob === "O") {
							that.byId("modelGenPanel").setVisible(false);
							that.byId("PredPanel").setVisible(false);
							that.byId("timeSeriesPanel").setVisible(false);
							that.byId("timeSeriesFPanel").setVisible(false);
							that.byId("IbpPanel").setVisible(false);
							that.byId("sdiPanel").setVisible(false);
                            that.byId("FullDemandPanel").setVisible(false);
							that.byId("AsmblyReqPanel").setVisible(false);
                            that.byId("salesOrdPanel").setVisible(true);
						}

                        // 07-09-2022

						this.oGModel.setProperty(
							"/JobDdesc",
							that.byId("idJobType").getSelectedItem().getText()
						);
					}
					// When we update or creating schdule it will select the values
					if (
						that.oGModel.getProperty("/newSch") === "X" ||
						that.oGModel.getProperty("/UpdateSch") === "X"
					) {
						var sServiceText = that.oGModel.getProperty("/IBPService");

						if (
							sServiceText &&
							that.byId("idJobType").getSelectedKey() === "I"
						) {
							if (
								sServiceText === "generateFDemandQty" ||
								sServiceText === "generateFCharPlan"
							) {
								that.byId("idIBPselect").setSelectedKey("I");
							} else {
								that.byId("idIBPselect").setSelectedKey("E");
							}
						}
						// If selected job type is SDI Integration
						if (oSelJob === "S") {
							var sServiceText = that.oGModel.getProperty("/IBPService");
							that.byId("idSdi").setEnabled(false);
							if (sServiceText === "ImportECCLoc") {
								that.byId("idSdi").setSelectedKey("LO");
							} else if (sServiceText === "ImportECCCustGrp") {
								that.byId("idSdi").setSelectedKey("CG");
							} else if (sServiceText === "ImportECCProd") {
								that.byId("idSdi").setSelectedKey("PR");
							} else if (sServiceText === "ImportECCLocProd") {
								that.byId("idSdi").setSelectedKey("LP");
							} else if (sServiceText === "ImportECCProdClass") {
								that.byId("idSdi").setSelectedKey("PC");
							} else if (sServiceText === "ImportECCBOM") {
								that.byId("idSdi").setSelectedKey("BH");
							} else if (sServiceText === "ImportECCBomod") {
								that.byId("idSdi").setSelectedKey("BO");
							} else if (sServiceText === "ImportECCODhdr") {
								that.byId("idSdi").setSelectedKey("OH");
							} else if (sServiceText === "ImportECCClass") {
								that.byId("idSdi").setSelectedKey("CL");
							} else if (sServiceText === "ImportECCChar") {
								that.byId("idSdi").setSelectedKey("CH");
							} else if (sServiceText === "ImportECCCharval") {
								that.byId("idSdi").setSelectedKey("CV");
							} else if (sServiceText === "ImportECCSalesh") {
								that.byId("idSdi").setSelectedKey("SH");
							} else if (sServiceText === "ImportECCSaleshCfg") {
								that.byId("idSdi").setSelectedKey("SC");
							} else if (sServiceText === "ImportECCAsmbcomp") {
								that.byId("idSdi").setSelectedKey("AC");
							}
						}
					}
					// Calling function to select the import or export for IBP Integration
                    if (oSelJob === "I") {
					    that.onIBPSelect();
                    }
					// If creating new job or adding schedule to job making all values empty
					if (that.oGModel.getProperty("/UpdateSch") !== "X") {
						that.byId("MlocInput").setValue("");
						that.byId("MprodInput").removeAllTokens();
						that.byId("MpmInput").setValue("");

						that.byId("PlocInput").setValue("");
						that.byId("PprodInput").removeAllTokens();
						that.byId("Pidver").setValue("");
						that.byId("Pidscen").setValue("");

						that.byId("TprodInput").setValue("");
						that.byId("TlocInput").setValue("");

						that.byId("TFprodInput").setValue("");
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

						that.byId("ESHConfiglocInput").setValue("");
						that.byId("ESHConfigprodInput").setValue("");
						that.byId("ESHConfigCust").setValue("");

						that.byId("EACDemandlocInput").setValue("");
						that.byId("EACDemandprodInput").setValue("");
						that.byId("EACDemandDate").setDateValue();

						that.byId("ECRQtylocInput").setValue("");
						that.byId("ECRQtyprodInput").setValue("");
						that.byId("ECRQtyDate").setDateValue();

                        // 07-09-2022
                        that.byId("DlocInput").setValue("");
						that.byId("DprodInput").setValue("");

                        that.byId("AlocInput").setValue("");
						that.byId("AprodInput").setValue("");

                        that.byId("OlocInput").setValue("");
						that.byId("OprodInput").setValue("");

                        // 07-09-2022

					}

					// Calling function to set the id of inputs
					that.JobType();
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
								if (oSelJob === "M" || oSelJob === "P") {
									sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
									sap.ui
										.getCore()
										.byId("prodSlctList")
										.setRememberSelections(true);
								} else if (
                                    // 07-09-2022-1
									oSelJob === "T" ||
									oSelJob === "F" ||
									oSelJob === "I" ||
									oSelJob === "D" ||
									oSelJob === "A" ||
									oSelJob === "O"
                                    // 07-09-2022-1
								) {
									sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
									sap.ui
										.getCore()
										.byId("prodSlctList")
										.setRememberSelections(false);
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
					var oJobKey = that.byId("idJobType").getSelectedKey();
					// Changing the Id's based on selected job type
					if (oJobKey === "M") {
						that.oLoc = this.byId("MlocInput");
						that.oProd = this.byId("MprodInput");
						that.oPredProfile = this.byId("MpmInput");
					} else if (oJobKey === "P") {
						that.oLoc = this.byId("PlocInput");
						that.oProd = this.byId("PprodInput");
						that.oVer = this.byId("Pidver");
						that.oScen = this.byId("Pidscen");
					} else if (oJobKey === "T") {
						that.oLoc = this.byId("TlocInput");
						that.oProd = this.byId("TprodInput");
					} else if (oJobKey === "F") {
						that.oLoc = this.byId("TFlocInput");
						that.oProd = this.byId("TFprodInput");
					} else if (oJobKey === "I") {
						if (that.byId("idIBPselect").getSelectedKey() === "I") {
							var rRadioBtn = that
								.byId("idRbtnImport")
								.getSelectedButton()
								.getText();
							that.oLoc = this.byId("IlocInput");
							that.oProd = this.byId("IprodInput");
							//   that.oVer = this.byId("Iidver");
							//   that.oScen = this.byId("Iidscen");
						} else if (that.byId("idIBPselect").getSelectedKey() === "E") {
							that.ExportRadioChange();
						}                         
					} // 07-09-2022
                    else if (oJobKey === "D") {
                        that.oLoc = this.byId("DlocInput");
                        that.oProd = this.byId("DprodInput");
                    } else if (oJobKey === "A") {
                        that.oLoc = this.byId("AlocInput");
                        that.oProd = this.byId("AprodInput");
                    } else if (oJobKey === "O") {
                        that.oLoc = this.byId("OlocInput");
                        that.oProd = this.byId("OprodInput");
                    }

                    // 07-09-2022-1
                    that.oProd.removeAllTokens();
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

						if (oJobType === "M" || oJobType === "P") {
							that.oProd.removeAllTokens();
							this._valueHelpDialogProd
								.getAggregation("_dialog")
								.getContent()[1]
								.removeSelections();
						} else if (that.oProd !== "") {
							that.oProd.setValue("");
						}
						if (oJobType === "P") {
							that.oVer.setValue("");
							that.oScen.setValue("");
						}
						if (oJobType === "I" && that.oCust !== "") {
							that.oCust.setValue("");
						}
						if (oJobType === "T" || oJobType === "F" || oJobType === "I") {
							var oProdItems = sap.ui.getCore().byId("prodSlctList").getItems();
							for (var i = 0; i < oProdItems.length; i++) {
								if (oProdItems[i].getSelected() === true) {
									oProdItems[i].setSelected(false);
								}
							}
						}
						// Calling function to get the products based on selected location
						that.getProducts();

						// Product list
					} else if (sId.includes("prod")) {
						var aSelectedProd;
						that.oProdList.getBinding("items").filter([]);
						aSelectedProd = oEvent.getParameter("selectedItems");
						that.oGModel.setProperty("/Flag", "X");
						if (aSelectedProd && aSelectedProd.length > 0) {
                            // 07-09-2022
							if (oJobType === "T" || oJobType === "F" || oJobType === "I"
                            || oJobType === "D"  || oJobType === "A"  || oJobType === "O") {
								that.oProd.setValue(aSelectedProd[0].getTitle());
							}
                            // 07-09-2022
							if (oJobType === "M" || oJobType === "P") {
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

							if (oJobType === "P" || oJobType === "I") {
								that.getVersion();
							}
						} else {
							if (oJobType === "M" || oJobType === "P") {
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
				getProducts: function (oEvent) {
					var oJobType = that.byId("idJobType").getSelectedKey();

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
							if (oJobType === "M" || oJobType === "P") {
								sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
								sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);
								if (oData.results.length > 0) {
									oData.results.unshift({
										PRODUCT_ID: "All",
										PROD_DESC: "All",
									});
								}
							} else if (
								oJobType === "T" ||
								oJobType === "T" ||
								oJobType === "I"
							) {
								sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
								sap.ui
									.getCore()
									.byId("prodSlctList")
									.setRememberSelections(false);
							}
							that.prodModel.setData(oData);
							that.oProdList.setModel(that.prodModel);
						},
						error: function (oData, error) {
							MessageToast.show("error");
						},
					});
				},

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
					} else if (oJobType === "T" || oJobType === "I") {
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
							that.verModel.setData(oData);
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
							that.scenModel.setData(oData);
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
					var oSelItems = this._valueHelpDialogProd
						.getAggregation("_dialog")
						.getContent()[1]
						.getSelectedItems();
					if (
						oSelected === "All" &&
						oEvent.getParameter("selected") &&
						aItems.length !== 1
					) {
						this._valueHelpDialogProd
							.getAggregation("_dialog")
							.getContent()[1]
							.selectAll();
					} else if (oSelected === "All" && !oEvent.getParameter("selected")) {
						this._valueHelpDialogProd
							.getAggregation("_dialog")
							.getContent()[1]
							.removeSelections();
					} else if (oSelected === "All" && aItems.length === 1) {
						sap.ui
							.getCore()
							.byId("prodSlctList")
							.getItems()[0]
							.setSelected(false);
					} else if (
						oSelected !== "All" &&
						!oEvent.getParameter("selected") &&
						aItems.length - 1 === oSelItems.length
					) {
						sap.ui
							.getCore()
							.byId("prodSlctList")
							.getItems()[0]
							.setSelected(false);
					} else if (
						oSelected !== "All" &&
						oEvent.getParameter("selected") &&
						aItems.length - 1 === oSelItems.length
					) {
						sap.ui
							.getCore()
							.byId("prodSlctList")
							.getItems()[0]
							.setSelected(true);
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
					var sServiceText = that.oGModel.getProperty("/IBPService");

					that.byId("idIBPselect").setEnabled(false);

					if (that.oGModel.getProperty("/JobType") === "I") {
						if (sServiceText.includes("DemandQty") || sServiceText.includes("FCharPlan")) {
							that.byId("idIBPselect").setSelectedKey("I");
							that.byId("idIBPselect").setEnabled(false);
							that.byId("idRbtnImport").setVisible(true);
							that.byId("idRbtnExport").setVisible(false);
                            // 07-09-2022-1
							// that.byId("idbtImport").setVisible(true);
							// that.byId("idbtExport").setVisible(false);
                            // 07-09-2022-1
							that.oLoc.setValue(oScheData.LOCATION_ID);
							that.oProd.setValue(oScheData.PRODUCT_ID);
							that.oVer.setValue(oScheData.VERSION);
							that.oScen.setValue(oScheData.SCENARIO);
							if (sServiceText.includes("DemandQty")) {
								that
									.byId("idRbtnImport")
									.setSelectedButton(that.byId("idIBPDemand"));
							} else {
								that
									.byId("idRbtnImport")
									.setSelectedButton(that.byId("idIBPFutPlan"));
							}
						} else {
							that.byId("idIBPselect").setSelectedKey("E");
							that.byId("idIBPselect").setEnabled(false);
							that.byId("idRbtnImport").setVisible(false);
							that.byId("idRbtnExport").setVisible(true);
                            // 07-09-2022-1
							// that.byId("idbtImport").setVisible(false);
							// that.byId("idbtExport").setVisible(true);
                            // 07-09-2022-1

							if (sServiceText.includes("Location")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPLoc"));
							} else if (sServiceText.includes("Customer")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPCustGrp"));
							} else if (sServiceText.includes("MasterProd")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPProd"));
								that.oLoc.setValue(oScheData.LOCATION_ID);
							} else if (sServiceText.includes("Class")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPClass"));
								that.oClass.setValue(oScheData.CLASS_NUM);
							} else if (sServiceText.includes("SalesTrans")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPSalesHis"));
								that.oLoc.setValue(oScheData.LOCATION_ID);
								that.oProd.setValue(oScheData.PRODUCT_ID);
								that.oCust.setValue(oScheData.CUSTOMER_GROUP);
							} else if (sServiceText.includes("SalesConfig")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPSalesHisConfig"));
								that.oLoc.setValue(oScheData.LOCATION_ID);
								that.oProd.setValue(oScheData.PRODUCT_ID);
								that.oCust.setValue(oScheData.CUSTOMER_GROUP);
							} else if (sServiceText.includes("ActCompDemand")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPActCompDemd"));
								that.oLoc.setValue(oScheData.LOCATION_ID);
								that.oProd.setValue(oScheData.PRODUCT_ID);
							} else if (sServiceText.includes("ComponentReq")) {
								that
									.byId("idRbtnExport")
									.setSelectedButton(that.byId("idIBPCompReqQty"));
								that.oLoc.setValue(oScheData.LOCATION_ID);
								that.oProd.setValue(oScheData.PRODUCT_ID);
							}
						}
						if (sServiceText !== "generateFDemandQty" && sServiceText !== "generateFCharPlan") {
							// Calling service when IBP Integration Export process is selected
							that.IBPjobUpdate();
						}
					} else if (
						that.oGModel.getProperty("/JobType") === "M" ||
						that.oGModel.getProperty("/JobType") === "P"
					) {
						oScheData = oScheData.vcRulesList;
						// Calling sercive to get the Product list
						this.getModel("BModel").read("/getLocProdDet", {
							filters: [
								new Filter(
									"LOCATION_ID",
									FilterOperator.EQ,
									oScheData[0].Location
								),
							],
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
						that.oGModel.getProperty("/JobType") === "T" ||
						that.oGModel.getProperty("/JobType") === "F" ||
                        that.oGModel.getProperty("/JobType") === "D" ||
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
						if (sServiceText === "ImportECCLoc") {
							that.byId("idSdi").setSelectedKey("LO");
						} else if (sServiceText === "ImportECCCustGrp") {
							that.byId("idSdi").setSelectedKey("CG");
						} else if (sServiceText === "ImportECCProd") {
							that.byId("idSdi").setSelectedKey("PR");
						} else if (sServiceText === "ImportECCLocProd") {
							that.byId("idSdi").setSelectedKey("LP");
						} else if (sServiceText === "ImportECCProdClass") {
							that.byId("idSdi").setSelectedKey("PC");
						} else if (sServiceText === "ImportECCBOM") {
							that.byId("idSdi").setSelectedKey("BH");
						} else if (sServiceText === "ImportECCBomod") {
							that.byId("idSdi").setSelectedKey("BO");
						} else if (sServiceText === "ImportECCODhdr") {
							that.byId("idSdi").setSelectedKey("OH");
						} else if (sServiceText === "ImportECCClass") {
							that.byId("idSdi").setSelectedKey("CL");
						} else if (sServiceText === "ImportECCChar") {
							that.byId("idSdi").setSelectedKey("CH");
						} else if (sServiceText === "ImportECCCharval") {
							that.byId("idSdi").setSelectedKey("CV");
						} else if (sServiceText === "ImportECCSalesh") {
							that.byId("idSdi").setSelectedKey("SH");
						} else if (sServiceText === "ImportECCSaleshCfg") {
							that.byId("idSdi").setSelectedKey("SC");
						} else if (sServiceText === "ImportECCAsmbcomp") {
							that.byId("idSdi").setSelectedKey("AC");
						}
					}
				},

				/**
				 * This function is called when we updating the Ibp Integration .
				 * @param {object} oEvent -the event information.
				 */
				IBPjobUpdate: function () {
					var selRadioBt = that
						.byId("idRbtnExport")
						.getSelectedButton()
						.getText();

					if (
						that.byId("idJobType").getSelectedKey() === "I" &&
						that.byId("idIBPselect").getSelectedKey() === "E"
					) {
						if (selRadioBt === "Location" || selRadioBt === "Customer Group") {
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (selRadioBt === "Product") {
							that.oLoc = that.byId("EPlocInput");
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(true);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (selRadioBt === "Class") {
							that.oClass = this.byId("IBPclassInput");
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(true);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (selRadioBt === "Sales History") {
							that.oLoc = this.byId("ESHlocInput");
							that.oProd = this.byId("ESHprodInput");
							that.oCust = this.byId("ECust");
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(true);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (selRadioBt === "Sales History Config") {
							that.oLoc = this.byId("ESHConfiglocInput");
							that.oProd = this.byId("ESHConfigprodInput");
							that.oCust = this.byId("ESHConfigCust");
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(true);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (selRadioBt === "Actual Components Demand") {
							that.oLoc = this.byId("EACDemandlocInput");
							that.oProd = this.byId("EACDemandprodInput");
							that.oDateRange = this.byId("EACDemandDate");
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(true);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (selRadioBt === "Assembly Requirement Quantity") {
							that.oLoc = this.byId("ECRQtylocInput");
							that.oProd = this.byId("ECRQtyprodInput");
							that.oDateRange = this.byId("ECRQtyDate");
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(true);
						}
					}
				},

				/**
				 * This function called when job type is IBP integration import or export.
				 * @param {object} oEvent -the event information.
				 */
				onIBPSelect: function (oEvent) {
					var seleKey = that.byId("idIBPselect").getSelectedKey();
					if (
						that.oGModel.getProperty("/newSch") !== "X" &&
						that.oGModel.getProperty("/UpdateSch") !== "X"
					) {
						if (seleKey === "I") {
							that.byId("idRbtnImport").setVisible(true);
							that.byId("idRbtnExport").setVisible(false);
							that.byId("IBPimport").setVisible(true);
                            // 07-09-2022-1
							// that.byId("idbtImport").setVisible(true);
							that.byId("idRbtnImport").setSelectedButton(that.byId("idIBPDemand"));
							// that.byId("idbtExport").setVisible(false);
                            // 07-09-2022-1
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
							that.byId("IBPSalesHisConfigExport").setVisible(false);
							that.byId("IBPActCompDemandExport").setVisible(false);
							that.byId("IBPCompReqQtyExport").setVisible(false);
						} else if (seleKey === "E") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPLoc"));
							that.byId("idRbtnImport").setVisible(false);
							that.byId("idRbtnExport").setVisible(true);
							that.byId("IBPimport").setVisible(false);
                            // 07-09-2022-1
							// that.byId("idbtImport").setVisible(false);
							// that.byId("idbtExport").setVisible(true);
                            // 07-09-2022-1
							that.byId("IBPimport").setVisible(false);
							that.byId("IBPProdExport").setVisible(false);
							that.byId("IBPClassExport").setVisible(false);
							that.byId("IBPSalesHisExport").setVisible(false);
						}
					} else {
						var sServiceText = that.oGModel.getProperty("/IBPService");
						that.byId("idRbtnImport").setVisible(false);
						that.byId("idRbtnExport").setVisible(false);
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(false);
                        // 07-09-2022-1
						// that.byId("idbtImport").setVisible(false);
						// that.byId("idbtExport").setVisible(false);
                        // 07-09-2022-1

						if (sServiceText === "generateFDemandQty") {
							that.byId("IBPimport").setVisible(true);
							that.byId("idRbtnImport").setSelectedButton(that.byId("idIBPDemand"));
						} else if (sServiceText === "generateFCharPlan") {
							that.byId("IBPimport").setVisible(true);
							that.byId("idRbtnImport").setSelectedButton(that.byId("idIBPFutPlan"));
						} else if (sServiceText === "exportIBPLocation") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPLoc"));
						} else if (sServiceText === "exportIBPCustomer") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPCustGrp"));
						} else if (sServiceText === "exportIBPMasterProd") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPProd"));
							that.byId("IBPProdExport").setVisible(true);
						} else if (sServiceText === "exportIBPClass") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPClass"));
							that.byId("IBPClassExport").setVisible(true);
						} else if (sServiceText === "exportIBPSalesTrans") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPSalesHis"));
							that.byId("IBPSalesHisExport").setVisible(true);
						} else if (sServiceText === "exportIBPSalesConfig") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPSalesHisConfig"));
							that.byId("IBPSalesHisConfigExport").setVisible(true);
						} else if (sServiceText === "exportActCompDemand") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPActCompDemd"));
							that.byId("IBPActCompDemandExport").setVisible(true);
						} else if (sServiceText === "exportComponentReq") {
							that.byId("idRbtnExport").setSelectedButton(that.byId("idIBPCompReqQty"));
							that.byId("IBPCompReqQtyExport").setVisible(true);
						}

						if (
							sServiceText === "generateFDemandQty" ||
							sServiceText === "generateFCharPlan"
						) {
                            // 07-09-2022-1
							// that.byId("idbtImport").setVisible(true);
                            // 
							that.byId("idIBPselect").setSelectedKey("I");
							that.byId("idRbtnImport").setVisible(true);
						} else {
                            // 07-09-2022-1
							// that.byId("idbtExport").setVisible(true);
                            // 07-09-2022-1
							that.byId("idIBPselect").setSelectedKey("E");
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
					var selRadioBt = that
						.byId("idRbtnExport")
						.getSelectedButton()
						.getText();

					if (selRadioBt === "Location" || selRadioBt === "Customer Group") {
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(false);
					} else if (selRadioBt === "Product") {
						that.oLoc = that.byId("EPlocInput");
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(true);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(false);
					} else if (selRadioBt === "Class") {
						that.oClass = this.byId("IBPclassInput");
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(true);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(false);
					} else if (selRadioBt === "Sales History") {
						that.oLoc = this.byId("ESHlocInput");
						that.oProd = this.byId("ESHprodInput");
						that.oCust = this.byId("ECust");
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(true);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(false);
					} else if (selRadioBt === "Sales History Config") {
						that.oLoc = this.byId("ESHConfiglocInput");
						that.oProd = this.byId("ESHConfigprodInput");
						that.oCust = this.byId("ESHConfigCust");
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(true);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(false);
					} else if (selRadioBt === "Actual Components Demand") {
						that.oLoc = this.byId("EACDemandlocInput");
						that.oProd = this.byId("EACDemandprodInput");
						that.oDate = this.byId("EACDemandDate");
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(true);
						that.byId("IBPCompReqQtyExport").setVisible(false);
					} else if (selRadioBt === "Assembly Requirement Quantity") {
						that.oLoc = this.byId("ECRQtylocInput");
						that.oProd = this.byId("ECRQtyprodInput");
						that.oDate = this.byId("ECRQtyDate");
						that.byId("IBPimport").setVisible(false);
						that.byId("IBPProdExport").setVisible(false);
						that.byId("IBPClassExport").setVisible(false);
						that.byId("IBPSalesHisExport").setVisible(false);
						that.byId("IBPSalesHisConfigExport").setVisible(false);
						that.byId("IBPActCompDemandExport").setVisible(false);
						that.byId("IBPCompReqQtyExport").setVisible(true);
					}

					that.byId("EPlocInput").setValue();

					that.byId("IBPclassInput").setValue();

					that.byId("ESHlocInput").setValue();
					that.byId("ESHprodInput").setValue();
					that.byId("ECust").setValue();

					that.byId("ESHConfiglocInput").setValue();
					that.byId("ESHConfigprodInput").setValue();
					that.byId("ESHConfigCust").setValue();

					that.byId("EACDemandlocInput").setValue();
					that.byId("EACDemandprodInput").setValue();
					that.byId("EACDemandDate").setValue();

					that.byId("ECRQtylocInput").setValue();
					that.byId("ECRQtyprodInput").setValue();
					that.byId("ECRQtyDate").setValue();
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
                onExecute:function(oEvent){
                    var buttonSel = oEvent.getSource().getText();
                    var keySel = that.byId("idJobType").getSelectedKey();
                    var IBPinteg = that.byId("idIBPselect").getSelectedKey();


                    if(buttonSel === "Schedule Job"){
                        that.oGModel.setProperty("/EcecuteType", "S");
                    } else if(buttonSel === "Execute"){
                        that.oGModel.setProperty("/EcecuteType", "E");
                    }


                    if(keySel === "M"){
                        that.onModelGen();
                    } else if(keySel === "P"){
                        that.onPrediction();
                    } else if(keySel === "T"){
                        that.onTimeSeries();
                    } else if(keySel === "F"){
                        that.onTimeSeriesF();
                    } else if(keySel === "I"){
                        if(IBPinteg === "I"){
                            that.onIbpJobImport();
                        } else if(IBPinteg === "E"){
                            that.onIbpJobExport();
                        }
                    } else if(keySel === "S"){
                        that.onSdiIntegration();
                    } else if(keySel === "D"){
                        that.onFullyDemand();
                    } else if(keySel === "A"){
                        that.onAsmbReq();
                    } else if(keySel === "O"){
                        that.onProcSalesOrd();
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
						// // 04/07/2022
						// sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						// // 04/07/2022

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
						//   25-08-2022
						oMType = that.byId("MidType").getSelectedKey(),
						//   25-08-2022
						vMdlVer;
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
                                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
										    that._valueHelpDialogJobDetail.open();
                                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
					} else {
						//   // 04/07/2022
						// sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						// // 04/07/2022
					}
					that.oGModel.setProperty("/runText", "Run Prediction");

					this.oModel = this.getModel("PModel");
					var oProdItems,
						cSelected,
						oSelModelVer,
						oSelVer,
						oLocItem,
						oSelScen,
						//   25-08-2022
						oSelType,
						//   25-08-2022
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
					//   25-08-2022
					oSelType = this.byId("PidType").getSelectedKey();
					//   25-08-2022
					oSelVer = this.oVer.getValue();
					oSelScen = this.oScen.getValue();

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
										if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                            that._valueHelpDialogJobDetail.open();
                                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
					var vRuleslist;

					oLocItem = that.oLoc.getValue();
					oProdItem = this.oProd.getValue();
					oPastDays = that.byId("TpastdaysInput").getValue();

					if (that.oGModel.getProperty("/newSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
					} else if (that.oGModel.getProperty("/UpdateSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
					} else {
						//     // 04/07/2022
						//   sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						//   // 04/07/2022
					}
					that.oGModel.setProperty("/runText", "Time Series History");

					if (this.oProd.getValue() && oPastDays) {
						vRuleslist = {
							LOCATION_ID: oLocItem,
							PRODUCT_ID: oProdItem,
							PAST_DAYS: parseInt(oPastDays),
						};

						this.oGModel.setProperty("/vcrulesData", vRuleslist);
						sap.ui.getCore().byId("idSchTime").setDateValue();
						sap.ui.getCore().byId("idmnth").setValue("");
						sap.ui.getCore().byId("iddate").setValue("");
						sap.ui.getCore().byId("idhrs").setValue("");
						sap.ui.getCore().byId("idmin").setValue("");

						// 07-09-2022-1
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
					var vRuleslist;

					oLocItem = that.oLoc.getValue();
					oProdItem = this.oProd.getValue();

					that.oGModel.setProperty("/runText", "Time Series Future");
					if (that.oGModel.getProperty("/newSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
					} else if (that.oGModel.getProperty("/UpdateSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
					} else {
						//     // 04/07/2022
						//   sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						//   // 04/07/2022
					}

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
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
						rRadioBtn;
					var oEntry = {
							vcRulesList: [],
						},
						vRuleslist;

					if (that.oGModel.getProperty("/newSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
					} else if (that.oGModel.getProperty("/UpdateSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
					} else {
						//     // 04/07/2022
						//   sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						//   // 04/07/2022
					}
					oLocItem = that.oLoc.getValue();
					oProdItem = this.oProd.getValue();
					//   oSelVer = that.oVer.getValue();
					//   oSelScen = "";

					var nowH = new Date();
					fromDate = nowH.toISOString().split("T")[0];
					toDate = new Date(
						nowH.getFullYear(),
						nowH.getMonth(),
						nowH.getDate() + 90
					);
					toDate = toDate.toISOString().split("T")[0];

					rRadioBtn = that.byId("idRbtnImport").getSelectedButton().getText();

					this.oGModel.setProperty(
						"/JobDdesc",
						that.byId("idJobType").getSelectedItem().getText() +
						" " +
						"-" +
						" " +
						rRadioBtn
					);

					that.oGModel.setProperty("/runText", rRadioBtn);

					if (
						this.oProd.getValue() //&&
						// this.oVer.getValue() &&
						// this.oScen.getValue()
					) {
						if (rRadioBtn.includes("Demand")) {
							vRuleslist = {
								LOCATION_ID: oLocItem,
								PRODUCT_ID: oProdItem //,
									// VERSION: oSelVer,
									// SCENARIO: oSelScen,
							};
						} else if (rRadioBtn.includes("Future")) {
							vRuleslist = {
								LOCATION_ID: oLocItem,
								PRODUCT_ID: oProdItem,
								// VERSION: oSelVer,
								// SCENARIO: oSelScen,
								FROMDATE: fromDate,
								TODATE: toDate,
							};
						}

						this.oGModel.setProperty("/vcrulesData", vRuleslist);
						this.oGModel.setProperty("/IbpType", "Import");

						sap.ui.getCore().byId("idSchTime").setDateValue();
						sap.ui.getCore().byId("idmnth").setValue("");
						sap.ui.getCore().byId("iddate").setValue("");
						sap.ui.getCore().byId("idhrs").setValue("");
						sap.ui.getCore().byId("idmin").setValue("");

						// 07-09-2022-1
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
				 * This function is called when click on IBP Export button.
				 * @param {object} oEvent -the event information.
				 */
				onIbpJobExport: function () {
					var oProdItem, oLocItem, oClassNum, oCustGrpItem, i, vRuleslist;

					if (that.oGModel.getProperty("/newSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
					} else if (that.oGModel.getProperty("/UpdateSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
					} else {
						//     // 04/07/2022
						//   sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						//   // 04/07/2022
					}

					var rRadioBtn = that
						.byId("idRbtnExport")
						.getSelectedButton()
						.getText();
					that.oGModel.setProperty("/runText", rRadioBtn);
					this.oGModel.setProperty(
						"/JobDdesc",
						that.byId("idJobType").getSelectedItem().getText() +
						" " +
						"-" +
						" " +
						rRadioBtn
					);

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
                        
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                            that.onJobTypeChange();
                            that.onJobCreate();
                        }
                        // 07-09-2022-1
						
					} else if (rRadioBtn === "Product") {
						oLocItem = that.oLoc.getValue();
						if (oLocItem) {
							vRuleslist = {
								LOCATION_ID: oLocItem,
							};
							this.oGModel.setProperty("/vcrulesData", vRuleslist);

							// 07-09-2022-1
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
                                sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                                that.onJobTypeChange();
                                that.onJobCreate();
                            }
                            // 07-09-2022-1
						} else {
							MessageToast.show("Please select all fields");
						}
					} else if (rRadioBtn === "Class") {
						oClassNum = that.oClass.getValue();
						if (oClassNum) {
							vRuleslist = {
								CLASS_NUM: oClassNum,
							};

							this.oGModel.setProperty("/vcrulesData", vRuleslist);
							// 07-09-2022-1
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
                                sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                                that.onJobTypeChange();
                                that.onJobCreate();
                            }
                            // 07-09-2022-1
						} else {
							MessageToast.show("Please select all fields");
						}
					} else if (rRadioBtn === "Sales History") {
						oLocItem = that.oLoc.getValue();
						oProdItem = this.oProd.getValue();
						oCustGrpItem = that.oCust.getValue();
						if (oLocItem && oProdItem && oCustGrpItem) {
							var dDate = new Date().toISOString().split("T")[0];
							vRuleslist = {
								LOCATION_ID: oLocItem,
								PRODUCT_ID: oProdItem,
								CUSTOMER_GROUP: oCustGrpItem,
								DOC_DATE: dDate,
							};
							this.oGModel.setProperty("/vcrulesData", vRuleslist);

							// 07-09-2022-1
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
                                sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                                that.onJobTypeChange();
                                that.onJobCreate();
                            }
                            // 07-09-2022-1
						} else {
							MessageToast.show("Please select all fields");
						}
					} else if (rRadioBtn === "Sales History Config") {
						oLocItem = that.oLoc.getValue();
						oProdItem = this.oProd.getValue();
						oCustGrpItem = that.oCust.getValue();
						if (oLocItem && oProdItem && oCustGrpItem) {
							vRuleslist = {
								LOCATION_ID: oLocItem,
								PRODUCT_ID: oProdItem,
								CUSTOMER_GROUP: oCustGrpItem,
							};
							this.oGModel.setProperty("/vcrulesData", vRuleslist);

							// 07-09-2022-1
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
						oProdItem = this.oProd.getValue();
						var dLow = that.byId("EACDemandDate").getDateValue();
						//   dHigh = that.byId("EACDemandDate").getSecondDateValue();
						if (oLocItem && oProdItem && dLow) {
							var vDateRange = that.byId("EACDemandDate").getValue().split(' To ');
							var dLow = vDateRange[0],
								dHigh = vDateRange[1];

							vRuleslist = {
								LOCATION_ID: oLocItem,
								PRODUCT_ID: oProdItem,
								FROMDATE: dLow,
								TODATE: dHigh,
							};
							this.oGModel.setProperty("/vcrulesData", vRuleslist);

							// 07-09-2022-1
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
						if (oLocItem && oProdItem && dLow) {
							vRuleslist = {
								LOCATION_ID: oLocItem,
								PRODUCT_ID: oProdItem,
								FROMDATE: dLow,
								TODATE: dHigh,
							};
							this.oGModel.setProperty("/vcrulesData", vRuleslist);

							// 07-09-2022-1
							if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                                that._valueHelpDialogJobDetail.open();
                            } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
                                sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                                that.onJobTypeChange();
                                that.onJobCreate();
                            }
                            // 07-09-2022-1
						} else {
							MessageToast.show("Please select all fields");
						}
					}
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
					} else {
						//     // 04/07/2022
						//   sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						//   // 04/07/2022
					}
					var oSelKey = that.byId("idSdi").getSelectedItem().getText();
					that.oGModel.setProperty("/runText", oSelKey);
					this.oGModel.setProperty(
						"/JobDdesc",
						that.byId("idJobType").getSelectedItem().getText() + " " + oSelKey
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
                    if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                        that._valueHelpDialogJobDetail.open();
                    } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
                        sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im");
                        that.onJobTypeChange();
                        that.onJobCreate();
                    }
                    // 07-09-2022-1
				},

                // 07-09-2022
                /**
				 * This function is called when click on Generate Fully configured Demand button.
				 * @param {object} oEvent -the event information.
				 */
				onFullyDemand: function () {
					var oProdItem, oLocItem, oPastDays, i;
					var vRuleslist;

					oLocItem = that.oLoc.getValue();
					oProdItem = that.oProd.getValue();

					if (that.oGModel.getProperty("/newSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
					} else if (that.oGModel.getProperty("/UpdateSch") === "X") {
						sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
					} 
					that.oGModel.setProperty("/runText", "Generate Fully configured Demand");

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
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
					var oProdItem, oLocItem, oPastDays, i;
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
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
					var oProdItem, oLocItem, oPastDays, i;
					var vRuleslist;

					oLocItem = that.oLoc.getValue();
					oProdItem = that.oProd.getValue();

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

						this.oGModel.setProperty("/vcrulesData", vRuleslist);
						sap.ui.getCore().byId("idSchTime").setDateValue();
						sap.ui.getCore().byId("idmnth").setValue("");
						sap.ui.getCore().byId("iddate").setValue("");
						sap.ui.getCore().byId("idhrs").setValue("");
						sap.ui.getCore().byId("idmin").setValue("");

						// 07-09-2022-1
                        if(that.oGModel.getProperty("/EcecuteType") === "S" ){
                            that._valueHelpDialogJobDetail.open();
                        } else if(that.oGModel.getProperty("/EcecuteType") === "E" ){
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
				 * This function is called when changing the Recurring Schedule data.
				 */
				onJobTypeChange: function () {
					var selKey = sap.ui.getCore().byId("idJobSchtype").getSelectedKey();
					if (selKey === "Im") {
						// 04-07-2022
						var dDate = new Date();
						var idSchTime = dDate.setMinutes(dDate.getMinutes() + 2);
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
						// 04-07-2022

					} else if (selKey === "Cr") {
						sap.ui.getCore().byId("idSchTime").setVisible(false);
						sap.ui.getCore().byId("idCronValues").setVisible(true);

						// 04-07-2022
						sap.ui.getCore().byId("idSSTime").setVisible(true);
						sap.ui.getCore().byId("idSETime").setVisible(true);

						sap.ui.getCore().byId("idSchTime").setDateValue();
						sap.ui.getCore().byId("idSSTime").setDateValue();
						sap.ui.getCore().byId("idSETime").setDateValue();
						// 04-07-2022

					}
				},
				// 04-07-2022
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
				// 04-07-2022

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
					if (oEvent) {
						sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
						sap.ui.getCore().byId("idCronValues").setVisible(true);
						sap.ui.getCore().byId("idmnth").setValue();
						sap.ui.getCore().byId("iddate").setValue();
						sap.ui.getCore().byId("idWeek").setSelectedKey("0");
						sap.ui.getCore().byId("idhrs").setValue();
						sap.ui.getCore().byId("idmin").setValue();
						sap.ui.getCore().byId("idSchTime").setVisible(false);
						sap.ui.getCore().byId("idSchTime").setDateValue();
					}
					that.byId("idIBPselect").setEnabled(true);

					that._valueHelpDialogJobDetail.close();
				},

				/**
				 * This function is called when click on create Job.
				 * @param {object} oEvent -the event information.
				 */
				onJobCreate: function () {
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
						dsEDate = this._oCore.byId("idSETime").getDateValue();
					// Updating the Job end date if the latest schedule date is greater then the existing job date
					if (that.oGModel.getProperty("/newSch") === "X" || that.oGModel.getProperty("/UpdateSch") === "X") {
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
							that.getModel("JModel").callFunction("/lupdateJob", {
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
					if (that.oGModel.getProperty("/newSch") !== "X" && that.oGModel.getProperty("/UpdateSch") !== "X") {
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
						actionText;
					djSdate =	djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
					djEdate =	djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
					dsSDate =	dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
					dsEDate =	dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

					// Getting the schedule recurring details
					var oJobschType = sap.ui
						.getCore()
						.byId("idJobSchtype")
						.getSelectedKey(),
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
							min = "*%2F" + min;
						}
						// Formating the recurring data
						Cron =
							"*" +
							" " +
							mnth +
							" " +
							date +
							" " +
							day +
							" " +
							hour +
							" " +
							min +
							" " +
							"0";
					}
					var oSelJobType = that.byId("idJobType").getSelectedKey();
					// Maintaining the action based on job type selection
					if (oSelJobType === "S") {
						var sSdiType = that.byId("idSdi").getSelectedKey();
						if (sSdiType === "LO") {
							actionText = "%2Fsdi%2FImportECCLoc";
						} else if (sSdiType === "CG") {
							actionText = "%2Fsdi%2FImportECCCustGrp";
						} else if (sSdiType === "PR") {
							actionText = "%2Fsdi%2FImportECCProd";
						} else if (sSdiType === "LP") {
							actionText = "%2Fsdi%2FImportECCLocProd";
						} else if (sSdiType === "PC") {
							actionText = "%2Fsdi%2FImportECCProdClass";
						} else if (sSdiType === "BH") {
							actionText = "%2Fsdi%2FImportECCBOM";
						} else if (sSdiType === "BO") {
							actionText = "%2Fsdi%2FImportECCBomod";
						} else if (sSdiType === "OH") {
							actionText = "%2Fsdi%2FImportECCODhdr";
						} else if (sSdiType === "CL") {
							actionText = "%2Fsdi%2FImportECCClass";
						} else if (sSdiType === "CH") {
							actionText = "%2Fsdi%2FImportECCChar";
						} else if (sSdiType === "CV") {
							actionText = "%2Fsdi%2FImportECCCharval";
						} else if (sSdiType === "SH") {
							actionText = "%2Fsdi%2FImportECCSalesh";
						} else if (sSdiType === "SC") {
							actionText = "%2Fsdi%2FImportECCSaleshCfg";
						} else if (sSdiType === "AC") {
							actionText = "%2Fsdi%2FImportECCAsmbcomp";
						}
					} else {
						if (bButton.includes("Prediction")) {
							actionText = "%2Fpal%2FgenPredictions";
						} else if (bButton.includes("Model")) {
							actionText = "%2Fpal%2FgenerateModels";
						} else if (bButton === "Time Series History") {
							actionText = "%2Fcatalog%2FgenerateTimeseries";
						} else if (bButton === "Time Series Future") {
							actionText = "%2Fcatalog%2FgenerateTimeseriesF";
						} else if (bButton === "IBP Demand") {
							actionText = "%2Fibpimport-srv%2FgenerateFDemandQty";
						} else if (bButton === "IBP Future Plan") {
							actionText = "%2Fibpimport-srv%2FgenerateFCharPlan";
						} else if (bButton.includes("Location")) {
							actionText = "%2Fibpimport-srv%2FexportIBPLocation";
						} else if (bButton.includes("Customer")) {
							actionText = "%2Fibpimport-srv%2FexportIBPCustomer";
						} else if (bButton.includes("Product")) {
							actionText = "%2Fibpimport-srv%2FexportIBPMasterProd";
						} else if (bButton.includes("Class")) {
							actionText = "%2Fibpimport-srv%2FexportIBPClass";
						} else if (bButton === "Sales History") {
							actionText = "%2Fibpimport-srv%2FexportIBPSalesTrans";
						} else if (bButton.includes("Sales History Config")) {
							actionText = "%2Fibpimport-srv%2FexportIBPSalesConfig";
						} else if (bButton.includes("Actual Components Demand")) {
							actionText = "%2Fibpimport-srv%2FexportActCompDemand";
						} else if (bButton.includes("Assembly Requirement")) {
							actionText = "%2Fibpimport-srv%2FexportComponentReq";
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
						that.getModel("JModel").callFunction("/laddJobSchedule", {
							method: "GET",
							urlParameters: {
								schedule: JSON.stringify(finalList),
							},
							success: function (oData) {
								sap.ui.core.BusyIndicator.hide();
								if (oData.laddJobSchedule) {
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
						that.getModel("JModel").callFunction("/lupdateMLJobSchedule", {
							method: "GET",
							urlParameters: {
								schedule: JSON.stringify(finalList),
							},
							success: function (oData) {
								sap.ui.core.BusyIndicator.hide();
								if (oData.lupdateMLJobSchedule) {
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
						if (bButton.includes("Demand") || bButton.includes("Future")) {
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
								}, ],
							};
							// Maintaining the final data for IBP and SDI Integration
						} else if (
							bButton.includes("Location") ||
							bButton.includes("Customer") ||
							bButton.includes("Product") ||
							bButton.includes("Class") ||
							bButton.includes("Sales History") ||
							bButton.includes("Sales History Config") ||
							bButton.includes("Actual Components") ||
							bButton.includes("Assembly Requirement") ||
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
								}, ],
							};
							// Getting data for Timeseries
						} else if (bButton.includes("Time")) {
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
								}, ],
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
								}, ],
							};
						}

						that.getModel("JModel").callFunction("/laddMLJob", {
							method: "GET",
							urlParameters: {
								jobDetails: JSON.stringify(finalList),
							},
							success: function (oData) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageToast.show(oData.laddMLJob.value + ": Job Created");
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