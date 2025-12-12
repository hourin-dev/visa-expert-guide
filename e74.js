// e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (최종 안정화 버전)

const GNI_2025_ESTIMATE = 42200000; // 2024년 GNI (4,220만원) 기준 가정
const GNI_MANWON = (GNI_2025_ESTIMATE / 10000).toFixed(0);

function getScoreRange(value, tiers) {
    for (const tier of tiers) {
        if (value >= tier.min) {
            return tier.score;
        }
    }
    return 0;
}

function generateDocumentList() {
    // 서류 목록 생성 함수 (변경 없음)
    return `
        <h3>✅ E-7-4 비자 신청 필수 서류 (적격자용)</h3>
        <p style="font-style: italic;">* 모든 서류는 발급일로부터 3개월 이내여야 합니다.</p>
        <ul class="doc-list">
            <li>1. 통합 신청서 (별지 제34호 서식)</li>
            <li>2. 여권 및 외국인 등록증 원본 및 사본</li>
            <li>3. 고용 사유서 및 고용 계약서 사본</li>
            <li>4. **소득 금액 증명원** (국세청 발급, 직전 연도 소득 확인용)</li>
            <li>5. 한국어능력 입증 서류 (TOPIK 성적표 또는 KIIP 이수증)</li>
            <li>6. 경력 증명 서류 및 **가점 항목별 입증 서류** (기술 자격증, 학위 등)</li>
            <li>7. 체류지 입증 서류 (임대차 계약서 사본)</li>
        </ul>
        <p style="margin-top: 10px; color: #d9534f;">⚠️ **주의:** 상기 서류 외, 심사 과정에서 추가 서류가 요구될 수 있습니다.</p>
    `;
}

function generateScoreTable() {
    // 배점표 기준표 생성 함수 (변경 없음)
    return `
        <style>
            .base-score-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.95em; }
            .base-score-table th, .base-score-table td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            .base-score-table th { background-color: #e9ecef; }
        </style>
        
        <h4>⭐ E-7-4 비자 배점 기준표 (참고용)</h4>

        <h5>A. 기본 항목 (최대 200점)</h5>
        <table class="base-score-table">
            <tr><th>배점 항목</th><th>배정 기준 및 점수</th><th>최대 점수</th></tr>
            <tr>
                <td>소득</td>
                <td>GNI 1.5배 이상 (80점), GNI 1.0배 이상 (60점), GNI 0.5배 이상 (10점) 등 (GNI 약 ${GNI_MANWON}만원)</td>
                <td>80점</td>
            </tr>
            <tr>
                <td>경력</td>
                <td>5년 이상 (50점), 1년 이상 (10점) 등 (연속성 불필요)</td>
                <td>50점</td>
            </tr>
            <tr>
                <td>한국어</td>
                <td>KIIP 5단계/TOPIK 5급 (50점), KIIP 4단계/TOPIK 4급 (40점) 등</td>
                <td>50점</td>
            </tr>
            <tr>
                <td>나이</td>
                <td>만 35세 이상 (20점), 만 25세 이상 (10점) 등</td>
                <td>20점</td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: right; font-weight: bold;">총합 (Max)</td>
                <td>200점</td>
            </tr>
        </table>
        
        <h5>B. 가점 및 감점 항목</h5>
        <table class="base-score-table">
            <tr><th>구분</th><th>배점 항목</th><th>상세 기준</th><th>배점</th></tr>
            <tr>
                <td rowspan="4">가점</td>
                <td>기술/숙련도 자격증</td>
                <td>한국산업인력공단 발행 자격증 등</td>
                <td>10점</td>
            </tr>
            <tr>
                <td>국내 전문학사 이상 학위</td>
                <td>국내 학위 취득 시</td>
                <td>10점</td>
            </tr>
            <tr>
                <td>지방 근무 (지자체 추천)</td>
                <td>수도권 외 지방 근무</td>
                <td>10점</td>
            </tr>
            <tr>
                <td>자산 보유</td>
                <td>(별도 기준 충족 시)</td>
                <td>5점</td>
            </tr>
            <tr>
                <td>감점</td>
                <td>출입국관리법 위반</td>
                <td>1회 (-5점), 2회 (-10점)</td>
                <td>-5 ~ -50점</td>
            </tr>
        </table>
    `;
}

function resetE74Form() {
    // 폼 전체를 초기화합니다.
    document.getElementById('e74Form').reset();
    
    // 결과 출력 영역도 비우고 숨깁니다.
    document.getElementById('e74Result').innerHTML = '';
    document.getElementById('e74DocumentGuidance').innerHTML = '';
    document.getElementById('e74DocumentGuidance').style.display = 'none';
    document.getElementById('e74CloseButtonArea').style.display = 'none';
    document.getElementById('e74ScoreTableArea').innerHTML = ''; 
    document.getElementById('e74ScoreTableArea').style.display = 'none';
    
    alert('모든 입력 내용이 초기화되었습니다.');
}

function calculateE74() {
    // 🚨 계산 시작 시 기존 결과 영역 및 배점표 영역을 숨깁니다.
    document.getElementById('e74Result').innerHTML = '';
    document.getElementById('e74DocumentGuidance').style.display = 'none';
    document.getElementById('e74CloseButtonArea').style.display = 'none';
    document.getElementById('e74ScoreTableArea').style.display = 'none'; 

    // 1. 입력 값 가져오기 (요소 존재 확인 및 안전한 값 파싱)
    const incomeElement = document.getElementById('e74_income');
    const ageElement = document.getElementById('e74_age');

    // 🚨 필수 요소 존재 확인 및 필수 입력 값 검사
    if (!incomeElement || !ageElement) {
        document.getElementById('e74Result').innerHTML = 
            '<p style="color:red; font-weight:bold;">❌ 시스템 오류: HTML 요소를 찾을 수 없습니다. (ID 불일치 가능성)</p>';
        return; 
    }
    if (!incomeElement.value || !ageElement.value) {
        document.getElementById('e74Result').innerHTML = 
            '<p style="color:red; font-weight:bold;">⚠️ 필수 항목 (소득, 나이)을 입력해 주세요!</p>';
        return; // 계산 중단
    }

    // 값 파싱 (violationCount를 포함하여 모든 값을 안전하게 파싱)
    const income = parseInt(incomeElement.value) || 0;
    const koreanScore = parseInt(document.getElementById('e74_korean')?.value) || 0;
    const age = parseInt(ageElement.value) || 0;
    const career = parseInt(document.getElementById('e74_career')?.value) || 0; 
    
    // 🚨 ReferenceError 해결: 변수 선언 시 let을 사용하고, 안전하게 파싱합니다.
    const violationCount = parseInt(document.getElementById('e74_violation_count')?.value) || 0; 
    
    // 가점 항목 체크박스 (안전한 호출)
    const techCheck = document.getElementById('e74_tech')?.checked || false;
    const degreeCheck = document.getElementById('e74_degree')?.checked || false;
    const kiipCompCheck = document.getElementById('e74_kiipcomp')?.checked || false;
    const assetCheck = document.getElementById('e74_asset')?.checked || false;
    const localCheck = document.getElementById('e74_local')?.checked || false;
    const serviceCheck = document.getElementById('e74_service')?.checked || false;

    const resultBox = document.getElementById('e74Result');
    const docBox = document.getElementById('e74DocumentGuidance'); 
    const closeArea = document.getElementById('e74CloseButtonArea'); 
    const scoreTableArea = document.getElementById('e74ScoreTableArea'); 

    // 2. 점수 계산
    let incomeScore = 0;
    let ageScore = 0;
    let careerScore = 0;
    let bonusScore = 0;
    let penaltyScore = 0;
    let requiredConditionMet = true;
    let requiredMessage = '';

    const REQUIRED_MIN_SCORE = 200;
    const REQUIRED_INCOME_MIN_POINT = 10;
    const REQUIRED_KOREAN_MIN_POINT = 20;

    // --- I. 기본 점수 계산 ---
    // 소득 점수
    const incomeTiers = [
        { min: GNI_2025_ESTIMATE * 1.5, score: 80 }, { min: GNI_2025_ESTIMATE * 1.2, score: 70 },
        { min: GNI_2025_ESTIMATE * 1.0, score: 60 }, { min: GNI_2025_ESTIMATE * 0.8, score: 40 },
        { min: GNI_2025_ESTIMATE * 0.6, score: 20 }, { min: GNI_2025_ESTIMATE * 0.5, score: 10 }
    ];
    incomeScore = getScoreRange(income, incomeTiers);

    // 나이 점수
    const ageTiers = [{ min: 35, score: 20 }, { min: 30, score: 15 }, { min: 25, score: 10 }, { min: 20, score: 5 }];
    ageScore = getScoreRange(age, ageTiers);

    // 국내 경력 점수
    careerScore = Math.min(50, Math.floor(career / 12) * 10);

    // --- II. 가점 및 III. 감점 계산 ---
    bonusScore = (techCheck ? 10 : 0) + (degreeCheck ? 10 : 0) + (assetCheck ? 5 : 0) + (localCheck ? 10 : 0) + (kiipCompCheck ? 10 : 0) + (serviceCheck ? 5 : 0);
    
    // 감점 계산 시 'violationCount' 변수 사용
    penaltyScore = (violationCount >= 3) ? -50 : (violationCount === 2) ? -10 : (violationCount === 1) ? -5 : 0;
    
    // 🚨 총점 계산
    let totalScore = incomeScore + koreanScore + ageScore + careerScore + bonusScore + penaltyScore;
    
    // --- IV. 필수 요건 최종 확인 ---
    if (incomeScore < REQUIRED_INCOME_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `소득 점수(${incomeScore}점)가 필수 최소 점수(${REQUIRED_INCOME_MIN_POINT}점)에 미달합니다.`;
    } else if (koreanScore < REQUIRED_KOREAN_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `한국어 점수(${koreanScore}점)가 필수 최소 점수(${REQUIRED_KOREAN_MIN_