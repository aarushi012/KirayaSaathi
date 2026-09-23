"""
RAG (Retrieval-Augmented Generation) Engine & Vector Store for KirayaSaathi.
Indexes the 6 State Tenancy Knowledge Bases:
- Punjab
- Chandigarh
- Delhi
- Haryana
- Bangalore
- Pune
"""

import os
import re
import math
from typing import List, Dict, Any, Optional
from collections import Counter

KNOWLEDGE_BASE_DIR = os.path.join(os.path.dirname(__file__), "data", "knowledge_base")
ROOT_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

class DocumentChunk:
    def __init__(self, doc_id: str, state: str, section_title: str, content: str):
        self.doc_id = doc_id
        self.state = state.lower().strip()
        self.section_title = section_title.strip()
        self.content = content.strip()
        self.tokens = self._tokenize(f"{section_title} {content}")

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        # Lowercase, clean punctuation, word tokenization
        words = re.findall(r'[a-zA-Z0-9_]+', text.lower())
        stopwords = {
            'the', 'a', 'an', 'and', 'or', 'is', 'in', 'at', 'of', 'on', 'for', 'to', 'with', 
            'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was', 'were', 'will', 'shall'
        }
        return [w for w in words if len(w) > 2 and w not in stopwords]


class StateTenancyRAG:
    """
    Vector Database & Semantic Retrieval System across state rental laws.
    """

    def __init__(self, kb_dirs: Optional[List[str]] = None):
        self.kb_dirs = kb_dirs or [ROOT_DATA_DIR, KNOWLEDGE_BASE_DIR]
        self.chunks: List[DocumentChunk] = []
        self.idf_vocab: Dict[str, float] = {}
        self.is_indexed = False
        self.load_and_index()

    def load_and_index(self):
        """
        Loads all state markdown files, chunks them by sections, and builds the TF-IDF vector index.
        """
        self.chunks.clear()
        seen_doc_keys = set()

        for directory in self.kb_dirs:
            if not os.path.exists(directory):
                continue

            for filename in os.listdir(directory):
                if not filename.endswith(".md") or filename.lower().startswith("readme"):
                    continue

                state_name = filename.replace(".md", "").lower()
                file_path = os.path.join(directory, filename)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        raw_text = f.read()

                    # Chunk by markdown level-2 and level-3 headers e.g. "##" or "###"
                    sections = re.split(r'\n(?=#{2,3}\s+)', raw_text)
                    
                    doc_idx = 0
                    for sec in sections:
                        sec = sec.strip()
                        if not sec:
                            continue
                        
                        lines = sec.split("\n", 1)
                        header = lines[0].replace("#", "").strip()
                        body = lines[1].strip() if len(lines) > 1 else ""

                        if not body and not header:
                            continue

                        chunk_key = f"{state_name}_{header.lower()[:30]}"
                        if chunk_key in seen_doc_keys:
                            continue
                        seen_doc_keys.add(chunk_key)

                        chunk = DocumentChunk(
                            doc_id=f"{state_name}_{doc_idx}",
                            state=state_name,
                            section_title=header,
                            content=body
                        )
                        self.chunks.append(chunk)
                        doc_idx += 1

                except Exception as e:
                    print(f"[RAG] Error loading knowledge base file {filename}: {e}")

        self._build_idf_index()
        self.is_indexed = True

    def _build_idf_index(self):
        """
        Computes Inverse Document Frequency (IDF) for all tokens across chunks.
        """
        num_docs = len(self.chunks)
        if num_docs == 0:
            return

        doc_counts = Counter()
        for chunk in self.chunks:
            unique_tokens = set(chunk.tokens)
            for token in unique_tokens:
                doc_counts[token] += 1

        self.idf_vocab = {
            token: math.log((num_docs + 1) / (count + 1)) + 1.0
            for token, count in doc_counts.items()
        }

    def _score_chunk(self, query_tokens: List[str], chunk: DocumentChunk) -> float:
        """
        Calculates BM25 / TF-IDF hybrid similarity score between query and document chunk.
        """
        if not chunk.tokens or not query_tokens:
            return 0.0

        tf = Counter(chunk.tokens)
        doc_len = len(chunk.tokens)
        score = 0.0

        for q_token in query_tokens:
            if q_token in tf:
                term_tf = tf[q_token] / doc_len
                idf = self.idf_vocab.get(q_token, 1.0)
                score += term_tf * idf

                # Bonus for matches in section title
                if q_token in chunk.section_title.lower():
                    score += idf * 1.8

        return score

    def retrieve_relevant_laws(
        self,
        query: str,
        state: Optional[str] = None,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top-k relevant statutory rules and benchmarks for a given query and state.
        """
        if not self.is_indexed or not self.chunks:
            self.load_and_index()

        query_tokens = DocumentChunk._tokenize(query)
        if not query_tokens:
            return []

        target_state = state.lower().strip() if state else None
        
        # Filter chunks by state if specified (e.g. 'delhi', 'punjab', etc.)
        candidate_chunks = [
            c for c in self.chunks 
            if not target_state or c.state == target_state or target_state in c.state
        ]

        if not candidate_chunks:
            # Fallback to all chunks if state not found
            candidate_chunks = self.chunks

        scored_chunks = []
        for chunk in candidate_chunks:
            score = self._score_chunk(query_tokens, chunk)
            if score > 0.01:
                scored_chunks.append((score, chunk))

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, chunk in scored_chunks[:top_k]:
            results.append({
                "doc_id": chunk.doc_id,
                "state": chunk.state.capitalize(),
                "section_title": chunk.section_title,
                "content": chunk.content,
                "relevance_score": round(score, 4)
            })

        return results

    def retrieve(self, query: str, state: Optional[str] = None, top_k: int = 4) -> List[Dict[str, Any]]:
        """Alias for retrieve_relevant_laws."""
        return self.retrieve_relevant_laws(query=query, state=state, top_k=top_k)

    def get_state_full_summary(self, state: str) -> List[Dict[str, Any]]:
        """
        Returns all indexed sections for a specific jurisdiction.
        """
        state_key = state.lower().strip()
        matched = [c for c in self.chunks if c.state == state_key or state_key in c.state]
        return [
            {
                "section_title": c.section_title,
                "content": c.content
            }
            for c in matched
        ]


# Singleton instance
rag_engine = StateTenancyRAG()
