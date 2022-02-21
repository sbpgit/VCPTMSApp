//const GenTimeseries = require("./cat-servicets");
const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const ComponentReq = require("./component-req");
const GenTimeseries = require("./gen-timeseries");
// const genTimeseries = new GenTimeseries;

// const genFunctions = new GenFunctions();

//  module.exports = async function () {
//      await genTimeseries.GenTimeseries();
//  }

module.exports = (srv) => {
  srv.on("getCSRFToken", async (req) => {
    return "Token";
  });
  // Compoenent requirement
  srv.on("getCompreq", async (req) => {
    let liresult;
    const comreq = new ComponentReq();
    comreq.genComponentReq(req.data,liresult);
    return liresult;
  });

  srv.on("CREATE", "getProfiles", _createProfiles);

  srv.on("CREATE", "genProfileParam", _createProfileParameters);

  srv.on("CREATE", "genProfileOD", _createProfileOD);

  // srv.on("CREATE", "getNodes", _createNodes);

  srv.on("CREATE", "genProdAccessNode", _createPrdAccessNode);

  srv.on("CREATE", "genCompStrcNode", _createCompStrcNode);
  // Create PVS nodes
  srv.on("genpvs", async (req) => {
    let { getNodes } = srv.entities;
    let liresults = [];
    let liresults_t = [];
    let lsresults = {};
    let createResults = [];
    let res;
    let flagvs;
    var responseMessage;
    res = req._.req.res;
    if (req.data.NODE_TYPE === "VS") {
      liresults = await cds.run(
        `SELECT *
            FROM CP_PVS_NODES
            WHERE "CHILD_NODE" = '` +
          req.data.CHILD_NODE +
          `' AND "PARENT_NODE = '` +
          req.data.PARENT_NODE +
          `'`
      );
      if (liresults.length > 0) {
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
          // responseMessage = " Created successfully ";
          // createResults.push(responseMessage);
        } catch (e) {
          //DONOTHING
          responseMessage = " Creation failed";
          // createResults.push(responseMessage);
        }
        lsresults = {};
      } else if (req.data.FLAG === "D") {
        lsresults.CHILD_NODE = req.data.CHILD_NODE;
        lsresults.PARENT_NODE = req.data.PARENT_NODE;
        try {
          await cds.delete("CP_PVS_NODES", lsresults);
          // responseMessage = " Deletion successfully ";
          // createResults.push(responseMessage);
        } catch (e) {
          // responseMessage = " Deletion failed";
          // createResults.push(responseMessage);
        }
        lsresults = {};
      }
      liresults = await cds.transaction(req).run(SELECT.from(getPVSNodes));
    } else {
      li_results = [];
    }
    return liresults;
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

  srv.on("generate_timeseries", async (req) => {
    const obgenTimeseries = new GenTimeseries();
    await obgenTimeseries.genTimeseries();
    console.log("test");
  });
  srv.on("gen_timeseries", async (req) => {
    const obgenTimeseries = new GenTimeseries();
    var res = req._.req.res;
    res
      .status(202)
      .send("Accepted async job, but long-running operation still running.");
    const doLongRunningOperation = function (doFail) {
      return new Promise((resolve, reject) => {
        const letItFail = doFail;
        setTimeout(() => {
          if (letItFail === "true") {
            reject({ message: "Backend operation failed with error code 123" });
          } else {
            resolve({
              message: "Successfully finished long-running backend operation",
            });
          }
        }, 3000); // wait... wait...
      });
    };
    await obgenTimeseries.genTimeseries();
    //console.log("test");
  });
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
};
async function _createCompStrcNode(req) {
  let liresults = [];
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
  res.send({ value: createResults });
}
async function _createPrdAccessNode(req) {
  let liresults = [];
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
  res.send({ value: createResults });
  // lsresults = select.from
}

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
    lsprofiles.CREATED_BY = req.user_id;
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
    if (lsprofilesOD.PROFILE !== undefined) {
      lsprofilesOD.LOCATION_ID = aProfileOD_req[i].LOCATION_ID;
      lsprofilesOD.PRODUCT_ID = aProfileOD_req[i].PRODUCT_ID;
      lsprofilesOD.COMPONENT = aProfileOD_req[i].COMPONENT;
      lsprofilesOD.OBJ_DEP = aProfileOD_req[i].OBJ_DEP;
      lsprofilesOD.PROFILE = aProfileOD_req[i].PROFILE;
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
