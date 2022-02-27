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
  
      return BaseController.extend("cpappf.cpgeneratetimeseries.controller.Home", {
        onInit: function () {
            that = this;
            that.locModel = new JSONModel();
            that.prodModel = new JSONModel();
            that.locModel.setSizeLimit(1000);
            that.prodModel.setSizeLimit(1000);
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

            
            this.getRouter()
          .getRoute("Home")
          .attachPatternMatched(this._onPatternMatched.bind(this));
        
            },
            _onPatternMatched: function () {
                that = this;;
                this.oLoc = this.byId("locInput");
                this.oProd = this.byId("prodInput");
        
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

              handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("loc")) {
                  that._valueHelpDialogLoc.open();
                } else if (sId.includes("Prod")) {
                  if (that.byId("idloc").getValue()) {
                    that._valueHelpDialogProd.open();
                  } else {
                    MessageToast.show("Select Location");
                  }
                }
              },

              handleClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("loc")) {
                  that._oCore
                    .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                    .setValue("");
                  if (that.oLocList.getBinding("items")) {
                    that.oLocList.getBinding("items").filter([]);
                  }
                } else if (sId.includes("prod")) {
                  that._oCore
                    .byId(this._valueHelpDialogProd.getId() + "-searchField")
                    .setValue("");
                  if (that.oProdList.getBinding("items")) {
                    that.oProdList.getBinding("items").filter([]);
                  }
                } 
              },

              handleSearch: function (oEvent) {
                var query =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                  sId = oEvent.getParameter("id"),
                  oFilters = [];
                // Check if search filter is to be applied
                query = query ? query.trim() : "";
                // Location
                if (sId.includes("Loc")) {
                  if (query !== "") {
                    oFilters.push(
                      new Filter({
                        filters: [
                          new Filter("LOCATION_ID", FilterOperator.Contains, query),
                          new Filter("LOCATION_DESC", FilterOperator.Contains, query),
                        ],
                        and: false,
                      })
                    );
                  }
                  that.oLocList.getBinding("items").filter(oFilters);
                  // Product
                } else if (sId.includes("prod")) {
                  if (query !== "") {
                    oFilters.push(
                      new Filter({
                        filters: [
                          new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                          new Filter("PROD_DESC", FilterOperator.Contains, query),
                        ],
                        and: false,
                      })
                    );
                  }
                  that.oProdList.getBinding("items").filter(oFilters);
                } 
              },
              handleSelection: function (oEvent) {
                that.oGModel = that.getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                  oItem = oEvent.getParameter("selectedItems"),
                  aSelectedItems,
                  aODdata = [];
                //Location list
                if (sId.includes("Loc")) {
                    this.oProd = that.byId("idProd");
                    this.oLoc = that.byId("idloc");
                  aSelectedItems = oEvent.getParameter("selectedItems");
                  that.oLoc.setValue(aSelectedItems[0].getTitle());
                  that.oGModel.setProperty("/SelectedLoc", aSelectedItems[0].getTitle());
                  that.oProd.setValue("");
                  that.oGModel.setProperty("/SelectedProd", "");
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
                      MessageToast.show("Failed to get product data");
                    },
                  });
        
                  // Prod list
                } else if (sId.includes("prod")) {
                    this.oProd = that.byId("idProd");
                  aSelectedItems = oEvent.getParameter("selectedItems");
                  that.oProd.setValue(aSelectedItems[0].getTitle());
                  that.oGModel.setProperty("/SelectedProd", aSelectedItems[0].getTitle());

                  if(that.oGModel.getProperty("/SelectedLoc") !== "" &&  that.oGModel.getProperty("/SelectedProd") !== ""){
                  that.byId("idTimeSeries").setEnable(true);
                  that.byId("idFTimeSeries").setEnable(true);
                  } else {
                    that.byId("idTimeSeries").setEnable(false);
                    that.byId("idFTimeSeries").setEnable(false);
                  }
                  } 
                },

                onTimeS:function(){

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
                          MessageToast.show("Failed to get product data");
                        },
                      });



                },

                onTimeF:function(){

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
                          MessageToast.show("Failed to get product data");
                        },
                      });


                }

            





        });
    });
