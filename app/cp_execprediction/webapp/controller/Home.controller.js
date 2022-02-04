sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "cp/execpred/cpexecprediction/controller/BaseController",
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
      return BaseController.extend(
        "cp.execpred.cpexecprediction.controller.Home",
        {
          onInit: function () {
            this.locModel = new JSONModel();
            this.prodModel = new JSONModel();
            this.odModel = new JSONModel();
            this.ppfModel = new JSONModel();
            this.oODPModel = new JSONModel();
            this.otabModel = new JSONModel();
            this.prodModel.setSizeLimit(5000);
            this.odModel.setSizeLimit(5000);
            this._oCore = sap.ui.getCore();
            if (!this._valueHelpDialogLoc) {
              this._valueHelpDialogLoc = sap.ui.xmlfragment(
                "cp.execpred.cpexecprediction.view.LocDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogLoc);
            }
            if (!this._valueHelpDialogProd) {
              this._valueHelpDialogProd = sap.ui.xmlfragment(
                "cp.execpred.cpexecprediction.view.ProdDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogProd);
            }
            if (!this._valueHelpDialogOD) {
              this._valueHelpDialogOD = sap.ui.xmlfragment(
                "cp.execpred.cpexecprediction.view.ObjDepDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogOD);
            }
            if (!this._valueHelpDialogPPF) {
              this._valueHelpDialogPPF = sap.ui.xmlfragment(
                "cp.execpred.cpexecprediction.view.PredProfileDialog",
                this
              );
              this.getView().addDependent(this._valueHelpDialogPPF);
            }
            this.getRouter()
              .getRoute("Home")
              .attachPatternMatched(this._onPatternMatched.bind(this));
          },
          _onPatternMatched: function () {
              sap.ui.core.BusyIndicator.show();
            that = this;
            this.oPanel = this.byId("idPanel");
          //   this.oPanelod = this.byId("idPanelod");
          //   this.oODTable = this.byId("odlList");
            this.oTable = this.byId("pmdlList");
            this.i18n = this.getResourceBundle();
            this.oGModel = this.getModel("GModel");
            this.oLoc = this.byId("locInput");
            this.oProd = this.byId("prodInput");
            this.oObjDep = this.byId("odInput");
            this.oPredProfile = this.byId("pmInput");
            this.aVcRulesList = [];
            this.oProdList = this._oCore.byId(
              this._valueHelpDialogProd.getId() + "-list"
            );
            this.oLocList = this._oCore.byId(
              this._valueHelpDialogLoc.getId() + "-list"
            );
            this.oODList = this._oCore.byId(
              this._valueHelpDialogOD.getId() + "-list"
            );
            this.oPPFList = this._oCore.byId(
              this._valueHelpDialogPPF.getId() + "-list"
            );
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
          //   this.getModel("BModel").read("/getProdClass ", {
          //     success: function (oData) {
          //         oData.results.unshift({
          //             PRODUCT_ID: "All",
          //             PROD_DESC: "All"
          //         });
          //       that.prodModel.setData(oData);
          //       that.oProdList.setModel(that.prodModel);
          //     },
          //     error: function (oData, error) {
          //       MessageToast.show("error");
          //     },
          //   });
          //   this.getModel("BModel").read("/getBomOdCond", {
          //     success: function (oData) {
          //                 that.objDep = oData.results;
          //         that.odModel.setData(oData);
          //         that.oODList.setModel(that.odModel);
          //     },
          //     error: function (oData, error) {
          //       MessageToast.show("error");
          //     },
          //   });
          //   this.getModel("BModel").callFunction("/get_objdep", {
          //     method: "GET",
          //     urlParameters: {},
          //     success: function (oData) {
          //         that.objDep = oData.results;
          //         // oData.results.unshift({
          //         //     OBJ_DEP: "All",
          //         //     LOCATION_ID:"All",
          //         //     PRODUCT_ID:"All"//"KM_M219VBVS_BVS"
          //         // });
          //       that.odModel.setData(oData);
          //       that.oODList.setModel(that.odModel);
          //     },
          //     error: function (oRes) {
          //       MessageToast.show("error");
          //     },
          //   });
            this.getModel("BModel").read("/getProfiles", {
              success: function (oData) {
                that.ppfModel.setData(oData);
                that.oPPFList.setModel(that.ppfModel);
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
          },
          handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            if (sId.includes("loc")) {
              this._valueHelpDialogLoc.open();
            } else if (sId.includes("prod")) {
              this._valueHelpDialogProd.open();
            } else if (sId.includes("od") || sId.includes("__button1")) {
              
              if (that.oLoc.getValue() && that.oProd.getTokens().length !== 0) {
                  var aSelectedItem = that.oProdList.getSelectedItems();                
  
                  var oFilters = [];
                  var sFilter = new sap.ui.model.Filter({
                      path: "LOCATION_ID",
                      operator: sap.ui.model.FilterOperator.EQ,
                      value1: that.oLocList.getSelectedItem().getTitle()
                  });
                  oFilters.push(sFilter);
  
                  for(var i=0; i < aSelectedItem.length; i++){
  
                  if(aSelectedItem[i].getTitle() !== "All"){                    
                      sFilter = new sap.ui.model.Filter({
                      path: "PRODUCT_ID",
                      operator: sap.ui.model.FilterOperator.EQ,
                      value1: aSelectedItem[i].getTitle()
                      });
                          oFilters.push(sFilter);
              }
                  }
  
  
                  this.getModel("BModel").read("/getBomOdCond", {
                      filters: oFilters,
                      success: function (oData) {
                          that.objDepData = oData.results;
                          if(that.objDepData.length > 0){
                              that.objDepData.unshift({
                                  OBJ_DEP: "All",
                                  LOCATION_ID:"All",
                                  PRODUCT_ID:"All"
                              });
                          }
                          that.odModel.setData(oData);
                          that.oODList.setModel(that.odModel);
              //   //if (this.oODList.getBinding("items")) {
  
              //     // var oDlistItems = sap.ui.getCore().byId("odSlctList").getItems();
              //     var sItems = that.oProdList.getSelectedItems();
              //    // that.objDepData = [];
  
              //       if(that.oProdList.getSelectedItem().getTitle() === "All"){
  
              //             for(var j=0; j<that.objDep.length; j++){
              //                 if(that.objDep[j].LOCATION_ID === that.oLocList.getSelectedItem().getTitle()){
              //                     that.objDepData.push(that.objDep[j]);
              //                 }
  
              //             }                
              //         } else {
              //             // for(var i=0; i<sItems.length; i++){
              //             //     for(var j=0; j<that.objDep.length; j++){
              //             //         if(that.objDep[j].LOCATION_ID === that.oLocList.getSelectedItem().getTitle() && 
              //             //         that.objDep[j].PRODUCT_ID === sItems[i].getTitle()){
              //             //             that.objDepData.push(that.objDep[j]);
              //             //         }
              //             //     }
              //             // }
              //         }   
              // if(that.objDepData.length > 0){
              //     that.objDepData.unshift({
              //         OBJ_DEP: "All",
              //         LOCATION_ID:"All",
              //         PRODUCT_ID:"All"
              //     });
              // }
                      
                  // that.odModel.setData({ results: that.objDepData });
                  // that.oODList.setModel(that.odModel);
                //}
                if(that.oProdList.getSelectedItems()[0].getTitle() === "All"){
  
                    that._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll();
                }
                that._valueHelpDialogOD.open();
                
              },
              error: function (oData, error) {
                MessageToast.show("error");
              },
            });
              } else {
                MessageToast.show(that.i18n.getText("noLocProd"));
              }
            } else {
              this._valueHelpDialogPPF.open();
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
            } else if (sId.includes("od") || sId.includes("__button1")) {
              that._oCore
                .byId(this._valueHelpDialogOD.getId() + "-searchField")
                .setValue("");
              if (that.oODList.getBinding("items")) {
                that.oODList.getBinding("items").filter([]);
              }
            } else {
              that._oCore
                .byId(this._valueHelpDialogPPF.getId() + "-searchField")
                .setValue("");
              if (that.oPPFList.getBinding("items")) {
                that.oPPFList.getBinding("items").filter([]);
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
              // Object Dependency
            } else if (sId.includes("od") ) {
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("LOCATION_ID", FilterOperator.Contains, query),
                      new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                      new Filter("COMPONENT", FilterOperator.Contains, query),
                      new Filter("OBJ_DEP", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.oODList.getBinding("items").filter(oFilters);
              // Save dialog
            } else {
              if (query !== "") {
                oFilters.push(
                  new Filter({
                    filters: [
                      new Filter("PROFILE", FilterOperator.Contains, query),
                      new Filter("METHOD", FilterOperator.Contains, query),
                      new Filter("PRF_DESC", FilterOperator.Contains, query),
                    ],
                    and: false,
                  })
                );
              }
              that.oPPFList.getBinding("items").filter(oFilters);
            }
          },
          handleSelection: function (oEvent) {
            var sId = oEvent.getParameter("id"),
              oItem = oEvent.getParameter("selectedItems"),
              aSelectedItems,
              aODdata = [];
            //Location list
            if (sId.includes("Loc")) {
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oLoc.setValue(aSelectedItems[0].getTitle());
              that.oProd.removeAllTokens();
              that.oObjDep.removeAllTokens();
              this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
              this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
              this.getModel("BModel").read("/getProdClass", {
                  filters: [
                      new Filter("LOCATION_ID", FilterOperator.EQ, aSelectedItems[0].getTitle())
                    ],
                  success: function (oData) {
                      if(oData.results.length > 0){
                      oData.results.unshift({
                          PRODUCT_ID: "All",
                          PROD_DESC: "All"
                      });
                  }
                    that.prodModel.setData(oData);
                    that.oProdList.setModel(that.prodModel);
                  },
                  error: function (oData, error) {
                    MessageToast.show("error");
                  },
                });
  
              // Prod list
            } else if (sId.includes("prod")) {
              that.oProdList.getBinding("items").filter([]);
              that.oObjDep.removeAllTokens();
              this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
              aSelectedItems = oEvent.getParameter("selectedItems");
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
              //that.addToken("Prod", that.oProdList.getSelectedItems(), that.generateSideGangList);
              // Object ependency
            } else if (sId.includes("od")) {
              that.oODList.getBinding("items").filter([]);
              // that.oODTable.setModel(that.oODPModel);
  
              aSelectedItems = oEvent.getParameter("selectedItems");
              
              if (aSelectedItems && aSelectedItems.length > 0) {
                  if(aSelectedItems[0].getTitle() === "All"){
                      that.byId("idCheck").setSelected(true);
                  } else {
                      that.byId("idCheck").setSelected(false);
                  }
                that.oObjDep.removeAllTokens();
                aSelectedItems.forEach(function (oItem) {
                  // aODdata.push({GroupID : oItem.getTitle(),
                  //               PROFILE : oItem.getInfo()
                  //                 });
                  that.oObjDep.addToken(
                    new sap.m.Token({
                      key: oItem.getTitle(),
                      text: oItem.getTitle(),
                    })
                  );
                });
              //   this.oODPModel.setData({
              //     results: aODdata,
              //   });
              //   that.oPanelod.setProperty("visible", true);
              //   that.oPanelod.setProperty("expandable", true);
              }else {
                  that.oObjDep.removeAllTokens();
                
                      that.byId("idCheck").setSelected(false);
           
              }
            } else {
              that.oPPFList.getBinding("items").filter([]);
              aSelectedItems = oEvent.getParameter("selectedItems");
              that.oPredProfile.removeAllTokens();
              if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                  that.oPredProfile.addToken(
                    new sap.m.Token({
                      key: oItem.getTitle(),
                      text: oItem.getTitle(),
                    })
                  );
                });
              }
            }
            that.handleClose(oEvent);
          },
          handleTokenUpdate: function (oEvent) {
            var sId = oEvent.getSource().getId(),
              oRTokens = oEvent.getParameter("removedTokens"),
              sRemovedTokenTitle,
              aItems,
              i;
            if (oRTokens) {
              sRemovedTokenTitle = oRTokens[0].getProperty("key");
            } else {
              sRemovedTokenTitle = oEvent.getParameter("item").getName();
            }
            //Prod list
            if (sId.includes("prod")) {
              aItems = that.oProdList.getSelectedItems();
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() === sRemovedTokenTitle) {
                  aItems[i].setSelected(false);
                }
              }
            } else if (sId.includes("od")) {
              aItems = that.oProdList.getSelectedItems();
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() === sRemovedTokenTitle) {
                  aItems[i].setSelected(false);
                  // that.oODList.removeitem(aItem[i]);
                }
              }
            } else if (sId.includes("pmInput")) {
              aItems = that.oProdList.getSelectedItems();
              for (i = 0; i < aItems.length; i++) {
                if (aItems[i].getTitle() === sRemovedTokenTitle) {
                  aItems[i].setSelected(false);
                }
              }
            }
          },
  
  
          onRun2: function(){
              var selected = that.byId("idCheck").getSelected();
              var text = "Do you want to override assignments?";
              if(selected === true){
                  sap.m.MessageBox.show(
                      text, {
      
                          title: "Confirmation",
                          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                          onClose: function (oAction) {
                              if (oAction === sap.m.MessageBox.Action.YES) {
                                  that.onRunSend();
                              }
      
                          }
                      }
                  );
              } else {
                  that.onRunSend();
              }
          },
          onRunSend: function () {
            this.oModel = this.getModel("PModel");
            var aItems, prodItems, predProfile, selected,
              i,
              regData = [],
              vFlag;
              var oEntry = {
                  vcRulesList: [],
                },
                vRuleslist;
            aItems = this.oODList.getSelectedItems();
            prodItems = this.oProdList.getSelectedItems(),
            predProfile= that.oPredProfile.getTokens()[0].getText(),
            selected = that.byId("idCheck").getSelected();
  
            
            if (this.oObjDep.getTokens().length > 0 && this.oPredProfile.getTokens().length > 0 ){
  
              if(aItems[0].getTitle() === "All" && prodItems[0].getTitle() === "All"){
                  var oEntry = {
                      vcRulesList: [],
                    },
                    vRuleslist;
                  vRuleslist = {
                    profile: predProfile,
                    override: true,
                    Location: aItems[1].getInfo(),
                    Product: "All",
                    GroupID: "All",
                  };
                  oEntry.vcRulesList.push(vRuleslist);
  
              var uri = "/v2/pal/generatePredictions";
                $.ajax({
                  url: uri,
                  type: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({
                    vcRulesList: oEntry.vcRulesList,
                  }),
                  dataType: "json",
                  async: false,
                  timeout: 0,
                  error: function (data) {
                    sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                  },
                  success: function (data) {
                    sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
                    regData.push(data.d.values[0].vcRulesList);
  
                    that.otabModel.setData({
                      results: regData[0],
                    });
                    that.byId("pmdlList").setModel(that.otabModel);
                    that.oPanel.setProperty("visible", true);
                    vFlag = 'X';
                  },
                });
  
              } else {
              for (i = 0; i < aItems.length; i++) {
                  if(aItems[i].getTitle() !== "All"){
  
                  
                
                vRuleslist = {
                  profile: predProfile,
                  override: selected,
                  Location: aItems[i].getInfo(),
                  Product: aItems[i].getDescription(),
                  GroupID: aItems[i].getTitle(),
                };
                oEntry.vcRulesList.push(vRuleslist);
  
              }
          }
        //   this.oModel.create("/generatePredictions", JSON.stringify(oEntry.vcRulesList), {
        //         success: function (oData) {
        //         sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
        //         regData.push(data.d.values[0].vcRulesList);

        //         that.otabModel.setData({
        //           results: regData[0],
        //         });
        //         that.byId("pmdlList").setModel(that.otabModel);
        //         that.oPanel.setProperty("visible", true);
        //         vFlag = 'X';            
        //         },
        //         error: function (oError) {
        //           sap.m.MessageToast.show("error");
        //         }
        //     });
                var uri = "/v2/pal/generatePredictions";
               
                $.ajax({
                  url: uri,
                  type: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({
                    vcRulesList: oEntry.vcRulesList,
                  }),
                  dataType: "json",
                  async: false,
                  timeout: 0,
                  error: function (data) {
                    sap.m.MessageToast.show(that.i18n.getText("genPredErr"));
                  },
                  success: function (data) {
                    sap.m.MessageToast.show(that.i18n.getText("genPredSuccess"));
                    regData.push(data.d.values[0].vcRulesList);
  
                    that.otabModel.setData({
                      results: regData[0],
                    });
                    that.byId("pmdlList").setModel(that.otabModel);
                    that.oPanel.setProperty("visible", true);
                    vFlag = 'X';
                  },
                });
          
          }
              if(vFlag === 'X'){
              that.resetInputs();
              }
            } else {
              MessageToast.show(that.i18n.getText("errInput"));
            }
          },
          resetInputs: function(){
              this.oLoc.setValue("");
              this.oObjDep.destroyTokens();
              this.oLocList.removeSelections();
              this.oODList.removeSelections();
              this.oPredProfile.destroyTokens();
              this.oPPFList.removeSelections();
              this.oProd.destroyTokens();
              this.oProdList.removeSelections();
          },
          
          onRun: function () {
              this.oModel = this.getModel("PModel");
              var oEntry = [];
              var vVcRulesList = {
                vcRulesList: [],
              };
              var vruleslist = {
                Location: "FR10",
                Product: "KM_M219VBVS_BVS",
                GroupID: "M219VV00105NN_1",
              };
              vVcRulesList.vcRulesList.push(vruleslist);
              /******************          */
              var uri = "v2/pal/generatePredictions";
              $.ajax({
                url: uri,
                type: "post",
                contentType: "application/json",
                data: JSON.stringify({
                  vcRulesList: vVcRulesList.vcRulesList,
                }),
                dataType: "json",
                async: false,
                timeout: 0,
                error: function (data) {
                  sap.m.MessageToast.show(JSON.stringify(data));
                },
                success: function (data) {
                  sap.m.MessageToast.show("Generated Regression Models");
                },
              });
              /************************** */
              /*this.oModel.create("/generateRegModels", vVcRulesList, {
                success: function (oData) {
                  MessageToast.show("Generated regression model");              
                },
                error: function (oError) {
                  MessageToast.show("error");
                },
              });*/
              //   this.oModel.create("/generatePredictions", vVcRulesList, {
              //     success: function (oData) {
              //       MessageToast.show("success");
              //     },
              //     error: function (oError) {
              //       MessageToast.show("error");
              //     },
              //   });
              // oModel.read("/generateRegModels",{
              //     filters: oEntry,
              //     success: function (oData) {
              //         MessageToast.show("success");
              // 	},
              // 	error: function (oError) {
              // 		MessageToast.show("error");
              // 	}
              // }
              // );
              //oModel.setUseBatch(true);
              // oModel.createEntry("/generateRegModels", {
              //     properties: oEntry
              // });
              // oModel.submitChanges({
              // 	success: function (oData) {
              // 		// MessageToast.show(that.i18n.getText("saveSessTabsSuc"));
              // 	},
              // 	error: function (oError) {
              // 		MessageToast.show("error");
              // 	}
              // });
            },
  
            handleProdChange:function(oEvent){
                var selected = oEvent.getParameter("listItem").getTitle();
                var items = sap.ui.getCore().byId("prodSlctList").getItems();
                var selItems = this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();
                  if(selected === "All" && oEvent.getParameter("selected") && items.length !== 1){
                      this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
                  } else if(selected === "All" && !oEvent.getParameter("selected")){
                      this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
                  } else if(selected === "All" && items.length === 1 ){
                      sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false);
                  } else if(selected !== "All" && !oEvent.getParameter("selected") && items.length - 1 === selItems.length){
                      sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(false);
                  } else if(selected !== "All" && oEvent.getParameter("selected") && items.length - 1 === selItems.length){
                      sap.ui.getCore().byId("prodSlctList").getItems()[0].setSelected(true);
                  }
  
  
            },
  
            handleObjDepChange:function(oEvent){
              var selected = oEvent.getParameter("listItem").getTitle();
              var items = sap.ui.getCore().byId("odSlctList").getItems();
              var selItems = this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].getSelectedItems();
                if(selected === "All" && oEvent.getParameter("selected") && items.length !== 1){
                    this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].selectAll();
                } else if(selected === "All" && !oEvent.getParameter("selected")){
                    this._valueHelpDialogOD.getAggregation("_dialog").getContent()[1].removeSelections();
                } else if(selected !== "All" && !oEvent.getParameter("selected") && items.length - 1 === selItems.length){
                    sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false);
              }  else if(selected !== "All" && oEvent.getParameter("selected") && items.length -1 === selItems.length){
                  sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(true);
              } else if(selected === "All" && items.length === 1 ){ 
                  sap.ui.getCore().byId("odSlctList").getItems()[0].setSelected(false);
              }
  
  
          }
        }
      );
    }
  );
  