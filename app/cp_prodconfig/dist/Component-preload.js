//@ui5-bundle cp/appf/cpprodconfig/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/appf/cpprodconfig/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/appf/cpprodconfig/model/models"],function(e,i,t){"use strict";return e.extend("cp.appf.cpprodconfig.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cp/appf/cpprodconfig/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.appf.cpprodconfig.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cp/appf/cpprodconfig/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.appf.cpprodconfig.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cp/appf/cpprodconfig/controller/Details.controller.js":function(){sap.ui.define(["cp/appf/cpprodconfig/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,i,t,o,a,s,n){"use strict";var l,u;return e.extend("cp.appf.cpprodconfig.controller.Details",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cp.appf.cpprodconfig","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cp.appf.cpprodconfig","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Details").attachPatternMatched(this._onPatternMatched.bind(this));if(n.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var e=new i({expanded:true,midExists:false,busy:true,delay:0});this.setModel(e,"appView");if(n.support.touch){n.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onExit:function(){this.bus.unsubscribe("cp.appf.cpprodconfig","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cp.appf.cpprodconfig","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!n.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,i,t){this.oFlexibleColumnLayout.addBeginColumnPage(t)},addDetailPage:function(e,i,t){var o=this.oFlexibleColumnLayout.getMidColumnPages(),a=false;for(var s=0;s<o.length;s++){if(o[s].getProperty("viewName")===t.getViewName()){a=true;break}else{a=false}}if(!a){this.oFlexibleColumnLayout.addMidColumnPage(t)}},toBeginPage:function(e,i,t){var o=this.oFlexibleColumnLayout.getBeginColumnPages();for(var a=0;a<o.length;a++){if(o[a].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[a]);break}}},toDetailPage:function(e,i,t){var o=this.oFlexibleColumnLayout.getMidColumnPages();for(var a=0;a<o.length;a++){if(o[a].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[a]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(o.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cp.appf.cpprodconfig.view.ItemDetail",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(o[0]);o[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cp.appf.cpprodconfig.view.ItemMaster",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!n.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}}})});
},
	"cp/appf/cpprodconfig/controller/ItemDetail.controller.js":function(){sap.ui.define(["cp/appf/cpprodconfig/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,s,a,n,r,i){"use strict";var l,d;return e.extend("cp.appf.cpprodconfig.controller.ItemDetail",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();l.oCharModel=new s;d=l.getOwnerComponent().getModel("oGModel")},onAfterRendering:function(){d=l.getOwnerComponent().getModel("oGModel");var e=d.getProperty("/className");this.byId("charList").setModel(this.oCharModel);this.getModel("BModel").read("/getClassChar",{filters:[new a("CLASS_NAME",n.EQ,e)],success:function(e){l.oCharModel.setData({classresults:e.results})},error:function(){t.show("Failed to get data")}})},onDetailSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];if(t!==""){o.push(new a({filters:[new a("CHAR_NAME",n.Contains,t),new a("CHAR_VALUE",n.Contains,t)],and:false}))}this.byId("charList").getBinding("items").filter(o)}})});
},
	"cp/appf/cpprodconfig/controller/ItemMaster.controller.js":function(){sap.ui.define(["cp/appf/cpprodconfig/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,t,o,i,s,r,a){"use strict";var n,l;return e.extend("cp.appf.cpprodconfig.controller.ItemMaster",{onInit:function(){n=this;n.oModel=new o;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},onAfterRendering:function(){n=this;l=this.getModel("oGModel");this.getModel("BModel").read("/getProdClass",{success:function(e){n.oModel.setData({results:e.results});n.byId("prodList").setModel(n.oModel)},error:function(){t.show("Failed to get data")}})},onhandlePress:function(e){l=this.getModel("oGModel");if(e){var t=e.getSource().getSelectedItem().getBindingContext().getObject();l.setProperty("/prdId",t.PRODUCT_ID);l.setProperty("/className",t.CLASS_NAME);l.setProperty("/classNo",t.CLASS_NUM);l.setProperty("/prodDesc",t.PROD_DESC);l.setProperty("/prodFam",t.PROD_FAMILY);l.setProperty("/prodGroup",t.PROD_GROUP);l.setProperty("/prodModel",t.PROD_MODEL);l.setProperty("/prodMidRng",t.PROD_MDLRANGE);l.setProperty("/prodSeries",t.PROD_SERIES)}n.getOwnerComponent().runAsOwner(function(){if(!n.oDetailView){try{n.oDetailView=sap.ui.view({viewName:"cp.appf.cpprodconfig.view.ItemDetail",type:"XML"});n.bus.publish("flexible","addDetailPage",n.oDetailView);n.bus.publish("nav","toDetailPage",{viewName:n.oDetailView.getViewName()})}catch(e){n.oDetailView.onAfterRendering()}}else{n.bus.publish("nav","toDetailPage",{viewName:n.oDetailView.getViewName()})}})},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];if(t!==""){o.push(new i({filters:[new i("PRODUCT_ID",s.Contains,t),new i("CLASS_NAME",s.Contains,t)],and:false}))}n.byId("prodList").getBinding("items").filter(o)}})});
},
	"cp/appf/cpprodconfig/i18n/i18n.properties":'# This is the resource bundle for cp.appf.cpprodconfig\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Product Configuration\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Product Configuration\ndetailsTitle=Product Configuration\n\nflpTitle=Product Configuration\n\nflpSubtitle=\n\nprd=Product\nclassname=Class Name\n\nprdfamily=Product Family\nproddesc=Product Desc\nprdgroup=Product Group\nprdseries=Product Series\nprdmodelrange=Product Model Range\nprdmidrange=Product Mid Range\n\nclassname=Class Name\nclassno=Class #\ncharname=Char Name\ncharno=Char #\ncharval=Char Value\ncharvalno=Char Value #\n',
	"cp/appf/cpprodconfig/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.appf.cpprodconfig","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-appf-cpprodconfig-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cp_prodconfig","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://BusinessSuiteInAppSymbols/icon-partially-delivered"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.appf.cpprodconfig.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.2","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.appf.cpprodconfig.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.appf.cpprodconfig.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"pattern":"","name":"Details","target":["Details"]}],"targets":{"Details":{"viewType":"XML","viewName":"Details","viewLevel":1},"ItemMaster":{"viewType":"XML","viewName":"ItemMaster","viewLevel":2},"ItemDetail":{"viewType":"XML","viewName":"ItemDetail","viewLevel":3}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/appf/cpprodconfig/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/appf/cpprodconfig/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/appf/cpprodconfig/view/App.view.xml":'<mvc:View controllerName="cp.appf.cpprodconfig.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/appf/cpprodconfig/view/Details.view.xml":'<mvc:View controllerName="cp.appf.cpprodconfig.controller.Details" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.f"><Page id="pageId"><customHeader><Bar><contentLeft><Button id="leftMenu" icon="sap-icon://menu2" tooltip="Side Menu Expand/Collapse" press="expandBegin" type="Transparent" visible="false"/></contentLeft><contentMiddle><Title text="{i18n>detailsTitle}" class="boldText"></Title></contentMiddle></Bar></customHeader><content><f:FlexibleColumnLayout id="fcl"></f:FlexibleColumnLayout></content></Page></mvc:View>',
	"cp/appf/cpprodconfig/view/ItemDetail.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:l="sap.ui.layout"\n    controllerName="cp.appf.cpprodconfig.controller.ItemDetail"\n    xmlns:html="http://www.w3.org/1999/xhtml" class="ItemMaster"><Page id="idClassChar" title="Product Details" titleAlignment="Center"><l:Grid defaultSpan="XL3 L3 M6 S12" ><VBox ><Text text="Class Name :" /><Text text="{oGModel>/className}" /></VBox><VBox ><Text text="{i18n>prdfamily} :" /><Text text="{oGModel>/prodFam}" /></VBox><VBox ><Text text="{i18n>proddesc} :" /><Text text="{oGModel>/prodDesc}" /></VBox><VBox ><Text text="{i18n>prdseries} :" /><Text text="{oGModel>/prodSeries}" /></VBox><VBox><Text text="{i18n>prdgroup} :" /><Text text="{oGModel>/prodGroup}" /></VBox><VBox ><Text text="{i18n>prdmodelrange} :" /><Text text="{oGModel>/prodModel}" /></VBox><VBox><Text text="{i18n>prdmidrange} :" /><Text text="{oGModel>/prodMidRng}" /></VBox></l:Grid><content><SearchField id="DetailSearch" liveChange="onDetailSearch" placeholder="Char Name/ Char Value"/><Table id="charList" items="{path: \'/classresults\'}"><columns><Column hAlign="Left"><Text text="{i18n>charname}" /></Column><Column hAlign="Left"><Text text="{i18n>charval}" /></Column></columns><items><ColumnListItem><cells><ObjectIdentifier\n\t\t\t\t\t\ttitle="{CHAR_NAME}"\n\t\t\t\t\t\ttext="{CHAR_DESC}" /><ObjectIdentifier\n\t\t\t\t\t\ttitle="{CHAR_VALUE}"\n\t\t\t\t\t\ttext="{CHARVAL_DESC}" /></cells></ColumnListItem></items></Table></content></Page></mvc:View>',
	"cp/appf/cpprodconfig/view/ItemMaster.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" controllerName="cp.appf.cpprodconfig.controller.ItemMaster"\n    xmlns:html="http://www.w3.org/1999/xhtml" class="ItemMaster"><Page showHeader="false"><content><SearchField id="headSearch" liveChange="onSearch" placeholder="Product/ Class name"/><Table id="prodList" items="{path: \'/results\', sorter: {path: \'PRODUCT_ID\'}}" growingScrollToLoad="true" rememberSelections="false" itemPress="onhandlePress" mode="SingleSelectMaster" selectionChange="onhandlePress"><columns><Column hAlign="Center"><Text text="{i18n>prd}" /></Column><Column hAlign="Left"><Text text="{i18n>classname}"/></Column></columns><items><ColumnListItem><cells><Text text="{PRODUCT_ID}" /><Text text="{CLASS_NAME}" /></cells></ColumnListItem></items></Table></content></Page></mvc:View>'
}});
