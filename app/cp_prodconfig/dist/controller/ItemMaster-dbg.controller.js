sap.ui.define([
	"cp/appf/cpprodconfig/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/Device"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator, MessageBox, Device) {
	"use strict";
	var that, oGModel;

	return BaseController.extend("cp.appf.cpprodconfig.controller.ItemMaster", {

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

            this.getModel("BModel").read("/getProdClass", {
                
                success: function (oData) {
                 
                  that.oModel.setData({
                    results: oData.results,
                  });
                  that.byId("prodList").setModel(that.oModel);
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
                    oGModel.setProperty("/className", oSelItem.CLASS_NAME);
                    oGModel.setProperty("/classNo", oSelItem.CLASS_NUM);
                    oGModel.setProperty("/prodDesc", oSelItem.PROD_DESC);
                    oGModel.setProperty("/prodFam", oSelItem.PROD_FAMILY);
                    oGModel.setProperty("/prodGroup", oSelItem. PROD_GROUP);
                    oGModel.setProperty("/prodModel", oSelItem.PROD_MODEL);
                    oGModel.setProperty("/prodMidRng", oSelItem.PROD_MDLRANGE);
                    oGModel.setProperty("/prodSeries", oSelItem.PROD_SERIES);
    
    
                } else {
                    // var num = oGModel.getProperty("/projectNo");
                    // oGModel.setProperty("/projectNo", num);
                    // var desc = oGModel.getProperty("/ProjDesc");
                    // oGModel.setProperty("/ProjDesc", desc);
                }
            // Calling Item Detail page	
                that.getOwnerComponent().runAsOwner(function () {
                    if (!that.oDetailView) {
                        try {
                            that.oDetailView = sap.ui.view({
                                viewName: "cp.appf.cpprodconfig.view.ItemDetail",
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
                        new Filter("CLASS_NAME", FilterOperator.Contains, query)
                      ],
                      and: false,
                    })
                  );
                }
                that.byId("prodList").getBinding("items").filter(oFilters);
              }

	});

});