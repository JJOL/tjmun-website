var APP = APP || {};

(function(exports){
  var Provider = exports.Provider = function(DB, onLoaded) {
    this._dbRecord = {};
    this._committees = [];
    this._takenRecord = {};
    DB.get(DB.to('countries'))
    .then(function(snapshot) {
      committees = Object.keys(snapshot);
      onLoaded();
    }, function(err) {
      //TODO Handle Not Loaded Erro
    });
  }
  Provider.prototype.checkCountryTaken = function(committee, country) {
    if(has(this._takenRecord, committee) && has(this._takenRecord[committee], country)) {
      //TODO Country Already Taken
    }
    if(has(this._dbRecord, committee) && has(this._dbRecord, country)) {
      if(this._dbRecord[committee][country].isTaken) {
        //TODO Country Already Taken
      } else {
        //TODO Country Not Taken! Return Success
      }
    } else {
      //TODO Crash Report Country Not FOUND!
    }
  }
  Provider.prototype.takeCountryOfDelegate = function(delegate) {
    this._takenRecord[delegate.munCommittee][delegate.munCountry] = { taker: delegate.fullName };
  }
  Provider.prototype.un = function(delegate) {
    this._takenRecord[delegate.munCommittee][delegate.munCountry] = null;
  }

})(APP);




var CommitteeProvider = (function() {

  var committees = Object.keys(DB.get(DB.to('countries')));

  function getCommittees() {
    return committees;
  }

  function getCountries(committee) {
    return DB.get(DB.to('countries').to(committee));
  }

  function takeCountry(committee, country) {

  }

  return {
      getCommittees: getCommittees,
      getCountries: getCountries
  };
})();

var Book = (function(){

  var registeredManager = null;

  function registerDelegate(delegate) {
    if(!registerManager)
      return result(false, "There is not a Valid Manager Registered!");
    var result = verifyDelegate(delegate);
    if(!result.ok())
      return result;

    regDelegates.push(delegate);
  }

  function save() {
    if(errors) {
      reset();
      return result(false, "An Error Occured!");
    }
    if(regDelegates.length < 1) {
      reset();
      return result(false, "You don't have any Delegate Registered!");
    }

    DB.put(DB.to('managers').to(manager.fullName), manager);
    _.each(regDelegates, function(delegate) {
      DB.put(DB.to('delegates').to(manager.fullName).to(delegate.name), delegate);
      DB.put(DB.to('countries_taken').to(delegate.munCommittee).to(delegate.munCountry), {delegate: delegate.fullName, manager: manager.fullName});
      DB.put(DB.to('countries').to(delegate.munCommittee).to(delegate.munCountry), false);
    });

  }
  function reset() {
    clearArr(regDelegates);
    registeredManager = null;
  }

  return {
    track: track,
    untrack: untrack,
    verifyManager: verifyManager
    verifyDelegate: verifyDelegate
    registerManager: registerManager
    registerDelegate: registerDelegate
    save: save,
    reset: reset
  };
})();
/* App
- initDatabaseConnection
- loadModels - and changes
- loadVM and displayInit

*/

/* DB
  register manager, delegates, updateCountry
  loadService committees / countries status
*/

/* Services
  register(manager, delegates)
  checkup()
*/

/* Models
  delegates[]
  Delegates.add()
  clear()

  manager{}
*/
/* VM

*/

var App = App || {};
App.init = function() {
  this.loadDatabase();
  this.loadModels();
  this.createVM();
}

App.loadDatabase = function() {
  var config = {
     apiKey: "AIzaSyBOapotbW5snstEW87OkJQU9GVg2Y6Lo-4",
     authDomain: "tjmun-home.firebaseapp.com",
     databaseURL: "https://tjmun-home.firebaseio.com",
     storageBucket: "tjmun-home.appspot.com",
   };
   //Database
   firebase.initializeApp(config);
   // Get a reference to the database service
   this.database = firebase.database();
   //TODO Check for Errors and conections and Save If Any!
}

App.loadModels = function() {
  this.DelegatesManager = {
    getPrototype: function() {
      return {
        fullName: '',
        age: undefined,
        munCountry: '',
        munCommittee: ''
      };
    }
  }

  this.ManagerManager = {
    getPrototype: function() {
      return {
        fullName: '',
        schoolName: '',
        countryName: '',
        emailAddress: '',
        delegates: []
      };
    }
  }
}

App.init();




var RegisterService = {
    register: function(manager, delegates) {
      database.ref('managers/'+manager.fullName)
      .set(manager)
      .then(() => {
        delegates.forEach(this.registerDelegates(manager));
      });

    },
    registerDelegates: function(manager) {
      return function(delegate) {
        this.registerDelegate(manager, delegate);
      }.bind(this);
    },
    registerDelegate: function(manager, delegate) {
      var reference = 'delegates/'+manager.fullName+'/';
      database.ref(reference+delegate.fullName)
      .set(delegate)

      .then(function(){
        // Create Writeable Defenition For Country''
        return database.ref('countries_taken/' + delegate.munCommittee + '/' + delegate.munCountry).set({
          manager: manager.fullName,
          delegate: delegate.fullName
        });
      }, function(error) {
        // ERROR When Registering Delegate
        console.log('Couldnt Register the Delegate ' + delegate.fullName)
        vmRApp.displayRegisterError('There was an error while registering!');
      })

      .then(function() {
        // Define False the country
        return database.ref('countries/' + delegate.munCommittee + '/' + delegate.munCountry).set(false);
      }, function() {
        // Error While Registering The Taken Country
        console.log('Couldnt set country ' + delegate.munCountry + ' writable');
        vmRApp.displayRegisterError('There was an error while registering!');
      })

      .then(function(){
        // All Completed!!!
      }, function(){
        // Error While Setting The Flag Variable
        console.log('Failed to Set Country False ' + delegate.munCountry);
        vmRApp.displayRegisterError('There was an error while registering!');
      })
      .catch(function(err) {
        vmRApp.displayRegisterError('There was an error while registering!');
      });

    }
};
var DB = {};
DB.loadCommitteess = function() {
  database.ref('countries').once('value').then(function(snapshot) {
    return Object.keys(snapshot.val());
  });
}

DB.loadCountries = function(comm) {
  database.ref('countries/'+comm).once('value').then(function(snapshot) {
    return snapshot.val();
  });
}

// Model

function newManager() {
  return {
    fullName: '',
    schoolName: '',
    countryName: '',
    emailAddress: '',
    delegates: []
  };
}
function newDelegate() {
  return {
    fullName: '',
    age: undefined,
    munCountry: '',
    munCommittee: ''
  };
}

var Manager = {};
setObj(Manager, newManager());

var Delegates = [

]

function getSimpleManager(manager) {
  return {
    fullName: manager.fullName,
    schoolName: manager.schoolName,
    countryName: manager.countryName,
    emailAddress: manager.emailAddress,
    delegates: []
  }
}

function getSimpleDelegate(delegate) {
  return {
    fullName: delegate.fullName,
    age: delegate.age,
    munCountry: delegate.munCountry,
    munCommittee: delegate.munCommittee
  }
}

// Services

function getTeacherManager(manager, delegates) {
  return _.extendOwn({
    delegates: _.map(delegates, function(item){ return item.fullName; })
  }, manager);
}

function getStudentManager(manager, delegates) {
  return _.extendOwn(getTeacherManager(manager, delegates),
                      {fullName: delegates[0].fullName}
                    );
}

function printManager(manager) {
  console.log('Manager: {\n'
              + 'fullName: ' + manager.fullName + '\n'
              + 'countryName: ' + manager.countryName + '\n'
              + 'schoolName: ' + manager.schoolName + '\n'
              + 'emailAddress: ' + manager.emailAddress);
}

function printDelegate(delegate) {
  console.log('Delegate: {\n'
              + 'fullName: ' + delegate.fullName + '\n'
              + 'age: ' + delegate.age + '\n'
              + 'munCountry: ' + delegate.munCountry + '\n'
              + 'munCommittee: ' + delegate.munCommittee);
}

function registerManager(manager, delegates) {
  RegisterService.register(getTeacherManager(manager, delegates), delegates);
  Book.registerManager(getTeacherManager(manager, delegates));
  _.each(delegates, function(delegate) {
    var sdel = getSimpleDelegate(delegate);
    Book.registerDelegate(sdel);
  });

  var result = Book.save();
  if(result.ok()) {
    alert("Operation Completed Successfully");
  } else {
    vmRApp.displayRegisterError(result.getError().msg);
  }

}
function registerStudent(manager, delegates) {
  RegisterService.register(getStudentManager(manager, delegates), delegates);
}

// ViewModel

var vmRApp = new Vue({
  el: '#rapp',
  data: {
    role: "",
    Manager: Manager,
    Delegates: Delegates,
    c_delegate: newDelegate(),
    committees: [],
    countries: {}
    err: {
      exists: false,
      list: []
    }
  },
  computed: {
    isStudent: function() {
      return equalsInLowerCase(this.role, "student");
    },
    isTeacher: function() {
      return equalsInLowerCase(this.role, "teacher");
    },
    formIsDisplayed: function() {
      return this.isStudent || this.isTeacher;
    },
    countries: function(committee) {
      getCountries();
    },
    canRegister: function() {
      // validate Manager
      if(this.Manager.fullName != '')
        return true;
      else return false;
      // validate Delegates
    },
    hasError: function() {
      return this.err.exists;
    }
  },
  ready: function() {
    var comms = DB.loadCommitteess();
    setArr(committees, comms);
  },
  methods: {
    wipeErrorsBefore: function(func) {
      this.clearErrors();
      return func();
    },
    addDelegate: function() {
      this.wipeErrorsBefore();
      var sdel = getSimpleDelegate(this.c_delegate);
      var result = Book.verifyDelegate(sdel);
      if(result.ok()) {
        Book.track(sdel);
        this.Delegates.push(getSimpleDelegate(this.c_delegate));
        this.clearCurrentDelegate();
      } else {
        this.displayRegisterError(result.getError.msg);
      }

    },
    removeDelegate: function(index) {
      var sdel = this.Delegates.splice(index, 1)[0];
      Book.untrack(getSimpleDelegate(sdel));
    },
    completeRegistrationAs: function(role) {
      if(!this.canRegister)
        return;
      this.wipeErrorsBefore();
      var manager = getSimpleManager(Manager);
      if(equalsInLowerCase(role, "teacher")) {
          var delegates = _.map(Delegates, getSimpleDelegate);
          registerManager(manager, delegates);
      } else {
        this.addDelegate();
        var delegates = _.map(Delegates, getSimpleDelegate);
        registerStudent(manager, delegates);
      }
      this.clearManager();
      this.clearAllDelegates();
      this.clearCurrentDelegate();
    },
    clearManager: function() {
      setObj(this.Manager, newManager());
    },
    clearAllDelegates: function() {
      clearArr(this.Delegates)
    },
    clearCurrentDelegate: function() {
      setObj(this.c_delegate, newDelegate());
    },

    displayRegisterError: function(errors) {
      this.err.exists = true;
      this.err.list.push({msg: msg});
    },

    clearErrors: function() {
      clearArr(this.err.list);
    }
  }
});
