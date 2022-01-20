sap.ui.define(["sap/ui/core/mvc/Controller","cp/execpred/cpexecprediction/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,i,o,s,l,n){"use strict";var a,r;return t.extend("cp.execpred.cpexecprediction.controller.Home",{onInit:function(){this.locModel=new i;this.prodModel=new i;this.odModel=new i;this.ppfModel=new i;this.oODPModel=new i;this.otabModel=new i;this.prodModel.setSizeLimit(5e3);this.odModel.setSizeLimit(5e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogOD){this._valueHelpDialogOD=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ObjDepDialog",this);this.getView().addDependent(this._valueHelpDialogOD)}if(!this._valueHelpDialogPPF){this._valueHelpDialogPPF=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.PredProfileDialog",this);this.getView().addDependent(this._valueHelpDialogPPF)}this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this))},_onPatternMatched:function(){r=this;this.oPanel=this.byId("idPanel");this.oTable=this.byId("pmdlList");this.i18n=this.getResourceBundle();this.oGModel=this.getModel("GModel");this.oLoc=this.byId("locInput");this.oProd=this.byId("prodInput");this.oObjDep=this.byId("odInput");this.oPredProfile=this.byId("pmInput");this.aVcRulesList=[];this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oODList=this._oCore.byId(this._valueHelpDialogOD.getId()+"-list");this.oPPFList=this._oCore.byId(this._valueHelpDialogPPF.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){r.locModel.setData(e);r.oLocList.setModel(r.locModel)},error:function(e,t){l.show("error")}});this.getModel("BModel").read("/getProducts",{success:function(e){e.results.unshift({PRODUCT_ID:"All",PROD_DESC:"All"});r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,t){l.show("error")}});this.getModel("BModel").callFunction("/get_objdep",{method:"GET",urlParameters:{},success:function(e){e.results.unshift({OBJ_DEP:"All",LOCATION_ID:"",PRODUCT_ID:""});r.odModel.setData(e);r.oODList.setModel(r.odModel)},error:function(e){l.show("error")}});this.getModel("BModel").read("/getProfiles",{success:function(e){r.ppfModel.setData(e);r.oPPFList.setModel(r.ppfModel)},error:function(e,t){l.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){this._valueHelpDialogLoc.open()}else if(t.includes("prod")){this._valueHelpDialogProd.open()}else if(t.includes("od")||t.includes("__button1")){if(r.oLoc.getValue()&&r.oProd.getTokens()){if(this.oODList.getBinding("items")){if(this.oODList.getBinding("items").oList[0].LOCATION_ID!==r.oLocList.getSelectedItem().getTitle()){this.oODList.getBinding("items").oList[0].LOCATION_ID=r.oLocList.getSelectedItem().getTitle();this.oODList.getBinding("items").oList[0].PRODUCT_ID=r.oProdList.getSelectedItem().getTitle()}this.oODList.getBinding("items").filter([new o("LOCATION_ID",s.Contains,r.oLocList.getSelectedItem().getTitle()),new o("PRODUCT_ID",s.Contains,this.oProdList.getSelectedItem().getTitle())])}this._valueHelpDialogOD.open()}else{l.show(r.i18n.getText("noLocProd"))}}else{this._valueHelpDialogPPF.open()}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(t.includes("od")||t.includes("__button1")){r._oCore.byId(this._valueHelpDialogOD.getId()+"-searchField").setValue("");if(r.oODList.getBinding("items")){r.oODList.getBinding("items").filter([])}}else{r._oCore.byId(this._valueHelpDialogPPF.getId()+"-searchField").setValue("");if(r.oPPFList.getBinding("items")){r.oPPFList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),l=[];t=t?t.trim():"";if(i.includes("loc")){if(t!==""){l.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("LOCATION_DESC",s.Contains,t)],and:false}))}r.oLocList.getBinding("items").filter(l)}else if(i.includes("prod")){if(t!==""){l.push(new o({filters:[new o("PRODUCT_ID",s.Contains,t),new o("PROD_DESC",s.Contains,t)],and:false}))}r.oProdList.getBinding("items").filter(l)}else if(i.includes("od")){if(t!==""){l.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("PRODUCT_ID",s.Contains,t),new o("COMPONENT",s.Contains,t),new o("OBJ_DEP",s.Contains,t)],and:false}))}r.oODList.getBinding("items").filter(l)}else{if(t!==""){l.push(new o({filters:[new o("PROFILE",s.Contains,t),new o("METHOD",s.Contains,t),new o("PRF_DESC",s.Contains,t)],and:false}))}r.oPPFList.getBinding("items").filter(l)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),o,s=[];if(t.includes("Loc")){o=e.getParameter("selectedItems");r.oLoc.setValue(o[0].getTitle());r.oProd.removeAllTokens();r.oObjDep.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t.includes("prod")){r.oProdList.getBinding("items").filter([]);o=e.getParameter("selectedItems");if(o&&o.length>0){r.oProd.removeAllTokens();o.forEach(function(e){r.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oProd.removeAllTokens()}}else if(t.includes("od")){r.oODList.getBinding("items").filter([]);o=e.getParameter("selectedItems");if(o&&o.length>0){if(o[0].getTitle()==="All_"){r.byId("idCheck").setSelected(true)}else{r.byId("idCheck").setSelected(false)}r.oObjDep.removeAllTokens();o.forEach(function(e){r.oObjDep.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oObjDep.removeAllTokens();r.byId("idCheck").setSelected(false)}}else{r.oPPFList.getBinding("items").filter([]);o=e.getParameter("selectedItems");r.oPredProfile.removeAllTokens();if(o&&o.length>0){o.forEach(function(e){r.oPredProfile.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}}r.handleClose(e)},handleTokenUpdate:function(e){var t=e.getSource().getId(),i=e.getParameter("removedTokens"),o,s,l;if(i){o=i[0].getProperty("key")}else{o=e.getParameter("item").getName()}if(t.includes("prod")){s=r.oProdList.getSelectedItems();for(l=0;l<s.length;l++){if(s[l].getTitle()===o){s[l].setSelected(false)}}}else if(t.includes("od")){s=r.oProdList.getSelectedItems();for(l=0;l<s.length;l++){if(s[l].getTitle()===o){s[l].setSelected(false)}}}else if(t.includes("pmInput")){s=r.oProdList.getSelectedItems();for(l=0;l<s.length;l++){if(s[l].getTitle()===o){s[l].setSelected(false)}}}},onRun2:function(){var e=r.byId("idCheck").getSelected();var t="Do you want to override assignments?";if(e===true){sap.m.MessageBox.show(t,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){r.onRunSend()}}})}else{r.onRunSend()}},onRunSend:function(){this.oModel=this.getModel("PModel");var e,t,i,o,s,n=[],a;var d={vcRulesList:[]},g;e=this.oODList.getSelectedItems();t=this.oProdList.getSelectedItems(),i=r.oPredProfile.getTokens()[0].getText(),o=r.byId("idCheck").getSelected();if(this.oObjDep.getTokens().length>0&&this.oPredProfile.getTokens().length>0){if(e[0].getTitle()==="All_"&&t[0].getTitle()==="All"){var d={vcRulesList:[]},g;g={profile:i,override:true,Location:e[1].getInfo(),Product:"All",GroupID:"All"};d.vcRulesList.push(g);var c="/v2/pal/generatePredictions";$.ajax({url:c,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:d.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredSuccess"));n.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("pmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"}})}else{for(s=0;s<e.length;s++){if(e[s].getTitle()!=="All_"){g={profile:i,override:o,Location:e[s].getInfo(),Product:e[s].getDescription(),GroupID:e[s].getTitle()};d.vcRulesList.push(g)}}var c="/v2/pal/generatePredictions";$.ajax({url:c,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:d.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredSuccess"));n.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:n[0]});r.byId("pmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);a="X"}})}if(a==="X"){r.resetInputs()}}else{l.show(r.i18n.getText("errInput"))}},resetInputs:function(){this.oLoc.setValue("");this.oObjDep.destroyTokens();this.oLocList.removeSelections();this.oODList.removeSelections();this.oPredProfile.destroyTokens();this.oPPFList.removeSelections();this.oProd.destroyTokens();this.oProdList.removeSelections()},onRun:function(){this.oModel=this.getModel("PModel");var e=[];var t={vcRulesList:[]};var i={Location:"FR10",Product:"KM_M219VBVS_BVS",GroupID:"M219VV00105NN_1"};t.vcRulesList.push(i);var o="/v2/pal/generatePredictions";$.ajax({url:o,type:"post",contentType:"application/json",data:JSON.stringify({vcRulesList:t.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(JSON.stringify(e))},success:function(e){sap.m.MessageToast.show("Generated Regression Models")}})},handleProdChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("prodSlctList").getItems();var o=this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All"&&e.getParameter("selected")){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All"&&!e.getParameter("selected")){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t!=="All"||i.length!==o.length){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false)}},handleObjDepChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("odSlctList").getItems();var o=this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All_"&&e.getParameter("selected")&&i.length!==1){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All_"&&!e.getParameter("selected")){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t!=="All_"||i.length!==o.length){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false)}else if(t==="All_"&&e.getParameter("selected")&&i.length===1){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}}})});