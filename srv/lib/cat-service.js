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
   let sSalesConsolidate = [];
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

                     iSalesCharTemp.forEach(sSalesChar => {
                         if(sSalesChar.characteristicName = sObjDep.characteristicName){

                             if ((sObjDep.condition == 'EQ' 
                              && sSalesChar.characteristicValue == sProdBOM.characteristicValue) 
                              || (sObjDep.condition == 'NE' 
                              && sSalesChar.characteristicValue != sProdBOM.characteristicValue)){

                                sSalesConsolidate.success            = 'X';

                              }

                         }
                     })
                     iSalesConsolidate.push(sSalesConsolidate);

                 }
             })
           }
       })



   });

//      iSalesConsolidate.sort(genFunctions.dynamicSortMultiple("salesDocument")) ;
      iSalesConsolidate.forEach(sSalesConsolidate => {
          if (sSalesConsolidate.success == 'X') console.log(sSalesConsolidate);
          //console.log(sSalesConsolidate);
      })
     //console.log(iSalesConsolidate);   
     
     //console.log(iSalesConsolidate.length);   

  // Calculate Timeseries Data
//  let iTimeSeries = calculateTimeseries(iSalesHistory, iObjDep);
};
function calculateTimeseries(iSalesHistory, iObjDep) {
  let i,j,count = 0, flag;
    let aSOCharCount = [];
        for(i = 0; i< iObjDep.length; i++){
            for(j = 0; j< iSalesHistory.length; j++){
                if(iObjDep[i].characteristicName == iSalesHistory[j].characteristicName){
                    if(iObjDep[i].condition == 'EQ'){
                        if(iObjDep[i].characteristicValue == iSalesHistory[j].characteristicValue)
                        {
                            flag = 'X';
                            count++;
                        }  
                    }  
                }              
            }        
            if (flag  === 'X'){
            aSOCharCount.push({ "characteristicName": iObjDep[i].characteristicName,
                                "characteristicValue":iObjDep[i].characteristicValue,
                                "count": count});
            flag = '';
            count = 0;
            }
        }
}
// ofilterCond = iSalesHProd[i].locationID+","+iSalesHProd[i].productId;
// osqlStmt = 'SELECT * FROM BOMHEADER WHERE "locationId" = ? AND "productId" = ?';
// let iProdBOM = await dbConnect.dbQueryClause("SELECT * FROM BOMHEADER WHERE locationId = ? AND productId = ?", filterCond);
// console.log(iSalesHistory);
