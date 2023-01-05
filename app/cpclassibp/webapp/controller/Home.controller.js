sap.ui.define([
  "cpapp/cpclassibp/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/Dialog",
  "sap/m/Text",
  "sap/m/Button"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, Dialog, Text, Button) {
    "use strict";
    var that, oGModel;
    return BaseController.extend("cpapp.cpclassibp.controller.Home", {
      onInit: function () {
        that = this;
        // Declaring JSON Model and size limit
        that.oModel = new JSONModel();
        this.oModel.setSizeLimit(1000);
      },
      onAfterRendering: function () {
        that = this;
        oGModel = this.getModel("oGModel");
        sap.ui.core.BusyIndicator.show();

        this.getModel("BModel").read("/getClass ", {
          success: function (oData) {
            that.oModel.setData({
              results: oData.results,
            });
            that.byId("classList").setModel(that.oModel);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },
      onClassUpdate: function () {
        var oEntry = {
          CLASSDATA: [],
        },
          vRuleslist;
        var aClassData = that.byId("classList").getItems();
        for (var i = 0; i < aClassData.length; i++) {
          let vIbpCheck = '';
          if (aClassData[i].getCells()[4].getSelected() === true) {
            vIbpCheck = 'X';
          }
          else {

          }
          vRuleslist = {
            CLASS_NUM: aClassData[i].getCells()[0].getText(),
            IBPCHAR_CHK: vIbpCheck
          };
          oEntry.CLASSDATA.push(vRuleslist);
        }
        sap.ui.core.BusyIndicator.show();
        that.getModel("BModel").callFunction("/updateIBPClass", {
          method: "GET",
          urlParameters: {
            CLASSDATA: JSON.stringify(oEntry.CLASSDATA)
          },
          success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Updated Successfully");
            that.onAfterRendering();
            // that.onBack();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Update Failed");
            //  that.onBack();
          },
        });
      },
      /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
      handleSearch: function (oEvent) {
        var sQuery =
          oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          sId = oEvent.getParameter("id"),
          oFilters = [];
        // Check if search filter is to be applied
        sQuery = sQuery ? sQuery.trim() : "";
        // if (sId.includes("idSearch")) {
          if (sQuery !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                  new Filter("CLASS_DESC", FilterOperator.Contains, sQuery)
                ],
                and: false,
              })
            );
          }
          that.byId("classList").getBinding("items").filter(oFilters);
        }
      // }
    });
  });
