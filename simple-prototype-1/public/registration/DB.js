// Connect to DB
var DB = DB || (function(onConnected, onError){

  var database;
  // Init
  firebase.initialize(config);
  database = firebase.database();

  put(to("init").to(Date.now()), "active")
  .then(function(good) {
    isConnected = true;
    onConnected();
  });

  setTimeout(function(){
    if(!isConnected)
      //TODO Throw Unable To Connect to DB error
      onError();
  }, 6000)

  function put(place, data) {
    return database.ref(place).set(data);
  }

  function get(place) {
    // Return Either Array/Obj/Value
    database.ref(place).once('value').then(function(snapshot){
      return {
        data: snapshot.val()
      };
    },function(err){
      return {
        error: {
          msg: 'Error while retrieving ',
          err: err
        }
      };
    });
  }

  function DBRef(node, par) {
    this.node = node;
    this.par = par;
  }
  DBRef.prototype.to = function (node) {
      return new DBRef(node, this);
  };
  DBRef.prototype.build = function (node) {
      var node = (node == undefined) ? this.node : this.node + '/' + node;
      if(this.par == undefined)
        return node;
      else
        return this.par.build(node);
  };
  function to(node) {
    return new DBRef(node);
  }

  // Interface
  return {
      put: put,
      get: get,
      to: to
  };
})(APP.onDBConnected, APP.onCrashError);
