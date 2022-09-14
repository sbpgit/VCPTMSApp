const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

class AssemblyReq {
    /**
     * Constructor
     */
    constructor() { }
    async genAsmreq(adata){

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
        const liCIR = await cds.run(`
            SELECT * 
            FROM CP_CIR_GENERATED
            WHERE PRODUCT_ID IN ( SELECT PRODUCT_ID 
                                  FROM CP_PARTIALPROD_INTRO 
                                  WHERE REF_PRODID    = '${adata.PRODUCT_ID}'
                                  AND LOCATION_ID   = '${adata.LOCATION_ID}' )
        `);

        const liODChar = await cds.run(
            `SELECT DISTINCT COMPONENT,
                            OBJ_DEP,
                            OBJ_COUNTER,
                            CHAR_NUM,
                            CHARVAL_NUM,
                            OD_CONDITION,
                            CHAR_COUNTER
            FROM "V_OBDHDR"
            WHERE LOCATION_ID = '` + adata.LOCATION_ID + `'
                AND PRODUCT_ID  = '` + lMainProduct + `'
                ORDER BY OBJ_DEP,
                         OBJ_COUNTER,
                         CHAR_COUNTER`
        ); 

    }

}