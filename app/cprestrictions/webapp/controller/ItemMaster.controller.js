sap.ui.define(
    [
        "cpapp/cprestrictions/controller/BaseController",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/Device",
    ],
    function (
        BaseController,
        MessageToast,
        JSONModel,
        Filter,
        FilterOperator,
        MessageBox,
        Device
    ) {
        "use strict";
        var that, oGModel;

        return BaseController.extend("cpapp.cprestrictions.controller.ItemMaster", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                that.locModel = new JSONModel();
                that.lineModel = new JSONModel();
                this.oModel.setSizeLimit(1000);
                this.locModel.setSizeLimit(1000);
                this.lineModel.setSizeLimit(1000);

                this.bus = sap.ui.getCore().getEventBus();
                this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
                this.bus.publish("nav", "toBeginPage", {
                    viewName: this.getView().getProperty("viewName"),
                });
                // Declaring Dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogCreateRest) {
                    this._valueHelpDialogCreateRest = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.Restriction",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogCreateRest);
                }

                // Declaring Dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }

                // Declaring Dialogs
                if (!this._valueHelpDialogLine) {
                    this._valueHelpDialogLine = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.LineDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLine);
                }
            },

            /**
             * This function is to refreshing Master page data.
             */
            refreshMaster: function () {
                this.onAfterRendering();
            },

            /**
             * Called after the view has been rendered
             */
            onAfterRendering: function () {
                that = this;
                oGModel = this.getModel("oGModel");
                this.oLoc = this.byId("idloc");
                this.oLine = this.byId("idLine");

                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
                this.oLineList = this._oCore.byId(
                    this._valueHelpDialogLine.getId() + "-list"
                );
                that._valueHelpDialogLine.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");



                sap.ui.core.BusyIndicator.show();

                this.getModel("BModel").read("/genRtrHeader", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.oModel.setData({
                            results: oData.results,
                        });
                        that.byId("resList").setModel(that.oModel);
                        if (oData.results.length) {
                            oGModel.setProperty("/Restriction", oData.results[0].RESTRICTION);
                            oGModel.setProperty("/locId", oData.results[0].LOCATION_ID);
                            // Setting the default selected item for table
                            that.byId("resList").setSelectedItem(that.byId("resList").getItems()[0], true);
                            // Calling function to navigate to Item detail page
                            that.onhandlePress();
                        }

                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

                // Location data
                this.getModel("BModel").read("/getLocation", {
                    success: function (oData) {
                        that.locModel.setData(oData);
                        that.oLocList.setModel(that.locModel);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
            },

            /**
             * Called when it routes to a page containing the item details.
             */
            onhandlePress: function (oEvent) {
                oGModel = this.getModel("oGModel");

                if (oEvent) {
                    var sSelItem = oEvent
                        .getSource()
                        .getSelectedItem()
                        .getBindingContext()
                        .getObject();
                    // Set the selected values to get the details
                    oGModel.setProperty("/Restriction", sSelItem.RESTRICTION);
                    oGModel.setProperty("/locId", sSelItem.LOCATION_ID);
                }
                that.getOwnerComponent().runAsOwner(function () {
                    if (!that.oDetailView) {
                      try {
                        that.oDetailView = sap.ui.view({
                          viewName: "cpapp.cprestrictions.view.ItemDetail",
                          type: "XML",
                        });
                        that.bus.publish("flexible", "addDetailPage", that.oDetailView);
                        that.bus.publish("nav", "toDetailPage", {
                          viewName: that.oDetailView.getViewName(),
                        });
                      } catch (e) {
                        // that.oDetailView.onAfterRendering();
                      }
                    } else {
                      that.bus.publish("nav", "toDetailPage", {
                        viewName: that.oDetailView.getViewName(),
                      });
                    }
                  });
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */

            onSearch: function (oEvent) {
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    oFilters = [];

                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("RESTRICTION", FilterOperator.Contains, sQuery),
                                new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                                new Filter("LINE_ID", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("resList").getBinding("items").filter(oFilters);
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
                    // Line Dialog
                } else if (sId.includes("Line")) {
                    if (sap.ui.getCore().byId("idloc").getValue()) {
                        that._valueHelpDialogLine.open();
                    } else {
                        MessageToast.show("Select Location");
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
                    // Line Dialog
                } else if (sId.includes("Line")) {
                    that._oCore
                        .byId(this._valueHelpDialogLine.getId() + "-searchField")
                        .setValue("");
                    if (that.oLineList.getBinding("items")) {
                        that.oLineList.getBinding("items").filter([]);
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
                    // Line ID
                } else if (sId.includes("Line")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("LINE_ID", FilterOperator.Contains, sQuery),
                                    new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oLineList.getBinding("items").filter(oFilters);
                    // Version
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
                    that.oLoc = sap.ui.getCore().byId("idloc");
                    that.oLine = sap.ui.getCore().byId("idLine");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedItems[0].getTitle());

                    // Removing the input box values when Location changed
                    that.oLine.setValue("");


                    // Calling service to get the Line ID data
                    this.getModel("BModel").read("/getProdlocline", {
                        filters: [
                            new Filter(
                                "LOCATION_ID",
                                FilterOperator.EQ,
                                aSelectedItems[0].getTitle()
                            ),
                        ],
                        success: function (oData) {
                            that.lineModel.setData(oData);
                            that.oLineList.setModel(that.lineModel);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                        },
                    });

                    // Line list
                } else if (sId.includes("Line")) {
                    that.oLine = sap.ui.getCore().byId("idLine");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oLine.setValue(aSelectedItems[0].getTitle());


                }
            },
            onCreateRest: function (oEvent) {
                oGModel.setProperty("/RestFlag", "");
                that._valueHelpDialogCreateRest.open();
                if (oEvent.getSource().getIcon().includes("add")) {
                    sap.ui.getCore().byId("idRestriction").setTitle("Create Restriction");
                    oGModel.setProperty("/RestFlag", "C");
                    sap.ui.getCore().byId("idloc").setValue();
                    sap.ui.getCore().byId("idLine").setValue();
                    sap.ui.getCore().byId("idRest").setValue();
                    sap.ui.getCore().byId("idRestDesc").setValue();
                    sap.ui.getCore().byId("idDateRange").setValue();

                    sap.ui.getCore().byId("idloc").setEditable(true);
                    sap.ui.getCore().byId("idLine").setEditable(true);
                    sap.ui.getCore().byId("idRest").setEditable(true);

                    sap.ui.getCore().byId("idloc").setShowValueHelp(true);
                    sap.ui.getCore().byId("idLine").setShowValueHelp(true);

                } else {
                    sap.ui.getCore().byId("idRestriction").setTitle("Update Restriction");
                    oGModel.setProperty("/RestFlag", "E");
                    var selItem = oEvent.getSource().getParent().getBindingContext().getObject();
                    sap.ui.getCore().byId("idloc").setValue(selItem.LOCATION_ID);
                    sap.ui.getCore().byId("idLine").setValue(selItem.LINE_ID);
                    sap.ui.getCore().byId("idRest").setValue(selItem.RESTRICTION);
                    sap.ui.getCore().byId("idRestDesc").setValue(selItem.RTR_DESC);
                    var disM = selItem.VALID_FROM;
                    var disS = selItem.VALID_TO;
                    var dateL = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "MM-dd-YYYY"
                    }).format(disM);
                    var dateH = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "MM-dd-YYYY"
                    }).format(disS);
                    var dateRange = (dateL + " " + "To" + " " + dateH);
                    sap.ui.getCore().byId("idDateRange").setValue(dateRange);

                    sap.ui.getCore().byId("idloc").setEditable(false);
                    sap.ui.getCore().byId("idLine").setEditable(false);
                    sap.ui.getCore().byId("idRest").setEditable(false);

                    sap.ui.getCore().byId("idloc").setShowValueHelp(false);
                    sap.ui.getCore().byId("idLine").setShowValueHelp(false);


                }
            },


            onCloseRest: function () {
                that._valueHelpDialogCreateRest.close();
            },

            onSaveRest: function (oEvent) {
                this._oCore = sap.ui.getCore();
                var oLoc = this._oCore.byId("idloc").getValue(),
                    oLine = this._oCore.byId("idLine").getValue(),
                    oRest = this._oCore.byId("idRest").getValue(),
                    oRestDesc = this._oCore.byId("idRestDesc").getValue(),
                    oFlag = oGModel.getProperty("/RestFlag"),
                    oDateFrom = that.getDateFn(this._oCore.byId("idDateRange").getDateValue()),
                    oDateTo = that.getDateFn(this._oCore.byId("idDateRange").getSecondDateValue());


                // var oDateRange = this._oCore.byId("idDateRange");
                // if (oDateRange) {
                //     var dateValue = oDateRange._getInputValue();
                //     dateValue = dateValue.split(" To ");
                //     var oDateFrom = dateValue[0];
                //     var oDateTo = dateValue[1];
                //     // oDateFrom = oDateL.slice(0,2) + "-" + oDateL.slice(3,5) + "-" + oDateL.slice(6,10);
                //     // oDateTo = oDateH.slice(0,2) + "-" + oDateH.slice(3,5) + "-" + oDateH.slice(6,10);
                // }

                if (oFlag !== "") {
                    that.getModel("BModel").callFunction("/maintainRestrHdr", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: oLoc,
                            LINE_ID: oLine,
                            RESTRICTION: oRest,
                            RTR_DESC: oRestDesc,
                            VALID_FROM: oDateFrom,
                            VALID_TO: oDateTo,
                            Flag: oFlag,
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oFlag === "C") {
                                MessageToast.show("Restriction created successfully");
                            } else {
                                MessageToast.show("Successfully updated the restriction");
                            }
                            that.onCloseRest();
                            that.onAfterRendering();

                        },
                        error: function (oData) {
                            MessageToast.show("Failed to create /updaate the producr");
                            sap.ui.core.BusyIndicator.hide();
                        },
                    });
                }
            },

            onDeleteRest:function(oEvent){
                var selItem = oEvent.getSource().getParent().getBindingContext().getObject();
                    var oLoc = selItem.LOCATION_ID,
                        oLine = selItem.LINE_ID,
                        oRest = selItem.RESTRICTION;

                    that.getModel("BModel").callFunction("/maintainRestrHdr", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: oLoc,
                            LINE_ID: oLine,
                            RESTRICTION: oRest,
                            RTR_DESC: "",
                            VALID_FROM: "08/08/2022",
                            VALID_TO: "08/08/2022",
                            Flag: "D",
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show(oData.responce);
                            that.onAfterRendering();

                        },
                        error: function (oData) {
                            MessageToast.show("Failed to delete the restriction");
                            sap.ui.core.BusyIndicator.hide();
                        },
                    });

            },

            /**
       * This function is called to convert the input dates to Date String.
       * @param {object} imDate - Contains Date
       */
      getDateFn: function (imDate) {
        var vMonth, vDate;
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
        return (imDate = vMonth + "/" + vDate + "/" + imDate.getFullYear());
      },








        });
    }
);
