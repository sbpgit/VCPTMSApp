sap.ui.define([
	"cp/exereg/cpexeregressionmdls/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("cp.exereg.cpexeregressionmdls.controller.App", {
		onInit : function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// // disable busy indication when the metadata is loaded and in case of errors
			// this.getOwnerComponent().getModel("PModel").metadataLoaded().
			// 	then(fnSetAppNotBusy);
			// this.getOwnerComponent().getModel("Pmodel").attachMetadataFailed(fnSetAppNotBusy);

			// // apply content density mode to root view
			// this.getView().addStyleClass(sap.ui.Device.system.desktop ? "sapUiSizeCompact" : "sapUiSizeCozy");
		}
	});
});