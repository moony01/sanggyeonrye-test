/**
 * =========================================================================================
 *  Supabase 클라이언트 설정
 *  - 정적 사이트(Jekyll) 환경에서 .env 사용이 제한되므로, Anon Key를 직접 사용합니다.
 * =========================================================================================
 */
const SUPABASE_URL = "https://eevckvdicfhqxywixznt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldmNrdmRpY2ZocXh5d2l4em50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQwMjQsImV4cCI6MjA4MjQ0MDAyNH0.idh6w8dJ-8Rjdh9aB3DuaYofnO78fNBPuSOG8QoqKqM";

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    if (window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('✅ Supabase 클라이언트 초기화 완료');
        } catch (e) {
            console.error('❌ Supabase 클라이언트 초기화 실패:', e);
        }
    } else {
        console.warn('⚠️ window.supabase를 찾을 수 없습니다. CDN 스크립트를 확인하세요.');
    }
    return supabaseClient;
}

const commentListElement = null;
const commentCountElement = null;


// 다국어 메시지 사전
const MESSAGES = {
    ko: {
        vote_success: "{agency}에 소중한 한 표 꾹! 투표가 완료되었습니다.",
        vote_duplicate: "이미 투표하셨습니다!",
        comment_empty: "내용을 입력해주세요.",
        nickname_empty: "닉네임을 입력해주세요.",
        content_empty: "댓글 내용을 입력해주세요.",
        comment_too_long: "댓글은 500자 이내로 작성해주세요.",
        password_prompt: "비밀번호를 입력하세요:",
        edit_prompt: "수정할 내용을 입력해주세요:",
        password_empty: "비밀번호를 입력해주세요.",
        password_wrong: "비밀번호가 일치하지 않습니다.",
        delete_success: "댓글이 삭제되었습니다.",
        update_success: "댓글이 수정되었습니다.",
        post_success: "댓글이 등록되었습니다!",
        fail: "오류가 발생했습니다.",
        vote_limit: "오늘은 이미 3번 투표하셨어요! 내일 다시 투표해주세요.",
        vote_remain: "투표 완료! (오늘 남은 횟수: {count}회)"
    },
    en: {
        vote_success: "Voted for {agency}! Thank you.",
        vote_duplicate: "You have already voted!",
        comment_empty: "Please enter content.",
        nickname_empty: "Please enter nickname.",
        content_empty: "Please enter comment content.",
        comment_too_long: "Comment must be within 500 characters.",
        password_prompt: "Enter password:",
        edit_prompt: "Enter new content:",
        password_empty: "Please enter password.",
        password_wrong: "Incorrect password.",
        delete_success: "Comment deleted.",
        update_success: "Comment updated.",
        post_success: "Comment posted!",
        fail: "An error occurred.",
        vote_limit: "You've already voted 3 times today! Please come back tomorrow.",
        vote_remain: "Voted! ({count} votes remaining today)"
    },
    ja: {
        vote_success: "{agency}に投票しました！ありがとうございます。",
        vote_duplicate: "すでに投票済みです！",
        comment_empty: "内容を入力してください。",
        nickname_empty: "ニックネームを入力してください。",
        content_empty: "コメント内容を入力してください。",
        comment_too_long: "コメントは500文字以内で入力してください。",
        password_prompt: "パスワードを入力してください：",
        edit_prompt: "修正する内容を入力してください：",
        password_empty: "パスワードを入力してください。",
        password_wrong: "パスワードが一致しません。",
        delete_success: "コメントが削除されました。",
        update_success: "コメントが修正されました。",
        post_success: "コメントが登録されました！",
        fail: "エラーが発生しました。",
        vote_limit: "本日はすでに3回投票しました！明日またお願いします。",
        vote_remain: "投票しました！（本日残り{count}回）"
    },
    zh: {
        vote_success: "已给{agency}投票！谢谢。",
        vote_duplicate: "您已经投过票了！",
        comment_empty: "请输入内容。",
        nickname_empty: "请输入昵称。",
        content_empty: "请输入评论内容。",
        comment_too_long: "评论请控制在500字以内。",
        password_prompt: "请输入密码：",
        edit_prompt: "请输入修改内容：",
        password_empty: "请输入密码。",
        password_wrong: "密码不正确。",
        delete_success: "评论已删除。",
        update_success: "评论已修改。",
        post_success: "评论已发布！",
        fail: "发生错误。",
        vote_limit: "您今天已经投票3次了！请明天再来。",
        vote_remain: "投票成功！（今天还剩{count}次）"
    },
    es: {
        vote_success: "¡Votado por {agency}! Gracias.",
        vote_duplicate: "¡Ya has votado!",
        comment_empty: "Por favor ingresa contenido.",
        nickname_empty: "Por favor ingresa apodo.",
        content_empty: "Por favor ingresa contenido.",
        comment_too_long: "Máx 500 caracteres.",
        password_prompt: "Ingresa la contraseña:",
        edit_prompt: "Ingresa nuevo contenido:",
        password_empty: "Ingresa la contraseña.",
        password_wrong: "Contraseña incorrecta.",
        delete_success: "Eliminado.",
        update_success: "Actualizado.",
        post_success: "¡Publicado!",
        fail: "Error.",
        vote_limit: "¡Ya has votado 3 veces hoy! Vuelve mañana.",
        vote_remain: "¡Votado! (Quedan {count} votos hoy)"
    },
    fr: {
        vote_success: "A voté pour {agency} !",
        vote_duplicate: "Déjà voté !",
        comment_empty: "Entrez du contenu.",
        nickname_empty: "Entrez un pseudo.",
        content_empty: "Entrez un commentaire.",
        comment_too_long: "Max 500 caractères.",
        password_prompt: "Mot de passe :",
        edit_prompt: "Nouveau contenu :",
        password_empty: "Entrez le mot de passe.",
        password_wrong: "Mot de passe incorrect.",
        delete_success: "Supprimé.",
        update_success: "Mis à jour.",
        post_success: "Publié !",
        fail: "Erreur.",
        vote_limit: "Vous avez déjà voté 3 fois aujourd'hui ! Revenez demain.",
        vote_remain: "Voté ! (Il reste {count} votes aujourd'hui)"
    },
    de: {
        vote_success: "Für {agency} gestimmt!",
        vote_duplicate: "Bereits abgestimmt!",
        comment_empty: "Inhalt eingeben.",
        nickname_empty: "Nickname eingeben.",
        content_empty: "Kommentar eingeben.",
        comment_too_long: "Max 500 Zeichen.",
        password_prompt: "Passwort:",
        edit_prompt: "Neuer Inhalt:",
        password_empty: "Passwort eingeben.",
        password_wrong: "Falsches Passwort.",
        delete_success: "Gelöscht.",
        update_success: "Aktualisiert.",
        post_success: "Veröffentlicht!",
        fail: "Fehler.",
        vote_limit: "Sie haben heute bereits 3 Mal abgestimmt! Kommen Sie morgen wieder.",
        vote_remain: "Abgestimmt! (Noch {count} Stimmen heute)"
    },
    id: {
        vote_success: "Memilih {agency}!",
        vote_duplicate: "Sudah memilih!",
        comment_empty: "Masukkan konten.",
        nickname_empty: "Masukkan nama panggilan.",
        content_empty: "Masukkan komentar.",
        comment_too_long: "Maks 500 karakter.",
        password_prompt: "Kata sandi:",
        edit_prompt: "Konten baru:",
        password_empty: "Masukkan kata sandi.",
        password_wrong: "Kata sandi salah.",
        delete_success: "Dihapus.",
        update_success: "Diperbarui.",
        post_success: "Terposting!",
        fail: "Kesalahan.",
        vote_limit: "Anda sudah memilih 3 kali hari ini! Silakan kembali besok.",
        vote_remain: "Sudah memilih! (Tersisa {count} suara hari ini)"
    },
    vi: {
        vote_success: "Đã chọn {agency}!",
        vote_duplicate: "Đã chọn rồi!",
        comment_empty: "Nhập nội dung.",
        nickname_empty: "Nhập biệt danh.",
        content_empty: "Nhập bình luận.",
        comment_too_long: "Tối đa 500 ký tự.",
        password_prompt: "Mật khẩu:",
        edit_prompt: "Nội dung mới:",
        password_empty: "Nhập mật khẩu.",
        password_wrong: "Sai mật khẩu.",
        delete_success: "Đã xóa.",
        update_success: "Đã cập nhật.",
        post_success: "Đã đăng!",
        fail: "Lỗi.",
        vote_limit: "Bạn đã bình chọn 3 lần hôm nay! Hãy quay lại vào ngày mai.",
        vote_remain: "Đã bình chọn! (Còn lại {count} lần hôm nay)"
    },
    // Fallback for others (simple English map)
    pl: { vote_success: "Zagłosowano na {agency}!", vote_duplicate: "Już głosowałeś!", comment_empty: "Wpisz treść.", nickname_empty: "Wpisz nick.", content_empty: "Wpisz komentarz.", comment_too_long: "Maks 500 znaków.", password_prompt: "Hasło:", edit_prompt: "Nowa treść:", password_empty: "Podaj hasło.", password_wrong: "Złe hasło.", delete_success: "Usunięto.", update_success: "Zaktualizowano.", post_success: "Opublikowano!", fail: "Błąd.", vote_limit: "Głosowałeś już 3 razy dzisiaj! Wróć jutro.", vote_remain: "Zagłosowano! (Pozostało {count})" },
    nl: { vote_success: "Gestemd op {agency}!", vote_duplicate: "Al gestemd!", comment_empty: "Inhoud invullen.", nickname_empty: "Naam invullen.", content_empty: "Reactie invullen.", comment_too_long: "Max 500 tekens.", password_prompt: "Wachtwoord:", edit_prompt: "Nieuwe inhoud:", password_empty: "Wachtwoord invullen.", password_wrong: "Fout wachtwoord.", delete_success: "Verwijderd.", update_success: "Aangepast.", post_success: "Geplaatst!", fail: "Fout.", vote_limit: "Je hebt vandaag al 3 keer gestemd! Kom morgen terug.", vote_remain: "Gestemd! (Nog {count} vandaag)" },
    pt: { vote_success: "Votou na {agency}!", vote_duplicate: "Já votou!", comment_empty: "Insira conteúdo.", nickname_empty: "Insira apelido.", content_empty: "Insira comentário.", comment_too_long: "Máx 500 caracteres.", password_prompt: "Senha:", edit_prompt: "Novo conteúdo:", password_empty: "Insira a senha.", password_wrong: "Senha incorreta.", delete_success: "Removido.", update_success: "Atualizado.", post_success: "Publicado!", fail: "Erro.", vote_limit: "Você já votou 3 vezes hoje! Volte amanhã.", vote_remain: "Votado! (Restam {count} votos hoje)" },
    ru: { vote_success: "Голос за {agency}!", vote_duplicate: "Уже голосовали!", comment_empty: "Введите текст.", nickname_empty: "Введите ник.", content_empty: "Введите комментарий.", comment_too_long: "Макс 500.", password_prompt: "Пароль:", edit_prompt: "Новый текст:", password_empty: "Введите пароль.", password_wrong: "Неверный пароль.", delete_success: "Удалено.", update_success: "Обновлено.", post_success: "Опубликовано!", fail: "Ошибка.", vote_limit: "Вы уже проголосовали 3 раза сегодня! Приходите завтра.", vote_remain: "Проголосовано! (Осталось {count})" },
    tr: { vote_success: "{agency} oylandı!", vote_duplicate: "Zaten oy verdiniz!", comment_empty: "İçerik girin.", nickname_empty: "Takma ad girin.", content_empty: "Yorum girin.", comment_too_long: "Maks 500.", password_prompt: "Şifre:", edit_prompt: "Yeni içerik:", password_empty: "Şifre girin.", password_wrong: "Yanlış şifre.", delete_success: "Silindi.", update_success: "Güncellendi.", post_success: "Yayınlandı!", fail: "Hata.", vote_limit: "Bugün zaten 3 kez oy verdiniz! Yarın tekrar gelin.", vote_remain: "Oy verildi! (Bugün kalan {count})" },
    uk: { vote_success: "Голос за {agency}!", vote_duplicate: "Вже голосували!", comment_empty: "Введіть текст.", nickname_empty: "Введіть нік.", content_empty: "Введіть коментар.", comment_too_long: "Макс 500.", password_prompt: "Пароль:", edit_prompt: "Новий текст:", password_empty: "Введіть пароль.", password_wrong: "Невірний пароль.", delete_success: "Видалено.", update_success: "Оновлено.", post_success: "Опубліковано!", fail: "Помилка.", vote_limit: "Ви вже проголосували 3 рази сьогодні! Приходьте завтра.", vote_remain: "Проголосовано! (Залишилось {count})" }
};

// 현재 언어 감지 및 메시지 반환 함수
function t(key, params = {}) {
    let lang = document.documentElement.lang || 'en';
    if (!MESSAGES[lang]) lang = 'en';
    let msg = MESSAGES[lang][key] || MESSAGES['en'][key];
    Object.keys(params).forEach(param => {
        msg = msg.replace(`{${param}}`, params[param]);
    });
    return msg;
}

/**
 * [Async] 소속사 투표 통계 불러오기
 * - 'kft_vote_counts' 테이블 조회 (Single Row: id=1)
 */

async function fetchVoteCounts() {
    getSupabase();
    if (!supabaseClient) return;

    try {
        const { data, error } = await supabaseClient
            .from('kft_vote_counts')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;
        if (data) {
            updateVoteUI(data);
        }
    } catch (err) {
        console.error('❌ 투표 통계 불러오기 실패:', err);
    }
}

/**
 * 투표 UI 업데이트
 */
function updateVoteUI(counts) {
    const agencies = ['SM', 'JYP', 'YG']; // 추후 HYBE 등 추가 가능
    
    agencies.forEach(Key => {
        // DB 컬럼은 소문자(sm, jyp, yg), HTML ID는 대문자(cnt-SM)
        const countValue = counts[Key.toLowerCase()] || 0;
        
        // 숫자 애니메이션 적용
        const el = document.getElementById(`cnt-${Key}`);
        if (el) el.innerText = countValue.toLocaleString();
    });
}

/**
 * [Async] 투표 핸들러
 * - 1. 중복 투표 방지 (LocalStorage 체크)
 * - 2. 낙관적 업데이트 (Optimistic UI) - 즉시 반영
 * - 3. 디바운싱 (클릭 방지)
 * - 4. 서버 RPC 호출
 */
async function handleReaction(agency) {
    // 1. 일일 투표 제한 체크 (하루 3회)
    const today = new Date().toDateString();
    const lastVoteDate = localStorage.getItem('kft_last_vote_date');
    let dailyVoteCount = parseInt(localStorage.getItem('kft_daily_vote_count') || '0');

    // 날짜가 바뀌었으면 카운트 초기화
    if (lastVoteDate !== today) {
        dailyVoteCount = 0;
        localStorage.setItem('kft_last_vote_date', today);
        localStorage.setItem('kft_daily_vote_count', '0');
    }

    if (dailyVoteCount >= 3) {
        alert(t('vote_limit'));
        return;
    }
    
    // 2. 버튼 비활성화 (일시적)
    const btn = document.querySelector(`.vote-item.vote-${agency.toLowerCase()}`);
    if(btn) btn.style.pointerEvents = 'none';

    // 3. 낙관적 업데이트 (Optimistic UI)
    const countEl = document.getElementById(`cnt-${agency}`);
    let prevCount = 0;
    if (countEl) {
        prevCount = parseInt(countEl.innerText.replace(/,/g, ''), 10) || 0;
        countEl.innerText = (prevCount + 1).toLocaleString();
        
        // 클릭 효과 (Bounce)
        if(btn) {
            btn.classList.add('animate-vote');
            setTimeout(() => btn.classList.remove('animate-vote'), 500);
        }
    }

    getSupabase();
    if (!supabaseClient) {
        if(btn) btn.style.pointerEvents = 'auto';
        return;
    }

    try {
        // 4. 서버 RPC 호출
        const { error } = await supabaseClient.rpc('increment_vote', { agency_key: agency });
        
        if (error) throw error;
        
        // 5. 투표 완료 처리 (LocalStorage 저장)
        dailyVoteCount++;
        localStorage.setItem('kft_daily_vote_count', dailyVoteCount.toString());
        localStorage.setItem('kft_last_vote_date', today);
        
        alert(t('vote_remain', {count: 3 - dailyVoteCount}));

    } catch (err) {
        console.error(`${agency} 투표 중 오류:`, err);
        
        // ❌ 실패 시 롤백
        if (countEl) countEl.innerText = prevCount.toLocaleString();
        alert(t('fail'));
        
        // LocalStorage에서도 삭제 (다시 시도 가능하게)
        localStorage.removeItem('kft_voted_' + agency);
    } finally {
        // 버튼 다시 활성화
        if(btn) btn.style.pointerEvents = 'auto';
    }
}

/**
 * [Async] 댓글 목록 불러오기
 * - 비밀번호 제외하고 조회
 */
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

/**
 * [Async] 댓글 목록 조회
 * - created_at 내림차순 정렬
 * - 페이징 적용 (10개씩)
 */
async function fetchComments(page = 1) {
    
    // [UI TEST] 더미 데이터 모드
    // 테스트 시 아래 주석을 풀고 return을 활성화하세요.
    /*
    const DUMMY_DATA = [
        { id: 101, nickname: '블랙핑크짱', content: '제 얼굴이 YG상이라니 너무 기뻐요! ㅋㅋㅋ 완전 신기방기\n블랙핑크 제니 느낌 있나요?', created_at: new Date().toISOString(), face_type: 'YG' },
        { id: 102, nickname: 'JYP수장', content: '공기반 소리반 느낌 아시죠? JYP 스타일 확실하네요.\n테스트 결과가 아주 흥미롭습니다.', created_at: new Date(Date.now() - 86400000).toISOString(), face_type: 'JYP' },
        { id: 103, nickname: '광야로걸어', content: '에스파 윈터 닮았다고 나왔어요!! 대박.. \n근데 진짜 닮았나? 주변에 물어봐야겠어요 ㅎㅎ', created_at: new Date(Date.now() - 172800000).toISOString(), face_type: 'SM' },
        { id: 104, nickname: '뉴진스조아', content: '하이브상이라니.. 꿈인가 생시인가 ㅠㅠ \n너무 좋아요! 사이트 디자인도 예쁘네요.', created_at: new Date(Date.now() - 259200000).toISOString(), face_type: 'HYBE' },
        { id: 105, nickname: '지나가던행인', content: '그냥 재미로 해봤는데 은근 정확한듯? 근데 버튼 UI 클릭하면 메뉴 나오는거 맞죠?', created_at: new Date(Date.now() - 345600000).toISOString(), face_type: 'unknown' },
        { id: 106, nickname: '테스트유저6', content: '페이징 테스트용 데이터입니다. 6', created_at: new Date().toISOString(), face_type: 'SM' },
        { id: 107, nickname: '테스트유저7', content: '페이징 테스트용 데이터입니다. 7', created_at: new Date().toISOString(), face_type: 'YG' },
        { id: 108, nickname: '테스트유저8', content: '페이징 테스트용 데이터입니다. 8', created_at: new Date().toISOString(), face_type: 'JYP' },
        { id: 109, nickname: '테스트유저9', content: '페이징 테스트용 데이터입니다. 9', created_at: new Date().toISOString(), face_type: 'HYBE' },
        { id: 110, nickname: '테스트유저10', content: '페이징 테스트용 데이터입니다. 10', created_at: new Date().toISOString(), face_type: 'etc' },
        { id: 111, nickname: '테스트유저11', content: '다음 페이지 데이터 확인용 11', created_at: new Date().toISOString(), face_type: 'SM' }
    ];

    console.log('🧪 [테스트 모드] 더미 데이터 렌더링');
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pagedDummy = DUMMY_DATA.slice(start, end);
    
    renderComments(pagedDummy);
    renderPagination(DUMMY_DATA.length, page);
    return; 
    */

    getSupabase();
    const listEl = document.getElementById('comment-list');
    if (!supabaseClient || !listEl) return;

    try {
        currentPage = page;
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error, count } = await supabaseClient
            .from('kft_comments')
            .select('id, created_at, nickname, content, face_type', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // 전체 댓글 수 업데이트
        const countEl = document.getElementById('comment-count');
        if (countEl) countEl.innerText = count || 0;

        renderComments(data);
        renderPagination(count, page);
        
    } catch (err) {
        console.error('❌ 댓글 불러오기 실패:', err);
    }
}

/**
 * 페이징 UI 렌더링
 */
function renderPagination(totalCount, page) {
    const paginationEl = document.getElementById('pagination-container');
    const numbersEl = document.getElementById('page-numbers');
    const prevBtn = paginationEl.querySelector('.prev');
    const nextBtn = paginationEl.querySelector('.next');

    if (!paginationEl || !numbersEl) return;

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    // 페이지가 없거나 1페이지뿐이면 처리
    if (totalPages <= 1) {
        if (totalCount === 0) {
            paginationEl.style.display = 'none';
        } else {
            paginationEl.style.display = 'flex';
            numbersEl.innerHTML = `<button class="page-btn active">1</button>`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }
        return;
    }

    paginationEl.style.display = 'flex';

    // Prev/Next 버튼 상태
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
    
    // 이벤트 리스너 재할당
    prevBtn.onclick = () => fetchComments(page - 1);
    nextBtn.onclick = () => fetchComments(page + 1);

    // 페이지 번호 생성 (최대 5개 표시 알고리즘)
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // 끝쪽 페이지 보정
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    let html = '';
    
    // 첫 페이지로 가는 버튼
    if (startPage > 1) {
        html += `<button class="page-btn" onclick="fetchComments(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-dots">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === page ? 'active' : '';
        html += `<button class="page-btn ${isActive}" onclick="fetchComments(${i})">${i}</button>`;
    }

    // 마지막 페이지로 가는 버튼
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
        html += `<button class="page-btn" onclick="fetchComments(${totalPages})">${totalPages}</button>`;
    }

    numbersEl.innerHTML = html;
}

function renderComments(comments) {
    const listEl = document.getElementById('comment-list');


    if (!comments || comments.length === 0) {
        if(listEl) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">💬</span>
                    <p>아직 댓글이 없습니다.<br>가장 먼저 <strong>분석 결과</strong>를 공유해보세요!</p>
                </div>`;
        }
        return;
    }

    const html = comments.map(comment => {
        const dateObj = new Date(comment.created_at);
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

        let faceBadge = '';
        if (comment.face_type && comment.face_type !== 'unknown') {
            const faceType = comment.face_type;
            let className = 'badge-unknown';
            if (['SM', 'JYP', 'YG'].includes(faceType)) {
                className = `badge-${faceType.toLowerCase()}`;
            }
            faceBadge = `<span class="face-badge ${className}">${escapeHtml(faceType)} Style</span>`;
        }

        return `
        <div class="comment-item" id="comment-${comment.id}">
            <div class="cmt-top">
                <div class="cmt-info">
                    <span class="cmt-user">${escapeHtml(comment.nickname)}</span>
                    ${faceBadge}
                </div>
                <div class="cmt-right-group">
                    <span class="cmt-date">${dateStr}</span>
                    <div class="more-menu-container">
                        <button class="btn-more" onclick="toggleMenu(${comment.id}, event)" aria-label="댓글 옵션 더보기">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div id="menu-${comment.id}" class="more-dropdown">
                            <button onclick="handleEdit(${comment.id}, '${escapeHtml(comment.content)}')">
                                <i class="fa-solid fa-pen"></i> 수정
                            </button>
                            <button onclick="handleDelete(${comment.id})">
                                <i class="fa-solid fa-trash"></i> 삭제
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cmt-body">
                <div class="cmt-text">${escapeHtml(comment.content)}</div>
            </div>
        </div>`;
    }).join('');

    if(listEl) listEl.innerHTML = html;
}

/**
 * [Async] 댓글 삭제
 * - 사용자에게 비밀번호 입력 요구 -> RPC 'delete_comment' 호출
 */
async function handleDelete(id) {
    const password = prompt(t('password_prompt'));
    if (!password) return;

    getSupabase();
    if (!supabaseClient) return;

    try {
        const { data: success, error } = await supabaseClient.rpc('delete_comment', { 
            row_id: id, 
            password_input: password 
        });

        if (error) throw error;

        if (success) {
            alert(t('delete_success'));
            fetchComments();
        } else {
            alert(t('password_wrong'));
        }
    } catch (err) {
        console.error('댓글 삭제 오류:', err);
        alert(t('fail'));
    }
}

/**
 * [Async] 댓글 수정
 * - 비밀번호 및 새 내용 입력 요구 -> RPC 'update_comment' 호출
 */
async function handleEdit(id, oldContent) {
    const password = prompt(t('password_prompt'));
    if (!password) return;

    const newContent = prompt(t('edit_prompt'), oldContent);
    if (newContent === null) return;
    if (newContent.trim() === "") {
        alert(t('comment_empty'));
        return;
    }

    getSupabase();
    if (!supabaseClient) return;

    try {
        const { data: success, error } = await supabaseClient.rpc('update_comment', {
            row_id: id,
            password_input: password,
            new_content: newContent.trim()
        });

        if (error) throw error;

        if (success) {
            alert(t('update_success'));
            fetchComments();
        } else {
            alert(t('password_wrong'));
        }
    } catch (err) {
        console.error('댓글 수정 오류:', err);
        alert(t('fail'));
    }
}

/**
 * [Async] 댓글 작성
 */
async function postComment() {
    getSupabase();
    if (!supabaseClient) {
        alert(t('fail'));
        return;
    }

    const facetype = document.getElementById('cmt-facetype').value;
    const nickname = document.getElementById('cmt-nickname').value.trim();
    const password = document.getElementById('cmt-password').value.trim();
    const content = document.getElementById('cmt-content').value.trim();

    if (!nickname) {
        alert(t('nickname_empty'));
        document.getElementById('cmt-nickname').focus();
        return;
    }
    if (!password) {
        alert(t('password_empty'));
        document.getElementById('cmt-password').focus();
        return;
    }
    if (!content) {
        alert(t('content_empty'));
        document.getElementById('cmt-content').focus();
        return;
    }
    
    // 500자 제한 유효성 체크
    if (content.length > 500) {
        alert(t('comment_too_long'));
        document.getElementById('cmt-content').focus();
        return;
    }

    try {
        const insertPayload = {
            nickname: nickname,
            password: password,
            content: content,
            face_type: facetype
        };

        const { error } = await supabaseClient
            .from('kft_comments')
            .insert([insertPayload]);

        if (error) throw error;

        document.getElementById('cmt-nickname').value = '';
        document.getElementById('cmt-password').value = '';
        document.getElementById('cmt-content').value = '';
        document.getElementById('cmt-facetype').value = 'unknown';

        alert(t('post_success'));
        fetchComments();

    } catch (err) {
        console.error('댓글 등록 실패:', err);
        alert(t('fail'));
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * 더보기 메뉴 토글
 */
function toggleMenu(id, event) {
    event.stopPropagation(); // 버튼 클릭 시 이벤트 전파 방지
    const menu = document.getElementById(`menu-${id}`);
    
    // 다른 열린 메뉴들 닫기
    document.querySelectorAll('.more-dropdown').forEach(el => {
        if (el.id !== `menu-${id}`) {
            el.classList.remove('show');
        }
    });

    if (menu) {
        menu.classList.toggle('show');
    }
}

// 외부 클릭 시 모든 메뉴 닫기
document.addEventListener('click', (e) => {
    if (!e.target.closest('.more-menu-container')) {
        document.querySelectorAll('.more-dropdown').forEach(el => {
            el.classList.remove('show');
        });
    }
});

window.toggleMenu = toggleMenu;
window.postComment = postComment;
window.fetchComments = fetchComments;
window.handleReaction = handleReaction;
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;

/**
 * 페이지 로드 초기화
 */
function loadInitialData() {
    console.log('🔄 초기 데이터 로딩...');
    
    // 댓글 섹션 로드
    if (document.getElementById('comment-list')) {
        fetchComments();
    }

    // 투표 섹션 로드
    if (document.getElementById('vote-container')) {
        console.log('투표 섹션 발견, 통계 로딩...');
        fetchVoteCounts();
        
        // 내 투표 이력 체크
        ['SM', 'JYP', 'YG'].forEach(agency => {
            if (localStorage.getItem('kft_voted_' + agency)) {
                // 이미 투표했다면 스타일 변경 등 처리 가능
            }
        });
    }
}

// DOMContentLoaded 이벤트 리스너
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialData);
} else {
    // 이미 로드된 경우 즉시 실행
    loadInitialData();
}
