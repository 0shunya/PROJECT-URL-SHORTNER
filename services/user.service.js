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