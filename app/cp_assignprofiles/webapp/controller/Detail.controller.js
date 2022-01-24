sap.ui.define(
  [
    "cp/appf/cpassignprofiles/controller/BaseController",
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

    return BaseController.extend("cp.appf.cpassignprofiles.controller.Detail", {
      onInit: function () {
        that = this;
        that.oListModel = new JSONModel();
        that.oParamModel = new JSONModel();
        that.oAlgoListModel = new JSONModel();
      },
      onBack: function () {
          var data = [];
        that.oAlgoListModel.setData({
            results: data, 
          });
          that.alogoList.setModel(that.oAlgoListModel);
        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        oRouter.navTo("Home", {}, true);
      },
      onAfterRendering: function () {
        that = this;
        that.oGModel = that.getModel("oGModel");
        var selButton = that.oGModel.getProperty("/sId");

        if (selButton === "Copy" || selButton === "Edit") {
          // that.byId("idPn").setValue(that.oGModel.getProperty("/sProfile"));
          if (selButton === "Edit") {
            that.byId("idPn").setValue(that.oGModel.getProperty("/sProfile"));
            that.byId("idPn").setEditable(false);
            this.byId("idPage").setTitle("Edit Profile");
          } else {
            that.byId("idPn").setValue("");
            that.byId("idPn").setEditable(true);
            this.byId("idPage").setTitle("Create Profile");
          }

          that.byId("idPdesc").setValue(that.oGModel.getProperty("/sProf_desc"));
        //   that.byId("idCretBy").setValue(that.oGModel.getProperty("/sCreatedBy"));
          that.byId("idAuth").setValue("");

          var methodText = that.oGModel.getProperty("/sMethod");

          if (methodText === "MLR") {
            that.byId("idAlgo").setSelectedKey("M");
          } else if (methodText === "HGBT") {
            that.byId("idAlgo").setSelectedKey("H");
          } else if (methodText === "VARMA") {
            that.byId("idAlgo").setSelectedKey("V");
          } else {
            that.byId("idAlgo").setSelectedKey("N");
          }
          // that.onAlgorChange();
          that.getParameters();
        } else {
          that.byId("idPn").setValue("");
          that.byId("idPdesc").setValue("");
        //   that.byId("idCretBy").setValue("");
          that.byId("idAuth").setValue("");
          that.byId("idAlgo").setSelectedKey("N");
          that.byId("idPn").setEditable(true);
          var data = [];
          that.oAlgoListModel.setData({
            results: data,
          });
          that.byId("idTab").setModel(that.oAlgoListModel);
        }
      },
      getParameters: function () {
        var selProfile = that.oGModel.getProperty("/sProfile"),
          selMethod = that.oGModel.getProperty("/sMethod");

        this.getModel("BModel").read("/getProfileParameters", {
          filters: [
            new Filter("PROFILE", FilterOperator.EQ, selProfile),
            new Filter("METHOD", FilterOperator.EQ, selMethod),
          ],
          success: function (oData) {
            that.alogoList = that.byId("idTab");

            oData.results.forEach(function (row) {
                row.DESCRIPTION = row.PARA_DESC
              if (row.INTVAL !== null) {
                row.DATATYPE = "INTEGER";
                row.DEFAULTVAL = row.INTVAL;
              } else if (row.DOUBLEVAL !== null) {
                row.DATATYPE = "DOUBLE";
                row.DEFAULTVAL = row.DOUBLEVAL;
              } else if (row.STRVAL !== null) {
                row.DATATYPE = "NVARCHAR";
                row.DEFAULTVAL = row.STRVAL;
              }
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

      onLive: function (oEvent) {
        that.byId("idSave").setEnabled(true);
        if (oEvent) {
          var Query = oEvent.getParameter("newValue"),
            selId = oEvent.getParameter("id").split("-")[6];
        } else {
          var selId = that.typeChange;
          Query = that.byId("idTab").getItems()[selId].getCells()[4].getValue();
        }
        var SelType = that.byId("idTab").getItems()[selId].getCells()[2].getSelectedKey(),
          count = 0;
        var specials = /^[^*|\":<>[\]{}!`\\()';@&$]+$/;
        if (SelType === "DOUBLE") {
          that.byId("idTab").getItems()[selId].getCells()[4].setType("Number");
        }

        if (SelType === "INTEGER") {
          if ( (Query % 1 === 0 &&  parseInt(Query).toString() === Query.toString()) || Query === "" ) {
            that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
            count = 0;
          } else {
            that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
            count = count + 1;
          }
        } else if (SelType === "NVARCHAR") {
          var letters = /^[A-Za-z0-9 ]+$/;
          if ((letters.test(Query) && specials.test(Query)) || Query === "") {
            that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
            count = 0;
          } else {
            that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
            count = count + 1;
          }
        } else if (SelType === "DOUBLE") {
          if (!/^\d+$/.test(Query) && Query !== "") {
            if (Query.split(".")[1] !== "" && Query !== ".") {
              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
              count = 0;
            } else {
              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
              count = count + 1;
            }
          } else {
            if (Query === "") {
              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("None");
              count = 0;
            } else {
              that.byId("idTab").getItems()[selId].getCells()[4].setValueState("Error");
              count = count + 1;
            }
          }
        }
        if (count === 0) {
          that.byId("idSave").setEnabled(true);
        } else {
          that.byId("idSave").setEnabled(false);
        }
      },

      onSubmit: function (oEvent) {
        sap.ui.core.BusyIndicator.show();
        var selOperation = that.oGModel.getProperty("/sId");
        var operationFlag = "";
        if(selOperation === "Edit"){
            operationFlag = "E"
        }
        var oEntry = {};

        oEntry.PROFILE = that.byId("idPn").getValue();
        oEntry.PRF_DESC = that.byId("idPdesc").getValue();
        oEntry.CREATED_BY = operationFlag;
        // oEntry.AUTHORIZATION = that.byId("auth").getValue();
        oEntry.METHOD = that.byId("idAlgo")._getSelectedItemText();

        if (oEntry.PROFILE !== "" && oEntry.PRF_DESC !== "" && oEntry.METHOD !== "" ) {
          var uri = "/v2/catalog/getProfiles";
          $.ajax({
            url: uri,
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({
              PROFILE: oEntry.PROFILE,
              METHOD: oEntry.METHOD,
              PRF_DESC: oEntry.PRF_DESC
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

      tablesendbatch: function (oEvent) {
        var table = that.byId("idTab").getItems(),
          aData = {
            PROFILEPARA: [],
          },
          jsonProfilePara,
          vIntval = 0;
        let vDoubleVal = null;
        // var oTabEntry={},
        // PROFILE, METHOD, CREATED_BY, PARA_NAME, INTVAL, DOUBLEVAL, STRVAL;
        that.getModel("BModel").setUseBatch(true);
        that.batchReq = true;
        that.count = table.length;
        that.comp = 0;

        sap.ui.core.BusyIndicator.show();
        var selOperation = that.oGModel.getProperty("/sId");
        var operationFlag;

          if(selOperation === "Create" || selOperation === "Copy" ){
            operationFlag = "I";
          } else if(selOperation === "Edit"){
            operationFlag = "E";
          }
        

        for (var i = 0; i < table.length; i++) {
          var PROFILE,
            METHOD,
            CREATED_BY,
            PARA_NAME,
            PARA_DESC,
            INTVAL = "",
            DOUBLEVAL = "",
            STRVAL = "";
          PROFILE = that.byId("idPn").getValue();
          METHOD = that.byId("idAlgo")._getSelectedItemText();
        //   CREATED_BY = that.byId("idCretBy").getValue();
          PARA_NAME = table[i].getCells()[0].getText();
          PARA_DESC = table[i].getCells()[1].getText();

          if (table[i].getCells()[2].getSelectedKey() === "INTEGER") {
            if (table[i].getCells()[4].getValue() === "") {
              INTVAL = parseInt(table[i].getCells()[3].getText());
            } else {
              if (table[i].getCells()[4].getValue() == "No default value") {
                INTVAL = null;
              } else {
                INTVAL = parseInt(table[i].getCells()[4].getValue());
              }
            }
            jsonProfilePara = {
              PROFILE: PROFILE,
              METHOD: METHOD,
              PARA_NAME: PARA_NAME,
              PARA_DESC: PARA_DESC,
              INTVAL: INTVAL,
              DOUBLEVAL: null,
              STRVAL: null,
            };
          } else if (table[i].getCells()[2].getSelectedKey() === "DOUBLE") {
            if (table[i].getCells()[4].getValue() === "") {
              DOUBLEVAL = parseFloat(table[i].getCells()[3].getText());
            } else {
              if (table[i].getCells()[4].getValue() == "No default value") {
                DOUBLEVAL = null;
              } else {
                DOUBLEVAL = parseFloat(table[i].getCells()[4].getValue());
              }
            }
            jsonProfilePara = {
              PROFILE: PROFILE,
              METHOD: METHOD,
              PARA_NAME: PARA_NAME,
              PARA_DESC: PARA_DESC,
              INTVAL: null,
              DOUBLEVAL: DOUBLEVAL,
              STRVAL: null,
            };
          } else if (table[i].getCells()[2].getSelectedKey() === "NVARCHAR") {
            if (table[i].getCells()[4].getValue() === "") {
              STRVAL = table[i].getCells()[3].getText();
            } else {
              STRVAL = table[i].getCells()[4].getValue();
            }
            jsonProfilePara = {
              PROFILE: PROFILE,
              METHOD: METHOD,
              PARA_NAME: PARA_NAME,
              PARA_DESC: PARA_DESC,
              INTVAL: null,
              DOUBLEVAL: null,
              STRVAL: STRVAL,
            };
          }
          aData.PROFILEPARA.push(jsonProfilePara);
          jsonProfilePara = {};
        }

        var uri = "/v2/catalog/genProfileParam";
        $.ajax({
          url: uri,
          type: "post",
          contentType: "application/json",
          data: JSON.stringify({
              FLAG : operationFlag,
            PROFILEPARA: aData.PROFILEPARA,
          }),
          dataType: "json",
          async: false,
          timeout: 0,
          error: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show(JSON.stringify(data));
          },
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Created profile parameters");
            that.onBack();
          },
        });
      },
    });
  }
);
