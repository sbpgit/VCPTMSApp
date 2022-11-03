const cds = require("@sap/cds");
const GenF = require("./gen-functions");
const IBPFunc = require("./ibp-functions");
const hana = require("@sap/hana-client");
const xsenv = require("@sap/xsenv");
const JobSchedulerClient = require("@sap/jobs-client");
const vAIRKey = process.env.AIR;
const obibpfucntions = new IBPFunc();

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

    this.on("getFDemandQty", async (request) => {
        var flag;

        // var resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and UOMTOID eq 'EA'";
        var resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "'and UOMTOID eq 'EA'";
        var req = await service.tx(req).get(resUrl);
        // if(req.length > 0){
        const vDelDate = new Date();
        const vDateDel = vDelDate.toISOString().split('T')[0];
        try {
            await DELETE.from('CP_IBP_FUTUREDEMAND')
                .where(`LOCATION_ID = '${request.data.LOCATION_ID}' 
                        AND PRODUCT_ID = '${request.data.PRODUCT_ID}'
                        AND WEEK_DATE   < '${vDateDel}'`);
        }
        catch (e) {
            //Do nothing
        }
        // }
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
            req[i].PERIODID4_TSTAMP = vWeekDate;
            // try {
            await DELETE.from('CP_IBP_FUTUREDEMAND')
                .where(`LOCATION_ID = '${req[i].LOCID}' 
                        AND PRODUCT_ID = '${req[i].PRDID}'
                        AND VERSION = '${req[i].VERSIONID}'
                        AND SCENARIO = '${vScenario}'
                        AND WEEK_DATE       = '${vWeekDate}'`)
            // await cds.run(
            //         `DELETE FROM "CP_IBP_FUTUREDEMAND" WHERE "LOCATION_ID" = '`+ req[i].LOCID +`' 
            //                                           AND "PRODUCT_ID" = '`+ req[i].PRDID +`'
            //                                           AND "VERSION" = '` + req[i].VERSIONID + `'
            //                                           AND "SCENARIO" = '` + vScenario + `'
            //                                           AND "WEEK_DATE" = '` + vWeekDate +  `'`
            // );
            // }
            // catch(e)
            // {
            //     console.log(e);
            // }
            let modQuery = 'INSERT INTO "CP_IBP_FUTUREDEMAND" VALUES (' +
                "'" + req[i].LOCID + "'" + "," +
                "'" + req[i].PRDID + "'" + "," +
                "'" + req[i].VERSIONID + "'" + "," +
                "'" + vScenario + "'" + "," +
                "'" + vWeekDate + "'" + "," +
                "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')';// + ' WITH PRIMARY KEY';
            try {
                await cds.run(modQuery);
                flag = 'X';
                console.log("Step1");
            }
            catch (err) {
                console.log(err);
            }
            //  }
        }
        if (flag === 'X') {

            console.log("Step2");
            var resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";

            var req = await service.tx(request).get(resUrl);
            // if(req.length > 0){
            const vDelDate = new Date();
            const vDateDel = vDelDate.toISOString().split('T')[0];
            try {
                await DELETE.from('CP_IBP_FCHARPLAN')
                    .where(`LOCATION_ID = '${request.data.LOCATION_ID}' 
                            AND PRODUCT_ID = '${request.data.PRODUCT_ID}'
                            AND WEEK_DATE    < '${vDateDel}'`);
            }
            catch (e) {
                //Do nothing
            }
            // }
            flag = '';
            for (var i in req) {
                var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
                var vScenario = 'BSL_SCENARIO';
                req[i].PERIODID4_TSTAMP = vWeekDate;
                if (vWeekDate >= vDateDel) {
                    await cds.run(
                        `DELETE FROM "CP_IBP_FCHARPLAN" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                          AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                          AND "CLASS_NUM" = '` + req[i].VCCLASS + `' 
                                                          AND "CHAR_NUM" = '` + req[i].VCCHAR + `' 
                                                          AND "CHARVAL_NUM" = '` + req[i].VCCHARVALUE + `' 
                                                          AND "VERSION" = '` + req[i].VERSIONID + `'
                                                          AND "SCENARIO" = '` + vScenario + `'
                                                          AND "WEEK_DATE" = '` + vWeekDate + `'`
                    );

                    let modQuery = 'INSERT INTO "CP_IBP_FCHARPLAN" VALUES (' +
                        "'" + req[i].LOCID + "'" + "," +
                        "'" + req[i].PRDID + "'" + "," +
                        "'" + req[i].VCCLASS + "'" + "," +
                        "'" + req[i].VCCHAR + "'" + "," +
                        "'" + req[i].VCCHARVALUE + "'" + "," +
                        "'" + req[i].VERSIONID + "'" + "," +
                        "'" + vScenario + "'" + "," +
                        "'" + vWeekDate + "'" + "," +
                        "'" + req[i].OPTIONPERCENTAGE + "'" + "," +
                        "'" + req[i].FINALDEMANDVC + "'" + ')';// + ' WITH PRIMARY KEY';
                    try {
                        await cds.run(modQuery);
                        flag = 'S';
                        console.log("Step3");
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }

        } else {
            return "Failed to import Demand from IBP";
        }
        if (flag === 'S') {

            console.log("Step4");
            return "Successfully imported demand from IBP";
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
        const vDelDate = new Date();
        const vDateDel = vDelDate.toISOString().split('T')[0];
        try {
            await DELETE.from('CP_IBP_FCHARPLAN')
                .where(`LOCATION_ID = '${request.data.LOCATION_ID}' 
                            AND PRODUCT_ID = '${request.data.PRODUCT_ID}'
                            AND WEEK_DATE       = '${vDateDel}'`);
        }
        catch (e) {
            //Do nothing
        }

        var vFromDate = "2022-10-01T00:00:00";//new Date(request.data.FROMDATE).toISOString().split('Z')[0];
        var vToDate = "2022-10-31T00:00:00";//new Date(request.data.TODATE).toISOString().split('Z')[0];
        var vNextMonthDate = GenF.addMonths("2022-10-01", 1).toISOString().split('Z')[0];
        while (vLoop === 1) {
            if (vNextMonthDate <= vToDate) {
                resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                vFromDate = vNextMonthDate;
                vNextMonthDate = GenF.addMonths(vFromDate, 1).toISOString().split('Z')[0];
            }
            else if (vNextMonthDate > vToDate) {
                vNextMonthDate = vToDate;
                vLoop = 0;
                resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
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
                req[i].PERIODID4_TSTAMP = vWeekDate;
                await cds.run(
                    `DELETE FROM "CP_IBP_FCHARPLAN" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                          AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                          AND "CLASS_NUM" = '` + req[i].VCCLASS + `' 
                                                          AND "CHAR_NUM" = '` + req[i].VCCHAR + `' 
                                                          AND "CHARVAL_NUM" = '` + req[i].VCCHARVALUE + `' 
                                                          AND "VERSION" = '` + req[i].VERSIONID + `'
                                                          AND "SCENARIO" = '` + vScenario + `'
                                                          AND "WEEK_DATE" = '` + vWeekDate + `'`
                );

                let modQuery = 'INSERT INTO "CP_IBP_FCHARPLAN" VALUES (' +
                    "'" + req[i].LOCID + "'" + "," +
                    "'" + req[i].PRDID + "'" + "," +
                    "'" + req[i].VCCLASS + "'" + "," +
                    "'" + req[i].VCCHAR + "'" + "," +
                    "'" + req[i].VCCHARVALUE + "'" + "," +
                    "'" + req[i].VERSIONID + "'" + "," +
                    "'" + vScenario + "'" + "," +
                    "'" + vWeekDate + "'" + "," +
                    "'" + req[i].OPTIONPERCENTAGE + "'" + "," +
                    "'" + req[i].FINALDEMANDVC + "'" + ')';// + ' WITH PRIMARY KEY';
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

        const lipartialprod = await cds.run(
            `
         SELECT PRODUCT_ID,
                LOCATION_ID,
                PROD_DESC,
                REF_PRODID
           FROM "CP_PARTIALPROD_INTRO"
           WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
           ORDER BY REF_PRODID`);


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
                // "VCSTRUCTURENODE": limasterprod[i].RESERVE_FIELD3
            };
            oReq.masterProd.push(vmasterProd);
            for (iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
                if (lipartialprod[iPartial].REF_PRODID === limasterprod[i].PRODUCT_ID) {
                    vmasterProd = {
                        "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                        "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                        "PRDID": lipartialprod[iPartial].PRODUCT_ID,
                        "PRDGROUP": limasterprod[i].PROD_GROUP,
                        "VCMODEL": limasterprod[i].PROD_MODEL,
                        "PRDDESCR": lipartialprod[iPartial].PROD_DESC,
                        "PRDSERIES": limasterprod[i].PROD_SERIES
                        // "VCSTRUCTURENODE": limasterprod[i].RESERVE_FIELD3
                    };
                    oReq.masterProd.push(vmasterProd);
                }
            }
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
        // for (i = 0; i < licust.length; i++) {
        vcust = {
            "CUSTID": "NULL",//licust[i].CUSTOMER_GROUP,
            "CUSTDESCR": ""//licust[i].CUSTOMER_DESC,
        };
        // oReq.cust.push(vcust);

        // }
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
    // Create customer group in IBP
    this.on("createIBPCIR", async (req) => {
        var oReq = {
            cir: [],
        },
            vCIR;

        const licir = await cds.run(
            `
            SELECT *
               FROM "V_CIRTOIBP" 
               WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                          AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < licir.length; i++) {

            var vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
            vCIR = {
                "LOCID": licir[i].LOCATION_ID,
                "PRDID": licir[i].PRODUCT_ID,
                "VCCLASS": licir[i].CLASS_NUM,
                "VCCHAR": licir[i].CHAR_NUM,
                "VCCHARVALUE": licir[i].CHARVAL_NUM,
                "CUSTID": "NULL",
                "CIRQTY": licir[i].CIRQTY.toString(),
                "PERIODID4_TSTAMP": vWeekDate
            };
            oReq.cir.push(vCIR);
        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,CUSTID,CIRQTY,PERIODID4_TSTAMP",
            "DoCommit": true,
            "NavSBPVCP": oReq.cir
        }
        try {
            await service.tx(req).post("/SBPVCPTrans", oEntry);
            response = "Success";
        }
        catch (e) {

        }
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_Transactionid='" + vTransID + "'";
        return await service.tx(req).get(resUrl)
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
                    CLASS_DESC,
                    CHAR_NUM,
                    CHAR_NAME,
                    CHAR_DESC,
                    CHAR_GROUP,
                    CHAR_VALUE,
                    CHARVAL_NUM,
                    CHARVAL_DESC
                    FROM V_CLASSCHARVAL 
                WHERE CLASS_NUM = '`+ req.data.CLASS_NUM + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < liclass.length; i++) {
            vclass = {
                "VCCHAR": liclass[i].CHAR_NUM,
                "VCCHARVALUE": liclass[i].CHARVAL_NUM,
                "VCCLASS": liclass[i].CLASS_NUM,
                "VCCHARNAME": liclass[i].CHAR_NAME,
                "VCCHARGROUP": liclass[i].CHAR_GROUP,
                "VCCHARVALUENAME": liclass[i].CHAR_VALUE,
                "VCCLASSNAME": liclass[i].CLASS_NAME,
                "VCCHARDESC": liclass[i].CHAR_DESC,
                "VCCHARVALUEDESC": liclass[i].CHARVAL_DESC,
                "VCCLASSDESC": liclass[i].CLASS_DESC
            };
            oReq.class.push(vclass);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCCHAR,VCCHARGROUP,VCCHARNAME,VCCHARVALUE,VCCHARVALUENAME,VCCLASS,VCCLASSNAME,VCCHARDESC,VCCHARVALUEDESC,VCCLASSDESC",
            "DoCommit": true,
            "NavVCPCLASS": oReq.class
        }
        await servicePost.tx(req).post("/VCPCLASSTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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

            let vFromDate = new Date();
            var Vnumber = 2;
            const lsSales = await GenF.getParameterValue(req.data.LOCATION_ID, 4);
        let vToDate = new Date().toISOString().split('Z')[0].split('T')[0];
        vFromDate.setDate(vFromDate.getDate() - (Vnumber * 7));
        vFromDate = vFromDate.toISOString().split('Z')[0].split('T')[0];
        const liactcomp = await cds.run(
            `
            SELECT DISTINCT "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "ACTUALCOMPONENTDEMAND",
                    "COMPONENT"
                    FROM V_IBP_LOCPRODCOMP_ACTDEMD
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);
        //            AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
        // `' AND WEEK_DATE >= '2020-08-01' AND WEEK_DATE <= '2021-11-30'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        const licriticalcomp = await cds.run(
            `
            SELECT  "LOCATION_ID",
                    "PRODUCT_ID",
                    "ITEM_NUM",
                    "COMPONENT",
                    "CRITICALKEY"
                    FROM CP_CRITICAL_COMP
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                      AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'                               
                      AND CRITICALKEY = '` + req.data.CRITICALKEY + `'`);

        // `' AND WEEK_DATE >= '` + req.data.FROMDATE +
        // `' AND WEEK_DATE <= '` + req.data.TODATE + `'`);
        if (req.data.CRITICALKEY === "X") {
            for (i = 0; i < liactcomp.length; i++) {
                for (var j = 0; j < licriticalcomp.length; j++) {
                    if (liactcomp[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcomp[i].PRODUCT_ID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcomp[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcomp[i].COMPONENT === licriticalcomp[j].COMPONENT) {

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
                }

            }

        } else {

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
        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,ACTUALCOMPONENTDEMAND,PERIODID0_TSTAMP,PRDFR",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavSBPVCP": oReq.actcomp
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);

        var resUrl = "/getExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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
            `);

        //            AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
        // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +`'

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lisales.length; i++) {
            var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = lisales[i].ORD_QTY.split('.');
            vsales = {
                "LOCID": lisales[i].LOCATION_ID,
                "PRDID": lisales[i].PRODUCT_ID,
                "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
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
            "NavSBPVCP": oReq.sales
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);

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
                    `);
        //            AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
        // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +

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
                "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
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
            "NavSBPVCP": oReq.sales
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);

        var resUrl = "/getExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        var res = await service.tx(req).get(resUrl);
        return res[0].Value;

    });
    // Actual Demand at VC
    this.on("createComponentReq", async (req) => {
        var oReq = {
            actcompreq: [],
        },
            vactcompreq;
        const liactcompreq = await cds.run(  //V_COMP_REQ
            `
            SELECT DISTINCT "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "COMPONENT",
                    "COMPCIR_QTY"
                    FROM CP_ASSEMBLY_REQ
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND REF_PRODID = '`+ req.data.PRODUCT_ID + `' AND WEEK_DATE >= '2022-10-17' AND WEEK_DATE <= '2023-09-04' AND COMPCIR_QTY >= 0`);

        for (i = 0; i < liactcompreq.length; i++) {
            var vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);
            vactcompreq = {
                "LOCID": liactcompreq[i].LOCATION_ID,
                "PRDID": liactcompreq[i].PRODUCT_ID,
                "PRDFR": liactcompreq[i].COMPONENT,
                "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                "PERIODID0_TSTAMP": vWeekDate[0]
            };
            oReq.actcompreq.push(vactcompreq);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavSBPVCP": oReq.actcompreq
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);

        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        var res = await service.tx(req).get(resUrl);
        return res[0].Value;

    });
    // Create Locations in IBP
    this.on("createIBPLocProd", async (req) => {
        var oReq = {
            newLocProd: [],
        },
            vNewLocProd;

        const lilocprod = await cds.run(
            ` SELECT
                "LOCATION_ID",
                "PRODUCT_ID",
                "LOTSIZE_KEY",
                "LOT_SIZE",
                "PROCUREMENT_TYPE",
                "PLANNING_STRATEGY"
              FROM CP_LOCATION_PRODUCT
              WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lilocprod.length; i++) {
            vNewLocProd = {
                "LOCID": lilocprod[i].LOCATION_ID,
                "PRDID": lilocprod[i].PRODUCT_ID,
                "PLANNINGSTRGY": lilocprod[i].PLANNING_STRATEGY,
                "PLUNITID": "TEST",
                "PROCUREMENTTYPE": lilocprod[i].PROCUREMENT_TYPE,
                "VCLOTSIZE": lilocprod[i].LOT_SIZE.toString()
            };
            oReq.newLocProd.push(vNewLocProd);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,PRDID,PLANNINGSTRGY,PLUNITID,PROCUREMENTTYPE,VCLOTSIZE",
            "DoCommit": true,
            "NavVCPLOCATIONPRODUCT": oReq.newLocProd
        }
        await servicePost.tx(req).post("/VCPLOCATIONPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create Locations in IBP
    this.on("exportRestrDetails_fn", async (req) => {
        let vFlag = '';
        let oReq = await obibpfucntions.exportRtrHdrDet(req);
        var vTransID = new Date().getTime().toString();
        var vTransID2 = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCRESTRICTIONID,VCRESTRICTIONDESC,VCRESTRICTIONTYPE",
            "DoCommit": true,
            "NavVCPRESTRICTION": oReq.rtrhdr
        }
        var oEntry2 =
        {
            "TransactionID": vTransID2,
            "RequestedAttributes": "LOCID,VCRESTRICTIONID,VCPLACEHOLDER",
            "DoCommit": true,
            "NavVCPRESTRICTION": oReq.locrtr
        }
        try {
            await servicePost.tx(req).post("/VCPRESTRICTIONTrans", oEntry);
            await servicePost.tx(req).post("/VCPLOCRESTRICTIONTrans", oEntry2);
            vFlag = 'S';
        }
        catch (e) {
            vFlag = '';
        }
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID2 + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
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

        const lipartialprod = await cds.run(
            `
         SELECT PRODUCT_ID,
                LOCATION_ID,
                REF_PRODID
           FROM "CP_PARTIALPROD_INTRO"
           WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
           ORDER BY REF_PRODID`);

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
            for (iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
                if (lipartialprod[iPartial].REF_PRODID === limasterprod[i].PRODUCT_ID) {
                    vmasterProd = {
                        "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                        "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                        "PRDID": lipartialprod[iPartial].PRODUCT_ID,
                        "PRDGROUP": limasterprod[i].PROD_GROUP,
                        "VCMODEL": limasterprod[i].PROD_MODEL,
                        "PRDDESCR": limasterprod[i].PROD_DESC,
                        "PRDSERIES": limasterprod[i].PROD_SERIES
                        // "VCSTRUCTURENODE": limasterprod[i].RESERVE_FIELD3
                    };
                    oReq.masterProd.push(vmasterProd);
                }
            }

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR,PRDSERIES",
            "DoCommit": true,
            "NavVCPPRODUCT": oReq.masterProd
        }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await servicePost.tx(req).post("/VCPPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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
            "NavVCPLOCATION": oReq.newLoc
        }

        // req.headers['Application-Interface-Key'] = vAIRKey;
        await servicePost.tx(req).post("/VCPLOCATIONTrans", oEntry);
        console.log(req);
        console.log(req.headers);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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
    // Create Locations in IBP
    this.on("exportIBPLocProd", async (req) => {
        var oReq = {
            newLocProd: [],
        },
            vNewLocProd, flag = '';
        const lilocprod = await cds.run(
            ` SELECT
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "LOTSIZE_KEY",
                    "LOT_SIZE",
                    "PROCUREMENT_TYPE",
                    "PLANNING_STRATEGY"
                  FROM CP_LOCATION_PRODUCT
                  WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lilocprod.length; i++) {
            vNewLocProd = {
                "LOCID": lilocprod[i].LOCATION_ID,
                "PRDID": lilocprod[i].PRODUCT_ID,
                "PLANNINGSTRGY": lilocprod[i].PLANNING_STRATEGY,
                "PLUNITID": "TEST",
                "PROCUREMENTTYPE": lilocprod[i].PROCUREMENT_TYPE,
                "VCLOTSIZE": lilocprod[i].LOT_SIZE.toString()
            };
            oReq.newLocProd.push(vNewLocProd);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,PRDID,PLANNINGSTRGY,PLUNITID,PROCUREMENTTYPE,VCLOTSIZE",
            "DoCommit": true,
            "NavVCPLOCATIONPRODUCT": oReq.newLocProd
        }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await servicePost.tx(req).post("/VCPLOCATIONPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        try {
            var vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export of Location - Product is successful at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Location - Product exported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Location - Product job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of Location - Product has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of Location - Product job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Location - Product job update results", result);

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
        // for (i = 0; i < licust.length; i++) {
        vcust = {
            "CUSTID": licust[i].CUSTOMER_GROUP,
            "CUSTDESCR": licust[i].CUSTOMER_DESC,
        };
        oReq.cust.push(vcust);

        // }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "CUSTID,CUSTDESCR",
            "DoCommit": true,
            "NavVCPCUSTOMER": oReq.cust
        }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await servicePost.tx(req).post("/VCPCUSTOMERTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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
                CLASS_DESC,
                CHAR_NUM,
                CHAR_NAME,
                CHAR_DESC,
                CHAR_GROUP,
                CHAR_VALUE,
                CHARVAL_NUM,
                CHARVAL_DESC
                FROM V_CLASSCHARVAL 
            WHERE CLASS_NUM = '`+ req.data.CLASS_NUM + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < liclass.length; i++) {
            vclass = {
                "VCCHAR": liclass[i].CHAR_NUM,
                "VCCHARVALUE": liclass[i].CHARVAL_NUM,
                "VCCLASS": liclass[i].CLASS_NUM,
                "VCCHARNAME": liclass[i].CHAR_NAME,
                "VCCHARGROUP": liclass[i].CHAR_GROUP,
                "VCCHARVALUENAME": liclass[i].CHAR_VALUE,
                "VCCLASSNAME": liclass[i].CLASS_NAME,
                "VCCHARDESC": liclass[i].CHAR_DESC,
                "VCCHARVALUEDESC": liclass[i].CHARVAL_DESC,
                "VCCLASSDESC": liclass[i].CLASS_DESC
            };
            oReq.class.push(vclass);

        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCCHAR,VCCHARGROUP,VCCHARNAME,VCCHARVALUE,VCCHARVALUENAME,VCCLASS,VCCLASSNAME,VCCHARDESC,VCCHARVALUEDESC,VCCLASSDESC",
            "DoCommit": true,
            "NavVCPCLASS": oReq.class
        }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await servicePost.tx(req).post("/VCPCLASSTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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

        await GenF.logMessage(req, `Started exporting Sales History and Configurations`);
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
            `'`);
        // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +
        // `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lisales.length; i++) {
            var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = lisales[i].ORD_QTY.split('.');
            vsales = {
                "LOCID": lisales[i].LOCATION_ID,
                "PRDID": lisales[i].PRODUCT_ID,
                "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
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
            "NavSBPVCP": oReq.sales
        }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await service.tx(req).post("/SBPVCPTrans", oEntry);

        // var resUrl = "/SBPVCPMessage?$select=Transactionid,ExceptionId,MsgText&$filter=Transactionid eq '" + vTransID + "'";
        var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        try {
            return await service.tx(req).get(resUrl);
            flag = 'S';
        }
        catch{

        }
        // Once Sales History is successfull , send sales Config
        if (flag === 'S') {
            let oReq = await obibpfucntions.exportSalesCfg(req);
            var vTransID = new Date().getTime().toString();
            var oEntryCfg =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,VCCHAR,VCCHARVALUE,VCCLASS,ACTUALDEMANDVC,CUSTID,PERIODID0_TSTAMP",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": "",
                "NavSBPVCP": oReq.sales
            }
            // req.headers['Application-Interface-Key'] = vAIRKey;
            await service.tx(req).post("/SBPVCPTrans", oEntryCfg);

            var resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
            try {
                return await service.tx(req).get(resUrl);
                flag = 'X';
            }
            catch{

            }
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

                console.log("Sales History and Confifuration has exported to update req", updateReq);

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
        // Fetch History period from Configuration table
        const lsSales = await GenF.getParameterValue(req.data.LOCATION_ID, 4);
        console.log(lsSales);
        let vFromDate = new Date();
        console.log(vFromDate);
        let vToDate = new Date().toISOString().split('Z')[0].split('T')[0];
        console.log(vToDate);
        vFromDate.setDate(vFromDate.getDate() - (parseInt(lsSales) * 7));
        console.log(vFromDate);
        vFromDate = vFromDate.toISOString().split('Z')[0].split('T')[0];
        console.log(vFromDate);
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
            `' AND WEEK_DATE >= '` + vFromDate +
            `' AND WEEK_DATE <= '` + vToDate + `'`);

        const licriticalcomp = await cds.run(
            `
                SELECT  "LOCATION_ID",
                        "PRODUCT_ID",
                        "ITEM_NUM",
                        "COMPONENT",
                        "CRITICALKEY"
                        FROM CP_CRITICAL_COMP
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                          AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'                               
                          AND CRITICALKEY = '` + req.data.CRITICALKEY + `'`);

        // `' AND WEEK_DATE >= '` + req.data.FROMDATE +
        // `' AND WEEK_DATE <= '` + req.data.TODATE + `'`);
        if (req.data.CRITICALKEY === "X") {
            for (i = 0; i < liactcomp.length; i++) {
                for (var j = 0; j < licriticalcomp.length; j++) {
                    if (liactcomp[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcomp[i].PRODUCT_ID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcomp[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcomp[i].COMPONENT === licriticalcomp[j].COMPONENT) {

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
                }

            }

        } else {

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
        }
        if (oReq.actcomp) {
            var vTransID = new Date().getTime().toString();
            var oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,ACTUALCOMPONENTDEMAND,PERIODID0_TSTAMP,PRDFR",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": "",
                "NavSBPVCP": oReq.actcomp
            }
            // req.headers['Application-Interface-Key'] = vAIRKey;
            await service.tx(req).post("/SBPVCPTrans", oEntry);

            var resUrl = "/getExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
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
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "No Actual Component Demand exists " + new Date();


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
                    console.log("No Actual Component Demand, job update results", result);

                });
            }
        }
        // GetExportResult
    });

    // Actual Demand at VC
    this.on("exportIBPSalesConfig", async (req) => {
        // var oReq = {
        //     sales: [],
        // },
        //     vsales;
        // const lisales = await cds.run(
        //     `
        //         SELECT  "WEEK_DATE",
        //                 "LOCATION_ID",
        //                 "PRODUCT_ID",
        //                 "ORD_QTY",
        //                 "CUSTOMER_GROUP",
        //                 "CLASS_NUM",
        //                 "CHAR_NUM",
        //                 "CHARVAL_NUM"
        //                 FROM V_IBP_SALESHCONFIG_VC
        //                 WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
        //                    AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
        //     `'`);
        // // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +e

        // for (i = 0; i < lisales.length; i++) {
        //     var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
        //     var vDemd = lisales[i].ORD_QTY.split('.');
        //     vsales = {
        //         "LOCID": lisales[i].LOCATION_ID,
        //         "PRDID": lisales[i].PRODUCT_ID,
        //         "VCCHAR": lisales[i].CHAR_NUM,
        //         "VCCHARVALUE": lisales[i].CHARVAL_NUM,
        //         "VCCLASS": lisales[i].CLASS_NUM,
        //         "ACTUALDEMANDVC": vDemd[0],
        //         "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
        //         "PERIODID0_TSTAMP": vWeekDate[0]
        //     };
        //     oReq.sales.push(vsales);

        // }
        let oReq = await obibpfucntions.exportSalesCfg(req);
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,VCCHAR,VCCHARVALUE,VCCLASS,ACTUALDEMANDVC,CUSTID,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavSBPVCP": oReq.sales
        }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await service.tx(req).post("/SBPVCPTrans", oEntry);

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
            SELECT DISTINCT "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "COMPONENT",
                    "COMPCIR_QTY"
                    FROM CP_ASSEMBLY_REQ
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND REF_PRODID = '`+ req.data.PRODUCT_ID +
            `' AND WEEK_DATE >= '` + req.data.FROMDATE +
            `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                       AND COMPCIR_QTY >= 0`);

        const licriticalcomp = await cds.run(
            `
            SELECT  "LOCATION_ID",
                    "PRODUCT_ID",
                    "ITEM_NUM",
                    "COMPONENT",
                    "CRITICALKEY"
                FROM CP_CRITICAL_COMP
                WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                      AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'                               
                      AND CRITICALKEY = '` + req.data.CRITICALKEY + `'`);

        if (req.data.CRITICALKEY === "X") {
            for (i = 0; i < liactcompreq.length; i++) {
                for (var j = 0; j < licriticalcomp.length; j++) {
                    if (liactcompreq[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcompreq[i].PRODUCT_ID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcompreq[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcompreq[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                        var vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                        var vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);

                        vactcompreq = {
                            "LOCID": liactcompreq[i].LOCATION_ID,
                            "PRDID": liactcompreq[i].PRODUCT_ID,
                            "PRDFR": liactcompreq[i].COMPONENT,
                            "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                            "PERIODID0_TSTAMP": vWeekDate[0]
                        };
                        oReq.actcompreq.push(vactcompreq);
                    }
                }

            }

        } else {
            for (i = 0; i < liactcompreq.length; i++) {
                var vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                var vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);
                vactcompreq = {
                    "LOCID": liactcompreq[i].LOCATION_ID,
                    "PRDID": liactcompreq[i].PRODUCT_ID,
                    "PRDFR": liactcompreq[i].COMPONENT,
                    "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                    "PERIODID0_TSTAMP": vWeekDate[0]
                };
                oReq.actcompreq.push(vactcompreq);

            }
        }

        if (oReq.actcomp) {
            var vTransID = new Date().getTime().toString();
            var oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID0_TSTAMP",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": "",
                "NavSBPVCP": oReq.actcompreq
            }
            // req.headers['Application-Interface-Key'] = vAIRKey;
            await service.tx(req).post("/SBPVCPTrans", oEntry);

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
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "No Component requirement Qty exists " + new Date();


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
                    console.log("No Component requirement Qty, job update results", result);

                });
            }
        }

        // GetExportResult

    });


    //// Future Demand Qty

    this.on("generateFDemandQty", async (request) => {
        var flag;

        await GenF.logMessage(request, `Started importing Future Demand`);
        var resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "'and UOMTOID eq 'EA'";

        // req.headers['Application-Interface-Key'] = vAIRKey;
        var req = await service.tx(req).get(resUrl);
        // if(req.length > 0){
        const vDelDate = new Date();
        const vDateDeld = vDelDate.toISOString().split('T')[0];
        try {
            await DELETE.from('CP_IBP_FUTUREDEMAND')
                .where(`LOCATION_ID = '${request.data.LOCATION_ID}' 
                        AND PRODUCT_ID = '${request.data.PRODUCT_ID}'
                        AND WEEK_DATE  < '${vDateDeld}'`);
        }
        catch (e) {
            //Do nothing
        }
        // }
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
            req[i].PERIODID4_TSTAMP = vWeekDate;

            if (vWeekDate >= vDateDeld) {
                await cds.run(
                    `DELETE FROM "CP_IBP_FUTUREDEMAND" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                      AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                      AND "VERSION" = '` + req[i].VERSIONID + `'
                                                      AND "SCENARIO" = '` + vScenario + `'
                                                      AND "WEEK_DATE" = '` + vWeekDate + `'`
                );
                let modQuery = 'INSERT INTO "CP_IBP_FUTUREDEMAND" VALUES (' +
                    "'" + req[i].LOCID + "'" + "," +
                    "'" + req[i].PRDID + "'" + "," +
                    "'" + req[i].VERSIONID + "'" + "," +
                    "'" + vScenario + "'" + "," +
                    "'" + vWeekDate + "'" + "," +
                    "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')';// + ' WITH PRIMARY KEY';
                // let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND" VALUES (' +
                //     "'" + req[i].LOCID + "'" + "," +
                //     "'" + req[i].PRDID + "'" + "," +
                //     "'" + req[i].VERSIONID + "'" + "," +
                //     "'" + vScenario + "'" + "," +
                //     "'" + vWeekDate + "'" + "," +
                //     "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')' + ' WITH PRIMARY KEY';
                try {
                    await cds.run(modQuery);
                    flag = 'D';
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        if (flag === 'D') {
            //////////////////////////////////////////
            flag = '';
            var resUrlFplan;
            const dateJSONToEDM = jsonDate => {
                const content = /\d+/.exec(String(jsonDate));
                const timestamp = content ? Number(content[0]) : 0;
                const date = new Date(timestamp);
                const string = date.toISOString();
                return string;
            };

            resUrlFplan = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";

            var req = await service.tx(request).get(resUrlFplan);
            const vDelDate = new Date();
            const vDateDel = vDelDate.toISOString().split('T')[0];
            try {
                await DELETE.from('CP_IBP_FCHARPLAN')
                    .where(`LOCATION_ID = '${request.data.LOCATION_ID}' 
                        AND PRODUCT_ID = '${request.data.PRODUCT_ID}'
                        AND WEEK_DATE    < '${vDateDel}'`);
            }
            catch (e) {
                //Do nothing
            }
            for (var i in req) {
                var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
                var vScenario = 'BSL_SCENARIO';
                req[i].PERIODID4_TSTAMP = vWeekDate;
                if (vWeekDate >= vDateDel) {
                    await cds.run(
                        `DELETE FROM "CP_IBP_FCHARPLAN" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                          AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                          AND "CLASS_NUM" = '` + req[i].VCCLASS + `' 
                                                          AND "CHAR_NUM" = '` + req[i].VCCHAR + `' 
                                                          AND "CHARVAL_NUM" = '` + req[i].VCCHARVALUE + `' 
                                                          AND "VERSION" = '` + req[i].VERSIONID + `'
                                                          AND "SCENARIO" = '` + vScenario + `'
                                                          AND "WEEK_DATE" = '` + vWeekDate + `'`
                    );

                    let modQuery = 'INSERT INTO "CP_IBP_FCHARPLAN" VALUES (' +
                        "'" + req[i].LOCID + "'" + "," +
                        "'" + req[i].PRDID + "'" + "," +
                        "'" + req[i].VCCLASS + "'" + "," +
                        "'" + req[i].VCCHAR + "'" + "," +
                        "'" + req[i].VCCHARVALUE + "'" + "," +
                        "'" + req[i].VERSIONID + "'" + "," +
                        "'" + vScenario + "'" + "," +
                        "'" + vWeekDate + "'" + "," +
                        "'" + req[i].OPTIONPERCENTAGE + "'" + "," +
                        "'" + req[i].FINALDEMANDVC + "'" + ')';// + ' WITH PRIMARY KEY';
                    try {
                        await cds.run(modQuery);
                        flag = 'S';
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
        }
        // if (flag === 'D') {

        //     let dataObj = {};
        //     dataObj["success"] = true;
        //     dataObj["message"] = "Import of IBP Demand data is successfull at " + new Date();


        //     if (request.headers['x-sap-job-id'] > 0) {
        //         const scheduler = getJobscheduler(request);

        //         var updateReq = {
        //             jobId: request.headers['x-sap-job-id'],
        //             scheduleId: request.headers['x-sap-job-schedule-id'],
        //             runId: request.headers['x-sap-job-run-id'],
        //             data: dataObj
        //         };

        //         console.log("IBP Demand import update req", updateReq);

        //         scheduler.updateJobRunLog(updateReq, function (err, result) {
        //             if (err) {
        //                 return console.log('Error updating run log: %s', err);
        //             }
        //             //Run log updated successfully
        //             console.log("IBP Demand import job update results", result);

        //         });
        //     }
        // } else {
        //     let dataObj = {};
        //     dataObj["failed"] = false;
        //     dataObj["message"] = "Import of IBP Demand data is failed at" + new Date();


        //     if (request.headers['x-sap-job-id'] > 0) {
        //         const scheduler = getJobscheduler(request);

        //         var updateReq = {
        //             jobId: request.headers['x-sap-job-id'],
        //             scheduleId: request.headers['x-sap-job-schedule-id'],
        //             runId: request.headers['x-sap-job-run-id'],
        //             data: dataObj
        //         };

        //         console.log("generatePredictions job update req", updateReq);

        //         scheduler.updateJobRunLog(updateReq, function (err, result) {
        //             if (err) {
        //                 return console.log('Error updating run log: %s', err);
        //             }
        //             //Run log updated successfully
        //             console.log("IBP Demand import job update results", result);

        //         });
        //     }
        // }
        if (flag === 'S') {


            await GenF.logMessage(request, `Completed importing Future Demand`);
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of IBP Demand and Future char.plan data is successfull at " + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("IBP Demand and Future char.plan import update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("IBP Demand and Future char.plan import job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Demand and IBP Future char.plan has failed at" + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("IBP Demand and Future char.plan job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("IBP  Demand and Future char.plan job update results", result);

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
        // while (vLoop === 1) {
        // if (vNextMonthDate <= vToDate) {
        //     resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
        //     vFromDate = vNextMonthDate;
        //     vNextMonthDate = GenF.addMonths(vFromDate, 1).toISOString().split('Z')[0];
        // }
        // else if (vNextMonthDate > vToDate) {
        //     vNextMonthDate = vToDate;
        //     vLoop = 0;
        //     resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vNextMonthDate + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
        // }
        // else {
        //     vLoop = 0;
        //     break;
        // }
        // req.headers['Application-Interface-Key'] = vAIRKey;
        resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";

        var req = await service.tx(request).get(resUrl);
        // if(req.length > 0){
        const vDelDate = new Date();
        const vDateDel = vDelDate.toISOString().split('T')[0];
        try {
            await DELETE.from('CP_IBP_FCHARPLAN')
                .where(`LOCATION_ID = '${request.data.LOCATION_ID}' 
                        AND PRODUCT_ID = '${request.data.PRODUCT_ID}'
                        AND WEEK_DATE    < '${vDateDel}'`);
        }
        catch (e) {
            //Do nothing
        }
        // }
        flag = '';
        for (var i in req) {
            var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
            var vScenario = 'BSL_SCENARIO';
            req[i].PERIODID4_TSTAMP = vWeekDate;
            await cds.run(
                `DELETE FROM "CP_IBP_FCHARPLAN" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                          AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                          AND "CLASS_NUM" = '` + req[i].VCCLASS + `' 
                                                          AND "CHAR_NUM" = '` + req[i].VCCHAR + `' 
                                                          AND "CHARVAL_NUM" = '` + req[i].VCCHARVALUE + `' 
                                                          AND "VERSION" = '` + req[i].VERSIONID + `'
                                                          AND "SCENARIO" = '` + vScenario + `'
                                                          AND "WEEK_DATE" = '` + vWeekDate + `'`
            );

            let modQuery = 'INSERT INTO "CP_IBP_FCHARPLAN" VALUES (' +
                "'" + req[i].LOCID + "'" + "," +
                "'" + req[i].PRDID + "'" + "," +
                "'" + req[i].VCCLASS + "'" + "," +
                "'" + req[i].VCCHAR + "'" + "," +
                "'" + req[i].VCCHARVALUE + "'" + "," +
                "'" + req[i].VERSIONID + "'" + "," +
                "'" + vScenario + "'" + "," +
                "'" + vWeekDate + "'" + "," +
                "'" + req[i].OPTIONPERCENTAGE + "'" + "," +
                "'" + req[i].FINALDEMANDVC + "'" + ')';// + ' WITH PRIMARY KEY';
            try {
                await cds.run(modQuery);
                flag = 'X';
            }
            catch (err) {
                console.log(err);
            }
            //  }
        }
        // }
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

    // Generate char plan
    this.on("exportIBPCIR", async (request) => {
        var oReq = {
            cir: [],
        },
            vCIR;

        const licir = await cds.run(
            `
            SELECT *
               FROM "V_CIRTOIBP" 
               WHERE LOCATION_ID = '`+ request.data.LOCATION_ID + `'
                          AND PRODUCT_ID = '`+ request.data.PRODUCT_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < licir.length; i++) {

            var vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
            vCIR = {
                "LOCID": licir[i].LOCATION_ID,
                "PRDID": licir[i].PRODUCT_ID,
                "VCCLASS": licir[i].CLASS_NUM,
                "VCCHAR": licir[i].CHAR_NUM,
                "VCCHARVALUE": licir[i].CHARVAL_NUM,
                "CUSTID": "NULL",
                "CIRQTY": licir[i].CIRQTY.toString(),
                "PERIODID4_TSTAMP": vWeekDate
            };
            oReq.cir.push(vCIR);
        }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,CUSTID,CIRQTY,PERIODID4_TSTAMP",
            "DoCommit": true,
            "NavSBPVCP": oReq.cir
        }

        try {
            await service.tx(request).post("/SBPVCPTrans", oEntry);
            flag = 'X';
        }
        catch (err) {
            console.log(err);
            flag = ' ';
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export of CIR to IBP is successfull at " + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of CIR to IBP, update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of CIR to IBP, job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of CIR to IBP has failed at" + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of CIR to IBP, job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of CIR to IBP, job update results", result);

                });
            }
            // return "Failed to import IBP Future char.plan";
        }
    });
    // Create Locations in IBP
    this.on("exportRestrDetails", async (req) => {
        let vFlag = '';

        await GenF.logMessage(req, `Started exporting Restriction header`);
        let oReq = await obibpfucntions.exportRtrHdrDet(req);
        var vTransID = new Date().getTime().toString();
        var vTransID2 = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCRESTRICTIONID,VCRESTRICTIONDESC,VCRESTRICTIONTYPE",
            "DoCommit": true,
            "NavVCPRESTRICTION": oReq.rtrhdr
        }
        var oEntry2 =
        {
            "TransactionID": vTransID2,
            "RequestedAttributes": "LOCID,VCRESTRICTIONID,VCPLACEHOLDER",
            "DoCommit": true,
            "NavVCPRESTRICTION": oReq.locrtr
        }
        try {
            await servicePost.tx(req).post("/VCPRESTRICTIONTrans", oEntry);
            await servicePost.tx(req).post("/VCPLOCRESTRICTIONTrans", oEntry2);
            vFlag = 'S';
        }
        catch (e) {
            vFlag = '';
        }
        if (vFlag === 'S') {

            await GenF.logMessage(req, `Export of Restriction header is successfull`);
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Export Restriction header details is successfull at " + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of Restriction header details, update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Restriction header details, job update results", result);

                });
            }
            //return "Successfully imported IBP Future char.plan";
        } else {

            await GenF.logMessage(req, `Export of Restriction header failed`);
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Export of Restriction header details has failed at" + new Date();


            if (request.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(request);

                var updateReq = {
                    jobId: request.headers['x-sap-job-id'],
                    scheduleId: request.headers['x-sap-job-schedule-id'],
                    runId: request.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Export of Restriction header details, job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Export of Restriction header details, job update results", result);

                });
            }
            // return "Failed to import IBP Future char.plan";
        }
    });
});
