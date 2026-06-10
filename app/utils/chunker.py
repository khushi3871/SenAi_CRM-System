import os

def simple_chunk_text(text, chunk_size=200):
    """
    Simple chunker (we will improve later if needed)
    Splits text into fixed-size chunks
    """
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks


def load_and_chunk_knowledge_base(folder_path="knowledge_base"):
    all_chunks = []

    for filename in os.listdir(folder_path):
        if filename.endswith(".md"):
            file_path = os.path.join(folder_path, filename)

            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()

            chunks = simple_chunk_text(text)

            for chunk in chunks:
                all_chunks.append({
                    "source": filename,
                    "text": chunk
                })

    return all_chunks