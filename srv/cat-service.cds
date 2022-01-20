using cp as od from '../db/data-model';
using V_CLASSCHAR from '../db/data-model';
using V_CHARVAL from '../db/data-model';
using V_OBDHDR  from '../db/data-model';
// using V_ODPROFILES from '../db/data-model';
service CatalogService @(impl : './lib/cat-service.js') {
    // Service on HDI entities
    //@odata.draft.enabled
    @readonly
    entity getProducts          as projection on od.PRODUCT;

    //@odata.draft.enabled
    @readonly
    entity getLocation          as projection on od.LOCATION;

    //@odata.draft.enabled
    @readonly
    entity getCustgroup         as projection on od.CUSTOMERGROUP;

    //@odata.draft.enabled
    @readonly
    entity getProdConfig        as projection on od.PROD_CONFIG;

    @readonly
    entity getSalesh            as projection on od.SALESH;

    //@odata.draft.enabled
    @readonly
    entity getLocProd           as projection on od.LOCATION_PRODUCT;

    @readonly
    entity getSalesCfg          as projection on od.SALESH_CONFIG;

   // @odata.draft.enabled
    @readonly
    entity getBomHeader         as projection on od.BOMHEADER;

    //@odata.draft.enabled
    @readonly
    entity getBomOD             as projection on od.BOM_OBJDEPENDENCY;

    @readonly
    entity getPirch             as projection on od.PIR_CH;

    @readonly
    entity getProdAttr          as projection on od.PROD_ATTRIBUTES;

    @readonly
    entity getODHdr             as projection on od.TS_OBJDEPHDR;

    @readonly
    entity getODCharHdr         as projection on od.TS_OBJDEP_CHARHDR

    entity getCharval           as projection on V_CHARVAL;

    @odata.draft.enabled
    entity getAccessNodes       as projection on od.ACCESS_NODES;

    @odata.draft.enabled
    entity getAuthObj           as projection on od.AUTH_OBJ;

    @odata.draft.enabled
    entity getAOPara            as projection on od.AUTH_OBJ_PARA

    @odata.draft.enabled
    entity getAEmpRole          as projection on od.AUTH_EMP_ROLE;

    @odata.draft.enabled
    entity getAuthRole          as projection on od.AUTH_ROLE;

    @odata.draft.enabled
    entity getARObj             as projection on od.AUTH_ROLE_OBJ;

    @readonly
    entity getIBPFdem           as projection on od.IBP_FUTUREDEMAND;

    @readonly
    entity getIBPFplan          as projection on od.IBP_FCHARPLAN;

    @readonly
    entity getIBPFres           as projection on od.IBP_RESULTPLAN;


    entity getProfiles          as projection on od.PAL_PROFILEMETH;
    entity getProfileParameters as projection on od.PAL_PROFILEMETH_PARA;
    entity getMODHeader         as projection on V_OBDHDR;
    entity getProfileOD         as projection on od.PAL_PROFILEOD;
    // entity getObjDepProfiles    as projection on V_ODPROFILES;
    // Generate batch req 
    entity genProfileParam      as projection on od.IP_PROFILEMETH_PARA;
    entity genProfileOD         as projection on od.IP_PROFILEOD;

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
    //function createProf() returns String;
    function fGetNodeDet(NODE_TYPE : String(2), CHILD_NODE : String(50), PARENT_NODE : String(50)) returns array of getAccessNodes;
    function generate_timeseries() returns String;
    function get_objdep() returns array of objectDep;
    function getODProfiles() returns array of odprofiles;
    action gen_timeseries() returns String;

}
/*
service CatalogSrvBtp @(impl : './lib/cat-service.js') {
    type bomOD{
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        ITEM_NUM    : String(5) ;
        COMPONENT   : String(40);
        COMP_QTY    : Decimal(13,3);
        VALID_FROM  : Date;
        VALID_TO    : Date;
        OBJ_DEP     : String(30);
        OBJDEP_DESC : String(30);
        OBJ_COUNTER  : Integer;
        CHAR_NUM     : String(10);
        CHAR_COUNTER : Integer   ;
        CHARVAL_NUM  : String(10);
        OD_CONDITION : String(2);
        ROW_ID       : Integer;
    }
    //function getBOMOD () returns String;
   action generate_timeseries( LOCATION_ID : String(4) ,
                                DATE_LOW   : Date,
                                DATE_HIGH  : Date );

}
service CatalogSrvML @(impl : './lib/cat-serviceml.js') {
    type pf_exec{
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        OBJ_DEP     : String(30);
    }
     function profile_exec(LOCATION_ID : String(4),
                            PRODUCT_ID  : String(40),
                            OBJ_DEP     : String(30)) returns String;
}*/
