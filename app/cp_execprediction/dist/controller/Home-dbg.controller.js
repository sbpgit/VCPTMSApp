sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "cp/execpred/cpexecprediction/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, BaseController, JSONModel, Filter, FilterOperator, MessageToast, MessageBox) {
		"use strict";
        var oGModel, that;
		return BaseController.extend("cp.execpred.cpexecprediction.controller.Home", {
			onInit: function () {

			this.locModel = new JSONModel();
			this.prodModel = new JSONModel();
			this.odModel = new JSONModel();
			this.ppfModel = new JSONModel();
            this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.LocDialog", this);
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ProdDialog", this);
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogOD) {
                    this._valueHelpDialogOD = sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.ObjDepDialog", this);
                    this.getView().addDependent(this._valueHelpDialogOD);
                }
                if (!this._valueHelpDialogPPF) {
                    this._valueHelpDialogPPF = sap.ui.xmlfragment("cp.execpred.cpexecprediction.view.PredProfileDialog", this);
                    this.getView().addDependent(this._valueHelpDialogPPF);
                }
                this.getRouter().getRoute("Home").attachPatternMatched(this._onPatternMatched.bind(this));

			},
            _onPatternMatched: function() {
                that= this;
                this.oGModel = this.getModel("GModel");
                this.oLoc = this.byId("locInput");
                this.oProd = this.byId("prodInput");
                this.oObjDep = this.byId("odInput");
                this.oPredProfile = this.byId("pmInput");
                this.aVcRulesList = [];
                this.oProdList = this._oCore.byId(this._valueHelpDialogProd.getId() + "-list");
                this.oLocList = this._oCore.byId(this._valueHelpDialogLoc.getId() + "-list");
                this.oODList = this._oCore.byId(this._valueHelpDialogOD.getId() + "-list");
                this.oPPFList = this._oCore.byId(this._valueHelpDialogPPF.getId() + "-list");
                this.getModel("BModel").read("/getLocation",{
                    success:function(oData){
                        that.locModel.setData(oData)
                        that.oLocList.setModel(that.locModel);

                    },
                    error:function(oData,error){
                            MessageToast.show("error");
                    }
                });
                this.getModel("BModel").read("/getProducts",{
                    success:function(oData){
                        that.prodModel.setData(oData)
                        that.oProdList.setModel(that.prodModel);

                    },
                    error:function(oData,error){
                            MessageToast.show("error");
                    }
                });
                this.getModel("BModel").read("/getODHdr",{
                    success:function(oData){
                        that.odModel.setData(oData)
                        that.oODList.setModel(that.odModel);

                    },
                    error:function(oData,error){
                            MessageToast.show("error");
                    }
                });
                this.getModel("BModel").read("/getODHdr",{
                    success:function(oData){
                        that.odModel.setData(oData)
                        that.oODList.setModel(that.odModel);

                    },
                    error:function(oData,error){
                            MessageToast.show("error");
                    }
                });
            },
            onRun: function(){
                var oModel = this.getModel("PModel"),
                oEntry = [];
                var vVcRulesList= {  
                    vcRulesList: []
                };
                var vruleslist = {
                    Location : "FR10",
                    Product  : "KM_M219VBVS_BVS",
                    GroupID  :  "M219VV00105NN_1" 
                }
               vVcRulesList.vcRulesList.push(vruleslist);
                /*vVcRulesList.push({                    
                    "Location" : "FR10",
                    "Product"  : "KM_M219VBVS_BVS",
                    "GroupID"  :  "M219VV00105NN_1"
                });*/
                oModel.create("/generateRegModels", vVcRulesList,{      
                    	success: function (oData) {
                    		MessageToast.show("success");
                    	},
                    	error: function (oError) {
                    		MessageToast.show("error");
                    	}
                    });
                // var oFilters = new Filter({
                //     filters: [
                //         new Filter("Location", sap.ui.model.FilterOperator.Contains, "FR10"),
                //         new Filter("Product", sap.ui.model.FilterOperator.Contains, "KM_M219VBVS_BVS"),
                //         new Filter("GroupID", sap.ui.model.FilterOperator.Contains, "M219VV00105NN_1")
                //     ],
                //     and: false
                // });
                // vVcRulesList.push(oFilters);
                // var oFilters1 = new Filter({
                //     filters: [
                //         new Filter("vcRulesList", sap.ui.model.FilterOperator.Contains,vVcRulesList )
                //     ],
                //     and: false
                // });
                // oEntry.push(oFilters1);
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
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("loc")) {
                    this._valueHelpDialogLoc.open();
                } else if (sId.includes("prod")) {                    
                    this._valueHelpDialogProd.open();
                } else if (sId.includes("od")) {
                    if (this.oODList.getBinding("items")) {
                        this.oODList.getBinding("items").filter([
                            new Filter("LOCATION_ID", FilterOperator.Contains, that.oLocList.getSelectedItem().getTitle()),                            
                            new Filter("PRODUCT_ID", FilterOperator.Contains, that.oProdList.getSelectedItem().getTitle())
                        ]);
                    }
                    this._valueHelpDialogOD.open();
                 }
                //  else if (sId.includes("emp")) {
                //     this._dialogEmployee.open();
                // } else {
                //     this._dialogFCCCIO.open();
                // }
            },
            handleClose: function(oEvent){
                var sId = oEvent.getParameter("id");
			if (sId.includes("loc")) {
				that._oCore.byId(this._valueHelpDialogLoc.getId() + "-searchField").setValue("");
				if (that.oLocList.getBinding("items")) {
					that.oLocList.getBinding("items").filter([]);
				}
			} else if (sId.includes("prod")) {
				that._oCore.byId(this._valueHelpDialogProd.getId() + "-searchField").setValue("");
				if (that.oProdList.getBinding("items")) {
					that.oProdList.getBinding("items").filter([]);
				}
			} else if (sId.includes("od")) {
				that._oCore.byId(this._valueHelpDialogOD.getId() + "-searchField").setValue("");
				if (that.oODList.getBinding("items")) {
					that.oODList.getBinding("items").filter([]);
				}
			}
            else {
                //DO NOTHING
            }
            },
            handleSearch: function (oEvent) {
                var query = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = oEvent.getParameter("id"),
                    oFilters = [];
                // Check if search filter is to be applied
                query = query ? query.trim() : "";
                // Admin
                if (sId.includes("loc")) {
                    if (query !== "") {
                        oFilters.push(new Filter({
                            filters: [
                                new Filter("LOCATION_ID", FilterOperator.Contains, query),
                                new Filter("LOCATION_DESC", FilterOperator.Contains, query)
                            ],
                            and: false
                        }));
                    }
                    that.oLocList.getBinding("items").filter(oFilters);
                // Product
                } else if (sId.includes("prod")) {
                    if (query !== "") {
                        oFilters.push(new Filter({
                            filters: [
                                new Filter("PRODUCT_ID", FilterOperator.Contains, that.oAdminList.getSelectedItem().getTitle()),
                                new Filter("PROD_DESC", FilterOperator.Contains, query)
                            ],
                            and: false
                        }));
                    } 
                    that.oProdList.getBinding("items").filter(oFilters);
                // Object Dependency
                } else if (sId.includes("od")) {
                    if (query !== "") {
                        oFilters.push(new Filter({
                            filters: [
                                new Filter("LOCATION_ID", FilterOperator.Contains, query),
                                new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                                new Filter("COMPONENT", FilterOperator.Contains, query),
                                new Filter("OBJ_DEP", FilterOperator.Contains, query)
                            ],
                            and: false
                        }));
                    }
                    that.oODList.getBinding("items").filter(oFilters);
                // Save dialog
                }  else {
                    //DO NOTHING
                }
            },
            handleSelection: function (oEvent) {
                var sId = oEvent.getParameter("id"),
                    oItem = oEvent.getParameter("selectedItems"),
                    aSelectedItems;
                //Location list
                if (sId.includes("Loc")) {
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedItems[0].getTitle());
                    
                // Prod list
                } else if (sId.includes("prod")) {
                    that.oProdList.getBinding("items").filter([]);                    
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    if (aSelectedItems && aSelectedItems.length > 0) {
                        aSelectedItems.forEach(function (oItem) {
                            that.oProd.addToken(new sap.m.Token({
                                key:oItem.getTitle(),
                                text: oItem.getTitle()
                            }));
                        });
                    }
                    //that.addToken("Prod", that.oProdList.getSelectedItems(), that.generateSideGangList);
                // Object ependency
                } else if (sId.includes("od")) {
                    that.oODList.getBinding("items").filter([]);                    
                    aSelectedItems = oEvent.getParameter("selectedItems");
                    if (aSelectedItems && aSelectedItems.length > 0) {
                        aSelectedItems.forEach(function (oItem) {
                            that.oObjDep.addToken(new sap.m.Token({
                                key:oItem.getTitle(),
                                text: oItem.getTitle()
                            }));
                        });
                    }
                } else {
                    //Do nothing
                }
                that.handleClose(oEvent);
            },
		});
	});
