import { body } from "express-validator";

export const updateProfileValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"), 
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required"),
  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("old_password")
    .if(body("password").exists({checkFalsy: true}))
    .notEmpty()
    .withMessage("Current password is required when changing password"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  body("confirm_password")
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error("New passwords don't match"); 
      }
      return true;
    })
];