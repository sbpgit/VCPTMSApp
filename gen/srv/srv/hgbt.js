const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');
const hgbtFuncs = require('./hgbt.js');


const conn_params = {
    serverNode  : process.env.classicalSchemaNodePort, 
    uid         : process.env.uidClassicalSchema, 
    pwd         : process.env.uidClassicalSchemaPassword,
    encrypt: 'TRUE'
};
const vcConfigTimePeriod = process.env.TimePeriod; 
const classicalSchema = process.env.classicalSchema; 

// const conn_params = {
//     serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
//     uid         : "SBPTECHTEAM", 
//     pwd         : "Sbpcorp@22",
//     encrypt: 'TRUE'
// };
// const classicalSchema = "DB_CONFIG_PROD_CLIENT1"; 
// const vcConfigTimePeriod = "PERIOD_NUM";

exports._runHgbtRegressionsV1 = async function(req) {


    hgbtFuncs._updateHgbtGroupParamsV1 (req);   
  
    hgbtFuncs._updateHgbtGroupDataV1(req);

    await hgbtFuncs._runRegressionHgbtGroupV1(req); 
  
}


exports._updateHgbtGroupParamsV1 = function(req) {
    const hgbtGroupParams = req.data.regressionParameters;

<<<<<<< HEAD
=======

>>>>>>> 5c47fee8306c663b65f101f8dcc80090bc7e677f
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
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
                inGroups.push(hgbtGroupParams[i].groupId);
            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = "DELETE FROM PAL_HGBT_PARAMETER_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
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

    sqlStr = "INSERT INTO PAL_HGBT_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}



exports._updateHgbtGroupDataV1 = function(req) {
    const hgbtGroupData = req.data.regressionData;

    var hgbtType = req.data.hgbtType;
    var modelVersion = req.data.modelVersion;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (hgbtType == 1)
        sqlStr = "DELETE FROM PAL_HGBT_DATA_GRP_TAB_1T";
    else if (hgbtType == 2)
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
    stmt.exec();
    stmt.drop();


    var tableObj = [];	

    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, target, groupId;
    for (var i = 0; i < hgbtGroupData.length; i++)
    {
        groupId = hgbtGroupData[i].groupId ;
        target = hgbtGroupData[i].target;

        att1 = hgbtGroupData[i].att1;
        if (hgbtType > 1)
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
        if (hgbtType == 1)
            rowObj.push(groupId,att1,target);
        else if (hgbtType == 2)
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
    if (hgbtType == 1)
    {
        sqlStr = "INSERT INTO PAL_HGBT_DATA_GRP_TAB_1T(GROUP_ID,ATT1,TARGET) VALUES(?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (hgbtType == 2)
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

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateHgbtGroupData Completed ');

}

exports._runRegressionHgbtGroupV1 = async function(req) {

    var hgbtType = req.data.hgbtType;
    var hgbtModelVersion = req.data.modelVersion;


    var hgbtDataTable;
    if (hgbtType == 1)
        hgbtDataTable = "PAL_HGBT_DATA_GRP_TAB_1T";
    else if (hgbtType == 2)
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


////////////////////////////////////////////////////////////////////////////////////
    const hgbtGroupParams = req.data.regressionParameters;

    let inGroups = [];
    let inGroup = hgbtGroupParams[0].groupId;
    inGroups.push(inGroup);
    for (var i in hgbtGroupParams)
    { 
        if (i > 0)
        {
            if( hgbtGroupParams[i].groupId != hgbtGroupParams[i-1].groupId)
            {
                inGroups.push(hgbtGroupParams[i].groupId);
            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {

        sqlStr = "DELETE FROM PAL_HGBT_MODEL_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  "DELETE FROM PAL_HGBT_IMP_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  "DELETE FROM PAL_HGBT_CONFUSION_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  "DELETE FROM PAL_HGBT_STATS_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        //console.log('_runRegressionHgbtGroup sqlStr', sqlStr);
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  "DELETE FROM PAL_HGBT_PARAM_SELECTION_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

    }

    if (hgbtType == 1)
        sqlStr = 'call HGBT_MAIN_1T(' + hgbtDataTable + ', ?,?,?,?,?)';
    else if (hgbtType == 2)
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

    stmt=conn.prepare(sqlStr);
    var modelResults=stmt.exec();
    stmt.drop();
    
  
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

    for (let i=0; i< importanceResults.length; i++)
    {     
        let groupId = importanceResults[i].GROUP_ID;
        let variableName = importanceResults[i].VARIABLE_NAME;
        let importance = importanceResults[i].IMPORTANCE;
        impObj.push({groupId,variableName,importance});
    }

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

    let cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTREGRESSIONSV1'] }, entries: [
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
        
    // commenting out from Memory usage Perspective
    // await cds.run(cqnQuery);

    regressionParameters = req.data.regressionParameters;

    inGroups = [];
    inGroup = regressionParameters[0].groupId;
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


    var tableObj = [];
    for (let grpIndex = 0; grpIndex < inGroups.length; grpIndex++)
    {
        let statsGroupObj = [];
        let paramsGroupObj = [];
        let impGroupObj = [];
        let paramSelectionGroupObj = [];

        
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
        
        let grpStr=inGroups[grpIndex].split('#');
        let profileID = grpStr[0]; 
        let type = grpStr[1];
        let GroupId = grpStr[2];
        let location = grpStr[3];
        let product = grpStr[4];


        var rowObj = {   hgbtGroupID: idObj, 
            createdAt : createtAtObj.toISOString(),
            Location : location,
            Product : product,
            groupId : GroupId,
            Type : type,
            modelVersion : hgbtModelVersion,
            profile : profileID,
            regressionParameters:paramsGroupObj, 
            hgbtType : req.data.hgbtType,
            importanceOp : impGroupObj,
            statisticsOp : statsGroupObj,
            paramSelectionOp : paramSelectionGroupObj};
        tableObj.push(rowObj);


        let objStr = GroupId;

        let lastIndex = objStr.lastIndexOf('_');
        let obj_dep = objStr.slice(0, lastIndex);

        let obj_counter = objStr.slice(lastIndex + 1);

        sqlStr = 'UPSERT "CP_OD_MODEL_VERSIONS" VALUES (' +
                    "'" + location + "'" + "," +
                    "'" + product + "'" + "," +
                    "'" + obj_dep + "'" + "," +
                    "'" + obj_counter + "'" + "," +
                    "'" + type + "'" + "," +
                    "'" + 'HGBT' + "'" + "," +
                    "'" + hgbtModelVersion + "'" + "," +
                    "'" + profileID  + "'" + ')' + ' WITH PRIMARY KEY';
            

        await cds.run(sqlStr);

    }



    cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTBYGROUP'] }, entries:  tableObj }};

    await cds.run(cqnQuery);
   


    let returnObj = [];	
    let createdAt = createtAtObj;
    let hgbtID = idObj; //uuidObj;
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


exports._runHgbtPredictionsV1 = async function(req) {
   var groupId = req.data.profile + '#' + req.data.Type + '#' + req.data.groupId + '#' + req.data.Location + '#' + req.data.Product;

   var conn = hana.createConnection();

   conn.connect(conn_params);

   var sqlStr = 'SET SCHEMA ' + classicalSchema;  
   var stmt=conn.prepare(sqlStr);
   var results=stmt.exec();
   stmt.drop();

   sqlStr = 'SELECT COUNT(DISTINCT "GROUP_ID") AS "ModelExists" FROM "PAL_HGBT_MODEL_GRP_TAB" WHERE "GROUP_ID" = ' + "'" + groupId + "'";
   stmt=conn.prepare(sqlStr);
   results = stmt.exec();
   stmt.drop();

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

   await hgbtFuncs._runPredictionHgbtGroupV1(req); 
  
}

exports._updateHgbtPredictionParamsV1 = function(req) {

    const hgbtPredictParams = req.data.predictionParameters;
  
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr = "DELETE FROM PAL_HGBT_PREDICT_PARAMETER_GRP_TAB";

    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

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

    sqlStr = "INSERT INTO PAL_HGBT_PREDICT_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}

exports._updateHgbtPredictionDataV1 = function(req) {

    const hgbtPredictData = req.data.predictionData;
    var hgbtType = req.data.hgbtType;

    var conn = hana.createConnection();

    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (hgbtType == 1)
        sqlStr = "DELETE FROM PAL_HGBT_PRED_DATA_GRP_TAB_1T";
    else if (hgbtType == 2)
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
    stmt.exec();
    stmt.drop();

    var tableObj = [];	
    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, ID, groupId;
    for (var i = 0; i < hgbtPredictData.length; i++)
    {
        groupId = hgbtPredictData[i].groupId ;
        ID = hgbtPredictData[i].ID;
        att1 = hgbtPredictData[i].att1;
        if (hgbtType > 1)
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
        if (hgbtType == 1)
            rowObj.push(groupId,ID,att1);
        else if (hgbtType == 2)
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
    if (hgbtType == 1)
    {
        sqlStr = "INSERT INTO PAL_HGBT_PRED_DATA_GRP_TAB_1T(GROUP_ID,ID,ATT1) VALUES(?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (hgbtType == 2)
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

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateHgbtPredictionDataV1 Completed ');
}

exports._runPredictionHgbtGroupV1 = async function(req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var hgbtType = req.data.hgbtType;
    var version = req.data.Version;
    var scenario = req.data.Scenario;
    var modelVersion = req.data.modelVersion;

    if (hgbtType == 1)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_HGBT_PRED_DATA_GRP_TAB_1T";
    else if (hgbtType == 2)
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

    var distinctGroups = results.length;
    
    var predResults = [];			
    for (var index=0; index<distinctGroups; index++)
    {     
        var groupId = results[index].GROUP_ID;

        let predictionObj = await hgbtFuncs._runHgbtPredictionV1(hgbtType, groupId, version, scenario,modelVersion);
        predResults.push(predictionObj);

        if (index == (distinctGroups -1))
        {
            let res = req._.req.res;
            res.send({"value":predResults});
            conn.disconnect();
        }
    }
}

exports._runHgbtPredictionV1 = async function(hgbtType, group, version, scenario, modelVersion) {


    var conn = hana.createConnection();
 


    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
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

    sqlStr = "create local temporary column table #PAL_HGBT_MODEL_TAB_"+ groupId + " " + 
                    "(\"ROW_INDEX\" INTEGER,\"TREE_INDEX\" INTEGER,\"MODEL_CONTENT\" NCLOB)"; // MEMORY THRESHOLD 1000)";


    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();

    sqlStr = 'INSERT INTO ' + '#PAL_HGBT_MODEL_TAB_'+ groupId + ' SELECT "ROW_INDEX", "TREE_INDEX", "MODEL_CONTENT" FROM PAL_HGBT_MODEL_GRP_TAB WHERE PAL_HGBT_MODEL_GRP_TAB.GROUP_ID =' + "'" + groupId + "'";

    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
    var predDataObj = [];	

    if (hgbtType == 1)
    {
 
        sqlStr = "create local temporary column table #PAL_HGBT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1" FROM PAL_HGBT_PRED_DATA_GRP_TAB_1T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_1T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1" FROM PAL_HGBT_PRED_DATA_GRP_TAB_1T WHERE PAL_HGBT_PRED_DATA_GRP_TAB_1T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        var predData = result;

        for (var i=0; i<predData.length; i++) 
        {
            let id =  predData[i].ID;
            let att1 =  predData[i].ATT1;
            predDataObj.push({GroupId,id,att1});
        }
    
    }
    else if (hgbtType == 2)
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

        for (var i=0; i<predData.length; i++) 
        {
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


        for (let i=0; i<predData.length; i++) 
        {
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

        for (let i=0; i<predData.length; i++) 
        {
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

        for (let i=0; i<predData.length; i++) 
        {
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

        for (let i=0; i<predData.length; i++) 
        {
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

        for (let i=0; i<predData.length; i++) 
        {
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
        for (let i=0; i<predData.length; i++) 
        {
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

        for (let i=0; i<predData.length; i++) 
        {
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
    

    sqlStr = "create local temporary column table #PAL_HGBT_PARAMETER_TAB_" + groupId + " " +
                        "(\"PARAM_NAME\" varchar(100),\"INT_VALUE\" integer,\"double_VALUE\" double,\"STRING_VALUE\" varchar(100))";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();

    sqlStr = 'INSERT INTO ' + '#PAL_HGBT_PARAMETER_TAB_' + groupId + ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_HGBT_PREDICT_PARAMETER_GRP_TAB WHERE PAL_HGBT_PREDICT_PARAMETER_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();


    sqlStr = ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_HGBT_PREDICT_PARAMETER_GRP_TAB WHERE PAL_HGBT_PREDICT_PARAMETER_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    var predParams = result;

    var predParamsObj = [];	
    for (let i=0; i<predParams.length; i++) 
    {
        let paramName =  predParams[i].PARAM_NAME;
        let intVal =  predParams[i].INT_VALUE;
        let doubleVal =  predParams[i].DOUBLE_VALUE;
        let strVal =  predParams[i].STRING_VALUE;

        predParamsObj.push({GroupId,paramName,intVal,doubleVal,strVal});
    }


    sqlStr = "call _SYS_AFL.PAL_HGBT_PREDICT(" + "#PAL_HGBT_PREDICTDATA_TAB_" + groupId + "," + "#PAL_HGBT_MODEL_TAB_" + groupId + "," + "#PAL_HGBT_PARAMETER_TAB_" + groupId + "," + "?)";

    console.log('_runHgbtPredictionV1 sqlStr ', sqlStr);

    stmt=conn.prepare(sqlStr);
    let predictionResults=stmt.exec();
    stmt.drop();
    // console.log('Prediction Results ', predictionResults);

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
    

    conn.disconnect();



    let tpGrpStr=groupId.split('#');
    tpGroupId = tpGrpStr[2] + '#' + tpGrpStr[3] + '#' + tpGrpStr[4];

    sqlStr = 'SELECT DISTINCT ' + '"' + vcConfigTimePeriod + '"' + 
            ' from  V_FUTURE_DEP_TS WHERE  "GroupID" = ' + "'" + tpGroupId + "'" + 
            ' AND "Type" = ' + "'" + odType + "'" +
            ' AND "VERSION" = ' + "'" + version + "'" +
            ' AND "SCENARIO" = ' + "'" + scenario + "'" +
            ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';
    var distPeriods = await cds.run(sqlStr);
    // console.log("Time Periods for Group :", tpGroupId, " Results: ", distPeriods, "periods#",distPeriods.length, "resultsObj Length ",resultsObj.length);
    var predictedTime = new Date().toISOString();
    var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');

    for (var index=0; index <resultsObj.length; index++)

    {     
        let predictedVal = resultsObj[index].score;
        predictedVal =  (+predictedVal).toFixed(2);
        let periodId = distPeriods[index][trimmedPeriod];
 
        sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", "Type", "OBJ_DEP", "OBJ_COUNTER", "OrderQuantity", "VERSION", "SCENARIO" ' +
                    'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + tpGroupId + "'" + 
                    ' AND "Type" = ' + "'" + odType + "'" +
                    ' AND "VERSION" = ' + "'" + version + "'" +
                    ' AND "SCENARIO" = ' + "'" + scenario + "'" +
                    ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";

        let result = await cds.run(sqlStr);

        if (result.length > 0)
        {
            sqlStr = 'UPSERT "CP_TS_PREDICTIONS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
                        "'" + result[0].Location + "'" + "," +
                        "'" + result[0].Product + "'" + "," +
                        "'" + result[0].Type + "'" + "," +
                        "'" + result[0].OBJ_DEP + "'" + "," +
                        "'" + result[0].OBJ_COUNTER + "'" + "," +
                        "'" + 'HGBT' + "'" + "," +
                        "'" + modelVersion  + "'" + "," +
                        "'" + profileId  + "'" + "," +
                        "'" + result[0].VERSION + "'" + "," +
                        "'" + result[0].SCENARIO + "'" + "," + 
                        "'" + predictedVal * result[0].OrderQuantity + "'" + "," +
                        "'" + predictedTime + "'" + "," +
                        "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
                

            try {
                await cds.run(sqlStr);
            }
            catch (exception) {
                console.log("sqlStr ", sqlStr, "index = ", index, "periodId : ",periodId, "predictedVal : ", predictedVal);
                throw new Error(exception.toString());
            }


            if(modelVersion == 'Active')
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
                        "'" + predictedVal * result[0].OrderQuantity + "'" + "," +
                        "'" + predictedTime + "'" + "," +
                        "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
                
    

                try {
                    await cds.run(sqlStr);
                }
                catch (exception) {
                    console.log("sqlStr ", sqlStr, "index = ", index, "periodId : ",periodId, "predictedVal : ", predictedVal);
                    throw new Error(exception.toString());
                }

            }
        }

    }

    var conn = hana.createConnection();
    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
 
    // Extract Importance
    sqlStr = 'SELECT "GROUP_ID", "VARIABLE_NAME", "IMPORTANCE" FROM PAL_HGBT_IMP_GRP_TAB' +
                 ' WHERE "GROUP_ID" = ' + "'" + groupId + "'";

    var stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();

    conn.disconnect();

 
    var w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12 = 0;

    for (let index=0; index<result.length; index++)
    {
   
        if (result[index].VARIABLE_NAME == 'ATT1')
            w1 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT2')
            w2 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT3')
            w3 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT4')
            w4 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT5')
            w5 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT6')
            w6 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT7')
            w7 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT8')
            w8 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT9')
            w9 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT10')
            w10 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT11')
            w11 = result[index].IMPORTANCE;
        else if (result[index].VARIABLE_NAME == 'ATT12')
            w12 = result[index].IMPORTANCE;
    }


    for (let pIndex=0; pIndex<resultsObj.length; pIndex++)
    {     
        let predictedVal = resultsObj[pIndex].score;
        predictedVal = ( +predictedVal).toFixed(2);
        let periodId = distPeriods[pIndex][trimmedPeriod];

        sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", ' +
                 '"Type", "OBJ_DEP", "OBJ_COUNTER", "ROW_ID", "CharCount", "CharCountPercent", "VERSION", "SCENARIO" ' +
                'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + tpGroupId + "'" + 
                ' AND "Type" = ' + "'" + odType + "'" + 
                ' AND "VERSION" = ' + "'" + version + "'" +
                ' AND "SCENARIO" = ' + "'" + scenario + "'" +
                ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";

        let sqlStrTemp = sqlStr;
        result = [];


        result = await cds.run(sqlStr);
    
        var orderCount = 0;
        for (let rIndex = 0; rIndex < result.length; rIndex++)
        {
            let impact_val = impact_percent = 0;
            
            if (result[rIndex].ROW_ID == 1)
            {
                impact_percent = w1*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }
            else if (result[rIndex].ROW_ID == 2)
            {
                impact_percent = w2*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 3)
            {
                impact_percent = w3*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 4)
            {
                impact_percent = w4*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 5)
            {
                impact_percent = w5*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 6)
            {
                impact_percent = w6*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 7)
            {
                impact_percent = w7*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 8)
            {
                impact_percent = w8*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 9)
            {
                impact_percent = w9*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 10)
            {
                impact_percent = w10*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 11)
            {
                impact_percent = w11*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 12)
            {
                impact_percent = w12*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }
            let predicted = predictedVal;
            let impactValPercent = 0;
            if( predicted*orderCount > 0 )
            {
                impactValPercent = 100*impact_val/(predicted*orderCount);
            }
            else
            {
                impactValPercent = 0;
            }

            if ( (impactValPercent >= 0) &&
                 (impact_val >=0) )
            {
                sqlStr = 'UPSERT "CP_TS_OBJDEP_CHAR_IMPACT_F" VALUES (' + "'" + result[rIndex].CAL_DATE + "'" + "," +
                    "'" + result[rIndex].Location + "'" + "," +
                    "'" + result[rIndex].Product + "'" + "," +
                    "'" + result[rIndex].Type + "'" + "," +
                    "'" + result[rIndex].OBJ_DEP + "'" + "," +
                    "'" + result[rIndex].OBJ_COUNTER + "'" + "," +
                    "'" + result[rIndex].ROW_ID + "'" + "," +
                    "'" + 'HGBT' + "'" + "," +
                    "'" + modelVersion  + "'" + "," +
                    "'" + profileId  + "'" + "," +
                    "'" + result[rIndex].VERSION + "'" + "," +
                    "'" + result[rIndex].SCENARIO + "'" + "," +
                    "'" + result[rIndex].CharCount + "'" + "," +
                    "'" + impact_val + "'" + "," +
                    "'" + impactValPercent + "'" + "," +
                    "'" + predicted*orderCount + "'" + "," +
                    "'" + predictedTime + "'" + ')' + ' WITH PRIMARY KEY';

                try {
                    await cds.run(sqlStr);
                }
                catch (exception) {
                    console.log("ERROR -- CP_TS_OBJDEP_CHAR_IMPACT_F HGBT UPSERT sqlStr ", sqlStr); 
                    throw new Error(exception.toString());
                }
            }
  
        }
  

    }

    let returnObj = [];	
    let createdAt = createtAtObj;
    let hgbtID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let predictedResults = resultsObj;
    returnObj.push({hgbtID, createdAt,predictionParameters,hgbtType,predictionData,predictedResults});

    return returnObj[0];
}
