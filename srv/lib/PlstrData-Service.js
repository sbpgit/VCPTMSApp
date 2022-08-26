const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
const { v1: uuidv1} = require('uuid')


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

module.exports = async function (srv) {

  srv.on ('genMasterData',    async req => {
     return (await _genMasterData(req,false));
  })

  srv.on ('fgenMasterData',    async req => {
    return (await _genMasterData(req,true));
  })


  async function _genMasterData(req,isGet) {

    var reqData = "Request for Master Data Generation Queued Sucessfully";

    console.log("_genMasterData reqData : ", reqData);
    let createtAt = new Date();
    let id = uuidv1();
    let values = [];	
  
    values.push({id, createtAt, reqData});    

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

    let sqlStr ='UPSERT PLSTR_PRODUCT ("PRODUCT_ID", "PROD_DESC", "PROD_FAMILY", "PROD_GROUP", "PROD_MODEL")' +
                 ' SELECT DISTINCT PNO12_PRODUCT, PRODUCT_NAME, PRODUCT_ID , \'CARS\', MODEL FROM "PLSTR_DATA"';
    console.log("PLSTR PRODUCTS sqlStr ", sqlStr);

    let results = await cds.run(sqlStr);
    console.log("PLSTR PRODUCTS  ", results);


    // sqlStr = 'UPSERT PLSTR_LOCATION VALUES ('  +
    //                 '\'PL20\'' + ',' + '\'PL20 Location\'' + ')' + ' WITH PRIMARY KEY';
 
    sqlStr = 'UPSERT PLSTR_LOCATION("LOCATION_ID","LOCATION_DESC")' +
                ' SELECT \'PL20\', \'PL20 Location\' FROM DUMMY';

    console.log("PLSTR LOCATION sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR LOCATION  ", results);

    sqlStr = 'UPSERT PLSTR_CLASS("CLASS_NUM","CLASS_NAME","CLASS_TYPE","CLASS_DESC")' +
             ' SELECT \'9999\', \'FG_Variants\', \'300\', \'Class_FG_003\' FROM DUMMY';

    console.log("PLSTR CLASS sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR CLASS  ", results);

    sqlStr = 'UPSERT PLSTR_PRODUCT_CLASS ("PRODUCT_ID", "CLASS_NUM", "CREATED_BY")' +
					  ' SELECT DISTINCT "PRODUCT_ID", \'99999\',\'SBP\' FROM PLSTR_PRODUCT';


    console.log("PLSTR PRODUCT CLASS sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR PRODUCT CLASS  ", results);


    sqlStr = 'UPSERT PLSTR_LOCATION_PRODUCT ("LOCATION_ID", "PRODUCT_ID")' +
					  ' SELECT DISTINCT \'PL20\', PRODUCT_ID FROM PLSTR_PRODUCT';


    console.log("PLSTR_LOCATION_PRODUCT sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PPLSTR_LOCATION_PRODUCT  ", results);



    sqlStr = 'UPSERT PLSTR_CHARACTERISTICS ("CLASS_NUM", "CHAR_NUM", "CHAR_NAME", "CHAR_DESC","CHAR_GROUP","CHAR_TYPE")' +
                ' SELECT DISTINCT  \'99999\',"CHAR_NUM", "CHAR_NAME", "CHAR_DESC","CHAR_GROUP","CHAR_TYPE" FROM PLSTR_CHAR_CHARNUM';


    console.log("PLSTR PLSTR_CHARACTERISTICS sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR_CHARACTERISTICS  ", results);

    sqlStr = 'SELECT DISTINCT "CHAR_NAME", "CHAR_NUM", "CHAR_DESC" FROM "PLSTR_CHAR_CHARNUM"';
    console.log("PLSTR_CHAR_CHARNUM sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR_CHAR_CHARNUM  ", results);

    for(let rIndex = 0; rIndex < results.length; rIndex++)
    {
        let sqlPlstrData = "";
        let charDesc = results[rIndex].CHAR_DESC;
        if (charDesc != null)
            sqlPlstrData = 'SELECT DISTINCT ' +  results[rIndex].CHAR_NAME + "," + results[rIndex].CHAR_DESC + ' FROM PLSTR_DATA' + 
                             ' WHERE ' +  results[rIndex].CHAR_NAME + '!= \'null\'';
        else
            sqlPlstrData = 'SELECT DISTINCT ' +  results[rIndex].CHAR_NAME + ' FROM PLSTR_DATA' + 
                            ' WHERE ' +  results[rIndex].CHAR_NAME + '!= \'null\'';
        console.log("PLSTR_DATA CHAR sqlPlstrData ", sqlPlstrData);

        let plstrDataResults = await cds.run(sqlPlstrData); 
        console.log("PLSTR_CHAR_VALUES  ", plstrDataResults);
        str = plstrDataResults.length.toString(),
        len = str.length;
        let prefix ="";
        if (len == 1)
        {
            prefix = '000';
        }
        else if (len == 2)
        {
            prefix = '00';
        }
        else if (len == 3)
        {
            prefix = '0';
        }
        // console.log("PLSTR_CHAR_VALUES prefix ", prefix);
        let charvalNumIndex = 0;
        for(charvalIndex = 0; charvalIndex < plstrDataResults.length; charvalIndex++ )
        {
            charvalNumIndex ++;
            let charNum = results[rIndex].CHAR_NUM;
            let charvalNum = results[rIndex].CHAR_NUM + '_' + prefix + charvalNumIndex; //rIndex + 1;

            

            let str = JSON.stringify(plstrDataResults[charvalIndex]);
            let obj = JSON.parse(str);
            let arrayVals = Object.values(obj);

            let charName = arrayVals[0];
            let chavalDesc = 'NULL';
            if(arrayVals.length > 1)
                chavalDesc = arrayVals[1];
            console.log("charNum = ", charNum, "charName = ",charName, "charvalNum = ",charvalNum, "chavalDesc = ",chavalDesc);
            
            sqlStr = 'UPSERT PLSTR_CHAR_VALUES VALUES (' +
                    "'" + charNum + "'" + "," +
                    "'" + charvalNum + "'" + "," +
                    "'" + charName + "'" + "," +
                    "'" + chavalDesc + "'" + "," +
                    'null' +')' + ' WITH PRIMARY KEY';

            console.log("PLSTR_CHAR_VALUES sqlStr", sqlStr);

            let charValResults = await cds.run(sqlStr);
            console.log("PLSTR_CHAR_VALUES  ", charValResults);

        }


        // SALES HISTORY

        // sqlStr = 'select * FROM PLSTR_DATA';
        // results = await cds.run(sqlStr);
        // for(let shIndex = 0; shIndex < results.length; shIndex++)
        // {
        //     console.log("results [",shIndex,"]"," = ", results[shIndex]);
        //     if (shIndex = 50)
        //         break;
        // }



        // sqlStr = 'UPSERT PLSTR_SALESH VALUES (' +
        //             "'" + charNum + "'" + "," +
        //             "'" + charvalNum + "'" + "," +
        //             "'" + charName + "'" + "," +
        //             "'" + chavalDesc + "'" + "," +
        //             'null' +')' + ' WITH PRIMARY KEY';


    }

    // for (let index = 0; index < results.length; index ++)
    // {
       
    //     sqlStr = 'UPSERT "PLSTR_PRODUCT" VALUES (' +
    //                         "'" + results[index].PRODUCT_ID + "'" + "," +
    //                         "'" + results[index].PROD_DESC + "'," +
    //                         "'" + results[index].PROD_FAMILY + "'," +
    //                         "'" + results[index].PROD_GROUP + "'," +
    //                         "'" + results[index].PROD_MODEL + "'," +
    //                         null  + "," +
    //                         null  + "," +
    //                         null  + "," +
    //                         null  + "," +
    //                         null  + "," +
    //                         null  + "," +
    //                         null  + "," +
    //                         null  + ')' + ' WITH PRIMARY KEY';        

    //     await cds.run(sqlStr);
    // }




    let dataObj = {};
    dataObj["success"] = true;
    dataObj["message"] = "update Master Data Completed Successfully at " +  new Date();


    // if (req.headers['x-sap-job-id'] > 0)
    // {
    //     const scheduler = getJobscheduler(req);

    //     var updateReq = {
    //         jobId: req.headers['x-sap-job-id'],
    //         scheduleId: req.headers['x-sap-job-schedule-id'],
    //         runId: req.headers['x-sap-job-run-id'],
    //         data : dataObj
    //         };

    //         scheduler.updateJobRunLog(updateReq, function(err, result) {
    //         if (err) {
    //             return console.log('Error updating run log: %s', err);
    //         }

    //         });
    // }

  }

};
