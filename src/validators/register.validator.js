import { body } from "express-validator";
// Quy tắc kiểm tra dữ liệu cho form đăng ký
// prettier-ignore
export const registerValidation = [
	// Kiểm tra username
	body("username")
		.notEmpty()
		.withMessage("Tên người dùng không được để trống")
		.isAlphanumeric()
		.withMessage("Tên người dùng chỉ được chứa chữ và số")
		.isLength({ min: 3, max: 20 })
		.withMessage("Tên người dùng phải từ 3 đến 20 ký tự"),

	// Kiểm tra email
	body("email").notEmpty().withMessage("Email không được để trống").isEmail().withMessage("Email không hợp lệ"),

	// Kiểm tra password
	body("password")
		.notEmpty()
		.withMessage("Mật khẩu không được để trống")
		.isLength({ min: 6 })
		.withMessage("Mật khẩu phải có ít nhất 6 ký tự")
		.matches(/\d/)
		.withMessage("Mật khẩu phải chứa ít nhất một chữ số"),
	// body("password", "Mật khẩu phải mạnh hơn (bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)").isStrongPassword(),

	// Kiểm tra password2 (retype password)
	body("password2")
		.notEmpty()
		.withMessage("Vui lòng nhập lại mật khẩu")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Mật khẩu xác nhận không khớp");
			}
			return true;
		}),

	// Kiểm tra fullname
	body("fullname").notEmpty().withMessage("Họ và tên không được để trống").isLength({ max: 50 }).withMessage("Họ và tên không được vượt quá 50 ký tự"),

	// Kiểm tra dob (ngày sinh)
	body("dob").notEmpty().withMessage("Ngày sinh không được để trống").isISO8601().withMessage("Ngày sinh không hợp lệ"),
];
