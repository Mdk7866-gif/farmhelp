import random
from fastapi import APIRouter
from typing import Dict

router = APIRouter(
    prefix="/demosenserdata",
    tags=["Demo"]
)

@router.get("/", response_model=Dict[str, int])
def get_demo_sensor_data():
    """
    Returns random sensor data for simulation.
    """
    return {
        "soil_moisture": random.randint(0, 100),
        "water_tank_level": random.randint(0, 100)
    }
