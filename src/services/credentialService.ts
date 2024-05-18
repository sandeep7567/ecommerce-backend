import bcrypt from "bcryptjs";

export class CredentialService {
    constructor() {}

    async comparePassword(
        userPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(userPassword, hashedPassword);
    }

    async hashPassword(password: string): Promise<string> {
        // hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;
    }
}
