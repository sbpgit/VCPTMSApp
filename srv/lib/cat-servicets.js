const DbConnect = require("./dbConnect");
const GenFunctions = require("./gen-functions");

const dbConnect = new DbConnect();
const genFunctions = new GenFunctions();

module.exports = async function () {
  console.log("Started timeseries Service");

  const iSalesHistory = await dbConnect.dbQuery(
    `SELECT * 
                                 FROM SALESH`
  );

  // Get Sales hist with respect to Date Range
  const iSalesChar = await dbConnect.dbQuery(
    `SELECT * 
                               FROM SALESH_CONFIG AS A
                              WHERE EXISTS ( SELECT "salesDocument",
                                                    "salesDocumentItem"
                                               FROM SALESH as B
                                              WHERE A."salesDocument"     = B."salesDocument"
                                                AND A."salesDocumentItem" = B."salesDocumentItem" )`
  );

  // Get unique records for product and location
  let iSalesHProd = await dbConnect.dbQuery(  
    `SELECT DISTINCT "productId", 
                                           "locationID" 
                                      FROM V_SALESH_CONFIG`
  );

  
  // Get BOM
  let iProdBOM = await dbConnect.dbQuery(
    `SELECT *
                          FROM V_BOMOBJ_DEP AS A 
                         WHERE EXISTS ( SELECT DISTINCT "locationID", 
                                                        "productId" 
                                                   FROM V_SALESH_CONFIG AS B 
                                                  WHERE A."locationId" = B."locationID" 
                                                    AND A."productId"  = B."productId" )`
  );

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

  /**
   * Loop thorugh Sales History
   *  */
  iSalesHistory.forEach((sSalesHistory) => {
    sSalesConsolidate.salesDocument = sSalesHistory.salesDocument;
    sSalesConsolidate.salesDocumentItem = sSalesHistory.salesDocumentItem;
    sSalesConsolidate.productId = sSalesHistory.productId;
    sSalesConsolidate.locationId = sSalesHistory.locationID; //
    sSalesConsolidate.calDate = genFunctions.getNextSunday(
      sSalesHistory.documentCreatedOn
    );

    /**
     * Get Sales Characteristic  */
    iSalesCharTemp = [];
    iSalesChar.forEach((sSalesChar) => {
      if (
        sSalesChar.salesDocument == sSalesHistory.salesDocument &&
        sSalesChar.salesDocumentItem == sSalesHistory.salesDocumentItem
      )
        iSalesCharTemp.push(sSalesChar);
    });

    /**
     * Loop through Products
     *  */
    iProdBOM.forEach((sProdBOM) => {
      if (
        sSalesHistory.locationID == sProdBOM.locationId ||
        sSalesHistory.productId == sProdBOM.productId
      ) {
        /**
         * Product Dependency for the Product */
        iObjDep.forEach((sObjDep) => {
          if (sProdBOM.objectDependency == sObjDep.objectDependency) {
            sSalesConsolidate.objectDependency = sObjDep.objectDependency;
            sSalesConsolidate.objCounter = sObjDep.objCounter;
            sSalesConsolidate.characteristicName = sObjDep.characteristicName;
            sSalesConsolidate.success = " ";
            sSalesConsolidate.attributeIndex = sObjDep.attributeIndex;

            /**
             * Verify if Sales Characterstics satisfy the Object Dependency */
            iSalesCharTemp.forEach((sSalesChar) => {
              if (
                (sSalesChar.characteristicName = sObjDep.characteristicName)
              ) {
                if (
                  (sObjDep.condition == "EQ" &&
                    sSalesChar.characteristicValue ==
                      sObjDep.characteristicValue) ||
                  (sObjDep.condition == "NE" &&
                    sSalesChar.characteristicValue !=
                      sObjDep.characteristicValue)
                ) {
                  sSalesConsolidate.success = "X";
                }
              }
            });
            iSalesConsolidate.push(
              JSON.parse(JSON.stringify(sSalesConsolidate))
            );
          }
        });
      }
    });
  });

  iSalesConsolidate.sort(
    genFunctions.dynamicSortMultiple(
      "salesDocument",
      "salesDocumentItem",
      "objectDependency",
      "objCounter",
      "attributeIndex"
    )
  );

  // Generate consodlidated data with SO , OD , success(OD) and attribute
  let lSalesDocument = "";
  let lSalesDocumentItem = "";
  let iTimeseries = [];
  let sTimeseries = {};
  sTimeseries.count = 0;
  iSalesConsolidate.forEach((sSalesConsolidate) => {
    if (
      lSalesDocument != sSalesConsolidate.salesDocument ||
      lSalesDocumentItem != sSalesConsolidate.salesDocumentItem ||
      sTimeseries.locationId != sSalesConsolidate.locationId || // Add location
      sTimeseries.productId != sSalesConsolidate.productId || // Add product
      sTimeseries.objectDependency != sSalesConsolidate.objectDependency ||
      sTimeseries.objCounter != sSalesConsolidate.objCounter
    ) {
      if (lSalesDocument != "" && lSalesDocumentItem != "") {
        if (checkObjDepSuccess(sTimeseries, iObjDep) != "X"){
          sTimeseries.success = "X";
        }
        iTimeseries.push(JSON.parse(JSON.stringify(sTimeseries)));
        sTimeseries = {};
        sTimeseries.count = 0;
      }
    }

    lSalesDocument = sSalesConsolidate.salesDocument;
    lSalesDocumentItem = sSalesConsolidate.salesDocumentItem;
    sTimeseries.calDate = sSalesConsolidate.calDate;
    sTimeseries.objectDependency = sSalesConsolidate.objectDependency;
    sTimeseries.objCounter = sSalesConsolidate.objCounter;

    sTimeseries.locationId = sSalesConsolidate.locationId; // Add location
    sTimeseries.productId = sSalesConsolidate.productId; // Add Product

    sTimeseries.attributeIndex = sSalesConsolidate.attributeIndex;
    if (sSalesConsolidate.success == "X") {
      sTimeseries.count = "X";
    }
  });

  iTimeseries.push(JSON.parse(JSON.stringify(sTimeseries)));

  iTimeseries.sort(
    genFunctions.dynamicSortMultiple(
      "locationId",
      "productId",
      "calDate",
      "objectDependency",
      "objCounter",
      "attributeIndex"
    )
  );

  let iTimeseriesOut = [];
  let sTimeseriesOut = {};
  let lCalDate = "";
  // Populate Timeseries OD header  and OD character header
  iTimeseries.forEach((sTimeseries) => {
    // Timeseries OD header
    if (
      sTimeseriesOut.locationId != sTimeseries.locationId || // Add location id
      sTimeseriesOut.productId != sTimeseries.productId || // Add product id
      sTimeseriesOut.calDate != sTimeseries.calDate ||
      sTimeseriesOut.objectDependency != sTimeseries.objectDependency
    ) {
      if (sTimeseriesOut.calDate) {
        iTimeseriesOut.push(JSON.parse(JSON.stringify(sTimeseriesOut)));
        removeExistingData(sTimeseriesOut.calDate);
      }
      sTimeseriesOut = {};
      sTimeseriesOut.success = 0;
    }

    sTimeseriesOut.calDate = sTimeseries.calDate;
    sTimeseriesOut.objectDependency = sTimeseries.objectDependency;
    sTimeseriesOut.locationId = sTimeseries.locationId; // Add location
    sTimeseriesOut.productId = sTimeseries.productId; // Add Product
    if (sTimeseries.success == "X") {
      sTimeseriesOut.success = sTimeseriesOut.success + 1;
    }
  });

  iTimeseriesOut.push(JSON.parse(JSON.stringify(sTimeseriesOut)));

  removeExistingData(sTimeseriesOut.calDate);
  iTimeseries.sort(
    genFunctions.dynamicSortMultiple(
      "locationId",
      "productId",
      "calDate",
      "objectDependency",
      "attributeIndex"
    )
  );
  let iTimeseriescharOut = [];
  let sTimeseriescharOut = {};
  sTimeseries = {};
  sTimeseriescharOut.rowID = 0;
  sTimeseriescharOut.success = 0;

  // Populate Timeseries OD header  and OD character header
  iTimeseries.forEach((sTimeseries) => {
    // Timeseries OD character header
    if (
      sTimeseriescharOut.locationId != sTimeseries.locationId || // Add location id
      sTimeseriescharOut.productId != sTimeseries.productId || // Add product id
      sTimeseriescharOut.calDate != sTimeseries.calDate ||
      sTimeseriescharOut.objectDependency != sTimeseries.objectDependency 
    ) {
      if (sTimeseriescharOut.calDate) {
        iTimeseriescharOut.push(JSON.parse(JSON.stringify(sTimeseriescharOut)));
        removeExistingData(sTimeseriescharOut.calDate);
      }
      sTimeseriescharOut = {};
      sTimeseriescharOut.rowID = 0;
      sTimeseriescharOut.success = 0;
    }
    sTimeseriescharOut.calDate = sTimeseries.calDate;
    sTimeseriescharOut.objectDependency = sTimeseries.objectDependency;
    sTimeseriescharOut.locationId = sTimeseries.locationId; // Add location
    sTimeseriescharOut.productId = sTimeseries.productId; // Add Product
    sTimeseriescharOut.rowID = sTimeseries.attributeIndex;
      if (sTimeseries.count == "X"){
        sTimeseriescharOut.success = sTimeseriescharOut.success + 1;
      }
  });
  iTimeseriescharOut.push(JSON.parse(JSON.stringify(sTimeseriescharOut)));

  removeExistingData(sTimeseriescharOut.calDate);

  console.log(iTimeseriescharOut);

  console.log(iTimeseriesOut);
  iTimeseriesOut.forEach(async function (sTimeseries) {
    await dbConnect.dbQuery(
      `INSERT INTO "TS_OBJDEPHDR" VALUES( '` +
        sTimeseries.calDate +
        `','` +
        sTimeseries.locationId +
        `','` +
        sTimeseries.productId +
        `','` +
        "OD" +
        `','` +
        sTimeseries.objectDependency +
        `','` +
        sTimeseries.success +
        `')`
    );
  });
  sTimeseries = {};
  iTimeseriescharOut.forEach(async function (sTimeseries) {
    await dbConnect.dbQuery(
      `UPSERT "TS_OBJDEP_CHARHDR" VALUES( '` +
        sTimeseries.calDate +
        `','` +
        sTimeseries.locationId +
        `','` +
        sTimeseries.productId +
        `','` +
        "OD" +
        `','` +
        sTimeseries.objectDependency +
        `','` +
        sTimeseries.rowID +
        `','` +
        sTimeseries.success +
        `')`
    );
  });
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
      sTimeseries.objCounter == sObjDep.objCounter &&
      sTimeseries.attributeIndex  == sObjDep.attributeIndex 
    ) {
      lCheckCharCounter = "";

      if (sTimeseries.count != "X") {
        lCheckCharCounter = "X";
      }
      if (lCheckCharCounter === "X") {
        if (
          checkCharCounter(
            iObjDep,
            sTimeseries,
            sObjDep.objectDependency,
            sObjDep.objCounter,
            sObjDep.charCounter,
            sObjDep.attributeIndex
          ) != "X"
        )
          lFailure = "X";
      }
    }
  });
  return lFailure;
}
/**
 *
 * @param {*} iObjDep
 * @param {*} sTimeseries
 * @param {*} imObjDepen
 * @param {*} imObjCounter
 * @param {*} imCharCounter
 */
function checkCharCounter(
  iObjDep,
  sTimeseries,
  imObjDepen,
  imObjCounter,
  imCharCounter,
  imAttrIndex
) {
  let lSuccess = "";
  iObjDep.forEach((sObjDepTemp) => {
    if (
      sObjDepTemp.objectDependency == imObjDepen &&
      sObjDepTemp.objCounter == imObjCounter &&
      sObjDepTemp.charCounter == imCharCounter &&
      sObjDepTemp.attributeIndex == imAttrIndex
    ) {
      if (sTimeseries.count == "X") {
        lSuccess = "X";
      }
    }
  });
  return lSuccess;
}

/**
 *
 * @param {*} lDate
 */
async function removeExistingData(lDate) {
  await dbConnect.dbQuery(
    `DELETE FROM "TIMESERIES" WHERE "calDate" = '` + lDate + `'`
  );
}
