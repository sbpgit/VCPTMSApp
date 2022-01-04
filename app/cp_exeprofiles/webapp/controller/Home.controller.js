sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cp/runprofiles/cpexeprofiles/controller/BaseController",
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
        "cp.runprofiles.cpexeprofiles.controller.Home",
        {
          onInit: function () {
            this.locModel = new JSONModel();
            this.prodModel = new JSONModel();
            this.odModel = new JSONModel();
            this.ppfModel = new JSONModel();
            this._oCore = sap.ui.getCore();
            if (!this._valueHelpDialogLoc) {
              this._valueHelpDialogLoc = sap.ui.xmlfragment(
                "cp.runprofiles.cpexeprofiles.view.LocDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogLoc);
            }
            if (!this._valueHelpDialogProd) {
              this._valueHelpDialogProd = sap.ui.xmlfragment(
                "cp.runprofiles.cpexeprofiles.view.ProdDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogProd);
            }
            if (!this._valueHelpDialogOD) {
              this._valueHelpDialogOD = sap.ui.xmlfragment(
                "cp.runprofiles.cpexeprofiles.view.ObjDepDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogOD);
            }
            if (!this._valueHelpDialogPPF) {
              this._valueHelpDialogPPF = sap.ui.xmlfragment(
                "cp.runprofiles.cpexeprofiles.view.PredProfileDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogPPF);
            }
            this.getRouter()
              .getRoute("Home")
              .attachPatternMatched(this._onPatternMatched.bind(this));
          },
          _onPatternMatched: function () {
            that = this;
            this.i18n = this.getResourceBundle();
            this.oGModel = this.getModel("GModel");
            this.oLoc = this.byId("locInput");
            this.oProd = this.byId("prodInput");
            this.oObjDep = this.byId("odInput");
            this.oPredProfile = this.byId("pmInput");
            this.aVcRulesList = [];
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
            this.getModel("BModel").read("/getLocation", {
              success: function (oData) {
                that.locModel.setData(oData);
                that.oLocList.setModel(that.locModel);
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
            this.getModel("BModel").read("/getProducts", {
              success: function (oData) {
                that.prodModel.setData(oData);
                that.oProdList.setModel(that.prodModel);
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
            this.getModel("BModel").read("/getODHdr", {
              success: function (oData) {
                that.odModel.setData(oData);
                that.oODList.setModel(that.odModel);
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
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
          onRun: function () {
            this.oModel = this.getModel("PModel");
            var oEntry = [];
            var vVcRulesList = {
              vcRulesList: [],
            };
            var vruleslist = {
              Location: "FR10",
              Product: "KM_M219VBVS_BVS",
              GroupID: "M219VV00105NN_1",
            };
            vVcRulesList.vcRulesList.push(vruleslist);
  
            this.oModel.create("/generateRegModels", vVcRulesList, {
              success: function (oData) {
                //MessageToast.show("success");              
              },
              error: function (oError) {
                MessageToast.show("error");
              },
            });
          //   this.oModel.create("/generatePredictions", vVcRulesList, {
          //     success: function (oData) {
          //       MessageToast.show("success");
          //     },
          //     error: function (oError) {
          //       MessageToast.show("error");
          //     },
          //   });
            // oModel.read("/generateRegModels",{
            //     filters: oEntry,
            //     success: function (oData) {
            //         MessageToast.show("success");
            // 	},
            // 	error: function (oError) {
            // 		MessageToast.show("error");
            // 	}
            // }
            // );
            //oModel.setUseBatch(true);
            // oModel.createEntry("/generateRegModels", {
            //     properties: oEntry
            // });
            // oModel.submitChanges({
            // 	success: function (oData) {
            // 		// MessageToast.show(that.i18n.getText("saveSessTabsSuc"));
            // 	},
            // 	error: function (oError) {
            // 		MessageToast.show("error");
            // 	}
            // });
          },
          handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            if (sId.includes("loc")) {
              this._valueHelpDialogLoc.open();
            } else if (sId.includes("prod")) {
              this._valueHelpDialogProd.open();
            } else if (sId.includes("od")) {
              if (that.oLoc.getValue() && that.oProd.getTokens()) {
                if (this.oODList.getBinding("items")) {
                  this.oODList
                    .getBinding("items")
                    .filter([
                      new Filter(
                        "LOCATION_ID",
                        FilterOperator.Contains,
                        that.oLocList.getSelectedItem().getTitle()
                      ),
                      new Filter(
                        "PRODUCT_ID",
                        FilterOperator.Contains,
                        "KM_M219VBVS_BVS"
                      ),
                    ]);
                }
                this._valueHelpDialogOD.open();
              } else {
                MessageToast.show(that.i18n.getText("noLocProd"));
              }
            } else {
              this._valueHelpDialogPPF.open();
            }
          },
          handleClose: function (oEvent) {
            var sId = oEvent.getParameter("id");
            if (sId.includes("loc")) {
              that._oCore
                .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                .setValue("");
              if (that.oLocList.getBinding("items")) {
                that.oLocList.getBinding("items").filter([]);
              }
            } else if (sId.includes("prod")) {
              that._oCore
                .byId(this._valueHelpDialogProd.getId() + "-searchField")
                .setValue("");
              if (that.oProdList.getBinding("items")) {
                that.oProdList.getBinding("items").filter([]);
              }
            } else if (sId.includes("od")) {
              that._oCore
                .byId(this._valueHelpDialogOD.getId() + "-searchField")
                .setValue("");
              if (that.oODList.getBinding("items")) {
                that.oODList.getBinding("items").filter([]);
              }
            } else {
              that._oCore
                .byId(this._valueHelpDialogPPF.getId() + "-searchField")
                .setValue("");
              if (that.oPPFList.getBinding("items")) {
                that.oPPFList.getBinding("items").filter([]);
              }
            }
          },
          handleSearch: function (oEvent) {
            var query =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
              sId = oEvent.getParameter("id"),
              oFilters = [];
            // Check if search filter is to be applied
            query = query ? query.trim() : "";
            // Location
            if (sId.includes("loc")) {
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("LOCATION_ID", FilterOperator.Contains, query),
                      new Filter("LOCATION_DESC", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.oLocList.getBinding("items").filter(oFilters);
              // Product
            } else if (sId.includes("prod")) {
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                      new Filter("PROD_DESC", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.oProdList.getBinding("items").filter(oFilters);
              // Object Dependency
            } else if (sId.includes("od")) {
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("LOCATION_ID", FilterOperator.Contains, query),
                      new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                      new Filter("COMPONENT", FilterOperator.Contains, query),
                      new Filter("OBJ_DEP", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.oODList.getBinding("items").filter(oFilters);
              // Save dialog
            } else {
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("PROFILE", FilterOperator.Contains, query),
                      new Filter("METHOD", FilterOperator.Contains, query),
                      new Filter("PRF_DESC", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.oPPFList.getBinding("items").filter(oFilters);
            }
          },
          handleSelection: function (oEvent) {
            var sId = oEvent.getParameter("id"),
              oItem = oEvent.getParameter("selectedItems"),
              aSelectedItems;
            //Location list
            if (sId.includes("Loc")) {
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedItems[0].getTitle());
  
              // Prod list
            } else if (sId.includes("prod")) {
              that.oProdList.getBinding("items").filter([]);
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
              }
              //that.addToken("Prod", that.oProdList.getSelectedItems(), that.generateSideGangList);
              // Object ependency
            } else if (sId.includes("od")) {
              that.oODList.getBinding("items").filter([]);
              aSelectedItems = oEvent.getParameter("selectedItems");
              if (aSelectedItems && aSelectedItems.length > 0) {
                that.oObjDep.removeAllTokens();
                aSelectedItems.forEach(function (oItem) {
                  that.oObjDep.addToken(
                    new sap.m.Token({
                      key: oItem.getTitle(),
                      text: oItem.getTitle(),
                    })
                  );
                });
              }
            } else {
              that.oPPFList.getBinding("items").filter([]);
              aSelectedItems = oEvent.getParameter("selectedItems");
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
            } else if (sId.includes("od")) {
              aItems = that.oProdList.getSelectedItems();
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() === sRemovedTokenTitle) {
                  aItems[i].setSelected(false);
                }
              }
            } else if (sId.includes("pmInput")) {
              aItems = that.oProdList.getSelectedItems();
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() === sRemovedTokenTitle) {
                  aItems[i].setSelected(false);
                }
              }
            }
          },
          onRun2: function () {
              this.oModel = this.getModel("PModel");
              var oEntry = {
                vcRulesList: [],
              },
              aItems, vruleslist, i;
  
              aItems = this.oODList.getSelectedItems();
              if(this.oObjDep.getTOken() && this.oPredProfile.getTokens()){
              for ( i = 0; i < aItems.length; i++){
              vruleslist = {
                Location: aItems[i].getInfo(),
                Product: aItems[i].getDescription(),
                GroupID: aItems[i].getTitle()
              };
              oEntry.vcRulesList.push(vruleslist);
    
              this.oModel.create("/generateRegModels", oEntry, {
                success: function (oData) {
                  //MessageToast.show("success");
                  that.oModel.create("/generatePredictions", vVcRulesList, {
                    success: function (oData) {
                      MessageToast.show("success");
                    },
                    error: function (oError) {
                      MessageToast.show("error");
                    },
                  });
                },
                error: function (oError) {
                  MessageToast.show("error");
                },
              });
          }
      }
      else{
          MessageToast.show("noInput");
      }
              // oModel.read("/generateRegModels",{
              //     filters: oEntry,
              //     success: function (oData) {
              //         MessageToast.show("success");
              // 	},
              // 	error: function (oError) {
              // 		MessageToast.show("error");
              // 	}
              // }
              // );
              //oModel.setUseBatch(true);
              // oModel.createEntry("/generateRegModels", {
              //     properties: oEntry
              // });
              // oModel.submitChanges({
              // 	success: function (oData) {
              // 		// MessageToast.show(that.i18n.getText("saveSessTabsSuc"));
              // 	},
              // 	error: function (oError) {
              // 		MessageToast.show("error");
              // 	}
              // });
            },
        }
      );
    }
  );
  