sap.ui.define(
  [
    "cpappf/cpnodesdetails/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
  ],
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
    return BaseController.extend(
      "cpappf.cpnodesdetails.controller.ItemDetail",
      {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */

        onInit: function () {
          that = this;
          this.bus = sap.ui.getCore().getEventBus();
          // Declaration of JSON Models
          that.oStruModel = new JSONModel();
          that.oViewlistModel = new JSONModel();
          that.oViewModel = new JSONModel();
          oGModel = that.getOwnerComponent().getModel("oGModel");
        },

        /**
         * Called after the view has been rendered.
         * In this function getting data from Item Master view and filtering data for different Node Type.
         */
        onAfterRendering: function () {
          oGModel = that.getOwnerComponent().getModel("oGModel");
          this.byId("sturList").removeSelections();
          that.byId("detailNode").setSelectedKey("struNode");

          // Getting data of Structure and View nodes
          var oSelItem = oGModel.getProperty("/SelectedAccessNode");
          var oStuData = oGModel.getProperty("/struNodeData");
          var oViewData = oGModel.getProperty("/ViewNodeData");
          var oStruViewData = oGModel.getProperty("/StruViewNodeData");
          that.struNodeData = [];
          that.viewNodeData = [];
          that.struviewNodeData = [];

          // Looping through the Structure Node data based on selected Acces Node
          for (var i = 0; i < oStuData.length; i++) {
            if (oStuData[i].PARENT_NODE === oSelItem) {
              that.struNodeData.push(oStuData[i]);
            }
          }

          // Looping through the View Node data based on selected Acces Node
          for (var i = 0; i < oViewData.length; i++) {
            if (oViewData[i].PARENT_NODE === oSelItem) {
              that.viewNodeData.push(oViewData[i]);
            }
          }

          // Looping View Node data and getting the structure node assigned to it
          for (var j = 0; j < that.viewNodeData.length; j++) {
            var iCount = 0;
            for (var i = 0; i < oStruViewData.length; i++) {
              // Pushing data
              if (
                oStruViewData[i].PARENT_NODE ===
                  that.viewNodeData[j].CHILD_NODE &&
                oStruViewData[i].ACCESS_NODES === oSelItem
              ) {
                that.struviewNodeData.push(oStruViewData[i]);
                // If data matches for the above condition then changing 'iCount to 1'
                iCount = 1;
              }
            }
            /* If above if condition failed for all records of structure view data 
                then adding empty data to view node */
            if (iCount === 0) {
              var aData = {
                AUTH_GROUP: null,
                CHILD_NODE: "No Structure Node assigned",
                NODE_DESC: "",
                NODE_TYPE: "",
                PARENT_NODE: that.viewNodeData[j].CHILD_NODE,
                createdAt: null,
                createdBy: null,
                modifiedAt: null,
                modifiedBy: null,
                Flag: "X",
              };

              that.struviewNodeData.push(aData);
            }
          }

          oGModel.setProperty("/tableData", that.struviewNodeData);

          that.oStruModel.setData({
            Struresults: that.struNodeData,
          });
          that.byId("sturList").setModel(that.oStruModel);
          // Calling function to create data for Tree Table
          that.aReqTabData();
          // Geeting the data of Tree table
          var oReqData = oGModel.getProperty("/reqData");

          that.oViewlistModel.setData({
            ViewListresults: oReqData.Requests,
          });
          that.byId("nodeTable").setModel(that.oViewlistModel);
        },

        /**
         * This function is called to generate tree table data from the input data.
         * @param {object} oData - Contain Data.
         */
        aReqTabData: function (oData) {
          var oViewData = that.viewNodeData,
            svDate = oData ? oData.results : oGModel.getProperty("/tableData"),
            oFinData = {
              Requests: [],
            },
            aFoundReq = [],
            iIndex,
            oItem,
            oNewItem,
            // Function to calculate the parent values
            fnAddTime = function (oParent, oChild, sType) {
              var oNewParent = JSON.parse(JSON.stringify(oParent)),
                oNewChild = JSON.parse(JSON.stringify(oChild)),
                oOldParent = JSON.parse(JSON.stringify(oParent));
              oNewChild._isParent = false;

              // Push the parent data item as well as it is part of the breakdown also. Do this only once
              if (oNewParent.children.length === 0) {
                oOldParent._isParent = false;
                oNewParent.children.push(oOldParent);
              }
              oNewParent.children.push(oNewChild);
              return oNewParent;
            };

          // If there is data in the table
          if (svDate.length) {
            for (var i = 0; i < svDate.length; i++) {
              // Requests
              iIndex = aFoundReq.indexOf(svDate[i].PARENT_NODE);
              // If data not found previously
              if (iIndex === -1) {
                aFoundReq.push(svDate[i].PARENT_NODE);
                svDate[i].children = [];
                svDate[i]._isParent = true;
                oFinData.Requests.push(svDate[i]);
                // Push as children
              } else {
                oItem = oFinData.Requests[iIndex];
                oNewItem = fnAddTime(oItem, svDate[i], "Reqs");
                oFinData.Requests[iIndex] = oNewItem;
              }
            }
          }
          oGModel.setProperty("/reqData", oFinData);
        },

        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        onDetailSearch: function (oEvent) {
          var sQuery =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
          sQuery = sQuery ? sQuery.trim() : "";
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
          that.byId("sturList").getBinding("items").filter(oFilters);
        },

        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        onViewNodeSearch(oEvent) {
          var sValue =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            aData = oGModel.getProperty("/tableData"),
            aResults = [];

          // Filtering data based of search input
          if (sValue && sValue.trim() !== "") {
            sValue = sValue.trim().toLocaleUpperCase();
            for (var i = 0; i < aData.length; i++) {
              if (
                aData[i].PARENT_NODE.includes(sValue) ||
                aData[i].CHILD_NODE.includes(sValue)
              ) {
                aResults.push(aData[i]);
              }
            }
          } else {
            // If there is no value in search input
            aResults = aData;
          }

          // Calling function to create data for Tree Table
          that.aReqTabData({ results: aResults });
          // Getting data of Tree Table
          var oReqData = oGModel.getProperty("/reqData");

          that.oViewlistModel.setData({
            ViewListresults: oReqData.Requests,
          });
        },

        /**
         * This function is called when click on Tab change.
         * Changing buttons visibility based on tab selected
         * @param {object} oEvent -the event information.
         */
        onTabChange: function (oEvent) {
          var oSeleTab = that.byId("detailNode").getSelectedKey();
          if (oSeleTab === "struNode") {
            that.byId("idAssign").setVisible(true);
            that.byId("idAstru").setVisible(true);
            that.byId("idEstru").setVisible(true);
            that.byId("idView").setVisible(false);
          } else if (oSeleTab === "viewNode") {
            that.byId("idAssign").setVisible(false);
            that.byId("idAstru").setVisible(false);
            that.byId("idEstru").setVisible(false);
            that.byId("idView").setVisible(true);
          }
        },

        /**
         * This function is called when click on Assign button.
         * In this function opens the View Nodes dialog to select the view node and assign to structure node
         * @param {object} oEvent -the event information.
         */
        onAssign: function (oEvent) {
          if (!that._oViewNode) {
            that._oViewNode = sap.ui.xmlfragment(
              "cpappf.cpnodesdetails.view.ViewNodes",
              that
            );
            that.getView().addDependent(that._oViewNode);
          }
          // Condition to check structure node selected or not
          if (this.byId("sturList").getSelectedItems().length) {
            var oViewData = oGModel.getProperty("/ViewNodeData");
            that.viewAssignData = [];
            var oSelItem = oGModel.getProperty("/SelectedAccessNode");

            oGModel.setProperty(
              "/selstrNode",
              this.byId("sturList").getSelectedItem().getCells()[0].getText()
            );
            oGModel.setProperty(
              "/selstrNodeDesc",
              this.byId("sturList").getSelectedItem().getCells()[1].getText()
            );

            for (var i = 0; i < oViewData.length; i++) {
              if (oViewData[i].PARENT_NODE === oSelItem) {
                that.viewAssignData.push(oViewData[i]);
              }
            }

            that.oViewModel.setData({
              ViewNodesresults: that.viewAssignData,
            });
            sap.ui.getCore().byId("ViewList").setModel(that.oViewModel);
            // Opening dialog if there is any data
            if (that.viewAssignData.length !== 0) {
              that._oViewNode.open();
            } else {
              MessageToast.show(
                "There is no View Nodes for the selected Access Node"
              );
            }
          } else {
            MessageToast.show("Select structure node to assign");
          }
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         */
        onViewNodeClose: function () {
          sap.ui.getCore().byId("ViewList")._searchField.setValue("");
          if (that._oViewNode.getBinding("items")) {
            that._oViewNode.getBinding("items").filter([]);
          }
        },

        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        handleViewSearch: function (oEvent) {
          var sQuery =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            sId = oEvent.getParameter("id"),
            oFilters = [];
          // Check if search filter is to be applied
          sQuery = sQuery ? sQuery.trim() : "";

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
          that._oViewNode.getBinding("items").filter(oFilters);
        },

        /**
         * This function is called when click on Add or Edit Structure Node.
         * In this function it will open dialog to creating or Editing of Structure Node
         * @param {object} oEvent -the event information.
         */
        onStruNode: function (oEvent) {
          if (!that._oStruNode) {
            that._oStruNode = sap.ui.xmlfragment(
              "cpappf.cpnodesdetails.view.StructureNodes",
              that
            );
            that.getView().addDependent(that._oStruNode);
          }
          oGModel = this.getModel("oGModel");
          oGModel.setProperty("/sFlag", "");
          // Opening dialog and setting data based on selected button
          if (oEvent.getSource().getTooltip().includes("Add")) {
            that._oStruNode.setTitle("Structure Node Creation");
            sap.ui.getCore().byId("idStruNode").setValue("");
            sap.ui.getCore().byId("idStruDesc").setValue("");
            sap.ui.getCore().byId("idLower").setValue("");
            sap.ui.getCore().byId("idUpper").setValue("");
            oGModel.setProperty("/sFlag", "C");
            that._oStruNode.open();
          } else {
            if (this.byId("sturList").getSelectedItems().length) {
              var oTableItem = this.byId("sturList")
                .getSelectedItem()
                .getCells();
              that._oStruNode.setTitle("Update Structure Node");
              sap.ui
                .getCore()
                .byId("idStruNode")
                .setValue(oTableItem[0].getText());
              sap.ui
                .getCore()
                .byId("idStruDesc")
                .setValue(oTableItem[1].getText());
              sap.ui.getCore().byId("idStruNode").setEditable(false);
              oGModel.setProperty("/sFlag", "E");
              that._oStruNode.open();
            } else {
              MessageToast.show("Select structure node to update");
            }
          }
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         */
        onStruNodeClose: function () {
          this.byId("sturList").removeSelections();
          that._oStruNode.close();
          that._oStruNode.destroy(true);
          that._oStruNode = "";
        },

        /**
         * This function is called when click on Delete button on Structure Node list.
         * @param {object} oEvent -the event information.
         */
        onStruNodeDel: function (oEvent) {
          // Getting the selected Structure Node to delete
          var oSelectedStruNode = oEvent
              .getSource()
              .getParent()
              .getCells()[0]
              .getText(),
            oAccessNode = oGModel.getProperty("/SelectedAccessNode");
          // Getting the conformation popup before deleting
          var sText =
            "Do you want to delete all the assignments of this Node. " +
            " - " +
            oSelectedStruNode +
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
                    CHILD_NODE: oSelectedStruNode,
                    PARENT_NODE: oAccessNode,
                    ACCESS_NODES: oAccessNode,
                    NODE_TYPE: "SN",
                    NODE_DESC: "",
                    LOWERLIMIT: 0,
                    UPPERLIMIT: 0,
                    FLAG: "D",
                  },
                  success: function (oData) {
                    if (oData.results.length > 0) {
                      MessageToast.show("Structure node deleted successfully");
                    } else {
                      MessageToast.show("Deletion failed");
                    }
                    // Refreshing data after successfull deletion
                    that.bus.publish("data", "refreshMaster");
                    sap.ui.core.BusyIndicator.hide();
                  },
                  error: function () {
                    MessageToast.show("Failed to delete Structure node");
                    sap.ui.core.BusyIndicator.hide();
                  },
                });
              }
            },
          });
        },

        /**
         * This function is called when click on Save button in dialog.
         * On Save it will Create or Update the Structure Node based on Flag
         * @param {object} oEvent -the event information.
         */
        onStruNodeSave: function (oEvent) {
          var oAccessNode = sap.ui.getCore().byId("idAccNode").getValue(),
            oStructureNode = sap.ui.getCore().byId("idStruNode").getValue(),
            oDesc = sap.ui.getCore().byId("idStruDesc").getValue(),
            flag = oGModel.getProperty("/sFlag"),
            iLower,
            iUpper;

          if (sap.ui.getCore().byId("idLower").getValue() === "") {
            iLower = sap.ui.getCore().byId("idLower").getPlaceholder();
          } else {
            iLower = sap.ui.getCore().byId("idLower").getValue();
          }

          if (sap.ui.getCore().byId("idUpper").getValue() === "") {
            iUpper = sap.ui.getCore().byId("idUpper").getPlaceholder();
          } else {
            iUpper = sap.ui.getCore().byId("idUpper").getValue();
          }

          if (iUpper >= iLower) {
            that.getModel("BModel").callFunction("/genpvs", {
              method: "GET",
              urlParameters: {
                CHILD_NODE: oStructureNode,
                PARENT_NODE: oAccessNode,
                ACCESS_NODES: oAccessNode,
                NODE_TYPE: "SN",
                NODE_DESC: oDesc,
                LOWERLIMIT: iLower,
                UPPERLIMIT: iUpper,
                FLAG: flag,
              },
              success: function (oData) {
                if (flag === "C") {
                  MessageToast.show("Successfully created the structure node");
                } else {
                  MessageToast.show("Successfully updated the structure node");
                }
                that.onStruNodeClose();
                // Refreshing data after successfull creation or updation
                that.bus.publish("data", "refreshMaster");
                sap.ui.core.BusyIndicator.hide();
              },
              error: function (oData) {
                MessageToast.show("Failed to updated the structure node");
                sap.ui.core.BusyIndicator.hide();
              },
            });
          } else {
            MessageToast.show("Lower limit is greater then Upper limit");
          }
        },

        /**
         * This function is called when selecting View Node in dialog.
         * This function will assign View Node to Structure Node.
         * @param {object} oEvent -the event information.
         */
        onAssignViewNode: function (oEvent) {
          // Getting data of selected Structure node and View Node
          var oStruNode = oGModel.getProperty("/selstrNode");
          var oStruNodeDesc = oGModel.getProperty("/selstrNodeDesc");
          var oViewNode = oEvent.getParameter("selectedItems")[0].getTitle();
          var oViewNodeDesc = oEvent
              .getParameter("selectedItems")[0]
              .getDescription(),
            oAccessNode = oGModel.getProperty("/SelectedAccessNode");

          var sDesc = oViewNodeDesc + " " + "-" + " " + oStruNodeDesc;

          // Calling function
          that.getModel("BModel").callFunction("/genpvs", {
            method: "GET",
            urlParameters: {
              CHILD_NODE: oStruNode,
              PARENT_NODE: oViewNode,
              ACCESS_NODES: oAccessNode,
              NODE_TYPE: "VS",
              NODE_DESC: sDesc,
              LOWERLIMIT: 0,
              UPPERLIMIT: 0,
              FLAG: "C",
            },
            success: function (oData) {
              if (oData.results.length > 0) {
                MessageToast.show("View Node assigned successfully");
                that.onViewNodeClose();
                // Refreshing data after successfull creation
                that.bus.publish("data", "refreshMaster");
              } else {
                MessageToast.show("View Node is already assigned");
              }
              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oData) {
              MessageToast.show("Failed to updated the structure node");
              sap.ui.core.BusyIndicator.hide();
            },
          });
        },

        /**
         * This function is called when click on Delete button in View Node Tab.
         * This function will unassign the structure node to view node
         * @param {object} oEvent -the event information.
         */
        onStruViewDelete: function (oEvent) {
          // Getting data of Structure and View Node
          var oBinding = oEvent.getSource().getParent().getBindingContext(),
            oViewNode = oBinding.getObject().PARENT_NODE,
            oStruNode = oBinding.getObject().CHILD_NODE,
            oAccessNode = oBinding.getObject().ACCESS_NODES;

          // Getting the conformation popup before deleting
          var sText =
            "Do you want to delete all the assignments of this Node. " +
            " - " +
            oStruNode +
            "-" +
            "Please confirm";
          sap.m.MessageBox.show(sText, {
            title: "Confirmation",
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.YES) {
                sap.ui.core.BusyIndicator.show();
                // Calling function to remove Structure Node
                that.getModel("BModel").callFunction("/genpvs", {
                  method: "GET",
                  urlParameters: {
                    CHILD_NODE: oStruNode,
                    PARENT_NODE: oViewNode,
                    ACCESS_NODES: oAccessNode,
                    NODE_TYPE: "VS",
                    NODE_DESC: "",
                    LOWERLIMIT: 0,
                    UPPERLIMIT: 0,
                    FLAG: "D",
                  },
                  success: function (oData) {
                    if (oData.results.length > 0) {
                      MessageToast.show("Deleted successfully");
                    } else {
                      MessageToast.show("Deletion failed");
                    }
                    // Refreshing data after successfull deletion
                    that.bus.publish("data", "refreshMaster");
                    sap.ui.core.BusyIndicator.hide();
                  },
                  error: function (oData) {
                    MessageToast.show("Failed to unassign structure node");
                    sap.ui.core.BusyIndicator.hide();
                  },
                });
              }
            },
          });
        },

        /**
         * This function is called when click on Add View Node button in View Node tab.
         * This function willl will open dialog to create view node.
         */
        onViewNode: function () {
          if (!that._oViewNodeCreate) {
            that._oViewNodeCreate = sap.ui.xmlfragment(
              "cpappf.cpnodesdetails.view.ViewNodesCreation",
              that
            );
            that.getView().addDependent(that._oViewNodeCreate);
          }

          sap.ui.getCore().byId("idViewNode").setValue("");
          sap.ui.getCore().byId("idViewDesc").setValue("");

          that._oViewNodeCreate.open();
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         */
        onViewClose: function () {
          that._oViewNodeCreate.close();
          that._oViewNodeCreate.destroy(true);
          that._oViewNodeCreate = "";
        },

        /**
         * This function is called when click on Save button in View Node dialog.
         * This function will create View Node in View Node tab.
         * @param {object} oEvent -the event information.
         */
        onViewNodeCreate: function () {
          // Getting data of input fileds
          var oAccessNode = oGModel.getProperty("/SelectedAccessNode"),
            oViewNode = sap.ui.getCore().byId("idViewNode").getValue(),
            oNodeDesc = sap.ui.getCore().byId("idViewDesc").getValue();
          // Calling function to create View Node
          that.getModel("BModel").callFunction("/genpvs", {
            method: "GET",
            urlParameters: {
              CHILD_NODE: oViewNode,
              PARENT_NODE: oAccessNode,
              ACCESS_NODES: oAccessNode,
              NODE_TYPE: "VN",
              NODE_DESC: oNodeDesc,
              LOWERLIMIT: 0,
              UPPERLIMIT: 0,
              FLAG: "C",
            },
            success: function (oData) {
              MessageToast.show("Successfully created view node");
              that.onViewClose();
              // Refreshing data after successfull creation
              that.bus.publish("data", "refreshMaster");
              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oData) {
              MessageToast.show("Failed to updated the structure node");
              sap.ui.core.BusyIndicator.hide();
            },
          });
        },

        /**
         * This function is called when click on Delete button of View node.
         * View Node delete button will visible when there is no Structure Node assigned to View Node
         * @param {object} oEvent -the event information.
         */
        onViewNOdeDelete: function (oEvent) {
          // Getting data of View node to delete
          var oBinding = oEvent.getSource().getParent().getBindingContext(),
            oViewNode = oBinding.getObject().PARENT_NODE,
            oAccessNode = oGModel.getProperty("/SelectedAccessNode");

          // Getting the conformation popup before deleting
          var sText =
            "Do you want to delete all the assignments of this Node. " +
            " - " +
            oViewNode +
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
                    CHILD_NODE: oViewNode,
                    PARENT_NODE: oAccessNode,
                    ACCESS_NODES: oAccessNode,
                    NODE_TYPE: "VN",
                    NODE_DESC: "",
                    LOWERLIMIT: 0,
                    UPPERLIMIT: 0,
                    FLAG: "D",
                  },
                  success: function (oData) {
                    if (oData.results.length > 0) {
                      MessageToast.show("Deleted successfully");
                    } else {
                      MessageToast.show("Deletion failed");
                    }
                    // Refreshing data after successfull deletion
                    that.bus.publish("data", "refreshMaster");
                    sap.ui.core.BusyIndicator.hide();
                  },
                  error: function (oData) {
                    MessageToast.show("Failed to unassign structure node");
                    sap.ui.core.BusyIndicator.hide();
                  },
                });
              }
            },
          });
        },
      }
    );
  }
);
