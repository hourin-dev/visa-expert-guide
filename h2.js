function calculateH2() {
    // 1. 입력 값 가져오기
    const nationality = document.getElementById('h2_nationality').value;
    const jobType = document.getElementById('h2_jobtype').value;
    const resultBox = document.getElementById('h2Result');

    // 2. H-2 진단 로직 (예시)
    let diagnosis = '';
    let color = 'red';

    if (nationality !== 'korea_china') {
        diagnosis = 'H-2 비자는 원칙적으로 중국 및 구소련 동포에게만 발급됩니다.';
    } else if (jobType === 'exclude') {
        diagnosis = '선택하신 업종(유흥접객 등)은 H-2 취업 제한 업종입니다.';
    } else if (jobType === 'constr' || jobType === 'manufac') {
        diagnosis = '적격 (PASS) - 건설업/제조업 취업 가능성이 높습니다. 취업교육 이수 확인 필요.';
        color = 'green';
    } else {
        diagnosis = '조건부 적격 - 서비스업은 세부 업종 및 지역 제한을 확인해야 합니다.';
        color = 'orange';
    }

    // 3. 결과 출력
    resultBox.innerHTML = `
        <h3>✅ H-2 진단 결과</h3>
        <p style="font-weight: bold; color: ${color};">${diagnosis}</p>
        <p>※ H-2 소지자는 반드시 취업 개시 신고 및 취업 제한 업종 여부를 확인해야 합니다.</p>
    `;
}