sap.ui.define([
], function () {
	"use strict";
	return {

		getStatus: function (sValue) {
			var sText = "";
			if (sValue === "X") {
				sText = "sap-icon://decline";
			} else {
				sText = "";
			}
			return sText;

		},
		Button: function (sNode) {
			if (sNode === "T") {
				return new sap.m.CheckBox();
			} else {
				return new sap.m.RadioButton();
			}

		}

	};
});
