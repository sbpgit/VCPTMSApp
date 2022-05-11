const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');
const mlrFuncs = require('./mlr.js');

const conn_params = {
    serverNode  : process.env.classicalSchemaNodePort, //cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    uid         : process.env.uidClassicalSchema, //cf environment variable "SBPTECHTEAM",//
    pwd         : process.env.uidClassicalSchemaPassword,//cf environment variable"Sbpcorp@22",//
    encrypt: 'TRUE'
    // ssltruststore: cds.env.requires.hana.credentials.certificate
};
const vcConfigTimePeriod = process.env.TimePeriod; //cf environment variable"PeriodOfYear";//
const classicalSchema = process.env.classicalSchema; //cf environment variable"DB_CONFIG_PROD_CLIENT1";//

// const conn_params = {
//     serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
//     uid         : "SBPTECHTEAM",//
//     pwd         : "Sbpcorp@22",//
//     encrypt: 'TRUE'
//     // ssltruststore: cds.env.requires.hana.credentials.certificate
// };
// const vcConfigTimePeriod = "PeriodOfYear"; //process.env.TimePeriod; //cf environment variable"PeriodOfYear";//
// const classicalSchema = "DB_CONFIG_PROD_CLIENT1" ;//process.env.classicalSchema; //cf environment variable"DB_CONFIG_PROD_CLIENT1";//

exports._runMlrRegressions = async function(req) {
  

   //const regressionParameters = req.data.regressionParameters;
   //console.log('predictionParameters: ', regressionParameters); 
   
   mlrFuncs._updateMlrGroupParams (req);
    
   //const regressionData = req.data.regressionData;
   //console.log('predictionData: ', regressionData); 
  
   mlrFuncs._updateMlrGroupData(req);

   await mlrFuncs._runRegressionMlrGroup(req); 
  
}


exports._updateMlrGroupParams = function(req) {
    const mlrGroupParams = req.data.regressionParameters;

    console.log('_updateMlrGroupParams: ', mlrGroupParams);         


    var conn = hana.createConnection();

    conn.connect(conn_params);
/*
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
*/
// ---------- BEGIN OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS
    let inGroups = [];
    let modelGroup = mlrGroupParams[0].groupId;
    inGroups.push(modelGroup);
    for (var i in mlrGroupParams)
    { 
        if (i > 0)
        {
            if( mlrGroupParams[i].groupId != mlrGroupParams[i-1].groupId)
            {
                //inGroups.push(mlrGroupParams[i].GROUP_ID);
                inGroups.push(mlrGroupParams[i].groupId);

                //console.log('i :', i, 'groupId: ', mlrGroupParams[i].groupId, 'GROUP_ID: ', mlrGroupParams[i].GROUP_ID, );            


            }
        }
    }

    sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = 'DELETE FROM "PAL_MLR_PARAMETER_GRP_TAB" ' + 'WHERE GROUP_ID = ' + "'" + inGroups[i] + "'" ;
        console.log('_updateMlrGroupParams sqlStr ', sqlStr);
        stmt=conn.prepare(sqlStr);
        //result=stmt.exec();
        stmt.exec();
        stmt.drop();

    }
// ---------- END OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS

    var tableObj = [];	
        
    for (let i = 0; i < mlrGroupParams.length; i++)
    {
        let groupId = mlrGroupParams[i].groupId ;
        let paramName = mlrGroupParams[i].paramName;
        let intVal =  mlrGroupParams[i].intVal
        let doubleVal = mlrGroupParams[i].doubleVal;
        let strVal = mlrGroupParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
        
    }
    //console.log(' tableObj ', tableObj);

    sqlStr = 'INSERT INTO "PAL_MLR_PARAMETER_GRP_TAB"' + '(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)';
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}

exports._updateMlrGroupData  = function(req) {
    const mlrGroupData = req.data.regressionData;
    var modelVersion = req.data.modelVersion;

    //console.log('_updateMlrGroupData: ', mlrGroupData);         

    var mlrType = req.data.mlrType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (mlrType == 1)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_1T"';
    else if (mlrType == 2)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_2T"';
    else if (mlrType == 3)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_3T"';
    else if (mlrType == 4)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_4T"';
    else if (mlrType == 5)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_5T"';
    else if (mlrType == 6)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_6T"';
    else if (mlrType == 7)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_7T"';
    else if (mlrType == 8)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_8T"';
    else if (mlrType == 9)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_9T"';
    else if (mlrType == 10)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_10T"';
    else if (mlrType == 11)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_11T"';
    else if (mlrType == 12)
        sqlStr = 'DELETE FROM "PAL_MLR_DATA_GRP_TAB_12T"';
    else
    {
        var res = req._.req.res;
        res.send({"Invalid MlrType":mlrType});
        return;
    }

    stmt=conn.prepare(sqlStr);
    // let results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	
    
    let V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, ID, groupId;
    for (var i = 0; i < mlrGroupData.length; i++)
    {
        groupId = mlrGroupData[i].groupId ;
        ID = mlrGroupData[i].ID;
        //console.log('_updateMlrGroupData ', ID);

        V1 = mlrGroupData[i].att1;
        if (mlrType > 1)
            V2 =  mlrGroupData[i].att2;
        if (mlrType > 2)
            V3 = mlrGroupData[i].att3;
        if (mlrType > 3)
            V4 = mlrGroupData[i].att4;
        if (mlrType > 4)
            V5 = mlrGroupData[i].att5;
        if (mlrType > 5)
            V6 = mlrGroupData[i].att6;
        if (mlrType > 6)
            V7 = mlrGroupData[i].att7;
        if (mlrType > 7)
            V8 = mlrGroupData[i].att8;
        if (mlrType > 8)
            V9 = mlrGroupData[i].att9;
        if (mlrType > 9)
            V10 = mlrGroupData[i].att10;
        if (mlrType > 10)
            V11 = mlrGroupData[i].att11;
        if (mlrType > 11)
            V12 = mlrGroupData[i].att12;
        let Y = mlrGroupData[i].target;

        var rowObj = [];
        if (mlrType == 1)
            rowObj.push(groupId,ID,Y,V1);
        else if (mlrType == 2)
            rowObj.push(groupId,ID,Y,V1,V2);
        else if (mlrType == 3)
            rowObj.push(groupId,ID,Y,V1,V2,V3);
        else if (mlrType == 4)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4);
        else if (mlrType == 5)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5);
        else if (mlrType == 6)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6);
        else if (mlrType == 7)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6,V7);
        else if (mlrType == 8)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6,V7,V8);
        else if (mlrType == 9)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6,V7,V8,V9);
        else if (mlrType == 10)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6,V7,V8,V9,V10);
        else if (mlrType == 11)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11);
        else if (mlrType == 12)
            rowObj.push(groupId,ID, Y, V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (mlrType == 1)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_1T"' + '(GROUP_ID,ID,Y,V1) VALUES(?, ?, ?, ?)';
        stmt = conn.prepare(sqlStr);   
    }
    else if (mlrType == 2)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_2T"' + '(GROUP_ID,ID,Y,V1,V2) VALUES(?, ?, ?, ?, ?)';
        stmt = conn.prepare(sqlStr);   
    }
    else if (mlrType == 3)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_3T"' + '(GROUP_ID,ID,Y,V1,V2,V3) VALUES(?, ?, ?, ?, ?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 4)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_4T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4) VALUES(?, ?, ?, ?, ?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 5)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_5T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5) VALUES(?, ?, ?, ?, ?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 6)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_6T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6) VALUES(?, ?, ?, ?, ?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 7)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_7T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6,V7) VALUES(?, ?, ?, ?, ?,?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 8)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_8T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6,V7,V8) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 9)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_9T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6,V7,V8,V9) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 10)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_10T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 11)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_11T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrType == 12)
    {
        sqlStr = 'INSERT INTO "PAL_MLR_DATA_GRP_TAB_12T"' + '(GROUP_ID,ID,Y,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)';
        stmt = conn.prepare(sqlStr);
    }

    //console.log(' _updateMlrGroupData sqlStr ', sqlStr);

    //result=stmt.execBatch(tableObj);
    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateMlrGroupData Completed ');

}


exports._runRegressionMlrGroup = async function(req) {

    //console.log('Executing Multi Linear Regression at GROUP');
    var mlrType = req.data.mlrType;
    var mlrModelVersion = req.data.modelVersion;
    console.log('Executing MLR Regression at GROUP REQ MLR Model Version', mlrModelVersion);


    var mlrDataTable;
    if (mlrType == 1)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_1T";
    else if (mlrType == 2)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_2T";
    else if (mlrType == 3)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_3T";
    else if (mlrType == 4)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_4T";
    else if (mlrType == 5)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_5T";
    else if (mlrType == 6)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_6T";
    else if (mlrType == 7)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_7T";
    else if (mlrType == 8)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_8T";
    else if (mlrType == 9)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_9T";
    else if (mlrType == 10)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_10T";
    else if (mlrType == 11)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_11T";
    else if (mlrType == 12)
        mlrDataTable = "PAL_MLR_DATA_GRP_TAB_12T";

    //var util = require('util');
    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
///////////////////////////////////
    const mlrGroupParams = req.data.regressionParameters;

    let inGroups = [];
    let modelGroup = mlrGroupParams[0].groupId;
    inGroups.push(modelGroup);
    for (var i in mlrGroupParams)
    { 
        if (i > 0)
        {
            if( mlrGroupParams[i].groupId != mlrGroupParams[i-1].groupId)
            {
                //inGroups.push(mlrGroupParams[i].GROUP_ID);
                inGroups.push(mlrGroupParams[i].groupId);

                //console.log('i :', i, 'groupId: ', mlrGroupParams[i].groupId, 'GROUP_ID: ', mlrGroupParams[i].GROUP_ID, );            


            }
        }
    }

    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = 'DELETE FROM "PAL_MLR_COEFFICIENT_GRP_TAB" ' + 'WHERE GROUP_ID = ' + "'" + inGroups[i] + "'" ;
        //sqlStr ='DELETE FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM PAL_MLR_DATA_GRP_TAB_3T)';
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  'DELETE FROM "PAL_MLR_PMML_GRP_TAB" ' + 'WHERE GROUP_ID = ' + "'" + inGroups[i] + "'" ;
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  'DELETE FROM "PAL_MLR_FITTED_GRP_TAB" ' + 'WHERE GROUP_ID = ' + "'" + inGroups[i] + "'" ;
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  'DELETE FROM "PAL_MLR_STATISTICS_GRP_TAB" ' + 'WHERE GROUP_ID = ' + "'" + inGroups[i] + "'" ;
    //    console.log('_runRegressionMlrGroup sqlStr', sqlStr);
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  'DELETE FROM "PAL_MLR_OPTIMAL_PARAM_GRP_TAB" ' + 'WHERE GROUP_ID = ' + "'" + inGroups[i] + "'" ;
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

    }



///////////////////////////////////
    //var groupId = group;
//     sqlStr = 'DELETE FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
//     //sqlStr ='DELETE FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM PAL_MLR_DATA_GRP_TAB_3T)';
//     stmt=conn.prepare(sqlStr);
//     stmt.exec();
//     stmt.drop();

//     sqlStr =  'DELETE FROM "PAL_MLR_PMML_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
//     stmt=conn.prepare(sqlStr);
//     stmt.exec();
//     stmt.drop();

//     sqlStr =  'DELETE FROM "PAL_MLR_FITTED_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
//     stmt=conn.prepare(sqlStr);
//     stmt.exec();
//     stmt.drop();

//     sqlStr =  'DELETE FROM "PAL_MLR_STATISTICS_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
// //    console.log('_runRegressionMlrGroup sqlStr', sqlStr);
//     stmt=conn.prepare(sqlStr);
//     stmt.exec();
//     stmt.drop();

//     sqlStr =  'DELETE FROM "PAL_MLR_OPTIMAL_PARAM_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
//     stmt=conn.prepare(sqlStr);
//     stmt.exec();
//     stmt.drop();

    if (mlrType == 1)
        sqlStr = 'call "MLR_MAIN_1T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 2)
        sqlStr = 'call "MLR_MAIN_2T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 3)
        sqlStr = 'call "MLR_MAIN_3T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 4)
        sqlStr = 'call "MLR_MAIN_4T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 5)
        sqlStr = 'call "MLR_MAIN_5T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 6)
        sqlStr = 'call "MLR_MAIN_6T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 7)
        sqlStr = 'call "MLR_MAIN_7T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 8)
        sqlStr = 'call "MLR_MAIN_8T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 9)
        sqlStr = 'call "MLR_MAIN_9T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 10)
        sqlStr = 'call "MLR_MAIN_10T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 11)
        sqlStr = 'call "MLR_MAIN_11T"(' + mlrDataTable + ', ?,?,?,?,?)';
    else if (mlrType == 12)
        sqlStr = 'call "MLR_MAIN_12T"(' + mlrDataTable + ', ?,?,?,?,?)';
//    console.log('_runRegressionMlrGroup sqlStr',sqlStr);

    stmt=conn.prepare(sqlStr);
    var coefficientResults=stmt.exec();
    stmt.drop();
    

    //console.log('Coefficient Table Results Length:', coefficientResults.length);
            //console.log('Model Table Results: ', modelResults);
    
    var coefficientsObj = [];

    for (var i=0; i< coefficientResults.length; i++)
    {     
        let groupId = coefficientResults[i].GROUP_ID;
        let variableName = coefficientResults[i].VARIABLE_NAME;
        let coefficientValue = coefficientResults[i].COEFFICIENT_VALUE;
        let tValue = coefficientResults[i].T_VALUE;
        let pValue = coefficientResults[i].P_VALUE;

        coefficientsObj.push({groupId,variableName,coefficientValue,tValue,pValue});
    }
    

    var pmmlObj = [];

    sqlStr =  'SELECT * FROM "PAL_MLR_PMML_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    let pmmlResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< pmmlResults.length; i++)
    {     
        let groupId = pmmlResults[i].GROUP_ID;
        let rowIndex = pmmlResults[i].ROW_INDEX;
        let modelContent = pmmlResults[i].MODEL_CONTENT;
        pmmlObj.push({groupId,rowIndex,modelContent});
    }

    var fittedObj = [];

    sqlStr =  'SELECT * FROM "PAL_MLR_FITTED_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    let fittedResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< fittedResults.length; i++)
    {     
        let groupId = fittedResults[i].GROUP_ID;
        let ID = fittedResults[i].ID;
        let value = fittedResults[i].VALUE;
        fittedObj.push({groupId,ID,value});
    }


    var statisticsObj = [];

    sqlStr =  'SELECT * FROM "PAL_MLR_STATISTICS_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    let statResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< statResults.length; i++)
    {     
        let groupId = statResults[i].GROUP_ID;
        let statName = statResults[i].STAT_NAME;
        let statValue = statResults[i].STAT_VALUE;
        statisticsObj.push({groupId,statName,statValue});
    }

    var paramSelectionObj = [];

    sqlStr =  'SELECT * FROM "PAL_MLR_OPTIMAL_PARAM_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    let paramSelectionResults = stmt.exec();
    stmt.drop();


    for (let i=0; i< paramSelectionResults.length; i++)
    {     
        let groupId = paramSelectionResults[i].GROUP_ID;
        let paramName = paramSelectionResults[i].PARAM_NAME;
        let intVal = paramSelectionResults[i].INT_VALUE;
        let doubleVal = paramSelectionResults[i].DOUBLE_VALUE;
        let strVal = paramSelectionResults[i].STRING_VALUE;

        
        paramSelectionObj.push({groupId,paramName,intVal,doubleVal,strVal});
    }


    var createtAtObj = new Date();
    let idObj = uuidv1();
    //let uuidObj = uuidv1();

// commenting out from Memory usage Perspective
 
    // var cqnQuery = {INSERT:{ into: { ref: ['CP_PALMLRREGRESSIONS'] }, entries: [
    //     //  {   ID: idObj, createdAt : createtAtObj, 
    //     {   mlrID: idObj, createdAt : createtAtObj.toISOString(),
    //         Location : req.data.Location,
    //         Product : req.data.Product, 
    //         regressionParameters:req.data.regressionParameters, 
    //         mlrType : req.data.mlrType,
    //         regressionData : req.data.regressionData, 
    //         coefficientOp : coefficientsObj,
    //         pmmlOp : pmmlObj,
    //         fittedOp : fittedObj,
    //         statisticsOp : statisticsObj,
    //         optimalParamOp : paramSelectionObj}
    //     ]}}

    // cds.run(cqnQuery);
//    console.log("PalMlrRegressions",cqnQuery);


    
    //console.log('Regression  coefficientsObj', coefficientsObj);

    let returnObj = [];	
    let createdAt = createtAtObj;
 
    let mlrID = idObj; //uuidObj;
 
    regressionParameters = req.data.regressionParameters;
 
    mlrType = req.data.mlrType;
 
    let regressionData = req.data.regressionData;
 
    let coefficientOp = coefficientsObj;
    let pmmlOp = pmmlObj;
    let fittedOp = fittedObj;
    let statisticsOp = statisticsObj;
 
    let optimalParamOp = paramSelectionObj;

    returnObj.push({mlrID, createdAt,regressionParameters,mlrType,regressionData,coefficientOp, pmmlOp,fittedOp,statisticsOp,optimalParamOp});

/////
    inGroups = [];
    modelGroup = regressionParameters[0].groupId;
    inGroups.push(modelGroup);
    for (let i in regressionParameters)
    { 
        if (i > 0)
        {
            if( regressionParameters[i].groupId != regressionParameters[i-1].groupId)
            {
                inGroups.push(regressionParameters[i].groupId);
            }
        }
    }

    //let mlrGroupParams = req.data.regressionParameters;
//    console.log("inGroups ", inGroups, "Number of Groups",inGroups.length);

    // var conn_container = hana.createConnection();
 
    // conn_container.connect(conn_params_container);

    // sqlStr = 'SET SCHEMA ' + containerSchema; 
    // // console.log('sqlStr: ', sqlStr);            
    // stmt=conn_container.prepare(sqlStr);
    // result=stmt.exec();
    // stmt.drop();

    var tableObj = [];	

    for (let grpIndex = 0; grpIndex < inGroups.length; grpIndex++)
    {
        let statsGroupObj = [];
        let coeffsGroupObj = [];
        let paramsGroupObj = [];
        let fittedGroupObj = [];	
        let paramSelectionGroupObj = [];
//        console.log("GROUP_ID ", inGroups[grpIndex]);

        
        for (let i = 0; i < regressionParameters.length; i++)
        {
            if (inGroups[grpIndex] == regressionParameters[i].groupId)
            {            
                let paramName = regressionParameters[i].paramName;
                let intVal =  regressionParameters[i].intVal
                let doubleVal = regressionParameters[i].doubleVal;
                let strVal = regressionParameters[i].strVal;
                paramsGroupObj.push({paramName,intVal,doubleVal,strVal});
            }
        }
        for (let i=0; i< fittedResults.length; i++)
        {     
            if (inGroups[grpIndex] == fittedResults[i].GROUP_ID)
            {
                let ID = fittedResults[i].ID;
                let value = fittedResults[i].VALUE;
                fittedGroupObj.push({ID,value});
            }
        }
        for (let i=0; i< statResults.length; i++)
        {     
            if (inGroups[grpIndex] == statResults[i].GROUP_ID)
            {
                let statName = statResults[i].STAT_NAME;
                let statValue = statResults[i].STAT_VALUE;
                statsGroupObj.push({statName,statValue});
            }
        }
        for (let i=0; i< paramSelectionResults.length; i++)
        {     
            if (inGroups[grpIndex] == paramSelectionResults[i].GROUP_ID)
            {
                let paramName = paramSelectionResults[i].PARAM_NAME;
                let intVal = paramSelectionResults[i].INT_VALUE;
                let doubleVal = paramSelectionResults[i].DOUBLE_VALUE;
                let strVal = paramSelectionResults[i].STRING_VALUE;
                paramSelectionGroupObj.push({paramName,intVal,doubleVal,strVal});
            }            
        }
        for (let i=0; i< coefficientResults.length; i++)
        {     
            if (inGroups[grpIndex] == coefficientResults[i].GROUP_ID)
            {
                let variableName = coefficientResults[i].VARIABLE_NAME;
                let coefficientValue = coefficientResults[i].COEFFICIENT_VALUE;
                let tValue = coefficientResults[i].T_VALUE;
                let pValue = coefficientResults[i].P_VALUE;
                coeffsGroupObj.push({variableName,coefficientValue,tValue,pValue});
            }
        }
 /*       
        let cqnQuery = {INSERT:{ into: { ref: ['PalMlrByGroup'] }, entries: [
        {   mlrGroupID: idObj, createdAt : createtAtObj, groupId : inGroups[grpIndex],
            regressionParameters:paramsGroupObj, 
            mlrType : req.data.mlrType,
            coefficientOp : coeffsGroupObj,
            fittedOp : fittedGroupObj,
            statisticsOp : statsGroupObj,
            optimalParamOp : paramSelectionGroupObj}
        ]}}

        cds.run(cqnQuery);
*/   
        let grpStr=inGroups[grpIndex].split('#');
        let profileID = grpStr[0]; 
        let type = grpStr[1];
        let GroupId = grpStr[2];
        let location = grpStr[3];
        let product = grpStr[4];

        console.log("_runRegressionMLRGroup  grpStr ", grpStr, "profileID ",profileID, "type ", type, "GroupId ",GroupId, " location ", location, " product ", product);

        var rowObj = {   mlrGroupID: idObj, 
            createdAt : createtAtObj.toISOString(), 
            Location : location,
            Product : product,
            groupId : GroupId,
            Type : type,
            modelVersion : mlrModelVersion,
            profile : profileID,
            regressionParameters:paramsGroupObj, 
            mlrType : req.data.mlrType,
            coefficientOp : coeffsGroupObj,
            fittedOp : fittedGroupObj,
            statisticsOp : statsGroupObj,
            optimalParamOp : paramSelectionGroupObj};
        tableObj.push(rowObj);
        
        // let objStr=GroupId.split('_');
        // let obj_dep = objStr[0];
        // let obj_counter = objStr[1];
        let objStr = GroupId;

        let lastIndex = objStr.lastIndexOf('_');
        let obj_dep = objStr.slice(0, lastIndex);
        // console.log(obj_dep);

        let obj_counter = objStr.slice(lastIndex + 1);
        // console.log(obj_counter); 

        sqlStr = 'UPSERT "CP_OD_MODEL_VERSIONS" VALUES (' +
                    "'" + location + "'" + "," +
                    "'" + product + "'" + "," +
                    "'" + obj_dep + "'" + "," +
                    "'" + obj_counter + "'" + "," +
                    "'" + type + "'" + "," +
                    "'" + 'MLR' + "'" + "," +
                    "'" + mlrModelVersion + "'" + "," +
                    "'" + profileID  + "'" + ')' + ' WITH PRIMARY KEY';
            
        console.log("CP_OD_MODEL_VERSIONS MLR sql update sqlStr", sqlStr);

        // stmt=conn_container.prepare(sqlStr);
        // stmt.exec();
        // stmt.drop();
        await cds.run(sqlStr);
    }
    // conn_container.disconnect();


    cqnQuery = {INSERT:{ into: { ref: ['CP_PALMLRBYGROUP'] }, entries:  tableObj }};
//    console.log("_runRegressionMlrGroup cqnQuery",cqnQuery);

    cds.run(cqnQuery);
/////


    var res = req._.req.res;
    
    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'application/json');

    console.log('headersSent Before Send:', res.headersSent); // false
    //res.send('OK');
    //console.log(res.headersSent); // true
    //res.json({"value":returnObj});
    
    res.send({"value":returnObj});
    console.log('headersSent After Send:', res.headersSent); // false

    console.log('Completed MLR Regression Models Generation for Groups Successfully');

    conn.disconnect(function(err) {
    if (err) throw err;
    console.log('disconnected');
    });
  
}


exports._runMlrPredictions = async function(req) {
  

   //const predictionParameters = req.data.predictionParameters;
   //console.log('predictionParameters: ', predictionParameters); 
   //var groupId = req.data.groupId;
   var groupId = req.data.profile + '#' + req.data.Type + '#' +  req.data.groupId + '#' + req.data.Location + '#' + req.data.Product;

   var conn = hana.createConnection();

   conn.connect(conn_params);

   var sqlStr = 'SET SCHEMA ' + classicalSchema;  
   // console.log('sqlStr: ', sqlStr);            
   var stmt=conn.prepare(sqlStr);
   var results=stmt.exec();
   stmt.drop();

   sqlStr = 'SELECT COUNT(DISTINCT "GROUP_ID") AS "ModelExists" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE "GROUP_ID" = ' + "'" + groupId + "'";
   stmt=conn.prepare(sqlStr);
   results = stmt.exec();
   stmt.drop();
   console.log('_runMlrPredictions - sqlStr : ', sqlStr);            

   var modelExists = results[0].ModelExists;
   console.log('_runMlrPredictions - modelExists: ', modelExists);            

   if (modelExists == 0)
   {
      let predResults = [];
      var responseMessage = " Model Does not Exist For groupId : " + groupId;
      predResults.push(responseMessage);
      console.log('_runMlrPredictions : Model Does not Exist For groupId', groupId); 
      let res = req._.req.res;
      res.statusCode = 400;
      res.send({"value":predResults});
      conn.disconnect(); 
      return;          
   }
   conn.disconnect(); 

   mlrFuncs._updateMlrPredictionParams (req);
    
   //const predictionData = req.data.predictionData;
   //console.log('predictionData: ', predictionData); 
  
   mlrFuncs._updateMlrPredictionData(req);

   await mlrFuncs._runPredictionMlrGroup(req); 
  
}


exports._updateMlrPredictionParams = function(req) {

    const mlrPredictParams = req.data.predictionParameters;
    //console.log('mlrPredictParams: ', mlrPredictParams);         
  
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr = 'DELETE FROM "PAL_MLR_PREDICT_PARAMETER_GRP_TAB"';

    stmt=conn.prepare(sqlStr);
    //results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);

    var tableObj = [];	
        
    for (var i = 0; i < mlrPredictParams.length; i++)
    {
        let groupId = mlrPredictParams[i].groupId ;
        let paramName = mlrPredictParams[i].paramName;
        let intVal =  mlrPredictParams[i].intVal
        let doubleVal = mlrPredictParams[i].doubleVal;
        let strVal = mlrPredictParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);


    sqlStr = 'INSERT INTO "PAL_MLR_PREDICT_PARAMETER_GRP_TAB"(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)';
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();

}

exports._updateMlrPredictionData = function(req) {
    //console.log('_updateMlrGroupData req: ', req.data);         

    const mlrPredictData = req.data.predictionData;
    //console.log('_updateMlrGroupData: ', mlrGroupData);         

    var mlrpType = req.data.mlrpType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (mlrpType == 1)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_1T"';
    else if (mlrpType == 2)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_2T"';
    else if (mlrpType == 3)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_3T"';
    else if (mlrpType == 4)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_4T"';
    else if (mlrpType == 5)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_5T"';
    else if (mlrpType == 6)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_6T"';
    else if (mlrpType == 7)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_7T"';
    else if (mlrpType == 8)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_8T"';
    else if (mlrpType == 9)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_9T"';
    else if (mlrpType == 10)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_10T"';
    else if (mlrpType == 11)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_11T"';
    else if (mlrpType == 12)
        sqlStr = 'DELETE FROM "PAL_MLR_PRED_DATA_GRP_TAB_12T"';
    else
    {
        var res = req._.req.res;
        res.send({"Invalid MlrpType":mlrpType});
        return;
    }

    stmt=conn.prepare(sqlStr);
//    results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	
    
    let V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, ID, groupId;
    for (var i = 0; i < mlrPredictData.length; i++)
    {
        groupId = mlrPredictData[i].groupId ;
        ID = mlrPredictData[i].ID;
        //console.log('_updateMlrGroupData groupId', groupId);

        V1 = mlrPredictData[i].att1;
        if (mlrpType > 1)
            V2 =  mlrPredictData[i].att2;
        if (mlrpType > 2)
            V3 = mlrPredictData[i].att3;
        if (mlrpType > 3)
            V4 = mlrPredictData[i].att4;
        if (mlrpType > 4)
            V5 = mlrPredictData[i].att5;
        if (mlrpType > 5)
            V6 = mlrPredictData[i].att6;
        if (mlrpType > 6)
            V7 = mlrPredictData[i].att7;
        if (mlrpType > 7)
            V8 = mlrPredictData[i].att8;
        if (mlrpType > 8)
            V9 = mlrPredictData[i].att9;
        if (mlrpType > 9)
            V10 = mlrPredictData[i].att10;
        if (mlrpType > 10)
            V11 = mlrPredictData[i].att11;
        if (mlrpType > 11)
            V12 = mlrPredictData[i].att12;
        var rowObj = [];
        if (mlrpType == 1)
            rowObj.push(groupId,ID,V1);
        else if (mlrpType == 2)
            rowObj.push(groupId,ID,V1,V2);
        else if (mlrpType == 3)
            rowObj.push(groupId,ID,V1,V2,V3);
        else if (mlrpType == 4)
            rowObj.push(groupId,ID,V1,V2,V3,V4);
        else if (mlrpType == 5)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5);
        else if (mlrpType == 6)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6);
        else if (mlrpType == 7)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6,V7);
        else if (mlrpType == 8)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6,V7,V8);
        else if (mlrpType == 9)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9);
        else if (mlrpType == 10)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10);
        else if (mlrpType == 11)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11);
        else if (mlrpType == 12)
            rowObj.push(groupId,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (mlrpType == 1)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_1T(GROUP_ID,ID,V1) VALUES(?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (mlrpType == 2)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_2T(GROUP_ID,ID,V1,V2) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (mlrpType == 3)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_3T(GROUP_ID,ID,V1,V2,V3) VALUES(?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 4)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_4T(GROUP_ID,ID,V1,V2,V3,V4) VALUES(?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 5)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_5T(GROUP_ID,ID,V1,V2,V3,V4,V5) VALUES(?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 6)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_6T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6) VALUES(?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 7)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_7T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6,V7) VALUES(?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 8)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_8T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6,V7,V8) VALUES(?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 9)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_9T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 10)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_10T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 11)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_11T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (mlrpType == 12)
    {
        sqlStr = "INSERT INTO PAL_MLR_PRED_DATA_GRP_TAB_12T(GROUP_ID,ID,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateMlrPredictionData sqlStr ', sqlStr);

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateMlrPredictionData Completed ');
}

exports._runPredictionMlrGroup = async function(req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var mlrpType = req.data.mlrpType;
    var version = req.data.Version;
    var scenario = req.data.Scenario;
    var modelVersion = req.data.modelVersion;


    if (mlrpType == 1)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_1T"';
    else if (mlrpType == 2)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_2T"';
    else if (mlrpType == 3)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_3T"';
    else if (mlrpType == 4)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_4T"';
    else if (mlrpType == 5)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_5T"';
    else if (mlrpType == 6)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_6T"';
    else if (mlrpType == 7)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_7T"';
    else if (mlrpType == 8)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_8T"';
    else if (mlrpType == 9)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_9T"';
    else if (mlrpType == 10)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_10T"';
    else if (mlrpType == 11)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_11T"';
    else if (mlrpType == 12)
        sqlStr = 'SELECT DISTINCT GROUP_ID from  "PAL_MLR_PRED_DATA_GRP_TAB_12T"';
    else
    {
        var res = req._.req.res;
        res.send({"Invalid MlrpType":mlrpType});
        return;
    }

    stmt=conn.prepare(sqlStr);
    results=stmt.exec();
    stmt.drop();
    console.log(results);

    var distinctGroups = results.length;
    console.log('distinctGroups Count: ', distinctGroups);
    
    var predResults = [];			
    for (var index=0; index<distinctGroups; index++)
    {     
        //var groupId = ruleIds[index];
        var groupId = results[index].GROUP_ID;

        console.log('PredictionMlr Group: ', groupId);
        //predictionResults = predictionResults + _runHgbtPrediction(groupId);
        let predictionObj = await mlrFuncs._runMlrPrediction(mlrpType, groupId, version, scenario,modelVersion);
        //value.push({predictionObj});
        predResults.push(predictionObj);

        if (index == (distinctGroups -1))
        {
            //console.log('Prediction Results', predResults);
            let res = req._.req.res;
            res.send({"value":predResults});
            conn.disconnect();
        }
    }
}


exports._runMlrPrediction = async function (mlrpType, group, version, scenario, modelVersion) {

    console.log('_runMlrPrediction - group', group, 'Version ', version, 'Scenario ', scenario,'Model Version', modelVersion);

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var result=stmt.exec();
    stmt.drop();

    var groupId = group;
    let grpStr=groupId.split('#');
    let profileId = grpStr[0];
    let odType = grpStr[1];
    let GroupId = grpStr[2];
    let location = grpStr[3];
    let product = grpStr[4];

    sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId + '" ' + 
                    "(\"Coefficient\" varchar(50),\"CoefficientValue\" DOUBLE)"; 

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);

    var predDataObj = [];	
    if (mlrpType == 1)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' +  
                        "(\"ID\" integer,\"V1\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1" FROM "PAL_MLR_PRED_DATA_GRP_TAB_1T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_1T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "V1" FROM "PAL_MLR_PRED_DATA_GRP_TAB_1T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_1T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        var predData = result;
        //console.log('predData :', predData);

        for (var i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            predDataObj.push({GroupId,id,att1});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    
    }
    else if (mlrpType == 2)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' +  
                        "(\"ID\" integer,\"V1\" double,\"V2\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2" FROM "PAL_MLR_PRED_DATA_GRP_TAB_2T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_2T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "V1", "V2" FROM "PAL_MLR_PRED_DATA_GRP_TAB_2T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_2T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        var predData = result;
        //console.log('predData :', predData);

        for (var i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            predDataObj.push({GroupId,id,att1,att2});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    
    }
    else if(mlrpType == 3)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3" FROM "PAL_MLR_PRED_DATA_GRP_TAB_3T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_3T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "V1", "V2", "V3" FROM "PAL_MLR_PRED_DATA_GRP_TAB_3T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_3T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData =stmt.exec();
        stmt.drop();
        //var predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            predDataObj.push({GroupId,id,att1,att2,att3});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 4)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4" FROM "PAL_MLR_PRED_DATA_GRP_TAB_4T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_4T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4" FROM "PAL_MLR_PRED_DATA_GRP_TAB_4T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_4T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            predDataObj.push({GroupId,id,att1,att2,att3,att4});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID = ' 
                    + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4'" + ')';
        
//        console.log('_runMlrPrediction - Coefficients sqlStr', sqlStr)
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 5)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5" FROM "PAL_MLR_PRED_DATA_GRP_TAB_5T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_5T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5" FROM "PAL_MLR_PRED_DATA_GRP_TAB_5T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_5T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5'" + ')';
//        console.log('_runMlrPrediction - Coefficients sqlStr', sqlStr)

        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 6)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6" FROM PAL_MLR_PRED_DATA_GRP_TAB_6T WHERE PAL_MLR_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6" FROM PAL_MLR_PRED_DATA_GRP_TAB_6T WHERE PAL_MLR_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6'" + ')';
//        console.log('_runMlrPrediction - Coefficients sqlStr', sqlStr)

        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 7)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double,\"V7\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' +' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7" FROM "PAL_MLR_PRED_DATA_GRP_TAB_7T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_7T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7" FROM "PAL_MLR_PRED_DATA_GRP_TAB_7T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_7T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;
            let att7 =  predData[i].V7;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' +' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6','V7'" + ')';
//        console.log('_runMlrPrediction - Coefficients sqlStr', sqlStr)

        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 8)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double,\"V7\" double,\"V8\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"'  + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8" FROM "PAL_MLR_PRED_DATA_GRP_TAB_8T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_8T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8" FROM "PAL_MLR_PRED_DATA_GRP_TAB_8T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_8T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;
            let att7 =  predData[i].V7;
            let att8 =  predData[i].V8;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6','V7','V8'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 9)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' +
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double,\"V7\" double,\"V8\" double,\"V9\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9" FROM PAL_MLR_PRED_DATA_GRP_TAB_9T WHERE PAL_MLR_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9" FROM PAL_MLR_PRED_DATA_GRP_TAB_9T WHERE PAL_MLR_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;
            let att7 =  predData[i].V7;
            let att8 =  predData[i].V8;
            let att9 =  predData[i].V9;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6','V7','V8','V9'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 10)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double,\"V7\" double,\"V8\" double,\"V9\" double,\"V10\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10" FROM "PAL_MLR_PRED_DATA_GRP_TAB_10T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_10T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10" FROM "PAL_MLR_PRED_DATA_GRP_TAB_10T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_10T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;
            let att7 =  predData[i].V7;
            let att8 =  predData[i].V8;
            let att9 =  predData[i].V9;
            let att10 =  predData[i].V10;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 11)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double,\"V7\" double,\"V8\" double,\"V9\" double,\"V10\" double,\"V11\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11" FROM "PAL_MLR_PRED_DATA_GRP_TAB_11T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_11T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11" FROM "PAL_MLR_PRED_DATA_GRP_TAB_11T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_11T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;
            let att7 =  predData[i].V7;
            let att8 =  predData[i].V8;
            let att9 =  predData[i].V9;
            let att10 =  predData[i].V10;
            let att11 =  predData[i].V11;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else if(mlrpType == 12)
    {
        sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '" ' + 
                        "(\"ID\" integer,\"V1\" double,\"V2\" double,\"V3\" double,\"V4\" double, \"V5\" double,\"V6\" double,\"V7\" double,\"V8\" double,\"V9\" double,\"V10\" double,\"V11\" double,\"V12\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PREDICTDATA_TAB_' + groupId + '"' + ' SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12" FROM "PAL_MLR_PRED_DATA_GRP_TAB_12T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_12T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
        sqlStr = 'SELECT "ID", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12" FROM "PAL_MLR_PRED_DATA_GRP_TAB_12T" WHERE "PAL_MLR_PRED_DATA_GRP_TAB_12T".GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].V1;
            let att2 =  predData[i].V2;
            let att3 =  predData[i].V3;
            let att4 =  predData[i].V4;
            let att5 =  predData[i].V5;
            let att6 =  predData[i].V6;
            let att7 =  predData[i].V7;
            let att8 =  predData[i].V8;
            let att9 =  predData[i].V9;
            let att10 =  predData[i].V10;
            let att11 =  predData[i].V11;
            let att12 =  predData[i].V12;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12});
        }

        sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId  + '"' + ' SELECT "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID = ' 
                   + "'" + groupId + "'" + ' AND VARIABLE_NAME IN (' + "'__PAL_INTERCEPT__','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12'" + ')';
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
    }
    else
    {
        console.log('_runMlrPrediction Invalid mlrpType ', mlrpType);
        return;
    }
    
    //console.log(result);

    sqlStr = 'create local temporary column table "#PAL_FMLR_PARAMETER_TAB_' + groupId +  '" ' +
                        "(\"PARAM_NAME\" varchar(256),\"INT_VALUE\" integer,\"double_VALUE\" double,\"STRING_VALUE\" varchar(1000))";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '"#PAL_FMLR_PARAMETER_TAB_' + groupId +  '" ' + ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM "PAL_MLR_PREDICT_PARAMETER_GRP_TAB" WHERE "PAL_MLR_PREDICT_PARAMETER_GRP_TAB".GROUP_ID =' + "'" +  groupId + "'";

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();


    sqlStr = ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM "PAL_MLR_PREDICT_PARAMETER_GRP_TAB" WHERE "PAL_MLR_PREDICT_PARAMETER_GRP_TAB".GROUP_ID =' + "'" +  groupId + "'";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    var predParams = result;
    //console.log('predParams :', predParams);

    var predParamsObj = [];	
    for (let i=0; i<predParams.length; i++) 
    {
        //let groupId =  groupId;
        let paramName =  predParams[i].PARAM_NAME;
        let intVal =  predParams[i].INT_VALUE;
        let doubleVal =  predParams[i].DOUBLE_VALUE;
        let strVal =  predParams[i].STRING_VALUE;

        predParamsObj.push({GroupId,paramName,intVal,doubleVal,strVal});
    }


    sqlStr = "call _SYS_AFL.PAL_LINEAR_REGRESSION_PREDICT(" + "#PAL_FMLR_PREDICTDATA_TAB_" + groupId + "," + "#PAL_FMLR_COEFICIENT_TBL_" + groupId + "," + "#PAL_FMLR_PARAMETER_TAB_" + groupId + "," + "?)";

    stmt=conn.prepare(sqlStr);
    let predictionResults=stmt.exec();
    stmt.drop();
    //console.log('Prediction Results ', predictionResults);

    // --------------- BEGIN --------------------

    var fittedObj = [];	
    for (let i=0; i<predictionResults.length; i++) 
    {
        let id = predictionResults[i].ID;
        let value =  predictionResults[i].VALUE;
    
        fittedObj.push({GroupId,id,value});

    }	
 


    var createtAtObj = new Date();
    //let idObj = groupId;
    let idObj = uuidv1();
     // commenting out from Memory usage Perspective
   
    // var cqnQuery = {INSERT:{ into: { ref: ['CP_PALMLRPREDICTIONS'] }, entries: [
    //      {mlrpID: idObj, createdAt : createtAtObj.toISOString(), Location : location, 
    //       Product : product, groupId : GroupId, Type: odType, modelVersion: modelVersion, 
    //       profile: profileId, Version : version, Scenario : scenario,
    //       predictionParameters:predParamsObj, mlrpType : mlrpType, 
    //       predictionData : predDataObj, fittedResults : fittedObj}
    //      ]}}

    // cds.run(cqnQuery);

    conn.disconnect();

    // var conn = hana.createConnection();
 
    // conn.connect(conn_params_container);

    // sqlStr = 'SET SCHEMA ' + containerSchema; 
    // // console.log('sqlStr: ', sqlStr);            
    // stmt=conn.prepare(sqlStr);
    // result=stmt.exec();
    // stmt.drop();

    let tpGrpStr=groupId.split('#');
    tpGroupId = tpGrpStr[2] + '#' + tpGrpStr[3] + '#' + tpGrpStr[4];


    sqlStr = 'SELECT DISTINCT "OBJ_DEP", "OBJ_COUNTER", ' + '"' + vcConfigTimePeriod + '"' + 
             ' from  "V_FUTURE_DEP_TS" WHERE  "GroupID" = ' + "'" + tpGroupId + "'" +
             ' AND "Type" = ' + "'" + odType + "'" + 
             ' AND "VERSION" = ' + "'" + version + "'" +
             ' AND "SCENARIO" = ' + "'" + scenario + "'" +
             ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';

    console.log("V_FUTURE_DEP_TS Distinct Periods sqlStr", sqlStr)
    // stmt=conn.prepare(sqlStr);
    // var distPeriods=stmt.exec();
    // stmt.drop();
    var distPeriods=await cds.run(sqlStr);
    //console.log("Time Periods for Group :", tpGroupId, " Results: ", distPeriods,"periods#",distPeriods.length);
    var predictedTime = new Date().toISOString();
    var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');
    //console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

    for (let index=0; index<distPeriods.length; index++)
    {     
        let predictedVal = fittedObj[index].value;
        predictedVal = ( +predictedVal).toFixed(2);
        let periodId = distPeriods[index][trimmedPeriod];
       // console.log('Inside for loop index: ', index, 'trimmedPeriod : ', trimmedPeriod, 'periodId :', periodId);

        // sqlStr = 'UPDATE "V_FUTURE_DEP_TS" SET "Predicted" = ' + "'" + predictedVal + "'" + "," +
        //          '"PredictedTime" = ' + "'" + predictedTime + "'" + "," +
        //          '"PredictedStatus" = ' + "'" + 'SUCCESS' + "'"+ 
        //          ' WHERE "GroupID" = ' + "'" + groupId + "'" + 
        //          ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";

         //console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)
        sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", "Type", "OBJ_DEP", "OBJ_COUNTER", "VERSION", "SCENARIO" ' +
                'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + tpGroupId + "'" + 
                ' AND "Type" = ' + "'" + odType + "'" +
                ' AND "VERSION" = ' + "'" + version + "'" +
                ' AND "SCENARIO" = ' + "'" + scenario + "'" +
                ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        //console.log("V_FUTURE_DEP_TS MLR SELECT sqlStr ", sqlStr);

        // stmt=conn.prepare(sqlStr);
        // result=stmt.exec();
        // stmt.drop();
        result = await cds.run(sqlStr);
        //console.log("V_FUTURE_DEP_TS MLR SELECT sqlStr result ", result);

        sqlStr = 'UPSERT "CP_TS_PREDICTIONS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
                    "'" + result[0].Location + "'" + "," +
                    "'" + result[0].Product + "'" + "," +
                    "'" + result[0].Type + "'" + "," +
                    "'" + result[0].OBJ_DEP + "'" + "," +
                    "'" + result[0].OBJ_COUNTER + "'" + "," +
                    "'" + 'MLR' + "'" + "," +
                    "'" + modelVersion  + "'" + "," +
                    "'" + profileId  + "'" + "," +
                    "'" + result[0].VERSION + "'" + "," +
                    "'" + result[0].SCENARIO + "'" + "," +
                    "'" + predictedVal + "'" + "," +
                    "'" + predictedTime + "'" + "," +
                    "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
            
            //' WHERE "GroupID" = ' + "'" + groupId + "'" + 
            //' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        //console.log("V_PREDICTIONS Predicted Value MLR sql update sqlStr", sqlStr);


        //console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)

        // stmt=conn.prepare(sqlStr);
        // stmt.exec();
        // stmt.drop();
        await cds.run(sqlStr);

        // let method = 'MLR';
        // sqlStr = 'SELECT CP_PAL_PROFILEOD.PROFILE, METHOD FROM CP_PAL_PROFILEOD ' +
        //         'INNER JOIN CP_PAL_PROFILEMETH ON '+
        //         '"CP_PAL_PROFILEOD"."PROFILE" = "CP_PAL_PROFILEMETH"."PROFILE"' +
        //         ' AND CP_PAL_PROFILEMETH.METHOD = ' + "'" + method + "'" +
        //         ' AND LOCATION_ID = ' + "'" + result[0].Location + "'" +
        //         ' AND PRODUCT_ID = ' + "'" + result[0].Product + "'" +
        //         ' AND OBJ_DEP = ' + "'" + result[0].OBJ_DEP + '_' + result[0].OBJ_COUNTER + "'" +
        //         ' AND OBJ_TYPE = ' + "'" + result[0].Type + "'";
                
        // //console.log("V_PREDICTIONS IBP Result Plan Predicted Value MLR sql sqlStr", sqlStr);
        // stmt=conn.prepare(sqlStr);
        // results = stmt.exec();
        // stmt.drop();

        // if ( (results.length > 0) &&
        //     (results[0].METHOD = 'MLR') &&
        if (modelVersion == 'Active')
        {
            sqlStr = 'UPSERT "CP_IBP_RESULTPLAN_TS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
                    "'" + result[0].Location + "'" + "," +
                    "'" + result[0].Product + "'" + "," +
                    "'" + result[0].Type + "'" + "," +
                    "'" + result[0].OBJ_DEP + "'" + "," +
                    "'" + result[0].OBJ_COUNTER + "'" + "," +
                    "'" + modelVersion  + "'" + "," +
                    "'" + profileId  + "'" + "," +
                    "'" + result[0].VERSION + "'" + "," +
                    "'" + result[0].SCENARIO + "'" + "," + 
                    "'" + predictedVal + "'" + "," +
                    "'" + predictedTime + "'" + "," +
                    "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
            
 
            //console.log("CP_IBP_RESULTPLAN_TS Predicted Value MLR sql update sqlStr", sqlStr);

            // stmt=conn.prepare(sqlStr);
            // stmt.exec();
            // stmt.drop();
            await cds.run(sqlStr);
        }

    }

    // conn.disconnect();

    var conn = hana.createConnection();
    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
 
    // Extract Intercepts and Coefficients
    sqlStr = 'SELECT "GROUP_ID", "VARIABLE_NAME", "COEFFICIENT_VALUE" FROM PAL_MLR_COEFFICIENT_GRP_TAB' +
                 ' WHERE "GROUP_ID" = ' + "'" + groupId + "'";
    //console.log('sqlStr: ', sqlStr);            

    var stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log('sqlStr PAL_MLR_COEFFICIENT_GRP_TAB Result: ', result);            

    conn.disconnect();

 
    var intercept, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12 = 0;

    for (let index=0; index<result.length; index++)
    {
        //console.log('sqlStr PAL_MLR_COEFFICIENT_GRP_TAB index: ', index, 'VAR NAME = ', result[index].VARIABLE_NAME);            
   
        if (result[index].VARIABLE_NAME == '__PAL_INTERCEPT__')
            intercept = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V1')
            c1 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V2')
            c2 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V3')
            c3 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V4')
            c4 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V5')
            c5 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V6')
            c6 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V7')
            c7 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V8')
            c8 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V9')
            c9 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V10')
            c10 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V11')
            c11 = result[index].COEFFICIENT_VALUE;
        else if (result[index].VARIABLE_NAME == 'V12')
            c12 = result[index].COEFFICIENT_VALUE;
    }

    //console.log("INTERCEPT = ". intercept);

//    conn.disconnect();

    // var conn = hana.createConnection();
 
    // conn.connect(conn_params_container);

    // sqlStr = 'SET SCHEMA ' + containerSchema; 
    // // console.log('sqlStr: ', sqlStr);            
    // stmt=conn.prepare(sqlStr);
    // result=stmt.exec();
    // stmt.drop();

    for (let pIndex=0; pIndex<distPeriods.length; pIndex++)
    {     
        let predictedVal = fittedObj[pIndex].value;
        predictedVal = ( +predictedVal).toFixed(2);
        let periodId = distPeriods[pIndex][trimmedPeriod];
        //console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

        sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", ' +
                 '"Type", "OBJ_DEP", "OBJ_COUNTER", "ROW_ID", "CharCount", "VERSION", "SCENARIO" ' +
                'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + tpGroupId + "'" + 
                ' AND "Type" = ' + "'" + odType + "'" + 
                ' AND "VERSION" = ' + "'" + version + "'" +
                ' AND "SCENARIO" = ' + "'" + scenario + "'" +
                ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        //console.log("V_FUTURE_DEP_TS MLR SELECT sqlStr ", sqlStr);

        result = [];


        // stmt=conn.prepare(sqlStr);
        // result=stmt.exec();
        // stmt.drop();
        result = await cds.run(sqlStr);
        //console.log("V_FUTURE_DEP_TS MLR SELECT sqlStr result ", result, "length = ", result.length);

    

        for (let rIndex = 0; rIndex < result.length; rIndex++)
        {
            let impact_val = impact_percent = 0;
            if (result[rIndex].ROW_ID == 1)
                impact_val = c1*result[rIndex].CharCount;
            else if (result[rIndex].ROW_ID == 2)
                impact_val = c2*result[rIndex].CharCount;   
            else if (result[rIndex].ROW_ID == 3)
                impact_val = c3*result[rIndex].CharCount;  
            else if (result[rIndex].ROW_ID == 4)
                impact_val = c4*result[rIndex].CharCount;
            else if (result[rIndex].ROW_ID == 5)
                impact_val = c5*result[rIndex].CharCount;  
            else if (result[rIndex].ROW_ID == 6)
                impact_val = c6*result[rIndex].CharCount;   
            else if (result[rIndex].ROW_ID == 7)
                impact_val = c7*result[rIndex].CharCount;  
            else if (result[rIndex].ROW_ID == 8)
                impact_val = c8*result[rIndex].CharCount;
            else if (result[rIndex].ROW_ID == 9)
                impact_val = c9*result[rIndex].CharCount;
            else if (result[rIndex].ROW_ID == 10)
                impact_val = c10*result[rIndex].CharCount;   
            else if (result[rIndex].ROW_ID == 11)
                impact_val = c11*result[rIndex].CharCount;  
            else if (result[rIndex].ROW_ID == 12)
                impact_val = c12*result[rIndex].CharCount;

            if (predictedVal <= 0)
               impact_percent = 0;
            else
               impact_percent = 100.0*impact_val/(predictedVal - intercept);

            //console.log("rIndex = ",rIndex,"impact_percent = ", impact_percent,"predictedVal = ", predictedVal, "intercept =",intercept);
            let predicted = predictedVal;
            sqlStr = 'UPSERT "CP_TS_OBJDEP_CHAR_IMPACT_F" VALUES (' + "'" + result[rIndex].CAL_DATE + "'" + "," +
                "'" + result[rIndex].Location + "'" + "," +
                "'" + result[rIndex].Product + "'" + "," +
                "'" + result[rIndex].Type + "'" + "," +
                "'" + result[rIndex].OBJ_DEP + "'" + "," +
                "'" + result[rIndex].OBJ_COUNTER + "'" + "," +
                "'" + result[rIndex].ROW_ID + "'" + "," +
                "'" + 'MLR' + "'" + "," +
                "'" + modelVersion  + "'" + "," +
                "'" + profileId  + "'" + "," +
                "'" + result[rIndex].VERSION + "'" + "," +
                "'" + result[rIndex].SCENARIO + "'" + "," +
                "'" + result[rIndex].CharCount + "'" + "," +
                "'" + impact_val + "'" + "," +
                "'" + impact_percent + "'" + "," +
                "'" + predicted + "'" + "," +
                "'" + predictedTime + "'" + ')' + ' WITH PRIMARY KEY';
            
            //console.log("CP_TS_OBJDEP_CHAR_IMPACT_F MLR UPSERT sqlStr ", sqlStr); 
  
            // stmt=conn.prepare(sqlStr);
            // stmt.exec();
            // stmt.drop(); 
            try {
                await cds.run(sqlStr);
            }
            catch (exception) {
                console.log("ERROR -- CP_TS_OBJDEP_CHAR_IMPACT_F MLR UPSERT sqlStr ", sqlStr); 
                throw new Error(exception.toString());
            }  
        }
  

    }
    // conn.disconnect();

    let returnObj = [];	
    let createdAt = createtAtObj;
    let mlrpID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let fittedResults = fittedObj;
    returnObj.push({mlrpID, createdAt,predictionParameters,mlrpType,predictionData,fittedResults});

    return returnObj[0];
}

