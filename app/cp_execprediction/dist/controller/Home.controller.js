sap.ui.define(["sap/ui/core/mvc/Controller","cp/execpred/cpexecprediction/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,i,o,l,s,a){"use strict";var n,r;return t.extend("cp.execpred.cpexecprediction.controller.Home",{onInit:function(){this.locModel=new i;this.prodModel=new i;this.odModel=new i;this.ppfModel=new i;this.oODPModel=new i;this.otabModel=new i;this.verModel=new i;this.scenModel=new i;this.prodModel.setSizeLimit(5e3);this.odModel.setSizeLimit(5e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogOD){this._valueHelpDialogOD=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ObjDepDialog",this);this.getView().addDependent(this._valueHelpDialogOD)}if(!this._valueHelpDialogPPF){this._valueHelpDialogPPF=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.PredProfileDialog",this);this.getView().addDependent(this._valueHelpDialogPPF)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this))},_onPatternMatched:function(){sap.ui.core.BusyIndicator.show();r=this;this.oPanel=this.byId("idPanel");this.oTable=this.byId("pmdlList");this.i18n=this.getResourceBundle();this.oGModel=this.getModel("GModel");this.oLoc=this.byId("locInput");this.oProd=this.byId("prodInput");this.oObjDep=this.byId("odInput");this.oPredProfile=this.byId("pmInput");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.aVcRulesList=[];r._valueHelpDialogProd.setTitleAlignment("Center");r._valueHelpDialogLoc.setTitleAlignment("Center");r._valueHelpDialogOD.setTitleAlignment("Center");r._valueHelpDialogPPF.setTitleAlignment("Center");r._valueHelpDialogVer.setTitleAlignment("Center");r._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oODList=this._oCore.byId(this._valueHelpDialogOD.getId()+"-list");this.oPPFList=this._oCore.byId(this._valueHelpDialogPPF.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){r.locModel.setData(e);r.oLocList.setModel(r.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){s.show("error")}});this.getModel("BModel").read("/getProfiles",{success:function(e){r.ppfModel.setData(e);r.oPPFList.setModel(r.ppfModel)},error:function(e,t){s.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){this._valueHelpDialogLoc.open()}else if(t.includes("prod")){this._valueHelpDialogProd.open()}else if(t.includes("od")||t.includes("__button1")){if(r.oLoc.getValue()&&r.oProd.getTokens().length!==0){var i=r.oProdList.getSelectedItems();var o=[];var l=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLocList.getSelectedItem().getTitle()});o.push(l);for(var a=0;a<i.length;a++){if(i[a].getTitle()!=="All"){l=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:i[a].getTitle()});o.push(l)}}this.getModel("BModel").read("/getBomOdCond",{filters:o,success:function(e){r.objDepData=e.results;if(r.objDepData.length>0){r.objDepData.unshift({OBJ_DEP:"All",LOCATION_ID:"All",PRODUCT_ID:"All"})}r.odModel.setData(e);r.oODList.setModel(r.odModel);if(r.oProdList.getSelectedItems()[0].getTitle()==="All"){r._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll()}r._valueHelpDialogOD.open()},error:function(e,t){s.show("error")}})}else{s.show(r.i18n.getText("noLocProd"))}}else if(t.includes("ver")){if(r.oLoc.getValue()&&r.oProd.getTokens().length!==0){r._valueHelpDialogVer.open()}else{s.show(r.i18n.getText("noLocProd"))}}else if(t.includes("scen")){if(r.oLoc.getValue()&&r.oProd.getTokens().length!==0&&r.oVer.getValue()){r._valueHelpDialogScen.open()}else{s.show("Select Location, Product and Version")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(t.includes("od")||t.includes("__button1")){r._oCore.byId(this._valueHelpDialogOD.getId()+"-searchField").setValue("");if(r.oODList.getBinding("items")){r.oODList.getBinding("items").filter([])}}else if(t.includes("Ver")){r._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(r.oVerList.getBinding("items")){r.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){r._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(r.oScenList.getBinding("items")){r.oScenList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),s=[];t=t?t.trim():"";if(i.includes("loc")){if(t!==""){s.push(new o({filters:[new o("LOCATION_ID",l.Contains,t),new o("LOCATION_DESC",l.Contains,t)],and:false}))}r.oLocList.getBinding("items").filter(s)}else if(i.includes("prod")){if(t!==""){s.push(new o({filters:[new o("PRODUCT_ID",l.Contains,t),new o("PROD_DESC",l.Contains,t)],and:false}))}r.oProdList.getBinding("items").filter(s)}else if(i.includes("od")){if(t!==""){s.push(new o({filters:[new o("LOCATION_ID",l.Contains,t),new o("PRODUCT_ID",l.Contains,t),new o("COMPONENT",l.Contains,t),new o("OBJ_DEP",l.Contains,t)],and:false}))}r.oODList.getBinding("items").filter(s)}else if(i.includes("ver")){if(t!==""){s.push(new o({filters:[new o("VERSION",l.Contains,t)],and:false}))}r.oVerList.getBinding("items").filter(s)}else if(i.includes("scen")){if(t!==""){s.push(new o({filters:[new o("SCENARIO",l.Contains,t)],and:false}))}r.oScenList.getBinding("items").filter(s)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),a,n,d=[];if(t.includes("Loc")){a=e.getParameter("selectedItems");r.oLoc.setValue(a[0].getTitle());r.oProd.removeAllTokens();r.oObjDep.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",l.EQ,a[0].getTitle())],success:function(e){if(e.results.length>0){e.results.unshift({PRODUCT_ID:"All",PROD_DESC:"All"})}r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,t){s.show("error")}})}else if(t.includes("prod")){r.oProdList.getBinding("items").filter([]);r.oObjDep.removeAllTokens();this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();a=e.getParameter("selectedItems");if(a&&a.length>0){r.oProd.removeAllTokens();a.forEach(function(e){r.oProd.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))});var g=r.oProdList.getSelectedItems();var c=[];var u=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLocList.getSelectedItem().getTitle()});c.push(u);for(var p=0;p<g.length;p++){if(g[p].getTitle()!=="All"){u=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:g[p].getTitle()});c.push(u)}}this.getModel("BModel").read("/getIbpVerScn",{filters:c,success:function(e){r.verModel.setData(e);r.oVerList.setModel(r.verModel)},error:function(e,t){s.show("error")}})}else{r.oProd.removeAllTokens()}}else if(t.includes("od")){r.oODList.getBinding("items").filter([]);a=e.getParameter("selectedItems");if(a&&a.length>0){if(a[0].getTitle()==="All"){r.byId("idCheck").setSelected(true)}else{r.byId("idCheck").setSelected(false)}r.oObjDep.removeAllTokens();a.forEach(function(e){r.oObjDep.addToken(new sap.m.Token({key:e.getTitle(),text:e.getTitle()}))})}else{r.oObjDep.removeAllTokens();r.byId("idCheck").setSelected(false)}}else if(t.includes("Ver")){this.oVer=r.byId("idver");r.oScen=r.byId("idscen");n=e.getParameter("selectedItems");r.oVer.setValue(n[0].getTitle());r.oScen.setValue("");var g=r.oProdList.getSelectedItems();var c=[];var u=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:r.oLocList.getSelectedItem().getTitle()});c.push(u);var u=new sap.ui.model.Filter({path:"VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:n[0].getTitle()});c.push(u);for(var p=0;p<g.length;p++){if(g[p].getTitle()!=="All"){u=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:g[p].getTitle()});c.push(u)}}this.getModel("BModel").read("/getIbpVerScn",{filters:c,success:function(e){r.scenModel.setData(e);r.oScenList.setModel(r.scenModel)},error:function(e,t){s.show("error")}})}else if(t.includes("scen")){this.oScen=r.byId("idscen");a=e.getParameter("selectedItems");r.oScen.setValue(a[0].getTitle())}r.handleClose(e)},handleTokenUpdate:function(e){var t=e.getSource().getId(),i=e.getParameter("removedTokens"),o,l,s;if(i){o=i[0].getProperty("key")}else{o=e.getParameter("item").getName()}if(t.includes("prod")){l=r.oProdList.getSelectedItems();for(s=0;s<l.length;s++){if(l[s].getTitle()===o){l[s].setSelected(false)}}}else if(t.includes("od")){l=r.oProdList.getSelectedItems();for(s=0;s<l.length;s++){if(l[s].getTitle()===o){l[s].setSelected(false)}}}else if(t.includes("pmInput")){l=r.oProdList.getSelectedItems();for(s=0;s<l.length;s++){if(l[s].getTitle()===o){l[s].setSelected(false)}}}},onButtonChange:function(e){var t=r.byId("idType").getSelectedKey();if(t==="RT"){r.oObjDep.removeAllTokens();r.byId("odInput").setPlaceholder("Restriction");r.byId("odInput").setShowValueHelp(false)}else{r.byId("odInput").setPlaceholder("Object Dependency");r.byId("odInput").setShowValueHelp(true)}},onRun2:function(){var e=r.byId("idCheck").getSelected();var t="Do you want to override assignments?";if(e===true){sap.m.MessageBox.show(t,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){r.onRunSend()}}})}else{r.onRunSend()}},onRunSend:function(){this.oModel=this.getModel("PModel");var e,t,i,o,l,a,n,d,g,c=[],u;var p={vcRulesList:[]},h;e=this.oODList.getSelectedItems();t=this.oProdList.getSelectedItems(),o=r.byId("idCheck").getSelected();l=this.byId("idModelVer").getSelectedKey();a=this.byId("idType").getSelectedKey();n=this.oVer.getValue();d=this.oScen.getValue();if(this.oObjDep.getTokens().length>0&&this.oVer.getValue()&&this.oScen.getValue()){if(e[0].getTitle()==="All"&&t[0].getTitle()==="All"){var p={vcRulesList:[]},h;h={override:true,Location:e[1].getInfo(),Product:"All",GroupID:"All",Type:a,modelVersion:l,version:n,scenario:d};p.vcRulesList.push(h);var f="/v2/pal/generatePredictions";$.ajax({url:f,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:p.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredSuccess"));c.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:c[0]});r.byId("pmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);u="X"}})}else{for(g=0;g<e.length;g++){if(e[g].getTitle()!=="All"){h={override:o,Location:e[g].getInfo(),Product:e[g].getDescription(),GroupID:e[g].getTitle(),Type:a,modelVersion:l,version:n,scenario:d};p.vcRulesList.push(h)}}var f="/v2/pal/generatePredictions";$.ajax({url:f,type:"POST",contentType:"application/json",data:JSON.stringify({vcRulesList:p.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredErr"))},success:function(e){sap.m.MessageToast.show(r.i18n.getText("genPredSuccess"));c.push(e.d.values[0].vcRulesList);r.otabModel.setData({results:c[0]});r.byId("pmdlList").setModel(r.otabModel);r.oPanel.setProperty("visible",true);u="X"}})}if(u==="X"){r.resetInputs()}}else{s.show(r.i18n.getText("errInput"))}},resetInputs:function(){this.oLoc.setValue("");this.oVer.setValue("");this.oScen.setValue("");this.oObjDep.destroyTokens();this.oLocList.removeSelections();this.oODList.removeSelections();this.oPredProfile.destroyTokens();this.oPPFList.removeSelections();this.oProd.destroyTokens();this.oProdList.removeSelections()},onRun:function(){this.oModel=this.getModel("PModel");var e=[];var t={vcRulesList:[]};var i={Location:"FR10",Product:"KM_M219VBVS_BVS",GroupID:"M219VV00105NN_1"};t.vcRulesList.push(i);var o="v2/pal/generatePredictions";$.ajax({url:o,type:"post",contentType:"application/json",data:JSON.stringify({vcRulesList:t.vcRulesList}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show(JSON.stringify(e))},success:function(e){sap.m.MessageToast.show("Generated Regression Models")}})},handleProdChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("prodSlctList").getItems();var o=this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All"&&e.getParameter("selected")&&i.length!==1){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All"&&!e.getParameter("selected")){this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t==="All"&&i.length===1){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false)}else if(t!=="All"&&!e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false)}else if(t!=="All"&&e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(true)}},handleObjDepChange:function(e){var t=e.getParameter("listItem").getTitle();var i=sap.ui.getCore().byId("odSlctList").getItems();var o=this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].getSelectedItems();if(t==="All"&&e.getParameter("selected")&&i.length!==1){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll()}else if(t==="All"&&!e.getParameter("selected")){this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections()}else if(t!=="All"&&!e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false)}else if(t!=="All"&&e.getParameter("selected")&&i.length-1===o.length){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(true)}else if(t==="All"&&i.length===1){sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false)}}})});