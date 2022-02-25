const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require('@sap/hana-client');
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
// const conn_params_container= {
//     serverNode  : "b3117009-beb5-4b3f-a851-c379293f8579.hana.prod-us10.hanacloud.ondemand.com" + ":" + "443",
//     uid         : "22E31DBAE729415AB87E36A13434327D_8AKT1T2RZWK448YCBFEX989YE_RT", //process.env.uidClassicalSchema, //cf environment variable
//     pwd         : "Cm6.XYRMVE8WEI-QmSs6sSbdniWlVDC4m7z12pwdY2G5RxytgPfoyj1Jm3lMTmnWBfxJTiC9uCYsAc_-pp4LdhtwyX9VXCglz1jNe5PjuFeQGFbX345wPiRriL6UQzge", //process.env.uidClassicalSchemaPassword,//cf environment variable
//     encrypt: 'TRUE',
//     ssltruststore: cds.env.requires.hana.credentials.certificate
// };
const containerSchema = cds.env.requires.db.credentials.schema;
const conn_params_container = {
    serverNode  : cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
    uid         : cds.env.requires.db.credentials.user, //cds userid environment variable
    pwd         : cds.env.requires.db.credentials.password,//cds password environment variable
    encrypt: 'TRUE',
    ssltruststore: cds.env.requires.hana.credentials.certificate
};
class GenTimeseries {
  constructor() {
    /** Define Logger */
    this.logger = createLogger({
      format: combine(
        label({ label: "Timeseries" }),
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: "log/ts-generation.log",
        }),
      ],
    });

//    this.genTimeseriesF();
  }

  /**
   * Generate Timeseries
   */
  async genTimeseries(adata) {
    var conn = hana.createConnection(),
    result, stmt;
 
    conn.connect(conn_params_container);
    var sqlStr = 'SET SCHEMA ' + containerSchema; 
    // console.log('sqlStr: ', sqlStr);  
    try {
        stmt=conn.prepare(sqlStr);
        result=stmt.exec();
        stmt.drop();
        
    } catch (error) {
        console.log(error);
    }          
    const lStartTime = new Date();
    this.logger.info("Started timeseries Service");

    /** Get Sales History */
    const liSalesHead = await cds.run(
        `SELECT *
            FROM CP_SALESH 
            WHERE "LOCATION_ID" = '`
            + adata.LOCATION_ID + `'
            AND "PRODUCT_ID" = '`
            + adata.PRODUCT_ID + `'
            ORDER BY 
                "LOCATION_ID" ASC, 
                "PRODUCT_ID" ASC,
                "MAT_AVAILDATE" ASC`
    );

    let liSalesInfo = [];
    let liOrdRate   = [];
    let lsSalesInfo = {};
    let lsOrdRate   = {};
// Consolidate for Week Days    
    for (let i = 0; i < liSalesHead.length; i++) {
      
      // Remove existing data based on location
      if ( liSalesHead[i].LOCATION_ID !== liSalesHead[GenFunctions.subOne(i, liSalesHead.length)].LOCATION_ID ||
           i                          === 0 
      ) {
        await cds.run(
            DELETE.from("CP_TS_OBJDEP_CHARHDR").where({
                xpr: [
                { ref: ["LOCATION_ID"] }, "=", { val: liSalesHead[i].LOCATION_ID },
                ],
            })
        );

        await cds.run(
            DELETE.from("CP_TS_OBJDEPHDR").where({
                xpr: [
                { ref: ["LOCATION_ID"] }, "=", { val: liSalesHead[i].LOCATION_ID },
                ],
            })
        );
         
        await cds.run(
            DELETE.from("CP_TS_ORDERRATE").where({
                xpr: [
                { ref: ["LOCATION_ID"] }, "=", { val: liSalesHead[i].LOCATION_ID },
                ],
            })
        );               
          
      }

      lsSalesInfo.LOCATION_ID = GenFunctions.parse(liSalesHead[i].LOCATION_ID);
      lsSalesInfo.PRODUCT_ID  = GenFunctions.parse(liSalesHead[i].PRODUCT_ID);
      lsSalesInfo.CAL_DATE    = GenFunctions.getNextSunday(liSalesHead[i].MAT_AVAILDATE);
      
      if (!lsSalesInfo.ORD_QTY) lsSalesInfo.ORD_QTY = 0;
      lsSalesInfo.ORD_QTY = parseInt(lsSalesInfo.ORD_QTY) + parseInt(liSalesHead[i].ORD_QTY);

      if ( liSalesHead[i].LOCATION_ID !== liSalesHead[GenFunctions.addOne(i, liSalesHead.length)].LOCATION_ID ||
           liSalesHead[i].PRODUCT_ID  !== liSalesHead[GenFunctions.addOne(i, liSalesHead.length)].PRODUCT_ID ||
           liSalesHead[GenFunctions.addOne(i, liSalesHead.length)].MAT_AVAILDATE > lsSalesInfo.CAL_DATE ||
           i === GenFunctions.addOne(i, liSalesHead.length)
      ) {
        liSalesInfo.push(GenFunctions.parse(lsSalesInfo));
        lsOrdRate.WEEK_DATE   = lsSalesInfo.CAL_DATE;
        lsOrdRate.LOCATION_ID = lsSalesInfo.LOCATION_ID;
        lsOrdRate.ORDER_COUNT = lsSalesInfo.ORD_QTY;
        liOrdRate.push(GenFunctions.parse(lsOrdRate));
        lsSalesInfo = {};
      }
    }

    liOrdRate.sort(GenFunctions.dynamicSortMultiple("WEEK_DATE","LOCATION_ID"));
    let liOrdRateTemp = [];
    let lOrdCount = 0;
    var tableObjR = [], rowObjR = [];
    for (let lOrdInd = 0; lOrdInd < liOrdRate.length; lOrdInd++) {
        lOrdCount = parseInt(lOrdCount) + parseInt(liOrdRate[lOrdInd].ORDER_COUNT);
        if( liOrdRate[lOrdInd].WEEK_DATE !== liOrdRate[GenFunctions.addOne(lOrdInd,liOrdRate.length)].WEEK_DATE ||
            liOrdRate[lOrdInd].LOCATION_ID !== liOrdRate[GenFunctions.addOne(lOrdInd,liOrdRate.length)].LOCATION_ID ||
            lOrdInd === GenFunctions.addOne(lOrdInd,liOrdRate.length)){
                lsOrdRate = {};
                rowObjR = [];
                lsOrdRate = GenFunctions.parse(liOrdRate[lOrdInd]);
                lsOrdRate.ORDER_COUNT = lOrdCount;
                rowObjR.push(lsOrdRate.WEEK_DATE, lsOrdRate.LOCATION_ID, lsOrdRate.ORDER_COUNT);
                tableObjR.push(rowObjR)
                liOrdRateTemp.push(GenFunctions.parse(lsOrdRate));
                lOrdCount = 0;
        }
    }

    try {
        await cds.run(
          INSERT.into("CP_TS_ORDERRATE").entries(liOrdRateTemp)
        );
        // var sqlStr = 'INSERT INTO "CP_TS_ORDERRATE"' + '(WEEK_DATE, LOCATION_ID, ORDER_COUNT) VALUES(?, ?, ?)';
        // var stmt = conn.prepare(sqlStr);
        // stmt.execBatch(tableObjR);
        // stmt.drop();
      } catch (e) {
        this.logger.error(e.message + "/" + e.query);
      }  


    let sObjDepChar = {};

    for (let lSalesIndex = 0; lSalesIndex < liSalesInfo.length; lSalesIndex++) {
      let lCalDate = new Date(liSalesInfo[lSalesIndex].CAL_DATE);
      lCalDate.setDate(lCalDate.getDate() - 7);

      let liSalesChar = await cds.run(
        `SELECT *
            FROM V_ORDCHAR
            WHERE MAT_AVAILDATE > '` + lCalDate.toISOString().slice(0, 10) + `'
              AND MAT_AVAILDATE <= '` + liSalesInfo[lSalesIndex].CAL_DATE + `'
              AND LOCATION_ID = '` + liSalesInfo[lSalesIndex].LOCATION_ID + `'
              AND PRODUCT_ID = '` + liSalesInfo[lSalesIndex].PRODUCT_ID + `'              
              AND SUCCESS = 'S'   
              ORDER BY LOCATION_ID, PRODUCT_ID, OBJ_DEP, OBJ_COUNTER, ROW_ID`
      );

      let liProdOD = await cds.run(
        `SELECT DISTINCT
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "OBJ_DEP",
                    "OBJ_COUNTER",
                    "ROW_ID"
                FROM "V_OBDHDR"
               WHERE "LOCATION_ID" = '` + liSalesInfo[lSalesIndex].LOCATION_ID + `'
                 AND "PRODUCT_ID" = '` + liSalesInfo[lSalesIndex].PRODUCT_ID + `'
                 ORDER BY LOCATION_ID, PRODUCT_ID, OBJ_DEP, OBJ_COUNTER, ROW_ID`
      );

      let liObjDepChar = [];
      var tableObj = [];

      // Fill the OD Characteristics with empty Success
      for (let lProdIndex = 0; lProdIndex < liProdOD.length; lProdIndex++) {
        sObjDepChar = {};
        sObjDepChar.CAL_DATE     = liSalesInfo[lSalesIndex].CAL_DATE;
        sObjDepChar.LOCATION_ID  = liProdOD[lProdIndex].LOCATION_ID;
        sObjDepChar.PRODUCT_ID   = liProdOD[lProdIndex].PRODUCT_ID;
        sObjDepChar.OBJ_TYPE     = "OD";
        sObjDepChar.OBJ_DEP      = liProdOD[lProdIndex].OBJ_DEP;
        sObjDepChar.OBJ_COUNTER  = liProdOD[lProdIndex].OBJ_COUNTER;
        sObjDepChar.ROW_ID       = liProdOD[lProdIndex].ROW_ID;
        sObjDepChar.SUCCESS      = 0;
        sObjDepChar.SUCCESS_RATE = 0;
        var rowObj = [];
        rowObj.push(sObjDepChar.CAL_DATE ,sObjDepChar.LOCATION_ID,sObjDepChar.PRODUCT_ID ,sObjDepChar.OBJ_TYPE, sObjDepChar.OBJ_DEP,sObjDepChar.OBJ_COUNTER, sObjDepChar.ROW_ID, sObjDepChar.SUCCESS, sObjDepChar.SUCCESS_RATE);
        tableObj.push(rowObj);
        liObjDepChar.push(GenFunctions.parse(sObjDepChar));
        //liObjDepChar.push(GenFunctions.parse(rowObj));
      }

      this.logger.info(
        "Date: " +
          liSalesInfo[lSalesIndex].CAL_DATE +
          "| Success Records: " +
          liSalesChar.length +
          "| Total Records:" +
          liProdOD.length
      );

      let lSuccessQty = 0;
      for (let i = 0; i < liSalesChar.length; i++) {
        if (liSalesChar[i].SUCCESS === "S") {
          lSuccessQty = parseInt(lSuccessQty) + parseInt(liSalesChar[i].ORD_QTY);
        }
        if (
          liSalesChar[i].LOCATION_ID !== liSalesChar[GenFunctions.addOne(i, liSalesChar.length)].LOCATION_ID ||
          liSalesChar[i].PRODUCT_ID  !== liSalesChar[GenFunctions.addOne(i, liSalesChar.length)].PRODUCT_ID ||
          liSalesChar[i].OBJ_DEP     !== liSalesChar[GenFunctions.addOne(i, liSalesChar.length)].OBJ_DEP ||
          liSalesChar[i].OBJ_COUNTER !== liSalesChar[GenFunctions.addOne(i, liSalesChar.length)].OBJ_COUNTER ||
          liSalesChar[i].ROW_ID      !== liSalesChar[GenFunctions.addOne(i, liSalesChar.length)].ROW_ID ||
          i === GenFunctions.addOne(i, liSalesChar.length)
        ) {
          for (let k = 0; k < liObjDepChar.length; k++) {
            if (
              liSalesChar[i].LOCATION_ID === liObjDepChar[k].LOCATION_ID &&
              liSalesChar[i].PRODUCT_ID  === liObjDepChar[k].PRODUCT_ID &&
              liSalesChar[i].OBJ_DEP     === liObjDepChar[k].OBJ_DEP &&
              liSalesChar[i].OBJ_COUNTER === liObjDepChar[k].OBJ_COUNTER &&
              liSalesChar[i].ROW_ID      === liObjDepChar[k].ROW_ID
            ) {
                tableObj[k][7] = parseInt(lSuccessQty);
                tableObj[k][8]  = (parseInt(lSuccessQty) / parseInt(liSalesInfo[lSalesIndex].ORD_QTY)) * 100;
                tableObj[k][8].toFixed(2);
              liObjDepChar[k].SUCCESS      = parseInt(lSuccessQty);
              liObjDepChar[k].SUCCESS_RATE = (parseInt(lSuccessQty) / parseInt(liSalesInfo[lSalesIndex].ORD_QTY)) * 100;
              liObjDepChar[k].SUCCESS_RATE.toFixed(2);
              break;
            }
          }
          lSuccessQty = 0;
        }
      }

      this.logger.info("Insert Char Length: " + liObjDepChar.length);
      try {
        // await cds.run(
        //   INSERT.into("CP_TS_OBJDEP_CHARHDR").entries(liObjDepChar)
        // );
       // tableObj.push(liObjDepChar);
        var sqlStr = 'INSERT INTO "CP_TS_OBJDEP_CHARHDR"' + '(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, ROW_ID, SUCCESS, SUCCESS_RATE) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var stmt = conn.prepare(sqlStr);
        await stmt.execBatch(tableObj);
        stmt.drop();
      } catch (e) {
        this.logger.error(e.message + "/" + e.query);
      }

      liSalesChar = await cds.run(
                            `SELECT DISTINCT
                                        "SALES_DOC",
                                        "SALESDOC_ITEM",
                                        "LOCATION_ID",
                                        "PRODUCT_ID",
                                        "OBJ_DEP",
                                        "OBJ_COUNTER",
                                        "CHAR_COUNTER",
                                        "SUCCESS",
                                        "ORD_QTY"
                                FROM V_ORDCHAR
                                WHERE MAT_AVAILDATE > '` + lCalDate.toISOString().slice(0, 10) + `'
                                AND MAT_AVAILDATE <= '` + liSalesInfo[lSalesIndex].CAL_DATE + `'
                                AND LOCATION_ID = '` + liSalesInfo[lSalesIndex].LOCATION_ID + `'
                                AND PRODUCT_ID = '` + liSalesInfo[lSalesIndex].PRODUCT_ID + `'                                  
                                ORDER BY  "SALES_DOC",
                                            "SALESDOC_ITEM",
                                            "LOCATION_ID",
                                            "PRODUCT_ID",
                                            "OBJ_DEP",
                                            "OBJ_COUNTER",
                                            "CHAR_COUNTER",
                                            "SUCCESS"`
                        );

        let liObjDepHdr = [];
        let sObjDepHdr = {};        
    var tableObjH = [], rowObjH = [];
        let lFail = '';
      for (let k = 0; k < liSalesChar.length; k++) {

        if (
            liSalesChar[k].SUCCESS      !== "S"
        ) {
            if (
                liSalesChar[k].SALES_DOC  === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].SALES_DOC &&
                liSalesChar[k].SALESDOC_ITEM  === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].SALESDOC_ITEM &&
                liSalesChar[k].LOCATION_ID  === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].LOCATION_ID &&
                liSalesChar[k].PRODUCT_ID   === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].PRODUCT_ID &&
                liSalesChar[k].OBJ_DEP      === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].OBJ_DEP &&
                liSalesChar[k].OBJ_COUNTER  === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].OBJ_COUNTER &&
                liSalesChar[k].CHAR_COUNTER === liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].CHAR_COUNTER &&
                liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].SUCCESS      === "S" ) {

                }else{
                    lFail = "X";
                }

        }

        if (
            liSalesChar[k].SALES_DOC      !== liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].SALES_DOC ||
            liSalesChar[k].SALESDOC_ITEM  !== liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].SALESDOC_ITEM ||
            liSalesChar[k].LOCATION_ID    !== liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].LOCATION_ID ||
            liSalesChar[k].PRODUCT_ID     !== liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].PRODUCT_ID ||
            liSalesChar[k].OBJ_DEP        !== liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].OBJ_DEP ||
            liSalesChar[k].OBJ_COUNTER    !== liSalesChar[GenFunctions.addOne(k, liSalesChar.length)].OBJ_COUNTER ||
            k === GenFunctions.addOne(k, liSalesChar.length) ) {
                sObjDepHdr = {};
                sObjDepHdr.CAL_DATE = GenFunctions.parse(liSalesInfo[lSalesIndex].CAL_DATE);
                sObjDepHdr.LOCATION_ID = GenFunctions.parse(liSalesChar[k].LOCATION_ID);
                sObjDepHdr.PRODUCT_ID = GenFunctions.parse(liSalesChar[k].PRODUCT_ID);
                sObjDepHdr.OBJ_TYPE = "OD";
                sObjDepHdr.OBJ_DEP = GenFunctions.parse(liSalesChar[k].OBJ_DEP);
                sObjDepHdr.OBJ_COUNTER = GenFunctions.parse(liSalesChar[k].OBJ_COUNTER);
                if (lFail === "") {
                    sObjDepHdr.SUCCESS = parseInt(liSalesChar[k].ORD_QTY);
                } else {
                    sObjDepHdr.SUCCESS = 0;
                }
                sObjDepHdr.SUCCESS_RATE = 0;
                liObjDepHdr.push(GenFunctions.parse(sObjDepHdr));
                lFail = "";
        }        
    }
    liObjDepHdr.sort(GenFunctions.dynamicSortMultiple("CAL_DATE","LOCATION_ID","PRODUCT_ID","OBJ_TYPE","OBJ_DEP","OBJ_COUNTER"));

    let liObjDepHdrTemp = [];    
    lSuccessQty = 0;
    for (let lIndObjHdr = 0; lIndObjHdr < liObjDepHdr.length; lIndObjHdr++) {

        lSuccessQty = parseInt(lSuccessQty) + parseInt(liObjDepHdr[lIndObjHdr].SUCCESS);

        if(liObjDepHdr[lIndObjHdr].CAL_DATE !== liObjDepHdr[GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)].CAL_DATE ||
        liObjDepHdr[lIndObjHdr].LOCATION_ID !== liObjDepHdr[GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)].LOCATION_ID ||
        liObjDepHdr[lIndObjHdr].PRODUCT_ID !== liObjDepHdr[GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)].PRODUCT_ID ||
        liObjDepHdr[lIndObjHdr].OBJ_TYPE !== liObjDepHdr[GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)].OBJ_TYPE ||
        liObjDepHdr[lIndObjHdr].OBJ_DEP !== liObjDepHdr[GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)].OBJ_DEP ||
        liObjDepHdr[lIndObjHdr].OBJ_COUNTER !== liObjDepHdr[GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)].OBJ_COUNTER ||
        lIndObjHdr === GenFunctions.addOne(lIndObjHdr,liObjDepHdr.length)
        ){
            sObjDepHdr = {};
            rowObjH = [];
            sObjDepHdr = GenFunctions.parse(liObjDepHdr[lIndObjHdr]);
            sObjDepHdr.SUCCESS = parseInt(lSuccessQty);
            sObjDepHdr.SUCCESS_RATE = (parseInt(lSuccessQty) / parseInt(liSalesInfo[lSalesIndex].ORD_QTY)) * 100;
            rowObjH.push(sObjDepHdr.CAL_DATE ,sObjDepHdr.LOCATION_ID,sObjDepHdr.PRODUCT_ID ,sObjDepHdr.OBJ_TYPE, sObjDepHdr.OBJ_DEP,sObjDepHdr.OBJ_COUNTER, sObjDepHdr.SUCCESS, sObjDepHdr.SUCCESS_RATE);
            tableObjH.push(rowObjH);
        
            liObjDepHdrTemp.push(GenFunctions.parse(sObjDepHdr));
            lSuccessQty = 0;
        }      
    }

    this.logger.info("Insert Head Length: " + liObjDepHdrTemp.length);
      try {
        // await cds.run(INSERT.into("CP_TS_OBJDEPHDR").entries(liObjDepHdrTemp));
        var sqlStr = 'INSERT INTO "CP_TS_OBJDEPHDR"' + '(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, SUCCESS, SUCCESS_RATE) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        var stmt = conn.prepare(sqlStr);
        await stmt.execBatch(tableObjH);
        stmt.drop();
      } catch (e) {
        this.logger.error(e.message + "/" + e.query);
      }
 
     
    }

    this.logger.info("Completed timeseries Service");

    var lProcessTime = Math.floor((Math.abs(lStartTime - new Date())/1000)/60);
    this.logger.info("Processing time : " + lProcessTime + " Minutes", 'background: #222; color: #bada55');
  }

  async genTimeseriesF(){

    const lStartTime = new Date();
    this.logger.info("Started timeseries Service");

    /** Get Future Plan */
    const liFutureCharPlan = await cds.run(
        `SELECT DISTINCT LOCATION_ID, 
                        PRODUCT_ID, 
                        VERSION,
                        SCENARIO,
                        WEEK_DATE
            FROM "CP_IBP_FCHARPLAN"
            ORDER BY LOCATION_ID, 
                    PRODUCT_ID, 
                    VERSION,
                    SCENARIO,
                    WEEK_DATE`
    );

    let lsObjdepF = {};
    let liObjdepF = [];
    let liObdhdr = [];

    for (let lFutInd = 0; lFutInd < liFutureCharPlan.length; lFutInd++) {
        this.logger.info(
            "Date: " +
            liFutureCharPlan[lFutInd].WEEK_DATE
          );
        if(lFutInd === 0 ||
            liFutureCharPlan[lFutInd].LOCATION_ID !== liFutureCharPlan[GenFunctions.subOne(lFutInd,liFutureCharPlan.lenght)].LOCATION_ID ||
            liFutureCharPlan[lFutInd].PRODUCT_ID !== liFutureCharPlan[GenFunctions.subOne(lFutInd,liFutureCharPlan.lenght)].PRODUCT_ID ){
                await cds.run(
                    DELETE.from("CP_TS_OBJDEP_CHARHDR_F").where({
                        xpr: [
                        { ref: ["LOCATION_ID"] }, "=", { val: liFutureCharPlan[lFutInd].LOCATION_ID }, 'AND',
                        { ref: ["PRODUCT_ID"] }, "=", { val: liFutureCharPlan[lFutInd].PRODUCT_ID }
                        ],
                    })
                );
               
                             
                liObdhdr = await cds.run(
                    `SELECT *
                        FROM "V_OBDHDR"
                       WHERE LOCATION_ID = '`+ liFutureCharPlan[lFutInd].LOCATION_ID +`'
                         AND PRODUCT_ID = '`+ liFutureCharPlan[lFutInd].PRODUCT_ID +`'`
                );                    

        }

        /** Get Future Plan */
        const liFutureCharPlanDate = await cds.run(
            `SELECT *
               FROM "CP_IBP_FCHARPLAN"
               WHERE LOCATION_ID = '`+ liFutureCharPlan[lFutInd].LOCATION_ID +`'
               AND PRODUCT_ID = '`+ liFutureCharPlan[lFutInd].PRODUCT_ID +`'
               AND VERSION = '`+ liFutureCharPlan[lFutInd].VERSION +`'
               AND SCENARIO = '`+ liFutureCharPlan[lFutInd].SCENARIO +`'
               AND WEEK_DATE = '`+ liFutureCharPlan[lFutInd].WEEK_DATE +`'`
        );  
        
        liObjdepF = [];
        for (let lObjInd = 0; lObjInd < liObdhdr.length; lObjInd++) {
            lsObjdepF = {};
            lsObjdepF.CAL_DATE    = liFutureCharPlan[lFutInd].WEEK_DATE;
            lsObjdepF.LOCATION_ID = liFutureCharPlan[lFutInd].LOCATION_ID;
            lsObjdepF.PRODUCT_ID  = liFutureCharPlan[lFutInd].PRODUCT_ID;
            lsObjdepF.VERSION     = liFutureCharPlan[lFutInd].VERSION;
            lsObjdepF.SCENARIO    = liFutureCharPlan[lFutInd].SCENARIO;
            lsObjdepF.OBJ_TYPE    = 'OD';
            lsObjdepF.OBJ_DEP     = liObdhdr[lObjInd].OBJ_DEP;
            lsObjdepF.OBJ_COUNTER = liObdhdr[lObjInd].OBJ_COUNTER;
            lsObjdepF.ROW_ID      = liObdhdr[lObjInd].ROW_ID;
            lsObjdepF.SUCCESS     = 0;
            for (let lFutIndex = 0; lFutIndex < liFutureCharPlanDate.length; lFutIndex++) {
                if(liFutureCharPlanDate[lFutIndex].LOCATION_ID === liObdhdr[lObjInd].LOCATION_ID &&
                   liFutureCharPlanDate[lFutIndex].PRODUCT_ID  === liObdhdr[lObjInd].PRODUCT_ID &&
                   liFutureCharPlanDate[lFutIndex].VERSION     === liFutureCharPlan[lFutInd].VERSION &&
                   liFutureCharPlanDate[lFutIndex].SCENARIO    === liFutureCharPlan[lFutInd].SCENARIO &&
                   liFutureCharPlanDate[lFutIndex].CLASS_NUM   === liObdhdr[lObjInd].CLASS_NUM &&
                   liFutureCharPlanDate[lFutIndex].CHAR_NUM    === liObdhdr[lObjInd].CHAR_NUM){
                        if(liObdhdr[lObjInd].OD_CONDITION === 'EQ' &&
                           liObdhdr[lObjInd].CHARVAL_NUM  === liFutureCharPlanDate[lFutIndex].CHARVAL_NUM){
                            lsObjdepF.SUCCESS = liFutureCharPlanDate[lFutIndex].OPT_QTY;
                        }
                        if(liObdhdr[lObjInd].OD_CONDITION === 'NE' &&
                           liObdhdr[lObjInd].CHARVAL_NUM  !== liFutureCharPlanDate[lFutIndex].CHARVAL_NUM){
                            lsObjdepF.SUCCESS = liFutureCharPlanDate[lFutIndex].OPT_QTY;
                        }                            
                    }
            }

            liObjdepF.push(GenFunctions.parse(lsObjdepF));
        }

        /** Get Future Plan */
        const liFutureDemandPlanDate = await cds.run(
            `SELECT *
               FROM "CP_IBP_FUTUREDEMAND"
               WHERE LOCATION_ID = '`+ liFutureCharPlan[lFutInd].LOCATION_ID +`'
               AND PRODUCT_ID = '`+ liFutureCharPlan[lFutInd].PRODUCT_ID +`'
               AND WEEK_DATE = '`+ liFutureCharPlan[lFutInd].WEEK_DATE +`'
               AND VERSION       = '`+ liFutureCharPlan[lFutInd].VERSION +`'
               AND SCENARIO      = '`+ liFutureCharPlan[lFutInd].SCENARIO + `'`
        );  

        if(liObjdepF.length > 0 ){
            try {
                for (let index = 0; index < liObjdepF.length; index++) {

                    liObjdepF[index].SUCCESS_RATE = 0;
                    for (let lDemI = 0; lDemI < liFutureDemandPlanDate.length; lDemI++) {
                        if(liFutureDemandPlanDate[lDemI].QUANTITY > 0){
                            liObjdepF[index].SUCCESS_RATE = ( liObjdepF[index].SUCCESS / liFutureDemandPlanDate[lDemI].QUANTITY ) * 100;
                        }
                    }    

                    await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF[index]));  
                    
                }

                //await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF));
            } catch (e) {
                this.logger.error(e.message + "/" + e.query);
            }
        }
    }
    
    this.logger.info("Completed timeseries Service");

    var lProcessTime = Math.floor((Math.abs(lStartTime - new Date())/1000)/60);
    this.logger.info("Processing time : " + lProcessTime + " Minutes", 'background: #222; color: #bada55');
 
}  
}


module.exports = GenTimeseries;