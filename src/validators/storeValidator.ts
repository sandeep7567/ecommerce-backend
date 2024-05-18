import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        trim: true,
        errorMessage: "Store name is required!",
        notEmpty: true,
    },
});
