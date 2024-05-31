import { body } from "express-validator";

export default [
    body("ids").isArray().withMessage("ids must be an array"),
    body("ids.*")
        .isString()
        .withMessage("Each id must be required")
        .notEmpty()
        .withMessage("Properties item name is required"),
];
