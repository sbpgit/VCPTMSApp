sap.ui.define(
  [
    "cp/appf/cpobjdepdetails/controller/BaseController",
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

    return BaseController.extend(
      "cp.appf.cpobjdepdetails.controller.ItemMaster",
      {
        onInit: function () {
          that = this;
          that.oModel = new JSONModel();
          that.oHdrModel = new JSONModel();
          that.oModel.setSizeLimit(2000);
          oGModel = that.getOwnerComponent().getModel("oGModel");
          if (!that._onObjDepChar) {
            that._onObjDepChar = sap.ui.xmlfragment(
              "cp.appf.cpobjdepdetails.view.ObjDepChar",
              that
            );
            that.getView().addDependent(that._onObjDepChar);
          }
        },
        // Refreshing Master Data
        refreshMaster: function () {
          this.onAfterRendering();
        },
        onAfterRendering: function () {
          that = this;
          oGModel = this.getModel("oGModel");
          sap.ui.core.BusyIndicator.show();

          this.getModel("BModel").read("/getBomOdCond", {
            success: function (oData) {
              that.oModel.setData({
                results: oData.results,
              });
              that.byId("objDepList").setModel(that.oModel);
              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },

        onhandlePress: function (oEvent) {
          oGModel = that.getOwnerComponent().getModel("oGModel");
          var selected = oEvent.getSource().getSelectedItem().getTitle(),
            selectedItem = selected.split("_"),
            selectedObjDep = selectedItem[0],
            selectedCounter = selectedItem[1];
          oGModel.setProperty("/objDep", selectedObjDep);
          oGModel.setProperty("/objCounter", selectedCounter);
          var oTable = that.getView().byId("idMyTable");
          that.oCharModel = new JSONModel();
          oTable.destroyColumns();

          var aaColList = new sap.m.ColumnListItem("aaColList", {
            cells: [],
          });

          if (oTable) {
            oTable.setBusy(false);
            var dataModel = new JSONModel();
            dataModel.setSizeLimit(2000);
            dataModel.setData({ results: [] });
            oTable.setModel(dataModel);
            oTable.bindItems("/results", aaColList);
          }

          this.getModel("BModel").read("/getODcharval", {
            filters: [new Filter("OBJ_DEP", FilterOperator.EQ, selected)],

            success: function (oData) {
              that.oCharModel.setData({
                charResults: oData.results,
              });
              sap.ui.getCore().byId("idChartab").setModel(that.oCharModel);
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });

          // sap.ui.core.BusyIndicator.show();

          this.getModel("BModel").callFunction("/genODHistory", {
            method: "GET",
            urlParameters: {
              OBJ_DEP: selectedObjDep,
              OBJ_COUNTER: selectedCounter,
            },
            success: function (oData) {
              if (oData.results.length !== 0) {
                oData.results.forEach(function (row) {
                  row.CAL_DATE = new Date(
                    row.CAL_DATE.replace(/[^0-9]+/g, "") * 1
                  );
                });

                var result = oData.results[0];
                var columnNo;

                if (!(result.ROW_ID1 !== undefined)) {
                  columnNo = 0;
                } else if (!(result.ROW_ID2 !== undefined)) {
                  columnNo = 1;
                } else if (!(result.ROW_ID3 !== undefined)) {
                  columnNo = 2;
                } else if (!(result.ROW_ID4 !== undefined)) {
                  columnNo = 3;
                } else if (!(result.ROW_ID5 !== undefined)) {
                  columnNo = 4;
                } else if (!(result.ROW_ID6 !== undefined)) {
                  columnNo = 5;
                } else if (!(result.ROW_ID7 !== undefined)) {
                  columnNo = 6;
                } else if (!(result.ROW_ID8 !== undefined)) {
                  columnNo = 7;
                } else if (!(result.ROW_ID9 !== undefined)) {
                  columnNo = 8;
                } else if (!(result.ROW_ID10 !== undefined)) {
                  columnNo = 9;
                } else if (!(result.ROW_ID11 !== undefined)) {
                  columnNo = 10;
                } else if (!(result.ROW_ID12 !== undefined)) {
                  columnNo = 11;
                }

                var oTable = that.getView().byId("idMyTable");
                columnNo = parseInt(columnNo) + 1;

                var oColumn = new sap.m.Column("colweek", {
                  header: new sap.m.Text({
                    text: "WeeK",
                  }),
                });
                oTable.addColumn(oColumn);

                var oColumn = new sap.m.Column("colcounter", {
                  header: new sap.m.Text({
                    text: "ODCount",
                  }),
                });
                oTable.addColumn(oColumn);

                for (var i = 1; i < columnNo; i++) {
                  var oColumn = new sap.m.Column("col" + i, {
                    hAlign: "Center",
                    header: new sap.m.Text({
                      text: "ROW_ID" + i,
                    }),
                  });
                  oTable.addColumn(oColumn);
                }

                var oCell = [];

                var cell1 = new sap.m.Text({
                  text:
                    "{path: 'CAL_DATE' , type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'MM/dd/yyyy' }}",
                });
                oCell.push(cell1);

                var cell1 = new sap.m.Text({
                  text: "{ODCOUNT}",
                });
                oCell.push(cell1);

                for (var i = 1; i < columnNo; i++) {
                  var test = "{ROW_ID";
                  var test1 = "}";
                  var cell1 = new sap.m.Text({ text: test + i + test1 });

                  oCell.push(cell1);
                }

                var aColList = new sap.m.ColumnListItem("aColList", {
                  cells: oCell,
                });

                if (oTable) {
                  oTable.setBusy(false);
                  var dataModel = new JSONModel();
                  dataModel.setSizeLimit(2000);
                  dataModel.setData({ results: oData.results });
                  oTable.setModel(dataModel);
                  oTable.bindItems("/results", aColList);
                }

                that.byId("idhisPanel").setExpanded(true);
              }
              that.getODFuture();

              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },

        getODFuture: function () {
          oGModel = that.getOwnerComponent().getModel("oGModel");
          var selectedObjDep = oGModel.getProperty("/objDep");
          var selectedCounter = oGModel.getProperty("/objCounter");
          var oTable = that.getView().byId("idFutTable");
          oTable.destroyColumns();

          var futColList = new sap.m.ColumnListItem("futColList", {
            cells: [],
          });

          if (oTable) {
            oTable.setBusy(false);
            var futdataModel = new JSONModel();
            futdataModel.setSizeLimit(2000);
            futdataModel.setData({ futresults: [] });
            oTable.setModel(futdataModel);
            oTable.bindItems("/futresults", futColList);
          }

          // sap.ui.core.BusyIndicator.show();

          that.getModel("BModel").callFunction("/genODFuture", {
            method: "GET",
            urlParameters: {
              OBJ_DEP: selectedObjDep,
              OBJ_COUNTER: selectedCounter,
            },
            success: function (oData) {
              if (oData.results.length !== 0) {
                oData.results.forEach(function (row) {
                  row.CAL_DATE = new Date(
                    row.CAL_DATE.replace(/[^0-9]+/g, "") * 1
                  );
                });

                var result = oData.results[0];
                var columnNo;

                if (!(result.ROW_ID1 !== undefined)) {
                  columnNo = 0;
                } else if (!(result.ROW_ID2 !== undefined)) {
                  columnNo = 1;
                } else if (!(result.ROW_ID3 !== undefined)) {
                  columnNo = 2;
                } else if (!(result.ROW_ID4 !== undefined)) {
                  columnNo = 3;
                } else if (!(result.ROW_ID5 !== undefined)) {
                  columnNo = 4;
                } else if (!(result.ROW_ID6 !== undefined)) {
                  columnNo = 5;
                } else if (!(result.ROW_ID7 !== undefined)) {
                  columnNo = 6;
                } else if (!(result.ROW_ID8 !== undefined)) {
                  columnNo = 7;
                } else if (!(result.ROW_ID9 !== undefined)) {
                  columnNo = 8;
                } else if (!(result.ROW_ID10 !== undefined)) {
                  columnNo = 9;
                } else if (!(result.ROW_ID11 !== undefined)) {
                  columnNo = 10;
                } else if (!(result.ROW_ID12 !== undefined)) {
                  columnNo = 11;
                }

                var oTable = that.getView().byId("idFutTable");
                columnNo = parseInt(columnNo) + 1;

                var oColumn = new sap.m.Column("futcolweek", {
                  header: new sap.m.Text({
                    text: "WeeK",
                  }),
                });
                oTable.addColumn(oColumn);

                var oColumn = new sap.m.Column("futcolcounter", {
                  header: new sap.m.Text({
                    text: "ODCount",
                  }),
                });
                oTable.addColumn(oColumn);

                var oColumn = new sap.m.Column("futVersion", {
                  header: new sap.m.Text({
                    text: "Version",
                  }),
                });
                oTable.addColumn(oColumn);

                var oColumn = new sap.m.Column("futScenario", {
                  header: new sap.m.Text({
                    text: "Scenario ",
                  }),
                });
                oTable.addColumn(oColumn);

                for (var i = 1; i < columnNo; i++) {
                  var oColumn = new sap.m.Column("futcol" + i, {
                    hAlign: "Center",
                    header: new sap.m.Text({
                      text: "ROW_ID" + i,
                    }),
                  });
                  oTable.addColumn(oColumn);
                }

                var oCell = [];

                var cell1 = new sap.m.Text({
                  text:
                    "{path: 'CAL_DATE' , type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'MM/dd/yyyy' }}",
                });
                oCell.push(cell1);

                var cell1 = new sap.m.Text({
                  text: "{ODCOUNT}",
                });
                oCell.push(cell1);

                var cell1 = new sap.m.Text({
                  text: "{VERSION}",
                });
                oCell.push(cell1);

                var cell1 = new sap.m.Text({
                  text: "{SCENARIO}",
                });
                oCell.push(cell1);

                for (var i = 1; i < columnNo; i++) {
                  var test = "{ROW_ID";
                  var test1 = "}";
                  var cell1 = new sap.m.Text({ text: test + i + test1 });

                  oCell.push(cell1);
                }

                var afutColList = new sap.m.ColumnListItem("afutColList", {
                  cells: oCell,
                });

                if (oTable) {
                  oTable.setBusy(false);
                  var futdataModel = new JSONModel();
                  futdataModel.setSizeLimit(2000);
                  futdataModel.setData({ futresults: oData.results });
                  oTable.setModel(futdataModel);
                  oTable.bindItems("/futresults", afutColList);
                }
                that.byId("idFutPanel").setExpanded(true);
              }
              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },
        onSearch: function (oEvent) {
          //   var query = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          //     oFilters = [];

          //   if (query !== "") {
          //     oFilters.push(
          //       new Filter({
          //         filters: [
          //           new Filter("OBJ_DEP", FilterOperator.Contains, query),
          //           new Filter("OBJ_DEP", FilterOperator.Contains, query),
          //         ],
          //         and: false,
          //       })
          //     );
          //   }
          //   that.byId("objDepList").getBinding("items").filter(oFilters);
          oGModel.setProperty("/objDep", "");
          that.byId("objDepList").removeSelections();
          that.byId("idhisPanel").setExpanded(false);
          that.byId("idFutPanel").setExpanded(false);
          var ohisTable = that.getView().byId("idMyTable");
          var emptyHisColList = new sap.m.ColumnListItem("emptyHisColList", {
            cells: [],
          });

          if (ohisTable) {
            ohisTable.setBusy(false);
            var dataModel = new JSONModel();
            dataModel.setSizeLimit(2000);
            dataModel.setData({ results: [] });
            ohisTable.setModel(dataModel);
            ohisTable.bindItems("/results", emptyHisColList);
          }

          var oFutTable = that.getView().byId("idFutTable");
          var emptyfutColList = new sap.m.ColumnListItem("emptyfutColList", {
            cells: [],
          });

          if (oFutTable) {
            oFutTable.setBusy(false);
            var futdataModel = new JSONModel();
            futdataModel.setSizeLimit(2000);
            futdataModel.setData({ futresults: [] });
            oFutTable.setModel(futdataModel);
            oFutTable.bindItems("/futresults", emptyfutColList);
          }

          var query = oEvent.getParameters("query").query;
          if (query) {
            query = query + "_1";
          
          

          this.getModel("BModel").read("/getBomOdCond", {
            filters: [new Filter("OBJ_DEP", FilterOperator.EQ, query)],
            success: function (oData) {
              that.oModel.setData({
                results: oData.results,
              });
              that.byId("objDepList").setModel(that.oModel);
              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        } else {
            that.onAfterRendering();
        }
        },

        onParameters: function () {
          // if (!that._onObjDepChar) {
          //     that._onObjDepChar = sap.ui.xmlfragment(
          //       "cp.appf.cpobjdepdetails.view.ObjDepChar",
          //       that
          //     );
          //     that.getView().addDependent(that._onObjDepChar);
          //   }

          that._onObjDepChar.open();
        },

        handleClose: function () {
          that._onObjDepChar.close();
        },

        oncharSearch: function (oEvent) {
          var query = "",
            oFilters = [];
          if (oEvent) {
            var query =
              oEvent.getParameter("value") || oEvent.getParameter("newValue");
          }

          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("CLASS_NAME", FilterOperator.Contains, query),
                  new Filter("CHAR_NAME", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          sap.ui
            .getCore()
            .byId("idChartab")
            .getBinding("items")
            .filter(oFilters);
        },
      }
    );
  }
);
