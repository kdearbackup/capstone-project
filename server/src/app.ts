import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { authRouter } from './app/modules/auth/auth.route';
import { predictionRoute } from './app/modules/predictSalary/predictSalary.route';
import { userDetailsRouter } from './app/modules/userDetails/userDetails.route';

const app: Application = express();

//Middlewre
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

//Routes
app.use('/api/auth', authRouter);
app.use('/api/user-details', userDetailsRouter);
app.use('/api/predict', predictionRoute);

// Define a route for the root URL ("/")
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from Express!');
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
