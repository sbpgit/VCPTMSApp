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

