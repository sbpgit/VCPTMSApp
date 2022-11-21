//@ui5-bundle cpapp/cpmarketauthorization/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpmarketauthorization/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpmarketauthorization/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpmarketauthorization.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpmarketauthorization/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(t){"use strict";return t.extend("cpapp.cpmarketauthorization.controller.App",{onInit(){}})});
},
	"cpapp/cpmarketauthorization/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,i,o,s,a){"use strict";var l;return e.extend("cpapp.cpmarketauthorization.controller.Home",{onInit:function(){l=this;l.TableModel=new t;l.locModel=new t;l.prodModel=new t;l.verModel=new t;l.scenModel=new t;l.TableModel.setSizeLimit(1e3);l.locModel.setSizeLimit(1e3);l.prodModel.setSizeLimit(1e3);l.verModel.setSizeLimit(1e3);l.scenModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpmarketauthorization.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpmarketauthorization.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpmarketauthorization.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpmarketauthorization.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){l.aOrder=[];l.bOrder=[];this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");l._valueHelpDialogProd.setTitleAlignment("Center");l._valueHelpDialogLoc.setTitleAlignment("Center");l._valueHelpDialogVer.setTitleAlignment("Center");l._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getLocation",{success:function(e){l.locModel.setData(e);l.oLocList.setModel(l.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){sap.ui.core.BusyIndicator.hide();s.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(l.byId("idloc").getValue()){l._valueHelpDialogProd.open()}else{s.show("Select Location")}}else if(t.includes("ver")){if(l.byId("idloc").getValue()&&l.byId("idprod").getValue()){l._valueHelpDialogVer.open()}else{s.show("Select Location and Product")}}else if(t.includes("scen")){if(l.byId("idloc").getValue()&&l.byId("idprod").getValue()&&l.byId("idver").getValue()){l._valueHelpDialogScen.open()}else{s.show("Select Location/Product/Version")}}},handleSelection:function(e){l.oGModel=l.getOwnerComponent().getModel("oGModel");var t=e.getParameter("id"),i=e.getParameter("selectedItems"),o,a=[];if(t.includes("Loc")){l.oLoc=l.byId("idloc");l.oProd=l.byId("idprod");o=e.getParameter("selectedItems");l.oLoc.setValue(o[0].getTitle());l.oGModel.setProperty("/SelectedLoc",o[0].getTitle());l.oProd.setValue("");l.byId("fromDate").setValue("");l.oGModel.setProperty("/SelectedProd","");this.getView().getModel("oModel").callFunction("/getAllProd",{method:"GET",urlParameters:{LOCATION_ID:l.oLoc.getValue()},success:function(e){l.prodModel.setData(e);l.oProdList.setModel(l.prodModel)},error:function(e,t){s.show("error")}})}else if(t.includes("prod")){var r=[];var n=[];var d=[];l.oProd=l.byId("idprod");var c=[];o=e.getParameters("selectedItems").selectedItems;for(var u in o){c[u]=o[u].getTitle();r.push(n)}l.oGModel.setProperty("/SelectedProd",c);l.oProd.setValue(c);l.byId("fromDate").setValue("");l.oVer.setValue("");l.oScen.setValue("");this.getView().getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:l.oGModel.getProperty("/SelectedLoc")},success:function(e){if(e.results.length===0){sap.m.MessageToast.show("No versions available for choosen Location/Product. Please choose another.");l.verModel.setData([]);l.oVerList.setModel(l.verModel)}else{var t=[];for(var i=0;i<e.results.length;i++){for(var s=0;s<o.length;s++){if(e.results[i].PRODUCT_ID===o[s].getTitle()){if(l.aOrder.indexOf(e.results[i].VERSION)===-1){l.aOrder.push(e.results[i].VERSION);if(e.results[i].VERSION!==""){l.oOrdData={VERSION:e.results[i].VERSION};t.push(l.oOrdData)}}}}}if(t.length>0){l.verModel.setData({results:t});l.oVerList.setModel(l.verModel)}}},error:function(e,t){s.show("error")}})}else if(t.includes("Ver")){this.oVer=l.byId("idver");o=e.getParameter("selectedItems");l.oVer.setValue(o[0].getTitle());l.oScen.setValue("");l.oGModel.setProperty("/SelectedVer",o[0].getTitle());var g=l.oGModel.getProperty("/SelectedProd");this.getView().getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:l.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var i=0;i<e.results.length;i++){for(var s=0;s<g.length;s++){if(e.results[i].PRODUCT_ID===g[s]&&e.results[i].VERSION===o[0].getTitle()){if(l.bOrder.indexOf(e.results[i].SCENARIO)===-1){l.bOrder.push(e.results[i].SCENARIO);if(e.results[i].SCENARIO!==""){l.bOrdData={SCENARIO:e.results[i].SCENARIO};t.push(l.bOrdData)}}}}}if(t.length>0){l.scenModel.setData({results:t});l.oScenList.setModel(l.scenModel)}},error:function(e,t){s.show("error")}})}else if(t.includes("scen")){sap.ui.core.BusyIndicator.show();this.oScen=l.byId("idscen");o=e.getParameter("selectedItems");l.oScen.setValue(o[0].getTitle());l.oGModel.setProperty("/SelectedScen",o[0].getTitle());sap.ui.core.BusyIndicator.hide()}l.handleClose(e)},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){l._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(l.oLocList.getBinding("items")){l.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){l._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(l.oProdList.getBinding("items")){l.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){l._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(l.oVerList.getBinding("items")){l.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){l._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(l.oScenList.getBinding("items")){l.oScenList.getBinding("items").filter([])}}},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var i=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(i,true)}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=e.getParameter("id"),a=[];t=t?t.trim():"";if(s.includes("Loc")){if(t!==""){a.push(new i({filters:[new i("LOCATION_ID",o.Contains,t),new i("LOCATION_DESC",o.Contains,t)],and:false}))}l.oLocList.getBinding("items").filter(a)}else if(s.includes("prod")){if(t!==""){a.push(new i({filters:[new i("PRODUCT_ID",o.Contains,t),new i("PROD_DESC",o.Contains,t)],and:false}))}l.oProdList.getBinding("items").filter(a)}else if(s.includes("Ver")){if(t!==""){a.push(new i({filters:[new i("VERSION",o.Contains,t)],and:false}))}l.oVerList.getBinding("items").filter(a)}else if(s.includes("scen")){if(t!==""){a.push(new i({filters:[new i("SCENARIO",o.Contains,t)],and:false}))}l.oScenList.getBinding("items").filter(a)}},onResetDate:function(){l.oLoc.setValue("");l.oProd.setValue("");l.oVer.setValue("");l.oScen.setValue("");l.byId("fromDate").setValue("")},onGetData:function(){var e=l.byId("idloc").getValue(),t=l.byId("idprod").getValue(),i=l.byId("idver").getValue(),o=l.byId("idscen").getValue();var s=l.byId("fromDate").getFrom();var a=l.byId("fromDate").getTo();var r=l.getDateFn(s);var n=l.getDateFn(a);var d={MARKETDATA:[]};var c={};if(e&&t&&i&&o&&s&&a){var u=l.oGModel.getProperty("/SelectedProd");for(var g in u){c={LOCATION_ID:e,PRODUCT_ID:u[g],VERSION:i,SCENARIO:o,FROMDATE:r,TODATE:n};d.MARKETDATA.push(c)}var p={};p=l.getScheduleSEDT();var h=(new Date).getTime();var f="/catalog/generateMarketAuth";var v="Market Auth."+h;sap.ui.core.BusyIndicator.show();var D={name:v,description:"Market Authorization",action:encodeURIComponent(f),active:true,httpMethod:"POST",startTime:p.djSdate,endTime:p.djEdate,createdAt:p.djSdate,schedules:[{data:{MARKETDATA:JSON.stringify(d.MARKETDATA)},cron:"",time:p.oneTime,active:true,startTime:p.dsSDate,endTime:p.dsEDate}]};this.getView().getModel("JModel").callFunction("/addMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(D)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.addMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While publishing data!")}})}else{sap.m.MessageToast.show("Select Location/Product/Version/Scenario/Date")}},getDateFn:function(e){var t,i,o;var s=e.getMonth()+1;if(s<10){t="0"+s}else{t=s}if(e.getDate()<10){i="0"+e.getDate()}else{i=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+i},getScheduleSEDT:function(){var e={};var t=new Date;var i=t.setSeconds(t.getSeconds()+20);var o=t.setHours(t.getHours()+2);i=new Date(i);o=new Date(o);var s=new Date,a=o,l=new Date,r=o,n,d,c,u;s=s.toISOString().split("T");n=s[1].split(":");a=a.toISOString().split("T");d=a[1].split(":");l=l.toISOString().split("T");c=l[1].split(":");r=r.toISOString().split("T");u=r[1].split(":");var t=(new Date).toLocaleString().split(" ");e.djSdate=s[0]+" "+n[0]+":"+n[1]+" "+"+0000";e.djEdate=a[0]+" "+d[0]+":"+d[1]+" "+"+0000";e.dsSDate=l[0]+" "+c[0]+":"+c[1]+" "+"+0000";e.dsEDate=r[0]+" "+u[0]+":"+u[1]+" "+"+0000";e.oneTime=i;return e}})});
},
	"cpapp/cpmarketauthorization/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpmarketauthorization\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Market Authorizations\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Market Authorizations\n\nflpTitle=CP Market Authorization\n\nflpSubtitle=\n',
	"cpapp/cpmarketauthorization/manifest.json":'{"_version":"1.42.0","sap.app":{"id":"cpapp.cpmarketauthorization","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.8.1","toolsId":"fe0268d7-746b-4893-8362-b8d6a1473b02"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}},"Jobs":{"uri":"v2/jobs/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpmarketauthorization-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"vcpmarketauth","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpmarketauthorization.i18n.i18n"}},"oModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"oGModel":{"type":"sap.ui.model.json.JSONModel"},"JModel":{"dataSource":"Jobs","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpmarketauthorization.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":":?query:","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpmarketauthorization.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpmarketauthorization/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpmarketauthorization/utils/locate-reuse-libs.js":'(function(e){var t=function(e,t){var n=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];Object.keys(e).forEach(function(e){if(!n.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t};var n=function(e){var n="";if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=t(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=t(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=t(e["sap.ui5"].componentUsages,n)}}return n};var r=function(e){var t=e;return new Promise(function(r,a){$.ajax(t).done(function(e){r(n(e))}).fail(function(){a(new Error("Could not fetch manifest at \'"+e))})})};var a=function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}};e.registerComponentDependencyPaths=function(e){return r(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(a)}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");var bundleResources=function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")};sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(bundleResources);if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(bundleResources)}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpmarketauthorization/view/App.view.xml":'<mvc:View controllerName="cpapp.cpmarketauthorization.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"cpapp/cpmarketauthorization/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpmarketauthorization.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core" displayBlock="true"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    xmlns:ux="sap.uxap"\n    xmlns:layout="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:html="http://www.w3.org/1999/xhtml"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle id="_IDGenObjectPageDynamicHeaderTitle1"><ux:expandedHeading><Title id="_IDGenTitle1" text="{i18n>title}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox id="_IDGenFlexBox1" fitContainer="true" alignItems="Center" ><Title id="_IDGenTitle2" text="{i18n>title}" wrapping="true" /><HBox id="_IDGenHBox2" class="newHBOX"><ToolbarSpacer id="_IDGenToolbarSpacer1"/><Button class="hdrBtnMarginHdr" icon="sap-icon://sys-help" id="idNav" press="onNavPress" type="Emphasized" tooltip="Help Document"/></HBox></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox id="_IDGenFlexBox2" wrap="Wrap" fitContainer="true"><l:Grid id="_IDGenGrid1" defaultSpan="XL3 L3 M6 S12"><VBox id="_IDGenVBox1" ><Label id="_IDGenLabel1" text="Location" required= "true"/><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox id="_IDGenVBox2" ><Label id="_IDGenLabel2" text="Product" required= "true"/><Input id="idprod" placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox id="_IDGenVBox3" ><Label id="_IDGenLabel3" text="IBP Version" required= "true"/><Input id="idver" value="" placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox id="_IDGenVBox4" ><Label id="_IDGenLabel4" text="IBP Scenario" required= "true"/><Input id="idscen" value="" placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox id="_IDGenVBox5" ><Label id="_IDGenLabel5" text="Date"  /><DateRangeSelection id="fromDate" placeholder="Select Date"/></VBox><VBox id="_IDGenVBox7"><Label id="_IDGenLabel7" text=""/><HBox id="_IDGenHBox1"><Button id="_IDGenButton1" text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd"/><Button id="_IDGenButton2" text="Reset" type="Transparent" press="onResetDate" tooltip="Reset Valid To Date"/><Button class="hdrBtnMargin" icon="sap-icon://sys-help" id="idNav1" press="onNavPress" type="Emphasized" tooltip="Help Document"/></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection id="idOBPageSec" ><ux:subSections><ux:ObjectPageSubSection id="idObjectPageSub"><ux:blocks></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cpapp/cpmarketauthorization/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="Location" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpmarketauthorization/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="Product" rememberSelections="false" search="handleSearch" multiSelect="true" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpmarketauthorization/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpmarketauthorization/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
