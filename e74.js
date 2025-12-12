// e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (배점표 상세 출력 포함)

const GNI_2025_ESTIMATE = 42200000;
const GNI_MANWON = (GNI_2025_ESTIMATE / 10000).toFixed(0);

function getScoreRange(value, tiers) {
    for (const tier of tiers) {
        if (value >= tier.min) {
            return tier.score;
        }
    }
    return 0;
}

// -------------------------------------------------------------
// *새로운 기능* - 배점표 생성 함수 (획득 점수 강조)
// -------------------------------------------------------------
function generateBaseScoreTable(inputs, scores) {
    const { income, age, koreanScore, career } = inputs;
    const { incomeScore, ageScore, careerScore } = scores;
    
    // 1. 소득 배점표 데이터
    const incomeTiers = [
        { min: GNI_2025_ESTIMATE * 1.5, score: 80, label: `GNI의 1.5배 이상 (${(GNI_2025_ESTIMATE * 1.5 / 10000).toFixed(0)}만원 이상)` },
        { min: GNI_2025_ESTIMATE * 1.2, score: 70, label: `GNI의 1.2배 이상` },
        { min: GNI_2025_ESTIMATE * 1.0, score: 60, label: `GNI의 1.0배 이상 (${GNI_MANWON}만원 이상)` },
        { min: GNI_2025_ESTIMATE * 0.8, score: 40, label: `GNI의 0.8배 이상` },
        { min: GNI_2025_ESTIMATE * 0.6, score: 20, label: `GNI의 0.6배 이상` },
        { min: GNI_2025_ESTIMATE * 0.5, score: 10, label: `GNI의 0.5배 이상 (최소 요건)` }
    ];

    // 2. 나이 배점표 데이터
    const ageTiers = [
        { min: 35, score: 20, label: "만 35세 이상" },
        { min: 30, score: 15, label: "만 30세 이상" },
        { min: 25, score: 10, label: "만 25세 이상" },
        { min: 20, score: 5, label: "만 20세 이상" }
    ];

    // 3. 한국어 배점표 데이터
    const koreanTiers = [
        { score: 50, label: "KIIP 5단계 / TOPIK 5급 이상" },
        { score: 40, label: "KIIP 4단계 / TOPIK 4급" },
        { score: 30, label: "KIIP 3단계 / TOPIK 3급" },
        { score: 20, label: "KIIP 2단계 / TOPIK 2급 (최소 요건)" },
        { score: 0, label: "미해당 또는 미입력" }
    ];

    // 4. 테이블 생성 시작
    let html = `
        <style>
            .score-table { width: 100%; border-collapse: collapse; font-size: 0.9em; margin-bottom: 15px; }
            .score-table th, .score-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .score-table th { background-color: #f2f2f2; }
            .highlight-row { background-color: #fffacd !important; font-weight: bold; } /* 노란색 계열 강조 */
            .score-acquired { color: green; font-weight: bold; }
        </style>
        
        <h4>📊 기본 항목 배점표 (총점 비교)</h4>
        <p style="margin-bottom: 10px;">획득한 점수와 해당 기준을 노란색으로 표시합니다. (GNI 기준 약 ${GNI_MANWON}만원)</p>

        <h5>① 연간 소득 (최대 80점)</h5>
        <table class="score-table">
            <tr><th>점수</th><th>배점 기준 (GNI 대비)</th><th>획득 여부</th></tr>
            ${incomeTiers.map(tier => {
                const isAcquired = (incomeScore === tier.score) && (income >= tier.min || incomeScore === 0);
                return `
                    <tr class="${isAcquired ? 'highlight-row' : ''}">
                        <td>${tier.score}점</td>
                        <td>${tier.label}</td>
                        <td>${isAcquired && incomeScore > 0 ? `획득 (${incomeScore}점)` : '-'}</td>
                    </tr>
                `;
            }).join('')}
        </table>

        <h5>③ 만 나이 (최대 20점)</h5>
        <table class="score-table">
            <tr><th>점수</th><th>배점 기준</th><th>획득 여부</th></tr>
            ${ageTiers.map(tier => {
                const isAcquired = (ageScore === tier.score) && (age >= tier.min || ageScore === 0);
                return `
                    <tr class="${isAcquired ? 'highlight-row' : ''}">
                        <td>${tier.score}점</td>
                        <td>${tier.label}</td>
                        <td>${isAcquired && ageScore > 0 ? `획득 (${ageScore}점)` : '-'}</td>
                    </tr>
                `;
            }).join('')}
        </table>

        <h5>② 한국어 및 ④ 국내 경력</h5>
        <table class="score-table">
            <tr><th>항목</th><th>획득 점수</th><th>배점 기준</th></tr>
            <tr class="${koreanScore > 0 ? 'highlight-row' : ''}">
                <td>한국어 능력</td>
                <td>${koreanScore}점</td>
                <td>${koreanTiers.find(t => t.score === koreanScore)?.label || '오류/미해당'}</td>
            </tr>
            <tr class="${careerScore > 0 ? 'highlight-row' : ''}">
                <td>국내 경력</td>
                <td>${careerScore}점</td>
                <td>1년당 10점, 최대 50점 (5년)</td>
            </tr>
        </table>
    `;
    return html;
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
    document.getElementById('e74ScoreTableArea').innerHTML = ''; // 배점표 영역 초기화
    
    alert('모든 입력 내용이 초기화되었습니다.');
}
// -------------------------------------------------------------


function calculateE74() {
    // 🚨 계산 시작 시 기존 결과 영역 및 배점표 영역을 숨깁니다.
    document.getElementById('e74Result').innerHTML = '';
    document.getElementById('e74DocumentGuidance').style.display = 'none';
    document.getElementById('e74CloseButtonArea').style.display = 'none';
    document.getElementById('e74ScoreTableArea').style.display = 'none'; // 배점표 숨김

    // 1. 입력 값 가져오기
    const income = parseInt(document.getElementById('e74_income').value) || 0;
    const koreanScore = parseInt(document.getElementById('e74_korean').value) || 0;
    const age = parseInt(document.getElementById('e74_age').value) || 0;
    const career = parseInt(document.getElementById('e74_career').value) || 0; // 개월 수
    const violationCount = parseInt(document.getElementById('e74_violation_count').value) || 0;

    // 가점 항목 체크박스 (중략)
    const techCheck = document.getElementById('e74_tech').checked;
    const degreeCheck = document.getElementById('e74_degree').checked;
    const kiipCompCheck = document.getElementById('e74_kiipcomp').checked;
    const assetCheck = document.getElementById('e74_asset').checked;
    const localCheck = document.getElementById('e74_local').checked;
    const serviceCheck = document.getElementById('e74_service').checked;

    const resultBox = document.getElementById('e74Result');
    const docBox = document.getElementById('e74DocumentGuidance'); 
    const closeArea = document.getElementById('e74CloseButtonArea'); 
    const scoreTableArea = document.getElementById('e74ScoreTableArea'); 

    // 2. 점수 및 필수 요건 설정
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
    const incomeTiers = [
        { min: GNI_2025_ESTIMATE * 1.5, score: 80 }, { min: GNI_2025_ESTIMATE * 1.2, score: 70 },
        { min: GNI_2025_ESTIMATE * 1.0, score: 60 }, { min: GNI_2025_ESTIMATE * 0.8, score: 40 },
        { min: GNI_2025_ESTIMATE * 0.6, score: 20 }, { min: GNI_2025_ESTIMATE * 0.5, score: 10 }
    ];
    incomeScore = getScoreRange(income, incomeTiers);
    const ageTiers = [{ min: 35, score: 20 }, { min: 30, score: 15 }, { min: 25, score: 10 }, { min: 20, score: 5 }];
    ageScore = getScoreRange(age, ageTiers);
    careerScore = Math.min(50, Math.floor(career / 12) * 10);
    // 기본 점수 합산 전에 임시 총점 계산 (필요 없음, 아래에서 최종 계산)

    // --- II. 가점 및 III. 감점 계산 ---
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
        isPass = true;
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
        <p class="note">※ 본 진단은 참고용입니다.</p>
    `;

    // 5. 배점표 생성 및 출력
    const inputs = { income, age, koreanScore, career };
    const scores = { incomeScore, ageScore, careerScore };
    scoreTableArea.innerHTML = generateBaseScoreTable(inputs, scores);
    scoreTableArea.style.display = 'block'; // 배점표 영역 활성화
    
    // 6. 서류 안내 및 닫기 버튼 제어
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