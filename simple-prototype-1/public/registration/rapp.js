// Utils
function equalsInLowerCase(val, expect) {
  return val.toLowerCase() == expect;
}

function getValidator(e_role) {
  return function() {
    return equalsInLowerCase(this.role, e_role);
  }
}

function set(dest, src) {
  Object.keys(src).forEach(function(key) {
    dest[key] = src[key];
  });
}

//Database
var config = {
   apiKey: "AIzaSyBOapotbW5snstEW87OkJQU9GVg2Y6Lo-4",
   authDomain: "tjmun-home.firebaseapp.com",
   databaseURL: "https://tjmun-home.firebaseio.com",
   storageBucket: "tjmun-home.appspot.com",
 };
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
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
    console.log(snapshot.val());
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
set(Manager, newManager());

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
    err: {
      exists: false,
      msg: ''
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
    DB.loadCommitteess();
  },
  methods: {
    addDelegate: function() {
      this.Delegates.push({
        fullName: this.c_delegate.fullName,
        age: this.c_delegate.age,
        munCountry: this.c_delegate.munCountry,
        munCommittee: this.c_delegate.munCommittee
      });
      this.clearCurrentDelegate();
    },
    removeDelegate: function(index) {
      this.Delegates.splice(index, 1);
    },
    completeRegistrationAs: function(role) {
      if(!this.canRegister)
        return;
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
      set(this.Manager, newManager());
    },
    clearAllDelegates: function() {
      this.Delegates.splice(0, this.Delegates.length);
    },
    clearCurrentDelegate: function() {
      set(this.c_delegate, newDelegate());
    },

    displayRegisterError: function(msg) {
      this.err.exists = true;
      this.err.msg = msg;
    }
  }
});
