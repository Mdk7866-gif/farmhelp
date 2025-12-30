from fastapi import APIRouter

router = APIRouter(
    prefix="/actual-twilio-call",
    tags=["Actual Twilio Call"]
)

@router.get("/")
async def trigger_twilio_call():
    return {"message": "it make a request to thingsspeak api every 15 minutes if that data is critical then it will make  call using my twillo credentials to farmers number based on his languge choosen he will alert him(later we will merge these both enpointpoint /actualsenserdata and actualtwiliocall)"}

