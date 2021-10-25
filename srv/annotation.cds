using my.timeseries as srv from '../db/data-model';


// Product annotations
annotate srv.odTimeSeries with @(UI: {
    SelectionFields : [objectDependency,calDate],
    LineItem        : [
        {
            $Type : 'UI.DataField',//Label : 'Product ID',
            Value : objectDependency
        },
        {
            $Type : 'UI.DataField',//Label : 'Description',
            Value : calDate
        },
        {
            $Type : 'UI.DataField',//Label : 'Product Family',
            Value : success
        }/*,
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att1
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att2
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att3
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att4
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att5
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att6
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att7
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att8
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att9
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att10
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att11
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
          Value : att12
        }*/
    ],
    HeaderInfo          :{
        Title          : {Value : objectDependency},
        Description    : {Value : calDate},
        TypeName       : 'Object Dependency',
        TypeNamePlural : 'Object Dependencies',
    },    
   HeaderFacets                   : [
    {
        $Type             : 'UI.ReferenceFacet',
        Target            : '@UI.FieldGroup#AdministrativeData',
        ![@UI.Importance] : #Medium
    }
    ],
        
    FieldGroup #AdministrativeData : {Data : [

        {
            $Type             : 'UI.DataField',
            Value             : success,
            //![@UI.Importance] : #Medium
        },
        {
            $Type : 'UI.DataField',
            Value : att1
        },
        {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att2
        },
        {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att3
        },
        {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att4
        },
        {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att5
        },
        {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att6
        },
        {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att7
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att8
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att9
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att10
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att11
        },
       {
           $Type : 'UI.DataField',//Label : 'Product Series',
           Value : att12
        }
        ]}
},
// Page Facets
   /* UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'ObjDep',
        Label  : 'Timeseries',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product Details',
            Target : '@UI.FieldGroup#Details'
        }]
    }]*/
    );