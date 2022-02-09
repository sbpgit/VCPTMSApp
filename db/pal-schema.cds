//namespace sbp.pal;
namespace cp;

using { managed } from '@sap/cds/common';

entity PalHgbtRegressionsV1 {
    key hgbtID : String(50);
    createdAt  : Timestamp ;  
    Location : String(4);
    Product : String(40);
    regressionParameters : array of {
        groupId:String(100); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 

    hgbtType : Integer  @assert.range: [ 1, 12 ];
    regressionData : array of  { 
        groupId:String(100); 
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
        groupId : String(100); 
        rowIndex  : Integer; 
        treeIndex  : Integer; 
        modelContent : LargeString;
    };
    importanceOp : array of {
        groupId : String(100);
        variableName : String(256);
        importance : Double;
    };
    statisticsOp : array of {
        groupId : String(100);
        statName : String(1000);
        statValue : String(1000);
    };
    paramSelectionOp : array of {
        groupId : String(100);
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
    Location : String(4);
    Product : String(40);
    groupId : String(100);
    regressionParameters : array of {
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 
    hgbtType : Integer  @assert.range: [ 1, 12 ];    
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
    Location : String(4);
    Product : String(40);
    groupId : String(100);
    Version : String(10);
    Scenario : String(32);
    predictionParameters: array of {
        groupId:String(100); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 
    hgbtType : Integer  @assert.range: [ 1, 12 ];
    predictionData : array of  { 
        groupId:String(100); 
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
    groupId : String(100);
    id    : Integer;
    score : String(100);
    confidence : Double;
  };
}

entity PalRdtRegressions {
    key rdtID : String(50);
    createdAt  : Timestamp ;
    Location : String(4);
    Product : String(40);  
    regressionParameters : array of {
        groupId:String(100); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 

    rdtType : Integer  @assert.range: [ 1, 12 ];
    regressionData : array of  { 
        groupId:String(100); 
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
        groupId : String(100); 
        rowIndex  : Integer; 
        treeIndex  : Integer; 
        modelContent : LargeString;
    };
    importanceOp : array of {
        groupId : String(100);
        variableName : String(256);
        importance : Double;
    };
    outOfBagOp : array of {
        groupId : String(100);
        treeIndex  : Integer; 
        error  : Double; 
    }
}

entity PalRdtByGroup {
    rdtGroupID : String(50);
    createdAt  : Timestamp ;
    Location : String(4);
    Product : String(40);
    groupId : String(100);
    regressionParameters : array of {
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 
    rdtType : Integer  @assert.range: [ 1, 12 ];    
    importanceOp : array of {
        variableName : String(256);
        importance : Double;
    };
    outOfBagOp : array of {
        treeIndex  : Integer; 
        error  : Double; 
    }    
}

entity PalRdtPredictions { 
    key rdtID : String(50);
    createdAt  : Timestamp ; //@cds.on.insert : $now;
    Location : String(4);
    Product : String(40);
    groupId : String(20);
    Version : String(10);
    Scenario : String(32);
    predictionParameters: array of {
        groupId:String(100); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    }; 
    rdtType : Integer  @assert.range: [ 1, 12 ];
    predictionData : array of  { 
        groupId:String(100); 
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
    groupId : String(100);
    id    : Integer;
    score : String(100);
    confidence : Double;
  };
}

entity PalMlrRegressions {
    //key mlrID : UUID;
    key mlrID : String(50);
    createdAt  : Timestamp ;
    Location : String(4);
    Product : String(40);
    regressionParameters : array of {
        groupId:String(100); 
        paramName:String(256); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
    mlrType : Integer  @assert.range: [ 1, 12 ];
    regressionData : array of
    {
        groupId : String(100);
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
        groupId : String(100);
	    variableName : String(1000); 	
	    coefficientValue : Double;
	    tValue : Double;
	    pValue : Double;
    };
    pmmlOp : array of {
        groupId : String(100);
        rowIndex : Integer;
        modelContent : LargeString;
    };
    fittedOp : array of {
        groupId : String(100);
        ID : Integer;
        value : Double;
    };
    statisticsOp : array of {
        groupId : String(100);
        statName : String(256);
        statValue : String(1000);
    };
    optimalParamOp : array of {
        groupId : String(100);
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
    Location : String(4);
    Product : String(40);
    groupId : String(100);
    regressionParameters : array of {
        paramName:String(256); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };
    mlrType : Integer  @assert.range: [ 1, 12 ];
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
    Location : String(4);
    Product : String(40);
    groupId : String(20);
    Version : String(10);
    Scenario : String(32);
    predictionParameters: array of {
        groupId:String(100); 
        paramName:String(256); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(1000);
    };

    mlrpType : Integer  @assert.range: [ 1, 12 ];
    predictionData : array of { 
        groupId : String(100);
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
        groupId : String(100);
        ID : Integer;
        value : Double;
    }
}

entity PalVarmaModels {
    key varmaID : String(50);
    createdAt  : Timestamp ;
    Location : String(4);
    Product : String(40);
    controlParameters : array of {
        groupId:String(100); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    };
    varmaType : Integer  @assert.range: [ 1, 12 ];
    varmaData : array of
    {
        groupId : String(100);
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
        groupId : String(100);
	    contentIndex : Integer; 	
	    contentValue : LargeString;
    };
    fittedOp : array of {
        groupId : String(100);
        nameCol : LargeString;
        idx : Integer;
        fitting : Double;
        residual : Double;
    };
    irfOp : array of {
        groupId : String(100);
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
    Location : String(4);
    Product : String(40);
    groupId:String(100); 
    controlParameters : array of {
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    };
    varmaType : Integer  @assert.range: [ 1, 12 ];
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
    Location : String(4);
    Product : String(40);
    groupId : String(20);
    Version : String(10);
    Scenario : String(32);
    predictionParameters : array of {
        groupId:String(100); 
        paramName:String(100); 
        intVal:Integer;
        doubleVal : Double;
        strVal  : String(100);
    };
    varmaType : Integer  @assert.range: [ 1, 12 ];
    predictionData : array of
    {
        groupId : String(100);
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
    groupId : String(100);
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
        profile : String(50);
        override : Boolean;
        Location:String(4); 
        Product:String(40); 
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
        profile : String(50);
        override : Boolean;
        Location:String(4); 
        Product:String(40); 
        GroupID :String(20);
        dimensions : Integer;
    };
}


entity PAL_PARAMETERS
{
    key METHOD : String(20) @title : 'Method Name';
	key PARA_NAME : String(30) @title : 'Parameter Name';
	DATATYPE : String(30) @title : 'Data Type';
	DEFAULTVAL : String(100) @title : 'Default Value';
	INTVAL : Integer @title : 'Integer';
	DOUBLEVAL : Double @title : 'Double';
	STRVAL : String(50) @title : 'String';
	DESCRIPTION : String(1000) @title : ' Description';
	DEPENDENCY : String(1000) @title : ' Dependency';
}

entity TS_PREDICTIONS{
    key CAL_DATE         : Date      @title : 'Date';
    key LOCATION_ID      : String(4) @title : 'Location ID';
    key PRODUCT_ID       : String(40)@title : 'Product ID';
    key OBJ_TYPE         : String(2) @title : 'Object Type';
    key OBJ_DEP          : String(30)@title : 'Object Dependency';
    key OBJ_COUNTER      : Integer   @title : 'Object Counter';
    key MODEL_TYPE       : String(10) @title : 'PAL Model Type';
    key VERSION          : String(10)    @title : 'Version';
    key SCENARIO         : String(32)    @title : 'Scenario';
    PREDICTED            : Double    @title : 'Predicted';
    PREDICTED_TIME       : Timestamp @title : 'Predicted Time';
    PREDICTED_STATUS     : String(8) @title : 'Predicted Status';
};

entity IBP_RESULTPLAN_TS{
    key CAL_DATE         : Date      @title : 'Date';
    key LOCATION_ID      : String(4) @title : 'Location ID';
    key PRODUCT_ID       : String(40)@title : 'Product ID';
    key OBJ_TYPE         : String(2) @title : 'Object Type';
    key OBJ_DEP          : String(30)@title : 'Object Dependency';
    key OBJ_COUNTER      : Integer   @title : 'Object Counter';
    key VERSION          : String(10)    @title : 'Version';
    key SCENARIO         : String(32)    @title : 'Scenario';
    PREDICTED            : Double    @title : 'Predicted';
    PREDICTED_TIME       : Timestamp @title : 'Predicted Time';
    PREDICTED_STATUS     : String(8) @title : 'Predicted Status';
};

entity TS_OBJDEP_CHAR_IMPACT_F {
    key CAL_DATE    : Date      @title : 'Date';
    key LOCATION_ID : String(4) @title : 'Location ID';
    key PRODUCT_ID  : String(40)@title : 'Product ID';
    key OBJ_TYPE    : String(2) @title : 'Object Type';
    key OBJ_DEP     : String(30)@title : 'Object Dependency';
    key OBJ_COUNTER : Integer   @title : 'Object Counter';
    key ROW_ID      : Integer   @title : ' Attribute Index';
    key MODEL_TYPE       : String(10) @title : 'PAL Model Type';
    key VERSION     : String(10)    @title : 'Version';
    key SCENARIO    : String(32)    @title : 'Scenario';
    CHAR_COUNT      : Double   @title : 'Character Count';
    CHAR_IMPACT_VAL     : Double   @title : 'Character Impact Value';
    CHAR_IMPACT_PERCENT : Double   @title : 'Character Impact Percent';
    PREDICTED_VAL     : Double   @title : 'Predicted Value';
    PREDICTED_TIME       : Timestamp @title : 'Predicted Time';

};