sap.ui.define(
  [
    "cp/appf/cpbomod/controller/BaseController",
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
    return BaseController.extend("cp.appf.cpbomod.controller.ItemDetail", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        this.bus = sap.ui.getCore().getEventBus();
        // Declaring JSON Models and size limit
        that.oBomModel = new JSONModel();
        that.oBomOnPanelModel = new JSONModel();
        that.oCharModel = new JSONModel();
        this.oBomModel.setSizeLimit(1000);
        this.oCharModel.setSizeLimit(1000);
        oGModel = that.getOwnerComponent().getModel("oGModel");
      },

      /**
       * Called after the view has been rendered.
       * Calls the service to get Data.
       */
      onAfterRendering: function () {
        oGModel = that.getOwnerComponent().getModel("oGModel");
        sap.ui.core.BusyIndicator.show();
        var sPrdId = oGModel.getProperty("/prdId");
        var sLocId = oGModel.getProperty("/locId");

        this.getModel("BModel").read("/getBomOdCond", {
          filters: [
            new Filter("LOCATION_ID", FilterOperator.EQ, sLocId),
            new Filter("PRODUCT_ID", FilterOperator.EQ, sPrdId),
          ],

          success: function (oData) {
            // Panel expansion based on results
            if (oData.results.length === 0) {
              that.byId("idBomPanel").setExpanded(true);
              that.byId("idCharPanel").setExpanded(false);
              that.oBomModel.setData({
                results: [],
              });
              that.byId("idBom").setModel(that.oBomModel);
            } else {
              that.oBomModel.setData({
                results: oData.results,
              });
              that.byId("idBom").setModel(that.oBomModel);
              that.byId("idBom").removeSelections(true);
              that.byId("idBomPanel").setExpanded(true);
              that.byId("idCharPanel").setExpanded(false);
            }
            that.byId("bomSearch").setValue("");
            sap.ui.core.BusyIndicator.hide();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * This function is called when a click on value in 1st panel getting the data for Char values.
       */
      onItemPress: function () {
        sap.ui.core.BusyIndicator.show();
        var sSelItem = this.byId("idBom")
          .getSelectedItem()
          .getCells()[2]
          .getText();

        oGModel.setProperty("/objdep", sSelItem);

        this.getModel("BModel").read("/getODcharval", {
          filters: [new Filter("OBJ_DEP", FilterOperator.EQ, sSelItem)],

          success: function (oData) {
            that.oCharModel.setData({
              charResults: oData.results,
            });
            that.byId("idChartab").setModel(that.oCharModel);
            // Collapse of 1st panel and expanding 2nd panel
            that.byId("idBomPanel").setExpanded(false);
            that.byId("idCharPanel").setExpanded(true);
            that.byId("charSearch").setValue("");
            // Calling functions
            that.oncharSearch();
            that.BomOnPanelNext();
            sap.ui.core.BusyIndicator.hide();
          },
          error: function () {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * This function is called when selected a item from 1st panel and diaplying it on 2nd panel .
       */

      BomOnPanelNext: function () {
        var sSelItem = this.byId("idBom").getSelectedItem().getCells();

        var aData = [
          {
            ITEM_NUM: sSelItem[0].getText(),
            COMPONENT: sSelItem[1].getText(),
            OBJ_DEP: sSelItem[2].getText(),
            OBJDEP_DESC: sSelItem[3].getText(),
            COMP_QTY: sSelItem[4].getText(),
            VALID_FROM: sSelItem[5].getText(),
            VALID_TO: sSelItem[6].getText(),
          },
        ];
        // Setting data of selected item from BOM Components in Obj Dep Char
        that.oBomOnPanelModel.setData({
          BOMPanelresults: aData,
        });
        that.byId("idBomOnNextPanel").setModel(that.oBomOnPanelModel);
        sap.ui.core.BusyIndicator.hide();
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      onbomSearch: function (oEvent) {
        var sQuery = "",
          oFilters = [];
        if (oEvent) {
          var sQuery = oEvent.getParameters().sQuery;
        }

        sQuery = sQuery.toUpperCase();

        sap.ui.core.BusyIndicator.show();
        var sPrdId = oGModel.getProperty("/prdId");
        var sLocId = oGModel.getProperty("/locId");
        // getting the filters
        oFilters.push(
          new Filter({
            filters: [
              new Filter("LOCATION_ID", FilterOperator.EQ, sPrdId),
              new Filter("PRODUCT_ID", FilterOperator.EQ, sLocId),
            ],
            and: true,
          })
        );

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("COMPONENT", FilterOperator.StartsWith, sQuery),
                new Filter("OBJ_DEP", FilterOperator.StartsWith, sQuery),
              ],
              and: false,
            })
          );
        }
        // getting data based on serch criteria
        this.getModel("BModel").read("/getBomOdCond", {
          filters: [oFilters],

          success: function (oData) {
            that.oBomModel.setData({
              results: oData.results,
            });
            that.byId("idBom").setModel(that.oBomModel);
            that.byId("idBom").removeSelections(true);

            that.byId("idBomPanel").setExpanded(true);
            that.byId("idCharPanel").setExpanded(false);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * Called when something is entered into the search field.
       * @param {object} oEvent -the event information.
       */
      oncharSearch: function (oEvent) {
        var sQuery = "",
          oFilters = [];
        if (oEvent) {
          sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue");
        }

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.byId("idChartab").getBinding("items").filter(oFilters);
      },
    });
  }
);
