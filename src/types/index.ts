import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { Document } from "mongoose";
import { DELIVERY_STATUS } from "../constants";

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
    storeId?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PropertyI {
    _id?: mongoose.Types.ObjectId;
    name: string;
    value: string | string[] | mongoose.Mixed[];
}

export interface ProductI {
    _id?: mongoose.Types.ObjectId;
    storeId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    archived: boolean;
    featured: boolean;
    properties: PropertyI[];
    imageFile: string;
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
export interface CreateProductRequest extends Request {
    body: ProductI;
}
export interface OrderRequest extends Request {
    body: OrderSchemaI;
}

export interface BulkIdsIds {
    ids: string[];
}

export interface DeleteBulkProductRequest extends Request {
    body: BulkIdsIds;
}

export interface StoreRequest extends Request {}
export interface ProductRequest extends Request {}

export interface Filter {
    storeId?: mongoose.Types.ObjectId;
    pageSize?: number;
    pageIndex?: number;
}

export type OrderStatus = keyof typeof DELIVERY_STATUS;
export interface OrderProductData {
    productId: string; // Reference to Product collection
    productName: string;
    qty: number;
    price: number;
}

export enum STATUS {
    PENDING = "PENDING",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export interface OrderSchemaI extends Document {
    productInfo: OrderProductData[];
    orderId: string;
    storeId: string | null;
    userId: string | undefined;
    totalAmount: number;
    purchaseAt: Date;
    status: STATUS;
}
