using CatalogService as service from '../../srv/cat-service';

annotate service.getARObj with @odata.draft.enabled;
annotate service.getAEmpRole ;

annotate service.getARObj with @(
    UI.SelectionFields : [
        ROLE_ID,
        PARAMETER
    ],
    UI.LineItem     : [
        {
            $Type : 'UI.DataField',
            Value : ROLE_ID,
        },
        {
            $Type : 'UI.DataField',
            Value : PARAMETER,
        },
        {
            $Type : 'UI.DataField',
            Value : PARAMETER_VAL,
        }
    ]
);

annotate service.getARObj with @(
    UI.HeaderInfo                     : {
            Title          : {Value : ROLE_ID},
            Description    : {Value : PARAMETER},
            TypeName       : 'Role',
            TypeNamePlural : 'Role'
        },
    UI.FieldGroup #Details : {
        Data  : [{
            $Type : 'UI.DataField',
            Value : PARAMETER_VAL,
        }],
    }
);

annotate service.getARObj with @(
UI.Facets : [
    {
        $Type  : 'UI.CollectionFacet',
        ID     : 'Roles',
        Label  : 'Role Details',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Role Details',
            Target : '@UI.FieldGroup#Details'
        }]
    },
    {
    $Type  : 'UI.ReferenceFacet',
    Label  : 'Role Assignment',
    Target : 'ROLE/@UI.LineItem'
}]);

annotate service.getAEmpRole with @UI : {

    LineItem               : [
        {
            $Type : 'UI.DataField',
            Value : USER,
        },
        {
            $Type : 'UI.DataField',
            Value : ROLE_ID,
        }
    ]
};
