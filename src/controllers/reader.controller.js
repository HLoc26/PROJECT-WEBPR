import UserService from "../services/user.service.js";

export default {
    // Get a list of reader users
    async getReaderUsers(req, res) {
        try {
            const readers = await UserService.findAllUsers("reader");
            res.render("../views/vwAdmin/Readers.ejs", { readers });
        } catch (error) {
            console.error("Error in getReaderUsers:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

    // Get information of a specific user
    async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.findUserById(userId);
            if (!user) {
                return res.status(404).render("vwError/404", { message: "User not found" });
            }
            res.render("../views/vwAdmin/UserDetails.ejs", { user });
        } catch (error) {
            console.error("Error in getUserDetails:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

    // Admin register premium for a user
    async registerPremium(req, res) {
        try {
            const userId = req.params.id;
            const { subscriptionExpiredDate } = req.body;

            if (!subscriptionExpiredDate) {
                return res.status(400).render("vwError/400", { message: "Subscription expiration date is required" });
            }

            const user = await UserService.findUserById(userId, "reader");
            if (!user) {
                return res.status(404).render("vwError/404", { message: "User not found or not a reader" });
            }

            await UserService.registerPremium(userId, subscriptionExpiredDate);
            res.redirect("/admin/readers");
        } catch (error) {
            console.error("Error in registerPremium:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

};