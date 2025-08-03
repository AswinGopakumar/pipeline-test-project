const express = require('express');
const router = express.Router();


router.get("/", (req,res)=>{
    res.send("Hello User")
})

router.get("/new", (req,res)=>{
    res.send("New User")
})
module.exports = router;