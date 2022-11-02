sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'cpapp/cpcirlog/test/integration/FirstJourney',
		'cpapp/cpcirlog/test/integration/pages/getCIRLogList',
		'cpapp/cpcirlog/test/integration/pages/getCIRLogObjectPage'
    ],
    function(JourneyRunner, opaJourney, getCIRLogList, getCIRLogObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('cpapp/cpcirlog') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThegetCIRLogList: getCIRLogList,
					onThegetCIRLogObjectPage: getCIRLogObjectPage
                }
            },
            opaJourney.run
        );
    }
);