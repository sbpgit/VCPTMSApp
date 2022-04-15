sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "cp/appf/cpibpfuturedemand/controller/BaseController",
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
    return BaseController.extend("cp.appf.cpibpfuturedemand.controller.Home", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Models and size limits
        that.TableModel = new JSONModel();
        that.locModel = new JSONModel();
        that.prodModel = new JSONModel();
        that.verModel = new JSONModel();
        that.scenModel = new JSONModel();
        that.TableModel.setSizeLimit(1000);
        that.locModel.setSizeLimit(1000);
        that.prodModel.setSizeLimit(1000);
        that.verModel.setSizeLimit(1000);
        that.scenModel.setSizeLimit(1000);

        // Declaring fragments
        this._oCore = sap.ui.getCore();
        if (!this._valueHelpDialogLoc) {
          this._valueHelpDialogLoc = sap.ui.xmlfragment(
            "cp.appf.cpibpfuturedemand.view.LocDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogLoc);
        }
        if (!this._valueHelpDialogProd) {
          this._valueHelpDialogProd = sap.ui.xmlfragment(
            "cp.appf.cpibpfuturedemand.view.ProdDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogProd);
        }
        if (!this._valueHelpDialogVer) {
          this._valueHelpDialogVer = sap.ui.xmlfragment(
            "cp.appf.cpibpfuturedemand.view.VersionDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogVer);
        }
        if (!this._valueHelpDialogScen) {
          this._valueHelpDialogScen = sap.ui.xmlfragment(
            "cp.appf.cpibpfuturedemand.view.ScenarioDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogScen);
        }
      },

      /**
       * Called after the view has been rendered.
       */
      onAfterRendering: function () {
        that.oList = this.byId("idTab");
        this.oLoc = this.byId("idloc");
        this.oProd = this.byId("idprod");
        this.oVer = this.byId("idver");
        this.oScen = this.byId("idscen");

        that._valueHelpDialogProd.setTitleAlignment("Center");
        that._valueHelpDialogLoc.setTitleAlignment("Center");
        that._valueHelpDialogVer.setTitleAlignment("Center");
        that._valueHelpDialogScen.setTitleAlignment("Center");

        that.byId("headSearch").setValue("");
        that.byId("IBPfdemList").removeSelections();
        if (that.byId("IBPfdemList").getItems().length) {
          that.onSearch();
        }

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

        // Calling service to get the Location data
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
       * This function is called when click on Reset button.
       * This will clear all the input box values.
       */
      onResetDate: function () {
        that.oLoc.setValue("");
        that.oProd.setValue("");
        that.oVer.setValue("");
        that.oScen.setValue("");
        that.onAfterRendering();
      },

      /**
       * This function is called when click on Go button.
       * In this function will get the data based on Inputs selected.
       * @param {object} oEvent -the event information.
       */
      onGetData: function (oEvent) {
        var oLoc = that.byId("idloc").getValue(),
          oProd = that.byId("idprod").getValue(),
          oVer = that.byId("idver").getValue(),
          oScen = that.byId("idscen").getValue();

        var oFilters = [];

        // Checking if Location and Product selected
        if (oLoc !== "" && oProd !== "") {
          var sFilter = new sap.ui.model.Filter({
            path: "LOCATION_ID",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: oLoc,
          });
          oFilters.push(sFilter);

          var sFilter = new sap.ui.model.Filter({
            path: "PRODUCT_ID",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: oProd,
          });
          oFilters.push(sFilter);

          if (oVer) {
            var sFilter = new sap.ui.model.Filter({
              path: "VERSION",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: oVer,
            });
            oFilters.push(sFilter);
          }
          if (oScen) {
            var sFilter = new sap.ui.model.Filter({
              path: "SCENARIO",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: oScen,
            });
            oFilters.push(sFilter);
          }

          sap.ui.core.BusyIndicator.show();
          // Calling service to get the data based of filters
          that.getModel("BModel").read("/getIBPFdem", {
            filters: oFilters,
            success: function (oData) {
              oData.results.forEach(function (row) {
                // Calling function to handle the date format
                row.WEEK_DATE = that.getInMMddyyyyFormat(row.WEEK_DATE);
              }, that);
              sap.ui.core.BusyIndicator.hide();
              that.TableModel.setData({
                results: oData.results,
              });
              that.byId("IBPfdemList").setModel(that.TableModel);
            },
            error: function (data) {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show("Error While fetching data");
            },
          });
        } else {
          sap.m.MessageToast.show("Please select a Location/Product");
        }
      },

      /**
       * This function is called to convert the Date String to Date(MM/dd/yyyy).
       * @param {object} oDate - Date string.
       */
      getInMMddyyyyFormat: function (oDate) {
        if (!oDate) {
          oDate = new Date();
        }
        var month = oDate.getMonth() + 1;
        var date = oDate.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        return month + "/" + date + "/" + oDate.getFullYear();
      },

      /**
       * This function is called when click on Input box to open the Value help dialogs.
       * @param {object} oEvent -the event information.
       */
      handleValueHelp: function (oEvent) {
        var sId = oEvent.getParameter("id");
        // Loc Dialog
        if (sId.includes("loc")) {
          that._valueHelpDialogLoc.open();
          // Prod Dialog
        } else if (sId.includes("prod")) {
          if (that.byId("idloc").getValue()) {
            that._valueHelpDialogProd.open();
          } else {
            MessageToast.show("Select Location");
          }
          // Version Dialog
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
        }
      },

      /**
       * Called when 'Close/Cancel' button in any dialog is pressed.
       */
      handleClose: function (oEvent) {
        var sId = oEvent.getParameter("id");
        // Loc Dialog
        if (sId.includes("Loc")) {
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
        } else if (sId.includes("Ver")) {
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
       * This function is called when selecting an item in dialogs.
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
          that.oProd = that.byId("idprod");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oLoc.setValue(aSelectedItems[0].getTitle());
          that.oGModel.setProperty(
            "/SelectedLoc",
            aSelectedItems[0].getTitle()
          );
          that.oProd.setValue("");
          that.oVer.setValue("");
          that.oScen.setValue("");
          that.oGModel.setProperty("/SelectedProd", "");

          // Calling service to get Product list
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

          // Prod list
        } else if (sId.includes("prod")) {
          that.oProd = that.byId("idprod");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oProd.setValue(aSelectedItems[0].getTitle());
          that.oGModel.setProperty(
            "/SelectedProd",
            aSelectedItems[0].getTitle()
          );
          that.oVer.setValue("");
          that.oScen.setValue("");

          // Calling service to get IBP Versions
          this.getModel("BModel").read("/getIbpVerScn", {
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
              that.verModel.setData(oData);
              that.oVerList.setModel(that.verModel);
            },
            error: function (oData, error) {
              MessageToast.show("error");
            },
          });
          // Version list
        } else if (sId.includes("Ver")) {
          this.oVer = that.byId("idver");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oVer.setValue(aSelectedItems[0].getTitle());
          that.oScen.setValue("");
          that.oGModel.setProperty(
            "/SelectedVer",
            aSelectedItems[0].getTitle()
          );
          // Calling service to get IBP Scenario
          this.getModel("BModel").read("/getIbpVerScn", {
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
       * Called when it routes to a page containing the Details.
       * @param {object} oEvent -the event information.
       */
      onhandlePress: function (oEvent) {
        var oSelRow = this.byId("IBPfdemList").getSelectedItems();
        that.oGModel = that.getModel("oGModel");

        var oSelItem = oSelRow[0].getBindingContext().getProperty();
        // Getting the selected data
        that.oGModel.setProperty("/sLoc", oSelItem.LOCATION_ID);
        that.oGModel.setProperty("/sProd", oSelItem.PRODUCT_ID);
        that.oGModel.setProperty("/sVer", oSelItem.VERSION);
        that.oGModel.setProperty("/sScen", oSelItem.SCENARIO);

        var week = new Date(oSelItem.WEEK_DATE),
          month = week.getMonth() + 1,
          day = week.getDate(),
          weekDate;
        if (month < 10) {
          month = "0" + month;
        }
        if (week.getDate() < 10) {
          day = "0" + week.getDate();
        }

        weekDate = week.getFullYear() + "-" + month + "-" + day;
        that.oGModel.setProperty("/sWeek", weekDate);
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Detail", {}, true);
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onSearch: function (oEvent) {
        if (oEvent) {
          var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue");
        } else {
          var sQuery = that.byId("headSearch").getValue();
        }
        var oFilters = [];
        // Check if search filter is to be applied
        sQuery = sQuery ? sQuery.trim() : "";

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("WEEK_DATE", FilterOperator.Contains, sQuery),
                new Filter("QUANTITY", FilterOperator.Contains, sQuery),
                new Filter("VERSION", FilterOperator.Contains, sQuery),
                new Filter("SCENARIO", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.byId("IBPfdemList").getBinding("items").filter(oFilters);
      },
    });
  }
);
