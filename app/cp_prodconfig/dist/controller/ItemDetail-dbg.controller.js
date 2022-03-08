sap.ui.define([
	"cp/appf/cpprodconfig/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/ui/core/Fragment"
], function (BaseController, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Device,  Fragment) {
	"use strict";
	var that, oGModel;
	return BaseController.extend("cp.appf.cpprodconfig.controller.ItemDetail", {
		onInit: function () {
			that = this;
			// this.DetailHome = DetailHome;
			this.bus = sap.ui.getCore().getEventBus();
			that.oCharModel = new JSONModel();
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {
            oGModel = that.getOwnerComponent().getModel("oGModel");
            
             var className = oGModel.getProperty("/className");

             this.byId("charList").setModel(this.oCharModel);
             this.getModel("BModel").read("/getClassChar", {
                filters: [
                    new Filter("CLASS_NAME", FilterOperator.EQ, className)
                  ],
                
                success: function (oData) {
                 
                  that.oCharModel.setData({
                    classresults: oData.results,
                  });
                //   that.byId("charList").setModel(that.oCharModel);
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });


        },

        onDetailSearch: function (oEvent) {
            var query =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
              oFilters = [];
    
            if (query !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("CLASS_NAME", FilterOperator.Contains, query),
                    new Filter("CHAR_NAME", FilterOperator.Contains, query),
                    new Filter("CHAR_VALUE", FilterOperator.Contains, query)
                  ],
                  and: false,
                })
              );
            }
            this.byId("charList").getBinding("items").filter(oFilters);
          },

	});

});