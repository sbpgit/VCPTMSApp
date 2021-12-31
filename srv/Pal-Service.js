const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');

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

module.exports = srv => {
  
   srv.on ('CREATE', 'mlrRegressions',    _runMlrRegressions)

   srv.on ('CREATE', 'mlrPredictions',    _runMlrPredictions)

   srv.on ('CREATE', 'hgbtRegressionsV1',    _runHgbtRegressionsV1)
   srv.on ('CREATE', 'hgbtPredictionsV1',    _runHgbtPredictionsV1)

   srv.on ('CREATE', 'varmaModels',    _genVarmaModels)
   srv.on ('CREATE', 'varmaPredictions', _runVarmaPredictions)

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
   // for (var i = 0; i < vcRulesList.length; i++)
   // {
        //console.log('i = ',i, 'modelType :', modelType );
        if ( (vcRulesList[index].dimensions == numChars) &&
             (modelType == 'HGBT'))
        {
            paramsObj.push({"groupId":vcRulesList[index].GroupID, "paramName":"THREAD_RATIO", "intVal":null,"doubleVal": 0.5, "strVal" : null});
            paramsObj.push({"groupId":vcRulesList[index].GroupID,"paramName":"VERBOSE", "intVal":0,"doubleVal": null, "strVal" : null});
        }
        else if ( (vcRulesList[index].dimensions == numChars) && 
                  (modelType == 'MLR'))
        {
            paramsObj.push({"groupId":vcRulesList[index].GroupID, "paramName":"THREAD_RATIO", "intVal":null,"doubleVal": 0.1, "strVal" : null});
        }
        else if ( (vcRulesList[index].dimensions == numChars) && 
                  (modelType == 'VARMA'))
        {
            paramsObj.push({"groupId":vcRulesList[index].GroupID, "paramName":"FORECAST_LENGTH", "intVal":1,"doubleVal": null, "strVal" : null});
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
                if (numChars == 2)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2});
                }
                else if (numChars == 3)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3});

                }
                else if (numChars == 4)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4});

                    }
                else if (numChars == 5)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5});

                }
                else if (numChars == 6)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6});
                }    
                else if (numChars == 7)
                {

                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7});
                } 
                else if (numChars == 8)
                {

                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8});
                }      
                else if (numChars == 9)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9});
                }     
                else if (numChars == 10)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10});
                } 
                else if (numChars == 11)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11});
                }
                else if (numChars == 12)
                {
                    dataObj.push({"groupId":vcRulesList[idx].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11,"att12":att12});
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
            "groupId" : vcRuleListObj[0].GroupID,
            "predictionParameters": paramsObj,
            "hgbtType": numChars,
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
//            console.log("V_FUTURE_DEP_TS Distinct Periods sqlStr", sqlStr)
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
         (vcRulesListReq[0].GroupID == "ALL") && 
         (vcRulesListReq[0].Product == "ALL") && 
         (vcRulesListReq[0].Location == "ALL") )
    {

        sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                    ' GROUP BY "Location", "Product", "GroupID"';  
//        console.log('sqlStr: ', sqlStr);            
        stmt = conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        
        for (let index=0; index<results.length; index++) 
        {
            let Location = results[index].Location;
            let Product = results[index].Product;
            let GroupID = results[index].GroupID;
            vcRulesList.push({Location,Product,GroupID});
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

        sqlStr = 'SELECT "MODELTYPE" FROM "CP_PALMODELPROFILES"' +
                         ' WHERE "PRODUCT" = ' + "'" + vcRulesList[i].Product + "'" + 
                         ' AND "LOCATION" = ' + "'" + vcRulesList[i].Location + "'" + 
                         ' AND "GROUPID" = ' + "'" + vcRulesList[i].GroupID + "'"; 
        //console.log('sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        //console.log("Results Length", results.length);
        stmt.drop();
        if(results.length > 0)
            //vcRulesList[i].modelType = results[0].ModelType;
            vcRulesList[i].modelType = results[0].MODELTYPE;
        else
            vcRulesList[i].modelType ="NA";
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

function _runMlrRegressions(req) {
  

   //const regressionParameters = req.data.regressionParameters;
   //console.log('predictionParameters: ', regressionParameters); 
   
   _updateMlrGroupParams (req);
    
   //const regressionData = req.data.regressionData;
   //console.log('predictionData: ', regressionData); 
  
   _updateMlrGroupData(req);

   _runRegressionMlrGroup(req); 
  
}


function _updateMlrGroupParams (req) {
    const mlrGroupParams = req.data.regressionParameters;

    //console.log('_updateMlrGroupParams: ', mlrGroupParams);         


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
                inGroups.push(mlrGroupParams[i].GROUP_ID);
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

function _updateMlrGroupData (req) {
    const mlrGroupData = req.data.regressionData;
    //console.log('_updateMlrGroupData: ', mlrGroupData);         

    var mlrType = req.data.mlrType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (mlrType == 2)
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
        if (mlrType == 2)
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
    if (mlrType == 2)
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


function _runRegressionMlrGroup (req) {

    //console.log('Executing Multi Linear Regression at GROUP');
    var mlrType = req.data.mlrType;
    var mlrDataTable;
    if (mlrType == 2)
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

    //var groupId = group;
    sqlStr = 'DELETE FROM "PAL_MLR_COEFFICIENT_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    //sqlStr ='DELETE FROM PAL_MLR_COEFFICIENT_GRP_TAB WHERE GROUP_ID IN (SELECT GROUP_ID FROM PAL_MLR_DATA_GRP_TAB_3T)';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM "PAL_MLR_PMML_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM "PAL_MLR_FITTED_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM "PAL_MLR_STATISTICS_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
//    console.log('_runRegressionMlrGroup sqlStr', sqlStr);
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    sqlStr =  'DELETE FROM "PAL_MLR_OPTIMAL_PARAM_GRP_TAB" WHERE GROUP_ID IN (SELECT GROUP_ID FROM ' + mlrDataTable + ')';
    stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (mlrType == 2)
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

   
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALMLRREGRESSIONS'] }, entries: [
        //  {   ID: idObj, createdAt : createtAtObj, 
        {   mlrID: idObj, createdAt : createtAtObj.toISOString(), 
            regressionParameters:req.data.regressionParameters, 
            mlrType : req.data.mlrType,
            regressionData : req.data.regressionData, 
            coefficientOp : coefficientsObj,
            pmmlOp : pmmlObj,
            fittedOp : fittedObj,
            statisticsOp : statisticsObj,
            optimalParamOp : paramSelectionObj}
        ]}}

    cds.run(cqnQuery);
//    console.log("PalMlrRegressions",cqnQuery);


    
    //console.log('Regression  coefficientsObj', coefficientsObj);

    let returnObj = [];	
    let createdAt = createtAtObj;
 
    let mlrID = idObj; //uuidObj;
 
    let regressionParameters = req.data.regressionParameters;
 
    mlrType = req.data.mlrType;
 
    let regressionData = req.data.regressionData;
 
    let coefficientOp = coefficientsObj;
    let pmmlOp = pmmlObj;
    let fittedOp = fittedObj;
    let statisticsOp = statisticsObj;
 
    let optimalParamOp = paramSelectionObj;

    returnObj.push({mlrID, createdAt,regressionParameters,mlrType,regressionData,coefficientOp, pmmlOp,fittedOp,statisticsOp,optimalParamOp});

/////
    let inGroups = [];
    let modelGroup = regressionParameters[0].groupId;
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
        var rowObj = {   mlrGroupID: idObj, 
            createdAt : createtAtObj.toISOString(), 
            groupId : inGroups[grpIndex],
            regressionParameters:paramsGroupObj, 
            mlrType : req.data.mlrType,
            coefficientOp : coeffsGroupObj,
            fittedOp : fittedGroupObj,
            statisticsOp : statsGroupObj,
            optimalParamOp : paramSelectionGroupObj};
        tableObj.push(rowObj);
    }

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


function _runMlrPredictions(req) {
  

   //const predictionParameters = req.data.predictionParameters;
   //console.log('predictionParameters: ', predictionParameters); 
   var groupId = req.data.groupId;

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

   _updateMlrPredictionParams (req);
    
   //const predictionData = req.data.predictionData;
   //console.log('predictionData: ', predictionData); 
  
   _updateMlrPredictionData(req);

   _runPredictionMlrGroup(req); 
  
}


function _updateMlrPredictionParams (req) {

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

function _updateMlrPredictionData (req) {

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

    if (mlrpType == 2)
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
        //console.log('_updateMlrGroupData ', ID);

        V1 = mlrPredictData[i].att1;
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
        if (mlrpType == 2)
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
    if (mlrpType == 2)
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

function _runPredictionMlrGroup (req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    var mlrpType = req.data.mlrpType;


    if (mlrpType == 2)
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
        let predictionObj = _runMlrPrediction(mlrpType, groupId);
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


function _runMlrPrediction(mlrpType, group) {

    console.log('_runMlrPrediction - group', group);

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var result=stmt.exec();
    stmt.drop();

    var groupId = group;
    sqlStr = 'create local temporary column table ' + '"#PAL_FMLR_COEFICIENT_TBL_' + groupId + '" ' + 
                    "(\"Coefficient\" varchar(50),\"CoefficientValue\" DOUBLE)"; 

    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();
    //console.log(result);

    var predDataObj = [];	

    if (mlrpType == 2)
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
            predDataObj.push({groupId,id,att1,att2});
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
            predDataObj.push({groupId,id,att1,att2,att3});
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
            predDataObj.push({groupId,id,att1,att2,att3,att4});
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
            predDataObj.push({groupId,id,att1,att2,att3,att4,att5});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12});
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

        predParamsObj.push({groupId,paramName,intVal,doubleVal,strVal});
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
    
        fittedObj.push({groupId,id,value});

    }	
 


    var createtAtObj = new Date();
    //let idObj = groupId;
    let idObj = uuidv1();
    
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALMLRPREDICTIONS'] }, entries: [
         {mlrpID: idObj, createdAt : createtAtObj.toISOString(), groupId : groupId, predictionParameters:predParamsObj, mlrpType : mlrpType, predictionData : predDataObj, fittedResults : fittedObj}
         ]}}

    cds.run(cqnQuery);

    conn.disconnect();

    var conn = hana.createConnection();
 
    conn.connect(conn_params_container);

    sqlStr = 'SET SCHEMA ' + containerSchema; 
    // console.log('sqlStr: ', sqlStr);            
    stmt=conn.prepare(sqlStr);
    result=stmt.exec();
    stmt.drop();

    sqlStr = 'SELECT DISTINCT "OBJ_DEP", "OBJ_COUNTER", ' + '"' + vcConfigTimePeriod + '"' + 
             ' from  "V_FUTURE_DEP_TS" WHERE  "GroupID" = ' + "'" + groupId + "'" + 
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
        let predictedVal = fittedObj[index].value;
        predictedVal = ( +predictedVal).toFixed(2);
        let periodId = distPeriods[index][trimmedPeriod];
        sqlStr = 'UPDATE "V_FUTURE_DEP_TS" SET "Predicted" = ' + "'" + predictedVal + "'" + "," +
                 '"PredictedTime" = ' + "'" + predictedTime + "'" + "," +
                 '"PredictedStatus" = ' + "'" + 'SUCCESS' + "'"+ 
                 ' WHERE "GroupID" = ' + "'" + groupId + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
                 ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";

                //' WHERE "OBJ_DEP" = distPeriods[index][OBJ_DEP] AND "OBJ_COUNTER" = distPeriods[index][OBJ_COUNTER]' + 

                 //' WHERE "GroupID" = ' + "'" + "OBJ_DEP".concat("-","OBJ_COUNTER") + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";

          //       ' WHERE "GroupID" = ' + "'" + groupId + "'" + ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";
        console.log("V_FUTURE_DEP_TS Predicted Value sql update sqlStr", sqlStr)

        stmt=conn.prepare(sqlStr);
        stmt.exec();
        stmt.drop();
    }

    conn.disconnect();


 
    let returnObj = [];	
    let createdAt = createtAtObj;
    let mlrpID = idObj; 
    let predictionParameters = predParamsObj;
    let predictionData = predDataObj;
    let fittedResults = fittedObj;
    returnObj.push({mlrpID, createdAt,predictionParameters,mlrpType,predictionData,fittedResults});

    return returnObj[0];
}




function _runHgbtRegressionsV1(req) {


   _updateHgbtGroupParamsV1 (req);
    
  
   _updateHgbtGroupDataV1(req);

   _runRegressionHgbtGroupV1(req); 
  
}


function _updateHgbtGroupParamsV1 (req) {
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
                inGroups.push(hgbtGroupParams[i].GROUP_ID);
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



function _updateHgbtGroupDataV1 (req) {
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

function _runRegressionHgbtGroupV1 (req) {
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
    //let uuidObj = uuidv1();

   // let timeStamp = createtAtObj;
   // let tsObj = [];	

   // tsObj.push({timeStamp});
   // console.log("tsObj ", tsObj);
   // var myDate = new Date(1559736267189);
   // alert(myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + myDate.getDate()).slice(-2) + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds());
    
    let cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTREGRESSIONSV1'] }, entries: [
        //  {   ID: idObj, createdAt : createtAtObj, 
        {   hgbtID: idObj, 
            createdAt : createtAtObj.toISOString(), //2021-12-14T12:00:35.940Z', //new Date(), 
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


  //  console.log("CP_PALHGBTREGRESSIONSV1 cQnQuery " , cqnQuery);
/*
    const sleep = require('await-sleep');
    console.log('_runRegressionHgbtGroupV1 Sleep Start Time',new Date());
    await sleep(200);
    console.log('_runRegressionHgbtGroupV1 Sleep Completed Time',new Date());
*/

/*

    var conn_container = hana.createConnection();
    conn_container.connect(conn_params_container);
    var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn_container.prepare(sqlStr);
    stmt.exec();
    stmt.drop();
   
    sqlStr = "INSERT INTO CP_PALHGBTREGRESSIONSV1(HGBTID, CREATEDAT, REGRESSIONPARAMETERS, HGBTTYPE, REGRESSIONDATA, MODELSOP,IMPORTANCEOP,STATISTICSOP,PARAMSELECTIONOP)" +
             "VALUES(" + idObj + "," + createtAtObj + "," + req.data.regressionParameters + "," +
              req.data.hgbtType + "," + req.data.regressionData + "," +
             modelsObj + "," + impObj + "," + statisticsObj + "," + paramSelectionObj +")";
    
    console.log('CP_PALHGBTREGRESSIONSV1 sqlStr: ', sqlStr);            

    sqlStr = "INSERT INTO CP_PALHGBTREGRESSIONSV1(HGBTID, CREATEDAT, REGRESSIONPARAMETERS, " + 
               "HGBTTYPE, REGRESSIONDATA, MODELSOP,IMPORTANCEOP,STATISTICSOP,PARAMSELECTIONOP)" +
               "VALUES(?,?,?,?,?,?,?,?,?)";
    console.log('CP_PALHGBTREGRESSIONSV1 sqlStr: ', sqlStr);            

    stmt = conn_container.prepare(sqlStr);
    result = stmt.exec([idObj,createtAtObj,req.data.regressionParameters,
                        req.data.hgbtType,req.data.regressionData,modelsObj,
                        impObj,statisticsObj,paramSelectionObj]);
    stmt.drop();
    console.log("Number of rows added: " + result);
    conn_container.disconnect();
*/

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
        var rowObj = {   hgbtGroupID: idObj, 
            //createdAt : createtAtObj, 
            createdAt : createtAtObj.toISOString(),
            groupId : inGroups[grpIndex],
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


function _runHgbtPredictionsV1(req) {
   var groupId = req.data.groupId;

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
   
   
   _updateHgbtPredictionParamsV1 (req);
    
   _updateHgbtPredictionDataV1(req);

   _runPredictionHgbtGroupV1(req); 
  
}

function _updateHgbtPredictionParamsV1(req) {

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

function _updateHgbtPredictionDataV1(req) {

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

function _runPredictionHgbtGroupV1(req) {

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
        let predictionObj = _runHgbtPredictionV1(hgbtType, groupId);
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

function _runHgbtPredictionV1(hgbtType, group) {

    console.log('_runHgbtPredictionV1 - group', group);

    var conn = hana.createConnection();
 


    conn.connect(conn_params);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var result=stmt.exec();
    stmt.drop();

    var groupId = group;
    
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
            predDataObj.push({groupId,id,att1,att2});
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
            predDataObj.push({groupId,id,att1,att2,att3});
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
            predDataObj.push({groupId,id,att1,att2,att3,att4});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5});
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


            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6});
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


            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7});
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


            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8});
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


            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9});
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


            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10});
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


            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11});
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

            predDataObj.push({groupId,id,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12});
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

        predParamsObj.push({groupId,paramName,intVal,doubleVal,strVal});
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
    
        resultsObj.push({groupId,id,score,confidence});
    }	

    var createtAtObj = new Date();
    //let idObj = groupId;
    let idObj = uuidv1();
    
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALHGBTPREDICTIONSV1'] }, entries: [
         {hgbtID: idObj, createdAt : createtAtObj.toISOString(), groupId : groupId, predictionParameters:predParamsObj, hgbtType : hgbtType, predictionData : predDataObj, predictedResults : resultsObj}
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


function _genVarmaModels(req) {
   
   _updateVarmaGroupParams (req);
    
   _updateVarmaGroupData(req);

   _genVarmaModelsGroup(req); 
  
}

function _updateVarmaGroupParams (req)
{
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
                inGroups.push(varmaControlParams[i].GROUP_ID);
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

function _updateVarmaGroupData (req)
{
    const varmaGroupData = req.data.varmaData;

    var varmaType = req.data.varmaType;


    var conn = hana.createConnection();

    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    if (varmaType == 2)
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
        if (varmaType == 2)
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
    if (varmaType == 2)
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

function _genVarmaModelsGroup (req)
{
    console.log('Executing VARMA Models at GROUP');
    var varmaType = req.data.varmaType;
    var varmaDataTable;
    if (varmaType == 2)
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


    if (varmaType == 2)
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
        var rowObj = {   varmaGroupID: idObj, createdAt : createtAtObj.toISOString(), groupId : inGroups[grpIndex],
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

function _runVarmaPredictions(req) {

    var groupId = req.data.groupId;

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
     
   _updateVarmaPredictionParams(req);
    
   _updateVarmaPredictionData(req);

   _runPredictionVarmaGroup(req); 
}


function _updateVarmaPredictionParams(req) {

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

function _updateVarmaPredictionData(req) {

    
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
    
    if (varmaType == 2)
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
        if (varmaType == 2)
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
    if (varmaType == 2)
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

function _runPredictionVarmaGroup(req) {

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var varmaType = req.data.varmaType;

    console.log('_runPredictionVarmaGroup varmaType : ', varmaType);
    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    var results=stmt.exec();
    stmt.drop();

    if (varmaType == 2)
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
        let predictionObj = _runVarmaPrediction(varmaType, groupId);
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


function _runVarmaPrediction(varmaType, group) {


    console.log('_runVarmaPrediction - group', group);

    var conn = hana.createConnection();
 
    conn.connect(conn_params);

    var sqlStr = 'SET SCHEMA ' + classicalSchema;  
    // console.log('sqlStr: ', sqlStr);            
    var stmt=conn.prepare(sqlStr);
    stmt.exec();
    stmt.drop();

    var groupId = group;
    
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

    if (varmaType == 2)
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
            predDataObj.push({groupId,timeStampIdx,att1,att2});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11});
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

            predDataObj.push({groupId,timeStampIdx,att1,att2,att3,att4,att5,att6,att7,att8,att9,att10,att11,att12});
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

        predParamsObj.push({groupId,paramName,intVal,doubleVal,strVal});
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

        resultsObj.push({groupId,colName,idx,forecast,se,lo95,hi95});
    }	

    var createtAtObj = new Date();
    //let idObj = groupId;
    let idObj = uuidv1();
    
    var cqnQuery = {INSERT:{ into: { ref: ['CP_PALVARMAPREDICTIONS'] }, entries: [
         {varmaID: idObj, createdAt : createtAtObj.toISOString(), groupId : groupId, predictionParameters:predParamsObj, varmaType : varmaType, predictionData : predDataObj, predictedResults : resultsObj}
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
        let predictedVal = resultsObj[index].forecast;
        predictedVal = ( +predictedVal).toFixed(2);
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

/*
function _getRuleListTypeForGenModels(vcRulesList, modelType, numChars)
{

    var ruleListObj = [];
    for (var i = 0; i < vcRulesList.length; i++)
    {
        if (vcRulesList[i].dimensions == numChars )
        {
     
            ruleListObj.push({"Location":vcRulesList[i].Location, 
                                "Product":vcRulesList[i].Product, 
                                "GroupID":vcRulesList[i].GroupID, 
                                "dimensions" : numChars});
        }
    }
    //console.log('_getRuleListTypeForGenModels ruleListObj ',ruleListObj);
    //console.log('_getRuleListTypeForGenModels  ruleListObj[0]',ruleListObj[0]);
    return ruleListObj;

}

function _getParamsObjForGenModels(vcRulesList, modelType, numChars)
{
    var paramsObj = [];
    for (var i = 0; i < vcRulesList.length; i++)
    {
        //console.log('i = ',i, 'modelType :', modelType );
        if ( (vcRulesList[i].dimensions == numChars) &&
             (modelType == 'HGBT'))
        {
            paramsObj.push({"groupId":vcRulesList[i].GroupID, "paramName":"SPLIT_METHOD", "intVal":null,"doubleVal": null, "strVal" : "exact"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"MAX_DEPTH", "intVal":6,"doubleVal": null, "strVal" : null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"RESAMPLING_METHOD", "intVal":null,"doubleVal": null, "strVal" : "cv"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"FOLD_NUM", "intVal":5,"doubleVal": null, "strVal" : null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"PARAM_SEARCH_STRATEGY", "intVal":null,"doubleVal": null, "strVal" : "grid"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EVALUATION_METRIC", "intVal":null,"doubleVal": null, "strVal" : "RMSE"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"REF_METRIC", "intVal":null,"doubleVal": null, "strVal" : "MAE"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"SEED", "intVal":1,"doubleVal": null, "strVal" : null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"ETA_RANGE", "intVal":null,"doubleVal": null, "strVal" : "[0.1, 0.2, 1.0]"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"GAMMA_RANGE", "intVal":null,"doubleVal": null, "strVal" : "[0.0, 0.2, 1.0]"});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"ITER_NUM_RANGE", "intVal":null,"doubleVal": null, "strVal" : "[10, 10, 20]"});
        }
        else if ( (vcRulesList[i].dimensions == numChars) && 
                  (modelType == 'MLR'))
        {
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"PMML_EXPORT","intVal":2,"doubleVal": null,"strVal":null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"ALG","intVal":6,"doubleVal": null,"strVal":null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"ENET_LAMBDA","intVal":null,"doubleVal":0.003194,"strVal":null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"ENET_ALPHA","intVal":null,"doubleVal":0.95,"strVal":null});
            paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"HAS_ID","intVal":1,"doubleVal":null,"strVal":null});
        }
    }
    //console.log('_getParamsObjForGenModels paramsObj',paramsObj);
    //console.log('_getParamsObjForGenModels paramsObj[0]',paramsObj[0]);

    return paramsObj;

}
*/
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

            sqlStr = 'SELECT * FROM "CP_PALMODELPROFILES"' +
                         ' WHERE "PRODUCT" = ' + "'" + vcRulesList[i].Product + "'" + 
                         ' AND "LOCATION" = ' + "'" + vcRulesList[i].Location + "'" + 
                         ' AND "GROUPID" = ' + "'" + vcRulesList[i].GroupID + "'" + 
                         ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
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
                                "modelType":results[0].MODELTYPE, 
                                "profileID":results[0].PROFILEID, 
                               // "modelType":results[0].ModelType, 
                               // "profileID":results[0].ProfileID, 
                                "dimensions" : numChars});
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
    for (var i = 0; i < vcRulesList.length; i++)
    {
        /*
        let sqlStr = 'SELECT * FROM ' + conn_params.uid + '."SBP_CBP_ProfileParameters"' +
                        'WHERE "Product" = ' + vcRulesList[i].Product + 
                        ' AND "Location" = ' + vcRulesList[i].Location +
                        ' AND "GroupID" = ' + vcRulesList[i].GroupID +
                        ' AND "ModelType" =' + modelType; 
        */
        sqlStr = 'SELECT "PROFILEID" FROM "CP_PALMODELPROFILES"' +
                        ' WHERE "PRODUCT" = ' + "'" + vcRulesList[i].Product + "'" + 
                        ' AND "LOCATION" = ' + "'" + vcRulesList[i].Location + "'" + 
                        ' AND "GROUPID" = ' + "'" + vcRulesList[i].GroupID + "'" + 
                        ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
        console.log(' _getParamsObjForGenModels sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();

        //console.log("_getParamsObjForGenModels MODELPROFILES ", results);

        sqlStr = 'SELECT * FROM "CP_PALMODELPARAMETERS"' +
                    ' WHERE "MODELTYPE" = ' + "'" + modelType + "'" + 
                    ' AND "PROFILEID" = ' + "'" + results[0].PROFILEID + "'"; 
       // console.log('sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        //console.log('i = ',i, 'modelType :', modelType );
        if (vcRulesList[i].dimensions == numChars)
        {
            for (let index=0; index<results.length; index++) 
            {
                paramsObj.push({"groupId":vcRulesList[i].GroupID, 
                                "paramName":results[index].PARAMNAME, 
                                "intVal":results[index].INTVAL,
                                "doubleVal": results[index].DOUBLEVAL, 
                                "strVal" : results[index].STRVAL});

            }
            if (modelType == 'VARMA')
            {
                paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT1"});
                paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT2"});
                if (numChars > 2 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT3"});
                }
                if (numChars > 3 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT4"});
                }
                if (numChars > 4 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT5"});
                }
                if (numChars > 5 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT6"});
                }
                if (numChars > 6 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT7"});
                }
                if (numChars > 7 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT8"});
                }
                if (numChars > 8 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT9"});
                }
                if (numChars > 9 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT10"});
                }
                if (numChars > 10 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT11"});
                }
                if (numChars > 11 )
                {
                    paramsObj.push({"groupId":vcRulesList[i].GroupID,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT12"});
                }
            }
        }
    }
  //  console.log('_getParamsObjForGenModels paramsObj',paramsObj);
    //console.log('_getParamsObjForGenModels paramsObj[0]',paramsObj[0]);
    conn.disconnect();

    return paramsObj;

}
/*
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
          (vcRulesListReq[0].GroupID == "ALL") && 
          (vcRulesListReq[0].Product == "ALL") && 
          (vcRulesListReq[0].Location == "ALL") )
     {
 
         sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
                    // vcRulesListReq[0].tableName + 
                     ' GROUP BY "Location", "Product", "GroupID"  HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';  
                     console.log('sqlStr: ', sqlStr);            
         stmt=conn.prepare(sqlStr);
         results=stmt.exec();
         stmt.drop();
         for (let index=0; index<results.length; index++) 
         {
             
             let Location = results[index].Location;
             let Product = results[index].Product;
             let GroupID = results[index].GroupID;
             vcRulesList.push({Location,Product,GroupID});
 
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
     res.contentType('application/json');
     //res.send({values});
     //res.end();
     //return res;


     res.status(201).json({
        status: 'success',
        data: {values}})
}
*/

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
         (vcRulesListReq[0].GroupID == "ALL") && 
         (vcRulesListReq[0].Product == "ALL") && 
         (vcRulesListReq[0].Location == "ALL") )
    {

        sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
                   // vcRulesListReq[0].tableName + 
                    ' GROUP BY "Location", "Product", "GroupID"  HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';  
                    console.log('sqlStr: ', sqlStr);            
        stmt=conn.prepare(sqlStr);
        results=stmt.exec();
        stmt.drop();
        for (let index=0; index<results.length; index++) 
        {
            
            let Location = results[index].Location;
            let Product = results[index].Product;
            let GroupID = results[index].GroupID;
            vcRulesList.push({Location,Product,GroupID});

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

    //for (var i in vcRulesList)
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

            if (charIdx % numChars == 0)
            {
                if (numChars == 2)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"target": target});
/*
                    if (modelType == 'MLR') //MLR
                        dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"target": target});
                    else if (modelType == 'HGBT') // HGBT
                        dataObj.push({"groupId":vcRulesList[i].GroupID, "att1":att1, "att2":att2,"target": target});                   
*/
                    }
                else if (numChars == 3)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"target": target});

                }
                else if (numChars == 4)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"target": target});

                    }
                else if (numChars == 5)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"target": target});

                }
                else if (numChars == 6)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"target": target});
                }    
                else if (numChars == 7)
                {

                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"target": target});
                } 
                else if (numChars == 8)
                {

                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"target": target});
                }      
                else if (numChars == 9)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"target": target});
                }     
                else if (numChars == 10)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"target": target});
                }
                else if (numChars == 11)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11,"target": target});
                }
                else if (numChars == 12)
                {
                    dataObj.push({"groupId":vcRulesList[i].GroupID, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6,"att7":att7,"att8":att8,"att9":att9,"att10":att10,"att11":att11,"att12":att12,"target": target});
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
            "regressionParameters": paramsObj,
            "hgbtType": numChars,
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
              //  console.log('hgbt responseData ', responseData);

                console.log('hgbt regressionsID ', responseData.value[0].hgbtID);
             //   let cqnQuery = {INSERT:{ into: { ref: ['PalGenRegressionModels'] }, entries: [
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