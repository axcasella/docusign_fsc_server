import express from "express";
import cors from "cors";
import connectToMongoDB from "./middleware/connect";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import orgRouter from "./routes/org";

const app: express.Application = express();
connectToMongoDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/org", orgRouter);

const PORT = process.env.PORT || 3332;
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
