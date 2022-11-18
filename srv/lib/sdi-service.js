const cds = require('@sap/cds');
const hana = require("@sap/hana-client");
const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
const GenF = require("./gen-functions");


function getJobscheduler(req) {

    xsenv.loadEnv();
    const services = xsenv.getServices({
        jobscheduler: { tags: "jobscheduler" },
    });
    if (services.jobscheduler) {
        const options = {
            baseURL: services.jobscheduler.url,
            user: services.jobscheduler.user,
            password: services.jobscheduler.password,
        };
        return new JobSchedulerClient.Scheduler(options);
    } else {
        req.error("no jobscheduler service instance found");
    }
}
module.exports = (srv) => {
    srv.on("ImportECCProd", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PRODUCTS_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Product is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Product Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Product job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Product has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Product job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Product job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCLocProdfn", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PRODUCTS_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
        }

    });
    srv.on("ImportECCLoc", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_LOCATION_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Location is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Location Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Location job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Location has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Location job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Location job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCCustGrp", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CUSTGRP_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of CustomerGroup is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("CustomerGroup Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of CustomerGroup job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of CustomerGroup has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of CustomerGroup job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of CustomerGroup job update results", result);

                });
            }
        }
    });
    srv.on("ImportECCBOM", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_BOMHEADER_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of BOM Header is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("BOM Header Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of BOM Header job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of BOM Header has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of BOM Header job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of BOM Header job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCBomod", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_BOMOBJDEPENDENCY_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of BOM Obj. Dependency is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("BOM Obj. Dependency Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of BOM Obj. Dependency job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of BOM Obj. Dependency has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of BOM Obj. Dependency job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of BOM Obj. Dependency job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCODhdr", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_OBJDEP_HEADER_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Obj. Dependency Header is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Obj. Dependency Header Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Obj. Dependency Header job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Obj. Dependency Header has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Obj. Dependency Header job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Obj. Dependency Header job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCProdClass", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PRODCLASS_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Product-class is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Product-class Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Product-class job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Product-class has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Product-class job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Product-class job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCClass", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CLASS_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Class is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Class Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Class job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Class has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Class job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Class job update results", result);

                });
            }
        }


    });
    srv.on("ImportECCChar", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CHAR_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Characteristics is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Characteristics Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Characteristics job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Characteristics has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Characteristics job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Characteristics job update results", result);

                });
            }
        }


    });

    srv.on("ImportECCCharval", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CHARVAL_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Characteristics Value is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Characteristics Value Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Characteristics Value job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Characteristics Value has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Characteristics Value job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Characteristics Value job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCLocProd", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PRODUCT_LOCATION_STOP_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Location-Product is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Location-Product Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Location-Product job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Location-Product has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Location-Product job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Location-Product job update results", result);

                });
            }
        }
    });

    srv.on("ImportECCSalesh", async (req) => {
        var flag = '';
        // remove history data from Sales tables

        // const lsSales = await GenF.getParameterValue(req.data.LOCATION_ID, 4);
        // await SELECT.one
        //     .columns('VALUE')
        //     .from('CP_PARAMETER_VALUES')
        //     .where(`LOCATION_ID = '${req.data.LOCATION_ID}' AND VALUE = 4 `);
        // let vFromDate = new Date();
        // vFromDate.setDate(vFromDate.getDate() - ( parseInt(lsSales) * 7) );
        // vFromDate = vFromDate.toISOString().split('Z')[0].split('T')[0];

        // try {
        //     await DELETE.from('CP_SALESH')
        //         .where(`MAT_AVAILDATE  < '${vFromDate}'`);
        //     await cds.run(
        //         `DELETE FROM "CP_SALESH_CONFIG" WHERE SALES_DOC IN ( SELECT SALES_DOC
        //             FROM "CP_SALESH"
        //             WHERE MAT_AVAILDATE  < '`+ vFromDate + `')`);
        // }
        // catch (e) {

        // }
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_SALESH_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            const spcfg = await dbConn.loadProcedurePromisified(null, '"FG_SALESHCFG_SP"')
            const outputcfg = await dbConn.callProcedurePromisified(spcfg, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Sales History is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Sales History Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Sales History job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Sales History has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Sales History job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Sales History job update results", result);

                });
            }
        }

    });
    srv.on("ImportECCSaleshCfg", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_SALESHCFG_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Sales History Configuration is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Sales History Configuration Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Sales History Configuration job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Import of Sales History Configurationhas failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Import of Sales History Configurationjob update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Import of Sales History Configuration job update results", result);

                });
            }
        }
    });
    srv.on("ImportECCAsmbcomp", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_ASMBCOMP_SP"')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Assembly components is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Assembly components Imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Assembly components job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Assembly components has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Assembly components job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Assembly components job update results", result);

                });
            }
        }

    });
    srv.on("ImportCuvtabInd", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_CUVTAB_IND_SP"');
            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_CUVTAB_VALC_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            const output2 = await dbConn.callProcedurePromisified(sp2, [])
            console.log(output.results);
            console.log(output2.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import of Value assignment alternatives for variant table is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Value assignment alternatives for variant table imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Value assignment alternatives for variant table job update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "Value assignment alternatives for variant table has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("Value assignment alternatives for variant table job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("Value assignment alternatives for variant table job update results", result);

                });
            }
        }

    });
    srv.on("ImportCIRLog", async (req) => {
        var flag = '';
        try {
            const dbClass = require("sap-hdb-promisfied")
            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())
            const sp = await dbConn.loadProcedurePromisified(null, '"FG_LOGCIR_SP"');
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results);
            flag = 'X';
        } catch (error) {
            console.error(error);
        }
        if (flag === 'X') {
            let dataObj = {};
            dataObj["success"] = true;
            dataObj["message"] = "Import CIR Logs is successfull at " + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("CIR Logs imported, to update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("CIR Logs update results", result);

                });
            }
        }
        else {
            let dataObj = {};
            dataObj["failed"] = false;
            dataObj["message"] = "CIR Logs has failed at" + new Date();


            if (req.headers['x-sap-job-id'] > 0) {
                const scheduler = getJobscheduler(req);

                var updateReq = {
                    jobId: req.headers['x-sap-job-id'],
                    scheduleId: req.headers['x-sap-job-schedule-id'],
                    runId: req.headers['x-sap-job-run-id'],
                    data: dataObj
                };

                console.log("CIR Logs job update req", updateReq);

                scheduler.updateJobRunLog(updateReq, function (err, result) {
                    if (err) {
                        return console.log('Error updating run log: %s', err);
                    }
                    //Run log updated successfully
                    console.log("CIR Logs job update results", result);

                });
            }
        }

    });

    srv.on("ImportPartialProd", async (req) => {

        var flag = '';

        try {

            const dbClass = require("sap-hdb-promisfied")

            let dbConn = new dbClass(await dbClass.createConnectionFromEnv())

            const sp = await dbConn.loadProcedurePromisified(null, '"FG_PARTIALPROD_SP"');

            const sp2 = await dbConn.loadProcedurePromisified(null, '"FG_PARTIALPRODCFG_SP"');

            const output = await dbConn.callProcedurePromisified(sp, [])

            const output2 = await dbConn.callProcedurePromisified(sp2, [])

            console.log(output.results);

            console.log(output2.results);

            flag = 'X';

        } catch (error) {

            console.error(error);

        }

        if (flag === 'X') {

            let dataObj = {};

            dataObj["success"] = true;

            dataObj["message"] = "Import of Partial Products is successfull at " + new Date();




            if (req.headers['x-sap-job-id'] > 0) {

                const scheduler = getJobscheduler(req);



                var updateReq = {

                    jobId: req.headers['x-sap-job-id'],

                    scheduleId: req.headers['x-sap-job-schedule-id'],

                    runId: req.headers['x-sap-job-run-id'],

                    data: dataObj

                };



                console.log("Partial Products imported, to update req", updateReq);



                scheduler.updateJobRunLog(updateReq, function (err, result) {

                    if (err) {

                        return console.log('Error updating run log: %s', err);

                    }

                    //Run log updated successfully

                    console.log("Partial Products job update results", result);



                });

            }

        }

        else {

            let dataObj = {};

            dataObj["failed"] = false;

            dataObj["message"] = "Partial Products has failed at" + new Date();




            if (req.headers['x-sap-job-id'] > 0) {

                const scheduler = getJobscheduler(req);



                var updateReq = {

                    jobId: req.headers['x-sap-job-id'],

                    scheduleId: req.headers['x-sap-job-schedule-id'],

                    runId: req.headers['x-sap-job-run-id'],

                    data: dataObj

                };



                console.log("Partial Products job update req", updateReq);



                scheduler.updateJobRunLog(updateReq, function (err, result) {

                    if (err) {

                        return console.log('Error updating run log: %s', err);

                    }

                    //Run log updated successfully

                    console.log("Partial Products job update results", result);



                });

            }

        }



    });
};