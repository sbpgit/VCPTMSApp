const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');
const hgbtFuncs = require('./hgbt.js');


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
    uid         : process.env.uidClassicalSchema, //cf environment variable
    pwd         : process.env.uidClassicalSchemaPassword,//cf environment variable
    encrypt: 'TRUE',
    ssltruststore: cds.env.requires.hana.credentials.certificate
};
const vcConfigTimePeriod = process.env.TimePeriod; //cf environment variable
const classicalSchema = process.env.classicalSchema; //cf environment variable

const containerSchema = cds.env.requires.db.credentials.schema;
const conn_params_container = {
    serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    uid         : cds.env.requires.db.credentials.user, //cds userid environment variable
    pwd         : cds.env.requires.db.credentials.password,//cds password environment variable
    encrypt: 'TRUE',
    ssltruststore: cds.env.requires.hana.credentials.certificate
};



exports._runHgbtRegressionsV1 = function(req) {


    hgbtFuncs._updateHgbtGroupParamsV1 (req);   
  
    hgbtFuncs._updateHgbtGroupDataV1(req);

    hgbtFuncs._runRegressionHgbtGroupV1(req); 
  
}


exports._updateHgbtGroupParamsV1 = function(req) {
    const hgbtGroupParams = req.data.regressionParameters;

    console.log('_updateHgbtGroupParamsV1: ', hgbtGroupParams);         


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

// ---------- BEGIN OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS
    let inGroups = [];
    let modelGroup = hgbtGroupParams[0].groupId;
    inGroups.push(modelGroup);
    for (var i in hgbtGroupParams)
    { 
        if (i > 0)
        {
            if( hgbtGroupParams[i].groupId != hgbtGroupParams[i-1].groupId)
            {
               // inGroups.push(hgbtGroupParams[i].GROUP_ID);
                inGroups.push(hgbtGroupParams[i].groupId);
            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = "DELETE FROM PAL_HGBT_PARAMETER_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        //console.log('_updateHgbtGroupParamsV1 sqlStr ', sqlStr);
        stmt=conn.prepare(sqlStr);
        //result=stmt.exec();
        stmt.exec();
        stmt.drop();

    }
// ---------- END OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS

    var tableObj = [];	
        
    for (let i = 0; i < hgbtGroupParams.length; i++)
    {
        let groupId = hgbtGroupParams[i].groupId ;
        let paramName = hgbtGroupParams[i].paramName;
        let intVal =  hgbtGroupParams[i].intVal
        let doubleVal = hgbtGroupParams[i].doubleVal;
        let strVal = hgbtGroupParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
        
    }
    //console.log(' tableObj ', tableObj);

    sqlStr = "INSERT INTO PAL_HGBT_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}



exports._updateHgbtGroupDataV1 = function(req) {
    const hgbtGroupData = req.data.regressionData;

    var hgbtType = req.data.hgbtType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (hgbtType == 2)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_2T";
    else if (hgbtType == 3)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_3T";
    else if (hgbtType == 4)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_4T";
    else if (hgbtType == 5)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_5T";
    else if (hgbtType == 6)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_6T";
    else if (hgbtType == 7)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_7T";
    else if (hgbtType == 8)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_8T";
    else if (hgbtType == 9)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_9T";
    else if (hgbtType == 10)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_10T";
    else if (hgbtType == 11)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_11T";
    else if (hgbtType == 12)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_12T";
    
    else
    {
        var res = req._.req.res;
        res.send({"Invalid HgbtType":hgbtType});
        return;
    }

    stmt=conn.prepare(sqlStr);
    // let results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	

    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, target, groupId;
    for (var i = 0; i < hgbtGroupData.length; i++)
    {
        groupId = hgbtGroupData[i].groupId ;
        target = hgbtGroupData[i].target;
        //console.log('_updatehgbtGroupData ', ID);

        att1 = hgbtGroupData[i].att1;
        att2 =  hgbtGroupData[i].att2;
        if (hgbtType > 2)
            att3 = hgbtGroupData[i].att3;
        if (hgbtType > 3)
            att4 = hgbtGroupData[i].att4;
        if (hgbtType > 4)
            att5 = hgbtGroupData[i].att5;
        if (hgbtType > 5)
            att6 = hgbtGroupData[i].att6;
        if (hgbtType > 6)
            att7 = hgbtGroupData[i].att7;
        if (hgbtType > 7)
            att8 = hgbtGroupData[i].att8;
        if (hgbtType > 8)
            att9 = hgbtGroupData[i].att9;
        if (hgbtType > 9)
            att10 = hgbtGroupData[i].att10;
        if (hgbtType > 10)
            att11 = hgbtGroupData[i].att11;
        if (hgbtType > 11)
            att12 = hgbtGroupData[i].att12;

        var rowObj = [];
        if (hgbtType == 2)
            rowObj.push(groupId,att1,att2,target);
        else if (hgbtType == 3)
            rowObj.push(groupId,att1,att2,att3,target);
        else if (hgbtType == 4)
            rowObj.push(groupId,att1,att2,att3,att4,target);
        else if (hgbtType == 5)
            rowObj.push(groupId,att1,att2,att3,att4,att5,target);
        else if (hgbtType == 6)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,target);
        else if (hgbtType == 7)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,target);
        else if (hgbtType == 8)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,target);
        else if (hgbtType == 9)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,target);
        else if (hgbtType == 10)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,target);
        else if (hgbtType == 11)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11, target);
        else if (hgbtType == 12)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12,target);

        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (hgbtType == 2)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_2T(GROUP_ID,ATT1,ATT2,TARGET) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (hgbtType == 3)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_3T(GROUP_ID,ATT1,ATT2,ATT3,TARGET) VALUES(?, ?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 4)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_4T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,TARGET) VALUES(?, ?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 5)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_5T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,TARGET) VALUES(?, ?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 6)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_6T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 7)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_7T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 8)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_8T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 9)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_9T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 10)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_10T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 11)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_11T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 12)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_12T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,ATT12,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateHgbtGroupData sqlStr ', sqlStr);

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateHgbtGroupData Completed ');

}

exports._runRegressionHgbtGroupV1 = function(req) {
    console.log('Executing HGBT Regression at GROUP');
    var hgbtType = req.data.hgbtType;
    var hgbtDataTable;
    if (hgbtType == 2)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_2T";
    else if (hgbtType == 3)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_3T";
    else if (hgbtType == 4)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_4T";
    else if (hgbtType == 5)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_5T";
    else if (hgbtType == 6)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_6T";
    else if (hgbtType == 7)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_7T";
    else if (hgbtType == 8)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_8T";
    else if (hgbtType == 9)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_9T";
    else if (hgbtType == 10)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_10T";
    else if (hgbtType == 11)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_11T";
    else if (hgbtType == 12)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_12T";
    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    //var groupId = group;
    sqlStr = 'DELETE FROM PAL_HGBT_MODEL_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_HGBT_IMP_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_HGBT_CONFUSION_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_HGBT_STATS_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';
    //console.log('_runRegressionHgbtGroup sqlStr', sqlStr);
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_HGBT_PARAM_SELECTION_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (hgbtType == 2)
        sqlStr = 'call HGBT_MAIN_2T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 3)
        sqlStr = 'call HGBT_MAIN_3T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 4)
        sqlStr = 'call HGBT_MAIN_4T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 5)
        sqlStr = 'call HGBT_MAIN_5T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 6)
        sqlStr = 'call HGBT_MAIN_6T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 7)
        sqlStr = 'call HGBT_MAIN_7T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 8)
        sqlStr = 'call HGBT_MAIN_8T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 9)
        sqlStr = 'call HGBT_MAIN_9T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 10)
        sqlStr = 'call HGBT_MAIN_10T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 11)
        sqlStr = 'call HGBT_MAIN_11T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 12)
        sqlStr = 'call HGBT_MAIN_12T(' + hgbtDataTable + ', ?,?,?,?,?)';
    console.log('_runRegressionHgbtGroup sqlStr',sqlStr);

    stmt=conn.prepare(sqlStr);
    var modelResults=stmt.exec();
    stmt.drop();
    

//    console.log('Models Table Results Length:', modelResults.length);
//    console.log('Model Table Results: ', modelResults);
    
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
        let rowIndex = modelResults[i].ROW_INDEX;
        let treeIndex = modelResults[i].TREE_INDEX;
        let modelContent = modelResults[i].MODEL_CONTENT;
        modelsObj.push({groupId,rowIndex,treeIndex,modelContent});

    }


    var impObj = [];

    sqlStr =  'SELECT * FROM PAL_HGBT_IMP_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';

    stmt=conn.prepare(sqlStr);
    let importanceResults = stmt.exec();
    stmt.drop();

//    console.log('importanceResults : ', importanceResults);
    for (let i=0; i< importanceResults.length; i++)
    {     
        let groupId = importanceResults[i].GROUP_ID;
        let variableName = importanceResults[i].VARIABLE_NAME;
        let importance = importanceResults[i].IMPORTANCE;
        impObj.push({groupId,variableName,importance});
    }
    //console.log('impObj : ', impObj);

    var statisticsObj = [];

    sqlStr =  'SELECT * FROM PAL_HGBT_STATS_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';

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

    sqlStr =  'SELECT * FROM PAL_HGBT_PARAM_SELECTION_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + hgbtDataTable + ')';

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
    var idObj = uuidv1();

    console.log("_runRegressionHgbtGroupV1 location ", req.data.Location, " product ", req.data.Product);


    let cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTREGRESSIONSV1'] }, entries: [
        //  {   ID: idObj, createdAt : createtAtObj, 
        {   hgbtID: idObj, 
            createdAt : createtAtObj.toISOString(), //2021-12-14T12:00:35.940Z', //new Date(), 
            Location : req.data.Location,
            Product : req.data.Product,
            regressionParameters:req.data.regressionParameters, 
            hgbtType : req.data.hgbtType,
            regressionData : req.data.regressionData, 
            modelsOp : modelsObj,
            importanceOp : impObj,
            statisticsOp : statisticsObj,
            paramSelectionOp : paramSelectionObj}
        ]}}
        
        
    console.log("CP_PALHGBTREGRESSIONSV1 cqnQuery Start " , new Date());

    cds.run(cqnQuery);
    console.log("CP_PALHGBTREGRESSIONSV1 cqnQuery Completed " , new Date());


/////
    let regressionParameters = req.data.regressionParameters;

    let inGroups = [];
    let inGroup = regressionParameters[0].groupId;
    inGroups.push(inGroup);
    
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
    console.log("inGroups ", inGroups, "Number of Groups",inGroups.length);

    var tableObj = [];
    for (let grpIndex = 0; grpIndex < inGroups.length; grpIndex++)
    {
        let statsGroupObj = [];
        let paramsGroupObj = [];
        let impGroupObj = [];
        let paramSelectionGroupObj = [];
        console.log("GROUP_ID ", inGroups[grpIndex]);

        
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
        for (let i=0; i< importanceResults.length; i++)
        {     
            if (inGroups[grpIndex] == importanceResults[i].GROUP_ID)
            {   
                let variableName = importanceResults[i].VARIABLE_NAME;
                let importance = importanceResults[i].IMPORTANCE;
                impGroupObj.push({variableName,importance});
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
/*
        let cqnQuery = {INSERT:{ into: { ref: ['PalHgbtByGroup'] }, entries: [
        {   hgbtGroupID: idObj, createdAt : createtAtObj, groupId : inGroups[grpIndex],
            regressionParameters:paramsGroupObj, 
            hgbtType : req.data.hgbtType,
            importanceOp : impGroupObj,
            statisticsOp : statsGroupObj,
            paramSelectionOp : paramSelectionGroupObj}
        ]}}

        cds.run(cqnQuery);
*/        
        let grpStr=inGroups[grpIndex].split('#');
        let GroupId = grpStr[0];
        let location = grpStr[1];
        let product = grpStr[2];

        console.log("_runRegressionHgbtGroupV1  grpStr ", grpStr, "GroupId ",GroupId, " location ", location, " product ", product);

        var rowObj = {   hgbtGroupID: idObj, 
            //createdAt : createtAtObj, 
            createdAt : createtAtObj.toISOString(),
            Location : location,
            Product : product,
            groupId : GroupId,
            regressionParameters:paramsGroupObj, 
            hgbtType : req.data.hgbtType,
            importanceOp : impGroupObj,
            statisticsOp : statsGroupObj,
            paramSelectionOp : paramSelectionGroupObj};
        tableObj.push(rowObj);
    }

//    cqnQuery = {INSERT:{ into: { ref: ['PalHgbtByGroup'] }, entries:  tableObj }};

    cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTBYGROUP'] }, entries:  tableObj }};
//    console.log("CP_PALHGBTBYGROUP cQnQuery " , cqnQuery);

    console.log("CP_PALHGBTBYGROUP cqnQuery Start " , new Date());
    cds.run(cqnQuery);
    console.log("CP_PALHGBTBYGROUP cqnQuery Completed " , new Date());
/*cqn
    cqnQuery = {UPDATE:{ entity: 'CP_PALHGBTBYGROUP'},
        data: { createdAt : createtAtObj },
        where: hgbtGroupID = idObj
     };

     cqnQuery = {UPDATE:{
        entity: { ref : ['CP_PALHGBTBYGROUP'] },
        data: { createdAt : createtAtObj },
        where: hgbtGroupID = idObj
     }};

        console.log("CP_PALHGBTBYGROUP cqnQuery ", cqnQuery);
   
    cds.run(cqnQuery);
*/



/////
//    console.log('Regression modelsObj', modelsObj);
/*
    const sleep = require('await-sleep');
    console.log('_runRegressionHgbtGroupV1 Sleep Start Time',new Date());
    await sleep(1000);
    console.log('_runRegressionHgbtGroupV1 Sleep Completed Time',new Date());
*/
    let returnObj = [];	
    let createdAt = createtAtObj;
    let hgbtID = idObj; //uuidObj;
//    let regressionParameters = req.data.regressionParameters;
    let regressionData = req.data.regressionData;
    let modelsOp = modelsObj;
    let importanceOp = impObj;
    let statisticsOp = statisticsObj;
    let paramSelectionOp = paramSelectionObj;
    returnObj.push({hgbtID, createdAt,regressionParameters,regressionData,modelsOp, importanceOp,statisticsOp,paramSelectionOp});

    var res = req._.req.res;
    res.send({"value":returnObj});

    console.log('Completed HGBT Regression Models Generation for Groups Successfully');

    conn.disconnect(function(err) {
    if (err) throw err;
    console.log('disconnected');
    });

}


exports._runHgbtPredictionsV1 = function(req) {
   //var groupId = req.data.groupId;
   var groupId = req.data.groupId + '#' + req.data.Location + '#' + req.data.Product;

   var conn = hana.createConnection();

   conn.connect(conn_params);

   var sqlStr = 'SET SCHEMA ' + classicalSchema;  
   // console.log('sqlStr: ', sqlStr);            
   var stmt=conn.prepare(sqlStr);
   var results=stmt.exec();
   stmt.drop();

   sqlStr = 'SELECT COUNT(DISTINCT "GROUP_ID") AS "ModelExists" FROM "PAL_HGBT_MODEL_GRP_TAB" WHERE "GROUP_ID" = ' + "'" + groupId + "'";
   stmt=conn.prepare(sqlStr);
   results = stmt.exec();
   stmt.drop();
   console.log('_runHgbtPredictions - sqlStr : ', sqlStr);            

   var modelExists = results[0].ModelExists;
   console.log('_runHgbtPredictions - modelExists: ', modelExists);            

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
   
   
   hgbtFuncs._updateHgbtPredictionParamsV1 (req);
    
   hgbtFuncs._updateHgbtPredictionDataV1(req);

   hgbtFuncs._runPredictionHgbtGroupV1(req); 
  
}

exports._updateHgbtPredictionParamsV1 = function(req) {

    const hgbtPredictParams = req.data.predictionParameters;
    //console.log('mlrPredictParams: ', mlrPredictParams);         
  
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr = "DELETE FROM PAL_HGBT_PREDICT_PARAMETER_GRP_TAB";

    stmt=conn.prepare(sqlStr);
    //results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);

    var tableObj = [];	
        
    for (var i = 0; i < hgbtPredictParams.length; i++)
    {
        let groupId = hgbtPredictParams[i].groupId ;
        let paramName = hgbtPredictParams[i].paramName;
        let intVal =  hgbtPredictParams[i].intVal
        let doubleVal = hgbtPredictParams[i].doubleVal;
        let strVal = hgbtPredictParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);


    sqlStr = "INSERT INTO PAL_HGBT_PREDICT_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}

exports._updateHgbtPredictionDataV1 = function(req) {

    const hgbtPredictData = req.data.predictionData;
    var hgbtType = req.data.hgbtType;

    //console.log('_updateHgntGroupDataV1: ', hgbtPredictData);         



    var conn = hana.createConnection();

    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (hgbtType == 2)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_2T";
    else if (hgbtType == 3)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_3T";
    else if (hgbtType == 4)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_4T";
    else if (hgbtType == 5)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_5T";
    else if (hgbtType == 6)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_6T";
    else if (hgbtType == 7)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_7T";
    else if (hgbtType == 8)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_8T";
    else if (hgbtType == 9)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_9T";
    else if (hgbtType == 10)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_10T";
    else if (hgbtType == 11)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_11T";
    else if (hgbtType == 12)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid HgbtType":hgbtType});
        return;
    }

    stmt=conn.prepare(sqlStr);
//    results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	
    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, ID, groupId;
    for (var i = 0; i < hgbtPredictData.length; i++)
    {
        groupId = hgbtPredictData[i].groupId ;
        //ID = hgbtPredictData[i].id;
        //console.log('_updateMlrGroupData ', ID);
        ID = hgbtPredictData[i].ID;
        att1 = hgbtPredictData[i].att1;
        att2 =  hgbtPredictData[i].att2;
        if (hgbtType > 2)
            att3 = hgbtPredictData[i].att3;
        if (hgbtType > 3)
            att4 = hgbtPredictData[i].att4;
        if (hgbtType > 4)
            att5 = hgbtPredictData[i].att5;
        if (hgbtType > 5)
            att6 = hgbtPredictData[i].att6;
        if (hgbtType > 6)
            att7 = hgbtPredictData[i].att7;
        if (hgbtType > 7)
            att8 = hgbtPredictData[i].att8;
        if (hgbtType > 8)
            att9 = hgbtPredictData[i].att9;
        if (hgbtType > 9)
            att10 = hgbtPredictData[i].att10;
        if (hgbtType > 10)
            att11 = hgbtPredictData[i].att11;
        if (hgbtType > 11)
            att12 = hgbtPredictData[i].att12;
        var rowObj = [];
        if (hgbtType == 2)
            rowObj.push(groupId,ID,att1,att2);
        else if (hgbtType == 3)
            rowObj.push(groupId,ID,att1,att2,att3);
        else if (hgbtType == 4)
            rowObj.push(groupId,ID,att1,att2,att3,att4);
        else if (hgbtType == 5)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5);
        else if (hgbtType == 6)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6);
        else if (hgbtType == 7)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7);
        else if (hgbtType == 8)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8);
        else if (hgbtType == 9)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9);
        else if (hgbtType == 10)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10); 
        else if (hgbtType == 11)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11);    
        else if (hgbtType == 12)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12);    
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (hgbtType == 2)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_2T(GROUP_ID,ID,ATT1,ATT2) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (hgbtType == 3)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_3T(GROUP_ID,ID,ATT1,ATT2,ATT3) VALUES(?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 4)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_4T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4) VALUES(?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 5)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_5T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5) VALUES(?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 6)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_6T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6) VALUES(?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 7)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_7T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7) VALUES(?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }

    else if (hgbtType == 8)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_8T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8) VALUES(?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 9)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_9T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 10)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_10T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 11)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_11T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (hgbtType == 12)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_12T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,ATT12) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateHgbtPredictionDataV1 sqlStr ', sqlStr);

    console.log(' _updateHgbtPredictionDataV1 tableObj ', tableObj);


    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateHgbtPredictionDataV1 Completed ');
}

exports._runPredictionHgbtGroupV1 = function(req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var hgbtType = req.data.hgbtType;

    console.log('_runPredictionHgbtGroupV1 hgbtType : ', hgbtType);



    if (hgbtType == 2)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_2T";
    else if (hgbtType == 3)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_3T";
    else if (hgbtType == 4)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_4T";
    else if (hgbtType == 5)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_5T";
    else if (hgbtType == 6)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_6T";
    else if (hgbtType == 7)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_7T";
    else if (hgbtType == 8)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_8T";
    else if (hgbtType == 9)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_9T";
    else if (hgbtType == 10)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_10T";
    else if (hgbtType == 11)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_11T";
    else if (hgbtType == 12)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid HgbtType":hgbtType});
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

        console.log('PredictionHgbt Group: ', groupId);
        //predictionResults = predictionResults + _runHgbtPrediction(groupId);
        let predictionObj = hgbtFuncs._runHgbtPredictionV1(hgbtType, groupId);
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

exports._runHgbtPredictionV1 = function(hgbtType, group) {

    console.log('_runHgbtPredictionV1 - group', group);

    var conn = hana.createConnection();
 


    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var result=stmt.exec();
    stmt.drop();

    var groupId = group;
    
    let grpStr=groupId.split('#');
    let GroupId = grpStr[0];
    let location = grpStr[1];
    let product = grpStr[2];

    sqlStr = "create local temporary column table #PAL_HGBT_MODEL_TAB_"+ groupId + " " + 
                    "(\"ROW_INDEX\" INTEGER,\"TREE_INDEX\" INTEGER,\"MODEL_CONTENT\" NCLOB)"; // MEMORY THRESHOLD 1000)";


    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '#PAL_HGBT_MODEL_TAB_'+ groupId + ' SELECT "ROW_INDEX", "TREE_INDEX", "MODEL_CONTENT" FROM PAL_HGBT_MODEL_GRP_TAB WHERE PAL_HGBT_MODEL_GRP_TAB.GROUP_ID =' + "'" + groupId + "'";

    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
    var predDataObj = [];	

    if (hgbtType == 2)
    {
 
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2" FROM PAL_HGBT_PRED_DATA_GRP_TAB_2T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_2T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2" FROM PAL_HGBT_PRED_DATA_GRP_TAB_2T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_2T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        var predData = result;
        //console.log('predData :', predData);

        for (var i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            predDataObj.push({GroupId,id,att1,att2});
        }
    
    }
    else if(hgbtType == 3)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" FROM PAL_HGBT_PRED_DATA_GRP_TAB_3T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_3T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3" FROM PAL_HGBT_PRED_DATA_GRP_TAB_3T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_3T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        let predData =stmt.exec();
        stmt.drop();
        //var predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            predDataObj.push({GroupId,id,att1,att2,att3});
        }
    }
    else if(hgbtType == 4)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4" FROM PAL_HGBT_PRED_DATA_GRP_TAB_4T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_4T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4" FROM PAL_HGBT_PRED_DATA_GRP_TAB_4T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_4T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            predDataObj.push({GroupId,id,att1,att2,att3,att4});
        }
    }
    else if(hgbtType == 5)
    {
         sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5" FROM PAL_HGBT_PRED_DATA_GRP_TAB_5T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_5T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4" , "ATT5" FROM PAL_HGBT_PRED_DATA_GRP_TAB_5T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_5T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5});
        }
    }
    else if(hgbtType == 6)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" FROM PAL_HGBT_PRED_DATA_GRP_TAB_6T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6" FROM PAL_HGBT_PRED_DATA_GRP_TAB_6T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;


            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6});
        }
    }
    else if(hgbtType == 7)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7"FROM PAL_HGBT_PRED_DATA_GRP_TAB_7T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_7T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" FROM PAL_HGBT_PRED_DATA_GRP_TAB_7T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_7T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;


            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7});
        }
    }
    else if(hgbtType == 8)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" FROM PAL_HGBT_PRED_DATA_GRP_TAB_8T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_8T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" FROM PAL_HGBT_PRED_DATA_GRP_TAB_8T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_8T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;


            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8});
        }
    }
    else if(hgbtType == 9)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" FROM PAL_HGBT_PRED_DATA_GRP_TAB_9T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9" FROM PAL_HGBT_PRED_DATA_GRP_TAB_9T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            let att2 =  predData[i].ATT2;
            let att3 =  predData[i].ATT3;
            let att4 =  predData[i].ATT4;
            let att5 =  predData[i].ATT5;
            let att6 =  predData[i].ATT6;
            let att7 =  predData[i].ATT7;
            let att8 =  predData[i].ATT8;
            let att9 =  predData[i].ATT9;


            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9});
        }
    }
    else if(hgbtType == 10)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" , "ATT10" FROM PAL_HGBT_PRED_DATA_GRP_TAB_10T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_10T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9", "ATT10" FROM PAL_HGBT_PRED_DATA_GRP_TAB_10T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_10T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
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


            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10});
        }
    }
    else if(hgbtType == 11)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double,\"ATT11\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" , "ATT10", "ATT11" FROM PAL_HGBT_PRED_DATA_GRP_TAB_11T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_11T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9", "ATT10", "ATT11" FROM PAL_HGBT_PRED_DATA_GRP_TAB_11T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_11T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
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


            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11});
        }
    }
    else if(hgbtType == 12)
    {
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double,\"ATT11\" double,\"ATT12\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" , "ATT10", "ATT11", "ATT12" FROM PAL_HGBT_PRED_DATA_GRP_TAB_12T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_12T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9", "ATT10", "ATT11", "ATT12" FROM PAL_HGBT_PRED_DATA_GRP_TAB_12T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_12T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        let predData = result;
        //console.log('predData :', predData);

        for (let i=0; i<predData.length; i++) 
        {
            //let groupId =  groupId;
            let id =  predData[i].ID;
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

            predDataObj.push({GroupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12});
        }
    }
    else
    {
        console.log('_runHgbtPredictionV1 Invalid hgbtType ', hgbtType);
        return;
    }
    
    //console.log(result);

    sqlStr = "create local temporary column table #PAL_HGBT_PARAMETER_TAB_" + groupId + " " +
                        "(\"PARAM_NAME\" varchar(100),\"INT_VALUE\" integer,\"double_VALUE\" double,\"STRING_VALUE\" varchar(100))";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PARAMETER_TAB_' + groupId + ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_HGBT_PREDICT_PARAMETER_GRP_TAB WHERE PAL_HGBT_PREDICT_PARAMETER_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();


    sqlStr = ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_HGBT_PREDICT_PARAMETER_GRP_TAB WHERE PAL_HGBT_PREDICT_PARAMETER_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";
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


    sqlStr = "call _SYS_AFL.PAL_HGBT_PREDICT(" + "#PAL_HGBT_PREDICTDATA_TAB_" + groupId + "," + "#PAL_HGBT_MODEL_TAB_" + groupId + "," + "#PAL_HGBT_PARAMETER_TAB_" + groupId + "," + "?)";
    console.log('_runHgbtPredictionV1 hgbtType ', hgbtType);

    console.log('_runHgbtPredictionV1 sqlStr ', sqlStr);

    stmt=conn.prepare(sqlStr);
    let predictionResults=stmt.exec();
    stmt.drop();
    //console.log('Prediction Results ', predictionResults);

    // --------------- BEGIN --------------------

    
    var resultsObj = [];	
    for (let i=0; i<predictionResults.length; i++) 
    {
        let id = predictionResults[i].ID;
        let score =  predictionResults[i].SCORE;
        let confidence = predictionResults[i].CONFIDENCE;
    
        resultsObj.push({GroupId,id,score,confidence});
    }	

    var createtAtObj = new Date();
    //let idObj = groupId;
    let idObj = uuidv1();
    
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTPREDICTIONSV1'] }, entries: [
         {hgbtID: idObj, createdAt : createtAtObj.toISOString(), Location : location, Product : product, groupId : GroupId, predictionParameters:predParamsObj, hgbtType : hgbtType, predictionData : predDataObj, predictedResults : resultsObj}
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
        let predictedVal = resultsObj[index].score;
        predictedVal =  (+predictedVal).toFixed(2);
        let periodId = distPeriods[index][trimmedPeriod];
        sqlStr = 'UPDATE V_FUTURE_DEP_TS SET "Predicted" = ' + "'" + predictedVal + "'" + "," +
                 '"PredictedTime" = ' + "'" + predictedTime + "'" + "," +
                 '"PredictedStatus" = ' + "'" + 'SUCCESS' + "'"+ 
                 ' WHERE "GroupID" = ' + "'" + groupId + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)

        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    }
    conn.disconnect();

 
    let returnObj = [];	
    let createdAt = createtAtObj;
    let hgbtID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let predictedResults = resultsObj;
    returnObj.push({hgbtID, createdAt,predictionParameters,hgbtType,predictionData,predictedResults});

    return returnObj[0];
}
