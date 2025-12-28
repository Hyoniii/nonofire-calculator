// 이미지 모달 기능
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementById('modalClose');

    // 썸네일 갤러리 이미지 클릭 이벤트
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');

    thumbnails.forEach(function(img) {
        img.addEventListener('click', function() {
            modal.classList.add('active');
            modalImg.src = this.src;
        });
    });

    // 닫기 버튼 클릭
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // 모달 배경 클릭시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
});
