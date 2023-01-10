const jobscheduleFunction = require("./jobscheduler-function");


module.exports = (srv) => {

    srv.on("preDefinedHistory", async (req) => {
        const obgenJSFunction = new jobscheduleFunction();


        // SDI Functions
        await obgenJSFunction.ImportECCLoc(req);
        await obgenJSFunction.ImportECCCustGrp(req);
        await obgenJSFunction.ImportECCProd(req);
        await obgenJSFunction.ImportECCLocProd(req);
        await obgenJSFunction.ImportECCProdClass(req);
        await obgenJSFunction.ImportECCBOM(req);
        await obgenJSFunction.ImportECCClass(req);
        await obgenJSFunction.ImportECCODhdr(req);
        await obgenJSFunction.ImportPartialProd(req);
        await obgenJSFunction.ImportPVSNode(req);
        await obgenJSFunction.ImportPVSBOM(req);
        await obgenJSFunction.ImportECCAsmbcomp(req);
        await obgenJSFunction.ImportECCSalesh(req);
        await obgenJSFunction.ImportCuvtabInd(req);
        await obgenJSFunction.ImportCIRLog(req);
        await obgenJSFunction.ImportSOStock(req);


        // Generate Timeseries History
        await obgenJSFunction.generateTimeseries(req);


        // Generate Models
        // await obgenJSFunction.generateModels(req,isGet);


        // IBP Export functions
        await obgenJSFunction.exportIBPLocation(req);
        await obgenJSFunction.exportIBPCustomer(req);
        await obgenJSFunction.exportIBPMasterProd(req);
        await obgenJSFunction.exportIBPLocProd(req);
        await obgenJSFunction.exportIBPAssembly(req);
        await obgenJSFunction.exportIBPClass(req);
        // await obgenJSFunction.exportRestrDetails(req);
        await obgenJSFunction.exportIBPSalesTrans(req);
        await obgenJSFunction.exportActCompDemand(req);
        // await obgenJSFunction.exportMktAuth(req);
        // await obgenJSFunction.exportComponentReq(req);
        // await obgenJSFunction.exportIBPCIR(req);
        // await obgenJSFunction.exportRestrReq(req);

    });


    srv.on("preDefinedFuture", async (req) => {

    });

};