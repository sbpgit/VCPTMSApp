sap.ui.define(["cpapp/cpseedordercreation/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/library","sap/ui/model/Sorter","jquery.sap.global","sap/m/Dialog","sap/m/library","sap/m/Text","sap/m/Button"],function(e,t,i,o,s,a,r,d,l,n,u,g){"use strict";var p,c;var I=n.DialogType;var D=n.ButtonType;return e.extend("cpapp.cpseedordercreation.controller.Home",{onInit:function(){p=this;p.oModel=new t;p.locModel=new t;p.prodModel=new t;p.uniqModel=new t;p.custModel=new t;p.oModel.setSizeLimit(1e3);p.locModel.setSizeLimit(1e3);p.prodModel.setSizeLimit(1e3);p.uniqModel.setSizeLimit(1e3);p.custModel.setSizeLimit(1e3);this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogUniq){this._valueHelpDialogUniq=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.UniqId",this);this.getView().addDependent(this._valueHelpDialogUniq)}if(!this._valueHelpDialogOrderCreate){this._valueHelpDialogOrderCreate=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.OrderCreate",this);this.getView().addDependent(this._valueHelpDialogOrderCreate)}},onAfterRendering:function(){p=this;p.oGModel=p.getModel("oGModel");p.oGModel.setProperty("/selFlag","");p.oGModel.setProperty("/OrderFlag","");p.oList=this.byId("orderList");this.byId("headSearch").setValue("");this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");p._valueHelpDialogProd.setTitleAlignment("Center");p._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=sap.ui.getCore().byId("prodSlctList");this.oLocList=sap.ui.getCore().byId("LocSlctList");this.oUniqList=sap.ui.getCore().byId("UniqSlctList");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();p.locModel.setData(e);p.oLocList.setModel(p.locModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){p._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(p.byId("idloc").getValue()){p._valueHelpDialogProd.open()}else{i.show("Select Location")}}else if(t.includes("Uniq")){if(sap.ui.getCore().byId("idLocation").getValue()&&sap.ui.getCore().byId("idProduct").getValue()){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getUniqueHeader",{filters:[new o("LOCATION_ID",s.EQ,sap.ui.getCore().byId("idLocation").getValue()),new o("PRODUCT_ID",s.EQ,sap.ui.getCore().byId("idProduct").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.UNIQUE_ID=e.UNIQUE_ID.toString()},p);p.uniqModel.setData(e);p.oUniqList.setModel(p.uniqModel);p._valueHelpDialogUniq.open()},error:function(e,t){sap.ui.core.BusyIndicator.hide();i.show("error")}})}else{i.show("Select Location and Product")}}},handleClose:function(e){var t=e.getSource().getParent().mAssociations.initialFocus.split("-")[0];if(t.includes("Loc")){sap.ui.getCore().byId("LocSearch").setValue("");if(p.oLocList.getBinding("items")){p.oLocList.getBinding("items").filter([])}sap.ui.getCore().byId("LocSlctList").removeSelections();p._valueHelpDialogLoc.close()}else if(t.includes("Prod")){sap.ui.getCore().byId("ProdSearch").setValue("");if(p.oProdList.getBinding("items")){p.oProdList.getBinding("items").filter([])}sap.ui.getCore().byId("prodSlctList").removeSelections();p._valueHelpDialogProd.close()}else if(t.includes("Uniq")){sap.ui.getCore().byId("UniqSearch").setValue("");if(p.oUniqList.getBinding("items")){p.oUniqList.getBinding("items").filter([])}sap.ui.getCore().byId("UniqSlctList").removeSelections();p._valueHelpDialogUniq.close()}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),i=e.getParameter("id"),a=[];t=t?t.trim():"";if(i.includes("Loc")){if(t!==""){a.push(new o({filters:[new o("LOCATION_ID",s.Contains,t),new o("LOCATION_DESC",s.Contains,t)],and:false}))}p.oLocList.getBinding("items").filter(a)}else if(i.includes("Prod")){if(t!==""){a.push(new o({filters:[new o("PRODUCT_ID",s.Contains,t),new o("PROD_DESC",s.Contains,t)],and:false}))}p.oProdList.getBinding("items").filter(a)}else if(i.includes("Uniq")){if(t!==""){a.push(new o({filters:[new o("UNIQUE_ID",s.EQ,t),new o("UNIQUE_DESC",s.Contains,t)],and:false}))}p.oUniqList.getBinding("items").filter(a)}else if(i.includes("head")){if(t!==""){a.push(new o({filters:[new o("UNIQUE_ID",s.EQ,t),new o("SEED_ORDER",s.Contains,t)],and:false}))}p.oList.getBinding("items").filter(a)}},handleSelection:function(e){var t=e.getParameter("id"),a=e.getParameter("selectedItems"),r,d=p.oGModel.getProperty("/selFlag");if(t.includes("Loc")){var l=e.getParameter("selectedItems");if(d===""){this.oLoc=p.byId("idloc");this.oProd=p.byId("prodInput")}else if(d==="X"){this.oLoc=sap.ui.getCore().byId("idLocation");this.oProd=sap.ui.getCore().byId("idProduct")}p.oLoc.setValue(e.getParameters().listItem.getCells()[0].getTitle());p.oProd.setValue("");this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",s.EQ,e.getParameters().listItem.getCells()[0].getTitle())],success:function(e){p.prodModel.setData(e);p.oProdList.setModel(p.prodModel)},error:function(e,t){i.show("error")}})}else if(t.includes("prod")){var n=e.getParameter("selectedItems");if(d===""){this.oProd=p.byId("prodInput")}else if(d==="X"){this.oProd=sap.ui.getCore().byId("idProduct")}p.oProd.setValue(e.getParameters().listItem.getCells()[0].getTitle())}else if(t.includes("Uniq")){var n=e.getParameter("selectedItems");this.oUniq=sap.ui.getCore().byId("idUniq");p.oUniq.setValue(e.getParameters().listItem.getCells()[0].getTitle())}p.handleClose(e)},onGetData:function(e){var t=p.byId("idloc").getValue(),a=p.byId("prodInput").getValue();p.oGModel.setProperty("/locationID",t);p.oGModel.setProperty("/productID",a);var r=[];if(t!==""){r.push(new o({filters:[new o("LOCATION_ID",s.EQ,t)],and:true}))}if(a!==""){r.push(new o({filters:[new o("PRODUCT_ID",s.EQ,a)],and:true}))}if(t!==""&&a!==""){this.byId("headSearch").setValue("");if(p.oList.getItems().length){p.oList.getBinding("items").filter(r)}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getSeedOrder",{filters:[r],success:function(e){sap.ui.core.BusyIndicator.hide();if(e.results.length===0){p.byId("idSort").setVisible(false);p.oModel.setData([]);p.oList.setModel(p.oModel);sap.m.MessageToast.show("No Data available to show.")}else{e.results.forEach(function(e){e.ORD_QTY=parseFloat(e.ORD_QTY)},p);p.byId("idSort").setVisible(true);p.oModel.setData(e);p.oList.setModel(p.oModel)}},error:function(){sap.ui.core.BusyIndicator.hide();i.show("Failed to get profiles")}})}else{i.show("Please select Location and Product")}},onResetDate:function(){p.byId("idloc").setValue("");p.byId("prodInput").setValue("");p.byId("idSort").setVisible(false);p.oModel.setData({results:p.TabData});p.oList.setModel(p.oModel)},onOrderCreate:function(){var e=p.byId("idloc").getValue(),t=p.byId("prodInput").getValue();if(e!==""&&t!==""){p._valueHelpDialogOrderCreate.open();p.oGModel.setProperty("/selFlag","X");p.oGModel.setProperty("/OrderFlag","C");p._valueHelpDialogOrderCreate.setTitle("Create Order");sap.ui.getCore().byId("idLocation").setValue(e);sap.ui.getCore().byId("idProduct").setValue(t)}else{i.show("Please select Location and Product")}},onEdit:function(e){p._valueHelpDialogOrderCreate.setTitle("Update Order");var t=e.getSource().getParent().getBindingContext().getObject();var i=t.MAT_AVAILDATE.toISOString().split("T")[0];p.oGModel.setProperty("/OrderFlag","E");sap.ui.getCore().byId("idLabelSeed").setVisible(true);sap.ui.getCore().byId("idseedord").setVisible(true);sap.ui.getCore().byId("idseedord").setEditable(false);sap.ui.getCore().byId("idLocation").setEditable(false);sap.ui.getCore().byId("idProduct").setEditable(false);sap.ui.getCore().byId("idUniq").setEditable(false);sap.ui.getCore().byId("idseedord").setValue(t.SEED_ORDER);sap.ui.getCore().byId("idLocation").setValue(t.LOCATION_ID);sap.ui.getCore().byId("idProduct").setValue(t.PRODUCT_ID);sap.ui.getCore().byId("idUniq").setValue(t.UNIQUE_ID);sap.ui.getCore().byId("idQuantity").setValue(t.ORD_QTY);sap.ui.getCore().byId("idDate").setValue(i);p._valueHelpDialogOrderCreate.open()},onCancelOrder:function(){sap.ui.getCore().byId("idLocation").setValue("");sap.ui.getCore().byId("idProduct").setValue("");sap.ui.getCore().byId("idUniq").setValue("");sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idDate").setValue("");p.oGModel.setProperty("/selFlag","");p.oGModel.setProperty("/OrderFlag","");sap.ui.getCore().byId("idLabelSeed").setVisible(false);sap.ui.getCore().byId("idseedord").setVisible(false);sap.ui.getCore().byId("idUniq").setEditable(true);sap.ui.getCore().byId("idQuantity").setValueState("None");p._valueHelpDialogOrderCreate.close()},onNumChange:function(){var e=sap.ui.getCore().byId("idQuantity").getValue();sap.ui.getCore().byId("idQuantity").setValueState("None");if(e<1){sap.ui.getCore().byId("idQuantity").setValue("");sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Quantity can not be empty or 0")}if(e.includes(".")){sap.ui.getCore().byId("idQuantity").setValueState("Error");sap.ui.getCore().byId("idQuantity").setValueStateText("Decimals not allowed")}},onSaveOrder:function(){var e=sap.ui.getCore().byId("idLocation").getValue(),t=sap.ui.getCore().byId("idProduct").getValue(),i=parseInt(sap.ui.getCore().byId("idUniq").getValue()),o=parseInt(sap.ui.getCore().byId("idQuantity").getValue()),s=sap.ui.getCore().byId("idDate").getValue(),a=sap.ui.getCore().byId("idseedord").getValue();var r={SEEDDATA:[]},d,l;var n=p.oGModel.getProperty("/OrderFlag");if(n==="C"){l="0"}else if(n==="E"){l=a}d={SEED_ORDER:l,LOCATION_ID:e,PRODUCT_ID:t,UNIQUE_ID:i,ORD_QTY:o,MAT_AVAILDATE:s};r.SEEDDATA.push(d);if(o&&s!==""&&i){sap.ui.core.BusyIndicator.show();if(sap.ui.getCore().byId("idQuantity").getValueState()!=="Error"){p.getModel("BModel").callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:n,SEEDDATA:JSON.stringify(r.SEEDDATA)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order created/ updated successfully");p.onCancelOrder();p.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error creating a Seed Order ")}})}else{sap.m.MessageToast.show("Decimals are not allowed")}}else{sap.m.MessageToast.show("Please fill all fields")}},handleSortButtonPressed:function(){p=this;if(!p._pDialog){p._pDialog=sap.ui.xmlfragment("cpapp.cpseedordercreation.view.SortDialog",p);p.getView().addDependent(p._pDialog)}p._pDialog.open()},handleSortDialogConfirm:function(e){var t=this.byId("orderList"),i=e.getParameters(),o=t.getBinding("items"),s,a,d=[];s=i.sortItem.getKey();a=i.sortDescending;d.push(new r(s,a));o.sort(d)},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var i=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(i,true)}},onDelete:function(e){var t=e.getSource().getBindingContext().getProperty().SEED_ORDER,i=e.getSource().getBindingContext().getProperty().LOCATION_ID,o=e.getSource().getBindingContext().getProperty().PRODUCT_ID,s=e.getSource().getBindingContext().getProperty().UNIQUE_ID,a=e.getSource().getBindingContext().getProperty().ORD_QTY,r=e.getSource().getBindingContext().getProperty().MAT_AVAILDATE;var d={SEEDDATA:[]},n;n={SEED_ORDER:t,LOCATION_ID:i,PRODUCT_ID:o,UNIQUE_ID:s,ORD_QTY:a,MAT_AVAILDATE:r};d.SEEDDATA.push(n);if(!this.oApproveDialog){this.oApproveDialog=new l({type:I.Message,title:t,content:new u({text:"Do you want to delete this Seed Order?"}),beginButton:new g({type:D.Emphasized,text:"Submit",press:function(){sap.ui.core.BusyIndicator.show();var e=this.getView().getModel("BModel");e.callFunction("/maintainSeedOrder",{method:"GET",urlParameters:{FLAG:"d",SEEDDATA:JSON.stringify(d.SEEDDATA)},success:function(e,t){p.onGetData();p.oApproveDialog.close();sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Seed Order Deleted Successfully")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Failed to delete SeedOrder")}})}.bind(this)}),endButton:new g({text:"Cancel",press:function(){this.oApproveDialog.close()}.bind(this)})})}this.oApproveDialog.open()}})});