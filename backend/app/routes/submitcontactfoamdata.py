from datetime import datetime
from fastapi import APIRouter, Depends, status, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
import httpx

from app.db.connection import get_db
from app.models.contact import ContactFormModel
from app.config import get_settings

router = APIRouter(
    prefix="/submitcontactfoamdata",
    tags=["Contact"]
)

settings = get_settings()

async def send_telegram_notification(data: ContactFormModel):
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        print("Telegram credentials not found. Skipping notification.")
        return

    message = (
    f"🔴 CONTACT ALERT\n"
    f"*Name*   : {data.name}\n"
    f"*Mobile* : {data.mobile_no}\n"
    f"*Issue*  : {data.problem}\n"
    f"*Time*   : {datetime.now().strftime('%d %b %Y, %I:%M %p')}"
)





    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()



@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    payload: ContactFormModel,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Submit contact form data.
    Saves to MongoDB and sends a Telegram notification.
    """
    contact_dict = payload.model_dump()

    # Save to MongoDB
    result = await db["contactfoamdata"].insert_one(contact_dict)

    # Send Telegram Notification
    await send_telegram_notification(payload)

    return {
        "success": True,
        "message": "Contact form submitted successfully",
        "contact_id": str(result.inserted_id)
    }
