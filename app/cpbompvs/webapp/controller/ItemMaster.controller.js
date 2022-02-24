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

    return BaseController.extend(
      "cpapp.cpbompvs.controller.ItemMaster",
      {
        onInit: function () {
          that = this;
          that.oModel = new JSONModel();
          this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          this.accModel = new JSONModel();
          this._oCore = sap.ui.getCore();
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
          }this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          this.accModel = new JSONModel();
          this._oCore = sap.ui.getCore();
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
        onAfterRendering: function () {
          that = this;
          oGModel = this.getModel("oGModel");
        //   this.oLoc = sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[1].getId());
        //   this.oProd = sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[3].getId());
        //   this.oAccn = sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[5].getId());
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
              MessageToast.show("Failed to get data");
            },
          });
        },
        handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            if (sId.includes("loc")) {
              that._valueHelpDialogLoc.open();
            } else if (sId.includes("prod")) {
              that._valueHelpDialogProd.open();
            }
            else if (sId.includes("accn")) {
                that._oAccesNodeList.open();
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
            } 
            else if (sId.includes("acc")) {
                that._oCore
                  .byId(this._oAccesNodeList.getId() + "-searchField")
                  .setValue("");
                if (that.oAccList.getBinding("items")) {
                  that.oAccList.getBinding("items").filter([]);
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
            } else if (sId.includes("acc")) {
                if (query !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("CHILD_NODE", FilterOperator.Contains, query),
                        new Filter("NODE_DESC", FilterOperator.Contains, query),
                      ],
                      and: false,
                    })
                  );
                }
                that.oAccList.getBinding("items").filter(oFilters);
                // Object Dependency
              } 
          },
          handleSelection: function (oEvent) {
            var sId = oEvent.getParameter("id"),
              oItem = oEvent.getParameter("selectedItems"),
              aSelectedItems,
              aODdata = [];
            //Location list
            if (sId.includes("Loc")) {
                this.oLoc = sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[1].getId());
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedItems[0].getTitle());
              this.getModel("BModel").read("/getLocProdDet", {
                  filters: [
                      new Filter("LOCATION_ID", FilterOperator.EQ, aSelectedItems[0].getTitle())
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
                this.oProd = sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[3].getId());
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oProd.setValue(aSelectedItems[0].getTitle());
            } else if (sId.includes("acc")) {
                this.oAccn = sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[5].getId());
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oAccn.setValue(aSelectedItems[0].getTitle());
            } 
            that.handleClose(oEvent);
          },
        onhandlePress: function (oEvent) {
          oGModel = this.getModel("oGModel");

          if (oEvent) {
            var oSelProd = oEvent.getSource().getSelectedItem().getTitle(),
            oSelLoc = oEvent.getSource().getSelectedItem().getDescription(),
            oSelNode = oEvent.getSource().getSelectedItem().getInfo();

            oGModel.setProperty("/SelectedProd", oSelProd);
            oGModel.setProperty("/SelectedLoc", oSelLoc);
            oGModel.setProperty("/SelectedNode", oSelNode);
          } else {
            // var num = oGModel.getProperty("/projectNo");
            // oGModel.setProperty("/projectNo", num);
            // var desc = oGModel.getProperty("/ProjDesc");
            // oGModel.setProperty("/ProjDesc", desc);
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
                // that.oDetailView.onAfterRendering();
              } catch (e) {
                that.oDetailView.onAfterRendering();
              }
            } else {
              that.bus.publish("nav", "toDetailPage", {
                viewName: that.oDetailView.getViewName(),
              });

              // that.oDetailView.onAfterRendering();
            }
          });
        },

        onSearch: function (oEvent) {
          var query =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];

          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                  new Filter("LOCATION_ID", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.byId("accessList").getBinding("items").filter(oFilters);
        },

        onAccNode: function (oEvent) {
          if (!that._oAccesNode) {
            that._oAccesNode = sap.ui.xmlfragment(
              "cpapp.cpbompvs.view.AccesNodes",
              that
            );
            that.getView().addDependent(that._oAccesNode);
          }
          oGModel = this.getModel("oGModel");
          oGModel.setProperty("/Flag", "")

          if (oEvent.getSource().getTooltip().includes("Add")) {
            that._oAccesNode.setTitle("Assign Access Node");
            // sap.ui.getCore().byId("idAccesNode").setValue("");
            // sap.ui.getCore().byId("idDesc").setValue("");
            oGModel.setProperty("/Flag", "C")
            that._oAccesNode.open();
          } else {
            if (this.byId("accessList").getSelectedItems().length) {
              var tableItem = this.byId("accessList").getSelectedItem().getCells()[0];
              that._oAccesNode.setTitle("Update Access Node");
              sap.ui.getCore().byId("idAccesNode").setValue(tableItem.getTitle());
              sap.ui.getCore().byId("idDesc").setValue(tableItem.getText());
              sap.ui.getCore().byId("idAccesNode").setEditable(false);
              oGModel.setProperty("/Flag", "E")
              that._oAccesNode.open();
            } else {
              MessageToast.show("Select access node to update");
            }
          }
        },

        onAccNodeClose: function () {
          that._oAccesNode.close();
          that._oAccesNode.destroy(true);
          that._oAccesNode = "";
        },

        onAccNodeDel: function (oEvent) {
          // Deleting the selected access node
          var loc = oGModel.getProperty("/SelectedLoc"),
                prod = oGModel.getProperty("/SelectedProd");
          // Getting the conformation popup before deleting
          var text = "Please confirm to remove access node" + " - " + loc + " " + "-" + " "+ prod;
          sap.m.MessageBox.show(text, {
            title: "Confirmation",
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.YES) {
                sap.ui.core.BusyIndicator.show();

                var uri = "/v2/catalog/genProdAccessNode";
                $.ajax({
                    url: uri,
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify({
                        LOCATION_ID: loc,
                        PRODUCT_ID: prod,
                        ACCESS_NODE: "D"
                    }),
                    dataType: "json",
                    async: false,
                    timeout: 0,
                    
                    success: function (data) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Access Node deleted successfully");
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

        onAccessNodeSave: function () {
          var Loc = sap.ui.getCore().byId("idloc").getValue();
          var prod = sap.ui.getCore().byId("idprod").getValue();
          var AccessNode = sap.ui.getCore().byId("idaccn").getValue();;
          

          var uri = "/v2/catalog/genProdAccessNode";
          $.ajax({
            url: uri,
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                LOCATION_ID: Loc,
                PRODUCT_ID: prod,
                ACCESS_NODE: AccessNode
            }),
            dataType: "json",
            async: false,
            timeout: 0,
            
            success: function (data) {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show(data.d.results[0].value);
              that.onAccNodeClose();
              that.onAfterRendering();
            },
            error: function (data) {
                sap.m.MessageToast.show(JSON.stringify(data));
              },
          });
          
        },


      }
    );
  }
);
