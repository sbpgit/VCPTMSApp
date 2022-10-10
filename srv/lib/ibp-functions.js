const GenF = require("./gen-functions");
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");

class IBPFunctions {
    constructor() { }
    async exportSalesCfg(req){
        var oReq = {
            sales: [],
        },
            vsales;
        const lisales = await cds.run(
            `
                SELECT  "WEEK_DATE",
                        "LOCATION_ID",
                        "PRODUCT_ID",
                        "ORD_QTY",
                        "CUSTOMER_GROUP",
                        "CLASS_NUM",
                        "CHAR_NUM",
                        "CHARVAL_NUM"
                        FROM V_IBP_SALESHCONFIG_VC
                        WHERE LOCATION_ID = '`+ req.data.LOCATION_ID + `'
                           AND PRODUCT_ID = '`+ req.data.PRODUCT_ID +
            `'`);
        // `' AND CUSTOMER_GROUP = '` + req.data.CUSTOMER_GROUP +e

        for (i = 0; i < lisales.length; i++) {
            var vWeekDate = new Date(lisales[i].WEEK_DATE).toISOString().split('Z');
            var vDemd = lisales[i].ORD_QTY.split('.');
            vsales = {
                "LOCID": lisales[i].LOCATION_ID,
                "PRDID": lisales[i].PRODUCT_ID,
                "VCCHAR": lisales[i].CHAR_NUM,
                "VCCHARVALUE": lisales[i].CHARVAL_NUM,
                "VCCLASS": lisales[i].CLASS_NUM,
                "ACTUALDEMANDVC": vDemd[0],
                "CUSTID": "NULL",//lisales[i].CUSTOMER_GROUP,
                "PERIODID0_TSTAMP": vWeekDate[0]
            };
            oReq.sales.push(vsales);

        }
        return oReq;
    }
}

module.exports = IBPFunctions;