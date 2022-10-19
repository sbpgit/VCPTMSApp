const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");

class CIRData {
    constructor() { }

    /**
     * Get CIR Data Weekly
     */
    async getCIRData(req) {
        console.log("Started CIR Service");
        let vDateFrom = req.data.FROMDATE; //"2022-03-04";
        let vDateTo = req.data.TODATE; //"2023-01-03";
        let oEntry = {};
        //const liUniqueId = [];
        const liCIRQty = await cds.run(
            `
            SELECT * 
            FROM "CP_CIR_GENERATED" 
            inner join "CP_PARTIALPROD_INTRO"
            ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_PARTIALPROD_INTRO"."PRODUCT_ID"
            AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_PARTIALPROD_INTRO"."LOCATION_ID"
            WHERE  "CP_CIR_GENERATED"."LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
                 AND  "CP_PARTIALPROD_INTRO"."REF_PRODID" = '` +
            req.data.PRODUCT_ID +
            `' AND  "CP_CIR_GENERATED"."VERSION" = '` +
            req.data.VERSION +
            `' AND  "CP_CIR_GENERATED"."SCENARIO" = '` +
            req.data.SCENARIO +
            `' AND (  "CP_CIR_GENERATED"."WEEK_DATE" <= '` +
            vDateTo +
            `' AND  "CP_CIR_GENERATED"."WEEK_DATE" >= '` +
            vDateFrom +
            `') AND  "CP_CIR_GENERATED"."MODEL_VERSION" = '` +
            req.data.MODEL_VERSION +
            `'
                 ORDER BY 
                 "CP_CIR_GENERATED"."LOCATION_ID" ASC, 
                 "CP_CIR_GENERATED"."PRODUCT_ID" ASC,
                 "CP_CIR_GENERATED"."VERSION" ASC,
                 "CP_CIR_GENERATED"."SCENARIO" ASC,
                 "CP_CIR_GENERATED"."WEEK_DATE" ASC`
        );

       try {
        const liUniqueId = await cds.run(
          `
          SELECT DISTINCT 
          "CP_CIR_GENERATED"."LOCATION_ID", 
          "CP_CIR_GENERATED"."PRODUCT_ID",                                             
          "CP_CIR_GENERATED"."VERSION",
          "CP_CIR_GENERATED"."SCENARIO",
          "CP_CIR_GENERATED"."UNIQUE_ID",
          "CP_UNIQUE_ID_HEADER"."UNIQUE_DESC"
                          FROM "CP_CIR_GENERATED" 
                          inner join "CP_UNIQUE_ID_HEADER"
                          ON "CP_CIR_GENERATED"."UNIQUE_ID" = "CP_UNIQUE_ID_HEADER"."UNIQUE_ID"
                          inner join "CP_PARTIALPROD_INTRO"
                          ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_PARTIALPROD_INTRO"."PRODUCT_ID"
                          AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_PARTIALPROD_INTRO"."LOCATION_ID"
                          WHERE  "CP_CIR_GENERATED"."LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `' AND  "CP_PARTIALPROD_INTRO"."REF_PRODID" = '` +
            req.data.PRODUCT_ID +
            `' AND  "CP_CIR_GENERATED"."VERSION" = '` +
            req.data.VERSION +
            `' AND  "CP_CIR_GENERATED"."SCENARIO" = '` +
            req.data.SCENARIO +
            `' AND (  "CP_CIR_GENERATED"."WEEK_DATE" <= '` +
            vDateTo +
            `' AND  "CP_CIR_GENERATED"."WEEK_DATE" >= '` +
            vDateFrom +
            `') AND  "CP_CIR_GENERATED"."MODEL_VERSION" = '` +
            req.data.MODEL_VERSION +
            `'
                               ORDER BY 
                               "CP_CIR_GENERATED"."LOCATION_ID" ASC, 
                               "CP_CIR_GENERATED"."PRODUCT_ID" ASC,
                               "CP_CIR_GENERATED"."VERSION" ASC,
                               "CP_CIR_GENERATED"."SCENARIO" ASC,
                               "CP_CIR_GENERATED"."UNIQUE_ID" ASC`
        );
        oEntry.liUniqueId = liUniqueId;
       }
       catch(e) {
           console.log(e);
       }
        oEntry.liCIRQty = liCIRQty;        

        return oEntry;
    }
    /**
     * Get Unique Id Characteristics
     */
    async getUniqueIdCharacteristics(req) {
        const li_uniqueIdItem = await cds.run(
            `SELECT *
            FROM "V_UNIQUE_ID_ITEM"
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
            AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `'`
        );

        return li_uniqueIdItem;
    }
    /**
     * Get Restriction Items Details
     */
    async getRestrictDetails(req) {
        const li_uniqueIdItem = await cds.run(
            `SELECT *
            FROM "CP_RESTRICT_DETAILS"
            WHERE "LOCATION_ID" = '` +
            req.data.LOCATION_ID +
            `'
            AND "PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `'`
        );

        return li_uniqueIdItem;
    }

}

module.exports = CIRData;
