using cp as od from '../db/data-model';
using cp_ds as ds from '../db/data-structures';
using V_CLASSCHAR from '../db/data-model';
using V_CHARVAL from '../db/data-model';
using V_OBDHDR from '../db/data-model';
using V_CLASSCHARVAL from '../db/data-model';
using V_PRODCLSCHAR from '../db/data-model';
using V_ODPROFILES from '../db/data-model';
using V_BOMODCOND from '../db/data-model';
using V_SALESHCFG_CHARVAL from '../db/data-model';
using V_ODCHARVAL from '../db/data-model';
using V_LOCPROD from '../db/data-model';
using V_TSODCHAR_H from '../db/data-model';
using V_TSODCHAR_F from '../db/data-model';
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
    // @readonly
    // entity getProdConfig        as projection on od.PROD_CONFIG;

    @readonly
    entity getSalesh            as projection on od.SALESH;

    //@odata.draft.enabled
    @readonly
    entity getLocProd           as projection on od.LOCATION_PRODUCT;

    entity getLocProdDet        as projection on V_LOCPROD;

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

    //
    @readonly
    entity getSaleshCfg         as projection on V_SALESHCFG_CHARVAL;

    entity getProfiles          as projection on od.PAL_PROFILEMETH;
    entity getProfileParameters as projection on od.PAL_PROFILEMETH_PARA;
    entity getMODHeader         as projection on V_OBDHDR;
    entity getProfileOD         as projection on od.PAL_PROFILEOD;
    entity getODProfiles        as projection on V_ODPROFILES;
    // Generate batch req
    entity genProfileParam      as projection on od.IP_PROFILEMETH_PARA;
    entity genProfileOD         as projection on od.IP_PROFILEOD;
    entity getProdClass         as projection on V_PRODCLSCHAR;
    entity getClassChar         as projection on V_CLASSCHARVAL;
    // Service to get BOM and OD condition
    entity getBomOdCond         as projection on V_BOMODCOND;
    entity getODcharval         as projection on V_ODCHARVAL;
    entity getODCharH          as projection on V_TSODCHAR_H;
    entity getODCharF          as projection on V_TSODCHAR_F;


    //function createProf() returns String;
    function fGetNodeDet(NODE_TYPE : String(2), CHILD_NODE : String(50), PARENT_NODE : String(50)) returns array of getAccessNodes;
    function generate_timeseries() returns String;
    function get_objdep() returns array of ds.objectDep; //objectDep;
    //function getODProfiles() returns array of odprofiles;
    function getCSRFToken() returns String;
    function genODHistory(OBJ_DEP:String(30),OBJ_COUNTER:String(10)) returns array of ds.odhistory;
    function genODFuture(OBJ_DEP:String(30),OBJ_COUNTER:String(10)) returns array of ds.odfuture;
    action gen_timeseries() returns String;

}
