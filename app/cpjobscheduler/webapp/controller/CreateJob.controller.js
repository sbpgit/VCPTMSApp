/*global location*/
sap.ui.define([
	"cpapp/cpjobscheduler/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/model/Filter" ,
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
          this.custModel = new JSONModel();
          this.classModel = new JSONModel();

            
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
          if (!this._valueHelpDialogCustDetails) {
            this._valueHelpDialogCustDetails = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.CustomerDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogCustDetails);
          }
          if (!this._valueHelpDialogClassDetails) {
            this._valueHelpDialogClassDetails = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.ClassDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogClassDetails);
          }
		},

		onAfterRendering: function () {
            sap.ui.core.BusyIndicator.show();
            this.i18n = this.getResourceBundle();
            this.oGModel = this.getModel("oGModel");
            // if(that.oGModel.getProperty("/UpdateSch") === "X"){
            //     that.oGModel.setProperty("/Flag", "X");
            // } else {
            //     that.oGModel.setProperty("/Flag", "");
            // }
            that.oGModel.setProperty("/Flag", "");
  
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

            this.oCustList = this._oCore.byId(
                this._valueHelpDialogCustDetails.getId() + "-list"
            );

            this.oClassList = this._oCore.byId(
                this._valueHelpDialogClassDetails.getId() + "-list"
              );
            
            that.onJobSelect();
  
            // Calling service to get the Location data
            this.getModel("BModel").read("/getLocation", {
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                that.locModel.setData(oData);
                that.oLocList.setModel(that.locModel);
                that.oProd.removeAllTokens();
                
              },
              error: function (oData, error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("error");
              },
            });
            // Calling service to get the Profiles data
            this.getModel("BModel").read("/getProfiles", {
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                that.ppfModel.setData(oData);
                that.oPPFList.setModel(that.ppfModel);
              },
              error: function (oData, error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("error");
              },
            });

                if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
                 var key = that.oGModel.getProperty("/JobType");
                    that.byId("idJobType").setSelectedKey(key);
                    if(key === "M"){
                        that.byId("modelGenPanel").setVisible(true);
                        that.byId("PredPanel").setVisible(false);
                        that.byId("timeSeriesPanel").setVisible(false);
                        that.byId("IbpPanel").setVisible(false);
                    } else if(key === "P"){
                        that.byId("modelGenPanel").setVisible(false);
                        that.byId("PredPanel").setVisible(true);
                        that.byId("timeSeriesPanel").setVisible(false);
                        that.byId("IbpPanel").setVisible(false);
                    } else if(key === "T"){
                        that.byId("modelGenPanel").setVisible(false);
                        that.byId("PredPanel").setVisible(false);
                        that.byId("timeSeriesPanel").setVisible(true);
                        that.byId("IbpPanel").setVisible(false);
                    } else if(key === "I"){
                        that.byId("modelGenPanel").setVisible(false);
                        that.byId("PredPanel").setVisible(false);
                        that.byId("timeSeriesPanel").setVisible(false);
                        that.byId("IbpPanel").setVisible(true);
                    }
                    

                    if(that.oGModel.getProperty("/UpdateSch")=== "X"){
                        sap.ui.getCore().byId("idJobSchtype").setEnabled(false);
                    var keyType = that.oGModel.getProperty("/aScheUpdate").type;

                        if(keyType === "one-time"){
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Im")
                            sap.ui.getCore().byId("idSchTime").setVisible(true);
                            sap.ui.getCore().byId("idCronValues").setVisible(false);
                            sap.ui.getCore().byId("idSchTime").setDateValue();
                        } else if(keyType === "recurring"){
                            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr")
                            sap.ui.getCore().byId("idSchTime").setVisible(false);
                            sap.ui.getCore().byId("idCronValues").setVisible(true);
                        }

                        that.onScheduleUpdate();
                    } else {
                    sap.ui.getCore().byId("idJobSchtype").setEnabled(true);
                    }                    

                    } else {
                        sap.ui.getCore().byId("idname").setEditable(true);
                        sap.ui.getCore().byId("idDesc").setEditable(true);
                        sap.ui.getCore().byId("idActive").setEditable(true);
                        sap.ui.getCore().byId("idSTime").setEnabled(true);
                        sap.ui.getCore().byId("idETime").setEnabled(true);
                        that.byId("modelGenPanel").setVisible(true);
                        that.byId("PredPanel").setVisible(false);
                        that.byId("timeSeriesPanel").setVisible(false);
                        that.byId("IbpPanel").setVisible(false);
                        that.byId("idJobType").setSelectedKey("M");
                        sap.ui.getCore().byId("idJobSchtype").setEnabled(true);
                    }
		},

		/** 
		 * Navigates back
		 */
		onBack: function () {
            that.oGModel.setProperty("/newSch", "");
            that.oGModel.setProperty("/UpdateSch", "");
            that.oGModel.setProperty("/JobType", "");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);
		},

        onJobSelect:function(oEvent){
            var oSelJob ;
            if(that.oGModel.getProperty("/newSch")=== "X"){
                oSelJob = that.oGModel.getProperty("/JobType");
                that.byId("idJobType").setSelectedKey(oSelJob);
                MessageToast.show("you cannot select other Job type when you creating schedule for existing job");
            } else if(that.oGModel.getProperty("/UpdateSch")=== "X"){
                oSelJob = that.oGModel.getProperty("/JobType");
                that.byId("idJobType").setSelectedKey(oSelJob);
                MessageToast.show("you cannot select other Job type when you creating schedule for existing job");
                
                
            } else {
             oSelJob = that.byId("idJobType").getSelectedKey();

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
                if(that.oGModel.getProperty("/newSch")!== "X" && that.oGModel.getProperty("/UpdateSch")!== "X"){
                    that.byId("idIBPselect").setSelectedKey("I");
                    that.byId("idIBPDemand").setSelected(true);
                }

                that.onIBPSelect();
            }

            this.oGModel.setProperty("/JobDdesc", that.byId("idJobType").getSelectedItem().getText());

        }
        if(that.oGModel.getProperty("/UpdateSch") !== "X"){
            that.byId("MlocInput").setValue("");
            // that.byId("MprodInput").setValue("");
            that.byId("MprodInput").removeAllTokens();
            // that.byId("ModInput").setValue("");
            that.byId("MpmInput").setValue("");
            
            that.byId("PlocInput").setValue("");
            // that.byId("PprodInput").setValue("");
            that.byId("PprodInput").removeAllTokens();
            // that.byId("PodInput").setValue("");
            that.byId("Pidver").setValue("");
            that.byId("Pidscen").setValue("");

            that.byId("TprodInput").setValue("");
            // that.byId("TprodInput").removeAllTokens();
            that.byId("TlocInput").setValue("");

            that.byId("IlocInput").setValue("");
            // that.byId("IprodInput").setValue("");
            that.byId("IprodInput").removeAllTokens();
            that.byId("Iidver").setValue("");
            that.byId("Iidscen").setValue("");

            that.byId("EPlocInput").setValue("");

            that.byId("IBPclassInput").setValue("");

            that.byId("ESHlocInput").setValue("");
            // that.byId("ESHprodInput").setValue("");
            that.byId("ESHprodInput").removeAllTokens();
            that.byId("ECust").setValue("");

        }

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
                if(that.oGModel.getProperty("/UpdateSch") === "X" && that.oGModel.getProperty("/Flag") === "" ){
                    that.getProducts();
                    that._valueHelpDialogProd.open();
                
                } else {
                    if(oSelJob === "M" || oSelJob === "P"){
                        sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
                        sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);
                    } else if(oSelJob === "T" || oSelJob === "I"){
                        sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                        sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);                    
                    }                
                            this._valueHelpDialogProd.open();
                }
                } else {
                        MessageToast.show(that.i18n.getText("Select Location"));
                }
                // Object Dependency Dialog
                // } else if (sId.includes("od") ) {
                //   if (that.oLoc.getValue() && that.oProd.getTokens().length !== 0) {
                //     that._valueHelpDialogOD.open();
                    
                //   } else {
                //     MessageToast.show(that.i18n.getText("noLocProd"));
                //   }
                // Version Dialog
            } else if (sId.includes("ver")) {
              if (that.oLoc.getValue() && (that.oProd.getTokens().length !== 0 || that.oProd.getValue() ) ) {

                if(that.oGModel.getProperty("/UpdateSch") === "X" && that.oGModel.getProperty("/Flag") === ""){
                    that.getVersion();
                  that._valueHelpDialogVer.open();

                } else {
                    that._valueHelpDialogVer.open();
                }
              } else {
                MessageToast.show(that.i18n.getText("noLocProd"));
              }
              // Scenario Dialog
            } else if (sId.includes("scen")) {
              if (that.oLoc.getValue() &&(that.oProd.getTokens().length !== 0 || that.oProd.getValue() ) &&that.oVer.getValue()) {
                
                if(that.oGModel.getProperty("/UpdateSch") === "X" && that.oGModel.getProperty("/Flag") === ""){
                    that.getScenario();
                  that._valueHelpDialogScen.open();

                } else {
                    that._valueHelpDialogScen.open();
                }
                
              } else {
                MessageToast.show("Select Location, Product and Version");
              }
            } else if(sId.includes("MpmInput")){

                that._valueHelpDialogPPF.open();

            } else if(sId.includes("ECust")){
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Customer data
            this.getModel("BModel").read("/getCustgroup", {
                success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  that.custModel.setData(oData);
                  that.oCustList.setModel(that.custModel);
                },
                error: function (oData, error) {
                  sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("error");
                },
              });

                that._valueHelpDialogCustDetails.open();
            } else if(sId.includes("classInput")){
                sap.ui.core.BusyIndicator.show();
              // Calling service to get the Customer data
            this.getModel("BModel").read("/getClass", {
                success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  that.classModel.setData(oData);
                  that.oClassList.setModel(that.classModel);
                },
                error: function (oData, error) {
                  sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("error");
                },
              });

                that._valueHelpDialogClassDetails.open();
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
            //   // Object Dependency Dialog
            // } else if (sId.includes("od") || sId.includes("__button1")) {
            //   that._oCore
            //     .byId(this._valueHelpDialogOD.getId() + "-searchField")
            //     .setValue("");
            //   if (that.oODList.getBinding("items")) {
            //     that.oODList.getBinding("items").filter([]);
            //   }
            //   // Version Dialog
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
          } else if(sId.includes("ppfSlctList")){
            that._oCore
            .byId(this._valueHelpDialogPPF.getId() + "-searchField")
            .setValue("");
          if (that.oPPFList.getBinding("items")) {
            that.oPPFList.getBinding("items").filter([]);
          }
          }  else if(sId.includes("ECust")){
            that._oCore
            .byId(this._valueHelpDialogCustDetails.getId() + "-searchField")
            .setValue("");
          if (that.oCustList.getBinding("items")) {
            that.oCustList.getBinding("items").filter([]);
          }
        } else if(sId.includes("classInput")){
            that._oCore
            .byId(this._valueHelpDialogClassDetails.getId() + "-searchField")
            .setValue("");
          if (that.oClassList.getBinding("items")) {
            that.oClassList.getBinding("items").filter([]);
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
            //   // Object Dependency
            // } else if (sId.includes("od")) {
            //   if (sQuery !== "") {
            //     oFilters.push(
            //       new Filter({
            //         filters: [
            //           new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
            //           new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
            //           new Filter("COMPONENT", FilterOperator.Contains, sQuery),
            //           new Filter("OBJ_DEP", FilterOperator.Contains, sQuery),
            //         ],
            //         and: false,
            //       })
            //     );
            //   }
            //   that.oODList.getBinding("items").filter(oFilters);
            //   // Version
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
              // Customer
            } else if (sId.includes("CustSlctList")) {
                if (sQuery !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("CUSTOMER_GROUP", FilterOperator.Contains, sQuery),
                        new Filter("CUSTOMER_DESC", FilterOperator.Contains, sQuery),
                      ],
                      and: false,
                    })
                  );
                }
                that.oCustList.getBinding("items").filter(oFilters);
             // Customer
            } else if (sId.includes("ClassSlctList")) {
                if (sQuery !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                        new Filter("CLASS_NUM", FilterOperator.Contains, sQuery),
                      ],
                      and: false,
                    })
                  );
                }
                that.oClassList.getBinding("items").filter(oFilters);
              }
          },

          JobType:function(){
            var oJobKey = that.byId("idJobType").getSelectedKey();
                if(oJobKey === "M"){
                    that.oLoc = this.byId("MlocInput");
                    that.oProd = this.byId("MprodInput");
                    // that.oObjDep = this.byId("ModInput");
                    that.oPredProfile = this.byId("MpmInput");
                    // that.oProd.removeAllTokens();5
                    // that.oObjDep.removeAllTokens();
                } else if(oJobKey === "P"){
                    that.oLoc = this.byId("PlocInput");
                    that.oProd = this.byId("PprodInput");
                    // that.oObjDep = this.byId("PodInput");
                    that.oVer = this.byId("Pidver");
                    that.oScen = this.byId("Pidscen");
                    // that.oProd.removeAllTokens();
                    // that.oObjDep.removeAllTokens();
                } else if(oJobKey === "T"){
                    that.oLoc = this.byId("TlocInput");
                    that.oProd = this.byId("TprodInput");
                } else if(oJobKey === "I"){
                    that.oLoc = this.byId("IlocInput");
                    that.oProd = this.byId("IprodInput");
                    that.oVer = this.byId("Iidver");
                    that.oScen = this.byId("Iidscen");

                // if(that.byId("idIBPselect").getSelectedKey() === "I"){
                //     that.oLoc = this.byId("IlocInput");
                //     that.oProd = this.byId("IprodInput");
                //     that.oVer = this.byId("Iidver");
                //     that.oScen = this.byId("Iidscen");
                // } else if(that.byId("idIBPselect").getSelectedKey() === "E"){
                //     var rRadioBtn = that.byId("idRbtnExport").getSelectedButton().getText();
                //     if(rRadioBtn === "Product"){
                //         that.oLoc = that.byId("IBPlocInput");
                //     } else if(rRadioBtn === "Sales History"){
                //         that.oLoc = this.byId("IBPElocInput");
                //         that.oProd = this.byId("ExIBPSHlocInputut");                          
                //     }
                // }
                    
                }

                // if(that.oGModel.getProperty("/newSch") !== "X"){
                //     if(oJobKey === "M" || oJobKey === "P"){
                //         that.oProd.removeAllTokens();
                //     }
                    
                // }

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
              that.oGModel.setProperty("/Flag", "X");
              
              if(oJobType === "M" || oJobType === "P" ){
              that.oProd.removeAllTokens();
            //   that.oObjDep.removeAllTokens();
              this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
            //   this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
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

              that.getProducts();
  
            
  
              // Product list
            } else if (sId.includes("prod")) {
              var aSelectedProd;
              that.oProdList.getBinding("items").filter([]);
                 aSelectedProd = oEvent.getParameter("selectedItems");
                 that.oGModel.setProperty("/Flag", "X");
              if (aSelectedProd && aSelectedProd.length > 0) {

               

                if(oJobType === "T" || oJobType === "I"){
                    that.oProd.setValue(aSelectedProd[0].getTitle());
                }
                if(oJobType === "M" || oJobType === "P"){
                    // that.oObjDep.removeAllTokens();
                    // this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
                    that.oProd.removeAllTokens();
                    aSelectedProd.forEach(function (oItem) {
                        that.oProd.addToken(
                            new sap.m.Token({
                            key: oItem.getTitle(),
                            text: oItem.getTitle(),
                            })
                        );
                        });
                       
                    }
              
  
                // var aSelectedProd = that.oProdList.getSelectedItems();
  
                

                if(oJobType === "P" || oJobType === "I"){
                
                that.getVersion();
                }
  
                
              } else {
                if(oJobType === "M" || oJobType === "P"){
                that.oProd.removeAllTokens();
                }
              }
            //   // Object ependency
            // } else if (sId.includes("od")) {
            //   var aSelectedODItems;
            //   that.oODList.getBinding("items").filter([]);
  
            //   aSelectedODItems = oEvent.getParameter("selectedItems");
  
            //   if (aSelectedODItems && aSelectedODItems.length > 0) {
            //       if(oJobType === "M"){
            //         if (aSelectedODItems[0].getTitle() === "All") {
            //             that.byId("MidCheck").setSelected(true);
            //           } else {
            //             that.byId("MidCheck").setSelected(false);
            //           }
            //       } else if(oJobType === "P"){
            //         if (aSelectedODItems[0].getTitle() === "All") {
            //         that.byId("PidCheck").setSelected(true);
            //         } else {
            //         that.byId("PidCheck").setSelected(false);
            //         }
            //     }
            //     that.oObjDep.removeAllTokens();
            //     aSelectedODItems.forEach(function (oItem) {
            //       that.oObjDep.addToken(
            //         new sap.m.Token({
            //           key: oItem.getTitle(),
            //           text: oItem.getTitle(),
            //         })
            //       );
            //     });
            //   } else {
            //     that.oObjDep.removeAllTokens();
            //     that.byId("MidCheck").setSelected(false);
            //     that.byId("PidCheck").setSelected(false);
            //   }
            //   // Versions List
            } else if (sId.includes("Ver")) {
              
              aSelectedVer = oEvent.getParameter("selectedItems");
              that.oVer.setValue(aSelectedVer[0].getTitle());
              that.oGModel.setProperty("/Flag", "X");
              that.oScen.setValue("");

              that.getScenario();
  
           
              // Scenario List
        } else if (sId.includes("scen")) {
              var aSelectedScen = oEvent.getParameter("selectedItems");
              that.oGModel.setProperty("/Flag", "X");
              that.oScen.setValue(aSelectedScen[0].getTitle());
            // Scenario List
        } else if (sId.includes("ppfSlctList")) {
            var aSelectedPPF = oEvent.getParameter("selectedItems");
            that.oPredProfile.setValue(aSelectedPPF[0].getTitle());
          // Scenario List
        } else if (sId.includes("CustSlctList")) {
            var aSelectedCust = oEvent.getParameter("selectedItems");
            that.oCust.setValue(aSelectedCust[0].getTitle());
            // Scenario List
        } else if (sId.includes("ClassSlctList")) {
            var aSelectedCust = oEvent.getParameter("selectedItems");
            that.oClass.setValue(aSelectedCust[0].getDescription());
        }
            that.handleClose(oEvent);
          },



        getProducts:function(oEvent){

            var oJobType = that.byId("idJobType").getSelectedKey();

                    // Calling sercive to get the Product list
                    this.getModel("BModel").read("/getLocProdDet", {
                        filters: [
                        new Filter(
                            "LOCATION_ID",
                            FilterOperator.EQ,
                            that.oLoc.getValue()
                        ),
                        ],
                    success: function (oData) {
                        if(oJobType === "M" || oJobType === "P"){
                            sap.ui.getCore().byId("prodSlctList").setMultiSelect(true);
                            sap.ui.getCore().byId("prodSlctList").setRememberSelections(true);
                        if (oData.results.length > 0) {
                            oData.results.unshift({
                            PRODUCT_ID: "All",
                            PROD_DESC: "All",
                            });
                        }
                        } else if(oJobType === "T" || oJobType === "I"){
                            sap.ui.getCore().byId("prodSlctList").setMultiSelect(false);
                            sap.ui.getCore().byId("prodSlctList").setRememberSelections(false);                    
                        } 
                            that.prodModel.setData(oData);
                            that.oProdList.setModel(that.prodModel);
                                    
                            
                        },
                        error: function (oData, error) {
                        MessageToast.show("error");
                        },
                    });

        },


        getVersion:function(oEvent){
            var oJobType = that.byId("idJobType").getSelectedKey(),
                aSelectedProd ;
             
             
             var oFilters = [];
                var sFilter = new sap.ui.model.Filter({
                  path: "LOCATION_ID",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: that.oLoc.getValue(),
                });
                oFilters.push(sFilter);

                if(oJobType === "M" || oJobType === "P"){
                    aSelectedProd = that.oProd.getTokens();
                    for (var i = 0; i < aSelectedProd.length; i++) {
                        if (aSelectedProd[i].getText() !== "All") {
                          sFilter = new sap.ui.model.Filter({
                            path: "PRODUCT_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: aSelectedProd[i].getText(),
                          });
                          oFilters.push(sFilter);
                        }
                      }
                } else if(oJobType === "T" || oJobType === "I"){
                    // aSelectedProd = that.oProd.getValue();
                    var sFilter = new sap.ui.model.Filter({
                        path: "PRODUCT_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oProd.getValue(),
                      });
                      oFilters.push(sFilter);
                }   
  
                

                
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
                

        },

        getScenario:function(){

            var aSelectedProd = that.oProd.getTokens();
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
                    value1: that.oVer.getValue(),
                });
                oFilters.push(sFilter);
  
                for (var i = 0; i < aSelectedProd.length; i++) {
                  if (aSelectedProd[i].getText() !== "All") {
                    sFilter = new sap.ui.model.Filter({
                      path: "PRODUCT_ID",
                      operator: sap.ui.model.FilterOperator.EQ,
                      value1: aSelectedProd[i].getText(),
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
        //   handleObjDepChange: function (oEvent) {
        //     var oSelected = oEvent.getParameter("listItem").getTitle();
        //     var aItems = sap.ui.getCore().byId("odSlctList").getItems();
        //     var oSelItems = this._valueHelpDialogOD
        //       .getAggregation("_dialog")
        //       .getContent()[1]
        //       .getSelectedItems();
        //     if (
        //       oSelected === "All" &&
        //       oEvent.getParameter("selected") &&
        //       aItems.length !== 1
        //     ) {
        //       this._valueHelpDialogOD
        //         .getAggregation("_dialog")
        //         .getContent()[1]
        //         .selectAll();
        //     } else if (oSelected === "All" && !oEvent.getParameter("selected")) {
        //       this._valueHelpDialogOD
        //         .getAggregation("_dialog")
        //         .getContent()[1]
        //         .removeSelections();
        //     } else if (
        //       oSelected !== "All" &&
        //       !oEvent.getParameter("selected") &&
        //       aItems.length - 1 === oSelItems.length
        //     ) {
        //       sap.ui
        //         .getCore()
        //         .byId("odSlctList")
        //         .getItems()[0]
        //         .setSelected(false);
        //     } else if (
        //       oSelected !== "All" &&
        //       oEvent.getParameter("selected") &&
        //       aItems.length - 1 === oSelItems.length
        //     ) {
        //       sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(true);
        //     } else if (oSelected === "All" && aItems.length === 1) {
        //       sap.ui
        //         .getCore()
        //         .byId("odSlctList")
        //         .getItems()[0]
        //         .setSelected(false);
        //     }
        //   },

        onScheduleUpdate:function(){
            var aData = that.oGModel.getProperty("/aScheUpdate").data;
            var oScheData = $.parseJSON(aData);
            var oJobType = that.byId("idJobType").getSelectedKey();
            var sServiceText = that.oGModel.getProperty("/IBPService");

            
                    that.byId("idIBPselect").setEnabled("false");

            if(that.oGModel.getProperty("/JobType") === "I"){
                if(sServiceText.includes("DemandQty") || sServiceText.includes("FCharPlan")){
                    that.byId("idIBPselect").setSelectedKey("I");
                    that.byId("idIBPselect").setEditable("false");
                    that.byId("idRbtnImport").setVisible(true);
                    that.byId("idRbtnExport").setVisible(false);
                    that.byId("idbtImport").setVisible(true);
                    that.byId("idbtExport").setVisible(false);
                    that.oLoc.setValue(oScheData.LOCATION_ID);
                    that.oProd.setValue(oScheData.PRODUCT_ID);
                    that.oVer.setValue(oScheData.VERSION);
                    that.oScen.setValue(oScheData.SCENARIO);
                    if(sServiceText.includes("DemandQty")){
                        that.byId("idIBPDemand").setSelected(true);
                    } else {
                        that.byId("idIBPFutPlan").setSelected(true);
                    }
                    
                } else{
                    that.byId("idIBPselect").setSelectedKey("E");
                    that.byId("idIBPselect").setEditable("false");
                    that.byId("idRbtnImport").setVisible(false);
                    that.byId("idRbtnExport").setVisible(true);
                    that.byId("idbtImport").setVisible(false);
                    that.byId("idbtExport").setVisible(true);

                    if(sServiceText.includes("Location")){
                        that.byId("idIBPLoc").setSelected(true);
                    } else if(sServiceText.includes("Customer")){
                        that.byId("idIBPCustGrp").setSelected(true);
                    } else if(sServiceText.includes("MasterProd")){
                        that.byId("idIBPProd").setSelected(true);
                        that.oLoc.setValue(oScheData.LOCATION_ID);
                    } else if(sServiceText.includes("Class")){
                        that.byId("idIBPClass").setSelected(true);
                        that.oClass.setValue(oScheData.CLASS_NUM);
                    } else if(sServiceText.includes("SalesTrans")){
                        that.byId("idIBPSalesHis").setSelected(true);
                        that.oLoc.setValue(oScheData.LOCATION_ID);
                        that.oProd.setValue(oScheData.PRODUCT_ID);
                        that.oCust.setValue(oScheData.CUSTOMER_GROUP);
                    }
                } 
                that.IBPjobUpdate();

            } else if(that.oGModel.getProperty("/JobType") === "M" || that.oGModel.getProperty("/JobType") === "P"){

                oScheData = oScheData.vcRulesList;
                // Calling sercive to get the Product list
              this.getModel("BModel").read("/getLocProdDet", {
                filters: [
                  new Filter(
                    "LOCATION_ID",
                    FilterOperator.EQ,
                    oScheData[0].Location
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


                //   oScheData = oScheData.vcRulesList;
                for(var i = 0; i<oScheData.length; i++){
                    that.oProd.addToken(
                        new sap.m.Token({
                        key: oScheData[i].Product,
                        text: oScheData[i].Product,
                        })
                    );

                    if(oScheData[i].override === true){
                        if(oJobType === "M" ){
                            that.byId("MidCheck").setSelected(true);
                        }

                        if(oJobType === "P" ){
                            that.byId("PidCheck").setSelected(true);
                        }
                    } else if(oScheData[i].override === false){
                        if(oJobType === "M" ){
                            that.byId("MidCheck").setSelected(false);
                        }

                        if(oJobType === "P" ){
                            that.byId("PidCheck").setSelected(false);
                        }
                    }

                }
                that.oLoc.setValue(oScheData[0].Location);
                if(that.oGModel.getProperty("/JobType") === "M"){
                    that.oPredProfile.setValue(oScheData[0].profile);
                } else if(that.oGModel.getProperty("/JobType") === "P"){
                    that.oVer.setValue(oScheData[0].version);
                    that.oScen.setValue(oScheData[0].scenario);
                } 


                },
                error: function (oData, error) {
                  MessageToast.show("error");
                },
              });


            }
        

       


        },

        IBPjobUpdate:function(){

            var selRadioBt = that.byId("idRbtnExport").getSelectedButton().getText();

                if(selRadioBt === "Location"){
                    // that.byId("idbtExport").setText("Export Locations");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Customer Group"){
                    // that.byId("idbtExport").setText("Export Customer Group");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Product"){
                    // that.byId("idbtExport").setText("Export Product");
                    that.oLoc = that.byId("EPlocInput");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(true);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Class"){
                    // that.byId("idbtExport").setText("Export Class");
                    that.oClass = this.byId("IBPclassInput");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(true);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Sales History"){
                    // that.byId("idbtExport").setText("Sales History");
                    that.oLoc = this.byId("ESHlocInput");
                    that.oProd = this.byId("ESHprodInput");  
                    that.oCust = this.byId("ECust"); 
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(true);
                }


        },



        onIBPSelect:function(oEvent){
            var seleKey = that.byId("idIBPselect").getSelectedKey();

            if(seleKey === "I"){
                if(that.oGModel.getProperty("/newSch")!== "X" && that.oGModel.getProperty("/UpdateSch")!== "X"){
                    that.byId("idIBPDemand").setSelected(true);
                }
                if(that.oGModel.getProperty("/newSch")!== "X" && that.oGModel.getProperty("/UpdateSch")!== "X"){
                that.byId("idRbtnImport").setVisible(true);
                that.byId("idRbtnExport").setVisible(false);
                that.byId("IBPimport").setVisible(true);
                that.byId("idbtImport").setVisible(true);
                that.byId("idbtExport").setVisible(false);
                // that.byId("IBPimport").setVisible(true);
                that.byId("IBPProdExport").setVisible(false);
                that.byId("IBPClassExport").setVisible(false);
                that.byId("IBPSalesHisExport").setVisible(false);
                }
            } else if(seleKey === "E"){
                if(that.oGModel.getProperty("/newSch")!== "X" && that.oGModel.getProperty("/UpdateSch")!== "X"){
                    that.byId("idIBPLoc").setSelected(true);
                }
                if(that.oGModel.getProperty("/newSch")!== "X" && that.oGModel.getProperty("/UpdateSch")!== "X"){
                that.byId("idRbtnImport").setVisible(false);
                that.byId("idRbtnExport").setVisible(true);
                that.byId("IBPimport").setVisible(false);
                that.byId("idbtImport").setVisible(false);
                that.byId("idbtExport").setVisible(true);

                // that.byId("idbtExport").setText("Export Locations");
                that.byId("IBPimport").setVisible(false);
                that.byId("IBPProdExport").setVisible(false);
                that.byId("IBPClassExport").setVisible(false);
                that.byId("IBPSalesHisExport").setVisible(false);
                }
            }


            if(that.byId("idIBPselect").getSelectedKey() === "I"){
                that.oLoc = this.byId("IlocInput");
                that.oProd = this.byId("IprodInput");
                that.oVer = this.byId("Iidver");
                that.oScen = this.byId("Iidscen");
            } 

            

        },


        RadioChange:function(oEvent){
            
                var selRadioBt = that.byId("idRbtnExport").getSelectedButton().getText();

                if(selRadioBt === "Location"){
                    // that.byId("idbtExport").setText("Export Locations");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Customer Group"){
                    // that.byId("idbtExport").setText("Export Customer Group");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Product"){
                    // that.byId("idbtExport").setText("Export Product");
                    that.oLoc = that.byId("EPlocInput");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(true);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Class"){
                    // that.byId("idbtExport").setText("Export Class");
                    that.oClass = this.byId("IBPclassInput");
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(true);
                    that.byId("IBPSalesHisExport").setVisible(false);
                } else if(selRadioBt === "Sales History"){
                    // that.byId("idbtExport").setText("Sales History");
                    that.oLoc = this.byId("ESHlocInput");
                    that.oProd = this.byId("ESHprodInput");  
                    that.oCust = this.byId("ECust"); 
                    that.byId("IBPimport").setVisible(false);
                    that.byId("IBPProdExport").setVisible(false);
                    that.byId("IBPClassExport").setVisible(false);
                    that.byId("IBPSalesHisExport").setVisible(true);
                }

        },

          onModelGen:function(){
            var cSelected = that.byId("MidCheck").getSelected();
            if(that.oGModel.getProperty("/newSch")=== "X"){
            sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
            } else if(that.oGModel.getProperty("/UpdateSch")=== "X"){
                sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
            }
            that.oGModel.setProperty("/runText", "Generate Model");


            this.oModel = this.getModel("PModel");
            var aItems,
              oProdItems,
              oPredProfile,
              cSelected,
              oSelModelVer,
              oSelType,
              oPredProfile,
              oLocItem,
              i,
              regData = [],
              vFlag;
            var oEntry = {
                vcRulesList: [],
              },
              testLIst=[],
              vRuleslist,
              oRuleList=[];
              var oMdlVer = that.byId("Midmdlver").getSelectedKey(),
              vMdlVer;
            // aItems = this.oODList.getSelectedItems();
            oLocItem = that.oLoc.getValue();
            // oProdItems = this.oProdList.getSelectedItems(),
            oProdItems = that.oProd.getTokens(),
              oPredProfile = that.oPredProfile.getValue(),
              cSelected = that.byId("MidCheck").getSelected();
            if (oMdlVer === "act") {
              vMdlVer = "Active";
            } else {
              vMdlVer = "Simulation";
            }
  
            if (this.oProd.getTokens().length > 0 && this.oPredProfile.getValue() ) {
          
                for (i = 0; i < oProdItems.length; i++) {
                      vRuleslist = {
                        profile: oPredProfile,
                        override: cSelected,
                        Location: oLocItem,
                        Product: oProdItems[i].getText(),
                        GroupID: "ALL",
                        // GroupID: "1973254_1",
                        Type: "OD",
                        modelVersion: vMdlVer,
                      };
                    //   oEntry.vcRulesList.push(vRuleslist);
                    oRuleList.push(vRuleslist);
                      
                    
                  }
                  
                  if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
                    that.jobDataAddSche();

                    // } else {
                    //     sap.ui.getCore().byId("idSchTime").setDateValue();
                    //     sap.ui.getCore().byId("idmnth").setValue("");
                    //     sap.ui.getCore().byId("iddate").setValue("");
                    //     sap.ui.getCore().byId("idhrs").setValue("");
                    //     sap.ui.getCore().byId("idmin").setValue("");
                    }
                  
                // this.oGModel.setProperty("/vcrulesData", oEntry.vcRulesList);
                this.oGModel.setProperty("/vcrulesData", oRuleList);


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
                
                        sap.ui.getCore().byId("idSchTime").setDateValue();
                        sap.ui.getCore().byId("idmnth").setValue("");
                        sap.ui.getCore().byId("iddate").setValue("");
                        sap.ui.getCore().byId("idhrs").setValue("");
                        sap.ui.getCore().byId("idmin").setValue("");

            } else {
                MessageToast.show("Please select all fields");
            }

          },

          onPrediction:function(){
            var cSelected = that.byId("PidCheck").getSelected();
            // sap.ui.getCore().byId("idSavebt").setText("Run Prediction");
            if(that.oGModel.getProperty("/newSch")=== "X"){
                sap.ui.getCore().byId("idSavebt").setText("Add Schedule");
            }  else if(that.oGModel.getProperty("/UpdateSch")=== "X"){
                sap.ui.getCore().byId("idSavebt").setText("Update Schedule");
            }
            that.oGModel.setProperty("/runText", "Run Prediction");

            this.oModel = this.getModel("PModel");
            var aItems,
              oProdItems,
              oPredProfile,
              cSelected,
              oSelModelVer,
              oSelType,
              oSelVer,
              oLocItem,
              oSelScen,
              i,
              regData = [],
              vFlag;
            var oEntry = {
                vcRulesList: [],
              },
              oRuleList=[],
              vRuleslist,
              finalList={};
            // aItems = this.oODList.getSelectedItems();
            oLocItem = that.oLoc.getValue();
            oProdItems = that.oProd.getTokens();
            cSelected = that.byId("PidCheck").getSelected();
            oSelModelVer = this.byId("PidModelVer").getSelectedKey();
            // oSelType = this.byId("PidType").getSelectedKey();
            oSelVer = this.oVer.getValue();
            oSelScen = this.oScen.getValue();


            if (this.oProd.getTokens().length > 0 && this.oVer.getValue() && this.oScen.getValue() ) {
          
                for (i = 0; i < oProdItems.length; i++) {
                    vRuleslist = {
                      //   profile: oPredProfile,
                      override: cSelected,
                      Location: oLocItem,
                      Product: oProdItems[i].getText(),
                      GroupID: "ALL",
                    //   GroupID: "1973254_1",
                      Type: "OD",
                      modelVersion: oSelModelVer,
                      version: oSelVer,
                      scenario: oSelScen,
                    };
                    // oEntry.vcRulesList.push(vRuleslist);
                    oRuleList.push(vRuleslist);
                }
                // this.oGModel.setProperty("/vcrulesData", oEntry.vcRulesList);
                this.oGModel.setProperty("/vcrulesData", oRuleList);

                if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
                    that.jobDataAddSche();

                // } else {
                //     sap.ui.getCore().byId("idSchTime").setDateValue();
                //     sap.ui.getCore().byId("idmnth").setValue("");
                //     sap.ui.getCore().byId("iddate").setValue("");
                //     sap.ui.getCore().byId("idhrs").setValue("");
                //     sap.ui.getCore().byId("idmin").setValue("");
                }



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

                sap.ui.getCore().byId("idSchTime").setDateValue();
                sap.ui.getCore().byId("idmnth").setValue("");
                sap.ui.getCore().byId("iddate").setValue("");
                sap.ui.getCore().byId("idhrs").setValue("");
                sap.ui.getCore().byId("idmin").setValue("");

            } else {
                MessageToast.show("Please select all fields");
            }
          },


          onTimeSeries:function(){
                    var aItems,
                    oProdItem,
                    oLocItem,
                    oPastDays,
                    i;
                var vRuleslist;

                oLocItem = that.oLoc.getValue();
                oProdItem = this.oProd.getValue();
                oPastDays = that.byId("TpastdaysInput").getValue();
                

                that.oGModel.setProperty("/runText", "Time Series");


                if (this.oProd.getValue() && oPastDays ) {
                        vRuleslist = {
                            LOCATION_ID: oLocItem,
                            PRODUCT_ID: oProdItem,
                            PAST_DAYS: oPastDays,
                        };
                        
                    this.oGModel.setProperty("/vcrulesData", vRuleslist);
                    sap.ui.getCore().byId("idSchTime").setDateValue();
                    sap.ui.getCore().byId("idmnth").setValue("");
                    sap.ui.getCore().byId("iddate").setValue("");
                    sap.ui.getCore().byId("idhrs").setValue("");
                    sap.ui.getCore().byId("idmin").setValue("");
                    
                        that._valueHelpDialogJobDetail.open();

                        if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
                            that.jobDataAddSche();
        
                            // } else {
                            //     sap.ui.getCore().byId("idSchTime").setDateValue("");
                            //     sap.ui.getCore().byId("idmnth").setValue("");
                            //     sap.ui.getCore().byId("iddate").setValue("");
                            //     sap.ui.getCore().byId("idhrs").setValue("");
                            //     sap.ui.getCore().byId("idmin").setValue("");
                            }
                    
                } else {
                    MessageToast.show("Please select all fields");
                }

          },

          onIbpJobImport:function(){

            var aItems,
                oProdItem,
                oSelVer,
                oLocItem,
                oSelScen,
                fromDate,
                toDate,
                rRadioBtn,
                i;
            var oEntry = {
                vcRulesList: [],
              },
              vRuleslist,
              finalList={};

            oLocItem = that.oLoc.getValue();
            oProdItem = this.oProd.getValue();
            oSelVer = that.oVer.getValue();
            // oSelScen = that.oScen.getValue();
            // oSelVer = "__" + that.oVer.getValue();
            oSelScen = "";
            
            var nowH = new Date();
            fromDate = nowH.toISOString().split("T")[0];
            toDate = new Date(nowH.getFullYear(), nowH.getMonth(), nowH.getDate() + 90);
            toDate = toDate.toISOString().split("T")[0];
            

            rRadioBtn = that.byId("idRbtnImport").getSelectedButton().getText();

            // if(that.byId("idIBPselect").getSelectedKey() === "I"){
            //     rRadioBtn = that.byId("idRbtnImport").getSelectedButton().getText();
            // } else if(that.byId("idIBPselect").getSelectedKey() === "E"){
            //     rRadioBtn = that.byId("idRbtnExport").getSelectedButton().getText();
            // }

            that.oGModel.setProperty("/runText", rRadioBtn);


            if (this.oProd.getValue() && this.oVer.getValue() && this.oScen.getValue() ) {
                if(rRadioBtn.includes("Demand")){
                    vRuleslist = {
                        LOCATION_ID: oLocItem,
                        PRODUCT_ID: oProdItem,
                        VERSION: oSelVer,
                        SCENARIO: oSelScen,
                    };
                    // oEntry.vcRulesList.push(vRuleslist);
                } else if(rRadioBtn.includes("Future")){
                    vRuleslist = {
                        LOCATION_ID: oLocItem,
                        PRODUCT_ID: oProdItem,
                        VERSION: oSelVer,
                        SCENARIO: oSelScen,
                        FROMDATE: fromDate,
                        TODATE:toDate
                    };
                    // oEntry.vcRulesList.push(vRuleslist);
                }

                this.oGModel.setProperty("/vcrulesData", vRuleslist);
                this.oGModel.setProperty("/IbpType", "Import");

                sap.ui.getCore().byId("idSchTime").setDateValue();
                        sap.ui.getCore().byId("idmnth").setValue("");
                        sap.ui.getCore().byId("iddate").setValue("");
                        sap.ui.getCore().byId("idhrs").setValue("");
                        sap.ui.getCore().byId("idmin").setValue("");

                    that._valueHelpDialogJobDetail.open();

                    if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
                        that.jobDataAddSche();
    
                    // } else {
                    //     sap.ui.getCore().byId("idSchTime").setDateValue("");
                    //     sap.ui.getCore().byId("idmnth").setValue("");
                    //     sap.ui.getCore().byId("iddate").setValue("");
                    //     sap.ui.getCore().byId("idhrs").setValue("");
                    //     sap.ui.getCore().byId("idmin").setValue("");
                    }
                
            } else {
                MessageToast.show("Please select all fields");
            }

          },

          onIbpJobExport:function(){

            var oProdItem,
                oLocItem,
                oClassNum,
                oCustGrpItem,
                i,
              vRuleslist;



              var rRadioBtn = that.byId("idRbtnExport").getSelectedButton().getText();
              that.oGModel.setProperty("/runText", rRadioBtn);

              if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
                that.jobDataAddSche();
              }

              if(rRadioBtn === "Location" || rRadioBtn === "Customer Group"){
                that._valueHelpDialogJobDetail.open();
                vRuleslist = {};
                this.oGModel.setProperty("/vcrulesData", vRuleslist);

              } else if(rRadioBtn === "Product"){
                oLocItem = that.oLoc.getValue();
                    vRuleslist = {
                        LOCATION_ID: oLocItem,
                    };
                    this.oGModel.setProperty("/vcrulesData", vRuleslist);

                that._valueHelpDialogJobDetail.open();

              } else if(rRadioBtn === "Class"){
                oClassNum = that.oClass.getValue();

                    vRuleslist = {
                        CLASS_NUM: oClassNum,
                    };

                    this.oGModel.setProperty("/vcrulesData", vRuleslist);
                that._valueHelpDialogJobDetail.open();

              } else if(rRadioBtn === "Sales History"){
                oLocItem = that.oLoc.getValue();
                oProdItem = this.oProd.getValue();
                oCustGrpItem = that.oCust.getValue();
                var dDate = new Date().toISOString().split("T")[0];
                    vRuleslist = {
                        LOCATION_ID: oLocItem,
                        PRODUCT_ID: oProdItem,
                        CUSTOMER_GROUP: oCustGrpItem,
                        DOC_DATE: dDate
                    };
                    this.oGModel.setProperty("/vcrulesData", vRuleslist);

                that._valueHelpDialogJobDetail.open();
              }

              

            

            


            // if (this.oProd.getValue() && this.oVer.getValue() && this.oScen.getValue() ) {
            //     if(RadioBtn.includes("Demand")){
            //         vRuleslist = {
            //             LOCATION_ID: oLocItem,
            //             PRODUCT_ID: oProdItem,
            //             VERSION: oSelVer,
            //             SCENARIO: oSelScen,
            //         };
            //         // oEntry.vcRulesList.push(vRuleslist);
            //     } else if(RadioBtn.includes("Future")){
            //         vRuleslist = {
            //             LOCATION_ID: oLocItem,
            //             PRODUCT_ID: oProdItem,
            //             VERSION: oSelVer,
            //             SCENARIO: oSelScen,
            //             FROMDATE: fromDate,
            //             TODATE:toDate
            //         };
            //         // oEntry.vcRulesList.push(vRuleslist);
            //     }

            //     this.oGModel.setProperty("/vcrulesData", vRuleslist);
            //     this.oGModel.setProperty("/SelRadioBtn", RadioBtn);

            //     sap.ui.getCore().byId("idSchTime").setDateValue();
            //             sap.ui.getCore().byId("idmnth").setValue("");
            //             sap.ui.getCore().byId("iddate").setValue("");
            //             sap.ui.getCore().byId("idhrs").setValue("");
            //             sap.ui.getCore().byId("idmin").setValue("");

            //         that._valueHelpDialogJobDetail.open();

            //         if(that.oGModel.getProperty("/newSch")=== "X" || that.oGModel.getProperty("/UpdateSch")=== "X"){
            //             that.jobDataAddSche();
    
            //         // } else {
            //         //     sap.ui.getCore().byId("idSchTime").setDateValue("");
            //         //     sap.ui.getCore().byId("idmnth").setValue("");
            //         //     sap.ui.getCore().byId("iddate").setValue("");
            //         //     sap.ui.getCore().byId("idhrs").setValue("");
            //         //     sap.ui.getCore().byId("idmin").setValue("");
            //         }
                
            // } else {
            //     MessageToast.show("Please select all fields");
            // }

          },


          jobDataAddSche:function(oEvent){
            var oJobData = that.oGModel.getProperty("/Jobdata");

            sap.ui.getCore().byId("idname").setValue(oJobData.name);
            sap.ui.getCore().byId("idname").setEditable(false);

            sap.ui.getCore().byId("idDesc").setValue(oJobData.description);
            sap.ui.getCore().byId("idDesc").setEditable(false);

            if(oJobData.active === true){
                sap.ui.getCore().byId("idActive").setSelectedKey("T");
                sap.ui.getCore().byId("idActive").setEditable(false);
            } else if(oJobData.active === false){
                sap.ui.getCore().byId("idActive").setSelectedKey("F");
                sap.ui.getCore().byId("idActive").setEditable(false);
            }

            sap.ui.getCore().byId("idSTime").setDateValue(new Date(oJobData.startTime));
            sap.ui.getCore().byId("idSTime").setEnabled(false);

            sap.ui.getCore().byId("idETime").setDateValue(new Date(oJobData.endTime));
            sap.ui.getCore().byId("idETime").setEnabled(false);



          },

          onJobTypeChange:function(){
            var selKey = sap.ui.getCore().byId("idJobSchtype").getSelectedKey();

            // if(that.oGModel.getProperty("/UpdateSch") !== "X"){

            if(selKey === "Im"){
                sap.ui.getCore().byId("idSchTime").setVisible(true);
                sap.ui.getCore().byId("idCronValues").setVisible(false);
                sap.ui.getCore().byId("idSchTime").setDateValue();
            } else if(selKey === "Cr"){
                sap.ui.getCore().byId("idSchTime").setVisible(false);
                sap.ui.getCore().byId("idCronValues").setVisible(true);
            }
        // } else {
        //      var keyType = that.oGModel.getProperty("/aScheUpdate").type;

        //      if(keyType === "one-time"){
        //         sap.ui.getCore().byId("idSchTime").setVisible(true);
        //         sap.ui.getCore().byId("idCronValues").setVisible(false);
        //         sap.ui.getCore().byId("idSchTime").setDateValue();
        //      } else if(keyType === "recurring"){
        //         sap.ui.getCore().byId("idSchTime").setVisible(false);
        //         sap.ui.getCore().byId("idCronValues").setVisible(true);
        //      }
        // }

          },

          onCreateJobClose:function(){
            this._oCore.byId("idname").setValue();
            this._oCore.byId("idDesc").setValue();
            this._oCore.byId("idSTime").setValue();
            this._oCore.byId("idETime").setValue();

            // this._oCore.byId("idcron").setValue();
            this._oCore.byId("idSSTime").setValue();
            this._oCore.byId("idSETime").setValue();

            that.oGModel.setProperty("/runText", "");
            sap.ui.getCore().byId("idSTime").setEnabled(true);
            sap.ui.getCore().byId("idJobSchtype").setSelectedKey("Cr");
            that.byId("idIBPselect").setEditable("true");


            that._valueHelpDialogJobDetail.close();

          },

        //   onCronChange:function(oEvent){
        //         sap.ui.getCore().byId("idCrontype").setSelectedKey("Mi");
        //   },

        // handleDateChange:function(oEvent){
        //     var sId = oEvent.getParameter("id");

        //     if(sId.includes("idSTime")){
        //       var  djSdate = this._oCore.byId("idSTime").getDateValue();
        //         sap.ui.getCore().byId("idSTime").setDateValue(djSdate);
        //         sap.ui.getCore().byId("idSSTime").setDateValue(djSdate);
        //     } else if(sId.includes("idETime")){
        //         var djEdate = this._oCore.byId("idETime").getDateValue();
        //         sap.ui.getCore().byId("idETime").setDateValue(djEdate);
        //         sap.ui.getCore().byId("idSETime").setDateValue(djEdate);
        //     } 

        //   },

        onJobCreate:function(){

            // this.oGModel = this.getModel("GModel");
            var bButton = that.oGModel.getProperty("/runText") ,
                sName = sap.ui.getCore().byId("idname").getValue(),
                lgTime = new Date().getTimezoneOffset();
                if(that.oGModel.getProperty("/newSch") !== "X" && that.oGModel.getProperty("/UpdateSch") !== "X"){
                    this._oCore.byId("idSTime").setDateValue(new Date(this._oCore.byId("idSSTime").getDateValue()));
                    this._oCore.byId("idETime").setDateValue(new Date(this._oCore.byId("idSETime").getDateValue()));
                } 

            var djSdate = this._oCore.byId("idSTime").getDateValue(),
                djEdate = this._oCore.byId("idETime").getDateValue(),
                dsSDate = this._oCore.byId("idSSTime").getDateValue(),
                dsEDate = this._oCore.byId("idSETime").getDateValue(),
                tjStime, tjEtime, tsStime, tsEtime;

                if(that.oGModel.getProperty("/newSch") === "X" || that.oGModel.getProperty("/UpdateSch") === "X"){
                    if(djEdate < dsEDate){
                        djEdate = dsEDate;

                       var dDate = djEdate.toISOString().split("T"),
                           dTime = dDate[1].split(".")[0];

                           djEdate = dDate[0] + " " + dTime;

                        var oJobUpdateData = that.oGModel.getProperty("/Jobdata");
                        var finalList = {
                            jobId:oJobUpdateData.jobId,
                            name:oJobUpdateData.name,
                            description:oJobUpdateData.description,
                            action:oJobUpdateData.action,
                            httpMethod: "POST",
                            active:oJobUpdateData.active,
                            startTime:oJobUpdateData.startTime,
                            endTime:djEdate,
                                    
                        }
                        sap.ui.core.BusyIndicator.show();
                    that.getModel("JModel").callFunction("/lupdateJob", {
                        method: "GET",
                        urlParameters: {
                            jobDetails: JSON.stringify(finalList)
                            },
                        success: function (oData) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.onJobCreate1();

                        
                        },
                        error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                       
                        sap.m.MessageToast.show("Failed to update job details");
                        },
                    });





                    } else {
                        that.onJobCreate1();
                    }
                } else {
                    that.onJobCreate1();
                }


        },


          onJobCreate1:function(){
            // this.oGModel = this.getModel("GModel");
            var bButton = that.oGModel.getProperty("/runText") ,
                sName = sap.ui.getCore().byId("idname").getValue(),
                lgTime = new Date().getTimezoneOffset();
                if(that.oGModel.getProperty("/newSch") !== "X" && that.oGModel.getProperty("/UpdateSch") !== "X"){
                    this._oCore.byId("idSTime").setDateValue(new Date(this._oCore.byId("idSSTime").getDateValue()));
                    this._oCore.byId("idETime").setDateValue(new Date(this._oCore.byId("idSETime").getDateValue()));
                } 

            var djSdate = this._oCore.byId("idSTime").getDateValue(),
                djEdate = this._oCore.byId("idETime").getDateValue(),
                dsSDate = this._oCore.byId("idSSTime").getDateValue(),
                dsEDate = this._oCore.byId("idSETime").getDateValue(),
                tjStime, tjEtime, tsStime, tsEtime;

                if(that.oGModel.getProperty("/newSch") === "X" || that.oGModel.getProperty("/UpdateSch") === "X"){
                    if(djEdate < dsEDate){
                        djEdate = dsEDate;
                    }
                }




                // djSdate = new Date(djSdate.setTime(djSdate.getTime() - (lgTime* 60 * 1000)));
                // djEdate = new Date(djEdate.setTime(djEdate.getTime() - (lgTime* 60 * 1000)));
                // dsSDate = new Date(dsSDate.setTime(dsSDate.getTime() - (lgTime* 60 * 1000)));
                // dsEDate = new Date(dsEDate.setTime(dsEDate.getTime() - (lgTime* 60 * 1000)));
                
                djSdate = djSdate.toISOString().split("T");
                tjStime = djSdate[1].split(":");
                djEdate = djEdate.toISOString().split("T");
                tjEtime = djEdate[1].split(":");
                dsSDate = dsSDate.toISOString().split("T");
                tsStime = dsSDate[1].split(":");
                dsEDate = dsEDate.toISOString().split("T");
                tsEtime = dsEDate[1].split(":");

                // var cron = sap.ui.getCore().byId("idcron").getValue(),

                var dDate = new Date().toLocaleString().split(" "),
                // JobName = sName + "_" + dDate[0].replaceAll(",", "") + "_" + dDate[1],
                JobName = sName + new Date().getTime(),
                actionText;
                // cron = "* * * * * *%2F" + cron +  " " + "0";
                // cron = "* * * *%2F" + cron +  " " + "0" +  " " + "0" +  " " + "0";

                djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";


                var oJobschType = sap.ui.getCore().byId("idJobSchtype").getSelectedKey(),
                    onetime = "", Cron = "";
                if(oJobschType === "Im"){
                    onetime = sap.ui.getCore().byId("idSchTime").getDateValue();
                    Cron = "";
                    if(onetime === null){
                        onetime = "";
                    }
                } else if(oJobschType === "Cr"){
                    var mnth = sap.ui.getCore().byId("idmnth").getValue(),
                        date = sap.ui.getCore().byId("iddate").getValue(),
                        day = sap.ui.getCore().byId("idWeek").getSelectedKey(),
                        hour = sap.ui.getCore().byId("idhrs").getValue(),
                        min = sap.ui.getCore().byId("idmin").getValue();

                        if(mnth === ""){
                            mnth = "*";
                        } else if(mnth.includes(":")){
                            mnth = mnth;
                        } else {
                            mnth = "*%2F" + mnth;
                        }
                        if(date === ""){
                            date = "*";
                        } else if(date.includes(":")){
                            date = date;
                        } else {
                            date = "*%2F" + date;
                        }
                        if(day === "0"){
                            day = "*";
                        } else if(day.includes(":")){
                            day = day;
                        } else {
                            day = "*%2F" + day;
                        }
                        if(hour === ""){
                            hour = "*";
                        } else {
                            hour = "*%2F" + hour;
                        }
                        if(min === "" ){
                            min = "0";
                        } else if(min === "0" ) {
                            min = min;
                        } else {
                            min = "*%2F" + min;
                        }

                    Cron = "*" + " " + mnth + " " + date + " " + day + " " + hour + " " + min + " " + "0";

                }


                if(bButton.includes("Prediction")){
                    actionText= "%2Fpal%2FgenPredictions";
                } else if(bButton.includes("Model")){
                    actionText= "%2Fpal%2FgenerateModels";
                } else if(bButton.includes("Time")){
                    actionText= "%2Fcatalog%2Fgenerate_timeseries";
                } else if(bButton.includes("Demand")){
                    actionText= "%2Fibpimport-srv%2FgenerateFDemandQty";
                } else if(bButton.includes("Future")){
                    actionText= "%2Fibpimport-srv%2FgenerateFCharPlan";
                } else if(bButton.includes("Location")){
                    actionText= "%2Fibpimport-srv%2FexportIBPLocation";
                } else if(bButton.includes("Customer")){
                    actionText= "%2Fibpimport-srv%2FexportIBPCustomer";
                } else if(bButton.includes("Product")){
                    actionText= "%2Fibpimport-srv%2FexportIBPMasterProd";
                } else if(bButton.includes("Class")){
                    actionText= "%2Fibpimport-srv%2FexportIBPClass";
                } else if(bButton.includes("Sales")){
                    actionText= "%2Fibpimport-srv%2FexportIBPSalesTrans";
                }

                var vcRuleList = this.oGModel.getProperty("/vcrulesData");

                var oJobType = that.byId("idJobType").getSelectedKey();
                if(that.oGModel.getProperty("/newSch") === "X"){
                    
                    if(oJobType === "M" || oJobType === "P"){

                        var finalList = {
                            jobId:that.oGModel.getProperty("/Jobdata").jobId,
                                data: {
                                    vcRulesList:vcRuleList
                                },
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                                }

                    } else {
                            var finalList = {
                                jobId:that.oGModel.getProperty("/Jobdata").jobId,
                                    data: vcRuleList,
                                    cron: Cron,
                                    time: onetime,
                                    // description:"Test Description",
                                    active:true,
                                    startTime: dsSDate,
                                    endTime : dsEDate
                                    }
                    }

                    that.getModel("JModel").callFunction("/laddJobSchedule", {
                        method: "GET",
                        urlParameters: {
                            schedule: JSON.stringify(finalList)
                            },
                        success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        if(oData.laddJobSchedule.value){
                        sap.m.MessageToast.show("Schedule created successfully");
                        }
                        that.onCreateJobClose();
                        that.onBack();
                        },
                        error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        that.onCreateJobClose();
                        sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                        },
                    });

            } else if(that.oGModel.getProperty("/UpdateSch") === "X"){
                if(oJobType === "M" || oJobType === "P"){
                    var finalList = {
                        jobId:that.oGModel.getProperty("/Jobdata").jobId,
                        scheduleId: that.oGModel.getProperty("/aScheUpdate").scheduleId,
                            data: {
                                vcRulesList:vcRuleList
                            },
                            cron: Cron,
                            time: onetime,
                            // description:"Test Description",
                            active:true,
                            startTime: dsSDate,
                            endTime : dsEDate
                        }
                } else {
                    var finalList = {
                        jobId:that.oGModel.getProperty("/Jobdata").jobId,
                        scheduleId: that.oGModel.getProperty("/aScheUpdate").scheduleId,
                            data: vcRuleList,
                            cron: Cron,
                            time: onetime,
                            // description:"Test Description",
                            active:true,
                            startTime: dsSDate,
                            endTime : dsEDate
                            }
                }

                that.getModel("JModel").callFunction("/lupdateMLJobSchedule", {
                    method: "GET",
                    urlParameters: {
                        schedule: JSON.stringify(finalList)
                        },
                    success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if(oData.lupdateMLJobSchedule.value){
                    sap.m.MessageToast.show("Schedule updated successfully");
                    }
                    that.onCreateJobClose();
                    that.onBack();
                    },
                    error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    that.onCreateJobClose();
                    sap.m.MessageToast.show(that.i18n.getText("Schedule updation failed"));
                    },
                });
            } else {
                if(bButton.includes("Demand") || bButton.includes("Future") ){
                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        createdAt:djSdate,
                        schedules:[
                            {
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }



                    // that.getModel("JModel").callFunction("/laddMLJob", {
                    //     method: "GET",
                    //     urlParameters: {
                    //     jobDetails: JSON.stringify(finalList)
                    //         },
                    //     success: function (oData, Response) {
                    //     sap.ui.core.BusyIndicator.hide();
                    //     sap.m.MessageToast.show(oData.laddMLJob.value + ": Job Created");
                    //     that.onCreateJobClose();
                    //     that.onBack();
                    //     },
                    //     error: function (error) {
                    //     sap.ui.core.BusyIndicator.hide();
                    //     that.onCreateJobClose();
                    //     sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                    //     },
                    // });

                } else if(bButton.includes("Location") || bButton.includes("Customer")){

                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        createdAt:djSdate,
                        schedules:[
                            {
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }

                } else if(bButton.includes("Product")){

                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        createdAt:djSdate,
                        schedules: [
                            {
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }

                } else if(bButton.includes("Class")){

                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        createdAt:djSdate,
                        schedules:[
                            {
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }

                } else if(bButton.includes("Sales")){

                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        createdAt:djSdate,
                        schedules:[
                            {
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }
                    
                } else if(bButton.includes("Time") ){
                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        createdAt:djSdate,
                        schedules:[
                            {
                                data: vcRuleList,
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }



                    // that.getModel("JModel").callFunction("/laddMLJob", {
                    //     method: "GET",
                    //     urlParameters: {
                    //     jobDetails: JSON.stringify(finalList)
                    //         },
                    //     success: function (oData) {
                    //     sap.ui.core.BusyIndicator.hide();
                    //     sap.m.MessageToast.show(oData.laddMLJob.value + ": Job Created");
                    //     that.onCreateJobClose();
                    //     that.onBack();
                    //     },
                    //     error: function (error) {
                    //     sap.ui.core.BusyIndicator.hide();
                    //     that.onCreateJobClose();
                    //     sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                    //     },
                    // });

                } else {
                    var finalList = {
                        name: JobName,
                        description:sap.ui.getCore().byId("idDesc").getValue(),
                        action: actionText,
                        active:true,
                        active:true,
                        httpMethod: "POST",
                        startTime: djSdate,
                        endTime : djEdate,
                        // createdAt:djSdate,
                        schedules:[
                            {
                                data: {
                                    vcRulesList:vcRuleList
                                },
                                cron: Cron,
                                time: onetime,
                                // description:"Test Description",
                                active:true,
                                startTime: dsSDate,
                                endTime : dsEDate
                            }
                        ]
                    }



                    // that.getModel("JModel").callFunction("/laddMLJob", {
                    //     method: "GET",
                    //     urlParameters: {
                    //     jobDetails: JSON.stringify(finalList)
                    //         },
                    //     success: function (oData) {
                    //     sap.ui.core.BusyIndicator.hide();
                    //     sap.m.MessageToast.show(oData.laddMLJob.value + ": Job Created");
                    //     that.onCreateJobClose();
                    //     that.onBack();
                    //     },
                    //     error: function (error) {
                    //     sap.ui.core.BusyIndicator.hide();
                    //     that.onCreateJobClose();
                    //     sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                    //     },
                    // });
                }

                that.getModel("JModel").callFunction("/laddMLJob", {
                    method: "GET",
                    urlParameters: {
                    jobDetails: JSON.stringify(finalList)
                        },
                    success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show(oData.laddMLJob.value + ": Job Created");
                    that.onCreateJobClose();
                    that.onBack();
                    },
                    error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    that.onCreateJobClose();
                    sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                    },
                });
            }

          }







	});
});