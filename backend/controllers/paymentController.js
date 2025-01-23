import Stripe from 'stripe';
import Order from '../models/Order.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { totalAmount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// Stripe Webhook for Payment Verification
export const verifyPayment = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log('Error verifying webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    // Update Order Payment Status
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'Completed';
      order.status = 'Processing';
      await order.save();
      res.status(200).json({ message: 'Payment verified successfully' });
    }
  }
};
