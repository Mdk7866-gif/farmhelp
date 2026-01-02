import random
import time
from fastapi import APIRouter, Query
from typing import Dict

router = APIRouter(
    prefix="/demosenserdata",
    tags=["Demo"]
)

# Global states to persist data between API calls for each sensor
# Format: { "sensor_id": { "soil_moisture": int, "water_tank_level": int, "last_soil_update": float, "last_tank_update": float } }
sensor_states: Dict[str, Dict] = {}

def get_gradual_change(current_val, min_val=0, max_val=100, max_step=5):
    """Calculates a small random change to ensure no drastic jumps."""
    change = random.randint(-max_step, max_step)
    new_val = current_val + change
    # Keep value within bounds
    return max(min_val, min(max_val, new_val))

@router.get("/", response_model=Dict[str, int])
def get_demo_sensor_data(sensor_id: str = Query(..., description="The unique ID of the sensor")):
    current_time = time.time()
    
    # Initialize state for this sensor if it doesn't exist
    if sensor_id not in sensor_states:
        sensor_states[sensor_id] = {
            "soil_moisture": random.randint(30, 70),
            "water_tank_level": random.randint(50, 90),
            "last_soil_update": 0,
            "last_tank_update": 0
        }
    
    sensor_data = sensor_states[sensor_id]

    # Update Soil Moisture every 30 minutes (1800 seconds)
    if current_time - sensor_data["last_soil_update"] >= 1800:
        sensor_data["soil_moisture"] = get_gradual_change(sensor_data["soil_moisture"])
        sensor_data["last_soil_update"] = current_time

    # Update Water Tank Level every 60 minutes (3600 seconds)
    if current_time - sensor_data["last_tank_update"] >= 3600:
        sensor_data["water_tank_level"] = get_gradual_change(sensor_data["water_tank_level"])
        sensor_data["last_tank_update"] = current_time

    return {
        "soil_moisture": sensor_data["soil_moisture"],
        "water_tank_level": sensor_data["water_tank_level"]
    }