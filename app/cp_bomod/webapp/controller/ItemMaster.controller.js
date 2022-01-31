sap.ui.define([
	"cp/appf/cpbomod/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/Device"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator, MessageBox, Device) {
	"use strict";
	var that, oGModel;

	return BaseController.extend("cp.appf.cpbomod.controller.ItemMaster", {

		onInit: function () {
			that = this;
			that.oModel = new JSONModel();
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
			this.bus.publish("nav", "toBeginPage", {
				viewName: this.getView().getProperty("viewName")
			});

		},
		// Refreshing Master Data
		refreshMaster: function () {
			this.onAfterRendering();
		},
		onAfterRendering: function () {
			that = this;
			oGModel = this.getModel("oGModel");
            sap.ui.core.BusyIndicator.show();

            this.getModel("BModel").read("/getProdClass", {
                
                success: function (oData) {
                 
                  that.oModel.setData({
                    results: oData.results,
                  });
                  that.byId("bomList").setModel(that.oModel);
                  oGModel.setProperty("/prdId", oData.results[0].PRODUCT_ID);
                    oGModel.setProperty("/locId", oData.results[0].LOCATION_ID);
                    that.byId("bomList").setSelectedItem(that.byId("bomList").getItems()[0], true);
                    that.onhandlePress();
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });
			
		},

        onhandlePress: function (oEvent) {
            oGModel = this.getModel("oGModel");

                if (oEvent) {
                    var oSelItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
                   
                    oGModel.setProperty("/prdId", oSelItem.PRODUCT_ID);
                    oGModel.setProperty("/locId", oSelItem.LOCATION_ID);
    
    
                } 
            // Calling Item Detail page	
                that.getOwnerComponent().runAsOwner(function () {
                    if (!that.oDetailView) {
                        try {
                            that.oDetailView = sap.ui.view({
                                viewName: "cp.appf.cpbomod.view.ItemDetail",
                                type: "XML"
                            });
                            that.bus.publish("flexible", "addDetailPage", that.oDetailView);
                            that.bus.publish("nav", "toDetailPage", {
                                viewName: that.oDetailView.getViewName()
                            });
                            // that.oDetailView.onAfterRendering();
    
                        } catch (e) {
                                that.oDetailView.onAfterRendering();
                        }
                    } else {
                        that.bus.publish("nav", "toDetailPage", {
                            viewName: that.oDetailView.getViewName()
                        });
    
                        // that.oDetailView.onAfterRendering();
    
                    }
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
                        new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                        new Filter("LOCATION_ID", FilterOperator.Contains, query)
                      ],
                      and: false,
                    })
                  );
                }
                that.byId("bomList").getBinding("items").filter(oFilters);
              }

	});

});