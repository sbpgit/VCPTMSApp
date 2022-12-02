sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/viz/ui5/data/FlattenedDataset","sap/viz/ui5/controls/common/feeds/FeedItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox","sap/m/Panel","sap/viz/ui5/controls/VizFrame","sap/viz/ui5/data/Dataset"],function(e,t,o,i,a,s,r,l,d,n,c){"use strict";var u,p,g,h=0;return e.extend("cpapp.cpcharqtygraph.controller.Home",{onInit:function(){g=this;g.TableModel=new t;g.locModel=new t;g.prodModel=new t;g.verModel=new t;g.scenModel=new t;g.dateJSON=new t;g.oNewModel=new t;this.PanelContent=g.byId("idVizFrame");g.TableModel.setSizeLimit(1e3);g.locModel.setSizeLimit(1e3);g.prodModel.setSizeLimit(1e3);g.verModel.setSizeLimit(1e3);g.scenModel.setSizeLimit(1e3);p=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){g.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oModVer=this.byId("idComboBox");this.oDate=this.byId("fromDate");g.aOrder=[];g.aSelOrder=[];var e=[];g._valueHelpDialogProd.setTitleAlignment("Center");g._valueHelpDialogLoc.setTitleAlignment("Center");g._valueHelpDialogVer.setTitleAlignment("Center");g._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getLocation",{success:function(e){g.locModel.setData(e);g.oLocList.setModel(g.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){sap.ui.core.BusyIndicator.hide();r.show("error")}});g.getView().getModel("oModel").read("/getCIRCharRate?$skiptoken=1000",{success:function(e){},error:function(e,t){sap.ui.core.BusyIndicator.hide();r.show("error")}})},onResetDate:function(){g.oLoc.setValue("");g.oProd.setValue("");g.oVer.setValue("");g.oScen.setValue("");this.oModVer.setSelectedKey("Active");var e=new t;e.setData([]);var o=g.byId("idVizFrame");o.setModel(e);this.oDate=this.byId("fromDate");this.oDate.setSelectedKey("")},handleValueHelp:function(e){var o=e.getParameter("id");if(o.includes("loc")){g._valueHelpDialogLoc.open();var i=new t;i.setData([]);var a=g.byId("idVizFrame");a.setModel(i);g.byId("fromDate").setEditable(false);g.byId("fromDate").setSelectedKey("")}else if(o.includes("prod")){if(g.byId("idloc").getValue()){g._valueHelpDialogProd.open();var i=new t;i.setData([]);var a=g.byId("idVizFrame");a.setModel(i);g.byId("fromDate").setEditable(false);g.byId("fromDate").setSelectedKey("")}else{r.show("Select Location")}}else if(o.includes("ver")){if(g.byId("idloc").getValue()&&g.byId("idprod").getValue()){g._valueHelpDialogVer.open()}else{r.show("Select Location and Product")}}else if(o.includes("scen")){if(g.byId("idloc").getValue()&&g.byId("idprod").getValue()&&g.byId("idver").getValue()){g._valueHelpDialogScen.open()}else{r.show("Select Location/Product/Version")}}},handleSelection:function(e){g.oGModel=g.getOwnerComponent().getModel("oGModel");var o=e.getParameter("id"),i=e.getParameter("selectedItems"),l,d=[];if(o.includes("Loc")){g.oLoc=g.byId("idloc");g.oProd=g.byId("idprod");l=e.getParameter("selectedItems");g.oLoc.setValue(l[0].getTitle());g.oGModel.setProperty("/SelectedLoc",l[0].getTitle());g.oProd.setValue("");g.oVer.setValue("");g.oScen.setValue("");g.oGModel.setProperty("/SelectedProd","");this.getView().getModel("oModel").callFunction("/getAllProd",{method:"GET",urlParameters:{LOCATION_ID:g.oLoc.getValue()},success:function(e){g.prodModel.setData(e);g.oProdList.setModel(g.prodModel)},error:function(e,t){r.show("error")}})}else if(o.includes("prod")){g.oProd=g.byId("idprod");l=e.getParameter("selectedItems");g.oProd.setValue(l[0].getTitle());g.oGModel.setProperty("/SelectedProd",l[0].getTitle());g.oVer.setValue("");g.oScen.setValue("");this.getView().getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:g.oGModel.getProperty("/SelectedLoc")},success:function(e){if(e.results.length===0){sap.m.MessageToast.show("No versions available for choosen Location/Product. Please choose another.");g.verModel.setData([]);g.oVerList.setModel(g.verModel);g.byId("fromDate").setEditable(false)}else{var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===l[0].getTitle()){t.push({VERSION:e.results[o].VERSION})}}if(t.length>0){g.verModel.setData({results:t});g.oVerList.setModel(g.verModel)}}},error:function(e,t){r.show("error")}})}else if(o.includes("Ver")){this.oVer=g.byId("idver");l=e.getParameter("selectedItems");g.oVer.setValue(l[0].getTitle());g.oScen.setValue("");g.oGModel.setProperty("/SelectedVer",l[0].getTitle());var n=g.oGModel.getProperty("/SelectedProd");this.getView().getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:g.oGModel.getProperty("/SelectedLoc")},success:function(e){var t=[];for(var o=0;o<e.results.length;o++){if(e.results[o].PRODUCT_ID===g.byId("idprod").getValue()&&e.results[o].VERSION===l[0].getTitle()){t.push({SCENARIO:e.results[o].SCENARIO})}}if(t.length>0){g.scenModel.setData({results:t});g.oScenList.setModel(g.scenModel)}},error:function(e,t){r.show("error")}})}else if(o.includes("scen")){sap.ui.core.BusyIndicator.show();this.oScen=g.byId("idscen");l=e.getParameter("selectedItems");g.oScen.setValue(l[0].getTitle());g.oGModel.setProperty("/SelectedScen",l[0].getTitle());g.getView().getModel("oModel").read("/getCIRCharRate",{filters:[new a("LOCATION_ID",s.EQ,g.oGModel.getProperty("/SelectedLoc")),new a("PRODUCT_ID",s.EQ,g.oGModel.getProperty("/SelectedProd")),new a("VERSION",s.EQ,g.oGModel.getProperty("/SelectedVer")),new a("SCENARIO",s.EQ,g.oGModel.getProperty("/SelectedScen"))],success:function(e){if(e.results.length===0){g.oDateModel=new t;g.oDateModel.setData([]);g.byId("fromDate").setModel(g.oDateModel);sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("No dates available for the selected criteria.");g.byId("fromDate").setEditable(false)}else{g.aOrder=[];g.aSelOrder=[];sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.WEEK_DATE=g.getInMMddyyyyFormat(e.WEEK_DATE)},g);for(var o=0;o<e.results.length;o++){if(g.aOrder.indexOf(e.results[o].WEEK_DATE)===-1){g.aOrder.push(e.results[o].WEEK_DATE)}}for(var i=0;i<g.aOrder.length;i++){g.oOrdData={WEEK_DATE:g.aOrder[i]};g.aSelOrder.push(g.oOrdData)}g.oDateModel=new t;g.oDateModel.setData({resultsCombos:g.aSelOrder});g.byId("fromDate").setModel(g.oDateModel);g.byId("fromDate").setEditable(true)}},error:function(e,t){sap.ui.core.BusyIndicator.hide();r.show("error")}})}g.handleClose(e)},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),i=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){i.push(new a({filters:[new a("LOCATION_ID",s.Contains,t),new a("LOCATION_DESC",s.Contains,t)],and:false}))}g.oLocList.getBinding("items").filter(i)}else if(o.includes("prod")){if(t!==""){i.push(new a({filters:[new a("PRODUCT_ID",s.Contains,t),new a("PROD_DESC",s.Contains,t)],and:false}))}g.oProdList.getBinding("items").filter(i)}else if(o.includes("Ver")){if(t!==""){i.push(new a({filters:[new a("VERSION",s.Contains,t)],and:false}))}g.oVerList.getBinding("items").filter(i)}else if(o.includes("scen")){if(t!==""){i.push(new a({filters:[new a("SCENARIO",s.Contains,t)],and:false}))}g.oScenList.getBinding("items").filter(i)}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){g._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(g.oLocList.getBinding("items")){g.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){g._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(g.oProdList.getBinding("items")){g.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){g._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(g.oVerList.getBinding("items")){g.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){g._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(g.oScenList.getBinding("items")){g.oScenList.getBinding("items").filter([])}}},onGetData:function(e){var o=g.byId("idloc").getValue(),i=g.byId("idprod").getValue(),a=g.byId("idver").getValue(),s=g.byId("idComboBox").getSelectedKey(),r=g.byId("fromDate").getValue(),l=g.byId("idscen").getValue();g.oGModel=g.getOwnerComponent().getModel("oGModel");var d=[];var n=new Date;n.setDate(n.getDate()-(n.getDay()+6)%7);if(o!==""&&i!==""&&a!==""&&l!==""){var c=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:o});d.push(c);var c=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:i});d.push(c);if(a){var c=new sap.ui.model.Filter({path:"VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:a});d.push(c)}if(s){var c=new sap.ui.model.Filter({path:"MODEL_VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:s});d.push(c)}if(l){var c=new sap.ui.model.Filter({path:"SCENARIO",operator:sap.ui.model.FilterOperator.EQ,value1:l});d.push(c)}if(r===""){var c=new sap.ui.model.Filter({path:"WEEK_DATE",operator:sap.ui.model.FilterOperator.EQ,value1:n});g.oGModel.setProperty("/date",n);d.push(c)}else{var c=new sap.ui.model.Filter({path:"WEEK_DATE",operator:sap.ui.model.FilterOperator.EQ,value1:r});g.oGModel.setProperty("/date",r);d.push(c)}sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getCIRCharRate",{filters:d,success:function(e){var o=new t;sap.ui.core.BusyIndicator.hide();if(e.results.length===0){n=g.oGModel.getProperty("/date");sap.m.MessageToast.show("No data available for "+n+"");o.setData([]);var i=g.byId("idVizFrame");i.setModel(o)}else{g.byId("application-cpcharqtygraph-display-component---Home--ObjectPageLayout-OPHeaderContent-collapseBtn").firePress();e.results.forEach(function(e){e.WEEK_DATE=g.getInMMddyyyyFormat(e.WEEK_DATE)},g);o.setData({results:e.results});var i=g.byId("idVizFrame");i.setModel(o);i.setVizProperties({plotArea:{dataLabel:{visible:false}},title:{text:e.results[1].WEEK_DATE,visible:true}});var a=g.byId("idPopOver");a.connect(i.getVizUid());sap.ui.core.BusyIndicator.hide();g.oGModel.setProperty("/tableData",e.results)}},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario")}},getInMMddyyyyFormat:function(e){if(!e){e=new Date}var t=e.getMonth()+1;var o=e.getDate();if(t<10){t="0"+t}if(o<10){o="0"+o}return e.getFullYear()+"-"+t+"-"+o},onNavPress:function(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var e=sap.ushell.Container.getService("CrossApplicationNavigation");var t=e&&e.hrefForExternal({target:{semanticObject:"vcpdocdisplay",action:"Display"}})||"";var o=window.location.href.split("#")[0]+t;sap.m.URLHelper.redirect(o,true)}}})});