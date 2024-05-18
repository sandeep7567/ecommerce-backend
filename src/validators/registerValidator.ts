import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "Email is required",
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: "Email should be a valid email",
        },
    },
    firstName: {
        errorMessage: "First Name is required",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "Last Name is required",
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: "Password is required",
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: "Password length should be atleast 8 characters",
        },
    },
    // role: {
    //     errorMessage: "Role is required",
    //     notEmpty: true,
    //     trim: true,
    // },
});
