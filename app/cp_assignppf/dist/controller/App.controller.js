sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cp.appf.cpassignppf.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});