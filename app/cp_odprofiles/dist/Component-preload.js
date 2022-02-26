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
	"cp/odp/cpodprofiles/controller/Home.controller.js":function(){sap.ui.define(["cp/odp/cpodprofiles/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,o,t,i,s,l,a,n){"use strict";var r,d;return e.extend("cp.odp.cpodprofiles.controller.Home",{onInit:function(){r=this;r.oListModel=new i;r.oProfileModel=new i;r.locModel=new i;r.prodModel=new i;r.CompModel=new i;r.ObjDepModel=new i;this.oListModel.setSizeLimit(5e3);r.locModel.setSizeLimit(1e3);r.prodModel.setSizeLimit(1e3);r.CompModel.setSizeLimit(1e3);r.ObjDepModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogComp){this._valueHelpDialogComp=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.ComponentDialog",this);this.getView().addDependent(this._valueHelpDialogComp)}if(!this._valueHelpDialogObjDep){this._valueHelpDialogObjDep=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.ObjDepDialog",this);this.getView().addDependent(this._valueHelpDialogObjDep)}this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this))},_onPatternMatched:function(){r=this;r.oList=this.byId("idTab");this.oLoc=this.byId("locInput");this.oProd=this.byId("prodInput");this.oComp=this.byId("compInput");this.oObjDep=this.byId("objDepInput");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oCompList=this._oCore.byId(this._valueHelpDialogComp.getId()+"-list");this.oObjDepList=this._oCore.byId(this._valueHelpDialogObjDep.getId()+"-list");r.oList.removeSelections();this.getData()},getData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){r.locModel.setData(e);r.oLocList.setModel(r.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){o.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){r._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(r.byId("idloc").getValue()){r._valueHelpDialogProd.open()}else{o.show("Select Location")}}else if(t.includes("comp")){if(r.byId("idloc").getValue()&&r.byId("prodInput").getTokens().length!==0){r._valueHelpDialogComp.open()}else{o.show("No Product Location selected")}}else if(t.includes("objDep")){if(r.byId("idloc").getValue()&&r.byId("prodInput").getTokens().length!==0){r._valueHelpDialogObjDep.open()}else{o.show("No Product Location selected")}}},handleClose:function(e){var o=e.getParameter("id");if(o.includes("loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(o.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(o.includes("comp")){r._oCore.byId(this._valueHelpDialogComp.getId()+"-searchField").setValue("");if(r.oCompList.getBinding("items")){r.oCompList.getBinding("items").filter([])}}else if(o.includes("press")){r._oCore.byId(this._valueHelpDialogObjDep.getId()+"-searchField").setValue("");if(r.oObjDepList.getBinding("items")){r.oObjDepList.getBinding("items").filter([])}}else if(o.includes("prod")){r._oCore.byId(this._valueHelpDialogObjDep.getId()+"-searchField").setValue("");if(r.oObjDepList.getBinding("items")){r.oObjDepList.getBinding("items").filter([])}}},handleSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=e.getParameter("id"),i=[];o=o?o.trim():"";if(t.includes("Loc")){if(o!==""){i.push(new s({filters:[new s("LOCATION_ID",l.Contains,o),new s("LOCATION_DESC",l.Contains,o)],and:false}))}r.oLocList.getBinding("items").filter(i)}else if(t.includes("prod")){if(o!==""){i.push(new s({filters:[new s("PRODUCT_ID",l.Contains,o),new s("PROD_DESC",l.Contains,o)],and:false}))}r.oProdList.getBinding("items").filter(i)}else if(t.includes("Comp")){if(o!==""){i.push(new s({filters:[new s("COMPONENT",l.Contains,o),new s("ITEM_NUM",l.Contains,o)],and:false}))}r.oCompList.getBinding("items").filter(i)}else if(t.includes("ObjDep")){if(o!==""){i.push(new s({filters:[new s("OBJ_DEP",l.Contains,o),new s("OBJDEP_DESC",l.Contains,o)],and:false}))}r.oObjDepList.getBinding("items").filter(i)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),a,n=[];if(t.includes("Loc")){this.oLoc=r.byId("idloc");a=e.getParameter("selectedItems");r.oLoc.setValue(a[0].getTitle());r.oProd.removeAllTokens();r.oComp.removeAllTokens();r.oObjDep.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogComp.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogObjDep.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new s("LOCATION_ID",l.EQ,a[0].getTitle())],success:function(e){r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,t){o.show("error")}})}else if(t.includes("prod")){this.oProd=r.byId("prodInput");a=e.getParameter("selectedItems");r.oComp.removeAllTokens();r.oObjDep.removeAllTokens();this._valueHelpDialogComp.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogObjDep.getAggregation("_dialog").getContent()[1].removeSelections();if(a&&a.length>0){r.oProd.removeAllTokens();a.forEach(function(e){r.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))});if(r.byId("idloc").getValue()&&r.byId("prodInput").getTokens().length!==0){var d=r.oProdList.getSelectedItems();var p=[];var g=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLoc.getValue()});p.push(g);for(var u=0;u<d.length;u++){g=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:d[u].getTitle()});p.push(g)}this.getModel("BModel").read("/getBomOdCond",{filters:p,success:function(e){r.odCondData=e.results;r.CompModel.setData(e);r.oCompList.setModel(r.CompModel)},error:function(e,t){o.show("error")}})}else{o.show("No Product Location selected")}}else{r.oProd.removeAllTokens()}}else if(t.includes("Comp")){this.oComp=r.byId("compInput");a=e.getParameter("selectedItems");if(a&&a.length>0){r.oComp.removeAllTokens();a.forEach(function(e){r.oComp.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))});if(r.byId("idloc").getValue()&&r.byId("prodInput").getTokens().length!==0){var d=r.oProdList.getSelectedItems();var c=r.oCompList.getSelectedItems();var p=[];var g=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLoc.getValue()});p.push(g);for(var u=0;u<d.length;u++){g=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:d[u].getTitle()});p.push(g)}for(var u=0;u<c.length;u++){g=new sap.ui.model.Filter({path:"COMPONENT",operator:sap.ui.model.FilterOperator.EQ,value1:c[u].getTitle()});p.push(g)}this.getModel("BModel").read("/getBomOdCond",{filters:p,success:function(e){r.ObjDepModel.setData(e);r.oObjDepList.setModel(r.ObjDepModel)},error:function(e,t){o.show("error")}})}else{o.show("No Product Location selected")}}else{r.oComp.removeAllTokens()}}else if(t.includes("ObjDep")){this.oObjDep=r.byId("objDepInput");a=e.getParameter("selectedItems");if(a&&a.length>0){r.oObjDep.removeAllTokens();a.forEach(function(e){r.oObjDep.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oObjDep.removeAllTokens()}}r.handleClose(e)},onGetData:function(){r.oList.removeSelections();if(r.byId("idloc").getValue()&&r.byId("prodInput").getTokens().length!==0){var e=r.oProdList.getSelectedItems();var t=r.oCompList.getSelectedItems();var i=r.oObjDepList.getSelectedItems();var s=[];var l=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLoc.getValue()});s.push(l);for(var a=0;a<e.length;a++){l=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:e[a].getTitle()});s.push(l)}for(var a=0;a<t.length;a++){l=new sap.ui.model.Filter({path:"COMPONENT",operator:sap.ui.model.FilterOperator.EQ,value1:t[a].getTitle()});s.push(l)}for(var a=0;a<i.length;a++){l=new sap.ui.model.Filter({path:"OBJ_DEP",operator:sap.ui.model.FilterOperator.EQ,value1:i[a].getTitle()});s.push(l)}this.getModel("BModel").read("/getODProfiles",{filters:s,success:function(e){r.oListModel.setData({results:e.results});r.oList.setModel(r.oListModel)},error:function(e,t){o.show("error")}})}else{o.show("Select all filter to get data")}},onAssign:function(){r.oGModel=r.getModel("oGModel");var e=r.byId("idTab").getSelectedItems();if(e.length){if(!r._onProfiles){r._onProfiles=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.Profiles",r);r.getView().addDependent(r._onProfiles)}r.oProfileList=sap.ui.getCore().byId("idListTab");r._onProfiles.setTitleAlignment("Center");this.getModel("BModel").read("/getProfiles",{success:function(o){r.oProfileModel.setData({results:o.results});r.oProfileList.setModel(r.oProfileModel);r._onProfiles.open();r.oGModel.setProperty("/selItem",e)},error:function(){o.show("Failed to get profiles")}})}else{o.show("Please select atleast one item to assign profile")}},handleProfileClose:function(){r.byId("idTab").removeSelections();r._onProfiles.close()},handleprofileSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=[];if(o!==""){t.push(new s({filters:[new s("PROFILE",l.Contains,o),new s("PRF_DESC",l.Contains,o)],and:false}))}r.oProfileList.getBinding("items").filter(t)},onTableSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=[];if(o!==""){t.push(new s({filters:[new s("LOCATION_ID",l.Contains,o),new s("PRODUCT_ID",l.Contains,o),new s("COMPONENT",l.Contains,o),new s("OBJ_DEP",l.Contains,o),new s("STRUC_NODE",l.Contains,o),new s("PROFILE",l.Contains,o)],and:false}))}r.oList.getBinding("items").filter(t)},onProfileSel:function(e){var o=r.oGModel.getProperty("/selItem"),t={PROFILEOD:[]},i,s=sap.ui.getCore().byId("idListTab").getSelectedItems()[0].getTitle();var l;for(var a=0;a<o.length;a++){l=o[a].getBindingContext().getProperty();i={LOCATION_ID:l.LOCATION_ID,PRODUCT_ID:l.PRODUCT_ID,COMPONENT:l.COMPONENT,OBJ_DEP:l.OBJ_DEP,STRUC_NODE:l.STRUC_NODE,PROFILE:s};t.PROFILEOD.push(i);i={}}var n="v2/catalog/genProfileOD";$.ajax({url:n,type:"POST",contentType:"application/json",data:JSON.stringify({FLAG:"I",PROFILEOD:t.PROFILEOD}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show("Error in assigning Profiles");sap.ui.core.BusyIndicator.hide();r.handleProfileClose()},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Profile assigned successfully");r.handleProfileClose();r.onGetData()}})},onUnAssign:function(){var e={PROFILEOD:[]},o;var t;var i=r.byId("idTab").getSelectedItems();for(var s=0;s<i.length;s++){t=i[s].getBindingContext().getProperty();o={LOCATION_ID:t.LOCATION_ID,PRODUCT_ID:t.PRODUCT_ID,COMPONENT:t.COMPONENT,OBJ_DEP:t.OBJ_DEP,PROFILE:t.PROFILE};e.PROFILEOD.push(o);o={}}var l="v2/catalog/genProfileOD";$.ajax({url:l,type:"POST",contentType:"application/json",data:JSON.stringify({FLAG:"D",PROFILEOD:e.PROFILEOD}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show("Error in unassigning Profiles");sap.ui.core.BusyIndicator.hide()},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Profile unassigned successfully");r.onGetData()}})}})});
},
	"cp/odp/cpodprofiles/i18n/i18n.properties":'# This is the resource bundle for cp.odp.cpodprofiles\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Assign Prediction Profiles\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Assign Prediction Profiles\n\nflpTitle=Assign Prediction Profiles\n\nflpSubtitle=Assign Prediction Profiles\n\nlocId = Location ID\nprdId = Product ID\ncomp = Component\nobjdep = Object Dep\nobjDesc = Object Dep. Description\n\nLoc = Location\nPrdId = Product\nstrucnode= Structure Node',
	"cp/odp/cpodprofiles/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.odp.cpodprofiles","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-odp-cpodprofiles-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"odprofileassign","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.odp.cpodprofiles.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.0","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.odp.cpodprofiles.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.odp.cpodprofiles.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/odp/cpodprofiles/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/odp/cpodprofiles/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var a=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function r(e,t){Object.keys(e).forEach(function(e){if(!a.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(a,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=r(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=r(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=r(e["sap.ui5"].componentUsages,n)}}a(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=scripts[scripts.length-1];var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/odp/cpodprofiles/view/App.view.xml":'<mvc:View controllerName="cp.odp.cpodprofiles.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/odp/cpodprofiles/view/ComponentDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="CompSlctList" title="Components" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true"  contentWidth="320px" items="{/results}" \n        selectionChange="handleCompChange" growing="false"><StandardListItem title="{COMPONENT}" description="{ITEM_NUM}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/odp/cpodprofiles/view/Home.view.xml":'<mvc:View controllerName="cp.odp.cpodprofiles.controller.Home"\n    xmlns:l="sap.ui.layout"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page id="page" title="{i18n>title}" titleAlignment="Center"><f:Form editable="true"><f:layout><f:ResponsiveGridLayout labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" \n                            adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" \n                            columnsXL="4" columnsL="2" columnsM="2" singleContainerFullSize="false"\n                            breakpointXL= "1400" breakpointL= "800" breakpointM="600" /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="Location"/></f:label><f:fields><Input id="idloc" value="" width="225px" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="Component"/></f:label><f:fields><MultiInput id="compInput" placeholder="Component" showValueHelp="true" valueHelpOnly="true"\n                                        valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="Product"/></f:label><f:fields><MultiInput id="prodInput" placeholder="Product" showValueHelp="true" valueHelpOnly="true"\n                                        valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="Object Dep"/></f:label><f:fields><MultiInput id="objDepInput" placeholder="Object Dep" showValueHelp="true" valueHelpOnly="true"\n                                        valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><Button text="Go" width="30%" press="onGetData" tooltip="Get data based on filters"/></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><content><Table id="idTab" items="{path: \'/results\'}" mode="MultiSelect" sticky="ColumnHeaders" ><headerToolbar><Toolbar><content><SearchField id="idSearch" placeholder="Location/ Product/ Component/ Object Dep"  \n                        liveChange="onTableSearch" width="600px"/><ToolbarSpacer/><Button id="idAssign" type=\'Ghost\' text="Assign" press="onAssign"></Button><Button id="idUnAssign" type=\'Ghost\' text="UnAssign" press="onUnAssign"></Button></content></Toolbar></headerToolbar><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>locId}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>prdId}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>comp}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>objdep}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>objDesc}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>strucnode}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="Profile"/></Column></columns><items><ColumnListItem><Text text="{LOCATION_ID}"/><Text text="{PRODUCT_ID}"/><Text text="{COMPONENT}"/><Text text="{OBJ_DEP}"/><Text text="{OBJDEP_DESC}"/><Text text="{STRUC_NODE}"/><Text text="{PROFILE}"/></ColumnListItem></items></Table></content></Page></mvc:View>\n',
	"cp/odp/cpodprofiles/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/odp/cpodprofiles/view/ObjDepDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="ObjDepSlctList" title="Object Dependency" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true"  contentWidth="320px" items="{/results}" \n        selectionChange="handleObjDepChange" growing="false"><StandardListItem title="{OBJ_DEP}" description="{OBJDEP_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/odp/cpodprofiles/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/odp/cpodprofiles/view/Profiles.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><Dialog id="idList" title="Assign Profile" contentWidth="350px"><content><SearchField width="100%"  liveChange="handleprofileSearch"/><List id="idListTab" items="{/results}" mode="SingleSelectMaster" ><ObjectListItem title="{PROFILE}"  type="Active"><attributes><ObjectAttribute text="{PRF_DESC}"/></attributes></ObjectListItem></List></content><beginButton><Button text="Assign Profile" press="onProfileSel" type="Emphasized"/></beginButton><endButton><Button text="Cancel" press="handleProfileClose" type="Emphasized"/></endButton></Dialog></core:FragmentDefinition>'
}});
