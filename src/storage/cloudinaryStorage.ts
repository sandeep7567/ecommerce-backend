import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import {
    CloudinaryResourceUrlResponse,
    DestoryCloudImage,
    FileData,
    FileStorage,
} from "../types/storage";
import { Config } from "../config";

export class CloudinaryStorage implements FileStorage {
    constructor() {
        cloudinary.config({
            cloud_name: Config.CLOUDINARY_CLOUD_NAME,
            api_key: Config.CLOUDINARY_API_KEY,
            api_secret: Config.CLOUDINARY_API_SECRET,
            secure: true,
        });
    }

    async upload(data: FileData): Promise<void | UploadApiResponse> {
        const b64String = Buffer.from(data.fileData).toString("base64");
        const dataURI = "data:" + data.fileMimeType + ";base64," + b64String;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            public_id: data.filename,
            folder: "eshop",
        };

        return await cloudinary.uploader.upload(dataURI, {
            ...options,
            resource_type: "image",
        });
    }

    async delete(filename: string): Promise<DestoryCloudImage> {
        try {
            return (await cloudinary.uploader.destroy(filename, {
                resource_type: "image",
            })) as DestoryCloudImage;
        } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
            throw error;
        }
    }

    async getObjectUri(filename: string): Promise<string> {
        const cloud_name = Config.CLOUDINARY_CLOUD_NAME;

        // const secure_url = `https://res.cloudinary.com/${cloud_name}/image/upload/${filename}.fileMimeType`
        const secure_url = `https://res.cloudinary.com/${cloud_name}/image/upload/${filename}.${"webp"}`;

        if (secure_url) {
            return secure_url;
        } else {
            const result = (await cloudinary.api.resource(
                filename,
            )) as CloudinaryResourceUrlResponse;

            return result.secure_url;
        }
    }
}
