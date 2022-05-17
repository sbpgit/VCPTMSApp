//const GenTimeseries = require("./cat-servicets");
const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
//const ComponentReq = require("./component-req");
const GenTimeseries = require("./gen-timeseries");
const containerSchema = cds.env.requires.db.credentials.schema;
// Create connection parameters to continer
const conn_params_container = {
    serverNode:
        cds.env.requires.db.credentials.host +
        ":" +
        cds.env.requires.db.credentials.port,
    uid: cds.env.requires.db.credentials.user, //cds userid environment variable
    pwd: cds.env.requires.db.credentials.password, //cds password environment variable
    encrypt: "TRUE",
    //  ssltruststore: cds.env.requires.hana.credentials.certificate,
};

module.exports = (srv) => {
    // srv.
    srv.after('READ', 'getLocation', async (data, req) => {
        vUser = req.headers['x-username'];
        const li_roleparam = await cds.run(
            `
            SELECT * FROM "V_USERROLE"
            WHERE "USER" = '`+ vUser + `'
            AND PARAMETER = 'LOCATION_ID'`
        );
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

        for (var cnRs = req.results.length - 1; cnRs >= 0; cnRs--) {
            for (var cnRL = 0; cnRL < li_roleparam.length; cnRL++) {
                if (li_roleparam[cnRL].PARAMETER_VAL !== req.results[cnRs].LOCATION_ID) {
                    req.results.splice(cnRs, 1);
                }
            }
        }
    })
    // Service for weekly component requirements- assembly
    srv.on("getCompReqFWeekly", async (req) => {
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
            SELECT * FROM "V_COMP_REQ"
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
                      "ITEM_NUM" ASC,
                      "COMPONENT" ASC,
                      "CAL_DATE" ASC,
                      "STRUC_NODE" ASC`
        );
        const liComp = await cds.run(
            `
          SELECT DISTINCT "LOCATION_ID",
                          "PRODUCT_ID",
                          "VERSION",
                          "SCENARIO",
                          "ITEM_NUM",
                          "COMPONENT",
                          "STRUC_NODE"
          FROM "V_COMP_REQ"
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
                    "ITEM_NUM" ASC,
                    "COMPONENT" ASC`
        );
        var vDateSeries = vDateFrom;
        lsDates.CAL_DATE = GenFunctions.getNextSundayCmp(vDateSeries);
        vDateSeries = lsDates.CAL_DATE;
        liDates.push(lsDates);
        lsDates = {};
        while (vDateSeries <= vDateTo) {
            vDateSeries = GenFunctions.addDays(vDateSeries, 7);

            lsDates.CAL_DATE = GenFunctions.getNextSundayCmp(vDateSeries);
            vDateSeries = lsDates.CAL_DATE;

            liDates.push(lsDates);
            lsDates = {};
        }

        for (let j = 0; j < liComp.length; j++) {
            // Initially set vWeekIndex to j to geneate Week columns
            // vCompIndex is to get Componnent quantity for all dates
            vWeekIndex = 0; //j
            lsCompWeekly.LOCATION_ID = liComp[j].LOCATION_ID;
            lsCompWeekly.PRODUCT_ID = liComp[j].PRODUCT_ID;
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
                        liCompQty[vCompIndex].CAL_DATE === liDates[i].CAL_DATE
                    ) {
                        lsCompWeekly.STRUC_NODE = liCompQty[vCompIndex].STRUC_NODE;
                        lsCompWeekly[columnname + vWeekIndex] =
                            liCompQty[vCompIndex].COMP_QTY;
                        break;
                    }
                }
            }
            liCompWeekly.push(GenFunctions.parse(lsCompWeekly));
            lsCompWeekly = {};
        }
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

        const liasmbcomp = await cds.run(`SELECT * from "CP_ASSEMBLY_COMP" WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'`);

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
        lsDates.CAL_DATE = GenFunctions.getNextSundayCmp(vDateSeries);
        vDateSeries = lsDates.CAL_DATE;
        liDates.push(lsDates);
        lsDates = {};
        while (vDateSeries <= vDateTo) {
            vDateSeries = GenFunctions.addDays(vDateSeries, 7);

            lsDates.CAL_DATE = GenFunctions.getNextSundayCmp(vDateSeries);
            vDateSeries = lsDates.CAL_DATE;

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
            lsCompWeekly = {};
        }
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
        // const aProfilePara_req = req.data.PROFILEPARA;
        if (req.data.FLAG === "I" || req.data.FLAG === "E") {
            //for (let i = 0; i < aProfilePara_req.length; i++) {
            lsprofilesPara.PROFILE = req.data.PROFILE;
            if (lsprofilesPara.PROFILE !== undefined) {
                lsprofilesPara.METHOD = req.data.METHOD;
                lsprofilesPara.PARA_NAME = req.data.PARA_NAME;
                lsprofilesPara.INTVAL = req.data.INTVAL;
                lsprofilesPara.DOUBLEVAL = req.data.DOUBLEVAL;
                lsprofilesPara.STRVAL = req.data.STRVAL;
                lsprofilesPara.PARA_DESC = req.data.PARA_DESC;
                lsprofilesPara.PARA_DEP = null; //req.data.PARA_DEP;
                lsprofilesPara.CREATED_DATE = curDate;
                lsprofilesPara.CREATED_BY = ""; //req.data.CREATED_BY;
                if (req.data.FLAG === "E") {
                    await cds.delete("CP_PAL_PROFILEMETH_PARA", lsprofilesPara);
                }
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
            for (let i = 0; i < aProfilePara_req.length; i++) {
                lsprofilesPara.PROFILE = req.data.PROFILE;
                break;
            }
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
        //res.send({ value: createResults });
    });
    // Assign profile sot object dependency
    srv.on("asssignProfilesOD", async (req) => {
        let liProfilesOD = [];
        let liProfilesDel = [];
        let lsprofilesOD = {};
        let lsprofilesDel = {};
        let createResults = [];
        let res;
        var responseMessage;
        var datetime = new Date();
        var curDate = datetime.toISOString().slice(0, 10);

        const aProfileOD_req = req.data.PROFILEOD;
        res = req._.req.res;
        //  for (let i = 0; i < aProfileOD_req.length; i++) {
        lsprofilesOD.PROFILE = req.data.PROFILE;
        if (lsprofilesOD.PROFILE !== undefined || req.data.FLAG === "D") {
            lsprofilesOD.LOCATION_ID = req.data.LOCATION_ID;
            lsprofilesOD.PRODUCT_ID = req.data.PRODUCT_ID;
            lsprofilesOD.COMPONENT = req.data.COMPONENT;
            lsprofilesOD.OBJ_DEP = req.data.OBJ_DEP;
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
            lsprofilesDel.OBJ_DEP = req.data.OBJ_DEP;

            liProfilesDel.push(GenFunctions.parse(lsprofilesDel));
            try {
                await cds.delete("CP_PAL_PROFILEOD", lsprofilesDel);
                responseMessage = " Deletion successfull ";
            } catch (e) {
                responseMessage = " Deletion failed";
            }
        }
        lsprofilesOD = {};
        //   }

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
        }
        return responseMessage;
        //res.send({ value: createResults });
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
        //res.send({ value: createResults });
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
        let createResults = [];
        let res;
        let flagvs;
        var responseMessage;
        res = req._.req.res;
        if (req.data.NODE_TYPE === "VS" && req.data.FLAG !== "D") {
            // liresults_t = await cds.run(SELECT.from("CP_PVS_NODES") .where ({CHILD_NODE: { in:req.data.CHILD_NODE}, and: {
            //    PARENT_NODE: { in:req.data.PARENT_NODE }}}))
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
        // res.send({ value: createResults });
    });
    // Service for OD History
    srv.on("genODHistory", async (req) => {
        let { getODCharH } = srv.entities;
        let liresults = [];
        let lsresults = {};
        let i, j, vObjdep, vObjcnt, vCaldate;
        const db = srv.transaction(req);
        const aodcharhdr = await cds.run(
            `SELECT
    "CAL_DATE",
    "OBJ_DEP",
    "OBJ_COUNTER",
    "SUCCESS",
    "ROW_ID",
    "CHAR_SUCCESS"
    FROM "V_TSODCHAR_H"
    WHERE "OBJ_DEP" = '` +
            req.data.OBJ_DEP +
            `'
    AND "OBJ_COUNTER" = '` +
            req.data.OBJ_COUNTER +
            `'
    ORDER BY CAL_DATE DESC, ROW_ID ASC`
        );
        let vflag = "";
        vCaldate = "";
        for (i = 0; i < aodcharhdr.length; i++) {
            if (
                vCaldate != aodcharhdr[i].CAL_DATE &&
                vCaldate !== ""
                // vObjdep !== aodcharhdr[i].OBJ_DEP &&
                // vObjcnt !== aodcharhdr[i].OBJ_COUNTER
            ) {
                vCaldate = aodcharhdr[i].CAL_DATE;
                liresults.push(lsresults);
                // vObjdep = aodcharhdr[i].OBJ_DEP;
                // vObjcnt = aodcharhdr[i].OBJ_COUNTER;
                lsresults = {};
                lsresults.CAL_DATE = aodcharhdr[i].CAL_DATE;
                lsresults.OBJ_DEP = aodcharhdr[i].OBJ_DEP;
                lsresults.OBJ_COUNTER = aodcharhdr[i].OBJ_COUNTER;
                lsresults.ODCOUNT = aodcharhdr[i].SUCCESS;
                lsresults.ROW_ID1 = aodcharhdr[i].CHAR_SUCCESS;
            } else {
                vCaldate = aodcharhdr[i].CAL_DATE;
                lsresults.CAL_DATE = aodcharhdr[i].CAL_DATE;
                lsresults.OBJ_DEP = aodcharhdr[i].OBJ_DEP;
                lsresults.OBJ_COUNTER = aodcharhdr[i].OBJ_COUNTER;
                lsresults.ODCOUNT = aodcharhdr[i].SUCCESS;
                let x = aodcharhdr[i].ROW_ID;
                if (x === 1) {
                    lsresults.ROW_ID1 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 2) {
                    lsresults.ROW_ID2 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 3) {
                    lsresults.ROW_ID3 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 4) {
                    lsresults.ROW_ID4 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 5) {
                    lsresults.ROW_ID5 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 6) {
                    lsresults.ROW_ID6 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 7) {
                    lsresults.ROW_ID7 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 8) {
                    lsresults.ROW_ID8 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 9) {
                    lsresults.ROW_ID9 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 10) {
                    lsresults.ROW_ID10 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 11) {
                    lsresults.ROW_ID11 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 12) {
                    lsresults.ROW_ID12 = aodcharhdr[i].CHAR_SUCCESS;
                }
            }
        }

        // liresults.push(lsresults);
        return liresults;
    });

    // Service for OD Future
    srv.on("genODFuture", async (req) => {
        let { getODCharF } = srv.entities;
        let liresults = [];
        let lsresults = {};
        let i, j, vObjdep, vObjcnt, vCaldate;
        const db = srv.transaction(req);
        const aodcharhdr = await cds.run(
            `SELECT
    "CAL_DATE",
    "OBJ_DEP",
    "OBJ_COUNTER",
    "VERSION",
    "SCENARIO",
    "PREDICTED",
    "ROW_ID",
    "CHAR_SUCCESS"
    FROM "V_TSODCHAR_F"
    WHERE "OBJ_DEP" = '` +
            req.data.OBJ_DEP +
            `'
    AND "OBJ_COUNTER" = '` +
            req.data.OBJ_COUNTER +
            `'
    ORDER BY CAL_DATE DESC, ROW_ID ASC`
        );
        let vflag = "";
        vCaldate = "";
        for (i = 0; i < aodcharhdr.length; i++) {
            if (
                vCaldate != aodcharhdr[i].CAL_DATE &&
                vCaldate !== ""
                // vObjdep !== aodcharhdr[i].OBJ_DEP &&
                // vObjcnt !== aodcharhdr[i].OBJ_COUNTER
            ) {
                vCaldate = aodcharhdr[i].CAL_DATE;
                liresults.push(lsresults);
                // vObjdep = aodcharhdr[i].OBJ_DEP;
                // vObjcnt = aodcharhdr[i].OBJ_COUNTER;
                lsresults = {};
                lsresults.CAL_DATE = aodcharhdr[i].CAL_DATE;
                lsresults.OBJ_DEP = aodcharhdr[i].OBJ_DEP;
                lsresults.OBJ_COUNTER = aodcharhdr[i].OBJ_COUNTER;
                lsresults.ODCOUNT = aodcharhdr[i].PREDICTED;
                lsresults.VERSION = aodcharhdr[i].VERSION;
                lsresults.SCENARIO = aodcharhdr[i].SCENARIO;
                lsresults.ROW_ID1 = aodcharhdr[i].CHAR_SUCCESS;
            } else {
                vCaldate = aodcharhdr[i].CAL_DATE;
                lsresults.CAL_DATE = aodcharhdr[i].CAL_DATE;
                lsresults.OBJ_DEP = aodcharhdr[i].OBJ_DEP;
                lsresults.OBJ_COUNTER = aodcharhdr[i].OBJ_COUNTER;
                lsresults.ODCOUNT = aodcharhdr[i].PREDICTED;
                lsresults.VERSION = aodcharhdr[i].VERSION;
                lsresults.SCENARIO = aodcharhdr[i].SCENARIO;
                let x = aodcharhdr[i].ROW_ID;
                if (x === 1) {
                    lsresults.ROW_ID1 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 2) {
                    lsresults.ROW_ID2 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 3) {
                    lsresults.ROW_ID3 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 4) {
                    lsresults.ROW_ID4 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 5) {
                    lsresults.ROW_ID5 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 6) {
                    lsresults.ROW_ID6 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 7) {
                    lsresults.ROW_ID7 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 8) {
                    lsresults.ROW_ID8 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 9) {
                    lsresults.ROW_ID9 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 10) {
                    lsresults.ROW_ID10 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 11) {
                    lsresults.ROW_ID11 = aodcharhdr[i].CHAR_SUCCESS;
                }
                if (x === 12) {
                    lsresults.ROW_ID12 = aodcharhdr[i].CHAR_SUCCESS;
                }
            }
        }

        // liresults.push(lsresults);
        return liresults;
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
                lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
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
                
                lsresults.REF_CLASS_NUM = liProdChar[i].CLASS_NUM;
                lsresults.REF_CHAR_NUM = liProdChar[i].CHAR_NUM;
                lsresults.REF_CHARVAL_NUM = liProdChar[i].CHARVAL_NUM;
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
            for (var i = 0; i < liProdChar.length; i++) {
                lsresults.PRODUCT_ID = liProdChar[i].PRODUCT_ID;
                lsresults.LOCATION_ID = liProdChar[i].LOCATION_ID;
                lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
                if (req.data.FLAG === "E" && i === 0) {
                    try {
                        await cds.delete("CP_NEWPROD_CHAR", lsresults);
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

    // Maintain Parital product introsduction
    srv.on("maintainPartialProd", async (req) => {
        let liresults = [];
        let lsresults = {};
        var responseMessage;

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
                lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
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
                lsresults.REF_PRODID = liProdChar[i].REF_PRODID;
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

    // Generate Timeseries using action call
    srv.on("generateTimeseries", async (req) => {
        const obgenTimeseries = new GenTimeseries();
        await obgenTimeseries.genTimeseries(req.data);
        console.log("test");
    });
    srv.on("generateTimeseriesF", async (req) => {
        const obgenTimeseries = new GenTimeseries();
        await obgenTimeseries.genTimeseriesF(req.data);
        console.log("test");
    });
    // Generate Timeseries
    srv.on("generate_timeseries", async (req) => {
        const obgenTimeseries = new GenTimeseries();
        await obgenTimeseries.genTimeseries(req.data);
        console.log("test");
    });
    srv.on("generate_timeseriesF", async (req) => {
        const obgenTimeseries = new GenTimeseries();
        await obgenTimeseries.genTimeseriesF(req.data);
        console.log("test");
    });
};
