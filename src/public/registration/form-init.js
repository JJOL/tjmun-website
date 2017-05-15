var parent = document.getElementById('google-form-container');
var gform = document.getElementById('gform');
function calculateFormSize() {
  var window_width = window.innerWidth;
  var window_height = window.innerHeight;


  var form_width = (window_width * 0.8) + 'px';  // Get the 80% of the window width
  var form_height = '600px';

  //parent.style.width = form_width;
  parent.style.height = form_height;

  //gform.style.width = form_width;
  gform.style.height = form_height;
}
setTimeout(function() {
  calculateFormSize();
}, 100);

window.onresize = function(e) {
  //calculateFormSize();
}


var schoolUserName = 'school',
    independentUserName = 'independent',
    nullUserName = 'unknown';

var vmApp = new Vue({
  el: '#register-form',
  data: {
    typeOfUser: nullUserName,
    independentHead: false,
    schoolHead: false
  },
  computed: {
    isSchoolForm: function() {
      return this.typeOfUser == schoolUserName;
    },
    isIndependentForm: function() {
      return this.typeOfUser == independentUserName;
    }
  },
  methods: {
    openSchoolForm: function() {
      var prevType = this.typeOfUser,
          newType = schoolUserName;
      this.typeOfUser = schoolUserName;
      this.updateView(prevType, newType);
    },
    openIndepententForm: function() {
      var prevType = this.typeOfUser,
          newType = independentUserName;
      this.typeOfUser = independentUserName;
      this.updateView(prevType, newType);
    },
    updateView: function(prevType, newType) {
      if (prevType == newType)
        return;

        this.schoolHead = this.independentHead = false;

      if(newType == schoolUserName) {
        this.schoolHead = true;
      }
      else if(newType == independentUserName) {
        this.independentHead = true;
      }

    },
    openDelegateForm: function() {
      this._hideAllForms();
      this.$el.querySelector('#form-opt-1').style.display = 'block';
    },
    openAdvisorForm: function() {
      this._hideAllForms();
      this.$el.querySelector('#form-opt-2').style.display = 'block';
    },
    _hideAllForms: function() {
      var forms = this.$el.querySelectorAll('.form-container');
      for(var i=0; i < forms.length; i++) {
        forms[i].style.display = 'none';
      }
    }
  }
});
