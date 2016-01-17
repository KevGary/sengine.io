var app = angular.module('sengineSite', ['ui.ace', 'ngMaterial', 'ngMessages', 'ngRoute', 'ngFileUpload', 'door3.css']);

app.constant('API_URL', 'http://sengine.io/api/v1');

app.factory('httpFactory', function ($http, API_URL) {
  return {
    hostHTML: hostHTML,
    execute: execute
  }
  function hostHTML(code) {
    return $http.post(API_URL + '/host', {"data": code});
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
  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showFooter = true;
    });
  }, 50)

  $scope.currentTab = $location.path();
  var start = '';
  if($scope.currentTab == '/') {
    start = '.root-nav';
  }
  if($scope.currentTab == '/editor') {
    start = '.editor-nav';
  }
  if($scope.currentTab == '/hosting') {
    start = '.hosting-nav';
  }
  if($scope.currentTab == '/docs') {
    start = '.docs-nav';
  }
  if($scope.currentTab == '/metrics') {
    start = '.metrics-nav';
  }
  // $('li').css({"border-bottom": "none"});
  $(start).css({"border-bottom": "2px solid #dddddd"});  
  $('li').on('click', function() {
    $(start).css({"border-bottom": "none"});
    $('li').css({"border-bottom": "none"});
    $(this).css({"border-bottom": "2px solid #dddddd"});
  })
})

app.controller('LandingController', function($scope, $css) {
    $css.add('fonts.css');

    setTimeout(function () {
      $scope.$apply(function () {
          $scope.showFlag = true;;
      });
    }, 50)
})

app.controller('EditorController', function($scope, httpFactory, reverseFilter, $css) {
  $css.remove('fonts.css');

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

// app.controller('HostingController', function($scope, httpFactory, Upload, $css) {
//   $css.add('fonts.css');

//   setTimeout(function () {
//     $scope.$apply(function () {
//         $scope.showFlag = true;
//     });
//   }, 50)

//   $scope.showHTMLContent = function($fileContent){
//     $scope.htmlContent = $fileContent;
//   };
//   $scope.showJSContent = function($fileContent){
//     $scope.jsContent = $fileContent;
//   };
//   $scope.showCSSContent = function($fileContent){
//     $scope.cssContent = $fileContent;
//   };

//   $scope.submit = function() {
//     // console.log($scope.htmlContent);
//     // console.log($scope.jsContent);
//     // console.log($scope.cssContent);
//     $scope.compiledHtmlContent = '';
//     if($scope.htmlContent) {
//       var head = $scope.htmlContent.split('</head>')[0];
//       var body = $scope.htmlContent.split('</head>')[1];
//     }
//     if($scope.cssContent) {
//       $scope.compiledHtmlContent += head + '\n ' + '<style>\n' + String($scope.cssContent) + '\n</style></head>';   
//     }
//     if($scope.jsContent) {
//       $scope.compiledHtmlContent += body + '\n' + '<script>\n' + String($scope.jsContent) + '\n</script></body></html>';    
//     }
//     if(!$scope.cssContent && !$scope.jsContent) {
//       $scope.compiledHtmlContent += $scope.htmlContent;
//     }
//     if(!$scope.cssContent && !$scope.jsContent && !$scope.htmlContent) {
//       $scope.compiledHtmlContent += 'no static content found'
//     }
//     console.log($scope.compiledHtmlContent);
//     setTimeout(function () {
//       $scope.$apply(function () {
//           $scope.showCode = true;
//       });
//     }, 0)
//     httpFactory.hostHTML($scope.compiledHtmlContent).then(function success (response) {
//       console.log(response);
//       // $scope.displayCode = $scope.compiledHtmlContent;
//       $scope.hostURL = response.data;
//     });
//     // var tempElem = angular.element("<div>" + $scope.htmlContent + "</div>").css("display", "none");
//     // // tempElem.style.display = "none";
//     // // tempElem.innerHTML = $scope.htmlContent;
//     // // angular.element(tempElem);
//     // // console.log(angular.element(tempElem).html());
//     // console.log(tempElem);
//     // var head = angular.element(tempElem).find('head');
//     // console.log(head);

//     // if ($scope.cssContent) {
//     //   angular.element(tempElem).find("head").append("<style>" + $scope.cssContent.toString() + "</style>");
//     // }
//     // if ($scope.jsContent) {
//     //   angular.element(tempElem).find("body").append("<script>" + $scope.jsContent.toString() + "</script>");
//     // }
//     // var hostData = angular.element(tempElem).html();
//     // // tempElem.innerHTML = "";
//     // console.log(hostData)
//   }

// })

app.controller('DocsController', function($scope, $css) {
  $css.add('fonts.css');

  setTimeout(function () {
    $scope.$apply(function () {
        $scope.showFlag = true;;
    });
  }, 50)
})

app.controller('MetricsController', function($scope, httpFactory, $route, $css) {
  $css.add('fonts.css');
  
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
    // .when('/hosting', {
    //   templateUrl: '/partials/hosting.html',
    //   controller: 'HostingController'
    // })
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
