//@ui5-bundle cp/appf/cpsaleshconfig/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/appf/cpsaleshconfig/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/appf/cpsaleshconfig/model/models"],function(e,i,t){"use strict";return e.extend("cp.appf.cpsaleshconfig.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cp/appf/cpsaleshconfig/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.appf.cpsaleshconfig.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cp/appf/cpsaleshconfig/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.appf.cpsaleshconfig.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cp/appf/cpsaleshconfig/controller/Detail.controller.js":function(){sap.ui.define(["cp/appf/cpsaleshconfig/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,s,o,r,l,a,n){"use strict";var i,u;return e.extend("cp.appf.cpsaleshconfig.controller.Detail",{onInit:function(){i=this;i.oListModel=new o},onAfterRendering:function(){i=this;i.oList=this.byId("idDetailTab");this.getData()},getData:function(){i.oGModel=i.getModel("oGModel");var e=i.oGModel.getProperty("/selItem");if(e===undefined){i.onBack()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getSaleshCfg",{filters:[new r("SALES_DOC",l.EQ,e.SALES_DOC),new r("SALESDOC_ITEM",l.EQ,e.SALESDOC_ITEM)],success:function(e){sap.ui.core.BusyIndicator.hide();var t=[];for(var s=0;s<e.results.length;s++){if(e.results[s].CHAR_NAME!==null||e.results[s].CHAR_VALUE!==null){t.push(e.results[s])}}i.oListModel.setData({results:t});i.oList.setModel(i.oListModel);i.oGModel.setProperty("/sSchedNo",e.results[0].SCHEDULELINE_NUM);i.oGModel.setProperty("/sRejReson",e.results[0].REASON_REJ);i.oGModel.setProperty("/sConQty",e.results[0].CONFIRMED_QTY);i.oGModel.setProperty("/sOrdQty",e.results[0].ORD_QTY);i.oGModel.setProperty("/sMatAvailData",e.results[0].MAT_AVAILDATE);i.oGModel.setProperty("/sCustGrp",e.results[0].CUSTOMER_GROUP);i.oGModel.setProperty("/sNetValue",e.results[0].NET_VALUE)},error:function(e){t.show("error")}})},onBack:function(){var e=sap.ui.core.UIComponent.getRouterFor(i);e.navTo("Home",{},true)},onTableSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=[];if(t!==""){s.push(new r({filters:[new r("CHAR_NAME",l.Contains,t),new r("CHAR_VALUE",l.Contains,t)],and:false}))}i.oList.getBinding("items").filter(s)}})});
},
	"cp/appf/cpsaleshconfig/controller/Home.controller.js":function(){e:null,sap.ui.define(["cp/appf/cpsaleshconfig/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,i,a,s,r,l){"use strict";var n,d;return e.extend("cp.appf.cpsaleshconfig.controller.Home",{onInit:function(){var e=this;n=this;n.oGModel=n.getOwnerComponent().getModel("oGModel");n.oListModel=new i;this.locModel=new i;this.prodModel=new i;this.variantModel=new i;this.oListModel.setSizeLimit(5e3);n.locModel.setSizeLimit(1e3);n.prodModel.setSizeLimit(1e3);n.variantModel.setSizeLimit(5e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._nameFragment){this._nameFragment=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.NameVariant",this);this.getView().addDependent(this._nameFragment)}if(!this._variantFragment){this._variantFragment=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.ShowVariants",this);this.getView().addDependent(this._variantFragment)}if(!this._popOver){this._popOver=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.VariantNames",this);this.getView().addDependent(this._popOver)}},onAfterRendering:function(){n=this;n.oList=this.byId("idTab");this.oProd=this.byId("prodInput");n._valueHelpDialogLoc.setTitleAlignment("Center");n._valueHelpDialogProd.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");n.oList.removeSelections();if(n.oList.getBinding("items")){n.oList.getBinding("items").filter([])}this.getData()},getData:function(){var e=[];this.getModel("BModel").read("/getLocation",{success:function(e){n.locModel.setData(e);n.oLocList.setModel(n.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,o){t.show("error")}});this.getModel("BModel").read("/getVariant",{success:function(t){n.oGModel.setProperty("/variantDetails",t.results);for(var o=0;o<t.results.length;o++){e.push({VARIANTNAME:t.results[o].VARIANTNAME,APPLICATION_NAME:t.results[o].APPLICATION_NAME})}var i=e.filter((e,t,o)=>o.map(e=>e.VARIANTNAME).indexOf(e.VARIANTNAME)==t);n.variantModel.setData({items:i});n.byId("Variants").setModel(n.variantModel);var a=t.results.length;n.oGModel.setProperty("/Id",t.results[a-1].VARIANTID)},error:function(e,o){t.show("error while loading variant details")}})},handleValueHelp:function(e){var o=e.getParameter("id");if(o.includes("loc")){n._valueHelpDialogLoc.open()}else if(o.includes("prod")){if(n.byId("idloc").getValue()!==""){n._valueHelpDialogProd.open()}else{t.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){n._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(n.oLocList.getBinding("items")){n.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){n._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(n.oProdList.getBinding("items")){n.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),i=[];t=t?t.trim():"";if(o.includes("loc")){if(t!==""){i.push(new a({filters:[new a("LOCATION_ID",s.Contains,t),new a("LOCATION_DESC",s.Contains,t)],and:false}))}n.oLocList.getBinding("items").filter(i)}else if(o.includes("prod")){if(t!==""){i.push(new a({filters:[new a("PRODUCT_ID",s.Contains,t),new a("PROD_DESC",s.Contains,t)],and:false}))}n.oProdList.getBinding("items").filter(i)}else if(o.includes("var")){if(t!==""){i.push(new a({filters:[new a("VARIANTNAME",s.Contains,t),new a("APPLICATION_NAME",s.Contains,t)],and:false}))}sap.ui.getCore().byId("varSlctList").getBinding("items").filter(i)}},handleSelection:function(e){var o=e.getParameter("id"),i=e.getParameter("selectedItems"),r,l=[];if(o.includes("Loc")){this.oLoc=n.byId("idloc");r=e.getParameter("selectedItems");n.oLoc.setValue(r[0].getTitle());n.oProd.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new a("LOCATION_ID",s.EQ,r[0].getTitle())],success:function(e){n.prodModel.setData(e);n.oProdList.setModel(n.prodModel)},error:function(e,o){t.show("error")}})}else if(o.includes("prod")){this.oProd=n.byId("prodInput");r=e.getParameter("selectedItems");if(r&&r.length>0){n.oProd.removeAllTokens();r.forEach(function(e){n.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{n.oProd.removeAllTokens()}}n.handleClose(e)},onGetData:function(e){var o=new Date(n.byId("idDate").getValue()),i,a;if(n.byId("idloc").getValue()!==""&&n.oProdList.getSelectedItems().length!==0){var s=n.oProdList.getSelectedItems();var r=[];if(n.byId("idDate").getValue()!==""){i=o.getMonth()+1;if(i<10){i="0"+i}else{i=i}if(o.getDate<10){a="0"+o.getDate()}else{a=o.getDate()}var l=o.getFullYear()+"-"+i+"-"+a;var d=new sap.ui.model.Filter({path:"DOC_CREATEDDATE",operator:sap.ui.model.FilterOperator.EQ,value1:l});r.push(d)}var d=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:n.oLoc.getValue()});r.push(d);for(var g=0;g<s.length;g++){if(s[g].getTitle()!=="All"){d=new sap.ui.model.Filter({path:"REF_PRODID",operator:sap.ui.model.FilterOperator.EQ,value1:s[g].getTitle()});r.push(d)}}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getSalesh",{filters:r,success:function(e){n.oListModel.setData({results:e.results});n.oList.setModel(n.oListModel);sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("error");sap.ui.core.BusyIndicator.hide()}})}else{t.show("Please fill all required inputs")}},onhandlePress:function(e){n.oGModel=n.getModel("oGModel");var t=n.byId("idTab").getSelectedItem().getBindingContext().getObject();n.oGModel.setProperty("/selItem",t);n.oGModel.setProperty("/sSalOrd",t.SALES_DOC);n.oGModel.setProperty("/sSalOrdItem",t.SALESDOC_ITEM);n.oGModel.setProperty("/sPrdid",t.PRODUCT_ID);n.oGModel.setProperty("/sLocid",t.LOCATION_ID);n.oGModel.setProperty("/date",e.getSource().getSelectedItem().getCells()[2].getText());var o=sap.ui.core.UIComponent.getRouterFor(n);o.navTo("Detail",{},true)},onTableSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];if(t!==""){o.push(new a({filters:[new a("SALES_DOC",s.Contains,t),new a("PRODUCT_ID",s.Contains,t),new a("LOCATION_ID",s.Contains,t)],and:false}))}n.oList.getBinding("items").filter(o)},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var o=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(o,true)}},onSaveVariant:function(){this._nameFragment.open()},onClose:function(){sap.ui.getCore().byId("idInput").setValue("");n.byId("idloc").setValue("");n.byId("prodInput").setTokens([]);this._nameFragment.close()},onCreate:function(){var e={RTRCHAR:[]};var o=[];var i={};var a=n.byId("idloc").getValue();var s=n.byId("idloc").getParent().getItems()[0].getText();var r=n.byId("prodInput").getTokens();var l=n.byId("prodInput").getParent().getItems()[0].getText();var d=sap.ui.getCore().byId("idInput").getValue();i={Field:s,FieldCenter:1..toString(),Value:a};o.push(i);for(var g=0;g<r.length;g++){i={Field:l,FieldCenter:(g+1).toString(),Value:r[g].getText()};o.push(i)}for(var p=0;p<o.length;p++){var c=n.oGModel.getProperty("/Id");if(c===undefined){c=0}c=c+1;o[p].ID=c;o[p].IDNAME=d;o[p].App_Name="Sales History Configuration"}n.getModel("BModel").callFunction("/createVariant",{method:"GET",urlParameters:{Flag:"X",VARDATA:JSON.stringify(o)},success:function(e){t.show(e.createVariant);n.getData();n.onClose()},error:function(e){t.show("Failed to create variant")}})},onShowPress:function(){n._variantFragment.open()},handleCloseVariant:function(){n._variantFragment.close()},onTitlePress:function(e){var t={};var o=[];var a=e.getSource();var s=e.getSource().getTitle();var r=n.oGModel.getProperty("/variantDetails");for(var l=0;l<r.length;l++){if(s===r[l].VARIANTNAME){t.VARIANTID=r[l].VARIANTID;t.VARIANTNAME=r[l].VARIANTNAME;t.USER=r[l].USER;t.APPLICATION_NAME=r[l].APPLICATION_NAME;t.FIELD=r[l].FIELD;t.FIELDCENTER=r[l].FIELDCENTER;t.VALUE=r[l].VALUE;t.SCOPE=r[l].SCOPE;o.push(t);t={}}}var d=new i;d.setData({items1:o});sap.ui.getCore().byId("varNameList").setModel(d);n._popOver.openBy(a)},handleSelectClose:function(){n._popOver.close()},handleSelectPress:function(){var e,o={},i=[];var r=sap.ui.getCore().byId("varNameList").getItems();for(var l=0;l<r.length;l++){if(r[l].getCells()[4].getText().includes("Loc")){e=r[l].getCells()[6].getText()}else if(r[l].getCells()[4].getText().includes("Prod")){var d=new sap.m.Token({key:l,text:r[l].getCells()[6].getText()});i.push(d);d={}}}n.byId("idloc").setValue(e);this.getModel("BModel").read("/getLocProdDet",{filters:[new a("LOCATION_ID",s.EQ,e)],success:function(e){n.prodModel.setData(e);n.oProdList.setModel(n.prodModel)},error:function(e,o){t.show("error")}});n._popOver.close();n._variantFragment.close();n.byId("prodInput").setTokens(i)}})});
},
	"cp/appf/cpsaleshconfig/i18n/i18n.properties":'# This is the resource bundle for cp.appf.cpsaleshconfig\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Sales History\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Sales History\n\nflpTitle=Sales History\n\nflpSubtitle=\n\nsotitle=Sales Order Header\nsodetails= Sales Order Details\nsalDoc=Sales Doc\nSalDocItem= Sales Doc.Item\ndocCreDate= Doc Created Date\nschLine=Schedule Line\nPrdId=Configurable Product\nCustgrp=Customer Group\nLoc=Location\nordQuan=Ordered Qty\nnetvalue=Net Value\n\nschLine=Schedule Line #\nreasonrej=Reason For Rejection\nconqty=Confirmed Qty\nordqty=Ordered Qty\nmatavldate=Material Avail Date\ncharname=Characteristic Name\ncharval=Characteristic Value\n\nprodid=Configurable Product ID\nlocid=Location ID\ndocdate=Document Date\n',
	"cp/appf/cpsaleshconfig/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.appf.cpsaleshconfig","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-appf-cpsaleshconfig-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cp_saleshconfig","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://sales-order-item"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.appf.cpsaleshconfig.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.2","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.appf.cpsaleshconfig.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.appf.cpsaleshconfig.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"Detail","pattern":"Detail","target":["Detail"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"},"Detail":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewName":"Detail"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cp/appf/cpsaleshconfig/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/appf/cpsaleshconfig/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/appf/cpsaleshconfig/view/App.view.xml":'<mvc:View controllerName="cp.appf.cpsaleshconfig.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/appf/cpsaleshconfig/view/Detail.view.xml":'<mvc:View\n    controllerName="cp.appf.cpsaleshconfig.controller.Detail"\n     xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core"\n    xmlns:ux="sap.uxap"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page title="{i18n>sodetails}" titleAlignment="Center" showNavButton="true" navButtonPress="onBack"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>sotitle}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>sotitle}" class="boldText" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormDisplayColumn_threeGroups234"\n\t\t\teditable="false"\n\t\t\tlayout="ColumnLayout"\n\t\t\tcolumnsM="2"\n\t\t\tcolumnsL="2"\n\t\t\tcolumnsXL="2"\n\t\t\t><f:content><Label text="{i18n>prodid} " /><Text text="{oGModel>/sPrdid}" /><Label text="{i18n>locid}" /><Text text="{oGModel>/sLocid}" /><Label text="Sales Order" /><Text text="{oGModel>/sSalOrd}" /><Label text="Sales Order Item"  /><Text text="{oGModel>/sSalOrdItem}" /><Label text="{i18n>docdate}" /><Text text="{oGModel>/date}"/><Label text="{i18n>schLine}" /><Text text="{oGModel>/sSchedNo}" /><Label text="{i18n>reasonrej}" /><Text text="{oGModel>/sRejReson}" /><Label text="{i18n>conqty}" /><Text text="{oGModel>/sConQty}" /><Label text="{i18n>ordqty}" /><Text text="{oGModel>/sOrdQty}" /><Label text="{i18n>matavldate}" /><Text text="{path: \'oGModel>/sMatAvailData\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}" /><Label text="{i18n>Custgrp}" /><Text text="{oGModel>/sCustGrp}" /></f:content></f:SimpleForm></VBox></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table id="idDetailTab" items="{path: \'/results\'}" growingScrollToLoad="true" sticky="ColumnHeaders" ><headerToolbar><Toolbar><content><Text text="SO Config Details" class="sapUiSmallMarginBeginEnd boldText"/><SearchField id="idDetailSearch" placeholder="Char Name/ Char Value"  \n                        liveChange="onTableSearch" width="600px"/></content></Toolbar></headerToolbar><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charname}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charval}"/></Column></columns><items><ColumnListItem><cells><Text text="{CHAR_NAME}"/><Text text="{CHAR_VALUE}"/></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></Page></mvc:View>',
	"cp/appf/cpsaleshconfig/view/Home.view.xml":'<mvc:View controllerName="cp.appf.cpsaleshconfig.controller.Home" xmlns:variant="sap.ui.comp.variants" xmlns:l="sap.ui.layout" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form" xmlns:ux="sap.uxap" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m" xmlns:m="sap.m"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle id="_IDGenObjectPageDynamicHeaderTitle1"><ux:expandedHeading><HBox id="_IDGenHBox4"><variant:VariantManagement variantItems="{/items}" select="onSelect" save="onSaveAs" enabled="true" manage="onManage" showExecuteOnSelection="false" showShare="false" id="Variants"><variant:variantItems><variant:VariantItem id="_IDGenVariantItem1" text="{VARIANTNAME}" key="{APPLICATIONAME}"/></variant:variantItems></variant:VariantManagement><Title id="_IDGenTitle1" text="{i18n>title}"  class ="Middle"/><Button class="hdrBtnMarginHdr" id="_IDGenOverflowToolbarButton1" icon="sap-icon://sys-help" text="" type="Emphasized" press="onNavPress" tooltip="Help Document" /></HBox></ux:expandedHeading><ux:snappedHeading><HBox id="_IDGenFlexBox1" fitContainer="true" alignItems="Center"><Title id="_IDGenTitle2" text="{i18n>title}" wrapping="true" /><Button class="hdrBtnMarginHdr" id="_IDGenOverflowToolbarButton2" icon="sap-icon://sys-help" text="" type="Emphasized" press="onNavPress" tooltip="Help Document" /></HBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox id="_IDGenFlexBox2" wrap="Wrap" fitContainer="true"><l:Grid id="_IDGenGrid1" defaultSpan="XL3 L3 M6 S12"><VBox id="_IDGenVBox1" class="VBOX"><Label id="_IDGenLabel1" text="" /><SearchField id="idSearch" placeholder="Location/ Configurable Product/ Sales Doc" liveChange="onTableSearch" /></VBox><VBox id="_IDGenVBox2"><Label id="_IDGenLabel2" text="Location" required="true" width="100px" /><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox id="_IDGenVBox3"><Label id="_IDGenLabel3" text="Configurable Product" required="true" /><MultiInput id="prodInput" placeholder="Configurable Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate" /></VBox><VBox id="_IDGenVBox4"><Label id="_IDGenLabel4" text="Doc. Created Date" /><HBox id="_IDGenHBox1"><DatePicker id="idDate" displayFormat="yyyy-MM-dd" change="handleDateChange" width="130px" /><VBox id="_IDGenVBox5"><HBox id="_IDGenHBox2"><HBox id="_IDGenHBox3"><Button id="_IDGenButton1" class="buttonClass" text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" /><Button id="_IDGenButton2" class="buttonClass" type="Emphasized" text="Save Variant" press="onSaveVariant" tooltip="Save Variant" /></HBox></HBox></VBox></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection id="_IDGenObjectPageSection1" ><ux:subSections><ux:ObjectPageSubSection id="_IDGenObjectPageSubSection1"><ux:blocks><Table id="idTab" items="{path: \'/results\'}" growingScrollToLoad="true" rememberSelections="false" itemPress="onhandlePress" mode="SingleSelectMaster" selectionChange="onhandlePress" sticky="ColumnHeaders"><columns><Column id="_IDGenColumn1" hAlign="Left" vAlign="Middle"><Text id="_IDGenText1" text="{i18n>salDoc}" /></Column><Column id="_IDGenColumn2" hAlign="Left" vAlign="Middle"><Text id="_IDGenText2" text="{i18n>SalDocItem}" /></Column><Column id="_IDGenColumn3" hAlign="Left" vAlign="Middle"><Text id="_IDGenText3" text="{i18n>docCreDate}"/></Column><Column id="_IDGenColumn4" hAlign="Left" vAlign="Middle"><Text id="_IDGenText4" text="{i18n>schLine}"/></Column><Column id="_IDGenColumn5" hAlign="Left" vAlign="Middle"><Text id="_IDGenText5" text="{i18n>PrdId}"/></Column><Column id="_IDGenColumn6" hAlign="Left" vAlign="Middle"><Text id="_IDGenText6" text="{i18n>Custgrp}"/></Column><Column id="_IDGenColumn7" hAlign="Left" vAlign="Middle" visible="false"><Text id="_IDGenText7" text="{i18n>Loc}"/></Column><Column id="_IDGenColumn8" hAlign="Left" vAlign="Middle"><Text id="_IDGenText8" text="{i18n>ordQuan}"/></Column><Column id="_IDGenColumn9" hAlign="Left" vAlign="Middle"><Text id="_IDGenText17" text="{i18n>UID}" /></Column></columns><items><ColumnListItem id="_IDGenColumnListItem1"><cells><Text id="_IDGenText9" text="{SALES_DOC}"/><Text id="_IDGenText10" text="{SALESDOC_ITEM}"/><Text id="_IDGenText11" text="{path: \'DOC_CREATEDDATE\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}"/><Text id="_IDGenText12" text="{SCHEDULELINE_NUM}"/><Text id="_IDGenText13" text="{PRODUCT_ID}"/><Text id="_IDGenText14" text="{CUSTOMER_GROUP}"/><Text id="_IDGenText15" text="{LOCATION_ID}"/><Text id="_IDGenText16" text="{ORD_QTY}"/><Text id="_IDGenText18" text="{UNIQUE_ID}"/></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cp/appf/cpsaleshconfig/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem id="_IDGenStandardListItem1" title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/appf/cpsaleshconfig/view/NameVariant.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form" xmlns:semantic="sap.m.semantic" xmlns:l="sap.ui.layout"><Dialog id="openDialog" title="Create Variant" afterClose="onAfterClose"><f:SimpleForm id="createVariant" visible="true" editable="true" layout="ResponsiveGridLayout" adjustLabelSpan="false" emptySpanL="6" columnsL="1"><f:content><Label id="_IDGenLabel1" text="Enter Name for your Variant" /><Input value="" id="idInput" /></f:content></f:SimpleForm><beginButton><Button id="_IDGenButton1" text="Create" press="onCreate" type="Emphasized" /></beginButton><endButton><Button id="_IDGenButton2" text="Close" press="onClose" type="Emphasized" /></endButton></Dialog></core:FragmentDefinition>\n',
	"cp/appf/cpsaleshconfig/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/appf/cpsaleshconfig/view/ShowVariants.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog title="Variant Names" contentWidth="450px" titleAlignment="Center"><Table id="varSlctList" items="{path: \'/items\'}" mode="Delete" itemPress="onTitlePress"><columns><Column ></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{VARIANTNAME}" text="{APPLICATION_NAME}"  titleActive="true" titlePress="onTitlePress"/></cells></ColumnListItem></items></Table><buttons><Button type=\'Reject\' text="Close" press="handleCloseVariant" /></buttons></Dialog></core:FragmentDefinition>',
	"cp/appf/cpsaleshconfig/view/VariantNames.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><Popover\n\t\tid="myPopover"\n\t\ttitle="VARIANT NAME"\n\t\tclass="sapUiResponsivePadding--header sapUiResponsivePadding--footer"\n\t\tplacement="Auto"\n\t\tinitialFocus="email"><footer><OverflowToolbar id="_IDGenOverflowToolbar1"><ToolbarSpacer id="_IDGenToolbarSpacer1"/><Button\n\t\t\t\t\tid="idSelect"\n\t\t\t\t\ttext="Select"\n\t\t\t\t\tpress="handleSelectPress" /><Button\n\t\t\t\t\tid="idClose"\n\t\t\t\t\ttext="Close"\n\t\t\t\t\tpress="handleSelectClose" /></OverflowToolbar></footer><Table id="varNameList" items="{path: \'/items1\'}"><columns><Column id="_IDGenColumn1" ><Text id="_IDGenText1" text="Variant ID" /></Column><Column id="_IDGenColumn2" ><Text id="_IDGenText2" text="Variant Name" /></Column><Column id="_IDGenColumn3" ><Text id="_IDGenText3" text="User Name" /></Column><Column id="_IDGenColumn4" ><Text id="_IDGenText4" text="Application Name" /></Column><Column id="_IDGenColumn5" ><Text id="_IDGenText5" text="Field" /></Column><Column id="_IDGenColumn6" ><Text id="_IDGenText6" text="Field Center" /></Column><Column id="_IDGenColumn7" ><Text id="_IDGenText7" text="Value" /></Column><Column id="_IDGenColumn8" ><Text id="_IDGenText8" text="Scope" /></Column></columns><items><ColumnListItem id="_IDGenColumnListItem1"><cells><Text id="_IDGenText9" text="{VARIANTID}" /><Text id="_IDGenText10" text="{VARIANTNAME}" /><Text id="_IDGenText11" text="{USER}" /><Text id="_IDGenText12" text="{APPLICATION_NAME}" /><Text id="_IDGenText13" text="{FIELD}" /><Text id="_IDGenText14" text="{FIELD_CENTER}" /><Text id="_IDGenText15" text="{VALUE}" /><Text id="_IDGenText16" text="{SCOPE}" /></cells></ColumnListItem></items></Table></Popover></core:FragmentDefinition>'
}});
