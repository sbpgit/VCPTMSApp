//@ui5-bundle cp/appf/cpbomod/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/appf/cpbomod/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/appf/cpbomod/model/models"],function(e,t,i){"use strict";return e.extend("cp.appf.cpbomod.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cp/appf/cpbomod/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.appf.cpbomod.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cp/appf/cpbomod/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.appf.cpbomod.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cp/appf/cpbomod/controller/Details.controller.js":function(){sap.ui.define(["cp/appf/cpbomod/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,t,i,o,a,s,n){"use strict";var l,u;return e.extend("cp.appf.cpbomod.controller.Details",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cp.appf.cpbomod","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cp.appf.cpbomod","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Details").attachPatternMatched(this._onPatternMatched.bind(this));if(n.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var e=new t({expanded:true,midExists:false,busy:true,delay:0});this.setModel(e,"appView");if(n.support.touch){n.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onExit:function(){this.bus.unsubscribe("cp.appf.cpbomod","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cp.appf.cpbomod","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!n.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,t,i){this.oFlexibleColumnLayout.addBeginColumnPage(i)},addDetailPage:function(e,t,i){var o=this.oFlexibleColumnLayout.getMidColumnPages(),a=false;for(var s=0;s<o.length;s++){if(o[s].getProperty("viewName")===i.getViewName()){a=true;break}else{a=false}}if(!a){this.oFlexibleColumnLayout.addMidColumnPage(i)}},toBeginPage:function(e,t,i){var o=this.oFlexibleColumnLayout.getBeginColumnPages();for(var a=0;a<o.length;a++){if(o[a].getProperty("viewName")===i.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[a]);break}}},toDetailPage:function(e,t,i){var o=this.oFlexibleColumnLayout.getMidColumnPages();for(var a=0;a<o.length;a++){if(o[a].getProperty("viewName")===i.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[a]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(o.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cp.appf.cpbomod.view.ItemDetail",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(o[0]);o[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cp.appf.cpbomod.view.ItemMaster",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!n.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}}})});
},
	"cp/appf/cpbomod/controller/ItemDetail.controller.js":function(){sap.ui.define(["cp/appf/cpbomod/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,a,d,s,r,n){"use strict";var l,i;return e.extend("cp.appf.cpbomod.controller.ItemDetail",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();l.oBomModel=new a;l.oBomOnPanelModel=new a;l.oCharModel=new a;this.oBomModel.setSizeLimit(1e3);this.oCharModel.setSizeLimit(1e3);i=l.getOwnerComponent().getModel("oGModel")},onAfterRendering:function(){i=l.getOwnerComponent().getModel("oGModel");sap.ui.core.BusyIndicator.show();var e=i.getProperty("/prdId");var o=i.getProperty("/locId");this.getModel("BModel").read("/getBomOdCond",{filters:[new d("LOCATION_ID",s.EQ,o),new d("PRODUCT_ID",s.EQ,e)],success:function(e){if(e.results.length===0){l.byId("idBomPanel").setExpanded(true);l.byId("idCharPanel").setExpanded(false);l.oBomModel.setData({results:[]});l.byId("idBom").setModel(l.oBomModel);l.oCharModel.setData({charResults:[]});l.byId("idChartab").setModel(l.oCharModel);l.oBomOnPanelModel.setData({BOMPanelresults:[]});l.byId("idBomOnNextPanel").setModel(l.oBomOnPanelModel)}else{l.oBomModel.setData({results:e.results});l.byId("idBom").setModel(l.oBomModel);l.byId("idBom").removeSelections(true);l.byId("idBomPanel").setExpanded(true);l.byId("idCharPanel").setExpanded(false)}l.byId("bomSearch").setValue("");sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to get data")}})},onItemPress:function(){sap.ui.core.BusyIndicator.show();var e=this.byId("idBom").getSelectedItem().getCells()[2].getText();i.setProperty("/objdep",e);this.getModel("BModel").read("/getODcharval",{filters:[new d("OBJ_DEP",s.EQ,e)],success:function(e){l.oCharModel.setData({charResults:e.results});l.byId("idChartab").setModel(l.oCharModel);l.byId("idBomPanel").setExpanded(false);l.byId("idCharPanel").setExpanded(true);l.byId("charSearch").setValue("");l.oncharSearch();l.BomOnPanelNext();sap.ui.core.BusyIndicator.hide()},error:function(){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})},BomOnPanelNext:function(){var e=this.byId("idBom").getSelectedItem().getCells();var t=[{ITEM_NUM:e[0].getText(),COMPONENT:e[1].getText(),OBJ_DEP:e[2].getText(),OBJDEP_DESC:e[3].getText(),COMP_QTY:e[4].getText(),VALID_FROM:e[5].getText(),VALID_TO:e[6].getText()}];l.oBomOnPanelModel.setData({BOMPanelresults:t});l.byId("idBomOnNextPanel").setModel(l.oBomOnPanelModel);sap.ui.core.BusyIndicator.hide()},onbomSearch:function(e){var o="",a=[];if(e){var o=l.byId("bomSearch").getValue()}o=o.toUpperCase();sap.ui.core.BusyIndicator.show();var r=i.getProperty("/prdId");var n=i.getProperty("/locId");a.push(new d({filters:[new d("LOCATION_ID",s.EQ,n),new d("PRODUCT_ID",s.EQ,r)],and:true}));if(o!==""){a.push(new d({filters:[new d("COMPONENT",s.StartsWith,o),new d("OBJ_DEP",s.StartsWith,o)],and:false}))}this.getModel("BModel").read("/getBomOdCond",{filters:[a],success:function(e){l.oBomModel.setData({results:e.results});l.byId("idBom").setModel(l.oBomModel);l.byId("idBom").removeSelections(true);l.byId("idBomPanel").setExpanded(true);l.byId("idCharPanel").setExpanded(false);sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to get data")}})},oncharSearch:function(e){var t="",o=[];if(e){t=e.getParameter("value")||e.getParameter("newValue")}if(t!==""){o.push(new d({filters:[new d("CLASS_NAME",s.Contains,t),new d("CHAR_NAME",s.Contains,t),new d("CHAR_VALUE",s.Contains,t)],and:false}))}l.byId("idChartab").getBinding("items").filter(o)}})});
},
	"cp/appf/cpbomod/controller/ItemMaster.controller.js":function(){sap.ui.define(["cp/appf/cpbomod/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,t,i,s,o,a,r){"use strict";var n,l;return e.extend("cp.appf.cpbomod.controller.ItemMaster",{onInit:function(){n=this;n.oModel=new i;this.oModel.setSizeLimit(1e3);this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){n=this;l=this.getModel("oGModel");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocProdDet ",{success:function(e){n.oModel.setData({results:e.results});n.byId("bomList").setModel(n.oModel);l.setProperty("/prdId",e.results[0].PRODUCT_ID);l.setProperty("/locId",e.results[0].LOCATION_ID);n.byId("bomList").setSelectedItem(n.byId("bomList").getItems()[0],true);n.onhandlePress();sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to get data")}})},onhandlePress:function(e){l=this.getModel("oGModel");if(e){var t=e.getSource().getSelectedItem().getBindingContext().getObject();l.setProperty("/prdId",t.PRODUCT_ID);l.setProperty("/locId",t.LOCATION_ID)}n.getOwnerComponent().runAsOwner(function(){if(!n.oDetailView){try{n.oDetailView=sap.ui.view({viewName:"cp.appf.cpbomod.view.ItemDetail",type:"XML"});n.bus.publish("flexible","addDetailPage",n.oDetailView);n.bus.publish("nav","toDetailPage",{viewName:n.oDetailView.getViewName()})}catch(e){n.oDetailView.onAfterRendering()}}else{n.bus.publish("nav","toDetailPage",{viewName:n.oDetailView.getViewName()})}})},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=[];if(t!==""){i.push(new s({filters:[new s("PRODUCT_ID",o.Contains,t),new s("LOCATION_ID",o.Contains,t)],and:false}))}n.byId("bomList").getBinding("items").filter(i)}})});
},
	"cp/appf/cpbomod/i18n/i18n.properties":'# This is the resource bundle for cp.appf.cpbomod\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Bill of Material\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Bill of Material\ndetailsTitle=Bill of Material\n\nflpTitle=Bill of Material\nflpSubtitle=\n\nprd=Configurable Product\nloc=Location\n\n\nitemno=Item #\ncomp=Assembly\nobjdep=Obj Dependency\nobjdepdes=Obj Dep description\ncompqty=Quantity\nvalidfm=Valid From\nvalidto=Valid To\n\n\nclsname= Class Name\ncharname=Char Name\ncharVal=Char Value\nodcond=OD Condition\nCharCoun=Char Counter\nrowid=Row ID\n',
	"cp/appf/cpbomod/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.appf.cpbomod","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-appf-cpbomod-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cp_bomod","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://dimension"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.appf.cpbomod.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.2","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.appf.cpbomod.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.appf.cpbomod.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"pattern":"","name":"Details","target":["Details"]}],"targets":{"Details":{"viewType":"XML","viewName":"Details","viewLevel":1},"ItemMaster":{"viewType":"XML","viewName":"ItemMaster","viewLevel":2},"ItemDetail":{"viewType":"XML","viewName":"ItemDetail","viewLevel":3}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cp/appf/cpbomod/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/appf/cpbomod/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/appf/cpbomod/view/App.view.xml":'<mvc:View controllerName="cp.appf.cpbomod.controller.App"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/appf/cpbomod/view/Details.view.xml":'<mvc:View controllerName="cp.appf.cpbomod.controller.Details" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.f"><Page id="pageId"><customHeader><Bar><contentMiddle></contentMiddle></Bar></customHeader><content><f:FlexibleColumnLayout id="fcl"></f:FlexibleColumnLayout></content></Page></mvc:View>',
	"cp/appf/cpbomod/view/ItemDetail.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core" controllerName="cp.appf.cpbomod.controller.ItemDetail"\n    xmlns:html="http://www.w3.org/1999/xhtml"><Page id="page" showHeader="false"><content><Panel id="idBomPanel" expandable="true" headerText="BOM Assemblies" width="auto" ><content><Toolbar height="8%"><Text text="Configurable Product : {oGModel>/prdId}" ></Text><ToolbarSpacer/><Text text="Location : {oGModel>/locId}" ></Text></Toolbar><SearchField id="bomSearch" search="onbomSearch" placeholder="Assembly / Object Dependency"/><Table id="idBom" items="{path: \'/results\', sorter : { path : \'ITEM_NUM\'} }"  itemPress="onItemPress" selectionChange="onItemPress" rememberSelections="false" mode="SingleSelectMaster"  sticky="ColumnHeaders"><columns><Column hAlign="Centre" width="80px"><Text text="{i18n>itemno}" /></Column><Column hAlign="Left"><Text text="{i18n>comp}"/></Column><Column hAlign="Left"><Text text="{i18n>objdep}" /></Column><Column hAlign="Left"><Text text="{i18n>objdepdes}"/></Column><Column hAlign="Center"><Text text="{i18n>compqty}" width="120px"/></Column><Column hAlign="Center" width="90px"><Text text="{i18n>validfm}"/></Column><Column hAlign="Center" width="90px"><Text text="{i18n>validto}"/></Column></columns><items><ColumnListItem><cells><Text text="{ITEM_NUM}" /><Text text="{COMPONENT}" /><Text text="{OBJ_DEP}" /><Text text="{OBJDEP_DESC}" /><Text text="{COMP_QTY}" /><Text text="{path: \'VALID_FROM\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}"/><Text text="{path: \'VALID_TO\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}"/></cells></ColumnListItem></items></Table></content></Panel><Panel id="idCharPanel" expandable="true" headerText="Object Dependency Characteristics" width="auto" class="boldText"><content><Table id="idBomOnNextPanel" items="{path: \'/BOMPanelresults\'}"><columns><Column hAlign="Left" width="80px"><Text text="{i18n>itemno}" /></Column><Column hAlign="Left"><Text text="{i18n>comp}"/></Column><Column hAlign="Left"><Text text="{i18n>objdep}" /></Column><Column hAlign="Left"><Text text="{i18n>objdepdes}"/></Column><Column hAlign="Center"><Text text="{i18n>compqty}" width="90px"/></Column><Column hAlign="Left" width="90px"><Text text="{i18n>validfm}"/></Column><Column hAlign="Left" width="90px"><Text text="{i18n>validto}"/></Column></columns><items><ColumnListItem><cells><Text text="{ITEM_NUM}" /><Text text="{COMPONENT}" /><Text text="{OBJ_DEP}" /><Text text="{OBJDEP_DESC}" /><Text text="{COMP_QTY}" /><Text text="{VALID_FROM}"/><Text text="{VALID_TO}"/></cells></ColumnListItem></items></Table><SearchField id="charSearch" liveChange="oncharSearch" placeholder="Class Name / Char Name/ Char Value"/><Table id="idChartab" items="{ path: \'/charResults\'}" sticky="ColumnHeaders"><columns><Column hAlign="Begin"><Text text="{i18n>clsname}"/></Column><Column hAlign="Center"><Text text="{i18n>charname}"/></Column><Column hAlign="Center"><Text text="{i18n>charVal}"/></Column><Column hAlign="Center"><Text text="{i18n>CharCoun}"/></Column><Column hAlign="Center"><Text text="{i18n>odcond}"/></Column><Column hAlign="Center"><Text text="{i18n>rowid}" /></Column></columns><items><ColumnListItem><cells><Text text="{CLASS_NAME}" /><Text text="{CHAR_NAME}" /><Text text="{CHAR_VALUE}" /><Text text="{CHAR_COUNTER}" /><Text text="{OD_CONDITION}" /><Text text="{ROW_ID}" /></cells></ColumnListItem></items></Table></content></Panel></content></Page></mvc:View>',
	"cp/appf/cpbomod/view/ItemMaster.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" controllerName="cp.appf.cpbomod.controller.ItemMaster"\n    xmlns:html="http://www.w3.org/1999/xhtml" class="ItemMaster"><Page showHeader="false"><content><SearchField id="headSearch" liveChange="onSearch" placeholder="Configurable Product or Location"/><List id="bomList" headerText="Configurable Products / Location" items="{ path : \'/results\', sorter : { path : \'PRODUCT_ID\'} }" mode="SingleSelectMaster" noDataText="No Data" selectionChange="onhandlePress"><items><ObjectListItem press="onhandlePress" title="{PRODUCT_ID}"><attributes><ObjectAttribute text="{LOCATION_ID}"/></attributes></ObjectListItem></items></List></content></Page></mvc:View>'
}});
