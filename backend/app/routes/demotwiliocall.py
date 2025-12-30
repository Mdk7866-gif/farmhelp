from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from twilio.rest import Client
from app.config import get_settings

router = APIRouter(
    prefix="/twilio-test",
    tags=["Twilio Testing"]
)

settings = get_settings()

class CallTriggerRequest(BaseModel):
    request_code: str

def get_twilio_client():
    """Initializes Twilio client using your settings pattern."""
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

@router.post("/", status_code=status.HTTP_200_OK)
async def trigger_test_call(payload: CallTriggerRequest):
    """
    Endpoint to test Twilio outbound calls.
    If request_code is "1", calls +918511274216.
    """
    # Logic: Hey post 1 to call
    if payload.request_code != "1":
        return {
            "success": False,
            "message": "hey post 1 to call"
        }

    try:
        client = get_twilio_client()
        
        # Trigger the outbound call
        call = client.calls.create(
            twiml='<Response><Say>Hey! this is from farmhelp your watertank is over flowing.</Say></Response>',
            to="+918511274216",
            from_=settings.TWILIO_PHONE_NUMBER
        )

        return {
            "success": True,
            "message": "Call initiated successfully",
            "call_sid": call.sid
        }

    except Exception as e:
        # Catching errors like invalid SID, unverified numbers, etc.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Twilio Error: {str(e)}"
        )