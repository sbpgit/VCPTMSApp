const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
    
const hana = require('@sap/hana-client');
const rtdFuncs = require('./rdt-functions.js');

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

exports._runRdtRegressions = function(req) {

    rtdFuncs._updateRdtGroupParams (req);   
    rtdFuncs._updateRdtGroupData(req);
    rtdFuncs._runRegressionRdtGroup(req); 
 }

exports._updateRdtGroupParams = function(req) {

    const rdtGroupParams = req.data.regressionParameters;

    console.log('_updateRdtGroupParams: ', rdtGroupParams);         


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

// ---------- BEGIN OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS
    let inGroups = [];
    let modelGroup = rdtGroupParams[0].groupId;
    inGroups.push(modelGroup);
    for (var i in rdtGroupParams)
    { 
        if (i > 0)
        {
            if( rdtGroupParams[i].groupId != rdtGroupParams[i-1].groupId)
            {
               // inGroups.push(rdtGroupParams[i].GROUP_ID);
                inGroups.push(rdtGroupParams[i].groupId);
            }
        }
    }
    for (let i = 0; i < inGroups.length; i++)
    {
        sqlStr = "DELETE FROM PAL_RDT_PARAMETER_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        //console.log('_updateRdtGroupParams sqlStr ', sqlStr);
        stmt=conn.prepare(sqlStr);
        //result=stmt.exec();
        stmt.exec();
        stmt.drop();

    }
// ---------- END OF DELETE EXISTING PARAMETERS FOR PROVISIONED GROUPS

    var tableObj = [];	
        
    for (let i = 0; i < rdtGroupParams.length; i++)
    {
        let groupId = rdtGroupParams[i].groupId ;
        let paramName = rdtGroupParams[i].paramName;
        let intVal =  rdtGroupParams[i].intVal
        let doubleVal = rdtGroupParams[i].doubleVal;
        let strVal = rdtGroupParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
        
    }
    //console.log(' tableObj ', tableObj);

    sqlStr = "INSERT INTO PAL_RDT_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}



exports._updateRdtGroupData = function(req) {

    const rdtGroupData = req.data.regressionData;

    var rdtType = req.data.rdtType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (rdtType == 1)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_1T";
    else if (rdtType == 2)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_2T";
    else if (rdtType == 3)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_3T";
    else if (rdtType == 4)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_4T";
    else if (rdtType == 5)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_5T";
    else if (rdtType == 6)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_6T";
    else if (rdtType == 7)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_7T";
    else if (rdtType == 8)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_8T";
    else if (rdtType == 9)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_9T";
    else if (rdtType == 10)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_10T";
    else if (rdtType == 11)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_11T";
    else if (rdtType == 12)
        sqlStr = "DELETE FROM PAL_RDT_DATA_GRP_TAB_12T";
    
    else
    {
        var res = req._.req.res;
        res.send({"Invalid RdtType":rdtType});
        return;
    }

    stmt=conn.prepare(sqlStr);
    // let results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	

    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, target, groupId;
    for (var i = 0; i < rdtGroupData.length; i++)
    {
        groupId = rdtGroupData[i].groupId ;
        target = rdtGroupData[i].target;
        //console.log('_updaterdtGroupData ', ID);

        att1 = rdtGroupData[i].att1;
        if (rdtType > 1)
            att2 =  rdtGroupData[i].att2;
        if (rdtType > 2)
            att3 = rdtGroupData[i].att3;
        if (rdtType > 3)
            att4 = rdtGroupData[i].att4;
        if (rdtType > 4)
            att5 = rdtGroupData[i].att5;
        if (rdtType > 5)
            att6 = rdtGroupData[i].att6;
        if (rdtType > 6)
            att7 = rdtGroupData[i].att7;
        if (rdtType > 7)
            att8 = rdtGroupData[i].att8;
        if (rdtType > 8)
            att9 = rdtGroupData[i].att9;
        if (rdtType > 9)
            att10 = rdtGroupData[i].att10;
        if (rdtType > 10)
            att11 = rdtGroupData[i].att11;
        if (rdtType > 11)
            att12 = rdtGroupData[i].att12;

        var rowObj = [];
        if (rdtType == 1)
            rowObj.push(groupId,att1,target);
        else if (rdtType == 2)
            rowObj.push(groupId,att1,att2,target);
        else if (rdtType == 3)
            rowObj.push(groupId,att1,att2,att3,target);
        else if (rdtType == 4)
            rowObj.push(groupId,att1,att2,att3,att4,target);
        else if (rdtType == 5)
            rowObj.push(groupId,att1,att2,att3,att4,att5,target);
        else if (rdtType == 6)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,target);
        else if (rdtType == 7)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,target);
        else if (rdtType == 8)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,target);
        else if (rdtType == 9)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,target);
        else if (rdtType == 10)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,target);
        else if (rdtType == 11)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11, target);
        else if (rdtType == 12)
            rowObj.push(groupId,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12,target);

        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (rdtType == 1)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_1T(GROUP_ID,ATT1,TARGET) VALUES(?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (rdtType == 2)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_2T(GROUP_ID,ATT1,ATT2,TARGET) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (rdtType == 3)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_3T(GROUP_ID,ATT1,ATT2,ATT3,TARGET) VALUES(?, ?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 4)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_4T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,TARGET) VALUES(?, ?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 5)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_5T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,TARGET) VALUES(?, ?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 6)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_6T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 7)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_7T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 8)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_8T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 9)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_9T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 10)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_10T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 11)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_11T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 12)
    {
        sqlStr = "INSERT INTO PAL_RDT_DATA_GRP_TAB_12T(GROUP_ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,ATT12,TARGET) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateRdtGroupData sqlStr ', sqlStr);

    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateRdtGroupData Completed ');

}

exports._runRegressionRdtGroup = function(req) {

    console.log('Executing RDT Regression at GROUP');
    var rdtType = req.data.rdtType;
    var rdtDataTable;
    if (rdtType == 1)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_1T";
    else if (rdtType == 2)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_2T";
    else if (rdtType == 3)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_3T";
    else if (rdtType == 4)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_4T";
    else if (rdtType == 5)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_5T";
    else if (rdtType == 6)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_6T";
    else if (rdtType == 7)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_7T";
    else if (rdtType == 8)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_8T";
    else if (rdtType == 9)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_9T";
    else if (rdtType == 10)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_10T";
    else if (rdtType == 11)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_11T";
    else if (rdtType == 12)
        rdtDataTable = "PAL_RDT_DATA_GRP_TAB_12T";
    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    //var groupId = group;
    sqlStr = 'DELETE FROM PAL_RDT_MODEL_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_RDT_IMP_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_RDT_OUT_OF_BAG_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    //console.log('_runRegressionRdtGroup sqlStr', sqlStr);
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM PAL_RDT_CONFUSION_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (rdtType == 1)
        sqlStr = 'call RDT_MAIN_1T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 2)
        sqlStr = 'call RDT_MAIN_2T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 3)
        sqlStr = 'call RDT_MAIN_3T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 4)
        sqlStr = 'call RDT_MAIN_4T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 5)
        sqlStr = 'call RDT_MAIN_5T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 6)
        sqlStr = 'call RDT_MAIN_6T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 7)
        sqlStr = 'call RDT_MAIN_7T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 8)
        sqlStr = 'call RDT_MAIN_8T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 9)
        sqlStr = 'call RDT_MAIN_9T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 10)
        sqlStr = 'call RDT_MAIN_10T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 11)
        sqlStr = 'call RDT_MAIN_11T(' + rdtDataTable + ', ?,?,?,?)';
    else if (rdtType == 12)
        sqlStr = 'call RDT_MAIN_12T(' + rdtDataTable + ', ?,?,?,?)';
    console.log('_runRegressionRdtGroup sqlStr',sqlStr);

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

    sqlStr =  'SELECT * FROM PAL_RDT_IMP_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';

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

    var outOfBagObj = [];

    sqlStr =  'SELECT * FROM PAL_RDT_OUT_OF_BAG_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';

    stmt=conn.prepare(sqlStr);
    let outOfBagResults = stmt.exec();
    stmt.drop();

    for (let i=0; i< outOfBagResults.length; i++)
    {     
        let groupId = outOfBagResults[i].GROUP_ID;
        let treeIndex = outOfBagResults[i].TREE_INDEX;
        let error = outOfBagResults[i].ERROR;
        outOfBagObj.push({groupId,treeIndex,error});
    }


    var createtAtObj = new Date();
    var idObj = uuidv1();
    console.log("_runRegressionRdtGroup location ", req.data.Location, " product ", req.data.Product);

    let cqnQuery = {INSERT:{ into: { ref: ['CP_PALRDTREGRESSIONS'] }, entries: [
        //  {   ID: idObj, createdAt : createtAtObj, 
        {   rdtID: idObj, 
            createdAt : createtAtObj.toISOString(), //2021-12-14T12:00:35.940Z', //new Date(),
            Location : req.data.Location,
            Product : req.data.Product,
            regressionParameters:req.data.regressionParameters, 
            rdtType : req.data.rdtType,
            regressionData : req.data.regressionData, 
            modelsOp : modelsObj,
            importanceOp : impObj,
            outOfBagOp : outOfBagObj}
        ]}}
        
        
    console.log("CP_PALRDTREGRESSIONS cqnQuery Start " , new Date());

    cds.run(cqnQuery);
    console.log("CP_PALRDTREGRESSIONS cqnQuery Completed " , new Date());


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
        let outOfBagGroupObj = [];
        let paramsGroupObj = [];
        let impGroupObj = [];
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

        for (let i=0; i< outOfBagResults.length; i++)
        {     
            if (inGroups[grpIndex] == outOfBagResults[i].GROUP_ID)
            {
                let treeIndex = outOfBagResults[i].TREE_INDEX;
                let error = outOfBagResults[i].ERROR;
                outOfBagGroupObj.push({treeIndex,error});
            }
        }

        let grpStr=inGroups[grpIndex].split('#');
        let GroupId = grpStr[0];
        let location = grpStr[1];
        let product = grpStr[2];

        console.log("_runRegressionRdtGroup  grpStr ", grpStr, "GroupId ",GroupId, " location ", location, " product ", product);

        var rowObj = {   rdtGroupID: idObj, 
            //createdAt : createtAtObj, 
            createdAt : createtAtObj.toISOString(),
            Location : location,
            Product : product,
            groupId : GroupId,
            regressionParameters:paramsGroupObj, 
            rdtType : req.data.rdtType,
            importanceOp : impGroupObj,
            outOfBagOp : outOfBagGroupObj};
        tableObj.push(rowObj);
    }


    cqnQuery = {INSERT:{ into: { ref: ['CP_PALRDTBYGROUP'] }, entries:  tableObj }};
//    console.log("CP_PALRDTBYGROUP cQnQuery " , cqnQuery);

    console.log("CP_PALRDTBYGROUP cqnQuery Start " , new Date());
    cds.run(cqnQuery);
    console.log("CP_PALRDTBYGROUP cqnQuery Completed " , new Date());

    let returnObj = [];	
    let createdAt = createtAtObj;
    let rdtID = idObj; //uuidObj;
    let regressionData = req.data.regressionData;
    let modelsOp = modelsObj;
    let importanceOp = impObj;
    let outOfBagOp = outOfBagObj;
    returnObj.push({rdtID, createdAt,regressionParameters,regressionData,modelsOp, importanceOp,outOfBagOp});

    var res = req._.req.res;
    res.send({"value":returnObj});

    console.log('Completed RDT Regression Models Generation for Groups Successfully');

    conn.disconnect(function(err) {
    if (err) throw err;
    console.log('disconnected');
    });

}


exports._runRdtPredictions = function(req) {

  // var groupId = req.data.groupId;

   var groupId = req.data.groupId + '#' + req.data.Location + '#' + req.data.Product;
   //var outputGroupId = req.data.groupId;

   var conn = hana.createConnection();

   conn.connect(conn_params);

   var sqlStr = 'SET SCHEMA ' + classicalSchema;  
   // console.log('sqlStr: ', sqlStr);            
   var stmt=conn.prepare(sqlStr);
   var results=stmt.exec();
   stmt.drop();

   sqlStr = 'SELECT COUNT(DISTINCT "GROUP_ID") AS "ModelExists" FROM "PAL_RDT_MODEL_GRP_TAB" WHERE "GROUP_ID" = ' + "'" + groupId + "'";
   stmt=conn.prepare(sqlStr);
   results = stmt.exec();
   stmt.drop();
   console.log('_runRdtPredictions - sqlStr : ', sqlStr);            

   var modelExists = results[0].ModelExists;
   console.log('_runRdtPredictions - modelExists: ', modelExists);            

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
   
   
   rtdFuncs._updateRdtPredictionParams (req);
    
   rtdFuncs._updateRdtPredictionData(req);

   rtdFuncs._runPredictionRdtGroup(req); 
  
}

exports._updateRdtPredictionParams = function(req) {


    const rdtPredictParams = req.data.predictionParameters;
    //console.log('mlrPredictParams: ', mlrPredictParams);         
  
    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr = "DELETE FROM PAL_RDT_PREDICT_PARAMETER_GRP_TAB";

    stmt=conn.prepare(sqlStr);
    //results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);

    var tableObj = [];	
        
    for (var i = 0; i < rdtPredictParams.length; i++)
    {
        let groupId = rdtPredictParams[i].groupId ;
        let paramName = rdtPredictParams[i].paramName;
        let intVal =  rdtPredictParams[i].intVal
        let doubleVal = rdtPredictParams[i].doubleVal;
        let strVal = rdtPredictParams[i].strVal;
        var rowObj = [];
        rowObj.push(groupId,paramName,intVal,doubleVal,strVal);
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);


    sqlStr = "INSERT INTO PAL_RDT_PREDICT_PARAMETER_GRP_TAB(GROUP_ID,PARAM_NAME, INT_VALUE, DOUBLE_VALUE, STRING_VALUE) VALUES(?, ?, ?, ?, ?)";
    stmt = conn.prepare(sqlStr);
    stmt.execBatch(tableObj);
    stmt.drop();

    conn.disconnect();
}

exports._updateRdtPredictionData = function(req) {


    const rdtPredictData = req.data.predictionData;
    var rdtType = req.data.rdtType;

    //console.log('_updateHgntGroupData: ', rdtPredictData);         



    var conn = hana.createConnection();

    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (rdtType == 1)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_1T";
    else if (rdtType == 2)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_2T";
    else if (rdtType == 3)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_3T";
    else if (rdtType == 4)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_4T";
    else if (rdtType == 5)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_5T";
    else if (rdtType == 6)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_6T";
    else if (rdtType == 7)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_7T";
    else if (rdtType == 8)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_8T";
    else if (rdtType == 9)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_9T";
    else if (rdtType == 10)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_10T";
    else if (rdtType == 11)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_11T";
    else if (rdtType == 12)
        sqlStr = "DELETE FROM PAL_RDT_PRED_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid RdtType":rdtType});
        return;
    }

    stmt=conn.prepare(sqlStr);
//    results=stmt.exec();
    stmt.exec();
    stmt.drop();
    //console.log(results);


    var tableObj = [];	
    
    let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, ID, groupId;
    for (var i = 0; i < rdtPredictData.length; i++)
    {
        groupId = rdtPredictData[i].groupId ;
        //ID = rdtPredictData[i].id;
        //console.log('_updateMlrGroupData ', ID);
        ID = rdtPredictData[i].ID;
        att1 = rdtPredictData[i].att1;
        if (rdtType > 1)
            att2 =  rdtPredictData[i].att2;
        if (rdtType > 2)
            att3 = rdtPredictData[i].att3;
        if (rdtType > 3)
            att4 = rdtPredictData[i].att4;
        if (rdtType > 4)
            att5 = rdtPredictData[i].att5;
        if (rdtType > 5)
            att6 = rdtPredictData[i].att6;
        if (rdtType > 6)
            att7 = rdtPredictData[i].att7;
        if (rdtType > 7)
            att8 = rdtPredictData[i].att8;
        if (rdtType > 8)
            att9 = rdtPredictData[i].att9;
        if (rdtType > 9)
            att10 = rdtPredictData[i].att10;
        if (rdtType > 10)
            att11 = rdtPredictData[i].att11;
        if (rdtType > 11)
            att12 = rdtPredictData[i].att12;
        var rowObj = [];
        if (rdtType == 1)
            rowObj.push(groupId,ID,att1);
        else if (rdtType == 2)
            rowObj.push(groupId,ID,att1,att2);
        else if (rdtType == 3)
            rowObj.push(groupId,ID,att1,att2,att3);
        else if (rdtType == 4)
            rowObj.push(groupId,ID,att1,att2,att3,att4);
        else if (rdtType == 5)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5);
        else if (rdtType == 6)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6);
        else if (rdtType == 7)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7);
        else if (rdtType == 8)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8);
        else if (rdtType == 9)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9);
        else if (rdtType == 10)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10); 
        else if (rdtType == 11)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11);    
        else if (rdtType == 12)
            rowObj.push(groupId,ID,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12);    
        tableObj.push(rowObj);
    }
    //console.log(' tableObj ', tableObj);
    if (rdtType == 1)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_1T(GROUP_ID,ID,ATT1) VALUES(?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (rdtType == 2)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_2T(GROUP_ID,ID,ATT1,ATT2) VALUES(?, ?, ?, ?)";
        stmt = conn.prepare(sqlStr);   
    }
    else if (rdtType == 3)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_3T(GROUP_ID,ID,ATT1,ATT2,ATT3) VALUES(?, ?, ?, ?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 4)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_4T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4) VALUES(?, ?, ?, ?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 5)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_5T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5) VALUES(?, ?, ?, ?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 6)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_6T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6) VALUES(?, ?, ?, ?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 7)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_7T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7) VALUES(?, ?, ?, ?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }

    else if (rdtType == 8)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_8T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8) VALUES(?, ?, ?, ?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 9)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_9T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 10)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_10T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 11)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_11T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    else if (rdtType == 12)
    {
        sqlStr = "INSERT INTO PAL_RDT_PRED_DATA_GRP_TAB_12T(GROUP_ID,ID,ATT1,ATT2,ATT3,ATT4,ATT5,ATT6,ATT7,ATT8,ATT9,ATT10,ATT11,ATT12) VALUES(?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)";
        stmt = conn.prepare(sqlStr);
    }
    console.log(' _updateRdtPredictionData sqlStr ', sqlStr);

    console.log(' _updateRdtPredictionData tableObj ', tableObj);


    stmt.execBatch(tableObj);
    stmt.drop();
    conn.disconnect();
    console.log(' _updateRdtPredictionData Completed ');
}

//function _runPredictionRdtGroup(req) {
exports._runPredictionRdtGroup = function(req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var rdtType = req.data.rdtType;
    var version = req.data.Version;
    var scenario = req.data.Scenario;

    console.log('_runPredictionRdtGroup rdtType : ', rdtType);


    if (rdtType == 1)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_1T";
    else if (rdtType == 2)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_2T";
    else if (rdtType == 3)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_3T";
    else if (rdtType == 4)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_4T";
    else if (rdtType == 5)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_5T";
    else if (rdtType == 6)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_6T";
    else if (rdtType == 7)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_7T";
    else if (rdtType == 8)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_8T";
    else if (rdtType == 9)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_9T";
    else if (rdtType == 10)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_10T";
    else if (rdtType == 11)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_11T";
    else if (rdtType == 12)
        sqlStr = "SELECT DISTINCT GROUP_ID from  PAL_RDT_PRED_DATA_GRP_TAB_12T";
    else
    {
        var res = req._.req.res;
        res.send({"Invalid RdtType":rdtType});
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

        console.log('PredictionRdt Group: ', groupId);
        //predictionResults = predictionResults + _runRdtPrediction(groupId);
        let predictionObj = rtdFuncs._runRdtPrediction(rdtType, groupId, version, scenario);
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

// function _runRdtPrediction(rdtType, group, version, scenario) {
exports._runRdtPrediction = function(rdtType, group) {

//    var groupId = req.data.groupId;

    console.log('_runRdtPrediction - group', group, 'Version ', version, 'Scenario ', scenario);

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
    
    sqlStr = "create local temporary column table #PAL_RDT_MODEL_TAB_"+ groupId + " " + 
                    "(\"ROW_INDEX\" INTEGER,\"TREE_INDEX\" INTEGER,\"MODEL_CONTENT\" NCLOB)"; // MEMORY THRESHOLD 1000)";


    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '#PAL_RDT_MODEL_TAB_'+ groupId + ' SELECT "ROW_INDEX", "TREE_INDEX", "MODEL_CONTENT" FROM PAL_RDT_MODEL_GRP_TAB WHERE PAL_RDT_MODEL_GRP_TAB.GROUP_ID =' + "'" + groupId + "'";

    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
    var predDataObj = [];	

    if (rdtType == 1)
    {
 
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1" FROM PAL_RDT_PRED_DATA_GRP_TAB_1T WHERE PAL_RDT_PRED_DATA_GRP_TAB_1T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1" FROM PAL_RDT_PRED_DATA_GRP_TAB_1T WHERE PAL_RDT_PRED_DATA_GRP_TAB_1T.GROUP_ID =' + "'" + groupId + "'";
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
            predDataObj.push({GroupId,id,att1});
        }
    
    }
    else if (rdtType == 2)
    {
 
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2" FROM PAL_RDT_PRED_DATA_GRP_TAB_2T WHERE PAL_RDT_PRED_DATA_GRP_TAB_2T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2" FROM PAL_RDT_PRED_DATA_GRP_TAB_2T WHERE PAL_RDT_PRED_DATA_GRP_TAB_2T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 3)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" FROM PAL_RDT_PRED_DATA_GRP_TAB_3T WHERE PAL_RDT_PRED_DATA_GRP_TAB_3T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3" FROM PAL_RDT_PRED_DATA_GRP_TAB_3T WHERE PAL_RDT_PRED_DATA_GRP_TAB_3T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 4)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4" FROM PAL_RDT_PRED_DATA_GRP_TAB_4T WHERE PAL_RDT_PRED_DATA_GRP_TAB_4T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4" FROM PAL_RDT_PRED_DATA_GRP_TAB_4T WHERE PAL_RDT_PRED_DATA_GRP_TAB_4T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 5)
    {
         sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5" FROM PAL_RDT_PRED_DATA_GRP_TAB_5T WHERE PAL_RDT_PRED_DATA_GRP_TAB_5T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4" , "ATT5" FROM PAL_RDT_PRED_DATA_GRP_TAB_5T WHERE PAL_RDT_PRED_DATA_GRP_TAB_5T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 6)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" FROM PAL_RDT_PRED_DATA_GRP_TAB_6T WHERE PAL_RDT_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6" FROM PAL_RDT_PRED_DATA_GRP_TAB_6T WHERE PAL_RDT_PRED_DATA_GRP_TAB_6T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 7)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7"FROM PAL_RDT_PRED_DATA_GRP_TAB_7T WHERE PAL_RDT_PRED_DATA_GRP_TAB_7T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" FROM PAL_RDT_PRED_DATA_GRP_TAB_7T WHERE PAL_RDT_PRED_DATA_GRP_TAB_7T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 8)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" FROM PAL_RDT_PRED_DATA_GRP_TAB_8T WHERE PAL_RDT_PRED_DATA_GRP_TAB_8T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" FROM PAL_RDT_PRED_DATA_GRP_TAB_8T WHERE PAL_RDT_PRED_DATA_GRP_TAB_8T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 9)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" FROM PAL_RDT_PRED_DATA_GRP_TAB_9T WHERE PAL_RDT_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9" FROM PAL_RDT_PRED_DATA_GRP_TAB_9T WHERE PAL_RDT_PRED_DATA_GRP_TAB_9T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 10)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" , "ATT10" FROM PAL_RDT_PRED_DATA_GRP_TAB_10T WHERE PAL_RDT_PRED_DATA_GRP_TAB_10T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9", "ATT10" FROM PAL_RDT_PRED_DATA_GRP_TAB_10T WHERE PAL_RDT_PRED_DATA_GRP_TAB_10T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 11)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double,\"ATT11\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" , "ATT10", "ATT11" FROM PAL_RDT_PRED_DATA_GRP_TAB_11T WHERE PAL_RDT_PRED_DATA_GRP_TAB_11T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9", "ATT10", "ATT11" FROM PAL_RDT_PRED_DATA_GRP_TAB_11T WHERE PAL_RDT_PRED_DATA_GRP_TAB_11T.GROUP_ID =' + "'" + groupId + "'";
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
    else if(rdtType == 12)
    {
        sqlStr = "create local temporary column table #PAL_RDT_PREDICTDATA_TAB_" + groupId + " " + 
                        "(\"ID\" integer,\"ATT1\" double,\"ATT2\" double,\"ATT3\" double,\"ATT4\" double,\"ATT5\" double ,\"ATT6\" double,\"ATT7\" double,\"ATT8\" double,\"ATT9\" double,\"ATT10\" double,\"ATT11\" double,\"ATT12\" double)";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        sqlStr = 'INSERT INTO ' + '#PAL_RDT_PREDICTDATA_TAB_' + groupId + ' SELECT "ID", "ATT1", "ATT2", "ATT3" , "ATT4", "ATT5", "ATT6" , "ATT7" , "ATT8" , "ATT9" , "ATT10", "ATT11", "ATT12" FROM PAL_RDT_PRED_DATA_GRP_TAB_12T WHERE PAL_RDT_PRED_DATA_GRP_TAB_12T.GROUP_ID =' + "'" + groupId + "'";
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();

        sqlStr = 'SELECT "ID", "ATT1", "ATT2", "ATT3", "ATT4", "ATT4" , "ATT5" , "ATT6", "ATT7" , "ATT8" , "ATT9", "ATT10", "ATT11", "ATT12" FROM PAL_RDT_PRED_DATA_GRP_TAB_12T WHERE PAL_RDT_PRED_DATA_GRP_TAB_12T.GROUP_ID =' + "'" + groupId + "'";
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
        console.log('_runRdtPrediction Invalid rdtType ', rdtType);
        return;
    }
    
    //console.log(result);

    sqlStr = "create local temporary column table #PAL_RDT_PARAMETER_TAB_" + groupId + " " +
                        "(\"PARAM_NAME\" varchar(100),\"INT_VALUE\" integer,\"double_VALUE\" double,\"STRING_VALUE\" varchar(100))";
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);


    sqlStr = 'INSERT INTO ' + '#PAL_RDT_PARAMETER_TAB_' + groupId + ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_RDT_PREDICT_PARAMETER_GRP_TAB WHERE PAL_RDT_PREDICT_PARAMETER_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();


    sqlStr = ' SELECT "PARAM_NAME", "INT_VALUE", "DOUBLE_VALUE", "STRING_VALUE" FROM PAL_RDT_PREDICT_PARAMETER_GRP_TAB WHERE PAL_RDT_PREDICT_PARAMETER_GRP_TAB.GROUP_ID =' + "'" +  groupId + "'";
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


    sqlStr = "call _SYS_AFL.PAL_RANDOM_DECISION_TREES_PREDICT (" + "#PAL_RDT_PREDICTDATA_TAB_" + groupId + "," + "#PAL_RDT_MODEL_TAB_" + groupId + "," + "#PAL_RDT_PARAMETER_TAB_" + groupId + "," + "?)";
    console.log('_runRdtPrediction rdtType ', rdtType);

    console.log('_runRdtPrediction sqlStr ', sqlStr);

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
    // let grpStr=groupId.split('#');
    // let outputGroupId = grpStr[0];
    // let location = grpStr[1];
    // let product = grpStr[2];
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALRDTPREDICTIONS'] }, entries: [
         {rdtID: idObj, createdAt : createtAtObj.toISOString(), Location : location, 
          Product : product, groupId : GroupId, Version : version, Scenario : scenario,
          predictionParameters:predParamsObj, rdtType : rdtType, 
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
        let predictedVal = resultsObj[index].score;
        predictedVal =  (+predictedVal).toFixed(2);
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
                    "'" + 'RTD' + "'" + "," +
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

        let method = 'RDT';
        sqlStr = 'SELECT CP_PAL_PROFILEOD.PROFILE, METHOD FROM CP_PAL_PROFILEOD ' +
                'INNER JOIN CP_PAL_PROFILEMETH ON '+
                '"CP_PAL_PROFILEOD"."PROFILE" = "CP_PAL_PROFILEMETH"."PROFILE"' +
                ' AND CP_PAL_PROFILEMETH.METHOD = ' + "'" + method + "'" +
                ' AND LOCATION_ID = ' + "'" + result[0].Location + "'" +
                ' AND PRODUCT_ID = ' + "'" + result[0].Product + "'" +
                ' AND OBJ_DEP = ' + "'" + result[0].OBJ_DEP + '_' + result[0].OBJ_COUNTER + "'";
        console.log("V_PREDICTIONS IBP Result Plan Predicted Value HGBT sql sqlStr", sqlStr);
        stmt=conn.prepare(sqlStr);
        results = stmt.exec();
        stmt.drop();


        if ( (results.length > 0) &&
             (results[0].METHOD = 'RDT'))
        {
            sqlStr = 'UPSERT "CP_IBP_RESULTPLAN_TS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
                    "'" + result[0].Location + "'" + "," +
                    "'" + result[0].Product + "'" + "," +
                    "'" + result[0].Type + "'" + "," +
                    "'" + result[0].OBJ_DEP + "'" + "," +
                    "'" + result[0].OBJ_COUNTER + "'" + "," +
                    "'" + result[0].VERSION + "'" + "," +
                    "'" + result[0].SCENARIO + "'" + "," + 
                    "'" + predictedVal + "'" + "," +
                    "'" + predictedTime + "'" + "," +
                    "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
            
 
            console.log("CP_IBP_RESULTPLAN_TS Predicted Value HGBT sql update sqlStr", sqlStr);

            stmt=conn.prepare(sqlStr);
            stmt.exec();
            stmt.drop();
        }

    }
    conn.disconnect();

 
    let returnObj = [];	
    let createdAt = createtAtObj;
    let rdtID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let predictedResults = resultsObj;
    returnObj.push({rdtID, createdAt,predictionParameters,rdtType,predictionData,predictedResults});

    return returnObj[0];
}
