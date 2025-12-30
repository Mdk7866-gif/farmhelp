import random
import time
from fastapi import APIRouter
from typing import Dict

router = APIRouter(
    prefix="/demosenserdata",
    tags=["Demo"]
)

# Global states to persist data between API calls
state = {
    "soil_moisture": random.randint(30, 70),
    "water_tank_level": random.randint(50, 90),
    "last_soil_update": 0,
    "last_tank_update": 0
}

def get_gradual_change(current_val, min_val=0, max_val=100, max_step=5):
    """Calculates a small random change to ensure no drastic jumps."""
    change = random.randint(-max_step, max_step)
    new_val = current_val + change
    # Keep value within bounds
    return max(min_val, min(max_val, new_val))

@router.get("/", response_model=Dict[str, int])
def get_demo_sensor_data():
    current_time = time.time()
    
    # Update Soil Moisture every 30 minutes (1800 seconds)
    if current_time - state["last_soil_update"] >= 1800:
        state["soil_moisture"] = get_gradual_change(state["soil_moisture"])
        state["last_soil_update"] = current_time

    # Update Water Tank Level every 60 minutes (3600 seconds)
    if current_time - state["last_tank_update"] >= 3600:
        state["water_tank_level"] = get_gradual_change(state["water_tank_level"])
        state["last_tank_update"] = current_time

    return {
        "soil_moisture": state["soil_moisture"],
        "water_tank_level": state["water_tank_level"]
    }