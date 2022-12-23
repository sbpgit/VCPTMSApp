sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'cpapp.cptimeseriesf',
            componentId: 'getTimeseriesFObjectPage',
            entitySet: 'getTimeseriesF'
        },
        CustomPageDefinitions
    );
});