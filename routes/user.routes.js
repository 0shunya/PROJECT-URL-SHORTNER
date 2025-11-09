import express from 'express';
import { db } from '../db/index.js';
import { UsersTable } from '../models/user.model.js';
import { eq } from 'drizzle-orm'
import { randomBytes, createHmac } from 'crypto';

const router = express.Router();

router.post('/signup',  async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    const [existingUser]  = await db
                            .select({
                                id: UsersTable.id,
                            })
                            .from(UsersTable)
                            .where(eq(UsersTable.email, email));

    if (existingUser) return res.status(400).json({ error: `users with email ${email} already exists`});
    
    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    const [user] = await db.insert(UsersTable).values({
        email,
        firstname,
        lastname,
        salt,
        password: hashedPassword,
    }).returning({ id: UsersTable.id});

    return res.status(201).json({ data: {userId: user.id } })

});

export default router;