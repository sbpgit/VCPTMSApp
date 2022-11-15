sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageToast"], function(ControllerExtension, MessageToast) {
    "use strict";
    return ControllerExtension.extend("cpapp.cpprodlocline.MyListReportExt",{
        onHelpPress : function(oEvent) {
MessageToast.show("Hllo");
        } 
    });
  });