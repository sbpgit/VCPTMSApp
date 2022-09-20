sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/viz/ui5/data/FlattenedDataset","sap/viz/ui5/controls/common/feeds/FeedItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox","sap/m/Panel","sap/viz/ui5/controls/VizFrame","sap/viz/ui5/data/Dataset"],function(e,t,o,i,s,l,a,r,d,n,c){"use strict";var u,p,g,h=0;return e.extend("cpapp.cpcharqtygraph.controller.Home",{onInit:function(){g=this;g.TableModel=new t;g.locModel=new t;g.prodModel=new t;g.verModel=new t;g.scenModel=new t;g.dateJSON=new t;g.oNewModel=new t;this.PanelContent=g.byId("idVizFrame");g.TableModel.setSizeLimit(1e3);g.locModel.setSizeLimit(1e3);g.prodModel.setSizeLimit(1e3);g.verModel.setSizeLimit(1e3);g.scenModel.setSizeLimit(1e3);p=new t;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._valueHelpDialogVer){this._valueHelpDialogVer=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.VersionDialog",this);this.getView().addDependent(this._valueHelpDialogVer)}if(!this._valueHelpDialogScen){this._valueHelpDialogScen=sap.ui.xmlfragment("cpapp.cpcharqtygraph.view.ScenarioDialog",this);this.getView().addDependent(this._valueHelpDialogScen)}},onAfterRendering:function(){g.oList=this.byId("idTab");this.oLoc=this.byId("idloc");this.oProd=this.byId("idprod");this.oVer=this.byId("idver");this.oScen=this.byId("idscen");this.oModVer=this.byId("idComboBox");this.oDate=this.byId("fromDate");g.aOrder=[];g.aSelOrder=[];var e=[];g._valueHelpDialogProd.setTitleAlignment("Center");g._valueHelpDialogLoc.setTitleAlignment("Center");g._valueHelpDialogVer.setTitleAlignment("Center");g._valueHelpDialogScen.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oVerList=this._oCore.byId(this._valueHelpDialogVer.getId()+"-list");this.oScenList=this._oCore.byId(this._valueHelpDialogScen.getId()+"-list");sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getLocation",{success:function(e){g.locModel.setData(e);g.oLocList.setModel(g.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},onResetDate:function(){g.oLoc.setValue("");g.oProd.setValue("");g.oVer.setValue("");g.oScen.setValue("");this.oModVer.setSelectedKey("Active");g.byId("idObjectPageSub").setVisible(false);this.oDate=this.byId("fromDate");this.oDate.setSelectedKey("")},handleValueHelp:function(e){var o=e.getParameter("id");if(o.includes("loc")){g._valueHelpDialogLoc.open();var i=new t;i.setData([]);var s=g.byId("idVizFrame");s.setModel(i);g.byId("idObjectPageSub").setVisible(false);g.byId("idSplitter").setVisible(false);g.byId("fromDate").setEditable(false);g.byId("fromDate").setSelectedKey("")}else if(o.includes("prod")){if(g.byId("idloc").getValue()){g._valueHelpDialogProd.open()}else{a.show("Select Location")}}else if(o.includes("ver")){if(g.byId("idloc").getValue()&&g.byId("idprod").getValue()){g._valueHelpDialogVer.open()}else{a.show("Select Location and Product")}}else if(o.includes("scen")){if(g.byId("idloc").getValue()&&g.byId("idprod").getValue()&&g.byId("idver").getValue()){g._valueHelpDialogScen.open()}else{a.show("Select Location/Product/Version")}}},handleSelection:function(e){g.oGModel=g.getOwnerComponent().getModel("oGModel");var o=e.getParameter("id"),i=e.getParameter("selectedItems"),r,d=[];if(o.includes("Loc")){g.oLoc=g.byId("idloc");g.oProd=g.byId("idprod");r=e.getParameter("selectedItems");g.oLoc.setValue(r[0].getTitle());g.oGModel.setProperty("/SelectedLoc",r[0].getTitle());g.oProd.setValue("");g.oVer.setValue("");g.oScen.setValue("");g.oGModel.setProperty("/SelectedProd","");this.getView().getModel("oModel").callFunction("/getAllProd",{method:"GET",urlParameters:{LOCATION_ID:g.oLoc.getValue()},success:function(e){g.prodModel.setData(e);g.oProdList.setModel(g.prodModel)},error:function(e,t){a.show("error")}})}else if(o.includes("prod")){g.oProd=g.byId("idprod");r=e.getParameter("selectedItems");g.oProd.setValue(r[0].getTitle());g.oGModel.setProperty("/SelectedProd",r[0].getTitle());g.oVer.setValue("");g.oScen.setValue("");this.getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:g.oGModel.getProperty("/SelectedLoc"),PRODUCT_ID:r[0].getTitle()},success:function(e){if(e.results.length===0){sap.m.MessageToast.show("No versions available for choosen Location/Product. Please choose another.");g.verModel.setData([]);g.oVerList.setModel(g.verModel);g.byId("fromDate").setEditable(false)}else{function t(e,t){var o=new Set;return e.filter(e=>!o.has(e[t])&&o.add(e[t]))}g.verModel.setData({results:t(e.results,"VERSION")});g.oVerList.setModel(g.verModel)}},error:function(e,t){a.show("error")}})}else if(o.includes("Ver")){this.oVer=g.byId("idver");r=e.getParameter("selectedItems");g.oVer.setValue(r[0].getTitle());g.oScen.setValue("");g.oGModel.setProperty("/SelectedVer",r[0].getTitle());this.getModel("oModel").callFunction("/getAllVerScen",{method:"GET",urlParameters:{LOCATION_ID:g.oGModel.getProperty("/SelectedLoc"),PRODUCT_ID:r[0].getTitle(),VERSION:r[0].getTitle()},success:function(e){function t(e,t){var o=new Set;return e.filter(e=>!o.has(e[t])&&o.add(e[t]))}g.scenModel.setData({results:t(e.results,"SCENARIO")});g.oScenList.setModel(g.scenModel)},error:function(e,t){a.show("error")}})}else if(o.includes("scen")){this.oScen=g.byId("idscen");r=e.getParameter("selectedItems");g.oScen.setValue(r[0].getTitle());g.oGModel.setProperty("/SelectedScen",r[0].getTitle());g.getView().getModel("oModel").read("/getCIRCharRate",{filters:[new s("LOCATION_ID",l.EQ,g.oGModel.getProperty("/SelectedLoc")),new s("PRODUCT_ID",l.EQ,g.oGModel.getProperty("/SelectedProd")),new s("VERSION",l.EQ,g.oGModel.getProperty("/SelectedVer")),new s("SCENARIO",l.EQ,g.oGModel.getProperty("/SelectedScen"))],success:function(e){if(e.results.length===0){g.oDateModel=new t;g.oDateModel.setData([]);g.byId("fromDate").setModel(g.oDateModel);sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("No dates available for the selected criteria.");g.byId("fromDate").setEditable(false)}else{sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.WEEK_DATE=g.getInMMddyyyyFormat(e.WEEK_DATE)},g);for(var o=0;o<e.results.length;o++){if(g.aOrder.indexOf(e.results[o].WEEK_DATE)===-1){g.aOrder.push(e.results[o].WEEK_DATE);if(e.results[o].WEEK_DATE!==""){g.oOrdData={WEEK_DATE:e.results[o].WEEK_DATE};g.aSelOrder.push(g.oOrdData)}}}g.oDateModel=new t;g.oDateModel.setData({resultsCombos:g.aSelOrder});g.byId("fromDate").setModel(g.oDateModel);g.byId("fromDate").setEditable(true)}},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})}g.handleClose(e)},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),i=[];t=t?t.trim():"";if(o.includes("Loc")){if(t!==""){i.push(new s({filters:[new s("LOCATION_ID",l.Contains,t),new s("LOCATION_DESC",l.Contains,t)],and:false}))}g.oLocList.getBinding("items").filter(i)}else if(o.includes("prod")){if(t!==""){i.push(new s({filters:[new s("PRODUCT_ID",l.Contains,t),new s("PROD_DESC",l.Contains,t)],and:false}))}g.oProdList.getBinding("items").filter(i)}else if(o.includes("Ver")){if(t!==""){i.push(new s({filters:[new s("VERSION",l.Contains,t)],and:false}))}g.oVerList.getBinding("items").filter(i)}else if(o.includes("scen")){if(t!==""){i.push(new s({filters:[new s("SCENARIO",l.Contains,t)],and:false}))}g.oScenList.getBinding("items").filter(i)}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("Loc")){g._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(g.oLocList.getBinding("items")){g.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){g._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(g.oProdList.getBinding("items")){g.oProdList.getBinding("items").filter([])}}else if(t.includes("Ver")){g._oCore.byId(this._valueHelpDialogVer.getId()+"-searchField").setValue("");if(g.oVerList.getBinding("items")){g.oVerList.getBinding("items").filter([])}}else if(t.includes("scen")){g._oCore.byId(this._valueHelpDialogScen.getId()+"-searchField").setValue("");if(g.oScenList.getBinding("items")){g.oScenList.getBinding("items").filter([])}}},onGetData:function(e){var o=g.byId("idloc").getValue(),i=g.byId("idprod").getValue(),s=g.byId("idver").getValue(),l=g.byId("idComboBox").getSelectedKey(),a=g.byId("fromDate").getValue(),r=g.byId("idscen").getValue();g.oGModel=g.getOwnerComponent().getModel("oGModel");var d=[];var n=new Date;n.setDate(n.getDate()-(n.getDay()+6)%7);if(o!==""&&i!==""&&s!==""&&r!==""){var c=new sap.ui.model.Filter({path:"LOCATION_ID",operator:sap.ui.model.FilterOperator.EQ,value1:o});d.push(c);var c=new sap.ui.model.Filter({path:"PRODUCT_ID",operator:sap.ui.model.FilterOperator.EQ,value1:i});d.push(c);if(s){var c=new sap.ui.model.Filter({path:"VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:s});d.push(c)}if(l){var c=new sap.ui.model.Filter({path:"MODEL_VERSION",operator:sap.ui.model.FilterOperator.EQ,value1:l});d.push(c)}if(r){var c=new sap.ui.model.Filter({path:"SCENARIO",operator:sap.ui.model.FilterOperator.EQ,value1:r});d.push(c)}if(a===""){var c=new sap.ui.model.Filter({path:"WEEK_DATE",operator:sap.ui.model.FilterOperator.EQ,value1:n});d.push(c)}else{var c=new sap.ui.model.Filter({path:"WEEK_DATE",operator:sap.ui.model.FilterOperator.EQ,value1:a});d.push(c)}sap.ui.core.BusyIndicator.show();this.getView().getModel("oModel").read("/getCIRCharRate",{filters:d,success:function(e){var o=new t;sap.ui.core.BusyIndicator.hide();if(e.results.length===0){n=g.getInMMddyyyyFormat(n);sap.m.MessageToast.show("No data available for "+n+"");o.setData([]);var i=g.byId("idVizFrame");i.setModel(o)}else{e.results.forEach(function(e){e.WEEK_DATE=g.getInMMddyyyyFormat(e.WEEK_DATE)},g);o.setData({results:e.results});var i=g.byId("idVizFrame");i.setModel(o);i.setVizProperties({plotArea:{dataLabel:{visible:false}},title:{text:e.results[1].WEEK_DATE,visible:true}});g.byId("idObjectPageSub").setVisible(true);var s=g.byId("idPopOver");s.connect(i.getVizUid());g.byId("idSplitter").setVisible(true);sap.ui.core.BusyIndicator.hide();g.oGModel.setProperty("/tableData",e.results)}},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Error While fetching data")}})}else{sap.m.MessageToast.show("Please select a Location/Product/Version/Scenario")}},getInMMddyyyyFormat:function(e){if(!e){e=new Date}var t=e.getMonth()+1;var o=e.getDate();if(t<10){t="0"+t}if(o<10){o="0"+o}return e.getFullYear()+"-"+t+"-"+o}})});