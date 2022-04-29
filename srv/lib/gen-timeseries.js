const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const containerSchema = cds.env.requires.db.credentials.schema;
const conn_params_container = {
  serverNode: cds.env.requires.db.credentials.host + ":" + cds.env.requires.db.credentials.port,
  uid: cds.env.requires.db.credentials.user,     //cds userid environment variable
  pwd: cds.env.requires.db.credentials.password, //cds password environment variable
  encrypt: "TRUE",
  ssltruststore: cds.env.requires.hana.credentials.certificate,
};

const conn = hana.createConnection()

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

    conn.connect(conn_params_container);
    try {
            conn.prepare("SET SCHEMA " + containerSchema).exec();
        } catch (error) {
            this.logger.info(error);
        }    
    }

  /**
   * Generate Timeseries
   */
  async genTimeseries(adata) {
    const lStartTime = new Date();
    this.logger.info("Started timeseries Service");

    let lStartDate = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() - adata.PAST_DAYS);

    // Get Sales Count Information
    const liSalesCount = await cds.run(
        `SELECT *
              FROM V_ORD_COUNT
              WHERE "LOCATION_ID" = '` + adata.LOCATION_ID + `'
              AND "PRODUCT_ID" = '` + adata.PRODUCT_ID + `'
              AND "WEEK_DATE" >= '` + lStartDate + `'
              AND "WEEK_DATE" <= '` + GenF.getCurrentDate() + `'
              ORDER BY 
                  "LOCATION_ID" ASC, 
                  "PRODUCT_ID" ASC,
                  "WEEK_DATE" ASC`
    );

    let liODCharTemp = [];

    for (let i = 0; i < liSalesCount.length; i++) {

          // For every change in Week Date
         await this.insertInitialTS(liSalesCount[i].LOCATION_ID, liSalesCount[i].PRODUCT_ID, liSalesCount[i].WEEK_DATE);

        // For every change in Product
        if ( i === 0 ||
            liSalesCount[i].LOCATION_ID !== liSalesCount[GenF.subOne(i, liSalesCount.length)].LOCATION_ID ||
            liSalesCount[i].PRODUCT_ID  !== liSalesCount[GenF.subOne(i, liSalesCount.length)].PRODUCT_ID) {
                // Get Distinct Chan Num and Value
                liODCharTemp = await cds.run(
                    `SELECT DISTINCT CHAR_NUM,
                                     CHARVAL_NUM,
                                     OD_CONDITION
                                FROM "V_OBDHDR"
                               WHERE LOCATION_ID = '` + liSalesCount[i].LOCATION_ID + `'
                                 AND PRODUCT_ID  = '` + liSalesCount[i].PRODUCT_ID  + `'`
                );

       }

        await this.processODChar(liSalesCount[i].LOCATION_ID, liSalesCount[i].PRODUCT_ID, liSalesCount[i].WEEK_DATE, liSalesCount[i].ORD_QTY, liODCharTemp );
        await this.processODHead(liSalesCount[i].LOCATION_ID, liSalesCount[i].PRODUCT_ID, liSalesCount[i].WEEK_DATE, liSalesCount[i].ORD_QTY);

        this.logger.info("Processed Date " + liSalesCount[i].WEEK_DATE);
    }    




    this.logger.info("Process Completed");

/*
    SELECT DISTINCT
	CHAR_NUM,
	CHARVAL_NUM,
	OD_CONDITION
FROM "V_OBDHDR"    
*/


    /** Get Sales History 
    const liSalesHead = await cds.run(
      `SELECT *
            FROM CP_SALESH 
            WHERE "LOCATION_ID" = '` +
        adata.LOCATION_ID +
        `'
            AND "PRODUCT_ID" = '` +
        adata.PRODUCT_ID +
        `'
            ORDER BY 
                "LOCATION_ID" ASC, 
                "PRODUCT_ID" ASC,
                "MAT_AVAILDATE" ASC`
    );

    try {
        conn.prepare(`DELETE FROM "CP_TS_OBJDEP_CHARHDR" WHERE LOCATION_ID = 'RX01' AND CAL_DATE = '2020-04-12'`).exec();
       // let result = stmt.exec();
        //stmt.drop();
      } catch (error) {
        console.log(error);
      }

    let liSalesInfo = [];
    let liOrdRate = [];
    let lsSalesInfo = {};
    let lsOrdRate = {};
    // Consolidate for Week Days
    for (let i = 0; i < liSalesHead.length; i++) {
      // Remove existing data based on location
      if (
        liSalesHead[i].LOCATION_ID !==
          liSalesHead[GenF.subOne(i, liSalesHead.length)].LOCATION_ID ||
        i === 0
      ) {
        await cds.run(
          DELETE.from("CP_TS_OBJDEP_CHARHDR").where({
            xpr: [
              { ref: ["LOCATION_ID"] },
              "=",
              { val: liSalesHead[i].LOCATION_ID },
            ],
          })
        );

        await cds.run(
          DELETE.from("CP_TS_OBJDEPHDR").where({
            xpr: [
              { ref: ["LOCATION_ID"] },
              "=",
              { val: liSalesHead[i].LOCATION_ID },
            ],
          })
        );

        await cds.run(
          DELETE.from("CP_TS_ORDERRATE").where({
            xpr: [
              { ref: ["LOCATION_ID"] },
              "=",
              { val: liSalesHead[i].LOCATION_ID },
            ],
          })
        );
      }

      lsSalesInfo.LOCATION_ID = GenF.parse(liSalesHead[i].LOCATION_ID);
      lsSalesInfo.PRODUCT_ID = GenF.parse(liSalesHead[i].PRODUCT_ID);
      lsSalesInfo.CAL_DATE = GenF.getNextSunday(
        liSalesHead[i].MAT_AVAILDATE
      );

      if (!lsSalesInfo.ORD_QTY) lsSalesInfo.ORD_QTY = 0;
      lsSalesInfo.ORD_QTY =
        parseInt(lsSalesInfo.ORD_QTY) + parseInt(liSalesHead[i].ORD_QTY);

      if (
        liSalesHead[i].LOCATION_ID !==
          liSalesHead[GenF.addOne(i, liSalesHead.length)].LOCATION_ID ||
        liSalesHead[i].PRODUCT_ID !==
          liSalesHead[GenF.addOne(i, liSalesHead.length)].PRODUCT_ID ||
        liSalesHead[GenF.addOne(i, liSalesHead.length)].MAT_AVAILDATE >
          lsSalesInfo.CAL_DATE ||
        i === GenF.addOne(i, liSalesHead.length)
      ) {
        liSalesInfo.push(GenF.parse(lsSalesInfo));
        lsOrdRate.WEEK_DATE = lsSalesInfo.CAL_DATE;
        lsOrdRate.LOCATION_ID = lsSalesInfo.LOCATION_ID;
        lsOrdRate.ORDER_COUNT = lsSalesInfo.ORD_QTY;
        liOrdRate.push(GenF.parse(lsOrdRate));
        lsSalesInfo = {};
      }
    }

    liOrdRate.sort(
      GenF.dynamicSortMultiple("WEEK_DATE", "LOCATION_ID")
    );
    let liOrdRateTemp = [];
    let lOrdCount = 0;
    var tableObjR = [],
      rowObjR = [];
    for (let lOrdInd = 0; lOrdInd < liOrdRate.length; lOrdInd++) {
      lOrdCount =
        parseInt(lOrdCount) + parseInt(liOrdRate[lOrdInd].ORDER_COUNT);
      if (
        liOrdRate[lOrdInd].WEEK_DATE !==
          liOrdRate[GenF.addOne(lOrdInd, liOrdRate.length)].WEEK_DATE ||
        liOrdRate[lOrdInd].LOCATION_ID !==
          liOrdRate[GenF.addOne(lOrdInd, liOrdRate.length)]
            .LOCATION_ID ||
        lOrdInd === GenF.addOne(lOrdInd, liOrdRate.length)
      ) {
        lsOrdRate = {};
        rowObjR = [];
        lsOrdRate = GenF.parse(liOrdRate[lOrdInd]);
        lsOrdRate.ORDER_COUNT = lOrdCount;
        rowObjR.push(
          lsOrdRate.WEEK_DATE,
          lsOrdRate.LOCATION_ID,
          lsOrdRate.ORDER_COUNT
        );
        tableObjR.push(rowObjR);
        liOrdRateTemp.push(GenF.parse(lsOrdRate));
        lOrdCount = 0;
      }
    }

    try {
      await cds.run(INSERT.into("CP_TS_ORDERRATE").entries(liOrdRateTemp));
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
            WHERE MAT_AVAILDATE > '` +
          lCalDate.toISOString().slice(0, 10) +
          `'
              AND MAT_AVAILDATE <= '` +
          liSalesInfo[lSalesIndex].CAL_DATE +
          `'
              AND LOCATION_ID = '` +
          liSalesInfo[lSalesIndex].LOCATION_ID +
          `'
              AND PRODUCT_ID = '` +
          liSalesInfo[lSalesIndex].PRODUCT_ID +
          `'              
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
               WHERE "LOCATION_ID" = '` +
          liSalesInfo[lSalesIndex].LOCATION_ID +
          `'
                 AND "PRODUCT_ID" = '` +
          liSalesInfo[lSalesIndex].PRODUCT_ID +
          `'
                 ORDER BY LOCATION_ID, PRODUCT_ID, OBJ_DEP, OBJ_COUNTER, ROW_ID`
      );

      let liObjDepChar = [];
      var tableObj = [];

      // Fill the OD Characteristics with empty Success
      for (let lProdIndex = 0; lProdIndex < liProdOD.length; lProdIndex++) {
        sObjDepChar = {};
        sObjDepChar.CAL_DATE = liSalesInfo[lSalesIndex].CAL_DATE;
        sObjDepChar.LOCATION_ID = liProdOD[lProdIndex].LOCATION_ID;
        sObjDepChar.PRODUCT_ID = liProdOD[lProdIndex].PRODUCT_ID;
        sObjDepChar.OBJ_TYPE = "OD";
        sObjDepChar.OBJ_DEP = liProdOD[lProdIndex].OBJ_DEP;
        sObjDepChar.OBJ_COUNTER = liProdOD[lProdIndex].OBJ_COUNTER;
        sObjDepChar.ROW_ID = liProdOD[lProdIndex].ROW_ID;
        sObjDepChar.SUCCESS = 0;
        sObjDepChar.SUCCESS_RATE = 0;
        var rowObj = [];
        rowObj.push(
          sObjDepChar.CAL_DATE,
          sObjDepChar.LOCATION_ID,
          sObjDepChar.PRODUCT_ID,
          sObjDepChar.OBJ_TYPE,
          sObjDepChar.OBJ_DEP,
          sObjDepChar.OBJ_COUNTER,
          sObjDepChar.ROW_ID,
          sObjDepChar.SUCCESS,
          sObjDepChar.SUCCESS_RATE
        );
        tableObj.push(rowObj);
        liObjDepChar.push(GenF.parse(sObjDepChar));
        //liObjDepChar.push(GenF.parse(rowObj));
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
          lSuccessQty =
            parseInt(lSuccessQty) + parseInt(liSalesChar[i].ORD_QTY);
        }
        if (
          liSalesChar[i].LOCATION_ID !==
            liSalesChar[GenF.addOne(i, liSalesChar.length)]
              .LOCATION_ID ||
          liSalesChar[i].PRODUCT_ID !==
            liSalesChar[GenF.addOne(i, liSalesChar.length)]
              .PRODUCT_ID ||
          liSalesChar[i].OBJ_DEP !==
            liSalesChar[GenF.addOne(i, liSalesChar.length)].OBJ_DEP ||
          liSalesChar[i].OBJ_COUNTER !==
            liSalesChar[GenF.addOne(i, liSalesChar.length)]
              .OBJ_COUNTER ||
          liSalesChar[i].ROW_ID !==
            liSalesChar[GenF.addOne(i, liSalesChar.length)].ROW_ID ||
          i === GenF.addOne(i, liSalesChar.length)
        ) {
          for (let k = 0; k < liObjDepChar.length; k++) {
            if (
              liSalesChar[i].LOCATION_ID === liObjDepChar[k].LOCATION_ID &&
              liSalesChar[i].PRODUCT_ID === liObjDepChar[k].PRODUCT_ID &&
              liSalesChar[i].OBJ_DEP === liObjDepChar[k].OBJ_DEP &&
              liSalesChar[i].OBJ_COUNTER === liObjDepChar[k].OBJ_COUNTER &&
              liSalesChar[i].ROW_ID === liObjDepChar[k].ROW_ID
            ) {
              tableObj[k][7] = parseInt(lSuccessQty);
              tableObj[k][8] =
                (parseInt(lSuccessQty) /
                  parseInt(liSalesInfo[lSalesIndex].ORD_QTY)) *
                100;
              tableObj[k][8].toFixed(2);
              liObjDepChar[k].SUCCESS = parseInt(lSuccessQty);
              liObjDepChar[k].SUCCESS_RATE =
                (parseInt(lSuccessQty) /
                  parseInt(liSalesInfo[lSalesIndex].ORD_QTY)) *
                100;
              liObjDepChar[k].SUCCESS_RATE.toFixed(2);
              break;
            }
          }
          lSuccessQty = 0;
        }
      }

      this.logger.info("Insert Char Length: " + liObjDepChar.length);
      try {
        await cds.run(
          INSERT.into("CP_TS_OBJDEP_CHARHDR").entries(liObjDepChar)
        );
        tableObj.push(liObjDepChar);
        var sqlStr =
          'INSERT INTO "CP_TS_OBJDEP_CHARHDR"' +
          "(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, ROW_ID, SUCCESS, SUCCESS_RATE) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        // var sqlStr =
        //   'INSERT INTO "CP_TS_OBJDEP_CHARHDR"' +
        //   "(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, ROW_ID, SUCCESS, SUCCESS_RATE)" +
        //   " SELECT CAL_DATE, LOCATION_ID,PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, ROW_ID, SUCCESS, SUCCESS_RATE FROM V_ODCHAR_TIMESERIES";
          
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
                                WHERE MAT_AVAILDATE > '` +
          lCalDate.toISOString().slice(0, 10) +
          `'
                                AND MAT_AVAILDATE <= '` +
          liSalesInfo[lSalesIndex].CAL_DATE +
          `'
                                AND LOCATION_ID = '` +
          liSalesInfo[lSalesIndex].LOCATION_ID +
          `'
                                AND PRODUCT_ID = '` +
          liSalesInfo[lSalesIndex].PRODUCT_ID +
          `'                                  
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
      var tableObjH = [],
        rowObjH = [];
      let lFail = "";
      for (let k = 0; k < liSalesChar.length; k++) {
        if (liSalesChar[k].SUCCESS !== "S") {
          if (
            liSalesChar[k].SALES_DOC ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)]
                .SALES_DOC &&
            liSalesChar[k].SALESDOC_ITEM ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)]
                .SALESDOC_ITEM &&
            liSalesChar[k].LOCATION_ID ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)]
                .LOCATION_ID &&
            liSalesChar[k].PRODUCT_ID ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)]
                .PRODUCT_ID &&
            liSalesChar[k].OBJ_DEP ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)].OBJ_DEP &&
            liSalesChar[k].OBJ_COUNTER ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)]
                .OBJ_COUNTER &&
            liSalesChar[k].CHAR_COUNTER ===
              liSalesChar[GenF.addOne(k, liSalesChar.length)]
                .CHAR_COUNTER &&
            liSalesChar[GenF.addOne(k, liSalesChar.length)].SUCCESS ===
              "S"
          ) {
          } else {
            lFail = "X";
          }
        }

        if (
          liSalesChar[k].SALES_DOC !==
            liSalesChar[GenF.addOne(k, liSalesChar.length)].SALES_DOC ||
          liSalesChar[k].SALESDOC_ITEM !==
            liSalesChar[GenF.addOne(k, liSalesChar.length)]
              .SALESDOC_ITEM ||
          liSalesChar[k].LOCATION_ID !==
            liSalesChar[GenF.addOne(k, liSalesChar.length)]
              .LOCATION_ID ||
          liSalesChar[k].PRODUCT_ID !==
            liSalesChar[GenF.addOne(k, liSalesChar.length)]
              .PRODUCT_ID ||
          liSalesChar[k].OBJ_DEP !==
            liSalesChar[GenF.addOne(k, liSalesChar.length)].OBJ_DEP ||
          liSalesChar[k].OBJ_COUNTER !==
            liSalesChar[GenF.addOne(k, liSalesChar.length)]
              .OBJ_COUNTER ||
          k === GenF.addOne(k, liSalesChar.length)
        ) {
          sObjDepHdr = {};
          sObjDepHdr.CAL_DATE = GenF.parse(
            liSalesInfo[lSalesIndex].CAL_DATE
          );
          sObjDepHdr.LOCATION_ID = GenF.parse(
            liSalesChar[k].LOCATION_ID
          );
          sObjDepHdr.PRODUCT_ID = GenF.parse(liSalesChar[k].PRODUCT_ID);
          sObjDepHdr.OBJ_TYPE = "OD";
          sObjDepHdr.OBJ_DEP = GenF.parse(liSalesChar[k].OBJ_DEP);
          sObjDepHdr.OBJ_COUNTER = GenF.parse(
            liSalesChar[k].OBJ_COUNTER
          );
          if (lFail === "") {
            sObjDepHdr.SUCCESS = parseInt(liSalesChar[k].ORD_QTY);
          } else {
            sObjDepHdr.SUCCESS = 0;
          }
          sObjDepHdr.SUCCESS_RATE = 0;
          liObjDepHdr.push(GenF.parse(sObjDepHdr));
          lFail = "";
        }
      }
      liObjDepHdr.sort(
        GenF.dynamicSortMultiple(
          "CAL_DATE",
          "LOCATION_ID",
          "PRODUCT_ID",
          "OBJ_TYPE",
          "OBJ_DEP",
          "OBJ_COUNTER"
        )
      );

      let liObjDepHdrTemp = [];
      lSuccessQty = 0;
      for (let lIndObjHdr = 0; lIndObjHdr < liObjDepHdr.length; lIndObjHdr++) {
        lSuccessQty =
          parseInt(lSuccessQty) + parseInt(liObjDepHdr[lIndObjHdr].SUCCESS);

        if (
          liObjDepHdr[lIndObjHdr].CAL_DATE !==
            liObjDepHdr[GenF.addOne(lIndObjHdr, liObjDepHdr.length)]
              .CAL_DATE ||
          liObjDepHdr[lIndObjHdr].LOCATION_ID !==
            liObjDepHdr[GenF.addOne(lIndObjHdr, liObjDepHdr.length)]
              .LOCATION_ID ||
          liObjDepHdr[lIndObjHdr].PRODUCT_ID !==
            liObjDepHdr[GenF.addOne(lIndObjHdr, liObjDepHdr.length)]
              .PRODUCT_ID ||
          liObjDepHdr[lIndObjHdr].OBJ_TYPE !==
            liObjDepHdr[GenF.addOne(lIndObjHdr, liObjDepHdr.length)]
              .OBJ_TYPE ||
          liObjDepHdr[lIndObjHdr].OBJ_DEP !==
            liObjDepHdr[GenF.addOne(lIndObjHdr, liObjDepHdr.length)]
              .OBJ_DEP ||
          liObjDepHdr[lIndObjHdr].OBJ_COUNTER !==
            liObjDepHdr[GenF.addOne(lIndObjHdr, liObjDepHdr.length)]
              .OBJ_COUNTER ||
          lIndObjHdr === GenF.addOne(lIndObjHdr, liObjDepHdr.length)
        ) {
          sObjDepHdr = {};
          rowObjH = [];
          sObjDepHdr = GenF.parse(liObjDepHdr[lIndObjHdr]);
          sObjDepHdr.SUCCESS = parseInt(lSuccessQty);
          sObjDepHdr.SUCCESS_RATE =
            (parseInt(lSuccessQty) /
              parseInt(liSalesInfo[lSalesIndex].ORD_QTY)) *
            100;
          rowObjH.push(
            sObjDepHdr.CAL_DATE,
            sObjDepHdr.LOCATION_ID,
            sObjDepHdr.PRODUCT_ID,
            sObjDepHdr.OBJ_TYPE,
            sObjDepHdr.OBJ_DEP,
            sObjDepHdr.OBJ_COUNTER,
            sObjDepHdr.SUCCESS,
            sObjDepHdr.SUCCESS_RATE
          );
          tableObjH.push(rowObjH);

          liObjDepHdrTemp.push(GenF.parse(sObjDepHdr));
          lSuccessQty = 0;
        }
      }

      this.logger.info("Insert Head Length: " + liObjDepHdrTemp.length);
      try {
        // await cds.run(INSERT.into("CP_TS_OBJDEPHDR").entries(liObjDepHdrTemp));
        var sqlStr =
          'INSERT INTO "CP_TS_OBJDEPHDR"' +
          "(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, SUCCESS, SUCCESS_RATE) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        // var stmt = conn.prepare(sqlStr);
        // await stmt.execBatch(tableObjH);
        // stmt.drop();
      } catch (e) {
        this.logger.error(e.message + "/" + e.query);
      }
    }

    this.logger.info("Completed timeseries Service");

    var lProcessTime = Math.floor(
      Math.abs(lStartTime - new Date()) / 1000 / 60
    );
    this.logger.info(
      "Processing time : " + lProcessTime + " Minutes",
      "background: #222; color: #bada55"
    );
    */

}

  /***
   * Initialize Timeseries Data
   */
  async initializeTSData(lLocation) {

    try {
        conn.prepare(`DELETE FROM "CP_TS_OBJDEP_CHARHDR" WHERE LOCATION_ID = '`+ lLocation +`'`).exec();
      } catch (error) {
        this.logger.error(error);
      }
    
      try {
        conn.prepare(`DELETE FROM "CP_TS_OBJDEPHDR" WHERE LOCATION_ID = '`+ lLocation +`'`).exec();
      } catch (error) {
        this.logger.error(error);
      }      
    
}

async insertInitialTS(lLocation, lProduct, lDate) {
    let sqlStr;

    try {
        sqlStr= 
            conn.prepare(`DELETE FROM "CP_TS_OBJDEP_CHARHDR" WHERE LOCATION_ID = '`+ lLocation +`'
                                                               AND PRODUCT_ID = '`+ lProduct +`'
                                                               AND WEEK_DATE  = '`+ lDate +`'`);
        sqlStr.exec();
        sqlStr.drop();        
      } catch (error) {
        this.logger.error(error);
      }
    
      try {
          sqlStr= 
        conn.prepare(`DELETE FROM "CP_TS_OBJDEPHDR" WHERE WHERE LOCATION_ID = '`+ lLocation +`'
                                                            AND PRODUCT_ID = '`+ lProduct +`'
                                                            AND WEEK_DATE  = '`+ lDate +`'`);
        sqlStr.exec();
        sqlStr.drop();           
      } catch (error) {
        this.logger.error(error);
      }   



    sqlStr =
    conn.prepare( `INSERT INTO "CP_TS_OBJDEPHDR" 
                    SELECT DISTINCT '` + lDate + `',
                                    '` + lLocation + `',
                                    '` + lProduct + `',
                                    'OD',
                                    B.OBJ_DEP,
                                    B.OBJ_COUNTER,
                                    0,
                                    0
                            FROM CP_BOM_OBJDEPENDENCY AS A
                        INNER JOIN CP_OBJDEP_HEADER AS B ON ( A.OBJ_DEP = B.OBJ_DEP ) 
                        WHERE LOCATION_ID = '` + lLocation + `'
                        AND PRODUCT_ID  = '` + lProduct + `'
                        AND VALID_FROM <= '` + GenF.getCurrentDate() + `'
                        AND VALID_TO   >= '` + GenF.getCurrentDate() + `'`)
sqlStr.exec();
sqlStr.drop();

sqlStr =
    conn.prepare( `INSERT INTO "CP_TS_OBJDEP_CHARHDR" 
                    SELECT DISTINCT '` + lDate + `',
                                    '` + lLocation + `',
                                    '` + lProduct + `',
                                    'OD',
                                    B.OBJ_DEP,
                                    B.OBJ_COUNTER,
                                    B.ROW_ID,
                                    0,
                                    0
                            FROM CP_BOM_OBJDEPENDENCY AS A
                        INNER JOIN CP_OBJDEP_HEADER AS B ON ( A.OBJ_DEP = B.OBJ_DEP ) 
                        WHERE LOCATION_ID = '` + lLocation + `'
                          AND PRODUCT_ID  = '` + lProduct + `'
                          AND VALID_FROM <= '` + GenF.getCurrentDate() + `'
                          AND VALID_TO   >= '` + GenF.getCurrentDate() + `'`)
sqlStr.exec();
sqlStr.drop();            

this.logger.info("Char Completed Date: " + lDate);

}
async processODChar(lLocation, lProduct, lDate, lOrdQty, liODCharTemp){

     let liODChar = [];
     for (let cntODC = 0; cntODC < liODCharTemp.length; cntODC++) {
        if(liODCharTemp[cntODC].OD_CONDITION === 'EQ'){
            liODChar = await cds.run(
                `SELECT DISTINCT A."SALES_DOC",
                        A."SALESDOC_ITEM",
                        A."ORD_QTY"
                    FROM CP_SALESH AS A
                   INNER JOIN CP_SALESH_CONFIG AS B
                      ON A.SALES_DOC = B.SALES_DOC
                     AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                   WHERE A.LOCATION_ID   = '`  + lLocation + `'
                     AND A.MAT_AVAILDATE <= '` + lDate + `' 
                     AND A.MAT_AVAILDATE > '`  + GenF.getLastWeekDate(lDate) + `' 
                     AND B.CHAR_NUM      = '`  + liODCharTemp[cntODC].CHAR_NUM +`' 
                     AND B.CHARVAL_NUM   = '`  + liODCharTemp[cntODC].CHARVAL_NUM + `' 
                     AND B.PRODUCT_ID    = '`  + lProduct + `'` );       
        }else{
            liODChar = await cds.run(            
            `SELECT  DISTINCT A."SALES_DOC",
                            A."SALESDOC_ITEM",
                            A."ORD_QTY"
                       FROM CP_SALESH AS A
                      INNER JOIN CP_SALESH_CONFIG AS B
                         ON A.SALES_DOC = B.SALES_DOC
                        AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                      WHERE A.LOCATION_ID   = '`  + lLocation + `'
                        AND A.MAT_AVAILDATE <= '` + lDate + `' 
                        AND A.MAT_AVAILDATE > '`  + GenF.getLastWeekDate(lDate) + `' 
                        AND B.CHAR_NUM      = '`  + liODCharTemp[cntODC].CHAR_NUM +`' 
                        AND B.CHARVAL_NUM   != '`  + liODCharTemp[cntODC].CHARVAL_NUM + `' 
                        AND B.PRODUCT_ID    = '`    + lProduct + `'` );       
        } 

        let lTotQty = 0;
        for (let i = 0; i < liODChar.length; i++) {
            lTotQty = parseInt(lTotQty) + parseInt(liODChar[i].ORD_QTY);
        }
        if (lTotQty > 0) {
        const liObjDet = await cds.run(
                                    `SELECT DISTINCT 
                                            OBJ_DEP,
                                            OBJ_COUNTER,
                                            ROW_ID
                                        FROM V_OBDHDR
                                        WHERE LOCATION_ID = '`+ lLocation +`'
                                            AND PRODUCT_ID = '`+ lProduct +`'
                                            AND CHAR_NUM = '`+ liODCharTemp[cntODC].CHAR_NUM +`'
                                            AND CHARVAL_NUM = '`+ liODCharTemp[cntODC].CHARVAL_NUM +`'`
        )
        let lSuccessRate = 0;
        if (lOrdQty > 0){
            lSuccessRate = (( lTotQty / lOrdQty ) * 100).toFixed(2);
        }
        for (let i = 0; i < liObjDet.length; i++) {
            let sqlStr =
            conn.prepare( `UPDATE "CP_TS_OBJDEP_CHARHDR" 
                            SET SUCCESS = `+ lTotQty + `, 
                                SUCCESS_RATE = ` + lSuccessRate + `
                            WHERE CAL_DATE    = '`+ lDate +`'
                              AND LOCATION_ID = '`+ lLocation +`'
                              AND PRODUCT_ID  = '`+ lProduct +`'
                              AND OBJ_TYPE    = 'OD'
                              AND OBJ_DEP     = '`+ liObjDet[i].OBJ_DEP +`'
                              AND OBJ_COUNTER = '`+ liObjDet[i].OBJ_COUNTER +`' 
                              AND ROW_ID      = '`+ liObjDet[i].ROW_ID +`'`
                        )
            sqlStr.exec();
            sqlStr.drop();  
        }
    }


  


     }

     this.logger.info("Head Completed Date: " + lDate);
}

async processODHead(lLocation, lProduct, lDate, lOrdQty){

    
    let liSales = await cds.run(
        `SELECT A.SALES_DOC,
		        A.SALESDOC_ITEM,
		        A.ORD_QTY,
		        B.CHAR_NUM,
		        B.CHARVAL_NUM
            FROM CP_SALESH AS A
           INNER JOIN CP_SALESH_CONFIG AS B
              ON A.SALES_DOC = B.SALES_DOC
             AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
           WHERE A.LOCATION_ID   = '`  + lLocation + `'
             AND A.MAT_AVAILDATE <= '` + lDate + `' 
             AND A.MAT_AVAILDATE > '`  + GenF.getLastWeekDate(lDate) + `' 
             AND B.PRODUCT_ID    = '`  + lProduct + `'
             ORDER BY A.SALES_DOC,
                      A.SALESDOC_ITEM` );

    let liODHead = await cds.run(
            `SELECT DISTINCT OBJ_DEP,
                             OBJ_COUNTER
                FROM "V_OBDHDR"
                WHERE LOCATION_ID = '` + lLocation + `'
                AND PRODUCT_ID  = '` + lProduct + `'`
        );       

        let lTotQty = 0;
        for (let cntODH = 0; cntODH < liODHead.length; cntODH++) {

            lTotQty = 0;

            let liODCharTemp = await cds.run(
                `SELECT DISTINCT CHAR_NUM,
                                    CHARVAL_NUM,
                                    OD_CONDITION,
                                    CHAR_COUNTER
                            FROM "V_OBDHDR"
                            WHERE LOCATION_ID = '` + lLocation + `'
                                AND PRODUCT_ID  = '` + lProduct  + `'
                                AND OBJ_DEP     = '` + liODHead[cntODH].OBJ_DEP + `'
                                AND OBJ_COUNTER = '` + liODHead[cntODH].OBJ_COUNTER + `'
                                ORDER BY CHAR_COUNTER`)

                let lSuccess = "";
                let lFail = "";
                for (let cntSO = 0; cntSO < liSales.length; cntSO++) {
                  if (lFail === "") {
                    for (let cntODC = 0; cntODC < liODCharTemp.length; cntODC++) {
                      if (liSales[cntSO].CHAR_NUM === liODCharTemp[cntODC].CHAR_NUM) {
                        if (liODCharTemp[cntODC].OD_CONDITION === "EQ") {
                          if ( liSales[cntSO].CHARVAL_NUM === liODCharTemp[cntODC].CHARVAL_NUM ) {
                              lSuccess = "X";
                              lFail = "";
                          }else{
                            lFail = "X";
                          }
                        } else {
                          if ( liSales[cntSO].CHARVAL_NUM !== liODCharTemp[cntODC].CHARVAL_NUM ) {
                              lSuccess = "X";
                              lFail = "";
                          }else{
                            lFail = "X";
                          }
                        }
                      }
                      if ( lFail === "X" && 
                           lSuccess === "" &&
                           liODCharTemp[cntODC].CHAR_COUNTER !== liODCharTemp[GenF.addOne(cntODC, liODCharTemp.length)].CHAR_COUNTER
                      ) {
                        break;
                      }
                      if ( liODCharTemp[cntODC].CHAR_COUNTER !== liODCharTemp[GenF.addOne(cntODC, liODCharTemp.length)].CHAR_COUNTER ) {
                        lSuccess = "";
                        lFail    = "";
                      }
                    }
                  }
                  if ( liSales[cntSO].SALES_DOC     !== liSales[GenF.addOne(cntSO, liSales.length)].SALES_DOC ||
                       liSales[cntSO].SALESDOC_ITEM !== liSales[GenF.addOne(cntSO, liSales.length)].SALESDOC_ITEM ||
                       cntSO                        === GenF.addOne(cntSO, liSales.length) ) {
                    if (lFail === "") {
                        lTotQty = parseInt(lTotQty) + parseInt(liSales[cntSO].ORD_QTY);
                    }                      
                    lFail = "";
                  }
                }

    
                let lSuccessRate = 0;
                if (lOrdQty > 0){
                    lSuccessRate = (( lTotQty / lOrdQty ) * 100).toFixed(2);
                }             
            
                let sqlStr =
                conn.prepare( `UPDATE "CP_TS_OBJDEPHDR" 
                                SET SUCCESS = `+ lTotQty + `, 
                                    SUCCESS_RATE = ` + lSuccessRate + `
                                WHERE CAL_DATE    = '`+ lDate +`'
                                  AND LOCATION_ID = '`+ lLocation +`'
                                  AND PRODUCT_ID  = '`+ lProduct +`'
                                  AND OBJ_TYPE    = 'OD'
                                  AND OBJ_DEP     = '`+ liODHead[cntODH].OBJ_DEP +`'
                                  AND OBJ_COUNTER = '`+ liODHead[cntODH].OBJ_COUNTER +`'`
                            )
                sqlStr.exec();
                sqlStr.drop(); 
            

            
        }
                  

}

  async genTimeseriesF(adata) {
    let sRowData = [],
      iTableDate = [];
    var conn = hana.createConnection(),
      result,
      stmt;

    conn.connect(conn_params_container);
    var sqlStr = "SET SCHEMA " + containerSchema;
    // console.log('sqlStr: ', sqlStr);
    try {
      stmt = conn.prepare(sqlStr);
      result = stmt.exec();
      stmt.drop();
    } catch (error) {
      console.log(error);
    }
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
            WHERE "LOCATION_ID" = '` +
        adata.LOCATION_ID +
        `'
            AND "PRODUCT_ID" = '` +
        adata.PRODUCT_ID +
        `'
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
      this.logger.info("Date: " + liFutureCharPlan[lFutInd].WEEK_DATE);
      if (
        lFutInd === 0 ||
        liFutureCharPlan[lFutInd].LOCATION_ID !==
          liFutureCharPlan[
            GenF.subOne(lFutInd, liFutureCharPlan.lenght)
          ].LOCATION_ID ||
        liFutureCharPlan[lFutInd].PRODUCT_ID !==
          liFutureCharPlan[
            GenF.subOne(lFutInd, liFutureCharPlan.lenght)
          ].PRODUCT_ID
      ) {
        try {
          // await cds.run(`DELETE FROM "CP_TS_OBJDEP_CHARHDR_F" WHERE "LOCATION_ID" = '`
          // +liFutureCharPlan[lFutInd].LOCATION_ID+ `' AND
          // "PRODUCT_ID" = '` +liFutureCharPlan[lFutInd].PRODUCT_ID + `'`);

          var sqlStr =
            "DELETE FROM CP_TS_OBJDEP_CHARHDR_F WHERE LOCATION_ID = " +
            "'" +
            liFutureCharPlan[lFutInd].LOCATION_ID +
            "' AND PRODUCT_ID = " +
            "'" +
            liFutureCharPlan[lFutInd].PRODUCT_ID +
            "'";
          var stmt = conn.prepare(sqlStr);
          await stmt.exec();
          stmt.drop();
          // await cds.run(
          //     DELETE.from("CP_TS_OBJDEP_CHARHDR_F").where({
          //         xpr: [
          //         { ref: ["LOCATION_ID"] }, "=", { val: liFutureCharPlan[lFutInd].LOCATION_ID }, 'AND',
          //         { ref: ["PRODUCT_ID"] }, "=", { val: liFutureCharPlan[lFutInd].PRODUCT_ID }
          //         ],
          //     })
          // );
        } catch (error) {
          var e = error;
        }

        liObdhdr = await cds.run(
          `SELECT *
                        FROM "V_OBDHDR"
                       WHERE LOCATION_ID = '` +
            liFutureCharPlan[lFutInd].LOCATION_ID +
            `'
                         AND PRODUCT_ID = '` +
            liFutureCharPlan[lFutInd].PRODUCT_ID +
            `'`
        );
      }

      /** Get Future Plan */
      const liFutureCharPlanDate = await cds.run(
        `SELECT *
               FROM "CP_IBP_FCHARPLAN"
               WHERE LOCATION_ID = '` +
          liFutureCharPlan[lFutInd].LOCATION_ID +
          `'
               AND PRODUCT_ID = '` +
          liFutureCharPlan[lFutInd].PRODUCT_ID +
          `'
               AND VERSION = '` +
          liFutureCharPlan[lFutInd].VERSION +
          `'
               AND SCENARIO = '` +
          liFutureCharPlan[lFutInd].SCENARIO +
          `'
               AND WEEK_DATE = '` +
          liFutureCharPlan[lFutInd].WEEK_DATE +
          `'`
      );

      liObjdepF = [];
      var tableObjH = [],
        rowObjH = [],
        vSuccessRate = 0;
      for (let lObjInd = 0; lObjInd < liObdhdr.length; lObjInd++) {
        lsObjdepF = {};
        rowObjH = [];
        lsObjdepF.CAL_DATE = liFutureCharPlan[lFutInd].WEEK_DATE;
        lsObjdepF.LOCATION_ID = liFutureCharPlan[lFutInd].LOCATION_ID;
        lsObjdepF.PRODUCT_ID = liFutureCharPlan[lFutInd].PRODUCT_ID;
        lsObjdepF.VERSION = liFutureCharPlan[lFutInd].VERSION;
        lsObjdepF.SCENARIO = liFutureCharPlan[lFutInd].SCENARIO;
        lsObjdepF.OBJ_TYPE = "OD";
        lsObjdepF.OBJ_DEP = liObdhdr[lObjInd].OBJ_DEP;
        lsObjdepF.OBJ_COUNTER = liObdhdr[lObjInd].OBJ_COUNTER;
        lsObjdepF.ROW_ID = liObdhdr[lObjInd].ROW_ID;
        lsObjdepF.SUCCESS = 0;
        for (
          let lFutIndex = 0;
          lFutIndex < liFutureCharPlanDate.length;
          lFutIndex++
        ) {
          if (
            liFutureCharPlanDate[lFutIndex].LOCATION_ID ===
              liObdhdr[lObjInd].LOCATION_ID &&
            liFutureCharPlanDate[lFutIndex].PRODUCT_ID ===
              liObdhdr[lObjInd].PRODUCT_ID &&
            liFutureCharPlanDate[lFutIndex].VERSION ===
              liFutureCharPlan[lFutInd].VERSION &&
            liFutureCharPlanDate[lFutIndex].SCENARIO ===
              liFutureCharPlan[lFutInd].SCENARIO &&
            liFutureCharPlanDate[lFutIndex].CLASS_NUM ===
              liObdhdr[lObjInd].CLASS_NUM &&
            liFutureCharPlanDate[lFutIndex].CHAR_NUM ===
              liObdhdr[lObjInd].CHAR_NUM
          ) {
            if (
              liObdhdr[lObjInd].OD_CONDITION === "EQ" &&
              liObdhdr[lObjInd].CHARVAL_NUM ===
                liFutureCharPlanDate[lFutIndex].CHARVAL_NUM
            ) {
              lsObjdepF.SUCCESS = liFutureCharPlanDate[lFutIndex].OPT_QTY;
            }
            if (
              liObdhdr[lObjInd].OD_CONDITION === "NE" &&
              liObdhdr[lObjInd].CHARVAL_NUM !==
                liFutureCharPlanDate[lFutIndex].CHARVAL_NUM
            ) {
              lsObjdepF.SUCCESS = liFutureCharPlanDate[lFutIndex].OPT_QTY;
            }
          }
        }

        rowObjH.push(
          lsObjdepF.CAL_DATE,
          lsObjdepF.LOCATION_ID,
          lsObjdepF.PRODUCT_ID,
          lsObjdepF.OBJ_TYPE,
          lsObjdepF.OBJ_DEP,
          lsObjdepF.OBJ_COUNTER,
          lsObjdepF.ROW_ID,
          lsObjdepF.VERSION,
          lsObjdepF.SCENARIO,
          parseInt(lsObjdepF.SUCCESS),
          vSuccessRate
        );
        liObjdepF.push(GenF.parse(lsObjdepF));
        tableObjH.push(rowObjH);
      }

      /** Get Future Plan */
      const liFutureDemandPlanDate = await cds.run(
        `SELECT *
               FROM "CP_IBP_FUTUREDEMAND"
               WHERE LOCATION_ID = '` +
          liFutureCharPlan[lFutInd].LOCATION_ID +
          `'
               AND PRODUCT_ID = '` +
          liFutureCharPlan[lFutInd].PRODUCT_ID +
          `'
               AND WEEK_DATE = '` +
          liFutureCharPlan[lFutInd].WEEK_DATE +
          `'
               AND VERSION       = '` +
          liFutureCharPlan[lFutInd].VERSION +
          `'
               AND SCENARIO      = '` +
          liFutureCharPlan[lFutInd].SCENARIO +
          `'`
      );

      if (liObjdepF.length > 0) {
        try {
          for (let index = 0; index < liObjdepF.length; index++) {
            tableObjH[index][10] = 0;
            liObjdepF[index].SUCCESS_RATE = 0;
            for (
              let lDemI = 0;
              lDemI < liFutureDemandPlanDate.length;
              lDemI++
            ) {
              if (liFutureDemandPlanDate[lDemI].QUANTITY > 0) {
                tableObjH[index][10] =
                  (tableObjH[index][9] /
                    liFutureDemandPlanDate[lDemI].QUANTITY) *
                  100;
                liObjdepF[index].SUCCESS_RATE =
                  (liObjdepF[index].SUCCESS /
                    liFutureDemandPlanDate[lDemI].QUANTITY) *
                  100;
              }
            }

            // await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF[index]));
          }
          var sqlStr =
            "INSERT INTO CP_TS_OBJDEP_CHARHDR_F(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, ROW_ID, VERSION, SCENARIO, SUCCESS, SUCCESS_RATE) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          var stmt = conn.prepare(sqlStr);
          await stmt.execBatch(tableObjH);
          stmt.drop();
          //await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF));
        } catch (e) {
          this.logger.error(e.message + "/" + e.query);
        }
      }
    }

    this.logger.info("Completed timeseries Service");

    var lProcessTime = Math.floor(
      Math.abs(lStartTime - new Date()) / 1000 / 60
    );
    this.logger.info(
      "Processing time : " + lProcessTime + " Minutes",
      "background: #222; color: #bada55"
    );
  }
}

module.exports = GenTimeseries;
