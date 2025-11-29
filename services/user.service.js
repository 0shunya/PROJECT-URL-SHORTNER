import { db } from '../db/index.js';
import { UsersTable } from '../models/user.model.js';
import { eq } from "drizzle-orm";

export async function getUserByEmail(email) {
        const [existingUser]  = await db
                                .select({
                                    id: UsersTable.id,
                                    firstname: UsersTable.firstname,
                                    lastname: UsersTable.lastname,
                                    email: UsersTable.email,
                                    salt: UsersTable.salt,
                                    password: UsersTable.password,
                                })
                                .from(UsersTable)
                                .where(eq(UsersTable.email, email));
        return existingUser;
}

export async function shortenURLs(params) {
       const shortCode = code ?? nanoid(6)
    
       const [result] = await db.insert(urlsTable).values({
            shortCode,
            targetURL: url,
            userId: req.user.id,
       }).returning({ id: urlsTable.id, shortCode: urlsTable.shortCode, targetURL: urlsTable.targetURL });
    
       return res.status(201).json({ id: result.id, shortCode: result.shortCode, targetURL: result.targetURL });
}