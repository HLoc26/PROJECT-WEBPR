import express from "express";
import multer from "multer";

const upload = multer({ dest: "./src/public/img/" });

export default upload;