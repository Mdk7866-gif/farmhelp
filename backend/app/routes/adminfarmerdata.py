from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.db.connection import get_db
from app.models.farmer import FarmerCreateModel

router = APIRouter(
    prefix="/adminfarmerdata",
    tags=["Admin"]
)

# Helper to fix ObjectId serialization in responses
def str_object_id(data: dict) -> dict:
    if data and "_id" in data:
        data["_id"] = str(data["_id"])
    return data

@router.get("/", response_model=List[dict])
async def get_all_farmers(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get all farmer data. 
    Limited to 100 entries for performance.
    """
    farmers = await db["farmerdata"].find().to_list(length=100)
    return [str_object_id(farmer) for farmer in farmers]

@router.get("/{id}")
async def get_farmer_by_id(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get a single farmer by Object ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")
    
    farmer = await db["farmerdata"].find_one({"_id": ObjectId(id)})
    if not farmer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")
    
    return str_object_id(farmer)

@router.put("/{id}")
async def update_farmer_data(
    id: str, 
    payload: FarmerCreateModel, 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update farmer data by Object ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    # Exclude unset fields to allow partial updates (PATCH-like behavior for convenience)
    update_data = payload.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No data provided for update")

    result = await db["farmerdata"].update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")

    return {
        "success": True,
        "message": "Farmer updated successfully",
        "modified_count": result.modified_count
    }

@router.delete("/{id}")
async def delete_farmer_data(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Delete farmer data by Object ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    result = await db["farmerdata"].delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")

    return {
        "success": True,
        "message": "Farmer deleted successfully"
    }
