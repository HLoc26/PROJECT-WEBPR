import express from 'express';

const router= express.Router();

router.get('/', function (req, res){
    res.render("vwWriter/Writer");
});

router.get('/NewArticle', function(req,res)
{
   res.redirect("vwWriter/NewArticle"); 
});

export default router;