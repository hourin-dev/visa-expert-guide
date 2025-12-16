// e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (업데이트 버전)

const GNI_2025_ESTIMATE = 42200000; // 기준 GNI 값 (기존 코드 유지)
const GNI_MANWON = (GNI_2025_ESTIMATE / 10000).toFixed(0);

/**
 * 특정 값에 해당하는 점수 등급을 계산합니다.
 * @param {number} value - 입력 값 (소득, 나이 등)
 * @param {Array<{min: number, score: number}>} tiers - 등급별 최소 기준 및 점수 배열
 * @returns {number} 해당 등급 점수
 */
function getScoreRange(value, tiers) {
    for (const tier of tiers) {
        if (value >= tier.min) {
            return tier.score;
        }
    }
    return 0;
}

/**
 * E-7-4 비자 신청 필수 서류 목록을 생성합니다.
 * @returns {string} HTML 형태의 서류 목록
 */
function generateDocumentList() {
    return `
        <h3>✅ E-7-4 비자 신청 필수 서류 (개정안 반영)</h3>
        <p style="font-style: italic;">* 모든 서류는 발급일로부터 3개월 이내여야 합니다. (변동 가능)</p>
        <ul class="doc-list">
            <li>1. 통합 신청서 (별지 제34호 서식)</li>
            <li>2. 여권 및 외국인 등록증 원본 및 사본</li>
            <li>3. **고용 추천서** (현 근무처 1년 이상, 기업 추천 필수)</li>
            <li>4. **소득 금액 증명원** (국세청 발급, 최근 2년간 연간 평균 소득 확인용)</li>
            <li>5. 한국어능력 입증 서류 (TOPIK 2급 이상 성적표 또는 KIIP 2단계 이상 이수증)</li>
            <li>6. **가점/감점 항목별 입증 서류** (추천서, 자격증, 학위, 운전면허증, 체납 사실 확인 등)</li>
            <li>7. 현 근무처의 사업자등록증 사본, 납세 사실 증명 등</li>
        </ul>
        <p style="margin-top: 10px; color: #d9534f;">⚠️ **주의:** 상기 서류 외, 심사 과정에서 추가 서류가 요구될 수 있으며, 모든 제외 대상 요건을 충족하지 않아야 합니다.</p>
    `;
}

/**
 * 업데이트된 E-7-4 비자 배점 기준표를 생성합니다.
 * @returns {string} HTML 형태의 배점표
 */
function generateScoreTable(GNI_MANWON) {
    // E-7-4 비자 배점 기준표를 사용자 요구사항에 맞춰 업데이트
    return `
        <style>
            .base-score-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.95em; }
            .base-score-table th, .base-score-table td { border: 1px solid #ddd; padding: 6px; text-align: center; }
            .base-score-table th { background-color: #e9ecef; font-weight: bold; }
            .left-align { text-align: left !important; }
        </style>
        
        <h4>⭐ E-7-4 비자 개정 배점 기준표 (참고용 - 300점 만점)</h4>

        <h5>A. 기본 항목 (최대 300점)</h5>
        <table class="base-score-table">
            <tr><th>배점 항목</th><th>상세 기준</th><th>배점</th><th>최대 점수</th></tr>
            <tr>
                <td class="left-align">평균 소득 (최근 2년 연간 평균)</td>
                <td class="left-align">5000만 이상 (120점) / 4500~5000만 (110점) / 4000~4500만 (95점) / 3500~4000만 (80점) / 3000~3500만 (65점) / 2500~3000만 (50점)</td>
                <td>50~120점</td>
                <td>120점</td>
            </tr>
            <tr>
                <td class="left-align">한국어 능력 (TOPIK 또는 KIIP)</td>
                <td class="left-align">4급/4단계 이상 (120점) / 3급/3단계 (80점) / 2급/2단계 (50점)</td>
                <td>50~120점</td>
                <td>120점</td>
            </tr>
            <tr>
                <td class="left-align">나이 (만 나이)</td>
                <td class="left-align">27세~33세 (60점) / 19세~26세 (40점) / 34세~40세 (30점) / 41세 이상 (10점)</td>
                <td>10~60점</td>
                <td>60점</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">총합 (Max)</td>
                <td>300점</td>
            </tr>
        </table>
        
        <h5>B. 가점 및 감점 항목 (최대 110점)</h5>
        <table class="base-score-table">
            <tr><th>구분</th><th>배점 항목</th><th>상세 기준</th><th>배점</th></tr>
            <tr>
                <td rowspan="7">가점 (Max +110점)</td>
                <td class="left-align">추천 (중앙부처/광역 지자체)</td>
                <td class="left-align">각 30점 (중복 불가)</td>
                <td>30점</td>
            </tr>
            <tr>
                <td class="left-align">추천 (고용 기업체)</td>
                <td class="left-align">고용 기업체 추천 시</td>
                <td>50점</td>
            </tr>
            <tr>
                <td class="left-align">현 근무처 3년 이상 근속</td>
                <td class="left-align">현재 근무 중인 기업에서 3년 이상</td>
                <td>20점</td>
            </tr>
            <tr>
                <td class="left-align">인구감소/읍면지역 3년 이상 근무</td>
                <td class="left-align">해당 지역에서 3년 이상 근무 시</td>
                <td>20점</td>
            </tr>
            <tr>
                <td class="left-align">자격증 또는 국내 학위</td>
                <td class="left-align">관련 분야 자격증 또는 국내 학위</td>
                <td>20점</td>
            </tr>
            <tr>
                <td class="left-align">국내 운전면허증</td>
                <td class="left-align">국내에서 취득한 운전면허증</td>
                <td>10점</td>
            </tr>
            <tr>
                <td class="left-align" colspan="2">가점 총합 (최대)</td>
                <td>150점</td>
            </tr>
            <tr>
                <td rowspan="3">감점 (Max -50점)</td>
                <td class="left-align">벌금형 (100만원 미만)</td>
                <td class="left-align">1회 (-5점) / 2회 (-10점) / 3회 (-20점)</td>
                <td>-5~-20점</td>
            </tr>
            <tr>
                <td class="left-align">조세 체납으로 체류허가 제한</td>
                <td class="left-align">1회 (-5점) / 2회 (-10점) / 3회 (-15점)</td>
                <td>-5~-15점</td>
            </tr>
            <tr>
                <td class="left-align">출입국관리법 위반 (3회 이하)</td>
                <td class="left-align">1회 (-5점) / 2회 (-10점) / 3회 (-15점) (과태료 포함)</td>
                <td>-5~-15점</td>
            </tr>
        </table>
        <p style="margin-top: 10px; font-weight: bold; color: #17a2b8;">💡 **필수 요건:** 기본 항목(소득, 한국어) 각각 최소 50점 이상 득점해야 하며, 총점 200점 이상이어야 합니다.</p>
    `;
}

function resetE74Form() {
    // 기존 함수 유지
    document.getElementById('e74Form').reset();
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

    // 1. 입력 요소 가져오기 (기존 로직 유지)
    const incomeElement = document.getElementById('e74_income');
    const ageElement = document.getElementById('e74_age');
    const fineCountElement = document.getElementById('e74_fine_count'); // 벌금형 횟수 추가
    const taxArrearCountElement = document.getElementById('e74_tax_arrear_count'); // 체납 횟수 추가
    const violationElement = document.getElementById('e74_violation_count'); // 출입국관리법 위반 횟수 (3회 이하)

    // 필수 요소 존재 확인 (수정: 벌금, 체납, 위반 횟수 필드도 가정)
    if (!incomeElement || !ageElement || !fineCountElement || !taxArrearCountElement || !violationElement) {
        document.getElementById('e74Result').innerHTML =
            '<p style="color:red; font-weight:bold;">❌ 시스템 오류: HTML 필수 입력 필드(소득/나이/벌금/체납/위반 횟수)를 찾을 수 없습니다.</p>';
        return;
    }

    // 필수 입력 값 검사 (소득, 나이)
    if (!incomeElement.value || !ageElement.value) {
        document.getElementById('e74Result').innerHTML =
            '<p style="color:red; font-weight:bold;">⚠️ 필수 항목 (소득, 나이)을 입력해 주세요!</p>';
        return; // 계산 중단
    }

    // 2. 변수 선언 및 값 파싱 (업데이트)
    let income = parseInt(incomeElement.value) || 0;
    let koreanScore = parseInt(document.getElementById('e74_korean')?.value) || 0; // 한국어 점수 (직접 입력 또는 선택)
    let age = parseInt(ageElement.value) || 0;
    let career = parseInt(document.getElementById('e74_career')?.value) || 0; // 경력 항목은 새 배점표에 없음 (제외, 하지만 안전을 위해 유지)

    // 감점 항목 파싱
    let fineCount = parseInt(fineCountElement.value) || 0; // 벌금 100만 미만 횟수
    let taxArrearCount = parseInt(taxArrearCountElement.value) || 0; // 체납으로 제한받은 횟수
    let violationCount = parseInt(violationElement.value) || 0; // 출입국관리법 위반 횟수 (3회 이하)

    // 가점 항목 체크박스 (안전한 호출) - 기존 항목 대신 새 항목 반영
    const centralGovRec = document.getElementById('e74_rec_central')?.checked || false; // 중앙부처 추천
    const localGovRec = document.getElementById('e74_rec_local')?.checked || false; // 광역 지자체 추천
    const corpRec = document.getElementById('e74_rec_corp')?.checked || false; // 고용 기업체 추천
    const longService = document.getElementById('e74_long_service')?.checked || false; // 현 근무처 3년 이상 근속
    const localAreaWork = document.getElementById('e74_local_area_work')?.checked || false; // 인구감소/읍면지역 3년 이상 근무
    const techDegree = document.getElementById('e74_tech_degree')?.checked || false; // 자격증 또는 국내 학위
    const drivingLicense = document.getElementById('e74_driving_license')?.checked || false; // 국내 운전면허증

    const resultBox = document.getElementById('e74Result');
    const docBox = document.getElementById('e74DocumentGuidance');
    const closeArea = document.getElementById('e74CloseButtonArea');
    const scoreTableArea = document.getElementById('e74ScoreTableArea');

    // 3. 점수 계산
    let incomeScore = 0;
    let koreanScoreCalculated = 0; // 실제 점수표에 따라 계산된 한국어 점수
    let ageScore = 0;
    let bonusScore = 0;
    let penaltyScore = 0;
    let requiredConditionMet = true;
    let requiredMessage = '';

    const REQUIRED_MIN_SCORE = 200;
    const REQUIRED_MIN_POINT = 50; // 소득 및 한국어 필수 최소 점수 50점

    // --- I. 기본 점수 계산 (업데이트된 배점 적용) ---

    // 소득 점수 (최대 120점)
    const incomeTiers = [
        { min: 50000000, score: 120 }, { min: 45000000, score: 110 }, { min: 40000000, score: 95 },
        { min: 35000000, score: 80 }, { min: 30000000, score: 65 }, { min: 25000000, score: 50 }
    ];
    incomeScore = getScoreRange(income, incomeTiers);

    // 한국어 점수 (최대 120점) - 입력값(koreanScore)을 단계 점수로 가정
    const koreanTiers = [
        { min: 4, score: 120 }, { min: 3, score: 80 }, { min: 2, score: 50 }
    ];
    // koreanScore가 '2', '3', '4' 등의 단계를 나타낸다고 가정하고 계산
    koreanScoreCalculated = getScoreRange(koreanScore, koreanTiers);

    // 나이 점수 (최대 60점)
    const ageTiers = [
        { min: 27, max: 33, score: 60 }, { min: 19, max: 26, score: 40 },
        { min: 34, max: 40, score: 30 }, { min: 41, max: 100, score: 10 } // 41세 이상
    ];
    // 나이 계산 로직을 좀 더 세부적으로 구현
    for (const tier of ageTiers) {
        if (age >= tier.min && age <= tier.max) {
            ageScore = tier.score;
            break;
        }
    }

    // 국내 경력 점수 (새 배점표에는 독립 항목이 없으므로 0점으로 설정. 실제 필요 시 로직 추가 필요)
    let careerScore = 0;

    // --- II. 가점 계산 (최대 110점) ---
    // 추천은 중복 불가 (중앙부처 or 광역 지자체 중 최대 30점)
    let recScore = 0;
    if (centralGovRec || localGovRec) {
        recScore = 30;
    }
    
    // 기업체 추천은 별도 가점 (최대 50점)
    let corpRecScore = corpRec ? 50 : 0;
    
    // 기타 가점
    bonusScore = recScore + corpRecScore +
        (longService ? 20 : 0) +
        (localAreaWork ? 20 : 0) +
        (techDegree ? 20 : 0) +
        (drivingLicense ? 10 : 0);

    // --- III. 감점 계산 (업데이트된 기준 적용) ---
    // 벌금형 (100만원 미만)
    if (fineCount >= 3) { penaltyScore -= 20; }
    else if (fineCount === 2) { penaltyScore -= 10; }
    else if (fineCount === 1) { penaltyScore -= 5; }

    // 조세 체납 (완납시 신청 가능/완납 안했으면 제외대상) -> 감점은 완납 후 '제한을 받은 사실'에 대한 점수
    if (taxArrearCount >= 3) { penaltyScore -= 15; }
    else if (taxArrearCount === 2) { penaltyScore -= 10; }
    else if (taxArrearCount === 1) { penaltyScore -= 5; }

    // 출입국관리법 위반 (3회 이하)
    if (violationCount >= 3) { penaltyScore -= 15; }
    else if (violationCount === 2) { penaltyScore -= 10; }
    else if (violationCount === 1) { penaltyScore -= 5; }
    
    // 🚨 총점 계산 (기본 300점 만점 + 가점/감점)
    let totalScore = incomeScore + koreanScoreCalculated + ageScore + careerScore + bonusScore + penaltyScore;

    // --- IV. 필수 요건 최종 확인 (업데이트된 기준 적용) ---
    // 1. 소득/한국어 각각 최소 50점 이상
    if (incomeScore < REQUIRED_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `소득 점수(${incomeScore}점)가 필수 최소 점수(${REQUIRED_MIN_POINT}점)에 미달합니다. (최소 2500만원 이상 필요)`;
    } else if (koreanScoreCalculated < REQUIRED_MIN_POINT) {
        requiredConditionMet = false;
        requiredMessage = `한국어 점수(${koreanScoreCalculated}점)가 필수 최소 점수(${REQUIRED_MIN_POINT}점)에 미달합니다. (최소 TOPIK 2급 또는 KIIP 2단계 필요)`;
    }
    // 2. 제외 대상 확인
    // 벌금 100만원 이상 형을 받은 자 (입력 필드에 없으므로 진단 메시지로만 안내)
    // 출입국관리법 4회 이상 위반자 (입력 필드에 없으므로 진단 메시지로만 안내)
    // 불법체류 경력 3개월 이상인자 (입력 필드에 없으므로 진단 메시지로만 안내)

    // 4. 최종 진단
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
        diagnosisStatus = `⚠️ 부적격 (총점 ${REQUIRED_MIN_SCORE}점 미달)`;
        resultColor = 'orange';
    }

    // 5. 결과 출력 (업데이트된 정보 반영)
    resultBox.innerHTML = `
        <h3>✨ E-7-4 최종 진단 결과</h3>
        <p><strong>총 점수:</strong> <span style="font-size: 1.5em; font-weight: 900; color: ${resultColor};">${totalScore}점</span> (기준 ${REQUIRED_MIN_SCORE}점)</p>
        <p><strong>최종 진단:</strong> <span style="font-weight: bold; color: ${resultColor};">${diagnosisStatus}</span></p>
        <hr>
        <h4>[항목별 상세 배정 점수]</h4>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="font-weight: bold; margin-bottom: 5px;">기본 점수 (Max 300점)</li>
            <li>- ① 평균 소득 (${(income / 10000).toFixed(0)}만원): <strong style="color: ${incomeScore >= REQUIRED_MIN_POINT ? 'blue' : 'red'};">${incomeScore}점</strong> (필수 최소 50점)</li>
            <li>- ② 한국어 능력 (단계 ${koreanScore}): <strong style="color: ${koreanScoreCalculated >= REQUIRED_MIN_POINT ? 'blue' : 'red'};">${koreanScoreCalculated}점</strong> (필수 최소 50점)</li>
            <li>- ③ 나이 (만 ${age}세): <strong style="color: ${ageScore > 0 ? 'blue' : 'gray'};">${ageScore}점</strong></li>
            <li style="font-weight: bold; margin-top: 10px;">가점/감점</li>
            <li>- 가점 합계: <strong style="color: green;">+${bonusScore}점</strong></li>
            <li>- 감점 합계: <strong style="color: red;">${penaltyScore}점</strong></li>
        </ul>
        ${requiredMessage ? `<p style="color:red; font-weight:bold;">필수 요건 미충족 사유: ${requiredMessage}</p>` : ''}
        <p style="margin-top: 10px; color: #d9534f; font-weight: bold;">❌ **제외 대상 추가 검토:** 벌금 100만원 이상, 출입국관리법 4회 이상 위반, 불법체류 3개월 이상 등의 제외 대상 요건을 충족하는지 반드시 확인해야 합니다.</p>
    `;

    // 6. 배점표 기준 출력
    scoreTableArea.innerHTML = generateScoreTable(GNI_MANWON);
    scoreTableArea.style.display = 'block'; // 배점표 영역 활성화

    // 7. 서류 안내 및 닫기 버튼 제어
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