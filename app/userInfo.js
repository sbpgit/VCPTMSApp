const approuter = require("@sap/approuter");
const jwtDecode = require("jwt-decode");
let ar = approuter();
ar.beforeRequestHandler.use((req, res, next) => {
    console.log("The following request was made");
    console.log("Method: ", req.method);
    console.log("URL: ", req.url);
    next();
});
ar.beforeRequestHandler.use("/getUsernformation", (req, res) => {
    res.statusCode = 200;
    let decodedJWTToken = jwtDecode(req.user.token.accessToken);
    res.end(JSON.stringify({
        decodedJWTToken
    }))
  });
ar.start();