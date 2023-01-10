const GenF = require("./gen-functions");
const cds = require("@sap/cds");
// const hana = require("@sap/hana-client");
const MktAuth = require("./market-auth");
const obgenMktAuth = new MktAuth();
// const JobSchedulerClient = require("@sap/jobs-client");
const { v1: uuidv1 } = require('uuid')
// const xsenv = require("@sap/xsenv");
const Catservicefn = require("./catservice-function");
// const vAIRKey = process.env.AIR;
// const IBPFunc = require("./ibp-functions");


class preDefHistory {
    constructor() {

    }

    // SDI Functions
    async ImportECCLoc (req){
         let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Location";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_LOCATION_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportECCCustGrp (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Customer Group";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CUSTOMERGROUP_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportECCProd (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Products";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PRODUCTS_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportECCLocProd (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Location-Product";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_LOCATIONPROD_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportECCProdClass (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Product Class";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PRODUCTCLASS_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        
    }
    async ImportECCBOM (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing BOM Header";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_BOMHEADER_SP"')
            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_BOMOBJDEPENDENCY_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            const output2 = await dbConn.callProcedurePromisified(sp2, [])
            console.log(output.results);
            console.log(output2.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
     }
    async ImportECCClass (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Class, Characteristics and Char. Values";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CLASS_SP"')
            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_CHARACTERISTICS_SP"')
            const sp3 = await dbConn.loadProcedurePromisified(null, '"FG_CHAR_VALUES_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            const output2 = await dbConn.callProcedurePromisified(sp2, [])
            const output3 = await dbConn.callProcedurePromisified(sp3, [])
            console.log(output.results);
            console.log(output2.results);
            console.log(output3.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportECCODhdr (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Object dependencies";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_OBJDEP_HEADER_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportPartialProd (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Parital Products and Configurations";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PARTIALPROD_SP"');
            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_PARTIALPRODCFG_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            const output2 = await dbConn.callProcedurePromisified(sp2, [])
            console.log(output.results);
            console.log(output2.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }
    async ImportPVSNode (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing PVS Node structure";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PVSNODE_SP"');
            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_PVSBOM_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            const output2 = await dbConn.callProcedurePromisified(sp2, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
       
    }
    async ImportPVSBOM (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing PVS-BOM";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PVSBOM_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        
    }
    async ImportECCAsmbcomp (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Assembly -Components";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_ASMBCOMP_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        
    }
    async ImportECCSalesh (req){
        var flag = '';
        let createtAt = new Date();
       let id = uuidv1();
       let values = [];
       let message = "Started importing Sales History and Configuration";
       let res = req._.req.res;     
       values.push({ id, createtAt, message});
       res.statusCode = 202;
       res.send({ values });
       try {
           
           // Delete All sales History
           const objCatFn = new Catservicefn();
           // await objCatFn.deleteSalesHistory('X');

           const dbClass = require("sap-hdb-promisfied")
           let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
           const sp = await dbConn.loadProcedurePromisified(null, '"FG_SALESH_SP"')
           const output = await dbConn.callProcedurePromisified(sp, [])
           const spcfg = await dbConn.loadProcedurePromisified(null, '"FG_SALESH_CONFIG_SP"')
           const outputcfg = await dbConn.callProcedurePromisified(spcfg, [])
           console.log(output.results);
           console.log(outputcfg.results);
           flag = 'X';
       } catch (error) {
           console.error(error);
       }

       
    }
    async ImportCuvtabInd (req){
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Variant tables";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CUVTAB_IND_SP"');
            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_CUVTAB_VALC_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            const output2 = await dbConn.callProcedurePromisified(sp2, [])
            console.log(output.results);
            console.log(output2.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        
    }
    async ImportCIRLog (req){
         let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Forecast Demand Logs";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_LOGCIR_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        
    }
    async ImportSOStock (req){
         let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started importing Salesorder Stock";
        let res = req._.req.res;     
        values.push({ id, createtAt, message});
        res.statusCode = 202;
        res.send({ values });
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_IBPSTOCK_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
    }



    // Generate Timeseries History
    async generateTimeseries (req){
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

        if(Flag === "X"){
            await this.generateModels(req)
        }
    }

    // Generate Models
    // need to check, added code is correct or not
//     async generateModels (req,isGet){
//         var vcRulesListReq = {};
//    if (isGet == true)
//    {
//        vcRulesListReq = JSON.parse(req.data.vcRulesList);
//    }
//    else
//    {
//        vcRulesListReq = req.data.vcRulesList;
//    }

//     let createtAt = new Date();
//     let id = uuidv1();
//     let values = [];	
//     let message = "Request for Models generation Queued Sucessfully";

//     values.push({id, createtAt, message, vcRulesListReq});    

//     if (isGet == true)
//     {
//         req.reply({values});
//         // req.reply();
//     }
//     else
//     {
//         let res = req._.req.res;
//         res.statusCode = 202;
//         res.send({values});
//     }

//     var url;

//     var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
//     // var baseUrl = 'http' + '://' + req.headers.host;


//     var sqlStr = "";
//     var results= [];
//     var vcRulesList = [];
//     let arrayLength = vcRulesListReq.length;
//     console.log("arrayLength ", arrayLength);

//     if ( (arrayLength == 1) &&
//           ( ( (vcRulesListReq[0].GroupID == "ALL") && 
//             (vcRulesListReq[0].Product == "ALL") && 
//             (vcRulesListReq[0].Location == "ALL") ) ||

//             ( (vcRulesListReq[0].GroupID == "ALL") && 
//             (vcRulesListReq[0].Product == "ALL") && 
//             (vcRulesListReq[0].Location != "ALL") ) ||

//             ( (vcRulesListReq[0].GroupID == "ALL") && 
//             (vcRulesListReq[0].Product != "ALL") && 
//             (vcRulesListReq[0].Location == "ALL") ) ||
            
//             ( (vcRulesListReq[0].GroupID == "ALL") && 
//             (vcRulesListReq[0].Product != "ALL") && 
//             (vcRulesListReq[0].Location != "ALL") ) ) )
//    {

//        if ( (vcRulesListReq[0].Location != "ALL") &&
//             (vcRulesListReq[0].Product == "ALL") )
//        {
//            sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
//                     ' WHERE "LOCATION_ID" =' + "'" +   vcRulesListReq[0].Location + "'" +
//                     ' AND "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
//                     ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";
//        }
//        else if ( (vcRulesListReq[0].Product != "ALL") &&
//                  (vcRulesListReq[0].Location == "ALL") )
//        {
//            sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
//                     ' WHERE "PRODUCT_ID" =' + "'" +   vcRulesListReq[0].Product + "'" +
//                     ' AND "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
//                     ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";
//        }
//        else if ( (vcRulesListReq[0].Product != "ALL") &&
//                  (vcRulesListReq[0].Location != "ALL") )
//        {
//            sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
//                ' WHERE "PRODUCT_ID" =' + "'" +   vcRulesListReq[0].Product + "'" +
//                ' AND "LOCATION_ID" =' + "'" +   vcRulesListReq[0].Location + "'" +
//                ' AND "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
//                ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";
//        }
//        else
//        {
//             sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
//                    // vcRulesListReq[0].tableName + 
//                    ' WHERE "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
//                     ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE"  HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";  
//        }



//         results = await cds.run(sqlStr);
//         // console.log('_generateRegModels vcRulesList sqlStr results', results );


//         for (let index=0; index<results.length; index++) 
//         {
            
//             let Location = results[index].LOCATION_ID;
//             let Product = results[index].PRODUCT_ID;
//             let GroupID = results[index].GROUP_ID;
//             let Type = results[index].TYPE;
//             let modelVersion = vcRulesListReq[0].modelVersion;
//             let profile = vcRulesListReq[0].profile;
//             let override = vcRulesListReq[0].override;
//             vcRulesList.push({profile,override,Location,Product,GroupID,Type,modelVersion});

//         }

//     }
//     else
//     {
//         for (var i = 0; i < vcRulesListReq.length; i++)
//         {
                
//             let varSql = "";
    
//             if ( (vcRulesListReq[i].Location != "ALL") &&
//                  (vcRulesListReq[i].Product != "ALL") &&
//                  (vcRulesListReq[i].GroupID != "ALL") )
//             {
//                 varSql =  ' "LOCATION_ID" =' + "'" +   vcRulesListReq[i].Location + "'" +
//                           ' AND "PRODUCT_ID" =' + "'" +   vcRulesListReq[i].Product + "'" +
//                           ' AND "GROUP_ID" =' + "'" +   vcRulesListReq[i].GroupID + "'";
//             }
//             else if ( (vcRulesListReq[i].Location == "ALL") &&
//                  (vcRulesListReq[i].Product != "ALL") &&
//                  (vcRulesListReq[i].GroupID != "ALL") )
//             {
//                 varSql =  ' "PRODUCT_ID" =' + "'" +   vcRulesListReq[i].Product + "'" +
//                           ' AND "GROUP_ID" =' + "'" +   vcRulesListReq[i].GroupID + "'";
//             }
//             else if ( (vcRulesListReq[i].Location != "ALL") &&
//             (vcRulesListReq[i].Product != "ALL") &&
//             (vcRulesListReq[i].GroupID == "ALL") )
//             {
//                 varSql =   ' "LOCATION_ID" =' + "'" +   vcRulesListReq[i].Location + "'" +
//                             ' AND "PRODUCT_ID" =' + "'" +   vcRulesListReq[i].Product + "'";
//             }
//             else if ( (vcRulesListReq[i].Location == "ALL") &&
//                  (vcRulesListReq[i].Product == "ALL") &&
//                  (vcRulesListReq[i].GroupID != "ALL") )
//             {
//                 varSql =  ' "GROUP_ID" =' + "'" +   vcRulesListReq[i].GroupID + "'";
//             }
    
//             sqlStr = 'SELECT  "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" FROM "CP_VC_HISTORY_TS" WHERE ' +
//                         varSql +
//                         ' AND "TYPE" =' + "'" +   vcRulesListReq[i].Type + "'" +
//                         ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE"' +
//                         ' HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";// + 'ORDER BY "WeekOfYear"';  
            
//             results = await cds.run(sqlStr);
//             console.log('_generateRegModels vcRulesList sqlStr ', sqlStr, 'index = ', i );
//             // console.log('_generateRegModels vcRulesList ELSE sqlStr results', results );
    
//             if (results.length > 0)
//             {    
//                 for (rIndex = 0 ; rIndex < results.length; rIndex ++)
//                 {
//                     let Location = results[rIndex].LOCATION_ID;
//                     let Product = results[rIndex].PRODUCT_ID;
//                     let GroupID = results[rIndex].GROUP_ID;
//                     let Type = results[rIndex].TYPE;
//                     // let modelVersion = vcRulesListReq[0].modelVersion;
//                     let modelVersion = vcRulesListReq[i].modelVersion;
//                     let profile = vcRulesListReq[i].profile;
//                     let override = vcRulesListReq[i].override;
//                     vcRulesList.push({profile,override,Location,Product,GroupID,Type,modelVersion});
//                 }
//             }
//         }
//     }

//     var hasCharCount1, hasCharCount2, hasCharCount3, hasCharCount4, hasCharCount5, hasCharCount6, hasCharCount7, hasCharCount8, hasCharCount9, hasCharCount10, hasCharCount11, hasCharCount12  = false;
//     for (var i = 0; i < vcRulesList.length; i++)
//     {
        
//         sqlStr = 'SELECT  COUNT(DISTINCT "ROW") AS numChars FROM "CP_VC_HISTORY_TS" WHERE "PRODUCT_ID" =' +
//                     "'" +  vcRulesList[i].Product + "'" +  
//                     ' AND "GROUP_ID" =' + "'" +   vcRulesList[i].GroupID + "'" +
//                     ' AND "TYPE" =' + "'" +   vcRulesList[i].Type + "'" +
//                     ' AND "LOCATION_ID" =' + "'" +   vcRulesList[i].Location + "'";// + 'ORDER BY "WeekOfYear"';   
//         // console.log('_generateRegModels sqlStr ', sqlStr );

//         results = await cds.run(sqlStr);
//         // console.log('_generateRegModels results ', results );


//         vcRulesList[i].dimensions = results[0].NUMCHARS;
//         if (vcRulesList[i].dimensions == 1)
//             hasCharCount1 = true; 
//         if (vcRulesList[i].dimensions == 2)
//            hasCharCount2 = true; 
//         if (vcRulesList[i].dimensions == 3)
//            hasCharCount3 = true; 
//         if (vcRulesList[i].dimensions == 4)
//            hasCharCount4 = true; 
//         if (vcRulesList[i].dimensions == 5)
//            hasCharCount5 = true; 
//         if (vcRulesList[i].dimensions == 6)
//            hasCharCount6 = true; 
//         if (vcRulesList[i].dimensions == 7)
//            hasCharCount7 = true; 
//         if (vcRulesList[i].dimensions == 8)
//            hasCharCount8 = true; 
//         if (vcRulesList[i].dimensions == 9)
//            hasCharCount9 = true; 
//         if (vcRulesList[i].dimensions == 10)
//            hasCharCount10 = true; 
//         if (vcRulesList[i].dimensions == 11)
//            hasCharCount11 = true; 
//         if (vcRulesList[i].dimensions == 12)
//            hasCharCount12 = true;
        
//         //    console.log('_generateRegModels index i = ', i, ' vcRulesList[i].dimensions = ',vcRulesList[i].dimensions);

//     }
    
//  console.log('_generateRegModels Start Time',new Date());
// //  console.log('_generateRegModels vcRulesList ',vcRulesList);




// if (hasCharCount1 == true)
// {
    
//     let modelType = 'MLR';

//     let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
//     if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//     {
//         let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

//         let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
//         url = baseUrl + '/pal/mlrRegressions';
//         await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
//     }
    
//     modelType = 'HGBT';

//     ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
//     if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//     {
//         let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

//         let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
//         url =  baseUrl + '/pal/hgbtRegressionsV1';
//         await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
//     }

//     modelType = 'RDT';

//     ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
//     if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//     {
//         let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

//         let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
//         url =  baseUrl + '/pal/rdtRegressions';
//         await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
//     }

//     modelType = 'VARMA';

//     ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
//     if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//     {
//         let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

//         let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
//         url =  baseUrl + '/pal/varmaModels';
//         await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
//     }

// }

//     if (hasCharCount2 == true)
//     {
        
//         let modelType = 'MLR';

//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
//         }
        
//         modelType = 'HGBT';

//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
//         }

//         modelType = 'RDT';

//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
//         }

//         modelType = 'VARMA';

//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
//         }

//     }
//     if (hasCharCount3 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
//         }

//         modelType = 'HGBT';
        
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
//         }

//         modelType = 'RDT';
        
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
//         }

//         modelType = 'VARMA';
        
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount4 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount5 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 5);
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount6 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

//         }
//     }
//     if (hasCharCount7 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount8 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
       
//         }
//     }
//     if (hasCharCount9 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount10 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount11 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
//         }
//     }
//     if (hasCharCount12 == true)
//     {
//         let modelType = 'MLR';
//         let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
//             url = baseUrl + '/pal/mlrRegressions';
//             await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
//         }
//         modelType = 'HGBT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
//             url =  baseUrl + '/pal/hgbtRegressionsV1';
//             await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
//         }
//         modelType = 'RDT';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
//             url =  baseUrl + '/pal/rdtRegressions';
//             await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
//         }
//         modelType = 'VARMA';
//         ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
//         if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
//         {
//             let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

//             let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
//             url =  baseUrl + '/pal/varmaModels';
//             await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
//         }
//     }
 
//     console.log('_generateRegModels End Time',new Date());

//     let dataObj = {};
//     dataObj["success"] = true;
//     dataObj["message"] = "Generate Models Job Completed Successfully at " +  new Date();

//     if (req.headers['x-sap-job-id'] > 0)
//     {
//         const scheduler = getJobscheduler(req);

//         var updateReq = {
//             jobId: req.headers['x-sap-job-id'],
//             scheduleId: req.headers['x-sap-job-schedule-id'],
//             runId: req.headers['x-sap-job-run-id'],
//             data : dataObj
//             };

//         scheduler.updateJobRunLog(updateReq, function(err, result) {
//         if (err) {
//             return console.log('Error updating run log: %s', err);
//         }
 
//         });
//     }
//     }

        async generateModels (req){
            // var request = require('request');
        // var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host;  // Un-Comment while deploying
        // console.log("Started Generation of Clusters");
        var baseUrl = 'http' + '://' + req.headers.host;
        var sUrl = baseUrl + '/pal/genClusters';

        const liDistinctProd = await cds.run(
            `SELECT DISTINCT PRODUCT_ID
               FROM V_SALES_H
              WHERE LOCATION_ID = '${lLocation}'
                AND REF_PRODID = '${lProduct}'`
        );

        if (liDistinctProd.length > 0) {
            for (let i = 0; i < liDistinctProd.length; i++) {
                var options = {
                    'method': 'POST',
                    'url': sUrl,
                    'headers': {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        "vcRulesList": [
                            {
                                "profile": "SBP_AHC_0",
                                "override": false,
                                "Location": lLocation,
                                "Product": liDistinctProd[i].PRODUCT_ID
                            }
                        ]
                    })

                };

                request(options, function (error, response) {

                    if (error) throw new Error(error);

                    console.log(response.body);

                });
            }
            console.log("Completed Cluster Results Generation");
        }
        }


    // IBP Export functions
    // unable to find the code for "exportRestrReq"
    async exportIBPLocation (req){
         // Get Planning area and Prefix configurations for IBP
         let liParaValue = await GenF.getIBPParameterValue();
         let lData = "Nav" + liParaValue[1].VALUE.toString() + "LOCATION";
         let lEntity = "/" + liParaValue[1].VALUE.toString() + "LOCATIONTrans";
         let oReq = {
             newLoc: [],
         },
             vNewLoc, flag = '';
 
         const linewloc = await cds.run(
             `
             SELECT "LOCATION_ID",
                    "LOCATION_DESC"
                    FROM "CP_LOCATION" `);
 
         for (i = 0; i < linewloc.length; i++) {
             vNewLoc = {
                 "LOCID": linewloc[i].LOCATION_ID,
                 "LOCDESCR": linewloc[i].LOCATION_DESC,
             };
             oReq.newLoc.push(vNewLoc);
 
         }
         let vTransID = new Date().getTime().toString();
         let oEntry =
         {
             "TransactionID": vTransID,
             "RequestedAttributes": "LOCID,LOCDESCR",
             "DoCommit": true
         }
         oEntry[lData] = oReq.newLoc;
 
         try {
             await servicePost.tx(req).post(lEntity, oEntry);
             let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
             let vResponse = await servicePost.tx(req).get(resUrl);
             flag = 'X';
         }
         catch (error) {
 
         }
    }
    async exportIBPCustomer (req){
        
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "CUSTOMER";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "CUSTOMERTrans";
        let oReq = {
            cust: [],
        },
            vcust, flag = '';

        const licust = await cds.run(
            `
            SELECT "CUSTOMER_GROUP",
                   "CUSTOMER_DESC"
                   FROM "CP_CUSTOMERGROUP" `);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < licust.length; i++) {
            vcust = {
                "CUSTID": licust[i].CUSTOMER_GROUP,
                "CUSTDESCR": licust[i].CUSTOMER_DESC,
            };
            oReq.cust.push(vcust);

        }
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "CUSTID,CUSTDESCR",
            "DoCommit": true
        }
        oEntry[lData] = oReq.cust;

        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let aResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
    }
    async exportIBPMasterProd (req){
        // Send Response to Scheduler
        let liJobData = [];
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started export of Master Data";
        let res = req._.req.res;
        const litemp = JSON.stringify(req.data);
        liJobData = JSON.parse(litemp);
        values.push({ id, createtAt, message, liJobData });
        res.statusCode = 202;
        res.send({ values });


        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "PRODUCT";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "PRODUCTTrans";

        let oReq = {
            masterProd: [],
        },
            vmasterProd, flag = '';

        const limasterprod = await cds.run(
            `
             SELECT A.PRODUCT_ID,
             B.LOCATION_ID,
             A.PROD_DESC,
             A.PROD_FAMILY,
             A.PROD_GROUP,
             A.PROD_MODEL,
             A.PROD_MDLRANGE,
             A.PROD_SERIES,
             A.RESERVE_FIELD3         
               FROM "CP_PRODUCT" AS A
               INNER JOIN "CP_LOCATION_PRODUCT" AS B
               ON A.PRODUCT_ID = B.PRODUCT_ID            
               WHERE B.LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        const lipartialprod = await cds.run(
            `
             SELECT PRODUCT_ID,
                    LOCATION_ID,
                    PROD_DESC,
                    REF_PRODID
               FROM "CP_PARTIALPROD_INTRO"
               WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
               ORDER BY REF_PRODID`);

        const liComp = await cds.run(
            `
             SELECT DISTINCT PRODUCT_ID,
                    LOCATION_ID,
                    COMPONENT
               FROM "CP_BOMHEADER"
               WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
               ORDER BY COMPONENT`);

        const liAssemblyComp = await cds.run(
            `
             SELECT DISTINCT LOCATION_ID,
                    ASSEMBLY,
                    COMPONENT
               FROM "CP_ASSEMBLY_COMP"
               WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
               ORDER BY COMPONENT`);

        for (i = 0; i < limasterprod.length; i++) {
            for (iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
                if (lipartialprod[iPartial].REF_PRODID === limasterprod[i].PRODUCT_ID) {
                    vmasterProd = {
                        "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                        "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                        "PRDID": lipartialprod[iPartial].PRODUCT_ID,
                        "PRDGROUP": limasterprod[i].PROD_GROUP,
                        "VCMODEL": limasterprod[i].PROD_MODEL,
                        "PRDDESCR": lipartialprod[iPartial].PROD_DESC,
                        "PRDSERIES": limasterprod[i].PROD_SERIES
                    };
                    oReq.masterProd.push(vmasterProd);
                }
            }
            // BOM Components
            for (iComp = 0; iComp < liComp.length; iComp++) {
                if (liComp[iComp].PRODUCT_ID === limasterprod[i].PRODUCT_ID &&
                    liComp[iComp].LOCATION_ID === limasterprod[i].LOCATION_ID) {
                    vmasterProd = {
                        "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                        "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                        "PRDID": liComp[iComp].COMPONENT,
                        "PRDGROUP": limasterprod[i].PROD_GROUP,
                        "VCMODEL": limasterprod[i].PROD_MODEL,
                        "PRDDESCR": limasterprod[i].PROD_DESC,
                        "PRDSERIES": limasterprod[i].PROD_SERIES
                    };
                    oReq.masterProd.push(vmasterProd);

                    // Assembly Components
                    for (iAsmbComp = 0; iAsmbComp < liAssemblyComp.length; iAsmbComp++) {
                        if (liAssemblyComp[iAsmbComp].LOCATION_ID === liComp[iComp].LOCATION_ID &&
                            liAssemblyComp[iAsmbComp].ASSEMBLY === liComp[iComp].COMPONENT) {
                            vmasterProd = {
                                "VCMODELRANGE": limasterprod[i].PROD_MDLRANGE,
                                "PRDFAMILY": limasterprod[i].PROD_FAMILY,
                                "PRDID": liAssemblyComp[iAsmbComp].COMPONENT,
                                "PRDGROUP": limasterprod[i].PROD_GROUP,
                                "VCMODEL": limasterprod[i].PROD_MODEL,
                                "PRDDESCR": limasterprod[i].PROD_DESC,
                                "PRDSERIES": limasterprod[i].PROD_SERIES
                            };
                            oReq.masterProd.push(vmasterProd);
                        }

                    }

                }

            }

        }
        let Keys = ['PRDID'];
        oReq.masterProd = GenF.removeDuplicate(oReq.masterProd, Keys);

        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR,PRDSERIES",
            "DoCommit": true
        }
        oEntry[lData] = oReq.masterProd;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
        
    }
    async exportIBPLocProd (req){
        // Send Response to Scheduler
        let liJobData = [];
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started Location-Product export";
        let res = req._.req.res;
        const litemp = JSON.stringify(req.data);
        liJobData = JSON.parse(litemp);
        values.push({ id, createtAt, message, liJobData });
        res.statusCode = 202;
        res.send({ values });


        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "LOCATIONPRODUCT";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "LOCATIONPRODUCTTrans";
        let oReq = {
            newLocProd: [],
        },
            vNewLocProd, flag = '';
        const lilocprod = await cds.run(
            ` SELECT
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "LOTSIZE_KEY",
                        "LOT_SIZE",
                        "PROCUREMENT_TYPE",
                        "PLANNING_STRATEGY"
                      FROM CP_LOCATION_PRODUCT
                      WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        const lipartialprod = await cds.run(
            `
                         SELECT PRODUCT_ID,
                                LOCATION_ID,
                                PROD_DESC,
                                REF_PRODID
                           FROM "CP_PARTIALPROD_INTRO"
                           WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           ORDER BY REF_PRODID`);

        const liProdAsmComp = await cds.run(
            `
                             SELECT A.LOCATION_ID,
                                    A.COMPONENT
                               FROM "CP_ASSEMBLY_COMP" AS A
                               INNER JOIN "CP_BOMHEADER" AS B
                               ON A.LOCATION_ID = B.LOCATION_ID
                               AND A.ASSEMBLY = B.COMPONENT
                               WHERE A.LOCATION_ID = '`+ req.data.LOCATION_ID + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < lilocprod.length; i++) {
            vNewLocProd = {
                "LOCID": lilocprod[i].LOCATION_ID,
                "PRDID": lilocprod[i].PRODUCT_ID,
                "PLANNINGSTRGY": lilocprod[i].PLANNING_STRATEGY,
                "PLUNITID": "TEST",
                "PROCUREMENTTYPE": lilocprod[i].PROCUREMENT_TYPE,
                "VCLOTSIZE": lilocprod[i].LOT_SIZE.toString()
            };
            oReq.newLocProd.push(vNewLocProd);
            for (let iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
                if (lipartialprod[iPartial].LOCATION_ID === lilocprod[i].LOCATION_ID &&
                    lipartialprod[iPartial].REF_PRODID === lilocprod[i].PRODUCT_ID) {
                    vNewLocProd = {
                        "LOCID": lilocprod[i].LOCATION_ID,
                        "PRDID": lipartialprod[iPartial].PRODUCT_ID,
                        "PLANNINGSTRGY": lilocprod[i].PLANNING_STRATEGY,
                        "PLUNITID": "TEST",
                        "PROCUREMENTTYPE": lilocprod[i].PROCUREMENT_TYPE,
                        "VCLOTSIZE": lilocprod[i].LOT_SIZE.toString()
                    };
                    oReq.newLocProd.push(vNewLocProd);
                }
            }
            for (let iComp = 0; iComp < liProdAsmComp.length; iComp++) {
                if (liProdAsmComp[iComp].LOCATION_ID === lilocprod[i].LOCATION_ID) {
                    vNewLocProd = {
                        "LOCID": lilocprod[i].LOCATION_ID,
                        "PRDID": liProdAsmComp[iComp].COMPONENT,
                        "PLANNINGSTRGY": lilocprod[i].PLANNING_STRATEGY,
                        "PLUNITID": "TEST",
                        "PROCUREMENTTYPE": lilocprod[i].PROCUREMENT_TYPE,
                        "VCLOTSIZE": lilocprod[i].LOT_SIZE.toString()
                    };
                    oReq.newLocProd.push(vNewLocProd);
                }
            }
        }

        let Keys = ['LOCID', 'PRDID'];
        oReq.newLocProd = GenF.removeDuplicate(oReq.newLocProd, Keys);
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "LOCID,PRDID,PLANNINGSTRGY,PLUNITID,PROCUREMENTTYPE,VCLOTSIZE",
            "DoCommit": true
        }
        oEntry[lData] = oReq.newLocProd;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            let vResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
    }
    async exportIBPAssembly (req){
         // Get Planning area and Prefix configurations for IBP
         let liParaValue = await GenF.getIBPParameterValue();
         let lData = "Nav" + liParaValue[1].VALUE.toString() + "LOCPRODCOMPONENT";
         let lEntity = "/" + liParaValue[1].VALUE.toString() + "LOCPRODCOMPONENTTrans";
 
         let oReq = {
             masterProd: [],
         },
             vmasterProd, flag = '';
 
 
 
         const liComp = await cds.run(
             `
              SELECT DISTINCT PRODUCT_ID,
                     LOCATION_ID,
                     COMPONENT,
                     STRUC_NODE
                FROM "V_BOMPVS"
                WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                ORDER BY COMPONENT`);
 
 
         // BOM Components
         for (iComp = 0; iComp < liComp.length; iComp++) {
             vmasterProd = {
                 "LOCID": liComp[iComp].LOCATION_ID,
                 "PRDID": liComp[iComp].PRODUCT_ID,
                 "PRDFR": liComp[iComp].COMPONENT,
                 "VCSTRUCTURENODE": liComp[iComp].STRUC_NODE
             };
             oReq.masterProd.push(vmasterProd);
         }
         // let Keys = ['PRDID'];
         // oReq.masterProd = GenF.removeDuplicate(oReq.masterProd, Keys);
 
         let vTransID = new Date().getTime().toString();
         let oEntry =
         {
             "TransactionID": vTransID,
             "RequestedAttributes": "LOCID,PRDID,PRDFR,VCSTRUCTURENODE",
             "DoCommit": true
         }
         oEntry[lData] = oReq.masterProd;
         try {
             await servicePost.tx(req).post(lEntity, oEntry);
             let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
             let vResponse = await servicePost.tx(req).get(resUrl);
             flag = 'X';
         }
         catch (error) {
 
         }
    }
    async exportIBPClass (req){
        // Send Response to Scheduler
        let liJobData = [];
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started export of Class , Charateristics and Charateristics values";
        let res = req._.req.res;
        const litemp = JSON.stringify(req.data);
        liJobData = JSON.parse(litemp);
        values.push({ id, createtAt, message, liJobData });
        res.statusCode = 202;
        res.send({ values });

        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "CLASS";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "CLASSTrans";
        let oReq = {
            class: [],
        },
            vclass, aResponse, flag = '';

        const liclass = await cds.run(
            `
            SELECT CLASS_NUM,
                    CLASS_NAME,
                    CLASS_DESC,
                    CHAR_NUM,
                    CHAR_NAME,
                    CHAR_DESC,
                    CHAR_GROUP,
                    CHAR_VALUE,
                    CHARVAL_NUM,
                    CHARVAL_DESC
                    FROM V_CLASSCHARVAL 
                WHERE CLASS_NUM = '`+ req.data.CLASS_NUM + `'`);

        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        for (i = 0; i < liclass.length; i++) {
            vclass = {
                "VCCHAR": liclass[i].CHAR_NUM,
                "VCCHARVALUE": liclass[i].CHARVAL_NUM,
                "VCCLASS": liclass[i].CLASS_NUM,
                "VCCHARNAME": liclass[i].CHAR_NAME,
                "VCCHARGROUP": liclass[i].CHAR_GROUP,
                "VCCHARVALUENAME": liclass[i].CHAR_VALUE,
                "VCCLASSNAME": liclass[i].CLASS_NAME,
                "VCCHARDESC": liclass[i].CHAR_DESC,
                "VCCHARVALUEDESC": liclass[i].CHARVAL_DESC,
                "VCCLASSDESC": liclass[i].CLASS_DESC
            };
            oReq.class.push(vclass);

        }
        let vTransID = new Date().getTime().toString();
        let oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCCHAR,VCCHARGROUP,VCCHARNAME,VCCHARVALUE,VCCHARVALUENAME,VCCLASS,VCCLASSNAME,VCCHARDESC,VCCHARVALUEDESC,VCCLASSDESC",
            "DoCommit": true
        }
        oEntry[lData] = oReq.class;
        try {
            await servicePost.tx(req).post(lEntity, oEntry);
            let resUrl = "/GetExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
            aResponse = await servicePost.tx(req).get(resUrl);
            flag = 'X';
        }
        catch (error) {

        }
    }
    async exportRestrDetails (req){
        
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[1].VALUE.toString() + "RESTRICTION";
        let lEntity = "/" + liParaValue[1].VALUE.toString() + "RESTRICTIONTrans";
        let lEntityLoc = "/" + liParaValue[1].VALUE.toString() + "LOCRESTRICTIONTrans";
        let vFlag = '';

        await GenF.logMessage(req, `Started exporting Restriction header`);
        let oReq = await obibpfucntions.exportRtrHdrDet(req);
        if (oReq.rtrhdr.length > 0) {
            let vTransID = new Date().getTime().toString();
            let vTransID2 = new Date().getTime().toString();
            let oEntry =
            {
                "TransactionID": vTransID,
                "RequestedAttributes": "VCRESTRICTIONID,VCRESTRICTIONDESC,VCRESTRICTIONTYPE",
                "DoCommit": true
            }
            oEntry[lData] = oReq.rtrhdr;
            let oEntry2 =
            {
                "TransactionID": vTransID2,
                "RequestedAttributes": "LOCID,VCRESTRICTIONID,VCPLACEHOLDER",
                "DoCommit": true
            }
            oEntry2[lData] = oReq.locrtr;
            try {
                await servicePost.tx(req).post(lEntity, oEntry);
                await servicePost.tx(req).post(lEntityLoc, oEntry2);
                vFlag = 'S';
            }
            catch (e) {
                vFlag = '';
            }
        }
    }
    async exportIBPSalesTrans (req){
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[0].VALUE.toString();
        let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
        let oReq = {
            sales: [],
        },
            vsales, flag = '', lMessage = '';
        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting Sales History and Configurations";
        let res = req._.req.res;
        // let lilocProdReq = {};
        let lilocProdReq = JSON.parse(req.data.LocProdData);
        // lilocProdReq.LOCATION_ID = "AS01";
        // lilocProdReq.PRODUCT_ID = "ALL"
        if (lilocProdReq[0].PRODUCT_ID === "ALL") {
            lsData.LOCATION_ID = lilocProdReq[0].LOCATION_ID;
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
            lsData = {};
            lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
            const lisales = await cds.run(
                `
                    SELECT  DISTINCT "WEEK_DATE",
                            "LOCATION_ID",
                            "PRODUCT_ID",
                            "ORD_QTY",
                            "ADJ_QTY",
                            "CUSTOMER_GROUP"
                            FROM V_IBP_SALESH_ACTDEMD
                            WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                               AND PRODUCT_ID = '`+ lsData.PRODUCT_ID +
                `'`);
            for (i = 0; i < lisales.length; i++) {
                let vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = lisales[i].ORD_QTY.split('.');
                let vAdjqty = lisales[i].ADJ_QTY.split('.');
                vsales = {
                    "LOCID": lisales[i].LOCATION_ID,
                    "PRDID": lisales[i].PRODUCT_ID,
                    "CUSTID": lisales[i].CUSTOMER_GROUP,
                    "ACTUALDEMAND": vDemd[0],
                    "SEEDORDERDEMAND": vAdjqty[0],
                    "PERIODID0_TSTAMP": vWeekDate[0]
                };
                oReq.sales.push(vsales);

            }
            if (oReq.sales.length > 0) {
                let vTransID = new Date().getTime().toString();
                let oEntry =
                {
                    "Transactionid": vTransID,
                    "AggregationLevelFieldsString": "LOCID,PRDID,CUSTID,ACTUALDEMAND,SEEDORDERDEMAND,PERIODID0_TSTAMP",
                    "VersionID": "",
                    "DoCommit": true,
                    "ScenarioID": ""
                }
                oEntry[lData] = oReq.sales
                try {
                    await service.tx(req).post(lEntity, oEntry);
                    flag = 'S';
                }
                catch {
                    console.log("Unable to send Actual demand at VC");
                }
                
            }
        }
        // await GenF.jobSchMessage('X', lMessage, req);
    }
    async exportActCompDemand (req){
         // Get Planning area and Prefix configurations for IBP
         let liParaValue = await GenF.getIBPParameterValue();
         let lData = "Nav" + liParaValue[0].VALUE.toString();
         let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
 
         let oReq = {
             actcomp: [],
         },
             vactcomp, lMessage = '';
         // Generating payload for job scheduler logs
         let lilocProd = {};
         let lsData = {};
         let createtAt = new Date();
         let id = uuidv1();
         let values = [];
         let message = "Started exporting Sales History and Configurations";
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
         res.statusCode = 202;
         res.send({ values });
         // Fetch History period from Configuration table
         const lsSales = await GenF.getParameterValue(lilocProd[0].LOCATION_ID, 4);
         console.log(lsSales);
         let vToDate = new Date().toISOString().split('Z')[0].split('T')[0];
         console.log(vToDate);
 
         let vFromDate = new Date();
         vFromDate.setDate(vFromDate.getDate() - (parseInt(lsSales) * 7));
         vFromDate = vFromDate.toISOString().split('Z')[0].split('T')[0];
         console.log(vFromDate);
 
         for (let i = 0; i < lilocProd.length; i++) {
             lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
             lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
             lsData.CRITICALKEY = lilocProd[i].CRITICALKEY;
             const liactcomp = await cds.run(
                 `
                 SELECT DISTINCT "WEEK_DATE",
                         "LOCATION_ID",
                         "PRODUCT_ID",
                         "ACTUALCOMPONENTDEMAND",
                         "COMPONENT"
                         FROM V_IBP_LOCPRODCOMP_ACTDEMD
                         WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                            AND PRODUCT_ID = '`+ lsData.PRODUCT_ID +
                 `' AND WEEK_DATE >= '` + vFromDate +
                 `' AND WEEK_DATE <= '` + vToDate + `'`);
 
             const licriticalcomp = await cds.run(
                 `
                     SELECT  "LOCATION_ID",
                             "PRODUCT_ID",
                             "ITEM_NUM",
                             "COMPONENT",
                             "CRITICALKEY"
                             FROM CP_CRITICAL_COMP
                             WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                               AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `'                               
                               AND CRITICALKEY = '` + lsData.CRITICALKEY + `'`);
             if (lsData.CRITICALKEY === "X") {
                 for (i = 0; i < liactcomp.length; i++) {
                     for (let j = 0; j < licriticalcomp.length; j++) {
                         if (liactcomp[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                             liactcomp[i].PRODUCT_ID === licriticalcomp[j].PRODUCT_ID &&
                             //liactcomp[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                             liactcomp[i].COMPONENT === licriticalcomp[j].COMPONENT) {
 
                             let vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
                             let vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');
 
                             vactcomp = {
                                 "LOCID": liactcomp[i].LOCATION_ID,
                                 "PRDID": liactcomp[i].PRODUCT_ID,
                                 "ACTUALCOMPONENTDEMAND": vDemd[0],
                                 "PRDFR": liactcomp[i].COMPONENT,
                                 "PERIODID0_TSTAMP": vWeekDate[0]
                             };
 
                             oReq.actcomp.push(vactcomp);
                         }
                     }
                 }
             } else {
                 for (i = 0; i < liactcomp.length; i++) {
                     let vWeekDate = new Date(liactcomp[i].WEEK_DATE).toISOString().split('Z');
                     let vDemd = liactcomp[i].ACTUALCOMPONENTDEMAND.split('.');
                     vactcomp = {
                         "LOCID": liactcomp[i].LOCATION_ID,
                         "PRDID": liactcomp[i].PRODUCT_ID,
                         "ACTUALCOMPONENTDEMAND": vDemd[0],
                         "PRDFR": liactcomp[i].COMPONENT,
                         "PERIODID0_TSTAMP": vWeekDate[0]
                     };
                     oReq.actcomp.push(vactcomp);
                 }
             }
             if (oReq.actcomp.length > 0) {
                 let vTransID = new Date().getTime().toString();
                 let oEntry =
                 {
                     "Transactionid": vTransID,
                     "AggregationLevelFieldsString": "LOCID,PRDID,ACTUALCOMPONENTDEMAND,PERIODID0_TSTAMP,PRDFR",
                     "VersionID": "",
                     "DoCommit": true,
                     "ScenarioID": ""
                 }
                 oEntry[lData] = oReq.actcomp;
                 try {
                     await service.tx(req).post(lEntity, oEntry);
                     let resUrl = "/getExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
                     await service.tx(req).get(resUrl);
                     flag = 'X';
                     lMessage = lMessage + ' ' + 'Export of Actual Component Demand is successfull for product:' + lsData.PRODUCT_ID;
                 }
                 catch {
                     lMessage = lMessage + ' ' + 'Export of Actual Component Demand failed for product:' + lsData.PRODUCT_ID;
                 }
             }
             else {
                 lMessage = lMessage + ' ' + 'No Actual Component Demand exists on Crtical components for product:' + lsData.PRODUCT_ID;
             }
         }
        //  await GenF.jobSchMessage('X', lMessage, req);
        //  return "S";
    }
    async exportMktAuth (req){
        
        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[0].VALUE.toString();
        let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
        let oReq = {
            mktauth: [],
        },
            vMktauth, vFlag = '', lMessage = '';

        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting Market authorization";
        let res = request._.req.res;
        let lilocProdReq = JSON.parse(request.data.LocProdData);
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
            lilocProd = JSON.parse(request.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        for (let i = 0; i < lilocProd.length; i++) {
            lsData.LOCATION_ID = lilocProd[i].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[i].PRODUCT_ID;
            const limkauth = await cds.run(
                `
                SELECT CP_MARKETAUTH_CFG."WEEK_DATE",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       V_CHARVAL."CLASS_NUM",
                       CP_MARKETAUTH_CFG."CHAR_NUM",
                       CP_MARKETAUTH_CFG."CHARVAL_NUM",
                       CP_MARKETAUTH_CFG."LOCATION_ID",
                       CP_MARKETAUTH_CFG."PRODUCT_ID",
                       CP_MARKETAUTH_CFG."OPT_PERCENT",
                       CP_MARKETAUTH_CFG."VERSION",
                       CP_MARKETAUTH_CFG."SCENARIO"
                    FROM CP_MARKETAUTH_CFG
              INNER JOIN V_CHARVAL
                      ON CP_MARKETAUTH_CFG.CHAR_NUM  = V_CHARVAL.CHAR_NUM
                     AND CP_MARKETAUTH_CFG.CHARVAL_NUM  = V_CHARVAL.CHARVAL_NUM
                   WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                     AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `' 
            `);
            for (i = 0; i < limkauth.length; i++) {
                let vDemd;
                let vWeekDate = new Date(limkauth[i].WEEK_DATE).toISOString().split('Z');
                // let vOpt = ((parseFloat(limkauth[i].OPT_PERCENT)/100)).toString();

                let vOpt = limkauth[i].OPT_PERCENT.toString();
                let vSrch = vOpt.search(".");
                if (vSrch > 0) {
                    vDemd = vOpt.split('.')[0];
                }
                else {
                    vDemd = vOpt;
                }
                vDemd = parseInt(vDemd) / 100;
                // console.log(vWeekDate);
                // console.log(vDemd);
                vMktauth = {
                    "LOCID": limkauth[i].LOCATION_ID,
                    "PRDID": limkauth[i].PRODUCT_ID,
                    "VCCHAR": limkauth[i].CHAR_NUM,
                    "VCCHARVALUE": limkauth[i].CHARVAL_NUM,
                    "VCCLASS": limkauth[i].CLASS_NUM,
                    "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
                    "PERIODID4_TSTAMP": vWeekDate[0],
                    // "VERSIONID": limkauth[i].VERSION,
                    // "SCENARIOID": limkauth[i].SCENARIO,
                    "MARKETAUTHORIZATION": vDemd.toString()
                };
                // console.log(vMktauth);
                oReq.mktauth.push(vMktauth);

            }
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "PERIODID4_TSTAMP,VCCHAR,VCCHARVALUE,VCCLASS,CUSTID,LOCID,PRDID,MARKETAUTHORIZATION",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": ""
            }
            oEntry[lData] = oReq.mktauth;

            try {
                await service.tx(req).post(lEntity, oEntry);
                lMessage = lMessage + ' ' + "Export of Market authorization is successfull for product" + lsData.PRODUCT_ID;
                vFlag = 'S';
            }
            catch (error) {
                vFlag = '';
                lMessage = lMessage + ' ' + "Export of Market authorization has failed for product" + lsData.PRODUCT_ID;
            }
        }
        // await GenF.jobSchMessage('X', lMessage, request);
    }
    async exportComponentReq (req){
         // Send Response to Scheduler
         let liJobData = [];
         let createtAt = new Date();
         let id = uuidv1();
         let values = [];
         let message = "Started export of Component req.";
         let res = req._.req.res;
         const litemp = JSON.stringify(req.data);
         liJobData = JSON.parse(litemp);
         values.push({ id, createtAt, message, liJobData });
         res.statusCode = 202;
         res.send({ values });
 
 
         // Get Planning area and Prefix configurations for IBP
         let liParaValue = await GenF.getIBPParameterValue();
         let lData = "Nav" + liParaValue[0].VALUE.toString();
         let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
         let oReq = {
             actcompreq: [],
         },
             vactcompreq, lMessage = '';
         // let vFromDate = '2022-12-01';
         // let vToDate = '2023-12-20';
         let liactcompreq, licriticalcomp;
         let lMethod = await GenF.getParameterValue(req.data.LOCATION_ID, 5);
         switch (await GenF.getParameterValue(req.data.LOCATION_ID, 5)) {
             case 'M1':
                 liactcompreq = await cds.run(
                     `
                         SELECT DISTINCT "WEEK_DATE",
                                 "LOCATION_ID",
                                 "PRODUCT_ID",
                                 "COMPONENT",
                                 "COMP_QTY"
                                 FROM V_ASSEMBLYREQ
                                 WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                                    AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
                     `' AND MODEL_VERSION = 'Active'
                     AND WEEK_DATE >= '` + req.data.FROMDATE +
                     `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                                    AND COMP_QTY >= 0`);
                 console.log(liactcompreq.length);
                 break;
             case 'M2':
                 liactcompreq = await cds.run(
                     `
                 SELECT DISTINCT "WEEK_DATE",
                         "LOCATION_ID",
                         "PRODUCT_ID",
                         "COMPONENT",
                         "REF_PRODID",
                         "COMPCIR_QTY" AS "COMP_QTY"
                         FROM CP_ASSEMBLY_REQ
                         WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                            AND REF_PRODID = '`+ req.data.PRODUCT_ID +
                     `' AND MODEL_VERSION = 'Active'
             AND WEEK_DATE >= '` + req.data.FROMDATE +
                     `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                            AND COMPCIR_QTY >= 0`);
                 console.log(liactcompreq.length);
 
                 licriticalcomp = await cds.run(
                     `
                 SELECT  "LOCATION_ID",
                         "PRODUCT_ID",
                         "ITEM_NUM",
                         "COMPONENT",
                         "CRITICALKEY"
                     FROM CP_CRITICAL_COMP
                     WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'                               
                           AND CRITICALKEY = '` + req.data.CRITICALKEY + `'`);
                 console.log(licriticalcomp.length);
                 break;
         }
 
 
         if (req.data.CRITICALKEY === "X" && lMethod === 'M2') {
             for (i = 0; i < liactcompreq.length; i++) {
                 for (let j = 0; j < licriticalcomp.length; j++) {
                     if (liactcompreq[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                         liactcompreq[i].REF_PRODID === licriticalcomp[j].PRODUCT_ID &&
                         //liactcompreq[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                         liactcompreq[i].COMPONENT === licriticalcomp[j].COMPONENT) {
 
                         let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                         let vDemd = parseFloat(liactcompreq[i].COMP_QTY).toFixed(2);
 
                         vactcompreq = {
                             "LOCID": liactcompreq[i].LOCATION_ID,
                             "PRDID": liactcompreq[i].PRODUCT_ID,
                             "PRDFR": liactcompreq[i].COMPONENT,
                             "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                             "PERIODID0_TSTAMP": vWeekDate[0]
                         };
                         oReq.actcompreq.push(vactcompreq);
                     }
                 }
 
             }
             // console.log(oReq.actcompreq.length);
             console.log(oReq.actcompreq);
 
         } else {
             for (i = 0; i < liactcompreq.length; i++) {
                 let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                 let vDemd = parseFloat(liactcompreq[i].COMP_QTY).toFixed(2);
                 vactcompreq = {
                     "LOCID": liactcompreq[i].LOCATION_ID,
                     "PRDID": liactcompreq[i].PRODUCT_ID,
                     "PRDFR": liactcompreq[i].COMPONENT,
                     "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                     "PERIODID0_TSTAMP": vWeekDate[0]
                 };
                 oReq.actcompreq.push(vactcompreq);
 
             }
             console.log(oReq.actcompreq.length);
             console.log(oReq.actcompreq);
         }
 
         if (oReq.actcompreq.length > 0) {
             let vTransID = new Date().getTime().toString();
             let oEntry =
             {
                 "Transactionid": vTransID,
                 "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID0_TSTAMP",
                 "VersionID": "",
                 "DoCommit": true,
                 "ScenarioID": ""
             }
             oEntry[lData] = oReq.actcompreq;
             try {
                 await service.tx(req).post(lEntity, oEntry);
                 //let resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
                 let resUrl = "/getExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
                 await service.tx(req).get(resUrl);
                 flag = 'X';
             }
             catch {
 
             }
             if (flag === 'X') {
                 lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity is successful for product:' + req.data.PRODUCT_ID;
             } else {
                 lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity failed for product:' + req.data.PRODUCT_ID;
             }
         }
         else {
             lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity failed as no critical Assemblies exists for product:' + req.data.PRODUCT_ID;
         }
        //  await GenF.jobSchMessage('X', lMessage, req);
         // return lMessage;
    }
    async exportIBPCIR (req){
         // Get Planning area and Prefix configurations for IBP
         let liParaValue = await GenF.getIBPParameterValue();
         let lData = "Nav" + liParaValue[0].VALUE.toString();
         let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
         let oReq = {
             cir: [],
         },
             lMessage = '',
             vCIR;
         // Generating payload for job scheduler logs
         let lilocProd = {};
         let lsData = {};
         let createtAt = new Date();
         let id = uuidv1();
         let values = [];
         let message = "Started exporting CIR to IBP";
         let res = request._.req.res;
         let lilocProdReq = JSON.parse(request.data.LocProdData);
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
             lilocProd = JSON.parse(request.data.LocProdData);
         }
         values.push({ id, createtAt, message, lilocProd });
         res.statusCode = 202;
         res.send({ values });
         for (let iloc = 0; iloc < lilocProd.length; iloc++) {
             flag = ' ';
             lsData.LOCATION_ID = lilocProd[iloc].LOCATION_ID;
             lsData.PRODUCT_ID = lilocProd[iloc].PRODUCT_ID;
             const licir = await cds.run(
                 `
                 SELECT *
                    FROM "V_CIRTOIBP" 
                    WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                               AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `'
                               AND MODEL_VERSION = 'Active'`);
 
             //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
             for (let i = 0; i < licir.length; i++) {
 
                 let vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
                 vCIR = {
                     "LOCID": licir[i].LOCATION_ID,
                     "PRDID": licir[i].PRODUCT_ID,
                     "VCCLASS": licir[i].CLASS_NUM,
                     "VCCHAR": licir[i].CHAR_NUM,
                     "VCCHARVALUE": licir[i].CHARVAL_NUM,
                     // "CUSTID": "NULL",
                     "FORECASTORDERQTY": licir[i].CIRQTY.toString(),
                     "PERIODID4_TSTAMP": vWeekDate
                 };
                 oReq.cir.push(vCIR);
             }
             if (oReq.cir.length > 0) {
                 let vTransID = new Date().getTime().toString();
                 let oEntry =
                 {
                     "Transactionid": vTransID,
                     "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,FORECASTORDERQTY,PERIODID4_TSTAMP",
                     "DoCommit": true
                 }
                 oEntry[lData] = oReq.cir;
                 try {
                     await service.tx(request).post(lEntity, oEntry);
                     flag = 'X';
                 }
                 catch (err) {
                     console.log(err);
                     flag = ' ';
                 }
 
                 if (flag === 'X') {
                     lMessage = lMessage + ' ' + "Export of CIR to IBP is successful for product" + lsData.PRODUCT_ID;
                 } else {
                     lMessage = lMessage + ' ' + "Export of CIR to IBP has failed for product" + lsData.PRODUCT_ID;
                 }
             }
             else {
                 lMessage = lMessage + ' ' + "Export of CIR to IBP is unsuccessful product" + lsData.PRODUCT_ID + " beacuse of insufficient data ";
             }
             // return "S";
            //  await GenF.jobSchMessage('X', lMessage, request);
         }
    }

    // Not found in ibp import
    async exportRestrReq (req){
        
    }

}

// Step 2
class preDefFuture {
    constructor() {

     }

    async generateFDemandQty(request) {
        let lMessage = '', flag;
        let lVersion, lScenario, vFromDate, vToDate;
        let lilocProdReq = JSON.parse(request.data.MARKETDATA);
        let lsData = {};
        for (let iloc = 0; iloc < aLocProd.length; iloc++) {
            lsData.LOCATION_ID = aLocProd[iloc].LOCATION_ID;//"PL20";//
            lsData.PRODUCT_ID = aLocProd[iloc].PRODUCT_ID;//"61AEAPP0E219";//
            lVersion = lilocProdReq[0].VERSION;//'__BASELINE';//
            lScenario = lilocProdReq[0].SCENARIO;//'BSL_SCENARIO';//
            vFromDate = lilocProdReq[0].FROMDATE;//'2022-11-21'//
            vToDate = lilocProdReq[0].TODATE;//'2022-12-21'// 
            var resUrl = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and SCENARIOID eq '" + lScenario + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
            try{
            var req = await service.tx(req).get(resUrl);
            }
            catch(e){
                flag = 'T';
            }
            // if(req.length > 0){
            const vDelDate = new Date();
            const vDateDeld = vDelDate.toISOString().split('T')[0];
            try {
                await DELETE.from('CP_IBP_FUTUREDEMAND')
                    .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                        AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                        AND WEEK_DATE  < '${vDateDeld}'`);
            }
            catch (e) {
                //Do nothing
            }
            // }
            const dateJSONToEDM = jsonDate => {
                const content = /\d+/.exec(String(jsonDate));
                const timestamp = content ? Number(content[0]) : 0;
                const date = new Date(timestamp);
                const string = date.toISOString().split('T')[0];
                return string;
            };
            flag = '';
            for (var i in req) {
                var vWeekDate = dateJSONToEDM(req[i].PERIODID4_TSTAMP);
                var vScenario = 'BSL_SCENARIO';
                req[i].PERIODID4_TSTAMP = vWeekDate;

                if (vWeekDate >= vDateDeld) {
                    await cds.run(
                        `DELETE FROM "CP_IBP_FUTUREDEMAND" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                      AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                      AND "VERSION" = '` + req[i].VERSIONID + `'
                                                      AND "SCENARIO" = '` + vScenario + `'
                                                      AND "WEEK_DATE" = '` + vWeekDate + `'`
                    );
                    let modQuery = 'INSERT INTO "CP_IBP_FUTUREDEMAND" VALUES (' +
                        "'" + req[i].LOCID + "'" + "," +
                        "'" + req[i].PRDID + "'" + "," +
                        "'" + req[i].VERSIONID + "'" + "," +
                        "'" + vScenario + "'" + "," +
                        "'" + vWeekDate + "'" + "," +
                        "'" + req[i].TOTALDEMANDOUTPUT + "'" + ')';// + ' WITH PRIMARY KEY';
                    try {
                        await cds.run(modQuery);
                        flag = 'D';
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
            if (flag === 'D') {
                //////////////////////////////////////////
                flag = '';
                var resUrlFplan;
                const dateJSONToEDM2 = jsonDate => {
                    const content = /\d+/.exec(String(jsonDate));
                    const timestamp = content ? Number(content[0]) : 0;
                    const date = new Date(timestamp);
                    const string = date.toISOString();
                    return string;
                };
                // if (vServ === 'IBP') {
                //     resUrlFplan = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                // }
                // else if (vServ === 'MKTAUTH') {
                resUrlFplan = "/SBPVCP?$select=PERIODID4_TSTAMP,PRDID,LOCID,VCCLASS,VCCHARVALUE,VCCHAR,FINALDEMANDVC,OPTIONPERCENTAGE,VERSIONID,SCENARIOID&$filter=LOCID eq '" + lsData.LOCATION_ID + "' and PRDID eq '" + lsData.PRODUCT_ID + "' and PERIODID4_TSTAMP gt datetime'" + vFromDate + "' and PERIODID4_TSTAMP lt datetime'" + vToDate + "' and VERSIONID eq '" + lVersion + "' and SCENARIOID eq '" + lScenario + "' and UOMTOID eq 'EA' and FINALDEMANDVC gt 0&$inlinecount=allpages";
                // }
                try{
                var req = await service.tx(request).get(resUrlFplan);
                }
                catch(e){
                    flag = 'T';
                }
                const vDelDate = new Date();
                const vDateDel = vDelDate.toISOString().split('T')[0];
                try {
                    await DELETE.from('CP_IBP_FCHARPLAN')
                        .where(`LOCATION_ID = '${lsData.LOCATION_ID}' 
                        AND PRODUCT_ID = '${lsData.PRODUCT_ID}'
                        AND WEEK_DATE    < '${vDateDel}'`);
                }
                catch (e) {
                    //Do nothing
                }
                for (var i in req) {
                    var vWeekDate = dateJSONToEDM2(req[i].PERIODID4_TSTAMP).split('T')[0];
                    var vScenario = 'BSL_SCENARIO';
                    req[i].PERIODID4_TSTAMP = vWeekDate;
                    if (vWeekDate >= vDateDel) {
                        await cds.run(
                            `DELETE FROM "CP_IBP_FCHARPLAN" WHERE "LOCATION_ID" = '` + req[i].LOCID + `' 
                                                          AND "PRODUCT_ID" = '`+ req[i].PRDID + `'
                                                          AND "CLASS_NUM" = '` + req[i].VCCLASS + `' 
                                                          AND "CHAR_NUM" = '` + req[i].VCCHAR + `' 
                                                          AND "CHARVAL_NUM" = '` + req[i].VCCHARVALUE + `' 
                                                          AND "VERSION" = '` + req[i].VERSIONID + `'
                                                          AND "SCENARIO" = '` + vScenario + `'
                                                          AND "WEEK_DATE" = '` + vWeekDate + `'`
                        );

                        let modQuery = 'INSERT INTO "CP_IBP_FCHARPLAN" VALUES (' +
                            "'" + req[i].LOCID + "'" + "," +
                            "'" + req[i].PRDID + "'" + "," +
                            "'" + req[i].VCCLASS + "'" + "," +
                            "'" + req[i].VCCHAR + "'" + "," +
                            "'" + req[i].VCCHARVALUE + "'" + "," +
                            "'" + req[i].VERSIONID + "'" + "," +
                            "'" + vScenario + "'" + "," +
                            "'" + vWeekDate + "'" + "," +
                            "'" + req[i].OPTIONPERCENTAGE + "'" + "," +
                            "'" + req[i].FINALDEMANDVC + "'" + "," +
                            "'" + req[i].MANUALOPTION + "'" + ')';// + ' WITH PRIMARY KEY';
                        try {
                            await cds.run(modQuery);
                            flag = 'S';
                            // if (vServ === 'MKTAUTH') {
                            obgenMktAuth.updateOptPer(req[i].LOCID, req[i].PRDID, vWeekDate, req[i].VERSIONID, vScenario);
                            // }
                        }
                        catch (err) {
                            flag = 'E';
                            console.log(err);
                        }
                    }
                }
            }
        }
        return flag;
    }
    async timeseriesfuture(req) {
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
        // const obgenTimeseries_rt = new GenTimeseriesRT();
        // await obgenTimeseries_rt.genTimeseriesF_rt(req.data, req);
        
    }
    // async genPredictions(req) {
        
    // }
    // Generate Forecast Order
    async genFullConfigDemand(req) {
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
        
    }
    // async generateAssemblyReq(req) {

        
    // }

    //export ibp forecast demand
    async exportIBPCIR(request) { 
          // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[0].VALUE.toString();
        let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
        let oReq = {
            cir: [],
        },
            lMessage = '',
            vCIR;
        // Generating payload for job scheduler logs
        let lilocProd = {};
        let lsData = {};
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started exporting CIR to IBP";
        let res = request._.req.res;
        let lilocProdReq = JSON.parse(request.data.LocProdData);
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
            lilocProd = JSON.parse(request.data.LocProdData);
        }
        values.push({ id, createtAt, message, lilocProd });
        res.statusCode = 202;
        res.send({ values });
        for (let iloc = 0; iloc < lilocProd.length; iloc++) {
            lsData.LOCATION_ID = lilocProd[iloc].LOCATION_ID;
            lsData.PRODUCT_ID = lilocProd[iloc].PRODUCT_ID;
            const licir = await cds.run(
                `
                SELECT *
                   FROM "V_CIRTOIBP" 
                   WHERE LOCATION_ID = '`+ lsData.LOCATION_ID + `'
                              AND PRODUCT_ID = '`+ lsData.PRODUCT_ID + `'
                              AND MODEL_VERSION = 'Active'`);

            //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
            for (let i = 0; i < licir.length; i++) {

                let vWeekDate = new Date(licir[i].WEEK_DATE).toISOString().split('Z')[0];
                vCIR = {
                    "LOCID": licir[i].LOCATION_ID,
                    "PRDID": licir[i].PRODUCT_ID,
                    "VCCLASS": licir[i].CLASS_NUM,
                    "VCCHAR": licir[i].CHAR_NUM,
                    "VCCHARVALUE": licir[i].CHARVAL_NUM,
                    "CUSTID": "NULL",
                    "FORECASTORDERQTY": licir[i].CIRQTY.toString(),
                    "PERIODID4_TSTAMP": vWeekDate
                };
                oReq.cir.push(vCIR);
            }
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,VCCLASS,VCCHAR,VCCHARVALUE,CUSTID,FORECASTORDERQTY,PERIODID4_TSTAMP",
                "DoCommit": true
            }
            oEntry[lData] = oReq.cir;
            try {
                await service.tx(request).post(lEntity, oEntry);
                flag = 'X';
            }
            catch (err) {
                console.log(err);
                flag = ' ';
            }

            if (flag === 'X') {
                lMessage = lMessage + ' ' + "Export of CIR to IBP is successful for product" + lsData.PRODUCT_ID;
            } else {
                lMessage = lMessage + ' ' + "Export of CIR to IBP has failed for product" + lsData.PRODUCT_ID;
            }
            // return "S";
            await GenF.jobSchMessage('X', lMessage, request);
        } 
    }

    // export Component Req
    async exportassemblyqty(req) {
       // Send Response to Scheduler
        let liJobData = [];
        let createtAt = new Date();
        let id = uuidv1();
        let values = [];
        let message = "Started export of Component req.";
        let res = req._.req.res;
        const litemp = JSON.stringify(req.data);
        liJobData = JSON.parse(litemp);
        values.push({ id, createtAt, message, liJobData });
        res.statusCode = 202;
        res.send({ values });


        // Get Planning area and Prefix configurations for IBP
        let liParaValue = await GenF.getIBPParameterValue();
        let lData = "Nav" + liParaValue[0].VALUE.toString();
        let lEntity = "/" + liParaValue[0].VALUE.toString() + "Trans";
        let oReq = {
            actcompreq: [],
        },
            vactcompreq, lMessage = '';
        // let vFromDate = '2022-12-01';
        // let vToDate = '2023-12-20';
        let liactcompreq, licriticalcomp;
        let lMethod = await GenF.getParameterValue(req.data.LOCATION_ID, 5);
        switch (await GenF.getParameterValue(req.data.LOCATION_ID, 5)) {
            case 'M1':
                liactcompreq = await cds.run(
                    `
                        SELECT DISTINCT "WEEK_DATE",
                                "LOCATION_ID",
                                "PRODUCT_ID",
                                "COMPONENT",
                                "COMP_QTY"
                                FROM V_ASSEMBLYREQ
                                WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                                   AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
                    `' AND MODEL_VERSION = 'Active'
                    AND WEEK_DATE >= '` + req.data.FROMDATE +
                    `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                                   AND COMP_QTY >= 0`);
                console.log(liactcompreq.length);
                break;
            case 'M2':
                liactcompreq = await cds.run(
                    `
                SELECT DISTINCT "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "COMPONENT",
                        "REF_PRODID",
                        "COMPCIR_QTY" AS "COMP_QTY"
                        FROM CP_ASSEMBLY_REQ
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND REF_PRODID = '`+ req.data.PRODUCT_ID +
                    `' AND MODEL_VERSION = 'Active'
            AND WEEK_DATE >= '` + req.data.FROMDATE +
                    `' AND WEEK_DATE <= '` + req.data.TODATE + `'
                           AND COMPCIR_QTY >= 0`);
                console.log(liactcompreq.length);

                licriticalcomp = await cds.run(
                    `
                SELECT  "LOCATION_ID",
                        "PRODUCT_ID",
                        "ITEM_NUM",
                        "COMPONENT",
                        "CRITICALKEY"
                    FROM CP_CRITICAL_COMP
                    WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                          AND PRODUCT_ID = '`+ req.data.PRODUCT_ID + `'                               
                          AND CRITICALKEY = '` + req.data.CRITICALKEY + `'`);
                console.log(licriticalcomp.length);
                break;
        }


        if (req.data.CRITICALKEY === "X" && lMethod === 'M2') {
            for (i = 0; i < liactcompreq.length; i++) {
                for (let j = 0; j < licriticalcomp.length; j++) {
                    if (liactcompreq[i].LOCATION_ID === licriticalcomp[j].LOCATION_ID &&
                        liactcompreq[i].REF_PRODID === licriticalcomp[j].PRODUCT_ID &&
                        //liactcompreq[i].ITEM_NUM === licriticalcomp[j].ITEM_NUM &&
                        liactcompreq[i].COMPONENT === licriticalcomp[j].COMPONENT) {

                        let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                        let vDemd = parseFloat(liactcompreq[i].COMP_QTY).toFixed(2);

                        vactcompreq = {
                            "LOCID": liactcompreq[i].LOCATION_ID,
                            "PRDID": liactcompreq[i].PRODUCT_ID,
                            "PRDFR": liactcompreq[i].COMPONENT,
                            "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                            "PERIODID0_TSTAMP": vWeekDate[0]
                        };
                        oReq.actcompreq.push(vactcompreq);
                    }
                }

            }
            // console.log(oReq.actcompreq.length);
            console.log(oReq.actcompreq);

        } else {
            for (i = 0; i < liactcompreq.length; i++) {
                let vWeekDate = new Date(liactcompreq[i].WEEK_DATE).toISOString().split('Z');
                let vDemd = parseFloat(liactcompreq[i].COMP_QTY).toFixed(2);
                vactcompreq = {
                    "LOCID": liactcompreq[i].LOCATION_ID,
                    "PRDID": liactcompreq[i].PRODUCT_ID,
                    "PRDFR": liactcompreq[i].COMPONENT,
                    "COMPONENTREQUIREMENTQTY": vDemd.toString(),
                    "PERIODID0_TSTAMP": vWeekDate[0]
                };
                oReq.actcompreq.push(vactcompreq);

            }
            console.log(oReq.actcompreq.length);
            console.log(oReq.actcompreq);
        }

        if (oReq.actcompreq.length > 0) {
            let vTransID = new Date().getTime().toString();
            let oEntry =
            {
                "Transactionid": vTransID,
                "AggregationLevelFieldsString": "LOCID,PRDID,PRDFR,COMPONENTREQUIREMENTQTY,PERIODID0_TSTAMP",
                "VersionID": "",
                "DoCommit": true,
                "ScenarioID": ""
            }
            oEntry[lData] = oReq.actcompreq;
            try {
                await service.tx(req).post(lEntity, oEntry);
                //let resUrl = "/getExportResult?P_TransactionID='" + vTransID + "'";
                let resUrl = "/getExportResult?P_EntityName='" + liParaValue[0].VALUE + "'&P_TransactionID='" + vTransID + "'";
                await service.tx(req).get(resUrl);
                flag = 'X';
            }
            catch {

            }
            if (flag === 'X') {
                lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity is successful for product:' + req.data.PRODUCT_ID;
            } else {
                lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity failed for product:' + req.data.PRODUCT_ID;
            }
        }
        else {
            lMessage = lMessage + ' ' + 'Export of Assembly requirement Quantity failed as no critical Assemblies exists for product:' + req.data.PRODUCT_ID;
        }
        await GenF.jobSchMessage('X', lMessage, req);
        // return lMessage;
    }

    // Publish Forecast orders
    async postCIRQuantitiesToS4(req) {
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
                if (sLoginUserId) {
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
    }
    
}

module.exports = preDefHistory;
module.exports = preDefFuture;
