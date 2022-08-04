using CatalogService as service from '../../srv/cat-service';

annotate service.getUniqueId with @(
    UI.SelectionFields : [
        CHARVAL_NUM,
        LOCATION_ID,
        PRODUCT_ID,
    ]
);
