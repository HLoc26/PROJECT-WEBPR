document.addEventListener("DOMContentLoaded", function () {
	const sidebarOpen = document.getElementById("sidebarOpen");
	const sidebar = document.getElementById("sidebar");

	sidebarOpen.addEventListener("click", function () {
		sidebar.classList.toggle("active");
	});
	const sidebarClose = document.getElementById("sidebarClose");

	sidebarClose.addEventListener("click", function () {
		sidebar.classList.toggle("active");
	});
});
