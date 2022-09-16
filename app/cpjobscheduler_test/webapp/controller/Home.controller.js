/*global location*/
sap.ui.define(
	[
		"cpapp/cpjobscheduler/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],
	function (BaseController, JSONModel, MessageToast, Filter, FilterOperator) {
		"use strict";
		var that, oGModel;

		return BaseController.extend(
			"cpapp.cpjobscheduler.controller.Home", {
				/**
				 * Called when a controller is instantiated and its View controls (if available) are already created.
				 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
				 */
				onInit: function () {
					that = this;
					// Declaration of JSON models and size limits
					this.listModel = new JSONModel();
					this.JobLogsModel = new JSONModel();
					this.JobDataModel = new JSONModel();
					this.ScheLogModel = new JSONModel();
					this.ScheRunLogModel = new JSONModel();

					this.listModel.setSizeLimit(2000);
					this.JobLogsModel.setSizeLimit(1000);
					this.JobDataModel.setSizeLimit(1000);
					this.ScheLogModel.setSizeLimit(1000);
					// Declaration of Dialogs
					if (!this._valueHelpDialogJobData) {
						this._valueHelpDialogJobData = sap.ui.xmlfragment(
							"cpapp.cpjobscheduler.view.JobData",
							this
						);
						this.getView().addDependent(this._valueHelpDialogJobData);
					}

					if (!this._valueHelpDialogUpdateJob) {
						this._valueHelpDialogUpdateJob = sap.ui.xmlfragment(
							"cpapp.cpjobscheduler.view.UpdateJobDialog",
							this
						);
						this.getView().addDependent(this._valueHelpDialogUpdateJob);
					}

					if (!this._valueHelpDialogScheLog) {
						this._valueHelpDialogScheLog = sap.ui.xmlfragment(
							"cpapp.cpjobscheduler.view.ScheLog",
							this
						);
						this.getView().addDependent(this._valueHelpDialogScheLog);
					}

					if (!this._valueHelpDialogScheRunLog) {
						this._valueHelpDialogScheRunLog = sap.ui.xmlfragment(
							"cpapp.cpjobscheduler.view.RunLogData",
							this
						);
						this.getView().addDependent(this._valueHelpDialogScheRunLog);
					}
				},

				/**
				 * Called after the view has been rendered.
				 * Calling the service to get Data.
				 */
				onAfterRendering: function () {
					oGModel = this.getModel("oGModel");
					that.oList = that.byId("jobList");
					that.oList.removeSelections(true);

					that.getView().byId("headSearch").setValue();

					var nowH = new Date();
					//past 15 days selected date
					var oDateL = new Date(
						nowH.getFullYear(),
						nowH.getMonth(),
						nowH.getDate() - 15
					);
					// Setting the date values to filter the data
					this.byId("idDateRange").setDateValue(oDateL);
					this.byId("idDateRange").setSecondDateValue(nowH);

					that.byId("JobPanel").setExpanded(true);
					that.byId("jobDetailsPanel").setExpanded(false);
					sap.ui.core.BusyIndicator.show();
					that.getModel("JModel").callFunction("/lreadJobs", {
						method: "GET",
						success: function (oData) {
							sap.ui.core.BusyIndicator.hide();
							oData.lreadJobs.value.forEach(function (row) {
								row.jobId = row.jobId.toString();
							}, that);
							oGModel.setProperty("/tableData", oData.lreadJobs.value);
							var aData = [];
							var dDate = that.byId("idDateRange").getValue().split("To");
							var dLow = new Date(dDate[0]),
								dHigh = new Date(dDate[1] + " " + "23:59:59");
							// Filtering data based on selected dates
							for (var i = 0; i < oData.lreadJobs.value.length; i++) {
								var startDate = new Date(oData.lreadJobs.value[i].startTime);
								if (dLow < startDate && dHigh > startDate) {
									aData.push(oData.lreadJobs.value[i]);
								}
							}

							that.listModel.setData({
								results: aData,
							});
							that.oList.setModel(that.listModel);
							that.onSearch();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							MessageToast.show("Failed to get data");
						},
					});
				},

				/**
				 * Called when something is entered into the search field.
				 * @param {object} oEvent -the event information.
				 */
				onSearch: function (oEvent) {
					var sQuery = that.getView().byId("headSearch").getValue(),
						oFilters = [];
					var aFilter = [];

					if (sQuery !== "") {
						var oFilters = new Filter({
							filters: [
								new Filter("jobId", FilterOperator.Contains, sQuery),
								new Filter("name", FilterOperator.Contains, sQuery),
								new Filter("description", FilterOperator.Contains, sQuery),
							],
							and: false,
						});
						aFilter.push(oFilters);
					}

					that.byId("jobList").getBinding("items").filter(aFilter);
				},

				/**
				 * This function is called when click on panel enpand.
				 */
				onPanelExpand: function () {
					var panel = that.byId("JobPanel").getExpanded();
                    

                    var oTableData = that.byId("jobList").getItems();

                    for(var i=0; i < oTableData.length; i++){
                        if(that.oJobId === oTableData[i].getCells()[0].getTitle()){
                            oTableData[i].focus();
                        }

                    }

					// if (panel === true) {
					// 	that.byId("jobList").removeSelections(true);
					// }
				},

				/**
				 * Called when it routes to create job page.
				 * @param {object} oEvent -the event information.
				 */
				onCreateJob: function (oEvent) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("CreateJob", {}, true);
				},

				/**
				 * This function is called when change the dates to get the jobs.
				 * @param {object} oEvent -the event information.
				 */
				handleDateChange: function (oEvent) {
					var tabData = oGModel.getProperty("/tableData");
					var aData = [];
					var dDate = that.byId("idDateRange").getValue().split("To");
					var dLow = new Date(dDate[0]),
						dHigh = new Date(dDate[1] + " " + "23:59:59");
					// Filtering data based on selected dates
					for (var i = 0; i < tabData.length; i++) {
						var startDate = new Date(tabData[i].startTime);
						if (dLow < startDate && dHigh > startDate) {
							aData.push(tabData[i]);
						}
					}

					that.listModel.setData({
						results: aData,
					});
					that.oList.setModel(that.listModel);
					that.onSearch();
					that.byId("JobPanel").setExpanded(true);
					that.byId("jobDetailsPanel").setExpanded(false);
				},

				/**
				 * This function is called when click on any job to get the schedule details.
				 * @param {object} oEvent -the event information.
				 */
				onhandlePress: function (oEvent) {
					oGModel = this.getModel("oGModel");
					var oJobId = oEvent.getParameter("listItem").getCells()[0].getTitle();
                    that.oJobId = oJobId;
					// Setting data to global models
					oGModel.setProperty("/newSch", "");
					oGModel.setProperty("/UpdateSch", "");
					oGModel.setProperty(
						"/Jobdata",
						oEvent.getParameter("listItem").getBindingContext().getObject()
					);

					// Calling service to get the Job details
					that.getModel("JModel").callFunction("/lreadJobDetails", {
						method: "GET",
						urlParameters: {
							jobId: oJobId,
							displaySchedules: true,
						},
						success: function (oData) {
							// Changing the Datetime stamp
							oData.lreadJobDetails.value.schedules.forEach(function (row) {
								if (!oData.lreadJobDetails.value.action.includes("DemandQty")) {
									if (row.time) {
										var dDate = row.time.split("T"),
											tTime = dDate[1].split(".")[0];

										row.time = dDate[0] + " " + tTime;
									}
								} else {
									if (row.time) {
										var dDate = row.time.split("+");
										row.time = dDate[0];
									}
								}
							}, that);

							var aData = oData.lreadJobDetails.value.schedules;
							that.JobLogsModel.setData({
								results: aData,
							});
							that.byId("idJobLogs").setModel(that.JobLogsModel);
							var aJobDetails = oData.lreadJobDetails.value.schedules;

							// Setting Job type to global model based on Job action
							oGModel.setProperty("/aJobDetails", aJobDetails);
							if (oData.lreadJobDetails.value.action.includes("Models")) {
								oGModel.setProperty("/JobType", "M");
							} else if (oData.lreadJobDetails.value.action.includes("Predictions")) {
								oGModel.setProperty("/JobType", "P");
							} else if (
								oData.lreadJobDetails.value.action === "generateTimeseries"
							) {
								oGModel.setProperty("/JobType", "T");
							} else if (
								oData.lreadJobDetails.value.action === "generateTimeseriesF"
							) {
								oGModel.setProperty("/JobType", "F");
							} else if (oData.lreadJobDetails.value.action.includes("sdi")) {
								oGModel.setProperty("/JobType", "S");
								var service = oGModel.getProperty("/Jobdata").action.split("/");
								var length = service.length - 1;
								service = service[length];
								oGModel.setProperty("/IBPService", service);
							} else {
								oGModel.setProperty("/JobType", "I");
								var service = oGModel.getProperty("/Jobdata").action.split("/");
								var length = service.length - 1;
								service = service[length];
								oGModel.setProperty("/IBPService", service);
							}

							that.byId("JobPanel").setExpanded(false);
							that.byId("jobDetailsPanel").setExpanded(true);
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							MessageToast.show("Failed to get data");
						},
					});
				},

				/**
				 * This function is called when click on Schedule Data button to get the data.
				 * @param {object} oEvent -the event information.
				 */
				onScheData: function (oEvent) {
					var aData = oGModel.getProperty("/aJobDetails"),
						ScheData = [];
					// Getting the schedule Id for the selected Job
					var scheduleId = oEvent
						.getSource()
						.getParent()
						.getBindingContext()
						.getObject().scheduleId;
					// Looping through the data to get the data for IBP Integration and SDI Integration
					for (var i = 0; i < aData.length; i++) {
						if (scheduleId === aData[i].scheduleId) {
							if (
								oGModel.getProperty("/JobType") === "I" ||
								oGModel.getProperty("/JobType") === "S"
							) {
								var data = $.parseJSON(aData[i].data);
								var aIData = {
									Location: data.LOCATION_ID,
									Product: data.PRODUCT_ID,
									scenario: data.SCENARIO,
									version: data.VERSION,
									fromdate: data.FROMDATE,
									todate: data.TODATE,
									CUSTOMER_GROUP: data.CUSTOMER_GROUP,
								};
								ScheData.push(aIData);
							} else {
								ScheData = aData[i].data;
								ScheData = $.parseJSON(ScheData);
								ScheData = ScheData.vcRulesList;
							}
						}
					}

					that.JobDataModel.setData({
						results: ScheData,
					});
					sap.ui.getCore().byId("idJobData").setModel(that.JobDataModel);
					// Based on Job type changing the visibility the columns
					if (oGModel.getProperty("/JobType") === "M") {
						sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
						sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
						sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[5]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[6]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[7]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[8]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[9]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[10]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[11]
							.setVisible(false);
					} else if (oGModel.getProperty("/JobType") === "P") {
						sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);
						sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);
						sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);
						sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);
						sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[7]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[8]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[9]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[10]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[11]
							.setVisible(false);
					} else if (oGModel.getProperty("/JobType") === "T") {
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[2]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[3]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[4]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[5]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[6]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[7]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[8]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[9]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[10]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[11]
							.setVisible(true);
					} else if (oGModel.getProperty("/JobType") === "F") {
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[2]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[3]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[4]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[5]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[6]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[7]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[8]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[9]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[10]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[11]
							.setVisible(false);
					} else if (oGModel.getProperty("/JobType") === "I") {
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[0]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[1]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[2]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[3]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[4]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[5]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[6]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[7]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[8]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[9]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[10]
							.setVisible(false);
						sap.ui
							.getCore()
							.byId("idJobData")
							.getColumns()[11]
							.setVisible(false);
					}

					if (
						oGModel.getProperty("/JobType") !== "I" &&
						oGModel.getProperty("/JobType") !== "S"
					) {
						that._valueHelpDialogJobData.open();
					} else {
						var oActionType = oGModel.getProperty("/IBPService");
						var iCount = 0;

						if (
							oActionType === "generateFDemandQty" ||
							oActionType === "generateFCharPlan"
						) {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[0]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[1]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[5]
								.setVisible(false);
							//   sap.ui
							//     .getCore()
							//     .byId("idJobData")
							//     .getColumns()[6]
							//     .setVisible(true);
						} else if (
							oActionType === "exportIBPLocation" ||
							oActionType === "exportIBPCustomer" ||
							oActionType.includes("ImportECC")
						) {
							MessageToast.show(
								"There is no schedule data to display for the selected job type"
							);
							iCount = 1;
						} else if (oActionType === "exportIBPMasterProd") {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[0]
								.setVisible(true);
						} else if (oActionType === "exportIBPClass") {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[7]
								.setVisible(true);
						} else if (oActionType === "exportIBPSalesTrans") {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[0]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[1]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[8]
								.setVisible(true);
						} else if (oActionType === "exportIBPSalesConfig") {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[0]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[1]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[8]
								.setVisible(true);
						} else if (oActionType === "exportComponentReq") {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[0]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[1]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[9]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[10]
								.setVisible(true);
						} else if (oActionType === "exportActCompDemand") {
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[0]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[1]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[9]
								.setVisible(true);
							sap.ui
								.getCore()
								.byId("idJobData")
								.getColumns()[10]
								.setVisible(true);
						}
						if (iCount === 0) {
							that._valueHelpDialogJobData.open();
						}
					}
				},

				/**
				 * This function is called when click on status button to get the job run logs.
				 * @param {object} oEvent -the event information.
				 */
				onSchestatus: function (oEvent) {
					var oJobId = oGModel.getProperty("/Jobdata").jobId,
						oScheId = oEvent
						.getSource()
						.getParent()
						.getBindingContext()
						.getObject().scheduleId;

					sap.ui.core.BusyIndicator.show();
					that.getModel("JModel").callFunction("/lreadJobRunLogs", {
						method: "GET",
						urlParameters: {
							jobId: oJobId,
							scheduleId: oScheId,
							page_size: 50,
							offset: 0,
						},
						success: function (oData) {
							sap.ui.core.BusyIndicator.hide();
							that.ScheLogModel.setData({
								results: oData.lreadJobRunLogs.value,
							});
							sap.ui
								.getCore()
								.byId("idScheLogData")
								.setModel(that.ScheLogModel);
							that._valueHelpDialogScheLog.open();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							MessageToast.show("Failed to get data");
						},
					});
				},

				/**
				 * Called when 'Close/Cancel' button in any dialog is pressed.
				 */
				onScheLogClose: function () {
					that._valueHelpDialogScheLog.close();
				},

				/**
				 * Called when 'Close/Cancel' button in any dialog is pressed.
				 */
				onjobClose: function () {
					that._valueHelpDialogJobData.close();
				},

				/**
				 * This function is called when click on Add Schedule button to add the new schedule to the existing Job.
				 */
				onAddSchedule: function () {
					oGModel.setProperty("/newSch", "X");
					that.onCreateJob();
				},

				/**
				 * This function is called when click on delete button to delete the schedule.
				 */
				onJobDelete: function (oEvent) {
					var oJobId = oEvent
						.getSource()
						.getParent()
						.getBindingContext()
						.getObject().jobId;

					oGModel.setProperty("/DeleteJob", oJobId);

					that.getModel("JModel").callFunction("/ldeleteJob", {
						method: "GET",
						urlParameters: {
							jobId: oJobId,
						},
						success: function (oData) {
							sap.ui.core.BusyIndicator.hide();
							if (oData.ldeleteJob.value.includes("true")) {
								sap.m.MessageToast.show(
									oGModel.getProperty("/DeleteJob") + ": Job Deleted"
								);
							}
							// Calling funtion to get the updated data
							that.onAfterRendering();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageToast.show("Deletion failed");
						},
					});
				},

				/**
				 * This function is called when click on Edit button on Job to edit the job details .
				 * @param {object} oEvent -the event information.
				 */
				onUpdateJob: function (oEvent) {
					var oJobId = oEvent
						.getSource()
						.getParent()
						.getBindingContext()
						.getObject(),
						bActive,
						dStartTime,
						dEndTime;
					oGModel.setProperty("/JobDetailstoUpdate", oJobId);
					oGModel.setProperty("/updatejob", oJobId.jobId);
					oGModel.setProperty("/updatejobDesc", oJobId.description);
					if (oJobId.active === true) {
						bActive = "T";
					} else if (oJobId.active === false) {
						bActive = "F";
					}
					sap.ui.getCore().byId("idUJActive").setSelectedKey(bActive);

					dStartTime = new Date(oJobId.startTime);
					dEndTime = new Date(oJobId.endTime);
					sap.ui.getCore().byId("idUJSTime").setDateValue(dStartTime);
					sap.ui.getCore().byId("idUJETime").setDateValue(dEndTime);

					this._valueHelpDialogUpdateJob.open();
				},

				/**
				 * Called when 'Close/Cancel' button in any dialog is pressed.
				 */
				onUpdateJobClose: function () {
					this._valueHelpDialogUpdateJob.close();
				},

				/**
				 * This function is called when click on Save button to change the job details.
				 */
				onJobUpdateSave: function () {
					var aSelJonDetails = oGModel.getProperty("/JobDetailstoUpdate");
					var bActive = sap.ui.getCore().byId("idUJActive").getSelectedKey(),
						dUPSdate = sap.ui.getCore().byId("idUJSTime").getDateValue(),
						dUJEdate = sap.ui.getCore().byId("idUJETime").getDateValue(),
						tUJStime,
						tUJEtime,
						oJobid = sap.ui.getCore().byId("idUJob").getValue(),
						oJobDesc = sap.ui.getCore().byId("idUJDesc").getValue(),
						action = aSelJonDetails.action,
						name = aSelJonDetails.name;

					dUPSdate = dUPSdate.toISOString().split("T");
					tUJStime = dUPSdate[1].split(":");
					dUJEdate = dUJEdate.toISOString().split("T");
					tUJEtime = dUJEdate[1].split(":");

					dUPSdate =
						dUPSdate[0] + " " + tUJStime[0] + ":" + tUJStime[1] + " " + "+0000";
					dUJEdate =
						dUJEdate[0] + " " + tUJEtime[0] + ":" + tUJEtime[1] + " " + "+0000";

					if (bActive === "T") {
						bActive = true;
					} else if (bActive === "F") {
						bActive = false;
					}
					// Final data which need to update with
					var finalList = {
						jobId: oJobid,
						name: name,
						description: oJobDesc,
						action: encodeURIComponent(action),
						httpMethod: "POST",
						active: bActive,
						startTime: dUPSdate,
						endTime: dUJEdate,
					};

					that.getModel("JModel").callFunction("/lupdateJob", {
						method: "GET",
						urlParameters: {
							jobDetails: JSON.stringify(finalList),
						},
						success: function (oData) {
							sap.ui.core.BusyIndicator.hide();
							if (oData.lupdateJob.value.includes("true")) {
								sap.m.MessageToast.show(
									oGModel.getProperty("/JobDetailstoUpdate").jobId +
									": Job Updated"
								);
							}
							that._valueHelpDialogUpdateJob.close();
							// Calling funtion to get the updated data
							that.onAfterRendering();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							that.onCreateJobClose();
							sap.m.MessageToast.show("Failed to update job details");
						},
					});
				},

				/**
				 * This function is called when click on delete button to delete the schedule.
				 * @param {object} oEvent -the event information.
				 */
				onScheDelete: function (oEvent) {
					var oJobId = oGModel.getProperty("/Jobdata").jobId,
						oScheId = oEvent
						.getSource()
						.getParent()
						.getBindingContext()
						.getObject().scheduleId;

					oGModel.setProperty("/DeleteSchJob", oJobId);
					oGModel.setProperty("/DeleteSch", oScheId);

					var finalList = {
						jobId: oJobId,
						scheduleId: oScheId,
					};

					that.getModel("JModel").callFunction("/ldeleteMLJobSchedule", {
						method: "GET",
						urlParameters: {
							scheduleDetails: JSON.stringify(finalList),
						},
						success: function (oData) {
							sap.ui.core.BusyIndicator.hide();
							if (oData.ldeleteMLJobSchedule.value.includes("true")) {
								sap.m.MessageToast.show(
									oGModel.getProperty("/DeleteSch") + ": Schedule Deleted"
								);
							}
							// Calling funtion to get the updated data
							that.onAfterRendering();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageToast.show("Deletion failed");
						},
					});
				},

				/**
				 * This function is called when click on schedule update to update the schedule data.
				 * @param {object} oEvent -the event information.
				 */
				onScheUpdate: function (oEvent) {
					var oJobId = oGModel.getProperty("/Jobdata").jobId,
						oScheId = oEvent
						.getSource()
						.getParent()
						.getBindingContext()
						.getObject().scheduleId,
						aData = oGModel.getProperty("/aJobDetails");

					for (var i = 0; i < aData.length; i++) {
						if (oScheId === aData[i].scheduleId) {
							oGModel.setProperty("/aScheUpdate", aData[i]);
						}
					}

					oGModel.setProperty("/UpdateSch", "X");
					that.onCreateJob();
				},

				onRunlogs: function (oEvent) {
					var oJobId = oGModel.getProperty("/Jobdata").jobId,
						oScheId = oEvent.getSource().getParent().getBindingContext().getObject().scheduleId;

					// Calling service to get the Job details
					that.getModel("JModel").callFunction("/lreadJobRunLogs", {
						method: "GET",
						urlParameters: {
							jobId: oJobId,
							scheduleId: oScheId,
							page_size: 50,
							offset: 0,
						},
						success: function (oData) {
							that.runLog = $.parseJSON(oData.lreadJobRunLogs.value[0].runText);

							that.ScheRunLogModel.setData({
								results: that.runLog,
							});
							sap.ui.getCore().byId("idScheRunLogData").setModel(that.ScheRunLogModel);
							that._valueHelpDialogScheRunLog.open();
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
							MessageToast.show("Failed to get data");
						},
					});

				},
				onScheRunLogClose: function () {
					that._valueHelpDialogScheRunLog.close();
				}

			}
		);
	}
);