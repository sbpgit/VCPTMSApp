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
    async genMatVariant(adata){
        const liSales = await cds.run(
            `SELECT *
            FROM CP_SALESH AS A
           INNER JOIN CP_SALESH_CONFIG AS B
              ON A.SALES_DOC = B.SALES_DOC
             AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
           WHERE A.LOCATION_ID   = '` + adata.LOCATION_ID + `'
             AND B.PRODUCT_ID    = '` + adata.PRODUCT_ID + `'
             ORDER BY A.SALES_DOC,
                      A.SALESDOC_ITEM,
                      B.CHAR_NUM`
        ); 

        const liSalesPri = await cds.run(
            `SELECT *
            FROM CP_SALESH AS A
           INNER JOIN CP_SALESH_CONFIG AS B
              ON A.SALES_DOC = B.SALES_DOC
             AND A.SALESDOC_ITEM = B.SALESDOC_ITEM
           WHERE A.LOCATION_ID   = '` + adata.LOCATION_ID + `'
             AND B.PRODUCT_ID    = '` + adata.PRODUCT_ID + `'
             AND B.CHAR_NUM IN (SELECT "CHAR_NUM"
                                    FROM "CP_VARCHAR_PS"
                                WHERE "PRODUCT_ID" = '` + adata.PRODUCT_ID + `'
                                    AND "LOCATION_ID" = '` + adata.LOCATION_ID + `'
                                    AND "CHAR_TYPE" = 'P')
             ORDER BY A.SALES_DOC,
                      A.SALESDOC_ITEM,
                      B.CHAR_NUM`
        );         

        // Remove Existing Material Variants
        try {
            let sqlStr = await conn.prepare(
                `DELETE FROM "CP_MATVARIANT_HEADER" WHERE LOCATION_ID = '` + adata.LOCATION_ID + `'
                                                      AND PRODUCT_ID = '` + adata.PRODUCT_ID + `'`
            )
            await sqlStr.exec();
            await sqlStr.drop();            
        } catch (error) {
            this.logger.error(error.message);
        }  
        try {
            let sqlStr = await conn.prepare(
                `DELETE FROM "CP_MATVARIANT_ITEM" WHERE LOCATION_ID = '` + adata.LOCATION_ID + `'
                                                    AND PRODUCT_ID = '` + adata.PRODUCT_ID + `'`
            )
            await sqlStr.exec();
            await sqlStr.drop();            
        } catch (error) {
            this.logger.error(error.message);
        }                
        
        let liMatVar = [];
        let lsMatVar = {};
        let lsMatVarConfig = {};


        for (let cntSO = 0; cntSO < liSales.length; cntSO++) {
            if (cntSO === 0 ||
                liSales[cntSO].SALES_DOC !== liSales[GenF.subOne(cntSO, liSales.length)].SALES_DOC ||
                liSales[cntSO].SALESDOC_ITEM !== liSales[GenF.subOne(cntSO, liSales.length)].SALESDOC_ITEM) {
                    lsMatVar = {};
                    lsMatVar['TOTAL_QTY'] = liSales[cntSO].ORD_QTY;
                    lsMatVar['FIRSTORDDATE'] = liSales[cntSO].MAT_AVAILDATE;
                    lsMatVar['LASTORDDATE'] = liSales[cntSO].MAT_AVAILDATE;
                    lsMatVar['MATVAR_TYPE'] = 'M';  // Material Variant
                    lsMatVar['ORDER_COUNT'] = 0;
                    lsMatVar['CONFIG'] = [];
            }
            lsMatVarConfig = {};
            lsMatVarConfig['CHAR_NUM'] = liSales[cntSO].CHAR_NUM;
            lsMatVarConfig['CHARVAL_NUM'] = liSales[cntSO].CHARVAL_NUM;
            lsMatVar['CONFIG'].push(lsMatVarConfig);

            if (cntSO === GenF.addOne(cntSO, liSales.length) ||
                liSales[cntSO].SALES_DOC !== liSales[GenF.addOne(cntSO, liSales.length)].SALES_DOC ||
                liSales[cntSO].SALESDOC_ITEM !== liSales[GenF.addOne(cntSO, liSales.length)].SALESDOC_ITEM) {
                    liMatVar.push(lsMatVar);
            }       
        }

        for (let cntSO = 0; cntSO < liSalesPri.length; cntSO++) {
            if (cntSO === 0 ||
                liSalesPri[cntSO].SALES_DOC !== liSalesPri[GenF.subOne(cntSO, liSalesPri.length)].SALES_DOC ||
                liSalesPri[cntSO].SALESDOC_ITEM !== liSalesPri[GenF.subOne(cntSO, liSalesPri.length)].SALESDOC_ITEM) {
                    lsMatVar = {};
                    lsMatVar['TOTAL_QTY'] = liSalesPri[cntSO].ORD_QTY;
                    lsMatVar['FIRSTORDDATE'] = liSalesPri[cntSO].MAT_AVAILDATE;
                    lsMatVar['LASTORDDATE'] = liSalesPri[cntSO].MAT_AVAILDATE;
                    lsMatVar['MATVAR_TYPE'] = 'C';  // Configurable Products
                    lsMatVar['ORDER_COUNT'] = 0;
                    lsMatVar['CONFIG'] = [];
            }
            lsMatVarConfig = {};
            lsMatVarConfig['CHAR_NUM'] = liSalesPri[cntSO].CHAR_NUM;
            lsMatVarConfig['CHARVAL_NUM'] = liSalesPri[cntSO].CHARVAL_NUM;
            lsMatVar['CONFIG'].push(lsMatVarConfig);

            if (cntSO === GenF.addOne(cntSO, liSalesPri.length) ||
                liSalesPri[cntSO].SALES_DOC !== liSalesPri[GenF.addOne(cntSO, liSalesPri.length)].SALES_DOC ||
                liSalesPri[cntSO].SALESDOC_ITEM !== liSalesPri[GenF.addOne(cntSO, liSalesPri.length)].SALESDOC_ITEM) {
                    liMatVar.push(lsMatVar);
            }       
        }

        for (let cntMV = 0; cntMV < liMatVar.length; cntMV++) {
            if(liMatVar[cntMV]['CONFIG'].length > 0){
                for (let cntMVL = cntMV +  1; cntMVL < liMatVar.length; cntMVL++) {
                    if (JSON.stringify(liMatVar[cntMV]['CONFIG']) === JSON.stringify(liMatVar[cntMVL]['CONFIG'])) {
                        liMatVar[cntMV]['TOTAL_QTY'] = parseInt(liMatVar[cntMV]['TOTAL_QTY']) + parseInt(liMatVar[cntMVL]['TOTAL_QTY']);
                        liMatVar[cntMVL]['CONFIG'] = [];
                        liMatVar[cntMVL]['TOTAL_QTY'] = 0;

                        liMatVar[cntMV]['ORDER_COUNT'] = parseInt(liMatVar[cntMV]['ORDER_COUNT']) + parseInt(1);

                        if(liMatVar[cntMV]['FIRSTORDDATE'] > liMatVar[cntMVL]['FIRSTORDDATE']){
                            liMatVar[cntMV]['FIRSTORDDATE'] = liMatVar[cntMVL]['FIRSTORDDATE'];
                        }
                        if(liMatVar[cntMV]['LASTORDDATE'] < liMatVar[cntMVL]['FIRSTORDDATE']){
                            liMatVar[cntMV]['LASTORDDATE'] = liMatVar[cntMVL]['FIRSTORDDATE'];
                        }                        
                    }
                }
            }
        }

        let lCntVariantID = 0;

        for (let cntMV = 0; cntMV < liMatVar.length; cntMV++) {
            if(liMatVar[cntMV]['CONFIG'].length > 0){
                lCntVariantID = parseInt(lCntVariantID) +  parseInt(1);
                liMatVar[cntMV]['MATVARID'] = lCntVariantID;
                try {
                    let sqlStr = conn.prepare(
                        `INSERT INTO "CP_MATVARIANT_HEADER" VALUES(
                            '` + liMatVar[cntMV].MATVARID + `',
                            '` + adata.LOCATION_ID + `',
                            '` + adata.PRODUCT_ID + `',
                            '` + liMatVar[cntMV].ORDER_COUNT + `',
                            '` + liMatVar[cntMV].MATVAR_TYPE + `',
                            '',
                            '` + liMatVar[cntMV].TOTAL_QTY + `',
                            '` + liMatVar[cntMV].FIRSTORDDATE + `',
                            '` + liMatVar[cntMV].LASTORDDATE + `',
                            TRUE)`
                    )

                    sqlStr.exec();
                    sqlStr.drop();            
                } catch (error) {
                    this.logger.error(error.message);
                }
                
                for (let cntMVC = 0; cntMVC < liMatVar[cntMV]['CONFIG'].length; cntMVC++) {
                    let sqlStr = conn.prepare(
                        `INSERT INTO "CP_MATVARIANT_ITEM" VALUES(
                            '` + liMatVar[cntMV].MATVARID + `',                            
                            '` + adata.LOCATION_ID + `',
                            '` + adata.PRODUCT_ID + `',
                            '` + liMatVar[cntMV]['CONFIG'][cntMVC].CHAR_NUM + `',
                            '` + liMatVar[cntMV]['CONFIG'][cntMVC].CHARVAL_NUM + `')`
                    )
                    sqlStr.exec();
                    sqlStr.drop();                    
                }
            }
        }

    }
}

module.exports = SOFunctions;