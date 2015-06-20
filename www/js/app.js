
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var self_module = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngCookies','pascalprecht.translate'])

.run(function($ionicPlatform, $translate, $translateLocalStorage ) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      // StatusBar.styleDefault();
      StatusBar.overlaysWebView(true);
      StatusBar.styleLightContent();
      StatusBar.show();
    }
  
// IOS 상단바 / Device text 를 white 로
  // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
    
  })
})


.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide();
  }, 5000)
})

// device 의 default 언어로 초기 언어를 셋팅하고, 없으면 en 으로 셋팅.  사용자가 설정했을 경우는 설정언어를 가져온다. 
.run(['$ionicPlatform','$translate', '$translateLocalStorage', 
    function ($ionicPlatform, $translate, $translateLocalStorage) {

     $ionicPlatform.ready(function() {
      if ( $translateLocalStorage.get() == "undefined" || $translateLocalStorage.get() == null ) {
       if(typeof navigator.globalization !== "undefined") {
          navigator.globalization.getPreferredLanguage(function(language) {
            // alert(language.value);
  console.log("Device Lang = " + language.value);        
            $translate.use(language.value).then(function(data){
            }, function(error){
               alert("Not support your language");
              $translate.use('en-US');
            });
          }, null);
        } else {
  console.log("get Lang Fail = en-US");
  $translate.use('en-US');
        
        }
       }
     });
}])

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

  $translateProvider.useStaticFilesLoader({
    prefix: 'locale/',
    suffix: '.json'
  });

  // for (lang in trans){
  //    $translateProvider.translations(lang, trans[lang]);    
  //  }

  // $translateProvider.preferredLanguage("ko_KR");
    // remember language
  // console.log("Set LocalStorage");
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('escaped');

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  })

  .state('app.gospel', {
    url: "/gospel",
    views: {
      'menuContent': {
        templateUrl: "templates/gospel.html"
      }
    }
  })

    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/praise_list.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/praise.html",
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.language', {
    url: "/language",
    views: {
      'menuContent': {
        templateUrl: "templates/language.html"
      }
    }
  })

  .state('app.contry', {
    url: "/contry",
    views: {
      'menuContent': {
        templateUrl: "templates/contry.html"
      }
    }
  })

  .state('app.manual', {
    url: "/manual",
    views: {
      'menuContent': {
        templateUrl: "templates/manual.html"
      }
    }
  })

  .state('app.setting', {
    url: "/setting",
    views: {
      'menuContent': {
        templateUrl: "templates/setting.html"
      }
    }
  })

  // .state('app.donation', {
  //   url: "/donation",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/donation.html"
  //     }
  //   }
  // })
  // .state('app.share', {
  //   url: "/share",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/share.html"
  //     }
  //   }
  // })

  // .state('app.infomation', {
  //   url: "/infomation",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/infomation.html"
  //     }
  //   }
  // })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
