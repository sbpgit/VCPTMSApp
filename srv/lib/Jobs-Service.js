const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
const { v1: uuidv1} = require('uuid')


const request = require('request');
const rp = require('request-promise')
const lbaseUrl = "https://sbpbtp-vcpprovider-sc0jeojq-dev-config-products-srv.cfapps.us10.hana.ondemand.com"; 
const vcap_app = process.env.VCAP_APPLICATION;

function getBaseUrl()
{
    var tag = new RegExp('"application_uris"(.*)');
    var uri = vcap_app.match(tag);
    if (uri)
    {
        var tag1 = new RegExp('"(.*)');
        uri =uri[1].match(tag1);
        let application_uris = "";
        for (let index  = 0; index < uri[1].length; index++)
        {
            if( uri[1][index] != '"')
            {
                application_uris = application_uris + uri[1][index];
            }
            else
            {
                index = uri[1].length;
            }
        }
        
        return application_uris;

    }

}

function getJobscheduler(req) {

  xsenv.loadEnv();
  const services = xsenv.getServices({
    jobscheduler: { tags: "jobscheduler" },
  });
  if (services.jobscheduler) {
    const options = {
      baseURL: services.jobscheduler.url,
      user: services.jobscheduler.user,
      password: services.jobscheduler.password,
    };
    return new JobSchedulerClient.Scheduler(options);
  } else {
    req.error("no jobscheduler service instance found");
  }
}

module.exports = async function (srv) {

  srv.on ('updateJobs',    async req => {
     return (await _updateJobs(req,false));
  })

  srv.on ('fUpdateJobs',    async req => {
    return (await _updateJobs(req,true));
  })
  srv.before ('READ','getJobStatus', (req)=>{
    console.log("get Job Status User Info", req.user);
  })

async function _updateJobs(req,isGet) {

    var reqData = "Request for Update Job Logs Queued Sucessfully";

    console.log("_updateJobs reqData : ", reqData);
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	
  
    values.push({id, createtAt, reqData});    

    if (isGet == true)
    {
        req.reply({values});
    }
    else
    {
        let res = req._.req.res;
        res.statusCode = 202;
        res.send({values});
    }


    const baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
      let readJobsUrl = baseUrl + '/jobs/readJobs()';

    options = {
        'method': 'GET',
        'url': readJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000   
    }
    
    let ret_response ="";

    
    
    console.log('Readjobs Request Time = ', Date.now());
    await rp(options)
        .then(function (response) {
            console.log('Readjobs Response Time = ', Date.now());
            // console.log('Response   = ', response);
            ret_response = JSON.parse(response);
        })
        .catch(function (error) {
            console.log('readJobs - Error ', error);
            ret_response = JSON.parse(error);  
        });

    // await request(options, async function (error, response) {
   
    //     console.log('Readjobs Response Time = ', Date.now());
    //     console.log('statusCode:', response.statusCode); // Print the response status code if a response was received

    //     if (error) 
    //     {
    //         console.log('readJobs - Error ', error);
    //         ret_response = JSON.parse(error);
    //     }
    //     if (response.statusCode == 200)
    //     {
    //         ret_response = JSON.parse(response.body);
    //     }
    // })

    console.log("ret_response = ", ret_response);

    console.log('Time Before Sleep = ', Date.now());

    // const sleep = require('await-sleep');
    // await sleep(1000);
    // console.log('Time After Sleep = ', Date.now());

    // console.log('ret_response ', ret_response);

    console.log('ret_response.value ', ret_response.value);
    console.log('length of ret_response.value ', ret_response.value.length);

    let jobScheduleIds = [];

    for (let jobIndex =0; jobIndex <ret_response.value.length; jobIndex ++)
    {

        let jobId = ret_response.value[jobIndex].jobId;

        console.log('lreadJobSchedules  jobId', jobId, 'Name ',ret_response.value[jobIndex].name);

        let lreadJobSchedulesUrl = baseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';

        console.log('lreadJobSchedulesUrl ', lreadJobSchedulesUrl);

        options = {
            'method': 'GET',
            'url': lreadJobSchedulesUrl, 
            'headers' : {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            },
            'timeout': 1500   
   
        }
        let ret_sched_response ="";
        let respAck = false;

        await rp(options)
        .then(function (response) {
            console.log('readJobSchedules Response Time = ', Date.now());
            ret_sched_response = JSON.parse(response);
            respAck = true;
        })
        .catch(function (error) {
            console.log('readJobSchedules - Error ', error);
            ret_sched_response = JSON.parse(error);  
            respAck = true;
        });
        
        // await request(options, async function (error, response) {
    
        //     console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        //     if (error) 
        //     {
        //         console.log('lreadJobSchedules - Error ', error);
        //         ret_sched_response = JSON.parse(error);
        //         respAck = true;
        //     }
        //     if (response.statusCode == 200)
        //     {
        //         ret_sched_response = JSON.parse(response.body);
        //         respAck = true;
        //     }
        // })
        // const sleep = require('await-sleep');
        // await sleep(1500);
        
        if (respAck)
        {
            console.log("ret_sched_response.length ", ret_sched_response.value.length);

            for (let schIndex =0; schIndex < ret_sched_response.value.length; schIndex ++)
            {
                let scheduleId = ret_sched_response.value[schIndex].scheduleId;
                jobScheduleIds.push({jobId,scheduleId});

                let sqlStr = 'UPSERT "JS_JOBS" VALUES (' +
                    "'" + ret_response.value[jobIndex].jobId + "'" + "," +
                    "'" + ret_response.value[jobIndex].name + "'" + "," +
                    "'" + ret_response.value[jobIndex].action + "'" + "," +
                        ret_response.value[jobIndex].active + "," +
                    "'" + ret_response.value[jobIndex].httpMethod + "'" + "," +
                    "'" + ret_response.value[jobIndex].createdAt + "'" + "," +
                    "'" + ret_response.value[jobIndex].description + "'" + "," +
                    "'" + ret_response.value[jobIndex].jobType + "'" + "," +
                    "'" + ret_response.value[jobIndex].startTime + "'" + "," +
                    "'" + ret_response.value[jobIndex].endTime + "'" + "," +
                        ret_response.value[jobIndex].ACTIVECOUNT + "," +
                        ret_response.value[jobIndex].INACTIVECOUNT + "," +
                        ret_response.value[jobIndex].signatureVersion + "," +
                    "'" + ret_response.value[jobIndex].subDomain + "'" + "," +
                    "'" + ret_response.value[jobIndex].user + "'" + "," +
                    "'" + scheduleId + "'" + ')' + ' WITH PRIMARY KEY';
                    console.log("readjobs sqlStr : ", sqlStr);

                    await cds.run(sqlStr);
            }
        }

    }

    console.log("jobScheduleIds ", jobScheduleIds);

    let jobScheduleLogs = [];

    for (let jobSchLogIndex =0; jobSchLogIndex <jobScheduleIds.length; jobSchLogIndex ++)
    {

        let jobId = jobScheduleIds[jobSchLogIndex].jobId;
        let scheduleId = jobScheduleIds[jobSchLogIndex].scheduleId;
        let displayLogs = true;
        console.log('lreadJobSchedule  jobId :', jobId, 'scheduleId :', scheduleId, 'displayLogs :', displayLogs);

         let lreadJobScheduleUrl = baseUrl + 
        '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';

        console.log('lreadJobScheduleUrl ', lreadJobScheduleUrl);

        options = {
            'method': 'GET',
            'url': lreadJobScheduleUrl, 
            'headers' : {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            },
            'timeout': 1500      
        }
        let ret_schedlog_response ="";
        respAck = false;
        
        await rp(options)
        .then(function (response) {
            console.log('readJobSchedule Response Time = ', Date.now());
            ret_schedlog_response = JSON.parse(response);
            respAck = true;
        })
        .catch(function (error) {
            console.log('readJobSchedules - Error ', error);
            ret_schedlog_response = JSON.parse(error);  
            respAck = true;
        });

        // await request(options, async function (error, response) {
    
        //     console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        //     if (error) 
        //     {
        //         console.log('lreadJobSchedule - Error ', error);
        //         ret_schedlog_response = JSON.parse(error);
        //         respAck = true;
        //     }
        //     if (response.statusCode == 200)
        //     {
        //         ret_schedlog_response = JSON.parse(response.body);
        //         respAck = true;
        //     }
        // })
        // const sleep = require('await-sleep');
        // await sleep(1500);

        console.log("ret_schedlog_response respAck ", respAck);
        if (respAck)
        {
            console.log("ret_schedlog_response logs ", ret_schedlog_response.value.logs);
            
            for (let logIndex =0; logIndex < (ret_schedlog_response.value.logs.length); logIndex ++)
            {
                let runId = ret_schedlog_response.value.logs[logIndex].runId;
                jobScheduleLogs.push({jobId,scheduleId,runId});

                let jsSqlStr = 'UPSERT "JS_SCHEDULES" VALUES (' +
                    "'" + ret_schedlog_response.value.scheduleId + "'" + "," +
                    "'" + ret_schedlog_response.value.description + "'" + "," +
                    "'" + ret_schedlog_response.value.data + "'" + "," +
                    "'" + ret_schedlog_response.value.type + "'" + "," +
                        ret_schedlog_response.value.active + "," +
                    "'" + ret_schedlog_response.value.startTime + "'" + "," +
                    "'" + ret_schedlog_response.value.endTime + "'" + "," +
                    "'" + ret_schedlog_response.value.time + "'" + "," +
                    "'" + ret_schedlog_response.value.nextRunAt + "'" + "," +
                    "'" + runId + "'" + ')' + ' WITH PRIMARY KEY';
                
                console.log("jobScheduleLogs jsSqlStr : ", jsSqlStr);
                
                await cds.run(jsSqlStr);

                let httpStatus = ret_schedlog_response.value.logs[logIndex].httpStatus;
                let executionTimestamp = ret_schedlog_response.value.logs[logIndex].executionTimestamp;
                let runStatus = ret_schedlog_response.value.logs[logIndex].runStatus;
                let runState = ret_schedlog_response.value.logs[logIndex].runState;
                let statusMessage = ret_schedlog_response.value.logs[logIndex].statusMessage;
                let scheduleTimestamp = ret_schedlog_response.value.logs[logIndex].scheduleTimestamp;
                let completionTimestamp = ret_schedlog_response.value.logs[logIndex].completionTimestamp;
                let runText = ret_schedlog_response.value.logs[logIndex].runText;
                let runStr = runText.replace(/'/g, '"');
                if (runStr.length >= 5000)
                {
                    runStr = runStr.slice(0,4995) + "...";
                }

                let logsSqlStr = 'UPSERT "JS_LOGS" VALUES (' +
                    "'" + runId + "'" + "," +
                          httpStatus  + "," +
                    "'" + executionTimestamp + "'" + "," +
                    "'" + runStatus + "'" + "," +
                    "'" + runState + "'" + "," +
                    "'" + statusMessage + "'" + "," +
                    "'" + completionTimestamp + "'" + "," +
                    "'" + scheduleTimestamp + "'" + "," +
                    "'" + runStr + "'" + ')' + ' WITH PRIMARY KEY';
                
                console.log("jobScheduleLogs logsSqlStr : ", logsSqlStr);

                await cds.run(logsSqlStr);
            }
        }
    }  

    console.log("jobScheduleLogs ", jobScheduleLogs);

    let purgeSqlStr = 'SELECT DISTINCT SCHEDULE_ID,' +
                      'DAYS_BETWEEN(TO_TIMESTAMP(SCH_END_TIME,' + "'" + 'YYYY-MM-DD HH24:MI:SS' + "')," +
                      'CURRENT_DATE) AS DAYS, RUN_ID FROM JS_SCHEDULES' +
                      ' WHERE (DAYS_BETWEEN(TO_TIMESTAMP(SCH_STARTTIME,' + "'" + 'YYYY-MM-DD HH24:MI:SS' + "')," +
                      'CURRENT_DATE) > 30' +
                      ' AND SCH_TIME != \'now\' )' + 'OR' +
                      '( (SCH_TIME == \'now\') AND '+
                        '(DAYS_BETWEEN(TO_TIMESTAMP(SCH_NEXTRUN,' + "'" + 'YYYY-MM-DD HH24:MI:SS' + "')," +
                        'CURRENT_DATE) > 30' + ')';
    console.log("purgeSqlStr ",purgeSqlStr);
    let purgeIds = await cds.run(purgeSqlStr);
    for (purgeIdx = 0; purgeIdx < purgeIds.length; purgeIdx++)
    {
        let sqlStr = 'DELETE FROM JS_LOGS WHERE RUN_ID = ' + "'" + purgeIds[purgeIdx].RUN_ID + "'";
        console.log("JS_LOGS DELETE sqlStr ", sqlStr);
        await cds.run(sqlStr);
        console.log("JS_LOGS DELETE sqlStr ", sqlStr);

        sqlStr = 'DELETE FROM JS_JOBS WHERE SCHEDULE_ID = ' + "'" + purgeIds[purgeIdx].SCHEDULE_ID + "'";
        console.log("JS_SCHEDULES DELETE sqlStr ", sqlStr);
        await cds.run(sqlStr);

        sqlStr = 'DELETE FROM JS_SCHEDULES WHERE SCHEDULE_ID = ' + "'" + purgeIds[purgeIdx].SCHEDULE_ID + "'" +
                 ' AND RUN_ID = ' + "'" + purgeIds[purgeIdx].RUN_ID + "'";
        console.log("JS_SCHEDULES DELETE sqlStr ", sqlStr);
        await cds.run(sqlStr);
    }

    let dataObj = {};
    dataObj["success"] = true;
    dataObj["message"] = "generate Job Logs Completed Successfully at " +  new Date();


    if (req.headers['x-sap-job-id'] > 0)
    {
        const scheduler = getJobscheduler(req);

        var updateReq = {
            jobId: req.headers['x-sap-job-id'],
            scheduleId: req.headers['x-sap-job-schedule-id'],
            runId: req.headers['x-sap-job-run-id'],
            data : dataObj
            };

            scheduler.updateJobRunLog(updateReq, function(err, result) {
            if (err) {
                return console.log('Error updating run log: %s', err);
            }

            });
    }

  }   

  async function _updateJobslocal(req,isGet) {

    var reqData = {};
    console.log("_updateJobs reqData : ", reqData);
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	

    values.push({id, createtAt, reqData});    

    if (isGet == true)
    {
        req.reply({values});
    }
    else
    {
        let res = req._.req.res;
        res.statusCode = 202;
        res.send({values});
    }

    let readJobsUrl = lbaseUrl + '/jobs/readJobs()';

    options = {
        'method': 'GET',
        'url': readJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('readJobs - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    console.log('ret_response.value ', ret_response.value);
    console.log('length of ret_response.value ', ret_response.value.length);

    let jobScheduleIds = [];

    for (let jobIndex =0; jobIndex <ret_response.value.length; jobIndex ++)
    {

        let jobId = ret_response.value[jobIndex].jobId;

        console.log('lreadJobSchedules  jobId', jobId, 'Name ',ret_response.value[jobIndex].name);

        let lreadJobSchedulesUrl = lbaseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';

        console.log('lreadJobSchedulesUrl ', lreadJobSchedulesUrl);

        options = {
            'method': 'GET',
            'url': lreadJobSchedulesUrl, 
            'headers' : {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            },
            'timeout': 1500      
        }
        let ret_sched_response ="";
        let respAck = false;

        await request(options, async function (error, response) {
    
            console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
            if (error) 
            {
                console.log('lreadJobSchedules - Error ', error);
                ret_sched_response = JSON.parse(error);
                respAck = true;
            }
            if (response.statusCode == 200)
            {
                ret_sched_response = JSON.parse(response.body);
                respAck = true;
            }
        })
        const sleep = require('await-sleep');
        await sleep(1500);

        if (respAck)
        {
            console.log("ret_sched_response.length ", ret_sched_response.value.length);

            for (let schIndex =0; schIndex < ret_sched_response.value.length; schIndex ++)
            {
                let scheduleId = ret_sched_response.value[schIndex].scheduleId;
                jobScheduleIds.push({jobId,scheduleId});

                let sqlStr = 'UPSERT "JS_JOBS" VALUES (' +
                    "'" + ret_response.value[jobIndex].jobId + "'" + "," +
                    "'" + ret_response.value[jobIndex].name + "'" + "," +
                    "'" + ret_response.value[jobIndex].action + "'" + "," +
                        ret_response.value[jobIndex].active + "," +
                    "'" + ret_response.value[jobIndex].httpMethod + "'" + "," +
                    "'" + ret_response.value[jobIndex].createdAt + "'" + "," +
                    "'" + ret_response.value[jobIndex].description + "'" + "," +
                    "'" + ret_response.value[jobIndex].jobType + "'" + "," +
                    "'" + ret_response.value[jobIndex].startTime + "'" + "," +
                    "'" + ret_response.value[jobIndex].endTime + "'" + "," +
                        ret_response.value[jobIndex].ACTIVECOUNT + "," +
                        ret_response.value[jobIndex].INACTIVECOUNT + "," +
                        ret_response.value[jobIndex].signatureVersion + "," +
                    "'" + ret_response.value[jobIndex].subDomain + "'" + "," +
                    "'" + ret_response.value[jobIndex].user + "'" + "," +
                    "'" + scheduleId + "'" + ')' + ' WITH PRIMARY KEY';
                    console.log("readjobs sqlStr : ", sqlStr);

                    await cds.run(sqlStr);
            }
        }

    }

    console.log("jobScheduleIds ", jobScheduleIds);

    let jobScheduleLogs = [];

    for (let jobSchLogIndex =0; jobSchLogIndex <jobScheduleIds.length; jobSchLogIndex ++)
    {

        let jobId = jobScheduleIds[jobSchLogIndex].jobId;
        let scheduleId = jobScheduleIds[jobSchLogIndex].scheduleId;
        let displayLogs = true;
        console.log('lreadJobSchedule  jobId :', jobId, 'scheduleId :', scheduleId, 'displayLogs :', displayLogs);

        let lreadJobScheduleUrl = lbaseUrl + 
        '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';

        console.log('lreadJobScheduleUrl ', lreadJobScheduleUrl);

        options = {
            'method': 'GET',
            'url': lreadJobScheduleUrl, 
            'headers' : {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            },
            'timeout': 1500      
        }
        // var values = [];
        let ret_schedlog_response ="";
        respAck = false;
        await request(options, async function (error, response) {
    
            console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
            if (error) 
            {
                console.log('lreadJobSchedule - Error ', error);
                ret_schedlog_response = JSON.parse(error);
                respAck = true;
            }
            if (response.statusCode == 200)
            {
                ret_schedlog_response = JSON.parse(response.body);
                respAck = true;
            }
        })
        const sleep = require('await-sleep');
        await sleep(1500);

        console.log("ret_schedlog_response respAck ", respAck);
         if (respAck)
        {
            for (let logIndex =0; logIndex < (ret_schedlog_response.value.logs.length); logIndex ++)
            {
                let runId = ret_schedlog_response.value.logs[logIndex].runId;
                jobScheduleLogs.push({jobId,scheduleId,runId});

                let jsSqlStr = 'UPSERT "JS_SCHEDULES" VALUES (' +
                    "'" + ret_schedlog_response.value.scheduleId + "'" + "," +
                    "'" + ret_schedlog_response.value.description + "'" + "," +
                    "'" + ret_schedlog_response.value.data + "'" + "," +
                    "'" + ret_schedlog_response.value.type + "'" + "," +
                        ret_schedlog_response.value.active + "," +
                    "'" + ret_schedlog_response.value.startTime + "'" + "," +
                    "'" + ret_schedlog_response.value.endTime + "'" + "," +
                    "'" + ret_schedlog_response.value.time + "'" + "," +
                    "'" + runId + "'" + ')' + ' WITH PRIMARY KEY';
                
                console.log("jobScheduleLogs jsSqlStr : ", jsSqlStr);
                
                await cds.run(jsSqlStr);

            }
        }
    }  

    console.log("jobScheduleLogs ", jobScheduleLogs);

    let purgeSqlStr = 'SELECT DISTINCT SCHEDULE_ID,' +
                      'DAYS_BETWEEN(TO_TIMESTAMP(SCH_STARTTIME,' + "'" + 'YYYY-MM-DD HH24:MI:SS' + "')," +
                      'CURRENT_DATE) AS DAYS, RUN_ID FROM JS_SCHEDULES' +
                      ' WHERE DAYS_BETWEEN(TO_TIMESTAMP(SCH_STARTTIME,' + "'" + 'YYYY-MM-DD HH24:MI:SS' + "')," +
                      'CURRENT_DATE) > 30';
    console.log("purgeSqlStr ",purgeSqlStr);
    let purgeIds = await cds.run(purgeSqlStr);
    for (purgeIdx = 0; purgeIdx < purgeIds.length; purgeIdx++)
    {
        let sqlStr = 'DELETE FROM JS_LOGS WHERE RUN_ID = ' + "'" + purgeIds[purgeIdx].RUN_ID + "'";
        console.log("JS_LOGS DELETE sqlStr ", sqlStr);
        await cds.run(sqlStr);
        console.log("JS_LOGS DELETE sqlStr ", sqlStr);

        sqlStr = 'DELETE FROM JS_JOBS WHERE SCHEDULE_ID = ' + "'" + purgeIds[purgeIdx].SCHEDULE_ID + "'";
        console.log("JS_SCHEDULES DELETE sqlStr ", sqlStr);
        await cds.run(sqlStr);

        sqlStr = 'DELETE FROM JS_SCHEDULES WHERE SCHEDULE_ID = ' + "'" + purgeIds[purgeIdx].SCHEDULE_ID + "'" +
                 ' AND RUN_ID = ' + "'" + purgeIds[purgeIdx].RUN_ID + "'";
        console.log("JS_SCHEDULES DELETE sqlStr ", sqlStr);
        await cds.run(sqlStr);
    }

  }   

  
  srv.on("lreadJobs", async req => {

    var readJobsUrl ="";

    let hostName = req.headers.host;
    console.log("lreadJobs hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {
        readJobsUrl = lbaseUrl + '/jobs/readJobs()';  
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        readJobsUrl = baseUrl + '/jobs/readJobs()';
    }

    options = {
        'method': 'GET',
        'url': readJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobs - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
             ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("lreadJobDetails", async(req) => {
    let jobId = req.data.jobId;
    let displaySchedules = req.data.displaySchedules;


    var lreadJobDetailsUrl ="";

    let hostName = req.headers.host;
    console.log("lreadJobDetails hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {
        lreadJobDetailsUrl = lbaseUrl + '/jobs/readJobDetails(jobId='  + jobId + ',displaySchedules=' + displaySchedules+')';  
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        lreadJobDetailsUrl = baseUrl + '/jobs/readJobDetails(jobId='  + jobId + ',displaySchedules=' + displaySchedules+')';
    }

    console.log('lreadJobDetails  jobId', jobId, 'displayJobSchedules ', displaySchedules);

    options = {
        'method': 'GET',
        'url': lreadJobDetailsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobDetails - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("lreadJobSchedules", async(req) => {
    let jobId = req.data.jobId;

    console.log('lreadJobSchedules  jobId', jobId);

    var lreadJobSchedulesUrl ="";

    let hostName = req.headers.host;
    console.log("lreadJobSchedules hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {
        lreadJobSchedulesUrl = lbaseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        lreadJobSchedulesUrl = baseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';
    }

    options = {
        'method': 'GET',
        'url': lreadJobSchedulesUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobSchedules - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });


  srv.on("lreadJobSchedule", async(req) => {
    let jobId = req.data.jobId;
    let scheduleId = req.data.scheduleId;
    let displayLogs = req.data.displayLogs;
    console.log('lreadJobSchedule  jobId :', jobId, 'scheduleId :', scheduleId, 'displayLogs :', displayLogs);

    var lreadJobScheduleUrl ="";

    let hostName = req.headers.host;
    console.log("lreadJobSchedule hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {
        lreadJobScheduleUrl = lbaseUrl + 
        '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';
    }
    else
    {
        // let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        lreadJobScheduleUrl = baseUrl + 
        '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';
    }

    options = {
        'method': 'GET',
        'url': lreadJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobSchedule - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("lreadJobActionLogs", async(req) => {
    let jobId = req.data.jobId;

    console.log('lreadJobActionLogs  jobId', jobId);

    var lreadJobActionLogsUrl ="";

    let hostName = req.headers.host;
    console.log("lreadJobActionLogs hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {
        lreadJobActionLogsUrl = lbaseUrl + '/jobs/readJobActionLogs(jobId='  + jobId + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        lreadJobActionLogsUrl = baseUrl + '/jobs/readJobActionLogs(jobId='  + jobId + ')';
    }

    options = {
        'method': 'GET',
        'url': lreadJobActionLogsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobActionLogs - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("lreadJobRunLogs", async(req) => {
    let jobId = req.data.jobId;
    let scheduleId = req.data.scheduleId;
    let page_size = req.data.page_size;
    let offset = req.data.offset;


    console.log('lreadJobRunLogs  jobId :', jobId, 'scheduleId :', scheduleId, 'page_size :', page_size, 'offset =', offset);

    var lreadJobRunLogsUrl ="";

    let hostName = req.headers.host;
    console.log("lreadJobRunLogs hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {
        lreadJobRunLogsUrl = lbaseUrl + 
        '/jobs/readJobRunLogs(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'page_size='  + page_size + ',' + 'offset='  + offset + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        lreadJobRunLogsUrl = baseUrl + 
        '/jobs/readJobRunLogs(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'page_size='  + page_size + ',' + 'offset='  + offset + ')';
    }

    options = {
        'method': 'GET',
        'url': lreadJobRunLogsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobRunLogs - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("laddMLJob", async req => {
    
     let jobDetails = req.data.jobDetails;
     let jDetails = jobDetails.replace(/[/]/g, "%2F");

    console.log('jDetails ', jDetails);


    var addJobsUrl ="";

    let hostName = req.headers.host;
    console.log("addJobsUrl hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {   
        addJobsUrl = lbaseUrl + '/jobs/addMLJob(jobDetails=' + "'" + jDetails + "'" + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();
        addJobsUrl = baseUrl + '/jobs/addMLJob(jobDetails=' + "'" + jDetails + "'" + ')';
    }

    options = {
        'method': 'GET',
        'url': addJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('laddMLJob - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });


  srv.on("lupdateJob", async(req) => {

    let jobDetails = req.data.jobDetails;
    let jDetails = jobDetails.replace(/[/]/g, "%2F");
     console.log('jDetails ', jDetails);

     var lupdateJobUrl ="";

    let hostName = req.headers.host;
    console.log("lupdateJob hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {   
        lupdateJobUrl = lbaseUrl + '/jobs/updateMLJob(jobDetails=' + "'" + jDetails + "'" + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

        lupdateJobUrl = baseUrl + '/jobs/updateMLJob(jobDetails=' + "'" + jDetails + "'" + ')';
    }

    options = {
        'method': 'GET',
        'url': lupdateJobUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lupdateJob - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("ldeleteJob", async(req) => {
    let jobId = req.data.jobId;
    

    console.log('ldeleteJob  jobId :', jobId);
    


    var ldeleteJobUrl ="";

    let hostName = req.headers.host;
    console.log("ldeleteJob hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {   
        ldeleteJobUrl = lbaseUrl + 
        '/jobs/deleteMLJob(jobId='  + jobId +')';    
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

        ldeleteJobUrl = baseUrl + 
        '/jobs/deleteMLJob(jobId='  + jobId +')';    
    }

    options = {
        'method': 'GET',
        'url': ldeleteJobUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('ldeleteJob - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });



srv.on("laddJobSchedule", async req => {
    

    let scheduleDetails = req.data.schedule;

    console.log("laddJobSchedule req.data :", req.data);
    let sDetails = scheduleDetails.replace(/[/]/g, "%2F");

    console.log("laddJobSchedule sDetails :", sDetails);
    var addJobScheduleUrl ="";

    let hostName = req.headers.host;
    console.log("laddJobSchedule hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {   
        addJobScheduleUrl = lbaseUrl + '/jobs/addJobSchedule(schedule=' + "'" + sDetails + "'" + ')';
    
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

        addJobScheduleUrl = baseUrl + '/jobs/addJobSchedule(schedule=' + "'" + sDetails + "'" + ')';

    }
    
    options = {
        'method': 'GET',
        'url': addJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('laddJobSchedule - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("lupdateMLJobSchedule", async req => {
    

    let scheduleDetails = req.data.schedule;

    console.log("lupdateMLJobSchedule req.data :", req.data);
    let sDetails = scheduleDetails.replace(/[/]/g, "%2F");

    console.log("lupdateMLJobSchedule sDetails :", sDetails);

    var updateMLJobScheduleUrl ="";

    let hostName = req.headers.host;
    console.log("lupdateMLJobSchedule hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {   
        updateMLJobScheduleUrl = lbaseUrl + '/jobs/updateMLJobSchedule(schedule=' + "'" + sDetails + "'" + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

        updateMLJobScheduleUrl = baseUrl + '/jobs/updateMLJobSchedule(schedule=' + "'" + sDetails + "'" + ')';
    }

    options = {
        'method': 'GET',
        'url': updateMLJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('updateMLJobSchedule - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });
  
  srv.on("ldeleteMLJobSchedule", async req => {
    

    let scheduleDetails = req.data.scheduleDetails;

    console.log("ldeleteMLJobSchedule req.data :", req.data);
    let sDetails = scheduleDetails.replace(/[/]/g, "%2F");

    console.log("ldeleteMLJobSchedule sDetails :", sDetails);

    var ldeleteMLJobScheduleUrl ="";

    let hostName = req.headers.host;
    console.log("ldeleteMLJobSchedule hostName ", hostName);

    if(hostName.includes("localhost:4004"))
    {   
        ldeleteMLJobScheduleUrl = lbaseUrl + '/jobs/deleteMLJobSchedule(scheduleDetails=' + "'" + sDetails + "'" + ')';
    }
    else
    {
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

        ldeleteMLJobScheduleUrl = baseUrl + '/jobs/deleteMLJobSchedule(scheduleDetails=' + "'" + sDetails + "'" + ')';
    }

    options = {
        'method': 'GET',
        'url': ldeleteMLJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        'timeout': 1000      
    }
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('ldeleteMLJobSchedule - Error ', error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    await sleep(1000);
    req.reply(ret_response);

  });

  srv.on("readJobs", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var query = {};
        scheduler.fetchAllJobs(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving jobs"));
          }
          //Jobs retrieved successfully
          if (result && result.results && result.results.length > 0) {
            console.log("readJobs ", result.results);

            resolve(result.results);
            // resolve(JSON.stringify(result.results));
          } else {
            reject(req.warn("Can't find any job"));
          }
        });
      }
    });
  });

  srv.on("readJobDetails", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {

        console.log("readJobDetails req.data", req.data, 'displaySchedules',req.data.displaySchedules);

        let query = {
            jobId: req.data.jobId,
            displaySchedules: req.data.displaySchedules
          };        
        console.log("readJobDetails query", query);
        scheduler.fetchJob(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving job"));
          } else {
            // job was created successfully
             console.log("readJobDetails ", result);
            resolve(result);
          }
        });
      }
    });
  });

  srv.on("readJobSchedules", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var query = {
          //by Id
          jobId: req.data.jobId,
        };
        scheduler.fetchJobSchedules(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving job schedules"));
          } else {
            // job was created successfully
            resolve(result.results);
          }
        });
      }
    });
  });

  srv.on("readJobSchedule", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      var displayLogs = false;
      console.log(" readJobSchedule displayLogs ", req.data.displayLogs);

      if (req.data.displayLogs == 'true')
      {
        displayLogs = true;
      }
      if (scheduler) {
        var query = {
          //by Id
          jobId: req.data.jobId,
          scheduleId: req.data.scheduleId,
          displayLogs: displayLogs
        };

        console.log(" readJobSchedule query ", query);
        scheduler.fetchJobSchedule(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving job schedules"));
          } else {
            // job was created successfully
            console.log("readJobSchedule ", result);

            resolve(result);
          }
        });
      }
    });
  });

  srv.on("readJobActionLogs", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var query = {
          jobId: req.data.jobId,
        };
        scheduler.getJobActionLogs(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving job action logs"));
          } else {
            console.log(result.results);
            resolve(JSON.stringify(result.results));
          }
        });
      }
    });
  });

  srv.on("readJobRunLogs", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var query = {
          jobId: req.data.jobId,
          scheduleId: req.data.scheduleId,
          page_size: req.data.page_size,
          offset: req.data.offset,
        };
        scheduler.getRunLogs(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving job run logs"));
          } else {
            resolve(result.results);
          }
        });
      }
    });
  });

  srv.on(["createJob"], (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var myJob = {
          name: "validateSalesOrder",
          description: "cron job that validates sales order requests",
          action: req.data.url,
          active: true,
          httpMethod: "POST",
          schedules: [
            {
              cron: req.data.cron,
              description:
                "this schedule runs as defined from the input paramter",
              data: {},
              active: true,
              startTime: {
                date: "2021-01-04 15:00 +0000",
                format: "YYYY-MM-DD HH:mm Z",
              },
            },
          ],
        };
        var scJob = { job: myJob };
        scheduler.createJob(scJob, function (err, result) {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(result._id);
          }
        });
      }
    });
  });
  
  srv.on("addMLJob", (req) => {

    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);

      let jobDetails = req.data.jobDetails;
      let jDetails = jobDetails.replace(/%2F/g, "/");
      var inputData = JSON.parse(jDetails);

    let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

      let actionUrl = baseUrl + inputData.action;
      if (scheduler) {
        var myJob = {
          name: inputData.name,
          description: inputData.description,
          action: actionUrl,
          active: true,
          httpMethod: "POST",
          startTime: inputData.startTime,
          endTime: inputData.endTime,
          schedules: inputData.schedules      
        };
        console.log("myJob :", myJob)
        var scJob = { job: myJob };
        scheduler.createJob(scJob, function (err, result) {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(result._id);
          }
        });
      }
    });
  });

  srv.on("createMLJob", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("createMLJob req.data :", req.data);
      var inputData = req.data.jobDetails;
      console.log("createMLJob inputData :", inputData);
    let baseUrl = req.headers['x-forwarded-proto'] + '://' + getBaseUrl();

      let actionUrl = baseUrl + inputData.action;


      if (scheduler) {
        var myJob = {
          name: inputData.name,
          description: inputData.description,
          action: actionUrl,
          active: true,
          httpMethod: "POST",
          startTime: inputData.startTime,
          endTime: inputData.endTime,
          schedules: inputData.schedules
        };
        console.log("myJob :", myJob)
        var scJob = { job: myJob };
        scheduler.createJob(scJob, function (err, result) {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(result._id);
          }
        });
      }
    });
  });


  srv.on("updateMLJob", (req) => {
    console.log("updateMLJob jobDetails :", JSON.parse(req.data.jobDetails));

    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("updateMLJob req.data :", req.data);

      let jobDetails = req.data.jobDetails;
    let jDetails = jobDetails.replace(/%2F/g, "/");

      var inputData = JSON.parse(jDetails);
      console.log("updateMLJob inputData :", inputData);
    
      if (scheduler) {
        var theJob = {
            active: inputData.active,
            description: inputData.description,
            httpMethod: inputData.httpMethod,
            startTime: inputData.startTime,
            endTime: inputData.endTime,
          };

        console.log("updateJob theJob :", theJob)
        var suJob = { jobId: inputData.jobId, job: theJob };

        scheduler.updateJob(suJob, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });

  srv.on("updateJob", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var inputData = req.data.jobDetails;

        var theJob = {
            active: inputData.active,
            description: inputData.description,
            httpMethod: inputData.httpMethod,
            startTime: inputData.startTime,
            endTime: inputData.endTime,
          };

        console.log("updateJob theJob :", theJob)
        var suJob = { jobId: inputData.jobId, job: theJob };

        scheduler.updateJob(suJob, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });


  srv.on("deleteMLJob", (req) => {
    console.log("deleteMLJob jobDetails :", JSON.parse(req.data.jobId));

    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("deletMLJob req.data :", req.data);
        
      if (scheduler) {
        

        var suJob = { jobId: req.data.jobId };

        scheduler.deleteJob(suJob, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });

  srv.on(["deleteJob"], (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var jreq = {
          jobId: req.data.jobId,
        };
        scheduler.deleteJob(jreq, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });

  srv.on("createJobSchedule", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("createJobSchedule req.data :", req.data);
      var inputData = req.data.jobSchedule;
      console.log("createJobSchedule inputData :", inputData);

      if (scheduler) {
        var myJob = {
          data: inputData.data,
          description: inputData.description,
          active: inputData.active,
          startTime: inputData.startTime,
          endTime: inputData.endTime,
          cron : inputData.cron,
          time : inputData.time,
          repeatInterval : inputData.repeatInterval,
          repeatAt : inputData.repeatAt
        };
        var scJob = { jobId: req.data.jobId, schedule: myJob };
        console.log("scJob :", scJob)


        scheduler.createJobSchedule(scJob, function (err, result) {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(result);
          }
        });
      }
    });
  });


srv.on("addJobSchedule", (req) => {
    console.log( "schedule :", JSON.parse(req.data.schedule));


    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("addJobSchedule req.data :", req.data);
      var inputData = JSON.parse(req.data.schedule);
      console.log("addJobSchedule inputData :", inputData);
     
      if (scheduler) {
        
        var myJob = {
            data: inputData.data,
            description: inputData.description,
            active: inputData.active,
            startTime: inputData.startTime,
            endTime: inputData.endTime,
            cron : inputData.cron,
            time : inputData.time,
            repeatInterval : inputData.repeatInterval,
            repeatAt : inputData.repeatAt
          };

          var scJob = { jobId: inputData.jobId, schedule: myJob };
          console.log("scJob :", scJob)

        scheduler.createJobSchedule(scJob, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });

  srv.on("updateMLJobSchedule", (req) => {
    console.log( "schedule :", JSON.parse(req.data.schedule));


    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("updateMLJobSchedule req.data :", req.data);

      let schedule = req.data.schedule;
      console.log("updateMLJobSchedule schedule :", schedule);

      let jSchedule = schedule.replace(/%2F/g, "/");

      var inputData = JSON.parse(jSchedule);

       console.log("updateMLJobSchedule inputData :", inputData);
   
      if (scheduler) {
        
        var myJob = {
            data: inputData.data,
            description: inputData.description,
            active: inputData.active,
            startTime: inputData.startTime,
            endTime: inputData.endTime,
            cron : inputData.cron,
            time : inputData.time,
            repeatInterval : inputData.repeatInterval,
            repeatAt : inputData.repeatAt
          };

          var scJob = { jobId: inputData.jobId, scheduleId: inputData.scheduleId, schedule: myJob };
           console.log("scJob :", scJob)

        scheduler.updateJobSchedule(scJob, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });

  srv.on(["deleteJobSchedule"], (req) => {

    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {


        var inputData = req.data;
        console.log("deleteJobSchedule inputData :", inputData);

        var jreq = {
          jobId: req.data.jobId,
          scheduleId: req.data.scheduleId
        };
        scheduler.deleteJobSchedule(jreq, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });


  srv.on("deleteMLJobSchedule", (req) => {
    console.log("deleteMLJobSchedule scheduleDetails :", JSON.parse(req.data.scheduleDetails));

  

    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
        
      if (scheduler) {
        let scheduleDetails = JSON.parse(req.data.scheduleDetails);
        console.log("deleteMLJobSchedule scheduleDetails :", scheduleDetails);
        var jreq = {
          jobId: scheduleDetails.jobId,
          scheduleId: scheduleDetails.scheduleId
        };

        console.log("deleteMLJobSchedule jreq :", jreq);

        scheduler.deleteJobSchedule(jreq, (err, result) => {
          if (err) {
            reject(req.error(err.message));
          } else {
            resolve(JSON.stringify(result));
          }
        });
      }
    });
  });


  srv.on("updateJobSchedule", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("updateJobSchedule req.data :", req.data);
      var inputData = req.data.jobSchedule;
      console.log("updateJobSchedule inputData :", inputData);

      if (scheduler) {
        var myJob = {
          data: inputData.data,
          description: inputData.description,
          active: inputData.active,
          startTime: inputData.startTime,
          endTime: inputData.endTime,
          cron : inputData.cron,
          time : inputData.time,
          repeatInterval : inputData.repeatInterval,
          repeatAt : inputData.repeatAt
        };
        var scJob = { jobId: req.data.jobId, scheduleId: req.data.scheduleId, schedule: myJob };
        console.log("scJob :", scJob)


        scheduler.updateJobSchedule(scJob, function (err, result) {
          if (err) {
            reject(req.error(err.message));
          } else {
            // job was created successfully
            resolve(result);
          }
        });
      }
    });
  });


};
