app.controller('EditContractCtrl', [ '$http','$uibModalInstance', 'options', function($http,$uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contractors = []
    ctrl.options.data.contractor = null
    ctrl.options.data.dateB  = 0;
    ctrl.options.data.dateE  = 0;


     $http.get('/contractor').then(
        function(res) {
            ctrl.contractors = res.data
            ctrl.options.data.contractor = ctrl.contractors[0]._id
        },
        function(err) {}
    ) 
    $http.get('/contract?_id='+ ctrl.options.data._id).then(
        
        function(res) {
            ctrl.options.data = res.data
        },
        function(err) {
        }
    ) 
    
 

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

}])