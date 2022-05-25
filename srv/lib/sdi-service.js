const cds = require('@sap/cds')
module.exports = (srv) => {
    srv.on("ImportECCProd", async (req) => {
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PROD_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            return output.results;
        } catch (error) {
            console.error(error);
            return error;
        }

    });


};