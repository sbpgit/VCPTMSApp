context cp_ds {
    type objectDep {
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        OBJ_DEP     : String(30);
        OBJ_COUNTER : Integer;
    }

    type locProd {
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        PROD_DESC   : String(40);
    }
    type prodVerScen {
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        VERSION     : String(10);
        SCENARIO    : String(32);
    }

    type odprofiles {
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        COMPONENT   : String(40);
        PROFILE     : String(50);
        OBJ_DEP     : String(30);
        OBJDEP_DESC : String(30);
        STRUC_NODE  : String(50);
    }

    type compreq {
        // CAL_DATE    : Date;
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        ITEM_NUM    : String(5);
        // ASSEMBLY    : String(40);
        COMPONENT   : String(40);
        VERSION     : String(10);
        SCENARIO    : String(32);
        STRUC_NODE  : String(50);
        QTYTYPE     : String(50);
        WEEK1       : Integer;
        WEEK2       : Integer;
        WEEK3       : Integer;
        WEEK4       : Integer;
        WEEK5       : Integer;
        WEEK6       : Integer;
        WEEK7       : Integer;
        WEEK8       : Integer;
        WEEK9       : Integer;
        WEEK10      : Integer;
        WEEK11      : Integer;
        WEEK12      : Integer;
        WEEK13      : Integer;
        WEEK14      : Integer;
        WEEK15      : Integer;
        WEEK16      : Integer;
        WEEK17      : Integer;
        WEEK18      : Integer;
        WEEK19      : Integer;
        WEEK20      : Integer;
        WEEK21      : Integer;
        WEEK22      : Integer;
        WEEK23      : Integer;
        WEEK24      : Integer;
        WEEK25      : Integer;
        WEEK26      : Integer;
        WEEK27      : Integer;
        WEEK28      : Integer;
        WEEK29      : Integer;
        WEEK30      : Integer;
        WEEK31      : Integer;
        WEEK32      : Integer;
        WEEK33      : Integer;
        WEEK34      : Integer;
        WEEK35      : Integer;
        WEEK36      : Integer;
        WEEK37      : Integer;
        WEEK38      : Integer;
        WEEK39      : Integer;
        WEEK40      : Integer;
        WEEK41      : Integer;
        WEEK42      : Integer;
        WEEK43      : Integer;
        WEEK44      : Integer;
        WEEK45      : Integer;
        WEEK46      : Integer;
        WEEK47      : Integer;
        WEEK48      : Integer;
        WEEK49      : Integer;
        WEEK50      : Integer;
        WEEK51      : Integer;
        WEEK52      : Integer;
        WEEK53      : Integer;
        WEEK54      : Integer;
        WEEK55      : Integer;
        WEEK56      : Integer;
        WEEK57      : Integer;
        WEEK58      : Integer;
        WEEK59      : Integer;
        WEEK60      : Integer;
        WEEK61      : Integer;
        WEEK62      : Integer;
        WEEK63      : Integer;
        WEEK64      : Integer;
        WEEK65      : Integer;
        WEEK66      : Integer;
        WEEK67      : Integer;
        WEEK68      : Integer;
        WEEK69      : Integer;
        WEEK70      : Integer;
        WEEK71      : Integer;
        WEEK72      : Integer;
        WEEK73      : Integer;
        WEEK74      : Integer;
        WEEK75      : Integer;
        WEEK76      : Integer;
        WEEK77      : Integer;
        WEEK78      : Integer;
        WEEK79      : Integer;
        WEEK80      : Integer;
        WEEK81      : Integer;
        WEEK82      : Integer;
        WEEK83      : Integer;
        WEEK84      : Integer;
        WEEK85      : Integer;
        WEEK86      : Integer;
        WEEK87      : Integer;
        WEEK88      : Integer;
        WEEK89      : Integer;
        WEEK90      : Integer;
        WEEK91      : Integer;
        WEEK92      : Integer;
        WEEK93      : Integer;
        WEEK94      : Integer;
        WEEK95      : Integer;
        WEEK96      : Integer;
        WEEK97      : Integer;
        WEEK98      : Integer;
        WEEK99      : Integer;
        WEEK100     : Integer;
        WEEK101     : Integer;
        WEEK102     : Integer;
        WEEK103     : Integer;
        WEEK104     : Integer;
        WEEK105     : Integer;
        WEEK106     : Integer;
        WEEK107     : Integer;
        WEEK108     : Integer;
        WEEK109     : Integer;
        WEEK110     : Integer;
        WEEK111     : Integer;
        WEEK112     : Integer;
        WEEK113     : Integer;
        WEEK114     : Integer;
        WEEK115     : Integer;
        WEEK116     : Integer;
        WEEK117     : Integer;
        WEEK118     : Integer;
        WEEK119     : Integer;
        WEEK120     : Integer;
        WEEK121     : Integer;
        WEEK122     : Integer;
        WEEK123     : Integer;
        WEEK124     : Integer;
        WEEK125     : Integer;
        WEEK126     : Integer;
        WEEK127     : Integer;
        WEEK128     : Integer;
        WEEK129     : Integer;
        WEEK130     : Integer;
        WEEK131     : Integer;
        WEEK132     : Integer;
        WEEK133     : Integer;
        WEEK134     : Integer;
        WEEK135     : Integer;
        WEEK136     : Integer;
        WEEK137     : Integer;
        WEEK138     : Integer;
        WEEK139     : Integer;
        WEEK140     : Integer;
        WEEK141     : Integer;
        WEEK142     : Integer;
        WEEK143     : Integer;
        WEEK144     : Integer;
        WEEK145     : Integer;
        WEEK146     : Integer;
        WEEK147     : Integer;
        WEEK148     : Integer;
        WEEK149     : Integer;
        WEEK150     : Integer;
        WEEK151     : Integer;
        WEEK152     : Integer;
        WEEK153     : Integer;
        WEEK154     : Integer;
        WEEK155     : Integer;
        WEEK156     : Integer;


    }

    type cirWkly {
        // CAL_DATE    : Date;
        LOCATION_ID : String(4);
        PRODUCT_ID  : String(40);
        // ASSEMBLY    : String(40);
        UNIQUE_ID   : Integer;
        UNIQUE_DESC : String(50);
        VERSION     : String(10);
        SCENARIO    : String(32);
        // STRUC_NODE  : String(50);
        // QTYTYPE    : String(50);
        WEEK1       : Integer;
        WEEK2       : Integer;
        WEEK3       : Integer;
        WEEK4       : Integer;
        WEEK5       : Integer;
        WEEK6       : Integer;
        WEEK7       : Integer;
        WEEK8       : Integer;
        WEEK9       : Integer;
        WEEK10      : Integer;
        WEEK11      : Integer;
        WEEK12      : Integer;
        WEEK13      : Integer;
        WEEK14      : Integer;
        WEEK15      : Integer;
        WEEK16      : Integer;
        WEEK17      : Integer;
        WEEK18      : Integer;
        WEEK19      : Integer;
        WEEK20      : Integer;
        WEEK21      : Integer;
        WEEK22      : Integer;
        WEEK23      : Integer;
        WEEK24      : Integer;
        WEEK25      : Integer;
        WEEK26      : Integer;
        WEEK27      : Integer;
        WEEK28      : Integer;
        WEEK29      : Integer;
        WEEK30      : Integer;
        WEEK31      : Integer;
        WEEK32      : Integer;
        WEEK33      : Integer;
        WEEK34      : Integer;
        WEEK35      : Integer;
        WEEK36      : Integer;
        WEEK37      : Integer;
        WEEK38      : Integer;
        WEEK39      : Integer;
        WEEK40      : Integer;
        WEEK41      : Integer;
        WEEK42      : Integer;
        WEEK43      : Integer;
        WEEK44      : Integer;
        WEEK45      : Integer;
        WEEK46      : Integer;
        WEEK47      : Integer;
        WEEK48      : Integer;
        WEEK49      : Integer;
        WEEK50      : Integer;
        WEEK51      : Integer;
        WEEK52      : Integer;
        WEEK53      : Integer;
        WEEK54      : Integer;
        WEEK55      : Integer;
        WEEK56      : Integer;
        WEEK57      : Integer;
        WEEK58      : Integer;
        WEEK59      : Integer;
        WEEK60      : Integer;
        WEEK61      : Integer;
        WEEK62      : Integer;
        WEEK63      : Integer;
        WEEK64      : Integer;
        WEEK65      : Integer;
        WEEK66      : Integer;
        WEEK67      : Integer;
        WEEK68      : Integer;
        WEEK69      : Integer;
        WEEK70      : Integer;
        WEEK71      : Integer;
        WEEK72      : Integer;
        WEEK73      : Integer;
        WEEK74      : Integer;
        WEEK75      : Integer;
        WEEK76      : Integer;
        WEEK77      : Integer;
        WEEK78      : Integer;
        WEEK79      : Integer;
        WEEK80      : Integer;
        WEEK81      : Integer;
        WEEK82      : Integer;
        WEEK83      : Integer;
        WEEK84      : Integer;
        WEEK85      : Integer;
        WEEK86      : Integer;
        WEEK87      : Integer;
        WEEK88      : Integer;
        WEEK89      : Integer;
        WEEK90      : Integer;
        WEEK91      : Integer;
        WEEK92      : Integer;
        WEEK93      : Integer;
        WEEK94      : Integer;
        WEEK95      : Integer;
        WEEK96      : Integer;
        WEEK97      : Integer;
        WEEK98      : Integer;
        WEEK99      : Integer;
        WEEK100     : Integer;
        WEEK101     : Integer;
        WEEK102     : Integer;
        WEEK103     : Integer;
        WEEK104     : Integer;
        WEEK105     : Integer;
        WEEK106     : Integer;
        WEEK107     : Integer;
        WEEK108     : Integer;
        WEEK109     : Integer;
        WEEK110     : Integer;
        WEEK111     : Integer;
        WEEK112     : Integer;
        WEEK113     : Integer;
        WEEK114     : Integer;
        WEEK115     : Integer;
        WEEK116     : Integer;
        WEEK117     : Integer;
        WEEK118     : Integer;
        WEEK119     : Integer;
        WEEK120     : Integer;
        WEEK121     : Integer;
        WEEK122     : Integer;
        WEEK123     : Integer;
        WEEK124     : Integer;
        WEEK125     : Integer;
        WEEK126     : Integer;
        WEEK127     : Integer;
        WEEK128     : Integer;
        WEEK129     : Integer;
        WEEK130     : Integer;
        WEEK131     : Integer;
        WEEK132     : Integer;
        WEEK133     : Integer;
        WEEK134     : Integer;
        WEEK135     : Integer;
        WEEK136     : Integer;
        WEEK137     : Integer;
        WEEK138     : Integer;
        WEEK139     : Integer;
        WEEK140     : Integer;
        WEEK141     : Integer;
        WEEK142     : Integer;
        WEEK143     : Integer;
        WEEK144     : Integer;
        WEEK145     : Integer;
        WEEK146     : Integer;
        WEEK147     : Integer;
        WEEK148     : Integer;
        WEEK149     : Integer;
        WEEK150     : Integer;
        WEEK151     : Integer;
        WEEK152     : Integer;
        WEEK153     : Integer;
        WEEK154     : Integer;
        WEEK155     : Integer;
        WEEK156     : Integer;

    }

    type uniqueCharItems {
        UNIQUE_ID     : Integer;
        LOCATION_ID   : String(4);
        PRODUCT_ID    : String(40);
        CHAR_NUM      : String(30);
        CHARVAL_NUM   : String(70);
        UID_CHAR_RATE : Decimal(13, 2);
    }

    type uniqueIDChars {
        UniqId : Integer;
        Charc  : String(30);
        Value  : String(70);
    }

    type uniqueIDQtyChars {
        Werks        : String(4);
        Mantnr       : String(40);
        UniqId       : Integer;
        Datum        : DateTime;
        Quantity     : Decimal(13, 3);
        HeaderConfig : array of uniqueIDChars;
    }

}
