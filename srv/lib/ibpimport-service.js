const cds = require("@sap/cds");
// const csrf = require("csrf");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

module.exports = cds.service.impl(async function () {
    const { SBPVCP } = this.entities;
    //  const service = await cdse.connect.to('IBPDemandsrv');
    const service = await cds.connect.to('IBPDemandsrv');
    const servicePost = await cds.connect.to('IBPMasterDataAPI');  
    var vTransid;  
    // var csrfProtection = csrf({ cookie: true })
    this.on('READ', SBPVCP, request => {
        try {
            return service.tx(request).run(request.query);
        }
        catch (err) {
            console.log(err);
        }
    });
    this.after("READ", SBPVCP, async (req) => {
        const { VCPTEST } = this.entities;
        const tx = cds.tx(req)
        // const iBPData = await cds.run(SELECT.from(VCPTEST));
        for (var i in req) {
           if (req[i].LOCID === 'RX01') {
                let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND_TEMP" VALUES (' +
                    "'" + req[i].LOCID + "'" + "," +
                    "'" + req[i].PRDID + "'" + "," +
                    "'" + req[i].VERSIONID + "'" + "," +
                    "'" + req[i].SCENARIOID + "'" + "," +
                    "'" + req[i].PERIODID0_TSTAMP + "'" + "," +
                    "'" + req[i].PLANNEDINDEPENDENTREQ  + "'" + ')' + ' WITH PRIMARY KEY';
                    // UPSERT: {
                    //     into: { ref: ['CP_IBP_FUTUREDEMAND_TEMP'] }, entries: [
                    //         {
                    //             LOCATION_ID: req[i].LOCID,
                    //             PRODUCT_ID: req[i].PRDID,
                    //             VERSION: req[i].VERSIONID,
                    //             SCENARIO: req[i].SCENARIOID,
                    //             WEEK_DATE: req[i].PERIODID0_TSTAMP,
                    //             QUANTITY: req[i].PLANNEDINDEPENDENTREQ

                    //         }
                    //     ]
                    // }
                //}
                try {
                    await cds.run(modQuery);
                    // await cds.run(INSERT.into('CP_IBP_FUTUREDEMAND_TEMP') .as (SELECT.from('VCPTEST').where({ PLANNEDINDEPENDENTREQ: { '>': 0 } })));
                }
                catch (err) {
                    console.log(err);
                }
           }
        }
    });
    this.on("getFDemandQty",async (request) => { 
        var flag;
        var resUrl = "/SBPVCP?$select=PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME&$filter=LOCID eq '"+request.data.LOCATION_ID+"' and PRDID eq '"+request.data.PRODUCT_ID+"' and VERSIONID eq '"+request.data.VERSION+"' and SCENARIOID eq '"+request.data.SCENARIO+"'"; 
        var req = await service.tx(req).get(resUrl);
        const dateJSONToEDM = jsonDate => {
            const content = /\d+/.exec(String(jsonDate));
            const timestamp = content ? Number(content[0]) : 0;
            const date = new Date(timestamp);
            const string = date.toISOString().split('T')[0];
            return string;
          };
          flag = '';
        for (var i in req) {
            var vWeekDate = dateJSONToEDM(req[i].PERIODID0_TSTAMP);
           // var vWeekDate = vTstamp.split('T');
          //  if (req[i].LOCID === 'RX01') {
                 let modQuery = 'UPSERT "CP_IBP_FUTUREDEMAND" VALUES (' +
                     "'" + req[i].LOCID + "'" + "," +
                     "'" + req[i].PRDID + "'" + "," +
                     "'" + req[i].VERSIONID + "'" + "," +
                     "'" + req[i].SCENARIOID + "'" + "," +
                     "'" + vWeekDate + "'" + "," +
                     "'" + req[i].PLANNEDINDEPENDENTREQ  + "'" + ')' + ' WITH PRIMARY KEY';                     
                 try {
                     await cds.run(modQuery);
                     flag = 'X';
                }
                 catch (err) {
                     console.log(err);
                 }
          //  }
         }
         if (flag === 'X') {
             return 'Success';
         } else {
            return 'Failed';
         }
    });
    this.on("createIBPProduct", async (req) => {
        var oReq = {
            newProd: [],
        },
        vNewProd;
        // const service = await cds.connect.to('IBPMasterDataAPI');
        const linewprod = await cds.run(
            `
            SELECT A.PRODUCT_ID,
            A.LOCATION_ID,
            A.REF_PRODID,
            B.PROD_DESC,
            B.PROD_FAMILY,
            B.PROD_GROUP,
            B.PROD_MODEL,
            B.PROD_MDLRANGE,
            B.PROD_SERIES
                   FROM "CP_NEWPROD_INTRO" AS A
            INNER JOIN "CP_PRODUCT" AS B
            ON A.REF_PRODID = B.PRODUCT_ID
            WHERE "LOCATION_ID" = '`+ req.data.LOCATION_ID +
            `'`);
        
        //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
        // for (i = 0; i < linewprod.length; i++) {
        //     vNewProd = {
        //         "VCMODELRANGE": linewprod[i].PROD_MDLRANGE,
        //         "PRDFAMILY": linewprod[i].PROD_FAMILY,
        //         "PRDID": linewprod[i].PRODUCT_ID,
        //         "PRDGROUP": linewprod[i].PROD_GROUP,
        //         "VCMODEL": linewprod[i].PROD_MODEL,
        //         "PRDDESCR": linewprod[i].PROD_DESC,
        //         "PRDSERIES": linewprod[i].PROD_SERIES
        //     };
            vNewProd = {
            "VCMODELRANGE":"8100",
            "PRDFAMILY":"RX1",
            "PRDID":"AR202466",
            "PRDGROUP":"RX_PG1",
            "VCMODEL":"8160",
            "PRDDESCR":"8R 410 410HP TRACTOR",
            "PRDSERIES": "Test"
            };
            oReq.newProd.push(vNewProd);

        // }
        var vTransID = new Date().getTime().toString();
        var oEntry =
        {
            "TransactionID": vTransID,
            "RequestedAttributes": "VCMODELRANGE,PRDFAMILY,PRDID,PRDGROUP,VCMODEL,PRDDESCR",
            "DoCommit": true,
            "NavVCPPRODUCT": oReq.newProd
        }
        await servicePost.tx(req).post("/VCPPRODUCTTrans", oEntry);
        var resUrl = "/GetExportResult?P_EntityName='SBPVCP'&P_TransactionID='"+vTransID+"'"; 
        return await servicePost.tx(req).get(resUrl)
        // GetExportResult
    });
});
// cds.on('bootstrap', app => {


//     app.use(odatav2adapterproxy());

//     cds.mtx.in(app).then(async () => {
//         const provisioning = await cds.connect.to('ProvisioningService');
//         provisioning.impl(require('./provisioning'));
//     });

// });

// module.exports = cds.service;
// module.exports = (srv) => {
    // const service = await cds.connect.to('IBPMasterDataAPI');

    // srv.on('bootstrap', async (app) => {
    //     app.use(cookieParser())
    //     app.head('/VCPCUSTOMER', csrfProtection, function (req, res) {
    //         res.set('X-CSRF-Token', req.csrfToken())
    //         res.send()
    //     })
    // });
    // Service for weekly component requirements- assembly
    
// }
