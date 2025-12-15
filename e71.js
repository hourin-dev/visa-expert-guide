// e71.js: E-7-1 특정활동 비자 적격성 진단 및 통합 로직

// --- 1. 전역 데이터 및 기준 정의 ---
const MIN_ANNUAL_SALARY_E71 = 33760000; // GNI 80% 기준 가정 (3,376만원)

const E71_JOB_CRITERIA = {
    // 직종 코드: [이름, 쿼터 타입, 최소 학력 점수, 최소 경력 년]
    "2731": { name: "해외 영업원", quota_type: "일반", min_edu_level: 3, min_experience_years: 1, },
    "1311": { name: "공학 전문가", quota_type: "전문가", min_edu_level: 4, min_experience_years: 0, },
    "4112": { name: "의료 코디네이터", quota_type: "일반", min_edu_level: 2, min_experience_years: 5, },
    "EDU_LEVEL_MAP": { "전문학사": 2, "학사": 3, "석사": 4, "박사": 5 }
};

const QUOTA_PERCENT = { "일반": 0.20, "전문가": 0.30, "특례": 1.0, };

const E71_FAQ_DATA = {
    "이직 절차": {
        question: "E-7-1 비자로 이직할 때 필요한 절차와 주의사항은 무엇인가요?",
        answer: "E-7-1 비자는 원칙적으로 근무처 변경 시 반드시 **사전 허가**를 받아야 합니다. 새 회사와 근로계약을 체결하고, 기존 회사 퇴사일로부터 15일 이내에 출입국관리소에 신고(허가 신청)해야 합니다. (출입국관리법 시행규칙 제28조)",
    },
    "최저 연봉": {
        question: "E-7-1 비자의 최저 연봉 기준은 어떻게 되나요?",
        answer: `E-7-1 비자 초청 시 제시 연봉은 전년도 **국민 1인당 GNI의 80% 이상**이어야 합니다. (현 기준 약 ${MIN_ANNUAL_SALARY_E71.toLocaleString()}원).`,
    },
};

function getJobCriteria(jobCode) {
    return E71_JOB_CRITERIA[jobCode] || null;
}

// --- 2. UI 생성 함수 ---

/**
 * 프로그램의 기본 UI (입력 폼)를 생성하여 지정된 컨테이너에 로드합니다.
 * @param {HTMLElement} container - UI를 삽입할 DOM 요소 (일반적으로 #app-content)
 */
function loadE71Program(container) {
    container.innerHTML = `
        <h2>E-7-1 특정활동 비자 적격성 진단</h2>
        <p>기업의 고용 요건과 외국인 근로자의 전문성을 바탕으로 비자 신청 적격 여부를 진단합니다.</p>
        
        <form id="e71Form">
            <h3>1. 고용 기업 정보</h3>
            <div class="input-group"><label for="e71_job_code">E-7-1 직종 코드 (*필수):</label><input type="text" id="e71_job_code" placeholder="예: 2731, 1311" value="2731"></div>
            <div class="input-group"><label for="e71_income">제시 연봉 (세전, 원) (*필수):</label><input type="number" id="e71_income" min="0" placeholder="예: 40000000" value="40000000"></div>
            <div class="input-group"><label for="e71_korean_count">상시 내국인 근로자 수 (명) (*필수):</label><input type="number" id="e71_korean_count" min="0" value="10"></div>
            <div class="input-group"><label for="e71_current_e7_count">현재 고용 중인 E-7/E-7-4 인원 수 (명):</label><input type="number" id="e71_current_e7_count" min="0" value="0"></div>
            <div class="input-group">
                <label for="e71_company_type">기업 특성 (쿼터 적용):</label>
                <select id="e71_company_type"><option value="일반">일반 기업 (20%)</option><option value="전문가">전문/첨단 분야 (30%)</option><option value="특례">벤처기업, 특례기관 (면제)</option></select>
            </div>
            <div class="input-group">
                <label for="e71_purpose">신청 목적 (*필수):</label>
                <select id="e71_purpose"><option value="신규 발급">신규 발급</option><option value="체류 자격 변경">체류 자격 변경</option><option value="연장">체류 기간 연장</option></select>
            </div>

            <h3>2. 외국인 근로자 정보</h3>
            <div class="input-group">
                <label for="e71_edu_level">최종 학력 (*필수):</label>
                <select id="e71_edu_level"><option value="">--선택--</option><option value="전문학사">전문학사</option><option value="학사" selected>학사</option><option value="석사">석사</option><option value="박사">박사</option></select>
            </div>
            <div class="input-group"><label for="e71_career_years">관련 분야 경력 (년) (*필수):</label><input type="number" id="e71_career_years" min="0" value="2"></div>
            <div class="input-group"><input type="checkbox" id="e71_crime"><label for="e71_crime" style="display: inline; font-weight: normal; color: red;">중대한 범죄 기록 또는 위반 기록이 있습니다.</label></div>

            <div class="btn-group">
                <button type="button" class="diagnose" onclick="diagnoseE71()">🚀 E-7-1 적격성 진단 실행</button>
                <button type="button" class="reset" onclick="resetE71Form()">🔄 입력 내용 초기화</button>
            </div>
        </form>

        <div id="e71FaqArea"></div>
        
        <div id="e71Result" style="margin-top: 20px; padding: 15px; border: 1px solid #ccc;">진단 결과를 확인하려면 위의 '진단 실행' 버튼을 눌러주세요.</div>
        <div id="e71CriteriaTableArea"></div>
        <div id="e71DocumentGuidance"></div>
        <div id="e71CloseButtonArea" style="display: none; text-align: center; margin-top: 20px;"><button type="button" class="reset" onclick="resetE71Form()">결과 확인 완료 및 초기화</button></div>
    `;
    
    // UI 로드 후 FAQ 섹션 활성화
    displayFaqSection(); 
}

// --- 3. 서류 안내 함수 ---
function generateDocumentListE71(jobName, purpose) {
    let listTitle = `E-7-1 (${jobName}) 비자 ${purpose} 필수 서류`;
    let commonDocs = [
        "1. 고용 사유서 (초청 필요성 상세 기재)",
        "2. 표준 근로 계약서 (연봉 및 기간 명시)",
        "3. 사업자 등록증 및 납세 증명원 (기업 재정 확인용)",
        "4. 학위 및 경력 증명 서류 (아포스티유/영사 확인 필수)",
        "5. 여권, 외국인 등록증 (국내 신청 시)",
    ];
    if (purpose === '체류 자격 변경') { commonDocs.push("6. 기존 체류 자격 활동 내역 입증 서류"); } 
    else if (purpose === '연장') { commonDocs.push("6. 고용 유지 및 활동 실적 입증 서류 (최근 소득세 납부 내역)"); }

    return `
        <div style="background-color: #ecf0f1; padding: 20px; border-left: 5px solid #2ecc71; margin-top: 20px;">
            <h3>✅ ${listTitle}</h3>
            <p style="font-style: italic;">* 서류는 **기업 제출**과 **외국인 제출**로 구분됩니다. 유효 기간(3개월)을 확인하세요.</p>
            <ul class="doc-list">${commonDocs.map(item => `<li>${item}</li>`).join('')}</ul>
            <p style="margin-top: 10px; color: #d9534f;">⚠️ **주의:** 관할 출입국/직종별로 추가 서류가 요구될 수 있습니다.</p>
        </div>
    `;
}

// --- 4. 기준표 안내 함수 ---
function generateCriteriaTableE71(jobName, jobCriteria) {
    const minSalaryManwon = (MIN_ANNUAL_SALARY_E71 / 10000).toFixed(0);
    const requiredExp = jobCriteria.min_experience_years;
    const requiredEdu = Object.keys(E71_JOB_CRITERIA.EDU_LEVEL_MAP).find(key => E71_JOB_CRITERIA.EDU_LEVEL_MAP[key] === jobCriteria.min_edu_level);
    
    return `
        <div style="margin-top: 20px;">
            <h4>⭐ E-7-1 핵심 적격성 기준표 (${jobName})</h4>
            <table style="width:100%; border-collapse: collapse;">
                <tr><th style="background-color:#d9edf7;">항목</th><th style="background-color:#d9edf7;">기준</th><th>세부 내용</th></tr>
                <tr><td>최저 연봉</td><td>GNI의 80% 이상</td><td>최소 약 ${minSalaryManwon}만원 이상</td></tr>
                <tr><td>고용 쿼터</td><td>내국인 대비 ${QUOTE_PERCENT[jobCriteria.quota_type] * 100}% 이내</td><td>특례 기업 제외</td></tr>
                <tr><td>학력/경력</td><td>${requiredEdu} + ${requiredExp}년 경력</td><td>일반 직종은 학사 + 1년 경력이 기본입니다.</td></tr>
            </table>
        </div>
    `;
}

// --- 5. Q&A (FAQ) 관련 함수 ---
function generateE71Faq(questionKey) {
    const faq = E71_FAQ_DATA[questionKey];
    if (!faq) return '';

    return `
        <div style="border: 1px solid #3498db; padding: 15px; border-radius: 5px; margin-top: 15px; background-color: #f8faff;">
            <p style="font-weight: bold; color: #2980b9;">Q: ${faq.question}</p>
            <p style="margin-left: 10px;">A: ${faq.answer}</p>
        </div>
    `;
}

function displayFaqSection() {
    const faqArea = document.getElementById('e71FaqArea');
    if (!faqArea) return;
    
    let html = '<h3>3. 💡 특정 상황 법령 및 규정 (FAQ)</h3>';
    html += '<p>자주 묻는 질문을 선택하여 관련 규정을 확인하세요.</p>';
    html += '<select id="faqSelector" onchange="showSelectedFaq(this.value)" style="padding: 8px; width: 100%;">';
    html += '<option value="">-- 질문을 선택해 주세요 --</option>';
    
    for (const key in E71_FAQ_DATA) {
        // FAQ 데이터의 key를 select option의 value로 사용
        html += `<option value="${key}">${E71_FAQ_DATA[key].question}</option>`;
    }
    
    html += '</select>';
    html += '<div id="selectedFaqContent"></div>';
    
    faqArea.innerHTML = html;
}

function showSelectedFaq(questionKey) {
    const contentArea = document.getElementById('selectedFaqContent');
    contentArea.innerHTML = generateE71Faq(questionKey);
}


// --- 6. 진단 실행 함수 (핵심 로직) ---
function diagnoseE71() {
    // 🚨 결과 영역 초기화
    document.getElementById('e71Result').innerHTML = '';
    document.getElementById('e71DocumentGuidance').innerHTML = '';
    document.getElementById('e71DocumentGuidance').style.display = 'none';
    document.getElementById('e71CloseButtonArea').style.display = 'none';
    document.getElementById('e71CriteriaTableArea').innerHTML = ''; 
    document.getElementById('e71CriteriaTableArea').style.display = 'none';

    // 1. 입력 요소 가져오기
    const jobCode = document.getElementById('e71_job_code')?.value;
    const income = parseInt(document.getElementById('e71_income')?.value) || 0;
    const koreanCount = parseInt(document.getElementById('e71_korean_count')?.value) || 0;
    const currentE7Count = parseInt(document.getElementById('e71_current_e7_count')?.value) || 0;
    const eduLevelText = document.getElementById('e71_edu_level')?.value;
    const careerYears = parseInt(document.getElementById('e71_career_years')?.value) || 0;
    const crimeRecordCheck = document.getElementById('e71_crime')?.checked || false;
    const companyType = document.getElementById('e71_company_type')?.value || "일반";
    const purpose = document.getElementById('e71_purpose')?.value || "신규 발급";

    const resultBox = document.getElementById('e71Result');
    const docBox = document.getElementById('e71DocumentGuidance'); 
    const closeArea = document.getElementById('e71CloseButtonArea'); 
    const criteriaTableArea = document.getElementById('e71CriteriaTableArea'); 

    // 필수 입력 값 검사
    if (!jobCode || !income || !eduLevelText || !document.getElementById('e71_income').value) {
        resultBox.innerHTML = '<p style="color:red; font-weight:bold;">⚠️ 모든 필수 항목(*)을 입력해 주세요!</p>';
        return;
    }

    const jobCriteria = getJobCriteria(jobCode);
    if (!jobCriteria) {
        resultBox.innerHTML = '<p style="color:red; font-weight:bold;">❌ 오류: 해당 직종 코드가 E-7-1 데이터베이스에 없습니다. 코드를 확인해 주세요.</p>';
        return;
    }

    // 2. 진단 실행
    let requiredConditionMet = true;
    let failReasons = [];
    let isPass = false;
    const jobName = jobCriteria.name;
    const eduScore = E71_JOB_CRITERIA.EDU_LEVEL_MAP[eduLevelText] || 0;

    // --- 기업 요건 ---
    if (income < MIN_ANNUAL_SALARY_E71) {
        requiredConditionMet = false;
        failReasons.push(`기업 연봉 (${income.toLocaleString()}원)이 최소 기준 (${MIN_ANNUAL_SALARY_E71.toLocaleString()}원)에 미달합니다.`);
    }
    const quotaPercent = QUOTA_PERCENT[companyType] || QUOTA_PERCENT["일반"];
    const maxForeigners = Math.floor(koreanCount * quotaPercent);
    if (companyType !== "특례" && (currentE7Count + 1) > maxForeigners) {
        requiredConditionMet = false;
        failReasons.push(`외국인 고용 쿼터 초과. (내국인 ${koreanCount}명, 최대 허용 ${maxForeigners}명)`);
    }

    // --- 외국인 요건 ---
    const minEduScore = jobCriteria.min_edu_level; 
    let educationConditionMet = false;
    if (eduScore >= minEduScore) { educationConditionMet = true; } 
    else if (eduScore === 3 && careerYears >= 1) { educationConditionMet = true; } // 학사 + 1년
    else if (eduScore === 2 && careerYears >= 5) { educationConditionMet = true; } // 전문학사 + 5년
    
    if (!educationConditionMet) {
        requiredConditionMet = false;
        failReasons.push(`외국인 자격 요건 미달. (최소 학력/경력 기준 불충족)`);
    }
    if (crimeRecordCheck) {
        requiredConditionMet = false;
        failReasons.push("중대한 범죄 기록 또는 위반 기록으로 불허 사유에 해당합니다.");
    }
    
    // 3. 최종 진단
    let diagnosisStatus = requiredConditionMet ? `✅ 적격 (PASS)` : `⛔ 불허/부적격`;
    let resultColor = requiredConditionMet ? 'green' : 'red';
    isPass = requiredConditionMet;

    // 4. 결과 출력
    resultBox.innerHTML = `
        <h3>✨ E-7-1 (${jobName}) 최종 진단 결과</h3>
        <p><strong>최종 진단:</strong> <span style="font-size: 1.5em; font-weight: 900; color: ${resultColor};">${diagnosisStatus}</span></p>
        <hr>
        ${failReasons.length > 0 ? 
            `<h4>❌ 미충족 사유 (${failReasons.length}건)</h4>
            <ul style="color:red; list-style-type: square; padding-left: 20px;">
                ${failReasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>` : 
            `<p style="color:green; font-weight:bold;">모든 핵심 요건을 충족했습니다. 다음 단계를 진행하세요.</p>`
        }
    `;

    // 5. 기준표 및 서류 안내
    criteriaTableArea.innerHTML = generateCriteriaTableE71(jobName, jobCriteria);
    criteriaTableArea.style.display = 'block'; 
    
    if (isPass) {
        docBox.innerHTML = generateDocumentListE71(jobName, purpose);
        docBox.style.display = 'block';
        closeArea.style.display = 'block'; 
    }
}