//@ui5-bundle cpapp/cpcriticalcomp/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpcriticalcomp/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpcriticalcomp/model/models"],function(e,i,t){"use strict";return e.extend("cpapp.cpcriticalcomp.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cpapp/cpcriticalcomp/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpcriticalcomp.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpcriticalcomp/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpcriticalcomp.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpcriticalcomp/controller/Home.controller.js":function(){sap.ui.define(["cpapp/cpcriticalcomp/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,t,i,o,s,a,l){"use strict";var r,n;return e.extend("cpapp.cpcriticalcomp.controller.Home",{onInit:function(){r=this;r.oModel=new i;this.locModel=new i;this.prodModel=new i;r.locModel.setSizeLimit(1e3);r.prodModel.setSizeLimit(1e3);this.oModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpcriticalcomp.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpcriticalcomp.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}},onAfterRendering:function(){r=this;r.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");r._valueHelpDialogLoc.setTitleAlignment("Center");r._valueHelpDialogProd.setTitleAlignment("Center");this.oProdList=sap.ui.getCore().byId("prodSlctList");this.oLocList=sap.ui.getCore().byId("LocSlctList");this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");n=this.getModel("oGModel");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();r.locModel.setData(e);r.oLocList.setModel(r.locModel)},error:function(e,i){sap.ui.core.BusyIndicator.hide();t.show("error")}})},handleValueHelp:function(e){var i=e.getParameter("id");if(i.includes("loc")){r._valueHelpDialogLoc.open()}else if(i.includes("prod")){if(r.byId("idloc").getValue()!==""){r._valueHelpDialogProd.open()}else{t.show("Select Location")}}},handleClose:function(e){var t=e.getSource().getParent().mAssociations.initialFocus.split("-")[0];if(t.includes("Loc")){sap.ui.getCore().byId("LocSearch").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}sap.ui.getCore().byId("LocSlctList").removeSelections();r._valueHelpDialogLoc.close()}else if(t.includes("Prod")){sap.ui.getCore().byId("ProdSearch").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}sap.ui.getCore().byId("prodSlctList").removeSelections();r._valueHelpDialogProd.close()}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),a=[];t=t?t.trim():"";if(i.includes("Loc")){if(t!==""){a.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("LOCATION_DESC",s.Contains,t)],and:false}))}r.oLocList.getBinding("items").filter(a)}else if(i.includes("Prod")){if(t!==""){a.push(new o({filters:[new o("PRODUCT_ID",s.Contains,t),new o("PROD_DESC",s.Contains,t)],and:false}))}r.oProdList.getBinding("items").filter(a)}},handleSelection:function(e){var i=e.getParameter("id"),a;this.oLoc=r.byId("idloc");this.oProd=r.byId("prodInput");if(i.includes("Loc")){a=e.getParameter("selectedItems");r.oLoc.setValue(e.getParameters().listItem.getCells()[0].getTitle());r.oProd.setValue();sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",s.EQ,e.getParameters().listItem.getCells()[0].getTitle())],success:function(e){sap.ui.core.BusyIndicator.hide();r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,i){sap.ui.core.BusyIndicator.hide();t.show("error")}})}else if(i.includes("prod")){a=e.getParameter("selectedItems");r.oProd.setValue(e.getParameters().listItem.getCells()[0].getTitle())}r.handleClose(e)},onGetData:function(e){var a=r.oLoc.getValue(),l=r.oProd.getValue();var n=[];n.push(new o({filters:[new o("LOCATION_ID",s.EQ,a),new o("PRODUCT_ID",s.EQ,l)],and:true}));if(a!==""&&l!==""){this.byId("idCompSearch").setValue("");if(r.byId("idCriticalComp").getItems().length){r.byId("idCriticalComp").getBinding("items").filter(n)}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getCriticalComp",{filters:[n],success:function(e){sap.ui.core.BusyIndicator.hide();r.oModel=new i;if(e.results.length){r.oModel.setData({results:e.results});r.byId("idCriticalComp").setModel(r.oModel)}else{r.oModel.setData({results:[]});r.byId("idCriticalComp").setModel(r.oModel);t.show("No data for the selected Location Product")}},error:function(){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})}else{t.show("Please select Location and Product")}},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=[];if(t!==""){i.push(new o({filters:[new o("ITEM_NUM",s.Contains,t),new o("COMPONENT",s.Contains,t)],and:false}))}r.byId("idCriticalComp").getBinding("items").filter(i)},onChange:function(e){sap.ui.core.BusyIndicator.show();var i=e.getSource().getBindingContext().getObject();var o;var s={criticalComp:[]},a;if(i.CRITICALKEY==="X"){o=""}else{o="X"}a={LOCATION_ID:i.LOCATION_ID,PRODUCT_ID:i.PRODUCT_ID,ITEM_NUM:i.ITEM_NUM,COMPONENT:i.COMPONENT,CRITICALKEY:o};s.criticalComp.push(a);r.getModel("BModel").callFunction("/changeToCritical",{method:"GET",urlParameters:{criticalComp:JSON.stringify(s.criticalComp)},success:function(e){sap.ui.core.BusyIndicator.hide();t.show(e.changeToCritical);r.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();t.show("Failed to changes the status")}})},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var i=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(i,true)}}})});
},
	"cpapp/cpcriticalcomp/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpcriticalcomp\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Critical Assembly\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Critical Assembly\n\nflpTitle=Critical Assembly\n\nflpSubtitle=\n\n\ncompsearch = Critical Assembly Search\n\nloc=Location\nLoc=Location\nprod=Product\nPrdId=Product\ngo=Go\nreset=Reset\n\n\nitemno=Item Number\ncomponemt=Assembly\ncriticalkey=Critical \n',
	"cpapp/cpcriticalcomp/manifest.json":'{"_version":"1.37.0","sap.app":{"id":"cpapp.cpcriticalcomp","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.4","toolsId":"ab57a7d3-cc68-4150-8b85-77b74879b4b4"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpcriticalcomp-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpcriticalcomp","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpcriticalcomp.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.96.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpcriticalcomp.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpcriticalcomp.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpcriticalcomp/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpcriticalcomp/utils/locate-reuse-libs.js":'(function(e){var t=function(e,t){var n=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];Object.keys(e).forEach(function(e){if(!n.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t};var n=function(e){var n="";if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=t(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=t(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=t(e["sap.ui5"].componentUsages,n)}}return n};var r=function(e){var t=e;return new Promise(function(r,a){$.ajax(t).done(function(e){r(n(e))}).fail(function(){a(new Error("Could not fetch manifest at \'"+e))})})};var a=function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}};e.registerComponentDependencyPaths=function(e){return r(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(a)}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");var bundleResources=function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")};sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(bundleResources);if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(bundleResources)}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpcriticalcomp/view/App.view.xml":'<mvc:View controllerName="cpapp.cpcriticalcomp.controller.App"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpcriticalcomp/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpcriticalcomp.controller.Home" \n    xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:ux="sap.uxap"\n    xmlns:mvc="sap.ui.core.mvc" \n    displayBlock="true"\n    xmlns="sap.m"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>title}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>title}" wrapping="true" /><Button class="hdrBtnMarginHdr" icon="sap-icon://sys-help" id="idNav1" press="onNavPress" type="Emphasized" tooltip="Help Document" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12" ><VBox><Label text ="{i18n>compsearch}" /><SearchField id="idCompSearch" liveChange="onSearch" placeholder="Item no/ Assembly"/></VBox><VBox ><Label text="{i18n>loc}" required="true"/><Input id="idloc" value=""  placeholder="{i18n>loc}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox><Label text="{i18n>prod}" required="true"/><MultiInput id="prodInput"  placeholder="{i18n>prod}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></VBox><VBox><Label text ="" /><HBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd"/><Button text="Reset" type="Transparent" press="onResetDate" tooltip="Reset data"/><Button class="hdrBtnMargin" icon="sap-icon://sys-help" id="idNav" press="onNavPress" type="Emphasized" tooltip="Help Document" /></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><VBox><Table id="idCriticalComp" items="{path: \'/results\', sorter: {path: \'ITEM_NUM\'}}" growingScrollToLoad="true"  sticky="ColumnHeaders"><columns><Column hAlign="Left" vAlign="Middle" ><Text text="{i18n>itemno}" /></Column><Column hAlign="Left" vAlign="Middle" ><Text text="{i18n>componemt}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>criticalkey}"/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{= parseInt(${ITEM_NUM}) }"/><Text text="{COMPONENT}"/><Switch type="AcceptReject" state="{= ${CRITICALKEY} === \'X\' ? true : false}" customTextOn="Critical" customTextOff="Non-Critical" change="onChange" ><layoutData><FlexItemData growFactor="1" /></layoutData></Switch></cells></ColumnListItem></items></Table></VBox></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>',
	"cpapp/cpcriticalcomp/view/LocDialog.fragment.xml":'\n\n\n\n\n<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><Dialog type="Standard" title="{i18n>loc}" contentWidth="400px" id="idloc"><content><Table id="LocSlctList" mode="SingleSelectMaster" growing="true" growingDirection="Downwards" growingScrollToLoad="true"\n                     items="{path: \'/results\'}" selectionChange="handleSelection" sticky="ColumnHeaders" ><headerToolbar><Toolbar><ToolbarSpacer/><SearchField id="LocSearch"  liveChange="handleSearch"  placeholder="{i18n>loc}"/></Toolbar></headerToolbar><columns><Column hAlign="Begin" vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline" ><Text text="{i18n>loc}"/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{LOCATION_ID}" text="{LOCATION_DESC}"/></cells></ColumnListItem></items></Table></content><endButton><Button type=\'Reject\' text="{i18n>close}" press="handleClose"></Button></endButton></Dialog></core:FragmentDefinition>',
	"cpapp/cpcriticalcomp/view/ProdDialog.fragment.xml":'\n\n<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><Dialog type="Standard" title="{i18n>PrdId}" contentWidth="400px" id="idprod"><content><Table id="prodSlctList" mode="SingleSelectMaster" growing="true" growingDirection="Downwards" growingScrollToLoad="true"\n                     items="{path: \'/results\'}" selectionChange="handleSelection" sticky="ColumnHeaders" ><headerToolbar><Toolbar><ToolbarSpacer/><SearchField id="ProdSearch"  liveChange="handleSearch"  placeholder="{i18n>PrdId}"/></Toolbar></headerToolbar><columns><Column hAlign="Begin" vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline" ><Text text="{i18n>PrdId}"/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{PRODUCT_ID}" text="{PROD_DESC}"/></cells></ColumnListItem></items></Table></content><endButton><Button type=\'Reject\' text="{i18n>close}" press="handleClose"></Button></endButton></Dialog></core:FragmentDefinition>'
}});
