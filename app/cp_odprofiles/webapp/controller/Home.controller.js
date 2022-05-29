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
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;
          // Declaring JSON Models and size limits
          that.oListModel = new JSONModel();
          that.oProfileModel = new JSONModel();
          that.locModel = new JSONModel();
          that.prodModel = new JSONModel();
          that.CompModel = new JSONModel();
          that.StruNodeModel = new JSONModel();
  
          this.oListModel.setSizeLimit(5000);
          that.locModel.setSizeLimit(1000);
          that.prodModel.setSizeLimit(1000);
          that.CompModel.setSizeLimit(1000);
          that.StruNodeModel.setSizeLimit(1000);
  
          // Declaring Value Help Dialogs
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
          if (!this._valueHelpDialogStruNode) {
              this._valueHelpDialogStruNode = sap.ui.xmlfragment(
                "cp.odp.cpodprofiles.view.StructureNodes",
                this
              );
              this.getView().addDependent(this._valueHelpDialogStruNode);
            }
          this.getRouter()
            .getRoute("Home")
            .attachPatternMatched(this._onPatternMatched.bind(this));
        },
  
        /*
         * Called when the URL matches pattern "Home".
         */
        _onPatternMatched: function () {
          that = this;
          that.oList = this.byId("idTab");
          this.oLoc = this.byId("idloc");
          this.oProd = this.byId("prodInput");
          this.oComp = this.byId("compInput");
          this.oStruNode = this.byId("struInput");
  
          that._valueHelpDialogProd.setTitleAlignment("Center");
          that._valueHelpDialogLoc.setTitleAlignment("Center");
          that._valueHelpDialogComp.setTitleAlignment("Center");
          that._valueHelpDialogStruNode.setTitleAlignment("Center");
  
          this.oProdList = this._oCore.byId(
            this._valueHelpDialogProd.getId() + "-list"
          );
          this.oLocList = this._oCore.byId(
            this._valueHelpDialogLoc.getId() + "-list"
          );
          this.oCompList = this._oCore.byId(
            this._valueHelpDialogComp.getId() + "-list"
          );
          this.oStruNodeList = this._oCore.byId(
              this._valueHelpDialogStruNode.getId() + "-list"
            );
  
          that.oList.removeSelections();
          // Calling function
          this.getData();
        },
  
        /**
         * Getting Data Initially and binding to Locations dialog
         */
        getData: function () {
          sap.ui.core.BusyIndicator.show();
          // Calling service to get Location data
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
  
        /**
         * This function is called when click on Value help on Input box.
         * In this function based in sId will open the dialogs.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
          var sId = oEvent.getParameter("id");
          // Loc Dialog
          if (sId.includes("loc")) {
            that._valueHelpDialogLoc.open();
            // Prod Dialog
          } else if (sId.includes("prod")) {
            if (that.byId("idloc").getValue()) {
              that._valueHelpDialogProd.open();
            } else {
              MessageToast.show("Select Location");
            }
            // Component Dialog
          } else if (sId.includes("comp")) {
            if (
              that.byId("idloc").getValue() &&
              that.byId("prodInput").getTokens().length !== 0
            ) {
              that._valueHelpDialogComp.open();
            } else {
              MessageToast.show("No Product Location selected");
            }
            
          // Structure Dialog
          } else if (sId.includes("stru")) {
              if (
              that.byId("idloc").getValue() &&
              that.byId("prodInput").getTokens().length !== 0
              ) {
              
            that._valueHelpDialogStruNode.open();
              } else {
              MessageToast.show("No Product Location selected");
              }
          }
        },
  
        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         * In this function based in sId will close the dialogs.
         */
        handleClose: function (oEvent) {
          var sId = oEvent.getParameter("id");
          // Loc Dialog
          if (sId.includes("loc")) {
            that._oCore
              .byId(this._valueHelpDialogLoc.getId() + "-searchField")
              .setValue("");
            if (that.oLocList.getBinding("items")) {
              that.oLocList.getBinding("items").filter([]);
            }
            // Prod Dialog
          } else if (sId.includes("prod")) {
            that._oCore
              .byId(this._valueHelpDialogProd.getId() + "-searchField")
              .setValue("");
            if (that.oProdList.getBinding("items")) {
              that.oProdList.getBinding("items").filter([]);
            }
            // Component Dialog
          } else if (sId.includes("Comp")) {
            that._oCore
              .byId(this._valueHelpDialogComp.getId() + "-searchField")
              .setValue("");
            if (that.oCompList.getBinding("items")) {
              that.oCompList.getBinding("items").filter([]);
            }
            
           // structure Dialog
          } else if (sId.includes("stru")) {
              that._oCore
                .byId(this._valueHelpDialogStruNode.getId() + "-searchField")
                .setValue("");
              if (that.oStruNodeList.getBinding("items")) {
                that.oStruNodeList.getBinding("items").filter([]);
              }
            }
        },
  
        /**
         * Called when something is entered into the search field.
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
          if (sId.includes("Loc")) {
            if (sQuery !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                    new Filter("LOCATION_DESC", FilterOperator.Contains, sQuery),
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
            // Component
          } else if (sId.includes("Comp")) {
            if (sQuery !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("COMPONENT", FilterOperator.Contains, sQuery),
                    new Filter("ITEM_NUM", FilterOperator.Contains, sQuery),
                  ],
                  and: false,
                })
              );
            }
            that.oCompList.getBinding("items").filter(oFilters);
            
          }
        },
  
        /**
         * This function is called when selection on dialogs list.
         * Selections will be made based on sId.
         * @param {object} oEvent -the event information.
         */
        handleSelection: function (oEvent) {
          var sId = oEvent.getParameter("id"),
            oItem = oEvent.getParameter("selectedItems"),
            aSelectedItems,
            aODdata = [];
          //Location list
          if (sId.includes("Loc")) {
            this.oLoc = that.byId("idloc");
            var aSelectedLoc = oEvent.getParameter("selectedItems");
            that.oLoc.setValue(aSelectedLoc[0].getTitle());
            // Removing other input values when location is selected
            that.oProd.removeAllTokens();
            that.oComp.removeAllTokens();
            that.oStruNode.setValue();
            this._valueHelpDialogProd
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
            this._valueHelpDialogComp
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
            
            // service to get the products based of location
            this.getModel("BModel").read("/getLocProdDet", {
              filters: [
                new Filter(
                  "LOCATION_ID",
                  FilterOperator.EQ,
                  aSelectedLoc[0].getTitle()
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
            var aSelectedProd = oEvent.getParameter("selectedItems");
            // Removing selections of component 
            that.oComp.removeAllTokens();
            this._valueHelpDialogComp
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
            
            if (aSelectedProd && aSelectedProd.length > 0) {
              that.oProd.removeAllTokens();
              aSelectedProd.forEach(function (oItem) {
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
                var aSelectedProd = that.oProdList.getSelectedItems();
  
                // Declaration of filters
                var oFilters = [];
                var sFilter = new sap.ui.model.Filter({
                  path: "LOCATION_ID",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: that.oLoc.getValue(),
                });
                oFilters.push(sFilter);
  
                for (var i = 0; i < aSelectedProd.length; i++) {
                  sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: aSelectedProd[i].getTitle(),
                  });
                  oFilters.push(sFilter);
                }
  
                // Calling service to get the component list
                this.getModel("BModel").read("/getBomOdCond", {
                  filters: oFilters,
                  success: function (oData) {
                    that.odCondData = oData.results;
  
                    that.CompModel.setData(oData);
                    that.oCompList.setModel(that.CompModel);
  
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
            // Component List
          } else if (sId.includes("Comp")) {
            this.oComp = that.byId("compInput");
            var aSelectedComp = oEvent.getParameter("selectedItems");
            if (aSelectedComp && aSelectedComp.length > 0) {
              that.oComp.removeAllTokens();
              aSelectedComp.forEach(function (oItem) {
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
                var aSelectedProd = that.oProdList.getSelectedItems();
                var aSelectedComp = that.oCompList.getSelectedItems();
  
                // Declaration of filters
                var oFilters = [];
                var sFilter = new sap.ui.model.Filter({
                  path: "LOCATION_ID",
                  operator: sap.ui.model.FilterOperator.EQ,
                  value1: that.oLoc.getValue(),
                });
                oFilters.push(sFilter);
  
                for (var i = 0; i < aSelectedProd.length; i++) {
                  sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: aSelectedProd[i].getTitle(),
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
  
                  // Calling service to get the Structure Node data
                      this.getModel("BModel").read("/genCompStrcNode", {
                          filters: oFilters,            
                      success: function (oData) {
                      that.StruNodeModel.setData(oData);
                      that.oStruNodeList.setModel(that.StruNodeModel);
                      
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
            
          } else if (sId.includes("Stru")) {
              this.oStruNode = that.byId("struInput");
              var aSelectedLoc = oEvent.getParameter("selectedItems");
              that.oStruNode.setValue(aSelectedLoc[0].getTitle());
          }
          that.handleClose(oEvent);
        },
  
        /**
         * This function is called when click on "Go" button after filling all Input box values.
         * @param {object} oEvent -the event information.
         */
        onGetData: function () {
          that.oList.removeSelections();
          // Checking for Location and Product is not empty
          if (
            that.byId("idloc").getValue() &&
            that.byId("prodInput").getTokens().length !== 0
          ) {
            // Getting the selections of value help dialog
            var aSelectedProd = that.oProdList.getSelectedItems();
            var aSelectedComp = that.oCompList.getSelectedItems();
            // Declaration of filters
            var oFilters = [];
            var sFilter = new sap.ui.model.Filter({
              path: "LOCATION_ID",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: that.oLoc.getValue(),
            });
            oFilters.push(sFilter);
  
            for (var i = 0; i < aSelectedProd.length; i++) {
              sFilter = new sap.ui.model.Filter({
                path: "PRODUCT_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: aSelectedProd[i].getTitle(),
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
  
            
  
            if(that.oStruNode.getValue()){
            var sFilter = new sap.ui.model.Filter({
              path: "STRUC_NODE",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: that.oStruNode.getValue(),
            });
            oFilters.push(sFilter);
          }
  
            // Calling service to get the data based on filters declared
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
            MessageToast.show("Please select Location and Product");
          }
        },
  
        /**
         * This function is called when click on Assign button.
         * In this function it will open the Profile dialog to select the profiles from list
         * @param {object} oEvent -the event information.
         */
        onAssign: function () {
          that.oGModel = that.getModel("oGModel");
          var aSelTabItem = that.byId("idTab").getSelectedItems();
          if (aSelTabItem.length) {
            if (!that._onProfiles) {
              that._onProfiles = sap.ui.xmlfragment(
                "cp.odp.cpodprofiles.view.Profiles",
                that
              );
              that.getView().addDependent(that._onProfiles);
            }
  
            that.oProfileList = sap.ui.getCore().byId("idListTab");
            that._onProfiles.setTitleAlignment("Center");
            // Calling service to get the Profiles list
            this.getModel("BModel").read("/getProfiles", {
              success: function (oData) {
                that.oProfileModel.setData({
                  results: oData.results,
                });
                that.oProfileList.setModel(that.oProfileModel);
                that.oProfileList.removeSelections(true);
                that._onProfiles.open();
                that.oGModel.setProperty("/selItem", aSelTabItem);
              },
              error: function () {
                MessageToast.show("Failed to get profiles");
              },
            });
          } else {
            MessageToast.show("Please select atleast one item to assign profile");
          }
        },
  
        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         */
        handleProfileClose: function () {
          that.byId("idTab").removeSelections();
          that._onProfiles.close();
        },
  
        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        handleprofileSearch: function (oEvent) {
          var sQuery =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
  
          if (sQuery !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("PROFILE", FilterOperator.Contains, sQuery),
                  new Filter("PRF_DESC", FilterOperator.Contains, sQuery),
                ],
                and: false,
              })
            );
          }
          that.oProfileList.getBinding("items").filter(oFilters);
        },
  
        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        onTableSearch: function (oEvent) {
          var sQuery =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
  
          if (sQuery !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                  new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                  new Filter("COMPONENT", FilterOperator.Contains, sQuery),
                  new Filter("STRUC_NODE", FilterOperator.Contains, sQuery),
                  new Filter("PROFILE", FilterOperator.Contains, sQuery),
                ],
                and: false,
              })
            );
          }
          that.oList.getBinding("items").filter(oFilters);
        },
  
        /**
         * This function is called when selecting Profile from the dialog.
         * After selecting Profile that will assign to selected list from table.
         * @param {object} oEvent -the event information.
         */
        onProfileSel: function (oEvent) {
          // Getting the selected items of table
          var aItem = that.oGModel.getProperty("/selItem"),
            aData = {
              PROFILEOD: [],
            },
            jsonProfileOD,
            // Getting the selected profile from dialog
            sProfile = sap.ui
              .getCore()
              .byId("idListTab")
              .getSelectedItems()[0]
              .getTitle();
          var oSelected;
          // Looping through the selected list to assign selected Profile
          for (var i = 0; i < aItem.length; i++) {
            oSelected = aItem[i].getBindingContext().getProperty();
  
            sap.ui.core.BusyIndicator.show();
            // Calling service to assign profile
            that.getModel("BModel").callFunction("/asssignProfilesOD", {
              method: "GET",
              urlParameters: {
                FLAG: "I",
                LOCATION_ID: oSelected.LOCATION_ID,
                PRODUCT_ID: oSelected.PRODUCT_ID,
                COMPONENT: oSelected.COMPONENT,
                STRUC_NODE: oSelected.STRUC_NODE,
                PROFILE: sProfile,
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Profile assigned successfully");
                that.handleProfileClose();
                that.onGetData();
              },
              error: function (error) {
                sap.m.MessageToast.show("Error in assigning Profiles");
                sap.ui.core.BusyIndicator.hide();
                that.handleProfileClose();
              },
            });
          }
        },
  
        /**
         * This function is called when click on UnAssign button.
         * In this function removing the assigned profile to the selected table list.
         * @param {object} oEvent -the event information.
         */
        onUnAssign: function () {
          var aData = {
              PROFILEOD: [],
            },
            jsonProfileOD;
          var oSelected;
          // Getting the oSelected list of table which profiles need to delete
          var aItem = that.byId("idTab").getSelectedItems();
          // Looping through the selected list to remove the assigned profiles
          for (var i = 0; i < aItem.length; i++) {
            oSelected = aItem[i].getBindingContext().getProperty();
  
            sap.ui.core.BusyIndicator.show();
            that.getModel("BModel").callFunction("/asssignProfilesOD", {
              method: "GET",
              urlParameters: {
                FLAG: "D",
                LOCATION_ID: oSelected.LOCATION_ID,
                PRODUCT_ID: oSelected.PRODUCT_ID,
                COMPONENT: oSelected.COMPONENT,
                STRUC_NODE: "",
                PROFILE: oSelected.PROFILE,
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Profile unassigned successfully");
                that.onGetData();
              },
              error: function (error) {
                sap.m.MessageToast.show("Error while unassigning Profiles");
                sap.ui.core.BusyIndicator.hide();
              },
            });
          }
        },
      });
    }
  );
  