app.controller('ContractsCtrl', [ '$http', 'common', function($http, common) {
    let ctrl = this
    
    ctrl.contractMake = {contractor: null, dateB: null, dateE: null }
    
    ctrl.contract = function() {
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
    }

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
}]);