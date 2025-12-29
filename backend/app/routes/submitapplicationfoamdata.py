from fastapi import APIRouter, Depends, status, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
import httpx

from app.db.connection import get_db
from app.models.application import ApplicationFormModel
from app.config import get_settings
from datetime import datetime

router = APIRouter(
    prefix="/submitapplicationfoamdata",
    tags=["Application"]
)

settings = get_settings()

async def send_telegram_notification(data: ApplicationFormModel):
    """
    Sends a notification to the configured Telegram group.
    """
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    
    if not token or not chat_id:
        print("Telegram credentials not found. Skipping notification.")
        return

    message = (
    f"🟢 APPLICATION RECEIVED\n"
    f"*Name*    : {data.name}\n"
    f"*Mobile*  : {data.mobile_no}\n"
    f"*Address* : {data.home_address}\n"
    f"*Time*    : {datetime.now().strftime('%d %b %Y, %I:%M %p')}"
)





    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
        except httpx.HTTPError as e:
            print(f"Failed to send Telegram notification: {e}")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_application_form(
    payload: ApplicationFormModel,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Submit application form data.
    Saves to MongoDB and sends a Telegram notification.
    """
    application_dict = payload.model_dump()

    # Save to MongoDB
    result = await db["applicationfoamdata"].insert_one(application_dict)

    # Send Telegram Notification (Fire & Forget style mostly, but we await it here to ensure it's sent)
    # If high throughput is needed, this should be a background task.
    # For now, awaiting it is fine.
    await send_telegram_notification(payload)

    return {
        "success": True,
        "message": "Application submitted successfully",
        "application_id": str(result.inserted_id)
    }
