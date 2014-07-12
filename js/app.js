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

.controller('MainCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, $timeout, Feeds) {

  $scope.exLink = function (link){
    var url = link.href;
    window.open(encodeURI(url), '_system', 'location=yes');
  };

  var createFeed = function(feedTitle, feedURL) {
    var newFeed = Feeds.newFeed(feedTitle, feedURL);
    $scope.feeds.push(newFeed);
    Feeds.save($scope.feeds);
    $scope.selectFeed(newFeed, $scope.feeds.length-1);
  }

  $scope.goToLink = function(url) {
    window.open(url, '_system');
  };

  $scope.loadFeed = function(url) {
    Feeds.parseFeed(url).then(function(res) {
      if (res.data.responseData){
        $scope.activeFeed = res.data.responseData.feed;
      } else {
        alert('failed to load the requested RSS feed.');
      }
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.feeds = Feeds.all();

  $scope.newFeed = function(newFeed) {
    if (newFeed) {
      $scope.feedModal.hide();
      createFeed(newFeed.title, newFeed.url);
    }
  };

  $scope.deleteFeed = function(index) {
    $scope.feeds.splice(index, 1);
    Feeds.save($scope.feeds);
    $scope.currentDeleteIndex = null;
    $scope.selectFeed($scope.feeds[0], 0);
    $scope.deleteFeedModal.hide();
  }

  $scope.selectFeed = function(feed, index) {
    $scope.loadFeed(feed.url);
    Feeds.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.showFeedModal = function() {
    $scope.feedModal.show();
  };

  $scope.closeNewFeed = function() {
    $scope.feedModal.hide();
  };

  $scope.showDeleteFeedModal = function(index) {
    $scope.currentDeleteIndex = index;
    $scope.deleteFeedModal.show();
  };

  $scope.closeDeleteFeed = function() {
    $scope.deleteFeedModal.hide();
  };

  $scope.toggleFeedList = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $ionicModal.fromTemplateUrl('new-feed.html', function(modal) {
    $scope.feedModal = modal;
  }, {
    scope: $scope
  });
  $ionicModal.fromTemplateUrl('delete-feed.html', function(modal) {
    $scope.deleteFeedModal = modal;
  }, {
    scope: $scope
  });

  $scope.selectFeed($scope.feeds[Feeds.getLastActiveIndex()],
      Feeds.getLastActiveIndex());

})

.factory('Feeds', ['$http', function($http) {
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
    },
    parseFeed: function(url) {
      return $http.jsonp('http://ajax.googleapis.com/ajax/services/feed/load?' +
          'v=1.0&callback=JSON_CALLBACK&num=20&q=' + encodeURIComponent(url));
    }
  }
}])

.filter('externalLinks', function() {
  return function(text) {
    return String(text).replace(/href=/gm, "onclick=\"angular.element(this).scope().exLink(this);return false\" href=");
  };
})

.filter('to_trusted', ['$sce', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}])
