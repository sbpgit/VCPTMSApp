sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpfullyconfproddmnd/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,i,l,a,s){"use strict";var r,n;return t.extend("cpapp.cpfullyconfproddmnd.controller.Home",{onInit:function(){n=this;this.rowData;n.locModel=new o;n.prodModel=new o;n.verModel=new o;n.scenModel=new o;n.charModel=new o;n.locModel.setSizeLimit(1e3);n.prodModel.setSizeLimit(1e3);n.verModel.setSizeLimit(1e3);n.scenModel.setSizeLimit(1e3);n.charModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();n.col="";n.colDate="";n.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprodList");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");n._valueHelpDialogProd.setTitleAlignment("Center");n._valueHelpDialogLoc.setTitleAlignment("Center");n._valueHelpDialogVer.setTitleAlignment("Center");n._valueHelpDialogScen.setTitleAlignment("Center");var e=new Date;var t=n.getDateFn(e);var o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+90);var o=n.getDateFn(o);n.byId("fromDate").setValue(t);n.byId("toDate").setValue(o);this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("CIRModel").read("/getLocation",{success:function(e){n.locModel.setData(e);n.oLocList.setModel(n.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onResetDate:function(){n.byId("fromDate").setValue("");n.byId("toDate").setValue("");r.setProperty("/resetFlag","X");n.oLoc.setValue("");n.oProd.setValue("");n.oVer.setValue("");n.oScen.setValue("");n.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();n.oTable=n.byId("idCIReq");n.oGModel=n.getModel("oGModel");var t=n.oGModel.getProperty("/SelectedLoc"),o=n.oGModel.getProperty("/SelectedProd"),i=n.oGModel.getProperty("/SelectedVer"),l=n.oGModel.getProperty("/SelectedScen"),a=n.byId("idModelVer").getSelectedKey();n.oGModel.setProperty("/SelectedMV",n.byId("idModelVer").getSelectedKey());var s=this.byId("fromDate").getDateValue();var r=this.byId("toDate").getDateValue();if(t!==undefined&&o!==undefined&&i!==undefined&&l!==undefined&&a!==undefined&&s!==undefined&&s!==" "&&r!==undefined&&r!==" "){s=n.getDateFn(s);r=n.getDateFn(r);n.getModel("CIRModel").callFunction("/getCIRWeekly",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:o,VERSION:i,SCENARIO:l,FROMDATE:s,TODATE:r,MODEL_VERSION:a},success:function(e){sap.ui.core.BusyIndicator.hide();n.rowData=e.results;n.oGModel.setProperty("/TData",e.results);n.TableGenerate()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},TableGenerate:function(){var e={},t=[],o;n.oGModel=n.getModel("oGModel");n.tableData=n.oGModel.getProperty("/TData");var i;var l=new Date(n.byId("fromDate").getDateValue()),a=new Date(n.byId("toDate").getDateValue());l=l.toISOString().split("T")[0];a=a.toISOString().split("T")[0];var s=n.generateDateseries(l,a);for(var r=0;r<n.tableData.length;r++){e["Unique ID"]=n.tableData[r].UNIQUE_ID;o=1;for(let t=1;t<s.length;t++){e[s[t].WEEK_DATE]=n.tableData[r]["WEEK"+o];o++}t.push(e);e={}}var d=new sap.ui.model.json.JSONModel;d.setData({rows:t,columns:s});n.oTable.setModel(d);n.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().WEEK_DATE;if(o==="Unique ID"){return new sap.ui.table.Column({width:"10rem",label:o,template:new sap.m.Link({text:"{"+o+"}",press:n.uniqueIdLinkpress})})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:o})}});n.oTable.bindRows("/rows")},handleDialogClose(){n._odGraphDialog.close()},generateDateseries:function(e,t){var o={},i=[];var l=e;o.WEEK_DATE="Unique ID";i.push(o);o={};o.WEEK_DATE=n.getNextMonday(l);l=o.WEEK_DATE;i.push(o);o={};while(l<=t){l=n.addDays(l,7);o.WEEK_DATE=l;i.push(o);o={}}var a=i.filter((e,t,o)=>o.map(e=>e.WEEK_DATE).indexOf(e.WEEK_DATE)==t);return a},getNextMonday:function(e){var t,o,i;const l=new Date(e);let a=l.getDay();if(a!==0)a=7-a;a=a+1;const s=new Date(l.getFullYear(),l.getMonth(),l.getDate()+a);t=s.getDate();o=s.getMonth()+1;i=s.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return i+"-"+o+"-"+t},addDays:function(e,t){var o,i,l;const a=new Date(e);const s=new Date(a.getFullYear(),a.getMonth(),a.getDate()+t);o=s.getDate();i=s.getMonth()+1;l=s.getFullYear();if(o<10){o="0"+o}if(i<10){i="0"+i}return l+"-"+i+"-"+o},removeDays:function(e,t){const o=new Date(e);const i=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return i.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){n._valueHelpDialogLoc.open()}else if(t.includes("prodList")){if(n.byId("idloc").getValue()){n._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(t.includes("ver")){if(n.byId("idloc").getValue()&&n.byId("idprodList").getValue()){n._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(t.includes("scen")){if(n.byId("idloc").getValue()&&n.byId("idprodList").getValue()){n._valueHelpDialogScen.open()}else{a.show("Select Location and Product")}}else if(t.includes("idcomp")){if(n.byId("idloc").getValue()&&n.byId("idprodList").getValue()){n._valueHelpDialogComp.open()}else{a.show("Select Location and Product")}}else if(t.includes("stru")){if(n.byId("idloc").getValue()&&n.byId("idprodList").getValue()){n._valueHelpDialogStru.open()}else{a.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){n._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(n.oLocList.getBinding("items")){n.oLocList.getBinding("items").filter([])}}else if(t.includes("prodList")){n._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(n.oProdList.getBinding("items")){n.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){n._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(n.oVerList.getBinding("items")){n.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){n._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(n.oScenList.getBinding("items")){n.oScenList.getBinding("items").filter([])}}else if(t.includes("Comp")){n._oCore.byId(this._valueHelpDialogComp.getId()+"-searchField").setValue("")}else if(t.includes("Stru")){n._oCore.byId(this._valueHelpDialogStru.getId()+"-searchField").setValue("")}else if(t.includes("__button4")){}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){a.push(new i({filters:[new i("LOCATION_ID",l.Contains,t),new i("LOCATION_DESC",l.Contains,t)],and:false}))}n.oLocList.getBinding("items").filter(a)}else if(o.includes("prod")){if(t!==""){a.push(new i({filters:[new i("PRODUCT_ID",l.Contains,t),new i("PROD_DESC",l.Contains,t)],and:false}))}n.oProdList.getBinding("items").filter(a)}else if(o.includes("ver")){if(t!==""){a.push(new i({filters:[new i("VERSION",l.Contains,t)],and:false}))}n.oVerList.getBinding("items").filter(a)}else if(o.includes("scen")){if(t!==""){a.push(new i({filters:[new i("SCENARIO",l.Contains,t)],and:false}))}n.oScenList.getBinding("items").filter(a)}else if(o.includes("Comp")){if(t!==""){a.push(new i({filters:[new i("COMPONENT",l.Contains,t),new i("ITEM_NUM",l.Contains,t)],and:false}))}}else if(o.includes("Stru")){if(t!==""){a.push(new i({filters:[new i("STRUC_NODE",l.Contains,t)],and:false}))}n.oStruList.getBinding("items").filter(a)}},handleSelection:function(e){n.oGModel=n.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),s,r=[];if(t.includes("Loc")){n.oLoc=n.byId("idloc");n.oProd=n.byId("idprodList");s=e.getParameter("selectedItems");n.oLoc.setValue(s[0].getTitle());n.oGModel.setProperty("/SelectedLoc",s[0].getTitle());n.oProd.setValue("");n.oVer.setValue("");n.oScen.setValue("");n.oGModel.setProperty("/SelectedProd","");this.getModel("CIRModel").read("/getLocProdDet",{filters:[new i("LOCATION_ID",l.EQ,s[0].getTitle())],success:function(e){n.prodModel.setData(e);n.oProdList.setModel(n.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){n.oProd=n.byId("idprodList");s=e.getParameter("selectedItems");n.oProd.setValue(s[0].getTitle());n.oGModel.setProperty("/SelectedProd",s[0].getTitle());n.oVer.setValue("");n.oScen.setValue("");this.getModel("CIRModel").read("/getCIRVerScen",{filters:[new i("LOCATION_ID",l.EQ,n.oGModel.getProperty("/SelectedLoc")),new i("REF_PRODID",l.EQ,n.oGModel.getProperty("/SelectedProd"))],success:function(e){n.verModel.setData(e);n.oVerList.setModel(n.verModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Ver")){this.oVer=n.byId("idver");s=e.getParameter("selectedItems");n.oVer.setValue(s[0].getTitle());n.oScen.setValue("");n.oGModel.setProperty("/SelectedVer",s[0].getTitle());this.getModel("CIRModel").read("/getCIRVerScen",{filters:[new i("LOCATION_ID",l.EQ,n.oGModel.getProperty("/SelectedLoc")),new i("REF_PRODID",l.EQ,n.oGModel.getProperty("/SelectedProd")),new i("VERSION",l.EQ,s[0].getTitle())],success:function(e){n.scenModel.setData(e);n.oScenList.setModel(n.scenModel)},error:function(e,t){a.show("error")}})}else if(t.includes("scen")){this.oScen=n.byId("idscen");s=e.getParameter("selectedItems");n.oScen.setValue(s[0].getTitle());n.oGModel.setProperty("/SelectedScen",s[0].getTitle())}else if(t.includes("Comp")){this.oComp=n.byId("idcomp");s=e.getParameter("selectedItems");n.oGModel.setProperty("/SelectedComp",s[0].getTitle());n.oGModel.setProperty("/SelectedCompItem",s[0].getDescription())}else if(t.includes("Stru")){this.oStru=n.byId("idstru");s=e.getParameter("selectedItems");n.oStru.setValue(s[0].getTitle());n.oGModel.setProperty("/SelectedStru",s[0].getTitle())}n.handleClose(e)},getDateFn:function(e){var t,o,i;var l=e.getMonth()+1;if(l<10){t="0"+l}else{t=l}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o},onCharClose:function(){n._onCharDetails.close()},uniqueIdLinkpress:function(e){var t=e.getSource().getAriaLabelledBy()[0];var o=n.byId("idCIReq").getColumns(),s,r=e.getSource().getText(),d=e.getSource().getBindingContext().getObject(),c=d["Unique ID"];if(r>0){if(!n._onCharDetails){n._onCharDetails=sap.ui.xmlfragment("cpapp.cpfullyconfproddmnd.view.CharDetails",n);n.getView().addDependent(n._onCharDetails)}n._onCharDetails.setTitleAlignment("Center");n.CharDetailList=sap.ui.getCore().byId("idCharDetail");this.getModel("CIRModel").read("/getUniqueItem",{filters:[new i("UNIQUE_ID",l.EQ,c),new i("PRODUCT_ID",l.EQ,n.oGModel.getProperty("/SelectedProd")),new i("LOCATION_ID",l.EQ,n.oGModel.getProperty("/SelectedLoc"))],success:function(e){n.charModel.setData({results:e.results});n.CharDetailList.setModel(n.charModel);n._onCharDetails.open()},error:function(){a.show("Failed to get data")}})}},handlePublish:function(e){var t=n.getOwnerComponent().getModel("CIRModel");var o=new Date;var i=o.setSeconds(o.getSeconds()+20);var l=o.setHours(o.getHours()+2);i=new Date(i);l=new Date(l);var a=i;var s=new Date,r=l,d=new Date,c=l,u,g,p,D;s=s.toISOString().split("T");u=s[1].split(":");r=r.toISOString().split("T");g=r[1].split(":");d=d.toISOString().split("T");p=d[1].split(":");c=c.toISOString().split("T");D=c[1].split(":");var o=(new Date).toLocaleString().split(" "),s=s[0]+" "+u[0]+":"+u[1]+" "+"+0000";r=r[0]+" "+g[0]+":"+g[1]+" "+"+0000";d=d[0]+" "+p[0]+":"+p[1]+" "+"+0000";c=c[0]+" "+D[0]+":"+D[1]+" "+"+0000";var f={LOCATION_ID:e.LOCATION_ID,PRODUCT_ID:e.PRODUCT_ID,VERSION:e.VERSION,SCENARIO:e.SCENARIO,FROMDATE:e.FROMDATE,TODATE:e.TODATE,MODEL_VERSION:e.MODEL_VERSION};n.oGModel.setProperty("/vcrulesData",f);var I=n.oGModel.getProperty("/vcrulesData");var h=(new Date).getTime();var S="/catalog/postCIRQuantitiesToS4";var M="CIRQtys"+h;sap.ui.core.BusyIndicator.show();var m={name:M,description:"Weekly CIR Quantity",action:encodeURIComponent(S),active:true,httpMethod:"POST",startTime:s,endTime:r,createdAt:s,schedules:[{data:I,cron:"",time:a,active:true,startTime:d,endTime:c}]};n.getModel("JModel").callFunction("/laddMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(m)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(e.laddMLJob+": Job Created")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error POsting Data")}})},onPressPublish:function(e){sap.ui.core.BusyIndicator.show();n.oGModel=n.getModel("oGModel");var t={};var o=n.byId("fromDate").getDateValue();var i=n.byId("toDate").getDateValue();t.LOCATION_ID=n.oGModel.getProperty("/SelectedLoc");t.PRODUCT_ID=n.oGModel.getProperty("/SelectedProd");t.VERSION=n.oGModel.getProperty("/SelectedVer");t.SCENARIO=n.oGModel.getProperty("/SelectedScen");t.MODEL_VERSION=n.byId("idModelVer").getSelectedKey();if(t.LOCATION_ID!==undefined&&t.PRODUCT_ID!==undefined&&t.VERSION!==undefined&&t.SCENARIO!==undefined&&t.MODEL_VERSION!==undefined&&o!==undefined&&o!==" "&&i!==undefined&&i!==" "){o=n.getDateFn(o);i=n.getDateFn(i);t.FROMDATE=o;t.TODATE=i;n.handlePublish(t)}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}}})});