using js from '../db/jobscheduler';
using {V_JOBSTATUS,
       V_JOBRUNSTATUS,
       V_JOBRUNSTATE
 } from '../db/jobscheduler';


service JobsService @(impl : './lib/Jobs-Service.js') {
   @readonly
  entity jobs as projection on js.JOBS;

  @readonly
  entity schedules as projection on js.SCHEDULES;

  
  @readonly
  entity logs as projection on js.LOGS;

//   entity getJobStatus  as projection on V_JOBSTATUS;
  entity getJobStatus  @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'JobsViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'JobsManager' ]
            }
      ]) as projection on V_JOBSTATUS;
      
  entity getJobRunStatus as projection on V_JOBRUNSTATUS; 
  entity getJobRunState as projection on V_JOBRUNSTATE; 


  action updateJobs();
  action purgeJobLogs(purgeDays :  Integer ) returns String;

  // KLUDGE function API for Alternate to POST updateJobs()
  function fUpdateJobs() returns String;
  function fpurgeJobLogs(purgeDays :  Integer ) returns String;

// LOCAL API's for UI purpose
  function lreadJobs() returns String;
  function lreadJobDetails(jobId : Integer, displaySchedules: Boolean) returns String;
  function lreadJobSchedules(jobId : Integer) returns String;
  function lreadJobSchedule(jobId : Integer, scheduleId : String, displayLogs: Boolean) returns String;
  function lreadJobActionLogs(jobId : Integer) returns String;
  function lreadJobRunLogs(jobId : Integer, scheduleId : String, page_size : Integer, offset : Integer) returns String;
  function laddMLJob(jobDetails : String) returns String;
  function laddIBPBTPJob(jobDetails : String) returns String;
  function lupdateJob(jobDetails : String) returns String;
  function ldeleteJob(jobId : Integer) returns String;
  function laddJobSchedule(schedule : String) returns String;
  function ldeleteMLJobSchedule(scheduleDetails : String) returns String;
  function lupdateMLJobSchedule(schedule : String) returns String;



    // GET API's job-scheduler
  function readJobs() returns array of js.Jobs;
  function readJobDetails(jobId : Integer, displaySchedules: Boolean) returns String;
  function readJobSchedules(jobId : Integer) returns array of js.Schedules;
  function readJobSchedule(jobId : Integer, scheduleId : String, displayLogs: Boolean) returns String;

  function readJobActionLogs(jobId : Integer) returns String; // array of js.ActionLogs;
  function readJobRunLogs(jobId : Integer, scheduleId : String, page_size : Integer, offset : Integer) returns array of js.RunLogs;
  
  // KLUDGE function API's for Alternate to POST
  function addMLJob(jobDetails : String) returns Integer;
  function updateMLJob(jobDetails : String) returns String;
  function deleteMLJob(jobId : Integer) returns String;
  function addJobSchedule(schedule : String) returns String;
  function deleteMLJobSchedule(scheduleDetails : String) returns String;
  function updateMLJobSchedule(schedule : String) returns String;



  action createJob(url : String, cron : String) returns Integer;
  action createMLJob(jobDetails : js.mlJobs) returns Integer;
//   action updateJob(jobId : Integer, active : Boolean) returns String;
  action updateJob(jobDetails : js.Jobs) returns String;
  action deleteJob(jobId : Integer) returns String;
  action createJobSchedule(jobId : Integer, jobSchedule : js.mlSchedules) returns String;
  action deleteJobSchedule(jobId : Integer, scheduleId : String) returns String;
  action updateJobSchedule(jobId : Integer, scheduleId : String,jobSchedule : js.mlSchedules) returns String;


}