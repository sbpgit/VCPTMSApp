sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "cpapp/cpplaningconfig/model/models",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/f/library"
],
    function (UIComponent, Device, models, FlexibleColumnLayoutSemanticHelper, fioriLibrary) {
        "use strict";

        return UIComponent.extend("cpapp.cpplaningconfig.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oRouter;
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");                
            } 
            
        });
    }
);