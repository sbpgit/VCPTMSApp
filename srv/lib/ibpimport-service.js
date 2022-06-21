const cds = require("@sap/cds");
const GenF = require("./gen-functions");
const hana = require("@sap/hana-client");
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
    const { VCPQ } = this.entities;
    //  const service = await cdse.connect.to('IBPDemandsrv');
    const service = await cds.connect.to('IBPDemandsrv');
    const servicePost = await cds.connect.to('IBPMasterDataAPI');
    var vTransid;
    // var csrfProtection = csrf({ cookie: true })
    this.on('READ', VCPQ, request => {
        try {
            return service.tx(request).run(request.query);
        }
        catch (err) {
            console.log(err);
        }
    });
    
    this.on("getFDemandQty", async (request) => {
        var flag;
        var resUrl = "/VCPQ?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "'and UOMTOID eq 'EA'";
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
            var vScenario = 'BSL_SCENARIO';
            // var vWeekDate = vTstamp.split('T');
            //  if (req[i].LOCID === 'RX01') {
            let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND" VALUES (' +
                "'" + req[i].LOCID + "'" + "," +
                "'" + req[i].PRDID + "'" + "," +
                "'" + req[i].VERSIONID + "'" + "," +
                "'" + vScenario + "'" + "," +
                "'" + vWeekDate + "'" + "," +
                "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')' + ' WITH PRIMARY KEY';
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
        var flag, vLoop, resUrl;
        vLoop = 1;
        const dateJSONToEDM = jsonDate => {
            const content = /\d+/.exec(String(jsonDate));
            const timestamp = content ? Number(content[0]) : 0;
            const date = new Date(timestamp);
            const string = date.toISOString();
            return string;
        };

        var vFromDate = new Date(request.data.FROMDATE).toISOString().split('Z')[0];
        var vToDate = new Date(request.data.TODATE).toISOString().split('Z')[0];
        var vNextMonthDate = GenF.addMonths(request.data.FROMDATE, 1).toISOString().split('Z')[0];
        while (vLoop === 1) {
            if (vNextMonthDate <= vToDate) {
                resUrl = "/VCPQ?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                vFromDate = vNextMonthDate;
                vNextMonthDate = GenF.addMonths(vFromDate, 1).toISOString().split('Z')[0];
            }
            else if (vNextMonthDate > vToDate) {
                vNextMonthDate = vToDate;
                vLoop = 0;
                resUrl = "/VCPQ?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            }
            else {
                vLoop = 0;
                break;
            }
            var req = await service.tx(req).get(resUrl);
            flag = '';
            for (var i in req) {
                var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
                // var vWeekDate = vTstamp.split('T');
                //  if (req[i].LOCID === 'RX01') {
                let modQuery = 'UPSERT "CP_IBP_FCHARPLAN" VALUES (' +
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
        }
        if (flag === 'X') {
            return "Successfully imported IBP Future char.plan";
        } else {

            return "Failed to import IBP Future char.plan";
        }
    });

    // Master data products to IBP
    this.on("createIBPMasterProd", async (req) => {
        var oReq = {
            masterProd: [],
        },
            vmasterProd;

        const limasterprod = await cds.run(
            `
         SELECT A.PRODUCT_ID,
         B.LOCATION_ID,
         A.PROD_DESC,
         A.PROD_FAMILY,
         A.PROD_GROUP,
         A.PROD_MODEL,
         A.PROD_MDLRANGE,
         A.PROD_SERIES,
         A.RESERVE_FIELD3
           FROM "CP_PRODUCT" AS A
           INNER JOIN "CP_LOCATION_PRODUCT" AS B
           ON A.PRODUCT_ID = B.PRODUCT_ID 
           WHERE B.LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < limasterprod.length; i++) {
            vmasterProd = {
                "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                "PRDID": limasterprod[i].PRODUCT_ID,
                "PRDGROUP": limasterprod[i].PROD_GROUP,
                "VCMODEL": limasterprod[i].PROD_MODEL,
                "PRDDESCR": limasterprod[i].PROD_DESC,
                "PRDSERIES": limasterprod[i].PROD_SERIES,
                "VCSTRUCTURENODE": limasterprod[i].RESERVE_FIELD3
            };
            oReq.masterProd.push(vmasterProd);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR,VCSTRUCTURENODE",
            "DoCommit": true,
            "NavVCQPRODUCT": oReq.masterProd
        }
        await servicePost.tx(req).post("/VCQPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
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
            "NavVCQLOCATION": oReq.newLoc
        }
        await servicePost.tx(req).post("/VCQLOCATIONTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
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
            "NavVCQCUSTOMER": oReq.cust
        }
        await servicePost.tx(req).post("/VCQCUSTOMERTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
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
                WHERE CLASS_NUM = '`+ req.data.CLASS_NUM + `'`);

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
            "NavVCQCLASS": oReq.class
        }
        await servicePost.tx(req).post("/VCQCLASSTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        try {
            
        return await servicePost.tx(req).get(resUrl)
        } catch (error) {
            
        }
        // GetExportResult
    });
    // Actual Component Demand:
    this.on("createActCompDemand", async (req) => {
        var oReq = {
            actcomp: [],
        },
            vactcomp;
        const liactcomp = await cds.run(
            `
            SELECT DISTINCT "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "ACTUALCOMPONENTDEMAND",
                    "COMPONENT"
                    FROM V_IBP_LOCPRODCOMP_ACTDEMD
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
            `' AND WEEK_DATE >= '2020-08-01' AND WEEK_DATE <= '2021-11-30'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < liactcomp.length; i++) {
            var vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');
            vactcomp = {
                "LOCID": liactcomp[i].LOCATION_ID,
                "PRDID": liactcomp[i].PRODUCT_ID,
                "ACTUALCOMPONENTDEMAND": vDemd[0],
                "PRDFR": liactcomp[i].COMPONENT, 
                "PERIODID4_TSTAMP": vWeekDate[0]
            };
            oReq.actcomp.push(vactcomp);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,ACTUALCOMPONENTDEMAND,PERIODID4_TSTAMP,PRDFR",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavVCPQ": oReq.actcomp
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        var res = await service.tx(req).get(resUrl);
        return res[0].Value;
    });
    // Actual Demand:
    this.on("createIBPSalesTrans", async (req) => {
        var oReq = {
            sales: [],
        },
            vsales;
        const lisales = await cds.run(
            `
            SELECT  "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "ORD_QTY",
                    "CUSTOMER_GROUP"
                    FROM V_IBP_SALESH_ACTDEMD
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
            `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +
            `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lisales.length; i++) {
            var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = lisales[i].ORD_QTY.split('.');
            vsales = {
                "LOCID": lisales[i].LOCATION_ID,
                "PRDID": lisales[i].PRODUCT_ID,
                "CUSTID": lisales[i].CUSTOMER_GROUP,
                "ACTUALDEMAND": vDemd[0],
                "PERIODID0_TSTAMP": vWeekDate[0]
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
            "NavVCPQ": oReq.sales
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        var res = await service.tx(req).get(resUrl);
        return res[0].Value;
    });
    // Actual Demand at VC
    this.on("createIBPSalesConfig", async (req) => {
        var oReq = {
            sales: [],
        },
            vsales;
        const lisales = await cds.run(
            `
            SELECT  "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "ORD_QTY",
                    "CUSTOMER_GROUP",
                    "CLASS_NUM",
                    "CHAR_NUM",
                    "CHARVAL_NUM"
                    FROM V_IBP_SALESHCONFIG_VC
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
            `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +
            `'`);

        for (i = 0; i < lisales.length; i++) {
            var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = lisales[i].ORD_QTY.split('.');
            vsales = {
                "LOCID": lisales[i].LOCATION_ID,
                "PRDID": lisales[i].PRODUCT_ID,
                "VCCHAR": lisales[i].CHAR_NUM,
                "VCCHARVALUE": lisales[i].CHARVAL_NUM, 
                "VCCLASS": lisales[i].CLASS_NUM,   
                "ACTUALDEMANDVC": vDemd[0],    
                "CUSTID": lisales[i].CUSTOMER_GROUP,
                "PERIODID0_TSTAMP": vWeekDate[0]
            };
            oReq.sales.push(vsales);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,VCCHAR,VCCHARVALUE,VCCLASS,ACTUALDEMANDVC,CUSTID,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavVCPQ": oReq.sales
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        var res = await service.tx(req).get(resUrl);
        return res[0].Value;
       
    });
    // Actual Demand at VC
    this.on("createComponentReq", async (req) => {
        var oReq = {
            actcompreq: [],
        },
            vactcompreq;
        const liactcompreq = await cds.run(
            `
            SELECT DISTINCT "CAL_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "COMPONENT",
                    "COMP_QTY"
                    FROM V_COMP_REQ
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `' AND CAL_DATE >= '2022-06-01' AND CAL_DATE <= '2022-08-01' AND COMP_QTY >= 0`);

        for (i = 0; i < liactcompreq.length; i++) {
            var vWeekDate = new Date(liactcompreq[i].CAL_DATE).toISOString().split('Z');
            var vDemd = liactcompreq[i].COMP_QTY.toFixed(2);
            vactcompreq = {
                "LOCID": liactcompreq[i].LOCATION_ID,
                "PRDID": liactcompreq[i].PRODUCT_ID,
                "PRDFR": liactcompreq[i].COMPONENT,
                "COMPONENTREQUIREMENTQTY": vDemd,        
                "PERIODID4_TSTAMP": vWeekDate[0]
            };
            oReq.actcompreq.push(vactcompreq);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID4_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavVCPQ": oReq.actcompreq
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        var res = await service.tx(req).get(resUrl);
        return res[0].Value;
       
    });
    //Component Requirement Qty 
    /***************************************************************************/
    //////////////////////// Services for CF/////////////////////////////////////
    /**************************************************************************/
    // Master data products to IBP
    this.on("exportIBPMasterProd", async (req) => {
        var oReq = {
            masterProd: [],
        },
            vmasterProd, flag = '';

        const limasterprod = await cds.run(
            `
         SELECT A.PRODUCT_ID,
         B.LOCATION_ID,
         A.PROD_DESC,
         A.PROD_FAMILY,
         A.PROD_GROUP,
         A.PROD_MODEL,
         A.PROD_MDLRANGE,
         A.PROD_SERIES,
         A.RESERVE_FIELD3
           FROM "CP_PRODUCT" AS A
           INNER JOIN "CP_LOCATION_PRODUCT" AS B
           ON A.PRODUCT_ID = B.PRODUCT_ID 
           WHERE B.LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < limasterprod.length; i++) {
            vmasterProd = {
                "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                "PRDID": limasterprod[i].PRODUCT_ID,
                "PRDGROUP": limasterprod[i].PROD_GROUP,
                "VCMODEL": limasterprod[i].PROD_MODEL,
                "PRDDESCR": limasterprod[i].PROD_DESC,
                "PRDSERIES": limasterprod[i].PROD_SERIES,
                "VCSTRUCTURENODE": limasterprod[i].RESERVE_FIELD3
            };
            oReq.masterProd.push(vmasterProd);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR,PRDSERIES,VCSTRUCTURENODE",
            "DoCommit": true,
            "NavVCQPRODUCT": oReq.masterProd
        }
        await servicePost.tx(req).post("/VCPPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        //return await servicePost.tx(req).get(resUrl);
        try {
            var vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export of Product is successful at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Product exported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Product job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of Product has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of Product job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Product job update results", result);

                });
            }
        }
        // GetExportResult
    });
    // Create Locations in IBP
    this.on("exportIBPLocation", async (req) => {
        var oReq = {
            newLoc: [],
        },
            vNewLoc, flag = '';

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
            "NavVCQLOCATION": oReq.newLoc
        }
        await servicePost.tx(req).post("/VCPLOCATIONTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        try {
            var vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export of Location is successful at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Location exported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Location job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of Location has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of Location job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Location job update results", result);

                });
            }
        }
        // GetExportResult
    });
    // Create customer group in IBP
    this.on("exportIBPCustomer", async (req) => {
        var oReq = {
            cust: [],
        },
            vcust, flag = '';

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
            "NavVCQCUSTOMER": oReq.cust
        }
        await servicePost.tx(req).post("/VCPCUSTOMERTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        // return await servicePost.tx(req).get(resUrl)
        try {
            var aResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export of customer group is successful at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Customer group exported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of customer group job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of customer group  has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of customer group   job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of customer group job update results", result);

                });
            }
        }
    });
    // Create class in IBP
    this.on("exportIBPClass", async (req) => {
        var oReq = {
            class: [],
        },
            vclass, aResponse, flag = '';

        const liclass = await cds.run(
            `
        SELECT CLASS_NUM,
                CLASS_NAME,
                CHAR_NUM,
                CHAR_NAME,
                CHAR_VALUE,
                CHARVAL_NUM
                FROM V_CLASSCHARVAL 
            WHERE CLASS_NUM = '`+ req.data.CLASS_NUM + `'`);

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
            "NavVCQCLASS": oReq.class
        }
        await servicePost.tx(req).post("/VCPCLASSTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        try {
            aResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export of class and charateristics is successful at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of class and charateristics to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of class and charateristics job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of class and charateristics  has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of class and charateristics  job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of class and charateristics  job update results", result);

                });
            }
        }
    });
    // Create class in IBP
    this.on("exportIBPSalesTrans", async (req) => {
        var oReq = {
            sales: [],
        },
            vsales, flag = '';

        const lisales = await cds.run(
                `
                SELECT  "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "ORD_QTY",
                        "CUSTOMER_GROUP"
                        FROM V_IBP_SALESH_ACTDEMD
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
                `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +
                `'`);
    
            //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
            for (i = 0; i < lisales.length; i++) {
                var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
                var vDemd = lisales[i].ORD_QTY.split('.');
                vsales = {
                    "LOCID": lisales[i].LOCATION_ID,
                    "PRDID": lisales[i].PRODUCT_ID,
                    "CUSTID": lisales[i].CUSTOMER_GROUP,
                    "ACTUALDEMAND": vDemd[0],
                    "PERIODID0_TSTAMP": vWeekDate[0]
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
            "NavVCPQ": oReq.sales
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        // var resUrl = "/VCPQMessage?$select=Transactionid,ExceptionId,MsgText&$filter=Transactionid eq '" + vTransID + "'";
        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        try {
            return await service.tx(req).get(resUrl);
            flag = 'X';
        }
        catch{

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Sales History export is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Sales History has exported to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Sales History export job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Sales History export has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Sales History export job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Sales History export job update results", result);

                });
            }
        }
        // GetExportResult
    });
    
    // Actual Component Demand:
    this.on("exportActCompDemand", async (req) => {
        var oReq = {
            actcomp: [],
        },
            vactcomp;
        const liactcomp = await cds.run(
            `
            SELECT  "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "ACTUALCOMPONENTDEMAND",
                    "COMPONENT"
                    FROM V_IBP_LOCPRODCOMP_ACTDEMD
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
            `' AND WEEK_DATE >= '` + req.data.FROMDATE +
            `' AND WEEK_DATE <= '` + req.data.TODATE + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < liactcomp.length; i++) {
            var vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');
            vactcomp = {
                "LOCID": liactcomp[i].LOCATION_ID,
                "PRDID": liactcomp[i].PRODUCT_ID,
                "ACTUALCOMPONENTDEMAND": vDemd[0],
                "PRDFR": liactcomp[i].COMPONENT, 
                "PERIODID0_TSTAMP": vWeekDate[0]
            };
            oReq.actcomp.push(vactcomp);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,ACTUALCOMPONENTDEMAND,PERIODID0_TSTAMP,PRDFR",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavVCPQ": oReq.actcomp
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_EntityName='VCPQ'&P_TransactionID='" + vTransID + "'";
        try {
            return await service.tx(req).get(resUrl);
            flag = 'X';
        }
        catch{

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Actual Component Demand is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Actual Component Demand has exported to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Actual Component Demand job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Actual Component Demand has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Actual Component Demand job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Actual Component Demand job update results", result);

                });
            }
        }
        // GetExportResult
    });

    // Actual Demand at VC
    this.on("exportIBPSalesConfig", async (req) => {
        var oReq = {
            sales: [],
        },
            vsales;
            const lisales = await cds.run(
                `
                SELECT  "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "ORD_QTY",
                        "CUSTOMER_GROUP",
                        "CLASS_NUM",
                        "CHAR_NUM",
                        "CHARVAL_NUM"
                        FROM V_IBP_SALESHCONFIG_VC
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
                `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +
                `'`);
    
            for (i = 0; i < lisales.length; i++) {
                var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
                var vDemd = lisales[i].ORD_QTY.split('.');
                vsales = {
                    "LOCID": lisales[i].LOCATION_ID,
                    "PRDID": lisales[i].PRODUCT_ID,
                    "VCCHAR": lisales[i].CHAR_NUM,
                    "VCCHARVALUE": lisales[i].CHARVAL_NUM, 
                    "VCCLASS": lisales[i].CLASS_NUM,   
                    "ACTUALDEMANDVC": vDemd[0],    
                    "CUSTID": lisales[i].CUSTOMER_GROUP,
                    "PERIODID0_TSTAMP": vWeekDate[0]
                };
                oReq.sales.push(vsales);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,VCCHAR,VCCHARVALUE,VCCLASS,ACTUALDEMANDVC,CUSTID,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavVCPQ": oReq.sales
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        try {
            return await service.tx(req).get(resUrl);
            flag = 'X';
        }
        catch{

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Actual Demand at VC is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Actual Demand at VC has exported to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Actual Demand at VC job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Actual Demand at VC has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Actual Demand at VC job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Actual Demand at VC job update results", result);

                });
            }
        }
        // GetExportResult
       
    });
    // Component requirement Qty
    this.on("exportComponentReq", async (req) => {
        var oReq = {
            actcompreq: [],
        },
            vactcompreq;
        const liactcompreq = await cds.run(
            `
            SELECT DISTINCT "CAL_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "COMPONENT",
                    "COMP_QTY"
                    FROM V_COMP_REQ
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
                       `' AND CAL_DATE >= '` + req.data.FROMDATE +
                       `' AND CAL_DATE <= '` + req.data.TODATE + `'
                       AND COMP_QTY >= 0`);

        for (i = 0; i < liactcompreq.length; i++) {
            var vWeekDate = new Date(liactcompreq[i].CAL_DATE).toISOString().split('Z');
            var vDemd = liactcompreq[i].COMP_QTY.toFixed(2);
            vactcompreq = {
                "LOCID": liactcompreq[i].LOCATION_ID,
                "PRDID": liactcompreq[i].PRODUCT_ID,
                "PRDFR": liactcompreq[i].COMPONENT,
                "COMPONENTREQUIREMENTQTY": vDemd,        
                "PERIODID4_TSTAMP": vWeekDate[0]
            };
            oReq.actcompreq.push(vactcompreq);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID4_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavVCPQ": oReq.actcompreq
        }
        await service.tx(req).post("/VCPQTrans", oEntry);

        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        try {
            return await service.tx(req).get(resUrl);
            flag = 'X';
        }
        catch{

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Component requirement Qty is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Component requirement Qty has exported to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Component requirement Qty job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Component requirement Qty has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Component requirement Qty job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Component requirement Qty job update results", result);

                });
            }
        }
        // GetExportResult
       
    });


    //// Future Demand Qty

    this.on("generateFDemandQty", async (request) => {
        var flag;
        var resUrl = "/VCPQ?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "'and UOMTOID eq 'EA'";
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
            var vScenario = 'BSL_SCENARIO';
            let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND" VALUES (' +
                "'" + req[i].LOCID + "'" + "," +
                "'" + req[i].PRDID + "'" + "," +
                "'" + req[i].VERSIONID + "'" + "," +
                "'" + vScenario + "'" + "," +
                "'" + vWeekDate + "'" + "," +
                "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')' + ' WITH PRIMARY KEY';
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


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
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


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
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
        var flag, vLoop, resUrl;
        vLoop = 1;
        const dateJSONToEDM = jsonDate => {
            const content = /\d+/.exec(String(jsonDate));
            const timestamp = content ? Number(content[0]) : 0;
            const date = new Date(timestamp);
            const string = date.toISOString();
            return string;
        };

        var vFromDate = new Date(request.data.FROMDATE).toISOString().split('Z')[0];
        var vToDate = new Date(request.data.TODATE).toISOString().split('Z')[0];
        var vNextMonthDate = GenF.addMonths(request.data.FROMDATE, 1).toISOString().split('Z')[0];
        while (vLoop === 1) {
            if (vNextMonthDate <= vToDate) {
                resUrl = "/VCPQ?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                vFromDate = vNextMonthDate;
                vNextMonthDate = GenF.addMonths(vFromDate, 1).toISOString().split('Z')[0];
            }
            else if (vNextMonthDate > vToDate) {
                vNextMonthDate = vToDate;
                vLoop = 0;
                resUrl = "/VCPQ?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            }
            else {
                vLoop = 0;
                break;
            }
            var req = await service.tx(req).get(resUrl);
            flag = '';
            for (var i in req) {
                var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];                
                var vScenario = 'BSL_SCENARIO';
                let modQuery = 'UPSERT "CP_IBP_FCHARPLAN" VALUES (' +
                    "'" + req[i].LOCID + "'" + "," +
                    "'" + req[i].PRDID + "'" + "," +
                    "'" + req[i].VCCLASS + "'" + "," +
                    "'" + req[i].VCCHAR + "'" + "," +
                    "'" + req[i].VCCHARVALUE + "'" + "," +
                    "'" + req[i].VERSIONID + "'" + "," +
                    "'" + vScenario + "'" + "," +
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
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of IBP Future char.plan data is successfull at " + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
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


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
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
