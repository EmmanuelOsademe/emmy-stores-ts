import {prop, Ref, getModelForClass} from '@typegoose/typegoose';
import {Product} from '@/resources/product/product.model';
import {User} from '@/resources/user/user.model';

export class singleOrder {
    @prop({ref: () => Product})
    product: Ref<Product>
    
    @prop({required: true})
    productName: string

    @prop({required: true})
    image: string

    @prop({required: true})
    price: number

    @prop({required: true, validate: {
        validator: (num: number) => {
            return num % 1 === 0 && num > 0
        },
        message: "Quantity must be an even number greater than 0"
    }})
    quantity: number
}

export class Order {
    @prop({required: true})
    tax: number

    @prop({required: true})
    shippingFee: number

    @prop({required: true})
    subtotal: number

    @prop({required: true})
    total: number

    @prop({type: singleOrder, required: true})
    orderItems: Array<singleOrder>

    @prop({required: true, enum: ['pending', 'paid', 'failed', 'deliverd'], default: 'pending'})
    status: string

    @prop({})
    clientSecret: string

    @prop({})
    paymentIntent: string

    @prop({ref: () => User})
    user: Ref<User>
}

const OrderModel = getModelForClass(Order, {
    schemaOptions: {
        timestamps: true
    }
});

export default OrderModel;