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
            return "Successfully imported demand from IBP";
        } else {
            return "Failed to import Demand from IBP";
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
            return "Successfully imported IBP Future char.plan";
        } else {

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
    // Master data products to IBP
    this.on("createIBPMasterProd", async (req) => {
        var oReq = {
            masterProd: [],
        },
            vmasterProd;

        const limasterprod = await cds.run(
            `
             SELECT PRODUCT_ID,
                    PROD_DESC,
                    PROD_FAMILY,
                    PROD_GROUP,
                    PROD_MODEL,
                    PROD_MDLRANGE,
                    PROD_SERIES
               FROM "CP_PRODUCT" `);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < limasterprod.length; i++) {
            vmasterProd = {
                "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                "PRDID": limasterprod[i].PRODUCT_ID,
                "PRDGROUP": limasterprod[i].PROD_GROUP,
                "VCMODEL": limasterprod[i].PROD_MODEL,
                "PRDDESCR": limasterprod[i].PROD_DESC,
                "PRDSERIES": limasterprod[i].PROD_SERIES
            };
            oReq.masterProd.push(vmasterProd);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR",
            "DoCommit": true,
            "NavVCPPRODUCT": oReq.masterProd
        }
        await servicePost.tx(req).post("/VCPPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create Locations in IBP
    this.on("createIBPLocation", async (req) => {
        var oReq = {
            newLoc: [],
        },
            vNewLoc;

        const linewloc = await cds.run(
            `
            SELECT "LOCATION_ID",
                   "LOCATION_DESC"
                   FROM "CP_LOCATION" `);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < linewloc.length; i++) {
            vNewLoc = {
                "LOCID": linewloc[i].LOCATION_ID,
                "LOCDESCR": linewloc[i].LOCATION_DESC,
            };
            oReq.newLoc.push(vNewLoc);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,LOCDESCR",
            "DoCommit": true,
            "NavVCPLOCATION": oReq.newLoc
        }
        await servicePost.tx(req).post("/VCPLOCATIONTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create customer group in IBP
    this.on("createIBPCustomer", async (req) => {
        var oReq = {
            cust: [],
        },
            vcust;

        const licust = await cds.run(
            `
            SELECT "CUSTOMER_GROUP",
                   "CUSTOMER_DESC"
                   FROM "CP_CUSTOMERGROUP" `);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < licust.length; i++) {
            vcust = {
                "CUSTID": licust[i].CUSTOMER_GROUP,
                "CUSTDESCR": licust[i].CUSTOMER_DESC,
            };
            oReq.cust.push(vcust);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "CUSTID,CUSTDESCR",
            "DoCommit": true,
            "NavVCPCUSTOMER": oReq.cust
        }
        await servicePost.tx(req).post("/VCPCUSTOMERTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
     // Create class in IBP
     this.on("createIBPClass", async (req) => {
        var oReq = {
            class: [],
        },
            vclass;

        const liclass = await cds.run(
            `
            SELECT CLASS_NUM,
                    CLASS_NAME,
                    CHAR_NUM,
                    CHAR_NAME,
                    CHAR_VALUE,
                    CHARVAL_NUM
                    FROM V_CLASSCHARVAL 
                WHERE CLASS_NUM = '`+req.data.CLASS_NUM+`'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < liclass.length; i++) {
            vclass = {
                "VCCHAR": liclass[i].CHAR_NUM,  
                "VCCHARVALUE": liclass[i].CHARVAL_NUM,
                "VCCLASS": liclass[i].CLASS_NUM,
                "VCCHARNAME": liclass[i].CHAR_NAME,
                "VCCHARVALUENAME": liclass[i].CHAR_VALUE,
                "VCCLASSNAME": liclass[i].CLASS_NAME
            };
            oReq.class.push(vclass);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCCHAR,VCCHARVALUE,VCCLASS,VCCHARNAME,VCCHARVALUENAME,VCCLASSNAME",
            "DoCommit": true,
            "NavVCPCLASS": oReq.class
        }
        await servicePost.tx(req).post("/VCPCLASSTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
     // Create class in IBP
     this.on("createIBPSalesTrans", async (req) => {
        var oReq = {
            sales: [],
        },
            vsales;

        const lisales = await cds.run(
            `
            SELECT  sum(ORD_QTY ) as ACTUALDEMD,
                    "DOC_CREATEDDATE",
                    "PRODUCT_ID",
                    "CUSTOMER_GROUP",
                    "LOCATION_ID"
                    FROM CP_SALESH 
                    WHERE LOCATION_ID = '`+req.data.LOCATION_ID+`'
                       AND PRODUCT_ID = '`+req.data.PRODUCT_ID+
                    `' AND CUSTOMER_GROUP = '`+req.data.CUSTOMER_GROUP+
                    `' 
                GROUP BY "DOC_CREATEDDATE",
                    "PRODUCT_ID",
                    "CUSTOMER_GROUP",
                    "LOCATION_ID"
                ORDER BY "DOC_CREATEDDATE" desc`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lisales.length; i++) {
            var vWeekDate = new Date(lisales[0].DOC_CREATEDDATE).toISOString().split('Z');
            var vDemd = lisales[i].ACTUALDEMD.split('.');
            vsales = {
                "LOCID": lisales[i].LOCATION_ID,
                "PRDID": lisales[i].PRODUCT_ID,
                "CUSTID": lisales[i].CUSTOMER_GROUP,
                "ACTUALDEMAND": vDemd[0],
                "PERIODID0_TSTAMP":vWeekDate[0]
            };
            oReq.sales.push(vsales);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,CUSTID,ACTUALDEMAND,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavSBPVCP": oReq.sales
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await service.tx(req).get(resUrl)
        // GetExportResult
    });
    //// Future Demand Qty

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
        }
    });

    // Generate char plan
    this.on("generateFCharPlan", async (request) => {
        var flag;
        // var vFromDate = request.data.FromDate.toISOString();
        // var vToDate = request.data.ToDate.toISOString();
        var resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and VERSIONID eq '" + request.data.VERSION + "' and SCENARIOID eq '" + request.data.SCENARIO + "' and PERIODID4_TSTAMP gt datetime'2022-04-01T00:00:00' and PERIODID4_TSTAMP lt datetime'2022-06-30T00:00:00' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
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
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of IBP Future char.plan data is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("IBP Future char.plan import update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("IBP Future char.plan import job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
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
            // return "Failed to import IBP Future char.plan";
        }
    });
});
