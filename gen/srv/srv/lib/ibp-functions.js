const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const MktAuth = require("./market-auth");
const obgenMktAuth = new MktAuth();
class IBPFunctions {
    constructor() {

     }
    async exportSalesCfg(req) {
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
                        WHERE LOCATION_ID = '`+ req.LOCATION_ID + `'
                           AND PRODUCT_ID = '`+ req.PRODUCT_ID +
            `'`);
        // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +e

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
        return oReq;
    }
    async exportRtrHdrDet(req) {
        var oReq = {
            rtrhdr: [],
            locrtr: []
        },
            vRtrhdr,
            vLocRtr;
        const lirtrhdrdet = await cds.run(
            `
                SELECT 
                "LOCATION_ID",
                "LINE_ID",
                "RESTRICTION",
                "RTR_DESC",
                "RTR_TYPE",
                "VALID_FROM",
                "VALID_TO"
            FROM "CP_RESTRICT_HEADER"
            WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        for (let i = 0; i < lirtrhdrdet.length; i++) {
            vRtrhdr = {
                "VCRESTRICTIONID": lirtrhdrdet[i].RESTRICTION,
                "VCRESTRICTIONDESC": lirtrhdrdet[i].RTR_DESC,
                "VCRESTRICTIONTYPE": ''
            };
            vLocRtr = {
                "LOCID": lirtrhdrdet[i].LOCATION_ID,
                "VCRESTRICTIONID": lirtrhdrdet[i].RESTRICTION,
                "VCPLACEHOLDER": ''
            };
            oReq.rtrhdr.push(vRtrhdr);
            oReq.locrtr.push(vLocRtr);

        }
        return oReq;
    }
    async importFutureDemandcharPlan(request){   //aLocProd, request, vServ) {
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
}

module.exports = IBPFunctions;