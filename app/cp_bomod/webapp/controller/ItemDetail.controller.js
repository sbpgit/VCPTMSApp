sap.ui.define([
	"cp/appf/cpbomod/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/ui/core/Fragment"
], function (BaseController, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Device,  Fragment) {
	"use strict";
	var that, oGModel;
	return BaseController.extend("cp.appf.cpbomod.controller.ItemDetail", {
		onInit: function () {
			that = this;
			// this.DetailHome = DetailHome;
			this.bus = sap.ui.getCore().getEventBus();
			that.oBomModel = new JSONModel();
            that.oBomOnPanelModel = new JSONModel();
            that.oCharModel = new JSONModel();
            this.oBomModel.setSizeLimit(1000);
            this.oCharModel.setSizeLimit(1000);
			oGModel = that.getOwnerComponent().getModel("oGModel");
		},

		onAfterRendering: function () {
            oGModel = that.getOwnerComponent().getModel("oGModel");
            sap.ui.core.BusyIndicator.show();
             var prdId = oGModel.getProperty("/prdId");
             var locId = oGModel.getProperty("/locId");

             this.getModel("BModel").read("/getBomOdCond", {
                filters: [
                    new Filter("LOCATION_ID", FilterOperator.EQ, locId),
                    new Filter("PRODUCT_ID", FilterOperator.EQ, prdId)
                  ],
                
                success: function (oData) {

                    if(oData.results.length === 0){
                        //that.byId("idBom").removeSelections(true);
                        that.byId("idBomPanel").setExpanded(true);
                        that.byId("idCharPanel").setExpanded(false);
                        // var data = [];
                        // that.oBomModel.setData({
                        //   results: data
                        // });
                        // that.oCharModel.setData({
                        //   charResults: data
                        // });
                        // that.byId("idChartab").setModel(that.oCharModel);
                        // that.onbomSearch();
                    } else {
                 
                        that.oBomModel.setData({
                            results: oData.results,
                        });
                        that.byId("idBom").setModel(that.oBomModel);
                        that.byId("idBom").removeSelections(true);
                        that.byId("idBomPanel").setExpanded(true);
                        that.byId("idCharPanel").setExpanded(false);
                        // that.onbomSearch();
                        }                
                        that.byId("bomSearch").setValue("");  
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });


        },

        onItemPress:function(){
            sap.ui.core.BusyIndicator.show();
            var selItem = this.byId("idBom").getSelectedItem().getCells()[2].getText();

            oGModel.setProperty("/objdep", selItem);

            this.getModel("BModel").read("/getODcharval", {
                filters: [
                    new Filter("OBJ_DEP", FilterOperator.EQ, selItem)
                  ],
                
                success: function (oData) {
                 
                  that.oCharModel.setData({
                    charResults: oData.results,
                  });
                  that.byId("idChartab").setModel(that.oCharModel);
                  that.byId("idBomPanel").setExpanded(false);
                  that.byId("idCharPanel").setExpanded(true);
                  that.byId("charSearch").setValue("");  
                  that.oncharSearch();
                  that.BomOnPanelNext();
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function () {
                    sap.ui.core.BusyIndicator.hide();
                  MessageToast.show("Failed to get data");
                },
              });

        },

        BomOnPanelNext:function(){

            var selItem = this.byId("idBom").getSelectedItem().getCells();

            var data = [{
                ITEM_NUM: selItem[0].getText(),
                COMPONENT: selItem[1].getText(),
                OBJ_DEP: selItem[2].getText(),
                OBJDEP_DESC: selItem[3].getText(),
                COMP_QTY: selItem[4].getText(),
                VALID_FROM: selItem[5].getText(),
                VALID_TO: selItem[6].getText(),
              }]


              that.oBomOnPanelModel.setData({
                BOMPanelresults: data,
            });
            that.byId("idBomOnNextPanel").setModel(that.oBomOnPanelModel);
            sap.ui.core.BusyIndicator.hide();


        },

        onbomSearch:function(oEvent){
            
            var query = "",
          oFilters = [];
          if(oEvent){
            // var query = oEvent.getParameter("value") || oEvent.getParameter("newValue")
            var query = oEvent.getParameters().query;
            }

            query = query.toUpperCase();

            sap.ui.core.BusyIndicator.show();
             var prdId = oGModel.getProperty("/prdId");
             var locId = oGModel.getProperty("/locId");

             oFilters.push(new Filter({
                filters: [
                    new Filter("LOCATION_ID", FilterOperator.EQ, locId),
                    new Filter("PRODUCT_ID", FilterOperator.EQ, prdId)
                ],
                and: true
            }));

            if(query !== ""){
             oFilters.push(new Filter({
                filters: [
                    new Filter("COMPONENT", FilterOperator.StartsWith, query),
                    new Filter("OBJ_DEP", FilterOperator.StartsWith, query)
                ],
                and: false
            }));
        }


             this.getModel("BModel").read("/getBomOdCond", {
                filters: [oFilters],
                // filters: [
                //     new Filter("LOCATION_ID", FilterOperator.EQ, locId),
                //     new Filter("PRODUCT_ID", FilterOperator.EQ, prdId),
                //     new Filter("COMPONENT", FilterOperator.StartsWith, query),
                //     new Filter("OBJ_DEP", FilterOperator.StartsWith, query),

                //   ],
                
                success: function (oData) {

                    
                        that.oBomModel.setData({
                            results: oData.results,
                        });
                        that.byId("idBom").setModel(that.oBomModel);
                        that.byId("idBom").removeSelections(true);
                        
                        that.byId("idBomPanel").setExpanded(true);
                        that.byId("idCharPanel").setExpanded(false);             
                        // that.byId("bomSearch").setValue("");  
                  sap.ui.core.BusyIndicator.hide();
                },
                error: function () {
                  MessageToast.show("Failed to get data");
                },
              });



        // if (query !== "") {
        //   oFilters.push(
        //     new Filter({
        //       filters: [
        //         new Filter("ITEM_NUM", FilterOperator.Contains, query),
        //         new Filter("OBJ_DEP", FilterOperator.Contains, query)
        //       ],
        //       and: false,
        //     })
        //   );
        // }
        // that.byId("idBom").getBinding("items").filter(oFilters);




        },

        oncharSearch: function(oEvent){
            var query = "",
          oFilters = [];
          if(oEvent){
            var query = oEvent.getParameter("value") || oEvent.getParameter("newValue")
            }

        if (query !== "") {
          oFilters.push(
            new Filter({
              filters: [
                new Filter("CLASS_NAME", FilterOperator.Contains, query),
                new Filter("CHAR_NAME", FilterOperator.Contains, query),
                new Filter("CHAR_VALUE", FilterOperator.Contains, query)
              ],
              and: false,
            })
          );
        }
        that.byId("idChartab").getBinding("items").filter(oFilters);

        }

	});

});