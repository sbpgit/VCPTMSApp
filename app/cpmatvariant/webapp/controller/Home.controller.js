sap.ui.define(
    [
      "cpapp/cpmatvariant/controller/BaseController",
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
  
      return BaseController.extend("cpapp.cpmatvariant.controller.Home", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;
          // Declaring JSON Model and size limit
          that.oModel = new JSONModel();
          this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          
          that.locModel.setSizeLimit(1000);
          that.prodModel.setSizeLimit(1000);
          this.oModel.setSizeLimit(1000);
          
          // Declaring value help dialogs
          this._oCore = sap.ui.getCore();
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cpapp.cpmatvariant.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cpapp.cpmatvariant.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
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
          that.oLoc = this.byId("idloc");
          this.oProd = this.byId("prodInput");
          that._valueHelpDialogLoc.setTitleAlignment("Center");
          that._valueHelpDialogProd.setTitleAlignment("Center");
  
          this.oProdList = this._oCore.byId(
            this._valueHelpDialogProd.getId() + "-list"
          );
          this.oLocList = this._oCore.byId(
            this._valueHelpDialogLoc.getId() + "-list"
          );
          oGModel = this.getModel("oGModel");
          sap.ui.core.BusyIndicator.show();
  
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
  
          
        },
  
        /**
         * This function is called when click on Input box Value Help.
         * Dialogs will be open based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
          var sId = oEvent.getParameter("id");
          // Loc Dialog
          if (sId.includes("loc")) {
            that._valueHelpDialogLoc.open();
            // Prod Dialog
          } else if (sId.includes("prod")) {
            if (that.byId("idloc").getValue() !== "") {
              that._valueHelpDialogProd.open();
            } else {
              MessageToast.show("Select Location");
            }
          }
        },
  
        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         * Dialogs will be closed based on sId
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
          if (sId.includes("loc")) {
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
         * This function is called when selection of values in dialogs.
         * after selecting value, based on selection get data of other filters.
         * @param {object} oEvent -the event information.
         */
        handleSelection: function (oEvent) {
          var sId = oEvent.getParameter("id"),
            oItem = oEvent.getParameter("selectedItems"),
            aSelectedItems,
            aODdata = [];
          //Location list
          if (sId.includes("Loc")) {
            this.oLoc = that.byId("idloc");
            aSelectedItems = oEvent.getParameter("selectedItems");
            that.oLoc.setValue(aSelectedItems[0].getTitle());
            that.oProd.removeAllTokens();
            this._valueHelpDialogProd
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
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
            this.oProd = that.byId("prodInput");
            aSelectedItems = oEvent.getParameter("selectedItems");
              that.oProd.setValue(aSelectedItems[0].getTitle());
           
          }
          that.handleClose(oEvent);
        },
  
        /**
         * This function is called when click on Go button.
         * @param {object} oEvent -the event information.
         */
        onGetData: function (oEvent) {
              var oSloc = that.oLoc.getValue(),
                  oSprod = that.oProd.getValue();
                  
  
  
          this.getModel("BModel").read("/getMatVarHeader", {
              filters: [
                  new Filter("LOCATION_ID", FilterOperator.EQ, oSloc),
                  new Filter("PRODUCT_ID", FilterOperator.EQ, oSprod),
                ],
            success: function (oData) {
              that.oModel.setData({
                results: oData.results,
              });
              that.byId("idMatVHead").setModel(that.oModel);
              oGModel.setProperty("/locId", oData.results[0].LOCATION_ID);
              oGModel.setProperty("/prdId", oData.results[0].PRODUCT_ID);
              // Setting the default selected item for table
              that.byId("idMatVHead").setSelectedItem(that.byId("idMatVHead").getItems()[0], true);
              // Calling function to navigate to Item detail page
              // that.onhandlePress();
              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },
  
        /**
         * Called when it routes to a page containing the item details.
         */
        onhandlePress: function (oEvent) {
          oGModel = this.getModel("oGModel");
  
          
        },
        onChange:function(oEvent){

            var oItem = oEvent.getSource().getBindingContext().getObject();
            MessageToast.show("Changed");

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
                  new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                  new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                ],
                and: false,
              })
            );
          }
          that.byId("idMatVHead").getBinding("items").filter(oFilters);
        },
      });
    }
  );
  