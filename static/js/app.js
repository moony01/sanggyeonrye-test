let tmURL;
// K-Pop Face Test 모델 (백업)
// const urlMale = "https://teachablemachine.withgoogle.com/models/9yhf9-8B7/"; // K-Pop 남자용 v2
// const urlFemale = "https://teachablemachine.withgoogle.com/models/Fq3_K1cua/"; // K-Pop 여자용 v2

// 상견례 테스트 모델
const urlMale = "https://teachablemachine.withgoogle.com/models/8foToA5zL/"; // 상견례 남자용 모델
const urlFemale = "https://teachablemachine.withgoogle.com/models/9zyVty-0p/"; // 상견례 여자용 모델
let model, webcam, labelContainer, maxPredictions;
let langType = "";
let langYn = "";
let loc =
  window.location.href.split("/")[0] +
  "//" +
  window.location.href.split("/")[2] +
  "/" +
  window.location.href.split("/")[3] +
  "/";
var deferredPrompt;

// T1.2: 결과 이미지 저장/공유를 위한 전역 변수
var currentAgency = ""; // 현재 결과 코드 (freepass, reject)
var currentResultTitle = ""; // 결과 제목 (예: "프리패스상")
var currentResultExplain = ""; // 해시태그 설명
var currentResultCeleb = ""; // 닮은 연예인
var currentPredictions = []; // T1.10: AI 예측 결과 배열 (퍼센트 바 차트용)

// T1.13: 다국어 Alert 메시지 (15개 언어 지원)
var ALERT_MESSAGES = {
  urlCopied: {
    ko: "URL이 복사되었습니다.",
    en: "URL copied!",
    ja: "URLがコピーされました。",
    zh: "URL已复制！",
    de: "URL kopiert!",
    es: "¡URL copiada!",
    fr: "URL copiée !",
    id: "URL disalin!",
    nl: "URL gekopieerd!",
    pl: "URL skopiowany!",
    pt: "URL copiado!",
    ru: "URL скопирован!",
    tr: "URL kopyalandı!",
    uk: "URL скопійовано!",
    vi: "Đã sao chép URL!",
  },
  completeTestFirst: {
    ko: "먼저 테스트를 완료해주세요!",
    en: "Please complete the test first!",
    ja: "まずテストを完了してください！",
    zh: "请先完成测试！",
    de: "Bitte zuerst den Test abschließen!",
    es: "¡Por favor completa el test primero!",
    fr: "Veuillez d'abord terminer le test !",
    id: "Silakan selesaikan tes terlebih dahulu!",
    nl: "Voltooi eerst de test!",
    pl: "Najpierw ukończ test!",
    pt: "Por favor, complete o teste primeiro!",
    ru: "Сначала завершите тест!",
    tr: "Lütfen önce testi tamamlayın!",
    uk: "Спочатку завершіть тест!",
    vi: "Vui lòng hoàn thành bài test trước!",
  },
  imageFailed: {
    ko: "이미지 생성에 실패했습니다. 다시 시도해주세요.",
    en: "Failed to create image. Please try again.",
    ja: "画像の作成に失敗しました。もう一度お試しください。",
    zh: "图片创建失败，请重试。",
    de: "Bild konnte nicht erstellt werden. Bitte erneut versuchen.",
    es: "Error al crear la imagen. Inténtalo de nuevo.",
    fr: "Échec de la création de l'image. Veuillez réessayer.",
    id: "Gagal membuat gambar. Silakan coba lagi.",
    nl: "Kan afbeelding niet maken. Probeer opnieuw.",
    pl: "Nie udało się utworzyć obrazu. Spróbuj ponownie.",
    pt: "Falha ao criar imagem. Tente novamente.",
    ru: "Не удалось создать изображение. Попробуйте снова.",
    tr: "Görüntü oluşturulamadı. Lütfen tekrar deneyin.",
    uk: "Не вдалося створити зображення. Спробуйте ще раз.",
    vi: "Tạo ảnh thất bại. Vui lòng thử lại.",
  },
};

// 다국어 메시지 가져오기 함수
function getAlertMessage(key) {
  var lang = langType || "ko";
  if (ALERT_MESSAGES[key] && ALERT_MESSAGES[key][lang]) {
    return ALERT_MESSAGES[key][lang];
  }
  return ALERT_MESSAGES[key] ? ALERT_MESSAGES[key]["en"] : key;
}

document.addEventListener("DOMContentLoaded", function () {
  var headerIcon = document.getElementById("header__icon");
  var siteCache = document.getElementById("site-cache");
  var body = document.body;
  langType = location.pathname.split("/")[2];

  // if(!langType == "" || !langType == null || !langType == "ko") {
  //   document.getElementsByTagName("html")[0].setAttribute("lang", langType);
  //   langYn = '../';
  // } else {
  //   document.getElementsByTagName("html")[0].setAttribute("lang", "ko");
  // }

  Kakao.init("8329cd81f78ef956d4487f90e5a4cd49");

  // null 체크 추가 (요소가 없을 경우 에러 방지)
  if (headerIcon) {
    headerIcon.addEventListener("click", function (e) {
      e.preventDefault();
      body.classList.toggle("with--sidebar");
    });
  }

  if (siteCache) {
    siteCache.addEventListener("click", function () {
      body.classList.remove("with--sidebar");
    });
  }
});

window.addEventListener("beforeinstallprompt", function (e) {
  console.log("beforeinstallprompt Event fired");
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  //class명 app-download 를 display:block 으로 변경
  document.querySelector(".app-download").style.display = "block";

  return false;
});

//header 메뉴 클릭시 페이지 이동
function fnMovePage(page) {
  if (page == "" || page == null) {
    location.href = loc;
  } else if (page == "blog") {
    location.href = "/";
  } else {
    window.open("https://mbtichat.info", "_blank");
  }
}

//언어 변경
function fnChangeLang(lang) {
  langType = lang.value;
  if (langType == "" || langType == null || langType == "ko") {
    location.href = loc;
  } else {
    location.href = loc + langType;
  }
}

//파일 업로드
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".image-upload-wrap").hide();
      $("#loading").show();
      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();
      $(".image-title").html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
    init().then(() => {
      predict();
      $("#loading").hide();
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
  var thisUrl = "";
  var snsTitle = "";
  var snsDesc = "";
  var thumbUrl = "";
  langType = location.pathname.split("/")[2];
  if (!langType == "" || !langType == null || !langType == "ko") {
    thisUrl = loc + langType;
    thumbUrl = "https://moony01.com/kpopface/static/img/share/thumb-en.jpg";
    if (langType == "en") {
      // 영어 번역
      snsTitle = "KPOP Face Test";
      snsDesc =
        "What is my facial resemblance to K-POP entertainment agencies?";
    } else if (langType == "de") {
      // 독일어 번역
      snsTitle = "KPOP Gesichtstest";
      snsDesc =
        "Wie ähnlich sieht mein Gesicht den K-POP Unterhaltungsagenturen aus?";
    } else if (langType == "es") {
      // 스페인어 번역
      snsTitle = "Prueba de Rostro KPOP";
      snsDesc =
        "¿A qué agencia de entretenimiento de K-POP se parece mi rostro?";
    } else if (langType == "fr") {
      // 프랑스어 번역
      snsTitle = "Test du Visage KPOP";
      snsDesc =
        "À quelle agence de divertissement K-POP ressemble mon visage ?";
    } else if (langType == "id") {
      // 인도네시아어 번역
      snsTitle = "Tes Wajah KPOP";
      snsDesc = "Wajah saya menyerupai agensi hiburan K-POP yang mana?";
    } else if (langType == "ja") {
      // 일본어 번역
      snsTitle = "KPOP顔診断テスト";
      snsDesc =
        "私の顔はK-POPエンターテインメント事務所にどれくらい似ているでしょうか？";
    } else if (langType == "nl") {
      // 네덜란드어 번역
      snsTitle = "KPOP Gezichtstest";
      snsDesc = "Hoe lijkt mijn gezicht op K-POP entertainmentbureaus?";
    } else if (langType == "pl") {
      // 폴란드어 번역
      snsTitle = "Test twarzy KPOP";
      snsDesc =
        "Jakie są podobieństwa mojej twarzy do agencji rozrywkowych K-POP?";
    } else if (langType == "pt") {
      // 포르투갈어 번역
      snsTitle = "Teste de Rosto KPOP";
      snsDesc =
        "Qual é a semelhança do meu rosto com as agências de entretenimento K-POP?";
    } else if (langType == "ru") {
      // 러시아어 번역
      snsTitle = "Тест на лицо KPOP";
      snsDesc = "Какое сходство моего лица с агентствами развлечений K-POP?";
    } else if (langType == "tr") {
      // 터키어 번역
      snsTitle = "KPOP Yüz Testi";
      snsDesc = "Yüzüm K-POP eğlence ajanslarına ne kadar benziyor?";
    } else if (langType == "uk") {
      // 우크라이나어 번역
      snsTitle = "Тест на обличчя KPOP";
      snsDesc = "До яких агентств розваг K-POP схоже моє обличчя?";
    } else if (langType == "vi") {
      // 베트남어 번역
      snsTitle = "Kiểm Tra Khuôn Mặt KPOP";
      snsDesc = "Gương mặt của tôi giống với công ty giải trí K-POP nào?";
    } else if (langType == "zh") {
      // 중국어 번역
      snsTitle = "KPOP脸部测试";
      snsDesc = "我的脸与K-POP娱乐公司相似吗？";
    } else {
      // 영어 번역
      snsTitle = "KPOP Face Test";
      snsDesc =
        "What is my facial resemblance to K-POP entertainment agencies?";
    }
  } else {
    thisUrl = loc;
    thumbUrl = "https://moony01.com/kpopface/static/img/share/thumb.jpg";
    snsTitle = "케이팝 얼굴상 테스트";
    snsDesc = "내 얼굴은 K-POP 엔터 소속사중 어떤 얼굴상일까?";
  }

  if (sns == "facebook") {
    var url =
      "http://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(thisUrl);
    window.open(url, "", "width=486, height=286");
  } else if (sns == "twitter") {
    var url =
      "http://twitter.com/share?url=" +
      encodeURIComponent(thisUrl) +
      "&text=" +
      encodeURIComponent(snsTitle);
    window.open(url, "tweetPop", "width=486, height=286,scrollbars=yes");
  } else if (sns == "band") {
    var url =
      "http://www.band.us/plugin/share?body=" +
      encodeURIComponent(snsTitle) +
      "&route=" +
      encodeURIComponent(thisUrl);
    window.open(url, "shareBand", "width=400, height=500, resizable=yes");
  } else if (sns == "kakaotalk") {
    // 카카오링크 버튼 생성
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: snsTitle, // 제목
        description: snsDesc, // 설명
        imageUrl: thumbUrl, // 썸네일 이미지
        link: {
          mobileWebUrl: thisUrl,
          webUrl: thisUrl,
        },
      },
    });
  } else if (sns == "kakaostory") {
    // 사용할 앱의 JavaScript 키 설정
    Kakao.Story.share({
      url: thisUrl,
      text: snsTitle,
    });
  } else if (sns == "copyurl") {
    var tmp = document.createElement("input");
    var url = thisUrl;
    document.body.appendChild(tmp);
    tmp.value = url;
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
    alert(getAlertMessage("urlCopied"));
  }
}

/**
 * T1.2: 결과 이미지 저장/공유 함수
 * - 모바일: Web Share API로 공유
 * - PC: 자동 다운로드
 */
async function fnSaveResultImage() {
  // 저장 버튼 찾기 (중복 클릭 방지)
  var saveBtn = document.getElementById("save-image-btn");
  var originalText = "";
  if (saveBtn) {
    originalText = saveBtn.querySelector(".save-image-text")
      ? saveBtn.querySelector(".save-image-text").textContent
      : saveBtn.textContent;
    saveBtn.disabled = true;
    if (saveBtn.querySelector(".save-image-text")) {
      saveBtn.querySelector(".save-image-text").textContent = "생성중...";
    } else {
      saveBtn.textContent = "생성중...";
    }
  }

  try {
    // 결과가 있는지 확인
    if (!currentAgency || !currentResultTitle) {
      alert(getAlertMessage("completeTestFirst"));
      return;
    }

    // T1.9: 사용자 업로드 이미지 가져오기
    var userImage = document.getElementById("face-image");
    var userImageSrc = userImage ? userImage.src : null;

    // generateResultImage 함수 호출 (imageGenerator.js)
    var imageBlob = await generateResultImage({
      agency: currentAgency,
      title: currentResultTitle,
      explain: currentResultExplain,
      celeb: currentResultCeleb,
      lang: langType || "ko",
      userImageSrc: userImageSrc, // T1.9: 사용자 이미지 전달
      predictions: currentPredictions, // T1.10: AI 예측 결과 (퍼센트 바 차트)
    });

    // 파일명 생성
    var fileName = "sanggyeonrye-result-" + currentAgency + ".png";
    var imageFile = new File([imageBlob], fileName, { type: "image/png" });

    // 모바일: Web Share API 사용
    if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      await navigator.share({
        files: [imageFile],
        title: "상견례 얼굴상 테스트 결과",
        text: currentResultTitle,
      });
      console.log("Image shared successfully");
    } else {
      // PC: 자동 다운로드
      var downloadUrl = URL.createObjectURL(imageBlob);
      var downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
      console.log("Image downloaded:", fileName);
    }
  } catch (error) {
    console.error("결과 이미지 저장/공유 실패:", error);
    alert(getAlertMessage("imageFailed"));
  } finally {
    // 버튼 상태 복구
    if (saveBtn) {
      saveBtn.disabled = false;
      if (saveBtn.querySelector(".save-image-text")) {
        saveBtn.querySelector(".save-image-text").textContent = originalText;
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
    var url =
      "https://play.google.com/store/apps/details?id=com.mhhan01.kpopface";
    window.open(url);
  } else if (app == "a2hs") {
    if (deferredPrompt !== undefined) {
      // The user has had a postive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();

      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then(function (choiceResult) {
        console.log(choiceResult.outcome);

        if (choiceResult.outcome == "dismissed") {
          console.log("User cancelled home screen install");
        } else {
          console.log("User added to home screen");
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
    var element = document.createElement("div");
    element.classList.add("d-flex");
    labelContainer.appendChild(element);
  }
}
//이미지 로드 결과
async function predict() {
  var image = document.getElementById("face-image");
  const prediction = await model.predict(image, false);
  prediction.sort(
    (a, b) => parseFloat(b.probability) - parseFloat(a.probability),
  );
  console.log(prediction[0].className);
  var resultTitle, resultExplain, resultCeleb;
  langType = location.pathname.split("/")[2];
  if (document.getElementById("gender").checked) {
    // 상견례 테스트 - 남자용 결과 (한국어)
    // 깔끔하고 단정한 호감형 vs 개성있고 강렬한 이미지
    switch (prediction[0].className) {
      case "freepass":
      case "프리패스상":
      case "상견례 프리패스상":
        // 프리패스상 (남자): 깔끔하고 단정한 호감형
        resultTitle = "프리패스상";
        resultExplain = "#첫인상100점 #호감형비주얼 #부모님_극찬예약 #사위상_찐";
        resultCeleb =
          "닮은 연예인: 박보검, 송중기, 임시완, 진(BTS), 차은우";
        break;
      case "reject":
      case "문전박대상":
      case "상견례 문전박대상":
        // 문전박대상 (남자): 개성있고 강렬한 이미지
        resultTitle = "문전박대상";
        resultExplain = "#개성파미남 #강렬한첫인상 #알고보면_반전매력 #독보적비주얼";
        resultCeleb =
          "닮은 연예인: 덱스, 뷔(BTS), 산(에이티즈), 연준(투바투), 창균(몬스타엑스)";
        break;
      default:
        // 알 수 없는 클래스명인 경우 (디버깅용)
        console.log("알 수 없는 클래스명:", prediction[0].className);
        resultTitle = prediction[0].className;
        resultExplain = "#테스트결과";
        resultCeleb = "클래스명 확인 필요: " + prediction[0].className;
    }
  } else {
    // 상견례 테스트 - 여자용 결과 (한국어)
    // Teachable Machine 클래스명: "freepass" (프리패스상), "reject" (문전박대상)
    // 클래스명이 다를 경우 console.log(prediction[0].className)으로 확인 후 수정 필요
    switch (prediction[0].className) {
      case "freepass":
      case "프리패스상":
      case "상견례 프리패스상":
        // 프리패스상: 청순하고 단아한 이미지, 호감형 비주얼
        resultTitle = "프리패스상";
        resultExplain = "#첫인상100점 #청순호감형 #부모님_극찬예약 #며느리상_찐";
        resultCeleb =
          "닮은 연예인: 김민주(아이즈원), 미나(트와이스), 박보영, 박은빈, 카즈하(르세라핌), 효정(오마이걸)";
        break;
      case "reject":
      case "문전박대상":
      case "상견례 문전박대상":
        // 문전박대상: 개성있고 시크한 이미지, 강렬한 첫인상
        resultTitle = "문전박대상";
        resultExplain = "#도도미녀 #시크한매력 #첫인상은_좀_쎄보임 #알고보면_반전매력";
        resultCeleb =
          "닮은 연예인: 닝닝(에스파), 미미(오마이걸), 이채영(프로미스나인), 제니(블랙핑크), 채영(트와이스)";
        break;
      default:
        // 알 수 없는 클래스명인 경우 (디버깅용)
        console.log("알 수 없는 클래스명:", prediction[0].className);
        resultTitle = prediction[0].className;
        resultExplain = "#테스트결과";
        resultCeleb = "클래스명 확인 필요: " + prediction[0].className;
    }
  }
  // 상견례 테스트 결과용 CSS 클래스 결정
  var resultClass = "";
  switch (prediction[0].className) {
    case "freepass":
    case "프리패스상":
    case "상견례 프리패스상":
      resultClass = "freepass";
      break;
    case "reject":
    case "문전박대상":
    case "상견례 문전박대상":
      resultClass = "reject";
      break;
    default:
      resultClass = prediction[0].className;
  }

  var title =
    "<div class='" +
    resultClass +
    "-result-title'>" +
    resultTitle +
    "</div>";
  var explain = "<div class='result-explain pt-2'>" + resultExplain + "</div>";
  var celeb =
    "<div class='" +
    resultClass +
    "-result-celeb pt-2 pb-2'>" +
    resultCeleb +
    "</div>";
  $(".result-messege").html(title + explain + celeb);

  // T1.2: 결과 이미지 저장/공유를 위한 전역 변수 설정
  currentAgency = prediction[0].className;
  currentResultTitle = resultTitle;
  currentResultExplain = resultExplain;
  currentResultCeleb = resultCeleb;
  // T1.10: AI 예측 결과 배열 저장 (퍼센트 바 차트용)
  currentPredictions = prediction.map(function (p) {
    return {
      agency: p.className,
      percent: Math.round(p.probability * 100),
    };
  });

  var barWidth;

  // 상견례 테스트: 항상 프리패스상이 위, 문전박대상이 아래로 고정 순서
  // prediction 배열에서 freepass와 reject를 찾아서 고정 순서로 렌더링
  var freepassData = null;
  var rejectData = null;

  for (let i = 0; i < prediction.length; i++) {
    var className = prediction[i].className;
    if (className === "freepass" || className === "프리패스상" || className === "상견례 프리패스상") {
      freepassData = prediction[i];
    } else if (className === "reject" || className === "문전박대상" || className === "상견례 문전박대상") {
      rejectData = prediction[i];
    }
  }

  // 고정 순서 배열: [프리패스상, 문전박대상]
  var fixedOrderPrediction = [];
  if (freepassData) fixedOrderPrediction.push(freepassData);
  if (rejectData) fixedOrderPrediction.push(rejectData);

  // 만약 위 두 클래스 외에 다른 클래스가 있다면 뒤에 추가
  for (let i = 0; i < prediction.length; i++) {
    var className = prediction[i].className;
    if (className !== "freepass" && className !== "프리패스상" && className !== "상견례 프리패스상" &&
        className !== "reject" && className !== "문전박대상" && className !== "상견례 문전박대상") {
      fixedOrderPrediction.push(prediction[i]);
    }
  }

  for (let i = 0; i < maxPredictions; i++) {
    var currentPrediction = fixedOrderPrediction[i] || prediction[i];

    if (currentPrediction.probability.toFixed(2) > 0.1) {
      barWidth = Math.round(currentPrediction.probability.toFixed(2) * 100) + "%";
    } else if (currentPrediction.probability.toFixed(2) >= 0.01) {
      barWidth = "4%";
    } else {
      barWidth = "2%";
    }
    var labelTitle;
    // 상견례 테스트 라벨
    switch (currentPrediction.className) {
      case "freepass":
      case "프리패스상":
      case "상견례 프리패스상":
        labelTitle = "프리패스상";
        break;
      case "reject":
      case "문전박대상":
      case "상견례 문전박대상":
        labelTitle = "문전박대상";
        break;
      default:
        labelTitle = currentPrediction.className;
    }
    // 상견례 테스트용 바 클래스 결정
    var barClass = "";
    switch (currentPrediction.className) {
      case "freepass":
      case "프리패스상":
      case "상견례 프리패스상":
        barClass = "freepass";
        break;
      case "reject":
      case "문전박대상":
      case "상견례 문전박대상":
        barClass = "reject";
        break;
      default:
        barClass = currentPrediction.className;
    }

    var label =
      "<div class='agency-label d-flex align-items-center'>" +
      labelTitle +
      "</div>";
    var bar =
      "<div class='bar-container'><div class='" +
      barClass +
      "-box'></div><div class='d-flex justify-content-center align-items-center " +
      barClass +
      "-bar' style='width: " +
      barWidth +
      "'><span class='d-block percent-text'>" +
      Math.round(currentPrediction.probability.toFixed(2) * 100) +
      "%</span></div></div>";
    labelContainer.childNodes[i].innerHTML = label + bar;
  }
}
