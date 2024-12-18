$(document).ready(function () {
	// Xử lý toggle mật khẩu
	$(".toggle-password").click(function () {
		const targetInput = $($(this).data("target"));
		const currentType = targetInput.attr("type");

		// Chuyển đổi type giữa "password" và "text"
		const newType = currentType === "password" ? "text" : "password";
		targetInput.attr("type", newType);

		// Chuyển đổi icon giữa "eye" và "eye-slash"
		$(this).toggleClass("bi-eye bi-eye-slash");
	});
});
