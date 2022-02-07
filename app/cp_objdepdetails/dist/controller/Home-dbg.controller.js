sap.ui.define([
        "cp/appf/cpobjdepdetails/controller/BaseController",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/Device"
    ], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator, MessageBox, Device) {
        "use strict";
        var that, oGModel;
    
        return BaseController.extend("cp.appf.cpobjdepdetails.controller.ItemMaster", {
    
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
                var selected = oEvent.getSource().getSelectedItem().getTitle().split("_"),
                selectedObjDep = selected[0],
                selectedCounter = selected[1];
                oGModel.setProperty("/objDep", selectedObjDep);

                sap.ui.core.BusyIndicator.show();
    
                this.getModel("BModel").callFunction("/genODHistory", {
                    filters: [
                        new Filter("OBJ_DEP", FilterOperator.EQ, selectedObjDep),
                        new Filter("OBJ_COUNTER", FilterOperator.EQ, selectedCounter)
                      ],
                    success: function (oData) {
                     
                    //   that.oHdrModel.setData({
                    //     hdrResults: oData.results,
                    //   });
                    //   that.byId("").setModel(that.oHdrModel);
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
                            new Filter("OBJ_DEP", FilterOperator.Contains, query)
                          ],
                          and: false,
                        })
                      );
                    }
                    that.byId("objDepList").getBinding("items").filter(oFilters);
                  }
    
        });
    
    });
