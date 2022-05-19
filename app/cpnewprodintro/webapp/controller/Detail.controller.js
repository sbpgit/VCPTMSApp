sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cpapp/cpnewprodintro/controller/BaseController",
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
      return BaseController.extend("cpapp.cpnewprodintro.controller.Detail", {
       /** 
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
        onInit: function () {
          that = this;
          // Declaration of Json Model and size category
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
  
          that.oData ={};
          // Declaration of Dialogs
          this._oCore = sap.ui.getCore();
  
          if (!this._valueHelpDialogLoc) {
            this._valueHelpDialogLoc = sap.ui.xmlfragment(
              "cpapp.cpnewprodintro.view.LocDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogLoc);
          }
  
          if (!this._valueHelpDialogProd) {
            this._valueHelpDialogProd = sap.ui.xmlfragment(
              "cpapp.cpnewprodintro.view.ProdDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogProd);
          }

          if (!this._valueHelpDialogclassName) {
            this._valueHelpDialogclassName = sap.ui.xmlfragment(
              "cpapp.cpnewprodintro.view.className",
              this
            );
            this.getView().addDependent(this._valueHelpDialogclassName);
          }

          if (!this._valueHelpDialogcharName) {
            this._valueHelpDialogcharName = sap.ui.xmlfragment(
              "cpapp.cpnewprodintro.view.charName",
              this
            );
            this.getView().addDependent(this._valueHelpDialogcharName);
          }

          if (!this._valueHelpDialogcharValue) {
            this._valueHelpDialogcharValue = sap.ui.xmlfragment(
              "cpapp.cpnewprodintro.view.charValue",
              this
            );
            this.getView().addDependent(this._valueHelpDialogcharValue);
          }

          that.aData=[];
        },

        /** 
        * Called after the view has been rendered.
        * Calls the getCharData[function] to get Data of Product Characteristics.
        */
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
          that.aData=[];
            // setting data based on button click in Home view
          if(oGModel.getProperty("/sFlag") === "E"){
              that.byId("idClassChar").setTitle("Update Product");
            that.byId("idloc").setEditable(false);
            that.byId("idProd").setEditable(false);

            that.byId("idloc").setValue(oGModel.getProperty("/Loc"));
            that.byId("idProd").setValue(oGModel.getProperty("/Prod"));
            that.byId("idrefprod").setValue(oGModel.getProperty("/refProd"));
            that.getCharData();
            that.byId("idprodPanel").setExpanded(false);
            that.byId("idCharPanel").setExpanded(true);
              
          } else if(oGModel.getProperty("/sFlag") === "C"){
            that.byId("idClassChar").setTitle("New Product");
            that.byId("idloc").setEditable(true);
            that.byId("idProd").setEditable(true);

            that.byId("idloc").setValue("");
            that.byId("idProd").setValue("");
            that.byId("idrefprod").setValue("");
            
                that.ListModel.setData({
                    results: that.aData
                });
                that.byId("idprodPanel").setExpanded(true);
                that.byId("idCharPanel").setExpanded(false);
                
          }


            
          sap.ui.core.BusyIndicator.show();
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

        getCharData:function(){
            var sSelProd = oGModel.getProperty("/Prod"),
            sSelrefProd = oGModel.getProperty("/refProd");

            sap.ui.core.BusyIndicator.show();
            this.getModel("BModel").read("/getProdClsChar", {
                filters: [
                  new Filter("PRODUCT_ID", FilterOperator.EQ, sSelrefProd),
                  new Filter("NEW_PRODID", FilterOperator.EQ, sSelProd),
                ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.ListModel.setData({
                        results: oData.results
                    });
                    that.byId("idCharList").setModel(that.ListModel);

                    var listCharData = oData.results;
            
                  if(listCharData.length){
                      for(var j=0; j< listCharData.length; j++){
                          that.oData = {
                              "CLASS_NAME": listCharData[j].CLASS_NAME,
                              "CLASS_NUM": listCharData[j].CLASS_NUM,
                              "CHAR_NAME": listCharData[j].CHAR_NAME,
                              "CHAR_NUM": listCharData[j].CHAR_NUM,
                              "CHAR_VALUE": listCharData[j].CHAR_VALUE,
                              "CHARVAL_NUM":listCharData[j].CHARVAL_NUM 
                          };
                          that.aData.push(that.oData);
                      }
                  }
                    // that.charData();
                },
                error: function () {
                    sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to get data");
                },
              });

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
                  var oProd="";
                  if(sId.split("--")[2] === "idClassname"){
                    that.RefDataId();
                    oProd = that.byId("idrefprod").getValue();
                  } else if(sId.split("--")[2] === "idNClassname"){
                    that.NewDataId();
                    oProd =  that.byId("idProd").getValue();
                  }

                  sap.ui.core.BusyIndicator.show();
                  this.getModel("BModel").read("/getProdClsChar", {
                    filters: [
                    new Filter("PRODUCT_ID", FilterOperator.EQ,oProd ),
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
                    that.oClassnameList.setModel(that.classnameModel);
                    },
                    error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                    },
                });
                  that._valueHelpDialogclassName.open();                
              } else if (sId.includes("Charname")) {
                  var oProd = "";
                if(sId.split("--")[2] === "idCharname"){
                    that.RefDataId();
                    oProd = that.byId("idrefprod").getValue();
                } else if(sId.split("--")[2] === "idNCharname"){
                    that.NewDataId();
                    oProd =  that.byId("idProd").getValue();
                 }
                 sap.ui.core.BusyIndicator.show();
                 this.getModel("BModel").read("/getProdClsChar", {
                    filters: [
                    new Filter("PRODUCT_ID", FilterOperator.EQ, oProd),
                    new Filter("CLASS_NAME", FilterOperator.EQ, that.oClassName.getValue()),
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
                    
                    that.oCharnameList.setModel(that.charnameModel);
                    that._valueHelpDialogcharName.open(); 
                    },
                    error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                    },
                });
                               
              } else if (sId.includes("Charval")) {
                  var oProd = "";
                if(sId.split("--")[2] === "idCharval"){
                    that.RefDataId();
                    oProd =  that.byId("idrefprod").getValue();
                } else if(sId.split("--")[2] === "idNCharval"){
                    that.NewDataId();
                    oProd =  that.byId("idProd").getValue();
                 }
                
                 sap.ui.core.BusyIndicator.show();
                this.getModel("BModel").read("/getProdClsChar", {
                    filters: [
                    new Filter("PRODUCT_ID", FilterOperator.EQ, oProd ),
                    new Filter("CLASS_NAME", FilterOperator.EQ, that.oClassName.getValue() ),
                    new Filter( "CHAR_NAME", FilterOperator.EQ, that.oCharName.getValue()),
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
                    
                    that.oCharvalueList.setModel(that.charvalueModel);
                    that._valueHelpDialogcharValue.open(); 
                    },
                    error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                    },
                });               
            }
          },


          RefDataId:function(){
                this.oClassName = that.byId("idClassname");
                this.oClassNo = that.byId("idClassno");
                this.oCharName = that.byId("idCharname");
                this.oCharNo = that.byId("idCharno");
                this.oCharValue = that.byId("idCharval");
                this.oCharValueNo = that.byId("idCharvalno");

          },

          NewDataId:function(){
                this.oClassName = that.byId("idNClassname");
                this.oClassNo = that.byId("idNClassno");
                this.oCharName = that.byId("idNCharname");
                this.oCharNo = that.byId("idNCharno");
                this.oCharValue = that.byId("idNCharval");
                this.oCharValueNo = that.byId("idNCharvalno");

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
              // Class
            } else if (sId.includes("className")) {
                if (sQuery !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                        new Filter("CLASS_NUM", FilterOperator.Contains, sQuery),
                      ],
                      and: false,
                    })
                  );
                }
                that.oClassnameList.getBinding("items").filter(oFilters);
                // Char Name
              } else if (sId.includes("charName")) {
                if (sQuery !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                        new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                      ],
                      and: false,
                    })
                  );
                }
                that.oCharnameList.getBinding("items").filter(oFilters);
                // Char Value
              } else if (sId.includes("charVal")) {
                if (sQuery !== "") {
                  oFilters.push(
                    new Filter({
                      filters: [
                        new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                        new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                      ],
                      and: false,
                    })
                  );
                }
                that.oCharvalueList.getBinding("items").filter(oFilters);
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
                    that.oGModel.setProperty("/SelectedProd",aSelectedItems[0].getTitle());
                    that.aData=[];
                    that.ListModel.setData({
                        results: that.aData
                    });
                    that.byId("idCharList").setModel(that.ListModel);
                    // that.charData();
                    that.byId("idClassname").setValue("");
                    that.byId("idClassno").setValue("");
                    that.byId("idCharname").setValue("");
                    that.byId("idCharno").setValue("");
                    that.byId("idCharval").setValue("");
                    that.byId("idCharvalno").setValue("");
                    that.byId("idprodPanel").setExpanded(false);
                    that.byId("idCharPanel").setExpanded(true);

                } else if (oGModel.getProperty("/OpenProdInut") === "NP"){
                    that.oNewProd = that.byId("idProd");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oNewProd.setValue(aSelectedItems[0].getTitle());
                    that.oGModel.setProperty("/SelectednewProd",aSelectedItems[0].getTitle());
                    that.aData=[];
                    that.ListModel.setData({
                        results: that.aData
                    });
                    that.byId("idCharList").setModel(that.ListModel);
                    that.byId("idNClassname").setValue("");
                    that.byId("idNClassno").setValue("");
                    that.byId("idNCharname").setValue("");
                    that.byId("idNCharno").setValue("");
                    that.byId("idNCharval").setValue("");
                    that.byId("idNCharvalno").setValue("");
                }
             } else if (sId.includes("className")) {
                
                    // that.oClassName = that.byId("idClassname");
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oClassName.setValue(aSelectedItems[0].getTitle());

                    that.oClassNo.setValue(aSelectedItems[0].getDescription());
                    that.oCharName.setValue("");
                    that.oCharNo.setValue("");
                    that.oCharValue.setValue("");
                    that.oCharValueNo.setValue("");
                    
                    
             } else if (sId.includes("charName")) {
                
                // that.oCharName = that.byId("idCharname");
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oCharName.setValue(aSelectedItems[0].getTitle());

                that.oCharNo.setValue(aSelectedItems[0].getDescription());

                that.oCharValue.setValue("");
                    that.oCharValueNo.setValue("");
                
                
             } else if (sId.includes("charVal")) {
                
                // that.oCharValue = that.byId("idCharval");
                aSelectedItems = oEvent.getParameter("selectedItems");
                that.oCharValue.setValue(aSelectedItems[0].getTitle());
                that.oCharValueNo.setValue(aSelectedItems[0].getDescription());
                
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
                that.oClassnameList.setModel(that.classnameModel);
                },
                error: function (oData, error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("error");
                },
            });

          },


          onAdd:function(){
              var oRefClassName = that.byId("idClassname").getValue(),
                  oRefCharName = that.byId("idCharname").getValue(),
                  oRefCharVel = that.byId("idCharval").getValue(),
                  oClassName = that.byId("idNClassname").getValue(),
                  oCharName = that.byId("idNCharname").getValue(),
                  oCharVel = that.byId("idNCharval").getValue();

            if(oRefClassName !== "" && oRefCharName !== "" && oRefCharVel !== "" ){
                
                this.oData = {
                    "CLASS_NAME": oClassName,
                    "CLASS_NUM": that.byId("idNClassno").getValue(),
                    "REFCLASS_NAME": oRefClassName,
                    "REFCLASS_NUM": that.byId("idClassno").getValue(),
                    "CHAR_NAME": oCharName,
                    "CHAR_NUM": that.byId("idNCharno").getValue(),
                    "REFCHAR_NAME": oRefCharName,
                    "REFCHAR_NUM": that.byId("idCharno").getValue(),
                    "CHAR_VALUE": oCharVel,
                    "CHARVAL_NUM": that.byId("idNCharvalno").getValue(),
                    "REFCHAR_VALUE": oRefCharVel,
                    "REFCHARVAL_NUM": that.byId("idCharvalno").getValue()
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

                that.byId("idNClassname").setValue("");
                that.byId("idNClassno").setValue("");
                that.byId("idNCharname").setValue("");
                that.byId("idNCharno").setValue("");
                that.byId("idNCharval").setValue("");
                that.byId("idNCharvalno").setValue("");

            } else {
                MessageToast.show("Please select all inputs");
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
         * This function is called when click on save button to create or update the product.
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
                that.createIBPProd();                
                  
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
                        LOCATION_ID: that.byId("idloc").getValue(),
                        REF_PRODID: that.byId("idrefprod").getValue(),
                        CLASS_NUM:aData[i].CLASS_NUM, 
                        REFCLASS_NUM:aData[i].REFCLASS_NUM,           
                        CHAR_NUM:aData[i].CHAR_NUM, 
                        REFCHAR_NUM:aData[i].REFCHAR_NUM,            
                        CHARVAL_NUM:aData[i].CHARVAL_NUM,
                        REFCHARVAL_NUM:aData[i].REFCHARVAL_NUM
                    };
                    oEntry.PRODCHAR.push(vRuleslist);
                }
    
            that.getModel("BModel").callFunction("/maintainNewProdChar", {
                method: "GET",
                urlParameters: {
                    FLAG : 'C',
                    PRODCHAR: JSON.stringify(oEntry.PRODCHAR)
                },
                success: function (oData) {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show("success");
                 // that.onBack();
                },
                error: function (error) {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show("Error");
                //  that.onBack();
                },
              });            
          },
        //   createIBPProd:function(){            
            
        //     sap.ui.core.BusyIndicator.show();
        //     that.getModel("IBPModel").callFunction("/createIBPProduct", {
        //         method: "GET",
        //         urlParameters: {
        //             LOCATION_ID: that.byId("idloc").getValue(),
        //             PRODUCT_ID: that.byId("idProd").getValue()
        //         },
        //         success: function (oData) {
        //           sap.ui.core.BusyIndicator.hide();
        //           sap.m.MessageToast.show("Exported product to IBP");
        //           that.onBack();
        //         },
        //         error: function (error) {
        //           sap.ui.core.BusyIndicator.hide();
        //           sap.m.MessageToast.show("Export product to IBP");
        //           that.onBack();
        //         }
        //       });            
        //   }        
    });
}
);


