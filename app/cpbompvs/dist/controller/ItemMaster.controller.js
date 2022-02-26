sap.ui.define(["cpapp/cpbompvs/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,t,s,o,i,a,c){"use strict";var l,d;return e.extend("cpapp.cpbompvs.controller.ItemMaster",{onInit:function(){l=this;l.oModel=new s;this.locModel=new s;this.prodModel=new s;this.accModel=new s;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpbompvs.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpbompvs.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}this.locModel=new s;this.prodModel=new s;this.accModel=new s;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpbompvs.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpbompvs.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._oAccesNode){this._oAccesNode=sap.ui.xmlfragment("cpapp.cpbompvs.view.AccesNodes",l);l.getView().addDependent(this._oAccesNode)}if(!this._oAccesNodeList){this._oAccesNodeList=sap.ui.xmlfragment("cpapp.cpbompvs.view.AccessNodesList",l);l.getView().addDependent(this._oAccesNodeList)}this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){l=this;d=this.getModel("oGModel");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oAccList=this._oCore.byId(this._oAccesNodeList.getId()+"-list");this.getModel("BModel").read("/genProdAccessNode",{success:function(e){l.oModel.setData({results:e.results});l.byId("accessList").setModel(l.oModel)},error:function(){t.show("Failed to get data")}});this.getModel("BModel").read("/getLocation",{success:function(e){l.locModel.setData(e);l.oLocList.setModel(l.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,s){t.show("error")}});this.getModel("BModel").read("/getPVSNodes",{success:function(e){l.AccessNodes=[];for(var t=0;t<e.results.length;t++){if(e.results[t].NODE_TYPE==="AN"){l.AccessNodes.push(e.results[t])}}l.accModel.setData({results:l.AccessNodes});l.oAccList.setModel(l.accModel);sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to get data")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._valueHelpDialogLoc.open()}else if(t.includes("prod")){l._valueHelpDialogProd.open()}else if(t.includes("accn")){l._oAccesNodeList.open()}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(l.oLocList.getBinding("items")){l.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){l._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(l.oProdList.getBinding("items")){l.oProdList.getBinding("items").filter([])}}else if(t.includes("acc")){l._oCore.byId(this._oAccesNodeList.getId()+"-searchField").setValue("");if(l.oAccList.getBinding("items")){l.oAccList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=e.getParameter("id"),a=[];t=t?t.trim():"";if(s.includes("loc")){if(t!==""){a.push(new o({filters:[new o("LOCATION_ID",i.Contains,t),new o("LOCATION_DESC",i.Contains,t)],and:false}))}l.oLocList.getBinding("items").filter(a)}else if(s.includes("prod")){if(t!==""){a.push(new o({filters:[new o("PRODUCT_ID",i.Contains,t),new o("PROD_DESC",i.Contains,t)],and:false}))}l.oProdList.getBinding("items").filter(a)}else if(s.includes("acc")){if(t!==""){a.push(new o({filters:[new o("CHILD_NODE",i.Contains,t),new o("NODE_DESC",i.Contains,t)],and:false}))}l.oAccList.getBinding("items").filter(a)}},handleSelection:function(e){var s=e.getParameter("id"),a=e.getParameter("selectedItems"),c,d=[];if(s.includes("Loc")){this.oLoc=sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[1].getId());c=e.getParameter("selectedItems");l.oLoc.setValue(c[0].getTitle());this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",i.EQ,c[0].getTitle())],success:function(e){l.prodModel.setData(e);l.oProdList.setModel(l.prodModel)},error:function(e,s){t.show("error")}})}else if(s.includes("prod")){this.oProd=sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[3].getId());c=e.getParameter("selectedItems");l.oProd.setValue(c[0].getTitle())}else if(s.includes("acc")){this.oAccn=sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[5].getId());c=e.getParameter("selectedItems");l.oAccn.setValue(c[0].getTitle())}l.handleClose(e)},onhandlePress:function(e){d=this.getModel("oGModel");if(e){var t=e.getSource().getSelectedItem().getTitle(),s=e.getSource().getSelectedItem().getDescription(),o=e.getSource().getSelectedItem().getInfo();d.setProperty("/SelectedProd",t);d.setProperty("/SelectedLoc",s);d.setProperty("/SelectedNode",o)}else{}l.getOwnerComponent().runAsOwner(function(){if(!l.oDetailView){try{l.oDetailView=sap.ui.view({viewName:"cpapp.cpbompvs.view.ItemDetail",type:"XML"});l.bus.publish("flexible","addDetailPage",l.oDetailView);l.bus.publish("nav","toDetailPage",{viewName:l.oDetailView.getViewName()})}catch(e){l.oDetailView.onAfterRendering()}}else{l.bus.publish("nav","toDetailPage",{viewName:l.oDetailView.getViewName()})}})},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=[];if(t!==""){s.push(new o({filters:[new o("PRODUCT_ID",i.Contains,t),new o("LOCATION_ID",i.Contains,t)],and:false}))}l.byId("accessList").getBinding("items").filter(s)},onAccNode:function(e){if(!l._oAccesNode){l._oAccesNode=sap.ui.xmlfragment("cpapp.cpbompvs.view.AccesNodes",l);l.getView().addDependent(l._oAccesNode)}d=this.getModel("oGModel");d.setProperty("/Flag","");if(e.getSource().getTooltip().includes("Add")){l._oAccesNode.setTitle("Assign Access Node");d.setProperty("/Flag","C");l._oAccesNode.open()}else{if(this.byId("accessList").getSelectedItems().length){var s=this.byId("accessList").getSelectedItem().getCells()[0];l._oAccesNode.setTitle("Update Access Node");sap.ui.getCore().byId("idAccesNode").setValue(s.getTitle());sap.ui.getCore().byId("idDesc").setValue(s.getText());sap.ui.getCore().byId("idAccesNode").setEditable(false);d.setProperty("/Flag","E");l._oAccesNode.open()}else{t.show("Select access node to update")}}},onAccNodeClose:function(){l._oAccesNode.close();l._oAccesNode.destroy(true);l._oAccesNode=""},onAccNodeDel:function(e){var t=d.getProperty("/SelectedLoc"),s=d.getProperty("/SelectedProd");var o="Please confirm to remove access node"+" - "+t+" "+"-"+" "+s;sap.m.MessageBox.show(o,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();l.getModel("BModel").callFunction("/genProdAN",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:s,ACCESS_NODE:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Access Node deleted successfully");l.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})}}})},onAccessNodeSave:function(){var e=sap.ui.getCore().byId("idloc").getValue();var t=sap.ui.getCore().byId("idprod").getValue();var s=sap.ui.getCore().byId("idaccn").getValue();l.getModel("BModel").callFunction("/genProdAN",{method:"GET",urlParameters:{LOCATION_ID:e,PRODUCT_ID:t,ACCESS_NODE:s},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Assigned Access Node successfully");l.onAccNodeClose();l.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})}})});