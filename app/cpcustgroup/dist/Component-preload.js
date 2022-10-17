//@ui5-bundle cpapp/cpcustgroup/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpcustgroup/Component.js":function(){sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("cpapp.cpcustgroup.Component",{metadata:{manifest:"json"}})});
},
	"cpapp/cpcustgroup/i18n/i18n.properties":'# This is the resource bundle for cpcustgroup\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Customer Group\n\n#YDES: Application description\nappDescription=A Fiori application.\n\nflpTitle=Customer Group\n\nflpSubtitle=\n',
	"cpapp/cpcustgroup/manifest.json":'{"_version":"1.28.0","sap.app":{"id":"cpapp.cpcustgroup","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"catalog/","type":"OData","settings":{"odataVersion":"4.0"}}},"offline":false,"resources":"resources.json","sourceTemplate":{"id":"ui5template.fiorielements.v4.lrop","version":"1.0.0"},"crossNavigation":{"inbounds":{"cpapp-cpcustgroup-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"customergroup","action":"Display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://customer"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"resources":{"js":[],"css":[]},"dependencies":{"minUI5Version":"1.84.0","libs":{"sap.ui.core":{},"sap.fe.templates":{}}},"models":{"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"},"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"routing":{"routes":[{"pattern":":?query:","name":"getCustgroupList","target":"getCustgroupList"},{"pattern":"getCustgroup({key}):?query:","name":"getCustgroupObjectPage","target":"getCustgroupObjectPage"}],"targets":{"getCustgroupList":{"type":"Component","id":"getCustgroupList","name":"sap.fe.templates.ListReport","options":{"settings":{"entitySet":"getCustgroup","variantManagement":"Page","navigation":{"getCustgroup":{"detail":{"route":"getCustgroupObjectPage"}}},"initialLoad":true}}},"getCustgroupObjectPage":{"type":"Component","id":"getCustgroupObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"entitySet":"getCustgroup"}}}}},"contentDensities":{"compact":true,"cozy":true}},"sap.platform.abap":{"_version":"1.1.0","uri":""},"sap.platform.hcp":{"_version":"1.1.0","uri":""},"sap.fiori":{"_version":"1.1.0","registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}'
}});
