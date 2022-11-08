// namespace js;

context js {
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
        key JOB_NAME  : String(200) @title : 'Job Name';
        key ACTION : String(200) @title : 'Action';
        key ACTIVE : Boolean @title : 'Active';
        key HTTP_METHOD : String(50) @title : 'Http Method';
        key CREATAT : String(50) @title : 'Created At';
        JOB_DES : String(500) @title : 'Job Description';
        JOB_TYPE: String(50) @tiletle : 'Job Type';
        START_TIME : String(50) @title : 'Start TIme';
        END_TIME : String(50) @title : 'End Time';
        ACTIVECOUNT      : Integer  @title : 'Active Count';
        INACTIVECOUNT    : Integer @title : 'InActive Count';
        SIGNATURE_VERSION : Integer @title : 'Signature Version';
        SUB_DOMAIN        : String @title : 'Sub Domain';
        USER             : String(50) @title : 'User';
        key SCHEDULE_ID : String(50) @title : 'Schedule ID';
        // key schedules : Association to many SCHEDULES @title : 'Schedule ID';
    }

    entity SCHEDULES {
        key SCHEDULE_ID  : String(50) @title : 'Schedule ID';
        SCH_DESC : String(100) @title : 'Schedule Description'; 
        SCH_DATA : String @title : 'Schedule Data';
        SCH_TYPE : String(50) @title : 'Cron/one-time';
        SCH_ACTIVE : Boolean @title : 'Schedule Active';
        SCH_STARTTIME : String(50) @title : 'Schedule Startime';
        SCH_END_TIME : String(50) @title : 'Schedule Endtime';
        SCH_TIME : String(50) @title : 'Schedule Time'; 
        SCH_NEXTRUN : String(50) @title : 'Schedule Nextrun At'; 
        // key logs : Association to many LOGS @title : 'LOG ID';
        key RUN_ID : String(50) @ title : 'Run ID';
    };


    entity LOGS {
        key RUN_ID : String(50) @title : 'Run ID';
        HTTP_STATUS : Integer @title : 'HTTP Status code';
        EXECUTION_TIMESTAMP : String(50) @title : 'Execution TimeStamp'; //indicates when actually the scheduler invoked action endpoint
        RUN_STATUS: String(50) @title : 'Run Status';
        RUN_STATE : String(50) @title : 'Run State';
        STATUS_MESSAGE : String @title : 'Status Message';
        SCHEDULED_TIMESTAMP: String(50) @title : 'Scheduled Timestamp'; //indicates when the schedule was picked up for calculation of next-run
        COMPLETED_TIMESTAMP: String(50) @title : 'Completed Timestamp'; //indicates when the scheduler received response from the action endpoint
        // key TEXT_ID : String(50) @title : 'TextID';
        // runtext : array of {
        //     text          : String @title : 'Text';
        // }
        runtext : String @title : 'Run Text';
    }

    // entity LOGSTEXT {
    //     key TEXT_ID : String(50) @title : 'TextID';
    //     key LINE_ID : String(50) @title : 'LineID';
    //     runText : String  @title : 'Run Text';
    // }

    // entity RUNTEXTS {
    //         key TEXT_ID : String @ title : 'Text ID';
    //         TEXT : String @ title : 'Text';
    // }
}

@cds.persistence.exists 
Entity ![V_JOBSTATUS] {
key     ![JOB_ID]: Integer  @title: 'Job ID' ; 
key     ![JOB_NAME]: String(200)  @title: 'Job Name' ; 
key     ![ACTION]: String(200)  @title: 'Action' ; 
key     ![JOB_DES]: String(500)  @title: 'Job Description' ; 
key     ![SCH_STARTTIME]: String(50)  @title: 'Scheduled Start Time' ; 
key     ![SCH_END_TIME]: String(50)  @title: 'Scheduled End time' ; 
key     ![SCH_TIME]: String(50)  @title: 'Scheduled Time' ; 
key     ![SCH_NEXTRUN]: String(50)  @title: 'Scheduled Next Run' ; 
key     ![RUN_ID]: String(50)  @title: 'Run ID' ; 
key     ![RUN_STATUS]: String(50)  @title: 'Run Status' ; 
key     ![CRITICALSTATUS]: Integer  @title: 'CRITICALSTATUS' ; 
key     ![RUN_STATE]: String(50)  @title: 'Run State' ; 
key     ![CRITICALSTATE]: Integer  @title: 'CRITICALSTATE' ;
key     ![STATUS_MESSAGE]: String(5000)  @title: 'Status Message' ; 
key     ![SCHEDULED_TIMESTAMP]: String(50)  @title: 'Scheduled Timestamp' ; 
key     ![COMPLETED_TIMESTAMP]: String(50)  @title: 'Completed Timestamp' ; 
key     ![RUNTEXT]: LargeString  @title: 'Run Text' ; 
}

@cds.persistence.exists 
Entity ![V_JOBRUNSTATE] {
key     ![RUN_STATE]: String(17)  @title: 'RUN_STATE' ; 
}
@cds.persistence.exists 
Entity ![V_JOBRUNSTATUS] {
key     ![RUN_STATUS]: String(9)  @title: 'RUN_STATUS' ; 
}