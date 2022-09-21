sap.ui.define(["cpapp/cpjobscheduler/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,o,s,a){"use strict";var i,l;return e.extend("cpapp.cpjobscheduler.controller.Home",{onInit:function(){i=this;this.listModel=new t;this.JobLogsModel=new t;this.JobDataModel=new t;this.ScheLogModel=new t;this.ScheRunLogModel=new t;this.listModel.setSizeLimit(2e3);this.JobLogsModel.setSizeLimit(1e3);this.JobDataModel.setSizeLimit(1e3);this.ScheLogModel.setSizeLimit(1e3);if(!this._valueHelpDialogJobData){this._valueHelpDialogJobData=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.JobData",this);this.getView().addDependent(this._valueHelpDialogJobData)}if(!this._valueHelpDialogUpdateJob){this._valueHelpDialogUpdateJob=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.UpdateJobDialog",this);this.getView().addDependent(this._valueHelpDialogUpdateJob)}if(!this._valueHelpDialogScheLog){this._valueHelpDialogScheLog=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.ScheLog",this);this.getView().addDependent(this._valueHelpDialogScheLog)}if(!this._valueHelpDialogScheRunLog){this._valueHelpDialogScheRunLog=sap.ui.xmlfragment("cpapp.cpjobscheduler.view.RunLogData",this);this.getView().addDependent(this._valueHelpDialogScheRunLog)}},onAfterRendering:function(){l=this.getModel("oGModel");i.oList=i.byId("jobList");i.oList.removeSelections(true);i.getView().byId("headSearch").setValue();var e=new Date;var t=new Date(e.getFullYear(),e.getMonth(),e.getDate()-15);this.byId("idDateRange").setDateValue(t);this.byId("idDateRange").setSecondDateValue(e);i.byId("JobPanel").setExpanded(true);i.byId("jobDetailsPanel").setExpanded(false);sap.ui.core.BusyIndicator.show();i.getModel("JModel").callFunction("/readJobs",{method:"GET",success:function(e){sap.ui.core.BusyIndicator.hide();e.results.forEach(function(e){e.jobId=e.jobId.toString()},i);l.setProperty("/tableData",e.results);var t=[];var o=i.byId("idDateRange").getValue().split(" To ");var s=o[0]+" "+"00:00:00",a=o[1]+" "+"23:59:59";for(var r=0;r<e.results.length;r++){var d=e.results[r].startTime;if(s<d&&a>d){t.push(e.results[r])}}i.listModel.setData({results:t});i.oList.setModel(i.listModel);i.onSearch()},error:function(e){sap.ui.core.BusyIndicator.hide();o.show("Failed to get data")}})},onSearch:function(e){var t=i.getView().byId("headSearch").getValue(),o=[];var l=[];if(t!==""){var o=new s({filters:[new s("jobId",a.Contains,t),new s("name",a.Contains,t),new s("description",a.Contains,t)],and:false});l.push(o)}i.byId("jobList").getBinding("items").filter(l)},onPanelExpand:function(){var e=i.byId("JobPanel").getExpanded();var t=i.byId("jobList").getItems();for(var o=0;o<t.length;o++){if(i.oJobId===t[o].getCells()[0].getTitle()){t[o].focus()}}},onCreateJob:function(e){var t=sap.ui.core.UIComponent.getRouterFor(i);t.navTo("CreateJob",{},true)},handleDateChange:function(e){var t=l.getProperty("/tableData");var o=[];var s=i.byId("idDateRange").getValue().split(" To ");var a=s[0]+" "+"00:00:00",r=s[1]+" "+"23:59:59";for(var d=0;d<t.length;d++){var u=t[d].startTime;if(a<u&&r>u){o.push(t[d])}}i.listModel.setData({results:o});i.oList.setModel(i.listModel);i.onSearch();i.byId("JobPanel").setExpanded(true);i.byId("jobDetailsPanel").setExpanded(false)},onhandlePress:function(e){l=this.getModel("oGModel");var t=e.getParameter("listItem").getCells()[0].getTitle();l.setProperty("/newSch","");l.setProperty("/UpdateSch","");l.setProperty("/Jobdata",e.getParameter("listItem").getBindingContext().getObject());i.getModel("JModel").callFunction("/readJobDetails",{method:"GET",urlParameters:{jobId:t,displaySchedules:true},success:function(e){e.readJobDetails.schedules.forEach(function(t){if(!e.readJobDetails.action.includes("DemandQty")){if(t.time){var o=t.time.split("T"),s=o[1].split(".")[0];t.time=o[0]+" "+s}}else{if(t.time){var o=t.time.split("+");t.time=o[0]}}},i);var t=e.readJobDetails.schedules;i.JobLogsModel.setData({results:t});i.byId("idJobLogs").setModel(i.JobLogsModel);var o=e.readJobDetails.schedules;l.setProperty("/aJobDetails",o);if(e.readJobDetails.action.includes("Models")){l.setProperty("/JobType","M")}else if(e.readJobDetails.action.includes("Predictions")){l.setProperty("/JobType","P")}else if(e.readJobDetails.action.includes("/catalog/")&&e.readJobDetails.action.split("catalog/")[1]==="generateTimeseries"){l.setProperty("/JobType","T")}else if(e.readJobDetails.action.includes("/catalog/")&&e.readJobDetails.action.split("catalog/")[1]==="generateTimeseriesF"){l.setProperty("/JobType","F")}else if(e.readJobDetails.action.includes("sdi")){l.setProperty("/JobType","S");var s=l.getProperty("/Jobdata").action.split("/");var a=s.length-1;s=s[a];l.setProperty("/IBPService",s)}else if(e.readJobDetails.action.includes("genFullConfigDemand")){l.setProperty("/JobType","D")}else if(e.readJobDetails.action.includes("AssmbReq")){l.setProperty("/JobType","A")}else if(e.readJobDetails.action.includes("genUniqueID")){l.setProperty("/JobType","O")}else if(e.readJobDetails.action.includes("ibpimport-srv")){l.setProperty("/JobType","I");var s=l.getProperty("/Jobdata").action.split("/");var a=s.length-1;s=s[a];l.setProperty("/IBPService",s)}i.byId("JobPanel").setExpanded(false);i.byId("jobDetailsPanel").setExpanded(true)},error:function(e){sap.ui.core.BusyIndicator.hide();o.show("Failed to get data")}})},onScheData:function(e){var t=l.getProperty("/aJobDetails"),s=[];var a=e.getSource().getParent().getBindingContext().getObject().scheduleId;for(var r=0;r<t.length;r++){if(a===t[r].scheduleId){if(l.getProperty("/JobType")==="I"||l.getProperty("/JobType")==="S"){var d=$.parseJSON(t[r].data);var u={Location:d.LOCATION_ID,Product:d.PRODUCT_ID,scenario:d.SCENARIO,version:d.VERSION,fromdate:d.FROMDATE,todate:d.TODATE,CUSTOMER_GROUP:d.CUSTOMER_GROUP};s.push(u)}else{s=t[r].data;s=$.parseJSON(s);s=s.vcRulesList}}}i.JobDataModel.setData({results:s});sap.ui.getCore().byId("idJobData").setModel(i.JobDataModel);if(l.getProperty("/JobType")==="M"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}else if(l.getProperty("/JobType")==="P"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}else if(l.getProperty("/JobType")==="T"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(true)}else if(l.getProperty("/JobType")==="F"){sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}else if(l.getProperty("/JobType")==="I"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[2].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[3].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[4].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[6].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(false);sap.ui.getCore().byId("idJobData").getColumns()[11].setVisible(false)}if(l.getProperty("/JobType")!=="I"&&l.getProperty("/JobType")!=="S"){i._valueHelpDialogJobData.open()}else{var n=l.getProperty("/IBPService");var b=0;if(n==="generateFDemandQty"||n==="generateFCharPlan"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[5].setVisible(false)}else if(n==="exportIBPLocation"||n==="exportIBPCustomer"||n.includes("ImportECC")||n.includes("ImportCuvtabInd")){o.show("There is no schedule data to display for the selected job type");b=1}else if(n==="exportIBPMasterProd"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true)}else if(n==="exportIBPClass"){sap.ui.getCore().byId("idJobData").getColumns()[7].setVisible(true)}else if(n==="exportIBPSalesTrans"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(true)}else if(n==="exportIBPSalesConfig"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[8].setVisible(true)}else if(n==="exportComponentReq"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(true)}else if(n==="exportActCompDemand"){sap.ui.getCore().byId("idJobData").getColumns()[0].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[1].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[9].setVisible(true);sap.ui.getCore().byId("idJobData").getColumns()[10].setVisible(true)}if(b===0){i._valueHelpDialogJobData.open()}}},onSchestatus:function(e){var t=l.getProperty("/Jobdata").jobId,s=e.getSource().getParent().getBindingContext().getObject().scheduleId;sap.ui.core.BusyIndicator.show();i.getModel("JModel").callFunction("/readJobRunLogs",{method:"GET",urlParameters:{jobId:t,scheduleId:s,page_size:50,offset:0},success:function(e){sap.ui.core.BusyIndicator.hide();i.ScheLogModel.setData({results:e.results});sap.ui.getCore().byId("idScheLogData").setModel(i.ScheLogModel);i._valueHelpDialogScheLog.open()},error:function(e){sap.ui.core.BusyIndicator.hide();o.show("Failed to get data")}})},onScheLogClose:function(){i._valueHelpDialogScheLog.close()},onjobClose:function(){i._valueHelpDialogJobData.close()},onAddSchedule:function(){l.setProperty("/newSch","X");i.onCreateJob()},onJobDelete:function(e){var t=e.getSource().getParent().getBindingContext().getObject().jobId;l.setProperty("/DeleteJob",t);i.getModel("JModel").callFunction("/deleteMLJob",{method:"GET",urlParameters:{jobId:t},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.deleteMLJob.includes("true")){sap.m.MessageToast.show(l.getProperty("/DeleteJob")+": Job Deleted")}i.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Deletion failed")}})},onUpdateJob:function(e){var t=e.getSource().getParent().getBindingContext().getObject(),o,s,a;l.setProperty("/JobDetailstoUpdate",t);l.setProperty("/updatejob",t.jobId);l.setProperty("/updatejobDesc",t.description);if(t.active===true){o="T"}else if(t.active===false){o="F"}sap.ui.getCore().byId("idUJActive").setSelectedKey(o);s=new Date(t.startTime);a=new Date(t.endTime);sap.ui.getCore().byId("idUJSTime").setDateValue(s);sap.ui.getCore().byId("idUJETime").setDateValue(a);this._valueHelpDialogUpdateJob.open()},onUpdateJobClose:function(){this._valueHelpDialogUpdateJob.close()},onJobUpdateSave:function(){var e=l.getProperty("/JobDetailstoUpdate");var t=sap.ui.getCore().byId("idUJActive").getSelectedKey(),o=sap.ui.getCore().byId("idUJSTime").getDateValue(),s=sap.ui.getCore().byId("idUJETime").getDateValue(),a,r,d=sap.ui.getCore().byId("idUJob").getValue(),u=sap.ui.getCore().byId("idUJDesc").getValue(),n=e.action,b=e.name;o=o.toISOString().split("T");a=o[1].split(":");s=s.toISOString().split("T");r=s[1].split(":");o=o[0]+" "+a[0]+":"+a[1]+" "+"+0000";s=s[0]+" "+r[0]+":"+r[1]+" "+"+0000";if(t==="T"){t=true}else if(t==="F"){t=false}var g={jobId:d,name:b,description:u,action:encodeURIComponent(n),httpMethod:"POST",active:t,startTime:o,endTime:s};i.getModel("JModel").callFunction("/updateMLJob",{method:"GET",urlParameters:{jobDetails:JSON.stringify(g)},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.updateMLJob.includes("true")){sap.m.MessageToast.show(l.getProperty("/JobDetailstoUpdate").jobId+": Job Updated")}i._valueHelpDialogUpdateJob.close();i.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();i.onCreateJobClose();sap.m.MessageToast.show("Failed to update job details")}})},onScheDelete:function(e){var t=l.getProperty("/Jobdata").jobId,o=e.getSource().getParent().getBindingContext().getObject().scheduleId;l.setProperty("/DeleteSchJob",t);l.setProperty("/DeleteSch",o);var s={jobId:t,scheduleId:o};i.getModel("JModel").callFunction("/deleteMLJobSchedule",{method:"GET",urlParameters:{scheduleDetails:JSON.stringify(s)},success:function(e){sap.ui.core.BusyIndicator.hide();if(e.deleteMLJobSchedule.includes("true")){sap.m.MessageToast.show(l.getProperty("/DeleteSch")+": Schedule Deleted")}i.onAfterRendering()},error:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageToast.show("Deletion failed")}})},onScheUpdate:function(e){var t=l.getProperty("/Jobdata").jobId,o=e.getSource().getParent().getBindingContext().getObject().scheduleId,s=l.getProperty("/aJobDetails");for(var a=0;a<s.length;a++){if(o===s[a].scheduleId){l.setProperty("/aScheUpdate",s[a])}}l.setProperty("/UpdateSch","X");i.onCreateJob()},onRunlogs:function(e){var t=l.getProperty("/Jobdata").jobId,s=e.getSource().getParent().getBindingContext().getObject().scheduleId;i.getModel("JModel").callFunction("/readJobRunLogs",{method:"GET",urlParameters:{jobId:t,scheduleId:s,page_size:50,offset:0},success:function(e){i.runLog=$.parseJSON(e.results[0].runText);i.ScheRunLogModel.setData({results:i.runLog});sap.ui.getCore().byId("idScheRunLogData").setModel(i.ScheRunLogModel);i._valueHelpDialogScheRunLog.open()},error:function(e){sap.ui.core.BusyIndicator.hide();o.show("Failed to get data")}})},onScheRunLogClose:function(){i._valueHelpDialogScheRunLog.close()}})});