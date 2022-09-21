

using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
using {IBPMasterDataAPI as externalPost} from './external/IBPMasterDataAPI.csn';
service IBPImportSrv @(impl : './lib/ibpimport-service.js') {
    //Local testing
    function getFDemandQty(LOCATION_ID : String(4), PRODUCT_ID : String(40)) returns String;
    
    function getFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40)) returns String;
    // function getFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), FROMDATE : Date, TODATE : Date) returns String;
    function createIBPMasterProd(LOCATION_ID : String(4)) returns String;
    function createIBPLocation() returns String;
    function createIBPCustomer() returns String;
    function createIBPClass(CLASS_NUM: String(18)) returns String;    
    function createIBPSalesTrans(LOCATION_ID : String(4)) returns String;
    // PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20)) returns String;
    
    function createIBPSalesConfig(LOCATION_ID : String(4)) returns String;
    // ,PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20)) returns String;
    function createComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;
    function createActCompDemand(LOCATION_ID : String(4)) returns String;
    // ,PRODUCT_ID : String(40)) returns String;
    function createIBPLocProd(LOCATION_ID : String(4)) returns String;
    function createIBPCIR(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;  // Partial Product


    // actions for testing from CF/ jobscheduler 

    // Inbound to IBP
    action exportIBPMasterProd(LOCATION_ID : String(4));
    action exportIBPLocation();
    action exportIBPCustomer();
    action exportIBPClass(CLASS_NUM: String(18));    
    action exportIBPSalesTrans(LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20),DOC_DATE:Date);
    action exportIBPSalesConfig(LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20));
    action exportComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),FROMDATE: Date, TODATE: Date);
    action exportActCompDemand(LOCATION_ID : String(4),PRODUCT_ID : String(40),FROMDATE: Date, TODATE: Date);
    action exportIBPLocProd(LOCATION_ID : String(4));
    //Inbound to BTP
    action generateFDemandQty(LOCATION_ID : String(4), PRODUCT_ID : String(40));
    action generateFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), FROMDATE : Date, TODATE : Date);
    
}
@protocol : 'rest'
service IbpImportRest {
    // entity getIBPDemdext as projection on IBPImportSrv.SBPVCP{
    //                                     LOCID, 
    //                                     PRDID,
    //                                     VERSIONID,
    //                                     SCENARIOID,
    //                                     PERIODID0_TSTAMP, 
    //                                     PLANNEDINDEPENDENTREQ
    //                                 } 
    //                                 where PLANNEDINDEPENDENTREQ  <> '0' or PLANNEDINDEPENDENTREQ  <> 0 ;
}
