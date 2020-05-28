'use strict';
app.controller('registerController', ["$scope", "$http", "$location", "$interval", "$routeParams", "$q", function($scope, $http, $location, $timeout, $routeParams, $q) {
    $scope.countrylist = [];
    $scope.countryids = [];
    $scope.dialingcodes = [];
    $scope.monthlist = [];
    $scope.yearlist = [];
    $scope.daylist = [];

    // $scope.wadialingcode = "";
    // $scope.waphonenum = "";
    // console.log(WSURL + 'partnerapi/api/type/login/page/appcheck');
    $scope.checkapp = function() {
        $http.post(WSURL + 'partnerapi/api/type/login/page/appcheck').then(function(response) {
            $scope.monthlist = response.month;
            $scope.yearlist = response.year;
            $scope.daylist = response.day;
            // console.log(response);
            $scope.countrylist = response.data.country;
            $scope.countryids = response.countryids;
            $scope.dialingcodes = response.dialingcodes;
            $scope.uniquecode = response.uniquecode;

        });
    }
    $scope.checkapp();
    $scope.cpywap = function() {
        $scope.wadialingcode = $scope.dialingcode;
        $scope.waphone = $scope.phonenum;
    }
    $scope.scorePassword = function(pass) {
        var score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        var letters = new Object();
        for (var i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up
        var variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }

        var variationCount = 0;
        for (var check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score);
    }
    $scope.signup = function() {
        $scope.showsignuperr = false;

        if ($scope.signuptype == "parent") {
            if ($scope.yourname == "" && !$scope.showsignuperr) {
                $scope.showsignuperr = true;
                $scope.showsignuperrmsg = "Enter your Name";
            }
        }
        if ($scope.firstname == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Enter your firstname";
        }

        if ($scope.lastname == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Enter your lastname";
        }

        if ($scope.loginemail == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Enter your email";
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test($scope.loginemail) && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Enter valid email";
        }
        if ($scope.vcompanyname == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Write your company name";
        }
        if ($scope.countryid == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Select your country";
        }
        if ($scope.gender == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Select your gender";
        }

        if ($scope.dialingcode == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Select dialing code";
        }

        if ($scope.phonenum == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Write your phone no";
        }

        if ($scope.signuppass == "" && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Write your password";
        }
        if (($scope.scorePassword($scope.signuppass) < 20) && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Week password";
        }
        if ($scope.signuppass != $scope.signupvpass && !$scope.showsignuperr) {
            $scope.showsignuperr = true;
            $scope.showsignuperrmsg = "Re-write your password";
        }
        var dateObj = new Date($scope.birthday);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate() + 1;
        var year = dateObj.getUTCFullYear();

        var newdate = year + "/" + month + "/" + day;
        console.log("-----BirthDay------", newdate);
        if (!$scope.showsignuperr) {

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            var post_data = {
                'email': $scope.loginemail,
                'fname': $scope.firstname,
                'lname': $scope.lastname,
                'country': $scope.countryid,
                'dialingcode': $scope.dialingcode,
                'gender': $scope.gender,
                'phone': $scope.phonenum,
                'wadialingcode': $scope.wadialingcode,
                'waphone': $scope.waphone,
                'password': $scope.signuppass,
                'vpass': $scope.signupvpass,
                'companyname': $scope.vcompanyname,
                'birthday': dateObj
            };
            console.log("Post Data: ", post_data);
            $http.post(BASE_URL + '/api/student/register', post_data).then(function(response) {
                console.log(response);

                if (response.status === 201) {
                    var lifetime = 999999999;
                    createCookie("lifetime", lifetime, lifetime);
                    createCookie("loggedin", true, lifetime);
                    createCookie("access_token", response.data.token, lifetime);
                    createCookie("fname", response.data.student.firstname, lifetime);
                    createCookie("lname", response.data.student.lastname, lifetime);
                    createCookie("email", response.data.student.email, lifetime);
                    createCookie("userId", response.data.student.id, lifetime);
                    $location.path('admin');
                }
            })

        }
    }

}]);