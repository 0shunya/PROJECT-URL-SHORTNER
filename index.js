import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import UserRouter from './routes/user.routes.js';
import urlRouter from './routes/url.routes.js';
import { authenticationMiddleware } from './middlewares/auth.middlewares.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
// Allow frontend dev server to call this backend (change origin if frontend port differs)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(authenticationMiddleware)

app.get('/', (req, res) => {
    return res.json({ status: 'server is up and running...' })
});

app.use('/user', UserRouter);
app.use(urlRouter);

app.listen(PORT, () => {
    console.log(`Server is runninng on PORT ${PORT}`);
})