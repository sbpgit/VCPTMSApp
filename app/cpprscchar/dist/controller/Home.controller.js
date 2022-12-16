sap.ui.define(["cpapp/cpprscchar/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","cpapp/cpprscchar/Utils","sap/ui/core/dnd/DragInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/library","sap/ui/model/Sorter"],function(e,t,a,r,o,s,i,l,d,n){"use strict";var c,u;var g=d.dnd.DropLayout;var h=d.dnd.DropPosition;return e.extend("cpapp.cpprscchar.controller.Home",{onInit:function(){c=this;u=this.getModel("oGModel");this.PrimarylistModel=new t;this.SeclistModel=new t;this.SearchModel=new t;c.locModel=new t;c.prodModel=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpprscchar.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpprscchar.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}c.oSelectedItem="";this.attachDragDrop()},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");c._valueHelpDialogProd.setTitleAlignment("Center");c._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){c.locModel.setData(e);c.oLocList.setModel(c.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onGetData:function(){var e=c.byId("idloc").getValue(),t=c.byId("prodInput").getValue();if(e!==""&&t!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"G",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();c.oPList=c.byId("Primarytable"),c.oSList=c.byId("Secondarytable");c.primaryData=[],c.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){c.primaryData.push(e.results[t])}else{c.secData.push(e.results[t])}}c.finalSecData=[];for(var a=0;a<=c.secData.length;a++){for(var r=0;r<c.secData.length;r++){if(a===c.secData[r].SEQUENCE){c.finalSecData.push(c.secData[r]);break}}}c.PrimarylistModel.setData({results:c.primaryData});c.oPList.setModel(c.PrimarylistModel);c.SeclistModel.setData({results:c.finalSecData});c.oSList.setModel(c.SeclistModel);c.searchlist=c.finalSecData;c.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},c);c.SearchModel.setData({results:c.searchlist});c.byId("searchField").setModel(c.SearchModel);var o=c.oSList.getItems();if(c.oSelectedItem){for(var t=0;t<o.length;t++){if(c.oSelectedItem===o[t].getCells()[1].getText()){o[t].focus();o[t].setSelected(true)}}}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onReset:function(){var e=c.byId("idloc").getValue(),t=c.byId("prodInput").getValue();c.oSelectedItem="";this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"R",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();c.oPList=c.byId("Primarytable"),c.oSList=c.byId("Secondarytable");c.primaryData=[],c.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){c.primaryData.push(e.results[t])}else{c.secData.push(e.results[t])}}c.finalSecData=[];for(var a=0;a<=c.secData.length;a++){for(var r=0;r<c.secData.length;r++){if(a===c.secData[r].SEQUENCE){c.finalSecData.push(c.secData[r]);break}}}c.PrimarylistModel.setData({results:c.primaryData});c.oPList.setModel(c.PrimarylistModel);c.SeclistModel.setData({results:c.finalSecData});c.oSList.setModel(c.SeclistModel);c.searchlist=c.SeclistModel;c.searchlist.forEach(function(e){e.CHAR_NAME=e.CHAR_NAME+" - "+e.CHAR_DESC},c);c.byId("searchField").setModel(c.SeclistModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){c._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(c.byId("idloc").getValue()){c._valueHelpDialogProd.open()}else{a.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){c._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(c.oLocList.getBinding("items")){c.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){c._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(c.oProdList.getBinding("items")){c.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),a=e.getParameter("id"),s=[];t=t?t.trim():"";if(a.includes("Loc")){if(t!==""){s.push(new r({filters:[new r("LOCATION_ID",o.Contains,t),new r("LOCATION_DESC",o.Contains,t)],and:false}))}c.oLocList.getBinding("items").filter(s)}else if(a.includes("prod")){if(t!==""){s.push(new r({filters:[new r("PRODUCT_ID",o.Contains,t),new r("PROD_DESC",o.Contains,t)],and:false}))}c.oProdList.getBinding("items").filter(s)}},handleSelection:function(e){var t=e.getParameter("id"),s=e.getParameter("selectedItems"),i,l=[];if(t.includes("Loc")){this.oLoc=c.byId("idloc");var d=e.getParameter("selectedItems");c.oLoc.setValue(d[0].getTitle());c.byId("prodInput").setValue("");this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new r("LOCATION_ID",o.EQ,d[0].getTitle())],success:function(e){c.prodModel.setData(e);c.oProdList.setModel(c.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){this.oProd=c.byId("prodInput");var n=e.getParameter("selectedItems");c.oProd.setValue(n[0].getTitle())}},attachDragDrop:function(){var e=this.byId("Primarytable");e.addDragDropConfig(new i({sourceAggregation:"items"}));e.addDragDropConfig(new l({targetAggregation:"items",dropPosition:h.Between,dropLayout:g.Vertical,drop:this.onDrop.bind(this)}));var t=this.byId("Secondarytable");t.addDragDropConfig(new i({sourceAggregation:"items"}));t.addDragDropConfig(new l({targetAggregation:"items",dropPosition:h.Between,dropLayout:g.Vertical,drop:c.onDrop.bind(c)}))},onDrop:function(e){u=this.getModel("oGModel");u.setProperty("/primFlag","");var t=e.getParameter("draggedControl"),r=e.getParameter("droppedControl"),o=e.getParameter("dropPosition"),s=t.getParent(),i=e.getSource().getParent(),l=s.getModel(),d=i.getModel(),n=l.getData(),g=d.getData(),h=s.indexOfItem(t),p=i.indexOfItem(r);var f=n.results[h];n.results.splice(h,1);if(l===d&&h<p){p--}if(o==="After"){p++}g.results.splice(p,0,f);if(l!==d){var D;var I=0;if(f.CHAR_TYPE==="S"){I=f.SEQUENCE;D="P"}else{D="S";I=g.results.length;u.setProperty("/primFlag","X")}c.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:f.LOCATION_ID,PRODUCT_ID:f.PRODUCT_ID,CHAR_NUM:f.CHAR_NUM,SEQUENCE:I,CHAR_TYPE:D,FLAG:"C"},success:function(e){sap.ui.core.BusyIndicator.hide();c.byId("idPrimarySearch").setValue("");c.onPrimarySearch();c.byId("searchField").setValue("");c.onCharSearch();c.onGetData();if(u.getProperty("/primFlag")==="X"){c.byId("idText").setVisible(true);c.byId("idText").addStyleClass("textColour")}},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}else{d.setData(g);var y=this.byId("Secondarytable").getItems();c.oSelectedItem=f.CHAR_NAME;c.onSaveSeq(p)}},onSaveSeq:function(e){var t=this.byId("Secondarytable").getItems();c.count=e+2;var r=0;for(var o=0;o<t.length;o++){var s={};s.Location=c.byId("idloc").getValue();s.product=c.byId("prodInput").getValue();s.CharNo=t[o].getCells()[0].getText();s.SEQUENCE=o+1;s.FLAG="E";s.CHAR_TYPE="S";c.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:s.Location,PRODUCT_ID:s.product,CHAR_NUM:s.CharNo,SEQUENCE:s.SEQUENCE,CHAR_TYPE:s.CHAR_TYPE,FLAG:s.FLAG},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.changeToPrimary.includes("successful")){r=r+1}if(r+1===c.count){a.show("Successfully changed the sequence");c.byId("searchField").setValue("");c.onCharSearch();c.onGetData()}},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}},onPrimarySearch:function(){var e=c.byId("idPrimarySearch").getValue(),t=[];e=e?e.trim():"";if(e!==""){t.push(new r({filters:[new r("CHAR_NAME",o.Contains,e)],and:false}))}c.byId("Primarytable").getBinding("items").filter(t)},onCharSearch:function(e){var t=c.byId("searchField").getValue(),a=this.byId("Secondarytable").getItems();t=t?t.trim():"";if(t===""){a[0].focus();a[0].setSelected(true)}else{t=t.split("-")[0].trim();for(var r=0;r<a.length;r++){if(t===a[r].getCells()[1].getText()){a[r].focus();a[r].setSelected(true)}}}},onSuggest:function(e){var t=e.getParameter("suggestValue"),a=[];a=[new r([new r("Char",function(e){return(e||"").toUpperCase().indexOf(t.toUpperCase())>-1})],false)];this.byId("searchField").getBinding("suggestionItems").filter(a);this.byId("searchField").suggest()},onPressUpdate:function(e){var t=c.byId("idloc").getValue(),r=c.byId("prodInput").getValue();if(t!==""&&r!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"U",LOCATION_ID:t,PRODUCT_ID:r},success:function(e){sap.ui.core.BusyIndicator.hide();a.show("Updated Successfully");c.oPList=c.byId("Primarytable"),c.oSList=c.byId("Secondarytable");c.primaryData=[],c.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){c.primaryData.push(e.results[t])}else{c.secData.push(e.results[t])}}c.finalSecData=[];for(var r=0;r<=c.secData.length;r++){for(var o=0;o<c.secData.length;o++){if(r===c.secData[o].SEQUENCE){c.finalSecData.push(c.secData[o]);break}}}c.PrimarylistModel.setData({results:c.primaryData});c.oPList.setModel(c.PrimarylistModel);c.SeclistModel.setData({results:c.finalSecData});c.oSList.setModel(c.SeclistModel);c.searchlist=c.finalSecData;c.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},c);c.SearchModel.setData({results:c.searchlist});c.byId("searchField").setModel(c.SearchModel);var s=c.oSList.getItems();if(c.oSelectedItem){for(var t=0;t<s.length;t++){if(c.oSelectedItem===s[t].getCells()[1].getText()){s[t].focus();s[t].setSelected(true)}}}u.setProperty("/primFlag","");c.byId("idText").setVisible(false);c.byId("idText").removeStyleClass("textColour")},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var a=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(a,true)}}})});