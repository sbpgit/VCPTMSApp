/*global location*/
sap.ui.define([
	"cpapp/cpjobscheduler/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device"
], function (BaseController, JSONModel, MessageToast, Device) {
	"use strict";
	var that;

	return BaseController.extend("cpapp.cpjobscheduler.controller.OpenJobs", {


		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			that = this;
		},

		onAfterRendering: function () {
			
			
		},

		/** 
		 * Navigates back
		 */
		navBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);
		},

		
	});
});