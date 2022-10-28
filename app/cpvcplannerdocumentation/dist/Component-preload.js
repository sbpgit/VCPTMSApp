//@ui5-bundle cpapp/cpvcplannerdocumentation/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpvcplannerdocumentation/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpvcplannerdocumentation/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpvcplannerdocumentation.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpvcplannerdocumentation/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("cpapp.cpvcplannerdocumentation.controller.App",{onInit(){}})});
},
	"cpapp/cpvcplannerdocumentation/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"],function(e,t){"use strict";var o,r,n=0,d=0;return e.extend("cpapp.cpvcplannerdocumentation.controller.Home",{onInit:function(){o=this},onAfterRendering:function(){var e=[];var t=new sap.ui.model.json.JSONModel;var r=new sap.ui.model.json.JSONModel;o.oGModel=o.getOwnerComponent().getModel("oGModel");o.byId("idHTML").setContent();this.getView().getModel("oModel").read("/getPageHdr",{success:function(t){var r=t.results;for(var n=0;n<=r.length-1;n++){e.push({NodeID:r[n].PAGEID,HierarchyLevel:r[n].HEIRARCHYLEVEL,Description:r[n].DESCRIPTION,ParentNodeID:r[n].PARENTNODEID})}var d=e;var a={};for(var n=0;n<d.length;n++){var s="id"+d[n].NodeID;a[s]=d[n];a[s].__metadata=""}for(var n in a){a[n].children=[]}for(var n in a){var i="id"+a[n].ParentNodeID;if(a[i]){a[i].children.push(a[n])}}var l=[];for(var n in a){var i="id"+a[n].ParentNodeID;if(!a[i]){l.push(a[n])}}var g=new sap.ui.model.json.JSONModel;g.setData({items:l});var I=o.byId("nodes");I.setModel(g);I.expand(0)}});this.getView().getModel("oModel").read("/getPagePgrh",{success:function(e){var e=e.results;o.oGModel.setProperty("/Content",e);o.oGModel.setProperty("/flag","X");o.byId("idHTML").setContent(e[0].CONTENT);o.oGModel.setProperty("/initialData",e[0].CONTENT);o.byId("detailTitle").setText(e[0].DESCRIPTION);o.byId("nodes").getItems()[0].addStyleClass("red");o.oGModel.setProperty("/PAGEID",e[0].PAGEID)}})},onSelectionChange:function(e){o.byId("detailSearch").setValue();o.oGModel.setProperty("/flag","");o.byId("idHTML").setContent();var t=e.getSource().getBindingContext().getProperty().NodeID;o.oGModel.setProperty("/PAGEDES",e.getSource().getBindingContext().getProperty().Description);var r=o.byId("nodes").getItems();for(var d=0;d<=r.length-1;d++){if(t===r[d].getBindingContext().getObject().NodeID){o.oGModel.setProperty("/PAGEID",t);var a=o.byId("nodes").getItems();a[d].addStyleClass("red")}else{var a=o.byId("nodes").getItems();a[d].removeStyleClass("red")}}var s=o.oGModel.getProperty("/Content");for(var i=0;i<=s.length-1;i++){if(t===s[i].PAGEID){o.byId("idHTML").setContent(s[i].CONTENT);o.oGModel.setProperty("/oContent",s[i].CONTENT);o.byId("detailTitle").setText(s[i].DESCRIPTION);var l=o.byId("nodes").getItems();for(var g=0;n<=l.length-1;g++){if(s[i].PAGEID===l[g].getBindingContext().getProperty().NodeID){var I=o.byId("nodes");I.onItemExpanderPressed(I.getItems()[g],true);break}}}}},onMasterSearch:function(e){var t=e.getParameter("newValue");var r=new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,t);var n=this.byId("nodes").getBinding("items");this.byId("nodes").getBinding("items").filter(t?new sap.ui.model.Filter({path:"Description",operator:"Contains",value1:t}):null);if(t.length>1){n.expandToLevel(3)}else{var d=o.oGModel.getProperty("/PAGEID");var a=this.byId("nodes").getItems();for(var s=0;s<a.length;s++){if(d===a[s].getBindingContext().getObject().NodeID){a[s].addStyleClass("red")}else{a[s].removeStyleClass("red")}}}},onTreeChange:function(e){if(e.getParameters().reason==="filter"){const e=this.getOwnerComponent().getModel("oGModel");const t=e.getProperty("/query");this.byId("nodes").expandToLevel(t?99:0)}},myJsFunc:function(e){o.oGModel.setProperty("/flag","Y");o.byId("idHTML").setContent();var t=8;var r=5;var n=6;var d=o.byId("nodes");var a=o.byId("nodes").getItems();for(var s=0;s<a.length;s++){if(a[s].getBindingContext().getObject().NodeID===r){o.byId("nodes").onItemExpanderPressed(a[s],true);break}}var i=o.byId("nodes").getItems();for(var l=0;l<i.length;l++){if(i[l].getBindingContext().getObject().NodeID===n){o.byId("nodes").onItemExpanderPressed(i[l],true);break}}var g=o.byId("nodes").getItems();var I=o.oGModel.getProperty("/Content");for(var v=0;v<=g.length-1;v++){if(t===g[v].getBindingContext().getObject().NodeID){g[v].addStyleClass("red")}else{g[v].removeStyleClass("red")}}for(var y=0;y<=I.length-1;y++){if(t===I[y].PAGEID){o.byId("idHTML").setContent(I[y].CONTENT);o.oGModel.setProperty("/clickContent",I[y].CONTENT);o.byId("detailTitle").setText(I[y].DESCRIPTION)}}},ondetSearch:function(e){this.byId("idHTML").setContent();if(o.oGModel.getProperty("/flag")==="X"){var t=o.oGModel.getProperty("/initialData")}else if(o.oGModel.getProperty("/flag")==="Y"){var t=o.oGModel.getProperty("/clickContent")}else{var t=o.oGModel.getProperty("/oContent")}this.byId("idHTML").setContent(t);var r=o.byId("detailSearch").getValue();var n=this.byId("idHTML").getContent();if(r!==""){var d=new RegExp(r,"g");var a=n.replace(d,`<mark>${r}</mark>`);this.byId("idHTML").setContent();this.byId("idHTML").setContent(a)}},onCollapseBtn:function(){var e=o.byId("nodes");e.collapseAll();var t=o.byId("nodes").getItems();for(var r=0;r<=t.length-1;r++){t[r].removeStyleClass("red")}var n=o.oGModel.getProperty("/PAGEID");var d=o.byId("detailTitle").getText();if(t.length===6){for(var a=0;a<t.length;a++){if(d===t[a].getTitle()&&n===t[a].getBindingContext().getObject().NodeID){t[a].addStyleClass("red")}}}},onExpandBtn:function(){var e=o.byId("nodes");e.expandToLevel(999);var t=o.byId("nodes").getItems();var r=o.oGModel.getProperty("/PAGEID");for(var n=0;n<=t.length-1;n++){if(r===t[n].getBindingContext().getObject().NodeID){var d=o.byId("nodes").getItems();d[n].addStyleClass("red")}else{var d=o.byId("nodes").getItems();d[n].removeStyleClass("red")}}},onChange:function(e){var t=e.getParameters().expanded;var r=o.byId("nodes").getItems();var n=o.oGModel.getProperty("/PAGEID");for(var d=0;d<=r.length-1;d++){if(n===r[d].getBindingContext().getObject().NodeID){r[d].addStyleClass("red")}else{r[d].removeStyleClass("red")}}}})});
},
	"cpapp/cpvcplannerdocumentation/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpvcplannerdocumentation\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=VC Planner Documentation\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=VC Planner Documentation\n\nflpTitle=VC Planner\n\nflpSubtitle=Documentation\n',
	"cpapp/cpvcplannerdocumentation/manifest.json":'{"_version":"1.42.0","sap.app":{"id":"cpapp.cpvcplannerdocumentation","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.5","toolsId":"55d26788-fefe-4c38-ad11-cb813733be9f"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpvcplannerdocumentation-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpvcplannerdocumentation","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpvcplannerdocumentation.i18n.i18n"}},"oModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"oGModel":{"type":"sap.ui.model.json.JSONModel"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpvcplannerdocumentation.view","controlAggregation":"pages","controlId":"SplitAppDemo","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":"RouteHome","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpvcplannerdocumentation.view.Home","type":"XML","async":true,"id":"SplitAppDemo"}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpvcplannerdocumentation/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpvcplannerdocumentation/utils/locate-reuse-libs.js":'(function(e){var t=function(e,t){var n=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];Object.keys(e).forEach(function(e){if(!n.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t};var n=function(e){var n="";if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=t(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=t(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=t(e["sap.ui5"].componentUsages,n)}}return n};var r=function(e){var t=e;return new Promise(function(r,a){$.ajax(t).done(function(e){r(n(e))}).fail(function(){a(new Error("Could not fetch manifest at \'"+e))})})};var a=function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}};e.registerComponentDependencyPaths=function(e){return r(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(a)}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");var bundleResources=function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")};sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(bundleResources);if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(bundleResources)}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpvcplannerdocumentation/view/App.view.xml":'<mvc:View controllerName="cpapp.cpvcplannerdocumentation.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"cpapp/cpvcplannerdocumentation/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpvcplannerdocumentation.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc" \n    displayBlock="true"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m"\n    xmlns:m="sap.m"\n    xmlns:ui="sap.ui.table"   \n    \txmlns:l="sap.ui.layout"\n        xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:custom="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\n    xmlns:demo="control"\n    height="100%"><SplitApp\n\t\tid="SplitAppDemo"\n\t\tinitialDetail="detail"\n\t\tinitialMaster="master"\n        ><masterPages ><Page\n\t\t\t\tid="master"\n\t\t\t\tbackgroundDesign= "Solid" \n                enableScrolling="true"\n                class="Heading2"\n                \n            ><customHeader ><Toolbar height="2.56em" class="classHead" ><Title id="masterTitle" text="Contents" class="ClassHead"></Title><ToolbarSpacer/><SearchField id="masterSearch"  liveChange="onMasterSearch"  width="40%"/><Button id="expandBtn" icon="sap-icon://expand" press="onExpandBtn" tooltip="Expand all" class="Heading3"/><Button id="collapseBtn" icon="sap-icon://collapse" press="onCollapseBtn" tooltip="Collapse all" class="Heading3"/></Toolbar></customHeader><content><Tree\n\t\t    id="nodes"\n            rememberSelections="true"\n            toggleOpenState="onChange"\n\t\t    items="{path: \'/items\',\n\t\t\t\t    parameters : {\n                        arrayNames: [\'children\'],\n\t\t                countMode: \'Inline\',\n                        numberOfExpandedLevels: 0\n\t\t            },\n                    events: {\n            change: \'.onTreeChange\'\n          }\n            }"\n            ><StandardTreeItem title="{Description}" type="Active" press="onSelectionChange" class="text" selected="true"/></Tree></content></Page></masterPages><detailPages><Page\n\t\t\t\tid="detail" backgroundDesign= "Solid" class="Heading1"><customHeader ><Toolbar height="2.56em" class="classHead" ><Title id="detailTitle" text="{Description}" class="ClassHead"></Title><ToolbarSpacer/><SearchField id="detailSearch"  search="ondetSearch"  width="40%"/></Toolbar></customHeader><content><core:HTML id="idHTML" content=""/></content></Page></detailPages></SplitApp></mvc:View>\n'
}});
