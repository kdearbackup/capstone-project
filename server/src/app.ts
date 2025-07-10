import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

//Middlewre
app.use(express.json());
app.use(cors());

// Define a route for the root URL ("/")
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World from Express!");
});

export default app;
