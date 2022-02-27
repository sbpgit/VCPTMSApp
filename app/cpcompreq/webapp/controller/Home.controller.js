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
        this.locModel = new JSONModel();
        this.prodModel = new JSONModel();
        // this.getRouter()
        //   .getRoute("Home")
        //   .attachPatternMatched(this._onPatternMatched.bind(this));
      },
      onAfterRendering: function () {
       // sap.ui.core.BusyIndicator.show();
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
                //sap.m.MessageToast.show("Structure Node assigned successfully");
                // // that.onStruNodeClo
                // that.onAfterRendering();
            },
            error: function (data) {
                sap.m.MessageToast.show(JSON.stringify(data));
              },
          });

        //that.byId("detailNode").setSelectedKey("assignNode");
       // that.byId("idDates").setVisible(true);
        //that.byId("fromDate").setValue("");
       // that.byId("toDate").setValue("");
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
        // var oColumnstatic = new sap.ui.table.Column({
        //     label: new sap.m.Label({text: "Item Num."})
        // });
        // that.oTable.addColumn(oColumnstatic);
        // oColumnstatic = new sap.ui.table.Column({
        //     label: new sap.m.Label({text: "Component"})
        // });
        // var oColumnstatic = new sap.m.Column({
        //     width: "20px",
        //     header: new sap.m.Label({
        //     text: "Item Num."
        //     })
        // });
        // that.oTable.addColumn(oColumnstatic);
        // oColumnstatic = new sap.m.Column({
        //     width: "20px",
        //     header: new sap.m.Label({
        //     text: "Component"
        //     })
        // });
        
    //   that.oTable.addColumn(oColumnstatic);
    //     for (var i = 0; i < liDates.length ; i++) {
    //         var oColumn = new sap.ui.table.Column({
    //             label: new sap.m.Label({text: liDates[i].CAL_DATE})
               
    //         });
    //         // var oColumn = new sap.ui.table.Column({
    //         //     width: "11rem",
    //         //     label: new sap.m.Label({
    //         //     text: liDates[i].CAL_DATE
    //         //     })
    //         // });
    //       that.oTable.addColumn(oColumn);
    //     }
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
      
        // var result = new Date(date);
        // result.setDate(result.getDate() + days);
        // return result;
      }, 
      removeDays: function(imDate, imDays) {
        const lDate = new Date(imDate);
        const lNextWeekDay = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() - imDays);

        return lNextWeekDay.toISOString().split('T')[0];
      
      } 

    });
  }
);
