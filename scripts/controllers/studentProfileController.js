'use strict';
app.controller('studentProfileController', ['$scope', '$location', '$http', '$timeout', function($scope, $location, $http, $timeout) {
    const token = readCookie("access_token");
    let user = {};
    user.fname = readCookie("fname");
    user.lname = readCookie("lname");
    $scope.user = user;
    $scope.CurrentDate = new Date();
    // $http.defaults.headers.common.Authorization = `Bearer ${token}`;

    $http.get(BASE_URL + "/api/student/students", { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
        if (response.data.student.study_countries) {
            $scope.studyCountries = JSON.parse(response.data.student.study_countries);
        }
        $scope.visaType = response.data.student.visa_type;
        $scope.isTravelledCountry = response.data.student.is_travelled_country;
        $scope.travelledCountryDetail = response.data.student.travelled_country_detail;
        $scope.isRefusedCountry = response.data.student.is_refused_country;
        $scope.refusedCountryDetail = response.data.student.refused_country_detail;
        $scope.isDeportedCountry = response.data.student.is_deported_country;
        $scope.deportedCountryDetail = response.data.student.deported_country_detail;

        var personalCircumstance = response.data.student.personal_circumstances;
        if (personalCircumstance !== 'Student' && personalCircumstance !== 'Unemployed' && personalCircumstance !== 'Self-employed' && personalCircumstance !== 'Employed full time' && personalCircumstance !== 'Employed part time') {
            $scope.personalCircumstance = "Other"
            $scope.circumstanceDetail = response.data.student.personal_circumstances;
        } else
            $scope.personalCircumstance = response.data.student.personal_circumstances;

        $scope.isReceivedAdmission = response.data.student.is_received_admission;
        $scope.receivedAdmissionDetail = response.data.student.received_admission_detail;
        $scope.studyCourse = response.data.student.study_course;
        $scope.isExcludingTuition = response.data.student.is_excluding_tuition;
        $scope.excludingTuitionDetail = response.data.student.excluding_tuition_detail;

        var education = response.data.student.sponsoring_education;
        if (education !== 'My Parent' && education !== 'Plan to take loan' && education !== 'Government Sponsorship' && education !== 'My self' && education !== 'Friends or Family') {
            $scope.sponsoringEducation = "Other"
            $scope.educationDetail = education;

        } else
            $scope.sponsoringEducation = education;
        $scope.address = response.data.student.address;
        $scope.state = response.data.student.state;
        var profile__image = BASE_URL + "/public" + response.data.student.profile_image;
        $scope.profileImage = profile__image;
        $scope.previewImage = profile__image;
    });

}]);