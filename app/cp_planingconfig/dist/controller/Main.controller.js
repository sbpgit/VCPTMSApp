sap.ui.define(["cpapp/cpplaningconfig/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,i,t,a,n,o,s){"use strict";var l=this;return e.extend("cpapp.cpplaningconfig.controller.Main",{onInit(){var e;l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cpapp.cpplaningconfig","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cpapp.cpplaningconfig","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Main").attachPatternMatched(this._onPatternMatched.bind(this));if(s.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var t=new i({expanded:true,midExists:false,busy:true,delay:0});this.setModel(t,"appView");if(s.support.touch){s.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!s.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,i,t){this.oFlexibleColumnLayout.addBeginColumnPage(t)},addDetailPage:function(e,i,t){var a=this.oFlexibleColumnLayout.getMidColumnPages(),n=false;for(var o=0;o<a.length;o++){if(a[o].getProperty("viewName")===t.getViewName()){n=true;break}else{n=false}}if(!n){this.oFlexibleColumnLayout.addMidColumnPage(t)}},toBeginPage:function(e,i,t){var a=this.oFlexibleColumnLayout.getBeginColumnPages();for(var n=0;n<a.length;n++){if(a[n].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[n]);break}}},toDetailPage:function(e,i,t){var a=this.oFlexibleColumnLayout.getMidColumnPages();for(var n=0;n<a.length;n++){if(a[n].getProperty("viewName")===t.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[n]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(a.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cpapp.cpplaningconfig.view.Home",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(a[0]);a[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cpapp.cpplaningconfig.view.Master",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!s.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}},onExit:function(){this.bus.unsubscribe("cpapp.cpplaningconfig","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cpapp.cpplaningconfig","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)}})});