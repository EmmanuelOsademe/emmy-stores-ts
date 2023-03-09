import {number, object, string, array} from 'zod';

const orderProductId = object({
    productId: string(),
    quantity: number(),
    shippingFee: number()
})

export const createOrderSchema = object({
    body: object({
        tax: number({
            required_error: "Tax is required"
        }),
        orderedItems: array(orderProductId)
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