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

        for (let cntMV = 0; cntMV < liMatVar.length; cntMV++) {
            
            for (let cntMVL = cntMV +  1; cntMVL < liMatVar.length; cntMVL++) {
                if (liMatVar[cntMV]['CONFIG'] === liMatVar[cntMVL]['CONFIG']) {
                    liMatVar[cntMV]['TOTAL_QTY'] = liMatVar[cntMV]['TOTAL_QTY'] + liMatVar[cntMVL]['TOTAL_QTY'];
                    liMatVar[cntMVL]['CONFIG'] = [];
                    liMatVar[cntMVL]['TOTAL_QTY'] = 0;
                }
            }
        }

        let lCnt = 0;
        for (let cntMV = 0; cntMV < liMatVar.length; cntMV++) {
            if(liMatVar[cntMV]['CONFIG'] !== []){
                lCnt = lCnt + 1;
            }
        }

        console.log(liMatVar);
        console.log(liMatVar.length);        

        console.log(lCnt);
    }
}

module.exports = SOFunctions;