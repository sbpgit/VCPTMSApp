sap.ui.define(["cp/appf/cpbomod/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,o,t,s,r,n,a,l){"use strict";var i,d;return e.extend("cp.appf.cpbomod.controller.ItemDetail",{onInit:function(){i=this;this.bus=sap.ui.getCore().getEventBus();i.oCharModel=new s;d=i.getOwnerComponent().getModel("oGModel")},onAfterRendering:function(){d=i.getOwnerComponent().getModel("oGModel");var e=d.getProperty("/className");this.getModel("BModel").read("/getBomOdCond",{filters:[new r("LOCATION_ID",n.EQ,""),new r("PRODUCT_ID",n.EQ,"")],success:function(e){i.oCharModel.setData({results:e.results});i.byId("charList").setModel(i.oCharModel)},error:function(){o.show("Failed to get data")}})}})});