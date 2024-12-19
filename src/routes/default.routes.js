import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const router = express.Router();

/* ------------------------------ Auth Routes ------------------------------- */

// Registration Routes
router.get("/register", (req, res) => {
	res.render("vwLogin/Register");
});

router.post("/register", (req, res) => {
	// TODO: Implement registration logic
	// This should handle user registration
});

// Login Routes
router.get("/login", (req, res) => {
	res.render("vwLogin/Login");
});

router.post("/login", (req, res) => {
	// TODO: Implement login logic
	// This should handle user authentication
});

// Password Reset Routes
router.get("/forget", (req, res) => {
	res.render("vwLogin/Forget");
});

/* ----------------------------- Utility Functions ---------------------------- */
// In-memory OTP storage
const otps = new Map();
const generateOtp = (length = 6) => {
	const digits = "0123456789";
	let otp = "";
	for (let i = 0; i < length; i++) {
		otp += digits[Math.floor(Math.random() * digits.length)];
	}
	return otp;
};

const sendOtpEmail = async (email, otp) => {
	try {
		console.log("Sending email to:", email);
		console.log("OTP:", otp);
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Your OTP Code",
			text: `Your OTP code is: ${otp}`,
		};
		await transporter.sendMail(mailOptions);
		console.log("Email sent successfully!");
	} catch (error) {
		console.error("Error sending email:", error.message);
		throw new Error("Failed to send email.");
	}
};

/* ------------------------------ OTP Routes ------------------------------- */

// Initial OTP Page
router.get("/OTP", (req, res) => {
	res.render("vwLogin/Otp", { layout: false, otpSent: false, error: null, success: null, email: null });
});

// Request OTP
router.post("/OTP", async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).render("vwLogin/Otp", {
			error: "Email is required.",
			layout: false,
			otpSent: false,
			success: null,
			email: null,
		});
	}

	try {
		const otp = generateOtp();
		otps.set(email, {
			otp,
			expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
			attempts: 0,
		});

		await sendOtpEmail(email, otp);

		return res.render("vwLogin/Otp", {
			otpSent: true,
			email,
			layout: false,
			error: null,
			success: "OTP sent successfully.",
		});
	} catch (error) {
		console.error("Error sending OTP:", error);
		return res.status(500).redirect("/404");
	}
});

router.get("/404", (req, res) => {
	res.render("vwError/404", { layout: false });
});

router.get("/500", (req, res) => {
	res.render("vwError/500", { layout: false });
});

export default router;
