// using mkt from '../db/mktauth';



service PlstrDataService @(impl : './lib/PlstrData-Service.js') {


  action genMasterData();
  // KLUDGE function API for Alternate to POST updateJobs()
  function fgenMasterData() returns String;

  
  action genPartialProducts();
  // KLUDGE function API for Alternate to POST updateJobs()
  function fgenPartialProducts() returns String;
  
  action genTimeSeries();
  // KLUDGE function API for Alternate to POST updateJobs()
  function fgenTimeSeries() returns String;

  
}