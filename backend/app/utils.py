import cloudinary
import cloudinary.uploader
from app.config import get_settings

settings = get_settings()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

async def upload_image_to_cloudinary(file_content, filename: str, folder: str = "farmhelp") -> str:
    """
    Uploads a file-like object to Cloudinary and returns the secure URL.
    """
    try:
        # Upload the file
        # Using format=None to let Cloudinary detect or keep original extension
        # public_id could be set if we want to control the filename on Cloudinary
        response = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="image"
        )
        return response.get("secure_url")
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return None
