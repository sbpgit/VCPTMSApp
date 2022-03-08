sap.ui.define(
  [
    "cp/appf/cpsaleshconfig/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpsaleshconfig.controller.Home", {
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
        this.locModel = new JSONModel();
        this.prodModel = new JSONModel();
        this.oListModel.setSizeLimit(5000);
        that.locModel.setSizeLimit(1000);
        that.prodModel.setSizeLimit(1000);

        this._oCore = sap.ui.getCore();
        if (!this._valueHelpDialogLoc) {
          this._valueHelpDialogLoc = sap.ui.xmlfragment(
            "cp.appf.cpsaleshconfig.view.LocDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogLoc);
        }
        if (!this._valueHelpDialogProd) {
          this._valueHelpDialogProd = sap.ui.xmlfragment(
            "cp.appf.cpsaleshconfig.view.ProdDialog",
            this
          );
          this.getView().addDependent(this._valueHelpDialogProd);
        }
      },
      onAfterRendering: function () {
        that = this;
        that.oList = this.byId("idTab");
        this.oProd = this.byId("prodInput");
        that._valueHelpDialogLoc.setTitleAlignment("Center");
        that._valueHelpDialogProd.setTitleAlignment("Center");

        this.oProdList = this._oCore.byId(
          this._valueHelpDialogProd.getId() + "-list"
        );
        this.oLocList = this._oCore.byId(
          this._valueHelpDialogLoc.getId() + "-list"
        );

        that.oList.removeSelections();
        if (that.oList.getBinding("items")) {
          that.oList.getBinding("items").filter([]);
        }
        // Calling function
        this.getData();
      },
      getData: function () {
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

      handleValueHelp: function (oEvent) {
        var sId = oEvent.getParameter("id");
        if (sId.includes("loc")) {
          that._valueHelpDialogLoc.open();
        } else if (sId.includes("prod")) {
            if(that.byId("idloc").getValue() !== ""){
          that._valueHelpDialogProd.open();
            } else {
                MessageToast.show("Select Location");
            }
        }
      },
      handleClose: function (oEvent) {
        var sId = oEvent.getParameter("id");
        if (sId.includes("loc")) {
          that._oCore
            .byId(this._valueHelpDialogLoc.getId() + "-searchField")
            .setValue("");
          if (that.oLocList.getBinding("items")) {
            that.oLocList.getBinding("items").filter([]);
          }
        } else if (sId.includes("prod")) {
          that._oCore
            .byId(this._valueHelpDialogProd.getId() + "-searchField")
            .setValue("");
          if (that.oProdList.getBinding("items")) {
            that.oProdList.getBinding("items").filter([]);
          }
        }
      },
      handleSearch: function (oEvent) {
        var query =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          sId = oEvent.getParameter("id"),
          oFilters = [];
        // Check if search filter is to be applied
        query = query ? query.trim() : "";
        // Location
        if (sId.includes("loc")) {
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("LOCATION_ID", FilterOperator.Contains, query),
                  new Filter("LOCATION_DESC", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oLocList.getBinding("items").filter(oFilters);
          // Product
        } else if (sId.includes("prod")) {
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                  new Filter("PROD_DESC", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oProdList.getBinding("items").filter(oFilters);
        }
      },

      handleSelection: function (oEvent) {
        var sId = oEvent.getParameter("id"),
          oItem = oEvent.getParameter("selectedItems"),
          aSelectedItems,
          aODdata = [];
        //Location list
        if (sId.includes("Loc")) {
          this.oLoc = that.byId("idloc");
          aSelectedItems = oEvent.getParameter("selectedItems");
          that.oLoc.setValue(aSelectedItems[0].getTitle());
          that.oProd.removeAllTokens();
          this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
          this.getModel("BModel").read("/getLocProdDet", {
            filters: [
              new Filter(
                "LOCATION_ID",
                FilterOperator.EQ,
                aSelectedItems[0].getTitle()
              ),
            ],
            success: function (oData) {
              that.prodModel.setData(oData);
              that.oProdList.setModel(that.prodModel);
            },
            error: function (oData, error) {
              MessageToast.show("error");
            },
          });

          // Prod list
        } else if (sId.includes("prod")) {
          this.oProd = that.byId("prodInput");
          aSelectedItems = oEvent.getParameter("selectedItems");
        //   that.oProd.setValue(aSelectedItems[0].getTitle());
        if (aSelectedItems && aSelectedItems.length > 0) {
            that.oProd.removeAllTokens();
            aSelectedItems.forEach(function (oItem) {
              that.oProd.addToken(
                new sap.m.Token({
                  key: oItem.getTitle(),
                  text: oItem.getTitle(),
                })
              );
            });
          } else {
              that.oProd.removeAllTokens();
          }
        }
        that.handleClose(oEvent);
      },

      onGetData: function (oEvent) {
        var fromDate = new Date(that.byId("idDate").getValue()),
          month,
          date;

        if (that.oLoc.getValue() && that.oProdList.getSelectedItems().length !== 0 ) {
          var aSelectedItem = that.oProdList.getSelectedItems();
          var oFilters = [];
          if (that.byId("idDate").getValue() !== "") {
            month = fromDate.getMonth() + 1;

            if (month < 10) {
              month = "0" + month;
            } else {
              month = month;
            }

            if (fromDate.getDate < 10) {
              date = "0" + fromDate.getDate();
            } else {
              date = fromDate.getDate();
            }

            var selDate = fromDate.getFullYear() + "-" + month + "-" + date;

            var sFilter = new sap.ui.model.Filter({
              path: "DOC_CREATEDDATE",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: selDate,
            });
            oFilters.push(sFilter);
          }

          var sFilter = new sap.ui.model.Filter({
            path: "LOCATION_ID",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: that.oLoc.getValue(),
          });
          oFilters.push(sFilter);

          for (var i = 0; i < aSelectedItem.length; i++) {
            if (aSelectedItem[i].getTitle() !== "All") {
              sFilter = new sap.ui.model.Filter({
                path: "PRODUCT_ID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: aSelectedItem[i].getTitle(),
              });
              oFilters.push(sFilter);
            }
          }

          sap.ui.core.BusyIndicator.show();
          this.getModel("BModel").read("/getSalesh", {
            filters: oFilters,
            success: function (oData) {
              that.oListModel.setData({
                results: oData.results,
              });
              that.oList.setModel(that.oListModel);

              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oRes) {
              MessageToast.show("error");
              sap.ui.core.BusyIndicator.hide();
            },
          });
        } else {
          essageToast.show("Please fill all required fields");
        }
      },

      onhandlePress: function (oEvent) {
        that.oGModel = that.getModel("oGModel");
        var sTableItem = that.byId("idTab").getSelectedItem().getBindingContext().getObject();
        that.oGModel.setProperty("/selItem", sTableItem);
        that.oGModel.setProperty("/sSalOrd", sTableItem.SALES_DOC);
        that.oGModel.setProperty("/sSalOrdItem", sTableItem.SALESDOC_ITEM);
        that.oGModel.setProperty("/sPrdid", sTableItem.PRODUCT_ID);
        that.oGModel.setProperty("/sLocid", sTableItem.LOCATION_ID);
        that.oGModel.setProperty("/date",oEvent.getSource().getSelectedItem().getCells()[2].getText());

        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Detail", {}, true);
      },

      onTableSearch: function (oEvent) {
        var query =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
          oFilters = [];

        if (query !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("SALES_DOC", FilterOperator.Contains, query),
                new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                new Filter("LOCATION_ID", FilterOperator.Contains, query),
              ],
              and: false,
            })
          );
        }
        that.oList.getBinding("items").filter(oFilters);
      },
    });
  }
);
