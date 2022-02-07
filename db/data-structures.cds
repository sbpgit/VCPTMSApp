context cp_ds{
  type objectDep {
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        OBJ_DEP     : String(30);
        OBJ_COUNTER : Integer
    }

    type odprofiles {
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        COMPONENT   : String(40);
        PROFILE     : String(50);
        OBJ_DEP     : String(30);
        OBJDEP_DESC  : String(30);
        STRUC_NODE  : String(50);
    }
    type odhistory{    
        CAL_DATE    : Date;    
        OBJ_DEP     : String(30);
        OBJ_COUNTER : Integer;
        ODCOUNT     : String(10);
        ROW_ID1     : String(10);
        ROW_ID2     : String(10);
        ROW_ID3     : String(10);
        ROW_ID4     : String(10);
        ROW_ID5     : String(10);
        ROW_ID6     : String(10);
        ROW_ID7     : String(10);
        ROW_ID8     : String(10);
        ROW_ID9     : String(10);
        ROW_ID10     : String(10);
        ROW_ID11     : String(10);
        ROW_ID12     : String(10);
    } 
    type odfuture{    
        CAL_DATE    : Date;    
        OBJ_DEP     : String(30);
        OBJ_COUNTER : Integer;
        VERSION     : String(10);
        SCENARIO    : String(32);
        ODCOUNT     : String(10);
        ROW_ID1     : String(10);
        ROW_ID2     : String(10);
        ROW_ID3     : String(10);
        ROW_ID4     : String(10);
        ROW_ID5     : String(10);
        ROW_ID6     : String(10);
        ROW_ID7     : String(10);
        ROW_ID8     : String(10);
        ROW_ID9     : String(10);
        ROW_ID10     : String(10);
        ROW_ID11     : String(10);
        ROW_ID12     : String(10);
    } 
}