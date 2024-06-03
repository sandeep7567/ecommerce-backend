import { config } from "dotenv";
import path from "path";

config({
    path: path.join(__dirname, `../../.env`),
});

const {
    PORT,
    NODE_ENV,
    MONGO_URL,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
    ORIGIN_URI1,
    ORIGIN_URI2,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,
    PRODUCTION,
    BACKEND_PROD_URI,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    MONGO_URL,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
    ORIGIN_URI1,
    ORIGIN_URI2,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,
    PRODUCTION,
    BACKEND_PROD_URI,
};

Object.freeze(Config);
