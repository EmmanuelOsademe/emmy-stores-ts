import { object, string, number } from 'zod';

export const createPurchaseSchema = object({
    body: object({
        productId: string({
            required_error: "Please provide productId"
        }),
        quantity: number({
            required_error: "Please provide product quantity"
        }),
        unitCost: number({
            required_error: "Please provide Unit cost"
        })
    })
})

export const getDailyPurchasesSchema = object({
    query: object({
        productId: string().optional()
    })
});

export const getSinglePurchaseSchema = object({
    params: object({
        purchaseId: string({
            required_error: "Please provide orderId"
        })
    })
})