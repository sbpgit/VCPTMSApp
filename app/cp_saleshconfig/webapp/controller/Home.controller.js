
oCC1: null,
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
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          var thiz = this;
          that = this;
          that.oGModel = that.getOwnerComponent().getModel("oGModel");
          // Declaring JSON Models and size limits
          that.oListModel = new JSONModel();
          this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          this.variantModel = new JSONModel();
          this.oListModel.setSizeLimit(5000);
          that.locModel.setSizeLimit(1000);
          that.prodModel.setSizeLimit(1000);
          that.variantModel.setSizeLimit(5000);

          // Declaring value help dialogs
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
          if (!this._nameFragment) {
            this._nameFragment = sap.ui.xmlfragment(
              "cp.appf.cpsaleshconfig.view.NameVariant",
              this
            );
            this.getView().addDependent(this._nameFragment);
          }
          // if (!this._variantFragment) {
          //   this._variantFragment = sap.ui.xmlfragment(
          //     "cp.appf.cpsaleshconfig.view.ShowVariants",
          //     this
          //   );
          //   this.getView().addDependent(this._variantFragment);
          // }
          if (!this._popOver) {
            this._popOver = sap.ui.xmlfragment(
              "cp.appf.cpsaleshconfig.view.VariantNames",
              this
            );
            this.getView().addDependent(this._popOver);
          }

          //Variant Configuration
          //   var oVM = this.getView().byId("Variants");
          // var itemName = oVM.data("itemName"); // get item name
          // oVM.setModel(new JSONModel()); // set model
          // // this.fixVariant(oVM); // fix variant 
          // var data = {
          // 	SelectedModuleMain: "",
          // 	SelectedSubModuleMain: ""
          // };
          // this.setFilterVariant(itemName, "*standard*", null, data, false, function (oCC) { // create item
          // 	thiz.oCC1 = oCC;
          // 	thiz.setVariantList(oCC, oVM); // set variant list
          // });
          //Variant Configuration

        },

        /**
         * Called after the view has been rendered.
         * Calls the getdata[function] to get Data.
         */
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

        /**
         * Getting Data Initially and binding to elements.
         */
        getData: function () {
          var aData = [];

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
          this.getModel("BModel").read("/getVariant", {
            success: function (oData) {
              that.oGModel.setProperty("/variantDetails", oData.results);
              for (var i = 0; i < oData.results.length; i++) {
                aData.push({
                  "VARIANTNAME": oData.results[i].VARIANTNAME,
                  "APPLICATION_NAME": oData.results[i].APPLICATION_NAME
                });
              }
              var uniqueName = aData.filter((obj, pos, arr) => {
                return (
                  arr.map((mapObj) => mapObj.VARIANTNAME).indexOf(obj.VARIANTNAME) == pos
                );
              });
              that.variantModel.setData({ items: uniqueName });
              that.byId("Variants").setModel(that.variantModel);
              var IDlength = oData.results.length
              if (IDlength === 0) {
                that.oGModel.setProperty("/Id", 0);
              }
              else {
                that.oGModel.setProperty("/Id", oData.results[IDlength - 1].VARIANTID);
              }
            },
            error: function (oData, error) {
              MessageToast.show("error while loading variant details");
            },
          });

          this.getModel("BModel").read("/getVariantHeader", {
            success: function (oData) {
              that.oGModel.setProperty("/variantHeader", oData.results);
            },
            error: function (oData, error) {
              MessageToast.show("error while loading variant details");
            },
          });

        },

        /**
         * This function is called when click on Input box Value Help.
         * Dialogs will be open based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
          var sId = oEvent.getParameter("id");
          // Loc Dialog
          if (sId.includes("loc")) {
            that._valueHelpDialogLoc.open();
            // Prod Dialog
          } else if (sId.includes("prod")) {
            if (that.byId("idloc").getValue() !== "") {
              that._valueHelpDialogProd.open();
            } else {
              MessageToast.show("Select Location");
            }
          }
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         * Dialogs will be closed based on sId
         */
        handleClose: function (oEvent) {
          var sId = oEvent.getParameter("id");
          // Loc Dialog
          if (sId.includes("loc")) {
            that._oCore
              .byId(this._valueHelpDialogLoc.getId() + "-searchField")
              .setValue("");
            if (that.oLocList.getBinding("items")) {
              that.oLocList.getBinding("items").filter([]);
            }
            // Prod Dialog
          } else if (sId.includes("prod")) {
            that._oCore
              .byId(this._valueHelpDialogProd.getId() + "-searchField")
              .setValue("");
            if (that.oProdList.getBinding("items")) {
              that.oProdList.getBinding("items").filter([]);
            }
          }

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
          // Location
          if (sId.includes("loc")) {
            if (sQuery !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                    new Filter("LOCATION_DESC", FilterOperator.Contains, sQuery),
                  ],
                  and: false,
                })
              );
            }
            that.oLocList.getBinding("items").filter(oFilters);
            // Product
          } else if (sId.includes("prod")) {
            if (sQuery !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                    new Filter("PROD_DESC", FilterOperator.Contains, sQuery),
                  ],
                  and: false,
                })
              );
            }
            that.oProdList.getBinding("items").filter(oFilters);
          }
          else if (sId.includes("var")) {
            if (sQuery !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("VARIANTNAME", FilterOperator.Contains, sQuery),
                    new Filter("APPLICATION_NAME", FilterOperator.Contains, sQuery),
                  ],
                  and: false,
                })
              );
            }
            sap.ui.getCore().byId("varSlctList").getBinding("items").filter(oFilters);
          }
        },

        /**
         * This function is called when selection of values in dialogs.
         * after selecting value, based on selection get data of other filters.
         * @param {object} oEvent -the event information.
         */
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
            this._valueHelpDialogProd
              .getAggregation("_dialog")
              .getContent()[1]
              .removeSelections();
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

        /**
         * This function is called when click on Go button.
         * @param {object} oEvent -the event information.
         */
        onGetData: function (oEvent) {
          var fromDate = new Date(that.byId("idDate").getValue()),
            month,
            date;

          // Checking for Loc and Prod are not initial
          if (
            that.byId("idloc").getValue() !== "" &&
            that.oProdList.getSelectedItems().length !== 0
          ) {
            var aSelectedItem = that.oProdList.getSelectedItems();
            var oFilters = [];
            // Conversion of date format
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
            // Calling service based on selected filters
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
            MessageToast.show("Please fill all required inputs");
          }
        },

        /**
         * Called when it routes to a page containing the item details.
         * @param {object} oEvent -the event information.
         */
        onhandlePress: function (oEvent) {
          that.oGModel = that.getModel("oGModel");
          // Getting the selected item from table
          var oTableItem = that
            .byId("idTab")
            .getSelectedItem()
            .getBindingContext()
            .getObject();
          // Setting the properties of selected item
          that.oGModel.setProperty("/selItem", oTableItem);
          that.oGModel.setProperty("/sSalOrd", oTableItem.SALES_DOC);
          that.oGModel.setProperty("/sSalOrdItem", oTableItem.SALESDOC_ITEM);
          that.oGModel.setProperty("/sPrdid", oTableItem.PRODUCT_ID);
          that.oGModel.setProperty("/sLocid", oTableItem.LOCATION_ID);
          that.oGModel.setProperty(
            "/date",
            oEvent.getSource().getSelectedItem().getCells()[2].getText()
          );
          // Navigating to detail page
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("Detail", {}, true);
        },

        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        onTableSearch: function (oEvent) {
          var sQuery =
            oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];

          if (sQuery !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("SALES_DOC", FilterOperator.Contains, sQuery),
                  new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                  new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                ],
                and: false,
              })
            );
          }
          that.oList.getBinding("items").filter(oFilters);
        },
        onNavPress: function () {
          if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            // generate the Hash to display 
            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
              target: {
                semanticObject: "vcpdocdisplay",
                action: "Display"
              }
            })) || "";
            //Generate a  URL for the second application
            var url = window.location.href.split('#')[0] + hash;
            //Navigate to second app
            sap.m.URLHelper.redirect(url, true);
          }
        },

        //Variant Code//
        onSaveAs: function () {
          // this._nameFragment.open();
        },
        onClose: function () {
          // sap.ui.getCore().byId("idInput").setValue("");
          // that.byId("idloc").setValue("");
          // that.byId("prodInput").setTokens([]);
          this._nameFragment.close();
        },
        onCreate: function (oEvent) {
          var oEntry = { RTRCHAR: [] };
          var array = [];
          var details = {};
          var sLocation = that.byId("idloc").getValue();
          var Field1 = that.byId("idloc").getParent().getItems()[0].getText();
          var sProduct = that.byId("prodInput").getTokens();
          var Field2 = that.byId("prodInput").getParent().getItems()[0].getText();
          var varName = oEvent.getParameters().name;
          var sScope = document.getElementById("container-cp.appf.cpsaleshconfig---Home--Variants-share-CB");
          if (sScope.checked) {
            var Scope = "Public";
          }
          else {
            var Scope = "Private";
          }
          var sDefault = document.getElementById("container-cp.appf.cpsaleshconfig---Home--Variants-default-CB");
          if (sDefault.checked) {
            var defaultChecked = "Y";
          }
          else {
            var defaultChecked = "N";
          }
          // for (var i = 0; i < sLocation.length; i++) {
          details = {
            Field: Field1,
            FieldCenter: (1).toString(),
            Value: sLocation,
            Scope: Scope,
            Default: defaultChecked
          }
          array.push(details);
          // }

          for (var k = 0; k < sProduct.length; k++) {
            details = {
              Field: Field2,
              FieldCenter: (k + 1).toString(),
              Value: sProduct[k].getText(),
              Scope: Scope,
              Default: defaultChecked
            }
            array.push(details);
          }

          for (var j = 0; j < array.length; j++) {
            var ID = that.oGModel.getProperty("/Id");
            if (ID === undefined) {
              ID = 0;
            }
            ID = ID + 1;
            array[j].ID = ID;
            array[j].IDNAME = varName;
            array[j].App_Name = "Sales History Configuration"
          }
          // oEntry.RTRCHAR.push(array);

          that.getModel("BModel").callFunction("/createVariant", {
            method: "GET",
            urlParameters: {
              Flag: "X",
              VARDATA: JSON.stringify(array)
            },
            success: function (oData) {
              MessageToast.show(oData.createVariant);
              that.getData();
              that.onClose();
            },
            error: function (error) {
              MessageToast.show("Failed to create variant");
            },
          });
        },
        // onShowPress: function () {
        //   that._variantFragment.open();
        // },
        // handleCloseVariant: function () {
        //   that._variantFragment.close();
        // },
        onTitlePress: function (oEvent) {
          var oData = {};
          var newData = [];
          var oButton = oEvent.getSource();
          var variantName = oEvent.getSource().getTitle();
          var data = that.oGModel.getProperty("/variantDetails");
          for (var i = 0; i < data.length; i++) {
            if (variantName === data[i].VARIANTNAME) {
              oData.VARIANTID = data[i].VARIANTID;
              oData.VARIANTNAME = data[i].VARIANTNAME;
              oData.USER = data[i].USER;
              oData.APPLICATION_NAME = data[i].APPLICATION_NAME;
              oData.FIELD = data[i].FIELD;
              oData.FIELDCENTER = data[i].FIELDCENTER;
              oData.VALUE = data[i].VALUE;
              oData.SCOPE = data[i].SCOPE;
              newData.push(oData);
              oData = {};
            }
          }
          var newJSONMODEL = new JSONModel();
          newJSONMODEL.setData({ items1: newData });
          sap.ui.getCore().byId("varNameList").setModel(newJSONMODEL);
          that._popOver.openBy(oButton);

        },
        handleSelectClose: function () {
          that._popOver.close();
        },
        handleSelectPress: function (oEvent) {
          var oLoc, oTokens = {}, finalToken = [];
          var oTableItems = that.oGModel.getProperty("/variantDetails");
          var selectedApp = oEvent.getSource().getSelectionKey();
          // for (var i = 0; i < oTableItems.length; i++) {
          //   if (oTableItems[i].getCells()[4].getText().includes("Loc")) {
          //     oLoc = oTableItems[i].getCells()[6].getText();
          //   }
          //   else if (oTableItems[i].getCells()[4].getText().includes("Prod")) {

          //     var oItemTemplate = new sap.m.Token({
          //       key: i,
          //       text: oTableItems[i].getCells()[6].getText()
          //   });
          //   finalToken.push(oItemTemplate);
          //   oItemTemplate={};
          //   }
          // }
          for (var i = 0; i < oTableItems.length; i++) {
            if (selectedApp === oTableItems[i].VARIANTNAME) {
              if (oTableItems[i].FIELD.includes("Loc")) {
                oLoc = oTableItems[i].VALUE;
              }
              else if (oTableItems[i].FIELD.includes("Prod")) {

                var oItemTemplate = new sap.m.Token({
                  key: i,
                  text: oTableItems[i].VALUE
                });
                finalToken.push(oItemTemplate);
                oItemTemplate = {};
              }
            }
          }
          that.byId("idloc").setValue(oLoc);
          this.getModel("BModel").read("/getLocProdDet", {
            filters: [
              new Filter(
                "LOCATION_ID",
                FilterOperator.EQ,
                oLoc
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
          // that._popOver.close();
          // that._variantFragment.close();

          that.byId("prodInput").setTokens(finalToken);
          // that.onGetData();

          // }
        },

        onManage: function (oEvent) {
          var details = {};
          var array = []
          var deletedItems = oEvent.getParameters().deleted;
          var totalHeaderItems = that.oGModel.getProperty("/variantHeader");
          var totalVariantItems = that.oGModel.getProperty("/variantDetails");
          for (var i = 0; i < deletedItems.length; i++) {
            for (var j = 0; j < totalVariantItems.length; j++) {
              if (deletedItems[i] === totalVariantItems[j].VARIANTNAME) {
                details = {
                  ID: totalVariantItems[j].VARIANTID,
                  NAME: totalVariantItems[j].VARIANTNAME
                }
                array.push(details);
                details={};
              }
            }
          }
          var uniqueName = array.filter((obj, pos, arr) => {
            return (
              arr.map((mapObj) => mapObj.ID).indexOf(obj.ID) == pos
            );
          });
          that.getModel("BModel").callFunction("/createVariant", {
            method: "GET",
            urlParameters: {
              Flag: "D",
              VARDATA: JSON.stringify(uniqueName)
            },
            success: function (oData) {
              MessageToast.show(oData.createVariant);
              that.getData();
            },
            error: function (error) {
              MessageToast.show("Failed to create variant");
            },
          });

        }

      });
    });
