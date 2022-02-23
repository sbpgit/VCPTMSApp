const DbConnect = require("./dbConnect");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const GenFunctions = require("./gen-functions");
class ComponentReq {
  constructor() {
    //this.genCompoenentReq();
  }
  /*
   *
   */
  async genComponentReq(adata, iresult) {
    let liCompQty = [];
    let lsCompQty = {};
    let liprodpred = [];
    let lsprodpred = {};
    let lVariRatio = 1;
    // const
    const liStrucQty = await cds.run(
      `SELECT *
           FROM "V_PRODQTYSN"
           WHERE "LOCATION_ID" = '` +
        adata.LOCATION_ID +
        `'
           AND "PRODUCT_ID" = '` +
        adata.PRODUCT_ID +
        `' AND "VERSION" = '` +
        adata.VERSION +
        `' AND "SCENARIO" = '` +
        adata.SCENARIO +
        `'
           ORDER BY 
                "LOCATION_ID" ASC, 
                "PRODUCT_ID" ASC,
                "VERSION" ASC,
                "SCENARIO" ASC,
                "CAL_DATE" ASC,
                "STRUC_NODE" ASC`
    );
    const liBomoddemd = await cds.run(
      `SELECT A."ORD_QTY",
      A."LOCATION_ID",
      A."PRODUCT_ID",
      A."ITEM_NUM",
      A."COMPONENT",
      A."COMP_QTY",
      A."VERSION",
      A."SCENARIO",
      A."CAL_DATE",
      B."STRUC_NODE"
        FROM "V_BOMIBPDEMD" AS A
        INNER JOIN CP_PVS_BOM AS B
        ON A.LOCATION_ID = B.LOCATION_ID
        AND A.PRODUCT_ID = B.PRODUCT_ID
        AND A.ITEM_NUM = B.ITEM_NUM
        AND A.COMPONENT = B.COMPONENT
        WHERE A.LOCATION_ID = '` +
        adata.LOCATION_ID +
        `' AND A."PRODUCT_ID" = '` +
        adata.PRODUCT_ID +
        `'
           ORDER BY
           A."LOCATION_ID" ASC, 
           A."PRODUCT_ID" ASC,
           A."VERSION" ASC,
           A."SCENARIO" ASC,
           A."CAL_DATE" ASC,
           B."STRUC_NODE" ASC`
    );
    for (let i = 0; i < liStrucQty.length; i++) {
      lVariRatio = 1;
      if (liStrucQty[i].STRUC_QTY < liStrucQty[i].LOWERLIMIT) {
        lVariRatio = liStrucQty[i].LOWERLIMIT / liStrucQty[i].STRUC_QTY;
      }
      if (liStrucQty[i].STRUC_QTY > liStrucQty[i].UPPERLIMIT) {
        lVariRatio = liStrucQty[i].UPPERLIMIT / liStrucQty[i].STRUC_QTY;
      }
      // if (lVariRatio !== 1) {
      for (let j = 0; j < liBomoddemd.length; j++) {
        if (
          liStrucQty[i].LOCATION_ID === liBomoddemd[j].LOCATION_ID &&
          liStrucQty[i].PRODUCT_ID === liBomoddemd[j].PRODUCT_ID &&
          liStrucQty[i].VERSION === liBomoddemd[j].VERSION &&
          liStrucQty[i].SCENARIO === liBomoddemd[j].SCENARIO &&
          liStrucQty[i].CAL_DATE === liBomoddemd[j].CAL_DATE &&
          liStrucQty[i].STRUC_NODE === liBomoddemd[j].STRUC_NODE
        ) {
          lsCompQty = {};
          lsCompQty.LOCATION_ID = liBomoddemd[j].LOCATION_ID;
          lsCompQty.PRODUCT_ID = liBomoddemd[j].PRODUCT_ID;
          lsCompQty.VERSION = liBomoddemd[j].VERSION;
          lsCompQty.SCENARIO = liBomoddemd[j].SCENARIO;
          lsCompQty.ITEM_NUM = liBomoddemd[j].ITEM_NUM;
          lsCompQty.COMPONENT = liBomoddemd[j].COMPONENT;
          lsCompQty.CAL_DATE = liBomoddemd[j].CAL_DATE;
          lsCompQty.STRUC_NODE = liBomoddemd[j].STRUC_NODE;
          lsCompQty.CAL_COMP_QTY =
            liBomoddemd[j].ORD_QTY * liBomoddemd[j].COMP_QTY;
          lsCompQty.COMP_QTY = Math.ceil(
            liBomoddemd[j].ORD_QTY * lVariRatio * liBomoddemd[j].COMP_QTY
          );
          liCompQty.push(GenFunctions.parse(lsCompQty));
          await cds.run(
            DELETE.from("CP_COMPQTYDETERMINE").where({
              xpr: [
                { ref: ["LOCATION_ID"] },
                "=",
                { val: liBomoddemd[j].LOCATION_ID },
                "AND",
                { ref: ["PRODUCT_ID"] },
                "=",
                { val: liBomoddemd[j].PRODUCT_ID },
                "AND",
                { ref: ["VERSION"] },
                "=",
                { val: liBomoddemd[j].VERSION },
                "AND",
                { ref: ["SCENARIO"] },
                "=",
                { val: liBomoddemd[j].SCENARIO },
                "AND",
                { ref: ["ITEM_NUM"] },
                "=",
                { val: liBomoddemd[j].ITEM_NUM },
                "AND",
                { ref: ["COMPONENT"] },
                "=",
                { val: liBomoddemd[j].COMPONENT },
                "AND",
                { ref: ["CAL_DATE"] },
                "=",
                { val: liBomoddemd[j].CAL_DATE },
              ],
            })
          );
        }
      }
      // }
    }
    if (liCompQty.length > 0) {
      try {
        await cds.run(INSERT.into("CP_COMPQTYDETERMINE").entries(liCompQty));
        iresult = "Component requirements generated successfully";
      } catch (error) {
        iresult = "Failed to generate Component requirements";
      }
    } else {
      iresult = "No data fetched";
    }
  }
  async genCompReqWeekly(adata, iresult) {
//     let DateFrom = '2022-03-04';
//     let DateTo = '2023-01-03';
//     let liCompWeekly = [];
//     let lsCompWeekly = {};
//       const liCompQty = await cds.run(`
//       SELECT * FROM "CP_COMPQTYDETERMINE"
//       WHERE "LOCATION_ID" = '` +
//         adata.LOCATION_ID +
//         `'
//            AND "PRODUCT_ID" = '` +
//         adata.PRODUCT_ID +
//         `' AND "VERSION" = '` +
//         adata.VERSION +
//         `' AND "SCENARIO" = '` +
//         adata.SCENARIO +
//         `' AND ( "CAL_DATE" <= DateTo
//             AND "CAL_DATE" >= DateFrom )
//            ORDER BY 
//                 "LOCATION_ID" ASC, 
//                 "PRODUCT_ID" ASC,
//                 "VERSION" ASC,
//                 "SCENARIO" ASC,
//                 "ITEM_NUM" ASC,
//                 "COMPONENT" ASC,
//                 "CAL_DATE" ASC,
//                 "STRUC_NODE" ASC`);
//     const liDates = await cds.run(`
//     SELECT DISTINCT CAL_DATE FROM "CP_COMPQTYDETERMINE"
//     WHERE ( "CAL_DATE" <= DateTo
//             AND "CAL_DATE" >= DateFrom )
//             ORDER BY 
//                 "LOCATION_ID" ASC, 
//                 "PRODUCT_ID" ASC,
//                 "VERSION" ASC,
//                 "SCENARIO" ASC,
//                 "ITEM_NUM" ASC,
//                 "COMPONENT" ASC,
//                 "CAL_DATE" ASC,
//                 "STRUC_NODE" ASC`);
//      for (let i=1; i<= liDates.length; i++){
         
//         lsCompWeekly.LOCATION_ID = "LOC";
//         lsCompWeekly.PRODUCT_ID = "PROD";
//         lsCompWeekly.VERSION = "VER";
//         lsCompWeekly.SCENARIO = "SCENR";
//         lsCompWeekly.ITEM_NUM = "ITEM";
//         lsCompWeekly.COMPONENT = "COMP";
//         let columnname = "Week"+i;
//         lsCompWeekly."columnname" = 
//      }
//      for( let i = 0 ; i < liCompQty.length ; i++){
//         lsCompWeekly.LOCATION_ID = liCompQty[i].LOCATION_ID;
//         lsCompWeekly.PRODUCT_ID = liCompQty[i].PRODUCT_ID;
//         lsCompWeekly.VERSION = liCompQty[i].VERSION;
//         lsCompWeekly.SCENARIO = liCompQty[i].SCENARIO;
//         lsCompWeekly.ITEM_NUM = liCompQty[i].ITEM_NUM;
//         lsCompWeekly.COMPONENT = liCompQty[i].COMPONENT;
//         if (liCompQty[i].LOCATION_ID !== liCompQty[GenFunctions.addOne(i, liCompQty.length)].LOCATION_ID ||
//             liCompQty[i].PRODUCT_ID  !== liCompQty[GenFunctions.addOne(i, liCompQty.length)].PRODUCT_ID ||
//             liCompQty[i].VERSION  !== liCompQty[GenFunctions.addOne(i, liCompQty.length)].VERSION ||
//             liCompQty[i].SCENARIO  !== liCompQty[GenFunctions.addOne(i, liCompQty.length)].SCENARIO ||  
//         i === GenFunctions.addOne(i, liCompQty.length)
//    ) {  
        
//         let columnname =  "Week"  
//         lsCompWeekly.CAL_DATE = liCompQty[i].CAL_DATE;
//    }
//      }
  }
}
module.exports = ComponentReq;
