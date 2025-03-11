const { Webhook } = require('svix');
const User = require('../models/User');
const Stripe = require('stripe');
const Purchase = require('../models/purchase');
const Course = require('../models/Course');

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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    console.log("inside")

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            console.log('completed');
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });
            const { purchaseId } = session.data[0].metadata;

            const purchaseData = await Purchase.findById(purchaseId);
            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            courseData.enrolledStudents.push(userData);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
           
            await userData.save();

            purchaseData.status = 'completed';
            await purchaseData.save();

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });
            const { purchaseId } = session.data[0].metadata;

            const purchaseData = await Purchase.findById(purchaseId);
            purchaseData.status = 'failed';
            await purchaseData.save();
            break;
        }

        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
};

module.exports = { clerkWebhooks, stripeWebhooks };

//9:53:40