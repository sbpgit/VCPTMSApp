/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cfgapppvsroot./cfgprd_pvsroot/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
