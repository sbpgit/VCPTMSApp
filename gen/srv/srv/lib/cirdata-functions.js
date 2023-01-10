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
        let aPlanningLoc = [];
        let aFilterLoc = [];

        // Selected Demand / Planned Locations
        if (req.data.PLANNING_LOC !== undefined) {
            aPlanningLoc = JSON.parse(req.data.PLANNING_LOC);
        }

        try {
            const liCIRQty = await cds.run(
                `SELECT *            
                   FROM "CP_CIR_GENERATED"             
                  INNER JOIN "CP_FACTORY_SALESLOC"
                     ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_FACTORY_SALESLOC"."PRODUCT_ID"
                    AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_FACTORY_SALESLOC"."PLAN_LOC"
             INNER JOIN "CP_PARTIALPROD_INTRO"
                     ON "CP_PARTIALPROD_INTRO"."PRODUCT_ID"  = "CP_CIR_GENERATED"."PRODUCT_ID"
                    AND "CP_PARTIALPROD_INTRO"."LOCATION_ID" = "CP_CIR_GENERATED"."LOCATION_ID"
                  WHERE "CP_FACTORY_SALESLOC"."FACTORY_LOC" = '${req.data.LOCATION_ID}'
                    AND  "CP_PARTIALPROD_INTRO"."PRODUCT_ID" IN (
                        SELECT DISTINCT "PRODUCT_ID"
                          FROM "CP_PARTIALPROD_INTRO"
                        WHERE "LOCATION_ID" = '${req.data.LOCATION_ID}' 
                          AND ("PRODUCT_ID" = '${req.data.PRODUCT_ID}'
                                OR "REF_PRODID" = '${req.data.PRODUCT_ID}')
                          )
                  AND  "CP_CIR_GENERATED"."VERSION" = '${req.data.VERSION}' 
                  AND  "CP_CIR_GENERATED"."SCENARIO" = '${req.data.SCENARIO}' 
                  AND ("CP_CIR_GENERATED"."WEEK_DATE" <= '${vDateTo}' 
                  AND  "CP_CIR_GENERATED"."WEEK_DATE" >= '${vDateFrom}') 
                  AND  "CP_CIR_GENERATED"."MODEL_VERSION" = '${req.data.MODEL_VERSION}'
             ORDER BY 
                     "CP_CIR_GENERATED"."LOCATION_ID" ASC, 
                     "CP_CIR_GENERATED"."PRODUCT_ID" ASC,
                     "CP_CIR_GENERATED"."VERSION" ASC,
                     "CP_CIR_GENERATED"."SCENARIO" ASC,
                     "CP_CIR_GENERATED"."WEEK_DATE" ASC`
            );
            oEntry.liCIRQty = liCIRQty;
        } catch (e) {
            console.log(e);
        }

        try {
            const liUniqueId = await cds.run(
                ` SELECT DISTINCT 
                      "CP_CIR_GENERATED"."LOCATION_ID", 
                      "CP_CIR_GENERATED"."PRODUCT_ID",
                      "CP_CIR_GENERATED"."VERSION",
                      "CP_CIR_GENERATED"."SCENARIO",
                      "CP_CIR_GENERATED"."UNIQUE_ID",          
                      "CP_UNIQUE_ID_HEADER"."UNIQUE_DESC",
                      "CP_PARTIALPROD_INTRO"."PROD_DESC",
                      "CP_FACTORY_SALESLOC"."LOCATION_ID" AS "DEMAND_LOC",
                      "CP_FACTORY_SALESLOC"."PLAN_LOC" AS "PLANNED_LOC"          
                                      FROM "CP_CIR_GENERATED" 
                                      inner join "CP_FACTORY_SALESLOC"
                                      ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_FACTORY_SALESLOC"."PRODUCT_ID"
                                      AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_FACTORY_SALESLOC"."PLAN_LOC"
                                      inner join "CP_UNIQUE_ID_HEADER"
                                      ON "CP_CIR_GENERATED"."UNIQUE_ID" = "CP_UNIQUE_ID_HEADER"."UNIQUE_ID"
                                      AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_UNIQUE_ID_HEADER"."LOCATION_ID"
                                      inner join "CP_PARTIALPROD_INTRO"
                                      ON "CP_CIR_GENERATED"."PRODUCT_ID" = "CP_PARTIALPROD_INTRO"."PRODUCT_ID"
                                      AND "CP_CIR_GENERATED"."LOCATION_ID" = "CP_PARTIALPROD_INTRO"."LOCATION_ID"
                                      WHERE "CP_FACTORY_SALESLOC"."FACTORY_LOC" = '${req.data.LOCATION_ID}'
                                        AND "CP_PARTIALPROD_INTRO"."PRODUCT_ID" IN (
                                                SELECT DISTINCT "PRODUCT_ID"
                                                  FROM "CP_PARTIALPROD_INTRO"
                                                 WHERE "LOCATION_ID" = '${req.data.LOCATION_ID}' 
                                                   AND ("PRODUCT_ID" = '${req.data.PRODUCT_ID}'
                                                    OR "REF_PRODID" = '${req.data.PRODUCT_ID}')
                                                ) 
                                        AND "CP_CIR_GENERATED"."VERSION" = '${req.data.VERSION}'
                                        AND "CP_CIR_GENERATED"."SCENARIO" = '${req.data.SCENARIO}' 
                                        AND ("CP_CIR_GENERATED"."WEEK_DATE" <= '${vDateTo}' 
                                        AND "CP_CIR_GENERATED"."WEEK_DATE" >= '${vDateFrom}') 
                                        AND "CP_CIR_GENERATED"."MODEL_VERSION" = '${req.data.MODEL_VERSION}'
                                   ORDER BY 
                                           "CP_CIR_GENERATED"."LOCATION_ID" ASC, 
                                           "CP_CIR_GENERATED"."PRODUCT_ID" ASC,
                                           "CP_CIR_GENERATED"."VERSION" ASC,
                                           "CP_CIR_GENERATED"."SCENARIO" ASC,
                                           "CP_CIR_GENERATED"."UNIQUE_ID" ASC`
            );


            oEntry.liUniqueId = liUniqueId;
            if (aPlanningLoc.length > 0) {
                //Filter by Selected Demand / Planning Location
                // Filter array of objects based on another array of objects
                oEntry.liUniqueId = liUniqueId.filter((el) => {
                    return aPlanningLoc.some((f) => {
                        return f.DEMAND_LOC === el.DEMAND_LOC && f.PLANNING_LOC === el.PLANNED_LOC;
                    });
                });
            }
        }
        catch (e) {
            console.log(e);
        }

        // Get Actual Sales Orders Quantity
        try {
            const li_salesh = await cds.run(
                `SELECT *
                   FROM "V_SALES_H"
                  WHERE "FACTORY_LOC" = '${req.data.LOCATION_ID}'
                    AND "PRODUCT_ID"  = '${req.data.PRODUCT_ID}'  
                    AND "MAT_AVAILDATE"  >= '${vDateFrom}'
                    AND "MAT_AVAILDATE"  <= '${vDateTo}'`
            );
            oEntry.liSalesH = li_salesh;
            if (aPlanningLoc.length > 0) {
                //Filter by Selected Demand / Planning Location
                // Filter array of objects based on another array of objects
                oEntry.liSalesH = li_salesh.filter((el) => {
                    return aPlanningLoc.some((f) => {
                        return f.DEMAND_LOC === el.SALE_LOCATION && f.PLANNING_LOC === el.PLAN_LOC;
                    });
                });
            }

        } catch (e) {
            console.log(e);
        }

        // oEntry.liCIRQty = liCIRQty;

        return oEntry;
    }
    /**
     * Get Unique Id Characteristics
     */
    async getUniqueIdCharacteristics(req) {
        // const li_uniqueIdItem = await cds.run(
        //     `SELECT *
        //     FROM "V_UNIQUE_ID_ITEM"
        //     WHERE "LOCATION_ID" = '` +
        //     req.data.LOCATION_ID +
        //     `'
        //     AND "PRODUCT_ID" = '` +
        //     req.data.PRODUCT_ID +
        //     `'`
        // );
        const li_uniqueIdItem = await cds.run(
            // `SELECT *
            //     FROM "CP_SALES_HM"
            //     INNER JOIN "V_UNIQUE_ID_ITEM"
            //     ON "CP_SALES_HM"."UNIQUE_ID" = "V_UNIQUE_ID_ITEM"."UNIQUE_ID"
            //     AND "CP_SALES_HM"."LOCATION_ID" = "V_UNIQUE_ID_ITEM"."LOCATION_ID"
            //     WHERE "CP_SALES_HM"."LOCATION_ID" = '`
            //        + req.data.LOCATION_ID + `'
            //     AND "CP_SALES_HM"."PRODUCT_ID" = '` 
            //        + req.data.PRODUCT_ID +
            //    `'`

            `SELECT *
               FROM "V_UNIQUE_ID_ITEM"
               WHERE UNIQUE_ID IN ( SELECT DISTINCT "UNIQUE_ID"
                                               FROM "CP_SALES_HM"
                                               WHERE "LOCATION_ID" = '${req.data.LOCATION_ID}'
                                                 AND "PRODUCT_ID" = '${req.data.PRODUCT_ID}' )`

        );
        return li_uniqueIdItem;
    }

    /**
     * Get Distinct Unique Ids 
     */
    async getDistinctUniqueIds(req) {
        // const li_uniqueId = await cds.run(
        //     `SELECT DISTINCT "UNIQUE_ID", "UNIQUE_DESC"
        //     FROM "V_UNIQUE_ID_ITEM"
        //     WHERE "LOCATION_ID" = '` +
        //     req.data.LOCATION_ID +
        //     `'
        //     AND "PRODUCT_ID" = '` +
        //     req.data.PRODUCT_ID +
        //     `'`
        // );

        const li_uniqueId = await cds.run(
            `SELECT DISTINCT 
            "CP_SALES_HM"."UNIQUE_ID",
            "V_UNIQUE_ID_ITEM"."UNIQUE_DESC"
            FROM "CP_SALES_HM"
            INNER JOIN "V_UNIQUE_ID_ITEM"
            ON "CP_SALES_HM"."UNIQUE_ID" = "V_UNIQUE_ID_ITEM"."UNIQUE_ID"
            AND "CP_SALES_HM"."LOCATION_ID" = "V_UNIQUE_ID_ITEM"."LOCATION_ID"
                WHERE "CP_SALES_HM"."LOCATION_ID" = '`
            + req.data.LOCATION_ID + `'
                AND "CP_SALES_HM"."PRODUCT_ID" = '` +
            req.data.PRODUCT_ID +
            `'`
        );

        return li_uniqueId;
    }
    /**
     * Get Primary & Secondary Characteristics
     */
    async getVarcharPS(req) {
        const li_varchar_ps = await cds.run(
            `SELECT DISTINCT *
               FROM "CP_VARCHAR_PS"
              INNER JOIN "CP_PARTIALPROD_INTRO"
                 ON "CP_VARCHAR_PS"."PRODUCT_ID"  = "CP_PARTIALPROD_INTRO"."REF_PRODID"
              WHERE "CP_PARTIALPROD_INTRO"."PRODUCT_ID" = '` + req.data.PRODUCT_ID + `'`
        );

        return li_varchar_ps;
    }


    // /**
    //  * Get Auth Token
    //  */
    //  async getCFAuthToken() {
    //     const request = require('request');
    //     const rp = require('request-promise');
    //     const cfenv = require('cfenv');

    //     /*********************************************************************
    //      *************** Step 1: Read the environment variables ***************
    //      *********************************************************************/
    //     const oServices = cfenv.getAppEnv().getServices();
    //     const uaa_service = cfenv.getAppEnv().getService('config_products-xsuaa-service');
    //     const dest_service = cfenv.getAppEnv().getService('config_products-destination-service');
    //     const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

    //     const sDestinationName = 'S4D_HTTP';
    //     const sEndpoint = '/secure/';

    //     /*********************************************************************
    //      **** Step 2: Request a JWT token to access the destination service ***
    //      *********************************************************************/
    //     const post_options = {
    //         url: uaa_service.credentials.url + '/oauth/token',
    //         method: 'POST',
    //         headers: {
    //             'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
    //             'Content-type': 'application/x-www-form-urlencoded'
    //         },
    //         form: {
    //             'client_id': dest_service.credentials.clientid,
    //             'grant_type': 'client_credentials'
    //         }
    //     }

    //     let ret_response = "";
    //     await rp(post_options)
    //         .then(function (response) {
    //             console.log('Get Token - Success');
    //             let sToken = JSON.parse(response).access_token;
    //             ret_response = getCFDestUser(sToken);

    //         })
    //         .catch(function (error) {
    //             console.log('Get Token - Error ', error);
    //             ret_response = JSON.parse(error);
    //         });

    //     console.log(ret_response);
    //     return ret_response;

    // }

    // /**
    //  * Get Destination User 
    //  */
    //   async getCFDestUser(sToken) {
    //     const request = require('request');
    //     const rp = require('request-promise');
    //     const cfenv = require('cfenv');

    //     /*********************************************************************
    //      *************** Step 1: Read the environment variables ***************
    //      *********************************************************************/
    //     const oServices = cfenv.getAppEnv().getServices();
    //     const uaa_service = cfenv.getAppEnv().getService('config_products-xsuaa-service');
    //     const dest_service = cfenv.getAppEnv().getService('config_products-destination-service');
    //     const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

    //     const sDestinationName = 'S4D_HTTP';
    //     const sEndpoint = '/secure/';
    //     /*************************************************************
    //      *** Step 3: Search your destination in the destination service ***
    //      *************************************************************/
    //      const token = sToken; //req.data.TOKEN;   //JSON.parse(req.data.DATA).access_token;
    //      const get_options = {
    //          url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + sDestinationName,
    //          headers: {
    //              'Authorization': 'Bearer ' + token
    //          }
    //      }

    //      let ret_response = "";
    //      await rp(get_options)
    //          .then(function (response) {
    //              const oDestination = JSON.parse(response);
    //              console.log(oDestination.destinationConfiguration.User);
    //              ret_response = oDestination.destinationConfiguration.User;
    //          })
    //          .catch(function (error) {
    //              console.log('Get Destination - Error ', error);
    //              ret_response = JSON.parse(error);
    //          });

    //      console.log(ret_response);
    //      return ret_response;

    // }

}

module.exports = CIRData;
