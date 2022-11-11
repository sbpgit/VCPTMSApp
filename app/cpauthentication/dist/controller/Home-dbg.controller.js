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
            //     var userModel = new sap.ui.model.json.JSONModel("/services/USERAPI/attributes");
            // this._userModel = this.getOwnerComponent().getModel("userModel");
            // userModel.attachRequestCompleted(function() {
			// 	that.username = userModel.getData().login_name;
			// 	//that.openPOList();
			// });
            let me = this;
            fetch("/getuserinfo")
            .then(res => res.json())
            .then(data => {
                me._userModel.setProperty("/",data);
            })
            .catch(err => console.log(err));
             },
             onNavPress:function(){
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); 
			// generate the Hash to display 
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "vcpdocdisplay",
					action: "Display"
				}
			})) || ""; 
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash; 
			//Navigate to second app
			sap.m.URLHelper.redirect(url, true); 
                } 
            }
        });
    });
