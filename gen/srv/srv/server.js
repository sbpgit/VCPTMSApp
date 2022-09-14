const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
cds.on("bootstrap", app =>{ 
 app.use(proxy()); 
});
// const request = require('request');
// const cfenv = require('cfenv');

// /*********************************************************************
//  *************** Step 1: Read the environment variables ***************
//  *********************************************************************/
// const oServices = cfenv.getAppEnv().getServices();
// const uaa_service = cfenv.getAppEnv().getService('uaa_config_products');
// const dest_service = cfenv.getAppEnv().getService('config_products-mdestination-service');
// const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

// const sDestinationName = 'USERAPI';
// const sEndpoint = '/service/user';

// /*********************************************************************
//  **** Step 2: Request a JWT token to access the destination service ***
//  *********************************************************************/
// const post_options = {
//     url: uaa_service.credentials.url + '/oauth/token',
//     method: 'POST',
//     headers: {
//         'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
//         'Content-type': 'application/x-www-form-urlencoded'
//     },
//     form: {
//         'client_id': dest_service.credentials.clientid,
//         'grant_type': 'client_credentials'
//     }
// }

// request(post_options, (err, res, data) => {
//     if (res.statusCode === 200) {

//         /*************************************************************
//          *** Step 3: Search your destination in the destination service ***
//          *************************************************************/
//         const token = JSON.parse(data).access_token;
//         const get_options = {
//             url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + sDestinationName,
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             }
//         }

//         request(get_options, (err, res, data) => {

//             /*********************************************************
//              ********* Step 4: Access the destination securely *******
//              *********************************************************/
//             const oDestination = JSON.parse(data);
//             const token = oDestination.authTokens[0];

//             const options = {
//                 method: 'GET',
//                 url: oDestination.destinationConfiguration.URL + sEndpoint,
//                 headers: {
//                     'Authorization': `${token.type} ${token.value}`
//                 }
//             };

//             request(options).on('data', (s) => {
//                 console.log(s.toString())
//             });
//         });
//     }
// });
module.exports = cds.server;