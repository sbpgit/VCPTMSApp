sap.ui.define(["cpappf/cpnodesdetails/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,s,t,o,i,c,r){"use strict";var a,d;return e.extend("cpappf.cpnodesdetails.controller.ItemMaster",{onInit:function(){a=this;a.oModel=new t;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){a=this;d=this.getModel("oGModel");this.getModel("BModel").read("/getPVSNodes",{success:function(e){a.AccessNodes=[];a.StructureNodes=[];a.ViewNodes=[];a.StruViewNodes=[];for(var s=0;s<e.results.length;s++){if(e.results[s].NODE_TYPE==="AN"){a.AccessNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="SN"){a.StructureNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="VN"){a.ViewNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="VS"){a.StruViewNodes.push(e.results[s])}}d.setProperty("/SelectedAccessNode",a.AccessNodes[0].CHILD_NODE);d.setProperty("/SelectedDesc",a.AccessNodes[0].NODE_DESC);d.setProperty("/struNodeData",a.StructureNodes);d.setProperty("/ViewNodeData",a.ViewNodes);d.setProperty("/StruViewNodeData",a.StruViewNodes);a.oModel.setData({results:a.AccessNodes});a.byId("accessList").setModel(a.oModel);a.byId("accessList").getItems()[0].setSelected(true);a.onhandlePress()},error:function(){s.show("Failed to get data")}})},onhandlePress:function(e){d=this.getModel("oGModel");if(e){var s=e.getSource().getSelectedItem().getBindingContext().getObject();d.setProperty("/SelectedAccessNode",s.CHILD_NODE);d.setProperty("/SelectedDesc",s.NODE_DESC);d.setProperty("/struNodeData",a.StructureNodes);d.setProperty("/ViewNodeData",a.ViewNodes)}a.getOwnerComponent().runAsOwner(function(){if(!a.oDetailView){try{a.oDetailView=sap.ui.view({viewName:"cpappf.cpnodesdetails.view.ItemDetail",type:"XML"});a.bus.publish("flexible","addDetailPage",a.oDetailView);a.bus.publish("nav","toDetailPage",{viewName:a.oDetailView.getViewName()})}catch(e){a.oDetailView.onAfterRendering()}}else{a.bus.publish("nav","toDetailPage",{viewName:a.oDetailView.getViewName()})}})},onSearch:function(e){var s=e.getParameter("value")||e.getParameter("newValue"),t=[];if(s!==""){t.push(new o({filters:[new o("CHILD_NODE",i.Contains,s)],and:false}))}a.byId("accessList").getBinding("items").filter(t)},onAccNode:function(e){if(!a._oAccesNode){a._oAccesNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.AccesNodes",a);a.getView().addDependent(a._oAccesNode)}d=this.getModel("oGModel");d.setProperty("/Flag","");if(e.getSource().getTooltip().includes("Add")){a._oAccesNode.setTitle("Access Node Creation");sap.ui.getCore().byId("idAccesNode").setValue("");sap.ui.getCore().byId("idDesc").setValue("");d.setProperty("/Flag","C");a._oAccesNode.open()}else{if(this.byId("accessList").getSelectedItems().length){var t=this.byId("accessList").getSelectedItem().getCells()[0];a._oAccesNode.setTitle("Update Access Node");sap.ui.getCore().byId("idAccesNode").setValue(t.getTitle());sap.ui.getCore().byId("idDesc").setValue(t.getText());sap.ui.getCore().byId("idAccesNode").setEditable(false);d.setProperty("/Flag","E");a._oAccesNode.open()}else{s.show("Select access node to update")}}},onAccNodeClose:function(){a._oAccesNode.close();a._oAccesNode.destroy(true);a._oAccesNode=""},onAccNodeDel:function(e){var t=e.getSource().getParent().getCells()[0].getTitle();var o="Do you want to delete all the assignments of this Node. "+" - "+t+"-"+"Please confirm";sap.m.MessageBox.show(o,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();a.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:t,PARENT_NODE:"",ACCESS_NODES:"",NODE_TYPE:"AN",NODE_DESC:"",LOWERLIMIT:0,UPPERLIMIT:0,FLAG:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();s.show("Deletion Successfull");a.onAfterRendering()},error:function(){sap.ui.core.BusyIndicator.hide();s.show("Failed to delete node");a.onAfterRendering()}})}}})},onAccessNodeSave:function(){var e=sap.ui.getCore().byId("idAccesNode").getValue();var t=sap.ui.getCore().byId("idDesc").getValue();var o=d.getProperty("/Flag");sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:e,PARENT_NODE:"",ACCESS_NODES:e,NODE_TYPE:"AN",NODE_DESC:t,LOWERLIMIT:0,UPPERLIMIT:0,FLAG:o},success:function(e){sap.ui.core.BusyIndicator.hide();s.show("Creation Successfull");a.onAccNodeClose();a.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();if(e.statusCode===200){s.show("Creation Successfull")}else{s.show("Failed to create node")}a.onAccNodeClose();a.onAfterRendering()}})}})});