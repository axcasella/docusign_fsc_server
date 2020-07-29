"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("./middleware/connect"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const org_1 = __importDefault(require("./routes/org"));
const app = express_1.default();
connect_1.default();
app.use(express_1.default.json());
app.use("/api/user", user_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/org", org_1.default);
const PORT = process.env.PORT || 3332;
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
