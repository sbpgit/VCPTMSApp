sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cp/execpred/cpexecprediction/model/models"],function(e,i,t){"use strict";return e.extend("cp.execpred.cpexecprediction.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});