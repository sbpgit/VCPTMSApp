
using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';

service IBPImportSrv @(impl : './lib/ibpimport-service.js') {
    // @cds.autoexpose
    entity VCPTEST as projection on external.VCPTEST{
        key LOCID,PRDID,VERSIONID,SCENARIOID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ
        // where PLANNEDINDEPENDENTREQ gt 0
    }where PLANNEDINDEPENDENTREQ  <> '0' or PLANNEDINDEPENDENTREQ  <> 0;

}
@protocol : 'rest'
service IbpImportRest {
    entity getIBPDemdext as projection on IBPImportSrv.VCPTEST{
                                        LOCID, 
                                        PRDID,
                                        VERSIONID,
                                        SCENARIOID,
                                        PERIODID0_TSTAMP, 
                                        PLANNEDINDEPENDENTREQ
                                    } 
                                    where PLANNEDINDEPENDENTREQ  <> '0' or PLANNEDINDEPENDENTREQ  <> 0 ;
}
