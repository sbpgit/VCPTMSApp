using CatalogService as service from '../../srv/cat-service';

annotate service.getFactoryLoc with {
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
            CollectionPath : 'getLocProd',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : PRODUCT_ID,
                ValueListProperty : 'PRODUCT_ID'
            },
            {
                $Type             : 'Common.ValueListParameterIn',
                LocalDataProperty : LOCATION_ID,
                ValueListProperty : 'LOCATION_ID',
            }
         ]
        }   
    }; 
    PLAN_LOC @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Location',
            CollectionPath : 'getLocation',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : PLAN_LOC,
                ValueListProperty : 'LOCATION_ID'
            }
            ]
        }   
    };
    FACTORY_LOC @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Location',
            CollectionPath : 'getLocation',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : FACTORY_LOC,
                ValueListProperty : 'LOCATION_ID'
            }
            ]
        }   
    }; 
};