const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./configs/mongodb.js');
const { clerkWebhooks, stripeWebhooks } = require('./controllers/webhooks.js');
const educatorRouter = require('./routes/educatorRoutes.js');
const { clerkMiddleware } = require('@clerk/express');
const connectCloudinary = require('./configs/cloudinary.js');
const couresRouter = require('./routes/courseRoute.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();
connectDB();
connectCloudinary();
app.use(cors());
app.use(clerkMiddleware());

// Clerk Webhook Route (must use express.raw for verification)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.get('/', (req, res) => res.send("API working"));
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), couresRouter);
app.use('/api/user', express.json(), userRouter);

// Stripe Webhook Route (must use express.raw for verification)
app.post('/stripe', express.raw({ type: 'application/json' }), (req, res, next) => {
    console.log("Stripe webhook received");
    next();
}, stripeWebhooks);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is listening at ${PORT}`);
});
// 10:42