// e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (항목별 점수 상세 출력)

const GNI_2025_ESTIMATE = 42200000;

function getScoreRange(value, tiers) {
    for (const tier of tiers) {
        if (value >= tier.min) {
            return tier.score;
        }
    }
    return 0;
}

function generateDocumentList() {
    // 적격 판정 시 안내할 필수 서류 목록 HTML 생성 (이전과 동일)
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

// -------------------------------------------------------------
// *새로 추가된 함수* - 입력 내용 초기화 함수
// -------------------------------------------------------------
function resetE74Form() {
    // 폼 전체를 초기화합니다.
    document.getElementById('e74Form').reset();
    
    // 결과 출력 영역도 비우고 숨깁니다.
    document.getElementById('e74Result').innerHTML = '';
    document.getElementById('e74DocumentGuidance').innerHTML = '';
    document.getElementById('e74DocumentGuidance').style.display = 'none';
    document.getElementById('e74CloseButtonArea').style.display = 'none';
    
    alert('모든 입력 내용이 초기화되었습니다.');
}
// -------------------------------------------------------------

function calculateE74() {
    // 🚨 계산 시작 시 기존 결과 영역을 숨깁니다.
    document.getElementById('e74Result').innerHTML = '';
    document.getElementById('e74DocumentGuidance').style.display = 'none';
    document.getElementById('e74CloseButtonArea').style.display = 'none';

    // 1. 입력 값 가져오기
    const income = parseInt(document.getElementById('e74_income').value) || 0;
    const koreanScore = parseInt(document.getElementById('e74_korean').value) || 0;
    const age = parseInt(document.getElementById('e74_age').value) || 0;
    const career = parseInt(document.getElementById('e74_career').value) || 0; // 개월 수
    const violationCount = parseInt(document.getElementById('e74_violation_count').value) || 0;

    // 가점 항목 체크박스
    const techCheck = document.getElementById('e74_tech').checked;
    const degreeCheck = document.getElementById('e74_degree').checked;
    const kiipCompCheck = document.getElementById('e74_kiipcomp').checked;
    const assetCheck = document.getElementById('e74_asset').checked;
    const localCheck = document.getElementById('e74_local').checked;
    const serviceCheck = document.getElementById('e74_service').checked;

    const resultBox = document.getElementById('e74Result');
    const docBox = document.getElementById('e74DocumentGuidance'); 
    const closeArea = document.getElementById('e74CloseButtonArea'); 

    // 2. 초기 점수 설정 및 필수 요건 확인
    let totalScore = 0;
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
    // 2.1. 소득 점수 (최대 80점)
    const incomeTiers = [
        { min: GNI_2025_ESTIMATE * 1.5, score: 80 }, { min: GNI_2025_ESTIMATE * 1.2, score: 70 },
        { min: GNI_2025_ESTIMATE * 1.0, score: 60 }, { min: GNI_2025_ESTIMATE * 0.8, score: 40 },
        { min: GNI_2025_ESTIMATE * 0.6, score: 20 }, { min: GNI_2025_ESTIMATE * 0.5, score: 10 }
    ];
    incomeScore = getScoreRange(income, incomeTiers);

    // 2.2. 나이 점수 (최대 20점)
    const ageTiers = [{ min: 35, score: 20 }, { min: 30, score: 15 }, { min: 25, score: 10 }, { min: 20, score: 5 }];
    ageScore = getScoreRange(age, ageTiers);

    // 2.3. 국내 경력 점수 (최대 50점)
    careerScore = Math.min(50, Math.floor(career / 12) * 10);

    // 기본 점수 합산 (총점수 계산의 중간 단계)
    let baseScore = incomeScore + ageScore + careerScore + koreanScore;

    // --- II. 가점 계산 (최대 90점) ---
    if (techCheck) { bonusScore += 10; }
    if (degreeCheck) { bonusScore += 10; }
    if (kiipCompCheck) { bonusScore += 10; }
    if (assetCheck) { bonusScore += 5; }
    if (localCheck) { bonusScore += 10; }
    if (serviceCheck) { bonusScore += 5; }

    // --- III. 감점 계산 (최대 50점 감점) ---
    if (violationCount >= 3) {
        penaltyScore = -50;
    } else if (violationCount === 2) {
        penaltyScore = -10;
    } else if (violationCount === 1) {
        penaltyScore = -5;
    }
    
    // 최종 총점
    totalScore = baseScore + bonusScore + penaltyScore;

    // --- IV. 필수 요건 최종 확인 ---
    if (incomeScore < REQUIRED_INCOME_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `소득 점수(${incomeScore}점)가 필수 최소 점수(${REQUIRED_INCOME_MIN_POINT}점)에 미달합니다.`;
    } else if (koreanScore < REQUIRED_KOREAN_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `한국어 점수(${koreanScore}점)가 필수 최소 점수(${REQUIRED_KOREAN_MIN_POINT}점)에 미달합니다.`;
    } else if (violationCount >= 3) {
        requiredConditionMet = false;
        requiredMessage = '출입국관리법 위반 3회 이상으로 즉시 불허 사유입니다.';
    }

    // 3. 최종 진단
    let diagnosisStatus = '';
    let resultColor = 'red';
    let isPass = false;

    if (!requiredConditionMet) {
        diagnosisStatus = `⛔ 불허 (필수 요건 미충족)`;
        resultColor = 'red';
    } else if (totalScore >= REQUIRED_MIN_SCORE) {
        diagnosisStatus = `✅ 적격 (PASS) - 합격 가능성이 높습니다.`;
        resultColor = 'green';
        isPass = true; // 적격 판정
    } else {
        diagnosisStatus = `⚠️ 부적격 (총점 미달)`;
        resultColor = 'orange';
    }

    // 4. 결과 출력 (총점 및 상세 점수 포함)
    resultBox.innerHTML = `
        <h3>✨ E-7-4 최종 진단 결과</h3>
        <p><strong>총 점수:</strong> <span style="font-size: 1.5em; font-weight: 900; color: ${resultColor};">${totalScore}점</span> (기준 ${REQUIRED_MIN_SCORE}점)</p>
        <p><strong>최종 진단:</strong> <span style="font-weight: bold; color: ${resultColor};">${diagnosisStatus}</span></p>
        <hr>
        <h4>[항목별 상세 배정 점수]</h4>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="font-weight: bold; margin-bottom: 5px;">기본 점수 (최대 200점)</li>
            <li>- ① 소득 (${(income / 10000).toFixed(0)}만원): <strong style="color: ${incomeScore > 0 ? 'blue' : 'gray'};">${incomeScore}점</strong></li>
            <li>- ② 한국어 능력: <strong style="color: ${koreanScore > 0 ? 'blue' : 'gray'};">${koreanScore}점</strong></li>
            <li>- ③ 나이 (만 ${age}세): <strong style="color: ${ageScore > 0 ? 'blue' : 'gray'};">${ageScore}점</strong></li>
            <li>- ④ 국내 경력 (${(career / 12).toFixed(1)}년): <strong style="color: ${careerScore > 0 ? 'blue' : 'gray'};">${careerScore}점</strong></li>
            <li style="font-weight: bold; margin-top: 10px;">가점/감점 (최대 90점)</li>
            <li>- 가점 합계: <strong style="color: green;">+${bonusScore}점</strong></li>
            <li>- 감점 합계: <strong style="color: red;">${penaltyScore}점</strong></li>
        </ul>
        ${requiredMessage ? `<p style="color:red; font-weight:bold;">필수 요건 미충족 사유: ${requiredMessage}</p>` : ''}
        <p class="note">※ 본 진단은 참고용입니다. GNI 기준: 약 ${(GNI_2025_ESTIMATE / 10000).toFixed(0)}만원</p>
    `;

    // 5. 서류 안내 및 닫기 버튼 제어
    if (isPass) {
        docBox.innerHTML = generateDocumentList();
        docBox.style.display = 'block';
        closeArea.style.display = 'block'; // 닫기 버튼 영역 활성화
    } else {
        docBox.innerHTML = '';
        docBox.style.display = 'none';
        closeArea.style.display = 'none'; // 닫기 버튼 영역 비활성화
    }
}