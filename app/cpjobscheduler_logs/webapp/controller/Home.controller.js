sap.ui.define([
        "cpapp/cpjobschedulerlogs/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    ], function (BaseController, JSONModel,  MessageToast,MessageBox, Filter, FilterOperator) {
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
                var oDateL = new Date(nowH.getFullYear(), nowH.getMonth(), nowH.getDate() - 15);
        
                this.byId("idDateRange").setDateValue(oDateL);
                this.byId("idDateRange").setSecondDateValue(nowH);
                that.handleDateChange();

                
              },

              handleDateChange: function(){

                var dLow = that.byId("idDateRange").getDateValue(),
                    dHigh = that.byId("idDateRange").getSecondDateValue()


                    dLow = dLow.toISOString().split("T")[0] + " " + "00:00:00";
                    dHigh = dHigh.toISOString().split("T")[0] + " " + "23:59:59";

                var oFilters = [];
			    var sFilter = new sap.ui.model.Filter({
                    path: "COMPLETED_TIMESTAMP",
                    operator: sap.ui.model.FilterOperator.BT,
                    value1: dLow,
                    value2: dHigh
                });
                oFilters.push(sFilter);
        
                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").read("/getJobStatus", {
                    filters: oFilters,
                //   method: "GET",
                //   urlParameters: {
                //     startTime: dFromDate,
                //     endTime: dToDate
                //   },
                  success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
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

              onSearch:function(oEvent){
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                oFilters = [];

                if (sQuery !== "") {
                oFilters.push(
                    new Filter({
                    filters: [
                        new Filter("JOB_ID", FilterOperator.EQ, sQuery),
                        new Filter("JOB_NAME", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                    })
                );
                }
                that.byId("joblogList").getBinding("items").filter(oFilters);

            
              }






        });
    });
