//@ui5-bundle cpapp/cpprscchar/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpprscchar/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpprscchar/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpprscchar.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpprscchar/Utils.js":function(){sap.ui.define(["sap/m/MessageToast"],function(e){"use strict";var t={ranking:{Initial:0,Default:1024,Before:function(e){return e+1024},Between:function(e,t){return(e+t)/2},After:function(e){return e/2}},getAvailableProductsTable:function(e){return e.getOwnerComponent().getRootControl().byId("availableProducts").byId("table")},getSelectedProductsTable:function(e){return e.getOwnerComponent().getRootControl().byId("selectedProducts").byId("table")},getSelectedItemContext:function(t,n){var r=t.getSelectedItems();var o=r[0];if(!o){e.show("Please select a row!");return}var a=o.getBindingContext();if(a&&n){var u=t.indexOfItem(o);n(a,u,t)}return a}};return t},true);
},
	"cpapp/cpprscchar/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpprscchar.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpprscchar/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpprscchar.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpprscchar/controller/Home.controller.js":function(){sap.ui.define(["cpapp/cpprscchar/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","cpapp/cpprscchar/Utils","sap/ui/core/dnd/DragInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/library","sap/ui/model/Sorter"],function(e,t,a,r,o,s,i,l,n,c){"use strict";var d,u;var h=n.dnd.DropLayout;var g=n.dnd.DropPosition;return e.extend("cpapp.cpprscchar.controller.Home",{onInit:function(){d=this;this.PrimarylistModel=new t;this.SeclistModel=new t;this.SearchModel=new t;d.locModel=new t;d.prodModel=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpprscchar.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpprscchar.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}d.oSelectedItem="";this.attachDragDrop()},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");d._valueHelpDialogProd.setTitleAlignment("Center");d._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onGetData:function(){var e=d.byId("idloc").getValue(),t=d.byId("prodInput").getValue();if(e!==""&&t!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"G",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();d.oPList=d.byId("Primarytable"),d.oSList=d.byId("Secondarytable");d.primaryData=[],d.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){d.primaryData.push(e.results[t])}else{d.secData.push(e.results[t])}}d.finalSecData=[];for(var a=0;a<=d.secData.length;a++){for(var r=0;r<d.secData.length;r++){if(a===d.secData[r].SEQUENCE){d.finalSecData.push(d.secData[r]);break}}}d.PrimarylistModel.setData({results:d.primaryData});d.oPList.setModel(d.PrimarylistModel);d.SeclistModel.setData({results:d.finalSecData});d.oSList.setModel(d.SeclistModel);d.searchlist=d.finalSecData;d.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},d);d.SearchModel.setData({results:d.searchlist});d.byId("searchField").setModel(d.SearchModel);var o=d.oSList.getItems();if(d.oSelectedItem){for(var t=0;t<o.length;t++){if(d.oSelectedItem===o[t].getCells()[1].getText()){o[t].focus();o[t].setSelected(true)}}}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onReset:function(){var e=d.byId("idloc").getValue(),t=d.byId("prodInput").getValue();d.oSelectedItem="";this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"R",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();d.oPList=d.byId("Primarytable"),d.oSList=d.byId("Secondarytable");d.primaryData=[],d.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){d.primaryData.push(e.results[t])}else{d.secData.push(e.results[t])}}d.finalSecData=[];for(var a=0;a<=d.secData.length;a++){for(var r=0;r<d.secData.length;r++){if(a===d.secData[r].SEQUENCE){d.finalSecData.push(d.secData[r]);break}}}d.PrimarylistModel.setData({results:d.primaryData});d.oPList.setModel(d.PrimarylistModel);d.SeclistModel.setData({results:d.finalSecData});d.oSList.setModel(d.SeclistModel);d.searchlist=d.SeclistModel;d.searchlist.forEach(function(e){e.CHAR_NAME=e.CHAR_NAME+" - "+e.CHAR_DESC},d);d.byId("searchField").setModel(d.SeclistModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{a.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),a=e.getParameter("id"),s=[];t=t?t.trim():"";if(a.includes("Loc")){if(t!==""){s.push(new r({filters:[new r("LOCATION_ID",o.Contains,t),new r("LOCATION_DESC",o.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(s)}else if(a.includes("prod")){if(t!==""){s.push(new r({filters:[new r("PRODUCT_ID",o.Contains,t),new r("PROD_DESC",o.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(s)}},handleSelection:function(e){var t=e.getParameter("id"),s=e.getParameter("selectedItems"),i,l=[];if(t.includes("Loc")){this.oLoc=d.byId("idloc");var n=e.getParameter("selectedItems");d.oLoc.setValue(n[0].getTitle());d.byId("prodInput").setValue("");this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new r("LOCATION_ID",o.EQ,n[0].getTitle())],success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){this.oProd=d.byId("prodInput");var c=e.getParameter("selectedItems");d.oProd.setValue(c[0].getTitle())}},attachDragDrop:function(){var e=this.byId("Primarytable");e.addDragDropConfig(new i({sourceAggregation:"items"}));e.addDragDropConfig(new l({targetAggregation:"items",dropPosition:g.Between,dropLayout:h.Vertical,drop:this.onDrop.bind(this)}));var t=this.byId("Secondarytable");t.addDragDropConfig(new i({sourceAggregation:"items"}));t.addDragDropConfig(new l({targetAggregation:"items",dropPosition:g.Between,dropLayout:h.Vertical,drop:d.onDrop.bind(d)}))},onDrop:function(e){var t=e.getParameter("draggedControl"),r=e.getParameter("droppedControl"),o=e.getParameter("dropPosition"),s=t.getParent(),i=e.getSource().getParent(),l=s.getModel(),n=i.getModel(),c=l.getData(),u=n.getData(),h=s.indexOfItem(t),g=i.indexOfItem(r);var p=c.results[h];c.results.splice(h,1);if(l===n&&h<g){g--}if(o==="After"){g++}u.results.splice(g,0,p);if(l!==n){var f;var D=0;if(p.CHAR_TYPE==="S"){D=p.SEQUENCE;f="P"}else{f="S";D=u.results.length}d.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:p.LOCATION_ID,PRODUCT_ID:p.PRODUCT_ID,CHAR_NUM:p.CHAR_NUM,SEQUENCE:D,CHAR_TYPE:f,FLAG:"C"},success:function(e){sap.ui.core.BusyIndicator.hide();d.byId("idPrimarySearch").setValue("");d.onPrimarySearch();d.byId("searchField").setValue("");d.onCharSearch();d.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}else{n.setData(u);var I=this.byId("Secondarytable").getItems();d.oSelectedItem=p.CHAR_NAME;d.onSaveSeq(g)}},onSaveSeq:function(e){var t=this.byId("Secondarytable").getItems();d.count=e+2;var r=0;for(var o=0;o<t.length;o++){var s={};s.Location=d.byId("idloc").getValue();s.product=d.byId("prodInput").getValue();s.CharNo=t[o].getCells()[0].getText();s.SEQUENCE=o+1;s.FLAG="E";s.CHAR_TYPE="S";d.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:s.Location,PRODUCT_ID:s.product,CHAR_NUM:s.CharNo,SEQUENCE:s.SEQUENCE,CHAR_TYPE:s.CHAR_TYPE,FLAG:s.FLAG},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.changeToPrimary.includes("successful")){r=r+1}if(r+1===d.count){a.show("Successfully changed the sequence");d.byId("searchField").setValue("");d.onCharSearch();d.onGetData()}},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}},onPrimarySearch:function(){var e=d.byId("idPrimarySearch").getValue(),t=[];e=e?e.trim():"";if(e!==""){t.push(new r({filters:[new r("CHAR_NAME",o.Contains,e)],and:false}))}d.byId("Primarytable").getBinding("items").filter(t)},onCharSearch:function(e){var t=d.byId("searchField").getValue(),a=this.byId("Secondarytable").getItems();t=t?t.trim():"";if(t===""){a[0].focus();a[0].setSelected(true)}else{t=t.split("-")[0].trim();for(var r=0;r<a.length;r++){if(t===a[r].getCells()[1].getText()){a[r].focus();a[r].setSelected(true)}}}},onSuggest:function(e){var t=e.getParameter("suggestValue"),a=[];a=[new r([new r("Char",function(e){return(e||"").toUpperCase().indexOf(t.toUpperCase())>-1})],false)];this.byId("searchField").getBinding("suggestionItems").filter(a);this.byId("searchField").suggest()},onPressUpdate:function(e){var t=d.byId("idloc").getValue(),r=d.byId("prodInput").getValue();if(t!==""&&r!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"U",LOCATION_ID:t,PRODUCT_ID:r},success:function(e){sap.ui.core.BusyIndicator.hide();a.show("Updated Successfully");d.oPList=d.byId("Primarytable"),d.oSList=d.byId("Secondarytable");d.primaryData=[],d.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){d.primaryData.push(e.results[t])}else{d.secData.push(e.results[t])}}d.finalSecData=[];for(var r=0;r<=d.secData.length;r++){for(var o=0;o<d.secData.length;o++){if(r===d.secData[o].SEQUENCE){d.finalSecData.push(d.secData[o]);break}}}d.PrimarylistModel.setData({results:d.primaryData});d.oPList.setModel(d.PrimarylistModel);d.SeclistModel.setData({results:d.finalSecData});d.oSList.setModel(d.SeclistModel);d.searchlist=d.finalSecData;d.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},d);d.SearchModel.setData({results:d.searchlist});d.byId("searchField").setModel(d.SearchModel);var s=d.oSList.getItems();if(d.oSelectedItem){for(var t=0;t<s.length;t++){if(d.oSelectedItem===s[t].getCells()[1].getText()){s[t].focus();s[t].setSelected(true)}}}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var a=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(a,true)}}})});
},
	"cpapp/cpprscchar/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpprscchar\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Characteristic Prioritization\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Characteristic Prioritization\n\nflpTitle=Characteristic Prioritization\n\nflpSubtitle=\n\npcharTitle = Primary Characteristics\nsCharTitle =Secondary Characteristics\n\nloc=Location\nLoc=Location\nprod=Configurable Product\nPrdId=Configurable Product\ncharno = Char No\ncharname = Characteristics Name\nchardesc Characteristics Description\nseq=Sequence\n\nsaveseq=Save Sequence\n',
	"cpapp/cpprscchar/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpprscchar","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap-ux/fiori-freestyle-writer:basic","version":"0.11.15","toolsId":"01985d96-73c9-43c8-994c-c2f2528bda3d"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpprscchar-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpprscchar","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://BusinessSuiteInAppSymbols/icon-priority-2"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpprscchar.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.103.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpprscchar.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpprscchar.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpprscchar/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpprscchar/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpprscchar/view/App.view.xml":'<mvc:View controllerName="cpapp.cpprscchar.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpprscchar/view/Home.view.xml":'<mvc:View\n    controllerName="cpapp.cpprscchar.controller.Home"\n    xmlns:dnd="sap.ui.core.dnd"\n    xmlns:ux="sap.uxap"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc"\n    displayBlock="true"\n    xmlns:l="sap.ui.layout"\n    xmlns:unified="sap.ui.unified"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"\n    xmlns="sap.m"\n    xmlns:m="sap.m"\n><Page id="page2" showHeader="false" showFooter="true" enableScrolling="false"><content><ux:ObjectPageLayout id="ObjectPageLayout" showAnchorBar="false" height="165px"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><HBox><Title id="_IDGenTitle1" text="{i18n>title}" class="boldText" titleAlignment="Center" /><Button class="hdrBtnMarginHdr" id="_IDGenOverflowToolbarButton1" icon="sap-icon://sys-help" text="" type="Emphasized" press="onNavPress" tooltip="Help Document"/></HBox></ux:expandedHeading><ux:snappedHeading><HBox id="_IDGenFlexBox1" fitContainer="true" alignItems="Center" ><Title id="_IDGenTitle2" text="{i18n>title}"  /><Button class="hdrBtnMarginHdr" id="_IDGenOverflowToolbarButton2" icon="sap-icon://sys-help" text="" type="Emphasized" press="onNavPress" tooltip="Help Document"/></HBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="NoWrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox><Label text="Location" required="true" /><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="Configurable Product" required="true" /><Input id="prodInput" value="" placeholder="Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="" /><HBox><Button id="idData" text="Go" type="Emphasized" press="onGetData" /></HBox></VBox></l:Grid></FlexBox></ux:headerContent></ux:ObjectPageLayout><unified:SplitContainer id="mySplitContainer" showSecondaryContent="false"><unified:content><l:Splitter id="homeScrSplitter"><Page title="{i18n>pcharTitle}" titleAlignment="Center"><layoutData><l:SplitterLayoutData resizable="false" size="50%" /></layoutData><content><Toolbar><SearchField liveChange="onPrimarySearch" placeholder="Characteristics Name" width="100%" id="idPrimarySearch" /></Toolbar><Table id="Primarytable" mode="SingleSelectMaster" items="{ path: \'/results\'}"><columns><Column hAlign="Center" visible="false"><Text text="{i18n>charno}" /></Column><Column hAlign="Center"><Text text="{i18n>charname}" /></Column><Column hAlign="Center"><Text text="{i18n>chardesc}" /></Column></columns><dragDropConfig><dnd:DragInfo groupName="selected2available" sourceAggregation="items" /><dnd:DropInfo groupName="available2selected" targetAggregation="items" dropPosition="Between" drop="onDropSelectedProductsTable" /><dnd:DragDropInfo sourceAggregation="items" targetAggregation="items" dropPosition="Between" drop="onDropSelectedProductsTable" /></dragDropConfig><items><ColumnListItem><cells><Text text="{CHAR_NUM}" /><Text text="{CHAR_NAME}" /><Text text="{CHAR_DESC}" /></cells></ColumnListItem></items></Table></content></Page><Page title="{i18n>sCharTitle}" titleAlignment="Center" showFooter="true"><layoutData><l:SplitterLayoutData resizable="false" size="50%" /></layoutData><Toolbar><SearchField id="searchField" width="100%" placeholder="Characteristics Name" enableSuggestions="true" search="onCharSearch" suggest="onSuggest" suggestionItems="{ path: \'/results\'}"><SuggestionItem text="{Char}" key="{Char}" /></SearchField></Toolbar><Table id="Secondarytable" mode="SingleSelectMaster" items="{ path: \'/results\'}" itemPress="handleSelection"><columns><Column hAlign="Center" visible="false"><Text text="{i18n>charno}" /></Column><Column hAlign="Center"><Text text="{i18n>charname}" /></Column><Column hAlign="Center" visible="false"><Text text="{i18n>seq}" /></Column><Column hAlign="Center"><Text text="{i18n>chardesc}" /></Column></columns><dragDropConfig><dnd:DragInfo groupName="selected2available" sourceAggregation="items" /><dnd:DropInfo groupName="available2selected" targetAggregation="items" dropPosition="Between" drop="onDropSelectedProductsTable" /><dnd:DragDropInfo sourceAggregation="items" targetAggregation="items" dropPosition="Between" drop="onDropSelectedProductsTable" /></dragDropConfig><items><ColumnListItem type="Active"><cells><Text text="{CHAR_NUM}" /><Text text="{CHAR_NAME}" /><Text text="{SEQUENCE}" /><Text text="{CHAR_DESC}" /></cells></ColumnListItem></items></Table></Page></l:Splitter></unified:content></unified:SplitContainer></content><footer><OverflowToolbar><ToolbarSpacer/><Button id="idUpdate" icon="sap-icon://cancel-maintenance" text="Update" type="Emphasized" press="onPressUpdate" /><Button id="idReset" icon="sap-icon://repost" text="Reset" type="Emphasized" press="onReset" /></OverflowToolbar></footer></Page></mvc:View>\n',
	"cpapp/cpprscchar/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpprscchar/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose" multiSelect="false"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
