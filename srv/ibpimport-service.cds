
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
    function createIBPProduct(LOCATION_ID : String(4),TRANSACTIONID:String(10)) returns String;

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
