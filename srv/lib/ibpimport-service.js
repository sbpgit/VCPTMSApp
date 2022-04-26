const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

module.exports = cds.service.impl(async function () {
    const { VCPTEST } = this.entities;
    //  const service = await cdse.connect.to('IBPDemandsrv');
    const service = await cds.connect.to('IBPDemandsrv');
    this.on('READ', VCPTEST, request => {
        try {
            return service.tx(request).run(request.query);
        }
        catch (err) {
            console.log(err);
        }
    });
    this.after("READ", VCPTEST, async (req) => {
        const { VCPTEST } = this.entities;
        const tx = cds.tx(req)
        // const iBPData = await cds.run(SELECT.from(VCPTEST));
        for (var i in req) {
            if (req[i].PLANNEDINDEPENDENTREQ > 0) {
                let modQuery = {
                    UPSERT: {
                        into: { ref: ['CP_IBP_FUTUREDEMAND_TEMP'] }, entries: [
                            {
                                LOCATION_ID: req[i].LOCID,
                                PRODUCT_ID: req[i].PRDID,
                                VERSION: req[i].VERSIONID,
                                SCENARIO: req[i].SCENARIOID,
                                WEEK_DATE: req[i].PERIODID0_TSTAMP,
                                QUANTITY: req[i].PLANNEDINDEPENDENTREQ

                            }
                        ]
                    }
                }
                try {
                    await cds.run(modQuery);
                    // await cds.run(INSERT.into('CP_IBP_FUTUREDEMAND_TEMP') .as (SELECT.from('VCPTEST').where({ PLANNEDINDEPENDENTREQ: { '>': 0 } })));
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
    })
});
