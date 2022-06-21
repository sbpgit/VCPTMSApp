using CatalogService as service from '../../srv/cat-service';
annotate service.getCustgroup with {
    CUSTOMER_GROUP @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Products',
            CollectionPath : 'getCustgroup',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : CUSTOMER_GROUP,
                ValueListProperty : 'CUSTOMER_GROUP'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'CUSTOMER_DESC'
            }
         ]
        }   
    }; 
};