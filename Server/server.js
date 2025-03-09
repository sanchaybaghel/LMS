const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./configs/mongodb.js');
const clerkWebhooks = require('./controllers/webhooks.js');

const app = express();
app.use(cors());
connectDB();

// Clerk Webhook Route (must use express.raw for verification)
app.post('/clerk', express.raw({ type: 'application/json' }),clerkWebhooks);



app.get('/', (req, res) => res.send("API working"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is listening at ${PORT}`);
});
