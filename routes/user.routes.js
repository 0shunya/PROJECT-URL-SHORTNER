import express from 'express';
import { db } from '../db/index.js';
import { UsersTable } from '../models/user.model.js'; 
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js'
import { hashedPasswordWithSalt } from '../utils/hash.js';
import { createUserToken } from '../utils/token.js';
import { getUserByEmail } from '../services/user.service.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup',  async (req, res) => {
    console.log('Signup route hit');
    console.log('Request body:', req.body);
    // const { firstname, lastname, email, password } = req.body;
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error) {
        // return res.status(400).json({ error: validationResult.error.message})
        return res.status(400).json({ error: validationResult.error.format()})
    }

    const { firstname, lastname, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) return res.status(400).json({ error: `users with email ${email} already exists`});
    
    // const salt = randomBytes(256).toString('hex');
    // const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    const { salt, hashedPassword } = hashedPasswordWithSalt(password);


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

    const { hashedPassword } = hashedPasswordWithSalt(password, user.salt)

   if(user.password !== hashedPassword) {
    return res.status(404).json({ error: 'Invalid Password' })
   }

   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
   createUserToken({ id: user.id })

   return res.json({ token })

})


export default router;