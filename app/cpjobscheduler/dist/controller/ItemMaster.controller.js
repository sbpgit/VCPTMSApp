sap.ui.define(["cpapp/cpjobscheduler/controller/BaseController","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/Device","sap/ui/core/Fragment"],function(e,t,o,i,a,s,r,n){"use strict";var d,l;return e.extend("cpapp.cpjobscheduler.controller.ItemMaster",{onInit:function(){d=this;this.listModel=new o;this.JobLogsModel=new o;this.JobDataModel=new o;this.ScheLogModel=new o;this.ScheRunLogModel=new o;this.listModel.setSizeLimit(2e3);this.JobLogsModel.setSizeLimit(1e3);this.JobDataModel.setSizeLimit(1e3);this.ScheLogModel.setSizeLimit(1e3);if(!this._valueHelpDialogUpdateJob){this._valueHelpDialogUpdateJob=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.UpdateJobDialog",this);this.getView().addDependent(this._valueHelpDialogUpdateJob)}this.bus=sap.ui.getCore().getEventBus();this.bus.subscribe("data","refreshMaster",this.refreshMaster,this);this.bus.publish("nav","toBeginPage",{viewName:this.getView().getProperty("viewName")});this.bus.subscribe("data","dateRange",this.handleDateChange,this);this.byId("target").addEventDelegate({onmouseover:this._showPopover,onmouseout:this._clearPopover},this)},_showPopover:function(e){var t=e.target.id.split("jobList-")[1].split("-")[0],i=e.target.id.split("jobList-")[0],a=i+"jobList-"+t;var s=this.byId("jobList").getItems()[t].getBindingContext().getObject();var r,n=[];r={description:s.description,startTime:s.startTime,endTime:s.endTime,createdAt:s.createdAt};n.push(r);d.dataModel=new o;d.dataModel.setData({resultsData:n});d.byId("idData").setModel(d.dataModel);this._timeId=setTimeout(()=>{this.byId("popover").openBy(this.byId(a))},500)},_clearPopover:function(){clearTimeout(this._timeId);this.byId("popover").close()},refreshMaster:function(){this.onAfterRendering()},onAfterRendering:function(){l=this.getModel("oGModel");d.oList=d.byId("jobList");d.oList.removeSelections(true);d.getView().byId("headSearch").setValue();sap.ui.core.BusyIndicator.show();d.getModel("JModel").callFunction("/readJobs",{method:"GET",success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.jobId=e.jobId.toString()},d);l.setProperty("/tableData",e.results);var t=[];var o=l.getProperty("/DateRange").split(" To ");var i=o[0]+" "+"00:00:00",a=o[1]+" "+"23:59:59";for(var s=0;s<e.results.length;s++){var r=e.results[s].startTime;if(i<r&&a>r){t.push(e.results[s])}}d.listModel.setData({results:t});d.oList.setModel(d.listModel);d.onSearch()},error:function(e){sap.ui.core.BusyIndicator.hide();t.show("Failed to get data")}})},onSearch:function(e){var t=d.getView().byId("headSearch").getValue(),o=[];var s=[];if(t!==""){var o=new i({filters:[new i("jobId",a.Contains,t),new i("name",a.Contains,t)],and:false});s.push(o)}d.byId("jobList").getBinding("items").filter(s)},handleDateChange:function(e){var t=l.getProperty("/tableData");var o=[];var i=l.getProperty("/DateRange").split(" To ");var a=i[0]+" "+"00:00:00",s=i[1]+" "+"23:59:59";for(var r=0;r<t.length;r++){var n=t[r].startTime;if(a<n&&s>n){o.push(t[r])}}d.listModel.setData({results:o});d.oList.setModel(d.listModel);d.onSearch()},handleLinkPress:function(e){l=this.getModel("oGModel");var t=e.getSource(),o=this.getView();var i=e.getSource().getParent().getBindingContext().getObject();l.setProperty("/jobId",i.jobId);l.setProperty("/description",i.description);l.setProperty("/startTime",i.startTime);l.setProperty("/endTime",i.endTime);l.setProperty("/createdAt",i.createdAt);if(!d._pPopover){d._pPopover=n.load({id:o.getId(),name:"cpapp.cpjobscheduler.view.JobLink",controller:this}).then(function(e){o.addDependent(e);return e})}d._pPopover.then(function(e){e.openBy(t)})},onhandlePress:function(e){l=this.getModel("oGModel");if(e){var t=e.getSource().getSelectedItem().getBindingContext().getObject();l.setProperty("/Jobdata",e.getParameter("listItem").getBindingContext().getObject());l.setProperty("/jobId",t.jobId);l.setProperty("/description",t.description);l.setProperty("/startTime",t.startTime);l.setProperty("/endTime",t.endTime);l.setProperty("/createdAt",t.createdAt)}d.getOwnerComponent().runAsOwner(function(){if(!d.oDetailView){try{d.oDetailView=sap.ui.view({viewName:"cpapp.cpjobscheduler.view.ItemDetail",type:"XML"});d.bus.publish("flexible","addDetailPage",d.oDetailView);d.bus.publish("nav","toDetailPage",{viewName:d.oDetailView.getViewName()})}catch(e){d.oDetailView.onAfterRendering()}}else{d.bus.publish("nav","toDetailPage",{viewName:d.oDetailView.getViewName()})}})},onJobDelete:function(e){var t=e.getSource().getParent().getBindingContext().getObject().jobId;l.setProperty("/DeleteJob",t);d.getModel("JModel").callFunction("/deleteMLJob",{method:"GET",urlParameters:{jobId:t},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.deleteMLJob.includes("true")){sap.m.MessageToast.show(l.getProperty("/DeleteJob")+": Job Deleted")}d.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Deletion failed")}})},onUpdateJob:function(e){var t=e.getSource().getParent().getBindingContext().getObject(),o,i,a;l.setProperty("/JobDetailstoUpdate",t);l.setProperty("/updatejob",t.jobId);l.setProperty("/updatejobDesc",t.description);if(t.active===true){o="T"}else if(t.active===false){o="F"}sap.ui.getCore().byId("idUJActive").setSelectedKey(o);i=new Date(t.startTime);a=new Date(t.endTime);sap.ui.getCore().byId("idUJSTime").setDateValue(i);sap.ui.getCore().byId("idUJETime").setDateValue(a);this._valueHelpDialogUpdateJob.open()},onUpdateJobClose:function(){this._valueHelpDialogUpdateJob.close()},onJobUpdateSave:function(){var e=l.getProperty("/JobDetailstoUpdate");var t=sap.ui.getCore().byId("idUJActive").getSelectedKey(),o=sap.ui.getCore().byId("idUJSTime").getDateValue(),i=sap.ui.getCore().byId("idUJETime").getDateValue(),a,s,r=sap.ui.getCore().byId("idUJob").getValue(),n=sap.ui.getCore().byId("idUJDesc").getValue(),p=e.action,u=e.name;o=o.toISOString().split("T");a=o[1].split(":");i=i.toISOString().split("T");s=i[1].split(":");o=o[0]+" "+a[0]+":"+a[1]+" "+"+0000";i=i[0]+" "+s[0]+":"+s[1]+" "+"+0000";if(t==="T"){t=true}else if(t==="F"){t=false}var c={jobId:r,name:u,description:n,action:encodeURIComponent(p),httpMethod:"POST",active:t,startTime:o,endTime:i};d.getModel("JModel").callFunction("/updateMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(c)},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.updateMLJob.includes("true")){sap.m.MessageToast.show(l.getProperty("/JobDetailstoUpdate").jobId+": Job Updated")}d._valueHelpDialogUpdateJob.close();d.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();d.onCreateJobClose();sap.m.MessageToast.show("Failed to update job details")}})},onCreateJob:function(e){var t=sap.ui.core.UIComponent.getRouterFor(d);t.navTo("CreateJob",{},true)}})});