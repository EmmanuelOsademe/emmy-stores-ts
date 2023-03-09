import ProductModel from '@/resources/product/product.model';
import {CreateProductInterface, GetAllProductsInterface, GetSingleProductInterface, UpdateProductInterface} from '@/resources/product/product.interface';
import cloudinary from 'cloudinary';
import {Request} from 'express';

class ProductService {
    private product = ProductModel;

    public async createProduct(productsInput: CreateProductInterface): Promise<Object | Error>{
        const products = productsInput.products;
        try {
            const dbProduct = await this.product.insertMany(products);
            return dbProduct;
        } catch (e: any) {
            throw new Error(e);
        }
    }

    public async updateProduct(updateProductInput: UpdateProductInterface['body'], productId: string): Promise<Object | Error>{
        try {
            const product = await this.product.findById({_id: productId});
            if(!product){
                throw new Error('Product not found');
            }

            const inputArray = Object.keys(updateProductInput);

            if(inputArray.length === 0){
                throw new Error('No fields for update');
            }

            const updatedProduct = await this.product.findOneAndUpdate({_id: productId}, updateProductInput, {
                new: true
            })

            if(updatedProduct){
                return updatedProduct;
            }else{
                throw new Error('Error updating product');
            }
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getSingleProduct(productId: string): Promise<Object | Error> {
        try {
            const product = await this.product.findById({_id: productId});
            if(!product){
                throw new Error('Product not found')
            }
            return product;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async deleteSingleProduct(productId: string): Promise<Object | Error> {
        try {
            const product = await this.product.findById({_id: productId});
            if(!product){
                throw new Error("Product not found");
            }

            await product.remove();
            return "Product successfully removed";
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getAllProducts(searchInput: GetAllProductsInterface): Promise<Object | Error>{
        const {name, description, category, company, featured, freeShipping, sort, fields, numericalFilters} = searchInput;
        try {
            type qObject = {[key: string]: string | boolean};
            const qOptions: qObject = {}
            
            if(featured){
                qOptions.featured = featured === 'true' ? true : false;
            }
            if(freeShipping){
                qOptions.freeShipping = freeShipping === 'true' ? true : false;
            }
            if(company){
                qOptions.company = company;
            }
            if(category){
                qOptions.category = category;
            }
            if(name){
                qOptions.name = {$regex: name, $options: 'i'}.$regex
            }
            if(description){
                qOptions.description = {$regex: description, $options: 'i'}.$regex;
            }
            if(numericalFilters){
                const operatorsMap = new Map();
                operatorsMap.set('<', '$lt');
                operatorsMap.set('<=', '$lte');
                operatorsMap.set('=', '$eq');
                operatorsMap.set('>', '$gt');
                operatorsMap.set('>=', '$gte');
                
                const regEx = /\b(>|>=|=|>|>=)\b/g;
                let filters = numericalFilters.replace(
                    regEx, (match) => `-${operatorsMap.get(match)}-`
                ) as any;
                const options = ['price', 'averageRating', 'numOfReviews', 'inventory'];
                filters = filters.split(',').forEach((item: string) => {
                    const [field, operator, value] = item.split('-');
                    if(options.includes(field)){
                        qOptions.field = String({[operator]: Number(value)});
                    }
                })
            }   
            console.log(qOptions);

            // Sort
            let sortCriteria : string;
            if(sort){
               sortCriteria = sort.split(',').join(' ');
            }else{
                sortCriteria = 'createdAt';
            }

            // Filter by fields
            let filterOptions = fields ? fields.split(',').join(' ') : '';

            // Pagination
            const {page, limit} = searchInput;
            const searchPage = page ? Number(page) : 1;
            const pageLimit = limit ? Number(limit) : await this.product.countDocuments();
            const skips = (searchPage - 1) * pageLimit;

            const products = await this.product.find(qOptions).select(filterOptions).sort(sortCriteria).skip(skips).limit(pageLimit);
            
            return {products, count: products.length};
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async uploadImage(productId: string, req: Request): Promise<Object | Error> {
        try {
            const product = await this.product.findById({_id: productId});
            if(!product){
                throw new Error('Product not found');
            }

            if(product.cloudinaryID){
                await cloudinary.v2.uploader.destroy(product.cloudinaryID);
            }

            let uploadedImage: cloudinary.UploadApiResponse;
            if(req.file){
                uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {user_filename: true});
                product.image = uploadedImage.secure_url;
                product.cloudinaryID = uploadedImage.public_id;
                await product.save();
                return product;
            }else{
                throw new Error('Upload file not available');
            }
            
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}

cloudinary.v2.config(
    {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    }
)

export default ProductService;