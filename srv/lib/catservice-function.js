
class Catservicefn {

    /**
     * Generate Unique ID
     * @param {Data} adata
     * @param {Flag} lFlag 
     */
    //Change Active status
    async maintainUniqueHeader(lFlag, adata) {
        let liresults = [];
        let lsresults = {};
        var responseMessage;
        let vFlag;
        const li_uniquedata = await cds.run(
            `SELECT *
            FROM "CP_UNIQUE_ID_HEADER"
            WHERE "LOCATION_ID" = '` +
            adata.LOCATION_ID +
            `' ORDER BY UNIQUE_ID DESC`
        );
        if (lFlag === 'E') {// Active status change
            lsresults.LOCATION_ID = adata.LOCATION_ID;
            lsresults.PRODUCT_ID = adata.PRODUCT_ID;
            lsresults.UNIQUE_ID = parseInt(adata.UNIQUE_ID);
            lsresults.UNIQUE_DESC = adata.UNIQUE_DESC;//li_unique[0].UNIQUE_DESC;
            lsresults.UID_TYPE = 'U';//li_unique[0].UID_TYPE;
            if (adata.ACTIVE === 'X') {
                lsresults.ACTIVE = Boolean(false);
            }
            else {
                lsresults.ACTIVE = Boolean(true);
            }
            liresults.push(lsresults);
            try {
                await UPDATE`CP_UNIQUE_ID_HEADER`
                    .with({
                        UNIQUE_DESC: lsresults.UNIQUE_DESC
                    })
                    .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                            AND PRODUCT_ID = '${lsresults.LOCATION_ID}'
                            AND UNIQUE_ID = '${lsresults.UNIQUE_ID}'`);
                vFlag = 'X';
            } catch (e) {
                vFlag = '';
                //DONOTHING
            }
        }
        else if (lFlag === 'C' || lFlag === 'N') {
            console.log(adata);
            lsresults.LOCATION_ID = adata.LOCATION_ID;
            lsresults.PRODUCT_ID = adata.PRODUCT_ID;
            if (li_uniquedata.length > 0) {
                lsresults.UNIQUE_ID = parseInt(li_uniquedata[0].UNIQUE_ID) + 1;
            }
            else {
                lsresults.UNIQUE_ID = parseInt("01");
            }
            lsresults.UNIQUE_DESC = adata.UNIQUE_DESC;
            lsresults.UID_TYPE = 'U';
            lsresults.ACTIVE = Boolean(true);
            liresults.push(lsresults);

            console.log(lsresults);

            if (liresults.length > 0) {
                try {
                    await cds.run(INSERT.into("CP_UNIQUE_ID_HEADER").entries(liresults));
                    vFlag = lsresults.UNIQUE_ID;
                } catch (e) {
                    vFlag = '';
                }
            }
        }
        return vFlag;
    }
    async getAllProducts(adata) {
        let lsprod = {};
        let liprod = [];

        const lipartialprod = await cds.run(
            `
         SELECT PRODUCT_ID,
                LOCATION_ID,
                PROD_DESC,
                REF_PRODID
           FROM "CP_PARTIALPROD_INTRO"
           WHERE LOCATION_ID = '`+ adata.LOCATION_ID + `'
           ORDER BY REF_PRODID`);

        for (let iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
            lsprod.LOCATION_ID = lipartialprod[iPartial].LOCATION_ID;
            lsprod.PRODUCT_ID = lipartialprod[iPartial].PRODUCT_ID;
            lsprod.PROD_DESC = lipartialprod[iPartial].PROD_DESC;
            liprod.push(lsprod);
            lsprod = {};
        }
        return liprod;
    }
    /**
     * 
     * @param {Flag} lFlagAll 
     */
    async deleteSalesHistory(lFlagAll) {
        // Fetch History weeks
        const liValue = await SELECT.one
            .from("CP_PARAMETER_VALUES")
            .columns("VALUE")
            .where(`PARAMETER_ID = 4`);

        // Get Date from which history data needs to be deleted
        let vFromDate = new Date();
        vFromDate = vFromDate.setDate(vFromDate.getDate() - (parseInt(liValue) * 7));

        const liSalesDataAll = await cds.run(
            `SELECT *
             FROM CP_SALESH
             ORDER BY A.SALES_DOC,
                     A.SALESDOC_ITEM`);
        // Filter data belwo the histry horizon
        let result = liSalesDataAll.reduce((r, o) => {
            r[o.MAT_AVAILDATE < '${vFromDate}' ? 'liSalesData' : 'liSalesDataTemp'].push(o);
            return r;
        }, { liSalesData: [], liSalesDataTemp: [] });

        if (lFlagAll === 'X') {
            // Delete history data before history horizon
            for (let iIndexA = 0; iIndexA < liSalesDataAll.length; iIndexA ++) {
                // sales history config tables
                try {
                    await cds.run(
                        `DELETE FROM CP_SALES_HM
             WHERE SALES_DOC   = '` + liSalesDataAll[iIndexA].SALES_DOC + `'
                 AND SALESDOC_ITEM    = '` + liSalesDataAll[iIndexA].SALESDOC_ITEM + `'`
                    );
                }
                catch (e) {
                    console.log(" Unable to delete from SalesHM")
                }

                // sales history config tables
                try {
                    await cds.run(
                        `DELETE FROM CP_SALESH_CONFIG
                 WHERE SALES_DOC   = '` + liSalesDataAll[iIndexA].SALES_DOC + `'
                     AND SALESDOC_ITEM    = '` + liSalesDataAll[iIndexA].SALESDOC_ITEM + `'`
                    );
                }
                catch (e) {
                    console.log(" Unable to delete from Sales config")
                }
            }

            // Sales History
            try {
                await cds.run(
                    `DELETE FROM CP_SALESH`
                );
            }
            catch (e) {
                console.log(" Unable to delete from Sales History")
            }
        }
        // Delete history horizon
        else {
            // Delete history data before history horizon
            for (let iIndex = 0; iIndex < liSalesData.length; iIndex++) {
                // sales history config tables
                try {
                    await cds.run(
                        `DELETE FROM CP_SALES_HM
             WHERE SALES_DOC   = '` + liSalesData[iIndex].SALES_DOC + `'
                 AND SALESDOC_ITEM    = '` + liSalesData[iIndex].SALESDOC_ITEM + `'`
                    );
                }
                catch (e) {
                    console.log(" Unable to delete from SalesHM")
                }

                // sales history config tables
                try {
                    await cds.run(
                        `DELETE FROM CP_SALESH_CONFIG
                 WHERE SALES_DOC   = '` + liSalesData[iIndex].SALES_DOC + `'
                     AND SALESDOC_ITEM    = '` + liSalesData[iIndex].SALESDOC_ITEM + `'`
                    );
                }
                catch (e) {
                    console.log(" Unable to delete from Sales config")
                }
            }

            // Sales History
            try {
                await cds.run(
                    `DELETE FROM CP_SALESH
                                 WHERE MAT_AVAILDATE   < '` + vFromDate + `'`
                );
            }
            catch (e) {
                console.log(" Unable to delete from Sales History")
            }

        }
    }
}
module.exports = Catservicefn;