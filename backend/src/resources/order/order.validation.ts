import {number, object, string, array, nativeEnum} from 'zod';

const orderProductId = object({
    productId: string(),
    quantity: number()
})

const deliveryAddress = object({
    houseAddress: string().optional(),
    city: string(),
    country: string()
})

export const createOrderSchema = object({
    body: object({
        tax: number({
            required_error: "Tax is required"
        }),
        cart: array(orderProductId),
        shippingFee: number({
            required_error: "Shipping Fee is required"
        }),
        subTotal: number({
            required_error: "Subtotal cost is required"
        }),
        totalCost: number({
            required_error: "Total cost is required"
        }),
        deliveryOption: string(),
        deliveryAddress: deliveryAddress
    })
})

export const getUserOrderSchema = object({
    params: object({
        userId: string()
    })
})

export const getSingleOrderSchema = object({
    params: object({
        orderId: string()
    })
})

export const updateOrderSchema = object({
    params: object({
        orderId: string()
    }),
    body: object({
        status: string()
    })
})