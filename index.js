import express from 'express'
import UserRouter from './routes/user.routes.js'
import { authenticationMiddleware } from './middlewares/auth.middlewares.js'

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
// app.use(authenticationMiddleware)

app.get('/', (req, res) => {
    return res.json({ status: 'server is up and running...' })
})

app.use('/user', UserRouter);

app.listen(PORT, () => {
    console.log(`Server is runninng on PORT ${PORT}`);
})