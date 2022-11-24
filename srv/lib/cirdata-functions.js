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
