var APP = APP || {};

APP.onDBError = function(error) {
  vmForm.failedLoading = true;
  vmForm.addError({
    msg: "We had problems loading the registration form. Please contact us by sending an email with the following error: 'Source: \"onDBError\" - '" + error + "'"
  });
}

APP.onDBConnected = function() {
  vmForm.loaded = true;
  FormProvider = new MUNProvider();
}
