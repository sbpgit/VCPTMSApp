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
 
module.exports = srv=>{
    srv.on("generate_timeseries", async req =>{  
        const obgenTimeseries = new GenTimeseries;      
        await obgenTimeseries.genTimeseries();
        console.log("test");     
    })
    srv.on("gen_timeseries", async req =>{  
        const obgenTimeseries = new GenTimeseries;   
        var res = req._.req.res;
        res.status(202).send('Accepted async job, but long-running operation still running.');
        const doLongRunningOperation = function (doFail) {
            return new Promise((resolve, reject)=>{
               const letItFail = doFail
               setTimeout(() => {     
                  if(letItFail === 'true'){
                     reject({message: 'Backend operation failed with error code 123'});
                  }else{
                     resolve({message: 'Successfully finished long-running backend operation'})   
                  }
               }, 3000); // wait... wait...
            })
         } 
        await obgenTimeseries.genTimeseries();
        //console.log("test");     
    })
    srv.on("get_objdep", async req =>{
        let { getMODHeader } = srv.entities;
        const db = srv.transaction(req); 
        const results = await cds.transaction(req).run(SELECT.distinct.from(getMODHeader) .columns('LOCATION_ID','PRODUCT_ID', 'OBJ_DEP', 'OBJ_COUNTER' ))
        return results; 
    })
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

