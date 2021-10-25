const hana = require("@sap/hana-client");
"use strict";
 
// For converting V4 to V2
const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
cds.on("bootstrap", app => app.use(proxy()));
module.exports = cds.server;

const connParams = {
  serverNode:    "b3117009-beb5-4b3f-a851-c379293f8579.hana.prod-us10.hanacloud.ondemand.com:443",
  uid:           "SBPTECHTEAM",
  pwd:           "Sbpcorp@21",
  currentSchema: "DB_CONFIG_PROD_SBPDEV"
};

let con;

class DbConnect {
  constructor() {
    con = hana.createConnection();
    con.connect(connParams);
  }
/**
 * 
 * @param {String} sql 
 */
  async dbQuery(sql) {

    return new Promise((resolve) => {
      let results = con.prepare(sql).exec();
      con.prepare(sql).drop();
      resolve(results);
    });

  }

 /**
  * 
  * @param {String} sql 
  * @param {String} filterCond 
  */ 
  async dbQueryClause(sql,filterCond){

      let results,err;
      var filter = filterCond.split(',');b 
  }
}

module.exports = DbConnect;
