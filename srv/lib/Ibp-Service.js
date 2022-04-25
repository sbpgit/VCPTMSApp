const cds = require('@sap/cds')
const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
const cdse = require('cdse');
/////////////////////////
// const fetch = require('node-fetch');
// const express = require('express');
// const https = require("https");  
// const basic = require('basic-authorization-header');
////////////////////////
const ibpParams = {
    uid:    "BTPUSER",//process.env.ibpDemand,
    pwd: 	"Sbp@btpproductdevelopment01" //cds.env.requires.db.credentials.ibpPwd, 
}
// const app = express();
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

// module.exports = srv => {
module.exports = async function (srv) {
      
     srv.on ('genMasterData',    async req => {

         console.log('Input Headers: ', req.headers);           
         console.log('Input Data: ', req.data); 
          

         let createtAt = new Date();
         let values = [];
         let respString = "Generate IBP MASTER DATA request queued, Check Response by Running Logs"

         values.push({createtAt, respString});    

         console.log('values :', values);
         console.log('Response completed Time  :', createtAt);
         var res = req._.req.res;
         res.statusCode = 202;
         res.send({values});    

         var sqlStr = 'call P_UPSERT_IBP_MASTER_TABLES(?)';
         var results = await cds.run(sqlStr); 
         console.log("P_UPSERT_IBP_MASTER_TABLES results", results);

         let url = req.headers['x-sap-scheduler-host'] + '/scheduler/jobs/' +
                   req.headers['x-sap-job-id'] + '/schedules/' +
                   req.headers['x-sap-job-schedule-id'] + /runs/ +
                   req.headers['x-sap-job-run-id'];
         console.log("P_UPSERT_IBP_MASTER_TABLES url",url);
         let dataObj = {};
         dataObj["success"] = true;
         dataObj["message"] = "IBP Master Data generated For" + 
                              " \n class_rows : " + results[0].class_rows +
                              " \n customer_rows : " + results[0].customer_rows +
                              " \n product_rows : " + results[0].product_rows +
                              " \n location_product_rows : " + results[0].location_product_rows +
                              " \n loc_prod_comp_rows : " + results[0].loc_prod_comp_rows +
                              " \n restriction_rows : " + results[0].restriction_rows +
                              " \n loc_restriction_rows : " + results[0].loc_restriction_rows +
                              " \n timestamp : " + results[0].timestamp ;


        //  dataObj["message"] = "'" + results[0] + "'";

        console.log("P_UPSERT_IBP_MASTER_TABLES dataObj",dataObj);

        const scheduler = getJobscheduler(req);

        var updateReq = {
            jobId: req.headers['x-sap-job-id'],
            scheduleId: req.headers['x-sap-job-schedule-id'],
            runId: req.headers['x-sap-job-run-id'],
            data : dataObj
          };

          console.log("P_UPSERT_IBP_MASTER_TABLES job update req",updateReq);

          scheduler.updateJobRunLog(updateReq, function(err, result) {
            if (err) {
              return console.log('Error updating run log: %s', err);
            }
            //Run log updated successfully
            console.log("P_UPSERT_IBP_MASTER_TABLES job update results",result);

          });

        // _updateScheduler(url,dataObj);
         
     })
 
     srv.on ('genTxData',    async req => {
       
        let createtAt = new Date();
         let values = [];
         let respString = "Generate IBP TX DATA request queued, Check Response by Running Logs"

         values.push({createtAt, respString});    

         console.log('values :', values);
         console.log('Response completed Time  :', createtAt);
         var res = req._.req.res;
         res.statusCode = 202;
         res.send({values});   
         
        // var sqlStr = 'call P_UPSERT_IBP_TS_TABLES(?, ?, ?)';
        var sqlStr = 'call P_UPSERT_IBP_TS_TABLES(?)';
        var results = await cds.run(sqlStr);
        console.log("P_UPSERT_IBP_TS_TABLES results", results);


        let url = req.headers['x-sap-scheduler-host'] + '/scheduler/jobs/' +
                   req.headers['x-sap-job-id'] + '/schedules/' +
                   req.headers['x-sap-job-schedule-id'] + /runs/ +
                   req.headers['x-sap-job-run-id'];
         console.log("P_UPSERT_IBP_TS_TABLES url",url);
         let dataObj = {};
         dataObj["success"] = true;
         dataObj["message"] = "IBP Time Series Data generated For" + 
                              " \n Variant Configuration Demand Rows : " + results[0].vcdemand_rows +
                              " \n Location Product Customer Demand Rows : " + results[0].demand_rows +
                              " \n Location Product Component Demand Rows : " + results[0].comp_demand_rows +
                              " \n TimeStamp : " + results[0].timestamp ;


        console.log("P_UPSERT_IBP_TS_TABLES dataObj",dataObj);

        const scheduler = getJobscheduler(req);

        var updateReq = {
            jobId: req.headers['x-sap-job-id'],
            scheduleId: req.headers['x-sap-job-schedule-id'],
            runId: req.headers['x-sap-job-run-id'],
            data : dataObj
          };

          console.log("P_UPSERT_IBP_TS_TABLES job update req",updateReq);

          scheduler.updateJobRunLog(updateReq, function(err, result) {
            if (err) {
              return console.log('Error updating run log: %s', err);
            }
            //Run log updated successfully
            console.log("P_UPSERT_IBP_TS_TABLES job update results",result);

          });

     })
   

    // module.exports = cds.service.impl(async function() {
        //  const { VCPTEST } = this.entities;
        //  const service = await cds.connect.to('IBPDemandsrv');
        //  this.on('READ', VCPTEST, request => {
        //      return service.tx(request).run(request.query);
        //  });
   //  });
    //  srv.on("importIBPDemd", async (req)=>{
    //     app.get("/", (req, res) => {
    //         const url = "https://my400323-api.scmibp.ondemand.com/sap/opu/odata/ibp/PLANNING_DATA_API_SRV/VCPTEST?$select=PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,%20SCENARIOID,SCENARIONAME&$filter=PLANNEDINDEPENDENTREQ%20gt%200"
    //         const uname = ibpParams.uid;
    //         const pasword = ibpParams.pwd;
    //         const options = {
    //           auth : uname:pasword//here you put your credentials
    //         }
        
    //         https.get(url, options, (response) => {
    //             console.log(response.statusCode);
    //             console.log(auth);
    //             response.responseType="text";
    //             response.on("data", (data)=> {
    //                 const translationLot = JSON.parse(data)
    //                 console.log(translationLot);
    //             })
    //         })
    //         res.send("Server is up and running")
    //       });

         //const
        // fetch('https://my400323-api.scmibp.ondemand.com/sap/opu/odata/ibp/PLANNING_DATA_API_SRV/VCPTEST?$select=PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,%20SCENARIOID,SCENARIONAME&$filter=PLANNEDINDEPENDENTREQ%20gt%200',{
        //     headers: {
        //         'Authorization': 'Basic ' + Buffer.from(`${ibpParams.uid}:${ibpParams.pwd}`, 'binary').toString('base64')
        //     }
        // })
        // .then(res => res.json())
        // .then(json => 
        //     console.log(json));
    //  })

  }
 module.exports = cds.service.impl(async function() {
         const { VCPTEST } = this.entities;
        //  const service = await cdse.connect.to('IBPDemandsrv');
         const service = await cds.connect.to('IBPDemandsrv');
         this.on('READ', VCPTEST, request => {
             try{
             return service.tx(request).run(request.query);
             }
             catch(err){
                 console.log(err);
             }
         });
    });