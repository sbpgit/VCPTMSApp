//@ui5-bundle cpapp/cpasmbcompreq/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpasmbcompreq/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpasmbcompreq/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpasmbcompreq.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpasmbcompreq/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpasmbcompreq.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpasmbcompreq/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpasmbcompreq.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpasmbcompreq/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpasmbcompreq/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,l,i,a,r){"use strict";var s,d;return t.extend("cpapp.cpasmbcompreq.controller.Home",{onInit:function(){d=this;this.rowData;d.locModel=new o;d.prodModel=new o;d.verModel=new o;d.scenModel=new o;d.compModel=new o;d.struModel=new o;d.charModel=new o;d.graphModel=new o;d.graphtModel=new o;d.locModel.setSizeLimit(1e3);d.prodModel.setSizeLimit(1e3);d.verModel.setSizeLimit(1e3);d.scenModel.setSizeLimit(1e3);d.compModel.setSizeLimit(1e3);d.struModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}if(!this._valueHelpDialogComp){this._valueHelpDialogComp=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.ComponentDialog",this);this.getView().addDependent(this._valueHelpDialogComp)}if(!this._valueHelpDialogStru){this._valueHelpDialogStru=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.StructureNodeDialog",this);this.getView().addDependent(this._valueHelpDialogStru)}if(!this._odGraphDialog){this._odGraphDialog=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.CompODBreakdown",this);this.getView().addDependent(this._odGraphDialog)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();d.colComp="";d.colDate="";d.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oComp=this.byId("idcomp");this.oStru=this.byId("idstru");this.oPanel=this.byId("idPanel");d._valueHelpDialogProd.setTitleAlignment("Center");d._valueHelpDialogLoc.setTitleAlignment("Center");d._valueHelpDialogVer.setTitleAlignment("Center");d._valueHelpDialogScen.setTitleAlignment("Center");d._valueHelpDialogComp.setTitleAlignment("Center");d._valueHelpDialogStru.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");this.oCompList=this._oCore.byId(this._valueHelpDialogComp.getId()+"-list");this.oStruList=this._oCore.byId(this._valueHelpDialogStru.getId()+"-list");this.oGridList=this._oCore.byId(sap.ui.getCore().byId("charOdDialog").getContent()[0].getId());this.oGraphchart=this._oCore.byId(sap.ui.getCore().byId("idPanel").getContent()[0].getId());sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onResetDate:function(){d.byId("fromDate").setValue("");d.byId("toDate").setValue("");s.setProperty("/resetFlag","X");d.oLoc.setValue("");d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");d.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();var t={},o=[],l;d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var i=d.oGModel.getProperty("/SelectedLoc"),a=d.oGModel.getProperty("/SelectedProd"),r=d.oGModel.getProperty("/SelectedVer"),s=d.oGModel.getProperty("/SelectedScen"),n=d.oGModel.getProperty("/SelectedComp"),c=d.oGModel.getProperty("/SelectedStru"),g=d.byId("idModelVer").getSelectedKey();d.oGModel.setProperty("/SelectedMV",d.byId("idModelVer").getSelectedKey());var u=this.byId("fromDate").getDateValue();var p=this.byId("toDate").getDateValue();u=d.getDateFn(u);p=d.getDateFn(p);if(i!==undefined&&a!==undefined&&r!==undefined&&s!==undefined&&g!==undefined){if(n===undefined){n=""}if(c===undefined){c=""}d.getModel("BModel").callFunction("/getAsmbCompReqFWeekly",{method:"GET",urlParameters:{LOCATION_ID:i,PRODUCT_ID:a,VERSION:r,SCENARIO:s,FROMDATE:u,TODATE:p,MODEL_VERSION:g},success:function(e){sap.ui.core.BusyIndicator.hide();d.rowData=e.results;d.oGModel.setProperty("/TData",e.results);d.TableGenerate();var t=d.byId("idCheck1").getSelected();if(t){d.onNonZero()}},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario")}},onSearchCompReq:function(e){d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var t=e.getParameter("value")||e.getParameter("newValue");if(t===""){d.onNonZero()}else{d.oGModel=d.getModel("oGModel");d.Data=d.oGModel.getProperty("/TData");d.searchData=[];for(var o=0;o<d.Data.length;o++){if(d.Data[o].COMPONENT.includes(t)||d.Data[o].STRUC_NODE.includes(t)||d.Data[o].QTYTYPE.includes(t)){d.searchData.push(d.Data[o])}}d.oGModel.setProperty("/TData",d.searchData);d.TableGenerate()}},TableGenerate:function(){var e={},t=[],o;d.oGModel=d.getModel("oGModel");d.tableData=d.oGModel.getProperty("/TData");var l;var i=new Date(d.byId("fromDate").getDateValue()),a=new Date(d.byId("toDate").getDateValue());i=i.toISOString().split("T")[0];a=a.toISOString().split("T")[0];var r=d.generateDateseries(i,a);for(var s=0;s<d.tableData.length;s++){e.Component=d.tableData[s].COMPONENT;o=1;for(let t=1;t<r.length;t++){e[r[t].CAL_DATE]=d.tableData[s]["WEEK"+o];o++}t.push(e);e={}}var n=new sap.ui.model.json.JSONModel;n.setData({rows:t,columns:r});d.oTable.setModel(n);d.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().CAL_DATE;if(o==="Component"){return new sap.ui.table.Column({width:"8rem",label:o,template:o})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Link({text:"{"+o+"}",press:d.linkPressed})})}});d.oTable.bindRows("/rows")},onNonZero:function(e){d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var t=d.byId("idCheck1").getSelected(),o,l;d.searchData=d.rowData;d.FinalData=[];var i=d.oTable.getColumns().length-3,a=d.tableData;if(t){for(var r=0;r<d.searchData.length;r++){l=0;for(var s=1;s<i;s++){if(d.searchData[r]["WEEK"+s]!==0&&d.searchData[r]["WEEK"+s]!==null){l=l+1;break}}if(l!==0){d.FinalData.push(d.searchData[r])}}}else{d.FinalData=d.searchData}d.oGModel.setProperty("/TData",d.FinalData);d.TableGenerate()},linkPressed:function(e){var t=e.getSource().getAriaLabelledBy()[0];if(t==="__column0"||t==="__column1"||t==="__column2"){sap.m.MessageToast.show("Please click on any quantity")}else{d.charModel.setData([]);d.oGridList.setModel(d.charModel);d.graphModel.setData([]);d.oGraphchart.setModel(d.graphModel);var o=d.byId("idCompReq").getColumns(),r,s=e.getSource().getText(),n=e.getSource().getBindingContext().getObject(),c=n.Component,g=n.ItemNum,u=n.StructureNode,p=n.Type;d.colComp=c;for(var h=0;h<o.length;h++){if(t===o[h].sId){r=d.byId("idCompReq").getColumns()[h].getLabel().getText()}}d.colDate=r;if(s>0){this.getModel("BModel").read("/getBOMPred",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,d.oGModel.getProperty("/SelectedVer")),new l("SCENARIO",i.EQ,d.oGModel.getProperty("/SelectedScen")),new l("COMPONENT",i.EQ,c),new l("CAL_DATE",i.EQ,r),new l("MODEL_VERSION",i.EQ,d.oGModel.getProperty("/SelectedMV"))],success:function(e){d.charModel.setData(e);d.oGridList.setModel(d.charModel);d._odGraphDialog.open()},error:function(e,t){a.show("error")}})}}},onExpand:function(e){var t=e.getSource().getHeaderText();var o=t.split(":");d.getModel("BModel").read("/getOdCharImpact",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,d.oGModel.getProperty("/SelectedVer")),new l("SCENARIO",i.EQ,d.oGModel.getProperty("/SelectedScen")),new l("CAL_DATE",i.EQ,d.colDate),new l("OBJ_DEP",i.EQ,o[0].split("_")[0]),new l("OBJ_COUNTER",i.EQ,o[0].split("_")[1]),new l("MODEL_VERSION",i.EQ,d.oGModel.getProperty("/SelectedMV"))],success:function(e){d.graphModel.setData(e);d.oGraphchart.setModel(d.graphModel)},error:function(e,t){a.show("error")}})},handleDialogClose(){d._odGraphDialog.close()},generateDateseries:function(e,t){var o={},l=[];var i=e;o.CAL_DATE="Component";l.push(o);o={};o.CAL_DATE=d.getNextSunday(i);i=o.CAL_DATE;l.push(o);o={};while(i<=t){i=d.addDays(i,7);o.CAL_DATE=d.getNextSunday(i);i=o.CAL_DATE;l.push(o);o={}}var a=l.filter((e,t,o)=>o.map(e=>e.CAL_DATE).indexOf(e.CAL_DATE)==t);return a},getNextSunday:function(e){var t,o,l;const i=new Date(e);let a=i.getDay();if(a!==0)a=7-a;const r=new Date(i.getFullYear(),i.getMonth(),i.getDate()+a);t=r.getDate();o=r.getMonth()+1;l=r.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return l+"-"+o+"-"+t},addDays:function(e,t){var o,l,i;const a=new Date(e);const r=new Date(a.getFullYear(),a.getMonth(),a.getDate()+t);o=r.getDate();l=r.getMonth()+1;i=r.getFullYear();if(o<10){o="0"+o}if(l<10){l="0"+l}return i+"-"+l+"-"+o},removeDays:function(e,t){const o=new Date(e);const l=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return l.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(t.includes("ver")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(t.includes("scen")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogScen.open()}else{a.show("Select Location and Product")}}else if(t.includes("idcomp")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogComp.open()}else{a.show("Select Location and Product")}}else if(t.includes("stru")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogStru.open()}else{a.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){d._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(d.oVerList.getBinding("items")){d.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){d._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(d.oScenList.getBinding("items")){d.oScenList.getBinding("items").filter([])}}else if(t.includes("Comp")){d._oCore.byId(this._valueHelpDialogComp.getId()+"-searchField").setValue("");if(d.oCompList.getBinding("items")){d.oCompList.getBinding("items").filter([])}}else if(t.includes("Stru")){d._oCore.byId(this._valueHelpDialogStru.getId()+"-searchField").setValue("");if(d.oStruList.getBinding("items")){d.oStruList.getBinding("items").filter([])}}else if(t.includes("__button4")){d._odGraphDialog.close()}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){a.push(new l({filters:[new l("LOCATION_ID",i.Contains,t),new l("LOCATION_DESC",i.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(a)}else if(o.includes("prod")){if(t!==""){a.push(new l({filters:[new l("PRODUCT_ID",i.Contains,t),new l("PROD_DESC",i.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(a)}else if(o.includes("ver")){if(t!==""){a.push(new l({filters:[new l("VERSION",i.Contains,t)],and:false}))}d.oVerList.getBinding("items").filter(a)}else if(o.includes("scen")){if(t!==""){a.push(new l({filters:[new l("SCENARIO",i.Contains,t)],and:false}))}d.oScenList.getBinding("items").filter(a)}else if(o.includes("Comp")){if(t!==""){a.push(new l({filters:[new l("COMPONENT",i.Contains,t),new l("ITEM_NUM",i.Contains,t)],and:false}))}d.oCompList.getBinding("items").filter(a)}else if(o.includes("Stru")){if(t!==""){a.push(new l({filters:[new l("STRUC_NODE",i.Contains,t)],and:false}))}d.oStruList.getBinding("items").filter(a)}},handleSelection:function(e){d.oGModel=d.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),r,s=[];if(t.includes("Loc")){d.oLoc=d.byId("idloc");d.oProd=d.byId("idprod");r=e.getParameter("selectedItems");d.oLoc.setValue(r[0].getTitle());d.oGModel.setProperty("/SelectedLoc",r[0].getTitle());d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");d.oGModel.setProperty("/SelectedProd","");this.getModel("BModel").read("/getLocProdDet",{filters:[new l("LOCATION_ID",i.EQ,r[0].getTitle())],success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){d.oProd=d.byId("idprod");r=e.getParameter("selectedItems");d.oProd.setValue(r[0].getTitle());d.oGModel.setProperty("/SelectedProd",r[0].getTitle());d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");this.getModel("BModel").read("/getIbpVerScn",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,r[0].getTitle())],success:function(e){d.verModel.setData(e);d.oVerList.setModel(d.verModel)},error:function(e,t){a.show("error")}});this.getModel("BModel").read("/gBomHeaderet",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,r[0].getTitle())],success:function(e){d.compModel.setData(e);d.oCompList.setModel(d.compModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Ver")){this.oVer=d.byId("idver");r=e.getParameter("selectedItems");d.oVer.setValue(r[0].getTitle());d.oScen.setValue("");d.oGModel.setProperty("/SelectedVer",r[0].getTitle());this.getModel("BModel").read("/getIbpVerScn",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,r[0].getTitle())],success:function(e){d.scenModel.setData(e);d.oScenList.setModel(d.scenModel)},error:function(e,t){a.show("error")}})}else if(t.includes("scen")){this.oScen=d.byId("idscen");r=e.getParameter("selectedItems");d.oScen.setValue(r[0].getTitle());d.oGModel.setProperty("/SelectedScen",r[0].getTitle())}else if(t.includes("Comp")){this.oComp=d.byId("idcomp");r=e.getParameter("selectedItems");d.oComp.setValue(r[0].getTitle());d.oGModel.setProperty("/SelectedComp",r[0].getTitle());d.oGModel.setProperty("/SelectedCompItem",r[0].getDescription());d.oStru.setValue("");this.getModel("BModel").read("/genCompStrcNode",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("COMPONENT",i.EQ,d.oGModel.getProperty("/SelectedComp")),new l("ITEM_NUM",i.EQ,d.oGModel.getProperty("/SelectedCompItem"))],success:function(e){d.struModel.setData(e);d.oStruList.setModel(d.struModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Stru")){this.oStru=d.byId("idstru");r=e.getParameter("selectedItems");d.oStru.setValue(r[0].getTitle());d.oGModel.setProperty("/SelectedStru",r[0].getTitle())}d.handleClose(e)},getDateFn:function(e){var t,o,l;var i=e.getMonth()+1;if(i<10){t="0"+i}else{t=i}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o}})});
},
	"cpapp/cpasmbcompreq/i18n/i18n.properties":'title=Title\nappTitle=Home\nappDescription=App Description\n\nflpTitle=Component Requirements\nflpSubtitle= Quantity determination',
	"cpapp/cpasmbcompreq/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpasmbcompreq","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"palService":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/PalService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpasmbcompreq-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"assemblycomp","action":"Display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://course-program"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"cpapp.cpasmbcompreq.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.99.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpasmbcompreq.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"palService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpasmbcompreq.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpasmbcompreq/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpasmbcompreq/view/App.view.xml":'<mvc:View controllerName="cpapp.cpasmbcompreq.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpasmbcompreq/view/CompODBreakdown.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" \n\txmlns:grid="sap.ui.layout.cssgrid" xmlns:layout="sap.ui.layout"\n    xmlns:viz.feeds="sap.viz.ui5.controls.common.feeds"\n    xmlns:viz.data="sap.viz.ui5.data"\n    xmlns:viz="sap.viz.ui5.controls"\n\txmlns:card="sap.f.cards"\n\txmlns:f="sap.f"><Dialog\n\t\tid="charOdDialog"\n\t\ttitle="Component Quantity Breakdown" contentWidth="950px" horizontalScrolling="false"><content><List id="grid1" growingScrollToLoad="true"\n\t\t\t\titems="{path :\'/results\'}"><items><CustomListItem><Panel id="idPanel" headerText="{OBJ_DEP}_{OBJ_COUNTER}: {PREDICTED}" expandable="true" expanded="false" expand="onExpand"><content><viz:VizFrame xmlns="sap.viz" id="idpiechart" vizType="pie"\n                                        vizProperties="{plotArea: { dataLabel: { visible: true } }, title: { text: \'\' }}" ><viz:dataset><viz.data:FlattenedDataset data="{/results}"><viz.data:dimensions><viz.data:DimensionDefinition name="Characteristics"\n                                                        value="{CHAR_NAME}" /><viz.data:DimensionDefinition name="Option Percentage"\n                                                        value="{OPT_PERCENT}" /></viz.data:dimensions><viz.data:measures><viz.data:MeasureDefinition name="Prediction"\n                                                        value="{PREDICTED_VAL}" /></viz.data:measures></viz.data:FlattenedDataset></viz:dataset><viz:feeds><viz.feeds:FeedItem uid="size" type="Measure"\n                                                values="Prediction"/><viz.feeds:FeedItem uid="color" type="Dimension"\n                                                values="Characteristics" /><viz.feeds:FeedItem uid="color" type="Dimension"\n                                                values="Option Percentage"/></viz:feeds></viz:VizFrame></content></Panel></CustomListItem></items></List></content><beginButton><Button\n\t\t\t\ttext="Close"\n\t\t\t\tpress="handleDialogClose"/></beginButton></Dialog></core:FragmentDefinition>',
	"cpapp/cpasmbcompreq/view/ComponentDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="CompSlctList" title="Component" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleCompChange" growing="false"><StandardListItem title="{COMPONENT}" description="{ITEM_NUM}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpasmbcompreq/view/Home.view.xml":'<mvc:View\n    controllerName="cpapp.cpasmbcompreq.controller.Home"\n   xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core" displayBlock="true"\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:t="sap.ui.table"><Page title="{i18n>pageTitle}" class="boldText" titleAlignment="Center"><f:Form editable="true"><f:layout><f:ResponsiveGridLayout labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="4" columnsL="2" columnsM="2" singleContainerFullSize="false" breakpointXL= "1400" breakpointL= "800" breakpointM="600" /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="Location"/></f:label><f:fields><Input id="idloc" value="" width="225px" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></f:fields></f:FormElement><f:FormElement><f:label><Label text="IBP Version"/></f:label><f:fields><Input id="idver" value="" width="225px" placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></f:fields></f:FormElement><f:FormElement><f:label><Label text="Valid From"/></f:label><f:fields><DatePicker id="fromDate" width="auto" value="2022-03-10" displayFormat="yyyy-MM-dd" valueFormat="yyyy-MM-dd" change="handleDateChange"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer><f:formElements><f:FormElement><f:label><Label text="Product"/></f:label><f:fields><Input id="idprod" placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:fields></f:FormElement><f:FormElement><f:label><Label text="IBP Scenario"/></f:label><f:fields><Input id="idscen" value="" width="225px" placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></f:fields></f:FormElement><f:FormElement><f:label><Label text="Valid To"/></f:label><f:fields><DatePicker id="toDate" width="auto" value="2022-08-31" valueFormat="yyyy-MM-dd" displayFormat="yyyy-MM-dd" change="handleDateChange"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer  ><f:formElements><f:FormElement><f:label><Label text="Model Version"/></f:label><f:fields><Select id="idModelVer" selectedKey="Active"><core:ListItem key="Active" text="Active"/><core:ListItem key="Simulation" text="Simulation"/></Select></f:fields></f:FormElement><f:FormElement><HBox><Button text="Go" press="onGetData" tooltip="Get data based on filters"/><Button text="Reset" press="onResetDate" tooltip="Reset Valid To Date"/></HBox></f:FormElement></f:formElements></f:FormContainer><f:FormContainer visible="false"><f:formElements><f:FormElement visible="false"><f:label><Label text="Component"/></f:label><f:fields><Input id="idcomp" value="" width="225px" placeholder="Component" visible="false" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></f:fields></f:FormElement><f:FormElement visible="false"><f:label><Label text="Structure Node"/></f:label><f:fields><Input id="idstru" value="" width="225px" placeholder="Structure Node" visible="false" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><content><HBox><SearchField id="headSearch" liveChange="onSearchCompReq" placeholder="Component, Structure Node" width="500px"/><CheckBox id="idCheck1" select="onNonZero" text="Get Non-Zero" selected="true" /></HBox><t:Table id="idCompReq" fixedColumnCount="1" selectionMode="Single" alternateRowColors="true" enableSelectAll="false" visibleRowCount="10" ><t:columns></t:columns></t:Table></content></Page></mvc:View>\n',
	"cpapp/cpasmbcompreq/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpasmbcompreq/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" \n    liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" \n    selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpasmbcompreq/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpasmbcompreq/view/StructureNodeDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="StruSlctList" title="Structure Nodes" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handlestruChange" growing="false"><StandardListItem title="{STRUC_NODE}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpasmbcompreq/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
