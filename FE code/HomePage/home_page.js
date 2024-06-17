document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử liên kết "Category" bằng ID
    var categoryLink = document.getElementById('categoryLink');

    // Thêm sự kiện 'click' cho liên kết
    categoryLink.addEventListener('click', function(event) {
        // Ngăn chặn hành vi mặc định của liên kết
        event.preventDefault();

        // Chuyển hướng đến trang 'category.html'
        window.location.href = 'web.html';
    });
    var homePageLink = document.getElementById('homePageLink');

        // Thêm sự kiện 'click' cho liên kết
        homePageLink.addEventListener('click', function(event) {
            // Ngăn chặn hành vi mặc định của liên kết
        event.preventDefault();

            // Chuyển hướng đến trang 'home_page.html'
        window.location.href = 'home_page.html';
    });
});
