//@ui5-bundle cp/odp/cpodprofiles/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/odp/cpodprofiles/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/odp/cpodprofiles/model/models"],function(e,i,t){"use strict";return e.extend("cp.odp.cpodprofiles.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cp/odp/cpodprofiles/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.odp.cpodprofiles.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cp/odp/cpodprofiles/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.odp.cpodprofiles.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cp/odp/cpodprofiles/controller/Home.controller.js":function(){sap.ui.define(["cp/odp/cpodprofiles/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,o,t,a,s,l,i,r){"use strict";var n,d;return e.extend("cp.odp.cpodprofiles.controller.Home",{onInit:function(){n=this;n.oListModel=new a;n.oProfileModel=new a;n.oLocModel=new a;n.oProdModel=new a;n.oCompModel=new a;n.oObjDepModel=new a;this.oListModel.setSizeLimit(5e3);n.oLocModel.setSizeLimit(1e3);n.oProdModel.setSizeLimit(1e3);n.oCompModel.setSizeLimit(1e3);n.oObjDepModel.setSizeLimit(1e3)},onAfterRendering:function(){n=this;n.oList=this.byId("idTab");n.oMcLoc=this.byId("idLoc");n.oMcProd=this.byId("idProd");n.oMcComp=this.byId("idComp");n.oMcObjDep=this.byId("idObjDep");n.oList.removeSelections();this.getData()},getData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getODProfiles",{method:"GET",urlParameters:{},success:function(e){n.aLocation=[];n.aProduct=[];n.aComponent=[];n.aObjDep=[];n.SelLoc=[];n.SelProd=[];n.SelComp=[];n.SelObjDep=[];var o=[],t=[],a=[],s=[];n.TableData=e.results;for(var l=0;l<e.results.length;l++){if(n.aLocation.indexOf(e.results[l].LOCATION_ID)===-1){n.aLocation.push(e.results[l].LOCATION_ID);if(e.results[l].LOCATION_ID!==""){n.oLocData={LOCATION_ID:e.results[l].LOCATION_ID};n.SelLoc.push(n.oLocData);o[l]=n.oLocData.LOCATION_ID}}if(n.aProduct.indexOf(e.results[l].PRODUCT_ID)===-1){n.aProduct.push(e.results[l].PRODUCT_ID);if(e.results[l].PRODUCT_ID!==""){n.oProdData={PRODUCT_ID:e.results[l].PRODUCT_ID};n.SelProd.push(n.oProdData);t[l]=n.oProdData.PRODUCT_ID}}if(n.aComponent.indexOf(e.results[l].COMPONENT)===-1){n.aComponent.push(e.results[l].COMPONENT);if(e.results[l].COMPONENT!==""){n.oCompData={COMPONENT:e.results[l].COMPONENT};n.SelComp.push(n.oCompData);a[l]=n.oCompData.COMPONENT}}if(n.aObjDep.indexOf(e.results[l].OBJ_DEP)===-1){n.aObjDep.push(e.results[l].OBJ_DEP);if(e.results[l].OBJ_DEP!==""){n.oObjDepData={OBJ_DEP:e.results[l].OBJ_DEP};n.SelObjDep.push(n.oObjDepData);s[l]=n.oObjDepData.OBJ_DEP}}}n.oListModel.setData({results:e.results});n.oList.setModel(n.oListModel);n.oLocModel.setData({resultsLoc:n.SelLoc});n.oProdModel.setData({resultsProd:n.SelProd});n.oCompModel.setData({resultsComp:n.SelComp});n.oObjDepModel.setData({resultsObjDep:n.SelObjDep});n.oMcLoc.setModel(n.oLocModel);n.oMcProd.setModel(n.oProdModel);n.oMcComp.setModel(n.oCompModel);n.oMcObjDep.setModel(n.oObjDepModel);n.oMcLoc.setSelectedKeys(n.aLocation);n.oMcProd.setSelectedKeys(n.aProduct);n.oMcComp.setSelectedKeys(n.aComponent);n.oMcObjDep.setSelectedKeys(n.aObjDep);sap.ui.core.BusyIndicator.hide()},error:function(e){o.show("error")}})},onAssign:function(){n.oGModel=n.getModel("oGModel");var e=n.byId("idTab").getSelectedItems();if(e.length){if(!n._onProfiles){n._onProfiles=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.Profiles",n);n.getView().addDependent(n._onProfiles)}n.oProfileList=sap.ui.getCore().byId("idListTab");n._onProfiles.setTitleAlignment("Center");this.getModel("BModel").read("/getProfiles",{success:function(o){n.oProfileModel.setData({results:o.results});n.oProfileList.setModel(n.oProfileModel);n._onProfiles.open();n.oGModel.setProperty("/selItem",e)},error:function(){o.show("Failed to get profiles")}})}else{o.show("Please select atleast one item to assign profile")}},handleClose:function(){n.byId("idTab").removeSelections();n._onProfiles.close()},handleSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=[];if(o!==""){t.push(new s({filters:[new s("PROFILE",l.Contains,o),new s("PRF_DESC",l.Contains,o)],and:false}))}n.oProfileList.getBinding("items").filter(t)},onTableSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=[];if(o!==""){t.push(new s({filters:[new s("LOCATION_ID",l.Contains,o),new s("PRODUCT_ID",l.Contains,o),new s("COMPONENT",l.Contains,o),new s("OBJ_DEP",l.Contains,o),new s("PROFILE",l.Contains,o)],and:false}))}n.oList.getBinding("items").filter(t)},handLocChg:function(){var e=n.getView().byId("idLoc").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].LOCATION_ID===e[l]){s.push(n.TableData[i]);if(t.indexOf(n.TableData[i].COMPONENT)===-1){t.push(n.TableData[i].COMPONENT)}if(o.indexOf(n.TableData[i].PRODUCT_ID)===-1){o.push(n.TableData[i].PRODUCT_ID)}if(a.indexOf(n.TableData[i].OBJ_DEP)===-1){a.push(n.TableData[i].OBJ_DEP)}}}}n.oListModel.setData({results:s});n.oMcComp.setSelectedKeys(t);n.oMcProd.setSelectedKeys(o);n.oMcObjDep.setSelectedKeys(a)},handProdChg:function(){var e=n.getView().byId("idProd").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].PRODUCT_ID===e[l]){s.push(n.TableData[i]);if(o.indexOf(n.TableData[i].LOCATION_ID)===-1){o.push(n.TableData[i].LOCATION_ID)}if(t.indexOf(n.TableData[i].COMPONENT)===-1){t.push(n.TableData[i].COMPONENT)}if(a.indexOf(n.TableData[i].OBJ_DEP)===-1){a.push(n.TableData[i].OBJ_DEP)}}}}n.oListModel.setData({results:s});n.oMcLoc.setSelectedKeys(o);n.oMcComp.setSelectedKeys(t);n.oMcObjDep.setSelectedKeys(a)},handCompChg:function(){var e=n.getView().byId("idComp").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].COMPONENT===e[l]){s.push(n.TableData[i]);if(o.indexOf(n.TableData[i].LOCATION_ID)===-1){o.push(n.TableData[i].LOCATION_ID)}if(t.indexOf(n.TableData[i].PRODUCT_ID)===-1){t.push(n.TableData[i].PRODUCT_ID)}if(a.indexOf(n.TableData[i].OBJ_DEP)===-1){a.push(n.TableData[i].OBJ_DEP)}}}}n.oListModel.setData({results:s});n.oMcLoc.setSelectedKeys(o);n.oMcProd.setSelectedKeys(t);n.oMcObjDep.setSelectedKeys(a)},handObjDepChg:function(){var e=n.getView().byId("idObjDep").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].OBJ_DEP===e[l]){s.push(n.TableData[i]);if(o.indexOf(n.TableData[i].LOCATION_ID)===-1){o.push(n.TableData[i].LOCATION_ID)}if(t.indexOf(n.TableData[i].PRODUCT_ID)===-1){t.push(n.TableData[i].PRODUCT_ID)}if(a.indexOf(n.TableData[i].COMPONENT)===-1){a.push(n.TableData[i].COMPONENT)}}}}n.oListModel.setData({results:s});n.oMcLoc.setSelectedKeys(o);n.oMcProd.setSelectedKeys(t);n.oMcComp.setSelectedKeys(a)},onProfileSel:function(e){var o=n.oGModel.getProperty("/selItem"),t={PROFILEOD:[]},a,s=sap.ui.getCore().byId("idListTab").getSelectedItems()[0].getTitle();var l;for(var i=0;i<o.length;i++){l=o[i].getBindingContext().getProperty();a={LOCATION_ID:l.LOCATION_ID,PRODUCT_ID:l.PRODUCT_ID,COMPONENT:l.COMPONENT,OBJ_DEP:l.OBJ_DEP,PROFILE:s};t.PROFILEOD.push(a);a={}}var r={csrfToken:""};var d=new sap.ui.model.json.JSONModel(r);sap.ui.getCore().setModel(d,"oToken");var D=sap.ui.getCore().getModel("oToken").getData();var O="/v2/catalog/genProfileOD";$.ajax({url:"/v2/catalog/getLocation",type:"GET",headers:{ContentType:"application/json",Accept:"application/json",cache:true,"X-CSRF-Token":"fetch"},success:function(e,o,a){D["csrfToken"]=a.getResponseHeader("X-Csrf-Token");r=D["csrfToken"];$.ajax({url:O,type:"POST",contentType:"application/json",headers:{"X-CSRF-Token":r},data:JSON.stringify({FLAG:"I",PROFILEOD:t.PROFILEOD}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show("Error in assigning Profiles");sap.ui.core.BusyIndicator.hide();n.handleClose()},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Profile assigned successfully");n.handleClose();n.onAfterRendering()}})},error:function(e){sap.m.MessageToast.show("Error in assigning Profiles")}})}})});
},
	"cp/odp/cpodprofiles/i18n/i18n.properties":'# This is the resource bundle for cp.odp.cpodprofiles\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Assign Prediction Profiles\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Assign Prediction Profiles\n\nflpTitle=Assign Prediction Profiles\n\nflpSubtitle=Assign Prediction Profiles\n\nlocId = Location ID\nprdId = Product ID\ncomp = Component\nobjdep = Object Dep\nobjDesc = Object Dep. Description',
	"cp/odp/cpodprofiles/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.odp.cpodprofiles","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-odp-cpodprofiles-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"odprofileassign","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.odp.cpodprofiles.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.0","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.odp.cpodprofiles.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.odp.cpodprofiles.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/odp/cpodprofiles/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/odp/cpodprofiles/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var a=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function r(e,t){Object.keys(e).forEach(function(e){if(!a.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(a,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=r(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=r(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=r(e["sap.ui5"].componentUsages,n)}}a(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=scripts[scripts.length-1];var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/odp/cpodprofiles/view/App.view.xml":'<mvc:View controllerName="cp.odp.cpodprofiles.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/odp/cpodprofiles/view/Home.view.xml":'<mvc:View controllerName="cp.odp.cpodprofiles.controller.Home"\n    xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page id="page" title="{i18n>title}" titleAlignment="Center"><Toolbar height="15%"><f:Form editable="true"><f:layout><f:ResponsiveGridLayout labelSpanXL="3" labelSpanL="3" labelSpanM="4" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="2" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="Location"/></f:label><MultiComboBox id=\'idLoc\' selectionChange="handLocChg"  width="250px" \n                                items="{ path: \'/resultsLoc\' }"><core:Item key="{LOCATION_ID}" text="{LOCATION_ID}" /></MultiComboBox></f:FormElement><f:FormElement><f:label><Label text="Product"/></f:label><MultiComboBox id=\'idProd\' selectionChange="handProdChg"  width="300px" \n                                items="{ path: \'/resultsProd\' }"><core:Item key="{PRODUCT_ID}" text="{PRODUCT_ID}" /></MultiComboBox></f:FormElement></f:formElements></f:FormContainer><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="Component"/></f:label><MultiComboBox id=\'idComp\' selectionChange="handCompChg"  width="300px" \n                                items="{ path: \'/resultsComp\' }"><core:Item key="{COMPONENT}" text="{COMPONENT}" /></MultiComboBox></f:FormElement><f:FormElement><f:label><Label text="Object Dep"/></f:label><MultiComboBox id=\'idObjDep\' selectionChange="handObjDepChg"  width="300px" \n                                items="{ path: \'/resultsObjDep\' }"><core:Item key="{OBJ_DEP}" text="{OBJ_DEP}" /></MultiComboBox></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></Toolbar><content><Table id="idTab" items="{path: \'/results\'}" mode="MultiSelect" sticky="ColumnHeaders" ><headerToolbar><Toolbar><content><SearchField id="idSearch" placeholder="Location/ Product/ Component/ Object Dep"  \n                        liveChange="onTableSearch" width="600px"/><ToolbarSpacer/><Button id="idAssign" type=\'Ghost\' text="Assign" press="onAssign"></Button></content></Toolbar></headerToolbar><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>locId}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>prdId}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>comp}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>objdep}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>objDesc}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="Profile"/></Column></columns><items><ColumnListItem><Text text="{LOCATION_ID}"/><Text text="{PRODUCT_ID}"/><Text text="{COMPONENT}"/><Text text="{OBJ_DEP}"/><Text text="{OBJDEP_DESC}"/><Text text="{PROFILE}"/></ColumnListItem></items></Table></content></Page></mvc:View>\n',
	"cp/odp/cpodprofiles/view/Profiles.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><Dialog id="idList" title="Assign Profile" contentWidth="350px"><content><SearchField width="100%"  liveChange="handleSearch"/><List id="idListTab" items="{/results}" mode="SingleSelectMaster" ><ObjectListItem title="{PROFILE}"  type="Active"><attributes><ObjectAttribute text="{PRF_DESC}"/></attributes></ObjectListItem></List></content><beginButton><Button text="Assign Profile" press="onProfileSel" type="Emphasized"/></beginButton><endButton><Button text="Cancel" press="handleClose" type="Emphasized"/></endButton></Dialog></core:FragmentDefinition>'
}});
