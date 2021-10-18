const hana = require("@sap/hana-client");

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
  }

  async dbQuery(sql) {
    return new Promise((resolve) => {
      con.connect(connParams);

      let results = con.prepare(sql).exec();
      con.prepare(sql).drop();
      resolve(results);
    });
  }
}

module.exports = DbConnect;
