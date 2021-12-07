const GenTimeseries = require("./cat-servicets");
const DbConnect = require("./dbConnect");
module.exports = srv=>{
    srv.on("generate_timeseries", req =>{
        console.log("test");
      //  const ObjgenTimeseries = new GenTimeseries();
        //await ObjgenTimeseries.genTimeseries();
        //return "Success";
    })
    srv.on("fGetNodeDet", async req =>{
        let { getAccessNodes } = srv.entities;
        const db = srv.transaction(req); 
        const results = await cds.transaction(req).run(
            SELECT .from(getAccessNodes) .where({PARENT_NODE: req.data.PARENT_NODE, NODE_TYPE: req.data.NODE_TYPE})
        ) 
        return results;     
    })
};
