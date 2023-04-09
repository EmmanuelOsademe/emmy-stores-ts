import { object, string, number, array } from 'zod';

/*export const createPurchaseSchema = object({
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
})*/

const singleProduct = object({
    productName: string({
        required_error: "Product name is required"
    }),
    quantity: number({
        required_error: "Please provide product quantity"
    }),
    unitCost: number({
        required_error: "Please provide Unit cost"
    })
})

export const createPurchaseSchema = object({
    body: object({
        purchases: array(singleProduct)
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