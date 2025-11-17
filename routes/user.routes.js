import express from 'express';
import { db } from '../db/index.js';
import { UsersTable } from '../models/user.model.js'; 
import { signupPostRequestBodySchema } from '../validation/request.validation.js'
import { hashedPasswordWithSalt } from '../utils/hash.js';
import { getUserByEmail } from '../services/user.service.js'
import e from 'express';

const router = express.Router();

router.post('/signup',  async (req, res) => {
    // const { firstname, lastname, email, password } = req.body;
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error) {
        // return res.status(400).json({ error: validationResult.error.message})
        return res.status(400).json({ error: validationResult.error.format()})
    }

    const { firstname, lastname, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) return res.status(400).json({ error: `users with email ${email} already exists`});
    
    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    hashedPasswordWithSalt(password)

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