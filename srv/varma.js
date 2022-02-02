const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');
const varmaFuncs = require('./varma.js');

// const conn_params = {
//     serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
//     uid         : "SBPTECHTEAM", //process.env.uidClassicalSchema, //cf environment variable
//     pwd         : "Sbpcorp@22", //process.env.uidClassicalSchemaPassword,//cf environment variable
//     encrypt: 'TRUE',
//     ssltruststore: cds.env.requires.hana.credentials.certificate
// };
// const vcConfigTimePeriod = "PeriodOfYear"; //process.env.TimePeriod; //cf environment variable
// const classicalSchema = "DB_CONFIG_PROD_CLIENT1"; //process.env.classicalSchema; //cf environment variable


const conn_params = {
    serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    uid         : process.env.uidClassicalSchema, //cf environment variable"SBPTECHTEAM",//
    pwd         : process.env.uidClassicalSchemaPassword,//cf environment variable"Sbpcorp@22",//
    encrypt: 'TRUE',
    ssltruststore: cds.env.requires.hana.credentials.certificate
};
const vcConfigTimePeriod = process.env.TimePeriod; //cf environment variable"PeriodOfYear";//
const classicalSchema = process.env.classicalSchema; //cf environment variable"DB_CONFIG_PROD_CLIENT1";//

const containerSchema = cds.env.requires.db.credentials.schema;
const conn_params_container = {
    serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    uid         : cds.env.requires.db.credentials.user, //cds userid environment variable
    pwd         : cds.env.requires.db.credentials.password,//cds password environment variable
    encrypt: 'TRUE',
    ssltruststore: cds.env.requires.hana.credentials.certificate
};

exports._genVarmaModels = function(req) {
   
    varmaFuncs._updateVarmaGroupParams(req);
    
    varmaFuncs._updateVarmaGroupData(req);

    varmaFuncs._genVarmaModelsGroup(req); 
  
}

exports._updateVarmaGroupParams = function(req) {
    const varmaControlParams = req.data.controlParameters;

    console.log('_updateVarmaGroupParams: ', varmaControlParams);         

   if (varmaControlParams.length == 0)
        return;
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

// ---------- BEGIN OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS
    let inGroups = [];
    let modelGroup = varmaControlParams[0].groupId;
    inGroups.push(modelGroup);
    for (var i in varmaControlParams)
    { 
        if (i > 0)
        {
            if( varmaControlParams[i].groupId != varmaControlParams[i-1].groupId)
            {
               // inGroups.push(varmaControlParams[i].GROUP_ID);
               inGroups.push(varmaControlParams[i].groupId);

            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = "DELETE FROM PAL_VARMA_CTRL_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        console.log('_updateVarmaGroupParams sqlStr ', sqlStr);
        stmt=conn.prepare(sqlStr);
        //result=stmt.exec();
        stmt.exec();
        stmt.drop();

    }
// ---------- END OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS

    var tableObj = [];	
        
    for (let i = 0; i < varmaControlParams.length; i++)
    {
        let groupId = varmaControlParams[i].groupId ;
        let paramName = varmaControlParams[i].paramName;
        let intVal =  varmaControlParams[i].intVal
        let doubleVal = varmaControlParams[i].doubleVal;
        let strVal = varmaControlParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
        
    }
    //console.log(' tableObj ', tableObj);

    sqlStr = "INSERT INTO PAL_VARMA_CTRL_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}

exports._updateVarmaGroupData = function(req) {
    const varmaGroupData = req.data.varmaData;

    var varmaType = req.data.varmaType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (varmaType == 1)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_1T";
    else if (varmaType == 2)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_2T";
    else if (varmaType == 3)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_3T";
    else if (varmaType == 4)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_4T";
    else if (varmaType == 5)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_5T";
    else if (varmaType == 6)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_6T";
    else if (varmaType == 7)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_7T";
    else if (varmaType == 8)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_8T";
    else if (varmaType == 9)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_9T";
    else if (varmaType == 10)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_10T";
    else if (varmaType == 11)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_11T";
    else if (varmaType == 12)
        sqlStr = "DELETE FROM PAL_VARMA_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid varmaType":varmaType});
        return;
    }

    stmt=conn.prepare(sqlStr);
    // let results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	

    
    let timestamp, att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, target, groupId;
    for (var i = 0; i < varmaGroupData.length; i++)
    {
        groupId = varmaGroupData[i].groupId ;
        //timestamp = varmaGroupData[i].timestamp;
        timestamp = varmaGroupData[i].ID;
        target = varmaGroupData[i].target;
        //console.log('_updateVarmaGroupData ', ID);

        att1 = varmaGroupData[i].att1;
        if (varmaType > 1)
            att2 =  varmaGroupData[i].att2;
        if (varmaType > 2)
            att3 = varmaGroupData[i].att3;
        if (varmaType > 3)
            att4 = varmaGroupData[i].att4;
        if (varmaType > 4)
            att5 = varmaGroupData[i].att5;
        if (varmaType > 5)
            att6 = varmaGroupData[i].att6;
        if (varmaType > 6)
            att7 = varmaGroupData[i].att7;
        if (varmaType > 7)
            att8 = varmaGroupData[i].att8;
        if (varmaType > 8)
            att9 = varmaGroupData[i].att9;
        if (varmaType > 9)
            att10 = varmaGroupData[i].att10;
        if (varmaType > 10)
            att11 = varmaGroupData[i].att11;
        if (varmaType > 11)
            att12 = varmaGroupData[i].att12;

        var rowObj = [];
        if (varmaType == 1)
            rowObj.push(groupId,timestamp,att1,target);
        else if (varmaType == 2)
            rowObj.push(groupId,timestamp,att1,att2,target);
        else if (varmaType == 3)
            rowObj.push(groupId,timestamp,att1,att2,att3,target);
        else if (varmaType == 4)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,target);
        else if (varmaType == 5)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,target);
        else if (varmaType == 6)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,target);
        else if (varmaType == 7)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,att7,target);
        else if (varmaType == 8)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,att7,att8,target);
        else if (varmaType == 9)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,att7,att8,att9,target);
        else if (varmaType == 10)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,target);
        else if (varmaType == 11)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11, target);
        else if (varmaType == 12)
            rowObj.push(groupId,timestamp,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12, target);
        tableObj.push(rowObj);
    }
    console.log(' _updateVarmaGroupData - tableObj ', tableObj);
    if (varmaType == 1)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_1T(GROUP_ID,TIMESTAMP,ATT1,TARGET) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (varmaType == 2)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_2T(GROUP_ID,TIMESTAMP,ATT1,ATT2,TARGET) VALUES(?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (varmaType == 3)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_3T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,TARGET) VALUES(?, ?, ?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 4)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_4T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,TARGET) VALUES(?, ?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 5)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_5T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 6)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_6T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 7)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_7T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 8)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_8T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 9)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_9T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 10)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_10T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 11)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_11T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 12)
    {
        sqlStr = "INSERT INTO PAL_VARMA_DATA_GRP_TAB_12T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,ATT12,TARGET) VALUES(?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateVarmaGroupData sqlStr ', sqlStr);

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateVarmaGroupData Completed ');
}

exports._genVarmaModelsGroup = function(req) {
    console.log('Executing VARMA Models at GROUP');
    var varmaType = req.data.varmaType;
    var varmaDataTable;
    if (varmaType == 1)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_1T";
    else if (varmaType == 2)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_2T";
    else if (varmaType == 3)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_3T";
    else if (varmaType == 4)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_4T";
    else if (varmaType == 5)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_5T";
    else if (varmaType == 6)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_6T";
    else if (varmaType == 7)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_7T";
    else if (varmaType == 8)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_8T";
    else if (varmaType == 9)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_9T";
    else if (varmaType == 10)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_10T";
    else if (varmaType == 11)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_11T";
    else if (varmaType == 12)
        varmaDataTable = "PAL_VARMA_DATA_GRP_TAB_12T";
    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    //var groupId = group;
    sqlStr = 'DELETE FROM PAL_VARMA_MODEL_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + varmaDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_VARMA_FIT_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + varmaDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_VARMA_IRF_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + varmaDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (varmaType == 1)
        sqlStr = 'call VARMA_MAIN_1T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 2)
        sqlStr = 'call VARMA_MAIN_2T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 3)
        sqlStr = 'call VARMA_MAIN_3T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 4)
        sqlStr = 'call VARMA_MAIN_4T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 5)
        sqlStr = 'call VARMA_MAIN_5T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 6)
        sqlStr = 'call VARMA_MAIN_6T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 7)
        sqlStr = 'call VARMA_MAIN_7T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 8)
        sqlStr = 'call VARMA_MAIN_8T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 9)
        sqlStr = 'call VARMA_MAIN_9T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 10)
        sqlStr = 'call VARMA_MAIN_10T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 11)
        sqlStr = 'call VARMA_MAIN_11T(' + varmaDataTable + ', ?,?,?)';
    else if (varmaType == 12)
        sqlStr = 'call VARMA_MAIN_12T(' + varmaDataTable + ', ?,?,?)';
    console.log('_genVarmaModelsGroup sqlStr',sqlStr);

    stmt=conn.prepare(sqlStr);
    var modelResults=stmt.exec();
    stmt.drop();
    

    console.log('_genVarmaModelsGroup Models Table Results Length:', modelResults.length);
            //console.log('Model Table Results: ', modelResults);
    
    var models = [];
    var modelGroup = modelResults[0].GROUP_ID;
    models.push(modelGroup);
    for (var i in modelResults)
    { 
        if (i > 0)
        {
            if( modelResults[i].GROUP_ID != modelResults[i-1].GROUP_ID)
            {
                models.push(modelResults[i].GROUP_ID);
            }
        }
    }

    var modelsObj = [];

    for (let i=0; i< modelResults.length; i++)
    {     
        let groupId = modelResults[i].GROUP_ID;
        let contentIndex = modelResults[i].CONTENT_INDEX;
        let contentValue = modelResults[i].CONTENT_VALUE;
        modelsObj.push({groupId,contentIndex,contentValue});

    }


    var fittedObj = [];

    sqlStr =  'SELECT * FROM PAL_VARMA_FIT_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + varmaDataTable + ')';

    stmt=conn.prepare(sqlStr);
    let fitResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< fitResults.length; i++)
    {     
        let groupId = fitResults[i].GROUP_ID;
        let nameCol = fitResults[i].NAMECOL;
        let idx = fitResults[i].IDX;
        let fitting = fitResults[i].FITTING;
        let residual = fitResults[i].RESIDUAL;

        fittedObj.push({groupId,nameCol,idx,fitting,residual});
    }

    var irfObj = [];

    sqlStr =  'SELECT * FROM PAL_VARMA_IRF_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + varmaDataTable + ')';

    stmt=conn.prepare(sqlStr);
    let irfResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< irfResults.length; i++)
    {     
        let groupId = irfResults[i].GROUP_ID;
        let col1 = irfResults[i].COL1;
        let col2 = irfResults[i].COL2;
        let idx = irfResults[i].IDX;
        let response = irfResults[i].RESPONSE;

        irfObj.push({groupId,col1,col2,idx,response});
    }

    

    var createtAtObj = new Date();
    let idObj = uuidv1();
    //let uuidObj = uuidv1();

    
    let cqnQuery = {INSERT:{ into: { ref: ['CP_PALVARMAMODELS'] }, entries: [
        {   varmaID: idObj, createdAt : createtAtObj.toISOString(), 
            Location : req.data.Location,
            Product : req.data.Product,
            controlParameters:req.data.controlParameters, 
            varmaData : req.data.varmaData, 
            modelsOp : modelsObj,
            fittedOp : fittedObj,
            irfOp : irfObj }
        ]}}

    cds.run(cqnQuery);

    console.log('Varama Model Results', modelsObj);

/////
    let controlParameters = req.data.controlParameters;
    let inGroups = [];
    let inGroup = req.data.controlParameters[0].groupId;
    inGroups.push(inGroup);
    for (let i in controlParameters)
    { 
        if (i > 0)
        {
            if( controlParameters[i].groupId != controlParameters[i-1].groupId)
            {
                inGroups.push(controlParameters[i].groupId);
            }
        }
    }

    console.log("inGroups ", inGroups, "Number of Groups",inGroups.length);

    var tableObj = [];
    for (let grpIndex = 0; grpIndex < inGroups.length; grpIndex++)
    {
        let paramsGroupObj = [];
        let fittedGroupObj = [];	
        let irfGroupObj = [];	

        console.log("GROUP_ID ", inGroups[grpIndex]);

        
        for (let i = 0; i < controlParameters.length; i++)
        {
            if (inGroups[grpIndex] == controlParameters[i].groupId)
            {            
                let paramName = controlParameters[i].paramName;
                let intVal =  controlParameters[i].intVal
                let doubleVal = controlParameters[i].doubleVal;
                let strVal = controlParameters[i].strVal;
                paramsGroupObj.push({paramName,intVal,doubleVal,strVal});
            }
        }
        for (let i=0; i< fitResults.length; i++)
        {     
            if (inGroups[grpIndex] == fitResults[i].GROUP_ID)
            {
                let nameCol = fitResults[i].NAMECOL;
                let idx = fitResults[i].IDX;
                let fitting = fitResults[i].FITTING;
                let residual = fitResults[i].RESIDUAL;
                fittedGroupObj.push({nameCol,idx,fitting,residual});
            }
        }

        for (let i=0; i< irfResults.length; i++)
        {     
            if (inGroups[grpIndex] == irfResults[i].GROUP_ID)
            {
                let col1 = irfResults[i].COL1;
                let col2 = irfResults[i].COL2;
                let idx = irfResults[i].IDX;
                let response = irfResults[i].RESPONSE;

                irfGroupObj.push({col1,col2,idx,response});
            }
        }
    
    /*    
        let cqnQuery = {INSERT:{ into: { ref: ['PalVarmaByGroup'] }, entries: [
        {   varmaGroupID: idObj, createdAt : createtAtObj, groupId : inGroups[grpIndex],
            controlParameters:paramsGroupObj, 
            varmaType : req.data.varmaType,
            fittedOp : fittedGroupObj,
            irfOp : irfGroupObj}
        ]}}

        cds.run(cqnQuery);
    */    
        let grpStr=inGroups[grpIndex].split('#');
        let GroupId = grpStr[0];
        let location = grpStr[1];
        let product = grpStr[2];

        console.log("_runRegressionMLRGroup  grpStr ", grpStr, "GroupId ",GroupId, " location ", location, " product ", product);

        var rowObj = {   varmaGroupID: idObj, createdAt : createtAtObj.toISOString(), 
            Location : location,
            Product : product,
            groupId : GroupId,
            controlParameters:paramsGroupObj, 
            varmaType : req.data.varmaType,
            fittedOp : fittedGroupObj,
            irfOp : irfGroupObj};
        tableObj.push(rowObj);
    }

    cqnQuery = {INSERT:{ into: { ref: ['CP_PALVARMABYGROUP'] }, entries:  tableObj }};

    cds.run(cqnQuery);
/////

    let returnObj = [];	
    let createdAt = createtAtObj;
    let varmaID = idObj; //uuidObj;
//    let controlParameters = req.data.controlParameters;
    let varmaData = req.data.varmaData;
    let modelsOp = modelsObj;
    let fittedOp = fittedObj;
    let irfOp = irfObj;
    returnObj.push({varmaID, createdAt,controlParameters,varmaData,modelsOp, fittedOp,irfOp});

    var res = req._.req.res;
    res.send({"value":returnObj});

    console.log('Completed VARMA Models Generation for Groups Successfully');

    conn.disconnect(function(err) {
    if (err) throw err;
    console.log('disconnected');
    });
}

exports._runVarmaPredictions = function(req) {

  //  var groupId = req.data.groupId;
  var groupId = req.data.groupId + '#' + req.data.Location + '#' + req.data.Product;

   var conn = hana.createConnection();

   conn.connect(conn_params);

   var sqlStr = 'SET SCHEMA ' + classicalSchema;  
   // console.log('sqlStr: ', sqlStr);            
   var stmt=conn.prepare(sqlStr);
   var results=stmt.exec();
   stmt.drop();

   sqlStr = 'SELECT COUNT(DISTINCT "GROUP_ID") AS "ModelExists" FROM "PAL_VARMA_MODEL_GRP_TAB" WHERE "GROUP_ID" = ' + "'" + groupId + "'";
   stmt=conn.prepare(sqlStr);
   results = stmt.exec();
   stmt.drop();
   console.log('_runVarmaPredictions - sqlStr : ', sqlStr);            

   var modelExists = results[0].ModelExists;
   console.log('_runVarmaPredictions - modelExists: ', modelExists);            

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
     
   varmaFuncs._updateVarmaPredictionParams(req);
    
   varmaFuncs._updateVarmaPredictionData(req);

   varmaFuncs._runPredictionVarmaGroup(req); 
}


exports._updateVarmaPredictionParams = function(req) {

    const varmaPredictionParams = req.data.predictionParameters;
    //console.log('_updateVarmaPredictionParams: ', varmaPredictionParams);         
     if (varmaPredictionParams.length == 0)
        return;

    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop(); 

    sqlStr = "DELETE FROM PAL_VARMA_PREDICT_CTRL_GRP_TAB";

    stmt=conn.prepare(sqlStr);
    //results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);

 
    var tableObj = [];	
        
    for (var i = 0; i < varmaPredictionParams.length; i++)
    {
        let groupId = varmaPredictionParams[i].groupId ;
        let paramName = varmaPredictionParams[i].paramName;
        let intVal =  varmaPredictionParams[i].intVal
        let doubleVal = varmaPredictionParams[i].doubleVal;
        let strVal = varmaPredictionParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);


    sqlStr = "INSERT INTO PAL_VARMA_PREDICT_CTRL_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();

}

exports._updateVarmaPredictionData = function(req) {

    
    const predictionData = req.data.predictionData;
    var varmaType = req.data.varmaType;

    //console.log('_updateVarmaPredictionData: ', varmaPredictData);         




    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (varmaType == 1)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_1T";
    else if (varmaType == 2)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_2T";
    else if (varmaType == 3)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_3T";
    else if (varmaType == 4)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_4T";
    else if (varmaType == 5)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_5T";
    else if (varmaType == 6)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_6T";
    else if (varmaType == 7)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_7T";
    else if (varmaType == 8)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_8T";
    else if (varmaType == 9)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_9T";
    else if (varmaType == 10)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_10T";
    else if (varmaType == 11)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_11T";
    else if (varmaType == 12)
        sqlStr = "DELETE FROM PAL_VARMA_PRED_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid VarmaType":varmaType});
        return;
    }

    stmt=conn.prepare(sqlStr);
//    results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	
    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, timestampIdx, groupId;
    for (var i = 0; i < predictionData.length; i++)
    {
        groupId = predictionData[i].groupId ;
//        timestampIdx = predictionData[i].timestampIdx;
        timestampIdx = predictionData[i].ID;

        //console.log('_updateMlrGroupData ', ID);

        att1 = predictionData[i].att1;
        if (varmaType > 1)
            att2 =  predictionData[i].att2;
        if (varmaType > 2)
            att3 = predictionData[i].att3;
        if (varmaType > 3)
            att4 = predictionData[i].att4;
        if (varmaType > 4)
            att5 = predictionData[i].att5;
        if (varmaType > 5)
            att6 = predictionData[i].att6;
        if (varmaType > 6)
            att7 = predictionData[i].att7;
        if (varmaType > 7)
            att8 = predictionData[i].att8;
        if (varmaType > 8)
            att9 = predictionData[i].att9;
        if (varmaType > 10)
            att10 = predictionData[i].att10;
        if (varmaType > 11)
            att11 = predictionData[i].att11;
        if (varmaType > 12)
            att12 = predictionData[i].att12;

        var rowObj = [];
        if (varmaType == 1)
            rowObj.push(groupId,timestampIdx,att1);
        else if (varmaType == 2)
            rowObj.push(groupId,timestampIdx,att1,att2);
        else if (varmaType == 3)
            rowObj.push(groupId,timestampIdx,att1,att2,att3);
        else if (varmaType == 4)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4);
        else if (varmaType == 5)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5);
        else if (varmaType == 6)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6);
        else if (varmaType == 7)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6,att7);
        else if (varmaType == 8)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6,att7,att8);
        else if (varmaType == 9)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9);
        else if (varmaType == 10)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10);
        else if (varmaType == 11)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11);
        else if (varmaType == 12)
            rowObj.push(groupId,timestampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (varmaType == 1)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_1T(GROUP_ID,TIMESTAMP,ATT1) VALUES(?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (varmaType == 2)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_2T(GROUP_ID,TIMESTAMP,ATT1,ATT2) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (varmaType == 3)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_3T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3) VALUES(?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 4)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_4T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4) VALUES(?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 5)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_5T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5) VALUES(?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 6)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_6T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6) VALUES(?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 7)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_7T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7) VALUES(?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 8)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_8T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8) VALUES(?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 9)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_9T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 10)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_10T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 11)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_11T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (varmaType == 12)
    {
        sqlStr = "INSERT INTO PAL_VARMA_PRED_DATA_GRP_TAB_12T(GROUP_ID,TIMESTAMP,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,ATT12) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateVarmaPredictionData sqlStr ', sqlStr);

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateVarmaPredictionData Completed ');
    
}

exports._runPredictionVarmaGroup = function(req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var varmaType = req.data.varmaType;
    var version = req.data.Version;
    var scenario = req.data.Scenario;

    console.log('_runPredictionVarmaGroup varmaType : ', varmaType);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    if (varmaType == 1)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_1T";
    else if (varmaType == 2)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_2T";
    else if (varmaType == 3)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_3T";
    else if (varmaType == 4)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_4T";
    else if (varmaType == 5)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_5T";
    else if (varmaType == 6)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_6T";
    else if (varmaType == 7)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_7T";
    else if (varmaType == 8)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_8T";
    else if (varmaType == 9)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_9T";
    else if (varmaType == 10)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_10T";
    else if (varmaType == 11)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_11T";
    else if (varmaType == 12)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_VARMA_PRED_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid varmaType":varmaType});
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

        console.log('PredictionVarma Group: ', groupId);
        //predictionResults = predictionResults + _runHgbtPrediction(groupId);
        let predictionObj = varmaFuncs._runVarmaPrediction(varmaType, groupId, version, scenario);
        //value.push({predictionObj});
        predResults.push(predictionObj);

        if (index == (distinctGroups -1))
        {
            console.log('Prediction Results', predResults);
            let res = req._.req.res;
            res.send({"value":predResults});
            conn.disconnect();
        }
    } 
}


exports._runVarmaPrediction = function(varmaType, group, version, scenario) {


    console.log('_runVarmaPrediction - group', group, 'Version ', version, 'Scenario ', scenario);

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    var groupId = group;
    let grpStr=groupId.split('#');
    let GroupId = grpStr[0];
    let location = grpStr[1];
    let product = grpStr[2];
    
    sqlStr = "create local temporary column table #PAL_VARMA_MODEL_TAB_"+ groupId + " " + 
                    "(\"CONTENT_INDEX\" INTEGER,\"CONTENT_VALUE\" NVARCHAR(5000))";


    stmt=conn.prepare(sqlStr);
    let result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '#PAL_VARMA_MODEL_TAB_'+ groupId + ' SELECT "CONTENT_INDEX", "CONTENT_VALUE" FROM PAL_VARMA_MODEL_GRP_TAB WHERE PAL_VARMA_MODEL_GRP_TAB.GROUP_ID =' + "'" + groupId + "'";

    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
    var predDataObj = [];	

    if (varmaType == 1)
    {
 
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1" FROM PAL_VARMA_PRED_DATA_GRP_TAB_1T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_1T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1" FROM PAL_VARMA_PRED_DATA_GRP_TAB_1T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_1T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            predDataObj.push({GroupId,timeStampIdx,att1});
        }
    
    }
    else if (varmaType == 2)
    {
 
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2" FROM PAL_VARMA_PRED_DATA_GRP_TAB_2T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_2T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2" FROM PAL_VARMA_PRED_DATA_GRP_TAB_2T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_2T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            predDataObj.push({GroupId,timeStampIdx,att1,att2});
        }
    
    }
    else if(varmaType == 3)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_3T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_3T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3" FROM PAL_VARMA_PRED_DATA_GRP_TAB_3T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_3T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3});
        }
    
    }
    else if(varmaType == 4)
    {
       sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_4T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_4T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4" FROM PAL_VARMA_PRED_DATA_GRP_TAB_4T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_4T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4});
        }
    }
    else if(varmaType == 5)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_5T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_5T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5" FROM PAL_VARMA_PRED_DATA_GRP_TAB_5T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_5T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5});
        }
    }
    else if(varmaType == 6)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_6T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6" FROM PAL_VARMA_PRED_DATA_GRP_TAB_6T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6});
        }
    }
    else if(varmaType == 7)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double,\"ATT7\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_7T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_7T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7" FROM PAL_VARMA_PRED_DATA_GRP_TAB_7T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_7T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7});
        }
    }
    else if(varmaType == 8)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_8T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_8T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8" FROM PAL_VARMA_PRED_DATA_GRP_TAB_8T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_8T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8});
        }
    }
    else if(varmaType == 9)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_9T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9" FROM PAL_VARMA_PRED_DATA_GRP_TAB_9T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;
            let att9 =  predData[i].ATT9;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9});
        }
    }
    else if(varmaType == 10)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9", "ATT10"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_10T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_10T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9", "ATT10" FROM PAL_VARMA_PRED_DATA_GRP_TAB_10T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_10T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;
            let att9 =  predData[i].ATT9;
            let att10 =  predData[i].ATT10;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10});
        }
    }
    else if(varmaType == 11)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double,\"ATT11\" double))";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9", "ATT10", "ATT11"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_11T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_11T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9", "ATT10", "ATT11" FROM PAL_VARMA_PRED_DATA_GRP_TAB_11T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_11T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;
            let att9 =  predData[i].ATT9;
            let att10 =  predData[i].ATT10;
            let att11 =  predData[i].ATT11;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11});
        }
    }
    else if(varmaType == 12)
    {
        sqlStr = "create local temporary column table #PAL_VARMA_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"TIMESTAMP\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double,\"ATT11\" double,\"ATT12\" double))";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICTDATA_TAB_' + groupId + ' SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9", "ATT10", "ATT11", "ATT12"  FROM PAL_VARMA_PRED_DATA_GRP_TAB_12T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_12T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "TIMESTAMP", "ATT1", "ATT2", "ATT3", "ATT4", "ATT5", "ATT6", "ATT7", "ATT8", "ATT9", "ATT10", "ATT11", "ATT12" FROM PAL_VARMA_PRED_DATA_GRP_TAB_12T WHERE PAL_VARMA_PRED_DATA_GRP_TAB_12T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData=stmt.exec();
        stmt.drop();
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let timeStampIdx =  predData[i].TIMESTAMP;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;
            let att9 =  predData[i].ATT9;
            let att10 =  predData[i].ATT10;
            let att11 =  predData[i].ATT11;
            let att12 =  predData[i].ATT12;

            predDataObj.push({GroupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12});
        }
    }
    else
    {
        console.log('_runVarmaPrediction Invalid varmaType ', varmaType);
        return;
    }
    
    //console.log(result);

    sqlStr = "create local temporary column table #PAL_VARMA_PREDICT_CTRL_TAB_" + groupId + " " +
                        "(\"PARAM_NAME\" varchar(100),\"INT_VALUE\" integer,\"double_VALUE\" double,\"STRING_VALUE\" varchar(100))";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '#PAL_VARMA_PREDICT_CTRL_TAB_' + groupId + ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_VARMA_PREDICT_CTRL_GRP_TAB WHERE PAL_VARMA_PREDICT_CTRL_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();


    sqlStr = ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_VARMA_PREDICT_CTRL_GRP_TAB WHERE PAL_VARMA_PREDICT_CTRL_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";

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


    sqlStr = "call _SYS_AFL.PAL_VARMA_FORECAST(" + "#PAL_VARMA_PREDICTDATA_TAB_" + groupId + "," + "#PAL_VARMA_MODEL_TAB_" + groupId + "," + "#PAL_VARMA_PREDICT_CTRL_TAB_" + groupId + "," + "?)";

    stmt=conn.prepare(sqlStr);
    let predictionResults=stmt.exec();
    stmt.drop();
    //console.log('Prediction Results ', predictionResults);

    // --------------- BEGIN --------------------

    
    var resultsObj = [];	
    for (let i=0; i<predictionResults.length; i++) 
    {
        let colName = predictionResults[i].COLNAME;
        let idx =  predictionResults[i].IDX;
        let forecast = predictionResults[i].FORECAST;
        let se = predictionResults[i].SE;
        let lo95 = predictionResults[i].LO95;
        let hi95 = predictionResults[i].HI95;

        resultsObj.push({GroupId,colName,idx,forecast,se,lo95,hi95});
    }	

    var createtAtObj = new Date();
    //let idObj = groupId;
    let idObj = uuidv1();
    
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALVARMAPREDICTIONS'] }, entries: [
         {varmaID: idObj, createdAt : createtAtObj.toISOString(), Location : location, 
          Product : product, groupId : GroupId, Version : version, Scenario : scenario,
          predictionParameters:predParamsObj, varmaType : varmaType, 
          predictionData : predDataObj, predictedResults : resultsObj}
         ]}}

    cds.run(cqnQuery);

    conn.disconnect();

    conn = hana.createConnection();
 
    conn.connect(conn_params_container);

    sqlStr = 'SET SCHEMA ' + containerSchema; 
    // console.log('sqlStr: ', sqlStr);            
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    

    sqlStr = 'SELECT DISTINCT ' + '"' + vcConfigTimePeriod + '"' + 
            ' from  V_FUTURE_DEP_TS WHERE  "GroupID" = ' + "'" + groupId + "'" +
            ' AND "VERSION" = ' + "'" + version + "'" +
            ' AND "SCENARIO" = ' + "'" + scenario + "'" +
            ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';
    console.log("V_FUTURE_DEP_TS Distinct Periods sqlStr", sqlStr)
    stmt=conn.prepare(sqlStr);
    var distPeriods=stmt.exec();
    stmt.drop();
    console.log("Time Periods for Group :", groupId, " Results: ", distPeriods);
    var predictedTime = new Date().toISOString();
    var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');
    console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

    for (var index=0; index<distPeriods.length; index++)
    {     
        let predictedVal = resultsObj[index].forecast;
        predictedVal = ( +predictedVal).toFixed(2);
        let periodId = distPeriods[index][trimmedPeriod];
        // sqlStr = 'UPDATE V_FUTURE_DEP_TS SET "Predicted" = ' + "'" + predictedVal + "'" + "," +
        //          '"PredictedTime" = ' + "'" + predictedTime + "'" + "," +
        //          '"PredictedStatus" = ' + "'" + 'SUCCESS' + "'"+ 
        //          ' WHERE "GroupID" = ' + "'" + groupId + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        // console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)

        sqlStr = 'SELECT "CAL_DATE", "Location", "Product", "Type", "OBJ_DEP", "OBJ_COUNTER", "VERSION", "SCENARIO" ' +
                'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + groupId + "'" + 
                ' AND "VERSION" = ' + "'" + version + "'" +
                ' AND "SCENARIO" = ' + "'" + scenario + "'" +   
                ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        console.log("V_FUTURE_DEP_TS P SELECT sqlStr ", sqlStr);

        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        console.log("V_FUTURE_DEP_TS P SELECT sqlStr result ", result);

        sqlStr = 'UPSERT "CP_TS_PREDICTIONS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
                    "'" + result[0].Location + "'" + "," +
                    "'" + result[0].Product + "'" + "," +
                    "'" + result[0].Type + "'" + "," +
                    "'" + result[0].OBJ_DEP + "'" + "," +
                    "'" + result[0].OBJ_COUNTER + "'" + "," +
                    "'" + 'VARMA' + "'" + "," +
                    "'" + result[0].VERSION + "'" + "," +
                    "'" + result[0].SCENARIO + "'" + "," +
                    "'" + predictedVal + "'" + "," +
                    "'" + predictedTime + "'" + "," +
                    "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
            
            //' WHERE "GroupID" = ' + "'" + groupId + "'" + 
            //' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        console.log("V_PREDICTIONS Predicted Value sql update sqlStr", sqlStr);

        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    }

/*
    sqlStr = 'SELECT DISTINCT ' + '"' + vcConfigTimePeriod + '"' + ' from  V_FUTURE_DEP_TS WHERE  "GroupID" = ' + "'" + groupId + "'" + ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';
    console.log("V_FUTURE_DEP_TS Distinct Periods sqlStr", sqlStr)
    stmt=conn.prepare(sqlStr);
    var distPeriods=stmt.exec();
    stmt.drop();
    console.log("Time Periods for Group :", groupId, " Results: ", distPeriods);
    var predictedTime = new Date().toISOString();
    var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');
    console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

    for (var index=0; index<distPeriods.length; index++)
    {     

        let periodId = distPeriods[index][trimmedPeriod];
        sqlStr = 'UPDATE V_CBP_FUTURE_DEP_TS SET "Predicted" = ' + "'" + resultsObj[index].FORECAST + "'" + "," +
                 '"PredictedTime" = ' + "'" + predictedTime + "'" +
                 ' WHERE "GroupID" = ' + "'" + groupId + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)

        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    }
    */
    conn.disconnect();

 
    let returnObj = [];	
    let createdAt = createtAtObj;
    let varmaID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let predictedResults = resultsObj;
    returnObj.push({varmaID, createdAt,predictionParameters,varmaType,predictionData,predictedResults});

    return returnObj[0];
}
