namespace js;

type Jobs {
  name             : String;
  description      : String;
  action           : String;
  active           : Boolean;
  httpMethod       : String;
  startTime        : String;
  endTime          : String;
  ACTIVECOUNT      : Integer;
  createdAt        : String;
  INACTIVECOUNT    : Integer;
  jobId            : Integer;
  jobType          : String;
  signatureVersion : Integer;
  subDomain        : String;
  user             : String;
  _id              : Integer;
}

type Schedules {
  data  : String;
  description    : String;
  active         : Boolean;
  startTime      : String;
  endTime        : String;
  cron           : String;
  time           : String;
  repeatInterval : String;
  repeatAt       : String;
  nextRunAt      : String;
  scheduleId     : String;
  type           : String;
}

type RunLogs {
  runId               : String;
  httpStatus          : Integer;
  executionTimestamp  : String;
  runStatus           : String;
  runState            : String;
  statusMessage       : String;
  scheduleTimestamp   : String;
  completionTimestamp : String;
  runText             : String;
}

type mlJobs {
  name             : String;
  description      : String;
  action           : String;
  active           : Boolean;
  httpMethod       : String;
  startTime        : String;
  endTime          : String;
  ACTIVECOUNT      : Integer;
  createdAt        : String;
  INACTIVECOUNT    : Integer;
  jobId            : Integer;
  jobType          : String;
  signatureVersion : Integer;
  subDomain        : String;
  user             : String;
  _id              : Integer;
  schedules        : array of mlSchedules;
}

type mlSchedules {
  data  : { vcRulesList : array of {
            profile      : String(50);
            override     : Boolean;
            version      : String(10); // default 'BASELINE'; // IBP Version
            scenario     : String(32); // default 'BSL_SCENARIO'; // IBP Scenario
            Location     : String(4);
            Product      : String(40);
            GroupID      : String(20);
            Type         : String(10); // //OD - Object Dependency, Restriction
            modelVersion : String(20);// Active, Simulation// Active, Simulation
            dimensions   : Integer;
        } };
  description    : String;
  active         : Boolean;
  startTime      : String;
  endTime        : String;
  cron           : String;
  time           : String;
  repeatInterval : String;
  repeatAt       : String;
//   nextRunAt      : String;
//   scheduleId     : String;
//   type           : String;
}
type btpibpJobs {
  name             : String;
  description      : String;
  action           : String;
  active           : Boolean;
  httpMethod       : String;
  startTime        : String;
  endTime          : String;
  ACTIVECOUNT      : Integer;
  createdAt        : String;
  INACTIVECOUNT    : Integer;
  jobId            : Integer;
  jobType          : String;
  signatureVersion : Integer;
  subDomain        : String;
  user             : String;
  _id              : Integer;
  schedules        : array of btpibpSchedules;
}

type btpibpSchedules {
  data  : { 
            LOCATION_ID     : String(4);
            PRODUCT_ID      : String(40);
            VERSION      : String(10); // default 'BASELINE'; // IBP Version
            SCENARIO     : String(32); // default 'BSL_SCENARIO'; // IBP Scenario
            FROM_DATE    : Date;
            TO_DATE      : Date;
            PAST_DAYS    : Integer;
         };
  description    : String;
  active         : Boolean;
  startTime      : String;
  endTime        : String;
  cron           : String;
  time           : String;
  repeatInterval : String;
  repeatAt       : String;
}


entity JOBS  {
    key JOB_ID  : Integer @title : 'Job ID';
    key JOB_NAME  : String @title : 'Job Name';
    key ACTION : String @title : 'Action';
    key ACTIVE : Boolean @title : 'Active';
    key HTTP_METHOD : Boolean @title : 'Http Method';
    key CREATAT : String @title : 'Created At';
    JOB_DES : String @title : 'Job Description';
    JOB_TYPE: String@tiletle : 'Job Type';
    START_TIME : String @title : 'Start TIme';
    END_TIME : String @title : 'End Time';
    ACTIVECOUNT      : Integer  @title : 'Active Count';
    INACTIVECOUNT    : Integer @title : 'InActive Count';
    SIGNATURE_VERSION : Integer;
    SUB_DOMAIN        : String;
    USER             : String;
    schedules : Association to many SCHEDULES;
}

entity SCHEDULES {
    key SCHEDULE_ID  : String @title : 'Schedule ID';
    SCH_DESC : String @title : 'Schedule Description'; 
    SCH_DATA : String @title : 'Schedule Data';
    SCH_TYPE : String @title : 'Cron/one-time';
    SCH_ACTIVE : Boolean @title : 'Schedule Active';
    SCH_STARTTIME : String @title : 'Schedule Startime';
    SCH_END_TIME : String @title : 'Schedule Endtime';
    SCH_TIME : String @title : 'Schedule Time'; 
    logs : Association to many LOGS;
}

entity LOGS {
    key RUN_ID : String @ title : 'Run ID';
    HTTP_STATUS : Integer @ title : 'HTTP Status code';
    EXECUTION_TIMESTAMP : String @ title : 'Execution TimeStamp'; //indicates when actually the scheduler invoked action endpoint
    RUN_STATUS: String @ title : 'Ron Status';
    RUN_STATE : String @ title : 'Run State';
    SCHEDULED_TIMESTAMP: String @ title : 'Scheduled Timestamp'; //indicates when the schedule was picked up for calculation of next-run
    COMPLETED_TIMESTAMP: String @ title : 'Completed Timestamp'; //indicates when the scheduler received response from the action endpoint
    runtext : array of {
        text          : String @ title : 'Text';
    }
}

// entity RUNTEXTS {
//         key TEXT_ID : String @ title : 'Text ID';
//         TEXT : String @ title : 'Text';
// }