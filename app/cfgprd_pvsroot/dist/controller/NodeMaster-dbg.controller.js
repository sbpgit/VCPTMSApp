sap.ui.define([
    "cfgapp/pvsroot/cfgprdpvsroot/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator) {
	"use strict";
	var that, oGModel, sParNode;

	return BaseController.extend("cfgapp.pvsroot.cfgprdpvsroot.controller.NodeMaster", {
	//	formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.enerpipe.shopfloor.sf_ep_shop_status.view.ItemMaster
		 */
		onInit: function () {
			that = this;
			this.oListModel = new JSONModel();
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
			this.bus.publish("nav", "toBeginPage", {viewName: this.getView().getProperty("viewName")});
		},

		/** 
		 * Called when the App is closed or the page is replaced
		 */
		onExit: function () {
			this.bus.unsubscribe("data", "refreshMaster", this.refreshMaster, this);
		},

		/** 
		 * This function is called set current selected item
		 */
		setCurrentSelectedItem: function () {
			var item = this.byId("viewNodeList").getSelectedItem();
			if (item) {
				that.getModel("oGModel").setProperty("/currentNode", item);
			}
		},

		/** 
		 * Called when something is entered into the search field
		 * @param {object} oEvent -the event information
		 */
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

		/** 
		 * Called when a item is pressed
		 * @param {object} oEvent - the event info
		 */
		handlePress: function (oEvent) {
			that.setCurrentSelectedItem();
			var oBinding = oEvent.getParameter("listItem").getBindingContext();
			oGModel.setProperty("/PARENT_NODE", oBinding.getProperty("CHILD_NODE"));
			oGModel.setProperty("/NODE_DESC", oBinding.getProperty("NODE_DESC"));
			this.getOwnerComponent().runAsOwner(function () {
				if (!that.oDetailView) {
					try {
						that.oDetailView = sap.ui.view({
							viewName: "cfgapp.pvsroot.cfgprdpvsroot.view.NodeDetail",
							type: "XML"
						});
						that.bus.publish("flexible", "addDetailPage", that.oDetailView);
						that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					} catch (e) {
						//MessageToast.show(that.i18n.getText("getItemDetailErr"));
                       // that.bus.publish("flexible", "addDetailPage", that.oDetailView);
					//	that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
                        
					//that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
                    
					    that.oDetailView.onAfterRendering();
					}
				} else {
					that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					
					that.oDetailView.onAfterRendering();
				}
			});
		},

		/** 
		 * Function to refresh the data based on some activity
		 * from the detail level
		 */
		refreshMaster: function () {
			this.onAfterRendering();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.enerpipe.shopfloor.sf_ep_shop_status.view.ItemMaster
		 */
		onAfterRendering: function () {
			oGModel = this.getModel("oGModel");
			this.i18n = this.getResourceBundle();
			this.oList = this.byId("viewNodeList");
			this.oList.setModel(that.oListModel);
			this.oList.removeSelections();
			//this.byId("searchBar").setValue();
			if (this.oList.getBinding("items")) {
				this.oList.getBinding("items").filter([]);
			}

			that.getData();

			// Update the count everytime the list updates
			this.oList.attachEvent("updateFinished", function (oEvent) {
				that.byId("listTitle").setText(that.i18n.getText("listTitle", [this.getBinding("items").aIndices.length]));
				if (oGModel.getProperty("/currentNode")) {
					var aItems = this.getItems(),
						sTitle = oGModel.getProperty("/currentNode").getTitle();
					// Maintain selection
					for (var i = 0; i < aItems.length; i++) {
						if (aItems[i].getTitle() === sTitle) {
							this.setSelectedItem(aItems[i]);
							break;
						}
					}
				}
			});
		},
		getData:function(){
            that = this;
            // this.oList.setModel(that.oListModel);
            var oModel = this.getModel("sModel");
            sParNode = oGModel.getProperty("/PARENT_NODE");
         oModel.callFunction("/fGetNodeDet",{
            "method": "GET",
            urlParameters:{
                "NODE_TYPE" : "VN",
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
        
        onCreate: function(){
            if (!that._oCreateNode) {
				that._oCreateNode = sap.ui.xmlfragment("cfgapp.pvsroot.cfgprdpvsroot.view.CreateNode", that);
				that.getView().addDependent(that._oCreateNode);
			}
            sap.ui.getCore().byId("idCrDg").setTitle("Create View Node");
            var sText = "Access Node : " + sParNode;
            sap.ui.getCore().byId("idText").setText(sText);
            sap.ui.getCore().byId("idText").setVisible(true);
           that._oCreateNode.open();
        },
        onSave: function(){
			that._oCreateNode.close();
            sap.ui.getCore().byId("idText").setVisible(false);
            sap.ui.getCore().byId("idCrDg").setTitle("");
			that._oCreateNode.destroy(true);
        },
        onCancel: function(){
			that._oCreateNode.close();
            sap.ui.getCore().byId("idText").setVisible(false);
            sap.ui.getCore().byId("idCrDg").setTitle("");
			that._oCreateNode.destroy(true);
        }
	});
});