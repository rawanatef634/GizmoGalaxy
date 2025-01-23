import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id; // Get logged-in user ID

        // Validate Products
        const productIds = products.map(p => p.productId);
        const foundProducts = await Product.find({ _id: { $in: productIds } });

        if (foundProducts.length !== products.length) {
            return res.status(400).json({ message: "products do not exist" });
        }

        // Check Stock & Calculate Total Price
        let totalPrice = 0;
        for (const product of products) {
            const dbProduct = foundProducts.find(p => p._id.toString() === product.productId);
            if (dbProduct.stock < product.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${dbProduct.name}` });
            }
            totalPrice += dbProduct.price * product.quantity;
        }

        // Process Payment
        let paymentResult = { status: "Pending", transactionId: null};
        if (paymentMethod === "Stripe") {
            const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalPrice * 100,
                currency: "usd",
                payment_method_types: ["card"],
            });
            paymentResult = {
                status: "succeeded",
                transactionId: paymentIntent.id,
            };
          }
        // Deduct Stock
        for (const product of products) {
            await Product.findByIdAndUpdate(product.productId, {
                $inc: { stock: -product.quantity },
            });
        }

        // Create Order
        const order = new Order({
            user: userId,
            products,
            shippingAddress,
            paymentMethod,
            paymentResult,
            totalPrice,
            status: 'Pending', // Default status
        });

        await order.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
};

export const verifyPayment = async (req, res) => {
  const { orderId, paymentStatus } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.paymentStatus = paymentStatus;
    if (paymentStatus === "Completed") order.status = "Processing";
    await order.save();
    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying payment" });
  }
}
export const getOrders = async (req, res) => {
    const { userId } = req.user._id;
    try {
        const orders = await Order.findById(userId).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
  
  // ♻️ Refund Order (Admin Only)
export const refundOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Delivered") {
      order.status = "Refunded";
      order.paymentStatus = "Refunded";
      await order.save();
      res.status(200).json({ message: "Order refunded", order });
    } else {
      res.status(400).json({ message: "Cannot refund a delivered order" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing refund" });
  }
};
  
  // ❌ Delete Order (Admin Only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot delete shipped orders" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order" });
  }
};
