# /backend/app/models/farmer.py
from typing import Dict, Optional, Any
from pydantic import BaseModel


class FarmModel(BaseModel):
    photo: Optional[str] = None
    location: Optional[str] = None
    sensor_id: Optional[str] = None


class FarmerCreateModel(BaseModel):
    name: Optional[str] = None
    mobile_no: Optional[str] = None
    home_address: Optional[str] = None
    call_language: Optional[str] = None

    # farms can have dynamic keys like farm_1, farm_2, etc.
    farms: Optional[Dict[str, FarmModel]] = None
