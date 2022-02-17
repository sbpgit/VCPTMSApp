sap.ui.define(["cpapp/cpassignnode/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,s,r,n,a,i){"use strict";var d,l;return e.extend("cpapp.cpassignnode.controller.ItemDetail",{onInit:function(){d=this;this.bus=sap.ui.getCore().getEventBus();d.oStruModel=new s;d.oAssinModel=new s;d.oStruModel.setSizeLimit(1e3);l=d.getOwnerComponent().getModel("oGModel")},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();l=d.getOwnerComponent().getModel("oGModel");d.byId("sturList").removeSelections();var e=l.getProperty("/SelectedLoc");var o=l.getProperty("/SelectedProd");this.getModel("BModel").read("/getPVSBOM",{filters:[new r("PRODUCT_ID",n.EQ,o),new r("LOCATION_ID",n.EQ,e)],success:function(e){sap.ui.core.BusyIndicator.hide();d.oStruModel.setData({results:e.results});d.byId("sturList").setModel(d.oStruModel)},error:function(e){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})},onDetailSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];t=t?t.trim():"";if(t!==""){o.push(new r({filters:[new r("COMPONENT",n.Contains,t),new r("STRUC_NODE",n.Contains,t)],and:false}))}d.byId("sturList").getBinding("items").filter(o)},onAssign:function(e){if(!d._oStruNode){d._oStruNode=sap.ui.xmlfragment("cpapp.cpassignnode.view.StructureNodes",d);d.getView().addDependent(d._oStruNode)}if(d.byId("sturList").getSelectedItems().length===1){var o=l.getProperty("/SelectedNode");var s=d.byId("sturList").getSelectedItem().getCells()[1].getText();l.setProperty("/SelecteComponent",s);this.getModel("BModel").read("/getPVSNodes",{filters:[new r("PARENT_NODE",n.EQ,o),new r("NODE_TYPE",n.EQ,"SN")],success:function(e){d.oAssinModel.setData({results:e.results});sap.ui.getCore().byId("sturList").setModel(d.oAssinModel);d._oStruNode.open()},error:function(){t.show("Failed to get data")}})}else{t.show("Please select compponent to assign structure node")}},handleStruSelection:function(e){var t=l.getProperty("/SelectedLoc"),o=l.getProperty("/SelectedProd"),s=l.getProperty("/SelecteComponent"),r=e.getParameter("selectedItems")[0].getTitle();var n="/v2/catalog/genCompStrcNode";$.ajax({url:n,type:"post",contentType:"application/json",data:JSON.stringify({LOCATION_ID:t,PRODUCT_ID:o,COMPONENT:s,STRUC_NODE:r}),dataType:"json",async:false,timeout:0,success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Structure Node assigned");d.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})},handleStruSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];t=t?t.trim():"";if(t!==""){o.push(new r({filters:[new r("CHILD_NODE",n.Contains,t),new r("NODE_DESC",n.Contains,t)],and:false}))}d._oStruNode.getBinding("items").filter(o)},onStructureNodeDel:function(e){var t=l.getProperty("/SelectedLoc"),o=l.getProperty("/SelectedProd"),s=e.getSource().getParent().getCells()[1].getText();var r="/v2/catalog/genCompStrcNode";$.ajax({url:r,type:"post",contentType:"application/json",data:JSON.stringify({LOCATION_ID:t,PRODUCT_ID:o,COMPONENT:s,STRUC_NODE:"D"}),dataType:"json",async:false,timeout:0,success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Structure Node deleted");d.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})}})});