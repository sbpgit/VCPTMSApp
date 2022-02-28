sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cpapp/cpcompreq/controller/BaseController",
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
      return BaseController.extend("cpapp.cpcompreq.controller.Home", {
        onInit: function () {
            that = this;
          this.rowData;
          that.locModel = new JSONModel();
          that.prodModel = new JSONModel();
          that.verModel = new JSONModel();
          that.scenDepModel = new JSONModel();
  
          that.locModel.setSizeLimit(1000);
          that.prodModel.setSizeLimit(1000);
          that.verModel.setSizeLimit(1000);
          that.scenDepModel.setSizeLimit(1000);
  
          this._oCore = sap.ui.getCore();
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cpapp.cpcompreq.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cpapp.cpcompreq.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }
          if (!this._valueHelpDialogVer) {
            this._valueHelpDialogVer = sap.ui.xmlfragment(
              "cpapp.cpcompreq.view.VersionDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogVer);
          }
          if (!this._valueHelpDialogScen) {
            this._valueHelpDialogScen = sap.ui.xmlfragment(
              "cpapp.cpcompreq.view.ScenarioDialog",
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
  
  
  
  
          that.oTable = that.byId("idCompReq")
          oGModel = that.getView().getModel("oGModel");
          that.getModel("BModel").callFunction("/getCompReqFWeekly", {
              method: "GET",
              urlParameters: {
                  LOCATION_ID: "MX32",
                  PRODUCT_ID: "57K0M",
                  VERSION: "BSL_1.1",
                  SCENARIO:"BSL_1.1_SCENARIO"
              },
              success: function (data) {
                  that.rowData = data.results;
                  sap.ui.core.BusyIndicator.hide();
              },
              error: function (data) {
                  sap.m.MessageToast.show(JSON.stringify(data));
                },
            });
  
        },
        onResetDate: function () {
          that.byId("fromDate").setValue("");
          that.byId("toDate").setValue("");
          oGModel.setProperty("/resetFlag", "X");
          that.onAfterRendering();
        },
        onGetData: function (oEvent) {
            var rowData;
          var fromDate = new Date(that.byId("fromDate").getDateValue()),
            toDate = new Date(that.byId("toDate").getDateValue());
          fromDate = fromDate.toISOString().split('T')[0];
          toDate = toDate.toISOString().split('T')[0];
          var liDates = that.generateDateseries(fromDate, toDate);
          
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData({
              rows: that.rowData,
              columns: liDates
  
          });
          that.oTable.setModel(oModel);
          that.oTable.bindColumns("/columns", function(sId, oContext) {
              var columnName = oContext.getObject().CAL_DATE;
              return new sap.ui.table.Column({
                  width:"11rem",
                  label: columnName,
                  template: columnName,
              });
          });
          
          that.oTable.bindRows("/rows");
        },
        generateDateseries: function (imFromDate, imToDate) {
          var lsDates = {},
            liDates = [];
          var vDateSeries = imFromDate;
          lsDates.CAL_DATE="Item Num";
          liDates.push(lsDates);
          lsDates = {};
          lsDates.CAL_DATE="Component";
          liDates.push(lsDates);
          lsDates = {};
          //lsDates.CAL_DATE = that.removeDays(that.getNextSunday(vDateSeries), 1);
          lsDates.CAL_DATE = that.getNextSunday(vDateSeries);
          liDates.push(lsDates);
          lsDates = {};
          while (vDateSeries <= imToDate) {
            vDateSeries = that.addDays(vDateSeries, 7);
            lsDates.CAL_DATE = that.getNextSunday(vDateSeries);
            liDates.push(lsDates);
            lsDates = {};
          }
          // remove duplicates
          var lireturn = liDates.filter((obj, pos, arr) => {
              return arr
                .map(mapObj => mapObj.CAL_DATE)
                .indexOf(obj.CAL_DATE) == pos;
            });
          return lireturn;
        },
        getNextSunday:function(imDate){
          const lDate = new Date(imDate);
          let lDay = lDate.getDay();
          if (lDay !== 0) lDay = 7 - lDay;
          const lNextSun = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() + lDay);
  
          return lNextSun.toISOString().split('T')[0];
        },
        addDays: function(imDate, imDays) {
          const lDate = new Date(imDate);
          const lNextWeekDay = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() + imDays);
  
          return lNextWeekDay.toISOString().split('T')[0];
     
        }, 
        removeDays: function(imDate, imDays) {
          const lDate = new Date(imDate);
          const lNextWeekDay = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() - imDays);
  
          return lNextWeekDay.toISOString().split('T')[0];
        
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
            
              that._valueHelpDialogVer.open();
            
          } else if (sId.includes("scen")) {
            
              that._valueHelpDialogScen.open();
            
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
          } else if (sId.includes("ver")) {
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
          } else if (sId.includes("ver")) {
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
            that.oObjDepList.getBinding("items").filter(oFilters);
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
                MessageToast.show("error");
              },
            });
  
            // Prod list
          } else if (sId.includes("prod")) {
              that.oProd = that.byId("idprod");
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oProd.setValue(aSelectedItems[0].getTitle());
              that.oGModel.setProperty("/SelectedProd", aSelectedItems[0].getTitle());
  
  
          } else if (sId.includes("ver")) {
              this.oVer = that.byId("idver");
            
          } else if (sId.includes("scen")) {
            this.oScen = that.byId("idscen");
            
          }
          that.handleClose(oEvent);
        },
  
      });
    }
  );
  