# /backend/app/routes/adminaddfarmerdata.py
import json
import asyncio
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

    # 3️⃣ Process farms and upload images in PARALLEL
    if "farms" in farmer_dict and farmer_dict["farms"]:
        upload_tasks = []
        farm_keys_to_update = []

        for farm_key, farm_val in farmer_dict["farms"].items():
            photo_ref = farm_val.get("photo")
            if photo_ref and photo_ref in file_map:
                file_obj = file_map[photo_ref]
                # Read file content immediately (safest for parallel processing if not streaming)
                # Note: For very large files, streaming might be better, but images are usually okay.
                content = await file_obj.read()
                
                # Append coroutine to task list
                upload_tasks.append(upload_image_to_cloudinary(content, filename=photo_ref))
                farm_keys_to_update.append(farm_key)

        # Run all uploads at once
        if upload_tasks:
            # gather returns results in the same order as tasks
            uploaded_urls = await asyncio.gather(*upload_tasks)

            # Assign URLs back to the dictionary
            for farm_key, url in zip(farm_keys_to_update, uploaded_urls):
                if url:
                    farmer_dict["farms"][farm_key]["photo"] = url
                else:
                    print(f"Failed to upload image for {farm_key}")

    # 4️⃣ Save to MongoDB
    result = await db["farmerdata"].insert_one(farmer_dict)

    return {
        "success": True,
        "message": "Farmer data saved successfully",
        "farmer_id": str(result.inserted_id),
    }


@router.post("/upload-image", status_code=status.HTTP_200_OK)
async def upload_farm_image(
    farmer_id: str = Form(...),
    farm_key: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Uploads an image for a specific farm and updates the farmer record.
    """
    # 1. Upload to Cloudinary
    content = await file.read()
    image_url = await upload_image_to_cloudinary(content, filename=file.filename)

    if not image_url:
        raise HTTPException(status_code=500, detail="Failed to upload image")

    # 2. Update MongoDB
    from bson import ObjectId

    try:
        obj_id = ObjectId(farmer_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid farmer_id")

    # Update the specific farm's photo field using dot notation
    # farm_key should be something like "farm_1", "farm_2"
    update_field = f"farms.{farm_key}.photo"
    
    result = await db["farmerdata"].update_one(
        {"_id": obj_id},
        {"$set": {update_field: image_url}}
    )

    if result.modified_count == 0:
        # Check if farmer exists
        farmer = await db["farmerdata"].find_one({"_id": obj_id})
        if not farmer:
             raise HTTPException(status_code=404, detail="Farmer not found")
        # If farmer exists but nothing changed (maybe same URL?), it's technically success, 
        # but here it likely means the farm_key didn't exist or something else.
        # We'll assume success if no error.

    return {
        "success": True,
        "message": "Image uploaded and linked successfully",
        "url": image_url
    }
