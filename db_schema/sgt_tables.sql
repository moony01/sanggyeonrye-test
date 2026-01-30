-- =========================================================================================
-- 상견례 얼굴상 테스트 (SGT) - Supabase 테이블 및 함수 정의
-- 실행 방법: Supabase Dashboard > SQL Editor에서 이 스크립트 전체를 복사하여 실행
-- =========================================================================================

-- 1. 투표 통계 테이블 (sgt_vote_counts)
-- ------------------------------------------------------------------------------------------
CREATE TABLE sgt_vote_counts (
  id INT PRIMARY KEY DEFAULT 1,
  freepass INT DEFAULT 0,    -- 프리패스상 투표 수
  moonjeon INT DEFAULT 0,    -- 문전박대상 투표 수
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 데이터 삽입 (단일 행)
INSERT INTO sgt_vote_counts (id, freepass, moonjeon) VALUES (1, 0, 0);

-- RLS (Row Level Security) 활성화 및 정책
ALTER TABLE sgt_vote_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON sgt_vote_counts FOR SELECT USING (true);


-- 2. 댓글 테이블 (sgt_comments)
-- ------------------------------------------------------------------------------------------
CREATE TABLE sgt_comments (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  password VARCHAR(100) NOT NULL,
  face_type VARCHAR(20) DEFAULT 'unknown',  -- FREEPASS, MOONJEON, unknown
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화 및 정책
ALTER TABLE sgt_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON sgt_comments FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON sgt_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for all" ON sgt_comments FOR UPDATE USING (true);
CREATE POLICY "Allow delete for all" ON sgt_comments FOR DELETE USING (true);


-- 3. 투표 증가 RPC 함수 (increment_sgt_vote)
-- ------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_sgt_vote(agency_key TEXT)
RETURNS void AS $$
BEGIN
  IF agency_key = 'FREEPASS' THEN
    UPDATE sgt_vote_counts SET freepass = freepass + 1, updated_at = NOW() WHERE id = 1;
  ELSIF agency_key = 'MOONJEON' THEN
    UPDATE sgt_vote_counts SET moonjeon = moonjeon + 1, updated_at = NOW() WHERE id = 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. 댓글 삭제 RPC 함수 (delete_sgt_comment)
-- ------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_sgt_comment(row_id INT, password_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  matched BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM sgt_comments WHERE id = row_id AND password = password_input
  ) INTO matched;
  
  IF matched THEN
    DELETE FROM sgt_comments WHERE id = row_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. 댓글 수정 RPC 함수 (update_sgt_comment)
-- ------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_sgt_comment(row_id INT, password_input TEXT, new_content TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  matched BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM sgt_comments WHERE id = row_id AND password = password_input
  ) INTO matched;
  
  IF matched THEN
    UPDATE sgt_comments SET content = new_content WHERE id = row_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================================================
-- 6. 대댓글 기능을 위한 parent_id 컬럼 추가 마이그레이션
-- ------------------------------------------------------------------------------------------
-- 이 스크립트는 기존 sgt_comments 테이블에 parent_id 컬럼을 추가합니다.
-- 이미 테이블이 존재하는 경우 아래 ALTER TABLE 구문만 실행하세요.
-- =========================================================================================

-- parent_id 컬럼 추가 (NULL이면 원댓글, 값이 있으면 대댓글)
ALTER TABLE sgt_comments ADD COLUMN IF NOT EXISTS parent_id INT REFERENCES sgt_comments(id) ON DELETE CASCADE;

-- 성능을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sgt_comments_parent_id ON sgt_comments(parent_id);


-- =========================================================================================
-- 설치 완료 확인
-- =========================================================================================
-- 아래 쿼리로 테이블이 정상 생성되었는지 확인하세요:
-- SELECT * FROM sgt_vote_counts;
-- SELECT * FROM sgt_comments LIMIT 5;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'sgt_comments';
