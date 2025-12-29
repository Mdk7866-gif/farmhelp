from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.connection import get_db
from app.models.farmer_auth import FarmerLoginModel

router = APIRouter(
    prefix="/farmerdata",
    tags=["Farmer"]
)

# Helper to fix ObjectId serialization
def str_object_id(data: dict) -> dict:
    if data and "_id" in data:
        data["_id"] = str(data["_id"])
    return data

@router.post("/", response_model=dict)
async def get_farmer_data_by_mobile(
    payload: FarmerLoginModel,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Fetch a farmer's record based on their mobile number.
    Returns the first matching record.
    """
    mobile_no = payload.mobile_no
    
    if not mobile_no:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Mobile number is required"
        )

    # Find one document where 'mobile_no' matches
    farmer = await db["farmerdata"].find_one({"mobile_no": mobile_no})

    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No farmer found with this mobile number"
        )

    return str_object_id(farmer)
