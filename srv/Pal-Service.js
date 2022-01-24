const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');

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
// Begin of HGBT Functions
const hgbtMethods = require('./hgbt.js');
// End of HGBT functions

// Begin of MLR Functions
const mlrMethods = require('./mlr.js');
// End of MLR functions

// Begin of VARMA Functions
const varmaMethods = require('./varma.js');
// End of VARMA functions

// Begin of RDT Functions
const rdtMethods = require('./rdt-functions.js');
// End of RDT functions

module.exports = srv => {
  
   srv.on ('CREATE', 'mlrRegressions',    mlrMethods._runMlrRegressions)
   srv.on ('CREATE', 'mlrPredictions',    mlrMethods._runMlrPredictions)

   srv.on ('CREATE', 'hgbtRegressionsV1',    hgbtMethods._runHgbtRegressionsV1)
   srv.on ('CREATE', 'hgbtPredictionsV1',    hgbtMethods._runHgbtPredictionsV1)

   srv.on ('CREATE', 'rdtRegressions',    rdtMethods._runRdtRegressions)
   srv.on ('CREATE', 'rdtPredictions',    rdtMethods._runRdtPredictions)


   srv.on ('CREATE', 'varmaModels',    varmaMethods._genVarmaModels)
   srv.on ('CREATE', 'varmaPredictions', varmaMethods._runVarmaPredictions)

   srv.on ('CREATE', 'generateRegModels',    _generateRegModels)
   srv.on ('CREATE', 'generatePredictions',  _generatePredictions)

    srv.on ('testCorrelation',    async req => {
 
        console.log('Inputs: ', req.data);         
         
    })

    srv.on ('genTimeSeriesData',    async req => {
        //const {inputs} = req.data
        console.log('Inputs: ', req.data);   
 
        _genTimeSeriesData(req);   
     
    })

    //srv.on ('execCorrelation', function(a,b) { 
    /*
    srv.on ('execCorrelation',    async req => {
        const {a,b} = req.data
        console.log('param1: ', a, 'param2 :', b);         
    })
    */
 }


function _genTimeSeriesData(req)
{
    console.log('_genTimeSeriesData: ', req.data);   
}
function _getParamsObjForPredictions(vcRulesList, index, modelType, numChars)
{
    var paramsObj = [];
    //let palGroupId = vcRulesList[index].GroupID;

    let palGroupId = vcRulesList[index].GroupID + '#' + vcRulesList[index].Location + '#' + vcRulesList[index].Product;

   // for (var i = 0; i < vcRulesList.length; i++)
   // {
        //console.log('i = ',i, 'modelType :', modelType );
        if ( (vcRulesList[index].dimensions == numChars) &&
             ((modelType == 'HGBT') ||
               (modelType == 'RDT')) )
        {
            paramsObj.push({"groupId":palGroupId, "paramName":"THREAD_RATIO", "intVal":null,"doubleVal": 0.5, "strVal" : null});
            paramsObj.push({"groupId":palGroupId,"paramName":"VERBOSE", "intVal":0,"doubleVal": null, "strVal" : null});
        }
        else if ( (vcRulesList[index].dimensions == numChars) && 
                  (modelType == 'MLR'))
        {
            paramsObj.push({"groupId":palGroupId, "paramName":"THREAD_RATIO", "intVal":null,"doubleVal": 0.1, "strVal" : null});
        }
        else if ( (vcRulesList[index].dimensions == numChars) && 
                  (modelType == 'VARMA'))
        {
            paramsObj.push({"groupId":palGroupId, "paramName":"FORECAST_LENGTH", "intVal":1,"doubleVal": null, "strVal" : null});
        }
   // }

    return paramsObj;

}

function _getRuleListTypeForPredictions(vcRulesList, idx, numChars)
{
    var ruleListObj = [];
    //for (var i = 0; i < vcRulesList.length; i++)
    //{
        if (vcRulesList[idx].dimensions == numChars )
        {
            ruleListObj.push({"Location":vcRulesList[idx].Location, "Product":vcRulesList[idx].Product, "GroupID":vcRulesList[idx].GroupID, "dimensions" : numChars});
        }
    //}
    return ruleListObj;
}

function _getDataObjForPredictions(vcRulesList, idx, modelType, numChars) {

    var conn = hana.createConnection();
    conn.connect(conn_params_container);

    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var dataObj = [];	

   // for (var i = 0; i < vcRulesList.length; i++)
   // {

       sqlStr = 'SELECT DISTINCT "Attribute", "' + vcConfigTimePeriod + 
                '", SUM("CharCount") AS "CharCount" FROM "V_PREDICTION_TS" WHERE "Product" =' +
                    "'" +  vcRulesList[idx].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[idx].GroupID + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[idx].Location + "'" + 
                    ' GROUP BY "Attribute", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "Attribute"';

//        console.log('sqlStr :',sqlStr)
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
//        console.log('results :',results)

        let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12;
        let charIdx = 0;
        let distinctPeriodIdx = 0;
        for (let index=0; index<results.length; index++) 
        {
          //  console.log('charIdx ', charIdx, 'index :', index, 'charIdx % numChars : ', charIdx % numChars)
           if ( charIdx % numChars == 0)
            {
                att1 = results[index].CharCount;
            }
            else if (charIdx % numChars == 1)
            {
                att2 = results[index].CharCount;
            }
            else if (charIdx % numChars == 2)
            {
                att3 = results[index].CharCount;
            }
            else if (charIdx % numChars == 3)
            {
                att4 = results[index].CharCount;
            }
            else if (charIdx % numChars == 4)
            {
                att5 = results[index].CharCount;
            }
            else if (charIdx % numChars == 5)
            {
                att6 = results[index].CharCount;
            }
            else if (charIdx % numChars == 6)
            {
                att7 = results[index].CharCount;
            }
            else if (charIdx % numChars == 7)
            {
                att8 = results[index].CharCount;
            }
            else if (charIdx % numChars == 8)
            {
                att9 = results[index].CharCount;
            }
            else if (charIdx % numChars == 9)
            {
                att10 = results[index].CharCount;
            }
            else if (charIdx % numChars == 10)
            {
                att11 = results[index].CharCount;
            }
            else if (charIdx % numChars == 11)
            {
                att12 = results[index].CharCount;
            }
            charIdx  = charIdx + 1;

            if (charIdx % numChars == 0)
            {
                let palGroupId = vcRulesList[idx].GroupID + '#' + vcRulesList[idx].Location + '#' + vcRulesList[idx].Product;

                if (numChars == 2)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2});
                }
                else if (numChars == 3)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3});

                }
                else if (numChars == 4)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4});

                    }
                else if (numChars == 5)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5});

                }
                else if (numChars == 6)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6});
                }    
                else if (numChars == 7)
                {

                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7});
                } 
                else if (numChars == 8)
                {

                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8});
                }      
                else if (numChars == 9)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9});
                }     
                else if (numChars == 10)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10});
                } 
                else if (numChars == 11)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11});
                }
                else if (numChars == 12)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11,"att12":att12});
                }                  
                else
                {
                    console.log('Not supported numChars :', numChars);
                    return;     
                }             
                charIdx = 0;
                distinctPeriodIdx = distinctPeriodIdx + 1;

            }
        }
    //}
    conn.disconnect();
//    console.log('_getDataObjForPredictions ',JSON.stringify(dataObj));
    return dataObj;
   
}

async function _postPredictionRequest(url,paramsObj,numChars,dataObj,modelType,vcRuleListObj)
{
    var request = require('request');
    var options;
    let username = "SBPTECHTEAM";
    let password = "Sbpcorp@22";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    console.log("_postPredictionRequest - AUTH", auth);
    console.log("_postPredictionRequest - vcRuleListObj ", vcRuleListObj);

    if (modelType == 'HGBT')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization' : auth
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "groupId" : vcRuleListObj[0].GroupID,
            "predictionParameters": paramsObj,
            "hgbtType": numChars,
            "predictionData": dataObj
        })

        };
    }
    else if (modelType == 'RDT')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization' : auth
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "groupId" : vcRuleListObj[0].GroupID,
            "predictionParameters": paramsObj,
            "rdtType": numChars,
            "predictionData": dataObj
        })

        };
    }
    else if (modelType == 'MLR')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization' : auth
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "groupId" : vcRuleListObj[0].GroupID,
            "predictionParameters": paramsObj,
            "mlrpType": numChars,
            "predictionData": dataObj
        })

        };
    }
    else if (modelType == 'VARMA')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization' : auth
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "groupId" : vcRuleListObj[0].GroupID,
            "predictionParameters": paramsObj,
            "varmaType": numChars,
            "predictionData": dataObj
        })

        };
    }
    request(options, function (error, response) {
        //console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received

        if (error) 
        {
            console.log('_postPredictionRequest - Error ', error);

            return;

            //throw new Error(error);
        }
        if (response.statusCode == 200)
        {
            let responseData = JSON.parse(response.body);
            //var cqnQuery;
            if (modelType == 'HGBT')
            {

                //console.log('HGBT responseData ', responseData);

                //console.log('hgbt predictionsID ', responseData.value[0].hgbtID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].hgbtID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

                cds.run(cqnQuery);

            }
            else if (modelType == 'RDT')
            {

                //console.log('rdt predictionsID ', responseData.value[0].rdtID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].rdtID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

                cds.run(cqnQuery);

            }
            else if (modelType == 'MLR')
            {
                //console.log('mlr predictionsID ', responseData.value[0].mlrpID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].mlrpID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

                cds.run(cqnQuery);
            }
            else if (modelType == 'VARMA')
            {
                //console.log('varma predictionsID ', responseData.value[0].varmaID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].varmaID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

                cds.run(cqnQuery);
            }
        }
        else
        {
            console.error('_postPredictionRequest - error:', error); // Print the error if one occurred
            console.error('_postPredictionRequest - error - vcRuleListObj:', vcRuleListObj);            

            console.error('_postPredictionRequest - error - Location:', vcRuleListObj[0].Location);            
            console.error('_postPredictionRequest - error - Product:', vcRuleListObj[0].Product); 
            console.error('_postPredictionRequest - error - GroupID:', vcRuleListObj[0].GroupID); 
            
            var conn = hana.createConnection();
            conn.connect(conn_params_container);

            var sqlStr = 'SET SCHEMA ' + containerSchema;  
            // console.log('sqlStr: ', sqlStr);            
            var stmt=conn.prepare(sqlStr);
            stmt.exec();
            stmt.drop();
            sqlStr = 'SELECT DISTINCT ' + '"' + vcConfigTimePeriod + '"' + ' from  "V_FUTURE_DEP_TS" WHERE  "GroupID" = ' + "'" + vcRuleListObj[0].GroupID + "'" + ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';
            console.log("V_FUTURE_DEP_TS Distinct Periods sqlStr", sqlStr);
            stmt=conn.prepare(sqlStr);
            var distPeriods=stmt.exec();
            stmt.drop();
            console.log("Time Periods for Group :", vcRuleListObj[0].GroupID, " Results: ", distPeriods);
            var predictedTime = new Date().toISOString();
            var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');
//            console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

            for (var index=0; index<distPeriods.length; index++)
            {     

                let periodId = distPeriods[index][trimmedPeriod];
                sqlStr = 'UPDATE V_FUTURE_DEP_TS SET "Predicted" = ' + "'" + -1 + "'" + "," +
                        '"PredictedTime" = ' + "'" + predictedTime + "'" + "," +
                        '"PredictedStatus" = ' + "'" + 'FAIL' + "'"+ 
                        ' WHERE "GroupID" = ' + "'" + vcRuleListObj[0].GroupID + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
//                console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)

                stmt=conn.prepare(sqlStr);
                stmt.exec();
                stmt.drop();
            }
            conn.disconnect();
            // Retry posting the request if model exists and fails
            if (response.statusCode != 400)
                _postPredictionRequest(url,paramsObj,numChars,dataObj,modelType,vcRuleListObj);
        }
    });
}


async function _generatePredictions(req) {
 const vcRulesListReq = req.data.vcRulesList;
   const sleep = require('await-sleep');

//    console.log('_generatePredictions VC Rules List: ', vcRulesListReq); 


    var conn = hana.createConnection();
    
    conn.connect(conn_params_container);

    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var vcRulesList = [];

    if ( (vcRulesListReq.length == 1) &&
         ( (vcRulesListReq[0].GroupID == "ALL") && 
           (vcRulesListReq[0].Product == "ALL") && 
           (vcRulesListReq[0].Location == "ALL") ) ||

           ( (vcRulesListReq[0].GroupID == "ALL") && 
           (vcRulesListReq[0].Product == "ALL") && 
           (vcRulesListReq[0].Location != "ALL") ) ||

           ( (vcRulesListReq[0].GroupID == "ALL") && 
           (vcRulesListReq[0].Product != "ALL") && 
           (vcRulesListReq[0].Location == "ALL") ) ||
           
           ( (vcRulesListReq[0].GroupID == "ALL") && 
           (vcRulesListReq[0].Product != "ALL") && 
           (vcRulesListReq[0].Location != "ALL") ) )
    {

        if ( (vcRulesListReq[0].Location != "ALL") &&
             (vcRulesListReq[0].Product == "ALL") )
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     'WHERE "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                     ' GROUP BY "Location", "Product", "GroupID"';
        }
        else if ( (vcRulesListReq[0].Product != "ALL") &&
                  (vcRulesListReq[0].Location == "ALL") )
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
                     ' GROUP BY "Location", "Product", "GroupID"';
        }
        else if ( (vcRulesListReq[0].Product != "ALL") &&
                  (vcRulesListReq[0].Location != "ALL") )
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
                ' AND "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                ' GROUP BY "Location", "Product", "GroupID"';
        }
        else
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                    ' GROUP BY "Location", "Product", "GroupID"';  
        }
        console.log('sqlStr: ', sqlStr);            
        stmt = conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        
        for (let index=0; index<results.length; index++) 
        {
            let Location = results[index].Location;
            let Product = results[index].Product;
            let GroupID = results[index].GroupID;
            let profile = vcRulesListReq[0].profile;
            let override = vcRulesListReq[0].override;
            vcRulesList.push({profile,override,Location,Product,GroupID});
        }
//        console.log('_generatePredictions All Rules List: ', vcRulesList); 

    }
    else
    {
        vcRulesList =  vcRulesListReq;
    }

   // var sqlStr;
   // var stmt;
    //var hasCharCount2, hasCharCount3, hasCharCount4, hasCharCount5, hasCharCount6, hasCharCount7, hasCharCount8, hasCharCount9, hasCharCount10  = false;
    for (let i = 0; i < vcRulesList.length; i++)
    {
        
//        sqlStr = 'SELECT  COUNT(DISTINCT "Characteristic") AS numChars FROM "V_PREDICTION_TS" WHERE "Product" =' +
        sqlStr = 'SELECT  COUNT(DISTINCT "Row") AS numChars FROM "V_PREDICTION_TS" WHERE "Product" =' +
                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'";   
//        console.log('sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        vcRulesList[i].dimensions = results[0].NUMCHARS;
        
        if (vcRulesList[i].override == false)
        {
            // sqlStr = 'SELECT "MODELTYPE" FROM "CP_PALMODELPROFILES"' +
            //                  ' WHERE "PRODUCT" = ' + "'" + vcRulesList[i].Product + "'" + 
            //                  ' AND "LOCATION" = ' + "'" + vcRulesList[i].Location + "'" + 
            //                  ' AND "GROUPID" = ' + "'" + vcRulesList[i].GroupID + "'"; 

            sqlStr = 'SELECT * FROM "CP_PAL_PROFILEOD"' +
                    ' WHERE "PRODUCT_ID" = ' + "'" + vcRulesList[i].Product + "'" + 
                    ' AND "LOCATION_ID" = ' + "'" + vcRulesList[i].Location + "'" + 
                    ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" ;
                //  ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
            console.log('sqlStr: ', sqlStr);            
            stmt=conn.prepare(sqlStr);
            results=stmt.exec();
            stmt.drop();

            let profileID = 0;
            if (results.length > 0)
            {
                profileID = results[0].PROFILE;
                results = [];
                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                    ' WHERE "PROFILE" = ' + "'" + profileID + "'";
                console.log('sqlStr: ', sqlStr);            
                stmt=conn.prepare(sqlStr);
                results=stmt.exec();
                stmt.drop();
                if(results.length > 0)
                    //vcRulesList[i].modelType = results[0].ModelType;
                    //vcRulesList[i].modelType = results[0].MODELTYPE;
                    vcRulesList[i].modelType = results[0].METHOD;
                else
                    vcRulesList[i].modelType ="NA";
            }
            else
            {
                vcRulesList[i].modelType ="NA";       
            }
        }
        else
        {
            sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                        ' WHERE "PROFILE" = ' + "'" + vcRulesList[i].profile + "'";
            console.log('sqlStr: ', sqlStr);            
            stmt=conn.prepare(sqlStr);
            results=stmt.exec();
            stmt.drop();
            if (results.length > 0)
            {
                vcRulesList[i].modelType = results[0].METHOD;
            }
            else
            {
                vcRulesList[i].modelType ="NA"; 
            }
        }
        console.log(' i = ', i, ' vcRulesList[i].modelType = ',vcRulesList[i].modelType);            

    }
    conn.disconnect();
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	

   // values.push({id, createtAt, modelType, vcRulesList});    
    values.push({id, createtAt, vcRulesList});    

    console.log('values :', values);
    console.log('Response completed Time  :', createtAt);

    var res = req._.req.res;
    res.statusCode = 201;
    res.send({values});

    for (let i = 0; i < vcRulesList.length; i++)
    {

        let modelType = vcRulesList[i].modelType;
        if (modelType == "NA")
        { continue;}
        let url;

        var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 

        console.log('_generatePredictions: protocol', req.headers['x-forwarded-proto'], 'hostName :', req.headers.host);
        if ( modelType == 'HGBT')
            url =  baseUrl + '/pal/hgbtPredictionsV1';
        else if (modelType == 'RDT')
            url = baseUrl + '/pal/rdtPredictions';
        else if (modelType == 'MLR')
            url = baseUrl + '/pal/mlrPredictions';
        else if (modelType == 'VARMA')
            url = baseUrl + '/pal/varmaPredictions';

        console.log('_generatePredictions: url', url);

        if (vcRulesList[i].dimensions == 2)
        {
         //   hasCharCount2 = true; 
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 2);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 2);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 2);
            _postPredictionRequest(url,paramsObj,2,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 3)
        {
         //  hasCharCount3 = true; 
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 3);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 3);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 3);
            _postPredictionRequest(url,paramsObj,3,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 4)
        {
         //  hasCharCount4 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 4);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 4);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 4);
            _postPredictionRequest(url,paramsObj,4,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 5)
        {
         //  hasCharCount5 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 5);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 5);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 5);
            _postPredictionRequest(url,paramsObj,5,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 6)
        {
         //  hasCharCount6 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 6);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 6);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 6);
            _postPredictionRequest(url,paramsObj,6,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 7)
        {
         //  hasCharCount7 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 7);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 7);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 7);
            _postPredictionRequest(url,paramsObj,7,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 8)
        {
          // hasCharCount8 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 8);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 8);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 8);
            _postPredictionRequest(url,paramsObj,8,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 9)
        {
          // hasCharCount9 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 9);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 9);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 9);
            _postPredictionRequest(url,paramsObj,9,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 10)
        {
          // hasCharCount7 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 10);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 10);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 10);
            _postPredictionRequest(url,paramsObj,10,dataObj,modelType,ruleList);
        }  
        else if (vcRulesList[i].dimensions == 11)
        {
          // hasCharCount7 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 11);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 11);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 11);
            _postPredictionRequest(url,paramsObj,11,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 12)
        {
          // hasCharCount7 = true;
            let ruleList = _getRuleListTypeForPredictions(vcRulesList, i, 12);
            let paramsObj =  _getParamsObjForPredictions(vcRulesList, i, modelType, 12);
            let dataObj = _getDataObjForPredictions(vcRulesList, i, modelType, 12);
            _postPredictionRequest(url,paramsObj,12,dataObj,modelType,ruleList);
        }
        // Wait for 1 second before posting Next Prediction Request
        // It allows CDS (cqn Query) to commit PalMlrPredictions / PalHgbtPredictions / PalVarmaPredictions
        console.log('_generatePredictions Sleeping for ', 1000, ' Milli Seconds');
        console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        await sleep(1000);
        console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);
    }

//    const sleep = require('await-sleep');
//    console.log('_generatePredictions Sleeping for ', 2000*vcRulesList.length, ' Milli Seconds');
//    console.log('_generatePredictions Sleep Start Time',new Date());
//    await sleep(2000*vcRulesList.length);
//    console.log('_generatePredictions Sleep Completed Time',new Date());
} 

function _getRuleListTypeForGenModels(vcRulesList, modelType, numChars)
{
    var conn = hana.createConnection();
    
    conn.connect(conn_params_container);
    
    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var ruleListObj = [];
    for (var i = 0; i < vcRulesList.length; i++)
    {
        if (vcRulesList[i].dimensions == numChars )
        {

            if (vcRulesList[i].override == false)
            {
                // sqlStr = 'SELECT * FROM "CP_PALMODELPROFILES"' +
                //             ' WHERE "PRODUCT" = ' + "'" + vcRulesList[i].Product + "'" + 
                //             ' AND "LOCATION" = ' + "'" + vcRulesList[i].Location + "'" + 
                //             ' AND "GROUPID" = ' + "'" + vcRulesList[i].GroupID + "'" + 
                //             ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEOD"' +
                            ' WHERE "PRODUCT_ID" = ' + "'" + vcRulesList[i].Product + "'" + 
                            ' AND "LOCATION_ID" = ' + "'" + vcRulesList[i].Location + "'" + 
                            ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" ;
                          //  ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
                console.log('sqlStr: ', sqlStr);            
                stmt=conn.prepare(sqlStr);
                results=stmt.exec();
                stmt.drop();

                let profileID = 0;
                if (results.length > 0)
                {
                    profileID = results[0].PROFILE;
                    results = [];
                    sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                        ' WHERE "PROFILE" = ' + "'" + profileID + "'";
                    console.log('sqlStr: ', sqlStr);            
                    stmt=conn.prepare(sqlStr);
                    results=stmt.exec();
                    stmt.drop();
                // console.log('_getRuleListTypeForGenModels results: ', results);            

                    //let modelType = results[i].ModelType;
                    //let profileID = results[i].ProfileID;
                //  console.log('_getRuleListTypeForGenModels results ',results, 'results Length = ', results.length);
                    if (results.length > 0)
                    {
                        ruleListObj.push({"Location":vcRulesList[i].Location, 
                                        "Product":vcRulesList[i].Product, 
                                        "GroupID":vcRulesList[i].GroupID, 
                                        "modelType":results[0].METHOD, 
                                        "profileID":profileID, 
                                        "override":vcRulesList[i].override,
                                        "dimensions" : numChars});
                    }
                }
            }
            else
            {
                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                        ' WHERE "PROFILE" = ' + "'" + vcRulesList[i].profile + "'";
                console.log('sqlStr: ', sqlStr);            
                stmt=conn.prepare(sqlStr);
                results=stmt.exec();
                stmt.drop();
                if (results.length > 0)
                {
                    ruleListObj.push({"Location":vcRulesList[i].Location, 
                                    "Product":vcRulesList[i].Product, 
                                    "GroupID":vcRulesList[i].GroupID, 
                                    "modelType":results[0].METHOD, 
                                    "profileID":results[0].PROFILE, 
                                    "override":vcRulesList[i].override,
                                    "dimensions" : numChars});
                }
            }
        }
    }
  //  console.log('_getRuleListTypeForGenModels ruleListObj ',ruleListObj);
    //console.log('_getRuleListTypeForGenModels  ruleListObj[0]',ruleListObj[0]);
    conn.disconnect();
    return ruleListObj;

}

function _getParamsObjForGenModels(vcRulesList, modelType, numChars)
{
    var conn = hana.createConnection();
    
    conn.connect(conn_params_container);
    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var paramsObj = [];
    var method = 0;
    for (var i = 0; i < vcRulesList.length; i++)
    {

        if (vcRulesList[i].override == false)
        {
            // sqlStr = 'SELECT "PROFILEID" FROM "CP_PALMODELPROFILES"' +
            //                 ' WHERE "PRODUCT" = ' + "'" + vcRulesList[i].Product + "'" + 
            //                 ' AND "LOCATION" = ' + "'" + vcRulesList[i].Location + "'" + 
            //                 ' AND "GROUPID" = ' + "'" + vcRulesList[i].GroupID + "'" + 
            //                 ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 

            sqlStr = 'SELECT * FROM "CP_PAL_PROFILEOD"' +
                            ' WHERE "PRODUCT_ID" = ' + "'" + vcRulesList[i].Product + "'" + 
                            ' AND "LOCATION_ID" = ' + "'" + vcRulesList[i].Location + "'" + 
                            ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" ;
            console.log(' _getParamsObjForGenModels sqlStr: ', sqlStr);            
            stmt=conn.prepare(sqlStr);
            results=stmt.exec();
            stmt.drop();
            
            let profileID = 0;
            if (results.length > 0)
            {
                profileID = results[0].PROFILE;
                console.log("_getParamsObjForGenModels CP_PAL_PROFILEOD profileID =  ", profileID);
                results = [];

                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                            ' WHERE "PROFILE" = ' + "'" + profileID + "'"; 
                console.log('sqlStr: ', sqlStr);            
                stmt=conn.prepare(sqlStr);
                results=stmt.exec();
                stmt.drop();
                if (results.length > 0)
                {
                    method = results[0].METHOD;
                }
            }
        }
        else
        {
            sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                        ' WHERE "PROFILE" = ' + "'" + vcRulesList[i].profileID + "'"; 
        // console.log('sqlStr: ', sqlStr);            
            stmt=conn.prepare(sqlStr);
            results=stmt.exec();
            stmt.drop();
            if (results.length > 0)
            {
                method = results[0].METHOD;
            }
        }
        //console.log('i = ',i, 'modelType :', modelType );
        if (vcRulesList[i].dimensions == numChars)
        {
            let palGroupId = vcRulesList[i].GroupID + '#' + vcRulesList[i].Location + '#' + vcRulesList[i].Product;

            for (let index=0; index<results.length; index++) 
            {
               // paramsObj.push({"groupId":vcRulesList[i].GroupID, 
                paramsObj.push({"groupId":palGroupId, 
                                "paramName":results[index].PARA_NAME, 
                                "intVal":results[index].INTVAL,
                                "doubleVal": results[index].DOUBLEVAL, 
                                "strVal" : results[index].STRVAL});

            }

           // if ( (modelType == 'VARMA')
            if ( (method == 'VARMA') && 
                 (results.length > 0))
            {
                paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT1"});
                paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT2"});
                if (numChars > 2 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT3"});
                }
                if (numChars > 3 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT4"});
                }
                if (numChars > 4 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT5"});
                }
                if (numChars > 5 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT6"});
                }
                if (numChars > 6 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT7"});
                }
                if (numChars > 7 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT8"});
                }
                if (numChars > 8 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT9"});
                }
                if (numChars > 9 )
                {
                    paramsObj.push({"groupId":palGroupIdD,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT10"});
                }
                if (numChars > 10 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT11"});
                }
                if (numChars > 11 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT12"});
                }
            }
        }
    }
  //  console.log('_getParamsObjForGenModels paramsObj',paramsObj);
    //console.log('_getParamsObjForGenModels paramsObj[0]',paramsObj[0]);
    conn.disconnect();

    return paramsObj;

}

async function _generateRegModels (req) {

   const vcRulesListReq = req.data.vcRulesList;

   //  console.log('_generateRegModels: ', vcRulesListReq); 
    var url;
    //const modelType = req.data.modelType;

    // https://nodejs.org/api/url.html
    var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 

    console.log('_generateRegModels: protocol', req.headers['x-forwarded-proto'], 'hostName :', req.headers.host);

    console.log('_generateRegModels: url', url);

    console.log('_generateRegModels VC Rules List: ', vcRulesListReq); 


    var conn = hana.createConnection();
    
    conn.connect(conn_params_container);

    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var vcRulesList = [];
    if ( (vcRulesListReq.length == 1) &&
        ( (vcRulesListReq[0].GroupID == "ALL") && 
          (vcRulesListReq[0].Product == "ALL") && 
          (vcRulesListReq[0].Location == "ALL") ) ||

          ( (vcRulesListReq[0].GroupID == "ALL") && 
          (vcRulesListReq[0].Product == "ALL") && 
          (vcRulesListReq[0].Location != "ALL") ) ||

          ( (vcRulesListReq[0].GroupID == "ALL") && 
          (vcRulesListReq[0].Product != "ALL") && 
          (vcRulesListReq[0].Location == "ALL") ) ||
          
          ( (vcRulesListReq[0].GroupID == "ALL") && 
          (vcRulesListReq[0].Product != "ALL") && 
          (vcRulesListReq[0].Location != "ALL") ) )
   {

       if ( (vcRulesListReq[0].Location != "ALL") &&
            (vcRulesListReq[0].Product == "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                    'WHERE "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                    ' GROUP BY "Location", "Product", "GroupID"';
       }
       else if ( (vcRulesListReq[0].Product != "ALL") &&
                 (vcRulesListReq[0].Location == "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                    'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
                    ' GROUP BY "Location", "Product", "GroupID"';
       }
       else if ( (vcRulesListReq[0].Product != "ALL") &&
                 (vcRulesListReq[0].Location != "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
               'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
               ' AND "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
               ' GROUP BY "Location", "Product", "GroupID"';
       }
       else
       {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
                   // vcRulesListReq[0].tableName + 
                    ' GROUP BY "Location", "Product", "GroupID"  HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';  
       }
        console.log('sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        for (let index=0; index<results.length; index++) 
        {
            
            let Location = results[index].Location;
            let Product = results[index].Product;
            let GroupID = results[index].GroupID;
            let profile = vcRulesListReq[0].profile;
            let override = vcRulesListReq[0].override;
            vcRulesList.push({profile,override,Location,Product,GroupID});

        }
        //vcRulesList = JSON.stringify(vcRulesList);
        console.log('_generateRegModels All Rules List: ', vcRulesList); 

    }
    else
    {
        vcRulesList =  vcRulesListReq;
    }

    var hasCharCount2, hasCharCount3, hasCharCount4, hasCharCount5, hasCharCount6, hasCharCount7, hasCharCount8, hasCharCount9, hasCharCount10, hasCharCount11, hasCharCount12  = false;
    for (var i = 0; i < vcRulesList.length; i++)
    {
        
       // sqlStr = 'SELECT  COUNT(DISTINCT "Characteristic") AS numChars FROM CP_VC_HISTORY_TS WHERE "Product" =' +
        sqlStr = 'SELECT  COUNT(DISTINCT "Row") AS numChars FROM "CP_VC_HISTORY_TS" WHERE "Product" =' +
                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'";// + 'ORDER BY "WeekOfYear"';   
        console.log('sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        vcRulesList[i].dimensions = results[0].NUMCHARS;
        if (vcRulesList[i].dimensions == 2)
           hasCharCount2 = true; 
        if (vcRulesList[i].dimensions == 3)
           hasCharCount3 = true; 
        if (vcRulesList[i].dimensions == 4)
           hasCharCount4 = true; 
        if (vcRulesList[i].dimensions == 5)
           hasCharCount5 = true; 
        if (vcRulesList[i].dimensions == 6)
           hasCharCount6 = true; 
        if (vcRulesList[i].dimensions == 7)
           hasCharCount7 = true; 
        if (vcRulesList[i].dimensions == 8)
           hasCharCount8 = true; 
        if (vcRulesList[i].dimensions == 9)
           hasCharCount9 = true; 
        if (vcRulesList[i].dimensions == 10)
           hasCharCount10 = true; 
        if (vcRulesList[i].dimensions == 11)
           hasCharCount11 = true; 
        if (vcRulesList[i].dimensions == 12)
           hasCharCount12 = true;
    }
    
    conn.disconnect();

    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	


  //  values.push({idObj, createtAtObj, responseVcRuleList});
    //values.push({id, createtAt, modelType, vcRulesList}); 
    values.push({id, createtAt, vcRulesList});    
   
    console.log('values :', values);
    console.log('Response completed Time  :', createtAt);

    var res = req._.req.res;
    res.statusCode = 201;
//    res.end();
//    req.res.contentType('application/json');
    res.send({values});
    
//    console.log("Response Headers ", res.getHeaders());
//    res.removeHeader("x-powered-by");
//    res.removeHeader("x-correlation-id");
//    res.removeHeader("odata-version");
//    res.removeHeader("content-type");
//    res.removeHeader("content-length");

//    console.log("Response Headers ", res.getHeaders());


//    req.reply();


    if (hasCharCount2 == true)
    {
        
        let modelType = 'MLR';

        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 2);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,2,dataObj,modelType,ruleList);
        }
        
    //    
        modelType = 'HGBT';

        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,2,dataObj,modelType,ruleList);
        }

        modelType = 'RDT';

        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,2,dataObj,modelType,ruleList);
        }

        modelType = 'VARMA';

        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,2,dataObj,modelType,ruleList);
        }

    }
    if (hasCharCount3 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 3);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'HGBT';
        
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'RDT';
        
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'VARMA';
        
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,3,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount4 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 4);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,4,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount5 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 5);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,5,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount6 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 6);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,6,dataObj,modelType,ruleList);

        }
    }
    if (hasCharCount7 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 7);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,7,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount8 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 8);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,8,dataObj,modelType,ruleList);
       
        }
    }
    if (hasCharCount9 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 9);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,9,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount10 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 10);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,10,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount11 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 11);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,11,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount12 == true)
    {
        let modelType = 'MLR';
        let ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 12);
            url = baseUrl + '/pal/mlrRegressions';
            _postRegressionRequest(url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            _postRegressionRequest(url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/rdtRegressions';
            _postRegressionRequest(url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/varmaModels';
            _postRegressionRequest(url,paramsObj,12,dataObj,modelType,ruleList);
        }
    }
 /*
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	


  //  values.push({idObj, createtAtObj, responseVcRuleList});
    //values.push({id, createtAt, modelType, vcRulesList}); 
    values.push({id, createtAt, vcRulesList});    
   
    console.log('values :', values);
    console.log('Response completed Time  :', createtAt);

    var res = req._.req.res;
    res.statusCode = 201;
    res.send({values});
*/
   
    const sleep = require('await-sleep');
    console.log('_generateRegModels Sleeping for ', 1000*vcRulesList.length, ' Milli Seconds');
    console.log('_generateRegModels Sleep Start Time',new Date());
    await sleep(1000*vcRulesList.length);
    console.log('_generateRegModels Sleep Completed Time',new Date());

}


function _getDataObjForGenModels(vcRulesList, modelType, numChars) {

    var conn = hana.createConnection();
    
/*
    console.log("serverNode : ",conn_params.serverNode);
    console.log("uid : ",conn_params.uid);
    console.log("pwd : ",conn_params.pwd);
*/
    conn.connect(conn_params_container);

    //var sqlStr;
    //var stmt;
    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();
    var dataObj = [];	

    for (var i = 0; i < vcRulesList.length; i++)
    {
        
       sqlStr = 'SELECT DISTINCT "Attribute", "' + vcConfigTimePeriod + 
                '", SUM("CharCount") AS "CharCount", SUM("Target") AS "Target" FROM "CP_VC_HISTORY_TS" WHERE "Product" =' +

                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'" + 
                    ' GROUP BY "Attribute", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "Attribute"';


//        console.log('sqlStr :',sqlStr)
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        //console.log('results :',results)

        let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, target;
        let charIdx = 0;
        let distinctPeriodIdx = 0;
        for (let index=0; index<results.length; index++) 
        {
          //  charIdx  = charIdx + 1;
          //  console.log('charIdx ', charIdx, 'index :', index, 'charIdx % numChars : ', charIdx % numChars)
           if ( charIdx % numChars == 0)
            {
                att1 = results[index].CharCount;
                target = results[index].Target;
            }
            else if (charIdx % numChars == 1)
            {
                att2 = results[index].CharCount;
            }
            else if (charIdx % numChars == 2)
            {
                att3 = results[index].CharCount;
            }
            else if (charIdx % numChars == 3)
            {
                att4 = results[index].CharCount;
            }
            else if (charIdx % numChars == 4)
            {
                att5 = results[index].CharCount;
            }
            else if (charIdx % numChars == 5)
            {
                att6 = results[index].CharCount;
            }
            else if (charIdx % numChars == 6)
            {
                att7 = results[index].CharCount;
            }
            else if (charIdx % numChars == 7)
            {
                att8 = results[index].CharCount;
            }
            else if (charIdx % numChars == 8)
            {
                att9 = results[index].CharCount;
            }
            else if (charIdx % numChars == 9)
            {
                att10 = results[index].CharCount;
            }
            else if (charIdx % numChars == 10)
            {
                att11 = results[index].CharCount;
            }
            else if (charIdx % numChars == 11)
            {
                att12 = results[index].CharCount;
            }
            charIdx  = charIdx + 1;
            let palGroupId = vcRulesList[i].GroupID + '#' + vcRulesList[i].Location + '#' + vcRulesList[i].Product;

            if (charIdx % numChars == 0)
            {
                if (numChars == 2)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"target": target});
/*
                    if (modelType == 'MLR') //MLR
                        dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"target": target});
                    else if (modelType == 'HGBT') // HGBT
                        dataObj.push({"groupId":vcRulesList[i].GroupID, "att1":att1, "att2":att2,"target": target});                   
*/
                    }
                else if (numChars == 3)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"target": target});

                }
                else if (numChars == 4)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"target": target});

                    }
                else if (numChars == 5)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"target": target});

                }
                else if (numChars == 6)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"target": target});
                }    
                else if (numChars == 7)
                {

                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"target": target});
                } 
                else if (numChars == 8)
                {

                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"target": target});
                }      
                else if (numChars == 9)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"target": target});
                }     
                else if (numChars == 10)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"target": target});
                }
                else if (numChars == 11)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11,"target": target});
                }
                else if (numChars == 12)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11,"att12":att12,"target": target});
                }                 
                else
                {
                    console.log('Not supported numChars :', numChars);
                    return;     
                }             
                charIdx = 0;
                distinctPeriodIdx = distinctPeriodIdx + 1;

            }
        }
    }
    conn.disconnect();
//    console.log('_getDataObjForGenModels ', dataObj);
//    console.log('_getDataObjForGenModels ',JSON.stringify(dataObj));
    return dataObj;
   
}

async function _postRegressionRequest(url,paramsObj,numChars,dataObj,modelType,vcRuleListObj)
{
    var request = require('request');
    var options;
    let username = "SBPTECHTEAM";
    let password = "Sbpcorp@22";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    console.log("_postRegressionRequest - AUTH", auth);
    console.log("vcRuleListObj ", vcRuleListObj);

    if (modelType == 'HGBT')
    {

        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Authorization' : auth,
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "regressionParameters": paramsObj,
            "hgbtType": numChars,
            "regressionData": dataObj
        })

        };
    }
    else if(modelType == 'RDT')
    {

        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Authorization' : auth,
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "regressionParameters": paramsObj,
            "rdtType": numChars,
            "regressionData": dataObj
        })

        };
    }
    else if (modelType == 'MLR')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Authorization' : auth,
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "regressionParameters": paramsObj,
            "mlrType": numChars,
            "regressionData": dataObj
        })

        };
    }
    else if (modelType == 'VARMA')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Authorization' : auth,
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Product": vcRuleListObj[0].Product,
            "Location": vcRuleListObj[0].Location,
            "controlParameters": paramsObj,
            "varmaType": numChars,
            "varmaData": dataObj
        })

        };
    }
    request(options, function (error, response) {
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) throw new Error(error);
        if (response.statusCode == 423)
        {
            let responseData = JSON.parse(response.body);
            console.log('responseData ', responseData);
        }
        if (response.statusCode == 200)
        {

            let responseData = JSON.parse(response.body);
        //    console.log('hgbt responseData ', responseData);

            //var cqnQuery;
            if (modelType == 'HGBT')
            {
                console.log('hgbt regressionsID ', responseData.value[0].hgbtID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [

                    {   regressionsID: responseData.value[0].hgbtID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

             cds.run(cqnQuery);
            }
            else if (modelType == 'RDT')
            {
  
                  console.log('rdt regressionsID ', responseData.value[0].rdtID);
                  let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
  
                      {   regressionsID: responseData.value[0].rdtID, 
                          createdAt : responseData.value[0].createdAt, 
                          modelType : modelType,
                          vcRulesList : vcRuleListObj
                      }
                  ]}}
  //                console.log('cqnQuery ', cqnQuery);
  
               cds.run(cqnQuery);
              }
            else if (modelType == 'MLR')
            {
              //  console.log('mlr regressionsID ', responseData.value[0].mlrID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
                    {   regressionsID: responseData.value[0].mlrID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

                cds.run(cqnQuery);
            }
            else if (modelType == 'VARMA')
            {
                console.log('varma ID ', responseData.value[0].varmaID);
                let cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
                    {   regressionsID: responseData.value[0].varmaID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
//                console.log('cqnQuery ', cqnQuery);

                cds.run(cqnQuery);
            }
        }
        else
        {
            console.error('_postRegressionRequest - error:', error); // Print the error if one occurred
        }
    });
}