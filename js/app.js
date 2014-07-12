// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('rss', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('MainCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, Feeds) {

  $scope.feeds = Feeds.all();

  $scope.newFeed = function() {
    $scope.feedModal.show();
  };

  $scope.closeNewFeed = function() {
    $scope.feedModal.hide();
  }

  $scope.toggleRSSList = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $ionicModal.fromTemplateUrl('new-feed.html', function(modal) {
    $scope.feedModal = modal;
  }, {
    scope: $scope
  });

})

.factory('Feeds', function() {
  return {
    all: function() {
      var feedString = window.localStorage['feeds'];
      if (feedString) {
        return angular.fromJson(feedString);
      }
      return [];
    },
    save: function(feeds) {
      window.localStorage['feeds'] = angular.toJson(feeds);
    },
    newFeed: function(feedTitle, feedURL) {
      return {
        title: feedTitle,
        url: feedURL
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveFeed']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveFeed'] = index;
    }
  }
})
