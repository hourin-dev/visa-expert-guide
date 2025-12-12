// e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (최종 안정화 버전)

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
    const career = parseInt(document.getElementById('e74_career').value) || 0;
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
    const closeArea = document.getElementById('e74CloseButtonArea'); // 닫기 버튼 영역

    // 2. 점수 및 필수 요건 설정 (로직은 이전 답변과 동일)
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

    // --- I, II, III. 점수 계산 로직 (중략) ---
    // (이전 답변의 E-7-4 점수 계산 로직을 그대로 사용합니다.)
    
    // 소득 점수
    const incomeTiers = [
        { min: GNI_2025_ESTIMATE * 1.5, score: 80 }, { min: GNI_2025_ESTIMATE * 0.5, score: 10 }
    ];
    incomeScore = getScoreRange(income, incomeTiers);
    // 나이 점수 (간략화)
    const ageTiers = [{ min: 35, score: 20 }, { min: 25, score: 10 }];
    ageScore = getScoreRange(age, ageTiers);
    // 경력, 가점, 감점
    careerScore = Math.min(50, Math.floor(career / 12) * 10);
    bonusScore = (techCheck ? 10 : 0) + (degreeCheck ? 10 : 0) + (assetCheck ? 5 : 0) + (localCheck ? 10 : 0) + (kiipCompCheck ? 10 : 0) + (serviceCheck ? 5 : 0);
    penaltyScore = (violationCount >= 3) ? -50 : (violationCount === 2) ? -10 : (violationCount === 1) ? -5 : 0;
    totalScore = incomeScore + koreanScore + ageScore + careerScore + bonusScore + penaltyScore;
    
    // --- IV. 필수 요건 최종 확인 (중략) ---
    if (incomeScore < REQUIRED_INCOME_MIN_POINT || koreanScore < REQUIRED_KOREAN_MIN_POINT || violationCount >= 3) {
        requiredConditionMet = false;
        // requiredMessage 설정 (생략)
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

    // 4. 결과 출력
    resultBox.innerHTML = `
        <h3>✨ E-7-4 최종 진단 결과</h3>
        <p><strong>총 점수:</strong> <span style="font-size: 1.2em; color: ${resultColor};">${totalScore}점</span> (기준 ${REQUIRED_MIN_SCORE}점)</p>
        <p><strong>최종 진단:</strong> <span style="font-weight: bold; color: ${resultColor};">${diagnosisStatus}</span></p>
        <hr>
        <p class="note">※ 본 진단은 참고용이며, 최종 심사는 법무부 지침에 따릅니다.</p>
    `;

    // 5. 서류 안내 및 닫기 버튼 제어 (핵심 안정화 로직)
    if (isPass) {
        // 🚨 서류 목록 삽입 및 보이게 설정
        docBox.innerHTML = generateDocumentList();
        docBox.style.display = 'block';
        
        // 🚨 닫기 버튼 영역 보이게 설정
        closeArea.style.display = 'block';
    } else {
        // 부적격 시 서류 안내 및 닫기 버튼 숨김
        docBox.innerHTML = '';
        docBox.style.display = 'none';
        closeArea.style.display = 'none';
    }
}