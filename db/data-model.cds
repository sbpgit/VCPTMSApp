//namespace config.products;
//namespace app.schema;
using {
    managed,
    cuid,
    sap.common
} from '@sap/cds/common';

context cp {
    //namespace app.schema;

    entity LOCATION : managed {
        key LOCATION_ID    : String(4)     @title : 'Location ';
            LOCATION_DESC  : String(30)    @title : 'Location Descritpion';
            LOCATION_TYPE  : String(1)     @title : 'Location Type';
            LATITUDE       : Decimal(10, 8)@title : 'Latitude';
            LONGITUTE      : Decimal(10, 8)@title : 'Longitude';
            RESERVE_FIELD1 : String(20)    @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)    @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)    @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)    @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)    @title : 'Reserve Field5';
            AUTH_GROUP     : String(4)     @title : 'Authorization Group';
    };

    // Customer group
    entity CUSTOMERGROUP : managed {
        key CUSTOMER_GROUP : String(2) @title : 'Customer Group';
            CUSTOMER_DESC  : String(20)@title : 'Customer Description';
            RESERVE_FIELD1 : String(20)@title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)@title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)@title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)@title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)@title : 'Reserve Field5';
            AUTH_GROUP     : String(4) @title : 'Authorization Group';
    };

    // Product
    entity PRODUCT : managed {
        key PRODUCT_ID     : String(40)@title : 'Product';
            PROD_DESC      : String(40)@title : 'Product Description';
            PROD_FAMILY    : String(30)@title : 'Product Family';
            PROD_GROUP     : String(30)@title : 'Product Group';
            PROD_MODEL     : String(30)@title : 'Product Model';
            PROD_MDLRANGE  : String(30)@title : 'Product Range';
            PROD_SERIES    : String(30)@title : 'Product Series';
            RESERVE_FIELD1 : String(20)@title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)@title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)@title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)@title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)@title : 'Reserve Field5';
            AUTH_GROUP     : String(4) @title : 'Authorization Group';
    };

    // Product and LOcation table
    entity LOCATION_PRODUCT {
        key LOCATION_ID       : String(4) @title : 'Location ';
        key PRODUCT_ID        : String(40)@title : 'Product';
            LOTSIZE_KEY       : String(2) @title : 'Lot Size Key';
            LOT_SIZE          : Integer @title : 'Lot Size';
            PROCUREMENT_TYPE  : String(1) @title : 'Procurement Type';
            PLANNING_STRATEGY : String(2) @title : 'Planning Strategy';
    };

    entity BOMHEADER : managed {
        key LOCATION_ID : String(4)     @title : 'Location '; //Association to ZLOCATION;//
        key PRODUCT_ID  : String(40)    @title : 'Product';
        key ITEM_NUM    : String(5)     @title : 'Item Number ';
        key COMPONENT   : String(40)    @title : 'Component';
            COMP_QTY    : Decimal(13, 3)@title : 'Component Quantity';
            VALID_FROM  : Date          @title : 'Valid From';
            VALID_TO    : Date          @title : 'Valid To';
    };

    entity BOM_OBJDEPENDENCY {
        key LOCATION_ID : String(4)     @title : 'Location '; //Association to ZLOCATION;//
        key PRODUCT_ID  : String(40)    @title : 'Product';
        key ITEM_NUM    : String(5)     @title : 'Item Number ';
        key COMPONENT   : String(40)    @title : 'Component';
        key OBJ_DEP     : String(30)    @title : 'Object Dependency';
            OBJDEP_DESC : String(30)    @title : 'Object Dependency Desc';
            COMP_QTY    : Decimal(13, 3)@title : 'Component Quantity';
            VALID_FROM  : Date          @title : 'Valid From';
            VALID_TO    : Date          @title : 'Valid To';
    };

    entity OBJDEP_HEADER {
        key OBJ_DEP      : String(30)@title : 'Object Dependency';
        key OBJ_COUNTER  : Integer   @title : 'Object Dependency Counter';
        key CLASS_NUM    : String(18)@title : 'Internal class number';
        key CHAR_NUM     : String(10)@title : 'Internal Char. number';
        key CHAR_COUNTER : Integer   @title : 'Characteristic counter';
        key CHARVAL_NUM  : String(10)@title : 'Internal Char. number';
            OD_CONDITION : String(2) @title : 'Object Dependency condition ';
            ROW_ID       : Integer   @title : 'Attribute Index ';
    };

    entity PIR_CH {
        key PRODUCT_ID   : String(40)@title : 'Product';
        key PLANT        : String(4) @title : 'Plant';
        key REQ_DATE     : Date      @title : 'Req Date';
        key PT_NUMBER    : String(10)@title : 'PT Number';
        key PT_LINE      : String(5) @title : 'PT Line';
        key SESSION_ID   : String(32)@title : 'Session ID';
            CHAR_NAME    : String(30)@title : 'Characteristic ';
            CHAR_VALUE   : String(70)@title : 'Characteristic Value';
            FLAG_USAGE   : String(1) @title : 'Flag Usage';
            CH_QTY       : Double    @title : 'Change Qty';
            PROCESS_FLAG : String(1) @title : 'Process Flag';
            CHANGED_DATE : Date      @title : 'Changed Date';
            CHANGED_BY   : String(12)@title : 'Changed By';
            CREATED_DATE : Date      @title : 'Created Date';
            CREATED_BY   : String(12)@title : 'Created By';
            CHANGED_TIME : Time      @title : 'Changed Time';
            CREATED_TIME : Time      @title : 'Created Time';
    };
    entity PRODUCT_CLASS {
        key PRODUCT_ID     : String(40)@title : 'Product Id';
        key CLASS_NUM      : String(18)@title : 'Class Num';
            CHANGED_DATE   : Date      @title : 'Changed Date';
            CHANGED_BY     : String(12)@title : 'Changed By';
            CREATED_DATE   : Date      @title : 'Created Date';
            CREATED_BY     : String(12)@title : 'Created By';
            CHANGED_TIME   : Time      @title : 'Changed Time';
            CREATED_TIME   : Time      @title : 'Created Time';
    };

    // entity PROD_CONFIG {
    //     key PRODUCT_ID     : String(40)@title : 'Product Id';
    //     key LOCATION_ID    : String(4) @title : 'Location ID';
    //     key CLASS          : String(18)@title : 'Class';
    //     key CHAR_NUM       : String(10)@title : 'Internal number Char.';
    //     key CHARVAL_NUM    : String(10)@title : 'Internal number Char. Value ';
    //         CHARVAL_DESC   : String(70)@title : 'Character Value Desc';
    //         CHAR_ATTR      : String(30)@title : 'Characteristic Attribute';
    //         CHAR_DESC      : String(50)@title : 'Characteristic Description';
    //         CUSTOMER_GROUP : String(2) @title : 'Customer Group';
    //         RESERVE_FIELD1 : String(20)@title : 'Reserve Field1';
    //         RESERVE_FIELD2 : String(20)@title : 'Reserve Field2';
    //         RESERVE_FIELD3 : String(20)@title : 'Reserve Field3';
    //         RESERVE_FIELD4 : String(20)@title : 'Reserve Field4';
    //         RESERVE_FIELD5 : String(20)@title : 'Reserve Field5';
    //         CHANGED_DATE   : Date      @title : 'Changed Date';
    //         CHANGED_BY     : String(12)@title : 'Changed By';
    //         CREATED_DATE   : Date      @title : 'Created Date';
    //         CREATED_BY     : String(12)@title : 'Created By';
    //         CHANGED_TIME   : Time      @title : 'Changed Time';
    //         CREATED_TIME   : Time      @title : 'Created Time';
    // };

    entity PROD_ATTRIBUTES {
        key LOCATION_ID   : String(4) @title : 'Location ID';
        key PRODUCT_ID    : String(40)@title : 'Product Id';
            PROD_FAMILY   : String(30)@title : 'Product Family';
            PROD_GROUP    : String(30)@title : 'Product group';
            PROD_MODEL    : String(30)@title : 'Product Model';
            PROD_MDLRANGE : String(30)@title : 'Product Model Range';
            PROD_SERIES   : String(30)@title : 'Product Series';
    };

    entity SALESH {
        key SALES_DOC        : String(10)    @title : 'Sales Document';
        key SALESDOC_ITEM    : String(6)     @title : 'Sales Document Item';
            DOC_CREATEDDATE  : Date          @title : 'Document Created on';
            SCHEDULELINE_NUM : String(4)     @title : 'Schedule Line Number';
            PRODUCT_ID       : String(40)    @title : 'Product Id';
            REASON_REJ       : String(2)     @title : 'Reason rejection';
            UOM              : String(3)     @title : 'UOM';
            CONFIRMED_QTY    : Decimal(13, 3)@title : 'Confirmed Qty';
            ORD_QTY          : Decimal(13, 3)@title : 'Order Quantity';
            MAT_AVAILDATE    : Date          @title : 'Material Availability Date';
            NET_VALUE        : Decimal(15, 2)@title : 'Net Value';
            CUSTOMER_GROUP   : String(2)     @title : 'Customer Group';
            LOCATION_ID      : String(4)     @title : 'Location ID';
            CHANGED_DATE     : Date          @title : 'Changed Date';
            CHANGED_BY       : String(12)    @title : 'Changed By';
            CREATED_DATE     : Date          @title : 'Created Date';
            CREATED_BY       : String(12)    @title : 'Created By';
            CHANGED_TIME     : Time          @title : 'Changed Time';
            CREATED_TIME     : Time          @title : 'Created Time';
    };

    entity SALESH_CONFIG {
        key SALES_DOC      : String(10)@title : 'Sales Document';
        key SALESDOC_ITEM  : String(6) @title : 'Sales Document Item';
        key CHAR_NUM       : String(10)@title : 'Internal number Char.';
            CHARVAL_NUM    : String(10)@title : 'Internal number Char. Value ';
            PRODUCT_ID     : String(40)@title : 'Product Id';
           // PROD_AVAILDATE : Date      @title : 'Prod Availability Date';
            CHANGED_DATE   : Date      @title : 'Changed Date';
            CHANGED_BY     : String(12)@title : 'Changed By';
            CREATED_DATE   : Date      @title : 'Created Date';
            CREATED_BY     : String(12)@title : 'Created By';
            CHANGED_TIME   : Time      @title : 'Changed Time';
            CREATED_TIME   : Time      @title : 'Created Time';
    };

    entity SALESH_CFG_SMRY {
        key WEEK_DATE      : Date          @title : 'Week Date';
        key CHAR_NUM       : String(10)    @title : 'Internal number Char.';
        key CHARVAL_NUM    : String(10)    @title : 'Internal number Char. Value ';
        key CLASS_NUM      : String(18)    @title : 'Internal number class';
        key PRODUCT_ID     : String(40)    @title : 'Product ID';
        key CUSTOMER_GROUP : String(2)     @title : 'Customer Group';
            LOCATION_ID    : String(4)     @title : 'Location ID';
            SALEHIST_PROD  : Decimal(13, 3)@title : 'Confirmed Quantity';
            RESERVE_FIELD1 : String(20)    @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)    @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)    @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)    @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)    @title : 'Reserve Field5';
            CHANGED_DATE   : Date          @title : 'Changed Date';
            CHANGED_BY     : String(12)    @title : 'Changed By';
            CREATED_DATE   : Date          @title : 'Created Date';
            CREATED_BY     : String(12)    @title : 'Created By';
            CHANGED_TIME   : Time          @title : 'Changed Time';
            CREATED_TIME   : Time          @title : 'Created TIme';
    };

    entity SALESH_SUMMARY {
        key WEEK_DATE      : Date          @title : 'Week Date';
        key PRODUCT_ID     : String(40)    @title : 'Product ID';
        key LOCATION_ID    : String(4)     @title : 'Location ID';
        key CUSTOMER_GROUP : String(2)     @title : 'Customer Group';
            DEMAND_PROD    : String(10)    @title : 'Demand';
            SALEHIST_PROD  : Decimal(13, 3)@title : 'Confirmed Quantity';
            RESERVE_FIELD1 : String(20)    @title : 'Reserve Field1';
            RESERVE_FIELD2 : String(20)    @title : 'Reserve Field2';
            RESERVE_FIELD3 : String(20)    @title : 'Reserve Field3';
            RESERVE_FIELD4 : String(20)    @title : 'Reserve Field4';
            RESERVE_FIELD5 : String(20)    @title : 'Reserve Field5';
            CHANGED_DATE   : Date          @title : 'Changed Date';
            CHANGED_BY     : String(12)    @title : 'Changed By';
            CREATED_DATE   : Date          @title : 'Created Date';
            CREATED_BY     : String(12)    @title : 'Created By';
            CHANGED_TIME   : Time          @title : 'Changed Time';
            CREATED_TIME   : Time          @title : 'Created TIme';
    };

    entity TS_OBJDEPHDR {
        key CAL_DATE     : Date      @title : 'Date';
        key LOCATION_ID  : String(4) @title : 'Location ID';
        key PRODUCT_ID   : String(40)@title : 'Product ID';
        key OBJ_TYPE     : String(2) @title : 'Object Type';
        key OBJ_DEP      : String(30)@title : 'Object Dependency';
        key OBJ_COUNTER  : Integer   @title : 'Object Counter';
            SUCCESS      : Integer   @title : 'Count';
            SUCCESS_RATE : Double    @title : 'Sucess Rate';
    };

    entity TS_OBJDEP_CHARHDR {
        key CAL_DATE     : Date      @title : 'Date';
        key LOCATION_ID  : String(4) @title : 'Location ID';
        key PRODUCT_ID   : String(40)@title : 'Product ID';
        key OBJ_TYPE     : String(2) @title : 'Object Type';
        key OBJ_DEP      : String(30)@title : 'Object Dependency';
        key OBJ_COUNTER  : Integer   @title : 'Object Counter';
        key ROW_ID       : Integer   @title : ' Attribute Index';
            SUCCESS      : Integer   @title : 'Count';
            SUCCESS_RATE : Double    @title : 'Sucess Rate';
    };

    entity TS_OBJDEPHDR_F {
        key CAL_DATE         : Date      @title : 'Date';
        key LOCATION_ID      : String(4) @title : 'Location ID';
        key PRODUCT_ID       : String(40)@title : 'Product ID';
        key OBJ_TYPE         : String(2) @title : 'Object Type';
        key OBJ_DEP          : String(30)@title : 'Object Dependency';
        key OBJ_COUNTER      : Integer   @title : 'Object Counter';
            PREDICTED        : Double    @title : 'Predicted';
            PREDICTED_TIME   : Timestamp @title : 'Predicted Time';
            PREDICTED_STATUS : String(8) @title : 'Predicted Status';
    };

    //  key OBJ_COUNTER : Integer   @title : 'Object Counter';
    //SUCCESS     : Integer   @title : 'Count';
    entity TS_OBJDEP_CHARHDR_F {
        key CAL_DATE    : Date      @title : 'Date';
        key LOCATION_ID : String(4) @title : 'Location ID';
        key PRODUCT_ID  : String(40)@title : 'Product ID';
        key OBJ_TYPE    : String(2) @title : 'Object Type';
        key OBJ_DEP     : String(30)@title : 'Object Dependency';
        key OBJ_COUNTER : Integer   @title : 'Object Counter';
        key ROW_ID      : Integer   @title : ' Attribute Index';
        key VERSION     : String(10)    @title : 'Version';
        key SCENARIO    : String(32)    @title : 'Scenario';
            SUCCESS     : Integer   @title : 'Count';
            SUCCESS_RATE : Double    @title : 'Sucess Rate';
    };

    // Classes
    entity CLASS : managed {
        key CLASS_NUM  : String(18) @title : 'Internal class number';
            CLASS_NAME : String(20) @title : 'Class Name';
            CLASS_TYPE : String(3)  @title : 'Class Type';
            CLASS_DESC : String(150)@title : 'Class Description';
            AUTHGROUP  : String(4)  @title : 'Authorization Group';
    };

    //Characteristitcs
    entity CHARACTERISTICS : managed {
        key CLASS_NUM   : String(18) @title : 'Internal class number';
        key CHAR_NUM    : String(10) @title : 'Internal Char. number';
            CHAR_NAME   : String(30) @title : 'Charateristic Name';
            CHAR_DESC   : String(150)@title : 'Charateristic Desc.';
            CHAR_GROUP  : String(10) @title : 'Charateristic Group';
            CHAR_TYPE   : String(4)  @title : 'Charateristic Type';
            ENTRY_REQ   : String(1)  @title : 'Entry request';
            CHAR_CATGRY : String(40) @title : 'Charateristic Category';
    };

    // Characteristic Values
    entity CHAR_VALUES : managed {
        key CHAR_NUM     : String(10) @title : 'Internal Char. number';
        key CHARVAL_NUM  : String(15) @title : 'Internal Char. number';
            CHAR_VALUE   : String(70) @title : 'Charateristic Value';
            CHARVAL_DESC : String(150)@title : 'Charateristic Value Desc.';
            CATCH_ALL    : String(1)  @title : 'Catch all';
    };

    //entity for Access nodes
    entity ACCESS_NODES : managed {
        key CHILD_NODE  : String(50);// @title : 'Child Node';
        key PARENT_NODE : String(50);// @title : 'Parent Node';
            NODE_TYPE   : String(2);//  @title : 'Node Type';
            NODE_DESC   : String(200);//@tile  : 'Node Descriptions';
            AUTH_GROUP  : String(4);//  @title : 'Authorization Group';
    };
    entity PVS_NODES : managed {
        key CHILD_NODE  : String(50);// @title : 'Child Node';
        key PARENT_NODE : String(50);// @title : 'Parent Node';
            ACCESS_NODES: String(50);
            NODE_TYPE   : String(2);//  @title : 'Node Type';
            NODE_DESC   : String(200);//@tile  : 'Node Descriptions';
            AUTH_GROUP  : String(4);//  @title : 'Authorization Group';
    };

    entity PROD_ACCNODE : managed {
        key LOCATION_ID : String(4) @title : 'Location ID';
        key PRODUCT_ID  : String(40)@title : 'Product ID';
            ACCESS_NODE : String(50)@title : 'Access Node';
    };

    entity PVS_BOM : managed {
        key LOCATION_ID : String(4) @title : 'Location ID';
        key PRODUCT_ID  : String(40)@title : 'Product ID';
        key COMPONENT   : String(40)@title : 'Component';
            STRUC_NODE  : String(50)@title : 'Structure Node'
    }

    entity TS_ORDERRATE : managed {
        key WEEK_DATE   : Date     @title : 'Date';
        key LOCATION_ID : String(4)@title : 'Location ID';
            //key PRODUCT_ID  : String(40)@title : 'Product ID';
            ORDER_COUNT : Integer  @title : 'Order Count';
    }

    entity AUTH_OBJ : managed {
        key AUTH_OBJ    : String(100)@title : 'Authorization Object';
            DESCRIPTION : String(250)@title : 'Description';
    }

    entity AUTH_OBJ_PARA : managed {
        key AUTH_OBJ    : String(100)@title : 'Authorization Object';
        key PARAMETER   : String(100)@title : 'Parameter';
            DESCRIPTION : String(250)@title : 'Description';
    }

    entity AUTH_ROLE : managed {
        key ROLE_ID     : String(100)@title : 'Role ID';
            DESCRIPTION : String(250)@title : 'Description';
    }

    entity AUTH_ROLE_OBJ : managed {
        key ROLE_ID       : String(100)@title : 'Role ID';
        key AUTH_OBJ      : String(100)@title : 'Authorization Object';
        key PARAMETER     : String(100)@title : 'Parameter';
            PARAMETER_VAL : String(250)@title : 'Parameter';
    }

    entity AUTH_EMP_ROLE : managed {
        key USER    : String(100)@title : 'User';
        key ROLE_ID : String(100)@title : 'Role ID';
    }

    // IBP structures
    entity IBP_FUTUREDEMAND {
        key LOCATION_ID : String(4)     @title : 'Location ID';
        key PRODUCT_ID  : String(40)    @title : 'Product ID';
        key VERSION     : String(10)    @title : 'Version';
        key SCENARIO    : String(32)    @title : 'Scenario';
        key WEEK_DATE   : Date          @title : 'Weekly Date';
            QUANTITY    : Decimal(13, 3)@title : 'Demand Quantity';
    }

    entity IBP_FCHARPLAN {
        key LOCATION_ID : String(4)     @title : 'Location ID';
        key PRODUCT_ID  : String(40)    @title : 'Product ID';
        key CLASS_NUM   : String(20)    @title : 'Class Name';
        key CHAR_NUM    : String(30)    @title : 'Charateristic Name';
        key CHARVAL_NUM : String(70)    @title : 'Charateristic Value';
            // key CLASS_NAME  : String(20)    @title : 'Class Name';
            // key CHAR_NAME   : String(30)    @title : 'Charateristic Name';
            // key CHAR_VALUE  : String(70)    @title : 'Charateristic Value';
        key VERSION     : String(10)    @title : 'Version';
        key SCENARIO    : String(32)    @title : 'Scenario';
        key WEEK_DATE   : Date          @title : 'Weekly Date';
            OPT_PERCENT : Decimal(5, 2) @title : 'Option Percnetage';
            OPT_QTY     : Decimal(13, 3)@title : 'Option Quantity';
    }

    entity IBP_RESULTPLAN {
        key LOCATION_ID      : String(4) @title : 'Location ID';
        key PRODUCT_ID       : String(40)@title : 'Product ID';
        key OBJ_DEP          : String(30)@title : 'Object Dependency';
        key VERSION          : String(10)@title : 'Version';
        key SCENARIO         : String(32)@title : 'Scenario';
        key WEEK_Date        : Date          @title : 'Weekly Date';
            PREDICTED        : Double    @title : 'Predicted';
            PREDICTED_TIME   : Timestamp @title : 'Predicted Time';
            PREDICTED_STATUS : String(8) @title : 'Predicted Status';
    }

    // entity PAL_METHD_PARA : managed {
    //     key METHOD    : String(50) @title : 'Method Name';
    //     key PARA_NAME : String(100)@title : 'Parameter Name';
    //         paratype defvalue
    // }

    // entity PAL_PARAMETERS {
    //     key METHOD      : String(20)  @title : 'Method Name';
    //     key PARA_NAME   : String(30)  @title : 'Parameter Name';
    //         DATATYPE    : String(30)  @title : 'Data Type';
    //         DEFAULTVAL  : String(100) @title : 'Default Value';
    //         INTVAL      : Integer     @title : 'Integer';
    //         DOUBLEVAL   : Double      @title : 'Double';
    //         STRVAL      : String(50)  @title : 'String';
    //         DESCRIPTION : String(1000)@title : ' Description';
    //         DEPENDENCY  : String(1000)@title : ' Dependency';
    // }

    entity PAL_PROFILEMETH{
        key PROFILE      : String(50) @title : 'Profile';
            METHOD       : String(50) @title : 'Method Name';
            PRF_DESC     : String(200)@title : 'Profile Description';
            CREATED_DATE : Date       @title : 'Date';
            CREATED_BY   : String(12)@title : 'Created By'
    }

    entity PAL_PROFILEMETH_PARA {
        key PROFILE   : String(50);
        key METHOD    : String(50);
        key PARA_NAME : String(100);
            INTVAL    : Integer;
            DOUBLEVAL : Double;
            STRVAL    : String(20);
            PARA_DESC : String(1000);
            PARA_DEP  : String(1000);
            CREATED_DATE : Date;
            CREATED_BY   : String(12);
    }


    entity PAL_PROFILEOD : managed {
        key LOCATION_ID : String(4);
        key PRODUCT_ID  : String(40);
        key COMPONENT   : String(40);
        key PROFILE     : String(50);
        key OBJ_DEP     : String(30);
            STRUC_NODE  : String(50);
    }

    entity IP_PROFILEOD {
        key CREATED_DATE: Date;
        FLAG        : String(1);
        PROFILEOD: array of {
            LOCATION_ID : String(4) ;
            PRODUCT_ID  : String(40);
            COMPONENT   : String(40);
            PROFILE     : String(50);
            OBJ_DEP     : String(30);
        };
    }
    entity IP_PROFILEMETH_PARA {
        key CREATED_DATE: Date;
        FLAG        : String(1);
        PROFILEPARA: array of {
            PROFILE   : String(50);
            METHOD    : String(50);
            PARA_NAME : String(100);
            INTVAL    : Integer;
            DOUBLEVAL : Double;
            STRVAL    : String(20);
            PARA_DESC : String(1000);
            PARA_DEP  : String(1000);
            CREATED_DATE : Date   ;
            CREATED_BY   : String(12);
        };
    }
    entity ODRESTRICT {
        key OBJ_DEP      : String(30)@title : 'Object Dependency';
        key OBJ_COUNTER  : Integer   @title : 'Object Dependency Counter';
        key CLASS_NUM    : String(18)@title : 'Internal class number';
        key CHAR_NUM     : String(10)@title : 'Internal Char. number';
        key CHAR_COUNTER : Integer   @title : 'Characteristic counter';
        key CHARVAL_NUM  : String(10)@title : 'Internal Char. number';
            OD_CONDITION : String(2) @title : 'Object Dependency condition ';
            ROW_ID       : Integer   @title : 'Attribute Index ';
    };
    // entity PAL_MODEL_PARAMETERS {
    //     key MODEL_TYPE : String(10)  @title : 'Model Type';
    //     key PROFILE_ID : Integer     @title : 'Profile ID';
    //     key PARA_NAME  : String(100) @title : 'Parameter Name';
    //         INTVAL     : Integer;
    //         DOUBLEVAL  : Double;
    //         STRVAL     : String(20);
    //         PARA_DESC  : String(1000)@title : 'Parameter Description';
    // };
}

@cds.persistence.exists
entity![V_CHARVAL]{
    key![CHAR_NUM]    : String(10)@title : 'Characteristic Internal No.';
    key![CHAR_NAME]   : String(30)@title : 'Characteristic Name';
    key![CHAR_VALUE]  : String(70)@title : 'Characteristic Val Internal No.';
    key![CHARVAL_NUM] : String(10)@title : 'CHARVAL_NUM';
}

@cds.persistence.exists
entity![V_CLASSCHAR]{
    key![CLASS_NUM]    : String(18) @title : 'Internal class Number';
    key![CLASS_NAME]   : String(20) @title : 'Class Name';
    key![CLASS_TYPE]   : String(3)  @title : 'Class Type';
    key![CLASS_DESC]   : String(50) @title : 'Class Description';
    key![AUTHGROUP]    : String(4)  @title : 'Authorization group';
    key![CHAR_NUM]     : String(10) @title : 'Internal characteristic Number';
    key![CHAR_NAME]    : String(30) @title : 'Characteristic Name';
    key![CHAR_DESC]    : String(30) @title : 'Characteristic Desc';
    key![CHAR_GROUP]   : String(10) @title : 'Characteristic Group';
    key![CHAR_TYPE]    : String(4)  @title : 'Characteristic Type';
    key![CHAR_CATGRY]  : String(40) @title : 'Characteristic Category';
    key![CHARVAL_NUM]  : String(10) @title : 'Internal No. characteristic Value';
    key![CHAR_VALUE]   : String(70) @title : 'characteristic Value';
    key![CHARVAL_DESC] : String(150)@title : 'characteristic Value Desc';
    key![RANK]         : Double     @title : 'Rank';
}

@cds.persistence.exists 
entity ![V_OBDHDR] {
key     ![LOCATION_ID]: String(4)  @title: 'Location' ; 
key     ![PRODUCT_ID]: String(40)  @title: 'Product' ; 
key     ![COMPONENT]: String(40)  @title: 'COMPONENT' ; 
key     ![OBJ_DEP]: String(30)  @title: 'Object Dependency' ; 
key     ![OBJDEP_DESC]: String(30)  @title: 'OBJDEP_DESC' ;
key     ![CLASS_NUM]: String(18)  @title: 'Internal Class Number' ; 
key     ![CHAR_NUM]: String(10)  @title: 'Char Num' ; 
key     ![CHARVAL_NUM]: String(10)  @title: 'Charval Num' ; 
key     ![OD_CONDITION]: String(2)  @title: 'OD_CONDITION' ; 
key     ![OBJ_COUNTER]: Integer  @title: 'OBJ_COUNTER' ; 
key     ![CHAR_COUNTER]: Integer  @title: 'CHAR_COUNTER' ; 
key     ![ROW_ID]: Integer  @title: 'ROW_ID' ; 
}

@cds.persistence.exists 
Entity ![V_CLASSCHARVAL] {
key     ![CLASS_NUM]: String(18)  @title: 'CLASS_NUM' ; 
key     ![CLASS_NAME]: String(20)  @title: 'CLASS_NAME' ; 
key     ![CHAR_NUM]: String(10)  @title: 'CHAR_NUM' ; 
key     ![CHAR_NAME]: String(30)  @title: 'CHAR_NAME' ; 
key     ![CHAR_VALUE]: String(70)  @title: 'CHAR_VALUE' ; 
key     ![CHARVAL_NUM]: String(10)  @title: 'CHARVAL_NUM' ; 
}

@cds.persistence.exists 
Entity ![V_PRODCLSCHAR] {
key     ![PRODUCT_ID]: String(40)  @title: 'PRODUCT_ID' ; 
key     ![LOCATION_ID]: String(4)  @title: 'LOCATION_ID' ; 
key     ![CLASS_NUM]: String(18)  @title: 'CLASS_NUM' ; 
key     ![CLASS_NAME]: String(20)  @title: 'CLASS_NAME' ; 
key     ![PROD_DESC]: String(40)  @title: 'PROD_DESC' ; 
key     ![PROD_FAMILY]: String(30)  @title: 'PROD_FAMILY' ; 
key     ![PROD_GROUP]: String(30)  @title: 'PROD_GROUP' ; 
key     ![PROD_MODEL]: String(30)  @title: 'PROD_MODEL' ; 
key     ![PROD_MDLRANGE]: String(30)  @title: 'PROD_MDLRANGE' ; 
key     ![PROD_SERIES]: String(30)  @title: 'PROD_SERIES' ; 
}


@cds.persistence.exists 
Entity ![V_BOMODCOND] {
key     ![LOCATION_ID]: String(4)  @title: 'LOCATION_ID' ; 
key     ![PRODUCT_ID]: String(40)  @title: 'PRODUCT_ID' ; 
key     ![ITEM_NUM]: String(5)  @title: 'ITEM_NUM' ; 
key     ![COMPONENT]: String(40)  @title: 'COMPONENT' ; 
key     ![OBJ_DEP]: String(42)  @title: 'OBJ_DEP' ; 
key     ![OBJDEP_DESC]: String(30)  @title: 'OBJDEP_DESC' ; 
key     ![COMP_QTY]: Decimal(13, 3)  @title: 'COMP_QTY' ; 
key     ![VALID_FROM]: Date  @title: 'VALID_FROM' ; 
key     ![VALID_TO]: Date  @title: 'VALID_TO' ; 
// key     ![CLASS_NUM]: String(18)  @title: 'CLASS_NUM' ; 
// key     ![CLASS_NAME]: String(20)  @title: 'CLASS_NAME' ; 
// key     ![CHAR_NUM]: String(10)  @title: 'CHAR_NUM' ; 
// key     ![CHAR_NAME]: String(30)  @title: 'CHAR_NAME' ; 
// key     ![CHARVAL_NUM]: String(10)  @title: 'CHARVAL_NUM' ; 
// key     ![CHAR_VALUE]: String(70)  @title: 'CHAR_VALUE' ; 
// key     ![OD_CONDITION]: String(2)  @title: 'OD_CONDITION' ; 
// key     ![CHAR_COUNTER]: Integer  @title: 'CHAR_COUNTER' ; 
// key     ![ROW_ID]: Integer  @title: 'ROW_ID' ; 
}

@cds.persistence.exists 
Entity ![V_ODPROFILES] {
key     ![LOCATION_ID]: String(4)  @title: 'LOCATION_ID' ; 
key     ![PRODUCT_ID]: String(40)  @title: 'PRODUCT_ID' ; 
key     ![COMPONENT]: String(40)  @title: 'COMPONENT' ; 
key     ![OBJ_DEP]: String(42)  @title: 'OBJ_DEP' ; 
key     ![OBJDEP_DESC]: String(30)  @title: 'OBJDEP_DESC' ; 
key     ![PROFILE]: String(50)  @title: 'PROFILE' ; 
}

@cds.persistence.exists 
Entity ![V_SALESHCFG_CHARVAL] {
key     ![SALES_DOC]: String(10)  @title: 'Sales Document' ; 
key     ![SALESDOC_ITEM]: String(6)  @title: 'Sales Doc. Item' ; 
key     ![DOC_CREATEDDATE]: Date  @title: 'Doc. Created Date' ; 
key     ![SCHEDULELINE_NUM]: String(4)  @title: 'Schedule Line No.' ; 
key     ![PRODUCT_ID]: String(40)  @title: 'Product ID' ; 
// key     ![REASON_REJ]: String(2)  @title: 'Reason for Rej.' ; 
key     ![UOM]: String(3)  @title: 'UOM' ; 
key     ![CONFIRMED_QTY]: Decimal(13, 3)  @title: 'Confirmed Qty' ; 
key     ![ORD_QTY]: Decimal(13, 3)  @title: 'Ordered Qty' ; 
key     ![MAT_AVAILDATE]: Date  @title: 'Material Avail. Date' ; 
key     ![NET_VALUE]: Decimal(15, 2)  @title: 'Net Value' ; 
key     ![CUSTOMER_GROUP]: String(2)  @title: 'Customer Group' ; 
key     ![LOCATION_ID]: String(4)  @title: 'Location ID' ; 
key     ![CHAR_NAME]: String(30)  @title: 'Characteristic' ; 
key     ![CHAR_VALUE]: String(70)  @title: 'Characteristic Value' ; 
// key     ![CHANGED_DATE]: Date  @title: 'Changed Date' ; 
// key     ![CHANGED_BY]: String(12)  @title: 'Changed By' ; 
// key     ![CREATED_DATE]: Date  @title: 'Created Date' ; 
// key     ![CREATED_BY]: String(12)  @title: 'Created By' ; 
// key     ![CHANGED_TIME]: Time  @title: 'Changed Time' ; 
// key     ![CREATED_TIME]: Time  @title: 'Created Time' ; 
}
@cds.persistence.exists 
Entity ![V_ODCHARVAL] {
key     ![OBJ_DEP]: String(42)  @title: 'OBJ_DEP' ; 
key     ![CLASS_NUM]: String(18)  @title: 'CLASS_NUM' ; 
key     ![CLASS_NAME]: String(20)  @title: 'CLASS_NAME' ; 
key     ![CHAR_NUM]: String(10)  @title: 'CHAR_NUM' ; 
key     ![CHAR_NAME]: String(30)  @title: 'CHAR_NAME' ; 
key     ![CHARVAL_NUM]: String(10)  @title: 'CHARVAL_NUM' ; 
key     ![CHAR_VALUE]: String(70)  @title: 'CHAR_VALUE' ; 
key     ![OD_CONDITION]: String(2)  @title: 'OD_CONDITION' ; 
key     ![CHAR_COUNTER]: Integer  @title: 'CHAR_COUNTER' ; 
key     ![ROW_ID]: Integer  @title: 'ROW_ID' ; 
}

@cds.persistence.exists 
Entity ![V_LOCPROD] {
key     ![PRODUCT_ID]: String(40)  @title: 'PRODUCT_ID' ; 
key     ![LOCATION_ID]: String(4)  @title: 'LOCATION_ID' ; 
}

@cds.persistence.exists 
Entity ![V_TSODCHAR_H] {
key     ![CAL_DATE]: Date  @title: 'CAL_DATE' ; 
key     ![OBJ_DEP]: String(30)  @title: 'OBJ_DEP' ; 
key     ![OBJ_COUNTER]: Integer  @title: 'OBJ_COUNTER' ; 
key     ![SUCCESS]: Integer  @title: 'SUCCESS' ; 
key     ![ROW_ID]: Integer  @title: 'ROW_ID' ; 
key     ![CHAR_SUCCESS]: Integer  @title: 'CHAR_SUCCESS' ; 
}

@cds.persistence.exists 
Entity ![V_TSODCHAR_F] {
key     ![CAL_DATE]: Date  @title: 'CAL_DATE' ; 
key     ![OBJ_DEP]: String(30)  @title: 'OBJ_DEP' ; 
key     ![OBJ_COUNTER]: Integer  @title: 'OBJ_COUNTER' ; 
key     ![VERSION]: String(10)  @title: 'VERSION' ; 
key     ![SCENARIO]: String(32)  @title: 'SCENARIO' ; 
key     ![PREDICTED]: Double  @title: 'PREDICTED' ; 
key     ![ROW_ID]: Integer  @title: 'ROW_ID' ; 
key     ![CHAR_SUCCESS]: Integer  @title: 'CHAR_SUCCESS' ; 
}

@cds.persistence.exists 
Entity ![V_ODRESTRICT] {
key     ![OBJ_DEP]: String(30)  @title: 'Object Dependency' ; 
key     ![OBJ_COUNTER]: Integer  @title: 'Object Counter' ; 
key     ![CLASS_NUM]: String(18)  @title: 'Internal No. Class ' ; 
key     ![CLASS_NAME]: String(20)  @title: 'Class Name' ; 
key     ![CHAR_NUM]: String(10)  @title: 'Internal No. Characteristic' ; 
key     ![CHAR_NAME]: String(30)  @title: 'Characteristic Name' ; 
key     ![CHARVAL_NUM]: String(10)  @title: 'Internal No. Characteristic value' ; 
key     ![CHAR_VALUE]: String(70)  @title: 'Characteristic Value' ; 
key     ![OD_CONDITION]: String(2)  @title: 'Object Dep. Condition' ; 
key     ![CHAR_COUNTER]: Integer  @title: 'Characteristic Counter' ; 
key     ![ROW_ID]: Integer  @title: 'Row ID' ; 
}
/*
@cds.persistence.exists
@cds.persistence.calcview
entity![V_TIMESERIES]{
    key![DATE]             : Date      @title : 'Date';
    key![OBJECTDEPENDENCY] : String(15)@title : 'obj. Dependency';
    key![SUCESS]           : String(10)@title : 'Obj. Dependency Count';
    key![ATTRIBUTE1]       : String(10)@title : 'Attribute1';
    key![ATTRIBUTE2]       : String(10)@title : 'Attribute2';
    key![ATTRIBUTE3]       : String(10)@title : 'Attribute3';
    key![ATTRIBUTE4]       : String(10)@title : 'Attribute4';
    key![ATTRIBUTE5]       : String(10)@title : 'Attribute5';
    key![ATTRIBUTE6]       : String(10)@title : 'Attribute6';
    key![ATTRIBUTE7]       : String(10)@title : 'Attribute7';
    key![ATTRIBUTE8]       : String(10)@title : 'Attribute8';
    key![ATTRIBUTE9]       : String(10)@title : 'Attribute9';
    key![ATTRIBUTE10]      : String(10)@title : 'Attribute10';
    key![ATTRIBUTE11]      : String(10)@title : 'Attribute11';
    key![ATTRIBUTE12]      : String(10)@title : 'Attribute12';
    key![RANK]             : Double    @title : 'Rank';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_PRODUCT]{
    key![PRODUCT_ID]     : String(40)@title : 'ProductId';
    key![PROD_DESC]      : String(40)@title : 'Product Desc';
    key![PROD_FAMILY]    : String(40)@title : 'Product Family';
    key![PROD_GROUP]     : String(20)@title : 'Product Group';
    key![PROD_MODEL]     : String(20)@title : 'Product Model';
    key![PROD_MDLRANGE]  : String(20)@title : 'Product Model Range';
    key![PROD_SERIES]    : String(20)@title : 'Product Series';
    key![RESERVE_FIELD1] : String(20)@title : 'Reserve Field1';
    key![RESERVE_FIELD2] : String(20)@title : 'Reserve Field2';
    key![RESERVE_FIELD3] : String(20)@title : 'Reserve Field3';
    key![RESERVE_FIELD4] : String(20)@title : 'Reserve Field4';
    key![RESERVE_FIELD5] : String(20)@title : 'Reserve Field5';
    key![CHANGED_BY]     : String(12)@title : 'Changed By';
    key![CHANGED_TIME]   : Time      @title : 'Changed Time';
    key![CREATED_BY]     : String(12)@title : 'Created By';
    key![CREATED_TIME]   : Time      @title : 'CreatedTime';
    key![CHANGED_DATE]   : Date      @title : 'Changed Date';
    key![CREATED_DATE]   : Date      @title : 'Created Date';
    key![RANK]           : Double    @title : 'Rank';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_LOCATION]{
    key![LOCATION_ID]    : String(4) @title : 'Location ID';
    key![LOCATION_DESC]  : String(30)@title : 'Location Desc';
    key![LOCATION_TYPE]  : String(1) @title : 'Location Type';
    key![RESERVE_FIELD1] : String(20)@title : 'Reserve Field1';
    key![RESERVE_FIELD2] : String(20)@title : 'Reserve Field2';
    key![RESERVE_FIELD3] : String(20)@title : 'Reserve Field3';
    key![RESERVE_FIELD4] : String(20)@title : 'Reserve Field4';
    key![RESERVE_FIELD5] : String(20)@title : 'Reserve Field5';
    key![CHANGED_DATE]   : Date      @title : 'Changed Date';
    key![CHANGED_BY]     : String(12)@title : 'Changed By';
    key![CREATED_DATE]   : Date      @title : 'Created Date';
    key![CREATED_BY]     : String(12)@title : 'Created By';
    key![CHANGED_TIME]   : Time      @title : 'Changed Time';
    key![CREATED_TIME]   : Time      @title : 'Created Time';
    key![RANK]           : Double    @title : 'Rank';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_CUSTOMERGROUP]{
    key![CUSTOMER_GRP]   : String(2) @title : 'CUSTOMER_GRP: CUSTOMER_GRP';
    key![CUSTOMER_DESC]  : String(20)@title : 'CUSTOMER_DESC: CUSTOMER_DESC';
    key![RESERVE_FIELD1] : String(20)@title : 'RESERVE_FIELD1: RESERVE_FIELD1';
    key![RESERVE_FIELD2] : String(20)@title : 'RESERVE_FIELD2: RESERVE_FIELD2';
    key![RESERVE_FIELD3] : String(20)@title : 'RESERVE_FIELD3: RESERVE_FIELD3';
    key![RESERVE_FIELD4] : String(20)@title : 'RESERVE_FIELD4: RESERVE_FIELD4';
    key![RESERVE_FIELD5] : String(20)@title : 'RESERVE_FIELD5: RESERVE_FIELD5';
    key![CHANGED_DATE]   : Date      @title : 'CHANGED_DATE: CHANGED_DATE';
    key![CHANGED_BY]     : String(12)@title : 'CHANGED_BY: CHANGED_BY';
    key![CREATED_DATE]   : Date      @title : 'CREATED_DATE: CREATED_DATE';
    key![CREATED_BY]     : String(12)@title : 'CREATED_BY: CREATED_BY';
    key![CHANGED_TIME]   : Time      @title : 'CHANGED_TIME: CHANGED_TIME';
    key![CREATED_TIME]   : Time      @title : 'CREATED_TIME: CREATED_TIME';
    key![RANK]           : Double    @title : 'RANK: RANK';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_PRODCONFIG]{
    key![PRODUCT_ID]     : String(40)@title : 'Product ID';
    key![LOCATION_ID]    : String(4) @title : 'Location ID';
    key![CLASS]          : String(18)@title : 'Class';
    key![CHAR_NAME]      : String(30)@title : 'Charateristic Name';
    key![CHAR_VALUE]     : String(70)@title : 'Charateristic Value';
    key![CHARVAL_DESC]   : String(70)@title : 'Char. Value Description';
    key![CHAR_ATTR]      : String(30)@title : 'Char. Attributes';
    key![CHAR_DESC]      : String(50)@title : 'Char. Description';
    key![CUSTOMER_GRP]   : String(2) @title : 'Customer Group';
    key![RESERVE_FIELD1] : String(20)@title : 'Reserve Field1';
    key![RESERVE_FIELD2] : String(20)@title : 'Reserve Field2';
    key![RESERVE_FIELD3] : String(20)@title : 'Reserve Field3';
    key![RESERVE_FIELD4] : String(20)@title : 'Reserve Field4';
    key![RESERVE_FIELD5] : String(20)@title : 'Reserve Field5';
    key![CHANGED_DATE]   : Date      @title : 'Changed Date';
    key![CHANGED_BY]     : String(12)@title : 'Changed By';
    key![CREATED_DATE]   : Date      @title : 'Created Date';
    key![CREATED_BY]     : String(12)@title : 'Created By';
    key![CHANGED_TIME]   : Time      @title : 'Changed By';
    key![CREATED_TIME]   : Time      @title : 'Created Time';
    key![RANK]           : Double    @title : 'Rank';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_SALESH]{
    key![SALES_DOC]        : String(10)    @title : 'Sales Document';
    key![SALESDOC_ITEM]    : String(6)     @title : 'Sales Document Item';
    key![DOC_CREATEDDATE]  : Date          @title : 'Doc.created date';
    key![SCHEDULELINE_NUM] : String(4)     @title : 'Scheduleline No.';
    key![PRODUCT_ID]       : String(40)    @title : 'Product ID';
    key![REASON_REJ]       : String(2)     @title : 'Reason for Rejection';
    key![UOM]              : String(3)     @title : 'UOM';
    key![MAT_AVAILDATE]    : Date          @title : 'Mat. Availability Date';
    key![CUSTOMER_GRP]     : String(2)     @title : 'Cusotmer Group';
    key![LOCATION_ID]      : String(4)     @title : 'Location ID';
    key![CHANGED_DATE]     : Date          @title : 'Changed Date';
    key![CHANGED_BY]       : String(12)    @title : 'Changed By';
    key![CREATED_DATE]     : Date          @title : 'Created Date';
    key![CREATED_BY]       : String(12)    @title : 'Created By';
    key![CONFIRMED_QTY]    : Decimal(13, 3)@title : 'Confirmed Quantity';
    key![ORD_QTY]          : Decimal(13, 3)@title : 'Order Quantity';
    key![NET_VALUE]        : Decimal(15, 2)@title : 'Net Value';
    key![CHANGED_TIME]     : Time          @title : 'Changed By';
    key![CREATED_TIME]     : Time          @title : 'Created Time';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_LOCPROD]{
    key![LOCATION_ID]       : String(4) @title : 'Location';
    key![PRODUCT_ID]        : String(40)@title : 'Product';
    key![LOT_SIZE]          : String(2) @title : 'Lot Size';
    key![PROCURMENT_TYPE]   : String(1) @title : 'Procurement Type';
    key![PLANNING_STRATEGY] : String(2) @title : 'Planning Strategy';
    key![RANK]              : Double    @title : 'Rank';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_SALESH_CONFIG]{
    key![SALES_DOC]      : String(10)@title : 'Sales Document';
    key![SALESDOC_ITEM]  : String(6) @title : 'Sales Document Item';
    key![CHAR_NAME]      : String(30)@title : 'Characteristic Name';
    key![CHAR_VALUE]     : String(70)@title : 'Characteristic Value';
    key![PRODUCT_ID]     : String(40)@title : 'Product ID';
    key![PROD_AVAILDATE] : Date      @title : 'Product Availability Date';
    key![CHANGED_DATE]   : Date      @title : 'Changed Date';
    key![CHANGED_BY]     : String(12)@title : 'Changed By';
    key![CREATED_DATE]   : Date      @title : 'Created Date';
    key![CREATED_BY]     : String(12)@title : 'Created By';
    key![CHANGED_TIME]   : Time      @title : 'Changed By';
    key![CREATED_TIME]   : Time      @title : 'Created Time';
    key![RANK]           : Double    @title : 'Rank';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_BOMHEADER]{
    key![LOCATION_ID]  : String(4)     @title : 'Location ID';
    key![PRODUCT_ID]   : String(40)    @title : 'Product ID';
    key![ITEM_NUM]     : String(6)     @title : 'Item No.';
    key![COMPONENT]    : String(40)    @title : 'Component';
    key![VALID_FROM]   : Date          @title : 'Valid From';
    key![VALID_TO]     : Date          @title : 'Valid To';
    key![CHANGED_DATE] : Date          @title : 'Changed Date';
    key![CHANGED_BY]   : String(12)    @title : 'Changed By';
    key![CREATED_DATE] : Date          @title : 'Created Date';
    key![CREATED_BY]   : String(12)    @title : 'Created By';
    key![COMP_QTY]     : Decimal(13, 3)@title : 'Component Quantity';
    key![CHANGED_TIME] : Time          @title : 'Changed By';
    key![CREATED_TIME] : Time          @title : 'Created Time';
};


@cds.persistence.exists
@cds.persistence.calcview
entity![V_BOMOD]{
    key![LOCATION_ID] : String(4)     @title : 'Location ID';
    key![PRODUCT_ID]  : String(40)    @title : 'Product ID';
    key![ITEM_NUM]    : String(6)     @title : 'Item No.';
    key![COMPONENT]   : String(40)    @title : 'Component';
    key![OBJ_DEP]     : String(30)    @title : 'Object Dependency';
    key![OBJDEP_DESC] : String(30)    @title : 'Obj. Dependency description';
    key![VALID_FROM]  : Date          @title : 'Valid From';
    key![VALID_TO]    : Date          @title : 'Valid To';
    key![COMP_QTY]    : Decimal(13, 3)@title : 'Component Quantity';
};


@cds.persistence.exists
@cds.persistence.calcview
entity![V_PIRCH]{
    key![PRODUCT_ID]   : String(40)@title : 'Product ID';
    key![PLANT]        : String(4) @title : 'Plant';
    key![REQ_DATE]     : Date      @title : 'Reqest Date';
    key![PT_NUMBER]    : String(10)@title : 'PT Number';
    key![PT_LINE]      : String(5) @title : 'PT Line';
    key![SESSION_ID]   : String(32)@title : 'Session ID';
    key![CHAR_NAME]    : String(30)@title : 'Characteristic Name';
    key![CHAR_VALUE]   : String(70)@title : 'Characteristic Value';
    key![FLAG_USAGE]   : String(1) @title : 'Flag Usage';
    key![PROCESS_FLAG] : String(1) @title : 'Process Flag';
    key![CHANGED_BY]   : Date      @title : 'Changed By';
    key![CHANGED_TIME] : String(12)@title : 'Changed Time';
    key![CREATED_BY]   : Date      @title : 'Created By';
    key![CREATED_TIME] : String(12)@title : 'Created Time';
    key![CHANGE_QTY]   : Double    @title : 'Change Qunatity';
    key![CHANGED_DATE] : Time      @title : 'Changed Date';
    key![CREATED_DATE] : Time      @title : 'Created Date';
};

@cds.persistence.exists
@cds.persistence.calcview
entity![V_PRODATTR]{
    key![LOCATION_ID]   : String(4) @title : 'Location ID';
    key![PRODUCT_ID]    : String(40)@title : 'Product ID';
    key![PROD_FAMILY]   : String(30)@title : 'Product Family';
    key![PROD_GROUP]    : String(30)@title : 'Product Group';
    key![PROD_MODEL]    : String(30)@title : 'Product Model';
    key![PROD_MDLRANGE] : String(30)@title : 'Product Model Range';
    key![PROD_SERIES]   : String(30)@title : 'Product Series';
    key![RANK]          : Double    @title : 'Rank';
};


@cds.persistence.exists
@cds.persistence.calcview
entity![V_ODHDR]{
    key![CAL_DATE]    : Date      @title : 'Date';
    key![LOCATION_ID] : String(4) @title : 'Location ID';
    key![PRODUCT_ID]  : String(40)@title : 'Product ID';
    key![OBJ_TYPE]    : String(2) @title : 'Object Type';
    key![OBJ_DEP]     : String(15)@title : 'Object Dependency';
    key![SUCCESS]     : Integer   @title : 'Success Count';
};


@cds.persistence.exists
@cds.persistence.calcview
entity![V_ODCHARHDR]{
    key![CAL_DATE]    : Date      @title : 'Date';
    key![LOCATION_ID] : String(4) @title : 'Location ID';
    key![PRODUCT_ID]  : String(40)@title : 'Product ID';
    key![OBJ_TYPE]    : String(2) @title : 'Object Type';
    key![OBJ_DEP]     : String(15)@title : 'Object Dependency';
    key![ROW_ID]      : Integer   @title : 'Attribute Index';
    key![SUCCESS]     : Integer   @title : 'Success Count';
}
*/
