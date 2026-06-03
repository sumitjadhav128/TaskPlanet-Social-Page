let env = require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = 5000;

//middleware
app.use(express.json());
app.use(cors({
    origin: true
}))

// db connection
const connectionDB = require("../backend/utils/db")
connectionDB();

//UserRoute
app.use("/api/auth", require("./routes/UserRoute"))

//PostRoute
app.use("/api/post", require("./routes/PostRoute"))

app.get("/test", (req,res) => {
    res.send("working")
})

app.listen(port, "0.0.0.0", (req,res) => {
    console.log(`server running on port: ${port}`)
});