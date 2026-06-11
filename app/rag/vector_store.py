from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

from app.utils.chunker import load_and_chunk_knowledge_base


class VectorStore:

    def __init__(self):

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        self.index = None
        self.chunks = []

    def build_index(self):

        data = load_and_chunk_knowledge_base()

        self.chunks = data

        texts = []

        for item in data:

            text = (
                f"Document: {item['source']}\n"
                f"{item['text']}"
            )

            texts.append(text)

        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True
        )

        embeddings = embeddings.astype("float32")

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(
            dimension
        )

        self.index.add(embeddings)

        print(
            f"Vector DB built with {len(texts)} chunks"
        )

    def search(
        self,
        query,
        top_k=3
    ):

        # -----------------------------------
        # KEYWORD BOOST
        # -----------------------------------

        query_lower = query.lower()

        keyword_results = []

        for chunk in self.chunks:

            searchable_text = (
                chunk["text"] +
                " " +
                chunk["source"]
            ).lower()

            if query_lower in searchable_text:

                keyword_results.append({
                    "source": chunk["source"],
                    "chunk_id": chunk.get("chunk_id"),
                    "score": 1.0,
                    "text": chunk["text"]
                })

        if len(keyword_results) > 0:

            return keyword_results[:top_k]

        # -----------------------------------
        # SEMANTIC SEARCH
        # -----------------------------------

        query_embedding = self.model.encode(
            [query],
            convert_to_numpy=True
        )

        query_embedding = query_embedding.astype(
            "float32"
        )

        distances, indices = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for rank, idx in enumerate(indices[0]):

            if idx >= len(self.chunks):
                continue

            chunk = self.chunks[idx]

            distance = float(
                distances[0][rank]
            )

            score = round(
                1 / (1 + distance),
                4
            )

            results.append({
                "source": chunk["source"],
                "chunk_id": chunk.get(
                    "chunk_id"
                ),
                "score": score,
                "text": chunk["text"]
            })

        return results


# ----------------------------
# TEST
# ----------------------------

if __name__ == "__main__":

    vs = VectorStore()

    vs.build_index()

    queries = [
        "refund after 20 days",
        "sla",
        "critical issue response time",
        "gdpr",
        "escalation"
    ]

    for q in queries:

        print("\n")
        print("=" * 60)
        print("QUERY:", q)

        results = vs.search(q)

        for r in results:

            print(
                f"\nSource: {r['source']}"
            )

            print(
                f"Score: {r['score']}"
            )

            print(
                f"Chunk: {r['chunk_id']}"
            )

            print(
                r["text"][:250]
            )