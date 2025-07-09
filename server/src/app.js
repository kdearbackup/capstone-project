import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

//Middlewre
app.use(express.json());
app.use(cors());

console.log(process.env.PORT);

// Define a route for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});

app.get("/users", (req, res) => {});

// app.all("*", (req, res, next) => {
//   res.status(404).json({
//     success: false,
//     status: "fail",
//     message: `Can't find ${req.originalUrl} on this server!`,
//   });
// });

app.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

export default app;
