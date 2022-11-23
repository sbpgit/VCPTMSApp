using CatalogService as service from '../../srv/cat-service';

annotate service.getProdlocline with {
  LOCATION_ID @Common : {
        // Text            : LOCATION_ID_LOCATION_ID,
        // TextArrangement : #TextOnly,
        // //insert your value list here 
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Location',
            CollectionPath : 'getLocation',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : LOCATION_ID,
                ValueListProperty : 'LOCATION_ID'
            }
            ]
        }   
    }; 
    PRODUCT_ID @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Products',
            CollectionPath : 'genPartialProd',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : PRODUCT_ID,
                ValueListProperty : 'PRODUCT_ID'
            },
            {
                $Type             : 'Common.ValueListParameterIn',
                LocalDataProperty : LOCATION_ID,
                ValueListProperty : 'LOCATION_ID'
            }
            // ,
            // {
            //     $Type             : 'Common.ValueListParameterDisplayOnly',
            //     ValueListProperty : 'PROD_DESC'
            // }
         ]
        }   
    }; 
    LINE_ID @Common : {
        // Text            : LOCATION_ID_LOCATION_ID,
        // TextArrangement : #TextOnly,
        // //insert your value list here 
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Line ID',
            CollectionPath : 'getLine',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : LINE_ID,
                ValueListProperty : 'LINE_ID'
            },
            {
                $Type             : 'Common.ValueListParameterIn',
                LocalDataProperty : LOCATION_ID,
                ValueListProperty : 'LOCATION_ID'
            }
            ]
        }   
    }; 
   
};