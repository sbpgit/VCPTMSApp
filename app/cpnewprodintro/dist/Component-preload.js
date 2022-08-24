//@ui5-bundle cpapp/cpnewprodintro/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpnewprodintro/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpnewprodintro/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpnewprodintro.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpnewprodintro/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpnewprodintro.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpnewprodintro/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpnewprodintro.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpnewprodintro/controller/Detail.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpnewprodintro/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,a,t,s,i,l,o){"use strict";var d,r;return a.extend("cpapp.cpnewprodintro.controller.Detail",{onInit:function(){r=this;r.ListModel=new t;r.locModel=new t;r.prodModel=new t;r.classnameModel=new t;r.charnameModel=new t;r.charvalueModel=new t;r.ListModel.setSizeLimit(1e3);r.locModel.setSizeLimit(1e3);r.prodModel.setSizeLimit(1e3);r.classnameModel.setSizeLimit(1e3);r.charnameModel.setSizeLimit(1e3);r.charvalueModel.setSizeLimit(1e3);r.oData={};this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogclassName){this._valueHelpDialogclassName=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.className",this);this.getView().addDependent(this._valueHelpDialogclassName)}if(!this._valueHelpDialogcharName){this._valueHelpDialogcharName=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.charName",this);this.getView().addDependent(this._valueHelpDialogcharName)}if(!this._valueHelpDialogcharValue){this._valueHelpDialogcharValue=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.charValue",this);this.getView().addDependent(this._valueHelpDialogcharValue)}r.aData=[]},onAfterRendering:function(){this.oResourceBundle=this.getView().getModel("i18n").getResourceBundle();d=this.getModel("oGModel");this.oLoc=r.byId("idloc");this.oProd=r.byId("idrefprod");this.oClassName=r.byId("idClassname");this.oCharName=r.byId("idCharname");this.oCharValue=r.byId("idCharval");r._valueHelpDialogProd.setTitleAlignment("Center");r._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oClassnameList=this._oCore.byId(this._valueHelpDialogclassName.getId()+"-list");this.oCharnameList=this._oCore.byId(this._valueHelpDialogcharName.getId()+"-list");this.oCharvalueList=this._oCore.byId(this._valueHelpDialogcharValue.getId()+"-list");r.aData=[];if(d.getProperty("/sFlag")==="E"){r.byId("idClassChar").setTitle("Update Product");r.byId("idloc").setEditable(false);r.byId("idProd").setEditable(false);r.byId("idloc").setValue(d.getProperty("/Loc"));r.byId("idProd").setValue(d.getProperty("/Prod"));r.byId("idrefprod").setValue(d.getProperty("/refProd"));r.getCharData();r.byId("idprodPanel").setExpanded(false);r.byId("idCharPanel").setExpanded(true)}else if(d.getProperty("/sFlag")==="C"){r.byId("idClassChar").setTitle("New Product");r.byId("idloc").setEditable(true);r.byId("idProd").setEditable(true);r.byId("idloc").setValue("");r.byId("idProd").setValue("");r.byId("idrefprod").setValue("");r.ListModel.setData({results:r.aData});r.byId("idprodPanel").setExpanded(true);r.byId("idCharPanel").setExpanded(false)}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocation",{success:function(e){sap.ui.core.BusyIndicator.hide();r.locModel.setData(e);r.oLocList.setModel(r.locModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})},onBack:function(){var e=sap.ui.core.UIComponent.getRouterFor(r);e.navTo("Home",{},true)},getCharData:function(){var e=d.getProperty("/Prod"),a=d.getProperty("/refProd");sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getNewProdChar",{filters:[new s("REF_PRODID",i.EQ,a),new s("PRODUCT_ID",i.EQ,e)],success:function(e){sap.ui.core.BusyIndicator.hide();r.ListModel.setData({results:e.results});r.byId("idCharList").setModel(r.ListModel);var a=e.results;if(a.length){for(var t=0;t<a.length;t++){r.oData={CLASS_NAME:a[t].CLASS_NAME,CLASS_NUM:a[t].CLASS_NUM,CHAR_NAME:a[t].CHAR_NAME,CHAR_NUM:a[t].CHAR_NUM,CHAR_VALUE:a[t].CHAR_VALUE,CHARVAL_NUM:a[t].CHARVAL_NUM};r.aData.push(r.oData)}}},error:function(){sap.ui.core.BusyIndicator.hide();l.show("Failed to get data")}})},handleValueHelp:function(e){var a=e.getParameter("id");d.setProperty("/OpenProdInut","");if(a.includes("loc")){r._valueHelpDialogLoc.open()}else if(a.includes("idrefprod")){r.ProdData();if(r.byId("idloc").getValue()){d.setProperty("/OpenProdInut","RP");r._valueHelpDialogProd.open()}else{l.show("Select Location")}}else if(a.includes("idProd")){r.ProdData();if(r.byId("idloc").getValue()){d.setProperty("/OpenProdInut","NP");r._valueHelpDialogProd.open()}else{l.show("Select Location")}}else if(a.includes("Classname")){var t="";if(a.split("--")[2]==="idClassname"){r.RefDataId();t=r.byId("idrefprod").getValue()}else if(a.split("--")[2]==="idNClassname"){r.NewDataId();t=r.byId("idProd").getValue()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,t)],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.classnameModel.setData({results:a(e.results,"CLASS_NAME")});r.oClassnameList.setModel(r.classnameModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}});r._valueHelpDialogclassName.open()}else if(a.includes("Charname")){var t="";if(a.split("--")[2]==="idCharname"){r.RefDataId();t=r.byId("idrefprod").getValue()}else if(a.split("--")[2]==="idNCharname"){r.NewDataId();t=r.byId("idProd").getValue()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,t),new s("CLASS_NAME",i.EQ,r.oClassName.getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.charnameModel.setData({results:a(e.results,"CHAR_NAME")});r.oCharnameList.setModel(r.charnameModel);r._valueHelpDialogcharName.open()},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})}else if(a.includes("Charval")){var t="";if(a.split("--")[2]==="idCharval"){r.RefDataId();t=r.byId("idrefprod").getValue()}else if(a.split("--")[2]==="idNCharval"){r.NewDataId();t=r.byId("idProd").getValue()}sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,t),new s("CLASS_NAME",i.EQ,r.oClassName.getValue()),new s("CHAR_NAME",i.EQ,r.oCharName.getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.charvalueModel.setData({results:a(e.results,"CHAR_VALUE")});r.oCharvalueList.setModel(r.charvalueModel);r._valueHelpDialogcharValue.open()},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})}},RefDataId:function(){this.oClassName=r.byId("idClassname");this.oClassNo=r.byId("idClassno");this.oCharName=r.byId("idCharname");this.oCharNo=r.byId("idCharno");this.oCharValue=r.byId("idCharval");this.oCharValueNo=r.byId("idCharvalno")},NewDataId:function(){this.oClassName=r.byId("idNClassname");this.oClassNo=r.byId("idNClassno");this.oCharName=r.byId("idNCharname");this.oCharNo=r.byId("idNCharno");this.oCharValue=r.byId("idNCharval");this.oCharValueNo=r.byId("idNCharvalno")},ProdData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/getLocProdDet",{filters:[new s("LOCATION_ID",i.EQ,r.byId("idloc").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();r.prodModel.setData(e);r.oProdList.setModel(r.prodModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})},handleClose:function(e){var a=e.getParameter("id");if(a.includes("Loc")){r._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(r.oLocList.getBinding("items")){r.oLocList.getBinding("items").filter([])}}else if(a.includes("prod")){r._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(r.oProdList.getBinding("items")){r.oProdList.getBinding("items").filter([])}}else if(a.includes("className")){r._oCore.byId(this._valueHelpDialogclassName.getId()+"-searchField").setValue("");if(r.oClassnameList.getBinding("items")){r.oClassnameList.getBinding("items").filter([])}}else if(a.includes("charName")){r._oCore.byId(this._valueHelpDialogcharName.getId()+"-searchField").setValue("");if(r.oCharnameList.getBinding("items")){r.oCharnameList.getBinding("items").filter([])}}else if(a.includes("charVal")){r._oCore.byId(this._valueHelpDialogcharValue.getId()+"-searchField").setValue("");if(r.oCharvalueList.getBinding("items")){r.oCharvalueList.getBinding("items").filter([])}}},handleSearch:function(e){var a=e.getParameter("value")||e.getParameter("newValue"),t=e.getParameter("id"),l=[];a=a?a.trim():"";if(t.includes("Loc")){if(a!==""){l.push(new s({filters:[new s("LOCATION_ID",i.Contains,a),new s("LOCATION_DESC",i.Contains,a)],and:false}))}r.oLocList.getBinding("items").filter(l)}else if(t.includes("prodSlctList")){if(a!==""){l.push(new s({filters:[new s("PRODUCT_ID",i.Contains,a),new s("PROD_DESC",i.Contains,a)],and:false}))}r.oProdList.getBinding("items").filter(l)}else if(t.includes("className")){if(a!==""){l.push(new s({filters:[new s("CLASS_NAME",i.Contains,a),new s("CLASS_NUM",i.Contains,a)],and:false}))}r.oClassnameList.getBinding("items").filter(l)}else if(t.includes("charName")){if(a!==""){l.push(new s({filters:[new s("CHAR_NAME",i.Contains,a),new s("CHAR_NUM",i.Contains,a)],and:false}))}r.oCharnameList.getBinding("items").filter(l)}else if(t.includes("charVal")){if(a!==""){l.push(new s({filters:[new s("CHAR_VALUE",i.Contains,a),new s("CHARVAL_NUM",i.Contains,a)],and:false}))}r.oCharvalueList.getBinding("items").filter(l)}},handleSelection:function(e){r.oGModel=r.getModel("oGModel");var a=e.getParameter("id"),t=e.getParameter("selectedItems"),s,i=[];if(a.includes("Loc")){r.oLoc=r.byId("idloc");r.oProd=r.byId("idrefprod");s=e.getParameter("selectedItems");r.oLoc.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedLoc",s[0].getTitle());r.oProd.setValue("");r.byId("idProd").setValue("");r.oGModel.setProperty("/SelectedProd","")}else if(a.includes("prod")){if(d.getProperty("/OpenProdInut")==="RP"){r.oProd=r.byId("idrefprod");s=e.getParameter("selectedItems");r.oProd.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectedProd",s[0].getTitle());r.aData=[];r.ListModel.setData({results:r.aData});r.byId("idCharList").setModel(r.ListModel);r.byId("idClassname").setValue("");r.byId("idClassno").setValue("");r.byId("idCharname").setValue("");r.byId("idCharno").setValue("");r.byId("idCharval").setValue("");r.byId("idCharvalno").setValue("");r.byId("idprodPanel").setExpanded(false);r.byId("idCharPanel").setExpanded(true)}else if(d.getProperty("/OpenProdInut")==="NP"){r.oNewProd=r.byId("idProd");s=e.getParameter("selectedItems");r.oNewProd.setValue(s[0].getTitle());r.oGModel.setProperty("/SelectednewProd",s[0].getTitle());r.aData=[];r.ListModel.setData({results:r.aData});r.byId("idCharList").setModel(r.ListModel);r.byId("idNClassname").setValue("");r.byId("idNClassno").setValue("");r.byId("idNCharname").setValue("");r.byId("idNCharno").setValue("");r.byId("idNCharval").setValue("");r.byId("idNCharvalno").setValue("")}}else if(a.includes("className")){s=e.getParameter("selectedItems");r.oClassName.setValue(s[0].getTitle());r.oClassNo.setValue(s[0].getDescription());r.oCharName.setValue("");r.oCharNo.setValue("");r.oCharValue.setValue("");r.oCharValueNo.setValue("")}else if(a.includes("charName")){s=e.getParameter("selectedItems");r.oCharName.setValue(s[0].getTitle());r.oCharNo.setValue(s[0].getDescription());r.oCharValue.setValue("");r.oCharValueNo.setValue("")}else if(a.includes("charVal")){s=e.getParameter("selectedItems");r.oCharValue.setValue(s[0].getTitle());r.oCharValueNo.setValue(s[0].getDescription())}r.handleClose(e)},charData:function(){this.getModel("BModel").read("/getProdClsChar",{filters:[new s("PRODUCT_ID",i.EQ,r.byId("idrefprod").getValue())],success:function(e){sap.ui.core.BusyIndicator.hide();function a(e,a){var t=new Set;return e.filter(e=>!t.has(e[a])&&t.add(e[a]))}r.classnameModel.setData({results:a(e.results,"CLASS_NAME")});r.oClassnameList.setModel(r.classnameModel)},error:function(e,a){sap.ui.core.BusyIndicator.hide();l.show("error")}})},onAdd:function(){var e=r.byId("idClassname").getValue(),a=r.byId("idCharname").getValue(),t=r.byId("idCharval").getValue(),s=r.byId("idNClassname").getValue(),i=r.byId("idNCharname").getValue(),o=r.byId("idNCharval").getValue();if(e!==""&&a!==""&&t!==""){this.oData={CLASS_NAME:s,CLASS_NUM:r.byId("idNClassno").getValue(),REF_CLASSNAME:e,REF_CLASS_NUM:r.byId("idClassno").getValue(),CHAR_NAME:i,CHAR_NUM:r.byId("idNCharno").getValue(),REF_CHARNAME:a,REF_CHAR_NUM:r.byId("idCharno").getValue(),CHAR_VALUE:o,CHARVAL_NUM:r.byId("idNCharvalno").getValue(),REF_CHARVAL:t,REF_CHARVAL_NUM:r.byId("idCharvalno").getValue()};r.aData.push(r.oData);r.ListModel.setData({results:r.aData});r.byId("idCharList").setModel(r.ListModel);r.byId("idClassname").setValue("");r.byId("idClassno").setValue("");r.byId("idCharname").setValue("");r.byId("idCharno").setValue("");r.byId("idCharval").setValue("");r.byId("idCharvalno").setValue("");r.byId("idNClassname").setValue("");r.byId("idNClassno").setValue("");r.byId("idNCharname").setValue("");r.byId("idNCharno").setValue("");r.byId("idNCharval").setValue("");r.byId("idNCharvalno").setValue("")}else{l.show("Please select all inputs")}},onCharDel:function(e){var a=e.getParameters("listItem").id.split("CharList-")[1];var t=r.ListModel.getData().results;t.splice(a,1);r.ListModel.refresh()},onCharPanel:function(){if(r.byId("idrefprod").getValue()){r.byId("idCharPanel").setExpanded(true)}else{r.byId("idCharPanel").setExpanded(false);l.show("Select ref product")}},onProdSave:function(e){var a=this.byId("idloc").getValue(),t=this.byId("idrefprod").getValue(),s=this.byId("idProd").getValue(),i=d.getProperty("/sFlag");if(t===s){l.show("Reference product and new product can not be same")}else{r.getModel("BModel").callFunction("/maintainNewProd",{method:"GET",urlParameters:{LOCATION_ID:a,PRODUCT_ID:s,REF_PRODID:t,FLAG:i},success:function(e){sap.ui.core.BusyIndicator.hide();if(i==="C"){l.show("New product created successfully")}else{l.show("Successfully updated the product")}r.createChar()},error:function(e){l.show("Failed to create /updaate the producr");sap.ui.core.BusyIndicator.hide()}})}},createChar:function(){var e={PRODCHAR:[]},a;var t=r.ListModel.getData().results;var s=d.getProperty("/sFlag");for(var i=0;i<t.length;i++){a={PRODUCT_ID:r.byId("idProd").getValue(),LOCATION_ID:r.byId("idloc").getValue(),REF_PRODID:r.byId("idrefprod").getValue(),CLASS_NUM:t[i].CLASS_NUM,REF_CLASS_NUM:t[i].REF_CLASS_NUM,CHAR_NUM:t[i].CHAR_NUM,REF_CHAR_NUM:t[i].REF_CHAR_NUM,CHARVAL_NUM:t[i].CHARVAL_NUM,REF_CHARVAL_NUM:t[i].REF_CHARVAL_NUM};e.PRODCHAR.push(a)}r.getModel("BModel").callFunction("/maintainNewProdChar",{method:"GET",urlParameters:{FLAG:s,PRODCHAR:JSON.stringify(e.PRODCHAR)},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("success")},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error")}})}})});
},
	"cpapp/cpnewprodintro/controller/Home.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpnewprodintro/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,r,s,a,i){"use strict";var n,l;return t.extend("cpapp.cpnewprodintro.controller.Home",{onInit:function(){l=this;l.ProdListModel=new o;l.charModel=new o;l.ProdListModel.setSizeLimit(1e3);l.charModel.setSizeLimit(1e3)},onAfterRendering:function(){l.oList=this.byId("ProdList");l.getData()},getData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/genNewProd",{success:function(e){sap.ui.core.BusyIndicator.hide();l.ProdListModel.setData(e);l.oList.setModel(l.ProdListModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},onCreate:function(e){n=this.getModel("oGModel");n.setProperty("/sFlag","");if(e.getSource().getTooltip().includes("Create")){n.setProperty("/sFlag","C");var t=sap.ui.core.UIComponent.getRouterFor(l);t.navTo("Detail",{},true)}else{if(this.byId("ProdList").getSelectedItems().length){var o=this.byId("ProdList").getSelectedItem().getCells();n.setProperty("/Loc",o[0].getText());n.setProperty("/Prod",o[1].getText());n.setProperty("/refProd",o[2].getText());n.setProperty("/sFlag","E");var t=sap.ui.core.UIComponent.getRouterFor(l);t.navTo("Detail",{},true)}else{a.show("Select product to update")}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("idSearch")){if(t!==""){a.push(new r({filters:[new r("LOCATION_ID",s.Contains,t),new r("REF_PRODID",s.Contains,t),new r("PRODUCT_ID",s.Contains,t)],and:false}))}l.oList.getBinding("items").filter(a)}},onProdeDel:function(e){var t=e.getSource().getParent().getCells();var o=t[0].getText(),r=t[1].getText(),s=t[2].getText();var i="Do you want to delete the selected product"+" - "+r+" - "+"Please confirm";sap.m.MessageBox.show(i,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();l.getModel("BModel").callFunction("/maintainNewProd",{method:"GET",urlParameters:{LOCATION_ID:o,REF_PRODID:s,PRODUCT_ID:r,FLAG:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();a.show("Product deleted successfully");l.onAfterRendering()},error:function(){sap.ui.core.BusyIndicator.hide();a.show("Failed to delete product")}})}}})},onCharDetails:function(e){var t=e.getSource().getParent().getCells()[1].getText();var o=e.getSource().getParent().getCells()[0].getText();if(!l._onCharDetails){l._onCharDetails=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.CharDetails",l);l.getView().addDependent(l._onCharDetails)}l._onCharDetails.setTitleAlignment("Center");l.CharDetailList=sap.ui.getCore().byId("idCharDetail");this.getModel("BModel").read("/getNewProdChar",{filters:[new r("LOCATION_ID",s.EQ,o),new r("PRODUCT_ID",s.EQ,t)],success:function(e){l.charModel.setData({results:e.results});l.CharDetailList.setModel(l.charModel);l._onCharDetails.open()},error:function(){a.show("Failed to get data")}})},onCharClose:function(){l._onCharDetails.close()}})});
},
	"cpapp/cpnewprodintro/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpnewprodintro\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=New Product Introduction\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=New Product Introduction\n\nflpTitle=New Production Introduction\n\nflpSubtitle=\n\n\n\nloc = Location\nrefProd = Ref Product\nprod = New Product\n\n\nLoc = Location\nPrdId = Product\n\nsave = Save\nclose = Close\n\nclass = Class\ncharn = Characteristics Name\ncharv =Characteristics Value\nrefclass = Reference Class\nrefcharn = Reference Characteristics Name\nrefcharv = Reference Characteristics Value\n\nclassvalue = Class Value\ncharvalue = Char Value\ncharvalNum= char Value Number\nrefclassvalue = Reference Class Value\nrefcharvalue = Reference Char Value\nrefcharvalNum= Reference char Value Number',
	"cpapp/cpnewprodintro/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpnewprodintro","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap-ux/fiori-freestyle-writer:basic","version":"0.11.15","toolsId":"cc4702f0-af56-4072-b5e8-d064ebd84ff6"},"dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"cpapp-cpnewprodintro-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpnewprodintro","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpnewprodintro.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.102.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpnewprodintro.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpnewprodintro.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"Detail","pattern":"Detail","target":["Detail"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewId":"Home","viewName":"Home"},"Detail":{"viewType":"XML","transition":"slide","clearControlAggregation":true,"viewId":"Detail","viewName":"Detail"}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpapp/cpnewprodintro/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpnewprodintro/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpnewprodintro/view/App.view.xml":'<mvc:View controllerName="cpapp.cpnewprodintro.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpnewprodintro/view/CharDetails.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"><Dialog title="Product Characteristics" contentWidth="1200px"><Table id="idCharDetail" items="{path: \'/results\'}"><columns><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>class}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>refclass}" /></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charn}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>refcharn}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>charv}"/></Column><Column hAlign="Left" vAlign="Middle"><Text text="{i18n>refcharv}"/></Column></columns><items><ColumnListItem><cells><Text text="{CLASS_NAME}" /><Text text="{REF_CLASSNAME}" /><Text text="{CHAR_NAME}"/><Text text="{REF_CHARNAME}" /><Text text="{CHAR_VALUE}"/><Text text="{REF_CHARVAL}" /></cells></ColumnListItem></items></Table><buttons><Button type=\'Reject\' text="{i18n>close}" press="onCharClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpapp/cpnewprodintro/view/CreateProduct.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:u="sap.ui.unified"><Dialog title="" contentWidth="450px" titleAlignment="Center" class="boldText"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4" labelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1" singleContainerFullSize="false"><f:content><Label text="{i18n>loc}"/><Input id="idloc" value="" width="225px" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>prod}"/><Input id="idProd" value="" width="225px" placeholder="New Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>refProd}"/><Input id="idrefprod" value="" width="225px" placeholder="Reference Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:content></f:SimpleForm></VBox><buttons><Button type=\'Ghost\' text="{i18n>save}" press="onProdSave"></Button><Button type=\'Reject\' text="{i18n>close}" press="handleClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpapp/cpnewprodintro/view/Detail.view.xml":'<mvc:View controllerName="cpapp.cpnewprodintro.controller.Detail"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:u="sap.ui.unified"><Page id="idClassChar" title="New Product" titleAlignment="Center" showNavButton="true" navButtonPress="onBack" showFooter="true"><Panel id="idprodPanel" expandable="true" expanded="true" headerText="Product Details" width="auto" class="boldText"><content><VBox class="sapUiSmallMargin" width="1200px"><f:SimpleForm id="idSimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4" labelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1" singleContainerFullSize="false"><f:content><Label text="{i18n>loc}"/><Input id="idloc" value="" width="225px" placeholder="Location" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>prod}"/><Input id="idProd" value="" width="225px" placeholder="New Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>refProd}"/><Input id="idrefprod" value="" width="225px" placeholder="Reference Product" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:content></f:SimpleForm></VBox></content></Panel><Panel id="idCharPanel" expandable="true" headerText="Product Characteristics" width="auto" class="boldText" expand="onCharPanel"><content><OverflowToolbar id="idOvrFlwTb"><ToolbarSpacer/><Button id="idAdd" text="Add" press="onAdd" type="Emphasized"/></OverflowToolbar><VBox class="sapUiSmallMargin" width="1500px"><f:SimpleForm id="idSimpleForm" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"><f:content><core:Title text="New" /><Label text="{i18n>class}"/><Input id="idNClassname" value="" width="225px" placeholder="Class Name" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Input id="idNClassno" value="" visible="false"/><Label text="{i18n>charn}"/><Input id="idNCharname" value="" width="225px" placeholder="Char Name" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Input id="idNCharno" value="" visible="false"/><Label text="{i18n>charv}"/><Input id="idNCharval" value="" width="225px" placeholder="Char Value" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Input id="idNCharvalno" value="" visible="false"/><core:Title text="Reference" /><Label text="{i18n>class}"/><Input id="idClassname" value="" width="225px" placeholder="Class Name" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Input id="idClassno" value="" visible="false"/><Label text="{i18n>charn}"/><Input id="idCharname" value="" width="225px" placeholder="Char Name" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Input id="idCharno" value="" visible="false"/><Label text="{i18n>charv}"/><Input id="idCharval" value="" width="225px" placeholder="Char Value" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Input id="idCharvalno" value="" visible="false"/></f:content></f:SimpleForm></VBox></content></Panel><content><Table id="idCharList" items="{/results}"><columns><Column hAlign="Center"><Text text="{i18n>class}" /></Column><Column hAlign="Center" visible="false"><Text text="{i18n>classvalue}" /></Column><Column hAlign="Center"><Text text="{i18n>refclass}" /></Column><Column hAlign="Center" visible="false"><Text text="{i18n>refclassvalue}" /></Column><Column hAlign="Center"><Text text="{i18n>charn}"/></Column><Column hAlign="Center" visible="false"><Text text="{i18n>charvalue}"/></Column><Column hAlign="Center"><Text text="{i18n>refcharn}"/></Column><Column hAlign="Center" visible="false"><Text text="{i18n>refcharvalue}"/></Column><Column hAlign="Center"><Text text="{i18n>charv}"/></Column><Column hAlign="Center" visible="false"><Text text="{i18n>charvalNum}"/></Column><Column hAlign="Center"><Text text="{i18n>refcharv}"/></Column><Column hAlign="Center" visible="false"><Text text="{i18n>refcharvalNum}"/></Column><Column hAlign="Center"><Text text=""/></Column></columns><items><ColumnListItem><cells><Text text="{CLASS_NAME}" /><Text text="{CLASS_NUM}" /><Text text="{REF_CLASSNAME}" /><Text text="{REF_CLASS_NUM}" /><Text text="{CHAR_NAME}" /><Text text="{CHAR_NUM}" /><Text text="{REF_CHARNAME}" /><Text text="{REF_CHAR_NUM}" /><Text text="{CHAR_VALUE}" /><Text text="{CHARVAL_NUM}" /><Text text="{REF_CHARVAL}" /><Text text="{REF_CHARVAL_NUM}" /><Button id="idDel" icon="sap-icon://decline" tooltip="Delete" press="onCharDel" iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></content><footer><Toolbar><ToolbarSpacer/><Button type=\'Emphasized\' text="{i18n>save}" press="onProdSave"></Button></Toolbar></footer></Page></mvc:View>',
	"cpapp/cpnewprodintro/view/Home.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form" controllerName="cpapp.cpnewprodintro.controller.Home"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:t="sap.ui.table"><Page id="idClassChar"><customHeader><Toolbar ><Title id="Title" text="{i18n>title}" class="boldText"></Title><ToolbarSpacer/><Button id="idAdd" text="Create" icon="sap-icon://add" press="onCreate" tooltip = "Create new product"/><Button id="idUpdate" text="Update" icon="sap-icon://edit" press="onCreate" tooltip = "Update product"/></Toolbar></customHeader><content><SearchField id="idSearch" liveChange="handleSearch" placeholder="Product"/><Table id="ProdList" items="{path: \'/results\'}" mode="SingleSelectMaster"><columns><Column hAlign="Center"><Text text="{i18n>loc}" /></Column><Column hAlign="Center"><Text text="{i18n>prod}"/></Column><Column hAlign="Center"><Text text="{i18n>refProd}"/></Column><Column hAlign="Right"><Text text="" /></Column><Column hAlign="Right"><Text text="" /></Column></columns><items><ColumnListItem><cells><Text text="{LOCATION_ID}" /><Text text="{PRODUCT_ID}" /><Text text="{REF_PRODID}" /><Button id="idDisplay" icon="sap-icon://display" tooltip="Product Characteristics" press="onCharDetails" iconDensityAware="false" type="Transparent"/><Button id="idProd" icon="sap-icon://decline" tooltip="Delete" press="onProdeDel" iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></content></Page></mvc:View>',
	"cpapp/cpnewprodintro/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>Loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpnewprodintro/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>PrdId}" rememberSelections="false" search="handleSearch" \n    liveChange="handleSearch" confirm="handleSelection" cancel="handleClose" contentWidth="320px" items="{/results}" \n    selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpnewprodintro/view/charName.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="charNameList" title="{i18n>charn}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{CHAR_NAME}" description="{CHAR_NUM}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpnewprodintro/view/charValue.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="charValList" title="{i18n>Charv}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{CHAR_VALUE}" description="{CHARVAL_NUM}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpnewprodintro/view/className.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="classNameList" title="{i18n>class}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{CLASS_NAME}" description="{CLASS_NUM}" type="Active"/></SelectDialog></core:FragmentDefinition>'
}});
