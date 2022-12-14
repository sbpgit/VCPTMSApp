using JobsService as service from '../../srv/Jobs-Service';
annotate service.getJobStatus with {
  JOB_ID @Common : {
        // Text            : LOCATION_ID_LOCATION_ID,
        // TextArrangement : #TextOnly,
        // //insert your value list here 
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Jobs',
            CollectionPath : 'jobs',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : JOB_ID,
                ValueListProperty : 'JOB_ID'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'JOB_NAME'
            }
            ]
        }   
    }; 
    RUN_STATUS @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Run Status',
            CollectionPath : 'getJobRunStatus',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : RUN_STATUS,
                ValueListProperty : 'RUN_STATUS'
            }
            ]
        }   
    };
    RUN_STATE @Common : {
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'RUN_STATE',
            CollectionPath : 'getJobRunState',
            Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : RUN_STATE,
                ValueListProperty : 'RUN_STATE'
            }
            ]
        }   
    };
}