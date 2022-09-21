//@ui5-bundle cpapp/cpcharqtygraph/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpcharqtygraph/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpcharqtygraph/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpcharqtygraph.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpcharqtygraph/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(r){"use strict";return r.extend("cpapp.cpcharqtygraph.controller.controller.App",{onInit(){}})});
},
	"cpapp/cpcharqtygraph/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/viz/ui5/data/FlattenedDataset","sap/viz/ui5/controls/common/feeds/FeedItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox","sap/m/Panel","sap/viz/ui5/controls/VizFrame","sap/viz/ui5/data/Dataset"],function(e,t,o,i,s,l,a,r,d,n,c){"use strict";var u,p,g,h=0;return e.extend("cpapp.cpcharqtygraph.controller.Home",{onInit:function(){g=this;g.TableModel=new t;g.locModel=new t;g.prodModel=new t;g.verModel=new t;g.scenModel=new t;g.dateJSON=new t;g.oNewModel=new t;this.PanelContent=g.byId("idVizFrame");g.TableModel.setSizeLimit(1e3);g.locModel.setSizeLimit(1e3);g.prodModel.setSizeLimit(1e3);g.verModel.setSizeLimit(1e3);g.scenModel.setSizeLimit(1e3);p=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){g.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oModVer=this.byId("idComboBox");this.oDate=this.byId("fromDate");g.aOrder=[];g.aSelOrder=[];var e=[];g._valueHelpDialogProd.setTitleAlignment("Center");g._valueHelpDialogLoc.setTitleAlignment("Center");g._valueHelpDialogVer.setTitleAlignment("Center");g._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getLocation",{success:function(e){g.locModel.setData(e);g.oLocList.setModel(g.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}});g.getView().getModel("oModel").read("/getCIRCharRate?$skiptoken=1000",{success:function(e){},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},onResetDate:function(){g.oLoc.setValue("");g.oProd.setValue("");g.oVer.setValue("");g.oScen.setValue("");this.oModVer.setSelectedKey("Active");g.byId("idObjectPageSub").setVisible(false);this.oDate=this.byId("fromDate");this.oDate.setSelectedKey("")},handleValueHelp:function(e){var o=e.getParameter("id");if(o.includes("loc")){g._valueHelpDialogLoc.open();var i=new t;i.setData([]);var s=g.byId("idVizFrame");s.setModel(i);g.byId("idObjectPageSub").setVisible(false);g.byId("idSplitter").setVisible(false);g.byId("fromDate").setEditable(false);g.byId("fromDate").setSelectedKey("")}else if(o.includes("prod")){if(g.byId("idloc").getValue()){g._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(o.includes("ver")){if(g.byId("idloc").getValue()&&g.byId("idprod").getValue()){g._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(o.includes("scen")){if(g.byId("idloc").getValue()&&g.byId("idprod").getValue()&&g.byId("idver").getValue()){g._valueHelpDialogScen.open()}else{a.show("Select Location/Product/Version")}}},handleSelection:function(e){g.oGModel=g.getOwnerComponent().getModel("oGModel");var o=e.getParameter("id"),i=e.getParameter("selectedItems"),r,d=[];if(o.includes("Loc")){g.oLoc=g.byId("idloc");g.oProd=g.byId("idprod");r=e.getParameter("selectedItems");g.oLoc.setValue(r[0].getTitle());g.oGModel.setProperty("/SelectedLoc",r[0].getTitle());g.oProd.setValue("");g.oVer.setValue("");g.oScen.setValue("");g.oGModel.setProperty("/SelectedProd","");this.getView().getModel("oModel").callFunction("/getAllProd",{method:"GET",urlParameters:{LOCATION_ID:g.oLoc.getValue()},success:function(e){g.prodModel.setData(e);g.oProdList.setModel(g.prodModel)},error:function(e,t){a.show("error")}})}else if(o.includes("prod")){g.oProd=g.byId("idprod");r=e.getParameter("selectedItems");g.oProd.setValue(r[0].getTitle());g.oGModel.setProperty("/SelectedProd",r[0].getTitle());g.oVer.setValue("");g.oScen.setValue("");this.getView().getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:g.oGModel.getProperty("/SelectedLoc")},success:function(e){if(e.results.length===0){sap.m.MessageToast.show("No versions available for choosen Location/Product. Please choose another.");g.verModel.setData([]);g.oVerList.setModel(g.verModel);g.byId("fromDate").setEditable(false)}else{var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===r[0].getTitle()){t.push({VERSION:e.results[o].VERSION})}}if(t.length>0){g.verModel.setData({results:t});g.oVerList.setModel(g.verModel)}}},error:function(e,t){a.show("error")}})}else if(o.includes("Ver")){this.oVer=g.byId("idver");r=e.getParameter("selectedItems");g.oVer.setValue(r[0].getTitle());g.oScen.setValue("");g.oGModel.setProperty("/SelectedVer",r[0].getTitle());var n=g.oGModel.getProperty("/SelectedProd");this.getView().getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:g.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===g.byId("idprod").getValue()&&e.results[o].VERSION===r[0].getTitle()){t.push({SCENARIO:e.results[o].SCENARIO})}}if(t.length>0){g.scenModel.setData({results:t});g.oScenList.setModel(g.scenModel)}},error:function(e,t){a.show("error")}})}else if(o.includes("scen")){this.oScen=g.byId("idscen");r=e.getParameter("selectedItems");g.oScen.setValue(r[0].getTitle());g.oGModel.setProperty("/SelectedScen",r[0].getTitle());g.getView().getModel("oModel").read("/getCIRCharRate",{filters:[new s("LOCATION_ID",l.EQ,g.oGModel.getProperty("/SelectedLoc")),new s("PRODUCT_ID",l.EQ,g.oGModel.getProperty("/SelectedProd")),new s("VERSION",l.EQ,g.oGModel.getProperty("/SelectedVer")),new s("SCENARIO",l.EQ,g.oGModel.getProperty("/SelectedScen"))],success:function(e){if(e.results.length===0){g.oDateModel=new t;g.oDateModel.setData([]);g.byId("fromDate").setModel(g.oDateModel);sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("No dates available for the selected criteria.");g.byId("fromDate").setEditable(false)}else{sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.WEEK_DATE=g.getInMMddyyyyFormat(e.WEEK_DATE)},g);for(var o=0;o<e.results.length;o++){if(g.aOrder.indexOf(e.results[o].WEEK_DATE)===-1){g.aOrder.push(e.results[o].WEEK_DATE);if(e.results[o].WEEK_DATE!==""){g.oOrdData={WEEK_DATE:e.results[o].WEEK_DATE};g.aSelOrder.push(g.oOrdData)}}}g.oDateModel=new t;g.oDateModel.setData({resultsCombos:g.aSelOrder});g.byId("fromDate").setModel(g.oDateModel);g.byId("fromDate").setEditable(true)}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}g.handleClose(e)},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),i=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){i.push(new s({filters:[new s("LOCATION_ID",l.Contains,t),new s("LOCATION_DESC",l.Contains,t)],and:false}))}g.oLocList.getBinding("items").filter(i)}else if(o.includes("prod")){if(t!==""){i.push(new s({filters:[new s("PRODUCT_ID",l.Contains,t),new s("PROD_DESC",l.Contains,t)],and:false}))}g.oProdList.getBinding("items").filter(i)}else if(o.includes("Ver")){if(t!==""){i.push(new s({filters:[new s("VERSION",l.Contains,t)],and:false}))}g.oVerList.getBinding("items").filter(i)}else if(o.includes("scen")){if(t!==""){i.push(new s({filters:[new s("SCENARIO",l.Contains,t)],and:false}))}g.oScenList.getBinding("items").filter(i)}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){g._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(g.oLocList.getBinding("items")){g.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){g._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(g.oProdList.getBinding("items")){g.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){g._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(g.oVerList.getBinding("items")){g.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){g._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(g.oScenList.getBinding("items")){g.oScenList.getBinding("items").filter([])}}},onGetData:function(e){var o=g.byId("idloc").getValue(),i=g.byId("idprod").getValue(),s=g.byId("idver").getValue(),l=g.byId("idComboBox").getSelectedKey(),a=g.byId("fromDate").getValue(),r=g.byId("idscen").getValue();g.oGModel=g.getOwnerComponent().getModel("oGModel");var d=[];var n=new Date;n.setDate(n.getDate()-(n.getDay()+6)%7);if(o!==""&&i!==""&&s!==""&&r!==""){var c=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:o});d.push(c);var c=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:i});d.push(c);if(s){var c=new sap.ui.model.Filter({path:"VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:s});d.push(c)}if(l){var c=new sap.ui.model.Filter({path:"MODEL_VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:l});d.push(c)}if(r){var c=new sap.ui.model.Filter({path:"SCENARIO",operator:sap.ui.model.FilterOperator.EQ,value1:r});d.push(c)}if(a===""){var c=new sap.ui.model.Filter({path:"WEEK_DATE",operator:sap.ui.model.FilterOperator.EQ,value1:n});d.push(c)}else{var c=new sap.ui.model.Filter({path:"WEEK_DATE",operator:sap.ui.model.FilterOperator.EQ,value1:a});d.push(c)}sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getCIRCharRate",{filters:d,success:function(e){var o=new t;sap.ui.core.BusyIndicator.hide();if(e.results.length===0){n=g.getInMMddyyyyFormat(n);sap.m.MessageToast.show("No data available for "+n+"");o.setData([]);var i=g.byId("idVizFrame");i.setModel(o)}else{e.results.forEach(function(e){e.WEEK_DATE=g.getInMMddyyyyFormat(e.WEEK_DATE)},g);o.setData({results:e.results});var i=g.byId("idVizFrame");i.setModel(o);i.setVizProperties({plotArea:{dataLabel:{visible:false}},title:{text:e.results[1].WEEK_DATE,visible:true}});g.byId("idObjectPageSub").setVisible(true);var s=g.byId("idPopOver");s.connect(i.getVizUid());g.byId("idSplitter").setVisible(true);sap.ui.core.BusyIndicator.hide();g.oGModel.setProperty("/tableData",e.results)}},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario")}},getInMMddyyyyFormat:function(e){if(!e){e=new Date}var t=e.getMonth()+1;var o=e.getDate();if(t<10){t="0"+t}if(o<10){o="0"+o}return e.getFullYear()+"-"+t+"-"+o}})});
},
	"cpapp/cpcharqtygraph/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpcharqtygraph\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Characteristic Planned Vs Predicted\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Characteristic Planned Vs Predicted\n\nflpTitle=Characteristic Planned Vs Predicted\n\nflpSubtitle=\n\npageTitle = Character Quantity Graph\n',
	"cpapp/cpcharqtygraph/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpcharqtygraph","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.1","toolsId":"f61cbceb-dc23-40b5-9fb7-6a7b8e6a4921"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpcharqtygraph-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpcharqtygraph","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.viz":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpcharqtygraph.i18n.i18n"}},"oModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"oGModel":{"type":"sap.ui.model.json.JSONModel"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpcharqtygraph.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":":?query:","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpcharqtygraph.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpcharqtygraph/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpcharqtygraph/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpcharqtygraph/view/App.view.xml":'<mvc:View controllerName="cpapp.cpcharqtygraph.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"cpapp/cpcharqtygraph/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpcharqtygraph.controller.Home"\n     xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core" displayBlock="true"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    xmlns:ux="sap.uxap"\n    xmlns:layout="sap.ui.layout"\n    xmlns:commons="sap.suite.ui.commons"\n    xmlns:viz.feeds="sap.viz.ui5.controls.common.feeds"\n     xmlns:viz.data="sap.viz.ui5.data"\n     xmlns:viz="sap.viz.ui5.controls"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:html="http://www.w3.org/1999/xhtml"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>pageTitle}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>pageTitle}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox ><Label text="Location" required= "true"/><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="Product" required= "true"/><Input id="idprod" placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox ><Label text="IBP Version" required= "true"/><Input id="idver" value="" placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="IBP Scenario" required= "true"/><Input id="idscen" value="" placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="Week Date"  /><ComboBox id="fromDate" placeholder="Select Date"  items="{path:\'/resultsCombos\'}" change="handleDateChange" width="350px" editable="false"><core:Item key="{WEEK_DATE}" text="{WEEK_DATE}"/></ComboBox></VBox><VBox ><Label text="IBP Model-Version" required="true" /><ComboBox id="idComboBox" width="auto" placeholder="Select" change="onSelect" class="CombBox" selectedKey="Active"\n\t\t\t\t\t\t\t\t\tshowButton="true"><core:Item key="Active" text="Active"/><core:Item key="Simulation" text="Simulation"/></ComboBox></VBox><VBox><Label text=""/><HBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd"/><Button text="Reset" type="Transparent" press="onResetDate" tooltip="Reset Valid To Date"/></HBox></VBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection id="idOBPageSec" ><ux:subSections id="idSubSec"><ux:ObjectPageSubSection id="idObjectPageSub" height="600px"><ux:blocks id="idblocks"><layout:Splitter id="idSplitter" height="auto" width="100%" class="sapUiNoContentPadding" visible="false"><layout:FixFlex id=\'chartFixFlex\' minFlexSize="500" class="fixFlex" ><layout:flexContent class="fixFlex"><commons:ChartContainer id="idInvChartContainer" showFullScreen="true" showPersonalization="false" showZoom="false" autoAdjustHeight="true" \n\t\t\t\t\t\t\t\t\tshowLegend="true" showSelectionDetails="false" ><commons:content><commons:ChartContainerContent><commons:content><viz:Popover id="idPopOver"></viz:Popover><viz:VizFrame xmlns="sap.viz" id="idVizFrame" vizType="line" height=\'600px\' width="100%" ><viz:dataset><viz.data:FlattenedDataset data="{/results}"><viz.data:dimensions><viz.data:DimensionDefinition name="Char.Name"\n                                value="{CHAR_NAME}" /><viz.data:DimensionDefinition name="Char.Value"\n                                value="{CHAR_VALUE}" /></viz.data:dimensions><viz.data:measures><viz.data:MeasureDefinition name="Generated Qty"\n                                value="{GEN_QTY}" /><viz.data:MeasureDefinition name="Planned Qty"\n                                value="{PLAN_QTY}" /></viz.data:measures></viz.data:FlattenedDataset></viz:dataset><viz:feeds><viz.feeds:FeedItem id=\'valueAxisFeed\' uid="valueAxis" type="Measure"\n                        values="Planned Qty" /><viz.feeds:FeedItem id=\'valueAxisFeed1\' uid="valueAxis" type="Measure"\n                        values="Generated Qty" /><viz.feeds:FeedItem id=\'categoryAxisFeed\' uid="categoryAxis" type="Dimension"\n                        values="Char.Name" /><viz.feeds:FeedItem id=\'categoryAxisFeed1\' uid="categoryAxis" type="Dimension"\n                        values="Char.Value" /></viz:feeds></viz:VizFrame></commons:content></commons:ChartContainerContent></commons:content></commons:ChartContainer></layout:flexContent></layout:FixFlex></layout:Splitter></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cpapp/cpcharqtygraph/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="Location" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcharqtygraph/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="Product" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcharqtygraph/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcharqtygraph/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
