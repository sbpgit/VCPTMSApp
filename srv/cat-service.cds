using my.timeseries as my from '../db/data-model';
using V_TIMESERIES from '../db/data-model';
using V_PRODUCT from '../db/data-model';

service CatalogService @(impl:'./lib/cat-service.js'){
   @readonly entity odTimeSeries as projection on my.odTimeSeries;

   @readonly 
    entity gProducts 
        as projection on V_PRODUCT;
   @readonly
    entity Timeseries
        as projection on V_TIMESERIES;
}