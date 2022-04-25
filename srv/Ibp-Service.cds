
using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
service IbpService @(impl : './lib/Ibp-Service.js') {
    // @cds.persistence : {
    //     table,
    //     skip : false
    // }
    @cds.autoexpose
    entity VCPTEST as projection on external.VCPTEST{
        key PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,SCENARIOID,SCENARIONAME
    };
  action genMasterData() returns String;
  action genTxData() returns String;
  
}
@protocol : 'rest'
service IbpServiceRest {
    entity getIBPDemdext as projection on IbpService.VCPTEST;
}