import {object, string} from 'zod';

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "First name is required"
        }),
        lastName: string({
            required_error: "Last name is required"
        }),
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email"),
        phone: string({
            required_error: "Phone number is required"
        }),
        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be a minimum of 8 characters"),
        passwordConfirmation: string({
            required_error: "Password Confirmation required"
        })
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
});

export const verifyUserSchema = object({
    query: object({
        verificationCode: string({
            required_error: "Verification Code is required"
        }),
        userId: string({
            required_error: "User Id required"
        })
    })
})

export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        })
    })
});

export const resetPasswordSchema = object({
    query: object({
        passwordResetCode: string({
            required_error: "Password reset code is required"
        }),
        userId: string({
            required_error: "User ID is required"
        })
    }),
    body: object({
        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be minimum of 8 characters"),
        passwordConfirmation: string({
            required_error: "Password confirmation is required"
        })
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
})

export const getSingleUserSchema= object({
    params: object({
        userId: string({
            required_error: "User ID is required"
        })
    })
})

export const updateUserDetailsSchema = object({
    body: object({
        firstName: string().optional(),
        lastName: string().optional(),
        phone: string().optional()
    })
})

export const updateUserPasswordSchema = object({
    body: object({
        currentPassword: string({
            required_error: "Current Password is required"
        }).min(8, "Password must be minimum of 8 characters"),
        newPassword: string({
            required_error: "New Password is required"
        }).min(8, "New Password must be minimum of 8 characters"),
        newPasswordConfirmation: string({
            required_error: "New password confirmation is required"
        })
    }).refine(data => data.newPassword === data.newPasswordConfirmation, {
        message: "New passwords do not match",
        path: ["newPasswordConfirmation"]
    })
})

export const deleteUserSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }),
        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be minimum of 8 characters")
    })
})