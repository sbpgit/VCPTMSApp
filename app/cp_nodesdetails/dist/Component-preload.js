//@ui5-bundle cpappf/cpnodesdetails/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cpappf/cpnodesdetails/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","cpappf/cpnodesdetails/model/models"],function(e,t,i){"use strict";return e.extend("cpappf.cpnodesdetails.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"cpappf/cpnodesdetails/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("cpappf.cpnodesdetails.controller.App",{onInit:function(){this.getView().addStyleClass(!sap.ui.Device.support.touch?"sapUiSizeCompact":"sapUiSizeCozy");if(sap.hana){setInterval(function(){sap.hana.uis.flp.SessionTimeoutHandler.pingServer()},12e4)}}})});
},
	"cpappf/cpnodesdetails/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("cpappf.cpnodesdetails.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()}})});
},
	"cpappf/cpnodesdetails/controller/Details.controller.js":function(){sap.ui.define(["cpappf/cpnodesdetails/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(e,t,i,s,a,o,n){"use strict";var l,u;return e.extend("cpappf.cpnodesdetails.controller.Details",{onInit:function(){l=this;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("cpappf.cpnodesdetails","addBeginPage",this.addBeginPage,this);this.bus.subscribe("cpappf.cpnodesdetails","addDetailPage",this.addDetailPage,this);this.bus.subscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.subscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.subscribe("nav","backToBegin",this.backToBegin,this);this.bus.subscribe("nav","expandBegin",this.expandBegin,this);this.oFlexibleColumnLayout=this.byId("fcl");this.getRouter().getRoute("Details").attachPatternMatched(this._onPatternMatched.bind(this));if(n.system.phone){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.MidColumnFullScreen)}else{this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded)}var e=new t({expanded:true,midExists:false,busy:true,delay:0});this.setModel(e,"appView");if(n.support.touch){n.orientation.attachHandler(function(e){NotificationObj.onAfterRendering();NotificationObj.iconWidth=0;NotificationObj.oldBeginColNoImgWidth=0;NotificationObj.newMidColumnWidth=0})}},onExit:function(){this.bus.unsubscribe("cpappf.cpnodesdetails","addBeginPage",this.addBeginPage,this);this.bus.unsubscribe("cpappf.cpnodesdetails","addDetailPage",this.addDetailPage,this);this.bus.unsubscribe("nav","toBeginPage",this.toBeginPage,this);this.bus.unsubscribe("nav","toDetailPage",this.toDetailPage,this);this.bus.unsubscribe("nav","backToBegin",this.backToBegin,this)},onAfterRendering:function(){l=this;var e=this.getModel("appView");this.getView().byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);if(!n.system.desktop){this.byId("leftMenu").setVisible(true);this.getModel("appView").setProperty("/expanded",false)}else{e.setProperty("/sideMenuBurgerVisible",false);e.setProperty("/expanded",false)}},addBeginPage:function(e,t,i){this.oFlexibleColumnLayout.addBeginColumnPage(i)},addDetailPage:function(e,t,i){var s=this.oFlexibleColumnLayout.getMidColumnPages(),a=false;for(var o=0;o<s.length;o++){if(s[o].getProperty("viewName")===i.getViewName()){a=true;break}else{a=false}}if(!a){this.oFlexibleColumnLayout.addMidColumnPage(i)}},toBeginPage:function(e,t,i){var s=this.oFlexibleColumnLayout.getBeginColumnPages();for(var a=0;a<s.length;a++){if(s[a].getProperty("viewName")===i.viewName){this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[a]);break}}},toDetailPage:function(e,t,i){var s=this.oFlexibleColumnLayout.getMidColumnPages();for(var a=0;a<s.length;a++){if(s[a].getProperty("viewName")===i.viewName){this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[a]);break}}this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);if(s.length<1){this.getOwnerComponent().runAsOwner(function(){this.detailView=sap.ui.view({viewName:"cpappf.cpnodesdetails.view.ItemDetail",type:"XML"});this.oFlexibleColumnLayout.addMidColumnPage(this.detailView)}.bind(this))}else{this.oFlexibleColumnLayout.addMidColumnPage(s[0]);s[0].onAfterRendering()}},backToBegin:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn)},_onPatternMatched:function(){this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);var e=this.oFlexibleColumnLayout.getBeginColumnPages();if(e.length<1){this.getOwnerComponent().runAsOwner(function(){this.masterView=sap.ui.view({viewName:"cpappf.cpnodesdetails.view.ItemMaster",type:"XML"});this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView)}.bind(this))}else{this.oFlexibleColumnLayout.toBeginColumnPage(e[0]);e[0].onAfterRendering()}},expandBegin:function(){this.bus.publish("nav","backToBegin");if(!n.system.desktop){this.byId("leftMenu").setVisible(false);this.getModel("appView").setProperty("/expanded",true)}}})});
},
	"cpappf/cpnodesdetails/controller/ItemDetail.controller.js":function(){sap.ui.define(["cpappf/cpnodesdetails/controller/BaseController","sap/m/MessageToast","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,s,o,r,i,d,a){"use strict";var u,l;return e.extend("cpappf.cpnodesdetails.controller.ItemDetail",{onInit:function(){u=this;this.bus=sap.ui.getCore().getEventBus();u.oStruModel=new o;u.oViewlistModel=new o;u.oViewModel=new o;l=u.getOwnerComponent().getModel("oGModel")},onAfterRendering:function(){l=u.getOwnerComponent().getModel("oGModel");this.byId("sturList").removeSelections();var e=l.getProperty("/SelectedAccessNode");var t=l.getProperty("/struNodeData");var s=l.getProperty("/ViewNodeData");var o=l.getProperty("/StruViewNodeData");u.struNodeData=[];u.viewNodeData=[];u.struviewNodeData=[];this.byId("struTitle").setText("Structure Node - View Node");for(var r=0;r<t.length;r++){if(t[r].PARENT_NODE===e){u.struNodeData.push(t[r])}}for(var r=0;r<s.length;r++){if(s[r].PARENT_NODE===e){u.viewNodeData.push(s[r])}}for(var i=0;i<u.viewNodeData.length;i++){var d=0;for(var r=0;r<o.length;r++){if(o[r].PARENT_NODE===u.viewNodeData[i].CHILD_NODE&&o[r].ACCESS_NODES===e){u.struviewNodeData.push(o[r]);d=1}}if(d===0){var a={AUTH_GROUP:null,CHILD_NODE:"No Structure Node assigned",NODE_DESC:"",NODE_TYPE:"",PARENT_NODE:s[i].CHILD_NODE,createdAt:null,createdBy:null,modifiedAt:null,modifiedBy:null};u.struviewNodeData.push(a)}}u.oStruModel.setData({Struresults:u.struNodeData});u.byId("sturList").setModel(u.oStruModel);u.aReqTabData();var n=l.getProperty("/reqData");u.oViewlistModel.setData({ViewListresults:n.Requests});u.byId("nodeTable").setModel(u.oViewlistModel)},aReqTabData:function(){var e=u.viewNodeData,t=u.struviewNodeData,s={Requests:[]},o=[],r,i,d,a=function(e,t,s){var o=JSON.parse(JSON.stringify(e)),r=JSON.parse(JSON.stringify(t)),i=JSON.parse(JSON.stringify(e));r._isParent=false;if(o.children.length===0){i._isParent=false;o.children.push(i)}o.children.push(r);return o};if(t.length){for(var n=0;n<t.length;n++){r=o.indexOf(t[n].PARENT_NODE);if(r===-1){o.push(t[n].PARENT_NODE);t[n].children=[];t[n]._isParent=true;s.Requests.push(t[n])}else{i=s.Requests[r];d=a(i,t[n],"Reqs");s.Requests[r]=d}}}l.setProperty("/reqData",s)},onTabChange:function(e){var t=u.byId("detailNode").getSelectedKey();if(t==="struNode"){u.byId("idAssign").setVisible(true);u.byId("idAstru").setVisible(true);u.byId("idEstru").setVisible(true);u.byId("idView").setVisible(false)}else if(t==="viewNode"){u.byId("idAssign").setVisible(false);u.byId("idAstru").setVisible(false);u.byId("idEstru").setVisible(false);u.byId("idView").setVisible(true)}},onAssign:function(e){if(!u._oViewNode){u._oViewNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodes",u);u.getView().addDependent(u._oViewNode)}if(this.byId("sturList").getSelectedItems().length){var s=l.getProperty("/ViewNodeData");u.viewAssignData=[];var o=l.getProperty("/SelectedAccessNode");l.setProperty("/selstrNode",this.byId("sturList").getSelectedItem().getCells()[0].getText());l.setProperty("/selstrNodeDesc",this.byId("sturList").getSelectedItem().getCells()[1].getText());for(var r=0;r<s.length;r++){if(s[r].PARENT_NODE===o){u.viewAssignData.push(s[r])}}u.oViewModel.setData({ViewNodesresults:u.viewAssignData});sap.ui.getCore().byId("ViewList").setModel(u.oViewModel);if(u.viewAssignData.length!==0){u._oViewNode.open()}else{t.show("There is no View Nodes for the selected Access Node")}}else{t.show("Select structure node to assign")}},onViewNodeClose:function(){u._oViewNode.close();u._oViewNode.destroy(true);u._oViewNode=""},onStruNode:function(e){if(!u._oStruNode){u._oStruNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.StructureNodes",u);u.getView().addDependent(u._oStruNode)}l=this.getModel("oGModel");l.setProperty("/sFlag","");if(e.getSource().getTooltip().includes("Add")){u._oStruNode.setTitle("Structure Node Creation");sap.ui.getCore().byId("idStruNode").setValue("");sap.ui.getCore().byId("idStruDesc").setValue("");l.setProperty("/sFlag","C");u._oStruNode.open()}else{if(this.byId("sturList").getSelectedItems().length){var s=this.byId("sturList").getSelectedItem().getCells();u._oStruNode.setTitle("Update Structure Node");sap.ui.getCore().byId("idStruNode").setValue(s[0].getText());sap.ui.getCore().byId("idStruDesc").setValue(s[1].getText());sap.ui.getCore().byId("idStruNode").setEditable(false);l.setProperty("/sFlag","E");u._oStruNode.open()}else{t.show("Select structure node to update")}}},onStruNodeClose:function(){this.byId("sturList").removeSelections();u._oStruNode.close();u._oStruNode.destroy(true);u._oStruNode=""},onStruNodeDel:function(e){var s=e.getSource().getParent().getCells()[0].getText(),o=l.getProperty("/SelectedAccessNode");var r="Please confirm to remove structure node"+" - "+s;sap.m.MessageBox.show(r,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();u.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:s,PARENT_NODE:o,ACCESS_NODES:o,NODE_TYPE:"SN",NODE_DESC:"",FLAG:"D"},success:function(e){t.show("Structure node deleted successfully");u.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(){t.show("Failed to delete Structure node");sap.ui.core.BusyIndicator.hide()}})}}})},onStruNodeSave:function(e){var s=sap.ui.getCore().byId("idAccNode").getValue(),o=sap.ui.getCore().byId("idStruNode").getValue(),r=sap.ui.getCore().byId("idStruDesc").getValue(),i=l.getProperty("/sFlag");u.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:o,PARENT_NODE:s,ACCESS_NODES:s,NODE_TYPE:"SN",NODE_DESC:r,FLAG:i},success:function(e){if(i==="C"){t.show("Successfully created the structure node")}else{t.show("Successfully updated the structure node")}u.onStruNodeClose();u.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to updated the structure node");sap.ui.core.BusyIndicator.hide()}})},onAssignViewNode:function(e){var s=l.getProperty("/selstrNode");var o=l.getProperty("/selstrNodeDesc");var r=sap.ui.getCore().byId("ViewList").getSelectedItem().getCells()[0].getTitle();var i=sap.ui.getCore().byId("ViewList").getSelectedItem().getCells()[0].getText(),d=l.getProperty("/SelectedAccessNode");var a=i+" "+"-"+" "+o;u.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:s,PARENT_NODE:r,ACCESS_NODES:d,NODE_TYPE:"VS",NODE_DESC:a,FLAG:"C"},success:function(e){t.show("Successfully assigned structure node to view node");u.onViewNodeClose();u.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to updated the structure node");sap.ui.core.BusyIndicator.hide()}})},onViewNode:function(){if(!u._oViewNodeCreate){u._oViewNodeCreate=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.ViewNodesCreation",u);u.getView().addDependent(u._oViewNodeCreate)}sap.ui.getCore().byId("idViewNode").setValue("");sap.ui.getCore().byId("idViewDesc").setValue("");u._oViewNodeCreate.open()},onViewClose:function(){u._oViewNodeCreate.close();u._oViewNodeCreate.destroy(true);u._oViewNodeCreate=""},onViewNodeCreate:function(){var e=l.getProperty("/SelectedAccessNode"),s=sap.ui.getCore().byId("idViewNode").getValue(),o=sap.ui.getCore().byId("idViewDesc").getValue();u.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:s,PARENT_NODE:e,ACCESS_NODES:e,NODE_TYPE:"VN",NODE_DESC:o,FLAG:"C"},success:function(e){t.show("Successfully created view node");u.onViewClose();u.bus.publish("data","refreshMaster");sap.ui.core.BusyIndicator.hide()},error:function(e){t.show("Failed to updated the structure node");sap.ui.core.BusyIndicator.hide()}})}})});
},
	"cpappf/cpnodesdetails/controller/ItemMaster.controller.js":function(){sap.ui.define(["cpappf/cpnodesdetails/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device"],function(e,s,t,o,i,a,r){"use strict";var c,d;return e.extend("cpappf.cpnodesdetails.controller.ItemMaster",{onInit:function(){c=this;c.oModel=new t;this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")})},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){c=this;d=this.getModel("oGModel");this.getModel("BModel").read("/getPVSNodes",{success:function(e){c.AccessNodes=[];c.StructureNodes=[];c.ViewNodes=[];c.StruViewNodes=[];for(var s=0;s<e.results.length;s++){if(e.results[s].NODE_TYPE==="AN"){c.AccessNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="SN"){c.StructureNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="VN"){c.ViewNodes.push(e.results[s])}else if(e.results[s].NODE_TYPE==="VS"){c.StruViewNodes.push(e.results[s])}}d.setProperty("/SelectedAccessNode",c.AccessNodes[0].CHILD_NODE);d.setProperty("/struNodeData",c.StructureNodes);d.setProperty("/ViewNodeData",c.ViewNodes);d.setProperty("/StruViewNodeData",c.StruViewNodes);c.oModel.setData({results:c.AccessNodes});c.byId("accessList").setModel(c.oModel);c.byId("accessList").getItems()[0].setSelected(true);c.onhandlePress()},error:function(){s.show("Failed to get data")}})},onhandlePress:function(e){d=this.getModel("oGModel");if(e){var s=e.getSource().getSelectedItem().getBindingContext().getObject();d.setProperty("/SelectedAccessNode",s.CHILD_NODE);d.setProperty("/struNodeData",c.StructureNodes);d.setProperty("/ViewNodeData",c.ViewNodes)}c.getOwnerComponent().runAsOwner(function(){if(!c.oDetailView){try{c.oDetailView=sap.ui.view({viewName:"cpappf.cpnodesdetails.view.ItemDetail",type:"XML"});c.bus.publish("flexible","addDetailPage",c.oDetailView);c.bus.publish("nav","toDetailPage",{viewName:c.oDetailView.getViewName()})}catch(e){c.oDetailView.onAfterRendering()}}else{c.bus.publish("nav","toDetailPage",{viewName:c.oDetailView.getViewName()})}})},onSearch:function(e){var s=e.getParameter("value")||e.getParameter("newValue"),t=[];if(s!==""){t.push(new o({filters:[new o("CHILD_NODE",i.Contains,s)],and:false}))}c.byId("accessList").getBinding("items").filter(t)},onAccNode:function(e){if(!c._oAccesNode){c._oAccesNode=sap.ui.xmlfragment("cpappf.cpnodesdetails.view.AccesNodes",c);c.getView().addDependent(c._oAccesNode)}d=this.getModel("oGModel");d.setProperty("/Flag","");if(e.getSource().getTooltip().includes("Add")){c._oAccesNode.setTitle("Access Node Creation");sap.ui.getCore().byId("idAccesNode").setValue("");sap.ui.getCore().byId("idDesc").setValue("");d.setProperty("/Flag","C");c._oAccesNode.open()}else{if(this.byId("accessList").getSelectedItems().length){var t=this.byId("accessList").getSelectedItem().getCells()[0];c._oAccesNode.setTitle("Update Access Node");sap.ui.getCore().byId("idAccesNode").setValue(t.getTitle());sap.ui.getCore().byId("idDesc").setValue(t.getText());sap.ui.getCore().byId("idAccesNode").setEditable(false);d.setProperty("/Flag","E");c._oAccesNode.open()}else{s.show("Select access node to update")}}},onAccNodeClose:function(){c._oAccesNode.close();c._oAccesNode.destroy(true);c._oAccesNode=""},onAccNodeDel:function(e){var t=e.getSource().getParent().getCells()[0].getTitle();var o="Please confirm to remove access node"+" - "+t;sap.m.MessageBox.show(o,{title:"Confirmation",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(e){if(e===sap.m.MessageBox.Action.YES){sap.ui.core.BusyIndicator.show();c.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:t,PARENT_NODE:"",NODE_TYPE:"AN",NODE_DESC:"",FLAG:"D"},success:function(e){sap.ui.core.BusyIndicator.hide();s.show("Deletion Successfull");c.onAfterRendering()},error:function(){sap.ui.core.BusyIndicator.hide();s.show("Failed to delete node");c.onAfterRendering()}})}}})},onAccessNodeSave:function(){var e=sap.ui.getCore().byId("idAccesNode").getValue();var t=sap.ui.getCore().byId("idDesc").getValue();var o=d.getProperty("/Flag");this.getModel("BModel").callFunction("/genpvs",{method:"GET",urlParameters:{CHILD_NODE:e,PARENT_NODE:"",ACCESS_NODES:e,NODE_TYPE:"AN",NODE_DESC:t,FLAG:o},success:function(e){s.show("Creation Successfull");c.onAccNodeClose();c.onAfterRendering()},error:function(e){if(e.statusCode===200){s.show("Creation Successfull")}else{s.show("Failed to create node")}c.onAccNodeClose();c.onAfterRendering()}})}})});
},
	"cpappf/cpnodesdetails/i18n/i18n.properties":'# This is the resource bundle for cpappf.cpnodesdetails\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle= Create PVS Nodes\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Create PVS Nodes\n\nflpTitle=Create PVS Nodes\n\nflpSubtitle=\n\nAccNode = Access Node\naccdesc = Access Node Description\n\n\nStruNode = Structure Node\nnodeDesc = Description\n\nviewNode = View Node\n\n\nsave= Save\nclose=Close',
	"cpappf/cpnodesdetails/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"cpappf.cpnodesdetails","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"v2/catalog/","type":"OData","settings":{"localUri":"localService/CatalogService/metadata.xml","odataVersion":"2.0"}},"Pal":{"uri":"v2/pal/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"crossNavigation":{"inbounds":{"cpappf-cpnodesdetails-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"cp_nodesdetails","action":"display","title":"{{flpTitle}}","subTitle":"{{flpSubtitle}}","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"rootView":{"viewName":"cpappf.cpnodesdetails.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cpappf.cpnodesdetails.i18n.i18n"}},"oGModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"},"preload":true},"BModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}},"PModel":{"dataSource":"Pal","preload":true,"settings":{"useBatch":true,"defaultBindingMode":"TwoWay"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"cpappf.cpnodesdetails.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"pattern":"","name":"Details","target":["Details"]}],"targets":{"Details":{"viewType":"XML","viewName":"Details","viewLevel":1},"ItemMaster":{"viewType":"XML","viewName":"ItemMaster","viewLevel":2},"ItemDetail":{"viewType":"XML","viewName":"ItemDetail","viewLevel":3}}}},"sap.cloud":{"public":true,"service":"configprod_approuter"}}',
	"cpappf/cpnodesdetails/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"cpappf/cpnodesdetails/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"cpappf/cpnodesdetails/view/AccesNodes.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\nxmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  title=""  contentWidth="450px" titleAlignment="Center"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4"\n\t\t\t\tlabelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="{i18n>AccNode}"/><Input id="idAccesNode" value="" width="90%"/><Label text="{i18n>accdesc}"/><Input id="idDesc" value="" width="90%"/></f:content></f:SimpleForm></VBox><buttons><Button type=\'Ghost\' text="{i18n>save}" press="onAccessNodeSave"></Button><Button type=\'Reject\' text="{i18n>close}" press="onAccNodeClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpappf/cpnodesdetails/view/App.view.xml":'<mvc:View controllerName="cpappf.cpnodesdetails.controller.App" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><App id="app"><pages></pages></App></mvc:View>',
	"cpappf/cpnodesdetails/view/Details.view.xml":'<mvc:View controllerName="cpappf.cpnodesdetails.controller.Details" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.f"><Page id="pageId"><customHeader><Bar><contentLeft><Button id="leftMenu" icon="sap-icon://menu2" tooltip="Side Menu Expand/Collapse" press="expandBegin" type="Transparent" visible="false"/></contentLeft><contentMiddle><Title text="{i18n>title}" class="boldText"></Title></contentMiddle></Bar></customHeader><content><f:FlexibleColumnLayout id="fcl"></f:FlexibleColumnLayout></content></Page></mvc:View>',
	"cpappf/cpnodesdetails/view/ItemDetail.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form" controllerName="cpappf.cpnodesdetails.controller.ItemDetail"\n    xmlns:html="http://www.w3.org/1999/xhtml"  xmlns:t="sap.ui.table"><Page id="idClassChar"><customHeader><Toolbar height="50%"><Title id="struTitle" text=""></Title><ToolbarSpacer/><Button id="idAssign" text="Assign" press="onAssign" tooltip="Assign to View Node"/><Button id="idAstru" icon="sap-icon://add" press="onStruNode" tooltip="Add Structure Node"/><Button id="idEstru" icon="sap-icon://edit" press="onStruNode" tooltip="Edit Structure Node"/><Button id="idView" icon="sap-icon://add" press="onViewNode" tooltip="Add View Node" visible="false"/></Toolbar></customHeader><content><IconTabBar id="detailNode" expanded="true" select="onTabChange" class="sapUiResponsiveContentPadding"><items><IconTabFilter id="struNodeTab" text="Structure Node" key="struNode"><Table id="sturList" items="{path: \'/Struresults\'}" mode="SingleSelectMaster"><columns><Column hAlign="Center"><Text text="{i18n>StruNode}" /></Column><Column hAlign="Center"><Text text="{i18n>nodeDesc}"/></Column><Column hAlign="Right"><Text text="" /></Column></columns><items><ColumnListItem><cells><Text text="{CHILD_NODE}" /><Text text="{NODE_DESC}" /><Button id="idStru" icon="sap-icon://decline" tooltip="Delete" press="onStruNodeDel" iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></IconTabFilter><IconTabFilter id="viewNodeTab" text="View Node" key="viewNode"><t:TreeTable id="nodeTable" enableSelectAll="false" ariaLabelledBy="title" selectionMode="None"\n\t\t\t\t\tvisibleRowCount="10"  \n\t\t\t\t\t rows="{\n\t\t\t\t\t\t\t\tpath:\'/ViewListresults\',\n\t\t\t\t\t\t\t\tparameters: {arrayNames:[\'children\'], numberOfExpandedLevels: 1},\n\t\t\t\t\t\t\t\tevents: {\n\t\t\t\t\t\t\t\t\tchange: \'.onDataReceived\'\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}"><t:columns><t:Column width="10rem"><Label text="View Node"/><t:template><HBox justifyContent="Center" visible="{_isParent}"><Text text="{PARENT_NODE}"  /></HBox></t:template></t:Column><t:Column width="14rem"><Label text="Structure Node"/><t:template><HBox justifyContent="Center" visible="{= ${children}.length === 0 ? true : !${_isParent}}"><Text text="{CHILD_NODE}" /></HBox></t:template></t:Column><t:Column width="15rem"><Label text="Description"/><t:template><HBox justifyContent="Center" visible="{= ${children}.length === 0 ? true : !${_isParent}}"><Text text="{NODE_DESC}"/></HBox></t:template></t:Column></t:columns></t:TreeTable></IconTabFilter></items></IconTabBar></content></Page></mvc:View>',
	"cpappf/cpnodesdetails/view/ItemMaster.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" controllerName="cpappf.cpnodesdetails.controller.ItemMaster"\n    xmlns:html="http://www.w3.org/1999/xhtml" class="ItemMaster"><Page ><customHeader><Toolbar height="50%"><SearchField id="headSearch" liveChange="onSearch" placeholder="Access Node"/><ToolbarSpacer/><Button icon="sap-icon://add" press="onAccNode" tooltip="Add Access Node"/><Button icon="sap-icon://edit" press="onAccNode" tooltip="Edit Access Node"/></Toolbar></customHeader><content><Table id="accessList" items="{path: \'/results\'}" growingScrollToLoad="true" rememberSelections="false" \n            itemPress="onhandlePress" mode="SingleSelectMaster" selectionChange="onhandlePress"><columns><Column hAlign="Center"><Text text="{i18n>AccNode}" /></Column><Column hAlign="Right"><Text text=""/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{CHILD_NODE}" text="{NODE_DESC}"/><Button id="buttonId" icon="sap-icon://decline" tooltip="Delete" press="onAccNodeDel" \n                                    iconDensityAware="false" type="Transparent"/></cells></ColumnListItem></items></Table></content></Page></mvc:View>',
	"cpappf/cpnodesdetails/view/StructureNodes.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  title="" contentWidth="450px" titleAlignment="Center"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4"\n\t\t\t\tlabelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="{i18n>AccNode}"/><Input id="idAccNode" value="{oGModel>/SelectedAccessNode}" editable="false" width="100%"/><Label text="{i18n>StruNode}"/><Input id="idStruNode" value="" width="100%"/><Label text="{i18n>nodeDesc}"/><Input id="idStruDesc" value="" width="100%"/></f:content></f:SimpleForm></VBox><buttons><Button  type=\'Ghost\' text="{i18n>save}" press="onStruNodeSave"></Button><Button type=\'Reject\' text="{i18n>close}" press="onStruNodeClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpappf/cpnodesdetails/view/ViewNodes.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  contentWidth="450px" showHeader="false" ><Table id="ViewList" items="{path: \'/ViewNodesresults\'}" rememberSelections="false" \n             mode="SingleSelectMaster"><columns><Column hAlign="Center"><Text text="{i18n>viewNode}" /></Column></columns><items><ColumnListItem><cells><ObjectIdentifier title="{CHILD_NODE}" text="{NODE_DESC}"/></cells></ColumnListItem></items></Table><buttons><Button type=\'Ghost\' text="Assign" press="onAssignViewNode"></Button><Button type=\'Reject\' text="{i18n>close}" press="onViewNodeClose"></Button></buttons></Dialog></core:FragmentDefinition>',
	"cpappf/cpnodesdetails/view/ViewNodesCreation.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form" xmlns:u="sap.ui.unified"><Dialog  title="View Node Creatin" contentWidth="450px" titleAlignment="Center"><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormToolbar" editable="true" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4"\n\t\t\t\tlabelSpanS="4" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="{i18n>AccNode}"/><Input id="idAccNode" value="{oGModel>/SelectedAccessNode}" editable="false" width="100%"/><Label text="{i18n>viewNode}"/><Input id="idViewNode" value="" width="100%"/><Label text="{i18n>nodeDesc}"/><Input id="idViewDesc" value="" width="100%"/></f:content></f:SimpleForm></VBox><buttons><Button type=\'Ghost\' text="{i18n>save}" press="onViewNodeCreate"></Button><Button type=\'Reject\' text="{i18n>close}" press="onViewClose"></Button></buttons></Dialog></core:FragmentDefinition>'
}});
