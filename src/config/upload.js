import express from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./src/public/img/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname); // Extract the original file extension
		cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Append the extension
	},
});

const upload = multer({ storage: storage });

export default upload;
