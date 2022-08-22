using CatalogService as service from '../../srv/cat-service';

annotate service.getProdRestr with {
  LOCATION_ID @Common : {
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
            CollectionPath : 'getProducts',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : PRODUCT_ID,
                ValueListProperty : 'PRODUCT_ID'
            },
            {
                $Type             : 'Common.ValueListParameterIn',
                LocalDataProperty : LOCATION_ID,
                ValueListProperty : 'PRODUCT_ID'
            }
         ]
        }   
    }; 
    RESTRICTION @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Products',
            CollectionPath : 'getProducts',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : PRODUCT_ID,
                ValueListProperty : 'PRODUCT_ID'
            },
            {
                $Type             : 'Common.ValueListParameterIn',
                LocalDataProperty : LOCATION_ID,
                ValueListProperty : 'PRODUCT_ID'
            }
         ]
        }   
    };
};