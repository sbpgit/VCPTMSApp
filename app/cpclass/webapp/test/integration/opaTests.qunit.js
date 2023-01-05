sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'cpapp/cpclass/test/integration/FirstJourney',
		'cpapp/cpclass/test/integration/pages/getClassList',
		'cpapp/cpclass/test/integration/pages/getClassObjectPage'
    ],
    function(JourneyRunner, opaJourney, getClassList, getClassObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('cpapp/cpclass') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThegetClassList: getClassList,
					onThegetClassObjectPage: getClassObjectPage
                }
            },
            opaJourney.run
        );
    }
);