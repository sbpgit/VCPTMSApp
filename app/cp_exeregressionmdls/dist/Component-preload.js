//@ui5-bundle cp/exereg/cpexeregressionmdls/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/exereg/cpexeregressionmdls/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/exereg/cpexeregressionmdls/model/models"],function(e,i,t){"use strict";return e.extend("cp.exereg.cpexeregressionmdls.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cp/exereg/cpexeregressionmdls/controller/App.controller.js":function(){sap.ui.define(["cp/exereg/cpexeregressionmdls/controller/BaseController","sap/ui/model/json/JSONModel"],function(e,r){"use strict";return e.extend("cp.exereg.cpexeregressionmdls.controller.App",{onInit:function(){var e,t,s=this.getView().getBusyIndicatorDelay();e=new r({busy:true,delay:0});this.setModel(e,"appView");t=function(){e.setProperty("/busy",false);e.setProperty("/delay",s)}}})});
},
	"cp/exereg/cpexeregressionmdls/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.exereg.cpexeregressionmdls.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},addHistoryEntry:function(){var e=[];return function(t,n){if(n){e=[]}var r=e.some(function(e){return e.intent===t.intent});if(!r){e.push(t);this.getOwnerComponent().getService("ShellUIService").then(function(t){t.setHierarchy(e)})}}}()})});
},
	"cp/exereg/cpexeregressionmdls/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cp/exereg/cpexeregressionmdls/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,i,s,o,l,n){"use strict";var a,r;return t.extend("cp.exereg.cpexeregressionmdls.controller.Home",{onInit:function(){this.locModel=new i;this.prodModel=new i;this.odModel=new i;this.ppfModel=new i;this.otabModel=new i;this.prodModel.setSizeLimit(5e3);this.odModel.setSizeLimit(5e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogOD){this._valueHelpDialogOD=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.ObjDepDialog",this);this.getView().addDependent(this._valueHelpDialogOD)}if(!this._valueHelpDialogPPF){this._valueHelpDialogPPF=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.PredDialog",this);this.getView().addDependent(this._valueHelpDialogPPF)}this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this))},_onPatternMatched:function(){r=this;this.oPanel=this.byId("idPanel");this.oTable=this.byId("rmdlList");this.i18n=this.getResourceBundle();this.oGModel=this.getModel("GModel");this.oLoc=this.byId("locInput");this.oProd=this.byId("prodInput");this.oObjDep=this.byId("odInput");this.oPredProfile=this.byId("pmInput");this.aVcRulesList=[];this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oODList=this._oCore.byId(this._valueHelpDialogOD.getId()+"-list");this.oPPFList=this._oCore.byId(this._valueHelpDialogPPF.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){r.locModel.setData(e);r.oLocList.setModel(r.locModel)},error:function(e,t){l.show("error")}});this.getModel("BModel").read("/getProducts",{success:function(e){e.results.unshift({PRODUCT_ID:"All",PROD_DESC:"All"});r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,t){l.show("error")}});this.getModel("BModel").callFunction("/get_objdep",{method:"GET",urlParameters:{},success:function(e){e.results.unshift({OBJ_DEP:"All",LOCATION_ID:"",PRODUCT_ID:""});r.odModel.setData(e);r.oODList.setModel(r.odModel)},error:function(e){l.show("error")}});this.getModel("BModel").read("/getProfiles",{success:function(e){r.ppfModel.setData(e);r.oPPFList.setModel(r.ppfModel)},error:function(e,t){l.show("error")}})},onRun2:function(){var e=r.byId("idCheck").getSelected();var t="Do you want to override assignments?";if(e===true){sap.m.MessageBox.show(t,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){r.onRunSend()}}})}else{r.onRunSend()}},onRunSend:function(){this.oModel=this.getModel("PModel");var e,t,i,s,o,n=[],a;var d={vcRulesList:[]},g;e=this.oODList.getSelectedItems();t=this.oProdList.getSelectedItems(),i=r.oPredProfile.getTokens()[0].getText(),s=r.byId("idCheck").getSelected();if(this.oObjDep.getTokens().length>0&&this.oPredProfile.getTokens().length>0){if(e[0].getTitle()==="All_"&&t[0].getTitle()==="All"){var d={vcRulesList:[]},g;g={profile:i,override:true,Location:e[1].getInfo(),Product:"All",GroupID:"All"};d.vcRulesList.push(g);var c="/v2/pal/generateRegModels";$.ajax({url:c,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:d.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegSucc"));n.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("rmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"}})}else{for(o=0;o<e.length;o++){if(e[o].getTitle()!=="All_"){g={profile:i,override:s,Location:e[o].getInfo(),Product:e[o].getDescription(),GroupID:e[o].getTitle()};d.vcRulesList.push(g)}}var c="/v2/pal/generateRegModels";$.ajax({url:c,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:d.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegSucc"));n.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("rmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"}})}if(a==="X"){r.resetInputs()}}else{l.show(r.i18n.getText("errInput"))}},onRun:function(){this.oModel=this.getModel("PModel");var e=[];var t={vcRulesList:[]};var i={Location:"FR10",Product:"KM_M219VBVS_BVS",GroupID:"M219VV00105NN_1"};t.vcRulesList.push(i);var s="/v2/pal/generateRegModels";$.ajax({url:s,type:"post",contentType:"application/json",data:JSON.stringify({vcRulesList:t.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(JSON.stringify(e))},success:function(e){sap.m.MessageToast.show("Generated Regression Models")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){this._valueHelpDialogLoc.open()}else if(t.includes("prod")){this._valueHelpDialogProd.open()}else if(t.includes("od")){if(r.oLoc.getValue()&&r.oProd.getTokens()){if(this.oODList.getBinding("items")){if(this.oODList.getBinding("items").oList[0].LOCATION_ID!==r.oLocList.getSelectedItem().getTitle()){this.oODList.getBinding("items").oList[0].LOCATION_ID=r.oLocList.getSelectedItem().getTitle()}this.oODList.getBinding("items").filter([new s("LOCATION_ID",o.Contains,r.oLocList.getSelectedItem().getTitle()),new s("PRODUCT_ID",o.Contains,this.oProdList.getSelectedItem().getTitle())])}this._valueHelpDialogOD.open()}else{l.show(r.i18n.getText("noLocProd"))}}else{this._valueHelpDialogPPF.open()}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(t.includes("od")){r._oCore.byId(this._valueHelpDialogOD.getId()+"-searchField").setValue("");if(r.oODList.getBinding("items")){r.oODList.getBinding("items").filter([])}}else{r._oCore.byId(this._valueHelpDialogPPF.getId()+"-searchField").setValue("");if(r.oPPFList.getBinding("items")){r.oPPFList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),l=[];t=t?t.trim():"";if(i.includes("loc")){if(t!==""){l.push(new s({filters:[new s("LOCATION_ID",o.Contains,t),new s("LOCATION_DESC",o.Contains,t)],and:false}))}r.oLocList.getBinding("items").filter(l)}else if(i.includes("prod")){if(t!==""){l.push(new s({filters:[new s("PRODUCT_ID",o.Contains,t),new s("PROD_DESC",o.Contains,t)],and:false}))}r.oProdList.getBinding("items").filter(l)}else if(i.includes("od")){if(t!==""){l.push(new s({filters:[new s("LOCATION_ID",o.Contains,t),new s("PRODUCT_ID",o.Contains,t),new s("COMPONENT",o.Contains,t),new s("OBJ_DEP",o.Contains,t)],and:false}))}r.oODList.getBinding("items").filter(l)}else{if(t!==""){l.push(new s({filters:[new s("PROFILE",o.Contains,t),new s("METHOD",o.Contains,t),new s("PRF_DESC",o.Contains,t)],and:false}))}r.oPPFList.getBinding("items").filter(l)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),s;if(t.includes("Loc")){s=e.getParameter("selectedItems");r.oLoc.setValue(s[0].getTitle());r.oProd.removeAllTokens();r.oObjDep.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t.includes("prod")){r.oProdList.getBinding("items").filter([]);s=e.getParameter("selectedItems");if(s&&s.length>0){r.oProd.removeAllTokens();s.forEach(function(e){r.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oProd.removeAllTokens()}}else if(t.includes("od")){r.oODList.getBinding("items").filter([]);s=e.getParameter("selectedItems");if(s&&s.length>0){if(s[0].getTitle()==="All_"){r.byId("idCheck").setSelected(true)}else{r.byId("idCheck").setSelected(false)}r.oObjDep.removeAllTokens();s.forEach(function(e){r.oObjDep.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oObjDep.removeAllTokens();r.byId("idCheck").setSelected(false)}}else{r.oPPFList.getBinding("items").filter([]);s=e.getParameter("selectedItems");r.oPredProfile.removeAllTokens();if(s&&s.length>0){s.forEach(function(e){r.oPredProfile.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}}r.handleClose(e)},handleTokenUpdate:function(e){var t=e.getSource().getId(),i=e.getParameter("removedTokens"),s,o,l;if(i){s=i[0].getProperty("key")}else{s=e.getParameter("item").getName()}if(t.includes("prod")){o=r.oProdList.getSelectedItems();for(l=0;l<o.length;l++){if(o[l].getTitle()===s){o[l].setSelected(false)}}}else if(t.includes("od")){o=r.oProdList.getSelectedItems();for(l=0;l<o.length;l++){if(o[l].getTitle()===s){o[l].setSelected(false)}}}else if(t.includes("pmInput")){o=r.oProdList.getSelectedItems();for(l=0;l<o.length;l++){if(o[l].getTitle()===s){o[l].setSelected(false)}}}},getToken:function(){var e;$.ajax({url:"/v2/pal",method:"GET",async:false,headers:{"X-CSRF-Token":"Fetch"},success:function(t,i,s){e=s.getResponseHeader("X-CSRF-Token")}});return e},resetInputs:function(){this.oLoc.setValue("");this.oObjDep.destroyTokens();this.oLocList.removeSelections();this.oODList.removeSelections();this.oPredProfile.destroyTokens();this.oPPFList.removeSelections();this.oProd.destroyTokens();this.oProdList.removeSelections()},handleProdChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("prodSlctList").getItems();var s=this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All"&&e.getParameter("selected")){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All"&&!e.getParameter("selected")){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t!=="All"||i.length!==s.length){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false)}},handleObjDepChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("odSlctList").getItems();var s=this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All_"&&e.getParameter("selected")&&i.length!==1){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All_"&&!e.getParameter("selected")){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t!=="All_"||i.length!==s.length){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false)}else if(t==="All_"&&e.getParameter("selected")&&i.length===1){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}}})});
},
	"cp/exereg/cpexeregressionmdls/i18n/i18n.properties":'title=Title\nappTitle=Home\nappDescription=App Description\n\nflpTitle=Run Regression Models\nflpSubtitle=\n\nfilterPanel=Generate Regression Models \nloc=Location\nprod=Product\nobjdep= Object Dependency\npredmodel=Regression Model Templates\npredpf=Prediction Profile\nRun= Generate regression\nnoLocProd= Please select a Location-Product \nnoInput= Please provide required inputs\ntimestamp= Created on \naddEntry= Add \ndim=Dimensions\nprofile=Profile\n\ngenRegSucc= Generated Regression Models successfully\ngenRegErr= Error generating Regression Models\nerrInput=Please provide required inputs',
	"cp/exereg/cpexeregressionmdls/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.exereg.cpexeregressionmdls","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","dataSources":{"mainService":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"CatalogService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/CatalogService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp.exereg.cpexeregressionmdls-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"executeregression","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"cp.exereg.cpexeregressionmdls.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.1","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.exereg.cpexeregressionmdls.i18n.i18n"}},"PModel":{"dataSource":"mainService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}},"BModel":{"dataSource":"CatalogService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}},"GModel":{"type":"sap.ui.model.json.JSONModel","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.exereg.cpexeregressionmdls.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","viewLevel":1,"viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/exereg/cpexeregressionmdls/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/exereg/cpexeregressionmdls/view/App.view.xml":'<mvc:View controllerName="cp.exereg.cpexeregressionmdls.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><Shell id="shell"><App id="app"><pages></pages></App></Shell></mvc:View>',
	"cp/exereg/cpexeregressionmdls/view/Home.view.xml":'<mvc:View\n    controllerName="cp.exereg.cpexeregressionmdls.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    displayBlock="true"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout" \n    xmlns:f="sap.ui.layout.form"\n    xmlns:u="sap.ui.unified"\n><Page title="Build Regression Models"><customHeader><OverflowToolbar><Text text="" width="30%"/><ToolbarSpacer/><Title text="Build Regression Models"/><ToolbarSpacer/><Text text="" width="40%"/></OverflowToolbar></customHeader><content><Panel id="filterPanel"  expandable="true" expanded="true"><headerToolbar><OverflowToolbar><Title text="{i18n>filterPanel}"/></OverflowToolbar></headerToolbar><f:Form editable="true"><f:layout><f:ResponsiveGridLayout \n                    labelSpanXL="3" \n                    labelSpanL="3" \n                    labelSpanM="3" \n                    labelSpanS="12"\n                    adjustLabelSpan="false" \n                    emptySpanXL="0" \n                    emptySpanL="0" \n                    emptySpanM="0" \n                    emptySpanS="0"\n                    columnsXL="2" \n                    columnsL="2" \n                    columnsM="2" \n                    singleContainerFullSize="false" /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="{i18n>loc}" required="true"/></f:label><f:fields><Input id="locInput" placeholder="{i18n>loc}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>prod}" required="true"/></f:label><f:fields><MultiInput id="prodInput" placeholder="{i18n>prod}" showValueHelp="true" valueHelpOnly="true"\n                                valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>objdep}" required="true"/></f:label><f:fields><MultiInput id="odInput" placeholder="{i18n>objdep}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"\n                                tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>predpf}" /></f:label><f:fields><MultiInput id="pmInput" placeholder="{i18n>predpf}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"\n                                tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="Override Assignment" /></f:label><f:fields><CheckBox id="idCheck" select="onCheck"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer><f:formElements><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:label><Label text=""/></f:label><f:fields><Text/></f:fields></f:FormElement><f:FormElement><f:fields><Button type="Emphasized" text="{i18n>Run}" press="onRun2" width="50%"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></Panel><Panel id="idPanel" visible="false"><Table id="rmdlList" headerText="{i18n>predmodel}"  items="{/results}" selectionChange="handlepredSelect"><headerToolbar><OverflowToolbar><Title text="{i18n>predmodel}"/><ToolbarSpacer/></OverflowToolbar></headerToolbar><columns><Column><Text text="{i18n>loc}"/></Column><Column><Text text="{i18n>prod}"/></Column><Column><Text text="{i18n>objdep}"/></Column><Column><Text text="{i18n>profile}"/></Column><Column><Text text="{i18n>dim}"/></Column></columns><items><ColumnListItem vAlign="Middle"><cells><Text text="{Location}"/><Text text="{Product}"/><Text text="{GroupID}"/><Text text="{profile}"/><ObjectStatus\n                    class="sapUiSmallMarginBottom"\n                    text="{dimensions}"\n                    icon="sap-icon://sys-enter-2"\n                    state="Success" /></cells></ColumnListItem></items></Table></Panel></content></Page></mvc:View>\n',
	"cp/exereg/cpexeregressionmdls/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="true"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/ObjDepDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="odSlctList" title="{i18n>objdep}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="500px" items="{/results}" \n        selectionChange="handleObjDepChange" growing="false"><StandardListItem title="{OBJ_DEP}_{OBJ_COUNTER}" description="{PRODUCT_ID}" info="{LOCATION_ID}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/PredDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="ppfSlctList" title="{i18n>objdep}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="false" contentWidth="320px" items="{/results}" growing="false"><StandardListItem title="{PROFILE}" description="{PRF_DESC}" info="{METHOD}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>prod}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
