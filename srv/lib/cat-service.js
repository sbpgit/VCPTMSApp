//const GenTimeseries = require("./cat-servicets");
const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const ComponentReq = require("./component-req");
const GenTimeseries = require("./gen-timeseries");
const containerSchema = cds.env.requires.db.credentials.schema;
const conn_params_container = {
  serverNode:
    cds.env.requires.db.credentials.host +
    ":" +
    cds.env.requires.db.credentials.port,
  uid: cds.env.requires.db.credentials.user, //cds userid environment variable
  pwd: cds.env.requires.db.credentials.password, //cds password environment variable
  encrypt: "TRUE",
  ssltruststore: cds.env.requires.hana.credentials.certificate,
};

module.exports = (srv) => {
  srv.on("getCSRFToken", async (req) => {
    return "Token";
  });
  // Compoenent requirement
  srv.on("getCompreqQty", async (req) => {
    var tableObjH = [],
      rowObjH = [];
    let liresult;
    // const comreq = new ComponentReq();
    // comreq.genComponentReq(req.data, liresult);
    let liCompQty = [];
    let lsCompQty = {};
    let liprodpred = [];
    let lsprodpred = {};
    let lVariRatio = 1;
    var conn = hana.createConnection(),
      result,
      stmt;

    conn.connect(conn_params_container);
    var sqlStr = "SET SCHEMA " + containerSchema;
    // console.log('sqlStr: ', sqlStr);
    try {
      stmt = conn.prepare(sqlStr);
      result = stmt.exec();
      stmt.drop();
    } catch (error) {
      console.log(error);
    }
    // const
    const liStrucQty = await cds.run(
      `SELECT *
           FROM "V_PRODQTYSN"
           WHERE "LOCATION_ID" = '` +
        req.data.LOCATION_ID +
        `'
           AND "PRODUCT_ID" = '` +
        req.data.PRODUCT_ID +
        `' AND "VERSION" = '` +
        req.data.VERSION +
        `' AND "SCENARIO" = '` +
        req.data.SCENARIO +
        `'
           ORDER BY 
                "LOCATION_ID" ASC, 
                "PRODUCT_ID" ASC,
                "VERSION" ASC,
                "SCENARIO" ASC,
                "CAL_DATE" ASC,
                "STRUC_NODE" ASC`
    );
    const liBomoddemd = await cds.run(
      `SELECT A."ORD_QTY",
      A."LOCATION_ID",
      A."PRODUCT_ID",
      A."ITEM_NUM",
      A."COMPONENT",
      A."COMP_QTY",
      A."VERSION",
      A."SCENARIO",
      A."CAL_DATE",
      B."STRUC_NODE"
        FROM "V_BOMIBPDEMD" AS A
        INNER JOIN CP_PVS_BOM AS B
        ON A.LOCATION_ID = B.LOCATION_ID
        AND A.PRODUCT_ID = B.PRODUCT_ID
        AND A.ITEM_NUM = B.ITEM_NUM
        AND A.COMPONENT = B.COMPONENT
        WHERE A.LOCATION_ID = '` +
        req.data.LOCATION_ID +
        `' AND A."PRODUCT_ID" = '` +
        req.data.PRODUCT_ID +
        `'
           ORDER BY
           A."LOCATION_ID" ASC, 
           A."PRODUCT_ID" ASC,
           A."VERSION" ASC,
           A."SCENARIO" ASC,
           A."CAL_DATE" ASC,
           B."STRUC_NODE" ASC`
    );
    for (let i = 0; i < liStrucQty.length; i++) {
      lVariRatio = 1;
      if (liStrucQty[i].STRUC_QTY < liStrucQty[i].LOWERLIMIT) {
        lVariRatio = liStrucQty[i].LOWERLIMIT / liStrucQty[i].STRUC_QTY;
      }
      if (liStrucQty[i].STRUC_QTY > liStrucQty[i].UPPERLIMIT) {
        lVariRatio = liStrucQty[i].UPPERLIMIT / liStrucQty[i].STRUC_QTY;
      }
      // if (lVariRatio !== 1) {
      for (let j = 0; j < liBomoddemd.length; j++) {
        if (
          liStrucQty[i].LOCATION_ID === liBomoddemd[j].LOCATION_ID &&
          liStrucQty[i].PRODUCT_ID === liBomoddemd[j].PRODUCT_ID &&
          liStrucQty[i].VERSION === liBomoddemd[j].VERSION &&
          liStrucQty[i].SCENARIO === liBomoddemd[j].SCENARIO &&
          liStrucQty[i].CAL_DATE === liBomoddemd[j].CAL_DATE &&
          liStrucQty[i].STRUC_NODE === liBomoddemd[j].STRUC_NODE
        ) {
          lsCompQty = {};
          lsCompQty.LOCATION_ID = liBomoddemd[j].LOCATION_ID;
          lsCompQty.PRODUCT_ID = liBomoddemd[j].PRODUCT_ID;
          lsCompQty.VERSION = liBomoddemd[j].VERSION;
          lsCompQty.SCENARIO = liBomoddemd[j].SCENARIO;
          lsCompQty.ITEM_NUM = liBomoddemd[j].ITEM_NUM;
          lsCompQty.COMPONENT = liBomoddemd[j].COMPONENT;
          lsCompQty.CAL_DATE = liBomoddemd[j].CAL_DATE;
          lsCompQty.STRUC_NODE = liBomoddemd[j].STRUC_NODE;
          lsCompQty.CAL_COMP_QTY =
            liBomoddemd[j].ORD_QTY * liBomoddemd[j].COMP_QTY;
          lsCompQty.COMP_QTY = Math.ceil(
            liBomoddemd[j].ORD_QTY * lVariRatio * liBomoddemd[j].COMP_QTY
          );
          rowObjH.push(
            lsCompQty.LOCATION_ID,
            lsCompQty.PRODUCT_ID,
            lsCompQty.VERSION,
            lsCompQty.SCENARIO,
            lsCompQty.ITEM_NUM,
            lsCompQty.COMPONENT,
            lsCompQty.CAL_DATE,
            lsCompQty.STRUC_NODE,
            parseInt(lsCompQty.CAL_COMP_QTY),
            parseInt(lsCompQty.COMP_QTY)
          );
          liCompQty.push(GenFunctions.parse(lsCompQty));
          tableObjH.push(rowObjH);
          rowObjH = [];
          try {
            var sqlStr =
              "DELETE FROM CP_COMPQTYDETERMINE WHERE LOCATION_ID = " +
              "'" +
              liBomoddemd[j].LOCATION_ID +
              "' AND PRODUCT_ID = " +
              "'" +
              liBomoddemd[j].PRODUCT_ID +
              "' AND VERSION = " +
              "'" +
              liBomoddemd[j].VERSION +
              "' AND SCENARIO = " +
              "'" +
              liBomoddemd[j].SCENARIO +
              "' AND ITEM_NUM = " +
              "'" +
              liBomoddemd[j].ITEM_NUM +
              "' AND COMPONENT = " +
              "'" +
              liBomoddemd[j].COMPONENT +
              "' AND CAL_DATE = " +
              "'" +
              liBomoddemd[j].CAL_DATE +
              "'";
            var stmt = conn.prepare(sqlStr);
            await stmt.exec();
            stmt.drop();
          } catch (error) {
            var e = error;
          }
        }
      }
      // }
    }
    if (liCompQty.length > 0) {
      try {
        // await cds.run(INSERT.into("CP_COMPQTYDETERMINE").entries(liCompQty));
        var sqlStr =
          "INSERT INTO CP_COMPQTYDETERMINE(LOCATION_ID, PRODUCT_ID, VERSION, SCENARIO, ITEM_NUM, COMPONENT, CAL_DATE, STRUC_NODE, CAL_COMP_QTY, COMP_QTY) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var stmt = conn.prepare(sqlStr);
        await stmt.execBatch(tableObjH);
        stmt.drop();
        liresult = "Component requirements generated successfully";
      } catch (error) {
        liresult = "Failed to generate Component requirements";
      }
    } else {
      liresult = "No data fetched";
    }
    return liresult;
  });
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
            SELECT * FROM "V_COMREQ"
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
        `')
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
          FROM "V_COMREQ"
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
        `')
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
              liCompQty[vCompIndex].ORD_QTY;
            break;
          }
        }
      }
      liCompWeekly.push(GenFunctions.parse(lsCompWeekly));
      vWeekIndex = 0;
      lsCompWeekly.QTYTYPE = "Calculated";
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
              liCompQty[vCompIndex].CAL_COMP_QTY;
            break;
          }
        }
      }
      liCompWeekly.push(GenFunctions.parse(lsCompWeekly));
      lsCompWeekly = {};
    }
    return liCompWeekly;
  });
  srv.on("CREATE", "getProfiles", _createProfiles);

  srv.on("CREATE", "genProfileParam", _createProfileParameters);

  srv.on("CREATE", "genProfileOD", _createProfileOD);

  //   srv.on("CREATE", "genProdAccessNode", _createPrdAccessNode);

  //   srv.on("CREATE", "genCompStrcNode", _createCompStrcNode);
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
  srv.on("createProfilePara", async (req) => {
    let liProfilesPara = [];
    let lsprofilesPara = {};
    let createResults = [];
    let res;
    var responseMessage;
    var datetime = new Date();
    var curDate = datetime.toISOString().slice(0, 10);
    const aProfilePara_req = req.data.PROFILEPARA;
    if (req.data.FLAG === "I" || req.data.FLAG === "E") {
      for (let i = 0; i < aProfilePara_req.length; i++) {
        lsprofilesPara.PROFILE = aProfilePara_req[i].PROFILE;
        if (lsprofilesPara.PROFILE !== undefined) {
          lsprofilesPara.METHOD = aProfilePara_req[i].METHOD;
          lsprofilesPara.PARA_NAME = aProfilePara_req[i].PARA_NAME;
          lsprofilesPara.INTVAL = aProfilePara_req[i].INTVAL;
          lsprofilesPara.DOUBLEVAL = aProfilePara_req[i].DOUBLEVAL;
          lsprofilesPara.STRVAL = aProfilePara_req[i].STRVAL;
          lsprofilesPara.PARA_DESC = aProfilePara_req[i].PARA_DESC;
          lsprofilesPara.PARA_DEP = null; //aProfilePara_req[i].PARA_DEP;
          lsprofilesPara.CREATED_DATE = curDate;
          lsprofilesPara.CREATED_BY = aProfilePara_req[i].CREATED_BY;
          if (req.data.FLAG === "E") {
            await cds.delete("CP_PAL_PROFILEMETH_PARA", lsprofilesPara);
          }
          liProfilesPara.push(GenFunctions.parse(lsprofilesPara));
        }
        lsprofilesPara = {};
      }
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
        lsprofilesPara.PROFILE = aProfilePara_req[i].PROFILE;
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
          } catch (e) {}
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

// Create or delete Profiles
async function _createProfiles(req) {
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
  res.send({ value: createResults });
}
// Create or delete Profile parameters
async function _createProfileParameters(req) {
  let liProfilesPara = [];
  let lsprofilesPara = {};
  let createResults = [];
  let res;
  var responseMessage;
  var datetime = new Date();
  var curDate = datetime.toISOString().slice(0, 10);
  const aProfilePara_req = req.data.PROFILEPARA;
  if (req.data.FLAG === "I" || req.data.FLAG === "E") {
    for (let i = 0; i < aProfilePara_req.length; i++) {
      lsprofilesPara.PROFILE = aProfilePara_req[i].PROFILE;
      if (lsprofilesPara.PROFILE !== undefined) {
        lsprofilesPara.METHOD = aProfilePara_req[i].METHOD;
        lsprofilesPara.PARA_NAME = aProfilePara_req[i].PARA_NAME;
        lsprofilesPara.INTVAL = aProfilePara_req[i].INTVAL;
        lsprofilesPara.DOUBLEVAL = aProfilePara_req[i].DOUBLEVAL;
        lsprofilesPara.STRVAL = aProfilePara_req[i].STRVAL;
        lsprofilesPara.PARA_DESC = aProfilePara_req[i].PARA_DESC;
        lsprofilesPara.PARA_DEP = null; //aProfilePara_req[i].PARA_DEP;
        lsprofilesPara.CREATED_DATE = curDate;
        lsprofilesPara.CREATED_BY = aProfilePara_req[i].CREATED_BY;
        if (req.data.FLAG === "E") {
          await cds.delete("CP_PAL_PROFILEMETH_PARA", lsprofilesPara);
        }
        liProfilesPara.push(GenFunctions.parse(lsprofilesPara));
      }
      lsprofilesPara = {};
    }
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
      lsprofilesPara.PROFILE = aProfilePara_req[i].PROFILE;
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
  res.send({ value: createResults });
}
// Assign Object dependency to Profiles
async function _createProfileOD(req) {
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
  for (let i = 0; i < aProfileOD_req.length; i++) {
    lsprofilesOD.PROFILE = aProfileOD_req[i].PROFILE;
    if (lsprofilesOD.PROFILE !== undefined || req.data.FLAG === "D") {
      lsprofilesOD.LOCATION_ID = aProfileOD_req[i].LOCATION_ID;
      lsprofilesOD.PRODUCT_ID = aProfileOD_req[i].PRODUCT_ID;
      lsprofilesOD.COMPONENT = aProfileOD_req[i].COMPONENT;
      lsprofilesOD.OBJ_DEP = aProfileOD_req[i].OBJ_DEP;
      lsprofilesOD.PROFILE = aProfileOD_req[i].PROFILE;
      if (lsprofilesOD.STRUC_NODE !== undefined) {
        lsprofilesOD.STRUC_NODE = aProfileOD_req[i].STRUC_NODE;
      } else {
        lsprofilesOD.STRUC_NODE = "";
      }
      liProfilesOD.push(GenFunctions.parse(lsprofilesOD));
      // Delete before insert to override
      lsprofilesDel.LOCATION_ID = aProfileOD_req[i].LOCATION_ID;
      lsprofilesDel.PRODUCT_ID = aProfileOD_req[i].PRODUCT_ID;
      lsprofilesDel.COMPONENT = aProfileOD_req[i].COMPONENT;
      lsprofilesDel.OBJ_DEP = aProfileOD_req[i].OBJ_DEP;

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
  }
  res.send({ value: createResults });
}
//   srv.on("gen_timeseries", async (req) => {
//     const obgenTimeseries = new GenTimeseries();
//     var res = req._.req.res;
//     res
//       .status(202)
//       .send("Accepted async job, but long-running operation still running.");
//     const doLongRunningOperation = function (doFail) {
//       return new Promise((resolve, reject) => {
//         const letItFail = doFail;
//         setTimeout(() => {
//           if (letItFail === "true") {
//             reject({ message: "Backend operation failed with error code 123" });
//           } else {
//             resolve({
//               message: "Successfully finished long-running backend operation",
//             });
//           }
//         }, 3000); // wait... wait...
//       });
//     };
//     await obgenTimeseries.genTimeseries();
//     //console.log("test");
//   });
/* srv.on("getODProfiles", async (req) => {
    let liresults = [];
    let lsresults = {};
    let { getMODHeader, getProfileOD } = srv.entities;
    const db = srv.transaction(req);
    const aOdhdr = await cds
      .transaction(req)
      .run(
        SELECT.distinct
          .from(getMODHeader)
          .columns(
            "LOCATION_ID",
            "PRODUCT_ID",
            "COMPONENT",
            "OBJ_DEP",
            "OBJ_COUNTER",
            "OBJDEP_DESC"
          )
      );
    const aOdProfile = await cds
      .transaction(req)
      .run(
        SELECT.distinct
          .from(getProfileOD)
          .columns(
            "LOCATION_ID",
            "PRODUCT_ID",
            "COMPONENT",
            "PROFILE",
            "OBJ_DEP",
            "STRUC_NODE"
          )
      );

    for (let i = 0; i < aOdhdr.length; i++) {
      var vOD = aOdhdr[i].OBJ_DEP + "_" + aOdhdr[i].OBJ_COUNTER;
      lsresults.LOCATION_ID = aOdhdr[i].LOCATION_ID;
      lsresults.PRODUCT_ID = aOdhdr[i].PRODUCT_ID;
      lsresults.COMPONENT = aOdhdr[i].COMPONENT;
      lsresults.OBJ_DEP = vOD;
      lsresults.OBJDEP_DESC = aOdhdr[i].OBJDEP_DESC;
      let liPrfOD = await cds.run(
        `SELECT DISTINCT
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "COMPONENT",
                        "PROFILE",
                        "OBJ_DEP",
                        "STRUC_NODE"
                    FROM "CP_PAL_PROFILEOD"
                   WHERE "LOCATION_ID" = '` +
          lsresults.LOCATION_ID +
          `'
                     AND "PRODUCT_ID" = '` +
          lsresults.PRODUCT_ID +
          `'
                     AND "COMPONENT" = '` +
          lsresults.COMPONENT +
          `'
                     AND "OBJ_DEP" = '` +
          vOD +
          `'`
      );
      //   for (let j = 0; j < liPrfOD.length; j++){
      if (liPrfOD[0] !== undefined) {
        lsresults.PROFILE = liPrfOD[0].PROFILE;
        lsresults.STRUC_NODE = liPrfOD[0].STRUC_NODE;
      }
      else{
        lsresults.PROFILE = "";
        lsresults.STRUC_NODE = "";
      }
      liresults.push(lsresults);
      liPrfOD = [];
      lsresults = {};
      // }
    }
    return liresults;
  });
  /*srv.on("profile_exec", async req =>{
        let { getAccessNodes } = srv.entities;
        const db = srv.transaction(req); 
        const results = await cds.transaction(req).run(
            SELECT .from(getAccessNodes) .where({PARENT_NODE: req.data.PARENT_NODE, NODE_TYPE: req.data.NODE_TYPE})
        ) 
        return results;     
    })*/
//srv.on("")

// await cds.run(
//     DELETE.from("CP_COMPQTYDETERMINE").where({
//       xpr: [
//         { ref: ["LOCATION_ID"] },
//         "=",
//         { val: liBomoddemd[j].LOCATION_ID },
//         "AND",
//         { ref: ["PRODUCT_ID"] },
//         "=",
//         { val: liBomoddemd[j].PRODUCT_ID },
//         "AND",
//         { ref: ["VERSION"] },
//         "=",
//         { val: liBomoddemd[j].VERSION },
//         "AND",
//         { ref: ["SCENARIO"] },
//         "=",
//         { val: liBomoddemd[j].SCENARIO },
//         "AND",
//         { ref: ["ITEM_NUM"] },
//         "=",
//         { val: liBomoddemd[j].ITEM_NUM },
//         "AND",
//         { ref: ["COMPONENT"] },
//         "=",
//         { val: liBomoddemd[j].COMPONENT },
//         "AND",
//         { ref: ["CAL_DATE"] },
//         "=",
//         { val: liBomoddemd[j].CAL_DATE },
//       ],
//     })
//   );
