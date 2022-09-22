const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const GenF = require("./gen-functions");

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
        const liCIRData = await cds.run(`
            SELECT * 
              FROM V_CIRUNIQUECHAR
             WHERE LOCATION_ID   = '${adata.LOCATION_ID}'
               AND (PRODUCT_ID IN ( SELECT PRODUCT_ID 
                                  FROM CP_PARTIALPROD_INTRO 
                                  WHERE REF_PRODID    = '${adata.PRODUCT_ID}'
                                  AND LOCATION_ID   = '${adata.LOCATION_ID}' )
                OR PRODUCT_ID = '${adata.PRODUCT_ID}')
                ORDER BY LOCATION_ID,
                         PRODUCT_ID,
                         WEEK_DATE, 
                         CIR_ID, 
                         MODEL_VERSION,
                         VERSION, 
                         SCENARIO, 
                         METHOD,
                         UNIQUE_ID, 
                         CIR_QTY
        `);

        let liCIR = [];
        let lsCIR = {};
        let liChar = [];
        let lsChar = {};

        for (let cntCIR = 0; cntCIR < liCIRData.length; cntCIR++) {
            
            lsChar = {};
            lsChar.CHAR_NUM     = liCIRData[cntCIR].CHAR_NUM;
            lsChar.CHARVAL_NUM  = liCIRData[cntCIR].CHARVAL_NUM;
            liChar.push(lsChar);

            if(cntCIR === GenF.addOne(cntCIR, liCIRData.length) ||
            liCIRData[cntCIR].LOCATION_ID !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].LOCATION_ID || 
            liCIRData[cntCIR].PRODUCT_ID !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].PRODUCT_ID ||
            liCIRData[cntCIR].WEEK_DATE !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].WEEK_DATE ||
            liCIRData[cntCIR].CIR_ID !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].CIR_ID ||
            liCIRData[cntCIR].MODEL_VERSION !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].MODEL_VERSION ||
            liCIRData[cntCIR].VERSION !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].VERSION ||
            liCIRData[cntCIR].SCENARIO !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].SCENARIO ||
            liCIRData[cntCIR].METHOD !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].METHOD ||
            liCIRData[cntCIR].UNIQUE_ID !== liCIRData[GenF.addOne(cntCIR,liCIRData.length)].UNIQUE_ID){
                lsCIR = {};
                lsCIR.LOCATION_ID   = GenF.parse(liCIRData[cntCIR].LOCATION_ID);
                lsCIR.PRODUCT_ID    = GenF.parse(liCIRData[cntCIR].PRODUCT_ID);
                lsCIR.WEEK_DATE     = GenF.parse(liCIRData[cntCIR].WEEK_DATE);
                lsCIR.CIR_ID        = GenF.parse(liCIRData[cntCIR].CIR_ID);
                lsCIR.MODEL_VERSION = GenF.parse(liCIRData[cntCIR].MODEL_VERSION);
                lsCIR.VERSION       = GenF.parse(liCIRData[cntCIR].VERSION);
                lsCIR.SCENARIO      = GenF.parse(liCIRData[cntCIR].SCENARIO);
                lsCIR.METHOD        = GenF.parse(liCIRData[cntCIR].METHO);
                lsCIR.UNIQUE_ID     = GenF.parse(liCIRData[cntCIR].UNIQUE_ID);
                lsCIR.CIR_QTY       = GenF.parse(liCIRData[cntCIR].CIR_QTY);
                lsCIR.CHAR          = GenF.parse(liChar);
                liCIR.push(lsCIR);

                liChar = [];
            }

        }        

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
                ORDER BY COMPONENT,
                         OBJ_DEP,
                         OBJ_COUNTER,
                         CHAR_COUNTER`
        ); 
        
        let liComponent = [];
        let lsComponent = {};

        for (let cntOD = 0; cntOD < liODChar.length; cntOD++) {
            if(cntOD === 0 || 
                liODChar[cntOD].COMPONENT !== liODChar[GenF.subOne(cntOD)].COMPONENT){
                    lsComponent.COMPONENT = GenF.parse(GenF.parse(liODChar[cntOD].COMPONENT));
                    lsComponent.OD = [];
                }

                if(cntOD === 0 || 
                    liODChar[cntOD].COMPONENT !== liODChar[GenF.subOne(cntOD)].COMPONENT ||
                    liODChar[cntOD].OBJ_DEP !== liODChar[GenF.subOne(cntOD)].OBJ_DEP){
                        let lsOD = {};
                        lsOD.OBJ_DEP = GenF.parse(liODChar[cntOD].OBJ_DEP);
                        lsOD.COUNTER = [];
                    }   
                    
                    
                    if(cntOD === 0 || 
                        liODChar[cntOD].COMPONENT !== liODChar[GenF.subOne(cntOD)].COMPONENT ||
                        liODChar[cntOD].OBJ_DEP !== liODChar[GenF.subOne(cntOD)].OBJ_DEP ||
                        liODChar[cntOD].OBJ_COUNTER !== liODChar[GenF.subOne(cntOD)].OBJ_COUNTER ){
                            let lsODCount = {};
                            lsODCount.OBJ_COUNTER = GenF.parse(liODChar[cntOD].OBJ_COUNTER);
                            lsODCount.CHAR = [];
                        }                       
                            let lsChar = {};
                            let lsODCount = {};
                            lsODCount.CHAR = [];
                            lsChar.CHAR_NUM     = GenF.parse(liODChar[cntOD].CHAR_NUM);
                            lsChar.CHARVAL_NUM  = GenF.parse(liODChar[cntOD].CHARVAL_NUM);
                            lsChar.OD_CONDITION = GenF.parse(liODChar[cntOD].OD_CONDITION);
                            lsChar.CHAR_COUNTER = GenF.parse(liODChar[cntOD].CHAR_COUNTER);
                            lsODCount.CHAR.push(lsChar);
                    let lsOD = {};
                    if(cntOD === GenF.addOne(cntOD, liODChar.length) || 
                        liODChar[cntOD].COMPONENT !== liODChar[GenF.addOne(cntOD, liODChar.length)].COMPONENT ||
                        liODChar[cntOD].OBJ_DEP !== liODChar[GenF.addOne(cntOD)].OBJ_DEP ||
                        liODChar[cntOD].OBJ_COUNTER !== liODChar[GenF.addOne(cntOD)].OBJ_COUNTER ){

                            lsOD.COUNTER.push(lsODCount);    
                    }

                if(cntOD === GenF.addOne(cntOD, liODChar.length) || 
                    liODChar[cntOD].COMPONENT !== liODChar[GenF.addOne(cntOD, liODChar.length)].COMPONENT ||
                    liODChar[cntOD].OBJ_DEP !== liODChar[GenF.addOne(cntOD)].OBJ_DEP  ){

                        lsComponent.OD.push(lsOD);    
                }


            if(cntOD === GenF.addOne(cntOD, liODChar.length) || 
                liODChar[cntOD].COMPONENT !== liODChar[GenF.addOne(cntOD, liODChar.length)].COMPONENT){
                    
                    liComponent.push(lsComponent);
                    lsComponent = {};

                }
            
        }

        
        let lFail = '';

        for (let cntC = 0; cntC < liComponent.length; cntC++) {
            const lsComponent = liComponent[cntC];

            for (let cntCIR = 0; cntCIR < liCIR.length; cntCIR++) {
                const element = liCIR[cntCIR];


                for (let cntOD = 0; cntOD < lsComponent.OD.length; cntOD++) {
                    const lsOD = lsComponent.OD[cntOD];
                    

                    for (let cntODC = 0; cntODC < lsOD.COUNTER.length; cntODC++) {
                        const lsCounter = lsOD.COUNTER[cntODC];
                        lFail = '';

                        for (let cntCh = 0; cntCh < lsCounter.CHAR.length; cntCh++) {
                            const lsODChar = lsCounter.CHAR[cntCh];
                            lFail = '';
                            let lCharCounter = 0;
                            for (let cntCh = 0; cntCh < liCIR[cntCIR].CHAR.length; cntCh++) {
                                const lsCIRChar = liCIR[cntCIR].CHAR[cntCh];
                                if (lsCIRChar.CHAR_NUM === lsODChar.CHAR_NUM) {
                                    if((lsCIRChar.OD_CONDITION === 'EQ' &&
                                        lsCIRChar.CHARVAL_NUM === lsODChar.CHARVAL_NUM) || 
                                       (lsCIRChar.OD_CONDITION === 'NE' &&
                                        lsCIRChar.CHARVAL_NUM !== lsODChar.CHARVAL_NUM)){
                                            //Success Counter
                                            lCharCounter = lsCounter.CHAR[cntCh].CHAR_COUNTER;
                                        }
                                        else{
                                            //Check if there was a success for this counter
                                            if(lsCounter.CHAR[cntCh].CHAR_COUNTER !== lsCounter.CHAR[cntCh].CHAR_COUNTER){ 
                                                //Check if there are any other conditions for this counter
                                            if(cntCh === GenF.addOne(cntCh,lsCounter.CHAR.length) ||
                                              lsCounter.CHAR[cntCh].CHAR_COUNTER !== lsCounter.CHAR[GenF.addOne(cntCh,lsCounter.CHAR.length)].CHAR_COUNTER){
                                                  lFail = 'X';
                                              }
                                            }
                                        }
                                }
                            }
                            if(lFail === 'X'){
                                break;
                            }
                        }
                        if(lFail === 'X' &&
                        cntODC === GenF.addOne(cntODC, lsOD.COUNTER.length)){
                            break;
                        } 
                    }
                    if(lFail === 'X' &&
                    cntOD === GenF.addOne(cntOD, lsComponent.OD.length)){
                        break;
                    } 
                }

                if(lFail === ''){

                }
                
            }
            
        }


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
module.exports = AssemblyReq;