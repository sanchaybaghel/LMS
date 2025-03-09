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
// const mongoose = require('mongoose');
// const User = require('../models/User');

// const connectDB = async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/LMSWs`);
//         console.log("✅ Connected to MongoDB");

//         const testUser = new User({
//             _id: "test123",
//             email: "test@example.com",
//             name: "Test User",
//             imageUrl: "https://example.com/image.jpg"
//         });

//         await testUser.save();
//         console.log("✅ User inserted successfully:", testUser);

//         mongoose.connection.close();
//     } catch (error) {
//         console.error("❌ Error inserting user:", error);
//     }
// };
// module.exports=connectDB;




