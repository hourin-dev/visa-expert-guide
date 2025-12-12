// script.js 파일

function openModal(modalId) {
    // console.log(`[LOG] openModal 호출: ${modalId}`); // 디버깅용
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        console.error(`[ERROR] 모달 ID '${modalId}' 요소를 찾을 수 없습니다!`);
        alert(`오류: 모달 ID '${modalId}'를 HTML에서 찾을 수 없습니다. (개발자 콘솔 확인)`);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}