app.controller('adminController', ['$scope', '$location', function($scope, $location) {
    let token = readCookie("access_token");
    if (!token) {
        $location.path('home');
    }
    $scope.isActive = function(destination) {
        return destination === $location.path();
    }

}]);