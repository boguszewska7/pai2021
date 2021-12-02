app.controller("TransactionsHistoryCtrl", [
  "$http",
  "common",
  "$location",
  function ($http, common, $location) {
    let ctrl = this;
    let url = $location.path().split("/");
    ctrl.personId = url[2].substring(1);
    ctrl.person = {};
    ctrl.transactions = [];
    function getPerson() {
      $http.get("/person?_id=" + ctrl.personId).then(function (res) {
        ctrl.person.firstName = res.data.firstName;
        ctrl.person.lastName = res.data.lastName;
      });
    }
    function getTransactions() {
      $http
        .get("/transaction?recipientId=" + ctrl.personId)
        .then(function (res) {
          ctrl.transactions = res.data;
        });
      console.log(ctrl.transactions);
    }
    getPerson();
    getTransactions();
  },
]);
