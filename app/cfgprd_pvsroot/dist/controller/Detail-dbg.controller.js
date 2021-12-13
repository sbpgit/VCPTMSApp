sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "cfgapp/pvsroot/cfgprdpvsroot/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, BaseController) {
		"use strict";
        var that,oGModel;
		return BaseController.extend("cfgapp.pvsroot.cfgprdpvsroot.controller.Detail", {
			onInit: function () {
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.subscribe("cfgapp.pvsroot.cfgprdpvsroot", "addBeginPage", this.addBeginPage, this);
                this.bus.subscribe("cfgapp.pvsroot.cfgprdpvsroot", "addDetailPage", this.addDetailPage, this);
                this.bus.subscribe("nav", "toBeginPage", this.toBeginPage, this);
                this.bus.subscribe("nav", "toDetailPage", this.toDetailPage, this);
                this.bus.subscribe("nav", "backToBegin", this.backToBegin, this);
                this.bus.subscribe("nav", "expandBegin", this.expandBegin, this);
    
                this.oFlexibleColumnLayout = this.byId("fcl");
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);
                this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
            },
    
            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf com.enerpipe.shopfloor.sf_ep_shop_status.view.Details
             */
            onExit: function () {
                this.bus.unsubscribe("cfgapp.pvsroot.cfgprdpvsroot", "addBeginPage", this.addBeginPage, this);
                this.bus.unsubscribe("cfgapp.pvsroot.cfgprdpvsroot", "addDetailPage", this.addDetailPage, this);
                this.bus.unsubscribe("nav", "toBeginPage", this.toBeginPage, this);
                this.bus.unsubscribe("nav", "toDetailPage", this.toDetailPage, this);
                this.bus.unsubscribe("nav", "backToBegin", this.backToBegin, this);
            },
    
            /** 
             * Navigates to Home page
             */
            onNavBack: function () {
                this.getRouter().navTo("Home", {}, true);
                this.getModel("oGModel").setProperty("/currentNode", "");
            },
    
            /** 
             * To set the master page
             * @param {string} sChannel - Event channel
             * @param {string} sEvent - Event name
             * @param {object} oView - View to be displayed
             */
            addBeginPage: function (sChannel, sEvent, oView) {
                this.oFlexibleColumnLayout.addBeginColumnPage(oView);
            },
    
            /** 
             * Lazy loader for the mid page - only on demand (when the user clicks)
             * @param {string} sChannel - Event channel
             * @param {string} sEvent - Event name
             * @param {object} oView - View to be displayed
             */
            addDetailPage: function (sChannel, sEvent, oView) {                
                var aPages = this.oFlexibleColumnLayout.getMidColumnPages(),
                bFound = false;
                for (var i = 0; i < aPages.length; i++) {
                    if (aPages[i].getProperty("viewName") === oView.getViewName()) {
                        bFound = true;
                        break;
                    } else {
                        bFound = false;
                    }
                }
                if (!bFound) {
                    this.oFlexibleColumnLayout.addMidColumnPage(oView);
                }
            },
    
            /** 
             * To initialize master page
             * @param {string} sChannel - Event channel
             * @param {string} sEvent - Event name
             * @param {object} oView - View to be displayed
             */
            toBeginPage: function (sChannel, sEvent, oView) {
                var aPages = this.oFlexibleColumnLayout.getBeginColumnPages();
                for (var i = 0; i < aPages.length; i++) {
                    if (aPages[i].getProperty("viewName") === oView.viewName) {
                        this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[i]);
                    }
                }
            },
    
            /** 
             * To get the required detail page
             * @param {string} sChannel - Event channel
             * @param {string} sEvent - Event name
             * @param {object} oView - View to be displayed
             */
            toDetailPage: function (sChannel, sEvent, oView) {
                var aPages = this.oFlexibleColumnLayout.getMidColumnPages();
                for (var i = 0; i < aPages.length; i++) {
                    if (aPages[i].getProperty("viewName") === oView.viewName) {
                        this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[i]);
                        break;
                    }
                }
                this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
                /* Adding ItemDetail page */
			if (aPages.length < 1) {
				this.getOwnerComponent().runAsOwner(function () {
					this.detailView = sap.ui.view({
						viewName: "cfgapp.pvsroot.cfgprdpvsroot.view.NodeDetail",
						type: "XML"
					});
					this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
				}.bind(this));
			} else {
				this.oFlexibleColumnLayout.addMidColumnPage(aPages[0]);
				aPages[0].onAfterRendering();
			}
            },
    
            /** 
             * To show only the master page
             */
            backToBegin: function () {
                this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
            },
    
            /** 
             * Called when the URL matches pattern "Details"
             * @constructor 
             */
            _onPatternMatched: function () {
                // Go to Home screen if Personel no. is not available
                if (!this.getModel("oGModel").getProperty("/PARENT_NODE")) {
                    this.getRouter().navTo("Home", {}, true);
                } else {
                    this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
                    var aPages = this.oFlexibleColumnLayout.getBeginColumnPages();
                    if (aPages.length < 1) {
                        this.getOwnerComponent().runAsOwner(function () {
                            this.masterView = sap.ui.view({
                                viewName: "cfgapp.pvsroot.cfgprdpvsroot.view.NodeMaster",
                                type: "XML"
                            });
                            this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView);
                        }.bind(this));
                    } else {
                        this.oFlexibleColumnLayout.toBeginColumnPage(aPages[0]);
                        aPages[0].onAfterRendering();
                    }
                }
            },
            expandBegin: function () {
                this.bus.publish("nav", "backToBegin");
            /* Handling Ment button when we are in Item Master page  */
                if (!Device.system.desktop) {
                    this.byId("leftMenu").setVisible(false);
                    this.getModel("appView").setProperty("/expanded", true);
                }
            }
		});
	});
