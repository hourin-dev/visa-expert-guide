// F-5 영주권 진단 프로그램 로드
function openF5Program() {
    const contentArea = document.getElementById('f5ProgramContent');
    loadF5UI(contentArea);
    openModal('f5Modal');
}

function loadF5UI(container) {
    container.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9em; line-height: 1.6;">
            <strong>※ 안내:</strong> 가장 일반적인 <strong>F-5-1(일반 영주)</strong> 기준 진단입니다. 
            영주권은 신청 시점의 최신 GNI(국민총소득) 발표치를 기준으로 합니다.
        </div>

        <div class="input-group">
            <label><strong>1. 현재 체류 자격</strong></label>
            <select id="f5_current_visa">
                <option value="E-7">E-1 ~ E-7 (전문인력)</option>
                <option value="F-2">F-2 (거주)</option>
                <option value="D-8">D-8 (기업투자)</option>
                <option value="OTHERS">기타 (D-2, E-9 등은 바로 신청 불가)</option>
            </select>
        </div>

        <div class="input-group">
            <label><strong>2. 국내 체류 기간 (동일 자격 유지)</strong></label>
            <select id="f5_stay_period">
                <option value="0">2년 미만</option>
                <option value="2">2년 이상</option>
                <option value="5">5년 이상</option>
            </select>
        </div>

        <div class="input-group">
            <label><strong>3. 소득 요건 (전년도 연간 소득)</strong></label>
            <input type="number" id="f5_income" placeholder="예: 45000000 (단위: 원)">
            <p style="font-size: 0.8em; color: #666;">* 2024년 GNI 기준 약 4,400만 원 이상 권장</p>
        </div>

        <div class="input-group">
            <label><strong>4. 한국어 능력</strong></label>
            <select id="f5_korean">
                <option value="none">없음</option>
                <option value="kiip5">사회통합프로그램(KIIP) 5단계 이수</option>
                <option value="topik6">TOPIK 6급</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="calculateF5()" style="flex: 1; padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">진단하기</button>
            <button onclick="openF5Program()" style="flex: 1; padding: 12px; background: #bdc3c7; color: white; border: none; border-radius: 4px; cursor: pointer;">초기화</button>
        </div>

        <div id="f5_result" style="margin-top: 20px; padding: 15px; border-radius: 4px; display: none;"></div>
    `;
}

function calculateF5() {
    const visa = document.getElementById('f5_current_visa').value;
    const period = parseInt(document.getElementById('f5_stay_period').value);
    const income = parseInt(document.getElementById('f5_income').value) || 0;
    const korean = document.getElementById('f5_korean').value;
    const resultDiv = document.getElementById('f5_result');

    let passCount = 0;
    let feedback = [];

    // 1. 체류 기간 체크 (일반영주는 보통 5년, F-2는 2년 등 특례 존재)
    if (visa === 'F-2' && period >= 2) {
        passCount++;
    } else if (period >= 5) {
        passCount++;
    } else {
        feedback.push("❌ 체류 기간 부족 (일반적으로 5년 이상 필요)");
    }

    // 2. 소득 체크 (GNI 1배 기준 약 4,400만 원 가정)
    const GNI_THRESHOLD = 44000000; 
    if (income >= GNI_THRESHOLD) {
        passCount++;
    } else {
        feedback.push(`❌ 소득 부족 (GNI 1배 약 ${GNI_THRESHOLD.toLocaleString()}원 이상 필요)`);
    }

    // 3. 한국어 체크
    if (korean === 'kiip5') {
        passCount++;
    } else {
        feedback.push("❌ KIIP 5단계 이수 필수 (영주용 종합평가 합격 필요)");
    }

    // 결과 출력
    resultDiv.style.display = "block";
    if (passCount === 3) {
        resultDiv.style.background = "#d4edda";
        resultDiv.style.color = "#155724";
        resultDiv.innerHTML = "<h3>✅ 영주권 신청 가능성이 높습니다!</h3><p>필수 3대 요건(기간, 소득, 품행)을 충족하는 것으로 보입니다. 전문 행정사와 세부 서류를 준비하세요.</p>";
    } else {
        resultDiv.style.background = "#f8d7da";
        resultDiv.style.color = "#721c24";
        resultDiv.innerHTML = "<h3>⚠️ 보완이 필요합니다.</h3>" + feedback.join("<br>");
    }
}