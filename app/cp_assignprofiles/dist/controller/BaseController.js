sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cp.appf.cpassignprofiles.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});