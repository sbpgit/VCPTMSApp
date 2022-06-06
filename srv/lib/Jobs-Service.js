// const { resolve } = require("@sap/cds");
const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
const { v1: uuidv1} = require('uuid')

// const SapCfMailer = require("sap-cf-mailer").default;
// const metering = require("./metering");
// const { executeHttpRequest, getDestination } = require("@sap-cloud-sdk/core");
// const qs = require("qs");
// const axios = require("axios");
// const { cf } = require("cf-http-client");

// const jobFuncs = require('./Jobs-Service.js');

const request = require('request');
const lbaseUrl = "https://sbpprovider-dev-config-products-srv.cfapps.us10.hana.ondemand.com"; 


function getJobscheduler(req) {
// exports.getJobscheduler = function(req){

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

async function _updateJobs(req,isGet) {

    var reqData = {};

    console.log("_updateJobs reqData : ", reqData);
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	

   // values.push({id, createtAt, modelType, vcRulesList});    
    values.push({id, createtAt, reqData});    

    // console.log('values :', values);
    // console.log('Response completed Time  :', createtAt);

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
    // var baseUrl = 'http' + '://' + req.headers.host;
    // console.log('_generatePredictions: protocol', req.headers['x-forwarded-proto'], 'hostName :', req.headers.host);

    // let readJobsUrl = lbaseUrl + '/jobs/readJobs()';
    let readJobsUrl = baseUrl + '/jobs/readJobs()';

    options = {
        'method': 'GET',
        'url': readJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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

        // let lreadJobSchedulesUrl = lbaseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';
        let lreadJobSchedulesUrl = baseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';

        console.log('lreadJobSchedulesUrl ', lreadJobSchedulesUrl);

        options = {
            'method': 'GET',
            'url': lreadJobSchedulesUrl, 
            'headers' : {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }   
        }
        // var values = [];
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
        // req.reply(ret_sched_response);

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

        // let lreadJobScheduleUrl = lbaseUrl + 
        let lreadJobScheduleUrl = baseUrl + 
        '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';

        console.log('lreadJobScheduleUrl ', lreadJobScheduleUrl);

        options = {
            'method': 'GET',
            'url': lreadJobScheduleUrl, 
            'headers' : {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }   
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
        // console.log("ret_schedlog_response ret_schedlog_response ", ret_schedlog_response);
        

        // console.log("ret_schedlog_response logs length", ret_schedlog_response.value.logs.length);


        // req.reply(ret_response);
        if (respAck)
        {
            // console.log("ret_schedlog_response logs ", ret_schedlog_response.value.logs);
            // console.log("ret_schedlog_response logs length ", ret_schedlog_response.value.logs.length);

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

                // let textId = uuidv1();

                let logsSqlStr = 'UPSERT "JS_LOGS" VALUES (' +
                    "'" + runId + "'" + "," +
                          httpStatus  + "," +
                    "'" + executionTimestamp + "'" + "," +
                    "'" + runStatus + "'" + "," +
                    "'" + runState + "'" + "," +
                    "'" + statusMessage + "'" + "," +
                    "'" + completionTimestamp + "'" + "," +
                    "'" + scheduleTimestamp + "'" + "," +
                    // "'" + textId + "'" + "," +
                    "'" + runStr + "'" + ')' + ' WITH PRIMARY KEY';
                
                console.log("jobScheduleLogs logsSqlStr : ", logsSqlStr);

                // console.log("jobScheduleLogs runStr Length : ", runStr.length);

                
                // await sleep(200);

                await cds.run(logsSqlStr);

                // let rows = [];
                // let rowObj = [];
                // for (let lineIdx = 0; lineIdx < runText.length; lineIdx ++)
                // {
                //     let lineId = uuidv1();
                //     rowObj.push(textId, lineId, runText[lineIdx]);
                // }
                // rows.push(rowObj);
                // console.log("textId ", textId, "rows ", rows);


            }
        }
    }  

    console.log("jobScheduleLogs ", jobScheduleLogs);

  }   

  async function _updateJobslocal(req,isGet) {

    var reqData = {};
    // if (isGet == true) //GET -- Kludge
    // {
    //     reqData = JSON.parse(req.data);
    // }
    // else
    // {
    //     reqData = req.data;
    // }

    console.log("_updateJobs reqData : ", reqData);
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	

   // values.push({id, createtAt, modelType, vcRulesList});    
    values.push({id, createtAt, reqData});    

    // console.log('values :', values);
    // console.log('Response completed Time  :', createtAt);

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
        }   
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
            }   
        }
        // var values = [];
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
        // req.reply(ret_sched_response);

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
            }   
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
        // console.log("ret_schedlog_response ret_schedlog_response ", ret_schedlog_response);
        

        // console.log("ret_schedlog_response logs length", ret_schedlog_response.value.logs.length);


        // req.reply(ret_response);
        if (respAck)
        {
            // console.log("ret_schedlog_response logs ", ret_schedlog_response.value.logs);
            // console.log("ret_schedlog_response logs length ", ret_schedlog_response.value.logs.length);

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
                
                // await sleep(200);

                await cds.run(jsSqlStr);

            }
        }
    }  

    console.log("jobScheduleLogs ", jobScheduleLogs);

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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        readJobsUrl = baseUrl + '/jobs/readJobs()';
    }

    console.log("lreadJobs readJobsUrl ", readJobsUrl);

    // let readJobsUrl = lbaseUrl + '/jobs/readJobs()';

    options = {
        'method': 'GET',
        'url': readJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
    }
    var values = [];
    let ret_response ="";

    await request(options, async function (error, response) {
   
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) 
        {
            console.log('lreadJobs - Error ', error);
            // values.push(JSON.parse(error));
            //throw new Error(error);
            ret_response = JSON.parse(error);
        }
        if (response.statusCode == 200)
        {
            // values.push(JSON.parse(response.body));
            ret_response = JSON.parse(response.body);
        }
    })
    const sleep = require('await-sleep');
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
    // console.log('ret_response.value ', ret_response.value);
    // console.log('length of ret_response.value ', ret_response.value.length);

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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        lreadJobDetailsUrl = baseUrl + '/jobs/readJobDetails(jobId='  + jobId + ',displaySchedules=' + displaySchedules+')';
    }

    console.log('lreadJobDetails  jobId', jobId, 'displayJobSchedules ', displaySchedules);


    console.log('lreadJobDetailsUrl ', lreadJobDetailsUrl);

    options = {
        'method': 'GET',
        'url': lreadJobDetailsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        lreadJobSchedulesUrl = baseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';
    }


    // let lreadJobSchedulesUrl = lbaseUrl + '/jobs/readJobSchedules(jobId='  + jobId + ')';

    console.log('lreadJobSchedulesUrl ', lreadJobSchedulesUrl);

    options = {
        'method': 'GET',
        'url': lreadJobSchedulesUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        lreadJobScheduleUrl = baseUrl + 
        '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';
    }


    // let lreadJobScheduleUrl = lbaseUrl + 
    // '/jobs/readJobSchedule(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'displayLogs='  + displayLogs + ')';


    console.log('lreadJobScheduleUrl ', lreadJobScheduleUrl);

    options = {
        'method': 'GET',
        'url': lreadJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        lreadJobActionLogsUrl = baseUrl + '/jobs/readJobActionLogs(jobId='  + jobId + ')';
    }

    // let lreadJobActionLogsUrl = lbaseUrl + '/jobs/readJobActionLogs(jobId='  + jobId + ')';

    console.log('lreadJobActionLogsUrl ', lreadJobActionLogsUrl);

    options = {
        'method': 'GET',
        'url': lreadJobActionLogsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        lreadJobRunLogsUrl = baseUrl + 
        '/jobs/readJobRunLogs(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'page_size='  + page_size + ',' + 'offset='  + offset + ')';
    }

    // let lreadJobRunLogsUrl = lbaseUrl + 
    // '/jobs/readJobRunLogs(jobId='  + jobId + ',' + 'scheduleId=' + "'" + scheduleId + "'" + "," + 'page_size='  + page_size + ',' + 'offset='  + offset + ')';

    console.log('lreadJobRunLogsUrl ', lreadJobRunLogsUrl);

    options = {
        'method': 'GET',
        'url': lreadJobRunLogsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
    req.reply(ret_response);

  });

  srv.on("laddMLJob", async req => {
    
    // let addJobsUrl = baseUrl + '/jobs/addMLJob(' + "'" + JSON.stringify(req.data) + "'" + ')';
    // console.log('req.data.jobDetails ', req.data.jobDetails);
    let jobDetails = req.data.jobDetails;
   // str.replace(/[/_]/g, "%2F");
    // let jDetails = jobDetails.replace(/[/_]/g, "%2F");
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        addJobsUrl = baseUrl + '/jobs/addMLJob(jobDetails=' + "'" + jDetails + "'" + ')';
    }

    // let addJobsUrl = lbaseUrl + '/jobs/addMLJob(jobDetails=' + "'" + jDetails + "'" + ')';

    console.log('addJobsUrl ', addJobsUrl);

    options = {
        'method': 'GET',
        'url': addJobsUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
    req.reply(ret_response);

  });


  srv.on("lupdateJob", async(req) => {

    let jobDetails = req.data.jobDetails;
    // str.replace(/[/_]/g, "%2F");
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        lupdateJobUrl = baseUrl + '/jobs/updateMLJob(jobDetails=' + "'" + jDetails + "'" + ')';
    }

 
    //  let lupdateJobUrl = lbaseUrl + '/jobs/updateMLJob(jobDetails=' + "'" + jDetails + "'" + ')';

    console.log('lupdateJobUrl ', lupdateJobUrl);

    options = {
        'method': 'GET',
        'url': lupdateJobUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        ldeleteJobUrl = baseUrl + 
        '/jobs/deleteMLJob(jobId='  + jobId +')';    
    }

    // let ldeleteJobUrl = lbaseUrl + 
    // '/jobs/deleteMLJob(jobId='  + jobId +')';

    console.log('ldeleteJobUrl ', ldeleteJobUrl);

    options = {
        'method': 'GET',
        'url': ldeleteJobUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        addJobScheduleUrl = baseUrl + '/jobs/addJobSchedule(schedule=' + "'" + sDetails + "'" + ')';

    }
    

    // let addJobScheduleUrl = lbaseUrl + '/jobs/addJobSchedule(schedule=' + "'" + sDetails + "'" + ')';

    console.log('addJobScheduleUrl ', addJobScheduleUrl);

    options = {
        'method': 'GET',
        'url': addJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        updateMLJobScheduleUrl = baseUrl + '/jobs/updateMLJobSchedule(schedule=' + "'" + sDetails + "'" + ')';
    }

    // let updateMLJobScheduleUrl = lbaseUrl + '/jobs/updateMLJobSchedule(schedule=' + "'" + sDetails + "'" + ')';

    console.log('updateMLJobScheduleUrl ', updateMLJobScheduleUrl);

    options = {
        'method': 'GET',
        'url': updateMLJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
        let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        ldeleteMLJobScheduleUrl = baseUrl + '/jobs/deleteMLJobSchedule(scheduleDetails=' + "'" + sDetails + "'" + ')';
    }

    // let ldeleteMLJobScheduleUrl = lbaseUrl + '/jobs/deleteMLJobSchedule(scheduleDetails=' + "'" + sDetails + "'" + ')';

    console.log('ldeleteMLJobScheduleUrl ', ldeleteMLJobScheduleUrl);

    options = {
        'method': 'GET',
        'url': ldeleteMLJobScheduleUrl, 
        'headers' : {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }   
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
    if(hostName.includes("localhost:4004"))
    {
        await sleep(1000);
    }
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
            // console.log("readJobDetails ", result.results);
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
            // console.log(result.results)
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
    console.log("addMLJob jobDetails :", JSON.parse(req.data.jobDetails));

    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("addMLJob req.data :", req.data);
      var inputData = JSON.parse(req.data.jobDetails);
      console.log("addMLJob inputData :", inputData);
      let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
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
        //   [
        //     {
        //       cron: req.data.cron,
        //       description:
        //         req.data.cronDesctiption,
        //       data: req.data.actionData,
        //       active: true,
        //       startTime: {
        //         date: req.data.cronStartTime, //"2021-01-04 15:00 +0000",
        //         format: req.data.timeFormat //"YYYY-MM-DD HH:mm Z",
        //       },
        //     },
        //   ],
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
      let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
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
        //   [
        //     {
        //       cron: req.data.cron,
        //       description:
        //         req.data.cronDesctiption,
        //       data: req.data.actionData,
        //       active: true,
        //       startTime: {
        //         date: req.data.cronStartTime, //"2021-01-04 15:00 +0000",
        //         format: req.data.timeFormat //"YYYY-MM-DD HH:mm Z",
        //       },
        //     },
        //   ],
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
      var inputData = JSON.parse(req.data.jobDetails);
      console.log("updateMLJob inputData :", inputData);
    //   let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 



    
      if (scheduler) {
        // var myJob = {
        //   jobDetails: inputData.jobDetails,
        // };
        // console.log("myJob :", myJob)
        // var scJob = { job: myJob };
        // var suJob = { jobId: req.data.jobId, job: theJob };
        // scheduler.updateJob(scJob, function (err, result) {

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


        // var suJob = { jobId: req.data.jobId, job: theJob };
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
    // console.log("addJobSchedule jobId ", req.data.jobId, "schedule :", JSON.parse(req.data.schedule));
    console.log( "schedule :", JSON.parse(req.data.schedule));


    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("addJobSchedule req.data :", req.data);
      var inputData = JSON.parse(req.data.schedule);
      console.log("addJobSchedule inputData :", inputData);
    //   let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 



    
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
        //   var scJob = { jobId: req.data.jobId, schedule: myJob };

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
    // console.log("addJobSchedule jobId ", req.data.jobId, "schedule :", JSON.parse(req.data.schedule));
    console.log( "schedule :", JSON.parse(req.data.schedule));


    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      console.log("updateMLJobSchedule req.data :", req.data);
      var inputData = JSON.parse(req.data.schedule);
      console.log("updateMLJobSchedule inputData :", inputData);
    //   let baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 



    
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
        //   var scJob = { jobId: req.data.jobId, schedule: myJob };

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

        // str.replace(/[/_]/g, "%2F");
        //  let sDetails = scheduleDetails.replace(/[/]/g, "%2F");
        //  console.log('sDetails ', sDetails);
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
