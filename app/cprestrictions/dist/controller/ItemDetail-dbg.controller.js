sap.ui.define(
    [
        "cpapp/cprestrictions/controller/BaseController",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/Device",
        "sap/ui/core/Fragment",
    ],
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
        return BaseController.extend("cpapp.cprestrictions.controller.ItemDetail", {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             */
            onInit: function () {
                that = this;
                this.bus = sap.ui.getCore().getEventBus();
                // Declaring JSON Models and size limit
                that.oModel = new JSONModel();
                that.classnameModel = new JSONModel();
                that.charnameModel = new JSONModel();
                that.charvalueModel = new JSONModel();

                this.oModel.setSizeLimit(1000);
                that.classnameModel.setSizeLimit(1000);
                that.charnameModel.setSizeLimit(1000);
                that.charvalueModel.setSizeLimit(1000);

                oGModel = that.getOwnerComponent().getModel("oGModel");

                // Declaration of Dialogs
                this._oCore = sap.ui.getCore();

                // if (!this._valueHelpDialogRestItem) {
                //     this._valueHelpDialogRestItem = sap.ui.xmlfragment(
                //       "cpapp.cprestrictions.view.RestrictionItem",
                //       this
                //     );
                //     this.getView().addDependent(this._valueHelpDialogRestItem);
                //   }

                // if (!this._valueHelpDialogclassName) {
                //     this._valueHelpDialogclassName = sap.ui.xmlfragment(
                //       "cpapp.cprestrictions.view.className",
                //       this
                //     );
                //     this.getView().addDependent(this._valueHelpDialogclassName);
                //   }

                //   if (!this._valueHelpDialogcharName) {
                //     this._valueHelpDialogcharName = sap.ui.xmlfragment(
                //       "cpapp.cprestrictions.view.charName",
                //       this
                //     );
                //     this.getView().addDependent(this._valueHelpDialogcharName);
                //   }

                //   if (!this._valueHelpDialogcharValue) {
                //     this._valueHelpDialogcharValue = sap.ui.xmlfragment(
                //       "cpapp.cprestrictions.view.charValue",
                //       this
                //     );
                //     this.getView().addDependent(this._valueHelpDialogcharValue);
                //   }
            },

            /**
             * Called after the view has been rendered.
             * Calls the service to get Data.
             */
            onAfterRendering: function () {
                oGModel = that.getOwnerComponent().getModel("oGModel");
                sap.ui.core.BusyIndicator.show();
                var sRestriction = oGModel.getProperty("/Restriction");

                // this.oClassName = this._oCore.byId("idClassname");
                //   this.oCharName = this._oCore.byId("idCharname");
                //   this.oCharValue = this._oCore.byId("idCharval");

                //   that._valueHelpDialogclassName.setTitleAlignment("Center");
                //   that._valueHelpDialogcharName.setTitleAlignment("Center");
                //   that._valueHelpDialogcharValue.setTitleAlignment("Center");

                //   this.oClassnameList = this._oCore.byId(
                //     this._valueHelpDialogclassName.getId() + "-list"
                //   );

                //   this.oCharnameList = this._oCore.byId(
                //     this._valueHelpDialogcharName.getId() + "-list"
                //   );

                //   this.oCharvalueList = this._oCore.byId(
                //     this._valueHelpDialogcharValue.getId() + "-list"
                //   );

                this.getModel("BModel").read("/getODHdrRstr", {
                    filters: [
                        new Filter("RESTRICTION", FilterOperator.EQ, sRestriction),
                    ],

                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // if (oData.results.length) {
                            that.oModel.setData({
                                results: oData.results,
                            });
                            that.byId("idDetail").setModel(that.oModel);
                        // }
                        that.byId("idSearch").setValue("");

                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });
            },

            /**
             * Called when something is entered into the search field.
             * @param {object} oEvent -the event information.
             */
            onItemSearch: function (oEvent) {
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
                                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idDetail").getBinding("items").filter(oFilters);
            },


            onCreateItem: function () {
                that._valueHelpDialogRestItem.open();

            },
            onCloseRestItem: function () {
                that._valueHelpDialogRestItem.close();
            },

            onEditItem: function (oEvent) {
                var oTable = this.byId("idDetail").getItems();
                this.byId("idUpdateSave").setVisible(true);
                this.byId("idUpdateCancel").setVisible(true);

                for (var i = 0; i < oTable.length; i++) {
                    oTable[i].getCells()[4].setEditable(true);
                    oTable[i].getCells()[5].setEditable(true);
                }

            },



            onCancelUpdate: function (oEvent) {
                var oTable = this.byId("idDetail").getItems();
                this.byId("idUpdateSave").setVisible(false);
                this.byId("idUpdateCancel").setVisible(false);

                for (var i = 0; i < oTable.length; i++) {
                    oTable[i].getCells()[4].setEditable(false);
                    oTable[i].getCells()[5].setEditable(false);
                }

            },

            onUpdateItem: function (oEvent) {
                var oTable = this.byId("idDetail").getItems();
                var oEntry = {
                    RTRCHAR: [],
                  },
                  vRuleslist;
                  var oFlag = "E";
                  for(var i=0; i<oTable.length; i++){
                      var aData = oTable[i].getBindingContext().getObject()
    
                        vRuleslist = {
                            RESTRICTION: aData.RESTRICTION,
                            CLASS_NUM: aData.CLASS_NUM,           
                            CHAR_NUM:aData.CHAR_NUM,            
                            CHARVAL_NUM:aData.CHARVAL_NUM,
                            CHAR_COUNTER: aData.CHAR_COUNTER,
                            OD_CONDITION: aData.OD_CONDITION,
                            ROW_ID : aData.ROW_ID,
                        };
                        oEntry.RTRCHAR.push(vRuleslist);
                    }
        
                that.getModel("BModel").callFunction("/maintainRestrDet", {
                    method: "GET",
                    urlParameters: {
                        FLAG : oFlag,
                        RTRCHAR: JSON.stringify(oEntry.RTRCHAR)
                    },
                    success: function (oData) {
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageToast.show("success");
                      that.onAfterRendering();
                      that.onCancelUpdate();
                     
                    },
                    error: function (error) {
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageToast.show("Error");
                    },
                  });            
              },


              onDeleteItem:function(oEvent){
                var oEntry = {
                    RTRCHAR: [],
                  },
                  vRuleslist;
                  var oFlag = "D";
                var selItem = oEvent.getSource().getParent().getBindingContext().getObject();
                    // var oRest = selItem.RESTRICTION,
                    //     oClassnum = selItem.CLASS_NUM,
                    //     oCharNum = selItem.CHAR_NUM,
                    //     oCharCounter = selItem.CHAR_COUNTER,
                    //     oCharValNo = selItem.CHARVAL_NUM;

                        vRuleslist = {
                            RESTRICTION: selItem.RESTRICTION,
                            CLASS_NUM: selItem.CLASS_NUM,           
                            CHAR_NUM:selItem.CHAR_NUM,            
                            CHARVAL_NUM:selItem.CHARVAL_NUM,
                            CHAR_COUNTER: selItem.CHAR_COUNTER,
                        };
                        oEntry.RTRCHAR.push(vRuleslist);

                        that.getModel("BModel").callFunction("/maintainRestrDet", {
                            method: "GET",
                            urlParameters: {
                                FLAG : oFlag,
                                RTRCHAR: JSON.stringify(oEntry.RTRCHAR)
                            },
                            success: function (oData) {
                              sap.ui.core.BusyIndicator.hide();
                              sap.m.MessageToast.show("success");
                              that.onAfterRendering();
                             
                            },
                            error: function (error) {
                              sap.ui.core.BusyIndicator.hide();
                              sap.m.MessageToast.show("Error");
                            },
                          });   
              },
            










        });
    }
);
