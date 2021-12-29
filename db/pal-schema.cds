//namespace sbp.pal;
namespace cp;

using { managed } from '@sap/cds/common';

entity PalHgbtRegressionsV1 {
    key hgbtID : String(50);
    createdAt  : Timestamp ;  
    regressionParameters : array of {
        groupId:String(20); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 

    hgbtType : Integer  @assert.range: [ 2, 12 ];
    regressionData : array of  { 
        groupId:String(20); 
        ID : Integer;
        att1: Double; 
        att2: Double; 
        att3: Double;
        att4 : Double;
        att5 : Double;
        att6 : Double;
        att7: Double;
        att8 : Double;
        att9 : Double;
        att10 : Double;
        att11 : Double;
        att12 : Double;
        target  : Double; 
    } ; 
    modelsOp : array of {
        groupId : String(20); 
        rowIndex  : Integer; 
        treeIndex  : Integer; 
        modelContent : LargeString;
    };
    importanceOp : array of {
        groupId : String(20);
        variableName : String(256);
        importance : Double;
    };
    statisticsOp : array of {
        groupId : String(20);
        statName : String(1000);
        statValue : String(1000);
    };
    paramSelectionOp : array of {
        groupId : String(20);
        paramName : String(256);
        intVal : Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
}

//@readonly
entity PalHgbtByGroup {
    hgbtGroupID : String(50);
    createdAt  : Timestamp ;
    groupId : String(20);
    regressionParameters : array of {
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 
    hgbtType : Integer  @assert.range: [ 2, 12 ];    
    importanceOp : array of {
        variableName : String(256);
        importance : Double;
    };
    statisticsOp : array of {
        statName : String(1000);
        statValue : String(1000);
    };
    paramSelectionOp : array of {
        paramName : String(256);
        intVal : Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
}


entity PalHgbtPredictionsV1 { 
    key hgbtID : String(50);
    createdAt  : Timestamp ; //@cds.on.insert : $now;
    groupId : String(20);
    predictionParameters: array of {
        groupId:String(20); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 
    hgbtType : Integer  @assert.range: [ 2, 12 ];
    predictionData : array of  { 
        groupId:String(20); 
        //id   : Integer; 
        ID   : Integer; 
        att1 : Double; 
        att2 : Double; 
        att3 : Double;
        att4 : Double;
        att5 : Double;
        att6 : Double;
        att7 : Double;
        att8 : Double;
        att9 : Double;
        att10 : Double;
        att11 : Double;
        att12 : Double;
    } ; 
    predictedResults : array of {
    groupId : String(20);
    id    : Integer;
    score : String(100);
    confidence : Double;
  };
}

entity PalMlrRegressions {
    //key mlrID : UUID;
    key mlrID : String(50);
    createdAt  : Timestamp ;
    regressionParameters : array of {
        groupId:String(20); 
        paramName:String(256); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
    mlrType : Integer  @assert.range: [ 2, 12 ];
    regressionData : array of
    {
        groupId : String(20);
        ID : Integer;
        target : Double; 
        att1 : Double;
        att2 : Double;
        att3 : Double;
        att4 : Double;
        att5 : Double;
        att6 : Double;
        att7 : Double;
        att8 : Double;
        att9 : Double;
        att10 : Double;
        att11 : Double;
        att12 : Double;
    }; 
    coefficientOp : array of {
        groupId : String(20);
	    variableName : String(1000); 	
	    coefficientValue : Double;
	    tValue : Double;
	    pValue : Double;
    };
    pmmlOp : array of {
        groupId : String(20);
        rowIndex : Integer;
        modelContent : LargeString;
    };
    fittedOp : array of {
        groupId : String(20);
        ID : Integer;
        value : Double;
    };
    statisticsOp : array of {
        groupId : String(20);
        statName : String(256);
        statValue : String(1000);
    };
    optimalParamOp : array of {
        groupId : String(20);
        paramName : String(256);
        intVal : Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
}

//@readonly
entity PalMlrByGroup {
    mlrGroupID : String(50);
    createdAt  : Timestamp ;
    groupId : String(20);
    regressionParameters : array of {
        paramName:String(256); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
    mlrType : Integer  @assert.range: [ 2, 12 ];
    coefficientOp : array of {
	    variableName : String(1000); 	
	    coefficientValue : Double;
	    tValue : Double;
	    pValue : Double;
    };
    fittedOp : array of {
        ID : Integer;
        value : Double;
    };
    statisticsOp : array of {
        statName : String(256);
        statValue : String(1000);
    };
    optimalParamOp : array of {
        paramName : String(256);
        intVal : Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
}

entity PalMlrPredictions {
    //key mlrpID : UUID;
    key mlrpID : String(50);
    createdAt  : Timestamp ; //@cds.on.insert : $now;
    groupId : String(20);
    predictionParameters: array of {
        groupId:String(20); 
        paramName:String(256); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };

    mlrpType : Integer  @assert.range: [ 2, 12 ];
    predictionData : array of { 
        groupId : String(20);
        ID : Integer;
        att1 : Double;
        att2 : Double;
        att3 : Double;
        att4 : Double;
        att5 : Double;
        att6 : Double; 
        att7 : Double;
        att8 : Double;
        att9 : Double;
        att10 : Double; 
        att11 : Double;
        att12 : Double; 
    };
    fittedResults : array of {
        groupId : String(20);
        ID : Integer;
        value : Double;
    }
}

entity PalVarmaModels {
    key varmaID : String(50);
    createdAt  : Timestamp ;
    controlParameters : array of {
        groupId:String(20); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    };
    varmaType : Integer  @assert.range: [ 2, 12 ];
    varmaData : array of
    {
        groupId : String(20);
        //timestamp : Integer;
        ID : Integer;
        att1 : Double;
        att2 : Double;
        att3 : Double;
        att4 : Double;
        att5 : Double;
        att6 : Double;
        att7 : Double;
        att8 : Double;
        att9 : Double;
        att10 : Double;
        att11 : Double;
        att12 : Double;
        target : Double; 
    }; 
    modelsOp : array of {
        groupId : String(20);
	    contentIndex : Integer; 	
	    contentValue : LargeString;
    };
    fittedOp : array of {
        groupId : String(20);
        nameCol : LargeString;
        idx : Integer;
        fitting : Double;
        residual : Double;
    };
    irfOp : array of {
        groupId : String(20);
        col1 : LargeString;
        col2 : LargeString;
        idx  : Integer;
        response : Double;
    };
}

//@readonly
entity PalVarmaByGroup {
    varmaGroupID : String(50);
    createdAt  : Timestamp ;
    groupId:String(20); 
    controlParameters : array of {
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    };
    varmaType : Integer  @assert.range: [ 2, 12 ];
    varmaData : array of
    {
        //timestamp : Integer;
        ID : Integer;
        att1 : Double;
        att2 : Double;
        att3 : Double;
        att4 : Double;
        att5 : Double;
        att6 : Double;
        att7 : Double;
        att8 : Double;
        att9 : Double;
        att10 : Double;
        att11 : Double;
        att12 : Double;
        target : Double; 
    }; 
    fittedOp : array of {
        nameCol : LargeString;
        idx : Integer;
        fitting : Double;
        residual : Double;
    };
    irfOp : array of {
        col1 : LargeString;
        col2 : LargeString;
        idx  : Integer;
        response : Double;
    };
}

entity PalVarmaPredictions { 
    key varmaID : String(50);
    createdAt  : Timestamp ;
    groupId : String(20);
    predictionParameters : array of {
        groupId:String(20); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    };
    varmaType : Integer  @assert.range: [ 2, 12 ];
    predictionData : array of
    {
        groupId : String(20);
        //timestampIdx : Integer;
        ID : Integer;
        att1 : Double;
        att2 : Double;
        att3 : Double;
        att4 : Double;
        att5 : Double;
        att6 : Double;
        att7 : Double;
        att8 : Double;
        att9 : Double;
        att10 : Double;
        att11 : Double;
        att12 : Double;
    }; 
    predictedResults : array of {
    groupId : String(20);
    columnName    : String(50);
    idx :Integer;
    forecast : Double;
    se : Double;
    lo95 : Double;
    hi95 : Double;
  };
}

entity PalGenRegressionModels
{
    key regressionsID : String(50);
    //modelsID : String(50);
    createdAt  : Timestamp ;  
    //modelType : Integer;//  @assert.range: [ 1, 2 ]; // 1 - MLR, 2 - HGBT
    modelType : String(10);
    vcRulesList : array of {
//        periodType : String(10); // day, week
//        tableName : String(50); // Input Table Name for Data Extraction
        Location:String(20); 
        Product:String(15); 
        GroupID :String(20);
        //modelType : Integer;//  @assert.range: [ 1, 2 ]; // 1 - MLR, 2 - HGBT
        dimensions : Integer;
    };
}

entity PalGenPredictions
{
    key predictionsID : String(50);
    createdAt  : Timestamp ;  
    modelType : String(10);
    vcRulesList : array of {
        Location:String(20); 
        Product:String(15); 
        GroupID :String(20);
        dimensions : Integer;
    };
}

// entity PalModelProfiles
// {
//     key Location: String(5);
// 	key Product: String(40);
// 	key GroupID: String(20);
// 	key ModelType : String(10);
// 	key ProfileID : Integer;
// };

// entity PalModelParameters
// {
//      key ModelType: String(10);
// 	 key ProfileID: Integer;
// 	 key paramName: String(30);
// 	 intVal: Integer;
// 	 doubleVal: Double;
// 	 strVal: String(20);
// 	 paramDescription: String(1000);
// };

