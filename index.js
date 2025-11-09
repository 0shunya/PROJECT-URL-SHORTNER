import express from 'express'

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({ status: 'server is up and running...' })
})

app.listen(PORT, () => {
    console.log(`Server is runninng on PORT ${PORT}`);
})