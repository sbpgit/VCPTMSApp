const cds = require('@sap/cds')

// module.exports = srv => {
module.exports = async function (srv) {
      
     srv.on ('genMasterData',    async req => {

         console.log('Inputs: ', req.data);           

         let createtAt = new Date();
         let values = [];
         let respString = "Generate IBP MASTER DATA request queued, Check Response by Running Logs"

         values.push({createtAt, respString});    

         console.log('values :', values);
         console.log('Response completed Time  :', createtAt);
         var res = req._.req.res;
         res.statusCode = 202;
         res.send({values});    

         var sqlStr = 'call P_UPSERT_IBP_MASTER_TABLES()';
         var results = await cds.run(sqlStr); 
         console.log("P_UPSERT_IBP_MASTER_TABLES results", results);
         
     })
 
     srv.on ('genTxData',    async req => {
       
        let createtAt = new Date();
         let values = [];
         let respString = "Generate IBP TX DATA request queued, Check Response by Running Logs"

         values.push({createtAt, respString});    

         console.log('values :', values);
         console.log('Response completed Time  :', createtAt);
         var res = req._.req.res;
         res.statusCode = 202;
         res.send({values});   
         
        // var sqlStr = 'call P_UPSERT_IBP_TS_TABLES(?, ?, ?)';
        var sqlStr = 'call P_UPSERT_IBP_TS_TABLES()';
        var results = await cds.run(sqlStr);
        console.log("P_UPSERT_IBP_TS_TABLES results", results);
     })

  }

