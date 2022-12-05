

using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
using {IBPMasterDataAPI as externalPost} from './external/IBPMasterDataAPI.csn';
service IBPImportSrv @(impl : './lib/ibpimport-service.js') {
    // Outbound to IBP
    action exportIBPMasterProd(LOCATION_ID : String(4));
    // function exportIBPMasterProd(LOCATION_ID : String(4)) returns String;
    action exportIBPLocation();
    action exportIBPCustomer();
    action exportIBPClass(CLASS_NUM: String(18));  
    action exportComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),FROMDATE: Date, TODATE: Date,CRITICALKEY :String(1));
    action exportIBPLocProd(LOCATION_ID : String(4));
    action exportRestrDetails(LOCATION_ID: String(4)); 

    action exportIBPSalesTrans(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(20),DOC_DATE:Date);
    action exportActCompDemand(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40),CRITICALKEY :String(1));//,FROMDATE: Date, TODATE: Date);
    action exportRestrReq(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40));
    action exportMktAuth(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40));
    action exportIBPCIR(LocProdData: String);//LOCATION_ID : String(4),PRODUCT_ID : String(40));  // Partial Product
    //Inbound from BTP
    action generateFDemandQty(LocProdData: String);//LOCATION_ID : String(4), PRODUCT_ID : String(40));
    // function generateFDemandQty(LOCATION_ID : String(4), PRODUCT_ID : String(40)) returns String;
    action generateFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), FROMDATE : Date, TODATE : Date);
    // function exportMktAuth(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;

    action generateMarketAuth( MARKETDATA : String);

    // action importibpversce();
    function importibpversce() returns String;
}
@protocol : 'rest'
service IbpImportRest {
}
