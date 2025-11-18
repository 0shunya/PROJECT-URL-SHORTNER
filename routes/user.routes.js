import express from 'express';
import { db } from '../db/index.js';
import { UsersTable } from '../models/user.model.js'; 
import { signupPostRequestBodySchema } from '../validation/request.validation.js'
import { hashedPasswordWithSalt, loginPostRequestBodySchema } from '../utils/hash.js';
import { getUserByEmail } from '../services/user.service.js'
import e from 'express';
import { error } from 'console';

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

router.post('/login', async (req, res) => {
   const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

   if(validationResult.error) {
        return res.status(400).json({ error: validationResult.error });
   }

   const {email, password} = validationResult.data

   const user = await getUserByEmail(email)

   if(!user) {
        return res.status(404).json({ error: `User with email ${email} does not exist` })
   }

})


export default router;