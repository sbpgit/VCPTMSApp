const DbConnect = require("./dbConnect");

const dbConnect = new DbConnect();

module.exports = async function() {
    let i;

// Get Sales hist with respect to Date Range    
    let iSalesHistory = await dbConnect.dbQuery( "SELECT * FROM SALESH" );
    for (i = 0; i < iSalesHistory.length; i++)   {   

// Get Sales Order Characteristics
        let iSalesChar = await dbConnect.dbQuery( "SELECT * FROM SALESH_CONFIG WHERE salesDocument = '"
                                                   +iSalesHistory[i].salesDocument
                                                   +"' AND salesDocumentItem = '"
                                                   +iSalesHistory[i].salesDocumentItem
                                                   +"'" );  
        
        

// Get Sales Order Products
    }
    console.log(iSalesHistory);

}