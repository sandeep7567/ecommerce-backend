import { JwtPayload, sign } from "jsonwebtoken";
import { Config } from "../config";
import RefreshTokenModel from "../model/refreshToken";

export class TokenService {
    constructor() {}

    generateAccessToken(payload: JwtPayload) {
        const accessToken = sign(payload, Config.ACCESS_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });
        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async persistRefreshToken(userId: string) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

        const newRefreshToken = new RefreshTokenModel({
            user: userId,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return newRefreshToken.save();
    }

    async deleteRefreshToken(tokenId: string) {
        await RefreshTokenModel.deleteOne({ _id: tokenId });
    }
}
