sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","cfgapp/pvsroot/cfgprdpvsroot/controller/BaseController"],function(t,e,o){"use strict";var i,s;return o.extend("cfgapp.pvsroot.cfgprdpvsroot.controller.Home",{onInit:function(){this.oListModel=new e;this.getRouter().getRoute("Home").attachPatternMatched(this._onObjectMatched,this)},onAfterRendering:function(){i=this;s=this.getModel("oGModel")},_onObjectMatched:function(){i=this;s=this.getModel("oGModel");this.i18n=this.getResourceBundle();this.oList=this.byId("idList");this.oList.setModel(i.oListModel);this.oList.removeSelections();if(this.oList.getBinding("items")){this.oList.getBinding("items").filter([])}i.getData();this.oList.attachEvent("updateFinished",function(){}.bind(i))},getData:function(){i=this;var t=this.getModel("sModel");t.callFunction("/fGetNodeDet",{method:"GET",urlParameters:{NODE_TYPE:"AN",CHILD_NODE:"1",PARENT_NODE:" "},success:function(t){i.oListModel.setData({results:t.results})},error:function(t){MessageToast.show(i.i18n.getText("getListErr"))}})},handleItemSelction:function(t){var e=t.getSource().getSelectedItem().getCells()[0].getTitle();s.setProperty("/PARENT_NODE",e)}})});