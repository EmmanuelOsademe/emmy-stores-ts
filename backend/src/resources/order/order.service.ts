import OrderModel from '@/resources/order/order.model';
import {CreateOrderInterface, singleOrderInterface} from '@/resources/order/order.interface';
import ProductModel from '@/resources/product/product.model';
import UserModel from '@/resources/user/user.model';
import Stripe from 'stripe';

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
    apiVersion: "2022-11-15"
})

class OrderService {
    private order = OrderModel;
    private ProductModel = ProductModel;
    private UserModel = UserModel;

    public async createOrder(orderInput: CreateOrderInterface, userId: string): Promise<object | Error> {
        let {orderedItems, tax} = orderInput;

        try {
            let orderItems: singleOrderInterface[] = new Array();
            let subtotal: number = 0;
            let shippingFee: number = 0;
            

            for(let item of orderedItems){
                const productId = item.productId;
                const dbProduct = await this.ProductModel.findById({_id: productId});
                if(!dbProduct){
                    throw  new Error("Product not found");
                };
                if(dbProduct.currentStock < item.quantity){
                    throw new Error(`${dbProduct.name} is currently out of stock`)
                }
                const {name, image, price, _id} = dbProduct;
                const singleOrderItem = {
                    quantity: item.quantity,
                    productName: name,
                    price,
                    image,
                    product: _id,
                }

                if(!dbProduct.freeShipping){
                    shippingFee += item.shippingFee;
                }

                orderItems = [...orderItems, singleOrderItem]
                subtotal += item.quantity * price;
                dbProduct.currentStock = dbProduct.currentStock - item.quantity;
                await dbProduct.save();
            }

            const total = subtotal + tax + shippingFee;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total),
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true
                }
            })

            const order = await this.order.create({
                orderItems,
                total: total/100, 
                subtotal: subtotal/100,
                tax: tax/100,
                shippingFee: shippingFee/100,
                clientSecret: paymentIntent.client_secret,
                user: userId
            })

            return order;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getUserOrders(userId: string): Promise<object | Error>{
        try {
            const user = await this.UserModel.findById({_id: userId});
            if(!user){
                throw new Error("User does not exist");
            }

            if(!(user.role === 'admin') && !(user._id === userId)){
                throw new Error('You are not authorised to access this information')
            }

            const orders = await this.order.find({user: userId});
            return orders;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getAllOrders(): Promise<object | Error>{
        try {
            const orders = await this.order.find({})
            return orders
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getSingleOrder(orderId: string, userId: string): Promise<object | Error>{
        try {
            const user = await this.UserModel.findById({_id: userId});
            if(!user){
                throw new Error('User does not exist')
            }
            
            const order = await this.order.findById({_id: orderId});
            if(!order){
                throw new Error("Order does not exist");
            }

            if(!(user.role === 'admin') && !(user._id === order.user)){
                throw new Error("Not authorised to access this route");
            }
            return order;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async updateOrder(orderId: string, status: string, userId: string): Promise<string | Error>{
        try {
            const user = await this.UserModel.findById({_id: userId});
            if(!user){
                throw new Error('Error fetching user');
            }

            const order = await this.order.findById({_id: orderId});
            if(!order){
                throw new Error('Order not found');
            }

            if(!(user.role === 'admin') && !(user._id === order.user)){
                throw new Error("Not authorised to access this route");
            }

            order.status = status;
            await order.save();
            return "Order successfully updated"
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getMonthlyIncome(): Promise<object | Error>{
        try {
            const date = new Date();
            const previousMonth = new Date(date.setMonth(date.getMonth() - 11));
            const income = await this.order.aggregate(
                [
                    {
                        $match: {
                            createdAt: {$gte: previousMonth},
                            status: "paid"
                        }
                    },
                    {
                        $project: {
                            month: {$month: "$createdAt"},
                            sales: "$subtotal"
                        }
                    },
                    {
                        $group: {
                            _id: "$month",
                            total: {$sum: "$sales"}
                        }
                    }
                ]
            );

            const income2 = await this.order.aggregate(
                [
                    {
                        $match: {
                            status: "paid"
                        }
                    },
                    {
                        $group: {
                            _id: {year: {$year: "$createdAt"}, month: {$month: "$createdAt"}},
                            total: {$sum: "$subtotal"}
                        }
                    }
                ]
            )
            const income3 = await this.order.aggregate(
                [
                    {
                        $match: {status: "paid"},
                        
                    },
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                            total: {$sum: "$subtotal"}
                        }
                    }
                ]
            )
            return {income, income2, income3};
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}

export default OrderService;