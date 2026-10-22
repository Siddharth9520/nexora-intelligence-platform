from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class Entity(BaseModel):
    id: str = Field(
        ...,
        pattern=r"^ENT-[0-9]{3,}$",
        description="Stable entity identifier, e.g. ENT-001"
    )
    category: str = Field(
        ...,
        description="Entity category (e.g. person, organization, vehicle, digital_asset, financial_account)"
    )
    name: str = Field(..., min_length=1, max_length=150, description="Primary recognized name or label")
    aliases: List[str] = Field(default_factory=list, description="Known aliases, call-signs, or monikers")
    identifiers: Dict[str, str] = Field(
        default_factory=dict,
        description="Synthetic verifiable identifiers (e.g. badge_id, rfid_key, ip_address)"
    )
    attributes: Dict[str, Any] = Field(
        default_factory=dict,
        description="Domain-specific attributes (role, clearance, organization, registration)"
    )
    reliability_score: float = Field(
        default=0.8,
        ge=0.0,
        le=1.0,
        description="Assessed source reliability score between 0.0 and 1.0"
    )
    notes: Optional[str] = Field(default=None, description="Investigative analyst notes")
    case_ids: List[str] = Field(default_factory=list, description="Cases in which this entity is referenced")
