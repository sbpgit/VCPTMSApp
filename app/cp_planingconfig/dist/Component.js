sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpplaningconfig/model/models","sap/f/FlexibleColumnLayoutSemanticHelper","sap/f/library"],function(e,i,t,n,p){"use strict";return e.extend("cpapp.cpplaningconfig.Component",{metadata:{manifest:"json"},init:function(){var i;e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});