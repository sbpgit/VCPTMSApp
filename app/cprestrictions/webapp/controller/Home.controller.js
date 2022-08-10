sap.ui.define(
        [
          "sap/ui/core/mvc/Controller",
          "cpapp/cprestrictions/controller/BaseController",
          "sap/ui/model/json/JSONModel",
          "sap/ui/model/Filter",
          "sap/ui/model/FilterOperator",
          "sap/m/MessageToast",
          "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,BaseController,JSONModel,Filter,FilterOperator,MessageToast,MessageBox) {
        "use strict";
        var oGModel, that;

        return BaseController.extend("cpapp.cprestrictions.controller.Home", {
            onInit: function () {
                that = this;
                // Declaring JSON Models and size limits
            that.TableModel = new JSONModel();
            that.locModel = new JSONModel();
            that.TableModel.setSizeLimit(1000);
            that.locModel.setSizeLimit(1000);
            // Declaring fragments
                this._oCore = sap.ui.getCore();

                if (!this._valueHelpDialogLoc) {
                this._valueHelpDialogLoc = sap.ui.xmlfragment(
                    "cpapp.cprestrictions.view.LocDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogLoc);
                }

                if (!this._valueHelpDialogLine) {
                    this._valueHelpDialogLine = sap.ui.xmlfragment(
                        "cpapp.cprestrictions.view.LineDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLine);
                    }

            },

            /**
       * Called after the view has been rendered.
       */
      onAfterRendering: function () {
        that.oList = this.byId("idRestList");
        that._valueHelpDialogLoc.setTitleAlignment("Center");

        this.oLocList = this._oCore.byId(
            this._valueHelpDialogLoc.getId() + "-list"
          );
          this.oLineList = this._oCore.byId(
            this._valueHelpDialogLine.getId() + "-list"
          );

          that.getData();
            // Calling service to get the Location data
        sap.ui.core.BusyIndicator.show();
        this.getModel("BModel").read("/getLocation", {
          success: function (oData) {
            that.locModel.setData(oData);
            that.oLocList.setModel(that.locModel);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function (oData, error) {
            MessageToast.show("error");
          },
        });


      },

      getData:function(){


        // Calling service to get the Location data
        sap.ui.core.BusyIndicator.show();
        this.getModel("BModel").read("/genRtrHeader", {
          success: function (oData) {
            that.TableModel.setData(oData);
            that.oList.setModel(that.TableModel);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function (oData, error) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("error");
          },
        });



      },

      /**
       * Called when it routes to a page containing the Details.
       * @param {object} oEvent -the event information.
       */
      onhandlePress: function (oEvent) {
        var oSelRow = this.byId("idRestList").getSelectedItems();
        that.oGModel = that.getModel("oGModel");

        var oSelItem = oSelRow[0].getBindingContext().getProperty();
        // Getting the selected data
        that.oGModel.setProperty("/sRest", oSelItem.RESTRICTION);

        
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Detail", {}, true);
      },






        });
    });
