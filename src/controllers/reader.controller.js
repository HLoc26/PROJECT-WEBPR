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

};