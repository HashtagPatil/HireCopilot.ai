import fs from 'fs';
import path from 'path';

export interface VectorEntry {
  id: string; // Document ID (job ID or candidate ID)
  type: 'job' | 'candidate';
  embedding: number[];
  metadata?: any;
}

const STORE_FILE = path.join(__dirname, '../../embeddings_store.json');

export class LocalVectorStore {
  private store: VectorEntry[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(STORE_FILE)) {
      try {
        const data = fs.readFileSync(STORE_FILE, 'utf-8');
        this.store = JSON.parse(data);
      } catch (err) {
        console.error('Error reading vector store file:', err);
        this.store = [];
      }
    } else {
      this.store = [];
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(STORE_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
  }

  public addEmbedding(entry: VectorEntry) {
    // Remove if already exists
    this.store = this.store.filter(e => e.id !== entry.id);
    this.store.push(entry);
    this.save();
  }

  public deleteEmbedding(id: string) {
    this.store = this.store.filter(e => e.id !== id);
    this.save();
  }

  // Cosine Similarity
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public search(queryEmbedding: number[], filterType?: 'job' | 'candidate', limit: number = 5): Array<{entry: VectorEntry, score: number}> {
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

export const vectorStore = new LocalVectorStore();
