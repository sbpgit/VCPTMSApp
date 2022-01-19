sap.ui.define(
    [
      "cp/odp/cpodprofiles/controller/BaseController",
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
  
      return BaseController.extend("cp.odp.cpodprofiles.controller.Home", {
        onInit: function () {
          that = this;
          that.oListModel = new JSONModel();
          that.oProfileModel = new JSONModel();

          that.oLocModel = new JSONModel();
          that.oProdModel = new JSONModel();
          that.oCompModel = new JSONModel();
          that.oObjDepModel = new JSONModel();
  
          this.oListModel.setSizeLimit(5000);
          that.oLocModel.setSizeLimit(1000);
          that.oProdModel.setSizeLimit(1000);
          that.oCompModel.setSizeLimit(1000);
          that.oObjDepModel.setSizeLimit(1000);
        },
        onAfterRendering: function () {
          that = this;
          that.oList = this.byId("idTab");        
          that.oMcLoc = this.byId("idLoc");
          that.oMcProd = this.byId("idProd");
          that.oMcComp = this.byId("idComp");
          that.oMcObjDep = this.byId("idObjDep");


          that.oList.removeSelections();
          // if (that.oList.getBinding("items")) {
          //   that.oList.getBinding("items").filter([]);
          // }
          // Calling function
          this.getData();
        },
        getData: function () {
            sap.ui.core.BusyIndicator.show();
          this.getModel("BModel").read("/getObjDepProfiles", {
            success: function (oData) {
                that.aLocation = [];
                that.aProduct = [];
                that.aComponent = [];
                that.aObjDep = [];

                that.SelLoc = [];
                that.SelProd = [];
                that.SelComp = [];
                that.SelObjDep = [];

                var aKeysLoc = [],
                    aKeysProd = [],
                    aKeysComp = [],
                    aKeysObjDep = [];
                that.TableData = oData.results;

              for (var i = 0; i < oData.results.length; i++) {

                if (that.aLocation.indexOf(oData.results[i].LOCATION_ID) === -1) {
                    that.aLocation.push(oData.results[i].LOCATION_ID);
                    if (oData.results[i].LOCATION_ID !== "") {
                        that.oLocData = {
                            "LOCATION_ID": oData.results[i].LOCATION_ID
                        };
                        that.SelLoc.push(that.oLocData);
                        aKeysLoc[i] = that.oLocData.LOCATION_ID;
                    }
                }
                if (that.aProduct.indexOf(oData.results[i].PRODUCT_ID) === -1) {
                    that.aProduct.push(oData.results[i].PRODUCT_ID);
                    if (oData.results[i].PRODUCT_ID !== "") {
                        that.oProdData = {
                            "PRODUCT_ID": oData.results[i].PRODUCT_ID
                        };
                        that.SelProd.push(that.oProdData);
                        aKeysProd[i] = that.oProdData.PRODUCT_ID;
                    }
                }
                if (that.aComponent.indexOf(oData.results[i].COMPONENT) === -1) {
                    that.aComponent.push(oData.results[i].COMPONENT);
                    if (oData.results[i].COMPONENT !== "") {
                        that.oCompData = {
                            "COMPONENT": oData.results[i].COMPONENT
                        };
                        that.SelComp.push(that.oCompData);
                        aKeysComp[i] = that.oCompData.COMPONENT;
                    }
                }
                if (that.aObjDep.indexOf(oData.results[i].OBJ_DEP) === -1) {
                    that.aObjDep.push(oData.results[i].OBJ_DEP);
                    if (oData.results[i].OBJ_DEP !== "") {
                        that.oObjDepData = {
                            "OBJ_DEP": oData.results[i].OBJ_DEP
                        };
                        that.SelObjDep.push(that.oObjDepData);
                        aKeysObjDep[i] = that.oObjDepData.OBJ_DEP;
                    }
                }
              }

              that.oListModel.setData({
                results: oData.results,
              });
              that.oList.setModel(that.oListModel);


              that.oLocModel.setData({ resultsLoc: that.SelLoc });
              that.oProdModel.setData({ resultsProd: that.SelProd });
              that.oCompModel.setData({ resultsComp: that.SelComp });
              that.oObjDepModel.setData({ resultsObjDep: that.SelObjDep });

              that.oMcLoc.setModel(that.oLocModel);
              that.oMcProd.setModel(that.oProdModel);
              that.oMcComp.setModel(that.oCompModel);
              that.oMcObjDep.setModel(that.oObjDepModel);

              that.oMcLoc.setSelectedKeys(that.aLocation);
              that.oMcProd.setSelectedKeys(that.aProduct);
              that.oMcComp.setSelectedKeys(that.aComponent);
              that.oMcObjDep.setSelectedKeys(that.aObjDep);

              sap.ui.core.BusyIndicator.hide();
            },
            error: function () {
                sap.ui.core.BusyIndicator.hide();
              MessageToast.show("Failed to get data");
            },
          });
        },
  
        onAssign: function () {
          that.oGModel = that.getModel("oGModel");
          var selTabItem = that.byId("idTab").getSelectedItems();
          if(selTabItem.length){

          
          if (!that._onProfiles) {
            that._onProfiles = sap.ui.xmlfragment("cp.odp.cpodprofiles.view.Profiles",that);
            that.getView().addDependent(that._onProfiles);
          }
  
          that.oProfileList = sap.ui.getCore().byId("idListTab");
          that._onProfiles.setTitleAlignment("Center");
          this.getModel("BModel").read("/getProfiles", {
            success: function (oData) {
              that.oProfileModel.setData({
                results: oData.results,
              });
              that.oProfileList.setModel(that.oProfileModel);
  
              that._onProfiles.open();
              that.oGModel.setProperty("/selItem", selTabItem);
            },
            error: function () {
              MessageToast.show("Failed to get profiles");
            },
          });
        } else {
            MessageToast.show("Please select atleast one item to assign profile");
        }
        },
  
        handleClose: function () {
          that.byId("idTab").removeSelections();
          that._onProfiles.close();
        },
  
        handleSearch: function (oEvent) {
          var query =
              oEvent.getParameter("value") || oEvent.getParameter("newValue"),
            oFilters = [];
  
          if (query !== "") {
            oFilters.push(
              new Filter({
                filters: [
                  new Filter("PROFILE", FilterOperator.Contains, query),
                  new Filter("PRF_DESC", FilterOperator.Contains, query),
                ],
                and: false,
              })
            );
          }
          that.oProfileList.getBinding("items").filter(oFilters);
        },

        onTableSearch: function (oEvent) {
            var query =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
              oFilters = [];
    
            if (query !== "") {
              oFilters.push(
                new Filter({
                  filters: [
                    new Filter("LOCATION_ID", FilterOperator.Contains, query),
                    new Filter("PRODUCT_ID", FilterOperator.Contains, query),
                    new Filter("COMPONENT", FilterOperator.Contains, query),
                    new Filter("OBJ_DEP", FilterOperator.Contains, query),
                    new Filter("PROFILE", FilterOperator.Contains, query)
                  ],
                  and: false,
                })
              );
            }
            that.oList.getBinding("items").filter(oFilters);
          },
  
        
        handLocChg:function(){

            var oLocSel = that.getView().byId("idLoc").getSelectedKeys();
			var TempProd = [],
                TempComp = [],
                TempObjDep = [],
			    TempData = [];

			for (var i = 0; i < oLocSel.length; i++) {
				for (var j = 0; j < that.TableData.length; j++) {
					if (that.TableData[j].LOCATION_ID === oLocSel[i]) {
						TempData.push(that.TableData[j]);
						if (TempComp.indexOf(that.TableData[j].COMPONENT) === -1) {
							TempComp.push(that.TableData[j].COMPONENT);
						}
                        if (TempProd.indexOf(that.TableData[j].PRODUCT_ID) === -1) {
							TempProd.push(that.TableData[j].PRODUCT_ID);
						}
						if (TempObjDep.indexOf(that.TableData[j].OBJ_DEP) === -1) {
							TempObjDep.push(that.TableData[j].OBJ_DEP);
						}
					}
				}
			}

			that.oListModel.setData({
				results: TempData
			});
            
            that.oMcComp.setSelectedKeys(TempComp);
            that.oMcProd.setSelectedKeys(TempProd);
            that.oMcObjDep.setSelectedKeys(TempObjDep);
        },


        handProdChg:function(){

            var oProdSel = that.getView().byId("idProd").getSelectedKeys();
			var TempLoc = [],
                TempComp = [],
                TempObjDep = [],
			    TempData = [];

			for (var i = 0; i < oProdSel.length; i++) {
				for (var j = 0; j < that.TableData.length; j++) {
					if (that.TableData[j].PRODUCT_ID === oProdSel[i]) {
						TempData.push(that.TableData[j]);
						if (TempLoc.indexOf(that.TableData[j].LOCATION_ID) === -1) {
							TempLoc.push(that.TableData[j].LOCATION_ID);
						}
                        if (TempComp.indexOf(that.TableData[j].COMPONENT) === -1) {
							TempComp.push(that.TableData[j].COMPONENT);
						}
						if (TempObjDep.indexOf(that.TableData[j].OBJ_DEP) === -1) {
							TempObjDep.push(that.TableData[j].OBJ_DEP);
						}
					}
				}
			}

			that.oListModel.setData({
				results: TempData
			});
            
            that.oMcLoc.setSelectedKeys(TempLoc);
            that.oMcComp.setSelectedKeys(TempComp);
            that.oMcObjDep.setSelectedKeys(TempObjDep);
        },


        handCompChg:function(){

            var oCompSel = that.getView().byId("idComp").getSelectedKeys();
			var TempLoc = [],
                TempProd = [],
                TempObjDep = [],
			    TempData = [];

			for (var i = 0; i < oCompSel.length; i++) {
				for (var j = 0; j < that.TableData.length; j++) {
					if (that.TableData[j].COMPONENT === oCompSel[i]) {
						TempData.push(that.TableData[j]);
						if (TempLoc.indexOf(that.TableData[j].LOCATION_ID) === -1) {
							TempLoc.push(that.TableData[j].LOCATION_ID);
						}
                        if (TempProd.indexOf(that.TableData[j].PRODUCT_ID) === -1) {
							TempProd.push(that.TableData[j].PRODUCT_ID);
						}
						if (TempObjDep.indexOf(that.TableData[j].OBJ_DEP) === -1) {
							TempObjDep.push(that.TableData[j].OBJ_DEP);
						}
					}
				}
			}

			that.oListModel.setData({
				results: TempData
			});
            
            that.oMcLoc.setSelectedKeys(TempLoc);
            that.oMcProd.setSelectedKeys(TempProd);
            that.oMcObjDep.setSelectedKeys(TempObjDep);
        },

        handObjDepChg:function(){

            var oObjDepSel = that.getView().byId("idObjDep").getSelectedKeys();
			var TempLoc = [],
                TempProd = [],
                TempComp = [],
			    TempData = [];

			for (var i = 0; i < oObjDepSel.length; i++) {
				for (var j = 0; j < that.TableData.length; j++) {
					if (that.TableData[j].OBJ_DEP === oObjDepSel[i]) {
						TempData.push(that.TableData[j]);
						if (TempLoc.indexOf(that.TableData[j].LOCATION_ID) === -1) {
							TempLoc.push(that.TableData[j].LOCATION_ID);
						}
                        if (TempProd.indexOf(that.TableData[j].PRODUCT_ID) === -1) {
							TempProd.push(that.TableData[j].PRODUCT_ID);
						}
						if (TempComp.indexOf(that.TableData[j].COMPONENT) === -1) {
							TempComp.push(that.TableData[j].COMPONENT);
						}
					}
				}
			}

			that.oListModel.setData({
				results: TempData
			});
            
            that.oMcLoc.setSelectedKeys(TempLoc);
            that.oMcProd.setSelectedKeys(TempProd);
            that.oMcComp.setSelectedKeys(TempComp);
        },


        onProfileSel: function (oEvent) {
            var sItem = that.oGModel.getProperty("/selItem"),
                aData = [],
                sProfile = sap.ui.getCore().byId("idListTab").getSelectedItems()[0].getTitle();
            // var objDep = sItem.OBJ_DEP + "_" + sItem.OBJ_COUNTER;
            var selected ;
            for (var i = 0; i < sItem.length; i++) {
                selected = sItem[i].getBindingContext().getProperty();
                aData.push({
                    "LOCATION_ID-": selected.LOCATION_ID,
                    "PRODUCT_ID": selected.PRODUCT_ID,
                    "COMPONENT": selected.COMPONENT,
                    "OBJ_DEP": selected.OBJ_DEP + "_" + selected.OBJ_COUNTER,
                    "PROFILE": sProfile
            });


            }

            var uri = "/v2/catalog/getProfileOD";
            $.ajax({
              url: uri,
              type: "post",
              contentType: "application/json",
              data: JSON.stringify({
                //   LOCATION_ID: sItem.LOCATION_ID,
                //   PRODUCT_ID : sItem.PRODUCT_ID,
                //   COMPONENT: sItem.COMPONENT,
                //   OBJ_DEP:objDep,
                //   PROFILE:sProfile.PROFILE
              }),
              dataType: "json",
              async: false,
              timeout: 0,
              error: function (data) {
                sap.m.MessageToast.show(JSON.stringify(data));
              },
              success: function (data) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Profile assigned successfully");
              },
            });
          }




      });
    }
  );
  