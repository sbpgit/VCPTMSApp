const GenFunctions = require("./gen-functions");
const { v1: uuidv1 } = require('uuid')
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const GenTimeseries = require("./gen-timeseries");
const GenTimeseriesM2 = require("./gen-timeseries-m2");
const GenTimeseriesRT = require("./gen-timeseries-rt");
const SOFunctions = require("./so-function");
const Catservicefn = require("./catservice-function");
const VarConfig = require("./variantconfig");
const AssemblyReq = require("./assembly-req");
const CIRService = require("./cirdata-functions");
const IBPFunc = require("./ibp-functions");
const obibpfucntions = new IBPFunc();
/**
 * 
 * @param {Location} lLocation 
 * @param {Product} lProduct 
 * 
 * */

module.exports = (srv) => {
    
    // const { SBPVCP } = srv.entities;
    // srv.on('READ', SBPVCP, request => {
    //     try {
    //         return service.tx(request).run(request.query);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // });
    // using req.user approach (user attribute - of class cds.User - from the request object)
    srv.on('userInfo', async (req) => {

        const DummyUser = new cds.User;
        // req.user = new DummyUser('dummy')
        //   next()
        console.log(DummyUser);
        return req.user;
    });

    // using the XSUAA API
    srv.on('userInfoUAA', async () => {
        // connect to the XSUAA host
        // Get the XSUAA host URL from service binding

        const xsuaa_bind = JSON.parse(process.env.VCAP_SERVICES).xsuaa[0];
        //console.log(xsuaa_bind);
        const api_def = cds.env.requires[api];
        api_def.credentials.url = xsuaa_bind.credentials.url;
        const xsuaa = await cds.connect.to(api_def);
        // console.log(xsuaa);
        return await xsuaa.get("/userinfo");
    });
    srv.after('READ', 'getLocationtemp', async (data, req) => {
        vUser = req.headers['x-username'];
        // return {
        //     id:         req.user.id,
        //     firstName:  req.req.authInfo.getGivenName(),
        //     lastName:   req.req.authInfo.getFamilyName(),
        //     email:      req.req.authInfo.getEmail()
        //   }
        console.log(req.user.id);

        // console.log(req.authInfo.getGivenName());
        // console.log(req.authInfo.getFamilyName());
        // console.log(req.authInfo.getEmail());

        // console.log(req.headers);
        // const li_roleparam = await cds.run(
        //     `
        //     SELECT * FROM "CP_USER_AUTHOBJ"
        //     WHERE "USER" = '`+ vUser + `'`
        //     // AND PARAMETER = 'LOCATION_ID'`
        // );
        // var cnRs = 0;
        //     return data.map(async data => {
        //         const li_roleparam = await cds.run(
        //             `
        //             SELECT * FROM "V_USERROLE"
        //             WHERE "USER" = '`+vUser+`'
        //             AND "PARAMETER_VAL" = '`+data.LOCATION_ID+`'
        //             AND "PARAMETER" = 'LOCATION_ID'`
        //         );
        //         if(li_roleparam.length === 0){

        //             req.results.splice(cnRs, 1);
        //         }
        //         cr++;
        //       })

        // for (var cnRs = req.results.length - 1; cnRs >= 0; cnRs--) {
        //     for (var cnRL = 0; cnRL < li_roleparam.length; cnRL++) {
        //         if (li_roleparam[cnRL].AUTH_GROUP !== req.results[cnRs].AUTH_GROUP) {
        //             req.results.splice(cnRs, 1);
        //         }
        //     }
        // }
    });
    // Service for weekly component requirements- assembly
    srv.on("getCompReqFWeekly", async (req) => {
        let vDateFrom = req.data.FROMDATE; //"2022-03-04";
        let vDateTo = req.data.TODATE; //"2023-01-03";
        let liCompWeekly = [];
        let lsCompWeekly = {};
        let liDates = [],
            vWeekIndex,
            vCompIndex,
            lsDates = {};
        let columnname = "WEEK";
        let liComp = [];
        let liCompQty;
        switch (await GenFunctions.getParameterValue(req.data.LOCATION_ID, 5)) {
            case 'M1':
                const liasmbcomp = await cds.run(`SELECT * from "CP_ASSEMBLY_COMP" WHERE "LOCATION_ID" = '` +
                    req.data.LOCATION_ID +
                    `'`);

                liCompQty = await cds.run(
                    `
            SELECT * FROM "V_ASMCOMPQTY_CONSD"
            WHERE "LOCATION_ID" = '` +
                    req.data.LOCATION_ID +
                    `'
                 AND "PRODUCT_ID" = '` +
                    req.data.PRODUCT_ID +
                    `' AND "VERSION" = '` +
                    req.data.VERSION +
                    `' AND "SCENARIO" = '` +
                    req.data.SCENARIO +
                    `' AND ( "CAL_DATE" <= '` +
                    vDateTo +
                    `' AND "CAL_DATE" >= '` +
                    vDateFrom +
                    `') AND "MODEL_VERSION" = '` +
                    req.data.MODEL_VERSION +
                    `'
                 ORDER BY 
                      "LOCATION_ID" ASC, 
                      "PRODUCT_ID" ASC,
                      "VERSION" ASC,
                      "SCENARIO" ASC,
                      "COMPONENT" ASC,
                      "CAL_DATE" ASC`
                );
                liComp = await cds.run(
                    `
          SELECT DISTINCT "LOCATION_ID",
                          "PRODUCT_ID",
                          "VERSION",
                          "SCENARIO",
                          "COMPONENT"
          FROM "V_ASMCOMPQTY_CONSD"
          WHERE "LOCATION_ID" = '` +
                    req.data.LOCATION_ID +
                    `' AND "PRODUCT_ID" = '` +
                    req.data.PRODUCT_ID +
                    `' AND "VERSION" = '` +
                    req.data.VERSION +
                    `' AND "SCENARIO" = '` +
                    req.data.SCENARIO +
                    `' AND ( "CAL_DATE" <= '` +
                    vDateTo +
                    `'
                AND "CAL_DATE" >= '` +
                    vDateFrom +
                    `') AND "MODEL_VERSION" = '` +
                    req.data.MODEL_VERSION +
                    `'
               ORDER BY 
                    "LOCATION_ID" ASC, 
                    "PRODUCT_ID" ASC,
                    "VERSION" ASC,
                    "SCENARIO" ASC,
                    "COMPONENT" ASC`
                );
                break;
            case 'M2':
                const liCompQty = await cds.run(
                    `
            SELECT * FROM "V_ASMREQ_PRODCONSD"
            WHERE "LOCATION_ID" = '` +
                    req.data.LOCATION_ID +
                    `'
                 AND "PRODUCT_ID" = '` +
                    req.data.PRODUCT_ID +
                    `' AND "VERSION" = '` +
                    req.data.VERSION +
                    `' AND "SCENARIO" = '` +
                    req.data.SCENARIO +
                    `' AND ( "WEEK_DATE" <= '` +
                    vDateTo +
                    `' AND "WEEK_DATE" >= '` +
                    vDateFrom +
                    `') AND "MODEL_VERSION" = '` +
                    req.data.MODEL_VERSION +
                    `'
                 ORDER BY 
                      "LOCATION_ID" ASC, 
                      "PRODUCT_ID" ASC,
                      "VERSION" ASC,
                      "SCENARIO" ASC,
                      "COMPONENT" ASC,
                      "WEEK_DATE" ASC`
                );
                if (req.data.CRITICALKEY === 'X') {
                    liComp = await cds.run(
                        `
              SELECT DISTINCT "V_ASMREQ_PRODCONSD"."LOCATION_ID",
                               "V_ASMREQ_PRODCONSD"."PRODUCT_ID",
                               "V_ASMREQ_PRODCONSD"."VERSION",
                               "V_ASMREQ_PRODCONSD"."SCENARIO",
                               "V_ASMREQ_PRODCONSD"."ITEM_NUM",
                               "V_ASMREQ_PRODCONSD"."COMPONENT"
              FROM "V_ASMREQ_PRODCONSD"
             INNER JOIN "CP_CRITICAL_COMP"
                ON "V_ASMREQ_PRODCONSD"."LOCATION_ID" = "CP_CRITICAL_COMP"."LOCATION_ID"
               AND "V_ASMREQ_PRODCONSD"."PRODUCT_ID"  = "CP_CRITICAL_COMP"."PRODUCT_ID"
               AND "V_ASMREQ_PRODCONSD"."ITEM_NUM"    = "CP_CRITICAL_COMP"."ITEM_NUM"
             WHERE "V_ASMREQ_PRODCONSD"."LOCATION_ID" = '` +
                        req.data.LOCATION_ID +
                        `' AND "V_ASMREQ_PRODCONSD"."PRODUCT_ID" = '` +
                        req.data.PRODUCT_ID +
                        `' AND "V_ASMREQ_PRODCONSD"."VERSION" = '` +
                        req.data.VERSION +
                        `' AND "V_ASMREQ_PRODCONSD"."SCENARIO" = '` +
                        req.data.SCENARIO +
                        `' AND ( "V_ASMREQ_PRODCONSD"."WEEK_DATE" <= '` +
                        vDateTo +
                        `'
                    AND "V_ASMREQ_PRODCONSD"."WEEK_DATE" >= '` +
                        vDateFrom +
                        `') AND "V_ASMREQ_PRODCONSD"."MODEL_VERSION" = '` +
                        req.data.MODEL_VERSION +
                        `'  AND "CP_CRITICAL_COMP"."CRITICALKEY" = '` +
                        req.data.CRITICALKEY + `'
                   ORDER BY 
                        "LOCATION_ID" ASC, 
                        "PRODUCT_ID" ASC,
                        "VERSION" ASC,
                        "SCENARIO" ASC,
                        "ITEM_NUM" ASC,
                        "COMPONENT" ASC`
                    );
                } else {
                    // const liComp = await cds.run(
                    liComp = await cds.run(
                        `
          SELECT DISTINCT "LOCATION_ID",
                          "PRODUCT_ID",
                          "VERSION",
                          "SCENARIO",
                          "ITEM_NUM",
                          "COMPONENT"
          FROM "V_ASMREQ_PRODCONSD"
          WHERE "LOCATION_ID" = '` +
                        req.data.LOCATION_ID +
                        `' AND "PRODUCT_ID" = '` +
                        req.data.PRODUCT_ID +
                        `' AND "VERSION" = '` +
                        req.data.VERSION +
                        `' AND "SCENARIO" = '` +
                        req.data.SCENARIO +
                        `' AND ( "WEEK_DATE" <= '` +
                        vDateTo +
                        `'
                AND "WEEK_DATE" >= '` +
                        vDateFrom +
                        `') AND "MODEL_VERSION" = '` +
                        req.data.MODEL_VERSION +
                        `'
               ORDER BY 
                    "LOCATION_ID" ASC, 
                    "PRODUCT_ID" ASC,
                    "VERSION" ASC,
                    "SCENARIO" ASC,
                    "ITEM_NUM" ASC,
                    "COMPONENT" ASC`
                    );
                }
                break;
        }
        var vDateSeries = vDateFrom;
        let dDate = new Date(vDateSeries);
        let dDay = dDate.getDay();
        if (dDay === 1) {
            lsDates.CAL_DATE = vDateFrom;
        } else {
            lsDates.CAL_DATE = GenFunctions.getNextMondayCmp(vDateSeries);
        }
        // lsDates.CAL_DATE = GenFunctions.getNextMondayCmp(vDateSeries);
        vDateSeries = lsDates.CAL_DATE;
        liDates.push(lsDates);
        lsDates = {};
        while (vDateSeries <= vDateTo) {
            vDateSeries = GenFunctions.addDays(vDateSeries, 7);

            lsDates.CAL_DATE = vDateSeries;//GenFunctions.getNextSundayCmp(vDateSeries);
            // vDateSeries = lsDates.CAL_DATE;

            liDates.push(lsDates);
            lsDates = {};
        }

        for (let j = 0; j < liComp.length; j++) {
            // Initially set vWeekIndex to j to geneate Week columns
            // vCompIndex is to get Componnent quantity for all dates
            vWeekIndex = 0; //j
            lsCompWeekly.LOCATION_ID = liComp[j].LOCATION_ID;
            lsCompWeekly.PRODUCT_ID = liComp[j].REF_PRODID;
            lsCompWeekly.ITEM_NUM = liComp[j].ITEM_NUM;
            //   lsCompWeekly.ASSEMBLY = liComp[j].COMPONENT;
            lsCompWeekly.COMPONENT = liComp[j].COMPONENT;
            lsCompWeekly.VERSION = liComp[j].VERSION;
            lsCompWeekly.SCENARIO = liComp[j].SCENARIO;
            lsCompWeekly.QTYTYPE = "Normalized";

            for (let i = 0; i < liDates.length; i++) {
                vWeekIndex = vWeekIndex + 1;
                for (vCompIndex = 0; vCompIndex < liCompQty.length; vCompIndex++) {
                    lsCompWeekly[columnname + vWeekIndex] = 0;
                    if (
                        liCompQty[vCompIndex].COMPONENT === lsCompWeekly.COMPONENT &&
                        liCompQty[vCompIndex].WEEK_DATE === liDates[i].CAL_DATE
                    ) {
                        lsCompWeekly.STRUC_NODE = liCompQty[vCompIndex].STRUC_NODE;
                        lsCompWeekly[columnname + vWeekIndex] =
                            liCompQty[vCompIndex].COMPCIR_QTY;
                        break;
                    }
                }
            }
            liCompWeekly.push(GenFunctions.parse(lsCompWeekly));
            lsCompWeekly = {};
        }
        liCompWeekly.sort(GenFunctions.dynamicSortMultiple("STRUC_NODE", "COMPONENT", "ITEM_NUM"));
        return liCompWeekly;
    });

    // Service for weekly component requirements- assembly component
    srv.on("getAsmbCompReqFWeekly", async (req) => {
        let { genAsmbComp } = srv.entities;
        let vDateFrom = req.data.FROMDATE; //"2022-03-04";
        let vDateTo = req.data.TODATE; //"2023-01-03";
        let liCompWeekly = [];
        let lsCompWeekly = {};
        let liDates = [],
            vWeekIndex,
            vCompIndex,
            vDateIndex,
            vComp,
            lsDates = {};
        let columnname = "WEEK";
        const liCompQty = await cds.run(
            `
            SELECT * FROM "V_ASMCOMPQTY_CONSD"  
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
                 AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `' AND "VERSION" = '` +
            req.data.VERSION +
            `' AND "SCENARIO" = '` +
            req.data.SCENARIO +
            `' AND ( "CAL_DATE" <= '` +
            vDateTo +
            `' AND "CAL_DATE" >= '` +
            vDateFrom +
            `') AND "MODEL_VERSION" = '` +
            req.data.MODEL_VERSION +
            `'
                 ORDER BY 
                      "LOCATION_ID" ASC, 
                      "PRODUCT_ID" ASC,
                      "VERSION" ASC,
                      "SCENARIO" ASC,
                      "COMPONENT" ASC,
                      "CAL_DATE" ASC`
        );
        const liComp = await cds.run(
            `
          SELECT DISTINCT "LOCATION_ID",
                          "PRODUCT_ID",
                          "VERSION",
                          "SCENARIO",
                          "COMPONENT"
          FROM "V_ASMCOMPQTY_CONSD"
          WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `' AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `' AND "VERSION" = '` +
            req.data.VERSION +
            `' AND "SCENARIO" = '` +
            req.data.SCENARIO +
            `' AND ( "CAL_DATE" <= '` +
            vDateTo +
            `'
                AND "CAL_DATE" >= '` +
            vDateFrom +
            `') AND "MODEL_VERSION" = '` +
            req.data.MODEL_VERSION +
            `'
               ORDER BY 
                    "LOCATION_ID" ASC, 
                    "PRODUCT_ID" ASC,
                    "VERSION" ASC,
                    "SCENARIO" ASC,
                    "COMPONENT" ASC`
        );
        var vDateSeries = vDateFrom;
        lsDates.CAL_DATE = GenFunctions.getNextMondayCmp(vDateSeries);
        vDateSeries = lsDates.CAL_DATE;
        liDates.push(lsDates);
        lsDates = {};
        while (vDateSeries <= vDateTo) {
            vDateSeries = GenFunctions.addDays(vDateSeries, 7);

            lsDates.CAL_DATE = vDateSeries;//GenFunctions.getNextSundayCmp(vDateSeries);
            //  vDateSeries = lsDates.CAL_DATE;

            liDates.push(lsDates);
            lsDates = {};
        }
        vComp = 0;

        for (let j = 0; j < liComp.length; j++) {
            // Initially set vWeekIndex to j to geneate Week columns
            // vCompIndex is to get Componnent quantity for all dates
            vWeekIndex = 0; //j
            lsCompWeekly.LOCATION_ID = liComp[j].LOCATION_ID;
            lsCompWeekly.PRODUCT_ID = liComp[j].PRODUCT_ID;
            lsCompWeekly.ITEM_NUM = '';
            //   lsCompWeekly.ASSEMBLY = liComp[j].COMPONENT;
            lsCompWeekly.COMPONENT = liComp[j].COMPONENT;
            lsCompWeekly.VERSION = liComp[j].VERSION;
            lsCompWeekly.SCENARIO = liComp[j].SCENARIO;
            lsCompWeekly.QTYTYPE = "Normalized";

            for (let i = 0; i < liDates.length; i++) {
                vWeekIndex = vWeekIndex + 1;
                for (vCompIndex = 0; vCompIndex < liCompQty.length; vCompIndex++) {
                    lsCompWeekly[columnname + vWeekIndex] = 0;
                    if (
                        liCompQty[vCompIndex].COMPONENT === lsCompWeekly.COMPONENT &&
                        liCompQty[vCompIndex].CAL_DATE === liDates[i].CAL_DATE
                    ) {
                        //   lsCompWeekly.STRUC_NODE = liCompQty[vCompIndex].STRUC_NODE;
                        lsCompWeekly[columnname + vWeekIndex] =
                            liCompQty[vCompIndex].COMP_QTY;
                        break;
                    }
                }
            }
            liCompWeekly.push(GenFunctions.parse(lsCompWeekly));
            // lsCompWeekly = {};
            // }
            lsCompWeekly = {};
        }
        liCompWeekly.sort(GenFunctions.dynamicSortMultiple("STRUC_NODE", "COMPONENT", "ITEM_NUM"));
        return liCompWeekly;
    });
    // Create profiles
    srv.on("createProfiles", async (req) => {
        let liProfiles = [];
        let lsprofiles = {};
        let createResults = [];
        let res;
        var responseMessage;
        var datetime = new Date();
        var curDate = datetime.toISOString().slice(0, 10);
        res = req._.req.res;
        // Delete or Insert
        if (req.data.PRF_DESC === "D") {
            lsprofiles.PROFILE = req.data.PROFILE;
            try {
                await cds.delete("CP_PAL_PROFILEMETH", lsprofiles);
                responseMessage = " Deletion successfull";
                createResults.push(responseMessage);
            } catch (e) {
                responseMessage = " Deletion failed";
                createResults.push(responseMessage);
            }
        }
        // Insert
        else {
            lsprofiles.PROFILE = req.data.PROFILE;
            lsprofiles.METHOD = req.data.METHOD;
            lsprofiles.PRF_DESC = req.data.PRF_DESC;
            lsprofiles.CREATED_DATE = curDate;
            lsprofiles.CREATED_BY = req.data.CREATED_BY;
            if (lsprofiles.CREATED_BY === "E") {
                try {
                    await cds.delete("CP_PAL_PROFILEMETH", lsprofiles);
                } catch (e) {
                    //DONOTHING
                }
            }
            lsprofiles.CREATED_BY = " ";
            liProfiles.push(lsprofiles);
            lsprofiles = {};
            try {
                await cds.run(INSERT.into("CP_PAL_PROFILEMETH").entries(liProfiles));
                responseMessage = " Created successfully ";
                createResults.push(responseMessage);
            } catch (e) {
                responseMessage = " Creation failed";
                createResults.push(responseMessage);
            }
        }
        return responseMessage;
        // res.send({ value: createResults });
    });
    // Create profile paramaters
    srv.on("createProfilePara", async (req) => {
        let liProfilesPara = [];
        let lsprofilesPara = {};
        let createResults = [];
        let res;
        var responseMessage;
        var datetime = new Date();
        var curDate = datetime.toISOString().slice(0, 10);
        if (req.data.FLAG === "I" || req.data.FLAG === "E") {
            lsprofilesPara.PROFILE = req.data.PROFILE;
            if (lsprofilesPara.PROFILE !== undefined) {
                lsprofilesPara.METHOD = req.data.METHOD;
                lsprofilesPara.PARA_NAME = req.data.PARA_NAME;
                if (req.data.FLAG === "E") {
                    await cds.delete("CP_PAL_PROFILEMETH_PARA", lsprofilesPara);
                }
                if (req.data.INTVAL === NaN || req.data.INTVAL === 'NaN' || req.data.INTVAL === 'null' || req.data.INTVAL === null) {
                    lsprofilesPara.INTVAL = null;
                }
                else {
                    lsprofilesPara.INTVAL = req.data.INTVAL;
                }
                if (req.data.STRVAL === NaN || req.data.STRVAL === 'NaN' || req.data.STRVAL === 'null' || req.data.STRVAL === null) {
                    lsprofilesPara.STRVAL = null;
                }
                else {
                    lsprofilesPara.STRVAL = req.data.STRVAL;
                }

                if (req.data.DOUBLEVAL === NaN || req.data.DOUBLEVAL === 'NaN' || req.data.DOUBLEVAL === 'null' || req.data.DOUBLEVAL === null) {
                    lsprofilesPara.DOUBLEVAL = null;
                }
                else {
                    lsprofilesPara.DOUBLEVAL = req.data.DOUBLEVAL;
                }
                lsprofilesPara.PARA_DESC = req.data.PARA_DESC;
                lsprofilesPara.PARA_DEP = null;
                lsprofilesPara.CREATED_DATE = curDate;
                lsprofilesPara.CREATED_BY = "";
                liProfilesPara.push(GenFunctions.parse(lsprofilesPara));
            }
            lsprofilesPara = {};
            //   }
            try {
                if (liProfilesPara.length > 0) {
                    await cds.run(
                        INSERT.into("CP_PAL_PROFILEMETH_PARA").entries(liProfilesPara)
                    );
                    responseMessage = " Created successfully ";
                    createResults.push(responseMessage);
                }
            } catch (e) {
                responseMessage = " Creation failed";
                createResults.push(responseMessage);
            }
        } else if (req.data.FLAG === "D") {
            lsprofilesPara.PROFILE = req.data.PROFILE;
            try {
                if (lsprofilesPara.PROFILE !== undefined) {
                    await cds.delete("CP_PAL_PROFILEMETH_PARA", lsprofilesPara);
                    responseMessage = " Deletion successfully ";
                    createResults.push(responseMessage);
                }
            } catch (e) {
                responseMessage = " Deletion failed";
                createResults.push(responseMessage);
            }
        }
        res = req._.req.res;
        return responseMessage;
    });
    // Assign profile sot object dependency
    srv.on("assignProfilesOD", async (req) => {
        let liProfilesOD = [];
        let liProfilesDel = [];
        let lsprofilesOD = {};
        let lsprofilesDel = {};
        let createResults = [];
        let res;
        var responseMessage;
        var datetime = new Date();
        res = req._.req.res;
        const li_bomod = await cds.run(
            `SELECT *
            FROM "V_BOMODCOND"
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
            AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `'
            AND"COMPONENT" = '` +
            req.data.COMPONENT +
            `'`
        );
        for (let i = 0; i < li_bomod.length; i++) {
            lsprofilesOD.PROFILE = req.data.PROFILE;
            if (lsprofilesOD.PROFILE !== undefined || req.data.FLAG === "D") {
                lsprofilesOD.LOCATION_ID = req.data.LOCATION_ID;
                lsprofilesOD.PRODUCT_ID = req.data.PRODUCT_ID;
                lsprofilesOD.COMPONENT = req.data.COMPONENT;
                lsprofilesOD.OBJ_DEP = li_bomod[i].OBJ_DEP;
                lsprofilesOD.OBJ_TYPE = 'OD';
                lsprofilesOD.PROFILE = req.data.PROFILE;
                if (lsprofilesOD.STRUC_NODE !== undefined) {
                    lsprofilesOD.STRUC_NODE = req.data.STRUC_NODE;
                } else {
                    lsprofilesOD.STRUC_NODE = "";
                }
                liProfilesOD.push(GenFunctions.parse(lsprofilesOD));
                // Delete before insert to override
                lsprofilesDel.LOCATION_ID = req.data.LOCATION_ID;
                lsprofilesDel.PRODUCT_ID = req.data.PRODUCT_ID;
                lsprofilesDel.COMPONENT = req.data.COMPONENT;
                liProfilesDel.push(GenFunctions.parse(lsprofilesDel));
                try {
                    await cds.delete("CP_PAL_PROFILEOD", lsprofilesDel);
                    responseMessage = " Deletion successfull ";
                } catch (e) {
                    responseMessage = " Deletion failed";
                }
            }
            lsprofilesOD = {};
        }

        if (req.data.FLAG === "I") {
            try {
                if (liProfilesOD.length > 0) {
                    await cds.run(INSERT.into("CP_PAL_PROFILEOD").entries(liProfilesOD));
                    responseMessage = " Created successfully ";
                    createResults.push(responseMessage);
                }
            } catch (e) {
                responseMessage = " Creation failed";
                createResults.push(responseMessage);
            }
        } else {
            createResults.push(responseMessage);
        }    //  End of if (req.data.FLAG === "I")
        return responseMessage;
    });
    // Assign product to access node
    srv.on("genProdAN", async (req) => {
        let { genProdAccessNode } = srv.entities;
        let liresults = [];
        let lireturn = [];
        let lsresults = {};
        let createResults = [];
        let res;
        var responseMessage;
        res = req._.req.res;
        if (req.data.ACCESS_NODE === "D") {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            try {
                await cds.delete("CP_PROD_ACCNODE", lsresults);
                responseMessage = " Deletion successfully ";
                createResults.push(responseMessage);
            } catch (e) {
                responseMessage = " Deletion failed ";
                createResults.push(responseMessage);
                //DONOTHING
            }
        } else {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.ACCESS_NODE = req.data.ACCESS_NODE;
            liresults.push(lsresults);
            lsresults = {};
            try {
                await cds.run(INSERT.into("CP_PROD_ACCNODE").entries(liresults));
                responseMessage = " Created successfully ";
                createResults.push(responseMessage);
            } catch (e) {
                responseMessage = " Creation failed";
                createResults.push(responseMessage);
            }
        }
        lireturn = await cds.transaction(req).run(SELECT.from(genProdAccessNode));
        return lireturn;
    });
    // assign BOM structure node
    srv.on("genCompSN", async (req) => {
        let { genCompStrcNode } = srv.entities;
        let liresults = [];
        let lireturn = [];
        let lsresults = {};
        let createResults = [];
        let res;
        var responseMessage;
        res = req._.req.res;
        if (req.data.STRUC_NODE === "D") {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.ITEM_NUM = req.data.ITEM_NUM;
            lsresults.COMPONENT = req.data.COMPONENT;
            try {
                await cds.delete("CP_PVS_BOM", lsresults);
                responseMessage = " Deletion successfully ";
                createResults.push(responseMessage);
            } catch (e) {
                responseMessage = " Deletion failed ";
                createResults.push(responseMessage);
                //DONOTHING
            }
        } else {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.ITEM_NUM = req.data.ITEM_NUM;
            lsresults.COMPONENT = req.data.COMPONENT;
            lsresults.STRUC_NODE = req.data.STRUC_NODE;
            liresults.push(lsresults);
            lsresults = {};
            try {
                await cds.run(INSERT.into("CP_PVS_BOM").entries(liresults));
                responseMessage = " Created successfully ";
                createResults.push(responseMessage);
            } catch (e) {
                responseMessage = " Creation failed";
                createResults.push(responseMessage);
            }
        }
        lireturn = await cds.transaction(req).run(SELECT.from(genCompStrcNode));
        return lireturn;
    });
    // Create PVS nodes
    srv.on("genpvs", async (req) => {
        let { getPVSNodes } = srv.entities;
        let liresults = [];
        let lsresults = {};
        let lireturn = [];
        let res;
        let flagvs;
        res = req._.req.res;
        if (req.data.NODE_TYPE === "VS" && req.data.FLAG !== "D") {
            const lires = await cds.run(
                `SELECT "CHILD_NODE",
                        "PARENT_NODE",
                        "ACCESS_NODES",
                        "NODE_TYPE",
                        "NODE_DESC",
                        "AUTH_GROUP",
                        "UPPERLIMIT",
                        "LOWERLIMIT"
                FROM "CP_PVS_NODES"
                WHERE "CHILD_NODE" = '` +
                req.data.CHILD_NODE +
                `' AND "NODE_TYPE" = 'VS'`
            );
            if (lires.length > 0) {
                flagvs = "X";
            }
        }
        if (flagvs !== "X") {
            if (req.data.FLAG === "C" || req.data.FLAG === "E") {
                lsresults.CHILD_NODE = req.data.CHILD_NODE;
                lsresults.PARENT_NODE = req.data.PARENT_NODE;
                if (req.data.FLAG === "E") {
                    try {
                        await cds.delete("CP_PVS_NODES", lsresults);
                    } catch (e) {
                        //DONOTHING
                    }
                }
                lsresults.ACCESS_NODES = req.data.ACCESS_NODES;
                lsresults.NODE_TYPE = req.data.NODE_TYPE;
                lsresults.NODE_DESC = req.data.NODE_DESC;
                lsresults.AUTH_GROUP = "";
                lsresults.UPPERLIMIT = req.data.UPPERLIMIT;
                lsresults.LOWERLIMIT = req.data.LOWERLIMIT;
                liresults.push(lsresults);
                try {
                    await cds.run(INSERT.into("CP_PVS_NODES").entries(liresults));
                } catch (e) {
                    //DONOTHING
                    responseMessage = " Creation failed";
                    // createResults.push(responseMessage);
                }
                lsresults = {};
            } else if (req.data.FLAG === "D") {
                if (req.data.NODE_TYPE === "SN") {
                    try {
                        await cds.run(
                            `DELETE FROM "CP_PVS_NODES" WHERE "CHILD_NODE" = '` +
                            req.data.CHILD_NODE +
                            `'`
                        );
                    } catch (e) {
                        // Delete failed
                    }
                } else if (req.data.NODE_TYPE === "AN") {
                    try {
                        await cds.run(
                            `DELETE FROM "CP_PVS_NODES" WHERE "ACCESS_NODES" = '` +
                            req.data.CHILD_NODE +
                            `'`
                        );
                    } catch (e) {
                        // Delete failed
                    }
                } else {
                    lsresults.CHILD_NODE = req.data.CHILD_NODE;
                    lsresults.PARENT_NODE = req.data.PARENT_NODE;
                    try {
                        await cds.delete("CP_PVS_NODES", lsresults);
                    } catch (e) { }
                }
                lsresults = {};
            }
            lireturn = await cds.transaction(req).run(SELECT.from(getPVSNodes));
        } else {
            //Do nothing
        }
        return lireturn;
    });


    // Get object dependency
    srv.on("get_objdep", async (req) => {
        let { getMODHeader } = srv.entities;
        const db = srv.transaction(req);
        const results = await cds
            .transaction(req)
            .run(
                SELECT.distinct
                    .from(getMODHeader)
                    .columns("LOCATION_ID", "PRODUCT_ID", "OBJ_DEP", "OBJ_COUNTER")
            );
        return results;
    });

    // Generate Timeseries using action call
    srv.on("generateTimeseries", async (req) => {

        let lilocProd = {};
        let lsData = {};
        let Flag = '';
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started History timeseries";
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
                    await obgenTimeseries.genTimeseries(lsData, req, Flag);
                }
                break;
            case 'M2':

                res.statusCode = 202;
                res.send({ values });
                for (let i = 0; i < lilocProd.length; i++) {
                    lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
                    lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
                    const obgenTimeseriesM2 = new GenTimeseriesM2();
                    console.log(lsData.LOCATION_ID);
                    console.log(lsData.PRODUCT_ID);
                    await obgenTimeseriesM2.genTimeseries(lsData, req, Flag);
                }
                break;
        }
        const obgenTimeseries_rt = new GenTimeseriesRT();
        await obgenTimeseries_rt.genTimeseries_rt(req.data, req);
        console.log(Flag);
    });
    srv.on("generateTimeseriesF", async (req) => {

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
        const obgenTimeseries_rt = new GenTimeseriesRT();
        await obgenTimeseries_rt.genTimeseriesF_rt(req.data, req);

    });
    // Generate Timeseries fucntion calls
    srv.on("generate_timeseriesH", async (req) => {

        let Flag = '';
        switch ('M2') {
            case 'M1':
                const obgenTimeseries = new GenTimeseries();
                await obgenTimeseries.genTimeseries(req.data, req, Flag);
                break;
            case 'M2':
                const obgenTimeseriesM2 = new GenTimeseriesM2();
                await obgenTimeseriesM2.genTimeseries(req.data, req, Flag);
                break;
        }
        // const obgenTimeseries_rt = new GenTimeseriesRT();
        // await obgenTimeseries_rt.genTimeseries_rt(req.data, req);

    });
    // Generate Timeseries fucntion calls
    srv.on("generate_timeseries", async (req) => {
        let Flag = '';
        // switch (await GenFunctions.getParameterValue(req.data.LOCATION_ID, 5)) {
        //     case 'M1':
        //         const obgenTimeseries = new GenTimeseries();
        //         await obgenTimeseries.genTimeseries(req.data, req, Flag);
        //         break;
        //     case 'M2':
        //         const obgenTimeseriesM2 = new GenTimeseriesM2();
        //         await obgenTimeseriesM2.genTimeseries(req.data, req, Flag);
        //         break;
        // }
        const obgenTimeseries_rt = new GenTimeseriesRT();
        await obgenTimeseries_rt.genTimeseries_rt(req.data, req);

    });
    srv.on("generate_timeseriesF", async (req) => {

        let lilocProd = {};
        let lsData = {}, Flag = '';

        switch (await GenFunctions.getParameterValue(req.data.LOCATION_ID, 5)) {
            case 'M1':
                const obgenTimeseries = new GenTimeseries();
                await obgenTimeseries.genTimeseriesF(req.data, req, Flag);
                break;
            case 'M2':
                const obgenTimeseriesM2 = new GenTimeseriesM2();
                await obgenTimeseriesM2.genTimeseriesF(req.data, req, Flag);
                break;
        }
        const obgenTimeseries_rt = new GenTimeseriesRT();
        // await obgenTimeseries_rt.genTimeseriesF_rt(req.data, req);
    });

    // Generate Unique ID
    srv.on("genUniqueID", async (req) => {
        let lilocProd = [];
        let lsData = {}, Flag = '';

        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started Process Sales Order";
        let res = req._.req.res;

        if (req.data.PRODUCT_ID === "ALL") {
            const objCatFn = new Catservicefn();
            lilocProd = await objCatFn.getAllProducts(req.data);
            values.push({ id, createtAt, message, lilocProd });
            for (let i = 0; i < lilocProd.length; i++) {
                lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
                lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
                const obgenSOFunctions = new SOFunctions();
                await obgenSOFunctions.genUniqueID(lsData, req, Flag);
            }
        }
        else {

            const litemp = JSON.stringify(req.data);
            lilocProd = JSON.parse(litemp);
            values.push({ id, createtAt, message, lilocProd });
            const obgenSOFunctions = new SOFunctions();
            await obgenSOFunctions.genUniqueID(req.data, req, Flag);
        }
    });
    // Generate Unique ID
    srv.on("gen_UniqueID", async (req) => {
        let Flag = '';
        const obgenSOFunctions = new SOFunctions();
        await obgenSOFunctions.genUniqueID(req.data, req, Flag);
        return "success";
    });
    // Generate Fully Configured Demand
    srv.on("genFullConfigDemand", async (req) => {
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
    });
    // Generate Fully Configured Demand
    srv.on("gen_FullConfigDemand", async (req) => {

        let lilocProd = {};
        let lsData = {};
        lilocProd = JSON.parse(req.data.LocProdData);
        for (let i = 0; i < lilocProd.length; i++) {
            lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
            const obgenTimeseriesM2 = new GenTimeseriesM2();
            await obgenTimeseriesM2.genPrediction(lsData, req, Flag);
        }
    });

    srv.on("genVariantStruc", async (req) => {

        const objVarConfig = new VarConfig();
        await objVarConfig.genVarConfig(req.data);
    });

    srv.on("genAssemblyreq", async (req) => {
        const objAsmreq = new AssemblyReq();
        await objAsmreq.genAsmreq(req.data, req);
    });
    srv.on("generateAssemblyReq", async (req) => {
        const objAsmreq = new AssemblyReq();
        await objAsmreq.genAsmreq(req.data, req);
    });
    // Maintain Parital product introsduction
    srv.on("maintainPartialProd", async (req) => {
        let liresults = [];
        let lsresults = {};
        var responseMessage;
        console.log(req.headers);
        console.log(req);
        if (req.data.FLAG === "C" || req.data.FLAG === "E") {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            if (req.data.FLAG === "E") {
                try {
                    await cds.delete("CP_PARTIALPROD_INTRO", lsresults);
                } catch (e) {
                    //DONOTHING
                }
            }
            lsresults.PROD_DESC = req.data.PROD_DESC;
            lsresults.REF_PRODID = req.data.REF_PRODID;
            liresults.push(lsresults);
            try {
                await cds.run(INSERT.into("CP_PARTIALPROD_INTRO").entries(liresults));
                responseMessage = " Creation/Updation successful";
            } catch (e) {
                //DONOTHING
                responseMessage = " Creation failed";
                // createResults.push(responseMessage);
            }
            lsresults = {};
        } else if (req.data.FLAG === "D") {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            try {
                await cds.delete("CP_PARTIALPROD_INTRO", lsresults);
                responseMessage = " Deletion successfull";
            } catch (e) {
                responseMessage = " Deletion failed";
            }
        }
        lsresults = {};

        return responseMessage;
    });
    // Maintain partial configurations for product Characteristics
    srv.on("maintainPartialProdChar", async (req) => {
        let liresults = [];
        let lsresults = {};
        let liProdChar = {};
        var responseMessage;
        liProdChar = JSON.parse(req.data.PRODCHAR);
        if (req.data.FLAG === "C" || req.data.FLAG === "E") {
            for (var i = 0; i < liProdChar.length; i++) {
                lsresults.PRODUCT_ID = liProdChar[i].PRODUCT_ID;
                lsresults.LOCATION_ID = liProdChar[i].LOCATION_ID;
                // lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
                if (req.data.FLAG === "E" && i === 0) {
                    try {
                        await cds.delete("CP_PARTIALPROD_CHAR", lsresults);
                    } catch (e) {
                        //DONOTHING
                    }
                }
                lsresults.CLASS_NUM = liProdChar[i].CLASS_NUM;
                lsresults.CHAR_NUM = liProdChar[i].CHAR_NUM;
                lsresults.CHARVAL_NUM = liProdChar[i].CHARVAL_NUM;
                liresults.push(lsresults);
                lsresults = {};
            }
            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_PARTIALPROD_CHAR").entries(liresults));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    //DONOTHING
                    responseMessage = " Creation failed";
                    // createResults.push(responseMessage);
                }
            }
        }
        else if (req.data.FLAG === "D") {
            for (var i = 0; i < liProdChar.length; i++) {
                lsresults.PRODUCT_ID = liProdChar[i].PRODUCT_ID;
                lsresults.LOCATION_ID = liProdChar[i].LOCATION_ID;
                //  lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
                if (req.data.FLAG === "E" && i === 0) {
                    try {
                        await cds.delete("CP_PARTIALPROD_CHAR", lsresults);
                        break;
                    } catch (e) {
                        //DONOTHING
                    }
                }
            }
        }
        lsresults = {};
        return responseMessage;
    });
    // Maintain new product introsduction
    srv.on("maintainNewProd", async (req) => {
        let liresults = [];
        let lsresults = {};
        var responseMessage;

        if (req.data.FLAG === "C" || req.data.FLAG === "E") {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            if (req.data.FLAG === "E") {
                try {
                    await cds.delete("CP_NEWPROD_INTRO", lsresults);
                } catch (e) {
                    //DONOTHING
                }
            }
            lsresults.REF_PRODID = req.data.REF_PRODID;
            liresults.push(lsresults);
            try {
                await cds.run(INSERT.into("CP_NEWPROD_INTRO").entries(liresults));
                responseMessage = " Creation/Updation successful";
            } catch (e) {
                //DONOTHING
                responseMessage = " Creation failed";
                // createResults.push(responseMessage);
            }
            lsresults = {};
        } else if (req.data.FLAG === "D") {
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            try {
                await cds.delete("CP_NEWPROD_INTRO", lsresults);
                responseMessage = " Deletion successfull";
            } catch (e) {
                responseMessage = " Deletion failed";
            }
        }
        lsresults = {};

        return responseMessage;
    });
    // Maintain partial configurations for new product
    srv.on("maintainNewProdChar", async (req) => {
        let liresults = [];
        let lsresults = {};
        let liProdChar = {};
        var responseMessage;
        liProdChar = JSON.parse(req.data.PRODCHAR);
        if (req.data.FLAG === "C" || req.data.FLAG === "E") {
            for (var i = 0; i < liProdChar.length; i++) {
                lsresults.PRODUCT_ID = liProdChar[i].PRODUCT_ID;
                lsresults.LOCATION_ID = liProdChar[i].LOCATION_ID;
                // lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
                if (req.data.FLAG === "E" && i === 0) {
                    try {
                        await cds.delete("CP_NEWPROD_CHAR", lsresults);
                    } catch (e) {
                        //DONOTHING
                    }
                }
                lsresults.CLASS_NUM = liProdChar[i].CLASS_NUM;
                lsresults.CHAR_NUM = liProdChar[i].CHAR_NUM;
                lsresults.CHARVAL_NUM = liProdChar[i].CHARVAL_NUM;

                lsresults.REF_CLASS_NUM = liProdChar[i].REF_CLASS_NUM;
                lsresults.REF_CHAR_NUM = liProdChar[i].REF_CHAR_NUM;
                lsresults.REF_CHARVAL_NUM = liProdChar[i].REF_CHARVAL_NUM;
                liresults.push(lsresults);
                lsresults = {};
            }
            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_NEWPROD_CHAR").entries(liresults));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    //DONOTHING
                    responseMessage = " Creation failed";
                    // createResults.push(responseMessage);
                }
            }
        }
        else if (req.data.FLAG === "D") {
            // for (var i = 0; i < liProdChar.length; i++) {
            lsresults.PRODUCT_ID = liProdChar[0].PRODUCT_ID;
            lsresults.LOCATION_ID = liProdChar[0].LOCATION_ID;
            //  lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
            // if (req.data.FLAG === "E" && i === 0) {
            try {
                await cds.delete("CP_NEWPROD_CHAR", lsresults);
                // break;
            } catch (e) {
                //DONOTHING
            }
            // }
            // }
        }
        lsresults = {};
        return responseMessage;
    });
    // Maintain partial configurations for new product
    srv.on("getSecondaryChar", async (req) => {
        let liresults = [];
        let lsresults = {};
        let vCount = 1;
        let vFlag = '';
        let vCharFlag = '';
        let li_varcharps = [];
        li_varcharps = await cds.run(
            `SELECT *
            FROM "V_GETVARCHARPS"
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
            AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `'`
        );
        if (req.data.FLAG === 'G' && li_varcharps.length > 0) {
            return li_varcharps;
        }
        else if (req.data.FLAG === 'R' || li_varcharps.length === 0) {
            const li_locprodclass = await cds.run(
                `SELECT *
                FROM "V_LOCPRODCLASSCHAR"
                WHERE "LOCATION_ID" = '` +
                req.data.LOCATION_ID +
                `'
                AND "PRODUCT_ID" = '` +
                req.data.PRODUCT_ID +
                `' ORDER BY LOCATION_ID, PRODUCT_ID,
                CHAR_NAME`
            );
            vCount = 1;
            for (i = 0; i < li_locprodclass.length; i++) {
                vCharFlag = '';
                lsresults.PRODUCT_ID = li_locprodclass[i].PRODUCT_ID;
                lsresults.LOCATION_ID = li_locprodclass[i].LOCATION_ID;
                lsresults.CHAR_NUM = li_locprodclass[i].CHAR_NUM;
                lsresults.CHAR_TYPE = 'S';
                lsresults.SEQUENCE = vCount;
                if (li_varcharps.length > 0) {
                    for (j = 0; j < li_varcharps.length; j++) {
                        if (li_varcharps[j].CHAR_NUM === lsresults.CHAR_NUM) {
                            vCharFlag = 'X';
                            break;
                        }
                    }
                    if (vCharFlag === '') {
                        liresults.push(lsresults);
                        vCount = vCount + 1;
                    }
                }
                else {
                    liresults.push(lsresults);
                    vCount = vCount + 1;
                }
                lsresults = {};
            }
            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_VARCHAR_PS").entries(liresults));
                    vFlag = 'X';
                } catch (e) {
                    vFlag = '';
                }
            }
            // if (vFlag === 'X') {
            li_varcharps = await cds.run(
                `SELECT *
                FROM "V_GETVARCHARPS"
                WHERE "LOCATION_ID" = '` +
                req.data.LOCATION_ID +
                `'
                AND "PRODUCT_ID" = '` +
                req.data.PRODUCT_ID +
                `'`
            );
            return li_varcharps;
            // }
        }
        // Remove Primary char from Unique char
        else if (req.data.FLAG === 'U') {
            vFlag = '';
            let vId;
            const li_locprodunique = await cds.run(
                `SELECT *
                FROM "CP_UNIQUE_ID_HEADER"
                WHERE "LOCATION_ID" = '` +
                req.data.LOCATION_ID +
                `'
                AND "PRODUCT_ID" = '` +
                req.data.PRODUCT_ID +
                `' AND "UID_TYPE" = 'P'`
            );
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.UID_TYPE = 'P';
            try {
                await cds.delete("CP_UNIQUE_ID_HEADER", lsresults);
                vFlag = 'X';
            } catch (e) {
                //DONOTHING
            }
            if (vFlag === 'X') {
                for (let i = 0; i < li_locprodunique.length; i++) {
                    vId = parseInt(li_locprodunique[i].UNIQUE_ID);
                    try {
                        await cds.run(
                            `DELETE FROM "CP_UNIQUE_ID_ITEM" WHERE "LOCATION_ID" = '` + li_locprodunique[i].LOCATION_ID + `' 
                                                              AND "PRODUCT_ID" = '`+ li_locprodunique[i].PRODUCT_ID + `'
                                                              AND "UNIQUE_ID" = `+ vId + ``
                        );
                        vFlag = 'S';
                    }
                    catch (e) {

                    }
                }
            }
            if (vFlag === 'S') {
                lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
                lsresults.LOCATION_ID = req.data.LOCATION_ID;
                lsresults.CHAR_NUM = 'SUCCESS';
                lsresults.CHAR_TYPE = 'S';
                lsresults.SEQUENCE = vCount;
                li_varcharps.push(GenFunctions.parse(lsresults));
                return li_varcharps;
                lsresults = {};
            }

        }

    });
    // Maintain partial configurations for new product
    srv.on("changeToPrimary", async (req) => {
        let { genvarcharps } = srv.entities;
        let liresults = [];
        let lsresults = {};
        let liProdChar = {};
        var responseMessage;

        let li_varcharps
        li_varcharps = await cds.run(
            `SELECT *
            FROM "CP_VARCHAR_PS"
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
            AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `'
            AND "SEQUENCE" > `+
            req.data.SEQUENCE + `
            ORDER BY SEQUENCE`
        );
        if (req.data.FLAG === "C") {
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.CHAR_NUM = req.data.CHAR_NUM;
            lsresults.CHAR_TYPE = req.data.CHAR_TYPE;
            if (req.data.CHAR_TYPE === "P") {
                lsresults.SEQUENCE = 0;
            }
            else {
                lsresults.SEQUENCE = req.data.SEQUENCE;
            }
            liresults.push(lsresults);

            if (liresults.length > 0) {
                try {
                    await UPDATE`CP_VARCHAR_PS`
                        .with({
                            CHAR_TYPE: lsresults.CHAR_TYPE,
                            SEQUENCE: lsresults.SEQUENCE
                        })
                        .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                                          AND PRODUCT_ID = '${lsresults.PRODUCT_ID}'
                                          AND CHAR_NUM = '${lsresults.CHAR_NUM}'`);

                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    responseMessage = " Creation failed";
                }
            }
            // }
            if (lsresults.CHAR_TYPE !== "S") {

                lsresults = {};
                liresults = [];
                li_varcharps = await cds.run(
                    `SELECT *
                    FROM "CP_VARCHAR_PS"
                    WHERE "LOCATION_ID" = '` +
                    req.data.LOCATION_ID +
                    `'
                    AND "PRODUCT_ID" = '` +
                    req.data.PRODUCT_ID +
                    `'
                    ORDER BY SEQUENCE`
                );
                for (let i = 0; i < li_varcharps.length; i++) {
                    lsresults.PRODUCT_ID = li_varcharps[i].PRODUCT_ID;
                    lsresults.LOCATION_ID = li_varcharps[i].LOCATION_ID;
                    lsresults.CHAR_NUM = li_varcharps[i].CHAR_NUM;
                    lsresults.CHAR_TYPE = 'S';
                    if (li_varcharps[i].SEQUENCE > req.data.SEQUENCE) {
                        lsresults.SEQUENCE = li_varcharps[i].SEQUENCE - 1;
                        await UPDATE`CP_VARCHAR_PS`
                            .with({
                                CHAR_TYPE: lsresults.CHAR_TYPE,
                                SEQUENCE: lsresults.SEQUENCE
                            })
                            .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                                          AND PRODUCT_ID = '${lsresults.PRODUCT_ID}'
                                          AND CHAR_NUM = '${lsresults.CHAR_NUM}'`);

                        liresults.push(lsresults);
                    }
                    lsresults = {};
                }
                if (liresults.length > 0) {
                    // try {
                    //     await cds.run(INSERT.into("CP_VARCHAR_PS").entries(liresults));
                    //     responseMessage = " Creation/Updation successful";
                    // } catch (e) {
                    //     //DONOTHING
                    //     responseMessage = " Creation failed";
                    //     // createResults.push(responseMessage);
                    // }
                }
            }
        }
        else if (req.data.FLAG === "E") {

            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.CHAR_NUM = req.data.CHAR_NUM;
            lsresults.CHAR_TYPE = req.data.CHAR_TYPE;
            lsresults.SEQUENCE = req.data.SEQUENCE;
            liresults.push(lsresults);
            if (liresults.length > 0) {
                try {
                    await UPDATE`CP_VARCHAR_PS`
                        .with({
                            CHAR_TYPE: lsresults.CHAR_TYPE,
                            SEQUENCE: lsresults.SEQUENCE
                        })
                        .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                                          AND PRODUCT_ID = '${lsresults.PRODUCT_ID}'
                                          AND CHAR_NUM = '${lsresults.CHAR_NUM}'`);

                    // await cds.run(INSERT.into("CP_VARCHAR_PS").entries(liresults));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    responseMessage = " Creation failed";
                }
            }
        }
        lsresults = {};
        return responseMessage;
    });
    //Change Active status
    srv.on("changeUnique", async (req) => {
        let liresults = [];
        let lsresults = {};
        var responseMessage;
        const li_uniquedata = await cds.run(
            `SELECT *
            FROM "CP_UNIQUE_ID_HEADER"
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
            AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `' ORDER BY UNIQUE_ID DESC`
        );
        console.log(li_uniquedata[0]);
        // let liuniquechar = JSON.parse(req.data.UNIQUECHAR);
        // let vFlag = liuniquechar[0].FLAG;
        if (req.data.FLAG === 'E') {// Active status change
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            lsresults.UNIQUE_ID = parseInt(req.data.UNIQUE_ID);
            // try {
            //     await cds.delete("CP_UNIQUE_ID_HEADER", lsresults);
            // } catch (e) {
            //     //DONOTHING
            // }
            lsresults.UNIQUE_DESC = req.data.UNIQUE_DESC;//li_unique[0].UNIQUE_DESC;
            lsresults.UID_TYPE = req.data.UID_TYPE;//li_unique[0].UID_TYPE;
            if (req.data.ACTIVE === 'X') {
                lsresults.ACTIVE = Boolean(false);
            }
            else {
                lsresults.ACTIVE = Boolean(true);
            }
            liresults.push(lsresults);
            try {
                await UPDATE`CP_UNIQUE_ID_HEADER`
                    .with({
                        ACTIVE: lsresults.ACTIVE,
                        UNIQUE_DESC: lsresults.UNIQUE_DESC
                    })
                    .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                            AND PRODUCT_ID = '${lsresults.PRODUCT_ID}'
                            AND UNIQUE_ID = '${lsresults.UNIQUE_ID}'`);
                responseMessage = "Update successfull";
            } catch (e) {
                responseMessage = "Update failed";
                //DONOTHING
            }
        }
        else if (req.data.FLAG === 'C') {
            console.log(req.data);
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
            if (li_uniquedata.length > 0) {
                lsresults.UNIQUE_ID = parseInt(li_uniquedata[0].UNIQUE_ID) + 1;
            }
            else {
                lsresults.UNIQUE_ID = 01;
            }
            lsresults.UNIQUE_DESC = req.data.UNIQUE_DESC;
            lsresults.UID_TYPE = req.data.UID_TYPE;
            if (req.data.ACTIVE === 'X') {
                lsresults.ACTIVE = Boolean(false);
            }
            else {
                lsresults.ACTIVE = Boolean(true);
            }
            liresults.push(lsresults);

            console.log(lsresults);

            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_UNIQUE_ID_HEADER").entries(liresults));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    console.log(e.message);
                    //DONOTHING
                    responseMessage = "Creation Failed"
                    // createResults.push(responseMessage);
                }
            }
        }
        return responseMessage;
    });

    // maintainUniqueChar
    srv.on("maintainUniqueChar", async (req) => {
        let liresults = [];
        let lsresults = {};
        let liresultsH = [];
        let lsresultsH = {};
        var responseMessage;
        let vFlag, vID, vUID, vCharCount = 0, vCount = 0, vIndex = 0;
        let liuniquechar = JSON.parse(req.data.UNIQUECHAR);
        const objCatFn = new Catservicefn();

        const li_uniquedata = await cds.run(
            `SELECT *
        FROM "CP_UNIQUE_ID_ITEM"
        WHERE "LOCATION_ID" = '` +
            liuniquechar[0].LOCATION_ID +
            `'
             ORDER BY UNIQUE_ID DESC`
        );
        vCharCount = liuniquechar.length;
        const lsUniqueInd = await SELECT.one.columns("MAX(UNIQUE_ID) AS MAX_ID")
            .from('CP_UNIQUE_ID_HEADER');
        if (lsUniqueInd.MAX_ID === null) {
            vUID = 1;
        } else {
            vUID = parseInt(lsUniqueInd.MAX_ID);
        }
        // vUID = li_uniquedata[0].UNIQUE_ID;
        // Check if there is any unique ID with same char.
        for (let uIndex = 0; uIndex < li_uniquedata.length; uIndex++) {
            if (vUID === li_uniquedata[uIndex].UNIQUE_ID) {
                vIndex = vIndex + 1;
            }
            else {
                if (vIndex === vCount && vIndex === vCharCount) {
                    return "Entry already exists";
                }
                else {
                    vIndex = 1;
                    vCount = 0;
                    vUID = li_uniquedata[uIndex].UNIQUE_ID;
                }
            }
            for (let cIndex = 0; cIndex < liuniquechar.length; cIndex++) {
                if (li_uniquedata[uIndex].CHAR_NUM === liuniquechar[cIndex].CHAR_NUM &&
                    li_uniquedata[uIndex].CHARVAL_NUM === liuniquechar[cIndex].CHARVAL_NUM) {
                    vCount = vCount + 1;
                }
            }
        }
        // let vFlag = liuniquechar[0].FLAG;
        if (req.data.FLAG === 'N' || req.data.FLAG === 'C') {
            vID = await objCatFn.maintainUniqueHeader(req.data.FLAG, liuniquechar[0]);
            if (vID !== '') {

                for (let i = 0; i < liuniquechar.length; i++) {
                    lsresults.LOCATION_ID = liuniquechar[i].LOCATION_ID;
                    lsresults.PRODUCT_ID = liuniquechar[i].PRODUCT_ID;
                    lsresults.UNIQUE_ID = vID;//parseInt(liuniquechar[i].UNIQUE_ID);
                    lsresults.CHAR_NUM = liuniquechar[i].CHAR_NUM;
                    lsresults.CHARVAL_NUM = liuniquechar[i].CHARVAL_NUM;
                    liresults.push(lsresults);
                    lsresults = {};
                }
                if (liresults.length > 0) {
                    try {
                        await cds.run(INSERT.into("CP_UNIQUE_ID_ITEM").entries(liresults));
                        responseMessage = " Creation/Updation successful";
                    } catch (e) {
                        //DONOTHING
                        responseMessage = "Creation Failed"
                        // createResults.push(responseMessage);
                    }
                }

            }
            else {
                responseMessage = "Creation Failed"
            }
        }
        else if (req.data.FLAG === 'E') {
            vFlag = await objCatFn.maintainUniqueHeader(req.data.FLAG, liuniquechar[0]);
            if (vFlag = 'X') {
                try {
                    responseMessage = "Update successful";
                } catch (e) {
                    responseMessage = "Update Failed"
                }
            }
            else {
                responseMessage = "Update Failed"
            }
        }
        // else if (req.data.FLAG === 'C') {//Copy
        //     vID = await objCatFn.maintainUniqueHeader(req.data.FLAG, liuniquechar[0]);
        //     if (vID !== ' ') {
        //         lsresults.LOCATION_ID = liuniquechar[0].LOCATION_ID;
        //         lsresults.PRODUCT_ID = liuniquechar[0].PRODUCT_ID;
        //         lsresults.UNIQUE_ID = vID;//parseInt(liuniquechar[0].UNIQUE_ID);
        //         const li_chardata = await cds.run(
        //             `SELECT *
        //         FROM "CP_UNIQUE_ID_ITEM"
        //         WHERE "LOCATION_ID" = '` +
        //             lsresults.LOCATION_ID +
        //             `'
        //         AND "PRODUCT_ID" = '` +
        //             lsresults.PRODUCT_ID +
        //             `'
        //         AND"UNIQUE_ID" = '` +
        //             lsresults.UNIQUE_ID +
        //             `'`
        //         );
        //         if (li_chardata.length > 0) {
        //             // vID = await objCatFn.maintainUniqueHeader(req.data);

        //             for (let i = 0; i < liuniquechar.length; i++) {
        //                 li_chardata[i].UNIQUE_ID = parseInt(vID);
        //             }                    
        //             try {
        //                 await cds.run(INSERT.into("CP_UNIQUE_ID_ITEM").entries(li_chardata));
        //                 responseMessage = " Creation/Updation successful";
        //             } catch (e) {
        //                 //DONOTHING
        //                 responseMessage = "Creation Failed"
        //                 // createResults.push(responseMessage);
        //             }
        //         }
        //         else {
        //             responseMessage = "Creation Failed"
        //         }
        //     }
        //     else {
        //         responseMessage = "Unable to copy Unique ID"
        //     }
        // }

        return responseMessage;
    });
    // Maintain partial configurations for new product
    srv.on("maintainRestrHdr", async (req) => {
        let liresults = [];
        let lsresults = {};
        let liProdChar = {};
        var responseMessage;
        if (req.data.Flag === "C" || req.data.Flag === "E") {
            lsresults.LINE_ID = req.data.LINE_ID;
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.RESTRICTION = req.data.RESTRICTION;
            if (req.data.Flag === "E") {
                try {
                    await cds.delete("CP_RESTRICT_HEADER", lsresults);
                } catch (e) {
                    //DONOTHING
                }
            }

            lsresults.RTR_DESC = req.data.RTR_DESC;
            lsresults.VALID_FROM = req.data.VALID_FROM;
            lsresults.VALID_TO = req.data.VALID_TO;
            liresults.push(lsresults);
            lsresults = {};
            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_RESTRICT_HEADER").entries(liresults));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    //DONOTHING
                    responseMessage = " Creation failed";
                    // createResults.push(responseMessage);
                }
            }
        }
        else if (req.data.Flag === "D") {
            lsresults.LINE_ID = req.data.LINE_ID;
            lsresults.LOCATION_ID = req.data.LOCATION_ID;
            lsresults.RESTRICTION = req.data.RESTRICTION;
            // if (req.data.Flag === "E" && i === 0) {
            try {
                await cds.delete("CP_RESTRICT_HEADER", lsresults);
                responseMessage = "Restriction deleted";
            } catch (e) {
                //DONOTHING
                responseMessage = "Failed to delete Restriction";
            }
            // }
        }
        lsresults = {};
        return responseMessage;
    });
    // Retriction rule
    // Maintain partial configurations for new product
    srv.on("maintainRestrDet", async (req) => {
        let liresults = [];
        let lsresults = {};
        let liRtrChar = {};
        var responseMessage;
        liRtrChar = JSON.parse(req.data.RTRCHAR);
        if (req.data.FLAG === "C" || req.data.FLAG === "E") {
            for (var i = 0; i < liRtrChar.length; i++) {
                lsresults.RESTRICTION = liRtrChar[i].RESTRICTION;
                // lsresults.RTR_COUNTER = liRtrChar[i].RTR_COUNTER;
                lsresults.CLASS_NUM = liRtrChar[i].CLASS_NUM;
                lsresults.CHAR_NUM = liRtrChar[i].CHAR_NUM;
                lsresults.CHAR_COUNTER = liRtrChar[i].CHAR_COUNTER;
                lsresults.CHARVAL_NUM = liRtrChar[i].CHARVAL_NUM;
                // if (req.data.FLAG === "E" && i === 0) {
                if (req.data.FLAG === "E") {
                    try {
                        await cds.delete("CP_RESTRICT_DETAILS", lsresults);
                    } catch (e) {
                        //DONOTHING
                    }
                }
                lsresults.OD_CONDITION = liRtrChar[i].OD_CONDITION;
                lsresults.ROW_ID = liRtrChar[i].ROW_ID;
                liresults.push(lsresults);
                lsresults = {};
            }
            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_RESTRICT_DETAILS").entries(liresults));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    //DONOTHING
                    responseMessage = " Creation failed";
                    // createResults.push(responseMessage);
                }
            }
        }
        else if (req.data.FLAG === "D") {
            for (var i = 0; i < liRtrChar.length; i++) {
                lsresults.RESTRICTION = liRtrChar[i].RESTRICTION;
                // lsresults.RTR_COUNTER = liRtrChar[i].RTR_COUNTER;
                lsresults.CLASS_NUM = liRtrChar[i].CLASS_NUM;
                lsresults.CHAR_NUM = liRtrChar[i].CHAR_NUM;
                lsresults.CHAR_COUNTER = liRtrChar[i].CHAR_COUNTER;
                lsresults.CHARVAL_NUM = liRtrChar[i].CHARVAL_NUM;
                // if (req.data.FLAG === "E" && i === 0) {
                try {
                    await cds.delete("CP_RESTRICT_DETAILS", lsresults);
                    break;
                } catch (e) {
                    //DONOTHING
                }
                // }
            }
        }
        lsresults = {};
        return responseMessage;
    });

    srv.on("trigrMAWeek", async (req) => {
        let liresults = [];
        console.log("Hello");
        // let lsresults = {};
        // lsresults.LOCATION_ID = req.data.LOCATION_ID;
        // lsresults.PRODUCT_ID = req.data.PRODUCT_ID;
        // lsresults.WEEK_DATE = req.data.WEEK_DATE;
        // liresults.push(lsresults);
        // lsresults = {};
        // if (liresults.length > 0) {
        //     try {
        //         await cds.run(INSERT.into("CP_MARKETAUTH_WEEK").entries(liresults));
        //         responseMessage = " Creation/Updation successful";
        //     } catch (e) {
        //         //DONOTHING
        //         responseMessage = " Creation failed";
        //         // createResults.push(responseMessage);
        //     }
        // }
    });
    srv.on("maintainSeedOrder", async (req) => {
        let liresults = [];
        let lsresults = {};
        let lspara = {};
        let liSeeddata = {};
        let vValue = 0, vTemp, vOrder, vNoOrd = 5;
        let vPrefix = 'SE';
        var responseMessage;

        liSeeddata = JSON.parse(req.data.SEEDDATA);
        const li_sodata = await cds.run(
            `SELECT *
            FROM "CP_SEEDORDER_HEADER"
             ORDER BY SEED_ORDER DESC`
        );
        const li_paravalues = await cds.run(
            `SELECT VALUE
                FROM "CP_PARAMETER_VALUES"
                WHERE "LOCATION_ID" = '` + liSeeddata[0].LOCATION_ID + `'
                AND ( "PARAMETER_ID" = 6
                  OR "PARAMETER_ID" = 7 )
                ORDER BY "PARAMETER_ID" `);

        vValue = parseInt(li_paravalues[0].VALUE) + 1;
        vPrefix = li_paravalues[1].VALUE;
        const obgenSOFunctions = new SOFunctions();
        if (req.data.FLAG === "C") {
            lsresults.LOCATION_ID = liSeeddata[0].LOCATION_ID;
            lsresults.PRODUCT_ID = liSeeddata[0].PRODUCT_ID;
            lsresults.UNIQUE_ID = liSeeddata[0].UNIQUE_ID;
            lsresults.ORD_QTY = parseFloat(liSeeddata[0].ORD_QTY);
            lsresults.MAT_AVAILDATE = liSeeddata[0].MAT_AVAILDATE;
            do {
                vTemp = parseInt(vValue);
                vTemp = GenFunctions.addleadzeros(vTemp, 8);
                vOrder = vPrefix.concat(vTemp.toString());
                const li_sodata = await cds.run(
                    `SELECT *
                        FROM "CP_SEEDORDER_HEADER"
                        WHERE "LOCATION_ID" = '` +
                    liSeeddata[0].LOCATION_ID +
                    `'
                        AND "PRODUCT_ID" = '` +
                    liSeeddata[0].PRODUCT_ID +
                    `' 
                        AND "SEED_ORDER" = '` +
                    vOrder +
                    `' ORDER BY SEED_ORDER DESC`
                );
                if (li_sodata.length > 0) {
                    vNoOrd = 6;
                    vValue = parseInt(vValue) + 1;
                }
                else {
                    vNoOrd = -1;
                }
            } while (vNoOrd > 0)
            lsresults.SEED_ORDER = vOrder;
            liresults.push(lsresults);
            lspara.PARAMETER_ID = 6;
            lspara.VALUE = vTemp.toString();
            if (liresults.length > 0) {
                console.log(lsresults);
                try {
                    await cds.run(INSERT.into("CP_SEEDORDER_HEADER").entries(liresults));
                    await UPDATE`CP_PARAMETER_VALUES`
                        .with({
                            VALUE: lspara.VALUE
                        })
                        .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                        AND PARAMETER_ID = '${lspara.PARAMETER_ID}'`)
                    responseMessage = lsresults.SEED_ORDER + " Created successfully";
                    await obgenSOFunctions.createSO(lsresults.LOCATION_ID, lsresults.PRODUCT_ID, lsresults.SEED_ORDER, lsresults.MAT_AVAILDATE, lsresults.ORD_QTY, lsresults.UNIQUE_ID);
                } catch (e) {
                    //DONOTHING
                    responseMessage = " Creation failed";
                    // createResults.push(responseMessage);
                }
            }
        }
        else if (req.data.FLAG === "E") {
            // for (var i = 0; i < liRtrChar.length; i++) {
            lsresults.SEED_ORDER = liSeeddata[0].SEED_ORDER;
            lsresults.ORD_QTY = parseFloat(liSeeddata[0].ORD_QTY);
            lsresults.MAT_AVAILDATE = liSeeddata[0].MAT_AVAILDATE;
            try {
                await UPDATE`CP_SEEDORDER_HEADER`
                    .with({
                        ORD_QTY: lsresults.ORD_QTY,
                        MAT_AVAILDATE: lsresults.MAT_AVAILDATE
                    })
                    .where(`SEED_ORDER = '${lsresults.SEED_ORDER}'`)
                responseMessage = lsresults.SEED_ORDER + " Update is successfull";
            } catch (e) {
                responseMessage = "Update Failed";
                //DONOTHING
            }
            // }
        }
        else if (req.data.FLAG === "d") {
            try {
                await cds.run(DELETE.from('CP_SEEDORDER_HEADER').where(`SEED_ORDER = '${liSeeddata[0].SEED_ORDER}'`));
                responseMessage = "Deletion Successfull";
            } catch (e) {
                responseMessage = "Deletion Failed";
            }
        }
        lsresults = {};
        return responseMessage;
    });
    srv.on("getAllProd", async (req) => {
        let lsprod = {};
        let liprod = [];

        const objCatFn = new Catservicefn();
        liprod = await objCatFn.getAllProducts(req.data);
        return liprod;
    });
    srv.on("getAllVerScen", async (req) => {

        let { getProducts } = srv.entities;
        let lsprod = {};
        let liprodver = [];
        let vFlag = '';
        const liverscen = await cds.run(
            `
         SELECT DISTINCT PRODUCT_ID,
                LOCATION_ID,
                VERSION,
                SCENARIO
           FROM "V_IBPVERSCENARIO" `);
        //    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        const lipartialprod = await cds.run(
            `
         SELECT "CP_PARTIALPROD_INTRO".PRODUCT_ID,
                "CP_PARTIALPROD_INTRO".LOCATION_ID,
                "CP_PARTIALPROD_INTRO".PROD_DESC,
                "CP_PARTIALPROD_INTRO".REF_PRODID,
                "V_IBPVERSCENARIO". VERSION,
                "V_IBPVERSCENARIO".SCENARIO
           FROM "CP_PARTIALPROD_INTRO"
           INNER JOIN "V_IBPVERSCENARIO"
           ON   "CP_PARTIALPROD_INTRO".PRODUCT_ID = "V_IBPVERSCENARIO".PRODUCT_ID
           AND  "CP_PARTIALPROD_INTRO".LOCATION_ID = "V_IBPVERSCENARIO".LOCATION_ID           
           ORDER BY "CP_PARTIALPROD_INTRO".REF_PRODID`);
        //    WHERE "CP_PARTIALPROD_INTRO".LOCATION_ID = '`+ req.data.LOCATION_ID + `'
        //    ORDER BY "CP_PARTIALPROD_INTRO".REF_PRODID`);

        const objCatFn = new Catservicefn();
        liprod = await objCatFn.getAllProducts(req.data);

        // const liprod = await cds.transaction(req).run(SELECT.from(getProducts));
        for (iProd = 0; iProd < liprod.length; iProd++) {
            vFlag = ' ';
            for (i = 0; i < liverscen.length; i++) {
                if (liprod[iProd].PRODUCT_ID === liverscen[i].PRODUCT_ID) {

                    lsprod.LOCATION_ID = liverscen[i].LOCATION_ID;
                    lsprod.PRODUCT_ID = liverscen[i].PRODUCT_ID;
                    lsprod.VERSION = liverscen[i].VERSION;
                    lsprod.SCENARIO = liverscen[i].SCENARIO;
                    liprodver.push(lsprod);
                    lsprod = {};
                    vFlag = 'X';
                    break;
                }
            }
            if (vFlag !== 'X') {
                for (iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
                    if (lipartialprod[iPartial].REF_PRODID === liprod[iProd].PRODUCT_ID) {
                        lsprod.LOCATION_ID = lipartialprod[iPartial].LOCATION_ID;
                        lsprod.PRODUCT_ID = lipartialprod[iPartial].REF_PRODID;
                        lsprod.VERSION = lipartialprod[iPartial].VERSION;
                        lsprod.SCENARIO = lipartialprod[iPartial].SCENARIO;
                        liprodver.push(lsprod);
                        lsprod = {};
                        vFlag = ' ';
                    }
                }
            }
        }
        const keys = ['PRODUCT_ID', 'VERSION', 'SCENARIO'];
        return GenFunctions.removeDuplicate(liprodver, keys);
    });

    // Maintain partial configurations for new product
    srv.on("changeToCritical", async (req) => {
        let liresults = [];
        let lsresults = {};
        let responseMessage = '';
        let li_crtcomp = {};

        li_crtcomp = JSON.parse(req.data.criticalComp);
        lsresults.LOCATION_ID = li_crtcomp[0].LOCATION_ID;
        lsresults.PRODUCT_ID = li_crtcomp[0].PRODUCT_ID;
        lsresults.COMPONENT = li_crtcomp[0].COMPONENT;
        lsresults.ITEM_NUM = li_crtcomp[0].ITEM_NUM;
        lsresults.CRITICALKEY = li_crtcomp[0].CRITICALKEY;
        liresults.push(lsresults);
        if (liresults.length > 0) {
            try {
                await UPDATE`CP_CRITICAL_COMP`
                    .with({
                        CRITICALKEY: lsresults.CRITICALKEY
                    })
                    .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                                          AND PRODUCT_ID = '${lsresults.PRODUCT_ID}'
                                          AND ITEM_NUM = '${lsresults.ITEM_NUM}'
                                          AND COMPONENT = '${lsresults.COMPONENT}'`);
                // await cds.run(INSERT.into("CP_CRITICAL_COMP").entries(liresults));
                responseMessage = "Critical Component udpated";
            } catch (e) {
                responseMessage = "Critical Component udpate failed";
            }
        }
        return responseMessage;
    });
    // Planning Configuration
    // BOI - Deepa
    srv.on("postParameterValues", async (req) => {
        let aParamVals = [];
        let oParamVals = {};
        let oParamValues = {};
        let bFlag = false;
        var responseMessage;
        oParamValues = JSON.parse(req.data.PARAMVALS);
        if (req.data.FLAG === "C" || req.data.FLAG === "U") {
            try {
                await cds.run(DELETE.from('CP_PARAMETER_VALUES').where(`LOCATION_ID = '${oParamValues[0].LOCATION_ID}'`));
            } catch {
                bFlag = true;
            }

            for (var i = 0; i < oParamValues.length; i++) {
                oParamVals.LOCATION_ID = oParamValues[i].LOCATION_ID;
                oParamVals.PARAMETER_ID = parseInt(oParamValues[i].PARAMETER_ID);
                oParamVals.VALUE = oParamValues[i].VALUE;
                aParamVals.push(oParamVals);
                oParamVals = {};
            }
            if (aParamVals.length > 0 && bFlag === false) {
                try {
                    await cds.run(INSERT.into('CP_PARAMETER_VALUES').entries(aParamVals));
                    responseMessage = " Creation/Updation successful";
                } catch (e) {
                    responseMessage = " Creation failed";
                }
            }
        }
        lsresults = {};
        return responseMessage;
    });

    // Service for Weekly Customer Independent Requirement Quantities
    srv.on("getCIRWeekly", async (req) => {
        const objCIR = new CIRService();
        let oCIRData = {};
        oCIRData = await objCIR.getCIRData(req);

        let vDateFrom = req.data.FROMDATE; //"2022-03-04";
        let vDateTo = req.data.TODATE; //"2023-01-03";
        let liCIRWeekly = [];
        let lsCIRWeekly = {};
        let liDates = [],
            vWeekIndex,
            vCIRIndex,
            vDateIndex,
            vComp,
            lsDates = {};
        let columnname = "WEEK";
        let aCIR_ID = [];

        // const liCIRGen = await cds.run(`SELECT * from "CP_CIR_GENERATED" WHERE "LOCATION_ID" = '` +
        //     req.data.LOCATION_ID +
        //     `'`);

        // const liCIRQty = await cds.run(
        //     `
        //     SELECT * 
        //     FROM "CP_CIR_GENERATED" 
        //     inner join "CP_PARTIALPROD_INTRO"
        //     ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_PARTIALPROD_INTRO"."PRODUCT_ID"
        //     AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_PARTIALPROD_INTRO"."LOCATION_ID"
        //     WHERE  "CP_CIR_GENERATED"."LOCATION_ID" = '` +
        //     req.data.LOCATION_ID +
        //     `'
        //          AND  "CP_PARTIALPROD_INTRO"."REF_PRODID" = '` +
        //     req.data.PRODUCT_ID +
        //     `' AND  "CP_CIR_GENERATED"."VERSION" = '` +
        //     req.data.VERSION +
        //     `' AND  "CP_CIR_GENERATED"."SCENARIO" = '` +
        //     req.data.SCENARIO +
        //     `' AND (  "CP_CIR_GENERATED"."WEEK_DATE" <= '` +
        //     vDateTo +
        //     `' AND  "CP_CIR_GENERATED"."WEEK_DATE" >= '` +
        //     vDateFrom +
        //     `') AND  "CP_CIR_GENERATED"."MODEL_VERSION" = '` +
        //     req.data.MODEL_VERSION +
        //     `'
        //          ORDER BY 
        //          "CP_CIR_GENERATED"."LOCATION_ID" ASC, 
        //          "CP_CIR_GENERATED"."PRODUCT_ID" ASC,
        //          "CP_CIR_GENERATED"."VERSION" ASC,
        //          "CP_CIR_GENERATED"."SCENARIO" ASC,
        //          "CP_CIR_GENERATED"."WEEK_DATE" ASC`
        // );


        // const liUniqueId = await cds.run(
        //     `
        //   SELECT DISTINCT "CP_CIR_GENERATED"."LOCATION_ID", 
        //   "CP_CIR_GENERATED"."PRODUCT_ID",
        //   "CP_CIR_GENERATED"."VERSION",
        //   "CP_CIR_GENERATED"."SCENARIO",
        //   "CP_CIR_GENERATED"."UNIQUE_ID"
        //                   FROM "CP_CIR_GENERATED" 
        //                   inner join "CP_PARTIALPROD_INTRO"
        //                   ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_PARTIALPROD_INTRO"."PRODUCT_ID"
        //                   AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_PARTIALPROD_INTRO"."LOCATION_ID"
        //                   WHERE  "CP_CIR_GENERATED"."LOCATION_ID" = '` +
        //     req.data.LOCATION_ID +
        //     `' AND  "CP_PARTIALPROD_INTRO"."REF_PRODID" = '` +
        //     req.data.PRODUCT_ID +
        //     `' AND  "CP_CIR_GENERATED"."VERSION" = '` +
        //     req.data.VERSION +
        //     `' AND  "CP_CIR_GENERATED"."SCENARIO" = '` +
        //     req.data.SCENARIO +
        //     `' AND (  "CP_CIR_GENERATED"."WEEK_DATE" <= '` +
        //     vDateTo +
        //     `' AND  "CP_CIR_GENERATED"."WEEK_DATE" >= '` +
        //     vDateFrom +
        //     `') AND  "CP_CIR_GENERATED"."MODEL_VERSION" = '` +
        //     req.data.MODEL_VERSION +
        //     `'
        //                        ORDER BY 
        //                        "CP_CIR_GENERATED"."LOCATION_ID" ASC, 
        //                        "CP_CIR_GENERATED"."PRODUCT_ID" ASC,
        //                        "CP_CIR_GENERATED"."VERSION" ASC,
        //                        "CP_CIR_GENERATED"."SCENARIO" ASC,
        //                        "CP_CIR_GENERATED"."UNIQUE_ID" ASC`
        // );

        const liCIRQty = oCIRData.liCIRQty;
        const liUniqueId = oCIRData.liUniqueId;

        let vDateSeries = vDateFrom;
        let dDate = new Date(vDateSeries);
        let dDay = dDate.getDay();
        if (dDay === 1) {
            lsDates.WEEK_DATE = vDateFrom;
        } else {
            lsDates.WEEK_DATE = GenFunctions.getNextMondayCmp(vDateSeries);
        }
        vDateSeries = lsDates.WEEK_DATE;
        liDates.push(lsDates);
        lsDates = {};
        while (vDateSeries <= vDateTo) {
            vDateSeries = GenFunctions.addDays(vDateSeries, 7);

            lsDates.WEEK_DATE = vDateSeries;//GenFunctions.getNextSundayCmp(vDateSeries);

            liDates.push(lsDates);
            lsDates = {};
        }
        vComp = 0;

        for (let j = 0; j < liUniqueId.length; j++) {
            // Initially set vWeekIndex to j to geneate Week columns
            // vCompIndex is to get Componnent quantity for all dates
            vWeekIndex = 0; //j
            lsCIRWeekly.UNIQUE_ID = liUniqueId[j].UNIQUE_ID;
            lsCIRWeekly.UNIQUE_DESC = liUniqueId[j].UNIQUE_DESC;
            lsCIRWeekly.LOCATION_ID = liUniqueId[j].LOCATION_ID;
            lsCIRWeekly.PRODUCT_ID = liUniqueId[j].PRODUCT_ID;
            lsCIRWeekly.MODEL_VERSION = req.data.MODEL_VERSION;
            lsCIRWeekly.VERSION = req.data.VERSION;
            lsCIRWeekly.SCENARIO = req.data.SCENARIO;
            aCIR_ID = [];

            for (let i = 0; i < liDates.length; i++) {
                vWeekIndex = vWeekIndex + 1;
                for (vCIRIndex = 0; vCIRIndex < liCIRQty.length; vCIRIndex++) {
                    lsCIRWeekly[columnname + vWeekIndex] = 0;
                    if (
                        liCIRQty[vCIRIndex].UNIQUE_ID === lsCIRWeekly.UNIQUE_ID &&
                        liCIRQty[vCIRIndex].WEEK_DATE === liDates[i].WEEK_DATE
                    ) {
                        lsCIRWeekly[columnname + vWeekIndex] =
                            liCIRQty[vCIRIndex].CIR_QTY;

                        aCIR_ID.push(liCIRQty[vCIRIndex].CIR_ID);

                        break;
                    }
                }
            }
            lsCIRWeekly.CIR_ID = aCIR_ID;
            liCIRWeekly.push(GenFunctions.parse(lsCIRWeekly));
            lsCIRWeekly = {};
        }
        // liCompWeekly.sort(GenFunctions.dynamicSortMultiple("STRUC_NODE", "UNIQUE_ID", "ITEM_NUM"));
        return liCIRWeekly;
    });


    srv.on("getUniqueIdItems", async (req) => {
        let { genAsmbComp } = srv.entities;
        // let vDateFrom = req.data.FROMDATE; //"2022-03-04";
        // let vDateTo = req.data.TODATE; //"2023-01-03";
        let liUniqueItems = [];
        let lsUniqueItems = {};
        let vUniqueId = req.data.UNIQUE_ID;
        // let liDates = [],
        //     vWeekIndex,
        //     vCompIndex,
        //     vDateIndex,
        //     vComp,
        //     lsDates = {};
        // let columnname = "WEEK";



        const ltUniqueItems = await cds.run(
            `
            SELECT * FROM "CP_UNIQUE_ID_ITEM"
            WHERE "UNIQUE_ID" = '` + vUniqueId + `'`
        );

    });

    // Retriction rule
    // Maintain partial configurations for new product
    srv.on("maintainRestrDetail", async (req) => {
        let aRtrDetailsIns = [];
        let oRtrDetailsIns = {};
        let aRtrChar = {};
        let responseMessage;
        let aFilteredChars = [];
        let aFilteredResults = [];
        let aCharCounters = [];
        let oCharCounter = {};
        let index = 0, iCounter = 0, imaxCounter = 0;
        aRtrChar = JSON.parse(req.data.RTRCHAR);
        let sRTR = aRtrChar[0].RESTRICTION;

        const aRtrDetails = await cds.run(
            `SELECT *
            FROM "CP_RESTRICT_DETAILS" 
            WHERE "RESTRICTION" = '` + sRTR + `'
            ORDER BY  "CHAR_NUM", "CHAR_COUNTER"`
        );

        if (req.data.FLAG === "C" || req.data.FLAG === "E") {
            aFilteredChars = [];
            iCounter = 0;
            if (aCharCounters.length > 0) {
                aFilteredChars = aCharCounters.filter(function (aCharCounter) {
                    return aCharCounter.CHAR_NUM === aRtrChar[i].CHAR_NUM;
                });
            }
            if (aFilteredChars.length === 0) {
                aFilteredChars = aRtrDetails.filter(function (aRtrChars) {
                    return aRtrChars.CHAR_NUM === aRtrChar[i].CHAR_NUM;
                });
            }

            if (aFilteredChars.length > 0) {
                iCounter = aFilteredChars[0].CHAR_COUNTER;

                oCharCounter.CHAR_COUNTER = iCounter;
                aCharCounters.push(oCharCounter);
            }

            responseMessage = errRes.message;
            // }

        } else if (req.data.FLAG === "D") {
            for (var i = 0; i < aRtrChar.length; i++) {
                oRtrDetailsIns.RESTRICTION = aRtrChar[i].RESTRICTION;
                oRtrDetailsIns.CLASS_NUM = aRtrChar[i].CLASS_NUM;
                oRtrDetailsIns.CHAR_NUM = aRtrChar[i].CHAR_NUM;
                oRtrDetailsIns.CHARVAL_NUM = aRtrChar[i].CHARVAL_NUM;
                try {
                    await cds.delete("CP_RESTRICT_DETAILS", oRtrDetailsIns);
                    responseMessage = "Restriction Rule Deleted Successfully";
                    iCounter = aRtrChar[i].CHAR_COUNTER;
                    break;
                } catch (errRes) {
                    //DONOTHING
                    responseMessage = errRes.message;;
                }

            }


            if (iCounter > 0) { //  if deletion is successfull
                aRtrDetailsIns = [];
                oRtrDetailsIns = {};
                aFilteredChars = [];

                // To check the count of char counter being deleted 
                aFilteredChars = aRtrDetails.filter(function (aRtrChars) {
                    return aRtrChars.CHAR_COUNTER === iCounter;
                });
                if (aFilteredChars.length === 1) {
                    // Below logic is to decrease the existing char counters above deleted counter by 1 and insert
                    // This is to maintain the sequence of counters 
                    for (let j = 0; j < aRtrDetails.length; j++) {
                        if (aRtrDetails[j].CHAR_COUNTER > iCounter) {
                            try {
                                await cds.delete("CP_RESTRICT_DETAILS", aRtrDetails[j]);
                                oRtrDetailsIns.RESTRICTION = aRtrDetails[j].RESTRICTION;
                                oRtrDetailsIns.CLASS_NUM = aRtrDetails[j].CLASS_NUM;
                                oRtrDetailsIns.CHAR_NUM = aRtrDetails[j].CHAR_NUM;
                                oRtrDetailsIns.CHAR_COUNTER = aRtrDetails[j].CHAR_COUNTER - 1;
                                oRtrDetailsIns.CHARVAL_NUM = aRtrDetails[j].CHARVAL_NUM;
                                oRtrDetailsIns.OD_CONDITION = aRtrDetails[j].OD_CONDITION;
                                oRtrDetailsIns.ROW_ID = aRtrDetails[j].CHAR_COUNTER - 1;
                                aRtrDetailsIns.push(oRtrDetailsIns);
                                oRtrDetailsIns = {};
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }

                    if (aRtrDetailsIns.length > 0) {
                        try {
                            await cds.run(INSERT.into("CP_RESTRICT_DETAILS").entries(aRtrDetailsIns));
                        } catch (e) {
                            //DONOTHING
                        }
                    }
                }
            }
        }
        oRtrDetailsIns = {};
        return responseMessage;
    });    

    // POST Service for Unique Characteristic Items and Weekly Quantities
    srv.on("postCIRQuantities", async (req) => {
        const objCIR = new CIRService();
        const oModel = await cds.connect.to('S4ODataService');
        let oCIRData = {};
        oCIRData = await objCIR.getCIRData(req);
        const liCIRQty = oCIRData.liCIRQty;
        const liUniqueId = oCIRData.liUniqueId;
        const aUniqueIdChar = await objCIR.getUniqueIdCharacteristics(req);
        // const sLoginUserId = req.headers['x-username'];
        const sCFDestUser = req.data.VALIDUSER;   
        let aFilteredChar = [], aFilteredCIR = [];
        let sUniqueId = "";
        let oUniqueIdChars = {};
        let aUniqueIdChars = [];
        let oEntry = {};  
        

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
                // oEntry.User_Id = sLoginUserId;
                oEntry.HeaderConfig = aUniqueIdChars;
                try {
                    let sReturn = await oModel.tx(req).post("/headerSet", oEntry);
                    console.log(sReturn);
                }
                catch (e) {
                    console.log(e);
                }

            }
            if (i === 1) {
                break;
            }
        }

    });

    srv.on("postCIRQuantitiesToS4", async (req) => {
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
                if(sLoginUserId) {
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

    });
    // Save CIR FIRM Quantities
    srv.on("modifyCIRFirmQuantities", async (req) => {
        let aCIRQuantities = [];
        let oCIRQtys = {};
        let oCIRQuantities = {};
        let bFlag = false;
        var responseMessage;
        oCIRQuantities = JSON.parse(req.data.CIR_QUANTITIES);
        if (req.data.FLAG === "U") {

            for (var i = 0; i < oCIRQuantities.length; i++) {
                oCIRQtys.LOCATION_ID = oCIRQuantities[i].LOCATION_ID;
                oCIRQtys.PRODUCT_ID = oCIRQuantities[i].PRODUCT_ID;
                oCIRQtys.WEEK_DATE = oCIRQuantities[i].WEEK_DATE;
                oCIRQtys.CIR_ID = oCIRQuantities[i].CIR_ID;
                oCIRQtys.MODEL_VERSION = oCIRQuantities[i].MODEL_VERSION;
                oCIRQtys.VERSION = oCIRQuantities[i].VERSION;
                oCIRQtys.SCENARIO = oCIRQuantities[i].SCENARIO;
                oCIRQtys.UNIQUE_ID = oCIRQuantities[i].UNIQUE_ID;
                oCIRQtys.CIR_QTY = oCIRQuantities[i].CIR_QTY;

                try {
                    await UPDATE`CP_CIR_GENERATED`
                        .with({
                            CIR_QTY: oCIRQtys.CIR_QTY
                        })
                        .where(`LOCATION_ID = '${oCIRQtys.LOCATION_ID}'
                                      AND PRODUCT_ID = '${oCIRQtys.PRODUCT_ID}'                                      
                                      AND WEEK_DATE = '${oCIRQtys.WEEK_DATE}'
                                      AND CIR_ID = '${oCIRQtys.CIR_ID}'
                                      AND MODEL_VERSION = '${oCIRQtys.MODEL_VERSION}'
                                      AND VERSION = '${oCIRQtys.VERSION}'
                                      AND SCENARIO = '${oCIRQtys.SCENARIO}'
                                      AND UNIQUE_ID = '${oCIRQtys.UNIQUE_ID}'                                      
                                      `);
                    responseMessage = " CIR Quantities Updated successfully";
                } catch (e) {
                    console.log(e);
                }

                // aCIRQuantities.push(oCIRQtys);
                oCIRQtys = {};
            }
            // if (aCIRQuantities.length > 0 && bFlag === false) {
            //     try {
            //         // await cds.run(INSERT.into('CP_CIR_GENERATED').entries(aCIRQuantities));
            //         responseMessage = " Creation/Updation successful";
            //     } catch (e) {
            //         responseMessage = " Creation failed";
            //     }
            // }
        }
        oCIRQtys = {};
        return responseMessage;
    });

    // EOI - Deepa
    
    ///////////////////////////////////////////////////////////
    srv.on("generateMarketAuthfn", async (request) => {
        //     var flag, lMessage = '';
        //     // Generating payload for job scheduler logs
        //     // let lilocProd = {};
        //     // let lsData = {};
        //     // let createtAt = new Date();
        //     // let id = uuidv1();
        //     // let values = [];
        //     // let message = "Started importing IBP Future Demand and Characteristic Plan";
        //     // let res = req._.req.res;
        //     // let lilocProdReq = JSON.parse(req.data.MARKETDATA);

        //     if (lilocProdReq[0].PRODUCT_ID === "ALL") {
        //         lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
        //         lsData.PRODUCT_ID = lilocProdReq[0].PRODUCT_ID;
        //         const objCatFn = new Catservicefn();
        //         const lilocProdT = await objCatFn.getAllProducts(lsData);
        //         // lsData = {};
        //         const litemp = JSON.stringify(lilocProdT);
        //         lilocProd = JSON.parse(litemp);
        //     }
        //     else {
        // lilocProd = JSON.parse(req.data);
        //     }
        //     values.push({ id, createtAt, message, lilocProd });
        //     res.statusCode = 202;
        //     res.send({ values });
        let flag = await obibpfucntions.importFutureDemandcharPlan(request);

        // if (flag === 'S') {
        //     for (let iloc = 0; iloc < lilocProd.length; iloc++) {
        //         lsData.LOCATION_ID = lilocProd[iloc].LOCATION_ID;
        //         lsData.PRODUCT_ID = lilocProd[iloc].PRODUCT_ID;
        //         const licir = await cds.run(
        //             `
        //         SELECT *
        //            FROM "V_CIRTOIBP" 
        //            WHERE LOCATION_ID = '${lsData.LOCATION_ID}'
        //                       AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
        //                       AND ( WEEK_DATE > '${lilocProdReq[0].WEEK_DATE}'
        //                       AND WEEK_DATE < '${lilocProdReq[0].WEEK_DATE}' )`);

        //         //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        //         for (let i = 0; i < licir.length; i++) {

        //             var vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
        //             vCIR = {
        //                 "LOCID": licir[i].LOCATION_ID,
        //                 "PRDID": licir[i].PRODUCT_ID,
        //                 "VCCLASS": licir[i].CLASS_NUM,
        //                 "VCCHAR": licir[i].CHAR_NUM,
        //                 "VCCHARVALUE": licir[i].CHARVAL_NUM,
        //                 "CUSTID": "NULL",
        //                 "CIRQTY": licir[i].CIRQTY.toString(),
        //                 "PERIODID4_TSTAMP": vWeekDate
        //             };
        //             oReq.cir.push(vCIR);
        //         }
        //         var vTransID = new Date().getTime().toString();
        //         var oEntry =
        //         {
        //             "Transactionid": vTransID,
        //             "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,CUSTID,CIRQTY,PERIODID4_TSTAMP",
        //             "DoCommit": true,
        //             "NavSBPVCP": oReq.cir
        //         }

        //         try {
        //             await service.tx(request).post("/SBPVCPTrans", oEntry);
        //             flag = 'X';
        //         }
        //         catch (err) {
        //             console.log(err);
        //             flag = ' ';
        //         }

        //         if (flag === 'X') {
        //             lMessage = lMessage + ' ' + "Export of CIR to IBP is successful for product" + lsData.PRODUCT_ID;
        //         } else {
        //             lMessage = lMessage + ' ' + "Export of CIR to IBP has failed for product" + lsData.PRODUCT_ID;
        //         }

        //         GenF.jobSchMessage('X', lMessage, request);
        //     }
        // }
        // GenF.jobSchMessage('X', lMessage, request);
    });
    /////////////////////////////////////////////////////////////////
    //VC Planner Document Maintenance- Pradeep
    srv.on("moveData", async req => {
        let contentData = {};
        var deleteData = {};
        var checkCONTENT = {};
        var createResults = [];
        var deleteResults = [];
        var Flag = req.data.Flag;
        var responseMessage;
        var responseMessage1;
        deleteData.PAGEID = req.data.PAGEID;
        checkCONTENT.CONTENT = req.data.CONTENT

        contentData.CONTENT = req.data.CONTENT;
        contentData.DESCRIPTION = req.data.DESCRIPTION;
        contentData.PAGEID = req.data.PAGEID;

        if (Flag === "i") {
            try {
                await cds.delete("CP_PAGEPARAGRAPH", deleteData);
                responseMessage = "Deletion successfull";
                deleteResults.push(responseMessage);

            } catch (e) {
                responseMessage = " Deletion Failed";
                deleteResults.push(responseMessage);
            }
            try {
                await cds.run(INSERT.into("CP_PAGEPARAGRAPH").entries(contentData));
                responseMessage1 = "Updated Successfully";
                createResults.push(responseMessage1);
            } catch (e) {
                responseMessage1 = " Updation Failed";
                createResults.push(responseMessage1);
            }
        }
        return responseMessage1;
    });

    srv.on("addPAGEHEADER", async req => {
        let masterData = {};
        var masterResults = [];
        var responseMessage1;
        var Flag1 = req.data.Flag1;
        if (Flag1 === 'n') {
            masterData.PAGEID = req.data.PAGEID;
            masterData.DESCRIPTION = req.data.DESCRIPTION;
            masterData.PARENTNODEID = req.data.PARENTNODEID;
            masterData.HEIRARCHYLEVEL = req.data.HEIRARCHYLEVEL;
            try {
                await cds.run(INSERT.into("CP_PAGEHEADER").entries(masterData));
                responseMessage1 = "Updated Successfully in PAGEHEADER";
                masterResults.push(responseMessage1);
            } catch (e) {
                responseMessage1 = " Updation Failed";
                masterResults.push(responseMessage1);
            }

        }
        return responseMessage1;
    });
    srv.on("addPAGEPARAGRAPH", async req => {
        let detailData = {};
        var detailResults = [];
        var responseMessage1;
        var Flag1 = req.data.Flag1;
        if (Flag1 === 'n') {
            detailData.PAGEID = req.data.PAGEID;
            detailData.DESCRIPTION = req.data.DESCRIPTION;
            detailData.CONTENT = req.data.CONTENT;
            try {
                await cds.run(INSERT.into("CP_PAGEPARAGRAPH").entries(detailData));
                responseMessage1 = "Updated Successfully in PAGEHEADER";
                detailResults.push(responseMessage1);
            } catch (e) {
                responseMessage1 = " Updation Failed";
                detailResults.push(responseMessage1);
            }
        }
        return responseMessage1;
    });
    srv.on("deletePAGEHEADER", async req => {
        let deleteNode = {};
        var deleteResults = [];
        var responseMessage1;
        var Flag = req.data.Flag1;
        deleteNode.PAGEID = req.data.PAGEID;
        if (Flag === "d") {
            try {
                await cds.delete("CP_PAGEHEADER", deleteNode);
                responseMessage1 = "Deletion successfull";
                deleteResults.push(responseMessage1);

            } catch (e) {

                responseMessage1 = "Deletion Failed";
                deleteResults.push(responseMessage1);
            }
        }
        return responseMessage1;
    });

    srv.on("deletePAGEPARAGRAPH", async req => {
        let deleteNode = {};
        var deleteResults = [];
        var responseMessage1;
        var Flag = req.data.Flag1;
        deleteNode.PAGEID = req.data.PAGEID;
        if (Flag === "d") {
            try {
                await cds.delete("CP_PAGEPARAGRAPH", deleteNode);
                responseMessage1 = "Deletion successfull";
                deleteResults.push(responseMessage1);
            } catch (e) {
                responseMessage1 = "Deletion Failed";
                deleteResults.push(responseMessage1);
            }
        }
        return responseMessage1;
    });
    srv.on("editPAGEPARAGRAPH", async req => {
        let contentData = {};
        var deleteData = {};
        var createResults = [];
        var deleteResults = [];
        var Flag = req.data.Flag1;
        var responseMessage;
        var responseMessage1;
        deleteData.PAGEID = req.data.PAGEID;
        if (Flag === "e") {
            try {
                await cds.delete("CP_PAGEPARAGRAPH", deleteData);
                responseMessage = "Deletion successfull";
                deleteResults.push(responseMessage);
            } catch (e) {
                responseMessage = "Deletion Failed";
                deleteResults.push(responseMessage);
            }
            contentData.CONTENT = req.data.CONTENT;
            // contentData.ENTRY_TYPE = req.data.ENTRY_TYPE;
            // contentData.POSITION = req.data.POSITION;
            contentData.DESCRIPTION = req.data.DESCRIPTION;
            contentData.PAGEID = req.data.PAGEID;

            try {
                await cds.run(INSERT.into("CP_PAGEPARAGRAPH").entries(contentData));
                responseMessage1 = "Updated Successfully";
                createResults.push(responseMessage1);
            } catch (e) {
                responseMessage1 = " Updation Failed";
                createResults.push(responseMessage1);
            }
        }
        return responseMessage1;
    });

    srv.on("editPAGEHEADER", async req => {
        let masterData = {};
        var deleteData = {};

        var createResults = [];
        var deleteResults = [];
        var Flag = req.data.Flag1;
        var responseMessage;
        var responseMessage1;
        deleteData.PAGEID = req.data.PAGEID;

        if (Flag === "e") {
            try {

                await cds.delete("CP_PAGEHEADER", deleteData);

                responseMessage = " Deletion successfull";

                deleteResults.push(responseMessage);

            } catch (e) {

                responseMessage = " Deletion Failed";

                deleteResults.push(responseMessage);

            }
            masterData.PAGEID = req.data.PAGEID;
            masterData.DESCRIPTION = req.data.DESCRIPTION;
            masterData.PARENTNODEID = req.data.PARENTNODEID;
            masterData.HEIRARCHYLEVEL = req.data.HEIRARCHYLEVEL;
            // masterData.DRILLSTATE = req.data.DRILLSTATE;
            try {
                await cds.run(INSERT.into("CP_PAGEHEADER").entries(masterData));
                responseMessage1 = "Updated Successfully";
                createResults.push(responseMessage1);
            } catch (e) {
                responseMessage1 = " Updation Failed";
                createResults.push(responseMessage1);
            }
        }
        return responseMessage1;


    });

    //End of VC Planner Document Maintenance- Pradeep

    // BOI Deepa
    srv.on('getCFAuthToken', async (res) => {
        let sData = '';
        const request = require('request');
        const rp = require('request-promise');
        const cfenv = require('cfenv');

        /*********************************************************************
         *************** Step 1: Read the environment variables ***************
         *********************************************************************/
        const oServices = cfenv.getAppEnv().getServices();
        const uaa_service = cfenv.getAppEnv().getService('config_products-xsuaa-service');
        const dest_service = cfenv.getAppEnv().getService('config_products-destination-service');
        const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

        const sDestinationName = 'S4D_HTTP';
        const sEndpoint = '/secure/';

        /*********************************************************************
         **** Step 2: Request a JWT token to access the destination service ***
         *********************************************************************/
        const post_options = {
            url: uaa_service.credentials.url + '/oauth/token',
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
                'Content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                'client_id': dest_service.credentials.clientid,
                'grant_type': 'client_credentials'
            }
        }

        let ret_response = "";
        await rp(post_options)
            .then(function (response) {
                console.log('Get Token - Success');
                ret_response = JSON.parse(response).access_token;

            })
            .catch(function (error) {
                console.log('Get Token - Error ', error);
                ret_response = JSON.parse(error);
            });

        // console.log(ret_response);
        return ret_response;
    });


    srv.on('getCFDestinationUser', async (req) => {
        let sUser = '';
        const request = require('request');
        const rp = require('request-promise');
        const cfenv = require('cfenv');

        /*********************************************************************
         *************** Step 1: Read the environment variables ***************
         *********************************************************************/
        const oServices = cfenv.getAppEnv().getServices();
        const uaa_service = cfenv.getAppEnv().getService('config_products-xsuaa-service');
        const dest_service = cfenv.getAppEnv().getService('config_products-destination-service');
        const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

        const sDestinationName = 'S4D_HTTP';
        const sEndpoint = '/secure/';       


        /*************************************************************
         *** Step 3: Search your destination in the destination service ***
         *************************************************************/
        const token = req.data.TOKEN;   //JSON.parse(req.data.DATA).access_token;
        const get_options = {
            url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + sDestinationName,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        let ret_response = "";
        await rp(get_options)
            .then(function (response) {
                const oDestination = JSON.parse(response);
                console.log(oDestination.destinationConfiguration.User);
                ret_response = oDestination.destinationConfiguration.User;
            })
            .catch(function (error) {
                console.log('Get Destination - Error ', error);
                ret_response = JSON.parse(error);
            });

        // console.log(ret_response);
        return ret_response;        

    });


    srv.on('getUserInfo', async (req) => {
          console.log("Login User", req.user.id); 
          return req.user.id;
    });



    // EOI Deepa
};
