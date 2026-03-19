"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorStore = exports.LocalVectorStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const STORE_FILE = path_1.default.join(__dirname, '../../embeddings_store.json');
class LocalVectorStore {
    constructor() {
        this.store = [];
        this.load();
    }
    load() {
        if (fs_1.default.existsSync(STORE_FILE)) {
            try {
                const data = fs_1.default.readFileSync(STORE_FILE, 'utf-8');
                this.store = JSON.parse(data);
            }
            catch (err) {
                console.error('Error reading vector store file:', err);
                this.store = [];
            }
        }
        else {
            this.store = [];
            this.save();
        }
    }
    save() {
        fs_1.default.writeFileSync(STORE_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    }
    addEmbedding(entry) {
        // Remove if already exists
        this.store = this.store.filter(e => e.id !== entry.id);
        this.store.push(entry);
        this.save();
    }
    deleteEmbedding(id) {
        this.store = this.store.filter(e => e.id !== id);
        this.save();
    }
    // Cosine Similarity
    static cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    search(queryEmbedding, filterType, limit = 5) {
        const candidates = filterType ? this.store.filter(e => e.type === filterType) : this.store;
        // Calculate scores
        const scoredCandidates = candidates.map(entry => ({
            entry,
            score: LocalVectorStore.cosineSimilarity(queryEmbedding, entry.embedding),
        }));
        // Sort by descending score
        scoredCandidates.sort((a, b) => b.score - a.score);
        return scoredCandidates.slice(0, limit);
    }
}
exports.LocalVectorStore = LocalVectorStore;
exports.vectorStore = new LocalVectorStore();
