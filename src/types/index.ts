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
export interface OrderRequestI extends Request {
    body: OrderI;
}

export interface BulkIdsIds {
    ids: string[];
}

export interface DeleteBulkRequest extends Request {
    body: BulkIdsIds;
}

export interface StoreRequest extends Request {}
export interface ProductRequest extends Request {}
export interface OrderRequest extends Request {}

export interface PaginationFilter {
    pageSize?: number;
    pageIndex?: number;
}

export interface Filter extends PaginationFilter {
    storeId?: mongoose.Types.ObjectId;
    orderId?: mongoose.Types.ObjectId;
}

export type OrderStatus = keyof typeof DELIVERY_STATUS;
export interface OrderItemsSchema {
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    imageFile: string;
    selectedProperty: Record<string, string>;
    qty: number;
    price: number;
}

export interface OrderItemsI {
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    image: string;
    property: Record<string, string>;
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
    orderItems: OrderItemsSchema[];
    userInfo: Pick<UserI, "firstName" | "lastName" | "email">;
    userId: mongoose.Schema.Types.ObjectId;
    storeId: mongoose.Schema.Types.ObjectId;
    address: string;
    totalAmount: number;
    totalQty: number;
    purchaseAt: Date;
    status: STATUS;
}

export interface OrderI {
    orderItems: OrderItemsI[];
    userId: string;
    storeId: string;
    address: string;
    totalAmount: number;
    totalQty: number;
}
