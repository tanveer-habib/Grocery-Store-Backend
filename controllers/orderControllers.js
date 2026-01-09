import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

// Placed Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!userId || items.length < 1 || !address) {
            return res.json({ success: false, message: "Invalid Data" });
        };

        let amount = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity
        };

        // Add 2% tex with totalAmount.
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
        });

        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return res.json({ success: true, message: "Order Placed" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!userId || items.length < 1 || !address) {
            return res.json({ success: false, message: "Invalid Data" });
        };
        let amount = 0;
        let line_items = [];
        for (let item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.ceil(product.offerPrice + (product.offerPrice * 0.02)) * 100,
                },
                quantity: item.quantity
            });
        };

        // Add 2% tex with amount
        amount += Math.ceil(amount * 0.02);

        // Add Product in DB
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        });

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create stripe checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=/my-orders`,
            cancel_url: `${origin}/cart`,

            // For checkout.session.completed
            metadata: {
                orderId: order._id.toString(),
                userId
            },

            // For payment_intent. event
            payment_intent_data: {
                metadata: {
                    ordrId: order._id.toString(),
                    userId
                }
            }
        });

        return res.json({ success: true, url: session.url });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

// Stripe webhooks to handle payment : /stripe
export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const signature = req.headers["stripe-signature"];
    let event;

    console.log("WebHooks Hitted");

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.IS_DEVELOPMENT === "production" ? process.env.STRIPE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_CLI_SECRET
        );
    } catch (err) {
        console.log(err.message);
        return res.status(400).send("Webhook error: ", err.message);
    };

    switch (event.type) {
        case "checkout.session.completed": {
            const { orderId, userId } = event.data.object.metadata;
            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        }
        case "payment_intent.payment_failed": {
            const { orderId } = event.data.object.metadata;
            await Order.findByIdAndDelete(orderId);
            break
        };
    };

    return res.json({ received: true });
};

// Get User Orders : /api/order/get
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ userId, $or: [{ paymentType: "COD" }, { isPaid: true }] }).populate("items.product address").sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

// Get all Orders for Seller : /api/order/seller
export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ $or: [{ paymentType: "COD" }, { isPaid: true }] }).populate("items.product address").sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message })
    }
}