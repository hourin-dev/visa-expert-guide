// 모달 열기 함수
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    // 모달이 열릴 때 본문 스크롤 방지
    document.body.style.overflow = 'hidden';
}

// 모달 닫기 함수
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // 모달이 닫힐 때 본문 스크롤 허용
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