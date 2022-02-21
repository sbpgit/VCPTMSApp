sap.ui.define([
	"cpapp/cpbompvs/controller/BaseController",
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
	return BaseController.extend("cpapp.cpbompvs.controller.ItemDetail", {
		onInit: function () {
			that = this;
			// this.DetailHome = DetailHome;
			this.bus = sap.ui.getCore().getEventBus();
			that.oStruModel = new JSONModel();
            that.oAssinModel = new JSONModel();
            that.oStruModel.setSizeLimit(1000);
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {
            sap.ui.core.BusyIndicator.show();
            oGModel = that.getOwnerComponent().getModel("oGModel");

            that.byId("sturList").removeSelections();
            var date = new Date().toLocaleDateString();

            that.byId("fromDate").setValue("01/01/2000");

            var selLoc = oGModel.getProperty("/SelectedLoc");
            var selProd = oGModel.getProperty("/SelectedProd");
            var fromDate = new Date(that.byId("fromDate").getValue()),
                toDate = new Date(that.byId("toDate").getValue());
            this.getModel("BModel").read("/getPVSBOM", {
                filters: [
                    new Filter("PRODUCT_ID", FilterOperator.EQ, selProd),
                    new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                    // new Filter("VALID_FROM", FilterOperator.EQ, fromDate),
                    // new Filter("VALID_TO", FilterOperator.EQ, toDate),
                  ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                  that.oStruModel.setData({
                    results: oData.results,
                  });
                  that.byId("sturList").setModel(that.oStruModel);
                },
                error: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to get data");
                },
              });
            

        },

        onDetailSearch:function(oEvent){
            var query = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
            // Check if search filter is to be applied
            query = query ? query.trim() : "";
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("COMPONENT", FilterOperator.Contains, query),
                      new Filter("STRUC_NODE", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.byId("sturList").getBinding("items").filter(oFilters);
        },

        onAssign:function(oEvent){

            if (!that._oStruNode) {
				that._oStruNode = sap.ui.xmlfragment("cpapp.cpbompvs.view.StructureNodes", that);
				that.getView().addDependent(that._oStruNode);
			}

            if(that.byId("sturList").getSelectedItems().length === 1){

            

            var selNode = oGModel.getProperty("/SelectedNode");
            var SelComponent = that.byId("sturList").getSelectedItem().getCells()[1].getText();
            oGModel.setProperty("/SelecteComponent", SelComponent);

            this.getModel("BModel").read("/getPVSNodes", {
                filters: [
                    new Filter("PARENT_NODE", FilterOperator.EQ, selNode),
                    new Filter("NODE_TYPE", FilterOperator.EQ, "SN"),
                  ],
                success: function (oData) {
                  
                  that.oAssinModel.setData({
                    results: oData.results,
                  });
                  sap.ui.getCore().byId("sturList").setModel(that.oAssinModel);

                  that._oStruNode.open();
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });

            } else {
                MessageToast.show("Please select compponent to assign structure node");
            }

        },

       

        handleStruSelection:function(oEvent){
            var loc = oGModel.getProperty("/SelectedLoc"),
                prod = oGModel.getProperty("/SelectedProd"),
                component = oGModel.getProperty("/SelecteComponent"),
                struNode = oEvent.getParameter("selectedItems")[0].getTitle();

                var uri = "/v2/catalog/genCompStrcNode";
                $.ajax({
                    url: uri,
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify({
                        LOCATION_ID: loc,
                        PRODUCT_ID: prod,
                        COMPONENT: component,
                        STRUC_NODE:struNode
                    }),
                    dataType: "json",
                    async: false,
                    timeout: 0,
                    
                    success: function (data) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Structure Node assigned");
                    // that.onStruNodeClose();
                    that.onAfterRendering();
                    },
                    error: function (data) {
                        sap.m.MessageToast.show(JSON.stringify(data));
                    },
                });
        },

        handleStruSearch:function(oEvent){
            var query = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
            // Check if search filter is to be applied
            query = query ? query.trim() : "";
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("CHILD_NODE", FilterOperator.Contains, query),
                      new Filter("NODE_DESC", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that._oStruNode.getBinding("items").filter(oFilters);
        },

        onStructureNodeDel:function(oEvent){
            var loc = oGModel.getProperty("/SelectedLoc"),
                prod = oGModel.getProperty("/SelectedProd"),
             selectedComp = oEvent.getSource().getParent().getCells()[1].getText();

             var uri = "/v2/catalog/genCompStrcNode";
                $.ajax({
                    url: uri,
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify({
                        LOCATION_ID: loc,
                        PRODUCT_ID: prod,
                        COMPONENT: selectedComp,
                        STRUC_NODE:"D"
                    }),
                    dataType: "json",
                    async: false,
                    timeout: 0,
                    
                    success: function (data) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Structure Node deleted");
                    // that.onStruNodeClose();
                    that.onAfterRendering();
                    },
                    error: function (data) {
                        sap.m.MessageToast.show(JSON.stringify(data));
                    },
                });
        }

	});

});