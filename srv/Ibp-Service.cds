
using {IBPDemandsrv as external} from './external/IBPDemandsrv.csn';
service IbpService @(impl : './lib/Ibp-Service.js') {
    entity VCPTEST as projection on external.VCPTEST{
        key PRDID,LOCID,PERIODID0_TSTAMP,PLANNEDINDEPENDENTREQ,VERSIONID,VERSIONNAME,SCENARIOID
    };
  action genMasterData() returns String;
  action genTxData() returns String;
  
}