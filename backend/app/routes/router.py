from fastapi import APIRouter
from app.routes import adminaddfarmerdata

api_router = APIRouter()

api_router.include_router(adminaddfarmerdata.router)
