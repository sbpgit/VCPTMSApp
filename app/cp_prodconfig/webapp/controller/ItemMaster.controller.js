sap.ui.define(
  [
    "cp/appf/cpprodconfig/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpprodconfig.controller.ItemMaster", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaration of JSON model
        that.oModel = new JSONModel();
        this.bus = sap.ui.getCore().getEventBus();
        this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
        this.bus.publish("nav", "toBeginPage", {
          viewName: this.getView().getProperty("viewName"),
        });
      },

      /**
       * Called after the view has been rendered.
       * Getting data for Product Class
       */
      onAfterRendering: function () {
        that = this;
        oGModel = this.getModel("oGModel");

        // Calling service to get the Prod list
        this.getModel("BModel").read("/getProdClass", {
          success: function (oData) {
            that.oModel.setData({
              results: oData.results,
            });
            that.byId("prodList").setModel(that.oModel);
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
          // Getting the selected Item from list
          var oSelItem = oEvent
            .getSource()
            .getSelectedItem()
            .getBindingContext()
            .getObject();

          // Setting the selected values
          oGModel.setProperty("/prdId", oSelItem.PRODUCT_ID);
          oGModel.setProperty("/className", oSelItem.CLASS_NAME);
          oGModel.setProperty("/classNo", oSelItem.CLASS_NUM);
          oGModel.setProperty("/prodDesc", oSelItem.PROD_DESC);
          oGModel.setProperty("/prodFam", oSelItem.PROD_FAMILY);
          oGModel.setProperty("/prodGroup", oSelItem.PROD_GROUP);
          oGModel.setProperty("/prodModel", oSelItem.PROD_MODEL);
          oGModel.setProperty("/prodMidRng", oSelItem.PROD_MDLRANGE);
          oGModel.setProperty("/prodSeries", oSelItem.PROD_SERIES);
        }
        // Calling Item Detail page
        that.getOwnerComponent().runAsOwner(function () {
          if (!that.oDetailView) {
            try {
              that.oDetailView = sap.ui.view({
                viewName: "cp.appf.cpprodconfig.view.ItemDetail",
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
                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.byId("prodList").getBinding("items").filter(oFilters);
      },
    });
  }
);
