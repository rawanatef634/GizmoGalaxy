import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            const newCart = new Cart({
                user: userId,
                products: [],
                totalAmount: 0
            })
        }
        const existingProduct = cart.products.find(product => product.productId.toString() === productId.toString())
        if (existingProduct) {
            existingProduct.quantity += quantity
        } else {
            cart.products.push({ productId, quantity, price: product.price })
        }
        cart.totalAmount = cart.products.reduce((total, product) => total + product.price * quantity, 0)
        await cart.save()
        } catch (error) {   
            res.status(500).json({ message: error.message })
        }
    }

export const getCart = async (req, res) => {
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product')
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const removeFromCart = async (req, res) => {
    const userId = req.user._id
    const { productId } = req.body
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        cart.products = cart.products.filter(product => product.productId.toString() !== productId)
        cart.totalAmount = cart.products.reduce((total, product) => total + product.price * product.quantity, 0)
        await cart.save()
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateToCart = async (req, res) => {
    const userId = req.user._id
    const { productId, quantity } = req.body
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        const product = cart.products.find(product => product.productId.toString() === productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" })
        }
        product.quantity = quantity
        cart.totalAmount = cart.products.reduce((total, product) => total + product.price * product.quantity, 0)
        await cart.save()
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const clearCart = async (req, res) => {
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart is Empty" })
        }
        cart.products = []
        cart.totalAmount = 0
        await cart.save()
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
