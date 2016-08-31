// Connect to DB
var DB = DB || (function(onConnected, onError){

  // Init
  var config = {
     apiKey: "AIzaSyBOapotbW5snstEW87OkJQU9GVg2Y6Lo-4",
     authDomain: "tjmun-home.firebaseapp.com",
     databaseURL: "https://tjmun-home.firebaseio.com",
     storageBucket: "tjmun-home.appspot.com",
   };
  var database,
      isConnected = false;

  if (typeof firebase  === 'undefined') {
    onError("No Firebase Instance!");
    return;
  }

  firebase.initialize(config);
  database = firebase.database();

  testConnection();

  function testConnection() {
    var ref = to("init").to("test").build();
    put(ref, true)
    .then(function(good) {
      isConnected = true;
      onConnected();
    });

    setTimeout(function(){
      if(!isConnected)
        //TODO Throw Unable To Connect to DB error
        onError("Timeout Exception!");
    }, 6000);
  }



  function put(place, data) {
    return database.ref(place).set(data);
  }

  function get(place) {
    // Return Either Array/Obj/Value
    return database.ref(place).once('value');
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
})(APP.onDBConnected, APP.onDBError);
