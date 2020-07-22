import express from "express";

const app: express.Application = express();

const PORT = process.env.PORT || 3332;
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
