import express from "express";
import userService from "../services/user.service.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const updateProfileValidation = [
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
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirm_password")
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    })
];

// Get profile page
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("vwProfile/Edit", {
    layout: "layouts/reader.main.ejs",
    user: req.session.user
  });
});

// Update profile
router.post("/", updateProfileValidation, async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const { username, email, full_name, dob, password } = req.body;
    
    // Validate unique username/email
    const existingUser = await userService.findByUsername(username);
    if (existingUser && existingUser.user_id !== req.session.user.user_id) {
      return res.render("vwProfile/Edit", {
        layout: "layouts/reader.main.ejs",
        user: req.session.user,
        error: "Username already exists"
      });
    }

    // Create update data object
    const updateData = {
      username,
      email,  
      full_name,
      dob: new Date(dob)
    };

    // Add password if provided
    if (password) {
      updateData.password = password;
    }

    // Update user
    await userService.updateUserProfile(req.session.user.user_id, updateData);

    // Get updated user data
    const updatedUser = await userService.findUserById(req.session.user.user_id);
    req.session.user = updatedUser;

    res.render("vwProfile/Edit", {
      layout: "layouts/reader.main.ejs",
      user: updatedUser,
      success: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.render("vwProfile/Edit", {
      layout: "layouts/reader.main.ejs", 
      user: req.session.user,
      error: "Failed to update profile"
    });
  }
});

export default router;