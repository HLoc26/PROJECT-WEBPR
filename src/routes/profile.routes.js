import express from "express";
import userService from "../services/user.service.js";
import { updateProfileValidation } from "../validators/profile.validator.js";
import bcrypt from "bcrypt";

const router = express.Router();

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

    const { username, email, full_name, dob, old_password, password } = req.body;

    // If attempting password change, verify old password
    if (password) {
      const user = await userService.findUserById(req.session.user.user_id);
      
      if (!user || !user.password) {
        return res.render("vwProfile/Edit", {
          layout: "layouts/reader.main.ejs",
          user: req.session.user,
          error: "User authentication failed"
        });
      }

      const isValidPassword = await bcrypt.compare(old_password, user.password);
      
      if (!isValidPassword) {
        return res.render("vwProfile/Edit", {
          layout: "layouts/reader.main.ejs",
          user: req.session.user,
          error: "Current password is incorrect"
        });
      }
    }
    
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