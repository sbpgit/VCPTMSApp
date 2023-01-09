using {
    managed,
    cuid,
    sap.common
} from '@sap/cds/common';

context cp {
    // Table for Location
    entity LOCATION {
        key LOCATION_ID    : String(4)      @title : 'Location ';
            LOCATION_DESC  : String(30)     @title : 'Location Descritpion';
            LOCATION_TYPE  : String(1)      @title : 'Location Type';
            LATITUDE       : Decimal(10, 8) @title : 'Latitude';
            LONGITUTE      : Decimal(10, 8) @title : 'Longitude';
            RESERVE_FIELD1 : String(20)     @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)     @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)     @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)     @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)     @title : 'Reserve Field5';
            AUTH_GROUP     : String(4)      @title : 'Authorization Group';
    };

    // Customer group
    entity CUSTOMERGROUP {
        key CUSTOMER_GROUP : String(20) @title : 'Customer Group';
            CUSTOMER_DESC  : String(20) @title : 'Customer Description';
            RESERVE_FIELD1 : String(20) @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20) @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20) @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20) @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20) @title : 'Reserve Field5';
            AUTH_GROUP     : String(4)  @title : 'Authorization Group';
    };

    // Product
    entity PRODUCT {
        key PRODUCT_ID     : String(40) @title : 'Product';
            PROD_DESC      : String(40) @title : 'Product Description';
            PROD_FAMILY    : String(30) @title : 'Product Family';
            PROD_GROUP     : String(30) @title : 'Product Group';
            PROD_MODEL     : String(30) @title : 'Product Model';
            PROD_MDLRANGE  : String(30) @title : 'Product Range';
            PROD_SERIES    : String(30) @title : 'Product Series';
            PROD_TYPE      : String(4)  @title : 'Product Type';
            RESERVE_FIELD1 : String(20) @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20) @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20) @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20) @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20) @title : 'Reserve Field5';
            AUTH_GROUP     : String(4)  @title : 'Authorization Group';
    };

    // Product and LOcation table
    entity LOCATION_PRODUCT {
        key LOCATION_ID       : String(4)  @title : 'Location ';
        key PRODUCT_ID        : String(40) @title : 'Product';
            LOTSIZE_KEY       : String(2)  @title : 'Lot Size Key';
            LOT_SIZE          : Integer    @title : 'Lot Size';
            PROCUREMENT_TYPE  : String(1)  @title : 'Procurement Type';
            PLANNING_STRATEGY : String(2)  @title : 'Planning Strategy';
    };

    // BOM header
    entity BOMHEADER {
        key LOCATION_ID : String(4)      @title : 'Location '; //Association to ZLOCATION;//
        key PRODUCT_ID  : String(40)     @title : 'Product';
        key ITEM_NUM    : String(6)      @title : 'Item Number ';
        key COMPONENT   : String(40)     @title : 'Component';
            COMP_QTY    : Decimal(13, 3) @title : 'Component Quantity';
            VALID_FROM  : Date           @title : 'Valid From';
            VALID_TO    : Date           @title : 'Valid To';
    };

    // BOM object dependency
    entity BOM_OBJDEPENDENCY {
        key LOCATION_ID : String(4)      @title : 'Location '; //Association to ZLOCATION;//
        key PRODUCT_ID  : String(40)     @title : 'Product';
        key ITEM_NUM    : String(6)      @title : 'Item Number ';
        key COMPONENT   : String(40)     @title : 'Component';
        key OBJ_DEP     : String(30)     @title : 'Object Dependency';
            OBJDEP_DESC : String(30)     @title : 'Object Dependency Desc';
            COMP_QTY    : Decimal(13, 3) @title : 'Component Quantity';
            VALID_FROM  : Date           @title : 'Valid From';
            VALID_TO    : Date           @title : 'Valid To';
    };


    // Object dependency header
    entity OBJDEP_HEADER {
        key OBJ_DEP      : String(30) @title : 'Object Dependency';
        key OBJ_COUNTER  : Integer    @title : 'Object Dependency Counter';
        key CLASS_NUM    : String(18) @title : 'Internal class number';
        key CHAR_NUM     : String(10) @title : 'Internal Char. number';
        key CHAR_COUNTER : Integer    @title : 'Characteristic counter';
        key CHARVAL_NUM  : String(70) @title : 'Internal Char. number';
            OD_CONDITION : String(2)  @title : 'Object Dependency condition ';
            ROW_ID       : Integer    @title : 'Attribute Index ';
    };

    // PIR Characteristitcs
    // entity PIR_CH {
    //     key PRODUCT_ID   : String(40) @title : 'Product';
    //     key PLANT        : String(4)  @title : 'Plant';
    //     key REQ_DATE     : Date       @title : 'Req Date';
    //     key PT_NUMBER    : String(10) @title : 'PT Number';
    //     key PT_LINE      : String(5)  @title : 'PT Line';
    //     key SESSION_ID   : String(32) @title : 'Session ID';
    //         CHAR_NAME    : String(30) @title : 'Characteristic ';
    //         CHAR_VALUE   : String(70) @title : 'Characteristic Value';
    //         FLAG_USAGE   : String(1)  @title : 'Flag Usage';
    //         CH_QTY       : Double     @title : 'Change Qty';
    //         PROCESS_FLAG : String(1)  @title : 'Process Flag';
    //         CHANGED_DATE : Date       @title : 'Changed Date';
    //         CHANGED_BY   : String(12) @title : 'Changed By';
    //         CREATED_DATE : Date       @title : 'Created Date';
    //         CREATED_BY   : String(12) @title : 'Created By';
    //         CHANGED_TIME : Time       @title : 'Changed Time';
    //         CREATED_TIME : Time       @title : 'Created Time';
    // };

    // Product class
    entity PRODUCT_CLASS {
        key PRODUCT_ID   : String(40) @title : 'Product Id';
        key CLASS_NUM    : String(18) @title : 'Class Num';
            CHANGED_DATE : Date       @title : 'Changed Date';
            CHANGED_BY   : String(12) @title : 'Changed By';
            CREATED_DATE : Date       @title : 'Created Date';
            CREATED_BY   : String(12) @title : 'Created By';
            CHANGED_TIME : Time       @title : 'Changed Time';
            CREATED_TIME : Time       @title : 'Created Time';
    };

    // // Product attributes
    // entity PROD_ATTRIBUTES {
    //     key LOCATION_ID   : String(4)  @title : 'Location ID';
    //     key PRODUCT_ID    : String(40) @title : 'Product Id';
    //         PROD_FAMILY   : String(30) @title : 'Product Family';
    //         PROD_GROUP    : String(30) @title : 'Product group';
    //         PROD_MODEL    : String(30) @title : 'Product Model';
    //         PROD_MDLRANGE : String(30) @title : 'Product Model Range';
    //         PROD_SERIES   : String(30) @title : 'Product Series';
    // };

    // Sales history
    entity SALESH {
        key SALES_DOC         : String(10)     @title : 'Sales Document';
        key SALESDOC_ITEM     : String(6)      @title : 'Sales Document Item';
            DOC_CREATEDDATE   : Date           @title : 'Document Created on';
            SCHEDULELINE_NUM  : String(4)      @title : 'Schedule Line Number';
            PRODUCT_ID        : String(40)     @title : 'Product Id';
            REASON_REJ        : String(2)      @title : 'Reason rejection';
            UOM               : String(3)      @title : 'UOM';
            CONFIRMED_QTY     : Decimal(13, 3) @title : 'Confirmed Qty';
            ORD_QTY           : Decimal(13, 3) @title : 'Order Quantity';
            MAT_AVAILDATE     : Date           @title : 'Material Availability Date';
            NET_VALUE         : Decimal(15, 2) @title : 'Net Value';
            CUSTOMER_GROUP    : String(20)     @title : 'Customer Group';
            LOCATION_ID       : String(4)      @title : 'Location ID';
            SEEDORD_CHK       : String(1)      @title : 'Seed Order Check';
            SALES_ORG         : String(4)      @title : 'Sales Org.';
            DISTR_CHANNEL     : String(2)      @title : 'Distribution Channel';
            DIVISION          : String(2)      @title : 'Division';
            SAL_DOCU_TYPE     : String(4)      @title : 'Sales Doc. Type';
            ITEM_CREATED_DATE : Date;
            ITEM_CHANGE_DATE  : Date;
            OPEN_ORDER        : String(1);
            CHARG             : String(10);
            IBP_CUSTOMER      : String(10);
            RELEVENT_FOR_PLAN : String(1);
            ON_HAND_STOCK     : String(1);
            IN_TRANSIT        : String(1);
            SHIP_FROM_LOC     : String(4);
            RESERVE_FIELD1    : String(20);
            RESERVE_FIELD2    : String(20);
            RESERVE_FIELD3    : String(20);
            CHANGED_DATE      : Date           @title : 'Changed Date';
            CHANGED_BY        : String(12)     @title : 'Changed By';
            CREATED_DATE      : Date           @title : 'Created Date';
            CREATED_BY        : String(12)     @title : 'Created By';
            CHANGED_TIME      : Time           @title : 'Changed Time';
            CREATED_TIME      : Time           @title : 'Created Time';
    };

    // Sales History configuration
    entity SALESH_CONFIG {
        key SALES_DOC     : String(10) @title : 'Sales Document';
        key SALESDOC_ITEM : String(6)  @title : 'Sales Document Item';
        key CHAR_NUM      : String(10) @title : 'Internal number Char.';
            CHARVAL_NUM   : String(70) @title : 'Internal number Char. Value ';
            PRODUCT_ID    : String(40) @title : 'Product Id';
            // PROD_AVAILDATE : Date      @title : 'Prod Availability Date';
            CHANGED_DATE  : Date       @title : 'Changed Date';
            CHANGED_BY    : String(12) @title : 'Changed By';
            CREATED_DATE  : Date       @title : 'Created Date';
            CREATED_BY    : String(12) @title : 'Created By';
            CHANGED_TIME  : Time       @title : 'Changed Time';
            CREATED_TIME  : Time       @title : 'Created Time';
    };

    // Sales History configuration summary
    entity SALESH_CFG_SMRY {
        key WEEK_DATE      : Date           @title : 'Week Date';
        key CHAR_NUM       : String(10)     @title : 'Internal number Char.';
        key CHARVAL_NUM    : String(70)     @title : 'Internal number Char. Value ';
        key CLASS_NUM      : String(18)     @title : 'Internal number class';
        key PRODUCT_ID     : String(40)     @title : 'Product ID';
        key CUSTOMER_GROUP : String(20)     @title : 'Customer Group';
            LOCATION_ID    : String(4)      @title : 'Location ID';
            SALEHIST_PROD  : Decimal(13, 3) @title : 'Confirmed Quantity';
            RESERVE_FIELD1 : String(20)     @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)     @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)     @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)     @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)     @title : 'Reserve Field5';
            CHANGED_DATE   : Date           @title : 'Changed Date';
            CHANGED_BY     : String(12)     @title : 'Changed By';
            CREATED_DATE   : Date           @title : 'Created Date';
            CREATED_BY     : String(12)     @title : 'Created By';
            CHANGED_TIME   : Time           @title : 'Changed Time';
            CREATED_TIME   : Time           @title : 'Created TIme';
    };

    // Sales history summary
    entity SALESH_SUMMARY {
        key WEEK_DATE      : Date           @title : 'Week Date';
        key PRODUCT_ID     : String(40)     @title : 'Product ID';
        key LOCATION_ID    : String(4)      @title : 'Location ID';
        key CUSTOMER_GROUP : String(20)     @title : 'Customer Group';
            DEMAND_PROD    : String(10)     @title : 'Demand';
            SALEHIST_PROD  : Decimal(13, 3) @title : 'Confirmed Quantity';
            RESERVE_FIELD1 : String(20)     @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)     @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)     @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)     @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)     @title : 'Reserve Field5';
            CHANGED_DATE   : Date           @title : 'Changed Date';
            CHANGED_BY     : String(12)     @title : 'Changed By';
            CREATED_DATE   : Date           @title : 'Created Date';
            CREATED_BY     : String(12)     @title : 'Created By';
            CHANGED_TIME   : Time           @title : 'Changed Time';
            CREATED_TIME   : Time           @title : 'Created TIme';
    };

    // Object dep. Timeseries history
    entity TS_OBJDEPHDR {
        key CAL_DATE     : Date       @title : 'Date';
        key LOCATION_ID  : String(4)  @title : 'Location ID';
        key PRODUCT_ID   : String(40) @title : 'Product ID';
        key OBJ_TYPE     : String(2)  @title : 'Object Type';
        key OBJ_DEP      : String(30) @title : 'Object Dependency';
        key OBJ_COUNTER  : Integer    @title : 'Object Counter';
            SUCCESS      : Integer    @title : 'Count';
            SUCCESS_RATE : Double     @title : 'Sucess Rate';
    };

    // Timeseries Object dep. characteristics
    entity TS_OBJDEP_CHARHDR {
        key CAL_DATE     : Date       @title : 'Date';
        key LOCATION_ID  : String(4)  @title : 'Location ID';
        key PRODUCT_ID   : String(40) @title : 'Product ID';
        key OBJ_TYPE     : String(2)  @title : 'Object Type';
        key OBJ_DEP      : String(30) @title : 'Object Dependency';
        key OBJ_COUNTER  : Integer    @title : 'Object Counter';
        key ROW_ID       : Integer    @title : ' Attribute Index';
            SUCCESS      : Integer    @title : 'Count';
            SUCCESS_RATE : Double     @title : 'Sucess Rate';
    };

    // Object dep. characteristics Timeseries- future
    entity TS_OBJDEP_CHARHDR_F {
        key CAL_DATE     : Date       @title : 'Date';
        key LOCATION_ID  : String(4)  @title : 'Location ID';
        key PRODUCT_ID   : String(40) @title : 'Product ID';
        key OBJ_TYPE     : String(2)  @title : 'Object Type';
        key OBJ_DEP      : String(30) @title : 'Object Dependency';
        key OBJ_COUNTER  : Integer    @title : 'Object Counter';
        key ROW_ID       : Integer    @title : ' Attribute Index';
        key VERSION      : String(10) @title : 'Version';
        key SCENARIO     : String(32) @title : 'Scenario';
            SUCCESS      : Integer    @title : 'Count';
            SUCCESS_RATE : Double     @title : 'Sucess Rate';
    };

    // Classes
    entity CLASS {
        key CLASS_NUM   : String(18)  @title : 'Internal class number';
            CLASS_NAME  : String(20)  @title : 'Class Name';
            CLASS_TYPE  : String(3)   @title : 'Class Type';
            CLASS_DESC  : String(150) @title : 'Class Description';
            IBPCHAR_CHK : Boolean     @title : 'IBP Characteristics check';
            AUTHGROUP   : String(4)   @title : 'Authorization Group';
    };

    //Characteristitcs
    entity CHARACTERISTICS {
        key CLASS_NUM   : String(18)  @title : 'Internal class number';
        key CHAR_NUM    : String(10)  @title : 'Internal Char. number';
            CHAR_NAME   : String(30)  @title : 'Charateristic Name';
            CHAR_DESC   : String(150) @title : 'Charateristic Desc.';
            CHAR_GROUP  : String(10)  @title : 'Charateristic Group';
            CHAR_TYPE   : String(4)   @title : 'Charateristic Type';
            ENTRY_REQ   : String(1)   @title : 'Entry request';
            CHAR_CATGRY : String(40)  @title : 'Charateristic Category';
    };

    // Characteristic Values
    entity CHAR_VALUES {
        key CHAR_NUM     : String(10)  @title : 'Internal Char. number';
        key CHARVAL_NUM  : String(70)  @title : 'Internal Char. number';
            CHAR_VALUE   : String(70)  @title : 'Charateristic Value';
            CHARVAL_DESC : String(150) @title : 'Charateristic Value Desc.';
            CATCH_ALL    : String(1)   @title : 'Catch all';
    };

    // PVS node master
    entity PVS_NODES : managed {
        key CHILD_NODE   : String(50); // @title : 'Child Node';
        key PARENT_NODE  : String(50); // @title : 'Parent Node';
            ACCESS_NODES : String(50);
            NODE_TYPE    : String(2); //  @title : 'Node Type';
            NODE_DESC    : String(200); //@tile  : 'Node Descriptions';
            AUTH_GROUP   : String(4); //  @title : 'Authorization Group';
            UPPERLIMIT   : Integer;
            LOWERLIMIT   : Integer;
    };

    // Product Access nodes
    entity PROD_ACCNODE : managed {
        key LOCATION_ID : String(4)  @title : 'Location ID';
        key PRODUCT_ID  : String(40) @title : 'Product ID';
            ACCESS_NODE : String(50) @title : 'Access Node';
    };

    // PVS for BOM
    entity PVS_BOM : managed {
        key LOCATION_ID : String(4)  @title : 'Location ID';
        key PRODUCT_ID  : String(40) @title : 'Product ID';
        key ITEM_NUM    : String(6)  @title : 'Item Number ';
        key COMPONENT   : String(40) @title : 'Component';
            STRUC_NODE  : String(50) @title : 'Structure Node'
    }

    // Order count on weekly basis for a location
    entity TS_ORDERRATE : managed {
        key WEEK_DATE   : Date      @title : 'Date';
        key LOCATION_ID : String(4) @title : 'Location ID';
            ORDER_COUNT : Integer   @title : 'Order Count';
    }

    // IBP Future demand
    entity IBP_FUTUREDEMAND {
        key LOCATION_ID : String(4)      @title : 'Location ID';
        key PRODUCT_ID  : String(40)     @title : 'Product ID';
        key VERSION     : String(10)     @title : 'Version';
        key SCENARIO    : String(32)     @title : 'Scenario';
        key WEEK_DATE   : Date           @title : 'Weekly Date';
            QUANTITY    : Decimal(13, 3) @title : 'Demand Quantity';
    }

    // IBp Future characteristic plan
    entity IBP_FCHARPLAN {
        key LOCATION_ID  : String(4)      @title : 'Location ID';
        key PRODUCT_ID   : String(40)     @title : 'Product ID';
        key CLASS_NUM    : String(20)     @title : 'Class Name';
        key CHAR_NUM     : String(30)     @title : 'Charateristic Name';
        key CHARVAL_NUM  : String(70)     @title : 'Charateristic Value';
        key VERSION      : String(10)     @title : 'Version';
        key SCENARIO     : String(32)     @title : 'Scenario';
        key WEEK_DATE    : Date           @title : 'Weekly Date';
            OPT_PERCENT  : Decimal(5, 2)  @title : 'Option Percnetage';
            OPT_QTY      : Decimal(13, 3) @title : 'Option Quantity';
            MANUALOPTION : Decimal(5, 2)  @title : 'Manual Option Percnetage';
    }

    // // IBP result plan table
    // entity IBP_RESULTPLAN {
    //     key LOCATION_ID      : String(4)  @title : 'Location ID';
    //     key PRODUCT_ID       : String(40) @title : 'Product ID';
    //     key OBJ_DEP          : String(30) @title : 'Object Dependency';
    //     key VERSION          : String(10) @title : 'Version';
    //     key SCENARIO         : String(32) @title : 'Scenario';
    //     key WEEK_Date        : Date       @title : 'Weekly Date';
    //         PREDICTED        : Double     @title : 'Predicted';
    //         PREDICTED_TIME   : Timestamp  @title : 'Predicted Time';
    //         PREDICTED_STATUS : String(8)  @title : 'Predicted Status';
    // }

    // PAL profiles
    entity PAL_PROFILEMETH {
        key PROFILE      : String(50)  @title : 'Profile';
            METHOD       : String(50)  @title : 'Method Name';
            PRF_DESC     : String(200) @title : 'Profile Description';
            CREATED_DATE : Date        @title : 'Date';
            CREATED_BY   : String(12)  @title : 'Created By'
    }

    // PAL profile parameters
    entity PAL_PROFILEMETH_PARA {
        key PROFILE      : String(50);
        key METHOD       : String(50);
        key PARA_NAME    : String(100);
            INTVAL       : Integer;
            DOUBLEVAL    : Double;
            STRVAL       : String(20);
            PARA_DESC    : String(1000);
            PARA_DEP     : String(1000);
            CREATED_DATE : Date;
            CREATED_BY   : String(12);
    }

    //PAL profile object dep. assigned to a structure node
    entity PAL_PROFILEOD : managed {
        key LOCATION_ID : String(4);
        key PRODUCT_ID  : String(40);
        key COMPONENT   : String(40);
        key PROFILE     : String(50);
        key OBJ_DEP     : String(30);
        key OBJ_TYPE    : String(2) default 'OD' @title : 'Object Type';
            STRUC_NODE  : String(50);
    }

    entity PAL_PROFILE_LOC_PROD : managed {
        key LOCATION_ID : String(4);
        key PRODUCT_ID  : String(40);
        key PROFILE     : String(50);
    }

    // entity IP_PROFILEOD {
    //     key CREATED_DATE    : Date;
    //         FLAG            : String(1);
    //         PROFILEOD       : array of {
    //             LOCATION_ID : String(4);
    //             PRODUCT_ID  : String(40);
    //             COMPONENT   : String(40);
    //             PROFILE     : String(50);
    //             OBJ_DEP     : String(30);
    //             STRUC_NODE  : String(50);
    //         };
    // }

    // entity IP_PROFILEMETH_PARA {
    //     key CREATED_DATE     : Date;
    //         FLAG             : String(1);
    //         PROFILEPARA      : array of {
    //             PROFILE      : String(50);
    //             METHOD       : String(50);
    //             PARA_NAME    : String(100);
    //             INTVAL       : Integer;
    //             DOUBLEVAL    : Double;
    //             STRVAL       : String(20);
    //             PARA_DESC    : String(1000);
    //             PARA_DEP     : String(1000);
    //             CREATED_DATE : Date;
    //             CREATED_BY   : String(12);
    //         };
    // }

    // Component Quantity
    entity COMPQTYDETERMINE {
        key LOCATION_ID  : String(4)  @title : 'Location ID';
        key PRODUCT_ID   : String(40) @title : 'Product ID';
        key VERSION      : String(10) @title : 'Version';
        key SCENARIO     : String(32) @title : 'Scenario';
        key ITEM_NUM     : String(6)  @title : 'Item Number ';
        key COMPONENT    : String(40) @title : 'Component';
        key CAL_DATE     : Date       @title : 'Weekly Date';
            STRUC_NODE   : String(50) @title : 'Structure Node';
            CAL_COMP_QTY : Integer    @title : 'Component Quantity before variation';
            COMP_QTY     : Integer    @title : 'Component Quantity with variation';
    }
    // Assembly- component for a location

    entity ASSEMBLY_COMP {
        key LOCATION_ID : String(4)  @title : 'Location ID';
        key ASSEMBLY    : String(40) @title : 'Assembly Component';
        key COMPONENT   : String(40) @title : 'Component';
            COMP_QTY    : Integer;
            VALID_FROM  : Date       @title : 'Valid From';
            VALID_TO    : Date       @title : 'Valid To';

    }

    entity ACTUAL_ASMB {
        key SALES_DOC        : String(10) @title : 'Sales Document';
        key SALESDOC_ITEM    : String(6)  @title : 'Sales Document Item';
            SCHEDULELINE_NUM : String(4)  @title : 'Schedule Line Number';
            LOCATION_ID      : String(4)  @title : 'Location';
            PRODUCT_ID       : String(40) @title : 'New Product';
            MAT_AVAILDATE    : Date       @title : 'Material Availability Date';
            PROD_ORDER       : String(12) @title : 'Production Order';
            COMPONENT        : String(40) @title : 'Component';
            COMP_QTY         : Integer;
    }

    // Partial product introduction
    entity PARTIALPROD_INTRO {
        key PRODUCT_ID  : String(40) @title : 'New Product';
        key LOCATION_ID : String(4)  @title : 'Location';
            PROD_DESC   : String(40) @title : 'Product Description';
            REF_PRODID  : String(40) @title : ' Ref. Product';
    }

    // New product charactersitics
    entity PARTIALPROD_CHAR {
        key PRODUCT_ID  : String(40) @title : 'New Product';
        key LOCATION_ID : String(4)  @title : 'Location ';
        key CLASS_NUM   : String(20) @title : 'Class Name';
        key CHAR_NUM    : String(30) @title : 'Charateristic Name';
        key CHARVAL_NUM : String(70) @title : 'Charateristic Value';
    // REF_PRODID  : String(40) @title : ' Ref. Product';
    }

    entity VARCHAR_PS {
        key PRODUCT_ID  : String(40) @title : 'New Product';
        // key LOCATION_ID : String(4)  @title : 'Location ';
        key CHAR_NUM    : String(30) @title : 'Charateristic Name';
            CHAR_TYPE   : String(2)  @title : 'Characteristic Type';
            SEQUENCE    : Integer    @title : 'Secondary Char. Position';
    }

    entity CUVTAB_IND {
        key VTINT : String(10) @title : 'Internal number of variant table';
        key INDID : String(4)  @title : 'Counter for value assignment alternative';
        key ATINN : String(10) @title : 'Internal characteristic';
    }

    entity CUVTAB_VALC {
        key VTINT : String(10) @title : 'Internal number of variant table';
        key SLNID : String(5)  @title : 'Counter for value assignment alternative';
        key ATINN : String(10) @title : 'Internal characteristic';
        key VLCNT : String(3)  @title : 'Characteristic value counter';
            VALC  : String(70) @title : 'Characteristic Value';
    }

    entity CUVTAB_VALC_TEMP {
        key VTINT : String(10) @title : 'Internal number of variant table';
        key SLNID : String(5)  @title : 'Counter for value assignment alternative';
        key ATINN : String(10) @title : 'Internal characteristic';
        key VLCNT : String(3)  @title : 'Characteristic value counter';
            VALC  : String(70) @title : 'Characteristic Value';
    }

    entity CUVTAB_FINAL {
        ATINN : String(10) @title : 'Internal characteristic';
        VALC  : String(70) @title : 'Characteristic Value';
    }

    entity UNIQUE_ID_HEADER {
        key UNIQUE_ID   : Integer    @title : 'Unique ID';
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'New Product';
            UNIQUE_DESC : String(50) @title : 'Description';
            UID_TYPE    : String(1)  @title : 'Primary Unique ID';
            UID_RATE    : Decimal(13, 2);
            ACTIVE      : Boolean;
    }

    entity UNIQUE_ID_ITEM {
        key UNIQUE_ID     : Integer    @title : 'Unique ID';
        key LOCATION_ID   : String(4)  @title : 'Location ';
        key PRODUCT_ID    : String(40) @title : 'New Product';
        key CHAR_NUM      : String(30) @title : 'Charateristic Name';
            CHARVAL_NUM   : String(70) @title : 'Charateristic Value';
            UID_CHAR_RATE : Decimal(13, 2);
    }

    entity UID_PRI_HEADER {
        key UNIQUE_ID   : Integer    @title : 'Unique ID';
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'New Product';
            UNIQUE_DESC : String(50) @title : 'Description';
            UID_TYPE    : String(1)  @title : 'Primary Unique ID';
            ACTIVE      : Boolean;
    }

    entity UID_PRI_ITEM {
        key UNIQUE_ID   : Integer    @title : 'Unique ID';
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'New Product';
        key CHAR_NUM    : String(30) @title : 'Charateristic Name';
            CHARVAL_NUM : String(70) @title : 'Charateristic Value';
    }

    // New product introduction
    entity NEWPROD_INTRO {
        key PRODUCT_ID  : String(40) @title : 'New Product';
        key LOCATION_ID : String(4)  @title : 'Location';
            REF_PRODID  : String(40) @title : ' Ref. Product';
    }

    // New product charactersitics
    entity NEWPROD_CHAR {
        key PRODUCT_ID      : String(40) @title : 'New Product';
        key LOCATION_ID     : String(4)  @title : 'Location ';
        key CLASS_NUM       : String(20) @title : 'Class Name';
        key CHAR_NUM        : String(30) @title : 'Charateristic Name';
        key CHARVAL_NUM     : String(70) @title : 'Charateristic Value';
            REF_CLASS_NUM   : String(20) @title : 'Class Name';
            REF_CHAR_NUM    : String(30) @title : 'Charateristic Name';
            REF_CHARVAL_NUM : String(70) @title : 'Charateristic Value';
            REF_PRODID      : String(40) @title : ' Ref. Product';
    }

    entity SALES_HM {
        key SALES_DOC     : String(10) @title : 'Sales Document';
        key SALESDOC_ITEM : String(6)  @title : 'Sales Document Item';
            PRODUCT_ID    : String(40) @title : 'Product Id';
            LOCATION_ID   : String(4)  @title : 'Location ID';
            UNIQUE_ID     : Integer    @title : 'Unique ID';
            PRIMARY_ID    : Integer    @title : 'Primary ID';
    // SO_TYPE       : String(4)      @title : 'Seed Order Type';
    // ORD_QTY       : Decimal(13, 3) @title : 'Order Quantity';
    // MAT_AVAILDATE : Date           @title : 'Material Availability Date';

    }

    // Authorization object master
    entity USER_AUTHOBJ {
        key USER        : String(100) @title : 'User';
        key PARAMETER   : String(100) @title : 'Parameter';
        key AUTH_GROUP  : String(4)   @title : 'Authorization Object';
            DESCRIPTION : String(250) @title : 'Description';
    }

    // Roles for a user
    entity AUTH_EMP_ROLE : managed {
        key USER    : String(100) @title : 'User';
        key ROLE_ID : String(100) @title : 'Role ID';
    }

    // Roles master
    entity AUTH_ROLE : managed {
        key ROLE_ID     : String(100) @title : 'Role ID';
            DESCRIPTION : String(250) @title : 'Description';
    }

    // Authorization object for roles and its parameters
    entity AUTH_ROLE_OBJ : managed {
        key ROLE_ID       : String(100) @title : 'Role ID';
        key PARAMETER     : String(100) @title : 'Parameter';
        key PARAMETER_VAL : String(250) @title : 'Parameter';
    // ROLE : Association to many AUTH_EMP_ROLE on ROLE.ROLE_ID = ROLE_ID;
    }

    entity PARAMETER_AUTH {
        key PARAMETER     : String(100) @title : 'Parameter';
            PARAMETER_VAL : String(250) @title : 'Parameter';
    }

    entity USERDETAILS {
        key username : String(50);
    }

    entity RESTRICT_HEADER {
        key LOCATION_ID : String(4)      @title : 'Location ';
        key LINE_ID     : String(40)     @title : 'Line';
        key RESTRICTION : String(30)     @title : 'Restriction';
            RTR_DESC    : String(30)     @title : 'Restriction Desc';
            RTR_TYPE    : String(10)     @title : 'Restriction Type';
            RTR_QTY     : Decimal(13, 3) @title : 'Component Quantity';
            VALID_FROM  : Date           @title : 'Valid From';
            VALID_TO    : Date           @title : 'Valid To';
    }
    // Restriction details

    entity RESTRICT_DETAILS {
        key RESTRICTION  : String(30) @title : 'Restriction';
            //key RTR_COUNTER  : Integer    @title : 'Restriction Counter';
        key CLASS_NUM    : String(18) @title : 'Internal class number';
        key CHAR_NUM     : String(10) @title : 'Internal Char. number';
        key CHAR_COUNTER : Integer    @title : 'Characteristic counter';
        key CHARVAL_NUM  : String(70) @title : 'Internal Char. number';
            OD_CONDITION : String(2)  @title : 'Restriction condition ';
            ROW_ID       : Integer    @title : 'Attribute Index ';
    };

    // location-Product-Line
    entity PROD_LOC_LINE {
        key LOCATION_ID : String(4)  @title : 'Location ';
        key LINE_ID     : String(40) @title : 'Line';
        key PRODUCT_ID  : String(40) @title : 'Product';
    };

    entity LINEMASTER {
        key LOCATION_ID : String(4)  @title : 'Location ';
        key LINE_ID     : String(40) @title : 'Line';
            LINE_DESC   : String(30) @title : 'Line Desc';
    };

    // Product restrictions
    entity LOCPRODRESTRICT {
        key WEEK_DATE     : Date           @title : 'Week Date';
        key LOCATION_ID   : String(4)      @title : 'Location '; //Association to ZLOCATION;//
        key LINE_ID       : String(40)     @title : 'Line';
        key PRODUCT_ID    : String(40)     @title : 'Product';
        key RESTRICTION   : String(30)     @title : 'Restriction';
        key MODEL_VERSION : String(20)     @title : 'MODEL_VERSION';
        key VERSION       : String(10)     @title : 'Version';
        key SCENARIO      : String(32)     @title : 'Scenario';
            RTR_QTY       : Decimal(13, 3) @title : 'Component Quantity';
    };


    entity CIR_GENERATED {
        key LOCATION_ID   : String(4)  @title : 'Location ';
        key PRODUCT_ID    : String(40) @title : 'Product';
        key WEEK_DATE     : Date       @title : 'Week Date';
        key CIR_ID        : Integer    @title : 'CIR ID';
        key MODEL_VERSION : String(20) @title : 'MODEL_VERSION';
        key VERSION       : String(10) @title : 'Version';
        key SCENARIO      : String(32) @title : 'Scenario';
            // key METHOD        : String(20) @title : 'Method';
            UNIQUE_ID     : Integer    @title : 'Unique ID';
            CIR_QTY       : Integer    @title : 'Quantity';
    }

    // entity CIR_CHAR_RATE {
    //     key LOCATION_ID   : String(4)      @title : 'Location ';
    //     key PRODUCT_ID    : String(40)     @title : 'Product';
    //     key WEEK_DATE     : Date           @title : 'Week Date';
    //     key MODEL_VERSION : String(20)     @title : 'MODEL_VERSION';
    //     key VERSION       : String(10)     @title : 'Version';
    //     key SCENARIO      : String(32)     @title : 'Scenario';
    //     key CHAR_NUM      : String(10)     @title : 'Internal Char. number';
    //     key CHARVAL_NUM   : String(10)     @title : 'Internal Char. number';
    //         SEQUENCE      : Integer        @title : 'Sequence';
    //         GEN_QTY       : Decimal(13, 3) @title : 'Generated Quantity';
    //         PLAN_QTY      : Decimal(13, 3) @title : 'Planned Quantity';
    //         DEVIATION     : Decimal(13, 3) @title : 'Deviation';
    // }

    // Sample table
    entity MARKETAUTH_WEEK {
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'Product';
        key WEEK_DATE   : Date       @title : 'Week Date';
    }

    entity MARKETAUTH_CFG {
        key WEEK_DATE   : Date       @title : 'Week Date';
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'Product';
        key CHAR_NUM    : String(10) @title : 'Internal Char. number';
        key CHARVAL_NUM : String(70) @title : 'Internal Char. number';
        key VERSION     : String(10) @title : 'Version';
        key SCENARIO    : String(32) @title : 'Scenario';
            OPT_PERCENT : Double     @title : 'Option Percentage';
    }

    entity SEEDORDER_HEADER {
        key SEED_ORDER     : String(10)     @title : 'Seed Order';
            LOCATION_ID    : String(4)      @title : 'Location ';
            PRODUCT_ID     : String(40)     @title : 'Product';
            CUSTOMER_GROUP : String(20)     @title : 'Customer Group';
            UNIQUE_ID      : Integer        @title : 'Unique ID';
            ORD_QTY        : Decimal(13, 3) @title : 'Ordered Qty';
            MAT_AVAILDATE  : Date           @title : 'Material Avail. Date';
    }

    // Begin Of Insert - Deepa
    // Groups
    entity PLANNED_GROUPS {
        key GROUP_ID          : Integer;
            GROUP_DESCRIPTION : String(100);
            UNIT              : String(5);
    }

    // Parameters
    entity PLANNED_PARAMETERS {
            GROUP          : Association to PLANNED_GROUPS
                                 on GROUP.GROUP_ID = GROUP_ID;
        key PARAMETER_ID   : Integer;
        key GROUP_ID       : Integer;
        key SEQUENCE       : Integer;
            DESCRIPTION    : String(100);
            MIN_VALUE      : Integer;
            MAX_VALUE      : Integer;
            VALUE_HELP     : Boolean;
            VALUE_HELP_TAB : String(20);
    }

    // Execution Method
    entity METHOD_TYPES {
        key METHOD_TYP  : String(2);
            DESCRIPTION : String(20);
    }

    // Parameters Values
    entity PARAMETER_VALUES {
        key LOCATION_ID  : String(4);
        key PARAMETER_ID : Integer;
            VALUE        : String(500);
    }

    entity SALES_S {
        key SALES_DOC    : String(10)     @title : 'Sales Document';
            PRODUCT_ID   : String(40)     @title : 'Product';
            LOCATION_ID  : String(4)      @title : 'Location ';
            QUANTITY     : Decimal(13, 3) @title : 'Quantity';
            STATUS       : String(10)     @title : 'Status';
            ORDER_NUMBER : String(10)     @title : 'Order Number ';
            PURCHASE_REQ : String(12)     @title : 'Purchase Requisition ';
            CHANGED_DATE : Date           @title : 'Change Date';
            CHANGED_TIME : Time           @title : 'Change Time';
            CHANGED_BY   : String(12)     @title : 'Changed By';
            CREATED_DATE : Date           @title : 'Created Date';
            CREATED_TIME : Time           @title : 'Created Time';
            CREATED_BY   : String(12)     @title : 'Created By';
    }

    entity ASSEMBLY_REQ {
        key LOCATION_ID   : String(4)      @title : 'Location ';
        key PRODUCT_ID    : String(40)     @title : 'Product';
        key ITEM_NUM      : String(6)      @title : 'ITEM_NUM';
        key COMPONENT     : String(40)     @title : 'COMPONENT';
        key WEEK_DATE     : Date           @title : 'Week Date';
        key MODEL_VERSION : String(20)     @title : 'MODEL_VERSION';
        key VERSION       : String(10)     @title : 'Version';
        key SCENARIO      : String(32)     @title : 'Scenario';
            REF_PRODID    : String(40)     @title : ' Ref. Product';
            COMPCIR_QTY   : Decimal(13, 3) @title : 'CIR Component QTY';
    }

    entity FACTORY_SALESLOC {
        key LOCATION_ID : String(4)  @title : 'Demand Location ';
        key PRODUCT_ID  : String(40) @title : 'Product';
        key PLAN_LOC    : String(4)  @title : 'Planning Location ';
        key FACTORY_LOC : String(4)  @title : 'Factory Location ';
    }

    entity CRITICAL_COMP {
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'Product';
        key ITEM_NUM    : String(6)  @title : 'ITEM_NUM';
        key COMPONENT   : String(40) @title : 'Assembly';
            CRITICALKEY : String(1);
    }

    entity DEF_MKTAUTH {
        key LOCATION_ID : String(4)  @title : 'Location ';
        key PRODUCT_ID  : String(40) @title : 'Product';
        key CHAR_NUM    : String(10) @title : 'Internal Char. number';
        key CHARVAL_NUM : String(70) @title : 'Internal Char. number';
            OPT_PERCENT : Double     @title : 'Option Percentage';
    }

    entity CIRLOG {
        key PRODUCT_ID  : String(40)     @title : 'Product';
        key CIR_ID      : Integer        @title : 'CIR ID';
        key LOCATION_ID : String(4)      @title : 'Location ';
        key UNIQUE_ID   : Integer        @title : 'Unique ID';
        key WEEK_DATE   : Date           @title : 'Week Date';
        key CUST_PRODID : String(40)     @title : 'Partial Product';
            COMPCIR_QTY : Decimal(13, 3) @title : 'CIR Component QTY';
            MSG_TYP     : String(1)      @title : 'Message Type';
            MESSAGE     : String(220)    @title : 'Message';
    }

    // End Of Insert - Deepa
    //Start of VC Planner Doc-Pradeep
    entity PAGEHEADER {
        key PAGEID         : Integer;
            DESCRIPTION    : String(100);
            PARENTNODEID   : Integer;
            HEIRARCHYLEVEL : Integer;

    }

    entity PAGEPARAGRAPH {
        key PAGEID      : Integer;
            DESCRIPTION : String(100);
            CONTENT     : hana.CLOB;
    }
    // End Of VC Planner doc- Pradeep

    // Import IBP Veersion and Scenario
    entity IBPVERSIONSCENARIO {
        key VERSION       : String(10) @title : 'Version';
        key SCENARIO      : String(32) @title : 'Scenario';
            VERSION_NAME  : String(50) @title : 'Version_Name';
            SCENARIO_NAME : String(50) @title : 'Scenario_Name';
    };

    //start of Variant Table - Pradeep
    entity CREATEVARIANT {
        key VARIANTID        : Integer    @title : 'Variant ID';
        key VARIANTNAME      : String(10) @title : 'Variant Name';
        key USER             : String(50) @title : 'User';
        key APPLICATION_NAME : String(50) @title : 'Application_Name';
        key FIELD            : String(50) @title : 'Field';
        key FIELD_CENTER     : String(50) @title : 'Field_Center';
            DEFAULT          : String(2)  @title : 'Default';
            VALUE            : String(50) @title : 'Value';
            SCOPE            : String(50) @title : 'Scope';
    };

    entity CREATEVARIANTHEADER {
        key VARIANTID   : Integer    @title : 'Variant ID';
        key VARIANTNAME : String(10) @title : 'Variant Name';
        key USER        : String(50) @title : 'User';
            DEFAULT     : String(2)  @title : 'Default';
            SCOPE       : String(50) @title : 'Scope';
    };

    //End of Variant Table - Pradeep

    entity IBPCHAR_PS {
        key PRODUCT_ID  : String(40) @title : 'Configurable Product';
        // key LOCATION_ID : String(4)  @title : 'Location';
        key CHAR_NUM    : String(30) @title : 'Charateristic Name';
            CHAR_TYPE   : String(2)  @title : 'Characteristic Type';
            SEQUENCE    : Integer    @title : 'Secondary Char. Position';
    }
}


@cds.persistence.exists
entity![V_OBDHDR]{
    key![LOCATION_ID]  : String(4)      @title : 'Location';
    key![PRODUCT_ID]   : String(40)     @title : 'Product';
    key![ITEM_NUM]     : String(6)      @title : 'ITEM_NUM';
    key![COMPONENT]    : String(40)     @title : 'COMPONENT';
    key![COMP_QTY]     : Decimal(13, 3) @title : 'COMP_QTY';
    key![OBJ_DEP]      : String(30)     @title : 'Object Dependency';
    key![OBJDEP_DESC]  : String(30)     @title : 'OBJDEP_DESC';
    key![CLASS_NUM]    : String(18)     @title : 'Internal Class Number';
    key![CHAR_NUM]     : String(10)     @title : 'Char Num';
    key![CHARVAL_NUM]  : String(70)     @title : 'Charval Num';
    key![OD_CONDITION] : String(2)      @title : 'OD_CONDITION';
    key![OBJ_COUNTER]  : Integer        @title : 'OBJ_COUNTER';
    key![CHAR_COUNTER] : Integer        @title : 'CHAR_COUNTER';
    key![ROW_ID]       : Integer        @title : 'ROW_ID';
}

@cds.persistence.exists
entity![V_CLASSCHARVAL]{
    key![CLASS_NUM]    : String(18)  @title : 'CLASS_NUM';
    key![CLASS_NAME]   : String(20)  @title : 'CLASS_NAME';
    key![CLASS_DESC]   : String(150) @title : 'CHAR_NAME';
    key![IBPCHAR_CHK]  : Boolean     @title : 'IBP Char. Check';
    key![CHAR_NUM]     : String(10)  @title : 'CHAR_NUM';
    key![CHAR_NAME]    : String(30)  @title : 'CHAR_NAME';
    key![CHAR_DESC]    : String(150) @title : 'CHAR_NAME';
    key![CHAR_GROUP]   : String(10)  @title : 'CHAR_NAME';
    key![CHAR_VALUE]   : String(70)  @title : 'CHAR_VALUE';
    key![CHARVAL_NUM]  : String(70)  @title : 'CHARVAL_NUM';
    key![CHARVAL_DESC] : String(150) @title : 'CHAR_DESC';
}

@cds.persistence.exists
entity![V_PRODCLSCHAR]{
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![LOCATION_ID]   : String(4)  @title : 'LOCATION_ID';
    key![CLASS_NUM]     : String(18) @title : 'CLASS_NUM';
    key![CLASS_NAME]    : String(20) @title : 'CLASS_NAME';
    key![PROD_DESC]     : String(40) @title : 'PROD_DESC';
    key![PROD_FAMILY]   : String(30) @title : 'PROD_FAMILY';
    key![PROD_GROUP]    : String(30) @title : 'PROD_GROUP';
    key![PROD_MODEL]    : String(30) @title : 'PROD_MODEL';
    key![PROD_MDLRANGE] : String(30) @title : 'PROD_MDLRANGE';
    key![PROD_SERIES]   : String(30) @title : 'PROD_SERIES';
}


@cds.persistence.exists
entity![V_BOMODCOND]{
    key![LOCATION_ID] : String(4)      @title : 'LOCATION_ID';
    key![PRODUCT_ID]  : String(40)     @title : 'PRODUCT_ID';
    key![ITEM_NUM]    : String(6)      @title : 'ITEM_NUM';
    key![COMPONENT]   : String(40)     @title : 'COMPONENT';
    key![OBJ_DEP]     : String(42)     @title : 'OBJ_DEP';
    key![OBJDEP_DESC] : String(30)     @title : 'OBJDEP_DESC';
    key![COMP_QTY]    : Decimal(13, 3) @title : 'COMP_QTY';
    key![VALID_FROM]  : Date           @title : 'VALID_FROM';
    key![VALID_TO]    : Date           @title : 'VALID_TO';
}


@cds.persistence.exists
entity![V_ODPROFILES]{
    key![LOCATION_ID] : String(4)  @title : 'LOCATION_ID';
    key![PRODUCT_ID]  : String(40) @title : 'PRODUCT_ID';
    key![ITEM_NUM]    : String(6)  @title : 'ITEM_NUM';
    key![COMPONENT]   : String(40) @title : 'COMPONENT';
    key![STRUC_NODE]  : String(50) @title : 'STRUC_NODE';
    key![PROFILE]     : String(50) @title : 'PROFILE';
}

@cds.persistence.exists
entity![V_SALESHCFG_CHARVAL]{
    key![SALES_DOC]        : String(10)     @title : 'Sales Document';
    key![SALESDOC_ITEM]    : String(6)      @title : 'Sales Doc. Item';
    key![DOC_CREATEDDATE]  : Date           @title : 'Doc. Created Date';
    key![SCHEDULELINE_NUM] : String(4)      @title : 'Schedule Line No.';
    key![PRODUCT_ID]       : String(40)     @title : 'Product ID';
    key![UOM]              : String(3)      @title : 'UOM';
    key![CONFIRMED_QTY]    : Decimal(13, 3) @title : 'Confirmed Qty';
    key![ORD_QTY]          : Decimal(13, 3) @title : 'Ordered Qty';
    key![MAT_AVAILDATE]    : Date           @title : 'Material Avail. Date';
    key![NET_VALUE]        : Decimal(15, 2) @title : 'Net Value';
    key![CUSTOMER_GROUP]   : String(20)     @title : 'Customer Group';
    key![LOCATION_ID]      : String(4)      @title : 'Location ID';
    key![CHAR_NAME]        : String(30)     @title : 'Characteristic';
    key![CHAR_VALUE]       : String(70)     @title : 'Characteristic Value';
}

@cds.persistence.exists
entity![V_ODCHARVAL]{
    key![OBJ_DEP]      : String(42) @title : 'OBJ_DEP';
    key![CLASS_NUM]    : String(18) @title : 'CLASS_NUM';
    key![CLASS_NAME]   : String(20) @title : 'CLASS_NAME';
    key![CHAR_NUM]     : String(10) @title : 'CHAR_NUM';
    key![CHAR_NAME]    : String(30) @title : 'CHAR_NAME';
    key![CHARVAL_NUM]  : String(70) @title : 'CHARVAL_NUM';
    key![CHAR_VALUE]   : String(70) @title : 'CHAR_VALUE';
    key![OD_CONDITION] : String(2)  @title : 'OD_CONDITION';
    key![CHAR_COUNTER] : Integer    @title : 'CHAR_COUNTER';
    key![ROW_ID]       : Integer    @title : 'ROW_ID';
}

@cds.persistence.exists
entity![V_SALES_H]{
    ![SALES_DOC]        : String(10) not null @title : 'SALES_DOC';
    ![SALESDOC_ITEM]    : String(6) not null  @title : 'SALESDOC_ITEM';
    ![REF_PRODID]       : String(40)          @title : 'REF_PRODID';
    ![PRODUCT_ID]       : String(40)          @title : 'PRODUCT_ID';
    ![UNIQUE_ID]        : Integer             @title : 'UNIQUE_ID';
    ![PRIMARY_ID]       : Integer             @title : 'PRIMARY_ID';
    ![DOC_CREATEDDATE]  : Date                @title : 'DOC_CREATEDDATE';
    ![SCHEDULELINE_NUM] : String(4)           @title : 'SCHEDULELINE_NUM';
    ![REASON_REJ]       : String(2)           @title : 'REASON_REJ';
    ![UOM]              : String(3)           @title : 'UOM';
    ![CONFIRMED_QTY]    : Decimal(13, 3)      @title : 'CONFIRMED_QTY';
    ![ORD_QTY]          : Decimal(13, 3)      @title : 'ORD_QTY';
    ![MAT_AVAILDATE]    : Date                @title : 'MAT_AVAILDATE';
    ![NET_VALUE]        : Decimal(15, 2)      @title : 'NET_VALUE';
    ![CUSTOMER_GROUP]   : String(20)          @title : 'CUSTOMER_GROUP';
    ![LOCATION_ID]      : String(4)           @title : 'LOCATION_ID';
    ![SALE_LOCATION]    : String(4)           @title : 'SALE_LOCATION';
    ![PLAN_LOC]         : String(4)           @title : 'PLAN_LOC';
    ![FACTORY_LOC]      : String(4)           @title : 'FACTORY_LOC';
    ![SEEDORD_CHK]      : String(1)           @title : 'SEEDORD_CHK';
    ![CHANGED_DATE]     : Date                @title : 'CHANGED_DATE';
    ![CHANGED_BY]       : String(12)          @title : 'CHANGED_BY';
    ![CREATED_DATE]     : Date                @title : 'CREATED_DATE';
    ![CREATED_BY]       : String(12)          @title : 'CREATED_BY';
    ![CHANGED_TIME]     : Time                @title : 'CHANGED_TIME';
    ![CREATED_TIME]     : Time                @title : 'CREATED_TIME';
}

@cds.persistence.exists
entity![V_LOCPROD]{
    key![PRODUCT_ID]  : String(40) @title : 'PRODUCT_ID';
    key![LOCATION_ID] : String(4)  @title : 'LOCATION_ID';
    key![PROD_DESC]   : String(40) @title : 'PROD_DESC';
}

@cds.persistence.exists
entity![V_FACTORYLOC]{
    key![FACTORY_LOC]   : String(4)  @title : 'Factory Location ';
    key![PLAN_LOC]      : String(4)  @title : 'Planning Location ';
    key![DEMAND_LOC]    : String(4)  @title : 'Demand Location ';
    key![PRODUCT_ID]    : String(40) @title : 'Product';
    key![LOCATION_DESC] : String(40) @title : 'Location Description';
    // key![LOCATION_ID]   : String(4)  @title : 'Location ';
}

@cds.persistence.exists
entity![V_BOMPVS]{
    key![LOCATION_ID] : String(4)      @title : 'LOCATION_ID';
    key![PRODUCT_ID]  : String(40)     @title : 'PRODUCT_ID';
    key![ITEM_NUM]    : String(6)      @title : 'ITEM_NUM';
    key![COMPONENT]   : String(40)     @title : 'COMPONENT';
    key![COMP_QTY]    : Decimal(13, 3) @title : 'COMP_QTY';
    key![VALID_FROM]  : Date           @title : 'VALID_FROM';
    key![VALID_TO]    : Date           @title : 'VALID_TO';
    key![STRUC_NODE]  : String(50)     @title : 'STRUC_NODE';
}

@cds.persistence.exists
entity![V_IBPVERSCENARIO]{
    key![LOCATION_ID]   : String(4)  @title : 'LOCATION_ID';
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![VERSION]       : String(10) @title : 'VERSION';
    key![VERSION_NAME]  : String(50) @title : 'VERSION';
    key![SCENARIO]      : String(32) @title : 'SCENARIO';
    key![SCENARIO_NAME] : String(50) @title : 'SCENARIO';
}


@cds.persistence.exists
entity![V_TS_ODCHARPREDICTIONS]{
    key![LOCATION_ID]   : String(4)  @title : 'LOCATION_ID';
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![OBJ_DEP]       : String(30) @title : 'OBJ_DEP';
    key![OBJ_COUNTER]   : Integer    @title : 'OBJ_COUNTER';
    key![MODEL_VERSION] : String(20) @title : 'MODEL_VERSION';
    key![VERSION]       : String(10) @title : 'VERSION';
    key![SCENARIO]      : String(32) @title : 'SCENARIO';
    key![CAL_DATE]      : Date       @title : 'CAL_DATE';
    key![PREDICTED]     : Double     @title : 'PREDICTED';
    key![ROW_ID]        : Integer    @title : 'ROW_ID';
    key![CHAR_NAME]     : String(30) @title : 'CHAR_NAME';
    key![PREDICTED_VAL] : Double     @title : 'PREDICTED_VAL';
}

@cds.persistence.exists
entity![V_BOM_TSPREDICTION]{
    key![LOCATION_ID]   : String(4)  @title : 'LOCATION_ID';
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![ITEM_NUM]      : String(6)  @title : 'ITEM_NUM';
    key![COMPONENT]     : String(40) @title : 'COMPONENT';
    key![OBJ_DEP]       : String(30) @title : 'OBJ_DEP';
    key![MODEL_VERSION] : String(20) @title : 'MODEL_VERSION';
    key![VERSION]       : String(10) @title : 'VERSION';
    key![SCENARIO]      : String(32) @title : 'SCENARIO';
    key![CAL_DATE]      : Date       @title : 'CAL_DATE';
    key![PREDICTED]     : Double     @title : 'PREDICTED';
}

@cds.persistence.exists
entity![V_COMPOD_TSPRED]{
    key![LOCATION_ID]   : String(4)  @title : 'LOCATION_ID';
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![ITEM_NUM]      : String(6)  @title : 'ITEM_NUM';
    key![COMPONENT]     : String(40) @title : 'COMPONENT';
    key![OBJ_DEP]       : String(30) @title : 'OBJ_DEP';
    key![OBJ_COUNTER]   : Integer    @title : 'OBJ_COUNTER';
    key![MODEL_VERSION] : String(20) @title : 'MODEL_VERSION';
    key![VERSION]       : String(10) @title : 'VERSION';
    key![SCENARIO]      : String(32) @title : 'SCENARIO';
    key![CAL_DATE]      : Date       @title : 'CAL_DATE';
    key![PREDICTED]     : Double     @title : 'PREDICTED';
}

@cds.persistence.exists
entity![V_ODCHARIMPACT_VALUE]{
    key![LOCATION_ID]     : String(4)   @title : 'LOCATION_ID';
    key![PRODUCT_ID]      : String(40)  @title : 'PRODUCT_ID';
    key![OBJ_DEP]         : String(30)  @title : 'OBJ_DEP';
    key![OBJ_COUNTER]     : Integer     @title : 'OBJ_COUNTER';
    key![CHAR_NUM]        : String(10)  @title : 'CHAR_NUM';
    key![CHAR_DESC]       : String(150) @title : 'CHAR_NUM';
    key![CHAR_NAME]       : String(30)  @title : 'CHAR_NAME';
    key![ROW_ID]          : Integer     @title : 'ROW_ID';
    key![MODEL_VERSION]   : String(20)  @title : 'MODEL_VERSION';
    key![VERSION]         : String(10)  @title : 'VERSION';
    key![SCENARIO]        : String(32)  @title : 'SCENARIO';
    key![CAL_DATE]        : Date        @title : 'CAL_DATE';
    key![CHAR_IMPACT_VAL] : Double      @title : 'CHAR_IMPACT_VAL';
    key![PREDICTED_VAL]   : Double      @title : 'PREDICTED_VAL';
    key![OPT_PERCENT]     : Double      @title : 'Option Percnetage';
}

@cds.persistence.exists
entity![V_FCHARPLAN]{
    key![WEEK_DATE]   : Date           @title : 'Week Date';
    key![LOCATION_ID] : String(4)      @title : 'Location';
    key![PRODUCT_ID]  : String(40)     @title : 'Product';
    key![CLASS_NUM]   : String(20)     @title : 'Int. Counter for Class';
    key![CLASS_NAME]  : String(20)     @title : 'Class Name';
    key![CHAR_NUM]    : String(30)     @title : 'Int. Counter for Characteristic ';
    key![CHAR_NAME]   : String(30)     @title : 'Characteristic';
    key![CHARVAL_NUM] : String(70)     @title : 'Int.counter for Characteristic';
    key![CHAR_VALUE]  : String(70)     @title : 'Characteristic Value ';
    key![VERSION]     : String(10)     @title : 'Version';
    key![SCENARIO]    : String(32)     @title : 'Scenario';
    key![OPT_PERCENT] : Decimal(5, 2)  @title : 'Option Percent';
    key![OPT_QTY]     : Decimal(13, 3) @title : 'Option Quantity';
}

@cds.persistence.exists
entity![V_ASMCOMP_REQ]{
    key![WEEK_DATE]     : Date       @title : 'CAL_DATE';
    key![LOCATION_ID]   : String(4)  @title : 'LOCATION_ID';
// addded
    key![FACTORY_LOC]   : String(4)  @title : 'FACTORY_LOC';
// end
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![ASSEMBLY]      : String(40) @title : 'ASSEMBLY';
    key![COMPONENT]     : String(40) @title : 'COMPONENT';
    key![COMP_QTY]      : Double     @title : 'COMP_QTY';
    key![VERSION]       : String(10) @title : 'VERSION';
    key![SCENARIO]      : String(32) @title : 'SCENARIO';
    key![MODEL_VERSION] : String(20) @title : 'MODEL_VERSION';
}

@cds.persistence.exists
entity![V_PRODCLSCHARVAL]{
    key![PRODUCT_ID]   : String(40)  @title : 'Product';
    key![CLASS_NUM]    : String(18)  @title : 'CLASS_NUM';
    key![CLASS_NAME]   : String(20)  @title : 'CLASS_NAME';
    key![IBPCHAR_CHK]  : Boolean     @title : 'IBPCHAR_CHK';
    key![CHAR_NUM]     : String(10)  @title : 'CHAR_NUM';
    key![CHAR_NAME]    : String(30)  @title : 'CHAR_NAME';
    key![CHAR_DESC]    : String(150) @title : 'CHAR_DESC';
    key![CHARVAL_NUM]  : String(70)  @title : 'CHARVAL_NUM';
    key![CHAR_VALUE]   : String(70)  @title : 'CHAR_VALUE';
    key![CHARVAL_DESC] : String(150) @title : 'CHAR_DESC';
}

@cds.persistence.exists
entity![V_PARTIALPRODCHAR]{
    key![PRODUCT_ID]   : String(40)  @title : 'PRODUCT_ID';
    key![LOCATION_ID]  : String(4)   @title : 'LOCATION_ID';
    key![REF_PRODID]   : String(40)  @title : 'REF_PRODID';
    key![CLASS_NUM]    : String(20)  @title : 'CLASS_NUM';
    key![CLASS_NAME]   : String(20)  @title : 'CLASS_NAME';
    key![CHAR_NUM]     : String(30)  @title : 'CHAR_NUM';
    key![CHAR_NAME]    : String(30)  @title : 'CHAR_NAME';
    key![CHAR_DESC]    : String(150) @title : 'CHAR_DESC';
    key![CHARVAL_NUM]  : String(70)  @title : 'CHARVAL_NUM';
    key![CHAR_VALUE]   : String(70)  @title : 'CHAR_VALUE';
    key![CHARVAL_DESC] : String(150) @title : 'CHAR_DESC';
}

@cds.persistence.exists
entity![V_NEWPRODREFCHAR]{
    key![PRODUCT_ID]      : String(40) @title : 'PRODUCT_ID';
    key![LOCATION_ID]     : String(4)  @title : 'LOCATION_ID';
    key![REF_PRODID]      : String(40) @title : 'REF_PRODID';
    key![CLASS_NUM]       : String(20) @title : 'CLASS_NUM';
    key![CLASS_NAME]      : String(20) @title : 'CLASS_NAME';
    key![CHAR_NUM]        : String(30) @title : 'CHAR_NUM';
    key![CHAR_NAME]       : String(30) @title : 'CHAR_NAME';
    key![CHARVAL_NUM]     : String(70) @title : 'CHARVAL_NUM';
    key![CHAR_VALUE]      : String(70) @title : 'CHAR_VALUE';
    key![REF_CLASS_NUM]   : String(20) @title : 'REF_CLASS_NUM';
    key![REF_CLASSNAME]   : String(20) @title : 'REF_CLASSNAME';
    key![REF_CHAR_NUM]    : String(30) @title : 'REF_CHAR_NUM';
    key![REF_CHARNAME]    : String(30) @title : 'REF_CHARNAME';
    key![REF_CHARVAL_NUM] : String(70) @title : 'REF_CHARVAL_NUM';
    key![REF_CHARVAL]     : String(70) @title : 'REF_CHARVAL';
}

@cds.persistence.exists
entity![V_GETVARCHARPS]{
    key![PRODUCT_ID]  : String(40)  @title : 'PRODUCT_ID';
    // key![LOCATION_ID] : String(4)   @title : 'LOCATION_ID';
    key![CHAR_NUM]    : String(30)  @title : 'CHAR_NUM';
    key![CHAR_NAME]   : String(30)  @title : 'CHAR_NAME';
    key![CHAR_DESC]   : String(150) @title : 'CHAR_DESC';
    key![CHAR_TYPE]   : String(2)   @title : 'CHAR_TYPE';
    key![SEQUENCE]    : Integer     @title : 'SEQUENCE';
}

@cds.persistence.exists
entity![V_GETIBPCHARPS]{
    key![PRODUCT_ID]  : String(40)  @title : 'PRODUCT_ID';
    // key![LOCATION_ID] : String(4)   @title : 'LOCATION_ID';
    key![CHAR_NUM]    : String(30)  @title : 'CHAR_NUM';
    key![CHAR_NAME]   : String(30)  @title : 'CHAR_NAME';
    key![CHAR_DESC]   : String(150) @title : 'CHAR_DESC';
    key![CHAR_TYPE]   : String(2)   @title : 'CHAR_TYPE';
    key![SEQUENCE]    : Integer     @title : 'SEQUENCE';
}

@cds.persistence.exists
entity![V_UNIQUE_ID_ITEM]{
    key![UNIQUE_ID]    : Integer     @title : 'MATVARID';
    key![PRODUCT_ID]   : String(40)  @title : 'PRODUCT_ID';
    key![LOCATION_ID]  : String(4)   @title : 'LOCATION_ID';
    key![UNIQUE_DESC]  : String(50)  @title : 'UNIQUE DESC';
    key![CLASS_NUM]    : String(18)  @title : 'CLASS_NUM';
    key![CHAR_NUM]     : String(30)  @title : 'CHAR_NUM';
    key![CHAR_NAME]    : String(30)  @title : 'CHAR_NAME';
    key![CHAR_DESC]    : String(150) @title : 'CHAR_DESC';
    key![CHARVAL_NUM]  : String(70)  @title : 'CHARVAL_NUM';
    key![CHAR_VALUE]   : String(70)  @title : 'CHAR_VALUE';
    key![CHARVAL_DESC] : String(150) @title : 'CHARVAL_DESC';
// key![UID_CHAR_RATE] : Decimal(13, 2) @title : 'UID_CHAR_RATE';
}

@cds.persistence.exists
entity![V_UNIQUE_ID]{
    key![UNIQUE_ID]   : Integer    @title : 'MATVARID';
    key![PRODUCT_ID]  : String(40) @title : 'Product';
    key![LOCATION_ID] : String(4)  @title : 'LOCATION_ID';
    key![UNIQUE_DESC] : String(50) @title : 'UNIQUE DESC';
    key![UID_TYPE]    : String(1)  @title : 'CHARVAL_NUM';
    key![ACTIVE]      : Boolean    @title : 'CHAR_VALUE';
    key![CHAR_NUM]    : String(30) @title : 'CHAR_NUM';
    key![CHARVAL_NUM] : String(70) @title : 'CHARVAL_NUM';
}

@cds.persistence.exists
entity![V_ODRESTRICT]{
    key![RESTRICTION]  : String(30) @title : 'Restriction';
       // key![RTR_COUNTER]  : Integer    @title : 'Restriction Counter';
    key![CLASS_NUM]    : String(18) @title : 'Internal No. Class ';
    key![CLASS_NAME]   : String(20) @title : 'Class Name';
    key![CHAR_NUM]     : String(10) @title : 'Internal No. Characteristic';
    key![CHAR_NAME]    : String(30) @title : 'Characteristic Name';
    key![CHARVAL_NUM]  : String(70) @title : 'Internal No. Characteristic value';
    key![CHAR_VALUE]   : String(70) @title : 'Characteristic Value';
    key![OD_CONDITION] : String(2)  @title : 'Object Dep. Condition';
    key![CHAR_COUNTER] : Integer    @title : 'Characteristic Counter';
    key![ROW_ID]       : Integer    @title : 'Row ID';
}

@cds.persistence.exists
entity![V_LOCPRODLINERTR]{
    key![PRODUCT_ID]  : String(40) @title : 'PRODUCT_ID';
    key![LOCATION_ID] : String(4)  @title : 'LOCATION_ID';
    key![LINE_ID]     : String(40) @title : 'Line';
    key![RESTRICTION] : String(30) @title : 'Restriction';
    key![RTR_DESC]    : String(30) @title : 'Restriction Description';
}

@cds.persistence.exists
entity![V_CIR_CHAR_RATE]{
    key![LOCATION_ID]   : String(4)       @title : 'LOCATION_ID';
    key![PRODUCT_ID]    : String(40)      @title : 'PRODUCT_ID';
    key![WEEK_DATE]     : Date            @title : 'WEEK_DATE';
    key![MODEL_VERSION] : String(20)      @title : 'MODEL_VERSION';
    key![VERSION]       : String(10)      @title : 'VERSION';
    key![SCENARIO]      : String(32)      @title : 'SCENARIO';
    key![CHAR_NUM]      : String(30)      @title : 'CHAR_NUM';
    key![CHAR_NAME]     : String(30)      @title : 'Characteristic Name';
    key![CHAR_DESC]     : String(150);
    key![CHARVAL_NUM]   : String(70)      @title : 'CHARVAL_NUM';
    key![CHAR_VALUE]    : String(70)      @title : 'Characteristic Value';
    key![CHARVAL_DESC]  : String(150);
    key![SEQUENCE]      : Integer         @title : 'SEQUENCE';
    key![PLAN_QTY]      : Decimal(13, 3)  @title : 'PLAN_QTY';
    key![GEN_QTY]       : Integer         @title : 'GEN_QTY';
    key![DEVIATION]     : Decimal(31, 14) @title : 'DEVIATION';
}

@cds.persistence.exists
entity![V_PLANNEDCONFIG]{
    key![PARAMETER_ID]      : Integer     @title : 'PARAMETER_ID';
    key![GROUP_ID]          : Integer     @title : 'GROUP_ID';
    key![SEQUENCE]          : Integer     @title : 'SEQUENCE';
    key![DESCRIPTION]       : String(100) @title : 'DESCRIPTION';
    key![MIN_VALUE]         : Integer     @title : 'MIN_VALUE';
    key![MAX_VALUE]         : Integer     @title : 'MAX_VALUE';
    key![VALUE_HELP]        : Boolean     @title : 'VALUE_HELP';
    key![VALUE_HELP_TAB]    : String(20)  @title : 'VALUE_HELP_TAB';
    key![GROUP_DESCRIPTION] : String(100) @title : 'GROUP_DESCRIPTION';
    key![UNIT]              : String(5)   @title : 'UNIT';
    key![LOCATION_ID]       : String(4)   @title : 'LOCATION_ID';
    key![VALUE]             : String(500) @title : 'VALUE';
}


@cds.persistence.exists
entity![V_CIRVERSCEN]{
    key![LOCATION_ID] : String(4)  @title : 'LOCATION_ID';
    key![PRODUCT_ID]  : String(40) @title : 'PRODUCT_ID';
    key![REF_PRODID]  : String(40) @title : 'REF_PRODID';
    key![VERSION]     : String(10) @title : 'VERSION';
    key![SCENARIO]    : String(32) @title : 'SCENARIO';
}

@cds.persistence.exists
entity![V_BOMCRITICALCOMP]{
    ![LOCATION_ID] : String(4) not null  @title : 'LOCATION_ID';
    ![PRODUCT_ID]  : String(40) not null @title : 'PRODUCT_ID';
    ![ITEM_NUM]    : String(6) not null  @title : 'ITEM_NUM';
    ![COMPONENT]   : String(40) not null @title : 'COMPONENT';
    ![VALID_FROM]  : Date                @title : 'VALID_FROM';
    ![VALID_TO]    : Date                @title : 'VALID_TO';
    ![CRITICALKEY] : String(1)           @title : 'CRITICALKEY';
}

@cds.persistence.exists
entity![V_CIR_QTY_VARDESC]{
    ![LOCATION_ID]   : String(4) not null  @title : 'LOCATION_ID';
    ![PRODUCT_ID]    : String(40) not null @title : 'PRODUCT_ID';
    ![WEEK_DATE]     : Date not null       @title : 'WEEK_DATE';
    ![MODEL_VERSION] : String(20) not null @title : 'MODEL_VERSION';
    ![VERSION]       : String(10) not null @title : 'VERSION';
    ![SCENARIO]      : String(32) not null @title : 'SCENARIO';
    ![CHAR_NUM]      : String(10) not null @title : 'CHAR_NUM';
    ![CHARVAL_NUM]   : String(70) not null @title : 'CHARVAL_NUM';
    ![CHAR_DESC]     : String(150)         @title : 'CHAR_DESC';
    ![CHARVAL_DESC]  : String(150)         @title : 'CHARVAL_DESC';
    ![SEQUENCE]      : Integer             @title : 'SEQUENCE';
    ![OPT_QTY]       : Decimal(13, 3)      @title : 'OPT_QTY';
    ![CIR_QTY]       : Integer             @title : 'CIR_QTY';
    ![DIFF_QTY]      : Decimal(14, 3)      @title : 'DIFF_QTY';
}
