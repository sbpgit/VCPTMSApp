sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpnewprodintro/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,a,t,s,i,l,o){"use strict";var d,r;return a.extend("cpapp.cpnewprodintro.controller.Detail",{onInit:function(){r=this;r.ListModel=new t;r.locModel=new t;r.prodModel=new t;r.classnameModel=new t;r.charnameModel=new t;r.charvalueModel=new t;r.ListModel.setSizeLimit(1e3);r.locModel.setSizeLimit(1e3);r.prodModel.setSizeLimit(1e3);r.classnameModel.setSizeLimit(1e3);r.charnameModel.setSizeLimit(1e3);r.charvalueModel.setSizeLimit(1e3);r.oData={};this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogclassName){this._valueHelpDialogclassName=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.className",this);this.getView().addDependent(this._valueHelpDialogclassName)}if(!this._valueHelpDialogcharName){this._valueHelpDialogcharName=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.charName",this);this.getView().addDependent(this._valueHelpDialogcharName)}if(!this._valueHelpDialogcharValue){this._valueHelpDialogcharValue=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.charValue",this);this.getView().addDependent(this._valueHelpDialogcharValue)}r.aData=[]},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();d=this.getModel("oGModel");this.oLoc=r.byId("idloc");this.oProd=r.byId("idrefprod");this.oClassName=r.byId("idClassname");this.oCharName=r.byId("idCharname");this.oCharValue=r.byId("idCharval");r._valueHelpDialogProd.setTitleAlignment("Center");r._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oClassnameList=this._oCore.byId(this._valueHelpDialogclassName.getId()+"-list");this.oCharnameList=this._oCore.byId(this._valueHelpDialogcharName.getId()+"-list");this.oCharvalueList=this._oCore.byId(this._valueHelpDialogcharValue.getId()+"-list");r.aData=[];if(d.getProperty("/sFlag")==="E"){r.byId("idClassChar").setTitle("Update Product");r.byId("idloc").setEditable(false);r.byId("idProd").setEditable(false);r.byId("idloc").setValue(d.getProperty("/Loc"));r.byId("idProd").setValue(d.getProperty("/Prod"));r.byId("idrefprod").setValue(d.getProperty("/refProd"));r.getCharData();r.byId("idprodPanel").setExpanded(false);r.byId("idCharPanel").setExpanded(true)}else if(d.getProperty("/sFlag")==="C"){r.byId("idClassChar").setTitle("New Product");r.byId("idloc").setEditable(true);r.byId("idProd").setEditable(true);r.byId("idloc").setValue("");r.byId("idProd").setValue("");r.byId("idrefprod").setValue("");r.ListModel.setData({results:r.aData});r.byId("idprodPanel").setExpanded(true);r.byId("idCharPanel").setExpanded(false)}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();r.locModel.setData(e);r.oLocList.setModel(r.locModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})},onBack:function(){var e=sap.ui.core.UIComponent.getRouterFor(r);e.navTo("Home",{},true)},getCharData:function(){var e=d.getProperty("/Prod"),a=d.getProperty("/refProd");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getNewProdChar",{filters:[new s("REF_PRODID",i.EQ,a),new s("PRODUCT_ID",i.EQ,e)],success:function(e){sap.ui.core.BusyIndicator.hide();r.ListModel.setData({results:e.results});r.byId("idCharList").setModel(r.ListModel);var a=e.results;if(a.length){for(var t=0;t<a.length;t++){r.oData={CLASS_NAME:a[t].CLASS_NAME,CLASS_NUM:a[t].CLASS_NUM,CHAR_NAME:a[t].CHAR_NAME,CHAR_NUM:a[t].CHAR_NUM,CHAR_VALUE:a[t].CHAR_VALUE,CHARVAL_NUM:a[t].CHARVAL_NUM};r.aData.push(r.oData)}}},error:function(){sap.ui.core.BusyIndicator.hide();l.show("Failed to get data")}})},handleValueHelp:function(e){var a=e.getParameter("id");d.setProperty("/OpenProdInut","");if(a.includes("loc")){r._valueHelpDialogLoc.open()}else if(a.includes("idrefprod")){r.ProdData();if(r.byId("idloc").getValue()){d.setProperty("/OpenProdInut","RP");r._valueHelpDialogProd.open()}else{l.show("Select Location")}}else if(a.includes("idProd")){r.ProdData();if(r.byId("idloc").getValue()){d.setProperty("/OpenProdInut","NP");r._valueHelpDialogProd.open()}else{l.show("Select Location")}}else if(a.includes("Classname")){var t="";if(a.split("--")[2]==="idClassname"){r.RefDataId();t=r.byId("idrefprod").getValue()}else if(a.split("--")[2]==="idNClassname"){r.NewDataId();t=r.byId("idProd").getValue()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,t)],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.classnameModel.setData({results:a(e.results,"CLASS_NAME")});r.oClassnameList.setModel(r.classnameModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}});r._valueHelpDialogclassName.open()}else if(a.includes("Charname")){var t="";if(a.split("--")[2]==="idCharname"){r.RefDataId();t=r.byId("idrefprod").getValue()}else if(a.split("--")[2]==="idNCharname"){r.NewDataId();t=r.byId("idProd").getValue()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,t),new s("CLASS_NAME",i.EQ,r.oClassName.getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.charnameModel.setData({results:a(e.results,"CHAR_NAME")});r.oCharnameList.setModel(r.charnameModel);r._valueHelpDialogcharName.open()},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})}else if(a.includes("Charval")){var t="";if(a.split("--")[2]==="idCharval"){r.RefDataId();t=r.byId("idrefprod").getValue()}else if(a.split("--")[2]==="idNCharval"){r.NewDataId();t=r.byId("idProd").getValue()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,t),new s("CLASS_NAME",i.EQ,r.oClassName.getValue()),new s("CHAR_NAME",i.EQ,r.oCharName.getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.charvalueModel.setData({results:a(e.results,"CHAR_VALUE")});r.oCharvalueList.setModel(r.charvalueModel);r._valueHelpDialogcharValue.open()},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})}},RefDataId:function(){this.oClassName=r.byId("idClassname");this.oClassNo=r.byId("idClassno");this.oCharName=r.byId("idCharname");this.oCharNo=r.byId("idCharno");this.oCharValue=r.byId("idCharval");this.oCharValueNo=r.byId("idCharvalno")},NewDataId:function(){this.oClassName=r.byId("idNClassname");this.oClassNo=r.byId("idNClassno");this.oCharName=r.byId("idNCharname");this.oCharNo=r.byId("idNCharno");this.oCharValue=r.byId("idNCharval");this.oCharValueNo=r.byId("idNCharvalno")},ProdData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocProdDet",{filters:[new s("LOCATION_ID",i.EQ,r.byId("idloc").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})},handleClose:function(e){var a=e.getParameter("id");if(a.includes("Loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(a.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(a.includes("className")){r._oCore.byId(this._valueHelpDialogclassName.getId()+"-searchField").setValue("");if(r.oClassnameList.getBinding("items")){r.oClassnameList.getBinding("items").filter([])}}else if(a.includes("charName")){r._oCore.byId(this._valueHelpDialogcharName.getId()+"-searchField").setValue("");if(r.oCharnameList.getBinding("items")){r.oCharnameList.getBinding("items").filter([])}}else if(a.includes("charVal")){r._oCore.byId(this._valueHelpDialogcharValue.getId()+"-searchField").setValue("");if(r.oCharvalueList.getBinding("items")){r.oCharvalueList.getBinding("items").filter([])}}},handleSearch:function(e){var a=e.getParameter("value")||e.getParameter("newValue"),t=e.getParameter("id"),l=[];a=a?a.trim():"";if(t.includes("Loc")){if(a!==""){l.push(new s({filters:[new s("LOCATION_ID",i.Contains,a),new s("LOCATION_DESC",i.Contains,a)],and:false}))}r.oLocList.getBinding("items").filter(l)}else if(t.includes("prodSlctList")){if(a!==""){l.push(new s({filters:[new s("PRODUCT_ID",i.Contains,a),new s("PROD_DESC",i.Contains,a)],and:false}))}r.oProdList.getBinding("items").filter(l)}else if(t.includes("className")){if(a!==""){l.push(new s({filters:[new s("CLASS_NAME",i.Contains,a),new s("CLASS_NUM",i.Contains,a)],and:false}))}r.oClassnameList.getBinding("items").filter(l)}else if(t.includes("charName")){if(a!==""){l.push(new s({filters:[new s("CHAR_NAME",i.Contains,a),new s("CHAR_NUM",i.Contains,a)],and:false}))}r.oCharnameList.getBinding("items").filter(l)}else if(t.includes("charVal")){if(a!==""){l.push(new s({filters:[new s("CHAR_VALUE",i.Contains,a),new s("CHARVAL_NUM",i.Contains,a)],and:false}))}r.oCharvalueList.getBinding("items").filter(l)}},handleSelection:function(e){r.oGModel=r.getModel("oGModel");var a=e.getParameter("id"),t=e.getParameter("selectedItems"),s,i=[];if(a.includes("Loc")){r.oLoc=r.byId("idloc");r.oProd=r.byId("idrefprod");s=e.getParameter("selectedItems");r.oLoc.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedLoc",s[0].getTitle());r.oProd.setValue("");r.byId("idProd").setValue("");r.oGModel.setProperty("/SelectedProd","")}else if(a.includes("prod")){if(d.getProperty("/OpenProdInut")==="RP"){r.oProd=r.byId("idrefprod");s=e.getParameter("selectedItems");r.oProd.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedProd",s[0].getTitle());r.aData=[];r.ListModel.setData({results:r.aData});r.byId("idCharList").setModel(r.ListModel);r.byId("idClassname").setValue("");r.byId("idClassno").setValue("");r.byId("idCharname").setValue("");r.byId("idCharno").setValue("");r.byId("idCharval").setValue("");r.byId("idCharvalno").setValue("");r.byId("idprodPanel").setExpanded(false);r.byId("idCharPanel").setExpanded(true)}else if(d.getProperty("/OpenProdInut")==="NP"){r.oNewProd=r.byId("idProd");s=e.getParameter("selectedItems");r.oNewProd.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectednewProd",s[0].getTitle());r.aData=[];r.ListModel.setData({results:r.aData});r.byId("idCharList").setModel(r.ListModel);r.byId("idNClassname").setValue("");r.byId("idNClassno").setValue("");r.byId("idNCharname").setValue("");r.byId("idNCharno").setValue("");r.byId("idNCharval").setValue("");r.byId("idNCharvalno").setValue("")}}else if(a.includes("className")){s=e.getParameter("selectedItems");r.oClassName.setValue(s[0].getTitle());r.oClassNo.setValue(s[0].getDescription());r.oCharName.setValue("");r.oCharNo.setValue("");r.oCharValue.setValue("");r.oCharValueNo.setValue("")}else if(a.includes("charName")){s=e.getParameter("selectedItems");r.oCharName.setValue(s[0].getTitle());r.oCharNo.setValue(s[0].getDescription());r.oCharValue.setValue("");r.oCharValueNo.setValue("")}else if(a.includes("charVal")){s=e.getParameter("selectedItems");r.oCharValue.setValue(s[0].getTitle());r.oCharValueNo.setValue(s[0].getDescription())}r.handleClose(e)},charData:function(){this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,r.byId("idrefprod").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.classnameModel.setData({results:a(e.results,"CLASS_NAME")});r.oClassnameList.setModel(r.classnameModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})},onAdd:function(){var e=r.byId("idClassname").getValue(),a=r.byId("idCharname").getValue(),t=r.byId("idCharval").getValue(),s=r.byId("idNClassname").getValue(),i=r.byId("idNCharname").getValue(),o=r.byId("idNCharval").getValue();if(e!==""&&a!==""&&t!==""){this.oData={CLASS_NAME:s,CLASS_NUM:r.byId("idNClassno").getValue(),REF_CLASSNAME:e,REF_CLASS_NUM:r.byId("idClassno").getValue(),CHAR_NAME:i,CHAR_NUM:r.byId("idNCharno").getValue(),REF_CHARNAME:a,REF_CHAR_NUM:r.byId("idCharno").getValue(),CHAR_VALUE:o,CHARVAL_NUM:r.byId("idNCharvalno").getValue(),REF_CHARVAL:t,REF_CHARVAL_NUM:r.byId("idCharvalno").getValue()};r.aData.push(r.oData);r.ListModel.setData({results:r.aData});r.byId("idCharList").setModel(r.ListModel);r.byId("idClassname").setValue("");r.byId("idClassno").setValue("");r.byId("idCharname").setValue("");r.byId("idCharno").setValue("");r.byId("idCharval").setValue("");r.byId("idCharvalno").setValue("");r.byId("idNClassname").setValue("");r.byId("idNClassno").setValue("");r.byId("idNCharname").setValue("");r.byId("idNCharno").setValue("");r.byId("idNCharval").setValue("");r.byId("idNCharvalno").setValue("")}else{l.show("Please select all inputs")}},onCharDel:function(e){var a=e.getParameters("listItem").id.split("CharList-")[1];var t=r.ListModel.getData().results;t.splice(a,1);r.ListModel.refresh()},onCharPanel:function(){if(r.byId("idrefprod").getValue()){r.byId("idCharPanel").setExpanded(true)}else{r.byId("idCharPanel").setExpanded(false);l.show("Select ref product")}},onProdSave:function(e){var a=this.byId("idloc").getValue(),t=this.byId("idrefprod").getValue(),s=this.byId("idProd").getValue(),i=d.getProperty("/sFlag");if(t===s){l.show("Reference product and new product can not be same")}else{r.getModel("BModel").callFunction("/maintainNewProd",{method:"GET",urlParameters:{LOCATION_ID:a,PRODUCT_ID:s,REF_PRODID:t,FLAG:i},success:function(e){sap.ui.core.BusyIndicator.hide();if(i==="C"){l.show("New product created successfully")}else{l.show("Successfully updated the product")}r.createChar()},error:function(e){l.show("Failed to create /updaate the producr");sap.ui.core.BusyIndicator.hide()}})}},createChar:function(){var e={PRODCHAR:[]},a;var t=r.ListModel.getData().results;var s=d.getProperty("/sFlag");for(var i=0;i<t.length;i++){a={PRODUCT_ID:r.byId("idProd").getValue(),LOCATION_ID:r.byId("idloc").getValue(),REF_PRODID:r.byId("idrefprod").getValue(),CLASS_NUM:t[i].CLASS_NUM,REF_CLASS_NUM:t[i].REF_CLASS_NUM,CHAR_NUM:t[i].CHAR_NUM,REF_CHAR_NUM:t[i].REF_CHAR_NUM,CHARVAL_NUM:t[i].CHARVAL_NUM,REF_CHARVAL_NUM:t[i].REF_CHARVAL_NUM};e.PRODCHAR.push(a)}r.getModel("BModel").callFunction("/maintainNewProdChar",{method:"GET",urlParameters:{FLAG:s,PRODCHAR:JSON.stringify(e.PRODCHAR)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("success")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error")}})}})});