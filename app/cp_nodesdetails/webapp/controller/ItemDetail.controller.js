sap.ui.define([
	"cpappf/cpnodesdetails/controller/BaseController",
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
	return BaseController.extend("cpappf.cpnodesdetails.controller.ItemDetail", {
		onInit: function () {
			that = this;
			this.bus = sap.ui.getCore().getEventBus();
			that.oStruModel = new JSONModel();
            that.oViewModel = new JSONModel();
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {
            oGModel = that.getOwnerComponent().getModel("oGModel");

            var selItem = oGModel.getProperty("/SelectedAccessNode");
            var stuData = oGModel.getProperty("/struNodeData");
            var ViewData= oGModel.getProperty("/ViewNodeData");
            that.struNodeData = [];
            that.viewNodeData = [];

            this.byId("struTitle").setText("Structure Node Details for -" + " " + selItem);

                for(var i=0; i< stuData.length; i++){
                    if(stuData[i].PARENT_NODE === selItem){
                        that.struNodeData.push(stuData[i]);
                    }
                }


            that.oStruModel.setData({
                Struresults: that.struNodeData,
              });
              that.byId("sturList").setModel(that.oStruModel);



        },

        onAssign:function(){
            if (!that._oViewNode) {
				that._oViewNode = sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodes", that);
				that.getView().addDependent(that._oViewNode);
			}

            var ViewData= oGModel.getProperty("/ViewNodeData");

            that.oViewModel.setData({
                ViewNodesresults: ViewData,
              });
              sap.ui.getCore().byId("ViewList").setModel(that.oViewModel);

              that._oViewNode.open();
        },

        onViewNodeClose:function(){
            that._oViewNode.close();
            that._oViewNode.destroy(true);
            that._oViewNode="";

        },

        onStruNode:function(oEvent){

            if (!that._oStruNode) {
				that._oStruNode = sap.ui.xmlfragment("cpappf.cpnodesdetails.view.StructureNodes", that);
				that.getView().addDependent(that._oStruNode);
			}
            oGModel = this.getModel("oGModel");
            oGModel.setProperty("/sFlag", "");

            if(oEvent.getSource().getTooltip().includes("Add")){
                that._oStruNode.setTitle("Structure Node Creation");
                sap.ui.getCore().byId("idStruNode").setValue("");
                sap.ui.getCore().byId("idStruDesc").setValue("");
                oGModel.setProperty("/sFlag", "C");
                that._oStruNode.open();

            } else {
                
                if(this.byId("sturList").getSelectedItems().length){
                    var tableItem = this.byId("sturList").getSelectedItem().getCells();
                that._oStruNode.setTitle("Update Structure Node");
                sap.ui.getCore().byId("idStruNode").setValue(tableItem[0].getText());
                sap.ui.getCore().byId("idStruDesc").setValue(tableItem[1].getText());
                sap.ui.getCore().byId("idStruNode").setEditable(false);
                oGModel.setProperty("/sFlag", "E");
                that._oStruNode.open();
                } else {
                    MessageToast.show("Select structure node to update");
                }
            }
        },

        onStruNodeClose:function(){
            this.byId("sturList").removeSelections();
            that._oStruNode.close();
            that._oStruNode.destroy(true);
            that._oStruNode="";

        },
        

        onStruNodeDel:function(oEvent){
            // Deleting the selected structure node
          var selectedStruNode = oEvent.getSource().getParent().getCells()[0].getText(),
              accessNode = oGModel.getProperty("/SelectedAccessNode");
          // Getting the conformation popup before deleting
          var text = "Please confirm to remove structure node" + " - " + selectedStruNode;
          sap.m.MessageBox.show(text, {
            title: "Confirmation",
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.YES) {
                sap.ui.core.BusyIndicator.show();

                that.getModel("BModel").callFunction("/genpvs", {
                  method: "GET",
                  urlParameters: {
                    CHILD_NODE: selectedStruNode,
                    PARENT_NODE: accessNode,
                    NODE_TYPE: "SN",
                    NODE_DESC: "",
                    FLAG: "D",
                  },
                  success: function (oData) {
                    MessageToast.show("Structure node deleted successfully");
                    that.bus.publish("data", "refreshMaster");
                    sap.ui.core.BusyIndicator.hide();
                  },
                  error: function () {
                    MessageToast.show("Failed to delete Structure node");
                    sap.ui.core.BusyIndicator.hide();
                  },
                });
              }
            },
          });

        },

        onStruNodeSave:function(oEvent){
            var AccessNode = sap.ui.getCore().byId("idAccNode").getValue(),
                StructureNode = sap.ui.getCore().byId("idStruNode").getValue(),
                Desc = sap.ui.getCore().byId("idStruDesc").getValue(),
                flag = oGModel.getProperty("/sFlag");

                that.getModel("BModel").callFunction("/genpvs", {
                    method: "GET",
                    urlParameters: {
                      CHILD_NODE: StructureNode,
                      PARENT_NODE: AccessNode,
                      NODE_TYPE: "SN",
                      NODE_DESC: Desc,
                      FLAG: flag
                    },
                    success: function (oData) {
                        MessageToast.show("Successfully updated the structure node");
                        that.bus.publish("data", "refreshMaster");
                      sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData) {
                      MessageToast.show("Failed to updated the structure node");
                      sap.ui.core.BusyIndicator.hide();
                    },
                  });
        }

	});

});