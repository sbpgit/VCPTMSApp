sap.ui.define(["cpapp/cpseedordercreation/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/library","sap/ui/model/Sorter","jquery.sap.global"],function(e,t,i,o,s,a,r,l){"use strict";var d,n;return e.extend("cpapp.cpseedordercreation.controller.Home",{onInit:function(){d=this;d.oModel=new t;d.locModel=new t;d.prodModel=new t;d.uniqModel=new t;d.custModel=new t;this.oModel.setSizeLimit(1e3);d.locModel.setSizeLimit(1e3);d.prodModel.setSizeLimit(1e3);d.uniqModel.setSizeLimit(1e3);d.custModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogUniq){this._valueHelpDialogUniq=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.UniqId",this);this.getView().addDependent(this._valueHelpDialogUniq)}if(!this._valueHelpDialogOrderCreate){this._valueHelpDialogOrderCreate=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.OrderCreate",this);this.getView().addDependent(this._valueHelpDialogOrderCreate)}},onAfterRendering:function(){d=this;d.oGModel=d.getModel("oGModel");d.oGModel.setProperty("/selFlag","");d.oGModel.setProperty("/OrderFlag","");d.oList=this.byId("orderList");this.byId("headSearch").setValue("");this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");d._valueHelpDialogProd.setTitleAlignment("Center");d._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=sap.ui.getCore().byId("prodSlctList");this.oLocList=sap.ui.getCore().byId("LocSlctList");this.oUniqList=sap.ui.getCore().byId("UniqSlctList");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();d.locModel.setData(e);d.oLocList.setModel(d.locModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{i.show("Select Location")}}else if(t.includes("Uniq")){if(sap.ui.getCore().byId("idLocation").getValue()&&sap.ui.getCore().byId("idProduct").getValue()){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getUniqueHeader",{filters:[new o("LOCATION_ID",s.EQ,sap.ui.getCore().byId("idLocation").getValue()),new o("PRODUCT_ID",s.EQ,sap.ui.getCore().byId("idProduct").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.UNIQUE_ID=e.UNIQUE_ID.toString()},d);d.uniqModel.setData(e);d.oUniqList.setModel(d.uniqModel);d._valueHelpDialogUniq.open()},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})}else{i.show("Select Location and Product")}}},handleClose:function(e){var t=e.getSource().getParent().mAssociations.initialFocus.split("-")[0];if(t.includes("Loc")){sap.ui.getCore().byId("LocSearch").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}sap.ui.getCore().byId("LocSlctList").removeSelections();d._valueHelpDialogLoc.close()}else if(t.includes("Prod")){sap.ui.getCore().byId("ProdSearch").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}sap.ui.getCore().byId("prodSlctList").removeSelections();d._valueHelpDialogProd.close()}else if(t.includes("Uniq")){sap.ui.getCore().byId("UniqSearch").setValue("");if(d.oUniqList.getBinding("items")){d.oUniqList.getBinding("items").filter([])}sap.ui.getCore().byId("UniqSlctList").removeSelections();d._valueHelpDialogUniq.close()}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),a=[];t=t?t.trim():"";if(i.includes("Loc")){if(t!==""){a.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("LOCATION_DESC",s.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(a)}else if(i.includes("Prod")){if(t!==""){a.push(new o({filters:[new o("PRODUCT_ID",s.Contains,t),new o("PROD_DESC",s.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(a)}else if(i.includes("Uniq")){if(t!==""){a.push(new o({filters:[new o("UNIQUE_ID",s.EQ,t),new o("UNIQUE_DESC",s.Contains,t)],and:false}))}d.oUniqList.getBinding("items").filter(a)}else if(i.includes("head")){if(t!==""){a.push(new o({filters:[new o("UNIQUE_ID",s.EQ,t),new o("SEED_ORDER",s.Contains,t)],and:false}))}d.oList.getBinding("items").filter(a)}},handleSelection:function(e){var t=e.getParameter("id"),a=e.getParameter("selectedItems"),r,l=d.oGModel.getProperty("/selFlag");if(t.includes("Loc")){var n=e.getParameter("selectedItems");if(l===""){this.oLoc=d.byId("idloc");this.oProd=d.byId("prodInput")}else if(l==="X"){this.oLoc=sap.ui.getCore().byId("idLocation");this.oProd=sap.ui.getCore().byId("idProduct")}d.oLoc.setValue(e.getParameters().listItem.getCells()[0].getTitle());d.oProd.setValue("");this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",s.EQ,e.getParameters().listItem.getCells()[0].getTitle())],success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){i.show("error")}})}else if(t.includes("prod")){var u=e.getParameter("selectedItems");if(l===""){this.oProd=d.byId("prodInput")}else if(l==="X"){this.oProd=sap.ui.getCore().byId("idProduct")}d.oProd.setValue(e.getParameters().listItem.getCells()[0].getTitle())}else if(t.includes("Uniq")){var u=e.getParameter("selectedItems");this.oUniq=sap.ui.getCore().byId("idUniq");d.oUniq.setValue(e.getParameters().listItem.getCells()[0].getTitle())}d.handleClose(e)},onGetData:function(e){var a=d.byId("idloc").getValue(),r=d.byId("prodInput").getValue();d.oGModel.setProperty("/locationID",a);d.oGModel.setProperty("/productID",r);var l=[];if(a!==""){l.push(new o({filters:[new o("LOCATION_ID",s.EQ,a)],and:true}))}if(r!==""){l.push(new o({filters:[new o("PRODUCT_ID",s.EQ,r)],and:true}))}if(a!==""&&r!==""){this.byId("headSearch").setValue("");if(d.oList.getItems().length){d.oList.getBinding("items").filter(l)}this.getModel("BModel").read("/getSeedOrder",{filters:[l],success:function(e){sap.ui.core.BusyIndicator.hide();d.oModel=new t;if(e.results.length===0){d.byId("idSort").setVisible(false);d.oModel.setData([]);d.oList.setModel(d.oModel);sap.m.MessageToast.show("No Data available to show.")}else{e.results.forEach(function(e){e.ORD_QTY=parseFloat(e.ORD_QTY)},d);d.byId("idSort").setVisible(true);d.oModel.setData(e);d.oList.setModel(d.oModel)}},error:function(){sap.ui.core.BusyIndicator.hide();i.show("Failed to get profiles")}})}else{i.show("Please select Location and Product")}},onResetDate:function(){d.byId("idloc").setValue("");d.byId("prodInput").setValue("");d.byId("idSort").setVisible(false);d.oModel.setData({results:d.TabData});d.oList.setModel(d.oModel)},onOrderCreate:function(){var e=d.byId("idloc").getValue(),t=d.byId("prodInput").getValue();if(e!==""&&t!==""){d._valueHelpDialogOrderCreate.open();d.oGModel.setProperty("/selFlag","X");d.oGModel.setProperty("/OrderFlag","C");d._valueHelpDialogOrderCreate.setTitle("Create Order");sap.ui.getCore().byId("idLocation").setValue(e);sap.ui.getCore().byId("idProduct").setValue(t)}else{i.show("Please select Location and Product")}},onEdit:function(e){d._valueHelpDialogOrderCreate.setTitle("Update Order");var t=e.getSource().getParent().getBindingContext().getObject();var i=t.MAT_AVAILDATE.toISOString().split("T")[0];d.oGModel.setProperty("/OrderFlag","E");sap.ui.getCore().byId("idLabelSeed").setVisible(true);sap.ui.getCore().byId("idseedord").setVisible(true);sap.ui.getCore().byId("idseedord").setEditable(false);sap.ui.getCore().byId("idLocation").setEditable(false);sap.ui.getCore().byId("idProduct").setEditable(false);sap.ui.getCore().byId("idUniq").setEditable(false);sap.ui.getCore().byId("idseedord").setValue(t.SEED_ORDER);sap.ui.getCore().byId("idLocation").setValue(t.LOCATION_ID);sap.ui.getCore().byId("idProduct").setValue(t.PRODUCT_ID);sap.ui.getCore().byId("idUniq").setValue(t.UNIQUE_ID);sap.ui.getCore().byId("idQuantity").setValue(t.ORD_QTY);sap.ui.getCore().byId("idDate").setValue(i);d._valueHelpDialogOrderCreate.open()},onCancelOrder:function(){sap.ui.getCore().byId("idLocation").setValue("");sap.ui.getCore().byId("idProduct").setValue("");sap.ui.getCore().byId("idUniq").setValue("");sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idDate").setValue("");d.oGModel.setProperty("/selFlag","");d.oGModel.setProperty("/OrderFlag","");sap.ui.getCore().byId("idLabelSeed").setVisible(false);sap.ui.getCore().byId("idseedord").setVisible(false);sap.ui.getCore().byId("idUniq").setEditable(true);sap.ui.getCore().byId("idQuantity").setValueState("None");d._valueHelpDialogOrderCreate.close()},onNumChange:function(){var e=sap.ui.getCore().byId("idQuantity").getValue();sap.ui.getCore().byId("idQuantity").setValueState("None");if(e<1){sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Quantity can not be empty or 0")}if(e.includes(".")){sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Decimals not allowed")}},onSaveOrder:function(){var e=sap.ui.getCore().byId("idLocation").getValue(),t=sap.ui.getCore().byId("idProduct").getValue(),i=parseInt(sap.ui.getCore().byId("idUniq").getValue()),o=parseInt(sap.ui.getCore().byId("idQuantity").getValue()),s=sap.ui.getCore().byId("idDate").getValue(),a=sap.ui.getCore().byId("idseedord").getValue();var r={SEEDDATA:[]},l,n;var u=d.oGModel.getProperty("/OrderFlag");if(u==="C"){n="0"}else if(u==="E"){n=a}l={SEED_ORDER:n,LOCATION_ID:e,PRODUCT_ID:t,UNIQUE_ID:i,ORD_QTY:o,MAT_AVAILDATE:s};r.SEEDDATA.push(l);if(o&&s!==""&&i){if(sap.ui.getCore().byId("idQuantity").getValueState()!=="Error"){d.getModel("BModel").callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:u,SEEDDATA:JSON.stringify(r.SEEDDATA)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order created/ updated successfully");d.onCancelOrder();d.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error creating a Seed Order ")}})}else{sap.m.MessageToast.show("Decimals are not allowed")}}else{sap.m.MessageToast.show("Please fill all fields")}},handleSortButtonPressed:function(){d=this;if(!d._pDialog){d._pDialog=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.SortDialog",d);d.getView().addDependent(d._pDialog)}d._pDialog.open()},handleSortDialogConfirm:function(e){var t=this.byId("orderList"),i=e.getParameters(),o=t.getBinding("items"),s,a,l=[];s=i.sortItem.getKey();a=i.sortDescending;l.push(new r(s,a));o.sort(l)},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var i=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(i,true)}}})});