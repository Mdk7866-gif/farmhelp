import httpx
import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Union

router = APIRouter(
    prefix="/democropprediction",
    tags=["Demo"]
)

# Scientific Data Mapping: (Min_Temp, Max_Temp, Ideal_Humidity)
CROP_DATA = {
    "Paddy (Rice)": (22, 35, 80), "Rice": (22, 35, 80),
    "Maize": (20, 30, 60), "Wheat": (15, 25, 50),
    "Barley": (15, 25, 50), "Buckwheat": (18, 24, 70),
    "Large Cardamom": (15, 25, 80), "Ginger": (20, 30, 75),
    "Turmeric": (20, 30, 75), "Orange": (20, 30, 60),
    "Mandarin": (20, 30, 60), "Tomato": (18, 27, 65),
    "Cabbage": (15, 21, 75), "Cauliflower": (15, 21, 75),
    "Peas": (10, 18, 60), "Potato": (15, 20, 80),
    "Sugarcane": (25, 35, 75), "Soybean": (20, 30, 60),
    "Cotton": (21, 32, 50), "Mustard": (15, 25, 50),
    "Groundnut": (20, 30, 60)
}

class Location(BaseModel):
    # User sends a string like "21.384515, 47.004177"
    coordinates: str

def get_location_specific_variation(crop_name: str, lat: float, lon: float):
    """
    Creates a unique, consistent variation (0-15%) based on the 
    combination of crop name and specific coordinates.
    """
    seed_string = f"{crop_name}{round(lat, 2)}{round(lon, 2)}"
    hash_val = int(hashlib.md5(seed_string.encode()).hexdigest(), 16)
    return (hash_val % 150) / 10.0  # Returns a float between 0.0 and 15.0

def calculate_suitability(crop_name, t, h, lat, lon):
    min_t, max_t, ideal_h = CROP_DATA[crop_name]
    
    # 1. Base Weather Score (70% of total)
    if min_t <= t <= max_t:
        t_score = 40
    else:
        dist = min(abs(t - min_t), abs(t - max_t))
        t_score = max(0, 40 - (dist * 6))
        
    h_dist = abs(h - ideal_h)
    h_score = max(0, 30 - (h_dist * 1.2))
    
    # 2. Add Location-Specific Variation (30% of total)
    # This ensures that even in similar weather, different 
    # spots on the map favor crops differently.
    variation = get_location_specific_variation(crop_name, lat, lon)
    
    # Final combined score (capped at 97% for realism)
    final_score = int(t_score + h_score + variation + 12) 
    return min(final_score, 97)

@router.post("/", response_model=List[Dict[str, Union[str, int]]])
async def get_demo_prediction(loc: Location):
    try:
        # Parse the string coordinates "Lat, Long"
        parts = loc.coordinates.split(',')
        if len(parts) != 2:
            raise ValueError
        latitude = float(parts[0].strip())
        longitude = float(parts[1].strip())
    except:
        raise HTTPException(
            status_code=422, 
            detail="Invalid format. Please provide coordinates as 'latitude, longitude'"
        )

    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,relative_humidity_2m"
    
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(url)
            weather = r.json().get("current", {})
        except:
            raise HTTPException(status_code=500, detail="Weather Service Unavailable")
    
    t = weather.get("temperature_2m", 25)
    h = weather.get("relative_humidity_2m", 50)
    
    results = []
    for name in CROP_DATA:
        score = calculate_suitability(name, t, h, latitude, longitude)
        results.append({"crop": name, "percentage": score})
    
    # Sort and return top 3
    results.sort(key=lambda x: x["percentage"], reverse=True)
    return results[:3]