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
  })
  srv.on("createProf",async (req) => {
    let liProfiles = [];
    let lsprofiles = {};
    let createResults = [];
    let res;
    var responseMessage;
    var datetime = new Date();
    var curDate = datetime.toISOString().slice(0,10);
  
    lsprofiles.PROFILE = "Test";
    lsprofiles.METHOD = "MLR";
    lsprofiles.PRF_DESC = "Test";
    lsprofiles.CREATED_DATE = "2022-01-11" ;
    lsprofiles.CREATED_BY = "TTHAKUR";
    liProfiles.push(lsprofiles);
    lsprofiles = {}
  
    try {
      await cds.run(
          INSERT.into("CP_PAL_PROFILEMETH").entries(liProfiles)
      );
      responseMessage = " Creation successfully " ;
      createResults.push(responseMessage);
    } catch (e) {    
      responseMessage = " Creation failed" ;
    }  
    res = req._.req.res;
    res.send({"value":createResults});
  })
  srv.on("CREATE", "getProfiles", _createProfiles);

  srv.on("CREATE", "getProfileParameters", _createProfileParameters);
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
  var curDate = datetime.toISOString().slice(0,10);

  lsprofiles.PROFILE = req.data.PROFILE;
  lsprofiles.METHOD = req.data.METHOD;
  lsprofiles.PRF_DESC = req.data.PRF_DESC;
  lsprofiles.CREATED_DATE = curDate ;
  lsprofiles.CREATED_BY = req.data.CREATED_BY;
  liProfiles.push(lsprofiles);
  lsprofiles = {}

  try {
    await cds.run(
        INSERT.into("CP_PAL_PROFILEMETH").entries(liProfiles)
    );
    responseMessage = " Creation successfully " ;
    createResults.push(responseMessage);
  } catch (e) {    
    responseMessage = " Creation failed" ;
    createResults.push(responseMessage);
  }  
  res = req._.req.res;
  res.send({"value":createResults});
}

async function _createProfileParameters(req) {
  let liProfilesPara = [];
  let lsprofilesPara = {};
  let createResults = [];
  let res;
  var responseMessage;
  var datetime = new Date();
  var curDate = datetime.toISOString().slice(0,10);

  for (let i = 0; i < req.data.length; i++) {
    lsprofilesPara.PROFILE      = req.data[i].PROFILE;
    lsprofilesPara.METHOD       = req.data[i].METHOD;
    lsprofilesPara.PARA_NAME    = req.data[i].PARA_NAME;
    lsprofilesPara.INTVAL       = req.data[i].INTVAL;
    lsprofilesPara.DOUBLEVAL    = req.data[i].DOUBLEVAL;
    lsprofilesPara.STRVAL       = req.data[i].STRVAL;
    lsprofilesPara.PARA_DESC    = req.data[i].PARA_DESC;
    lsprofilesPara.PARA_DEP     = req.data[i].PARA_DEP;
    lsprofilesPara.CREATED_DATE = curDate;
    lsprofilesPara.CREATED_BY   = req.data[i].CREATED_BY;
    liProfilesPara.push(lsprofilesPara);
    lsprofilesPara = {};
  }
  try {
    await cds.run(
        INSERT.into("CP_PAL_PROFILEMETH_PARA").entries(liProfilesPara)
    );
    responseMessage = " Creation successfully " ;
    createResults.push(responseMessage);
  } catch (e) {    
    responseMessage = " Creation failed" ;
    createResults.push(responseMessage);
  }  
  res = req._.req.res;
  res.send({"value":createResults});
}
