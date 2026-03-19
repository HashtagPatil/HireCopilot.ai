"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/candidates', candidate_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'HireCopilot API is running.' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
