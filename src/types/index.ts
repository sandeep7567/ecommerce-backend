import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface StoreI {
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

export type CreateUserT = Pick<
    UserI,
    "firstName" | "lastName" | "email" | "password" | "role"
>;

export interface CreateUserIRequest extends Request {
    body: CreateUserT;
}

export interface AuthPayload extends JwtPayload {
    role: string;
    store: string;
}

export interface RegisterUserRequest extends Request {
    body: Pick<UserI, "email" | "password">;
}
