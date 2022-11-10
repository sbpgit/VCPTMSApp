sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpfullyconfproddmnd/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox","sap/ui/export/library","sap/ui/export/Spreadsheet"],function(e,t,o,i,a,n,r,s,l){"use strict";var d=s.EdmType;var u,c;return t.extend("cpapp.cpfullyconfproddmnd.controller.Home",{onInit:function(){c=this;this.rowData;c.locModel=new o;c.prodModel=new o;c.verModel=new o;c.scenModel=new o;c.charModel=new o;c.locModel.setSizeLimit(1e3);c.prodModel.setSizeLimit(1e3);c.verModel.setSizeLimit(1e3);c.scenModel.setSizeLimit(1e3);c.charModel.setSizeLimit(1e3);c.aCIRQty=[];this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();c.col="";c.colDate="";c.aCIRQty=[];c.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprodList");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");c._valueHelpDialogProd.setTitleAlignment("Center");c._valueHelpDialogLoc.setTitleAlignment("Center");c._valueHelpDialogVer.setTitleAlignment("Center");c._valueHelpDialogScen.setTitleAlignment("Center");var e=new Date;c.byId("fromDate").setMinDate(e);c.byId("toDate").setMinDate(e);var t=c.getDateFn(e);var o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+90);var o=c.getDateFn(o);c.byId("fromDate").setValue(t);c.byId("toDate").setValue(o);this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");c.handleVisibleRowCount();sap.ui.core.BusyIndicator.show();this.getModel("CIRModel").read("/getLocation",{success:function(e){c.locModel.setData(e);c.oLocList.setModel(c.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){n.show("error");sap.ui.core.BusyIndicator.hide()}})},getPlannedParameters:function(){var e=c.oGModel.getProperty("/SelectedLoc");sap.ui.core.BusyIndicator.show();c.getModel("CIRModel").read("/V_Parameters",{filters:[new i("LOCATION_ID",a.EQ,e)],success:function(e){var t=e.results;var o={};if(t.length>0){var i=parseInt(e.results[0].VALUE)*7+1;var a=new Date;a=new Date(a.setDate(a.getDate()+i));var n=c.getDateFn(a);var r=new Date(a.getFullYear(),a.getMonth(),a.getDate()+90);var r=c.getDateFn(r);c.byId("fromDate").setValue(n);c.byId("toDate").setValue(r);o=t.find(e=>e.PARAMETER_ID===9);var s=parseInt(o.VALUE)*7;var l=new Date;l=new Date(l.setDate(l.getDate()+s));c.dFirmHorizonDate=l}sap.ui.core.BusyIndicator.hide()},error:function(e,t){n.show("error");sap.ui.core.BusyIndicator.hide()}})},onResetData:function(){var e=new sap.ui.model.json.JSONModel;var t=[],o=[];c.oGModel=c.getModel("oGModel");c.byId("fromDate").setValue("");c.byId("toDate").setValue("");c.oLoc.setValue("");c.oProd.setValue("");c.oVer.setValue("");c.oScen.setValue("");c.byId("idSearch").setValue("");c.oGModel.setProperty("/SelectedLoc",undefined);c.oGModel.setProperty("/SelectedProd",undefined);c.oGModel.setProperty("/SelectedVer",undefined);c.oGModel.setProperty("/SelectedScen",undefined);e.setData({rows:t,columns:o});c.oTable.setModel(e);c.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();c.oTable=c.byId("idCIReq");c.oGModel=c.getModel("oGModel");var t=c.oGModel.getProperty("/SelectedLoc"),o=c.oGModel.getProperty("/SelectedProd"),i=c.oGModel.getProperty("/SelectedVer"),a=c.oGModel.getProperty("/SelectedScen"),n=c.byId("idModelVer").getSelectedKey();c.oGModel.setProperty("/SelectedMV",c.byId("idModelVer").getSelectedKey());var r=this.byId("fromDate").getDateValue();var s=this.byId("toDate").getDateValue();if(t!==undefined&&o!==undefined&&i!==undefined&&a!==undefined&&n!==undefined&&r!==undefined&&r!==" "&&s!==undefined&&s!==" "){r=c.getDateFn(r);s=c.getDateFn(s);c.getModel("CIRModel").callFunction("/getCIRWeekly",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:o,VERSION:i,SCENARIO:a,FROMDATE:r,TODATE:s,MODEL_VERSION:n},success:function(e){sap.ui.core.BusyIndicator.hide();c.rowData=e.results;c.oGModel.setProperty("/TData",e.results);c.TableGenerate()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},TableGenerate:function(){var e={},t=[],o;c.oGModel=c.getModel("oGModel");c.tableData=c.oGModel.getProperty("/TData");c.aFirmDates=[];var i;var a=new Date(c.byId("fromDate").getDateValue()),n=new Date(c.byId("toDate").getDateValue());a=c.onConvertDateToString(a);n=c.onConvertDateToString(n);var r=c.generateDateseries(a,n);for(var s=0;s<c.tableData.length;s++){e["Unique ID"]=c.tableData[s].UNIQUE_ID.toString();e.UNIQUE_DESC=c.tableData[s].UNIQUE_DESC;e["Product"]=c.tableData[s].PRODUCT_ID;o=1;for(let t=2;t<r.length;t++){e[r[t].WEEK_DATE]=c.tableData[s]["WEEK"+o];o++}t.push(e);e={}}var l=new sap.ui.model.json.JSONModel;l.setData({rows:t,columns:r});c.oTable.setModel(l);c.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().WEEK_DATE;if(o==="Unique ID"){return new sap.ui.table.Column({width:"12rem",label:o,template:new sap.m.VBox({items:[new sap.m.Link({text:"{"+o+"}",press:c.uniqueIdLinkpress}),new sap.m.ObjectIdentifier({text:"{UNIQUE_DESC}"})]})})}else{var i=new Date(o);if(c.dFirmHorizonDate>i){c.aFirmDates.push(o);return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Input({type:"Number",placeholder:"{"+o+"}",value:"{"+o+"}",change:c.onChangeCIRQty})})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Text({text:"{"+o+"}"})})}}});c.oTable.bindRows("/rows")},generateDateseries:function(e,t){var o={},i=[];var a=e;o.WEEK_DATE="Unique ID";i.push(o);o={};o.WEEK_DATE="Product";i.push(o);o={};o.WEEK_DATE=c.getNextMonday(a);a=o.WEEK_DATE;i.push(o);o={};while(a<=t){a=c.addDays(a,7);if(a>t){break}o.WEEK_DATE=a;i.push(o);o={};if(a===t){break}}var n=i.filter((e,t,o)=>o.map(e=>e.WEEK_DATE).indexOf(e.WEEK_DATE)==t);return n},getNextMonday:function(e){var t,o,i;const a=new Date(e);var n=a.getTimezoneOffset()*6e4;a.setTime(a.getTime()+n);let r=a.getDay();if(r===1){r=0}else{if(r!==0)r=7-r;r=r+1}const s=new Date(a.getFullYear(),a.getMonth(),a.getDate()+r);t=s.getDate();o=s.getMonth()+1;i=s.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return i+"-"+o+"-"+t},addDays:function(e,t){var o,i,a;const n=new Date(e);var r=n.getTimezoneOffset()*6e4;n.setTime(n.getTime()+r);const s=new Date(n.getFullYear(),n.getMonth(),n.getDate()+t);o=s.getDate();i=s.getMonth()+1;a=s.getFullYear();if(o<10){o="0"+o}if(i<10){i="0"+i}return a+"-"+i+"-"+o},removeDays:function(e,t){const o=new Date(e);const i=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return i.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){c._valueHelpDialogLoc.open()}else if(t.includes("prodList")){if(c.byId("idloc").getValue()){c._valueHelpDialogProd.open()}else{n.show("Select Location")}}else if(t.includes("ver")){if(c.byId("idloc").getValue()&&c.byId("idprodList").getValue()){c._valueHelpDialogVer.open()}else{n.show("Select Location and Product")}}else if(t.includes("scen")){if(c.byId("idloc").getValue()&&c.byId("idprodList").getValue()){c._valueHelpDialogScen.open()}else{n.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){c._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(c.oLocList.getBinding("items")){c.oLocList.getBinding("items").filter([])}}else if(t.includes("prodList")){c._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(c.oProdList.getBinding("items")){c.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){c._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(c.oVerList.getBinding("items")){c.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){c._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(c.oScenList.getBinding("items")){c.oScenList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),n=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){n.push(new i({filters:[new i("LOCATION_ID",a.Contains,t),new i("LOCATION_DESC",a.Contains,t)],and:false}))}c.oLocList.getBinding("items").filter(n)}else if(o.includes("prod")){if(t!==""){n.push(new i({filters:[new i("PRODUCT_ID",a.Contains,t),new i("PROD_DESC",a.Contains,t)],and:false}))}c.oProdList.getBinding("items").filter(n)}else if(o.includes("ver")){if(t!==""){n.push(new i({filters:[new i("VERSION",a.Contains,t)],and:false}))}c.oVerList.getBinding("items").filter(n)}else if(o.includes("scen")){if(t!==""){n.push(new i({filters:[new i("SCENARIO",a.Contains,t)],and:false}))}c.oScenList.getBinding("items").filter(n)}},onSearchUniqueId:function(e){var t=[];c.oTable=c.byId("idCIReq");var o=e.getParameter("value")||e.getParameter("newValue");if(o){t=new i([new i("Unique ID",a.Contains,o),new i("UNIQUE_DESC",a.Contains,o),new i("Product",a.Contains,o)],false);c.oTable.getBinding().filter(t)}else{c.oTable.getBinding().filter(t)}},handleSelection:function(e){c.oGModel=c.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),r,s=[];if(t.includes("Loc")){c.oLoc=c.byId("idloc");c.oProd=c.byId("idprodList");r=e.getParameter("selectedItems");c.oLoc.setValue(r[0].getTitle());c.oGModel.setProperty("/SelectedLoc",r[0].getTitle());c.oProd.setValue("");c.oVer.setValue("");c.oScen.setValue("");c.oGModel.setProperty("/SelectedProd","");this.getModel("CIRModel").read("/getLocProdDet",{filters:[new i("LOCATION_ID",a.EQ,r[0].getTitle())],success:function(e){c.prodModel.setData(e);c.oProdList.setModel(c.prodModel)},error:function(e,t){n.show("error")}});c.getPlannedParameters()}else if(t.includes("prod")){c.oProd=c.byId("idprodList");r=e.getParameter("selectedItems");c.oProd.setValue(r[0].getTitle());c.oGModel.setProperty("/SelectedProd",r[0].getTitle());c.oVer.setValue("");c.oScen.setValue("");c.getModel("CIRModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:c.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===c.oGModel.getProperty("/SelectedProd")){t.push({VERSION:e.results[o].VERSION})}}if(t.length>0){c.verModel.setData({results:t});c.oVerList.setModel(c.verModel)}},error:function(e,t){n.show("error")}})}else if(t.includes("Ver")){this.oVer=c.byId("idver");r=e.getParameter("selectedItems");c.oVer.setValue(r[0].getTitle());c.oScen.setValue("");c.oGModel.setProperty("/SelectedVer",r[0].getTitle());c.getModel("CIRModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:c.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===c.oGModel.getProperty("/SelectedProd")&&e.results[o].VERSION===r[0].getTitle()){t.push({SCENARIO:e.results[o].SCENARIO})}}if(t.length>0){c.scenModel.setData({results:t});c.oScenList.setModel(c.scenModel)}},error:function(e,t){n.show("error")}})}else if(t.includes("scen")){this.oScen=c.byId("idscen");r=e.getParameter("selectedItems");c.oScen.setValue(r[0].getTitle());c.oGModel.setProperty("/SelectedScen",r[0].getTitle())}c.handleClose(e)},getDateFn:function(e){var t,o,i;var a=e.getMonth()+1;if(a<10){t="0"+a}else{t=a}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o},onCharClose:function(){c._onCharDetails.close()},uniqueIdLinkpress:function(e){var t=e.getSource().getAriaLabelledBy()[0];var o=c.byId("idCIReq").getColumns(),r=e.getSource().getText(),s=e.getSource().getBindingContext().getObject(),l=s["Unique ID"];if(r>0){if(!c._onCharDetails){c._onCharDetails=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.CharDetails",c);c.getView().addDependent(c._onCharDetails)}c._onCharDetails.setTitleAlignment("Center");c.CharDetailList=sap.ui.getCore().byId("idCharDetail");this.getModel("CIRModel").read("/getUniqueItem",{filters:[new i("UNIQUE_ID",a.EQ,l),new i("PRODUCT_ID",a.EQ,c.oGModel.getProperty("/SelectedProd")),new i("LOCATION_ID",a.EQ,c.oGModel.getProperty("/SelectedLoc"))],success:function(e){c.charModel.setData({results:e.results});c.CharDetailList.setModel(c.charModel);c._onCharDetails.open()},error:function(e,t){n.show("Failed to get data")}})}},onPressPublish:function(e){var t=e;if(c.aCIRQty.length>0){n.show("Please save changed quantities before publish!")}else{r.confirm("Would you like to publish?",{icon:r.Icon.Conf,title:"Confirmation",actions:[r.Action.YES,r.Action.NO],emphasizedAction:r.Action.YES,onClose:function(e){if(e==="YES"){c.onPressPublishConfirm(t)}else{}}})}},onPressPublishConfirm:function(e){sap.ui.core.BusyIndicator.show();c.oGModel=c.getModel("oGModel");var t={};var o=c.byId("fromDate").getDateValue();var i=c.byId("toDate").getDateValue();t.LOCATION_ID=c.oGModel.getProperty("/SelectedLoc");t.PRODUCT_ID=c.oGModel.getProperty("/SelectedProd");t.VERSION=c.oGModel.getProperty("/SelectedVer");t.SCENARIO=c.oGModel.getProperty("/SelectedScen");t.MODEL_VERSION=c.byId("idModelVer").getSelectedKey();if(t.LOCATION_ID!==undefined&&t.PRODUCT_ID!==undefined&&t.VERSION!==undefined&&t.SCENARIO!==undefined&&t.MODEL_VERSION!==undefined&&o!==undefined&&o!==" "&&i!==undefined&&i!==" "){o=c.getDateFn(o);i=c.getDateFn(i);t.FROMDATE=o;t.TODATE=i;c.handlePublish(t)}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},getScheduleSEDT:function(){var e={};var t=new Date;var o=t.setSeconds(t.getSeconds()+20);var i=t.setHours(t.getHours()+2);o=new Date(o);i=new Date(i);var a=new Date,n=i,r=new Date,s=i,l,d,u,c;a=a.toISOString().split("T");l=a[1].split(":");n=n.toISOString().split("T");d=n[1].split(":");r=r.toISOString().split("T");u=r[1].split(":");s=s.toISOString().split("T");c=s[1].split(":");var t=(new Date).toLocaleString().split(" ");e.djSdate=a[0]+" "+l[0]+":"+l[1]+" "+"+0000";e.djEdate=n[0]+" "+d[0]+":"+d[1]+" "+"+0000";e.dsSDate=r[0]+" "+u[0]+":"+u[1]+" "+"+0000";e.dsEDate=s[0]+" "+c[0]+":"+c[1]+" "+"+0000";e.oneTime=o;return e},handlePublish:function(e){var t={};var o=c.getOwnerComponent().getModel("CIRModel");t=c.getScheduleSEDT();var i={LOCATION_ID:e.LOCATION_ID,PRODUCT_ID:e.PRODUCT_ID,VERSION:e.VERSION,SCENARIO:e.SCENARIO,FROMDATE:e.FROMDATE,TODATE:e.TODATE,MODEL_VERSION:e.MODEL_VERSION};var a=(new Date).getTime();var n="/catalog/postCIRQuantitiesToS4";var r="CIRQtys"+a;sap.ui.core.BusyIndicator.show();var s={name:r,description:"Weekly CIR Quantity",action:encodeURIComponent(n),active:true,httpMethod:"POST",startTime:t.djSdate,endTime:t.djEdate,createdAt:t.djSdate,schedules:[{data:i,cron:"",time:t.oneTime,active:true,startTime:t.dsSDate,endTime:t.dsEDate}]};c.getModel("JModel").callFunction("/addMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(s)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.addMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While publishing data!")}})},onConvertDateToString:function(e){var t=e;var o=[];t=t.toLocaleDateString();o=t.split("/");if(o[0].length===1){o[0]="0"+o[0]}if(o[1].length===1){o[1]="0"+o[1]}t=o[2]+"-"+o[0]+"-"+o[1];return t},onPressSave:function(e){var t=e;r.confirm("Would you like to save?",{icon:r.Icon.Conf,title:"Confirmation",actions:[r.Action.YES,r.Action.NO],emphasizedAction:r.Action.YES,onClose:function(e){if(e==="YES"){c.onPressSaveConfirm(t)}else{}}})},onPressSaveConfirm:function(e){sap.ui.core.BusyIndicator.show();var t=c.getOwnerComponent().getModel("CIRModel");var o=[],i={};var a=c.oGModel.getProperty("/TData");var n=c.getView().byId("idCIReq");var r=n.getBinding("rows").oList;for(var s=0;s<a.length;s++){for(var l=0;l<c.aFirmDates.length;l++){i={};i.LOCATION_ID=a[s].LOCATION_ID;i.PRODUCT_ID=a[s].PRODUCT_ID;i.MODEL_VERSION=a[s].MODEL_VERSION;i.VERSION=a[s].VERSION;i.SCENARIO=a[s].SCENARIO;i.UNIQUE_ID=a[s].UNIQUE_ID;i.CIR_ID=a[s].CIR_ID[l];i.WEEK_DATE=c.aFirmDates[l];i.CIR_QTY=parseInt(r[s][c.aFirmDates[l]]);o.push(i)}}t.callFunction("/modifyCIRFirmQuantities",{method:"GET",urlParameters:{FLAG:"U",CIR_QUANTITIES:JSON.stringify(o)},success:function(e,t){sap.ui.core.BusyIndicator.hide();c.aCIRQty=[];sap.m.MessageToast.show(t.data.modifyCIRFirmQuantities);c.onGetData},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Service Connectivity Issue, please try later!")}})},onPressAssemblyRequirements:function(e){var t=e;var o={};o.LOCATION_ID=c.getView().byId("idloc").getValue();o.PRODUCT_ID=c.getView().byId("idprodList").getValue();if(o.LOCATION_ID!==undefined&&o.LOCATION_ID!==""&&o.PRODUCT_ID!==undefined&&o.PRODUCT_ID!==""){r.confirm("Would you like to generate assembly requirements data?",{icon:r.Icon.Conf,title:"Confirmation",actions:[r.Action.YES,r.Action.NO],emphasizedAction:r.Action.YES,onClose:function(e){if(e==="YES"){c.onPressAssemblyRequirementsConfirm(t,o)}else{}}})}else{sap.m.MessageToast.show("Please select a Location & Product!")}},onPressAssemblyRequirementsConfirm:function(e,t){var o={};sap.ui.core.BusyIndicator.show();o=c.getScheduleSEDT();t.LOCATION_ID=c.getView().byId("idloc").getValue();t.PRODUCT_ID=c.getView().byId("idprodList").getValue();if(t.LOCATION_ID!==undefined&&t.LOCATION_ID!==""&&t.PRODUCT_ID!==undefined&&t.PRODUCT_ID!==""){var i={LOCATION_ID:t.LOCATION_ID,PRODUCT_ID:t.PRODUCT_ID};var a=(new Date).getTime();var n="/catalog/generateAssemblyReq";var r="Assembly Requirements"+a;sap.ui.core.BusyIndicator.show();var s={name:r,description:"Generate Assembly Requirements",action:encodeURIComponent(n),active:true,httpMethod:"POST",startTime:o.djSdate,endTime:o.djEdate,createdAt:o.djSdate,schedules:[{data:i,cron:"",time:o.oneTime,active:true,startTime:o.dsSDate,endTime:o.dsEDate}]};c.getModel("JModel").callFunction("/addMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(s)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.addMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Service Connectivity Issue!")}})}},onChangeCIRQty:function(e){var t=c.oGModel.getProperty("/TData");var o=c.getView().byId("idCIReq");var i=o.getBinding("rows").oList;var a={};var n=e.getSource().getBindingContext().getObject();var r=parseInt(e.getParameter("newValue"));var s=parseInt(e.getSource().getProperty("placeholder"));var l=e.getSource().mBindingInfos.placeholder.binding.sPath;if(r!==s){a.UNIQUE_ID=n["Unique ID"];a.WEEK_DATE=l;a.CIR_QTY=n[l];c.aCIRQty.push(a)}else{if(c.aCIRQty.length>0){for(var d=0;d<c.aCIRQty.length;d++){if(c.aCIRQty[d].UNIQUE_ID===n["Unique ID"]&&c.aCIRQty[d].WEEK_DATE===l){c.aCIRQty.splice(d,1);break}}}}},createColumnConfig:function(){var e=[];var t=c.getView().byId("idCIReq");var o=t.getBinding("columns").oList;for(var i=0;i<o.length;i++){if(i===1){e.push({label:"UNIQUE_DESC",type:d.String,property:"UNIQUE_DESC",width:20,wrap:true});e.push({label:o[i].WEEK_DATE,type:d.String,property:o[i].WEEK_DATE,width:20,wrap:true})}else if(o[i].WEEK_DATE.includes("-")===true){e.push({label:o[i].WEEK_DATE,type:d.Number,property:o[i].WEEK_DATE,width:20,wrap:true})}else{e.push({label:o[i].WEEK_DATE,type:d.String,property:o[i].WEEK_DATE,width:20,wrap:true})}}return e},onPressDownload:function(e){var t,o,i;var a=c.getView().byId("idCIReq");var n=a.getBinding("rows").oList;var r=(new Date).getTime();var s="Forecast Demand - "+r;t=c.createColumnConfig();o={workbook:{columns:t},dataSource:n,fileName:s,worker:false};i=new l(o);i.build().finally(function(){i.destroy()})},handleDateInputDisable:function(){var e=c.byId("fromDate");e.addEventDelegate({onAfterRendering:function(){var e=this.$().find(".sapMInputBaseInner");var t=e[0].id;$("#"+t).attr("disabled",true)}},e);var t=c.byId("toDate");t.addEventDelegate({onAfterRendering:function(){var e=this.$().find(".sapMInputBaseInner");var t=e[0].id;$("#"+t).attr("disabled",true)}},t)},handleVisibleRowCount:function(){var e=window.innerHeight;if(e>750&&e<800){c.byId("idCIReq").setVisibleRowCount(9)}else if(e>800&&e<900){c.byId("idCIReq").setVisibleRowCount(10)}else if(e>900&&e<1e3){c.byId("idCIReq").setVisibleRowCount(12)}else if(e>1e3&&e<1100){c.byId("idCIReq").setVisibleRowCount(14)}else{c.byId("idCIReq").setVisibleRowCount(8)}},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var o=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(o,true)}}})});