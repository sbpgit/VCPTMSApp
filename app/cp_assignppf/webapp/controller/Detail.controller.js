sap.ui.define(
    [
      "cp/appf/cpassignppf/controller/BaseController",
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
  
      return BaseController.extend("cp.appf.cpassignppf.controller.Detail", {
        onInit: function () {
          that = this;
          that.oListModel = new JSONModel();
          that.oParamModel = new JSONModel();
          that.oAlgoListModel = new JSONModel();
        },
        onBack:function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);
        },
        onAfterRendering: function () {
          that = this;
          that.oGModel =  that.getModel("oGModel");

        if(that.oGModel.getProperty("/sId") === "Copy"){
            // that.byId("idPn").setValue(that.oGModel.getProperty("/sProfile"));
            that.byId("idPn").setValue("");
          that.byId("idPdesc").setValue(that.oGModel.getProperty("/sProf_desc"));
          that.byId("idCretBy").setValue("");
          that.byId("idAuth").setValue("");

          var methodText =that.oGModel.getProperty("/sMethod")

          if (methodText === "MLR") {
            that.byId("idAlgo").setSelectedKey("M");
          } else if (methodText === "HGBT") {
            that.byId("idAlgo").setSelectedKey("H");
          } else if (methodText === "VARMA") {
            that.byId("idAlgo").setSelectedKey("V");
          } else {
            that.byId("idAlgo").setSelectedKey("N");
          }
          that.onAlgorChange();


        } else {
          that.byId("idPn").setValue("");
          that.byId("idPdesc").setValue("");
          that.byId("idCretBy").setValue("");
          that.byId("idAuth").setValue("");
          that.byId("idAlgo").setSelectedKey("N");
        }

        },
    //     getData: function () {
    //     //   this.getModel("BModel").read("/getProfiles", {
    //     //     success: function (oData) {
    //     //       that.oListModel.setData({
    //     //         results: oData.results,
    //     //       });
    //     //       that.oList.setModel(that.oListModel);
    //     //     },
    //     //     error: function () {
    //     //       MessageToast.show("Failed to get profiles");
    //     //     },
    //     //   });
    //     },
  
        onAlgorChange: function (oEvent) {
          var selAlgo = that.byId("idAlgo")._getSelectedItemText();
          that.alogoList = that.byId("idTab");
  
          var oFilters = new Filter("METHOD", FilterOperator.EQ, selAlgo);
  
          this.getModel("PModel").read("/get_palparameters", {
              filters: [oFilters],
  
            success: function (oData) {
  
              oData.results.forEach(function (row) {
                  row.FLAG = row.DATATYPE;
  
              }, that);
  
              that.oAlgoListModel.setData({
                results: oData.results,
              });
              that.alogoList.setModel(that.oAlgoListModel);
            },
            error: function () {
              MessageToast.show("Failed to get data");
            },
          });
        },
  
      //   onLive:function(oEvent){
      //     var Query = oEvent.getParameter("newValue"),
      //         selId = oEvent.getParameter("id").split("-")[2];
      //         var SelType = that.byId("idTab").getItems()[selId].getCells()[1].getSelectedKey(),
      //             count = 0;
      //         var letters = /^[A-Za-z0-9]+$/; 
              
      //         var digit = /^[0-9]+$/;    
      //         var specials=/^[^*!#%^=+?|\":<>[\]{}!`\\()';@&$]+$/;
  
      //         if(specials.test(Query)  || Query === ""){
  
              
      //         if(Query % 1 === 0 && parseInt(Query).toString() === Query.toString() ){
      //             that.byId("idTab").getItems()[selId].getCells()[5].setText("INTEGER");
      //             that.byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
      //             count = 0;
      //         } else if(letters.test(Query) && specials.test(Query) ){
      //             that.byId("idTab").getItems()[selId].getCells()[5].setText("NVARCHAR");
      //             that.byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
      //             count = 0;
      //         } else if(Query === "") {
      //             that.byId("idTab").getItems()[selId].getCells()[5].setText(SelType);
      //             that.byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
      //             count = 0;
      //         } else if(Query.includes(".") && Query.split(".")[1] !== ""){
      //             // var alphabets = /^[A-Za-z]+$/;
      //             if(digit.test(Query.split(".")[0]) && digit.test(Query.split(".")[1])){
      //                 that.byId("idTab").getItems()[selId].getCells()[5].setText("DOUBLE");
      //                 that.byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
      //                 count = 0;
      //             } else {
      //                 that.byId("idTab").getItems()[selId].getCells()[5].setText("NVARCHAR");
      //                 that.byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
      //                 count = 0;                
      //             }
      //         } else {
      //             that.byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
      //             count = 1;
      //         }
  
  
      //     } else {
      //         that.byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
      //         count = 1;
      //     }
  
      //     if(Query.includes("-")){
      //         that.byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
      //         count = 1;
      //     }
  
      //         if(count === 0){
      //             that.byId("idSave").setEnabled(true);
      //         } else {
      //             that.byId("idSave").setEnabled(false);
      //         }
  
      //   },
  
      //   onTypeChange:function(oEvent){
      //     that.typeChange = oEvent.getParameter("id").split("-")[2];
      //         that.onLive();
      //   },
  
        onLive:function(oEvent){
          that.byId("idSave").setEnabled(true);
            if(oEvent){
              var Query = oEvent.getParameter("newValue"),
              selId = oEvent.getParameter("id").split("-")[6];
            } else {
              var selId = that.typeChange;
                  Query = that.byId("idTab").getItems()[selId].getCells()[4].getValue();
              }
              var SelType = that.byId("idTab").getItems()[selId].getCells()[2].getSelectedKey(),
                  count = 0;
                  var specials=/^[^*|\":<>[\]{}!`\\()';@&$]+$/;
                  if(SelType === "DOUBLE"){
                      that.byId("idTab").getItems()[selId].getCells()[4].setType("Number");
                  }
  
              if(SelType === "INTEGER"){
                  if(Query % 1 === 0 && parseInt(Query).toString() === Query.toString() || Query === ""){
                      that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
                      count = 0;
                  } else {
                      that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
                      count = count + 1;
                  }
              } else if(SelType === "NVARCHAR"){
                  var letters = /^[A-Za-z0-9]+$/;
          if(letters.test(Query) && specials.test(Query) || Query === ""){
          
                  that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
                  count = 0;
              } else {
                  that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
                  count = count + 1;
              }
  
              } else if(SelType === "DOUBLE"){
                      if(!/^\d+$/.test(Query) &&  Query !== ""){
                          if(Query.split(".")[1] !== "" && Query !== "."){
                              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
                              count = 0;
                          } else {
                              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
                              count = count + 1;
                          }                        
                          } else {
                              if(Query === ""){
                                  that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
                                  count = 0;
                              } else{
                              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
                              count = count + 1;
                              }
                          }                
              }
              if(count === 0){
                  that.byId("idSave").setEnabled(true);
              } else {
                  that.byId("idSave").setEnabled(false);
              }
        },
  
        onSubmit: function (oEvent) {
          sap.ui.core.BusyIndicator.show();
          var oEntry={};
  
          oEntry.PROFILE = that.byId("idPn").getValue();
          oEntry.PRF_DESC = that.byId("idPdesc").getValue();
          oEntry.CREATED_BY = that.byId("idCretBy").getValue();
          // oEntry.AUTHORIZATION = that.byId("auth").getValue();
          oEntry.METHOD = that.byId("idAlgo")._getSelectedItemText();
          oEntry.CREATED_DATE = "2022-01-13";
  
          if(oEntry.PROFILE !== "" && oEntry.PRF_DESC !== "" && oEntry.METHOD !== "" ){
              
            var uri = "/v2/catalog/getProfiles";
            $.ajax({
              url: uri,
              type: "post",
              contentType: "application/json",
              data: JSON.stringify({
                PROFILE: oEntry.PROFILE,
                METHOD: oEntry.METHOD,
                PRF_DESC: oEntry.PRF_DESC,
                // CREATED_DATE:"2022-01-14",
                CREATED_BY: oEntry.CREATED_BY,
              }),
              dataType: "json",
              async: false,
              timeout: 0,
              error: function (data) {
                sap.m.MessageToast.show(JSON.stringify(data));
              },
              success: function (data) {
                        sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Created Prediction Model");
                that.tablesendbatch();
              },

            }); 
      } else {
          MessageToast.show("Please fill all required fields");
                  sap.ui.core.BusyIndicator.hide();
      }
  
        },
  
    //   //   tablesendbatch:function(oEvent){
    //   //     var table = that.byId("idTab").getItems();
    //   //     // var oTabEntry={},
    //   //     // PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL, DOUBLEVAL, STRVAL;
    //   //     that.getModel("BModel").setUseBatch(true);
    //   // 			that.batchReq = true;
          
  
    //   //     for (var i = 0; i < table.length; i++) {
    //   //         var PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL ="", DOUBLEVAL ="", STRVAL ="";
    //   //         PROFILE = that.byId("idPn").getValue();
    //   //         METHOD = that.byId("idAlgo")._getSelectedItemText();
    //   //         CREATED_BY = that.byId("idCretBy").getValue();
    //   //         PARA_NAME = table[i].getCells()[0].getText();
              
    //   //         if(that.byId("idDatatype").getValue() === ""){
    //   //             if(table[i].getCells()[1].getSelectedKey() === "INTEGER"){
    //   //                 INTVAL = table[i].getCells()[2].getText();
    //   //             } else if(table[i].getCells()[1].getSelectedKey() === "DOUBLE"){
    //   //                 DOUBLEVAL = table[i].getCells()[2].getText();
    //   //             } else if(table[i].getCells()[1].getSelectedKey() === "NVARCHAR"){
    //   //                 STRVAL = table[i].getCells()[2].getText();
    //   //             }
  
    //   //         } else {
    //   //             if(table[i].getCells()[5].getSelectedKey() === "INTEGER"){
    //   //                 INTVAL = table[i].getCells()[3].getValue();
    //   //             } else if(table[i].getCells()[1].getSelectedKey() === "DOUBLE"){
    //   //                 DOUBLEVAL = table[i].getCells()[3].getValue();
    //   //             } else if(table[i].getCells()[1].getSelectedKey() === "NVARCHAR"){
    //   //                 STRVAL = table[i].getCells()[3].getValue();
    //   //             }
    //   //         }
  
              
    //   //         // that.getModel("BModel").createEntry("/getProfileParameters", {
    //   //         //         properties: {
    //   //         //             Value: sImage,
    //   //         //             Field1: sField1,
    //   //         //             Filename: sFname,
    //   //         //             Project: oGModel.getProperty("/projectNo"),
    //   //         //             EnerfabRef: enerRef
    //   //         //         }
    //   //         //     });
              
    //   //     }
  
    //   //     // if (that.batchReq) {
    //   //     //     that.batchReq = false;
    //   //     //     oModel.submitChanges({
    //   //     //         success: function (oData, oResponse) {
    //   //     //             sap.ui.core.BusyIndicator.hide();
    //   //     //             MessageToast.show(oData.__batchResponses[0].__changeResponses[0].data.Message);               
    //   //     //         },
    //   //     //         error: function (oResponse) {
    //   //     //             sap.ui.core.BusyIndicator.hide();
    //   //     //             MessageToast.show("Failed to create entries");
  
    //   //     //         }
    //   //     //     });
    //   //     // }
    //   //   }
  
    tablesendbatch:function(oEvent){
          var table = that.byId("idTab").getItems(),
          aData = [];
          // var oTabEntry={},
          // PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL, DOUBLEVAL, STRVAL;
          that.getModel("BModel").setUseBatch(true);
                  that.batchReq = true;
                  that.count = table.length;
                  that.comp = 0;
          
                  sap.ui.core.BusyIndicator.show();
          for (var i = 0; i < table.length; i++) {
              var PROFILE, METHOD, CREATED_BY, PARA_NAME, PARA_DESC, INTVAL="" , DOUBLEVAL="", STRVAL="" ;
              PROFILE = that.byId("idPn").getValue();
              METHOD = that.byId("idAlgo")._getSelectedItemText();
              CREATED_BY = that.byId("idCretBy").getValue();
              PARA_NAME = table[i].getCells()[0].getText();
              PARA_DESC= table[i].getCells()[1].getText();
              
              if(table[i].getCells()[2].getSelectedKey() === "INTEGER"){
                  if(table[i].getCells()[4].getValue() === ""){
                      INTVAL = table[i].getCells()[3].getText();
                  } else {
                      INTVAL = table[i].getCells()[4].getValue();
                  }
  
              } else if(table[i].getCells()[2].getSelectedKey() === "DOUBLE"){
                  if(table[i].getCells()[4].getValue() === ""){
                      DOUBLEVAL = table[i].getCells()[3].getText();
                  } else {
                      DOUBLEVAL = table[i].getCells()[4].getValue();
                  }
  
              } else if(table[i].getCells()[2].getSelectedKey() === "DOUBLE"){
                  if(table[i].getCells()[4].getValue() === ""){
                      STRVAL = table[i].getCells()[3].getText();
                  } else {
                      STRVAL = table[i].getCells()[4].getValue();
                  }
  
              }

              aData.push({
                    "PROFILE": PROFILE,
                    "METHOD": METHOD,
                    "CREATED_BY": CREATED_BY,
                    "PARA_NAME": PARA_NAME,
                    "PARA_DESC": PARA_DESC,
                    "INTVAL": INTVAL,
                    "DOUBLEVAL": DOUBLEVAL,
                    "STRVAL" : STRVAL
            });
              
            //   that.getModel("BModel").createEntry("/getProfileParameters", {
            //           properties: {
            //               PROFILE: PROFILE,
            //               METHOD: METHOD,
            //               CREATED_BY: CREATED_BY,
            //               PARA_NAME: PARA_NAME,
            //               PARA_DESC: PARA_DESC,
            //               INTVAL: INTVAL,
            //               DOUBLEVAL: DOUBLEVAL,
            //               STRVAL : STRVAL
            //           }
            //       });
              
          

          var uri = "/v2/catalog/getProfileParameters";
            $.ajax({
              url: uri,
              type: "post",
              contentType: "application/json",
              data: JSON.stringify({
                    PROFILE: PROFILE,
                    METHOD: METHOD,
                    CREATED_BY: CREATED_BY,
                    PARA_NAME: PARA_NAME,
                    PARA_DESC: PARA_DESC,
                    PARA_DEP : PARA_DESC,
                    INTVAL: INTVAL,
                    DOUBLEVAL: DOUBLEVAL,
                    STRVAL : STRVAL,
                    CREATED_DATE:"2022-01-14"
            }),
              dataType: "json",
              async: false,
              timeout: 0,
              error: function (data) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show(JSON.stringify(data));
              },
              success: function (data) {
                        
                        if(that.count === that.comp){
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Created profile parameters");
                            
                        } else {
                            that.comp = that.comp + 1;
                        }
                
              },

            }); 
        }
  
        //   if (that.batchReq) {
        //       that.batchReq = false;
        //       that.getModel("BModel").submitChanges({
        //           success: function (oData, oResponse) {
        //               sap.ui.core.BusyIndicator.hide();
        //               MessageToast.show("success to create entries");               
        //           },
        //           error: function (oResponse) {
        //               sap.ui.core.BusyIndicator.hide();
        //               MessageToast.show("Failed to create entries");
  
        //           }
        //       });
        //   }
        }
  
  
  
  
  
      });
    }
  );
  