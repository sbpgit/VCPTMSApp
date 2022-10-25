sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpasmbcompreq/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,l,i,a,s){"use strict";var r,d;return t.extend("cpapp.cpasmbcompreq.controller.Home",{onInit:function(){d=this;this.rowData;d.locModel=new o;d.prodModel=new o;d.verModel=new o;d.scenModel=new o;d.compModel=new o;d.struModel=new o;d.charModel=new o;d.graphModel=new o;d.graphtModel=new o;d.AsmbCompModel=new o;d.locModel.setSizeLimit(1e3);d.prodModel.setSizeLimit(1e3);d.verModel.setSizeLimit(1e3);d.scenModel.setSizeLimit(1e3);d.compModel.setSizeLimit(1e3);d.struModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}if(!this._valueHelpDialogComp){this._valueHelpDialogComp=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.ComponentDialog",this);this.getView().addDependent(this._valueHelpDialogComp)}if(!this._valueHelpDialogStru){this._valueHelpDialogStru=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.StructureNodeDialog",this);this.getView().addDependent(this._valueHelpDialogStru)}if(!this._odGraphDialog){this._odGraphDialog=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.CompODBreakdown",this);this.getView().addDependent(this._odGraphDialog)}if(!this._AsmbCompDialog){this._AsmbCompDialog=sap.ui.xmlfragment("cpapp.cpasmbcompreq.view.AsmbCompDialog",this);this.getView().addDependent(this._AsmbCompDialog)}},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();d.colComp="";d.colDate="";d.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oComp=this.byId("idcomp");this.oStru=this.byId("idstru");this.oPanel=this.byId("idPanel");d._valueHelpDialogProd.setTitleAlignment("Center");d._valueHelpDialogLoc.setTitleAlignment("Center");d._valueHelpDialogVer.setTitleAlignment("Center");d._valueHelpDialogScen.setTitleAlignment("Center");d._valueHelpDialogComp.setTitleAlignment("Center");d._valueHelpDialogStru.setTitleAlignment("Center");var e=new Date;var t=d.getDateFn(e);var o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+90);var o=d.getDateFn(o);d.byId("fromDate").setValue(t);d.byId("toDate").setValue(o);this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");this.oCompList=this._oCore.byId(this._valueHelpDialogComp.getId()+"-list");this.oStruList=this._oCore.byId(this._valueHelpDialogStru.getId()+"-list");this.oGridList=this._oCore.byId(sap.ui.getCore().byId("charOdDialog").getContent()[0].getId());this.oGraphchart=this._oCore.byId(sap.ui.getCore().byId("idPanel").getContent()[0].getId());sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onResetDate:function(){d.byId("fromDate").setValue("");d.byId("toDate").setValue("");r.setProperty("/resetFlag","X");d.oLoc.setValue("");d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");d.onAfterRendering()},onGetData:function(e){sap.ui.core.BusyIndicator.show();d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var t=d.oGModel.getProperty("/SelectedLoc"),o=d.oGModel.getProperty("/SelectedProd"),l=d.oGModel.getProperty("/SelectedVer"),i=d.oGModel.getProperty("/SelectedScen"),a=d.oGModel.getProperty("/SelectedComp"),s=d.oGModel.getProperty("/SelectedStru"),r=d.byId("idModelVer").getSelectedKey();d.oGModel.setProperty("/SelectedMV",d.byId("idModelVer").getSelectedKey());var n=this.byId("fromDate").getDateValue();var c=this.byId("toDate").getDateValue();if(t!==undefined&&o!==undefined&&l!==undefined&&i!==undefined&&r!==undefined&&n!==undefined&&n!==" "&&c!==undefined&&c!==" "){n=d.getDateFn(n);c=d.getDateFn(c);d.getModel("BModel").callFunction("/getAsmbCompReqFWeekly",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:o,VERSION:l,SCENARIO:i,FROMDATE:n,TODATE:c,MODEL_VERSION:r},success:function(e){sap.ui.core.BusyIndicator.hide();d.rowData=e.results;d.oGModel.setProperty("/TData",e.results);d.TableGenerate();var t=d.byId("idCheck1").getSelected();if(t){d.onNonZero()}},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario/Date Range")}},onSearchCompReq:function(e){d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var t=e.getParameter("value")||e.getParameter("newValue");if(t===""){d.onNonZero()}else{d.oGModel=d.getModel("oGModel");d.Data=d.oGModel.getProperty("/TData");d.searchData=[];for(var o=0;o<d.Data.length;o++){if(d.Data[o].COMPONENT.includes(t)||d.Data[o].STRUC_NODE.includes(t)||d.Data[o].QTYTYPE.includes(t)){d.searchData.push(d.Data[o])}}d.oGModel.setProperty("/TData",d.searchData);d.TableGenerate()}},TableGenerate:function(){var e={},t=[],o;d.oGModel=d.getModel("oGModel");d.tableData=d.oGModel.getProperty("/TData");var l;var i=new Date(d.byId("fromDate").getDateValue()),a=new Date(d.byId("toDate").getDateValue());i=i.toISOString().split("T")[0];a=a.toISOString().split("T")[0];var s=d.generateDateseries(i,a);for(var r=0;r<d.tableData.length;r++){e.Component=d.tableData[r].COMPONENT;o=1;for(let t=1;t<s.length;t++){e[s[t].CAL_DATE]=d.tableData[r]["WEEK"+o];o++}t.push(e);e={}}var n=new sap.ui.model.json.JSONModel;n.setData({rows:t,columns:s});d.oTable.setModel(n);d.oTable.bindColumns("/columns",function(e,t){var o=t.getObject().CAL_DATE;if(o==="Component"){return new sap.ui.table.Column({width:"8rem",label:o,template:o})}else{return new sap.ui.table.Column({width:"8rem",label:o,template:new sap.m.Link({text:"{"+o+"}",press:d.asmbcompLinkpress})})}});d.oTable.bindRows("/rows")},onNonZero:function(e){d.oTable=d.byId("idCompReq");d.oGModel=d.getModel("oGModel");var t=d.byId("idCheck1").getSelected(),o,l;d.searchData=d.rowData;d.FinalData=[];var i=d.oTable.getColumns().length-3,a=d.tableData;if(t){for(var s=0;s<d.searchData.length;s++){l=0;for(var r=1;r<i;r++){if(d.searchData[s]["WEEK"+r]!==0&&d.searchData[s]["WEEK"+r]!==null){l=l+1;break}}if(l!==0){d.FinalData.push(d.searchData[s])}}}else{d.FinalData=d.searchData}d.oGModel.setProperty("/TData",d.FinalData);d.TableGenerate()},asmbcompLinkpress:function(e){var t=e.getSource().getAriaLabelledBy()[0];var o=d.byId("idCompReq").getColumns(),s,r=e.getSource().getText(),n=e.getSource().getBindingContext().getObject(),c=n.Component;d.colComp=c;for(var g=0;g<o.length;g++){if(t===o[g].sId){s=d.byId("idCompReq").getColumns()[g].getLabel().getText()}}d.colDate=s;d.oGModel.setProperty("/SelectedDate",s);if(r>0){this.getModel("BModel").read("/getAsmbCompReq",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,d.oGModel.getProperty("/SelectedVer")),new l("SCENARIO",i.EQ,d.oGModel.getProperty("/SelectedScen")),new l("COMPONENT",i.EQ,c),new l("CAL_DATE",i.EQ,s),new l("MODEL_VERSION",i.EQ,d.oGModel.getProperty("/SelectedMV"))],success:function(e){d.AsmbCompModel.setData(e);d.oAsmbCompList=sap.ui.getCore().byId("idAsmbComp");d.oAsmbCompList.setModel(d.AsmbCompModel);d._AsmbCompDialog.open()},error:function(e,t){a.show("error")}})}},onAsmbCompClose:function(){d._AsmbCompDialog.close()},OnAsmbPress:function(e){d.charModel.setData([]);d.oGridList.setModel(d.charModel);d.graphModel.setData([]);d.oGraphchart.setModel(d.graphModel);var t=d.oGModel.getProperty("/SelectedLoc"),o=d.oGModel.getProperty("/SelectedProd"),s=d.oGModel.getProperty("/SelectedVer"),r=d.oGModel.getProperty("/SelectedScen"),n=d.oGModel.getProperty("/SelectedMV"),c=d.oGModel.getProperty("/SelectedDate"),g=e.getSource().getText();this.getModel("BModel").read("/getBOMPred",{filters:[new l("LOCATION_ID",i.EQ,t),new l("PRODUCT_ID",i.EQ,o),new l("VERSION",i.EQ,s),new l("SCENARIO",i.EQ,r),new l("COMPONENT",i.EQ,g),new l("CAL_DATE",i.EQ,c),new l("MODEL_VERSION",i.EQ,n)],success:function(e){d.charModel.setData(e);d.oGridList.setModel(d.charModel);d._odGraphDialog.open()},error:function(e,t){a.show("error")}})},onExpand:function(e){var t=e.getSource().getHeaderText();var o=t.split(":");d.getModel("BModel").read("/getOdCharImpact",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("VERSION",i.EQ,d.oGModel.getProperty("/SelectedVer")),new l("SCENARIO",i.EQ,d.oGModel.getProperty("/SelectedScen")),new l("CAL_DATE",i.EQ,d.colDate),new l("OBJ_DEP",i.EQ,o[0].split("_")[0]),new l("OBJ_COUNTER",i.EQ,o[0].split("_")[1]),new l("MODEL_VERSION",i.EQ,d.oGModel.getProperty("/SelectedMV"))],success:function(e){d.graphModel.setData(e);d.oGraphchart.setModel(d.graphModel)},error:function(e,t){a.show("error")}})},handleDialogClose(){d._odGraphDialog.close()},generateDateseries:function(e,t){var o={},l=[];var i=e;o.CAL_DATE="Component";l.push(o);o={};o.CAL_DATE=d.getNextMonday(i);i=o.CAL_DATE;l.push(o);o={};while(i<=t){i=d.addDays(i,7);o.CAL_DATE=i;l.push(o);o={}}var a=l.filter((e,t,o)=>o.map(e=>e.CAL_DATE).indexOf(e.CAL_DATE)==t);return a},getNextMonday:function(e){var t,o,l;const i=new Date(e);let a=i.getDay();if(a!==0)a=7-a;a=a+1;const s=new Date(i.getFullYear(),i.getMonth(),i.getDate()+a);t=s.getDate();o=s.getMonth()+1;l=s.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return l+"-"+o+"-"+t},addDays:function(e,t){var o,l,i;const a=new Date(e);const s=new Date(a.getFullYear(),a.getMonth(),a.getDate()+t);o=s.getDate();l=s.getMonth()+1;i=s.getFullYear();if(o<10){o="0"+o}if(l<10){l="0"+l}return i+"-"+l+"-"+o},removeDays:function(e,t){const o=new Date(e);const l=new Date(o.getFullYear(),o.getMonth(),o.getDate()-t);return l.toISOString().split("T")[0]},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(t.includes("ver")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(t.includes("scen")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogScen.open()}else{a.show("Select Location and Product")}}else if(t.includes("idcomp")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogComp.open()}else{a.show("Select Location and Product")}}else if(t.includes("stru")){if(d.byId("idloc").getValue()&&d.byId("idprod").getValue()){d._valueHelpDialogStru.open()}else{a.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){d._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(d.oVerList.getBinding("items")){d.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){d._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(d.oScenList.getBinding("items")){d.oScenList.getBinding("items").filter([])}}else if(t.includes("Comp")){d._oCore.byId(this._valueHelpDialogComp.getId()+"-searchField").setValue("");if(d.oCompList.getBinding("items")){d.oCompList.getBinding("items").filter([])}}else if(t.includes("Stru")){d._oCore.byId(this._valueHelpDialogStru.getId()+"-searchField").setValue("");if(d.oStruList.getBinding("items")){d.oStruList.getBinding("items").filter([])}}else if(t.includes("__button4")){d._odGraphDialog.close()}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){a.push(new l({filters:[new l("LOCATION_ID",i.Contains,t),new l("LOCATION_DESC",i.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(a)}else if(o.includes("prod")){if(t!==""){a.push(new l({filters:[new l("PRODUCT_ID",i.Contains,t),new l("PROD_DESC",i.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(a)}else if(o.includes("ver")){if(t!==""){a.push(new l({filters:[new l("VERSION",i.Contains,t)],and:false}))}d.oVerList.getBinding("items").filter(a)}else if(o.includes("scen")){if(t!==""){a.push(new l({filters:[new l("SCENARIO",i.Contains,t)],and:false}))}d.oScenList.getBinding("items").filter(a)}else if(o.includes("Comp")){if(t!==""){a.push(new l({filters:[new l("COMPONENT",i.Contains,t),new l("ITEM_NUM",i.Contains,t)],and:false}))}d.oCompList.getBinding("items").filter(a)}else if(o.includes("Stru")){if(t!==""){a.push(new l({filters:[new l("STRUC_NODE",i.Contains,t)],and:false}))}d.oStruList.getBinding("items").filter(a)}},handleSelection:function(e){d.oGModel=d.getModel("oGModel");var t=e.getParameter("id"),o=e.getParameter("selectedItems"),s,r=[];if(t.includes("Loc")){d.oLoc=d.byId("idloc");d.oProd=d.byId("idprod");s=e.getParameter("selectedItems");d.oLoc.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedLoc",s[0].getTitle());d.oProd.setValue("");d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");d.oGModel.setProperty("/SelectedProd","");this.getModel("BModel").read("/getLocProdDet",{filters:[new l("LOCATION_ID",i.EQ,s[0].getTitle())],success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){d.oProd=d.byId("idprod");s=e.getParameter("selectedItems");d.oProd.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedProd",s[0].getTitle());d.oVer.setValue("");d.oScen.setValue("");d.oComp.setValue("");d.oStru.setValue("");this.getModel("BModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:d.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===s[0].getTitle()){t.push({VERSION:e.results[o].VERSION})}}if(t.length>0){d.verModel.setData({results:t});d.oVerList.setModel(d.verModel)}},error:function(e,t){a.show("error")}});this.getModel("BModel").read("/gBomHeaderet",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,s[0].getTitle())],success:function(e){d.compModel.setData(e);d.oCompList.setModel(d.compModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Ver")){this.oVer=d.byId("idver");s=e.getParameter("selectedItems");d.oVer.setValue(s[0].getTitle());d.oScen.setValue("");d.oGModel.setProperty("/SelectedVer",s[0].getTitle());this.getModel("BModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:d.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===d.byId("idprod").getValue()&&e.results[o].VERSION===s[0].getTitle()){t.push({SCENARIO:e.results[o].SCENARIO})}}if(t.length>0){d.scenModel.setData({results:t});d.oScenList.setModel(d.scenModel)}},error:function(e,t){a.show("error")}})}else if(t.includes("scen")){this.oScen=d.byId("idscen");s=e.getParameter("selectedItems");d.oScen.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedScen",s[0].getTitle())}else if(t.includes("Comp")){this.oComp=d.byId("idcomp");s=e.getParameter("selectedItems");d.oComp.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedComp",s[0].getTitle());d.oGModel.setProperty("/SelectedCompItem",s[0].getDescription());d.oStru.setValue("");this.getModel("BModel").read("/genCompStrcNode",{filters:[new l("LOCATION_ID",i.EQ,d.oGModel.getProperty("/SelectedLoc")),new l("PRODUCT_ID",i.EQ,d.oGModel.getProperty("/SelectedProd")),new l("COMPONENT",i.EQ,d.oGModel.getProperty("/SelectedComp")),new l("ITEM_NUM",i.EQ,d.oGModel.getProperty("/SelectedCompItem"))],success:function(e){d.struModel.setData(e);d.oStruList.setModel(d.struModel)},error:function(e,t){a.show("error")}})}else if(t.includes("Stru")){this.oStru=d.byId("idstru");s=e.getParameter("selectedItems");d.oStru.setValue(s[0].getTitle());d.oGModel.setProperty("/SelectedStru",s[0].getTitle())}d.handleClose(e)},getDateFn:function(e){var t,o,l;var i=e.getMonth()+1;if(i<10){t="0"+i}else{t=i}if(e.getDate()<10){o="0"+e.getDate()}else{o=e.getDate()}return e=e.getFullYear()+"-"+t+"-"+o}})});