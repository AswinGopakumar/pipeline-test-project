const express = require('express')
const app = express()

app.set('view engine', 'ejs') 

app.get("/", (req,res)=>{
    console.log("Hi")
    res.render("index")
})

const userRouter = require('./routes/user')
app.use('/user', userRouter)


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})