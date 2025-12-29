from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.db.connection import get_db

router = APIRouter(
    prefix="/admincontactfoamdata",
    tags=["Admin"]
)

# Helper to fix ObjectId serialization
def str_object_id(data: dict) -> dict:
    if data and "_id" in data:
        data["_id"] = str(data["_id"])
    return data

@router.get("/", response_model=List[dict])
async def get_all_contact_data(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get all contact form data from 'contactfoamdata' collection.
    """
    # Fetching all records (limited to 1000)
    contacts = await db["contactfoamdata"].find().to_list(length=1000)
    return [str_object_id(contact) for contact in contacts]

@router.delete("/{id}")
async def delete_contact_data(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Delete a specific contact record by Object ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    result = await db["contactfoamdata"].delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact record not found")

    return {
        "success": True,
        "message": "Contact record deleted successfully"
    }
