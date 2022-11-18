
class Catservicefn{
    
/**
 * Generate Unique ID
 * @param {Data} adata
 * @param {Flag} lFlag 
 */   
    //Change Active status
async maintainUniqueHeader(lFlag,adata) {
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
            await UPDATE `CP_UNIQUE_ID_HEADER`
                .with({
                    UNIQUE_DESC: lsresults.UNIQUE_DESC
                })
                .where(`LOCATION_ID = '${lsresults.LOCATION_ID}'
                        AND PRODUCT_ID = '${lsresults.LOCATION_ID}'
                        AND UNIQUE_ID = '${lsresults.UNIQUE_ID}'`);
                        vFlag= 'X';
        } catch (e) {
            vFlag= '';
            //DONOTHING
        }
    }
    else if (lFlag === 'C' || lFlag === 'N') {
        console.log(adata);
        lsresults.LOCATION_ID = adata.LOCATION_ID;
        lsresults.PRODUCT_ID = adata.PRODUCT_ID;
        if(li_uniquedata.length > 0){
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
async getAllProducts(adata){
    let  lsprod = {};
    let liprod = [];
    // const limasterprod = await cds.run(
    //     `
    //  SELECT DISTINCT PRODUCT_ID,
    //         LOCATION_ID,
    //         PROD_DESC
    //    FROM "V_LOCPROD"
    //    WHERE LOCATION_ID = '`+ adata.LOCATION_ID + `'`);

    const lipartialprod = await cds.run(
        `
     SELECT PRODUCT_ID,
            LOCATION_ID,
            PROD_DESC,
            REF_PRODID
       FROM "CP_PARTIALPROD_INTRO"
       WHERE LOCATION_ID = '`+ adata.LOCATION_ID + `'
       ORDER BY REF_PRODID`);


    //const li_Transid = servicePost.tx(req).get("/GetTransactionID");
    // for (let i = 0; i < limasterprod.length; i++) {
    //     lsprod = {};
    //     lsprod.LOCATION_ID = limasterprod[i].LOCATION_ID;
    //     lsprod.PRODUCT_ID = limasterprod[i].PRODUCT_ID;
    //     lsprod.PROD_DESC = limasterprod[i].PROD_DESC;
    //     // vDesc = limasterprod[i].PROD_DESC;
    //     liprod.push(lsprod);
    //     lsprod = {};
        for (let iPartial = 0; iPartial < lipartialprod.length; iPartial++) {
            // if (lipartialprod[iPartial].REF_PRODID === limasterprod[i].PRODUCT_ID) {
                lsprod.LOCATION_ID = lipartialprod[iPartial].LOCATION_ID;
                lsprod.PRODUCT_ID = lipartialprod[iPartial].PRODUCT_ID;
                lsprod.PROD_DESC = lipartialprod[iPartial].PROD_DESC;
                liprod.push(lsprod);
                lsprod = {};
            // }
        }
    // }
    return liprod;
}
}
module.exports = Catservicefn;