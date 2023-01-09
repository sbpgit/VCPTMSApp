

service JobScheduler @(impl : './lib/job-scheduler.js') {

action   preDefinedHistory(LocProdData : String);

action   preDefinedFuture(LocProdData : String);

}