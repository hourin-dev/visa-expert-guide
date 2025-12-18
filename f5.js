// F-5 영주권 진단 프로그램 (2025.12 매뉴얼 체류 자격별 기간 로직 반영)
function openF5Program() {
    const contentArea = document.getElementById('f5ProgramContent');
    loadF5UI(contentArea);
    openModal('f5Modal');
}

function loadF5UI(container) {
    container.innerHTML = `
        <div style="background: #eef2f7; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9em; border-left: 5px solid #007bff;">
            <strong>📘 매뉴얼 기준 업데이트:</strong> 현재 소지한 비자 자격에 따라 요구되는 국내 거주 기간이 자동으로 계산됩니다.
        </div>

        <div class="input-group">
            <label>1. 현재 체류 자격 (Current Visa)</label>
            <select id="f5_current_visa_type">
                <option value="F-2-7">F-2-7 (점수제 우수인재)</option>
                <option value="F-2-99">F-2-99 (기타 장기체류)</option>
                <option value="E-7">E-1 ~ E-7 (전문직종)</option>
                <option value="F-4">F-4 (재외동포)</option>
                <option value="F-6">F-6 (결혼이민)</option>
                <option value="D-8">D-8 (기업투자)</option>
            </select>
        </div>

        <div class="input-group">
            <label>2. 해당 비자로 국내 체류한 기간 (년)</label>
            <input type="number" id="f5_stay_years" placeholder="숫자만 입력 (예: 3)">
        </div>

        <div class="input-group">
            <label>3. 전년도 연간 소득 (원)</label>
            <input type="number" id="f5_income" placeholder="소득금액증명원상 합계 금액">
        </div>

        <div class="input-group">
            <label>4. 사회통합프로그램 (KIIP)</label>
            <select id="f5_kiip_check">
                <option value="no">미이수 / 이수 중</option>
                <option value="yes">5단계 이수 및 종합평가 합격</option>
            </select>
        </div>

        <button onclick="calculateF5WithManual()" style="width:100%; padding:15px; background:#007bff; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">
            🔍 자격별 상세 요건 진단
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
    
    const GNI_2024 = 44000000; // 매뉴얼 기준 GNI 1배 추정치
    let requiredYears = 5; // 기본 일반영주는 5년
    let criteriaText = "";
    let failList = [];

    // 매뉴얼에 따른 자격별 기간 로직 설정
    if (visa === 'F-2-7') {
        requiredYears = 3;
        criteriaText = "<strong>[F-5-16 점수제 영주]</strong> F-2-7 자격으로 3년 이상 체류 및 소득 요건 충족 필요.";
    } else if (visa === 'F-6' || visa === 'F-2-99') {
        requiredYears = 2;
        criteriaText = "<strong>[F-5-2 / F-5-1 일반]</strong> 해당 자격으로 2년 이상 체류(F-6) 또는 전체 5년(F-2-99) 요건 검토.";
    } else if (visa === 'F-4') {
        requiredYears = 2;
        criteriaText = "<strong>[F-5-6 재외동포 영주]</strong> F-4 자격으로 2년 이상 체류 및 GNI 요건 충족 필요.";
    } else {
        requiredYears = 5;
        criteriaText = "<strong>[F-5-1 일반 영주]</strong> 전문직(E-7) 등은 국내에 5년 이상 지속하여 체류해야 신청 가능.";
    }

    // 검증 로직
    if (years < requiredYears) failList.push(`체류 기간 부족 (최소 ${requiredYears}년 필요)`);
    if (income < GNI_2024) failList.push(`소득 미달 (GNI 1배 약 ${GNI_2024.toLocaleString()}원 이상 필요)`);
    if (kiip === 'no') failList.push("사회통합프로그램(KIIP) 5단계 이수증 필요");

    // 결과 출력
    resultSec.style.display = "block";
    infoBox.innerHTML = criteriaText + "<br><br>※ 상세 심사 시 품행단정(범죄경력) 및 해외 범죄경력증명서 제출이 필수입니다.";

    if (failList.length === 0) {
        alertBox.style.backgroundColor = "#d1e7dd";
        alertBox.style.color = "#0f5132";
        alertBox.innerHTML = "✅ 진단 결과: 영주권 신청 가능 대상입니다!";
    } else {
        alertBox.style.backgroundColor = "#f8d7da";
        alertBox.style.color = "#842029";
        alertBox.innerHTML = "❌ 진단 결과: 요건 미충족<br><span style='font-size:0.8em; font-weight:normal;'>" + failList.join(" / ") + "</span>";
    }
}