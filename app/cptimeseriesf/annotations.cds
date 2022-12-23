using CatalogService as service from '../../srv/cat-service';
using from '../../srv/annotation';



annotate service.getTimeseriesF with @(
    UI.SelectionFields : [
        CAL_DATE,
        LOCATION_ID,
        PRODUCT_ID,
        VERSION,
    ]
);
