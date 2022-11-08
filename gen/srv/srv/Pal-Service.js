const cds = require('@sap/cds')
const { v1: uuidv1} = require('uuid')
const hana = require('@sap/hana-client');
const rp = require('request-promise');

const conn_params = {
    serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
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
const minBuckets = 10;
const predictionsTimeout = 10000; // 10 seconds for now

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
        console.log('Inputs: ', req.data);   
 
        _genTimeSeriesData(req);   
     
    })

    srv.on ('generateModels',    async req => {
        return (await _generateRegModels(req,false));   
    })


    srv.on ('genPredictions',    async req => {
        return (await _generatePredictions(req,false));
    })


    srv.on ('fgModels',    async req => {
        return (await _generateRegModels(req,true));   
    })


    srv.on ('fgPredictions',    async req => {
        return (await _generatePredictions(req,true));
    })


 }


function _genTimeSeriesData(req)
{
    console.log('_genTimeSeriesData: ', req.data);   
}
async function _getParamsObjForPredictions(vcRulesList, index, modelType, numChars)
{
    var paramsObj = [];

    let palGroupId = vcRulesList[index].profileID + '#' + vcRulesList[index].Type + '#' + vcRulesList[index].GroupID + '#'  + vcRulesList[index].Location + '#' + vcRulesList[index].Product;

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

    return paramsObj;

}

async function _getRuleListTypeForPredictions(vcRulesList, idx, numChars)
{
    var ruleListObj = [];

    if (vcRulesList[idx].dimensions == numChars )
    {
        ruleListObj.push({"modelVersion":vcRulesList[idx].modelVersion,"Location":vcRulesList[idx].Location, "Product":vcRulesList[idx].Product, "GroupID":vcRulesList[idx].GroupID, "Type":vcRulesList[idx].Type,"Profile":vcRulesList[idx].profile,"Version":vcRulesList[idx].Version,"Scenario":vcRulesList[idx].Scenario,"dimensions" : numChars});
    }
    return ruleListObj;
}

async function _getDataObjForPredictions(vcRulesList, idx, modelType, numChars) {

   
    var results= [];
    var sqlStr = "";
    var dataObj = [];	

    let str = JSON.stringify(vcRulesList[idx]);
    let obj = JSON.parse(str);
    let arrayKeys = Object.keys(obj);
    let arrayVals = Object.values(obj);
    let hasStartDate = false;
    let hasEndDate = false;
    for (let arrayIndex = 0; arrayIndex < arrayKeys.length; arrayIndex++)
    { 
        if ( (arrayKeys[arrayIndex] == 'startDate') &&
                (arrayVals[arrayIndex] != "") )
            hasStartDate = true;
        else if ( (arrayKeys[arrayIndex] == 'endDate') &&
                    (arrayVals[arrayIndex] != "") )
            hasEndDate = true;
    }

    let startDateSql = "";
    let endDateSql = "";
    if (hasStartDate == true)
        startDateSql =  ' AND "PERIOD_NUM" >= CONCAT( YEAR (TO_DATE (\'' + vcRulesList[idx].startDate + '\'' + ', \'YYYY-MM-DD\')), lpad(WEEK (TO_DATE(\'' + vcRulesList[idx].startDate + '\'' +', \'YYYY-MM-DD\')),\'2\',\'00\') )';
    if (hasEndDate == true)   
        endDateSql =  ' AND "PERIOD_NUM" <= CONCAT( YEAR (TO_DATE (\'' + vcRulesList[idx].endDate + '\'' +', \'YYYY-MM-DD\')), lpad(WEEK (TO_DATE(\'' + vcRulesList[idx].endDate + '\'' + ', \'YYYY-MM-DD\')),\'2\',\'00\') ) ';


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
                    startDateSql + endDateSql +
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

        results = await cds.run(sqlStr);


        let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12;
        let charIdx = 0;
        let distinctPeriodIdx = 0;
        for (let index=0; index<results.length; index++) 
        {
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
//    console.log('_getDataObjForPredictions ',JSON.stringify(dataObj));
    return dataObj;
   
}

async function _postPredictionRequest(req,url,paramsObj,numChars,dataObj,modelType,vcRuleListObj)
{
    var request = require('request');
    var options;
    let username = conn_params.uid; 
    let password = conn_params.pwd; 
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");


    if (modelType == 'HGBT')
    {
        options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization' : auth
        },
        'timeout': predictionsTimeout,

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
        'timeout': predictionsTimeout,
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
        'timeout': predictionsTimeout,
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
        'timeout': predictionsTimeout,
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

    let ret_response ="";
    let error = false;

    console.log('_postPredictionRequest Request Time = ', new Date());

    await rp(options)
    .then(function (response) {
        console.log('_postPredictionRequest Response Time = ', new Date());
        // console.log('Response   = ', response);
        // ret_response = JSON.parse(response);
        ret_response = response;
        
    })
    .catch(function (err) {
       console.log('_postPredictionRequest - Error ', err);
       ret_response = err;
       error = true;

    });


    if (error == false)
    {
        let cqnQuery = "";
        let responseData = JSON.parse(ret_response);

        if (modelType == 'HGBT')
        {
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
            cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENPREDICTIONS'] }, entries: [
                {   predictionsID: responseData.value[0].varmaID, 
                    createdAt : responseData.value[0].createdAt, 
                    modelType : modelType,
                    vcRulesList : vcRuleListObj
                }
            ]}}

        }

        await cds.run(cqnQuery);

    }
    else
    {


        let errorObj = {};
        errorObj["success"] = false;

        errorObj["message"] = 'ERROR generate Predictions ' + ret_response + ' AT ' + new Date() +
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


            scheduler.updateJobRunLog(updateReq, function(err, result) {
            if (err) {
                return console.log('Error updating run log: %s', err);
            }


            });
        }

    }
}


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


 if (isGet == true)
 {
     req.reply({values});
 }
 else
 {
     let res = req._.req.res;
     res.statusCode = 202;
     res.send({values});
 }
 

   const sleep = require('await-sleep');

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

        let str = JSON.stringify(vcRulesListReq[0]);
        let obj = JSON.parse(str);
        let arrayKeys = Object.keys(obj);
        let arrayVals = Object.values(obj);
        let hasStartDate = false;
        let hasEndDate = false;
        for (let arrayIndex = 0; arrayIndex < arrayKeys.length; arrayIndex++)
        { 
            if ( (arrayKeys[arrayIndex] == 'startDate') &&
                 (arrayVals[arrayIndex] != "") )
                hasStartDate = true;
            else if ( (arrayKeys[arrayIndex] == 'endDate') &&
                      (arrayVals[arrayIndex] != "") )
                hasEndDate = true;
        }

        let startDateSql = "";
        let endDateSql = "";
        if (hasStartDate == true)
            startDateSql =  ' AND "PERIOD_NUM" >= CONCAT( YEAR (TO_DATE (\'' + vcRulesListReq[0].startDate + '\'' + ', \'YYYY-MM-DD\')), lpad(WEEK (TO_DATE(\'' + vcRulesListReq[0].startDate + '\'' +', \'YYYY-MM-DD\')),\'2\',\'00\') )';
        if (hasEndDate == true)   
            endDateSql =  ' AND "PERIOD_NUM" <= CONCAT( YEAR (TO_DATE (\'' + vcRulesListReq[0].endDate + '\'' +', \'YYYY-MM-DD\')), lpad(WEEK (TO_DATE(\'' + vcRulesListReq[0].endDate + '\'' + ', \'YYYY-MM-DD\')),\'2\',\'00\') ) ';

        if ( (vcRulesListReq[0].Location != "ALL") &&
             (vcRulesListReq[0].Product == "ALL") )
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     'WHERE "Location" =' + "'" +   vcRulesListReq[0].Location + "'" +
                     ' AND "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                     ' AND "VERSION" =' + "'" +   vcRulesListReq[0].version + "'" +
                     ' AND "SCENARIO" =' + "'" +   vcRulesListReq[0].scenario + "'" +
                      startDateSql    + endDateSql +              
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
                     startDateSql    + endDateSql +              
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
                startDateSql    + endDateSql +              
                ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';
        }
        else
        {
            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                    ' GROUP BY "Location", "Product", "GroupID", "VERSION", "SCENARIO"';  
                ' WHERE "Type" =' + "'" +   vcRulesListReq[0].Type + "'" +
                ' AND "VERSION" =' + "'" +   vcRulesListReq[0].version + "'" +
                ' AND "SCENARIO" =' + "'" +   vcRulesListReq[0].scenario + "'" +
                startDateSql    + endDateSql +              
               ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';  
        }

        console.log("vcRuleListReqSql ", sqlStr);
        results = await cds.run(sqlStr);

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
            let override = vcRulesListReq[0].override;
            let startDate ="";
            let endDate = "";
            if(hasStartDate == true)
                startDate = vcRulesListReq[0].startDate;
            if(hasEndDate == true) 
                endDate = vcRulesListReq[0].endDate;


            sqlStr = 'SELECT "MODEL_PROFILE" FROM "CP_OD_MODEL_VERSIONS"' + 
                     ' WHERE "LOCATION_ID" = ' + "'" +   Location + "'" +
                     ' AND "PRODUCT_ID" =' + "'" +   Product + "'" +
                     ' AND CONCAT("OBJ_DEP", CONCAT(' + "'" + '_' + "'" + ',"OBJ_COUNTER")) =' + "'" +   GroupID + "'" +
                     ' AND "OBJ_TYPE" =' + "'" +   Type + "'" +
                     ' AND "MODEL_VERSION" =' + "'" +   modelVersion + "'"; 

            let mpResults = await cds.run(sqlStr);

            if (mpResults.length > 0)
            {
                let profile = mpResults[0].MODEL_PROFILE;
                vcRulesList.push({profile,override,Version, Scenario, Location,Product,GroupID,Type,modelVersion,startDate,endDate});
            }
        }

    }
    else
    {
        for (let index=0; index<vcRulesListReq.length; index++) 
        {

            let str = JSON.stringify(vcRulesListReq[index]);
            let obj = JSON.parse(str);
            let arrayKeys = Object.keys(obj);
            let arrayVals = Object.values(obj);
            let hasStartDate = false;
            let hasEndDate = false;
            for (let arrayIndex = 0; arrayIndex < arrayKeys.length; arrayIndex++)
            { 
                if ( (arrayKeys[arrayIndex] == 'startDate') &&
                     (arrayVals[arrayIndex] != "") )
                    hasStartDate = true;
                else if ( (arrayKeys[arrayIndex] == 'endDate') &&
                          (arrayVals[arrayIndex] != "") )
                    hasEndDate = true;
            }
            let startDateSql = "";
            let endDateSql = "";
            if (hasStartDate == true)
                startDateSql =  ' AND "PERIOD_NUM" >= CONCAT( YEAR (TO_DATE (\'' + vcRulesListReq[0].startDate + '\'' +', \'YYYY-MM-DD\')), lpad(WEEK (TO_DATE(\'' + vcRulesListReq[0].startDate + '\'' +', \'YYYY-MM-DD\')),\'2\',\'00\') )';
            if (hasEndDate == true)   
                endDateSql =  ' AND "PERIOD_NUM" <= CONCAT( YEAR (TO_DATE (\'' + vcRulesListReq[0].endDate  + '\'' + ',\'YYYY-MM-DD\')), lpad(WEEK (TO_DATE(\'' + vcRulesListReq[0].endDate + '\'' +', \'YYYY-MM-DD\')),\'2\',\'00\') )';

            sqlStr = 'SELECT DISTINCT "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "V_PREDICTION_TS"' + 
                     ' WHERE "Location" = ' + "'" +   vcRulesListReq[index].Location + "'" +
                     ' AND "GroupID" =' + "'" +   vcRulesListReq[index].GroupID + "'" +
                     ' AND "Type" =' + "'" +   vcRulesListReq[index].Type + "'" +
                     ' AND "Product" =' + "'" +   vcRulesListReq[index].Product + "'" + 
                     ' AND "VERSION" =' + "'" +   vcRulesListReq[index].version + "'" +
                     ' AND "SCENARIO" =' + "'" +   vcRulesListReq[index].scenario + "'" +
                     startDateSql    + endDateSql +              
                     ' GROUP BY "Location", "Product", "GroupID", "Type", "VERSION", "SCENARIO"';
            console.log("vcRuleListReqSql ", sqlStr);
            results = await cds.run(sqlStr);

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
                let startDate = "";
                let endDate = "";
                if(hasStartDate == true)
                    startDate = vcRulesListReq[index].startDate;
                if(hasEndDate == true) 
                    endDate = vcRulesListReq[index].endDate;


                sqlStr = 'SELECT "MODEL_PROFILE" FROM "CP_OD_MODEL_VERSIONS"' + 
                     ' WHERE "LOCATION_ID" = ' + "'" +   Location + "'" +
                     ' AND "PRODUCT_ID" =' + "'" +   Product + "'" +
                     ' AND CONCAT("OBJ_DEP", CONCAT(' + "'" + '_' + "'" + ',"OBJ_COUNTER")) =' + "'" +   GroupID + "'" +
                     ' AND "OBJ_TYPE" =' + "'" +   Type + "'" +
                     ' AND "MODEL_VERSION" =' + "'" +   modelVersion + "'";

                let mpResults = await cds.run(sqlStr);


                if (mpResults.length > 0)
                {
                    let profile = mpResults[0].MODEL_PROFILE;
                    vcRulesList.push({profile,override,Version, Scenario, Location,Product,GroupID,Type,modelVersion,startDate,endDate});
                }

            }
        }

    }

   for (let i = 0; i < vcRulesList.length; i++)
    {
        
        sqlStr = 'SELECT  COUNT(DISTINCT "Row") AS numChars FROM "V_PREDICTION_TS" WHERE "Product" =' +
                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GroupID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "Type" =' + "'" +   vcRulesList[i].Type + "'" +
                    ' AND "Location" =' + "'" +   vcRulesList[i].Location + "'" +
                    ' AND "VERSION" =' + "'" +   vcRulesList[i].Version + "'" +
                    ' AND "SCENARIO" =' + "'" +   vcRulesList[i].Scenario + "'";   
        results = await cds.run(sqlStr);
 

        vcRulesList[i].dimensions = results[0].NUMCHARS;
        
        if (vcRulesList[i].override == false)
        {

            sqlStr = 'SELECT * FROM "CP_PAL_PROFILEOD"' +
                    ' WHERE "PRODUCT_ID" = ' + "'" + vcRulesList[i].Product + "'" + 
                    ' AND "LOCATION_ID" = ' + "'" + vcRulesList[i].Location + "'" + 
                    ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" +
                    ' AND OBJ_TYPE = ' + "'" + vcRulesList[i].Type + "'" ;

            results = await cds.run(sqlStr);


            let profileID = 0;
            if (results.length > 0)
            {
                profileID = results[0].PROFILE;
                results = [];
                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                    ' WHERE "PROFILE" = ' + "'" + profileID + "'";

                results = await cds.run(sqlStr);


                if(results.length > 0)
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

            results = await cds.run(sqlStr);

            if (results.length > 0)
            {
                vcRulesList[i].modelType = results[0].METHOD;
            }
            else
            {
                vcRulesList[i].modelType ="NA"; 
            }
        }

    }
 

    for (let i = 0; i < vcRulesList.length; i++)
    {

        let modelType = vcRulesList[i].modelType;
        if (modelType == "NA")
        { continue;}
        let url;

        var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
        // var baseUrl = 'http' + '://' + req.headers.host;

        if ( modelType == 'HGBT')
            url =  baseUrl + '/pal/hgbtPredictionsV1';
        else if (modelType == 'RDT')
            url = baseUrl + '/pal/rdtPredictions';
        else if (modelType == 'MLR')
            url = baseUrl + '/pal/mlrPredictions';
        else if (modelType == 'VARMA')
            url = baseUrl + '/pal/varmaPredictions';

        let dataObj =[];
        if (vcRulesList[i].dimensions == 1)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 1);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 1);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 1);
            await _postPredictionRequest(req, url,paramsObj,1,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 2)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 2);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 2);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 2);
            await _postPredictionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 3)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 3);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 3);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 3);
            await _postPredictionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 4)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 4);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 4);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 4);
            await _postPredictionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 5)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 5);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 5);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 5);
            await _postPredictionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 6)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 6);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 6);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 6);
            await _postPredictionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 7)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 7);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 7);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 7);
            await _postPredictionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }         
        else if (vcRulesList[i].dimensions == 8)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 8);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 8);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 8);
            await _postPredictionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 9)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 9);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 9);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 9);
            await _postPredictionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        } 
        else if (vcRulesList[i].dimensions == 10)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 10);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 10);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 10);
            await _postPredictionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }  
        else if (vcRulesList[i].dimensions == 11)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 11);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 11);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 11);
            await _postPredictionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        else if (vcRulesList[i].dimensions == 12)
        {
            let ruleList = await _getRuleListTypeForPredictions(vcRulesList, i, 12);
            let paramsObj =  await _getParamsObjForPredictions(vcRulesList, i, modelType, 12);
            dataObj = await _getDataObjForPredictions(vcRulesList, i, modelType, 12);
            await _postPredictionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        // Wait before posting Next Prediction Request
        // It allows CDS (cqn Query) to commit PalMlrPredictions / PalHgbtPredictions / PalVarmaPredictions
        // if (dataObj.length <=5)
        // {
        //     console.log('_generatePredictions Sleeping for ', dataObj.length*800, ' Milli Seconds', 'Intervals =' , dataObj.length);
        //     console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        //     await sleep(dataObj.length*800);
        //     console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);
        // }
        // else if (dataObj.length <=10)
        // {
        //     console.log('_generatePredictions Sleeping for ', dataObj.length*400, ' Milli Seconds', 'Intervals =' , dataObj.length);
        //     console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        //     await sleep(dataObj.length*400);
        //     console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);
        // }
        // else if (dataObj.length <=20)
        // {
        //     console.log('_generatePredictions Sleeping for ', dataObj.length*200, ' Milli Seconds', 'Intervals =' , dataObj.length);
        //     console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        //     await sleep(dataObj.length*200);
        //     console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);
        // }
        // else if (dataObj.length <=25)
        // {
        //     console.log('_generatePredictions Sleeping for ', dataObj.length*150, ' Milli Seconds', 'Intervals =' , dataObj.length);
        //     console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        //     await sleep(dataObj.length*150);
        //     console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);
        // }
        // else
        // {
        //     console.log('_generatePredictions Sleeping for ', dataObj.length*100, ' Milli Seconds', 'Intervals =' , dataObj.length);
        //     console.log('_generatePredictions Sleep Start Time',new Date(), 'charcount ', 'index ',i, 'dimensions', vcRulesList[i].dimensions);
        //     await sleep(dataObj.length*100);
        //     console.log('_generatePredictions Sleep Completed Time',new Date(), 'charcount ', vcRulesList[i].dimensions);

        // }
    }


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

            scheduler.updateJobRunLog(updateReq, function(err, result) {
            if (err) {
                return console.log('Error updating run log: %s', err);
            }

            });
    }
} 

async function _getRuleListTypeForGenModels(vcRulesList, modelType, numChars)
{


    var sqlStr ="";
    var ruleListObj = [];
    for (var i = 0; i < vcRulesList.length; i++)
    {
        if (vcRulesList[i].dimensions == numChars )
        {
            results = [];

                if (vcRulesList[i].override == false)
                {
 
                    sqlStr = 'SELECT * FROM "CP_PAL_PROFILEOD"' +
                                ' WHERE "PRODUCT_ID" = ' + "'" + vcRulesList[i].Product + "'" + 
                                ' AND "LOCATION_ID" = ' + "'" + vcRulesList[i].Location + "'" + 
                                ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" +
                                ' AND "OBJ_TYPE" = ' + "'" + vcRulesList[i].Type + "'" ;
                    console.log('sqlStr: ', sqlStr);            

                    results = await cds.run(sqlStr);


                    let profileID = 0;
                    if (results.length > 0)
                    {
                        profileID = results[0].PROFILE;
                        results = [];
                        sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                            ' WHERE "PROFILE" = ' + "'" + profileID + "'" +
                            ' AND "METHOD" = ' + "'" + modelType + "'";

                        results = await cds.run(sqlStr);

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

    return ruleListObj;

}

async function _getParamsObjForGenModels(vcRulesList, modelType, numChars)
{

    var sqlStr = "";
    var results= [];
    var paramsObj = [];
    var method = 0;
    for (var i = 0; i < vcRulesList.length; i++)
    {

        if (vcRulesList[i].override == false)
        {

            sqlStr = 'SELECT * FROM "CP_PAL_PROFILEOD"' +
                            ' WHERE "PRODUCT_ID" = ' + "'" + vcRulesList[i].Product + "'" + 
                            ' AND "LOCATION_ID" = ' + "'" + vcRulesList[i].Location + "'" + 
                            ' AND "OBJ_DEP" = ' + "'" + vcRulesList[i].GroupID + "'" +
                            ' AND "OBJ_TYPE" = ' + "'" + vcRulesList[i].Type + "'" ;

            results = await cds.run(sqlStr);
            
            let profileID = 0;
            if (results.length > 0)
            {
                profileID = results[0].PROFILE;
                results = [];

                sqlStr = 'SELECT * FROM "CP_PAL_PROFILEMETH_PARA"' +
                            ' WHERE "PROFILE" = ' + "'" + profileID + "'"; 

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

            results = await cds.run(sqlStr);

            if (results.length > 0)
            {
                method = results[0].METHOD;
            }
        }
        if (vcRulesList[i].dimensions == numChars)
        {
            let palGroupId =  vcRulesList[i].profileID + '#' + vcRulesList[i].Type + '#' +vcRulesList[i].GroupID + '#' + vcRulesList[i].Location + '#' + vcRulesList[i].Product;

            for (let index=0; index<results.length; index++) 
            {
                paramsObj.push({"groupId":palGroupId, 
                                "paramName":results[index].PARA_NAME, 
                                "intVal":results[index].INTVAL,
                                "doubleVal": results[index].DOUBLEVAL, 
                                "strVal" : results[index].STRVAL});

            }

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

    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	
    let message = "Request for Models generation Queued Sucessfully";

    values.push({id, createtAt, message, vcRulesListReq});    

    if (isGet == true)
    {
        req.reply({values});
        // req.reply();
    }
    else
    {
        let res = req._.req.res;
        res.statusCode = 202;
        res.send({values});
    }

    var url;

    var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host; 
    // var baseUrl = 'http' + '://' + req.headers.host;


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
           sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
                    ' WHERE "LOCATION_ID" =' + "'" +   vcRulesListReq[0].Location + "'" +
                    ' AND "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
                    ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";
       }
       else if ( (vcRulesListReq[0].Product != "ALL") &&
                 (vcRulesListReq[0].Location == "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
                    ' WHERE "PRODUCT_ID" =' + "'" +   vcRulesListReq[0].Product + "'" +
                    ' AND "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
                    ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";
       }
       else if ( (vcRulesListReq[0].Product != "ALL") &&
                 (vcRulesListReq[0].Location != "ALL") )
       {
           sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
               ' WHERE "PRODUCT_ID" =' + "'" +   vcRulesListReq[0].Product + "'" +
               ' AND "LOCATION_ID" =' + "'" +   vcRulesListReq[0].Location + "'" +
               ' AND "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
               ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";
       }
       else
       {
            sqlStr = 'SELECT DISTINCT "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE", COUNT(DISTINCT "' + vcConfigTimePeriod + '") AS "NumberOfPeriods"  FROM "CP_VC_HISTORY_TS"' + 
                   // vcRulesListReq[0].tableName + 
                   ' WHERE "TYPE" =' + "'" +   vcRulesListReq[0].Type + "'" +
                    ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE"  HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";  
       }



        results = await cds.run(sqlStr);
        // console.log('_generateRegModels vcRulesList sqlStr ', sqlStr );
        // console.log('_generateRegModels vcRulesList sqlStr results', results );


        for (let index=0; index<results.length; index++) 
        {
            
            let Location = results[index].LOCATION_ID;
            let Product = results[index].PRODUCT_ID;
            let GroupID = results[index].GROUP_ID;
            let Type = results[index].TYPE;
            let modelVersion = vcRulesListReq[0].modelVersion;
            let profile = vcRulesListReq[0].profile;
            let override = vcRulesListReq[0].override;
            vcRulesList.push({profile,override,Location,Product,GroupID,Type,modelVersion});

        }

    }
    else
    {
        for (var i = 0; i < vcRulesListReq.length; i++)
        {
            sqlStr = 'SELECT  "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE" FROM "CP_VC_HISTORY_TS" WHERE "PRODUCT_ID" =' +
                        "'" +  vcRulesListReq[i].Product + "'" +  
                        ' AND "GROUP_ID" =' + "'" +   vcRulesListReq[i].GroupID + "'" +
                        ' AND "LOCATION_ID" =' + "'" +   vcRulesListReq[i].Location + "'" +
                        ' AND "TYPE" =' + "'" +   vcRulesListReq[i].Type + "'" +
                        ' GROUP BY "LOCATION_ID", "PRODUCT_ID", "GROUP_ID", "TYPE"' +
                        ' HAVING COUNT(DISTINCT "' + vcConfigTimePeriod + '") > ' + "'" + minBuckets + "'";// + 'ORDER BY "WeekOfYear"';   
            results = await cds.run(sqlStr);
            // console.log('_generateRegModels vcRulesList ELSE sqlStr ', sqlStr, 'index = ', i );
            // console.log('_generateRegModels vcRulesList ELSE sqlStr results', results );
    
            if (results.length > 0)
            {    
                let Location = results[0].LOCATION_ID;
                let Product = results[0].PRODUCT_ID;
                let GroupID = results[0].GROUP_ID;
                let Type = results[0].TYPE;
                let modelVersion = vcRulesListReq[0].modelVersion;
                let profile = vcRulesListReq[i].profile;
                let override = vcRulesListReq[i].override;
                vcRulesList.push({profile,override,Location,Product,GroupID,Type,modelVersion});

            }
        }
    }

    var hasCharCount1, hasCharCount2, hasCharCount3, hasCharCount4, hasCharCount5, hasCharCount6, hasCharCount7, hasCharCount8, hasCharCount9, hasCharCount10, hasCharCount11, hasCharCount12  = false;
    for (var i = 0; i < vcRulesList.length; i++)
    {
        
        sqlStr = 'SELECT  COUNT(DISTINCT "ROW") AS numChars FROM "CP_VC_HISTORY_TS" WHERE "PRODUCT_ID" =' +
                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GROUP_ID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "TYPE" =' + "'" +   vcRulesList[i].Type + "'" +
                    ' AND "LOCATION_ID" =' + "'" +   vcRulesList[i].Location + "'";// + 'ORDER BY "WeekOfYear"';   
        // console.log('_generateRegModels sqlStr ', sqlStr );

        results = await cds.run(sqlStr);
        // console.log('_generateRegModels results ', results );


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
        
           console.log('_generateRegModels index i = ', i, ' vcRulesList[i].dimensions = ',vcRulesList[i].dimensions);

    }
    
 console.log('_generateRegModels Start Time',new Date());
//  console.log('_generateRegModels vcRulesList ',vcRulesList);




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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }
        
        modelType = 'HGBT';

        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }

        modelType = 'RDT';

        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 2);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 2);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,2,dataObj,modelType,ruleList);
        }

        modelType = 'VARMA';

        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 2);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'HGBT';
        
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'RDT';
        
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 3);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 3);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,3,dataObj,modelType,ruleList);
        }

        modelType = 'VARMA';
        
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 3);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 4);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 4);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,4,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 4);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 5);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 5);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,5,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 5);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 6);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 6);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,6,dataObj,modelType,ruleList);

        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 6);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 7);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 7);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,7,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 7);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 8);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 8);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,8,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 8);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 9);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 9);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,9,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 9);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 10);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 10);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,10,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 10);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 11);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 11);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,11,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 11);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
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
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url = baseUrl + '/pal/mlrRegressions';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'HGBT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/hgbtRegressionsV1';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'RDT';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/rdtRegressions';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
        modelType = 'VARMA';
        ruleList = await _getRuleListTypeForGenModels(vcRulesList, modelType, 12);
        if ( (ruleList.length > 0) && ruleList[0].modelType == modelType)
        {
            let paramsObj =  await _getParamsObjForGenModels(ruleList, modelType, 12);

            let dataObj = await _getDataObjForGenModels(ruleList, modelType, 12);
            url =  baseUrl + '/pal/varmaModels';
            await _postRegressionRequest(req,url,paramsObj,12,dataObj,modelType,ruleList);
        }
    }
 
    console.log('_generateRegModels End Time',new Date());

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

        scheduler.updateJobRunLog(updateReq, function(err, result) {
        if (err) {
            return console.log('Error updating run log: %s', err);
        }
 
        });
    }

}


async function _getDataObjForGenModels(vcRulesList, modelType, numChars) {

    var sqlStr = "";
    var results= [];
    var dataObj = [];	

    for (var i = 0; i < vcRulesList.length; i++)
    {

        if ( (modelType == 'HGBT') ||
             (modelType == 'RDT') )
        {
            sqlStr = 'SELECT DISTINCT "ATTRIBUTE", "' + vcConfigTimePeriod + 
                    '", SUM("CHAR_COUNT_RATE") AS "CharCount", SUM("GROUP_COUNT_RATE") AS "Target" FROM "CP_VC_HISTORY_TS" WHERE "PRODUCT_ID" =' +

                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GROUP_ID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "TYPE" = ' + "'" + vcRulesList[i].Type + "'" +
                    ' AND "LOCATION_ID" =' + "'" +   vcRulesList[i].Location + "'" + 
                    ' GROUP BY "ATTRIBUTE", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "ATTRIBUTE"';
        }
        else
        {
            sqlStr = 'SELECT DISTINCT "ATTRIBUTE", "' + vcConfigTimePeriod + 
                    '", SUM("CHAR_COUNT") AS "CharCount", SUM("GROUP_COUNT") AS "Target" FROM "CP_VC_HISTORY_TS" WHERE "PRODUCT_ID" =' +

                    "'" +  vcRulesList[i].Product + "'" +  
                    ' AND "GROUP_ID" =' + "'" +   vcRulesList[i].GroupID + "'" +
                    ' AND "TYPE" = ' + "'" + vcRulesList[i].Type + "'" +
                    ' AND "LOCATION_ID" =' + "'" +   vcRulesList[i].Location + "'" + 
                    ' GROUP BY "ATTRIBUTE", "' + vcConfigTimePeriod + '"' +
                    ' ORDER BY "' + vcConfigTimePeriod + '", "ATTRIBUTE"';
        }

        results = await cds.run(sqlStr);

        let att1, att2, att3, att4, att5, att6, att7, att8, att9, att10, att11, att12, target;
        let charIdx = 0;
        let distinctPeriodIdx = 0;
        for (let index=0; index<results.length; index++) 
        {
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

    return dataObj;
   
}

async function _postRegressionRequest(req,url,paramsObj,numChars,dataObj,modelType,vcRuleListObj)
{
    var request = require('request');
    var options;
    let username = "SBPTECHTEAM";
    let password = "Sbpcorp@22";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

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


                scheduler.updateJobRunLog(updateReq, function(err, result) {
                if (err) {
                    return console.log('Error updating run log: %s', err);
                }

                });
            }

            throw new Error(error);
        }

        if (response.statusCode == 200)
        {

            let responseData = JSON.parse(response.body);

            var cqnQuery = "";
            if (modelType == 'HGBT')
            {
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
                cqnQuery = {INSERT:{ into: { ref: ['CP_PALGENREGRESSIONMODELS'] }, entries: [
                    {   regressionsID: responseData.value[0].varmaID, 
                        createdAt : responseData.value[0].createdAt, 
                        modelType : modelType,
                        vcRulesList : vcRuleListObj
                    }
                ]}}
            }

            await cds.run(cqnQuery);

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

            if (req.headers['x-sap-job-id'] > 0)
            {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data : errorObj
                    };

                scheduler.updateJobRunLog(updateReq, function(err, result) {
                if (err) {
                    return console.log('Error updating run log: %s', err);
                }


                });
            }
        }
    });
}