from fastapi import APIRouter, Query

from app.rag.vector_store import VectorStore

router = APIRouter()

from fastapi import APIRouter, Query
from app.rag.vector_store import VectorStore

router = APIRouter()

vs = None


def get_vs():
    global vs
    if vs is None:
        vs = VectorStore()
        vs.build_index()
    return vs


@router.get("/rag/search")
def rag_search(q: str = Query(...)):
    vector_store = get_vs()
    results = vector_store.search(q)

    return {
        "query": q,
        "results": results
    }


@router.get("/rag/search")
def rag_search(q: str = Query(..., description="Search query")):
    results = vs.search(q)

    return {
        "query": q,
        "results": results
    }