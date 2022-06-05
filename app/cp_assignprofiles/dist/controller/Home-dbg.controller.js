sap.ui.define(
  [
    "cp/appf/cpassignprofiles/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpassignprofiles.controller.Home", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Models
        that.oListModel = new JSONModel();
        that.oParamModel = new JSONModel();
        that.oAlgoListModel = new JSONModel();
      },

      /**
       * Called after the view has been rendered
       * Calls the getData[function] to get Data
       */
      onAfterRendering: function () {
        that = this;
        this.dDate = new Date().toISOString().split("T")[0];
        that.oList = this.byId("profList");
        this.byId("headSearch").setValue("");
        that.oList.removeSelections();
        if (that.oList.getBinding("items")) {
          that.oList.getBinding("items").filter([]);
        }
        // Calling function
        this.getData();
      },

      /**
       * Getting Data Initially and binding to elements
       */
      getData: function () {
        this.getModel("BModel").read("/getProfiles", {
          success: function (oData) {
            that.oListModel.setData({
              results: oData.results,
            });
            that.oList.setModel(that.oListModel);
          },
          error: function () {
            MessageToast.show("Failed to get profiles");
          },
        });
      },

      /**
       * Called when something is entered into the search field
       * @param {object} oEvent -the event information
       */
      onSearch: function (oEvent) {
        var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (sQuery !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("PROFILE", FilterOperator.Contains, sQuery),
                new Filter("PRF_DESC", FilterOperator.Contains, sQuery),
                new Filter("METHOD", FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }
        that.oList.getBinding("items").filter(oFilters);
      },

      /**
       * This function is called when a click on parameter button.
       */
      onParameters: function (oEvent) {
        var sSelProfie = oEvent
          .getSource()
          .getParent()
          .getCells()[0]
          .getTitle();
        var sSelMethod = oEvent.getSource().getParent().getCells()[1].getText();
        // Setting title for fragment
        var sTitle =
          "Parameters " + " " + " - " + sSelProfie + " " + " - " + sSelMethod;

        if (!that._onParameter) {
          that._onParameter = sap.ui.xmlfragment(
            "cp.appf.cpassignprofiles.view.Parameter",
            that
          );
          that.getView().addDependent(that._onParameter);
        }
        // Setting title for fragment
        that._onParameter.setTitleAlignment("Center");
        that._onParameter.setTitle(sTitle);
        that.paramList = sap.ui.getCore().byId("idParam");

        this.getModel("BModel").read("/getProfileParameters", {
          filters: [
            new Filter("PROFILE", FilterOperator.EQ, sSelProfie),
            new Filter("METHOD", FilterOperator.EQ, sSelMethod),
          ],
          success: function (oData) {
            that.oParamModel.setData({
              results: oData.results,
            });
            that.paramList.setModel(that.oParamModel);
            that._onParameter.open();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      /**
       * Called when 'Close/Cancel' button in any dialog is pressed.
       */
      onParaClose: function () {
        that._onParameter.close();
      },

      /**
       * This function is called when a click on buttons Create/ Copy/ Edit.
       */
      onCreate: function (oEvent) {
        that.oGModel = that.getModel("oGModel");
        // Getting button tooltip to perform action
        var sId = oEvent.getSource().getTooltip();

        that.oGModel.setProperty("/sId", sId);
        if (sId === "Copy" || sId === "Edit") {
          var sSelRow = this.byId("profList").getSelectedItems();

          if (sSelRow.length) {
            var sSelUsername = this.byId("profList")
              .getSelectedItem()
              .getBindingContext()
              .getProperty().CREATED_BY;
            var sSelAlgo = sSelRow[0].getBindingContext().getProperty();
            that.oGModel.setProperty("/sProfile", sSelAlgo.PROFILE);
            that.oGModel.setProperty("/sProf_desc", sSelAlgo.PRF_DESC);
            that.oGModel.setProperty("/sMethod", sSelAlgo.METHOD);
            that.oGModel.setProperty("/sCreatedBy", sSelUsername);

            // Called when it routes to a page containing the item details
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Detail", {}, true);
          } else {
            MessageToast.show("Please select one row");
          }
        } else if (sId === "Create") {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("Detail", {}, true);
        }
      },

      /**
       * This function is called when a click on Deleting profile button.
       */
      onDelete: function (oEvent) {
        var sSelRow = this.byId("profList")
          .getSelectedItems()[0]
          .getBindingContext()
          .getProperty();

        sap.ui.core.BusyIndicator.show();
        var oEntry = {};

        oEntry.PROFILE = sSelRow.PROFILE;
        oEntry.METHOD = sSelRow.METHOD;
        oEntry.PRF_DESC = "D";
        sap.ui.core.BusyIndicator.show();
        that.getModel("BModel").callFunction("/createProfiles", {
          method: "GET",
          urlParameters: {
            PROFILE: oEntry.PROFILE,
            METHOD: oEntry.METHOD,
            PRF_DESC: oEntry.PRF_DESC,
            CREATED_DATE: that.dDate,
            CREATED_BY: "",
          },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Profile deleted");
            //Calling function to delete Profile Parameters
            that.tablesendbatch();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Failed to delete Profile parameters");
          },
        });
      },

      /**
       * This function is called when deleting Profile Parameters.
       */
      tablesendbatch: function () {
        var sSelRow = this.byId("profList")
          .getSelectedItems()[0]
          .getBindingContext()
          .getProperty();

        sap.ui.core.BusyIndicator.show();
        that.getModel("BModel").callFunction("/createProfilePara", {
          method: "GET",
          urlParameters: {
            FLAG: "D",
            PROFILE: sSelRow.PROFILE,
            METHOD: sSelRow.METHOD,
            PARA_NAME: "",
            INTVAL: 0,
            DOUBLEVAL: 0.0,
            STRVAL: "",
            PARA_DESC: "",
            PARA_DEP: "",
            CREATED_DATE: that.dDate,
            CREATED_BY: ""
          },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Profile parameters deleted");
            // Refreshing the page after deletion
            that.onAfterRendering();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Failed to delete Profile parameters");
          },
        });
      },
    });
  }
);
