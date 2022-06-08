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
	"cp/exereg/cpexeregressionmdls/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cp/exereg/cpexeregressionmdls/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,i,o,s,l,n){"use strict";var a,r;return t.extend("cp.exereg.cpexeregressionmdls.controller.Home",{onInit:function(){this.locModel=new i;this.prodModel=new i;this.odModel=new i;this.ppfModel=new i;this.otabModel=new i;this.prodModel.setSizeLimit(5e3);this.odModel.setSizeLimit(5e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogOD){this._valueHelpDialogOD=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.ObjDepDialog",this);this.getView().addDependent(this._valueHelpDialogOD)}if(!this._valueHelpDialogPPF){this._valueHelpDialogPPF=sap.ui.xmlfragment("cp.exereg.cpexeregressionmdls.view.PredDialog",this);this.getView().addDependent(this._valueHelpDialogPPF)}this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this))},_onPatternMatched:function(){sap.ui.core.BusyIndicator.show();r=this;this.oPanel=this.byId("idPanel");this.oTable=this.byId("rmdlList");this.i18n=this.getResourceBundle();this.oGModel=this.getModel("GModel");this.oLoc=this.byId("locInput");this.oProd=this.byId("prodInput");this.oObjDep=this.byId("odInput");this.oPredProfile=this.byId("pmInput");this.aVcRulesList=[];r._valueHelpDialogLoc.setTitleAlignment("Center");r._valueHelpDialogProd.setTitleAlignment("Center");r._valueHelpDialogOD.setTitleAlignment("Center");r._valueHelpDialogPPF.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oODList=this._oCore.byId(this._valueHelpDialogOD.getId()+"-list");this.oPPFList=this._oCore.byId(this._valueHelpDialogPPF.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){r.locModel.setData(e);r.oLocList.setModel(r.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){l.show("error")}});this.getModel("BModel").read("/getProfiles",{success:function(e){r.ppfModel.setData(e);r.oPPFList.setModel(r.ppfModel)},error:function(e,t){l.show("error")}})},onRun2:function(){var e=r.byId("idCheck").getSelected();var t="Do you want to override assignments?";if(e===true){sap.m.MessageBox.show(t,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){r.onRunSend()}}})}else{r.onRunSend()}},onRunSend:function(){this.oModel=this.getModel("PModel");var e,t,i,o,s,n=[],a;var d={vcRulesList:[]},g;var c=r.byId("idmdlver").getSelectedKey(),u;e=this.oODList.getSelectedItems();t=this.oProdList.getSelectedItems(),i=r.oPredProfile.getTokens()[0].getText(),o=r.byId("idCheck").getSelected();if(c==="act"){u="Active"}else{u="Simulation"}if(this.oObjDep.getTokens().length>0&&this.oPredProfile.getTokens().length>0){for(s=0;s<e.length;s++){g={profile:i,override:o,Location:e[s].getInfo(),Product:e[s].getDescription(),GroupID:e[s].getTitle(),Type:"OD",modelVersion:u};d.vcRulesList.push(g)}var h={name:"generateModels14",dscription:"Generate Machine Learning Models",action:"%2Fpal%2FgenerateModels",active:true,httpMethod:"POST",startTime:"2022-04-26 14:00 +0000",endTime:"2022-04-27 14:00 +0000",schedules:[{data:d.vcRulesList,cron:"* * * * * *%2F5 0",active:true,startTime:"2022-04-26 14:00 +0000"}]};r.getModel("JModel").callFunction("/laddMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(h)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(r.i18n.getText("genPredSuccess"));n.push(e.fgPredictions.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("pmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(r.i18n.getText("genPredErr"))}});if(a==="X"){r.resetInputs()}}else{l.show(r.i18n.getText("errInput"))}},onRunSend1:function(){this.oModel=this.getModel("PModel");var e,t,i,o,s,n=[],a;var d={vcRulesList:[]},g;var c=r.byId("idmdlver").getSelectedKey(),u;e=this.oODList.getSelectedItems();t=this.oProdList.getSelectedItems(),i=r.oPredProfile.getTokens()[0].getText(),o=r.byId("idCheck").getSelected();if(c==="act"){u="Active"}else{u="Simulation"}if(this.oObjDep.getTokens().length>0&&this.oPredProfile.getTokens().length>0){if(e[0].getTitle()==="All"&&t[0].getTitle()==="All"){var d={vcRulesList:[]},g;g={profile:i,override:o,Location:e[1].getInfo(),Product:"All",GroupID:"All",Type:"OD",modelVersion:u};d.vcRulesList.push(g);var h="/v2/pal/generateModels";$.ajax({url:h,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:d.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegSucc"));n.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("rmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"}})}else{for(s=0;s<e.length;s++){if(e[s].getTitle()!=="All"){g={profile:i,override:o,Location:e[s].getInfo(),Product:e[s].getDescription(),GroupID:e[s].getTitle(),Type:"OD",modelVersion:u};d.vcRulesList.push(g)}}var h="/v2/pal/generateModels";$.ajax({url:h,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:d.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genRegSucc"));n.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("rmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"}})}if(a==="X"){r.resetInputs()}}else{l.show(r.i18n.getText("errInput"))}},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){this._valueHelpDialogLoc.open()}else if(t.includes("prod")){this._valueHelpDialogProd.open()}else if(t.includes("od")){if(r.oLoc.getValue()&&r.oProd.getTokens().length!==0){var i=r.oProdList.getSelectedItems();var o=[];var s=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLocList.getSelectedItem().getTitle()});o.push(s);for(var n=0;n<i.length;n++){if(i[n].getTitle()!=="All"){s=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:i[n].getTitle()});o.push(s)}}this.getModel("BModel").read("/getBomOdCond",{filters:o,success:function(e){r.objDepData=e.results;r.odModel.setData(e);r.oODList.setModel(r.odModel);if(i.length>0){if(r.oProdList.getSelectedItems()[0].getTitle()==="All"){r._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll()}}r._valueHelpDialogOD.open()},error:function(e,t){l.show("error")}})}else{l.show(r.i18n.getText("noLocProd"))}}else{this._valueHelpDialogPPF.open()}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(t.includes("od")){r._oCore.byId(this._valueHelpDialogOD.getId()+"-searchField").setValue("");if(r.oODList.getBinding("items")){r.oODList.getBinding("items").filter([])}}else{r._oCore.byId(this._valueHelpDialogPPF.getId()+"-searchField").setValue("");if(r.oPPFList.getBinding("items")){r.oPPFList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),l=[];t=t?t.trim():"";if(i.includes("loc")){if(t!==""){l.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("LOCATION_DESC",s.Contains,t)],and:false}))}r.oLocList.getBinding("items").filter(l)}else if(i.includes("prod")){if(t!==""){l.push(new o({filters:[new o("PRODUCT_ID",s.Contains,t),new o("PROD_DESC",s.Contains,t)],and:false}))}r.oProdList.getBinding("items").filter(l)}else if(i.includes("od")){if(t!==""){l.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("PRODUCT_ID",s.Contains,t),new o("COMPONENT",s.Contains,t),new o("OBJ_DEP",s.Contains,t)],and:false}))}r.oODList.getBinding("items").filter(l)}else{if(t!==""){l.push(new o({filters:[new o("PROFILE",s.Contains,t),new o("METHOD",s.Contains,t),new o("PRF_DESC",s.Contains,t)],and:false}))}r.oPPFList.getBinding("items").filter(l)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),n;if(t.includes("Loc")){n=e.getParameter("selectedItems");r.oLoc.setValue(n[0].getTitle());r.oProd.removeAllTokens();r.oObjDep.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",s.EQ,n[0].getTitle())],success:function(e){r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,t){l.show("error")}})}else if(t.includes("prod")){r.oProdList.getBinding("items").filter([]);r.oObjDep.removeAllTokens();this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();n=e.getParameter("selectedItems");if(n&&n.length>0){r.oProd.removeAllTokens();n.forEach(function(e){r.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oProd.removeAllTokens()}}else if(t.includes("od")){r.oODList.getBinding("items").filter([]);n=e.getParameter("selectedItems");if(n&&n.length>0){if(n[0].getTitle()==="All"){r.byId("idCheck").setSelected(true)}else{r.byId("idCheck").setSelected(false)}r.oObjDep.removeAllTokens();n.forEach(function(e){r.oObjDep.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oObjDep.removeAllTokens();r.byId("idCheck").setSelected(false)}}else{r.oPPFList.getBinding("items").filter([]);n=e.getParameter("selectedItems");r.oPredProfile.removeAllTokens();if(n&&n.length>0){n.forEach(function(e){r.oPredProfile.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}}r.handleClose(e)},getToken:function(){var e;$.ajax({url:"/v2/pal",method:"GET",async:false,headers:{"X-CSRF-Token":"Fetch"},success:function(t,i,o){e=o.getResponseHeader("X-CSRF-Token")}});return e},resetInputs:function(){this.oLoc.setValue("");this.oObjDep.destroyTokens();this.oLocList.removeSelections();this.oODList.removeSelections();this.oPredProfile.destroyTokens();this.oPPFList.removeSelections();this.oProd.destroyTokens();this.oProdList.removeSelections()},handleProdChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("prodSlctList").getItems();var o=this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All"&&e.getParameter("selected")&&i.length!==1){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All"&&!e.getParameter("selected")){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t==="All"&&i.length===1){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false)}else if(t!=="All"&&!e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false)}else if(t!=="All"&&e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(true)}},handleObjDepChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("odSlctList").getItems();var o=this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All"&&e.getParameter("selected")&&i.length!==1){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All"&&!e.getParameter("selected")){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t!=="All"&&!e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false)}else if(t!=="All"&&e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(true)}else if(t==="All"&&i.length===1){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false)}}})});
},
	"cp/exereg/cpexeregressionmdls/i18n/i18n.properties":'title=Title\nappTitle=Home\nappDescription=App Description\n\nflpTitle=Generate Models\nflpSubtitle=\n\nfilterPanel=Generate  Models \nloc=Location\nprod=Product\nobjdep= Object Dependency\npredmodel=Model Templates\npredpf=Prediction Profile\nRun= Generate Model\nnoLocProd= Please select a Location-Product \nnoInput= Please provide required inputs\ntimestamp= Created on \naddEntry= Add \ndim=Dimensions\nprofile=Profile\nmodelVersion=Model Version\noverride= Override\n\ngenRegSucc= Generated Models successfully\ngenRegErr= Error generating Models\nerrInput=Please provide required inputs',
	"cp/exereg/cpexeregressionmdls/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.exereg.cpexeregressionmdls","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","dataSources":{"mainService":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"CatalogService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/CatalogService/metadata.xml"}},"Jobs":{"uri":"v2/jobs/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp.exereg.cpexeregressionmdls-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"executeregression","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"cp.exereg.cpexeregressionmdls.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.1","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.exereg.cpexeregressionmdls.i18n.i18n"}},"PModel":{"dataSource":"mainService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}},"BModel":{"dataSource":"CatalogService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}},"GModel":{"type":"sap.ui.model.json.JSONModel","preload":true},"JModel":{"dataSource":"Jobs","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","useBatch":true,"defaultBindingMode":"TwoWay","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.exereg.cpexeregressionmdls.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","viewLevel":1,"viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cp/exereg/cpexeregressionmdls/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/exereg/cpexeregressionmdls/view/App.view.xml":'<mvc:View controllerName="cp.exereg.cpexeregressionmdls.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><Shell id="shell"><App id="app"><pages></pages></App></Shell></mvc:View>',
	"cp/exereg/cpexeregressionmdls/view/Details.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form"><Dialog title="" contentWidth="500px"><VBox class="sapUiSmallMargin"><f:SimpleForm id="FormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="3" labelSpanM="4" labelSpanS="12"\n\t\t\t\tadjustLabelSpan="false" emptySpanXL="0" emptySpanL="4" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false" ariaLabelledBy="Title1"><f:content><Label text="{i18n>name}"/><Input id="idname" value="" /><Label text="{i18n>desc}"/><Input id="idDesc" value="" /><Label text="{i18n>cron}"/><Input id="idcron" value="" /><Label text="{i18n>startTime}"/><Input id="idsTime" value="" /><Label text="{i18n>endTime}"/><Input id="ideTime" value="" /><Label text="{i18n>Scheduletime}"/><Input id="idSSTime" value="" /></f:content></f:SimpleForm></VBox><buttons><Button type=\'Ghost\' text="{i18n>save}" press="onRunSend"></Button><Button type=\'Reject\' text="{i18n>close}" press="onRunClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/Home.view.xml":'<mvc:View controllerName="cp.exereg.cpexeregressionmdls.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:u="sap.ui.unified"><Page title="Build Models"><customHeader><OverflowToolbar><Text text="" width="30%"/><ToolbarSpacer/><Title text="Build Models" class="boldText"/><ToolbarSpacer/><Text text="" width="40%"/></OverflowToolbar></customHeader><content><Panel id="filterPanel" expandable="true" expanded="true"><headerToolbar><OverflowToolbar><Title text="{i18n>filterPanel}"/></OverflowToolbar></headerToolbar><f:Form editable="true"><f:layout><f:ResponsiveGridLayout labelSpanXL="3" labelSpanL="3" labelSpanM="3" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="2" singleContainerFullSize="false" /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="{i18n>loc}" required="true"/></f:label><f:fields><Input id="locInput" placeholder="{i18n>loc}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>prod}" required="true"/></f:label><f:fields><MultiInput id="prodInput" placeholder="{i18n>prod}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>objdep}" required="true"/></f:label><f:fields><MultiInput id="odInput" placeholder="{i18n>objdep}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/><SegmentedButton id="idOdRes" selectedKey="OD" class="sapUiSmallMarginBottom" selectionChange="onSelectionChange"><items><SegmentedButtonItem text="Object Dep." key="OD"/><SegmentedButtonItem text="Restriction" key="rt" /></items></SegmentedButton></f:fields></f:FormElement><f:FormElement><f:label><Label text="Model Version"/></f:label><f:fields><ComboBox id="idmdlver" selectedKey="act" selectionChange="onSelectionChange"><core:Item key="act" text="Active"/><core:Item key="sim" text="Simulation"/></ComboBox></f:fields></f:FormElement><f:FormElement><f:label><Label text="{i18n>predpf}" /></f:label><f:fields><MultiInput id="pmInput" placeholder="{i18n>predpf}" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" tokenUpdate="handleTokenUpdate"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="Override Assignment" /></f:label><f:fields><CheckBox id="idCheck" select="onCheck"/><Button type="Emphasized" text="{i18n>Run}" press="onRun2" width="100%"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></Panel><Panel id="idPanel" visible="false"><Table id="rmdlList" headerText="{i18n>predmodel}" items="{/results}" selectionChange="handlepredSelect"><headerToolbar><OverflowToolbar><Title text="{i18n>predmodel}"/><ToolbarSpacer/></OverflowToolbar></headerToolbar><columns><Column><Text text="{i18n>loc}"/></Column><Column><Text text="{i18n>prod}"/></Column><Column><Text text="{i18n>objdep}"/></Column><Column><Text text="{i18n>profile}"/></Column><Column><Text text="{i18n>override}"/></Column><Column><Text text="{i18n>modelVersion}"/></Column><Column><Text text="{i18n>dim}"/></Column></columns><items><ColumnListItem vAlign="Middle"><cells><Text text="{Location}"/><Text text="{Product}"/><Text text="{GroupID}"/><Text text="{profile}"/><Text text="{override}"/><Text text="{modelVersion}"/><ObjectStatus class="sapUiSmallMarginBottom" text="{dimensions}" icon="sap-icon://sys-enter-2" state="Success" /></cells></ColumnListItem></items></Table></Panel></content></Page></mvc:View>\n',
	"cp/exereg/cpexeregressionmdls/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="true"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/ObjDepDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="odSlctList" title="{i18n>objdep}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="500px" items="{/results}" \n        selectionChange="handleObjDepChange" growing="false"><StandardListItem title="{OBJ_DEP}" description="{PRODUCT_ID}" info="{LOCATION_ID}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/PredDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="ppfSlctList" title="{i18n>predpf}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="false" contentWidth="320px" items="{/results}" growing="false"><StandardListItem title="{PROFILE}" description="{PRF_DESC}" info="{METHOD}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cp/exereg/cpexeregressionmdls/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>prod}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="true" contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
