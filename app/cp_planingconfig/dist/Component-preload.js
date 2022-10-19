//@ui5-bundle cpapp/cpplaningconfig/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpplaningconfig/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpplaningconfig/model/models"],function(e,i,t){"use strict";return e.extend("cpapp.cpplaningconfig.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cpapp/cpplaningconfig/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("cpapp.cpplaningconfig.controller.controller.App",{onInit(){}})});
},
	"cpapp/cpplaningconfig/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/GroupHeaderListItem","sap/m/MessageToast","sap/ui/model/json/JSONModel"],function(e,t,o,a){"use strict";var r=this;return e.extend("cpapp.cpplaningconfig.controller.Home",{onInit:function(){var e;r=this;r.oParameterModel=new a;r.oMethodModel=new a;if(!r.oMethodDialog){r.oMethodDialog=sap.ui.xmlfragment("cpapp.cpplaningconfig.view.MethodTyp",r);r.getView().addDependent(r.oMethodDialog)}e=r.getRouter().getRoute("RouteHome");e.attachPatternMatched(r._onPatternMatched,r)},getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},grouper:function(e){return{key:e.oModel.oData.Steps[e.sPath.split("/")[2]].GROUP_DESCRIPTION}},getGroupHeader:function(e){var o=e.key.slice(1);return new t({title:o,upperCase:false})},onPressSave:function(){var e=r.getOwnerComponent().getModel("PCModel");var t={PARAMVALS:[]},a;var n="";var s=r.getView().byId("idParameterTable").getItems();for(var l=0;l<s.length;l++){var i=s[l];if(i._bGroupHeader===false){if(i.getCells()[2].getValue()!==""&&i.getCells()[2].getValueState()==="None"){if(i.getCells()[2].getName()!==""&&i.getCells()[2].getName()!==undefined){n=i.getCells()[2].getName()}else{n=i.getCells()[2].getValue()}a={PARAMETER_ID:i.getCells()[0].getText(),VALUE:n};t.PARAMVALS.push(a)}else{o.show(r.i18n.getText("getMandtMsg"),{width:"15%"});return}}}e.callFunction("/postParameterValues",{method:"GET",urlParameters:{FLAG:"C",PARAMVALS:JSON.stringify(t.PARAMVALS)},success:function(e,t){sap.m.MessageToast.show(r.i18n.getText("postSuccess"))},error:function(e){sap.m.MessageToast.show("Error")}})},getParameters:function(e){var t=[];e.read("/V_Parameters",{success:function(e){t=e.results;t=t.sort((e,t)=>e.SEQUENCE-t.SEQUENCE);r.oParameterModel.setData({parameters:t});r.byId("idParameterTable").setModel(r.oParameterModel)},error:function(e){o.show("Failed to fetch Parameters!")}})},getMethods:function(e){e.read("/Method_Types",{success:function(e){r.oMethodModel.setData({methods:e.results})},error:function(e){o.show("Failed to fetch Method Types!")}})},handleValueHelpRequest:function(e){var t=r.getView().byId("idParameterTable").getModel();var o=e.getSource().getBindingContext();var a=t.getProperty("VALUE_HELP_TAB",o);switch(a){case"Method_Types":r.oSelectedInputExe=e.getSource();if(r.oMethodDialog){r.oMethodDialog.setModel(r.oMethodModel);r.oMethodDialog.open()}}},onListItemPress:function(e){var t=e.getParameter("listItem").getTitle();r.sSelMethodTyp=e.getParameter("listItem").getInfo();if(r.oSelectedInputExe){r.oSelectedInputExe.setValue(t);r.oSelectedInputExe.setName(r.sSelMethodTyp)}r.oMethodDialog.close()},onCloseDialog:function(){if(r.oMethodDialog){r.oMethodDialog.close()}},onParamValueChange:function(e){var t;r.oSelectedInput=e.getSource();var o=r.getView().byId("idParameterTable").getModel();var a=e.getSource().getBindingContext();var n=o.getProperty("MIN_VALUE",a);var s=o.getProperty("MAX_VALUE",a);var l=e.getParameter("newValue");if(a.getObject().PARAMETER_ID===9){var i=o.getData().parameters[0];n=i.VALUE}if(parseInt(s)>0){if(parseInt(l)<parseInt(n)||parseInt(l)>parseInt(s)){r.oSelectedInput.setValueState("Error");t="Please enter value between "+n+" and "+s;r.oSelectedInput.setValueStateText(t)}else{r.oSelectedInput.setValueState("None");t="";r.oSelectedInput.setValueStateText(t)}}},_onPatternMatched:function(){var e=r.getOwnerComponent().getModel("PCModel");r.i18n=r.getOwnerComponent().getModel("i18n").getResourceBundle();r.getParameters(e);r.getMethods(e)}})});
},
	"cpapp/cpplaningconfig/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpplaningconfig\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Planning Configuration\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Planning Configuration\n\nflpTitle=Planning Configuration\n\nflpSubtitle=Planning Configuration\nclose=Close\ngetMandtMsg=Please enter valid values for all mandatory fields!\npostSuccess=Parameter Values Saved Succesfully',
	"cpapp/cpplaningconfig/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpplaningconfig","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.3","toolsId":"3d450b1d-dc23-4292-93de-f0b8944f70c3"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpplaningconfig-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpplanningconfig","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://dimension"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpplaningconfig.i18n.i18n"}},"PCModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpplaningconfig.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":"","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpplaningconfig.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpplaningconfig/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpplaningconfig/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpplaningconfig/view/App.view.xml":'<mvc:View controllerName="cpapp.cpplaningconfig.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages/></App></mvc:View>\n',
	"cpapp/cpplaningconfig/view/Home.view.xml":'<mvc:View height="100%" class="sapUiSizeCompact" controllerName="cpapp.cpplaningconfig.controller.Home" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:ux="sap.uxap"><Page showHeader="false" showFooter="true"><content><ux:ObjectPageLayout id="ObjectPageLayout" useIconTabBar="true" showHeaderContent="false" showFooter="false"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle class="titleAlign"><ux:expandedHeading><Title text="{i18n>appTitle}" /></ux:expandedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:sections><ux:ObjectPageSection showTitle="false"><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table\n                                        id="idParameterTable"\n                                        backgroundDesign="Solid"\n                                        showSeparators="None"\n                                        alternateRowColors="false"\n                                        width="auto"\n                                        class="sapUiNoMarginTop"\n                                        items="{\n\t\t\t                path: \'/parameters\',\n                            sorter: \n                                { path: \'GROUP_DESCRIPTION\',\n                                descending: false,\n                                group: true },                              \n                            groupHeaderFactory: \'.getGroupHeader\'\n                            }"\n                                    ><columns><Column visible="false"></Column><Column minScreenWidth="Desktop" demandPopin="true" width="30em" hAlign="End"></Column><Column minScreenWidth="Desktop" demandPopin="true" width="30em" hAlign="End"></Column><Column minScreenWidth="Desktop" demandPopin="true" width="10em" hAlign="Begin"></Column></columns><items><ColumnListItem vAlign="Middle"><cells><Text text="{PARAMETER_ID}" /><Label text="{DESCRIPTION}" required="true" /><Input value="{VALUE}" showValueHelp="{VALUE_HELP}" valueHelpOnly="true" type="{= ${UNIT} === \'Days\' ? \'Number\' : \'Text\'}" liveChange="onParamValueChange" valueHelpRequest="handleValueHelpRequest" /><Text text="{UNIT}" /></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></content><footer><OverflowToolbar width="100%"><ToolbarSpacer /><Button icon="sap-icon://save" type="Emphasized" text="Save" class="btnSize" press="onPressSave" /></OverflowToolbar></footer></Page></mvc:View>\n',
	"cpapp/cpplaningconfig/view/MethodTyp.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><Dialog title="Select Method"><List id="idMethodList" mode="SingleSelectMaster" itemPress="onListItemPress" items="{\n\t\t\tpath: \'/methods\'}"><items><StandardListItem type="Active" title="{DESCRIPTION}" info="{METHOD_TYP}" /></items></List><beginButton><Button text="{i18n>close}" press="onCloseDialog"/></beginButton></Dialog></core:FragmentDefinition>'
}});
