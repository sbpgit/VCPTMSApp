//@ui5-bundle cpapp/cpmaintenancevcplanner/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpmaintenancevcplanner/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpmaintenancevcplanner/model/models"],function(e,n,t){"use strict";return e.extend("cpapp.cpmaintenancevcplanner.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cpapp/cpmaintenancevcplanner/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("cpapp.cpmaintenancevcplanner.controller.App",{onInit(){}})});
},
	"cpapp/cpmaintenancevcplanner/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/richtexteditor/RichTextEditor","sap/m/Dialog","sap/m/library","sap/m/Text","sap/m/Button"],function(e,t,o,s,a,i,n){"use strict";var d,r,l=0,g=0;var u=a.DialogType;var c=a.ButtonType;return e.extend("cpapp.cpmaintenancevcplanner.controller.Home",{onInit:function(){d=this;var e=new t;if(!this._cDialog){this._cDialog=sap.ui.xmlfragment("cpapp.cpmaintenancevcplanner.view.Edit",this);this._cDialog.setModel(this.getView().getModel());this.getView().addDependent(this._cDialog)}if(!this._pDialog){this._pDialog=sap.ui.xmlfragment("cpapp.cpmaintenancevcplanner.view.Create",this);this._pDialog.setModel(this.getView().getModel());this.getView().addDependent(this._pDialog)}},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();var e=[];var t=new sap.ui.model.json.JSONModel;var s=new sap.ui.model.json.JSONModel;d.oGModel=d.getOwnerComponent().getModel("oGModel");this.getView().getModel("oModel").read("/getPageHdr",{success:function(t){var o=t.results;d.oGModel.setProperty("/COMBOID",o);for(var s=0;s<=o.length-1;s++){e.push({NodeID:o[s].PAGEID,HierarchyLevel:o[s].HEIRARCHYLEVEL,Description:o[s].DESCRIPTION,ParentNodeID:o[s].PARENTNODEID})}var a=d.byId("nodes");var o=e;var i={};for(var s=0;s<o.length;s++){var n="id"+o[s].NodeID;i[n]=o[s];i[n].__metadata=""}for(var s in i){i[s].children=[]}for(var s in i){var r="id"+i[s].ParentNodeID;if(i[r]){i[r].children.push(i[s])}}var l=[];for(var s in i){var r="id"+i[s].ParentNodeID;if(!i[r]){l.push(i[s])}}var g=new sap.ui.model.json.JSONModel;g.setData({items:l});a.setModel(g);d.byId("nodes").getItems()[0].addStyleClass("red")}});this.getView().getModel("oModel").read("/getPagePgrh",{success:function(e){var t=e.results;d.oGModel.setProperty("/Content",t);d.byId("videoPanel").setVisible(true);d.byId("content").setVisible(false);d.byId("image").setVisible(false);d.byId("textContent").setVisible(false);if(l>0){d.oRichTextEditor.destroy()}l=l+1;d.oRichTextEditor=new o("myRTE"+l,{width:"100%",height:"100%",editable:true,customToolbar:true,showGroupFont:true,showGroupLink:true,showGroupInsert:true,value:t[0].CONTENT});d.getView().byId("videoPanel").addContent(d.oRichTextEditor);d.oGModel.setProperty("/DetailsData",t[0]);d.byId("detailTitle").setText(t[0].DESCRIPTION);d.oGModel.setProperty("/editData",t)},error:function(e){sap.m.MessageToast.show(e)}});sap.ui.core.BusyIndicator.hide();d.byId("idHTML").setContent()},onSelectionChange:function(e){d.byId("htmlText").setValue();d.byId("textLength").setText();d.byId("idHTML").setContent("");var t=e.getSource().getBindingContext().getProperty().NodeID;var s=d.byId("nodes").getItems();for(var a=0;a<=s.length-1;a++){if(t===s[a].getBindingContext().getObject().NodeID){s[a].addStyleClass("red")}else{s[a].removeStyleClass("red")}}var i=d.oGModel.getProperty("/Content");for(var n=0;n<=i.length-1;n++){if(t===i[n].PAGEID){d.byId("videoPanel").setVisible(true);d.byId("content").setVisible(false);d.byId("image").setVisible(false);d.byId("textContent").setVisible(false);if(l>0){d.oRichTextEditor.destroy()}l=l+1;d.oRichTextEditor=new o("myRTE"+l,{width:"100%",height:"100%",editable:true,customToolbar:true,showGroupFont:true,showGroupLink:true,showGroupInsert:true,value:i[n].CONTENT});d.getView().byId("videoPanel").addContent(d.oRichTextEditor);d.byId("detailTitle").setText(i[n].DESCRIPTION);d.oGModel.setProperty("/DetailsData",i[n])}}},onShown:function(){d.byId("idHTML").setContent();var e=d.byId("videoPanel").getContent()[0].getValue();d.byId("htmlText").setValue(e);d.byId("textLength").setText(e.length);d.byId("idHTML").setContent(e)},onSaved:function(){var e=d.byId("htmlText").getValue();if(e.length>0){sap.ui.core.BusyIndicator.show();d.byId("textLength").setText();d.byId("htmlText").setValue("");var t=d.oGModel.getProperty("/DetailsData");var o=t.PAGEID;var s=t.DESCRIPTION;var a=d.getView().getModel("oModel");a.callFunction("/moveData",{method:"GET",urlParameters:{Flag:"i",CONTENT:e,PAGEID:o,DESCRIPTION:s},success:function(e,t){sap.ui.core.BusyIndicator.hide();d.onAfterRendering();sap.m.MessageToast.show("Paragraph file updated successfully")},error:function(e){sap.m.MessageToast.show(e.Message)}})}else{sap.m.MessageToast.show("No data selected")}},onCollapsePress:function(){var e=d.byId("nodes").getSelectedItems();var t=d.oGModel.getProperty("/COMBOID");var o=t.length+1;sap.ui.getCore().byId("Pageid").setValue(o);if(e.length===0){this._pDialog.open();sap.ui.getCore().byId("idCreate").setVisible(true);sap.ui.getCore().byId("idCreate").setValue("New Parent Node");sap.ui.getCore().byId("idNodeID").setValue("0");var s=1;sap.ui.getCore().byId("idHL").setValue(s)}else if(e.length===1){this._pDialog.open();var a=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;var i=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;var n=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().HierarchyLevel;var s=n+1;sap.ui.getCore().byId("idCreate").setVisible(true);sap.ui.getCore().byId("idCreate").setValue(a);sap.ui.getCore().byId("idNodeID").setValue(i);sap.ui.getCore().byId("idHL").setValue(s)}else{sap.m.MessageToast.show("Select only one node")}},onClose:function(){if(this._pDialog){this._pDialog.close();sap.ui.getCore().byId("idHL").setValue("");sap.ui.getCore().byId("Desc").setValue("");sap.ui.getCore().byId("idContent").setValue("")}},onCreate:function(){sap.ui.core.BusyIndicator.show();if(sap.ui.getCore().byId("Pageid").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("idHL").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("Desc").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("idCreate").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else if(sap.ui.getCore().byId("idContent").getValue()===""){sap.m.MessageToast.show("Please fill your details");sap.ui.core.BusyIndicator.hide()}else{var e=sap.ui.getCore().byId("Pageid").getValue();var t=sap.ui.getCore().byId("Desc").getValue();var o=sap.ui.getCore().byId("idNodeID").getValue();var s=sap.ui.getCore().byId("idHL").getValue();var a=sap.ui.getCore().byId("idContent").getValue();var i=this.getView().getModel("oModel");i.callFunction("/addPAGEHEADER",{method:"GET",urlParameters:{Flag1:"n",PAGEID:e,DESCRIPTION:t,PARENTNODEID:o,HEIRARCHYLEVEL:s},success:function(e,t){sap.m.MessageToast.show("Successfully updated in Header File")},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEHEADER")}});i.callFunction("/addPAGEPARAGRAPH",{method:"GET",urlParameters:{Flag1:"n",PAGEID:e,DESCRIPTION:t,CONTENT:a},success:function(e,t){sap.m.MessageToast.show("Successfully updated in Content File");d.onClose();d.onAfterRendering();d.byId("idHTML").setContent();sap.ui.core.BusyIndicator.hide()},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEPARAGRAPH")}})}},onEdit:function(e){var t=d.byId("nodes").getSelectedItems().length;if(t===1){this._cDialog.open();var o=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;var s=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;var a=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().ParentNodeID;var i=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().HierarchyLevel;sap.ui.getCore().byId("Pageidedit").setValue(o);sap.ui.getCore().byId("Pnodeedit").setValue(s);sap.ui.getCore().byId("Pnodeedid").setValue(a);sap.ui.getCore().byId("idHLedit").setValue(i);var n=d.oGModel.getProperty("/editData");for(var r=0;r<=n.length-1;r++){if(o===n[r].PAGEID){var l=n[r].CONTENT}}sap.ui.getCore().byId("idContentedit").setValue(l)}else if(t===0){sap.m.MessageToast.show("Select atleast one node")}else{sap.m.MessageToast.show("Select only one node")}},onSubmit:function(){sap.ui.core.BusyIndicator.show();var e=sap.ui.getCore().byId("Pageidedit").getValue();var t=sap.ui.getCore().byId("Pnodeedit").getValue();var o=sap.ui.getCore().byId("Pnodeedid").getValue();var s=sap.ui.getCore().byId("idHLedit").getValue();var a=sap.ui.getCore().byId("idContentedit").getValue();var i=this.getView().getModel("oModel");i.callFunction("/editPAGEHEADER",{method:"GET",urlParameters:{Flag1:"e",PAGEID:e,DESCRIPTION:t,PARENTNODEID:o,HEIRARCHYLEVEL:s},success:function(e,t){sap.m.MessageToast.show("Updated successfully in Header Page")},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEHEADER")}});i.callFunction("/editPAGEPARAGRAPH",{method:"GET",urlParameters:{Flag1:"e",PAGEID:e,DESCRIPTION:t,CONTENT:a},success:function(e,t){d.onClose1();d.onAfterRendering();d.byId("idHTML").setContent();sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Updated successfully in Paragraph Page")},error:function(e){sap.m.MessageToast.show("Failed to Update in PAGEHEADER")}})},onClose1:function(){if(this._cDialog){this._cDialog.close()}},onTreeChange:function(e){if(e.getParameters().reason==="filter"){const e=this.getOwnerComponent().getModel("oGModel");const t=e.getProperty("/query");this.byId("nodes").expandToLevel(t?99:0)}},onDelete:function(){var e=d.byId("nodes").getSelectedItems().length;if(e===1){var t=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;if(!this.oApproveDialog){this.oApproveDialog=new s({type:u.Message,title:t,content:new i({text:"Do you want to delete this node?"}),beginButton:new n({type:c.Emphasized,text:"Submit",press:function(){sap.ui.core.BusyIndicator.show();var e=d.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;var t=this.getView().getModel("oModel");t.callFunction("/deletePAGEHEADER",{method:"GET",urlParameters:{Flag1:"d",PAGEID:e},success:function(e,t){sap.m.MessageToast.show("Deletion successfull in Header Json File")},error:function(e){sap.m.MessageToast.show("Failed to delete in PAGEHEADER")}});t.callFunction("/deletePAGEPARAGRAPH",{method:"GET",urlParameters:{Flag1:"d",PAGEID:e},success:function(e,t){sap.m.MessageToast.show("Deletion successfull in Data Json File");d.onAfterRendering();d.byId("idHTML").setContent();d.oApproveDialog.close();sap.ui.core.BusyIndicator.hide()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Failed to delete in PAGEPARAGRAPH")}})}.bind(this)}),endButton:new n({text:"Cancel",press:function(){this.oApproveDialog.close()}.bind(this)})})}this.oApproveDialog.open()}else if(e===0){sap.m.MessageToast.show("Select atleast one node")}else{sap.m.MessageToast.show("Select only one node")}},myJsFunc:function(e){d.byId("idHTML").setContent();var t=8;var o=d.byId("nodes");o.expandToLevel(3);var s=d.byId("nodes").getItems();var a=d.oGModel.getProperty("/Content");for(var i=0;i<=s.length-1;i++){if(t===s[i].getBindingContext().getObject().NodeID){s[i].addStyleClass("red");o.expand[i]}else{s[i].removeStyleClass("red")}}for(var n=0;n<=a.length-1;n++){if(t===a[n].PAGEID){d.byId("idHTML").setContent(a[n].CONTENT);d.byId("detailTitle").setText(a[n].DESCRIPTION)}}},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");e.toExternal({target:{semanticObject:"cpappcpvcplannerdocumentation",action:"display"}})}}})});
},
	"cpapp/cpmaintenancevcplanner/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpmaintenancevcplanner\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Maintenance VC Planner Documentation\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Maintenance VC Planner Documentation\n\nflpTitle=VC Planner Doc\n\nflpSubtitle=Maintenance\n',
	"cpapp/cpmaintenancevcplanner/manifest.json":'{"_version":"1.42.0","sap.app":{"id":"cpapp.cpmaintenancevcplanner","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.5","toolsId":"c8fc73ab-c188-4a48-8a12-09155cb46e4b"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpmaintenancevcplanner-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpmaintenancevcplannerdoc","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"services":{"ShellUIService":{"factoryName":"sap.ushell.ui5service.ShellUIService"}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpmaintenancevcplanner.i18n.i18n"}},"oModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"oGModel":{"type":"sap.ui.model.json.JSONModel"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpmaintenancevcplanner.view","controlAggregation":"pages","controlId":"SplitAppDemo","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":"RouteHome","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpmaintenancevcplanner.view.Home","type":"XML","async":true,"id":"SplitAppDemo"}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.Developer"]}}',
	"cpapp/cpmaintenancevcplanner/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpmaintenancevcplanner/utils/locate-reuse-libs.js":'(function(e){var t=function(e,t){var n=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];Object.keys(e).forEach(function(e){if(!n.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t};var n=function(e){var n="";if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=t(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=t(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=t(e["sap.ui5"].componentUsages,n)}}return n};var r=function(e){var t=e;return new Promise(function(r,a){$.ajax(t).done(function(e){r(n(e))}).fail(function(){a(new Error("Could not fetch manifest at \'"+e))})})};var a=function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}};e.registerComponentDependencyPaths=function(e){return r(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(a)}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");var bundleResources=function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")};sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(bundleResources);if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(bundleResources)}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpmaintenancevcplanner/view/App.view.xml":'<mvc:View controllerName="cpapp.cpmaintenancevcplanner.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"cpapp/cpmaintenancevcplanner/view/Create.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form" xmlns:semantic="sap.m.semantic" xmlns:l="sap.ui.layout"><Dialog id="helloDialog" title="Create Form" afterClose="onAfterClose"><f:SimpleForm id="createEmpDetails" visible="true" editable="true" layout="ResponsiveGridLayout" adjustLabelSpan="false" emptySpanL="6" columnsL="1"><f:content><Label text="Page Id" design="Bold" visible="true" /><Input required="true" id="Pageid" visible="true" enabled="false" /><Label text="Description" required="true" design="Bold" /><Input id="Desc" value="" placeholder="Enter Description" /><Label text="Parent Node Description" required="true" design="Bold" /><Input id="idCreate" value="" visible="false" enabled="false" /><Input id="idNodeID" value="" visible="false" /><Label text="Hierarchy Level" required="true" design="Bold" /><Input placeholder="Enter Heirarchy Level" id="idHL" enabled="false" /><Label text="Content" class="phid" required="true" design="Bold" /><Input id="idContent" placeholder="Enter Content" /></f:content></f:SimpleForm><beginButton><Button text="Create" press="onCreate" type="Emphasized" /></beginButton><endButton><Button text="Close" press="onClose" type="Emphasized" /></endButton></Dialog></core:FragmentDefinition>\n',
	"cpapp/cpmaintenancevcplanner/view/Edit.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form" xmlns:semantic="sap.m.semantic" xmlns:l="sap.ui.layout"><Dialog id="helloDialog1" title="Rename Node" afterClose="onAfterClose" class="fragmentTitle"><f:SimpleForm id="createEmpDetails1" visible="true" editable="true" layout="ResponsiveGridLayout" adjustLabelSpan="false" emptySpanL="6" columnsL="1"><f:content><Label text="Page Id" design="Bold" visible="false" /><Input required="true" id="Pageidedit" visible="false" enabled="false" /><Label text="Node Description" required="true" design="Bold" /><Input placeholder="Enter Node description" id="Pnodeedit" /><Label text="Parent Node Id" required="true" design="Bold" visible="false" /><Input placeholder="Enter Node description" id="Pnodeedid" enabled="false" visible="false" /><Label text="Hierarchy Level" required="true" design="Bold" visible="false" /><Input placeholder="Enter Heirarchy Level" id="idHLedit" enabled="false" visible="false" /><Label text="Content" class="phid" required="true" design="Bold" visible="false" /><Input id="idContentedit" placeholder="Enter Content" enabled="false" visible="false" /></f:content></f:SimpleForm><beginButton><Button text="Rename" press="onSubmit" type="Emphasized" /></beginButton><endButton><Button text="Close" press="onClose1" type="Emphasized" /></endButton></Dialog></core:FragmentDefinition>\n',
	"cpapp/cpmaintenancevcplanner/view/Home.view.xml":'<mvc:View\n    controllerName="cpapp.cpmaintenancevcplanner.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    displayBlock="true"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:m="sap.m"\n    xmlns:ui="sap.ui.table"\n    xmlns:l="sap.ui.layout"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:custom="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\n    xmlns:demo="control"\n    height="100%"><SplitApp id="SplitAppDemo" initialDetail="detail" initialMaster="master"><masterPages><Page id="master" backgroundDesign="Solid" enableScrolling="true" class="Heading1"><customHeader><Toolbar id="_IDGenToolbar1" height="2.56em" class="classHead"><Title id="masterTitle" text="Contents" class="ClassHead" /><ToolbarSpacer id="_IDGenToolbarSpacer1" /><Button id="collapseButton" press="onCollapsePress" tooltip="Add node" icon="sap-icon://add" class="button" /><Button id="btnedit" press="onEdit" tooltip="Rename node" icon="sap-icon://edit" class="button" /><Button id="btndelete" press="onDelete" tooltip="Delete node" icon="sap-icon://delete" class="button" /></Toolbar></customHeader><Tree id="nodes" items="{path: \'/items\',\n\t\t\t\t    parameters : {\n                        arrayNames: [\'children\'],\n\t\t                countMode: \'Inline\',\n                        numberOfExpandedLevels: 3\n\t\t            },\n                    events: {change: \'.onTreeChange\'}}" mode="MultiSelect"><StandardTreeItem id="_IDGenStandardTreeItem1" title="{Description}" type="Active" press="onSelectionChange" class="text" /></Tree></Page></masterPages><detailPages><Page id="detail" backgroundDesign="Solid" class="Heading1"><customHeader><Toolbar id="_IDGenToolbar2" height="2.56em" class="classHead"><Title id="detailTitle" text="{Description}" class="ClassHead" /><ToolbarSpacer id="_IDGenToolbarSpacer2" /><Button icon="sap-icon://sys-help" id="idNav" press="onNavPress" type="Emphasized" tooltip="Help Document"/></Toolbar></customHeader><FormattedText htmlText="" id="content" /><Image id="image" class="image" /><Text id="textContent" text="" /><l:VerticalLayout id="videoPanel" class="sapUiContentPadding" width="100%" /><HBox id="_IDGenHBox1"><Button text="" press="onShown" id="btnShow" icon="sap-icon://show" tooltip="Show html content and length " /><ToolbarSpacer id="_IDGenToolbarSpacer3" /><Text text="" id="textLength" /></HBox><TextArea width="100%" height="200px" value="" id="htmlText" /><Button press="onSaved" id="btnSave" icon="sap-icon://save" tooltip="Save" /><core:HTML id="idHTML" content="" visible="false" /></Page></detailPages></SplitApp></mvc:View>\n'
}});
