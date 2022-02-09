sap.ui.define(
    [
      "cp/appf/cpsaleshconfig/controller/BaseController",
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
  
      return BaseController.extend("cp.appf.cpsaleshconfig.controller.Home", {
        onInit: function () {
          that = this;
          that.oListModel = new JSONModel();
  
          that.oLocModel = new JSONModel();
          that.oProdModel = new JSONModel();
          that.osalDocModel = new JSONModel();
  
          this.oListModel.setSizeLimit(5000);
          that.oLocModel.setSizeLimit(1000);
          that.oProdModel.setSizeLimit(1000);
          that.osalDocModel.setSizeLimit(1500);
        },
        onAfterRendering: function () {
          that = this;
          that.oList = this.byId("idTab");
          that.oMcLoc = this.byId("idLoc");
          that.oMcProd = this.byId("idProd");
          that.oMcsalDoc = this.byId("idSalesDoc");
  
          that.oList.removeSelections();
          if (that.oList.getBinding("items")) {
            that.oList.getBinding("items").filter([]);
          }
          // Calling function
          this.getData();
        },
        getData: function () {
          sap.ui.core.BusyIndicator.show();
          this.getModel("BModel").read("/getSalesh", {
            success: function (oData) {
              that.aLocation = [];
              that.aProduct = [];
              that.aSalDoc = [];
  
              that.SelLoc = [];
              that.SelProd = [];
              that.SelSalDoc = [];
  
              var aKeysLoc = [],
                aKeysProd = [],
                aKeysSalDoc = [];
              that.TableData = oData.results;
  
              for (var i = 0; i < oData.results.length; i++) {
                if (that.aLocation.indexOf(oData.results[i].LOCATION_ID) === -1) {
                  that.aLocation.push(oData.results[i].LOCATION_ID);
                  if (oData.results[i].LOCATION_ID !== "") {
                    that.oLocData = {
                      LOCATION_ID: oData.results[i].LOCATION_ID,
                    };
                    that.SelLoc.push(that.oLocData);
                    aKeysLoc[i] = that.oLocData.LOCATION_ID;
                  }
                }
                if (that.aProduct.indexOf(oData.results[i].PRODUCT_ID) === -1) {
                  that.aProduct.push(oData.results[i].PRODUCT_ID);
                  if (oData.results[i].PRODUCT_ID !== "") {
                    that.oProdData = {
                      PRODUCT_ID: oData.results[i].PRODUCT_ID,
                    };
                    that.SelProd.push(that.oProdData);
                    aKeysProd[i] = that.oProdData.PRODUCT_ID;
                  }
                }
                    if(that.aSalDoc.length === 0){
                        that.aSalDoc.push("All");
                    }

                if (that.aSalDoc.indexOf(oData.results[i].SALES_DOC) === -1) {
                  that.aSalDoc.push(oData.results[i].SALES_DOC);
                  if (oData.results[i].SALES_DOC !== "") {
                    that.oCompData = {
                        SALES_DOC: oData.results[i].SALES_DOC,
                    };
                    that.SelSalDoc.push(that.oCompData);
                    aKeysSalDoc[i] = that.oCompData.SALES_DOC;
                  }
                }
              }
  
              that.oListModel.setData({
                results: oData.results,
              });
              that.oList.setModel(that.oListModel);

              that.SelSalDoc.unshift({
                SALES_DOC: "All",
                  });

                    
              that.oLocModel.setData({ resultsLoc: that.SelLoc });
              that.oProdModel.setData({ resultsProd: that.SelProd });
              that.osalDocModel.setData({ resultsSalesDoc: that.SelSalDoc });
  
              that.oMcLoc.setModel(that.oLocModel);
              that.oMcProd.setModel(that.oProdModel);
              that.oMcsalDoc.setModel(that.osalDocModel);
  
              that.oMcLoc.setSelectedKeys(that.aLocation);
              that.oMcProd.setSelectedKeys(that.aProduct);
              that.oMcsalDoc.setSelectedKeys(that.aSalDoc);
              sap.ui.core.BusyIndicator.hide();
            },
            error: function (oRes) {
              MessageToast.show("error");
            },
          });
        },

        onhandlePress:function(oEvent){
            that.oGModel = that.getModel("oGModel");
            var sTableItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
            that.oGModel.setProperty("/selItem", sTableItem);
            that.oGModel.setProperty("/sPrdid", sTableItem.PRODUCT_ID);
            that.oGModel.setProperty("/sLocid", sTableItem.LOCATION_ID);
            that.oGModel.setProperty("/date", oEvent.getSource().getSelectedItem().getCells()[2].getText());



            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Detail", {}, true);
        },

        handleSelection:function(oEvent){
			that.selLoc = that.byId("idLoc").getSelectedKeys();
            that.selPrd = that.byId("idProd").getSelectedKeys();
			// that.selSalDoc = that.byId("idSalesDoc").getSelectedKeys();

// var unselected =that.byId("idSalesDoc")._getUnselectedItems();

                // for(var i=0; i<unselected.length; i++){
                //     if(unselected[i].getText() === "All"){
                //         var selected = "All";
                //     }
                // }


                if(oEvent.getParameters().id.includes("idSalesDoc") === true){
            var selected = oEvent.getParameters("listItem").changedItem.getText();
              var items = this.byId("idTab").getItems();
              var selItems = that.byId("idSalesDoc").getItems();
                if(selected === "All" && oEvent.getParameter("selected")){
                    that.byId("idSalesDoc").setSelectedItems(that.byId("idSalesDoc").getItems());
                } else if(selected === "All" && !oEvent.getParameter("selected")){
                    that.byId("idSalesDoc").removeAllSelectedItems();
                } else if(selected !== "All" && !oEvent.getParameter("selected") && items.length - 1 === selItems.length){
                    that.byId("idSalesDoc").removeSelectedItem(that.byId("idSalesDoc").getItems()[0]);
              }  else if(selected !== "All" && oEvent.getParameter("selected") && items.length - 1 === selItems.length){
                that.byId("idSalesDoc").setSelectedItems(that.byId("idSalesDoc").getItems()[0]);
              } else if(selected === "All" && items.length === 1 ){ 
                that.byId("idSalesDoc").removeSelectedItem(that.byId("idSalesDoc").getItems()[0]);
              }
            }

              that.selSalDoc = that.byId("idSalesDoc").getSelectedKeys();



            var oFilters = [];

			// if(that.selected1.length> 0){

			if (that.selLoc.length > 0) {
				for (var i = 0; i < that.selLoc.length; i++) {

					oFilters.push(new Filter("LOCATION_ID", FilterOperator.EQ, that.selLoc[i]));

				}
			}
			if (that.selPrd.length > 0) {
				for (var j = 0; j < that.selPrd.length; j++) {

					oFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, that.selPrd[j]));

				}
			}

			if (that.selSalDoc.length > 0) {
				for (var k = 0; k < that.selSalDoc.length; k++) {

					oFilters.push(new Filter("SALES_DOC", FilterOperator.EQ, that.selSalDoc[k]));

				}
			}
			that.byId("idTab").getBinding("items").filter(oFilters);
        }


        });
    });
