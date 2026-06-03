const mongoose = require("mongoose");

const connectionDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected")
    console.log("Connected DB:", mongoose.connection.name);

    } catch(err) {
    console.log(err);
    process.exit(1);
    }
}

module.exports = connectionDB;