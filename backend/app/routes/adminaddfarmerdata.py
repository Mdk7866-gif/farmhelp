# /backend/app/routes/adminaddfarmerdata.py
import json
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    status,
    File,
    UploadFile,
    Form,
    HTTPException,
)
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.connection import get_db
from app.models.farmer import FarmerCreateModel
from app.utils import upload_image_to_cloudinary


router = APIRouter(
    prefix="/adminaddfarmerdata",
    tags=["Admin"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_farmer_data(
    farmer_data: str = Form(..., description="JSON string of the farmer data"),
    files: List[UploadFile] = File(None, description="List of image files to upload"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Creates a new farmer entry.
    Accepts 'farmer_data' as a JSON string and 'files' as a list of images.
    If 'photo' fields in 'farmer_data' match a filename in 'files',
    it uploads to Cloudinary.
    """

    # 1️⃣ Parse JSON data
    try:
        data_dict = json.loads(farmer_data)
        farmer_model = FarmerCreateModel(**data_dict)
        farmer_dict = farmer_model.model_dump(exclude_none=True)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format in farmer_data")
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    if not farmer_dict:
        return {
            "success": False,
            "message": "No data provided"
        }

    # 2️⃣ Map uploaded files by filename
    file_map = {file.filename: file for file in files} if files else {}

    # 3️⃣ Process farms and upload images
    if "farms" in farmer_dict and farmer_dict["farms"]:
        for farm_key, farm_val in farmer_dict["farms"].items():
            photo_ref = farm_val.get("photo")

            if photo_ref and photo_ref in file_map:
                file_obj = file_map[photo_ref]

                content = await file_obj.read()
                image_url = await upload_image_to_cloudinary(
                    content,
                    filename=photo_ref
                )

                if image_url:
                    farmer_dict["farms"][farm_key]["photo"] = image_url
                else:
                    print(f"Failed to upload image for {farm_key}")

    # 4️⃣ Save to MongoDB
    result = await db["farmerdata"].insert_one(farmer_dict)

    return {
        "success": True,
        "message": "Farmer data saved successfully",
        "farmer_id": str(result.inserted_id),
    }
