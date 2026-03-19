"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_controller_1 = require("../controllers/candidate.controller");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Use multer locally to handle multipart
router.post('/upload', upload_1.upload.single('resume'), candidate_controller_1.uploadResume);
router.patch('/:id/status', candidate_controller_1.updateCandidateStatus);
router.get('/:id/email', candidate_controller_1.generateCandidateEmail);
exports.default = router;
