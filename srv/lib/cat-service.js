const DbConnect = require("./dbConnect");

const dbConnect = new DbConnect();

module.exports = async function() {
    
    let iSalesHistory = await dbConnect.dbQuery( "SELECT * FROM DB_CONFIG_PROD_SBPDEV.SALESH" );

    console.log(iSalesHistory);



}