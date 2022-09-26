sap.ui.define(["cpapp/cpseedordercreation/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/library","sap/ui/model/Sorter","jquery.sap.global"],function(e,t,i,o,a,s,d,r){"use strict";var l,n;return e.extend("cpapp.cpseedordercreation.controller.Home",{onInit:function(){l=this;l.oModel=new t;l.locModel=new t;l.prodModel=new t;l.uniqModel=new t;l.custModel=new t;this.oModel.setSizeLimit(1e3);l.locModel.setSizeLimit(1e3);l.prodModel.setSizeLimit(1e3);l.uniqModel.setSizeLimit(1e3);l.custModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogUniq){this._valueHelpDialogUniq=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.UniqId",this);this.getView().addDependent(this._valueHelpDialogUniq)}if(!this._valueHelpDialogOrderCreate){this._valueHelpDialogOrderCreate=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.OrderCreate",this);this.getView().addDependent(this._valueHelpDialogOrderCreate)}},onAfterRendering:function(){l=this;l.oGModel=l.getModel("oGModel");l.oGModel.setProperty("/selFlag","");l.oGModel.setProperty("/OrderFlag","");l.oList=this.byId("orderList");this.byId("headSearch").setValue("");this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");l._valueHelpDialogProd.setTitleAlignment("Center");l._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oUniqList=this._oCore.byId(this._valueHelpDialogUniq.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();l.locModel.setData(e);l.oLocList.setModel(l.locModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}});this.getModel("BModel").read("/getLocProdDet",{success:function(e){},error:function(e,t){i.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._valueHelpDialogLoc.open()}else if(t.includes("prod")){l._valueHelpDialogProd.open()}else if(t.includes("Location")){l._valueHelpDialogLoc.open()}else if(t.includes("Product")){if(sap.ui.getCore().byId("idLocation").getValue()){l._valueHelpDialogProd.open()}else{i.show("Select Location")}}else if(t.includes("Uniq")){if(sap.ui.getCore().byId("idLocation").getValue()&&sap.ui.getCore().byId("idProduct").getValue()){l._valueHelpDialogUniq.open();this.getModel("BModel").read("/getUniqueHeader",{filters:[new o("LOCATION_ID",a.EQ,sap.ui.getCore().byId("idLocation").getValue()),new o("PRODUCT_ID",a.EQ,sap.ui.getCore().byId("idProduct").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();l.uniqModel.setData(e);l.oUniqList.setModel(l.uniqModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})}else{i.show("Select Location and Product")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(l.oLocList.getBinding("items")){l.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){l._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(l.oProdList.getBinding("items")){l.oProdList.getBinding("items").filter([])}}else if(t.includes("Uniq")){l._oCore.byId(this._valueHelpDialogUniq.getId()+"-searchField").setValue("");if(l.oUniqList.getBinding("items")){l.oUniqList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),s=[];t=t?t.trim():"";if(i.includes("Loc")){if(t!==""){s.push(new o({filters:[new o("LOCATION_ID",a.Contains,t),new o("UNIQUE_ID",a.EQ,t),new o("LOCATION_DESC",a.Contains,t)],and:false}))}l.oLocList.getBinding("items").filter(s)}else if(i.includes("prod")){if(t!==""){s.push(new o({filters:[new o("PRODUCT_ID",a.Contains,t),new o("UNIQUE_ID",a.EQ,t),new o("PROD_DESC",a.Contains,t)],and:false}))}l.oProdList.getBinding("items").filter(s)}else if(i.includes("Uniq")){if(t!==""){s.push(new o({filters:[new o("UNIQUE_ID",a.Contains,t),new o("UNIQUE_DESC",a.Contains,t)],and:false}))}l.oUniqList.getBinding("items").filter(s)}else if(i.includes("head")){if(t!==""){s.push(new o({filters:[new o("UNIQUE_ID",a.EQ,t),new o("SEED_ORDER",a.Contains,t)],and:false}))}l.oList.getBinding("items").filter(s)}},handleSelection:function(e){var t=e.getParameter("id"),s=e.getParameter("selectedItems"),d,r=l.oGModel.getProperty("/selFlag");if(t.includes("Loc")){var n=e.getParameter("selectedItems");if(r===""){this.oLoc=l.byId("idloc");this.oProd=l.byId("prodInput")}else if(r==="X"){this.oLoc=sap.ui.getCore().byId("idLocation");this.oProd=sap.ui.getCore().byId("idProduct")}l.oLoc.setValue(n[0].getTitle());l.oProd.setValue("");this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",a.EQ,n[0].getTitle())],success:function(e){l.prodModel.setData(e);l.oProdList.setModel(l.prodModel)},error:function(e,t){i.show("error")}})}else if(t.includes("prod")){var u=e.getParameter("selectedItems");if(r===""){this.oProd=l.byId("prodInput")}else if(r==="X"){this.oProd=sap.ui.getCore().byId("idProduct")}l.oProd.setValue(u[0].getTitle());sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getUniqueHeader",{filters:[new o("LOCATION_ID",a.EQ,sap.ui.getCore().byId("idLocation").getValue()),new o("PRODUCT_ID",a.EQ,sap.ui.getCore().byId("idProduct").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.UNIQUE_ID=e.UNIQUE_ID.toString()},l);l.uniqModel.setData(e);l.oUniqList.setModel(l.uniqModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})}else if(t.includes("Uniq")){var u=e.getParameter("selectedItems");this.oUniq=sap.ui.getCore().byId("idUniq");l.oUniq.setValue(u[0].getTitle())}l.handleClose(e)},onGetData:function(e){var t=l.byId("idloc").getValue(),s=l.byId("prodInput").getValue();l.oGModel.setProperty("/locationID",t);l.oGModel.setProperty("/productID",s);var d=[];if(t!==""){d.push(new o({filters:[new o("LOCATION_ID",a.EQ,t)],and:true}))}if(s!==""){d.push(new o({filters:[new o("PRODUCT_ID",a.EQ,s)],and:true}))}if(t!==""&&s!==""){this.getModel("BModel").read("/getSeedOrder",{filters:[d],success:function(e){if(e.results.length===0){l.byId("idSort").setVisible(false);l.oModel.setData([]);l.oList.setModel(l.oModel);sap.m.MessageToast.show("No Data available to show.")}else{e.results.forEach(function(e){e.ORD_QTY=parseFloat(e.ORD_QTY)},l);l.byId("idSort").setVisible(true);sap.ui.core.BusyIndicator.hide();l.oModel.setData({data:e.results});l.oList.setModel(l.oModel)}},error:function(){sap.ui.core.BusyIndicator.hide();i.show("Failed to get profiles")}})}else{i.show("Please select Location and Product")}},onResetDate:function(){l.byId("idloc").setValue("");l.byId("prodInput").setValue("");l.byId("idSort").setVisible(false);l.oModel.setData({results:l.TabData});l.oList.setModel(l.oModel)},onOrderCreate:function(){var e=l.byId("idloc").getValue(),t=l.byId("prodInput").getValue();if(e!==""&&t!==""){l._valueHelpDialogOrderCreate.open();l.oGModel.setProperty("/selFlag","X");l.oGModel.setProperty("/OrderFlag","C");l._valueHelpDialogOrderCreate.setTitle("Create Order");sap.ui.getCore().byId("idLocation").setValue(e);sap.ui.getCore().byId("idProduct").setValue(t)}else{i.show("Please select Location and Product")}},onEdit:function(e){l._valueHelpDialogOrderCreate.setTitle("Update Order");var t=e.getSource().getParent().getBindingContext().getObject();var i=t.MAT_AVAILDATE.toISOString().split("T")[0];l.oGModel.setProperty("/OrderFlag","E");sap.ui.getCore().byId("idLabelSeed").setVisible(true);sap.ui.getCore().byId("idseedord").setVisible(true);sap.ui.getCore().byId("idseedord").setEditable(false);sap.ui.getCore().byId("idLocation").setEditable(false);sap.ui.getCore().byId("idProduct").setEditable(false);sap.ui.getCore().byId("idUniq").setEditable(false);sap.ui.getCore().byId("idseedord").setValue(t.SEED_ORDER);sap.ui.getCore().byId("idLocation").setValue(t.LOCATION_ID);sap.ui.getCore().byId("idProduct").setValue(t.PRODUCT_ID);sap.ui.getCore().byId("idUniq").setValue(t.UNIQUE_ID);sap.ui.getCore().byId("idQuantity").setValue(t.ORD_QTY);sap.ui.getCore().byId("idDate").setValue(i);l._valueHelpDialogOrderCreate.open()},onCancelOrder:function(){sap.ui.getCore().byId("idLocation").setValue("");sap.ui.getCore().byId("idProduct").setValue("");sap.ui.getCore().byId("idUniq").setValue("");sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idDate").setValue("");l.oGModel.setProperty("/selFlag","");l.oGModel.setProperty("/OrderFlag","");sap.ui.getCore().byId("idLabelSeed").setVisible(false);sap.ui.getCore().byId("idseedord").setVisible(false);sap.ui.getCore().byId("idUniq").setEditable(true);sap.ui.getCore().byId("idQuantity").setValueState("None");l._valueHelpDialogOrderCreate.close()},onNumChange:function(){var e=sap.ui.getCore().byId("idQuantity").getValue();sap.ui.getCore().byId("idQuantity").setValueState("None");if(e<1){sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Can not be add 0 quantity")}if(e.includes(".")){sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Decimals not allowed")}},onSaveOrder:function(){var e=sap.ui.getCore().byId("idLocation").getValue(),t=sap.ui.getCore().byId("idProduct").getValue(),i=parseInt(sap.ui.getCore().byId("idUniq").getValue()),o=parseInt(sap.ui.getCore().byId("idQuantity").getValue()),a=sap.ui.getCore().byId("idDate").getValue(),s=sap.ui.getCore().byId("idseedord").getValue();var d={SEEDDATA:[]},r,n;var u=l.oGModel.getProperty("/OrderFlag");if(u==="C"){n="0"}else if(u==="E"){n=s}r={SEED_ORDER:n,LOCATION_ID:e,PRODUCT_ID:t,UNIQUE_ID:i,ORD_QTY:o,MAT_AVAILDATE:a};d.SEEDDATA.push(r);if(o===NaN&&a!==""&&i===NaN){if(sap.ui.getCore().byId("idQuantity").getValueState()!=="Error"){l.getModel("BModel").callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:u,SEEDDATA:JSON.stringify(d.SEEDDATA)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order created/ updated successfully");l.onCancelOrder();l.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error creating a Seed Order ")}})}else{sap.m.MessageToast.show("Decimals are not allowed")}}else{sap.m.MessageToast.show("Please fill all fields")}},handleSortButtonPressed:function(){l=this;if(!l._pDialog){l._pDialog=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.SortDialog",l);l.getView().addDependent(l._pDialog)}l._pDialog.open()},handleSortDialogConfirm:function(e){var t=this.byId("orderList"),i=e.getParameters(),o=t.getBinding("items"),a,s,r=[];a=i.sortItem.getKey();s=i.sortDescending;r.push(new d(a,s));o.sort(r)}})});