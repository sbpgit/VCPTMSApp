

using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
using {IBPMasterDataAPI as externalPost} from './external/IBPMasterDataAPI.csn';
using {IBPChangeHistory as externalChlogPost} from './external/IBPChangeHistory.csn';
service IBPImportSrv @(impl : './lib/ibpimport-service.js') {
   
    function exportRestrDetails_fn(LOCATION_ID : String(4)) returns String;
    // actions for testing from CF/ jobscheduler 
     // Outbound to IBP
    action exportIBPMasterProd(LOCATION_ID : String(4));
    action exportIBPLocation();
    action exportIBPCustomer();
    action exportIBPClass(CLASS_NUM: String(18));  
    action exportComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),FROMDATE: Date, TODATE: Date,CRITICALKEY :String(1));
    
    action exportIBPLocProd(LOCATION_ID : String(4));
    action exportRestrDetails(LOCATION_ID: String(4)); 
    action exportIBPAssembly(LOCATION_ID : String(4));
  
    action exportIBPSalesTrans(LocProdData: String);
    action exportActCompDemand(LocProdData: String);
    
    action exportRestrReq(LocProdData: String);
    action exportMktAuth(LocProdData: String);
    action exportIBPCIR(LocProdData: String); 
    function exportIBPSalesTrans_fn(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;  
   //Inbound from BTP
    action generateFDemandQty(LocProdData: String);//LOCATION_ID : String(4), PRODUCT_ID : String(40));
    action generateFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), FROMDATE : Date, TODATE : Date);
    action generateMarketAuth( MARKETDATA : String);
   // action importibpversce();
    function importibpversce() returns String;
    function importChngelogMktAuth() returns String;
    action importComponentAvail();
}
@protocol : 'rest'
service IbpImportRest {
}
