sap.ui.define(
  [
    "cpapp/cpbompvs/controller/BaseController",
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
    return BaseController.extend("cpapp.cpbompvs.controller.ItemDetail", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        this.bus = sap.ui.getCore().getEventBus();
        // Declaring JSON Models and size limits
        that.oAssignModel = new JSONModel();
        that.oStruModelDetail = new JSONModel();
        that.oAssinModel = new JSONModel();
        that.oAssignModel.setSizeLimit(1000);
        that.oStruModelDetail.setSizeLimit(1000);
        oGModel = that.getOwnerComponent().getModel("oGModel");
        oGModel.setProperty("/resetFlag", "");
      },

      /**
       * Called after the view has been rendered.
       */
      onAfterRendering: function () {
        sap.ui.core.BusyIndicator.show();
        oGModel = that.getOwnerComponent().getModel("oGModel");

        that.byId("detailNode").setSelectedKey("assignNode");
        that.byId("idTextfrom").setVisible(true);
        that.byId("fromDate").setVisible(true);
        that.byId("idTextto").setVisible(true);
        that.byId("toDate").setVisible(true);
        that.byId("idButton").setVisible(true);
        that.byId("fromDate").setValue("");
        that.byId("toDate").setValue("");

        that.byId("sturList").removeSelections();

        var oSelLoc = oGModel.getProperty("/SelectedLoc");
        var oSelProd = oGModel.getProperty("/SelectedProd");
        this.getModel("BModel").read("/getPVSBOM", {
          filters: [
            new Filter("PRODUCT_ID", FilterOperator.EQ, oSelProd),
            new Filter("LOCATION_ID", FilterOperator.EQ, oSelLoc),
          ],
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            that.oAssignModel.setData({
              results: oData.results,
            });
            that.byId("sturList").setModel(that.oAssignModel);
          },
          error: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });

        if (oGModel.getProperty("/resetFlag") === "") {
          this.getModel("BModel").read("/genCompStrcNode", {
            filters: [
              new Filter("PRODUCT_ID", FilterOperator.EQ, oSelProd),
              new Filter("LOCATION_ID", FilterOperator.EQ, oSelLoc),
            ],
            success: function (oData) {
              oGModel.setProperty("/tableData", oData.results);
              // Calling function to generate tree table data
              that.aReqTabData();

              var oReqData = oGModel.getProperty("/reqData");

              that.oStruModelDetail.setData({
                struDetailresults: oReqData.Requests,
              });
              that.byId("StrunodeTable").setModel(that.oStruModelDetail);

              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oData) {
              sap.ui.core.BusyIndicator.hide();
              MessageToast.show("Failed to get data");
            },
          });
        }
      },

      /**
       * This function is to generate tree table data.
       * @param {object} oData -the data information.
       */
      aReqTabData: function (oData) {
        var aData = oData ? oData.results : oGModel.getProperty("/tableData"),
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

        for (var i = 0; i < aData.length; i++) {
          // Requests
          iIndex = aFoundReq.indexOf(aData[i].STRUC_NODE);
          // If data not found previously
          if (iIndex === -1) {
            aFoundReq.push(aData[i].STRUC_NODE);
            aData[i].children = [];
            aData[i]._isParent = true;
            oFinData.Requests.push(aData[i]);
            // Push as children
          } else {
            oItem = oFinData.Requests[iIndex];
            oNewItem = fnAddTime(oItem, aData[i], "Reqs");
            oFinData.Requests[iIndex] = oNewItem;
          }
        }

        oGModel.setProperty("/reqData", oFinData);
      },

      /**
       * Called when something is entered into the search field of Tree Table.
       * @param {object} oEvent -the event information.
       */
      onStruNodeSearch: function (oEvent) {
        var sValue =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          aData = oGModel.getProperty("/tableData"),
          aResults = [];

        if (sValue && sValue.trim() !== "") {
          sValue = sValue.trim().toLocaleUpperCase();
          for (var i = 0; i < aData.length; i++) {
            if (
              aData[i].STRUC_NODE.includes(sValue) ||
              aData[i].COMPONENT.includes(sValue)
            ) {
              aResults.push(aData[i]);
            }
          }
        } else {
          aResults = aData;
        }

        // Calling function to generate tree table data
        that.aReqTabData({ results: aResults });

        var oReqData = oGModel.getProperty("/reqData");

        that.oStruModelDetail.setData({
          struDetailresults: oReqData.Requests,
        });
      },

      /**
       * This function is called when a click on Tab Change.
       * @param {object} oEvent -the event information.
       */
      onTabChange: function (oEvent) {
        var seleTab = that.byId("detailNode").getSelectedKey();
        if (seleTab === "assignNode") {
            that.byId("idTextfrom").setVisible(true);
            that.byId("fromDate").setVisible(true);
            that.byId("idTextto").setVisible(true);
            that.byId("toDate").setVisible(true);
            that.byId("idButton").setVisible(true);
        } else if (seleTab === "StruNodeDetail") {
            that.byId("idTextfrom").setVisible(false);
            that.byId("fromDate").setVisible(false);
            that.byId("idTextto").setVisible(false);
            that.byId("toDate").setVisible(false);
            that.byId("idButton").setVisible(false);
        }
      },

      /**
       * This function is called when a click on Go button.
       * Data fetched based on selections.
       * @param {object} oEvent -the event information.
       */
      onGetData: function (oEvent) {
        sap.ui.core.BusyIndicator.show();
        oGModel = that.getOwnerComponent().getModel("oGModel");

        that.byId("sturList").removeSelections();

        var oSelLoc = oGModel.getProperty("/SelectedLoc");
        var oSelProd = oGModel.getProperty("/SelectedProd");
        var fromDate = new Date(that.byId("fromDate").getDateValue()),
          toDate = new Date(that.byId("toDate").getDateValue());
        var fromMnth, fromDat, toMnth, toDat;
        var mnthFrm = fromDate.getMonth() + 1,
          mnthto = toDate.getMonth() + 1;

        if (mnthFrm < 10) {
          fromMnth = "0" + mnthFrm;
        } else {
          fromMnth = mnthFrm;
        }

        if (fromDate.getDate() < 10) {
          fromDat = "0" + fromDate.getDate();
        } else {
          fromDat = fromDate.getDate();
        }

        if (mnthto < 10) {
          toMnth = "0" + mnthto;
        } else {
          toMnth = mnthto;
        }

        if (toDate.getDate() < 10) {
          toDat = "0" + toDate.getDate();
        } else {
          toDat = toDate.getDate();
        }

        fromDate = fromDate.getFullYear() + "-" + fromMnth + "-" + fromDat;
        toDate = toDate.getFullYear() + "-" + toMnth + "-" + toDat;
        this.getModel("BModel").read("/getPVSBOM", {
          filters: [
            new Filter("PRODUCT_ID", FilterOperator.EQ, oSelProd),
            new Filter("LOCATION_ID", FilterOperator.EQ, oSelLoc),
            new Filter("VALID_FROM", FilterOperator.EQ, fromDate),
            new Filter("VALID_TO", FilterOperator.EQ, toDate),
          ],
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            that.oAssignModel.setData({
              results: oData.results,
            });
            that.byId("sturList").setModel(that.oAssignModel);
          },
          error: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * This function is called when a click on rest button to reset the Date range.
       */
      onResetDate: function () {
        that.byId("fromDate").setValue("");
        that.byId("toDate").setValue("");
        oGModel.setProperty("/resetFlag", "X");
        that.onAfterRendering();
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onDetailSearch: function (oEvent) {
        var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];
        // Check if search filter is to be applied
        sQuery = sQuery ? sQuery.trim() : "";
        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("COMPONENT", FilterOperator.Contains, sQuery),
                new Filter("STRUC_NODE", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.byId("sturList").getBinding("items").filter(oFilters);
      },

      /**
       * This function is called when a click on Assign button to open structure node data.
       * @param {object} oEvent -the event information.
       */
      onAssign: function (oEvent) {
        if (!that._oStruNode) {
          that._oStruNode = sap.ui.xmlfragment(
            "cpapp.cpbompvs.view.StructureNodes",
            that
          );
          that.getView().addDependent(that._oStruNode);
        }

        if (that.byId("sturList").getSelectedItems().length === 1) {
          var oSelNode = oGModel.getProperty("/SelectedNode");
          var oSelComponent = that
            .byId("sturList")
            .getSelectedItem()
            .getCells()[1]
            .getText();
          var oSelItem = that
            .byId("sturList")
            .getSelectedItem()
            .getCells()[0]
            .getText();
          oGModel.setProperty("/SelecteComponent", oSelComponent);
          oGModel.setProperty("/SelecteItem", oSelItem);

          this.getModel("BModel").read("/getPVSNodes", {
            filters: [
              new Filter("PARENT_NODE", FilterOperator.EQ, oSelNode),
              new Filter("NODE_TYPE", FilterOperator.EQ, "SN"),
            ],
            success: function (oData) {
              that.oAssinModel.setData({
                results: oData.results,
              });
              sap.ui.getCore().byId("sturList").setModel(that.oAssinModel);

              that._oStruNode.open();
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        } else {
          MessageToast.show(
            "Please select compponent to assign structure node"
          );
        }
      },

      /**
       * This function is called when a click on structure node to selected component.
       * @param {object} oEvent -the event information.
       */
      handleStruSelection: function (oEvent) {
        that = this;
        var oLoc = oGModel.getProperty("/SelectedLoc"),
          oProd = oGModel.getProperty("/SelectedProd"),
          oComponent = oGModel.getProperty("/SelecteComponent"),
          oItem = oGModel.getProperty("/SelecteItem"),
          oStruNode = oEvent.getParameter("selectedItems")[0].getTitle();
        that.getModel("BModel").callFunction("/genCompSN", {
          method: "GET",
          urlParameters: {
            LOCATION_ID: oLoc,
            PRODUCT_ID: oProd,
            COMPONENT: oComponent,
            ITEM_NUM: oItem,
            STRUC_NODE: oStruNode,
          },
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Structure Node assigned successfully");
            // that.onStruNodeClose();
            oGModel.setProperty("/resetFlag", "");
            // Refreshing the data
            that.onAfterRendering();
          },
          error: function (data) {
            sap.m.MessageToast.show(JSON.stringify(data));
          },
        });
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      handleStruSearch: function (oEvent) {
        var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
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
        that._oStruNode.getBinding("items").filter(oFilters);
      },

      /**
       * This function is called when a click on delete button to delete Structure Node.
       * @param {object} oEvent -the event information.
       */
      onStructureNodeDel: function (oEvent) {
        var oLoc = oGModel.getProperty("/SelectedLoc"),
          oProd = oGModel.getProperty("/SelectedProd"),
          oSelectedItem = oEvent
            .getSource()
            .getParent()
            .getCells()[0]
            .getText(),
          oSelectedComp = oEvent
            .getSource()
            .getParent()
            .getCells()[1]
            .getText();
        that.getModel("BModel").callFunction("/genCompSN", {
          method: "GET",
          urlParameters: {
            LOCATION_ID: oLoc,
            PRODUCT_ID: oProd,
            ITEM_NUM: oSelectedItem,
            COMPONENT: oSelectedComp,
            STRUC_NODE: "D",
          },
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Structure Node deleted");
            // that.onStruNodeClose();
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
