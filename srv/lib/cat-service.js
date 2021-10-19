const DbConnect = require("./dbConnect");

const dbConnect = new DbConnect();

module.exports = async function() {
    let ofilterCond, osqlStmt, sLoc, sProd ;

// Get Sales hist with respect to Date Range    
    let iSalesHistory = await dbConnect.dbQuery( "SELECT * FROM V_SALESH_CONFIG" );

// Get unique records for product and location  
    osqlStmt = 'SELECT DISTINCT "productId", "locationID" FROM V_SALESH_CONFIG';
    let iSalesHProd = await dbConnect.dbQuery(osqlStmt);

// Get BOM
    osqlStmt = 'SELECT * FROM V_BOMOBJ_DEP AS A WHERE EXISTS ( SELECT DISTINCT "locationID", "productId" FROM V_SALESH_CONFIG AS B WHERE A."locationId" = B."locationID" AND A."productId" = B."productId" )';
    let iProdBOM = await dbConnect.dbQuery(osqlStmt);//,ofilterCond);
    console.log(iProdBOM);
// Get obj dependency
    osqlStmt = 'SELECT DISTINCT "objectDependency" FROM V_BOMOBJ_DEP AS A WHERE EXISTS ( SELECT DISTINCT "locationID", "productId" FROM V_SALESH_CONFIG AS B WHERE A."locationId" = B."locationID" AND A."productId" = B."productId" )';
   
    let osqlStmt2 = 'SELECT * FROM OBJDEP_HEADER WHERE "objectDependency" IN ( '+osqlStmt+' )';
    //(SELECT DISTINCT "objectDependency" FROM V_BOMOBJ_DEP)'
    let iObjDep = await dbConnect.dbQuery(osqlStmt2);
    let iTimeSeries = calculateTimeseries(iSalesHistory, iObjDep);
}
function calculateTimeseries(iSalesHistory, iObjDep){
    let i,j,count = 0, flag;
    let aSOCharCount=[];
        for(i = 0; i< iObjDep.length; i++){
            for(j = 0; j< iSalesHistory.length; j++){
                if(iObjDep[i].characteristicName == iSalesHistory[j].characteristicName
                    && iObjDep[i].characteristicValue == iSalesHistory[j].characteristicValue)
                 {
                    flag = 'X';
                    count++;
                 }   
        }
        if (flag  === 'X'){
            aSOCharCount[i].characteristicName = iObjDep[i].characteristicName;
            aSOCharCount[i].characteristicValue = iObjDep[i].characteristicValue;            
            aSOCharCount[i].count = count;
            flag = '';
            count = 0;
        }
    }
    console.log(aSOCharCount);
    return "success";
}
   // ofilterCond = iSalesHProd[i].locationID+","+iSalesHProd[i].productId;
   // osqlStmt = 'SELECT * FROM BOMHEADER WHERE "locationId" = ? AND "productId" = ?';
   // let iProdBOM = await dbConnect.dbQueryClause("SELECT * FROM BOMHEADER WHERE locationId = ? AND productId = ?", filterCond);
   // console.log(iSalesHistory);

