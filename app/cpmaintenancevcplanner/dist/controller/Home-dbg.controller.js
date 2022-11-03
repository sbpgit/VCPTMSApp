sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/Button"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, RichTextEditor, Dialog, mobileLibrary, Text, Button) {
        "use strict";
        var that, oGModel, k = 0, count = 0;
        var DialogType = mobileLibrary.DialogType;
        var ButtonType = mobileLibrary.ButtonType;

        return Controller.extend("cpapp.cpmaintenancevcplanner.controller.Home", {
            onInit: function () {
                that = this;
                var oModel = new JSONModel();
                if (!this._cDialog) {
                    this._cDialog = sap.ui.xmlfragment("cpapp.cpmaintenancevcplanner.view.Edit", this);
                    this._cDialog.setModel(this.getView().getModel());
                    this.getView().addDependent(this._cDialog);
                }
                if (!this._pDialog) {
                    this._pDialog = sap.ui.xmlfragment("cpapp.cpmaintenancevcplanner.view.Create", this);
                    this._pDialog.setModel(this.getView().getModel());
                    this.getView().addDependent(this._pDialog);
                }
            },
            onAfterRendering: function () {
                sap.ui.core.BusyIndicator.show();
                var dataArray = [];
                var bModel = new sap.ui.model.json.JSONModel();
                var cModel = new sap.ui.model.json.JSONModel();
                that.oGModel = that.getOwnerComponent().getModel("oGModel");
                // //*Loading Header Content data through local json file*//
                // jQuery.ajax({
                //     type: "GET",
                //     contentType: "application/json",
                //     url: "model/header.json",
                //     dataType: "json",
                //     async: false,
                //     success: function (data, textStatus, jqXHR) {
                    this.getView().getModel("oModel").read("/getPageHdr", {
                        success: function (oData) {
                            var data =oData.results;
                        that.oGModel.setProperty("/COMBOID", data);
                        for (var i = 0; i <= data.length - 1; i++) {
                            dataArray.push({
                                NodeID: data[i].PAGEID,
                                HierarchyLevel: data[i].HEIRARCHYLEVEL,
                                Description: data[i].DESCRIPTION,
                                ParentNodeID: data[i].PARENTNODEID,
                            });
                        }
                        var treeTable = that.byId("nodes");
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
                        treeTable.setModel(oJsonModel);
                        that.byId("nodes").getItems()[0].addStyleClass("red");
                    }
                });
                //*End of local Header json file*//

                //*Loading Paragraph Content data through local json file*//
                // jQuery.ajax({
                //     type: "GET",
                //     contentType: "application/json",
                //     url: "model/data.json",
                //     dataType: "json",
                //     async: false,
                //     success: function (data, textStatus, jqXHR) {
                    this.getView().getModel("oModel").read("/getPagePgrh", {
                        success: function (oData) {
                            var data = oData.results;
                        that.oGModel.setProperty("/Content", data);
                        that.byId("videoPanel").setVisible(true);
                        that.byId("content").setVisible(false);
                        that.byId("image").setVisible(false);
                        that.byId("textContent").setVisible(false);
                        if (k > 0) {
                            that.oRichTextEditor.destroy();
                        }
                        k = k + 1;
                        that.oRichTextEditor = new RichTextEditor("myRTE" + k, {
                            width: "100%",
                            height: "100%",
                            editable: true,
                            customToolbar: true,
                            showGroupFont: true,
                            showGroupLink: true,
                            showGroupInsert: true,
                            value: data[0].CONTENT,
                        });
                        that.getView().byId("videoPanel").addContent(that.oRichTextEditor);
                        that.oGModel.setProperty("/DetailsData", data[0]);
                        that.byId("detailTitle").setText(data[0].DESCRIPTION);
                        that.oGModel.setProperty("/editData", data);
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                    }
                });
                //*End of local json file// 
                sap.ui.core.BusyIndicator.hide();
                that.byId("idHTML").setContent();
            },
            onSelectionChange: function (oEvent) {
                that.byId("htmlText").setValue();
                that.byId("textLength").setText();
                that.byId("idHTML").setContent("");
                var pageId = oEvent.getSource().getBindingContext().getProperty().NodeID;
                var TreeTable = that.byId("nodes").getItems();
                for (var ii = 0; ii <= TreeTable.length - 1; ii++) {
                    if (pageId === TreeTable[ii].getBindingContext().getObject().NodeID) {
                        TreeTable[ii].addStyleClass("red");
                    }
                    else {
                        TreeTable[ii].removeStyleClass("red");
                    }
                }
                var data = that.oGModel.getProperty("/Content");
                for (var i = 0; i <= data.length - 1; i++) {
                    if (pageId === data[i].PAGEID) {
                        that.byId("videoPanel").setVisible(true);
                        that.byId("content").setVisible(false);
                        that.byId("image").setVisible(false);
                        that.byId("textContent").setVisible(false);
                        if (k > 0) {
                            that.oRichTextEditor.destroy();
                        }
                        k = k + 1;
                        that.oRichTextEditor = new RichTextEditor("myRTE" + k, {
                            width: "100%",
                            height: "100%",
                            editable: true,
                            customToolbar: true,
                            showGroupFont: true,
                            showGroupLink: true,
                            showGroupInsert: true,
                            value: data[i].CONTENT,
                        });
                        that.getView().byId("videoPanel").addContent(that.oRichTextEditor);
                        that.byId("detailTitle").setText(data[i].DESCRIPTION);
                        that.oGModel.setProperty("/DetailsData", data[i]);                     
                    }
                }
            },
            onShown: function () {
                that.byId("idHTML").setContent();
                var htmlText = that.byId("videoPanel").getContent()[0].getValue();
                that.byId("htmlText").setValue(htmlText);
                that.byId("textLength").setText(htmlText.length);
                that.byId("idHTML").setContent(htmlText);

            },
            onSaved: function () {
                
                var htmlText = that.byId("htmlText").getValue();
                if (htmlText.length > 0) {
                    sap.ui.core.BusyIndicator.show();
                    that.byId("textLength").setText();
                    that.byId("htmlText").setValue("");
                    var detData = that.oGModel.getProperty("/DetailsData");
                    var pageid = detData.PAGEID;
                    var description = detData.DESCRIPTION;
                    var oModel = that.getView().getModel("oModel");
                    oModel.callFunction("/moveData", {
                        method: "GET",
                        urlParameters: {
                            Flag:"i",
                            CONTENT: htmlText,
                            PAGEID: pageid,
                            DESCRIPTION: description
                                                     
                        },
                        success: function (oData, response) {
                            sap.ui.core.BusyIndicator.hide();                          
                            that.onAfterRendering();
                          sap.m.MessageToast.show("Paragraph file updated successfully");  
                        },
                        error: function (e) {
                            sap.m.MessageToast.show(e.Message);  
                        }
                    });
                }
                else {
                    sap.m.MessageToast.show("No data selected")
                }
            },
            onCollapsePress: function () {
                var selected = that.byId("nodes").getSelectedItems();
                var multiData = that.oGModel.getProperty("/COMBOID");
                var newID = multiData.length + 1;
                sap.ui.getCore().byId("Pageid").setValue(newID);
                if (selected.length === 0) {
                    this._pDialog.open();
                    sap.ui.getCore().byId("idCreate").setVisible(true);
                    sap.ui.getCore().byId("idCreate").setValue("New Parent Node");
                    sap.ui.getCore().byId("idNodeID").setValue("0");
                    var newLevel = 1;
                    sap.ui.getCore().byId("idHL").setValue(newLevel);
                }
                else if (selected.length === 1) {
                    this._pDialog.open();
                    var selectedPageDesc = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;
                    var selectedParentNodeId = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;
                    var heirarchyLevel = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().HierarchyLevel;
                    var newLevel = heirarchyLevel + 1;
                    sap.ui.getCore().byId("idCreate").setVisible(true);
                    sap.ui.getCore().byId("idCreate").setValue(selectedPageDesc);
                    sap.ui.getCore().byId("idNodeID").setValue(selectedParentNodeId);
                    sap.ui.getCore().byId("idHL").setValue(newLevel);
                }
                else {
                    sap.m.MessageToast.show("Select only one node");
                }
            },
            onClose: function () {
                if (this._pDialog) {
                    this._pDialog.close();
                    sap.ui.getCore().byId("idHL").setValue("");
                    sap.ui.getCore().byId("Desc").setValue("");
                    sap.ui.getCore().byId("idContent").setValue("");
                }
            },
            onCreate: function () {
                sap.ui.core.BusyIndicator.show();
                if (sap.ui.getCore().byId("Pageid").getValue() === "") {
                    sap.m.MessageToast.show("Please fill your details");
                    sap.ui.core.BusyIndicator.hide();
                }
                else if (sap.ui.getCore().byId("idHL").getValue() === "") {
                    sap.m.MessageToast.show("Please fill your details");
                    sap.ui.core.BusyIndicator.hide();
                }
                else if (sap.ui.getCore().byId("Desc").getValue() === "") {
                    sap.m.MessageToast.show("Please fill your details");
                    sap.ui.core.BusyIndicator.hide();
                }
                else if (sap.ui.getCore().byId("idCreate").getValue() === "") {
                    sap.m.MessageToast.show("Please fill your details");
                    sap.ui.core.BusyIndicator.hide();
                }
                else if (sap.ui.getCore().byId("idContent").getValue() === "") {
                    sap.m.MessageToast.show("Please fill your details");
                    sap.ui.core.BusyIndicator.hide();
                }
                else {
                    var pageid = sap.ui.getCore().byId("Pageid").getValue();
                    var description = sap.ui.getCore().byId("Desc").getValue();
                    var parentnodeid = sap.ui.getCore().byId("idNodeID").getValue();
                    var heirarchylevel = sap.ui.getCore().byId("idHL").getValue();
                    var content = sap.ui.getCore().byId("idContent").getValue();
                    var oModel = this.getView().getModel("oModel");
                    oModel.callFunction("/addPAGEHEADER", {
                        method: "GET",
                        urlParameters: {
                            Flag1: "n",
                            PAGEID: pageid,
                            DESCRIPTION: description,
                            PARENTNODEID: parentnodeid,
                            HEIRARCHYLEVEL: heirarchylevel,
                        },
                        success: function (oData, response) {
                            
                            sap.m.MessageToast.show("Successfully updated in Header File");
                        },
                        error: function (e) {
                            sap.m.MessageToast.show("Failed to Update in PAGEHEADER");
                        }
                    });
                    oModel.callFunction("/addPAGEPARAGRAPH", {
                        method: "GET",
                        urlParameters: {
                            Flag1: "n",
                            PAGEID: pageid,
                            DESCRIPTION: description,
                            CONTENT: content
                        },
                        success: function (oData, response) {
                            sap.m.MessageToast.show("Successfully updated in Content File");
                            that.onClose();
                            that.onAfterRendering();
                            that.byId("idHTML").setContent(); 
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (e) {
                            sap.m.MessageToast.show("Failed to Update in PAGEPARAGRAPH");
                        }
                    });
                }
            },
            onEdit: function (oEvent) {
                var oselectedLength = that.byId("nodes").getSelectedItems().length;
                if (oselectedLength === 1) {
                    this._cDialog.open();
                    var pageID = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;
                    var descriptioN = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;
                    var parentNodeID = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().ParentNodeID;
                    var heirarchyLevel = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().HierarchyLevel;
                    sap.ui.getCore().byId("Pageidedit").setValue(pageID);
                    sap.ui.getCore().byId("Pnodeedit").setValue(descriptioN);
                    sap.ui.getCore().byId("Pnodeedid").setValue(parentNodeID);
                    sap.ui.getCore().byId("idHLedit").setValue(heirarchyLevel);
                    var paraData = that.oGModel.getProperty("/editData");
                    for (var jj = 0; jj <= paraData.length - 1; jj++) {
                        if (pageID === paraData[jj].PAGEID) {
                            var content = paraData[jj].CONTENT;
                        }
                    }
                    sap.ui.getCore().byId("idContentedit").setValue(content);
                }
                else if (oselectedLength === 0) {
                    sap.m.MessageToast.show("Select atleast one node");
                }
                else {
                    sap.m.MessageToast.show("Select only one node");
                }
            },
            onSubmit: function () {
                sap.ui.core.BusyIndicator.show();
                var pageID = sap.ui.getCore().byId("Pageidedit").getValue();
                var descriptioN = sap.ui.getCore().byId("Pnodeedit").getValue();
                var parentNodeID = sap.ui.getCore().byId("Pnodeedid").getValue();
                var heirarchyLevel = sap.ui.getCore().byId("idHLedit").getValue();
                var content = sap.ui.getCore().byId("idContentedit").getValue();
                var oModel = this.getView().getModel("oModel");
                oModel.callFunction("/editPAGEHEADER", {
                    method: "GET",
                    urlParameters: {
                        Flag1:"e",
                        PAGEID: pageID,
                        DESCRIPTION: descriptioN,
                        PARENTNODEID: parentNodeID,
                        HEIRARCHYLEVEL: heirarchyLevel,
                    },
                    success: function (oData, response) {
                        
                        sap.m.MessageToast.show("Updated successfully in Header Page");


                    },
                    error: function (e) {
                        sap.m.MessageToast.show("Failed to Update in PAGEHEADER");
                    }
                });

                oModel.callFunction("/editPAGEPARAGRAPH", {
                    method: "GET",
                    urlParameters: {
                        Flag1:"e",
                        PAGEID: pageID,
                        DESCRIPTION: descriptioN,
                        CONTENT:content
                    },
                    success: function (oData, response) {
                        that.onClose1();
                        that.onAfterRendering();
                        that.byId("idHTML").setContent(); 
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Updated successfully in Paragraph Page");


                    },
                    error: function (e) {
                        sap.m.MessageToast.show("Failed to Update in PAGEHEADER");
                    }
                });
                
            },
            onClose1: function () {
                if (this._cDialog) {
                    this._cDialog.close();
                }
            },
            onTreeChange: function (event) {
                if (event.getParameters().reason === "filter") {
                    const model = this.getOwnerComponent().getModel("oGModel");
                    const query = model.getProperty("/query");
                    this.byId("nodes").expandToLevel(query ? 99 : 0);
                }
            },
            onDelete: function () {
                var oselectedLength = that.byId("nodes").getSelectedItems().length;
                if (oselectedLength === 1) {
                    var pageTitle = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().Description;
                    if (!this.oApproveDialog) {
                        this.oApproveDialog = new Dialog({
                            type: DialogType.Message,
                            title: pageTitle,
                            content: new Text({ text: "Do you want to delete this node?" }),
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "Submit",
                                press: function () {
                                    sap.ui.core.BusyIndicator.show();
                                    var pageID = that.byId("nodes").getSelectedItems()[0].getBindingContext().getObject().NodeID;
                                    var oModel = this.getView().getModel("oModel");
                                    oModel.callFunction("/deletePAGEHEADER", {
                                        method: "GET",
                                        urlParameters: {
                                            Flag1: "d",
                                            PAGEID: pageID,
                                        },
                                        success: function (oData, response) {
                                            sap.m.MessageToast.show("Deletion successfull in Header Json File");
                                        },
                                        error: function (e) {
                                            sap.m.MessageToast.show("Failed to delete in PAGEHEADER");
                                        }
                                    });
                                    oModel.callFunction("/deletePAGEPARAGRAPH", {
                                        method: "GET",
                                        urlParameters: {
                                            Flag1: "d",
                                            PAGEID: pageID,
                                        },
                                        success: function (oData, response) {
                                            sap.m.MessageToast.show("Deletion successfull in Data Json File");
                                            that.onAfterRendering();
                                            that.byId("idHTML").setContent();
                                            that.oApproveDialog.close();
                                            sap.ui.core.BusyIndicator.hide();
                                        },
                                        error: function (e) {
                                            sap.ui.core.BusyIndicator.hide();
                                            sap.m.MessageToast.show("Failed to delete in PAGEPARAGRAPH");
                                        }
                                    });
                                }.bind(this)
                            }),
                            endButton: new Button({
                                text: "Cancel",
                                press: function () {
                                    this.oApproveDialog.close();
                                }.bind(this)
                            })
                        });
                    }
                    this.oApproveDialog.open();
                }
                else if (oselectedLength === 0) {
                    sap.m.MessageToast.show("Select atleast one node");
                }
                else {
                    sap.m.MessageToast.show("Select only one node");
                }
            },
            myJsFunc: function (oEvent) {
                that.byId("idHTML").setContent();
                var pageId = 8;
                var oBinding = that.byId("nodes");
                oBinding.expandToLevel(3);
                var TreeTable = that.byId("nodes").getItems();
                var data1 = that.oGModel.getProperty("/Content");
                for (var ij = 0; ij <= TreeTable.length - 1; ij++) {
                    if (pageId === TreeTable[ij].getBindingContext().getObject().NodeID) {
                        TreeTable[ij].addStyleClass("red");
                        oBinding.expand[ij];
                    }
                    else {
                        TreeTable[ij].removeStyleClass("red");
                    }
                }
                for (var i = 0; i <= data1.length - 1; i++) {
                    if (pageId === data1[i].PAGEID) {
                        that.byId("idHTML").setContent(data1[i].CONTENT);
                        that.byId("detailTitle").setText(data1[i].DESCRIPTION);
                    }
                }
            },
            onNavPress:function(){
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                // var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation"); 
                //  var hashUrl=(oCrossAppNav && oCrossAppNav.hrefForExternal({
                //     target: { semanticObject : "vcpdocdisplay", action: "Display" }
                 
                //   })
                //  );
                //   oCrossAppNav.toExternal({target: {shellHash: hashUrl}});

                  var hash = sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then( function (oService) {

                    oService.hrefForExternalAsync({
                        target : {
                            semanticObject: "vcpdocdisplay",
                            action: "Display"
                        }
                    })
                 });
                //  var oCrossAppNav = sap.ushell.Container.getServiceAsync("CrossApplicationNavigation");
                //  oCrossAppNav.toExternal({target: {shellHash: hash}});
                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then( function (oService) {

                    oService.toExternal({target: {shellHash: hash}})
                        
                 });


                } 
            }
        });
    });
