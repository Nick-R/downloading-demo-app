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

  var __i=0, __a = 0;

  onTrigger = function(notification) {
    console.dir(notification);
  };

  download = function(url, success, failure, progress) {
    var fileName = url.substring(url.lastIndexOf('/') + 1);

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile(fileName, { create: true }, function (targetFile) {
            var downloader = new BackgroundTransfer.BackgroundDownloader();
            // Create a new download operation.
            $scope.download = downloader.createDownload(url, targetFile);
            // Start the download and persist the promise to be able to cancel the download.
            var downloadPromise = $scope.download.startAsync().then(
              function() {
                    success(targetFile);
              },
              function(error) {
                    failure(error);
              },
              function(value) {
                    progress(value.bytesReceived / value.totalBytesToReceive);
              });
        });
    });
  }

  $scope.downloadAction = function() {
    window.progressBar.value = 0;
    download("http://cdn.wall-pix.net/albums/art-space/00030109.jpg",
              function(targetFile) {
                console.log("download complete: " + targetFile.toURL());
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
        // pause downloading
        $scope.download.pause();
  };

  $scope.resumeAction = function() {
        // resume downloading
        $scope.download.resume();
  };

  $scope.abortAction = function() {
        // stop downloading
        $scope.download.stop();
        // clear progress bar
        window.progressBar.value = 0;
        // remove local file
        $scope.download.resultFile.remove(function(){
          // The file has been removed succesfully
        },function(error){
            // Error deleting the file
        },function(){
           // The file doesn't exist
        });
  };

  $scope.ntfyAction = function() {
        var fetcher = window.BackgroundFetch;

        cordova.plugins.notification.local.on("trigger", onTrigger);
        // Your background-fetch handler.
        var fetchCallback = function() {
            console.log('BackgroundFetch initiated');
            cordova.plugins.notification.local.schedule({
                id: 1,
                title: "BackgroundFetch initiated",
                text: "File: "+url
            });

          	var url = "http://www.keithandthegirl.com/vip/download/shows/mnik/MNIK-2016-05-27.mp3?a=14-bfc1217d9d82361a802b";
            download(url,
                      function(entry) {
                        console.log("Background download complete: " + entry.toURL());
                        cordova.plugins.notification.local.schedule({
                            id: 2,
                            title: "Download complete",
                            text: "File: "+url
                        });
                        fetcher.finish();
                      },
                      function(error) {
                        console.log("Background download error source " + error.source);
                        console.log("Background download error target " + error.target);
                        console.log("Background upload error code" + error.code);
                        cordova.plugins.notification.local.schedule({
                            id: 2,
                            title: "Download error",
                            text: error.toString()
                        });
                        fetcher.finish();
                      },
                      function(progress) {

                      });
        }
        var failureCallback = function() {
            console.log('- BackgroundFetch failed');
        };
        fetcher.configure(fetchCallback, failureCallback, {stopOnTerminate: true});
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
