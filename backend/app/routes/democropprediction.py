import random
from fastapi import APIRouter
from typing import List, Dict, Union

router = APIRouter(
    prefix="/democropprediction",
    tags=["Demo"]
)

CROPS = [
  "Paddy (Rice)",
  "Rice",
  "Maize",
  "Wheat",
  "Barley",
  "Buckwheat",
  "Large Cardamom",
  "Ginger",
  "Turmeric",
  "Orange",
  "Mandarin",
  "Tomato",
  "Cabbage",
  "Cauliflower",
  "Peas",
  "Potato",
  "Sugarcane",
  "Soybean",
  "Cotton",
  "Mustard",
  "Groundnut"
]

@router.get("/", response_model=List[Dict[str, Union[str, int]]])
def get_demo_prediction():
    """
    Returns 3 random crops with random confidence percentages summing to 100.
    """
    # Select 3 random unique crops
    selected_crops = random.sample(CROPS, 3)
    
    # Generate 3 random numbers that sum to 100
    # We pick 2 random points between 1 and 99 and sort them to create 3 segments
    cuts = sorted(random.sample(range(1, 100), 2))
    
    p1 = cuts[0]
    p2 = cuts[1] - cuts[0]
    p3 = 100 - cuts[1]
    
    percentages = [p1, p2, p3]
    
    results = []
    for crop, score in zip(selected_crops, percentages):
        results.append({
            "crop": crop,
            "percentage": score
        })
    
    # Optional: Sort by percentage descending so the "most likely" is first
    results.sort(key=lambda x: x["percentage"], reverse=True)
    
    return results
