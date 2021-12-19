app.controller('MakeContractCtrl', [ '$http', '$uibModalInstance', 'options', function($http, $uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contractors = []
    ctrl.options.data.contractor = null

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

    $http.get('/contractor').then(
        function(res) {
            ctrl.contractors = res.data
            ctrl.options.data.contractor = ctrl.contractors[0]._id
        },
        function(err) {}
    )    

}])