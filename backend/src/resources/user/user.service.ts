import UserModel, { privateFields, User } from '@/resources/user/user.model';
import {nanoid} from 'nanoid';
import sendEmail from '@/utils/mailer';
import {CreateUserInterface, DeleteUserInterface, ForgotPasswordInterface, ResetPasswordInterface, UpdateUserDetailsInterface, UpdateUserPasswordInterface, VerifyUserInterface} from '@/resources/user/user.interface';
import log from '@/utils/logger';
import { omit, update } from 'lodash';
import argon2 from 'argon2';


class UserService {
    private user = UserModel;

    public async register(userInput: CreateUserInterface): Promise<string | Error> {
        try {

            const role = (await this.user.countDocuments({})) === 0 ? 'admin' : 'user';

            const hashedPassword = await argon2.hash(userInput.password);

            const user = await this.user.create({...userInput, role: role, password: hashedPassword});
            console.log(user);
            const emailVerificationLink = `${process.env.ORIGIN}/api/v1/users/verify?verificationCode=${user.verificationCode}&userId=${user._id}`;
            const message = `<p>Dear ${user.firstName}, <br><br>Please confirm your email by clicking on the following link:
                <a href="${emailVerificationLink}">Verify Email</a></p>`;

            await sendEmail({
                from: "emmysshoppinghub@gmail.com",
                to: user.email,
                subject: "Email Verification",
                //text: `ID: ${user._id}. Verification code: ${user.verificationCode}`,
                html: message
            });
            log.info(emailVerificationLink);
            return `User successfully created. Check your email to verify your account`;
        } catch (e: any) {
            console.log(e);
            if(e.code === 11000){
                throw new Error("Account already exists");
            }else{
                throw new Error(e.message);
            }
        }
    }

    public async verify(verificationInput: VerifyUserInterface): Promise<string | Error> {
        const {verificationCode, userId} = verificationInput;

        try {
            const user = await this.user.findById({_id: userId});
            if(!user){
                throw new Error("User not found")
            }

            if(user.verified){
                return "User already verified"
            }

            if(user.verificationCode === verificationCode){
                user.verified = true;
                await user.save();
                return "Your account has been successfully  verified";
            }else{
                throw new Error('Invalid verification code')
            }
        } catch (e: any) {
            log.error(e.message);
            throw new Error('Error verify user')
        }
    }

    public async forgotPassword(forgotPasswordInput: ForgotPasswordInterface): Promise<string | Error> {
        const {email} = forgotPasswordInput;
        try {
            const user = await this.user.findOne({email: email});
            if(!user){
                throw new Error('User does not exist');
            }

            if(!user.verified){
                throw new Error('Account not verified');
            }

            const passwordResetCode = nanoid();
            user.passwordResetCode = passwordResetCode;
            await user.save();

            const passwordResetLink = `${process.env.ORIGIN}/api/v1/users/resetPassword?passwordResetCode=${user.passwordResetCode}&userId=${user._id}`;
            const message = `<p>Dear ${user.firstName}, <br><br>Please reset your password by clicking on the following link:
                <a href="${passwordResetLink}">Reset password</a></p>`;

            await sendEmail({
                from: "emmysshoppinghub@gmail.com",
                to: user.email,
                subject: "Reset your password",
                html: message
            });
            log.info(passwordResetLink);
            return `Check your email to reset your password`;
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    public async resetPassword(resetPasswordQuery: ResetPasswordInterface['query'], resetPasswordBody: ResetPasswordInterface['body']): Promise<string | Error> {
        const {passwordResetCode, userId} = resetPasswordQuery;
        const {password} = resetPasswordBody;

        try {
            const user = await this.user.findById({_id: userId});
            if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode){
                throw new Error("Unable to reset Password")
            }

            user.password = password;
            user.passwordResetCode = null;

            return `Password reset successfully`;
        } catch (e: any) {
            throw new Error("Unable to reset password");
        }
    }

    public async getAllUsers(role: string): Promise<Object | Error>{
        try {
            if(!(role === 'admin')){
                throw new Error('Unauthorised to access this route')
            }
            
            const users = await this.user.find({});
            return users.map(user => omit(user.toJSON(), privateFields))
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getSingleUser(role: string, userId: string): Promise<Object | Error> {
        
        try {
            if(!(role === 'admin')){
                throw new Error('You are not authorised to access this route');
            }

            const user = await this.user.findById({_id: userId});
            
            if(!user){
                throw new Error("User does not exist");
            }

            return omit(user.toJSON(), privateFields);
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    public async updateUserDetails(updateData: UpdateUserDetailsInterface, userId: string): Promise<string | Error> {
        const {firstName, lastName, phone} = updateData;
        
        try {
            if(!(firstName || lastName || phone)){
                throw new Error('No fields for update');
            }
            const user = await this.user.findById({_id: userId});
            if(!user){
                throw new Error('User not found');
            }

            if(firstName){
                user.firstName = firstName;
            }

            if(lastName){
                user.lastName = lastName;
            }

            if(phone){
                user.phone = phone;
            }

            await user.save();

            return 'Details updated successfully'
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async updateUserPassword(updatePasswordInput: UpdateUserPasswordInterface, userId: string): Promise<string | Error> {
        const {currentPassword, newPassword} = updatePasswordInput;
        
        try {
            const user = await this.user.findById({_id: userId});
            if(!user){
                throw new Error('User does not exist');
            }

            const isValid = await user.validatePassword(currentPassword);
            if(!isValid){
                throw new Error('Password is incorrect');
            }

            user.password = newPassword;

            await user.save();

            return 'Password has been successfully update';

        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async deleteUser(deleteUserInput: DeleteUserInterface, userId: string): Promise<string | Error>{
        const {email, password} = deleteUserInput;
        try {
            const user = await this.user.findById({_id: userId});
        
            if(!user){
                throw new Error('User not found');
            }

            if(!(user.email === email)){
                throw new Error('Operation not allowed');
            }

            const isValid = await user.validatePassword(password);
            if(!isValid){
                throw new Error('Operation not allowed')
            }

            await user.remove();
            return 'Account has been deleted';
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}

export default UserService;