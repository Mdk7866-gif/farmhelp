from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.config import get_settings

router = APIRouter()
settings = get_settings()

class AdminLoginRequest(BaseModel):
    password: str

@router.post("/verify-admin")
async def verify_admin(request: AdminLoginRequest):
    if request.password == settings.ADMIN_PANEL_PASSWORD:
        return {"status": "success", "message": "Authenticated"}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")
