

using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
using {IBPMasterDataAPI as externalPost} from './external/IBPMasterDataAPI.csn';
service IBPImportSrv @(impl : './lib/ibpimport-service.js') {
    // @cds.autoexpose
    entity SBPVCP as projection on external.SBPVCP{
        key LOCID,PRDID,VERSIONID,SCENARIOID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ
        // where PLANNEDINDEPENDENTREQ gt 0
    }where PLANNEDINDEPENDENTREQ  <> '0' or PLANNEDINDEPENDENTREQ  <> 0;
    // entity GetTransactionID as projection on externalPost.GetTransactionID;
    function getFDemandQty(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32)) returns String;
    // function getFCharPlan() returns String;
    function getFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32), FROMDATE : Date, TODATE : Date) returns String;
    function createIBPProduct(LOCATION_ID : String(4),PRODUCT_ID : String(40)) returns String;
    function createIBPMasterProd(LOCATION_ID : String(4)) returns String;
    function createIBPLocation() returns String;
    function createIBPCustomer() returns String;
    function createIBPClass(CLASS_NUM: String(18)) returns String;    
    function createIBPSalesTrans(LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(2)) returns String;

    // Inbound to IBP
    action exportIBPMasterProd(LOCATION_ID : String(4));
    action exportIBPLocation();
    action exportIBPCustomer();
    action exportIBPClass(CLASS_NUM: String(18));    
    action exportIBPSalesTrans(LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(2),DOC_DATE:Date);
    action exportIBPSalesConfig(LOCATION_ID : String(4),PRODUCT_ID : String(40),CUSTOMER_GROUP : String(2));
    action exportComponentReq(LOCATION_ID : String(4),PRODUCT_ID : String(40),FROMDATE: Date, TODATE: Date);
    //action exportCompDemand

    //Inbound to BTP
    action generateFDemandQty(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32));
    action generateFCharPlan(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32), FROMDATE : Date, TODATE : Date);
    
}
@protocol : 'rest'
service IbpImportRest {
    entity getIBPDemdext as projection on IBPImportSrv.SBPVCP{
                                        LOCID, 
                                        PRDID,
                                        VERSIONID,
                                        SCENARIOID,
                                        PERIODID0_TSTAMP, 
                                        PLANNEDINDEPENDENTREQ
                                    } 
                                    where PLANNEDINDEPENDENTREQ  <> '0' or PLANNEDINDEPENDENTREQ  <> 0 ;
}
