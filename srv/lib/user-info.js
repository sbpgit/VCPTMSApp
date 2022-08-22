
const cds = require("@sap/cds");
const hana = require("@sap/hana-client");
module.exports = cds.service.impl(async function () {
    const api = 'xsuaa_api';

    // Get the XSUAA host URL from service binding
    const xsuaa_bind = JSON.parse(process.env.VCAP_SERVICES).xsuaa[0];
    const api_def = cds.env.requires[api];
    api_def.credentials.url = xsuaa_bind.credentials.url;

    // connect to the XSUAA host
    const xsuaa = await cds.connect.to(api_def);

    // using req.user approach (user attribute - of class cds.User - from the request object)
    this.on('userInfo', req => {
        return req.user;
    });

    // using the XSUAA API
    this.on('userInfoUAA', async () => {
        return await xsuaa.get("/userinfo");
    });
});