using my.timeseries as my from '../db/data-model';

service CatalogService @(impl:'./lib/cat-service.js'){
    @readonly entity odTimeSeries as projection on my.odTimeSeries;
}