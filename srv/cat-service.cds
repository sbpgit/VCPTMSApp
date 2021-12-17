using cp as od from '../db/data-model';
using V_CLASSCHAR from '../db/data-model';
using V_CHARVAL from '../db/data-model';
/*using V_TIMESERIES from '../db/data-model';
using V_PRODUCT from '../db/data-model';
using V_LOCATION from '../db/data-model';
using V_CUSTOMERGROUP from '../db/data-model';
using V_PRODCONFIG from '../db/data-model';
using V_SALESH from '../db/data-model';
using V_LOCPROD from '../db/data-model';
using V_SALESH_CONFIG from '../db/data-model';
using V_BOMHEADER from '../db/data-model';
using V_BOMOD from '../db/data-model';
using V_PIRCH from '../db/data-model';
using V_PRODATTR from '../db/data-model';
using V_ODHDR from '../db/data-model';
using V_ODCHARHDR from '../db/data-model';*/

service CatalogService @(impl : './lib/cat-service.js') {
    //@readonly entity odTimeSeries as projection on my.odTimeSeries;
    // Service on HDI entities
    @odata.draft.enabled
    entity getProducts   as projection on od.PRODUCT;

    @odata.draft.enabled
    entity getLocation   as projection on od.LOCATION;

    @odata.draft.enabled
    entity getCustgroup  as projection on od.CUSTOMERGROUP;

    @odata.draft.enabled
    entity getProdConfig as projection on od.PROD_CONFIG;

    @readonly
    entity getSalesh     as projection on od.SALESH;

    @odata.draft.enabled
    entity getLocProd    as projection on od.LOCATION_PRODUCT;

    @readonly
    entity getSalesCfg   as projection on od.SALESH_CONFIG;

    @odata.draft.enabled
    entity getBomHeader  as projection on od.BOMHEADER;

    @odata.draft.enabled
    entity getBomOD      as projection on od.BOM_OBJDEPENDENCY;

    @readonly
    entity getPirch      as projection on od.PIR_CH;

    @readonly
    entity getProdAttr   as projection on od.PROD_ATTRIBUTES;

    @readonly
    entity getODHdr      as projection on od.TS_OBJDEPHDR;
    
    /*type rangedate{
        DATE_LOW  :Date;
        DATE_HIGH   : Date;
    };
    action get_timesereies ( tsrange : rangedate );*/
    
    @readonly
    entity getODCharHdr  as projection on od.TS_OBJDEP_CHARHDR
    entity getCharval   as projection on V_CHARVAL;
  //  @readonly
    //entity getclasschar as projection on V_CLASSCHAR;

   // @odata.draft.enabled
   // entity ACCESS_NODES as projection on od.ACCESS_NODES;
    
    @odata.draft.enabled
    entity getAccessNodes as projection on od.ACCESS_NODES;
    /*type rangedate{
        LOCATION_ID : String(4) ;
        DATE_LOW  :Date;
        DATE_HIGH   : Date;
    };
    type nodeDetails{
        PNODES: String(50);
        CNODE: String(50);
        NODE_DESC: String(200);
    };*/
    
    function fGetNodeDet ( NODE_TYPE : String(2), CHILD_NODE: String(50), PARENT_NODE: String(50)) returns array of getAccessNodes;
   //// actions {
        function generate_timeseries( LOCATION_ID : String(4) ) returns String 
    //};
   /* action generate_timeseries( LOCATION_ID : String(4) ,
                                DATE_LOW    :Date,
                                DATE_HIGH   : Date );*/

}

// Services on Schema tables
/* @readonly
  entity getProducts
      as projection on V_PRODUCT;
  @readonly
  entity getLocation
      as projection on V_LOCATION;
  @readonly
  entity getCustgroup
      as projection on V_CUSTOMERGROUP;
  @readonly
  entity getProdConfig
      as projection on V_PRODCONFIG;
  @readonly
  entity getSalesh
      as projection on V_SALESH;
  @readonly
  entity getLocProd
      as projection on V_LOCPROD;
  @readonly
  entity getSalesCfg
      as projection on V_SALESH_CONFIG;
  @readonly
  entity getBomHeader
      as projection on V_BOMHEADER;
  @readonly
  entity getBomOD
      as projection on V_BOMOD;
  @readonly
  entity getPirch
      as projection on V_PIRCH;
  @readonly
  entity getProdAttr
      as projection on V_PRODATTR;
  @readonly
  entity getODHdr
      as projection on V_ODHDR;
  @readonly
  entity getODCharHdr
      as projection on V_ODCHARHDR;*/
/* @readonly
  entity Timeseries
      as projection on V_TIMESERIES;*/

