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
            that.verModel = new JSONModel();
            that.scenModel = new JSONModel();

            that.locModel.setSizeLimit(1000);
            that.prodModel.setSizeLimit(1000);
            that.verModel.setSizeLimit(1000);
            that.scenModel.setSizeLimit(1000);

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
                this.oVerList = this._oCore.byId(
                    this._valueHelpDialogVer.getId() + "-list"
                );
                this.oScenList = this._oCore.byId(
                    this._valueHelpDialogScen.getId() + "-list"
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
                that.oGModel = that.getModel("oGModel");
                var sId = oEvent.getParameter("id");
                if (sId.includes("loc")) {
                    that.oGModel.setProperty("/LocInput", "TL");
                  that._valueHelpDialogLoc.open();
                } else if (sId.includes("Prod")) {
                  if (that.byId("idloc").getValue()) {
                    that.oGModel.setProperty("/ProdInput", "TP")
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
                  } else if (sId.includes("ver")) {
                    if (that.byId("idloComp").getValue() && that.byId("idProComp").getValue()) {
                        that._valueHelpDialogVer.open();
                      } else {
                        MessageToast.show("Select Location and Product");
                      }            
                  }  else if (sId.includes("scen")) {
                    if (that.byId("idloComp").getValue() && that.byId("idProComp").getValue()) {
                        that._valueHelpDialogScen.open();
                      } else {
                        MessageToast.show("Select Location and Product");
                      } 
                  }

                    if(sId.includes("Prod") || sId.includes("ProComp")){
                        var SelectedLocation;
                        if(sId.includes("Prod")){
                            SelectedLocation = that.byId("idloc").getValue();
                        } else if(sId.includes("ProComp")){
                            SelectedLocation = that.byId("idloComp").getValue();
                        }
                        if(SelectedLocation){
                            sap.ui.core.BusyIndicator.show();
                            this.getModel("BModel").read("/getLocProdDet", {
                                filters: [
                                  new Filter("LOCATION_ID", FilterOperator.EQ, SelectedLocation),
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
                }  else if (sId.includes("Ver")) {
                    that._oCore
                      .byId(this._valueHelpDialogVer.getId() + "-searchField")
                      .setValue("");
                    if (that.oVerList.getBinding("items")) {
                      that.oVerList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("scen")) {
                    that._oCore
                      .byId(this._valueHelpDialogScen.getId() + "-searchField")
                      .setValue("");
                    if (that.oScenList.getBinding("items")) {
                      that.oScenList.getBinding("items").filter([]);
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
                else if (sId.includes("ver")) {
                    if (query !== "") {
                      oFilters.push(
                        new Filter({
                          filters: [
                            new Filter("VERSION", FilterOperator.Contains, query),
                          ],
                          and: false,
                        })
                      );
                    }
                    that.oVerList.getBinding("items").filter(oFilters);
                } else if (sId.includes("scen")) {
                    if (query !== "") {
                      oFilters.push(
                        new Filter({
                          filters: [
                            new Filter("SCENARIO", FilterOperator.Contains, query),
                          ],
                          and: false,
                        })
                      );
                    }
                    that.oScenList.getBinding("items").filter(oFilters);
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
                    var locType = that.oGModel.getProperty("/LocInput");

                    if(locType === "TL"){
                        this.oProd = that.byId("idProd");
                        this.oLoc = that.byId("idloc");
                        aSelectedItems = oEvent.getParameter("selectedItems");
                        that.oLoc.setValue(aSelectedItems[0].getTitle());
                        that.oGModel.setProperty("/SelectedLoc", aSelectedItems[0].getTitle());
                        that.oProd.setValue("");
                        that.byId("idTimeSeries").setEnabled(false);
                            that.byId("idFTimeSeries").setEnabled(false);
                        that.oGModel.setProperty("/SelectedProd", "");

                    } else if(locType === "CL"){
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
                    var ProdType = that.oGModel.getProperty("/ProdInput");
                    if(ProdType === "TP"){

                        this.oProd = that.byId("idProd");
                        aSelectedItems = oEvent.getParameter("selectedItems");
                        that.oProd.setValue(aSelectedItems[0].getTitle());
                        that.oGModel.setProperty("/SelectedProd", aSelectedItems[0].getTitle());

                        if(that.oGModel.getProperty("/SelectedLoc") !== "" &&  that.oGModel.getProperty("/SelectedProd") !== ""){
                            that.byId("idTimeSeries").setEnabled(true);
                            that.byId("idFTimeSeries").setEnabled(true);
                        } else {
                            that.byId("idTimeSeries").setEnabled(false);
                            that.byId("idFTimeSeries").setEnabled(false);
                        }
                        
                    } else  if(ProdType === "CP"){
                        this.oLoc = that.byId("idloComp");
                        this.oProd = that.byId("idProComp");
                        that.oVer = that.byId("idver");
                        that.oScen = that.byId("idscen");
                        aSelectedItems = oEvent.getParameter("selectedItems");
                        that.oProd.setValue(aSelectedItems[0].getTitle());
                        that.byId("buttonCompReq").setEnabled(false);
                        that.oVer.setValue("");
                        that.oScen.setValue("");

                        this.getModel("BModel").read("/getIbpVerScn", {
                            filters: [
                              new Filter("LOCATION_ID",FilterOperator.EQ, that.byId("idloComp").getValue()),
                              new Filter("PRODUCT_ID",FilterOperator.EQ, that.byId("idProComp").getValue()),
                            ],
                            success: function (oData) {
                              that.verModel.setData(oData);
                              that.oVerList.setModel(that.verModel);
            
                              that.scenModel.setData(oData);
                              that.oScenList.setModel(that.scenModel);
                            },
                            error: function (oData, error) {
                              MessageToast.show("error");
                            },
                          });
                    }

                  
                }  else if (sId.includes("Ver")) {
                    this.oVer = that.byId("idver");
                    that.oScen = that.byId("idscen");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oVer.setValue(aSelectedItems[0].getTitle());
                    that.oScen.setValue("");
                    that.byId("buttonCompReq").setEnabled(false);

                    this.getModel("BModel").read("/getIbpVerScn", {
                        filters: [
                          new Filter("LOCATION_ID",FilterOperator.EQ, that.byId("idloComp").getValue()),
                          new Filter("PRODUCT_ID",FilterOperator.EQ, that.byId("idProComp").getValue()),
                          new Filter("VERSION",FilterOperator.EQ, aSelectedItems[0].getTitle()),
                        ],
                        success: function (oData) {
        
                          that.scenModel.setData(oData);
                          that.oScenList.setModel(that.scenModel);
                        },
                        error: function (oData, error) {
                          MessageToast.show("error");
                        },
                      });
                  
                } else if (sId.includes("scen")) {
                  this.oScen = that.byId("idscen");
                  aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oScen.setValue(aSelectedItems[0].getTitle());
                    // that.oGModel.setProperty("/SelectedScen", aSelectedItems[0].getTitle());
                    that.byId("buttonCompReq").setEnabled(true);
                  
                }
                },

                onTimeS:function(){
                    var Selloc =that.oGModel.getProperty("/SelectedLoc"),
                        Selprod = that.oGModel.getProperty("/SelectedProd"); 

                    this.getModel("BModel").callFunction("/generate_timeseries", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: Selloc,
                            PRODUCT_ID: Selprod,
                        },
                        success: function (oData) {
                            MessageToast.show("TimeSeries Generated");
                        },
                        error: function (oData, error) {
                          MessageToast.show("Failed to generate TimeSeries");
                        },
                      });



                },

                onTimeF:function(){

                    var Selloc =that.oGModel.getProperty("/SelectedLoc"),
                    Selprod = that.oGModel.getProperty("/SelectedProd"); 

                this.getModel("BModel").callFunction("/generate_timeseriesF", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: Selloc,
                        PRODUCT_ID: Selprod,
                    },
                    success: function (oData) {
                        MessageToast.show("Future TimeSeries Generated");
                    },
                    error: function (oData, error) {
                      MessageToast.show("Failed to generate future TimeSeries");
                    },
                  });


                },

                onCompReq:function(){

                    var Selloc = that.byId("idloComp").getValue(),
                        Selprod = that.byId("idProComp").getValue(),
                        selVer = that.byId("idver").getValue(),
                        selScen = that.byId("idscen").getValue(); 

                this.getModel("BModel").callFunction("/getCompreqQty", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: Selloc,
                        PRODUCT_ID: Selprod,
                        VERSION: selVer,
                        SCENARIO : selScen,
                    },
                    success: function (oData) {
                        MessageToast.show("Generated components requirments");
                    },
                    error: function (oData, error) {
                      MessageToast.show("Failed to generate Components Requirments");
                    },
                  });

                }

            





        });
    });
