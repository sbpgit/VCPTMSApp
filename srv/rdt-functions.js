const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
    
const hana = require('@sap/hana-client');
const rtdFuncs = require('./rdt-functions.js');

const conn_params = {
    serverNode  : process.env.classicalSchemaNodePort, 
    uid         : process.env.uidClassicalSchema,
    pwd         : process.env.uidClassicalSchemaPassword,
    encrypt: 'TRUE'
    // ssltruststore: cds.env.requires.hana.credentials.certificate
};
const vcConfigTimePeriod = process.env.TimePeriod; 
const classicalSchema = process.env.classicalSchema; //cf environment variable"DB_CONFIG_PROD_CLIENT1";//

exports._runRdtRegressions = async function(req) {

    rtdFuncs._updateRdtGroupParams (req);   
    rtdFuncs._updateRdtGroupData(req);
    await rtdFuncs._runRegressionRdtGroup(req); 
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
    var modelVersion = req.data.modelVersion;


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

exports._runRegressionRdtGroup = async function(req) {

    console.log('Executing RDT Regression at GROUP');
    var rdtType = req.data.rdtType;
    var rdtModelVersion = req.data.modelVersion;

    console.log('Executing RDT Regression at GROUP REQ RDT Model Version', rdtModelVersion);

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
//////////////////////////////
    const rdtGroupParams = req.data.regressionParameters;
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
        sqlStr = "DELETE FROM PAL_RDT_MODEL_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    
        sqlStr =  "DELETE FROM PAL_RDT_IMP_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    
        sqlStr =  "DELETE FROM PAL_RDT_OUT_OF_BAG_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";
        //console.log('_runRegressionRdtGroup sqlStr', sqlStr);
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    
        sqlStr =  "DELETE FROM PAL_RDT_CONFUSION_GRP_TAB WHERE GROUP_ID = " + "'" + inGroups[i] + "'";        
        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();

    }

////////////////////////////////
    //var groupId = group;
    // sqlStr = 'DELETE FROM PAL_RDT_MODEL_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    // stmt=conn.prepare(sqlStr);
    // stmt.exec();
    // stmt.drop();

    // sqlStr =  'DELETE FROM PAL_RDT_IMP_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    // stmt=conn.prepare(sqlStr);
    // stmt.exec();
    // stmt.drop();

    // sqlStr =  'DELETE FROM PAL_RDT_OUT_OF_BAG_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    // //console.log('_runRegressionRdtGroup sqlStr', sqlStr);
    // stmt=conn.prepare(sqlStr);
    // stmt.exec();
    // stmt.drop();

    // sqlStr =  'DELETE FROM PAL_RDT_CONFUSION_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + rdtDataTable + ')';
    // stmt=conn.prepare(sqlStr);
    // stmt.exec();
    // stmt.drop();

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
   
    stmt=conn.prepare(sqlStr);
    var modelResults=stmt.exec();
    stmt.drop();
    

//    console.log('Models Table Results Length:', modelResults.length);
//    console.log('Model Table Results: ', modelResults);
    
    var models = [];
    modelGroup = modelResults[0].GROUP_ID;
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

    // commenting out from Memory usage Perspective


    // let cqnQuery = {INSERT:{ into: { ref: ['CP_PALRDTREGRESSIONS'] }, entries: [
    //     //  {   ID: idObj, createdAt : createtAtObj, 
    //     {   rdtID: idObj, 
    //         createdAt : createtAtObj.toISOString(), //2021-12-14T12:00:35.940Z', //new Date(),
    //         Location : req.data.Location,
    //         Product : req.data.Product,
    //         regressionParameters:req.data.regressionParameters, 
    //         rdtType : req.data.rdtType,
    //         regressionData : req.data.regressionData, 
    //         modelsOp : modelsObj,
    //         importanceOp : impObj,
    //         outOfBagOp : outOfBagObj}
    //     ]}}
        
        
    // console.log("CP_PALRDTREGRESSIONS cqnQuery Start " , new Date());

    // await cds.run(cqnQuery);
    console.log("CP_PALRDTREGRESSIONS cqnQuery Completed " , new Date());


/////
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

    //let mlrGroupParams = req.data.regressionParameters;
    console.log("inGroups ", inGroups, "Number of Groups",inGroups.length);

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
        let profileID = grpStr[0]; 
        let type = grpStr[1];
        let GroupId = grpStr[2];
        let location = grpStr[3];
        let product = grpStr[4];

        console.log("_runRegressionRdtGroup  grpStr ", grpStr, "profileID ",profileID, "type ", type, "GroupId ",GroupId, " location ", location, " product ", product);

        var rowObj = {   rdtGroupID: idObj, 
            //createdAt : createtAtObj, 
            createdAt : createtAtObj.toISOString(),
            Location : location,
            Product : product,
            groupId : GroupId,
            Type : type,
            modelVersion : rdtModelVersion,
            profile : profileID,
            regressionParameters:paramsGroupObj, 
            rdtType : req.data.rdtType,
            importanceOp : impGroupObj,
            outOfBagOp : outOfBagGroupObj};
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
                    "'" + 'RDT' + "'" + "," +
                    "'" + rdtModelVersion + "'" + "," +
                    "'" + profileID  + "'" + ')' + ' WITH PRIMARY KEY';
            
        console.log("CP_OD_MODEL_VERSIONS RDT sql update sqlStr", sqlStr);

        await cds.run(sqlStr);
        // stmt=conn_container.prepare(sqlStr);
        // stmt.exec();
        // stmt.drop();
    }

    // conn_container.disconnect();

    cqnQuery = {INSERT:{ into: { ref: ['CP_PALRDTBYGROUP'] }, entries:  tableObj }};
//    console.log("CP_PALRDTBYGROUP cQnQuery " , cqnQuery);

    console.log("CP_PALRDTBYGROUP cqnQuery Start " , new Date());
    await cds.run(cqnQuery);
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


exports._runRdtPredictions = async function(req) {

  // var groupId = req.data.groupId;

   var groupId = req.data.profile + '#' + req.data.Type + '#' + req.data.groupId + '#' + req.data.Location + '#' + req.data.Product;
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

   await rtdFuncs._runPredictionRdtGroup(req); 
  
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
exports._runPredictionRdtGroup = async function(req) {

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
    var modelVersion = req.data.modelVersion;

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
        let predictionObj = await rtdFuncs._runRdtPrediction(rdtType, groupId, version, scenario,modelVersion);
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
exports._runRdtPrediction = async function(rdtType, group, version, scenario,modelVersion) {

//    var groupId = req.data.groupId;

    console.log('_runRdtPrediction - group', group, 'Version ', version, 'Scenario ', scenario,'Model Version', modelVersion);

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

    // commenting out from Memory usage Perspective

    // var cqnQuery = {INSERT:{ into: { ref: ['CP_PALRDTPREDICTIONS'] }, entries: [
    //      {rdtID: idObj, createdAt : createtAtObj.toISOString(), Location : location, 
    //       Product : product, groupId : GroupId, Type: odType, modelVersion: modelVersion, profile: profileId,
    //       Version : version, Scenario : scenario,
    //       predictionParameters:predParamsObj, rdtType : rdtType, 
    //       predictionData : predDataObj, predictedResults : resultsObj}
    //      ]}}

    // await cds.run(cqnQuery);

    conn.disconnect();

    // conn = hana.createConnection();
 
    // conn.connect(conn_params_container);

    // sqlStr = 'SET SCHEMA ' + containerSchema; 
    // // console.log('sqlStr: ', sqlStr);            
    // stmt=conn.prepare(sqlStr);
    // result=stmt.exec();
    // stmt.drop();

    let tpGrpStr=groupId.split('#');
    tpGroupId = tpGrpStr[2] + '#' + tpGrpStr[3] + '#' + tpGrpStr[4];
    console.log('tpGroupId: ', tpGroupId);

    sqlStr = 'SELECT DISTINCT ' + '"' + vcConfigTimePeriod + '"' + 
                ' from  V_FUTURE_DEP_TS WHERE  "GroupID" = ' + "'" + tpGroupId + "'" +
                ' AND "Type" = ' + "'" + odType + "'" +
                ' AND "VERSION" = ' + "'" + version + "'" +
                ' AND "SCENARIO" = ' + "'" + scenario + "'" +   
                ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';
     var distPeriods= await cds.run(sqlStr);
    console.log("Time Periods for Group :", groupId, " Results: ", distPeriods);
    var predictedTime = new Date().toISOString();
    var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');
    
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

        sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", "Type", "OBJ_DEP", "OBJ_COUNTER", "OrderQuantity", "VERSION", "SCENARIO" ' +
                'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + tpGroupId + "'" +
                ' AND "Type" = ' + "'" + odType + "'" +
                ' AND "VERSION" = ' + "'" + version + "'" +
                ' AND "SCENARIO" = ' + "'" + scenario + "'" +   
                ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
       
        // stmt=conn.prepare(sqlStr);
        // result=stmt.exec();
        // stmt.drop();
        result = await cds.run(sqlStr);
        console.log("V_FUTURE_DEP_TS P SELECT sqlStr result ", result);

        sqlStr = 'UPSERT "CP_TS_PREDICTIONS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
                    "'" + result[0].Location + "'" + "," +
                    "'" + result[0].Product + "'" + "," +
                    "'" + result[0].Type + "'" + "," +
                    "'" + result[0].OBJ_DEP + "'" + "," +
                    "'" + result[0].OBJ_COUNTER + "'" + "," +
                    "'" + 'RTD' + "'" + "," +
                    "'" + modelVersion  + "'" + "," +
                    "'" + profileId  + "'" + "," +
                    "'" + result[0].VERSION + "'" + "," +
                    "'" + result[0].SCENARIO + "'" + "," +
                    "'" + predictedVal * result[0].OrderQuantity + "'" + "," +
                    "'" + predictedTime + "'" + "," +
                    "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
            
            //' WHERE "GroupID" = ' + "'" + groupId + "'" + 
            //' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        console.log("V_PREDICTIONS Predicted Value sql update sqlStr", sqlStr);

        // stmt=conn.prepare(sqlStr);
        // stmt.exec();
        // stmt.drop();
        await cds.run(sqlStr);

        // let method = 'RDT';
        // sqlStr = 'SELECT CP_PAL_PROFILEOD.PROFILE, METHOD FROM CP_PAL_PROFILEOD ' +
        //         'INNER JOIN CP_PAL_PROFILEMETH ON '+
        //         '"CP_PAL_PROFILEOD"."PROFILE" = "CP_PAL_PROFILEMETH"."PROFILE"' +
        //         ' AND CP_PAL_PROFILEMETH.METHOD = ' + "'" + method + "'" +
        //         ' AND LOCATION_ID = ' + "'" + result[0].Location + "'" +
        //         ' AND PRODUCT_ID = ' + "'" + result[0].Product + "'" +
        //         ' AND OBJ_DEP = ' + "'" + result[0].OBJ_DEP + '_' + result[0].OBJ_COUNTER + "'" +
        //         ' AND OBJ_TYPE = ' + "'" + result[0].Type + "'";

        // console.log("V_PREDICTIONS IBP Result Plan Predicted Value RDT sql sqlStr", sqlStr);
        // stmt=conn.prepare(sqlStr);
        // results = stmt.exec();
        // stmt.drop();


        // if ( (results.length > 0) &&
        //      (results[0].METHOD = 'RDT') &&
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
                    "'" + predictedVal * result[0].OrderQuantity + "'" + "," +
                    "'" + predictedTime + "'" + "," +
                    "'" + 'SUCCESS' + "'" + ')' + ' WITH PRIMARY KEY';
            
 
            console.log("CP_IBP_RESULTPLAN_TS Predicted Value RDT sql update sqlStr", sqlStr);

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
 
    // Extract Importance
    sqlStr = 'SELECT "GROUP_ID", "VARIABLE_NAME", "IMPORTANCE" FROM PAL_RDT_IMP_GRP_TAB' +
                 ' WHERE "GROUP_ID" = ' + "'" + groupId + "'";
    //console.log('sqlStr: ', sqlStr);            

    var stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log('sqlStr PAL_RDT_IMP_GRP_TAB Result: ', result);            

    conn.disconnect();

 
    var w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12 = 0;

    for (let index=0; index<result.length; index++)
    {
        //console.log('sqlStr PAL_HGBT_IMP_GRP_TAB index: ', index, 'VAR NAME = ', result[index].VARIABLE_NAME);            
   
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


    // var conn = hana.createConnection();
 
    // conn.connect(conn_params_container);

    // sqlStr = 'SET SCHEMA ' + containerSchema; 
    // // console.log('sqlStr: ', sqlStr);            
    // stmt=conn.prepare(sqlStr);
    // result=stmt.exec();
    // stmt.drop();

   // console.log("resultsObj = ", resultsObj);
    for (let pIndex=0; pIndex<distPeriods.length; pIndex++)
    {     
        let predictedVal = resultsObj[pIndex].score;
        predictedVal = ( +predictedVal).toFixed(2);
        let periodId = distPeriods[pIndex][trimmedPeriod];
        //console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

        sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", ' +
                 '"Type", "OBJ_DEP", "OBJ_COUNTER", "ROW_ID", "CharCount", "CharCountPercent", "VERSION", "SCENARIO" ' +
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

    
        var orderCount = 0;
        for (let rIndex = 0; rIndex < result.length; rIndex++)
        {
            let impact_val = impact_percent = 0;
            if (result[rIndex].ROW_ID == 1)
            {
                //impact_val = w1*predictedVal;//result[rIndex].CharCount;
                impact_percent = w1*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }
            else if (result[rIndex].ROW_ID == 2)
            {
                //impact_val = w2*predictedVal;//result[rIndex].CharCount;
                impact_percent = w2*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 3)
            {
                //impact_val = w3*predictedVal;//result[rIndex].CharCount;
                impact_percent = w3*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 4)
            {
                //impact_val = w4*predictedVal;//result[rIndex].CharCount;
                impact_percent = w4*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 5)
            {
                //impact_val = w5*predictedVal;//result[rIndex].CharCount;
                impact_percent = w5*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 6)
            {
                //impact_val = w6*predictedVal;//result[rIndex].CharCount;
                impact_percent = w6*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 7)
            {
                //impact_val = w7*predictedVal;//result[rIndex].CharCount;
                impact_percent = w7*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 8)
            {
                //impact_val = w8*predictedVal;//result[rIndex].CharCount;
                impact_percent = w8*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 9)
            {
                //impact_val = w9*predictedVal;//result[rIndex].CharCount;
                impact_percent = w9*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 10)
            {
                //impact_val = w10*predictedVal;//result[rIndex].CharCount;
                impact_percent = w10*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 11)
            {
                //impact_val = w11*predictedVal;//result[rIndex].CharCount;
                impact_percent = w11*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }            
            else if (result[rIndex].ROW_ID == 12)
            {
                //impact_val = w12*predictedVal;//result[rIndex].CharCount;
                impact_percent = w12*predictedVal;//result[rIndex].CharCount;
                if(result[rIndex].CharCount != 0)
                {
                    orderCount = result[rIndex].CharCount / result[rIndex].CharCountPercent;
                    impact_val = impact_percent * orderCount;
                }
            }
            // if (predictedVal <= 0)
            //    impact_percent = 0;
            // else
            //     impact_percent = 100*impact_val/impact_percent;
            //impact_percent = 100.0*impact_val/(predictedVal);

            //console.log("rIndex = ",rIndex,"impact_percent = ", impact_percent,"predictedVal = ", predictedVal, "intercept =",intercept);
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
            sqlStr = 'UPSERT "CP_TS_OBJDEP_CHAR_IMPACT_F" VALUES (' + "'" + result[rIndex].CAL_DATE + "'" + "," +
                "'" + result[rIndex].Location + "'" + "," +
                "'" + result[rIndex].Product + "'" + "," +
                "'" + result[rIndex].Type + "'" + "," +
                "'" + result[rIndex].OBJ_DEP + "'" + "," +
                "'" + result[rIndex].OBJ_COUNTER + "'" + "," +
                "'" + result[rIndex].ROW_ID + "'" + "," +
                "'" + 'RDT' + "'" + "," +
                "'" + modelVersion  + "'" + "," +
                "'" + profileId  + "'" + "," +
                "'" + result[rIndex].VERSION + "'" + "," +
                "'" + result[rIndex].SCENARIO + "'" + "," +
                "'" + result[rIndex].CharCount + "'" + "," +
                "'" + impact_val + "'" + "," +
                "'" + impactValPercent + "'" + "," +
                "'" + predicted*orderCount + "'" + "," +
                "'" + predictedTime + "'" + ')' + ' WITH PRIMARY KEY';            
            //console.log("CP_TS_OBJDEP_CHAR_IMPACT_F MLR UPSERT sqlStr ", sqlStr); 
  
            // stmt=conn.prepare(sqlStr);
            // stmt.exec();
            // stmt.drop(); 
            try {
                await cds.run(sqlStr);
            }
            catch (exception) {
                console.log("ERROR -- CP_TS_OBJDEP_CHAR_IMPACT_F RDT UPSERT sqlStr ", sqlStr); 
                throw new Error(exception.toString());
            }  
        }
  

    }
    // conn.disconnect();

    let returnObj = [];	
    let createdAt = createtAtObj;
    let rdtID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let predictedResults = resultsObj;
    returnObj.push({rdtID, createdAt,predictionParameters,rdtType,predictionData,predictedResults});

    return returnObj[0];
}
