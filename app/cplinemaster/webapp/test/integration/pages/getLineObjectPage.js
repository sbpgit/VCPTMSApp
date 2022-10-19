sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'cpapp.cplinemaster',
            componentId: 'getLineObjectPage',
            entitySet: 'getLine'
        },
        CustomPageDefinitions
    );
});