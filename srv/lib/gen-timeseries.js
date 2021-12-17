const GenFunctions = require("./gen-functions");
const cds = require("@sap/cds");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

class GenTimeseries {
  constructor() {
    /** Define Logger */
    this.logger = createLogger({
      format: combine(
        label({ label: "Timeseries" }),
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: "cat-service-log.log",
        }),
      ],
    });

    this.sObjDepHead = {
      CAL_DATE: Date,
      LOCATION_ID: String(4),
      PRODUCT_ID: String(40),
      OBJ_TYPE: String(2),
      OBJ_DEP: String(15),
      OBJ_COUNTER: String,
      SUCCESS: String,
    };

    this.sObjDepChar = {
      CAL_DATE: Date,
      LOCATION_ID: String(4),
      PRODUCT_ID: String(40),
      OBJ_TYPE: String(2),
      OBJ_DEP: String(15),
      OBJ_COUNTER: String,
      ROW_ID: String,
      SUCCESS: String,
    };

    this.iSalesInfo = [];
    this.iObjDepHead = [];
    this.iProdObjDep = [];
    this.iObjDepChar = [];
  }

  /**
   * Generate Timeseries
   */
  async GenTimeseries() {
    this.logger.info("Started timeseries Service");

    /** Get Location */
    const iLocation = await cds.run(SELECT.from("CP_LOCATION"));

    /** Loop through Location */
    for (let i = 0; i < iLocation.length; i++) {
      this.logger.info(
        "Location: " +
          iLocation[i].LOCATION_ID +
          " | Status: " +
          GenFunctions.addOne(i, iLocation.length) +
          " of " +
          iLocation.length
      );

      await this.getSalesInfo(iLocation[i].LOCATION_ID);

      await this.processOrders(iLocation[i].LOCATION_ID);
    }
  }

  /**
   * Get Sales Information
   * @param {Location} imLocation
   */
  async getSalesInfo(imLocation) {
    let lLocation = "";
    let lProduct = "";
    let lsSalesInfo = [];
    let liObjDep = [];

    /** Get Sales History */
    const liSalesHead = await cds.run(
      SELECT.from("CP_SALESH")
        .where({
          xpr: [{ ref: ["LOCATION_ID"] }, "=", { val: imLocation }],
        })
        .orderBy("LOCATION_ID", "PRODUCT_ID")
    );

    this.logger.info("Total Sales Orders: " + liSalesHead.length);

    for (let i = 0; i < liSalesHead.length; i++) {
      this.logger.info(
        "Order: " +
          liSalesHead[i].SALES_DOC +
          " Status: " +
          GenFunctions.addOne(i) +
          " of " +
          liSalesHead.length
      );

      lsSalesInfo = {};
      lsSalesInfo.SALES_DOC = GenFunctions.parse(liSalesHead[i].SALES_DOC);
      lsSalesInfo.SALESDOC_ITEM = GenFunctions.parse(
        liSalesHead[i].SALESDOC_ITEM
      );
      lsSalesInfo.LOCATION_ID = GenFunctions.parse(liSalesHead[i].LOCATION_ID);
      lsSalesInfo.PRODUCT_ID = GenFunctions.parse(liSalesHead[i].PRODUCT_ID);
      lsSalesInfo.calDate = GenFunctions.parse(
        GenFunctions.getNextSunday(liSalesHead[i].DOC_CREATEDDATE)
      );

      /** Get Sales Characteristics */
      const liSalesChar = await cds.run(
        SELECT.from("CP_SALESH_CONFIG").where({
          xpr: [
            { ref: ["SALES_DOC"] },
            "=",
            { val: liSalesHead[i].SALES_DOC },
            "AND",
            { ref: ["SALESDOC_ITEM"] },
            "=",
            { val: liSalesHead[i].SALESDOC_ITEM },
          ],
        })
      );

      lsSalesInfo.salesChar = GenFunctions.parse(liSalesChar);
      this.iSalesInfo.push(GenFunctions.parse(lsSalesInfo));

      // Get Object dependency for every change in Product
      if (
        lLocation !== liSalesHead[i].LOCATION_ID ||
        lProduct !== liSalesHead[i].PRODUCT_ID
      ) {
        lLocation = liSalesHead[i].LOCATION_ID;
        lProduct = liSalesHead[i].PRODUCT_ID;
        let lsProdObjDep = {};
        lsProdObjDep.LOCATION_ID = liSalesHead[i].LOCATION_ID;
        lsProdObjDep.PRODUCT_ID = liSalesHead[i].PRODUCT_ID;

        /** Get Object Dependency Header from Product */
        liObjDep = await cds.run(
          SELECT.from("V_OBDHDR")
            .where({
              xpr: [
                { ref: ["LOCATION_ID"] },
                "=",
                { val: liSalesHead[i].LOCATION_ID },
                "AND",
                { ref: ["PRODUCT_ID"] },
                "=",
                { val: liSalesHead[i].PRODUCT_ID },
              ],
            })
            .orderBy(
              "LOCATION_ID",
              "PRODUCT_ID",
              "OBJ_DEP",
              "OBJ_COUNTER",
              "CHAR_NUM",
              "CHAR_COUNTER",
              "CHARVAL_NUM"
            )
        );

        this.logger.info(
          "Location " +
            liSalesHead[i].LOCATION_ID +
            " Product: " +
            liSalesHead[i].PRODUCT_ID +
            " Total Obj Dependency" +
            liObjDep.length
        );

        lsProdObjDep.objDep = GenFunctions.parse(liObjDep);

        this.iProdObjDep.push(GenFunctions.parse(lsProdObjDep));
      }
    }
  }

  /**
   * Process Orders
   * @param {Location} imLocation
   */
  async processOrders(imLocation) {
    this.iSalesInfo.sort(GenFunctions.dynamicSortMultiple("calDate"));

    let liDateSalesInfo = [];

    for (let i = 0; i < this.iSalesInfo.length; i++) {
      liDateSalesInfo.push(GenFunctions.parse(this.iSalesInfo[i]));

      if (
        this.iSalesInfo[i].calDate !==
          this.iSalesInfo[GenFunctions.addOne(i, this.iSalesInfo.length)]
            .calDate ||
        GenFunctions.addOne(i) === this.iSalesInfo.length
      ) {
        this.logger.info(
          "Calculation Date: " +
            this.iSalesInfo[i].calDate +
            " No. of Orders: " +
            liDateSalesInfo.length
        );

        await cds.run(
          DELETE.from("CP_TS_ORDERRATE").where({
            xpr: [
                { ref: ["LOCATION_ID"] },
                "=",
                { val: imLocation },
                "AND",
                                
              { ref: ["WEEK_DATE"] },
              "=",
              { val: this.iSalesInfo[i].calDate },
            ],
          })
        );

        cds.run(
          INSERT.into("CP_TS_ORDERRATE")
            .columns("LOCATION_ID", "WEEK_DATE", "ORDER_COUNT")
            .values(imLocation, this.iSalesInfo[i].calDate, liDateSalesInfo.length)
        );

        await cds.run(
          DELETE.from("CP_TS_OBJDEPHDR").where({
            xpr: [
              { ref: ["LOCATION_ID"] },
              "=",
              { val: imLocation },
              "AND",
              { ref: ["CAL_DATE"] },
              "=",
              { val: this.iSalesInfo[i].calDate },
            ],
          })
        );

        await cds.run(
          DELETE.from("CP_TS_OBJDEP_CHARHDR").where({
            xpr: [
              { ref: ["LOCATION_ID"] },
              "=",
              { val: imLocation },
              "AND",
              { ref: ["CAL_DATE"] },
              "=",
              { val: this.iSalesInfo[i].calDate },
            ],
          })
        );

        this.processObjDepHead(liDateSalesInfo);
        this.processObjDepChar(liDateSalesInfo);

        liDateSalesInfo = [];
      }
    }
  }

  /**
   *
   * @param {Location} imLocation
   * @param {Product} imProduct
   */
  getObjDep(imLocation, imProduct) {
    for (const lsProdObjDep of this.iProdObjDep) {
      if (
        lsProdObjDep.LOCATION_ID === imLocation &&
        lsProdObjDep.PRODUCT_ID === imProduct
      ) {
        return lsProdObjDep.objDep;
      }
    }
  }

  /**
   * Process Object Dependency Header
   * @param {Sales Info} imiSalesInfo
   */
  processObjDepHead(imiSalesInfo) {
    let lFail = "";
    let lObjFail = "";
    let lSuccess = "";

    let liObjDepHead = [];
    let lordCount = 0;

    for (let lsSalesInfo of imiSalesInfo) {
      lordCount++;
      this.logger.info(
        "Calculation Date: " +
          lsSalesInfo.calDate +
          " Orders: " +
          lordCount +
          " of " +
          imiSalesInfo.length +
          " | Head"
      );

      let liObjDep = this.getObjDep(
        lsSalesInfo.LOCATION_ID,
        lsSalesInfo.PRODUCT_ID
      );
      for (let i = 0; i < liObjDep.length; i++) {
        if (
          liObjDep[GenFunctions.subOne(i)].OBJ_DEP === liObjDep[i].OBJ_DEP &&
          liObjDep[GenFunctions.subOne(i)].OBJ_COUNTER ===
            liObjDep[i].OBJ_COUNTER &&
          lObjFail === ""
        ) {
          if (lFail == "X") {
            if (
              liObjDep[GenFunctions.subOne(i)].CHAR_COUNTER ===
              liObjDep[i].CHAR_COUNTER
            ) {
              lFail = "";
            } else {
              lObjFail = "X";
            }
          }

          if (lSuccess === "X") {
            if (
              liObjDep[GenFunctions.subOne(i)].CHAR_COUNTER ===
              liObjDep[i].CHAR_COUNTER
            ) {
              continue;
            } else {
              lSuccess = "";
            }
          }

          for (const sSalesChar of lsSalesInfo.salesChar) {
            if (sSalesChar.CHAR_NUM === liObjDep[i].CHAR_NUM) {
              if (
                (liObjDep[i].OD_CONDITION === "EQ" &&
                  liObjDep[i].CHARVAL_NUM === sSalesChar.CHARVAL_NUM) ||
                (liObjDep[i].OD_CONDITION === "NE" &&
                  liObjDep[i].CHARVAL_NUM !== sSalesChar.CHARVAL_NUM)
              ) {
                lSuccess = "X";
                break;
              } else {
                lFail = "X";
                break;
              } // if ((sObjDep.OD_CONDITION === "EQ" &&...
            } // if (sSalesChar.CHAR_NUM === sObjDep.CHAR_NUM)...
          } // for (const sSalesChar of iSales.salesChar)
        }

        if (
          liObjDep[i].OBJ_DEP !==
            liObjDep[GenFunctions.addOne(i, liObjDep.length)].OBJ_DEP ||
          liObjDep[i].OBJ_COUNTER !==
            liObjDep[GenFunctions.addOne(i, liObjDep.length)].OBJ_COUNTER ||
          GenFunctions.addOne(i) === liObjDep.length
        ) {
          this.sObjDepHead.CAL_DATE = lsSalesInfo.calDate;
          this.sObjDepHead.LOCATION_ID = lsSalesInfo.LOCATION_ID;
          this.sObjDepHead.PRODUCT_ID = lsSalesInfo.PRODUCT_ID;
          this.sObjDepHead.OBJ_TYPE = "OD";
          this.sObjDepHead.OBJ_DEP = liObjDep[i].OBJ_DEP;
          this.sObjDepHead.OBJ_COUNTER = liObjDep[i].OBJ_COUNTER;

          if (lFail === "") {
            this.sObjDepHead.SUCCESS = 1;
          } else {
            this.sObjDepHead.SUCCESS = 0;
          } // if (lFail === "")

          liObjDepHead.push(GenFunctions.parse(this.sObjDepHead));
          lFail = "";
          lSuccess = "";
          lObjFail = "";
        }
      }
    }

    let liOdHeadTemp = [];

    liObjDepHead.sort(
      GenFunctions.dynamicSortMultiple(
        "CAL_DATE",
        "LOCATION_ID",
        "PRODUCT_ID",
        "OBJ_TYPE",
        "OBJ_DEP",
        "OBJ_COUNTER"
      )
    );

    let lsObjDepHead = [];
    let i = 0;
    lSuccess = 0;
    liOdHeadTemp = [];

    for (lsObjDepHead of liObjDepHead) {
      lSuccess = lSuccess + lsObjDepHead.SUCCESS;
      i++;
      if (i === liObjDepHead.length) {
        lsObjDepHead.SUCCESS = lSuccess;
        lsObjDepHead.SUCCESS_RATE =
          (lsObjDepHead.SUCCESS / imiSalesInfo.length) * 100;
        liOdHeadTemp.push(GenFunctions.parse(lsObjDepHead));
        lSuccess = 0;
        break;
      }
      if (
        liObjDepHead[i].CAL_DATE !== lsObjDepHead.CAL_DATE ||
        liObjDepHead[i].LOCATION_ID !== lsObjDepHead.LOCATION_ID ||
        liObjDepHead[i].PRODUCT_ID !== lsObjDepHead.PRODUCT_ID ||
        liObjDepHead[i].OBJ_TYPE !== lsObjDepHead.OBJ_TYPE ||
        liObjDepHead[i].OBJ_DEP !== lsObjDepHead.OBJ_DEP ||
        liObjDepHead[i].OBJ_COUNTER !== lsObjDepHead.OBJ_COUNTER
      ) {
        lsObjDepHead.SUCCESS = lSuccess;
        lsObjDepHead.SUCCESS_RATE =
          (lsObjDepHead.SUCCESS / imiSalesInfo.length) * 100;
        liOdHeadTemp.push(GenFunctions.parse(lsObjDepHead));
        lSuccess = 0;
      }
    }
    liObjDepHead = [];

    if (liOdHeadTemp) {
      try {
        cds.run(INSERT.into("CP_TS_OBJDEPHDR").entries(liOdHeadTemp));
      } catch (e) {
        this.logger.error(e.message + "/" + e.query);
      }
    }
  }

  /**
   * Process Object Dependency Characteristics
   * @param {Sales Info} imiSalesInfo
   */
  processObjDepChar(imiSalesInfo) {
    let liObjDepChar = [];
    let liObjDep = [];
    let i = 0;

    console.log(imiSalesInfo);

    imiSalesInfo.sort(
      GenFunctions.dynamicSortMultiple("LOCATION_ID", "PRODUCT_ID")
    );

    for (let lsSalesInfo of imiSalesInfo) {
      this.logger.info(
        "Calculation Date: " +
          lsSalesInfo.calDate +
          " Orders: " +
          GenFunctions.addOne(i) +
          " of " +
          imiSalesInfo.length +
          " | Char"
      );

      if (
        i === 0 ||
        imiSalesInfo[GenFunctions.subOne(i, imiSalesInfo)].LOCATION_ID !==
          lsSalesInfo.LOCATION_ID ||
        imiSalesInfo[GenFunctions.subOne(i, imiSalesInfo)].PRODUCT_ID !==
          lsSalesInfo.PRODUCT_ID
      ) {
        liObjDep = GenFunctions.parse(
          this.getObjDep(lsSalesInfo.LOCATION_ID, lsSalesInfo.PRODUCT_ID)
        );
        liObjDep.sort(
          GenFunctions.dynamicSortMultiple("OBJ_DEP", "OBJ_COUNTER", "ROW_ID")
        );

        for (let i = 0; i < liObjDep.length; i++) {
          if (
            liObjDep[i].OBJ_DEP !==
              liObjDep[GenFunctions.addOne(i, liObjDep.length)].OBJ_DEP ||
            liObjDep[i].OBJ_COUNTER !==
              liObjDep[GenFunctions.addOne(i, liObjDep.length)].OBJ_COUNTER ||
            liObjDep[i].ROW_ID !==
              liObjDep[GenFunctions.addOne(i, liObjDep.length)].ROW_ID ||
            GenFunctions.addOne(i, liObjDep.length) === i
          ) {
            this.sObjDepChar.CAL_DATE = lsSalesInfo.calDate;
            this.sObjDepChar.LOCATION_ID = lsSalesInfo.LOCATION_ID;
            this.sObjDepChar.PRODUCT_ID = lsSalesInfo.PRODUCT_ID;
            this.sObjDepChar.OBJ_TYPE = "OD";
            this.sObjDepChar.OBJ_DEP = liObjDep[i].OBJ_DEP;
            this.sObjDepChar.OBJ_COUNTER = liObjDep[i].OBJ_COUNTER;
            this.sObjDepChar.ROW_ID = liObjDep[i].ROW_ID;
            this.sObjDepChar.SUCCESS = 0;
            liObjDepChar.push(GenFunctions.parse(this.sObjDepChar));
          }
        }
      }
      i++;

      liObjDep.sort(GenFunctions.dynamicSortMultiple("CHAR_NUM"));

      let lFound = "";
      for (const lsSalesChar of lsSalesInfo.salesChar) {
        lFound = "";
        for (let i = 0; i < liObjDep.length; i++) {
          if (liObjDep[i].CHAR_NUM === lsSalesChar.CHAR_NUM) {
            lFound = "X";
            if (
              (liObjDep[i].OD_CONDITION === "EQ" &&
                liObjDep[i].CHARVAL_NUM === lsSalesChar.CHARVAL_NUM) ||
              (liObjDep[i].OD_CONDITION === "NE" &&
                liObjDep[i].CHARVAL_NUM !== lsSalesChar.CHARVAL_NUM)
            ) {
              for (let j = 0; j < liObjDepChar.length; j++) {
                if (
                  liObjDepChar[j].CAL_DATE === lsSalesInfo.calDate &&
                  liObjDepChar[j].LOCATION_ID === lsSalesInfo.LOCATION_ID &&
                  liObjDepChar[j].PRODUCT_ID === lsSalesInfo.PRODUCT_ID &&
                  liObjDepChar[j].OBJ_TYPE === "OD" &&
                  liObjDepChar[j].OBJ_DEP === liObjDep[i].OBJ_DEP &&
                  liObjDepChar[j].OBJ_COUNTER === liObjDep[i].OBJ_COUNTER &&
                  liObjDepChar[j].ROW_ID === liObjDep[i].ROW_ID
                ) {
                  liObjDepChar[j].SUCCESS++;
                  liObjDepChar[j].SUCCESS_RATE =
                    (liObjDepChar[j].SUCCESS / imiSalesInfo.length) * 100;
                }
              }
            }
          } else {
            if (lFound === "X") {
              break;
            }
          }
        }
      }
    }

    if (liObjDepChar) {
      try {
        let lsObjDepChar = {};
        for(lsObjDepChar of liObjDepChar){
            cds.run(INSERT.into("CP_TS_OBJDEP_CHARHDR").entries(lsObjDepChar));
        }
        this.logger.info("Char Insert Records " + liObjDepChar.length);
      } catch (e) {
        this.logger.error(e.message + "/" + e.query);
      }
    }
  }
}

module.exports = GenTimeseries;