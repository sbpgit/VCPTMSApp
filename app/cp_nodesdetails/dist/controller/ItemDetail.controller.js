sap.ui.define(["cpappf/cpnodesdetails/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,s,o,i,r,a,d){"use strict";var n,u;return e.extend("cpappf.cpnodesdetails.controller.ItemDetail",{onInit:function(){n=this;this.bus=sap.ui.getCore().getEventBus();n.oStruModel=new o;n.oViewlistModel=new o;n.oViewModel=new o;u=n.getOwnerComponent().getModel("oGModel")},onAfterRendering:function(){u=n.getOwnerComponent().getModel("oGModel");this.byId("sturList").removeSelections();n.byId("detailNode").setSelectedKey("struNode");var e=u.getProperty("/SelectedAccessNode");var t=u.getProperty("/struNodeData");var s=u.getProperty("/ViewNodeData");var o=u.getProperty("/StruViewNodeData");n.struNodeData=[];n.viewNodeData=[];n.struviewNodeData=[];for(var i=0;i<t.length;i++){if(t[i].PARENT_NODE===e){n.struNodeData.push(t[i])}}for(var i=0;i<s.length;i++){if(s[i].PARENT_NODE===e){n.viewNodeData.push(s[i])}}for(var r=0;r<n.viewNodeData.length;r++){var a=0;for(var i=0;i<o.length;i++){if(o[i].PARENT_NODE===n.viewNodeData[r].CHILD_NODE&&o[i].ACCESS_NODES===e){n.struviewNodeData.push(o[i]);a=1}}if(a===0){var d={AUTH_GROUP:null,CHILD_NODE:"No Structure Node assigned",NODE_DESC:"",NODE_TYPE:"",PARENT_NODE:n.viewNodeData[r].CHILD_NODE,createdAt:null,createdBy:null,modifiedAt:null,modifiedBy:null,Flag:"X"};n.struviewNodeData.push(d)}}u.setProperty("/tableData",n.struviewNodeData);n.oStruModel.setData({Struresults:n.struNodeData});n.byId("sturList").setModel(n.oStruModel);n.aReqTabData();var l=u.getProperty("/reqData");n.oViewlistModel.setData({ViewListresults:l.Requests});n.byId("nodeTable").setModel(n.oViewlistModel)},aReqTabData:function(e){var t=n.viewNodeData,s=e?e.results:u.getProperty("/tableData"),o={Requests:[]},i=[],r,a,d,l=function(e,t,s){var o=JSON.parse(JSON.stringify(e)),i=JSON.parse(JSON.stringify(t)),r=JSON.parse(JSON.stringify(e));i._isParent=false;if(o.children.length===0){r._isParent=false;o.children.push(r)}o.children.push(i);return o};if(s.length){for(var c=0;c<s.length;c++){r=i.indexOf(s[c].PARENT_NODE);if(r===-1){i.push(s[c].PARENT_NODE);s[c].children=[];s[c]._isParent=true;o.Requests.push(s[c])}else{a=o.Requests[r];d=l(a,s[c],"Reqs");o.Requests[r]=d}}}u.setProperty("/reqData",o)},onDetailSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=[];t=t?t.trim():"";if(t!==""){s.push(new i({filters:[new i("CHILD_NODE",r.Contains,t),new i("NODE_DESC",r.Contains,t)],and:false}))}n.byId("sturList").getBinding("items").filter(s)},onViewNodeSearch(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=u.getProperty("/tableData"),o=[];if(t&&t.trim()!==""){t=t.trim().toLocaleUpperCase();for(var i=0;i<s.length;i++){if(s[i].PARENT_NODE.includes(t)||s[i].CHILD_NODE.includes(t)){o.push(s[i])}}}else{o=s}n.aReqTabData({results:o});var r=u.getProperty("/reqData");n.oViewlistModel.setData({ViewListresults:r.Requests})},onTabChange:function(e){var t=n.byId("detailNode").getSelectedKey();if(t==="struNode"){n.byId("idAssign").setVisible(true);n.byId("idAstru").setVisible(true);n.byId("idEstru").setVisible(true);n.byId("idView").setVisible(false)}else if(t==="viewNode"){n.byId("idAssign").setVisible(false);n.byId("idAstru").setVisible(false);n.byId("idEstru").setVisible(false);n.byId("idView").setVisible(true)}},onAssign:function(e){if(!n._oViewNode){n._oViewNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodes",n);n.getView().addDependent(n._oViewNode)}if(this.byId("sturList").getSelectedItems().length){var s=u.getProperty("/ViewNodeData");n.viewAssignData=[];var o=u.getProperty("/SelectedAccessNode");u.setProperty("/selstrNode",this.byId("sturList").getSelectedItem().getCells()[0].getText());u.setProperty("/selstrNodeDesc",this.byId("sturList").getSelectedItem().getCells()[1].getText());for(var i=0;i<s.length;i++){if(s[i].PARENT_NODE===o){n.viewAssignData.push(s[i])}}n.oViewModel.setData({ViewNodesresults:n.viewAssignData});sap.ui.getCore().byId("ViewList").setModel(n.oViewModel);if(n.viewAssignData.length!==0){n._oViewNode.open()}else{t.show("There is no View Nodes for the selected Access Node")}}else{t.show("Select structure node to assign")}},onViewNodeClose:function(){sap.ui.getCore().byId("ViewList")._searchField.setValue("");if(n._oViewNode.getBinding("items")){n._oViewNode.getBinding("items").filter([])}},handleViewSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=e.getParameter("id"),o=[];t=t?t.trim():"";if(t!==""){o.push(new i({filters:[new i("CHILD_NODE",r.Contains,t),new i("NODE_DESC",r.Contains,t)],and:false}))}n._oViewNode.getBinding("items").filter(o)},onStruNode:function(e){if(!n._oStruNode){n._oStruNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.StructureNodes",n);n.getView().addDependent(n._oStruNode)}u=this.getModel("oGModel");u.setProperty("/sFlag","");if(e.getSource().getTooltip().includes("Add")){n._oStruNode.setTitle("Structure Node Creation");sap.ui.getCore().byId("idStruNode").setValue("");sap.ui.getCore().byId("idStruDesc").setValue("");sap.ui.getCore().byId("idLower").setValue("");sap.ui.getCore().byId("idUpper").setValue("");u.setProperty("/sFlag","C");n._oStruNode.open()}else{if(this.byId("sturList").getSelectedItems().length){var s=this.byId("sturList").getSelectedItem().getCells();n._oStruNode.setTitle("Update Structure Node");sap.ui.getCore().byId("idStruNode").setValue(s[0].getText());sap.ui.getCore().byId("idStruDesc").setValue(s[1].getText());sap.ui.getCore().byId("idStruNode").setEditable(false);u.setProperty("/sFlag","E");n._oStruNode.open()}else{t.show("Select structure node to update")}}},onStruNodeClose:function(){this.byId("sturList").removeSelections();n._oStruNode.close();n._oStruNode.destroy(true);n._oStruNode=""},onStruNodeDel:function(e){var s=e.getSource().getParent().getCells()[0].getText(),o=u.getProperty("/SelectedAccessNode");var i="Do you want to delete all the assignments of this Node. "+" - "+s+"-"+"Please confirm";sap.m.MessageBox.show(i,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();n.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:s,PARENT_NODE:o,ACCESS_NODES:o,NODE_TYPE:"SN",NODE_DESC:"",LOWERLIMIT:0,UPPERLIMIT:0,FLAG:"D"},success:function(e){if(e.results.length>0){t.show("Structure node deleted successfully")}else{t.show("Deletion failed")}n.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to delete Structure node");sap.ui.core.BusyIndicator.hide()}})}}})},onStruNodeSave:function(e){var s=sap.ui.getCore().byId("idAccNode").getValue(),o=sap.ui.getCore().byId("idStruNode").getValue(),i=sap.ui.getCore().byId("idStruDesc").getValue(),r=u.getProperty("/sFlag"),a,d;if(sap.ui.getCore().byId("idLower").getValue()===""){a=sap.ui.getCore().byId("idLower").getPlaceholder()}else{a=sap.ui.getCore().byId("idLower").getValue()}if(sap.ui.getCore().byId("idUpper").getValue()===""){d=sap.ui.getCore().byId("idUpper").getPlaceholder()}else{d=sap.ui.getCore().byId("idUpper").getValue()}if(d>=a){n.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:o,PARENT_NODE:s,ACCESS_NODES:s,NODE_TYPE:"SN",NODE_DESC:i,LOWERLIMIT:a,UPPERLIMIT:d,FLAG:r},success:function(e){if(r==="C"){t.show("Successfully created the structure node")}else{t.show("Successfully updated the structure node")}n.onStruNodeClose();n.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to updated the structure node");sap.ui.core.BusyIndicator.hide()}})}else{t.show("Lower limit is greater then Upper limit")}},onAssignViewNode:function(e){var s=u.getProperty("/selstrNode");var o=u.getProperty("/selstrNodeDesc");var i=e.getParameter("selectedItems")[0].getTitle();var r=e.getParameter("selectedItems")[0].getDescription(),a=u.getProperty("/SelectedAccessNode");var d=r+" "+"-"+" "+o;n.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:s,PARENT_NODE:i,ACCESS_NODES:a,NODE_TYPE:"VS",NODE_DESC:d,LOWERLIMIT:0,UPPERLIMIT:0,FLAG:"C"},success:function(e){if(e.results.length>0){t.show("View Node assigned successfully");n.onViewNodeClose();n.bus.publish("data","refreshMaster")}else{t.show("View Node is already assigned")}sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to updated the structure node");sap.ui.core.BusyIndicator.hide()}})},onStruViewDelete:function(e){var s=e.getSource().getParent().getBindingContext(),o=s.getObject().PARENT_NODE,i=s.getObject().CHILD_NODE,r=s.getObject().ACCESS_NODES;var a="Do you want to delete all the assignments of this Node. "+" - "+i+"-"+"Please confirm";sap.m.MessageBox.show(a,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();n.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:i,PARENT_NODE:o,ACCESS_NODES:r,NODE_TYPE:"VS",NODE_DESC:"",LOWERLIMIT:0,UPPERLIMIT:0,FLAG:"D"},success:function(e){if(e.results.length>0){t.show("Deleted successfully")}else{t.show("Deletion failed")}n.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to unassign structure node");sap.ui.core.BusyIndicator.hide()}})}}})},onViewNode:function(){if(!n._oViewNodeCreate){n._oViewNodeCreate=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodesCreation",n);n.getView().addDependent(n._oViewNodeCreate)}sap.ui.getCore().byId("idViewNode").setValue("");sap.ui.getCore().byId("idViewDesc").setValue("");n._oViewNodeCreate.open()},onViewClose:function(){n._oViewNodeCreate.close();n._oViewNodeCreate.destroy(true);n._oViewNodeCreate=""},onViewNodeCreate:function(){var e=u.getProperty("/SelectedAccessNode"),s=sap.ui.getCore().byId("idViewNode").getValue(),o=sap.ui.getCore().byId("idViewDesc").getValue();n.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:s,PARENT_NODE:e,ACCESS_NODES:e,NODE_TYPE:"VN",NODE_DESC:o,LOWERLIMIT:0,UPPERLIMIT:0,FLAG:"C"},success:function(e){t.show("Successfully created view node");n.onViewClose();n.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to updated the structure node");sap.ui.core.BusyIndicator.hide()}})},onViewNOdeDelete:function(e){var s=e.getSource().getParent().getBindingContext(),o=s.getObject().PARENT_NODE,i=u.getProperty("/SelectedAccessNode");var r="Do you want to delete all the assignments of this Node. "+" - "+o+"-"+"Please confirm";sap.m.MessageBox.show(r,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();n.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:o,PARENT_NODE:i,ACCESS_NODES:i,NODE_TYPE:"VN",NODE_DESC:"",LOWERLIMIT:0,UPPERLIMIT:0,FLAG:"D"},success:function(e){if(e.results.length>0){t.show("Deleted successfully")}else{t.show("Deletion failed")}n.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to unassign structure node");sap.ui.core.BusyIndicator.hide()}})}}})}})});