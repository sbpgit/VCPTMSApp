const GenFunctions = require("./gen-functions");

const cds = require("@sap/cds");
class cl_generate_timeseries{
constructor() {
}

 async getTimeseries(){
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const genFunctions = new GenFunctions();

/** Define Logger */
const logger = createLogger({
    format: combine(label({ label: "Timeseries" }), timestamp(), prettyPrint()),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: "cat-service-log.log",
        }),
    ],
});

let sObjDepHead = {
    CAL_DATE: Date,
    LOCATION_ID: String(4),
    PRODUCT_ID: String(40),
    OBJ_TYPE: String(2),
    OBJ_DEP: String(15),
    OBJ_COUNTER: String,
    SUCCESS: String,
};

let sObjDepChar = {
    CAL_DATE: Date,
    LOCATION_ID: String(4),
    PRODUCT_ID: String(40),
    OBJ_TYPE: String(2),
    OBJ_DEP: String(15),
    OBJ_COUNTER: String,
    ROW_ID: String,
    SUCCESS: String,
};

let iSalesInfo = [];
let iObjDepHead = [];
let iProdObjDep = [];
let iObjDepChar = [];

/**
 * Main Module
 *
 *  */
//module.exports = async function () {
    logger.info("Started timeseries Service");

    let lsCount = {
        loc: 0,
        locTot: 0,
        ord: 0,
        ordTot: 0,
        salesChar: 0,
        salesCharTot: 0,
    };

    /** Get Location */
    const iLocation = await cds.run(SELECT.from("CP_LOCATION"));
    iLocation.forEach(() => lsCount.locTot++); // Count total Locations

    /** Loop through Location */
    for (const sLocation of iLocation) {
        lsCount.loc++;
        logger.info("Location: " + lsCount.loc + " of " + lsCount.locTot);

        await getSalesInfo(sLocation.LOCATION_ID);

        await processOrders(sLocation.LOCATION_ID);

    }                                    // for (const sLocation of iLocation)
}
    /**
     * Get Sales Information
     * @param {Location} imLocation
     */
    async  getSalesInfo(imLocation) {
        let lLocation = "";
        let lProduct = "";
        let sSalesInfo = [];
        let iObjDep = [];

        /** Get Sales History */
        const iSalesHead = await cds.run(
            SELECT.from("CP_SALESH").where({
                xpr: [{ ref: ["LOCATION_ID"] }, "=", { val: imLocation }],
            })
        );

        lsCount.ordTot = 0;
        iSalesHead.forEach(() => lsCount.ordTot++); // Count total Orders
        logger.info("Total Sales Orders: " + lsCount.ordTot);
        lsCount.ord = 0;

        iSalesHead.sort(
            genFunctions.dynamicSortMultiple("LOCATION_ID", "PRODUCT_ID")
        );

        for (let sSalesHead of iSalesHead) {
            lsCount.ord++;
            logger.info(
                "Order: " +
                sSalesHead.SALES_DOC +
                " Count: " +
                lsCount.ord +
                " of " +
                lsCount.ordTot
            );

            sSalesInfo = {};
            sSalesInfo.LOCATION_ID = JSON.parse(
                JSON.stringify(sSalesHead.LOCATION_ID)
            );
            sSalesInfo.PRODUCT_ID = JSON.parse(JSON.stringify(sSalesHead.PRODUCT_ID));
            sSalesInfo.SALES_DOC = JSON.parse(JSON.stringify(sSalesHead.SALES_DOC));
            sSalesInfo.SALESDOC_ITEM = JSON.parse(
                JSON.stringify(sSalesHead.SALESDOC_ITEM)
            );
            sSalesInfo.calDate = JSON.parse(
                JSON.stringify(genFunctions.getNextSunday(sSalesHead.DOC_CREATEDDATE))
            );

            /** Get Sales Characteristics */
            let iSalesChar = await cds.run(
                SELECT.from("CP_SALESH_CONFIG").where({
                    xpr: [
                        { ref: ["SALES_DOC"] },
                        "=",
                        { val: sSalesHead.SALES_DOC },
                        "AND",
                        { ref: ["SALESDOC_ITEM"] },
                        "=",
                        { val: sSalesHead.SALESDOC_ITEM },
                    ],
                })
            );

            sSalesInfo.salesChar = JSON.parse(JSON.stringify(iSalesChar));

            // Get Object dependency for every change in Product
            if (
                lLocation !== sSalesHead.LOCATION_ID ||
                lProduct !== sSalesHead.PRODUCT_ID
            ) {
                lLocation = sSalesHead.LOCATION_ID;
                lProduct = sSalesHead.PRODUCT_ID;
                sProdObjDep = {};
                sProdObjDep.LOCATION_ID = sSalesHead.LOCATION_ID;
                sProdObjDep.PRODUCT_ID = sSalesHead.PRODUCT_ID;

                /** Get Object Dependency Header from Product */
                iObjDep = await cds.run(
                    SELECT.from("V_OBDHDR").where({
                        xpr: [
                            { ref: ["LOCATION_ID"] },
                            "=",
                            { val: sSalesHead.LOCATION_ID },
                            "AND",
                            { ref: ["PRODUCT_ID"] },
                            "=",
                            { val: sSalesHead.PRODUCT_ID },
                        ],
                    })
                );

                iObjDep.sort(
                    genFunctions.dynamicSortMultiple(
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "OBJ_DEP",
                        "OBJ_COUNTER",
                        "CHAR_NAME",
                        "CHAR_COUNTER",
                        "CHAR_VALUE"
                    )
                );

                let lCounter = 0;
                iObjDep.forEach(() => lCounter++);
                logger.info("Total Obj Dependency" + lCounter);

                sProdObjDep.objDep = JSON.parse(JSON.stringify(iObjDep));

                iProdObjDep.push(JSON.parse(JSON.stringify(sProdObjDep)));
            }

            iSalesInfo.push(JSON.parse(JSON.stringify(sSalesInfo)));
        }
    }

    /**
     *
     *
     */
    async processOrders(imLocation) {
        lsCount.ord = 0;
        let lCalDate = "";

        iSalesInfo.sort(genFunctions.dynamicSortMultiple("calDate"));

        for (let sSalesInfo of iSalesInfo) {
            if (lCalDate !== "" && lCalDate !== sSalesInfo.calDate) {
                logger.info(
                    "Update for Date: " + lCalDate + " Order: " + sSalesInfo.SALES_DOC
                );
                await updateTimeseries(lCalDate, imLocation);
            }
            lCalDate = sSalesInfo.calDate;
            lsCount.ord++;

            await processObjDepHead(sSalesInfo);
            await processObjDepChar(sSalesInfo);
        }

        await updateTimeseries(lCalDate, imLocation);
    }

    /**
     * Generate Timeseries data for Object Dependency
     */
    async  processObjDepHead(sSalesInfo) {

        let lFail = "";
        let lObjFail = "";
        let lSuccess = "";

        for (const sProdObjDep of iProdObjDep) {
            if (
                sProdObjDep.LOCATION_ID === sSalesInfo.LOCATION_ID &&
                sProdObjDep.PRODUCT_ID === sSalesInfo.PRODUCT_ID
            ) {
                let i = 0;
                let j = 0;
                for (const sObjDep of sProdObjDep.objDep) {
                    if (
                        sProdObjDep.objDep[j].OBJ_DEP === sObjDep.OBJ_DEP &&
                        sProdObjDep.objDep[j].OBJ_COUNTER === sObjDep.OBJ_COUNTER &&
                        lObjFail === ""
                    ) {
                        /** IF Failed, check if there is a same characteristic counter  */
                        if (lFail == "X") {
                            if (lCharCounter !== sObjDep.CHAR_COUNTER) {
                                lObjFail = "X";
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
                        for (const sSalesChar of sSalesInfo.salesChar) {
                            if (sSalesChar.CHAR_NAME === sObjDep.CHAR_NAME) {
                                if (
                                    (sObjDep.OD_CONDITION === "EQ" &&
                                        sObjDep.CHAR_VALUE === sSalesChar.CHAR_VALUE) ||
                                    (sObjDep.OD_CONDITION === "NE" &&
                                        sObjDep.CHAR_VALUE !== sSalesChar.CHAR_VALUE)
                                ) {
                                    lSuccess = "X";
                                    break;
                                } else {
                                    lFail = "X";
                                    break;
                                }      // if ((sObjDep.OD_CONDITION === "EQ" &&...
                            }          // if (sSalesChar.CHAR_NAME === sObjDep.CHAR_NAME)...
                        }              // for (const sSalesChar of iSales.salesChar)
                    }                  // if (sObjDep.OBJ_DEP === sObjDepCount.OBJ_DEP &&...

                    j = i;
                    i++;

                    if (sObjDep.CAL_DATE !== sProdObjDep.objDep[i].CAL_DATE ||
                        sObjDep.LOCATION_ID !== sProdObjDep.objDep[i].LOCATION_ID ||
                        sObjDep.PRODUCT_ID !== sProdObjDep.objDep[i].PRODUCT_ID ||
                        sObjDep.OBJ_TYPE !== sProdObjDep.objDep[i].OBJ_TYPE ||
                        sObjDep.OBJ_DEP !== sProdObjDep.objDep[i].OBJ_DEP ||
                        sObjDep.OBJ_COUNTER !== sProdObjDep.objDep[i].OBJ_COUNTER) {
                        if (lFail === "") {
                            sObjDepHead.CAL_DATE = sSalesInfo.calDate;
                            sObjDepHead.LOCATION_ID = sSalesInfo.LOCATION_ID;
                            sObjDepHead.PRODUCT_ID = sSalesInfo.PRODUCT_ID;
                            sObjDepHead.OBJ_TYPE = "OD";
                            sObjDepHead.OBJ_DEP = sObjDep.OBJ_DEP;
                            sObjDepHead.OBJ_COUNTER = sObjDep.OBJ_COUNTER;
                            sObjDepHead.SUCCESS = 1;

                            iObjDepHead.push(JSON.parse(JSON.stringify(sObjDepHead)));
                        }              // if (lFail === "")
                        lFail = "";
                        lSuccess = "";
                        lObjFail = "";
                        j = i;
                    }

                }
            }
        }

    }

    /**
     * Generate timeseries data for Object Dependency Characteristics */
    async processObjDepChar(sSalesInfo) {
        let lCountInsert = 0;

        for (const sSalesChar of sSalesInfo.salesChar) {
            for (const sProdObjDep of iProdObjDep) {
                if (
                    sProdObjDep.LOCATION_ID === sSalesInfo.LOCATION_ID &&
                    sProdObjDep.PRODUCT_ID === sSalesInfo.PRODUCT_ID
                ) {
                    for (const sObjDep of sProdObjDep.objDep) {
                        if (sObjDep.CHAR_NAME === sSalesChar.CHAR_NAME) {
                            if (
                                (sObjDep.OD_CONDITION === "EQ" &&
                                    sObjDep.CHAR_VALUE === sSalesChar.CHAR_VALUE) ||
                                (sObjDep.OD_CONDITION === "NE" &&
                                    sObjDep.CHAR_VALUE !== sSalesChar.CHAR_VALUE)
                            ) {
                                sObjDepChar.CAL_DATE = sSalesInfo.calDate;
                                sObjDepChar.LOCATION_ID = sSalesInfo.LOCATION_ID;
                                sObjDepChar.PRODUCT_ID = sSalesInfo.PRODUCT_ID;
                                sObjDepChar.OBJ_TYPE = "OD";
                                sObjDepChar.OBJ_DEP = sObjDep.OBJ_DEP;
                                sObjDepChar.OBJ_COUNTER = sObjDep.OBJ_COUNTER;
                                sObjDepChar.ROW_ID = sObjDep.ROW_ID;
                                sObjDepChar.SUCCESS = 1;

                                iObjDepChar.push(JSON.parse(JSON.stringify(sObjDepChar)));
                            }          // if ((sObjDep.OD_CONDITION === "EQ" &&...
                        }              // if (sObjDep.CHAR_NAME === sSalesChar.CHAR_NAME)
                    }
                }
            }                          // for (const sObjDep of iSales.objDep)

            iObjDepChar.forEach(() => lCountInsert++);
        }                              // function processObjDepChar(iSales, sSalesHead, sSalesChar)
    }
/**
 * Update Timeseries
 */
    async  updateTimeseries(lDate, lLocation) {

        let lSuccess = 0;

        let iOdCharTemp = [];
        let iOdHeadTemp = [];

        logger.info("Update Date: " + lDate);

        iObjDepHead.sort(
            genFunctions.dynamicSortMultiple(
                "CAL_DATE",
                "LOCATION_ID",
                "PRODUCT_ID",
                "OBJ_TYPE",
                "OBJ_DEP",
                "OBJ_COUNTER"
            )
        );
        let sObjDepHead = [];
        let i = 0;
        lSuccess = 0;
        iOdHeadTemp = [];
        for (sObjDepHead of iObjDepHead) {
            lSuccess = lSuccess + sObjDepHead.SUCCESS;
            i++;
            if (i === iObjDepHead.length) {
                sObjDepHead.SUCCESS = lSuccess;
                iOdHeadTemp.push(JSON.parse(JSON.stringify(sObjDepHead)));
                lSuccess = 0;
                break;
            }
            if (
                iObjDepHead[i].CAL_DATE !== sObjDepHead.CAL_DATE ||
                iObjDepHead[i].LOCATION_ID !== sObjDepHead.LOCATION_ID ||
                iObjDepHead[i].PRODUCT_ID !== sObjDepHead.PRODUCT_ID ||
                iObjDepHead[i].OBJ_TYPE !== sObjDepHead.OBJ_TYPE ||
                iObjDepHead[i].OBJ_DEP !== sObjDepHead.OBJ_DEP ||
                iObjDepHead[i].OBJ_COUNTER !== sObjDepHead.OBJ_COUNTER
            ) {
                sObjDepHead.SUCCESS = lSuccess;
                iOdHeadTemp.push(JSON.parse(JSON.stringify(sObjDepHead)));
                lSuccess = 0;
            }
        }
        iObjDepHead = [];

        lSuccess = 0;
        iObjDepChar.sort(
            genFunctions.dynamicSortMultiple(
                "CAL_DATE",
                "LOCATION_ID",
                "PRODUCT_ID",
                "OBJ_TYPE",
                "OBJ_DEP",
                "OBJ_COUNTER",
                "ROW_ID"
            )
        );

        let sObjDepChar = {};
        let sObjDepCharTemp = {};
        i = 0;
        for (sObjDepChar of iObjDepChar) {
            lSuccess = lSuccess + sObjDepChar.SUCCESS;
            i++;
            if (i === iObjDepChar.length) {
                sObjDepChar.SUCCESS = lSuccess;
                iOdCharTemp.push(JSON.parse(JSON.stringify(sObjDepChar)));
                lSuccess = 0;
                break;
            }
            if (
                iObjDepChar[i].CAL_DATE !== sObjDepChar.CAL_DATE ||
                iObjDepChar[i].LOCATION_ID !== sObjDepChar.LOCATION_ID ||
                iObjDepChar[i].PRODUCT_ID !== sObjDepChar.PRODUCT_ID ||
                iObjDepChar[i].OBJ_TYPE !== sObjDepChar.OBJ_TYPE ||
                iObjDepChar[i].OBJ_DEP !== sObjDepChar.OBJ_DEP ||
                iObjDepChar[i].OBJ_COUNTER !== sObjDepChar.OBJ_COUNTER ||
                iObjDepChar[i].ROW_ID !== sObjDepChar.ROW_ID
            ) {
                sObjDepChar.SUCCESS = lSuccess;
                iOdCharTemp.push(JSON.parse(JSON.stringify(sObjDepChar)));
                lSuccess = 0;
            }


            lSuccess = lSuccess + sObjDepChar.SUCCESS;
        }

        iObjDepChar = [];

        /** Clear existing data */
        await cds.run(
            DELETE.from("CP_TS_OBJDEPHDR").where({
                xpr: [
                    { ref: ["LOCATION_ID"] },
                    "=",
                    { val: lLocation },
                    "AND",
                    { ref: ["CAL_DATE"] },
                    "=",
                    { val: lDate },
                ],
            })
        );
        await cds.run(
            DELETE.from("CP_TS_OBJDEP_CHARHDR").where({
                xpr: [
                    { ref: ["LOCATION_ID"] },
                    "=",
                    { val: lLocation },
                    "AND",
                    { ref: ["CAL_DATE"] },
                    "=",
                    { val: lDate },
                ],
            })
        );

        if (iOdCharTemp) {
            try {
                logger.info("Char Insert Records " + iOdCharTemp.length);
                await cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR").entries(iOdCharTemp));
            } catch (e) {
                logger.error(e.message + "/" + e.query);
            }
        }


        if (iOdHeadTemp) {
            try {
                await cds.run(INSERT.into("CP_TS_OBJDEPHDR").entries(iOdHeadTemp));
            } catch (e) {
                logger.error(e.message + "/" + e.query);
            }
        }

    }

}

module.exports = cl_generate_timeseries;