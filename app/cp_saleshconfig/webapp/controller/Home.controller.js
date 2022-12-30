
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
      "sap/m/Dialog",
      "sap/m/library",
      "sap/m/Text",
      "sap/m/Button"
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
      Fragment,Dialog,mobileLibrary,Text, Button
    ) {
      "use strict";
      var that, oGModel;
      var DialogType = mobileLibrary.DialogType;
      var ButtonType = mobileLibrary.ButtonType;

      return BaseController.extend("cp.appf.cpsaleshconfig.controller.Home", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          var thiz = this;
          that = this;
          that.deletedArray = [];
          that.oGModel = that.getOwnerComponent().getModel("oGModel");
          // Declaring JSON Models and size limits
          that.oListModel = new JSONModel();
          this.locModel = new JSONModel();
          this.prodModel = new JSONModel();
          this.variantModel = new JSONModel();
          that.variantHeaderModel = new JSONModel();
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
          if (!this._popOver) {
            this._popOver = sap.ui.xmlfragment(
              "cp.appf.cpsaleshconfig.view.PopOver",
              this
            );
            this.getView().addDependent(this._popOver);
          }
          if (!this._manageVariant) {
            this._manageVariant = sap.ui.xmlfragment(
              "cp.appf.cpsaleshconfig.view.VariantNames",
              this
            );
            this.getView().addDependent(this._manageVariant);
          }


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
          var bData = [];
          var details = {};
          var defaultDetails = [];
          this.getModel("BModel").callFunction("/getUserInfo", {
            success: function (user) {
              that.oGModel.setProperty("/UserId", user.getUserInfo.toUpperCase());

            },
            error: function (e) {
              MessageToast.show("Failed to get User Details");
            }
          });

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
              var IDlength = oData.results.length
              if (IDlength === 0) {
                that.oGModel.setProperty("/Id", 0);
                that.oGModel.setProperty("/variantDetails", "");
              }
              else {
                that.oGModel.setProperty("/Id", oData.results[IDlength - 1].VARIANTID);
                that.oGModel.setProperty("/variantDetails", oData.results);
                for (var i = 0; i < oData.results.length; i++) {
                  if (that.oGModel.getProperty("/UserId") === oData.results[i].USER.toUpperCase()) {
                    aData.push({
                      "VARIANTNAME": oData.results[i].VARIANTNAME,
                      "VARIANTID": oData.results[i].VARIANTID,
                      "DEFAULT": oData.results[i].DEFAULT,
                      "USER": that.oGModel.getProperty("/UserId")
                    });
                  }
                }
                var uniqueName = aData.filter((obj, pos, arr) => {
                  return (
                    arr.map((mapObj) => mapObj.VARIANTNAME).indexOf(obj.VARIANTNAME) == pos
                  );
                });
                uniqueName.unshift({
                  "VARIANTNAME": "Standard",
                  "VARINATID": "0",
                  "DEFAULT": "N",
                })
                that.variantModel.setData({ items1: uniqueName });
                sap.ui.getCore().byId("idList").setModel(that.variantModel);

                for (var k = 0; k < uniqueName.length; k++) {
                  if (uniqueName[k].DEFAULT === "Y") {
                    var Default = uniqueName[k].VARIANTNAME;
                    details = {
                      "VARIANTNAME": uniqueName[k].VARIANTNAME,
                      "VARIANTID": uniqueName[k].VARIANTID,
                      "USER": uniqueName[k].USER,
                      "DEFAULT": "N"
                    };
                    defaultDetails.push(details);
                    details = {};
                  }
                }

                that.oGModel.setProperty("/fromFunction", "X");
                if (Default) {
                  that.oGModel.setProperty("/defaultDetails", defaultDetails);
                  // that.byId("idVariantName").setText(Default);
                  that.handleSelectPress(Default);
                }
                else {
                  that.oGModel.setProperty("/defaultDetails", "");
                  Default = "Standard";
                  that.handleSelectPress(Default);
                }



              }
            },
            error: function (oData, error) {
              MessageToast.show("error while loading variant details");
            },
          });

          this.getModel("BModel").read("/getVariantHeader", {
            success: function (oData) {

              for (var i = 0; i < oData.results.length; i++) {
                if (that.oGModel.getProperty("/UserId").toUpperCase() === oData.results[i].USER.toUpperCase()) {
                  bData.push(oData.results[i]);
                }
              }
              that.variantHeaderModel.setData({ itemsHeader: bData });
              sap.ui.getCore().byId("varNameList").setModel(that.variantHeaderModel);
              that.oGModel.setProperty("/variantHeader", bData);
            },
            error: function (oData, error) {
              MessageToast.show("error while loading variant details");
            },
          });

        },
        onDropDownPress: function (oEvent) {

          if (oEvent.getSource().getPressed()) {
            this._popOver.openBy(oEvent.getSource());
          }
          else {
            this._popOver.close();
          }
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
        onVariantSave: function () {
          that.byId("idDropDown").setPressed(false);
          that._popOver.close();
          that._nameFragment.open();
          sap.ui.getCore().byId("idInput").setValue();
        },
        onSaveClose: function () {
          // sap.ui.getCore().byId("idInput").setValue("");
          // that.byId("idloc").setValue("");
          // that.byId("prodInput").setTokens([]);
          that._nameFragment.close();
        },
        onCreate: function (oEvent) {
          that.byId("idDropDown").setPressed(false);
          var oEntry = { RTRCHAR: [] };
          var array = [];
          var details = {};
          var sLocation = that.byId("idloc").getValue();
          var Field1 = that.byId("idloc").getParent().getItems()[0].getText();
          var sProduct = that.byId("prodInput").getTokens();
          var Field2 = that.byId("prodInput").getParent().getItems()[0].getText();
          // var varName = oEvent.getParameters().name;
          var varName = sap.ui.getCore().byId("idInput").getValue();
          // var sScope = document.getElementById("container-cp.appf.cpsaleshconfig---Home--Variants-share-CB");
          var sScope = sap.ui.getCore().byId("_IDGenCheckBox2").getSelected();
          if (sScope) {
            var Scope = "Public";
          }
          else {
            var Scope = "Private";
          }
          //   var sDefault = document.getElementById("container-cp.appf.cpsaleshconfig---Home--Variants-default-CB");
          var sDefault = sap.ui.getCore().byId("_IDGenCheckBox1").getSelected();
          if (sDefault && that.oGModel.getProperty("/defaultDetails").length > 0) {
            var defaultChecked = "Y";
            that.getModel("BModel").callFunction("/updateVariant", {
              method: "GET",
              urlParameters: {
                VARDATA: JSON.stringify(that.oGModel.getProperty("/defaultDetails"))
              },
              success: function (oData) {
                MessageToast.show(oData);
              },
              error: function (error) {
                MessageToast.show("Failed to create variant");
              },
            });

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
              sap.ui.getCore().byId("_IDGenCheckBox2").setSelected(false);
              sap.ui.getCore().byId("_IDGenCheckBox1").setSelected(false);
              sap.ui.getCore().byId("idInput").setValue();
              that._nameFragment.close();
              that.onAfterRendering();


            },
            error: function (error) {

              MessageToast.show("Failed to create variant");
            },
          });

        },

        handleSelectPress: function (oEvent) {
          var oLoc, oTokens = {}, finalToken = [];
          var oTableItems = that.oGModel.getProperty("/variantDetails");
          // var selectedApp = oEvent;
          if (that.oGModel.getProperty("/fromFunction") === "X") {
            that.oGModel.setProperty("/fromFunction", "");
            var selectedApp = oEvent;
            that.byId("idVariantName").setText(selectedApp);
            that.oGModel.setProperty("/variantName", selectedApp);
          }
          else {
            var selectedApp = oEvent.getSource().getTitle();
            that.byId("idVariantName").setText(selectedApp);
            that.oGModel.setProperty("/variantName", selectedApp);
          }
          if (selectedApp !== "Standard") {
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
                that.oProdList.removeSelections();
                // that.oProdList.removeAllAssociation();
                for (var i = 0; i < finalToken.length; i++) {
                  for (var k = 0; k < that.oProdList.getItems().length; k++) {
                    if (that.oProdList.getItems()[k].getTitle() === finalToken[i].getText()) {
                      that.oProdList.getItems()[k].setSelected(true);
                    }
                  }
                }
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
            that._popOver.close();
            // that._variantFragment.close();

            that.byId("prodInput").setTokens(finalToken);
            that.byId("idDropDown").setPressed(false);
            // that.onGetData();

            // }
          }
          else {
            //do nothing
            that.byId("idDropDown").setPressed(false);
            that.byId("prodInput").removeAllTokens();
            that.oProdList.removeSelections();
            that.byId("idloc").setValue("");
            that._popOver.close();
          }
        },

        onManageOpen: function (oEvent) {
          that.byId("idDropDown").setPressed(false);
          that._manageVariant.open();
        },
        handleManageClose: function () {
          that._manageVariant.close();
        },
        onViewDelete: function (oEvent) {
          var details = {};
          var array = []
          var deletedItem = parseInt(oEvent.getParameters().listItem.getCells()[4].getText());
          var deletedItemName = oEvent.getParameters().listItem.getCells()[0].getText();
          var selectedItem = oEvent.getParameters().listItem;
          var source = oEvent.getSource();
          // that.deletedArray.push(deletedItem);
         
          details = {
            ID: deletedItem,
            NAME: deletedItemName
          }
          array.push(details);
          details = {};
          if (!this.oApproveDialog) {
            this.oApproveDialog = new Dialog({
              type: DialogType.Message,
              title: deletedItemName,
              content: new Text({ text: "Do you want to delete this View?" }),
              beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                  that.getModel("BModel").callFunction("/createVariant", {
                    method: "GET",
                    urlParameters: {
                      Flag: "D",
                      VARDATA: JSON.stringify(array)
                    },
                    success: function (oData) {
                      MessageToast.show(oData.createVariant);    
                      source.removeItem(selectedItem);
                      that.oApproveDialog.close();
                      that.onAfterRendering();
                    },
                    error: function (error) {
                      MessageToast.show("Failed to create variant");
                    },
                  });
                }.bind(this)
              }),
              endButton: new Button({
                text: "Cancel",
                press: function () {
                  this.oApproveDialog.close();
                }.bind(this)
              })
            });
          }
          this.oApproveDialog.open();


        },
        onManage: function () {
          // var table= document.getElementById("container-cp.appf.cpsaleshconfig---Home--Variants-managementTable-tblBody").rows[0].cells[3].innerText;


          var deletedItems = that.deletedArray;
          var totalHeaderItems = that.oGModel.getProperty("/variantHeader");
          // that.handleManageClose();

        }

      });
    });
