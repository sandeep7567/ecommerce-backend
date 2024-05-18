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
    JWKS_URI,
    PRIVATE_KEY,
    ORIGIN_URI,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    MONGO_URL,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
    ORIGIN_URI,
};

Object.freeze(Config);
