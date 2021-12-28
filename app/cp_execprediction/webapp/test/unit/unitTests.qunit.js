/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cpexecpred./cp_execprediction/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
