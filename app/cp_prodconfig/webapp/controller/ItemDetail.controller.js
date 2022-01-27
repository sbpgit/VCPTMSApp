sap.ui.define([
	"cp/appf/cpprodconfig/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/ui/core/Fragment"
], function (BaseController, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Device,  Fragment) {
	"use strict";
	var that, oGModel;
	return BaseController.extend("cp.appf.cpprodconfig.controller.ItemDetail", {
		onInit: function () {
			that = this;
			// this.DetailHome = DetailHome;
			this.bus = sap.ui.getCore().getEventBus();
			that.oModel = new JSONModel();
			that.oWOModel = new JSONModel();
			that.oExtsModel = new JSONModel();
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {



        }

	});

});