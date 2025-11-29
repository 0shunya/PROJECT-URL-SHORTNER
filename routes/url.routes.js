import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { db } from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { nanoid } from 'nanoid';
import { ensureAuthentication } from '../middlewares/auth.middlewares.js'
import { and, eq } from "drizzle-orm";

const router = express.Router();



router.post('/shorten', ensureAuthentication, async function (req, res) {
    // const UserID = req.user?.id;

    // if(!UserID) {
    //     return res.status(401).json({ error: 'You must be logged in to access this resource' });
    // }

   const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);

   if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error });
   }

   const { url, code } = validationResult.data

   const shortCode = code ?? nanoid(6)

   const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetURL: url,
        userId: req.user.id,
   }).returning({ id: urlsTable.id, shortCode: urlsTable.shortCode, targetURL: urlsTable.targetURL });

   return res.status(201).json({ id: result.id, shortCode: result.shortCode, targetURL: result.targetURL });
});

router.get('/codes', ensureAuthentication, async function (req, res) {
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, req.user.id));

    return res.json({ codes })
});

router.delete('/:id', ensureAuthentication, async function (req, res) {
    const id = req.params.id;

    await db.delete(urlsTable).where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

    return res.status(201).json({ deleted: true })
})

router.get('/:shortCode', async function (req, res) {
    const code = req.params.shortCode;

    const [result] = await db.select({
        targetURL: urlsTable.targetURL
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

    if(!result) {
        return res.status(404).json({ error: 'Invalid URL' })
    }

    return res.redirect(result.targetURL)
});

export default router;