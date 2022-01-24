sap.ui.define(["cp/appf/cpassignprofiles/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,l,s,a,o,i,d){"use strict";var r,g;return e.extend("cp.appf.cpassignprofiles.controller.Detail",{onInit:function(){r=this;r.oListModel=new s;r.oParamModel=new s;r.oAlgoListModel=new s},onBack:function(){var e=sap.ui.core.UIComponent.getRouterFor(r);e.navTo("Home",{},true)},onAfterRendering:function(){r=this;r.oGModel=r.getModel("oGModel");if(r.oGModel.getProperty("/sId")==="Copy"){r.byId("idPn").setValue("");r.byId("idPdesc").setValue(r.oGModel.getProperty("/sProf_desc"));r.byId("idCretBy").setValue("");r.byId("idAuth").setValue("");var e=r.oGModel.getProperty("/sMethod");if(e==="MLR"){r.byId("idAlgo").setSelectedKey("M")}else if(e==="HGBT"){r.byId("idAlgo").setSelectedKey("H")}else if(e==="VARMA"){r.byId("idAlgo").setSelectedKey("V")}else{r.byId("idAlgo").setSelectedKey("N")}r.onAlgorChange()}else{r.byId("idPn").setValue("");r.byId("idPdesc").setValue("");r.byId("idCretBy").setValue("");r.byId("idAuth").setValue("");r.byId("idAlgo").setSelectedKey("N");var t=[];r.oAlgoListModel.setData({results:t});r.byId("idTab").setModel(r.oAlgoListModel)}},onAlgorChange:function(e){var l=r.byId("idAlgo")._getSelectedItemText();r.alogoList=r.byId("idTab");var s=new a("METHOD",o.EQ,l);this.getModel("PModel").read("/get_palparameters",{filters:[s],success:function(e){e.results.forEach(function(e){e.FLAG=e.DATATYPE},r);r.oAlgoListModel.setData({results:e.results});r.alogoList.setModel(r.oAlgoListModel)},error:function(){t.show("Failed to get data")}})},onLive:function(e){r.byId("idSave").setEnabled(true);if(e){var t=e.getParameter("newValue"),l=e.getParameter("id").split("-")[6]}else{var l=r.typeChange;t=r.byId("idTab").getItems()[l].getCells()[4].getValue()}var s=r.byId("idTab").getItems()[l].getCells()[2].getSelectedKey(),a=0;var o=/^[^*|\":<>[\]{}!`\\()';@&$]+$/;if(s==="DOUBLE"){r.byId("idTab").getItems()[l].getCells()[4].setType("Number")}if(s==="INTEGER"){if(t%1===0&&parseInt(t).toString()===t.toString()||t===""){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}else if(s==="NVARCHAR"){var i=/^[A-Za-z0-9]+$/;if(i.test(t)&&o.test(t)||t===""){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}else if(s==="DOUBLE"){if(!/^\d+$/.test(t)&&t!==""){if(t.split(".")[1]!==""&&t!=="."){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}else{if(t===""){r.byId("idTab").getItems()[l].getCells()[4].setValueState("None");a=0}else{r.byId("idTab").getItems()[l].getCells()[4].setValueState("Error");a=a+1}}}if(a===0){r.byId("idSave").setEnabled(true)}else{r.byId("idSave").setEnabled(false)}},onSubmit:function(e){sap.ui.core.BusyIndicator.show();var l={};l.PROFILE=r.byId("idPn").getValue();l.PRF_DESC=r.byId("idPdesc").getValue();l.CREATED_BY=r.byId("idCretBy").getValue();l.METHOD=r.byId("idAlgo")._getSelectedItemText();l.CREATED_DATE="2022-01-13";if(l.PROFILE!==""&&l.PRF_DESC!==""&&l.METHOD!==""){var s="/v2/catalog/getProfiles";$.ajax({url:s,type:"POST",contentType:"application/json",data:JSON.stringify({PROFILE:l.PROFILE,METHOD:l.METHOD,PRF_DESC:l.PRF_DESC,CREATED_BY:l.CREATED_BY}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(JSON.stringify(e))},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Created Prediction Model");r.tablesendbatch()}})}else{t.show("Please fill all required fields");sap.ui.core.BusyIndicator.hide()}},tablesendbatch:function(e){var t=r.byId("idTab").getItems(),l={PROFILEPARA:[]},s,a=0;let o=null;r.getModel("BModel").setUseBatch(true);r.batchReq=true;r.count=t.length;r.comp=0;sap.ui.core.BusyIndicator.show();for(var i=0;i<t.length;i++){var d,g,n,u,I,c="",y="",A="";d=r.byId("idPn").getValue();g=r.byId("idAlgo")._getSelectedItemText();n=r.byId("idCretBy").getValue();u=t[i].getCells()[0].getText();I=t[i].getCells()[1].getText();if(t[i].getCells()[2].getSelectedKey()==="INTEGER"){if(t[i].getCells()[4].getValue()===""){c=parseInt(t[i].getCells()[3].getText())}else{if(t[i].getCells()[4].getValue()=="No default value"){c=null}else{c=parseInt(t[i].getCells()[4].getValue())}}s={PROFILE:d,METHOD:g,PARA_NAME:u,PARA_DESC:I,INTVAL:c,DOUBLEVAL:null,STRVAL:null}}else if(t[i].getCells()[2].getSelectedKey()==="DOUBLE"){if(t[i].getCells()[4].getValue()===""){y=parseFloat(t[i].getCells()[3].getText())}else{if(t[i].getCells()[4].getValue()=="No default value"){y=null}else{y=parseFloat(t[i].getCells()[4].getValue())}}s={PROFILE:d,METHOD:g,PARA_NAME:u,PARA_DESC:I,INTVAL:null,DOUBLEVAL:y,STRVAL:null}}else if(t[i].getCells()[2].getSelectedKey()==="NVARCHAR"){if(t[i].getCells()[4].getValue()===""){A=t[i].getCells()[3].getText()}else{A=t[i].getCells()[4].getValue()}s={PROFILE:d,METHOD:g,PARA_NAME:u,PARA_DESC:I,INTVAL:null,DOUBLEVAL:null,STRVAL:A}}l.PROFILEPARA.push(s);s={}}var f="/v2/catalog/genProfileParam";$.ajax({url:f,type:"post",contentType:"application/json",data:JSON.stringify({PROFILEPARA:l.PROFILEPARA}),dataType:"json",async:false,timeout:0,error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show(JSON.stringify(e))},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Created profile parameters");r.onBack()}})}})});