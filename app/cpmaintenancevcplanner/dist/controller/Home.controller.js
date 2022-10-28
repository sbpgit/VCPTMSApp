sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/richtexteditor/RichTextEditor","sap/m/Dialog","sap/m/library","sap/m/Text","sap/m/Button"],function(e,t,o,s,a,i,n){"use strict";var d,r,l=0,g=0;var u=a.DialogType;var c=a.ButtonType;return e.extend("cpapp.cpmaintenancevcplanner.controller.Home",{onInit:function(){d=this;var e=new t;if(!this._cDialog){this._cDialog=sap.ui.xmlfragment("cpapp.cpmaintenancevcplanner.view.Edit",this);this._cDialog.setModel(this.getView().getModel());this.getView().addDependent(this._cDialog)}if(!this._pDialog){this._pDialog=sap.ui.xmlfragment("cpapp.cpmaintenancevcplanner.view.Create",this);this._pDialog.setModel(this.getView().getModel());this.getView().addDependent(this._pDialog)}},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();var e=[];var t=new sap.ui.model.json.JSONModel;var s=new sap.ui.model.json.JSONModel;d.oGModel=d.getOwnerComponent().getModel("oGModel");this.getView().getModel("oModel").read("/getPageHdr",{success:function(t){var o=t.results;d.oGModel.setProperty("/COMBOID",o);for(var s=0;s<=o.length-1;s++){e.push({NodeID:o[s].PAGEID,HierarchyLevel:o[s].HEIRARCHYLEVEL,Description:o[s].DESCRIPTION,ParentNodeID:o[s].PARENTNODEID})}var a=d.byId("nodes");var o=e;var i={};for(var s=0;s<o.length;s++){var n="id"+o[s].NodeID;i[n]=o[s];i[n].__metadata=""}for(var s in i){i[s].children=[]}for(var s in i){var r="id"+i[s].ParentNodeID;if(i[r]){i[r].children.push(i[s])}}var l=[];for(var s in i){var r="id"+i[s].ParentNodeID;if(!i[r]){l.push(i[s])}}var g=new sap.ui.model.json.JSONModel;g.setData({items:l});a.setModel(g);d.byId("nodes").getItems()[0].addStyleClass("red")}});this.getView().getModel("oModel").read("/getPagePgrh",{success:function(e){var t=e.results;d.oGModel.setProperty("/Content",t);d.byId("videoPanel").setVisible(true);d.byId("content").setVisible(false);d.byId("image").setVisible(false);d.byId("textContent").setVisible(false);if(l>0){d.oRichTextEditor.destroy()}l=l+1;d.oRichTextEditor=new o("myRTE"+l,{width:"100%",height:"100%",editable:true,customToolbar:true,showGroupFont:true,showGroupLink:true,showGroupInsert:true,value:t[0].CONTENT});d.getView().byId("videoPanel").addContent(d.oRichTextEditor);d.oGModel.setProperty("/DetailsData",t[0]);d.byId("detailTitle").setText(t[0].DESCRIPTION);d.oGModel.setProperty("/editData",t)},error:function(e){sap.m.MessageToast.show(e)}});sap.ui.core.BusyIndicator.hide();d.byId("idHTML").setContent()},onSelectionChange:function(e){d.byId("htmlText").setValue();d.byId("textLength").setText();d.byId("idHTML").setContent("");var t=e.getSource().getBindingContext().getProperty().NodeID;var s=d.byId("nodes").getItems();for(var a=0;a<=s.length-1;a++){if(t===s[a].getBindingContext().getObject().NodeID){s[a].addStyleClass("red")}else{s[a].removeStyleClass("red")}}var i=d.oGModel.getProperty("/Content");for(var n=0;n<=i.length-1;n++){if(t===i[n].PAGEID){d.byId("videoPanel").setVisible(true);d.byId("content").setVisible(false);d.byId("image").setVisible(false);d.byId("textContent").setVisible(false);if(l>0){d.oRichTextEditor.destroy()}l=l+1;d.oRichTextEditor=new o("myRTE"+l,{width:"100%",height:"100%",editable:true,customToolbar:true,showGroupFont:true,showGroupLink:true,showGroupInsert:true,value:i[n].CONTENT});d.getView().byId("videoPanel").addContent(d.oRichTextEditor);d.byId("detailTitle").setText(i[n].DESCRIPTION);d.oGModel.setProperty("/DetailsData",i[n])}}},onShown:function(){d.byId("idHTML").setContent();var e=d.byId("videoPanel").getContent()[0].getValue();d.byId("htmlText").setValue(e);d.byId("textLength").setText(e.length);d.byId("idHTML").setContent(e)},onSaved:function(){var e=d.byId("htmlText").getValue();if(e.length>0){sap.ui.core.BusyIndicator.show();d.byId("textLength").setText();d.byId("htmlText").setValue("");var t=d.oGModel.getProperty("/DetailsData");var o=t.PAGEID;var s=t.DESCRIPTION;var a=d.getView().getModel("oModel");a.callFunction("/moveData",{method:"GET",urlParameters:{Flag:"i",CONTENT:e,PAGEID:o,DESCRIPTION:s},success:function(e,t){sap.ui.core.BusyIndicator.hide();d.onAfterRendering();sap.m.MessageToast.show("Paragraph file updated successfully")},error:function(e){sap.m.MessageToast.show(e.Message)}})}else{sap.m.MessageToast.show("No data selected")}},onCollapsePress:function(){var e=d.byId("nodes").getSelectedItems();var t=d.oGModel.getProperty("/COMBOID");var o=t.length+1;sap.ui.getCore().byId("Pageid").setValue(o);if(e.length===0){this._pDialog.open();sap.ui.getCore().byId("idCreate").setVisible(true);sap.ui.getCore().byId("idCreate").setValue("New Parent Node");sap.ui.getCore().byId("idNodeID").setValue("0");var s=1;sap.ui.getCore().byId("idHL").setValue(s)}else if(e.length===1){this._pDialog.open();var a=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;var i=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;var n=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().HierarchyLevel;var s=n+1;sap.ui.getCore().byId("idCreate").setVisible(true);sap.ui.getCore().byId("idCreate").setValue(a);sap.ui.getCore().byId("idNodeID").setValue(i);sap.ui.getCore().byId("idHL").setValue(s)}else{sap.m.MessageToast.show("Select only one node")}},onClose:function(){if(this._pDialog){this._pDialog.close();sap.ui.getCore().byId("idHL").setValue("");sap.ui.getCore().byId("Desc").setValue("");sap.ui.getCore().byId("idContent").setValue("")}},onCreate:function(){sap.ui.core.BusyIndicator.show();if(sap.ui.getCore().byId("Pageid").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("idHL").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("Desc").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("idCreate").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("idContent").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else{var e=sap.ui.getCore().byId("Pageid").getValue();var t=sap.ui.getCore().byId("Desc").getValue();var o=sap.ui.getCore().byId("idNodeID").getValue();var s=sap.ui.getCore().byId("idHL").getValue();var a=sap.ui.getCore().byId("idContent").getValue();var i=this.getView().getModel("oModel");i.callFunction("/addPAGEHEADER",{method:"GET",urlParameters:{Flag1:"n",PAGEID:e,DESCRIPTION:t,PARENTNODEID:o,HEIRARCHYLEVEL:s},success:function(e,t){sap.m.MessageToast.show("Successfully updated in Header File")},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEHEADER")}});i.callFunction("/addPAGEPARAGRAPH",{method:"GET",urlParameters:{Flag1:"n",PAGEID:e,DESCRIPTION:t,CONTENT:a},success:function(e,t){sap.m.MessageToast.show("Successfully updated in Content File");d.onClose();d.onAfterRendering();d.byId("idHTML").setContent();sap.ui.core.BusyIndicator.hide()},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEPARAGRAPH")}})}},onEdit:function(e){var t=d.byId("nodes").getSelectedItems().length;if(t===1){this._cDialog.open();var o=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;var s=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;var a=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().ParentNodeID;var i=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().HierarchyLevel;sap.ui.getCore().byId("Pageidedit").setValue(o);sap.ui.getCore().byId("Pnodeedit").setValue(s);sap.ui.getCore().byId("Pnodeedid").setValue(a);sap.ui.getCore().byId("idHLedit").setValue(i);var n=d.oGModel.getProperty("/editData");for(var r=0;r<=n.length-1;r++){if(o===n[r].PAGEID){var l=n[r].CONTENT}}sap.ui.getCore().byId("idContentedit").setValue(l)}else if(t===0){sap.m.MessageToast.show("Select atleast one node")}else{sap.m.MessageToast.show("Select only one node")}},onSubmit:function(){sap.ui.core.BusyIndicator.show();var e=sap.ui.getCore().byId("Pageidedit").getValue();var t=sap.ui.getCore().byId("Pnodeedit").getValue();var o=sap.ui.getCore().byId("Pnodeedid").getValue();var s=sap.ui.getCore().byId("idHLedit").getValue();var a=sap.ui.getCore().byId("idContentedit").getValue();var i=this.getView().getModel("oModel");i.callFunction("/editPAGEHEADER",{method:"GET",urlParameters:{Flag1:"e",PAGEID:e,DESCRIPTION:t,PARENTNODEID:o,HEIRARCHYLEVEL:s},success:function(e,t){sap.m.MessageToast.show("Updated successfully in Header Page")},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEHEADER")}});i.callFunction("/editPAGEPARAGRAPH",{method:"GET",urlParameters:{Flag1:"e",PAGEID:e,DESCRIPTION:t,CONTENT:a},success:function(e,t){d.onClose1();d.onAfterRendering();d.byId("idHTML").setContent();sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Updated successfully in Paragraph Page")},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEHEADER")}})},onClose1:function(){if(this._cDialog){this._cDialog.close()}},onTreeChange:function(e){if(e.getParameters().reason==="filter"){const e=this.getOwnerComponent().getModel("oGModel");const t=e.getProperty("/query");this.byId("nodes").expandToLevel(t?99:0)}},onDelete:function(){var e=d.byId("nodes").getSelectedItems().length;if(e===1){var t=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;if(!this.oApproveDialog){this.oApproveDialog=new s({type:u.Message,title:t,content:new i({text:"Do you want to delete this node?"}),beginButton:new n({type:c.Emphasized,text:"Submit",press:function(){sap.ui.core.BusyIndicator.show();var e=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;var t=this.getView().getModel("oModel");t.callFunction("/deletePAGEHEADER",{method:"GET",urlParameters:{Flag1:"d",PAGEID:e},success:function(e,t){sap.m.MessageToast.show("Deletion successfull in Header Json File")},error:function(e){sap.m.MessageToast.show("Failed to delete in PAGEHEADER")}});t.callFunction("/deletePAGEPARAGRAPH",{method:"GET",urlParameters:{Flag1:"d",PAGEID:e},success:function(e,t){sap.m.MessageToast.show("Deletion successfull in Data Json File");d.onAfterRendering();d.byId("idHTML").setContent();d.oApproveDialog.close();sap.ui.core.BusyIndicator.hide()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Failed to delete in PAGEPARAGRAPH")}})}.bind(this)}),endButton:new n({text:"Cancel",press:function(){this.oApproveDialog.close()}.bind(this)})})}this.oApproveDialog.open()}else if(e===0){sap.m.MessageToast.show("Select atleast one node")}else{sap.m.MessageToast.show("Select only one node")}},myJsFunc:function(e){d.byId("idHTML").setContent();var t=8;var o=d.byId("nodes");o.expandToLevel(3);var s=d.byId("nodes").getItems();var a=d.oGModel.getProperty("/Content");for(var i=0;i<=s.length-1;i++){if(t===s[i].getBindingContext().getObject().NodeID){s[i].addStyleClass("red");o.expand[i]}else{s[i].removeStyleClass("red")}}for(var n=0;n<=a.length-1;n++){if(t===a[n].PAGEID){d.byId("idHTML").setContent(a[n].CONTENT);d.byId("detailTitle").setText(a[n].DESCRIPTION)}}}})});