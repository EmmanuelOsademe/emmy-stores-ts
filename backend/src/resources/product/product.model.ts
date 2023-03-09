import {getModelForClass, modelOptions, prop, Ref, pre, DocumentType} from "@typegoose/typegoose";
import ReviewModel, {Review} from '@/resources/review/review.model';

export const privateFields = [
    "cloudinaryID", "__v"
]


@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
})

@pre<Product>('remove', async function(this: DocumentType<Product>){
    await ReviewModel.deleteMany({product: this._id});
    return;
})

export class Product {
    @prop()
    _id?: string

    @prop({required: true, unique: true})
    name: string

    @prop({required: true})
    description: string

    @prop({required: true})
    price: number

    @prop({required: true, default: 0})
    currentStock: number

    @prop({required: true, enum: ['general', 'electronics', 'fashion', 'home & office', 'computing', 'kitchen'], default: "general"})
    category: string

    @prop({required: true, enum: ['marcos', 'argos', 'emmy-special'], default: 'emmy-special'})
    company: string

    @prop({type: String, required: true, default: ['blue']})
    color: Array<string>

    @prop({required: true, default: 'common area'})
    inventory: string

    @prop({required: true, default: false})
    featured: boolean

    @prop({required: true, default: false})
    freeShipping: boolean

    @prop({required: true, default: "/upload/example.jpeg"})
    image: string

    @prop({})
    cloudinaryID: string

    @prop({required: true, default: 0})
    numOfReviews: number

    @prop({required: true, default: 0})
    averageRating: number

    @prop({
        ref: () => Review,
        localField: '_id',
        foreignField: 'product',
        justOne: false
    })
    public one: Ref<Review>
}

const ProductModel = getModelForClass(Product);
export default ProductModel;