using js from '../db/jobscheduler';

service JobsService @(impl : './lib/Jobs-Service.js') {

  function lreadJobs() returns String;
  function lreadJobDetails(jobId : Integer, displaySchedules: Boolean) returns String;
  function lreadJobSchedules(jobId : Integer) returns String;
  function lreadJobActionLogs(jobId : Integer) returns String;
  function lreadJobRunLogs(jobId : Integer, scheduleId : String, page_size : Integer, offset : Integer) returns String;
  function laddMLJob(jobDetails : String) returns String;
  function lupdateJob(jobDetails : String) returns String;
  function ldeleteJob(jobId : Integer) returns String;
  function laddJobSchedule(schedule : String) returns String;







    // job-scheduler
  function readJobs() returns array of js.Jobs;
  function readJobDetails(jobId : Integer, displaySchedules: Boolean) returns String;

//   function readJobDetails(jobId : Integer, displaySchedules: Boolean) returns js.mlJobs;
//   function readJobDetails(jobId : Integer, displaySchedules: Integer) returns js.mlJobs;
  function readJobSchedules(jobId : Integer) returns array of js.Schedules;
  function readJobActionLogs(jobId : Integer) returns String; // array of js.ActionLogs;
  function readJobRunLogs(jobId : Integer, scheduleId : String, page_size : Integer, offset : Integer) returns array of js.RunLogs;
  
  // KLUDGE function API's for Alternate to POST
  function addMLJob(jobDetails : String) returns Integer;
  function updateMLJob(jobDetails : String) returns String;
  function deleteMLJob(jobId : Integer) returns String;
//   function addJobSchedule(jobId : Integer,schedule : String) returns String;
  function addJobSchedule(schedule : String) returns String;
  function deleteMLJobSchedule(scheduleDetails : String) returns String;


  action createJob(url : String, cron : String) returns Integer;
  action createMLJob(jobDetails : js.mlJobs) returns Integer;
//   action updateJob(jobId : Integer, active : Boolean) returns String;
  action updateJob(jobDetails : js.Jobs) returns String;
  action deleteJob(jobId : Integer) returns String;
  action createJobSchedule(jobId : Integer, jobSchedule : js.mlSchedules) returns String;
  action deleteJobSchedule(jobId : Integer, scheduleId : String) returns String;
}