sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "cp/exereg/cpexeregressionmdls/controller/BaseController",
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
      "cp.exereg.cpexeregressionmdls.controller.Home",
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
          this.otabModel = new JSONModel();
          this.prodModel.setSizeLimit(5000);
          this.odModel.setSizeLimit(5000);
          // Declaring fragments
          this._oCore = sap.ui.getCore();
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cp.exereg.cpexeregressionmdls.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cp.exereg.cpexeregressionmdls.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }
          if (!this._valueHelpDialogOD) {
            this._valueHelpDialogOD = sap.ui.xmlfragment(
              "cp.exereg.cpexeregressionmdls.view.ObjDepDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogOD);
          }
          if (!this._valueHelpDialogPPF) {
            this._valueHelpDialogPPF = sap.ui.xmlfragment(
              "cp.exereg.cpexeregressionmdls.view.PredDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogPPF);
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
          this.oTable = this.byId("rmdlList");
          this.i18n = this.getResourceBundle();
          this.oGModel = this.getModel("GModel");
          this.oLoc = this.byId("locInput");
          this.oProd = this.byId("prodInput");
          this.oObjDep = this.byId("odInput");
          this.oPredProfile = this.byId("pmInput");
          this.aVcRulesList = [];
          that._valueHelpDialogLoc.setTitleAlignment("Center");
          that._valueHelpDialogProd.setTitleAlignment("Center");
          that._valueHelpDialogOD.setTitleAlignment("Center");
          that._valueHelpDialogPPF.setTitleAlignment("Center");

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
                  that.onRunSend();
                }
              },
            });
          } else {
            that.onRunSend();
          }
        },

        /*
         * This function is called when click on Yes button in confirmation popup.
         * In this function will get the Regression model data.
         * In this function if All Products and Obj Dep are selected then sending filter as All for both,
         * or if some items are selected then sending the selected items in filters.
         * @param {object} oEvent -the event information.
         */
        onRunSend: function () {
          this.oModel = this.getModel("PModel");
          var aItems,
            oProdItems,
            oPredProfile,
            cSelected,
            i,
            regData = [],
            vFlag;
          var oEntry = {
              vcRulesList: [],
            },
            vRuleslist;

          var oMdlVer = that.byId("idmdlver").getSelectedKey(),
            vMdlVer;
          aItems = this.oODList.getSelectedItems();
          (oProdItems = this.oProdList.getSelectedItems()),
            (oPredProfile = that.oPredProfile.getTokens()[0].getText()),
            (cSelected = that.byId("idCheck").getSelected());
          if (oMdlVer === "act") {
            vMdlVer = "Active";
          } else {
            vMdlVer = "Simulation";
          }

          if (
            this.oObjDep.getTokens().length > 0 &&
            this.oPredProfile.getTokens().length > 0
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
                profile: oPredProfile,
                override: cSelected,
                Location: aItems[1].getInfo(),
                Product: "All",
                GroupID: "All",
                Type: "OD",
                modelVersion: vMdlVer,
              };
              oEntry.vcRulesList.push(vRuleslist);

              var uri = "/v2/pal/generateRegModels";
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
                  sap.m.MessageToast.show(that.i18n.getText("genRegErr"));
                },
                success: function (data) {
                  sap.m.MessageToast.show(that.i18n.getText("genRegSucc"));
                  regData.push(data.d.values[0].vcRulesList);

                  that.otabModel.setData({
                    results: regData[0],
                  });
                  that.byId("rmdlList").setModel(that.otabModel);
                  that.oPanel.setProperty("visible", true);
                  vFlag = "X";
                },
              });
            } else {
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() !== "All") {
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
              }
              var uri = "/v2/pal/generateRegModels";
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
                  sap.m.MessageToast.show(that.i18n.getText("genRegErr"));
                },
                success: function (data) {
                  sap.m.MessageToast.show(that.i18n.getText("genRegSucc"));
                  regData.push(data.d.values[0].vcRulesList);

                  that.otabModel.setData({
                    results: regData[0],
                  });
                  that.byId("rmdlList").setModel(that.otabModel);
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
          } else if (sId.includes("od")) {
            if (that.oLoc.getValue() && that.oProd.getTokens().length !== 0) {
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
                  if (aSelectedProd.length > 0) {
                    if (
                      that.oProdList.getSelectedItems()[0].getTitle() === "All"
                    ) {
                      that._valueHelpDialogOD
                        .getAggregation("_dialog")
                        .getContent()[1]
                        .selectAll();
                    }
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
          } else {
            // Prediction Profiles Dialog
            this._valueHelpDialogPPF.open();
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
          } else if (sId.includes("od")) {
            that._oCore
              .byId(this._valueHelpDialogOD.getId() + "-searchField")
              .setValue("");
            if (that.oODList.getBinding("items")) {
              that.oODList.getBinding("items").filter([]);
            }
            // Prediction Profile
          } else {
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
            // Porfile dialog
          } else {
            if (sQuery !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("PROFILE", FilterOperator.Contains, sQuery),
                    new Filter("METHOD", FilterOperator.Contains, sQuery),
                    new Filter("PRF_DESC", FilterOperator.Contains, sQuery),
                  ],
                  and: false,
                })
              );
            }
            that.oPPFList.getBinding("items").filter(oFilters);
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
            aSelectedItems;
          //Location list
          if (sId.includes("Loc")) {
            aSelectedItems = oEvent.getParameter("selectedItems");
            that.oLoc.setValue(aSelectedItems[0].getTitle());

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
                  aSelectedItems[0].getTitle()
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
            that.oProdList.getBinding("items").filter([]);
            that.oObjDep.removeAllTokens();
            this._valueHelpDialogOD
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
            aSelectedItems = oEvent.getParameter("selectedItems");
            if (aSelectedItems && aSelectedItems.length > 0) {
              that.oProd.removeAllTokens();
              aSelectedItems.forEach(function (oItem) {
                that.oProd.addToken(
                  new sap.m.Token({
                    key: oItem.getTitle(),
                    text: oItem.getTitle(),
                  })
                );
              });
            } else {
              that.oProd.removeAllTokens();
            }
            // Object ependency
          } else if (sId.includes("od")) {
            that.oODList.getBinding("items").filter([]);
            aSelectedItems = oEvent.getParameter("selectedItems");
            if (aSelectedItems && aSelectedItems.length > 0) {
              if (aSelectedItems[0].getTitle() === "All") {
                that.byId("idCheck").setSelected(true);
              } else {
                that.byId("idCheck").setSelected(false);
              }
              that.oObjDep.removeAllTokens();
              aSelectedItems.forEach(function (oItem) {
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

            // Pred Dialog
          } else {
            that.oPPFList.getBinding("items").filter([]);
            aSelectedItems = oEvent.getParameter("selectedItems");
            that.oPredProfile.removeAllTokens();
            if (aSelectedItems && aSelectedItems.length > 0) {
              aSelectedItems.forEach(function (oItem) {
                that.oPredProfile.addToken(
                  new sap.m.Token({
                    key: oItem.getTitle(),
                    text: oItem.getTitle(),
                  })
                );
              });
            }
          }
          that.handleClose(oEvent);
        },

        /**
         * This function is called when selecting and unselecting the multiple items in dialogs.
         * Tockens will be updated based on sId.
         * @param {object} oEvent -the event information.
         */
        handleTokenUpdate: function (oEvent) {
          var sId = oEvent.getSource().getId(),
            oRTokens = oEvent.getParameter("removedTokens"),
            sRemovedTokenTitle,
            aItems,
            i;
          if (oRTokens) {
            sRemovedTokenTitle = oRTokens[0].getProperty("key");
          } else {
            sRemovedTokenTitle = oEvent.getParameter("item").getName();
          }
          //Prod list
          if (sId.includes("prod")) {
            aItems = that.oProdList.getSelectedItems();
            for (i = 0; i < aItems.length; i++) {
              if (aItems[i].getTitle() === sRemovedTokenTitle) {
                aItems[i].setSelected(false);
              }
            }

            // ObjDep List
          } else if (sId.includes("od")) {
            aItems = that.oProdList.getSelectedItems();
            for (i = 0; i < aItems.length; i++) {
              if (aItems[i].getTitle() === sRemovedTokenTitle) {
                aItems[i].setSelected(false);
              }
            }

            // Prediction Profile
          } else if (sId.includes("pmInput")) {
            aItems = that.oProdList.getSelectedItems();
            for (i = 0; i < aItems.length; i++) {
              if (aItems[i].getTitle() === sRemovedTokenTitle) {
                aItems[i].setSelected(false);
              }
            }
          }
        },

        // Getting CSRF Token
        getToken: function () {
          var token;
          $.ajax({
            url: "/v2/pal",
            method: "GET",
            async: false,
            headers: {
              "X-CSRF-Token": "Fetch",
            },
            success: function (result, xhr, data) {
              token = data.getResponseHeader("X-CSRF-Token");
            },
          });
          return token;
        },

        /**
         * This function is called when click on Reset button.
         * This function will remove all the values from input boxes.
         */
        resetInputs: function () {
          this.oLoc.setValue("");
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
          var oItems = sap.ui.getCore().byId("prodSlctList").getItems();
          var oSelItems = this._valueHelpDialogProd
            .getAggregation("_dialog")
            .getContent()[1]
            .getSelectedItems();
          if (
            oSelected === "All" &&
            oEvent.getParameter("selected") &&
            oItems.length !== 1
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
          } else if (oSelected === "All" && oItems.length === 1) {
            sap.ui
              .getCore()
              .byId("prodSlctList")
              .getItems()[0]
              .setSelected(false);
          } else if (
            oSelected !== "All" &&
            !oEvent.getParameter("selected") &&
            oItems.length - 1 === oSelItems.length
          ) {
            sap.ui
              .getCore()
              .byId("prodSlctList")
              .getItems()[0]
              .setSelected(false);
          } else if (
            oSelected !== "All" &&
            oEvent.getParameter("selected") &&
            oItems.length - 1 === oSelItems.length
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
          var oItems = sap.ui.getCore().byId("odSlctList").getItems();
          var oSelItems = this._valueHelpDialogOD
            .getAggregation("_dialog")
            .getContent()[1]
            .getSelectedItems();
          if (
            oSelected === "All" &&
            oEvent.getParameter("selected") &&
            oItems.length !== 1
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
            oItems.length - 1 === oSelItems.length
          ) {
            sap.ui
              .getCore()
              .byId("odSlctList")
              .getItems()[0]
              .setSelected(false);
          } else if (
            oSelected !== "All" &&
            oEvent.getParameter("selected") &&
            oItems.length - 1 === oSelItems.length
          ) {
            sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(true);
          } else if (oSelected === "All" && oItems.length === 1) {
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
