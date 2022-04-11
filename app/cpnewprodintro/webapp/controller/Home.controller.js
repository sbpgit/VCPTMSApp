sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "cpapp/cpnewprodintro/controller/BaseController",
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
    return BaseController.extend("cpapp.cpnewprodintro.controller.Home", {
      onInit: function () {
        that = this;
        that.locModel = new JSONModel();
        that.prodModel = new JSONModel();
        that.locModel.setSizeLimit(1000);
        that.prodModel.setSizeLimit(1000);

        this._oCore = sap.ui.getCore();
        if (!this._valueHelpDialogCreate) {
          this._valueHelpDialogCreate = sap.ui.xmlfragment(
            "cpapp.cpnewprodintro.view.CreateProduct",
            this
          );
          this.getView().addDependent(this._valueHelpDialogCreate);
        }

        if (!this._valueHelpDialogLoc) {
          this._valueHelpDialogLoc = sap.ui.xmlfragment(
            "cpapp.cpnewprodintro.view.LocDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogLoc);
        }

        if (!this._valueHelpDialogProd) {
          this._valueHelpDialogProd = sap.ui.xmlfragment(
            "cpapp.cpnewprodintro.view.ProdDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogProd);
        }
      },
      onAfterRendering: function () {
        this.oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();
        that.oList = this.byId("ProdList");
        this.oLoc = sap.ui.getCore().byId("idloc");
        this.oProd = sap.ui.getCore().byId("idrefprod");
        that._valueHelpDialogProd.setTitleAlignment("Center");
        that._valueHelpDialogLoc.setTitleAlignment("Center");

        this.oProdList = this._oCore.byId(
          this._valueHelpDialogProd.getId() + "-list"
        );
        this.oLocList = this._oCore.byId(
          this._valueHelpDialogLoc.getId() + "-list"
        );
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

      onCreate: function (oEvent) {
        oGModel = this.getModel("oGModel");
        oGModel.setProperty("/sFlag", "");
        // Opening dialog and setting data based on selected button
        if (oEvent.getSource().getTooltip().includes("Create")) {
          that._valueHelpDialogCreate.setTitle("New Product Creation");
          sap.ui.getCore().byId("idloc").setValue("");
          sap.ui.getCore().byId("idrefprod").setValue("");
          sap.ui.getCore().byId("idProd").setValue("");
          oGModel.setProperty("/sFlag", "C");
          that._valueHelpDialogCreate.open();
        } else {
          if (this.byId("ProdList").getSelectedItems().length) {
            var oTableItem = this.byId("ProdList").getSelectedItem().getCells();
            that._valueHelpDialogCreate.setTitle("Update Product");
            sap.ui.getCore().byId("idloc").setValue(oTableItem[0].getText());
            sap.ui
              .getCore()
              .byId("idrefprod")
              .setValue(oTableItem[1].getText());
            sap.ui.getCore().byId("idProd").setValue(oTableItem[2].getText());
            oGModel.setProperty("/sFlag", "E");
            that._valueHelpDialogCreate.open();
          } else {
            MessageToast.show("Select product to update");
          }
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
        } else if (sId.includes("prod")) {
          if (sap.ui.getCore().byId("idloc").getValue()) {
            that._valueHelpDialogProd.open();
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
          // Product Dialog
        } else if (sId.includes("prod")) {
          that._oCore
            .byId(this._valueHelpDialogProd.getId() + "-searchField")
            .setValue("");
          if (that.oProdList.getBinding("items")) {
            that.oProdList.getBinding("items").filter([]);
          }
        } else if (sId.includes("__button1")) {
            that._valueHelpDialogCreate.close();
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
          sap.ui.core.BusyIndicator.show();
          that.oLoc = sap.ui.getCore().byId("idloc");
          that.oProd = sap.ui.getCore().byId("idrefprod");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oLoc.setValue(aSelectedItems[0].getTitle());
          that.oGModel.setProperty(
            "/SelectedLoc",
            aSelectedItems[0].getTitle()
          );
          // Removing the input box values when Location changed
          that.oProd.setValue("");
          sap.ui.getCore().byId("idProd").setValue("");
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
              sap.ui.core.BusyIndicator.hide();
              that.prodModel.setData(oData);
              that.oProdList.setModel(that.prodModel);
            },
            error: function (oData, error) {
              sap.ui.core.BusyIndicator.hide();
              MessageToast.show("error");
            },
          });

          // Product list
        } else if (sId.includes("prod")) {
          that.oProd = sap.ui.getCore().byId("idrefprod");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oProd.setValue(aSelectedItems[0].getTitle());
          that.oGModel.setProperty(
            "/SelectedProd",
            aSelectedItems[0].getTitle()
          );
        }
        that.handleClose(oEvent);
      },
    });
  }
);
