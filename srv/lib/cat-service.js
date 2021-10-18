const DbConnect = require("./dbConnect");

const dbConnect = new DbConnect();

module.exports = async function() {
    let result;

    result = await dbConnect.dbQuery( "SELECT * FROM SBPTECHTEAM.SBPCICS_SALESH" );

    console.log(result);

}