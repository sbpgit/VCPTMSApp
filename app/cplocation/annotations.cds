using CatalogService as service from '../../srv/cat-service';

annotate service.getLocation with {
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
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'LOCATION_DESC'
            }
            ]
        }   
    };
};