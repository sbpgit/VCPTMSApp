sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'cpapp/cplinemaster/test/integration/FirstJourney',
		'cpapp/cplinemaster/test/integration/pages/getLineList',
		'cpapp/cplinemaster/test/integration/pages/getLineObjectPage'
    ],
    function(JourneyRunner, opaJourney, getLineList, getLineObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('cpapp/cplinemaster') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThegetLineList: getLineList,
					onThegetLineObjectPage: getLineObjectPage
                }
            },
            opaJourney.run
        );
    }
);