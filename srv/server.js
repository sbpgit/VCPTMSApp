const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
cds.on("bootstrap", app =>{ 
 app.use(proxy())
});
// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv')
// }
module.exports = cds.server;