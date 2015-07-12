



var self_module = angular.module('starter.controllers', ['ionic','ngCordova']);

// 사운드를 위한 서비스
self_module.service('soundService', function(){
    var soundService = {
      myMedia:null,
      play:function (src){
        var isAndroid = ionic.Platform.isAndroid();
        var add_str = (isAndroid ) ? "/android_asset/www/" : "";
        var sound_src = add_str + src;
        var self = this;

        self.stop();
        self.myMedia =  (isAndroid ) ?  new Media(sound_src, null, null) : new Audio(sound_src);
        self.myMedia.play();
      },

      stop:function(){
        var self = this;
        if (self.myMedia){
          if (ionic.Platform.isAndroid()) {self.myMedia.release();} else { self.myMedia.pause();}
        }
      }
    };

    return soundService;

});

// 사이드 메뉴용 컨트롤러
self_module.controller('AppCtrl', function($scope,$rootScope, $translate, soundService, $ionicPlatform, $ionicSideMenuDelegate, $state, Get_myLang, Get_targetLang) {

  $scope.all_sound_stop = function(){
    soundService.stop();
//    $scope.$state = $state;
    // $scope.title = $state.current.name;
  }

 $scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(function(){
    soundService.stop();
    if ($ionicSideMenuDelegate.isOpen()) {
      navigator.app.exitApp(); 
    }else {
      $ionicSideMenuDelegate.toggleLeft();
    }
  }, 300);




// 메뉴 하단에 들어갈 선택언어 
  var select_target = "target_km"; 

  Get_targetLang.getData(select_target).then(function(data){
    $scope.target_lang = data.target_language[$translate.use()];
    });

  $rootScope.$on('$translateChangeSuccess', function () {
    console.log("translateChangeSuccess");
    $scope.target_lang = "";
    Get_targetLang.getData(select_target).then(function(data){
      $scope.target_lang = data.target_language[$translate.use()];
      });
    });
});

// 사용자 언어 json 파싱용. 
self_module.factory('Get_myLang', function ($http, $translate,  $q) {
    var data = {};
    function getDataIfNeeded() {
    var json_file = "locale/" + $translate.use() +".json";          
    console.log("ready Json = " + $translate.use() +".json" );
    return $http({
            url: json_file ,
            method: "GET",
        }).then(function(response) {
            data = response.data;
            console.log("Json Calling Success");
            return data;
        });
      };
    return { getData : getDataIfNeeded }
});

// 타켓 선교지언어 json 파싱용. 
self_module.factory('Get_targetLang', function ($http, $translate,  $q) {
    var data;
    function getDataIfNeeded(select_target) {
    var json_file = "locale/" + select_target +".json";          

    return $http({
            url: json_file ,
            method: "GET",
        }).then(function(response) {
            data = response.data;
            console.log("TargetJson Calling Success");
            return data;
        });
      };
    return { getData : getDataIfNeeded }
});


//홈 
self_module.controller('HomeCtrl',function($scope){

  // IOS 상단바 / Device text 를 white 로
  // $cordovaStatusbar.overlaysWebView(true);
  // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
  // $cordovaStatusbar.style(1);
  if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
    }
    

});

// 선교회화 리스트
self_module.controller('lang_list', function($scope, $rootScope, soundService, $translate, Get_myLang, Get_targetLang) {
    
    
  var select_target = "target_km"; 
  var tempArray1={};
  var myLang1;

  Get_myLang.getData().then(function(data){
         $scope.langs1  = data.language_lang1 ;
         $scope.langs2 = data.language_lang2 ;
         $scope.langs3 = data.language_lang3 ;
   });

  if ($translate.use() == "ko-KR"){    // 한글의 경우만 독음 정보를 가져온다. 
    Get_targetLang.getData(select_target).then(function(data){
         $scope.langs1_sound  = data.language1_sound ;
         $scope.langs2_sound = data.language2_sound ;
         $scope.langs3_sound = data.language3_sound ;
   });
  } else {
         $scope.langs1_sound = null ;
         $scope.langs2_sound = null ;
         $scope.langs3_sound =null ;
  }



  $rootScope.$on('$translateChangeSuccess', function () {
     console.log("EVENT translateChangeSuccess");
     console.log( $translate.use() );
      $scope.langs1 = null ;
      $scope.langs2 = null ;
      $scope.langs3 = null ;

    Get_myLang.getData().then(function(data){
        $scope.langs1 = data.language_lang1 ;
        $scope.langs2 = data.language_lang2 ;
        $scope.langs3 = data.language_lang3 ;
        // console.log(data.language_lang2[0]);
      }); 
    
    if ($translate.use() == "ko-KR"){    // 한글의 경우만 독음 정보를 가져온다. 
      Get_targetLang.getData(select_target).then(function(data){
         $scope.langs1_sound  = data.language1_sound ;
         $scope.langs2_sound = data.language2_sound ;
         $scope.langs3_sound = data.language3_sound ;
     });
    } else {
         $scope.langs1_sound = null ;
         $scope.langs2_sound = null ;
         $scope.langs3_sound =null ;
    }


   });

    $scope.play = function(index){
      var src = "audio/lang_"+ index +".mp3";
      soundService.play(src);
    };
    
    

});

// 복음제시 페이지. 
self_module.controller('GospelCtrl', function($scope, $ionicSlideBoxDelegate, soundService) {
  console.log('Gospel');
  play_gospel(0);
  $scope.gospel=[
      {img:'img/gospel_01.jpg' },
      {img:'img/gospel_02.jpg' },
      {img:'img/gospel_03.jpg' },
      {img:'img/gospel_04.jpg' },
      {img:'img/gospel_05.jpg' },
      {img:'img/gospel_06.jpg' },
      {img:'img/gospel_07.jpg' },
      {img:'img/gospel_08.jpg' },
      {img:'img/gospel_09.jpg' },
      {img:'img/gospel_10.jpg' },
      {img:'img/gospel_11.jpg' },
      {img:'img/gospel_12.jpg' }
     ];
  $scope.slideIndex = 0;
  // Called each time the slide changes

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    console.log("slide Change = " + $scope.slideIndex);
      play_gospel($scope.slideIndex);
  };

  $scope.slide_prev = function(index){
    $scope.slideIndex = index;
    $scope.slideIndex--;
    if ($scope.slideIndex == -1) $scope.slideIndex = 11;
    $ionicSlideBoxDelegate.slide($scope.slideIndex);
      play_gospel($scope.slideIndex);

  };

  $scope.slide_next = function(index){
    $scope.slideIndex = index;
    $scope.slideIndex++;
    if ($scope.slideIndex == 12) $scope.slideIndex = 0;
    $ionicSlideBoxDelegate.slide($scope.slideIndex);
      play_gospel($scope.slideIndex);
  };
    

    $scope.play = function(index) {
      $scope.slideIndex = index;
      console.log('play index ='+ $scope.slideIndex);
    //      var myAudio = document.getElementById("myAudio");
      play_gospel($scope.slideIndex);
  };

  function play_gospel(no) {
    var src = "audio/gospel_"+ (no+1) +".mp3";
    if (window.localStorage.getItem("soundFlag") == "true"){
      soundService.play(src);
    }
  };


  // 하단 중앙에 사운드 ON/Off 토글 버튼
  // 초기값이 없을때 on 으로 셋팅
    if ( window.localStorage.getItem("soundFlag")!="false" ){
      $scope.soundflag = true;   
      window.localStorage.setItem("soundFlag" ,"true");
    };
  // 토글 버튼 구현.  할 때 마다 LocalStorage 에 저장한다. 
  $scope.soundSwitch = function(){
    if (window.localStorage.getItem("soundFlag")=="true"){
      $scope.soundflag = false;   
      window.localStorage.setItem("soundFlag" ,"false");
      soundService.stop();      
    }else{
      $scope.soundflag = true;   
      window.localStorage.setItem("soundFlag" ,"true");
    }  
  }

});

// 찬양리스트 
self_module.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: '1. 눈눈눈 성경보구요', id: 1 },
    { title: '2. 당신은 사랑받기 위해 태어난 사람', id: 2 },
    { title: '3. 돈으로도 못가요', id: 3 },
    { title: '4. 크신 주께', id: 4 },
    { title: '5. 주를 향한 나의 사랑을', id: 5 },
    { title: '6. 천국에 들어가는 길은', id: 6 },
    { title: '7. 크신 주께', id: 7 },
    { title: '8. 해뜨는데 부터', id: 8 },
    { title: '9. 호산나', id: 9 }
  ];
    $scope.$watch ('$routeChangeSuccess', function () {
       console.log('init');
    });

});
// 찬양 한 곡 / 듣기
self_module.controller('PlaylistCtrl', function($scope, $stateParams, soundService) {
  $scope.song_no = $stateParams.playlistId;
    $scope.btn_play = true;

  $scope.songplay = function(){
    var src = "audio/song_"+ $scope.song_no +".mp3";
    soundService.play(src);
    $scope.btn_play = false;
    $scope.btn_stop = true;
  };

  $scope.songstop = function(){
    $scope.btn_play = true;
    $scope.btn_stop = false;
    soundService.stop();
  }

   $scope.$on('$destroy', function () {
    soundService.stop();
    });
});

//국가 정보 제공. 
self_module.controller('ContryCtrl', function($scope){
  $scope.information = [
  { title:'국가개요', 
    img:'img/contry_1.jpg',
    content:'<b>캄보디아</b>는 크메르 제국의 다른 이름인 캄부자(산스크리트어: कंबुज)에서 유래한 프랑스어 캉보주(Cambodge)가 영어화된 것을 받아들인 것이다. 1970년 이전 왕국시대에는 캄보디아로 불려오다가, 1970년 론 놀의 쿠데타로 공화국이 성립되자 국명이 크메르 공화국으로 바뀌었다. 1975년 4월 크메르 루주(Khmer Rouge, 크메르어: ខ្មែរក្រហម Khmêr Khrôm)에 의해 수도 프놈펜이 함락되고 국명은 또다시 민주 캄푸치아로 바뀌었다. 4년 뒤인 1979년 베트남의 지원을 받은 헹 삼린가 캄푸치아 인민 공화국으로 바꾸었다가, 이후인 1993년에 현재의 국명으로 되돌아왔다' 
  },
  { title:'지역 개관', 
    img:'img/contry_2.jpg', 
    content:'<ol><li><b>지리</b><br>캄보디아는 181,035 평방킬로미터의 면적을 가지고 있다. 북서쪽으로는 태국과 800 킬로미터의 접경하고, 북동쪽으로는 라오스와 541 킬로미터를 접경하고, 1,228 킬로미터를 동쪽과 남동쪽으로 베트남과 접경하고 있다. 타이 만을 따라서 443 킬로미터의 해안선이 있다.</li><li><b>인구</b><br>캄보디아의 인구는 1980년대 말 까지 만해도 약 700만 명에 불과하였으나 3% 정도의 높은 자연증가와 외국에서의 유입으로 지금은 800~900만에 육박하는 것으로 추산 된다. 1998년 기준통계로 1130만 명이다.평균 인구밀도는 약 40명/1킬로 (우리나라 약 450명/1킬로) 로서 매우 희박한 편이다. 중부 곡창지대의 인구밀도는 약 100명/1킬로로서 이웃한 베트남의 곡창지대 약 1000명/킬로인 것에 비하면 큰 차이가 있다. </li><li><b>기후</b><br>캄보디아의 기온은 10 °C ~ 38 °C에 이르며, 열대 몬순 기후이다. 10월~1월은 30 °C 정도이며, 2월~5월은 32 °C ~ 35 °C에 이른다. 5월~10월에 내륙으로 불어오는 남서 몬순이 타이 만과 인도양에서 습한 바람을 몰고 온다.</li><li><b>자연환경</b><br>캄보디아는 인도차이나 반도 남동부 캄보디아 평원을 차지하며 메콩강이 중앙을 관류하는 평원국가입니다. 캄보디아 남쪽을 제외한 세 방향이 산지로 둘러싸여 있고 산지의 중앙에는 넓은 평원이 펼쳐져 있어 마치 대접 모양의 지형을 이루고 있습니다. 북쪽으로는 타이와 라오스가 있고 동쪽과 남쪽으로는 베트남과 접하고 있으며 남서쪽으로는 타이 해안과 인접해있습니다. 국토의 3/4이 산림으로 되었으며 카르다몸 산맥은 해발고도가 1,000~1,500m에 이릅니다. 캄보디아의 자연환경은 평원지대이면서 산림이 우거져 있고 중앙평원은 농업지역이고 코끼리, 야생 물소, 호랑이, 표범, 곰 등과 수많은 작은 짐승들이 있고 코브라, 왕코브라 등의 위험한 독사가 많기도 합니다.</li></ol>' 
  },
  { title:'주요역사', 
    img:'img/contry_3.jpg', 
    content:'<ol><li><b>고대-앙코르 왕조(~1863)</b><br>캄보디아에는 후난(Funan) 왕조와 첸라(Chenla) 왕조, 앙코르 왕조를 건설하였다. 앙코르 왕조는 크메르 민족의 전성기(고대 크메르왕국 시대)였으나, 19세기 중반 프랑스 식민지가 되었다.</li><li><b>프랑스 통치시대(1864~1940)</b><br>캄보디아는 1864년 타이와 베트남의 지배를 벗어나기 위해 자진해서 프랑스의 보호령으로 편입하였다. 1884년 노로돔(Norodom) 국왕은 프랑스의 강압으로 명목상의 왕위만 유지하고 통치권을 프랑스에 넘겨주는 협정에 서명하였다.</li><li><b>시하누크 시대(1941~1970)</b><br>1941년 프랑스는 당시 19세의 노로돔 시하누크(Norodom Sihanouk)를 왕으로 즉위시켰지만, 시하누크는 1945년 3월 12일 일본의 도움으로 캄보디아 독립을 선언하였다. 2차 세계 대전에서 일본의 패전 후, 프랑스는 캄보디아에 대한 지배권을 회복하였다. 그러나 1953년 11월 시하누크에게 군사권, 사법권, 외교권을 허용함으로써 캄보디아는 사실상 프랑스로부터 독립하였다.1955년 시하누크 국왕은 현실정치에 참여하고 왕위를 아버지인 노로돔 수라마리트(Norodom Suramarit)에게 이양하고 인민사회주의 공동체당(Sangkum Reastr Niyum)의 총재로 취임하였다. 같은 해 총선에서 절대적인 지지를 받으며 승리하여 1970년까지 캄보디아 정국을 주도하였다.</li><li><b>크메르공화국 시대(1970~1975)</b><br>1970년 3월 28일 론놀(Lon Nol) 장군이 쿠데타를 일으켜 성공하였다. 론놀 장군은 시하누크를 모든 공직에서 축출하고 귀국을 불허하였다. 그리고 1970년 4월 10일 크메르공화국(Khmer Republic) 수립을 선포하였다. 론놀 장군은 반정부 세력을 공산주의자로 간주하고 탄압하여 크메르루즈(Khmer Rouge)의 성장을 초래하였다.</li><li><b>민주 캄푸치아 시대(1975~1978)</b><br>1975년 4월 17일 폴 포트가 이끄는 캄푸치아 공산당인 크메르루즈가 수도 프놈펜(Phnom Penh)에 입성하여 급진적인 혁명을 추진하였다. 1978년 12월 베트남이 무력으로 캄보디아를 침공하였다.</li><li><b>캄푸치아 인민공화국 시대(1979~1989)</b><br>1979년 1월 친베트남 세력들이 프놈펜에 입성하여 크메르루즈를 축출하고 캄푸치아 인민공화국(People’s Republic of Kampuchea)을 수립하였다.</li><li><b>캄보디아국 시대(1989.4~1993.5)</b><br>1989년 4월 캄보디아 국민혁명당은 국명을 캄보디아국(State of Cambodia)으로, 당명을 캄보디아국민당(CPP, Cambodian Peoples Party)으로 개칭하고 사유재산 인정과 민영화 추진 등을 통해서 탈공산주의를 추진하였다. 1990년 국제연합(UN, United Nations) 안전보장이사회는 포괄적인 캄보디아 평화안을 채택하였다. 1990년 10월 캄보디아 4개의 정파는 최고국가평의회(SNC, Supreme National Council)을 구성하기로 합의하였다. 1991년 10월 캄보디아 분쟁의 정치적 해결에 관한 파리평화협정에 대한 서명이 이루어졌다. 캄보디아는 국제연합캄보디아과도행정기구(UNTAC, UN Transitional Authority of Cambodia)와 최고국가평의회에 18개월 동안 통치권을 위임하고 총선을 통한 신정부 구성을 추진하였다.</li></ol>' 
  },
  { title:'킬링필드', 
    img:'img/contry_4.jpg', 
    content:'캄보디아의 역사에서 가장 가슴아픈 일은 <b>킬링필드사건</b>이다. 이는 1975년 캄보디아의 공산주의 무장단체이던 폴포트 중심의 크메르루주(붉은 크메르) 정권이 론 놀 정권을 무너뜨린 후 1979년까지 노동자와 농민의 유토피아를 건설한다는 명분 아래 최대 200만 명에 이르는 지식인과 부유층을 무참히 학살한 사건이다. 캄보디아는 킬링필드의 후유증 탓으로 2003년 1인당 국민소득 290달러의 최빈국으로 머무르고 있다. 1,200만 인구의 40% 이상이 하루 1달러 정도의 수입으로 살아가고 있다. 부정부패도 극심해 최대 5억 달러에 이르는 잠정적 정부 세입이 해마다 밀수나 횡령을 비롯한 불법 행위로 새나가고 있다'
  },
  { title:'사회와 문화', 
    img:'img/contry_5.jpg', 
    content:'<ol><li><b>인구</b><br>제2차 인도차이나전쟁, 내전으로 인한 대량학살 등으로 인해 캄보디아에는 장년층을 찾아 보기 힘들다. 1985년의 총인구는 1975년과 거의 비슷한 수준에 머물렀으며, 2007년 현재 인구는 1,380만 명이며 인구증가율은 1.7%에 그치고 있다. 출생률은 1,000명당 25.53명, 사망률은 8.24명, 영아사망률은 58.45명이다. 평균수명은 61.29세로 남자는 59.27세, 여자는 63.4세이고 평균 연령이 21.3세로 상당히 젊은 국가에 속한다.</li><li><b>종교</b><br>불교는 캄보디아의 국교이고, 국민 대다수는 불교의 가르침에 따라 삶을 영위한다. 불교사원은 예배, 교육 및 사회활동의 장소이고, 승려는 사회에서 존경 받는 계층이다. 특히 캄보디아인들은 13세기에 건축된 앙코르 유적지에 대한 자부심이 상당히 강하고, 크메르족의 영화가 재건될 것이라고 믿는다. 캄보디아의 국기에 앙코르 와트 문양이 새겨져 있다</li><li><b>교육</b><br>초·중등학교와 고등교육기관이 있으며, 학제는 6-3-3제(대학원 3-5년)이며, 초등학교와 중학교 등 총 6년을 의무교육으로 하고 있다. 그러나 빈곤이 만연하고 낙후한 학교시설과 열악한 교육여건으로 인해 교육이 제대로 실시되지 않고 있다. 1967년 크메르 왕립대학이 개교했고, 1970년대 전체 대학생은 약 9천명으로 추정된다. 크메르 루즈가 집권하면서 지식인들이 대량으로 학살당하고, 대학이 폐교당했다. 1990년 이후 대학교육이 재개되었고, 대학 입학시험 수준도 높아졌다. </li></ol> ' 
  },
  { title:'정치', 
    img:'img/contry_6.jpg', 
    content:'  1993년 제정된 신헌법에 따라 캄보디아는 입헌군주제로 회귀하였으며 국왕은 종교와 국가의 수호자이자 국가의 수반이다. 국왕은 군대의 최고 통수권자이지만 헌법 제 7조에 따라 국왕은 군림하지만 통치할 수 없는 헌법적 제약이 따른다.   행정부의 수장은 총리이며, 총선을 통해 승리한 원내 다수당의 당수가 하원 의장의 제청에 따라 국왕에 의해 임명된다. 총리는 15인의 선임장관(무임소 장관 7인 포함)과 24개 부처의 장관을 의원으로 하는 내각회의를 이끌게 되며 원내 2/3 이상의 동의를 얻어야 내각회의의 구성원을 해임할 수 있다. 내각회의는 행정부의 중추적 역할을 한다. 내각회의 산하에 있는 사무국은 정부가 추진하는 정책의 조율과 일정을 관리하고 기획한다. 내각회의실은 900여 명으로 구성된 자체 직원을 거느리고 있으며, 공공기능과 민간항공과 관련된 두 개의 독립적 사무국을 두고 있다. 행정부의 각료가 되려면 반드시 의원일 필요는 없지만 의석을 확보한 정당에 소속되어야만 그 자격을 얻을 수 있다.  지방은 22개 주와 2개 직할시로 구분되어 있고, 그 하위에 총 183개의 군(郡)이 있다. 주지사와 직할시장 및 군수는 모두 중앙정부에서 임명하며 그 구성원을 모두 CPP, Funcinpec, SRP 소속으로 제한하고 있다.  입법부는 하원과 상원으로 구성되는 양원제 의회를 갖추고 있으며 2005년 현재 총 의석수는 123석이다. 하원의 임기는 5년이나 전시에는 재적의원 2/3의 동의를 얻어 임기를 1년 연장할 수 있도록 되어있다. 하원은 개원 후 12개월 내에 두 차례 이상 내각 불신임이 제기 될 경우, 총리의 발의와 하원 의장의 동의에 따라 국왕이 하원 해산을 명할 수 있다. 하원은 고유 업무는 총리를 선출하고, 입법 기능을 담당하는 것이다.   캄보디아의 정규군을 캄보디아왕립군(RCAF)이라고 부르며 육군, 해군, 공군으로 나눠져 있다. 2004년 9월 징병법이 의회에서 통과되어 18~30세 정도의 남성은 18개월간 의무 복무를 해야 하는데 현재 3군을 통틀어 17만 명이 복무하고 있다. 국방비 지출은 2007년 기준 1억 1천 2백만 달러이다. ' 
  },
  { title:'경제', 
    img:'img/contry_7.jpg', 
    content:' 캄보디아는 독립 직후부터 동서 양 진영으로부터 무상으로 거액의 경제 원조를 받았다. 국민들의 생산의욕이 저하되고, 관료들은 부패해지자 시아누크는 1963년부터 미국의 원조를 거부하고 중국식 자력갱생의 경제발전 정책을 추진하였다. 그러나 1970년대 중반부터 시작된 내전과 전후 복구 사업으로 경제 재건에 어려움을 겪고 있다.   1991년부터 정국이 안정되자 캄보디아는 계획경제에서 시장경제로 경제체제를 전환하고, 1995년까지 사회경제부흥계획(SERP)을 수립하였다. 1996년 2월 제1차 사회경제개발계획(SEDP)을 수립하여 빈곤 퇴치와 낙후된 지역을 개발하는 것을 최대 목표로 설정하였다. 1998년 훈 센이 단독으로 총리에 집권한 후 2001~2005년까지 평화 구축과 안정, 국제사회에서의 국가적 지위 복고, 행정 및 재정 개혁을 목표로 2차 사회경제개발계획이 시행되었다.   외환위기의 여파로 1998년 경제 성장률이 3.7%로 둔화되었다가 1999년 11%에 육박하는 경제 성장률을 기록하였다. 정치적 안정이 이루어지자 2000년 이후 연 5~6% 정도의 성장을 기록하고 있다. 반면 소비자 물가 상승률도 2004년에 들어 빠르게 증가하였고, 낮은 미곡 가격과 국제 유가 상승이 경기 회복의 걸림돌로 작용하고 있다.   국민의 75~80% 가량이 농민으로 농업이 국가 산업의 근간이고, 2004년 정부 발표에 의하면 경작 가능면적이 경지면작의 65%에 달한다고 한다. 2004년 발생한 극심한 가뭄으로 수확량이 크게 감소하였고, 농민 출신인 훈 센 총리는 민심을 수습하고자 농민들을 구휼할 수 있는 조치를 취했다.  취약한 인프라와 원조의존형의 경제 구조로 인해 캄보디아의 제조업이나 농업 부문이 고전을 면치 못하고 있는 반면, 풍부한 문화유산을 간직하고 있기 때문에 관광업이 호조를 보이고 있다. 캄보디아 관광부에 의하면, 2005년 1~4월까지 집계된 외국인 관광객만 50만명을 초과하여 전년도 대비 56%나 증가하였다. 2006년 기준 캄보디아 앙코르 유적지를 방문한 외국인 관광객 중 한국 관광객이 30만 명으로 집계되어 이 분야 1위를 차지하였다.' 
  }
  ];
});

//단기선교 메뉴얼 제공. 
self_module.controller('ManualCtrl', function($scope){
  $scope.information = [
  { title:'비전트립이란?', 
    img:'img/manual_1.jpg',
    content:'선교의 여러가지 형태가 있지만, 최근 가장 많이 실시되는 것은 <b>비전트립</b>이다.<br><br> 비전트립은 거의 평생 선교지에서 사는 장기선교나 1~3년의 단기선교와 달리, 1~2주 정도의 짧은 기간으로 선교지를 방문하고, 선교사역을 감당하는 여행형태의 선교이다. 과거에 비해서 항공교통의 발달과 비용이 많이 저렴해 지면서 부담없이 선교지를 방문하게 된 것이다. <br><br>한국에서 <b>1년에 1만개가 넘는 비전트립팀</b>이 해외로 나가고 있고, 엄청난 비용이 든다. 이에 대해서 찬반논쟁이 있기는 하지만, 이는 이 시대에 아주 필요하고 효율적인 전략임은 분명하다. 다만 어떻게 하는가가 중요한 문제일 것이다.' 
  },
  { title:'준  비', 
    img:'img/manual_2.jpg', 
    content:'비전트립은 우리가 아니라 선교현지에 있는 <b>그들을 위하여</b> 가는 것이다. 그러므로 그들에게 무엇이 필요하며, 현지 선교사님에게 어떤 도움이 될 것인가를 집중하여야 한다.  그렇지 않으면, 오히려 선교현지에 방해가 되어버리는 일이 발생해 버릴 것이다.  그러므로 첫번째로 중요한 것은 준비이다. <ol><li><b>비전공유하기</b><br>비전트립을 왜 가는지에 대한 성경적인 근거와 하나님의 마음을 품으며, 멤버들이 함께 모여서 기도하며 비전을 공유한다.</li><li><b>선교현지에 대한 연구</b><br>비전트립을 가는 곳에 대한 기본적인 정보가 있어야 한다. 우리가 살아온 이 곳과 전혀 다른 문화속에서 자라온 그들을 만나기 때문에, 그들의 가치관, 세계관, 민족성을 이해하지 못하면 그들을 만날수 없다. 그것을 위해서 그들의 역사, 중요한 사건, 정치, 경제수준, 문화 등을 연구해야 한다.</li></ol>'
  },
  { title:'사역 정하기', 
    img:'img/manual_3.jpg', 
    content:'현지 선교사님과 긴밀하게 연락을 하면서 필요한 것이 무엇인가를 구체적으로 파악해야 한다. 때로는 아무것도 준비하지 않는 것이 최선의 준비일 수도 있다. 그들에게 필요없고, 오히려 싫어할 일을 우리가 좋다고 해서 준비하는 경우들이 있기 때문이다. 방문하게 되는 대상의 연령과 경제수준, 건강, 필요한 것이 무엇인가를 고려해서 비전트립팀이 해야할 일을 먼저 정해야 한다. '
  },
  { title:'팀 조직하기', 
    img:'img/manual_4.jpg', 
    content:'비전트립은 2박 3일의 수련회가 아니다. 1-2주간 함께 먹고 자며 공동생활을 하면서 사역을 감당하게 된다. 그곳의 현실은 우리보다 열악하다. 그러므로 팀웍이 좋지 않으면 문제가 생기고, 오히려 마음에 상처를 받을 수도 있다. 그러므로 사전에 팀을 잘 조직하며 팀웍을 위한 철저한 준비를 해야한다. '
  },
  { title:'예산결정과 모금', 
    img:'img/manual_5.jpg', 
    content:'비전트립팀은 멤버 각 개인이 여행을 가는 것이 아니라 해당되는 교회나 단체의 대표로 선교사역을 감당하려 가는 것이다. 그러므로 이에 대해서 책임감을 갖고 준비해야 한다. 필요한 경비도 개인이 일부 부담을 하지만 파송하는 교회가 마음을 함께 할 수 있도록 지원을 받고, 교우들로 하여금 함께 참여하도록 해야한다.'
  },
  { title:'복음 준비하기', 
    img:'img/manual_6.jpg', 
    content:'선교를 가는 가장 본질적인 목적은 <b>복음을 전하는 것</b>이다. 하지만 비전트립은 언어가 가장 큰 문제이다. 이것을 극복하기 위해서 공연이나 여러 가지 활동으로 복음을 전하려 시도한다. 나아가 우리는 그들에게 분명한 복음을 들려줄 필요가 있다. 이것을 위해서 아주 효과적인 도움의 도구가 바로 지금 이 비전트립 앱이다. 이 앱을 활용해서 우리는 그들에게 그들의 언어로 복음을 들려줄 수가 있다. 비전트립 사역을 통해 해야할 가장 중요하고 본질적인 사역이 언어라는 한계때문에 막히는 일이 없도록 이 앱을 통해서 복음을 전해주라.'
  },
  { title:'현지 사역', 
    img:'img/manual_7.jpg', 
    content:'현지에서는 선교사님과 팀리더의 말씀에 반드시 순종하며 잘 따르도록 해야한다. 건강뿐 아니라 어떤 지역은 테러나 정치적인 위험이 있으므로 조심해야 한다. <br><br><ol><li><b>건강</b><br>물과 음식, 기온들이 갑자기 변화되고, 짜여진 일정들을 감당하다보면 건강을 헤칠 위험이 많다. 아프게 되면 팀 전체에게 영향이 가기 때문에 늘 건강을 조심해야 한다.  비전트립 가기전 부터 체력을 키우고, 컨티션 조절을 잘 한다. 현지에 가서 열이 나거나 이상이 있으면 곧바로 보고 하고 처리하도록 한다.</li><li><b>안전</b><br>만약의 사태에 대비하여 현지 선교사님의 직통 연락처과 한국연락처, 한국대사관 등의 정보를 반드시 알고 있어야 한다. </li><li><b>현지중심</b><br>현지에서 어떤 일이 어떻게 일어날지 알 수 없다. 상황에 따른 유연한 대처가 필요하다. 이곳에서 준비한 프로그램이라고 해서 무조건 하는 것이 아니라 현지 상황에 맞추어서 진행해야 한다. </li><li><b>섬김</b><br>선교 현지에 있는 사람들은 우리보다 어리석은 사람이 결코 아니다. 우리보다 미개한 사람이 아니라, 그냥 우리와 다른 문화에 살고 있을 뿐이다. 누가 더 높고 낮음이 없다. 그들을 바라보고 대할 때 마다 그들을 섬기고 존중하는 마음으로 대해야 한다.</li></ol>'
  },
  { title:'사후관리', 
    img:'img/manual_8.jpg', 
    content:'단회적인 여행으로 끝나지 않도록 철저한 사후관리가 필요하다. 그래서 본인 뿐 아니라 교회전체가 지속적인 선교관심을 갖고 땅끝까지 복음을 전하기 위한 지상명령을 수행하도록 도전하여야 한다.<br><br><ol><li><b>보고회</b><br>반드시 해당 교회에 보고서를 작성하고, 보고회를 통해서 선교현황을 보고하고 이를 자료화 하여 보관하도록 한다. </li><li><b>현지와 지속적 연락</b><br>백문이 불여일견 이듯이 한 번 다녀올 사람은 그 곳을 향한 마음이 남 다르다. 이 불이 꺼지지 않도록 지속적으로 그 현지와 소식을 주고 받으며 지속적인 관계가 맺어지도록 한다.  오늘날 SNS는 이를 위해서 매우 훌륭한 도구이다. </li><li><b>손끝선교</b><br>비전트립을 다녀와서 끝이 아니라 오늘날 우리에게 주신 좋은 선교도구인 스마트폰을 활용해서 그들과 지속적인 연락을 주고 받고, 복음의 소식을 나누며, 말씀으로 그들이 양육되어지도록 도와야 한다.</li></ol>'
  } 
  ];
});

// 설정페이지
self_module.controller('SettingCtrl', function($scope, $translate, $ionicPopup, $timeout, $cordovaNetwork, $cordovaFileTransfer, $ionicLoading){
    
  // 네트워크 가능 여부 체크
    document.addEventListener("deviceready", function(){
        var type = $cordovaNetwork.getNetwork()
        
        
        
        if( type == Connection.NONE){//네트워크가 연결되지 않았을 때
            $ionicPopup.alert({
          title: 'Network Problem', // 다국어 설정 필요
          content: 'Sorry, Please Check Your Network Connection.'
        })
        }else if(type == Connection.WIFI){ //와이파이가 연결되었을 때
            $ionicPopup.confirm({
          title: 'Network Ok',
          content: 'Your Network is WIFI. Click "Ok" for download language version',
          }).then(function(res){
                if(res == true){ // 언어설정 파일 다운로드를 요청할 때
                    // 파일 다운로드 시작
                    $ionicLoading.show({
                        template: 'Loading...'
                        });
                    
                    
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
                        fs.root.getDirectory(
                            "ExampleProject",
                            {
                            create: true
                            },
                            function(dirEntry) {
                                    dirEntry.getFile(
                                        "package.json", 
                                        {
                                            create: true, 
                                            exclusive: false
                                        }, 
                                        function gotFileEntry(fe) {
                                            var p = fe.toURL();
                                            fe.remove();
                                            ft = new FileTransfer();
                                            ft.download(
                                    encodeURI("https://raw.githubusercontent.com/neohum/filedown/master/package.json"),
                                                p,
                                                function(entry) {
                                                    $ionicLoading.hide();
                                                    
                                                },
                                                function(error) {
                                                    $ionicLoading.hide();
                                                   
                                                    alert("Download Error Source -> " + error.source);
                                                },
                                                false,
                                                null
                                            );
                                        }, 
                                        function() {
                                            $ionicLoading.hide();
                                            
                                        }
                                    );
                                }
                        );
                        },
                        function() {
                            $ionicLoading.hide();
                            console.log("Request for filesystem failed");
                            $scope.test_log += "<br>Request for filesystem failed";
                        });
                    // 파일 다운로드 종료
                    
                }else{ //언어설정 파일 다운로드를 거부할 때
                    $ionicPopup.alert({
                        title: 'Cancel',
                        content: 'your click Cancel'
                    })
                }
            })
        }else{
            $ionicPopup.alert({
          title: 'Network Ok',
          content: 'Your Network is Cell generic connection!! Please Go to the network setting for change to WIFI!'
          })
             }
    }, false);



  $scope.langs = [
    {key:'ko-KR', value:'한국어', id:1},
    {key:'en-US', value:'English', id:2}
  ];  

  for (item in $scope.langs){
    if ($scope.langs[item].key == $translate.use()) {
      $scope.myLanguage = $scope.langs[item];
    }
  };

    $scope.change_lang = function(lang){
      $scope.sel_text = lang;
      $translate.use(lang);

      // var alertPopup = $ionicPopup.alert({
      //   title : '언어 변경',
      //   template : '다시 실행하면 언어가 적용됩니다. 2초후 자동종료.'
      // });

      // $timeout(function() {
      //   window.close();
      //   ionic.Platform.exitApp();             
      // }, 2000);

    };

});


// var myAudio = new Audio();

// function audioPlay(str){
//   myAudio.src = str;
//   myAudio.load();
//   myAudio.current=0;
//   myAudio.play();
// };

// function audioStop(){
//   console.log("Audio Stop");
//     myAudio.pause();
//   };

