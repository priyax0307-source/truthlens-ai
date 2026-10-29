"""
TruthLens AI FastAPI Microservice
Entry point for natural language processing and credibility pattern analysis.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from engine.nlp_engine import HeuristicNLPEngine

app = FastAPI(
    title="TruthLens AI Service",
    description="Microservice for linguistic misinformation risk detection and explainable credibility auditing.",
    version="1.0.0"
)

# Enable CORS for frontend and backend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active Provider Registry
active_engine = HeuristicNLPEngine()

class AnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=5, description="Text of news article, social media post, or claim to audit")
    title: Optional[str] = Field(None, description="Optional title or headline")
    sourceUrl: Optional[str] = Field(None, description="Optional source link or domain")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TruthLens NLP Engine",
        "version": "1.0.0",
        "activeProvider": active_engine.provider_name,
        "mode": active_engine.provider_mode
    }

@app.get("/api/v1/providers")
def list_providers():
    return {
        "active": active_engine.provider_id,
        "available": [
            {
                "id": active_engine.provider_id,
                "name": active_engine.provider_name,
                "mode": active_engine.provider_mode,
                "description": "Rule-based linguistic pattern analysis, emotional charge, and credibility heuristics.",
                "isDefault": True
            },
            {
                "id": "transformer-bert-v1",
                "name": "RoBERTa Claim Verification Engine (Planned)",
                "mode": "ml_transformer",
                "description": "Fine-tuned deep transformer model on FEVER & LIAR benchmark datasets.",
                "isDefault": False,
                "status": "planned"
            }
        ]
    }

@app.post("/api/v1/analyze")
def analyze_content(request: AnalyzeRequest):
    try:
        result = active_engine.analyze(
            content=request.content,
            title=request.title or "",
            source_url=request.sourceUrl or ""
        )
        return {
            "success": True,
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis engine error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
