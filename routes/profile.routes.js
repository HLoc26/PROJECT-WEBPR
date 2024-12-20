router.post("/", updateProfileValidation, async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const { username, email, full_name, dob, old_password, password } = req.body;

    // Validate user exists
    const user = await userService.findUserById(req.session.user.user_id);
    if (!user) {
      return res.render("vwProfile/Edit", {
        layout: "layouts/reader.main.ejs",
        user: req.session.user,
        error: "User not found"
      });
    }

    // If attempting password change, verify old password
    if (password) {
      if (!user.password) {
        return res.render("vwProfile/Edit", {
          layout: "layouts/reader.main.ejs",
          user: req.session.user,
          error: "Cannot update password for externally authenticated user"
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

    // Create update data object with sanitized inputs
    const updateData = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      full_name: full_name.trim(),
      dob: new Date(dob)
    };

    // Add hashed password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update user profile
    try {
      await userService.updateUserProfile(req.session.user.user_id, updateData);
    } catch (dbError) {
      console.error("Database error during profile update:", dbError);
      return res.render("vwProfile/Edit", {
        layout: "layouts/reader.main.ejs",
        user: req.session.user,
        error: "Database error occurred while updating profile"
      });
    }

    // Get fresh user data after update
    const updatedUser = await userService.findUserById(req.session.user.user_id);
    
    // Update session with new user data
    req.session.user = updatedUser;
    req.session.save();

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
      error: "An unexpected error occurred while updating profile"
    });
  }
});
