const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');
const ahcFuncs = require('./ahc.js');


const conn_params = {
    serverNode  : process.env.classicalSchemaNodePort, 
    uid         : process.env.uidClassicalSchema, 
    pwd         : process.env.uidClassicalSchemaPassword,
    encrypt: 'TRUE'
};
const classicalSchema = process.env.classicalSchema; 

// const conn_params = {
//     serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
//     uid         : "SBPTECHTEAM", 
//     pwd         : "Sbpcorp@22",
//     encrypt: 'TRUE'
// };
// const classicalSchema = "DB_CONFIG_PROD_CLIENT1"; 
// const vcConfigTimePeriod = "PERIOD_NUM";

exports._runAhcClusters = async function(req) {

    // console.log("_runAhcClusters data ",req.data);

    ahcFuncs._updateAhcGroupParams(req);   
  
    ahcFuncs._updateAhcGroupData(req);

    await ahcFuncs._runAhClustersGroup(req); 
  
}


exports._updateAhcGroupParams = function(req) {
    const ahcGroupParams = req.data.clusterParameters;

    // console.log("_updateAhcGroupParams ",ahcGroupParams );
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

// ---------- BEGIN OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS
    let inGroups = [];
    let clusterGroup = ahcGroupParams[0].groupId;
    inGroups.push(clusterGroup);
    for (var i in ahcGroupParams)
    { 
        if (i > 0)
        {
            if( ahcGroupParams[i].groupId != ahcGroupParams[i-1].groupId)
            {
                inGroups.push(ahcGroupParams[i].groupId);
            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = "DELETE FROM PAL_AHC_PARAMETER_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

    }
// ---------- END OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS

    var tableObj = [];	
        
    for (let i = 0; i < ahcGroupParams.length; i++)
    {
        let groupId = ahcGroupParams[i].groupId ;
        let paramName = ahcGroupParams[i].paramName;
        let intVal =  ahcGroupParams[i].intVal
        let doubleVal = ahcGroupParams[i].doubleVal;
        let strVal = ahcGroupParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
        
    }

    sqlStr = "INSERT INTO PAL_AHC_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}



exports._updateAhcGroupData = function(req) {
    const ahcGroupData = req.data.clusterData;

    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
    sqlStr =  "DELETE FROM PAL_AHC_DATA_GRP_TAB_T";

    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();


    var tableObj = [];	

    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12 = 'NA';
    let ID, groupId;
    for (var i = 0; i < ahcGroupData.length; i++)
    {
        groupId = ahcGroupData[i].groupId ;
        ID = ahcGroupData[i].ID;

        att1 = ahcGroupData[i].att1;
        att2 = ahcGroupData[i].att2;
        att3 = ahcGroupData[i].att3;
        att4 = ahcGroupData[i].att4;
        att5 = ahcGroupData[i].att5;
        att6 = ahcGroupData[i].att6;
        att7 = ahcGroupData[i].att7;
        att8 = ahcGroupData[i].att8;
        att9 = ahcGroupData[i].att9;
        att10 = ahcGroupData[i].att10;
        att11 = ahcGroupData[i].att11;
        att12 = ahcGroupData[i].att12;

        var rowObj = [];
        rowObj.push(groupId,ID, att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12);

        tableObj.push(rowObj);
    }
    sqlStr = "INSERT INTO PAL_AHC_DATA_GRP_TAB_T(GROUP_ID,ID,C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
    stmt = conn.prepare(sqlStr);

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateAhcGroupData Completed ');

}

exports._runAhClustersGroup = async function(req) {


    var ahcDataTable = "PAL_AHC_DATA_GRP_TAB_T";
    
    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();


////////////////////////////////////////////////////////////////////////////////////
    const ahcGroupParams = req.data.clusterParameters;
    const ahcGroupData = req.data.clusterData;


    let inGroups = [];
    let inGroup = ahcGroupParams[0].groupId;
    inGroups.push(inGroup);
    for (var i in ahcGroupParams)
    { 
        if (i > 0)
        {
            if( ahcGroupParams[i].groupId != ahcGroupParams[i-1].groupId)
            {
                inGroups.push(ahcGroupParams[i].groupId);
            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {

        sqlStr = "DELETE FROM PAL_AHC_COMBINE_PROCESS_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

        sqlStr =  "DELETE FROM PAL_AHC_RESULTS_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

    }

    sqlStr = 'call AHC_MAIN_T(' + ahcDataTable + ', ?,?)';

    
    stmt=conn.prepare(sqlStr);
    // combined process Results
    var cpResults=stmt.exec();
    stmt.drop();
    
  
    // var cpGroups = [];
    // var cpGroup = cpResults[0].GROUP_ID;
    // cpGroups.push(cpGroup);
    // for (var i in cpResults)
    // { 
    //     if (i > 0)
    //     {
    //         if( cpResults[i].GROUP_ID != cpResults[i-1].GROUP_ID)
    //         {
    //             cpGroups.push(cpResults[i].GROUP_ID);
    //         }
    //     }
    // }

    let cpTableObj = [];

    for (let i=0; i< cpResults.length; i++)
    {     
        let groupId = cpResults[i].GROUP_ID;
        let STAGE = cpResults[i].STAGE;
        let LEFT_ID = cpResults[i].LEFT_ID;
        let RIGHT_ID = cpResults[i].RIGHT_ID;
        let DISTANCE = cpResults[i].DISTANCE;

        let grpStr=groupId.split('#');
        let MODEL_PROFILE = grpStr[0]; 
        let LOCATION_ID = grpStr[1];
        let PRODUCT_ID = grpStr[2];
        // cpTableObj.push({location,product,profileID,GroupId,stage,leftId,rightId,distance});
        cpTableObj.push({LOCATION_ID,PRODUCT_ID,MODEL_PROFILE,STAGE,LEFT_ID,RIGHT_ID,DISTANCE});


        let sqlStr = 'DELETE FROM CP_AHC_COMBINE_PROCESS WHERE ' +
                     ' LOCATION_ID = ' + "'" + LOCATION_ID + "'" + ' AND ' +
                     ' PRODUCT_ID = ' + "'" + PRODUCT_ID + "'"+ ' AND ' +
                     ' MODEL_PROFILE = ' + "'" + MODEL_PROFILE + "'";
        await cds.run(sqlStr);

    }
    // console.log(" cpTableObj ", cpTableObj);
    let cqnQuery = {INSERT:{ into: { ref: ['CP_AHC_COMBINE_PROCESS'] }, entries:  cpTableObj }};

    await cds.run(cqnQuery);

    var clustersTableObj = [];

    sqlStr =  'SELECT * FROM PAL_AHC_RESULTS_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + ahcDataTable + ')';

    stmt=conn.prepare(sqlStr);
    let clusterResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< clusterResults.length; i++)
    {     
        let groupId = clusterResults[i].GROUP_ID;
        let UNIQUE_ID = clusterResults[i].ID;
        let CLUSTER_ID = clusterResults[i].CLUSTER_ID;

        let grpStr=groupId.split('#');

        let MODEL_PROFILE = grpStr[0]; 
        let LOCATION_ID = grpStr[1];
        let PRODUCT_ID = grpStr[2];
        
        clustersTableObj.push({LOCATION_ID,PRODUCT_ID,MODEL_PROFILE,UNIQUE_ID,CLUSTER_ID});

        let sqlStr = 'DELETE FROM CP_AHC_RESULTS WHERE ' +
                     ' LOCATION_ID = ' + "'" + LOCATION_ID + "'" + ' AND ' +
                     ' PRODUCT_ID = ' + "'" + PRODUCT_ID + "'" + ' AND ' +
                     ' MODEL_PROFILE = ' + "'" + MODEL_PROFILE + "'";
        await cds.run(sqlStr);
    }

    cqnQuery = {INSERT:{ into: { ref: ['CP_AHC_RESULTS'] }, entries:  clustersTableObj }};

    await cds.run(cqnQuery);
   
    let createtAtObj = new Date();
    let idObj = uuidv1();

    let returnObj = [];	
    let createdAt = createtAtObj;
    let clustersID = idObj; //uuidObj;
    returnObj.push({clustersID, createdAt,ahcGroupParams,ahcGroupData});
    var res = req._.req.res;
    res.send({"value":returnObj});

    console.log('Completed Agglomerate Clusters Generation for Groups Successfully');

    conn.disconnect(function(err) {
    if (err) throw err;
    console.log('disconnected');
    });

}