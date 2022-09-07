
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
        `'
        AND "PRODUCT_ID" = '` +
        adata.PRODUCT_ID +
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
}
module.exports = Catservicefn;