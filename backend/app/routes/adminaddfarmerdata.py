from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.connection import get_db
from app.models.farmer import FarmerCreateModel

router = APIRouter(
    prefix="/adminaddfarmerdata",
    tags=["Admin"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_farmer_data(
    payload: FarmerCreateModel,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    farmer_dict = payload.model_dump(exclude_none=True)

    if not farmer_dict:
        return {
            "success": False,
            "message": "No data provided"
        }

    result = await db["farmerdata"].insert_one(farmer_dict)

    return {
        "success": True,
        "message": "Farmer data saved successfully",
        "farmer_id": str(result.inserted_id)
    }
