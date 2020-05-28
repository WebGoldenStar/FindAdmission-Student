app.controller('dashboardController', ['$scope', '$location', function($scope, $location) {
    let token = readCookie("access_token");
    if (!token) {
        $location.path('home');
    }
    let user = {};
    user.fname = readCookie("fname");
    user.lname = readCookie("lname");
    $scope.user = user;
    $scope.introduction = true;
    $scope.open_introduction = function() {

        $scope.introduction = !$scope.introduction;
    }

}]);