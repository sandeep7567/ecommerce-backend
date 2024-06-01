import { body } from "express-validator";

export const createOrderValidator = [
    // body("storeId")
    //     .notEmpty()
    //     .withMessage("Store_id must be share with parameters")
    //     .isString()
    //     .withMessage("Store_id must be a valid Mongo ID"),
    body("userInfo.firstName")
        .notEmpty()
        .isString()
        .withMessage("firstname must be a string"),
    body("userInfo.lastName")
        .notEmpty()
        .isString()
        .withMessage("lastname must be a string"),
    body("userInfo.email")
        .notEmpty()
        .isEmail()
        .withMessage("it should be a email address"),
    body("address")
        .notEmpty()
        .isString()
        .withMessage("Address must be a filled"),
    body("totalAmount")
        .notEmpty()
        .isNumeric()
        .withMessage("Total amount must be a number"),
    body("orderItems")
        .isArray()
        .notEmpty()
        .withMessage("orderItems must be an array"),
    body("orderItems.*._id")
        .notEmpty()
        .isString()
        .withMessage("product id must be provide"),
    body("orderItems.*.name")
        .notEmpty()
        .isString()
        .withMessage("name must be an needed"),
    body("orderItems.*.price")
        .notEmpty()
        .isNumeric()
        .withMessage("price must be an provide"),
    body("orderItems.*.imageFile")
        .notEmpty()
        .isString()
        .isURL()
        .withMessage("orderItems must be an url"),
    body("orderItems.*.qty")
        .notEmpty()
        .isNumeric()
        .withMessage("qty must add in orderItems"),
    body("orderItems.*.selectedProperty")
        .notEmpty()
        .isObject()
        .withMessage("selectedProperty must be an object"),
];
