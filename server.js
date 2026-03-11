require("dotenv").config();


const app = require("./src/app");
const connectDB = require("./src/config/db.js");

connectDB(); 
app.listen(8000, ()=> {
    console.log("server running on PORT: 8000");
})