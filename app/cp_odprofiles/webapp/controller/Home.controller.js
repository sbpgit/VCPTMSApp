sap.ui.define(
  [
    "cp/odp/cpodprofiles/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    MessageToast,
    MessageBox,
    JSONModel,
    Filter,
    FilterOperator,
    Device,
    Fragment
  ) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("cp.odp.cpodprofiles.controller.Home", {
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
        that.oProfileModel = new JSONModel();

        that.locModel = new JSONModel();
        that.prodModel = new JSONModel();
        that.CompModel = new JSONModel();
        that.ObjDepModel = new JSONModel();

        this.oListModel.setSizeLimit(5000);
        that.locModel.setSizeLimit(1000);
        that.prodModel.setSizeLimit(1000);
        that.CompModel.setSizeLimit(1000);
        that.ObjDepModel.setSizeLimit(1000);

        this._oCore = sap.ui.getCore();
        if (!this._valueHelpDialogLoc) {
          this._valueHelpDialogLoc = sap.ui.xmlfragment(
            "cp.odp.cpodprofiles.view.LocDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogLoc);
        }
        if (!this._valueHelpDialogProd) {
          this._valueHelpDialogProd = sap.ui.xmlfragment(
            "cp.odp.cpodprofiles.view.ProdDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogProd);
        }
        if (!this._valueHelpDialogComp) {
          this._valueHelpDialogComp = sap.ui.xmlfragment(
            "cp.odp.cpodprofiles.view.ComponentDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogComp);
        }
        if (!this._valueHelpDialogObjDep) {
          this._valueHelpDialogObjDep = sap.ui.xmlfragment(
            "cp.odp.cpodprofiles.view.ObjDepDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogObjDep);
        }
        this.getRouter()
          .getRoute("Home")
          .attachPatternMatched(this._onPatternMatched.bind(this));
      },
      _onPatternMatched: function () {
        that = this;
        that.oList = this.byId("idTab");
        this.oLoc = this.byId("locInput");
        this.oProd = this.byId("prodInput");
        this.oComp = this.byId("compInput");
        this.oObjDep = this.byId("objDepInput");

        this.oProdList = this._oCore.byId(
          this._valueHelpDialogProd.getId() + "-list"
        );
        this.oLocList = this._oCore.byId(
          this._valueHelpDialogLoc.getId() + "-list"
        );
        this.oCompList = this._oCore.byId(
          this._valueHelpDialogComp.getId() + "-list"
        );
        this.oObjDepList = this._oCore.byId(
          this._valueHelpDialogObjDep.getId() + "-list"
        );

        that.oList.removeSelections();
        // Calling function
        this.getData();
      },
      getData: function () {
        sap.ui.core.BusyIndicator.show();
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
      },

      handleValueHelp: function (oEvent) {
        var sId = oEvent.getParameter("id");
        if (sId.includes("loc")) {
          that._valueHelpDialogLoc.open();
        } else if (sId.includes("prod")) {
          if (that.byId("idloc").getValue()) {
            that._valueHelpDialogProd.open();
          } else {
            MessageToast.show("Select Location");
          }
        } else if (sId.includes("comp")) {
          if (
            that.byId("idloc").getValue() &&
            that.byId("prodInput").getTokens().length !== 0
          ) {
            //         var aSelectedItem = that.oProdList.getSelectedItems();

            //         var oFilters = [];
            //         var sFilter = new sap.ui.model.Filter({
            //             path: "LOCATION_ID",
            //             operator: sap.ui.model.FilterOperator.EQ,
            //             value1: that.oLoc.getValue()
            //         });
            //         oFilters.push(sFilter);

            //         for(var i=0; i < aSelectedItem.length; i++){

            //             sFilter = new sap.ui.model.Filter({
            //             path: "PRODUCT_ID",
            //             operator: sap.ui.model.FilterOperator.EQ,
            //             value1: aSelectedItem[i].getTitle()
            //             });
            //                 oFilters.push(sFilter);

            //         }

            //         this.getModel("BModel").read("/getBomOdCond", {
            //             filters: oFilters,
            //             success: function (oData) {

            //                 that.CompModel.setData(oData);
            //                 that.oCompList.setModel(that.CompModel);

            //                 that.ObjDepModel.setData(oData);
            //                 that.oObjDepList.setModel(that.ObjDepModel);
            //                 that._valueHelpDialogComp.open();

            //     },
            //     error: function (oData, error) {
            //       MessageToast.show("error");
            //     },
            //   });
            that._valueHelpDialogComp.open();
          } else {
            MessageToast.show("No Product Location selected");
          }
        } else if (sId.includes("objDep")) {
          if (
            that.byId("idloc").getValue() &&
            that.byId("prodInput").getTokens().length !== 0
          ) {
            that._valueHelpDialogObjDep.open();
          } else {
            MessageToast.show("No Product Location selected");
          }
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
        } else if (sId.includes("comp")) {
            that._oCore
              .byId(this._valueHelpDialogComp.getId() + "-searchField")
              .setValue("");
            if (that.oCompList.getBinding("items")) {
              that.oCompList.getBinding("items").filter([]);
            }
          } else if (sId.includes("press")) {
            that._oCore
              .byId(this._valueHelpDialogObjDep.getId() + "-searchField")
              .setValue("");
            if (that.oObjDepList.getBinding("items")) {
              that.oObjDepList.getBinding("items").filter([]);
            }
          }
        else if (sId.includes("prod")) {
          that._oCore
            .byId(this._valueHelpDialogObjDep.getId() + "-searchField")
            .setValue("");
          if (that.oObjDepList.getBinding("items")) {
            that.oObjDepList.getBinding("items").filter([]);
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
        if (sId.includes("Loc")) {
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
        } else if (sId.includes("Comp")) {
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("COMPONENT", FilterOperator.Contains, query),
                  new Filter("ITEM_NUM", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oCompList.getBinding("items").filter(oFilters);
        } else if (sId.includes("ObjDep")) {
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("OBJ_DEP", FilterOperator.Contains, query),
                  new Filter("OBJDEP_DESC", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oObjDepList.getBinding("items").filter(oFilters);
        }
      },

      handleSelection: function (oEvent) {
        var sId = oEvent.getParameter("id"),
          oItem = oEvent.getParameter("selectedItems"),
          aSelectedItems,
          aODdata = [];
        //Location list
        if (sId.includes("Loc")) {
          this.oLoc = that.byId("idloc");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oLoc.setValue(aSelectedItems[0].getTitle());
          that.oProd.removeAllTokens();
          that.oComp.removeAllTokens();
          that.oObjDep.removeAllTokens();
          this._valueHelpDialogProd
            .getAggregation("_dialog")
            .getContent()[1]
            .removeSelections();
          this._valueHelpDialogComp
            .getAggregation("_dialog")
            .getContent()[1]
            .removeSelections();
          this._valueHelpDialogObjDep
            .getAggregation("_dialog")
            .getContent()[1]
            .removeSelections();
          this.getModel("BModel").read("/getLocProdDet", {
            filters: [
              new Filter(
                "LOCATION_ID",
                FilterOperator.EQ,
                aSelectedItems[0].getTitle()
              ),
            ],
            success: function (oData) {
              that.prodModel.setData(oData);
              that.oProdList.setModel(that.prodModel);
            },
            error: function (oData, error) {
              MessageToast.show("error");
            },
          });

          // Prod list
        } else if (sId.includes("prod")) {
          this.oProd = that.byId("prodInput");
          aSelectedItems = oEvent.getParameter("selectedItems");
          //   that.oProd.setValue(aSelectedItems[0].getTitle());
          that.oComp.removeAllTokens();
          that.oObjDep.removeAllTokens();
          this._valueHelpDialogComp
            .getAggregation("_dialog")
            .getContent()[1]
            .removeSelections();
          this._valueHelpDialogObjDep
            .getAggregation("_dialog")
            .getContent()[1]
            .removeSelections();
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
            if (
              that.byId("idloc").getValue() &&
              that.byId("prodInput").getTokens().length !== 0
            ) {
              var aSelectedItem = that.oProdList.getSelectedItems();

              var oFilters = [];
              var sFilter = new sap.ui.model.Filter({
                path: "LOCATION_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: that.oLoc.getValue(),
              });
              oFilters.push(sFilter);

              for (var i = 0; i < aSelectedItem.length; i++) {
                sFilter = new sap.ui.model.Filter({
                  path: "PRODUCT_ID",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: aSelectedItem[i].getTitle(),
                });
                oFilters.push(sFilter);
              }

              this.getModel("BModel").read("/getBomOdCond", {
                filters: oFilters,
                success: function (oData) {
                  that.odCondData = oData.results;

                  that.CompModel.setData(oData);
                  that.oCompList.setModel(that.CompModel);

                  // that.ObjDepModel.setData(oData);
                  // that.oObjDepList.setModel(that.ObjDepModel);
                },
                error: function (oData, error) {
                  MessageToast.show("error");
                },
              });
            } else {
              MessageToast.show("No Product Location selected");
            }
          } else {
            that.oProd.removeAllTokens();
          }
        } else if (sId.includes("Comp")) {
          this.oComp = that.byId("compInput");
          aSelectedItems = oEvent.getParameter("selectedItems");
          if (aSelectedItems && aSelectedItems.length > 0) {
            that.oComp.removeAllTokens();
            aSelectedItems.forEach(function (oItem) {
              that.oComp.addToken(
                new sap.m.Token({
                  key: oItem.getTitle(),
                  text: oItem.getTitle(),
                })
              );
            });

            if (
              that.byId("idloc").getValue() &&
              that.byId("prodInput").getTokens().length !== 0
            ) {
              var aSelectedItem = that.oProdList.getSelectedItems();
              var aSelectedComp = that.oCompList.getSelectedItems();

              var oFilters = [];
              var sFilter = new sap.ui.model.Filter({
                path: "LOCATION_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: that.oLoc.getValue(),
              });
              oFilters.push(sFilter);

              for (var i = 0; i < aSelectedItem.length; i++) {
                sFilter = new sap.ui.model.Filter({
                  path: "PRODUCT_ID",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: aSelectedItem[i].getTitle(),
                });
                oFilters.push(sFilter);
              }

              for (var i = 0; i < aSelectedComp.length; i++) {
                sFilter = new sap.ui.model.Filter({
                  path: "COMPONENT",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: aSelectedComp[i].getTitle(),
                });
                oFilters.push(sFilter);
              }

              this.getModel("BModel").read("/getBomOdCond", {
                filters: oFilters,
                success: function (oData) {
                  that.ObjDepModel.setData(oData);
                  that.oObjDepList.setModel(that.ObjDepModel);
                },
                error: function (oData, error) {
                  MessageToast.show("error");
                },
              });
            } else {
              MessageToast.show("No Product Location selected");
            }
          } else {
            that.oComp.removeAllTokens();
          }
        } else if (sId.includes("ObjDep")) {
          this.oObjDep = that.byId("objDepInput");
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
          } else {
            that.oObjDep.removeAllTokens();
          }
        }
        that.handleClose(oEvent);
      },

      onGetData: function () {
        that.oList.removeSelections();
        if (
          that.byId("idloc").getValue() &&
          that.byId("prodInput").getTokens().length !== 0 //&&
          //that.byId("compInput").getTokens().length !== 0 &&
        //  that.byId("objDepInput").getTokens().length !== 0
        ) {
          var aSelectedItem = that.oProdList.getSelectedItems();
          var aSelectedComp = that.oCompList.getSelectedItems();
          var aSelectedObjDep = that.oObjDepList.getSelectedItems();

          var oFilters = [];
          var sFilter = new sap.ui.model.Filter({
            path: "LOCATION_ID",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: that.oLoc.getValue(),
          });
          oFilters.push(sFilter);

          for (var i = 0; i < aSelectedItem.length; i++) {
            sFilter = new sap.ui.model.Filter({
              path: "PRODUCT_ID",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: aSelectedItem[i].getTitle(),
            });
            oFilters.push(sFilter);
          }

          for (var i = 0; i < aSelectedComp.length; i++) {
            sFilter = new sap.ui.model.Filter({
              path: "COMPONENT",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: aSelectedComp[i].getTitle(),
            });
            oFilters.push(sFilter);
          }

          for (var i = 0; i < aSelectedObjDep.length; i++) {
            sFilter = new sap.ui.model.Filter({
              path: "OBJ_DEP",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: aSelectedObjDep[i].getTitle(),
            });
            oFilters.push(sFilter);
          }

          this.getModel("BModel").read("/getODProfiles", {
            filters: oFilters,
            success: function (oData) {
              that.oListModel.setData({
                results: oData.results,
              });
              that.oList.setModel(that.oListModel);
            },
            error: function (oData, error) {
              MessageToast.show("error");
            },
          });
        } else {
          MessageToast.show("Select all filter to get data");
        }
      },

      onAssign: function () {
        that.oGModel = that.getModel("oGModel");
        var selTabItem = that.byId("idTab").getSelectedItems();
        if (selTabItem.length) {
          if (!that._onProfiles) {
            that._onProfiles = sap.ui.xmlfragment(
              "cp.odp.cpodprofiles.view.Profiles",
              that
            );
            that.getView().addDependent(that._onProfiles);
          }

          that.oProfileList = sap.ui.getCore().byId("idListTab");
          that._onProfiles.setTitleAlignment("Center");
          this.getModel("BModel").read("/getProfiles", {
            success: function (oData) {
              that.oProfileModel.setData({
                results: oData.results,
              });
              that.oProfileList.setModel(that.oProfileModel);

              that._onProfiles.open();
              that.oGModel.setProperty("/selItem", selTabItem);
            },
            error: function () {
              MessageToast.show("Failed to get profiles");
            },
          });
        } else {
          MessageToast.show("Please select atleast one item to assign profile");
        }
      },

      handleProfileClose: function () {
        that.byId("idTab").removeSelections();
        that._onProfiles.close();
      },

      handleprofileSearch: function (oEvent) {
        var query =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (query !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("PROFILE", FilterOperator.Contains, query),
                new Filter("PRF_DESC", FilterOperator.Contains, query),
              ],
              and: false,
            })
          );
        }
        that.oProfileList.getBinding("items").filter(oFilters);
      },

      onTableSearch: function (oEvent) {
        var query =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (query !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("LOCATION_ID", FilterOperator.Contains, query),
                new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                new Filter("COMPONENT", FilterOperator.Contains, query),
                new Filter("OBJ_DEP", FilterOperator.Contains, query),
                new Filter("STRUC_NODE", FilterOperator.Contains, query),
                new Filter("PROFILE", FilterOperator.Contains, query),
              ],
              and: false,
            })
          );
        }
        that.oList.getBinding("items").filter(oFilters);
      },

      onProfileSel: function (oEvent) {
        var sItem = that.oGModel.getProperty("/selItem"),
          aData = {
            PROFILEOD: [],
          },
          jsonProfileOD,
          sProfile = sap.ui.getCore().byId("idListTab").getSelectedItems()[0].getTitle();
        var selected;
        for (var i = 0; i < sItem.length; i++) {
          selected = sItem[i].getBindingContext().getProperty();
          jsonProfileOD = {
            LOCATION_ID: selected.LOCATION_ID,
            PRODUCT_ID: selected.PRODUCT_ID,
            COMPONENT: selected.COMPONENT,
            OBJ_DEP: selected.OBJ_DEP,
            STRUC_NODE: selected.STRUC_NODE,
            PROFILE: sProfile,
          };
          aData.PROFILEOD.push(jsonProfileOD);
          jsonProfileOD = {};
        }

        var uri = "v2/catalog/genProfileOD";

        $.ajax({
          url: uri,
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            FLAG: "I",
            PROFILEOD: aData.PROFILEOD,
          }),
          dataType: "json",
          async: false,
          timeout: 0,
          error: function (data) {
            sap.m.MessageToast.show("Error in assigning Profiles");
            sap.ui.core.BusyIndicator.hide();
            that.handleProfileClose();
          },
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Profile assigned successfully");
            that.handleProfileClose();
            that.onGetData();
          },
        });
      },

      onUnAssign: function () {
        var aData = {
            PROFILEOD: [],
          },
          jsonProfileOD;
        var selected;
        var sItem = that.byId("idTab").getSelectedItems();
        for (var i = 0; i < sItem.length; i++) {
          selected = sItem[i].getBindingContext().getProperty();
          jsonProfileOD = {
            LOCATION_ID: selected.LOCATION_ID,
            PRODUCT_ID: selected.PRODUCT_ID,
            COMPONENT: selected.COMPONENT,
            OBJ_DEP: selected.OBJ_DEP,
            PROFILE: selected.PROFILE,
          };
          aData.PROFILEOD.push(jsonProfileOD);
          jsonProfileOD = {};
        }

        var uri = "v2/catalog/genProfileOD";

        $.ajax({
          url: uri,
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            FLAG: "D",
            PROFILEOD: aData.PROFILEOD,
          }),
          dataType: "json",
          async: false,
          timeout: 0,
          error: function (data) {
            sap.m.MessageToast.show("Error in unassigning Profiles");
            sap.ui.core.BusyIndicator.hide();
          },
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Profile unassigned successfully");
            that.onGetData();
          },
        });
      },
    });
  }
);
