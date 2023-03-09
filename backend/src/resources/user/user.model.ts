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

@pre<User>("save", async function(){
    if(!this.isModified('password')){
        return 
    }

    const hash = await argon2.hash(this.password);
    this.password = hash;
    return;
})

export class User {
    @prop({required: true})
    firstName: string

    @prop({required: true})
    lastName: string

    @prop({lowercase: true, required: true, unique: true})
    email: string

    @prop({required: true})
    phone: string

    @prop({required: true})
    password: string

    @prop({required: true, enum: ['admin', 'user', 'super user'], default: 'user'})
    role: string

    @prop({required: true, default: () => nanoid()})
    verificationCode: string

    @prop()
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