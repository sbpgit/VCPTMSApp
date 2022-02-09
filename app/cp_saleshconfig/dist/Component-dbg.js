sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "cp/appf/cpsaleshconfig/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("cp.appf.cpsaleshconfig.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
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