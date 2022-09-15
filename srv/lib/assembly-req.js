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
            FROM V_CIRUNIQUECHAR
            WHERE PRODUCT_ID IN ( SELECT PRODUCT_ID 
                                  FROM CP_PARTIALPROD_INTRO 
                                  WHERE REF_PRODID    = '${adata.PRODUCT_ID}'
                                  AND LOCATION_ID   = '${adata.LOCATION_ID}' )
                OR
                PRODUCT_ID = '${adata.PRODUCT_ID}'
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
                AND PRODUCT_ID  = '` + adata.PRODUCT_ID + `'
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
                    lsOD['CHAR'] = [];
                    lRowID = 0;
            }
            let lsODC = {};
            lsODC['CHAR_COUNTER'] = GenF.parse(liODChar[cntODC].CHAR_COUNTER);
            lsODC['CHAR_NUM'] = GenF.parse(liODChar[cntODC].CHAR_NUM);
            lsODC['CHARVAL_NUM'] = GenF.parse(liODChar[cntODC].CHARVAL_NUM);
            lsODC['OD_CONDITION'] = GenF.parse(liODChar[cntODC].OD_CONDITION);

// Check if Characteristic already assigne a Row ID. If not, check for the highest number and add one            
            for (let cntC = 0; cntC < lsOD['CHAR'].length; cntC++) {
                if(lsOD['CHAR'][cntC].CHAR_NUM === liODChar[cntODC].CHAR_NUM){
                    lRowID = parseInt(lsOD['CHAR'][cntC].ROW_ID);
                    break;
                }
                if(parseInt(lsOD['CHAR'][cntC].ROW_ID) > lRowID){
                    lRowID = parseInt(lsOD['CHAR'][cntC].ROW_ID)
                }
                if(GenF.addOne(cntC) === lsOD['CHAR'].length)
                {
                    lRowID  = parseInt( lRowID ) + 1;
                }
            }

            lsODC['ROW_ID'] = lRowID;
            lsOD['CHAR'].push(lsODC);

            if(cntODC == GenF.addOne(cntODC, liODChar.length) ||
                liODChar[cntODC].OBJ_DEP !== liODChar[GenF.addOne(cntODC, liODChar.length)].OBJ_DEP ||
                liODChar[cntODC].OBJ_COUNTER !== liODChar[GenF.addOne(cntODC, liODChar.length)].OBJ_COUNTER) {
                    liOD.push(lsOD);
            }
        }        

        for( let iCir = 0 ; iCir < liCIR.length ; iCir++){
            let liODTemp = GenF.parse(liOD);

        }
    }

}