import { body } from "express-validator";

export const createOrderValidator = [
    // Validate productInfo
    body("productInfo").isArray().withMessage("productInfo must be an array"),
    body("productInfo.*.productName")
        .isString()
        .withMessage("productName must be a string"),
    body("productInfo.*.price")
        .isNumeric()
        .withMessage("price must be a number"),
    body("productInfo.*.qty").isNumeric().withMessage("qty must be a number"),

    body("totalAmount")
        .isNumeric()
        .withMessage("Total amount must be a number"),

    body("storeId")
        .optional()
        .isString()
        .withMessage("storeId must be a string"),

    body("userId").optional().isString().withMessage("userId must be a string"),

    body("purchaseAt")
        .isISO8601()
        .toDate()
        .withMessage("purchaseAt must be a valid ISO 8601 date")
        .optional(),

    body("status")
        .isIn(["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
        .withMessage("Invalid status")
        .optional(),
];
