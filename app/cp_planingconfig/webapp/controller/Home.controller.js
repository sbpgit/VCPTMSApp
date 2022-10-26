sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/GroupHeaderListItem',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, GroupHeaderListItem, MessageToast, JSONModel, Filter, FilterOperator) {
        "use strict";
        var that = this;
        return Controller.extend("cpapp.cpplaningconfig.controller.Home", {
            onInit: function () {
                var oRoute;
                that = this;

                that.oParameterModel = new JSONModel();
                that.oMethodModel = new JSONModel();

                if (!that.oMethodDialog) {
                    that.oMethodDialog = sap.ui.xmlfragment("cpapp.cpplaningconfig.view.MethodTyp", that);
                    that.getView().addDependent(that.oMethodDialog);
                }

                oRoute = that.getRouter().getRoute("detail");
                // oRoute.attachPatternMatched(that._onPatternMatched, that);
                oRoute.attachMatched(that._onRouteMatched, that);
            },
            /*

*/
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            grouper: function (oGroup) {
                return {
                    key: oGroup.oModel.oData.Steps[oGroup.sPath.split("/")[2]].GROUP_DESCRIPTION
                };
            },
            /*
            *
            */
            getGroupHeader: function (oGroup) {
                var sGroup = oGroup.key.slice(1);
                return new GroupHeaderListItem({
                    title: sGroup,
                    upperCase: false
                });
            },
            /*
            *
            */
            onPressSave: function () {
                var oModel = that.getOwnerComponent().getModel('PCModel');
                var oEntry = {
                    PARAMVALS: [],
                },
                    oParamVals;
                var sParamVal = "";

                var aItems = that.getView().byId("idParameterTable").getItems();

                for (var i = 0; i < aItems.length; i++) {
                    var oObj = aItems[i];
                    if (oObj._bGroupHeader === false) {
                        if (oObj.getCells()[2].getValue() !== "" && oObj.getCells()[2].getValueState() === "None") {
                            if (oObj.getCells()[2].getName() !== "" && oObj.getCells()[2].getName() !== undefined) {
                                sParamVal = oObj.getCells()[2].getName();
                            } else {
                                sParamVal = oObj.getCells()[2].getValue();
                            }
                            oParamVals = {
                                LOCATION_ID: that.location,
                                PARAMETER_ID: oObj.getCells()[0].getText(),
                                VALUE: sParamVal
                                // VALUE: oObj.getCells()[2].getValue()
                            };
                            oEntry.PARAMVALS.push(oParamVals);
                        } else {
                            MessageToast.show(that.i18n.getText("getMandtMsg"), { width: '15%' });
                            return;
                        }
                    }
                }

                oModel.callFunction("/postParameterValues", {
                    method: "GET",
                    urlParameters: {
                        FLAG: 'C',
                        PARAMVALS: JSON.stringify(oEntry.PARAMVALS)
                    },
                    success: function (oData, oResponse) {
                        sap.m.MessageToast.show(that.i18n.getText("postSuccess"));
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Error");
                    },
                });
            },
            /*
            *
            */
            getParameters: function (oModel, slocation) {
                var aParameters = [];
                oModel.read('/V_Parameters', {
                    filters: [
                        new Filter("LOCATION_ID", FilterOperator.EQ, slocation)
                    ],
                    success: function (oData) {
                        // MessageToast.show("Success");
                        aParameters = oData.results;
                        aParameters = aParameters.sort((a, b) => a.SEQUENCE - b.SEQUENCE);

                        that.oParameterModel.setData({
                            parameters: aParameters  //oData.results
                        });

                        that.byId("idParameterTable").setModel(that.oParameterModel);

                    }, error: function (oReponse) {
                        MessageToast.show("Failed to fetch Parameters!");
                    }
                }
                );
            },
            /*
            *
            */
            getMethods: function (oModel) {
                oModel.read('/Method_Types', {
                    success: function (oData) {
                        // MessageToast.show("Success");
                        that.oMethodModel.setData({
                            methods: oData.results
                        });

                    }, error: function (oReponse) {
                        MessageToast.show("Failed to fetch Method Types!");
                    }
                }
                );
            },
            /*
            *
            */
            handleValueHelpRequest: function (oEvent) {
                var oParamModel = that.getView().byId("idParameterTable").getModel();
                var oBindingContext = oEvent.getSource().getBindingContext();
                var sTable = oParamModel.getProperty("VALUE_HELP_TAB", oBindingContext);

                switch (sTable) {
                    case 'Method_Types':
                        that.oSelectedInputExe = oEvent.getSource();
                        if (that.oMethodDialog) {
                            that.oMethodDialog.setModel(that.oMethodModel);
                            that.oMethodDialog.open();
                        }
                }
            },
            /**
             *
             *
             * @param {*} oEvent
             *              */
            onListItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem").getTitle();
                that.sSelMethodTyp = oEvent.getParameter("listItem").getInfo();

                if (that.oSelectedInputExe) {
                    that.oSelectedInputExe.setValue(oSelectedItem);
                    that.oSelectedInputExe.setName(that.sSelMethodTyp);
                }
                that.oMethodDialog.close();

            },
            /**
             *
             *
             */
            onCloseDialog: function () {
                if (that.oMethodDialog) {
                    that.oMethodDialog.close();
                }
            },
            /**
             *
             *
             * @param {*} oEvent
             */
            onParamValueChange: function (oEvent) {
                var sMessage;
                that.oSelectedInput = oEvent.getSource();
                var oParamModel = that.getView().byId("idParameterTable").getModel();
                var oBindingContext = oEvent.getSource().getBindingContext();
                var sMinValue = oParamModel.getProperty("MIN_VALUE", oBindingContext);
                var sMaxValue = oParamModel.getProperty("MAX_VALUE", oBindingContext);
                var sNewValue = oEvent.getParameter("newValue");
                if (oBindingContext.getObject().PARAMETER_ID === 9) {
                    var oParamData = oParamModel.getData().parameters[0];
                    sMinValue = oParamData.VALUE;
                }
                if (parseInt(sMaxValue) > 0) {
                    if (parseInt(sNewValue) < parseInt(sMinValue) || parseInt(sNewValue) > parseInt(sMaxValue)) {
                        that.oSelectedInput.setValueState("Error");
                        sMessage = "Please enter value between " + sMinValue + " and " + sMaxValue;
                        that.oSelectedInput.setValueStateText(sMessage);
                    } else {
                        that.oSelectedInput.setValueState("None");
                        sMessage = "";
                        that.oSelectedInput.setValueStateText(sMessage);
                    }
                }
            },
            /**
             *
             *
             */
            _onPatternMatched: function () {
                var oModel = that.getOwnerComponent().getModel('PCModel');
                that.i18n = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                that.getParameters(oModel);
                that.getMethods(oModel);
            },
            _onRouteMatched: function (oEvent) {
                var oModel = that.getOwnerComponent().getModel('PCModel');
                var oArgs = oEvent.getParameter("arguments");
                that.location = oArgs.location;
                that.i18n = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                that.getParameters(oModel, oArgs.location);
                that.getMethods(oModel);
            }
            /**
             * 
             * 
             */

        });
    });
