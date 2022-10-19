//@ui5-bundle cp/appf/cpibpfuturedemand/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/appf/cpibpfuturedemand/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/appf/cpibpfuturedemand/model/models"],function(e,t,i){"use strict";return e.extend("cp.appf.cpibpfuturedemand.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cp/appf/cpibpfuturedemand/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.appf.cpibpfuturedemand.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cp/appf/cpibpfuturedemand/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.appf.cpibpfuturedemand.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cp/appf/cpibpfuturedemand/controller/Detail.controller.js":function(){sap.ui.define(["cp/appf/cpibpfuturedemand/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,o,t,r,s,a,n,i){"use strict";var d,l;return e.extend("cp.appf.cpibpfuturedemand.controller.Detail",{onInit:function(){d=this;d.oListModel=new r;d.oListModel.setSizeLimit(1e3)},onBack:function(){var e=sap.ui.core.UIComponent.getRouterFor(d);e.navTo("Home",{},true)},onAfterRendering:function(){d=this;d.oGModel=d.getModel("oGModel");d.byId("DetailSearch").setValue("");var e=d.oGModel.getProperty("/sLoc"),o=d.oGModel.getProperty("/sProd"),t=d.oGModel.getProperty("/sVer"),r=d.oGModel.getProperty("/sScen"),n=d.oGModel.getProperty("/sWeek");sap.ui.core.BusyIndicator.show();d.getModel("BModel").read("/getIBPFplan",{filters:[new s("LOCATION_ID",a.EQ,e),new s("PRODUCT_ID",a.EQ,o),new s("VERSION",a.EQ,t),new s("SCENARIO",a.EQ,r),new s("WEEK_DATE",a.EQ,n)],success:function(e){sap.ui.core.BusyIndicator.hide();d.oListModel.setData({results:e.results});d.byId("idPlanTable").setModel(d.oListModel)},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})},onDetailSearch:function(e){var o="",t=[];var o=d.byId("DetailSearch").getValue();o=o?o.trim():"";o=o.toUpperCase();var r=d.oGModel.getProperty("/sLoc"),n=d.oGModel.getProperty("/sProd"),i=d.oGModel.getProperty("/sVer"),l=d.oGModel.getProperty("/sScen"),u=d.oGModel.getProperty("/sWeek");t.push(new s({filters:[new s("LOCATION_ID",a.EQ,r),new s("PRODUCT_ID",a.EQ,n),new s("VERSION",a.EQ,i),new s("SCENARIO",a.EQ,l),new s("WEEK_DATE",a.EQ,u)],and:true}));if(o!==""){t.push(new s({filters:[new s("CLASS_NAME",a.Contains,o),new s("CHAR_NAME",a.Contains,o),new s("CHAR_VALUE",a.Contains,o)],and:false}))}sap.ui.core.BusyIndicator.show();d.getModel("BModel").read("/getIBPFplan",{filters:[t],success:function(e){sap.ui.core.BusyIndicator.hide();d.oListModel.setData({results:e.results});d.byId("idPlanTable").setModel(d.oListModel)},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}})});
},
	"cp/appf/cpibpfuturedemand/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cp/appf/cpibpfuturedemand/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,i,l,a,s){"use strict";var r,d;return t.extend("cp.appf.cpibpfuturedemand.controller.Home",{onInit:function(){d=this;d.TableModel=new o;d.locModel=new o;d.prodModel=new o;d.verModel=new o;d.scenModel=new o;d.TableModel.setSizeLimit(1e3);d.locModel.setSizeLimit(1e3);d.prodModel.setSizeLimit(1e3);d.verModel.setSizeLimit(1e3);d.scenModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.appf.cpibpfuturedemand.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.appf.cpibpfuturedemand.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cp.appf.cpibpfuturedemand.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cp.appf.cpibpfuturedemand.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){d.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");d._valueHelpDialogProd.setTitleAlignment("Center");d._valueHelpDialogLoc.setTitleAlignment("Center");d._valueHelpDialogVer.setTitleAlignment("Center");d._valueHelpDialogScen.setTitleAlignment("Center");d.byId("headSearch").setValue("");d.byId("IBPfdemList").removeSelections();if(d.byId("IBPfdemList").getItems().length){d.onSearch()}this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onResetDate:function(){d.oLoc.setValue("");d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.data=[];d.TableModel.setData({results:d.data});d.byId("IBPfdemList").setModel(d.TableModel)},onGetData:function(e){var t=d.byId("idloc").getValue(),o=d.byId("idprod").getValue(),i=d.byId("idver").getValue(),l=d.byId("idscen").getValue();d.oGModel=d.getModel("oGModel");var a=[];if(t!==""&&o!==""){var s=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:t});a.push(s);var s=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:o});a.push(s);if(i){var s=new sap.ui.model.Filter({path:"VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:i});a.push(s)}if(l){var s=new sap.ui.model.Filter({path:"SCENARIO",operator:sap.ui.model.FilterOperator.EQ,value1:l});a.push(s)}sap.ui.core.BusyIndicator.show();d.getModel("BModel").read("/getIBPFdem",{filters:a,success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.WEEK_DATE=d.getInMMddyyyyFormat(e.WEEK_DATE)},d);d.oGModel.setProperty("/tableData",e.results);d.onNonZero()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.m.MessageToast.show("Please select a Location/Product")}},getInMMddyyyyFormat:function(e){if(!e){e=new Date}var t=e.getMonth()+1;var o=e.getDate();if(t<10){t="0"+t}if(o<10){o="0"+o}return t+"/"+o+"/"+e.getFullYear()},onNonZero:function(e){d.oTable=d.byId("IBPfdemList");d.oGModel=d.getModel("oGModel");var t=d.byId("idCheck1").getSelected();d.aData=d.oGModel.getProperty("/tableData");d.FinalData=[];if(t){for(var o=0;o<d.aData.length;o++){if(d.aData[o].QUANTITY!=="0"){d.FinalData.push(d.aData[o])}}}else{d.FinalData=d.aData}d.TableModel.setData({results:d.FinalData});d.byId("IBPfdemList").setModel(d.TableModel)},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(t.includes("ver")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(t.includes("scen")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogScen.open()}else{a.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){d._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(d.oVerList.getBinding("items")){d.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){d._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(d.oScenList.getBinding("items")){d.oScenList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){a.push(new i({filters:[new i("LOCATION_ID",l.Contains,t),new i("LOCATION_DESC",l.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(a)}else if(o.includes("prod")){if(t!==""){a.push(new i({filters:[new i("PRODUCT_ID",l.Contains,t),new i("PROD_DESC",l.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(a)}else if(o.includes("Ver")){if(t!==""){a.push(new i({filters:[new i("VERSION",l.Contains,t)],and:false}))}d.oVerList.getBinding("items").filter(a)}else if(o.includes("scen")){if(t!==""){a.push(new i({filters:[new i("SCENARIO",l.Contains,t)],and:false}))}d.oScenList.getBinding("items").filter(a)}},handleSelection:function(e){d.oGModel=d.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),s,r=[];if(t.includes("Loc")){d.oLoc=d.byId("idloc");d.oProd=d.byId("idprod");s=e.getParameter("selectedItems");d.oLoc.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedLoc",s[0].getTitle());d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oGModel.setProperty("/SelectedProd","");d.getModel("BModel").callFunction("/getAllProd",{method:"GET",urlParameters:{LOCATION_ID:d.oLoc.getValue()},success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){d.oProd=d.byId("idprod");s=e.getParameter("selectedItems");d.oProd.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedProd",s[0].getTitle());d.oVer.setValue("");d.oScen.setValue("");this.getModel("BModel").read("/getIbpVerScn",{filters:[new i("LOCATION_ID",l.EQ,d.oGModel.getProperty("/SelectedLoc")),new i("PRODUCT_ID",l.EQ,s[0].getTitle())],success:function(e){d.verModel.setData(e);d.oVerList.setModel(d.verModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Ver")){this.oVer=d.byId("idver");s=e.getParameter("selectedItems");d.oVer.setValue(s[0].getTitle());d.oScen.setValue("");d.oGModel.setProperty("/SelectedVer",s[0].getTitle());this.getModel("BModel").read("/getIbpVerScn",{filters:[new i("LOCATION_ID",l.EQ,d.oGModel.getProperty("/SelectedLoc")),new i("PRODUCT_ID",l.EQ,d.oGModel.getProperty("/SelectedProd")),new i("VERSION",l.EQ,s[0].getTitle())],success:function(e){d.scenModel.setData(e);d.oScenList.setModel(d.scenModel)},error:function(e,t){a.show("error")}})}else if(t.includes("scen")){this.oScen=d.byId("idscen");s=e.getParameter("selectedItems");d.oScen.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedScen",s[0].getTitle())}d.handleClose(e)},onhandlePress:function(e){var t=this.byId("IBPfdemList").getSelectedItems();d.oGModel=d.getModel("oGModel");var o=t[0].getBindingContext().getProperty();d.oGModel.setProperty("/sLoc",o.LOCATION_ID);d.oGModel.setProperty("/sProd",o.PRODUCT_ID);d.oGModel.setProperty("/sVer",o.VERSION);d.oGModel.setProperty("/sScen",o.SCENARIO);var i=new Date(o.WEEK_DATE),l=i.getMonth()+1,a=i.getDate(),s;if(l<10){l="0"+l}if(i.getDate()<10){a="0"+i.getDate()}s=i.getFullYear()+"-"+l+"-"+a;d.oGModel.setProperty("/sWeek",s);var r=sap.ui.core.UIComponent.getRouterFor(d);r.navTo("Detail",{},true)},onSearch:function(e){if(e){var t=e.getParameter("value")||e.getParameter("newValue")}else{var t=d.byId("headSearch").getValue()}var o=[];t=t?t.trim():"";if(t!==""){o.push(new i({filters:[new i("WEEK_DATE",l.Contains,t),new i("QUANTITY",l.Contains,t),new i("VERSION",l.Contains,t),new i("SCENARIO",l.Contains,t)],and:false}))}d.byId("IBPfdemList").getBinding("items").filter(o)}})});
},
	"cp/appf/cpibpfuturedemand/i18n/i18n.properties":'# This is the resource bundle for cp.appf.cpibpfuturedemand\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=IBP Future Product Demand\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=IBP Future Product Demand\npageTitle=IBP Future Product Demand\n\nflpTitle=IBP Future Demand\n\nflpSubtitle=\n\nloc=Location\nprod=Product\nversion=Version\nscen=Scenario\nweek=Week Date\nquan=Quantity\n\n\nclassno = Class\ncharno= Characteristic\ncharvalue=Characteristic Value \noptpersent= Option Percent\noptQty= Option Quantity\n\n\nLoc= Location\nPrdId=Product\n',
	"cp/appf/cpibpfuturedemand/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.appf.cpibpfuturedemand","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"palService":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/PalService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-appf-cpibpfuturedemand-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cp_ibpfuturedemand","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://enter-more"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.appf.cpibpfuturedemand.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.appf.cpibpfuturedemand.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"palService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.appf.cpibpfuturedemand.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"Detail","pattern":"Detail","target":["Detail"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"},"Detail":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewName":"Detail"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cp/appf/cpibpfuturedemand/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/appf/cpibpfuturedemand/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/appf/cpibpfuturedemand/view/App.view.xml":'<mvc:View controllerName="cp.appf.cpibpfuturedemand.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/appf/cpibpfuturedemand/view/Detail.view.xml":'<mvc:View controllerName="cp.appf.cpibpfuturedemand.controller.Detail"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"><Page id="idPage" title="IBP Future Plan" titleAlignment="Center" showNavButton="true" navButtonPress="onBack" showFooter="true" class="boldText"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox ><Text text=""/><SearchField id="DetailSearch" search="onDetailSearch" placeholder="Class Name/ Char Name/ Char Value"/></VBox><VBox ><Text text="{i18n>loc} :"/><Text text="{oGModel>/sLoc}" /></VBox><VBox><Text text="{i18n>prod} :"/><Text text="{oGModel>/sProd}" /></VBox><VBox ><Text text="{i18n>version} :"/><Text text="{oGModel>/sVer}" /></VBox><VBox><Text text="{i18n>scen} :"/><Text text="{oGModel>/sScen}" /></VBox><VBox><Text text="{i18n>week} :"/><Text text="{oGModel>/sWeek}" /></VBox></l:Grid><content><Table id="idPlanTable" items="{path: \'/results\'}"><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>classno}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charno}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charvalue}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>optpersent}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>optQty}"/></Column><Column hAlign="Left" vAlign="Middle" visible="false"><Text text="{i18n>week}"/></Column></columns><items><ColumnListItem><Text text="{CLASS_NAME}"/><Text text="{CHAR_NAME}"/><Text text="{CHAR_VALUE}"/><Text text="{OPT_PERCENT}"/><Text text="{OPT_QTY}"/><Text text="{path: \'WEEK_DATE\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'yyyy/MM/dd\' }}"/></ColumnListItem></items></Table></content></Page></mvc:View>\n',
	"cp/appf/cpibpfuturedemand/view/Home.view.xml":'<mvc:View controllerName="cp.appf.cpibpfuturedemand.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core" displayBlock="true"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    xmlns:ux="sap.uxap"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:html="http://www.w3.org/1999/xhtml"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>pageTitle}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>pageTitle}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox ><Label text=""/><SearchField id="headSearch" liveChange="onSearch" placeholder="Week Date(MM/DD/yyyy)/ Quantity/ Version/ Scenario"/></VBox><VBox ><Label text="Location" required= "true"/><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="Product" required= "true"/><Input id="idprod" placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox ><Label text="IBP Version"/><Input id="idver" value="" placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="IBP Scenario"/><Input id="idscen" value="" placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text=""/><CheckBox id="idCheck1" select="onNonZero" text="Get Non-Zero" selected="true" /></VBox><VBox><Label text=""/><HBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd"/><Button text="Reset" type="Transparent" press="onResetDate" tooltip="Reset Valid To Date"/></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table id="IBPfdemList" items="{path: \'/results\'}" itemPress="onhandlePress" growingScrollToLoad="true" mode="SingleSelectMaster" selectionChange="onhandlePress" rememberSelections="false"><columns><Column hAlign="Left" vAlign="Middle" visible="false"><Text text="{i18n>loc}" /></Column><Column hAlign="Left" vAlign="Middle" visible="false"><Text text="{i18n>prod}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>version}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>scen}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>week}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>quan}"/></Column></columns><items><ColumnListItem><cells><Text text="{LOCATION_ID}" /><Text text="{PRODUCT_ID}"/><Text text="{VERSION}"/><Text text="{SCENARIO}"/><DatePicker valueFormat="MM/dd/yyyy" displayFormat="MM/dd/yyyy" value="{WEEK_DATE}" editable="false" /><Text text="{QUANTITY}"/></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cp/appf/cpibpfuturedemand/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/appf/cpibpfuturedemand/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/appf/cpibpfuturedemand/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/appf/cpibpfuturedemand/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
