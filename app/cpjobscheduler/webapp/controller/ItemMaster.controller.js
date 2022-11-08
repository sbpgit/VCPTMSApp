sap.ui.define(
  [
    "cpapp/cpjobscheduler/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/Device",
    "sap/ui/core/Fragment"
  ],
  function (
    BaseController,
    MessageToast,
    JSONModel,
    Filter,
    FilterOperator,
    MessageBox,
    Device,
    Fragment
  ) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("cpapp.cpjobscheduler.controller.ItemMaster", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        that = this;
        // Declaring JSON Model and size limit
        this.listModel = new JSONModel();
          this.JobLogsModel = new JSONModel();
          this.JobDataModel = new JSONModel();
          this.ScheLogModel = new JSONModel();
          this.ScheRunLogModel = new JSONModel();

          this.listModel.setSizeLimit(2000);
          this.JobLogsModel.setSizeLimit(1000);
          this.JobDataModel.setSizeLimit(1000);
          this.ScheLogModel.setSizeLimit(1000);
          // Declaration of Dialogs
          

          if (!this._valueHelpDialogUpdateJob) {
            this._valueHelpDialogUpdateJob = sap.ui.xmlfragment(
              "cpapp.cpjobscheduler.view.UpdateJobDialog",
              this
            );
            this.getView().addDependent(this._valueHelpDialogUpdateJob);
          }

          
        this.bus = sap.ui.getCore().getEventBus();
        this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
        this.bus.publish("nav", "toBeginPage", {
          viewName: this.getView().getProperty("viewName"),
        });
        this.bus.subscribe("data", "dateRange", this.handleDateChange, this);

        this.byId("target").addEventDelegate({
            onmouseover: this._showPopover,
            onmouseout: this._clearPopover,
          }, this);
      },

      _showPopover: function (oEvent) {
       var id1 = oEvent.target.id.split("jobList-")[1].split("-")[0],
            id2 = oEvent.target.id.split("jobList-")[0],
        id = id2 + "jobList-" + id1;

        var oSelItem = this.byId("jobList").getItems()[id1].getBindingContext().getObject();

        // this.byId("idDesc").setText(" " + "Description" + " - " + oSelItem.description + " ");
        // this.byId("idSt").setText("Start Time" + " - " + oSelItem.startTime);
        // this.byId("idET").setText("End Time" + " - " + oSelItem.endTime);
        // this.byId("idCA").setText("Created At" + " - " + oSelItem.createdAt);

        var oData, aFinalData = [];

			oData = {
				"description": oSelItem.description,
				"startTime": oSelItem.startTime,
				"endTime": oSelItem.endTime,
				"createdAt": oSelItem.createdAt,
			};
			aFinalData.push(oData);

			// Model set
			that.dataModel = new JSONModel();
			that.dataModel.setData({
				resultsData: aFinalData
			});
			that.byId("idData").setModel(that.dataModel);



    //     // Getting the selected Item from list
    //     oGModel = this.getModel("oGModel");

    // //   Setting the selected values
    //   oGModel.setProperty("/jobId", oSelItem.jobId);
    //   oGModel.setProperty("/description", oSelItem.description);
    //   oGModel.setProperty("/startTime", oSelItem.startTime);
    //   oGModel.setProperty("/endTime", oSelItem.endTime);
    //   oGModel.setProperty("/createdAt", oSelItem.createdAt);




        this._timeId = setTimeout(() => {
          this.byId("popover").openBy(this.byId(id));
        }, 500);
      },
  
      _clearPopover: function () {
        clearTimeout(this._timeId);
        this.byId("popover").close();
      },

      /**
       * This function is to refreshing Master page data.
       */
      refreshMaster: function () {
        this.onAfterRendering();
      },

      /**
       * Called after the view has been rendered
       */
      onAfterRendering: function () {
        oGModel = this.getModel("oGModel");
          that.oList = that.byId("jobList");
          that.oList.removeSelections(true);

          that.getView().byId("headSearch").setValue();
          oGModel.setProperty("/dataFlag", "");

        //   var nowH = new Date();
        //   //past 15 days selected date
        //   var oDateL = new Date(
        //     nowH.getFullYear(),
        //     nowH.getMonth(),
        //     nowH.getDate() - 15
        //   );
        //   // Setting the date values to filter the data
        //   this.byId("idDateRange").setDateValue(oDateL);
        //   this.byId("idDateRange").setSecondDateValue(nowH);

        //   that.byId("JobPanel").setExpanded(true);
        //   that.byId("jobDetailsPanel").setExpanded(false);
        //   sap.ui.core.BusyIndicator.show();
        that.oList.setBusy(true);
          that.getModel("JModel").callFunction("/readJobs", {
            method: "GET",
            success: function (oData) {
                that.oList.setBusy(false);
            //   sap.ui.core.BusyIndicator.hide();
              oData.results.forEach(function (row) {
                row.jobId = row.jobId.toString();
              }, that);
              oGModel.setProperty("/tableData", oData.results);
              var aData = [];
              var dDate = oGModel.getProperty("/DateRange").split(" To ");
            //   var dLow = new Date(dDate[0]),
            //     dHigh = new Date(dDate[1] + " " + "23:59:59");
            var dLow = dDate[0] + " " + "00:00:00" ,
                dHigh = dDate[1] + " " + "23:59:59";
              // Filtering data based on selected dates
              for (var i = 0; i < oData.results.length; i++) {
                //var startDate = new Date(oData.results[i].startTime);
                var startDate = oData.results[i].startTime;
                if (dLow < startDate && dHigh > startDate) {
                  aData.push(oData.results[i]);
                }
              }

              that.listModel.setData({
                results: aData,
              });
              that.oList.setModel(that.listModel);
              that.onSearch();

              // Setting the default selected item for table
            that.byId("jobList").setSelectedItem(that.byId("jobList").getItems()[0], true);
            oGModel.setProperty("/aDATA", aData[0]);
            oGModel.setProperty("/dataFlag", "X");
              that.onhandlePress();
            },
            error: function (error) {
                that.oList.setBusy(false);
            //   sap.ui.core.BusyIndicator.hide();
              MessageToast.show("Failed to get data");
            },
          });
        },

        /**
         * Called when something is entered into the search field.
         * @param {object} oEvent -the event information.
         */
        onSearch: function (oEvent) {
          var sQuery = that.getView().byId("headSearch").getValue(),
            oFilters = [];
          var aFilter = [];

          if (sQuery !== "") {
            var oFilters = new Filter({
              filters: [
                new Filter("jobId", FilterOperator.Contains, sQuery),
                new Filter("name", FilterOperator.Contains, sQuery),
                // new Filter("description", FilterOperator.Contains, sQuery),
              ],
              and: false,
            });
            aFilter.push(oFilters);
          }

          that.byId("jobList").getBinding("items").filter(aFilter);
        },

        /**
         * This function is called when change the dates to get the jobs.
         * @param {object} oEvent -the event information.
         */
        handleDateChange: function (oEvent) {
            var tabData = oGModel.getProperty("/tableData");
            var aData = [];
            // var dDate = that.byId("idDateRange").getValue().split(" To ");
            var dDate = oGModel.getProperty("/DateRange").split(" To ");
            var dLow = dDate[0] + " " + "00:00:00",
              dHigh = dDate[1] + " " + "23:59:59";
            // Filtering data based on selected dates
            for (var i = 0; i < tabData.length; i++) {
              // var startDate = new Date(tabData[i].startTime);
               var startDate = tabData[i].startTime;
              if (dLow < startDate && dHigh > startDate) {
                aData.push(tabData[i]);
              }
            }
  
            that.listModel.setData({
              results: aData,
            });
            that.oList.setModel(that.listModel);
            that.onSearch();
            that.byId("jobList").setSelectedItem(that.byId("jobList").getItems()[0], true);
            oGModel.setProperty("/aDATA", aData[0]);
              that.onhandlePress();
          },


          handleLinkPress: function(oEvent){
            // Getting the selected Item from list
            oGModel = this.getModel("oGModel");
            var oButton = oEvent.getSource(),
            oView = this.getView();
          var oSelItem = oEvent.getSource().getParent().getBindingContext().getObject();

        //   Setting the selected values
          oGModel.setProperty("/jobId", oSelItem.jobId);
          oGModel.setProperty("/description", oSelItem.description);
          oGModel.setProperty("/startTime", oSelItem.startTime);
          oGModel.setProperty("/endTime", oSelItem.endTime);
          oGModel.setProperty("/createdAt", oSelItem.createdAt);

          	// create popover
			if (!that._pPopover) {
				that._pPopover = Fragment.load({
					id: oView.getId(),
					name: "cpapp.cpjobscheduler.view.JobLink",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			that._pPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});


          },

      /**
       * Called when it routes to a page containing the item details.
       */
      onhandlePress: function (oEvent) {
        oGModel = this.getModel("oGModel");

        if (oEvent) {
          // Getting the selected Item from list
          var oSelItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();

          // Setting the selected values
          oGModel.setProperty("/Jobdata", oEvent.getParameter("listItem").getBindingContext().getObject());
          oGModel.setProperty("/jobId", oSelItem.jobId);
          oGModel.setProperty("/description", oSelItem.description);
          oGModel.setProperty("/startTime", oSelItem.startTime);
          oGModel.setProperty("/endTime", oSelItem.endTime);
          oGModel.setProperty("/createdAt", oSelItem.createdAt);
        } else {

            var oSelItem = oGModel.getProperty("/aDATA");

          // Setting the selected values
          oGModel.setProperty("/Jobdata", that.byId("jobList").getItems()[0].getBindingContext().getObject());
          oGModel.setProperty("/jobId", oSelItem.jobId);
          oGModel.setProperty("/description", oSelItem.description);
          oGModel.setProperty("/startTime", oSelItem.startTime);
          oGModel.setProperty("/endTime", oSelItem.endTime);
          oGModel.setProperty("/createdAt", oSelItem.createdAt);

        }
        // Calling Item Detail page
        that.getOwnerComponent().runAsOwner(function () {
          if (!that.oDetailView) {
            try {
              that.oDetailView = sap.ui.view({
                viewName: "cpapp.cpjobscheduler.view.ItemDetail",
                type: "XML",
              });
              that.bus.publish("flexible", "addDetailPage", that.oDetailView);
              that.bus.publish("nav", "toDetailPage", {
                viewName: that.oDetailView.getViewName(),
              });
            } catch (e) {
            //   that.oDetailView.onAfterRendering();
            }
          } else {
            that.bus.publish("nav", "toDetailPage", {
              viewName: that.oDetailView.getViewName(),
            });
          }
        });
      },

       /**
         * This function is called when click on delete button to delete the schedule.
         */
        onJobDelete: function (oEvent) {
            var oJobId = oEvent.getSource().getParent().getBindingContext().getObject().jobId;
  
            oGModel.setProperty("/DeleteJob", oJobId);
  
            that.getModel("JModel").callFunction("/deleteMLJob", {
              method: "GET",
              urlParameters: {
                jobId: oJobId,
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                if (oData.deleteMLJob.includes("true")) {
                  sap.m.MessageToast.show(
                    oGModel.getProperty("/DeleteJob") + ": Job Deleted"
                  );
                }
                // Calling funtion to get the updated data
                that.onAfterRendering();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Deletion failed");
              },
            });
          },
  
          /**
           * This function is called when click on Edit button on Job to edit the job details .
           * @param {object} oEvent -the event information.
           */
          onUpdateJob: function (oEvent) {
            var oJobId = oEvent
  .getSource()
  .getParent()
  .getBindingContext()
  .getObject(),
              bActive,
              dStartTime,
              dEndTime;
            oGModel.setProperty("/JobDetailstoUpdate", oJobId);
            oGModel.setProperty("/updatejob", oJobId.jobId);
            oGModel.setProperty("/updatejobDesc", oJobId.description);
            if (oJobId.active === true) {
              bActive = "T";
            } else if (oJobId.active === false) {
              bActive = "F";
            }
            sap.ui.getCore().byId("idUJActive").setSelectedKey(bActive);
  
            dStartTime = new Date(oJobId.startTime);
            dEndTime = new Date(oJobId.endTime);
            sap.ui.getCore().byId("idUJSTime").setDateValue(dStartTime);
            sap.ui.getCore().byId("idUJETime").setDateValue(dEndTime);
  
            this._valueHelpDialogUpdateJob.open();
          },
  
          /**
           * Called when 'Close/Cancel' button in any dialog is pressed.
           */
          onUpdateJobClose: function () {
            this._valueHelpDialogUpdateJob.close();
          },
  
          /**
           * This function is called when click on Save button to change the job details.
           */
          onJobUpdateSave: function () {
            var aSelJonDetails = oGModel.getProperty("/JobDetailstoUpdate");
            var bActive = sap.ui.getCore().byId("idUJActive").getSelectedKey(),
              dUPSdate = sap.ui.getCore().byId("idUJSTime").getDateValue(),
              dUJEdate = sap.ui.getCore().byId("idUJETime").getDateValue(),
              tUJStime,
              tUJEtime,
              oJobid = sap.ui.getCore().byId("idUJob").getValue(),
              oJobDesc = sap.ui.getCore().byId("idUJDesc").getValue(),
              action = aSelJonDetails.action,
              name = aSelJonDetails.name;
  
            dUPSdate = dUPSdate.toISOString().split("T");
            tUJStime = dUPSdate[1].split(":");
            dUJEdate = dUJEdate.toISOString().split("T");
            tUJEtime = dUJEdate[1].split(":");
  
            dUPSdate =
              dUPSdate[0] + " " + tUJStime[0] + ":" + tUJStime[1] + " " + "+0000";
            dUJEdate =
              dUJEdate[0] + " " + tUJEtime[0] + ":" + tUJEtime[1] + " " + "+0000";
  
            if (bActive === "T") {
              bActive = true;
            } else if (bActive === "F") {
              bActive = false;
            }
            // Final data which need to update with
            var finalList = {
              jobId: oJobid,
              name: name,
              description: oJobDesc,
              action: encodeURIComponent(action),
              httpMethod: "POST",
              active: bActive,
              startTime: dUPSdate,
              endTime: dUJEdate,
            };
  
            that.getModel("JModel").callFunction("/updateMLJob", {
              method: "GET",
              urlParameters: {
                jobDetails: JSON.stringify(finalList),
              },
              success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                if (oData.updateMLJob.includes("true")) {
                  sap.m.MessageToast.show(
                    oGModel.getProperty("/JobDetailstoUpdate").jobId +
                      ": Job Updated"
                  );
                }
                that._valueHelpDialogUpdateJob.close();
                // Calling funtion to get the updated data
                that.onAfterRendering();
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                that.onCreateJobClose();
                sap.m.MessageToast.show("Failed to update job details");
              },
            });
          },


          /**
         * Called when it routes to create job page.
         * @param {object} oEvent -the event information.
         */
        onCreateJob: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("CreateJob", {}, true);
          },
          
     
    });
  }
);
