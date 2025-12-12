// e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (서류 안내 및 닫기 버튼 포함)

const GNI_2025_ESTIMATE = 42200000; // 2024년 GNI (4,220만원) 기준 가정

function getScoreRange(value, tiers) {
    for (const tier of tiers) {
        if (value >= tier.min) {
            return tier.score;
        }
    }
    return 0;
}

// -------------------------------------------------------------
// *추가된 기능* - 적격 시 서류 목록 HTML 생성 함수
// -------------------------------------------------------------
function generateDocumentList() {
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

function calculateE74() {
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
    // 🚨 업데이트: 서류 안내 영역과 닫기 버튼 요소를 가져옵니다.
    const docBox = document.getElementById('e74DocumentGuidance'); 
    const closeBtn = docBox ? docBox.querySelector('.close-modal-btn') : null; 

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
    const REQUIRED_INCOME_MIN_POINT = 10; // 최소 소득 점수 요건
    const REQUIRED_KOREAN_MIN_POINT = 20; // 최소 한국어 점수 요건 (KIIP 2단계 또는 TOPIK 2급)

    // --- I. 기본 점수 계산 ---
    // 2.1. 소득 점수 (최대 80점)
    const incomeTiers = [
        { min: GNI_2025_ESTIMATE * 1.5, score: 80 }, { min: GNI_2025_ESTIMATE * 1.2, score: 70 },
        { min: GNI_2025_ESTIMATE * 1.0, score: 60 }, { min: GNI_2025_ESTIMATE * 0.8, score: 40 },
        { min: GNI_2025_ESTIMATE * 0.6, score: 20 }, { min: GNI_2025_ESTIMATE * 0.5, score: 10 }
    ];
    incomeScore = getScoreRange(income, incomeTiers);

    // 2.2. 나이 점수 (최대 20점)
    const ageTiers = [
        { min: 35, score: 20 }, { min: 30, score: 15 }, 
        { min: 25, score: 10 }, { min: 20, score: 5 }
    ];
    ageScore = getScoreRange(age, ageTiers);

    // 2.3. 국내 경력 점수 (최대 50점)
    careerScore = Math.min(50, Math.floor(career / 12) * 10);

    totalScore = incomeScore + ageScore + careerScore + koreanScore;

    // --- II. 가점 계산 (최대 90점) ---
    if (techCheck) { bonusScore += 10; }
    if (degreeCheck) { bonusScore += 10; }
    if (kiipCompCheck) { bonusScore += 10; }
    if (assetCheck) { bonusScore += 5; }
    if (localCheck) { bonusScore += 10; }
    if (serviceCheck) { bonusScore += 5; }
    totalScore += bonusScore;

    // --- III. 감점 계산 (최대 50점 감점) ---
    if (violationCount >= 3) {
        penaltyScore = -50;
    } else if (violationCount === 2) {
        penaltyScore = -10;
    } else if (violationCount === 1) {
        penaltyScore = -5;
    }
    totalScore += penaltyScore;
    
    // --- IV. 필수 요건 최종 확인 ---
    if (incomeScore < REQUIRED_INCOME_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `소득 점수(현재 ${incomeScore}점)가 필수 최소 점수(${REQUIRED_INCOME_MIN_POINT}점)에 미달합니다.`;
    } else if (koreanScore < REQUIRED_KOREAN_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `한국어 점수(현재 ${koreanScore}점)가 필수 최소 점수(${REQUIRED_KOREAN_MIN_POINT}점)에 미달합니다.`;
    } else if (violationCount >= 3) {
        requiredConditionMet = false;
        requiredMessage = '출입국관리법 위반 3회 이상으로 즉시 불허 사유입니다.';
    }

    // --- V. 최종 진단 출력 ---
    let diagnosisStatus = '';
    let resultColor = 'red';
    let isPass = false; // 적격 여부 플래그

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

    // 1. 점수 결과 출력
    resultBox.innerHTML = `
        <h3>✨ E-7-4 최종 진단 결과</h3>
        <p><strong>총 점수:</strong> <span style="font-size: 1.2em; color: ${resultColor};">${totalScore}점</span> (기준 ${REQUIRED_MIN_SCORE}점)</p>
        <p><strong>최종 진단:</strong> <span style="font-weight: bold; color: ${resultColor};">${diagnosisStatus}</span></p>
        <hr>
        <p><strong>[점수 상세]</strong></p>
        <ul>
            <li>소득 점수: ${incomeScore}점 (${(income / 10000).toFixed(0)}만원)</li>
            <li>한국어 점수: ${koreanScore}점</li>
            <li>나이 점수: ${ageScore}점 (만 ${age}세)</li>
            <li>국내 경력 점수: ${careerScore}점 (${(career / 12).toFixed(1)}년)</li>
            <li>가점 합계: ${bonusScore}점</li>
            <li>감점 합계: ${penaltyScore}점</li>
        </ul>
        ${requiredMessage ? `<p style="color:red; font-weight:bold;">필수 요건 미충족 사유: ${requiredMessage}</p>` : ''}
        <p class="note">※ 본 진단은 참고용이며, 최종 심사는 법무부 지침에 따릅니다. (GNI 기준 약 ${(GNI_2025_ESTIMATE / 10000).toFixed(0)}만원 가정)</p>
    `;

    // 2. 서류 안내 및 닫기 버튼 제어
    if (docBox && closeBtn) { // 요소가 정상적으로 존재하는지 확인
        if (isPass) {
            // 서류 목록 생성
            const docsHtml = generateDocumentList();
            
            // 🚨 업데이트: 닫기 버튼을 제외한 서류 목록 HTML만 삽입
            docBox.innerHTML = docsHtml; 
            
            // 닫기 버튼을 서류 목록 다음에 다시 붙이고 보이게 합니다.
            docBox.appendChild(closeBtn); 
            docBox.style.display = 'block';
            closeBtn.style.display = 'block';
        } else {
            // 부적격 시 서류 안내 숨김
            docBox.style.display = 'none';
            closeBtn.style.display = 'none';
        }
    }
}