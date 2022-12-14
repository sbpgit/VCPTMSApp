

using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
using {IBPMasterDataAPI as externalPost} from './external/IBPMasterDataAPI.csn';
service IBPImportSrv @(impl : './lib/ibpimport-service.js') {
    //Local testing
    function getFDemandQty(LOCATION_ID : String(4), PRODUCT_ID : String(40)) returns String;
    
    function getFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40)) returns String;
    function createIBPMasterProd(LOCATION_ID : String(4)) returns String;
    function createIBPLocation() returns String;
    function createIBPCustomer() returns String;
    function createIBPClass(CLASS_NUM: String(18)) returns String;    
    function createIBPSalesTrans(LOCATION_ID : String(4)) returns String;// PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20)) returns String;
    
    function createIBPSalesConfig(LOCATION_ID : String(4)) returns String;// ,PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20)) returns String;
    function createComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),CRITICALKEY :String(1)) returns String;
    function createActCompDemand(LOCATION_ID : String(4),PRODUCT_ID : String(40),CRITICALKEY :String(1)) returns String;// ,PRODUCT_ID : String(40)) returns String;
    function createIBPLocProd(LOCATION_ID : String(4)) returns String;
    function createIBPCIR(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;  // Partial Product
    function exportIBPLocProd_fn(LOCATION_ID : String(4)) returns String;
    function exportRestrDetails_fn(LOCATION_ID : String(4)) returns String;
    // function exportRestrictions_fn(LOCATIOn)
    // actions for testing from CF/ jobscheduler 
     // Outbound to IBP
    action exportIBPMasterProd(LOCATION_ID : String(4));
    action exportIBPLocation();
    action exportIBPCustomer();
    action exportIBPClass(CLASS_NUM: String(18));  
    action exportComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),FROMDATE: Date, TODATE: Date,CRITICALKEY :String(1));
    // function exportComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),CRITICALKEY :String(1)) returns String;
    action exportIBPLocProd(LOCATION_ID : String(4));
    action exportRestrDetails(LOCATION_ID: String(4)); 
    action exportIBPAssembly(LOCATION_ID : String(4));
    //  function exportIBPAssembly(LOCATION_ID : String(4)) returns String;
  
    action exportIBPSalesTrans(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20),DOC_DATE:Date);
    action exportActCompDemand(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40),CRITICALKEY :String(1));//,FROMDATE: Date, TODATE: Date);
    action exportRestrReq(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40));
    action exportMktAuth(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40));
    action exportIBPCIR(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40));  // Partial Product
    
    // function exportIBPCIR(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;  // Partial Product
    //Inbound from BTP
    action generateFDemandQty(LocProdData: String);//LOCATION_ID : String(4), PRODUCT_ID : String(40));
    action generateFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), FROMDATE : Date, TODATE : Date);
    action generateMarketAuth( MARKETDATA : String);
    // action importibpversce();
    function importibpversce() returns String;
}
@protocol : 'rest'
service IbpImportRest {
}
