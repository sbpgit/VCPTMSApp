const cds = require("@sap/cds");
const GenF = require("./gen-functions");
const hana = require("@sap/hana-client");
const { v1: uuidv1 } = require('uuid')
const xsenv = require("@sap/xsenv");
const JobSchedulerClient = require("@sap/jobs-client");
const MktAuth = require("./market-auth");
const vAIRKey = process.env.AIR;
const IBPFunc = require("./ibp-functions");
const obibpfucntions = new IBPFunc();
const obgenMktAuth = new MktAuth();

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
    // const { SBPVCP } = this.entities;
    const service = await cds.connect.to('IBPDemandsrv');
    const servicePost = await cds.connect.to('IBPMasterDataAPI');
    // let csrfProtection = csrf({ cookie: true })
    // this.on('READ', SBPVCP, request => {
    //     try {
    //         return service.tx(request).run(request.query);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // });

    this.on("getFDemandQty", async (request) => {
        let flag;
        let resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "'and UOMTOID eq 'EA'";
        let req = await service.tx(req).get(resUrl);
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
        for (let i in req) {
            let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP);
            let vScenario = 'BSL_SCENARIO';
            req[i].PERIODID4_TSTAMP = vWeekDate;
            // try {
            await DELETE.from('CP_IBP_FUTUREDEMAND')
                .where(`LOCATION_ID = '${req[i].LOCID}' 
                        AND PRODUCT_ID = '${req[i].PRDID}'
                        AND VERSION = '${req[i].VERSIONID}'
                        AND SCENARIO = '${vScenario}'
                        AND WEEK_DATE       = '${vWeekDate}'`)
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
            let resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + request.data.LOCATION_ID + "' and PRDID eq '" + request.data.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";

            let req = await service.tx(request).get(resUrl);
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
            for (let i in req) {
                let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
                let vScenario = 'BSL_SCENARIO';
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
        let flag, vLoop, resUrl;
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

        let vFromDate = "2022-10-01T00:00:00";//new Date(request.data.FROMDATE).toISOString().split('Z')[0];
        let vToDate = "2022-10-31T00:00:00";//new Date(request.data.TODATE).toISOString().split('Z')[0];
        let vNextMonthDate = GenF.addMonths("2022-10-01", 1).toISOString().split('Z')[0];
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
            let req = await service.tx(req).get(resUrl);
            flag = '';

            for (let i in req) {
                let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
                let vScenario = 'BSL_SCENARIO';
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
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        console.log(liParaValue);
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "PRODUCT";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "PRODUCTTrans";
        console.log(lData);
        console.log(lEntity);
        console.log(liParaValue[0]);
        let oReq = {
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

        const liComp = await cds.run(
            `
         SELECT DISTINCT PRODUCT_ID,
                LOCATION_ID,
                COMPONENT
           FROM "CP_BOMHEADER"
           WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
           ORDER BY COMPONENT`);

        for (i = 0; i < limasterprod.length; i++) {
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
            // BOM Components
            for (iComp = 0; iComp < liComp.length; iComp++) {
                if (liComp[iComp].PRODUCT_ID === limasterprod[i].PRODUCT_ID &&
                    liComp[iComp].LOCATION_ID === limasterprod[i].LOCATION_ID) {
                    vmasterProd = {
                        "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                        "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                        "PRDID": liComp[iComp].COMPONENT,
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
        let Keys = ['PRDID'];
        oReq.masterProd = GenF.removeDuplicate(oReq.masterProd, Keys);
        // console.log(oReq.masterProd);
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR,PRDSERIES",
            "DoCommit": true
            // "NavVCPPRODUCT": oReq.masterProd
        }
        oEntry[lData] = oReq.masterProd;
        // req.headers['Application-Interface-Key'] = vAIRKey;
        await servicePost.tx(req).post(lEntity, oEntry);
        // await servicePost.tx(req).post("/VCPPRODUCTTrans", oEntry);
        let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE+ "' &P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl);
        // try {
        //     // let vResponse = await servicePost.tx(req).get(resUrl);
        //     flag = 'X';
        // }
        // catch (error) {

        // }

    });
    // Create Locations in IBP
    this.on("createIBPLocation", async (req) => {
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,LOCDESCR",
            "DoCommit": true,
            "NavVCPLOCATION": oReq.newLoc
        }
        await servicePost.tx(req).post("/VCPLOCATIONTrans", oEntry);
        let resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create customer group in IBP
    this.on("createIBPCustomer", async (req) => {
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "CUSTID,CUSTDESCR",
            "DoCommit": true,
            "NavVCPCUSTOMER": oReq.cust
        }
        await servicePost.tx(req).post("/VCPCUSTOMERTrans", oEntry);
        let resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create customer group in IBP
    this.on("createIBPCIR", async (req) => {
        let oReq = {
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

            let vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
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
        let resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_Transactionid='" + vTransID + "'";
        return await service.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create class in IBP
    this.on("createIBPClass", async (req) => {
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCCHAR,VCCHARGROUP,VCCHARNAME,VCCHARVALUE,VCCHARVALUENAME,VCCLASS,VCCLASSNAME,VCCHARDESC,VCCHARVALUEDESC,VCCLASSDESC",
            "DoCommit": true,
            "NavVCPCLASS": oReq.class
        }
        await servicePost.tx(req).post("/VCPCLASSTrans", oEntry);
        let resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        try {

            return await servicePost.tx(req).get(resUrl)
        } catch (error) {

        }
        // GetExportResult
    });
    // Actual Component Demand:
    this.on("createActCompDemand", async (req) => {

        let oReq = {
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
            SELECT DISTINCT "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "ACTUALCOMPONENTDEMAND",
                    "COMPONENT"
                    FROM V_IBP_LOCPRODCOMP_ACTDEMD
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'`);

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
        let variable;
        if (req.data.CRITICALKEY === "X") {
            for (i = 0; i < liactcomp.length; i++) {
                for (let j = 0; j < licriticalcomp.length; j++) {
                    if (liactcomp[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcomp[i].PRODUCT_ID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcomp[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcomp[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                        let vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
                        let vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');

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

                let vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');

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
            let vTransID = new Date().getTime().toString();
            let oEntry =
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

            let resUrl = "/getExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
            try {
                return await service.tx(req).get(resUrl);
                flag = 'X';
            }
            catch {

            }
        }
    });
    // Actual Demand:
    this.on("createIBPSalesTrans", async (req) => {

        let oReq = await obibpfucntions.exportSalesCfg(req);
        let vTransID = new Date().getTime().toString();
        let oEntry =
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

        let resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        try {
            return await service.tx(req).get(resUrl);
            flag = 'X';
        }
        catch {

        }



        /////////////////
        // let oReq = {
        //     sales: [],
        // },
        //     vsales;
        // const lisales = await cds.run(
        //     `
        //     SELECT  "WEEK_DATE",
        //             "LOCATION_ID",
        //             "PRODUCT_ID",
        //             "ORD_QTY",
        //             "CUSTOMER_GROUP"
        //             FROM V_IBP_SALESH_ACTDEMD
        //             WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
        //     `);

        // //            AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
        // // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +`'

        // //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        // for (i = 0; i < lisales.length; i++) {
        //     let vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
        //     let vDemd = lisales[i].ORD_QTY.split('.');
        //     vsales = {
        //         "LOCID": lisales[i].LOCATION_ID,
        //         "PRDID": lisales[i].PRODUCT_ID,
        //         "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
        //         "ACTUALDEMAND": vDemd[0],
        //         "PERIODID0_TSTAMP": vWeekDate[0]
        //     };
        //     oReq.sales.push(vsales);

        // }
        // let vTransID = new Date().getTime().toString();
        // let oEntry =
        // {
        //     "Transactionid": vTransID,
        //     "AggregationLevelFieldsString": "LOCID,PRDID,CUSTID,ACTUALDEMAND,PERIODID0_TSTAMP",
        //     "VersionID": "",
        //     "DoCommit": true,
        //     "ScenarioID": "",
        //     "NavVCPQ": oReq.sales
        // }
        // await service.tx(req).post("/VCPQTrans", oEntry);

        // let resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        // let res = await service.tx(req).get(resUrl);
        // return res[0].Value;
    });
    // Actual Demand at VC
    this.on("createIBPSalesConfig", async (req) => {
        let oReq = {
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
            let vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
            let vDemd = lisales[i].ORD_QTY.split('.');
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,VCCHAR,VCCHARVALUE,VCCLASS,ACTUALDEMANDVC,CUSTID,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavSBPVCP": oReq.sales
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);

        let resUrl = "/getExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        let res = await service.tx(req).get(resUrl);
        return res[0].Value;

    });
    // Actual Demand at VC
    this.on("createComponentReq", async (req) => {
        let oReq = {
            actcompreq: [],
        },
            vactcompreq;
        // const liactcompreq = await cds.run(  //V_COMP_REQ
        //     `
        //     SELECT DISTINCT "WEEK_DATE",
        //             "LOCATION_ID",
        //             "PRODUCT_ID",
        //             "COMPONENT",
        //             "COMPCIR_QTY"
        //             FROM CP_ASSEMBLY_REQ
        //             WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
        //                AND REF_PRODID = '`+ req.data.PRODUCT_ID + `' AND WEEK_DATE >= '2022-10-17' AND WEEK_DATE <= '2023-09-04' AND COMPCIR_QTY >= 0`);

        // for (i = 0; i < liactcompreq.length; i++) {
        //     let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
        //     let vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);
        //     vactcompreq = {
        //         "LOCID": liactcompreq[i].LOCATION_ID,
        //         "PRDID": liactcompreq[i].PRODUCT_ID,
        //         "PRDFR": liactcompreq[i].COMPONENT,
        //         "COMPONENTREQUIREMENTQTY": vDemd.toString(),
        //         "PERIODID0_TSTAMP": vWeekDate[0]
        //     };
        //     oReq.actcompreq.push(vactcompreq);

        // }
        const liactcompreq = await cds.run(
            `
            SELECT DISTINCT "WEEK_DATE",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "COMPONENT",
                    "REF_PRODID",
                    "COMPCIR_QTY"
                    FROM CP_ASSEMBLY_REQ
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                       AND REF_PRODID = '`+ req.data.PRODUCT_ID +
            `' AND WEEK_DATE >= '2022-10-17' AND WEEK_DATE <= '2023-09-04' AND COMPCIR_QTY >= 0`);

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
                for (let j = 0; j < licriticalcomp.length; j++) {
                    if (liactcompreq[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcompreq[i].REF_PRODID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcompreq[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcompreq[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                        let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                        let vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);

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
                let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "Transactionid": vTransID,
            "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID0_TSTAMP",
            "VersionID": "",
            "DoCommit": true,
            "ScenarioID": "",
            "NavSBPVCP": oReq.actcompreq
        }
        await service.tx(req).post("/SBPVCPTrans", oEntry);

        let resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
        let res = await service.tx(req).get(resUrl);
        return res[0].Value;

    });
    // Create Locations in IBP
    this.on("createIBPLocProd", async (req) => {
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,PRDID,PLANNINGSTRGY,PLUNITID,PROCUREMENTTYPE,VCLOTSIZE",
            "DoCommit": true,
            "NavVCPLOCATIONPRODUCT": oReq.newLocProd
        }
        await servicePost.tx(req).post("/VCPLOCATIONPRODUCTTrans", oEntry);
        let resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    // Create Locations in IBP
    this.on("exportRestrDetails_fn", async (req) => {
        let vFlag = '';
        let oReq = await obibpfucntions.exportRtrHdrDet(req);
        let vTransID = new Date().getTime().toString();
        let vTransID2 = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCRESTRICTIONID,VCRESTRICTIONDESC,VCRESTRICTIONTYPE",
            "DoCommit": true,
            "NavVCPRESTRICTION": oReq.rtrhdr
        }
        let oEntry2 =
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
        let resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='" + vTransID2 + "'";
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
    //Component Requirement Qty 
    /***************************************************************************/
    //////////////////////// Services for CF/////////////////////////////////////
    /**************************************************************************/
    // Master data products to IBP
    this.on("exportIBPMasterProd", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "PRODUCT";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "PRODUCTTrans";

        let oReq = {
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
                    PROD_DESC,
                    REF_PRODID
               FROM "CP_PARTIALPROD_INTRO"
               WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
               ORDER BY REF_PRODID`);

        const liComp = await cds.run(
            `
             SELECT DISTINCT PRODUCT_ID,
                    LOCATION_ID,
                    COMPONENT
               FROM "CP_BOMHEADER"
               WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
               ORDER BY COMPONENT`);

        for (i = 0; i < limasterprod.length; i++) {
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
            // BOM Components
            for (iComp = 0; iComp < liComp.length; iComp++) {
                if (liComp[iComp].PRODUCT_ID === limasterprod[i].PRODUCT_ID &&
                    liComp[iComp].LOCATION_ID === limasterprod[i].LOCATION_ID) {
                    vmasterProd = {
                        "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                        "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                        "PRDID": liComp[iComp].COMPONENT,
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
        let Keys = ['PRDID'];
        oReq.masterProd = GenF.removeDuplicate(oReq.masterProd, Keys);

        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR,PRDSERIES",
            "DoCommit": true
        }
        oEntry[lData] = oReq.masterProd;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            GenF.jobSchMessage('X', "Export of Product is successful ", req);
        }
        else {
            GenF.jobSchMessage('', "Export of Product is failed", req);
        }

        // GetExportResult
    });
    // Create Locations in IBP
    this.on("exportIBPLocation", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "LOCATION";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "LOCATIONTrans";
        let oReq = {
            newLoc: [],
        },
            vNewLoc, flag = '';

        const linewloc = await cds.run(
            `
            SELECT "LOCATION_ID",
                   "LOCATION_DESC"
                   FROM "CP_LOCATION" `);

        for (i = 0; i < linewloc.length; i++) {
            vNewLoc = {
                "LOCID": linewloc[i].LOCATION_ID,
                "LOCDESCR": linewloc[i].LOCATION_DESC,
            };
            oReq.newLoc.push(vNewLoc);

        }
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,LOCDESCR",
            "DoCommit": true
        }
        oEntry[lData] = oReq.newLoc;

        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            GenF.jobSchMessage('X', "Export of Location is successful ", req);
        }
        else {
            GenF.jobSchMessage('', "Export of Location is failed", req);
        }
    });
    // Create Locations in IBP
    this.on("exportIBPLocProd", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "LOCATIONPRODUCT";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "LOCATIONPRODUCTTrans";
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,PRDID,PLANNINGSTRGY,PLUNITID,PROCUREMENTTYPE,VCLOTSIZE",
            "DoCommit": true
        }
        oEntry[lData] = oReq.newLocProd;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            GenF.jobSchMessage('X', "Export of Location - Product is successful ", req);
        }
        else {
            GenF.jobSchMessage('', "Export of Location - Product is failed", req);
        }
    });
    // Create customer group in IBP
    this.on("exportIBPCustomer", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "CUSTOMER";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "CUSTOMERTrans";
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "CUSTID,CUSTDESCR",
            "DoCommit": true
        }
        oEntry[lData] = oReq.cust;

        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let aResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        if (flag === 'X') {
            GenF.jobSchMessage('X', "Export of Customer group is successful ", req);
        }
        else {
            GenF.jobSchMessage('', "Export of Customer group is failed", req);
        }
    });
    // Create class in IBP
    this.on("exportIBPClass", async (req) => {
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "CLASS";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "CLASSTrans";
        let oReq = {
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
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCCHAR,VCCHARGROUP,VCCHARNAME,VCCHARVALUE,VCCHARVALUENAME,VCCLASS,VCCLASSNAME,VCCHARDESC,VCCHARVALUEDESC,VCCLASSDESC",
            "DoCommit": true
        }
        oEntry[lData] = oReq.class;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            aResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }

        if (flag === 'X') {
            GenF.jobSchMessage('X', "Export of class and charateristics is successful ", req);
        }
        else {
            GenF.jobSchMessage('', "Export of class and charateristics is failed", req);
        }
    });
    // Create class in IBP
    this.on("exportIBPSalesTrans", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "SBPVCP";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "SBPVCPTrans";
        let oReq = {
            sales: [],
        },
            vsales, flag = '', lMessage = '';
        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting Sales History and Configurations";
        let res = req._.req.res;
        let lilocProdReq = JSON.parse(req.data.LocProdData);
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
            const objCatFn = new Catservicefn();
            const lilocProdT = await objCatFn.getAllProducts(lsData);
            lsData = {};
            const litemp = JSON.stringify(lilocProdT);
            lilocProd = JSON.parse(litemp);
        }
        else {
            lilocProd = JSON.parse(req.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        for (let i = 0; i < lilocProd.length; i++) {
            lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
            const lisales = await cds.run(
                `
                    SELECT  DISTINCT "WEEK_DATE",
                            "LOCATION_ID",
                            "PRODUCT_ID",
                            "ORD_QTY",
                            "CUSTOMER_GROUP"
                            FROM V_IBP_SALESH_ACTDEMD
                            WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                               AND PRODUCT_ID = '`+ lsData.PRODUCT_ID +
                `'`);
            for (i = 0; i < lisales.length; i++) {
                let vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = lisales[i].ORD_QTY.split('.');
                vsales = {
                    "LOCID": lisales[i].LOCATION_ID,
                    "PRDID": lisales[i].PRODUCT_ID,
                    "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
                    "ACTUALDEMAND": vDemd[0],
                    "PERIODID0_TSTAMP": vWeekDate[0]
                };
                oReq.sales.push(vsales);

            }
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,CUSTID,ACTUALDEMAND,PERIODID0_TSTAMP",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": ""
            }
            oEntry[lData] = oReq.sales
            try {
                await service.tx(req).post(lEntity, oEntry);
                flag = 'S';
            }
            catch {
                console.log("Unable to send Actual demand at VC");
            }
            // Once Sales History is successfull , send sales Config . Actual demand at VC
            if (flag === 'S') {
                let oReqCfg = await obibpfucntions.exportSalesCfg(lsData);
                let vTransID = new Date().getTime().toString();
                let oEntryCfg =
                {
                    "Transactionid": vTransID,
                    "AggregationLevelFieldsString": "LOCID,PRDID,VCCHAR,VCCHARVALUE,VCCLASS,ACTUALDEMANDVC,CUSTID,PERIODID0_TSTAMP",
                    "VersionID": "",
                    "DoCommit": true,
                    "ScenarioID": ""
                }
                oEntryCfg[lData] = oReqCfg.sales;
                try {
                    await service.tx(req).post(lEntity, oEntryCfg);
                    flag = 'X';
                    lMessage = lMessage + ' ' + 'Export of Sales History and Configuration export is successful for product:' + lsData.PRODUCT_ID;

                }
                catch {
                    lMessage = lMessage + ' ' + 'Export of Sales History and Configuration export is failed for product:' + lsData.PRODUCT_ID;
                }
            }
        }
        GenF.jobSchMessage('X', lMessage, req);
        // GetExportResult
    });

    // Actual Component Demand:
    this.on("exportActCompDemand", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "SBPVCP";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "SBPVCPTrans";

        let oReq = {
            actcomp: [],
        },
            vactcomp, lMessage = '';
        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting Sales History and Configurations";
        let res = req._.req.res;
        let lilocProdReq = JSON.parse(req.data.LocProdData);
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
            const objCatFn = new Catservicefn();
            const lilocProdT = await objCatFn.getAllProducts(lsData);
            lsData = {};
            const litemp = JSON.stringify(lilocProdT);
            lilocProd = JSON.parse(litemp);
        }
        else {
            lilocProd = JSON.parse(req.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        // Fetch History period from Configuration table
        const lsSales = await GenF.getParameterValue(lilocProd[0].LOCATION_ID, 4);
        console.log(lsSales);
        let vFromDate = new Date();
        console.log(vFromDate);
        let vToDate = new Date().toISOString().split('Z')[0].split('T')[0];
        console.log(vToDate);
        vFromDate.setDate(vFromDate.getDate() - (parseInt(lsSales) * 7));
        console.log(vFromDate);
        vFromDate = vFromDate.toISOString().split('Z')[0].split('T')[0];
        console.log(vFromDate);

        for (let i = 0; i < lilocProd.length; i++) {
            lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
            lsData.CRITICALKEY = lilocProd[i].CRITICALKEY;
            const liactcomp = await cds.run(
                `
                SELECT DISTINCT "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "ACTUALCOMPONENTDEMAND",
                        "COMPONENT"
                        FROM V_IBP_LOCPRODCOMP_ACTDEMD
                        WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                           AND PRODUCT_ID = '`+ lsData.PRODUCT_ID +
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
                            WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                              AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `'                               
                              AND CRITICALKEY = '` + lsData.CRITICALKEY + `'`);
            if (lsData.CRITICALKEY === "X") {
                for (i = 0; i < liactcomp.length; i++) {
                    for (let j = 0; j < licriticalcomp.length; j++) {
                        if (liactcomp[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                            liactcomp[i].PRODUCT_ID === licriticalcomp[j].PRODUCT_ID &&
                            //liactcomp[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                            liactcomp[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                            let vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
                            let vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');

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
                    let vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
                    let vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');
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
                let vTransID = new Date().getTime().toString();
                let oEntry =
                {
                    "Transactionid": vTransID,
                    "AggregationLevelFieldsString": "LOCID,PRDID,ACTUALCOMPONENTDEMAND,PERIODID0_TSTAMP,PRDFR",
                    "VersionID": "",
                    "DoCommit": true,
                    "ScenarioID": ""
                }
                oEntry[lData] = oReq.actcomp;
                try {
                    await service.tx(req).post(lEntity, oEntry);
                    let resUrl = "/getExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
                    await service.tx(req).get(resUrl);
                    flag = 'X';
                    lMessage = lMessage + ' ' + 'Export of Actual Component Demand is successfull for product:' + lsData.PRODUCT_ID;
                }
                catch {
                    lMessage = lMessage + ' ' + 'Export of Actual Component Demand failed for product:' + lsData.PRODUCT_ID;
                }
            }
            else {
                lMessage = lMessage + ' ' + 'No Actual Component Demand exists on Crtical components for product:' + lsData.PRODUCT_ID;
            }
        }
        GenF.jobSchMessage('X', lMessage, req);
    });

    // Component requirement Qty
    this.on("exportComponentReq", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "SBPVCP";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "SBPVCPTrans";
        let oReq = {
            actcompreq: [],
        },
            vactcompreq, lMessage = '';
        const liactcompreq = await cds.run(
            `
                SELECT DISTINCT "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "COMPONENT",
                        "REF_PRODID",
                        "COMPCIR_QTY"
                        FROM CP_ASSEMBLY_REQ
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND REF_PRODID = '`+ req.data.PRODUCT_ID +
            `' AND WEEK_DATE >= '` + req.data.FROMDATE +
            `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                           AND COMPCIR_QTY >= 0`);
        console.log(liactcompreq.length);


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
        console.log(licriticalcomp.length);
        console.log(licriticalcomp);

        if (req.data.CRITICALKEY === "X") {
            for (i = 0; i < liactcompreq.length; i++) {
                for (let j = 0; j < licriticalcomp.length; j++) {
                    if (liactcompreq[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcompreq[i].REF_PRODID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcompreq[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcompreq[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                        let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                        let vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);

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
            console.log(oReq.actcompreq.length);
            console.log(oReq.actcompreq);

        } else {
            for (i = 0; i < liactcompreq.length; i++) {
                let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = parseFloat(liactcompreq[i].COMPCIR_QTY).toFixed(2);
                vactcompreq = {
                    "LOCID": liactcompreq[i].LOCATION_ID,
                    "PRDID": liactcompreq[i].PRODUCT_ID,
                    "PRDFR": liactcompreq[i].COMPONENT,
                    "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                    "PERIODID0_TSTAMP": vWeekDate[0]
                };
                oReq.actcompreq.push(vactcompreq);

            }
            console.log(oReq.actcompreq.length);
            console.log(oReq.actcompreq);
        }

        if (oReq.actcompreq) {
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID0_TSTAMP",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": ""
            }
            oEntry[lData] = oReq.actcompreq;
            try {
                await service.tx(req).post(lEntity, oEntry);
                //let resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
                let resUrl = "/getExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
                await service.tx(req).get(resUrl);
                flag = 'X';
            }
            catch {

            }
            if (flag === 'X') {
                lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity is successful for product:' + req.data.PRODUCT_ID;
            } else {
                lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity failed for product:' + req.data.PRODUCT_ID;
            }
        }
        else {
            lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity failed as no critical Assemblies exists for product:' + req.data.PRODUCT_ID;
        }
        GenF.jobSchMessage('X', lMessage, req);

    });
    //// Future Demand Qty
    this.on("generateFDemandQty", async (request) => {
        // Get IBP planning area
        let lsValue = await SELECT.one
            .from("CP_PARAMETER_VALUES")
            .columns("VALUE")
            .where(`PARAMETER_ID = ${parseInt(8)}`);

        let flag, lMessage = '';
        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing IBP Future Demand and Characteristic Plan";
        let res = request._.req.res;
        let lilocProdReq = JSON.parse(request.data.LocProdData);
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
            const objCatFn = new Catservicefn();
            const lilocProdT = await objCatFn.getAllProducts(lsData);
            lsData = {};
            const litemp = JSON.stringify(lilocProdT);
            lilocProd = JSON.parse(litemp);
        }
        else {
            lilocProd = JSON.parse(request.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        for (let iloc = 0; iloc < lilocProd.length; iloc++) {
            lsData.LOCATION_ID = lilocProd[iloc].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[iloc].PRODUCT_ID;
            let resUrl = "/" + lsValue + "?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "'and UOMTOID eq 'EA'";

            // req.headers['Application-Interface-Key'] = vAIRKey;
            let req = await service.tx(request).get(resUrl);
            // if(req.length > 0){
            const vDelDate = new Date();
            const vDateDeld = vDelDate.toISOString().split('T')[0];
            try {
                await DELETE.from('CP_IBP_FUTUREDEMAND')
                    .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                            AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
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
            for (let i in req) {
                let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP);
                let vScenario = 'BSL_SCENARIO';
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
                let resUrlFplan;
                const dateJSONToEDM = jsonDate => {
                    const content = /\d+/.exec(String(jsonDate));
                    const timestamp = content ? Number(content[0]) : 0;
                    const date = new Date(timestamp);
                    const string = date.toISOString();
                    return string;
                };

                resUrlFplan = "/" + lsValue + "?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";

                let req = await service.tx(request).get(resUrlFplan);
                const vDelDate = new Date();
                const vDateDel = vDelDate.toISOString().split('T')[0];
                try {
                    await DELETE.from('CP_IBP_FCHARPLAN')
                        .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                            AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                            AND WEEK_DATE    < '${vDateDel}'`);
                }
                catch (e) {
                    //Do nothing
                }
                for (let i in req) {
                    let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP).split('T')[0];
                    let vScenario = 'BSL_SCENARIO';
                    let vManualOpt = '0.0';
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
                            "'" + req[i].FINALDEMANDVC + "'" + "," +
                            "'" + vManualOpt + "'" + ')';// + ' WITH PRIMARY KEY';
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
            if (flag === 'S') {
                lMessage = lMessage + ' ' + "Import of IBP Demand and Future char.plan data is successfull for product" + lsData.PRODUCT_ID;
            } else {
                lMessage = lMessage + ' ' + "Import of IBP Demand and Future char.plan data has failed for product" + lsData.PRODUCT_ID;
            }
        }
        GenF.jobSchMessage('X', lMessage, request);
    });
    // Generate char plan
    this.on("exportIBPCIR", async (request) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "SBPVCP";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "SBPVCPTrans";
        let oReq = {
            cir: [],
        },
            vCIR;
        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting CIR to IBP";
        let res = request._.req.res;
        let lilocProdReq = JSON.parse(request.data.LocProdData);
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
            const objCatFn = new Catservicefn();
            const lilocProdT = await objCatFn.getAllProducts(lsData);
            lsData = {};
            const litemp = JSON.stringify(lilocProdT);
            lilocProd = JSON.parse(litemp);
        }
        else {
            lilocProd = JSON.parse(request.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        for (let iloc = 0; iloc < lilocProd.length; iloc++) {
            lsData.LOCATION_ID = lilocProd[iloc].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[iloc].PRODUCT_ID;
            const licir = await cds.run(
                `
                SELECT *
                   FROM "V_CIRTOIBP" 
                   WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                              AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `'`);

            //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
            for (let i = 0; i < licir.length; i++) {

                let vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
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
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,CUSTID,CIRQTY,PERIODID4_TSTAMP",
                "DoCommit": true
            }
            oEntry[lData] = oReq.cir;
            try {
                await service.tx(request).post(lEntity, oEntry);
                flag = 'X';
            }
            catch (err) {
                console.log(err);
                flag = ' ';
            }

            if (flag === 'X') {
                lMessage = lMessage + ' ' + "Export of CIR to IBP is successful for product" + lsData.PRODUCT_ID;
            } else {
                lMessage = lMessage + ' ' + "Export of CIR to IBP has failed for product" + lsData.PRODUCT_ID;
            }

            GenF.jobSchMessage('X', lMessage, request);
        }
    });
    // Create Locations in IBP
    this.on("exportRestrDetails", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "RESTRICTION";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "RESTRICTIONTrans";
        let lEntityLoc = "/" + liParaValue[1].VALUE.toString() + "LOCRESTRICTIONTrans";
        let vFlag = '';

        await GenF.logMessage(req, `Started exporting Restriction header`);
        let oReq = await obibpfucntions.exportRtrHdrDet(req);
        let vTransID = new Date().getTime().toString();
        let vTransID2 = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCRESTRICTIONID,VCRESTRICTIONDESC,VCRESTRICTIONTYPE",
            "DoCommit": true
        }
        oEntry[lData] = oReq.rtrhdr;
        let oEntry2 =
        {
            "TransactionID": vTransID2,
            "RequestedAttributes": "LOCID,VCRESTRICTIONID,VCPLACEHOLDER",
            "DoCommit": true
        }
        oEntry2[lData] = oReq.locrtr;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            await servicePost.tx(req).post(lEntityLoc, oEntry2);
            vFlag = 'S';
        }
        catch (e) {
            vFlag = '';
        }
        if (vFlag === 'S') {
            GenF.jobSchMessage('X', "Export Restriction header details is successful ", req);
        }
        else {
            GenF.jobSchMessage('', "Export Restriction header details has failed", req);
        }
    });
    this.on("exportMktAuth", async (req) => {

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "SBPVCP";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "SBPVCPTrans";
        let oReq = {
            mktauth: [],
        },
            vMktauth, vFlag = '', lMessage = '';

        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting Market authorization";
        let res = req._.req.res;
        let lilocProdReq = JSON.parse(req.data.LocProdData);
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
            const objCatFn = new Catservicefn();
            const lilocProdT = await objCatFn.getAllProducts(lsData);
            lsData = {};
            const litemp = JSON.stringify(lilocProdT);
            lilocProd = JSON.parse(litemp);
        }
        else {
            lilocProd = JSON.parse(req.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        for (let i = 0; i < lilocProd.length; i++) {
            lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
            const limkauth = await cds.run(
                `
                SELECT CP_MARKETAUTH_CFG."WEEK_DATE",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       V_CHARVAL."CLASS_NUM",
                       CP_MARKETAUTH_CFG."CHAR_NUM",
                       CP_MARKETAUTH_CFG."CHARVAL_NUM",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       CP_MARKETAUTH_CFG."OPT_PERCENT",
                       CP_MARKETAUTH_CFG."VERSION",
                       CP_MARKETAUTH_CFG."SCENARIO"
                    FROM CP_MARKETAUTH_CFG
              INNER JOIN V_CHARVAL
                      ON CP_MARKETAUTH_CFG.CHAR_NUM  = V_CHARVAL.CHAR_NUM
                     AND CP_MARKETAUTH_CFG.CHARVAL_NUM  = V_CHARVAL.CHARVAL_NUM
                   WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                     AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `' 
            `);
            for (i = 0; i < limkauth.length; i++) {
                let vDemd;
                let vWeekDate = new Date(limkauth[i].WEEK_DATE).toISOString().split('Z');
                // let vOpt = ((parseFloat(limkauth[i].OPT_PERCENT)/100)).toString();

                let vOpt = limkauth[i].OPT_PERCENT.toString();
                let vSrch = vOpt.search(".");
                if (vSrch > 0) {
                    vDemd = vOpt.split('.')[0];
                }
                else {
                    vDemd = vOpt;
                }
                vDemd = parseInt(vDemd) / 100;
                // console.log(vWeekDate);
                // console.log(vDemd);
                vMktauth = {
                    "LOCID": limkauth[i].LOCATION_ID,
                    "PRDID": limkauth[i].PRODUCT_ID,
                    "VCCHAR": limkauth[i].CHAR_NUM,
                    "VCCHARVALUE": limkauth[i].CHARVAL_NUM,
                    "VCCLASS": limkauth[i].CLASS_NUM,
                    "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
                    "PERIODID4_TSTAMP": vWeekDate[0],
                    // "VERSIONID": limkauth[i].VERSION,
                    // "SCENARIOID": limkauth[i].SCENARIO,
                    "MARKETAUTHORIZATION": vDemd.toString()
                };
                // console.log(vMktauth);
                oReq.mktauth.push(vMktauth);

            }
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "PERIODID4_TSTAMP,VCCHAR,VCCHARVALUE,VCCLASS,CUSTID,LOCID,PRDID,MARKETAUTHORIZATION",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": ""
            }
            oEntry[lData] = oReq.mktauth;

            try {
                await service.tx(req).post(lEntity, oEntry);
                lMessage = lMessage + ' ' + "Export of Market authorization is successfull for product" + lsData.PRODUCT_ID;
                vFlag = 'S';
            }
            catch (error) {
                vFlag = '';
                lMessage = lMessage + ' ' + "Export of Market authorization has failed for product" + lsData.PRODUCT_ID;
            }
        }
        GenF.jobSchMessage('X', lMessage, req);
    });
    this.on("generateMarketAuth", async (request) => {
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "SBPVCP";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "SBPVCPTrans";
        let flag, lMessage = '';

        // Generating payload for job scheduler logs
        let lVersion, lScenario, vFromDate, vToDate;
        let vScen, resUrl;
        let req;
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing IBP Future Demand and Characteristic Plan";
        let res = request._.req.res;
        let lilocProdReq = JSON.parse(request.data.MARKETDATA);
        // Get Plannng area and Prefix

        // Handle service for both ALL and Selected projects
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
            const objCatFn = new Catservicefn();
            const lilocProdT = await objCatFn.getAllProducts(lsData);
            const litemp = JSON.stringify(lilocProdT);
            lilocProd = JSON.parse(litemp);
        }
        else {
            lilocProd = JSON.parse(request.data.MARKETDATA);
        }
        // Acknowledge Job scheduler for the inputs selected
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });

        lsData = {};

        // Fetch OPtion percentages for a location product and weekDate
        for (let iloc = 0; iloc < lilocProd.length; iloc++) {
            lsData.LOCATION_ID = lilocProd[iloc].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[iloc].PRODUCT_ID;
            lVersion = lilocProdReq[0].VERSION;
            lScenario = lilocProdReq[0].SCENARIO;
            vFromDate = new Date(lilocProdReq[0].FROMDATE).toISOString().split('Z')[0];
            vToDate = new Date(lilocProdReq[0].TODATE).toISOString().split('Z')[0];
            if (lScenario === '') {
                resUrl = "/" + liParaValue[0].VALUE + "?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            }
            else {
                resUrl = "/" + liParaValue[0].VALUE + "?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and SCENARIOID eq '" + lScenario + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            }
            // Request Option percentage at Product 
            try {
                req = await service.tx(req).get(resUrl);
            }
            catch (e) {
                lMessage = "Request to IBP failed for the requested inputs: " + lsData.LOCATION_ID + "," + lsData.PRODUCT_ID + "," + lVersion + "," + lScenario;
            }
            // Delete previous records from current date
            const vDelDate = new Date();
            const vDateDeld = vDelDate.toISOString().split('T')[0];
            try {
                await DELETE.from('CP_IBP_FUTUREDEMAND')
                    .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                            AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
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
            for (let i in req) {
                let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP);
                if (req[i].SCENARIOID === null) {
                    vScen = ' ';
                }
                // let vScenario = 'BSL_SCENARIO';
                req[i].PERIODID4_TSTAMP = vWeekDate;

                if (vWeekDate >= vDateDeld) {
                    // Delete existing record before updating
                    await cds.run(
                        `DELETE FROM "CP_IBP_FUTUREDEMAND" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                          AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                          AND "VERSION" = '` + req[i].VERSIONID + `'
                                                          AND "SCENARIO" = '` + vScen + `'
                                                          AND "WEEK_DATE" = '` + vWeekDate + `'`
                    );
                    let modQuery = 'INSERT INTO "CP_IBP_FUTUREDEMAND" VALUES (' +
                        "'" + req[i].LOCID + "'" + "," +
                        "'" + req[i].PRDID + "'" + "," +
                        "'" + req[i].VERSIONID + "'" + "," +
                        "'" + vScen + "'" + "," +
                        "'" + vWeekDate + "'" + "," +
                        "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')';// + ' WITH PRIMARY KEY';
                    try {
                        await cds.run(modQuery);
                        flag = 'D';
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
            //  Update Charactertic plan once demand is updated from IBP
            if (flag === 'D') {
                req = '';
                flag = '';
                let resUrlFplan;
                const dateJSONToEDM2 = jsonDate => {
                    const content = /\d+/.exec(String(jsonDate));
                    const timestamp = content ? Number(content[0]) : 0;
                    const date = new Date(timestamp);
                    const string = date.toISOString();
                    return string;
                };
                if (lScenario === '') {
                    resUrlFplan = "/" + liParaValue[0].VALUE + "?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                }
                else {
                    resUrlFplan = "/" + liParaValue[0].VALUE + "?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and SCENARIOID eq '" + lScenario + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                }
                // Request Option percentage at VC
                try {
                    req = await service.tx(request).get(resUrlFplan);
                }
                catch (e) {
                    lMessage = "Request to IBP failed for the requested inputs: " + lsData.LOCATION_ID + "," + lsData.PRODUCT_ID + "," + lVersion + "," + lScenario;
                }
                const vDelDate = new Date();
                const vDateDel = vDelDate.toISOString().split('T')[0];
                try {
                    await DELETE.from('CP_IBP_FCHARPLAN')
                        .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                            AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                            AND WEEK_DATE    < '${vDateDel}'`);
                }
                catch (e) {
                    //Do nothing
                }
                for (let i in req) {
                    let vWeekDate = dateJSONToEDM2(req[i].PERIODID4_TSTAMP).split('T')[0];
                    if (req[i].SCENARIOID === null) {
                        vScen = ' ';
                    }
                    req[i].PERIODID4_TSTAMP = vWeekDate;
                    let vManualOpt = '0.0';
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
                            "'" + req[i].FINALDEMANDVC + "'" + "," +
                            "'" + vManualOpt + "'" + ')';// + ' WITH PRIMARY KEY';
                        try {
                            await cds.run(modQuery);
                            flag = 'S';
                            obgenMktAuth.updateOptPer(req[i].LOCID, req[i].PRDID, vWeekDate, req[i].VERSIONID, vScenario, request);
                        }
                        catch (err) {
                            flag = 'E';
                            console.log(err);
                        }
                    }
                }
            }
            // On success send Market authorizations to IBP
            if (flag === 'S') {
                lsData = {};
                for (let i = 0; i < lilocProd.length; i++) {
                    lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
                    lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
                    const limkauth = await cds.run(
                        `
                SELECT CP_MARKETAUTH_CFG."WEEK_DATE",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       V_CHARVAL."CLASS_NUM",
                       CP_MARKETAUTH_CFG."CHAR_NUM",
                       CP_MARKETAUTH_CFG."CHARVAL_NUM",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       CP_MARKETAUTH_CFG."OPT_PERCENT",
                       CP_MARKETAUTH_CFG."VERSION",
                       CP_MARKETAUTH_CFG."SCENARIO"
                    FROM CP_MARKETAUTH_CFG
              INNER JOIN V_CHARVAL
                      ON CP_MARKETAUTH_CFG.CHAR_NUM  = V_CHARVAL.CHAR_NUM
                     AND CP_MARKETAUTH_CFG.CHARVAL_NUM  = V_CHARVAL.CHARVAL_NUM
                   WHERE LOCATION_ID = '${lsData.LOCATION_ID}'
                     AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                     AND VERSION = '${lilocProdReq[0].VERSION}'
                     AND SCENARIO = '${lilocProdReq[0].SCENARIO}'
                     AND ( WEEK_DATE > '${lilocProdReq[0].FROMDATE}'
                     AND WEEK_DATE < '${lilocProdReq[0].TODATE}' )
            `);
                    for (imk = 0; imk < limkauth.length; imk++) {
                        let vDemd;
                        let vWeekDate = new Date(limkauth[imk].WEEK_DATE).toISOString().split('Z');

                        let vOpt = limkauth[imk].OPT_PERCENT.toString();
                        let vSrch = vOpt.search(".");
                        if (vSrch > 0) {
                            vDemd = vOpt.split('.')[0];
                        }
                        else {
                            vDemd = vOpt;
                        }
                        vDemd = parseInt(vDemd) / 100;
                        vMktauth = {
                            "LOCID": limkauth[imk].LOCATION_ID,
                            "PRDID": limkauth[imk].PRODUCT_ID,
                            "VCCHAR": limkauth[imk].CHAR_NUM,
                            "VCCHARVALUE": limkauth[imk].CHARVAL_NUM,
                            "VCCLASS": limkauth[imk].CLASS_NUM,
                            "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
                            "PERIODID4_TSTAMP": vWeekDate[0],
                            "MARKETAUTHORIZATION": vDemd.toString()
                        };
                        oReq.mktauth.push(vMktauth);

                    }
                    let vTransID = new Date().getTime().toString();
                    let oEntry =
                    {
                        "Transactionid": vTransID,
                        "AggregationLevelFieldsString": "PERIODID4_TSTAMP,VCCHAR,VCCHARVALUE,VCCLASS,CUSTID,LOCID,PRDID,MARKETAUTHORIZATION",
                        "VersionID": "",
                        "DoCommit": true,
                        "ScenarioID": ""
                    }
                    oEntry[lData] = oReq.mktauth;
                    try {
                        await service.tx(req).post(lEntity, oEntry);
                        lMessage = lMessage + ' ' + "Export of Market authorization is successfull for product" + lsData.PRODUCT_ID;
                    }
                    catch (error) {
                        lMessage = lMessage + ' ' + "Export of Market authorization has failed for product" + lsData.PRODUCT_ID;
                    }
                }
            }
        }
        GenF.jobSchMessage('X', lMessage, request);
    });
    this.on("generateMarketAuthfn", async (request) => {
        // const { SBPVCP } = this.entities;
        // const service = await cds.connect.to('IBPDemandsrv');
        let flag, lMessage = '';
        // Generating payload for job scheduler logs
        let lVersion, lScenario, vFromDate, vToDate;
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing IBP Future Demand and Characteristic Plan";
        // let res = request._.req.res;
        // let lilocProdReq = JSON.parse(request.data.MARKETDATA);

        // if (lilocProdReq[0].PRODUCT_ID === "ALL") {
        //     lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
        //     lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
        //     const objCatFn = new Catservicefn();
        //     const lilocProdT = await objCatFn.getAllProducts(lsData);
        //     // lsData = {};
        //     const litemp = JSON.stringify(lilocProdT);
        //     lilocProd = JSON.parse(litemp);
        // }
        // else {
        //     lilocProd = JSON.parse(request.data.MARKETDATA);
        // }
        // values.push({ id, createtAt, message, lilocProd });
        // res.statusCode = 202;
        // res.send({ values });
        // flag = await obibpfucntions.importFutureDemandcharPlan(lilocProd, req, 'MKTAUTH');
        /////////////////////////////////////////////////////////////////////////////////////
        // let lilocProdReq = JSON.parse(request.data.MARKETDATA);
        lsData = {};
        // for (let iloc = 0; iloc < lilocProd.length; iloc++) {
        lsData.LOCATION_ID = "PL20";//lilocProd[iloc].LOCATION_ID;
        lsData.PRODUCT_ID = "61AEEPI0E119"; //lilocProd[iloc].PRODUCT_ID;
        // lVersion = lilocProdReq[0].VERSION;
        // lScenario = lilocProdReq[0].SCENARIO;
        // vFromDate = new Date(lilocProdReq[0].FROMDATE).toISOString().split('Z')[0];
        // vToDate = new Date(lilocProdReq[0].TODATE).toISOString().split('Z')[0];
        let resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID4_TSTAMP,TOTALDEMANDOUTPUT,UOMTOID,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
        let req = await service.tx(req).get(resUrl);
        // if(req.length > 0){
        const vDelDate = new Date();
        const vDateDeld = vDelDate.toISOString().split('T')[0];
        try {
            await DELETE.from('CP_IBP_FUTUREDEMAND')
                .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                            AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
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
        for (let i in req) {
            let vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP);
            let vScenario = 'BSL_SCENARIO';
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
            let resUrlFplan;
            const dateJSONToEDM2 = jsonDate => {
                const content = /\d+/.exec(String(jsonDate));
                const timestamp = content ? Number(content[0]) : 0;
                const date = new Date(timestamp);
                const string = date.toISOString();
                return string;
            };
            resUrlFplan = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            let req = await service.tx(request).get(resUrlFplan);
            const vDelDate = new Date();
            const vDateDel = vDelDate.toISOString().split('T')[0];
            try {
                await DELETE.from('CP_IBP_FCHARPLAN')
                    .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                            AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                            AND WEEK_DATE    < '${vDateDel}'`);
            }
            catch (e) {
                //Do nothing
            }
            for (let i in req) {
                let vWeekDate = dateJSONToEDM2(req[i].PERIODID4_TSTAMP).split('T')[0];
                let vScenario = 'BSL_SCENARIO';
                req[i].PERIODID4_TSTAMP = vWeekDate;
                let vManual = 0.0;
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
                        "'" + req[i].FINALDEMANDVC + "'" + "," +
                        "'" + vManual + "'" + ')';// + ' WITH PRIMARY KEY';
                    try {
                        await cds.run(modQuery);
                        flag = 'S';
                        // if (vServ === 'MKTAUTH') {
                        obgenMktAuth.updateOptPer(req[i].LOCID, req[i].PRDID, vWeekDate, req[i].VERSIONID, vScenario, request);
                        // }
                    }
                    catch (err) {
                        flag = 'E';
                        console.log(err);
                    }
                }
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////
        if (flag === 'S') {
            lsData = {};
            for (let i = 0; i < lilocProd.length; i++) {
                lsData.LOCATION_ID = "PL20";//lilocProd[i].LOCATION_ID;
                lsData.PRODUCT_ID = "61AEEPI0E119";//lilocProd[i].PRODUCT_ID;
                const limkauth = await cds.run(
                    `
                SELECT CP_MARKETAUTH_CFG."WEEK_DATE",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       V_CHARVAL."CLASS_NUM",
                       CP_MARKETAUTH_CFG."CHAR_NUM",
                       CP_MARKETAUTH_CFG."CHARVAL_NUM",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       CP_MARKETAUTH_CFG."OPT_PERCENT",
                       CP_MARKETAUTH_CFG."VERSION",
                       CP_MARKETAUTH_CFG."SCENARIO"
                    FROM CP_MARKETAUTH_CFG
              INNER JOIN V_CHARVAL
                      ON CP_MARKETAUTH_CFG.CHAR_NUM  = V_CHARVAL.CHAR_NUM
                     AND CP_MARKETAUTH_CFG.CHARVAL_NUM  = V_CHARVAL.CHARVAL_NUM
                   WHERE LOCATION_ID = '${lsData.LOCATION_ID}'
                     AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                             `);
                for (imk = 0; imk < limkauth.length; imk++) {
                    let vDemd;
                    let vWeekDate = new Date(limkauth[imk].WEEK_DATE).toISOString().split('Z');

                    let vOpt = limkauth[imk].OPT_PERCENT.toString();
                    let vSrch = vOpt.search(".");
                    if (vSrch > 0) {
                        vDemd = vOpt.split('.')[0];
                    }
                    else {
                        vDemd = vOpt;
                    }
                    vDemd = parseInt(vDemd) / 100;
                    // console.log(vWeekDate);
                    // console.log(vDemd);
                    vMktauth = {
                        "LOCID": limkauth[imk].LOCATION_ID,
                        "PRDID": limkauth[imk].PRODUCT_ID,
                        "VCCHAR": limkauth[imk].CHAR_NUM,
                        "VCCHARVALUE": limkauth[imk].CHARVAL_NUM,
                        "VCCLASS": limkauth[imk].CLASS_NUM,
                        "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
                        "PERIODID4_TSTAMP": vWeekDate[0],
                        // "VERSIONID": limkauth[i].VERSION,
                        // "SCENARIOID": limkauth[i].SCENARIO,
                        "MARKETAUTHORIZATION": vDemd.toString()
                    };
                    // console.log(vMktauth);
                    oReq.mktauth.push(vMktauth);

                }
                let vTransID = new Date().getTime().toString();
                let oEntry =
                {
                    "Transactionid": vTransID,
                    "AggregationLevelFieldsString": "PERIODID4_TSTAMP,VCCHAR,VCCHARVALUE,VCCLASS,CUSTID,LOCID,PRDID,MARKETAUTHORIZATION",
                    "VersionID": "",
                    "DoCommit": true,
                    "ScenarioID": "",
                    "NavSBPVCP": oReq.mktauth
                }

                // console.log(limkauth.length);

                try {
                    await service.tx(req).post("/SBPVCPTrans", oEntry);
                    lMessage = lMessage + ' ' + "Export of Market authorization is successfull for product" + lsData.PRODUCT_ID;
                }
                catch (error) {
                    lMessage = lMessage + ' ' + "Export of Market authorization has failed for product" + lsData.PRODUCT_ID;
                }
            }
        }
        // }
        GenF.jobSchMessage('X', lMessage, req);
    });
    this.on("importibpversce", async (req) => {
        // Get Planning area and Prefix configurations for IBP
        console.log("Started");
        let liParaValue = await GenF.getIBPParameterValue();
        console.log("liParaValue");
        let flag, lMessage = '';
        console.log("declaration");
        let resUrl = "/" + liParaValue[0].VALUE + "?$select=VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$inlinecount=allpages";
<<<<<<< HEAD
        let req = await service.tx(request).get(resUrl);
           
        if (req.length) {
            await DELETE.from('CP_IBPVERSIONSCENARIO');
        }

        for (let i in req) {

=======
        console.log("RESURL" + resUrl);
        let req1 = await service.tx(req).get(resUrl);
        console.log("req1"+ req1);
           
        if (req1.length) {
            console.log("Delete started");
            // await DELETE.from('CP_IBPVERSIONSCENARIO');
            await cds.run(
                `DELETE FROM "CP_IBPVERSIONSCENARIO" `
            );
            console.log("Delete success");
        }

        for (let i in req1) {
            console.log("For Loop");
>>>>>>> e71dd30691a5ccdf3ec52b2c2c2d73258c149211
            let modQuery = 'INSERT INTO "CP_IBPVERSIONSCENARIO" VALUES (' +
                "'" + req1[i].VERSIONID + "'" + "," +
                "'" + req1[i].SCENARIOID + "'" + "," +
                "'" + req1[i].VERSIONNAME + "'" + "," +
                "'" + req1[i].SCENARIONAME + "'" + ')';
            try {
                console.log("try start");
                await cds.run(modQuery);
                flag = 'S';
                console.log("try End");

            }
            catch (err) {
                console.log("Catch Error");
                console.log(err);
            }

        }

        if (flag === 'S') {
            console.log("Flag S");
            lMessage = "Successfully imported version scenario from IBP";
            console.log(lMessage);
            return "Success";
        } else {
            console.log("Flag E");
            lMessage = "Failed to import version scenario from IBP";
            console.log(lMessage);
            return "Failed";
        }
    });

});