import { Request } from "express";
import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { AuthCookie, RefreshTokenPayload } from "../types";
import logger from "../config/logger";
import refreshTokenModel from "../model/refreshToken";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
    async isRevoked(req: Request, token) {
        try {
            // const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenModel.findOne({
                _id: (token?.payload as RefreshTokenPayload).id,
                user: token?.payload.sub,
            });

            // if true, then refresh token is revoked, otherwise refresh token is not revoked , and user have means return true;
            return refreshToken === null;
        } catch (err) {
            logger.error("Error while getting refresh token", {
                id: (token?.payload as RefreshTokenPayload).id,
            });
        }
        return true;
    },
});
