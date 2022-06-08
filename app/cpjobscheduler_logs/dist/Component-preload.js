//@ui5-bundle cpapp/cpjobschedulerlogs/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpjobschedulerlogs/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpjobschedulerlogs/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpjobschedulerlogs.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpjobschedulerlogs/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpjobschedulerlogs.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpjobschedulerlogs/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpjobschedulerlogs.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpjobschedulerlogs/controller/Home.controller.js":function(){sap.ui.define(["cpapp/cpjobschedulerlogs/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,s,l,a,i){"use strict";var r,o;return e.extend("cpapp.cpjobschedulerlogs.controller.Home",{onInit:function(){r=this;this.listModel=new t;this.listModel.setSizeLimit(2e3)},onAfterRendering:function(){o=this.getModel("oGModel");r.oList=r.byId("joblogList");var e=new Date;var t=new Date(e.getFullYear(),e.getMonth(),e.getDate()-15);this.byId("idDateRange").setDateValue(t);this.byId("idDateRange").setSecondDateValue(e);r.handleDateChange()},handleDateChange:function(){var e=r.byId("idDateRange").getValue().split("To");var t=e[0].trim()+" "+"00:00:00",l=e[1].trim()+" "+"23:59:59";var a=[];var i=new sap.ui.model.Filter({path:"COMPLETED_TIMESTAMP",operator:sap.ui.model.FilterOperator.BT,value1:t,value2:l});a.push(i);sap.ui.core.BusyIndicator.show();r.getModel("JModel").read("/getJobStatus",{filters:a,success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.JOB_ID=e.JOB_ID.toString();if(e.RUN_STATE==="REQUEST_ERROR"){e.RUN_STATE="ERROR"}},r);r.listModel.setData({results:e.results});r.oList.setModel(r.listModel)},error:function(e){sap.ui.core.BusyIndicator.hide();s.show("Failed to get data")}})},onUpdateFinished:function(){var e=r.getView().byId("joblogList");var t=e.getItems();var s;for(var l=0;l<t.length;l++){s=t[l].getCells();s[6].removeStyleClass("listGreen");s[6].removeStyleClass("listOrange");s[7].removeStyleClass("listGreen");s[7].removeStyleClass("listRed");s[7].removeStyleClass("listGray");if(s[6].getText().includes("COMPL")){s[6].addStyleClass("listGreen")}else if(s[6].getText().includes("RUN")){s[6].addStyleClass("listOrange")}if(s[7].getText().includes("SUCCESS")){s[7].addStyleClass("listGreen")}else if(s[7].getText().includes("ERROR")){s[7].addStyleClass("listRed")}else{s[7].addStyleClass("listGray")}}},onSearch:function(e){var t=r.getView().byId("headSearch").getValue(),s=r.getView().byId("idFilter").getSelectedIndex(),l=[];var o=[];if(t!==""){var l=new a({filters:[new a("JOB_ID",i.Contains,t),new a("JOB_NAME",i.Contains,t)],and:false});o.push(l)}if(s===0){}else if(s===1){l=new a({filters:[new a("RUN_STATE",sap.ui.model.FilterOperator.EQ,"ERROR")],and:true});o.push(l)}else if(s===2){l=new a({filters:[new a("RUN_STATE",sap.ui.model.FilterOperator.EQ,"SUCCESS")],and:false});o.push(l)}r.byId("joblogList").getBinding("items").filter(o)}})});
},
	"cpapp/cpjobschedulerlogs/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpjobschedulerlogs\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Job Scheduler Logs\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Job Scheduler Logs\n\nflpTitle=Job Scheduler Logs\n\nflpSubtitle=\n\nall =All\nerror = Error\nsuccess=Success\n\n\ndaterange=Date Range\njobid=JobID\njobname=Job Name\nschStime=Sch. Start Time\nschEtime=Sch. End Time\nschNRtime=Sch. Next Run\ncompTime=Completed Time\nrunstatus=Run Status\nrunstate=Run State',
	"cpapp/cpjobschedulerlogs/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpjobschedulerlogs","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap-ux/fiori-freestyle-writer:basic","version":"0.11.9"},"dataSources":{"mainService":{"uri":"v2/jobs/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpjobschedulerlogs-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpjobscheduler_logs","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpjobschedulerlogs.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.101.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpjobschedulerlogs.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"JModel":{"dataSource":"mainService","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpjobschedulerlogs.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpjobschedulerlogs/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpjobschedulerlogs/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpjobschedulerlogs/view/App.view.xml":'<mvc:View controllerName="cpapp.cpjobschedulerlogs.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><Shell id="shell"><App id="app"><pages></pages></App></Shell></mvc:View>',
	"cpapp/cpjobschedulerlogs/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpjobschedulerlogs.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:core="sap.ui.core"><Page ><customHeader><Toolbar ><ToolbarSpacer/><Title id="idTitle" text="{i18n>title}" class="boldText"></Title><ToolbarSpacer/><Label text="{i18n>daterange}"/><DateRangeSelection id="idDateRange" width="20%" delimiter="To" dateValue="" secondDateValue="" valueFormat="yyyy-MM-dd"\n\t\t\t\t\t\t\tdisplayFormat="yyyy-MM-dd" change="handleDateChange" maxDate=""/></Toolbar></customHeader><content><Table id="joblogList" items="{path: \'/results\', sorter : { path : \'COMPLETED_TIMESTAMP\', descending: true} }" updateFinished="onUpdateFinished"><infoToolbar><OverflowToolbar><SearchField id="headSearch" liveChange="onSearch" placeholder="JobID/Desc" width="30%"/><ToolbarSpacer /><Label text="{i18n>runstate}"/><Select id="idFilter" change="onSearch" selectedKey="A" class="buttonDesktop" width="20%"><core:ListItem key="A" text="{i18n>all}"/><core:ListItem key="E" text="{i18n>error}"/><core:ListItem key="S" text="{i18n>success}"/></Select></OverflowToolbar></infoToolbar><columns><Column hAlign="Center" vAlign="Middle" width="80px"><Text text="{i18n>jobid}" /></Column><Column hAlign="Center" vAlign="Middle" ><Text text="{i18n>jobname}"/></Column><Column hAlign="Center" vAlign="Middle"  width="160px"><Text text="{i18n>schStime}"/></Column><Column hAlign="Center" vAlign="Middle" width="160px"><Text text="{i18n>schEtime}"/></Column><Column hAlign="Center" vAlign="Middle" width="160px"><Text text="{i18n>schNRtime}"/></Column><Column hAlign="Center" vAlign="Middle" width="160px"><Text text="{i18n>compTime}"/></Column><Column hAlign="Center" vAlign="Middle" width="120px"><Text text="{i18n>runstatus}"/></Column><Column hAlign="Center" vAlign="Middle" width="120px"><Text text="{i18n>runstate}"/></Column></columns><items><ColumnListItem><cells><Text text="{JOB_ID}" /><Text text="{JOB_NAME}"/><Text text="{SCH_STARTTIME}"/><Text text="{SCH_END_TIME}"/><Text text="{SCH_NEXTRUN}"/><Text text="{COMPLETED_TIMESTAMP}"/><Text text="{RUN_STATUS}"/><Text text="{RUN_STATE}"/></cells></ColumnListItem></items></Table></content></Page></mvc:View>\n'
}});
