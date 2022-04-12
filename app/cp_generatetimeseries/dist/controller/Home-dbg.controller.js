sap.ui.define(
  [
    "cpappf/cpgeneratetimeseries/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    MessageToast,
    MessageBox,
    JSONModel,
    Filter,
    FilterOperator,
    Device,
    Fragment
  ) {
    "use strict";
    var that, oGModel;

    return BaseController.extend(
      "cpappf.cpgeneratetimeseries.controller.Home",
      {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;
          // Declaring JSON Models and size limits
          that.locModel = new JSONModel();
          that.prodModel = new JSONModel();
          that.verModel = new JSONModel();
          that.scenModel = new JSONModel();

          that.locModel.setSizeLimit(1000);
          that.prodModel.setSizeLimit(1000);
          that.verModel.setSizeLimit(1000);
          that.scenModel.setSizeLimit(1000);

          // Declaring Dialogs
          this._oCore = sap.ui.getCore();
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cpappf.cpgeneratetimeseries.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cpappf.cpgeneratetimeseries.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }
          if (!this._valueHelpDialogVer) {
            this._valueHelpDialogVer = sap.ui.xmlfragment(
              "cpappf.cpgeneratetimeseries.view.VersionDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogVer);
          }
          if (!this._valueHelpDialogScen) {
            this._valueHelpDialogScen = sap.ui.xmlfragment(
              "cpappf.cpgeneratetimeseries.view.ScenarioDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogScen);
          }

          this.getRouter()
            .getRoute("Home")
            .attachPatternMatched(this._onPatternMatched.bind(this));
        },

        /**
         * Called when the URL matches pattern "Home".
         * @constructor
         */
        _onPatternMatched: function () {
          that = this;
          this.oLoc = this.byId("locInput");
          this.oProd = this.byId("prodInput");

          that._valueHelpDialogProd.setTitleAlignment("Center");
          that._valueHelpDialogLoc.setTitleAlignment("Center");
          that._valueHelpDialogVer.setTitleAlignment("Center");
          that._valueHelpDialogScen.setTitleAlignment("Center");

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

          // Calling service to get the Locations
          sap.ui.core.BusyIndicator.show();
          this.getModel("BModel").read("/getLocation", {
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
         * This function is called when click on Input box Value Help.
         * This function will open the dialogs based on sId
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
          that.oGModel = that.getModel("oGModel");
          var sId = oEvent.getParameter("id");
          /* 
           TL - Time Series Location
           TP - Time Series Product
           CL - Component Requirment Location
           CP - Component Requirment Product
        */
          // Loc Dialog
          if (sId.includes("loc")) {
            that.oGModel.setProperty("/LocInput", "TL");
            that._valueHelpDialogLoc.open();
            // Prod Dialog
          } else if (sId.includes("Prod")) {
            if (that.byId("idloc").getValue()) {
              that.oGModel.setProperty("/ProdInput", "TP");
              that._valueHelpDialogProd.open();
            } else {
              MessageToast.show("Select Location");
            }
          } else if (sId.includes("loComp")) {
            that.oGModel.setProperty("/LocInput", "CL");
            that._valueHelpDialogLoc.open();
          } else if (sId.includes("ProComp")) {
            if (that.byId("idloComp").getValue()) {
              that.oGModel.setProperty("/ProdInput", "CP");
              that._valueHelpDialogProd.open();
            } else {
              MessageToast.show("Select Location");
            }
            // Version Dialog
          } else if (sId.includes("ver")) {
            if (
              that.byId("idloComp").getValue() &&
              that.byId("idProComp").getValue()
            ) {
              that._valueHelpDialogVer.open();
            } else {
              MessageToast.show("Select Location and Product");
            }
            // Scenario Dialog
          } else if (sId.includes("scen")) {
            if (
              that.byId("idloComp").getValue() &&
              that.byId("idProComp").getValue()
            ) {
              that._valueHelpDialogScen.open();
            } else {
              MessageToast.show("Select Location and Product");
            }
          }

          if (sId.includes("Prod") || sId.includes("ProComp")) {
            var oSelectedLocation;
            if (sId.includes("Prod")) {
              oSelectedLocation = that.byId("idloc").getValue();
            } else if (sId.includes("ProComp")) {
              oSelectedLocation = that.byId("idloComp").getValue();
            }
            if (oSelectedLocation) {
              sap.ui.core.BusyIndicator.show();
              this.getModel("BModel").read("/getLocProdDet", {
                filters: [
                  new Filter(
                    "LOCATION_ID",
                    FilterOperator.EQ,
                    oSelectedLocation
                  ),
                ],
                success: function (oData) {
                  that.prodModel.setData(oData);
                  that.oProdList.setModel(that.prodModel);
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function (oData, error) {
                  sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to get product data");
                },
              });
            }
          }
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         */
        handleClose: function (oEvent) {
          var sId = oEvent.getParameter("id");
          // Loc Dialog
          if (sId.includes("loc")) {
            that._oCore
              .byId(this._valueHelpDialogLoc.getId() + "-searchField")
              .setValue("");
            if (that.oLocList.getBinding("items")) {
              that.oLocList.getBinding("items").filter([]);
            }
            // Prod Dialog
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
            // Version List
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
            // Scenario List
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
         * This function is called when selecting values in dialogs.
         * @param {object} oEvent -the event information.
         */
        handleSelection: function (oEvent) {
          that.oGModel = that.getModel("oGModel");
          var sId = oEvent.getParameter("id"),
            oItem = oEvent.getParameter("selectedItems"),
            aSelectedItems,
            aODdata = [];
          /* 
           TL - Time Series Location
           TP - Time Series Product
           CL - Component Requirment Location
           CP - Component Requirment Product
        */
          //Location list
          if (sId.includes("Loc")) {
            var oLocType = that.oGModel.getProperty("/LocInput");

            if (oLocType === "TL") {
              this.oProd = that.byId("idProd");
              this.oLoc = that.byId("idloc");
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedItems[0].getTitle());
              that.oGModel.setProperty(
                "/SelectedLoc",
                aSelectedItems[0].getTitle()
              );
              that.oProd.setValue("");
              that.byId("idTimeSeries").setEnabled(false);
              that.byId("idFTimeSeries").setEnabled(false);
              that.oGModel.setProperty("/SelectedProd", "");
            } else if (oLocType === "CL") {
              this.oProd = that.byId("idProComp");
              this.oLoc = that.byId("idloComp");
              that.oVer = that.byId("idver");
              that.oScen = that.byId("idscen");
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedItems[0].getTitle());
              that.oProd.setValue("");
              that.oVer.setValue("");
              that.oScen.setValue("");
              that.byId("buttonCompReq").setEnabled(false);
            }

            // Prod list
          } else if (sId.includes("prod")) {
            var oProdType = that.oGModel.getProperty("/ProdInput");
            if (oProdType === "TP") {
              this.oProd = that.byId("idProd");
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oProd.setValue(aSelectedItems[0].getTitle());
              that.oGModel.setProperty(
                "/SelectedProd",
                aSelectedItems[0].getTitle()
              );

              if (
                that.oGModel.getProperty("/SelectedLoc") !== "" &&
                that.oGModel.getProperty("/SelectedProd") !== ""
              ) {
                that.byId("idTimeSeries").setEnabled(true);
                that.byId("idFTimeSeries").setEnabled(true);
              } else {
                that.byId("idTimeSeries").setEnabled(false);
                that.byId("idFTimeSeries").setEnabled(false);
              }
            } else if (oProdType === "CP") {
              this.oLoc = that.byId("idloComp");
              this.oProd = that.byId("idProComp");
              that.oVer = that.byId("idver");
              that.oScen = that.byId("idscen");
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oProd.setValue(aSelectedItems[0].getTitle());
              that.byId("buttonCompReq").setEnabled(false);
              that.oVer.setValue("");
              that.oScen.setValue("");

              // Calling function to get the IBP Version list
              this.getModel("BModel").read("/getIbpVerScn", {
                filters: [
                  new Filter(
                    "LOCATION_ID",
                    FilterOperator.EQ,
                    that.byId("idloComp").getValue()
                  ),
                  new Filter(
                    "PRODUCT_ID",
                    FilterOperator.EQ,
                    that.byId("idProComp").getValue()
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
            }
            // Version List
          } else if (sId.includes("Ver")) {
            this.oVer = that.byId("idver");
            that.oScen = that.byId("idscen");
            aSelectedItems = oEvent.getParameter("selectedItems");
            that.oVer.setValue(aSelectedItems[0].getTitle());
            that.oScen.setValue("");
            that.byId("buttonCompReq").setEnabled(false);

            // Calling function to get the IBP Scenario list
            this.getModel("BModel").read("/getIbpVerScn", {
              filters: [
                new Filter(
                  "LOCATION_ID",
                  FilterOperator.EQ,
                  that.byId("idloComp").getValue()
                ),
                new Filter(
                  "PRODUCT_ID",
                  FilterOperator.EQ,
                  that.byId("idProComp").getValue()
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
            that.byId("buttonCompReq").setEnabled(true);
          }
        },

        /**
         * This function is called when click on Generate Timeseries button to Generate Timeseries.
         */
        onTimeS: function () {
          var oSelloc = that.oGModel.getProperty("/SelectedLoc"),
            oSelprod = that.oGModel.getProperty("/SelectedProd");
          sap.ui.core.BusyIndicator.show();
          this.getModel("BModel").callFunction("/generate_timeseries", {
            method: "GET",
            urlParameters: {
              LOCATION_ID: oSelloc,
              PRODUCT_ID: oSelprod,
            },
            success: function (oData) {
              MessageToast.show("Timeseries generated successfully");
              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oData, error) {
              MessageToast.show("Failed to generate Timeseries");
              sap.ui.core.BusyIndicator.hide();
            },
          });
        },

        /**
         * This function is called when click on Generate Future Timeseries button to Generate Future Timeseries.
         */
        onTimeF: function () {
          var oSelloc = that.oGModel.getProperty("/SelectedLoc"),
            oSelprod = that.oGModel.getProperty("/SelectedProd");
          sap.ui.core.BusyIndicator.show();
          this.getModel("BModel").callFunction("/generate_timeseriesF", {
            method: "GET",
            urlParameters: {
              LOCATION_ID: oSelloc,
              PRODUCT_ID: oSelprod,
            },
            success: function (oData) {
              MessageToast.show("Future Timeseries generated successfully");
              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oData, error) {
              MessageToast.show("Failed to generate future Timeseries");
              sap.ui.core.BusyIndicator.hide();
            },
          });
        },

        /**
         * This function is called when click on Components Requirements button to Generate Components Requirements.
         */
        onCompReq: function () {
          var oSelloc = that.byId("idloComp").getValue(),
            oSelprod = that.byId("idProComp").getValue(),
            oSelVer = that.byId("idver").getValue(),
            oSelScen = that.byId("idscen").getValue();
          MessageToast.show("Generated components requirements");
          this.getModel("BModel").callFunction("/getCompreqQty", {
            method: "GET",
            urlParameters: {
              LOCATION_ID: oSelloc,
              PRODUCT_ID: oSelprod,
              VERSION: oSelVer,
              SCENARIO: oSelScen,
            },
            success: function (oData) {
              MessageToast.show("Generated components requirements");
            },
            error: function (oData, error) {
              MessageToast.show("Failed to generate Components Requirments");
            },
          });
        },
      }
    );
  }
);
