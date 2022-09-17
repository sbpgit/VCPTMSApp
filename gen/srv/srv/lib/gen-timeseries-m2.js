const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");

class GenTimeseriesM2 {
    constructor() { }

    /**
     * Generate Timeseries
     */
    async genTimeseries(adata) {
        console.log("Method2 Timeseries started");
        let lMainProduct = '';
        let lsMainProduct = await SELECT.one
            .from('CP_PARTIALPROD_INTRO')
            .columns('REF_PRODID')
            .where(`PRODUCT_ID = '${adata.PRODUCT_ID}' AND LOCATION_ID = '${adata.LOCATION_ID}'`);

        if (lsMainProduct === null) {

            lMainProduct = GenF.parse(adata.PRODUCT_ID);

        }
        else {
            lMainProduct = lsMainProduct.REF_PRODID;
        }
        // Get Sales Count Information

        const liPrimaryID = await SELECT.from('V_UNIQUE_ID')
            .columns(["UNIQUE_ID",
                "PRODUCT_ID",
                "LOCATION_ID",
                "UNIQUE_DESC",
                "UID_TYPE",
                "ACTIVE",
                "CHAR_NUM",
                "CHARVAL_NUM"])
            .where(
                {
                    xpr: [
                        { ref: ["LOCATION_ID"] }, '=', { val: adata.LOCATION_ID }, 'and',
                        { ref: ["PRODUCT_ID"] }, '=', { val: lMainProduct }, 'and',
                        { ref: ["UID_TYPE"] }, '=', { val: 'P' }
                    ]
                }

            );
        // const liPrimaryID = await cds.run(`SELECT UNIQUE_ID,
        //                                 PRODUCT_ID,
        //                                 LOCATION_ID,
        //                                 UNIQUE_DESC,
        //                                 UID_TYPE,
        //                                 UID_RATE,
        //                                 ACTIVE,
        //                                 CHAR_NUM,
        //                                 CHARVAL_NUM
        //                             FROM V_UNIQUE_ID
        //                             where LOCATION_ID = '${adata.LOCATION_ID}'
        //                             AND PRODUCT_ID = '${lMainProduct}'
        //                             AND UID_TYPE = 'P'
        //                             AND ACTIVE = true`)
        // Get Sales Count Information
        const liPrimaryCount = await cds.run(
            `SELECT 
                A.PRODUCT_ID,
                CASE
                    WHEN WEEK("MAT_AVAILDATE") < 10 THEN CONCAT( YEAR("MAT_AVAILDATE"), CONCAT( '0', WEEK("MAT_AVAILDATE") ) )
                    ELSE CONCAT( YEAR("MAT_AVAILDATE"), WEEK("MAT_AVAILDATE") )
                END AS WEEK_NO,
                PRIMARY_ID,
                B.ORD_QTY AS TARGET_QTY,
                sum(A.ORD_QTY) AS ORD_QTY
            FROM 
                V_SALES_H AS A
            INNER JOIN
                V_ORD_COUNT AS B
            ON CASE
                    WHEN WEEK("MAT_AVAILDATE") < 10 THEN CONCAT( YEAR("MAT_AVAILDATE"), CONCAT( '0', WEEK("MAT_AVAILDATE") ) )
                    ELSE CONCAT( YEAR("MAT_AVAILDATE"), WEEK("MAT_AVAILDATE") )
                END = B.WEEK_NO
            AND A.LOCATION_ID = B.LOCATION_ID
            AND A.PRODUCT_ID  = B.PRODUCT_ID
            WHERE A.LOCATION_ID = '` + adata.LOCATION_ID + `'
              AND A.PRODUCT_ID = '` + adata.PRODUCT_ID + `'
            GROUP BY 
                A.LOCATION_ID,
                A.PRODUCT_ID,
                A.REF_PRODID,
                CASE
                    WHEN WEEK("MAT_AVAILDATE") < 10 THEN CONCAT( YEAR("MAT_AVAILDATE"), CONCAT( '0', WEEK("MAT_AVAILDATE") ) )
                    ELSE CONCAT( YEAR("MAT_AVAILDATE"), WEEK("MAT_AVAILDATE") )
                END,
                B.ORD_QTY,
                PRIMARY_ID
            ORDER BY 
                A.LOCATION_ID ASC, 
                A.REF_PRODID ASC, 
                WEEK_NO ASC,
                PRIMARY_ID ASC;`
        );



        let liPriCharCount = [];
        let lsPriCharCount = {};
        for (let i = 0; i < liPrimaryCount.length; i++) {
            for (let cntPI = 0; cntPI < liPrimaryID.length; cntPI++) {
                if (liPrimaryID[cntPI].UNIQUE_ID === liPrimaryCount[i].PRIMARY_ID) {
                    lsPriCharCount = {};
                    lsPriCharCount['WEEK_NO'] = GenF.parse(liPrimaryCount[i].WEEK_NO);
                    lsPriCharCount['CHAR_NUM'] = GenF.parse(liPrimaryID[cntPI].CHAR_NUM);
                    lsPriCharCount['CHARVAL_NUM'] = GenF.parse(liPrimaryID[cntPI].CHARVAL_NUM);
                    lsPriCharCount['ORD_QTY'] = parseInt(liPrimaryCount[i].ORD_QTY);

                    for (let cntPIC = 0; cntPIC < liPriCharCount.length; cntPIC++) {
                        if (liPriCharCount[cntPIC].WEEK_NO === lsPriCharCount['WEEK_NO'] &&
                            liPriCharCount[cntPIC].CHAR_NUM === lsPriCharCount['CHAR_NUM'] &&
                            liPriCharCount[cntPIC].CHARVAL_NUM === lsPriCharCount['CHARVAL_NUM']) {
                            liPriCharCount[cntPIC].ORD_QTY = parseInt(liPriCharCount[cntPIC].ORD_QTY) + parseInt(lsPriCharCount['ORD_QTY']);
                            lsPriCharCount['ORD_QTY'] = 0;
                        }
                    }

                    if (lsPriCharCount['ORD_QTY'] !== 0) {
                        liPriCharCount.push(lsPriCharCount);
                    }
                }
            }
        }

        let liVCHistory = [];
        let lsVCHistory = {};
        let lRow = 0;
        for (let i = 0; i < liPrimaryCount.length; i++) {

            lsVCHistory = {};

            lsVCHistory['PERIOD_NUM'] = GenF.parse(liPrimaryCount[i].WEEK_NO);
            lsVCHistory['LOCATION_ID'] = GenF.parse(adata.LOCATION_ID);
            lsVCHistory['PRODUCT_ID'] = GenF.parse(liPrimaryCount[i].PRODUCT_ID);
            lsVCHistory['TYPE'] = 'PI';

            lsVCHistory['GROUP_ID'] = GenF.parse(String(liPrimaryCount[i].PRIMARY_ID) + '_1');
            lsVCHistory['GROUP_COUNT'] = parseInt(liPrimaryCount[i].ORD_QTY);
            lsVCHistory['GROUP_COUNT_RATE'] = ((parseInt(liPrimaryCount[i].ORD_QTY) / parseInt(liPrimaryCount[i].TARGET_QTY)) * 100).toFixed(2);

            lRow = 0;
            for (let cntPI = 0; cntPI < liPrimaryID.length; cntPI++) {
                if (liPrimaryID[cntPI].UNIQUE_ID === liPrimaryCount[i].PRIMARY_ID) {
                    lRow = parseInt(lRow) + 1;
                    lsVCHistory['ROW'] = GenF.parse(lRow);
                    lsVCHistory['ATTRIBUTE'] = GenF.parse('att' + lRow);

                    for (let cntPIC = 0; cntPIC < liPriCharCount.length; cntPIC++) {
                        if (liPriCharCount[cntPIC].WEEK_NO === lsVCHistory['PERIOD_NUM'] &&
                            liPriCharCount[cntPIC].CHAR_NUM === liPrimaryID[cntPI]['CHAR_NUM'] &&
                            liPriCharCount[cntPIC].CHARVAL_NUM === liPrimaryID[cntPI]['CHARVAL_NUM']) {
                            lsVCHistory['CHAR_COUNT'] = parseInt(liPriCharCount[cntPIC].ORD_QTY);
                            break;
                        }
                    }

                    lsVCHistory['CHAR_COUNT_RATE'] = ((parseInt(lsVCHistory['CHAR_COUNT']) / parseInt(liPrimaryCount[i].TARGET_QTY)) * 100).toFixed(2);
                    liVCHistory.push(GenF.parse(lsVCHistory));

                }
            }

            if (i === GenF.addOne(i, liPrimaryCount.length) || liPrimaryCount[i].WEEK_NO !== liPrimaryCount[GenF.addOne(i, liPrimaryCount.length)].WEEK_NO) {
                if (liVCHistory.length > 0) {

                    try {
                        await DELETE.from('CP_VC_HISTORY_TS')
                            .where(`LOCATION_ID = '${adata.LOCATION_ID}' 
                        AND PRODUCT_ID = '${liPrimaryCount[i].PRODUCT_ID}'
                        AND PERIOD_NUM = '${liPrimaryCount[i].WEEK_NO}'
                        AND TYPE       = 'PI'`)
                    }
                    catch (e) {
                        console.log(e);
                    }
                    try {
                        await INSERT(liVCHistory).into('CP_VC_HISTORY_TS');
                        // await cds.run(INSERT.into("CP_VC_HISTORY_TS").entries(liVCHistory));
                    }
                    catch (er) {
                        console.log(er);
                    }
                    liVCHistory = [];

                }
            }


        }

        console.log("Completed Method 2 Timeseries");

        // await this.genPrediction(adata);
    }

    async genTimeseriesF(adata) {
        /** Get Future Plan */
        const liFutureCharPlan = await cds.run(
            `SELECT *
            FROM "CP_IBP_FCHARPLAN"
            WHERE "LOCATION_ID" = '` + adata.LOCATION_ID + `'
            AND "PRODUCT_ID" = '` + adata.PRODUCT_ID + `'
            ORDER BY LOCATION_ID, 
                    PRODUCT_ID, 
                    VERSION,
                    SCENARIO,
                    WEEK_DATE`
        );
        
        // console.log();
        await DELETE.from('CP_TS_OBJDEP_CHARHDR_F')
            .where(`LOCATION_ID = '${adata.LOCATION_ID}' 
                            AND PRODUCT_ID = '${adata.PRODUCT_ID}'
                            AND OBJ_TYPE = 'PI'`);
        let lMainProduct = '';
        let lsMainProduct = await SELECT.one
            .from('CP_PARTIALPROD_INTRO')
            .columns('REF_PRODID')
            .where(`PRODUCT_ID = '${adata.PRODUCT_ID}' AND LOCATION_ID = '${adata.LOCATION_ID}'`);

        if (lsMainProduct === null) {
            lMainProduct = GenF.parse(adata.PRODUCT_ID);
        }
        else {
            lMainProduct = lsMainProduct.REF_PRODID;
        }
        console.log("Main prod:"+ lMainProduct);
        // Get Sales Count Information
        const liPrimaryID = await SELECT.from('V_UNIQUE_ID')
            .columns(["UNIQUE_ID",
                "PRODUCT_ID",
                "LOCATION_ID",
                "UNIQUE_DESC",
                "UID_TYPE",
                "ACTIVE",
                "CHAR_NUM",
                "CHARVAL_NUM"])
            .where(
                {
                    xpr: [
                        { ref: ["LOCATION_ID"] }, '=', { val: adata.LOCATION_ID }, 'and',
                        { ref: ["PRODUCT_ID"] }, '=', { val: lMainProduct }, 'and',
                        { ref: ["UID_TYPE"] }, '=', { val: 'P' }
                    ]
                }

            ).
            orderBy("UNIQUE_ID", "CHAR_NUM");
        console.log("Primary ID:"+ liPrimaryID.length);
        let liObjdepF = [];
        let lsFutureDemand = {};
        for (let cntFC = 0; cntFC < liFutureCharPlan.length; cntFC++) {

            if (liFutureCharPlan[cntFC].LOCATION_ID !== liFutureCharPlan[GenF.subOne(cntFC, liFutureCharPlan.length)].LOCATION_ID ||
                liFutureCharPlan[cntFC].PRODUCT_ID !== liFutureCharPlan[GenF.subOne(cntFC, liFutureCharPlan.length)].PRODUCT_ID ||
                liFutureCharPlan[cntFC].VERSION !== liFutureCharPlan[GenF.subOne(cntFC, liFutureCharPlan.length)].VERSION ||
                liFutureCharPlan[cntFC].SCENARIO !== liFutureCharPlan[GenF.subOne(cntFC, liFutureCharPlan.length)].SCENARIO ||
                liFutureCharPlan[cntFC].WEEK_DATE !== liFutureCharPlan[GenF.subOne(cntFC, liFutureCharPlan.length)].WEEK_DATE ||
                cntFC === 0) {
                lsFutureDemand = await SELECT.one
                    .from('CP_IBP_FUTUREDEMAND')
                    .where(`LOCATION_ID = '${liFutureCharPlan[cntFC].LOCATION_ID}'
                                                AND PRODUCT_ID = '${liFutureCharPlan[cntFC].PRODUCT_ID}'
                                                AND VERSION = '${liFutureCharPlan[cntFC].VERSION}'
                                                AND SCENARIO = '${liFutureCharPlan[cntFC].SCENARIO}'
                                                AND WEEK_DATE = '${liFutureCharPlan[cntFC].WEEK_DATE}'`);

                liObjdepF = [];
            }

            let lRowID = 0;
            for (let cntPI = 0; cntPI < liPrimaryID.length; cntPI++) {
                if (liPrimaryID[cntPI].UNIQUE_ID !== liPrimaryID[GenF.subOne(cntPI, liPrimaryID.length)].UNIQUE_ID ||
                    liPrimaryID[cntPI].LOCATION_ID !== liPrimaryID[GenF.subOne(cntPI, liPrimaryID.length)].LOCATION_ID ||
                    liPrimaryID[cntPI].PRODUCT_ID !== liPrimaryID[GenF.subOne(cntPI, liPrimaryID.length)].PRODUCT_ID ||
                    cntPI === 0
                ) {
                    lRowID = 0;
                }
                lRowID = parseInt(lRowID) + 1
                if (liPrimaryID[cntPI].CHAR_NUM === liFutureCharPlan[cntFC].CHAR_NUM &&
                    liPrimaryID[cntPI].CHARVAL_NUM === liFutureCharPlan[cntFC].CHARVAL_NUM) {
                    let lsObjdepF = {}
                    lsObjdepF.CAL_DATE = GenF.parse(liFutureCharPlan[cntFC].WEEK_DATE);
                    lsObjdepF.LOCATION_ID = GenF.parse(liFutureCharPlan[cntFC].LOCATION_ID);
                    lsObjdepF.PRODUCT_ID = GenF.parse(liFutureCharPlan[cntFC].PRODUCT_ID);
                    lsObjdepF.VERSION = GenF.parse(liFutureCharPlan[cntFC].VERSION);
                    lsObjdepF.SCENARIO = GenF.parse(liFutureCharPlan[cntFC].SCENARIO);
                    lsObjdepF.OBJ_TYPE = "PI";
                    lsObjdepF.OBJ_DEP = GenF.parse(String(liPrimaryID[cntPI].UNIQUE_ID));
                    lsObjdepF.OBJ_COUNTER = 1;
                    lsObjdepF.ROW_ID = GenF.parse(lRowID);
                    lsObjdepF.SUCCESS = parseInt(liFutureCharPlan[cntFC].OPT_QTY);
                    
                    lsObjdepF.SUCCESS_RATE = 0
                    if(lsFutureDemand.QUANTITY > 0){
                    lsObjdepF.SUCCESS_RATE = (parseInt(liFutureCharPlan[cntFC].OPT_QTY) * 100 / parseInt(lsFutureDemand.QUANTITY)).toFixed(2);
                    }
                    liObjdepF.push(GenF.parse(lsObjdepF));
                }
            }

            if (liFutureCharPlan[cntFC].LOCATION_ID !== liFutureCharPlan[GenF.addOne(cntFC, liFutureCharPlan.length)].LOCATION_ID ||
                liFutureCharPlan[cntFC].PRODUCT_ID !== liFutureCharPlan[GenF.addOne(cntFC, liFutureCharPlan.length)].PRODUCT_ID ||
                liFutureCharPlan[cntFC].VERSION !== liFutureCharPlan[GenF.addOne(cntFC, liFutureCharPlan.length)].VERSION ||
                liFutureCharPlan[cntFC].SCENARIO !== liFutureCharPlan[GenF.addOne(cntFC, liFutureCharPlan.length)].SCENARIO ||
                liFutureCharPlan[cntFC].WEEK_DATE !== liFutureCharPlan[GenF.addOne(cntFC, liFutureCharPlan.length)].WEEK_DATE ||
                cntFC === GenF.addOne(cntFC, liFutureCharPlan.length)) {
                if (liObjdepF.length > 0) {
                    console.log("CP_TS_OBJDEP_CHARHDR_F: "+ liObjdepF.length);
                    try{
                    await INSERT(liObjdepF).into('CP_TS_OBJDEP_CHARHDR_F');
                    }
                    catch(e){
                        console.log("error");
                    }
                }
            }
        }
    }

    async genPrediction(adata) {

        const lDate = new Date();
        const lStartDate = new Date(
            lDate.getFullYear(),
            lDate.getMonth(),
            lDate.getDate() + parseInt(await GenF.getParameterValue(1))
        );        

        let liPrediction = [];
        liPrediction = await SELECT.from('CP_TS_PREDICTIONS')
                                         .where(`CAL_DATE    > '${lStartDate.toISOString().split("T")[0]}'
                                             AND LOCATION_ID = '${adata.LOCATION_ID}' 
                                             AND PRODUCT_ID  = '${adata.PRODUCT_ID}' 
                                             AND OBJ_TYPE    = 'PI'`);

        const liNormalize = await cds.run(`SELECT   A."VERSION",
                                                    A."SCENARIO",
                                                    A."WEEK_DATE",
                                                    B.MODEL_VERSION,
                                                    CASE
                                                    WHEN SUM(B.PREDICTED) > 0 THEN
                                                    A.QUANTITY/SUM(B.PREDICTED)
                                                    ELSE
                                                    1
                                                    END AS FACTOR
                                                FROM 
                                                    "CP_IBP_FUTUREDEMAND" AS A
                                                    INNER JOIN
                                                    CP_TS_PREDICTIONS AS B
                                                    ON A.LOCATION_ID = B.LOCATION_ID
                                                        AND A.PRODUCT_ID = B.PRODUCT_ID
                                                        AND A.VERSION = B.VERSION
                                                        AND A.SCENARIO = B.SCENARIO
                                                        AND a.WEEK_DATE = B.CAL_DATE
                                                WHERE A.LOCATION_ID = '${adata.LOCATION_ID}'
                                                    AND A.PRODUCT_ID = '${adata.PRODUCT_ID}'
                                                GROUP BY 
                                                    A."VERSION",
                                                    A."SCENARIO",
                                                    A."WEEK_DATE",
                                                    A."QUANTITY",
                                                    B.MODEL_VERSION
                                                ORDER BY WEEK_DATE ASC;`);
        
        for (let cntPre = 0; cntPre < liPrediction.length; cntPre++) {
            for (let cntNor = 0; cntNor < liNormalize.length; cntNor++) {
                if(liPrediction[cntPre].VERSION === liNormalize[cntNor].VERSION &&
                    liPrediction[cntPre].SCENARIO === liNormalize[cntNor].SCENARIO &&
                    liPrediction[cntPre].CAL_DATE === liNormalize[cntNor].WEEK_DATE &&
                    liPrediction[cntPre].MODEL_VERSION === liNormalize[cntNor].MODEL_VERSION ) 
                    {
                        let lConverted = liPrediction[cntPre].PREDICTED * liNormalize[cntNor].FACTOR;
                        liPrediction[cntPre].PREDICTED = GenF.parse(lConverted);
                        break;
                    }
            }
        }
        

        let liPriQty = [];
        liPriQty = await cds.run(
            `SELECT PRIMARY_ID,
                    SUM(ORD_QTY) AS ORD_QTY
                FROM "V_SALES_H"
                WHERE LOCATION_ID   = '${adata.LOCATION_ID}'
                AND PRODUCT_ID    = '${adata.PRODUCT_ID}'                
                group by PRIMARY_ID
                order by PRIMARY_ID`
        );

        let liUniQty = [];
        liUniQty = await cds.run(
            `SELECT UNIQUE_ID,
                        PRIMARY_ID,
                        SUM(ORD_QTY) AS ORD_QTY
                FROM V_SALES_H
                WHERE LOCATION_ID   = '${adata.LOCATION_ID}'
                AND PRODUCT_ID    = '${adata.PRODUCT_ID}'                
                group by UNIQUE_ID, PRIMARY_ID
                order by PRIMARY_ID, UNIQUE_ID`
        );

        await DELETE.from('CP_CIR_GENERATED')
            .where(`LOCATION_ID   = '${adata.LOCATION_ID}'
                         AND PRODUCT_ID    = '${adata.PRODUCT_ID}'`);

        let liCir = [];
        let lCir = 0;
        let lPIQty = 0;
        for (let cntUID = 0; cntUID < liUniQty.length; cntUID++) {

            lPIQty = 0;
            for (let cntPI = 0; cntPI < liPriQty.length; cntPI++) {
                if (liPriQty[cntPI].PRIMARY_ID === liUniQty[cntUID].PRIMARY_ID) {
                    lPIQty = liPriQty[cntPI].ORD_QTY;
                    break;
                }
            }

            for (let cntP = 0; cntP < liPrediction.length; cntP++) {
                if (parseInt(liPrediction[cntP].OBJ_DEP) === liUniQty[cntUID].PRIMARY_ID) {
                    let lsCir = {};
                    lCir = parseInt(lCir) + 1;
                    lsCir['LOCATION_ID'] = GenF.parse(adata.LOCATION_ID);
                    lsCir['PRODUCT_ID'] = GenF.parse(adata.PRODUCT_ID);
                    lsCir['WEEK_DATE'] = GenF.parse(liPrediction[cntP]['CAL_DATE']);
                    lsCir['CIR_ID'] = GenF.parse(lCir);
                    lsCir['METHOD'] = '1';
                    lsCir['MODEL_VERSION'] = GenF.parse(liPrediction[cntP]['MODEL_VERSION']);
                    lsCir['VERSION'] = GenF.parse(liPrediction[cntP]['VERSION']);
                    lsCir['SCENARIO'] = GenF.parse(liPrediction[cntP]['SCENARIO']);
                    lsCir['UNIQUE_ID'] = GenF.parse(liUniQty[cntUID].UNIQUE_ID);
                    if (lPIQty > 0) {
                        lsCir['CIR_QTY'] = GenF.parse(parseInt(liUniQty[cntUID].ORD_QTY * liPrediction[cntP].PREDICTED / lPIQty));
                    }
                    liCir.push(lsCir);
                }
            }
            if (liCir.length > 0) {
                await INSERT(liCir).into('CP_CIR_GENERATED');
            }
            liCir = [];
        }


        console.log("CIR generation Completed");

    }

    async createAssemblyReq(adata) {

    }

}

module.exports = GenTimeseriesM2;
