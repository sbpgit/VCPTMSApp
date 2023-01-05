const request = require('request');
const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const Catservicefn = require("./catservice-function");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

class SOFunctions {
    /**
     * Constructor
     */
    constructor() { }

    /**
     * Generate Unique ID
     * @param {Data} adata 
     */
    async genUniqueID(adata, req, Flag) {

        await GenF.logMessage(req, 'Started Sales Orders Processing');
        // await this.clearSalesH();
        await this.processUniqueID(adata.LOCATION_ID, adata.PRODUCT_ID, '');
        await this.genBaseMarketAuth(adata.LOCATION_ID, adata.PRODUCT_ID);
        await this.genPartialProd(adata.LOCATION_ID);
        // await this.genFactoryLoc();
        await this.saveClusterData(adata.LOCATION_ID, adata.PRODUCT_ID);
        await this.genClusterResults(adata.LOCATION_ID, adata.PRODUCT_ID);
        //await GenF.logMessage(req, 'Completed Sales Orders Processing');
        let lMessage = "Completed Sales Orders Processing";
        await GenF.jobSchMessage('X', lMessage, req);
        // Flag = 'X';

    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async processUniqueID(lLocation, lProduct, lSO) {

        const liSalesh = await this.getSalesHistory(lLocation, lProduct, lSO);
        const liUniqueData = await this.getUnique(lLocation, lProduct);


        let liSOHM = [];
        let lsSOHM = {};
        let liUnique = [];
        let lsUnique = {};

        console.log("Order Count: " + liSalesh.length);

        // Determine Unique ID
        for (let cntSO = 0; cntSO < liSalesh.length; cntSO++) {

            lsSOHM = {};
            lsSOHM['SALES_DOC'] = GenF.parse(liSalesh[cntSO].SALES_DOC);
            lsSOHM['SALESDOC_ITEM'] = GenF.parse(liSalesh[cntSO].SALESDOC_ITEM);
            lsSOHM['PRODUCT_ID'] = GenF.parse(lProduct);
            lsSOHM['LOCATION_ID'] = GenF.parse(lLocation);
            lsSOHM['UNIQUE_ID'] = 0;
            lsSOHM['PRIMARY_ID'] = 0;
            lsSOHM['CONFIG'] = GenF.parse(liSalesh[cntSO].CONFIG);
            lsSOHM['PCONFIG'] = GenF.parse(liSalesh[cntSO].PCONFIG);

            // Check if Unique ID already exists                    
            for (let cntUID = 0; cntUID < liUniqueData.length; cntUID++) {
                if (JSON.stringify(liSalesh[cntSO].CONFIG) === JSON.stringify(liUniqueData[cntUID]['CONFIG'])) {
                    lsSOHM['UNIQUE_ID'] = GenF.parse(liUniqueData[cntUID].UNIQUE_ID);
                }
                if (JSON.stringify(liSalesh[cntSO].PCONFIG) === JSON.stringify(liUniqueData[cntUID]['CONFIG'])) {
                    lsSOHM['PRIMARY_ID'] = GenF.parse(liUniqueData[cntUID].UNIQUE_ID);
                }
            }

            lsUnique = {};
            lsUnique['CONFIG'] = [];

            if (lsSOHM['UNIQUE_ID'] === 0) {
                lsUnique['CONFIG'] = liSalesh[cntSO].CONFIG;
                lsUnique['UID_TYPE'] = 'U';
                // If Unique ID is already planned to be created, do not add again
                for (let cntU = 0; cntU < liUnique.length; cntU++) {
                    if (JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUnique[cntU].CONFIG)) {
                        lsUnique['CONFIG'] = []
                    }
                }
            }
            if (lsUnique['CONFIG'].length > 0) {
                liUnique.push(lsUnique);
            }

            lsUnique = {};
            lsUnique['CONFIG'] = [];

            if (lsSOHM['PRIMARY_ID'] === 0) {
                lsUnique['CONFIG'] = liSalesh[cntSO].PCONFIG;
                lsUnique['UID_TYPE'] = 'P';
                // If Unique ID is already planned to be created, do not add again
                for (let cntU = 0; cntU < liUnique.length; cntU++) {
                    if (JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUnique[cntU].CONFIG)) {
                        lsUnique['CONFIG'] = []
                    }
                }
            }

            if (lsUnique['CONFIG'].length > 0) {
                liUnique.push(lsUnique);
            }

            liSOHM.push(lsSOHM);

        }

        let lCntVariantID = 0;

        for (let cntU = 0; cntU < liUnique.length; cntU++) {
            if (liUnique[cntU]['CONFIG'].length > 0) {

                const lsUniqueInd = await SELECT.one.columns("MAX(UNIQUE_ID) + 1 AS MAX_ID")
                    .from('CP_UNIQUE_ID_HEADER');
                if (lsUniqueInd.MAX_ID === null) {
                    lCntVariantID = 1;
                } else {
                    lCntVariantID = parseInt(lsUniqueInd.MAX_ID);
                }

                liUnique[cntU]['UNIQUE_ID'] = lCntVariantID;

                console.log("Unique ID Index: " + lCntVariantID);

                await cds.run({
                    INSERT:
                    {
                        into: { ref: ['CP_UNIQUE_ID_HEADER'] },
                        values: [liUnique[cntU].UNIQUE_ID, lLocation, lProduct, liUnique[cntU].UNIQUE_ID, liUnique[cntU].UID_TYPE, 0, true]
                    }
                })


                // Update Sales Orders with Unique ID
                for (let cntSO = 0; cntSO < liSOHM.length; cntSO++) {
                    if (liSOHM[cntSO].UNIQUE_ID === 0 &&
                        JSON.stringify(liSOHM[cntSO].CONFIG) === JSON.stringify(liUnique[cntU]['CONFIG'])) {
                        liSOHM[cntSO].UNIQUE_ID = liUnique[cntU].UNIQUE_ID;
                    }
                    if (liSOHM[cntSO].PRIMARY_ID === 0 &&
                        JSON.stringify(liSOHM[cntSO].PCONFIG) === JSON.stringify(liUnique[cntU]['CONFIG'])) {
                        liSOHM[cntSO].PRIMARY_ID = liUnique[cntU].UNIQUE_ID;
                    }
                }

                let liChar = [];
                let lsChar = {};
                for (let cntUC = 0; cntUC < liUnique[cntU]['CONFIG'].length; cntUC++) {
                    lsChar = {};
                    lsChar['UNIQUE_ID'] = GenF.parse(liUnique[cntU].UNIQUE_ID);
                    lsChar['LOCATION_ID'] = GenF.parse(lLocation);
                    lsChar['PRODUCT_ID'] = GenF.parse(lProduct);
                    lsChar['CHAR_NUM'] = GenF.parse(liUnique[cntU]['CONFIG'][cntUC].CHAR_NUM);
                    lsChar['CHARVAL_NUM'] = GenF.parse(liUnique[cntU]['CONFIG'][cntUC].CHARVAL_NUM);
                    lsChar['UID_CHAR_RATE'] = 0
                    liChar.push(lsChar);

                }

                await cds.run({
                    INSERT:
                    {
                        into: { ref: ['CP_UNIQUE_ID_ITEM'] },
                        entries: liChar
                    }
                })

            }
        }

        console.log("Sales Order Count: " + liSOHM.length);

        const liPartialProd = await cds.run(
            `SELECT *
                FROM V_PARTIALPRODCHAR
                WHERE REF_PRODID    = '${lProduct}'
                  AND LOCATION_ID   = '${lLocation}'
                ORDER BY LOCATION_ID,
                         PRODUCT_ID,
                         CLASS_NUM,
                         CHAR_NUM`
        );

        let liSalesUpdate = [];
        let lsSalesUpdate = {};

        // Process through sales Order
        for (let cntSO = 0; cntSO < liSOHM.length; cntSO++) {
            let lIgnoreProduct = '';

            // Process through Partial Product
            for (let cntPC = 0; cntPC < liPartialProd.length; cntPC++) {

                // Rest for every change in Partial Product
                if (cntPC === 0 ||
                    liPartialProd[cntPC].LOCATION_ID !== liPartialProd[GenF.subOne(cntPC, liPartialProd.length)].LOCATION_ID ||
                    liPartialProd[cntPC].PRODUCT_ID !== liPartialProd[GenF.subOne(cntPC, liPartialProd.length)].PRODUCT_ID) {
                    lIgnoreProduct = '';
                }

                // Check if Partial product configuration matches with Sales Order Configuration
                let lSuccess = '';
                for (let cntSOC = 0; cntSOC < liSOHM[cntSO].CONFIG.length; cntSOC++) {
                    // if (liSOHM[cntSO].CONFIG[cntSOC].CHAR_NUM === liPartialProd[cntPC].CHAR_NUM &&
                    //     liSOHM[cntSO].CONFIG[cntSOC].CHARVAL_NUM === liPartialProd[cntPC].CHARVAL_NUM) {
                    //     lSuccess = 'X';
                    //     break;
                    // }

                    if (liSOHM[cntSO].CONFIG[cntSOC].CHAR_NUM === liPartialProd[cntPC].CHAR_NUM &&
                        liSOHM[cntSO].CONFIG[cntSOC].CHARVAL_NUM === liPartialProd[cntPC].CHARVAL_NUM) {
                        lSuccess = 'X';
                        break;
                    }


                }
                if (lSuccess === '') {
                    // Ignore this partial product as configuration of sales order is not matched
                    lIgnoreProduct = GenF.parse(liPartialProd[cntPC].PRODUCT_ID);
                }

                // For every change in Partial product
                if (cntPC === GenF.addOne(cntPC, liPartialProd.length) ||
                    liPartialProd[cntPC].LOCATION_ID !== liPartialProd[GenF.addOne(cntPC, liPartialProd.length)].LOCATION_ID ||
                    liPartialProd[cntPC].PRODUCT_ID !== liPartialProd[GenF.addOne(cntPC, liPartialProd.length)].PRODUCT_ID) {
                    if (liPartialProd[cntPC].PRODUCT_ID !== lIgnoreProduct) {
                        liSOHM[cntSO].PRODUCT_ID = GenF.parse(liPartialProd[cntPC].PRODUCT_ID);
                        break;
                    }
                }
            }

            await cds.run(
                `DELETE FROM CP_SALES_HM
                WHERE SALES_DOC   = '` + liSOHM[cntSO].SALES_DOC + `'
                    AND SALESDOC_ITEM    = '` + liSOHM[cntSO].SALESDOC_ITEM + `'`
            );

            lsSalesUpdate = {};
            lsSalesUpdate['SALES_DOC'] = GenF.parse(liSOHM[cntSO].SALES_DOC);
            lsSalesUpdate['SALESDOC_ITEM'] = GenF.parse(liSOHM[cntSO].SALESDOC_ITEM);
            lsSalesUpdate['PRODUCT_ID'] = GenF.parse(liSOHM[cntSO].PRODUCT_ID);
            lsSalesUpdate['LOCATION_ID'] = GenF.parse(liSOHM[cntSO].LOCATION_ID);
            lsSalesUpdate['UNIQUE_ID'] = GenF.parse(liSOHM[cntSO].UNIQUE_ID);
            lsSalesUpdate['PRIMARY_ID'] = GenF.parse(liSOHM[cntSO].PRIMARY_ID);
            liSalesUpdate.push(lsSalesUpdate);

        }

        if (liSalesUpdate.length > 0) {
            await INSERT(liSalesUpdate).into('CP_SALES_HM');
        }


        console.log("Process Completed");

        await this.updateUniqueRate(lLocation, lProduct);

        console.log("UID Rate Updated");

    }
    /**
     * Get Sales History
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async getSalesHistory(lLocation, lProduct, lSO) {

        let liSalesData = [];
        if (lSO === '') {
            liSalesData = await cds.run(
                `SELECT *
                    FROM CP_SALESH AS A
                    INNER JOIN CP_SALESH_CONFIG AS B
                        ON A.SALES_DOC = B.SALES_DOC
                        AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                      WHERE A.LOCATION_ID   = '${lLocation}'
                        AND B.PRODUCT_ID    = '${lProduct}'
                    ORDER BY A.SALES_DOC,
                            A.SALESDOC_ITEM,
                            B.CHAR_NUM`);
        } else {
            liSalesData = await cds.run(
                `SELECT *
                    FROM CP_SALESH AS A
                    INNER JOIN CP_SALESH_CONFIG AS B
                        ON A.SALES_DOC = B.SALES_DOC
                        AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                      WHERE A.LOCATION_ID = '${lLocation}'
                        AND B.PRODUCT_ID  = '${lProduct}'
                        AND A.SALES_DOC   = '${lSO}'
                    ORDER BY A.SALES_DOC,
                            A.SALESDOC_ITEM,
                            B.CHAR_NUM`);
        }


        let liPriChar = [];
        liPriChar = await cds.run(`SELECT "CHAR_NUM"
                                     FROM "CP_VARCHAR_PS"
                                    WHERE "PRODUCT_ID" = '` + lProduct + `'
                                      AND "LOCATION_ID" = '` + lLocation + `'
                                      AND "CHAR_TYPE" = 'P'`)
        let liSalesh = [];
        let lsSalesh = {};
        let lsSaleshConfig = {};

        for (let cntSO = 0; cntSO < liSalesData.length; cntSO++) {
            if (cntSO === 0 ||
                liSalesData[cntSO].SALES_DOC !== liSalesData[GenF.subOne(cntSO, liSalesData.length)].SALES_DOC ||
                liSalesData[cntSO].SALESDOC_ITEM !== liSalesData[GenF.subOne(cntSO, liSalesData.length)].SALESDOC_ITEM) {
                lsSalesh = {};
                lsSalesh['SALES_DOC'] = GenF.parse(liSalesData[cntSO].SALES_DOC);
                lsSalesh['SALESDOC_ITEM'] = GenF.parse(liSalesData[cntSO].SALESDOC_ITEM);
                lsSalesh['CONFIG'] = [];
                lsSalesh['PCONFIG'] = [];
            }

            lsSaleshConfig = {};
            lsSaleshConfig['CHAR_NUM'] = GenF.parse(liSalesData[cntSO].CHAR_NUM);
            lsSaleshConfig['CHARVAL_NUM'] = GenF.parse(liSalesData[cntSO].CHARVAL_NUM);
            lsSalesh['CONFIG'].push(lsSaleshConfig);

            for (let cntPC = 0; cntPC < liPriChar.length; cntPC++) {
                if (liSalesData[cntSO].CHAR_NUM === liPriChar[cntPC].CHAR_NUM) {
                    lsSaleshConfig = {};
                    lsSaleshConfig['CHAR_NUM'] = GenF.parse(liSalesData[cntSO].CHAR_NUM);
                    lsSaleshConfig['CHARVAL_NUM'] = GenF.parse(liSalesData[cntSO].CHARVAL_NUM);
                    lsSalesh['PCONFIG'].push(lsSaleshConfig);
                    break;
                }
            }

            if (cntSO === GenF.addOne(cntSO, liSalesData.length) ||
                liSalesData[cntSO].SALES_DOC !== liSalesData[GenF.addOne(cntSO, liSalesData.length)].SALES_DOC ||
                liSalesData[cntSO].SALESDOC_ITEM !== liSalesData[GenF.addOne(cntSO, liSalesData.length)].SALESDOC_ITEM) {
                liSalesh.push(lsSalesh);
            }
        }

        return liSalesh;
    }

    /**
     * Get Unique ID
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async getUnique(lLocation, lProduct) {

        const liUniqueGet = await cds.run(
            `SELECT "UNIQUE_ID",
                    "LOCATION_ID",
                    "PRODUCT_ID",
                    "CHAR_NUM",
                    "CHARVAL_NUM"
               FROM "V_UNIQUE_ID"
              WHERE LOCATION_ID = '` + lLocation + `'
                AND PRODUCT_ID  = '` + lProduct + `'
            ORDER BY UNIQUE_ID,
                     LOCATION_ID,
                     PRODUCT_ID,
                     CHAR_NUM,
                     CHARVAL_NUM`
        );

        let lsUniqueConfig = {};
        let lsUnique = {};
        let liUniqueData = [];

        for (let cntU = 0; cntU < liUniqueGet.length; cntU++) {
            if (cntU === 0 ||
                liUniqueGet[cntU].UNIQUE_ID !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].UNIQUE_ID ||
                liUniqueGet[cntU].LOCATION_ID !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].LOCATION_ID ||
                liUniqueGet[cntU].PRODUCT_ID !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].PRODUCT_ID) {
                lsUnique = {};
                lsUnique['UNIQUE_ID'] = GenF.parse(liUniqueGet[cntU].UNIQUE_ID);
                lsUnique['LOCATION_ID'] = GenF.parse(liUniqueGet[cntU].LOCATION_ID);
                lsUnique['PRODUCT_ID'] = GenF.parse(liUniqueGet[cntU].PRODUCT_ID);
                lsUnique['CONFIG'] = [];
            }
            lsUniqueConfig = {};
            lsUniqueConfig['CHAR_NUM'] = GenF.parse(liUniqueGet[cntU].CHAR_NUM);
            lsUniqueConfig['CHARVAL_NUM'] = GenF.parse(liUniqueGet[cntU].CHARVAL_NUM);
            lsUnique['CONFIG'].push(lsUniqueConfig);

            if (cntU === GenF.addOne(cntU, liUniqueGet.length) ||
                liUniqueGet[cntU].UNIQUE_ID !== liUniqueGet[GenF.addOne(cntU, liUniqueGet.length)].UNIQUE_ID ||
                liUniqueGet[cntU].LOCATION_ID !== liUniqueGet[GenF.addOne(cntU, liUniqueGet.length)].LOCATION_ID ||
                liUniqueGet[cntU].PRODUCT_ID !== liUniqueGet[GenF.addOne(cntU, liUniqueGet.length)].PRODUCT_ID) {
                liUniqueData.push(lsUnique);
            }
        }

        return liUniqueData;
    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async getPriUniqueID(lLocation, lProduct) {

        // Get Unique ID        
        let liUniqueData = [];
        liUniqueData = await cds.run(
            `SELECT *
               FROM V_UNIQUE_ID
              WHERE LOCATION_ID   = '` + lLocation + `'
                AND PRODUCT_ID    = '` + lProduct + `'
                AND UID_TYPE      = 'U'
                AND CHAR_NUM IN (SELECT "CHAR_NUM"
                                     FROM "CP_VARCHAR_PS"
                                    WHERE "PRODUCT_ID" = '` + lProduct + `'
                                      AND "LOCATION_ID" = '` + lLocation + `'
                                      AND "CHAR_TYPE" = 'P')
            ORDER BY UNIQUE_ID,
                     PRODUCT_ID,
                     LOCATION_ID, 
                     CHAR_NUM`
        );

        // Get Existing Primary ID        
        let liUniquePData = [];
        liUniquePData = await cds.run(
            `SELECT *
               FROM V_UNIQUE_ID
              WHERE LOCATION_ID   = '` + lLocation + `'
                AND PRODUCT_ID    = '` + lProduct + `'
                AND UID_TYPE      = 'P'
            ORDER BY UNIQUE_ID,
                     PRODUCT_ID,
                     LOCATION_ID, 
                     CHAR_NUM`
        );

        let liPriID = [];
        let lsPriID = {};
        let liUniPriID = [];
        for (let cntUIDP = 0; cntUIDP < liUniquePData.length; cntUIDP++) {

            lsPriID = {};
            lsPriID['CHAR_NUM'] = GenF.parse(liUniquePData[cntUIDP].CHAR_NUM);
            lsPriID['CHARVAL_NUM'] = GenF.parse(liUniquePData[cntUIDP].CHARVAL_NUM);
            liUniPriID.push(lsPriID);

            if (liUniquePData[cntUIDP].UNIQUE_ID !== liUniquePData[GenF.addOne(cntUIDP, liUniquePData.length)].UNIQUE_ID ||
                cntUIDP === GenF.addOne(cntUIDP, liUniquePData.length)) {
                liPriID.push(liUniPriID);
                liUniPriID = [];
            }

        }

        let liChar = [];
        let lsChar = {};
        let liCharFinal = [];
        for (let cntU = 0; cntU < liUniqueData.length; cntU++) {

            lsChar = {};
            lsChar['CHAR_NUM'] = liUniqueData[cntU].CHAR_NUM;
            lsChar['CHARVAL_NUM'] = liUniqueData[cntU].CHARVAL_NUM;
            liChar.push(lsChar);

            if (liUniqueData[cntU].UNIQUE_ID !== liUniqueData[GenF.addOne(cntU, liUniqueData.length)].UNIQUE_ID ||
                cntU === GenF.addOne(cntU, liUniqueData.length)) {

                // Check if Primary ID is already created                    
                for (let cntPID = 0; cntPID < liPriID.length; cntPID++) {
                    if (JSON.stringify(liChar) === JSON.stringify(liPriID[cntPID])) {
                        liChar = [];
                        break;
                    }
                }

                if (liChar.length > 0) {
                    // Check if Primary ID is already planned for creation
                    for (let cntUID = 0; cntUID < liCharFinal.length; cntUID++) {
                        if (JSON.stringify(liChar) === JSON.stringify(liCharFinal[cntUID])) {
                            liChar = [];
                            break;
                        }
                    }
                }

                if (liChar.length > 0) {
                    liCharFinal.push(liChar);
                }

                liChar = [];

            }

        }

        for (let cntU = 0; cntU < liCharFinal.length; cntU++) {
            if (liCharFinal[cntU].length > 0) {

                await this.createPrimaryID(lLocation, lProduct, liCharFinal[cntU]);

            }
        }

        this.logger.info("Process Completed");

    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async updateUniqueRate(lLocation, lProduct) {

        const liSalesProd = await SELECT.columns(`LOCATION_ID`,
            `PRODUCT_ID`,
            `sum(ORD_QTY) as ORD_QTY`)
            .from("V_SALES_H")
            .where(`LOCATION_ID = '${lLocation}'
                                        AND REF_PRODID = '${lProduct}'`)
            .groupBy("LOCATION_ID", "PRODUCT_ID")
            .orderBy("LOCATION_ID", "PRODUCT_ID");

        const liSalesUni = await SELECT.columns(`LOCATION_ID`,
            `PRODUCT_ID`,
            "UNIQUE_ID",
            `sum(ORD_QTY) as ORD_QTY`)
            .from("V_SALES_H")
            .where(`LOCATION_ID = '${lLocation}'
                                AND REF_PRODID = '${lProduct}'`)
            .groupBy("LOCATION_ID", "PRODUCT_ID", "UNIQUE_ID")
            .orderBy("LOCATION_ID", "PRODUCT_ID", "UNIQUE_ID");

        const liSalesChar = await cds.run(
            `SELECT 
                                    V_SALES_H.LOCATION_ID,
                                    V_SALES_H.PRODUCT_ID,
                                    CP_SALESH_CONFIG.CHAR_NUM,
                                    CP_SALESH_CONFIG.CHARVAL_NUM,
                                    sum(V_SALES_H."ORD_QTY") as ORD_QTY
                                FROM 
                                    V_SALES_H
                                    INNER JOIN
                                    CP_SALESH_CONFIG
                                    ON V_SALES_H."SALES_DOC" = CP_SALESH_CONFIG."SALES_DOC"
                                        AND V_SALES_H."SALESDOC_ITEM" = CP_SALESH_CONFIG."SALESDOC_ITEM"
                                WHERE V_SALES_H.LOCATION_ID = '${lLocation}'
                                    AND V_SALES_H.REF_PRODID = '${lProduct}'
                                GROUP BY 
                                    V_SALES_H.LOCATION_ID,
                                    V_SALES_H.PRODUCT_ID,
                                    CP_SALESH_CONFIG.CHAR_NUM,
                                    CP_SALESH_CONFIG.CHARVAL_NUM;`
        );

        for (let cntSP = 0; cntSP < liSalesProd.length; cntSP++) {
            for (let cntUID = 0; cntUID < liSalesUni.length; cntUID++) {
                if (liSalesUni[cntUID].LOCATION_ID === liSalesProd[cntSP].LOCATION_ID &&
                    liSalesUni[cntUID].PRODUCT_ID === liSalesProd[cntSP].PRODUCT_ID) {
                    if (liSalesProd[cntSP].ORD_QTY > 0) {
                        await UPDATE`CP_UNIQUE_ID_HEADER`
                            .with({
                                UID_RATE: ((liSalesUni[cntUID].ORD_QTY * 100 / liSalesProd[cntSP].ORD_QTY)).toFixed(2)
                            })
                            .where(`UNIQUE_ID = '${liSalesUni[cntUID].UNIQUE_ID}'
                                          AND LOCATION_ID = '${lLocation}'
                                          AND PRODUCT_ID = '${lProduct}'`)

                    }
                }
            }

            for (let cntUC = 0; cntUC < liSalesChar.length; cntUC++) {
                if (liSalesChar[cntUC].LOCATION_ID === liSalesProd[cntSP].LOCATION_ID &&
                    liSalesChar[cntUC].PRODUCT_ID === liSalesProd[cntSP].PRODUCT_ID) {
                    if (liSalesProd[cntSP].ORD_QTY > 0) {
                        await UPDATE`CP_UNIQUE_ID_ITEM`
                            .with({
                                UID_CHAR_RATE: (liSalesChar[cntUC].ORD_QTY * 100 / liSalesProd[cntSP].ORD_QTY).toFixed(2)
                            })
                            .where(`LOCATION_ID = '${lLocation}'
                                           AND PRODUCT_ID = '${lProduct}'
                                           AND CHAR_NUM = '${liSalesChar[cntUC].CHAR_NUM}'
                                           AND CHARVAL_NUM = '${liSalesChar[cntUC].CHARVAL_NUM}'`)
                    }
                }
            }
        }


    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     * @param {Sales ORder} lSO
     * @param {Date} lDate 
     * @param {Quantity} lQty 
     * @param {Unique ID} liUnique 
     */
    async createSO(lLocation, lProduct, lSO, lDate, lQty, lUnique) {

        const lSOItem = '000010';
        // Get Main Product        
        const lMainProd = await this.getMainProduct(lLocation, lProduct);

        await INSERT.into('CP_SALESH')
            .columns('SALES_DOC',
                'SALESDOC_ITEM',
                'PRODUCT_ID',
                'CONFIRMED_QTY',
                'ORD_QTY',
                'MAT_AVAILDATE',
                'LOCATION_ID')
            .values(lSO,
                lSOItem,
                lMainProd,
                lQty,
                lQty,
                lDate,
                lLocation);

        const liUnique = await SELECT.columns("CHAR_NUM",
            "CHARVAL_NUM")
            .from('V_UNIQUE_ID')
            .where(`UNIQUE_ID = '${lUnique}'`)

        for (let cntUI = 0; cntUI < liUnique.length; cntUI++) {
            await INSERT.into('CP_SALESH_CONFIG')
                .columns('SALES_DOC',
                    'SALESDOC_ITEM',
                    'CHAR_NUM',
                    'CHARVAL_NUM',
                    'PRODUCT_ID')
                .values(lSO,
                    lSOItem,
                    liUnique[cntUI].CHAR_NUM,
                    liUnique[cntUI].CHARVAL_NUM,
                    lProduct);
        }

        await this.processUniqueID(lLocation, lMainProd, lSO);

        // const lSPrimary = await this.processPrimaryID(lLocation, lMainProd, lUnique);


        // await INSERT.into('CP_SALES_HM')
        //     .values(lSO, lSOItem, lProduct, lLocation, lUnique, lSPrimary);
        // try {
        //     await INSERT.into('CP_SALES_HM').columns('SALES_DOC',
        //         'SALESDOC_ITEM',
        //         'PRODUCT_ID',
        //         'LOCATION_ID',
        //         'UNIQUE_ID',
        //         'PRIMARY_ID')
        //         .values(lSO,
        //             lSOItem,
        //             lProduct,
        //             lLocation,
        //             lUnique,
        //             lSPrimary);
        // }
        // catch (e) {
        //     console.log(e.message);
        // }
    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     * @param {Sales ORder} lSO
     * @param {Date} lDate 
     * @param {Quantity} lQty 
     * @param {Unique ID} liUnique 
     */
    async createSOTemp(lLocation, lProduct, lSO, lDate, lQty, lUnique) {

        const lSOItem = '000010';
        // Get Main Product        
        const lMainProd = await this.getMainProduct(lLocation, lProduct);

        // await INSERT.into('CP_SALESH')
        //     .columns('SALES_DOC',
        //         'SALESDOC_ITEM',
        //         'PRODUCT_ID',
        //         'CONFIRMED_QTY',
        //         'ORD_QTY',
        //         'MAT_AVAILDATE',
        //         'LOCATION_ID')
        //     .values(lSO,
        //         lSOItem,
        //         lMainProd,
        //         lQty,
        //         lQty,
        //         lDate,
        //         lLocation);

        const liUnique = await SELECT.columns("CHAR_NUM",
            "CHARVAL_NUM")
            .from('V_UNIQUE_ID')
            .where(`UNIQUE_ID = '${lUnique}'`)

        for (let cntUI = 0; cntUI < liUnique.length; cntUI++) {
            await INSERT.into('CP_SALESH_CONFIG')
                .columns('SALES_DOC',
                    'SALESDOC_ITEM',
                    'CHAR_NUM',
                    'CHARVAL_NUM',
                    'PRODUCT_ID')
                .values(lSO,
                    lSOItem,
                    liUnique[cntUI].CHAR_NUM,
                    liUnique[cntUI].CHARVAL_NUM,
                    lProduct);
        }

        await this.processUniqueID(lLocation, lMainProd, lSO);


    }
    /**
         * 
         * @param {Location} lLocation 
         * @param {Product} lProduct 
         * @param {Sales ORder} lSO 
         */
    async deleteSO(lLocation, lProduct, lSO) {

        try {
            await DELETE.from('CP_SALESH')
                .where(`LOCATION_ID = '${lLocation}' AND PRODUCT_ID = '${lProduct}' AND SALES_DOC = '${lSO}'`);
            await DELETE.from('CP_SALESH_CONFIG')
                .where(`PRODUCT_ID = '${lProduct}' AND SALES_DOC = '${lSO}'`);
            await DELETE.from('CP_SALES_HM')
                .where(`LOCATION_ID = '${lLocation}' AND PRODUCT_ID = '${lProduct}' AND SALES_DOC = '${lSO}'`);
        }
        catch (err) {
            console.log("Deletion failed");
        }

    }
    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async getMainProduct(lLocation, lProduct) {
        // Get Main Product        
        const lsSales = await SELECT.one
            .columns('REF_PRODID')
            .from('CP_PARTIALPROD_INTRO')
            .where(`LOCATION_ID = '${lLocation}'
            AND PRODUCT_ID = '${lProduct}'`);
        if (!lsSales) {
            return lProduct;
        }
        else {
            return lsSales.REF_PRODID;
        }
    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     * @param {Unique ID} lUnique 
     */
    async processPrimaryID(lLocation, lProduct, lUnique) {


        // const liUnique = await SELECT.columns('CHAR_NUM', 'CHARVAL_NUM')
        //     .from('CP_UNIQUE_ID_ITEM')
        //     .where(`UNIQUE_ID = '${lUnique}' 
        //                                  AND LOCATION_ID = '${lLocation}'
        //                                  AND PRODUCT_ID = '${lProduct}'
        //                                  AND CHAR_NUM IN (SELECT "CHAR_NUM"
        //                                                     FROM "CP_VARCHAR_PS"
        //                                                     WHERE "PRODUCT_ID" = '${lProduct}'
        //                                                     AND "LOCATION_ID" = '${lLocation}'
        //                                                      AND "CHAR_TYPE" = 'P')`)
        //     .orderBy('CHAR_NUM', 'CHARVAL_NUM');
        const liUnique = await cds.run(`SELECT CHAR_NUM,
                                            CHARVAL_NUM
                                        FROM CP_UNIQUE_ID_ITEM
                                        WHERE UNIQUE_ID = '${lUnique}'
                                        AND LOCATION_ID = '${lLocation}'
                                        AND PRODUCT_ID = '${lProduct}'
                                        AND CHAR_NUM IN (SELECT CHAR_NUM
                                                        FROM CP_VARCHAR_PS
                                                        WHERE PRODUCT_ID = '${lProduct}'
                                                        AND LOCATION_ID = '${lLocation}'
                                                        AND CHAR_TYPE = 'P')
                                        ORDER BY  CHAR_NUM,
                                            CHARVAL_NUM`)

        const liPrimary = await SELECT.columns('UNIQUE_ID', 'CHAR_NUM', 'CHARVAL_NUM')
            .from('V_UNIQUE_ID')
            .where(`LOCATION_ID = '${lLocation}'
                                            AND PRODUCT_ID  = '${lProduct}'
                                            AND UID_TYPE    = 'P'`);

        let lUICount = 0;
        let lFailPrimary = 0;
        let lSPrimary = 0;
        for (let cntPID = 0; cntPID < liPrimary.length; cntPID++) {
            if (cntPID === 0 ||
                liPrimary[cntPID].UNIQUE_ID !== liPrimary[GenF.subOne(cntPID, liPrimary.length)].UNIQUE_ID) {
                lUICount = 0;
            }

            if (liPrimary[cntPID].CHAR_NUM !== liUnique[lUICount].CHAR_NUM ||
                liPrimary[cntPID].CHARVAL_NUM !== liUnique[lUICount].CHARVAL_NUM) {
                lFailPrimary = GenF.parse(liPrimary[cntPID].UNIQUE_ID);
            }

            if (cntPID === GenF.addOne(cntPID, liPrimary.length) ||
                liPrimary[cntPID].UNIQUE_ID !== liPrimary[GenF.addOne(cntPID, liPrimary.length)].UNIQUE_ID) {
                if (lFailPrimary === 0) {
                    lSPrimary = GenF.parse(liPrimary[cntPID].UNIQUE_ID);
                    break;
                }
            }
        }

        if (lSPrimary === 0) {
            lSPrimary = await this.createPrimaryID(lLocation, lProduct, liUnique);
        }

        return lSPrimary;

    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     * @param {Char Array} liCharVal 
     */
    async createPrimaryID(lLocation, lProduct, liCharVal) {

        let lCntVariantID = 0;
        const lsUniqueInd = await SELECT.one.columns("MAX(UNIQUE_ID) + 1 AS MAX_ID")
            .from('CP_UNIQUE_ID_HEADER');

        if (lsUniqueInd.MAX_ID === null) {
            lCntVariantID = 1;
        } else {
            lCntVariantID = lsUniqueInd.MAX_ID;//parseInt(lsUniqueInd.MAX_ID);
        }

        // this.logger.info("Unique ID Index: " + lCntVariantID);
        console.log("Unique ID Index: " + lCntVariantID);

        await cds.run({
            INSERT:
            {
                into: { ref: ['CP_UNIQUE_ID_HEADER'] },
                values: [lCntVariantID, lLocation, lProduct, '', 'P', 0, true]
            }
        })

        let liChar = [];
        let lsChar = {};
        for (let cntUC = 0; cntUC < liCharVal.length; cntUC++) {
            lsChar = {};
            lsChar['UNIQUE_ID'] = GenF.parse(lCntVariantID);
            lsChar['LOCATION_ID'] = GenF.parse(lLocation);
            lsChar['PRODUCT_ID'] = GenF.parse(lProduct);
            lsChar['CHAR_NUM'] = GenF.parse(liCharVal[cntUC].CHAR_NUM);
            lsChar['CHARVAL_NUM'] = GenF.parse(liCharVal[cntUC].CHARVAL_NUM);
            liChar.push(lsChar);
        }

        await cds.run({
            INSERT:
            {
                into: { ref: ['CP_UNIQUE_ID_ITEM'] },
                entries: liChar
            }
        })

        return lCntVariantID;

    }
    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async genBaseMarketAuth(lLocation, lProduct) {
        console.log('Generate Market Authorization');

        let lWeeks = await GenF.getParameterValue(lLocation, 3);

        let lFirmnWeeks = await GenF.getParameterValue(lLocation, 9);

        let lDate = new Date();
        lDate = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() + (7 * lFirmnWeeks));
        let lDateD = lDate.toISOString().split('Z')[0].split('T')[0];
        lWeeks = lWeeks - lFirmnWeeks;
        let liSOrdQty = await cds.run(`SELECT LOCATION_ID,
                                             PRODUCT_ID,
                                             SUM("ORD_QTY") AS ORD_QTY
                                        FROM V_SALES_H
                                       WHERE LOCATION_ID = '${lLocation}'
                                         AND REF_PRODID = '${lProduct}'
                                       GROUP BY LOCATION_ID,
                                                PRODUCT_ID;`);
        for (let cntS = 0; cntS < liSOrdQty.length; cntS++) {
            await DELETE.from('CP_DEF_MKTAUTH')
                .where(`LOCATION_ID = '${lLocation}' AND PRODUCT_ID = '${liSOrdQty[cntS].PRODUCT_ID}'`);
            await DELETE.from('CP_MARKETAUTH_CFG')
                .where(`LOCATION_ID = '${lLocation}' AND PRODUCT_ID = '${liSOrdQty[cntS].PRODUCT_ID}' AND WEEK_DATE > '${lDateD}'`);

        }

        let liCharValQty = await cds.run(`SELECT V_SALES_H.LOCATION_ID,
                                                    V_SALES_H.PRODUCT_ID,
                                                    V_UNIQUE_ID.CHAR_NUM,
                                                    V_UNIQUE_ID.CHARVAL_NUM,
                                                    SUM("ORD_QTY") AS ORD_QTY
                                                FROM V_SALES_H
                                                JOIN V_UNIQUE_ID
                                                ON V_SALES_H.UNIQUE_ID = V_UNIQUE_ID.UNIQUE_ID
                                                WHERE V_SALES_H.LOCATION_ID = '${lLocation}' AND V_SALES_H.REF_PRODID = '${lProduct}'
                                            GROUP BY  V_SALES_H.LOCATION_ID,
                                                    V_SALES_H.PRODUCT_ID,
                                                    V_UNIQUE_ID.CHAR_NUM,
                                                    V_UNIQUE_ID.CHARVAL_NUM`);
        let lsDefMktAuth = {};
        let liDefMktAuth = [];
        let lOrdQty = 0;
        for (let cntCVq = 0; cntCVq < liCharValQty.length; cntCVq++) {
            lOrdQty = 0;
            for (let cntS = 0; cntS < liSOrdQty.length; cntS++) {
                if (liSOrdQty[cntS].LOCATION_ID === liCharValQty[cntCVq].LOCATION_ID &&
                    liSOrdQty[cntS].PRODUCT_ID === liCharValQty[cntCVq].PRODUCT_ID) {
                    lOrdQty = parseInt(liSOrdQty[cntS].ORD_QTY);
                    break;
                }
            }

            lsDefMktAuth = {};
            lsDefMktAuth['LOCATION_ID'] = GenF.parse(lLocation);
            lsDefMktAuth['PRODUCT_ID'] = GenF.parse(liCharValQty[cntCVq].PRODUCT_ID);
            lsDefMktAuth['CHAR_NUM'] = GenF.parse(liCharValQty[cntCVq].CHAR_NUM);
            lsDefMktAuth['CHARVAL_NUM'] = GenF.parse(liCharValQty[cntCVq].CHARVAL_NUM);
            if (lOrdQty > 0) {
                lsDefMktAuth['OPT_PERCENT'] = ((parseInt(liCharValQty[cntCVq].ORD_QTY) * 100) / lOrdQty).toFixed(2);
            } else {
                lsDefMktAuth['OPT_PERCENT'] = 0;
            }
            liDefMktAuth.push(GenF.parse(lsDefMktAuth));
        }
        if (liDefMktAuth) {
            try {
                await cds.run(INSERT.into("CP_DEF_MKTAUTH").entries(liDefMktAuth));
                // await INSERT.into('CP_DEF_MKTAUTH')
                //     .columns('LOCATION_ID',
                //         'PRODUCT_ID',
                //         'CHAR_NUM',
                //         'CHARVAL_NUM',
                //         'OPT_PERCENT')
                //     .entries(liDefMktAuth);


            }
            catch (error) {
                console.log(error);
            }

        }

        do {
            let lDateSQL = await GenF.getNextMondayCmp(lDate.toISOString().split('Z')[0].split('T')[0]);//(lDate.toISOString().split('T')[0]);
            // Loop through all the partial products                     
            for (let cntS = 0; cntS < liSOrdQty.length; cntS++) {
                // await cds.run(`INSERT INTO "CP_MARKETAUTH_CFG"  SELECT  '${lDateSQL}',
                //                                                         LOCATION_ID,
                //                                                         PRODUCT_ID,
                //                                                         CHAR_NUM,
                //                                                         CHARVAL_NUM,
                //                                                         OPT_PERCENT
                //                                                    FROM CP_DEF_MKTAUTH
                //                                                   WHERE LOCATION_ID = '${liSOrdQty[cntS].LOCATION_ID}'
                //                                                     AND PRODUCT_ID = '${liSOrdQty[cntS].PRODUCT_ID}'`);

                await cds.run(`INSERT INTO "CP_MARKETAUTH_CFG"  ( SELECT  '${lDateSQL}',
                                                                        A.LOCATION_ID,
                                                                        A.PRODUCT_ID,
                                                                        A.CHAR_NUM,
                                                                        A.CHARVAL_NUM,
                                                                        B.VERSION,
                                                                        B.SCENARIO,
                                                                        A.OPT_PERCENT
                                                                   FROM CP_DEF_MKTAUTH as A
                                                                   INNER JOIN V_IBPVERSCENARIO AS B
                                                                   ON A.LOCATION_ID = B.LOCATION_ID
                                                                   AND A.PRODUCT_ID =  B.PRODUCT_ID
                                                                  WHERE A.LOCATION_ID = '${liSOrdQty[cntS].LOCATION_ID}'
                                                                    AND A.PRODUCT_ID = '${liSOrdQty[cntS].PRODUCT_ID}')`);

            }
            lWeeks = parseInt(lWeeks) - 1;
            lDate = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() + 7);
        }
        while (lWeeks > 0);


    }
    /**
     * 
     * @param {Location} lLocation 
     */
    async genPartialProd(lLocation) {
        const liProd = await cds.run(`
                                SELECT DISTINCT * 
                                FROM V_LOCPROD
                                WHERE LOCATION_ID   = '${lLocation}'
                `);
        const liPartProd = await cds.run(`
                                SELECT "PRODUCT_ID",
                                        "LOCATION_ID",
                                        "REF_PRODID" 
                                  FROM CP_PARTIALPROD_INTRO 
                                  WHERE LOCATION_ID   = '${lLocation}' 
        `);

        const liProdCfg = await SELECT.columns(
            "PRODUCT_ID",
            "CLASS_NUM",
            "CHAR_NUM",
            "CHARVAL_NUM")
            .from('V_PRODCLSCHARVAL');

        let liPartialProd = [];
        let lsProd = {}, vFlag = '';
        let liPartialProdChar = [];
        let lsProdCh = {};
        for (let cntPD = 0; cntPD < liProd.length; cntPD++) {
            vFlag = '';
            for (let i = 0; i < liPartProd.length; i++) {
                if (liPartProd[i].PRODUCT_ID === liProd[cntPD].PRODUCT_ID &&
                    liPartProd[i].LOCATION_ID === liProd[cntPD].LOCATION_ID &&
                    liPartProd[i].REF_PRODID === liProd[cntPD].PRODUCT_ID) {
                    vFlag = 'X';
                    break;
                }
            }
            if (vFlag === '') {
                lsProd = {};
                lsProd['LOCATION_ID'] = GenF.parse(lLocation);
                lsProd['PRODUCT_ID'] = GenF.parse(liProd[cntPD].PRODUCT_ID);
                lsProd['REF_PRODID'] = GenF.parse(liProd[cntPD].PRODUCT_ID);
                lsProd['PROD_DESC'] = GenF.parse(liProd[cntPD].PROD_DESC);
                liPartialProd.push(GenF.parse(lsProd));
                for (let cntCfg = 0; cntCfg < liProdCfg.length; cntCfg++) {
                    if (liProdCfg[cntCfg].PRODUCT_ID === liProd[cntPD].PRODUCT_ID) {
                        lsProdCh = {};
                        lsProdCh['LOCATION_ID'] = GenF.parse(lLocation);
                        lsProdCh['PRODUCT_ID'] = GenF.parse(liProdCfg[cntCfg].PRODUCT_ID);
                        lsProdCh['CLASS_NUM'] = GenF.parse(liProdCfg[cntCfg].CLASS_NUM);
                        lsProdCh['CHAR_NUM'] = GenF.parse(liProdCfg[cntCfg].CHAR_NUM);
                        lsProdCh['CHARVAL_NUM'] = GenF.parse(liProdCfg[cntCfg].CHARVAL_NUM);
                        liPartialProdChar.push(GenF.parse(lsProdCh));
                    }
                }
            }
        }

        if (liPartialProd.length > 0) {
            try {
                await cds.run({
                    INSERT:
                    {
                        into: { ref: ['CP_PARTIALPROD_INTRO'] },
                        entries: liPartialProd
                    }
                });
                vFlag = 'X';

            }
            catch (error) {
                console.log("Unable to insert records into Partial table:", error);
            }
            if (vFlag === 'X' && liPartialProdChar.length > 0) {
                try {
                    await cds.run({
                        INSERT:
                        {
                            into: { ref: ['CP_PARTIALPROD_CHAR'] },
                            entries: liPartialProdChar
                        }
                    })

                    console.log("Partial records got created");
                }
                catch (error) {
                    console.log("Unbale to insert records into Partial Config:", error);
                }
            }
        }
        else {
            console.log("No records to update in Partial Products");
        }

    }
    /**
     *  Factory location update for Mater data
     */
    async genFactoryLoc() {
        // Get data from Master tables
        const liLocation = await SELECT.columns(
            "LOCATION_ID")
            .from('CP_LOCATION');

        const liFtLoc = await SELECT.columns(
            "LOCATION_ID",
            "PLAN_LOC",
            "FACTORY_LOC")
            .from('CP_FACTORY_SALESLOC');
        const liPartProd = await cds.run(`
            SELECT "PRODUCT_ID",
                    "LOCATION_ID",
                    "REF_PRODID" 
              FROM CP_PARTIALPROD_INTRO
              WHERE LOCATION_ID IN ( SELECT "LOCATION_ID" FROM CP_LOCATION)
`);
        // Insert master data which doesnot exist in Factory location table
        let vFlag = '';
        let liFactLoc = [];
        let lsFactLoc = {};
        for (let cntLC = 0; cntLC < liPartProd.length; cntLC++) {
            if (liPartProd[cntLC].PRODUCT_ID !== liPartProd[cntLC].REF_PRODID) {
                for (let i = 0; i < liFtLoc.length; i++) {
                    if (liFtLoc[i].PLAN_LOC === liPartProd[cntLC].LOCATION_ID &&
                        liFtLoc[i].PRODUCT_ID === liPartProd[cntLC].PRODUCT_ID &&
                        liFtLoc[i].LOCATION_ID === liPartProd[cntLC].LOCATION_ID &&
                        liFtLoc[i].FACTORY_LOC === liPartProd[cntLC].LOCATION_ID) {
                        vFlag = 'X';
                        break;
                    }
                }
                if (vFlag === '') {
                    lsFactLoc = {};
                    lsFactLoc['LOCATION_ID'] = GenF.parse(liPartProd[cntLC].LOCATION_ID);
                    lsFactLoc['PRODUCT_ID'] = GenF.parse(liPartProd[cntLC].PRODUCT_ID);
                    lsFactLoc['PLAN_LOC'] = GenF.parse(liPartProd[cntLC].LOCATION_ID);
                    lsFactLoc['FACTORY_LOC'] = GenF.parse(liPartProd[cntLC].LOCATION_ID);
                    // console.log(lsFactLoc);
                    liFactLoc.push(GenF.parse(lsFactLoc));
                }
            }
        }

        if (liFactLoc.length > 0) {
            try {

                await cds.run({
                    INSERT:
                    {
                        into: { ref: ['CP_FACTORY_SALESLOC'] },
                        entries: liFactLoc
                    }
                });
                console.log("Updated Factory Location");
            }
            catch (error) {
                console.log("Unable to insert records", error)
            }
        }
        else {
            console.log("No records to update Factory-Locations");
        }
    }
    /**
     * Clear Sales History
     */
    async clearSalesH() {
        // Delete only before sales horizon
        const objCatFn = new Catservicefn();
        await objCatFn.deleteSalesHistory('N');
    }
    /**
     * Generate Cluster Results to CP_V_AHC_CLUSTER_RESULTS
     */
    async genClusterResults(lLocation, lProduct) {
        // var request = require('request');
        // var baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers.host;  // Un-Comment while deploying
        console.log("Started Generation of Clusters");
        var baseUrl = 'http' + '://' + req.headers.host;
        var sUrl = baseUrl + '/pal/genClusters';

        const liDistinctProd = await cds.run(
            `SELECT DISTINCT PRODUCT_ID
               FROM V_SALES_H
              WHERE LOCATION_ID = '${lLocation}'
                AND REF_PRODID = '${lProduct}'`
        );

        if (liDistinctProd.length > 0) {
            for (let i = 0; i < liDistinctProd.length; i++) {
                var options = {
                    'method': 'POST',
                    'url': sUrl,
                    'headers': {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        "vcRulesList": [
                            {
                                "profile": "SBP_AHC_0",
                                "override": false,
                                "Location": lLocation,
                                "Product": liDistinctProd[i].PRODUCT_ID
                            }
                        ]
                    })

                };

                request(options, function (error, response) {

                    if (error) throw new Error(error);

                    console.log(response.body);

                });
            }
            console.log("Completed Cluster Results Generation");
        }


    }

    /**
     * 
     * @param {Location} lLocation 
     * @param {Product} lProduct 
     */
    async saveClusterData(lLocation, lProduct) {
        let liProd = [];
        let lsClusterData = {};
        let liClusterData = [];
        let aFilterUniqChars = [];
        let iCharCount = 0;

        console.log("Started Cluster Data Updation");
        const liUniqueId = await cds.run(
            `SELECT UNIQUE_ID,
                    CHAR_NUM,
                    CHARVAL_NUM
              FROM V_UNIQUE_ID
             WHERE (UNIQUE_ID IN (SELECT DISTINCT UNIQUE_ID
             FROM V_SALES_H
            WHERE LOCATION_ID = '${lLocation}'
              AND REF_PRODID = '${lProduct}'))`
        );

        const keys = ['UNIQUE_ID'];
        const liDistinctUniqueIds = GenF.removeDuplicate(liUniqueId, keys);

        let liPriChar = [];
        liPriChar = await cds.run(`SELECT "CHAR_NUM"
                                     FROM "CP_VARCHAR_PS"
                                    WHERE "PRODUCT_ID" = '` + lProduct + `'
                                      AND "LOCATION_ID" = '` + lLocation + `'
                                      AND "CHAR_TYPE" = 'P'`);

        let liSecChar = [];
        liSecChar = await cds.run(`SELECT "CHAR_NUM"
                                     FROM "CP_VARCHAR_PS"
                                    WHERE "PRODUCT_ID" = '` + lProduct + `'
                                      AND "LOCATION_ID" = '` + lLocation + `'
                                      AND "CHAR_TYPE" = 'S'`);

        for (let i = 0; i < liDistinctUniqueIds.length; i++) {

            liProd = await cds.run(
                `SELECT DISTINCT PRODUCT_ID
                      FROM V_SALES_H
                     WHERE LOCATION_ID = '${lLocation}'
                       AND REF_PRODID  = '${lProduct}'
                       AND UNIQUE_ID   = '${liDistinctUniqueIds[i].UNIQUE_ID}'`
            );

            lsClusterData['LOCATION_ID'] = lLocation;
            lsClusterData['PRODUCT_ID'] = liProd[0].PRODUCT_ID;
            lsClusterData['UNIQUE_ID'] = liDistinctUniqueIds[i].UNIQUE_ID;

            iCharCount = 0;
            for (let cntPC = 0; cntPC < liPriChar.length; cntPC++) {
                aFilterUniqChars = [];
                if (iCharCount < 20) {
                    aFilterUniqChars = liUniqueId.filter(function (aUnichar) {
                        return aUnichar.CHAR_NUM === liPriChar[cntPC].CHAR_NUM
                    });

                    if (aFilterUniqChars.length > 0) {
                        for (let cntUPC = 0; cntUPC < aFilterUniqChars.length; cntUPC++) {
                            iCharCount = iCharCount + 1;
                            if (iCharCount <= 20) {
                                lsClusterData["C" + iCharCount] = aFilterUniqChars[cntUPC].CHARVAL_NUM;
                            } else {
                                break;
                            }
                        }
                    }
                } else {
                    break;
                }
            }

            for (let cntSC = 0; cntSC < liSecChar.length; cntSC++) {
                aFilterUniqChars = [];
                if (iCharCount < 20) {
                    aFilterUniqChars = liUniqueId.filter(function (aUnichar) {
                        return aUnichar.CHAR_NUM === liSecCha[cntSC].CHAR_NUM
                    });

                    if (aFilterUniqChars.length > 0) {
                        for (let cntUSC = 0; cntUSC < aFilterUniqChars.length; cntUSC++) {
                            iCharCount = iCharCount + 1;
                            if (iCharCount <= 20) {
                                lsClusterData["C" + iCharCount] = aFilterUniqChars[cntUSC].CHARVAL_NUM;
                            }
                        }
                    }
                } else {
                    break;
                }
            }

            liClusterData.push(lsClusterData);

            // iCharCount = 0;
            // if (liSOHM[cntSO].PCONFIG.length > 0) {
            //     for (let cntSOPC = 0; cntSOPC < liSOHM[cntSO].PCONFIG.length; cntSOPC++) {
            //         iCharCount = iCharCount + 1;
            //         if (iCharCount <= 20) {
            //             lsClusterData["C" + iCharCount] = liSOHM[cntSO].PCONFIG[cntSOPC].CHARVAL_NUM;
            //         }
            //     }
            // }
            // if (liSOHM[cntSO].CONFIG.length > 0 && iCharCount < 20) {
            //     for (let cntSOC = 0; cntSOC < liSOHM[cntSO].CONFIG.length; cntSOC++) {
            //         iCharCount = iCharCount + 1;
            //         if (iCharCount <= 20) {
            //             lsClusterData["C" + iCharCount] = liSOHM[cntSO].CONFIG[cntSOC].CHARVAL_NUM;
            //         }
            //     }
            // }

            // liClusterData.push(lsClusterData);

        }

        if (liClusterData.length > 0) {
            await INSERT(liClusterData).into('CP_CLUSTER_DATA');
        }
        console.log("Completed Cluster Data Updation");

    }
}

module.exports = SOFunctions;