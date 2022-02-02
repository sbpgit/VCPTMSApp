sap.ui.define(["cp/odp/cpodprofiles/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,o,t,a,s,l,i,r){"use strict";var n,d;return e.extend("cp.odp.cpodprofiles.controller.Home",{onInit:function(){n=this;n.oListModel=new a;n.oProfileModel=new a;n.oLocModel=new a;n.oProdModel=new a;n.oCompModel=new a;n.oObjDepModel=new a;this.oListModel.setSizeLimit(5e3);n.oLocModel.setSizeLimit(1e3);n.oProdModel.setSizeLimit(1e3);n.oCompModel.setSizeLimit(1e3);n.oObjDepModel.setSizeLimit(1e3)},onAfterRendering:function(){n=this;n.oList=this.byId("idTab");n.oMcLoc=this.byId("idLoc");n.oMcProd=this.byId("idProd");n.oMcComp=this.byId("idComp");n.oMcObjDep=this.byId("idObjDep");n.oList.removeSelections();this.getData()},getData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getODProfiles",{success:function(e){n.aLocation=[];n.aProduct=[];n.aComponent=[];n.aObjDep=[];n.SelLoc=[];n.SelProd=[];n.SelComp=[];n.SelObjDep=[];var o=[],t=[],a=[],s=[];n.TableData=e.results;for(var l=0;l<e.results.length;l++){if(n.aLocation.indexOf(e.results[l].LOCATION_ID)===-1){n.aLocation.push(e.results[l].LOCATION_ID);if(e.results[l].LOCATION_ID!==""){n.oLocData={LOCATION_ID:e.results[l].LOCATION_ID};n.SelLoc.push(n.oLocData);o[l]=n.oLocData.LOCATION_ID}}if(n.aProduct.indexOf(e.results[l].PRODUCT_ID)===-1){n.aProduct.push(e.results[l].PRODUCT_ID);if(e.results[l].PRODUCT_ID!==""){n.oProdData={PRODUCT_ID:e.results[l].PRODUCT_ID};n.SelProd.push(n.oProdData);t[l]=n.oProdData.PRODUCT_ID}}if(n.aComponent.indexOf(e.results[l].COMPONENT)===-1){n.aComponent.push(e.results[l].COMPONENT);if(e.results[l].COMPONENT!==""){n.oCompData={COMPONENT:e.results[l].COMPONENT};n.SelComp.push(n.oCompData);a[l]=n.oCompData.COMPONENT}}if(n.aObjDep.indexOf(e.results[l].OBJ_DEP)===-1){n.aObjDep.push(e.results[l].OBJ_DEP);if(e.results[l].OBJ_DEP!==""){n.oObjDepData={OBJ_DEP:e.results[l].OBJ_DEP};n.SelObjDep.push(n.oObjDepData);s[l]=n.oObjDepData.OBJ_DEP}}}n.oListModel.setData({results:e.results});n.oList.setModel(n.oListModel);n.oLocModel.setData({resultsLoc:n.SelLoc});n.oProdModel.setData({resultsProd:n.SelProd});n.oCompModel.setData({resultsComp:n.SelComp});n.oObjDepModel.setData({resultsObjDep:n.SelObjDep});n.oMcLoc.setModel(n.oLocModel);n.oMcProd.setModel(n.oProdModel);n.oMcComp.setModel(n.oCompModel);n.oMcObjDep.setModel(n.oObjDepModel);n.oMcLoc.setSelectedKeys(n.aLocation);n.oMcProd.setSelectedKeys(n.aProduct);n.oMcComp.setSelectedKeys(n.aComponent);n.oMcObjDep.setSelectedKeys(n.aObjDep);sap.ui.core.BusyIndicator.hide()},error:function(e){o.show("error")}})},onAssign:function(){n.oGModel=n.getModel("oGModel");var e=n.byId("idTab").getSelectedItems();if(e.length){if(!n._onProfiles){n._onProfiles=sap.ui.xmlfragment("cp.odp.cpodprofiles.view.Profiles",n);n.getView().addDependent(n._onProfiles)}n.oProfileList=sap.ui.getCore().byId("idListTab");n._onProfiles.setTitleAlignment("Center");this.getModel("BModel").read("/getProfiles",{success:function(o){n.oProfileModel.setData({results:o.results});n.oProfileList.setModel(n.oProfileModel);n._onProfiles.open();n.oGModel.setProperty("/selItem",e)},error:function(){o.show("Failed to get profiles")}})}else{o.show("Please select atleast one item to assign profile")}},handleClose:function(){n.byId("idTab").removeSelections();n._onProfiles.close()},handleSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=[];if(o!==""){t.push(new s({filters:[new s("PROFILE",l.Contains,o),new s("PRF_DESC",l.Contains,o)],and:false}))}n.oProfileList.getBinding("items").filter(t)},onTableSearch:function(e){var o=e.getParameter("value")||e.getParameter("newValue"),t=[];if(o!==""){t.push(new s({filters:[new s("LOCATION_ID",l.Contains,o),new s("PRODUCT_ID",l.Contains,o),new s("COMPONENT",l.Contains,o),new s("OBJ_DEP",l.Contains,o),new s("PROFILE",l.Contains,o)],and:false}))}n.oList.getBinding("items").filter(t)},handLocChg:function(){var e=n.getView().byId("idLoc").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].LOCATION_ID===e[l]){s.push(n.TableData[i]);if(t.indexOf(n.TableData[i].COMPONENT)===-1){t.push(n.TableData[i].COMPONENT)}if(o.indexOf(n.TableData[i].PRODUCT_ID)===-1){o.push(n.TableData[i].PRODUCT_ID)}if(a.indexOf(n.TableData[i].OBJ_DEP)===-1){a.push(n.TableData[i].OBJ_DEP)}}}}n.oListModel.setData({results:s});n.oMcComp.setSelectedKeys(t);n.oMcProd.setSelectedKeys(o);n.oMcObjDep.setSelectedKeys(a)},handProdChg:function(){var e=n.getView().byId("idProd").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].PRODUCT_ID===e[l]){s.push(n.TableData[i]);if(o.indexOf(n.TableData[i].LOCATION_ID)===-1){o.push(n.TableData[i].LOCATION_ID)}if(t.indexOf(n.TableData[i].COMPONENT)===-1){t.push(n.TableData[i].COMPONENT)}if(a.indexOf(n.TableData[i].OBJ_DEP)===-1){a.push(n.TableData[i].OBJ_DEP)}}}}n.oListModel.setData({results:s});n.oMcLoc.setSelectedKeys(o);n.oMcComp.setSelectedKeys(t);n.oMcObjDep.setSelectedKeys(a)},handCompChg:function(){var e=n.getView().byId("idComp").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].COMPONENT===e[l]){s.push(n.TableData[i]);if(o.indexOf(n.TableData[i].LOCATION_ID)===-1){o.push(n.TableData[i].LOCATION_ID)}if(t.indexOf(n.TableData[i].PRODUCT_ID)===-1){t.push(n.TableData[i].PRODUCT_ID)}if(a.indexOf(n.TableData[i].OBJ_DEP)===-1){a.push(n.TableData[i].OBJ_DEP)}}}}n.oListModel.setData({results:s});n.oMcLoc.setSelectedKeys(o);n.oMcProd.setSelectedKeys(t);n.oMcObjDep.setSelectedKeys(a)},handObjDepChg:function(){var e=n.getView().byId("idObjDep").getSelectedKeys();var o=[],t=[],a=[],s=[];for(var l=0;l<e.length;l++){for(var i=0;i<n.TableData.length;i++){if(n.TableData[i].OBJ_DEP===e[l]){s.push(n.TableData[i]);if(o.indexOf(n.TableData[i].LOCATION_ID)===-1){o.push(n.TableData[i].LOCATION_ID)}if(t.indexOf(n.TableData[i].PRODUCT_ID)===-1){t.push(n.TableData[i].PRODUCT_ID)}if(a.indexOf(n.TableData[i].COMPONENT)===-1){a.push(n.TableData[i].COMPONENT)}}}}n.oListModel.setData({results:s});n.oMcLoc.setSelectedKeys(o);n.oMcProd.setSelectedKeys(t);n.oMcComp.setSelectedKeys(a)},onProfileSel:function(e){var o=n.oGModel.getProperty("/selItem"),t={PROFILEOD:[]},a,s=sap.ui.getCore().byId("idListTab").getSelectedItems()[0].getTitle();var l;for(var i=0;i<o.length;i++){l=o[i].getBindingContext().getProperty();a={LOCATION_ID:l.LOCATION_ID,PRODUCT_ID:l.PRODUCT_ID,COMPONENT:l.COMPONENT,OBJ_DEP:l.OBJ_DEP,PROFILE:s};t.PROFILEOD.push(a);a={}}var r={csrfToken:""};var d=new sap.ui.model.json.JSONModel(r);sap.ui.getCore().setModel(d,"oToken");var D=sap.ui.getCore().getModel("oToken").getData();var O="v2/catalog/genProfileOD";$.ajax({url:"v2/catalog/getLocation",type:"GET",headers:{ContentType:"application/json",Accept:"application/json",cache:true,"X-CSRF-Token":"fetch"},success:function(e,o,a){D["csrfToken"]=a.getResponseHeader("X-Csrf-Token");r=D["csrfToken"];$.ajax({url:O,type:"POST",contentType:"application/json",headers:{"X-CSRF-Token":r},data:JSON.stringify({FLAG:"I",PROFILEOD:t.PROFILEOD}),dataType:"json",async:false,timeout:0,error:function(e){sap.m.MessageToast.show("Error in assigning Profiles");sap.ui.core.BusyIndicator.hide();n.handleClose()},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Profile assigned successfully");n.handleClose();n.onAfterRendering()}})},error:function(e){sap.m.MessageToast.show("Error in assigning Profiles")}})}})});