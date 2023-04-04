import { prop, modelOptions, Severity, index, pre, DocumentType, getModelForClass } from "@typegoose/typegoose";
import argon2 from 'argon2';
import { nanoid } from "nanoid";
import log from "@/utils/logger";

export const privateFields = [
    "password", "__v", "verificationCode", "passwordResetCode", "verified"
]

@modelOptions({
    schemaOptions: {timestamps: true},
    options: {allowMixed: Severity.ALLOW}
})

@index({
    email: 1
})

/*@pre<User>("save", async function(){
    if(!this.isModified('password')){
        return 
    }
    console.log(this.password);

    const hash = await argon2.hash(this.password);
    console.log(hash);
    this.password = hash;
    return;
})*/

export class UserAddress {
    @prop({required: true})
    houseAddress: string

    @prop({required: true})
    city: string

    @prop({required: true})
    country: string
}

export class User {
    @prop({required: true})
    firstName: string

    @prop({required: true})
    lastName: string

    @prop({lowercase: true, required: true, unique: true})
    email: string

    @prop({required: true})
    phone: string

    @prop()
    address: UserAddress

    @prop({required: true})
    password: string

    @prop({required: true, enum: ['admin', 'user', 'superUser'], default: 'user'})
    role: string

    @prop({required: true, default: () => nanoid()})
    verificationCode: string

    @prop({allowMixed: Severity.ALLOW})
    passwordResetCode: string | null

    @prop({required: true, default: false})
    verified: boolean

    async validatePassword(this: DocumentType<User>, candidatePassword: string){
        try {
            return await argon2.verify(this.password, candidatePassword);
        } catch (e: any) {
            log.error(e, "Could not validate password");
            return false;
        }
    }
}

const UserModel = getModelForClass(User);
export default UserModel;