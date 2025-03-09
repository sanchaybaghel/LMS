const { Webhook } = require('svix');
const User = require('../models/User');

const clerkWebhooks = async (req, res) => {
    try {
        // Manually parse the raw body
        const rawBody = req.body.toString('utf8');
        console.log("Raw Body:", rawBody);

        const { data, type } = JSON.parse(rawBody);

        console.log("Headers:", req.headers);
        console.log(`Received webhook event: ${type}`);
        console.log(`Event data: ${JSON.stringify(data)}`);

        // Webhook verification with increased tolerance
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        }); 

        // Handle different webhook types
        switch (type) {
            case 'user.created':
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                res.json({});
                break;

            case 'user.updated':
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                res.json({});
                break;

            case 'user.deleted':
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;

            default:
                console.log(`Unhandled event type: ${type}`);
                res.json({ success: false, message: 'Unhandled event type' });
                break;
        }

    } catch (error) {
        console.error('Error processing webhook:', error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = clerkWebhooks;