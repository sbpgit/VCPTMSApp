sap.ui.define(["sap/ui/core/mvc/Controller","cpapp/cpnewprodintro/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,o,r,s,a,i){"use strict";var n,l;return t.extend("cpapp.cpnewprodintro.controller.Home",{onInit:function(){l=this;l.ProdListModel=new o;l.charModel=new o;l.ProdListModel.setSizeLimit(1e3);l.charModel.setSizeLimit(1e3)},onAfterRendering:function(){l.oList=this.byId("ProdList");l.getData()},getData:function(){sap.ui.core.BusyIndicator.show();this.getModel("BModel").read("/genNewProd",{success:function(e){sap.ui.core.BusyIndicator.hide();l.ProdListModel.setData(e);l.oList.setModel(l.ProdListModel)},error:function(e,t){sap.ui.core.BusyIndicator.hide();a.show("error")}})},onCreate:function(e){n=this.getModel("oGModel");n.setProperty("/sFlag","");if(e.getSource().getTooltip().includes("Create")){n.setProperty("/sFlag","C");var t=sap.ui.core.UIComponent.getRouterFor(l);t.navTo("Detail",{},true)}else{if(this.byId("ProdList").getSelectedItems().length){var o=this.byId("ProdList").getSelectedItem().getCells();n.setProperty("/Loc",o[0].getText());n.setProperty("/Prod",o[1].getText());n.setProperty("/refProd",o[2].getText());n.setProperty("/sFlag","E");var t=sap.ui.core.UIComponent.getRouterFor(l);t.navTo("Detail",{},true)}else{a.show("Select product to update")}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),o=e.getParameter("id"),a=[];t=t?t.trim():"";if(o.includes("idSearch")){if(t!==""){a.push(new r({filters:[new r("LOCATION_ID",s.Contains,t),new r("REF_PRODID",s.Contains,t),new r("PRODUCT_ID",s.Contains,t)],and:false}))}l.oList.getBinding("items").filter(a)}},onProdeDel:function(e){var t=e.getSource().getParent().getCells();var o=t[0].getText(),r=t[1].getText(),s=t[2].getText();var i="Do you want to delete the selected product"+" - "+r+" - "+"Please confirm";sap.m.MessageBox.show(i,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();l.getModel("BModel").callFunction("/maintainNewProd",{method:"GET",urlParameters:{LOCATION_ID:o,REF_PRODID:s,PRODUCT_ID:r,FLAG:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();a.show("Product deleted successfully");l.onAfterRendering()},error:function(){sap.ui.core.BusyIndicator.hide();a.show("Failed to delete product")}})}}})},onCharDetails:function(e){var t=e.getSource().getParent().getCells()[1].getText();var o=e.getSource().getParent().getCells()[2].getText();if(!l._onCharDetails){l._onCharDetails=sap.ui.xmlfragment("cpapp.cpnewprodintro.view.CharDetails",l);l.getView().addDependent(l._onCharDetails)}l._onCharDetails.setTitleAlignment("Center");l.CharDetailList=sap.ui.getCore().byId("idCharDetail");this.getModel("BModel").read("/getNewProdChar",{filters:[new r("REF_PRODID",s.EQ,o),new r("PRODUCT_ID",s.EQ,t)],success:function(e){l.charModel.setData({results:e.results});l.CharDetailList.setModel(l.charModel);l._onCharDetails.open()},error:function(){a.show("Failed to get data")}})},onCharClose:function(){l._onCharDetails.close()}})});