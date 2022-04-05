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
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
              that = this;
              // Declareing JSON Model
              that.oModel = new JSONModel();
              this.bus = sap.ui.getCore().getEventBus();
              this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
              this.bus.publish("nav", "toBeginPage", {
                viewName: this.getView().getProperty("viewName"),
              });
            },
      
            /**
             * This function is called to refresh the data
             */
            refreshMaster: function () {
              this.onAfterRendering();
            },
      
            /**
             * Called after the view has been rendered.
             * In this function filtering data for different Node Type.
             */
            onAfterRendering: function () {
              that = this;
              oGModel = this.getModel("oGModel");
      
              // Calling service to get the Nodes Data
              this.getModel("BModel").read("/getPVSNodes", {
                success: function (oData) {
                  // Declareing the empty models
                  that.AccessNodes = [];
                  that.StructureNodes = [];
                  that.ViewNodes = [];
                  that.StruViewNodes = [];
      
                  // Looping through the data and filtering based on Node types
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
      
                  oGModel.setProperty(
                    "/SelectedAccessNode",
                    that.AccessNodes[0].CHILD_NODE
                  );
                  // Setting data to use in next screen
                  oGModel.setProperty("/SelectedDesc", that.AccessNodes[0].NODE_DESC);
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
      
            /**
             * Called when it routes to a page containing the item details.
             * @param {object} oEvent -the event information.
             */
            onhandlePress: function (oEvent) {
              oGModel = this.getModel("oGModel");
      
              if (oEvent) {
                var oSelItem = oEvent
                  .getSource()
                  .getSelectedItem()
                  .getBindingContext()
                  .getObject();
      
                // Setting the data
                oGModel.setProperty("/SelectedAccessNode", oSelItem.CHILD_NODE);
                oGModel.setProperty("/SelectedDesc", oSelItem.NODE_DESC);
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
                      new Filter("CHILD_NODE", FilterOperator.Contains, sQuery),
                    ],
                    and: false,
                  })
                );
              }
              that.byId("accessList").getBinding("items").filter(oFilters);
            },
      
            /**
             * This function is called when click on Create or Edit button.
             * This function will open dialog to Create or Edit Access Node
             * @param {object} oEvent -the event information.
             */
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
              // Opening dialog and setting data based on selected button
              if (oEvent.getSource().getTooltip().includes("Add")) {
                that._oAccesNode.setTitle("Access Node Creation");
                sap.ui.getCore().byId("idAccesNode").setValue("");
                sap.ui.getCore().byId("idDesc").setValue("");
                oGModel.setProperty("/Flag", "C");
                that._oAccesNode.open();
              } else {
                if (this.byId("accessList").getSelectedItems().length) {
                  var oTableItem = this.byId("accessList")
                    .getSelectedItem()
                    .getCells()[0];
                  that._oAccesNode.setTitle("Update Access Node");
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
             * This function is called when click on Delete button of Access Nodes.
             * @param {object} oEvent -the event information.
             */
            onAccNodeDel: function (oEvent) {
              // Deleting the selected access node
              var oSelected = oEvent.getSource().getParent().getCells()[0].getTitle();
              // Getting the conformation popup before deleting
              var sText =
                "Do you want to delete all the assignments of this Node. " +
                " - " +
                oSelected +
                "-" +
                "Please confirm";
              sap.m.MessageBox.show(sText, {
                title: "Confirmation",
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.YES) {
                    sap.ui.core.BusyIndicator.show();
      
                    that.getModel("BModel").callFunction("/genpvs", {
                      method: "GET",
                      urlParameters: {
                        CHILD_NODE: oSelected,
                        PARENT_NODE: "",
                        ACCESS_NODES: "",
                        NODE_TYPE: "AN",
                        NODE_DESC: "",
                        LOWERLIMIT: 0,
                        UPPERLIMIT: 0,
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
      
            /**
             * This function is called when click on Save button in dialog.
             * In this function it will create Access Node with the inputs in dialog
             * @param {object} oEvent -the event information.
             */
            onAccessNodeSave: function () {
              var oAccesNode = sap.ui.getCore().byId("idAccesNode").getValue();
              var oDesc = sap.ui.getCore().byId("idDesc").getValue();
              // Getting flag based on button clicked
              var oFlag = oGModel.getProperty("/Flag");
              this.getModel("BModel").callFunction("/genpvs", {
                method: "GET",
                urlParameters: {
                  CHILD_NODE: oAccesNode,
                  PARENT_NODE: "",
                  ACCESS_NODES: oAccesNode,
                  NODE_TYPE: "AN",
                  NODE_DESC: oDesc,
                  LOWERLIMIT: 0,
                  UPPERLIMIT: 0,
                  FLAG: oFlag,
                },
                success: function (oData) {
                  //   sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Creation Successfull");
                  that.onAccNodeClose();
                  that.onAfterRendering();
                },
                error: function (oData) {
                  if (oData.statusCode === 200) {
                    MessageToast.show("Creation Successfull");
                  } else {
                    MessageToast.show("Failed to create node");
                  }
                  that.onAccNodeClose();
                  that.onAfterRendering();
                },
              });
            },
          });
        }
      );
