//@ui5-bundle cpapp/cpauthentication/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpauthentication/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpauthentication/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpauthentication.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpauthentication/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("cpapp.cpauthentication.controller.controller.App",{onInit(){}})});
},
	"cpapp/cpauthentication/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpauthentication.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
<<<<<<< HEAD
	"cpapp/cpauthentication/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpauthentication/controller/BaseController"],function(e,n){"use strict";return n.extend("cpapp.cpauthentication.controller.Home",{onInit:function(){this.doSomethingUserDetails()},doSomethingUserDetails:async function(){const e=await this.getUserInfoService();const n=e.getEmail();console.log(n);var t=this.getLogonUser()},getUserInfoService:function(){return new Promise(e=>sap.ui.require(["sap/ushell/library"],n=>{const t=n.Container;const o=t.getServiceAsync("UserInfo");e(o)}))},getLogonUser:function(){var e="DEFAULT_USER",n;if(sap.ushell){n=sap.ushell.Container.getService("UserInfo");if(n){e=n.getId()}}return e},onNavPress:function(){}})});
=======
	"cpapp/cpauthentication/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpauthentication/controller/BaseController"],function(e,t){"use strict";return t.extend("cpapp.cpauthentication.controller.Home",{onInit:function(){this.doSomethingUserDetails()},doSomethingUserDetails:async function(){const e=await this.getUserInfoService();const t=e.getEmail();console.log(t);var n=this.getLogonUser()},getUserInfoService:function(){return new Promise(e=>sap.ui.require(["sap/ushell/library"],t=>{const n=t.Container;const r=n.getServiceAsync("UserInfo");e(r)}))},getLogonUser:function(){var e="DEFAULT_USER",t;if(sap.ushell){t=sap.ushell.Container.getService("UserInfo");if(t){e=t.getId()}}return e},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var n=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(n,true)}}})});
>>>>>>> 28b4cbdcefef27b470353a829db9bc87d32c7296
},
	"cpapp/cpauthentication/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpauthentication\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Authorization and Roles\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Authorization and Roles\n\nflpTitle=Authorization and Roles\n\nflpSubtitle=\n',
	"cpapp/cpauthentication/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpauthentication","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.1","toolsId":"0b312fa4-8af6-4259-8f12-b1b96441db47"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/metadata.xml","odataVersion":"2.0"}},"userapi":{"uri":"service/users"}},"crossNavigation":{"inbounds":{"cpapp-cpauthentication-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"authentication","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://BusinessSuiteInAppSymbols/icon-fma-validation"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.107.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpauthentication.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"userapi":{"dataSource":"userapi","type":"sap.ui.model.json.JSONModel","preload":true,"settings":{"defaultBindingMode":"OneWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpauthentication.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":":?query:","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpauthentication.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpauthentication/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpauthentication/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpauthentication/view/App.view.xml":'<mvc:View controllerName="cpapp.cpauthentication.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"cpapp/cpauthentication/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpauthentication.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page id="page" title="{i18n>title}"><customHeader><Toolbar id="_IDGenToolbar1" ><Title id="profTitle" text="{i18n>title}" class="boldText"></Title><ToolbarSpacer id="_IDGenToolbarSpacer1"/><Button icon="sap-icon://sys-help" id="idNav" press="onNavPress" type="Emphasized" tooltip="Help Document"/></Toolbar></customHeader><content><VBox><Label text = "Display Name : {userModel>/decodedJWTToken/givenName} {userModel>/decodedJWTToken/family_name}"/><Label text = "Email : {userModel>/decodedJWTToken/email} "/><Link text="/user-api/attributes" href="/user-api/attributes" /></VBox></content></Page></mvc:View>\n'
}});
