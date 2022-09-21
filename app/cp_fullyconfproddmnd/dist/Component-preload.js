//@ui5-bundle cpapp/cpfullyconfproddmnd/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpfullyconfproddmnd/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpfullyconfproddmnd/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpfullyconfproddmnd.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpfullyconfproddmnd/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpfullyconfproddmnd.controller.controller.App",{onInit(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpfullyconfproddmnd/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpfullyconfproddmnd.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpfullyconfproddmnd/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpfullyconfproddmnd/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,i,a,l,s){"use strict";var n,r;return t.extend("cpapp.cpfullyconfproddmnd.controller.Home",{onInit:function(){r=this;this.rowData;r.locModel=new o;r.prodModel=new o;r.verModel=new o;r.scenModel=new o;r.charModel=new o;r.locModel.setSizeLimit(1e3);r.prodModel.setSizeLimit(1e3);r.verModel.setSizeLimit(1e3);r.scenModel.setSizeLimit(1e3);r.charModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();r.col="";r.colDate="";r.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprodList");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");r._valueHelpDialogProd.setTitleAlignment("Center");r._valueHelpDialogLoc.setTitleAlignment("Center");r._valueHelpDialogVer.setTitleAlignment("Center");r._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("CIRModel").read("/getLocation",{success:function(e){r.locModel.setData(e);r.oLocList.setModel(r.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){l.show("error");sap.ui.core.BusyIndicator.hide()}});sap.ui.core.BusyIndicator.show();this.getModel("CIRModel").read("/V_Parameters",{success:function(e){var t=parseInt(e.results[0].VALUE);var o=new Date;o=new Date(o.setDate(o.getDate()+t));var i=r.getDateFn(o);var a=new Date(o.getFullYear(),o.getMonth(),o.getDate()+90);var a=r.getDateFn(a);r.byId("fromDate").setValue(i);r.byId("toDate").setValue(a);sap.ui.core.BusyIndicator.hide()},error:function(e,t){l.show("error");sap.ui.core.BusyIndicator.hide()}})},onResetDate:function(){r.byId("fromDate").setValue("");r.byId("toDate").setValue("");r.oLoc.setValue("");r.oProd.setValue("");r.oVer.setValue("");r.oScen.setValue("");r.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();r.oTable=r.byId("idCIReq");r.oGModel=r.getModel("oGModel");var t=r.oGModel.getProperty("/SelectedLoc"),o=r.oGModel.getProperty("/SelectedProd"),i=r.oGModel.getProperty("/SelectedVer"),a=r.oGModel.getProperty("/SelectedScen"),l=r.byId("idModelVer").getSelectedKey();r.oGModel.setProperty("/SelectedMV",r.byId("idModelVer").getSelectedKey());var s=this.byId("fromDate").getDateValue();var n=this.byId("toDate").getDateValue();if(t!==undefined&&o!==undefined&&i!==undefined&&a!==undefined&&l!==undefined&&s!==undefined&&s!==" "&&n!==undefined&&n!==" "){s=r.getDateFn(s);n=r.getDateFn(n);r.getModel("CIRModel").callFunction("/getCIRWeekly",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:o,VERSION:i,SCENARIO:a,FROMDATE:s,TODATE:n,MODEL_VERSION:l},success:function(e){sap.ui.core.BusyIndicator.hide();r.rowData=e.results;r.oGModel.setProperty("/TData",e.results);r.TableGenerate()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},TableGenerate:function(){var e={},t=[],o;r.oGModel=r.getModel("oGModel");r.tableData=r.oGModel.getProperty("/TData");var i;var a=new Date(r.byId("fromDate").getDateValue()),l=new Date(r.byId("toDate").getDateValue());a=a.toISOString().split("T")[0];l=l.toISOString().split("T")[0];var s=r.generateDateseries(a,l);for(var n=0;n<r.tableData.length;n++){e["Unique ID"]=r.tableData[n].UNIQUE_ID;e.UNIQUE_DESC=r.tableData[n].UNIQUE_DESC;e["Product"]=r.tableData[n].PRODUCT_ID;o=1;for(let t=2;t<s.length;t++){e[s[t].WEEK_DATE]=r.tableData[n]["WEEK"+o];o++}t.push(e);e={}}var d=new sap.ui.model.json.JSONModel;d.setData({rows:t,columns:s});r.oTable.setModel(d);r.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().WEEK_DATE;if(o==="Unique ID"){return new sap.ui.table.Column({width:"12rem",label:o,template:new sap.m.VBox({items:[new sap.m.Link({text:"{"+o+"}",press:r.uniqueIdLinkpress}),new sap.m.ObjectIdentifier({text:"{UNIQUE_DESC}"})]})})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Text({text:"{"+o+"}"})})}});r.oTable.bindRows("/rows")},generateDateseries:function(e,t){var o={},i=[];var a=e;o.WEEK_DATE="Unique ID";i.push(o);o={};o.WEEK_DATE="Product";i.push(o);o={};o.WEEK_DATE=r.getNextMonday(a);a=o.WEEK_DATE;i.push(o);o={};while(a<=t){a=r.addDays(a,7);o.WEEK_DATE=a;i.push(o);o={};if(a===t){break}}var l=i.filter((e,t,o)=>o.map(e=>e.WEEK_DATE).indexOf(e.WEEK_DATE)==t);return l},getNextMonday:function(e){var t,o,i;const a=new Date(e);var l=a.getTimezoneOffset()*6e4;a.setTime(a.getTime()+l);let s=a.getDay();if(s!==0)s=7-s;s=s+1;const n=new Date(a.getFullYear(),a.getMonth(),a.getDate()+s);t=n.getDate();o=n.getMonth()+1;i=n.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return i+"-"+o+"-"+t},addDays:function(e,t){var o,i,a;const l=new Date(e);var s=l.getTimezoneOffset()*6e4;l.setTime(l.getTime()+s);const n=new Date(l.getFullYear(),l.getMonth(),l.getDate()+t);o=n.getDate();i=n.getMonth()+1;a=n.getFullYear();if(o<10){o="0"+o}if(i<10){i="0"+i}return a+"-"+i+"-"+o},removeDays:function(e,t){const o=new Date(e);const i=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return i.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){r._valueHelpDialogLoc.open()}else if(t.includes("prodList")){if(r.byId("idloc").getValue()){r._valueHelpDialogProd.open()}else{l.show("Select Location")}}else if(t.includes("ver")){if(r.byId("idloc").getValue()&&r.byId("idprodList").getValue()){r._valueHelpDialogVer.open()}else{l.show("Select Location and Product")}}else if(t.includes("scen")){if(r.byId("idloc").getValue()&&r.byId("idprodList").getValue()){r._valueHelpDialogScen.open()}else{l.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(t.includes("prodList")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){r._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(r.oVerList.getBinding("items")){r.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){r._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(r.oScenList.getBinding("items")){r.oScenList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),l=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){l.push(new i({filters:[new i("LOCATION_ID",a.Contains,t),new i("LOCATION_DESC",a.Contains,t)],and:false}))}r.oLocList.getBinding("items").filter(l)}else if(o.includes("prod")){if(t!==""){l.push(new i({filters:[new i("PRODUCT_ID",a.Contains,t),new i("PROD_DESC",a.Contains,t)],and:false}))}r.oProdList.getBinding("items").filter(l)}else if(o.includes("ver")){if(t!==""){l.push(new i({filters:[new i("VERSION",a.Contains,t)],and:false}))}r.oVerList.getBinding("items").filter(l)}else if(o.includes("scen")){if(t!==""){l.push(new i({filters:[new i("SCENARIO",a.Contains,t)],and:false}))}r.oScenList.getBinding("items").filter(l)}},handleSelection:function(e){r.oGModel=r.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),s,n=[];if(t.includes("Loc")){r.oLoc=r.byId("idloc");r.oProd=r.byId("idprodList");s=e.getParameter("selectedItems");r.oLoc.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedLoc",s[0].getTitle());r.oProd.setValue("");r.oVer.setValue("");r.oScen.setValue("");r.oGModel.setProperty("/SelectedProd","");this.getModel("CIRModel").read("/getLocProdDet",{filters:[new i("LOCATION_ID",a.EQ,s[0].getTitle())],success:function(e){r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,t){l.show("error")}})}else if(t.includes("prod")){r.oProd=r.byId("idprodList");s=e.getParameter("selectedItems");r.oProd.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedProd",s[0].getTitle());r.oVer.setValue("");r.oScen.setValue("");this.getModel("CIRModel").read("/getCIRVerScen",{filters:[new i("LOCATION_ID",a.EQ,r.oGModel.getProperty("/SelectedLoc")),new i("REF_PRODID",a.EQ,r.oGModel.getProperty("/SelectedProd"))],success:function(e){r.verModel.setData(e);r.oVerList.setModel(r.verModel)},error:function(e,t){l.show("error")}})}else if(t.includes("Ver")){this.oVer=r.byId("idver");s=e.getParameter("selectedItems");r.oVer.setValue(s[0].getTitle());r.oScen.setValue("");r.oGModel.setProperty("/SelectedVer",s[0].getTitle());this.getModel("CIRModel").read("/getCIRVerScen",{filters:[new i("LOCATION_ID",a.EQ,r.oGModel.getProperty("/SelectedLoc")),new i("REF_PRODID",a.EQ,r.oGModel.getProperty("/SelectedProd")),new i("VERSION",a.EQ,s[0].getTitle())],success:function(e){r.scenModel.setData(e);r.oScenList.setModel(r.scenModel)},error:function(e,t){l.show("error")}})}else if(t.includes("scen")){this.oScen=r.byId("idscen");s=e.getParameter("selectedItems");r.oScen.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedScen",s[0].getTitle())}r.handleClose(e)},getDateFn:function(e){var t,o,i;var a=e.getMonth()+1;if(a<10){t="0"+a}else{t=a}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o},onCharClose:function(){r._onCharDetails.close()},uniqueIdLinkpress:function(e){var t=e.getSource().getAriaLabelledBy()[0];var o=r.byId("idCIReq").getColumns(),s=e.getSource().getText(),n=e.getSource().getBindingContext().getObject(),d=n["Unique ID"];if(s>0){if(!r._onCharDetails){r._onCharDetails=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.CharDetails",r);r.getView().addDependent(r._onCharDetails)}r._onCharDetails.setTitleAlignment("Center");r.CharDetailList=sap.ui.getCore().byId("idCharDetail");this.getModel("CIRModel").read("/getUniqueItem",{filters:[new i("UNIQUE_ID",a.EQ,d),new i("PRODUCT_ID",a.EQ,r.oGModel.getProperty("/SelectedProd")),new i("LOCATION_ID",a.EQ,r.oGModel.getProperty("/SelectedLoc"))],success:function(e){r.charModel.setData({results:e.results});r.CharDetailList.setModel(r.charModel);r._onCharDetails.open()},error:function(e,t){l.show("Failed to get data")}})}},onPressPublish:function(e){var t=e;s.confirm("Would you like to publish?",{icon:s.Icon.Conf,title:"Confirmation",actions:[s.Action.YES,s.Action.NO],emphasizedAction:s.Action.YES,onClose:function(e){if(e==="YES"){r.onPressPublishConfirm(t)}else{}}})},onPressPublishConfirm:function(e){sap.ui.core.BusyIndicator.show();r.oGModel=r.getModel("oGModel");var t={};var o=r.byId("fromDate").getDateValue();var i=r.byId("toDate").getDateValue();t.LOCATION_ID=r.oGModel.getProperty("/SelectedLoc");t.PRODUCT_ID=r.oGModel.getProperty("/SelectedProd");t.VERSION=r.oGModel.getProperty("/SelectedVer");t.SCENARIO=r.oGModel.getProperty("/SelectedScen");t.MODEL_VERSION=r.byId("idModelVer").getSelectedKey();if(t.LOCATION_ID!==undefined&&t.PRODUCT_ID!==undefined&&t.VERSION!==undefined&&t.SCENARIO!==undefined&&t.MODEL_VERSION!==undefined&&o!==undefined&&o!==" "&&i!==undefined&&i!==" "){o=r.getDateFn(o);i=r.getDateFn(i);t.FROMDATE=o;t.TODATE=i;r.handlePublish(t)}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},handlePublish:function(e){var t=r.getOwnerComponent().getModel("CIRModel");var o=new Date;var i=o.setSeconds(o.getSeconds()+20);var a=o.setHours(o.getHours()+2);i=new Date(i);a=new Date(a);var l=i;var s=new Date,n=a,d=new Date,c=a,u,g,D,p;s=s.toISOString().split("T");u=s[1].split(":");n=n.toISOString().split("T");g=n[1].split(":");d=d.toISOString().split("T");D=d[1].split(":");c=c.toISOString().split("T");p=c[1].split(":");var o=(new Date).toLocaleString().split(" "),s=s[0]+" "+u[0]+":"+u[1]+" "+"+0000";n=n[0]+" "+g[0]+":"+g[1]+" "+"+0000";d=d[0]+" "+D[0]+":"+D[1]+" "+"+0000";c=c[0]+" "+p[0]+":"+p[1]+" "+"+0000";var f={LOCATION_ID:e.LOCATION_ID,PRODUCT_ID:e.PRODUCT_ID,VERSION:e.VERSION,SCENARIO:e.SCENARIO,FROMDATE:e.FROMDATE,TODATE:e.TODATE,MODEL_VERSION:e.MODEL_VERSION};var I=(new Date).getTime();var h="/catalog/postCIRQuantitiesToS4";var m="CIRQtys"+I;sap.ui.core.BusyIndicator.show();var M={name:m,description:"Weekly CIR Quantity",action:encodeURIComponent(h),active:true,httpMethod:"POST",startTime:s,endTime:n,createdAt:s,schedules:[{data:f,cron:"",time:l,active:true,startTime:d,endTime:c}]};r.getModel("JModel").callFunction("/addMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(M)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.addMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While publishing data!")}})}})});
},
	"cpapp/cpfullyconfproddmnd/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpfullyconfproddmnd\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Fully Configured Product Demand\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Fully Configured Product Demand\n\nflpTitle=Fully Configured Demand\n\nflpSubtitle=Fully Configured Demand Qty\ncharn = Characteristic Name\ncharv =Characteristic Value\ncharr = Characteristic Rate\nclose =Close\n\nLoc= Location\nPrdId =Product',
	"cpapp/cpfullyconfproddmnd/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpfullyconfproddmnd","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.3","toolsId":"8fc69177-a52f-41cf-8b34-b33b76e7170c"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}},"Jobs":{"uri":"v2/jobs/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpfullyconfproddmnd-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpfullyconfproddmnd","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://dimension"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpfullyconfproddmnd.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"CIRModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"JModel":{"dataSource":"Jobs","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpfullyconfproddmnd.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":"","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpfullyconfproddmnd.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpfullyconfproddmnd/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpfullyconfproddmnd/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpfullyconfproddmnd/view/App.view.xml":'<mvc:View controllerName="cpapp.cpfullyconfproddmnd.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>\n',
	"cpapp/cpfullyconfproddmnd/view/CharDetails.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form"><Dialog title="Unique ID Characteristics" contentWidth="800px"><Table id="idCharDetail" sticky="ColumnHeaders" items="{path: \'/results\'}"><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charn}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charv}" /></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{CHAR_DESC}" text="{CHAR_NAME}"/><ObjectIdentifier title="{CHARVAL_DESC}" text="{CHAR_VALUE}"/></cells></ColumnListItem></items></Table><buttons><Button type=\'Reject\' text="{i18n>close}" press="onCharClose" /></buttons></Dialog></core:FragmentDefinition>\n',
	"cpapp/cpfullyconfproddmnd/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpfullyconfproddmnd.controller.Home" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" displayBlock="true" xmlns="sap.m" xmlns:f="sap.ui.layout.form" xmlns:t="sap.ui.table" xmlns:ux="sap.uxap" xmlns:l="sap.ui.layout" xmlns:html="http://www.w3.org/1999/xhtml"><ux:ObjectPageLayout id="ObjectPageLayout" headerContentPinned="true"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>appTitle}" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center"><Title text="{i18n>appTitle}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox><Label text="Location" required="true" /><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="Product" required="true" /><Input id="idprodList" placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="IBP Version" required="true" /><Input id="idver" value="" placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="IBP Scenario" required="true" /><Input id="idscen" value="" placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="Valid From" required="true" /><DatePicker id="fromDate" value="" displayFormat="yyyy-MM-dd" valueFormat="yyyy-MM-dd" change="handleDateChange" /></VBox><VBox><Label text="Valid To" required="true" /><DatePicker id="toDate" value="" valueFormat="yyyy-MM-dd" displayFormat="yyyy-MM-dd" change="handleDateChange" /></VBox><VBox><Label text="Model Version" /><Select id="idModelVer" selectedKey="Active"><core:ListItem key="Active" text="Active" /><core:ListItem key="Simulation" text="Simulation" /></Select></VBox><VBox><Label text="" /><HBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd" /><Button text="Reset" type="Transparent" press="onResetDate" tooltip="Reset Valid To Date" /></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection class="sapUiNoMargin" width="auto" showTitle="false"><ux:subSections><ux:ObjectPageSubSection class="sapUiNoMargin"><ux:blocks><VBox class="sapUiNoMargin"><Toolbar><ToolbarSpacer/><Button text="Publish" press="onPressPublish" type="Emphasized"/></Toolbar><t:Table id="idCIReq" clas="table" fixedColumnCount="2" selectionMode="None" alternateRowColors="true" enableSelectAll="false" visibleRowCount="11"><t:columns /></t:Table></VBox></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cpapp/cpfullyconfproddmnd/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpfullyconfproddmnd/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" \n    liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" \n    selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpfullyconfproddmnd/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpfullyconfproddmnd/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
