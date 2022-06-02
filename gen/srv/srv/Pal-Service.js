const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');

const conn_params = {
    serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    //serverNode  : process.env.classicalSchemaNodePort, //cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    uid         : process.env.uidClassicalSchema, //cf environment variable "SBPTECHTEAM",//
    pwd         : process.env.uidClassicalSchemaPassword,//cf environment variable"Sbpcorp@22",//
    encrypt: 'TRUE'//,
    //ssltruststore: cds.env.requires.hana.credentials.certificate
};

const vcConfigTimePeriod = process.env.TimePeriod; //cf environment variable"PeriodOfYear";//
const classicalSchema = process.env.classicalSchema; //cf environment variable"DB_CONFIG_PROD_CLIENT1";//"DB_CONFIG_PROD_CLIENT1";//

// const conn_params = {
//     serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
//     uid         : "SBPTECHTEAM",//
//     pwd         : "Sbpcorp@22",//
//     encrypt: 'TRUE'
//     // ssltruststore: cds.env.requires.hana.credentials.certificate
// };
// const vcConfigTimePeriod = "PeriodOfYear"; //process.env.TimePeriod; //cf environment variable"PeriodOfYear";//
// const classicalSchema = "DB_CONFIG_PROD_CLIENT1" ;//process.env.classicalSchema; //cf environment variable"DB_CONFIG_PROD_CLIENT1";//


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

const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");


function getJobscheduler(req) {

    xsenv.loadEnv();
    const services = xsenv.getServices({
      jobscheduler: { tags: "jobscheduler" },
    });
    if (services.jobscheduler) {
      const options = {
        baseURL: services.jobscheduler.url,
        user: services.jobscheduler.user,
        password: services.jobscheduler.password,
      };
      return new JobSchedulerClient.Scheduler(options);
    } else {
      req.error("no jobscheduler service instance found");
    }
  }

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

    srv.on ('generateModels',    async req => {
        // console.log('req.data: ', req.data);   
        // var data = req.data.vcRuleList;
        return (await _generateRegModels(req,false));   
    })


    // srv.on ('genPredictions',    async function (req, res) {
    srv.on ('genPredictions',    async req => {
        // console.log('req.data: ', req.data);   
        // var data = req.data.vcRuleList;
        return (await _generatePredictions(req,false));
        // return (await _generatePredictions(req,res,false));
    })


    srv.on ('fgModels',    async req => {
        // console.log('req.data: ', req.data.vcRulesList);   
        // var data = req.data.vcRuleList;
        return (await _generateRegModels(req,true));   
    })


    // srv.on ('fgPredictions',    async function (req, res) {
    srv.on ('fgPredictions',    async req => {
        // console.log('req.data: ', req.data);   
        // var data = req.data.vcRuleList;
        return (await _generatePredictions(req,true));
        // return (await _generatePredictions(req,res,true));
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
async function _getParamsObjForPredictions(vcRulesList, index, modelType, numChars)
{
    var paramsObj = [];
    //let palGroupId = vcRulesList[index].GroupID;

    let palGroupId = vcRulesList[index].profileID + '#' + vcRulesList[index].Type + '#' + vcRulesList[index].GroupID + '#'  + vcRulesList[index].Location + '#' + vcRulesList[index].Product;

   // for (var i = 0; i < vcRulesList.length; i++)
   // {
        //console.log('i = ',i, 'modelType :', modelType );
        if ( (vcRulesList[index].dimensions == numChars) &&
             ((modelType == 'HGBT') ||
               (modelType == 'RDT')) )
        {
            paramsObj.push({"groupId":palGroupId, "paramName":"THREAD_RATIO", "intVal":null,"doubleVal": 1, "strVal" : null});
            paramsObj.push({"groupId":palGroupId,"paramName":"VERBOSE", "intVal":0,"doubleVal": null, "strVal" : null});
        }
        else if ( (vcRulesList[index].dimensions == numChars) && 
                  (modelType == 'MLR'))
        {
            paramsObj.push({"groupId":palGroupId, "paramName":"THREAD_RATIO", "intVal":null,"doubleVal": 1, "strVal" : null});
        }
        else if ( (vcRulesList[index].dimensions == numChars) && 
                  (modelType == 'VARMA'))
        {
            //paramsObj.push({"groupId":palGroupId, "paramName":"FORECAST_LENGTH", "intVal":1,"doubleVal": null, "strVal" : null});
        }
   // }

    return paramsObj;

}

async function _getRuleListTypeForPredictions(vcRulesList, idx, numChars)
{
    var ruleListObj = [];
    //for (var i = 0; i < vcRulesList.length; i++)
    //{
        if (vcRulesList[idx].dimensions == numChars )
        {
            ruleListObj.push({"modelVersion":vcRulesList[idx].modelVersion,"Location":vcRulesList[idx].Location, "Product":vcRulesList[idx].Product, "GroupID":vcRulesList[idx].GroupID, "Type":vcRulesList[idx].Type,"Profile":vcRulesList[idx].profile,"Version":vcRulesList[idx].Version,"Scenario":vcRulesList[idx].Scenario,"dimensions" : numChars});
        }
    //}
    return ruleListObj;
}

async function _getDataObjForPredictions(vcRulesList, idx, modelType, numChars) {

   
    var results= [];
    var sqlStr = "";
    var dataObj = [];	

   // for (var i = 0; i < vcRulesList.length; i++)
   // {

    if( (modelType == 'HGBT') ||
        (modelType == 'RDT') )
    {
       sqlStr = 'SELECT DISTINCT "Attribute", "' + vcConfigTimePeriod + 
                '", SUM("CharCountPercent") AS "CharCount" FROM "V_PREDICTION_TS" WHERE "Product" =' +
                    "'" +  vcRulesList[idx].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[idx].GroupID + "'" +
                    ' AND "Type" =' + "'" +   vcRulesList[idx].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[idx].Location + "'" + 
                    ' AND "VERSION" =' + "'" +   vcRulesList[idx].Version + "'" +
                    ' AND "SCENARIO" =' + "'" +   vcRulesList[idx].Scenario + "'" +
                    ' GROUP BY "Attribute", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "Attribute"';

    }
    else
    {
        sqlStr = 'SELECT DISTINCT "Attribute", "' + vcConfigTimePeriod + 
                '", SUM("CharCount") AS "CharCount" FROM "V_PREDICTION_TS" WHERE "Product" =' +
                    "'" +  vcRulesList[idx].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[idx].GroupID + "'" +
                    ' AND "Type" =' + "'" +   vcRulesList[idx].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[idx].Location + "'" + 
                    ' AND "VERSION" =' + "'" +   vcRulesList[idx].Version + "'" +
                    ' AND "SCENARIO" =' + "'" +   vcRulesList[idx].Scenario + "'" +
                    ' GROUP BY "Attribute", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "Attribute"';
    }
//        console.log('sqlStr :',sqlStr)

        // results = cds.run(sqlStr);
        results = await cds.run(sqlStr);

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
                let palGroupId = vcRulesList[idx].profile + '#' + vcRulesList[idx].Type + '#' + vcRulesList[idx].GroupID + '#' + vcRulesList[idx].Location + '#' + vcRulesList[idx].Product;

                if (numChars == 1)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1});
                }
                else if (numChars == 2)
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
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1, "att2":att2,"att3":att3,"att4":att4,"att5":att5,"att6":att6});
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
   console.log('_getDataObjForPredictions ',JSON.stringify(dataObj));
    return dataObj;
   
}

async function _postPredictionRequest(req,url,paramsObj,numChars,dataObj,modelType,vcRuleListObj)
{
    var request = require('request');
    var options;
    let username = conn_params.uid; //"SBPTECHTEAM";
    let password = conn_params.pwd; //"Sbpcorp@22";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    //console.log("_postPredictionRequest - AUTH", auth);
    //console.log("_postPredictionRequest - vcRuleListObj ", vcRuleListObj);

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
            "Type": vcRuleListObj[0].Type,
            "modelVersion":vcRuleListObj[0].modelVersion,
            "profile": vcRuleListObj[0].Profile,
            "Version" : vcRuleListObj[0].Version,
            "Scenario" : vcRuleListObj[0].Scenario,
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
            "Type": vcRuleListObj[0].Type,
            "modelVersion":vcRuleListObj[0].modelVersion,
            "profile": vcRuleListObj[0].Profile,
            "Version" : vcRuleListObj[0].Version,
            "Scenario" : vcRuleListObj[0].Scenario,
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
            "Type": vcRuleListObj[0].Type,
            "modelVersion":vcRuleListObj[0].modelVersion,
            "profile": vcRuleListObj[0].Profile,
            "Version" : vcRuleListObj[0].Version,
            "Scenario" : vcRuleListObj[0].Scenario,
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
            "Type": vcRuleListObj[0].Type,
            "modelVersion":vcRuleListObj[0].modelVersion,
            "profile": vcRuleListObj[0].Profile,
            "Version" : vcRuleListObj[0].Version,
            "Scenario" : vcRuleListObj[0].Scenario,
            "predictionParameters": paramsObj,
            "varmaType": numChars,
            "predictionData": dataObj
        })

        };
    }
    await request(options, async function (error, response) {
        //console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received

        if (error) 
        {
            console.log('_postPredictionRequest - Error ', error);


            throw new Error(error);
            return;

        }
        if (response.statusCode == 200)
        {
            let cqnQuery = "";
            let responseData = JSON.parse(response.body);
            //var cqnQuery;
            if (modelType == 'HGBT')
            {

                //console.log('HGBT responseData ', responseData);

                //console.log('hgbt predictionsID ', responseData.value[0].hgbtID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].hgbtID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}

            }
            else if (modelType == 'RDT')
            {

                //console.log('rdt predictionsID ', responseData.value[0].rdtID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].rdtID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}

            }
            else if (modelType == 'MLR')
            {
                //console.log('mlr predictionsID ', responseData.value[0].mlrpID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].mlrpID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}

            }
            else if (modelType == 'VARMA')
            {
                //console.log('varma predictionsID ', responseData.value[0].varmaID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                    {   predictionsID: responseData.value[0].varmaID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}

            }
            //    console.log('cqnQuery ', cqnQuery);

            await cds.run(cqnQuery);
// Commenting as Job Scheduler marsks updateReq as success while other Predictions are in Progress
            // let successObj = {};
            // successObj["success"] = true;
            // successObj["message"] = 'generate Predictions Response StatusCode : ' + response.statusCode + ' AT :' + new Date() +
            //                          '\n Response Details :' + 
            //                          '\n predictionsID :' + cqnQuery.INSERT.entries[0].predictionsID +
            //                          '\n createdAt :' + cqnQuery.INSERT.entries[0].createdAt +
            //                          '\n modelType :' + cqnQuery.INSERT.entries[0].modelType +
            //                          '\n Location : ' + vcRuleListObj[0].Location +
            //                          '\n Product : ' + vcRuleListObj[0].Product +
            //                          '\n Group ID : ' + vcRuleListObj[0].GroupID +
            //                          '\n Type : ' + vcRuleListObj[0].Type +
            //                          '\n modelVersion : ' + vcRuleListObj[0].modelVersion +
            //                          '\n Version : ' + vcRuleListObj[0].Version +
            //                          '\n Scenario : ' + vcRuleListObj[0].Scenario;


            // if (req.headers['x-sap-job-id'] > 0)
            // {
            //     const scheduler = getJobscheduler(req);

            //     var updateReq = {
            //         jobId: req.headers['x-sap-job-id'],
            //         scheduleId: req.headers['x-sap-job-schedule-id'],
            //         runId: req.headers['x-sap-job-run-id'],
            //         data : successObj
            //         };

            //     console.log("generatePredictions job update req",updateReq);

            //     scheduler.updateJobRunLog(updateReq, function(err, result) {
            //     if (err) {
            //         return console.log('Error updating run log: %s', err);
            //     }


            //     });
            // }

        }
        else
        {


            let errorObj = {};
            errorObj["success"] = false;
 
            errorObj["message"] = 'ERROR generate Predictions Response StatusCode : ' + response.statusCode + ' AT ' + new Date() +
                                     '\n Response Details :' + 
                                     '\n Location : ' + vcRuleListObj[0].Location +
                                     '\n Product : ' + vcRuleListObj[0].Product +
                                     '\n Group ID : ' + vcRuleListObj[0].GroupID +
                                     '\n Type : ' + vcRuleListObj[0].Type +
                                     '\n modelVersion : ' + vcRuleListObj[0].modelVersion +
                                     '\n Version : ' + vcRuleListObj[0].Version +
                                     '\n Scenario : ' + vcRuleListObj[0].Scenario;
            if (req.headers['x-sap-job-id'] > 0)
            {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data : errorObj
                    };

                // console.log("generatePredictions job update req",updateReq);

                scheduler.updateJobRunLog(updateReq, function(err, result) {
                if (err) {
                    return console.log('Error updating run log: %s', err);
                }


                });
            }

//             console.error('_postPredictionRequest - error:', error); // Print the error if one occurred
//             console.error('_postPredictionRequest - error - vcRuleListObj:', vcRuleListObj);            

//             console.error('_postPredictionRequest - error - Location:', vcRuleListObj[0].Location);            
//             console.error('_postPredictionRequest - error - Product:', vcRuleListObj[0].Product); 
//             console.error('_postPredictionRequest - error - GroupID:', vcRuleListObj[0].GroupID); 
            
//             var sqlStr ="";
//             var results= [];
//             let groupId = vcRuleListObj[0].GroupID + '#' + vcRuleListObj[0].Location + '#' + vcRuleListObj[0].Product;

//             sqlStr = 'SELECT DISTINCT ' + '"' + vcConfigTimePeriod + '"' + ' from  "V_FUTURE_DEP_TS" ' +
//                      'WHERE  "GroupID" = ' + "'" + groupId + "'" + 
//                      ' AND "Type" = ' + "'" + vcRuleListObj[0].Type + "'" +
//                      ' AND "VERSION" = ' + "'" + vcRuleListObj[0].Version + "'" +
//                      ' AND "SCENARIO" = ' + "'" + vcRuleListObj[0].Scenario + "'" +
//                      ' ORDER BY ' + '"' + vcConfigTimePeriod + '"' + ' ASC';
//             console.log("V_FUTURE_DEP_TS Distinct Periods sqlStr", sqlStr);

//             var distPeriods = await cds.run(sqlStr);
//             console.log("Time Periods for Group :", vcRuleListObj[0].GroupID, " Results: ", distPeriods);
//             var predictedTime = new Date().toISOString();
//             var trimmedPeriod = vcConfigTimePeriod.replace(/^(["]*)/g, '');
// //            console.log('trimmedPeriod : ', trimmedPeriod, 'vcConfigTimePeriod :', vcConfigTimePeriod);

//             for (var index=0; index<distPeriods.length; index++)
//             {     

//                 let periodId = distPeriods[index][trimmedPeriod];

//                 sqlStr = 'SELECT DISTINCT "CAL_DATE", "Location", "Product", "Type", "OBJ_DEP", "OBJ_COUNTER", "VERSION", "SCENARIO" ' +
//                 'FROM "V_FUTURE_DEP_TS" WHERE "GroupID" = ' + "'" + groupId + "'" + 
//                 ' AND "Type" = ' + "'" + vcRuleListObj[0].Type + "'" +
//                 ' AND "VERSION" = ' + "'" + vcRuleListObj[0].Version + "'" +
//                 ' AND "SCENARIO" = ' + "'" + vcRuleListObj[0].Scenario + "'" +
//                 ' AND ' + '"' + vcConfigTimePeriod + '"' + ' = ' + "'" + periodId + "'";

        

//                 let result = await cds.run(sqlStr);
//                 console.log("V_FUTURE_DEP_TS P SELECT sqlStr result ", result);

//                 sqlStr = 'UPSERT "CP_TS_PREDICTIONS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
//                             "'" + result[0].Location + "'" + "," +
//                             "'" + result[0].Product + "'" + "," +
//                             "'" + result[0].Type + "'" + "," +
//                             "'" + result[0].OBJ_DEP + "'" + "," +
//                             "'" + result[0].OBJ_COUNTER + "'" + "," +
//                             "'" + modelType + "'" + "," +
//                             "'" + vcRuleListObj[0].modelVersion + "'" + "," +
//                             "'" + vcRuleListObj[0].Profile + "'" + "," +
//                             "'" + result[0].VERSION + "'" + "," +
//                             "'" + result[0].SCENARIO + "'" + "," +
//                             "'" + -1 + "'" + "," +
//                             "'" + predictedTime + "'" + "," +
//                             "'" + 'FAIL' + "'" + ')' + ' WITH PRIMARY KEY';
                    

//                 await cds.run(sqlStr);


//                 sqlStr = 'SELECT CP_PAL_PROFILEOD.PROFILE, METHOD FROM CP_PAL_PROFILEOD ' +
//                         'INNER JOIN CP_PAL_PROFILEMETH ON '+
//                         '"CP_PAL_PROFILEOD"."PROFILE" = "CP_PAL_PROFILEMETH"."PROFILE"' +
//                         ' AND CP_PAL_PROFILEMETH.METHOD = ' + "'" + modelType + "'" +
//                         ' AND LOCATION_ID = ' + "'" + result[0].Location + "'" +
//                         ' AND PRODUCT_ID = ' + "'" + result[0].Product + "'" +
//                         ' AND OBJ_DEP = ' + "'" + result[0].OBJ_DEP + '_' + result[0].OBJ_COUNTER + "'" +
//                         ' AND OBJ_TYPE = ' + "'" + result[0].Type + "'" ;


//                 results = await cds.run(sqlStr);

//                 if (results.length > 0)
//                 {
//                     sqlStr = 'UPSERT "CP_IBP_RESULTPLAN_TS" VALUES (' + "'" + result[0].CAL_DATE + "'" + "," +
//                             "'" + result[0].Location + "'" + "," +
//                             "'" + result[0].Product + "'" + "," +
//                             "'" + result[0].Type + "'" + "," +
//                             "'" + result[0].OBJ_DEP + "'" + "," +
//                             "'" + result[0].OBJ_COUNTER + "'" + "," +
//                             "'" + vcRuleListObj[0].modelVersion + "'" + "," +
//                             "'" + vcRuleListObj[0].Profile + "'" + "," + 
//                             "'" + result[0].VERSION + "'" + "," +
//                             "'" + result[0].SCENARIO + "'" + "," +
//                             "'" + -1 + "'" + "," +
//                             "'" + predictedTime + "'" + "," +
//                             "'" + 'FAIL' + "'" + ')' + ' WITH PRIMARY KEY';
                    
//                     await cds.run(sqlStr);
//                 }


//             }

        }
    });
}


// async function _generatePredictions(req,res,isGet) {
async function _generatePredictions(req,isGet) {

 var vcRulesListReq = {};
 if (isGet == true) //GET -- Kludge
 {
     vcRulesListReq = JSON.parse(req.data.vcRulesList);
 }
 else
 {
     vcRulesListReq = req.data.vcRulesList;
 }

 let createtAt = new Date();
 let id = uuidv1();
 let values = [];	
 let message = "Request for Predictions Queued Sucessfully";

 values.push({id, createtAt, message, vcRulesListReq});    

 // console.log('values :', values);
 // console.log('Response completed Time  :', createtAt);

 if (isGet == true)
 {
     req.reply({values});
     // req.reply();
 }
 else
 {
     let res = req._.req.res;
     // res.statusCode = 201;
     res.statusCode = 202;
     res.send({values});
 }
 

   const sleep = require('await-sleep');

//    console.log('_generatePredictions VC Rules List: ', vcRulesListReq); 


    // var conn = hana.createConnection();
    
    // // conn.connect(conn_params_container);

    // var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // // console.log('sqlStr: ', sqlStr);            
    // var stmt=conn.prepare(sqlStr);
    // var results=stmt.exec();
    // stmt.drop();

    var sqlStr ="";
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
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     'WHERE "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                     ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                     ' AND "VERSION" =' + "'" +   vcRulesListReq[0].version + "'" +
                     ' AND "SCENARIO" =' + "'" +   vcRulesListReq[0].scenario + "'" +
                     ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';
        }
        else if ( (vcRulesListReq[0].Product != "ALL") &&
                  (vcRulesListReq[0].Location == "ALL") )
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
                     ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                     ' AND "VERSION" =' + "'" +   vcRulesListReq[0].version + "'" +
                     ' AND "SCENARIO" =' + "'" +   vcRulesListReq[0].scenario + "'" +
                     ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';
        }
        else if ( (vcRulesListReq[0].Product != "ALL") &&
                  (vcRulesListReq[0].Location != "ALL") )
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
                ' AND "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                ' AND "VERSION" =' + "'" +   vcRulesListReq[0].version + "'" +
                ' AND "SCENARIO" =' + "'" +   vcRulesListReq[0].scenario + "'" +
                ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';
        }
        else
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                    ' GROUP BY "Location", "Product", "GroupID", "VERSION", "SCENARIO"';  
                ' WHERE "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                ' AND "VERSION" =' + "'" +   vcRulesListReq[0].version + "'" +
                ' AND "SCENARIO" =' + "'" +   vcRulesListReq[0].scenario + "'" +
                    ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';  
        }
        // console.log('sqlStr: ', sqlStr);            
        // stmt = conn.prepare(sqlStr);
        // results=stmt.exec();
        // stmt.drop();
        results = await cds.run(sqlStr);
        // results = cds.run(sqlStr);
        // console.log('results: ', results);            

        for (let index=0; index<results.length; index++) 
        {
            let Location = results[index].Location;
            let Product = results[index].Product;
            let GroupID = results[index].GroupID;
            let Type = results[index].Type;

            // Request Array Length is of only 1 - Hence always refer to '0' in vcRulesListReq
            let modelVersion = vcRulesListReq[0].modelVersion;
            let Version = vcRulesListReq[0].version; //results[index].VERSION;
            let Scenario = vcRulesListReq[0].scenario; //results[index].SCENARIO;
            //let profile = vcRulesListReq[0].profile;
            let override = vcRulesListReq[0].override;

            sqlStr = 'SELECT "MODEL_PROFILE" FROM "CP_OD_MODEL_VERSIONS"' + 
                     ' WHERE "LOCATION_ID" = ' + "'" +   Location + "'" +
                     ' AND "PRODUCT_ID" =' + "'" +   Product + "'" +
                     ' AND CONCAT("OBJ_DEP", CONCAT(' + "'" + '_' + "'" + ',"OBJ_COUNTER")) =' + "'" +   GroupID + "'" +
                     ' AND "OBJ_TYPE" =' + "'" +   Type + "'" +
                     ' AND "MODEL_VERSION" =' + "'" +   modelVersion + "'"; 
            // console.log('sqlStr: ', sqlStr);            
            // stmt = conn.prepare(sqlStr);
            // let mpResults=stmt.exec();
            // stmt.drop();
            let mpResults = await cds.run(sqlStr);
            // let mpResults = cds.run(sqlStr);
            // console.log('mpResults: ', mpResults);            

            if (mpResults.length > 0)
            {
                let profile = mpResults[0].MODEL_PROFILE;
                vcRulesList.push({profile,override,Version, Scenario, Location,Product,GroupID,Type,modelVersion});
            }
        }
//        console.log('_generatePredictions All Rules List: ', vcRulesList); 

    }
    else
    {
        // vcRulesList =  vcRulesListReq;
        for (let index=0; index<vcRulesListReq.length; index++) 
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     ' WHERE "Location" = ' + "'" +   vcRulesListReq[index].Location + "'" +
                     ' AND "GroupID" =' + "'" +   vcRulesListReq[index].GroupID + "'" +
                     ' AND "Type" =' + "'" +   vcRulesListReq[index].Type + "'" +
                     ' AND "Product" =' + "'" +   vcRulesListReq[index].Product + "'" + 
                     ' AND "VERSION" =' + "'" +   vcRulesListReq[index].version + "'" +
                     ' AND "SCENARIO" =' + "'" +   vcRulesListReq[index].scenario + "'" +
                     ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';
            // console.log('sqlStr: ', sqlStr);            
            // stmt = conn.prepare(sqlStr);
            // results=stmt.exec();
            // stmt.drop();
            results = await cds.run(sqlStr);
            // console.log('results: ', results);            

            // results = cds.run(sqlStr);


            for (let rIndex=0; rIndex<results.length; rIndex++) 
            {
                // rIndex is Results Index
                let Location = results[rIndex].Location;
                let Product = results[rIndex].Product;
                let GroupID = results[rIndex].GroupID;
                let Type = results[rIndex].Type;

                // use index from Request as Request Array length > 1
                let modelVersion = vcRulesListReq[index].modelVersion;
                let Version = vcRulesListReq[index].version; //results[rIndex].VERSION;
                let Scenario = vcRulesListReq[index].scenario; //results[rIndex].SCENARIO;
                //let profile = vcRulesListReq[index].profile;
                let override = vcRulesListReq[index].override;


                sqlStr = 'SELECT "MODEL_PROFILE" FROM "CP_OD_MODEL_VERSIONS"' + 
                     ' WHERE "LOCATION_ID" = ' + "'" +   Location + "'" +
                     ' AND "PRODUCT_ID" =' + "'" +   Product + "'" +
                     ' AND CONCAT("OBJ_DEP", CONCAT(' + "'" + '_' + "'" + ',"OBJ_COUNTER")) =' + "'" +   GroupID + "'" +
                     ' AND "OBJ_TYPE" =' + "'" +   Type + "'" +
                     ' AND "MODEL_VERSION" =' + "'" +   modelVersion + "'";
                // console.log('sqlStr: ', sqlStr);            
                // stmt = conn.prepare(sqlStr);
                // let mpResults=stmt.exec();
                // stmt.drop();
                let mpResults = await cds.run(sqlStr);
                // let mpResults = cds.run(sqlStr);
                // console.log('mpResults: ', mpResults);            


                if (mpResults.length > 0)
                {
                    let profile = mpResults[0].MODEL_PROFILE;
                    vcRulesList.push({profile,override,Version, Scenario, Location,Product,GroupID,Type,modelVersion});
                    //vcRulesList.push({profile,override,Version, Scenario, Location,Product,GroupID,Type,modelVersion});
                }

                // vcRulesList[index].Version = results[0].VERSION;
                // vcRulesList[index].Scenario = results[0].SCENARIO;
            }
        }

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
                    ' AND "Type" =' + "'" +   vcRulesList[i].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'" +
                    ' AND "VERSION" =' + "'" +   vcRulesList[i].Version + "'" +
                    ' AND "SCENARIO" =' + "'" +   vcRulesList[i].Scenario + "'";   
        // console.log('sqlStr: ', sqlStr);            
        // stmt=conn.prepare(sqlStr);
        // results=stmt.exec();
        // stmt.drop();

        results = await cds.run(sqlStr);
        // results = cds.run(sqlStr);
        // console.log('V_PREDICTION_TS DISTINCT CHARS results: ', results);            

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
                    ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" +
                    ' AND OBJ_TYPE = ' + "'" + vcRulesList[i].Type + "'" ;
                //  ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
            // console.log('sqlStr: ', sqlStr);            
            // stmt=conn.prepare(sqlStr);
            // results=stmt.exec();
            // stmt.drop();
            results = await cds.run(sqlStr);


            let profileID = 0;
            if (results.length > 0)
            {
                profileID = results[0].PROFILE;
                results = [];
                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                    ' WHERE "PROFILE" = ' + "'" + profileID + "'";
                //console.log('sqlStr: ', sqlStr);            
                // stmt=conn.prepare(sqlStr);
                // results=stmt.exec();
                // stmt.drop();
                results = await cds.run(sqlStr);

                // console.log("CP_PAL_PROFILEMETH_PARA results = ", results)

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
            //console.log('sqlStr: ', sqlStr);            
            // stmt=conn.prepare(sqlStr);
            // results=stmt.exec();
            // stmt.drop();
            results = await cds.run(sqlStr);

            // console.log("CP_PAL_PROFILEMETH_PARA results = ", results)
            if (results.length > 0)
            {
                vcRulesList[i].modelType = results[0].METHOD;
            }
            else
            {
                vcRulesList[i].modelType ="NA"; 
            }
        }
        // console.log(' i = ', i, ' vcRulesList[i].modelType = ',vcRulesList[i].modelType);            

    }
    // conn.disconnect();
    // let createtAt = new Date();
    // let id = uuidv1();
    // let values = [];	

    // values.push({id, createtAt, vcRulesList});    

    // // console.log('values :', values);
    // // console.log('Response completed Time  :', createtAt);

    // if (isGet == true)
    // {
    //     req.reply({values});
    //     // req.reply();
    // }
    // else
    // {
    //     let res = req._.req.res;
    //     // res.statusCode = 201;
    //     res.statusCode = 202;
    //     res.send({values});
    // }
    

    for (let i = 0; i < vcRulesList.length; i++)
    {

        let modelType = vcRulesList[i].modelType;
        if (modelType == "NA")
        { continue;}
        let url;

        var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        // var baseUrl = 'http' + '://' + req.headers.host;
        // console.log('_generatePredictions: protocol', req.headers['x-forwarded-proto'], 'hostName :', req.headers.host);
        if ( modelType == 'HGBT')
            url =  baseUrl + '/pal/hgbtPredictionsV1';
        else if (modelType == 'RDT')
            url = baseUrl + '/pal/rdtPredictions';
        else if (modelType == 'MLR')
            url = baseUrl + '/pal/mlrPredictions';
        else if (modelType == 'VARMA')
            url = baseUrl + '/pal/varmaPredictions';

        // console.log('_generatePredictions: url', url);
        let dataObj =[];
        if (vcRulesList[i].dimensions == 1)
        {
         //   hasCharCount2 = true; 
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 1);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 1);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 1);
            await _postPredictionRequest(req, url,paramsObj,1,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 2)
        {
         //   hasCharCount2 = true; 
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 2);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 2);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 2);
            await _postPredictionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 3)
        {
         //  hasCharCount3 = true; 
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 3);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 3);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 3);
            await _postPredictionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 4)
        {
         //  hasCharCount4 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 4);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 4);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 4);
            await _postPredictionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 5)
        {
         //  hasCharCount5 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 5);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 5);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 5);
            await _postPredictionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 6)
        {
         //  hasCharCount6 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 6);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 6);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 6);
            await _postPredictionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 7)
        {
         //  hasCharCount7 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 7);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 7);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 7);
            await _postPredictionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 8)
        {
          // hasCharCount8 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 8);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 8);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 8);
            await _postPredictionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 9)
        {
          // hasCharCount9 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 9);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 9);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 9);
            await _postPredictionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 10)
        {
          // hasCharCount7 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 10);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 10);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 10);
            await _postPredictionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }  
        else if (vcRulesList[i].dimensions == 11)
        {
          // hasCharCount7 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 11);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 11);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 11);
            await _postPredictionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 12)
        {
          // hasCharCount7 = true;
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 12);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 12);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 12);
            await _postPredictionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        // Wait before posting Next Prediction Request
        // It allows CDS (cqn Query) to commit PalMlrPredictions / PalHgbtPredictions / PalVarmaPredictions
        console.log('_generatePredictions Sleeping for ', dataObj.length*500, ' Milli Seconds');
        console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        await sleep(dataObj.length*500);
        console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);
    }

//    const sleep = require('await-sleep');
//    console.log('_generatePredictions Sleeping for ', 2000*vcRulesList.length, ' Milli Seconds');
//    console.log('_generatePredictions Sleep Start Time',new Date());
//    await sleep(2000*vcRulesList.length);
//    console.log('_generatePredictions Sleep Completed Time',new Date());


    let dataObj = {};
    dataObj["success"] = true;
    dataObj["message"] = "generate Predictions Job Completed Successfully at " +  new Date();


    if (req.headers['x-sap-job-id'] > 0)
    {
        const scheduler = getJobscheduler(req);

        var updateReq = {
            jobId: req.headers['x-sap-job-id'],
            scheduleId: req.headers['x-sap-job-schedule-id'],
            runId: req.headers['x-sap-job-run-id'],
            data : dataObj
            };

            // console.log("generatePredictions job update req",updateReq);

            scheduler.updateJobRunLog(updateReq, function(err, result) {
            if (err) {
                return console.log('Error updating run log: %s', err);
            }
            //Run log updated successfully
            // console.log("generatePredictions job update results",result);

            });
    }
} 

async function _getRuleListTypeForGenModels(vcRulesList, modelType, numChars)
{
    // var conn = hana.createConnection();
    
    // conn.connect(conn_params_container);
    
    // var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // // console.log('sqlStr: ', sqlStr);            
    // var stmt=conn.prepare(sqlStr);
    // var results=stmt.exec();
    // stmt.drop();

    var sqlStr ="";
    var ruleListObj = [];
    for (var i = 0; i < vcRulesList.length; i++)
    {
        if (vcRulesList[i].dimensions == numChars )
        {
            results = [];
            // if (modelType == 'MLR')
            // {
            //     // Check for MLR For Constant value of Attribute across the Time Series
            //     sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Attribute" ' +
            //             'FROM "CP_VC_HISTORY_TS_TEMP" WHERE "Product" = ' + "'" + vcRulesList[i].Product + "'" +
            //             ' AND "Location" = ' + "'" + vcRulesList[i].Location + "'" + 
            //             ' AND "GroupID" = ' + "'" + vcRulesList[i].GroupID + "'" +
            //             ' GROUP BY "Location", "Product", "GroupID", "Attribute"' +
            //             ' HAVING COUNT(DISTINCT "Location", "Product", "GroupID", "Row", "Attribute", "CharCount") = 1';
            //     console.log('_getRuleListTypeForGenModels sqlStr ', sqlStr);

            //     stmt=conn.prepare(sqlStr);
            //     results=stmt.exec();
            //     stmt.drop();
            //     console.log('_getRuleListTypeForGenModels modelType = ', modelType, 'results = ',results, 'results Length = ', results.length);
            // }

            // if ( ((results.length == 0) && (modelType == 'MLR')) ||
            //      (modelType != 'MLR') )
            // {
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
                                ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" +
                                ' AND "OBJ_TYPE" = ' + "'" + vcRulesList[i].Type + "'" ;
                            //  ' AND "MODELTYPE" = ' + "'" + modelType +"'"; 
                    console.log('sqlStr: ', sqlStr);            
                    // stmt=conn.prepare(sqlStr);
                    // results=stmt.exec();
                    // stmt.drop();
                    results = await cds.run(sqlStr);


                    let profileID = 0;
                    if (results.length > 0)
                    {
                        profileID = results[0].PROFILE;
                        results = [];
                        sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                            ' WHERE "PROFILE" = ' + "'" + profileID + "'" +
                            ' AND "METHOD" = ' + "'" + modelType + "'";
                        // console.log('sqlStr: ', sqlStr);            
                        // stmt=conn.prepare(sqlStr);
                        // results=stmt.exec();
                        // stmt.drop();
                        results = await cds.run(sqlStr);

                    // console.log('_getRuleListTypeForGenModels results: ', results);            

                        //let modelType = results[i].ModelType;
                        //let profileID = results[i].ProfileID;
                    //  console.log('_getRuleListTypeForGenModels results ',results, 'results Length = ', results.length);
                        if (results.length > 0)
                        {
                            ruleListObj.push({"Location":vcRulesList[i].Location, 
                                            "Product":vcRulesList[i].Product, 
                                            "GroupID":vcRulesList[i].GroupID, 
                                            "Type":vcRulesList[i].Type, 
                                            "modelVersion":vcRulesList[i].modelVersion,
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
                            ' WHERE "PROFILE" = ' + "'" + vcRulesList[i].profile + "'" +
                            ' AND "METHOD" = ' + "'" + modelType + "'";
                    // console.log('sqlStr: ', sqlStr);            
                    // stmt=conn.prepare(sqlStr);
                    // results=stmt.exec();
                    // stmt.drop();
                    results = await cds.run(sqlStr);

                    if (results.length > 0)
                    {
                        ruleListObj.push({"Location":vcRulesList[i].Location, 
                                        "Product":vcRulesList[i].Product, 
                                        "GroupID":vcRulesList[i].GroupID,
                                        "Type":vcRulesList[i].Type, 
                                        "modelVersion":vcRulesList[i].modelVersion, 
                                        "modelType":results[0].METHOD, 
                                        "profileID":results[0].PROFILE, 
                                        "override":vcRulesList[i].override,
                                        "dimensions" : numChars});
                    }
                }
            //}
        }
    }
    //console.log('_getRuleListTypeForGenModels ruleListObj ',ruleListObj);
    //console.log('_getRuleListTypeForGenModels  ruleListObj[0]',ruleListObj[0]);
    // conn.disconnect();
    return ruleListObj;

}

async function _getParamsObjForGenModels(vcRulesList, modelType, numChars)
{
    // var conn = hana.createConnection();
    
    // conn.connect(conn_params_container);
    // var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // // console.log('sqlStr: ', sqlStr);            
    // var stmt=conn.prepare(sqlStr);
    // var results=stmt.exec();
    // stmt.drop();
    var sqlStr = "";
    var results= [];
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
                            ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" +
                            ' AND "OBJ_TYPE" = ' + "'" + vcRulesList[i].Type + "'" ;
            // console.log(' _getParamsObjForGenModels sqlStr: ', sqlStr);            
            // stmt=conn.prepare(sqlStr);
            // results=stmt.exec();
            // stmt.drop();
            results = await cds.run(sqlStr);
            
            let profileID = 0;
            if (results.length > 0)
            {
                profileID = results[0].PROFILE;
                // console.log("_getParamsObjForGenModels CP_PAL_PROFILEOD profileID =  ", profileID);
                results = [];

                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                            ' WHERE "PROFILE" = ' + "'" + profileID + "'"; 
                // console.log('sqlStr: ', sqlStr);            
                // stmt=conn.prepare(sqlStr);
                // results=stmt.exec();
                // stmt.drop();
                results = await cds.run(sqlStr);

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
            // stmt=conn.prepare(sqlStr);
            // results=stmt.exec();
            // stmt.drop();
            results = await cds.run(sqlStr);

            if (results.length > 0)
            {
                method = results[0].METHOD;
            }
        }
        //console.log('i = ',i, 'modelType :', modelType );
        if (vcRulesList[i].dimensions == numChars)
        {
            let palGroupId =  vcRulesList[i].profileID + '#' + vcRulesList[i].Type + '#' +vcRulesList[i].GroupID + '#' + vcRulesList[i].Location + '#' + vcRulesList[i].Product;

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
                if (numChars > 1 )
                {
                    paramsObj.push({"groupId":palGroupId,"paramName":"EXOGENOUS_VARIABLE","intVal":null,"doubleVal": null,"strVal":"ATT2"});
                }
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
    // conn.disconnect();

    return paramsObj;

}

async function _generateRegModels (req,isGet) {
   var vcRulesListReq = {};
   if (isGet == true)
   {
       vcRulesListReq = JSON.parse(req.data.vcRulesList);
   }
   else
   {
       vcRulesListReq = req.data.vcRulesList;
   }

//    console.log('_generateRegModels vcRulesListReq: ', vcRulesListReq); 
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	
    let message = "Request for Models generation Queued Sucessfully";

    values.push({id, createtAt, message, vcRulesListReq});    

    // console.log('values :', values);
    // console.log('Response completed Time  :', createtAt);


    if (isGet == true)
    {
        req.reply({values});
        // req.reply();
    }
    else
    {
        let res = req._.req.res;
        // res.statusCode = 201;
        res.statusCode = 202;
        res.send({values});
    }

    var url;
    //const modelType = req.data.modelType;

    // https://nodejs.org/api/url.html
    var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
    // var baseUrl = 'http' + '://' + req.headers.host;

    // console.log('_generateRegModels: protocol', req.headers['x-forwarded-proto'], 'hostName :', req.headers.host);

    // console.log('_generateRegModels: url', url);

    // console.log('_generateRegModels VC Rules List: ', vcRulesListReq); 

         
    // // var conn = hana.createConnection();
    
    // conn.connect(conn_params_container);
    
    
    // var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // // console.log('sqlStr: ', sqlStr);            
    // var stmt=conn.prepare(sqlStr);
    // var results=stmt.exec();
    // stmt.drop();

    var sqlStr = "";
    var results= [];
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
           sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS_TEMP"' + 
                    'WHERE "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                    ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                    ' GROUP BY "Location", "Product", "GroupID", "Type" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';
       }
       else if ( (vcRulesListReq[0].Product != "ALL") &&
                 (vcRulesListReq[0].Location == "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS_TEMP"' + 
                    'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
                    ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                    ' GROUP BY "Location", "Product", "GroupID", "Type" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';
       }
       else if ( (vcRulesListReq[0].Product != "ALL") &&
                 (vcRulesListReq[0].Location != "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS_TEMP"' + 
               'WHERE "Product" =' + "'" +   vcRulesListReq[0].Product + "'" +
               ' AND "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
               ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
               ' GROUP BY "Location", "Product", "GroupID", "Type" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';
       }
       else
       {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS_TEMP"' + 
                   // vcRulesListReq[0].tableName + 
                   'WHERE "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                    ' GROUP BY "Location", "Product", "GroupID", "Type"  HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';  
       }
        // console.log('sqlStr: ', sqlStr);            
        // stmt=conn.prepare(sqlStr);
        // results=stmt.exec();
        // stmt.drop();
        // results = await cds.run(sqlStr);
        results = await cds.run(sqlStr);

        for (let index=0; index<results.length; index++) 
        {
            
            let Location = results[index].Location;
            let Product = results[index].Product;
            let GroupID = results[index].GroupID;
            let Type = results[index].Type;
            let modelVersion = vcRulesListReq[0].modelVersion;
            let profile = vcRulesListReq[0].profile;
            let override = vcRulesListReq[0].override;
            vcRulesList.push({profile,override,Location,Product,GroupID,Type,modelVersion});

        }
        //vcRulesList = JSON.stringify(vcRulesList);
        // console.log('_generateRegModels All Rules List: ', vcRulesList); 

    }
    else
    {
        for (var i = 0; i < vcRulesListReq.length; i++)
        {
            sqlStr = 'SELECT  "Location", "Product", "GroupID", "Type" FROM "CP_VC_HISTORY_TS_TEMP" WHERE "Product" =' +
                        "'" +  vcRulesListReq[i].Product + "'" +  
                        ' AND "GroupID" =' + "'" +   vcRulesListReq[i].GroupID + "'" +
                        ' AND "Location" =' + "'" +   vcRulesListReq[i].Location + "'" +
                        ' AND "Type" =' + "'" +   vcRulesListReq[i].Type + "'" +
                        ' GROUP BY "Location", "Product", "GroupID", "Type"' +
                        ' HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > 20';// + 'ORDER BY "WeekOfYear"';   
            // console.log('sqlStr: ', sqlStr);            
            // stmt=conn.prepare(sqlStr);
            // results=stmt.exec();
            // stmt.drop();
            results = await cds.run(sqlStr);

            if (results.length > 0)
            {    
                let Location = results[0].Location;
                let Product = results[0].Product;
                let GroupID = results[0].GroupID;
                let Type = results[0].Type;
                let modelVersion = vcRulesListReq[0].modelVersion;
                let profile = vcRulesListReq[i].profile;
                let override = vcRulesListReq[i].override;
                vcRulesList.push({profile,override,Location,Product,GroupID,Type,modelVersion});

            }
        //vcRulesList =  vcRulesListReq;
        }
    }

    var hasCharCount1, hasCharCount2, hasCharCount3, hasCharCount4, hasCharCount5, hasCharCount6, hasCharCount7, hasCharCount8, hasCharCount9, hasCharCount10, hasCharCount11, hasCharCount12  = false;
    for (var i = 0; i < vcRulesList.length; i++)
    {
        
       // sqlStr = 'SELECT  COUNT(DISTINCT "Characteristic") AS numChars FROM CP_VC_HISTORY_TS_TEMP WHERE "Product" =' +
        sqlStr = 'SELECT  COUNT(DISTINCT "Row") AS numChars FROM "CP_VC_HISTORY_TS_TEMP" WHERE "Product" =' +
                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Type" =' + "'" +   vcRulesList[i].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'";// + 'ORDER BY "WeekOfYear"';   
        // console.log('sqlStr: ', sqlStr);            
        // stmt=conn.prepare(sqlStr);
        // results=stmt.exec();
        // stmt.drop();
        results = await cds.run(sqlStr);

        vcRulesList[i].dimensions = results[0].NUMCHARS;
        if (vcRulesList[i].dimensions == 1)
            hasCharCount1 = true; 
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
    
    //conn.disconnect();

    // let createtAt = new Date();
    // let id = uuidv1();
    // let values = [];	

    // values.push({id, createtAt, vcRulesList});    
   
    // // console.log('values :', values);
    // // console.log('Response completed Time  :', createtAt);


    // if (isGet == true)
    // {
    //     req.reply({values});
    //     // req.reply();
    // }
    // else
    // {
    //     let res = req._.req.res;
    //     // res.statusCode = 201;
    //     res.statusCode = 202;
    //     res.send({values});
    // }
    
//    console.log("Response Headers ", res.getHeaders());
//    res.removeHeader("x-powered-by");
//    res.removeHeader("x-correlation-id");
//    res.removeHeader("odata-version");
//    res.removeHeader("content-type");
//    res.removeHeader("content-length");

//    console.log("Response Headers ", res.getHeaders());


//    req.reply();
console.log('_generateRegModels Start Time',new Date());


if (hasCharCount1 == true)
{
    
    let modelType = 'MLR';

    let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
    if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
    {
        let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

        let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
        url = baseUrl + '/pal/mlrRegressions';
        await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
    }
    
//    
    modelType = 'HGBT';

    ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
    if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
    {
        let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

        let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
        url =  baseUrl + '/pal/hgbtRegressionsV1';
        await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
    }

    modelType = 'RDT';

    ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
    if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
    {
        let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

        let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
        url =  baseUrl + '/pal/rdtRegressions';
        await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
    }

    modelType = 'VARMA';

    ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 1);
    if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
    {
        let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 1);

        let dataObj = await _getDataObjForGenModels(ruleList, modelType, 1);
        url =  baseUrl + '/pal/varmaModels';
        await _postRegressionRequest(req,url,paramsObj,1,dataObj,modelType,ruleList);
    }

}

    if (hasCharCount2 == true)
    {
        
        let modelType = 'MLR';

        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }
        
    //    
        modelType = 'HGBT';

        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }

        modelType = 'RDT';

        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }

        modelType = 'VARMA';

        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 2);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }

    }
    if (hasCharCount3 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'HGBT';
        
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'RDT';
        
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'VARMA';
        
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 3);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount4 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj = await  _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 4);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount5 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 5);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount6 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 6);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
    }
    if (hasCharCount7 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 7);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount8 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj = await _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
        //    let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 8);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
       
        }
    }
    if (hasCharCount9 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
           // let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            //let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 9);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount10 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj = await _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj = await _getParamsObjForGenModels(vcRulesList, modelType, 10);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount11 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 11);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
    }
    if (hasCharCount12 == true)
    {
        let modelType = 'MLR';
        let ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
         //   let paramsObj =  await _getParamsObjForGenModels(vcRulesList, modelType, 12);
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
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
    console.log('_generateRegModels End Time',new Date());

    // const sleep = require('await-sleep');
    // console.log('_generateRegModels Sleeping for ', 500*vcRulesList.length, ' Milli Seconds');
    // console.log('_generateRegModels Sleep Start Time',new Date());
    // await sleep(500*vcRulesList.length);
    // console.log('_generateRegModels Sleep Completed Time',new Date());

    let dataObj = {};
    dataObj["success"] = true;
    dataObj["message"] = "generate Models Job Completed Successfully at " +  new Date();

    if (req.headers['x-sap-job-id'] > 0)
    {
        const scheduler = getJobscheduler(req);

        var updateReq = {
            jobId: req.headers['x-sap-job-id'],
            scheduleId: req.headers['x-sap-job-schedule-id'],
            runId: req.headers['x-sap-job-run-id'],
            data : dataObj
            };

        // console.log("generateModels job update req",updateReq);

        scheduler.updateJobRunLog(updateReq, function(err, result) {
        if (err) {
            return console.log('Error updating run log: %s', err);
        }
        //Run log updated successfully
        // console.log("generate Models job update results",result);

        });
    }

}


async function _getDataObjForGenModels(vcRulesList, modelType, numChars) {

    // var conn = hana.createConnection();
    
/*
    console.log("serverNode : ",conn_params.serverNode);
    console.log("uid : ",conn_params.uid);
    console.log("pwd : ",conn_params.pwd);
*/
    // conn.connect(conn_params_container);

    //var sqlStr;
    //var stmt;
    // var sqlStr = 'SET SCHEMA ' + containerSchema;  
    // // console.log('sqlStr: ', sqlStr);            
    // var stmt=conn.prepare(sqlStr);
    // var results=stmt.exec();
    // stmt.drop();

    var sqlStr = "";
    var results= [];
    var dataObj = [];	

    for (var i = 0; i < vcRulesList.length; i++)
    {

        if ( (modelType == 'HGBT') ||
             (modelType == 'RDT') )
        {
            sqlStr = 'SELECT DISTINCT "Attribute", "' + vcConfigTimePeriod + 
                    '", SUM("CharCountPercent") AS "CharCount", SUM("TargetPercent") AS "Target" FROM "CP_VC_HISTORY_TS_TEMP" WHERE "Product" =' +

                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Type" = ' + "'" + vcRulesList[i].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'" + 
                    ' GROUP BY "Attribute", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "Attribute"';
        }
        else
        {
            sqlStr = 'SELECT DISTINCT "Attribute", "' + vcConfigTimePeriod + 
                    '", SUM("CharCount") AS "CharCount", SUM("Target") AS "Target" FROM "CP_VC_HISTORY_TS_TEMP" WHERE "Product" =' +

                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Type" = ' + "'" + vcRulesList[i].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'" + 
                    ' GROUP BY "Attribute", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "Attribute"';
        }

        // console.log('_getDataObjForGenModels sqlStr :',sqlStr, 'i = ', i);
        // stmt=conn.prepare(sqlStr);
        // results=stmt.exec();
        // stmt.drop();
        results = await cds.run(sqlStr);

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
                if ( (index == 0) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att1 = att1 + 0.00001;
                target = results[index].Target;
            }
            else if (charIdx % numChars == 1)
            {
                att2 = results[index].CharCount;
                if ( (index == 1) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att2 = att2 + 0.00001;
            }
            else if (charIdx % numChars == 2)
            {
                att3 = results[index].CharCount;
                if ( (index == 2) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att3 = att3 + 0.00001;
            }
            else if (charIdx % numChars == 3)
            {
                att4 = results[index].CharCount;
                if ( (index == 3) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att4 = att4 + 0.00001;
            }
            else if (charIdx % numChars == 4)
            {
                att5 = results[index].CharCount;
                if ( (index == 4) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att5 = att5 + 0.00001;
            }
            else if (charIdx % numChars == 5)
            {
                att6 = results[index].CharCount;
                if ( (index == 5) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att6 = att6 + 0.00001;
            }
            else if (charIdx % numChars == 6)
            {
                att7 = results[index].CharCount;
                if ( (index == 6) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att7 = att7 + 0.00001;
            }
            else if (charIdx % numChars == 7)
            {
                att8 = results[index].CharCount;
                if ( (index == 7) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att8 = att8 + 0.00001;
            }
            else if (charIdx % numChars == 8)
            {
                att9 = results[index].CharCount;
                if ( (index == 8) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att9 = att9 + 0.00001;
            }
            else if (charIdx % numChars == 9)
            {
                att10 = results[index].CharCount;
                if ( (index == 9) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att10 = att10 + 0.00001;
            }
            else if (charIdx % numChars == 10)
            {
                att11 = results[index].CharCount;
                if ( (index == 10) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att11 = att11 + 0.00001;
            }
            else if (charIdx % numChars == 11)
            {
                att12 = results[index].CharCount;
                if ( (index == 11) &&
                     ( (modelType == 'MLR') || (modelType == 'VARMA')) )
                    att12 = att12 + 0.00001;
            }
            charIdx  = charIdx + 1;
            let palGroupId =  vcRulesList[i].profileID + '#' +  vcRulesList[i].Type + '#' + vcRulesList[i].GroupID + '#' + vcRulesList[i].Location + '#' + vcRulesList[i].Product;

            if (charIdx % numChars == 0)
            {
                if (numChars == 1)
                {
                    dataObj.push({"groupId":palGroupId, "ID": distinctPeriodIdx,"att1":att1,"target": target});
                }
                else if (numChars == 2)
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
    // conn.disconnect();
//    console.log('_getDataObjForGenModels ', dataObj);
//    console.log('_getDataObjForGenModels ',JSON.stringify(dataObj));
    return dataObj;
   
}

async function _postRegressionRequest(req,url,paramsObj,numChars,dataObj,modelType,vcRuleListObj)
{
    var request = require('request');
    var options;
    let username = "SBPTECHTEAM";
    let password = "Sbpcorp@22";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    // console.log("_postRegressionRequest - AUTH", auth);
    // console.log("vcRuleListObj ", vcRuleListObj);

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
            "modelVersion" : vcRuleListObj[0].modelVersion,
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
            "modelVersion" : vcRuleListObj[0].modelVersion,
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
            "modelVersion" : vcRuleListObj[0].modelVersion,
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
            "modelVersion" : vcRuleListObj[0].modelVersion,
            "controlParameters": paramsObj,
            "varmaType": numChars,
            "varmaData": dataObj
        })

        };
    }
    await request(options, async function (error, response) {
        console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if (error) {
            let errObj = {};
            errObj["success"] = false;
            errObj["message"] = "generate Models Job Failed StatusCode : ", response.statusCode, " ERROR : " + error + " AT " + new Date();


            if (req.headers['x-sap-job-id'] > 0)
            {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data : errObj
                    };

                // console.log("generateModels job update req",updateReq);

                scheduler.updateJobRunLog(updateReq, function(err, result) {
                if (err) {
                    return console.log('Error updating run log: %s', err);
                }
                //Run log updated successfully
                // console.log("generateModels job update results",result);

                });
            }

            throw new Error(error);
        }
        // if (response.statusCode == 423)
        // {
        //     let responseData = JSON.parse(response.body);
        //     console.log('responseData ', responseData);
        // }
        if (response.statusCode == 200)
        {

            let responseData = JSON.parse(response.body);
        //    console.log('hgbt responseData ', responseData);

            var cqnQuery = "";
            if (modelType == 'HGBT')
            {
                // console.log('hgbt regressionsID ', responseData.value[0].hgbtID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [

                    {   regressionsID: responseData.value[0].hgbtID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
            }
            else if (modelType == 'RDT')
            {
  
                //   console.log('rdt regressionsID ', responseData.value[0].rdtID);
                  cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
  
                      {   regressionsID: responseData.value[0].rdtID, 
                          createdAt : responseData.value[0].createdAt, 
                          modelType : modelType,
                          vcRulesList : vcRuleListObj
                      }
                  ]}}
              }
            else if (modelType == 'MLR')
            {
              //  console.log('mlr regressionsID ', responseData.value[0].mlrID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
                    {   regressionsID: responseData.value[0].mlrID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
            }
            else if (modelType == 'VARMA')
            {
                // console.log('varma ID ', responseData.value[0].varmaID);
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
                    {   regressionsID: responseData.value[0].varmaID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
            }

            //    console.log('cqnQuery ', cqnQuery);
            await cds.run(cqnQuery);
// Commenting as Job Scheduler marsks updateReq as success while other Models gen are in Progress

            // let successObj = {};
            // successObj["success"] = true;

            // for (let modelsIdx = 0; modelsIdx <vcRuleListObj.length; modelsIdx++)
            // {
            //     successObj["message"] = 'generate Models Response StatusCode : ' + response.statusCode + ' AT :' + new Date() +
            //                          '\n Response Details :' + 
            //                          '\n Models ID :' + cqnQuery.INSERT.entries[0].regressionsID +
            //                          '\n createdAt :' + cqnQuery.INSERT.entries[0].createdAt +
            //                          '\n modelType :' + cqnQuery.INSERT.entries[0].modelType +
            //                          '\n Location : ' + vcRuleListObj[modelsIdx].Location +
            //                          '\n Product : ' + vcRuleListObj[modelsIdx].Product +
            //                          '\n Group ID : ' + vcRuleListObj[modelsIdx].GroupID +
            //                          '\n Type : ' + vcRuleListObj[modelsIdx].Type +
            //                          '\n modelVersion : ' + vcRuleListObj[modelsIdx].modelVersion +
            //                          '\n profileID : ' + vcRuleListObj[modelsIdx].profileID +
            //                          '\n override : ' + vcRuleListObj[modelsIdx].override +
            //                          '\n dimensions : ' + vcRuleListObj[modelsIdx].dimensions ;


            //     if (req.headers['x-sap-job-id'] > 0)
            //     {
            //         const scheduler = getJobscheduler(req);

            //         var updateReq = {
            //             jobId: req.headers['x-sap-job-id'],
            //             scheduleId: req.headers['x-sap-job-schedule-id'],
            //             runId: req.headers['x-sap-job-run-id'],
            //             data : successObj
            //             };

            //         console.log("generatePredictions job update req",updateReq);

            //         scheduler.updateJobRunLog(updateReq, function(err, result) 
            //         {
            //             if (err) {
            //                 return console.log('Error updating run log: %s', err);
            //             }

            //         })
            //     }
            // }
        }
        else
        {
            console.error('_postRegressionRequest - error:', error); // Print the error if one occurred

            let errorObj = {};
            errorObj["success"] = false;
 
            errorObj["message"] = 'ERROR generate Models Response StatusCode : ' + response.statusCode + ' AT ' + new Date() +
                                     '\n Response Details :' + 
                                     '\n Location : ' + vcRuleListObj[0].Location +
                                     '\n Product : ' + vcRuleListObj[0].Product +
                                     '\n Type : ' + vcRuleListObj[0].Type +
                                     '\n Models generation Response : ' + JSON.parse(response.body);
                                    //  '\n Group ID : ' + vcRuleListObj[0].GroupID +
                                    //  '\n Type : ' + vcRuleListObj[0].Type +
                                    //  '\n modelVersion : ' + vcRuleListObj[0].modelVersion +
                                    //  '\n Version : ' + vcRuleListObj[0].Version +
                                    //  '\n Scenario : ' + vcRuleListObj[0].Scenario;
            if (req.headers['x-sap-job-id'] > 0)
            {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data : errorObj
                    };

                // console.log("generatePredictions job update req",updateReq);

                scheduler.updateJobRunLog(updateReq, function(err, result) {
                if (err) {
                    return console.log('Error updating run log: %s', err);
                }


                });
            }
        }
    });
}