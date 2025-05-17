document.getElementById("downloadPDF").addEventListener("click", async function () {
	try {
		// Check permission from server
		const response = await fetch(`/article/<%= article.article_id %>/download-pdf`);
		const data = await response.json();

		if (!data.success) {
			if (response.status === 401) {
				window.location.href = "/login";
				return;
			}
			alert(data.message);
			return;
		}

		// Create PDF content
		const pdfContent = document.createElement("div");
		pdfContent.innerHTML = `
            <div style="padding: 20px;">
                <h1>${data.article.title}</h1>
                <p style="color: #666;">
                    Published on: ${new Date(data.article.published_date).toLocaleDateString("vi-VN")}
                </p>
                <div>${data.article.content}</div>
                <p style="text-align: right; margin-top: 20px;">
                    <strong>Author: ${data.article.writer_name}</strong>
                </p>
                <div style="text-align: center; color: #666; margin-top: 30px;">
                    Generated from MyNewspaper.com
                </div>
            </div>
        `;

		// PDF options
		const opt = {
			margin: 1,
			filename: `${data.article.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
		};

		// Generate PDF
		await html2pdf().set(opt).from(pdfContent).save();
	} catch (err) {
		console.error("PDF generation failed:", err);
		alert("Failed to generate PDF. Please try again later.");
	}
});
