// F-5 영주권 진단 프로그램 (매뉴얼 최신판 반영)
function openF5Program() {
    const contentArea = document.getElementById('f5ProgramContent');
    loadF5UI(contentArea);
    openModal('f5Modal');
}

function loadF5UI(container) {
    container.innerHTML = `
        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9em; border-left: 5px solid #0d6efd;">
            <strong>📘 매뉴얼 근거 진단:</strong> 신청 자격별로 상이한 체류 기간 및 소득 요건을 검토합니다. 
        </div>

        <div class="input-group">
            <label>1. 신청 예정 영주권 유형</label>
            <select id="f5_type">
                <option value="F-5-1">일반 영주자 (F-5-1)</option>
                <option value="F-5-2">영주권자의 배우자 (F-5-2)</option>
                <option value="F-5-10">첨단분야 학사 학위자 (F-5-10)</option>
                <option value="F-5-16">점수제 거주자 (F-5-16)</option>
            </select>
        </div>

        <div class="input-group">
            <label>2. 해당 자격 국내 체류 기간</label>
            <input type="number" id="f5_years" placeholder="연 단위 입력 (예: 3)">
        </div>

        <div class="input-group">
            <label>3. 전년도 연간 소득 (원)</label>
            <input type="number" id="f5_income" placeholder="소득금액증명원 기준 금액">
        </div>

        <div class="input-group">
            <label>4. 기본 소양 (사회통합프로그램)</label>
            <select id="f5_kiip_status">
                <option value="none">해당 없음 / 이수 중</option>
                <option value="passed">5단계 이수 및 영주용 종합평가 합격</option>
            </select>
        </div>

        <button onclick="calculateF5()" style="width:100%; padding:15px; background:#0d6efd; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">
            🔍 매뉴얼 기준 자가진단 실행
        </button>

        <div id="f5_result_container" style="margin-top:20px; display:none;">
            <div id="f5_status_box" style="padding:15px; border-radius:5px; font-weight:bold; margin-bottom:10px;"></div>
            <div id="f5_manual_guide" style="background:#f8f9fa; padding:15px; border:1px solid #dee2e6; font-size:0.9em; line-height:1.6;"></div>
        </div>
    `;
}

function calculateF5() {
    const type = document.getElementById('f5_type').value;
    const years = parseInt(document.getElementById('f5_years').value) || 0;
    const income = parseInt(document.getElementById('f5_income').value) || 0;
    const kiip = document.getElementById('f5_kiip_status').value;
    
    const resultContainer = document.getElementById('f5_result_container');
    const statusBox = document.getElementById('f5_status_box');
    const guideBox = document.getElementById('f5_manual_guide');
    
    // GNI 1배 기준 (매뉴얼상 2024년 기준 약 4,400만원 가정) 
    const GNI_1 = 44000000;
    let isPass = true;
    let failReasons = [];
    let manualText = "";

    // 자격별 로직 분기 
    switch(type) {
        case 'F-5-1':
            manualText = "<strong>[F-5-1 일반 영주자 지침]</strong><br>• 체류: 5년 이상 지속 체류<br>• 소득: GNI 1배 이상<br>• 소양: KIIP 5단계 필수";
            if (years < 5) { isPass = false; failReasons.push("국내 체류 기간 5년 미달"); }
            if (income < GNI_1) { isPass = false; failReasons.push("연간 소득 GNI 1배 미달"); }
            break;
        case 'F-5-2':
            manualText = "<strong>[F-5-2 영주권자 배우자 지침]</strong><br>• 체류: 결혼 유지 상태로 2년 이상<br>• 소득: GNI 1배 이상 (배우자 합산 가능)<br>• 소양: KIIP 5단계 필수";
            if (years < 2) { isPass = false; failReasons.push("국내 체류 기간 2년 미달"); }
            if (income < GNI_1) { isPass = false; failReasons.push("소득 요건 미달 (가족 합산 확인 필요)"); }
            break;
        case 'F-5-10':
            manualText = "<strong>[F-5-10 첨단기술 학사 지침]</strong><br>• 체류: 학위 취득 후 3년 이상 체류<br>• 소득: GNI 1배 이상<br>• 소양: KIIP 5단계 필수";
            if (years < 3) { isPass = false; failReasons.push("학위 취득 후 체류 기간 3년 미달"); }
            if (income < GNI_1) { isPass = false; failReasons.push("연간 소득 GNI 1배 미달"); }
            break;
        case 'F-5-16':
            manualText = "<strong>[F-5-16 점수제 영주권 지침]</strong><br>• 체류: F-2 자격으로 3년 이상 체류<br>• 소득: GNI 1배 이상 (일부 자격 2배)<br>• 소양: KIIP 5단계 필수";
            if (years < 3) { isPass = false; failReasons.push("F-2 자격 체류 기간 3년 미달"); }
            if (income < GNI_1) { isPass = false; failReasons.push("연간 소득 GNI 요건 미달"); }
            break;
    }

    // 공통 소양 체크 
    if (kiip !== 'passed') {
        isPass = false;
        failReasons.push("사회통합프로그램(KIIP) 5단계 미이수");
    }

    // 결과 표시
    resultContainer.style.display = "block";
    guideBox.innerHTML = manualText;

    if (isPass) {
        statusBox.style.backgroundColor = "#d1e7dd";
        statusBox.style.color = "#0f5132";
        statusBox.innerHTML = "✅ 영주권 신청 요건을 충족하는 것으로 판단됩니다.";
    } else {
        statusBox.style.backgroundColor = "#f8d7da";
        statusBox.style.color = "#842029";
        statusBox.innerHTML = "❌ 요건 미충족: " + failReasons.join(", ");
    }
}