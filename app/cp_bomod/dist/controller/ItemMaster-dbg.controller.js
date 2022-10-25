sap.ui.define(
  [
    "cp/appf/cpbomod/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpbomod.controller.ItemMaster", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Model and size limit
        that.oModel = new JSONModel();
        this.oModel.setSizeLimit(1000);
        this.bus = sap.ui.getCore().getEventBus();
        this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
        this.bus.publish("nav", "toBeginPage", {
          viewName: this.getView().getProperty("viewName"),
        });
      },

      /**
       * This function is to refreshing Master page data.
       */
      refreshMaster: function () {
        this.onAfterRendering();
      },

      /**
       * Called after the view has been rendered
       */
      onAfterRendering: function () {
        that = this;
        oGModel = this.getModel("oGModel");
        sap.ui.core.BusyIndicator.show();

        this.getModel("BModel").read("/getLocProdDet ", {
          success: function (oData) {
            that.oModel.setData({
              results: oData.results,
            });
            that.byId("bomList").setModel(that.oModel);
            oGModel.setProperty("/prdId", oData.results[0].PRODUCT_ID);
            oGModel.setProperty("/locId", oData.results[0].LOCATION_ID);
            // Setting the default selected item for table
            that.byId("bomList").setSelectedItem(that.byId("bomList").getItems()[0], true);
            // Calling function to navigate to Item detail page
            that.onhandlePress();
            sap.ui.core.BusyIndicator.hide();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * Called when it routes to a page containing the item details.
       */
      onhandlePress: function (oEvent) {
        oGModel = this.getModel("oGModel");

        if (oEvent) {
          var sSelItem = oEvent
            .getSource()
            .getSelectedItem()
            .getBindingContext()
            .getObject();
          // Set the selected values to get the details
          oGModel.setProperty("/prdId", sSelItem.PRODUCT_ID);
          oGModel.setProperty("/locId", sSelItem.LOCATION_ID);
        }
        // Calling Item Detail page
        that.getOwnerComponent().runAsOwner(function () {
          if (!that.oDetailView) {
            try {
              that.oDetailView = sap.ui.view({
                viewName: "cp.appf.cpbomod.view.ItemDetail",
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
        that.byId("bomList").getBinding("items").filter(oFilters);
      },
    });
  }
);
