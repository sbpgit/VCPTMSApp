using js from '../db/jobscheduler';

service JobsService @(impl : './lib/Jobs-Service.js') {

  function lreadJobs() returns String;
  function lreadJobDetails(jobId : Integer) returns String;
  function lreadJobSchedules(jobId : Integer) returns String;
  function lreadJobActionLogs(jobId : Integer) returns String;
  function lreadJobRunLogs(jobId : Integer, scheduleId : String, page_size : Integer, offset : Integer) returns String;
  function laddMLJob(jobDetails : String) returns String;





    // job-scheduler
  function readJobs() returns array of js.Jobs;
  function readJobDetails(jobId : Integer) returns js.Jobs;
  function readJobSchedules(jobId : Integer) returns array of js.Schedules;
  function readJobActionLogs(jobId : Integer) returns String; // array of js.ActionLogs;
  function readJobRunLogs(jobId : Integer, scheduleId : String, page_size : Integer, offset : Integer) returns array of js.RunLogs;
  function addMLJob(jobDetails : String) returns Integer;

  action createJob(url : String, cron : String) returns Integer;
  action createMLJob(jobDetails : js.mlJobs) returns Integer;
  action updateJob(jobId : Integer, active : Boolean) returns String;
  action deleteJob(jobId : Integer) returns String;
}