(function() {


class CommitteeController {
  constructor() {
      this.committees = new Array();
      var fireConfig = {
        apiKey: '',
        databaseUrl: '',
        auth: ''
        // ETC
      };
      this.firebaseApp = FirebaseApp.initialize(fireConfig);
      this.firebase
  }


}


new CommitteeController();



})();
