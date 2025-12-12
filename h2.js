function calculateH2() {
    const resultBox = document.getElementById('h2Result');

    // H-2 계산 버튼이 정상 호출되었는지 테스트
    resultBox.innerHTML = `
        <h3>🎉 H-2 계산 함수 호출 성공!</h3>
        <p style="color:#007bff; font-weight:bold;">calculateH2() 함수가 정상적으로 실행되었습니다.</p>
        <p>여기에 H-2 비자 취업 가능성 진단 로직을 구현합니다.</p>
    `;
    // closeModal('h2Modal'); // 테스트를 위해 닫지 않음
}