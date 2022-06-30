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
	"cp/appf/cpsaleshconfig/controller/Home.controller.js":function(){sap.ui.define(["cp/appf/cpsaleshconfig/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,i,l,s,a,r){"use strict";var n,d;return e.extend("cp.appf.cpsaleshconfig.controller.Home",{onInit:function(){n=this;n.oListModel=new i;this.locModel=new i;this.prodModel=new i;this.oListModel.setSizeLimit(5e3);n.locModel.setSizeLimit(1e3);n.prodModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.appf.cpsaleshconfig.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}},onAfterRendering:function(){n=this;n.oList=this.byId("idTab");this.oProd=this.byId("prodInput");n._valueHelpDialogLoc.setTitleAlignment("Center");n._valueHelpDialogProd.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");n.oList.removeSelections();if(n.oList.getBinding("items")){n.oList.getBinding("items").filter([])}this.getData()},getData:function(){this.getModel("BModel").read("/getLocation",{success:function(e){n.locModel.setData(e);n.oLocList.setModel(n.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,o){t.show("error")}})},handleValueHelp:function(e){var o=e.getParameter("id");if(o.includes("loc")){n._valueHelpDialogLoc.open()}else if(o.includes("prod")){if(n.byId("idloc").getValue()!==""){n._valueHelpDialogProd.open()}else{t.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){n._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(n.oLocList.getBinding("items")){n.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){n._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(n.oProdList.getBinding("items")){n.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),i=[];t=t?t.trim():"";if(o.includes("loc")){if(t!==""){i.push(new l({filters:[new l("LOCATION_ID",s.Contains,t),new l("LOCATION_DESC",s.Contains,t)],and:false}))}n.oLocList.getBinding("items").filter(i)}else if(o.includes("prod")){if(t!==""){i.push(new l({filters:[new l("PRODUCT_ID",s.Contains,t),new l("PROD_DESC",s.Contains,t)],and:false}))}n.oProdList.getBinding("items").filter(i)}},handleSelection:function(e){var o=e.getParameter("id"),i=e.getParameter("selectedItems"),a,r=[];if(o.includes("Loc")){this.oLoc=n.byId("idloc");a=e.getParameter("selectedItems");n.oLoc.setValue(a[0].getTitle());n.oProd.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new l("LOCATION_ID",s.EQ,a[0].getTitle())],success:function(e){n.prodModel.setData(e);n.oProdList.setModel(n.prodModel)},error:function(e,o){t.show("error")}})}else if(o.includes("prod")){this.oProd=n.byId("prodInput");a=e.getParameter("selectedItems");if(a&&a.length>0){n.oProd.removeAllTokens();a.forEach(function(e){n.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{n.oProd.removeAllTokens()}}n.handleClose(e)},onGetData:function(e){var o=new Date(n.byId("idDate").getValue()),i,l;if(n.byId("idloc").getValue()!==""&&n.oProdList.getSelectedItems().length!==0){var s=n.oProdList.getSelectedItems();var a=[];if(n.byId("idDate").getValue()!==""){i=o.getMonth()+1;if(i<10){i="0"+i}else{i=i}if(o.getDate<10){l="0"+o.getDate()}else{l=o.getDate()}var r=o.getFullYear()+"-"+i+"-"+l;var d=new sap.ui.model.Filter({path:"DOC_CREATEDDATE",operator:sap.ui.model.FilterOperator.EQ,value1:r});a.push(d)}var d=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:n.oLoc.getValue()});a.push(d);for(var g=0;g<s.length;g++){if(s[g].getTitle()!=="All"){d=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:s[g].getTitle()});a.push(d)}}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getSalesh",{filters:a,success:function(e){n.oListModel.setData({results:e.results});n.oList.setModel(n.oListModel);sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("error");sap.ui.core.BusyIndicator.hide()}})}else{t.show("Please fill all required inputs")}},onhandlePress:function(e){n.oGModel=n.getModel("oGModel");var t=n.byId("idTab").getSelectedItem().getBindingContext().getObject();n.oGModel.setProperty("/selItem",t);n.oGModel.setProperty("/sSalOrd",t.SALES_DOC);n.oGModel.setProperty("/sSalOrdItem",t.SALESDOC_ITEM);n.oGModel.setProperty("/sPrdid",t.PRODUCT_ID);n.oGModel.setProperty("/sLocid",t.LOCATION_ID);n.oGModel.setProperty("/date",e.getSource().getSelectedItem().getCells()[2].getText());var o=sap.ui.core.UIComponent.getRouterFor(n);o.navTo("Detail",{},true)},onTableSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];if(t!==""){o.push(new l({filters:[new l("SALES_DOC",s.Contains,t),new l("PRODUCT_ID",s.Contains,t),new l("LOCATION_ID",s.Contains,t)],and:false}))}n.oList.getBinding("items").filter(o)}})});
},
	"cp/appf/cpsaleshconfig/i18n/i18n.properties":'# This is the resource bundle for cp.appf.cpsaleshconfig\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Sales History\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Sales History\n\nflpTitle=Sales History\n\nflpSubtitle=\n\nsotitle=Sales Order Header\nsodetails= Sales Order Details\nsalDoc=Sales Doc\nSalDocItem= Sales Doc.Item\ndocCreDate= Doc Created Date\nschLine=Schedule Line\nPrdId=Product\nCustgrp=Customer Group\nLoc=Location\nordQuan=Ordered Qty\nnetvalue=Net Value\n\nschLine=Schedule Line #\nreasonrej=Reason For Rejection\nconqty=Confirmed Qty\nordqty=Ordered Qty\nmatavldate=Material Avail Date\ncharname=Characteristic Name\ncharval=Characteristic Value\n\nprodid=Product ID\nlocid=Location ID\ndocdate=Document Date\n',
	"cp/appf/cpsaleshconfig/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.appf.cpsaleshconfig","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-appf-cpsaleshconfig-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cp_saleshconfig","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://sales-order-item"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.appf.cpsaleshconfig.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.2","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.appf.cpsaleshconfig.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.appf.cpsaleshconfig.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"Detail","pattern":"Detail","target":["Detail"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"},"Detail":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewName":"Detail"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/appf/cpsaleshconfig/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/appf/cpsaleshconfig/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/appf/cpsaleshconfig/view/App.view.xml":'<mvc:View controllerName="cp.appf.cpsaleshconfig.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/appf/cpsaleshconfig/view/Detail.view.xml":'<mvc:View\n    controllerName="cp.appf.cpsaleshconfig.controller.Detail"\n     xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core"\n    xmlns:ux="sap.uxap"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page title="{i18n>sodetails}" titleAlignment="Center" showNavButton="true" navButtonPress="onBack"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>sotitle}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>sotitle}" class="boldText" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormDisplayColumn_threeGroups234"\n\t\t\teditable="false"\n\t\t\tlayout="ColumnLayout"\n\t\t\tcolumnsM="2"\n\t\t\tcolumnsL="2"\n\t\t\tcolumnsXL="2"\n\t\t\t><f:content><Label text="{i18n>prodid} " /><Text text="{oGModel>/sPrdid}" /><Label text="{i18n>locid}" /><Text text="{oGModel>/sLocid}" /><Label text="Sales Order" /><Text text="{oGModel>/sSalOrd}" /><Label text="Sales Order Item"  /><Text text="{oGModel>/sSalOrdItem}" /><Label text="{i18n>docdate}" /><Text text="{oGModel>/date}"/><Label text="{i18n>schLine}" /><Text text="{oGModel>/sSchedNo}" /><Label text="{i18n>reasonrej}" /><Text text="{oGModel>/sRejReson}" /><Label text="{i18n>conqty}" /><Text text="{oGModel>/sConQty}" /><Label text="{i18n>ordqty}" /><Text text="{oGModel>/sOrdQty}" /><Label text="{i18n>matavldate}" /><Text text="{path: \'oGModel>/sMatAvailData\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}" /><Label text="{i18n>Custgrp}" /><Text text="{oGModel>/sCustGrp}" /></f:content></f:SimpleForm></VBox></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table id="idDetailTab" items="{path: \'/results\'}" growingScrollToLoad="true" sticky="ColumnHeaders" ><headerToolbar><Toolbar><content><Text text="SO Config Details" class="sapUiSmallMarginBeginEnd boldText"/><SearchField id="idDetailSearch" placeholder="Char Name/ Char Value"  \n                        liveChange="onTableSearch" width="600px"/></content></Toolbar></headerToolbar><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charname}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charval}"/></Column></columns><items><ColumnListItem><cells><Text text="{CHAR_NAME}"/><Text text="{CHAR_VALUE}"/></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></Page></mvc:View>',
	"cp/appf/cpsaleshconfig/view/Home.view.xml":'<mvc:View controllerName="cp.appf.cpsaleshconfig.controller.Home"\n    xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:ux="sap.uxap"\n    xmlns:mvc="sap.ui.core.mvc" \n    displayBlock="true"\n    xmlns="sap.m"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>title}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>title}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12" ><VBox><Label text="" /><SearchField id="idSearch" placeholder="Location/ Product/ Sales Doc" liveChange="onTableSearch" /></VBox><VBox ><Label text="Location" required="true"/><Input id="idloc" value=""  placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox><Label text="Product" required="true"/><MultiInput id="prodInput"  placeholder="Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></VBox><VBox><Label text="Doc. Created Date"/><HBox><DatePicker id="idDate" displayFormat="yyyy-MM-dd" change="handleDateChange"/><VBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters"/></VBox></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table id="idTab" items="{path: \'/results\'}" growingScrollToLoad="true" rememberSelections="false" itemPress="onhandlePress" mode="SingleSelectMaster" selectionChange="onhandlePress" sticky="ColumnHeaders"><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>salDoc}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>SalDocItem}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>docCreDate}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>schLine}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>PrdId}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>Custgrp}"/></Column><Column hAlign="Left" vAlign="Middle" visible="false"><Text text="{i18n>Loc}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>ordQuan}"/></Column></columns><items><ColumnListItem><cells><Text text="{SALES_DOC}"/><Text text="{SALESDOC_ITEM}"/><Text text="{path: \'DOC_CREATEDDATE\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}"/><Text text="{SCHEDULELINE_NUM}"/><Text text="{PRODUCT_ID}"/><Text text="{CUSTOMER_GROUP}"/><Text text="{LOCATION_ID}"/><Text text="{ORD_QTY}"/></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>',
	"cp/appf/cpsaleshconfig/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/appf/cpsaleshconfig/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
