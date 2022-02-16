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
			// this.DetailHome = DetailHome;
			this.bus = sap.ui.getCore().getEventBus();
			that.oStruModel = new JSONModel();
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

        onStruNode:function(oEvent){

            if (!that._oStruNode) {
				that._oStruNode = sap.ui.xmlfragment("cpappf.cpnodesdetails.view.StructureNodes", that);
				that.getView().addDependent(that._oStruNode);
			}


            if(oEvent.getSource().getTooltip().includes("Add")){
                that._oStruNode.setTitle("Structure Node Creation");
                sap.ui.getCore().byId("idStruNode").setValue("");
                sap.ui.getCore().byId("idStruDesc").setValue("");
                that._oStruNode.open();

            } else {
                
                if(this.byId("sturList").getSelectedItems().length){
                    var tableItem = this.byId("sturList").getSelectedItem().getCells();
                that._oStruNode.setTitle("Update Structure Node");
                sap.ui.getCore().byId("idStruNode").setValue(tableItem[0].getText());
                sap.ui.getCore().byId("idStruDesc").setValue(tableItem[1].getText());
                sap.ui.getCore().byId("idStruNode").setEditable(false);
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

	});

});