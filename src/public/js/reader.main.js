let lastScroll = 0;
const categoryBar = document.querySelector(".nav-scroll");

window.addEventListener("scroll", () => {
	const currentScroll = window.pageYOffset;

	if (currentScroll <= 0) {
		categoryBar.classList.remove("scrolled-down");
		return;
	}

	if (currentScroll > lastScroll && !categoryBar.classList.contains("scrolled-down")) {
		// Scroll Down
		categoryBar.classList.add("scrolled-down");
	} else if (currentScroll < lastScroll && categoryBar.classList.contains("scrolled-down")) {
		// Scroll Up
		categoryBar.classList.remove("scrolled-down");
	}
	lastScroll = currentScroll;
});
// Lắng nghe sự kiện thay đổi trên select
document.getElementById("categorySelect").addEventListener("change", function () {
	const selectedValue = this.value; // Lấy giá trị đã chọn
	if (selectedValue) {
		// Chuyển hướng đến URL tương ứng
		window.location.href = `/homepage/cate?id=${selectedValue}`;
	}
});
