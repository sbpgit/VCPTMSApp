using CatalogService as service from '../../srv/cat-service';
using from '../../srv/annotation';



annotate service.getProducts with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : PRODUCT_ID,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PROD_DESC,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PROD_FAMILY,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PROD_SERIES,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PROD_MDLRANGE,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PROD_MODEL,
            ![@UI.Importance] : #High,
        },
    ]
);
annotate service.getProducts with {
    PRODUCT_ID @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Products',
            CollectionPath : 'getProducts',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : PRODUCT_ID,
                ValueListProperty : 'PRODUCT_ID'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'PROD_DESC'
            }
         ]
        }   
    }; 
};