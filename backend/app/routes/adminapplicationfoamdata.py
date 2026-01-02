from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.db.connection import get_db

router = APIRouter(
    prefix="/adminapplicationfoamdata",
    tags=["Admin"]
)

# Helper to fix ObjectId serialization
def str_object_id(data: dict) -> dict:
    if data and "_id" in data:
        data["_id"] = str(data["_id"])
    return data

@router.get("/", response_model=List[dict])
async def get_all_application_data(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get all application form data from 'applicationfoamdata' collection.
    """
    # Fetching all records (limited to 1000 to be safe, but conceptually 'all')
    applications = await db["applicationfoamdata"].find().to_list(length=1000)
    return [str_object_id(app) for app in applications]

@router.delete("/{id}")
async def delete_application_data(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Delete a specific application record by Object ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    result = await db["applicationfoamdata"].delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application record not found")

    return {
        "success": True,
        "message": "Application record deleted successfully"
    }