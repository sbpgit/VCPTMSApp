
//using { sbp.pal as pal } from '../db/pal-schema';
using { cp as pal } from '../db/pal-schema';
// service PalService @(requires: 'authenticated-user'){
service PalService{

    entity hgbtRegressionsV1 as projection on pal.PalHgbtRegressionsV1;
    entity hgbtByGroup as projection on pal.PalHgbtByGroup;
    entity hgbtPredictionsV1 as projection on pal.PalHgbtPredictionsV1;

    entity rdtRegressions as projection on pal.PalRdtRegressions;
    entity rdtByGroup as projection on pal.PalRdtByGroup;
    entity rdtPredictions as projection on pal.PalRdtPredictions;
    

    entity mlrRegressions as projection on pal.PalMlrRegressions;
    entity mlrByGroup as projection on pal.PalMlrByGroup;
    entity mlrPredictions as projection on pal.PalMlrPredictions;

    entity varmaModels as projection on pal.PalVarmaModels;
    entity varmaByGroup as projection on pal.PalVarmaByGroup;
    entity varmaPredictions as projection on pal.PalVarmaPredictions;


    entity generateRegModels as projection on pal.PalGenRegressionModels;
    entity generatePredictions as projection on pal.PalGenPredictions;

    entity getPredictions as projection on pal.TS_PREDICTIONS;
    entity getIbpResultPlan as projection on pal.IBP_RESULTPLAN_TS;
    entity getODImpactVals as projection on pal.TS_OBJDEP_CHAR_IMPACT_F;
    entity getODModelVersions as projection on pal.OD_MODEL_VERSIONS;


    entity generateAhcClusters as projection on pal.PalGenClusters;

    entity getClustersInput as projection on pal.CLUSTER_DATA;
    entity getClusterStages as projection on pal.AHC_COMBINE_PROCESS;
    entity getClusterIds as projection on pal.AHC_RESULTS;

    entity getClustersByDistance as projection on pal.V_AHC_CLUSTER_RESULTS; 
    entity getClusterChars as projection on pal.V_CLUSTER_CHARS;





    // @odata.draft.enabled
    // entity modelProfiles as projection on pal.PalModelProfiles;

    //entity hgbtPred as projection on pal.PalHgbtPred;

    entity get_palparameters as projection on pal.PAL_PARAMETERS;
    //entity correlation as projection on pal.Palinputs;
    type result {
        resultStatus : String;
        success : Boolean;
    }

    action genTimeSeriesData();
    action generateModels(vcRulesList : array of{
            profile      : String(50);
            override     : Boolean;
            Location     : String(4);
            Product      : String(40);
            GroupID      : String(20);
            Type         : String(10); // //OD - Object Dependency, Restriction
            modelVersion : String(20);// Active, Simulation
            //modelType : Integer;//  @assert.range: [ 1, 2 ]; // 1 - MLR, 2 - HGBT
            dimensions   : Integer;
        });

        action genPredictions(vcRulesList : array of {
            profile      : String(50);
            override     : Boolean;
            version      : String(10); // default 'BASELINE'; // IBP Version
            scenario     : String(32); // default 'BSL_SCENARIO'; // IBP Scenario
            Location     : String(4);
            Product      : String(40);
            GroupID      : String(20);
            Type         : String(10); // //OD - Object Dependency, Restriction
            modelVersion : String(20);// Active, Simulation// Active, Simulation
            dimensions   : Integer;
            startDate    : Date;
            endDate    : Date;
        });

        action purgePredictions(vcRulesList : array of {
            Location     : String(4);
            Product      : String(40);
            GroupID      : String(20);
            Type         : String(10); // Object Dependency, Restriction, Primary
            startDate    : Date; // Delete Prediction Tables Data older than start date
        });

        action genClusterUniqueIDS
        (
            Location     : String(4),
            Product      : String(40)
        );
        action genClusters(vcRulesList : array of{
            profile      : String(50);
            override     : Boolean;
            Location     : String(4);
            Product      : String(40);
            // GroupID      : String(20);
        });


        // function f_generateModels(vcRulesList : array of{
        //     profile      : String(50);
        //     override     : Boolean;
        //     Location     : String(4);
        //     Product      : String(40);
        //     GroupID      : String(20);
        //     Type         : String(10); // //OD - Object Dependency, Restriction
        //     modelVersion : String(20);// Active, Simulation
        //     //modelType : Integer;//  @assert.range: [ 1, 2 ]; // 1 - MLR, 2 - HGBT
        //     dimensions   : Integer;
        // }) returns String;

        function fgModels(vcRulesList : String) returns String;
        function fgPredictions(vcRulesList : String) returns String;


        // function f_genPredictions(vcRulesList : array of {
        //     profile      : String(50);
        //     override     : Boolean;
        //     version      : String(10); // default 'BASELINE'; // IBP Version
        //     scenario     : String(32); // default 'BSL_SCENARIO'; // IBP Scenario
        //     Location     : String(4);
        //     Product      : String(40);
        //     GroupID      : String(20);
        //     Type         : String(10); // //OD - Object Dependency, Restriction
        //     modelVersion : String(20);// Active, Simulation// Active, Simulation
        //     dimensions   : Integer;
        // }) returns String;
}

   
/*
   // action testCorrelation(inputs : correlation)
    action testCorrelation(inputs : corrinput)
      returns result;
 

    function execCorrelation(a : Integer, b :  Integer)
      returns result;
*/
//}   entity getLeftClusters as projection on pal.V_AHC_LEFT_CLUSTER;
