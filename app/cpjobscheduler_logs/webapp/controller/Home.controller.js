sap.ui.define(
  [
    "cpapp/cpjobschedulerlogs/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    BaseController,
    JSONModel,
    MessageToast,
    MessageBox,
    Filter,
    FilterOperator
  ) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("cpapp.cpjobschedulerlogs.controller.Home", {
      onInit: function () {
        that = this;
        this.listModel = new JSONModel();
        this.listModel.setSizeLimit(2000);
      },

      onAfterRendering: function () {
        oGModel = this.getModel("oGModel");
        that.oList = that.byId("joblogList");

        var nowH = new Date();
        //past 15 days selected date
        var oDateL = new Date(
          nowH.getFullYear(),
          nowH.getMonth(),
          nowH.getDate() - 15
        );

        this.byId("idDateRange").setDateValue(oDateL);
        this.byId("idDateRange").setSecondDateValue(nowH);
        that.handleDateChange();
      },

      handleDateChange: function () {
        var dDate = that.byId("idDateRange").getValue().split("To");
              var dLow = dDate[0].trim() + " " + "00:00:00",
                  dHigh = dDate[1].trim() + " " + "23:59:59";

        // var dLow = that.byId("idDateRange").getDateValue(),
        //   dHigh = that.byId("idDateRange").getSecondDateValue(),

        //   lgTime = new Date().getTimezoneOffset();

        //   dLow = new Date(dLow.setTime(dLow.getTime() - (lgTime* 60 * 1000)));
        //   dHigh = new Date(dHigh.setTime(dHigh.getTime() - (lgTime* 60 * 1000)));

        // dLow = dLow.toISOString().split("T")[0] + " " + "00:00:00";
        // dHigh = dHigh.toISOString().split("T")[0] + " " + "23:59:59";

        var oFilters = [];
        var sFilter = new sap.ui.model.Filter({
          path: "COMPLETED_TIMESTAMP",
          operator: sap.ui.model.FilterOperator.BT,
          value1: dLow,
          value2: dHigh,
        });
        oFilters.push(sFilter);

        sap.ui.core.BusyIndicator.show();
        that.getModel("JModel").read("/getJobStatus", {
          filters: oFilters,
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();

            oData.results.forEach(function (row) {
              row.JOB_ID = row.JOB_ID.toString();

              if (row.RUN_STATE === "REQUEST_ERROR") {
                row.RUN_STATE = "ERROR";
              }
            }, that);

            that.listModel.setData({
              results: oData.results,
            });
            that.oList.setModel(that.listModel);
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });
      },

      onUpdateFinished: function () {
        var oTable = that.getView().byId("joblogList");
        var oItems = oTable.getItems();
        var oCells;
        for (var i = 0; i < oItems.length; i++) {
          oCells = oItems[i].getCells();
          oCells[6].removeStyleClass("listGreen");
          oCells[6].removeStyleClass("listOrange");

          oCells[7].removeStyleClass("listGreen");
          oCells[7].removeStyleClass("listRed");
          oCells[7].removeStyleClass("listGray");

          if (oCells[6].getText().includes("COMPL")) {
            oCells[6].addStyleClass("listGreen");
          } else if (oCells[6].getText().includes("RUN")) {
            oCells[6].addStyleClass("listOrange");
          }

          if (oCells[7].getText().includes("SUCCESS")) {
            oCells[7].addStyleClass("listGreen");
          } else if (oCells[7].getText().includes("ERROR")) {
            oCells[7].addStyleClass("listRed");
          } else {
            oCells[7].addStyleClass("listGray");
          }
        }
      },

      onSearch: function (oEvent) {
        var sQuery = that.getView().byId("headSearch").getValue(),
          sKey = that.getView().byId("idFilter").getSelectedIndex(),
          oFilters = [];
        var aFilter = [];

        if (sQuery !== "") {
          var oFilters = new Filter({
            filters: [
              new Filter("JOB_ID", FilterOperator.Contains, sQuery),
              new Filter("JOB_NAME", FilterOperator.Contains, sQuery),
            ],
            and: false,
          });
          aFilter.push(oFilters);
        }

        if (sKey === 0) {
          //do nothing
        } else if (sKey === 1) {
          oFilters = new Filter({
            filters: [
              new Filter("RUN_STATE", sap.ui.model.FilterOperator.EQ, "ERROR"),
            ],
            and: true,
          });
          aFilter.push(oFilters);
        } else if (sKey === 2) {
          oFilters = new Filter({
            filters: [
              new Filter(
                "RUN_STATE",
                sap.ui.model.FilterOperator.EQ,
                "SUCCESS"
              ),
            ],
            and: false,
          });
          aFilter.push(oFilters);
        }

        that.byId("joblogList").getBinding("items").filter(aFilter);
        // that.onUpdateFinished();
      },
    });
  }
);
