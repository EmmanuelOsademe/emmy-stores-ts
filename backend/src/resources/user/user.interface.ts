import { TypeOf } from "zod";
import {createUserSchema, deleteUserSchema, forgotPasswordSchema, getSingleUserSchema, resetPasswordSchema, updateUserDetailsSchema, updateUserPasswordSchema, verifyUserSchema} from "@/resources/user/user.validation";

export type CreateUserInterface = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInterface = TypeOf<typeof verifyUserSchema>['query'];
export type ForgotPasswordInterface = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInterface = TypeOf<typeof resetPasswordSchema>;
export type GetSingleUserInterface = TypeOf<typeof getSingleUserSchema>['params'];
export type UpdateUserDetailsInterface = TypeOf<typeof updateUserDetailsSchema>['body'];
export type UpdateUserPasswordInterface = TypeOf<typeof updateUserPasswordSchema>['body'];
export type DeleteUserInterface = TypeOf<typeof deleteUserSchema>['body'];