sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "cpapp/cpauthentication/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        BaseController  ) {
        "use strict";

        return BaseController.extend("cpapp.cpauthentication.controller.Home", {
            onInit: function () {
                var userModel = new sap.ui.model.json.JSONModel("/services/USERAPI/attributes");
            this._userModel = this.getOwnerComponent().getModel("userModel");
            userModel.attachRequestCompleted(function() {
				that.username = userModel.getData().login_name;
				//that.openPOList();
			});
            // let me = this;
            // fetch("/myext")
            // .then(res => res.json())
            // .then(data => {
            //     me._userModel.setProperty("/",data);
            // })
            // .catch(err => console.log(err));
             }
        });
    });
