//namespace my.timeseries;
context my.timeseries{
entity odTimeSeries {
  key objectDependency : String @title:'Object Dependency';
  key calDate : Date @title : 'Date';
  success: String(10) @title : 'Object Dep. Count';
  att1   : String(10) @title : 'Attribute 1';
  att2   : String(10) @title : 'Attribute 2';
  att3   : String(10) @title : 'Attribute 3';
  att4   : String(10) @title : 'Attribute 4';
  att5   : String(10) @title : 'Attribute 5';
  att6   : String(10) @title : 'Attribute 6';
  att7   : String(10) @title : 'Attribute 7';
  att8   : String(10) @title : 'Attribute 8';
  att9   : String(10) @title : 'Attribute 9';
  att10  : String(10) @title : 'Attribute 10';
  att11  : String(10) @title : 'Attribute 11';
  att12  : String(10) @title : 'Attribute 12';
}
}

@cds.persistence.exists 
@cds.persistence.calcview
Entity ![V_TIMESERIES] {
key     ![DATE]: Date  @title: 'Date' ; 
key     ![OBJECTDEPENDENCY]: String(15)  @title: 'obj. Dependency' ; 
key     ![SUCESS]: String(10)  @title: 'Obj. Dependency Count' ; 
key     ![ATTRIBUTE1]: String(10)  @title: 'Attribute1' ; 
key     ![ATTRIBUTE2]: String(10)  @title: 'Attribute2' ; 
key     ![ATTRIBUTE3]: String(10)  @title: 'Attribute3' ; 
key     ![ATTRIBUTE4]: String(10)  @title: 'Attribute4' ; 
key     ![ATTRIBUTE5]: String(10)  @title: 'Attribute5' ; 
key     ![ATTRIBUTE6]: String(10)  @title: 'Attribute6' ; 
key     ![ATTRIBUTE7]: String(10)  @title: 'Attribute7' ; 
key     ![ATTRIBUTE8]: String(10)  @title: 'Attribute8' ; 
key     ![ATTRIBUTE9]: String(10)  @title: 'Attribute9' ; 
key     ![ATTRIBUTE10]: String(10)  @title: 'Attribute10' ; 
key     ![ATTRIBUTE11]: String(10)  @title: 'Attribute11' ; 
key     ![ATTRIBUTE12]: String(10)  @title: 'Attribute12' ; 
key     ![RANK]: Double  @title: 'Rank' ; 
};

@cds.persistence.exists 
@cds.persistence.calcview
Entity ![V_PRODUCT] {
key     ![PRODUCTID]: String(40)  @title: 'ProductId' ; 
key     ![PRODUCTDESC]: String(40)  @title: 'Product Desc' ; 
key     ![PRODUCTFAMILY]: String(40)  @title: 'Product Family' ; 
key     ![PRODUCTGROUP]: String(20)  @title: 'Product Group' ; 
key     ![PRODUCTMODEL]: String(20)  @title: 'Product Model' ; 
key     ![PRODMDLRANGE]: String(20)  @title: 'Product Model Range' ; 
key     ![PRODUCTSERIES]: String(20)  @title: 'Product Series' ; 
key     ![RESERVEFIELD1]: String(20)  @title: 'Reserve Field1' ; 
key     ![RESERVEFIELD2]: String(20)  @title: 'Reserve Field2' ; 
key     ![RESERVEFIELD3]: String(20)  @title: 'Reserve Field3' ; 
key     ![RESERVEFIELD4]: String(20)  @title: 'Reserve Field4' ; 
key     ![RESERVEFIELD5]: String(20)  @title: 'Reserve Field5' ; 
key     ![CHANGEDDATE]: Date  @title: 'Changed Date' ; 
key     ![CHANGEDBY]: String(12)  @title: 'Changed By' ; 
key     ![CREATEDDATE]: Date  @title: 'Created Date' ; 
key     ![CREATEDBY]: String(12)  @title: 'Created By' ; 
key     ![CHANGEDTIME]: Time  @title: 'Changed Time' ; 
key     ![CREATEDTIME]: Time  @title: 'CreatedTime' ; 
key     ![RANK]: Double  @title: 'Rank' ; 
}
