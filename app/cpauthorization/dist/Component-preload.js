//@ui5-bundle cpapp/cpauthorization/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpauthorization/Component.js":function(){sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("cpapp.cpauthorization.Component",{metadata:{manifest:"json"}})});
},
	"cpapp/cpauthorization/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpauthorization\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Authorizations\n\n#YDES: Application description\nappDescription=A Fiori application.\n\nflpTitle=Authorization\n\nflpSubtitle=\n',
	"cpapp/cpauthorization/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpauthorization","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:lrop","version":"1.6.7","toolsId":"c0640f0c-7e50-49b3-a1fb-c4b1d35d1195"},"dataSources":{"mainService":{"uri":"catalog/","type":"OData","settings":{"annotations":["annotation"],"localUri":"localService/metadata.xml","odataVersion":"4.0"}},"annotation":{"type":"ODataAnnotation","uri":"annotations/annotation.xml","settings":{"localUri":"annotations/annotation.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpauthorization-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"authorization","action":"Display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://key"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.104.2","libs":{"sap.m":{},"sap.ui.core":{},"sap.ushell":{},"sap.fe.templates":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpauthorization.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"config":{},"routes":[{"pattern":":?query:","name":"getARObjList","target":"getARObjList"},{"pattern":"getARObj({key}):?query:","name":"getARObjObjectPage","target":"getARObjObjectPage"}],"targets":{"getARObjList":{"type":"Component","id":"getARObjList","name":"sap.fe.templates.ListReport","options":{"settings":{"entitySet":"getARObj","variantManagement":"Page","navigation":{"getARObj":{"detail":{"route":"getARObjObjectPage"}}}}}},"getARObjObjectPage":{"type":"Component","id":"getARObjObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"entitySet":"getARObj"}}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User","$XSAPPNAME.Developer"]}}'
}});
