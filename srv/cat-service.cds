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
using V_ODRESTRICT FROM '../db/data-model';
using V_IBPVERSCENARIO from '../db/data-model';
using V_BOMPVS from '../db/data-model';
using V_TS_ODCHARPREDICTIONS from '../db/data-model';
using V_COMPOD_TSPRED from '../db/data-model';
using V_ODCHARIMPACT_VALUE from '../db/data-model';
using V_FCHARPLAN from '../db/data-model';
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
    entity gBomHeaderet         as projection on od.BOMHEADER;

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

    // @odata.draft.enabled
    //entity getNodes       as projection on od.ACCESS_NODES;
    entity getPVSNodes       as projection on od.PVS_NODES;

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
    entity getIBPFplan          as projection on V_FCHARPLAN;// od.IBP_FCHARPLAN;

    @readonly
    entity getIBPFres           as projection on od.IBP_RESULTPLAN;
     @readonly
    entity getODHdrRstr         as projection on V_ODRESTRICT;

    //
    @readonly
    entity getSaleshCfg         as projection on V_SALESHCFG_CHARVAL;

    @odata.draft.enabled
    entity genProdLocLine       as projection on od.PROD_LOC_LINE;

    @odata.draft.enabled
    entity genRtrHeader        as projection on od.RESTRICT_HEADER;

   // @odata.draft.enabled
    entity genProdAccessNode      as projection on od.PROD_ACCNODE;

   // @odata.draft.enabled
    entity genCompStrcNode        as projection on od.PVS_BOM;

    entity getPVSBOM            as projection on V_BOMPVS;

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
    entity getIbpVerScn        as projection on V_IBPVERSCENARIO;
    entity getOdCharImpact     as projection on V_ODCHARIMPACT_VALUE;//V_TS_ODCHARPREDICTIONS;
    entity getBOMPred          as projection on V_COMPOD_TSPRED;//V_BOM_TSPREDICTION;

    entity getAsmbComp          as projection on od.ASSEMBLY_COMP;
    //Component requirement qunatity determination
    function getCompreqQty(LOCATION_ID:String(4), PRODUCT_ID:String(40), VERSION : String(10), SCENARIO    : String(32) ) returns String;
    // Create PVS node structure
    function genpvs(NODE_TYPE : String(2), CHILD_NODE : String(50), PARENT_NODE : String(50), ACCESS_NODES: String(50), NODE_DESC:String(200), UPPERLIMIT: Integer, LOWERLIMIT: Integer, FLAG: String(1)) returns array of getPVSNodes;
    // Generate Timeseries
    function generate_timeseries(LOCATION_ID:String(4), PRODUCT_ID:String(40)) returns String;
    // Generate Timeseries
    function generate_timeseriesF(LOCATION_ID:String(4), PRODUCT_ID:String(40)) returns String;
    // Get Object dependency
    function get_objdep() returns array of ds.objectDep; //objectDep;
    //function getODProfiles() returns array of odprofiles;
    // Generate CSRF Token
    function getCSRFToken() returns String;
    // Generate OD history timeseries
    function genODHistory(OBJ_DEP:String(30),OBJ_COUNTER:String(10)) returns array of ds.odhistory;
    // Generate OD Future timeseries
    function genODFuture(OBJ_DEP:String(30),OBJ_COUNTER:String(10)) returns array of ds.odfuture;
    // Component weekly
    function getCompReqFWeekly(LOCATION_ID:String(4), PRODUCT_ID:String(40), VERSION : String(10), SCENARIO : String(32), COMPONENT:String(40), STRUCNODE  : String(50), FROMDATE: Date, TODATE: Date, MODEL_VERSION    : String(20)) returns array of ds.compreq;

    // Assembly Component weekly
    function getAsmbCompReqFWeekly(LOCATION_ID:String(4), PRODUCT_ID:String(40), VERSION : String(10), SCENARIO : String(32), FROMDATE: Date, TODATE: Date, MODEL_VERSION    : String(20)) returns array of ds.compreq;

    //productaccess node
    function genProdAN(LOCATION_ID:String(4), PRODUCT_ID:String(40), ACCESS_NODE:String(50)) returns array of genProdAccessNode;
    //component structure node
    function genCompSN(LOCATION_ID:String(4), PRODUCT_ID:String(40), ITEM_NUM:String(5),COMPONENT:String(40),STRUC_NODE  : String(50)) returns array of genCompStrcNode;
    //fucntion createProfiles and parameters
    function createProfiles( PROFILE: String(50), METHOD: String(50), PRF_DESC: String(200),CREATED_DATE:Date ,CREATED_BY:String(12)) returns String;
    function createProfilePara(FLAG             : String(1),
                PROFILE      : String(50),
                METHOD       : String(50),
                PARA_NAME    : String(100),
                INTVAL       : Integer,
                DOUBLEVAL    : Double,
                STRVAL       : String(20),
                PARA_DESC    : String(1000),
                PARA_DEP     : String(1000),
                CREATED_DATE : Date,
                CREATED_BY   : String(12)
            ) returns String;
    // Assign OD to a profile
    function asssignProfilesOD(FLAG : String(1),
                LOCATION_ID : String(4),
                PRODUCT_ID  : String(40),
                COMPONENT   : String(40),
                PROFILE     : String(50),
                OBJ_DEP     : String(30),
                STRUC_NODE  : String(50)
            ) returns String;
}
