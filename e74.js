function calculateE74() {
    // 1. 입력 값 가져오기
    const income = parseInt(document.getElementById('e74_income').value) || 0;
    const koreanLevel = parseInt(document.getElementById('e74_koreanLevel').value) || 0;
    const assetCheck = document.getElementById('e74_asset').checked;
    const masterDegree = document.getElementById('e74_master').checked;
    const violation = document.getElementById('e74_violation').checked;
    const resultBox = document.getElementById('e74Result');

    let totalScore = 0;
    let incomeScore = 0;
    let bonusScore = 0;
    let penaltyScore = 0;
    const requiredTotalScore = 200; // 최신 기준 확인 필요

    // 2. 소득 점수 계산 로직 (예시)
    if (income >= 80000000) { incomeScore = 80; } 
    else if (income >= 50000000) { incomeScore = 50; }
    
    // 3. 가점 및 감점
    if (assetCheck) { bonusScore += 5; }
    if (masterDegree) { bonusScore += 10; }
    if (violation) { penaltyScore -= 5; }

    // 4. 총점 계산
    totalScore = incomeScore + koreanLevel + bonusScore + penaltyScore;

    // 5. 최종 진단 출력 (여기에 합격/불허 로직 상세 구현)
    let diagnosisStatus = '';
    let resultColor = 'red';

    if (totalScore >= requiredTotalScore && incomeScore >= 50 && koreanLevel >= 40) {
        diagnosisStatus = '적격 (PASS) - 합격 가능성이 높습니다.';
        resultColor = 'green';
    } else if (incomeScore < 50) {
        diagnosisStatus = '불허 (필수 소득 요건 미충족)';
    } else {
        diagnosisStatus = '부적격 (점수 미달)';
    }
    
    resultBox.innerHTML = `
        <h3>✅ 진단 결과</h3>
        <p><strong>총 점수:</strong> ${totalScore}점</p>
        <p><strong>소득 점수:</strong> ${incomeScore}점</p>
        <p><strong>최종 진단:</strong> <span style="font-weight: bold; color: ${resultColor};">${diagnosisStatus}</span></p>
    `;
}