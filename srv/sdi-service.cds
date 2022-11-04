service SDIService @(impl : './lib/sdi-service.js') {    
    function ImportECCLocProdfn() returns String; 
    action ImportECCLoc();     
    action ImportECCProd();     
    action ImportECCCustGrp(); 
    action ImportECCBOM();     
    action ImportECCBomod();  
    action ImportECCLocProd(); 
    action ImportECCODhdr(); 
    // action ImportECCProdClass(); 
    action ImportECCClass(); 
    action ImportECCChar(); 
    action ImportECCCharval(); 
    action ImportECCSalesh(); 
    action ImportECCSaleshCfg();
    // action ImportECCAsmbcomp();
    action ImportCuvtabInd(); 
    action ImportCIRLog(); 
    // action ImportSOStock(); 
    // action ImportCuvtabValc();
}