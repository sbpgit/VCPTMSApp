const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");

class GenTimeseries {
    constructor() { }

    /**
     * Generate Timeseries
     */
    async genTimeseries(adata, req, Flag) {

        await GenF.logMessage(req, `Started history timeseries ${adata}`);

        // Get Sales Count Information
        const liSalesCount = await cds.run(
            `SELECT *
               FROM V_ORD_COUNT
              WHERE "LOCATION_ID" = '${adata.LOCATION_ID}'
                AND "PRODUCT_ID"  = '${adata.PRODUCT_ID}'
                ORDER BY "LOCATION_ID" ASC, 
                         "PRODUCT_ID" ASC,
                         "WEEK_DATE" ASC`
        );

        let lMainProduct = '';
        // Get Configurable product
        let lsMainProduct = await SELECT.one
                                        .from('CP_PARTIALPROD_INTRO')
                                        .columns('REF_PRODID')
                                        .where(`LOCATION_ID = '${adata.LOCATION_ID}' AND PRODUCT_ID = '${adata.PRODUCT_ID}'`);
        if (lsMainProduct === null) {
            lMainProduct = GenF.parse(adata.PRODUCT_ID);
        }
        else {
            lMainProduct = lsMainProduct.REF_PRODID;
        }

        // Get Object Dependency
        const liODChar = await cds.run(
            `SELECT DISTINCT OBJ_DEP,
                            OBJ_COUNTER,
                            CHAR_NUM,
                            CHARVAL_NUM,
                            OD_CONDITION,
                            CHAR_COUNTER
                        FROM "V_OBDHDR"
                        WHERE LOCATION_ID = '${adata.LOCATION_ID}'
                            AND PRODUCT_ID  = '${lMainProduct}'
                            ORDER BY OBJ_DEP,
                                    OBJ_COUNTER,
                                    CHAR_COUNTER`
        );

        let liOD = [];
        let lsOD = {};
        let lRowID = 0;

        for (let cntODC = 0; cntODC < liODChar.length; cntODC++) {
            if (cntODC === 0 ||
                liODChar[cntODC].OBJ_DEP !== liODChar[GenF.subOne(cntODC)].OBJ_DEP ||
                liODChar[cntODC].OBJ_COUNTER !== liODChar[GenF.subOne(cntODC)].OBJ_COUNTER) {
                lsOD = {};
                lsOD['OBJ_DEP'] = GenF.parse(liODChar[cntODC].OBJ_DEP);
                lsOD['OBJ_COUNTER'] = GenF.parse(liODChar[cntODC].OBJ_COUNTER);
                lsOD['CHAR'] = [];          // Maintain Characteristic condition
                lsOD['CHAR_UNI'] = [];      // Maintain Characteristics only once
                lRowID = 1;
            }
            let lsODC = {};
            lsODC['CHAR_COUNTER'] = GenF.parse(liODChar[cntODC].CHAR_COUNTER);
            lsODC['CHAR_NUM'] = GenF.parse(liODChar[cntODC].CHAR_NUM);
            lsODC['CHARVAL_NUM'] = GenF.parse(liODChar[cntODC].CHARVAL_NUM);
            lsODC['OD_CONDITION'] = GenF.parse(liODChar[cntODC].OD_CONDITION);
            
            let lUnique = '';
            if(lsOD['CHAR'].length === 0) {
                lUnique = 'X';
            }

            // Check if Characteristic already assigne a Row ID. If not, check for the highest number and add one            
            for (let cntC = 0; cntC < lsOD['CHAR'].length; cntC++) {
                if (lsOD['CHAR'][cntC].CHAR_NUM === liODChar[cntODC].CHAR_NUM) {
                    lRowID = parseInt(lsOD['CHAR'][cntC].ROW_ID);
                    break;
                }
                if (parseInt(lsOD['CHAR'][cntC].ROW_ID) > lRowID) {
                    lRowID = parseInt(lsOD['CHAR'][cntC].ROW_ID)
                }
                if (GenF.addOne(cntC) === lsOD['CHAR'].length) {
                    lRowID = parseInt(lRowID) + 1;
                    lUnique = 'X';
                }
            }


            lsODC['ROW_ID'] = lRowID;
            lsOD['CHAR'].push(GenF.parse(lsODC));

            if(lUnique === 'X'){
                let lsCharUni = {};
                lsCharUni['CHAR_NUM'] = lsODC['CHAR_NUM'];
                lsCharUni['ROW_ID'] = lsODC['ROW_ID'];
                lsCharUni['ORD_QTY'] = 0;
                lsOD['CHAR_UNI'].push(GenF.parse(lsCharUni));
            }

            if (cntODC == GenF.addOne(cntODC, liODChar.length) ||
                liODChar[cntODC].OBJ_DEP !== liODChar[GenF.addOne(cntODC, liODChar.length)].OBJ_DEP ||
                liODChar[cntODC].OBJ_COUNTER !== liODChar[GenF.addOne(cntODC, liODChar.length)].OBJ_COUNTER) {
                liOD.push(lsOD);
            }
        }


        for (let i = 0; i < liSalesCount.length; i++) {
            await DELETE.from('CP_VC_HISTORY_TS')
                .where({
                    xpr: [
                        { ref: ["LOCATION_ID"] }, '=', { val: liSalesCount[i].LOCATION_ID }, 'and',
                        { ref: ["PRODUCT_ID"] }, '=', { val: liSalesCount[i].PRODUCT_ID }, 'and',
                        { ref: ["PERIOD_NUM"] }, '=', { val: liSalesCount[i].WEEK_NO }, 'and',
                        { ref: ["TYPE"] }, '=', { val: 'OD' }
                    ]
                });

            let liODTemp = GenF.parse(liOD);

            let liSalesHead = await cds.run(
                `SELECT DISTINCT SALES_DOC,
                                 SALESDOC_ITEM,
                                 ORD_QTY
                    FROM V_SALES_H
                    WHERE LOCATION_ID   = '` + liSalesCount[i].LOCATION_ID + `'
                    AND MAT_AVAILDATE <= '` + liSalesCount[i].WEEK_DATE + `' 
                    AND MAT_AVAILDATE > '` + GenF.getLastWeekDate(liSalesCount[i].WEEK_DATE) + `' 
                    AND PRODUCT_ID    = '` + liSalesCount[i].PRODUCT_ID + `'
                    ORDER BY SALES_DOC,
                            SALESDOC_ITEM`
            );

            let liSalesConfig = await cds.run(
                `SELECT A.SALES_DOC,
                        A.SALESDOC_ITEM,
                        A.ORD_QTY,
                        B.CHAR_NUM,
                        B.CHARVAL_NUM
                   FROM V_SALES_H AS A
                  INNER JOIN V_UNIQUE_ID AS B
                     ON A.UNIQUE_ID   = B.UNIQUE_ID
                    AND A.PRODUCT_ID  = B.PRODUCT_ID
                    AND A.LOCATION_ID = B.LOCATION_ID
                  WHERE A.LOCATION_ID   = '` + liSalesCount[i].LOCATION_ID + `'
                    AND A.MAT_AVAILDATE <= '` + liSalesCount[i].WEEK_DATE + `' 
                    AND A.MAT_AVAILDATE > '` + GenF.getLastWeekDate(liSalesCount[i].WEEK_DATE) + `' 
                    AND B.PRODUCT_ID    = '` + liSalesCount[i].PRODUCT_ID + `'
                  ORDER BY A.SALES_DOC,
                           A.SALESDOC_ITEM`
            );

            let liVCHistory = [];

            for (let cntODT = 0; cntODT < liODTemp.length; cntODT++) {

                for (let cntODTC = 0; cntODTC < liODTemp[cntODT]['CHAR'].length; cntODTC++) {

                    liODTemp[cntODT]['CHAR'][cntODTC]['CHAR_QTY'] = 0;
                    liODTemp[cntODT]['CHAR'][cntODTC]['SO'] = []
                    let lSO = {};
                    for (let cntSC = 0; cntSC < liSalesConfig.length; cntSC++) {
                        if (liSalesConfig[cntSC].CHAR_NUM === liODTemp[cntODT]['CHAR'][cntODTC].CHAR_NUM) {
                            if (liODTemp[cntODT]['CHAR'][cntODTC].OD_CONDITION === "EQ") {
                                if (liSalesConfig[cntSC].CHARVAL_NUM === liODTemp[cntODT]['CHAR'][cntODTC].CHARVAL_NUM) {
                                    lSO = {};
                                    lSO['SALES_DOC'] = GenF.parse(liSalesConfig[cntSC].SALES_DOC);
                                    lSO['SALESDOC_ITEM'] = GenF.parse(liSalesConfig[cntSC].SALESDOC_ITEM);
                                    lSO['ORD_QTY'] = GenF.parse(liSalesConfig[cntSC].ORD_QTY);
                                    liODTemp[cntODT]['CHAR'][cntODTC]['SO'].push(lSO);

                                    for (let cntODCU = 0; cntODCU < liODTemp[cntODT]['CHAR_UNI'].length; cntODCU++) {
                                        if (liODTemp[cntODT]['CHAR_UNI'][cntODCU]['CHAR_NUM'] === liSalesConfig[cntSC].CHAR_NUM) {
                                            liODTemp[cntODT]['CHAR_UNI'][cntODCU]['ORD_QTY'] = parseInt(liODTemp[cntODT]['CHAR_UNI'][cntODCU]['ORD_QTY']) + parseInt(liSalesConfig[cntSC].ORD_QTY);
                                        }
                                    }

                                    liODTemp[cntODT]['CHAR'][cntODTC]['CHAR_QTY'] = parseInt(liODTemp[cntODT]['CHAR'][cntODTC]['CHAR_QTY'])
                                        + parseInt(lSO['ORD_QTY']);
                                }
                            } else {
                                if (liSalesConfig[cntSC].CHARVAL_NUM !== liODTemp[cntODT]['CHAR'][cntODTC].CHARVAL_NUM) {
                                    lSO = {};
                                    lSO['SALES_DOC'] = GenF.parse(liSalesConfig[cntSC].SALES_DOC);
                                    lSO['SALESDOC_ITEM'] = GenF.parse(liSalesConfig[cntSC].SALESDOC_ITEM);
                                    lSO['ORD_QTY'] = GenF.parse(liSalesConfig[cntSC].ORD_QTY);
                                    liODTemp[cntODT]['CHAR'][cntODTC]['SO'].push(lSO);


                                    for (let cntODCU = 0; cntODCU < liODTemp[cntODT]['CHAR_UNI'].length; cntODCU++) {
                                        if (liODTemp[cntODT]['CHAR_UNI'][cntODCU]['CHAR_NUM'] === liSalesConfig[cntSC].CHAR_NUM) {
                                            liODTemp[cntODT]['CHAR_UNI'][cntODCU]['ORD_QTY'] = parseInt(liODTemp[cntODT]['CHAR_UNI'][cntODCU]['ORD_QTY']) + parseInt(liSalesConfig[cntSC].ORD_QTY);
                                        }
                                    }

                                    liODTemp[cntODT]['CHAR'][cntODTC]['CHAR_QTY'] = parseInt(liODTemp[cntODT]['CHAR'][cntODTC]['CHAR_QTY'])
                                        + parseInt(lSO['ORD_QTY']);
                                }
                            }
                        }

                    }
                }

                liODTemp[cntODT]['OD_QTY'] = 0;

                for (let cntSO = 0; cntSO < liSalesHead.length; cntSO++) {
                    let lSuccess = ''
                    for (let cntODTC = 0; cntODTC < liODTemp[cntODT]['CHAR'].length; cntODTC++) {
                        if (liODTemp[cntODT]['CHAR'][cntODTC].CHAR_COUNTER !== liODTemp[cntODT]['CHAR'][GenF.subOne(cntODTC, liODTemp[cntODT]['CHAR'].length)].CHAR_COUNTER
                            || cntODTC === 0) {
                                lSuccess = '';
                        }

                        for (let cntCSO = 0; cntCSO < liODTemp[cntODT]['CHAR'][cntODTC]['SO'].length; cntCSO++) {
                            if (liODTemp[cntODT]['CHAR'][cntODTC]['SO'][cntCSO]['SALES_DOC'] === liSalesHead[cntSO].SALES_DOC &&
                                liODTemp[cntODT]['CHAR'][cntODTC]['SO'][cntCSO]['SALESDOC_ITEM'] === liSalesHead[cntSO].SALESDOC_ITEM) {
                                lSuccess = 'X';
                                break;
                            }
                        }
                        if (lSuccess === '') {
                            if (liODTemp[cntODT]['CHAR'][cntODTC].CHAR_COUNTER !== liODTemp[cntODT]['CHAR'][GenF.addOne(cntODTC, liODTemp[cntODT]['CHAR'].length)].CHAR_COUNTER
                                || cntODTC === GenF.parse(cntODTC, liODTemp[cntODT]['CHAR'].length)) {
                                break;
                            }
                        }
                    }
                    if (lSuccess === 'X') {
                        liODTemp[cntODT]['OD_QTY'] = parseInt(liODTemp[cntODT]['OD_QTY']) + parseInt(liSalesHead[cntSO].ORD_QTY);
                    }
                }

                    let lsVCHistory = {};
                    lsVCHistory['PERIOD_NUM']       = GenF.parse(liSalesCount[i].WEEK_NO);
                    lsVCHistory['LOCATION_ID']      = GenF.parse(liSalesCount[i].LOCATION_ID);
                    lsVCHistory['PRODUCT_ID']       = GenF.parse(liSalesCount[i].PRODUCT_ID);
                    lsVCHistory['TYPE']             = 'OD';
                    lsVCHistory['GROUP_ID']         = GenF.parse(liODTemp[cntODT].OBJ_DEP + '_' + liODTemp[cntODT].OBJ_COUNTER);
                    lsVCHistory['GROUP_COUNT']      = GenF.parse(liODTemp[cntODT].OD_QTY);
                    lsVCHistory['GROUP_COUNT_RATE'] = (parseInt(liODTemp[cntODT].OD_QTY) / parseInt(liSalesCount[i].ORD_QTY) * 100).toFixed(2);

                    for (let cntODTC = 0; cntODTC < liODTemp[cntODT]['CHAR_UNI'].length; cntODTC++) {
                            lsVCHistory['ROW'] = liODTemp[cntODT]['CHAR_UNI'][cntODTC].ROW_ID;
                            lsVCHistory['ATTRIBUTE'] = 'att' + liODTemp[cntODT]['CHAR_UNI'][cntODTC].ROW_ID;
                            lsVCHistory['CHAR_COUNT'] = liODTemp[cntODT]['CHAR_UNI'][cntODTC]['ORD_QTY'];

                            lsVCHistory['CHAR_COUNT_RATE'] = (parseInt(lsVCHistory['CHAR_COUNT']) / parseInt(liSalesCount[i].ORD_QTY)  * 100).toFixed(2);

                            liVCHistory.push(GenF.parse(lsVCHistory));
                    }                    

            }

            if (liVCHistory.length > 0) {
                try {
                    cds.run({
                        INSERT:
                        {
                            into: { ref: ['CP_VC_HISTORY_TS'] },
                            entries: liVCHistory
                        }
                    });
                    Flag = 'S';
                }
                catch (error) {
                    console.log(error);
                }

            }

        }

        await GenF.logMessage(req, `Completed history timeseries`);
        if (Flag === 'S') {
            console.log("Success");
            await GenF.jobSchMessage('X', "Timeseries History generation is complete", req);
        }
        else {
            await GenF.jobSchMessage('', "Timeseries History generation failed", req);
        }

    }

    async genTimeseriesF(adata, req, Flag) {

        await GenF.logMessage(req, `Started future timeseries ${adata}`);

        // var conn = hana.createConnection(),
        //     stmt;

        // conn.connect(conn_params_container);
        // var sqlStr = "SET SCHEMA " + containerSchema;

        try {
            stmt = conn.prepare(sqlStr);
            result = stmt.exec();
            stmt.drop();
        } catch (error) {
            console.log("Error: " + error.message);
        }
        const lStartTime = new Date();
        console.log("Started timeseries Service");

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
        /*
                try {
                    var sqlStr =
                        `DELETE FROM CP_TS_OBJDEP_CHARHDR_F 
                         WHERE LOCATION_ID = '` + adata.LOCATION_ID + `' 
                           AND PRODUCT_ID = '` + adata.PRODUCT_ID + `'
                           AND OBJ_TYPE = 'OD'`
                    var stmt = conn.prepare(sqlStr);
                    await stmt.exec();
                    stmt.drop();
        
                } catch (error) {
                    console.log("Error: " + error.message);
                }
        */

        await DELETE.from('CP_TS_OBJDEP_CHARHDR_F')
            .where(`LOCATION_ID = '${adata.LOCATION_ID}'
                    AND PRODUCT_ID = '${adata.PRODUCT_ID}'
                    AND OBJ_TYPE = 'OD'`);

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
            console.log("Date: " + liFutureCharPlan[lFutInd].WEEK_DATE);

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

                        await cds.run({
                            INSERT: {
                                into: { ref: ['CP_TS_OBJDEP_CHARHDR_F'] },
                                values: [liObjdepF[index].CAL_DATE,
                                liObjdepF[index].LOCATION_ID,
                                liObjdepF[index].PRODUCT_ID,
                                liObjdepF[index].OBJ_TYPE,
                                liObjdepF[index].OBJ_DEP,
                                liObjdepF[index].OBJ_COUNTER,
                                liObjdepF[index].ROW_ID,
                                liObjdepF[index].VERSION,
                                liObjdepF[index].SCENARIO,
                                liObjdepF[index].SUCCESS,
                                liObjdepF[index].SUCCESS_RATE]
                            }
                        })
                        Flag = 'X';
                        /*
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
                        */
                        // await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF[index]));
                    }

                    //await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR_F").entries(liObjdepF));
                } catch (e) {
                    console.log("Error: " + e.message + "/" + e.query);
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
            console.log("Error: " + e.message + "/" + e.query);
        }
        console.log("Completed timeseries Service");

        var lProcessTime = Math.floor(
            Math.abs(lStartTime - new Date()) / 1000 / 60
        );
        console.log(
            "Processing time : " + lProcessTime + " Minutes"
        );

        await GenF.logMessage(req, `Completed future timeseries`);
        if (Flag === 'X') {
            console.log("Success");
            await GenF.jobSchMessage(Flag, `Timeseries Future generation is complete`, req);
        }
        else {
            await GenF.jobSchMessage(Flag, `Timeseries Future generation failed`, req);
        }
    }


}

module.exports = GenTimeseries;