//@ui5-bundle cpapp/cpcompreq/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpcompreq/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpcompreq/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpcompreq.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpcompreq/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpcompreq.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpcompreq/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpcompreq.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpcompreq/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpcompreq/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox","sap/ui/Device"],function(e,t,o,l,i,a,r,s){"use strict";var d,n;return t.extend("cpapp.cpcompreq.controller.Home",{onInit:function(){n=this;var e=new o(s);e.setDefaultBindingMode("OneWay");this.setModel(e,"device");this.rowData;n.locModel=new o;n.prodModel=new o;n.verModel=new o;n.scenModel=new o;n.compModel=new o;n.struModel=new o;n.charModel=new o;n.graphModel=new o;n.graphtModel=new o;n.locModel.setSizeLimit(1e3);n.prodModel.setSizeLimit(1e3);n.verModel.setSizeLimit(1e3);n.scenModel.setSizeLimit(1e3);n.compModel.setSizeLimit(1e3);n.struModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpcompreq.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpcompreq.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpcompreq.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpcompreq.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}if(!this._valueHelpDialogComp){this._valueHelpDialogComp=sap.ui.xmlfragment("cpapp.cpcompreq.view.ComponentDialog",this);this.getView().addDependent(this._valueHelpDialogComp)}if(!this._valueHelpDialogStru){this._valueHelpDialogStru=sap.ui.xmlfragment("cpapp.cpcompreq.view.StructureNodeDialog",this);this.getView().addDependent(this._valueHelpDialogStru)}if(!this._odGraphDialog){this._odGraphDialog=sap.ui.xmlfragment("cpapp.cpcompreq.view.CompODBreakdown",this);this.getView().addDependent(this._odGraphDialog)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();n.colComp="";n.colDate="";n.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oComp=this.byId("idcomp");this.oStru=this.byId("idstru");this.oPanel=this.byId("idPanel");n._valueHelpDialogProd.setTitleAlignment("Center");n._valueHelpDialogLoc.setTitleAlignment("Center");n._valueHelpDialogVer.setTitleAlignment("Center");n._valueHelpDialogScen.setTitleAlignment("Center");n._valueHelpDialogComp.setTitleAlignment("Center");n._valueHelpDialogStru.setTitleAlignment("Center");var e=new Date;var t=n.getDateFn(e);var o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+90);var o=n.getDateFn(o);n.byId("fromDate").setValue(t);n.byId("toDate").setValue(o);this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");this.oCompList=this._oCore.byId(this._valueHelpDialogComp.getId()+"-list");this.oStruList=this._oCore.byId(this._valueHelpDialogStru.getId()+"-list");this.oGridList=this._oCore.byId(sap.ui.getCore().byId("charOdDialog").getContent()[0].getId());this.oGraphchart=this._oCore.byId(sap.ui.getCore().byId("idPanel").getContent()[0].getId());sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){n.locModel.setData(e);n.oLocList.setModel(n.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},onResetDate:function(){n.byId("fromDate").setValue("");n.byId("toDate").setValue("");d.setProperty("/resetFlag","X");n.oLoc.setValue("");n.oProd.setValue("");n.oVer.setValue("");n.oScen.setValue("");n.oComp.setValue("");n.oStru.setValue("");n.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();n.oTable=n.byId("idCompReq");n.oGModel=n.getModel("oGModel");var t=n.oGModel.getProperty("/SelectedLoc"),o=n.oGModel.getProperty("/SelectedProd"),l=n.oGModel.getProperty("/SelectedVer"),i=n.oGModel.getProperty("/SelectedScen"),a=n.oGModel.getProperty("/SelectedComp"),r=n.oGModel.getProperty("/SelectedStru"),s=n.byId("idModelVer").getSelectedKey();n.oGModel.setProperty("/SelectedMV",n.byId("idModelVer").getSelectedKey());var d=this.byId("fromDate").getDateValue();var c=this.byId("toDate").getDateValue();if(t!==undefined&&o!==undefined&&l!==undefined&&i!==undefined&&s!==undefined&&d!==undefined&&d!==" "&&c!==undefined&&c!==" "){d=n.getDateFn(d);c=n.getDateFn(c);if(a===undefined){a=""}if(r===undefined){r=""}n.getModel("BModel").callFunction("/getCompReqFWeekly",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:o,VERSION:l,SCENARIO:i,COMPONENT:a,STRUCNODE:r,FROMDATE:d,TODATE:c,MODEL_VERSION:s},success:function(e){sap.ui.core.BusyIndicator.hide();n.rowData=e.results;n.oGModel.setProperty("/TData",e.results);n.TableGenerate();var t=n.byId("idCheck1").getSelected();if(t){n.onNonZero()}},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},onSearchCompReq:function(e){n.oTable=n.byId("idCompReq");n.oGModel=n.getModel("oGModel");var t=e.getParameter("value")||e.getParameter("newValue");if(t===""){n.onNonZero()}else{n.oGModel=n.getModel("oGModel");n.Data=n.oGModel.getProperty("/TData");n.searchData=[];for(var o=0;o<n.Data.length;o++){if(n.Data[o].COMPONENT.includes(t)||n.Data[o].STRUC_NODE.includes(t)||n.Data[o].QTYTYPE.includes(t)){n.searchData.push(n.Data[o])}}n.oGModel.setProperty("/TData",n.searchData);n.TableGenerate()}},TableGenerate:function(){var e={},t=[],o;n.oGModel=n.getModel("oGModel");n.tableData=n.oGModel.getProperty("/TData");var l;var i=new Date(n.byId("fromDate").getDateValue()),a=new Date(n.byId("toDate").getDateValue());i=i.toISOString().split("T")[0];a=a.toISOString().split("T")[0];var r=n.generateDateseries(i,a);for(var s=0;s<n.tableData.length;s++){e.ItemNum=n.tableData[s].ITEM_NUM;e.Assembly=n.tableData[s].COMPONENT;e.StructureNode=n.tableData[s].STRUC_NODE;e.Type=n.tableData[s].QTYTYPE;o=1;for(let t=3;t<r.length;t++){e[r[t].CAL_DATE]=n.tableData[s]["WEEK"+o];o++}t.push(e);e={}}var d=new sap.ui.model.json.JSONModel;d.setData({rows:t,columns:r});n.oTable.setModel(d);n.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().CAL_DATE;if(o==="Assembly"||o==="ItemNum"||o==="StructureNode"){return new sap.ui.table.Column({width:"8rem",label:o,template:o})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Link({text:"{"+o+"}",press:n.linkPressed})})}});n.oTable.bindRows("/rows")},onNonZero:function(e){n.oTable=n.byId("idCompReq");n.oGModel=n.getModel("oGModel");var t=n.byId("idCheck1").getSelected(),o,l;n.searchData=n.rowData;n.FinalData=[];var i=n.oTable.getColumns().length-3,a=n.tableData;if(t){for(var r=0;r<n.searchData.length;r++){l=0;for(var s=1;s<i;s++){if(n.searchData[r]["WEEK"+s]!==0&&n.searchData[r]["WEEK"+s]!==null){l=l+1;break}}if(l!==0){n.FinalData.push(n.searchData[r])}}}else{n.FinalData=n.searchData}n.oGModel.setProperty("/TData",n.FinalData);n.TableGenerate()},linkPressed:function(e){var t=e.getSource().getAriaLabelledBy()[0];if(t==="__column0"||t==="__column1"||t==="__column2"){sap.m.MessageToast.show("Please click on any quantity")}else{n.charModel.setData([]);n.oGridList.setModel(n.charModel);n.graphModel.setData([]);n.oGraphchart.setModel(n.graphModel);var o=n.byId("idCompReq").getColumns(),r,s=e.getSource().getText(),d=e.getSource().getBindingContext().getObject(),c=d.Assembly,u=d.ItemNum,g=d.StructureNode,p=d.Type;n.colComp=c;for(var D=0;D<o.length;D++){if(t===o[D].sId){r=n.byId("idCompReq").getColumns()[D].getLabel().getText()}}n.colDate=r;if(s>0){this.getModel("BModel").read("/getBOMPred",{filters:[new l("LOCATION_ID",i.EQ,n.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,n.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,n.oGModel.getProperty("/SelectedVer")),new l("SCENARIO",i.EQ,n.oGModel.getProperty("/SelectedScen")),new l("COMPONENT",i.EQ,c),new l("CAL_DATE",i.EQ,r),new l("MODEL_VERSION",i.EQ,n.oGModel.getProperty("/SelectedMV"))],success:function(e){n.charModel.setData(e);n.oGridList.setModel(n.charModel);n._odGraphDialog.open()},error:function(e,t){a.show("error")}})}}},onExpand:function(e){var t=e.getSource().getHeaderText();var o=t.split(":");n.getModel("BModel").read("/getOdCharImpact",{filters:[new l("LOCATION_ID",i.EQ,n.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,n.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,n.oGModel.getProperty("/SelectedVer")),new l("SCENARIO",i.EQ,n.oGModel.getProperty("/SelectedScen")),new l("CAL_DATE",i.EQ,n.colDate),new l("OBJ_DEP",i.EQ,o[0].split("_")[0]),new l("OBJ_COUNTER",i.EQ,o[0].split("_")[1]),new l("MODEL_VERSION",i.EQ,n.oGModel.getProperty("/SelectedMV"))],success:function(e){n.graphModel.setData(e);n.oGraphchart.setModel(n.graphModel)},error:function(e,t){a.show("error")}})},handleDialogClose(){n._odGraphDialog.close()},generateDateseries:function(e,t){var o={},l=[];var i=e;o.CAL_DATE="Assembly";l.push(o);o={};o.CAL_DATE="ItemNum";l.push(o);o={};o.CAL_DATE="StructureNode";l.push(o);o={};o.CAL_DATE=n.getNextMonday(i);i=o.CAL_DATE;l.push(o);o={};while(i<=t){i=n.addDays(i,7);o.CAL_DATE=i;l.push(o);o={}}var a=l.filter((e,t,o)=>o.map(e=>e.CAL_DATE).indexOf(e.CAL_DATE)==t);return a},getNextMonday:function(e){var t,o,l;const i=new Date(e);let a=i.getDay();if(a!==0)a=7-a;a=a+1;const r=new Date(i.getFullYear(),i.getMonth(),i.getDate()+a);t=r.getDate();o=r.getMonth()+1;l=r.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return l+"-"+o+"-"+t},addDays:function(e,t){var o,l,i;const a=new Date(e);const r=new Date(a.getFullYear(),a.getMonth(),a.getDate()+t);o=r.getDate();l=r.getMonth()+1;i=r.getFullYear();if(o<10){o="0"+o}if(l<10){l="0"+l}return i+"-"+l+"-"+o},removeDays:function(e,t){const o=new Date(e);const l=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return l.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){n._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(n.byId("idloc").getValue()){n._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(t.includes("ver")){if(n.byId("idloc").getValue()&&n.byId("idprod").getValue()){n._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(t.includes("scen")){if(n.byId("idloc").getValue()&&n.byId("idprod").getValue()){n._valueHelpDialogScen.open()}else{a.show("Select Location and Product")}}else if(t.includes("idcomp")){if(n.byId("idloc").getValue()&&n.byId("idprod").getValue()){n._valueHelpDialogComp.open()}else{a.show("Select Location and Product")}}else if(t.includes("stru")){if(n.byId("idloc").getValue()&&n.byId("idprod").getValue()){n._valueHelpDialogStru.open()}else{a.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){n._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(n.oLocList.getBinding("items")){n.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){n._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(n.oProdList.getBinding("items")){n.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){n._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(n.oVerList.getBinding("items")){n.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){n._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(n.oScenList.getBinding("items")){n.oScenList.getBinding("items").filter([])}}else if(t.includes("Comp")){n._oCore.byId(this._valueHelpDialogComp.getId()+"-searchField").setValue("");if(n.oCompList.getBinding("items")){n.oCompList.getBinding("items").filter([])}}else if(t.includes("Stru")){n._oCore.byId(this._valueHelpDialogStru.getId()+"-searchField").setValue("");if(n.oStruList.getBinding("items")){n.oStruList.getBinding("items").filter([])}}else if(t.includes("__button4")){n._odGraphDialog.close()}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){a.push(new l({filters:[new l("LOCATION_ID",i.Contains,t),new l("LOCATION_DESC",i.Contains,t)],and:false}))}n.oLocList.getBinding("items").filter(a)}else if(o.includes("prod")){if(t!==""){a.push(new l({filters:[new l("PRODUCT_ID",i.Contains,t),new l("PROD_DESC",i.Contains,t)],and:false}))}n.oProdList.getBinding("items").filter(a)}else if(o.includes("ver")){if(t!==""){a.push(new l({filters:[new l("VERSION",i.Contains,t)],and:false}))}n.oVerList.getBinding("items").filter(a)}else if(o.includes("scen")){if(t!==""){a.push(new l({filters:[new l("SCENARIO",i.Contains,t)],and:false}))}n.oScenList.getBinding("items").filter(a)}else if(o.includes("Comp")){if(t!==""){a.push(new l({filters:[new l("COMPONENT",i.Contains,t),new l("ITEM_NUM",i.Contains,t)],and:false}))}n.oCompList.getBinding("items").filter(a)}else if(o.includes("Stru")){if(t!==""){a.push(new l({filters:[new l("STRUC_NODE",i.Contains,t)],and:false}))}n.oStruList.getBinding("items").filter(a)}},handleSelection:function(e){n.oGModel=n.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),r,s=[];if(t.includes("Loc")){n.oLoc=n.byId("idloc");n.oProd=n.byId("idprod");r=e.getParameter("selectedItems");n.oLoc.setValue(r[0].getTitle());n.oGModel.setProperty("/SelectedLoc",r[0].getTitle());n.oProd.setValue("");n.oVer.setValue("");n.oScen.setValue("");n.oComp.setValue("");n.oStru.setValue("");n.oGModel.setProperty("/SelectedProd","");this.getModel("BModel").read("/getLocProdDet",{filters:[new l("LOCATION_ID",i.EQ,r[0].getTitle())],success:function(e){n.prodModel.setData(e);n.oProdList.setModel(n.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){n.oProd=n.byId("idprod");r=e.getParameter("selectedItems");n.oProd.setValue(r[0].getTitle());n.oGModel.setProperty("/SelectedProd",r[0].getTitle());n.oVer.setValue("");n.oScen.setValue("");n.oComp.setValue("");n.oStru.setValue("");this.getModel("BModel").read("/getIbpVerScn",{filters:[new l("LOCATION_ID",i.EQ,n.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,r[0].getTitle())],success:function(e){n.verModel.setData(e);n.oVerList.setModel(n.verModel)},error:function(e,t){a.show("error")}});this.getModel("BModel").read("/gBomHeaderet",{filters:[new l("LOCATION_ID",i.EQ,n.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,r[0].getTitle())],success:function(e){n.compModel.setData(e);n.oCompList.setModel(n.compModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Ver")){this.oVer=n.byId("idver");r=e.getParameter("selectedItems");n.oVer.setValue(r[0].getTitle());n.oScen.setValue("");n.oGModel.setProperty("/SelectedVer",r[0].getTitle());this.getModel("BModel").read("/getIbpVerScn",{filters:[new l("LOCATION_ID",i.EQ,n.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,n.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,r[0].getTitle())],success:function(e){n.scenModel.setData(e);n.oScenList.setModel(n.scenModel)},error:function(e,t){a.show("error")}})}else if(t.includes("scen")){this.oScen=n.byId("idscen");r=e.getParameter("selectedItems");n.oScen.setValue(r[0].getTitle());n.oGModel.setProperty("/SelectedScen",r[0].getTitle())}else if(t.includes("Comp")){this.oComp=n.byId("idcomp");r=e.getParameter("selectedItems");n.oComp.setValue(r[0].getTitle());n.oGModel.setProperty("/SelectedComp",r[0].getTitle());n.oGModel.setProperty("/SelectedCompItem",r[0].getDescription());n.oStru.setValue("");this.getModel("BModel").read("/genCompStrcNode",{filters:[new l("LOCATION_ID",i.EQ,n.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,n.oGModel.getProperty("/SelectedProd")),new l("COMPONENT",i.EQ,n.oGModel.getProperty("/SelectedComp")),new l("ITEM_NUM",i.EQ,n.oGModel.getProperty("/SelectedCompItem"))],success:function(e){n.struModel.setData(e);n.oStruList.setModel(n.struModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Stru")){this.oStru=n.byId("idstru");r=e.getParameter("selectedItems");n.oStru.setValue(r[0].getTitle());n.oGModel.setProperty("/SelectedStru",r[0].getTitle())}n.handleClose(e)},getDateFn:function(e){var t,o,l;var i=e.getMonth()+1;if(i<10){t="0"+i}else{t=i}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o}})});
},
	"cpapp/cpcompreq/i18n/i18n.properties":'title=Title\nappTitle=Home\nappDescription=App Description\n\nflpTitle= Assembly Requirements\nflpSubtitle=\ncompQty=Assembly:{0}\n\npageTitle = Assembly Requirements\n\nLoc= Location\nPrdId =Product',
	"cpapp/cpcompreq/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpcompreq","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"palService":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/PalService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpcompreq-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"compreq","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://tools-opportunity"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"cpapp.cpcompreq.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.99.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpcompreq.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"palService","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpcompreq.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpcompreq/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpcompreq/view/App.view.xml":'<mvc:View controllerName="cpapp.cpcompreq.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpcompreq/view/CompODBreakdown.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" \n\txmlns:grid="sap.ui.layout.cssgrid" xmlns:layout="sap.ui.layout"\n    xmlns:viz.feeds="sap.viz.ui5.controls.common.feeds"\n    xmlns:viz.data="sap.viz.ui5.data"\n    xmlns:viz="sap.viz.ui5.controls"\n\txmlns:card="sap.f.cards"\n\txmlns:f="sap.f"><Dialog\n\t\tid="charOdDialog"\n\t\ttitle="Component Quantity Breakdown" contentWidth="950px" horizontalScrolling="false"><content><List id="grid1" growingScrollToLoad="true"\n\t\t\t\titems="{path :\'/results\'}"><items><CustomListItem><Panel id="idPanel" headerText="{OBJ_DEP}_{OBJ_COUNTER}: {PREDICTED}" expandable="true" expanded="false" expand="onExpand"><content><viz:VizFrame xmlns="sap.viz" id="idpiechart" vizType="pie"\n                                        vizProperties="{plotArea: { dataLabel: { visible: true } }, title: { text: \'\' }}" ><viz:dataset><viz.data:FlattenedDataset data="{/results}"><viz.data:dimensions><viz.data:DimensionDefinition name="Characteristics"\n                                                        value="{CHAR_NAME}" /><viz.data:DimensionDefinition name="Option Percentage"\n                                                        value="{OPT_PERCENT}" /></viz.data:dimensions><viz.data:measures><viz.data:MeasureDefinition name="Prediction"\n                                                        value="{PREDICTED_VAL}" /></viz.data:measures></viz.data:FlattenedDataset></viz:dataset><viz:feeds><viz.feeds:FeedItem uid="size" type="Measure"\n                                                values="Prediction"/><viz.feeds:FeedItem uid="color" type="Dimension"\n                                                values="Characteristics" /><viz.feeds:FeedItem uid="color" type="Dimension"\n                                                values="Option Percentage"/></viz:feeds></viz:VizFrame></content></Panel></CustomListItem></items></List></content><beginButton><Button\n\t\t\t\ttext="Close"\n\t\t\t\tpress="handleDialogClose"/></beginButton></Dialog></core:FragmentDefinition>',
	"cpapp/cpcompreq/view/ComponentDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="CompSlctList" title="Component" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleCompChange" growing="false"><StandardListItem title="{COMPONENT}" description="{ITEM_NUM}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcompreq/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpcompreq.controller.Home"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core" displayBlock="true"\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:ux="sap.uxap"\n    xmlns:l="sap.ui.layout"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:t="sap.ui.table"><ux:ObjectPageLayout id="ObjectPageLayout"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>pageTitle}" class="boldText" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center" ><Title text="{i18n>pageTitle}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12" ><VBox ><Label text=""/><SearchField id="headSearch" liveChange="onSearchCompReq" placeholder="Component, Structure Node" /></VBox><VBox ><Label text="Location" required="true"/><Input id="idloc" value=""  placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="Product" required="true"/><Input id="idprod"  placeholder="Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></VBox><VBox ><Label text="IBP Version" required="true"/><Input id="idver" value=""  placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="IBP Scenario" required="true"/><Input id="idscen" value=""  placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox ><Label text="Valid From" required="true"/><DatePicker id="fromDate"  value="" displayFormat="yyyy-MM-dd" valueFormat="yyyy-MM-dd" change="handleDateChange"/></VBox><VBox ><Label text="Valid To" required="true"/><DatePicker id="toDate"  value="" valueFormat="yyyy-MM-dd" displayFormat="yyyy-MM-dd" change="handleDateChange"/></VBox><VBox ><Label text="Model Version" /><Select id="idModelVer" selectedKey="Active"><core:ListItem key="Active" text="Active"/><core:ListItem key="Simulation" text="Simulation"/></Select></VBox><VBox ><CheckBox id="idCheck1" select="onNonZero" text="Get Non-Zero" selected="true" /></VBox><VBox><HBox><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" class="sapUiTinyMarginEnd"/><Button text="Reset" type="Transparent" press="onResetDate" tooltip="Reset Valid To Date"/></HBox></VBox><Label text="Component" visible="false"/><Input id="idcomp"  value=""  placeholder="Component" visible="false" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /><Label text="Structure Node" visible="false"/><Input id="idstru" value=""  placeholder="Structure Node" visible="false" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection ><ux:subSections><ux:ObjectPageSubSection><ux:blocks><t:Table id="idCompReq" fixedColumnCount="3" selectionMode="Single" alternateRowColors="true" enableSelectAll="false" visibleRowCount="15"><t:columns></t:columns></t:Table></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></mvc:View>\n',
	"cpapp/cpcompreq/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcompreq/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" \n    liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" \n    selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcompreq/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcompreq/view/StructureNodeDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="StruSlctList" title="Structure Nodes" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handlestruChange" growing="false"><StandardListItem title="{STRUC_NODE}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpcompreq/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
