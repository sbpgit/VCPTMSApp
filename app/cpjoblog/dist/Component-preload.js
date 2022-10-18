//@ui5-bundle cpapp/cpjoblog/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpjoblog/Component.js":function(){sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("cpapp.cpjoblog.Component",{metadata:{manifest:"json"}})});
},
	"cpapp/cpjoblog/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpjoblog\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Job Scheduler Log\n\n#YDES: Application description\nappDescription=A Fiori application.\n\nflpTitle=Job Scheduler Log\n\nflpSubtitle=\n',
	"cpapp/cpjoblog/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpjoblog","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap-ux/fiori-elements-writer:lrop","version":"0.3.6","toolsId":"e38f7574-7cb6-4c67-bbe4-6ddf2401cf54"},"dataSources":{"mainService":{"uri":"jobs/","type":"OData","settings":{"annotations":["annotation"],"localUri":"localService/metadata.xml","odataVersion":"4.0"}},"annotation":{"type":"ODataAnnotation","uri":"annotations/annotation.xml","settings":{"localUri":"annotations/annotation.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpjoblog-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"joblogs","action":"Display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://bullet-text"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.ushell":{},"sap.fe.templates":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpjoblog.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"routes":[{"pattern":":?query:","name":"getJobStatusList","target":"getJobStatusList"},{"pattern":"getJobStatus({key}):?query:","name":"getJobStatusObjectPage","target":"getJobStatusObjectPage"}],"targets":{"getJobStatusList":{"type":"Component","id":"getJobStatusList","name":"sap.fe.templates.ListReport","options":{"settings":{"entitySet":"getJobStatus","variantManagement":"Page","navigation":{"getJobStatus":{"detail":{"route":"getJobStatusObjectPage"}}},"initialLoad":true}}},"getJobStatusObjectPage":{"type":"Component","id":"getJobStatusObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"entitySet":"getJobStatus"}}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":false,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}'
}});
