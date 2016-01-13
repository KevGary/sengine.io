var app = angular.module('sengineSite', ['ui.ace', 'ngMaterial', 'ngMessages', 'ngRoute', 'ngFileUpload']);

app.constant('API_URL', 'http://104.236.15.225:8080');

app.factory('httpFactory', function ($http, API_URL) {
  return {
    hostHTML: hostHTML,
    execute: execute
  }
  function hostHTML(code) {
    return $http.post(API_URL + '/html', {"data": code});
  }
  function execute(code) {
    return $http.post(API_URL + '/execute', {"data": code});
  }
});

app.filter('reverse', function() {
  return function(results) {
    return results.slice().reverse();
  };
});

//on body tag in index.html
app.controller('GlobalController', function($scope, $location) {
  $scope.currentTab = $location.path().split('/')[1];
  console.log($scope.currentTab);
})

app.controller('LandingController', function($scope) {

})

app.controller('EditorController', function($scope, httpFactory, reverseFilter) {
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showFlag = true;;
    });
  }, 0)

  $scope.aceLoaded = function(_editor) {
    _editor.getSession().setUseWorker(false);
    _editor.renderer.session.doc.$lines[0] = "console.log('Hello world!');";
    _editor.setOptions({
      fontSize: 16
    });
    $scope.currentEditorValue = _editor.getSession().doc.$lines.join('\n');
    httpFactory.execute($scope.currentEditorValue)
    .then(function success(response) {
      console.log("RESPONSE: ", response);
      var result = {};
      if (response.data == "language not detected") {
        result.output = "Error: Language not detected",
        result.language = "N/A"
      } else {
        if (response.data.stdout != "") {
          result.output = response.data.stdout.trim();
        } 
        if (response.data.stderr != "") {
          result.output = response.data.stderr.trim();
        }
        result.language = response.data.language.trim();
      }
      $scope.results.push(result)
    })
  }

  $scope.aceChanged = function(e) {
    $scope.currentEditorValue = e[1].session.doc.$lines.join('\n');
    console.log($scope.currentEditorValue);
  }

  $scope.results = [];

  $scope.clearTerminal = function() {
    $scope.results = [];
  }

  $scope.execute = function() {
    httpFactory.execute($scope.currentEditorValue)
    .then(function success(response) {
      console.log("RESPONSE: ", response);
      var result = {};
      if (response.data == "language not detected") {
        result.output = "Error: Language not detected",
        result.language = "N/A"
      } else {
        if (response.data.stdout != "") {
          result.output = response.data.stdout.trim();
        } 
        if (response.data.stderr != "") {
          result.output = response.data.stderr.trim();
        }
        result.language = response.data.language.trim();
      }
      $scope.results.push(result)
    })
  }

})

app.controller('HostingController', function($scope, httpFactory, Upload) {
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showFlag = true;;
    });
  }, 50)
})

app.controller('DocsController', function($scope) {
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showFlag = true;;
    });
  }, 50)
})

app.controller('MetricsController', function($scope, httpFactory, $route) {
  $scope.refreshMetrics = function () {
    $route.reload();
  }
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showBar = true;;
    });
  }, 0)
  setTimeout(function () {
    $(".progress-bar").animate({
      width: "100%"
    }, 1000);
  })
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showBar = false;;
    });
  }, 3000)
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showFlag = true;
    });
  }, 3000)
  // var socket = io.connect('http://localhost:3000');

  // socket.emit('loadUsers');
  // socket.emit('loadUser', 'kev');
  // socket.emit('createUser', 'kev', 'yo');
  // socket.emit('deleteUser', 2);

  // socket.emit('loadQuestions');
  // socket.emit('loadQuestion', 1);
  // socket.emit('createQustion', 1, 'yo', 'ya');

  // socket.emit('loadAnswers');
  // socket.emit('loadAnswer', 1);
  // socket.emit('createAnswer', 1, 1, 'yo', 'ya');


  // socket.on('loadUsers', function (users) {
  //   console.log(users); 
  //   $scope.users = users;
  // });
  // socket.on('loadUser', function (user) {
  //   console.log(user); 
  //   $scope.user = user;
  // });
  // socket.on('createUser', function (user) {
  //   console.log(user); 
  //   $scope.user = user;
  // });
})

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/partials/landing.html',
      controller: 'LandingController'
    })
    .when('/editor', {
      templateUrl: '/partials/editor.html',
      controller: 'EditorController'
    })
    .when('/hosting', {
      templateUrl: '/partials/hosting.html',
      controller: 'HostingController'
    })
    .when('/docs', {
      templateUrl: '/partials/docs.html',
      controller: 'DocsController'
    })
    .when('/metrics', {
      templateUrl: '/partials/metrics.html',
      controller: 'MetricsController'
    })
    // .when('/page-not-found', {
    //   templateUrl: '/partials/error.html'
    // })
    // .otherwise({
    //   redirectTo: '/page-not-found'
    // });
  $locationProvider.html5Mode(true);
}]);