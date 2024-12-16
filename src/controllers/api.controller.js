export default {
	async imgUpload(req, res) {
		// console.log("api upload: ", req.file);
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}
		const filePath = `/img/${req.file.filename}`;
		res.status(200).json({ responseText: "Uploaded", location: filePath });
	},
};
