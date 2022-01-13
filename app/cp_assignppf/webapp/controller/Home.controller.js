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

    return BaseController.extend("cp.appf.cpassignppf.controller.Home", {
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
        that.oParamModel = new JSONModel();
        that.oAlgoListModel = new JSONModel();
      },
      onAfterRendering: function () {
        that = this;
        // oGModel = this.getModel("oGModel");
        // this.i18n = this.getResourceBundle();
        that.oList = this.byId("profList");
        that.oList.removeSelections();
        if (that.oList.getBinding("items")) {
          that.oList.getBinding("items").filter([]);
        }
        // Calling function
        this.getData();
      },
      getData: function () {
        this.getModel("BModel").read("/getProfiles", {
          success: function (oData) {
            that.oListModel.setData({
              results: oData.results,
            });
            that.oList.setModel(that.oListModel);
          },
          error: function () {
            MessageToast.show("Failed to get profiles");
          },
        });
      },

      onParameters: function (oEvent) {
        var selProfie = oEvent.getSource().getParent().getCells()[0].getTitle();
        var selMethod = oEvent.getSource().getParent().getCells()[1].getText();

        var Title = "Parameters " + " " + " - " + selProfie + " " + " - " + selMethod;
 
        if (!that._onParameter) {
          that._onParameter = sap.ui.xmlfragment(
            "cp.appf.cpassignppf.view.Parameter",
            that
          );
          that.getView().addDependent(that._onParameter);
        }
        that._onParameter.setTitleAlignment("Center");
        that._onParameter.setTitle(Title);
        that.paramList = sap.ui.getCore().byId("idParam");

        this.getModel("BModel").read("/getProfileParameters", {
          //   filters: [oFilters],
          filters: [
            new Filter("PROFILE", FilterOperator.EQ, selProfie),
            new Filter("METHOD", FilterOperator.EQ, selMethod)
          ],
          success: function (oData) {
            that.oParamModel.setData({
              results: oData.results,
            });
            that.paramList.setModel(that.oParamModel);
            that._onParameter.open();
          },
          error: function () {
            MessageToast.show("Failed to get data");
          },
        });
      },
      onParaClose: function () {
        that._onParameter.close();
        //   that._onParameter.destroy(true);
        //   that._onParameter = "";
      },

      onPpfAdd: function (oEvent) {
        if (!that._onAddppf) {
          that._onAddppf = sap.ui.xmlfragment(
            "cp.appf.cpassignppf.view.Create",
            that
          );
          that.getView().addDependent(that._onAddppf);
        }
        that._onAddppf.setTitleAlignment("Center");
        var selId = oEvent.getSource().getTooltip();

        //   var oUserModel = new JSONModel("/services/userapi/attributes");
        // oUserModel.attachRequestCompleted(function () {
        // 	that.username = oUserModel.getData().login_name.toUpperCase();

        // });

        if (selId === "Add") {
          sap.ui.getCore().byId("idPn").setValue("");
          sap.ui.getCore().byId("idPdesc").setValue("");
          sap.ui.getCore().byId("idCretBy").setValue("");
          sap.ui.getCore().byId("idAuth").setValue("");
          sap.ui.getCore().byId("idAlgo").setSelectedKey("N");
          sap.ui.getCore().byId("idTab").destroyItems();
          that._onAddppf.open();
        } else if (selId === "Copy") {
          var selRow = this.byId("profList").getSelectedItems();

          if (selRow.length) {
            var selAlgo = selRow[0].getBindingContext().getProperty();
            sap.ui.getCore().byId("idPn").setValue(selAlgo.PROFILE);
            sap.ui.getCore().byId("idPdesc").setValue(selAlgo.PRF_DESC);
            sap.ui.getCore().byId("idCretBy").setValue("");
            sap.ui.getCore().byId("idAuth").setValue("");
            if (selAlgo.METHOD === "MLR") {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("M");
            } else if (selAlgo.METHOD === "HGBT") {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("H");
            } else if (selAlgo.METHOD === "VARMA") {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("V");
            } else {
              sap.ui.getCore().byId("idAlgo").setSelectedKey("N");
            }
            that.onAlgorChange();
            that._onAddppf.setTitle("Copy");
            that._onAddppf.open();
          } else {
            MessageToast.show("Please Select one row to change");
          }
        }
      },
      onAddClose: function () {
        that._onAddppf.close();
        //   that._onAddppf.destroy(true);
        //   that._onAddppf = "";
      },
      onAlgorChange: function (oEvent) {
        var selAlgo = sap.ui.getCore().byId("idAlgo")._getSelectedItemText();
        that.alogoList = sap.ui.getCore().byId("idTab");

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
    //         var SelType = sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[1].getSelectedKey(),
    //             count = 0;
    //         var letters = /^[A-Za-z0-9]+$/; 
            
    //         var digit = /^[0-9]+$/;    
    //         var specials=/^[^*!#%^=+?|\":<>[\]{}!`\\()';@&$]+$/;

    //         if(specials.test(Query)  || Query === ""){

            
    //         if(Query % 1 === 0 && parseInt(Query).toString() === Query.toString() ){
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[5].setText("INTEGER");
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
    //             count = 0;
    //         } else if(letters.test(Query) && specials.test(Query) ){
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[5].setText("NVARCHAR");
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
    //             count = 0;
    //         } else if(Query === "") {
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[5].setText(SelType);
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
    //             count = 0;
    //         } else if(Query.includes(".") && Query.split(".")[1] !== ""){
    //             // var alphabets = /^[A-Za-z]+$/;
    //             if(digit.test(Query.split(".")[0]) && digit.test(Query.split(".")[1])){
    //                 sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[5].setText("DOUBLE");
    //                 sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
    //                 count = 0;
    //             } else {
    //                 sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[5].setText("NVARCHAR");
    //                 sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
    //                 count = 0;                
    //             }
    //         } else {
    //             sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
    //             count = 1;
    //         }


    //     } else {
    //         sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
    //         count = 1;
    //     }

    //     if(Query.includes("-")){
    //         sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
    //         count = 1;
    //     }

    //         if(count === 0){
    //             sap.ui.getCore().byId("idSave").setEnabled(true);
    //         } else {
    //             sap.ui.getCore().byId("idSave").setEnabled(false);
    //         }

    //   },

    //   onTypeChange:function(oEvent){
    //     that.typeChange = oEvent.getParameter("id").split("-")[2];
    //         that.onLive();
    //   },

      onLive:function(oEvent){
        sap.ui.getCore().byId("idSave").setEnabled(true);
          if(oEvent){
            var Query = oEvent.getParameter("newValue"),
            selId = oEvent.getParameter("id").split("-")[2];
          } else {
            var selId = that.typeChange;
                Query = sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].getValue();
            }
            var SelType = sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[1].getSelectedKey(),
                count = 0;
                var specials=/^[^*|\":<>[\]{}!`\\()';@&$]+$/;
                if(SelType === "DOUBLE"){
                    sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setType("Number");
                }

            if(SelType === "INTEGER"){
                if(Query % 1 === 0 && parseInt(Query).toString() === Query.toString() || Query === ""){
                    sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
                    count = 0;
                } else {
                    sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
                    count = count + 1;
                }
            } else if(SelType === "NVARCHAR"){
                var letters = /^[A-Za-z0-9]+$/;
        if(letters.test(Query) && specials.test(Query) || Query === ""){
        
                sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
                count = 0;
            } else {
                sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
                count = count + 1;
            }

            } else if(SelType === "DOUBLE"){
                    if(!/^\d+$/.test(Query) &&  Query !== ""){
                        if(Query.split(".")[1] !== "" && Query !== "."){
                            sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
                            count = 0;
                        } else {
                            sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
                            count = count + 1;
                        }                        
                        } else {
                            if(Query === ""){
                                sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("None");
                                count = 0;
                            } else{
                            sap.ui.getCore().byId("idTab").getItems()[selId].getCells()[3].setValueState("Error");
                            count = count + 1;
                            }
                        }                
            }
            if(count === 0){
                sap.ui.getCore().byId("idSave").setEnabled(true);
            } else {
                sap.ui.getCore().byId("idSave").setEnabled(false);
            }
      },

      onSubmit: function (oEvent) {
        sap.ui.core.BusyIndicator.show();
        var oEntry={};

        oEntry.PROFILE = sap.ui.getCore().byId("idPn").getValue();
        oEntry.PRF_DESC = sap.ui.getCore().byId("idPdesc").getValue();
        oEntry.CREATED_BY = sap.ui.getCore().byId("idCretBy").getValue();
        // oEntry.AUTHORIZATION = sap.ui.getCore().byId("auth").getValue();
        oEntry.METHOD = sap.ui.getCore().byId("idAlgo")._getSelectedItemText();
        oEntry.CREATED_DATE = "2022-01-13";

        if(oEntry.PROFILE !== "" && oEntry.PRF_DESC !== "" && oEntry.METHOD !== "" ){
            
        
        this.getModel("BModel").create("/getProfiles", oEntry, {
            success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("created");
            sap.ui.core.BusyIndicator.hide();
            that.tablesendbatch();
            },
            error: function (oData) {
                MessageToast.show("update failed");
                sap.ui.core.BusyIndicator.hide();
            }
        });
    } else {
        MessageToast.show("Please fill all required fields");
                sap.ui.core.BusyIndicator.hide();
    }

      },

    //   tablesendbatch(oEvent){
    //     var table = sap.ui.getCore().byId("idTab").getItems();
    //     // var oTabEntry={},
    //     // PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL, DOUBLEVAL, STRVAL;
    //     that.getModel("BModel").setUseBatch(true);
	// 			that.batchReq = true;
        

    //     for (var i = 0; i < table.length; i++) {
    //         var PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL ="", DOUBLEVAL ="", STRVAL ="";
    //         PROFILE = sap.ui.getCore().byId("idPn").getValue();
    //         METHOD = sap.ui.getCore().byId("idAlgo")._getSelectedItemText();
    //         CREATED_BY = sap.ui.getCore().byId("idCretBy").getValue();
    //         PARA_NAME = table[i].getCells()[0].getText();
            
    //         if(sap.ui.getCore().byId("idDatatype").getValue() === ""){
    //             if(table[i].getCells()[1].getSelectedKey() === "INTEGER"){
    //                 INTVAL = table[i].getCells()[2].getText();
    //             } else if(table[i].getCells()[1].getSelectedKey() === "DOUBLE"){
    //                 DOUBLEVAL = table[i].getCells()[2].getText();
    //             } else if(table[i].getCells()[1].getSelectedKey() === "NVARCHAR"){
    //                 STRVAL = table[i].getCells()[2].getText();
    //             }

    //         } else {
    //             if(table[i].getCells()[5].getSelectedKey() === "INTEGER"){
    //                 INTVAL = table[i].getCells()[3].getValue();
    //             } else if(table[i].getCells()[1].getSelectedKey() === "DOUBLE"){
    //                 DOUBLEVAL = table[i].getCells()[3].getValue();
    //             } else if(table[i].getCells()[1].getSelectedKey() === "NVARCHAR"){
    //                 STRVAL = table[i].getCells()[3].getValue();
    //             }
    //         }

            
    //         // that.getModel("BModel").createEntry("/getProfileParameters", {
    //         //         properties: {
    //         //             Value: sImage,
    //         //             Field1: sField1,
    //         //             Filename: sFname,
    //         //             Project: oGModel.getProperty("/projectNo"),
    //         //             EnerfabRef: enerRef
    //         //         }
    //         //     });
            
    //     }

    //     // if (that.batchReq) {
    //     //     that.batchReq = false;
    //     //     oModel.submitChanges({
    //     //         success: function (oData, oResponse) {
    //     //             sap.ui.core.BusyIndicator.hide();
    //     //             MessageToast.show(oData.__batchResponses[0].__changeResponses[0].data.Message);               
    //     //         },
    //     //         error: function (oResponse) {
    //     //             sap.ui.core.BusyIndicator.hide();
    //     //             MessageToast.show("Failed to create entries");

    //     //         }
    //     //     });
    //     // }
    //   }

      tablesendbatch(oEvent){
        var table = sap.ui.getCore().byId("idTab").getItems();
        // var oTabEntry={},
        // PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL, DOUBLEVAL, STRVAL;
        that.getModel("BModel").setUseBatch(true);
				that.batchReq = true;
        

        for (var i = 0; i < table.length; i++) {
            var PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL , DOUBLEVAL, STRVAL ;
            PROFILE = sap.ui.getCore().byId("idPn").getValue();
            METHOD = sap.ui.getCore().byId("idAlgo")._getSelectedItemText();
            CREATED_BY = sap.ui.getCore().byId("idCretBy").getValue();
            PARA_NAME = table[i].getCells()[0].getText();
            
            if(table[i].getCells()[1].getSelectedKey() === "INTEGER"){
                if(table[i].getCells()[3].getValue() === ""){
                    INTVAL = table[i].getCells()[2].getText();
                } else {
                    INTVAL = table[i].getCells()[3].getValue();
                }

            } else if(table[i].getCells()[1].getSelectedKey() === "DOUBLE"){
                if(table[i].getCells()[3].getValue() === ""){
                    DOUBLEVAL = table[i].getCells()[2].getText();
                } else {
                    DOUBLEVAL = table[i].getCells()[3].getValue();
                }

            } else if(table[i].getCells()[1].getSelectedKey() === "DOUBLE"){
                if(table[i].getCells()[3].getValue() === ""){
                    STRVAL = table[i].getCells()[2].getText();
                } else {
                    STRVAL = table[i].getCells()[3].getValue();
                }

            }
            that.getModel("BModel").createEntry("/getProfileParameters", {
                    properties: {
                        PROFILE: PROFILE,
                        METHOD: METHOD,
                        CREATED_BY: CREATED_BY,
                        PARA_NAME: PARA_NAME,
                        INTVAL: INTVAL,
                        DOUBLEVAL: DOUBLEVAL,
                        STRVAL : STRVAL
                    }
                });
            
        }

        if (that.batchReq) {
            that.batchReq = false;
            that.getModel("BModel").submitChanges({
                success: function (oData, oResponse) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("success to create entries");               
                },
                error: function (oResponse) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to create entries");

                }
            });
        }
      }





    });
  }
);
