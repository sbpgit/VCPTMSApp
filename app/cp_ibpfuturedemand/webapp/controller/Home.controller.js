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
      onInit: function () {
        that = this;
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
      onAfterRendering: function () {
        // sap.ui.core.BusyIndicator.show();

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
        if(that.byId("IBPfdemList").getItems().length){
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
      onResetDate: function () {
          that.oLoc.setValue("");
          that.oProd.setValue("");
          that.oVer.setValue("");
          that.oScen.setValue("");
        that.onAfterRendering();
      },
      onGetData: function (oEvent) {

        var Loc = that.byId("idloc").getValue(),
          Prod = that.byId("idprod").getValue(),
          ver = that.byId("idver").getValue(),
          scen = that.byId("idscen").getValue();

        if (Loc !== "" && Prod !== "" && ver !== "" && scen !== ""     ) {
            sap.ui.core.BusyIndicator.show();
          that.getModel("BModel").read("/getIBPFdem", {
            filters: [
                new Filter("LOCATION_ID", FilterOperator.EQ, Loc),
                new Filter("PRODUCT_ID", FilterOperator.EQ, Prod),
                new Filter("VERSION", FilterOperator.EQ, ver),
                new Filter("SCENARIO", FilterOperator.EQ, scen)
              ],
            success: function (oData) {
                oData.results.forEach(function (row) {
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
          sap.m.MessageToast.show(
            "Please select a Location/Product/Version/Scenario"
          );
        }
      },


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

      handleValueHelp: function (oEvent) {
        var sId = oEvent.getParameter("id");
        if (sId.includes("loc")) {
          that._valueHelpDialogLoc.open();
        } else if (sId.includes("prod")) {
          if (that.byId("idloc").getValue()) {
            that._valueHelpDialogProd.open();
          } else {
            MessageToast.show("Select Location");
          }
        } else if (sId.includes("ver")) {
          if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
            that._valueHelpDialogVer.open();
          } else {
            MessageToast.show("Select Location and Product");
          }
        } else if (sId.includes("scen")) {
          if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
            that._valueHelpDialogScen.open();
          } else {
            MessageToast.show("Select Location and Product");
          }
        } 
      },

      handleClose: function (oEvent) {
        var sId = oEvent.getParameter("id");
        if (sId.includes("Loc")) {
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
        } else if (sId.includes("Ver")) {
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
        } else if (sId.includes("Ver")) {
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

        } else if (sId.includes("Ver")) {
          this.oVer = that.byId("idver");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oVer.setValue(aSelectedItems[0].getTitle());
          that.oScen.setValue("");
          that.oGModel.setProperty(
            "/SelectedVer",
            aSelectedItems[0].getTitle()
          );

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

      onhandlePress:function(oEvent){

        var selRow = this.byId("IBPfdemList").getSelectedItems();
        that.oGModel = that.getModel("oGModel");

        var selItem = selRow[0].getBindingContext().getProperty();
            
            that.oGModel.setProperty("/sLoc", selItem.LOCATION_ID);
            that.oGModel.setProperty("/sProd", selItem.PRODUCT_ID);
            that.oGModel.setProperty("/sVer", selItem.VERSION);
            that.oGModel.setProperty("/sScen", selItem.SCENARIO);

           var week = new Date(selItem.WEEK_DATE),
                month = week.getMonth() + 1,
                day = week.getDate(),
                weekDate;
                if(month < 10){
                    month = "0" + month;
                }
                if(week.getDate() < 10){
                    day = "0" + week.getDate()
                }

                weekDate = week.getFullYear() + "-" + month + "-" + day ;

            that.oGModel.setProperty("/sWeek", weekDate);
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Detail", {}, true);
      },


      onSearch:function(oEvent){
          if(oEvent){
            var query = oEvent.getParameter("value") || oEvent.getParameter("newValue");
          } else {
            var query = that.byId("headSearch").getValue();
          }
        var oFilters = [];
        // Check if search filter is to be applied
        query = query ? query.trim() : "";
        
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("WEEK_DATE", FilterOperator.Contains, query),
                  new Filter("QUANTITY", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.byId("IBPfdemList").getBinding("items").filter(oFilters);

      }
      
    });
  }
);
