sap.ui.define(["cpapp/cpprscchar/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","cpapp/cpprscchar/Utils","sap/ui/core/dnd/DragInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/library","sap/ui/model/Sorter"],function(e,t,a,r,o,s,i,l,n,c){"use strict";var d,u;var h=n.dnd.DropLayout;var g=n.dnd.DropPosition;return e.extend("cpapp.cpprscchar.controller.Home",{onInit:function(){d=this;this.PrimarylistModel=new t;this.SeclistModel=new t;this.SearchModel=new t;d.locModel=new t;d.prodModel=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpprscchar.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpprscchar.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}d.oSelectedItem="";this.attachDragDrop()},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();this.oLoc=this.byId("idloc");this.oProd=this.byId("prodInput");d._valueHelpDialogProd.setTitleAlignment("Center");d._valueHelpDialogLoc.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.getModel("BModel").read("/getLocation",{success:function(e){d.locModel.setData(e);d.oLocList.setModel(d.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){a.show("error")}})},onGetData:function(){var e=d.byId("idloc").getValue(),t=d.byId("prodInput").getValue();if(e!==""&&t!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"G",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();d.oPList=d.byId("Primarytable"),d.oSList=d.byId("Secondarytable");d.primaryData=[],d.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){d.primaryData.push(e.results[t])}else{d.secData.push(e.results[t])}}d.finalSecData=[];for(var a=0;a<=d.secData.length;a++){for(var r=0;r<d.secData.length;r++){if(a===d.secData[r].SEQUENCE){d.finalSecData.push(d.secData[r]);break}}}d.PrimarylistModel.setData({results:d.primaryData});d.oPList.setModel(d.PrimarylistModel);d.SeclistModel.setData({results:d.finalSecData});d.oSList.setModel(d.SeclistModel);d.searchlist=d.finalSecData;d.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},d);d.SearchModel.setData({results:d.searchlist});d.byId("searchField").setModel(d.SearchModel);var o=d.oSList.getItems();if(d.oSelectedItem){for(var t=0;t<o.length;t++){if(d.oSelectedItem===o[t].getCells()[1].getText()){o[t].focus();o[t].setSelected(true)}}}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onReset:function(){var e=d.byId("idloc").getValue(),t=d.byId("prodInput").getValue();d.oSelectedItem="";this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"R",LOCATION_ID:e,PRODUCT_ID:t},success:function(e){sap.ui.core.BusyIndicator.hide();d.oPList=d.byId("Primarytable"),d.oSList=d.byId("Secondarytable");d.primaryData=[],d.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){d.primaryData.push(e.results[t])}else{d.secData.push(e.results[t])}}d.finalSecData=[];for(var a=0;a<=d.secData.length;a++){for(var r=0;r<d.secData.length;r++){if(a===d.secData[r].SEQUENCE){d.finalSecData.push(d.secData[r]);break}}}d.PrimarylistModel.setData({results:d.primaryData});d.oPList.setModel(d.PrimarylistModel);d.SeclistModel.setData({results:d.finalSecData});d.oSList.setModel(d.SeclistModel);d.searchlist=d.SeclistModel;d.searchlist.forEach(function(e){e.CHAR_NAME=e.CHAR_NAME+" - "+e.CHAR_DESC},d);d.byId("searchField").setModel(d.SeclistModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._valueHelpDialogLoc.open()}else if(t.includes("prod")){if(d.byId("idloc").getValue()){d._valueHelpDialogProd.open()}else{a.show("Select Location")}}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){d._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(d.oLocList.getBinding("items")){d.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){d._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(d.oProdList.getBinding("items")){d.oProdList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),a=e.getParameter("id"),s=[];t=t?t.trim():"";if(a.includes("Loc")){if(t!==""){s.push(new r({filters:[new r("LOCATION_ID",o.Contains,t),new r("LOCATION_DESC",o.Contains,t)],and:false}))}d.oLocList.getBinding("items").filter(s)}else if(a.includes("prod")){if(t!==""){s.push(new r({filters:[new r("PRODUCT_ID",o.Contains,t),new r("PROD_DESC",o.Contains,t)],and:false}))}d.oProdList.getBinding("items").filter(s)}},handleSelection:function(e){var t=e.getParameter("id"),s=e.getParameter("selectedItems"),i,l=[];if(t.includes("Loc")){this.oLoc=d.byId("idloc");var n=e.getParameter("selectedItems");d.oLoc.setValue(n[0].getTitle());d.byId("prodInput").setValue("");this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();this.getModel("BModel").read("/getLocProdDet",{filters:[new r("LOCATION_ID",o.EQ,n[0].getTitle())],success:function(e){d.prodModel.setData(e);d.oProdList.setModel(d.prodModel)},error:function(e,t){a.show("error")}})}else if(t.includes("prod")){this.oProd=d.byId("prodInput");var c=e.getParameter("selectedItems");d.oProd.setValue(c[0].getTitle())}},attachDragDrop:function(){var e=this.byId("Primarytable");e.addDragDropConfig(new i({sourceAggregation:"items"}));e.addDragDropConfig(new l({targetAggregation:"items",dropPosition:g.Between,dropLayout:h.Vertical,drop:this.onDrop.bind(this)}));var t=this.byId("Secondarytable");t.addDragDropConfig(new i({sourceAggregation:"items"}));t.addDragDropConfig(new l({targetAggregation:"items",dropPosition:g.Between,dropLayout:h.Vertical,drop:d.onDrop.bind(d)}))},onDrop:function(e){var t=e.getParameter("draggedControl"),r=e.getParameter("droppedControl"),o=e.getParameter("dropPosition"),s=t.getParent(),i=e.getSource().getParent(),l=s.getModel(),n=i.getModel(),c=l.getData(),u=n.getData(),h=s.indexOfItem(t),g=i.indexOfItem(r);var p=c.results[h];c.results.splice(h,1);if(l===n&&h<g){g--}if(o==="After"){g++}u.results.splice(g,0,p);if(l!==n){var f;var D=0;if(p.CHAR_TYPE==="S"){D=p.SEQUENCE;f="P"}else{f="S";D=u.results.length}d.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:p.LOCATION_ID,PRODUCT_ID:p.PRODUCT_ID,CHAR_NUM:p.CHAR_NUM,SEQUENCE:D,CHAR_TYPE:f,FLAG:"C"},success:function(e){sap.ui.core.BusyIndicator.hide();d.byId("idPrimarySearch").setValue("");d.onPrimarySearch();d.byId("searchField").setValue("");d.onCharSearch();d.onGetData()},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}else{n.setData(u);var I=this.byId("Secondarytable").getItems();d.oSelectedItem=p.CHAR_NAME;d.onSaveSeq(g)}},onSaveSeq:function(e){var t=this.byId("Secondarytable").getItems();d.count=e+2;var r=0;for(var o=0;o<t.length;o++){var s={};s.Location=d.byId("idloc").getValue();s.product=d.byId("prodInput").getValue();s.CharNo=t[o].getCells()[0].getText();s.SEQUENCE=o+1;s.FLAG="E";s.CHAR_TYPE="S";d.getModel("BModel").callFunction("/changeToPrimary",{method:"GET",urlParameters:{LOCATION_ID:s.Location,PRODUCT_ID:s.product,CHAR_NUM:s.CharNo,SEQUENCE:s.SEQUENCE,CHAR_TYPE:s.CHAR_TYPE,FLAG:s.FLAG},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.changeToPrimary.includes("successful")){r=r+1}if(r+1===d.count){a.show("Successfully changed the sequence");d.byId("searchField").setValue("");d.onCharSearch();d.onGetData()}},error:function(e){sap.ui.core.BusyIndicator.hide();a.show("Failed to changes the char")}})}},onPrimarySearch:function(){var e=d.byId("idPrimarySearch").getValue(),t=[];e=e?e.trim():"";if(e!==""){t.push(new r({filters:[new r("CHAR_NAME",o.Contains,e)],and:false}))}d.byId("Primarytable").getBinding("items").filter(t)},onCharSearch:function(e){var t=d.byId("searchField").getValue(),a=this.byId("Secondarytable").getItems();t=t?t.trim():"";if(t===""){a[0].focus();a[0].setSelected(true)}else{t=t.split("-")[0].trim();for(var r=0;r<a.length;r++){if(t===a[r].getCells()[1].getText()){a[r].focus();a[r].setSelected(true)}}}},onSuggest:function(e){var t=e.getParameter("suggestValue"),a=[];a=[new r([new r("Char",function(e){return(e||"").toUpperCase().indexOf(t.toUpperCase())>-1})],false)];this.byId("searchField").getBinding("suggestionItems").filter(a);this.byId("searchField").suggest()},onPressUpdate:function(e){var t=d.byId("idloc").getValue(),r=d.byId("prodInput").getValue();if(t!==""&&r!==""){sap.ui.core.BusyIndicator.show();this.getModel("BModel").callFunction("/getSecondaryChar",{method:"GET",urlParameters:{FLAG:"U",LOCATION_ID:t,PRODUCT_ID:r},success:function(e){sap.ui.core.BusyIndicator.hide();a.show("Updated Successfully");d.oPList=d.byId("Primarytable"),d.oSList=d.byId("Secondarytable");d.primaryData=[],d.secData=[];for(var t=0;t<e.results.length;t++){if(e.results[t].CHAR_TYPE==="P"){d.primaryData.push(e.results[t])}else{d.secData.push(e.results[t])}}d.finalSecData=[];for(var r=0;r<=d.secData.length;r++){for(var o=0;o<d.secData.length;o++){if(r===d.secData[o].SEQUENCE){d.finalSecData.push(d.secData[o]);break}}}d.PrimarylistModel.setData({results:d.primaryData});d.oPList.setModel(d.PrimarylistModel);d.SeclistModel.setData({results:d.finalSecData});d.oSList.setModel(d.SeclistModel);d.searchlist=d.finalSecData;d.searchlist.forEach(function(e){e.Char=e.CHAR_NAME+" - "+e.CHAR_DESC},d);d.SearchModel.setData({results:d.searchlist});d.byId("searchField").setModel(d.SearchModel);var s=d.oSList.getItems();if(d.oSelectedItem){for(var t=0;t<s.length;t++){if(d.oSelectedItem===s[t].getCells()[1].getText()){s[t].focus();s[t].setSelected(true)}}}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}else{a.show("Please select Location and Product")}},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var a=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(a,true)}}})});