const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const MktAuth = require("./market-auth");
const obgenMktAuth = new MktAuth();

class IBPFunctions {
    constructor() {

     }

    async generateFDemandQty(request) {
        let lMessage = '', flag;
        let lVersion, lScenario, vFromDate, vToDate;
        let lilocProdReq = JSON.parse(request.data.MARKETDATA);
        let lsData = {};
        for (let iloc = 0; iloc < aLocProd.length; iloc++) {
            lsData.LOCATION_ID = aLocProd[iloc].LOCATION_ID;//"PL20";//
            lsData.PRODUCT_ID = aLocProd[iloc].PRODUCT_ID;//"61AEAPP0E219";//
            lVersion = lilocProdReq[0].VERSION;//'__BASELINE';//
            lScenario = lilocProdReq[0].SCENARIO;//'BSL_SCENARIO';//
            vFromDate = lilocProdReq[0].FROMDATE;//'2022-11-21'//
            vToDate = lilocProdReq[0].TODATE;//'2022-12-21'// 
            var resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and SCENARIOID eq '" + lScenario + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            try{
            var req = await service.tx(req).get(resUrl);
            }
            catch(e){
                flag = 'T';
            }
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
                const dateJSONToEDM2 = jsonDate => {
                    const content = /\d+/.exec(String(jsonDate));
                    const timestamp = content ? Number(content[0]) : 0;
                    const date = new Date(timestamp);
                    const string = date.toISOString();
                    return string;
                };
                // if (vServ === 'IBP') {
                //     resUrlFplan = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                // }
                // else if (vServ === 'MKTAUTH') {
                resUrlFplan = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and SCENARIOID eq '" + lScenario + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                // }
                try{
                var req = await service.tx(request).get(resUrlFplan);
                }
                catch(e){
                    flag = 'T';
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
                for (var i in req) {
                    var vWeekDate = dateJSONToEDM2(req[i].PERIODID4_TSTAMP).split('T')[0];
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
                            "'" + req[i].FINALDEMANDVC + "'" + "," +
                            "'" + req[i].MANUALOPTION + "'" + ')';// + ' WITH PRIMARY KEY';
                        try {
                            await cds.run(modQuery);
                            flag = 'S';
                            // if (vServ === 'MKTAUTH') {
                            obgenMktAuth.updateOptPer(req[i].LOCID, req[i].PRDID, vWeekDate, req[i].VERSIONID, vScenario);
                            // }
                        }
                        catch (err) {
                            flag = 'E';
                            console.log(err);
                        }
                    }
                }
            }
        }
        return flag;
    }
    async timeseriesfuture(req) {
        let lilocProd = {};
        let lsData = {}, Flag = '';

        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started Future timeseries";
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
        switch (await GenFunctions.getParameterValue(lilocProd[0].LOCATION_ID, 5)) {
            case 'M1':
                res.statusCode = 202;
                res.send({ values });
                for (let i = 0; i < lilocProd.length; i++) {
                    lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
                    lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
                    const obgenTimeseries = new GenTimeseries();
                    await obgenTimeseries.genTimeseriesF(lsData, req, Flag);
                }
                break;
            case 'M2':
                res.statusCode = 202;
                res.send({ values });
                for (let i = 0; i < lilocProd.length; i++) {
                    lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
                    lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
                    const obgenTimeseriesM2 = new GenTimeseriesM2();
                    await obgenTimeseriesM2.genTimeseriesF(lsData, req, Flag);
                }
                break;
        }
        // const obgenTimeseries_rt = new GenTimeseriesRT();
        // await obgenTimeseries_rt.genTimeseriesF_rt(req.data, req);
        
    }
    // async genPredictions(req) {
        
    // }
    // Generate Forecast Order
    async genFullConfigDemand(req) {
        let lilocProd = {};
        let lsData = {};
        let Flag = '';
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started Future timeseries";
        let res = req._.req.res;
        let lilocProdReq = JSON.parse(req.data.LocProdData);
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            // const objCatFn = new Catservicefn();
            // lilocProd = await objCatFn.getAllProducts(req.data);
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
            const obgenTimeseriesM2 = new GenTimeseriesM2();
            await obgenTimeseriesM2.genPrediction(lsData, req, Flag);
        }
        
    }
    // async generateAssemblyReq(req) {

        
    // }

    //exportibpforecastdemand
    async exportIBPCIR(request) { 
          // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[0].VALUE.toString();
        let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
        let oReq = {
            cir: [],
        },
            lMessage = '',
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
                              AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `'
                              AND MODEL_VERSION = 'Active'`);

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
                    "FORECASTORDERQTY": licir[i].CIRQTY.toString(),
                    "PERIODID4_TSTAMP": vWeekDate
                };
                oReq.cir.push(vCIR);
            }
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,CUSTID,FORECASTORDERQTY,PERIODID4_TSTAMP",
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
            // return "S";
            await GenF.jobSchMessage('X', lMessage, request);
        } 
    }

    // exportComponentReq
    async exportassemblyqty(req) {
       // Send Response to Scheduler
        let liJobData = [];
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started export of Component req.";
        let res = req._.req.res;
        const litemp = JSON.stringify(req.data);
        liJobData = JSON.parse(litemp);
        values.push({ id, createtAt, message, liJobData });
        res.statusCode = 202;
        res.send({ values });


        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[0].VALUE.toString();
        let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
        let oReq = {
            actcompreq: [],
        },
            vactcompreq, lMessage = '';
        // let vFromDate = '2022-12-01';
        // let vToDate = '2023-12-20';
        let liactcompreq, licriticalcomp;
        let lMethod = await GenF.getParameterValue(req.data.LOCATION_ID, 5);
        switch (await GenF.getParameterValue(req.data.LOCATION_ID, 5)) {
            case 'M1':
                liactcompreq = await cds.run(
                    `
                        SELECT DISTINCT "WEEK_DATE",
                                "LOCATION_ID",
                                "PRODUCT_ID",
                                "COMPONENT",
                                "COMP_QTY"
                                FROM V_ASSEMBLYREQ
                                WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                                   AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
                    `' AND MODEL_VERSION = 'Active'
                    AND WEEK_DATE >= '` + req.data.FROMDATE +
                    `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                                   AND COMP_QTY >= 0`);
                console.log(liactcompreq.length);
                break;
            case 'M2':
                liactcompreq = await cds.run(
                    `
                SELECT DISTINCT "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "COMPONENT",
                        "REF_PRODID",
                        "COMPCIR_QTY" AS "COMP_QTY"
                        FROM CP_ASSEMBLY_REQ
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND REF_PRODID = '`+ req.data.PRODUCT_ID +
                    `' AND MODEL_VERSION = 'Active'
            AND WEEK_DATE >= '` + req.data.FROMDATE +
                    `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                           AND COMPCIR_QTY >= 0`);
                console.log(liactcompreq.length);

                licriticalcomp = await cds.run(
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
                break;
        }


        if (req.data.CRITICALKEY === "X" && lMethod === 'M2') {
            for (i = 0; i < liactcompreq.length; i++) {
                for (let j = 0; j < licriticalcomp.length; j++) {
                    if (liactcompreq[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcompreq[i].REF_PRODID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcompreq[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcompreq[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                        let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                        let vDemd = parseFloat(liactcompreq[i].COMP_QTY).toFixed(2);

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
            // console.log(oReq.actcompreq.length);
            console.log(oReq.actcompreq);

        } else {
            for (i = 0; i < liactcompreq.length; i++) {
                let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = parseFloat(liactcompreq[i].COMP_QTY).toFixed(2);
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

        if (oReq.actcompreq.length > 0) {
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
        await GenF.jobSchMessage('X', lMessage, req);
        // return lMessage;
    }

    // Publish Forecast orders
    async postCIRQuantitiesToS4(req) {
        const oModel = await cds.connect.to('S4ODataService');
        const objCIR = new CIRService();
        let oCIRData = {};
        oCIRData = await objCIR.getCIRData(req);
        const liCIRQty = oCIRData.liCIRQty;
        const liUniqueId = oCIRData.liUniqueId;
        const aUniqueIdChar = await objCIR.getUniqueIdCharacteristics(req);
        const sCFDestUser = req.data.VALIDUSER;
        // const sLoginUserId = req.headers['x-username'];
        let sLoginUserId = "";
        let aFilteredChar = [], aFilteredCIR = [];
        let sUniqueId = "";
        let oUniqueIdChars = {};
        let aUniqueIdChars = [];
        let oEntry = {};
        sLoginUserId = req.data.USER_ID;
        // if(req.user) {
        //   sLoginUserId = req.user;
        // }
        // if(req.req.rawHeaders[1]) {
        //    sLoginUserId = req.req.rawHeaders[1];
        // }
        console.log(req.req.rawHeaders[1]);
        for (let i = 0; i < liUniqueId.length; i++) {
            // Unique Id Characteristics
            aUniqueIdChars = [];
            aFilteredChar = [];
            sUniqueId = liUniqueId[i].UNIQUE_ID;
            aFilteredChar = aUniqueIdChar.filter(function (aUniqueId) {
                return aUniqueId.UNIQUE_ID == sUniqueId;
            });

            for (let k = 0; k < aFilteredChar.length; k++) {
                oUniqueIdChars = {};
                oUniqueIdChars.UniqueId = (aFilteredChar[k].UNIQUE_ID).toString();
                oUniqueIdChars.Charc = aFilteredChar[k].CHAR_NAME;
                oUniqueIdChars.Value = aFilteredChar[k].CHAR_VALUE;

                aUniqueIdChars.push(oUniqueIdChars);
            }

            // CIR Weekly Quantity 
            aFilteredCIR = [];
            aFilteredCIR = liCIRQty.filter(function (aCIRQty) {
                return aCIRQty.UNIQUE_ID == sUniqueId;
            });

            for (let j = 0; j < aFilteredCIR.length; j++) {
                oEntry = {}
                oEntry.Werks = aFilteredCIR[j].LOCATION_ID;
                oEntry.Matnr = aFilteredCIR[j].REF_PRODID;
                oEntry.CustMaterial = aFilteredCIR[j].PRODUCT_ID;
                oEntry.Quantity = (aFilteredCIR[j].CIR_QTY).toString();
                oEntry.UniqueId = (aFilteredCIR[j].UNIQUE_ID).toString();
                oEntry.Datum = aFilteredCIR[j].WEEK_DATE + "T10:00:00";
                oEntry.Valid_User = sCFDestUser;
                if (sLoginUserId) {
                    oEntry.User_Id = sLoginUserId;
                }
                oEntry.HeaderConfig = aUniqueIdChars;
                try {
                    await oModel.tx(req).post("/headerSet", oEntry);
                }
                catch (e) {
                    console.log(e);
                }

            }

        }
    }
    
}

module.exports = IBPFunctions;