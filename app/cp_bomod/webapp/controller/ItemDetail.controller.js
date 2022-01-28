sap.ui.define([
	"cp/appf/cpbomod/controller/BaseController",
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
	return BaseController.extend("cp.appf.cpbomod.controller.ItemDetail", {
		onInit: function () {
			that = this;
			// this.DetailHome = DetailHome;
			this.bus = sap.ui.getCore().getEventBus();
			that.oBomModel = new JSONModel();
            that.oCharModel = new JSONModel();
            this.oBomModel.setSizeLimit(1000);
            this.oCharModel.setSizeLimit(1000);
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {
            oGModel = that.getOwnerComponent().getModel("oGModel");
            sap.ui.core.BusyIndicator.show();
             var prdId = oGModel.getProperty("/prdId");
             var locId = oGModel.getProperty("/locId");

             this.getModel("BModel").read("/getBomOdCond", {
                filters: [
                    new Filter("LOCATION_ID", FilterOperator.EQ, locId),
                    new Filter("PRODUCT_ID", FilterOperator.EQ, prdId)
                  ],
                
                success: function (oData) {
                 
                  that.oBomModel.setData({
                    results: oData.results,
                  });
                  that.byId("idBom").setModel(that.oBomModel);
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });


        },

        onItemPress:function(){
            sap.ui.core.BusyIndicator.show();
            var selItem = this.byId("idBom").getSelectedItem().getCells()[2].getText();

            this.getModel("BModel").read("/getODcharval", {
                filters: [
                    new Filter("OBJ_DEP", FilterOperator.EQ, selItem)
                  ],
                
                success: function (oData) {
                 
                  that.oCharModel.setData({
                    charResults: oData.results,
                  });
                  that.byId("idChartab").setModel(that.oCharModel);
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });

        }

	});

});