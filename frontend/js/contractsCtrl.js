app.controller('ContractsCtrl', [ '$http', 'common', function($http, common) {
    let ctrl = this

    ctrl.contractMake = {};

    ctrl.contractsHistory = [];
    ctrl.refreshData = function () {
        $http
        .get("/contract")
          .then(
            function (res) {
              ctrl.contractsHistory = res.data;
            },
            function (err) {}
          );
    };

    ctrl.refreshData();

    ctrl.contract = function() {
      Object.assign(
        ctrl.contractMake
      );
        let options = { 
            title: 'Dane umowy',
            ok: true,
            cancel: true,
            data: ctrl.contractMake
        }
        common.dialog('makeContract.html', 'MakeContractCtrl', options, function(answer) {
            if(answer == 'ok') {
                $http.post('/contract', ctrl.contractMake).then(
                    function(res) {
                        $http.get('/contractor?_id=' + ctrl.contractMake.contractor).then(
                            function(res) {
                                common.alert.show('Umowa z ' + res.data.firstName + ' ' + res.data.lastName)
                                ctrl.refreshData();
                            },
                            function(err) {}
                        )
                    },
                    function(err) {
                        common.alert.show('Umowa nieudana', 'alert-danger')
                    }
                )
            }
        })
    };

    ctrl.contractChange= {
      contractor: null, 
      dateB: null, 
      dateE: null, 
      salary:0
   }
    ctrl.editContract = function(index){
      let options = {
      title: "Edytuj dane",
      ok: true,
      cancel: true,
      data: ctrl.contractChange,
      id: index
    }

    common.dialog(
      "editContract.html",
      "EditContractCtrl",
      options,
      function (answer) {
         if(answer =="ok"){
           console.log(ctrl.contractChange)
              $http.put("/contract", ctrl.contractChange).then(
                function (res) {
                  ctrl.contractsHistory = res.data;
                  common.alert.show("Dane zmienione");
                },
                function (err) {
                }
              );
            }
          } 
     )};

          


},
]);