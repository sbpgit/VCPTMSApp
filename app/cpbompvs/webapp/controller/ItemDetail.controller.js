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
			that.oAssignModel = new JSONModel();
            that.oStruModelDetail = new JSONModel();
            that.oAssinModel = new JSONModel();
            that.oAssignModel.setSizeLimit(1000);
            that.oStruModelDetail.setSizeLimit(1000);
			oGModel = that.getOwnerComponent().getModel("oGModel");
            oGModel.setProperty("/resetFlag", "");
		},

		onAfterRendering: function () {
            sap.ui.core.BusyIndicator.show();
            oGModel = that.getOwnerComponent().getModel("oGModel");

            that.byId("detailNode").setSelectedKey("assignNode");
                that.byId("idDates").setVisible(true);

            that.byId("sturList").removeSelections();

            var selLoc = oGModel.getProperty("/SelectedLoc");
            var selProd = oGModel.getProperty("/SelectedProd");
            this.getModel("BModel").read("/getPVSBOM", {
                filters: [
                    new Filter("PRODUCT_ID", FilterOperator.EQ, selProd),
                    new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                  ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                  that.oAssignModel.setData({
                    results: oData.results,
                  });
                  that.byId("sturList").setModel(that.oAssignModel);
                },
                error: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to get data");
                },
              });

              if(oGModel.getProperty("/resetFlag") === ""){

                this.getModel("BModel").read("/genCompStrcNode", {
                    filters: [
                        new Filter("PRODUCT_ID", FilterOperator.EQ, selProd),
                        new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                      ],
                    success: function (oData) {
                        oGModel.setProperty("/tableData", oData.results);
                        that.aReqTabData();

                var oReqData = oGModel.getProperty("/reqData");
                        
                      that.oStruModelDetail.setData({
                        struDetailresults: oReqData.Requests,
                      });
                      that.byId("StrunodeTable").setModel(that.oStruModelDetail);

                      sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to get data");
                    },
                  });

              }
            

        },

        aReqTabData:function(oData){
            var svData = oData ? oData.results : oGModel.getProperty("/tableData"),             
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
        

            for (var i = 0; i < svData.length; i++) {
                // Requests
                iIndex = aFoundReq.indexOf(svData[i].STRUC_NODE);
                // If data not found previously
                if (iIndex === -1) {
                    aFoundReq.push(svData[i].STRUC_NODE);
                    svData[i].children = [];
                    svData[i]._isParent = true;
                    oFinData.Requests.push(svData[i]);
                    // Push as children
                } else {
                    oItem = oFinData.Requests[iIndex];
                    oNewItem = fnAddTime(oItem, svData[i], "Reqs");
                    oFinData.Requests[iIndex] = oNewItem;
                }
            // }
        }
        
        oGModel.setProperty("/reqData", oFinData);

        },

         onStruNodeSearch:function(oEvent){
            var sValue = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
				aData = oGModel.getProperty("/tableData"),
				aResults = [];
				
			if (sValue && sValue.trim() !== "") {
				sValue = sValue.trim().toLocaleUpperCase();
				// for (var i = aData.length - 1; i >= 0; i--) {
                for(var i=0; i<aData.length; i++){
					if (aData[i].STRUC_NODE.includes(sValue) ||
						aData[i].COMPONENT.includes(sValue)) {
						aResults.push(aData[i]);
					}
				}
			} else {
				aResults = aData;
			}
			
			that.aReqTabData({results: aResults});

            var oReqData = oGModel.getProperty("/reqData");

            that.oStruModelDetail.setData({
                struDetailresults: oReqData.Requests,
              });

        },

        onTabChange:function(oEvent){
            var seleTab = that.byId("detailNode").getSelectedKey();
            if(seleTab === "assignNode"){
                that.byId("idDates").setVisible(true);

            } else if(seleTab === "StruNodeDetail"){
                that.byId("idDates").setVisible(false);
            }

        },

        onGetData:function(oEvent){
            // sap.ui.core.BusyIndicator.show();
            oGModel = that.getOwnerComponent().getModel("oGModel");

            that.byId("sturList").removeSelections();

            var selLoc = oGModel.getProperty("/SelectedLoc");
            var selProd = oGModel.getProperty("/SelectedProd");
            var fromDate = new Date(that.byId("fromDate").getDateValue()),
                toDate = new Date(that.byId("toDate").getDateValue());
                var fromMnth,fromDat,toMnth,toDat;
                var mnthFrm = fromDate.getMonth() + 1,
                    mnthto = toDate.getMonth() + 1

                if(mnthFrm < 10 ){
                    fromMnth = "0" + mnthFrm;
                } else {
                    fromMnth = mnthFrm;
                }

                if(fromDate.getDate() < 10 ){
                    fromDat = "0" + fromDate.getDate();
                } else {
                    fromDat = fromDate.getDate();
                } 

                if(mnthto < 10 ){
                    toMnth = "0" + mnthto;
                } else {
                    toMnth = mnthto;
                }

                if(toDate.getDate() < 10 ){
                    toDat = "0" + toDate.getDate();
                } else {
                    toDat = toDate.getDate();
                }

                fromDate = fromDate.getFullYear() + "-" + fromMnth + "-"  + fromDat;
                toDate = toDate.getFullYear() + "-" + toMnth + "-" + toDat;
                this.getModel("BModel").read("/getPVSBOM", {
                filters: [
                    new Filter("PRODUCT_ID", FilterOperator.EQ, selProd),
                    new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                    new Filter("VALID_FROM", FilterOperator.EQ, fromDate),
                    new Filter("VALID_TO", FilterOperator.EQ, toDate),
                  ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                  that.oAssignModel.setData({
                    results: oData.results,
                  });
                  that.byId("sturList").setModel(that.oAssignModel);
                },
                error: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to get data");
                },
              });

        },

        onResetDate:function(){
            that.byId("fromDate").setValue("");
                that.byId("toDate").setValue("");
            oGModel.setProperty("/resetFlag", "X");
            that.onAfterRendering();

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
            var SelItem = that.byId("sturList").getSelectedItem().getCells()[0].getText();
            oGModel.setProperty("/SelecteComponent", SelComponent);
            oGModel.setProperty("/SelecteItem", SelItem);

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
                item = oGModel.getProperty("/SelecteItem"),
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
                        ITEM_NUM: item,
                        STRUC_NODE:struNode
                    }),
                    dataType: "json",
                    async: false,
                    timeout: 0,
                    
                    success: function (data) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Structure Node assigned");
                    // that.onStruNodeClose();
                    oGModel.setProperty("/resetFlag", "");
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