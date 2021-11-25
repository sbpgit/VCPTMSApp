using cp as service from '../db/data-model';
//using V_CLASSCHAR as srv from '../db/data-model';
//using V_TIMESERIES as tssrv from '../db/data-model';
//using V_PRODUCT as prd from '../db/data-model';

// Product annotations
annotate service.odTimeSeries with @(UI : {
    SelectionFields                : [
        objectDependency,
        calDate
    ],
    LineItem                       : [
        {
            $Type : 'UI.DataField', //Label : 'Product ID',
            Value : objectDependency
        },
        {
            $Type : 'UI.DataField', //Label : 'Description',
            Value : calDate
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Family',
            Value : success
        }
    ],
    HeaderInfo                     : {
        Title          : {Value : objectDependency},
        Description    : {Value : calDate},
        TypeName       : 'Object Dependency',
        TypeNamePlural : 'Object Dependencies',
    },
    HeaderFacets                   : [{
        $Type             : 'UI.ReferenceFacet',
        Target            : '@UI.FieldGroup#AdministrativeData',
        ![@UI.Importance] : #Medium
    }],

    FieldGroup #AdministrativeData : {Data : [

        {
            $Type : 'UI.DataField',
            Value : success,
        //![@UI.Importance] : #Medium
        },
        {
            $Type : 'UI.DataField',
            Value : att1
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att2
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att3
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att4
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att5
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att6
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att7
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att8
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att9
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att10
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att11
        },
        {
            $Type : 'UI.DataField', //Label : 'Product Series',
            Value : att12
        }
    ]}
});
/**
 * ***
 */


// Product annotations
annotate service.PRODUCT with @(
    UI        : {
        SelectionFields                : [
            PRODUCT_ID,
            PROD_SERIES
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : PROD_DESC
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PROD_FAMILY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PROD_SERIES
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_MODEL
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_MDLRANGE
            }
        ],
        HeaderInfo                     : {
            Title          : {Value : PRODUCT_ID},
            Description    : {Value : PROD_DESC},
            TypeName       : 'Product',
            TypeNamePlural : 'Products'
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
    }]
);

//////////////////////////////////////////////////////////////////////
//******************************************************************//
//////////////////////////////////////////////////////////////////////
annotate service.LOCATION with @(
    UI        : {
        SelectionFields         : [
            LOCATION_ID,
            LOCATION_TYPE
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField',
                //Label : 'Location ID',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Description',
                Value : LOCATION_DESC
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Location Type',
                Value : LOCATION_TYPE
            }
        ],
        HeaderInfo              : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : LOCATION_DESC},
            TypeName       : 'Location',
            TypeNamePlural : 'Location',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [{
            $Type : 'UI.DataField',
            Value : LOCATION_DESC
        }]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : LOCATION_DESC
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_TYPE
            },
            {
                $Type : 'UI.DataField',
                Value : LATITUDE
            },
            {
                $Type : 'UI.DataField',
                Value : LONGITUTE
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
        ID     : 'LocDetails',
        Label  : 'Location Details',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Location Details',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);


// Customer Group annotations
annotate service.CUSTOMERGROUP with @(
    UI        : {
        SelectionFields         : [CUSTOMER_GROUP],
        LineItem                : [
            {
                Label : 'Customer Group',
                Value : CUSTOMER_GROUP
            },
            {
                Label : 'Description',
                Value : CUSTOMER_DESC
            }
        ],
        HeaderInfo              : {
            Title          : {Value : CUSTOMER_GROUP},
            Description    : {Value : CUSTOMER_DESC},
            TypeName       : 'Customer Group',
            TypeNamePlural : 'Customer Groups',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium,

        }],
        FieldGroup #Description : {Data : [
            {
                $Type : 'UI.DataField',
                Value : CUSTOMER_GROUP
            },
            {
                $Type : 'UI.DataField',
                Value : CUSTOMER_DESC
            },
        ]},
        FieldGroup #Details     : {Data : [{
                $Type : 'UI.DataField',
                Value : CUSTOMER_DESC
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
        ID     : 'custDetails',
        Label  : 'Customer Group Details',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Customer Group Details',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

// Product attributes
annotate service.PROD_ATTRIBUTES with @(
    UI        : {
        SelectionFields     : [
            PRODUCT_ID,
            PROD_FAMILY
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : PROD_GROUP
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PROD_FAMILY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PROD_SERIES
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PROD_MODEL
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PROD_MDLRANGE
            }
        ],
        HeaderInfo          : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Product',
            TypeNamePlural : 'Products',
        },
        FieldGroup #Details : {Data : [
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
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'ProdaTR',
        Label  : 'Product Attributes',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product Attributes',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

// Product Configuration
/*annotate service.PROD_CONFIG with @(
    UI        : {
        SelectionFields     : [
            PRODUCT_ID,
            CHAR_NAME,
            CHAR_ATTR
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CLASS
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHARVAL_DESC
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_ATTR
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_DESC
            }

        ],
        HeaderInfo          : {
            Title          : {Value : PRODUCT_ID},
            Description    : {Value : LOCATION_ID},
            TypeName       : 'Product',
            TypeNamePlural : 'Products',
        },
        /*  HeaderFacets                   : [
         {
              $Type             : 'UI.ReferenceFacet',
              Target            : '@UI.FieldGroup#Description',
              ![@UI.Importance] : #Medium
          },
          {
              $Type             : 'UI.ReferenceFacet',
              Target            : '@UI.FieldGroup#AdministrativeData',
              ![@UI.Importance] : #Medium
          }
          ], */
        /*FieldGroup #Description        : {Data : [
        {
            $Type : 'UI.DataField',
            Value : PRODDESC
        }
        ]},*/
    /*    FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField',
                Value : CLASS
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField',
                Value : CHARVAL_DESC
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_ATTR
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_DESC
            },
            {
                $Type : 'UI.DataField',
                Value : CUSTOMER_GROUP
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'ProdCfg',
        Label  : 'Product Configurations',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product Configurations',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);*/

// Product Configuration
annotate service.SALESH with @(
    UI        : {
        SelectionFields         : [
            SALES_DOC,
            DOC_CREATEDDATE,
            PRODUCT_ID
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : SALES_DOC
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : SALESDOC_ITEM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : DOC_CREATEDDATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCHEDULELINE_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CUSTOMER_GROUP
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ORD_QTY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : NET_VALUE
            }

        ],
        HeaderInfo              : {
            Title          : {Value : SALES_DOC},
            Description    : {Value : SALESDOC_ITEM},
            TypeName       : 'Product',
            TypeNamePlural : 'Products',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [
            {
                $Type : 'UI.DataField',
                Value : DOC_CREATEDDATE
            },
            {
                $Type : 'UI.DataField',
                Value : SCHEDULELINE_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : CONFIRMED_QTY
            }
        ]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField',
                Value : REASON_REJ
            },
            {
                $Type : 'UI.DataField',
                Value : UOM
            },
            {
                $Type : 'UI.DataField',
                Value : MAT_AVAILDATE
            },
            {
                $Type : 'UI.DataField',
                Value : CUSTOMER_GROUP
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField',
                Value : ORD_QTY
            },
            {
                $Type : 'UI.DataField',
                Value : NET_VALUE
            },
            {
                $Type : 'UI.DataField',
                Value : DOC_CREATEDDATE
            },
            {
                $Type : 'UI.DataField',
                Value : SCHEDULELINE_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : CONFIRMED_QTY
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'saleshis',
        Label  : 'Sales History',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Sales History',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

// SALES History configuration
/*annotate service.SALESH_CONFIG with @(
    UI        : {
        SelectionFields     : [
            SALES_DOC,
            PRODUCT_ID,
            CHAR_NAME
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : SALES_DOC
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : SALESDOC_ITEM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PROD_AVAILDATE
            }

        ],
        HeaderInfo          : {
            Title          : {Value : SALES_DOC},
            Description    : {Value : SALESDOC_ITEM},
            TypeName       : 'Sales Doc',
            TypeNamePlural : 'Sales Documents',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_AVAILDATE
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'salescfg',
        Label  : 'Sales History Configuration',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Sales History Configuration',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
); 
// Sales configuration summary
annotate service.SALESH_CFG_SMRY with @(
    UI        : {
        SelectionFields         : [
            WEEK_DATE,
            CHAR_NAME
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : WEEK_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CLASS
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CUSTOMER_GROUP
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : LOCATION_ID
            }

        ],
        HeaderInfo              : {
            Title          : {Value : WEEK_DATE},
            Description    : {Value : CLASS},
            TypeName       : 'Class',
            TypeNamePlural : 'Classes',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [
            {
                $Type : 'UI.DataField',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE
            }
        ]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField',
                Value : CUSTOMER_GROUP
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField',
                Value : SALEHIST_PROD
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'salescfg',
        Label  : 'Sales History',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Sales History',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
*/
//PIR
annotate service.PIR_CH with @(
    UI        : {
        SelectionFields         : [
            PRODUCT_ID,
            PLANT
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : PLANT
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CH_QTY
            }

        ],
        HeaderInfo              : {
            Title          : {Value : PRODUCT_ID},
            Description    : {Value : PLANT},
            TypeName       : 'PIR Char',
            TypeNamePlural : 'PIR Chars',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [{
            $Type : 'UI.DataField',
            Value : PLANT
        }]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : REQ_DATE
            },
            {
                $Type : 'UI.DataField',
                Value : PT_NUMBER
            },
            {
                $Type : 'UI.DataField',
                Value : PT_LINE
            },
            {
                $Type : 'UI.DataField',
                Value : SESSION_ID
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField',
                Value : FLAG_USAGE
            },
            {
                $Type : 'UI.DataField',
                Value : PROCESS_FLAG
            },
            {
                $Type : 'UI.DataField',
                Value : CH_QTY
            },
            {
                $Type : 'UI.DataField',
                Value : PLANT
            }
        ]},

    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'PIRDetails',
        Label  : 'PIR Config Details',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'PIR Config Details',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

//BOM Object Dependency
annotate service.BOM_OBJDEPENDENCY with @(
    UI        : {
        SelectionFields     : [
            PRODUCT_ID,
            LOCATION_ID
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : ITEM_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : COMPONENT
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_FROM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_TO
            }
        ],
        HeaderInfo          : {
            Title          : {Value : PRODUCT_ID},
            Description    : {Value : LOCATION_ID},
            TypeName       : 'Product',
            TypeNamePlural : 'Products',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField',
                Value : ITEM_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField',
                Value : COMPONENT
            },
            {
                $Type : 'UI.DataField',
                Value : OBJDEP_DESC
            },
            {
                $Type : 'UI.DataField',
                Value : COMP_QTY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_FROM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_TO
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'bomod',
        Label  : 'BOM Object Dependency',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'BOM Object Dependency',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

//BOM Header
annotate service.BOMHEADER with @(
    UI        : {
        SelectionFields     : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : ITEM_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : COMPONENT
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : COMP_QTY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_FROM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_TO
            }
        ],
        HeaderInfo          : {
            Title          : {Value : PRODUCT_ID},
            Description    : {Value : LOCATION_ID},
            TypeName       : 'Product BOM',
            TypeNamePlural : 'Products BOM',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField',
                Value : ITEM_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : COMPONENT
            },
            {
                $Type : 'UI.DataField',
                Value : COMP_QTY
            },
            {
                $Type : 'UI.DataField',
                Value : VALID_FROM
            },
            {
                $Type : 'UI.DataField',
                Value : VALID_TO
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'prdbom',
        Label  : 'Product BOM',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product BOM',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

//TS_OBJHEADER
annotate service.TS_OBJDEPHDR with @(
    UI        : {
        SelectionFields     : [
            CAL_DATE,
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CAL_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SUCCESS
            }
        ],
        HeaderInfo          : {
            Title          : {Value : CAL_DATE},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Timeseries',
            TypeNamePlural : 'Timeseries',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CAL_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SUCCESS
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'Timeser',
        Label  : 'Timeseries',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Timeseries',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

//TS_OBJDEP_CHARHDR
annotate service.TS_OBJDEP_CHARHDR with @(
    UI        : {
        SelectionFields     : [
            CAL_DATE,
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CAL_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ROW_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SUCCESS
            }
        ],
        HeaderInfo          : {
            Title          : {Value : CAL_DATE},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Timeseries',
            TypeNamePlural : 'Timeseries',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CAL_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ROW_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SUCCESS
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'Timeser',
        Label  : 'Timeseries',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Timeseries',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
//TS_OBJDEP_CHARHDR
/*annotate V_CLASSCHAR with @(
    UI        : {
        SelectionFields     : [
            CLASS_NAME,
            CLASS_DESC,
            CHAR_NAME
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CLASS_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CLASS_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : CLASS_DESC
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : CHAR_GROUP
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_CATGRY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ENTRY_REQ
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : AUTHGROUP
            }
        ],
        HeaderInfo          : {
            Title          : {Value : CLASS_NAME},
            Description    : {Value : CHAR_NAME},
            TypeName       : 'Class Characteristic',
            TypeNamePlural : 'Class Characteristic',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CLASS_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CLASS_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : CLASS_DESC
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_DESC
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : CHAR_GROUP
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_CATGRY
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ENTRY_REQ
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : AUTHGROUP
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'classchar',
        Label  : 'Class Characteristic',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Class Characteristic',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);*/
