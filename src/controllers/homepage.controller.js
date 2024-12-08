import ArticleService from '../services/ArticleService'; //chua biet name cua service nen dat tam
//import ...


export default {
    //logic lay cua service rap vao controller
    //du kien se co lay article, truoc mat chi render
    async GetHomepage (req, res) {
        res.render("vwHomepage/Homepage",);//truyen user_id hay 
    }
};