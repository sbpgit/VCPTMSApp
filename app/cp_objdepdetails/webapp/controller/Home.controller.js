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
        /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Models and size limits
        that.oModel = new JSONModel();
        that.oHdrModel = new JSONModel();
        that.oModel.setSizeLimit(2000);
        oGModel = that.getOwnerComponent().getModel("oGModel");
        // Declaring Dialogs
        if (!that._onObjDepChar) {
          that._onObjDepChar = sap.ui.xmlfragment(
            "cp.appf.cpobjdepdetails.view.ObjDepChar",
            that
          );
          that.getView().addDependent(that._onObjDepChar);
        }
      },

      /**
       * Called after the view has been rendered.
       * Result data will be set for left side table
       */
      onAfterRendering: function () {
        that = this;
        oGModel = this.getModel("oGModel");
        sap.ui.core.BusyIndicator.show();

        // Calling service to get data
        this.getModel("BModel").read("/getBomOdCond", {
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            that.oModel.setData({
              results: oData.results,
            });
            that.byId("objDepList").setModel(that.oModel);
          },
          error: function () {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * This function is called when click on item in left side(Obj Dep Table).
       * Based on selected item displaying data on rignt side panel (Obj Dep History Details).
       * In this function generating column names dynamically and binding dynamic data.
       * In this function creating data for Obj Dep History Details panel
       * @param {object} oEvent -the event information.
       */
      onhandlePress: function (oEvent) {
        oGModel = that.getOwnerComponent().getModel("oGModel");
        // Getting the selected values of left side table
        var oSelected = oEvent.getSource().getSelectedItem().getTitle(),
          oSelectedItem = oSelected.split("_"),
          oSelectedObjDep = oSelectedItem[0],
          oSelectedCounter = oSelectedItem[1];
        oGModel.setProperty("/objDep", oSelectedObjDep);
        oGModel.setProperty("/objCounter", oSelectedCounter);
        var oTable = that.getView().byId("idMyTable");
        that.oCharModel = new JSONModel();

        // Resetting table data.
        // Destroying the table columns.
        oTable.destroyColumns();
        // adding empty arry of data.
        var aaColList = new sap.m.ColumnListItem("aaColList", {
          cells: [],
        });
        // appending empty data to table.
        if (oTable) {
          oTable.setBusy(false);
          var dataModel = new JSONModel();
          dataModel.setSizeLimit(2000);
          dataModel.setData({ results: [] });
          oTable.setModel(dataModel);
          oTable.bindItems("/results", aaColList);
        }

        // Calling service to get the Character based on selected Obj Dep
        this.getModel("BModel").read("/getODcharval", {
          filters: [new Filter("OBJ_DEP", FilterOperator.EQ, oSelected)],

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

        // Calling service to get the Obj Dep History details
        this.getModel("BModel").callFunction("/genODHistory", {
          method: "GET",
          urlParameters: {
            OBJ_DEP: oSelectedObjDep,
            OBJ_COUNTER: oSelectedCounter,
          },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            // Creating the Obj Dep History details table
            if (oData.results.length !== 0) {
              // using for each function to change the date format
              oData.results.forEach(function (row) {
                row.CAL_DATE = new Date(
                  row.CAL_DATE.replace(/[^0-9]+/g, "") * 1
                );
              });

              var result = oData.results[0];
              var columnNo;

              // Getting the length to create column names
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
              // Adding 1 to column length to start column name from "1"
              columnNo = parseInt(columnNo) + 1;

              // Creating Column names based on data and appending column names to table
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

              // Looping through the lenth of columnNo to create column names
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

              // Generating table cells
              var cell1 = new sap.m.Text({
                text:
                  "{path: 'CAL_DATE' , type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'MM/dd/yyyy' }}",
              });
              oCell.push(cell1);

              var cell1 = new sap.m.Text({
                text: "{ODCOUNT}",
              });
              oCell.push(cell1);

              // Looping through the lenth of columnNo to create cells
              for (var i = 1; i < columnNo; i++) {
                var sRow = "{ROW_ID";
                var sText = "}";
                var cell1 = new sap.m.Text({ text: sRow + i + sText });

                oCell.push(cell1);
              }

              // Assigning cells to Column List Item
              var aColList = new sap.m.ColumnListItem("aColList", {
                cells: oCell,
              });

              // binding data to table
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
            // Calling function to create Obj Dep Prediction
            that.getODFuture();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * This function is called after the generation of dynamic table for Obj Dep History Details panel.
       * Based on selected item displaying data on rignt side panel (Obj Dep Prediction).
       * In this function generating column names dynamically and binding dynamic data.
       * @param {object} oEvent -the event information.
       */
      getODFuture: function () {
        oGModel = that.getOwnerComponent().getModel("oGModel");
        var oSelectedObjDep = oGModel.getProperty("/objDep");
        var oSelectedCounter = oGModel.getProperty("/objCounter");
        var oTable = that.getView().byId("idFutTable");

        // Resetting table data
        // Destroying columns.
        oTable.destroyColumns();
        // Adding empty array of data for column list item
        var futColList = new sap.m.ColumnListItem("futColList", {
          cells: [],
        });
        // Appending empty data for table to remove the previous data
        if (oTable) {
          oTable.setBusy(false);
          var futdataModel = new JSONModel();
          futdataModel.setSizeLimit(2000);
          futdataModel.setData({ futresults: [] });
          oTable.setModel(futdataModel);
          oTable.bindItems("/futresults", futColList);
        }

        sap.ui.core.BusyIndicator.show();
        // Calling service to get the Obj Dep Predictions
        that.getModel("BModel").callFunction("/genODFuture", {
          method: "GET",
          urlParameters: {
            OBJ_DEP: oSelectedObjDep,
            OBJ_COUNTER: oSelectedCounter,
          },
          success: function (oData) {
            // Creating Obj Dep Prediction table
            if (oData.results.length !== 0) {
              // Calling for each function to change the date fromat
              oData.results.forEach(function (row) {
                row.CAL_DATE = new Date(
                  row.CAL_DATE.replace(/[^0-9]+/g, "") * 1
                );
              });

              var result = oData.results[0];
              var columnNo;

              // Getting the length to create columns names
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
              // Adding 1 to column length to start column name from "1"
              columnNo = parseInt(columnNo) + 1;

              // Creating Column names based on data and appending column names to table
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

              // Looping through the lenth of columnNo to create column names
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

              // Generating table cells
              var cell1 = new sap.m.Text({
                text:
                  "{path: 'CAL_DATE' , type: 'sap.ui.model.type.Date', formatOptions: { pattern: 'MM/dd/yyyy' }}",
              });
              oCell.push(cell1);

              var cell1 = new sap.m.Text({
                //   text: "{ODCOUNT}",
                text:
                  "{path: 'ODCOUNT', type: 'sap.ui.model.type.Float', formatOptions: { maxFractionDigits: 3, roundingMode: 'HALF_AWAY_FROM_ZERO ' }}",
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

              // Looping through the lenth of columnNo to create cells
              for (var i = 1; i < columnNo; i++) {
                var sRow = "{ROW_ID";
                var sText = "}";
                var cell1 = new sap.m.Text({ text: sRow + i + sText });

                oCell.push(cell1);
              }

              var afutColList = new sap.m.ColumnListItem("afutColList", {
                cells: oCell,
              });

              // binding data to table
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

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onSearch: function (oEvent) {
        oGModel.setProperty("/objDep", "");
        that.byId("objDepList").removeSelections();
        that.byId("idhisPanel").setExpanded(false);
        that.byId("idFutPanel").setExpanded(false);
        var oHisTable = that.getView().byId("idMyTable");
        // Refreshing data of Obj Dep History and Future on search
        if (oHisTable.getItems().length !== 0) {
          var emptyHisColList = new sap.m.ColumnListItem("emptyHisColList", {
            cells: [],
          });

          if (oHisTable) {
            oHisTable.setBusy(false);
            var dataModel = new JSONModel();
            dataModel.setSizeLimit(2000);
            dataModel.setData({ results: [] });
            oHisTable.setModel(dataModel);
            oHisTable.bindItems("/results", emptyHisColList);
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
        }
        var sQuery = oEvent.getParameters("sQuery").sQuery;
        if (sQuery) {
          sQuery = sQuery + "_1";

          // Calling service to get the Obj Dep
          this.getModel("BModel").read("/getBomOdCond", {
            filters: [new Filter("OBJ_DEP", FilterOperator.EQ, sQuery)],
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

      /**
       * Called when click on Parameter Icon(spects Icon) button to open Parameters dialog.
       */
      onParameters: function () {
        that._onObjDepChar.open();
      },

      /**
       * Called when 'Close/Cancel' button in any dialog is pressed.
       */
      handleClose: function () {
        that._onObjDepChar.close();
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      oncharSearch: function (oEvent) {
        var sQuery = "",
          oFilters = [];
        if (oEvent) {
          var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue");
        }

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        sap.ui.getCore().byId("idChartab").getBinding("items").filter(oFilters);
      },
    });
  }
);
