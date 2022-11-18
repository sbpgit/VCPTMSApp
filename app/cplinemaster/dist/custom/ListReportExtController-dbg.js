sap.ui.define([],
function (){
    "use strict";
    return {
        onHelpPress: function(oEvent) {
            var hash = "#vcpdocdisplay-Display";

            var url = window.location.href.split('#')[0] + hash;

            sap.m.URLHelper.redirect(url, true);
        }
    };
});
