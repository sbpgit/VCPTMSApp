//const GenTimeseries = require("./cat-servicets");
const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const GenTimeseries = require("./gen-timeseries");
//const genTimeseries = new GenTimeseries;

const genFunctions = new GenFunctions();

/* module.exports = async function () {
     await genTimeseries.GenTimeseries();
 }*/

module.exports = (srv) => {
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

  srv.on("CREATE", "getProfiles", _createProfiles);

  srv.on("CREATE", "genProfileParam", _createProfileParameters);

  srv.on("CREATE", "genProfileOD", _createProfileOD);
  /*srv.on("profile_exec", async req =>{
        let { getAccessNodes } = srv.entities;
        const db = srv.transaction(req); 
        const results = await cds.transaction(req).run(
            SELECT .from(getAccessNodes) .where({PARENT_NODE: req.data.PARENT_NODE, NODE_TYPE: req.data.NODE_TYPE})
        ) 
        return results;     
    })*/
  //srv.on("")
};
async function _createProfiles(req) {
  let liProfiles = [];
  let lsprofiles = {};
  let createResults = [];
  let res;
  var responseMessage;
  var datetime = new Date();
  var curDate = datetime.toISOString().slice(0, 10);

  lsprofiles.PROFILE = req.data.PROFILE;
  lsprofiles.METHOD = req.data.METHOD;
  lsprofiles.PRF_DESC = req.data.PRF_DESC;
  lsprofiles.CREATED_DATE = curDate;
  lsprofiles.CREATED_BY = req.data.CREATED_BY;
  liProfiles.push(lsprofiles);
  lsprofiles = {};
  res = req._.req.res;

  try {
    await cds.run(INSERT.into("CP_PAL_PROFILEMETH").entries(liProfiles));
    responseMessage = " Creation successfully ";
    //res.statusCode = 201;
    createResults.push(responseMessage);
  } catch (e) {
    responseMessage = " Creation failed";
    // res.statusCode = 201;
    createResults.push(responseMessage);
  }
  res.send({ value: createResults });
}

async function _createProfileParameters(req) {
  let liProfilesPara = [];
  let lsprofilesPara = {};
  let createResults = [];
  let res;
  var responseMessage;
  var datetime = new Date();
  var curDate = datetime.toISOString().slice(0, 10);
  const aProfilePara_req = req.data.PROFILEPARA;

  for (let i = 0; i < aProfilePara_req.length; i++) {
    lsprofilesPara.PROFILE = aProfilePara_req[i].PROFILE;
    if (lsprofilesPara.PROFILE !== undefined) {
      lsprofilesPara.METHOD = aProfilePara_req[i].METHOD;
      lsprofilesPara.PARA_NAME = aProfilePara_req[i].PARA_NAME;
        lsprofilesPara.INTVAL = aProfilePara_req[i].INTVAL;
         lsprofilesPara.DOUBLEVAL = aProfilePara_req[i].DOUBLEVAL;
      lsprofilesPara.STRVAL = aProfilePara_req[i].STRVAL;
      lsprofilesPara.PARA_DESC = aProfilePara_req[i].PARA_DESC;
      lsprofilesPara.PARA_DEP = null;//aProfilePara_req[i].PARA_DEP;
      lsprofilesPara.CREATED_DATE = curDate;
      lsprofilesPara.CREATED_BY = aProfilePara_req[i].CREATED_BY;
      liProfilesPara.push(GenFunctions.parse(lsprofilesPara));
    }
    lsprofilesPara = {};
  }
  try {
    if (liProfilesPara.length > 0) {
      await cds.run(INSERT.into("CP_PAL_PROFILEMETH_PARA").entries(liProfilesPara)
      );
      responseMessage = " Creation successfully ";
      createResults.push(responseMessage);
    }
  } catch (e) {
    responseMessage = " Creation failed";
    createResults.push(responseMessage);
  }
  res = req._.req.res;
  res.send({ value: createResults });
}

async function _createProfileOD(req) {
  let liProfilesOD = [];
  let lsprofilesOD = {};
  let createResults = [];
  let res;
  var responseMessage;
  var datetime = new Date();
  var curDate = datetime.toISOString().slice(0, 10);

  const aProfileOD_req = req.data.PROFILEOD;

  for (let i = 0; i < aProfileOD_req.length; i++) {
    lsprofilesOD.PROFILE = aProfileOD_req[i].PROFILE;
    if (lsprofilesOD.PROFILE !== undefined) {
      lsprofilesOD.LOCATION_ID = aProfileOD_req[i].LOCATION_ID;
      lsprofilesOD.PRODUCT_ID = aProfileOD_req[i].PRODUCT_ID;
      lsprofilesOD.COMPONENT = aProfileOD_req[i].COMPONENT;
      lsprofilesOD.OBJ_DEP = aProfileOD_req[i].OBJ_DEP;
      lsprofilesOD.PROFILE = aProfileOD_req[i].PROFILE;
      liProfilesOD.push(GenFunctions.parse(lsprofilesOD));
    }
    lsprofilesOD = {};
  }
  res = req._.req.res;

  try {
    if (liProfilesOD.length > 0) {
      await cds.run(INSERT.into("CP_PAL_PROFILEOD").entries(liProfilesOD));
      responseMessage = " Creation successfully ";
      //res.statusCode = 201;
      createResults.push(responseMessage);
    }
  } catch (e) {
    responseMessage = " Creation failed";
    // res.statusCode = 201;
    createResults.push(responseMessage);
  }
  res.send({ value: createResults });
}
