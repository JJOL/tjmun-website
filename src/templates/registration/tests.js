var APP = APP || {};
APP.onDBConnected = function() {
  console.log("Database Is Connected!!");
}

APP.onDBError = function(err) {
  console.log(err);
}
