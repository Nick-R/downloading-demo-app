// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.controller('DownloadCtrl', function($scope) {

  download = function(url, success, failure, progress) {
    var targetPath = cordova.file.documentsDirectory + url.substring(url.lastIndexOf('/') + 1);;
    var trustHosts = true;
    var options = {};

    $scope.fileTransfer = new FileTransfer();
    $scope.fileTransfer.download(
        url,
        targetPath,
        success,
        failure,
        false, {
            headers: {
                "Authorization": ""
            }
        });
    $scope.fileTransfer.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          progress(progressEvent.loaded / progressEvent.total);
        }
    };
  }

  $scope.downloadAction = function() {
    window.progressBar.value = 0;
    download("http://cdn.wall-pix.net/albums/art-space/00030109.jpg",
              function(entry) {
                console.log("download complete: " + entry.toURL());
              },
              function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
              },
              function(progress) {
                window.progressBar.value = progress *100;
              });
  };

  $scope.pauseAction = function() {
  };

  $scope.resumeAction = function() {
  };

  $scope.abortAction = function() {
    $scope.fileTransfer.onprogress = 0;
    $scope.fileTransfer.abort();
    window.progressBar.value = 0;
  };

  $scope.ntfyAction = function() {
        var fetcher = window.BackgroundFetch;

        // Your background-fetch handler.
        var fetchCallback = function() {
            console.log('BackgroundFetch initiated');

          	var url = "http://www.songspk320z.us/songoftheday/[Songs.PK]%20Khaike%20Paan%20Banaraswala%20-%20Don%20(2006).mp3";
            download(url,
                      function(entry) {
                        console.log("Background download complete: " + entry.toURL());
                        Fetcher.finish();
                      },
                      function(error) {
                        console.log("Background download error source " + error.source);
                        console.log("Background download error target " + error.target);
                        console.log("Background upload error code" + error.code);
                        Fetcher.finish();
                      },
                      function(progress) {

                      });
        }
        var failureCallback = function() {
            console.log('- BackgroundFetch failed');
        };
        fetcher.configure(fetchCallback, failureCallback, {stopOnTerminate: true});
        console.log(fetcher);
  };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
