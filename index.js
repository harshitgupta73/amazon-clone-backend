const express = require("express");
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(authRouter)
app.use(adminRouter)
app.use(productRouter)
app.use(userRouter)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connection successfully")
}).catch((e)=>{
    console.log(e)
})

app.listen(PORT, ()=>{
    console.log(`SErver is running at port ${PORT}`)
})
