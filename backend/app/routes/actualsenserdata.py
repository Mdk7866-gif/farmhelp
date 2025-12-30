from fastapi import APIRouter

router = APIRouter(
    prefix="/actual-sensor-data",
    tags=["Actual Sensor Data"]
)

@router.get("/")
async def get_sensor_data():
    return {"message": "it will make a request to thingsspeak api and will get senser data from web,,,,and from that it will return soil moisture and water tank level,,,,,(later we will merge these both enpointpoint /actualsenserdata and actualtwiliocall)"}
