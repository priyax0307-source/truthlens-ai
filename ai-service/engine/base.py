"""
Base Analysis Engine Interface
Defines the modular provider contract for TruthLens AI.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAnalysisEngine(ABC):
    @property
    @abstractmethod
    def provider_id(self) -> str:
        """Unique identifier of the provider."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Display name of the provider."""
        pass

    @property
    @abstractmethod
    def provider_mode(self) -> str:
        """Operational mode (e.g., 'demo_heuristic', 'transformer_nlp', 'llm_evaluator')."""
        pass

    @abstractmethod
    def analyze(self, content: str, title: str = "", source_url: str = "") -> Dict[str, Any]:
        """
        Analyze submitted text content for credibility and linguistic risk patterns.
        
        Returns structured analysis result.
        """
        pass
