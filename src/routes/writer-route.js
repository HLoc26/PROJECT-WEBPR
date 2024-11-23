import express from 'express';

const router= express.Router();

router.get('/', (req, res){
    res.render("vwWriter/Writer");
});

export default router;