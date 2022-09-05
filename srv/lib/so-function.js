const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

class SOFunctions{
/**
 * Constructor
 */    
    constructor() {}

/**
 * Generate Unique ID
 * @param {Data} adata 
 */    
    async genUniqueID(adata){
        
        const liSalesh = await this.getSalesHistory(adata.LOCATION_ID, adata.PRODUCT_ID);
        const liUniqueData =  await this.getUnique(adata.LOCATION_ID, adata.PRODUCT_ID);

       
        let liSOHM = [];
        let lsSOHM = {};
        let liUnique = [];
        let lsUnique = {};

        console.log("Order Count: " + liSalesh.length);

        // Determine Unique ID
        for (let cntSO = 0; cntSO < liSalesh.length; cntSO++) {

            lsSOHM = {};
            lsSOHM['SALES_DOC']     = GenF.parse(liSalesh[cntSO].SALES_DOC);
            lsSOHM['SALESDOC_ITEM'] = GenF.parse(liSalesh[cntSO].SALESDOC_ITEM);
            lsSOHM['PRODUCT_ID']    = GenF.parse(adata.PRODUCT_ID);
            lsSOHM['LOCATION_ID']   = GenF.parse(adata.LOCATION_ID);
            lsSOHM['UNIQUE_ID']     = 0;
            lsSOHM['PRIMARY_ID']    = 0;
            lsSOHM['CONFIG']        = GenF.parse(liSalesh[cntSO].CONFIG);
            lsSOHM['PCONFIG']       = GenF.parse(liSalesh[cntSO].PCONFIG);

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

            if( lsSOHM['UNIQUE_ID'] === 0){
                lsUnique['CONFIG'] = liSalesh[cntSO].CONFIG;
                lsUnique['UID_TYPE'] = 'U';
                // If Unique ID is already planned to be created, do not add again
                for (let cntU = 0; cntU < liUnique.length; cntU++) {
                    if(JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUnique[cntU].CONFIG)){
                        lsUnique['CONFIG'] = []
                    }
                }
            }
            if (lsUnique['CONFIG'].length > 0) {
                liUnique.push(lsUnique);
            }    

            lsUnique = {};
            lsUnique['CONFIG'] = [];  

            if( lsSOHM['PRIMARY_ID'] === 0){
                lsUnique['CONFIG'] = liSalesh[cntSO].PCONFIG;
                lsUnique['UID_TYPE'] = 'P';
                // If Unique ID is already planned to be created, do not add again
                for (let cntU = 0; cntU < liUnique.length; cntU++) {
                    if(JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUnique[cntU].CONFIG)){
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
            if(liUnique[cntU]['CONFIG'].length > 0){

                const lsUniqueInd = await SELECT.one.columns("MAX(UNIQUE_ID) + 1 AS MAX_ID")
                                            .from('CP_UNIQUE_ID_HEADER');
                if(lsUniqueInd.MAX_ID === null){
                    lCntVariantID = 1;
                }else{                    
                    lCntVariantID = parseInt(lsUniqueInd.MAX_ID);
                }

                liUnique[cntU]['UNIQUE_ID'] = lCntVariantID;

                console.log("Unique ID Index: " + lCntVariantID);
                
                await cds.run({INSERT:
                    {
                        into:{ ref: ['CP_UNIQUE_ID_HEADER'] },
                        values: [ liUnique[cntU].UNIQUE_ID, adata.LOCATION_ID, adata.PRODUCT_ID, '', liUnique[cntU].UID_TYPE, 0, true]
                    }
                })

                
                // Update Sales Orders with Unique ID
                for (let cntSO = 0; cntSO < liSOHM.length; cntSO++) {
                    if(liSOHM[cntSO].UNIQUE_ID === 0 &&
                        JSON.stringify(liSOHM[cntSO].CONFIG) === JSON.stringify(liUnique[cntU]['CONFIG'])){
                            liSOHM[cntSO].UNIQUE_ID = liUnique[cntU].UNIQUE_ID;
                    }
                    if(liSOHM[cntSO].PRIMARY_ID === 0 &&
                        JSON.stringify(liSOHM[cntSO].PCONFIG) === JSON.stringify(liUnique[cntU]['CONFIG'])){
                            liSOHM[cntSO].PRIMARY_ID = liUnique[cntU].UNIQUE_ID;
                    }                    
                }
             
                let liChar = [];
                let lsChar = {};
                for (let cntUC = 0; cntUC < liUnique[cntU]['CONFIG'].length; cntUC++) {
                    lsChar =  {};
                    lsChar['UNIQUE_ID'] = GenF.parse(liUnique[cntU].UNIQUE_ID);
                    lsChar['LOCATION_ID'] = GenF.parse(adata.LOCATION_ID);
                    lsChar['PRODUCT_ID'] = GenF.parse(adata.PRODUCT_ID);
                    lsChar['CHAR_NUM'] = GenF.parse(liUnique[cntU]['CONFIG'][cntUC].CHAR_NUM);
                    lsChar['CHARVAL_NUM'] = GenF.parse(liUnique[cntU]['CONFIG'][cntUC].CHARVAL_NUM);
                    lsChar['UID_CHAR_RATE'] = 0
                    liChar.push(lsChar);

                }

                cds.run({INSERT:
                    {
                        into:{ ref: ['CP_UNIQUE_ID_ITEM'] },
                        entries: liChar
                    }
                })                

            }
        }

        console.log("Sales Order Count: " + liSOHM.length);

        const liPartialProd = await cds.run(
            `SELECT *
                FROM V_PARTIALPRODCHAR
                WHERE REF_PRODID    = '${adata.PRODUCT_ID}'
                  AND LOCATION_ID   = '${adata.LOCATION_ID}'
                ORDER BY LOCATION_ID,
                         PRODUCT_ID,
                         CLASS_NUM,
                         CHAR_NUM`
        );     

        let liSalesUpdate = [];
        let lsSalesUpdate = {};

        for (let cntSO = 0; cntSO < liSOHM.length; cntSO++) {
            let lIgnoreProduct = '';
            for (let cntPC = 0; cntPC < liPartialProd.length; cntPC++) {
                let lSuccess = '';
                for (let cntSOC = 0; cntSOC < liSOHM[cntSO].CONFIG.length; cntSOC++) {
                    if(liSOHM[cntSO].CONFIG[cntSOC].CHAR_NUM === liPartialProd[cntPC].CHAR_NUM &&
                    liSOHM[cntSO].CONFIG[cntSOC].CHARVAL_NUM === liPartialProd[cntPC].CHARVAL_NUM){
                        lSuccess = 'X';
                        break;
                    }
                }
                if(lSuccess === ''){
                    lIgnoreProduct = GenF.parse(liPartialProd[cntPC].PRODUCT_ID);
                }
                if (liPartialProd[cntPC].PRODUCT_ID !== lIgnoreProduct) {
                    if (cntPC === GenF.addOne(cntPC, liPartialProd.length) ||
                        liPartialProd[cntPC].LOCATION_ID !== liPartialProd[GenF.addOne(cntPC, liPartialProd.length)].LOCATION_ID ||
                        liPartialProd[cntPC].PRODUCT_ID !== liPartialProd[GenF.addOne(cntPC, liPartialProd.length)].PRODUCT_ID) {

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

        if(liSalesUpdate.length > 0){
            await INSERT (liSalesUpdate) .into('CP_SALES_HM');
        }
        console.log("Process Completed");

        await this.updateUniqueRate(adata.LOCATION_ID, adata.PRODUCT_ID);

        console.log("UID Rate Updated");

    }

/**
 * Get Sales History
 * @param {Location} lLocation 
 * @param {Product} lProduct 
 */    
    async getSalesHistory(lLocation, lProduct){

        let liSalesData = [];
        liSalesData = await cds.run(
                `SELECT *
                FROM CP_SALESH AS A
                INNER JOIN CP_SALESH_CONFIG AS B
                    ON A.SALES_DOC = B.SALES_DOC
                    AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                WHERE A.LOCATION_ID = '` + lLocation + `'
                    AND B.PRODUCT_ID  = '` + lProduct + `'
                ORDER BY A.SALES_DOC,
                        A.SALESDOC_ITEM,
                        B.CHAR_NUM`
            ); 


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
                liSalesData[cntSO].SALES_DOC     !== liSalesData[GenF.subOne(cntSO, liSalesData.length)].SALES_DOC ||  
                liSalesData[cntSO].SALESDOC_ITEM !== liSalesData[GenF.subOne(cntSO, liSalesData.length)].SALESDOC_ITEM) {
                    lsSalesh = {};
                    lsSalesh['SALES_DOC']     = GenF.parse(liSalesData[cntSO].SALES_DOC);
                    lsSalesh['SALESDOC_ITEM'] = GenF.parse(liSalesData[cntSO].SALESDOC_ITEM);
                    lsSalesh['CONFIG']        = [];
                    lsSalesh['PCONFIG']       = [];
                }         

                lsSaleshConfig = {}   ;
                lsSaleshConfig['CHAR_NUM'] = GenF.parse(liSalesData[cntSO].CHAR_NUM);
                lsSaleshConfig['CHARVAL_NUM'] = GenF.parse(liSalesData[cntSO].CHARVAL_NUM);
                lsSalesh['CONFIG'].push(lsSaleshConfig);

                for (let cntPC = 0; cntPC < liPriChar.length; cntPC++) {
                    if(liSalesData[cntSO].CHAR_NUM === liPriChar[cntPC].CHAR_NUM) {
                        lsSaleshConfig = {}   ;
                        lsSaleshConfig['CHAR_NUM'] = GenF.parse(liSalesData[cntSO].CHAR_NUM);
                        lsSaleshConfig['CHARVAL_NUM'] = GenF.parse(liSalesData[cntSO].CHARVAL_NUM);
                        lsSalesh['PCONFIG'].push(lsSaleshConfig); 
                        break;                       
                    }
                }

            if (cntSO === GenF.addOne(cntSO, liSalesData.length) ||
                liSalesData[cntSO].SALES_DOC     !== liSalesData[GenF.addOne(cntSO, liSalesData.length)].SALES_DOC ||
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
    async getUnique(lLocation, lProduct){
        
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
                liUniqueGet[cntU].UNIQUE_ID    !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].UNIQUE_ID ||
                liUniqueGet[cntU].LOCATION_ID !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].LOCATION_ID ||
                liUniqueGet[cntU].PRODUCT_ID  !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].PRODUCT_ID) {
                    lsUnique = {};
                    lsUnique['UNIQUE_ID']    = GenF.parse(liUniqueGet[cntU].UNIQUE_ID);
                    lsUnique['LOCATION_ID'] = GenF.parse(liUniqueGet[cntU].LOCATION_ID);
                    lsUnique['PRODUCT_ID']  = GenF.parse(liUniqueGet[cntU].PRODUCT_ID);
                    lsUnique['CONFIG'] = [];
            }
            lsUniqueConfig = {};
            lsUniqueConfig['CHAR_NUM']    = GenF.parse(liUniqueGet[cntU].CHAR_NUM);
            lsUniqueConfig['CHARVAL_NUM'] = GenF.parse(liUniqueGet[cntU].CHARVAL_NUM);
            lsUnique['CONFIG'].push(lsUniqueConfig);

            if (cntU === GenF.addOne(cntU, liUniqueGet.length) ||
                liUniqueGet[cntU].UNIQUE_ID    !== liUniqueGet[GenF.addOne(cntU, liUniqueGet.length)].UNIQUE_ID ||
                liUniqueGet[cntU].LOCATION_ID !== liUniqueGet[GenF.addOne(cntU, liUniqueGet.length)].LOCATION_ID ||
                liUniqueGet[cntU].PRODUCT_ID  !== liUniqueGet[GenF.addOne(cntU, liUniqueGet.length)].PRODUCT_ID) {
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
    async getPriUniqueID(lLocation, lProduct){

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

            if(liUniquePData[cntUIDP].UNIQUE_ID !== liUniquePData[GenF.addOne(cntUIDP, liUniquePData.length)].UNIQUE_ID ||
            cntUIDP === GenF.addOne(cntUIDP, liUniquePData.length)){
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

            if(liUniqueData[cntU].UNIQUE_ID !== liUniqueData[GenF.addOne(cntU, liUniqueData.length)].UNIQUE_ID ||
                cntU === GenF.addOne(cntU, liUniqueData.length)){

// Check if Primary ID is already created                    
                    for (let cntPID = 0; cntPID < liPriID.length; cntPID++) {
                        if(JSON.stringify(liChar) === JSON.stringify(liPriID[cntPID])){
                            liChar = [];
                            break;
                        }
                    }

                    if(liChar.length > 0){
// Check if Primary ID is already planned for creation
                        for (let cntUID = 0; cntUID < liCharFinal.length; cntUID++) {
                            if(JSON.stringify(liChar) === JSON.stringify(liCharFinal[cntUID])){
                                liChar = [];
                                break;
                            }
                        }
                    }

                    if(liChar.length > 0){
                        liCharFinal.push(liChar);
                    }

                    liChar = [];

            }
            
        }

        for (let cntU = 0; cntU < liCharFinal.length; cntU++) {
            if(liCharFinal[cntU].length > 0){

                await  createPrimaryID(lLocation, lProduct, liCharFinal[cntU]);
/*
                const lsUniqueInd = await SELECT.one.columns("MAX(UNIQUE_ID) + 1 AS MAX_ID")
                                            .from('CP_UNIQUE_ID_HEADER');
                if(lsUniqueInd.MAX_ID === null){
                    lCntVariantID = 1;
                }else{                    
                    lCntVariantID = parseInt(lsUniqueInd.MAX_ID);
                }         

                this.logger.info("Unique ID Index: " + lCntVariantID);

                await cds.run({INSERT:
                    {
                        into:{ ref: ['CP_UNIQUE_ID_HEADER'] },
                        values: [ lCntVariantID, lLocation, lProduct, '', 'P', 0, true]
                    }
                })

                let liChar = [];
                let lsChar = {};
                for (let cntUC = 0; cntUC < liCharFinal[cntU].length; cntUC++) {
                    lsChar =  {};
                    lsChar['UNIQUE_ID'] = GenF.parse(lCntVariantID);
                    lsChar['LOCATION_ID'] = GenF.parse(lLocation);
                    lsChar['PRODUCT_ID'] = GenF.parse(lProduct);
                    lsChar['CHAR_NUM'] = GenF.parse(liCharFinal[cntU][cntUC].CHAR_NUM);
                    lsChar['CHARVAL_NUM'] = GenF.parse(liCharFinal[cntU][cntUC].CHARVAL_NUM);
                    liChar.push(lsChar);
                }
                
                cds.run({INSERT:
                    {
                        into:{ ref: ['CP_UNIQUE_ID_ITEM'] },
                        entries: liChar
                    }
                })                
*/               
            }
        }

        this.logger.info("Process Completed");

    }

/**
 * 
 * @param {Location} lLocation 
 * @param {Product} lProduct 
 */    
    async updateUniqueRate(lLocation, lProduct){

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
                if(liSalesUni[cntUID].LOCATION_ID === liSalesProd[cntSP].LOCATION_ID &&
                   liSalesUni[cntUID].PRODUCT_ID === liSalesProd[cntSP].PRODUCT_ID){
                    if (liSalesProd[cntSP].ORD_QTY > 0) {
                        await UPDATE `CP_UNIQUE_ID_HEADER`
                                  .with({
                                      UID_RATE: ((liSalesUni[cntUID].ORD_QTY * 100 / liSalesProd[cntSP].ORD_QTY)).toFixed(2)
                                  })
                                  .where( `UNIQUE_ID = '${liSalesUni[cntUID].UNIQUE_ID}'
                                          AND LOCATION_ID = '${lLocation}'
                                          AND PRODUCT_ID = '${lProduct}'`)

                    }
                }
            }

            for (let cntUC = 0; cntUC < liSalesChar.length; cntUC++) {
                if(liSalesChar[cntUC].LOCATION_ID === liSalesProd[cntSP].LOCATION_ID &&
                    liSalesChar[cntUC].PRODUCT_ID === liSalesProd[cntSP].PRODUCT_ID){
                     if (liSalesProd[cntSP].ORD_QTY > 0) {
                         await UPDATE `CP_UNIQUE_ID_ITEM`
                                   .with({
                                       UID_CHAR_RATE: (liSalesChar[cntUC].ORD_QTY * 100 / liSalesProd[cntSP].ORD_QTY).toFixed(2)
                                   })
                                   .where( `LOCATION_ID = '${lLocation}'
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
    async createSO(lLocation, lProduct, lSO, lDate, lQty, lUnique){

        const lSOItem = '10';
// Get Main Product        
        const lsSales = await SELECT.one
                                   .columns('REF_PRODID')
                                   .from('CP_PARTIALPROD_INTRO')
                                   .where(`LOCATION_ID = '${lLocation}'
                                       AND PRODUCT_ID = '${lProduct}'`);

        await INSERT.into('CP_SALESH').columns('SALES_DOC', 
                                               'SALESDOC_ITEM', 
                                               'PRODUCT_ID', 
                                               'CONFIRMED_QTY', 
                                               'ORD_QTY', 
                                               'MAT_AVAILDATE', 
                                               'LOCATION_ID')
                                    .values( lSO,
                                              lSOItem,
                                            lsSales.REF_PRODID,
                                            lQty,
                                            lQty,
                                            lDate,
                                            lLocation);    
                                            
        const liUnique = await SELECT.columns('CHAR_NUM', 'CHARVAL_NUM')
                                     .from('CP_UNIQUE_ID_ITEM')
                                     .where(`UNIQUE_ID = '${lUnique}' 
                                         AND LOCATION_ID = '${lLocation}
                                         AND PRODUCT_ID = '${lsSales.REF_PRODID}'
                                         AND CHAR_NUM IN (SELECT "CHAR_NUM"
                                                            FROM "CP_VARCHAR_PS"
                                                           WHERE "PRODUCT_ID" = '` + lProduct + `'
                                                             AND "LOCATION_ID" = '` + lsSales.REF_PRODID + `'
                                                             AND "CHAR_TYPE" = 'P')`)
                                         .orderBy('CHAR_NUM', 'CHARVAL_NUM');

        const liPrimary = await SELECT.columns('UNIQUE_ID', 'CHAR_NUM', 'CHARVAL_NUM')
                                        .from('V_UNIQUE_ID')
                                        .where(`LOCATION_ID = '${lLocation}
                                            AND PRODUCT_ID  = '${lsSales.REF_PRODID}'
                                            AND UID_TYPE    = 'P'`);

        let lUICount = 0;
        let lFailPrimary = 0;
        let lSPrimary = 0;
        for (let cntPID = 0; cntPID < liPrimary.length; cntPID++) {
            if(cntPID === 0 ||
               liPrimary[cntPID].UNIQUE_ID !== liPrimary[GenF.subOne(cntPID,liPrimary.length)].UNIQUE_ID){
                lUICount = 0;
            }

            if(liPrimary[cntPID].CHAR_NUM !== liUnique[lUICount].CHAR_NUM ||
               liPrimary[cntPID].CHARVAL_NUM !== liUnique[lUICount].CHARVAL_NUM ){
                   lFailPrimary = GenF.parse(liPrimary[cntPID].UNIQUE_ID);
               }

            if(cntPID === GenF.addOne(cntPID, liPrimary.length) ||
                liPrimary[cntPID].UNIQUE_ID !== liPrimary[GenF.addOne(cntPID,liPrimary.length)].UNIQUE_ID){
                    if(lFailPrimary === 0){
                        lSPrimary = GenF.parse(liPrimary[cntPID].UNIQUE_ID);
                        break;
                    }
            }
        }

        if(lSPrimary === 0){
            lSPrimary = await  createPrimaryID(lLocation, lsSales.REF_PRODID, liUnique);
        }
    
        await INSERT.into('CP_SALES_HM')
                    .values( lSO, lSOItem, lProduct, lLocation, lUnique, lSPrimary);

    }

    async createPrimaryID(lLocation, lProduct, liCharVal){


            const lsUniqueInd = await SELECT.one.columns("MAX(UNIQUE_ID) + 1 AS MAX_ID")
                .from('CP_UNIQUE_ID_HEADER');

            if (lsUniqueInd.MAX_ID === null) {
                lCntVariantID = 1;
            } else {
                lCntVariantID = parseInt(lsUniqueInd.MAX_ID);
            }

            this.logger.info("Unique ID Index: " + lCntVariantID);

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

            cds.run({
                INSERT:
                {
                    into: { ref: ['CP_UNIQUE_ID_ITEM'] },
                    entries: liChar
                }
            }) 
            
            return lCntVariantID;

    }

}

module.exports = SOFunctions;