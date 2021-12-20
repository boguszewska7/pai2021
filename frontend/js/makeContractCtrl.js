app.controller('MakeContractCtrl', [ '$http', '$uibModalInstance', 'options', function($http, $uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contractors = []

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

    $http.get('/contractor').then(
        function(res) {
            ctrl.contractors = res.data
        },
        function(err) {
            console.log("hujmakecontract")
        }
    )    
}])