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
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
        that.oParamModel = new JSONModel();
        that.oAlgoListModel = new JSONModel();
      },
      onAfterRendering: function () {
        that = this;
        // oGModel = this.getModel("oGModel");
        // this.i18n = this.getResourceBundle();
        that.oList = this.byId("profList");
        that.oList.removeSelections();
        if (that.oList.getBinding("items")) {
          that.oList.getBinding("items").filter([]);
        }
        // Calling function
        this.getData();
      },
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

      onSearch: function (oEvent) {
        var query =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (query !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("PROFILE", FilterOperator.Contains, query),
                new Filter("PRF_DESC", FilterOperator.Contains, query),
                new Filter("METHOD", FilterOperator.Contains, query)
              ],
              and: false,
            })
          );
        }
        that.oList.getBinding("items").filter(oFilters);
      },

      onParameters: function (oEvent) {
        var selProfie = oEvent.getSource().getParent().getCells()[0].getTitle();
        var selMethod = oEvent.getSource().getParent().getCells()[1].getText();

        var Title =
          "Parameters " + " " + " - " + selProfie + " " + " - " + selMethod;

        if (!that._onParameter) {
          that._onParameter = sap.ui.xmlfragment(
            "cp.appf.cpassignprofiles.view.Parameter",
            that
          );
          that.getView().addDependent(that._onParameter);
        }
        that._onParameter.setTitleAlignment("Center");
        that._onParameter.setTitle(Title);
        that.paramList = sap.ui.getCore().byId("idParam");

        this.getModel("BModel").read("/getProfileParameters", {
          //   filters: [oFilters],
          filters: [
            new Filter("PROFILE", FilterOperator.EQ, selProfie),
            new Filter("METHOD", FilterOperator.EQ, selMethod),
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
      onParaClose: function () {
        that._onParameter.close();
        //   that._onParameter.destroy(true);
        //   that._onParameter = "";
      },

      onCreate: function (oEvent) {
        that.oGModel = that.getModel("oGModel");

        var sId = oEvent.getSource().getTooltip();
        that.oGModel.setProperty("/sId", sId);
        if (sId === "Copy") {
          var selRow = this.byId("profList").getSelectedItems();

          if (selRow.length) {
            var selAlgo = selRow[0].getBindingContext().getProperty();
            that.oGModel.setProperty("/sProfile", selAlgo.PROFILE);
            that.oGModel.setProperty("/sProf_desc", selAlgo.PRF_DESC);
            that.oGModel.setProperty("/sMethod", selAlgo.METHOD);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Detail", {}, true);
          } else {
            MessageToast.show("Please select one row");
          }
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("Detail", {}, true);
        }
      },
      onAddClose: function () {
        that._onAddppf.close();
        //   that._onAddppf.destroy(true);
        //   that._onAddppf = "";
      },
      onAlgorChange: function (oEvent) {
        var selAlgo = sap.ui.getCore().byId("idAlgo")._getSelectedItemText();
        that.alogoList = sap.ui.getCore().byId("idTab");

        var oFilters = new Filter("METHOD", FilterOperator.EQ, selAlgo);

        this.getModel("PModel").read("/get_palparameters", {
          filters: [oFilters],

          success: function (oData) {
            oData.results.forEach(function (row) {
              row.FLAG = row.DATATYPE;
            }, that);

            that.oAlgoListModel.setData({
              results: oData.results,
            });
            that.alogoList.setModel(that.oAlgoListModel);
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      }

      
    });
  }
);
