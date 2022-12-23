sap.ui.define(["cpapp/cpmatvariant/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,t,o,i,a,l,s){"use strict";var n,r;return e.extend("cpapp.cpmatvariant.controller.Home",{onInit:function(){n=this;n.oModel=new o;this.locModel=new o;this.prodModel=new o;n.locModel.setSizeLimit(1e3);n.prodModel.setSizeLimit(1e3);this.oModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpmatvariant.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpmatvariant.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){n=this;n.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");n._valueHelpDialogLoc.setTitleAlignment("Center");n._valueHelpDialogProd.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");r=this.getModel("oGModel");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();n.locModel.setData(e);n.oLocList.setModel(n.locModel)},error:function(e,o){sap.ui.core.BusyIndicator.hide();t.show("error")}})},handleValueHelp:function(e){var o=e.getParameter("id");if(o.includes("loc")){n._valueHelpDialogLoc.open()}else if(o.includes("prod")){if(n.byId("idloc").getValue()!==""){n._valueHelpDialogProd.open()}else{t.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){n._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(n.oLocList.getBinding("items")){n.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){n._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(n.oProdList.getBinding("items")){n.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),l=[];t=t?t.trim():"";if(o.includes("loc")){if(t!==""){l.push(new i({filters:[new i("LOCATION_ID",a.Contains,t),new i("LOCATION_DESC",a.Contains,t)],and:false}))}n.oLocList.getBinding("items").filter(l)}else if(o.includes("prod")){if(t!==""){l.push(new i({filters:[new i("PRODUCT_ID",a.Contains,t),new i("PROD_DESC",a.Contains,t)],and:false}))}n.oProdList.getBinding("items").filter(l)}},handleSelection:function(e){var o=e.getParameter("id"),l=e.getParameter("selectedItems"),s,r=[];if(o.includes("Loc")){this.oLoc=n.byId("idloc");s=e.getParameter("selectedItems");n.oLoc.setValue(s[0].getTitle());n.oProd.removeAllTokens();this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new i("LOCATION_ID",a.EQ,s[0].getTitle())],success:function(e){n.prodModel.setData(e);n.oProdList.setModel(n.prodModel)},error:function(e,o){t.show("error")}})}else if(o.includes("prod")){this.oProd=n.byId("prodInput");s=e.getParameter("selectedItems");n.oProd.setValue(s[0].getTitle())}n.handleClose(e)},onGetData:function(e){var o=n.oLoc.getValue(),l=n.oProd.getValue();this.getModel("BModel").read("/getMatVarHeader",{filters:[new i("LOCATION_ID",a.EQ,o),new i("PRODUCT_ID",a.EQ,l)],success:function(e){n.oModel.setData({results:e.results});n.byId("idMatVHead").setModel(n.oModel);r.setProperty("/locId",e.results[0].LOCATION_ID);r.setProperty("/prdId",e.results[0].PRODUCT_ID);n.byId("idMatVHead").setSelectedItem(n.byId("idMatVHead").getItems()[0],true);sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to get data")}})},onhandlePress:function(e){r=this.getModel("oGModel")},onChange:function(e){var o=e.getSource().getBindingContext().getObject();t.show("Changed")},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=[];if(t!==""){o.push(new i({filters:[new i("PRODUCT_ID",a.Contains,t),new i("LOCATION_ID",a.Contains,t)],and:false}))}n.byId("idMatVHead").getBinding("items").filter(o)}})});