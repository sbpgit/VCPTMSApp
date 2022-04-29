/*global location*/
sap.ui.define([
	"cpapp/cpjobscheduler/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, History, MessageToast,MessageBox, Filter, FilterOperator) {
	"use strict";
	var that;

	return BaseController.extend("cpapp.cpjobscheduler.controller.CreateJob", {
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			that = this;
            // Declaring JSON Models and size limits
          this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          this.odModel = new JSONModel();
          this.ppfModel = new JSONModel();
          this.verModel = new JSONModel();
          this.scenModel = new JSONModel();

            
            this.prodModel.setSizeLimit(2000);
            this.odModel.setSizeLimit(2000);
            this.ppfModel.setSizeLimit(1000);

          // Declaring fragments
          this._oCore = sap.ui.getCore();
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }
          if (!this._valueHelpDialogOD) {
            this._valueHelpDialogOD = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.ObjDepDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogOD);
          }
          if (!this._valueHelpDialogPPF) {
            this._valueHelpDialogPPF = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.PredDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogPPF);
          }
          if (!this._valueHelpDialogVer) {
            this._valueHelpDialogVer = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.VersionDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogVer);
          }
          if (!this._valueHelpDialogScen) {
            this._valueHelpDialogScen = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.ScenarioDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogScen);
          }
          if (!this._valueHelpDialogJobDetail) {
            this._valueHelpDialogJobDetail = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.CreateJobDetails",
              this
            );
            this.getView().addDependent(this._valueHelpDialogJobDetail);
          }
		},

		onAfterRendering: function () {
            sap.ui.core.BusyIndicator.show();
            this.i18n = this.getResourceBundle();
            this.oGModel = this.getModel("oGModel");
            
  
            that._valueHelpDialogProd.setTitleAlignment("Center");
            that._valueHelpDialogLoc.setTitleAlignment("Center");
            that._valueHelpDialogOD.setTitleAlignment("Center");
            that._valueHelpDialogPPF.setTitleAlignment("Center");
            that._valueHelpDialogVer.setTitleAlignment("Center");
            that._valueHelpDialogScen.setTitleAlignment("Center");
  
            this.oProdList = this._oCore.byId(
              this._valueHelpDialogProd.getId() + "-list"
            );
            this.oLocList = this._oCore.byId(
              this._valueHelpDialogLoc.getId() + "-list"
            );
            this.oODList = this._oCore.byId(
              this._valueHelpDialogOD.getId() + "-list"
            );
            this.oPPFList = this._oCore.byId(
              this._valueHelpDialogPPF.getId() + "-list"
            );
  
            this.oVerList = this._oCore.byId(
              this._valueHelpDialogVer.getId() + "-list"
            );
  
            this.oScenList = this._oCore.byId(
              this._valueHelpDialogScen.getId() + "-list"
            );
            
            that.onJobSelect();
  
            // Calling service to get the Location data
            this.getModel("BModel").read("/getLocation", {
              success: function (oData) {
                that.locModel.setData(oData);
                that.oLocList.setModel(that.locModel);
                sap.ui.core.BusyIndicator.hide();
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
            // Calling service to get the Profiles data
            this.getModel("BModel").read("/getProfiles", {
              success: function (oData) {
                that.ppfModel.setData(oData);
                that.oPPFList.setModel(that.ppfModel);
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });

            that.byId("modelGenPanel").setVisible(true);
                that.byId("PredPanel").setVisible(false);
                that.byId("timeSeriesPanel").setVisible(false);
                that.byId("IbpPanel").setVisible(false);
                that.byId("idJobType").setSelectedKey("M");
		},

		/** 
		 * Navigates back
		 */
		onBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);
		},

        onJobSelect:function(oEvent){
            var oSelJob = that.byId("idJobType").getSelectedKey();

            if(oSelJob === "M"){
                that.byId("modelGenPanel").setVisible(true);
                that.byId("PredPanel").setVisible(false);
                that.byId("timeSeriesPanel").setVisible(false);
                that.byId("IbpPanel").setVisible(false);
            } else if(oSelJob === "P"){
                that.byId("modelGenPanel").setVisible(false);
                that.byId("PredPanel").setVisible(true);
                that.byId("timeSeriesPanel").setVisible(false);
                that.byId("IbpPanel").setVisible(false);
            } else if(oSelJob === "T"){
                that.byId("modelGenPanel").setVisible(false);
                that.byId("PredPanel").setVisible(false);
                that.byId("timeSeriesPanel").setVisible(true);
                that.byId("IbpPanel").setVisible(false);
            } else if(oSelJob === "I"){
                that.byId("modelGenPanel").setVisible(false);
                that.byId("PredPanel").setVisible(false);
                that.byId("timeSeriesPanel").setVisible(false);
                that.byId("IbpPanel").setVisible(true);
            }

            that.byId("MlocInput").setValue("");
            that.byId("MprodInput").setValue("");
            that.byId("ModInput").setValue("");
            that.byId("MpmInput").setValue("");
            
            that.byId("PlocInput").setValue("");
            that.byId("PprodInput").setValue("");
            that.byId("PodInput").setValue("");
            that.byId("Pidver").setValue("");
            that.byId("Pidscen").setValue("");

            that.byId("TprodInput").setValue("");
            that.byId("TlocInput").setValue("");

            that.byId("IlocInput").setValue("");
            that.byId("IprodInput").setValue("");
            // that.byId("").setValue("");

            // Calling function to set the id of inputs 
            that.JobType();

        },

         /**
         * This function is called when click on input box to open value help dialogs.
         * This function will open the dialogs based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            var oSelJob = that.byId("idJobType").getSelectedKey();
  
            // Location Dialog
            if (sId.includes("loc")) {
              this._valueHelpDialogLoc.open();
              // Product Dialog
            } else if (sId.includes("prod")) {
                if(that.oLoc.getValue() ){
                if(oSelJob === "M" || oSelJob === "P"){
                    sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
                    sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);
                } else if(oSelJob === "T" || oSelJob === "I"){
                    sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                    sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);                    
                }                
              this._valueHelpDialogProd.open();
            } else {
                MessageToast.show(that.i18n.getText("Select Location"));
            }
              // Object Dependency Dialog
            } else if (sId.includes("od") ) {
              if (that.oLoc.getValue() && that.oProd.getTokens().length !== 0) {
                that._valueHelpDialogOD.open();
                
              } else {
                MessageToast.show(that.i18n.getText("noLocProd"));
              }
              // Version Dialog
            } else if (sId.includes("ver")) {
              if (that.oLoc.getValue() && that.oProd.getTokens().length !== 0) {
                that._valueHelpDialogVer.open();
              } else {
                MessageToast.show(that.i18n.getText("noLocProd"));
              }
              // Scenario Dialog
            } else if (sId.includes("scen")) {
              if (
                that.oLoc.getValue() &&
                that.oProd.getTokens().length &&
                that.oVer.getValue()
              ) {
                that._valueHelpDialogScen.open();
              } else {
                MessageToast.show("Select Location, Product and Version");
              }
            } else if(sId.includes("MpmInput")){

                that._valueHelpDialogPPF.open();

            }
          },
  
          /**
           * Called when 'Close/Cancel' button in any dialog is pressed.
           * Dialogs will be closed based on sId.
           * @param {object} oEvent -the event information.
           */
          handleClose: function (oEvent) {
            var sId = oEvent.getParameter("id");
            // Location Dialog
            if (sId.includes("loc")) {
              that._oCore
                .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                .setValue("");
              if (that.oLocList.getBinding("items")) {
                that.oLocList.getBinding("items").filter([]);
              }
              // Product Dialog
            } else if (sId.includes("prod")) {
              that._oCore
                .byId(this._valueHelpDialogProd.getId() + "-searchField")
                .setValue("");
              if (that.oProdList.getBinding("items")) {
                that.oProdList.getBinding("items").filter([]);
              }
              // Object Dependency Dialog
            } else if (sId.includes("od") || sId.includes("__button1")) {
              that._oCore
                .byId(this._valueHelpDialogOD.getId() + "-searchField")
                .setValue("");
              if (that.oODList.getBinding("items")) {
                that.oODList.getBinding("items").filter([]);
              }
              // Version Dialog
            } else if (sId.includes("Ver")) {
              that._oCore
                .byId(this._valueHelpDialogVer.getId() + "-searchField")
                .setValue("");
              if (that.oVerList.getBinding("items")) {
                that.oVerList.getBinding("items").filter([]);
              }
              // Scenario Dalog
            } else if (sId.includes("scen")) {
              that._oCore
                .byId(this._valueHelpDialogScen.getId() + "-searchField")
                .setValue("");
              if (that.oScenList.getBinding("items")) {
                that.oScenList.getBinding("items").filter([]);
              }
            // Prediction Profile Dalog
        } else if (sId.includes("scen")) {
            that._oCore
              .byId(this._valueHelpDialogScen.getId() + "-searchField")
              .setValue("");
            if (that.oScenList.getBinding("items")) {
              that.oScenList.getBinding("items").filter([]);
            }
          } else if(sId.includes("ppfSlctList")){
            that._oCore
            .byId(this._valueHelpDialogPPF.getId() + "-searchField")
            .setValue("");
          if (that.oPPFList.getBinding("items")) {
            that.oPPFList.getBinding("items").filter([]);
          }
          }


          },
  
          /**
           * Called when something is entered into the search field.
           * Data will be filtered based in sId.
           * @param {object} oEvent -the event information.
           */
          handleSearch: function (oEvent) {
            var sQuery =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
              sId = oEvent.getParameter("id"),
              oFilters = [];
            // Check if search filter is to be applied
            sQuery = sQuery ? sQuery.trim() : "";
            // Location
            if (sId.includes("loc")) {
              if (sQuery !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                      new Filter(
                        "LOCATION_DESC",
                        FilterOperator.Contains,
                        sQuery
                      ),
                    ],
                    and: false,
                  })
                );
              }
              that.oLocList.getBinding("items").filter(oFilters);
              // Product
            } else if (sId.includes("prod")) {
              if (sQuery !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                      new Filter("PROD_DESC", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                  })
                );
              }
              that.oProdList.getBinding("items").filter(oFilters);
              // Object Dependency
            } else if (sId.includes("od")) {
              if (sQuery !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                      new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                      new Filter("COMPONENT", FilterOperator.Contains, sQuery),
                      new Filter("OBJ_DEP", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                  })
                );
              }
              that.oODList.getBinding("items").filter(oFilters);
              // Version
            } else if (sId.includes("ver")) {
              if (sQuery !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("VERSION", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                  })
                );
              }
              that.oVerList.getBinding("items").filter(oFilters);
              // Scenario
            } else if (sId.includes("scen")) {
              if (sQuery !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("SCENARIO", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                  })
                );
              }
              that.oScenList.getBinding("items").filter(oFilters);
              // prediction Profile
            } else if (sId.includes("ppfSlctList")) {
                if (sQuery !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("PROFILE", FilterOperator.Contains, sQuery),
                        new Filter("PRF_DESC", FilterOperator.Contains, sQuery),
                        new Filter("METHOD", FilterOperator.Contains, sQuery),
                      ],
                      and: false,
                    })
                  );
                }
                that.oPPFList.getBinding("items").filter(oFilters);
              }
          },

          JobType:function(){
            var oJobKey = that.byId("idJobType").getSelectedKey();
                if(oJobKey === "M"){
                    that.oLoc = this.byId("MlocInput");
                    that.oProd = this.byId("MprodInput");
                    that.oObjDep = this.byId("ModInput");
                    that.oPredProfile = this.byId("MpmInput");
                    that.oProd.removeAllTokens();
                    that.oObjDep.removeAllTokens();
                } else if(oJobKey === "P"){
                    that.oLoc = this.byId("PlocInput");
                    that.oProd = this.byId("PprodInput");
                    that.oObjDep = this.byId("PodInput");
                    that.oVer = this.byId("Pidver");
                    that.oScen = this.byId("Pidscen");
                    that.oProd.removeAllTokens();
                    that.oObjDep.removeAllTokens();
                } else if(oJobKey === "T"){
                    that.oLoc = this.byId("TlocInput");
                    that.oProd = this.byId("TprodInput");
                } else if(oJobKey === "I"){
                    that.oLoc = this.byId("IlocInput");
                    that.oProd = this.byId("IprodInput");
                }

          },
          
          /**
         * This function is called when selecting values in dialog box.
         * In this function tokens will be updated.
         * @param {object} oEvent -the event information.
         */
        handleSelection: function (oEvent) {
            var sId = oEvent.getParameter("id"),
              oItem = oEvent.getParameter("selectedItems"),
              aSelectedItems,
              aSelectedVer,
              aODdata = [];
              var oJobType = that.byId("idJobType").getSelectedKey();
            //  // Calling function to set the id of inputs 
            //     that.JobType();
            //Location list
            if (sId.includes("Loc")) {
                var aSelectedLoc = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedLoc[0].getTitle());
              
              if(oJobType === "M" || oJobType === "P"){
              that.oProd.removeAllTokens();
              that.oObjDep.removeAllTokens();
              this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
              this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
              }
              if(oJobType === "P"){
                  that.oVer.setValue("");
                that.oScen.setValue("");
              }
              if(oJobType === "T" || oJobType === "I"){
                var oProdItems = sap.ui.getCore().byId("prodSlctList").getItems();
                for(var i=0; i<oProdItems.length; i++){
                    if(oProdItems[i].getSelected() === true){
                        oProdItems[i].setSelected(false);
                    }
                }
              }
  
              // Calling sercive to get the Product list
              this.getModel("BModel").read("/getLocProdDet", {
                filters: [
                  new Filter(
                    "LOCATION_ID",
                    FilterOperator.EQ,
                    aSelectedLoc[0].getTitle()
                  ),
                ],
                success: function (oData) {
                    if(oJobType === "M" || oJobType === "P"){
                  if (oData.results.length > 0) {
                    oData.results.unshift({
                      PRODUCT_ID: "All",
                      PROD_DESC: "All",
                    });
                  }
                }
                  that.prodModel.setData(oData);
                  that.oProdList.setModel(that.prodModel);
                },
                error: function (oData, error) {
                  MessageToast.show("error");
                },
              });
  
              // Product list
            } else if (sId.includes("prod")) {
              var aSelectedProd;
              that.oProdList.getBinding("items").filter([]);
                 aSelectedProd = oEvent.getParameter("selectedItems");
              if (aSelectedProd && aSelectedProd.length > 0) {

                var oFilters = [];
                var sFilter = new sap.ui.model.Filter({
                  path: "LOCATION_ID",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: that.oLoc.getValue(),
                });
                oFilters.push(sFilter);
  
                for (var i = 0; i < aSelectedProd.length; i++) {
                  if (aSelectedProd[i].getTitle() !== "All") {
                    sFilter = new sap.ui.model.Filter({
                      path: "PRODUCT_ID",
                      operator: sap.ui.model.FilterOperator.EQ,
                      value1: aSelectedProd[i].getTitle(),
                    });
                    oFilters.push(sFilter);
                  }
                }

                if(oJobType === "T" || oJobType === "I"){
                    that.oProd.setValue(aSelectedProd[0].getTitle());
                }
                if(oJobType === "M" || oJobType === "P"){
                    that.oObjDep.removeAllTokens();
                    this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
                    that.oProd.removeAllTokens();
                    aSelectedProd.forEach(function (oItem) {
                        that.oProd.addToken(
                            new sap.m.Token({
                            key: oItem.getTitle(),
                            text: oItem.getTitle(),
                            })
                        );
                        });

                        // Calling service to get the Object dependency
                        this.getModel("BModel").read("/getBomOdCond", {
                            filters: oFilters,
                            success: function (oData) {
                            that.objDepData = oData.results;
                            if (that.objDepData.length > 0) {
                                that.objDepData.unshift({
                                OBJ_DEP: "All",
                                LOCATION_ID: "All",
                                PRODUCT_ID: "All",
                                });
                            }
                            that.odModel.setData(oData);
                            that.oODList.setModel(that.odModel);
                            if ( that.oProdList.getSelectedItems()[0].getTitle() === "All") {
                                that._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll();
                            }
                            
                            },
                            error: function (oData, error) {
                            MessageToast.show("error");
                            },
                        });
                    }
              
  
                // var aSelectedProd = that.oProdList.getSelectedItems();
  
                

                if(oJobType === "P"){
                    // Calling sercive to get the IBP Vaersions list
                this.getModel("BModel").read("/getIbpVerScn", {
                    filters: oFilters,
                    success: function (oData) {
                      that.verModel.setData(oData);
                      that.oVerList.setModel(that.verModel);
                    },
                    error: function (oData, error) {
                      MessageToast.show("error");
                    },
                  });
                }
  
                
              } else {
                if(oJobType === "M" || oJobType === "P"){
                that.oProd.removeAllTokens();
                }
              }
              // Object ependency
            } else if (sId.includes("od")) {
              var aSelectedODItems;
              that.oODList.getBinding("items").filter([]);
  
              aSelectedODItems = oEvent.getParameter("selectedItems");
  
              if (aSelectedODItems && aSelectedODItems.length > 0) {
                  if(oJobType === "M"){
                    if (aSelectedODItems[0].getTitle() === "All") {
                        that.byId("MidCheck").setSelected(true);
                      } else {
                        that.byId("MidCheck").setSelected(false);
                      }
                  } else if(oJobType === "P"){
                    if (aSelectedODItems[0].getTitle() === "All") {
                    that.byId("PidCheck").setSelected(true);
                    } else {
                    that.byId("PidCheck").setSelected(false);
                    }
                }
                that.oObjDep.removeAllTokens();
                aSelectedODItems.forEach(function (oItem) {
                  that.oObjDep.addToken(
                    new sap.m.Token({
                      key: oItem.getTitle(),
                      text: oItem.getTitle(),
                    })
                  );
                });
              } else {
                that.oObjDep.removeAllTokens();
                that.byId("MidCheck").setSelected(false);
                that.byId("PidCheck").setSelected(false);
              }
              // Versions List
            } else if (sId.includes("Ver")) {
              
              aSelectedVer = oEvent.getParameter("selectedItems");
              that.oVer.setValue(aSelectedVer[0].getTitle());
              that.oScen.setValue("");
  
              var aSelectedProd = that.oProdList.getSelectedItems();
  
              var oFilters = [];
              var sFilter = new sap.ui.model.Filter({
                path: "LOCATION_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: that.oLoc.getValue(),
              });
              oFilters.push(sFilter);
  
              var sFilter = new sap.ui.model.Filter({
                path: "VERSION",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: aSelectedVer[0].getTitle(),
              });
              oFilters.push(sFilter);
  
              for (var i = 0; i < aSelectedProd.length; i++) {
                if (aSelectedProd[i].getTitle() !== "All") {
                  sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: aSelectedProd[i].getTitle(),
                  });
                  oFilters.push(sFilter);
                }
              }
  
              // Calling sercive to get the IBP Scenario list
              this.getModel("BModel").read("/getIbpVerScn", {
                filters: oFilters,
                success: function (oData) {
                  that.scenModel.setData(oData);
                  that.oScenList.setModel(that.scenModel);
                },
                error: function (oData, error) {
                  MessageToast.show("error");
                },
              });
              // Scenario List
            } else if (sId.includes("scen")) {
              var aSelectedScen = oEvent.getParameter("selectedItems");
              that.oScen.setValue(aSelectedScen[0].getTitle());
            // Scenario List
        } else if (sId.includes("ppfSlctList")) {
            var aSelectedPPF = oEvent.getParameter("selectedItems");
            that.oPredProfile.setValue(aSelectedPPF[0].getTitle());
          }
            that.handleClose(oEvent);
          },


        /**
         * This function is called when click on segment button change.
         * @param {object} oEvent -the event information.
         */
        onMGSegmentChange: function (oEvent) {
            var selectedButton = that.byId("MidOdRes").getSelectedKey();
  
            if (selectedButton === "RT") {
              that.oObjDep.removeAllTokens();
              that.byId("ModInput").setPlaceholder("Restriction");
              that.byId("ModInput").setShowValueHelp(false);
            } else  if(selectedButton === "OD") {
              that.byId("ModInput").setPlaceholder("Object Dependency");
              that.byId("ModInput").setShowValueHelp(true);
            }
          },
          
          
        /**
         * This function is called when click on segment button change.
         * @param {object} oEvent -the event information.
         */
        onPSegmentChange: function (oEvent) {
            var selectedButton = that.byId("PidType").getSelectedKey();
  
            if (selectedButton === "RT") {
              that.oObjDep.removeAllTokens();
              that.byId("PodInput").setPlaceholder("Restriction");
              that.byId("PodInput").setShowValueHelp(false);
            } else if(selectedButton === "OD") {
              that.byId("PodInput").setPlaceholder("Object Dependency");
              that.byId("PodInput").setShowValueHelp(true);
            }
          },

          /**
         * This function is called when Selecting or Unselecting of a items in Product dialog.
         * @param {object} oEvent -the event information.
         */
        handleProdChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("prodSlctList").getItems();
            var oSelItems = this._valueHelpDialogProd
              .getAggregation("_dialog")
              .getContent()[1]
              .getSelectedItems();
            if (
              oSelected === "All" &&
              oEvent.getParameter("selected") &&
              aItems.length !== 1
            ) {
              this._valueHelpDialogProd
                .getAggregation("_dialog")
                .getContent()[1]
                .selectAll();
            } else if (oSelected === "All" && !oEvent.getParameter("selected")) {
              this._valueHelpDialogProd
                .getAggregation("_dialog")
                .getContent()[1]
                .removeSelections();
            } else if (oSelected === "All" && aItems.length === 1) {
              sap.ui
                .getCore()
                .byId("prodSlctList")
                .getItems()[0]
                .setSelected(false);
            } else if (
              oSelected !== "All" &&
              !oEvent.getParameter("selected") &&
              aItems.length - 1 === oSelItems.length
            ) {
              sap.ui
                .getCore()
                .byId("prodSlctList")
                .getItems()[0]
                .setSelected(false);
            } else if (
              oSelected !== "All" &&
              oEvent.getParameter("selected") &&
              aItems.length - 1 === oSelItems.length
            ) {
              sap.ui
                .getCore()
                .byId("prodSlctList")
                .getItems()[0]
                .setSelected(true);
            }
          },
  
          /**
           * This function is called when Selecting or Unselecting of a items in Obj Dep dialog.
           * @param {object} oEvent -the event information.
           */
          handleObjDepChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("odSlctList").getItems();
            var oSelItems = this._valueHelpDialogOD
              .getAggregation("_dialog")
              .getContent()[1]
              .getSelectedItems();
            if (
              oSelected === "All" &&
              oEvent.getParameter("selected") &&
              aItems.length !== 1
            ) {
              this._valueHelpDialogOD
                .getAggregation("_dialog")
                .getContent()[1]
                .selectAll();
            } else if (oSelected === "All" && !oEvent.getParameter("selected")) {
              this._valueHelpDialogOD
                .getAggregation("_dialog")
                .getContent()[1]
                .removeSelections();
            } else if (
              oSelected !== "All" &&
              !oEvent.getParameter("selected") &&
              aItems.length - 1 === oSelItems.length
            ) {
              sap.ui
                .getCore()
                .byId("odSlctList")
                .getItems()[0]
                .setSelected(false);
            } else if (
              oSelected !== "All" &&
              oEvent.getParameter("selected") &&
              aItems.length - 1 === oSelItems.length
            ) {
              sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(true);
            } else if (oSelected === "All" && aItems.length === 1) {
              sap.ui
                .getCore()
                .byId("odSlctList")
                .getItems()[0]
                .setSelected(false);
            }
          },

          onModelGen:function(){
            var cSelected = that.byId("MidCheck").getSelected();
            sap.ui.getCore().byId("idSavebt").setText("Generate Model");


            this.oModel = this.getModel("PModel");
            var aItems,
              oProdItems,
              oPredProfile,
              cSelected,
              oSelModelVer,
              oSelType,
              oPredProfile,
              i,
              regData = [],
              vFlag;
            var oEntry = {
                vcRulesList: [],
              },
              vRuleslist,
              finalList={};
              var oMdlVer = that.byId("Midmdlver").getSelectedKey(),
              vMdlVer;
            aItems = this.oODList.getSelectedItems();
            oProdItems = this.oProdList.getSelectedItems(),
              oPredProfile = that.oPredProfile.getValue(),
              cSelected = that.byId("MidCheck").getSelected();
            if (oMdlVer === "act") {
              vMdlVer = "Active";
            } else {
              vMdlVer = "Simulation";
            }
  
            if (this.oObjDep.getTokens().length > 0 && this.oPredProfile.getValue() ) {
          
                for (i = 0; i < aItems.length; i++) {
                      vRuleslist = {
                        profile: oPredProfile,
                        override: cSelected,
                        Location: aItems[i].getInfo(),
                        Product: aItems[i].getDescription(),
                        GroupID: aItems[i].getTitle(),
                        Type: "OD",
                        modelVersion: vMdlVer,
                      };
                      oEntry.vcRulesList.push(vRuleslist);
                    
                  }
            // aItems = this.oODList.getSelectedItems();
            // oProdItems = this.oProdList.getSelectedItems();
            // cSelected = that.byId("MidCheck").getSelected();
            // oSelModelVer = this.byId("Midmdlver").getSelectedKey();
            // oSelType = this.byId("MidType").getSelectedKey();
            // oPredProfile = that.byId("MpmInput").getValue();


            // if (this.oObjDep.getTokens().length > 0 && this.oVer.getValue() && this.oScen.getValue() ) {
          
            //     for (i = 0; i < aItems.length; i++) {
            //         vRuleslist = {
            //             profile: oPredProfile,
            //           override: cSelected,
            //           Location: aItems[i].getInfo(),
            //           Product: aItems[i].getDescription(),
            //           GroupID: aItems[i].getTitle(),
            //           Type: oSelType,
            //           modelVersion: oSelModelVer,
            //         };
            //         oEntry.vcRulesList.push(vRuleslist);
            //     }
                this.oGModel.setProperty("/vcrulesData", oEntry.vcRulesList);


            var sText = "Do you want to override assignments?";
                if (cSelected === true) {
                    sap.m.MessageBox.show(sText, {
                    title: "Confirmation",
                    actions: [
                        sap.m.MessageBox.Action.YES,
                        sap.m.MessageBox.Action.NO,
                    ],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                        that._valueHelpDialogJobDetail.open();
                        }
                    },
                    });
                } else {
                    that._valueHelpDialogJobDetail.open();
                }
            } else {
                MessageToast.show("Please select all fields");
            }

          },

          onPrediction:function(){
            var cSelected = that.byId("PidCheck").getSelected();
            sap.ui.getCore().byId("idSavebt").setText("Run Prediction");

            this.oModel = this.getModel("PModel");
            var aItems,
              oProdItems,
              oPredProfile,
              cSelected,
              oSelModelVer,
              oSelType,
              oSelVer,
              oSelScen,
              i,
              regData = [],
              vFlag;
            var oEntry = {
                vcRulesList: [],
              },
              vRuleslist,
              finalList={};
            aItems = this.oODList.getSelectedItems();
            oProdItems = this.oProdList.getSelectedItems();
            cSelected = that.byId("PidCheck").getSelected();
            oSelModelVer = this.byId("PidModelVer").getSelectedKey();
            oSelType = this.byId("PidType").getSelectedKey();
            oSelVer = this.oVer.getValue();
            oSelScen = this.oScen.getValue();


            if (this.oObjDep.getTokens().length > 0 && this.oVer.getValue() && this.oScen.getValue() ) {
          
                for (i = 0; i < aItems.length; i++) {
                    vRuleslist = {
                      //   profile: oPredProfile,
                      override: cSelected,
                      Location: aItems[i].getInfo(),
                      Product: aItems[i].getDescription(),
                      GroupID: aItems[i].getTitle(),
                      Type: oSelType,
                      modelVersion: oSelModelVer,
                      version: oSelVer,
                      scenario: oSelScen,
                    };
                    oEntry.vcRulesList.push(vRuleslist);
                }
                this.oGModel.setProperty("/vcrulesData", oEntry.vcRulesList);



            var sText = "Do you want to override assignments?";
                if (cSelected === true) {
                    sap.m.MessageBox.show(sText, {
                    title: "Confirmation",
                    actions: [
                        sap.m.MessageBox.Action.YES,
                        sap.m.MessageBox.Action.NO,
                    ],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                        that._valueHelpDialogJobDetail.open();
                        }
                    },
                    });
                } else {
                    that._valueHelpDialogJobDetail.open();
                }

            } else {
                MessageToast.show("Please select all fields");
            }
          },

          onRunClose:function(){
            this._oCore.byId("idname").setValue();
            this._oCore.byId("idDesc").setValue();
            this._oCore.byId("idSTime").setValue();
            this._oCore.byId("idETime").setValue();

            this._oCore.byId("idcron").setValue();
            this._oCore.byId("idSSTime").setValue();
            this._oCore.byId("idSETime").setValue();


            that._valueHelpDialogJobDetail.close();

          },


          onRunSend:function(){
            // this.oGModel = this.getModel("GModel");
            var bButton = sap.ui.getCore().byId("idSavebt").getText(),
                sName = sap.ui.getCore().byId("idname").getValue(),
                djSdate = this._oCore.byId("idSTime").getDateValue().toISOString().split("T"),
                tjStime = djSdate[1].split(":"),
                djEdate = this._oCore.byId("idETime").getDateValue().toISOString().split("T"),
                tjEtime = djEdate[1].split(":"),
                dsSDate = this._oCore.byId("idSSTime").getDateValue().toISOString().split("T"),
                tsStime = dsSDate[1].split(":"),
                dsEDate = this._oCore.byId("idSETime").getDateValue().toISOString().split("T"),
                tsEtime = dsEDate[1].split(":"),
                cron = sap.ui.getCore().byId("idcron").getValue(),



                dDate = new Date().toLocaleString().split(" "),
                // JobName = sName + "_" + dDate[0].replaceAll(",", "") + "_" + dDate[1],
                JobName = sName + new Date().getTime(),
                actionText;
                // cron = "* * * * * *%2F" + cron +  " " + "0";
                cron = "* * * *%2F" + cron +  " " + "0" +  " " + "0" +  " " + "0";

                djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";




                if(bButton.includes("Prediction")){
                    actionText= "%2Fpal%2FgenPredictions"
                } else if(bButton.includes("Model")){
                    actionText= "%2Fpal%2FgenerateModels"
                }

                var vcRuleList = this.oGModel.getProperty("/vcrulesData");

            var finalList = {
                name: JobName,
                description:sap.ui.getCore().byId("idDesc").getValue(),
                action: actionText,
                active:true,
                httpMethod: "POST",
                startTime: djSdate,
                endTime : djEdate,
                schedules:[
                    {
                        data: vcRuleList,
                        cron: cron,
                        active:true,
                        startTime: dsSDate,
                        endTime : dsEDate
                    }
                ]
            }


            that.getModel("JModel").callFunction("/laddMLJob", {
                method: "GET",
                urlParameters: {
                  jobDetails: JSON.stringify(finalList)
                    },
                success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
                // regData.push(oData.fgPredictions.values[0].vcRulesList);

                //   that.otabModel.setData({
                //     results: regData[0],
                //   });
                //   that.byId("pmdlList").setModel(that.otabModel);
                //   that.oPanel.setProperty("visible", true);
                //   vFlag = "X";
                },
                error: function (error) {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                },
              });

          }







	});
});