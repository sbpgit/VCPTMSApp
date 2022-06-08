sap.ui.define(["cpapp/cpjobscheduler/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","sap/ui/core/routing/HashChanger","sap/m/MessageToast","sap/ui/Device","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,a,o,s,i,l,r){"use strict";var d,u;return e.extend("cpapp.cpjobscheduler.controller.Prediction",{onInit:function(){d=this;this.listModel=new t;this.JobLogsModel=new t;this.JobDataModel=new t;this.ScheLogModel=new t;this.listModel.setSizeLimit(2e3);this.JobLogsModel.setSizeLimit(1e3);this.JobDataModel.setSizeLimit(1e3);this.ScheLogModel.setSizeLimit(1e3);if(!this._valueHelpDialogJobData){this._valueHelpDialogJobData=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.JobData",this);this.getView().addDependent(this._valueHelpDialogJobData)}if(!this._valueHelpDialogUpdateJob){this._valueHelpDialogUpdateJob=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.UpdateJobDialog",this);this.getView().addDependent(this._valueHelpDialogUpdateJob)}if(!this._valueHelpDialogScheLog){this._valueHelpDialogScheLog=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.ScheLog",this);this.getView().addDependent(this._valueHelpDialogScheLog)}},onAfterRendering:function(){u=this.getModel("oGModel");d.oList=d.byId("jobList");d.oList.removeSelections(true);d.getView().byId("headSearch").setValue();var e=new Date;var t=new Date(e.getFullYear(),e.getMonth(),e.getDate()-15);this.byId("idDateRange").setDateValue(t);this.byId("idDateRange").setSecondDateValue(e);d.byId("JobPanel").setExpanded(true);d.byId("jobDetailsPanel").setExpanded(false);sap.ui.core.BusyIndicator.show();d.getModel("JModel").callFunction("/lreadJobs",{method:"GET",success:function(e){sap.ui.core.BusyIndicator.hide();e.lreadJobs.value.forEach(function(e){e.jobId=e.jobId.toString()},d);u.setProperty("/tableData",e.lreadJobs.value);var t=[];var a=d.byId("idDateRange").getValue().split("To");var o=new Date(a[0]),s=new Date(a[1]+" "+"23:59:59");for(var i=0;i<e.lreadJobs.value.length;i++){var l=new Date(e.lreadJobs.value[i].startTime);if(o<l&&s>l){t.push(e.lreadJobs.value[i])}}d.listModel.setData({results:t});d.oList.setModel(d.listModel);d.onSearch()},error:function(e){sap.ui.core.BusyIndicator.hide();s.show("Failed to get data")}})},onSearch:function(e){var t=d.getView().byId("headSearch").getValue(),a=[];var o=[];if(t!==""){var a=new l({filters:[new l("jobId",r.Contains,t),new l("name",r.Contains,t),new l("description",r.Contains,t)],and:false});o.push(a)}d.byId("jobList").getBinding("items").filter(o)},onPanelExpand:function(){var e=d.byId("JobPanel").getExpanded();if(e===true){d.byId("jobList").removeSelections(true)}},onCreateJob:function(e){var t=sap.ui.core.UIComponent.getRouterFor(d);t.navTo("CreateJob",{},true)},handleDateChange:function(e){var t=u.getProperty("/tableData");var a=[];var o=d.byId("idDateRange").getValue().split("To");var s=new Date(o[0]),i=new Date(o[1]+" "+"23:59:59");for(var l=0;l<t.length;l++){var r=new Date(t[l].startTime);if(s<r&&i>r){a.push(t[l])}}d.listModel.setData({results:a});d.oList.setModel(d.listModel);d.onSearch()},onhandlePress:function(e){u=this.getModel("oGModel");var t=e.getParameter("listItem").getCells()[0].getTitle();u.setProperty("/newSch","");u.setProperty("/UpdateSch","");u.setProperty("/Jobdata",e.getParameter("listItem").getBindingContext().getObject());d.getModel("JModel").callFunction("/lreadJobDetails",{method:"GET",urlParameters:{jobId:t,displaySchedules:true},success:function(e){e.lreadJobDetails.value.schedules.forEach(function(t){if(!e.lreadJobDetails.value.action.includes("DemandQty")){if(t.time){var a=t.time.split("T"),o=a[1].split(".")[0];t.time=a[0]+" "+o}}else{if(t.time){var a=t.time.split("+");t.time=a[0]}}},d);var t=e.lreadJobDetails.value.schedules;d.JobLogsModel.setData({results:t});d.byId("idJobLogs").setModel(d.JobLogsModel);var a=e.lreadJobDetails.value.schedules;u.setProperty("/aJobDetails",a);if(e.lreadJobDetails.value.action.includes("Models")){u.setProperty("/JobType","M")}else if(e.lreadJobDetails.value.action.includes("Predictions")){u.setProperty("/JobType","P")}else if(e.lreadJobDetails.value.action==="generate_timeseries"){u.setProperty("/JobType","T")}else if(e.lreadJobDetails.value.action==="generate_timeseriesF"){u.setProperty("/JobType","F")}else if(e.lreadJobDetails.value.action.includes("sdi")){u.setProperty("/JobType","S");var o=u.getProperty("/Jobdata").action.split("/");var s=o.length-1;o=o[s];u.setProperty("/IBPService",o)}else{u.setProperty("/JobType","I");var o=u.getProperty("/Jobdata").action.split("/");var s=o.length-1;o=o[s];u.setProperty("/IBPService",o)}d.byId("JobPanel").setExpanded(false);d.byId("jobDetailsPanel").setExpanded(true)},error:function(e){sap.ui.core.BusyIndicator.hide();s.show("Failed to get data")}})},onScheData:function(e){var t=u.getProperty("/aJobDetails"),a=[];var o=e.getSource().getParent().getBindingContext().getObject().scheduleId;for(var i=0;i<t.length;i++){if(o===t[i].scheduleId){if(u.getProperty("/JobType")==="I"||u.getProperty("/JobType")==="S"){var l=$.parseJSON(t[i].data);var r={Location:l.LOCATION_ID,Product:l.PRODUCT_ID,scenario:l.SCENARIO,version:l.VERSION,fromdate:l.FROMDATE,todate:l.TODATE,CUSTOMER_GROUP:l.CUSTOMER_GROUP};a.push(r)}else{a=t[i].data;a=$.parseJSON(a);a=a.vcRulesList}}}d.JobDataModel.setData({results:a});sap.ui.getCore().byId("idJobData").setModel(d.JobDataModel);if(u.getProperty("/JobType")==="M"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}else if(u.getProperty("/JobType")==="P"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}else if(u.getProperty("/JobType")==="T"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(true)}else if(u.getProperty("/JobType")==="F"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}else if(u.getProperty("/JobType")==="I"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}if(u.getProperty("/JobType")!=="I"&&u.getProperty("/JobType")!=="S"){d._valueHelpDialogJobData.open()}else{var b=u.getProperty("/IBPService");var n=0;if(b==="generateFDemandQty"||b==="generateFCharPlan"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true)}else if(b==="exportIBPLocation"||b==="exportIBPCustomer"||b.includes("ImportECC")){s.show("There is no schedule data to display for the selected job type");n=1}else if(b==="exportIBPMasterProd"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true)}else if(b==="exportIBPClass"){sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(true)}else if(b==="exportIBPSalesTrans"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(true)}else if(b==="exportIBPSalesConfig"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(true)}else if(b==="exportComponentReq"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(true)}else if(b==="exportActCompDemand"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(true)}if(n===0){d._valueHelpDialogJobData.open()}}},onSchestatus:function(e){var t=u.getProperty("/Jobdata").jobId,a=e.getSource().getParent().getBindingContext().getObject().scheduleId;sap.ui.core.BusyIndicator.show();d.getModel("JModel").callFunction("/lreadJobRunLogs",{method:"GET",urlParameters:{jobId:t,scheduleId:a,page_size:50,offset:0},success:function(e){sap.ui.core.BusyIndicator.hide();d.ScheLogModel.setData({results:e.lreadJobRunLogs.value});sap.ui.getCore().byId("idScheLogData").setModel(d.ScheLogModel);d._valueHelpDialogScheLog.open()},error:function(e){sap.ui.core.BusyIndicator.hide();s.show("Failed to get data")}})},onScheLogClose:function(){d._valueHelpDialogScheLog.close()},onjobClose:function(){d._valueHelpDialogJobData.close()},onAddSchedule:function(){u.setProperty("/newSch","X");d.onCreateJob()},onJobDelete:function(e){var t=e.getSource().getParent().getBindingContext().getObject().jobId;u.setProperty("/DeleteJob",t);d.getModel("JModel").callFunction("/ldeleteJob",{method:"GET",urlParameters:{jobId:t},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.ldeleteJob.value.includes("true")){sap.m.MessageToast.show(u.getProperty("/DeleteJob")+": Job Deleted")}d.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Deletion failed")}})},onUpdateJob:function(e){var t=e.getSource().getParent().getBindingContext().getObject(),a,o,s;u.setProperty("/JobDetailstoUpdate",t);u.setProperty("/updatejob",t.jobId);u.setProperty("/updatejobDesc",t.description);if(t.active===true){a="T"}else if(t.active===false){a="F"}sap.ui.getCore().byId("idUJActive").setSelectedKey(a);o=new Date(t.startTime);s=new Date(t.endTime);sap.ui.getCore().byId("idUJSTime").setDateValue(o);sap.ui.getCore().byId("idUJETime").setDateValue(s);this._valueHelpDialogUpdateJob.open()},onUpdateJobClose:function(){this._valueHelpDialogUpdateJob.close()},onJobUpdateSave:function(){var e=u.getProperty("/JobDetailstoUpdate");var t=sap.ui.getCore().byId("idUJActive").getSelectedKey(),a=sap.ui.getCore().byId("idUJSTime").getDateValue(),o=sap.ui.getCore().byId("idUJETime").getDateValue(),s,i,l=sap.ui.getCore().byId("idUJob").getValue(),r=sap.ui.getCore().byId("idUJDesc").getValue(),b=e.action,n=e.name;a=a.toISOString().split("T");s=a[1].split(":");o=o.toISOString().split("T");i=o[1].split(":");a=a[0]+" "+s[0]+":"+s[1]+" "+"+0000";o=o[0]+" "+i[0]+":"+i[1]+" "+"+0000";if(t==="T"){t=true}else if(t==="F"){t=false}var g={jobId:l,name:n,description:r,action:b,httpMethod:"POST",active:t,startTime:a,endTime:o};d.getModel("JModel").callFunction("/lupdateJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(g)},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.lupdateJob.value.includes("true")){sap.m.MessageToast.show(u.getProperty("/JobDetailstoUpdate").jobId+": Job Updated")}d._valueHelpDialogUpdateJob.close();d.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();d.onCreateJobClose();sap.m.MessageToast.show("Failed to update job details")}})},onScheDelete:function(e){var t=u.getProperty("/Jobdata").jobId,a=e.getSource().getParent().getBindingContext().getObject().scheduleId;u.setProperty("/DeleteSchJob",t);u.setProperty("/DeleteSch",a);var o={jobId:t,scheduleId:a};d.getModel("JModel").callFunction("/ldeleteMLJobSchedule",{method:"GET",urlParameters:{scheduleDetails:JSON.stringify(o)},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.ldeleteMLJobSchedule.value.includes("true")){sap.m.MessageToast.show(u.getProperty("/DeleteSch")+": Schedule Deleted")}d.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Deletion failed")}})},onScheUpdate:function(e){var t=u.getProperty("/Jobdata").jobId,a=e.getSource().getParent().getBindingContext().getObject().scheduleId,o=u.getProperty("/aJobDetails");for(var s=0;s<o.length;s++){if(a===o[s].scheduleId){u.setProperty("/aScheUpdate",o[s])}}u.setProperty("/UpdateSch","X");d.onCreateJob()}})});