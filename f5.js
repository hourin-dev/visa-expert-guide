// F-5 영주권 진단 프로그램 (실시간 요건 안내 기능 추가)
function openF5Program() {
    const contentArea = document.getElementById('f5ProgramContent');
    loadF5UI(contentArea);
    openModal('f5Modal');
    // 초기 실행 시 기본 선택된 자격의 안내문 표시
    updateVisaGuidance();
}

function loadF5UI(container) {
    container.innerHTML = `
        <div style="background: #eef2f7; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9em; border-left: 5px solid #007bff;">
            <strong>📘 실시간 요건 안내:</strong> 체류자격을 선택하면 해당 자격의 법적 근거와 상세 요건이 하단에 표시됩니다.
        </div>

        <div class="input-group">
            <label>1. 현재 체류 자격 (Current Visa)</label>
            <select id="f5_current_visa_type" onchange="updateVisaGuidance()">
                <option value="F-2-7">F-2-7 (점수제 우수인재)</option>
                <option value="F-2-99">F-2-99 (기타 장기체류)</option>
                <option value="E-7">E-1 ~ E-7 (전문직종)</option>
                <option value="E-7-4">E-7-4 (숙련기능인력)</option>
                <option value="F-4">F-4 (재외동포)</option>
                <option value="F-6">F-6 (결혼이민)</option>
                <option value="H-2">H-2 (방문취업 - 제조업 등 장기근속)</option>
                <option value="D-8">D-8 (기업투자)</option>
            </select>
        </div>

        <div id="visa_guidance_box" style="background: #fffbe6; padding: 15px; border: 1px solid #ffe58f; border-radius: 5px; margin-bottom: 20px; font-size: 0.85em; color: #856404;">
            선택하신 자격의 상세 요건을 불러오는 중...
        </div>

        <div class="input-group">
            <label>2. 해당 비자로 국내 체류한 기간 (년)</label>
            <input type="number" id="f5_stay_years" placeholder="숫자만 입력 (예: 5)">
        </div>

        <div class="input-group">
            <label>3. 전년도 연간 소득 (원)</label>
            <input type="number" id="f5_income" placeholder="소득금액증명원상 합계 금액">
        </div>

        <div class="input-group">
            <label>4. 사회통합프로그램 (KIIP)</label>
            <select id="f5_kiip_check">
                <option value="no">미이수 / 이수 중</option>
                <option value="yes">5단계 이수 및 종합평가 합격 (필수)</option>
            </select>
        </div>

        <button onclick="calculateF5WithManual()" style="width:100%; padding:15px; background:#007bff; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">
            🔍 최종 요건 진단하기
        </button>

        <div id="f5_result_section" style="margin-top:20px; display:none;">
            <div id="f5_alert_box" style="padding:15px; border-radius:5px; font-weight:bold; margin-bottom:10px;"></div>
            <div id="f5_criteria_info" style="background:#f8f9fa; padding:15px; border:1px solid #dee2e6; font-size:0.9em; line-height:1.6; color:#444;"></div>
        </div>
    `;
}

// 체류자격 선택 시 호출되는 안내문 업데이트 함수
function updateVisaGuidance() {
    const visa = document.getElementById('f5_current_visa_type').value;
    const guidanceBox = document.getElementById('visa_guidance_box');
    let text = "";

    switch(visa) {
        case 'F-2-7':
            text = "<strong>[F-5-16]</strong> 거주(F-2) 자격으로 3년 이상 체류. 신청일 기준 전년도 소득이 GNI 1배 이상이어야 합니다.";
            break;
        case 'H-2':
            text = "<strong>[F-5-14]</strong> 제조업·농축어업 등에서 동일 업체 4년 이상 근속. 소득은 GNI 1배 이상, 자산 요건(필수) 확인이 필요합니다.";
            break;
        case 'E-7-4':
            text = "<strong>[F-5-1]</strong> 숙련기능인력으로 5년 이상 체류. 소득 GNI 1배 및 사회통합프로그램 5단계 이수가 필수입니다.";
            break;
        case 'F-4':
            text = "<strong>[F-5-6]</strong> F-4 자격으로 2년 이상 체류. 본인 또는 동반가족 합산 소득이 GNI 1배 이상이어야 합니다.";
            break;
        case 'F-6':
            text = "<strong>[F-5-2]</strong> 배우자와 혼인 유지하며 2년 이상 체류. 한국인 배우자의 소득 합산이 가능합니다.";
            break;
        case 'F-2-99':
            text = "<strong>[F-5-1]</strong> 5년 이상 장기체류. 신청 당시 자격에 따라 GNI 1배 또는 2배의 소득 기준이 적용됩니다.";
            break;
        default:
            text = "<strong>[일반 요건]</strong> 통상 5년 이상 체류 및 소득·학력·자산 요건 중 하나를 충족해야 합니다.";
    }
    guidanceBox.innerHTML = "💡 " + text;
}

function calculateF5WithManual() {
    // (이전 답변의 계산 로직과 동일하므로 생략 - 이전 소스를 그대로 유지하시면 됩니다)
    const visa = document.getElementById('f5_current_visa_type').value;
    const years = parseInt(document.getElementById('f5_stay_years').value) || 0;
    const income = parseInt(document.getElementById('f5_income').value) || 0;
    const kiip = document.getElementById('f5_kiip_check').value;
    
    const resultSec = document.getElementById('f5_result_section');
    const alertBox = document.getElementById('f5_alert_box');
    
    const GNI_1X = 44000000; 
    let requiredYears = 5; 
    let failList = [];

    if (visa === 'F-2-7') requiredYears = 3;
    else if (visa === 'H-2') requiredYears = 4;
    else if (visa === 'F-4' || visa === 'F-6') requiredYears = 2;

    if (years < requiredYears) failList.push(`체류 기간 부족 (최소 ${requiredYears}년)`);
    if (income < GNI_1X) failList.push(`소득 미달 (GNI 1배 기준)`);
    if (kiip === 'no') failList.push("KIIP 5단계 미이수");

    resultSec.style.display = "block";
    if (failList.length === 0) {
        alertBox.style.backgroundColor = "#d1e7dd";
        alertBox.style.color = "#0f5132";
        alertBox.innerHTML = "✅ 요건 충족: 영주권 신청이 가능합니다.";
    } else {
        alertBox.style.backgroundColor = "#f8d7da";
        alertBox.style.color = "#842029";
        alertBox.innerHTML = "❌ 요건 미충족: " + failList.join(", ");
    }
}