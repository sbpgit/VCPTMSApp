sap.ui.define(
  [
    "cpappf/cpnodesdetails/controller/BaseController",
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
      "cpappf.cpnodesdetails.controller.ItemMaster",
      {
        onInit: function () {
          that = this;
          that.oModel = new JSONModel();
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

          this.getModel("BModel").read("/getPVSNodes", {
            success: function (oData) {
              that.AccessNodes = [];
              that.StructureNodes = [];
              that.ViewNodes = [];
              that.StruViewNodes = [];

              for (var i = 0; i < oData.results.length; i++) {
                if (oData.results[i].NODE_TYPE === "AN") {
                  that.AccessNodes.push(oData.results[i]);
                } else if (oData.results[i].NODE_TYPE === "SN") {
                  that.StructureNodes.push(oData.results[i]);
                } else if (oData.results[i].NODE_TYPE === "VN") {
                  that.ViewNodes.push(oData.results[i]);
                } else if (oData.results[i].NODE_TYPE === "VS") {
                    that.StruViewNodes.push(oData.results[i]);
                  }
              }

              oGModel.setProperty("/SelectedAccessNode", that.AccessNodes[0].CHILD_NODE);
              oGModel.setProperty("/struNodeData", that.StructureNodes);
              oGModel.setProperty("/ViewNodeData", that.ViewNodes);
              oGModel.setProperty("/StruViewNodeData", that.StruViewNodes);

              

              that.oModel.setData({
                results: that.AccessNodes,
              });
              that.byId("accessList").setModel(that.oModel);

              that.byId("accessList").getItems()[0].setSelected(true);
              that.onhandlePress();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },

        onhandlePress: function (oEvent) {
          oGModel = this.getModel("oGModel");

          if (oEvent) {
            var oSelItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();

            oGModel.setProperty("/SelectedAccessNode", oSelItem.CHILD_NODE);
            oGModel.setProperty("/struNodeData", that.StructureNodes);
            oGModel.setProperty("/ViewNodeData", that.ViewNodes);
          } 
          // Calling Item Detail page
          that.getOwnerComponent().runAsOwner(function () {
            if (!that.oDetailView) {
              try {
                that.oDetailView = sap.ui.view({
                  viewName: "cpappf.cpnodesdetails.view.ItemDetail",
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
                  new Filter("CHILD_NODE", FilterOperator.Contains, query),
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
              "cpappf.cpnodesdetails.view.AccesNodes",
              that
            );
            that.getView().addDependent(that._oAccesNode);
          }
          oGModel = this.getModel("oGModel");
          oGModel.setProperty("/Flag", "");

          if (oEvent.getSource().getTooltip().includes("Add")) {
            that._oAccesNode.setTitle("Access Node Creation");
            sap.ui.getCore().byId("idAccesNode").setValue("");
            sap.ui.getCore().byId("idDesc").setValue("");
            oGModel.setProperty("/Flag", "C");
            that._oAccesNode.open();
          } else {
            if (this.byId("accessList").getSelectedItems().length) {
              var tableItem = this.byId("accessList").getSelectedItem().getCells()[0];
              that._oAccesNode.setTitle("Update Access Node");
              sap.ui.getCore().byId("idAccesNode").setValue(tableItem.getTitle());
              sap.ui.getCore().byId("idDesc").setValue(tableItem.getText());
              sap.ui.getCore().byId("idAccesNode").setEditable(false);
              oGModel.setProperty("/Flag", "E");
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
            var selected = oEvent.getSource().getParent().getCells()[0].getTitle();
            // Getting the conformation popup before deleting
            var text = "Please confirm to remove access node" + " - " + selected;
            sap.m.MessageBox.show(text, {
              title: "Confirmation",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  sap.ui.core.BusyIndicator.show();
  
                  that.getModel("BModel").callFunction("/genpvs", {
                    method: "GET",
                    urlParameters: {
                      CHILD_NODE: selected,
                      PARENT_NODE: "",
                      NODE_TYPE: "AN",
                      NODE_DESC: "",
                      FLAG: "D",
                    },
                    success: function (oData) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Deletion Successfull");
                              that.onAfterRendering();
                    },
                    error: function () {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to delete node");
                              that.onAfterRendering();
                    },
                  });
                }
              },
            });
          },
  
          onAccessNodeSave: function () {
            var accesNode = sap.ui.getCore().byId("idAccesNode").getValue();
            var desc = sap.ui.getCore().byId("idDesc").getValue();
            var flag = oGModel.getProperty("/Flag");
            this.getModel("BModel").callFunction("/genpvs", {
              method: "GET",
              urlParameters: {
                CHILD_NODE: accesNode,
                PARENT_NODE: "",
                ACCESS_NODES: accesNode,
                NODE_TYPE: "AN",
                NODE_DESC: desc,
                FLAG: flag
              },
              success: function (oData) {
              //   sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Creation Successfull");
                        that.onAccNodeClose();
                        that.onAfterRendering();
              },
              error: function (oData) {
                  if(oData.statusCode === 200){
                      MessageToast.show("Creation Successfull");
                  }
                  else{
                  MessageToast.show("Failed to create node");
                  }
                          that.onAccNodeClose();
                          that.onAfterRendering();
              },
            });
  
  
  
          }
        }
      );
    }
  );
