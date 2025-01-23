// const {seedBrand}=require("./Brand")
// const {seedCategory}=require("./Category")
// const {seedAddress}=require("./Address")
// const {seedWishlist}=require("./Wishlist")
// const {seedCart}=require("./Cart")
// const {seedReview}=require("./Review")
import {seedOrder} from "./Order.js"
import connectDB  from "../config/db.js";
import { seedProduct } from "./Product.js";
import { seedUser } from "./User.js";
const seedData=async()=>{
    try {
        await connectDB()
        console.log('Seed [started] please wait..');
        // await seedBrand()
        // await seedCategory()
        await seedProduct()
        await seedUser()
        // await seedAddress()
        // await seedWishlist()
        // await seedCart()
        // await seedReview()
        await seedOrder()

        console.log('Seed completed..');
    } catch (error) {
        console.log(error);
    }
}

seedData()