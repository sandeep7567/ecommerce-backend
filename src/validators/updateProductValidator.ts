import { body } from "express-validator";

export default [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Delivery price must be a positive number"),
    body("archived").isBoolean().optional(),
    body("featured").isBoolean().optional(),
    body("properties")
        .isArray()
        .withMessage("Properties items must be an array"),
    body("properties.*.name")
        .notEmpty()
        .withMessage("Properties item name is required"),
    body("properties.*.value")
        .notEmpty()
        .withMessage(
            "Menu item value is required and must be a postive number",
        ),
];
