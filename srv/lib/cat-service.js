const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");

const dbConnect = new DbConnect();
const genFunctions = new GenFunctions();

module.exports = async function () {
  console.log("Started timeseries Service");

  const iSalesHistory = await dbConnect.dbQuery(
                              `SELECT * 
                                 FROM SALESH`);

  // Get Sales hist with respect to Date Range
  const iSalesChar = await dbConnect.dbQuery(
                            `SELECT * 
                               FROM SALESH_CONFIG AS A
                              WHERE EXISTS ( SELECT "salesDocument",
                                                    "salesDocumentItem"
                                               FROM SALESH as B
                                              WHERE A."salesDocument"     = B."salesDocument"
                                                AND A."salesDocumentItem" = B."salesDocumentItem" )`);



  // Get unique records for product and location
  let iSalesHProd = await dbConnect.dbQuery(
                          `SELECT DISTINCT "productId", 
                                           "locationID" 
                                      FROM V_SALESH_CONFIG`);

  // Get BOM
  let iProdBOM = await dbConnect.dbQuery(
                       `SELECT *
                          FROM V_BOMOBJ_DEP AS A 
                         WHERE EXISTS ( SELECT DISTINCT "locationID", 
                                                        "productId" 
                                                   FROM V_SALESH_CONFIG AS B 
                                                  WHERE A."locationId" = B."locationID" 
                                                    AND A."productId"  = B."productId" )`);
  
  // Get obj dependency
  let iObjDep = await dbConnect.dbQuery(
                      `SELECT * 
                         FROM OBJDEP_HEADER 
                        WHERE "objectDependency" IN ( SELECT DISTINCT "objectDependency" 
                                                        FROM V_BOMOBJ_DEP AS A 
                                                       WHERE EXISTS ( SELECT DISTINCT "locationID", 
                                                                                      "productId" 
                                                                                 FROM V_SALESH_CONFIG AS B 
                                                                                WHERE A."locationId" = B."locationID" 
                                                                                  AND A."productId"  = B."productId" ) )`
 );

   let iSalesCharTemp = [];
   let iSalesConsolidate = [];
   let sSalesConsolidate = {};
   iSalesHistory.forEach(sSalesHistory => {


        sSalesConsolidate.salesDocument     = sSalesHistory.salesDocument;
        sSalesConsolidate.salesDocumentItem = sSalesHistory.salesDocumentItem;
        sSalesConsolidate.productId         = sSalesHistory.productId;
        sSalesConsolidate.calDate           = genFunctions.getNextSunday(sSalesHistory.documentCreatedOn);

       iSalesCharTemp = [];
       iSalesChar.forEach(sSalesChar => {
           if (sSalesChar.salesDocument == sSalesHistory.salesDocument 
            && sSalesChar.salesDocumentItem == sSalesHistory.salesDocumentItem ) 
                iSalesCharTemp.push(sSalesChar);

       })

       iProdBOM.forEach(sProdBOM => {
           if (sSalesHistory.productId == sProdBOM.productId){

             iObjDep.forEach(sObjDep => {
                 if(sProdBOM.objectDependency == sObjDep.objectDependency){

                    sSalesConsolidate.objectDependency   = sObjDep.objectDependency;
                    sSalesConsolidate.objCounter         = sObjDep.objCounter;
                    sSalesConsolidate.characteristicName = sObjDep.characteristicName;
                    sSalesConsolidate.success            = ' ';
                    sSalesConsolidate.attributeIndex     = sObjDep.attributeIndex;

                     iSalesCharTemp.forEach(sSalesChar => {
                         if(sSalesChar.characteristicName = sObjDep.characteristicName){
                             if ((sObjDep.condition == 'EQ' 
                              && sSalesChar.characteristicValue == sObjDep.characteristicValue) 
                              || (sObjDep.condition == 'NE' 
                              && sSalesChar.characteristicValue != sObjDep.characteristicValue)){

                                sSalesConsolidate.success            = 'X';

                              }

                         }
                     })
                     iSalesConsolidate.push(JSON.parse(JSON.stringify(sSalesConsolidate)));
                     

                 }
             })
           }
       })



   });

   iSalesConsolidate.sort(genFunctions.dynamicSortMultiple("salesDocument", 
                                                           "salesDocumentItem", 
                                                           "objectDependency", 
                                                           "objCounter",
                                                           "attributeIndex")) ;
   let lSalesDocument = '';
   let lSalesDocumentItem = '';
   let iTimeseries = [];
   let sTimeseries = {};
   iSalesConsolidate.forEach((sSalesConsolidate) => {
     if (
       lSalesDocument               != sSalesConsolidate.salesDocument      ||
       lSalesDocumentItem           != sSalesConsolidate.salesDocumentItem  ||
       sTimeseries.objectDependency != sSalesConsolidate.objectDependency   ||
       sTimeseries.objCounter       != sSalesConsolidate.objCounter
     ) {
       if(lSalesDocument != '' && lSalesDocumentItem != ''){
         // Check if Object Dependency is success      
          if (checkObjDepSuccess(sTimeseries, iObjDep) != 'X') sTimeseries.success = 'X';
          iTimeseries.push(JSON.parse(JSON.stringify(sTimeseries)));
          sTimeseries = {};
       }
     }
       lSalesDocument               = sSalesConsolidate.salesDocument;
       lSalesDocumentItem           = sSalesConsolidate.salesDocumentItem;
       sTimeseries.calDate          = sSalesConsolidate.calDate;
       sTimeseries.objectDependency = sSalesConsolidate.objectDependency;
       sTimeseries.objCounter       = sSalesConsolidate.objCounter;
       if (sSalesConsolidate.success == "X") {
         switch (sSalesConsolidate.attributeIndex) {
           case 1:
             sTimeseries.attr1 = "X";
             break;
           case 2:
             sTimeseries.attr2 = "X";
             break;
           case 3:
             sTimeseries.attr3 = "X";
             break;
           case 4:
             sTimeseries.attr4 = "X";
             break;
           case 5:
             sTimeseries.attr5 = "X";
             break;
           case 6:
             sTimeseries.attr6 = "X";
             break;
           case 7:
             sTimeseries.attr7 = "X";
             break;
           case 8:
             sTimeseries.attr8 = "X";
             break;
           case 9:
             sTimeseries.attr9 = "X";
             break;
           case 10:
             sTimeseries.attr10 = "X";
             break;
           case 11:
             sTimeseries.attr11 = "X";
             break;
           case 12:
             sTimeseries.attr12 = "X";
             break;
         
       }
     }
   });

   iTimeseries.push(JSON.parse(JSON.stringify(sTimeseries)));

   iTimeseries.sort(genFunctions.dynamicSortMultiple(   "calDate", 
                                                        "objectDependency", 
                                                        "objCounter")) ;


    let iTimeseriesOut = [];
    let sTimeseriesOut = {};
    let lCalDate = "";
    iTimeseries.forEach((sTimeseries) => {
      if (
        sTimeseriesOut.calDate != sTimeseries.calDate ||
        sTimeseriesOut.objectDependency != sTimeseries.objectDependency
      ) {
        if (sTimeseriesOut.calDate) {
          iTimeseriesOut.push(JSON.parse(JSON.stringify(sTimeseriesOut)));
          removeExistingData(sTimeseriesOut.calDate);
        }
        sTimeseriesOut = {};

        sTimeseriesOut.success = 0;
        sTimeseriesOut.attr1 = 0;
        sTimeseriesOut.attr2 = 0;
        sTimeseriesOut.attr3 = 0;
        sTimeseriesOut.attr4 = 0;
        sTimeseriesOut.attr5 = 0;
        sTimeseriesOut.attr6 = 0;
        sTimeseriesOut.attr7 = 0;
        sTimeseriesOut.attr8 = 0;
        sTimeseriesOut.attr9 = 0;
        sTimeseriesOut.attr10 = 0;
        sTimeseriesOut.attr11 = 0;
        sTimeseriesOut.attr12 = 0;
      }

      sTimeseriesOut.calDate = sTimeseries.calDate;
      sTimeseriesOut.objectDependency = sTimeseries.objectDependency;

      if (sTimeseries.success == "X")
        sTimeseriesOut.success = sTimeseriesOut.success + 1;
      if (sTimeseries.attr1 == "X")
        sTimeseriesOut.attr1 = sTimeseriesOut.attr1 + 1;
      if (sTimeseries.attr2 == "X")
        sTimeseriesOut.attr2 = sTimeseriesOut.attr2 + 1;
      if (sTimeseries.attr3 == "X")
        sTimeseriesOut.attr3 = sTimeseriesOut.attr3 + 1;
      if (sTimeseries.attr4 == "X")
        sTimeseriesOut.attr4 = sTimeseriesOut.attr4 + 1;
      if (sTimeseries.attr5 == "X")
        sTimeseriesOut.attr5 = sTimeseriesOut.attr5 + 1;
      if (sTimeseries.attr6 == "X")
        sTimeseriesOut.attr6 = sTimeseriesOut.attr6 + 1;
      if (sTimeseries.attr7 == "X")
        sTimeseriesOut.attr7 = sTimeseriesOut.attr7 + 1;
      if (sTimeseries.attr8 == "X")
        sTimeseriesOut.attr8 = sTimeseriesOut.attr8 + 1;
      if (sTimeseries.attr9 == "X")
        sTimeseriesOut.attr9 = sTimeseriesOut.attr9 + 1;
      if (sTimeseries.attr10 == "X")
        sTimeseriesOut.attr10 = sTimeseriesOut.attr10 + 1;
      if (sTimeseries.attr11 == "X")
        sTimeseriesOut.attr11 = sTimeseriesOut.attr11 + 1;
      if (sTimeseries.attr12 == "X")
        sTimeseriesOut.attr12 = sTimeseriesOut.attr12 + 1;
    });
    
    iTimeseriesOut.push(JSON.parse(JSON.stringify(sTimeseriesOut)));

    removeExistingData(sTimeseriesOut.calDate);

    iTimeseriesOut.forEach(async function (sTimeseries) {

        await dbConnect.dbQuery(
            `INSERT INTO "TIMESERIES" VALUES( '`+
                        sTimeseries.calDate + `','` +
                        sTimeseries.objectDependency + `','0','` +
                        sTimeseries.success + `','` +
                        sTimeseries.attr1 + `','` +
                        sTimeseries.attr2 + `','` +
                        sTimeseries.attr3 + `','` +
                        sTimeseries.attr4 + `','` +
                        sTimeseries.attr5 + `','` +
                        sTimeseries.attr6 + `','` +
                        sTimeseries.attr7 + `','` +
                        sTimeseries.attr8 + `','` +
                        sTimeseries.attr9 + `','` +
                        sTimeseries.attr10 + `','` +
                        sTimeseries.attr11 + `','` +
                        sTimeseries.attr12  + `')`
        );
        
    })


};
/**
 * Check if Object Dependency is success or not
 */
function checkObjDepSuccess(sTimeseries, iObjDep) {
  let lFailure = "";
  let lCheckCharCounter = "";
  iObjDep.forEach((sObjDep) => {
    if (
      sTimeseries.objectDependency == sObjDep.objectDependency &&
      sTimeseries.objCounter == sObjDep.objCounter
    ) {
      lCheckCharCounter = "";
      switch (sObjDep.attributeIndex) {
        case 1:
          if (sTimeseries.attr1 != "X") lCheckCharCounter = "X";
          break;
        case 2:
          if (sTimeseries.attr2 != "X") lCheckCharCounter = "X";
          break;
        case 3:
          if (sTimeseries.attr3 != "X") lCheckCharCounter = "X";
          break;
        case 4:
          if (sTimeseries.attr4 != "X") lCheckCharCounter = "X";
          break;
        case 5:
          if (sTimeseries.attr5 != "X") lCheckCharCounter = "X";
          break;
        case 6:
          if (sTimeseries.attr6 != "X") lCheckCharCounter = "X";
          break;
        case 7:
          if (sTimeseries.attr7 != "X") lCheckCharCounter = "X";
          break;
        case 8:
          if (sTimeseries.attr8 != "X") lCheckCharCounter = "X";
          break;
        case 9:
          if (sTimeseries.attr9 != "X") lCheckCharCounter = "X";
          break;
        case 10:
          if (sTimeseries.attr10 != "X") lCheckCharCounter = "X";
          break;
        case 11:
          if (sTimeseries.attr11 != "X") lCheckCharCounter = "X";
          break;
        case 12:
          if (sTimeseries.attr12 != "X") lCheckCharCounter = "X";
          break;
      }
      if (lCheckCharCounter === "X") {
        if (
          checkCharCounter(
            iObjDep,
            sTimeseries,
            sObjDep.objectDependency,
            sObjDep.objCounter,
            sObjDep.charCounter
          ) != "X"
        )
          lFailure = "X";
      }
    }
  });
}
/**
 * 
 * @param {*} iObjDep 
 * @param {*} sTimeseries 
 * @param {*} imObjDepen 
 * @param {*} imObjCounter 
 * @param {*} imCharCounter 
 */
function checkCharCounter(iObjDep, sTimeseries, imObjDepen, imObjCounter, imCharCounter){
    let lSuccess = '';
    iObjDep.forEach((sObjDepTemp) => {
        if (
          sObjDepTemp.objectDependency == imObjDepen &&
          sObjDepTemp.objCounter == imObjCounter &&
          sObjDepTemp.charCounter == imCharCounter
        ) {
          switch (sObjDepTemp.attributeIndex) {
            case 1:
              if (sTimeseries.attr1 == "X") lSuccess = "X";
              break;
            case 2:
              if (sTimeseries.attr2 == "X") lSuccess = "X";
              break;
            case 3:
              if (sTimeseries.attr3 == "X") lSuccess = "X";
              break;
            case 4:
              if (sTimeseries.attr4 == "X") lSuccess = "X";
              break;
            case 5:
              if (sTimeseries.attr5 == "X") lSuccess = "X";
              break;
            case 6:
              if (sTimeseries.attr6 == "X") lSuccess = "X";
              break;
            case 7:
              if (sTimeseries.attr7 == "X") lSuccess = "X";
              break;
            case 8:
              if (sTimeseries.attr8 == "X") lSuccess = "X";
              break;
            case 9:
              if (sTimeseries.attr9 == "X") lSuccess = "X";
              break;
            case 10:
              if (sTimeseries.attr10 == "X") lSuccess = "X";
              break;
            case 11:
              if (sTimeseries.attr11 == "X") lSuccess = "X";
              break;
            case 12:
              if (sTimeseries.attr12 == "X") lSuccess = "X";
              break;
          }
        }
    });
return lSuccess;
}

/**
 * 
 * @param {*} lDate 
 */
async function removeExistingData(lDate){
    
        await dbConnect.dbQuery(`DELETE FROM "TIMESERIES" WHERE "calDate" = '` + lDate + `'`);

}