const { resolve } = require("@sap/cds");
const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
const SapCfMailer = require("sap-cf-mailer").default;
// const metering = require("./metering");
const { executeHttpRequest, getDestination } = require("@sap-cloud-sdk/core");
const qs = require("qs");
const axios = require("axios");
// const { cf } = require("cf-http-client");

// const jobFuncs = require('./Jobs-Service.js');

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

  srv.on("lreadJobs", async req => {
    var request = require('request');
    let baseUrl = "https://sbpprovider-dev-config-products-srv.cfapps.us10.hana.ondemand.com"; 
    let readJobsUrl = baseUrl + '/jobs/readJobs()';

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
    await sleep(1000);
    // console.log('ret_response.value ', ret_response.value);
    // console.log('length of ret_response.value ', ret_response.value.length);

    req.reply(ret_response);

  });


  srv.on("laddMLJob", async req => {
    var request = require('request');
    let baseUrl = "https://sbpprovider-dev-config-products-srv.cfapps.us10.hana.ondemand.com"; 
    // let addJobsUrl = baseUrl + '/jobs/addMLJob(' + "'" + JSON.stringify(req.data) + "'" + ')';
    // console.log('req.data.jobDetails ', req.data.jobDetails);
    let jobDetails = req.data.jobDetails;
   // str.replace(/[/_]/g, "%2F");
    let jDetails = jobDetails.replace(/[/_]/g, "%2F");
    console.log('jDetails ', jDetails);

    let addJobsUrl = baseUrl + '/jobs/addMLJob(jobDetails=' + "'" + jDetails + "'" + ')';

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
        var query = {
          //by Id
          jobId: req.data.jobId,
        };
        scheduler.fetchJob(query, function (err, result) {
          if (err) {
            reject(req.error("Error retrieving job"));
          } else {
            // job was created successfully
            console.log("readJobDetails ", result.results);

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

  srv.on("updateJob", (req) => {
    return new Promise((resolve, reject) => {
      const scheduler = getJobscheduler(req);
      if (scheduler) {
        var theJob = {
          active: req.data.active,
        };

        var suJob = { jobId: req.data.jobId, job: theJob };
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
};