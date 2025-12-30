from fastapi import APIRouter
from app.routes import (
    adminaddfarmerdata, 
    adminfarmerdata, 
    submitapplicationfoamdata, 
    submitcontactfoamdata,
    adminapplicationfoamdata,
    admincontactfoamdata,
    farmerdata,
    democropprediction,
    demosenserdata,
    demotwiliocall,
    actualtwiliocall,
    actualcropprediction,
    actualsenserdata
)

api_router = APIRouter()

api_router.include_router(adminaddfarmerdata.router)
api_router.include_router(adminfarmerdata.router)
api_router.include_router(submitapplicationfoamdata.router)
api_router.include_router(submitcontactfoamdata.router)
api_router.include_router(adminapplicationfoamdata.router)
api_router.include_router(admincontactfoamdata.router)
api_router.include_router(farmerdata.router)
api_router.include_router(democropprediction.router)
api_router.include_router(demosenserdata.router)
api_router.include_router(demotwiliocall.router)
api_router.include_router(actualtwiliocall.router)
api_router.include_router(actualcropprediction.router)
api_router.include_router(actualsenserdata.router)

