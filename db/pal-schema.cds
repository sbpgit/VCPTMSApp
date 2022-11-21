//namespace sbp.pal;
namespace cp;

using {managed} from '@sap/cds/common';

type ModelVersion : String enum {
    Active;
    Simulation;
}

type ObjType : String enum {
    OD;
    RT;
}

// groupId is part of Parameters, Data, Models and other to support Parallelization
entity PalHgbtRegressionsV1 {
    key hgbtID               : String(50);
        createdAt            : Timestamp;
        Location             : String(4);
        Product              : String(40);
        regressionParameters : array of {
            groupId          : String(100);
            paramName        : String(100);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(100);
        };

        hgbtType             : Integer                      @assert.range : [
            1,
            12
        ];
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation

        regressionData       : array of {
            groupId          : String(100);
            ID               : Integer;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
            target           : Double;
        };
        modelsOp             : array of {
            groupId          : String(100);
            rowIndex         : Integer;
            treeIndex        : Integer;
            modelContent     : LargeString;
        };
        importanceOp         : array of {
            groupId          : String(100);
            variableName     : String(256);
            importance       : Double;
        };
        statisticsOp         : array of {
            groupId          : String(100);
            statName         : String(1000);
            statValue        : String(1000);
        };
        paramSelectionOp     : array of {
            groupId          : String(100);
            paramName        : String(256);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(1000);
        };
}

//@readonly
entity PalHgbtByGroup {
    hgbtGroupID          : String(50);
    createdAt            : Timestamp;
    Location             : String(4);
    Product              : String(40);
    groupId              : String(100);
    Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
    modelVersion         : ModelVersion default 'Active'@assert.range : [
        'Active',
        'Simulation'
    ]; // Active, Simulation
    profile              : String(50);
    regressionParameters : array of {
        paramName        : String(100);
        intVal           : Integer;
        doubleVal        : Double;
        strVal           : String(100);
    };
    hgbtType             : Integer                      @assert.range : [
        1,
        12
    ];
    importanceOp         : array of {
        variableName     : String(256);
        importance       : Double;
    };
    statisticsOp         : array of {
        statName         : String(1000);
        statValue        : String(1000);
    };
    paramSelectionOp     : array of {
        paramName        : String(256);
        intVal           : Integer;
        doubleVal        : Double;
        strVal           : String(1000);
    };
}


entity PalHgbtPredictionsV1 {
    key hgbtID               : String(50);
        createdAt            : Timestamp; //@cds.on.insert : $now;
        Location             : String(4);
        Product              : String(40);
        groupId              : String(100);
        Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        profile              : String(50);
        Version              : String(10);
        Scenario             : String(32);
        predictionParameters : array of {
            groupId          : String(100);
            paramName        : String(100);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(100);
        };
        hgbtType             : Integer                      @assert.range : [
            1,
            12
        ];
        predictionData       : array of {
            groupId          : String(100);
            //id   : Integer;
            ID               : Integer;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
        };
        predictedResults     : array of {
            groupId          : String(100);
            id               : Integer;
            score            : String(100);
            confidence       : Double;
        };
}

entity PalRdtRegressions {
    key rdtID                : String(50);
        createdAt            : Timestamp;
        Location             : String(4);
        Product              : String(40);
        regressionParameters : array of {
            groupId          : String(100);
            paramName        : String(100);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(100);
        };

        rdtType              : Integer                      @assert.range : [
            1,
            12
        ];
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        regressionData       : array of {
            groupId          : String(100);
            ID               : Integer;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
            target           : Double;
        };
        modelsOp             : array of {
            groupId          : String(100);
            rowIndex         : Integer;
            treeIndex        : Integer;
            modelContent     : LargeString;
        };
        importanceOp         : array of {
            groupId          : String(100);
            variableName     : String(256);
            importance       : Double;
        };
        outOfBagOp           : array of {
            groupId          : String(100);
            treeIndex        : Integer;
            error            : Double;
        }
}

entity PalRdtByGroup {
    rdtGroupID           : String(50);
    createdAt            : Timestamp;
    Location             : String(4);
    Product              : String(40);
    groupId              : String(100);
    Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
    modelVersion         : ModelVersion default 'Active'@assert.range : [
        'Active',
        'Simulation'
    ]; // Active, Simulation
    profile              : String(50);
    regressionParameters : array of {
        paramName        : String(100);
        intVal           : Integer;
        doubleVal        : Double;
        strVal           : String(100);
    };
    rdtType              : Integer                      @assert.range : [
        1,
        12
    ];
    importanceOp         : array of {
        variableName     : String(256);
        importance       : Double;
    };
    outOfBagOp           : array of {
        treeIndex        : Integer;
        error            : Double;
    }
}

entity PalRdtPredictions {
    key rdtID                : String(50);
        createdAt            : Timestamp; //@cds.on.insert : $now;
        Location             : String(4);
        Product              : String(40);
        groupId              : String(20);
        Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        profile              : String(50);
        Version              : String(10);
        Scenario             : String(32);
        predictionParameters : array of {
            groupId          : String(100);
            paramName        : String(100);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(100);
        };
        rdtType              : Integer                      @assert.range : [
            1,
            12
        ];
        predictionData       : array of {
            groupId          : String(100);
            //id   : Integer;
            ID               : Integer;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
        };
        predictedResults     : array of {
            groupId          : String(100);
            id               : Integer;
            score            : String(100);
            confidence       : Double;
        };
}

entity PalMlrRegressions {
        //key mlrID : UUID;
    key mlrID                : String(50);
        createdAt            : Timestamp;
        Location             : String(4);
        Product              : String(40);
        regressionParameters : array of {
            groupId          : String(100);
            paramName        : String(256);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(1000);
        };
        mlrType              : Integer                      @assert.range : [
            1,
            12
        ];
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        regressionData       : array of {
            groupId          : String(100);
            ID               : Integer;
            target           : Double;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
        };
        coefficientOp        : array of {
            groupId          : String(100);
            variableName     : String(1000);
            coefficientValue : Double;
            tValue           : Double;
            pValue           : Double;
        };
        pmmlOp               : array of {
            groupId          : String(100);
            rowIndex         : Integer;
            modelContent     : LargeString;
        };
        fittedOp             : array of {
            groupId          : String(100);
            ID               : Integer;
            value            : Double;
        };
        statisticsOp         : array of {
            groupId          : String(100);
            statName         : String(256);
            statValue        : String(1000);
        };
        optimalParamOp       : array of {
            groupId          : String(100);
            paramName        : String(256);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(1000);
        };
}

//@readonly
entity PalMlrByGroup {
    mlrGroupID           : String(50);
    createdAt            : Timestamp;
    Location             : String(4);
    Product              : String(40);
    groupId              : String(100);
    Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
    modelVersion         : ModelVersion default 'Active'@assert.range : [
        'Active',
        'Simulation'
    ]; // Active, Simulation
    profile              : String(50);
    regressionParameters : array of {
        paramName        : String(256);
        intVal           : Integer;
        doubleVal        : Double;
        strVal           : String(1000);
    };
    mlrType              : Integer                      @assert.range : [
        1,
        12
    ];
    coefficientOp        : array of {
        variableName     : String(1000);
        coefficientValue : Double;
        tValue           : Double;
        pValue           : Double;
    };
    fittedOp             : array of {
        ID               : Integer;
        value            : Double;
    };
    statisticsOp         : array of {
        statName         : String(256);
        statValue        : String(1000);
    };
    optimalParamOp       : array of {
        paramName        : String(256);
        intVal           : Integer;
        doubleVal        : Double;
        strVal           : String(1000);
    };
}

entity PalMlrPredictions {
        //key mlrpID : UUID;
    key mlrpID               : String(50);
        createdAt            : Timestamp; //@cds.on.insert : $now;
        Location             : String(4);
        Product              : String(40);
        groupId              : String(20);
        Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        Version              : String(10);
        profile              : String(50);
        Scenario             : String(32);
        predictionParameters : array of {
            groupId          : String(100);
            paramName        : String(256);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(1000);
        };

        mlrpType             : Integer                      @assert.range : [
            1,
            12
        ];
        predictionData       : array of {
            groupId          : String(100);
            ID               : Integer;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
        };
        fittedResults        : array of {
            groupId          : String(100);
            ID               : Integer;
            value            : Double;
        }
}

entity PalVarmaModels {
    key varmaID           : String(50);
        createdAt         : Timestamp;
        Location          : String(4);
        Product           : String(40);
        controlParameters : array of {
            groupId       : String(100);
            paramName     : String(100);
            intVal        : Integer;
            doubleVal     : Double;
            strVal        : String(100);
        };
        varmaType         : Integer                      @assert.range : [
            1,
            12
        ];
        modelVersion      : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        varmaData         : array of {
            groupId       : String(100);
            //timestamp : Integer;
            ID            : Integer;
            att1          : Double;
            att2          : Double;
            att3          : Double;
            att4          : Double;
            att5          : Double;
            att6          : Double;
            att7          : Double;
            att8          : Double;
            att9          : Double;
            att10         : Double;
            att11         : Double;
            att12         : Double;
            target        : Double;
        };
        modelsOp          : array of {
            groupId       : String(100);
            contentIndex  : Integer;
            contentValue  : LargeString;
        };
        fittedOp          : array of {
            groupId       : String(100);
            nameCol       : LargeString;
            idx           : Integer;
            fitting       : Double;
            residual      : Double;
        };
        irfOp             : array of {
            groupId       : String(100);
            col1          : LargeString;
            col2          : LargeString;
            idx           : Integer;
            response      : Double;
        };
}

//@readonly
entity PalVarmaByGroup {
    varmaGroupID      : String(50);
    createdAt         : Timestamp;
    Location          : String(4);
    Product           : String(40);
    groupId           : String(100);
    Type              : ObjType default 'OD'; //OD - Object Dependency, Restriction
    modelVersion      : ModelVersion default 'Active'@assert.range : [
        'Active',
        'Simulation'
    ]; // Active, Simulation
    profile           : String(50);
    controlParameters : array of {
        paramName     : String(100);
        intVal        : Integer;
        doubleVal     : Double;
        strVal        : String(100);
    };
    varmaType         : Integer                      @assert.range : [
        1,
        12
    ];
    varmaData         : array of {
        //timestamp : Integer;
        ID            : Integer;
        att1          : Double;
        att2          : Double;
        att3          : Double;
        att4          : Double;
        att5          : Double;
        att6          : Double;
        att7          : Double;
        att8          : Double;
        att9          : Double;
        att10         : Double;
        att11         : Double;
        att12         : Double;
        target        : Double;
    };
    fittedOp          : array of {
        nameCol       : LargeString;
        idx           : Integer;
        fitting       : Double;
        residual      : Double;
    };
    irfOp             : array of {
        col1          : LargeString;
        col2          : LargeString;
        idx           : Integer;
        response      : Double;
    };
}

entity PalVarmaPredictions {
    key varmaID              : String(50);
        createdAt            : Timestamp;
        Location             : String(4);
        Product              : String(40);
        groupId              : String(20);
        Type                 : ObjType default 'OD'; //OD - Object Dependency, Restriction
        modelVersion         : ModelVersion default 'Active'@assert.range : [
            'Active',
            'Simulation'
        ]; // Active, Simulation
        profile              : String(50);
        Version              : String(10);
        Scenario             : String(32);
        predictionParameters : array of {
            groupId          : String(100);
            paramName        : String(100);
            intVal           : Integer;
            doubleVal        : Double;
            strVal           : String(100);
        };
        varmaType            : Integer                      @assert.range : [
            1,
            12
        ];
        predictionData       : array of {
            groupId          : String(100);
            //timestampIdx : Integer;
            ID               : Integer;
            att1             : Double;
            att2             : Double;
            att3             : Double;
            att4             : Double;
            att5             : Double;
            att6             : Double;
            att7             : Double;
            att8             : Double;
            att9             : Double;
            att10            : Double;
            att11            : Double;
            att12            : Double;
        };
        predictedResults     : array of {
            groupId          : String(100);
            columnName       : String(50);
            idx              : Integer;
            forecast         : Double;
            se               : Double;
            lo95             : Double;
            hi95             : Double;
        };
}


entity PalGenRegressionModels {
    key regressionsID    : String(50);
        //modelsID : String(50);
        createdAt        : Timestamp;
        //modelType : Integer;//  @assert.range: [ 1, 2 ]; // 1 - MLR, 2 - HGBT
        modelType        : String(10);
        vcRulesList      : array of {
            profile      : String(50);
            override     : Boolean;
            Location     : String(4);
            Product      : String(40);
            GroupID      : String(20);
            Type         : ObjType default 'OD'; //OD - Object Dependency, Restriction
            modelVersion : ModelVersion default 'Active'@assert.range : [
                'Active',
                'Simulation'
            ]; // Active, Simulation
            //modelType : Integer;//  @assert.range: [ 1, 2 ]; // 1 - MLR, 2 - HGBT
            dimensions   : Integer;
        };
}


entity PalGenClusters {
    key clustersID            : String(50);
    createdAt            : Timestamp;
    Location             : String(4);
    Product              : String(40);
    clusterParameters : array of {
        groupId          : String(100);
        paramName        : String(100);
        intVal           : Integer;
        doubleVal        : Double;
        strVal           : String(100);
    };

    clusterType             : Integer                      @assert.range : [
        1,
        12
    ];

    clusterData       : array of {
        groupId          : String(100);
        ID               : String(100);
        att1             : String(10);
        att2             : String(10);
        att3             : String(10);
        att4             : String(10);
        att5             : String(10);
        att6             : String(10);
        att7             : String(10);
        att8             : String(10);
        att9             : String(10);
        att10            : String(10);
        att11            : String(10);
        att12            : String(10);
    };

}

entity OD_MODEL_VERSIONS {
    key LOCATION_ID   : String(4)    @title : 'Location ID';
    key PRODUCT_ID    : String(40)   @title : 'Product ID';
    key OBJ_DEP       : String(30)   @title : 'Object Dependency';
    key OBJ_COUNTER   : Integer      @title : 'Object Counter';
    key OBJ_TYPE      : String(2)    @title : 'Object Type';
        MODEL_TYPE    : String(10)   @title : 'PAL Model Type';
    key MODEL_VERSION : ModelVersion @title : 'Model Version - Active/Simulation';
        MODEL_PROFILE : String(50)   @title : 'PAL Model Profile';
}

entity PalGenPredictions {
    key predictionsID    : String(50);
        createdAt        : Timestamp;
        modelType        : String(10);
        vcRulesList      : array of {
            profile      : String(50);
            override     : Boolean;
            version      : String(10) default 'BASELINE'; // IBP Version
            scenario     : String(32) default 'BSL_SCENARIO'; // IBP Scenario
            Location     : String(4);
            Product      : String(40);
            GroupID      : String(20);
            Type         : ObjType default 'OD'; //OD - Object Dependency, Restriction
            modelVersion : ModelVersion default 'Active'@assert.range : [
                'Active',
                'Simulation'
            ]; // Active, Simulation
            dimensions   : Integer;
        };
}


entity PAL_PARAMETERS {
    key METHOD      : String(20)  @title : 'Method Name';
    key PARA_NAME   : String(30)  @title : 'Parameter Name';
        DATATYPE    : String(30)  @title : 'Data Type';
        DEFAULTVAL  : String(100) @title : 'Default Value';
        INTVAL      : Integer     @title : 'Integer';
        DOUBLEVAL   : Double      @title : 'Double';
        STRVAL      : String(50)  @title : 'String';
        DESCRIPTION : String(1000)@title : ' Description';
        DEPENDENCY  : String(1000)@title : ' Dependency';
}

entity TS_PREDICTIONS {
    key CAL_DATE         : Date      @title : 'Date';
    key LOCATION_ID      : String(4) @title : 'Location ID';
    key PRODUCT_ID       : String(40)@title : 'Product ID';
    key OBJ_TYPE         : String(2) @title : 'Object Type';
    key OBJ_DEP          : String(30)@title : 'Object Dependency';
    key OBJ_COUNTER      : Integer   @title : 'Object Counter';
    MODEL_TYPE       : String(10) @title : 'PAL Model Type';
    key MODEL_VERSION    : String(20) @title : 'OBJ Model Version'; 
    MODEL_PROFILE    : String(50) @title : 'PAL Model Profile';
    key VERSION          : String(10)    @title : 'Version';
    key SCENARIO         : String(32)    @title : 'Scenario';
    PREDICTED            : Double    @title : 'Predicted';
    PREDICTED_TIME       : Timestamp @title : 'Predicted Time';
    PREDICTED_STATUS     : String(8) @title : 'Predicted Status';
};

entity IBP_RESULTPLAN_TS {
    key CAL_DATE         : Date      @title : 'Date';
    key LOCATION_ID      : String(4) @title : 'Location ID';
    key PRODUCT_ID       : String(40)@title : 'Product ID';
    key OBJ_TYPE         : String(2) @title : 'Object Type';
    key OBJ_DEP          : String(30)@title : 'Object Dependency';
    key OBJ_COUNTER      : Integer   @title : 'Object Counter';
    MODEL_VERSION        : String(20) @title : 'OBJ Model Version'; 
    MODEL_PROFILE        : String(50) @title : 'PAL Model Profile';
    key VERSION          : String(10)    @title : 'Version';
    key SCENARIO         : String(32)    @title : 'Scenario';
    PREDICTED            : Decimal(13,2)    @title : 'Predicted';
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
    MODEL_TYPE       : String(10) @title : 'PAL Model Type';
    key MODEL_VERSION    : String(20) @title : 'OBJ Model Version'; 
    MODEL_PROFILE    : String(50) @title : 'PAL Model Profile';
    key VERSION     : String(10)    @title : 'Version';
    key SCENARIO    : String(32)    @title : 'Scenario';
    CHAR_COUNT      : Decimal(13,2)   @title : 'Character Count';
    CHAR_IMPACT_VAL     : Decimal(13,2)   @title : 'Character Impact Value';
    CHAR_IMPACT_PERCENT : Decimal(13,2)   @title : 'Character Impact Percent';
    PREDICTED_VAL     : Decimal(13,2)   @title : 'Predicted Value';
    PREDICTED_TIME       : Timestamp @title : 'Predicted Time';

};


entity CLUSTER_DATA {
    key LOCATION_ID : String(4) @title : 'Location ID';
    key PRODUCT_ID  : String(40)@title : 'Product ID';
    key UNIQUE_ID : String(50)@title : 'Unique ID';
    C1 : String (10) @title : 'CHAR1';
    C2 : String (10) @title : 'CHAR2'; 
    C3 : String (10) @title : 'CHAR3'; 
    C4 : String (10) @title : 'CHAR4'; 
    C5 : String (10) @title : 'CHAR5'; 
    C6 : String (10) @title : 'CHAR6';
    C7 : String (10) @title : 'CHAR7'; 
    C8 : String (10) @title : 'CHAR8'; 
    C9 : String (10) @title : 'CHAR9';
    C10 : String (10) @title : 'CHAR10'; 
    C11 : String (10) @title : 'CHAR11'; 
    C12 : String (10) @title : 'CHAR12';
};

entity AHC_COMBINE_PROCESS {
    key LOCATION_ID : String(4) @title : 'Location ID';
    key PRODUCT_ID  : String(40)@title : 'Product ID';
    key MODEL_PROFILE    : String(50) @title : 'PAL Model Profile';
    // key UNIQUE_ID : String(50)@title : 'Unique ID';
    key STAGE : Integer @title : 'Stage';
    key LEFT_ID : String(50)@title : 'Left Unique ID in Stage';
    key RIGHT_ID : String(50)@title : 'Right Unique ID in Stage';
    key DISTANCE : Double @title : 'Distance between two Combined Clusters'
};

entity AHC_RESULTS {
    key LOCATION_ID : String(4) @title : 'Location ID';
    key PRODUCT_ID  : String(40)@title : 'Product ID';
    key MODEL_PROFILE    : String(50) @title : 'PAL Model Profile';
    key UNIQUE_ID : String(50)@title : 'Unique ID';
    key CLUSTER_ID : Integer @title : 'Stage';
};


@cds.persistence.exists
entity![V_AHC_LEFT_CLUSTER]{
    key![LOCATION_ID]  : String(4) @title : 'LOCATION_ID';
    key![PRODUCT_ID]   : String(40) @title : 'PRODUCT_ID';
    key![PROFILE]      : String(50) @title : 'PROFILE';
    key![LEFT_ID_CLUSTER]    : Integer @title : 'LEFT_ID_CLUSTER';
    key![LEFT_ID]      : String(50) @title : 'LEFT_ID';
    key![RIGHT_ID]      : String(50) @title : 'RIGHT_ID';
    key![DISTANCE]      : Decimal(13,4) @title : 'DISTANCE';

}

@cds.persistence.exists
entity![V_AHC_CLUSTER_RESULTS]{
    key![LOCATION_ID]  : String(4) @title : 'LOCATION_ID';
    key![PRODUCT_ID]   : String(40) @title : 'PRODUCT_ID';
    key![PROFILE]      : String(50) @title : 'PROFILE';
    key![LEFT_ID_CLUSTER]    : Integer @title : 'LEFT_ID_CLUSTER';
    key![RIGHT_ID_CLUSTER]    : Integer @title : 'RIGHT_ID_CLUSTER';
    key![LEFT_ID]      : String(50) @title : 'LEFT_ID';
    key![RIGHT_ID]      : String(50) @title : 'RIGHT_ID';
    key![DISTANCE]      : Decimal(13,4) @title : 'DISTANCE';

}

@cds.persistence.exists
entity![V_CLUSTER_CHARS]{
    key![LOCATION_ID]      : String(4) @title : 'LOCATION_ID';
    key![PRODUCT_ID]    : String(40) @title : 'PRODUCT_ID';
    key![UNIQUE_ID]   : Integer @title : 'UNIQUE_ID';
    key![CHAR_NAME]    : String(30) @title : 'CHAR_NAME';
    key![CHAR_VALUE]   : String(70) @title : 'CHAR_VALUE';
    key![CHARVAL_NUM]   : String(70) @title : 'CHARVAL_NUM';
}

