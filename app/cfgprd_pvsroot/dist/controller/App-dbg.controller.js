sap.ui.define([
	"cfgapp/pvsroot/cfgprdpvsroot/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("cfgapp.pvsroot.cfgprdpvsroot.controller.App", {

		onInit : function () {
            // apply content density mode to root view
            this.getView().addStyleClass(!sap.ui.Device.support.touch ? "sapUiSizeCompact" : "sapUiSizeCozy");
                    
		}
	});

});