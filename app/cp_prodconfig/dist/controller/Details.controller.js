sap.ui.define(["cp/appf/cpprodconfig/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,i,t,o,a,s,n){"use strict";var l,u;return e.extend("cp.appf.cpprodconfig.controller.Details",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cp.appf.cpprodconfig","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cp.appf.cpprodconfig","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Details").attachPatternMatched(this._onPatternMatched.bind(this));if(n.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var e=new i({expanded:true,midExists:false,busy:true,delay:0});this.setModel(e,"appView");if(n.support.touch){n.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onExit:function(){this.bus.unsubscribe("cp.appf.cpprodconfig","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cp.appf.cpprodconfig","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!n.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,i,t){this.oFlexibleColumnLayout.addBeginColumnPage(t)},addDetailPage:function(e,i,t){var o=this.oFlexibleColumnLayout.getMidColumnPages(),a=false;for(var s=0;s<o.length;s++){if(o[s].getProperty("viewName")===t.getViewName()){a=true;break}else{a=false}}if(!a){this.oFlexibleColumnLayout.addMidColumnPage(t)}},toBeginPage:function(e,i,t){var o=this.oFlexibleColumnLayout.getBeginColumnPages();for(var a=0;a<o.length;a++){if(o[a].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[a]);break}}},toDetailPage:function(e,i,t){var o=this.oFlexibleColumnLayout.getMidColumnPages();for(var a=0;a<o.length;a++){if(o[a].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[a]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(o.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cp.appf.cpprodconfig.view.ItemDetail",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(o[0]);o[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cp.appf.cpprodconfig.view.ItemMaster",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!n.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}}})});