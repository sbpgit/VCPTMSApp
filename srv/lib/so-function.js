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

class SOFunctions{
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
    
    async genUniqueID(adata){
        
        const liSalesh = await this.getSalesHistory(adata.LOCATION_ID, adata.PRODUCT_ID, '');
        const liSaleshPri = await this.getSalesHistory(lLocation,lProduct, 'X');
        const liUniqueData =  await this.getUnique(adata.LOCATION_ID, adata.PRODUCT_ID);

       
        let liSOHM = [];
        let lsSOHM = {};
        let liUnique = [];
        let lsUnique = {};

        this.logger.info("Order Count: " + liSalesh.length);

        // Determine Unique ID
        for (let cntSO = 0; cntSO < liSalesh.length; cntSO++) {

            lsSOHM = {};
            lsSOHM['SALES_DOC']     = GenF.parse(liSalesh[cntSO].SALES_DOC);
            lsSOHM['SALESDOC_ITEM'] = GenF.parse(liSalesh[cntSO].SALESDOC_ITEM);
            lsSOHM['PRODUCT_ID']    = GenF.parse(adata.PRODUCT_ID);
            lsSOHM['LOCATION_ID']   = GenF.parse(adata.LOCATION_ID);
            lsSOHM['UNIQUE_ID']      = 0;
            lsSOHM['CONFIG']        = GenF.parse(liSalesh[cntSO].CONFIG);

            // Check if Unique ID already exists                    
            for (let cntUID = 0; cntUID < liUniqueData.length; cntUID++) {
                if (JSON.stringify(liSalesh[cntSO].CONFIG) === JSON.stringify(liUniqueData[cntUID]['CONFIG']) &&
                    liUniqueData[cntUID].UNIQUE_TYPE === 'A') { 
                    lsSOHM['UNIQUE_ID'] = GenF.parse(liUniqueData[cntUID].UNIQUE_ID);
                }               
            }
            
            lsUnique = {};
            lsUnique['CONFIG'] = [];  

            if( lsSOHM['UNIQUE_ID'] === 0){
                lsUnique['UNIQUE_TYPE'] = 'A';
                lsUnique['CONFIG'] = liSalesh[cntSO].CONFIG;
                for (let cntU = 0; cntU < liUnique.length; cntU++) {
                    if(JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUnique[cntU].CONFIG) &&
                        liUnique[cntU].UNIQUE_TYPE === 'A'){
                        lsUnique['CONFIG'] = []
                    }
                }
            }

            if (lsUnique['CONFIG'].length > 0) {
                liUnique.push(lsUnique);
            }    
            
            liSOHM.push(lsSOHM);
           
        }

        // Unique ID only for Primary Characteristics
        for (let cntSO = 0; cntSO < liSaleshPri.length; cntSO++) {

            lsUnique = {};
            lsUnique['CONFIG'] = [];  

            if(liSaleshPri[cntSO].CONFIG.length > 0){
                lsUnique['UNIQUE_TYPE'] = 'P';
                lsUnique['CONFIG'] = liSaleshPri[cntSO].CONFIG;
                for (let cntU = 0; cntU < liUniqueData.length; cntU++) {
                    if(JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUniqueData[cntU].CONFIG) &&
                    liUniqueData[cntU].UNIQUE_TYPE === 'P'){
                        lsUnique['CONFIG'] = []
                    }
                }

                for (let cntU = 0; cntU < liUnique.length; cntU++) {
                    if(JSON.stringify(lsUnique['CONFIG']) === JSON.stringify(liUnique[cntU].CONFIG) &&
                        liUnique[cntU].UNIQUE_TYPE === 'P'){
                        lsUnique['CONFIG'] = []
                    }
                }                
            }

            if (lsUnique['CONFIG'].length > 0) {
                liUnique.push(lsUnique);
            } 
        }        


        let lCntVariantID = 0;

        for (let cntU = 0; cntU < liUnique.length; cntU++) {
            if(liUnique[cntU]['CONFIG'].length > 0){

                // Get the highest Unique ID
                const liUniqueInd = await cds.run(
                    `SELECT MAX("UNIQUE_ID") + 1 as UNIQUE_ID
                       FROM CP_UNIQUE_ID_HEADER`
                );     
                
                for (let cntIndex = 0; cntIndex < liUniqueInd.length; cntIndex++) {
                    if(liUniqueInd[cntIndex].UNIQUE_ID === null){
                        lCntVariantID = 1;
                    }else{
                        lCntVariantID = parseInt( liUniqueInd[cntIndex].UNIQUE_ID );
                    }
                }
                liUnique[cntU]['UNIQUE_ID'] = lCntVariantID;

                this.logger.info("Unique ID Index: " + lCntVariantID);
                
                try {
                    let sqlStr = await conn.prepare(
                        `INSERT INTO "CP_UNIQUE_ID_HEADER" VALUES(
                            '` + liUnique[cntU].UNIQUE_ID + `',
                            '` + adata.LOCATION_ID + `',
                            '` + adata.PRODUCT_ID + `',
                            '',
                            '` + liUnique[cntU].UNIQUE_TYPE + `',
                            '0',
                            TRUE)`
                    )
                    await sqlStr.exec();
                    await sqlStr.drop();                      

                } catch (error) {
                    this.logger.error(error.message);
                }
                
                if(liUnique[cntU].UNIQUE_TYPE === 'A'){
                    for (let cntSO = 0; cntSO < liSOHM.length; cntSO++) {
                        if(liSOHM[cntSO].UNIQUE_ID === 0 &&
                            JSON.stringify(liSOHM[cntSO].CONFIG) === JSON.stringify(liUnique[cntU]['CONFIG'])){
                                liSOHM[cntSO].UNIQUE_ID = liUnique[cntU].UNIQUE_ID;
                        }
                    }
                }   
                
                for (let cntUC = 0; cntUC < liUnique[cntU]['CONFIG'].length; cntUC++) {
                    let sqlStr = await conn.prepare(
                        `INSERT INTO "CP_UNIQUE_ID_ITEM" VALUES(
                            '` + liUnique[cntU].UNIQUE_ID + `',                            
                            '` + adata.LOCATION_ID + `',
                            '` + adata.PRODUCT_ID + `',
                            '` + liUnique[cntU]['CONFIG'][cntUC].CHAR_NUM + `',
                            '` + liUnique[cntU]['CONFIG'][cntUC].CHARVAL_NUM + `')`
                    )
                    await sqlStr.exec();
                    await sqlStr.drop();                    
                }
               
            }
        }

        this.logger.info("Sales Order Count: " + liSOHM.length);

        const liPartialProd = await cds.run(
            `SELECT *
                FROM CP_PARTIALPROD_CHAR 
                WHERE REF_PRODID    = '` + adata.PRODUCT_ID + `'
                ORDER BY LOCATION_ID,
                         PRODUCT_ID,
                         CLASS_NUM,
                         CHAR_NUM`
        );     
 


        for (let cntSO = 0; cntSO < liSOHM.length; cntSO++) {
            let lFail = '';
            for (let cntPC = 0; cntPC < liPartialProd.length; cntPC++) {
                let lSuccess = '';
                if(lFail === ''){
                    for (let cntSOC = 0; cntSOC < liSOHM.CONFIG.length; cntSOC++) {
                        if(liSOHM.CONFIG[cntSOC].CHAR_NUM === liPartialProd[cntPC].CHAR_NUM &&
                        liSOHM.CONFIG[cntSOC].CHARVAL_NUM === liPartialProd[cntPC].CHARVAL_NUM){
                            lSuccess = 'X';
                        }
                    }
                    if(lSuccess === ''){
                        lFail = 'X';
                    }
                }
                if (cntPC === GenF.addOne(cntPC, liPartialProd.length) || 
                    liPartialProd[cntPC].LOCATION_ID !== liPartialProd.length[GenF.addOne(cntPC, liPartialProd.length)].LOCATION_ID ||
                    liPartialProd[cntPC].PRODUCT_ID !== liPartialProd.length[GenF.addOne(cntPC, liPartialProd.length)].PRODUCT_ID) {
                    liSOHM[cntSO].PRODUCT_ID = GenF.parse(liPartialProd[cntPC].PRODUCT_ID);
                    lFail = '';
                }
            }
            try{
                let sqlStr = await conn.prepare(
                    `UPSERT "CP_SALES_HM" VALUES(
                        '` + liSOHM[cntSO].SALES_DOC + `',                            
                        '` + liSOHM[cntSO].SALESDOC_ITEM + `',
                        '` + liSOHM[cntSO].PRODUCT_ID + `',
                        '` + liSOHM[cntSO].LOCATION_ID + `',
                        '` + liSOHM[cntSO].UNIQUE_ID + `') WITH PRIMARY KEY`
                )
                await sqlStr.exec();
                await sqlStr.drop();    

            } catch (error) {
                this.logger.error(error.message);
            }                            
        }

    }

    async getSalesHistory(lLocation, lProduct, lOnlyPrimary){

        let liSalesData = [];

        if(lOnlyPrimary === ''){
            liSalesData = await cds.run(
                `SELECT *
                FROM CP_SALESH AS A
                INNER JOIN CP_SALESH_CONFIG AS B
                    ON A.SALES_DOC = B.SALES_DOC
                    AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                WHERE A.LOCATION_ID   = '` + lLocation + `'
                    AND B.PRODUCT_ID    = '` + lProduct + `'
                ORDER BY A.SALES_DOC,
                        A.SALESDOC_ITEM,
                        B.CHAR_NUM`
            ); 
        }
        else{
            liSalesData = await cds.run(            
                `SELECT *
                   FROM CP_SALESH AS A
                  INNER JOIN CP_SALESH_CONFIG AS B
                     ON A.SALES_DOC = B.SALES_DOC
                    AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
                  WHERE A.LOCATION_ID   = '` + lLocation + `'
                    AND B.PRODUCT_ID    = '` + lProduct + `'
                    AND B.CHAR_NUM IN (SELECT "CHAR_NUM"
                                         FROM "CP_VARCHAR_PS"
                                        WHERE "PRODUCT_ID" = '` + lProduct + `'
                                          AND "LOCATION_ID" = '` + lLocation + `'
                                          AND "CHAR_TYPE" = 'P')
                ORDER BY A.SALES_DOC,
                        A.SALESDOC_ITEM,
                        B.CHAR_NUM`
            );                       
        }

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
                }         

                lsSaleshConfig = {}   ;
                lsSaleshConfig['CHAR_NUM'] = GenF.parse(liSalesData[cntSO].CHAR_NUM);
                lsSaleshConfig['CHARVAL_NUM'] = GenF.parse(liSalesData[cntSO].CHARVAL_NUM);
                lsSalesh['CONFIG'].push(lsSaleshConfig);

            if (cntSO === GenF.addOne(cntSO, liSalesData.length) ||
                liSalesData[cntSO].SALES_DOC     !== liSalesData[GenF.addOne(cntSO, liSalesData.length)].SALES_DOC ||
                liSalesData[cntSO].SALESDOC_ITEM !== liSalesData[GenF.addOne(cntSO, liSalesData.length)].SALESDOC_ITEM) {
                    liSalesh.push(lsSalesh);
                }
        }

        return liSalesh;
    }

    async getUnique(lLocation, lProduct){
        const liUniqueGet = await cds.run(
            `SELECT H."UNIQUE_ID",
                    H."LOCATION_ID",
                    H."PRODUCT_ID",
                    H."UNIQUE_TYPE",
                    I."CHAR_NUM",
                    I."CHARVAL_NUM"
               FROM "CP_UNIQUE_ID_ITEM" AS I
              INNER JOIN CP_UNIQUE_ID_HEADER AS H
                 ON H.UNIQUE_ID = I.UNIQUE_ID
                AND H.LOCATION_ID = I.LOCATION_ID
                AND H.PRODUCT_ID = I.PRODUCT_ID
              WHERE H.LOCATION_ID = '` + lLocation + `'
                AND H.PRODUCT_ID  = '` + lProduct + `'
              ORDER BY H.UNIQUE_ID,
                       H.LOCATION_ID,
                       H.PRODUCT_ID,
                       H.UNIQUE_TYPE,
                       I.CHAR_NUM`
        );           

        let lsUniqueConfig = {};
        let lsUnique = {};
        let liUniqueData = [];

        this.logger.info("Existing Unique ID: " + liUniqueGet.length);

        for (let cntU = 0; cntU < liUniqueGet.length; cntU++) {
            if (cntU === 0 ||
                liUniqueGet[cntU].UNIQUE_ID    !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].UNIQUE_ID ||
                liUniqueGet[cntU].LOCATION_ID !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].LOCATION_ID ||
                liUniqueGet[cntU].PRODUCT_ID  !== liUniqueGet[GenF.subOne(cntU, liUniqueGet.length)].PRODUCT_ID) {
                    lsUnique = {};
                    lsUnique['UNIQUE_ID']    = GenF.parse(liUniqueGet[cntU].UNIQUE_ID);
                    lsUnique['LOCATION_ID'] = GenF.parse(liUniqueGet[cntU].LOCATION_ID);
                    lsUnique['PRODUCT_ID']  = GenF.parse(liUniqueGet[cntU].PRODUCT_ID);
                    lsUnique['UNIQUE_TYPE']  = GenF.parse(liUniqueGet[cntU].UNIQUE_TYPE);
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

    async getPriUniqueID(lLocation, lProduct){

        let liUniqueData = await cds.run(            
            `SELECT *
               FROM V_UNIQUE_ID
              WHERE LOCATION_ID   = '` + lLocation + `'
                AND PRODUCT_ID    = '` + lProduct + `'
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
        
        for (let cntU = 0; cntU < liUniqueData.length; cntU++) {
            const element = liUniqueData[cntU];
            
        }

    }

}

module.exports = SOFunctions;