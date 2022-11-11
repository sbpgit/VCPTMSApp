sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "cpapp/cpauthentication/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        BaseController) {
        "use strict";

        return BaseController.extend("cpapp.cpauthentication.controller.Home", {
            onInit: function () {
                // var y = "/sap/bc/ui2/start_up";

                // var xmlHttp = null;

                // xmlHttp = new XMLHttpRequest();

                // xmlHttp.onreadystatechange = function () {
                //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                //         var oUserData = JSON.parse(xmlHttp.responseText);
                //         console.log(oUserData);
                //     }
                // };
                // xmlHttp.open( "GET", y, false );

                // xmlHttp.send(null);
                // var oUser = new sap.ushell.services.UserInfo();
                // var userId = oUser.getId();
                // var suser = new sap.ushell.Container.getServiceAsync("UserInfo").then(function (UserInfo){
                //     var t;                    
                // });
                //     var userModel = new sap.ui.model.json.JSONModel("/services/USERAPI/attributes");
                // this._userModel = this.getOwnerComponent().getModel("userModel");
                // userModel.attachRequestCompleted(function() {
                // 	that.username = userModel.getData().login_name;
                // 	//that.openPOList();
                // });
                // let me = this;
                // fetch("/getuserinfo")
                // .then(res => res.json())
                // .then(data => {
                //     me._userModel.setProperty("/",data);
                // })
                // .catch(err => console.log(err));
                this.doSomethingUserDetails();
            },
            doSomethingUserDetails: async function() {
                const oUserInfo = await this.getUserInfoService();
                const sUserId = oUserInfo.getEmail(); // And in SAPUI5 1.86, those became public: .getEmail(), .getFirstName(), .getLastName(), .getFullName(), ... 
                console.log(sUserId);
                var stest = this.getLogonUser();
                // ...
              },
              
              getUserInfoService: function() {
                return new Promise(resolve => sap.ui.require([
                  "sap/ushell/library"
                ], oSapUshellLib => {
                  const oContainer = oSapUshellLib.Container;
                  const pService = oContainer.getServiceAsync("UserInfo"); // .getService is deprecated!
                  resolve(pService);
                }));
              },
              getLogonUser: function(){
                  var userID = "DEFAULT_USER",
                      userInfo;
              
                  if (sap.ushell){
                      userInfo = sap.ushell.Container.getService("UserInfo");
                      if (userInfo) {
                          userID = userInfo.getId();
                      }
                  }
                  return userID;
              },
            onNavPress: function () {
                //     if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                // var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); 
                // // generate the Hash to display 
                // var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                // 	target: {
                // 		semanticObject: "vcpdocdisplay",
                // 		action: "Display"
                // 	}
                // })) || ""; 
                // //Generate a  URL for the second application
                // var url = window.location.href.split('#')[0] + hash; 
                // //Navigate to second app
                // sap.m.URLHelper.redirect(url, true); 
                //     } 
            }
        });
    });
