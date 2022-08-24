using cp as service from '../db/data-model';
using cp as pal from '../db/pal-schema';
using V_SALESHCFG_CHARVAL from '../db/data-model';
using V_JOBSTATUS from '../db/jobscheduler';


// Product annotations
annotate service.PRODUCT with @(
    UI        : {
        SelectionFields                : [
            PRODUCT_ID,
            PROD_SERIES
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField', 
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : PROD_DESC,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_FAMILY,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : PROD_SERIES,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_MODEL,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : PROD_MDLRANGE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : AUTH_GROUP,
                ![@UI.Importance]   : #High
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
        
    }
);


// Customer Group annotations
annotate service.CUSTOMERGROUP with @(
    UI        : {
        SelectionFields         : [CUSTOMER_GROUP],
        LineItem                : [
            {
                Label : 'Customer Group',
                Value : CUSTOMER_GROUP,
                ![@UI.Importance]   : #High
            },
            {
                Label : 'Description',
                Value : CUSTOMER_DESC,
                ![@UI.Importance]   : #High
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

// // Product attributes
// annotate service.PROD_ATTRIBUTES with @(
//     UI        : {
//         SelectionFields     : [
//             PRODUCT_ID,
//             PROD_FAMILY
//         ],
//         LineItem            : [
//             {
//                 $Type : 'UI.DataField', 
//                 Value : PRODUCT_ID,
//                 ![@UI.Importance]   : #High
//             },
//             {
//                 $Type : 'UI.DataField', 
//                 Value : PROD_GROUP,
//                 ![@UI.Importance]   : #High
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_FAMILY,
//                 ![@UI.Importance]   : #High
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_SERIES,
//                 ![@UI.Importance]   : #High
//             },
//             {
//                 $Type : 'UI.DataField', 
//                 Value : PROD_MODEL,
//                 ![@UI.Importance]   : #High
//             },
//             {
//                 $Type : 'UI.DataField', 
//                 Value : PROD_MDLRANGE,
//                 ![@UI.Importance]   : #High
//             }
//         ],
//         HeaderInfo          : {
//             Title          : {Value : LOCATION_ID},
//             Description    : {Value : PRODUCT_ID},
//             TypeName       : 'Product',
//             TypeNamePlural : 'Products',
//         },
//         FieldGroup #Details : {Data : [
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_FAMILY
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_GROUP
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_SERIES
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_MODEL
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROD_MDLRANGE
//             }
//         ]}
//     },
//     // Page Facets
//     UI.Facets : [{
//         $Type  : 'UI.CollectionFacet',
//         ID     : 'ProdaTR',
//         Label  : 'Product Attributes',
//         Facets : [{
//             $Type  : 'UI.ReferenceFacet',
//             Label  : 'Product Attributes',
//             Target : '@UI.FieldGroup#Details'
//         }]
//     }]
// );

// Product Configuration



// Sales configuration summary
annotate service.SALESH_CFG_SMRY with @(
    UI        : {
        SelectionFields         : [
            WEEK_DATE,
            CHAR_NUM
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField', 
                Value : WEEK_DATE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_NUM,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : CHARVAL_NUM,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : CLASS_NUM,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : CUSTOMER_GROUP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
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
// annotate service.PIR_CH with @(
//     UI        : {
//         SelectionFields         : [
//             PRODUCT_ID,
//             PLANT
//         ],
//         LineItem                : [
//             {
//                 $Type : 'UI.DataField', 
//                 Value : PRODUCT_ID
//             },
//             {
//                 $Type : 'UI.DataField', 
//                 Value : PLANT
//             },
//             {
//                 $Type : 'UI.DataField', 
//                 Value : CHAR_NAME
//             },
//             {
//                 $Type : 'UI.DataField', 
//                 Value : CHAR_VALUE
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : CH_QTY
//             }

//         ],
//         HeaderInfo              : {
//             Title          : {Value : PRODUCT_ID},
//             Description    : {Value : PLANT},
//             TypeName       : 'PIR Char',
//             TypeNamePlural : 'PIR Chars',
//         },
//         HeaderFacets            : [{
//             $Type             : 'UI.ReferenceFacet',
//             Target            : '@UI.FieldGroup#Description',
//             ![@UI.Importance] : #Medium
//         }],
//         FieldGroup #Description : {Data : [{
//             $Type : 'UI.DataField',
//             Value : PLANT
//         }]},
//         FieldGroup #Details     : {Data : [
//             {
//                 $Type : 'UI.DataField',
//                 Value : REQ_DATE
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PT_NUMBER
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PT_LINE
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : SESSION_ID
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : CHAR_NAME
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : CHAR_VALUE
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : FLAG_USAGE
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PROCESS_FLAG
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : CH_QTY
//             },
//             {
//                 $Type : 'UI.DataField',
//                 Value : PLANT
//             }
//         ]},

//     },
//     // Page Facets
//     UI.Facets : [{
//         $Type  : 'UI.CollectionFacet',
//         ID     : 'PIRDetails',
//         Label  : 'PIR Config Details',
//         Facets : [{
//             $Type  : 'UI.ReferenceFacet',
//             Label  : 'PIR Config Details',
//             Target : '@UI.FieldGroup#Details'
//         }]
//     }]
// );

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
                Value : CAL_DATE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_TYPE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product ID',
                Value : OBJ_DEP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Description',
                Value : OBJ_COUNTER,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SUCCESS,
                ![@UI.Importance]   : #High
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
                $Type : 'UI.DataField', 
                Value : CAL_DATE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : OBJ_TYPE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : OBJ_DEP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : OBJ_COUNTER,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : ROW_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : SUCCESS,
                ![@UI.Importance]   : #High
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

annotate service.LOCATION_PRODUCT with @(
    UI        : {
        SelectionFields         : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : LOTSIZE_KEY,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : LOT_SIZE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : PROCUREMENT_TYPE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : PLANNING_STRATEGY,
                ![@UI.Importance]   : #High
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
        ID     : 'LocationProducts',
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
                Value : DOC_CREATEDDATE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : SCHEDULELINE_NUM,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CUSTOMER_GROUP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : ORD_QTY,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : NET_VALUE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : MAT_AVAILDATE,
                ![@UI.Importance]   : #High
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

/*******************************************/
// Product Accessnode
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
                Value : OBJ_TYPE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_DEP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : OBJ_COUNTER,
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
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED ,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_TIME,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Family',
                Value : PREDICTED_STATUS,
                ![@UI.Importance]   : #High
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
                Value : CLASS_NAME,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', //Label : 'Product Series',
                Value : CHAR_NAME,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : CHAR_VALUE,
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
                Value : WEEK_DATE,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : OPT_PERCENT,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value :OPT_QTY,
                ![@UI.Importance]   : #High
            }
        ]
    }
);
//Auth object annotations
annotate service.USER_AUTHOBJ with @(
    UI        : {
        SelectionFields                : [
            USER,
            AUTH_GROUP
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField', 
                Value : USER,
                ![@UI.Importance]   : #High
            },{
                $Type : 'UI.DataField', 
                Value : PARAMETER,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : AUTH_GROUP,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : DESCRIPTION,
                ![@UI.Importance]   : #High
            }
        ],
        HeaderInfo                     : {
            Title          : {Value : USER},
            Description    : {Value : AUTH_GROUP},
            TypeName       : 'Authorization',
            TypeNamePlural : 'Authorizations'
        },
        // HeaderFacets            : [{
        //     $Type             : 'UI.ReferenceFacet',
        //     Target            : '@UI.FieldGroup#Description',
        //     ![@UI.Importance] : #Medium
        // }],
        // FieldGroup #Description : {Data : [{
        //     $Type : 'UI.DataField',
        //     Value : DESCRIPTION
        // }]}
        //,
        FieldGroup #Details            : {Data : [
            {
                $Type : 'UI.DataField',
                Value : USER
            },
            {
                $Type : 'UI.DataField',
                Value : PARAMETER
            },
            {
                $Type : 'UI.DataField',
                Value : AUTH_GROUP
            },
            {
                $Type : 'UI.DataField',
                Value : DESCRIPTION
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'USERAUTH',
        Label  : 'User Authorization',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'User Authorization',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
/*******************************************/
// Job Status
/*******************************************/
annotate V_JOBSTATUS with @(
    UI        : {
        SelectionFields         : [
            JOB_ID,
            RUN_STATE,
            RUN_STATUS,
            CRITICALSTATUS
        ],
        LineItem                : [
            {
                $Type : 'UI.DataField',
                Value : JOB_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : JOB_NAME,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : SCH_STARTTIME,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : SCH_END_TIME,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RUN_STATUS,
                Criticality : CRITICALSTATUS,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField',
                Value : RUN_STATE,
                Criticality : CRITICALSTATE,
                ![@UI.Importance]   : #High
            }
        ],
        HeaderInfo              : {
            Title          : {Value : JOB_ID},
            Description    : {Value : JOB_NAME},
            TypeName       : 'Job Logs',
            TypeNamePlural : 'Job Logs',
        },
        HeaderFacets            : [{
            $Type             : 'UI.ReferenceFacet',
            Target            : '@UI.FieldGroup#Description',
            ![@UI.Importance] : #Medium
        }],
        FieldGroup #Description : {Data : [{
            $Type : 'UI.DataField',
            Value : RUN_STATE
        }]},
        FieldGroup #Details     : {Data : [
            {
                $Type : 'UI.DataField',
                Value : JOB_DES
            },
            {
                $Type : 'UI.DataField',
                Value : ACTION
            },
            {
                $Type : 'UI.DataField',
                Value : SCH_STARTTIME
            },
            {
                $Type : 'UI.DataField',
                Value : SCH_END_TIME
            },
            {
                $Type : 'UI.DataField',
                Value : SCH_TIME
            },
            {
                $Type : 'UI.DataField',
                Value : SCH_NEXTRUN
            },
            {
                $Type : 'UI.DataField',
                Value : RUN_ID
            },
            {
                $Type : 'UI.DataField',
                Value : RUN_STATUS
            },
            {
                $Type : 'UI.DataField',
                Value : STATUS_MESSAGE
            },
            {
                $Type : 'UI.DataField',
                Value : SCHEDULED_TIMESTAMP
            },
            {
                $Type : 'UI.DataField',
                Value : COMPLETED_TIMESTAMP
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'Joblogs',
        Label  : 'Job Scheduler Logs',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Job Logs',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);
//Location Product Line
annotate service.PROD_LOC_LINE with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField', 
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },{
                $Type : 'UI.DataField', 
                Value : LINE_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            }
        ],
        HeaderInfo                     : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Authorization',
            TypeNamePlural : 'Authorizations'
        },
        FieldGroup #Details            : {Data : [
            {
                $Type : 'UI.DataField',
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField',
                Value : LINE_ID
            },
            {
                $Type : 'UI.DataField',
                Value : PRODUCT_ID
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'PRODLINE',
        Label  : 'Location-Product-Line',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Location-Product-Line',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);

//Product restrictions
annotate service.PRODRESTRICT with @(
    UI        : {
        SelectionFields                : [
            LOCATION_ID,
            PRODUCT_ID,
            RESTRICTION
        ],
        LineItem                       : [
            {
                $Type : 'UI.DataField', 
                Value : LOCATION_ID,
                ![@UI.Importance]   : #High
            },
            {
                $Type : 'UI.DataField', 
                Value : PRODUCT_ID,
                ![@UI.Importance]   : #High
            },{
                $Type : 'UI.DataField', 
                Value : RESTRICTION,
                ![@UI.Importance]   : #High
            },{
                $Type : 'UI.DataField', 
                Value : RTR_QTY,
                ![@UI.Importance]   : #High
            },{
                $Type : 'UI.DataField', 
                Value : VALID_FROM,
                ![@UI.Importance]   : #High
            },{
                $Type : 'UI.DataField', 
                Value : VALID_TO,
                ![@UI.Importance]   : #High
            }
        ],
        HeaderInfo                     : {
            Title          : {Value : LOCATION_ID},
            Description    : {Value : PRODUCT_ID},
            TypeName       : 'Prod. Restriction',
            TypeNamePlural : 'Prod. Restrictions'
        },
        FieldGroup #Details            : {Data : [
            {
                $Type : 'UI.DataField', 
                Value : LOCATION_ID
            },
            {
                $Type : 'UI.DataField', 
                Value : PRODUCT_ID
            },{
                $Type : 'UI.DataField', 
                Value : RESTRICTION
            },{
                $Type : 'UI.DataField', 
                Value : RTR_QTY
            },{
                $Type : 'UI.DataField', 
                Value : VALID_FROM
            },{
                $Type : 'UI.DataField', 
                Value : VALID_TO
            }
        ]}
    },
    // Page Facets
    UI.Facets : [{
        $Type  : 'UI.CollectionFacet',
        ID     : 'PRODRTR',
        Label  : 'Product Restrictions',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Product Restrictions',
            Target : '@UI.FieldGroup#Details'
        }]
    }]
);