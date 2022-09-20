sap.ui.define(["cpapp/cpmatvariant/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment","cpapp/cpmatvariant/model/formatter"],function(e,t,a,r,o,s,i,n,d){"use strict";var l,u;return e.extend("cpapp.cpmatvariant.controller.ItemDetail",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();l.oCharModel=new r;this.oCharModel.setSizeLimit(1e3);l.charnameModel=new r;l.custGrpnameModel=new r;l.charvalueModel=new r;l.oTableData=[];l.ListModel=new r;l._oCore=sap.ui.getCore()},onAfterRendering:function(){u=l.getOwnerComponent().getModel("oGModel");sap.ui.core.BusyIndicator.show();var e=u.getProperty("/prdId");var a=u.getProperty("/locId");var r=u.getProperty("/uniqId");u.setProperty("/CharData","");l.oCharModel.setData({results:[]});l.byId("idMatvarItem").setModel(l.oCharModel);this.getModel("BModel").read("/getUniqueItem",{filters:[new o("LOCATION_ID",s.EQ,a),new o("PRODUCT_ID",s.EQ,e),new o("UNIQUE_ID",s.EQ,r)],success:function(e){sap.ui.core.BusyIndicator.hide();u.setProperty("/CharData",e.results);l.oCharModel.setData({results:e.results});l.byId("idMatvarItem").setModel(l.oCharModel)},error:function(){sap.ui.core.BusyIndicator.hide();t.show("No data")}})},onCharSearch:function(e){var t="",a=[];if(e){t=e.getParameter("value")||e.getParameter("newValue")}if(t!==""){a.push(new o({filters:[new o("CHAR_NAME",s.Contains,t),new o("CHAR_VALUE",s.Contains,t)],and:false}))}l.byId("idMatvarItem").getBinding("items").filter(a)},onOrderCreate:function(){if(!this._CreateSO){this._CreateSO=sap.ui.xmlfragment("cpapp.cpmatvariant.view.CreateSeedOrder",this);this.getView().addDependent(this._CreateSO)}this._CreateSO.open();sap.ui.getCore().byId("idlocIdSO").setValue(u.getProperty("/locId"));sap.ui.getCore().byId("idprodIdSO").setValue(u.getProperty("/prdId"));sap.ui.getCore().byId("idUniqSO").setValue(u.getProperty("/uniqId"))},onCloseSO:function(){this._CreateSO.close()},onCreateSO:function(){var e=sap.ui.getCore().byId("idlocIdSO").getValue(),t=sap.ui.getCore().byId("idprodIdSO").getValue(),a=parseInt(sap.ui.getCore().byId("idUniqSO").getValue()),r=sap.ui.getCore().byId("idOrdQtySO").getValue(),o=sap.ui.getCore().byId("DP1SO").getValue();var s={SEEDDATA:[]},i,n="C";i={LOCATION_ID:e,PRODUCT_ID:t,UNIQUE_ID:a,ORD_QTY:r,MAT_AVAILDATE:o};s.SEEDDATA.push(i);if(r!==""&&o!==""&&e!==""&&t!==""&&a!==""){l.getModel("BModel").callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:n,SEEDDATA:JSON.stringify(s.SEEDDATA)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order created successfully");l.onCloseSO();l.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error creating a Seed Order")}})}else{sap.m.MessageToast.show("Please fill all fields")}}})});