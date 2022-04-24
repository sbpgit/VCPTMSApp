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
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaration of Json Model and size category
        that.ProdListModel = new JSONModel();
        that.locModel = new JSONModel();
        that.prodModel = new JSONModel();
        that.ProdListModel.setSizeLimit(1000);
        that.locModel.setSizeLimit(1000);
        that.prodModel.setSizeLimit(1000);

        // Declaration of Dialogs
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

      /**
       * Called after the view has been rendered.
       * Calls the getData[function] to get Data.
       */
      onAfterRendering: function () {
        this.oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();
        that.oList = this.byId("ProdList");
        that.oList.removeSelections();
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

        // Calling service to get the location data
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

        that.getData();
      },

      /**
       * Getting Data Initially and binding to elements.
       */
      getData: function () {
        sap.ui.core.BusyIndicator.show();

        // Calling service to get the product data
        this.getModel("BModel").read("/genNewProd", {
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            that.ProdListModel.setData(oData);
            that.oList.setModel(that.ProdListModel);
            
          },
          error: function (oData, error) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("error");
          },
        });


        var oEntry = {
            PRODCHAR: [],
          },
          vRuleslist;
        vRuleslist = {
            PRODUCT_ID: '8150RW_1',
            REF_PRODID: '8150RW',
            CLASS_NUM:'20797',            
            CHAR_NUM:'31655',            
            CHARVAL_NUM:'31655-0001'
        };
        oEntry.PRODCHAR.push(vRuleslist);

        that.getModel("BModel").callFunction("/maintainNewProdChar", {
            method: "GET",
            urlParameters: {
                FLAG : 'C',
                PRODCHAR: JSON.stringify(oEntry.PRODCHAR)
            },
        
              
            success: function (oData) {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
              regData.push(data.d.values[0].vcRulesList);

              that.otabModel.setData({
                results: regData[0],
              });
              that.byId("pmdlList").setModel(that.otabModel);
              that.oPanel.setProperty("visible", true);
              vFlag = "X";
            },
            error: function (error) {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
            },
          });

        
      },

      /**
       * This function is called when click on Create or Edit button.
       * In this function data will be set based on buttion click.
       * @param {object} oEvent -the event information.
       */
      onCreate: function (oEvent) {
        oGModel = this.getModel("oGModel");
        oGModel.setProperty("/sFlag", "");

        // var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        // oRouter.navTo("Detail", {}, true);

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
            sap.ui.getCore().byId("idProd").setValue(oTableItem[1].getText());
            sap.ui.getCore().byId("idrefprod").setValue(oTableItem[2].getText());

            sap.ui.getCore().byId("idloc").setEditable(false);
            sap.ui.getCore().byId("idProd").setEditable(false);
            
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
        oGModel.setProperty("/OpenProdInut", "");
        // Location Dialog
        if (sId.includes("loc")) {
          that._valueHelpDialogLoc.open();
          // Product Dialog
        } else if (sId.includes("prod")) {
            that.ProdData();
          if (sap.ui.getCore().byId("idloc").getValue()) {
            oGModel.setProperty("/OpenProdInut", "P");
            that._valueHelpDialogProd.open();
          } else {
            MessageToast.show("Select Location");
          }
        } else if (sId.includes("idProd")) {
            that.ProdData();
            if (sap.ui.getCore().byId("idloc").getValue()) {
                oGModel.setProperty("/OpenProdInut", "NP");
              that._valueHelpDialogProd.open();
            } else {
              MessageToast.show("Select Location");
            }
          }
      },

      /**
       * This function is called to get the product data.
       */
      ProdData:function(){
        sap.ui.core.BusyIndicator.show();
            // Calling service to get the Product data
            this.getModel("BModel").read("/getLocProdDet", {
                filters: [
                new Filter(
                    "LOCATION_ID",
                    FilterOperator.EQ,
                    this._oCore.byId("idloc").getValue()
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

      },

      /**
       * Called when 'Close/Cancel' button in any dialog is pressed.
       */
      handleClose: function (oEvent) {
        var sId = oEvent.getParameter("id");
        this.byId("ProdList").removeSelections();
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
        } else if (sId.includes("prodSlctList")) {
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
        } else if(sId.includes("idSearch")){

            if (sQuery !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                      new Filter("REF_PRODID", FilterOperator.Contains, sQuery),
                      new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                  })
                );
              }
              that.oList.getBinding("items").filter(oFilters);
            
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


          // Product list
        } else if (sId.includes("prod")) {
            if(oGModel.getProperty("/OpenProdInut") === "P"){
                that.oProd = sap.ui.getCore().byId("idrefprod");
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oProd.setValue(aSelectedItems[0].getTitle());
                that.oGModel.setProperty(
                    "/SelectedProd",
                    aSelectedItems[0].getTitle()
                );
            } else if (oGModel.getProperty("/OpenProdInut") === "NP"){
                that.oNewProd = sap.ui.getCore().byId("idProd");
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oNewProd.setValue(aSelectedItems[0].getTitle());
                that.oGModel.setProperty(
                "/SelectednewProd",
                aSelectedItems[0].getTitle()
                );
            }
          

         }
        that.handleClose(oEvent);
      },

      /**
       * This function is called when click on save button in dialog to create or update the product.
       * @param {object} oEvent -the event information.
       */
      onProdSave: function (oEvent) {
        var oLoc = this._oCore.byId("idloc").getValue(),
          oRefProd = this._oCore.byId("idrefprod").getValue(),
          oProd = this._oCore.byId("idProd").getValue(),
          oFlag = oGModel.getProperty("/sFlag");

        if (oRefProd === oProd) {
          MessageToast.show(
            "Reference product and new product can not be same"
          );
        } else {
          that.getModel("BModel").callFunction("/maintainNewProd", {
            method: "GET",
            urlParameters: {
              LOCATION_ID: oLoc,
              PRODUCT_ID: oProd,
              REF_PRODID: oRefProd,
              FLAG: oFlag,
            },
            success: function (oData) {
              sap.ui.core.BusyIndicator.hide();
              if (oFlag === "C") {
                MessageToast.show("New product created successfully");
              } else {
                MessageToast.show("Successfully updated the product");
              }
              that._valueHelpDialogCreate.close();
              that.onAfterRendering();
            },
            error: function (oData) {
              MessageToast.show("Failed to create /updaate the producr");
              sap.ui.core.BusyIndicator.hide();
            },
          });
        }
      },

      /**
       * This function is called when click on Delete button on product list.
       * @param {object} oEvent -the event information.
       */
      onProdeDel: function (oEvent) {
        // Getting the selected product to delete
        var oItem = oEvent.getSource().getParent().getCells();
        var oLoc = oItem[0].getText(),
          oProd = oItem[1].getText(),
          oRefProd = oItem[2].getText();
        // Getting the conformation popup before deleting
        var sText =
          "Do you want to delete the selected product" +
          " - " +
          oProd +
          " - " +
          "Please confirm";
        sap.m.MessageBox.show(sText, {
          title: "Confirmation",
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              sap.ui.core.BusyIndicator.show();

              that.getModel("BModel").callFunction("/maintainNewProd", {
                method: "GET",
                urlParameters: {
                  LOCATION_ID: oLoc,
                  REF_PRODID: oRefProd,
                  PRODUCT_ID: oProd,
                  FLAG: "D",
                },
                success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  
                  MessageToast.show("Product deleted successfully");
                  // Refreshing data after successfull deletion
                  that.onAfterRendering();
                },
                error: function () {
                  sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to delete product");
                },
              });
            }
          },
        });
      },
    });
  }
);
