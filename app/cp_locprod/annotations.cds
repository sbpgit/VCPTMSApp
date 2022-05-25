using CatalogService as service from '../../srv/cat-service';

annotate service.getLocProd with {
  LOCATION_ID @Common : {
        Text            : LOCATION_ID_LOCATION_ID,
        TextArrangement : #TextOnly,
        //insert your value list here 
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Location',
            CollectionPath : 'getLocation',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : LOCATION_ID.LOCATION_ID,
                ValueListProperty : 'LOCATION_ID'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'LOCATION_TYPE'
            }

            ]

        }      

    };  
};