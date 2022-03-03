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
        that.scenModel = new JSONModel();
        that.compModel = new JSONModel();
        that.struModel = new JSONModel();

        that.locModel.setSizeLimit(1000);
        that.prodModel.setSizeLimit(1000);
        that.verModel.setSizeLimit(1000);
        that.scenModel.setSizeLimit(1000);
        that.compModel.setSizeLimit(1000);
        that.struModel.setSizeLimit(1000);

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
        if (!this._valueHelpDialogComp) {
          this._valueHelpDialogComp = sap.ui.xmlfragment(
            "cpapp.cpcompreq.view.ComponentDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogComp);
        }
        if (!this._valueHelpDialogStru) {
          this._valueHelpDialogStru = sap.ui.xmlfragment(
            "cpapp.cpcompreq.view.StructureNodeDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogStru);
        }
      },
      onAfterRendering: function () {
        // sap.ui.core.BusyIndicator.show();

        that.oList = this.byId("idTab");
        this.oLoc = this.byId("idloc");
        this.oProd = this.byId("idprod");
        this.oVer = this.byId("idver");
        this.oScen = this.byId("idscen");
        this.oComp = this.byId("idcomp");
        this.oStru = this.byId("idstru");

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
        this.oCompList = this._oCore.byId(
          this._valueHelpDialogComp.getId() + "-list"
        );
        this.oStruList = this._oCore.byId(
          this._valueHelpDialogStru.getId() + "-list"
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
        that.byId("fromDate").setValue("");
        that.byId("toDate").setValue("");
        oGModel.setProperty("/resetFlag", "X");
          that.oLoc.setValue("");
          that.oProd.setValue("");
          that.oVer.setValue("");
          that.oScen.setValue("");
          that.oComp.setValue("");
          that.oStru.setValue("");
        that.onAfterRendering();
      },
      onGetData: function (oEvent) {
        var sRowData = {},
          iRowData = [],
          weekIndex;
        that.oTable = that.byId("idCompReq");
        that.oGModel = that.getModel("oGModel");

        var Loc = that.oGModel.getProperty("/SelectedLoc"),
          Prod = that.oGModel.getProperty("/SelectedProd"),
          ver = that.oGModel.getProperty("/SelectedVer"),
          scen = that.oGModel.getProperty("/SelectedScen"),
          comp = that.oGModel.getProperty("/SelectedComp"),
          stru = that.oGModel.getProperty("/SelectedStru");
        var vFromDate = this.byId("fromDate").getDateValue();
        var vToDate = this.byId("toDate").getDateValue();
        vFromDate = that.getDateFn(vFromDate);
        vToDate = that.getDateFn(vToDate);
        if (
          Loc !== undefined &&
          Prod !== undefined &&
          ver !== undefined &&
          scen !== undefined //&&
          //   comp !== undefined &&
          //   stru !== undefined
        ) {
          if (comp === undefined) {
            comp = "";
          }
          if (stru === undefined) {
            stru = "";
          }
          that.getModel("BModel").callFunction("/getCompReqFWeekly", {
            method: "GET",
            urlParameters: {
              LOCATION_ID: Loc,
              PRODUCT_ID: Prod,
              VERSION: ver,
              SCENARIO: scen,
              COMPONENT: comp,
              STRUCNODE: stru,
              FROMDATE: vFromDate,
              TODATE: vToDate,
            },
            success: function (data) {
              that.rowData = data.results;
              sap.ui.core.BusyIndicator.hide();

              that.oGModel.setProperty("/TData", data.results);
              that.TableGenerate();
            },
            error: function (data) {
              sap.m.MessageToast.show("Error While fetching data");
            },
          });
        } else {
          sap.m.MessageToast.show(
            "Please select a Location/Product/Version/Scenario"
          );
        }
      },

      onSearchCompReq: function (oEvent) {
        that.oTable = that.byId("idCompReq");
        that.oGModel = that.getModel("oGModel");

        var query =
          oEvent.getParameter("value") || oEvent.getParameter("newValue");
        that.Data = that.rowData;
        that.searchData = [];

        for (var i = 0; i < that.Data.length; i++) {
          if (
            that.Data[i].COMPONENT.includes(query) ||
            that.Data[i].STRUC_NODE.includes(query) ||
            that.Data[i].QTYTYPE.includes(query)
          ) {
            that.searchData.push(that.Data[i]);
          }
        }

        that.oGModel.setProperty("/TData", that.searchData);
        that.TableGenerate();
      },

      TableGenerate: function () {
        var sRowData = {},
          iRowData = [],
          weekIndex;

        that.oGModel = that.getModel("oGModel");
        that.tableData = that.oGModel.getProperty("/TData");

        var rowData;
        var fromDate = new Date(that.byId("fromDate").getDateValue()),
          toDate = new Date(that.byId("toDate").getDateValue());
        fromDate = fromDate.toISOString().split("T")[0];
        toDate = toDate.toISOString().split("T")[0];
        var liDates = that.generateDateseries(fromDate, toDate);

        for (var i = 0; i < that.tableData.length; i++) {
          sRowData.ItemNum = that.tableData[i].ITEM_NUM;
          sRowData.Component = that.tableData[i].COMPONENT;
          sRowData.StructureNode = that.tableData[i].STRUC_NODE;
          sRowData.Type = that.tableData[i].QTYTYPE;
          weekIndex = 1;
          for (let index = 4; index < liDates.length; index++) {
            sRowData[liDates[index].CAL_DATE] =
              that.tableData[i]["WEEK" + weekIndex];
            weekIndex++;
          }
          iRowData.push(sRowData);
          sRowData = {};
        }
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({
          rows: iRowData,
          columns: liDates,
        });
        that.oTable.setModel(oModel);
        that.oTable.bindColumns("/columns", function (sId, oContext) {
          var columnName = oContext.getObject().CAL_DATE;
          return new sap.ui.table.Column({
            width: "8rem",
            label: columnName,
            template: columnName,
          });
          // }
        });

        that.oTable.bindRows("/rows");
      },

      generateDateseries: function (imFromDate, imToDate) {
        var lsDates = {},
          liDates = [];
        var vDateSeries = imFromDate;

        lsDates.CAL_DATE = "Component";
        liDates.push(lsDates);
        lsDates = {};
        lsDates.CAL_DATE = "ItemNum";
        liDates.push(lsDates);
        lsDates = {};
        lsDates.CAL_DATE = "StructureNode";
        liDates.push(lsDates);
        lsDates = {};
        lsDates.CAL_DATE = "Type";
        liDates.push(lsDates);
        lsDates = {};
        
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
          return (
            arr.map((mapObj) => mapObj.CAL_DATE).indexOf(obj.CAL_DATE) == pos
          );
        });
        return lireturn;
      },
      getNextSunday: function (imDate) {
        const lDate = new Date(imDate);
        let lDay = lDate.getDay();
        if (lDay !== 0) lDay = 7 - lDay;
        const lNextSun = new Date(
          lDate.getFullYear(),
          lDate.getMonth(),
          lDate.getDate() + lDay
        );

        return lNextSun.toISOString().split("T")[0];
      },
      addDays: function (imDate, imDays) {
        const lDate = new Date(imDate);
        const lNextWeekDay = new Date(
          lDate.getFullYear(),
          lDate.getMonth(),
          lDate.getDate() + imDays
        );

        return lNextWeekDay.toISOString().split("T")[0];
      },
      removeDays: function (imDate, imDays) {
        const lDate = new Date(imDate);
        const lNextWeekDay = new Date(
          lDate.getFullYear(),
          lDate.getMonth(),
          lDate.getDate() - imDays
        );

        return lNextWeekDay.toISOString().split("T")[0];
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
        } else if (sId.includes("idcomp")) {
          if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
            that._valueHelpDialogComp.open();
          } else {
            MessageToast.show("Select Location and Product");
          }
        } else if (sId.includes("stru")) {
          if (that.byId("idloc").getValue() && that.byId("idprod").getValue()) {
            that._valueHelpDialogStru.open();
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
        } else if (sId.includes("Comp")) {
          that._oCore
            .byId(this._valueHelpDialogComp.getId() + "-searchField")
            .setValue("");
          if (that.oCompList.getBinding("items")) {
            that.oCompList.getBinding("items").filter([]);
          }
        } else if (sId.includes("Stru")) {
          that._oCore
            .byId(this._valueHelpDialogStru.getId() + "-searchField")
            .setValue("");
          if (that.oStruList.getBinding("items")) {
            that.oStruList.getBinding("items").filter([]);
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
          that.oScenList.getBinding("items").filter(oFilters);
        } else if (sId.includes("Comp")) {
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("COMPONENT", FilterOperator.Contains, query),
                  new Filter("ITEM_NUM", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oCompList.getBinding("items").filter(oFilters);
        } else if (sId.includes("Stru")) {
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("STRUC_NODE", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oStruList.getBinding("items").filter(oFilters);
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
          that.oComp.setValue("");
          that.oStru.setValue("");
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
          that.oComp.setValue("");
          that.oStru.setValue("");

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

          this.getModel("BModel").read("/gBomHeaderet", {
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
              that.compModel.setData(oData);
              that.oCompList.setModel(that.compModel);
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
        } else if (sId.includes("Comp")) {
          this.oComp = that.byId("idcomp");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oComp.setValue(aSelectedItems[0].getTitle());
          that.oGModel.setProperty(
            "/SelectedComp",
            aSelectedItems[0].getTitle()
          );
          that.oGModel.setProperty(
            "/SelectedCompItem",
            aSelectedItems[0].getDescription()
          );

          that.oStru.setValue("");

          this.getModel("BModel").read("/genCompStrcNode", {
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
                "COMPONENT",
                FilterOperator.EQ,
                that.oGModel.getProperty("/SelectedComp")
              ),
              new Filter(
                "ITEM_NUM",
                FilterOperator.EQ,
                that.oGModel.getProperty("/SelectedCompItem")
              ),
            ],
            success: function (oData) {
              that.struModel.setData(oData);
              that.oStruList.setModel(that.struModel);
            },
            error: function (oData, error) {
              MessageToast.show("error");
            },
          });
        } else if (sId.includes("Stru")) {
          this.oStru = that.byId("idstru");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oStru.setValue(aSelectedItems[0].getTitle());
          that.oGModel.setProperty(
            "/SelectedStru",
            aSelectedItems[0].getTitle()
          );
        }
        that.handleClose(oEvent);
      },
      getDateFn: function (imDate) {
        var vMonth, vDate, exDate;
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
        return (imDate = imDate.getFullYear() + "-" + vMonth + "-" + vDate);
      },
    });
  }
);
