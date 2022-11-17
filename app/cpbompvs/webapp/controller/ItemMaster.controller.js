sap.ui.define(
  [
    "cpapp/cpbompvs/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/Device",
  ],
  function (
    BaseController,
    MessageToast,
    JSONModel,
    Filter,
    FilterOperator,
    MessageBox,
    Device
  ) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("cpapp.cpbompvs.controller.ItemMaster", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Models
        that.oModel = new JSONModel();
        this.locModel = new JSONModel();
        this.prodModel = new JSONModel();
        this.accModel = new JSONModel();
        this._oCore = sap.ui.getCore();
        this.locModel = new JSONModel();
        this.prodModel = new JSONModel();
        this.accModel = new JSONModel();
        this._oCore = sap.ui.getCore();
        // Decaration of fragments
        if (!this._valueHelpDialogLoc) {
          this._valueHelpDialogLoc = sap.ui.xmlfragment(
            "cpapp.cpbompvs.view.LocDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogLoc);
        }
        if (!this._valueHelpDialogProd) {
          this._valueHelpDialogProd = sap.ui.xmlfragment(
            "cpapp.cpbompvs.view.ProdDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogProd);
        }
        if (!this._oAccesNode) {
          this._oAccesNode = sap.ui.xmlfragment(
            "cpapp.cpbompvs.view.AccesNodes",
            that
          );
          that.getView().addDependent(this._oAccesNode);
        }

        if (!this._oAccesNodeList) {
          this._oAccesNodeList = sap.ui.xmlfragment(
            "cpapp.cpbompvs.view.AccessNodesList",
            that
          );
          that.getView().addDependent(this._oAccesNodeList);
        }
        this.bus = sap.ui.getCore().getEventBus();
        this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
        this.bus.publish("nav", "toBeginPage", {
          viewName: this.getView().getProperty("viewName"),
        });
      },

      // Refreshing Master Data
      refreshMaster: function () {
        this.onAfterRendering();
      },

      /**
       * Called after the view has been rendered.
       * Calling services to get data
       */
      onAfterRendering: function () {
        that = this;
        oGModel = this.getModel("oGModel");
        // Setting title allignment
        that._valueHelpDialogProd.setTitleAlignment("Center");
        that._valueHelpDialogLoc.setTitleAlignment("Center");
        that._oAccesNodeList.setTitleAlignment("Center");

        this.oProdList = this._oCore.byId(
          this._valueHelpDialogProd.getId() + "-list"
        );
        this.oLocList = this._oCore.byId(
          this._valueHelpDialogLoc.getId() + "-list"
        );
        this.oAccList = this._oCore.byId(
          this._oAccesNodeList.getId() + "-list"
        );

        this.getModel("BModel").read("/genProdAccessNode", {
          success: function (oData) {
            that.oModel.setData({
              results: oData.results,
            });
            that.byId("accessList").setModel(that.oModel);
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });

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
        this.getModel("BModel").read("/getPVSNodes", {
          success: function (oData) {
            that.AccessNodes = [];
            // Filteration data based on node type
            for (var i = 0; i < oData.results.length; i++) {
              if (oData.results[i].NODE_TYPE === "AN") {
                that.AccessNodes.push(oData.results[i]);
              }
            }

            that.accModel.setData({
              results: that.AccessNodes,
            });
            that.oAccList.setModel(that.accModel);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function () {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * This function is to handling Value help to open the fragments.
       */
      handleValueHelp: function (oEvent) {
        var sId = oEvent.getParameter("id");
        // Loc dialog
        if (sId.includes("loc")) {
          that._valueHelpDialogLoc.open();
          // Prod dialog
        } else if (sId.includes("prod")) {
          that._valueHelpDialogProd.open();
          // accesNodes dialog
        } else if (sId.includes("accn")) {
          that._oAccesNodeList.open();
        }
      },

      /**
       * This function is to close the fragments.
       * * @param {object} oEvent -the event information.
       */
      handleClose: function (oEvent) {
        var sId = oEvent.getParameter("id");
        // Loc dialog
        if (sId.includes("loc")) {
          that._oCore
            .byId(this._valueHelpDialogLoc.getId() + "-searchField")
            .setValue("");
          if (that.oLocList.getBinding("items")) {
            that.oLocList.getBinding("items").filter([]);
          }
          // Prod dialog
        } else if (sId.includes("prod")) {
          that._oCore
            .byId(this._valueHelpDialogProd.getId() + "-searchField")
            .setValue("");
          if (that.oProdList.getBinding("items")) {
            that.oProdList.getBinding("items").filter([]);
          }
          // Access Nodes dialog
        } else if (sId.includes("acc")) {
          that._oCore
            .byId(this._oAccesNodeList.getId() + "-searchField")
            .setValue("");
          if (that.oAccList.getBinding("items")) {
            that.oAccList.getBinding("items").filter([]);
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
        if (sId.includes("loc")) {
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
          // Access Nodes
        } else if (sId.includes("acc")) {
          if (sQuery !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("CHILD_NODE", FilterOperator.Contains, sQuery),
                  new Filter("NODE_DESC", FilterOperator.Contains, sQuery),
                ],
                and: false,
              })
            );
          }
          that.oAccList.getBinding("items").filter(oFilters);
        }
      },

      /**
       * This function is to handling selection in fragment.
       * * @param {object} oEvent -the event information.
       */
      handleSelection: function (oEvent) {
        var sId = oEvent.getParameter("id"),
          oItem = oEvent.getParameter("selectedItems"),
          oSelectedItems,
          aODdata = [];
        //Location list
        if (sId.includes("Loc")) {
          this.oLoc = sap.ui
            .getCore()
            .byId(
              sap.ui.getCore().byId("SimpleFormToolbar").getContent()[1].getId()
            );
          oSelectedItems = oEvent.getParameter("selectedItems");
          that.oLoc.setValue(oSelectedItems[0].getTitle());
          this.getModel("BModel").read("/getLocProdDet", {
            filters: [
              new Filter(
                "LOCATION_ID",
                FilterOperator.EQ,
                oSelectedItems[0].getTitle()
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

          // Product list
        } else if (sId.includes("prod")) {
          this.oProd = sap.ui
            .getCore()
            .byId(
              sap.ui.getCore().byId("SimpleFormToolbar").getContent()[3].getId()
            );
          oSelectedItems = oEvent.getParameter("selectedItems");
          that.oProd.setValue(oSelectedItems[0].getTitle());

          // Access Nodes list
        } else if (sId.includes("acc")) {
          this.oAccn = sap.ui
            .getCore()
            .byId(
              sap.ui.getCore().byId("SimpleFormToolbar").getContent()[5].getId()
            );
          oSelectedItems = oEvent.getParameter("selectedItems");
          that.oAccn.setValue(oSelectedItems[0].getTitle());
        }
        that.handleClose(oEvent);
      },

      /**
       * Called when it routes to a page containing the item details.
       * * @param {object} oEvent -the event information.
       */
      onhandlePress: function (oEvent) {
        oGModel = this.getModel("oGModel");

        if (oEvent) {
          var oSelProd = oEvent.getSource().getSelectedItem().getTitle(),
            oSelLoc = oEvent.getSource().getSelectedItem().getDescription(),
            oSelNode = oEvent.getSource().getSelectedItem().getInfo();

          oGModel.setProperty("/SelectedProd", oSelProd);
          oGModel.setProperty("/SelectedLoc", oSelLoc);
          oGModel.setProperty("/SelectedNode", oSelNode);
        }
        // Calling Item Detail page
        that.getOwnerComponent().runAsOwner(function () {
          if (!that.oDetailView) {
            try {
              that.oDetailView = sap.ui.view({
                viewName: "cpapp.cpbompvs.view.ItemDetail",
                type: "XML",
              });
              that.bus.publish("flexible", "addDetailPage", that.oDetailView);
              that.bus.publish("nav", "toDetailPage", {
                viewName: that.oDetailView.getViewName(),
              });
            } catch (e) {
              that.oDetailView.onAfterRendering();
            }
          } else {
            that.bus.publish("nav", "toDetailPage", {
              viewName: that.oDetailView.getViewName(),
            });
          }
        });
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onSearch: function (oEvent) {
        var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.byId("accessList").getBinding("items").filter(oFilters);
      },

      /**
       * This function is called when a click on Create or Edit Access Node to open dialog.
       * @param {object} oEvent -the event information.
       */
      onAccNode: function (oEvent) {
        if (!that._oAccesNode) {
          that._oAccesNode = sap.ui.xmlfragment(
            "cpapp.cpbompvs.view.AccesNodes",
            that
          );
          that.getView().addDependent(that._oAccesNode);
        }
        oGModel = this.getModel("oGModel");
        oGModel.setProperty("/Flag", "");

        // setting flag based on button clicked
        if (oEvent.getSource().getTooltip().includes("Add")) {
          that._oAccesNode.setTitle("Assign Access Node");
          oGModel.setProperty("/Flag", "C");
          that._oAccesNode.open();
        } else {
          if (this.byId("accessList").getSelectedItems().length) {
            var oTableItem = this.byId("accessList")
              .getSelectedItem()
              .getCells()[0];
            that._oAccesNode.setTitle("Update Access Node");
            // Maintaning the values when Access Node edit
            sap.ui
              .getCore()
              .byId("idAccesNode")
              .setValue(oTableItem.getTitle());
            sap.ui.getCore().byId("idDesc").setValue(oTableItem.getText());
            sap.ui.getCore().byId("idAccesNode").setEditable(false);
            oGModel.setProperty("/Flag", "E");
            that._oAccesNode.open();
          } else {
            MessageToast.show("Select access node to update");
          }
        }
      },

      /**
       * Called when 'Close/Cancel' button in any dialog is pressed.
       */
      onAccNodeClose: function () {
        that._oAccesNode.close();
        that._oAccesNode.destroy(true);
        that._oAccesNode = "";
      },

      /**
       * This function is called when a click on deleting Access Node.
       * @param {object} oEvent -the event information.
       */
      onAccNodeDel: function (oEvent) {
        // Deleting the selected access node
        var oLoc = oGModel.getProperty("/SelectedLoc"),
          oProd = oGModel.getProperty("/SelectedProd");
        // Getting the conformation popup before deleting
        var sText =
          "Please confirm to remove access node" +
          " - " +
          oLoc +
          " " +
          "-" +
          " " +
          oProd;
        sap.m.MessageBox.show(sText, {
          title: "Confirmation",
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              sap.ui.core.BusyIndicator.show();
              that.getModel("BModel").callFunction("/genProdAN", {
                method: "GET",
                urlParameters: {
                  LOCATION_ID: oLoc,
                  PRODUCT_ID: oProd,
                  ACCESS_NODE: "D",
                },
                success: function (data) {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show("Access Node deleted successfully");
                  // Refreshing data after successful delition
                  that.onAfterRendering();
                },
                error: function (data) {
                  sap.m.MessageToast.show(JSON.stringify(data));
                },
              });
            }
          },
        });
      },

      /**
       * This function is called when a click on Assigning the Access Node to product and Location.
       */
      onAccessNodeSave: function () {
        var oLoc = sap.ui.getCore().byId("idloc").getValue();
        var oProd = sap.ui.getCore().byId("idprod").getValue();
        var oAccessNode = sap.ui.getCore().byId("idaccn").getValue();
        that.getModel("BModel").callFunction("/genProdAN", {
          method: "GET",
          urlParameters: {
            LOCATION_ID: oLoc,
            PRODUCT_ID: oProd,
            ACCESS_NODE: oAccessNode,
          },
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Assigned Access Node successfully");
            // Calling function to refresh the data
            that.onAccNodeClose();
            that.onAfterRendering();
          },
          error: function (data) {
            sap.m.MessageToast.show(JSON.stringify(data));
          },
        });
      },
      
    });
  }
);
