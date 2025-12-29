from fastapi import APIRouter
from app.routes import adminaddfarmerdata, adminfarmerdata

api_router = APIRouter()

api_router.include_router(adminaddfarmerdata.router)
api_router.include_router(adminfarmerdata.router)
