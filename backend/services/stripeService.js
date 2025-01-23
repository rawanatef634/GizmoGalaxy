import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency, metadata) => {
    return await stripe.paymentIntents.create({
        amount,
        currency,
        metadata
    })
}

export const verifyPayment = async (paymentIntentId) => {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
}