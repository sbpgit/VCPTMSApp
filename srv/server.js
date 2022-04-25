const cds = require("@sap/cds");
const cors = require("cors");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
cds.on("bootstrap", app =>{ 
 app.use(cors())
 app.use(proxy())
});
// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv')
// }
module.exports = cds.server;