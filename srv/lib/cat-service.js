//const GenTimeseries = require("./cat-servicets");
const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const GenTimeseries = require("./gen-timeseries");
const genTimeseries = new GenTimeseries;

const genFunctions = new GenFunctions();

/*module.exports = async function () {
  //  await genTimeseries.GenTimeseries();
}*/
module.exports = srv=>{
    srv.on("generate_timeseries", async req =>{
        
    await genTimeseries.GenTimeseries();
        console.log("test");
     
    })
    srv.on("fGetNodeDet", async req =>{
        let { getAccessNodes } = srv.entities;
        const db = srv.transaction(req); 
        const results = await cds.transaction(req).run(
            SELECT .from(getAccessNodes) .where({PARENT_NODE: req.data.PARENT_NODE, NODE_TYPE: req.data.NODE_TYPE})
        ) 
        return results;     
    })
    //srv.on("")
};
