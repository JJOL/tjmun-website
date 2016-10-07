// MUNProvider
var MUNProvider = function() {

  var _takenRecord = [];
  var _dbRecord = {};
Delate all

  /* getCountries(committee, country)
   * Returns a promise with the list of countries in a committee,
   it also gets a record of the countries and saves them in '_dbRecord.committee'
  */
  this.getCountries = function(committee) {
    var countriesRef = DB.to('countries')
                    .to(committee)
                    .build();

    return new Promise(function(resolve, reject){
      if(!_dbRecord[committee]) {

        DB.get(countriesRef)
        .then(function(snapshot) {
          snapshot.val()
          _dbRecord[committee] = vals;
          resolve(countries);
        }, function(err){
          reject(err);
        });
      } else {
        return _.map(_dbRecord[committee], function(item) {
          return {isTaken: this.isTaken(committee, co)}
        });
      }

    });

  }

  /* countryNotTaken(committee, country)
   * Checks whether a country is available or not available in a committee
  */
  this.countryNotTaken = function(committee, country) {
    if(has(_takenRecord, committee) && has(_takenRecord[committee], country)) {
      return false;
    }
    if(has(_dbRecord, committee) && has(_dbRecord[committee], country)) {
      if(_dbRecord[committee][country].isTaken) {
        return false;
      }
      else return true;
    }
    else return false;
  }

  /* trackCountry()
   * This tells the MUNProvider if a country has been taken by a delegate and saves
  */
  this.trackCountry = function() {

  }
}



// MUN Book
/*
  MUNBook
  - It's a Database Simulation. It checks if there is an error before sending
  a full registration to the real online database
*/
var MUNBook = function(){

  var RegisterProvider;
  var _manager, _delegates = [];

  /* canCompleteOperation()
    returns whether a full registration can already be done with the data
    previously provided.
  */
  this.canCompleteOperation = function() {
    return (_manager && _delegates.length > 0);
  }

  /* registerManager(manager)
    Registers a manager in the Book
    It returns an error if it exists;
  */
  this.registerManager = function (manager) {
    if(Manager.validate(manager)) {
      _manager = manager;
    } else {
      return false;
    }
  }
  /* registerDelegate(delegate)
    Registers a Delegate in the Book
    It returns an error if it exists;
  */
  this.registerDelegate = function (delegate) {
    if(!_manager) {
      return false;
    }
    if(!Delegate.validate(delegate)) {
      return false;
    }
    if(!RegisterProvider.countryNotTaken()) {
      return false;
    }
    delegates.push(delegate);
    //TODO trackCountry params
    RegisterProvider.trackCountry();
    return true;
  }

  /* save()
    It tries to save all the records in the Database
    Returns an error if it can't do it.
  */
  this.save = function() {
    if(!this.canCompleteOperation()) {
      return false;
    }
    var manRef = DB.to('managers').
                      to(_manager.fullName)
                      .build();
    DB.put(manRef, _manager)
    .then(function(){
      _.each(_delegates, registerDelegate);
    });

    function registerDelegate(delegate) {
      var delRef = DB.to('delegates')
                      .to(_manager.fullName)
                      .to(delegate.fullName)
                      .build();
      DB.put(delRef, delegate)
      .then(function() {
        var takenRef = DB.to('countries_taken')
                            .to(delegate.munCommittee)
                            .to(delegate.munCountry)
                            .build();
        return DB.put(takenRef, {
          delegate: delegate.fullName,
          manager: _manager.fullName
        });
      })
      .then(function() {
        var countriesRef = DB.to('countries')
                                .to(delegate.munCommittee)
                                .to(delegate.munCountry)
                                .to('taken')
                                .build();
        return DB.put(countriesRef, true);
      })
      .then(function() {
        console.log("Transaction Done!")
      })
    }
  }

};


var FormProvider, Book;




// MODELS

/* Manager
  Address Person Representation of one delegate or a group of delegates
*/
var Manager = Manager || {};
Manager.getNewEmpty = function() {
  return {
    fullName: '',    // Name of the Manager, in case of registering as student, use delegate's name
    schoolName: '',  // School Name of the Delegates/Manager
    countryName: '', // Country of the Delegates/Manager
    emailAddress: '' // E-mail of the Manager
  };
}

// This is for creating a simple version of the Vue Object
Manager.simplify = function (manager) {
  return {
    fullName: manager.fullName,
    schoolName: manager.schoolName,
    countryName: manager.countryName,
    emailAddress: manager.emailAddress
  }
}

// Checks if the fields are valid
Manager.validate = function(manager) {

}

var Delegate = Delegate || {};
Delegate.getNewEmpty = function() {
  return {
    fullName: '',    // Name of the Delegate
    age: 0,          // Age of the Delegate
    munCountry: '',  // MUN Country for the Delegate
    munCommittee: '' // MUN Committee for the Delegate
  };
}
// This is for creating a simple version of the Vue Object
Delegate.simplify = function (delegate) {
  return {
    fullName: delegate.fullName,
    age: delegate.age,
    munCountry: delegate.munCountry,
    munCommittee: delegate.munCommittee
  }
}

// Checks if the fields are valid
Delegate.validate = function(delegate) {

}



// View Model In Charge of the UI
var vmForm = new Vue({
  el: "#rform",

  data: {
    role: "",
    // Model
    Manager: {},
    CDelegate: {},
    Delegates: [],

    committeesToShow: [],
    countriesToShow: [],
    // State
    errors: [],
    loaded: false,
    failedLoading: false
  },
  computed: {

    finishedLoading: function() {},
    isLoading: function() { return !this.loaded; },
    itFailed: function() { return this.failedLoading; },
    errorPanel: function() {
      return this.failedLoading;
    },
    loadingPanel: function() {
      return !this.failedLoading && !this.loaded;
    },
    formPanel: function() {
      return this.loaded && !this.failedLoading;
    },
    isStudent: function(){
      return equalsInLowerCase(this.role, 'student');
    },
    isTeacher: function(){
      return equalsInLowerCase(this.role, 'teacher');
    },
    shouldFormDisplay: function() {},
    hasErrors: function() {}
  },

  methods: {
    clearManager: function() {
      this.Manager = {};
    },
    clearDelegates: function() {
      this.Delegates = [];
    },
    clearCurrentDelegate: function() {
      this.CDelegate = {};
    },
    removeDelegate: function(index) {
      var del = Delegates.splice(index, 1);
      untrackCountry(del);
    },
    addDelegate: function() {
      if(!FormProvider) {
        this.addError({msg: "ERROR: No Form Provider Existant! Send us an email..."});
        failedLoading = true;
      }
      if(!FormProvider.countryNotTaken(del)) {
        this.addError({msg: "Please Take Another Country!"})
        return;
      }
      if(!Delegate.validate(del)) {
        this.addError({msg: "Not Valid Delegate"});
        return;
      }

      FormProvider.trackCountry(del);
      Delegates.push(del);
      this.clearCurrentDelegate();
    },
    completeRegistrationAs: function(role) {
      var manager = Manager.simplify(this.Manager);
      if(this.role == "student") {
        manager.fullName = Delegates[0].fullName;
      }
      if(!Manager.validate(manager)) {
        this.addError({msg: "Invalid Manager!"});
        return;
      }
      if(!Book.registerManager(manager)) {
        this.addError({msg: "Unable To Register Manager!"});
        Book.reset();
        return;
      }
      var dels = [];
      _.each(Delegates, function(delegate) {
        dels.push(Delegate.simplify(delegate));
      });
      _.each(dels, function(delegate){
        if(!Book.registerDelegate(delegate)) {
          this.addError({msg: "Unable To Register Delegate: " + delegate.fullName});
          return;
        }
      });
      if(errors.length < 1) {
        Book.save();
        this.clearManager();
        this.clearCurrentDelegate();
        this.clearDelegates();
      }

    },

    addError: function(error) {
      this.errors.push(error);
    },

    clearErrors: function() {
      clearArr(this.errors);
    },

    showWindowError: function(error) {

    },

    turnOffElement: function(el) {
      this.el.querySelector(el).classList.add("--turned-off");
    },

    turnOnElement: function(el) {
      this.el.querySelector(el).classList.add("--turned-on");
    }
  }
});

vmForm.$watch('CDelegate.munCommittee', function(newVal, oldVal) {
  vmForm.turnOffElement('#countriesSelector');
  Provider.getCountries()
  .then(function(countries) {
    vmForm.countries = countries;
    vmForm.turnOnElement('#countriesSelector');
  })
  .catch(function(err){

  });
});
