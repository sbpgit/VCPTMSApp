const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format; VarConfig

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
class VarConfig {
    constructor() {

        conn.connect(conn_params_container);
        try {
            conn.prepare("SET SCHEMA " + containerSchema).exec();
        } catch (error) {
            this.logger.error(error);
        }
    }

    async genVarConfig(adata) {
        let ls_valc = {};
        let it_valc = [];
        // Get internal number of variant table data
        const li_valc = await cds.run(
            `SELECT *
     FROM CP_CUVTAB_VALC
    WHERE 
     AND ATINN = '` + adata.CHAR_NUM + `'
     AND VALC = '` + adata.CHAR_NAME + `'`);
        //  vtint IN li_vtint
        for (let i = 0; i < li_valc.length; i++) {
            this.get_ind(li_valc[i], it_valc);
            li_valcop.sort(GenFunctions.dynamicSortMultiple("ATINN", "VALC"));

            // DELETE ADJACENT DUPLICATES FROM it_valc COMPARING atinn valc.
        }
    }
    async get_ind(im_valc, it_valc) {
        let ls_valc1 = {};
        const ls_ind = await cds.run(` SELECT TOP 1 *
        FROM CP_CUVTAB_IND
        INTO LS_IND
       WHERE VTINT = '` + im_valc.VTINT + `'
        AND ATINN = '` + im_valc.ATINN + `'`);
        if (ls_ind[VTINT].length <= 0) {
            // * GET THE INFERRED PARAMETERS
            const li_ind = await cds.run(`SELECT *
          FROM CUVTAB_IND
         WHERE VTINT = '` + im_valc.VTINT + `'`);
            if (li_ind.length > 0) {
                for (let iInd = 0; li_ind.length > 0; iInd++) {
                    // * GET VALC DATA BASED ON SLNID AND ATINN
                    const li_valc_temp = await cds.run(`SELECT *
                                                          FROM CP_CUVTAB_VALC
                                                          WHERE SLNID '` + im_valc.SLNID + `'
                                                            AND ATINN '` + li_ind[iInd].ATINN + `'`);
                    
                    if (li_valc_temp.length > 0) {
                        li_valc_temp.sort(GenFunctions.dynamicSortMultiple("ATINN", "VALC"));
                        for(let i = 0 ; i < li_valc_temp.length ; i++){
                            try {
                                let sqlStr = await conn.prepare(
                                    `INSERT INTO "CP_CUVTAB_VALC_TEMP" VALUES(
                                        '` + li_valc_temp[i].VTINT + `',
                                        '` + li_valc_temp[i].SLNID + `',
                                        '` + li_valc_temp[i].ATINN + `',
                                        '` + li_valc_temp[i].VLCNT + `',
                                        '` + li_valc_temp[i].VALC + `')`
                                )
                                await sqlStr.exec();
                                await sqlStr.drop();                      
            
                            } catch (error) {
                                console.log(error.message);
                            }
                        }
                        // * DELETE DUPLICATES FROM li_valc_temp
                        //////  //   DELETE ADJACENT DUPLICATES FROM li_valc_temp COMPARING ATINN VALC.
                        // * GET DATA FROM CUVTAB_VALC TABLE
                        const li_valc = await cds.run(`SELECT *
                                                         FROM CP_CUVTAB_VALC AS A
                                                        WHERE ( A.ATINN , A.VALC ) IN (SELECT ATINN, VALC FROM CP_CUVTAB_VALC_TEMP ) `);
                        if (li_valc.length > 0) {
                            try {
                                let sqlStr = await conn.prepare(
                                    `DELETE FROM CP_CUVTAB_VALC_TEMP`
                                )
                                await sqlStr.exec();
                                await sqlStr.drop();                      
            
                            } catch (error) {
                                console.log(error.message);
                            }
                            l_not_final = '';
                            for (let iValc = 0; li_valc.length > 0; iValc++) {
                                // * GET DATA FROM CUVTAB_IND BASED ON VTINT AND ATINN
                                const li_ind_temp = await cds.run(`SELECT *
                                                                    FROM CP_CUVTAB_IND
                                                                   WHERE VTINT = '` + li_valc[iValc].VTINT + `'
                                                                     AND ATINN = '` + li_valc[iValc].ATINN + `'`);
                                // * IF DATA NOT FOUND
                                if (li_ind_temp.length <= 0) {
                                    // * ENABLE FLAG
                                    l_not_final = 'X';
                                    // * AGAIN PERFORM GET_ID
                                    this.get_ind(li_valc[iValc], it_valc);
                                }                                                      //li_ind_temp.length <= 0
                            }                                                      // "LOOP FOR LI_VALC TABLE
                            if (l_not_final !== 'X') {
                                for (let iValc2 = 0; li_valc.length > 0; iValc2++) {
                                    // *  FILL FINAL DATA
                                    ls_valc1.ATINN = li_valc[iValc2].ATINN;
                                    ls_valc1.VALC = li_valc[iValc2].VALC;
                                    it_valc.push(ls_valc1);
                                    ls_valc1 = {};
                                }  //                                                  "LOOP FOR LI_VALC TABLE
                            }//ENDIF.                                                          "IF L_NOT_FINAL = ' '
                        } //ENDIF.                                                            "IF SY-SUBRC EQ 0
                    } //ENDIF.                                                              "IF SY-SUBRC EQ 0
                }//ENDLOOP.                                                              "LOOP FOR LI_IND TABLE
            }// ENDIF.                                                                  "IF SY-SUBRC EQ 0
        }//   ENDIF.       


    }

    async sortArray(lpValc) {

    }



}

module.exports = VarConfig;