using cp as od from '../db/data-model';
using cp_ds as ds from '../db/data-structures';

// using V_CHARVAL from '../db/data-model';
using V_OBDHDR from '../db/data-model';
using V_CLASSCHARVAL from '../db/data-model';
using {
    V_PRODCLSCHAR,
    V_PRODCLSCHARVAL,
    V_ODPROFILES,
    V_PARTIALPRODCHAR, 
    V_NEWPRODREFCHAR,
    V_GETVARCHARPS,
    V_UNIQUE_ID_ITEM,
    V_UNIQUE_ID,
    V_ODRESTRICT,
    V_LOCPRODLINERTR,
    V_CIR_CHAR_RATE
} from '../db/data-model';
// using V_ODPROFILES from '../db/data-model';
using V_BOMODCOND from '../db/data-model';
using V_SALESHCFG_CHARVAL from '../db/data-model';
using V_ODCHARVAL from '../db/data-model';
using V_LOCPROD from '../db/data-model';
using V_IBPVERSCENARIO from '../db/data-model';
using V_BOMPVS from '../db/data-model';
using V_TS_ODCHARPREDICTIONS from '../db/data-model';
using V_COMPOD_TSPRED from '../db/data-model';
using V_ODCHARIMPACT_VALUE from '../db/data-model';
using {
    V_FCHARPLAN,
    V_ASMCOMP_REQ
} from '../db/data-model';
using V_PLANNEDCONFIG from '../db/data-model';


// using V_ASMCOMP_REQ from '../db/data-model';
service CatalogService @(impl : './lib/cat-service.js'){
    // Service on HDI entities
    // Get Products
    @readonly
    entity getProducts          as projection on od.PRODUCT;

    // Get locations
    @readonly
    entity getLocation          as projection on od.LOCATION;
    @readonly
    entity getLocationtemp          as projection on od.LOCATION;

    // Get customer group
    @readonly
    entity getCustgroup         as projection on od.CUSTOMERGROUP;

    // Get Sales history
    @readonly
    entity getSalesh            as projection on od.SALESH;

    //Get location product
    @readonly
    entity getLocProd           as projection on od.LOCATION_PRODUCT;

    // Get Location products based on product master
    entity getLocProdDet        as projection on V_LOCPROD;

    // Get sales history configuration
    @readonly
    entity getSalesCfg          as projection on od.SALESH_CONFIG;

    // Get BOM header
    @readonly
    entity gBomHeaderet         as projection on od.BOMHEADER;

    // BOM object dependency
    @readonly
    entity getBomOD             as projection on od.BOM_OBJDEPENDENCY;

    // Get PIR characteristics
    // @readonly
    // entity getPirch             as projection on od.PIR_CH;

    //Get Product Attributes
    // @readonly
    // entity getProdAttr          as projection on od.PROD_ATTRIBUTES;

    //History timeseries for Object dependency
   
    entity getODHdr             as projection on od.TS_OBJDEPHDR;

    //History timeseries for Object dependency characteristics
   
    entity getODCharHdr         as projection on od.TS_OBJDEP_CHARHDR

    //Get Charateristics and it values
    // entity getCharval           as projection on V_CHARVAL;
    // Get PVS nodes ( Access, Structure and View nodes)
    entity getPVSNodes          as projection on od.PVS_NODES;

    entity getClass             as projection on od.CLASS;

    //IBP Future demand
    @readonly
    entity getIBPFdem           as projection on od.IBP_FUTUREDEMAND;

    // IBP Future Characteristic plan
    @readonly
    entity getIBPFplan          as projection on V_FCHARPLAN;

    // // IBP timeseries result plan
    // @readonly
    // entity getIBPFres           as projection on od.IBP_RESULTPLAN;


    // Get sales history configuration and its characteristics
    @readonly
    entity getSaleshCfg         as projection on V_SALESHCFG_CHARVAL;

    // Get Product access node
    entity genProdAccessNode    as projection on od.PROD_ACCNODE;
    // PVS BOM details
    entity genCompStrcNode      as projection on od.PVS_BOM;
    // Structure node for BOM
    entity getPVSBOM            as projection on V_BOMPVS;
    // Get profiles
    entity getProfiles          as projection on od.PAL_PROFILEMETH;
    // Get Profile parameters
    entity getProfileParameters as projection on od.PAL_PROFILEMETH_PARA;
    // Get Object dependency rules and characteristic details
    entity getMODHeader         as projection on V_OBDHDR;
    // get master data profile Object dependency
    entity getProfileOD         as projection on od.PAL_PROFILEOD;
    // Fetch OD profiles
    entity getODProfiles        as projection on V_ODPROFILES;
    // service to hold input parameters for profile parameters
    // entity genProfileParam      as projection on od.IP_PROFILEMETH_PARA;
    // Service for OD profiles input
    // entity genProfileOD         as projection on od.IP_PROFILEOD;
    // Get products, location and class  details
    entity getProdClass         as projection on V_PRODCLSCHAR;
    // Get products, location and class  details
    entity getProdClsChar       as projection on V_PRODCLSCHARVAL;
    // Get class , characteristics and its values
    entity getClassChar         as projection on V_CLASSCHARVAL;
    // Service to get BOM and OD condition
    entity getBomOdCond         as projection on V_BOMODCOND;
    // Get Object dependency rule characteristics
    entity getODcharval         as projection on V_ODCHARVAL;
    //Get IBP version scenario
    entity getIbpVerScn         as projection on V_IBPVERSCENARIO;
    // Get Object dependency characteristics impact and prediction values
    entity getOdCharImpact      as projection on V_ODCHARIMPACT_VALUE;
    // Get BOM component-OD predcitions
    entity getBOMPred           as projection on V_COMPOD_TSPRED;
    // Get Assembly component requirements
    entity getAsmbCompReq       as projection on V_ASMCOMP_REQ;
    // Master data for Assembly and component
    entity getAsmbComp          as projection on od.ASSEMBLY_COMP;
    
    //Component requirement qunatity determination
    function getCompreqQty(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32))                                                                                                                                                        returns String;
    // Create PVS node structure
    function genpvs(NODE_TYPE : String(2), CHILD_NODE : String(50), PARENT_NODE : String(50), ACCESS_NODES : String(50), NODE_DESC : String(200), UPPERLIMIT : Integer, LOWERLIMIT : Integer, FLAG : String(1))                                                                  returns array of getPVSNodes;
    // Generate Timeseries
    function generate_timeseries(LOCATION_ID : String(4), PRODUCT_ID : String(40),PAST_DAYS : Integer)                                                                                                                                                                                               returns String;
    // Generate Timeseries
    function generate_timeseriesF(LOCATION_ID : String(4), PRODUCT_ID : String(40))                                                                                                                                                                                              returns String;
    // Get Object dependency
    function get_objdep() returns array of ds.objectDep; //objectDep;

    function getCompReqFWeekly(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32), COMPONENT : String(40), STRUCNODE : String(50), FROMDATE : Date, TODATE : Date, MODEL_VERSION : String(20))                                        returns array of ds.compreq;
    // Assembly Component weekly
    function getAsmbCompReqFWeekly(LOCATION_ID : String(4), PRODUCT_ID : String(40), VERSION : String(10), SCENARIO : String(32), FROMDATE : Date, TODATE : Date, MODEL_VERSION : String(20))                                                                                    returns array of ds.compreq;
    //productaccess node
    function genProdAN(LOCATION_ID : String(4), PRODUCT_ID : String(40), ACCESS_NODE : String(50))                                                                                                                                                                               returns array of genProdAccessNode;
    //component structure node
    function genCompSN(LOCATION_ID : String(4), PRODUCT_ID : String(40), ITEM_NUM : String(5), COMPONENT : String(40), STRUC_NODE : String(50))                                                                                                                                  returns array of genCompStrcNode;
    //fucntion createProfiles and parameters
    function createProfiles(PROFILE : String(50), METHOD : String(50), PRF_DESC : String(200), CREATED_DATE : Date, CREATED_BY : String(12))                                                                                                                                     returns String;
    // Create Profile parameters
    function createProfilePara(FLAG : String(1), PROFILE : String(50), METHOD : String(50), PARA_NAME : String(100), INTVAL : Integer, DOUBLEVAL : Double, STRVAL : String(20), PARA_DESC : String(1000), PARA_DEP : String(1000), CREATED_DATE : Date, CREATED_BY : String(12)) returns String;
    // Assign OD to a profile
    function assignProfilesOD(FLAG : String(1), LOCATION_ID : String(4), PRODUCT_ID : String(40), COMPONENT : String(40), PROFILE : String(50), STRUC_NODE : String(50))                                                                                  returns String;
   
    function importIBPDemd() returns String;
// Timeseries for job creation
    action generateTimeseries(LOCATION_ID : String(4), PRODUCT_ID : String(40),PAST_DAYS : Integer);
    // Generate Timeseries
    action generateTimeseriesF(LOCATION_ID : String(4), PRODUCT_ID : String(40)) ;

///Partial
    @readonly
    entity genPartialProd           as projection on od.PARTIALPROD_INTRO;

    entity getPartialChar           as projection on V_PARTIALPRODCHAR;

    function maintainPartialProd(FLAG : String(1), LOCATION_ID : String(4), PRODUCT_ID : String(40), REF_PRODID : String(40))                                                                                                                                                        returns String;
    
    function maintainPartialProdChar(FLAG : String(1), PRODCHAR : String ) returns String;
// New product intorduction
    entity genNewProd           as projection on od.NEWPROD_INTRO;
    // Get new product characteristics
    entity getNewProdChar       as projection on V_NEWPRODREFCHAR;

    function maintainNewProd(FLAG : String(1), LOCATION_ID : String(4), PRODUCT_ID : String(40), REF_PRODID : String(40))                                                                                                                                                        returns String;
    function maintainNewProdChar(FLAG : String(1), 
    PRODCHAR : String ) returns String;
   
// Unique ID
    entity getUniqueHeader as projection on od.UNIQUE_ID_HEADER;
    entity getUniqueItem   as projection on V_UNIQUE_ID_ITEM;
    entity getUniqueId as projection on V_UNIQUE_ID;
    function genUniqueID(LOCATION_ID : String(4), PRODUCT_ID : String(40))      returns String;
    function changeUnique(UNIQUE_ID : Integer, LOCATION_ID : String(4), PRODUCT_ID : String(40), UID_TYPE : String(1), UID_RATE : Decimal(13,2),UNIQUE_DESC : String(50), ACTIVE:String(1),FLAG: String) returns String;
    function maintainUniqueChar(FLAG: String(1), UNIQUECHAR: String) returns String;

// Method 2

    entity genvarcharps as projection on od.VARCHAR_PS;
    entity getPriSecChar as projection on V_GETVARCHARPS;
    function getSecondaryChar(FLAG : String(1),LOCATION_ID : String(4), PRODUCT_ID : String(40)) returns array of getPriSecChar;
    function changeToPrimary(LOCATION_ID : String(4), PRODUCT_ID : String(40),CHAR_NUM: String(10),CHAR_TYPE: String(1),SEQUENCE:Integer,FLAG: String(1)) returns String;
// Authorizations
    @odata.draft.enabled
    entity getARObj             as projection on od.USER_AUTHOBJ;
    entity getParameters      as projection on od.PARAMETER_AUTH;
    entity getUsers             as projection on od.USERDETAILS;
    function genVariantStruc(CHAR_NUM: String(10),CHAR_NAME    : String(30)) returns String;
    function userInfo() returns String; // using req.user approach (user attribute - of class cds.User - from the request object)
    function userInfoUAA() returns String; // usi

    // Restrictions
    //Get Restriction header
    @odata.draft.enabled
    entity genRtrHeader         as projection on od.RESTRICT_HEADER;

     //Object dependency restrict
    @odata.draft.enabled
    entity getODHdrRstr         as projection on V_ODRESTRICT;

    @odata.draft.enabled
    entity getProdRestr         as projection on od.PRODRESTRICT;

    @odata.draft.enabled
    entity getProdlocline       as projection on od.PROD_LOC_LINE;

    entity getProdLocRtrLine    as projection on V_LOCPRODLINERTR;
    
    function maintainRestrHdr(LOCATION_ID: String(4), LINE_ID: String(40), RESTRICTION : String(30), RTR_DESC    : String(30), VALID_FROM  : Date , VALID_TO : Date, Flag: String(1)) returns String;
    
    function maintainRestrDet (FLAG : String(1), RTRCHAR : String ) returns String;
    // CIR char rate
    entity getCIRCharRate       as projection on V_CIR_CHAR_RATE;
/// Market Authorizations
    action trigrMAWeek(LOCATION_ID : String(4), PRODUCT_ID : String(40), WEEK_DATE: Date);
// Seed Order Creation
    // @odata.draft.enabled
    entity getSeedOrder    as projection on od.SEEDORDER_HEADER;

    function maintainSeedOrder(FLAG: String(1), SEEDDATA: String) returns String;

    // Planning Configuration
    // BOI - Deepa
    @readonly
    entity Method_Types       as projection on od.METHOD_TYPES;
    entity V_Parameters      as projection on V_PLANNEDCONFIG;
    function postParameterValues(FLAG : String(1), PARAMVALS : String) returns String;
    // EOI - Deepa
}
