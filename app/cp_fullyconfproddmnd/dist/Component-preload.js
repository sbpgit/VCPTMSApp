//@ui5-bundle cpapp/cpfullyconfproddmnd/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpfullyconfproddmnd/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpfullyconfproddmnd/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpfullyconfproddmnd.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpfullyconfproddmnd/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpfullyconfproddmnd.controller.controller.App",{onInit(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpfullyconfproddmnd/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpfullyconfproddmnd.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpfullyconfproddmnd/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpfullyconfproddmnd/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,i,a,n,s){"use strict";var r,l;return t.extend("cpapp.cpfullyconfproddmnd.controller.Home",{onInit:function(){l=this;this.rowData;l.locModel=new o;l.prodModel=new o;l.verModel=new o;l.scenModel=new o;l.charModel=new o;l.locModel.setSizeLimit(1e3);l.prodModel.setSizeLimit(1e3);l.verModel.setSizeLimit(1e3);l.scenModel.setSizeLimit(1e3);l.charModel.setSizeLimit(1e3);l.aCIRQty=[];this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();l.col="";l.colDate="";l.aCIRQty=[];l.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprodList");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");l._valueHelpDialogProd.setTitleAlignment("Center");l._valueHelpDialogLoc.setTitleAlignment("Center");l._valueHelpDialogVer.setTitleAlignment("Center");l._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("CIRModel").read("/getLocation",{success:function(e){l.locModel.setData(e);l.oLocList.setModel(l.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){n.show("error");sap.ui.core.BusyIndicator.hide()}});sap.ui.core.BusyIndicator.show();this.getModel("CIRModel").read("/V_Parameters",{success:function(e){var t=e.results;var o={};var i=parseInt(e.results[0].VALUE)+1;var a=new Date;a=new Date(a.setDate(a.getDate()+i));var n=l.getDateFn(a);var s=new Date(a.getFullYear(),a.getMonth(),a.getDate()+90);var s=l.getDateFn(s);l.byId("fromDate").setValue(n);l.byId("toDate").setValue(s);o=t.find(e=>e.PARAMETER_ID===9);var r=parseInt(o.VALUE);var d=new Date;d=new Date(d.setDate(d.getDate()+r));l.dFirmHorizonDate=d;sap.ui.core.BusyIndicator.hide()},error:function(e,t){n.show("error");sap.ui.core.BusyIndicator.hide()}})},onResetData:function(){var e=new sap.ui.model.json.JSONModel;var t=[],o=[];l.oGModel=l.getModel("oGModel");l.byId("fromDate").setValue("");l.byId("toDate").setValue("");l.oLoc.setValue("");l.oProd.setValue("");l.oVer.setValue("");l.oScen.setValue("");l.byId("idSearch").setValue("");l.oGModel.setProperty("/SelectedLoc",undefined);l.oGModel.setProperty("/SelectedProd",undefined);l.oGModel.setProperty("/SelectedVer",undefined);l.oGModel.setProperty("/SelectedScen",undefined);e.setData({rows:t,columns:o});l.oTable.setModel(e);l.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();l.oTable=l.byId("idCIReq");l.oGModel=l.getModel("oGModel");var t=l.oGModel.getProperty("/SelectedLoc"),o=l.oGModel.getProperty("/SelectedProd"),i=l.oGModel.getProperty("/SelectedVer"),a=l.oGModel.getProperty("/SelectedScen"),n=l.byId("idModelVer").getSelectedKey();l.oGModel.setProperty("/SelectedMV",l.byId("idModelVer").getSelectedKey());var s=this.byId("fromDate").getDateValue();var r=this.byId("toDate").getDateValue();if(t!==undefined&&o!==undefined&&i!==undefined&&a!==undefined&&n!==undefined&&s!==undefined&&s!==" "&&r!==undefined&&r!==" "){s=l.getDateFn(s);r=l.getDateFn(r);l.getModel("CIRModel").callFunction("/getCIRWeekly",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:o,VERSION:i,SCENARIO:a,FROMDATE:s,TODATE:r,MODEL_VERSION:n},success:function(e){sap.ui.core.BusyIndicator.hide();l.rowData=e.results;l.oGModel.setProperty("/TData",e.results);l.TableGenerate()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},TableGenerate:function(){var e={},t=[],o;l.oGModel=l.getModel("oGModel");l.tableData=l.oGModel.getProperty("/TData");l.aFirmDates=[];var i;var a=new Date(l.byId("fromDate").getDateValue()),n=new Date(l.byId("toDate").getDateValue());a=l.onConvertDateToString(a);n=l.onConvertDateToString(n);var s=l.generateDateseries(a,n);for(var r=0;r<l.tableData.length;r++){e["Unique ID"]=l.tableData[r].UNIQUE_ID.toString();e.UNIQUE_DESC=l.tableData[r].UNIQUE_DESC;e["Product"]=l.tableData[r].PRODUCT_ID;o=1;for(let t=2;t<s.length;t++){e[s[t].WEEK_DATE]=l.tableData[r]["WEEK"+o];o++}t.push(e);e={}}var d=new sap.ui.model.json.JSONModel;d.setData({rows:t,columns:s});l.oTable.setModel(d);l.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().WEEK_DATE;if(o==="Unique ID"){return new sap.ui.table.Column({width:"12rem",label:o,template:new sap.m.VBox({items:[new sap.m.Link({text:"{"+o+"}",press:l.uniqueIdLinkpress}),new sap.m.ObjectIdentifier({text:"{UNIQUE_DESC}"})]})})}else{var i=new Date(o);if(l.dFirmHorizonDate>i){l.aFirmDates.push(o);return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Input({type:"Number",placeholder:"{"+o+"}",value:"{"+o+"}",change:l.onChangeCIRQty})})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Text({text:"{"+o+"}"})})}}});l.oTable.bindRows("/rows")},generateDateseries:function(e,t){var o={},i=[];var a=e;o.WEEK_DATE="Unique ID";i.push(o);o={};o.WEEK_DATE="Product";i.push(o);o={};o.WEEK_DATE=l.getNextMonday(a);a=o.WEEK_DATE;i.push(o);o={};while(a<=t){a=l.addDays(a,7);if(a>t){break}o.WEEK_DATE=a;i.push(o);o={};if(a===t){break}}var n=i.filter((e,t,o)=>o.map(e=>e.WEEK_DATE).indexOf(e.WEEK_DATE)==t);return n},getNextMonday:function(e){var t,o,i;const a=new Date(e);var n=a.getTimezoneOffset()*6e4;a.setTime(a.getTime()+n);let s=a.getDay();if(s===1){s=0}else{if(s!==0)s=7-s;s=s+1}const r=new Date(a.getFullYear(),a.getMonth(),a.getDate()+s);t=r.getDate();o=r.getMonth()+1;i=r.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return i+"-"+o+"-"+t},addDays:function(e,t){var o,i,a;const n=new Date(e);var s=n.getTimezoneOffset()*6e4;n.setTime(n.getTime()+s);const r=new Date(n.getFullYear(),n.getMonth(),n.getDate()+t);o=r.getDate();i=r.getMonth()+1;a=r.getFullYear();if(o<10){o="0"+o}if(i<10){i="0"+i}return a+"-"+i+"-"+o},removeDays:function(e,t){const o=new Date(e);const i=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return i.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._valueHelpDialogLoc.open()}else if(t.includes("prodList")){if(l.byId("idloc").getValue()){l._valueHelpDialogProd.open()}else{n.show("Select Location")}}else if(t.includes("ver")){if(l.byId("idloc").getValue()&&l.byId("idprodList").getValue()){l._valueHelpDialogVer.open()}else{n.show("Select Location and Product")}}else if(t.includes("scen")){if(l.byId("idloc").getValue()&&l.byId("idprodList").getValue()){l._valueHelpDialogScen.open()}else{n.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){l._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(l.oLocList.getBinding("items")){l.oLocList.getBinding("items").filter([])}}else if(t.includes("prodList")){l._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(l.oProdList.getBinding("items")){l.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){l._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(l.oVerList.getBinding("items")){l.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){l._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(l.oScenList.getBinding("items")){l.oScenList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),n=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){n.push(new i({filters:[new i("LOCATION_ID",a.Contains,t),new i("LOCATION_DESC",a.Contains,t)],and:false}))}l.oLocList.getBinding("items").filter(n)}else if(o.includes("prod")){if(t!==""){n.push(new i({filters:[new i("PRODUCT_ID",a.Contains,t),new i("PROD_DESC",a.Contains,t)],and:false}))}l.oProdList.getBinding("items").filter(n)}else if(o.includes("ver")){if(t!==""){n.push(new i({filters:[new i("VERSION",a.Contains,t)],and:false}))}l.oVerList.getBinding("items").filter(n)}else if(o.includes("scen")){if(t!==""){n.push(new i({filters:[new i("SCENARIO",a.Contains,t)],and:false}))}l.oScenList.getBinding("items").filter(n)}},onSearchUniqueId:function(e){var t=[];l.oTable=l.byId("idCIReq");var o=e.getParameter("value")||e.getParameter("newValue");if(o){t=new i([new i("Unique ID",a.Contains,o),new i("UNIQUE_DESC",a.Contains,o),new i("Product",a.Contains,o)],false);l.oTable.getBinding().filter(t)}else{l.oTable.getBinding().filter(t)}},handleSelection:function(e){l.oGModel=l.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),s,r=[];if(t.includes("Loc")){l.oLoc=l.byId("idloc");l.oProd=l.byId("idprodList");s=e.getParameter("selectedItems");l.oLoc.setValue(s[0].getTitle());l.oGModel.setProperty("/SelectedLoc",s[0].getTitle());l.oProd.setValue("");l.oVer.setValue("");l.oScen.setValue("");l.oGModel.setProperty("/SelectedProd","");this.getModel("CIRModel").read("/getLocProdDet",{filters:[new i("LOCATION_ID",a.EQ,s[0].getTitle())],success:function(e){l.prodModel.setData(e);l.oProdList.setModel(l.prodModel)},error:function(e,t){n.show("error")}})}else if(t.includes("prod")){l.oProd=l.byId("idprodList");s=e.getParameter("selectedItems");l.oProd.setValue(s[0].getTitle());l.oGModel.setProperty("/SelectedProd",s[0].getTitle());l.oVer.setValue("");l.oScen.setValue("");l.getModel("CIRModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:l.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===l.oGModel.getProperty("/SelectedProd")){t.push({VERSION:e.results[o].VERSION})}}if(t.length>0){l.verModel.setData({results:t});l.oVerList.setModel(l.verModel)}},error:function(e,t){n.show("error")}})}else if(t.includes("Ver")){this.oVer=l.byId("idver");s=e.getParameter("selectedItems");l.oVer.setValue(s[0].getTitle());l.oScen.setValue("");l.oGModel.setProperty("/SelectedVer",s[0].getTitle());l.getModel("CIRModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:l.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===l.oGModel.getProperty("/SelectedProd")&&e.results[o].VERSION===s[0].getTitle()){t.push({SCENARIO:e.results[o].SCENARIO})}}if(t.length>0){l.scenModel.setData({results:t});l.oScenList.setModel(l.scenModel)}},error:function(e,t){n.show("error")}})}else if(t.includes("scen")){this.oScen=l.byId("idscen");s=e.getParameter("selectedItems");l.oScen.setValue(s[0].getTitle());l.oGModel.setProperty("/SelectedScen",s[0].getTitle())}l.handleClose(e)},getDateFn:function(e){var t,o,i;var a=e.getMonth()+1;if(a<10){t="0"+a}else{t=a}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o},onCharClose:function(){l._onCharDetails.close()},uniqueIdLinkpress:function(e){var t=e.getSource().getAriaLabelledBy()[0];var o=l.byId("idCIReq").getColumns(),s=e.getSource().getText(),r=e.getSource().getBindingContext().getObject(),d=r["Unique ID"];if(s>0){if(!l._onCharDetails){l._onCharDetails=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.CharDetails",l);l.getView().addDependent(l._onCharDetails)}l._onCharDetails.setTitleAlignment("Center");l.CharDetailList=sap.ui.getCore().byId("idCharDetail");this.getModel("CIRModel").read("/getUniqueItem",{filters:[new i("UNIQUE_ID",a.EQ,d),new i("PRODUCT_ID",a.EQ,l.oGModel.getProperty("/SelectedProd")),new i("LOCATION_ID",a.EQ,l.oGModel.getProperty("/SelectedLoc"))],success:function(e){l.charModel.setData({results:e.results});l.CharDetailList.setModel(l.charModel);l._onCharDetails.open()},error:function(e,t){n.show("Failed to get data")}})}},onPressPublish:function(e){var t=e;s.confirm("Would you like to publish?",{icon:s.Icon.Conf,title:"Confirmation",actions:[s.Action.YES,s.Action.NO],emphasizedAction:s.Action.YES,onClose:function(e){if(e==="YES"){l.onPressPublishConfirm(t)}else{}}})},onPressPublishConfirm:function(e){sap.ui.core.BusyIndicator.show();l.oGModel=l.getModel("oGModel");var t={};var o=l.byId("fromDate").getDateValue();var i=l.byId("toDate").getDateValue();t.LOCATION_ID=l.oGModel.getProperty("/SelectedLoc");t.PRODUCT_ID=l.oGModel.getProperty("/SelectedProd");t.VERSION=l.oGModel.getProperty("/SelectedVer");t.SCENARIO=l.oGModel.getProperty("/SelectedScen");t.MODEL_VERSION=l.byId("idModelVer").getSelectedKey();if(t.LOCATION_ID!==undefined&&t.PRODUCT_ID!==undefined&&t.VERSION!==undefined&&t.SCENARIO!==undefined&&t.MODEL_VERSION!==undefined&&o!==undefined&&o!==" "&&i!==undefined&&i!==" "){o=l.getDateFn(o);i=l.getDateFn(i);t.FROMDATE=o;t.TODATE=i;l.handlePublish(t)}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},getScheduleSEDT:function(){var e={};var t=new Date;var o=t.setSeconds(t.getSeconds()+20);var i=t.setHours(t.getHours()+2);o=new Date(o);i=new Date(i);var a=new Date,n=i,s=new Date,r=i,l,d,c,u;a=a.toISOString().split("T");l=a[1].split(":");n=n.toISOString().split("T");d=n[1].split(":");s=s.toISOString().split("T");c=s[1].split(":");r=r.toISOString().split("T");u=r[1].split(":");var t=(new Date).toLocaleString().split(" ");e.djSdate=a[0]+" "+l[0]+":"+l[1]+" "+"+0000";e.djEdate=n[0]+" "+d[0]+":"+d[1]+" "+"+0000";e.dsSDate=s[0]+" "+c[0]+":"+c[1]+" "+"+0000";e.dsEDate=r[0]+" "+u[0]+":"+u[1]+" "+"+0000";e.oneTime=o;return e},handlePublish:function(e){var t={};var o=l.getOwnerComponent().getModel("CIRModel");t=l.getScheduleSEDT();var i={LOCATION_ID:e.LOCATION_ID,PRODUCT_ID:e.PRODUCT_ID,VERSION:e.VERSION,SCENARIO:e.SCENARIO,FROMDATE:e.FROMDATE,TODATE:e.TODATE,MODEL_VERSION:e.MODEL_VERSION};var a=(new Date).getTime();var n="/catalog/postCIRQuantitiesToS4";var s="CIRQtys"+a;sap.ui.core.BusyIndicator.show();var r={name:s,description:"Weekly CIR Quantity",action:encodeURIComponent(n),active:true,httpMethod:"POST",startTime:t.djSdate,endTime:t.djEdate,createdAt:t.djSdate,schedules:[{data:i,cron:"",time:t.oneTime,active:true,startTime:t.dsSDate,endTime:t.dsEDate}]};l.getModel("JModel").callFunction("/addMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(r)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.addMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While publishing data!")}})},onConvertDateToString:function(e){var t=e;var o=[];t=t.toLocaleDateString();o=t.split("/");if(o[0].length===1){o[0]="0"+o[0]}if(o[1].length===1){o[1]="0"+o[1]}t=o[2]+"-"+o[0]+"-"+o[1];return t},onPressSave:function(e){var t=e;s.confirm("Would you like to save?",{icon:s.Icon.Conf,title:"Confirmation",actions:[s.Action.YES,s.Action.NO],emphasizedAction:s.Action.YES,onClose:function(e){if(e==="YES"){l.onPressSaveConfirm(t)}else{}}})},onPressSaveConfirm:function(e){sap.ui.core.BusyIndicator.show();var t=l.getOwnerComponent().getModel("CIRModel");var o=[],i={};var a=l.oGModel.getProperty("/TData");var n=l.getView().byId("idCIReq");var s=n.getBinding("rows").oList;for(var r=0;r<a.length;r++){for(var d=0;d<l.aFirmDates.length;d++){i={};i.LOCATION_ID=a[r].LOCATION_ID;i.PRODUCT_ID=a[r].PRODUCT_ID;i.MODEL_VERSION=a[r].MODEL_VERSION;i.VERSION=a[r].VERSION;i.SCENARIO=a[r].SCENARIO;i.UNIQUE_ID=a[r].UNIQUE_ID;i.CIR_ID=a[r].CIR_ID[d];i.WEEK_DATE=l.aFirmDates[d];i.CIR_QTY=parseInt(s[r][l.aFirmDates[d]]);o.push(i)}}t.callFunction("/modifyCIRFirmQuantities",{method:"GET",urlParameters:{FLAG:"U",CIR_QUANTITIES:JSON.stringify(o)},success:function(e,t){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(t.data.modifyCIRFirmQuantities);l.onGetData},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Service Connectivity Issue, please try later!")}})},onPressAssemblyRequirements:function(e){var t=e;var o={};o.LOCATION_ID=l.getView().byId("idloc").getValue();o.PRODUCT_ID=l.getView().byId("idprodList").getValue();if(o.LOCATION_ID!==undefined&&o.LOCATION_ID!==""&&o.PRODUCT_ID!==undefined&&o.PRODUCT_ID!==""){s.confirm("Would you like to generate assembly requirements data?",{icon:s.Icon.Conf,title:"Confirmation",actions:[s.Action.YES,s.Action.NO],emphasizedAction:s.Action.YES,onClose:function(e){if(e==="YES"){l.onPressAssemblyRequirementsConfirm(t,o)}else{}}})}else{sap.m.MessageToast.show("Please select a Location & Product!")}},onPressAssemblyRequirementsConfirm:function(e,t){var o={};sap.ui.core.BusyIndicator.show();o=l.getScheduleSEDT();t.LOCATION_ID=l.getView().byId("idloc").getValue();t.PRODUCT_ID=l.getView().byId("idprodList").getValue();if(t.LOCATION_ID!==undefined&&t.LOCATION_ID!==""&&t.PRODUCT_ID!==undefined&&t.PRODUCT_ID!==""){var i={LOCATION_ID:t.LOCATION_ID,PRODUCT_ID:t.PRODUCT_ID};var a=(new Date).getTime();var n="/catalog/generateAssemblyReq";var s="Assembly Requirements"+a;sap.ui.core.BusyIndicator.show();var r={name:s,description:"Generate Assembly Requirements",action:encodeURIComponent(n),active:true,httpMethod:"POST",startTime:o.djSdate,endTime:o.djEdate,createdAt:o.djSdate,schedules:[{data:i,cron:"",time:o.oneTime,active:true,startTime:o.dsSDate,endTime:o.dsEDate}]};l.getModel("JModel").callFunction("/addMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(r)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.addMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Service Connectivity Issue!")}})}},onChangeCIRQty:function(e){}})});
},
	"cpapp/cpfullyconfproddmnd/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpfullyconfproddmnd\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Forcast Demand\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Forcast Demand\n\nflpTitle=Forcast Demand\n\nflpSubtitle=Forcast Demand\ncharn = Characteristic Name\ncharv =Characteristic Value\ncharr = Characteristic Rate\nclose =Close\n\nLoc= Location\nPrdId = Configurable Product',
	"cpapp/cpfullyconfproddmnd/manifest.json":'{"_version":"1.40.0","sap.app":{"id":"cpapp.cpfullyconfproddmnd","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.7.3","toolsId":"8fc69177-a52f-41cf-8b34-b33b76e7170c"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}},"Jobs":{"uri":"v2/jobs/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpfullyconfproddmnd-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpfullyconfproddmnd","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://dimension"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpfullyconfproddmnd.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"CIRModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"JModel":{"dataSource":"Jobs","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpfullyconfproddmnd.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteHome","pattern":"","target":["TargetHome"]}],"targets":{"TargetHome":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Home","viewName":"Home"}}},"rootView":{"viewName":"cpapp.cpfullyconfproddmnd.view.App","type":"XML","async":true,"id":"App"}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User"]}}',
	"cpapp/cpfullyconfproddmnd/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpfullyconfproddmnd/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpfullyconfproddmnd/view/App.view.xml":'<mvc:View controllerName="cpapp.cpfullyconfproddmnd.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>\n',
	"cpapp/cpfullyconfproddmnd/view/CharDetails.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form"><Dialog title="Unique ID Characteristics" contentWidth="800px"><Table id="idCharDetail" sticky="ColumnHeaders" items="{path: \'/results\'}"><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charn}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charv}" /></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{CHAR_DESC}" text="{CHAR_NAME}"/><ObjectIdentifier title="{CHARVAL_DESC}" text="{CHAR_VALUE}"/></cells></ColumnListItem></items></Table><buttons><Button type=\'Reject\' text="{i18n>close}" press="onCharClose" /></buttons></Dialog></core:FragmentDefinition>\n',
	"cpapp/cpfullyconfproddmnd/view/Home.view.xml":'<mvc:View controllerName="cpapp.cpfullyconfproddmnd.controller.Home" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" displayBlock="true" xmlns="sap.m" xmlns:f="sap.ui.layout.form" xmlns:t="sap.ui.table" xmlns:ux="sap.uxap" xmlns:l="sap.ui.layout" xmlns:html="http://www.w3.org/1999/xhtml"><Page showHeader="false" showFooter="true"><content><ux:ObjectPageLayout id="ObjectPageLayout" headerContentPinned="true" preserveHeaderStateOnScroll="true"><ux:headerTitle><ux:ObjectPageDynamicHeaderTitle><ux:expandedHeading><Title text="{i18n>appTitle}" titleAlignment="Center" /></ux:expandedHeading><ux:snappedHeading><FlexBox fitContainer="true" alignItems="Center"><Title text="{i18n>appTitle}" wrapping="true" /></FlexBox></ux:snappedHeading></ux:ObjectPageDynamicHeaderTitle></ux:headerTitle><ux:headerContent><FlexBox wrap="Wrap" fitContainer="true"><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox><Label text="" /><SearchField id="idSearch" liveChange="onSearchUniqueId" placeholder="Unique Id, Product" /></VBox><VBox><Label text="Location" required="true" /><Input id="idloc" value="" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="Configurable Product" required="true" /><Input id="idprodList" placeholder="Configurable Product" value="" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="IBP Version" required="true" /><Input id="idver" value="" placeholder="Version" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="IBP Scenario" required="true" /><Input id="idscen" value="" placeholder="Scenario" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp" /></VBox><VBox><Label text="Valid From" required="true" /><DatePicker id="fromDate" value="" displayFormat="yyyy-MM-dd" valueFormat="yyyy-MM-dd" change="handleDateChange" /></VBox><VBox><Label text="Valid To" required="true" /><DatePicker id="toDate" value="" valueFormat="yyyy-MM-dd" displayFormat="yyyy-MM-dd" change="handleDateChange" /></VBox><VBox><Label text="Model Version" /><Select id="idModelVer" selectedKey="Active"><core:ListItem key="Active" text="Active" /><core:ListItem key="Simulation" text="Simulation" /></Select></VBox><HBox class="hdrBtnMargin"><Button text="Go" type="Emphasized" press="onGetData" tooltip="Get data based on filters" /><Button text="Reset" type="Transparent" press="onResetData" tooltip="Reset filters and Data" /></HBox></l:Grid></FlexBox></ux:headerContent><ux:sections><ux:ObjectPageSection class="sapUiNoMargin" width="auto" showTitle="false"><ux:subSections><ux:ObjectPageSubSection class="sapUiNoMargin"><ux:blocks><VBox class="sapUiNoMargin"><t:Table id="idCIReq" clas="table" fixedColumnCount="2"  selectionMode="None" alternateRowColors="true" enableSelectAll="false" visibleRowCount="auto"><t:columns /></t:Table></VBox></ux:blocks></ux:ObjectPageSubSection></ux:subSections></ux:ObjectPageSection></ux:sections></ux:ObjectPageLayout></content><footer><OverflowToolbar width="100%"><ToolbarSpacer /><Button icon="sap-icon://it-host" text="Assembly Requirements" press="onPressAssemblyRequirements" type="Emphasized" /><Button icon="sap-icon://save" text="Save" press="onPressSave" type="Emphasized" /><Button icon="sap-icon://paper-plane" text="Publish" press="onPressPublish" type="Emphasized" /></OverflowToolbar></footer></Page></mvc:View>\n',
	"cpapp/cpfullyconfproddmnd/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpfullyconfproddmnd/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" \n    liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" \n    selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpfullyconfproddmnd/view/ScenarioDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="scenSlctList" title="Scenario" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleScenChange" growing="false"><StandardListItem title="{SCENARIO}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpfullyconfproddmnd/view/VersionDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="VerSlctList" title="Version" rememberSelections="false" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"   contentWidth="320px" items="{/results}" \n        selectionChange="handleVerChange" growing="false"><StandardListItem title="{VERSION}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
