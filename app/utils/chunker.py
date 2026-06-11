import os


def chunk_text(
    text,
    chunk_size=400,
    overlap=50
):
    """
    SenAI-compliant chunking:
    - 300-500 tokens
    - overlap support
    """

    words = text.split()

    chunks = []

    start = 0

    while start < len(words):

        end = start + chunk_size

        chunk = " ".join(words[start:end])

        chunks.append(chunk)

        start += (chunk_size - overlap)

    return chunks


def load_and_chunk_knowledge_base(
    folder_path="knowledge_base"
):

    all_chunks = []

    for filename in os.listdir(folder_path):

        if not filename.endswith(".md"):
            continue

        file_path = os.path.join(folder_path, filename)

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as f:
            text = f.read()

        chunks = chunk_text(
            text,
            chunk_size=400,
            overlap=50
        )

        for idx, chunk in enumerate(chunks):

            all_chunks.append({
    "source": filename,
    "chunk_id": idx + 1,
    "text": f"Document: {filename}\n\n{chunk}"
})

    return all_chunks