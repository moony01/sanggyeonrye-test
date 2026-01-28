let tmURL;
// const urlMale = "https://teachablemachine.withgoogle.com/models/OjV8A4hkV/"; //v1
const urlMale = "https://teachablemachine.withgoogle.com/models/9yhf9-8B7/"; //v2
// const urlFemale = "https://teachablemachine.withgoogle.com/models/VXq81IU-K/"; //v1
const urlFemale = "https://teachablemachine.withgoogle.com/models/Fq3_K1cua/"; //v2
let model, webcam, labelContainer, maxPredictions;
let langType = "";
let langYn = "";
let loc = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2] + "/" + window.location.href.split("/")[3] + "/";
var deferredPrompt;

// T1.2: 결과 이미지 저장/공유를 위한 전역 변수
var currentAgency = "";        // 현재 결과 소속사 코드 (sm, jyp, yg, hybe)
var currentResultTitle = "";   // 결과 제목 (예: "SM얼굴상")
var currentResultExplain = ""; // 해시태그 설명
var currentResultCeleb = "";   // 대표 연예인
var currentPredictions = [];   // T1.10: AI 예측 결과 배열 (퍼센트 바 차트용)

// T1.13: 다국어 Alert 메시지 (15개 언어 지원)
var ALERT_MESSAGES = {
  urlCopied: {
    ko: 'URL이 복사되었습니다.',
    en: 'URL copied!',
    ja: 'URLがコピーされました。',
    zh: 'URL已复制！',
    de: 'URL kopiert!',
    es: '¡URL copiada!',
    fr: 'URL copiée !',
    id: 'URL disalin!',
    nl: 'URL gekopieerd!',
    pl: 'URL skopiowany!',
    pt: 'URL copiado!',
    ru: 'URL скопирован!',
    tr: 'URL kopyalandı!',
    uk: 'URL скопійовано!',
    vi: 'Đã sao chép URL!'
  },
  completeTestFirst: {
    ko: '먼저 테스트를 완료해주세요!',
    en: 'Please complete the test first!',
    ja: 'まずテストを完了してください！',
    zh: '请先完成测试！',
    de: 'Bitte zuerst den Test abschließen!',
    es: '¡Por favor completa el test primero!',
    fr: 'Veuillez d\'abord terminer le test !',
    id: 'Silakan selesaikan tes terlebih dahulu!',
    nl: 'Voltooi eerst de test!',
    pl: 'Najpierw ukończ test!',
    pt: 'Por favor, complete o teste primeiro!',
    ru: 'Сначала завершите тест!',
    tr: 'Lütfen önce testi tamamlayın!',
    uk: 'Спочатку завершіть тест!',
    vi: 'Vui lòng hoàn thành bài test trước!'
  },
  imageFailed: {
    ko: '이미지 생성에 실패했습니다. 다시 시도해주세요.',
    en: 'Failed to create image. Please try again.',
    ja: '画像の作成に失敗しました。もう一度お試しください。',
    zh: '图片创建失败，请重试。',
    de: 'Bild konnte nicht erstellt werden. Bitte erneut versuchen.',
    es: 'Error al crear la imagen. Inténtalo de nuevo.',
    fr: 'Échec de la création de l\'image. Veuillez réessayer.',
    id: 'Gagal membuat gambar. Silakan coba lagi.',
    nl: 'Kan afbeelding niet maken. Probeer opnieuw.',
    pl: 'Nie udało się utworzyć obrazu. Spróbuj ponownie.',
    pt: 'Falha ao criar imagem. Tente novamente.',
    ru: 'Не удалось создать изображение. Попробуйте снова.',
    tr: 'Görüntü oluşturulamadı. Lütfen tekrar deneyin.',
    uk: 'Не вдалося створити зображення. Спробуйте ще раз.',
    vi: 'Tạo ảnh thất bại. Vui lòng thử lại.'
  }
};

// 다국어 메시지 가져오기 함수
function getAlertMessage(key) {
  var lang = langType || 'ko';
  if (ALERT_MESSAGES[key] && ALERT_MESSAGES[key][lang]) {
    return ALERT_MESSAGES[key][lang];
  }
  return ALERT_MESSAGES[key] ? ALERT_MESSAGES[key]['en'] : key;
}

document.addEventListener('DOMContentLoaded', function() {
  var headerIcon = document.getElementById('header__icon');
  var siteCache = document.getElementById('site-cache');
  var body = document.body;
  langType = location.pathname.split("/")[2];

  // if(!langType == "" || !langType == null || !langType == "ko") {
  //   document.getElementsByTagName("html")[0].setAttribute("lang", langType);
  //   langYn = '../';
  // } else {
  //   document.getElementsByTagName("html")[0].setAttribute("lang", "ko");
  // }

  Kakao.init('8329cd81f78ef956d4487f90e5a4cd49'); 

  headerIcon.addEventListener('click', function(e) {
    e.preventDefault();
    body.classList.toggle('with--sidebar');
  });

  siteCache.addEventListener('click', function() {
    body.classList.remove('with--sidebar');
  });
});

window.addEventListener('beforeinstallprompt', function(e) {
  console.log('beforeinstallprompt Event fired');
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  //class명 app-download 를 display:block 으로 변경
  document.querySelector(".app-download").style.display = "block";

  return false;
});

//header 메뉴 클릭시 페이지 이동
function fnMovePage(page) {
  if(page == "" || page == null) {
      location.href = loc;
    } else if(page == "blog") {
      location.href = "/";
    } else {
      window.open("https://mbtichat.info", "_blank");
    }
}

//언어 변경
function fnChangeLang(lang) {
  langType = lang.value;
  if(langType == "" || langType == null || langType == "ko") {
    location.href = loc;
  } else {
    location.href = loc+langType;
  }
}

//파일 업로드
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('.image-upload-wrap').hide();
      $('#loading').show();
      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();
      $('.image-title').html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
    init().then(()=>{
        predict();
        $('#loading').hide();
    });
  } else {
      removeUpload();
  }
}

//파일 삭제버튼
function removeUpload() {
  //페이지 새로고침
  location.reload();
}

//공유하기 버튼클릭
function fn_sendFB(sns) {
  var thisUrl = ""
  var snsTitle = "";
  var snsDesc = "";
  var thumbUrl = "";
  langType = location.pathname.split("/")[2];
  if(!langType == "" || !langType == null || !langType == "ko") {
    thisUrl = loc+langType;
    thumbUrl = "https://moony01.com/kpopface/static/img/share/thumb-en.jpg";
    if(langType == "en") {
      // 영어 번역
      snsTitle = "KPOP Face Test";
      snsDesc = "What is my facial resemblance to K-POP entertainment agencies?";
    } else if(langType == "de") {
      // 독일어 번역
      snsTitle = "KPOP Gesichtstest";
      snsDesc = "Wie ähnlich sieht mein Gesicht den K-POP Unterhaltungsagenturen aus?";
    } else if(langType == "es") {
      // 스페인어 번역
      snsTitle = "Prueba de Rostro KPOP";
      snsDesc = "¿A qué agencia de entretenimiento de K-POP se parece mi rostro?";
    } else if(langType == "fr") {
      // 프랑스어 번역
      snsTitle = "Test du Visage KPOP";
      snsDesc = "À quelle agence de divertissement K-POP ressemble mon visage ?";
    } else if(langType == "id") {
      // 인도네시아어 번역
      snsTitle = "Tes Wajah KPOP";
      snsDesc = "Wajah saya menyerupai agensi hiburan K-POP yang mana?";
    } else if(langType == "ja") {
      // 일본어 번역
      snsTitle = "KPOP顔診断テスト";
      snsDesc = "私の顔はK-POPエンターテインメント事務所にどれくらい似ているでしょうか？";
    } else if(langType == "nl") {
      // 네덜란드어 번역
      snsTitle = "KPOP Gezichtstest";
      snsDesc = "Hoe lijkt mijn gezicht op K-POP entertainmentbureaus?";
    } else if(langType == "pl") {
      // 폴란드어 번역
      snsTitle = "Test twarzy KPOP";
      snsDesc = "Jakie są podobieństwa mojej twarzy do agencji rozrywkowych K-POP?";
    } else if(langType == "pt") {
      // 포르투갈어 번역
      snsTitle = "Teste de Rosto KPOP";
      snsDesc = "Qual é a semelhança do meu rosto com as agências de entretenimento K-POP?";
    } else if(langType == "ru") {
      // 러시아어 번역
      snsTitle = "Тест на лицо KPOP";
      snsDesc = "Какое сходство моего лица с агентствами развлечений K-POP?";
    } else if(langType == "tr") {
      // 터키어 번역
      snsTitle = "KPOP Yüz Testi";
      snsDesc = "Yüzüm K-POP eğlence ajanslarına ne kadar benziyor?";
    } else if(langType == "uk") {
      // 우크라이나어 번역
      snsTitle = "Тест на обличчя KPOP";
      snsDesc = "До яких агентств розваг K-POP схоже моє обличчя?";
    } else if(langType == "vi") {
      // 베트남어 번역
      snsTitle = "Kiểm Tra Khuôn Mặt KPOP";
      snsDesc = "Gương mặt của tôi giống với công ty giải trí K-POP nào?";
    } else if(langType == "zh") {
      // 중국어 번역
      snsTitle = "KPOP脸部测试";
      snsDesc = "我的脸与K-POP娱乐公司相似吗？";
    } else {
      // 영어 번역
      snsTitle = "KPOP Face Test";
      snsDesc = "What is my facial resemblance to K-POP entertainment agencies?";
    }
  } else {
    thisUrl = loc;
    thumbUrl = "https://moony01.com/kpopface/static/img/share/thumb.jpg";
    snsTitle = "케이팝 얼굴상 테스트";
    snsDesc = "내 얼굴은 K-POP 엔터 소속사중 어떤 얼굴상일까?";
  }

  if( sns == 'facebook' ) {
    var url = "http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(thisUrl);
    window.open(url, "", "width=486, height=286");
  }
  else if( sns == 'twitter' ) {
    var url = "http://twitter.com/share?url="+encodeURIComponent(thisUrl)+"&text="+encodeURIComponent(snsTitle);
    window.open(url, "tweetPop", "width=486, height=286,scrollbars=yes");
  }
  else if( sns == 'band' ) {
    var url = "http://www.band.us/plugin/share?body="+encodeURIComponent(snsTitle)+"&route="+encodeURIComponent(thisUrl);
    window.open(url, "shareBand", "width=400, height=500, resizable=yes");
  }
  else if( sns == 'kakaotalk' ) {
    // 카카오링크 버튼 생성
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: snsTitle,                    // 제목
          description: snsDesc,               // 설명
          imageUrl: thumbUrl,  // 썸네일 이미지
          link: {
              mobileWebUrl: thisUrl,
              webUrl: thisUrl
          }
        }
    });
  } else if( sns == 'kakaostory') {
    // 사용할 앱의 JavaScript 키 설정
    Kakao.Story.share({
      url: thisUrl,
      text: snsTitle
    });
  } else if( sns == 'copyurl') {
    var tmp = document.createElement('input');
    var url = thisUrl;
    document.body.appendChild(tmp);
    tmp.value = url;
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
    alert(getAlertMessage('urlCopied'));
  } 
}

/**
 * T1.2: 결과 이미지 저장/공유 함수
 * - 모바일: Web Share API로 공유
 * - PC: 자동 다운로드
 */
async function fnSaveResultImage() {
  // 저장 버튼 찾기 (중복 클릭 방지)
  var saveBtn = document.getElementById('save-image-btn');
  var originalText = '';
  if (saveBtn) {
    originalText = saveBtn.querySelector('.save-image-text') ? 
                   saveBtn.querySelector('.save-image-text').textContent : 
                   saveBtn.textContent;
    saveBtn.disabled = true;
    if (saveBtn.querySelector('.save-image-text')) {
      saveBtn.querySelector('.save-image-text').textContent = '생성중...';
    } else {
      saveBtn.textContent = '생성중...';
    }
  }
  
  try {
    // 결과가 있는지 확인
    if (!currentAgency || !currentResultTitle) {
      alert(getAlertMessage('completeTestFirst'));
      return;
    }
    
    // T1.9: 사용자 업로드 이미지 가져오기
    var userImage = document.getElementById('face-image');
    var userImageSrc = userImage ? userImage.src : null;
    
    // generateResultImage 함수 호출 (imageGenerator.js)
    var imageBlob = await generateResultImage({
      agency: currentAgency,
      title: currentResultTitle,
      explain: currentResultExplain,
      celeb: currentResultCeleb,
      lang: langType || 'ko',
      userImageSrc: userImageSrc,  // T1.9: 사용자 이미지 전달
      predictions: currentPredictions  // T1.10: AI 예측 결과 (퍼센트 바 차트)
    });
    
    // 파일명 생성
    var fileName = 'kpop-face-result-' + currentAgency + '.png';
    var imageFile = new File([imageBlob], fileName, { type: 'image/png' });
    
    // 모바일: Web Share API 사용
    if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      await navigator.share({
        files: [imageFile],
        title: 'K-POP Face Test Result',
        text: currentResultTitle
      });
      console.log('Image shared successfully');
    } else {
      // PC: 자동 다운로드
      var downloadUrl = URL.createObjectURL(imageBlob);
      var downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
      console.log('Image downloaded:', fileName);
    }
    
  } catch (error) {
    console.error('결과 이미지 저장/공유 실패:', error);
    alert(getAlertMessage('imageFailed'));
  } finally {
    // 버튼 상태 복구
    if (saveBtn) {
      saveBtn.disabled = false;
      if (saveBtn.querySelector('.save-image-text')) {
        saveBtn.querySelector('.save-image-text').textContent = originalText;
      } else {
        saveBtn.textContent = originalText;
      }
    }
  }
}

//모달팝업창 닫기
function fnClose() {
  document.querySelector(".modal").style.display = "none";
}

//앱 다운로드 페이지 이동
function fnAppDownloadPage(app) {
  if (app == "android") {
    var url = "https://play.google.com/store/apps/details?id=com.mhhan01.kpopface"
    window.open(url);
  } else if (app == "a2hs") {
    if(deferredPrompt !== undefined) {
      // The user has had a postive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();
  
      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then(function(choiceResult) {
  
        console.log(choiceResult.outcome);
  
        if(choiceResult.outcome == 'dismissed') {
          console.log('User cancelled home screen install');
        }
        else {
          console.log('User added to home screen');
        }
  
        // We no longer need the prompt.  Clear it up.
        deferredPrompt = null;
      });
    }

  }
}
/* ******************************************************************************************
 * FUNCTION
****************************************************************************************** */
//이미지 로드
async function init() {
  if (document.getElementById("gender").checked) {
    tmURL = urlMale;
  } else {
    tmURL = urlFemale;
  }
  const modelURL = tmURL + "model.json";
  const metadataURL = tmURL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    var element = document.createElement("div")
    element.classList.add("d-flex");
    labelContainer.appendChild(element);
  }
}
//이미지 로드 결과
async function predict() {
  var image = document.getElementById("face-image")
  const prediction = await model.predict(image, false);
  prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability))
  console.log(prediction[0].className);
  var resultTitle, resultExplain, resultCeleb;
  langType = location.pathname.split("/")[2];
  if (document.getElementById("gender").checked) {
    switch (prediction[0].className) {
      case "sm":
        if(!langType == "" || !langType == null || !langType == "ko") {
          if(langType == "en") {
            // 영어 번역
            resultTitle = "SM Face Type";
            resultExplain = "#Flower Boy, #Deep Double Eyelids, #Classic Handsome";
            resultCeleb = "Celebrities from SM Entertainment: Super Junior's Kim Hee-chul, Super Junior's Choi Si-won, TVXQ's Hero Jaejoong, SHINee's Taemin, SHINee's Minho, EXO's Kai, NCT's Taeyong";
          } else if(langType == "de") {
            // 독일어 번역
            resultTitle = "SM Gesichtstyp";
            resultExplain = "#Blumenjunge, #Tiefe Doppelte Augenlider, #Klassisch Hübsch";
            resultCeleb = "Berühmtheiten von SM Entertainment: Super Junior's Kim Hee-chul, Super Junior's Choi Si-won, TVXQ's Hero Jaejoong, SHINee's Taemin, SHINee's Minho, EXO's Kai, NCT's Taeyong";
          } else if(langType == "es") {
            // 스페인어 번역
            resultTitle = "Tipo de Rostro de SM";
            resultExplain = "#Chico de Flores, #Párpados Dobles Profundos, #Galan Clásico";
            resultCeleb = "Celebridades de SM Entertainment: Kim Hee-chul de Super Junior, Choi Si-won de Super Junior, Hero Jaejoong de TVXQ, Taemin de SHINee, Minho de SHINee, Kai de EXO, Taeyong de NCT";
          } else if(langType == "fr") {
            // 프랑스어 번역
            resultTitle = "Type de Visage SM";
            resultExplain = "#Beau Garçon, #Paupières Doubles Profondes, #Beau Classique";
            resultCeleb = "Célébrités de SM Entertainment: Kim Hee-chul de Super Junior, Choi Si-won de Super Junior, Hero Jaejoong de TVXQ, Taemin de SHINee, Minho de SHINee, Kai de EXO, Taeyong de NCT";
          } else if(langType == "id") {
            // 인도네시아어 번역
            resultTitle = "Tipe Wajah SM";
            resultExplain = "#Flower Boy, #Lipatan Mata Ganda Dalam, #Ganteng Klasik";
            resultCeleb = "Selebriti dari SM Entertainment: Kim Hee-chul dari Super Junior, Choi Si-won dari Super Junior, Hero Jaejoong dari TVXQ, Taemin dari SHINee, Minho dari SHINee, Kai dari EXO, Taeyong dari NCT";
          } else if(langType == "ja") {
            // 일본어 번역
            resultTitle = "SMの顔タイプ";
            resultExplain = "#フラワーボーイ、#深い二重瞼、#クラシックハンサム";
            resultCeleb = "SMエンターテインメントの有名人：スーパージュニアのキム・ヒチョル、スーパージュニアのチェ・シウォン、東方神起のヒーロー・ジェジュン、SHINeeのテミン、SHINeeのミンホ、EXOのカイ、NCTのテヨン";
          } else if(langType == "nl") {
            // 네덜란드어 번역
            resultTitle = "SM Gezichtstype";
            resultExplain = "#Bloemenjongen, #Diepe Dubbele Oogleden, #Klassiek Knap";
            resultCeleb = "Beroemdheden van SM Entertainment: Kim Hee-chul van Super Junior, Choi Si-won van Super Junior, Hero Jaejoong van TVXQ, Taemin van SHINee, Minho van SHINee, Kai van EXO, Taeyong van NCT";
          } else if(langType == "pl") {
            // 폴란드어 번역
            resultTitle = "Typ Twarzy SM";
            resultExplain = "#Chłopak Kwiatowy, #Głębokie Podwójne Powieki, #Klasyczny Przystojny";
            resultCeleb = "Celebryci z SM Entertainment: Kim Hee-chul z Super Junior, Choi Si-won z Super Junior, Hero Jaejoong z TVXQ, Taemin z SHINee, Minho z SHINee, Kai z EXO, Taeyong z NCT";
          } else if(langType == "pt") {
            // 포르투갈어 번역
            resultTitle = "Tipo de Rosto SM";
            resultExplain = "#Rapaz Flor, #Pálpebras Duplas Profundas, #Bonito Clássico";
            resultCeleb = "Celebridades da SM Entertainment: Kim Hee-chul do Super Junior, Choi Si-won do Super Junior, Hero Jaejoong do TVXQ, Taemin do SHINee, Minho do SHINee, Kai do EXO, Taeyong do NCT";
          } else if(langType == "ru") {
            // 러시아어 번역
            resultTitle = "Тип лица SM";
            resultExplain = "#Цветочный парень, #Глубокие двойные веки, #Классическая красота";
            resultCeleb = "Знаменитости из SM Entertainment: Ким Хи-чоль из Super Junior, Чхве Сы-вон из Super Junior, Хиро Джеджун из TVXQ, Тэмин из SHINee, Минхо из SHINee, Кай из EXO, Тэён из NCT";
          } else if(langType == "tr") {
            // 터키어 번역
            resultTitle = "SM Yüz Tipi";
            resultExplain = "#Çiçek Çocuk, #Derin Çift Göz Kapağı, #Klasik Yakışıklı";
            resultCeleb = "SM Eğlence Ünlüleri: Super Junior'dan Kim Hee-chul, Super Junior'dan Choi Si-won, TVXQ'dan Hero Jaejoong, SHINee'den Taemin, SHINee'den Minho, EXO'dan Kai, NCT'den Taeyong";
          } else if(langType == "uk") {
            // 우크라이나어 번역
            resultTitle = "Тип обличчя SM";
            resultExplain = "#Квітковий Хлопець, #Глибокий Подвійний Перетинка, #Класично Гарний";
            resultCeleb = "Знаменитості від SM Entertainment: Кім Хі-чоль з Super Junior, Чхве Сі-вон з Super Junior, Герой Джеджун з TVXQ, Темін з SHINee, Мінхо з SHINee, Кай з EXO, Тейон з NCT";
          } else if(langType == "vi") {
            // 베트남어 번역
            resultTitle = "Kiểu Mặt của SM";
            resultExplain = "#Hoàng Tử Hoa, #Mí Mắt kép Sâu, #Đẹp Trai Cổ điển";
            resultCeleb = "Các nghệ sĩ nổi tiếng thuộc công ty giải trí SM: Kim Hee-chul của Super Junior, Choi Si-won của Super Junior, Hero Jaejoong của TVXQ, Taemin của SHINee, Minho của SHINee, Kai của EXO, Taeyong của NCT";
          } else if(langType == "zh") {
            // 중국어 번역
            resultTitle = "SM脸型";
            resultExplain = "#花美男, #深双眼皮, #经典帅气";
            resultCeleb = "SM娱乐公司的名人：Super Junior的金希澈，Super Junior的崔始源，TVXQ的张艺兴，SHINee的李泰民，SHINee的崔珉豪，EXO的金钟大，NCT的李泰容";
          } else {
            // 영어 번역
            resultTitle = "SM Face Type";
            resultExplain = "#Flower Boy, #Deep Double Eyelids, #Classic Handsome";
            resultCeleb = "Celebrities from SM Entertainment: Super Junior's Kim Hee-chul, Super Junior's Choi Si-won, TVXQ's Hero Jaejoong, SHINee's Taemin, SHINee's Minho, EXO's Kai, NCT's Taeyong";
          }
        } else {
          resultTitle = "SM얼굴상";
          resultExplain = "#꽃미남, #짙은 쌍커풀, #정석 미남";
          resultCeleb = "SM출신 연예인: 슈퍼주니어 김희철, 슈퍼주니어 최시원, 동방신기 영웅재중, 샤이니 태민, 샤이니 민호, 엑소 카이, NCT 태용";
        }
        break;
      case "jyp":
        if(!langType == "" || !langType == null || !langType == "ko") {
          if(langType == "en") {
            // 영어 번역
            resultTitle = "JYP Face Type";
            resultExplain = "#Monolids, #Charming Visuals, #Gentle Impression";
            resultCeleb = "Celebrities from JYP Entertainment: Rain, 2PM's Lee Junho, 2PM's Wooyoung, 2AM's Jung Jinwoon, GOT7's Youngjae, DAY6's Dowoon";
          } else if(langType == "de") {
            // 독일어 번역
            resultTitle = "JYP Gesichtstyp";
            resultExplain = "#Monolids, #Charmante Optik, #Sanfter Eindruck";
            resultCeleb = "Berühmtheiten von JYP Entertainment: Rain, Lee Junho von 2PM, Wooyoung von 2PM, Jung Jinwoon von 2AM, Youngjae von GOT7, Dowoon von DAY6";
          } else if(langType == "es") {
            // 스페인어 번역
            resultTitle = "Tipo de Rostro de JYP";
            resultExplain = "#Monolidos, #Atractivo Visual, #Impresión Gentil";
            resultCeleb = "Celebridades de JYP Entertainment: Rain, Lee Junho de 2PM, Wooyoung de 2PM, Jung Jinwoon de 2AM, Youngjae de GOT7, Dowoon de DAY6";
          } else if(langType == "fr") {
            // 프랑스어 번역
            resultTitle = "Type de Visage de JYP";
            resultExplain = "#Monolids, #Visuels Charmants, #Impression Douce";
            resultCeleb = "Célébrités de JYP Entertainment: Rain, Lee Junho de 2PM, Wooyoung de 2PM, Jung Jinwoon de 2AM, Youngjae de GOT7, Dowoon de DAY6";
          } else if(langType == "id") {
            // 인도네시아어 번역
            resultTitle = "Tipe Wajah JYP";
            resultExplain = "#Kelopak Mata Tunggal, #Visual Menawan, #Kesan Lembut";
            resultCeleb = "Selebriti dari JYP Entertainment: Rain, Lee Junho dari 2PM, Wooyoung dari 2PM, Jung Jinwoon dari 2AM, Youngjae dari GOT7, Dowoon dari DAY6";
          } else if(langType == "ja") {
            // 일본어 번역
            resultTitle = "JYPの顔タイプ";
            resultExplain = "#一重瞼、#魅力的なビジュアル、#柔らかな印象";
            resultCeleb = "JYPエンターテインメントの有名人：レイン、2PMのイ・ジュンホ、2PMのウヨン、2AMのジョン・ジヌン、GOT7のヨンジェ、DAY6のドウン";
          } else if(langType == "nl") {
            // 네덜란드어 번역
            resultTitle = "JYP Gezichtstype";
            resultExplain = "#Enkele Oogleden, #Aantrekkelijke Uitstraling, #Zachte Indruk";
            resultCeleb = "Beroemdheden van JYP Entertainment: Rain, Lee Junho van 2PM, Wooyoung van 2PM, Jung Jinwoon van 2AM, Youngjae van GOT7, Dowoon van DAY6";
          } else if(langType == "pl") {
            // 폴란드어 번역
            resultTitle = "Typ Twarzy JYP";
            resultExplain = "#Powieki Jednokrotne, #Urokliwe Wizualne, #Łagodne Wrażenie";
            resultCeleb = "Celebryci z JYP Entertainment: Rain, Lee Junho z 2PM, Wooyoung z 2PM, Jung Jinwoon z 2AM, Youngjae z GOT7, Dowoon z DAY6";
          } else if(langType == "pt") {
            // 포르투갈어 번역
            resultTitle = "Tipo de Rosto JYP";
            resultExplain = "#Pálpebras Monolids, #Visual Encantador, #Impressão Suave";
            resultCeleb = "Celebridades da JYP Entertainment: Rain, Lee Junho do 2PM, Wooyoung do 2PM, Jung Jinwoon do 2AM, Youngjae do GOT7, Dowoon do DAY6";
          } else if(langType == "ru") {
            // 러시아어 번역
            resultTitle = "Тип лица JYP";
            resultExplain = "#Моно-веки, #Очаровательная внешность, #Мягкое впечатление";
            resultCeleb = "Знаменитости из JYP Entertainment: Рейн, Ли Чжунхо из 2PM, Ву Ён из 2PM, Чон Чинун из 2AM, Йондже из GOT7, Довун из DAY6";
          } else if(langType == "tr") {
            // 터키어 번역
            resultTitle = "JYP Yüz Tipi";
            resultExplain = "#Tek Göz Kapakları, #Büyüleyici Görünüm, #Yumuşak İzlenim";
            resultCeleb = "JYP Eğlence Ünlüleri: Rain, 2PM'den Lee Junho, 2PM'den Wooyoung, 2AM'den Jung Jinwoon, GOT7'den Youngjae, DAY6'den Dowoon";
          } else if(langType == "uk") {
            // 우크라이나어 번역
            resultTitle = "Тип обличчя JYP";
            resultExplain = "#Моно-повіки, #Чарівна Зовнішність, #М'який Враження";
            resultCeleb = "Знаменитості від JYP Entertainment: Рейн, Лі Чжунхо з 2PM, Ву Ён з 2PM, Чон Чинун з 2AM, Йондже з GOT7, Довун з DAY6";
          } else if(langType == "vi") {
            // 베트남어 번역
            resultTitle = "Kiểu Mặt của JYP";
            resultExplain = "#Mắt Kép, #Visual Quyến Rũ, #Ấn Tượng Dịu Dàng";
            resultCeleb = "Các nghệ sĩ nổi tiếng thuộc công ty giải trí JYP: Rain, Lee Junho của 2PM, Wooyoung của 2PM, Jung Jinwoon của 2AM, Youngjae của GOT7, Dowoon của DAY6";
          } else if(langType == "zh") {
            // 중국어 번역
            resultTitle = "JYP脸型";
            resultExplain = "#单眼皮, #有魅力的外貌, #温柔的印象";
            resultCeleb = "JYP娱乐公司的名人：Rain，2PM的李俊昊，2PM的玉荣，2AM的郑振云，GOT7的燕宰，DAY6的道云";
          } else {
            // 영어 번역
            resultTitle = "JYP Face Type";
            resultExplain = "#Monolids, #Charming Visuals, #Gentle Impression";
            resultCeleb = "Celebrities from JYP Entertainment: Rain, 2PM's Lee Junho, 2PM's Wooyoung, 2AM's Jung Jinwoon, GOT7's Youngjae, DAY6's Dowoon";
          }
        } else {
          resultTitle = "JYP얼굴상";
          resultExplain = "#무쌍커풀, #매력있는 비주얼 #부드러운 인상";
          resultCeleb = "JYP출신 연예인: 비, 2PM 이준호, 2PM 우영, 2AM 정진운, GOT7 영재, DAY6 도운";
        }
        break;
      case "yg":
        if(!langType == "" || !langType == null || !langType == "ko") {
          if(langType == "en") {
          // 영어 번역
          resultTitle = "YG Face Type";
          resultExplain = "#Distinctive Visuals, #Hip-hop Style, #Playful";
          resultCeleb = "Celebrities from YG Entertainment: BIGBANG's G-Dragon, BIGBANG's Taeyang, BIGBANG's Daesung, WINNER's Song Minho, WINNER's Kang Seungyoon, iKON's B.I, iKON's Bobby";
          } else if(langType == "de") {
          // 독일어 번역
          resultTitle = "YG Gesichtstyp";
          resultExplain = "#Besondere Optik, #Hip-hop Stil, #Verspielt";
          resultCeleb = "Berühmtheiten von YG Entertainment: G-Dragon von BIGBANG, Taeyang von BIGBANG, Daesung von BIGBANG, Song Minho von WINNER, Kang Seungyoon von WINNER, B.I von iKON, Bobby von iKON";
          } else if(langType == "es") {
          // 스페인어 번역
          resultTitle = "Tipo de Rostro de YG";
          resultExplain = "#Visuales Distintivos, #Estilo Hip-hop, #Travieso";
          resultCeleb = "Celebridades de YG Entertainment: G-Dragon de BIGBANG, Taeyang de BIGBANG, Daesung de BIGBANG, Song Minho de WINNER, Kang Seungyoon de WINNER, B.I de iKON, Bobby de iKON";
          } else if(langType == "fr") {
          // 프랑스어 번역
          resultTitle = "Type de Visage de YG";
          resultExplain = "#Visuels Distinctifs, #Style Hip-hop, #Esprit Facétieux";
          resultCeleb = "Célébrités de YG Entertainment: G-Dragon de BIGBANG, Taeyang de BIGBANG, Daesung de BIGBANG, Song Minho de WINNER, Kang Seungyoon de WINNER, B.I de iKON, Bobby de iKON";
          } else if(langType == "id") {
          // 인도네시아어 번역
          resultTitle = "Tipe Wajah YG";
          resultExplain = "#Visual Khas, #Gaya Hip-hop, #Nakal";
          resultCeleb = "Selebriti dari YG Entertainment: G-Dragon dari BIGBANG, Taeyang dari BIGBANG, Daesung dari BIGBANG, Song Minho dari WINNER, Kang Seungyoon dari WINNER, B.I dari iKON, Bobby dari iKON";
          } else if(langType == "ja") {
          // 일본어 번역
          resultTitle = "YGの顔タイプ";
          resultExplain = "#個性的なビジュアル、#ヒップホップスタイル、#いたずらっ子";
          resultCeleb = "YGエンターテインメントの有名人：BIGBANGのG-ドラゴン、BIGBANGのタヨン、BIGBANGのデソン、WINNERのソン・ミンホ、WINNERのカン・スンユン、iKONのB.I、iKONのボビー";
          } else if(langType == "nl") {
          // 네덜란드어 번역
          resultTitle = "YG Gezichtstype";
          resultExplain = "#Opvallende Uitstraling, #Hip-hop Stijl, #Speels";
          resultCeleb = "Beroemdheden van YG Entertainment: G-Dragon van BIGBANG, Taeyang van BIGBANG, Daesung van BIGBANG, Song Minho van WINNER, Kang Seungyoon van WINNER, B.I van iKON, Bobby van iKON";
          } else if(langType == "pl") {
          // 폴란드어 번역
          resultTitle = "Typ Twarzy YG";
          resultExplain = "#Charakterystyczna Wizualizacja, #Styl Hip-hop, #Figlarny";
          resultCeleb = "Celebryci z YG Entertainment: G-Dragon z BIGBANG, Taeyang z BIGBANG, Daesung z BIGBANG, Song Minho z WINNER, Kang Seungyoon z WINNER, B.I z iKON, Bobby z iKON";
          } else if(langType == "pt") {
          // 포르투갈어 번역
          resultTitle = "Tipo de Rosto YG";
          resultExplain = "#Visuais Distintos, #Estilo Hip-hop, #Traquinas";
          resultCeleb = "Celebridades da YG Entertainment: G-Dragon do BIGBANG, Taeyang do BIGBANG, Daesung do BIGBANG, Song Minho do WINNER, Kang Seungyoon do WINNER, B.I do iKON, Bobby do iKON";
          } else if(langType == "ru") {
          // 러시아어 번역
          resultTitle = "Тип лица YG";
          resultExplain = "#Выразительная внешность, #Хип-хоп стиль, #Шалун";
          resultCeleb = "Знаменитости из YG Entertainment: G-Dragon из BIGBANG, Taeyang из BIGBANG, Daesung из BIGBANG, Song Minho из WINNER, Kang Seungyoon из WINNER, B.I из iKON, Bobby из iKON";
          } else if(langType == "tr") {
          // 터키어 번역
          resultTitle = "YG Yüz Tipi";
          resultExplain = "#Belirgin Görünüm, #Hip-hop Tarzı, #Şakacı";
          resultCeleb = "YG Eğlence Ünlüleri: BIGBANG'den G-Dragon, BIGBANG'den Taeyang, BIGBANG'den Daesung, WINNER'dan Song Minho, WINNER'dan Kang Seungyoon, iKON'dan B.I, iKON'dan Bobby";
          } else if(langType == "uk") {
          // 우크라이나어 번역
          resultTitle = "Тип обличчя YG";
          resultExplain = "#Характерний Вигляд, #Стиль Хіп-хоп, #Жартівливий";
          resultCeleb = "Знаменитості від YG Entertainment: G-Dragon з BIGBANG, Taeyang з BIGBANG, Daesung з BIGBANG, Song Minho з WINNER, Kang Seungyoon з WINNER, B.I з iKON, Bobby з iKON";
          } else if(langType == "vi") {
          // 베트남어 번역
          resultTitle = "Kiểu Mặt của YG";
          resultExplain = "#Visual Đặc biệt, #Phong cách Hip-hop, #Trẻ trung";
          resultCeleb = "Các nghệ sĩ nổi tiếng thuộc công ty giải trí YG: G-Dragon của BIGBANG, Taeyang của BIGBANG, Daesung của BIGBANG, Song Minho của WINNER, Kang Seungyoon của WINNER, B.I của iKON, Bobby của iKON";
          } else if(langType == "zh") {
          // 중국어 번역
          resultTitle = "YG脸型";
          resultExplain = "#个性化外貌, #嘻哈风格, #顽皮";
          resultCeleb = "YG娱乐公司的名人：BIGBANG的G-Dragon，BIGBANG的太阳，BIGBANG的大胜，WINNER的宋旻浩，WINNER的姜胜允，iKON的B.I，iKON的Bobby";
          } else {
          // 영어 번역
          resultTitle = "YG Face Type";
          resultExplain = "#Distinctive Visuals, #Hip-hop Style, #Playful";
          resultCeleb = "Celebrities from YG Entertainment: BIGBANG's G-Dragon, BIGBANG's Taeyang, BIGBANG's Daesung, WINNER's Song Minho, WINNER's Kang Seungyoon, iKON's B.I, iKON's Bobby";
          }
        } else {
          resultTitle = "YG얼굴상";
          resultExplain = "#개성있는 비주얼 #힙합스타일 #장난꾸러기";
          resultCeleb = "YG출신 연예인: 빅뱅 지드래곤, 빅뱅 태양, 빅뱅 대성, 위너 송민호, 위너 강승윤, 아이콘 비아이, 아이콘 바비";
        }
        break;
      case "hybe":
        resultTitle = "HYBE상";
        resultExplain = "#다양한 매력";
        resultCeleb = "HYBE출신 연예인: 방탄소년단, 투모로우바이투게더, 세븐틴, 엔하이픈";
        break;
      default:
        resultTitle = "알수없음";
        resultExplain = "";
        resultCeleb = "";
    }
  } else {
    switch (prediction[0].className) {
      case "sm":
        if(!langType == "" || !langType == null || !langType == "ko") {
          if(langType == "en") {
          // 영어 번역
          resultTitle = "SM Face Type";
          resultExplain = "#Bunny-like Face, #Ultimate Visual, #Bright Impression";
          resultCeleb = "Celebrities from SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, f(x)'s Sulli, Girls' Generation's Taeyeon, Red Velvet's Irene, aespa's Winter, aespa's Karina";

          } else if(langType == "de") {
          // 독일어 번역
          resultTitle = "SM Gesichtstyp";
          resultExplain = "#Hasenartiges Gesicht, #Ultimatives Aussehen, #Heller Eindruck";
          resultCeleb = "Berühmtheiten von SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, f(x)'s Sulli, Girls' Generation's Taeyeon, Red Velvet's Irene, aespa's Winter, aespa's Karina";

          } else if(langType == "es") {
          // 스페인어 번역
          resultTitle = "Tipo de Rostro de SM";
          resultExplain = "#Rostro de Conejo, #Visual Definitivo, #Impresión Brillante";
          resultCeleb = "Celebridades de SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, Sulli de f(x), Taeyeon de Girls' Generation, Irene de Red Velvet, Winter de aespa, Karina de aespa";

          } else if(langType == "fr") {
          // 프랑스어 번역
          resultTitle = "Type de Visage SM";
          resultExplain = "#Visage de Lapin, #Visuel Ultime, #Impression Lumineuse";
          resultCeleb = "Célébrités de SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, Sulli de f(x), Taeyeon de Girls' Generation, Irene de Red Velvet, Winter de aespa, Karina de aespa";

          } else if(langType == "id") {
          // 인도네시아어 번역
          resultTitle = "Tipe Wajah SM";
          resultExplain = "#Wajah Kelinci, #Visual Ultimate, #Impresi Cerah";
          resultCeleb = "Selebriti dari SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, Sulli dari f(x), Taeyeon dari Girls' Generation, Irene dari Red Velvet, Winter dari aespa, Karina dari aespa";

          } else if(langType == "ja") {
          // 일본어 번역
          resultTitle = "SMの顔タイプ";
          resultExplain = "#ウサギのような顔、#究極のビジュアル、#明るい印象";
          resultCeleb = "SMエンターテインメントの有名人：ソ・ヒョンジン、イ・ヨニ、f(x)のスルギ、少女時代のテヨン、Red Velvetのアイリーン、aespaのウィンター、aespaのカリーナ";

          } else if(langType == "nl") {
          // 네덜란드어 번역
          resultTitle = "SM Gezichtstype";
          resultExplain = "#Konijnachtig Gezicht, #Ultiem Visueel, #Heldere Indruk";
          resultCeleb = "Beroemdheden van SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, Sulli van f(x), Taeyeon van Girls' Generation, Irene van Red Velvet, Winter van aespa, Karina van aespa";

          } else if(langType == "pl") {
          // 폴란드어 번역
          resultTitle = "Typ Twarzy SM";
          resultExplain = "#Twarz Królika, #Ostateczny Wygląd, #Jasne Wrażenie";
          resultCeleb = "Celebryci z SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, Sulli z f(x), Taeyeon z Girls' Generation, Irene z Red Velvet, Winter z aespa, Karina z aespa";

          } else if(langType == "pt") {
          // 포르투갈어 번역
          resultTitle = "Tipo de Rosto SM";
          resultExplain = "#Rosto de Coelho, #Visual Definitivo, #Impressão Brilhante";
          resultCeleb = "Celebridades da SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, Sulli do f(x), Taeyeon do Girls' Generation, Irene do Red Velvet, Winter do aespa, Karina do aespa";

          } else if(langType == "ru") {
          // 러시아어 번역
          resultTitle = "Тип лица SM";
          resultExplain = "#Лицо Кролика, #Воплощение Красоты, #Светлое Впечатление";
          resultCeleb = "Знаменитости из SM Entertainment: Со Хёнджин, Ли Ёнхи, Sulli из f(x), Тэён из Girls' Generation, Айрин из Red Velvet, Винтер из aespa, Карина из aespa";

          } else if(langType == "tr") {
          // 터키어 번역
          resultTitle = "SM Yüz Tipi";
          resultExplain = "#Tavşan Benzeri Yüz, #Mükemmel Görünüm, #Parlak İzlenim";
          resultCeleb = "SM Eğlence Ünlüleri: Seo Hyun-jin, Lee Yeon-hee, f(x)'in Sulli, Girls' Generation'dan Taeyeon, Red Velvet'den Irene, aespa'dan Winter, aespa'dan Karina";

          } else if(langType == "uk") {
          // 우크라이나어 번역
          resultTitle = "Тип обличчя SM";
          resultExplain = "#Обличчя Зайця, #Найкращий Вигляд, #Світлий Враження";
          resultCeleb = "Знаменитості від SM Entertainment: Сео Хьонджін, Лі Ёнхі, Sulli з f(x), Taeyeon з Girls' Generation, Irene з Red Velvet, Winter з aespa, Karina з aespa";

          } else if(langType == "vi") {
          // 베트남어 번역
          resultTitle = "Kiểu Mặt của SM";
          resultExplain = "#Gương mặt giống thỏ, #Visual tối ưu, #Ấn tượng sáng";
          resultCeleb = "Các nghệ sĩ nổi tiếng thuộc công ty giải trí SM: Seo Hyun-jin, Lee Yeon-hee, Sulli của f(x), Taeyeon của Girls' Generation, Irene của Red Velvet, Winter của aespa, Karina của aespa";

          } else if(langType == "zh") {
          // 중국어 번역
          resultTitle = "SM脸型";
          resultExplain = "#兔子般的脸型, #终极视觉, #明亮印象";
          resultCeleb = "SM娱乐公司的名人：徐玄振，李妍希，f(x)的金秀荣，少女时代的太妍，Red Velvet的Irene，aespa的Winter，aespa的Karina";
          } else {
          // 영어 번역
          resultTitle = "SM Face Type";
          resultExplain = "#Bunny-like Face, #Ultimate Visual, #Bright Impression";
          resultCeleb = "Celebrities from SM Entertainment: Seo Hyun-jin, Lee Yeon-hee, f(x)'s Sulli, Girls' Generation's Taeyeon, Red Velvet's Irene, aespa's Winter, aespa's Karina";
          }
        } else {
          resultTitle = "SM얼굴상";
          resultExplain = "#토끼상 #최강 비주얼 #밝은 인상";
          resultCeleb = "SM출신 연예인: 서현진, 이연희, FX설리, 소녀시대 태연, 래드벨벳 아이린, 에스파 윈터, 에스파 카리나";
        }
        break;
      case "jyp":
        if(!langType == "" || !langType == null || !langType == "ko") {
          if(langType == "en") {
          // 영어 번역
          resultTitle = "JYP Face Type";
          resultExplain = "#Fox-like Face, #Charming Visual";
          resultCeleb = "Celebrities from JYP Entertainment: Wonder Girls Ahn So-hee, TWICE Dahyun, TWICE Sana, TWICE Tzuyu, ITZY Yeji, ITZY Chaeryeong, NMIXX Sullyoon";

          } else if(langType == "de") {
          // 독일어 번역
          resultTitle = "JYP Gesichtstyp";
          resultExplain = "#Fuchsgesicht, #Charmantes Aussehen";
          resultCeleb = "Berühmtheiten von JYP Entertainment: Ahn So-hee von Wonder Girls, Dahyun von TWICE, Sana von TWICE, Tzuyu von TWICE, Yeji von ITZY, Chaeryeong von ITZY, NMIXX Sullyoon";

          } else if(langType == "es") {
          // 스페인어 번역
          resultTitle = "Tipo de Rostro de JYP";
          resultExplain = "#Cara de Zorro, #Atractivo Visual";
          resultCeleb = "Celebridades de JYP Entertainment: Ahn So-hee de Wonder Girls, Dahyun de TWICE, Sana de TWICE, Tzuyu de TWICE, Yeji de ITZY, Chaeryeong de ITZY, NMIXX Sullyoon";

          } else if(langType == "fr") {
          // 프랑스어 번역
          resultTitle = "Type de Visage de JYP";
          resultExplain = "#Visage de Renard, #Visuel Charmant";
          resultCeleb = "Célébrités de JYP Entertainment: Ahn So-hee des Wonder Girls, Dahyun de TWICE, Sana de TWICE, Tzuyu de TWICE, Yeji d'ITZY, Chaeryeong d'ITZY, NMIXX Sullyoon";

          } else if(langType == "id") {
          // 인도네시아어 번역
          resultTitle = "Tipe Wajah JYP";
          resultExplain = "#Wajah Rubah, #Visual Menawan";
          resultCeleb = "Selebriti dari JYP Entertainment: Ahn So-hee dari Wonder Girls, Dahyun dari TWICE, Sana dari TWICE, Tzuyu dari TWICE, Yeji dari ITZY, Chaeryeong dari ITZY, NMIXX Sullyoon";

          } else if(langType == "ja") {
          // 일본어 번역
          resultTitle = "JYPの顔タイプ";
          resultExplain = "#キツネのような顔、#魅力的なビジュアル";
          resultCeleb = "JYPエンターテインメントの有名人：ワンダーガールズのアン・ソヒ、TWICEのダヒョン、TWICEのサナ、TWICEのツウィ、ITZYのイェジ、ITZYのチェリョン、NMIXX スルリ";

          } else if(langType == "nl") {
          // 네덜란드어 번역
          resultTitle = "JYP Gezichtstype";
          resultExplain = "#Vosachtig Gezicht, #Betoverende Uitstraling";
          resultCeleb = "Beroemdheden van JYP Entertainment: Ahn So-hee van Wonder Girls, Dahyun van TWICE, Sana van TWICE, Tzuyu van TWICE, Yeji van ITZY, Chaeryeong van ITZY, NMIXX Sullyoon";

          } else if(langType == "pl") {
          // 폴란드어 번역
          resultTitle = "Typ Twarzy JYP";
          resultExplain = "#Twarz Lis, #Urokliwe Wrażenie";
          resultCeleb = "Celebryci z JYP Entertainment: Ahn So-hee z Wonder Girls, Dahyun z TWICE, Sana z TWICE, Tzuyu z TWICE, Yeji z ITZY, Chaeryeong z ITZY, NMIXX Sullyoon";

          } else if(langType == "pt") {
          // 포르투갈어 번역
          resultTitle = "Tipo de Rosto JYP";
          resultExplain = "#Rosto de Raposa, #Visual Encantador";
          resultCeleb = "Celebridades da JYP Entertainment: Ahn So-hee do Wonder Girls, Dahyun do TWICE, Sana do TWICE, Tzuyu do TWICE, Yeji do ITZY, Chaeryeong do ITZY, NMIXX Sullyoon";

          } else if(langType == "ru") {
          // 러시아어 번역
          resultTitle = "Тип лица JYP";
          resultExplain = "#Лицо Лисы, #Очаровательный Внешний Вид";
          resultCeleb = "Знаменитости из JYP Entertainment: Ан Сохи из Wonder Girls, Дахьён из TWICE, Сана из TWICE, Цзюю из TWICE, Еджи из ITZY, Чхэрён из ITZY, NMIXX Сулиюн";

          } else if(langType == "tr") {
          // 터키어 번역
          resultTitle = "JYP Yüz Tipi";
          resultExplain = "#Tavşan Benzeri Yüz, #Çekici Görünüm";
          resultCeleb = "JYP Eğlence Ünlüleri: Wonder Girls'den Ahn So-hee, TWICE'dan Dahyun, TWICE'dan Sana, TWICE'dan Tzuyu, ITZY'den Yeji, ITZY'den Chaeryeong, NMIXX Sullyoon";

          } else if(langType == "uk") {
          // 우크라이나어 번역
          resultTitle = "Тип обличчя JYP";
          resultExplain = "#Обличчя Лисиці, #Чарівний Зовнішній Вигляд";
          resultCeleb = "Знаменитості від JYP Entertainment: Ан Сохі з Wonder Girls, Дахьон з TWICE, Сана з TWICE, Цзюю з TWICE, Еджи з ITZY, Чхерьон з ITZY, NMIXX Суліюн";

          } else if(langType == "vi") {
          // 베트남어 번역
          resultTitle = "Kiểu Mặt của JYP";
          resultExplain = "#Gương Mặt Giống Cáo, #Visual Quyến Rũ";
          resultCeleb = "Các nghệ sĩ nổi tiếng thuộc công ty giải trí JYP: Ahn So-hee của Wonder Girls, Dahyun của TWICE, Sana của TWICE, Tzuyu của TWICE, Yeji của ITZY, Chaeryeong của ITZY, NMIXX Sullyoon";

          } else if(langType == "zh") {
          // 중국어 번역
          resultTitle = "JYP脸型";
          resultExplain = "#狐狸般的脸型, #迷人的外貌";
          resultCeleb = "JYP娱乐公司的名人：Wonder Girls的安素熙，TWICE的多贤，TWICE的莎娜，TWICE的子瑜，ITZY的藝智，ITZY的采玲，NMIXX 舒莉";
          } else {
          // 영어 번역
          resultTitle = "JYP Face Type";
          resultExplain = "#Fox-like Face, #Charming Visual";
          resultCeleb = "Celebrities from JYP Entertainment: Wonder Girls' Ahn So-hee, TWICE's Dahyun, TWICE's Sana, TWICE's Tzuyu, ITZY's Yeji, ITZY's Chaeryeong, NMIXX Sullyoon";
          }
        } else {
          resultTitle = "JYP얼굴상";
          resultExplain = "#여우상 #매력있는 비주얼";
          resultCeleb = "JYP출신 연예인: 원더걸스 안소희, 트와이스 다현, 트와이스 사나, 트와이스 쯔위, ITZY 예지, ITZY 채령, 엔믹스 설윤";
        }
        break;
      case "yg":
        if(!langType == "" || !langType == null || !langType == "ko") {
          if(langType == "en") {
          // 영어 번역
          resultTitle = "YG Face Type";
          resultExplain = "#Cat-like Face, #Sophisticated Visual";
          resultCeleb = "Celebrities from YG Entertainment: 2NE1's Sandara Park, BLACKPINK's Jennie, BLACKPINK's Lisa, BLACKPINK's Jisoo, Jeon Somi, Han Ye-seul";
          } else if(langType == "de") {
          // 독일어 번역
          resultTitle = "YG Gesichtstyp";
          resultExplain = "#Katzenartiges Gesicht, #Elegantes Aussehen";
          resultCeleb = "Berühmtheiten von YG Entertainment: Sandara Park von 2NE1, Jennie von BLACKPINK, Lisa von BLACKPINK, Jisoo von BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "es") {
          // 스페인어 번역
          resultTitle = "Tipo de Rostro YG";
          resultExplain = "#Rostro de Gato, #Visual Sofisticado";
          resultCeleb = "Celebridades de YG Entertainment: Sandara Park de 2NE1, Jennie de BLACKPINK, Lisa de BLACKPINK, Jisoo de BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "fr") {
          // 프랑스어 번역
          resultTitle = "Type de Visage YG";
          resultExplain = "#Visage de Chat, #Visuel Sophistiqué";
          resultCeleb = "Célébrités de YG Entertainment: Sandara Park de 2NE1, Jennie de BLACKPINK, Lisa de BLACKPINK, Jisoo de BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "id") {
          // 인도네시아어 번역
          resultTitle = "Tipe Wajah YG";
          resultExplain = "#Wajah Mirip Kucing, #Visual Elegan";
          resultCeleb = "Selebriti dari YG Entertainment: Sandara Park dari 2NE1, Jennie dari BLACKPINK, Lisa dari BLACKPINK, Jisoo dari BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "ja") {
          // 일본어 번역
          resultTitle = "YG顔タイプ";
          resultExplain = "#猫のような顔、#洗練されたビジュアル";
          resultCeleb = "YGエンターテインメントの有名人：2NE1のSandara Park、BLACKPINKのJennie、BLACKPINKのLisa、BLACKPINKのJisoo、Lee Hi、Jeon Somi、Han Ye-seul";

          } else if(langType == "nl") {
          // 네덜란드어 번역
          resultTitle = "YG Gezichtstype";
          resultExplain = "#Katachtig Gezicht, #Verfijnde Uitstraling";
          resultCeleb = "Beroemdheden van YG Entertainment: Sandara Park van 2NE1, Jennie van BLACKPINK, Lisa van BLACKPINK, Jisoo van BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "pl") {
          /// 폴란드어 번역
          resultTitle = "Typ Twarzy YG";
          resultExplain = "#Twarz Kociego Typu, #Wyrafinowany Wygląd";
          resultCeleb = "Celebryci z YG Entertainment: Sandara Park z 2NE1, Jennie z BLACKPINK, Lisa z BLACKPINK, Jisoo z BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "pt") {
          // 포르투갈어 번역
          resultTitle = "Tipo de Rosto YG";
          resultExplain = "#Rosto Estilo Gato, #Visual Sofisticado";
          resultCeleb = "Celebridades da YG Entertainment: Sandara Park do 2NE1, Jennie do BLACKPINK, Lisa do BLACKPINK, Jisoo do BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "ru") {
          // 러시아어 번역
          resultTitle = "Тип лица YG";
          resultExplain = "#Лицо, похожее на кошку, #Стильный образ";
          resultCeleb = "Знаменитости из YG Entertainment: Sandara Park из 2NE1, Jennie из BLACKPINK, Lisa из BLACKPINK, Jisoo из BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "tr") {
          // 터키어 번역
          resultTitle = "YG Yüz Tipi";
          resultExplain = "#Kedi Benzeri Yüz, #Zarif Görünüm";
          resultCeleb = "YG Eğlence Ünlüleri: 2NE1'den Sandara Park, BLACKPINK'ten Jennie, BLACKPINK'ten Lisa, BLACKPINK'ten Jisoo, Jeon Somi, Han Ye-seul";

          } else if(langType == "uk") {
          // 우크라이나어 번역
          resultTitle = "YG Тип обличчя";
          resultExplain = "#Обличчя Кота, #Вишуканий Вигляд";
          resultCeleb = "Знаменитості від YG Entertainment: Sandara Park з 2NE1, Jennie з BLACKPINK, Lisa з BLACKPINK, Jisoo з BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "vi") {
          // 베트남어 번역
          resultTitle = "Kiểu Mặt YG";
          resultExplain = "#Khuôn mặt giống mèo, #Visual tinh tế";
          resultCeleb = "Các nghệ sĩ nổi tiếng thuộc công ty giải trí YG: Sandara Park của 2NE1, Jennie của BLACKPINK, Lisa của BLACKPINK, Jisoo của BLACKPINK, Jeon Somi, Han Ye-seul";

          } else if(langType == "zh") {
          // 중국어 번역
          resultTitle = "YG脸型";
          resultExplain = "#猫状脸型, #高级视觉";
          resultCeleb = "YG娱乐公司的名人：2NE1的Sandara Park，BLACKPINK的Jennie，BLACKPINK的Lisa，BLACKPINK的Jisoo, 全素美， 韩叶瑟";
          } else {
          // 영어 번역
          resultTitle = "YG Face Type";
          resultExplain = "#Cat-like Face, #Sophisticated Visual";
          resultCeleb = "Celebrities from YG Entertainment: 2NE1's Sandara Park, BLACKPINK's Jennie, BLACKPINK's Lisa, BLACKPINK's Jisoo, Jeon Somi, Han Ye-seul";
          }
        } else {
          resultTitle = "YG얼굴상";
          resultExplain = "#고양이상 #고급스러운 비주얼";
          resultCeleb = "YG출신 연예인: 2NE1 산다라박, 블랙핑크 제니, 블랙핑크 리사, 블랙핑크 지수, 전소미, 한예슬";
        }
        break;
      case "hybe":
        resultTitle = "HYBE상";
        resultExplain = "#개성있는 비주얼 #다양한 매력";
        resultCeleb = "HYBE출신 연예인: 뉴진스, 르세라핌, 프로미스나인";
        break;
      default:
        resultTitle = "알수없음";
        resultExplain = "";
        resultCeleb = "";
    }
  }
  var title = "<div class='" + prediction[0].className + "-kpop-title'>" + resultTitle + "</div>"
  var explain = "<div class='kpop-explain pt-2'>" + resultExplain + "</div>"
  var celeb = "<div class='" + prediction[0].className + "-kpop-celeb pt-2 pb-2'>" + resultCeleb + "</div>"
  $('.result-messege').html(title + explain + celeb);
  
// T1.2: 결과 이미지 저장/공유를 위한 전역 변수 설정
  currentAgency = prediction[0].className;
  currentResultTitle = resultTitle;
  currentResultExplain = resultExplain;
  currentResultCeleb = resultCeleb;
  // T1.10: AI 예측 결과 배열 저장 (퍼센트 바 차트용)
  currentPredictions = prediction.map(function(p) {
    return {
      agency: p.className,
      percent: Math.round(p.probability * 100)
    };
  });
  
  var barWidth;

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) > 0.1) {
      barWidth = Math.round(prediction[i].probability.toFixed(2) * 100) + "%";
    } else if (prediction[i].probability.toFixed(2) >= 0.01) {
      barWidth = "4%"
    } else {
      barWidth = "2%"
    }
    var labelTitle;
    switch (prediction[i].className) {
        case "sm":
          labelTitle = "SM";
          break;
        case "jyp":
          labelTitle = "JYP";
          break;
        case "yg":
          labelTitle = "YG";
          break;
        case "hybe":
          labelTitle = "HYBE얼굴상";
          break;
        default:
          labelTitle = "알수없음";
    }
    var label = "<div class='agency-label d-flex align-items-center'>" + labelTitle + "</div>"
    var bar = "<div class='bar-container'><div class='" + prediction[i].className + "-box'></div><div class='d-flex justify-content-center align-items-center " + prediction[i].className + "-bar' style='width: " + barWidth + "'><span class='d-block percent-text'>" + Math.round(prediction[i].probability.toFixed(2) * 100) + "%</span></div></div>"
    labelContainer.childNodes[i].innerHTML = label + bar;

    // const classPrediction =
    //     resultName + ": " + prediction[i].probability.toFixed(2);
    // labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}