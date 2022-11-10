//@ui5-bundle cp/appf/cpassignprofiles/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cp/appf/cpassignprofiles/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/appf/cpassignprofiles/model/models"],function(e,i,t){"use strict";return e.extend("cp.appf.cpassignprofiles.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"cp/appf/cpassignprofiles/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.appf.cpassignprofiles.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cp/appf/cpassignprofiles/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.appf.cpassignprofiles.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cp/appf/cpassignprofiles/controller/Detail.controller.js":function(){sap.ui.define(["cp/appf/cpassignprofiles/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,l,s,a,o,i,d){"use strict";var r,g;return e.extend("cp.appf.cpassignprofiles.controller.Detail",{onInit:function(){r=this;r.oListModel=new s;r.oParamModel=new s;r.oAlgoListModel=new s},onBack:function(){var e=[];r.oAlgoListModel.setData({results:e});r.byId("idTab").setModel(r.oAlgoListModel);var t=sap.ui.core.UIComponent.getRouterFor(r);t.navTo("Home",{},true)},onAfterRendering:function(){r=this;this.vDate=(new Date).toISOString().split("T")[0];r.oGModel=r.getModel("oGModel");var e=r.oGModel.getProperty("/sId");if(e==="Copy"||e==="Edit"){if(e==="Edit"){r.byId("idPn").setValue(r.oGModel.getProperty("/sProfile"));r.byId("idPn").setEditable(false);this.byId("idPage").setTitle("Edit Profile")}else{r.byId("idPn").setValue("");r.byId("idPn").setEditable(true);this.byId("idPage").setTitle("Create Profile")}r.byId("idPdesc").setValue(r.oGModel.getProperty("/sProf_desc"));r.byId("idAuth").setValue("");var t=r.oGModel.getProperty("/sMethod");if(t==="MLR"){r.byId("idAlgo").setSelectedKey("M")}else if(t==="HGBT"){r.byId("idAlgo").setSelectedKey("H")}else if(t==="VARMA"){r.byId("idAlgo").setSelectedKey("V")}else if(t==="RDT"){r.byId("idAlgo").setSelectedKey("R")}else{r.byId("idAlgo").setSelectedKey("N")}r.getParameters()}else{r.byId("idPn").setValue("");r.byId("idPdesc").setValue("");r.byId("idAuth").setValue("");r.byId("idAlgo").setSelectedKey("N");r.byId("idPn").setEditable(true);var l=[];r.oAlgoListModel.setData({results:l});r.byId("idTab").setModel(r.oAlgoListModel)}},getParameters:function(){var e=r.oGModel.getProperty("/sProfile"),l=r.oGModel.getProperty("/sMethod");this.getModel("BModel").read("/getProfileParameters",{filters:[new a("PROFILE",o.EQ,e),new a("METHOD",o.EQ,l)],success:function(e){r.alogoList=r.byId("idTab");e.results.forEach(function(e){e.DESCRIPTION=e.PARA_DESC;if(e.DOUBLEVAL!==null){e.DATATYPE="DOUBLE";e.DEFAULTVAL=e.DOUBLEVAL}else if(e.INTVAL!==null){e.DATATYPE="INTEGER";e.DEFAULTVAL=e.INTVAL}else if(e.STRVAL!==null){e.DATATYPE="NVARCHAR";e.DEFAULTVAL=e.STRVAL}},r);r.oAlgoListModel.setData({results:e.results});r.alogoList.setModel(r.oAlgoListModel)},error:function(){t.show("Failed to get data")}})},onAlgorChange:function(e){var l=r.byId("idAlgo")._getSelectedItemText();r.alogoList=r.byId("idTab");var s=new a("METHOD",o.EQ,l);this.getModel("PModel").read("/get_palparameters",{filters:[s],success:function(e){e.results.forEach(function(e){e.FLAG=e.DATATYPE},r);r.oAlgoListModel.setData({results:e.results});r.alogoList.setModel(r.oAlgoListModel)},error:function(){t.show("Failed to get data")}})},onLive:function(e){r.byId("idSave").setEnabled(true);if(e){var t=e.getParameter("newValue"),l=e.getParameter("id").split("idTab-")[1]}else{var l=r.typeChange;t=r.byId("idTab").getItems()[l].getCells()[4].getValue()}var s=r.byId("idTab").getItems()[l].getCells()[2].getSelectedKey(),a=0;var o=/^[^*|\":<>[\]{}!`\\()';@&$]+$/;if(s==="DOUBLE"){r.byId("idTab").getItems()[l].getCells()[4].setType("Number")}if(s==="INTEGER"){if(t%1===0&&parseInt(t).toString()===t.toString()||t===""){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}else if(s==="NVARCHAR"){var i=/^[A-Za-z0-9 ]+$/;if(i.test(t)&&o.test(t)||t===""){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}else if(s==="DOUBLE"){if(!/^\d+$/.test(t)&&t!==""){if(t.split(".")[1]!==""&&t!=="."){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}else{if(t===""){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}}if(a===0){r.byId("idSave").setEnabled(true)}else{r.byId("idSave").setEnabled(false)}},onSubmit:function(e){sap.ui.core.BusyIndicator.show();var l=r.oGModel.getProperty("/sId");var s="";if(l==="Edit"){s="E"}var a={};a.PROFILE=r.byId("idPn").getValue();a.PRF_DESC=r.byId("idPdesc").getValue();a.CREATED_BY=s;a.METHOD=r.byId("idAlgo")._getSelectedItemText();if(a.PROFILE!==""&&a.PRF_DESC!==""&&a.METHOD!==""){r.getModel("BModel").callFunction("/createProfiles",{method:"GET",urlParameters:{PROFILE:a.PROFILE,METHOD:a.METHOD,PRF_DESC:a.PRF_DESC,CREATED_DATE:r.vDate,CREATED_BY:s},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Created Prediction profile");r.tablesendbatch()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("failed to created Prediction profile")}})}else{t.show("Please fill all required fields");sap.ui.core.BusyIndicator.hide()}},tablesendbatch:function(e){var t=r.byId("idTab").getItems(),l={PROFILEPARA:[]},s;r.getModel("BModel").setUseBatch(true);r.batchReq=true;r.iCount=t.length;r.comp=0;sap.ui.core.BusyIndicator.show();var a=r.oGModel.getProperty("/sId");var o;if(a==="Create"||a==="Copy"){o="I"}else if(a==="Edit"){o="E"}for(var i=0;i<t.length;i++){var d,g,n,u,A,E,I="",c="",T="";s={};d=r.byId("idPn").getValue();g=r.byId("idAlgo")._getSelectedItemText();u=t[i].getCells()[0].getText();A=t[i].getCells()[1].getText();if(t[i].getCells()[2].getSelectedKey()==="INTEGER"){E="INTEGER";if(t[i].getCells()[4].getValue()===""){I=parseInt(t[i].getCells()[3].getText())}else{if(t[i].getCells()[4].getValue()=="No default value"){I="0"}else{I=parseInt(t[i].getCells()[4].getValue())}}if(I.toString().includes("NaN")){I=null}s={PROFILE:d,METHOD:g,PARA_NAME:u,PARA_DESC:A,DATATYPE:E,INTVAL:I,DOUBLEVAL:null,STRVAL:null}}else if(t[i].getCells()[2].getSelectedKey()==="DOUBLE"){E="DOUBLE";if(t[i].getCells()[4].getValue()===""){c=parseFloat(t[i].getCells()[3].getText());if(c==="0"){c="0.0"}}else{if(t[i].getCells()[4].getValue()==="No default value"){c="0.0"}else{c=parseFloat(t[i].getCells()[4].getValue())}}if(c.toString().includes("NaN")){c=null}s={PROFILE:d,METHOD:g,PARA_NAME:u,PARA_DESC:A,DATATYPE:E,INTVAL:null,DOUBLEVAL:c,STRVAL:null}}else if(t[i].getCells()[2].getSelectedKey()==="NVARCHAR"){E="NVARCHAR";if(t[i].getCells()[4].getValue()===""){T=t[i].getCells()[3].getText()}else{if(t[i].getCells()[4].getValue()==="No default value"){T=""}else{T=t[i].getCells()[4].getValue()}}if(T.includes("NaN")){T=null}s={PROFILE:d,METHOD:g,PARA_NAME:u,PARA_DESC:A,DATATYPE:E,INTVAL:null,DOUBLEVAL:null,STRVAL:T}}l.PROFILEPARA.push(s);sap.ui.core.BusyIndicator.show();r.getModel("BModel").callFunction("/createProfilePara",{method:"GET",urlParameters:{FLAG:o,PROFILE:d,METHOD:g,PARA_NAME:u,INTVAL:s.INTVAL,DOUBLEVAL:s.DOUBLEVAL,STRVAL:s.STRVAL,PARA_DESC:A,PARA_DEP:"",CREATED_DATE:r.vDate,CREATED_BY:""},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Created profile parameters");r.onBack()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Failed to create profile parameters")}})}}})});
},
	"cp/appf/cpassignprofiles/controller/Home.controller.js":function(){sap.ui.define(["cp/appf/cpassignprofiles/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,r,s,a,i,n){"use strict";var l,d;return e.extend("cp.appf.cpassignprofiles.controller.Home",{onInit:function(){l=this;l.oListModel=new r;l.oParamModel=new r;l.oAlgoListModel=new r},onAfterRendering:function(){l=this;this.dDate=(new Date).toISOString().split("T")[0];l.oList=this.byId("profList");this.byId("headSearch").setValue("");l.oList.removeSelections();if(l.oList.getBinding("items")){l.oList.getBinding("items").filter([])}this.getData()},getData:function(){this.getModel("BModel").read("/getProfiles",{success:function(e){l.oListModel.setData({results:e.results});l.oList.setModel(l.oListModel)},error:function(){t.show("Failed to get profiles")}})},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];if(t!==""){o.push(new s({filters:[new s("PROFILE",a.Contains,t),new s("PRF_DESC",a.Contains,t),new s("METHOD",a.Contains,t)],and:false}))}l.oList.getBinding("items").filter(o)},onParameters:function(e){var o=e.getSource().getParent().getCells()[0].getTitle();var r=e.getSource().getParent().getCells()[1].getText();var i="Parameters "+" "+" - "+o+" "+" - "+r;if(!l._onParameter){l._onParameter=sap.ui.xmlfragment("cp.appf.cpassignprofiles.view.Parameter",l);l.getView().addDependent(l._onParameter)}l._onParameter.setTitleAlignment("Center");l._onParameter.setTitle(i);l.paramList=sap.ui.getCore().byId("idParam");this.getModel("BModel").read("/getProfileParameters",{filters:[new s("PROFILE",a.EQ,o),new s("METHOD",a.EQ,r)],success:function(e){l.oParamModel.setData({results:e.results});l.paramList.setModel(l.oParamModel);l._onParameter.open()},error:function(){t.show("Failed to get data")}})},onParaClose:function(){l._onParameter.close()},onCreate:function(e){l.oGModel=l.getModel("oGModel");var o=e.getSource().getTooltip();l.oGModel.setProperty("/sId",o);if(o==="Copy"||o==="Edit"){var r=this.byId("profList").getSelectedItems();if(r.length){var s=this.byId("profList").getSelectedItem().getBindingContext().getProperty().CREATED_BY;var a=r[0].getBindingContext().getProperty();l.oGModel.setProperty("/sProfile",a.PROFILE);l.oGModel.setProperty("/sProf_desc",a.PRF_DESC);l.oGModel.setProperty("/sMethod",a.METHOD);l.oGModel.setProperty("/sCreatedBy",s);var i=sap.ui.core.UIComponent.getRouterFor(l);i.navTo("Detail",{},true)}else{t.show("Please select one row")}}else if(o==="Create"){var i=sap.ui.core.UIComponent.getRouterFor(l);i.navTo("Detail",{},true)}},onDelete:function(e){var t=this.byId("profList").getSelectedItems()[0].getBindingContext().getProperty();sap.ui.core.BusyIndicator.show();var o={};o.PROFILE=t.PROFILE;o.METHOD=t.METHOD;o.PRF_DESC="D";sap.ui.core.BusyIndicator.show();l.getModel("BModel").callFunction("/createProfiles",{method:"GET",urlParameters:{PROFILE:o.PROFILE,METHOD:o.METHOD,PRF_DESC:o.PRF_DESC,CREATED_DATE:l.dDate,CREATED_BY:""},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Profile deleted");l.tablesendbatch()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Failed to delete Profile parameters")}})},tablesendbatch:function(){var e=this.byId("profList").getSelectedItems()[0].getBindingContext().getProperty();sap.ui.core.BusyIndicator.show();l.getModel("BModel").callFunction("/createProfilePara",{method:"GET",urlParameters:{FLAG:"D",PROFILE:e.PROFILE,METHOD:e.METHOD,PARA_NAME:"",INTVAL:0,DOUBLEVAL:0,STRVAL:"",PARA_DESC:"",PARA_DEP:"",CREATED_DATE:l.dDate,CREATED_BY:""},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Profile parameters deleted");l.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Failed to delete Profile parameters")}})},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var o=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(o,true)}}})});
},
	"cp/appf/cpassignprofiles/i18n/i18n.properties":'# This is the resource bundle for cp.appf.cpassignppf\n\n#Texts for manifest.json\n \n#XTIT: Application name\nappTitle=Maintain Prediction Profile\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Maintain Prediction Profile\n\nflpTitle=Maintain Prediction Profile\n\nflpSubtitle=\n\nprofTitle = Prediction Profile\n\nprof = Profile\nmethod = Method\nprofDesc = Profile Description\n\n\nprofName = Profile Name\ncreatedBy = Created By\nauth = Authorization\nalgo = Algorithm\n\nmlr = MLR\nhgbt = HGBT\nvarma = VARMA\nrdt= RDT\n\nparam = Parameter\nparamDesc = Parameter Description\ndesc = Description\ntype = Type\ndeValue = Default Value\nnotes = Notes\nuservalue = User Defined Value\nuserVal = User Value\n\n\nsave = Save\nclose = Close',
	"cp/appf/cpassignprofiles/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cp.appf.cpassignprofiles","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cp-appf-cpassignprofiles-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpassignprofiles","action":"Display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://add-coursebook"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cp.appf.cpassignprofiles.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.97.2","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cp.appf.cpassignprofiles.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cp.appf.cpassignprofiles.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":"Home"},{"name":"Detail","pattern":"Detail","target":"Detail"}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewId":"Home","viewName":"Home"},"Detail":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewId":"Detail","viewName":"Detail"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cp/appf/cpassignprofiles/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cp/appf/cpassignprofiles/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var a=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function r(e,t){Object.keys(e).forEach(function(e){if(!a.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(a,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=r(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=r(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=r(e["sap.ui5"].componentUsages,n)}}a(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=scripts[scripts.length-1];var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cp/appf/cpassignprofiles/view/App.view.xml":'<mvc:View controllerName="cp.appf.cpassignprofiles.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cp/appf/cpassignprofiles/view/Detail.view.xml":'<mvc:View controllerName="cp.appf.cpassignprofiles.controller.Detail"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"><Page id="idPage" title="Create Profile" titleAlignment="Center" showNavButton="true" navButtonPress="onBack" showFooter="true" class="boldText"><VBox class="sapUiSmallMargin"><f:SimpleForm id="FormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="3" labelSpanL="3" labelSpanM="3" labelSpanS="3" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1" singleContainerFullSize="false" ariaLabelledBy="Title1"><f:content><Label text="{i18n>profName}"/><Input id="idPn" value="" width="300px"/><Label text="{i18n>profDesc}"/><Input id="idPdesc" value="" width="300px"/><Label text="{i18n>auth}"/><Input id="idAuth" value="" width="300px" visible="false"/><Label text="{i18n>algo}"/><Select id="idAlgo" change="onAlgorChange" selectedKey="N" width="130px"><core:ListItem key="N" text="No Data"/><core:ListItem key="M" text="{i18n>mlr}"/><core:ListItem key="H" text="{i18n>hgbt}"/><core:ListItem key="V" text="{i18n>varma}"/><core:ListItem key="R" text="{i18n>rdt}"/></Select></f:content></f:SimpleForm></VBox><content><Table id="idTab" items="{path: \'/results\'}"><columns><Column hAlign="Left" vAlign="Middle" width="180px"><Text text="{i18n>param}" /></Column><Column hAlign="Left" vAlign="Middle" width="700px"><Text text="{i18n>desc}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>type}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>deValue}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>uservalue}"/></Column></columns><items><ColumnListItem><Text text="{PARA_NAME}"/><Text text="{DESCRIPTION}"/><Select id="idTypes" change="onTypeChange" selectedKey="{DATATYPE}" editable="false"><core:ListItem key="INTEGER" text="Integer"/><core:ListItem key="DOUBLE" text="Double"/><core:ListItem key="NVARCHAR" text="String"/></Select><Text text="{DEFAULTVAL}"/><Input id="idDatatype" value="" liveChange="onLive" valueState="None"/></ColumnListItem></items></Table></content><footer><Toolbar id="idFooter"><ToolbarSpacer/><Button id="idSave" type=\'Ghost\' text="{i18n>save}" press="onSubmit"></Button></Toolbar></footer></Page></mvc:View>\n',
	"cp/appf/cpassignprofiles/view/Home.view.xml":'<mvc:View controllerName="cp.appf.cpassignprofiles.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page id="_IDGenPage1" ><customHeader><Toolbar id="_IDGenToolbar1" ><Title id="profTitle" text="{i18n>profTitle}" class="boldText"></Title><ToolbarSpacer id="_IDGenToolbarSpacer1"/><Button id="idAdd" text="Create" icon="sap-icon://add" press="onCreate" tooltip = "Create"/><Button id="idCopy" text="Copy" icon="sap-icon://copy" press="onCreate" tooltip = "Copy"/><Button id="idEdit" text="Edit" icon="sap-icon://edit" press="onCreate" tooltip = "Edit"/><Button id="idDelete" text="Delete" icon="sap-icon://delete" press="onDelete" tooltip = "Delete"/><Button icon="sap-icon://sys-help" id="idNav" press="onNavPress" type="Emphasized" tooltip="Help Document"/></Toolbar></customHeader><content><SearchField id="headSearch" liveChange="onSearch" placeholder="Profile or Description"/><Table id="profList" items="{path: \'/results\'}" mode="SingleSelectLeft"><columns><Column id="_IDGenColumn1" hAlign="Left" vAlign="Middle"><Text id="_IDGenText1" text="{i18n>prof}" /></Column><Column id="_IDGenColumn2" hAlign="Left" vAlign="Middle"><Text id="_IDGenText2" text="{i18n>method}"/></Column><Column id="_IDGenColumn3" hAlign="Left" vAlign="Middle"><Text id="_IDGenText3" text="{i18n>profDesc}"/></Column><Column id="_IDGenColumn4" hAlign="Left" vAlign="Middle"><Text id="_IDGenText4" text="{i18n>auth}"/></Column><Column id="_IDGenColumn5" hAlign="Left" vAlign="Middle"><Text id="_IDGenText5" text=""/></Column></columns><items><ColumnListItem id="_IDGenColumnListItem1"><cells><ObjectIdentifier id="_IDGenObjectIdentifier1" title="{PROFILE}" /><Text id="_IDGenText6" text="{METHOD}"/><Text id="_IDGenText7" text="{PRF_DESC}"/><Text id="_IDGenText8" text="{AUTHORIZATION}"/><Button id="idDisplay" icon="sap-icon://display" tooltip="Display" press="onParameters" iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></content></Page></mvc:View>\n',
	"cp/appf/cpassignprofiles/view/Parameter.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form"><Dialog title="" contentWidth="800px" ><Table id="idParam"  items="{path: \'/results\'}" ><columns><Column hAlign="Left" vAlign="Middle" width="200px"><Text text="{i18n>param}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>paramDesc}"/></Column><Column hAlign="Left" vAlign="Middle" width="120px"><Text text="{i18n>userVal}"/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{PARA_NAME}" /><Text text="{PARA_DESC}"/><Text text="{= ${DOUBLEVAL} === null ? ${STRVAL} !== null ? ${STRVAL} : ${INTVAL} : ${DOUBLEVAL} }"/></cells></ColumnListItem></items></Table><buttons><Button type=\'Reject\' text="{i18n>close}" press="onParaClose"></Button></buttons></Dialog></core:FragmentDefinition>'
}});
