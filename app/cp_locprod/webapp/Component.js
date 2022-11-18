sap.ui.define(["sap/fe/core/AppComponent"], function(AppComponent) {
    'use strict';

    return AppComponent.extend("cp.lp.cplocprod.Component", {
        onBeforeRendering:function(){
this.getView();
        },
        metadata: {
            manifest: "json"
        }
    });
});
