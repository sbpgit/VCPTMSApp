//@ui5-bundle cp/execpred/cpexecprediction/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/execpred/cpexecprediction/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/execpred/cpexecprediction/model/models"],function(e,i,t){"use strict";return e.extend("cp.execpred.cpexecprediction.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cp/execpred/cpexecprediction/controller/App.controller.js":function(){sap.ui.define(["cp/execpred/cpexecprediction/controller/BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("cp.execpred.cpexecprediction.controller.App",{onInit:function(){var e,r,n=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");r=function(){e.setProperty("/busy",false);e.setProperty("/delay",n)}}})});
},
	"cp/execpred/cpexecprediction/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.execpred.cpexecprediction.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},addHistoryEntry:function(){var e=[];return function(t,n){if(n){e=[]}var r=e.some(function(e){return e.intent===t.intent});if(!r){e.push(t);this.getOwnerComponent().getService("ShellUIService").then(function(t){t.setHierarchy(e)})}}}()})});
},
	"cp/execpred/cpexecprediction/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cp/execpred/cpexecprediction/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,i,o,s,l,n){"use strict";var a,d;return t.extend("cp.execpred.cpexecprediction.controller.Home",{onInit:function(){this.locModel=new i;this.prodModel=new i;this.odModel=new i;this.ppfModel=new i;this.otabModel=new i;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogOD){this._valueHelpDialogOD=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ObjDepDialog",this);this.getView().addDependent(this._valueHelpDialogOD)}if(!this._valueHelpDialogPPF){this._valueHelpDialogPPF=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.PredProfileDialog",this);this.getView().addDependent(this._valueHelpDialogPPF)}this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this))},_onPatternMatched:function(){d=this;this.oPanel=this.byId("idPanel");this.oTable=this.byId("pmdlList");this.i18n=this.getResourceBundle();this.oGModel=this.getModel("GModel");this.oLoc=this.byId("locInput");this.oProd=this.byId("prodInput");this.oObjDep=this.byId("odInput");this.oPredProfile=this.byId("pmInput");this.aVcRulesList=[];this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oODList=this._oCore.byId(this._valueHelpDialogOD.getId()+"-list");this.oPPFList=this._oCore.byId(this._valueHelpDialogPPF.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel)},error:function(e,t){l.show("error")}});this.getModel("BModel").read("/getProducts",{success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){l.show("error")}});this.getModel("BModel").callFunction("/get_objdep",{method:"GET",urlParameters:{},success:function(e){d.odModel.setData(e);d.oODList.setModel(d.odModel)},error:function(e){l.show("error")}});this.getModel("BModel").read("/getProfiles",{success:function(e){d.ppfModel.setData(e);d.oPPFList.setModel(d.ppfModel)},error:function(e,t){l.show("error")}})},onRun:function(){this.oModel=this.getModel("PModel");var e=[];var t={vcRulesList:[]};var i={Location:"FR10",Product:"KM_M219VBVS_BVS",GroupID:"M219VV00105NN_1"};t.vcRulesList.push(i);var o="/v2/pal/generatePredictions";$.ajax({url:o,type:"post",contentType:"application/json",data:JSON.stringify({vcRulesList:t.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(JSON.stringify(e))},success:function(e){sap.m.MessageToast.show("Generated Regression Models")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){this._valueHelpDialogLoc.open()}else if(t.includes("prod")){this._valueHelpDialogProd.open()}else if(t.includes("od")){if(d.oLoc.getValue()&&d.oProd.getTokens()){if(this.oODList.getBinding("items")){this.oODList.getBinding("items").filter([new o("LOCATION_ID",s.Contains,d.oLocList.getSelectedItem().getTitle()),new o("PRODUCT_ID",s.Contains,"KM_M219VBVS_BVS")])}this._valueHelpDialogOD.open()}else{l.show(d.i18n.getText("noLocProd"))}}else{this._valueHelpDialogPPF.open()}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}else if(t.includes("od")){d._oCore.byId(this._valueHelpDialogOD.getId()+"-searchField").setValue("");if(d.oODList.getBinding("items")){d.oODList.getBinding("items").filter([])}}else{d._oCore.byId(this._valueHelpDialogPPF.getId()+"-searchField").setValue("");if(d.oPPFList.getBinding("items")){d.oPPFList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),l=[];t=t?t.trim():"";if(i.includes("loc")){if(t!==""){l.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("LOCATION_DESC",s.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(l)}else if(i.includes("prod")){if(t!==""){l.push(new o({filters:[new o("PRODUCT_ID",s.Contains,t),new o("PROD_DESC",s.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(l)}else if(i.includes("od")){if(t!==""){l.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("PRODUCT_ID",s.Contains,t),new o("COMPONENT",s.Contains,t),new o("OBJ_DEP",s.Contains,t)],and:false}))}d.oODList.getBinding("items").filter(l)}else{if(t!==""){l.push(new o({filters:[new o("PROFILE",s.Contains,t),new o("METHOD",s.Contains,t),new o("PRF_DESC",s.Contains,t)],and:false}))}d.oPPFList.getBinding("items").filter(l)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),o;if(t.includes("Loc")){o=e.getParameter("selectedItems");d.oLoc.setValue(o[0].getTitle())}else if(t.includes("prod")){d.oProdList.getBinding("items").filter([]);o=e.getParameter("selectedItems");if(o&&o.length>0){d.oProd.removeAllTokens();o.forEach(function(e){d.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}}else if(t.includes("od")){d.oODList.getBinding("items").filter([]);o=e.getParameter("selectedItems");if(o&&o.length>0){d.oObjDep.removeAllTokens();o.forEach(function(e){d.oObjDep.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}}else{d.oPPFList.getBinding("items").filter([]);o=e.getParameter("selectedItems");if(o&&o.length>0){o.forEach(function(e){d.oPredProfile.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}}d.handleClose(e)},handleTokenUpdate:function(e){var t=e.getSource().getId(),i=e.getParameter("removedTokens"),o,s,l;if(i){o=i[0].getProperty("key")}else{o=e.getParameter("item").getName()}if(t.includes("prod")){s=d.oProdList.getSelectedItems();for(l=0;l<s.length;l++){if(s[l].getTitle()===o){s[l].setSelected(false)}}}else if(t.includes("od")){s=d.oProdList.getSelectedItems();for(l=0;l<s.length;l++){if(s[l].getTitle()===o){s[l].setSelected(false)}}}else if(t.includes("pmInput")){s=d.oProdList.getSelectedItems();for(l=0;l<s.length;l++){if(s[l].getTitle()===o){s[l].setSelected(false)}}}},onRun2:function(){this.oModel=this.getModel("PModel");var e,t,i=[],o;e=this.oODList.getSelectedItems();d.byId("pmdlList").setModel(this.otabModel);if(this.oObjDep.getTokens().length>0&&this.oPredProfile.getTokens().length>0){for(t=0;t<e.length;t++){var s={vcRulesList:[]},n;n={Location:e[t].getInfo(),Product:e[t].getDescription(),GroupID:e[t].getTitle()};s.vcRulesList.push(n);var a="/v2/pal/generatePredictions";$.ajax({url:a,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:s.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(d.i18n.getText("genPredErr"))},success:function(e){sap.m.MessageToast.show(d.i18n.getText("genPredSuccess"));i.push(e.d.values[0].vcRulesList[0]);d.otabModel.setData({results:i});d.oPanel.setProperty("visible",true);o="X"}})}if(o==="X"){d.resetInputs()}}else{l.show(d.i18n.getText("errInput"))}},resetInputs:function(){this.oLoc.setValue("");this.oObjDep.destroyTokens();this.oLocList.removeSelections();this.oODList.removeSelections();this.oPredProfile.destroyTokens();this.oPPFList.removeSelections();this.oProd.destroyTokens();this.oProdList.removeSelections()}})});
},
	"cp/execpred/cpexecprediction/i18n/i18n.properties":'title=Title\nappTitle=Home\nappDescription=App Description\n\nflpTitle=Run Predictions\nflpSubtitle=\n\nfilterPanel=Run Prediction Models \nloc=Location\nprod=Product\ndim=Dimensions\nobjdep= Object Dependency\npredmodel=Prediction Models \npredpf=Prediction Profile\nRun= Run Prediction Model\nnoLocProd= Please select a Location-Product \nnoInput= Please provide required inputs\ntimestamp= Created on \naddEntry= Add \ngenPredSuccess= Generated predictions successfully\ngenPredErr =  Error while generating predictions\nerrInput=Please provide required inputs',
	"cp/execpred/cpexecprediction/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.execpred.cpexecprediction","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","dataSources":{"mainService":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"CatalogService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/CatalogService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-execpred-cpexecprediction-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"executeprediction","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"cp.execpred.cpexecprediction.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.1","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.execpred.cpexecprediction.i18n.i18n"}},"PModel":{"dataSource":"mainService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}},"BModel":{"dataSource":"CatalogService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}},"GModel":{"type":"sap.ui.model.json.JSONModel","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.execpred.cpexecprediction.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","viewLevel":1,"viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/execpred/cpexecprediction/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/execpred/cpexecprediction/view/App.view.xml":'<mvc:View controllerName="cp.execpred.cpexecprediction.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><Shell id="shell"><App id="app"><pages></pages></App></Shell></mvc:View>',
	"cp/execpred/cpexecprediction/view/Home.view.xml":'<mvc:View\n    controllerName="cp.execpred.cpexecprediction.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    displayBlock="true"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout" \n    xmlns:f="sap.ui.layout.form"\n    xmlns:u="sap.ui.unified"\n><Page title="Run Predictions"><customHeader><OverflowToolbar><Text text="" width="30%"/><ToolbarSpacer/><Title text="Run Predictions"/><ToolbarSpacer/><Text text="" width="40%"/></OverflowToolbar></customHeader><content><Panel id="filterPanel"  expandable="true" expanded="true"><headerToolbar><OverflowToolbar><Title text="{i18n>filterPanel}"/></OverflowToolbar></headerToolbar><f:Form editable="true"><f:layout><f:ResponsiveGridLayout \n                    labelSpanXL="3" \n                    labelSpanL="3" \n                    labelSpanM="3" \n                    labelSpanS="12"\n                    adjustLabelSpan="false" \n                    emptySpanXL="0" \n                    emptySpanL="0" \n                    emptySpanM="0" \n                    emptySpanS="0"\n                    columnsXL="2" \n                    columnsL="2" \n                    columnsM="2" \n                    singleContainerFullSize="false" /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="{i18n>loc}" required="true"/></f:label><f:fields><Input id="locInput" placeholder="{i18n>loc}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>prod}" required="true"/></f:label><f:fields><MultiInput id="prodInput" placeholder="{i18n>prod}" showValueHelp="true" valueHelpOnly="true"\n                                valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>objdep}" required="true"/></f:label><f:fields><MultiInput id="odInput" placeholder="{i18n>objdep}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"\n                                tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>predpf}" /></f:label><f:fields><MultiInput id="pmInput" placeholder="{i18n>predpf}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"\n                                tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer><f:formElements><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:fields><Button type="Emphasized" text="{i18n>Run}" press="onRun2" width="50%"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></Panel><Panel id="idPanel" visible="false"><Table id="pmdlList" headerText="{i18n>predmodel}"  items="{/results}"  selectionChange="handlepredSelect"><headerToolbar><OverflowToolbar><Title text="{i18n>predmodel}"/><ToolbarSpacer/></OverflowToolbar></headerToolbar><columns><Column><Text text="{i18n>loc}"/></Column><Column><Text text="{i18n>prod}"/></Column><Column><Text text="{i18n>objdep}"/></Column><Column><Text text="{i18n>dim}"/></Column></columns><items><ColumnListItem vAlign="Middle"><cells><Text text="{Location}"/><Text text="{Product}"/><Text text="{GroupID}"/><ObjectStatus\n                    class="sapUiSmallMarginBottom"\n                    text="{dimensions}"\n                    icon="sap-icon://sys-enter-2"\n                    state="Success" /></cells></ColumnListItem></items></Table></Panel></content></Page></mvc:View>\n',
	"cp/execpred/cpexecprediction/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="true"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/execpred/cpexecprediction/view/ObjDepDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="odSlctList" title="{i18n>objdep}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="500px" items="{/results}" growing="false"><StandardListItem title="{OBJ_DEP}_{OBJ_COUNTER}" description="{PRODUCT_ID}" info="{LOCATION_ID}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/execpred/cpexecprediction/view/PredProfileDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="ppfSlctList" title="{i18n>objdep}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="320px" items="{/results}" growing="false"><StandardListItem title="{PROFILE}" description="{PRF_DESC}" info="{METHOD}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/execpred/cpexecprediction/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>prod}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="320px" items="{/results}" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
