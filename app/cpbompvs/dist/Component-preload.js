//@ui5-bundle cpapp/cpbompvs/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpapp/cpbompvs/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpapp/cpbompvs/model/models"],function(e,t,i){"use strict";return e.extend("cpapp.cpbompvs.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpapp/cpbompvs/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpapp.cpbompvs.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpapp/cpbompvs/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpapp.cpbompvs.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpapp/cpbompvs/controller/Details.controller.js":function(){sap.ui.define(["cpapp/cpbompvs/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,t,i,s,a,o,n){"use strict";var l,u;return e.extend("cpapp.cpbompvs.controller.Details",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cpapp.cpbompvs","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cpapp.cpbompvs","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Details").attachPatternMatched(this._onPatternMatched.bind(this));if(n.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var e=new t({expanded:true,midExists:false,busy:true,delay:0});this.setModel(e,"appView");if(n.support.touch){n.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onExit:function(){this.bus.unsubscribe("cpapp.cpbompvs","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cpapp.cpbompvs","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!n.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,t,i){this.oFlexibleColumnLayout.addBeginColumnPage(i)},addDetailPage:function(e,t,i){var s=this.oFlexibleColumnLayout.getMidColumnPages(),a=false;for(var o=0;o<s.length;o++){if(s[o].getProperty("viewName")===i.getViewName()){a=true;break}else{a=false}}if(!a){this.oFlexibleColumnLayout.addMidColumnPage(i)}},toBeginPage:function(e,t,i){var s=this.oFlexibleColumnLayout.getBeginColumnPages();for(var a=0;a<s.length;a++){if(s[a].getProperty("viewName")===i.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[a]);break}}},toDetailPage:function(e,t,i){var s=this.oFlexibleColumnLayout.getMidColumnPages();for(var a=0;a<s.length;a++){if(s[a].getProperty("viewName")===i.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[a]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(s.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cpapp.cpbompvs.view.ItemDetail",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(s[0]);s[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cpapp.cpbompvs.view.ItemMaster",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!n.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}}})});
},
	"cpapp/cpbompvs/controller/ItemDetail.controller.js":function(){sap.ui.define(["cpapp/cpbompvs/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,s,r,o,a,i,n){"use strict";var l,d;return e.extend("cpapp.cpbompvs.controller.ItemDetail",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();l.oAssignModel=new r;l.oStruModelDetail=new r;l.oAssinModel=new r;l.oAssignModel.setSizeLimit(1e3);l.oStruModelDetail.setSizeLimit(1e3);d=l.getOwnerComponent().getModel("oGModel");d.setProperty("/resetFlag","")},onAfterRendering:function(){sap.ui.core.BusyIndicator.show();d=l.getOwnerComponent().getModel("oGModel");l.byId("detailNode").setSelectedKey("assignNode");l.byId("idTextfrom").setVisible(true);l.byId("fromDate").setVisible(true);l.byId("idTextto").setVisible(true);l.byId("toDate").setVisible(true);l.byId("idButton").setVisible(true);l.byId("fromDate").setValue("");l.byId("toDate").setValue("");l.byId("sturList").removeSelections();var e=d.getProperty("/SelectedLoc");var s=d.getProperty("/SelectedProd");this.getModel("BModel").read("/getPVSBOM",{filters:[new o("PRODUCT_ID",a.EQ,s),new o("LOCATION_ID",a.EQ,e)],success:function(e){sap.ui.core.BusyIndicator.hide();l.oAssignModel.setData({results:e.results});l.byId("sturList").setModel(l.oAssignModel)},error:function(e){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}});if(d.getProperty("/resetFlag")===""){this.getModel("BModel").read("/genCompStrcNode",{filters:[new o("PRODUCT_ID",a.EQ,s),new o("LOCATION_ID",a.EQ,e)],success:function(e){d.setProperty("/tableData",e.results);l.aReqTabData();var t=d.getProperty("/reqData");l.oStruModelDetail.setData({struDetailresults:t.Requests});l.byId("StrunodeTable").setModel(l.oStruModelDetail);sap.ui.core.BusyIndicator.hide()},error:function(e){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})}},aReqTabData:function(e){var t=e?e.results:d.getProperty("/tableData"),s={Requests:[]},r=[],o,a,i,n=function(e,t,s){var r=JSON.parse(JSON.stringify(e)),o=JSON.parse(JSON.stringify(t)),a=JSON.parse(JSON.stringify(e));o._isParent=false;if(r.children.length===0){a._isParent=false;r.children.push(a)}r.children.push(o);return r};for(var l=0;l<t.length;l++){o=r.indexOf(t[l].STRUC_NODE);if(o===-1){r.push(t[l].STRUC_NODE);t[l].children=[];t[l]._isParent=true;s.Requests.push(t[l])}else{a=s.Requests[o];i=n(a,t[l],"Reqs");s.Requests[o]=i}}d.setProperty("/reqData",s)},onStruNodeSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=d.getProperty("/tableData"),r=[];if(t&&t.trim()!==""){t=t.trim().toLocaleUpperCase();for(var o=0;o<s.length;o++){if(s[o].STRUC_NODE.includes(t)||s[o].COMPONENT.includes(t)){r.push(s[o])}}}else{r=s}l.aReqTabData({results:r});var a=d.getProperty("/reqData");l.oStruModelDetail.setData({struDetailresults:a.Requests})},onTabChange:function(e){var t=l.byId("detailNode").getSelectedKey();if(t==="assignNode"){l.byId("idTextfrom").setVisible(true);l.byId("fromDate").setVisible(true);l.byId("idTextto").setVisible(true);l.byId("toDate").setVisible(true);l.byId("idButton").setVisible(true)}else if(t==="StruNodeDetail"){l.byId("idTextfrom").setVisible(false);l.byId("fromDate").setVisible(false);l.byId("idTextto").setVisible(false);l.byId("toDate").setVisible(false);l.byId("idButton").setVisible(false)}},onGetData:function(e){sap.ui.core.BusyIndicator.show();d=l.getOwnerComponent().getModel("oGModel");l.byId("sturList").removeSelections();var s=d.getProperty("/SelectedLoc");var r=d.getProperty("/SelectedProd");var i=new Date(l.byId("fromDate").getDateValue()),n=new Date(l.byId("toDate").getDateValue());var u,c,g,p;var f=i.getMonth()+1,D=n.getMonth()+1;if(f<10){u="0"+f}else{u=f}if(i.getDate()<10){c="0"+i.getDate()}else{c=i.getDate()}if(D<10){g="0"+D}else{g=D}if(n.getDate()<10){p="0"+n.getDate()}else{p=n.getDate()}i=i.getFullYear()+"-"+u+"-"+c;n=n.getFullYear()+"-"+g+"-"+p;this.getModel("BModel").read("/getPVSBOM",{filters:[new o("PRODUCT_ID",a.EQ,r),new o("LOCATION_ID",a.EQ,s),new o("VALID_FROM",a.EQ,i),new o("VALID_TO",a.EQ,n)],success:function(e){sap.ui.core.BusyIndicator.hide();l.oAssignModel.setData({results:e.results});l.byId("sturList").setModel(l.oAssignModel)},error:function(e){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})},onResetDate:function(){l.byId("fromDate").setValue("");l.byId("toDate").setValue("");d.setProperty("/resetFlag","X");l.onAfterRendering()},onDetailSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=[];t=t?t.trim():"";if(t!==""){s.push(new o({filters:[new o("COMPONENT",a.Contains,t),new o("STRUC_NODE",a.Contains,t)],and:false}))}l.byId("sturList").getBinding("items").filter(s)},onAssign:function(e){if(!l._oStruNode){l._oStruNode=sap.ui.xmlfragment("cpapp.cpbompvs.view.StructureNodes",l);l.getView().addDependent(l._oStruNode)}if(l.byId("sturList").getSelectedItems().length===1){var s=d.getProperty("/SelectedNode");var r=l.byId("sturList").getSelectedItem().getCells()[1].getText();var i=l.byId("sturList").getSelectedItem().getCells()[0].getText();d.setProperty("/SelecteComponent",r);d.setProperty("/SelecteItem",i);this.getModel("BModel").read("/getPVSNodes",{filters:[new o("PARENT_NODE",a.EQ,s),new o("NODE_TYPE",a.EQ,"SN")],success:function(e){l.oAssinModel.setData({results:e.results});sap.ui.getCore().byId("sturList").setModel(l.oAssinModel);l._oStruNode.open()},error:function(){t.show("Failed to get data")}})}else{t.show("Please select compponent to assign structure node")}},handleStruSelection:function(e){l=this;var t=d.getProperty("/SelectedLoc"),s=d.getProperty("/SelectedProd"),r=d.getProperty("/SelecteComponent"),o=d.getProperty("/SelecteItem"),a=e.getParameter("selectedItems")[0].getTitle();l.getModel("BModel").callFunction("/genCompSN",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:s,COMPONENT:r,ITEM_NUM:o,STRUC_NODE:a},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Structure Node assigned successfully");d.setProperty("/resetFlag","");l.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})},handleStruSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=[];t=t?t.trim():"";if(t!==""){s.push(new o({filters:[new o("CHILD_NODE",a.Contains,t),new o("NODE_DESC",a.Contains,t)],and:false}))}l._oStruNode.getBinding("items").filter(s)},onStructureNodeDel:function(e){var t=d.getProperty("/SelectedLoc"),s=d.getProperty("/SelectedProd"),r=e.getSource().getParent().getCells()[0].getText(),o=e.getSource().getParent().getCells()[1].getText();l.getModel("BModel").callFunction("/genCompSN",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:s,ITEM_NUM:r,COMPONENT:o,STRUC_NODE:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Structure Node deleted");l.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})}})});
},
	"cpapp/cpbompvs/controller/ItemMaster.controller.js":function(){sap.ui.define(["cpapp/cpbompvs/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,t,s,o,i,a,c){"use strict";var l,d;return e.extend("cpapp.cpbompvs.controller.ItemMaster",{onInit:function(){l=this;l.oModel=new s;this.locModel=new s;this.prodModel=new s;this.accModel=new s;this._oCore=sap.ui.getCore();this.locModel=new s;this.prodModel=new s;this.accModel=new s;this._oCore=sap.ui.getCore();if(!this._valueHelpDialogLoc){this._valueHelpDialogLoc=sap.ui.xmlfragment("cpapp.cpbompvs.view.LocDialog",this);this.getView().addDependent(this._valueHelpDialogLoc)}if(!this._valueHelpDialogProd){this._valueHelpDialogProd=sap.ui.xmlfragment("cpapp.cpbompvs.view.ProdDialog",this);this.getView().addDependent(this._valueHelpDialogProd)}if(!this._oAccesNode){this._oAccesNode=sap.ui.xmlfragment("cpapp.cpbompvs.view.AccesNodes",l);l.getView().addDependent(this._oAccesNode)}if(!this._oAccesNodeList){this._oAccesNodeList=sap.ui.xmlfragment("cpapp.cpbompvs.view.AccessNodesList",l);l.getView().addDependent(this._oAccesNodeList)}this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){l=this;d=this.getModel("oGModel");l._valueHelpDialogProd.setTitleAlignment("Center");l._valueHelpDialogLoc.setTitleAlignment("Center");l._oAccesNodeList.setTitleAlignment("Center");this.oProdList=this._oCore.byId(this._valueHelpDialogProd.getId()+"-list");this.oLocList=this._oCore.byId(this._valueHelpDialogLoc.getId()+"-list");this.oAccList=this._oCore.byId(this._oAccesNodeList.getId()+"-list");this.getModel("BModel").read("/genProdAccessNode",{success:function(e){l.oModel.setData({results:e.results});l.byId("accessList").setModel(l.oModel)},error:function(){t.show("Failed to get data")}});this.getModel("BModel").read("/getLocation",{success:function(e){l.locModel.setData(e);l.oLocList.setModel(l.locModel);sap.ui.core.BusyIndicator.hide()},error:function(e,s){t.show("error")}});this.getModel("BModel").read("/getPVSNodes",{success:function(e){l.AccessNodes=[];for(var t=0;t<e.results.length;t++){if(e.results[t].NODE_TYPE==="AN"){l.AccessNodes.push(e.results[t])}}l.accModel.setData({results:l.AccessNodes});l.oAccList.setModel(l.accModel);sap.ui.core.BusyIndicator.hide()},error:function(){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})},handleValueHelp:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._valueHelpDialogLoc.open()}else if(t.includes("prod")){l._valueHelpDialogProd.open()}else if(t.includes("accn")){l._oAccesNodeList.open()}},handleClose:function(e){var t=e.getParameter("id");if(t.includes("loc")){l._oCore.byId(this._valueHelpDialogLoc.getId()+"-searchField").setValue("");if(l.oLocList.getBinding("items")){l.oLocList.getBinding("items").filter([])}}else if(t.includes("prod")){l._oCore.byId(this._valueHelpDialogProd.getId()+"-searchField").setValue("");if(l.oProdList.getBinding("items")){l.oProdList.getBinding("items").filter([])}}else if(t.includes("acc")){l._oCore.byId(this._oAccesNodeList.getId()+"-searchField").setValue("");if(l.oAccList.getBinding("items")){l.oAccList.getBinding("items").filter([])}}},handleSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=e.getParameter("id"),a=[];t=t?t.trim():"";if(s.includes("loc")){if(t!==""){a.push(new o({filters:[new o("LOCATION_ID",i.Contains,t),new o("LOCATION_DESC",i.Contains,t)],and:false}))}l.oLocList.getBinding("items").filter(a)}else if(s.includes("prod")){if(t!==""){a.push(new o({filters:[new o("PRODUCT_ID",i.Contains,t),new o("PROD_DESC",i.Contains,t)],and:false}))}l.oProdList.getBinding("items").filter(a)}else if(s.includes("acc")){if(t!==""){a.push(new o({filters:[new o("CHILD_NODE",i.Contains,t),new o("NODE_DESC",i.Contains,t)],and:false}))}l.oAccList.getBinding("items").filter(a)}},handleSelection:function(e){var s=e.getParameter("id"),a=e.getParameter("selectedItems"),c,d=[];if(s.includes("Loc")){this.oLoc=sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[1].getId());c=e.getParameter("selectedItems");l.oLoc.setValue(c[0].getTitle());this.getModel("BModel").read("/getLocProdDet",{filters:[new o("LOCATION_ID",i.EQ,c[0].getTitle())],success:function(e){l.prodModel.setData(e);l.oProdList.setModel(l.prodModel)},error:function(e,s){t.show("error")}})}else if(s.includes("prod")){this.oProd=sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[3].getId());c=e.getParameter("selectedItems");l.oProd.setValue(c[0].getTitle())}else if(s.includes("acc")){this.oAccn=sap.ui.getCore().byId(sap.ui.getCore().byId("SimpleFormToolbar").getContent()[5].getId());c=e.getParameter("selectedItems");l.oAccn.setValue(c[0].getTitle())}l.handleClose(e)},onhandlePress:function(e){d=this.getModel("oGModel");if(e){var t=e.getSource().getSelectedItem().getTitle(),s=e.getSource().getSelectedItem().getDescription(),o=e.getSource().getSelectedItem().getInfo();d.setProperty("/SelectedProd",t);d.setProperty("/SelectedLoc",s);d.setProperty("/SelectedNode",o)}l.getOwnerComponent().runAsOwner(function(){if(!l.oDetailView){try{l.oDetailView=sap.ui.view({viewName:"cpapp.cpbompvs.view.ItemDetail",type:"XML"});l.bus.publish("flexible","addDetailPage",l.oDetailView);l.bus.publish("nav","toDetailPage",{viewName:l.oDetailView.getViewName()})}catch(e){l.oDetailView.onAfterRendering()}}else{l.bus.publish("nav","toDetailPage",{viewName:l.oDetailView.getViewName()})}})},onSearch:function(e){var t=e.getParameter("value")||e.getParameter("newValue"),s=[];if(t!==""){s.push(new o({filters:[new o("PRODUCT_ID",i.Contains,t),new o("LOCATION_ID",i.Contains,t)],and:false}))}l.byId("accessList").getBinding("items").filter(s)},onAccNode:function(e){if(!l._oAccesNode){l._oAccesNode=sap.ui.xmlfragment("cpapp.cpbompvs.view.AccesNodes",l);l.getView().addDependent(l._oAccesNode)}d=this.getModel("oGModel");d.setProperty("/Flag","");if(e.getSource().getTooltip().includes("Add")){l._oAccesNode.setTitle("Assign Access Node");d.setProperty("/Flag","C");l._oAccesNode.open()}else{if(this.byId("accessList").getSelectedItems().length){var s=this.byId("accessList").getSelectedItem().getCells()[0];l._oAccesNode.setTitle("Update Access Node");sap.ui.getCore().byId("idAccesNode").setValue(s.getTitle());sap.ui.getCore().byId("idDesc").setValue(s.getText());sap.ui.getCore().byId("idAccesNode").setEditable(false);d.setProperty("/Flag","E");l._oAccesNode.open()}else{t.show("Select access node to update")}}},onAccNodeClose:function(){l._oAccesNode.close();l._oAccesNode.destroy(true);l._oAccesNode=""},onAccNodeDel:function(e){var t=d.getProperty("/SelectedLoc"),s=d.getProperty("/SelectedProd");var o="Please confirm to remove access node"+" - "+t+" "+"-"+" "+s;sap.m.MessageBox.show(o,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();l.getModel("BModel").callFunction("/genProdAN",{method:"GET",urlParameters:{LOCATION_ID:t,PRODUCT_ID:s,ACCESS_NODE:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Access Node deleted successfully");l.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})}}})},onAccessNodeSave:function(){var e=sap.ui.getCore().byId("idloc").getValue();var t=sap.ui.getCore().byId("idprod").getValue();var s=sap.ui.getCore().byId("idaccn").getValue();l.getModel("BModel").callFunction("/genProdAN",{method:"GET",urlParameters:{LOCATION_ID:e,PRODUCT_ID:t,ACCESS_NODE:s},success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Assigned Access Node successfully");l.onAccNodeClose();l.onAfterRendering()},error:function(e){sap.m.MessageToast.show(JSON.stringify(e))}})}})});
},
	"cpapp/cpbompvs/i18n/i18n.properties":'# This is the resource bundle for cpapp.cpbompvs\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=BOM-Product Variant Structure\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Product Variant Structure\n\nflpTitle=BOM-Product Variant Structure\n\nflpSubtitle=\n\nAccNode = Access Node\naccdesc = Access Node Description\n\n\nStruNode = Structure Node\nnodeDesc = Description\n\nvalidfrom = Valid from\nvalidto= Valid To\n\nloc=Location\nprod=Product\n\nsave= Save\nclose=Close\n',
	"cpapp/cpbompvs/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpapp.cpbompvs","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpapp-cpbompvs-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cpbompvs","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":"sap-icon://activity-assigned-to-goal"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpapp.cpbompvs.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpapp.cpbompvs.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpapp.cpbompvs.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"pattern":"","name":"Details","target":["Details"]}],"targets":{"Details":{"viewType":"XML","viewName":"Details","viewLevel":1},"ItemMaster":{"viewType":"XML","viewName":"ItemMaster","viewLevel":2},"ItemDetail":{"viewType":"XML","viewName":"ItemDetail","viewLevel":3}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"},"sap.platform.cf":{"oAuthScopes":["$XSAPPNAME.User","$XSAPPNAME.Developer"]}}',
	"cpapp/cpbompvs/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpapp/cpbompvs/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpapp/cpbompvs/view/AccesNodes.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\nxmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  title=""  contentWidth="450px" titleAlignment="Center"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4"\n\t\t\t\tlabelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="{i18n>loc}"/><Input id="idloc" value="" width="90%" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>prod}"/><Input id="idprod" value="" width="90%" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/><Label text="{i18n>AccNode}"/><Input id="idaccn" value="" width="90%" showValueHelp="true" valueHelpOnly="true" valueHelpRequest="handleValueHelp"/></f:content></f:SimpleForm></VBox><buttons><Button type=\'Ghost\' text="{i18n>save}" press="onAccessNodeSave"></Button><Button type=\'Reject\' text="{i18n>close}" press="onAccNodeClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpapp/cpbompvs/view/AccessNodesList.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="accSlctList" title="{i18n>AccNode}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{CHILD_NODE}" description="{NODE_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpbompvs/view/App.view.xml":'<mvc:View controllerName="cpapp.cpbompvs.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpapp/cpbompvs/view/Details.view.xml":'<mvc:View controllerName="cpapp.cpbompvs.controller.Details" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.f"><Page id="pageId"><customHeader><Bar><contentLeft><Button id="leftMenu" icon="sap-icon://menu2" tooltip="Side Menu Expand/Collapse" press="expandBegin" type="Transparent" visible="false"/></contentLeft><contentMiddle><Title text="{i18n>title}" class="boldText"></Title></contentMiddle></Bar></customHeader><content><f:FlexibleColumnLayout id="fcl"></f:FlexibleColumnLayout></content></Page></mvc:View>',
	"cpapp/cpbompvs/view/ItemDetail.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:l="sap.ui.layout"\n    controllerName="cpapp.cpbompvs.controller.ItemDetail"\n    xmlns:html="http://www.w3.org/1999/xhtml" xmlns:t="sap.ui.table"><Page id="idClassChar" ><customHeader><Toolbar height="50%"><Title id="struTitle" text="BOM-Structure Nodes" class="boldText"></Title><ToolbarSpacer/><Button text="Assign" press="onAssign" tooltip="Assign Structure Node"/></Toolbar></customHeader><l:Grid defaultSpan="XL3 L3 M6 S12"><VBox><Text text="{i18n>AccNode} : " ></Text><Text text=" {oGModel>/SelectedNode}" ></Text></VBox><VBox><Text text="{i18n>loc} : " ></Text><Text text=" {oGModel>/SelectedLoc}" ></Text></VBox><VBox><Text text="{i18n>prod} : " ></Text><Text text=" {oGModel>/SelectedProd}" ></Text></VBox><VBox ><Text id="idTextfrom" text="{i18n>validfrom} : " ></Text><DatePicker id="fromDate" displayFormat="yyyy-MM-dd" change="handleDateChange" /></VBox><VBox ><Text id="idTextto"  text="{i18n>validto} : "  ></Text><DatePicker id="toDate"  valueFormat="yyyy-MM-dd" displayFormat="yyyy-MM-dd" change="handleDateChange" /></VBox><VBox><Text text=""></Text><HBox id="idButton"><Button text="Go"  press="onGetData" type="Emphasized" tooltip="Get data based on dates" class="sapUiTinyMarginEnd" /><Button text="Reset" press="onResetDate" type="Transparent" tooltip="Reset Valid To Date" /></HBox></VBox></l:Grid><content><IconTabBar id="detailNode" expanded="true" select="onTabChange" class="sapUiResponsiveContentPadding"><items><IconTabFilter id="assignNodeTab" text="Assign Nodes" key="assignNode" icon="sap-icon://create-form"><SearchField id="idDetailSearch" liveChange="onDetailSearch" placeholder="Compponent/ Structure Node"/><Table id="sturList" items="{path: \'/results\'}" mode="SingleSelectMaster"><columns><Column hAlign="Center"><Text text="Item #" /></Column><Column hAlign="Center"><Text text="Component"/></Column><Column hAlign="Center"><Text text="Component Qty" /></Column><Column hAlign="Center"><Text text="Structure Node" /></Column><Column hAlign="Center"><Text text="Valid From" /></Column><Column hAlign="Center"><Text text="Valid To" /></Column><Column hAlign="Right"><Text text="" /></Column></columns><items><ColumnListItem><cells><Text text="{ITEM_NUM}" /><Text text="{COMPONENT}" /><Text text="{COMP_QTY}" /><Text text="{STRUC_NODE}" /><Text text="{path: \'VALID_FROM\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'yyyy/MM/dd\' }}" /><Text text="{path: \'VALID_TO\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'yyyy/MM/dd\' }}" /><Button icon="sap-icon://decline" tooltip="Delete" press="onStructureNodeDel" \n                                            iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></IconTabFilter><IconTabFilter id="StruNodeDetailTab" text="Structure Node Details" key="StruNodeDetail" icon="sap-icon://org-chart"><SearchField id="idStruNodeDetails" liveChange="onStruNodeSearch" placeholder="Structure Node/ Component"/><t:TreeTable id="StrunodeTable" enableSelectAll="false" ariaLabelledBy="title" selectionMode="None"\n\t\t\t\t\tvisibleRowCount="15"  \n\t\t\t\t\t rows="{\n\t\t\t\t\t\t\t\tpath:\'/struDetailresults\',\n\t\t\t\t\t\t\t\tparameters: {arrayNames:[\'children\'], numberOfExpandedLevels: 1},\n\t\t\t\t\t\t\t\tevents: {\n\t\t\t\t\t\t\t\t\tchange: \'.onDataReceived\'\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}"><t:columns><t:Column width="10rem"><Label text="Structure Node"/><t:template><HBox justifyContent="Center" visible="{_isParent}"><Text text="{STRUC_NODE}"  /></HBox></t:template></t:Column><t:Column width="16rem"><Label text="Component"/><t:template><HBox justifyContent="Center" visible="{= ${children}.length === 0 ? true : !${_isParent}}"><Text text="{COMPONENT}" /></HBox></t:template></t:Column><t:Column width="10rem"><Label text="Item"/><t:template><HBox justifyContent="Center" visible="{= ${children}.length === 0 ? true : !${_isParent}}"><Text text="{ITEM_NUM}"/></HBox></t:template></t:Column></t:columns></t:TreeTable></IconTabFilter></items></IconTabBar></content></Page></mvc:View>',
	"cpapp/cpbompvs/view/ItemMaster.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" controllerName="cpapp.cpbompvs.controller.ItemMaster"\n    xmlns:html="http://www.w3.org/1999/xhtml" class="ItemMaster"><Page ><customHeader><Toolbar height="50%"><SearchField id="headSearch" liveChange="onSearch" placeholder="Product/ Location"/><ToolbarSpacer/><Button icon="sap-icon://add" press="onAccNode" tooltip="Add Access Node"/><Button icon="sap-icon://delete" press="onAccNodeDel" tooltip="Delete Access Node"/></Toolbar></customHeader><content><List\n                id="accessList"\n                mode="SingleSelectMaster"\n                delete="onAccNodeDel"\n                itemPress="onhandlePress"\n                selectionChange="onhandlePress"\n                enableBusyIndicator="true"\n                headerText="Products - Access Nodes"\n                growing="true"\n                items="{\n                    path: \'/results\'\n                }" ><StandardListItem\n\t\t\ttitle="{PRODUCT_ID}"\n\t\t\tdescription="{LOCATION_ID}"\n            info="{ACCESS_NODE}" /></List></content></Page></mvc:View>',
	"cpapp/cpbompvs/view/LocDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="LocSlctList" title="{i18n>loc}" search="handleSearch" liveChange="handleSearch" rememberSelections="false"\n\t\tconfirm="handleSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{LOCATION_ID}" description="{LOCATION_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpbompvs/view/ProdDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><SelectDialog id="prodSlctList" title="{i18n>prod}" rememberSelections="true" search="handleSearch" liveChange="handleSearch"\n\t\tconfirm="handleSelection" cancel="handleClose"  contentWidth="320px" items="{/results}" \n        selectionChange="handleProdChange" growing="false"><StandardListItem title="{PRODUCT_ID}" description="{PROD_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpbompvs/view/StructureNodes.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><SelectDialog id="sturList" title="Structure Nodes" search="handleStruSearch" liveChange="handleStruSearch" rememberSelections="false"\n\t\tconfirm="handleStruSelection" cancel="handleClose" items="{/results}"><StandardListItem title="{CHILD_NODE}" description="{NODE_DESC}" type="Active"/></SelectDialog></core:FragmentDefinition>',
	"cpapp/cpbompvs/view/ViewNodes.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  title="" contentWidth="450px"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="3" labelSpanL="3" labelSpanM="3"\n\t\t\t\tlabelSpanS="3" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="{i18n>struNode}"/><Input id="idStruNode" value="" width="100%"/><Label text="{i18n>strudesc}"/><Input id="idStruDesc" value="" width="100%"/></f:content></f:SimpleForm></VBox><buttons><Button id="saveButton" type=\'Ghost\' text="{i18n>save}" press="onStruNodeSave"></Button><Button type=\'Reject\' text="{i18n>close}" press="onStruNodeClose"></Button></buttons></Dialog></core:FragmentDefinition>'
}});
