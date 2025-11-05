import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import generateRoutes from './routes/generateRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});


// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//DB
connectDB();


// ROUTES
app.use('/api/auth', userRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/generate', generateRoutes);

app.get('/', (req, res) => {
    res.send('API WORKING');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})