sap.ui.define(["cpapp/cpprscchar/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","cpapp/cpprscchar/Utils","sap/ui/core/dnd/DragInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/library","sap/ui/model/Sorter"],function(e,t,a,o,r,i,s,l,n,d){"use strict";var c,u;var g=n.dnd.DropLayout;var h=n.dnd.DropPosition;return e.extend("cpapp.cpprscchar.controller.Home",{onInit:function(){c=this;this.PrimarylistModel=new t;this.SeclistModel=new t;this.SearchModel=new t;c.locModel=new t;c.prodModel=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpprscchar.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpprscchar.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}c.oSelectedItem="";this.attachDragDrop()},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");c._valueHelpDialogProd.setTitleAlignment("Center");c._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){c.locModel.setData(e);c.oLocList.setModel(c.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onGetData:function(){var e=c.byId("idloc").getValue(),t=c.byId("prodInput").getValue();if(e!==""&&t!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"G",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();c.oPList=c.byId("Primarytable"),c.oSList=c.byId("Secondarytable");c.primaryData=[],c.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){c.primaryData.push(e.results[t])}else{c.secData.push(e.results[t])}}c.finalSecData=[];for(var a=0;a<=c.secData.length;a++){for(var o=0;o<c.secData.length;o++){if(a===c.secData[o].SEQUENCE){c.finalSecData.push(c.secData[o]);break}}}c.PrimarylistModel.setData({results:c.primaryData});c.oPList.setModel(c.PrimarylistModel);c.SeclistModel.setData({results:c.finalSecData});c.oSList.setModel(c.SeclistModel);c.searchlist=c.finalSecData;c.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},c);c.SearchModel.setData({results:c.searchlist});c.byId("searchField").setModel(c.SearchModel);var r=c.oSList.getItems();if(c.oSelectedItem){for(var t=0;t<r.length;t++){if(c.oSelectedItem===r[t].getCells()[1].getText()){r[t].focus();r[t].setSelected(true)}}}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onReset:function(){var e=c.byId("idloc").getValue(),t=c.byId("prodInput").getValue();c.oSelectedItem="";this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"R",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();c.oPList=c.byId("Primarytable"),c.oSList=c.byId("Secondarytable");c.primaryData=[],c.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){c.primaryData.push(e.results[t])}else{c.secData.push(e.results[t])}}c.finalSecData=[];for(var a=0;a<=c.secData.length;a++){for(var o=0;o<c.secData.length;o++){if(a===c.secData[o].SEQUENCE){c.finalSecData.push(c.secData[o]);break}}}c.PrimarylistModel.setData({results:c.primaryData});c.oPList.setModel(c.PrimarylistModel);c.SeclistModel.setData({results:c.finalSecData});c.oSList.setModel(c.SeclistModel);c.searchlist=c.SeclistModel;c.searchlist.forEach(function(e){e.CHAR_NAME=e.CHAR_NAME+" - "+e.CHAR_DESC},c);c.byId("searchField").setModel(c.SeclistModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){c._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(c.byId("idloc").getValue()){c._valueHelpDialogProd.open()}else{a.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){c._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(c.oLocList.getBinding("items")){c.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){c._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(c.oProdList.getBinding("items")){c.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),a=e.getParameter("id"),i=[];t=t?t.trim():"";if(a.includes("Loc")){if(t!==""){i.push(new o({filters:[new o("LOCATION_ID",r.Contains,t),new o("LOCATION_DESC",r.Contains,t)],and:false}))}c.oLocList.getBinding("items").filter(i)}else if(a.includes("prod")){if(t!==""){i.push(new o({filters:[new o("PRODUCT_ID",r.Contains,t),new o("PROD_DESC",r.Contains,t)],and:false}))}c.oProdList.getBinding("items").filter(i)}},handleSelection:function(e){var t=e.getParameter("id"),i=e.getParameter("selectedItems"),s,l=[];if(t.includes("Loc")){this.oLoc=c.byId("idloc");var n=e.getParameter("selectedItems");c.oLoc.setValue(n[0].getTitle());c.byId("prodInput").setValue("");this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",r.EQ,n[0].getTitle())],success:function(e){c.prodModel.setData(e);c.oProdList.setModel(c.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){this.oProd=c.byId("prodInput");var d=e.getParameter("selectedItems");c.oProd.setValue(d[0].getTitle())}},attachDragDrop:function(){var e=this.byId("Primarytable");e.addDragDropConfig(new s({sourceAggregation:"items"}));e.addDragDropConfig(new l({targetAggregation:"items",dropPosition:h.Between,dropLayout:g.Vertical,drop:this.onDrop.bind(this)}));var t=this.byId("Secondarytable");t.addDragDropConfig(new s({sourceAggregation:"items"}));t.addDragDropConfig(new l({targetAggregation:"items",dropPosition:h.Between,dropLayout:g.Vertical,drop:c.onDrop.bind(c)}))},onDrop:function(e){var t=e.getParameter("draggedControl"),o=e.getParameter("droppedControl"),r=e.getParameter("dropPosition"),i=t.getParent(),s=e.getSource().getParent(),l=i.getModel(),n=s.getModel(),d=l.getData(),u=n.getData(),g=i.indexOfItem(t),h=s.indexOfItem(o);var p=d.results[g];d.results.splice(g,1);if(l===n&&g<h){h--}if(r==="After"){h++}u.results.splice(h,0,p);if(l!==n){var f;var D=0;if(p.CHAR_TYPE==="S"){D=p.SEQUENCE;f="P"}else{f="S";D=u.results.length}c.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:p.LOCATION_ID,PRODUCT_ID:p.PRODUCT_ID,CHAR_NUM:p.CHAR_NUM,SEQUENCE:D,CHAR_TYPE:f,FLAG:"C"},success:function(e){sap.ui.core.BusyIndicator.hide();c.byId("idPrimarySearch").setValue("");c.onPrimarySearch();c.byId("searchField").setValue("");c.onCharSearch();c.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}else{n.setData(u);var I=this.byId("Secondarytable").getItems();c.oSelectedItem=p.CHAR_NAME;c.onSaveSeq(h)}},onSaveSeq:function(e){var t=this.byId("Secondarytable").getItems();c.count=e+2;var o=0;for(var r=0;r<t.length;r++){var i={};i.Location=c.byId("idloc").getValue();i.product=c.byId("prodInput").getValue();i.CharNo=t[r].getCells()[0].getText();i.SEQUENCE=r+1;i.FLAG="E";i.CHAR_TYPE="S";c.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:i.Location,PRODUCT_ID:i.product,CHAR_NUM:i.CharNo,SEQUENCE:i.SEQUENCE,CHAR_TYPE:i.CHAR_TYPE,FLAG:i.FLAG},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.changeToPrimary.includes("successful")){o=o+1}if(o+1===c.count){a.show("Successfully changed the sequence");c.byId("searchField").setValue("");c.onCharSearch();c.onGetData()}},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}},onPrimarySearch:function(){var e=c.byId("idPrimarySearch").getValue(),t=[];e=e?e.trim():"";if(e!==""){t.push(new o({filters:[new o("CHAR_NAME",r.Contains,e)],and:false}))}c.byId("Primarytable").getBinding("items").filter(t)},onCharSearch:function(e){var t=c.byId("searchField").getValue(),a=this.byId("Secondarytable").getItems();t=t?t.trim():"";if(t===""){a[0].focus();a[0].setSelected(true)}else{t=t.split("-")[0].trim();for(var o=0;o<a.length;o++){if(t===a[o].getCells()[1].getText()){a[o].focus();a[o].setSelected(true)}}}},onSuggest:function(e){var t=e.getParameter("suggestValue"),a=[];a=[new o([new o("Char",function(e){return(e||"").toUpperCase().indexOf(t.toUpperCase())>-1})],false)];this.byId("searchField").getBinding("suggestionItems").filter(a);this.byId("searchField").suggest()}})});