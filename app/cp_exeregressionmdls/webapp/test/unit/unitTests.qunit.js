/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cpexereg./cp_exeregressionmdls/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
