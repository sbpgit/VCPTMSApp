sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "cp/execpred/cpexecprediction/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    BaseController,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox
  ) {
    "use strict";
    var oGModel, that;
    return BaseController.extend(
      "cp.execpred.cpexecprediction.controller.Home",
      {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          // Declaring JSON Models and size limits
          this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          this.odModel = new JSONModel();
          this.ppfModel = new JSONModel();
          this.oODPModel = new JSONModel();
          this.otabModel = new JSONModel();
          this.verModel = new JSONModel();
          this.scenModel = new JSONModel();
          this.prodModel.setSizeLimit(5000);
          this.odModel.setSizeLimit(5000);

          // Declaring fragments
          this._oCore = sap.ui.getCore();
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cp.execpred.cpexecprediction.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cp.execpred.cpexecprediction.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }
          if (!this._valueHelpDialogOD) {
            this._valueHelpDialogOD = sap.ui.xmlfragment(
              "cp.execpred.cpexecprediction.view.ObjDepDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogOD);
          }
          if (!this._valueHelpDialogPPF) {
            this._valueHelpDialogPPF = sap.ui.xmlfragment(
              "cp.execpred.cpexecprediction.view.PredProfileDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogPPF);
          }
          if (!this._valueHelpDialogVer) {
            this._valueHelpDialogVer = sap.ui.xmlfragment(
              "cp.execpred.cpexecprediction.view.VersionDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogVer);
          }
          if (!this._valueHelpDialogScen) {
            this._valueHelpDialogScen = sap.ui.xmlfragment(
              "cp.execpred.cpexecprediction.view.ScenarioDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogScen);
          }
          this.getRouter()
            .getRoute("Home")
            .attachPatternMatched(this._onPatternMatched.bind(this));
        },

        /**
         * Called when the URL matches pattern "Home".
         */
        _onPatternMatched: function () {
          sap.ui.core.BusyIndicator.show();
          that = this;
          this.oPanel = this.byId("idPanel");
          this.oTable = this.byId("pmdlList");
          this.i18n = this.getResourceBundle();
          this.oGModel = this.getModel("GModel");
          this.oLoc = this.byId("locInput");
          this.oProd = this.byId("prodInput");
          this.oObjDep = this.byId("odInput");
          this.oPredProfile = this.byId("pmInput");
          this.oVer = this.byId("idver");
          this.oScen = this.byId("idscen");
          this.aVcRulesList = [];

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
        },

        /**
         * This function is called when click on input box to open value help dialogs.
         * This function will open the dialogs based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
          var sId = oEvent.getParameter("id");

          // Location Dialog
          if (sId.includes("loc")) {
            this._valueHelpDialogLoc.open();
            // Product Dialog
          } else if (sId.includes("prod")) {
            this._valueHelpDialogProd.open();
            // Object Dependency Dialog
          } else if (sId.includes("od") || sId.includes("__button1")) {
            if (that.oLoc.getValue() && that.oProd.getTokens().length !== 0) {
              var aSelectedItem = that.oProdList.getSelectedItems();

              var oFilters = [];
              var sFilter = new sap.ui.model.Filter({
                path: "LOCATION_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: that.oLocList.getSelectedItem().getTitle(),
              });
              oFilters.push(sFilter);

              for (var i = 0; i < aSelectedItem.length; i++) {
                if (aSelectedItem[i].getTitle() !== "All") {
                  sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: aSelectedItem[i].getTitle(),
                  });
                  oFilters.push(sFilter);
                }
              }

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
                  if (
                    that.oProdList.getSelectedItems()[0].getTitle() === "All"
                  ) {
                    that._valueHelpDialogOD
                      .getAggregation("_dialog")
                      .getContent()[1]
                      .selectAll();
                  }
                  that._valueHelpDialogOD.open();
                },
                error: function (oData, error) {
                  MessageToast.show("error");
                },
              });
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
              that.oProd.getTokens().length !== 0 &&
              that.oVer.getValue()
            ) {
              that._valueHelpDialogScen.open();
            } else {
              MessageToast.show("Select Location, Product and Version");
            }
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
          //Location list
          if (sId.includes("Loc")) {
            var aSelectedLoc = oEvent.getParameter("selectedItems");
            that.oLoc.setValue(aSelectedLoc[0].getTitle());
            that.oProd.removeAllTokens();
            that.oObjDep.removeAllTokens();
            this._valueHelpDialogProd
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
            this._valueHelpDialogOD
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();

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
                if (oData.results.length > 0) {
                  oData.results.unshift({
                    PRODUCT_ID: "All",
                    PROD_DESC: "All",
                  });
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
            that.oObjDep.removeAllTokens();
            this._valueHelpDialogOD
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
            var aSelectedProdItems = oEvent.getParameter("selectedItems");
            if (aSelectedProdItems && aSelectedProdItems.length > 0) {
              that.oProd.removeAllTokens();
              aSelectedProdItems.forEach(function (oItem) {
                that.oProd.addToken(
                  new sap.m.Token({
                    key: oItem.getTitle(),
                    text: oItem.getTitle(),
                  })
                );
              });

              var aSelectedProd = that.oProdList.getSelectedItems();

              var oFilters = [];
              var sFilter = new sap.ui.model.Filter({
                path: "LOCATION_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: that.oLocList.getSelectedItem().getTitle(),
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
            } else {
              that.oProd.removeAllTokens();
            }
            // Object ependency
          } else if (sId.includes("od")) {
            var aSelectedODItems;
            that.oODList.getBinding("items").filter([]);

            aSelectedODItems = oEvent.getParameter("selectedItems");

            if (aSelectedODItems && aSelectedODItems.length > 0) {
              if (aSelectedODItems[0].getTitle() === "All") {
                that.byId("idCheck").setSelected(true);
              } else {
                that.byId("idCheck").setSelected(false);
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

              that.byId("idCheck").setSelected(false);
            }
            // Versions List
          } else if (sId.includes("Ver")) {
            this.oVer = that.byId("idver");
            that.oScen = that.byId("idscen");
            aSelectedVer = oEvent.getParameter("selectedItems");
            that.oVer.setValue(aSelectedVer[0].getTitle());
            that.oScen.setValue("");

            var aSelectedProd = that.oProdList.getSelectedItems();

            var oFilters = [];
            var sFilter = new sap.ui.model.Filter({
              path: "LOCATION_ID",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: that.oLocList.getSelectedItem().getTitle(),
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
            this.oScen = that.byId("idscen");
            var aSelectedScen = oEvent.getParameter("selectedItems");
            that.oScen.setValue(aSelectedScen[0].getTitle());
          }
          that.handleClose(oEvent);
        },

        

        /**
         * This function is called when click on segment button change.
         * @param {object} oEvent -the event information.
         */
        onButtonChange: function (oEvent) {
          var selectedButton = that.byId("idType").getSelectedKey();

          if (selectedButton === "RT") {
            that.oObjDep.removeAllTokens();
            that.byId("odInput").setPlaceholder("Restriction");
            that.byId("odInput").setShowValueHelp(false);
          } else {
            that.byId("odInput").setPlaceholder("Object Dependency");
            that.byId("odInput").setShowValueHelp(true);
          }
        },

        /**
         * This function is called when click on button Run Prediction Model.
         * In this will get a confirmation popup if overwrite checkbox is selected.
         * @param {object} oEvent -the event information.
         */
        onRun2: function () {
          var cSelected = that.byId("idCheck").getSelected();
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
                  // calling function if selected Yes.
                  that.onRunSend();
                }
              },
            });
          } else {
            that.onRunSend();
          }
        },

        fnSuccess: function () {

            console.log("Successfully sent to backend");
            
            },
            
            fnError:function () {
            
            console.log("Failed to sent to backend")
            
            },

        onRunSend: function () {

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
            vRuleslist;
          aItems = this.oODList.getSelectedItems();
          (oProdItems = this.oProdList.getSelectedItems()),
            (cSelected = that.byId("idCheck").getSelected());
          oSelModelVer = this.byId("idModelVer").getSelectedKey();
          oSelType = this.byId("idType").getSelectedKey();
          oSelVer = this.oVer.getValue();
          oSelScen = this.oScen.getValue();

          
            
            var mParameters = {
            
            method: "POST",
            
            urlParameters: {
            
          "override": true,
          "Location": aItems[0].getInfo(),
          "Product": aItems[0].getDescription(),
          "GroupID": aItems[0].getTitle(),
          "Type": oSelType,
          "modelVersion": oSelModelVer,
          "version": oSelVer,
          "scenario": oSelScen,
          "profile": "",
          "dimensions": ""
            
            },
            
            context: null,
            
            success: that.fnSuccess(),
            
            error: that.fnError(),
            
            async: true };
            
            this.getModel("PModel").callFunction("/genPredictions", mParameters);

        //   var oEntry = {};

        //   oEntry.override = true;
        //   oEntry.Location = aItems[0].getInfo();
        //   oEntry.Product = aItems[0].getDescription();
        //   oEntry.GroupID = aItems[0].getTitle();
        //   oEntry.Type = oSelType;
        //   oEntry.modelVersion = oSelModelVer;
        //   oEntry.version = oSelVer;
        //   oEntry.scenario = oSelScen;
        //   oEntry.profile = "";
        //   oEntry.dimensions = "";

        // this.getModel("PModel").create("/genPredictions", oEntry, {
        //   success: function (oData) {
        //     that.verModel.setData(oData);
        //     that.oVerList.setModel(that.verModel);
        //   },
        //   error: function (oData, error) {
        //     MessageToast.show("error");
        //   },
        // });
        },

        /**
         * This function is called when click on Yes button in confirmation popup.
         * In this function will get the Prediction model data.
         * In this function if All Products and Obj Dep are selected then sending filter as All for both,
         * or if some items are selected then sending the selected items in filters.
         * @param {object} oEvent -the event information.
         */
        onRunSend1: function () {
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
            vRuleslist;
          aItems = this.oODList.getSelectedItems();
          (oProdItems = this.oProdList.getSelectedItems()),
            (cSelected = that.byId("idCheck").getSelected());
          oSelModelVer = this.byId("idModelVer").getSelectedKey();
          oSelType = this.byId("idType").getSelectedKey();
          oSelVer = this.oVer.getValue();
          oSelScen = this.oScen.getValue();

          if (
            this.oObjDep.getTokens().length > 0 &&
            this.oVer.getValue() &&
            this.oScen.getValue()
          ) {
            if (
              aItems[0].getTitle() === "All" &&
              oProdItems[0].getTitle() === "All"
            ) {
              var oEntry = {
                  vcRulesList: [],
                },
                vRuleslist;
              vRuleslist = {
                override: true,
                Location: aItems[1].getInfo(),
                Product: "All",
                GroupID: "All",
                Type: oSelType,
                modelVersion: oSelModelVer,
                version: oSelVer,
                scenario: oSelScen,
              };
              oEntry.vcRulesList.push(vRuleslist);

              //   var oFilters = [];
              //   var sFilter = new sap.ui.model.Filter({
              //     path: "override",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: true,
              //   });
              //   oFilters.push(sFilter);

              //   sFilter = new sap.ui.model.Filter({
              //     path: "Location",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: aItems[1].getInfo(),
              //   });
              //   oFilters.push(sFilter);

              //   var sFilter = new sap.ui.model.Filter({
              //     path: "Product",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: "All",
              //   });
              //   oFilters.push(sFilter);

              //   var sFilter = new sap.ui.model.Filter({
              //     path: "GroupID",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: "All",
              //   });
              //   oFilters.push(sFilter);

              //   var sFilter = new sap.ui.model.Filter({
              //     path: "Type",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: oSelType,
              //   });
              //   oFilters.push(sFilter);

              //   var sFilter = new sap.ui.model.Filter({
              //     path: "modelVersion",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: oSelModelVer,
              //   });
              //   oFilters.push(sFilter);

              //   var sFilter = new sap.ui.model.Filter({
              //     path: "version",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: oSelVer,
              //   });
              //   oFilters.push(sFilter);

              //   var sFilter = new sap.ui.model.Filter({
              //     path: "scenario",
              //     operator: sap.ui.model.FilterOperator.EQ,
              //     value1: oSelScen,
              //   });
              //   oFilters.push(sFilter);

              var oEntry = {};

                  oEntry.override = true;
                  oEntry.Location = aItems[1].getInfo();
                  oEntry.Product = "All";
                  oEntry.GroupID = "All";
                  oEntry.Type = oSelType;
                  oEntry.modelVersion = oSelModelVer;
                  oEntry.version = oSelVer;
                  oEntry.scenario = oSelScen;

                this.getModel("PModel").create("/genPredictions", oEntry, {
                  success: function (oData) {
                    that.verModel.setData(oData);
                    that.oVerList.setModel(that.verModel);
                  },
                  error: function (oData, error) {
                    MessageToast.show("error");
                  },
                });

            //   that.getModel("PModel").callFunction("/genPredictions", {
            //     method: "POST",
            //     urlParameters: {
            //       vcRulesList: oEntry.vcRulesList,
            //       // override: true,
            //       // Location: aItems[1].getInfo(),
            //       // Product: "All",
            //       // GroupID: "All",
            //       // Type: oSelType,
            //       // modelVersion: oSelModelVer,
            //       // version: oSelVer,
            //       // scenario: oSelScen,
            //     },
            //     success: function (data) {
            //       that.rowData = data.results;
            //       sap.ui.core.BusyIndicator.hide();
            //     },
            //     error: function (data) {
            //       sap.ui.core.BusyIndicator.hide();
            //       sap.m.MessageToast.show(JSON.stringify(data));
            //     },
            //   });

              // var uri = "/v2/pal/genPredictions";
              // $.ajax({
              //   url: uri,
              //   type: "POST",
              //   contentType: "application/json",
              //   data: JSON.stringify({
              //     vcRulesList: oEntry.vcRulesList,
              //   }),
              //   dataType: "json",
              //   async: false,
              //   timeout: 0,
              //   error: function (data) {
              //     sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
              //   },
              //   success: function (data) {
              //     sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
              //     regData.push(data.d.values[0].vcRulesList);

              //     that.otabModel.setData({
              //       results: regData[0],
              //     });
              //     that.byId("pmdlList").setModel(that.otabModel);
              //     that.oPanel.setProperty("visible", true);
              //     vFlag = "X";
              //   },
              // });
            } else {
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() !== "All") {
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
              }
              var uri = "/v2/pal/genPredictions";

              $.ajax({
                url: uri,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                  vcRulesList: oEntry.vcRulesList,
                }),
                dataType: "json",
                async: false,
                timeout: 0,
                error: function (data) {
                  sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                },
                success: function (data) {
                  sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
                  regData.push(data.d.values[0].vcRulesList);

                  that.otabModel.setData({
                    results: regData[0],
                  });
                  that.byId("pmdlList").setModel(that.otabModel);
                  that.oPanel.setProperty("visible", true);
                  vFlag = "X";
                },
              });
            }
            if (vFlag === "X") {
              that.resetInputs();
            }
          } else {
            MessageToast.show(that.i18n.getText("errInput"));
          }
        },

        /**
         * This function is called when click on Reset button.
         * This function will remove all the values from input boxes.
         */
        resetInputs: function () {
          this.oLoc.setValue("");
          this.oVer.setValue("");
          this.oScen.setValue("");
          this.oObjDep.destroyTokens();
          this.oLocList.removeSelections();
          this.oODList.removeSelections();
          this.oPredProfile.destroyTokens();
          this.oPPFList.removeSelections();
          this.oProd.destroyTokens();
          this.oProdList.removeSelections();
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
      }
    );
  }
);
