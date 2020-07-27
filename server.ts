import express from "express";
import connectToMongoDB from "./src/middleware/connect";
import userRouter from "./src/routes/user";
import authRouter from "./src/routes/auth";

const app: express.Application = express();
connectToMongoDB();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3332;
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
