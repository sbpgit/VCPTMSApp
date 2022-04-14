service IbpService @(impl : './lib/Ibp-Service.js') {
  action genMasterData() returns String;
  action genTxData() returns String;
}