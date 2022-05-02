const cds = require("@sap/cds");
const GenF = require("./gen-functions");
// const csrf = require("csrf");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");


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
module.exports = cds.service.impl(async function () {
    const { SBPVCP } = this.entities;
    //  const service = await cdse.connect.to('IBPDemandsrv');
    const service = await cds.connect.to('IBPDemandsrv');
    const servicePost = await cds.connect.to('IBPMasterDataAPI');
    var vTransid;
    // var csrfProtection = csrf({ cookie: true })
    this.on('READ', SBPVCP, request => {
        try {
            return service.tx(request).run(request.query);
        }
        catch (err) {
            console.log(err);
        }
    });
    this.after("READ", SBPVCP, async (req) => {
        const { VCPTEST } = this.entities;
        const tx = cds.tx(req);
        // const iBPData = await cds.run(SELECT.from(VCPTEST));
        for (var i in req) {
            if (req[i].LOCID === 'RX01') {
                let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND_TEMP" VALUES (' +
                    "'" + req[i].LOCID + "'" + "," +
                    "'" + req[i].PRDID + "'" + "," +
                    "'" + req[i].VERSIONID + "'" + "," +
                    "'" + req[i].SCENARIOID + "'" + "," +
                    "'" + req[i].PERIODID0_TSTAMP + "'" + "," +
                    "'" + req[i].PLANNEDINDEPENDENTREQ + "'" + ')' + ' WITH PRIMARY KEY';

                try {
                    await cds.run(modQuery);
                    // await cds.run(INSERT.into('CP_IBP_FUTUREDEMAND_TEMP') .as (SELECT.from('VCPTEST').where({ PLANNEDINDEPENDENTREQ: { '>': 0 } })));
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
    });
    this.on("getFDemandQty", async (request) => {
        var flag;
        var resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and VERSIONID eq '" + request.data.VERSION + "' and SCENARIOID eq '" + request.data.SCENARIO + "'";
        var req = await service.tx(req).get(resUrl);
        const dateJSONToEDM = jsonDate => {
            const content = /\d+/.exec(String(jsonDate));
            const timestamp = content ? Number(content[0]) : 0;
            const date = new Date(timestamp);
            const string = date.toISOString().split('T')[0];
            return string;
        };
        flag = '';
        for (var i in req) {
            var vWeekDate = dateJSONToEDM(req[i].PERIODID0_TSTAMP);
            // var vWeekDate = vTstamp.split('T');
            //  if (req[i].LOCID === 'RX01') {
            let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND_TEMP" VALUES (' +
                "'" + req[i].LOCID + "'" + "," +
                "'" + req[i].PRDID + "'" + "," +
                "'" + req[i].VERSIONID + "'" + "," +
                "'" + req[i].SCENARIOID + "'" + "," +
                "'" + vWeekDate + "'" + "," +
                "'" + req[i].PLANNEDINDEPENDENTREQ + "'" + ')' + ' WITH PRIMARY KEY';
            try {
                await cds.run(modQuery);
                flag = 'X';
            }
            catch (err) {
                console.log(err);
            }
            //  }
        }
        if (flag === 'X') {
            // let dataObj = {};
            // dataObj["success"] = true;
            // dataObj["message"] = "Import of IBP Demand data is successfull at " + new Date();


            // if (req.headers['x-sap-job-id'] > 0) {
            //     const scheduler = getJobscheduler(req);

            //     var updateReq = {
            //         jobId: req.headers['x-sap-job-id'],
            //         scheduleId: req.headers['x-sap-job-schedule-id'],
            //         runId: req.headers['x-sap-job-run-id'],
            //         data: dataObj
            //     };

            //     console.log("IBP Demand import update req", updateReq);

            //     scheduler.updateJobRunLog(updateReq, function (err, result) {
            //         if (err) {
            //             return console.log('Error updating run log: %s', err);
            //         }
            //         //Run log updated successfully
            //         console.log("IBP Demand import job update results", result);

            //     });
            // }
            return "Successfully imported demand from IBP";
        } else {
            // let dataObj = {};
            // dataObj["failed"] = false;
            // dataObj["message"] = "Import of IBP Demand data is failed at" + new Date();


            // if (req.headers['x-sap-job-id'] > 0) {
            //     const scheduler = getJobscheduler(req);

            //     var updateReq = {
            //         jobId: req.headers['x-sap-job-id'],
            //         scheduleId: req.headers['x-sap-job-schedule-id'],
            //         runId: req.headers['x-sap-job-run-id'],
            //         data: dataObj
            //     };

            //     console.log("generatePredictions job update req", updateReq);

            //     scheduler.updateJobRunLog(updateReq, function (err, result) {
            //         if (err) {
            //             return console.log('Error updating run log: %s', err);
            //         }
            //         //Run log updated successfully
            //         console.log("IBP Demand import job update results", result);

            //     });
            // }
            return "Failed to import Demand from IBP";
        }
    });
        this.on("generateFDemandQty", async (request) => {
            var flag;
            var resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and VERSIONID eq '" + request.data.VERSION + "' and SCENARIOID eq '" + request.data.SCENARIO + "'";
            var req = await service.tx(req).get(resUrl);
            const dateJSONToEDM = jsonDate => {
                const content = /\d+/.exec(String(jsonDate));
                const timestamp = content ? Number(content[0]) : 0;
                const date = new Date(timestamp);
                const string = date.toISOString().split('T')[0];
                return string;
            };
            flag = '';
            for (var i in req) {
                var vWeekDate = dateJSONToEDM(req[i].PERIODID0_TSTAMP);
                // var vWeekDate = vTstamp.split('T');
                //  if (req[i].LOCID === 'RX01') {
                let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND_TEMP" VALUES (' +
                    "'" + req[i].LOCID + "'" + "," +
                    "'" + req[i].PRDID + "'" + "," +
                    "'" + req[i].VERSIONID + "'" + "," +
                    "'" + req[i].SCENARIOID + "'" + "," +
                    "'" + vWeekDate + "'" + "," +
                    "'" + req[i].PLANNEDINDEPENDENTREQ + "'" + ')' + ' WITH PRIMARY KEY';
                try {
                    await cds.run(modQuery);
                    flag = 'X';
                }
                catch (err) {
                    console.log(err);
                }
                //  }
            }
            if (flag === 'X') {
                let dataObj = {};
                dataObj["success"] = true;
                dataObj["message"] = "Import of IBP Demand data is successfull at " + new Date();


                if (req.headers['x-sap-job-id'] > 0) {
                    const scheduler = getJobscheduler(req);

                    var updateReq = {
                        jobId: req.headers['x-sap-job-id'],
                        scheduleId: req.headers['x-sap-job-schedule-id'],
                        runId: req.headers['x-sap-job-run-id'],
                        data: dataObj
                    };

                    console.log("IBP Demand import update req", updateReq);

                    scheduler.updateJobRunLog(updateReq, function (err, result) {
                        if (err) {
                            return console.log('Error updating run log: %s', err);
                        }
                        //Run log updated successfully
                        console.log("IBP Demand import job update results", result);

                    });
                }
                // return "Successfully imported demand from IBP";
            } else {
                let dataObj = {};
                dataObj["failed"] = false;
                dataObj["message"] = "Import of IBP Demand data is failed at" + new Date();


                if (req.headers['x-sap-job-id'] > 0) {
                    const scheduler = getJobscheduler(req);

                    var updateReq = {
                        jobId: req.headers['x-sap-job-id'],
                        scheduleId: req.headers['x-sap-job-schedule-id'],
                        runId: req.headers['x-sap-job-run-id'],
                        data: dataObj
                    };

                    console.log("generatePredictions job update req", updateReq);

                    scheduler.updateJobRunLog(updateReq, function (err, result) {
                        if (err) {
                            return console.log('Error updating run log: %s', err);
                        }
                        //Run log updated successfully
                        console.log("IBP Demand import job update results", result);

                    });
                }
                // return "Failed to import Demand from IBP";
            }
        });
    this.on("getFCharPlan", async (request) => {
        var flag;
       // var vFromDate = request.data.FromDate.toISOString();
       // var vToDate = request.data.ToDate.toISOString();
        var resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=PERIODID4_TSTAMP gt datetime'2022-04-01T00:00:00' and PERIODID4_TSTAMP lt datetime'2022-06-30T00:00:00' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
        var req = await service.tx(req).get(resUrl);
        const dateJSONToEDM = jsonDate => {
            const content = /\d+/.exec(String(jsonDate));
            const timestamp = content ? Number(content[0]) : 0;
            const date = new Date(timestamp);
            const string = date.toISOString().split('T')[0];
            return string;
        };
        flag = '';
        for (var i in req) {
            var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP);
            // var vWeekDate = vTstamp.split('T');
            //  if (req[i].LOCID === 'RX01') {
            let modQuery = 'UPSERT "CP_IBP_FCHARPLAN_TEMP" VALUES (' +
                "'" + req[i].LOCID + "'" + "," +
                "'" + req[i].PRDID + "'" + "," +
                "'" + req[i].VCCLASS + "'" + "," +
                "'" + req[i].VCCHAR + "'" + "," +
                "'" + req[i].VCCHARVALUE + "'" + "," +
                "'" + req[i].VERSIONID + "'" + "," +
                "'" + req[i].SCENARIOID + "'" + "," +
                "'" + vWeekDate + "'" + "," +
                "'" + req[i].OPTIONPERCENTAGE + "'" + "," +
                "'" + req[i].FINALDEMANDVC + "'" + ')' + ' WITH PRIMARY KEY';
            try {
                await cds.run(modQuery);
                flag = 'X';
            }
            catch (err) {
                console.log(err);
            }
            //  }
        }
        if (flag === 'X') {
            // let dataObj = {};
            // dataObj["success"] = true;
            // dataObj["message"] = "Import of IBP Future char.plan data is successfull at " + new Date();


            // if (req.headers['x-sap-job-id'] > 0) {
            //     const scheduler = getJobscheduler(req);

            //     var updateReq = {
            //         jobId: req.headers['x-sap-job-id'],
            //         scheduleId: req.headers['x-sap-job-schedule-id'],
            //         runId: req.headers['x-sap-job-run-id'],
            //         data: dataObj
            //     };

            //     console.log("IBP Future char.plan import update req", updateReq);

            //     scheduler.updateJobRunLog(updateReq, function (err, result) {
            //         if (err) {
            //             return console.log('Error updating run log: %s', err);
            //         }
            //         //Run log updated successfully
            //         console.log("IBP Future char.plan import job update results", result);

            //     });
            // }
            return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of IBP Future char.plan has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("IBP Future char.plan job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("IBP Future char.plan job update results", result);

                });
            }
            return "Failed to import IBP Future char.plan";
        }
    });
    this.on("createIBPProduct", async (req) => {
        var oReq = {
            newProd: [],
        },
            vNewProd;
            
        const linewprod = await cds.run(
            `
            SELECT A.PRODUCT_ID,
            A.LOCATION_ID,
            A.REF_PRODID,
            B.PROD_DESC,
            B.PROD_FAMILY,
            B.PROD_GROUP,
            B.PROD_MODEL,
            B.PROD_MDLRANGE,
            B.PROD_SERIES
                   FROM "CP_NEWPROD_INTRO" AS A
            INNER JOIN "CP_PRODUCT" AS B
            ON A.REF_PRODID = B.PRODUCT_ID
            WHERE A.LOCATION_ID = '`+ req.data.LOCATION_ID +
            `' AND A.PRODUCT_ID = '` + req.data.PRODUCT_ID +
            `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
         for (i = 0; i < linewprod.length; i++) {
        vNewProd = {
            "VCMODELRANGE": linewprod[i].PROD_MDLRANGE,
            "PRDFAMILY": linewprod[i].PROD_FAMILY,
            "PRDID": linewprod[i].PRODUCT_ID,
            "PRDGROUP": linewprod[i].PROD_GROUP,
            "VCMODEL": linewprod[i].PROD_MODEL,
            "PRDDESCR": linewprod[i].PROD_DESC,
            "PRDSERIES": linewprod[i].PROD_SERIES
        };
        // vNewProd = {
        // "VCMODELRANGE":"8100",
        // "PRDFAMILY":"RX1",
        // "PRDID":"AR202466",
        // "PRDGROUP":"RX_PG1",
        // "VCMODEL":"8160",
        // "PRDDESCR":"8R 410 410HP TRACTOR",
        // "PRDSERIES": "Test"
        // };
        oReq.newProd.push(vNewProd);

         }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR",
            "DoCommit": true,
            "NavVCPPRODUCT": oReq.newProd
        }
        await servicePost.tx(req).post("/VCPPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
});
