const cds = require('@sap/cds')
module.exports = cds.service.impl((srv) => {
srv.before(['CREATE','UPDATE'],'BOM_OBJDEPENDENCY',(req)=>{
    const bomod = req.data
    if (bomod.ITEM_NUM == '')  throw 'Please enter Item number'
  })
  cds.serve('cat-service') .with (function(){
    this.on ('error', (err, req ) => {
      // modify the message
      err.message = 'Error! ' + err.message
    })
  })
})