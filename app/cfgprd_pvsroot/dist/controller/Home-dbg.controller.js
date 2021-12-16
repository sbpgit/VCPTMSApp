sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "cfgapp/pvsroot/cfgprdpvsroot/controller/BaseController",
	"sap/ui/core/Fragment"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, BaseController, Fragment) {
		"use strict";
        var that,oGModel;
		return BaseController.extend("cfgapp.pvsroot.cfgprdpvsroot.controller.Home", {
			onInit: function () {
                that = this;
                this.oListModel = new JSONModel();
                this.getRouter().getRoute("Home").attachPatternMatched(this._onObjectMatched, this);

			},
            onAfterRendering: function () {
                that = this;
                oGModel = this.getModel("oGModel");
            },
            _onObjectMatched: function () {
                that = this;
                oGModel = this.getModel("oGModel");
                this.i18n = this.getResourceBundle();
                this.oList = this.byId("idList");
                this.oList.setModel(that.oListModel);
                this.oList.removeSelections();
                //this.byId("searchBar").setValue();
                if (this.oList.getBinding("items")) {
                    this.oList.getBinding("items").filter([]);
                }

                that.getData();

                // Update the count everytime the list updates
                // Update the count everytime the list updates
                this.oList.attachEvent("updateFinished", function () {
                  //  that.byId("masterTitle").setText(that.i18n.getText("masterTitle", [that.oList.getBinding("items").getLength()]));

                }.bind(that));
            },
            getData: function () {
                that = this;
                // this.oList.setModel(that.oListModel);
                var oModel = this.getModel("sModel");
                
             oModel.callFunction("/fGetNodeDet",{
                "method": "GET",
                urlParameters:{
                    "NODE_TYPE" : "AN",
                    "CHILD_NODE" : "1",
                    "PARENT_NODE" : " "
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
// Handle Item selection
        handleItemSelction:function(oEvent){
            var sParentNode = oEvent.getParameter("listItem").getTitle();
			oGModel.setProperty("/PARENT_NODE", sParentNode);            
			that.getRouter().navTo("Detail", {}, true);
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
            sap.ui.getCore().byId("idCrDg").setTitle("Create Access Node");
           that._oCreateNode.open();
        },
        onSave: function(){
			that._oCreateNode.close();
            sap.ui.getCore().byId("idCrDg").setTitle("");
			that._oCreateNode.destroy(true);
        },
        onCancel: function(){
			that._oCreateNode.close();
            sap.ui.getCore().byId("idCrDg").setTitle("");
			that._oCreateNode.destroy(true);
        }

		});
	});
