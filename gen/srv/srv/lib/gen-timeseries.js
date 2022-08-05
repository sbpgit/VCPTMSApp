const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const containerSchema = cds.env.requires.db.credentials.schema;
const conn_params_container = {
    serverNode:
        cds.env.requires.db.credentials.host +
        ":" +
        cds.env.requires.db.credentials.port,
    uid: cds.env.requires.db.credentials.user, //cds userid environment variable
    pwd: cds.env.requires.db.credentials.password, //cds password environment variable
    encrypt: "TRUE",
    //   ssltruststore: cds.env.requires.hana.credentials.certificate,
};

const conn = hana.createConnection();

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
            this.logger.error(error);
        }
    }

    /**
     * Generate Timeseries
     */
    async genTimeseries(adata) {
        this.logger.info("Started timeseries Service");

        let lDate = new Date();
        let lStartDate = new Date(
            lDate.getFullYear(),
            lDate.getMonth(),
            lDate.getDate() - adata.PAST_DAYS
        );

        // Get Sales Count Information
        const liSalesCount = await cds.run(
            `SELECT *
         FROM V_ORD_COUNT
        WHERE "LOCATION_ID" = '` + adata.LOCATION_ID + `'
          AND "PRODUCT_ID" = '` + adata.PRODUCT_ID + `'
          AND "WEEK_DATE" >= '` + lStartDate.toISOString().split("T")[0] + `'
          AND "WEEK_DATE" <= '` + GenF.getCurrentDate() + `'
        ORDER BY  "LOCATION_ID" ASC, 
                  "PRODUCT_ID" ASC,
                  "WEEK_DATE" ASC`
        );

        // Get Distinct Chan Num and Value
        const liODCharTemp = await cds.run(
            `SELECT DISTINCT CHAR_NUM,
                        CHARVAL_NUM,
                        OD_CONDITION
                    FROM "V_OBDHDR"
                WHERE LOCATION_ID = '` + adata.LOCATION_ID + `'
                    AND PRODUCT_ID  = '` + adata.PRODUCT_ID + `'`
        );


        for (let i = 0; i < liSalesCount.length; i++) {
            // For every change in Week Date
            this.logger.info("Processing OD Char Week: " + liSalesCount[i].WEEK_DATE + " No:" + liSalesCount[i].WEEK_NO);

            await this.insertInitialTS(
                liSalesCount[i].LOCATION_ID,
                liSalesCount[i].WEEK_NO,
                liSalesCount[i].PRODUCT_ID
            );

            await this.processODChar(
                liSalesCount[i].LOCATION_ID,
                liSalesCount[i].PRODUCT_ID,
                liSalesCount[i].WEEK_DATE,
                liSalesCount[i].WEEK_NO,
                liSalesCount[i].ORD_QTY,
                liODCharTemp
            );

            await this.processODHead(
                liSalesCount[i].LOCATION_ID,
                liSalesCount[i].PRODUCT_ID,
                liSalesCount[i].WEEK_DATE,
                liSalesCount[i].WEEK_NO,
                liSalesCount[i].ORD_QTY
            );

            try {
                let sqlStr = conn.prepare(
                    `DELETE FROM "CP_VC_HISTORY_TS" WHERE "Location" = '` + liSalesCount[i].LOCATION_ID + `'
                                            AND "Product" = '` + liSalesCount[i].PRODUCT_ID + `'
                                            AND "PeriodOfYear"  = '` + liSalesCount[i].WEEK_NO + `'
                                            AND ( "Target" = 0 or "CharCount" = 0 )`
                );
                await sqlStr.exec();
                await sqlStr.drop();
            } catch (error) {
                this.logger.error(error.message);
            }

        }

        this.logger.info("Process Completed");

    }

    async insertInitialTS(lLocation, lDate, lProduct) {
        let sqlStr;

        try {
            sqlStr = conn.prepare(
                `DELETE FROM "CP_VC_HISTORY_TS" WHERE "Location" = '` + lLocation + `'
                                          AND "Product" = '` + lProduct + `'
                                          AND "PeriodOfYear"  = '` + lDate + `'`
            );
            sqlStr.exec();
            sqlStr.drop();
        } catch (error) {
            this.logger.error(error.message);
        }

        sqlStr = conn.prepare(
            `INSERT INTO "CP_VC_HISTORY_TS"  
                SELECT  DISTINCT WEEK_NO,
                        V_ORD_COUNT.LOCATION_ID,
                        V_ORD_COUNT.PRODUCT_ID,
                        'OD',
                        CONCAT( OBJ_DEP, CONCAT( '_', OBJ_COUNTER ) ),
                        ROW_ID,
                        CONCAT( 'att', ROW_ID ),
                        '0',
                        '0',
                        '0',
                        '0'
                   FROM V_ORD_COUNT
             INNER JOIN V_OBDHDR
                     ON V_ORD_COUNT.LOCATION_ID = V_OBDHDR.LOCATION_ID
                    AND V_ORD_COUNT.PRODUCT_ID = V_OBDHDR.PRODUCT_ID
                  WHERE V_ORD_COUNT."LOCATION_ID" = '` + lLocation + `'
                    AND V_ORD_COUNT."PRODUCT_ID" = '` + lProduct + `'
                    AND V_ORD_COUNT.WEEK_NO = '` + lDate + `'`
        );
        sqlStr.exec();
        sqlStr.drop();
    }


    async processODChar(lLocation, lProduct, lDate, lWeekNo, lOrdQty, liODCharTemp) {

        let liODChar = [];
        for (let cntODC = 0; cntODC < liODCharTemp.length; cntODC++) {
            if (liODCharTemp[cntODC].OD_CONDITION === "EQ") {
                liODChar = await cds.run(
                    `SELECT DISTINCT A."SALES_DOC",
                        A."SALESDOC_ITEM",
                        A."ORD_QTY"
                    FROM CP_SALESH AS A
                   INNER JOIN CP_SALESH_CONFIG AS B
                      ON A.SALES_DOC = B.SALES_DOC
                     AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                   WHERE A.LOCATION_ID   = '` + lLocation + `'
                     AND A.MAT_AVAILDATE <= '` + lDate + `' 
                     AND A.MAT_AVAILDATE > '` + GenF.getLastWeekDate(lDate) + `' 
                     AND B.CHAR_NUM      = '` + liODCharTemp[cntODC].CHAR_NUM + `' 
                     AND B.CHARVAL_NUM   = '` + liODCharTemp[cntODC].CHARVAL_NUM + `' 
                     AND B.PRODUCT_ID    = '` + lProduct + `'`
                );
            } else {
                liODChar = await cds.run(
                    `SELECT  DISTINCT A."SALES_DOC",
                            A."SALESDOC_ITEM",
                            A."ORD_QTY"
                       FROM CP_SALESH AS A
                      INNER JOIN CP_SALESH_CONFIG AS B
                         ON A.SALES_DOC = B.SALES_DOC
                        AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                      WHERE A.LOCATION_ID   = '` + lLocation + `'
                        AND A.MAT_AVAILDATE <= '` + lDate + `' 
                        AND A.MAT_AVAILDATE > '` + GenF.getLastWeekDate(lDate) + `' 
                        AND B.CHAR_NUM      = '` + liODCharTemp[cntODC].CHAR_NUM + `' 
                        AND B.CHARVAL_NUM   != '` + liODCharTemp[cntODC].CHARVAL_NUM + `' 
                        AND B.PRODUCT_ID    = '` + lProduct + `'`
                );
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
                WHERE LOCATION_ID = '` + lLocation + `'
                    AND PRODUCT_ID = '` + lProduct + `'
                    AND CHAR_NUM = '` + liODCharTemp[cntODC].CHAR_NUM + `'
                    AND CHARVAL_NUM = '` + liODCharTemp[cntODC].CHARVAL_NUM + `'`
                );
                let lSuccessRate = 0;
                if (lOrdQty > 0) {
                    lSuccessRate = ((lTotQty / lOrdQty) * 100).toFixed(2);
                }
                for (let i = 0; i < liObjDet.length; i++) {
                    let sqlStr = conn.prepare(
                        `UPDATE "CP_VC_HISTORY_TS" 
                              SET "CharCount" = "CharCount" + ` + lTotQty + `,
                                  "CharCountPercent" = ` + lSuccessRate + `
                            WHERE "PeriodOfYear"    = '` + lWeekNo + `'
                              AND "Location" = '` + lLocation + `'
                              AND "Product"  = '` + lProduct + `'
                              AND "Type"    = 'OD'
                              AND "GroupID"     = '` + liObjDet[i].OBJ_DEP + '_' + liObjDet[i].OBJ_COUNTER + `'
                              AND "Row" = '` + liObjDet[i].ROW_ID + `'`
                    );
                    sqlStr.exec();
                    sqlStr.drop();
                }
            }
        }

    }

    async processODHead(lLocation, lProduct, lDate, lWeekNo, lOrdQty) {

        let liSalesHead = await cds.run(
            `SELECT DISTINCT SALES_DOC,
                SALESDOC_ITEM,
                ORD_QTY
              FROM CP_SALESH
             WHERE LOCATION_ID   = '` + lLocation + `'
               AND MAT_AVAILDATE <= '` + lDate + `' 
               AND MAT_AVAILDATE > '` + GenF.getLastWeekDate(lDate) + `' 
               AND PRODUCT_ID    = '` + lProduct + `'
               ORDER BY SALES_DOC,
                        SALESDOC_ITEM`
        );

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
           WHERE A.LOCATION_ID   = '` + lLocation + `'
             AND A.MAT_AVAILDATE <= '` + lDate + `' 
             AND A.MAT_AVAILDATE > '` + GenF.getLastWeekDate(lDate) + `' 
             AND B.PRODUCT_ID    = '` + lProduct + `'
             ORDER BY A.SALES_DOC,
                      A.SALESDOC_ITEM`
        );

        let liODHead = await cds.run(
            `SELECT DISTINCT OBJ_DEP,
                             OBJ_COUNTER
                FROM "V_OBDHDR"
                WHERE LOCATION_ID = '` + lLocation + `'
                AND PRODUCT_ID  = '` + lProduct + `'`
            // AND OBJ_DEP = '1085624'`
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
                    AND PRODUCT_ID  = '` + lProduct + `'
                    AND OBJ_DEP     = '` + liODHead[cntODH].OBJ_DEP + `'
                    AND OBJ_COUNTER = '` + liODHead[cntODH].OBJ_COUNTER + `'
                    ORDER BY CHAR_COUNTER`
            );

            let lSuccess = "";
            let lFail = "";
            for (let cntSoH = 0; cntSoH < liSalesHead.length; cntSoH++) {
                lSuccess = '';
                lFail = "";
                for (let cntODC = 0; cntODC < liODCharTemp.length; cntODC++) {
                    if (liODCharTemp[cntODC].CHAR_COUNTER !== liODCharTemp[GenF.subOne(cntODC)].CHAR_COUNTER) {
                        lSuccess = '';
                    }

                    for (let cntSO = 0; cntSO < liSales.length; cntSO++) {
                        if (liSales[cntSO].SALES_DOC === liSalesHead[cntSoH].SALES_DOC &&
                            liSales[cntSO].SALESDOC_ITEM === liSalesHead[cntSoH].SALESDOC_ITEM &&
                            liSales[cntSO].CHAR_NUM === liODCharTemp[cntODC].CHAR_NUM) {
                            if (liODCharTemp[cntODC].OD_CONDITION === "EQ") {
                                if (liSales[cntSO].CHARVAL_NUM === liODCharTemp[cntODC].CHARVAL_NUM) {
                                    lSuccess = "X";
                                }
                            } else {
                                if (liSales[cntSO].CHARVAL_NUM !== liODCharTemp[cntODC].CHARVAL_NUM) {
                                    lSuccess = "X";
                                }
                            }
                        }
                    }
                    if (lSuccess === '') {
                        if (liODCharTemp[cntODC].CHAR_COUNTER !== liODCharTemp[GenF.addOne(cntODC, liODCharTemp.length)].CHAR_COUNTER) {
                            lFail = 'X';
                            break;
                        }
                    }
                }

                if (lFail === "") {
                    lTotQty = parseInt(lTotQty) + parseInt(liSalesHead[cntSoH].ORD_QTY);
                }
            }

            let lSuccessRate = 0;
            if (lOrdQty > 0) {
                lSuccessRate = ((lTotQty / lOrdQty) * 100).toFixed(2);
            }

            let sqlStr = conn.prepare(
                `UPDATE "CP_VC_HISTORY_TS" 
                SET "Target" = "Target" + ` + lTotQty + `,
                    "TargetPercent" = ` + lSuccessRate + `
            WHERE "PeriodOfYear"    = '` + lWeekNo + `'
                AND "Location" = '` + lLocation + `'
                AND "Product"  = '` + lProduct + `'
                AND "Type"    = 'OD'
                AND "GroupID"     = '` + liODHead[cntODH].OBJ_DEP + '_' + liODHead[cntODH].OBJ_COUNTER + `'`
            );
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

        try {
            stmt = conn.prepare(sqlStr);
            result = stmt.exec();
            stmt.drop();
        } catch (error) {
            this.logger.error(error.message);
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
            WHERE "LOCATION_ID" = '` + adata.LOCATION_ID + `'
            AND "PRODUCT_ID" = '` + adata.PRODUCT_ID + `'
            ORDER BY LOCATION_ID, 
                    PRODUCT_ID, 
                    VERSION,
                    SCENARIO,
                    WEEK_DATE`
        );

        let lsObjdepF = {};
        let liObjdepF = [];
        let liObdhdr = [];

        try {
            var sqlStr =
                `DELETE FROM CP_TS_OBJDEP_CHARHDR_F 
                 WHERE LOCATION_ID = '` + adata.LOCATION_ID + `' 
                   AND PRODUCT_ID = '` + adata.PRODUCT_ID + `'`
            var stmt = conn.prepare(sqlStr);
            await stmt.exec();
            stmt.drop();

        } catch (error) {
            this.logger.error(error.message);
        }

        liObdhdr = await cds.run(
            `SELECT *
           FROM "V_OBDHDR"
          WHERE LOCATION_ID = '` + adata.LOCATION_ID + `'
            AND PRODUCT_ID = '` + adata.PRODUCT_ID + `'`
        );
        let liObdhdrDist = await cds.run(
            `SELECT DISTINCT OBJ_DEP,
                        OBJ_COUNTER,
                        ROW_ID
           FROM "V_OBDHDR"
          WHERE LOCATION_ID = '` + adata.LOCATION_ID + `'
            AND PRODUCT_ID = '` + adata.PRODUCT_ID + `'`
        );

        for (let lFutInd = 0; lFutInd < liFutureCharPlan.length; lFutInd++) {
            this.logger.info("Date: " + liFutureCharPlan[lFutInd].WEEK_DATE);

            /** Get Future Plan */
            const liFutureCharPlanDate = await cds.run(
                `SELECT *
               FROM "CP_IBP_FCHARPLAN"
               WHERE LOCATION_ID = '` + liFutureCharPlan[lFutInd].LOCATION_ID + `'
               AND PRODUCT_ID = '` + liFutureCharPlan[lFutInd].PRODUCT_ID + `'
               AND VERSION = '` + liFutureCharPlan[lFutInd].VERSION + `'
               AND SCENARIO = '` + liFutureCharPlan[lFutInd].SCENARIO + `'
               AND WEEK_DATE = '` + liFutureCharPlan[lFutInd].WEEK_DATE + `'`
            );

            liObjdepF = [];
            let tableObjH = [],
                rowObjH = [],
                vSuccessRate = 0;
            for (let lObdDis = 0; lObdDis < liObdhdrDist.length; lObdDis++) {
                lsObjdepF = {};
                //rowObjH = [];
                lsObjdepF.CAL_DATE = liFutureCharPlan[lFutInd].WEEK_DATE;
                lsObjdepF.LOCATION_ID = liFutureCharPlan[lFutInd].LOCATION_ID;
                lsObjdepF.PRODUCT_ID = liFutureCharPlan[lFutInd].PRODUCT_ID;
                lsObjdepF.VERSION = liFutureCharPlan[lFutInd].VERSION;
                lsObjdepF.SCENARIO = liFutureCharPlan[lFutInd].SCENARIO;
                lsObjdepF.OBJ_TYPE = "OD";
                lsObjdepF.OBJ_DEP = liObdhdrDist[lObdDis].OBJ_DEP;
                lsObjdepF.OBJ_COUNTER = liObdhdrDist[lObdDis].OBJ_COUNTER;
                lsObjdepF.ROW_ID = liObdhdrDist[lObdDis].ROW_ID;
                lsObjdepF.SUCCESS = 0;

                for (let lObjInd = 0; lObjInd < liObdhdr.length; lObjInd++) {
                    if (
                        liObdhdrDist[lObdDis].OBJ_DEP === liObdhdr[lObjInd].OBJ_DEP &&
                        liObdhdrDist[lObdDis].OBJ_COUNTER ===
                        liObdhdr[lObjInd].OBJ_COUNTER &&
                        liObdhdrDist[lObdDis].ROW_ID === liObdhdr[lObjInd].ROW_ID
                    ) {
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
                                    lsObjdepF.SUCCESS =
                                        parseInt(lsObjdepF.SUCCESS) + parseInt(liFutureCharPlanDate[lFutIndex].OPT_QTY);
                                }
                                if (
                                    liObdhdr[lObjInd].OD_CONDITION === "NE" &&
                                    liObdhdr[lObjInd].CHARVAL_NUM !==
                                    liFutureCharPlanDate[lFutIndex].CHARVAL_NUM
                                ) {
                                    lsObjdepF.SUCCESS =
                                        parseInt(lsObjdepF.SUCCESS) + parseInt(liFutureCharPlanDate[lFutIndex].OPT_QTY);
                                }
                            }
                        }
                        /*
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
            */

                        //      tableObjH.push(rowObjH);
                    }
                }
                liObjdepF.push(GenF.parse(lsObjdepF));
            }


            /** Get Future Plan */
            const liFutureDemandPlanDate = await cds.run(
                `SELECT *
               FROM "CP_IBP_FUTUREDEMAND"
               WHERE LOCATION_ID = '` + liFutureCharPlan[lFutInd].LOCATION_ID + `'
               AND PRODUCT_ID    = '` + liFutureCharPlan[lFutInd].PRODUCT_ID + `'
               AND WEEK_DATE     = '` + liFutureCharPlan[lFutInd].WEEK_DATE + `'
               AND VERSION       = '` + liFutureCharPlan[lFutInd].VERSION + `'
               AND SCENARIO      = '` + liFutureCharPlan[lFutInd].SCENARIO + `'`
            );

            if (liObjdepF.length > 0) {
                try {
                    for (let index = 0; index < liObjdepF.length; index++) {
                        //            tableObjH[index][10] = 0;
                        liObjdepF[index].SUCCESS_RATE = 0;
                        for (
                            let lDemI = 0;
                            lDemI < liFutureDemandPlanDate.length;
                            lDemI++
                        ) {
                            if (liFutureDemandPlanDate[lDemI].QUANTITY > 0) {
                                /*                  
                                                tableObjH[index][10] =
                                                  (tableObjH[index][9] /
                                                    liFutureDemandPlanDate[lDemI].QUANTITY) *
                                                  100;
                                */
                                liObjdepF[index].SUCCESS_RATE =
                                    (liObjdepF[index].SUCCESS /
                                        liFutureDemandPlanDate[lDemI].QUANTITY) *
                                    100;
                            }
                        }

                        var sqlStr =
                            //"INSERT INTO CP_TS_OBJDEP_CHARHDR_F(CAL_DATE, LOCATION_ID, PRODUCT_ID, OBJ_TYPE, OBJ_DEP, OBJ_COUNTER, ROW_ID, VERSION, SCENARIO, SUCCESS, SUCCESS_RATE) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                            `INSERT INTO "CP_TS_OBJDEP_CHARHDR_F" VALUES(
                '` + liObjdepF[index].CAL_DATE + `',
                '` + liObjdepF[index].LOCATION_ID + `',
                '` + liObjdepF[index].PRODUCT_ID + `',
                '` + liObjdepF[index].OBJ_TYPE + `',
                '` + liObjdepF[index].OBJ_DEP + `',
                '` + liObjdepF[index].OBJ_COUNTER + `',
                '` + liObjdepF[index].ROW_ID + `',
                '` + liObjdepF[index].VERSION + `',
                '` + liObjdepF[index].SCENARIO + `',
                '` + liObjdepF[index].SUCCESS + `',
                '` + liObjdepF[index].SUCCESS_RATE + `'
            )`
                        var stmt = conn.prepare(sqlStr);
                        await stmt.exec();
                        stmt.drop();
                        // await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF[index]));
                    }

                    //await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF));
                } catch (e) {
                    this.logger.error(e.message + "/" + e.query);
                }
            }
        }
        try {
            var sqlStr = `
                DELETE FROM "CP_TS_OBJDEP_CHARHDR_F" WHERE SUCCESS = 0`;
            var stmt = conn.prepare(sqlStr);
            await stmt.exec();
            stmt.drop();
        } catch (e) {
            this.logger.error(e.message + "/" + e.query);
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
