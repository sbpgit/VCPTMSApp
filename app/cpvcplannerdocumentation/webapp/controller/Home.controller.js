sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";
        var that, oGModel, k = 0, count = 0;
        return Controller.extend("cpapp.cpvcplannerdocumentation.controller.Home", {
            onInit: function () {
                that = this;
            },
            onAfterRendering: function () {
                var dataArray = [];
                var bModel = new sap.ui.model.json.JSONModel();
                var cModel = new sap.ui.model.json.JSONModel();
                that.oGModel = that.getOwnerComponent().getModel("oGModel");
                that.byId("idHTML").setContent();
                //*Loading Header Content data through local json file*//
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "model/headerContent.json",
                    dataType: "json",
                    async: false,
                    success: function (odata, textStatus, jqXHR) {
                        for (var i = 0; i <= odata.length - 1; i++) {
                            dataArray.push({
                                NodeID: odata[i].PAGEID,
                                HierarchyLevel: odata[i].HEIRARCHYLEVEL,
                                Description: odata[i].DESCRIPTION,
                                ParentNodeID: odata[i].PARENTNODEID,
                            });
                        }
                        var data = dataArray;
                        var flat = {};
                        for (var i = 0; i < data.length; i++) {
                            var key = 'id' + data[i].NodeID;
                            flat[key] = data[i];
                            flat[key].__metadata = "";
                        }
                        // child container array to each node
                        for (var i in flat) {
                            flat[i].children = []; // add children container
                        }
                        // populate the child container arrays
                        for (var i in flat) {
                            var parentkey = 'id' + flat[i].ParentNodeID;
                            if (flat[parentkey]) {
                                flat[parentkey].children.push(flat[i]);
                            }
                        }
                        // find the root nodes (no parent found) and create the hierarchy tree from them
                        var root = [];
                        for (var i in flat) {
                            var parentkey = 'id' + flat[i].ParentNodeID;
                            if (!flat[parentkey]) {
                                root.push(flat[i]);
                            }
                        }
                        var oJsonModel = new sap.ui.model.json.JSONModel();
                        oJsonModel.setData({ items: root });
                        var treeTable = that.byId("nodes");
                        treeTable.setModel(oJsonModel);
                        treeTable.expand(0);
                    }
                });
                //*End of local Header json file*//
                //*Loading Paragraph Content data through local json file*//
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "model/contentdata.json",
                    dataType: "json",
                    async: false,
                    success: function (oData, textStatus, jqXHR) {
                        that.oGModel.setProperty("/Content", oData);
                        that.oGModel.setProperty("/flag", "X");
                        that.byId("idHTML").setContent(oData[0].CONTENT);
                        that.oGModel.setProperty("/initialData", oData[0].CONTENT);
                        that.byId("detailTitle").setText(oData[0].DESCRIPTION);
                        that.byId("nodes").getItems()[0].addStyleClass("red");
                        that.oGModel.setProperty("/PAGEID", oData[0].PAGEID);
                    }
                });
            },

            // On press of any node
            onSelectionChange: function (oEvent) {
                that.byId("detailSearch").setValue();
                that.oGModel.setProperty("/flag", '');
                that.byId("idHTML").setContent();
                var pageId = oEvent.getSource().getBindingContext().getProperty().NodeID;
                that.oGModel.setProperty("/PAGEDES", oEvent.getSource().getBindingContext().getProperty().Description);
                var TreeTable = that.byId("nodes").getItems();
                for (var ii = 0; ii <= TreeTable.length - 1; ii++) {
                    if (pageId === TreeTable[ii].getBindingContext().getObject().NodeID) {
                        that.oGModel.setProperty("/PAGEID", pageId);
                        var oTreeTable = that.byId("nodes").getItems();
                        oTreeTable[ii].addStyleClass("red");
                    }
                    else {
                        var oTreeTable = that.byId("nodes").getItems();
                        oTreeTable[ii].removeStyleClass("red");
                    }
                }
                var data = that.oGModel.getProperty("/Content");
                for (var i = 0; i <= data.length - 1; i++) {
                    if (pageId === data[i].PAGEID) {
                        that.byId("idHTML").setContent(data[i].CONTENT);
                        that.oGModel.setProperty("/oContent", data[i].CONTENT)
                        that.byId("detailTitle").setText(data[i].DESCRIPTION);
                        var oTree = that.byId("nodes").getItems();
                        for (var kk = 0; k <= oTree.length - 1; kk++) {
                            if (data[i].PAGEID === oTree[kk].getBindingContext().getProperty().NodeID) {
                                var aTree = that.byId("nodes");
                                aTree.onItemExpanderPressed(aTree.getItems()[kk], true);
                                break;
                            }
                        }
                    }
                }
            },

            // Search function on Master Page
            onMasterSearch: function (sValue) {
                var searchVal = sValue.getParameter("newValue");
                var treeFilter = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, searchVal);
                var oBinding = this.byId("nodes").getBinding("items");
                this.byId("nodes").getBinding("items").filter(searchVal ? new sap.ui.model.Filter({
                    path: "Description",
                    operator: "Contains",
                    value1: searchVal,
                }) : null);
                if (searchVal.length > 1) {
                    oBinding.expandToLevel(3);
                }
                else {
                    var pageID = that.oGModel.getProperty("/PAGEID");
                    var treeTable = this.byId("nodes").getItems();
                    for (var i = 0; i < treeTable.length; i++) {
                        if (pageID === treeTable[i].getBindingContext().getObject().NodeID) {
                            treeTable[i].addStyleClass("red");
                        }
                        else {
                            treeTable[i].removeStyleClass("red");
                        }
                    }
                }
            },

            onTreeChange: function (event) {
                if (event.getParameters().reason === "filter") {
                    const model = this.getOwnerComponent().getModel("oGModel");
                    const query = model.getProperty("/query");
                    this.byId("nodes").expandToLevel(query ? 99 : 0);
                }
            },

            //Function for onClick to open a specific node. On change of pageId in this function and required pageId to be given, we will open the required page.
            myJsFunc: function (oEvent) {
                that.oGModel.setProperty("/flag", "Y");
                that.byId("idHTML").setContent();
                var pageId = 8;
                var pageId1 = 5;
                var pageId2 = 6;
                var oBinding = that.byId("nodes");
                var kBinging = that.byId("nodes").getItems();
                for (var kl = 0; kl < kBinging.length; kl++) {
                    if (kBinging[kl].getBindingContext().getObject().NodeID === pageId1) {
                        that.byId("nodes").onItemExpanderPressed(kBinging[kl], true);
                        break;
                    }
                }
                var lBinding = that.byId("nodes").getItems();
                for (var lk = 0; lk < lBinding.length; lk++) {
                    if (lBinding[lk].getBindingContext().getObject().NodeID === pageId2) {
                        that.byId("nodes").onItemExpanderPressed(lBinding[lk], true);
                        break;
                    }
                }
                var TreeTable = that.byId("nodes").getItems();
                var data1 = that.oGModel.getProperty("/Content");
                for (var ij = 0; ij <= TreeTable.length - 1; ij++) {
                    if (pageId === TreeTable[ij].getBindingContext().getObject().NodeID) {
                        TreeTable[ij].addStyleClass("red");
                    }
                    else {
                        TreeTable[ij].removeStyleClass("red");
                    }
                }
                for (var i = 0; i <= data1.length - 1; i++) {
                    if (pageId === data1[i].PAGEID) {
                        that.byId("idHTML").setContent(data1[i].CONTENT);
                        that.oGModel.setProperty("/clickContent", data1[i].CONTENT)
                        that.byId("detailTitle").setText(data1[i].DESCRIPTION);
                    }
                }
            },

            // Search on detail page
            ondetSearch: function (dValue) {
                this.byId("idHTML").setContent();
                if (that.oGModel.getProperty("/flag") === "X") {
                    var data = that.oGModel.getProperty("/initialData");
                }
                else if (that.oGModel.getProperty("/flag") === "Y") {
                    var data = that.oGModel.getProperty("/clickContent");
                }
                else {
                    var data = that.oGModel.getProperty("/oContent");
                }
                this.byId("idHTML").setContent(data);
                var searchVal = that.byId("detailSearch").getValue();
                var oBinding = this.byId("idHTML").getContent();
                if (searchVal !== "") {
                    var re = new RegExp(searchVal, "g"); // search for all instances
                    var newText = oBinding.replace(re, `<mark>${searchVal}</mark>`);
                    this.byId("idHTML").setContent();
                    this.byId("idHTML").setContent(newText);
                }
            },

            // For collapse all in master page button
            onCollapseBtn: function () {
                var oBinding = that.byId("nodes");
                oBinding.collapseAll();
                var aTreeTable = that.byId("nodes").getItems();
                for (var kk = 0; kk <= aTreeTable.length - 1; kk++) {
                    aTreeTable[kk].removeStyleClass("red");
                }
                var pageID = that.oGModel.getProperty("/PAGEID");
                var detailDes = that.byId("detailTitle").getText();
                if (aTreeTable.length === 6) {
                    for (var ll = 0; ll < aTreeTable.length; ll++) {
                        if (detailDes === aTreeTable[ll].getTitle() && pageID === aTreeTable[ll].getBindingContext().getObject().NodeID) {
                            aTreeTable[ll].addStyleClass("red");
                        }
                    }
                }
            },

            // For expand button in master page
            onExpandBtn: function () {
                var oBinding = that.byId("nodes");
                oBinding.expandToLevel(999);
                var oTree = that.byId("nodes").getItems();
                var pageID = that.oGModel.getProperty("/PAGEID");
                for (var jj = 0; jj <= oTree.length - 1; jj++) {
                    if (pageID === oTree[jj].getBindingContext().getObject().NodeID) {
                        var oTreeTable = that.byId("nodes").getItems();
                        oTreeTable[jj].addStyleClass("red");
                    }
                    else {
                        var oTreeTable = that.byId("nodes").getItems();
                        oTreeTable[jj].removeStyleClass("red");
                    }
                }
            },

            // ToggleOpenState property function
            onChange: function (oEvent) {
                var bExpanded = oEvent.getParameters().expanded;
                var oTree = that.byId("nodes").getItems();
                var pageID = that.oGModel.getProperty("/PAGEID");
                for (var jj = 0; jj <= oTree.length - 1; jj++) {
                    if (pageID === oTree[jj].getBindingContext().getObject().NodeID) {
                        oTree[jj].addStyleClass("red");
                    }
                    else {
                        oTree[jj].removeStyleClass("red");
                    }
                }
            }
        });
    });
