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

    let sqlStr ='UPSERT PLSTR_PRODUCT ("PRODUCT_ID", "PROD_DESC", "PROD_FAMILY", "PROD_GROUP", "PROD_SERIES", "RESERVE_FIELD1","RESERVE_FIELD2")' +
                    ' SELECT DISTINCT PRODUCT_ID, PRODUCT_NAME, MODEL ,\'CARS\',MOTOR_CODE, SALES_VERSION_ID , DENOMINATION FROM "PLSTR_DATA"';
                //  ' SELECT DISTINCT PNO12_PRODUCT, PRODUCT_NAME, PRODUCT_ID , \'CARS\', MODEL FROM "PLSTR_DATA"';
    console.log("PLSTR PRODUCTS sqlStr ", sqlStr);

    let results = await cds.run(sqlStr);
    console.log("PLSTR PRODUCTS  ", results);


    // sqlStr = 'UPSERT PLSTR_LOCATION VALUES ('  +
    //                 '\'PL20\'' + ',' + '\'PL20 Location\'' + ')' + ' WITH PRIMARY KEY';
 
    sqlStr = 'UPSERT PLSTR_LOCATION("LOCATION_ID","LOCATION_DESC","LOCATION_TYPE")' +
                ' SELECT \'PL20\', \'PL20 Location\' , \'2\'FROM DUMMY';

    console.log("PLSTR LOCATION sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR LOCATION  ", results);

    sqlStr = 'UPSERT PLSTR_CLASS("CLASS_NUM","CLASS_NAME","CLASS_TYPE","CLASS_DESC")' +
             ' SELECT \'55555\', \'PS2_Class\', \'300\', \'PS2_Class_003\' FROM DUMMY';

    console.log("PLSTR CLASS sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR CLASS  ", results);

    sqlStr = 'UPSERT PLSTR_PRODUCT_CLASS ("PRODUCT_ID", "CLASS_NUM", "CREATED_BY")' +
					  ' SELECT DISTINCT "PRODUCT_ID", \'55555\',\'SBP\' FROM PLSTR_PRODUCT';


    console.log("PLSTR PRODUCT CLASS sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PLSTR PRODUCT CLASS  ", results);


    sqlStr = 'UPSERT PLSTR_LOCATION_PRODUCT ("LOCATION_ID", "PRODUCT_ID","LOTSIZE_KEY","LOT_SIZE", "PROCUREMENT_TYPE","PLANNING_STRATEGY")' +
					  ' SELECT DISTINCT \'PL20\', PRODUCT_ID, \'EX\',' +  1 + ' , \'E\',  \'56\' FROM PLSTR_PRODUCT';


    console.log("PLSTR_LOCATION_PRODUCT sqlStr ", sqlStr);

    results = await cds.run(sqlStr);
    console.log("PPLSTR_LOCATION_PRODUCT  ", results);



    sqlStr = 'UPSERT PLSTR_CHARACTERISTICS ("CLASS_NUM", "CHAR_NUM", "CHAR_NAME", "CHAR_DESC","CHAR_GROUP","CHAR_TYPE","ENTRY_REQ")' +
                ' SELECT DISTINCT  \'55555\',"CHAR_NUM", "CHAR_NAME", "CHAR_DESC","CHAR_GROUP","CHAR_TYPE", \'Y\' FROM PLSTR_CHAR_CHARNUM';


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
        if (charDesc != '')
            sqlPlstrData = 'SELECT DISTINCT ' +  results[rIndex].CHAR_NAME + "," + results[rIndex].CHAR_DESC + ' FROM PLSTR_DATA' + 
                             ' WHERE ' +  results[rIndex].CHAR_NAME + '!= \'null\'';
        else
            sqlPlstrData = 'SELECT DISTINCT ' +  results[rIndex].CHAR_NAME + ', ' +  results[rIndex].CHAR_NAME + ' FROM PLSTR_DATA' + 
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
            else
            chavalDesc = arrayVals[0];
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






        // sqlStr = 'UPSERT PLSTR_SALESH VALUES (' +
        //             "'" + charNum + "'" + "," +
        //             "'" + charvalNum + "'" + "," +
        //             "'" + charName + "'" + "," +
        //             "'" + chavalDesc + "'" + "," +
        //             'null' +')' + ' WITH PRIMARY KEY';


    }

    // SALES HISTORY

    sqlStr = 'select * FROM PLSTR_DATA';
    plstrData = await cds.run(sqlStr);

    console.log("PLSTR_DATA rows", plstrData.length);

    // var plstrJson = JSON.stringify(plstrData);
    const salesDocBaseID = 900000;
    const salesDocItem = 50;
    const sheduledLineNum = 10;
    const uom = 'EA';

    
    for(let shIndex = 0; shIndex < plstrData.length; shIndex++)
    {
        let salesDocId = salesDocBaseID + plstrData[shIndex].UNIQUE_ID;

        // console.log("SALES_DOC ", salesDocId, "SALESDOC_ITEM ",salesDocItem,
        //             "SCHEDULELINE_NUM", sheduledLineNum,
        //             "DOC_CREATEDDATE ", plstrData[shIndex].START_DATE,
        //             "PRODUCT_ID ", plstrData[shIndex].PRODUCT_ID,
        //             "UOM ", uom,
        //             "CONFIRMED_QTY ",plstrData[shIndex].HANDOVERS_COUNT,
        //             "ORD_QTY ",plstrData[shIndex].HANDOVERS_COUNT,
        //             "MAT_AVAILDATE ",plstrData[shIndex].START_DATE,
        //             "CUSTOMER_GROUP ",plstrData[shIndex].COUNTRY + '_'+plstrData[shIndex].SALES_TYPE,
        //             "LOCATION_ID ",'PL20',
        //             "CREATED_BY ",'SBP',
        //             "CREATED_DATE ",plstrData[shIndex].START_DATE

        //             );

        sqlStr = 'UPSERT PLSTR_SALESH VALUES (' +
                    "'" + salesDocId + "'" + "," +
                    "'" + salesDocItem + "'" + "," +
                    "'" + plstrData[shIndex].START_DATE + "'" + "," +
                    "'" + sheduledLineNum + "'" + "," +
                    "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                    "''" + "," +
                    "'" + uom + "'" + "," +
                    "'" + plstrData[shIndex].HANDOVERS_COUNT + "'" + "," +
                    "'" + plstrData[shIndex].HANDOVERS_COUNT + "'" + "," +
                    "'" + plstrData[shIndex].START_DATE + "'" + "," +
                    "'" + 9999999 + "'" + "," +
                    "'" + plstrData[shIndex].COUNTRY + "'" + "," +
                    "'PL20'" + "," +
                    "'" + plstrData[shIndex].START_DATE + "'" + "," +
                    "''" + "," +
                    "'" + plstrData[shIndex].START_DATE + "'" + "," +
                    "'SBP'" + "," +
                    "''" + "," +
                    "''" +')' + ' WITH PRIMARY KEY';

        // console.log("PLSTR_SALESH VALUES sqlStr", sqlStr);

        let saleshResults = await cds.run(sqlStr);
        // console.log("PLSTR_SALESH  ", saleshResults);
        console.log("PLSTR_SALESH salesDoc ", salesDocId, "shIndex ",shIndex);

        let sqlSaleConfig = 'SELECT DISTINCT MODEL, MOTOR_CODE, DENOMINATION, SALES_VERSION_ID, BODY_VERSION, TRANSMISSION, STEERING, ' +
                            ' MARKET_CODE, EXTERIOR_ID, INTERIOR, OPT_WHEELS,  OPT_PERFORM, OPT_PLUS, OPT_PILOT, OPT_PILOT_LITE, OPT_TOWBAR' +
                            ' FROM PLSTR_DATA WHERE ' +  
                            ' UNIQUE_ID = ' + "'" + plstrData[shIndex].UNIQUE_ID + "'";
        
        // console.log(" sqlSaleConfig ", sqlSaleConfig);

        let salesConfigResults = await cds.run(sqlSaleConfig);
        // console.log(" salesConfigResults ", salesConfigResults);

        let sqlSalesCfgCharCharval = '';
        if( plstrData[shIndex].MODEL != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].MODEL + "'";        
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);
   
        }

        if( plstrData[shIndex].MOTOR_CODE != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].MOTOR_CODE + "'";        
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);
   
        }

        if( plstrData[shIndex].DENOMINATION != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].DENOMINATION + "'";        
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);
   
        }
        // console.log(" sqlSalesCfgCharCharval ", sqlSalesCfgCharCharval);


        if( plstrData[shIndex].SALES_VERSION_ID != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].SALES_VERSION_ID + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }


        if( plstrData[shIndex].BODY_VERSION != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].BODY_VERSION + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].TRANSMISSION != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].TRANSMISSION + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].STEERING != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].STEERING + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].MARKET_CODE != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].MARKET_CODE + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }


        if( plstrData[shIndex].EXTERIOR_ID != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].EXTERIOR_ID + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].INTERIOR != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].INTERIOR + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].OPT_WHEELS != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].OPT_WHEELS + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].OPT_PERFORM != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].OPT_PERFORM + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].OPT_PLUS != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].OPT_PLUS + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].OPT_PILOT != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].OPT_PILOT + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }

        if( plstrData[shIndex].OPT_PILOT_LITE != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].OPT_PILOT_LITE + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }


        if( plstrData[shIndex].OPT_TOWBAR != 'NULL')
        {
            sqlSalesCfgCharCharval = 'UPSERT PLSTR_SALESH_CONFIG ("SALES_DOC", "SALESDOC_ITEM", ' + 
                                     '"CHAR_NUM", "CHARVAL_NUM","PRODUCT_ID","CHANGED_DATE", ' +
                                     '"CREATED_DATE", "CREATED_BY" '+')' +
                                     ' SELECT ' + 
                                     "'" + salesDocId + "'" + "," +
                                     "'" + salesDocItem + "'" + "," +
                                     'charval."CHAR_NUM", charval."CHARVAL_NUM",' +
                                     "'" + plstrData[shIndex].PRODUCT_ID + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'" + plstrData[shIndex].START_DATE + "'" + "," +
                                     "'SBP'" +
                                     ' FROM PLSTR_CHARACTERISTICS AS charc' +
                                     ' INNER JOIN PLSTR_CHAR_VALUES AS charval ON '+
                                     ' charc.CHAR_NUM = charval.CHAR_NUM' + 
                                     ' WHERE charval.CHAR_VALUE = ' +  "'" + plstrData[shIndex].OPT_TOWBAR + "'";
            let sqlSalesCfgCharCharvalResults = await cds.run(sqlSalesCfgCharCharval);

        }
        // console.log(" sqlSalesCfgCharCharval ", sqlSalesCfgCharCharval);
        // console.log(" salesConfigResults ", sqlSalesCfgCharCharvalResults);
        // if (shIndex == 0)
        //      break;
        if( shIndex % 1000 == 0)
           await cds.run('COMMIT');
    }

    sqlStr = 'UPSERT PLSTR_SALESH (SALES_DOC, SCHEDULELINE_NUM, DOC_CREATEDDATE, PRODUCT_ID, ' +
               'UOM, CONFIRMED_QTY,ORD_QTY, MAT_AVAILDATE,CUSTOMER_GROUP,LOCATION_ID,CREATED_BY,CREATED_DATE)' +
				' SELECT DISTINCT ' + "'" + salesDocId + "'" 
                                    + "'" + salesDocItem + "'" +
                                    + "'" + sheduledLineNum + "'" +
                                    + "'" + sheduledLineNum + "'" +

                ' \'PL20\', PRODUCT_ID FROM PLSTR_PRODUCT';
    for (let index = 0; index < results.length; index ++)
    {
       
        sqlStr = 'UPSERT "PLSTR_PRODUCT" VALUES (' +
                            "'" + results[index].PRODUCT_ID + "'" + "," +
                            "'" + results[index].PROD_DESC + "'," +
                            "'" + results[index].PROD_FAMILY + "'," +
                            "'" + results[index].PROD_GROUP + "'," +
                            "'" + results[index].PROD_MODEL + "'," +
                            null  + "," +
                            null  + "," +
                            null  + "," +
                            null  + "," +
                            null  + "," +
                            null  + "," +
                            null  + "," +
                            null  + ')' + ' WITH PRIMARY KEY';        

        await cds.run(sqlStr);
    }




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
