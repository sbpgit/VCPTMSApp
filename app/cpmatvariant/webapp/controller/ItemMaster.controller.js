sap.ui.define(
    [
        "cpapp/cpmatvariant/controller/BaseController",
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

        return BaseController.extend("cpapp.cpmatvariant.controller.ItemMaster", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                this.locModel = new JSONModel();
                this.prodModel = new JSONModel();

                // Declaring JSON Models and size limit
                that.oCharModel = new JSONModel();
                that.charnameModel = new JSONModel();
                that.charvalueModel = new JSONModel();

                that.locModel.setSizeLimit(1000);
                that.prodModel.setSizeLimit(1000);
                this.oModel.setSizeLimit(1000);
                this.bus = sap.ui.getCore().getEventBus();
                this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
                this.bus.publish("nav", "toBeginPage", {
                    viewName: this.getView().getProperty("viewName"),
                });
                // Declaring value help dialogs
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }

                if (!this._valueHelpDialogDescUpdate) {
                    this._valueHelpDialogDescUpdate = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.UniqueDescUpdate",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogDescUpdate);
                }

                if (!this._addCharacteristic) {
                    this._addCharacteristic = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.AddCharacterstics",
                        this
                    );
                    this.getView().addDependent(this._addCharacteristic);
                }

                if (!this._createCharacterstics) {
                    this._createCharacterstics = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.CreateChar",
                        this
                    );
                    this.getView().addDependent(this._createCharacterstics);
                }

                if (!this._copyCharacterstics) {
                    this._copyCharacterstics = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.CopyChar",
                        this
                    );
                    this.getView().addDependent(this._copyCharacterstics);
                }
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
                that.oLoc = this.byId("idloc");
                this.oProd = this.byId("prodInput");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogProd.setTitleAlignment("Center");

                that.oTableData = [];
                sap.ui.getCore().byId("idUniqDesc1").setValue("");
                // var oCharTable = sap.ui.getCore().byId("idCharItem");
                that.ListModel = new JSONModel();

                that.ListModel.setData({
                    results: that.oTableData
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
                oGModel = this.getModel("oGModel");
                oGModel.setProperty("/New", "");
                sap.ui.core.BusyIndicator.show();

                this.getModel("BModel").read("/getLocation", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.locModel.setData(oData);
                        that.oLocList.setModel(that.locModel);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });


            },

            /**
             * This function is called when click on Input box Value Help.
             * Dialogs will be open based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                // oGModel = this.getModel("oGModel");
                var sId = oEvent.getParameter("id");
                oGModel.setProperty("/mainSID", sId);
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
            },

            /**
             * This function is called when selection of values in dialogs.
             * after selecting value, based on selection get data of other filters.
             * @param {object} oEvent -the event information.
             */
            handleSelection: function (oEvent) {
                // oGModel = this.getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                    mainSID = oGModel.getProperty("/mainSID"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                //Location list
                if (sId.includes("Loc")) {
                    this.oLoc = that.byId("idloc");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    if(mainSID === "__xmlview1--idloc"){
                    that.oLoc.setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "locId1"){
                        sap.ui.getCore().byId("locId1").setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "locIdCC"){
                        sap.ui.getCore().byId("locIdCC").setValue(aSelectedItems[0].getTitle());
                    }
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
                    if(mainSID === "__xmlview1--prodInput"){
                    that.oProd.setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "prodId1"){
                        sap.ui.getCore().byId("prodId1").setValue(aSelectedItems[0].getTitle());
                    }
                    else if (mainSID === "prodIdCC"){
                        sap.ui.getCore().byId("prodIdCC").setValue(aSelectedItems[0].getTitle());
                    } 

                }
                that.handleClose(oEvent);
            },

            /**
             * This function is called when click on Go button.
             * @param {object} oEvent -the event information.
             */
            onGetData: function (oEvent) {
                var oSloc = that.oLoc.getValue(),
                    oSprod = that.oProd.getValue(),
                    oSUniq = that.byId("idUnique").getSelectedKey();

                var oFilters = [];
                // getting the filters
                oFilters.push(
                    new Filter({
                        filters: [
                            new Filter("LOCATION_ID", FilterOperator.EQ, oSloc),
                            new Filter("PRODUCT_ID", FilterOperator.EQ, oSprod),
                        ],
                        and: true,
                    })
                );

                if (oSUniq !== "A") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("UID_TYPE", FilterOperator.EQ, oSUniq)
                            ],
                            and: true,
                        })
                    );
                }

                sap.ui.core.BusyIndicator.show();
                this.getModel("BModel").read("/getUniqueHeader", {
                    filters: [oFilters],
                    // filters: [
                    //     new Filter("LOCATION_ID", FilterOperator.EQ, oSloc),
                    //     new Filter("PRODUCT_ID", FilterOperator.EQ, oSprod),
                    //   ],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();

                        if (oData.results.length) {
                            that.oModel.setData({
                                results: oData.results,
                            });
                            oGModel.setProperty("/uniqueData", oData.results);
                            that.byId("idMatVHead").setModel(that.oModel);
                            oGModel.setProperty("/locId", oData.results[0].LOCATION_ID);
                            oGModel.setProperty("/prdId", oData.results[0].PRODUCT_ID);
                            oGModel.setProperty("/uniqId", oData.results[0].UNIQUE_ID);
                            oGModel.setProperty("/uid_rate",oData.results[0].UID_RATE);
                            // Setting the default selected item for table
                            that.byId("idMatVHead").setSelectedItem(that.byId("idMatVHead").getItems()[0], true);
                            that.byId("idCreateBtn").setVisible(true);
                            that.byId("idCopyBtn").setVisible(true);
                            // Calling function to navigate to Item detail page
                            that.onhandlePress();
                        } else {
                            MessageToast.show("No data for the selected Location Product");
                        }

                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
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
                    var sSelItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
                    // Set the selected values to get the details
                    oGModel.setProperty("/prdId", sSelItem.PRODUCT_ID);
                    oGModel.setProperty("/locId", sSelItem.LOCATION_ID);
                    oGModel.setProperty("/uniqId", sSelItem.UNIQUE_ID);
                    oGModel.setProperty("/uid_rate",sSelItem.UID_RATE);
                    oGModel.setProperty("/uid_active",sSelItem.ACTIVE);
                }
                // Calling Item Detail page
                that.getOwnerComponent().runAsOwner(function () {
                    if (!that.oDetailView) {
                        try {
                            that.oDetailView = sap.ui.view({
                                viewName: "cpapp.cpmatvariant.view.ItemDetail",
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
                                new Filter("UNIQUE_RDESC", FilterOperator.Contains, sQuery),
                                new Filter("UNIQUE_ID", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idMatVHead").getBinding("items").filter(oFilters);
            },


            onEditDesc: function (oEvent) {
                var oSelected = oEvent.getSource().getParent().getBindingContext().getObject();

                oGModel.setProperty("/SelectedData", oSelected);
                oGModel.setProperty("/SelectedId", oSelected.UNIQUE_ID);
                oGModel.setProperty("/SelectedDesc", oSelected.UNIQUE_DESC);
                oGModel.setProperty("/SelectedURate", oSelected.UID_RATE);
                this._valueHelpDialogDescUpdate.open();
            },

            onCloseDesc: function () {
                this._valueHelpDialogDescUpdate.close();
            },

            onUpdateUniqueDesc: function () {
                var oItem = oGModel.getProperty("/SelectedData");
                var oDesc = sap.ui.getCore().byId("idUniqDesc").getValue();
                // var oUniqRate = sap.ui.getCore().byId("idUniqRate").getValue();

                var oActive;

                if (oItem.ACTIVE === true) {
                    oActive = '';//true;
                } else {
                    oActive = 'X';//falsev;
                }

                that.getModel("BModel").callFunction("/changeUnique", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: oItem.LOCATION_ID,
                        PRODUCT_ID: oItem.PRODUCT_ID,
                        UNIQUE_ID: oItem.UNIQUE_ID,
                        UID_TYPE: oItem.UID_TYPE,
                        // UID_RATE: oUniqRate,
                        UNIQUE_DESC: oDesc,
                        ACTIVE: oActive,
                        FLAG: "E"
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(oData.changeUnique);
                        that.onCloseDesc();
                        that.onGetData();
                    },
                    error: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to changes the status");
                    },
                });
            },

            onChange: function (oEvent) {

                var oItem = oEvent.getSource().getBindingContext().getObject();

                var oActive;

                if (oItem.ACTIVE === true) {
                    oActive = 'X';//false;
                } else {
                    oActive = '';//true;
                }

                that.getModel("BModel").callFunction("/changeUnique", {
                    method: "GET",
                    urlParameters: {
                        LOCATION_ID: oItem.LOCATION_ID,
                        PRODUCT_ID: oItem.PRODUCT_ID,
                        UNIQUE_ID: oItem.UNIQUE_ID,
                        UID_TYPE: oItem.UID_TYPE,

                        UNIQUE_DESC: oItem.UNIQUE_DESC,
                        ACTIVE: oActive,
                        FLAG:"E"
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(oData.changeUnique);
                        that.onGetData();
                    },
                    error: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to changes the status");
                    },
                });

            },
            onCreateBtn: function () {
                that.oTableData = [];
                sap.ui.getCore().byId("idUniqDesc1").setValue("");
                // var oCharTable = sap.ui.getCore().byId("idCharItem");
                that.ListModel = new JSONModel();

                that.ListModel.setData({
                    results: that.oTableData
                });
                sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                that._createCharacterstics.open();
                var oLoctid = this.byId("idloc").getValue(),
                    oProdid = this.byId("prodInput").getValue(),
                    ouidType = this.byId("idUnique").getSelectedKey();
                sap.ui.getCore().byId("locId1").setValue(oLoctid);
                sap.ui.getCore().byId("prodId1").setValue(oProdid);

                oGModel.setProperty("/New", "N");

                sap.ui.getCore().byId("idUniqDesc1").setValue("");

                           
                            that.oTableData = [];
                        that.ListModel = new JSONModel();

                        that.ListModel.setData({
                            results: that.oTableData
                        });
                        sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                // sap.ui.getCore().byId("idComboBox1").setSelectedKey(ouidType);

            },
            onCopyBtn: function (oEvent) {
                // // that._copyCharacterstics.open();
                // var selected = that.byId("idMatVHead").getSelectedItem();
                // sap.ui.getCore().byId("locIdCC").setValue(selected.getBindingContext().getProperty().LOCATION_ID);
                // sap.ui.getCore().byId("prodIdCC").setValue(selected.getBindingContext().getProperty().PRODUCT_ID);
                // sap.ui.getCore().byId("uniqIdCC").setValue("");
                // sap.ui.getCore().byId("idUniqDescCC").setValue(selected.getBindingContext().getProperty().UNIQUE_DESC);
                // // sap.ui.getCore().byId("idComboBoxCC").setSelectedKey(selected.getBindingContext().getProperty().UID_TYPE);
                // sap.ui.getCore().byId("uidRIdCC").setValue(selected.getBindingContext().getProperty().UID_RATE);
                // // sap.ui.getCore().byId("idComboBoxAC").setSelectedKey(selected.getBindingContext().getProperty().ACTIVE);


                var selUniq = that.byId("idMatVHead").getSelectedItem().getBindingContext().getProperty();
                var text = "Please Confirm to copy characteristics of Unique ID" + " - " + selUniq.UNIQUE_ID;
			sap.m.MessageBox.show(
				text, {

					title: "Conformation",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
                            
                            sap.ui.getCore().byId("locId1").setValue(selUniq.LOCATION_ID);
                            sap.ui.getCore().byId("prodId1").setValue(selUniq.PRODUCT_ID);
                            // sap.ui.getCore().byId("idComboBox").setValue(selUniq.ACTIVE);
                            sap.ui.getCore().byId("idUniqDesc1").setValue(selUniq.UNIQUE_DESC);

                            oGModel.setProperty("/New", "C");

                            that.oTableData = oGModel.getProperty("/CharData");
                        that.ListModel = new JSONModel();

                        that.ListModel.setData({
                            results: that.oTableData
                        });
                        sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);

                        that._createCharacterstics.open();

						}
					}
				}
			);

                // that._createCharacterstics.open();
                // var oLoctid = this.byId("idloc").getValue(),
                //     oProdid = this.byId("prodInput").getValue(),
                //     ouidType = this.byId("idUnique").getSelectedKey();
                // sap.ui.getCore().byId("locId1").setValue(oLoctid);
                // sap.ui.getCore().byId("prodId1").setValue(oProdid);

            },
            onCloseCreate: function () {
                this._createCharacterstics.close();


            },
            onCloseCopy: function () {
                this._copyCharacterstics.close();
            },


            onAddChar:function(){
                sap.ui.getCore().byId("idClassname2").setValue("");
                sap.ui.getCore().byId("idCharname2").setValue("");
                sap.ui.getCore().byId("idCharval2").setValue("");
                that._addCharacteristic.open();

            },

            handleCharValueHelp:function(oEvent){

                if (!this._valueHelpDialogcharName) {
                    this._valueHelpDialogcharName = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.charName",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogcharName);
                }

                if (!this._valueHelpDialogcharValue) {
                    this._valueHelpDialogcharValue = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.charValue",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogcharValue);
                }

                if (!this._valueHelpDialogclassName) {
                    this._valueHelpDialogclassName = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.className",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogclassName);
                }

                var sId = oEvent.getParameter("id");
                var sPrdId = oGModel.getProperty("/prdId");
                var sLocId = oGModel.getProperty("/locId");

                if (sId.includes("Classname")) {
                    that.getModel("BModel").read("/getProdClass", {
                        filters: [
                            new Filter("PRODUCT_ID", FilterOperator.Contains, sPrdId),
                            new Filter("LOCATION_ID", FilterOperator.Contains, sLocId)

                        ],

                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.classNameData = oData.results;
                            var newClassModel = new JSONModel();
                            newClassModel.setData({ results: that.classNameData });
                            sap.ui.getCore().byId("classNameList").setModel(newClassModel);
                            that._valueHelpDialogclassName.open();
                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get class name data");
                        },
                    });

                } else if (sId.includes("Charname")) {
                    if (sap.ui.getCore().byId("idClassname2").getValue()) {
                        that._valueHelpDialogcharName.open();
                    } else {
                        MessageToast.show("Select Class Name");
                    }

                } else if (sId.includes("Charval")) {
                    if (sap.ui.getCore().byId("idCharname2").getValue()) {
                        that._valueHelpDialogcharValue.open();
                    } else {
                        MessageToast.show("Select Class Name and Characteristic Name");
                    }

                }


            },

            handleCharSelection: function (oEvent) {
                that.oGModel = that.getModel("oGModel");
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems,
                    aODdata = [];
                if (sId.includes("className")) {

                    that.oClassName = sap.ui.getCore().byId("idClassname2");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oClassName.setValue(aSelectedItems[0].getTitle());
                    oGModel.setProperty("/UID_Rate", aSelectedItems[0].getBindingContext().getProperty().CLASS_NUM);

                    sap.ui.getCore().byId("idCharname2").setValue("");

                    sap.ui.getCore().byId("idCharval2").setValue("");

                    this.getModel("BModel").read("/getClassChar", {
                        filters: [
                            new Filter(
                                "CLASS_NUM",
                                FilterOperator.EQ,
                                aSelectedItems[0].getBindingContext().getProperty().CLASS_NUM
                            ),
                            // new Filter(
                            //     "PRODUCT_ID",
                            //     FilterOperator.EQ,
                            //     oGModel.getProperty("/prdId")
                            // ),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();

                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            that.charnameModel.setData({
                                results: removeDuplicate(oData.results, 'CHAR_NAME')
                            });

                            sap.ui.getCore().byId("charNameList").setModel(that.charnameModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else if (sId.includes("charName")) {

                    that.oCharName = sap.ui.getCore().byId("idCharname2");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oCharName.setValue(aSelectedItems[0].getTitle());
                    oGModel.setProperty("/Char_Num", aSelectedItems[0].getDescription());


                    sap.ui.getCore().byId("idCharval2").setValue("");

                    this.getModel("BModel").read("/getClassChar", {
                        filters: [
                            new Filter(
                                "CLASS_NUM",
                                FilterOperator.EQ,
                                aSelectedItems[0].getBindingContext().getProperty().CLASS_NUM
                            ),
                            new Filter(
                                "CHAR_NAME",
                                FilterOperator.EQ,
                                sap.ui.getCore().byId("idCharname2").getValue()
                            ),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();

                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            that.charvalueModel.setData({
                                results: removeDuplicate(oData.results, 'CHAR_VALUE')
                            });

                            sap.ui.getCore().byId("charValList").setModel(that.charvalueModel);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else if (sId.includes("charVal")) {
                    that.oCharVal = sap.ui.getCore().byId("idCharval2");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oCharVal.setValue(aSelectedItems[0].getTitle());
                    oGModel.setProperty("/CharVal_Num", aSelectedItems[0].getDescription());
                }
            },

            handleCharSearch: function (oEvent) {
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = oEvent.getParameter("id"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";
                // Class Name
                if (sId.includes("className")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                                    // new Filter("CLASS_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oClassnameList = sap.ui.getCore().byId("classNameList");
                    that.oClassnameList.getBinding("items").filter(oFilters);
                    // Char Name
                } else if (sId.includes("charName")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                    // new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCharnameList = sap.ui.getCore().byId("charNameList");
                    that.oCharnameList.getBinding("items").filter(oFilters);
                    // Char Value
                } else if (sId.includes("charVal")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                    // new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oCharvalueList = sap.ui.getCore().byId("charValList");
                    that.oCharvalueList.getBinding("items").filter(oFilters);
                }
            },
            handleCharClose: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("className")) {
                    that._oCore.byId(this._valueHelpDialogclassName.getId() + "-searchField")
                        .setValue("");
                    if (that.oClassnameList.getBinding("items")) {
                        that.oClassnameList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("charName")) {
                    that._oCore
                        .byId(this._valueHelpDialogcharName.getId() + "-searchField")
                        .setValue("");
                    if (that.oCharnameList.getBinding("items")) {
                        that.oCharnameList.getBinding("items").filter([]);
                    }
                } else if (sId.includes("charVal")) {
                    that._oCore
                        .byId(this._valueHelpDialogcharValue.getId() + "-searchField")
                        .setValue("");
                    if (that.oCharvalueList.getBinding("items")) {
                        that.oCharvalueList.getBinding("items").filter([]);
                    }
                }
            },

            onCloseRestItem: function () {

                sap.ui.getCore().byId("idClassname2").setValue("");
                sap.ui.getCore().byId("idCharname2").setValue("");
                sap.ui.getCore().byId("idCharval2").setValue("");

                that._addCharacteristic.close();

            },


            onAdd: function () {
                var charName = sap.ui.getCore().byId("idCharname2").getValue(),
                    charNum = oGModel.getProperty("/Char_Num"),
                    charVal_Name = sap.ui.getCore().byId("idCharval2").getValue(),
                    charVal_Num = oGModel.getProperty("/CharVal_Num"),
                    className = sap.ui.getCore().byId("idClassname2").getValue();

                if (charName !== "" && charVal_Name !== "" && className !== "") {

                    this.oData = {

                        "CLASS_NAME": className,
                        "CHAR_NAME": charName,
                        "CHAR_NUM": charNum,
                        "CHAR_VALUE": charVal_Name,
                        "CHARVAL_NUM": charVal_Num,
                        "OFLAG": "X",
                    };
                    var oItemTable = sap.ui.getCore().byId("idCharItem").getItems();
                    var count = 0;

                    for (var i = 0; i < oItemTable.length; i++) {
                        if (oItemTable[i].getCells()[1].getText() === charNum &&
                            oItemTable[i].getCells()[3].getText() === charVal_Num) {
                            count = count + 1;
                        }
                    }

                    if (count === 0) {
                        // that.oTableData = [];
                        // Add entry to the table model
                        that.oTableData.push(that.oData);
                        that.ListModel = new JSONModel();

                        that.ListModel.setData({
                            results: that.oTableData
                        });
                        sap.ui.getCore().byId("idCharItem").setModel(that.ListModel);
                        that._addCharacteristic.close();
                        // that.byId("idUpdateSave").setVisible(true);

                    } else {
                        sap.m.MessageToast.show("Characterstic is already maintained");
                    }

                } else {
                    MessageToast.show("Please fill all inputs");
                }


            },

            onTabDel:function(oEvent){
                var selItem = oEvent.getSource().getParent().getBindingContext().getObject();


                   var oItemtoDelete =  oEvent.getParameters("listItem").id.split("idCharItem-")[1];
                   var aData = that.ListModel.getData().results;
                   aData.splice(oItemtoDelete, 1); //removing 1 record from i th index.
                   that.ListModel.refresh();
            },



            onCreateUniq: function () {

                var Charlist;
                var oEntry = { RTRCHAR: [] };
                
                var olocID = sap.ui.getCore().byId("locId1").getValue(),
                    oprodID = sap.ui.getCore().byId("prodId1").getValue(),
                    ouniqID = 1,
                    ouniqDesc = sap.ui.getCore().byId("idUniqDesc1").getValue(),
                    ouniqTID = sap.ui.getCore().byId("idComboBox1").getValue(),
                    ouniqRID = sap.ui.getCore().byId("uidRId1").getValue(),
                    oactID = sap.ui.getCore().byId("idComboBox").getValue(),
                    flag = 'C',
                    count = 0;
                if (oactID === "True") {
                    oactID = '';
                }
                else {
                    oactID = 'X';
                }

                    // sap.ui.core.BusyIndicator.show();
                    // var bModel = that.getView().getModel("BModel");
                    // bModel.callFunction("/changeUnique", {
                    //     method: "GET",
                    //     urlParameters: {
                    //         UNIQUE_ID: ouniqID,
                    //         LOCATION_ID: olocID,
                    //         PRODUCT_ID: oprodID,
                    //         UID_TYPE: ouniqTID,
                    //         // UID_RATE: ouniqRID,
                    //         UNIQUE_DESC: ouniqDesc,
                    //         ACTIVE: oactID,
                    //         FLAG: "C"
                    //     },
                    //     success: function (oData) {
                    //         sap.m.MessageToast.show(oData.changeUnique);
                    //         that.onAfterRendering();
                    //         that._createCharacterstics.close();
                    //         that.onGetData();
                    //         sap.ui.core.BusyIndicator.hide();
                    //     },
                    //     error(e) {
                    //         sap.m.MessageToast.show("Failed to Create");
                    //         sap.ui.core.BusyIndicator.hide();
                    //     }
                    // });
                


                var aTabledata = sap.ui.getCore().byId("idCharItem").getItems();
                var Flag = oGModel.getProperty("/New");
                for(var i=0; i<aTabledata.length; i++){
                    var aData = aTabledata[i].getBindingContext().getObject();

                    Charlist = {
                        LOCATION_ID: olocID,
                        PRODUCT_ID: oprodID,
                        UNIQUE_ID: ouniqID,
                        UNIQUE_DESC: ouniqDesc,
                        CHAR_NUM: aData.CHAR_NUM,
                        CHARVAL_NUM: aData.CHARVAL_NUM
                    }
                    oEntry.RTRCHAR.push(Charlist);
                }

                sap.ui.core.BusyIndicator.show();

                that.getModel("BModel").callFunction("/maintainUniqueChar", {
                    method: "GET",
                    urlParameters: {
                        FLAG: Flag,
                        UNIQUECHAR: JSON.stringify(oEntry.RTRCHAR)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.maintainUniqueChar);
                        that.onAfterRendering();
                        that.onCloseCreate();

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error");
                    },
                });




            },
            onCopyUniqueDesc: function () {
                var uniqueData = oGModel.getProperty("/uniqueData");
                var olocID = sap.ui.getCore().byId("locIdCC").getValue(),
                    oprodID = sap.ui.getCore().byId("prodIdCC").getValue(),
                    ouniqID = 1,
                    ouniqDesc = sap.ui.getCore().byId("idUniqDescCC").getValue(),
                    ouniqTID = sap.ui.getCore().byId("idComboBoxCC").getSelectedKey(),
                    ouniqRID = sap.ui.getCore().byId("uidRIdCC").getValue(),
                    oactID = sap.ui.getCore().byId("idComboBoxAC").getValue(),
                    flag = 'C',
                    count = 0;
                    if (oactID === "True") {
                        oactID = '';
                    }
                    else {
                        oactID = 'X';
                    }
                // for (var s = 0; s < uniqueData.length; s++) {
                //     if (parseInt(ouniqID) !== uniqueData[s].UNIQUE_ID) {
                //         count++;
                //     }
                //     else {
                //         continue;
                //     }
                // }
                if(olocID ==="" || oprodID ==="" ){
                    sap.m.MessageToast.show("Please select Location/Product")
                }
                else {
                // if (count === uniqueData.length) {

                    sap.ui.core.BusyIndicator.show();
                    var bModel = that.getView().getModel("BModel");
                    bModel.callFunction("/changeUnique", {
                        method: "GET",
                        urlParameters: {
                            LOCATION_ID: olocID,
                            PRODUCT_ID: oprodID,
                            UNIQUE_ID: ouniqID,
                            UID_TYPE: ouniqTID,
                            // UID_RATE: ouniqRID,
                            UNIQUE_DESC: ouniqDesc,
                            ACTIVE: oactID,
                            FLAG: "C"
                        },
                        success: function (oData) {
                            sap.m.MessageToast.show(oData.changeUnique);
                            that.onAfterRendering();
                            that._copyCharacterstics.close();
                            that.onGetData();
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error(e) {
                            sap.m.MessageToast.show("Failed to Create");
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                // }
                // else {
                //     sap.m.MessageToast.show("Unique ID already exists");
                // }

            }
        }

        })
    })

