import {boolean, number, object, string, array} from 'zod';

export const singleProductSchema = object({
    name: string({
        required_error: "Product name is required"
    }).min(5, "Name cannot be less than 5 characters"),
    description: string({
        required_error: "Product description is required"
    }).min(20, "Description must be a minimum of 20 characters").max(
        500, "Description cannot exceed 500 characters"
    ),
    image: string(),
    price: number(),
    currentStock: number().optional(),
    color: string().array().optional(),
    company: string().optional(),
    category: string().optional(),
    inventory: string().optional(),
    featured: boolean().optional(),
    freeShipping: boolean().optional()
})

export const createProductSchema = object({
    body: object({
        products: array(singleProductSchema)
    })
})

export const updateProductSchema = object({
    body: object({
        name: string({
            required_error: "Product name is required"
        }).min(5, "Name cannot be less than 5 characters").optional(),
        description: string({
            required_error: "Product description is required"
        }).min(20, "Description must be a minimum of 20 characters").max(
            300, "Description cannot exceed 300 characters"
        ).optional().optional(),
        price: number().optional(),
        color: string().array().nonempty().optional(),
        company: string().optional(),
        category: string().optional(),
        inventory: string().optional(),
        featured: boolean().optional(),
        freeShipping: boolean().optional()
    }),
    params: object({
        productId: string()
    })
});

export const getSingleProductSchema = object({
    params: object({
        productId: string({
            required_error: "Product ID is required"
        })
    })
});

export const deleteSingleProductSchema = object({
    params: object({
        productId: string({
            required_error: "Product ID is required"
        })
    })
})

export const getAllProductsSchema = object({
    query: object({
        name: string().optional(),
        description: string().optional(),
        category: string().optional(),
        company: string().optional(),
        featured: string().optional(),
        freeShipping: string().optional(),
        numericalFilters: string().optional(),
        fields: string().optional(),
        sort: string().optional(),
        page: string().optional(),
        limit: string().optional()
    })
})