sap.ui.define(["cpappf/cpnodesdetails/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,s,t,o,i,a,r){"use strict";var c,d;return e.extend("cpappf.cpnodesdetails.controller.ItemMaster",{onInit:function(){c=this;c.oModel=new t;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){c=this;d=this.getModel("oGModel");this.getModel("BModel").read("/getPVSNodes",{success:function(e){c.AccessNodes=[];c.StructureNodes=[];c.ViewNodes=[];c.StruViewNodes=[];for(var s=0;s<e.results.length;s++){if(e.results[s].NODE_TYPE==="AN"){c.AccessNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="SN"){c.StructureNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="VN"){c.ViewNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="VS"){c.StruViewNodes.push(e.results[s])}}d.setProperty("/SelectedAccessNode",c.AccessNodes[0].CHILD_NODE);d.setProperty("/struNodeData",c.StructureNodes);d.setProperty("/ViewNodeData",c.ViewNodes);d.setProperty("/StruViewNodeData",c.StruViewNodes);c.oModel.setData({results:c.AccessNodes});c.byId("accessList").setModel(c.oModel);c.byId("accessList").getItems()[0].setSelected(true);c.onhandlePress()},error:function(){s.show("Failed to get data")}})},onhandlePress:function(e){d=this.getModel("oGModel");if(e){var s=e.getSource().getSelectedItem().getBindingContext().getObject();d.setProperty("/SelectedAccessNode",s.CHILD_NODE);d.setProperty("/struNodeData",c.StructureNodes);d.setProperty("/ViewNodeData",c.ViewNodes)}c.getOwnerComponent().runAsOwner(function(){if(!c.oDetailView){try{c.oDetailView=sap.ui.view({viewName:"cpappf.cpnodesdetails.view.ItemDetail",type:"XML"});c.bus.publish("flexible","addDetailPage",c.oDetailView);c.bus.publish("nav","toDetailPage",{viewName:c.oDetailView.getViewName()})}catch(e){c.oDetailView.onAfterRendering()}}else{c.bus.publish("nav","toDetailPage",{viewName:c.oDetailView.getViewName()})}})},onSearch:function(e){var s=e.getParameter("value")||e.getParameter("newValue"),t=[];if(s!==""){t.push(new o({filters:[new o("CHILD_NODE",i.Contains,s)],and:false}))}c.byId("accessList").getBinding("items").filter(t)},onAccNode:function(e){if(!c._oAccesNode){c._oAccesNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.AccesNodes",c);c.getView().addDependent(c._oAccesNode)}d=this.getModel("oGModel");d.setProperty("/Flag","");if(e.getSource().getTooltip().includes("Add")){c._oAccesNode.setTitle("Access Node Creation");sap.ui.getCore().byId("idAccesNode").setValue("");sap.ui.getCore().byId("idDesc").setValue("");d.setProperty("/Flag","C");c._oAccesNode.open()}else{if(this.byId("accessList").getSelectedItems().length){var t=this.byId("accessList").getSelectedItem().getCells()[0];c._oAccesNode.setTitle("Update Access Node");sap.ui.getCore().byId("idAccesNode").setValue(t.getTitle());sap.ui.getCore().byId("idDesc").setValue(t.getText());sap.ui.getCore().byId("idAccesNode").setEditable(false);d.setProperty("/Flag","E");c._oAccesNode.open()}else{s.show("Select access node to update")}}},onAccNodeClose:function(){c._oAccesNode.close();c._oAccesNode.destroy(true);c._oAccesNode=""},onAccNodeDel:function(e){var t=e.getSource().getParent().getCells()[0].getTitle();var o="Please confirm to remove access node"+" - "+t;sap.m.MessageBox.show(o,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();c.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:t,PARENT_NODE:"",NODE_TYPE:"AN",NODE_DESC:"",FLAG:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();s.show("Deletion Successfull");c.onAfterRendering()},error:function(){sap.ui.core.BusyIndicator.hide();s.show("Failed to delete node");c.onAfterRendering()}})}}})},onAccessNodeSave:function(){var e=sap.ui.getCore().byId("idAccesNode").getValue();var t=sap.ui.getCore().byId("idDesc").getValue();var o=d.getProperty("/Flag");this.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:e,PARENT_NODE:"",ACCESS_NODES:e,NODE_TYPE:"AN",NODE_DESC:t,FLAG:o},success:function(e){s.show("Creation Successfull");c.onAccNodeClose();c.onAfterRendering()},error:function(e){if(e.statusCode===200){s.show("Creation Successfull")}else{s.show("Failed to create node")}c.onAccNodeClose();c.onAfterRendering()}})}})});