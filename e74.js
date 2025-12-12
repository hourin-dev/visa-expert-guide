function calculateE74() {
    // E-7-4 계산 버튼이 정상 호출되었는지 테스트
    const income = document.getElementById('e74_income').value;
    const resultBox = document.getElementById('e74Result');

    if (!income) {
        resultBox.innerHTML = '<p style="color:red; font-weight:bold;">소득을 입력해주세요.</p>';
        return;
    }

    // 결과 출력 (테스트 성공 메시지)
    resultBox.innerHTML = `
        <h3>✨ E-7-4 계산 함수 호출 성공!</h3>
        <p>입력된 소득: <strong>${income}원</strong></p>
        <p style="color:green;">계산 함수(calculateE74)가 정상적으로 실행되었습니다.</p>
    `;
    // closeModal('e74Modal'); // 테스트를 위해 닫지 않음
}