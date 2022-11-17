//@ui5-bundle cpapp/cpplaningconfig/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpplaningconfig/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpplaningconfig/model/models","sap/f/FlexibleColumnLayoutSemanticHelper","sap/f/library"],function(e,i,t,n,p){"use strict";return e.extend("cpapp.cpplaningconfig.Component",{metadata:{manifest:"json"},init:function(){var i;e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cpapp/cpplaningconfig/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("cpapp.cpplaningconfig.controller.controller.App",{onInit(){}})});
},
	"cpapp/cpplaningconfig/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpplaningconfig.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpplaningconfig/controller/Home.controller.js":function(){sap.ui.define(["cpapp/cpplaningconfig/controller/BaseController","sap/m/GroupHeaderListItem","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,t,o,a,r,n,s){"use strict";var l=this,i;return e.extend("cpapp.cpplaningconfig.controller.Home",{onInit:function(){var e;l=this;this.bus=sap.ui.getCore().getEventBus();i=l.getOwnerComponent().getModel("oGModel");l.i18n=l.getResourceBundle();l.oParameterModel=new a;l.oMethodModel=new a;var t=this.getView().byId("idDetailView"),o=t.getShowFooter();t.setShowFooter(o);if(!l.oMethodDialog){l.oMethodDialog=sap.ui.xmlfragment("cpapp.cpplaningconfig.view.MethodTyp",l);l.getView().addDependent(l.oMethodDialog)}},onAfterRendering:function(){var e=l.getOwnerComponent().getModel("PCModel");i=l.getOwnerComponent().getModel("oGModel");var t=i.getProperty("/location");l.getPlannedParameters(t);l.getMethods(e)},grouper:function(e){return{key:e.oModel.oData.Steps[e.sPath.split("/")[2]].GROUP_DESCRIPTION}},getGroupHeader:function(e){var o=e.key.slice(1);return new t({title:o,upperCase:false})},onPressSave:function(){var e=l.getOwnerComponent().getModel("PCModel");var t={PARAMVALS:[]},a;var r="";var n=i.getProperty("/location");var s=l.getView().byId("idParameterTable").getItems();for(var d=0;d<s.length;d++){var g=s[d];if(g._bGroupHeader===false){if(g.getCells()[2].getValue()!==""&&g.getCells()[2].getValueState()==="None"){if(g.getCells()[2].getName()!==""&&g.getCells()[2].getName()!==undefined){r=g.getCells()[2].getName()}else{r=g.getCells()[2].getValue()}a={LOCATION_ID:n,PARAMETER_ID:g.getCells()[0].getText(),VALUE:r};t.PARAMVALS.push(a)}else{o.show(l.i18n.getText("getMandtMsg"),{width:"15%"});return}}}e.callFunction("/postParameterValues",{method:"GET",urlParameters:{FLAG:"C",PARAMVALS:JSON.stringify(t.PARAMVALS)},success:function(e,t){sap.m.MessageToast.show(l.i18n.getText("postSuccess"))},error:function(e){sap.m.MessageToast.show("Error")}})},getPlannedParameters:function(e){var t=[];l.getModel("PCModel").read("/V_Parameters",{filters:[new r("LOCATION_ID",n.EQ,e)],success:function(e){t=e.results;if(t.length>0){t=t.sort((e,t)=>e.SEQUENCE-t.SEQUENCE);l.oParameterModel.setData({parameters:t});l.byId("idParameterTable").setModel(l.oParameterModel)}else{l.getParameters()}},error:function(e){o.show("Failed to fetch Parameters!")}})},getParameters:function(){var e=[];l.getModel("PCModel").read("/V_Parameters",{success:function(t){e=t.results;e=e.sort((e,t)=>e.SEQUENCE-t.SEQUENCE);const o=e.map(e=>e.PARAMETER_ID);const a=e.filter(({PARAMETER_ID:e},t)=>!o.includes(e,t+1));const r=a.map(e=>({...e,VALUE:""}));l.oParameterModel.setData({parameters:r});l.byId("idParameterTable").setModel(l.oParameterModel)},error:function(e){o.show("Failed to fetch Parameters!")}})},getMethods:function(e){e.read("/Method_Types",{success:function(e){l.oMethodModel.setData({methods:e.results})},error:function(e){o.show("Failed to fetch Method Types!")}})},handleValueHelpRequest:function(e){var t=l.getView().byId("idParameterTable").getModel();var o=e.getSource().getBindingContext();var a=t.getProperty("VALUE_HELP_TAB",o);switch(a){case"Method_Types":l.oSelectedInputExe=e.getSource();if(l.oMethodDialog){l.oMethodDialog.setModel(l.oMethodModel);l.oMethodDialog.open()}}},onListItemPress:function(e){var t=e.getParameter("listItem").getTitle();l.sSelMethodTyp=e.getParameter("listItem").getInfo();if(l.oSelectedInputExe){l.oSelectedInputExe.setValue(t);l.oSelectedInputExe.setName(l.sSelMethodTyp)}l.oMethodDialog.close()},onCloseDialog:function(){if(l.oMethodDialog){l.oMethodDialog.close()}},onParamValueChange:function(e){var t;l.oSelectedInput=e.getSource();var o=l.getView().byId("idParameterTable").getModel();var a=e.getSource().getBindingContext();var r=o.getProperty("MIN_VALUE",a);var n=o.getProperty("MAX_VALUE",a);var s=e.getParameter("newValue");if(a.getObject().PARAMETER_ID===9){var i=o.getData().parameters[0];r=i.VALUE}if(parseInt(n)>0){if(parseInt(s)<parseInt(r)||parseInt(s)>parseInt(n)){l.oSelectedInput.setValueState("Error");t="Please enter value between "+r+" and "+n;l.oSelectedInput.setValueStateText(t)}else{l.oSelectedInput.setValueState("None");t="";l.oSelectedInput.setValueStateText(t)}}},_onPatternMatched:function(e){var t=l.getOwnerComponent().getModel("PCModel");var o=e.getParameter("arguments");l.location=o.location;l.i18n=l.getOwnerComponent().getModel("i18n").getResourceBundle();l.getMethods(t)}})});
},
	"cpapp/cpplaningconfig/controller/Main.controller.js":function(){sap.ui.define(["cpapp/cpplaningconfig/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,i,t,a,n,o,s){"use strict";var l=this;return e.extend("cpapp.cpplaningconfig.controller.Main",{onInit(){var e;l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cpapp.cpplaningconfig","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cpapp.cpplaningconfig","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Main").attachPatternMatched(this._onPatternMatched.bind(this));if(s.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var t=new i({expanded:true,midExists:false,busy:true,delay:0});this.setModel(t,"appView");if(s.support.touch){s.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!s.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,i,t){this.oFlexibleColumnLayout.addBeginColumnPage(t)},addDetailPage:function(e,i,t){var a=this.oFlexibleColumnLayout.getMidColumnPages(),n=false;for(var o=0;o<a.length;o++){if(a[o].getProperty("viewName")===t.getViewName()){n=true;break}else{n=false}}if(!n){this.oFlexibleColumnLayout.addMidColumnPage(t)}},toBeginPage:function(e,i,t){var a=this.oFlexibleColumnLayout.getBeginColumnPages();for(var n=0;n<a.length;n++){if(a[n].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[n]);break}}},toDetailPage:function(e,i,t){var a=this.oFlexibleColumnLayout.getMidColumnPages();for(var n=0;n<a.length;n++){if(a[n].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[n]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(a.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cpapp.cpplaningconfig.view.Home",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(a[0]);a[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cpapp.cpplaningconfig.view.Master",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!s.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}},onExit:function(){this.bus.unsubscribe("cpapp.cpplaningconfig","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cpapp.cpplaningconfig","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)}})});
},
	"cpapp/cpplaningconfig/controller/Master.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpplaningconfig/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/f/library","sap/ui/Device"],function(e,t,i,o,a,n,s){"use strict";var r,l;return t.extend("cpapp.cpplaningconfig.controller.Master",{onInit(){r=this;r.locModel=new i;r.locModel.setSizeLimit(1e3);this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},onAfterRendering:function(){r=this;l=this.getModel("oGModel");r.oLocationList=r.getView().byId("idLocationsList");r.getLocation()},getLocation:function(){r.getModel("PCModel").read("/getLocation",{success:function(e){r.locModel.setData({locations:e.results});r.oLocationList.setModel(r.locModel)},error:function(e,t){MessageToast.show("error");sap.ui.core.BusyIndicator.hide()}})},onSearchLocation:function(e){var t=[];r.oLocationList=r.getView().byId("idLocationsList");var i=e.getParameter("value")||e.getParameter("newValue");if(i){t=new o([new o("LOCATION_ID",a.Contains,i),new o("LOCATION_DESC",a.Contains,i)],false);r.oLocationList.getBinding("items").filter(t)}else{r.oLocationList.getBinding("items").filter(t)}},onListItemPress:function(e){l=r.getModel("oGModel");if(e){var t=e.getParameter("listItem").getProperty("title");l.setProperty("/location",t)}r.getOwnerComponent().runAsOwner(function(){if(!r.oDetailView){try{r.oDetailView=sap.ui.view({viewName:"cpapp.cpplaningconfig.view.Home",type:"XML"});r.bus.publish("flexible","addDetailPage",r.oDetailView);r.bus.publish("nav","toDetailPage",{viewName:r.oDetailView.getViewName()})}catch(e){r.oDetailView.onAfterRendering()}}else{r.bus.publish("nav","toDetailPage",{viewName:r.oDetailView.getViewName()})}})}})});
},
	"cpapp/cpplaningconfig/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpplaningconfig\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Planning Configuration\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Planning Configuration\n\nflpTitle=Planning Configuration\n\nflpSubtitle=Planning Configuration\nclose=Close\ngetMandtMsg=Please enter valid values for all mandatory parameters!\npostSuccess=Parameter Values Saved Succesfully',
	"cpapp/cpplaningconfig/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpplaningconfig","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.3","toolsId":"3d450b1d-dc23-4292-93de-f0b8944f70c3"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpplaningconfig-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpplanningconfig","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://dimension"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpplaningconfig.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{},"sap.uxap":{}}},"config":{"fullWidth":true},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpplaningconfig.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"PCModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpplaningconfig.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"pattern":"","name":"Main","target":["Main"]}],"targets":{"Main":{"viewType":"XML","viewName":"Main","viewLevel":1},"Master":{"viewType":"XML","viewName":"Master","viewLevel":2},"Home":{"viewType":"XML","viewName":"Home","viewLevel":3}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpplaningconfig/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpplaningconfig/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpplaningconfig/view/App.view.xml":'<mvc:View controllerName="cpapp.cpplaningconfig.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages/></App></mvc:View>\n',
	"cpapp/cpplaningconfig/view/Home.view.xml":'<mvc:View height="100%" class="sapUiSizeCompact" controllerName="cpapp.cpplaningconfig.controller.Home" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:ux="sap.uxap"><Page id="idDetailView" showHeader="false" showFooter="true"><content><ux:ObjectPageLayout id="ObjectPageLayout" useIconTabBar="true" showHeaderContent="false" showFooter="false"><ux:sections><ux:ObjectPageSection showTitle="false"><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table\n                                        id="idParameterTable"\n                                        backgroundDesign="Solid"\n                                        showSeparators="None"\n                                        alternateRowColors="false"\n                                        width="auto"\n                                        class="sapUiNoMarginTop"\n                                        items="{\n\t\t\t                path: \'/parameters\',\n                            sorter: \n                                { path: \'GROUP_DESCRIPTION\',\n                                descending: false,\n                                group: true },                              \n                            groupHeaderFactory: \'.getGroupHeader\'\n                            }"\n                                    ><columns><Column visible="false" /><Column minScreenWidth="Tablet" demandPopin="true" width="30em"  /><Column minScreenWidth="Tablet" demandPopin="true" width="30em" /><Column minScreenWidth="Tablet" demandPopin="true" width="10em"  /></columns><items><ColumnListItem><cells><Text text="{PARAMETER_ID}" /><Label text="{DESCRIPTION}" required="true" /><Input value="{VALUE}" showValueHelp="{VALUE_HELP}" valueHelpOnly="true" type="{= ${UNIT} === \'Days\' ? \'Number\' : \'Text\'}" liveChange="onParamValueChange" valueHelpRequest="handleValueHelpRequest" /><Text text="{UNIT}" /></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></content><footer><OverflowToolbar width="100%"><ToolbarSpacer /><Button icon="sap-icon://save" type="Emphasized" text="Save" class="btnSize" press="onPressSave" /></OverflowToolbar></footer></Page></mvc:View>\n',
	"cpapp/cpplaningconfig/view/Main.view.xml":'<mvc:View height="100%" class="sapUiSizeCompact" controllerName="cpapp.cpplaningconfig.controller.Main" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:f="sap.f"><Page id="pageId"><customHeader><Bar><contentLeft><Button id="leftMenu" icon="sap-icon://menu2" tooltip="Side Menu Expand/Collapse" press="expandBegin" type="Transparent" visible="false"/></contentLeft><contentMiddle><Title text="{i18n>appTitle}" class="title"></Title></contentMiddle></Bar></customHeader><content><f:FlexibleColumnLayout id="fcl"></f:FlexibleColumnLayout></content></Page></mvc:View>\n',
	"cpapp/cpplaningconfig/view/Master.view.xml":'<mvc:View height="100%" class="sapUiSizeCompact" controllerName="cpapp.cpplaningconfig.controller.Master" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:ux="sap.uxap" xmlns:f="sap.f"><Page showHeader="false" showFooter="true"><content><ux:ObjectPageLayout id="idObjectPageLayout" useIconTabBar="true" showHeaderContent="false" showFooter="false"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle class="titleAlign"><ux:expandedHeading><Title text="Locations" /></ux:expandedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:sections><ux:ObjectPageSection showTitle="false"><ux:subSections><ux:ObjectPageSubSection><ux:blocks><VBox><SearchField id="idSearch" liveChange="onSearchLocation" placeholder="Location" /><List\n                                        id="idLocationsList"\n                                        mode="SingleSelectMaster"\n                                        itemPress="onListItemPress"\n                                        items="{\n\t\t\t                            path: \'/locations\',\n\t\t\t                            sorter: {\n\t\t\t\t                        path: \'LOCATION_ID\'\n\t\t\t                            }\n\t\t                                }"\n                                    ><items><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Navigation" /></items></List></VBox></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></content><footer><OverflowToolbar width="100%"><ToolbarSpacer /></OverflowToolbar></footer></Page></mvc:View>\n',
	"cpapp/cpplaningconfig/view/MethodTyp.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><Dialog title="Select Method"><List  mode="SingleSelectMaster" itemPress="onListItemPress" items="{\n\t\t\tpath: \'/methods\'}"><items><StandardListItem type="Active" title="{DESCRIPTION}" info="{METHOD_TYP}" /></items></List><beginButton><Button text="{i18n>close}" press="onCloseDialog"/></beginButton></Dialog></core:FragmentDefinition>'
}});
