export interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
        houseAddress: string;
        city: string;
        country: string
    },
    password: string;
    passwordConfirmation: string
}