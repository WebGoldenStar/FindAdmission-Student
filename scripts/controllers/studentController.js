'use strict';
app.controller('studentController', ['$scope', '$location', '$http', '$timeout', function($scope, $location, $http, $timeout) {
    $scope.step = "step1";
    $scope.europeanCountries = ["Austria", "Belgium", "Bulgaria", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain"];
    $scope.americaCountries = ["Canada", "United States"];
    $scope.asiaCountries = ["Malaysia", "Hong Kong", "Japan", "India", "China", "Singapore", "Georgia"];
    $scope.studyCountries = [];
    $scope.visaType = "Entry";

    $scope.previewImage = "assets/images/author/img_avatar.png";
    $scope.profileImage = "assets/images/author/img_avatar.png";
    $scope.resultImage = "assets/images/author/img_avatar.png";
    let user = {};
    user.fname = readCookie("fname");
    user.lname = readCookie("lname");
    $scope.user = user;
    $scope.form = [];
    const token = readCookie("access_token");
    $scope.rectangleWidth = 400;
    $scope.rectangleHeight = 400;
    $scope.CurrentDate = new Date();
    $scope.cropper = {
        cropWidth: $scope.rectangleWidth,
        cropHeight: $scope.rectangleHeight
    };
    $scope.state = "Select state or region"
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
        console.log("previewImage", $scope.previewImage)


    });

    $scope.isActive = function(activeStep) {
        return activeStep === $scope.step;
    }
    $scope.addStudyCountry = function(country) {
        console.log(country);
        $scope.studyCountries.push(country);
        console.log("-------Speicalise Countries----------", $scope.studyCountries);
    }
    $scope.removeStudyCountry = function(country) {
        $scope.studyCountries = $scope.studyCountries.filter(countries => countries !== country);
    }
    $scope.setStep = function(step) {
        $scope.error = "";
        var lastChar = step[step.length - 1];
        var percent = (Number(lastChar) - 1) * 17
        console.log(percent);
        document.getElementById('progressStatus').style.width = `${percent}%`;

        $scope.step = step;
        console.log("-------Current Step-----------------", $scope.step);
        console.log("-------Language Level-----------------", $scope.speakLanguages);
    }
    $scope.addLanguage = function(newLanguage, newLevel) {
        const language = {}
        language.name = newLanguage;
        language.level = newLevel;
        $scope.speakLanguages.push(language);
        $scope.newLanguage = "Select Language";
        $scope.newLevel = "Select Level";
        console.log($scope.speakLanguages);
        console.log(JSON.stringify($scope.speakLanguages));
        // let json = {};
        // json.languages = $scope.speakLanguages;

    }

    function dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }
    $scope.imageSave = function(resultImage) {


        $scope.profileImageFile = $scope.previewImageFile;
        console.log(resultImage)
        $scope.profileImage = resultImage;
        var file = dataURLtoFile(resultImage, 'result.jpg');

        const formData = new FormData();
        formData.append('userId', readCookie('userId'));
        formData.append('profileImageFile', file);

        var request = {
            method: 'POST',
            url: BASE_URL + '/api/student/updateProfileImage',
            data: formData,
            headers: {
                'Content-Type': undefined,
                'Authorization': `bearer ${token}`
            }
        };
        $http(request)
            .then(function success(e) {

                console.log(e);
            }, function error(e) {
                // $scope.errors = e.data.errors;
                console.log(e);
            });

    }
    $scope.onFileChange = function(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $scope.previewImage = e.target.result;
                $scope.$apply(function() {
                    $scope.previewImage = e.target.result;
                })
            }

            reader.readAsDataURL(event.target.files[0]);
            $scope.previewImageFile = event.target.files[0];

        }


    }
    $scope.travelHistoryTab = function(visaType) {
        $scope.error = "";
        $scope.visaType = visaType;
        var data = {
            'userId': readCookie('userId'),
            'studyCountries': JSON.stringify($scope.studyCountries),
            'visaType': $scope.visaType
        };
        console.log(data);
        $http.post(BASE_URL + "/api/student/updateVisaType", data, { headers: { 'Authorization': `Bearer ${token}` } }).then(function(response) {
            if (response.status === 200) {
                document.getElementById('progressStatus').style.width = "17%";
                $scope.step = "step2";
                console.log(response);
            }
        });
    }
    $scope.fundingTab = function(isTravelledCountry, travelledCountryDetail, isRefusedCountry, refusedCountryDetail, isDeportedCountry, deportedCountryDetail) {

        var data = {
            'userId': readCookie('userId'),
            'isTravelledCountry': isTravelledCountry,
            'travelledCountryDetail': travelledCountryDetail,
            'isRefusedCountry': isRefusedCountry,
            'refusedCountryDetail': refusedCountryDetail,
            'isDeportedCountry': isDeportedCountry,
            'deportedCountryDetail': deportedCountryDetail,
        };
        console.log(data);
        $http.post(BASE_URL + "/api/student/updateTravelHistory", data, { headers: { 'Authorization': `Bearer ${token}` } }).then(function(response) {
            if (response.status === 200) {
                document.getElementById('progressStatus').style.width = "34%";
                $scope.step = "step3";
                console.log(response);
            }
        });
    }
    $scope.proposedStudyTab = function(personalCircumstance, otherDetail) {
        if (personalCircumstance === 'Other')
            var circumstance = otherDetail;
        else
            circumstance = personalCircumstance
        var data = {
            'userId': readCookie('userId'),
            'personalCircumstances': circumstance,

        };
        console.log(data);
        $http.post(BASE_URL + "/api/student/updateFunding", data, { headers: { 'Authorization': `Bearer ${token}` } }).then(function(response) {
            if (response.status === 200) {
                document.getElementById('progressStatus').style.width = "51%";
                $scope.step = "step4";
                console.log(response);
            }
        });
    }
    $scope.locationTab = function(isReceivedAdmission, receivedAdmissionDetail, studyCourse, sponsoringEducation, educationDetail, isExcludingTuition, excludingTuitionDetail) {
        if (sponsoringEducation === 'Other')
            var education = educationDetail;
        else
            education = sponsoringEducation
        var data = {
            'userId': readCookie('userId'),
            'sponsoringEducation': education,
            'isReceivedAdmission': isReceivedAdmission,
            'receivedAdmissionDetail': receivedAdmissionDetail,
            'studyCourse': studyCourse,
            'isExcludingTuition': isExcludingTuition,
            'excludingTuitionDetail': excludingTuitionDetail

        };
        console.log(data);
        $http.post(BASE_URL + "/api/student/updateProposedStudy", data, { headers: { 'Authorization': `Bearer ${token}` } }).then(function(response) {
            if (response.status === 200) {
                document.getElementById('progressStatus').style.width = "68%";
                $scope.step = "step5";
                console.log(response);
            }
        });
    }
    $scope.profilePhotoTab = function(address, state) {
        var data = {
            'userId': readCookie('userId'),
            'address': address,
            'state': state,

        };
        console.log(data);
        $http.post(BASE_URL + "/api/student/updateLocation", data, { headers: { 'Authorization': `Bearer ${token}` } }).then(function(response) {
            if (response.status === 200) {
                document.getElementById('progressStatus').style.width = "83%";
                $scope.step = "step6";
                console.log(response);
            }
        });
    }
    $scope.complete = function() {
        document.getElementById('progressStatus').style.width = "100%";
        $location.path('admin/studentProfile');
    }


}]);