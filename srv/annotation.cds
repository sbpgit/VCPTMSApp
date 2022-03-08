using cp as service from '../db/data-model';
using cp as pal from '../db/pal-schema';
using V_CLASSCHAR as srv from '../db/data-model';
using V_SALESHCFG_CHARVAL from '../db/data-model';
using V_ODRESTRICT from '../db/data-model';
//using V_TIMESERIES as tssrv from '../db/data-model';
//using V_PRODUCT as prd from '../db/data-model';


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
                Value : LOCATION_ID,
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Description',
                Value : LOCATION_DESC,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Location Type',
                Value : LOCATION_TYPE,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : LATITUDE,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : LONGITUTE,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD1,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD2,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD3,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD4,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RESERVE_FIELD5,
            ![@UI.Importance] : #High
            }
        ]
        // ,
        // HeaderInfo              : {
        //     Title          : {Value : LOCATION_ID},
        //     Description    : {Value : LOCATION_DESC},
        //     TypeName       : 'Location',
        //     TypeNamePlural : 'Location',
        // },
        // HeaderFacets            : [{
        //     $Type             : 'UI.ReferenceFacet',
        //     Target            : '@UI.FieldGroup#Description',
        //     ![@UI.Importance] : #Medium
        // }],
        // FieldGroup #Description : {Data : [{
        //     $Type : 'UI.DataField',
        //     Value : LOCATION_DESC
        // }]},
        // FieldGroup #Details     : {Data : [
        //     {
        //         $Type : 'UI.DataField',
        //         Value : LOCATION_DESC
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : LOCATION_TYPE
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : LATITUDE
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : LONGITUTE
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : RESERVE_FIELD1
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : RESERVE_FIELD2
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : RESERVE_FIELD3
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : RESERVE_FIELD4
        //     },
        //     {
        //         $Type : 'UI.DataField',
        //         Value : RESERVE_FIELD5
        //     }
        // ]}
    }
   // ,

    // // Page Facets
    // UI.Facets : [{
    //     $Type  : 'UI.CollectionFacet',
    //     ID     : 'LocDetails',
    //     Label  : 'Location Details',
    //     Facets : [{
    //         $Type  : 'UI.ReferenceFacet',
    //         Label  : 'Location Details',
    //         Target : '@UI.FieldGroup#Details'
    //     }]
    // }]
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
annotate service.SALESH_CONFIG with @(
    UI        : {
        SelectionFields     : [
            SALES_DOC,
            PRODUCT_ID
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
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHARVAL_NUM
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
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : CHARVAL_NUM
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
            CHAR_NUM
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : WEEK_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CHARVAL_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CLASS_NUM
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
            Description    : {Value : LOCATION_ID},
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
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : CHARVAL_NUM
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
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : CHARVAL_NUM
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
annotate V_CLASSCHAR with @(
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
           /* {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ENTRY_REQ
            },*/
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
);
/*******************************************/
// IBP Future demand Plan
/*******************************************/
annotate service.IBP_FUTUREDEMAND with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem                       : [
            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField',
                Value : WEEK_DATE
            },
            {
                $Type : 'UI.DataField',
                Value : QUANTITY
            }
        ]
    }
);
/*******************************************/
// IBP Future Character Plan
/*******************************************/
annotate service.IBP_FCHARPLAN with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem                       : [
            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CLASS_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField',
                Value : CHARVAL_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField',
                Value : WEEK_DATE
            },
            {
                $Type : 'UI.DataField',
                Value : OPT_PERCENT
            },
            {
                $Type : 'UI.DataField',
                Value :OPT_QTY
            }
        ]
    }
);
/*******************************************/
// IBP Future Character Plan
/*******************************************/
annotate service.IBP_RESULTPLAN with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID,
            OBJ_DEP
        ],
        LineItem                       : [
            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_DEP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : WEEK_Date,
                ![@UI.Importance]   : #High
            }
        ]
    }
);

annotate service.LOCATION_PRODUCT with @(
    UI        : {
        SelectionFields         : [
            LOCATION_ID,
            PRODUCT_ID
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
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Location Type',
                Value : LOTSIZE_KEY
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Location Type',
                Value : LOT_SIZE
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Location Type',
                Value : PROCUREMENT_TYPE
            },
            {
                $Type : 'UI.DataField',
                //Label : 'Location Type',
                Value : PLANNING_STRATEGY
            }
        ],
        HeaderInfo              : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Location-Product',
            TypeNamePlural : 'Location-Product',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [{
            $Type : 'UI.DataField',
            Value : LOTSIZE_KEY
        }]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : LOT_SIZE
            },
            {
                $Type : 'UI.DataField',
                Value : PROCUREMENT_TYPE
            },
            {
                $Type : 'UI.DataField',
                Value : PLANNING_STRATEGY
            }
        ]}
    },

    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'Location Products',
        Label  : 'Location Products',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Location Products',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
// Product Configuration
annotate V_SALESHCFG_CHARVAL with @(
    UI        : {
        SelectionFields         : [
            SALES_DOC,
            DOC_CREATEDDATE,
            PRODUCT_ID
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : SALES_DOC,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : SALESDOC_ITEM,
                ![@UI.Importance]   : #High
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
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : MAT_AVAILDATE
            }

        ],
        HeaderInfo              : {
            Title          : {Value : SALES_DOC},
            Description    : {Value : SALESDOC_ITEM},
            TypeName       : 'Sales History',
            TypeNamePlural : 'Sales History',
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
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID
            }
        ]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : SCHEDULELINE_NUM
            },
            // {
            //     $Type : 'UI.DataField',
            //     Value : REASON_REJ
            // },
            {
                $Type : 'UI.DataField',
                Value : CONFIRMED_QTY
            },
            {
                $Type : 'UI.DataField',
                Value : ORD_QTY
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
                Value : NET_VALUE
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
        ID     : 'saleshisC',
        Label  : 'Sales History Configuration',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Sales History Configuration',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
/*****************************/
// Restrictions OD
/*****************************/
annotate V_ODRESTRICT with @(
    UI        : {
        SelectionFields     : [
            RESTRICTION,
            CLASS_NAME,
            CHAR_NAME
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : RESTRICTION
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : RTR_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CLASS_NAME
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
                Value : CHAR_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : OD_CONDITION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ROW_ID
            }            
        ]
        ,
        HeaderInfo          : {
            Title          : {Value : RESTRICTION},
            Description    : {Value : RTR_COUNTER},
            TypeName       : 'Restrictions',
            TypeNamePlural : 'Restrictions',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : RESTRICTION
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : RTR_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CLASS_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CLASS_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHARVAL_NUM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : OD_CONDITION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ROW_ID
            } 
        ]}
    }//,
    ,
    //Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'restriction',
        Label  : 'Restriction',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Restriction',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

/*************************************/
// Restrictions OD
/*****************************/
annotate service.RESTRICT_HEADER with @(
    UI        : {
        SelectionFields     : [
            LOCATION_ID,
            LINE_ID,
            RESTRICTION
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LINE_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : RESTRICTION
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : RTR_DESC
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_FROM
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : VALID_TO
            }
        ]
        ,
        HeaderInfo          : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : RESTRICTION},
            TypeName       : 'Restrictions',
            TypeNamePlural : 'Restrictions',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : RESTRICTION
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : RTR_DESC
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
    //Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'RESTRICTION',
        Label  : 'Restriction Details',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Restriction Details',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);


/*************************************/
// Restrictions OD
/*****************************/
annotate service.PROD_LOC_LINE with @(
    UI        : {
        SelectionFields     : [
            LOCATION_ID,
            LINE_ID,
            PRODUCT_ID
        ],
        LineItem            : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LINE_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            }
        ],
        HeaderInfo          : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : LOCATION_ID},
            TypeName       : 'Product Lines',
            TypeNamePlural : 'Product Lines',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LINE_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PRODUCT_ID
            }             
        ]}
    },
    //Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'PRODUCT_ID',
        Label  : 'Product Lines',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product Lines',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
/*******************************************/
// IBP Future Character Plan
/*******************************************/
annotate pal.IBP_RESULTPLAN_TS with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID,
            OBJ_DEP
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField',
                Value : CAL_DATE,
                ![@UI.Importance]   : #High
            },            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED 
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_TIME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_STATUS
            }
        ]
    }
);

/*******************************************/
// IBP Future Character Plan
/*******************************************/
annotate service.PROD_ACCNODE with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID,
            ACCESS_NODE
        ],
        LineItem                       : [           
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : ACCESS_NODE
            }
        ]
    }
);
/*******************************************/
// IBP Future Character Plan
/*******************************************/
annotate pal.TS_PREDICTIONS with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID,
            OBJ_DEP
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField',
                Value : CAL_DATE,
                ![@UI.Importance]   : #High
            },            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED 
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_TIME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_STATUS
            }
        ],
            HeaderInfo          : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Object Dependencies Predicted',
            TypeNamePlural : 'Object Dependencies Predicted',
        },
        FieldGroup #Details : {Data : [
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : CAL_DATE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_DEP
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_COUNTER
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : MODEL_TYPE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : MODEL_VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : MODEL_PROFILE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED 
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_TIME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_STATUS
            }         
        ]}
    },
    //Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'OBJ_DEP',
        Label  : 'Object Dependencies Predicted',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Object Dependencies Predicted',
            Target : '@UI.FieldGroup#Details'
        }]
    }]

);
/*******************************************/
// IBP Future Character Plan View
/*******************************************/
annotate V_FCHARPLAN with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem                       : [
            
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : CLASS_NAME
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_NAME
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : VERSION
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCENARIO
            },
            {
                $Type : 'UI.DataField',
                Value : WEEK_DATE
            },
            {
                $Type : 'UI.DataField',
                Value : OPT_PERCENT
            },
            {
                $Type : 'UI.DataField',
                Value :OPT_QTY
            }
        ]
    }
);