sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpcompreq/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,i,l,s,a){"use strict";var r,d;return t.extend("cpapp.cpcompreq.controller.Home",{onInit:function(){d=this;this.rowData;d.locModel=new o;d.prodModel=new o;d.verModel=new o;d.scenModel=new o;d.compModel=new o;d.struModel=new o;d.locModel.setSizeLimit(1e3);d.prodModel.setSizeLimit(1e3);d.verModel.setSizeLimit(1e3);d.scenModel.setSizeLimit(1e3);d.compModel.setSizeLimit(1e3);d.struModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpcompreq.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpcompreq.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpcompreq.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpcompreq.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}if(!this._valueHelpDialogComp){this._valueHelpDialogComp=sap.ui.xmlfragment("cpapp.cpcompreq.view.ComponentDialog",this);this.getView().addDependent(this._valueHelpDialogComp)}if(!this._valueHelpDialogStru){this._valueHelpDialogStru=sap.ui.xmlfragment("cpapp.cpcompreq.view.StructureNodeDialog",this);this.getView().addDependent(this._valueHelpDialogStru)}},onAfterRendering:function(){d.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oComp=this.byId("idcomp");this.oStru=this.byId("idstru");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");this.oCompList=this._oCore.byId(this._valueHelpDialogComp.getId()+"-list");this.oStruList=this._oCore.byId(this._valueHelpDialogStru.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){s.show("error")}})},onResetDate:function(){d.byId("fromDate").setValue("");d.byId("toDate").setValue("");r.setProperty("/resetFlag","X");d.oLoc.setValue("");d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");d.onAfterRendering()},onGetData:function(e){var t={},o=[],i;d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var l=d.oGModel.getProperty("/SelectedLoc"),s=d.oGModel.getProperty("/SelectedProd"),a=d.oGModel.getProperty("/SelectedVer"),r=d.oGModel.getProperty("/SelectedScen"),n=d.oGModel.getProperty("/SelectedComp"),c=d.oGModel.getProperty("/SelectedStru");var u=this.byId("fromDate").getDateValue();var g=this.byId("toDate").getDateValue();u=d.getDateFn(u);g=d.getDateFn(g);if(l!==undefined&&s!==undefined&&a!==undefined&&r!==undefined){if(n===undefined){n=""}if(c===undefined){c=""}d.getModel("BModel").callFunction("/getCompReqFWeekly",{method:"GET",urlParameters:{LOCATION_ID:l,PRODUCT_ID:s,VERSION:a,SCENARIO:r,COMPONENT:n,STRUCNODE:c,FROMDATE:u,TODATE:g},success:function(e){d.rowData=e.results;sap.ui.core.BusyIndicator.hide();d.oGModel.setProperty("/TData",e.results);d.TableGenerate()},error:function(e){sap.m.MessageToast.show("Error While fetching data")}})}else{sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario")}},onSearchCompReq:function(e){d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var t=e.getParameter("value")||e.getParameter("newValue");d.Data=d.rowData;d.searchData=[];for(var o=0;o<d.Data.length;o++){if(d.Data[o].COMPONENT.includes(t)||d.Data[o].STRUC_NODE.includes(t)||d.Data[o].QTYTYPE.includes(t)){d.searchData.push(d.Data[o])}}d.oGModel.setProperty("/TData",d.searchData);d.TableGenerate()},TableGenerate:function(){var e={},t=[],o;d.oGModel=d.getModel("oGModel");d.tableData=d.oGModel.getProperty("/TData");var i;var l=new Date(d.byId("fromDate").getDateValue()),s=new Date(d.byId("toDate").getDateValue());l=l.toISOString().split("T")[0];s=s.toISOString().split("T")[0];var a=d.generateDateseries(l,s);for(var r=0;r<d.tableData.length;r++){e.ItemNum=d.tableData[r].ITEM_NUM;e.Component=d.tableData[r].COMPONENT;e.StructureNode=d.tableData[r].STRUC_NODE;e.Type=d.tableData[r].QTYTYPE;o=1;for(let t=4;t<a.length;t++){e[a[t].CAL_DATE]=d.tableData[r]["WEEK"+o];o++}t.push(e);e={}}var n=new sap.ui.model.json.JSONModel;n.setData({rows:t,columns:a});d.oTable.setModel(n);d.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().CAL_DATE;return new sap.ui.table.Column({width:"5rem",label:o,template:o})});d.oTable.bindRows("/rows")},generateDateseries:function(e,t){var o={},i=[];var l=e;o.CAL_DATE="Component";i.push(o);o={};o.CAL_DATE="ItemNum";i.push(o);o={};o.CAL_DATE="StructureNode";i.push(o);o={};o.CAL_DATE="Type";i.push(o);o={};o.CAL_DATE=d.getNextSunday(l);l=o.CAL_DATE;i.push(o);o={};while(l<=t){l=d.addDays(l,7);o.CAL_DATE=d.getNextSunday(l);l=o.CAL_DATE;i.push(o);o={}}var s=i.filter((e,t,o)=>o.map(e=>e.CAL_DATE).indexOf(e.CAL_DATE)==t);return s},getNextSunday:function(e){var t,o,i;const l=new Date(e);let s=l.getDay();if(s!==0)s=7-s;const a=new Date(l.getFullYear(),l.getMonth(),l.getDate()+s);t=a.getDate();o=a.getMonth()+1;i=a.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return i+"-"+o+"-"+t},addDays:function(e,t){var o,i,l;const s=new Date(e);const a=new Date(s.getFullYear(),s.getMonth(),s.getDate()+t);o=a.getDate();i=a.getMonth()+1;l=a.getFullYear();if(o<10){o="0"+o}if(i<10){i="0"+i}return l+"-"+i+"-"+o},removeDays:function(e,t){const o=new Date(e);const i=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return i.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{s.show("Select Location")}}else if(t.includes("ver")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogVer.open()}else{s.show("Select Location and Product")}}else if(t.includes("scen")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogScen.open()}else{s.show("Select Location and Product")}}else if(t.includes("idcomp")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogComp.open()}else{s.show("Select Location and Product")}}else if(t.includes("stru")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogStru.open()}else{s.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){d._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(d.oVerList.getBinding("items")){d.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){d._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(d.oScenList.getBinding("items")){d.oScenList.getBinding("items").filter([])}}else if(t.includes("Comp")){d._oCore.byId(this._valueHelpDialogComp.getId()+"-searchField").setValue("");if(d.oCompList.getBinding("items")){d.oCompList.getBinding("items").filter([])}}else if(t.includes("Stru")){d._oCore.byId(this._valueHelpDialogStru.getId()+"-searchField").setValue("");if(d.oStruList.getBinding("items")){d.oStruList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),s=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){s.push(new i({filters:[new i("LOCATION_ID",l.Contains,t),new i("LOCATION_DESC",l.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(s)}else if(o.includes("prod")){if(t!==""){s.push(new i({filters:[new i("PRODUCT_ID",l.Contains,t),new i("PROD_DESC",l.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(s)}else if(o.includes("ver")){if(t!==""){s.push(new i({filters:[new i("VERSION",l.Contains,t)],and:false}))}d.oVerList.getBinding("items").filter(s)}else if(o.includes("scen")){if(t!==""){s.push(new i({filters:[new i("SCENARIO",l.Contains,t)],and:false}))}d.oScenList.getBinding("items").filter(s)}else if(o.includes("Comp")){if(t!==""){s.push(new i({filters:[new i("COMPONENT",l.Contains,t),new i("ITEM_NUM",l.Contains,t)],and:false}))}d.oCompList.getBinding("items").filter(s)}else if(o.includes("Stru")){if(t!==""){s.push(new i({filters:[new i("STRUC_NODE",l.Contains,t)],and:false}))}d.oStruList.getBinding("items").filter(s)}},handleSelection:function(e){d.oGModel=d.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),a,r=[];if(t.includes("Loc")){d.oLoc=d.byId("idloc");d.oProd=d.byId("idprod");a=e.getParameter("selectedItems");d.oLoc.setValue(a[0].getTitle());d.oGModel.setProperty("/SelectedLoc",a[0].getTitle());d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");d.oGModel.setProperty("/SelectedProd","");this.getModel("BModel").read("/getLocProdDet",{filters:[new i("LOCATION_ID",l.EQ,a[0].getTitle())],success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){s.show("error")}})}else if(t.includes("prod")){d.oProd=d.byId("idprod");a=e.getParameter("selectedItems");d.oProd.setValue(a[0].getTitle());d.oGModel.setProperty("/SelectedProd",a[0].getTitle());d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");this.getModel("BModel").read("/getIbpVerScn",{filters:[new i("LOCATION_ID",l.EQ,d.oGModel.getProperty("/SelectedLoc")),new i("PRODUCT_ID",l.EQ,a[0].getTitle())],success:function(e){d.verModel.setData(e);d.oVerList.setModel(d.verModel)},error:function(e,t){s.show("error")}});this.getModel("BModel").read("/gBomHeaderet",{filters:[new i("LOCATION_ID",l.EQ,d.oGModel.getProperty("/SelectedLoc")),new i("PRODUCT_ID",l.EQ,a[0].getTitle())],success:function(e){d.compModel.setData(e);d.oCompList.setModel(d.compModel)},error:function(e,t){s.show("error")}})}else if(t.includes("Ver")){this.oVer=d.byId("idver");a=e.getParameter("selectedItems");d.oVer.setValue(a[0].getTitle());d.oScen.setValue("");d.oGModel.setProperty("/SelectedVer",a[0].getTitle());this.getModel("BModel").read("/getIbpVerScn",{filters:[new i("LOCATION_ID",l.EQ,d.oGModel.getProperty("/SelectedLoc")),new i("PRODUCT_ID",l.EQ,d.oGModel.getProperty("/SelectedProd")),new i("VERSION",l.EQ,a[0].getTitle())],success:function(e){d.scenModel.setData(e);d.oScenList.setModel(d.scenModel)},error:function(e,t){s.show("error")}})}else if(t.includes("scen")){this.oScen=d.byId("idscen");a=e.getParameter("selectedItems");d.oScen.setValue(a[0].getTitle());d.oGModel.setProperty("/SelectedScen",a[0].getTitle())}else if(t.includes("Comp")){this.oComp=d.byId("idcomp");a=e.getParameter("selectedItems");d.oComp.setValue(a[0].getTitle());d.oGModel.setProperty("/SelectedComp",a[0].getTitle());d.oGModel.setProperty("/SelectedCompItem",a[0].getDescription());d.oStru.setValue("");this.getModel("BModel").read("/genCompStrcNode",{filters:[new i("LOCATION_ID",l.EQ,d.oGModel.getProperty("/SelectedLoc")),new i("PRODUCT_ID",l.EQ,d.oGModel.getProperty("/SelectedProd")),new i("COMPONENT",l.EQ,d.oGModel.getProperty("/SelectedComp")),new i("ITEM_NUM",l.EQ,d.oGModel.getProperty("/SelectedCompItem"))],success:function(e){d.struModel.setData(e);d.oStruList.setModel(d.struModel)},error:function(e,t){s.show("error")}})}else if(t.includes("Stru")){this.oStru=d.byId("idstru");a=e.getParameter("selectedItems");d.oStru.setValue(a[0].getTitle());d.oGModel.setProperty("/SelectedStru",a[0].getTitle())}d.handleClose(e)},getDateFn:function(e){var t,o,i;var l=e.getMonth()+1;if(l<10){t="0"+l}else{t=l}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o}})});