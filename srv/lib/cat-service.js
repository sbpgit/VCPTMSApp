const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");

const dbConnect = new DbConnect();
const genFunctions = new GenFunctions();

module.exports = async function () {
  console.log("Started timeseries Service");

  const iLocation = await dbConnect.dbQuery(
    `SELECT *
       FROM "LOCATION"`
  );
 
  /** Loop through Location */
  iLocation.forEach(async function (sLocation) {
    await clearExistingData(sLocation.LOCATION_ID);

    /** Get Sales History */
    const iSalesHead = await dbConnect.dbQuery(
      `SELECT *
         FROM SALESH
        WHERE LOCATION_ID = '` + sLocation.LOCATION_ID + `'`
    );

    /** Process through Sales Histor */
    for (const sSalesHead of iSalesHead) {
      lCalDate = genFunctions.getNextSunday(sSalesHead.DOC_CREATEDDATE);

      /** Get Sales Characteristics and Product Object Dependency */
      const iSales = await getSalesData(sSalesHead);

      iSales.objDep.sort(
        genFunctions.dynamicSortMultiple(
          "OBJ_DEP",
          "OBJ_COUNTER",
          "CHAR_NAME",
          "CHAR_COUNTER",
          "CHAR_VALUE"
        )
      );

      /** Update Object Dependency Characteristic timeseries Table */
      for (const sSalesChar of iSales.salesChar) {
        await processObjDepChar(iSales, sSalesHead, sSalesChar);
      }                                // for (const sSalesChar of iSales.salesChar)

      /** Update Object Dependency timeseries Table */
      await processObjDepHead(iSales, sSalesHead);
    }                                  // for (const sSalesHead of iSalesHead)
  });                                  // iLocation.forEach
};                                     // function ()

/**
 * Clear existing records with respect to Location
 */
async function clearExistingData(lLocation) {
  await dbConnect.dbQuery(
    `DELETE FROM "TS_OBJDEPHDR" WHERE "LOCATION_ID" = '` + lLocation + `'`
  );
  await dbConnect.dbQuery(
    `DELETE FROM "TS_OBJDEP_CHARHDR" WHERE "LOCATION_ID" = '` + lLocation + `'`
  );
}                                      // function clearExistingData(lLocation)

/**
 * Get Sales Head
 * @param {Sales Head} sSalesHead 
 */
async function getSalesData(sSalesHead) {

    /** Get Sales Characteristics */
  const iSalesChar = await dbConnect.dbQuery(
    `SELECT * 
       FROM SALESH_CONFIG
      WHERE SALES_DOC     = '` + sSalesHead.SALES_DOC + `' 
        AND SALESDOC_ITEM = '` + sSalesHead.SALESDOC_ITEM + `'`
  );
    /** Get Object Dependency Header from Product */
  const iObjDep = await dbConnect.dbQuery(
    `SELECT A.* 
       FROM OBJDEP_HEADER     AS A
       JOIN BOM_OBJDEPENDENCY AS B
         ON A.OBJ_DEP = B.OBJ_DEP
      WHERE B.LOCATION_ID = '` + sSalesHead.LOCATION_ID + `' 
        AND B.PRODUCT_ID  = '` + sSalesHead.PRODUCT_ID + `'`
  );

  let iSales = [];
  iSales.salesChar = iSalesChar;
  iSales.objDep = iObjDep;
  return iSales;
}                                      // function getSalesData(sSalesHead)

/** 
 * Generate timeseries data for Object Dependency Characteristics */
async function processObjDepChar(iSales, sSalesHead, sSalesChar) {
  for (const sObjDep of iSales.objDep) {


       /** Check if Characteristic is already present */
      const liSuccess = await dbConnect.dbQuery(
          `SELECT SUCCESS + 1 as SUCCESS
              FROM "TS_OBJDEP_CHARHDR"
          WHERE CAL_DATE    = '` + lCalDate + `'
              AND LOCATION_ID = '` + sSalesHead.LOCATION_ID + `'
              AND PRODUCT_ID  = '` + sSalesHead.PRODUCT_ID + `'
              AND OBJ_TYPE    = 'OD'
              AND OBJ_DEP     = '` + sObjDep.OBJ_DEP + `'
              AND OBJ_COUNTER = '` + sObjDep.OBJ_COUNTER + `'
              AND ROW_ID      = '` + sObjDep.ROW_ID + `'`
      );

       /** If there is no record, insert record with zero success */
      if (!liSuccess[0]) {
        await dbConnect.dbQuery(
          `UPSERT "TS_OBJDEP_CHARHDR" VALUES('` + lCalDate + `','` +
                                                  sSalesHead.LOCATION_ID + `','` +
                                                  sSalesHead.PRODUCT_ID + `','OD','` +
                                                  sObjDep.OBJ_DEP +  `','` +
                                                  sObjDep.OBJ_COUNTER +  `','` +
                                                  sObjDep.ROW_ID +  `', 0) WITH PRIMARY KEY`
        );
      }                                // if (!liSuccess[0])



    if (sObjDep.CHAR_NAME === sSalesChar.CHAR_NAME) {

      if (
        (sObjDep.OD_CONDITION === "EQ" &&
          sObjDep.CHAR_VALUE === sSalesChar.CHAR_VALUE) ||
        (sObjDep.OD_CONDITION === "NE" &&
          sObjDep.CHAR_VALUE !== sSalesChar.CHAR_VALUE)
      ) {

        
       /** Check if Characteristic is already present */
      const liSuccess = await dbConnect.dbQuery(
          `SELECT SUCCESS + 1 as SUCCESS
              FROM "TS_OBJDEP_CHARHDR"
          WHERE CAL_DATE    = '` + lCalDate + `'
              AND LOCATION_ID = '` + sSalesHead.LOCATION_ID + `'
              AND PRODUCT_ID  = '` + sSalesHead.PRODUCT_ID + `'
              AND OBJ_TYPE    = 'OD'
              AND OBJ_DEP     = '` + sObjDep.OBJ_DEP + `'
              AND OBJ_COUNTER = '` + sObjDep.OBJ_COUNTER + `'
              AND ROW_ID      = '` + sObjDep.ROW_ID + `'`
      );

      let lSuccessCount = 0;
       /** If there is no record, insert record with zero success */
      if (!liSuccess[0]) {
          lSuccessCount = 1
      } else {
          lSuccessCount = liSuccess[0].SUCCESS;
      }                                // if (!liSuccess[0])

/** If the Characteristic is success, update the counter */          
        await dbConnect.dbQuery(
          `UPSERT "TS_OBJDEP_CHARHDR" VALUES('` + lCalDate + `','` +
                                                  sSalesHead.LOCATION_ID + `','` +
                                                  sSalesHead.PRODUCT_ID + `','OD','` +
                                                  sObjDep.OBJ_DEP +  `','` +
                                                  sObjDep.OBJ_COUNTER +  `','` +
                                                  sObjDep.ROW_ID +  `',` +
                                                  lSuccessCount + `) WITH PRIMARY KEY`
        );
      }                                // if ((sObjDep.OD_CONDITION === "EQ" &&...
    }                                  // if (sObjDep.CHAR_NAME === sSalesChar.CHAR_NAME)
  }                                    // for (const sObjDep of iSales.objDep)
}                                      // function processObjDepChar(iSales, sSalesHead, sSalesChar)

/**
 * Generate Timeseries data for Object Dependency
 * @param {Salesh Info} iSales 
 * @param {Sales Head} sSalesHead 
 */
async function processObjDepHead(iSales, sSalesHead){
      let lObjDep = "";
      let lObjCounter = 0;
      let iObjDepHead = [];
      let iObjDepCount = [];
      
/** Get Unique Object Dependencies and Object Dependency Counters */      
      for (const sObjDep of iSales.objDep) {
        if (lObjDep !== sObjDep.OBJ_DEP || lObjCounter != sObjDep.OBJ_COUNTER) {
          iObjDepCount.push(JSON.parse(JSON.stringify(sObjDep)));
        }                              // if (lObjDep !== sObjDep.OBJ_DEP || lObjCounter != sObjDep.OBJ_COUNTER)

        lObjDep = sObjDep.OBJ_DEP;
        lObjCounter = sObjDep.OBJ_COUNTER;
      }                                // for (const sObjDep of iSales.objDep)

        /** Process through Object Dependency Counter */
        for (const sObjDepCount of iObjDepCount) {
            let lFail = "";
            let lSuccess = "";

            lObjCounter = sObjDepCount.OBJ_COUNTER;
            let lCharCounter = 0;

            /** Process through Object Dependency Counter Characteristics*/
            for (const sObjDep of iSales.objDep) {
              if (
                sObjDep.OBJ_DEP === sObjDepCount.OBJ_DEP &&
                sObjDep.OBJ_COUNTER === sObjDepCount.OBJ_COUNTER
              ) {
                  /** IF Failed, check if there is a same characteristic counter  */
                if (lFail == "X") {
                  if (lCharCounter !== sObjDep.CHAR_COUNTER) {
                    break;
                  } else {
                    lFail = "";
                  }
                }
                /** If Success, no need to check same characteristic counter */
                if (lSuccess === "X") {
                  if (lCharCounter === sObjDep.CHAR_COUNTER) {
                    continue;
                  } else {
                    lSuccess = "";
                  }
                }
                lCharCounter = sObjDep.CHAR_COUNTER;
                /** Check if the characteristic value is maintained for Sales Order */
                for (const sSalesChar of iSales.salesChar) {
                  if (sSalesChar.CHAR_NAME === sObjDep.CHAR_NAME) {
                    if (
                      (sObjDep.OD_CONDITION === "EQ" &&
                        sObjDep.CHAR_VALUE == sSalesChar.CHAR_VALUE) ||
                      (sObjDep.OD_CONDITION === "NE" &&
                        sObjDep.CHAR_VALUE !== sSalesChar.CHAR_VALUE)
                    ) {
                      lSuccess = "X";
                      break;
                    } else {
                      lFail = "X";
                      break;
                    }                  // if ((sObjDep.OD_CONDITION === "EQ" &&...
                  }                    // if (sSalesChar.CHAR_NAME === sObjDep.CHAR_NAME)...
                }                      // for (const sSalesChar of iSales.salesChar)
              }                        // if (sObjDep.OBJ_DEP === sObjDepCount.OBJ_DEP &&...
            }                          // for (const sObjDep of iSales.objDep)

        /** Update Object Dependency Head timeseries  */
        if (lFail === "") {
          const liSuccess = await dbConnect.dbQuery(
            `SELECT SUCCESS + 1 as SUCCESS
               FROM "TS_OBJDEPHDR"
              WHERE CAL_DATE    = '` + lCalDate + `'
                AND LOCATION_ID = '` + sSalesHead.LOCATION_ID + `'
                AND PRODUCT_ID  = '` + sSalesHead.PRODUCT_ID + `'
                AND OBJ_TYPE    = 'OD'
                AND OBJ_DEP     = '` + sObjDepCount.OBJ_DEP + `'
                AND OBJ_COUNTER = '` + sObjDepCount.OBJ_COUNTER + `'`
          );

            if (!liSuccess[0]) {
                lSuccessCount = 1
            } else {
                lSuccessCount = liSuccess[0].SUCCESS;
            }                                // if (!liSuccess[0])

          await dbConnect.dbQuery(
            `UPSERT "TS_OBJDEPHDR" VALUES('` + lCalDate + `','` 
                                             + sSalesHead.LOCATION_ID + `','` 
                                             + sSalesHead.PRODUCT_ID + `','OD','` 
                                             + sObjDepCount.OBJ_DEP + `','` 
                                             + sObjDepCount.OBJ_COUNTER + `',` 
                                             + lSuccessCount + `) WITH PRIMARY KEY`
          );
        }                              // if (lFail === "") {
      }                                // for (const sObjDepCount of iObjDepCount)            



}
