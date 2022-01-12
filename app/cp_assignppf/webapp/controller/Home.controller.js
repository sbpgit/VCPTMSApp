sap.ui.define(
  [
    "cp/appf/cpassignppf/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpassignppf.controller.Home", {
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

      onParameters: function (oEvent) {
        var selProfie = oEvent.getSource().getParent().getCells()[0].getTitle();
        var selMethod = oEvent.getSource().getParent().getCells()[1].getText();

        var Title = "Parameters " + " " + " - " + selProfie + " " + " - " + selMethod;

        if (!that._onParameter) {
          that._onParameter = sap.ui.xmlfragment(
            "cp.appf.cpassignppf.view.Parameter",
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
            new Filter("METHOD", FilterOperator.EQ, selMethod)
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

      onPpfAdd: function (oEvent) {
        if (!that._onAddppf) {
          that._onAddppf = sap.ui.xmlfragment(
            "cp.appf.cpassignppf.view.Create",
            that
          );
          that.getView().addDependent(that._onAddppf);
        }
        that._onAddppf.setTitleAlignment("Center");
        var selId = oEvent.getSource().getTooltip();

        //   var oUserModel = new JSONModel("/services/userapi/attributes");
        // oUserModel.attachRequestCompleted(function () {
        // 	that.username = oUserModel.getData().login_name.toUpperCase();

        // });

        if (selId === "Add") {
          sap.ui.getCore().byId("idPn").setValue("");
          sap.ui.getCore().byId("idPdesc").setValue("");
          sap.ui.getCore().byId("idCretBy").setValue("");
          sap.ui.getCore().byId("idAuth").setValue("");
          sap.ui.getCore().byId("idAlgo").setSelectedKey("N");
          that._onAddppf.open();
        } else if (selId === "Copy") {
          var selRow = this.byId("profList").getSelectedItems();

          if (selRow.length) {
            var selAlgo = selRow[0].getBindingContext().getProperty();
            sap.ui.getCore().byId("idPn").setValue(selAlgo.PROFILE);
            sap.ui.getCore().byId("idPdesc").setValue(selAlgo.PRF_DESC);
            sap.ui.getCore().byId("idCretBy").setValue("");
            sap.ui.getCore().byId("idAuth").setValue("");
            if (selAlgo.METHOD === "MLR") {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("M");
            } else if (selAlgo.METHOD === "HGBT") {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("H");
            } else if (selAlgo.METHOD === "VARMA") {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("V");
            } else {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("N");
            }
            that._onAddppf.open();
          } else {
            MessageToast.show("Please Select one row to change");
          }
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
            that.oAlgoListModel.setData({
              results: oData.results,
            });
            that.alogoList.setModel(that.oAlgoListModel);
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },

      onSubmit: function (oEvent) {
        var table = sap.ui.getCore().byId("idTab");
      },
    });
  }
);
