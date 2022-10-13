sap.ui.define(["cpapp/cpmatvariant/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment","cpapp/cpmatvariant/model/formatter"],function(e,t,a,r,o,s,i,d,n){"use strict";var u,l;return e.extend("cpapp.cpmatvariant.controller.ItemDetail",{onInit:function(){u=this;this.bus=sap.ui.getCore().getEventBus();u.oCharModel=new r;this.oCharModel.setSizeLimit(1e3);u.charnameModel=new r;u.custGrpnameModel=new r;u.charvalueModel=new r;u.oTableData=[];u.ListModel=new r;u._oCore=sap.ui.getCore()},onAfterRendering:function(){l=u.getOwnerComponent().getModel("oGModel");sap.ui.core.BusyIndicator.show();var e=l.getProperty("/prdId");var a=l.getProperty("/locId");var r=l.getProperty("/uniqId");l.setProperty("/CharData","");u.oCharModel.setData({results:[]});u.byId("idMatvarItem").setModel(u.oCharModel);this.getModel("BModel").read("/getUniqueItem",{filters:[new o("LOCATION_ID",s.EQ,a),new o("PRODUCT_ID",s.EQ,e),new o("UNIQUE_ID",s.EQ,r)],success:function(e){sap.ui.core.BusyIndicator.hide();l.setProperty("/CharData",e.results);u.oCharModel.setData({results:e.results});u.byId("idMatvarItem").setModel(u.oCharModel)},error:function(){sap.ui.core.BusyIndicator.hide();t.show("No data")}})},onCharSearch:function(e){var t="",a=[];if(e){t=e.getParameter("value")||e.getParameter("newValue")}if(t!==""){a.push(new o({filters:[new o("CHAR_NAME",s.Contains,t),new o("CHAR_VALUE",s.Contains,t)],and:false}))}u.byId("idMatvarItem").getBinding("items").filter(a)},onOrderCreate:function(){if(!this._CreateSO){this._CreateSO=sap.ui.xmlfragment("cpapp.cpmatvariant.view.CreateSeedOrder",this);this.getView().addDependent(this._CreateSO)}this._CreateSO.open();sap.ui.getCore().byId("idlocIdSO").setValue(l.getProperty("/locId"));sap.ui.getCore().byId("idprodIdSO").setValue(l.getProperty("/prdId"));sap.ui.getCore().byId("idUniqSO").setValue(l.getProperty("/uniqId"))},onCloseSO:function(){this._CreateSO.close();sap.ui.getCore().byId("idQuantity").setValueState("None");sap.ui.getCore().byId("idOrdQtySO").setValue("");sap.ui.getCore().byId("DP1SO").setValue("")},onNumChange:function(){var e=sap.ui.getCore().byId("idOrdQtySO").getValue();sap.ui.getCore().byId("idOrdQtySO").setValueState("None");if(e<1){sap.ui.getCore().byId("idOrdQtySO").setValue("");sap.ui.getCore().byId("idOrdQtySO").setValueState("Error");sap.ui.getCore().byId("idOrdQtySO").setValueStateText("Can not be add 0 quantity")}if(e.includes(".")){sap.ui.getCore().byId("idOrdQtySO").setValueState("Error");sap.ui.getCore().byId("idOrdQtySO").setValueStateText("Decimals are not allowed")}},onCreateSO:function(){var e=sap.ui.getCore().byId("idlocIdSO").getValue(),t=sap.ui.getCore().byId("idprodIdSO").getValue(),a=parseInt(sap.ui.getCore().byId("idUniqSO").getValue()),r=sap.ui.getCore().byId("idOrdQtySO").getValue(),o=sap.ui.getCore().byId("DP1SO").getValue();var s={SEEDDATA:[]},i,d="C";i={LOCATION_ID:e,PRODUCT_ID:t,UNIQUE_ID:a,ORD_QTY:r,MAT_AVAILDATE:o};s.SEEDDATA.push(i);if(r!==NaN&&o!==""&&a!==NaN){if(sap.ui.getCore().byId("idOrdQtySO").getValueState()!=="Error"){u.getModel("BModel").callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:d,SEEDDATA:JSON.stringify(s.SEEDDATA)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order created successfully");u.onCloseSO();u.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error creating a Seed Order")}})}else{sap.m.MessageToast.show("Decimals are not allowed")}}else{sap.m.MessageToast.show("Please fill all fields")}}})});