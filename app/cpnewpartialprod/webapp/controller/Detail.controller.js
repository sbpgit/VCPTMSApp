sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cpapp/cpnewpartialprod/controller/BaseController",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
      Controller,
      BaseController,
      JSONModel,
      Filter,
      FilterOperator,
      MessageToast,
      MessageBox
    ) {
      "use strict";
      var oGModel, that;
      return BaseController.extend("cpapp.cpnewpartialprod.controller.Detail", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;
          that.ListModel = new JSONModel();
          that.locModel = new JSONModel();
          that.prodModel = new JSONModel();
          that.classnameModel = new JSONModel();
          that.charnameModel = new JSONModel();
          that.charvalueModel = new JSONModel();


          that.ListModel.setSizeLimit(1000);
          that.locModel.setSizeLimit(1000);
          that.prodModel.setSizeLimit(1000);
          that.classnameModel.setSizeLimit(1000);
          that.charnameModel.setSizeLimit(1000);
          that.charvalueModel.setSizeLimit(1000);
  
          // Declaration of Dialogs
          this._oCore = sap.ui.getCore();
  
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cpapp.cpnewpartialprod.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
  
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cpapp.cpnewpartialprod.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }

          if (!this._valueHelpDialogclassName) {
            this._valueHelpDialogclassName = sap.ui.xmlfragment(
              "cpapp.cpnewpartialprod.view.className",
              this
            );
            this.getView().addDependent(this._valueHelpDialogclassName);
          }

          if (!this._valueHelpDialogcharName) {
            this._valueHelpDialogcharName = sap.ui.xmlfragment(
              "cpapp.cpnewpartialprod.view.charName",
              this
            );
            this.getView().addDependent(this._valueHelpDialogcharName);
          }

          if (!this._valueHelpDialogcharValue) {
            this._valueHelpDialogcharValue = sap.ui.xmlfragment(
              "cpapp.cpnewpartialprod.view.charValue",
              this
            );
            this.getView().addDependent(this._valueHelpDialogcharValue);
          }

          that.aData=[];
        },

        onAfterRendering:function(){

            this.oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
            oGModel = this.getModel("oGModel");
          this.oLoc = that.byId("idloc");
          this.oProd = that.byId("idrefprod");
          this.oClassName = that.byId("idClassname");
          this.oCharName = that.byId("idCharname");
          this.oCharValue = that.byId("idCharval");

          that._valueHelpDialogProd.setTitleAlignment("Center");
          that._valueHelpDialogLoc.setTitleAlignment("Center");
  
          this.oProdList = this._oCore.byId(
            this._valueHelpDialogProd.getId() + "-list"
          );
          this.oLocList = this._oCore.byId(
            this._valueHelpDialogLoc.getId() + "-list"
          );

          this.oClassnameList = this._oCore.byId(
            this._valueHelpDialogclassName.getId() + "-list"
          );

          this.oCharnameList = this._oCore.byId(
            this._valueHelpDialogcharName.getId() + "-list"
          );

          this.oCharvalueList = this._oCore.byId(
            this._valueHelpDialogcharValue.getId() + "-list"
          );

          if(oGModel.getProperty("/sFlag") === "E"){
              that.byId("idClassChar").setTitle("Update Job");
            that.byId("idloc").setEditable(false);
            that.byId("idProd").setEditable(false);

            that.byId("idloc").setValue(oGModel.getProperty("/Loc"));
            that.byId("idProd").setValue(oGModel.getProperty("/Prod"));
            that.byId("idrefprod").setValue(oGModel.getProperty("/refProd"));
              
          } else if(oGModel.getProperty("/sFlag") === "C"){
            that.byId("idClassChar").setTitle("Create Job");
            that.byId("idloc").setEditable(true);
            that.byId("idProd").setEditable(true);

            that.byId("idloc").setValue("");
            that.byId("idProd").setValue("");
            that.byId("idrefprod").setValue("");
          }

            that.byId("idprodPanel").setExpanded(true);
            that.byId("idCharPanel").setExpanded(false);
  
          // Calling service to get the location data
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


        onBack: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
        },

        /**
         * This function is called when click on Value Help of Inputs.
         * In this function dialogs will open based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            oGModel.setProperty("/OpenProdInut", "");
            // Location Dialog
            if (sId.includes("loc")) {
              that._valueHelpDialogLoc.open();
              // Product Dialog
            } else if (sId.includes("idrefprod")) {
                that.ProdData();
              if (that.byId("idloc").getValue()) {
                oGModel.setProperty("/OpenProdInut", "RP");
                that._valueHelpDialogProd.open();
              } else {
                MessageToast.show("Select Location");
              }
            } else if (sId.includes("idProd")) {
                that.ProdData();
                if (that.byId("idloc").getValue()) {
                    oGModel.setProperty("/OpenProdInut", "NP");
                  that._valueHelpDialogProd.open();
                } else {
                  MessageToast.show("Select Location");
                }
              } else if (sId.includes("Classname")) {
                  that._valueHelpDialogclassName.open();                
              } else if (sId.includes("Charname")) {
                that._valueHelpDialogcharName.open();                
              } else if (sId.includes("Charval")) {
                that._valueHelpDialogcharValue.open();                
            }
          },

           /**
         * This function is called to get the product data.
         */
        ProdData:function(){
            sap.ui.core.BusyIndicator.show();
                // Calling service to get the Product data
                this.getModel("BModel").read("/getLocProdDet", {
                    filters: [
                    new Filter(
                        "LOCATION_ID",
                        FilterOperator.EQ,
                        that.byId("idloc").getValue()
                    ),
                    ],
                    success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.prodModel.setData(oData);
                    that.oProdList.setModel(that.prodModel);
                    },
                    error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                    },
                });
    
          },
    
          /**
           * Called when 'Close/Cancel' button in any dialog is pressed.
           */
          handleClose: function (oEvent) {
            var sId = oEvent.getParameter("id");
            // this.byId("ProdList").removeSelections();
            // Location Dialog
            if (sId.includes("Loc")) {
              that._oCore
                .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                .setValue("");
              if (that.oLocList.getBinding("items")) {
                that.oLocList.getBinding("items").filter([]);
              }
              // Product Dialog
            } else if (sId.includes("prod")) {
              that._oCore
                .byId(this._valueHelpDialogProd.getId() + "-searchField")
                .setValue("");
              if (that.oProdList.getBinding("items")) {
                that.oProdList.getBinding("items").filter([]);
              }
            } else if (sId.includes("className")) {
                that._oCore
                  .byId(this._valueHelpDialogclassName.getId() + "-searchField")
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
            if (sId.includes("Loc")) {
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
            } else if (sId.includes("prodSlctList")) {
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
         * This function is called when selecting an item in dialogs .
         * @param {object} oEvent -the event information.
         */
        handleSelection: function (oEvent) {
            that.oGModel = that.getModel("oGModel");
            var sId = oEvent.getParameter("id"),
              oItem = oEvent.getParameter("selectedItems"),
              aSelectedItems,
              aODdata = [];
            //Location list
            if (sId.includes("Loc")) {
            //   sap.ui.core.BusyIndicator.show();
              that.oLoc = that.byId("idloc");
              that.oProd = that.byId("idrefprod");
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedItems[0].getTitle());
              that.oGModel.setProperty(
                "/SelectedLoc",
                aSelectedItems[0].getTitle()
              );
              // Removing the input box values when Location changed
              that.oProd.setValue("");
              that.byId("idProd").setValue("");
              that.oGModel.setProperty("/SelectedProd", "");
    
    
              // Product list
            } else if (sId.includes("prod")) {
                if(oGModel.getProperty("/OpenProdInut") === "RP"){
                    that.oProd = that.byId("idrefprod");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                        "/SelectedProd",
                        aSelectedItems[0].getTitle()
                    );
                    that.aData=[];
                    that.ListModel.setData({
                        results: that.aData
                    });
                    that.byId("idCharList").setModel(that.ListModel);
                    that.charData();
                    that.byId("idprodPanel").setExpanded(false);
                    that.byId("idCharPanel").setExpanded(true);

                } else if (oGModel.getProperty("/OpenProdInut") === "NP"){
                    that.oNewProd = that.byId("idProd");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oNewProd.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty(
                    "/SelectednewProd",
                    aSelectedItems[0].getTitle()
                    );
                }
              
    
             } else if (sId.includes("className")) {
                
                    that.oClassName = that.byId("idClassname");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oClassName.setValue(aSelectedItems[0].getTitle());

                    that.byId("idClassno").setValue(aSelectedItems[0].getDescription());
                    that.byId("idCharname").setValue("");
                    that.byId("idCharno").setValue("");
                    that.byId("idCharval").setValue("");
                    that.byId("idCharvalno").setValue("");
                    
                    this.getModel("BModel").read("/getProdClsChar", {
                        filters: [
                        new Filter(
                            "PRODUCT_ID",
                            FilterOperator.EQ,
                            that.byId("idrefprod").getValue()
                        ),
                        new Filter(
                            "CLASS_NAME",
                            FilterOperator.EQ,
                            that.byId("idClassname").getValue()
                        ),
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
                        // that.charnameModel.setData(oData);
                        that.oCharnameList.setModel(that.charnameModel);
                        },
                        error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                        },
                    });
             } else if (sId.includes("charName")) {
                
                that.oCharName = that.byId("idCharname");
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oCharName.setValue(aSelectedItems[0].getTitle());

                that.byId("idCharno").setValue(aSelectedItems[0].getDescription());

                that.byId("idCharval").setValue("");
                that.byId("idCharvalno").setValue("");
                
                this.getModel("BModel").read("/getProdClsChar", {
                    filters: [
                    new Filter(
                        "PRODUCT_ID",
                        FilterOperator.EQ,
                        that.byId("idrefprod").getValue()
                    ),
                    new Filter(
                        "CLASS_NAME",
                        FilterOperator.EQ,
                        that.byId("idClassname").getValue()
                    ),
                    new Filter(
                        "CHAR_NAME",
                        FilterOperator.EQ,
                        that.byId("idCharname").getValue()
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
                    // that.charvalueModel.setData(oData);
                    that.oCharvalueList.setModel(that.charvalueModel);
                    },
                    error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                    },
                });
             } else if (sId.includes("charVal")) {
                
                that.oCharValue = that.byId("idCharval");
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oCharValue.setValue(aSelectedItems[0].getTitle());

                that.byId("idCharvalno").setValue(aSelectedItems[0].getDescription());
                
                
             }
            that.handleClose(oEvent);
          },

          charData:function(){
            this.getModel("BModel").read("/getProdClsChar", {
                filters: [
                new Filter(
                    "PRODUCT_ID",
                    FilterOperator.EQ,
                    that.byId("idrefprod").getValue()
                ),
                ],
                success: function (oData) {
                sap.ui.core.BusyIndicator.hide();

                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }
                that.classnameModel.setData({
                    results: removeDuplicate(oData.results, 'CLASS_NAME')
                });
                // that.classnameModel.setData(oData);
                that.oClassnameList.setModel(that.classnameModel);
                },
                error: function (oData, error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("error");
                },
            });

          },


          onAdd:function(){
              var oClassName = that.byId("idClassname").getValue(),
                  oCharName = that.byId("idCharname").getValue(),
                  oCharVel = that.byId("idCharval").getValue();
            if(oClassName !== "" && oCharName !== "" && oCharVel !== "" ){

            
            this.oData = {
                "CLASS_NAME": oClassName,
                "CLASS_NUM": that.byId("idClassno").getValue(),
                "CHAR_NAME": oCharName,
                "CHAR_NUM": that.byId("idCharno").getValue(),
                "CHAR_VALUE": oCharVel,
                "CHARVAL_NUM": that.byId("idCharvalno").getValue()
            };

    
                // Add entry to the table model
                that.aData.push(that.oData);

                that.ListModel.setData({
                    results: that.aData
                });
                that.byId("idCharList").setModel(that.ListModel);

                that.byId("idClassname").setValue("");
                that.byId("idClassno").setValue("");
                that.byId("idCharname").setValue("");
                that.byId("idCharno").setValue("");
                that.byId("idCharval").setValue("");
                that.byId("idCharvalno").setValue("");

            } else {
                MessageToast.show("Select all inputs");
            }


          },

          onCharDel:function(oEvent){
            var oSelItem = oEvent.getParameters("listItem").id.split("CharList-")[1];
            var aData = that.ListModel.getData().results;
            aData.splice(oSelItem,1); //removing 1 record from i th index.
            that.ListModel.refresh();


          },

          onCharPanel:function(){
            if(that.byId("idrefprod").getValue()){
                that.byId("idCharPanel").setExpanded(true);
            } else {
                that.byId("idCharPanel").setExpanded(false);
                MessageToast.show("Select ref product");
            }

          },

          /**
         * This function is called when click on save button in dialog to create or update the product.
         * @param {object} oEvent -the event information.
         */
        onProdSave: function (oEvent) {
            var oLoc = this.byId("idloc").getValue(),
              oRefProd = this.byId("idrefprod").getValue(),
              oProd = this.byId("idProd").getValue(),
              oFlag = oGModel.getProperty("/sFlag");
    
            if (oRefProd === oProd) {
              MessageToast.show(
                "Reference product and new product can not be same"
              );
            } else {
              that.getModel("BModel").callFunction("/maintainNewProd", {
                method: "GET",
                urlParameters: {
                  LOCATION_ID: oLoc,
                  PRODUCT_ID: oProd,
                  REF_PRODID: oRefProd,
                  FLAG: oFlag,
                },
                success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  if (oFlag === "C") {
                    MessageToast.show("New product created successfully");
                  } else {
                    MessageToast.show("Successfully updated the product");
                  }

                that.createChar();
                  
                  
                },
                error: function (oData) {
                  MessageToast.show("Failed to create /updaate the producr");
                  sap.ui.core.BusyIndicator.hide();
                },
              });
            }
          },

          createChar:function(){
            var oEntry = {
                PRODCHAR: [],
              },
              vRuleslist;
              var aData = that.ListModel.getData().results;
              for(var i=0; i<aData.length; i++){

                    vRuleslist = {
                        PRODUCT_ID: that.byId("idProd").getValue(),
                        REF_PROD: that.byId("idrefprod").getValue(),
                        CLASS_NUM:aData[i].CLASS_NUM,            
                        CHAR_NUM:aData[i].CHAR_NUM,            
                        CHARVAL_NUM:aData[i].CHARVAL_NUM
                    };
                    oEntry.PRODCHAR.push(vRuleslist);
                }
    
            // that.getModel("BModel").callFunction("/maintainNewProdChar", {
            //     method: "GET",
            //     urlParameters: {
            //         FLAG : 'C',
            //         PRODCHAR: JSON.stringify(oEntry.PRODCHAR)
            //     },
            //     success: function (oData) {
            //       sap.ui.core.BusyIndicator.hide();
            //       sap.m.MessageToast.show("success");
            //       that.onBack();
            //     },
            //     error: function (error) {
            //       sap.ui.core.BusyIndicator.hide();
            //       sap.m.MessageToast.show("Error");
            //       that.onBack();
            //     },
            //   });

            
          },






        
    });
}
);


