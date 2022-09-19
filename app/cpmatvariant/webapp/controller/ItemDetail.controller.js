sap.ui.define(
    [
        "cpapp/cpmatvariant/controller/BaseController",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/Device",
        "sap/ui/core/Fragment",
        "cpapp/cpmatvariant/model/formatter"
    ],
    function (
        BaseController,
        MessageToast,
        MessageBox,
        JSONModel,
        Filter,
        FilterOperator,
        Device,
        Fragment,
        formatter

    ) {
        "use strict";
        var that, oGModel;
        return BaseController.extend("cpapp.cpmatvariant.controller.ItemDetail", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                this.bus = sap.ui.getCore().getEventBus();
                // Declaring JSON Models and size limit
                that.oCharModel = new JSONModel();
                this.oCharModel.setSizeLimit(1000);
                that.charnameModel = new JSONModel();
                that.custGrpnameModel = new JSONModel();
                that.charvalueModel = new JSONModel();
                that.oTableData = [];
                that.ListModel = new JSONModel();
                that._oCore = sap.ui.getCore();
                
            },

            /**
             * Called after the view has been rendered.
             * Calls the service to get Data.
             */
            onAfterRendering: function () {
                oGModel = that.getOwnerComponent().getModel("oGModel");
                sap.ui.core.BusyIndicator.show();
                var sPrdId = oGModel.getProperty("/prdId");
                var sLocId = oGModel.getProperty("/locId");
                var sUniqId = oGModel.getProperty("/uniqId");

                oGModel.setProperty("/CharData", "");

                that.oCharModel.setData({
                    results: [],
                });
                that.byId("idMatvarItem").setModel(that.oCharModel);

                this.getModel("BModel").read("/getUniqueItem", {
                    filters: [
                        new Filter("LOCATION_ID", FilterOperator.EQ, sLocId),
                        new Filter("PRODUCT_ID", FilterOperator.EQ, sPrdId),
                        new Filter("UNIQUE_ID", FilterOperator.EQ, sUniqId),
                    ],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        oGModel.setProperty("/CharData", oData.results);

                        that.oCharModel.setData({
                            results: oData.results,
                        });
                        that.byId("idMatvarItem").setModel(that.oCharModel);
                    
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("No data");
                    },
                });
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            onCharSearch: function (oEvent) {
                var sQuery = "",
                    oFilters = [];
                if (oEvent) {
                    sQuery =
                        oEvent.getParameter("value") || oEvent.getParameter("newValue");
                }

                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery)
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idMatvarItem").getBinding("items").filter(oFilters);
            },
            /**
             * Open Create Seed Order fragment and setting up default values
             **/
            onOrderCreate:function(){   
                
                if (!this._CreateSO) {
                    this._CreateSO = sap.ui.xmlfragment(
                        "cpapp.cpmatvariant.view.CreateSeedOrder",
                        this
                    );
                    this.getView().addDependent(this._CreateSO);
                }
                
                this._CreateSO.open();
                sap.ui.getCore().byId("idlocIdSO").setValue(oGModel.getProperty("/locId"));
                sap.ui.getCore().byId("idprodIdSO").setValue(oGModel.getProperty("/prdId"));
                sap.ui.getCore().byId("idUniqSO").setValue(oGModel.getProperty("/uniqId"));
            },
            /**
             * Close Create Seed Order fragment
             **/
            onCloseSO:function(){
                this._CreateSO.close();  
            },
            /**
             * Creating new Seed Order for respective Location, Product
             **/
            onCreateSO:function(){
                var sLoc = sap.ui.getCore().byId("idlocIdSO").getValue(),
                    sProd = sap.ui.getCore().byId("idprodIdSO").getValue(),
                    sUniq = parseInt(sap.ui.getCore().byId("idUniqSO").getValue()),
                    squan = sap.ui.getCore().byId("idOrdQtySO").getValue(),
                    sDate = sap.ui.getCore().byId("DP1SO").getValue();

                var oEntry = {
                    SEEDDATA: [],
                },
                    vRuleslist,
                    oFlag = "C";
                vRuleslist = {
                    LOCATION_ID: sLoc,
                    PRODUCT_ID: sProd,
                    UNIQUE_ID: sUniq,
                    ORD_QTY: squan,
                    MAT_AVAILDATE: sDate                 
                };
                oEntry.SEEDDATA.push(vRuleslist);

                if (squan !== "" && sDate !== "" && sLoc !== "" && sProd !== "" && sUniq !== "") {

                    that.getModel("BModel").callFunction("/maintainSeedOrder", {
                        method: "GET",
                        urlParameters: {
                            FLAG: oFlag,
                            SEEDDATA: JSON.stringify(oEntry.SEEDDATA)
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Seed Order created successfully");
                            that.onCloseSO();
                            that.onAfterRendering();

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error creating a Seed Order");
                        },
                    });
                } else {
                    sap.m.MessageToast.show("Please fill all fields");
                }

            },
    
            /**
             * Search function for valuehelp request
             **/
            handleSearch: function (oEvent) {
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = oEvent.getParameter("id"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";
               
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CUSTOMER_GROUP", FilterOperator.Contains, sQuery),
                                    new Filter("CUSTOMER_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.oLocList.getBinding("items").filter(oFilters);
            }
        });
    });
