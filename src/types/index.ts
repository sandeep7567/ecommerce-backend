import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface StoreI {
    userId: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum Roles {
    ADMIN = "admin",
    CUSTOMER = "customer",
}

export interface UserI {
    _id?: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    password: string;
    role: Roles;
    isPublish: boolean;
    storeId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RefreshTokenI {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    expiresAt: Date;
}

export interface RefreshTokenPayload {
    id: string;
}

export type CreateUserT = Pick<
    UserI,
    "firstName" | "lastName" | "email" | "password" | "role"
>;

export interface CreateUserIRequest extends Request {
    body: CreateUserT;
}

export interface AuthCookie {
    accessToken: string;
    refreshToken: string;
}

export interface AuthPayload extends JwtPayload {
    role: string;
    store: string;
}

export interface LoginUserRequest extends Request {
    body: Pick<UserI, "email" | "password">;
}

export interface Auth {
    sub: string;
    role: string;
    id?: string;
    store: string;
}

export interface AuthRequest extends Request {
    auth: Auth;
}

export interface IStore {
    name: string;
    userId: string;
}

export interface CreateStoreRequest extends Request {
    body: IStore;
}

export interface StoreRequest extends Request {}
