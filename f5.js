// F-5 영주권 진단 프로그램 (2025 최신 매뉴얼 및 H-2/E-7-4 경로 반영)
function openF5Program() {
    const contentArea = document.getElementById('f5ProgramContent');
    loadF5UI(contentArea);
    openModal('f5Modal');
}

function loadF5UI(container) {
    container.innerHTML = `
        <div style="background: #eef2f7; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9em; border-left: 5px solid #007bff;">
            <strong>📘 2025 출입국 매뉴얼 적용:</strong> H-2(방문취업) 및 E-7-4(숙련기능) 자격자의 영주권 전환 요건이 추가되었습니다.
        </div>

        <div class="input-group">
            <label>1. 현재 체류 자격 (Current Visa)</label>
            <select id="f5_current_visa_type">
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
            🔍 매뉴얼 기준 상세 요건 진단
        </button>

        <div id="f5_result_section" style="margin-top:20px; display:none;">
            <div id="f5_alert_box" style="padding:15px; border-radius:5px; font-weight:bold; margin-bottom:10px;"></div>
            <div id="f5_criteria_info" style="background:#f8f9fa; padding:15px; border:1px solid #dee2e6; font-size:0.9em; line-height:1.6; color:#444;"></div>
        </div>
    `;
}

function calculateF5WithManual() {
    const visa = document.getElementById('f5_current_visa_type').value;
    const years = parseInt(document.getElementById('f5_stay_years').value) || 0;
    const income = parseInt(document.getElementById('f5_income').value) || 0;
    const kiip = document.getElementById('f5_kiip_check').value;
    
    const resultSec = document.getElementById('f5_result_section');
    const alertBox = document.getElementById('f5_alert_box');
    const infoBox = document.getElementById('f5_criteria_info');
    
    // 2025년 적용 GNI (한국은행 발표 기준 근사치)
    const GNI_1X = 44000000; 
    let requiredYears = 5; 
    let requiredIncome = GNI_1X; // 기본 1배
    let criteriaText = "";
    let failList = [];

    // 매뉴얼 근거 자격별 상세 로직
    switch(visa) {
        case 'F-2-7':
            requiredYears = 3;
            requiredIncome = GNI_1X;
            criteriaText = "<strong>[F-5-16 점수제 영주]</strong> 점수제 거주(F-2-7) 자격으로 3년 이상 체류해야 합니다. 소득은 GNI 1배 이상이어야 합니다.";
            break;
        case 'H-2':
            requiredYears = 4; // 제조업 등 특정분야 장기근속 영주(F-5-14) 기준
            requiredIncome = GNI_1X;
            criteriaText = "<strong>[F-5-14 방문취업 장기근속]</strong> 제조업, 농축어업 등에서 동일 업체 4년 이상 근속 시 신청 가능합니다.";
            break;
        case 'E-7-4':
            requiredYears = 5;
            requiredIncome = GNI_1X;
            criteriaText = "<strong>[F-5-1 일반영주]</strong> 숙련기능인력은 5년 이상 체류 및 소득 요건을 충족해야 합니다.";
            break;
        case 'F-4':
            requiredYears = 2;
            requiredIncome = GNI_1X;
            criteriaText = "<strong>[F-5-6 재외동포 영주]</strong> F-4 자격으로 2년 이상 체류 및 GNI 1배 이상의 소득이 필요합니다.";
            break;
        case 'F-6':
            requiredYears = 2;
            requiredIncome = GNI_1X; // 완화된 기준 적용 가능하나 일반적 1배
            criteriaText = "<strong>[F-5-2 결혼이민 영주]</strong> 배우자와 혼인 관계 유지하며 2년 이상 체류 시 신청 가능합니다.";
            break;
        default:
            requiredYears = 5;
            requiredIncome = GNI_1X * 2; // 일반 전문직 등은 GNI 2배 요구 케이스 존재
            criteriaText = "<strong>[F-5-1 일반 영주]</strong> 통상 5년 이상 체류 및 GNI 2배 소득을 원칙으로 합니다. (자격별 상이)";
    }

    // 검증 로직
    if (years < requiredYears) failList.push(`체류 기간 부족 (최소 ${requiredYears}년 필요)`);
    if (income < requiredIncome) failList.push(`소득 미달 (약 ${requiredIncome.toLocaleString()}원 이상 필요)`);
    if (kiip === 'no') failList.push("사회통합프로그램 5단계 합격증 필수");

    resultSec.style.display = "block";
    infoBox.innerHTML = criteriaText + "<br><br>⚠️ <strong>실무 경고:</strong> 최근 3년 내 벌금 100만 원 이상의 형사 처벌 전력이 있는 경우 '품행 미단정'으로 반려될 수 있습니다.";

    if (failList.length === 0) {
        alertBox.style.backgroundColor = "#d1e7dd";
        alertBox.style.color = "#0f5132";
        alertBox.innerHTML = "✅ 진단 결과: 영주권 신청 가능성이 높습니다!";
    } else {
        alertBox.style.backgroundColor = "#f8d7da";
        alertBox.style.color = "#842029";
        alertBox.innerHTML = "❌ 진단 결과: 요건 미충족<br><span style='font-size:0.8em; font-weight:normal;'>" + failList.join(" / ") + "</span>";
    }
}