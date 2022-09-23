//@ui5-bundle cpapp/cpseedordercreation/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpseedordercreation/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpseedordercreation/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpseedordercreation.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpseedordercreation/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpseedordercreation.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpseedordercreation/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpseedordercreation.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpseedordercreation/controller/Home.controller.js":function(){sap.ui.define(["cpapp/cpseedordercreation/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/library","sap/ui/model/Sorter","jquery.sap.global"],function(e,t,i,o,a,s,d,r){"use strict";var l,n;return e.extend("cpapp.cpseedordercreation.controller.Home",{onInit:function(){l=this;l.oModel=new t;l.locModel=new t;l.prodModel=new t;l.uniqModel=new t;l.custModel=new t;this.oModel.setSizeLimit(1e3);l.locModel.setSizeLimit(1e3);l.prodModel.setSizeLimit(1e3);l.uniqModel.setSizeLimit(1e3);l.custModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogUniq){this._valueHelpDialogUniq=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.UniqId",this);this.getView().addDependent(this._valueHelpDialogUniq)}if(!this._valueHelpDialogOrderCreate){this._valueHelpDialogOrderCreate=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.OrderCreate",this);this.getView().addDependent(this._valueHelpDialogOrderCreate)}},onAfterRendering:function(){l=this;l.oGModel=l.getModel("oGModel");l.oGModel.setProperty("/selFlag","");l.oGModel.setProperty("/OrderFlag","");l.oList=this.byId("orderList");this.byId("headSearch").setValue("");this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");l._valueHelpDialogProd.setTitleAlignment("Center");l._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oUniqList=this._oCore.byId(this._valueHelpDialogUniq.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();l.locModel.setData(e);l.oLocList.setModel(l.locModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}});this.getModel("BModel").read("/getLocProdDet",{success:function(e){},error:function(e,t){i.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._valueHelpDialogLoc.open()}else if(t.includes("prod")){l._valueHelpDialogProd.open()}else if(t.includes("Location")){l._valueHelpDialogLoc.open()}else if(t.includes("Product")){if(sap.ui.getCore().byId("idLocation").getValue()){l._valueHelpDialogProd.open()}else{i.show("Select Location")}}else if(t.includes("Uniq")){if(sap.ui.getCore().byId("idLocation").getValue()&&sap.ui.getCore().byId("idProduct").getValue()){l._valueHelpDialogUniq.open();this.getModel("BModel").read("/getUniqueHeader",{filters:[new o("LOCATION_ID",a.EQ,sap.ui.getCore().byId("idLocation").getValue()),new o("PRODUCT_ID",a.EQ,sap.ui.getCore().byId("idProduct").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();l.uniqModel.setData(e);l.oUniqList.setModel(l.uniqModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})}else{i.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(l.oLocList.getBinding("items")){l.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){l._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(l.oProdList.getBinding("items")){l.oProdList.getBinding("items").filter([])}}else if(t.includes("Uniq")){l._oCore.byId(this._valueHelpDialogUniq.getId()+"-searchField").setValue("");if(l.oUniqList.getBinding("items")){l.oUniqList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),s=[];t=t?t.trim():"";if(i.includes("Loc")){if(t!==""){s.push(new o({filters:[new o("LOCATION_ID",a.Contains,t),new o("UNIQUE_ID",a.EQ,t),new o("LOCATION_DESC",a.Contains,t)],and:false}))}l.oLocList.getBinding("items").filter(s)}else if(i.includes("prod")){if(t!==""){s.push(new o({filters:[new o("PRODUCT_ID",a.Contains,t),new o("UNIQUE_ID",a.EQ,t),new o("PROD_DESC",a.Contains,t)],and:false}))}l.oProdList.getBinding("items").filter(s)}else if(i.includes("Uniq")){if(t!==""){s.push(new o({filters:[new o("UNIQUE_ID",a.Contains,t),new o("UNIQUE_DESC",a.Contains,t)],and:false}))}l.oUniqList.getBinding("items").filter(s)}else if(i.includes("head")){if(t!==""){s.push(new o({filters:[new o("UNIQUE_ID",a.EQ,t),new o("SEED_ORDER",a.Contains,t)],and:false}))}l.oList.getBinding("items").filter(s)}},handleSelection:function(e){var t=e.getParameter("id"),s=e.getParameter("selectedItems"),d,r=l.oGModel.getProperty("/selFlag");if(t.includes("Loc")){var n=e.getParameter("selectedItems");if(r===""){this.oLoc=l.byId("idloc");this.oProd=l.byId("prodInput")}else if(r==="X"){this.oLoc=sap.ui.getCore().byId("idLocation");this.oProd=sap.ui.getCore().byId("idProduct")}l.oLoc.setValue(n[0].getTitle());l.oProd.setValue("");this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",a.EQ,n[0].getTitle())],success:function(e){l.prodModel.setData(e);l.oProdList.setModel(l.prodModel)},error:function(e,t){i.show("error")}})}else if(t.includes("prod")){var u=e.getParameter("selectedItems");if(r===""){this.oProd=l.byId("prodInput")}else if(r==="X"){this.oProd=sap.ui.getCore().byId("idProduct")}l.oProd.setValue(u[0].getTitle());sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getUniqueHeader",{filters:[new o("LOCATION_ID",a.EQ,sap.ui.getCore().byId("idLocation").getValue()),new o("PRODUCT_ID",a.EQ,sap.ui.getCore().byId("idProduct").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.UNIQUE_ID=e.UNIQUE_ID.toString()},l);l.uniqModel.setData(e);l.oUniqList.setModel(l.uniqModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})}else if(t.includes("Uniq")){var u=e.getParameter("selectedItems");this.oUniq=sap.ui.getCore().byId("idUniq");l.oUniq.setValue(u[0].getTitle())}l.handleClose(e)},onGetData:function(e){var t=l.byId("idloc").getValue(),s=l.byId("prodInput").getValue();l.oGModel.setProperty("/locationID",t);l.oGModel.setProperty("/productID",s);var d=[];if(t!==""){d.push(new o({filters:[new o("LOCATION_ID",a.EQ,t)],and:true}))}if(s!==""){d.push(new o({filters:[new o("PRODUCT_ID",a.EQ,s)],and:true}))}if(t!==""&&s!==""){this.getModel("BModel").read("/getSeedOrder",{filters:[d],success:function(e){if(e.results.length===0){l.byId("idSort").setVisible(false);l.oModel.setData([]);l.oList.setModel(l.oModel);sap.m.MessageToast.show("No Data available to show.")}else{e.results.forEach(function(e){e.ORD_QTY=parseFloat(e.ORD_QTY)},l);l.byId("idSort").setVisible(true);sap.ui.core.BusyIndicator.hide();l.oModel.setData({data:e.results});l.oList.setModel(l.oModel)}},error:function(){sap.ui.core.BusyIndicator.hide();i.show("Failed to get profiles")}})}else{i.show("Please select Location and Product")}},onResetDate:function(){l.byId("idloc").setValue("");l.byId("prodInput").setValue("");l.byId("idSort").setVisible(false);l.oModel.setData({results:l.TabData});l.oList.setModel(l.oModel)},onOrderCreate:function(){var e=l.byId("idloc").getValue(),t=l.byId("prodInput").getValue();if(e!==""&&t!==""){l._valueHelpDialogOrderCreate.open();l.oGModel.setProperty("/selFlag","X");l.oGModel.setProperty("/OrderFlag","C");l._valueHelpDialogOrderCreate.setTitle("Create Order");sap.ui.getCore().byId("idLocation").setValue(e);sap.ui.getCore().byId("idProduct").setValue(t)}else{i.show("Please select Location and Product")}},onEdit:function(e){l._valueHelpDialogOrderCreate.setTitle("Update Order");var t=e.getSource().getParent().getBindingContext().getObject();var i=t.MAT_AVAILDATE.toISOString().split("T")[0];l.oGModel.setProperty("/OrderFlag","E");sap.ui.getCore().byId("idLabelSeed").setVisible(true);sap.ui.getCore().byId("idseedord").setVisible(true);sap.ui.getCore().byId("idseedord").setEditable(false);sap.ui.getCore().byId("idLocation").setEditable(false);sap.ui.getCore().byId("idProduct").setEditable(false);sap.ui.getCore().byId("idUniq").setEditable(false);sap.ui.getCore().byId("idseedord").setValue(t.SEED_ORDER);sap.ui.getCore().byId("idLocation").setValue(t.LOCATION_ID);sap.ui.getCore().byId("idProduct").setValue(t.PRODUCT_ID);sap.ui.getCore().byId("idUniq").setValue(t.UNIQUE_ID);sap.ui.getCore().byId("idQuantity").setValue(t.ORD_QTY);sap.ui.getCore().byId("idDate").setValue(i);l._valueHelpDialogOrderCreate.open()},onCancelOrder:function(){sap.ui.getCore().byId("idLocation").setValue("");sap.ui.getCore().byId("idProduct").setValue("");sap.ui.getCore().byId("idUniq").setValue("");sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idDate").setValue("");l.oGModel.setProperty("/selFlag","");l.oGModel.setProperty("/OrderFlag","");sap.ui.getCore().byId("idLabelSeed").setVisible(false);sap.ui.getCore().byId("idseedord").setVisible(false);sap.ui.getCore().byId("idUniq").setEditable(true);sap.ui.getCore().byId("idQuantity").setValueState("None");l._valueHelpDialogOrderCreate.close()},onNumChange:function(){var e=sap.ui.getCore().byId("idQuantity").getValue();sap.ui.getCore().byId("idQuantity").setValueState("None");if(e<1){sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Can not be add 0 quantity")}if(e.includes(".")){sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Decimals not allowed")}},onSaveOrder:function(){var e=sap.ui.getCore().byId("idLocation").getValue(),t=sap.ui.getCore().byId("idProduct").getValue(),i=parseInt(sap.ui.getCore().byId("idUniq").getValue()),o=parseInt(sap.ui.getCore().byId("idQuantity").getValue()),a=sap.ui.getCore().byId("idDate").getValue(),s=sap.ui.getCore().byId("idseedord").getValue();var d={SEEDDATA:[]},r,n;var u=l.oGModel.getProperty("/OrderFlag");if(u==="C"){n="0"}else if(u==="E"){n=s}r={SEED_ORDER:n,LOCATION_ID:e,PRODUCT_ID:t,UNIQUE_ID:i,ORD_QTY:o,MAT_AVAILDATE:a};d.SEEDDATA.push(r);if(o!==""&&a!==""&&i!==""){if(sap.ui.getCore().byId("idQuantity").getValueState()!=="Error"){l.getModel("BModel").callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:u,SEEDDATA:JSON.stringify(d.SEEDDATA)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order created/ updated successfully");l.onCancelOrder();l.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error creating a Seed Order ")}})}else{sap.m.MessageToast.show("Decimals are not allowed")}}else{sap.m.MessageToast.show("Please fill all fields")}},handleSortButtonPressed:function(){l=this;if(!l._pDialog){l._pDialog=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.SortDialog",l);l.getView().addDependent(l._pDialog)}l._pDialog.open()},handleSortDialogConfirm:function(e){var t=this.byId("orderList"),i=e.getParameters(),o=t.getBinding("items"),a,s,r=[];a=i.sortItem.getKey();s=i.sortDescending;r.push(new d(a,s));o.sort(r)}})});
},
	"cpapp/cpseedordercreation/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpseedordercreation\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Seed Order Creation\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Seed Order Creation\n\n\n\nloc = Location\nprod=Product\nseedorder=Seed Order\nuniqid=Unique ID\nquan = Order Quantity\ndate=Material Avali. Date\ncust = Customer Group\n\n\nLoc=Location\nPrdId=Product\n\nsave=Save\nclose=Close\n\n\nUniqid=Unique ID',
	"cpapp/cpseedordercreation/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpseedordercreation","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.1","toolsId":"85278903-cd39-4ae9-89c2-451516baec68"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpseedordercreation.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpseedordercreation.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpseedordercreation.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpseedordercreation/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpseedordercreation/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpseedordercreation/view/App.view.xml":'<mvc:View controllerName="cpapp.cpseedordercreation.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpseedordercreation/view/CustomerGroup.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="CustGrp" title="Customer Group" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/item}"><StandardListItem title="{CUSTOMER_GROUP}" description="{CUSTOMER_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpseedordercreation/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpseedordercreation.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core" displayBlock="true"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    xmlns:ux="sap.uxap"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:html="http://www.w3.org/1999/xhtml"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>title}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>title}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox ><Label text=""/><SearchField id="headSearch" liveChange="handleSearch" placeholder="Unique ID/ Seed Order"/></VBox><VBox ><Label text="Location" required= "true"/><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="Product" required= "true"/><Input id="prodInput" placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox><Label text=""/><HBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd"/><Button text="Reset" type="Transparent" press="onResetDate" tooltip="Reset Valid To Date"/></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><Table id="orderList" items="{path: \'/data\'}" itemPress="onhandlePress" growingScrollToLoad="true" mode="SingleSelectMaster" selectionChange="onhandlePress" rememberSelections="false"><headerToolbar><Toolbar><content><ToolbarSpacer/><Button id="idCreate" type=\'Ghost\' text="Create Order" press="onOrderCreate"></Button><Button tooltip="Sort" icon="sap-icon://sort" press="handleSortButtonPressed" id="idSort" visible="false" type="Emphasized"/></content></Toolbar></headerToolbar><columns><Column hAlign="Left" vAlign="Middle" visible="false"><Text text="{i18n>loc}" /></Column><Column hAlign="Left" vAlign="Middle" visible="false"><Text text="{i18n>prod}"/></Column><Column hAlign="Left" vAlign="Middle" ><Text text="{i18n>seedorder}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>uniqid}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>quan}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>date}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text=""/></Column></columns><items><ColumnListItem><cells><Text text="{LOCATION_ID}" /><Text text="{PRODUCT_ID}"/><Text text="{SEED_ORDER}" /><Text text="{UNIQUE_ID}"/><Text text="{ORD_QTY}"/><Text text="{path: \'MAT_AVAILDATE\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'MM/dd/yyyy\' }}"/><Button id="idEdit"  icon="sap-icon://edit" press="onEdit" tooltip = "Edit Order" iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cpapp/cpseedordercreation/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpseedordercreation/view/OrderCreate.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\nxmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  title=""  contentWidth="450px" titleAlignment="Center"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4"\n\t\t\t\tlabelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label id="idLabelSeed" text="{i18n>seedorder}" visible="false"/><Input id="idseedord" value="" visible="false"/><Label text="{i18n>loc}"/><Input id="idLocation" value="" width="90%" editable="false" /><Label text="{i18n>prod}"/><Input id="idProduct" value="" width="90%" editable="false" /><Label text="{i18n>uniqid}"/><Input id="idUniq" value="" width="90%" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>quan}"/><Input id="idQuantity" value="" liveChange="onNumChange" width="90%" type="Number"/><Label text="{i18n>date}"/><DatePicker id="idDate"  value="" width="90%" valueFormat="yyyy-MM-dd" displayFormat="yyyy-MM-dd" change="handleDateChange"/></f:content></f:SimpleForm></VBox><buttons><Button type=\'Ghost\' text="{i18n>save}" press="onSaveOrder"></Button><Button type=\'Reject\' text="{i18n>close}" press="onCancelOrder"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpapp/cpseedordercreation/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="false"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpseedordercreation/view/SortDialog.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><ViewSettingsDialog\n\t\tconfirm="handleSortDialogConfirm"><sortItems><ViewSettingsItem text="Seed Order" key="SEED_ORDER" selected="true"/><ViewSettingsItem text="Unique Id" key="UNIQUE_ID" /><ViewSettingsItem text="Order Quantity" key="ORD_QTY" /><ViewSettingsItem text="Material Avail. Date" key="MAT_AVAILDATE" /></sortItems></ViewSettingsDialog></core:FragmentDefinition>',
	"cpapp/cpseedordercreation/view/UniqId.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="UniqSlctList" title="{i18n>Uniqid}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{UNIQUE_ID}" description="{UNIQUE_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
