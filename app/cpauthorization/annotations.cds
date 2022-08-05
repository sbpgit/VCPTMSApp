using CatalogService as service from '../../srv/cat-service';
annotate service.getParameters with {
  PARAMETER @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Parameter',
            CollectionPath : 'getParameters',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : PARAMETER,
                ValueListProperty : 'PARAMETER'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'PARAMETER_VAL'
            }
            ]
        }   
    };
};