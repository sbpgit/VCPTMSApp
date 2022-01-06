
//using { sbp.pal as pal } from '../db/pal-schema';
using { cp as pal } from '../db/pal-schema';
 service PalService @(requires: 'authenticated-user'){
//service PalService{

    entity hgbtRegressionsV1 as projection on pal.PalHgbtRegressionsV1;
    entity hgbtByGroup as projection on pal.PalHgbtByGroup;
    entity hgbtPredictionsV1 as projection on pal.PalHgbtPredictionsV1;


    

    entity mlrRegressions as projection on pal.PalMlrRegressions;
    entity mlrByGroup as projection on pal.PalMlrByGroup;
    entity mlrPredictions as projection on pal.PalMlrPredictions;

    entity varmaModels as projection on pal.PalVarmaModels;
    entity varmaByGroup as projection on pal.PalVarmaByGroup;
    entity varmaPredictions as projection on pal.PalVarmaPredictions;


    entity generateRegModels as projection on pal.PalGenRegressionModels;
    entity generatePredictions as projection on pal.PalGenPredictions;

    // @odata.draft.enabled
    // entity modelProfiles as projection on pal.PalModelProfiles;

    //entity hgbtPred as projection on pal.PalHgbtPred;


    //entity correlation as projection on pal.Palinputs;

    type result {
        resultStatus : String;
        success : Boolean;
    }

    action genTimeSeriesData();



   
/*
   // action testCorrelation(inputs : correlation)
    action testCorrelation(inputs : corrinput)
      returns result;
 

    function execCorrelation(a : Integer, b :  Integer)
      returns result;
*/
}