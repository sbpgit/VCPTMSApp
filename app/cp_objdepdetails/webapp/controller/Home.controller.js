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
          var selected = oEvent
              .getSource()
              .getSelectedItem()
              .getTitle()
              .split("_"),
            selectedObjDep = selected[0],
            selectedCounter = selected[1];
          oGModel.setProperty("/objDep", selectedObjDep);
          var oTable = that.getView().byId("idMyTable");
          oTable.destroyColumns();

          var aaColList = new sap.m.ColumnListItem("aaColList", {
            cells: [],
          });

          if (oTable) {
            oTable.setBusy(false);
            var dataModel = new JSONModel();
            dataModel.setSizeLimit(1000);
            dataModel.setData({ results: [] });
            oTable.setModel(dataModel);
            oTable.bindItems("/results", aaColList);
          }

          // sap.ui.core.BusyIndicator.show();

          this.getModel("BModel").callFunction("/genODHistory", {
            method: "GET",
            urlParameters: {
              OBJ_DEP: selectedObjDep,
              OBJ_COUNTER: selectedCounter,
            },
            success: function (oData) {
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
                  text: "ODCOUNT",
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
                dataModel.setSizeLimit(1000);
                dataModel.setData({ results: oData.results });
                oTable.setModel(dataModel);
                oTable.bindItems("/results", aColList);
              }

              that.byId("idhisPanel").setExpanded(true);
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
            futdataModel.setSizeLimit(1000);
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

              var oColumn = new sap.m.Column("colweek", {
                header: new sap.m.Text({
                  text: "WeeK",
                }),
              });
              oTable.addColumn(oColumn);

              var oColumn = new sap.m.Column("colcounter", {
                header: new sap.m.Text({
                  text: "ODCOUNT",
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

              var futColList = new sap.m.ColumnListItem("futColList", {
                cells: oCell,
              });

              if (oTable) {
                oTable.setBusy(false);
                var futdataModel = new JSONModel();
                futdataModel.setSizeLimit(1000);
                futdataModel.setData({ futresults: oData.results });
                oTable.setModel(futdataModel);
                oTable.bindItems("/futresults", futColList);
              }
              that.byId("idFutPanel").setExpanded(true);
              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },
        onSearch: function (oEvent) {
          var query =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];

          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("OBJ_DEP", FilterOperator.Contains, query),
                  new Filter("OBJ_DEP", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.byId("objDepList").getBinding("items").filter(oFilters);
        }



      });
  });
