const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log("database connected");
    })
    .catch((err)=> {
        console.log("error connecting to BD: ",err);
        process.exit(1);
    })
}

module.exports = connectDB