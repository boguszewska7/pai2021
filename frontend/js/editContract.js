app.controller('EditContractCtrl', [ '$http','$uibModalInstance', 'options', function($http,$uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contractors = []
    ctrl.options.data.contractor = null


    $http.get('/contract?_id='+ ctrl.options.id).then(
        function(res) {
            ctrl.options.data = res.data;
            console.log( ctrl.options.data);
        },
        function(err) {
            lib.sendError(env.res, 400, "contract.get failed");
        }
    ) 
    
    $http.get('/contractor').then(
        function(res) {
            ctrl.contractors = res.data
            ctrl.options.data.contractor = ctrl.contractors[0]._id
        },
        function(err) {}
    ) 


    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

}])