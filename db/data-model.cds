namespace my.timeseries;

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