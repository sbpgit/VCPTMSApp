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
            that.oViewlistModel = new JSONModel();
            that.oViewModel = new JSONModel();
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {
            oGModel = that.getOwnerComponent().getModel("oGModel");
            this.byId("sturList").removeSelections();

            var selItem = oGModel.getProperty("/SelectedAccessNode");
            var stuData = oGModel.getProperty("/struNodeData");
            var ViewData= oGModel.getProperty("/ViewNodeData");
            var StruViewData= oGModel.getProperty("/StruViewNodeData");
            that.struNodeData = [];
            that.viewNodeData = [];
            that.struviewNodeData = [];

            // this.byId("struTitle").setText("Structure Node - View Node");

                for(var i=0; i< stuData.length; i++){
                    if(stuData[i].PARENT_NODE === selItem){
                        that.struNodeData.push(stuData[i]);
                    }
                }

                for(var i=0; i< ViewData.length; i++){
                    if(ViewData[i].PARENT_NODE === selItem){
                        that.viewNodeData.push(ViewData[i]);
                    }
                }
                
                
                for(var j=0; j< that.viewNodeData.length; j++){
                    var count = 0;
                for(var i=0; i< StruViewData.length; i++){
                    if(StruViewData[i].PARENT_NODE === that.viewNodeData[j].CHILD_NODE &&
                        StruViewData[i].ACCESS_NODES === selItem){
                            that.struviewNodeData.push(StruViewData[i]);
                            count = 1;
                    }
                }
                if(count === 0){
                      var data = {
                        AUTH_GROUP: null,
                        CHILD_NODE: "No Structure Node assigned",
                        NODE_DESC: "",
                        NODE_TYPE: "",
                        PARENT_NODE: ViewData[j].CHILD_NODE,
                        createdAt: null,
                        createdBy: null,
                        modifiedAt: null,
                        modifiedBy: null,
                      }
                      
                that.struviewNodeData.push(data);   
                }
            }

            oGModel.setProperty("/tableData", that.struviewNodeData);


            that.oStruModel.setData({
                Struresults: that.struNodeData,
              });
              that.byId("sturList").setModel(that.oStruModel);

            //   that.oViewlistModel.setData({
            //     ViewListresults: that.viewNodeData,
            //   });
            //   that.byId("ViewList").setModel(that.oViewlistModel);

            // oGModel.setProperty("/reqTabData", aReqData);
            that.aReqTabData();

            var oReqData = oGModel.getProperty("/reqData");

              that.oViewlistModel.setData({
                ViewListresults:  oReqData.Requests,
              });
              that.byId("nodeTable").setModel(that.oViewlistModel);

        },

        aReqTabData:function(oData){
            var viewData = that.viewNodeData,
                // svDate =   that.struviewNodeData ,
                svDate = oData ? oData.results : oGModel.getProperty("/tableData"),             
            oFinData = {
                Requests: []
            },
            aFoundReq = [],
            iIndex, oItem, oNewItem,
            // Function to calculate the parent values
            fnAddTime = function (oParent, oChild, sType) {
                var oNewParent = JSON.parse(JSON.stringify(oParent)),
                    oNewChild = JSON.parse(JSON.stringify(oChild)),
                    oOldParent = JSON.parse(JSON.stringify(oParent));
                // if (oChild.Status !== "S") {
                //     oNewParent.QtyRequested = +oNewParent.QtyRequested + +oChild.QtyRequested;
                // }
                oNewChild._isParent = false;

                // Push the parent data item as well as it is part of the breakdown also. Do this only once
                if (oNewParent.children.length === 0) {
                    oOldParent._isParent = false;
                    oNewParent.children.push(oOldParent);
                }
                oNewParent.children.push(oNewChild);
                return oNewParent;
            };

        // If there is data in the table
        if (svDate.length) {
            // for (var j = 0; j <viewData.length ; j++) {

            for (var i = 0; i < svDate.length; i++) {
                // Requests
                iIndex = aFoundReq.indexOf(svDate[i].PARENT_NODE);
                // If data not found previously
                if (iIndex === -1) {
                    aFoundReq.push(svDate[i].PARENT_NODE);
                    svDate[i].children = [];
                    svDate[i]._isParent = true;
                    oFinData.Requests.push(svDate[i]);
                    // Push as children
                } else {
                    oItem = oFinData.Requests[iIndex];
                    oNewItem = fnAddTime(oItem, svDate[i], "Reqs");
                    oFinData.Requests[iIndex] = oNewItem;
                }
            // }
        }
        }
        oGModel.setProperty("/reqData", oFinData);

        },

        onDetailSearch:function(oEvent){
            var query =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
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
          that.byId("sturList").getBinding("items").filter(oFilters);

        },

        onViewNodeSearch(oEvent){
            var sValue = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
				aData = oGModel.getProperty("/tableData"),
				aResults = [];
				
			if (sValue && sValue.trim() !== "") {
				sValue = sValue.trim().toLocaleUpperCase();
				// for (var i = aData.length - 1; i >= 0; i--) {
                for(var i=0; i<aData.length; i++){
					if (aData[i].PARENT_NODE.includes(sValue) ||
						aData[i].CHILD_NODE.includes(sValue)) {
						aResults.push(aData[i]);
					}
				}
			} else {
				aResults = aData;
			}
			
			that.aReqTabData({results: aResults});

            var oReqData = oGModel.getProperty("/reqData");

              that.oViewlistModel.setData({
                ViewListresults:  oReqData.Requests,
              });
                   
        
        },


        onTabChange:function(oEvent){
            var seleTab = that.byId("detailNode").getSelectedKey();
            if(seleTab === "struNode"){
                that.byId("idAssign").setVisible(true);
                that.byId("idAstru").setVisible(true);
                that.byId("idEstru").setVisible(true);
                that.byId("idView").setVisible(false);

            } else if(seleTab === "viewNode"){
                that.byId("idAssign").setVisible(false);
                that.byId("idAstru").setVisible(false);
                that.byId("idEstru").setVisible(false);
                that.byId("idView").setVisible(true);
            }

        },
        onAssign:function(oEvent){
            if (!that._oViewNode) {
				that._oViewNode = sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodes", that);
				that.getView().addDependent(that._oViewNode);
			}
            if(this.byId("sturList").getSelectedItems().length){
            var ViewData= oGModel.getProperty("/ViewNodeData");
            that.viewAssignData = [];
            var selItem = oGModel.getProperty("/SelectedAccessNode");

            oGModel.setProperty("/selstrNode", this.byId("sturList").getSelectedItem().getCells()[0].getText());
            oGModel.setProperty("/selstrNodeDesc", this.byId("sturList").getSelectedItem().getCells()[1].getText());

            for(var i=0; i< ViewData.length; i++){
                if(ViewData[i].PARENT_NODE === selItem){
                    that.viewAssignData.push(ViewData[i]);
                }
            }

            that.oViewModel.setData({
                ViewNodesresults: that.viewAssignData,
              });
              sap.ui.getCore().byId("ViewList").setModel(that.oViewModel);

              if(that.viewAssignData.length !== 0){
              that._oViewNode.open();
              } else {
                MessageToast.show("There is no View Nodes for the selected Access Node");
              }
            } else {
                MessageToast.show("Select structure node to assign");
            }
        },

        onViewNodeClose:function(){
            sap.ui.getCore().byId("ViewList")._searchField.setValue("");
            if (that._oViewNode.getBinding("items")) {
                that._oViewNode.getBinding("items").filter([]);
              }

        },

        handleViewSearch:function(oEvent){
            var query =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
              sId = oEvent.getParameter("id"),
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
              that._oViewNode.getBinding("items").filter(oFilters);

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
                sap.ui.getCore().byId("idLower").setValue("");
                sap.ui.getCore().byId("idUpper").setValue("");
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
                    ACCESS_NODES: accessNode,
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
                flag = oGModel.getProperty("/sFlag"),
                lower, upper;

                if(sap.ui.getCore().byId("idLower").getValue() === ""){
                    lower =sap.ui.getCore().byId("idLower").getPlaceholder();
                } else {
                    lower = sap.ui.getCore().byId("idLower").getValue();
                }

                if(sap.ui.getCore().byId("idUpper").getValue() === ""){
                    upper =sap.ui.getCore().byId("idUpper").getPlaceholder();
                } else {
                    upper = sap.ui.getCore().byId("idUpper").getValue();
                }

                that.getModel("BModel").callFunction("/genpvs", {
                    method: "GET",
                    urlParameters: {
                      CHILD_NODE: StructureNode,
                      PARENT_NODE: AccessNode,
                      ACCESS_NODES: AccessNode,
                      NODE_TYPE: "SN",
                      NODE_DESC: Desc,
                      FLAG: flag
                    },
                    success: function (oData) {
                        if(flag === "C"){
                            MessageToast.show("Successfully created the structure node");
                        } else {
                        MessageToast.show("Successfully updated the structure node");
                        }
                        that.onStruNodeClose();
                        that.bus.publish("data", "refreshMaster");
                      sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData) {
                      MessageToast.show("Failed to updated the structure node");
                      sap.ui.core.BusyIndicator.hide();
                    },
                  });
        },

        onAssignViewNode:function(oEvent){
            var struNode = oGModel.getProperty("/selstrNode");
            var struNodeDesc = oGModel.getProperty("/selstrNodeDesc");
            // var viewNode = sap.ui.getCore().byId("ViewList").getSelectedItem().getCells()[0].getTitle();
            // var viewNodeDesc = sap.ui.getCore().byId("ViewList").getSelectedItem().getCells()[0].getText(),
            var viewNode = oEvent.getParameter("selectedItems")[0].getTitle();
            var viewNodeDesc = oEvent.getParameter("selectedItems")[0].getDescription(),
            accessNode = oGModel.getProperty("/SelectedAccessNode");

            var Desc = viewNodeDesc + " " + "-" + " " + struNodeDesc;

            that.getModel("BModel").callFunction("/genpvs", {
                method: "GET",
                urlParameters: {
                  CHILD_NODE: struNode,
                  PARENT_NODE: viewNode,
                  ACCESS_NODES: accessNode,
                  NODE_TYPE: "VS",
                  NODE_DESC: Desc,
                  FLAG: "C"
                },
                success: function (oData) {
                    MessageToast.show(data.d.results[0].value);
                    that.onViewNodeClose();
                    that.bus.publish("data", "refreshMaster");
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function (oData) {
                  MessageToast.show("Failed to updated the structure node");
                  sap.ui.core.BusyIndicator.hide();
                },
              });

        },

        onStruViewDelete:function(oEvent){
            var oBinding = oEvent.getSource().getParent().getBindingContext(),
                viewNode = oBinding.getObject().PARENT_NODE,
                struNode = oBinding.getObject().CHILD_NODE,
                accessNode = oBinding.getObject().ACCESS_NODES;

                that.getModel("BModel").callFunction("/genpvs", {
                    method: "GET",
                    urlParameters: {
                      CHILD_NODE: struNode,
                      PARENT_NODE: viewNode,
                      ACCESS_NODES: accessNode,
                      NODE_TYPE: "VS",
                      FLAG: "D"
                    },
                    success: function (oData) {
                        MessageToast.show(data.d.results[0].value);
                        that.onViewNodeClose();
                        that.bus.publish("data", "refreshMaster");
                      sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData) {
                      MessageToast.show("Failed to unassign structure node");
                      sap.ui.core.BusyIndicator.hide();
                    },
                  });


        },

        onViewNode:function(){
            if (!that._oViewNodeCreate) {
				that._oViewNodeCreate = sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodesCreation", that);
				that.getView().addDependent(that._oViewNodeCreate);
			}

            sap.ui.getCore().byId("idViewNode").setValue("");
            sap.ui.getCore().byId("idViewDesc").setValue("");

            that._oViewNodeCreate.open();

        },

        onViewClose:function(){
            that._oViewNodeCreate.close();
            that._oViewNodeCreate.destroy(true);
            that._oViewNodeCreate="";

        },

        onViewNodeCreate:function(){
            var accessNode = oGModel.getProperty("/SelectedAccessNode"),
                ViewNode = sap.ui.getCore().byId("idViewNode").getValue(),
            nodeDesc = sap.ui.getCore().byId("idViewDesc").getValue();
            that.getModel("BModel").callFunction("/genpvs", {
                method: "GET",
                urlParameters: {
                  CHILD_NODE: ViewNode,
                  PARENT_NODE: accessNode,
                  ACCESS_NODES: accessNode,
                  NODE_TYPE: "VN",
                  NODE_DESC: nodeDesc,
                  FLAG: "C"
                },
                success: function (oData) {
                    MessageToast.show("Successfully created view node");
                    that.onViewClose();
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