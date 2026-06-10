from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

from app.utils.chunker import load_and_chunk_knowledge_base


class VectorStore:
    def __init__(self):
        # lightweight but strong embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        self.index = None
        self.chunks = []

    def build_index(self):
        # 1. Load chunks
        data = load_and_chunk_knowledge_base()

        self.chunks = data

        texts = [item["text"] for item in data]

        # 2. Convert to embeddings
        embeddings = self.model.encode(texts)

        embeddings = np.array(embeddings).astype("float32")

        # 3. Create FAISS index
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(embeddings)

        print(f"Vector DB built with {len(texts)} chunks")

    def search(self, query, top_k=3):
        query_embedding = self.model.encode([query])
        query_embedding = np.array(query_embedding).astype("float32")

        distances, indices = self.index.search(query_embedding, top_k)

        results = []

        for idx in indices[0]:
            if idx < len(self.chunks):
                results.append(self.chunks[idx])

        return results

vs = VectorStore()
vs.build_index()

results = vs.search("refund after 20 days")

print(results)