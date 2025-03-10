const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>console.log('databse connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/LMSWs`);
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;





