using cp as service from '../../db/data-model';

// Product annotations
annotate service.IBP_FUTUREDEMAND with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem                       : [
            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VER_BLINE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField',
                Value : WEEK_BUCKET
            },
            {
                $Type : 'UI.DataField',
                Value : QUANTITY
            }
        ]
        /*,
        HeaderInfo                     : {
            Title          : {Value : PRODUCT_ID},
            Description    : {Value : LOCATION_ID},
            TypeName       : 'Future Demand Plan',
            TypeNamePlural : 'Future Demand Plans'
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [{
            $Type : 'UI.DataField',
            Value : PROD_DESC
        }]},
        FieldGroup #Details            : {Data : [
            {
                $Type : 'UI.DataField',
                Value : PROD_DESC
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_FAMILY
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_GROUP
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_SERIES
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_MODEL
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_MDLRANGE
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD1
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD2
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD3
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD4
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD5
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'ProdDetails',
        Label  : 'Product Details',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product Details',
            Target : '@UI.FieldGroup#Details'
        }]
    }]*/
    }
);