const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
/////////////////////////////////////
// const express = require('express');
// const passport = require('passport');
// const xsenv = require('@sap/xsenv');
// const JWTStrategy = require('@sap/xssec').JWTStrategy;
// const app = express();
// const services = xsenv.getServices({ uaa:'uaa_config_products' });

// passport.use(new JWTStrategy(services.uaa));
// app.use(passport.initialize());
// app.use(passport.authenticate('JWT', { session: false }));

// app.get('/', function (req, res, next) {
// //   var user = req.user;
//   res.send(req.user.id);
// });
// const port = process.env.PORT || 3000;

// app.listen(port, function () {
//   console.log('app listening on port ' + port);
// });
/////////////////////////////////////////
cds.on("bootstrap", app =>{ 
 app.use(proxy()); 
});

module.exports = cds.server;