import UserService from "../services/user.service.js";

export default {
    // Get a list of reader users
    async getReaderUsers(req, res) {
        try {
            const readers = await UserService.findUsersByRole("reader");
            res.render("../views/vwAdmin/Admin.readers.ejs", { readers, layout: "layouts/admin.main.ejs"});
        } catch (error) {
            console.error("Error in getReaderUsers:", error);
            res.status(500).redirect("/500");
        }
    },

    // Get information of a specific user
    async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.findUserById(userId);
            if (!user) {
                return res.status(404).redirect("/404");
            }
            res.render("../views/vwAdmin/Admin.readerDetails.ejs", { user , layout: "layouts/admin.main.ejs"});
        } catch (error) {
            console.error("Error in getReaderDetails:", error);
            res.status(500).redirect("/500");
        }
    },

    // Admin register premium for a user
    async registerPremium(req, res) {
        try {
            const userId = req.params.id;
            const { subscriptionExpiredDate } = req.body;
    
            if (!subscriptionExpiredDate) {
                return res.status(400).redirect("/400");
            }
    
            const user = await UserService.findUserById(userId, "reader");
            if (!user) {
                return res.status(404).redirect("/404");
            }
    
            await UserService.registerPremium(userId, subscriptionExpiredDate);
            res.redirect("/admin/readers");
        } catch (error) {
            console.error("Error in registerPremium:", error);
            res.status(500).redirect("/500");
        }
    },

};