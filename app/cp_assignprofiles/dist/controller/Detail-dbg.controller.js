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
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
          that = this;
          // Declaring JSON Models
          that.oListModel = new JSONModel();
          that.oParamModel = new JSONModel();
          that.oAlgoListModel = new JSONModel();
        },
  
        /**
         * Go back to Home page
         */
        onBack: function () {
          var aData = [];
          that.oAlgoListModel.setData({
            results: aData,
          });
          that.byId("idTab").setModel(that.oAlgoListModel);
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("Home", {}, true);
        },
  
        /**
         * Called after the view has been rendered
         * Calls the getParameters[function] to get Data
         */
        onAfterRendering: function () {
          that = this;
          this.vDate = new Date().toISOString().split("T")[0];
          that.oGModel = that.getModel("oGModel");
          var sSelButton = that.oGModel.getProperty("/sId");
  
          // Setting the values based on button click
          if (sSelButton === "Copy" || sSelButton === "Edit") {
            if (sSelButton === "Edit") {
              that.byId("idPn").setValue(that.oGModel.getProperty("/sProfile"));
              that.byId("idPn").setEditable(false);
              this.byId("idPage").setTitle("Edit Profile");
            } else {
              that.byId("idPn").setValue("");
              that.byId("idPn").setEditable(true);
              this.byId("idPage").setTitle("Create Profile");
            }
            // Setting description in input box
            that
              .byId("idPdesc")
              .setValue(that.oGModel.getProperty("/sProf_desc"));
            that.byId("idAuth").setValue("");
  
            // Getting selected method for copy/ edit
            var sMethodText = that.oGModel.getProperty("/sMethod");
  
            //Setting the selected key for algorithm
            if (sMethodText === "MLR") {
              that.byId("idAlgo").setSelectedKey("M");
            } else if (sMethodText === "HGBT") {
              that.byId("idAlgo").setSelectedKey("H");
            } else if (sMethodText === "VARMA") {
              that.byId("idAlgo").setSelectedKey("V");
            } else if (sMethodText === "RDT") {
              that.byId("idAlgo").setSelectedKey("R");
            } else {
              that.byId("idAlgo").setSelectedKey("N");
            }
            // calling the function
            that.getParameters();
          } else {
            // removing values for input box when create new
            that.byId("idPn").setValue("");
            that.byId("idPdesc").setValue("");
            that.byId("idAuth").setValue("");
            that.byId("idAlgo").setSelectedKey("N");
            that.byId("idPn").setEditable(true);
            var oData = [];
            that.oAlgoListModel.setData({
              results: oData,
            });
            that.byId("idTab").setModel(that.oAlgoListModel);
          }
        },
  
        /**
         * Getting Data of the profile parameters based on selected method and binding to elements
         */
        getParameters: function () {
          var sSelProfile = that.oGModel.getProperty("/sProfile"),
            sSelMethod = that.oGModel.getProperty("/sMethod");
  
          this.getModel("BModel").read("/getProfileParameters", {
            filters: [
              new Filter("PROFILE", FilterOperator.EQ, sSelProfile),
              new Filter("METHOD", FilterOperator.EQ, sSelMethod),
            ],
            success: function (oData) {
              that.alogoList = that.byId("idTab");
  
              // Adding new fields
              oData.results.forEach(function (row) {
                row.DESCRIPTION = row.PARA_DESC;
                if (row.DOUBLEVAL !== null) {
                    row.DATATYPE = "DOUBLE";
                    row.DEFAULTVAL = row.DOUBLEVAL;
                  } else if (row.INTVAL !== null) {
                    row.DATATYPE = "INTEGER";
                    row.DEFAULTVAL = row.INTVAL;
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
  
        /**
         * This function is to get the profile parameters based on selected method.
         */
        onAlgorChange: function (oEvent) {
          var sSelAlgo = that.byId("idAlgo")._getSelectedItemText();
          that.alogoList = that.byId("idTab");
  
          var oFilters = new Filter("METHOD", FilterOperator.EQ, sSelAlgo);
  
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
  
        /**
         * This function is to validate the data changed based on datatype.
         */
        onLive: function (oEvent) {
          that.byId("idSave").setEnabled(true);
          if (oEvent) {
            var sQuery = oEvent.getParameter("newValue"),
              selId = oEvent.getParameter("id").split("idTab-")[1];
          } else {
            var selId = that.typeChange;
            sQuery = that.byId("idTab").getItems()[selId].getCells()[4].getValue();
          }
          var sSelType = that
              .byId("idTab")
              .getItems()
              [selId].getCells()[2]
              .getSelectedKey(),
            iCount = 0;
          // Declaration of special characters
          var specials = /^[^*|\":<>[\]{}!`\\()';@&$]+$/;
          // Checking the datatype of the field and validationg the value
          if (sSelType === "DOUBLE") {
            that.byId("idTab").getItems()[selId].getCells()[4].setType("Number");
          }
          // Checking the datatype of the field and validationg the value
          if (sSelType === "INTEGER") {
            if (
              (sQuery % 1 === 0 &&
                parseInt(sQuery).toString() === sQuery.toString()) ||
              sQuery === ""
            ) {
              that
                .byId("idTab")
                .getItems()
                [selId].getCells()[4]
                .setValueState("None");
              iCount = 0;
            } else {
              that
                .byId("idTab")
                .getItems()
                [selId].getCells()[4]
                .setValueState("Error");
              iCount = iCount + 1;
            }
            // Checking the datatype of the field and validationg the value
          } else if (sSelType === "NVARCHAR") {
            var letters = /^[A-Za-z0-9 ]+$/;
            if (
              (letters.test(sQuery) && specials.test(sQuery)) ||
              sQuery === ""
            ) {
              that
                .byId("idTab")
                .getItems()
                [selId].getCells()[4]
                .setValueState("None");
              iCount = 0;
            } else {
              that
                .byId("idTab")
                .getItems()
                [selId].getCells()[4]
                .setValueState("Error");
              iCount = iCount + 1;
            }
            // Checking the datatype of the field and validationg the value
          } else if (sSelType === "DOUBLE") {
            if (!/^\d+$/.test(sQuery) && sQuery !== "") {
              if (sQuery.split(".")[1] !== "" && sQuery !== ".") {
                that
                  .byId("idTab")
                  .getItems()
                  [selId].getCells()[4]
                  .setValueState("None");
                iCount = 0;
              } else {
                that
                  .byId("idTab")
                  .getItems()
                  [selId].getCells()[4]
                  .setValueState("Error");
                iCount = iCount + 1;
              }
            } else {
              if (sQuery === "") {
                that
                  .byId("idTab")
                  .getItems()
                  [selId].getCells()[4]
                  .setValueState("None");
                iCount = 0;
              } else {
                that
                  .byId("idTab")
                  .getItems()
                  [selId].getCells()[4]
                  .setValueState("Error");
                iCount = iCount + 1;
              }
            }
          }
          // Validating the values and enabling or disabling the save button
          if (iCount === 0) {
            that.byId("idSave").setEnabled(true);
          } else {
            that.byId("idSave").setEnabled(false);
          }
        },
  
        /**
         * This function is called when submitting the Prediction profile.
         */
        onSubmit: function (oEvent) {
          sap.ui.core.BusyIndicator.show();
          var sSelOperation = that.oGModel.getProperty("/sId");
          var sOperationFlag = "";
          if (sSelOperation === "Edit") {
            sOperationFlag = "E";
          }
          var oEntry = {};
  
          oEntry.PROFILE = that.byId("idPn").getValue();
          oEntry.PRF_DESC = that.byId("idPdesc").getValue();
          oEntry.CREATED_BY = sOperationFlag;
          oEntry.METHOD = that.byId("idAlgo")._getSelectedItemText();
  
          if (
            oEntry.PROFILE !== "" &&
            oEntry.PRF_DESC !== "" &&
            oEntry.METHOD !== ""
          ) {
            that.getModel("BModel").callFunction("/createProfiles", {
              method: "GET",
              urlParameters: {
                PROFILE: oEntry.PROFILE,
                METHOD: oEntry.METHOD,
                PRF_DESC: oEntry.PRF_DESC,
                CREATED_DATE: that.vDate,
                CREATED_BY: sOperationFlag,
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Created Prediction profile");
                // Calling the function to submit the profile parameters
                that.tablesendbatch();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("failed to created Prediction profile");
              },
            });
          } else {
            MessageToast.show("Please fill all required fields");
            sap.ui.core.BusyIndicator.hide();
          }
        },
  
        /**
         * This function is to submit the profile parameters.
         */
        tablesendbatch: function (oEvent) {
          var oTable = that.byId("idTab").getItems(),
            aData = {
              PROFILEPARA: [],
            },
            jsonProfilePara;
          that.getModel("BModel").setUseBatch(true);
          that.batchReq = true;
          that.iCount = oTable.length;
          that.comp = 0;
  
          sap.ui.core.BusyIndicator.show();
          var sSelOperation = that.oGModel.getProperty("/sId");
          var sOperationFlag;
  
          // Setting the falg based on button selected
          if (sSelOperation === "Create" || sSelOperation === "Copy") {
            sOperationFlag = "I";
          } else if (sSelOperation === "Edit") {
            sOperationFlag = "E";
          }
  
          // Changeing INTVAL, DOUBLEVAL, STRVAL values based on datatype
          for (var i = 0; i < oTable.length; i++) {
            var PROFILE,
              METHOD,
              CREATED_BY,
              PARA_NAME,
              PARA_DESC,
              DATATYPE,
              INTVAL = "",
              DOUBLEVAL = "",
              STRVAL = "";
            jsonProfilePara = {};
            PROFILE = that.byId("idPn").getValue();
            METHOD = that.byId("idAlgo")._getSelectedItemText();
            PARA_NAME = oTable[i].getCells()[0].getText();
            PARA_DESC = oTable[i].getCells()[1].getText();
  
            if (oTable[i].getCells()[2].getSelectedKey() === "INTEGER") {
                DATATYPE = "INTEGER";
              if (oTable[i].getCells()[4].getValue() === "") {
                INTVAL = parseInt(oTable[i].getCells()[3].getText());
              } else {
                if (oTable[i].getCells()[4].getValue() == "No default value") {
                  INTVAL = "0";
                } else {
                  INTVAL = parseInt(oTable[i].getCells()[4].getValue());
                }
              }
  
              if(INTVAL.toString().includes("NaN")){
                  INTVAL = null;
              }
              jsonProfilePara = {
                PROFILE: PROFILE,
                METHOD: METHOD,
                PARA_NAME: PARA_NAME,
                PARA_DESC: PARA_DESC,
                DATATYPE: DATATYPE,
                INTVAL: INTVAL,
                DOUBLEVAL: null,
                STRVAL: null,
              };
            } else if (oTable[i].getCells()[2].getSelectedKey() === "DOUBLE") {
                DATATYPE = "DOUBLE";
              if (oTable[i].getCells()[4].getValue() === "") {
                DOUBLEVAL = parseFloat(oTable[i].getCells()[3].getText());
                if(DOUBLEVAL === "0"){
                  DOUBLEVAL = "0.0";
                }
              } else {
                if (oTable[i].getCells()[4].getValue() === "No default value") {
                  DOUBLEVAL = "0.0";
                } else {
                  DOUBLEVAL = parseFloat(oTable[i].getCells()[4].getValue());
                }
              }
              if(DOUBLEVAL.toString().includes("NaN")){
                DOUBLEVAL = null;
            }
              jsonProfilePara = {
                PROFILE: PROFILE,
                METHOD: METHOD,
                PARA_NAME: PARA_NAME,
                PARA_DESC: PARA_DESC,
                DATATYPE: DATATYPE,
                INTVAL: null,
                DOUBLEVAL: DOUBLEVAL,
                STRVAL: null,
              };
            } else if (oTable[i].getCells()[2].getSelectedKey() === "NVARCHAR") {
                DATATYPE = "NVARCHAR";
              if (oTable[i].getCells()[4].getValue() === "") {
                STRVAL = oTable[i].getCells()[3].getText();
              } else {
                if (oTable[i].getCells()[4].getValue() === "No default value") {
                    STRVAL = "";
                  } else {
                    STRVAL = oTable[i].getCells()[4].getValue();
                  }
              }
              if(STRVAL.includes("NaN")){
                  STRVAL = null;
              }
              jsonProfilePara = {
                PROFILE: PROFILE,
                METHOD: METHOD,
                PARA_NAME: PARA_NAME,
                PARA_DESC: PARA_DESC,
                DATATYPE: DATATYPE,
                INTVAL: null,
                DOUBLEVAL: null,
                STRVAL: STRVAL,
              };
            }
            aData.PROFILEPARA.push(jsonProfilePara);
            sap.ui.core.BusyIndicator.show();
            that.getModel("BModel").callFunction("/createProfilePara", {
              method: "GET",
              urlParameters: {
                FLAG: sOperationFlag,
                PROFILE: PROFILE,
                METHOD: METHOD,
                PARA_NAME: PARA_NAME,
                INTVAL: jsonProfilePara.INTVAL,
                DOUBLEVAL: jsonProfilePara.DOUBLEVAL,
                STRVAL: jsonProfilePara.STRVAL,
                PARA_DESC: PARA_DESC,
                // DATATYPE: jsonProfilePara.DATATYPE,
                PARA_DEP: "",
                CREATED_DATE: that.vDate,
                CREATED_BY: "",
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Created profile parameters");
                // On successfull of cretion of Prediction profile and profile parameters navigating to Home view
                that.onBack();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Failed to create profile parameters");
              },
            });
          }
        },
      });
    }
  );
  