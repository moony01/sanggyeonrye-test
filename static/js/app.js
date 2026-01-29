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

// 다국어 결과 메시지 (6개 언어 지원)
var RESULT_MESSAGES = {
  freepass: {
    male: {
      ko: {
        title: "프리패스상",
        explain: "#첫인상100점 #호감형비주얼 #부모님_극찬예약 #사위상_찐",
        celeb: "닮은 연예인: 박보검, 송중기, 임시완, 진(BTS), 차은우"
      },
      en: {
        title: "Free Pass Type",
        explain: "#FirstImpression100 #LikeableVisual #ParentsApproved #IdealSonInLaw",
        celeb: "Similar celebrities: Park Bo-gum, Song Joong-ki, Im Si-wan, Jin(BTS), Cha Eun-woo"
      },
      ja: {
        title: "フリーパス相",
        explain: "#第一印象100点 #好感度ビジュアル #両親絶賛 #理想の婿タイプ",
        celeb: "似ている芸能人: パク・ボゴム、ソン・ジュンギ、イム・シワン、ジン(BTS)、チャ・ウヌ"
      },
      zh: {
        title: "通行证相",
        explain: "#第一印象100分 #好感型颜值 #父母赞不绝口 #理想女婿相",
        celeb: "相似艺人: 朴宝剑、宋仲基、任时完、Jin(BTS)、车银优"
      },
      vi: {
        title: "Tướng Đỗ Ngay",
        explain: "#ẤnTượngĐầu100Điểm #NgoạiHìnhDễMến #BốMẹKhenNgợi #RểLýTưởng",
        celeb: "Nghệ sĩ tương tự: Park Bo-gum, Song Joong-ki, Im Si-wan, Jin(BTS), Cha Eun-woo"
      },
      id: {
        title: "Tipe Lolos",
        explain: "#KesanPertama100 #VisualDisukai #DisetujuiOrangtua #MenantudambaanIdeal",
        celeb: "Selebriti serupa: Park Bo-gum, Song Joong-ki, Im Si-wan, Jin(BTS), Cha Eun-woo"
      }
    },
    female: {
      ko: {
        title: "프리패스상",
        explain: "#첫인상100점 #청순호감형 #부모님_극찬예약 #며느리상_찐",
        celeb: "닮은 연예인: 김민주(아이즈원), 미나(트와이스), 박보영, 박은빈, 카즈하(르세라핌), 효정(오마이걸)"
      },
      en: {
        title: "Free Pass Type",
        explain: "#FirstImpression100 #PureAndLikeable #ParentsApproved #IdealDaughterInLaw",
        celeb: "Similar celebrities: Kim Min-ju(IZ*ONE), Mina(TWICE), Park Bo-young, Park Eun-bin, Kazuha(LE SSERAFIM), Hyojung(OH MY GIRL)"
      },
      ja: {
        title: "フリーパス相",
        explain: "#第一印象100点 #清純好感型 #両親絶賛 #理想の嫁タイプ",
        celeb: "似ている芸能人: キム・ミンジュ(IZ*ONE)、ミナ(TWICE)、パク・ボヨン、パク・ウンビン、カズハ(LE SSERAFIM)、ヒョジョン(OH MY GIRL)"
      },
      zh: {
        title: "通行证相",
        explain: "#第一印象100分 #清纯好感型 #父母赞不绝口 #理想儿媳相",
        celeb: "相似艺人: 金玟周(IZ*ONE)、Mina(TWICE)、朴宝英、朴恩斌、Kazuha(LE SSERAFIM)、孝定(OH MY GIRL)"
      },
      vi: {
        title: "Tướng Đỗ Ngay",
        explain: "#ẤnTượngĐầu100Điểm #TrongSángDễThương #BốMẹKhenNgợi #DâuLýTưởng",
        celeb: "Nghệ sĩ tương tự: Kim Min-ju(IZ*ONE), Mina(TWICE), Park Bo-young, Park Eun-bin, Kazuha(LE SSERAFIM), Hyojung(OH MY GIRL)"
      },
      id: {
        title: "Tipe Lolos",
        explain: "#KesanPertama100 #MurnidanDisukai #DisetujuiOrangtua #MenantuIdamaan",
        celeb: "Selebriti serupa: Kim Min-ju(IZ*ONE), Mina(TWICE), Park Bo-young, Park Eun-bin, Kazuha(LE SSERAFIM), Hyojung(OH MY GIRL)"
      }
    }
  },
  reject: {
    male: {
      ko: {
        title: "문전박대상",
        explain: "#개성파미남 #강렬한첫인상 #알고보면_반전매력 #독보적비주얼",
        celeb: "닮은 연예인: 덱스, 뷔(BTS), 산(에이티즈), 연준(투바투), 창균(몬스타엑스)"
      },
      en: {
        title: "Rejected Type",
        explain: "#UniqueHandsome #StrongFirstImpression #HiddenCharm #DistinctiveVisual",
        celeb: "Similar celebrities: Dex, V(BTS), San(ATEEZ), Yeonjun(TXT), Changkyun(MONSTA X)"
      },
      ja: {
        title: "門前払い相",
        explain: "#個性派イケメン #強烈な第一印象 #知れば反転魅力 #唯一無二ビジュアル",
        celeb: "似ている芸能人: デックス、V(BTS)、サン(ATEEZ)、ヨンジュン(TXT)、チャンギュン(MONSTA X)"
      },
      zh: {
        title: "拒之门外相",
        explain: "#个性帅哥 #强烈第一印象 #了解后反转魅力 #独特颜值",
        celeb: "相似艺人: Dex、V(BTS)、San(ATEEZ)、然俊(TXT)、I.M(MONSTA X)"
      },
      vi: {
        title: "Tướng Bị Từ Chối",
        explain: "#ĐẹpTraiCáTính #ẤnTượngMạnh #MagLựcẨnGiấu #NgoạiHìnhĐộcĐáo",
        celeb: "Nghệ sĩ tương tự: Dex, V(BTS), San(ATEEZ), Yeonjun(TXT), Changkyun(MONSTA X)"
      },
      id: {
        title: "Tipe Ditolak",
        explain: "#TampanUnik #KesanPertamaKuat #PesonaTeresembunyi #VisualKhas",
        celeb: "Selebriti serupa: Dex, V(BTS), San(ATEEZ), Yeonjun(TXT), Changkyun(MONSTA X)"
      }
    },
    female: {
      ko: {
        title: "문전박대상",
        explain: "#도도미녀 #시크한매력 #첫인상은_좀_쎄보임 #알고보면_반전매력",
        celeb: "닮은 연예인: 닝닝(에스파), 미미(오마이걸), 이채영(프로미스나인), 제니(블랙핑크), 채영(트와이스)"
      },
      en: {
        title: "Rejected Type",
        explain: "#ChicBeauty #CoolCharm #StrongFirstImpression #HiddenCharm",
        celeb: "Similar celebrities: Ningning(aespa), Mimi(OH MY GIRL), Lee Chae-young(fromis_9), Jennie(BLACKPINK), Chaeyoung(TWICE)"
      },
      ja: {
        title: "門前払い相",
        explain: "#クール美女 #シックな魅力 #第一印象は強め #知れば反転魅力",
        celeb: "似ている芸能人: ニンニン(aespa)、ミミ(OH MY GIRL)、イ・チェヨン(fromis_9)、ジェニー(BLACKPINK)、チェヨン(TWICE)"
      },
      zh: {
        title: "拒之门外相",
        explain: "#高冷美女 #时尚魅力 #第一印象较强 #了解后反转魅力",
        celeb: "相似艺人: Ningning(aespa)、Mimi(OH MY GIRL)、李彩英(fromis_9)、Jennie(BLACKPINK)、彩瑛(TWICE)"
      },
      vi: {
        title: "Tướng Bị Từ Chối",
        explain: "#MỹNữKiêuSa #QuyếnRũLạnhLùng #ẤnTượngĐầuMạnh #MagLựcẨnGiấu",
        celeb: "Nghệ sĩ tương tự: Ningning(aespa), Mimi(OH MY GIRL), Lee Chae-young(fromis_9), Jennie(BLACKPINK), Chaeyoung(TWICE)"
      },
      id: {
        title: "Tipe Ditolak",
        explain: "#KecantikanChic #PesonaDingin #KesanPertamaKuat #PesonaTeresembunyi",
        celeb: "Selebriti serupa: Ningning(aespa), Mimi(OH MY GIRL), Lee Chae-young(fromis_9), Jennie(BLACKPINK), Chaeyoung(TWICE)"
      }
    }
  },
  labels: {
    freepass: {
      ko: "프리패스상", en: "Free Pass", ja: "フリーパス相", zh: "通行证相", vi: "Tướng Đỗ Ngay", id: "Tipe Lolos"
    },
    reject: {
      ko: "문전박대상", en: "Rejected", ja: "門前払い相", zh: "拒之门外相", vi: "Tướng Bị Từ Chối", id: "Tipe Ditolak"
    }
  }
};

// 언어 코드 정규화 함수
function getNormalizedLang() {
  var lang = langType || "ko";
  // 지원 언어 목록
  var supportedLangs = ["ko", "en", "ja", "zh", "vi", "id"];
  if (supportedLangs.indexOf(lang) === -1) {
    return "en"; // 지원하지 않는 언어는 영어로 대체
  }
  return lang;
}

// 결과 메시지 가져오기
function getResultMessages(resultType, isMale) {
  var lang = getNormalizedLang();
  var gender = isMale ? "male" : "female";
  var messages = RESULT_MESSAGES[resultType][gender][lang];
  if (!messages) {
    messages = RESULT_MESSAGES[resultType][gender]["en"]; // fallback to English
  }
  return messages;
}

// 라벨 텍스트 가져오기
function getLabelText(resultType) {
  var lang = getNormalizedLang();
  var label = RESULT_MESSAGES.labels[resultType][lang];
  if (!label) {
    label = RESULT_MESSAGES.labels[resultType]["en"]; // fallback to English
  }
  return label;
}

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

  // 카카오 SDK 초기화 (중복 방지)
  if (typeof Kakao !== "undefined" && !Kakao.isInitialized()) {
    Kakao.init("8329cd81f78ef956d4487f90e5a4cd49");
    console.log("Kakao SDK initialized:", Kakao.isInitialized());
  }

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

  // 기본 썸네일 URL (상견례 테스트)
  var baseThumbUrl = "https://moony01.com/sanggyeonrye-test/static/img/share/";

  if (langType && langType !== "" && langType !== "ko") {
    thisUrl = loc + langType;
    thumbUrl = baseThumbUrl + "kakao-url-share.png";

    if (langType == "en") {
      snsTitle = "Meeting the In-Laws Face Test";
      snsDesc = "AI determines your face type! Free Pass vs Rejected - Which one are you?";
    } else if (langType == "ja") {
      snsTitle = "相見礼フリーパス顔テスト";
      snsDesc = "AIが判定！フリーパス相 vs 門前払い相、あなたはどっち？";
    } else if (langType == "zh") {
      snsTitle = "相亲对象面相测试";
      snsDesc = "AI判定！通行证相 vs 拒之门外相，你是哪种？";
    } else if (langType == "vi") {
      snsTitle = "Bài test tướng mặt gặp mặt gia đình";
      snsDesc = "AI đánh giá! Tướng Đỗ Ngay vs Tướng Bị Từ Chối - Bạn là loại nào?";
    } else if (langType == "id") {
      snsTitle = "Tes Wajah Pertemuan Keluarga";
      snsDesc = "AI menentukan! Tipe Lolos vs Tipe Ditolak - Kamu yang mana?";
    } else {
      // 기타 언어는 영어로 기본 처리
      snsTitle = "Meeting the In-Laws Face Test";
      snsDesc = "AI determines your face type! Free Pass vs Rejected - Which one are you?";
    }
  } else {
    thisUrl = loc;
    thumbUrl = baseThumbUrl + "kakao-url-share.png";
    snsTitle = "상견례 얼굴상 테스트";
    snsDesc = "AI가 판정! 프리패스상 vs 문전박대상, 나는 어떤 상일까?";
  }

  if (sns == "facebook") {
    var url =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(thisUrl);
    window.open(url, "shareFacebook", "width=600, height=400");
  } else if (sns == "twitter") {
    // X (formerly Twitter)
    var url =
      "https://x.com/intent/tweet?url=" +
      encodeURIComponent(thisUrl) +
      "&text=" +
      encodeURIComponent(snsTitle);
    window.open(url, "shareX", "width=600, height=400,scrollbars=yes");
  } else if (sns == "band") {
    var url =
      "https://www.band.us/plugin/share?body=" +
      encodeURIComponent(snsTitle) +
      "&route=" +
      encodeURIComponent(thisUrl);
    window.open(url, "shareBand", "width=500, height=600, resizable=yes");
  } else if (sns == "kakaotalk") {
    // 카카오톡 공유 (에러 처리 포함)
    if (typeof Kakao === "undefined" || !Kakao.isInitialized()) {
      alert("카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    try {
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: snsTitle,
          description: snsDesc,
          imageUrl: thumbUrl,
          link: {
            mobileWebUrl: thisUrl,
            webUrl: thisUrl,
          },
        },
        buttons: [
          {
            title: "테스트 하러가기",
            link: {
              mobileWebUrl: thisUrl,
              webUrl: thisUrl,
            },
          },
        ],
      });
    } catch (e) {
      console.error("카카오 공유 실패:", e);
      alert("카카오톡 공유에 실패했습니다. URL 복사를 이용해주세요.");
    }
  } else if (sns == "kakaostory") {
    // 카카오스토리 공유
    if (typeof Kakao === "undefined" || !Kakao.isInitialized()) {
      alert("카카오 SDK가 로드되지 않았습니다.");
      return;
    }
    try {
      Kakao.Story.share({
        url: thisUrl,
        text: snsTitle,
      });
    } catch (e) {
      console.error("카카오스토리 공유 실패:", e);
    }
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
  var isMale = document.getElementById("gender").checked;
  var resultType = "";

  // 결과 타입 결정
  switch (prediction[0].className) {
    case "freepass":
    case "프리패스상":
    case "상견례 프리패스상":
      resultType = "freepass";
      break;
    case "reject":
    case "문전박대상":
    case "상견례 문전박대상":
      resultType = "reject";
      break;
    default:
      console.log("알 수 없는 클래스명:", prediction[0].className);
      resultType = "";
  }

  // 다국어 결과 메시지 가져오기
  if (resultType) {
    var messages = getResultMessages(resultType, isMale);
    resultTitle = messages.title;
    resultExplain = messages.explain;
    resultCeleb = messages.celeb;
  } else {
    resultTitle = prediction[0].className;
    resultExplain = "#테스트결과";
    resultCeleb = "클래스명 확인 필요: " + prediction[0].className;
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
    // 상견례 테스트 라벨 (다국어 지원)
    switch (currentPrediction.className) {
      case "freepass":
      case "프리패스상":
      case "상견례 프리패스상":
        labelTitle = getLabelText("freepass");
        break;
      case "reject":
      case "문전박대상":
      case "상견례 문전박대상":
        labelTitle = getLabelText("reject");
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
