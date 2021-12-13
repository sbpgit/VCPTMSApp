sap.ui.define([
    "cfgapp/pvsroot/cfgprdpvsroot/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator) {
	"use strict";
	var that, oGModel, sParNode;

	return BaseController.extend("cfgapp.pvsroot.cfgprdpvsroot.controller.NodeDetail", {
        onInit: function () {
			that = this;            
			this.oListModel = new JSONModel();
			this.bus = sap.ui.getCore().getEventBus();
        },
        /** 
		 * Go back to master page
		 */
		onDetailNavBack: function () {
			this.bus.publish("nav", "backToBegin");
		},
        onAfterRendering: function () {
			oGModel = this.getModel("oGModel");
			this.i18n = this.getResourceBundle();
			this.oList = this.byId("idListDetail");
			this.oList.setModel(that.oListModel);
			this.oList.removeSelections();
			//this.byId("searchBar").setValue();
			if (this.oList.getBinding("items")) {
				this.oList.getBinding("items").filter([]);
			}
			that.getData();		
		},
		getData:function(){
            that = this;
            // this.oList.setModel(that.oListModel);
            var oModel = this.getModel("sModel");
            sParNode = oGModel.getProperty("/PARENT_NODE");
         oModel.callFunction("/fGetNodeDet",{
            "method": "GET",
            urlParameters:{
                "NODE_TYPE" : "SN",
                "CHILD_NODE" : "1",
                "PARENT_NODE" : sParNode
            }, 
            success: function (oData) {
                    that.oListModel.setData({
                        results: oData.results
                    });				
                    //oGModel.setProperty("/PARENT_NODE", oData.results[0].PARENT_NODE);
                    //that.getView().byId("idList").setSelectedItem(that.getView().byId("idList").getItems()[0], true);
                  
                },
                error: function (oRes) {
                    MessageToast.show(that.i18n.getText("getListErr"));
                }
            });
		},
        onSearch: function (oEvent) {
			that.setCurrentSelectedItem();
			var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query"),
				oBinding = that.oList.getBinding("items"),
				aFilters = [];

			if (sQuery && sQuery.trim() !== "") {
				sQuery = sQuery.trim();
				aFilters.push(new Filter({
					filters: [
						new Filter("CHILD_NODE", FilterOperator.Contains, sQuery),
						new Filter("NODE_DESC", FilterOperator.Contains, sQuery)
					],
					and: false
				}));
			}
			if (oBinding) {
				oBinding.filter(aFilters);
			}
		},
		setCurrentSelectedItem: function () {
			var item = this.byId("viewNodeList").getSelectedItem();
			if (item) {
				that.getModel("oGModel").setProperty("/currentNode", item);
			}
		},
        onCreate: function(){
            if (!that._oCreateNode) {
				that._oCreateNode = sap.ui.xmlfragment("cfgapp.pvsroot.cfgprdpvsroot.view.CreateNode", that);
				that.getView().addDependent(that._oCreateNode);
			}
            that._oCreateNode.open();
            sap.ui.getCore().byId("idCrDg").setTitle("Create Structure Node");
            var sText = "View Node : " + sParNode;
            sap.ui.getCore().byId("idText").setText(sText);
            sap.ui.getCore().byId("idText").setVisible(true);
        },
        onSave: function(){
			that._oCreateNode.close();
            sap.ui.getCore().byId("idText").setVisible(false);
            sap.ui.getCore().byId("idCrDg").setTitle("");
			that._oCreateNode.destroy(true);
            that._oCreateNode = "";
                },
        onCancel: function(){
			that._oCreateNode.close();
            sap.ui.getCore().byId("idText").setVisible(false);
            sap.ui.getCore().byId("idCrDg").setTitle("");
			that._oCreateNode.destroy(true);
            that._oCreateNode = "";
        }

    });
})