sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'cpapp/cptimeseriesf/test/integration/FirstJourney',
		'cpapp/cptimeseriesf/test/integration/pages/getTimeseriesFList',
		'cpapp/cptimeseriesf/test/integration/pages/getTimeseriesFObjectPage'
    ],
    function(JourneyRunner, opaJourney, getTimeseriesFList, getTimeseriesFObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('cpapp/cptimeseriesf') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThegetTimeseriesFList: getTimeseriesFList,
					onThegetTimeseriesFObjectPage: getTimeseriesFObjectPage
                }
            },
            opaJourney.run
        );
    }
);